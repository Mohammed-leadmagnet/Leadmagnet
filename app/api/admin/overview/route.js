import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const COOKIE_NAME = "leadmagnet_admin_session";

function verifyAdmin(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [username, expiresAt, signature] = parts;

  if (!username || !expiresAt || !signature) return false;
  if (Date.now() > Number(expiresAt)) return false;
  if (username !== process.env.ADMIN_USERNAME) return false;

  const expected = crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "")
    .update(`${username}.${expiresAt}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
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
    ]);

    const recentUsers = users
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8)
      .map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      }));

    return NextResponse.json({
      stats: {
        users: users.length,
        campaigns: campaignsCount,
        leads: leadsCount,
        clients: clientsCount,
        sequences: sequencesCount,
        subscriptions: subscriptionsCount,
      },
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