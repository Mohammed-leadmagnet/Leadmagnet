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

async function countTable(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count || 0;
}

async function getRecentRows(table, columns) {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) return [];
  return data || [];
}

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

function getMonthKey(dateValue) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getLastMonths(count = 6) {
  const months = [];
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    );
  }

  return months;
}

function isWithinDays(dateValue, days) {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  return diff <= days * 24 * 60 * 60 * 1000;
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

export async function GET(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const users = authUsers?.users || [];

    const [
      campaignsCount,
      leadsCount,
      clientsCount,
      sequencesCount,
      subscriptionsCount,
      recentCampaigns,
      recentSubscriptions,
      subscriptionsResult,
      expensesResult,
      pricingMap,
    ] = await Promise.all([
      countTable("campaigns"),
      countTable("leads"),
      countTable("agency_clients"),
      countTable("email_sequences"),
      countTable("subscriptions"),
      getRecentRows(
        "campaigns",
        "id,user_id,post_url,status,platform,created_at"
      ),
      getRecentRows(
        "subscriptions",
        "id,user_id,plan,status,created_at"
      ),
      supabase
        .from("subscriptions")
        .select("id,user_id,plan,status,created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("business_expenses")
        .select("*")
        .order("created_at", { ascending: false }),
      getPricingMap(),
    ]);

    const subscriptions = subscriptionsResult.data || [];
    const expenses = expensesResult.data || [];

    const userEmailMap = users.reduce((acc, user) => {
      acc[user.id] = user.email;
      return acc;
    }, {});

    const recentUsers = users
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8)
      .map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      }));

    const joinedToday = users.filter(user => isWithinDays(user.created_at, 1)).length;
    const joined7Days = users.filter(user => isWithinDays(user.created_at, 7)).length;
    const joined30Days = users.filter(user => isWithinDays(user.created_at, 30)).length;

    const lastMonths = getLastMonths(6);

    const usersByMonth = lastMonths.map(monthKey => ({
      month: monthKey,
      label: getMonthLabel(monthKey),
      users: users.filter(user => getMonthKey(user.created_at) === monthKey).length,
    }));

    const activeSubscriptions = subscriptions.filter(
      sub => String(sub.status || "").toLowerCase() === "active"
    );

    const paidPeople = activeSubscriptions.map(sub => {
      const planKey = sub.plan;
      const plan = pricingMap[planKey] || {
        name: planKey || "Unknown",
        amount: 0,
        display_price: "€0",
      };

      return {
        id: sub.id,
        user_id: sub.user_id,
        email: userEmailMap[sub.user_id] || "Unknown user",
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

    const activeExpenses = expenses.filter(isExpenseActiveThisMonth);

    const monthlyExpenses = activeExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount_eur || 0),
      0
    );

    const netMonthly = monthlyRevenue - monthlyExpenses;

    const planBreakdownMap = paidPeople.reduce((acc, person) => {
      const key = person.plan_key || "unknown";

      if (!acc[key]) {
        acc[key] = {
          plan_key: key,
          plan_name: person.plan_name || key,
          count: 0,
          revenue: 0,
        };
      }

      acc[key].count += 1;
      acc[key].revenue += Number(person.amount_eur || 0);

      return acc;
    }, {});

    const planBreakdown = Object.values(planBreakdownMap).sort(
      (a, b) => b.revenue - a.revenue
    );

    const conversionRate = users.length
      ? Math.round((paidPeople.length / users.length) * 100)
      : 0;

    return NextResponse.json({
      stats: {
        users: users.length,
        campaigns: campaignsCount,
        leads: leadsCount,
        clients: clientsCount,
        sequences: sequencesCount,
        subscriptions: subscriptionsCount,
      },
      userAnalysis: {
        total_users: users.length,
        joined_today: joinedToday,
        joined_7_days: joined7Days,
        joined_30_days: joined30Days,
        users_by_month: usersByMonth,
        conversion_rate: conversionRate,
      },
      businessAnalysis: {
        paid_people_count: paidPeople.length,
        monthly_revenue: monthlyRevenue,
        monthly_expenses: monthlyExpenses,
        net_monthly: netMonthly,
        active_expenses_count: activeExpenses.length,
        plan_breakdown: planBreakdown,
      },
      paidPeople,
      recentUsers,
      recentCampaigns,
      recentSubscriptions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Could not load admin data." },
      { status: 500 }
    );
  }
}