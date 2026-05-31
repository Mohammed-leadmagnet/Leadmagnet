import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    // Phantombuster sends an array of results
    const leads = Array.isArray(body) ? body : body.results || [];

    if (leads.length === 0) {
      return NextResponse.json({ message: "No leads to process" });
    }

    // Get campaign by container ID
    const containerId = body.containerId || body.agentId || null;

    let campaignId = null;
    let userId = null;

    if (containerId) {
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("id, user_id")
        .eq("container_id", containerId)
        .single();

      if (campaign) {
        campaignId = campaign.id;
        userId = campaign.user_id;
      }
    }

    // Save each lead to Supabase
    const leadsToInsert = leads.map(lead => ({
      campaign_id: campaignId,
      user_id: userId,
      name: `${lead.firstName || ""} ${lead.lastName || ""}`.trim(),
      first_name: lead.firstName || null,
      last_name: lead.lastName || null,
      linkedin_url: lead.profileUrl || lead.linkedInUrl || null,
      headline: lead.headline || null,
      company: lead.companyName || null,
      company_linkedin: lead.companyLinkedInUrl || null,
      job_title: lead.currentJobTitle || lead.title || null,
      industry: lead.companyIndustry || null,
      location: lead.location || null,
      followers: lead.linkedInFollowers || null,
      email: lead.professionalEmail || lead.email || null,
      phone: lead.phoneNumbers || null,
      website: lead.websites || null,
      commented_at: lead.commentedAt || new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("leads")
      .upsert(leadsToInsert, { onConflict: "linkedin_url" });

    if (error) throw error;

    // Update campaign leads count
    if (campaignId) {
      await supabase
        .from("campaigns")
        .update({ leads_count: leads.length })
        .eq("id", campaignId);
    }

    return NextResponse.json({ success: true, count: leads.length });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}