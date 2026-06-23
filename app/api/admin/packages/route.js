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

function cleanFeatures(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);
}

export async function GET(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("pricing_plans")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Could not load packages." },
      { status: 500 }
    );
  }

  return NextResponse.json({ plans: data || [] });
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const insertData = {
      plan_key: String(body.plan_key || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),
      name: String(body.name || "").trim(),
      display_price: String(body.display_price || "").trim(),
      period: String(body.period || "/ month").trim(),
      description: String(body.description || "").trim(),
      features: cleanFeatures(body.features),
      popular: Boolean(body.popular),
      active: body.active !== false,
      sort_order: Number(body.sort_order || 1),
      stripe_price_id: String(body.stripe_price_id || "").trim() || null,
    };

    if (!insertData.plan_key || !insertData.name || !insertData.display_price) {
      return NextResponse.json(
        { error: "Package key, name, and price are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pricing_plans")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not create package." },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: data });
  } catch {
    return NextResponse.json(
      { error: "Could not create package." },
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
        { error: "Package ID is required." },
        { status: 400 }
      );
    }

    const updateData = {
      plan_key: String(body.plan_key || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),
      name: String(body.name || "").trim(),
      display_price: String(body.display_price || "").trim(),
      period: String(body.period || "/ month").trim(),
      description: String(body.description || "").trim(),
      features: cleanFeatures(body.features),
      popular: Boolean(body.popular),
      active: Boolean(body.active),
      sort_order: Number(body.sort_order || 1),
      stripe_price_id: String(body.stripe_price_id || "").trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (!updateData.plan_key || !updateData.name || !updateData.display_price) {
      return NextResponse.json(
        { error: "Package key, name, and price are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("pricing_plans")
      .update(updateData)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not update package." },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: data });
  } catch {
    return NextResponse.json(
      { error: "Could not update package." },
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
        { error: "Package ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("pricing_plans")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not delete package." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete package." },
      { status: 500 }
    );
  }
}