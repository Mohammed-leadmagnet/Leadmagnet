import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasScaleAccess, consumeLeadRadarCredits } from "@/lib/subscription";
import { calculateLeadScore } from "@/lib/lead-radar";

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

    // Get ICP profile
    const { data: icp } = await supabase
      .from("icp_profiles").select("*")
      .eq("user_id", userId).eq("client_id", clientId).maybeSingle();

    // Get unscored lead candidates
    const { data: leads } = await supabase
      .from("lead_candidates").select("*")
      .eq("user_id", userId).eq("client_id", clientId)
      .in("status", ["new", "approved", "saved"]);

    if (!leads || leads.length === 0) {
      return NextResponse.json({ error: "No leads to score", scored: 0 }, { status: 400 });
    }

    // Log the run
    const { data: run } = await supabase.from("lead_radar_runs").insert({
      user_id: userId, client_id: clientId,
      run_type: "score", status: "running",
      leads_processed: 0, credits_used: 0,
    }).select().single();

    let scored = 0;
    let creditsUsed = 0;

    for (const lead of leads) {
      // Check credits
      const creditResult = await consumeLeadRadarCredits(userId, 1);
      if (!creditResult.success) {
        // Out of credits — stop scoring
        await supabase.from("lead_radar_runs").update({
          status: "completed", leads_processed: scored,
          credits_used: creditsUsed, error_message: "Credits exceeded",
          completed_at: new Date().toISOString(),
        }).eq("id", run.id);

        return NextResponse.json({
          success: true, scored, creditsUsed,
          warning: "Credits exceeded — not all leads were scored",
        });
      }

      creditsUsed++;

      // Calculate score
      const scoreResult = calculateLeadScore(lead, icp);

      // Delete old score if exists
      await supabase.from("lead_scores").delete()
        .eq("lead_candidate_id", lead.id);

      // Insert new score
      await supabase.from("lead_scores").insert({
        user_id: userId,
        client_id: clientId,
        lead_candidate_id: lead.id,
        total_score: scoreResult.total_score,
        temperature: scoreResult.temperature,
        fit_score: scoreResult.fit_score,
        intent_score: scoreResult.intent_score,
        contactability_score: scoreResult.contactability_score,
        freshness_score: scoreResult.freshness_score,
        reasons: scoreResult.reasons,
        recommended_action: scoreResult.recommended_action,
        outreach_angle: "",
      });

      scored++;
    }

    // Update run
    await supabase.from("lead_radar_runs").update({
      status: "completed", leads_processed: scored,
      credits_used: creditsUsed,
      completed_at: new Date().toISOString(),
    }).eq("id", run.id);

    return NextResponse.json({ success: true, scored, creditsUsed });
  } catch (error) {
    console.error("Scoring error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
