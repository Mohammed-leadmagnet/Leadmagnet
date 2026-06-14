import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasScaleAccess } from "@/lib/subscription";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const clientId = searchParams.get("clientId");

    if (!userId || !clientId) {
      return NextResponse.json({ error: "Missing userId or clientId" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("icp_profiles")
      .select("*")
      .eq("user_id", userId)
      .eq("client_id", clientId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ icp: data || null });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, clientId, ...icpData } = body;

    if (!userId || !clientId) {
      return NextResponse.json({ error: "Missing userId or clientId" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    // Verify client belongs to user
    const { data: client } = await supabase
      .from("agency_clients")
      .select("id")
      .eq("id", clientId)
      .eq("agency_user_id", userId)
      .maybeSingle();

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Upsert ICP profile
    const { data, error } = await supabase
      .from("icp_profiles")
      .upsert({
        user_id: userId,
        client_id: clientId,
        target_industries: icpData.target_industries || [],
        target_locations: icpData.target_locations || [],
        company_sizes: icpData.company_sizes || [],
        job_titles: icpData.job_titles || [],
        keywords: icpData.keywords || [],
        competitors: icpData.competitors || [],
        excluded_industries: icpData.excluded_industries || [],
        excluded_titles: icpData.excluded_titles || [],
        target_platforms: icpData.target_platforms || [],
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,client_id" })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, icp: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
