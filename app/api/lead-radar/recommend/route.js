import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasScaleAccess, consumeLeadRadarCredits } from "@/lib/subscription";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  try {
    const { userId, leadId } = await request.json();

    if (!userId || !leadId) {
      return NextResponse.json({ error: "Missing userId or leadId" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    // Get lead candidate
    const { data: lead } = await supabase
      .from("lead_candidates").select("*")
      .eq("id", leadId).eq("user_id", userId).single();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Get score
    const { data: score } = await supabase
      .from("lead_scores").select("*")
      .eq("lead_candidate_id", leadId).maybeSingle();

    // Get ICP if available
    let icp = null;
    if (lead.client_id) {
      const { data: icpData } = await supabase
        .from("icp_profiles").select("*")
        .eq("user_id", userId).eq("client_id", lead.client_id).maybeSingle();
      icp = icpData;
    }

    // Consume 1 credit for AI recommendation
    const creditResult = await consumeLeadRadarCredits(userId, 1);
    if (!creditResult.success) {
      return NextResponse.json({ error: "No credits remaining", remaining: 0 }, { status: 403 });
    }

    // Build prompt
    const prompt = `You are an expert B2B outreach strategist for a marketing agency. Analyze this lead and provide actionable recommendations.

LEAD DATA:
- Name: ${lead.name || "Unknown"}
- Title: ${lead.title || "Unknown"}
- Company: ${lead.company || "Unknown"}
- Industry: ${lead.industry || "Unknown"}
- Location: ${lead.location || "Unknown"}
- Email: ${lead.email ? "Available" : "Not available"}
- LinkedIn: ${lead.linkedin_url ? "Available" : "Not available"}
- Source: ${lead.source_type || "Unknown"}

${score ? `SCORE: ${score.total_score}/100 (${score.temperature})
- Fit: ${score.fit_score}/100
- Intent: ${score.intent_score}/100
- Contactability: ${score.contactability_score}/100
- Freshness: ${score.freshness_score}/100` : "SCORE: Not yet scored"}

${icp ? `TARGET ICP:
- Industries: ${icp.target_industries?.join(", ") || "Any"}
- Titles: ${icp.job_titles?.join(", ") || "Any"}
- Locations: ${icp.target_locations?.join(", ") || "Any"}
- Keywords: ${icp.keywords?.join(", ") || "None"}` : ""}

Respond ONLY in this exact JSON format, no other text:
{
  "why_valuable": "One sentence explaining why this lead is worth pursuing or not",
  "outreach_angle": "One sentence suggesting the best approach angle for this specific lead",
  "suggested_message": "A short 2-3 sentence first outreach message tailored to this lead. Keep it natural and not salesy.",
  "risk_warning": "One sentence about any data gaps or risks. Say 'No significant risks' if data is complete.",
  "next_action": "One sentence recommending the immediate next step"
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    let recommendation;
    try {
      recommendation = JSON.parse(text);
    } catch {
      recommendation = {
        why_valuable: "AI analysis unavailable — review lead data manually.",
        outreach_angle: "Consider a personalized introduction based on their role.",
        suggested_message: "Hi, I noticed your work and thought we might be able to help each other. Would you be open to a quick chat?",
        risk_warning: "AI parsing failed — recommendation may be generic.",
        next_action: "Review lead profile and craft a personalized message.",
      };
    }

    // Save outreach angle to score if exists
    if (score && recommendation.outreach_angle) {
      await supabase.from("lead_scores").update({
        outreach_angle: recommendation.outreach_angle,
        recommended_action: recommendation.next_action,
      }).eq("id", score.id);
    }

    return NextResponse.json({
      success: true,
      recommendation,
      creditsRemaining: creditResult.remaining,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
