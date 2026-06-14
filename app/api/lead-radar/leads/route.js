import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasScaleAccess } from "@/lib/subscription";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET — fetch lead candidates with scores
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
      .from("lead_candidates")
      .select("*, lead_scores(*)")
      .eq("user_id", userId)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ leads: data || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update lead status
export async function PATCH(request) {
  try {
    const { userId, leadId, status } = await request.json();

    if (!userId || !leadId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const validStatuses = ["new", "approved", "in_sequence", "saved", "dismissed", "converted", "duplicate"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    // Verify ownership
    const { data: lead } = await supabase
      .from("lead_candidates").select("id")
      .eq("id", leadId).eq("user_id", userId).maybeSingle();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("lead_candidates")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
