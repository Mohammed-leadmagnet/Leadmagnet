import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function scoreLead(lead) {
  try {
    const prompt = `You are a B2B lead scoring expert for a marketing agency lead generation platform. Score this lead based on their likelihood of being a valuable prospect for a marketing agency.

Lead data:
- Name: ${lead.name || "Unknown"}
- Job Title: ${lead.job_title || "Unknown"}
- Headline: ${lead.headline || "Unknown"}
- Company: ${lead.company || "Unknown"}
- Industry: ${lead.industry || "Unknown"}
- Location: ${lead.location || "Unknown"}
- Followers: ${lead.followers || "Unknown"}

Score as exactly one of: hot, warm, or cold

hot = Decision maker (CEO, CMO, founder, director, head of marketing, VP, owner) at a company that likely needs marketing services.
warm = Mid-level professional (manager, coordinator, specialist) with some buying influence.
cold = Junior role (intern, assistant, student), irrelevant industry, or not enough data.

Respond ONLY in this exact JSON format, nothing else:
{"score":"hot","reason":"One sentence explanation"}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], max_tokens: 100, temperature: 0.3 }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    const parsed = JSON.parse(text);
    if (["hot", "warm", "cold"].includes(parsed.score)) return { score: parsed.score, reason: parsed.reason || "" };
    return { score: "cold", reason: "Could not determine lead quality" };
  } catch (err) {
    console.error("Lead scoring error:", err);
    return { score: "cold", reason: "Scoring unavailable" };
  }
}

export async function POST(request) {
  try {
    // Verify webhook secret
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret") || request.headers.get("x-webhook-secret");

    if (process.env.WEBHOOK_SECRET && secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const leads = Array.isArray(body) ? body : body.results || [];

    if (leads.length === 0) return NextResponse.json({ message: "No leads to process" });

    const containerId = body.containerId || body.agentId || null;
    let campaignId = null, userId = null, clientId = null;

    if (containerId) {
      const { data: campaign } = await supabase.from("campaigns").select("id, user_id, client_id").eq("container_id", containerId).single();
      if (campaign) { campaignId = campaign.id; userId = campaign.user_id; clientId = campaign.client_id || null; }
    }

    const leadsToInsert = [];
    const leadCandidates = [];

    for (const lead of leads) {
      const leadData = {
        campaign_id: campaignId, user_id: userId, client_id: clientId,
        name: `${lead.firstName || ""} ${lead.lastName || ""}`.trim(),
        first_name: lead.firstName || null, last_name: lead.lastName || null,
        linkedin_url: lead.profileUrl || lead.linkedInUrl || null,
        headline: lead.headline || null, company: lead.companyName || null,
        company_linkedin: lead.companyLinkedInUrl || null,
        job_title: lead.currentJobTitle || lead.title || null,
        industry: lead.companyIndustry || null, location: lead.location || null,
        followers: lead.linkedInFollowers || null,
        email: lead.professionalEmail || lead.email || null,
        phone: lead.phoneNumbers || null, website: lead.websites || null,
        commented_at: lead.commentedAt || new Date().toISOString(),
      };
      const { score, reason } = await scoreLead(leadData);
      leadData.lead_score = score;
      leadData.lead_score_reason = reason;
      leadsToInsert.push(leadData);

      // Also prepare for Lead Radar (lead_candidates table)
      if (userId && clientId) {
        leadCandidates.push({
          user_id: userId,
          client_id: clientId,
          source_type: "campaign_engagement",
          source_name: "Phantombuster webhook",
          name: leadData.name,
          first_name: lead.firstName || null,
          last_name: lead.lastName || null,
          title: lead.currentJobTitle || lead.title || null,
          company: lead.companyName || null,
          industry: lead.companyIndustry || null,
          location: lead.location || null,
          email: lead.professionalEmail || lead.email || null,
          website: lead.websites || null,
          linkedin_url: lead.profileUrl || lead.linkedInUrl || null,
          company_domain: lead.companyLinkedInUrl || null,
          status: "new",
        });
      }
    }

    // Insert into leads table
    const { error } = await supabase.from("leads").upsert(leadsToInsert, { onConflict: "linkedin_url" });
    if (error) throw error;

    // Auto-sync to Lead Radar (lead_candidates)
    if (leadCandidates.length > 0) {
      try {
        // Get existing to avoid duplicates
        const linkedinUrls = leadCandidates.map(l => l.linkedin_url).filter(Boolean);
        const emails = leadCandidates.map(l => l.email).filter(Boolean);

        let existingUrls = new Set();
        let existingEmails = new Set();

        if (linkedinUrls.length > 0) {
          const { data: existing } = await supabase.from("lead_candidates").select("linkedin_url").eq("user_id", userId).eq("client_id", clientId).in("linkedin_url", linkedinUrls);
          existingUrls = new Set((existing || []).map(e => e.linkedin_url?.toLowerCase()).filter(Boolean));
        }

        if (emails.length > 0) {
          const { data: existing } = await supabase.from("lead_candidates").select("email").eq("user_id", userId).eq("client_id", clientId).in("email", emails);
          existingEmails = new Set((existing || []).map(e => e.email?.toLowerCase()).filter(Boolean));
        }

        const newCandidates = leadCandidates.filter(l => {
          if (l.linkedin_url && existingUrls.has(l.linkedin_url.toLowerCase())) return false;
          if (l.email && existingEmails.has(l.email.toLowerCase())) return false;
          return true;
        });

        if (newCandidates.length > 0) {
          await supabase.from("lead_candidates").insert(newCandidates);
        }
      } catch (syncErr) {
        console.error("Lead Radar sync error (non-fatal):", syncErr.message);
      }
    }

    // Update campaign lead count
    if (campaignId) {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("campaign_id", campaignId);
      await supabase.from("campaigns").update({ leads_count: count }).eq("id", campaignId);
    }

    const hot = leadsToInsert.filter(l => l.lead_score === "hot").length;
    const warm = leadsToInsert.filter(l => l.lead_score === "warm").length;
    const cold = leadsToInsert.filter(l => l.lead_score === "cold").length;

    return NextResponse.json({ success: true, count: leadsToInsert.length, scores: { hot, warm, cold }, leadRadarSynced: leadCandidates.length });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
