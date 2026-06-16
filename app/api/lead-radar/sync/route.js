import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasScaleAccess } from "@/lib/subscription";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  try {
    const { userId, clientId } = await request.json();

    if (!userId || !clientId) {
      return NextResponse.json({ error: "Missing userId or clientId" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    // Verify client ownership
    const { data: client } = await supabase
      .from("agency_clients").select("id")
      .eq("id", clientId).eq("agency_user_id", userId).maybeSingle();

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get all campaign leads for this client
    const { data: campaignLeads } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId)
      .eq("client_id", clientId);

    if (!campaignLeads || campaignLeads.length === 0) {
      return NextResponse.json({ success: true, synced: 0, message: "No campaign leads to sync" });
    }

    // Get existing lead candidates to avoid duplicates
    const { data: existing } = await supabase
      .from("lead_candidates")
      .select("email, linkedin_url")
      .eq("user_id", userId)
      .eq("client_id", clientId);

    const existingEmails = new Set((existing || []).map(e => e.email?.toLowerCase()).filter(Boolean));
    const existingLinkedIn = new Set((existing || []).map(e => e.linkedin_url?.toLowerCase()).filter(Boolean));

    const toInsert = [];

    for (const lead of campaignLeads) {
      // Skip if already exists by email or LinkedIn URL
      if (lead.email && existingEmails.has(lead.email.toLowerCase())) continue;
      if (lead.linkedin_url && existingLinkedIn.has(lead.linkedin_url.toLowerCase())) continue;

      toInsert.push({
        user_id: userId,
        client_id: clientId,
        source_type: "campaign_engagement",
        source_name: "Campaign sync",
        name: lead.name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unknown",
        first_name: lead.first_name || null,
        last_name: lead.last_name || null,
        title: lead.job_title || null,
        company: lead.company || null,
        industry: lead.industry || null,
        location: lead.location || null,
        email: lead.email || null,
        website: lead.website || null,
        linkedin_url: lead.linkedin_url || null,
        instagram_handle: null,
        company_domain: lead.company_linkedin || null,
        status: "new",
      });
    }

    if (toInsert.length === 0) {
      return NextResponse.json({ success: true, synced: 0, message: "All campaign leads already synced" });
    }

    const { error } = await supabase.from("lead_candidates").insert(toInsert);
    if (error) throw error;

    return NextResponse.json({
      success: true,
      synced: toInsert.length,
      total: campaignLeads.length,
      skipped: campaignLeads.length - toInsert.length,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
