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
    // Verify webhook secret via query param or header
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
    }

    const { error } = await supabase.from("leads").upsert(leadsToInsert, { onConflict: "linkedin_url" });
    if (error) throw error;

    if (campaignId) {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("campaign_id", campaignId);
      await supabase.from("campaigns").update({ leads_count: count }).eq("id", campaignId);
    }

    const hot = leadsToInsert.filter(l => l.lead_score === "hot").length;
    const warm = leadsToInsert.filter(l => l.lead_score === "warm").length;
    const cold = leadsToInsert.filter(l => l.lead_score === "cold").length;

    return NextResponse.json({ success: true, count: leadsToInsert.length, scores: { hot, warm, cold } });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
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
    // Verify webhook secret via query param or header
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
    }

    const { error } = await supabase.from("leads").upsert(leadsToInsert, { onConflict: "linkedin_url" });
    if (error) throw error;

    if (campaignId) {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("campaign_id", campaignId);
      await supabase.from("campaigns").update({ leads_count: count }).eq("id", campaignId);
    }

    const hot = leadsToInsert.filter(l => l.lead_score === "hot").length;
    const warm = leadsToInsert.filter(l => l.lead_score === "warm").length;
    const cold = leadsToInsert.filter(l => l.lead_score === "cold").length;

    return NextResponse.json({ success: true, count: leadsToInsert.length, scores: { hot, warm, cold } });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
