import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const COOKIE_NAME = "leadmagnet_admin_session";

function verifyAdmin(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return false;

  const parts = token.split("|");
  if (parts.length !== 3) return false;

  const [encodedUsername, expiresAt, signature] = parts;

  if (!encodedUsername || !expiresAt || !signature) return false;
  if (Date.now() > Number(expiresAt)) return false;

  const username = decodeURIComponent(encodedUsername);

  if (username !== process.env.ADMIN_USERNAME) return false;

  const expected = crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "")
    .update(`${username}|${expiresAt}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function parseEuro(value) {
  if (value === null || value === undefined) return 0;

  const clean = String(value)
    .replace("€", "")
    .replace("/ month", "")
    .replace(",", ".")
    .trim();

  const number = Number(clean);
  return Number.isFinite(number) ? number : 0;
}

function monthDifference(startDate, currentDate) {
  const start = new Date(startDate);
  const current = new Date(currentDate);

  return (
    (current.getFullYear() - start.getFullYear()) * 12 +
    (current.getMonth() - start.getMonth())
  );
}

function isExpenseActiveThisMonth(expense) {
  if (!expense.active) return false;
  if (expense.is_forever) return true;

  const diff = monthDifference(expense.start_month, new Date());

  return diff >= 0 && diff < Number(expense.duration_months || 0);
}

async function getUserEmailMap() {
  const { data } = await supabase.auth.admin.listUsers();
  const users = data?.users || [];

  return users.reduce((acc, user) => {
    acc[user.id] = user.email;
    return acc;
  }, {});
}

async function getPricingMap() {
  const { data } = await supabase
    .from("pricing_plans")
    .select("plan_key,name,display_price");

  const plans = data || [];

  return plans.reduce((acc, plan) => {
    acc[plan.plan_key] = {
      name: plan.name,
      amount: parseEuro(plan.display_price),
      display_price: plan.display_price,
    };

    return acc;
  }, {});
}

async function loadDashboardData() {
  const [emailMap, pricingMap, expensesResult, subscriptionsResult] =
    await Promise.all([
      getUserEmailMap(),
      getPricingMap(),
      supabase
        .from("business_expenses")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("subscriptions")
        .select("id,user_id,plan,status,created_at")
        .order("created_at", { ascending: false }),
    ]);

  const expenses = expensesResult.data || [];
  const subscriptions = subscriptionsResult.data || [];

  const activeExpenses = expenses.filter(isExpenseActiveThisMonth);

  const monthlyExpenses = activeExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount_eur || 0),
    0
  );

  const paidSubscriptions = subscriptions.filter(
    sub => String(sub.status || "").toLowerCase() === "active"
  );

  const paidPeople = paidSubscriptions.map(sub => {
    const planKey = sub.plan;
    const plan = pricingMap[planKey] || {
      name: planKey || "Unknown",
      amount: 0,
      display_price: "€0",
    };

    return {
      id: sub.id,
      user_id: sub.user_id,
      email: emailMap[sub.user_id] || "Unknown user",
      plan_key: planKey,
      plan_name: plan.name,
      amount_eur: plan.amount,
      display_price: plan.display_price,
      status: sub.status,
      created_at: sub.created_at,
    };
  });

  const monthlyRevenue = paidPeople.reduce(
    (sum, person) => sum + Number(person.amount_eur || 0),
    0
  );

  const netMonthly = monthlyRevenue - monthlyExpenses;

  return {
    expenses,
    activeExpenses,
    paidPeople,
    stats: {
      total_expenses_count: expenses.length,
      active_expenses_count: activeExpenses.length,
      paid_people_count: paidPeople.length,
      monthly_revenue: monthlyRevenue,
      monthly_expenses: monthlyExpenses,
      net_monthly: netMonthly,
    },
  };
}

export async function GET(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await loadDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Could not load business dashboard." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const insertData = {
      name: String(body.name || "").trim(),
      amount_eur: Number(body.amount_eur || 0),
      start_month: body.start_month || new Date().toISOString().slice(0, 10),
      duration_months: body.is_forever
        ? null
        : Number(body.duration_months || 1),
      is_forever: Boolean(body.is_forever),
      notes: String(body.notes || "").trim() || null,
      active: body.active !== false,
    };

    if (!insertData.name) {
      return NextResponse.json(
        { error: "Expense name is required." },
        { status: 400 }
      );
    }

    if (!insertData.amount_eur || insertData.amount_eur <= 0) {
      return NextResponse.json(
        { error: "Expense amount must be more than 0." },
        { status: 400 }
      );
    }

    if (!insertData.is_forever && insertData.duration_months <= 0) {
      return NextResponse.json(
        { error: "Duration must be at least 1 month." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("business_expenses")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not create expense." },
        { status: 500 }
      );
    }

    return NextResponse.json({ expense: data });
  } catch {
    return NextResponse.json(
      { error: "Could not create expense." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Expense ID is required." },
        { status: 400 }
      );
    }

    const updateData = {
      name: String(body.name || "").trim(),
      amount_eur: Number(body.amount_eur || 0),
      start_month: body.start_month,
      duration_months: body.is_forever
        ? null
        : Number(body.duration_months || 1),
      is_forever: Boolean(body.is_forever),
      notes: String(body.notes || "").trim() || null,
      active: Boolean(body.active),
      updated_at: new Date().toISOString(),
    };

    if (!updateData.name) {
      return NextResponse.json(
        { error: "Expense name is required." },
        { status: 400 }
      );
    }

    if (!updateData.amount_eur || updateData.amount_eur <= 0) {
      return NextResponse.json(
        { error: "Expense amount must be more than 0." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("business_expenses")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not update expense." },
        { status: 500 }
      );
    }

    return NextResponse.json({ expense: data });
  } catch {
    return NextResponse.json(
      { error: "Could not update expense." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("business_expenses")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not delete expense." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete expense." },
      { status: 500 }
    );
  }
}