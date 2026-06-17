import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasScaleAccess } from "@/lib/subscription";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET — list sequences for a client
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const clientId = searchParams.get("clientId");

    if (!userId || !clientId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    const { data: sequences } = await supabase
      .from("email_sequences")
      .select("id, name, status, client_id")
      .eq("user_id", userId)
      .or(`client_id.eq.${clientId},client_id.is.null`)
      .order("created_at", { ascending: false });

    return NextResponse.json({ sequences: sequences || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — add a lead candidate to an email sequence
export async function POST(request) {
  try {
    const { userId, leadId, sequenceId } = await request.json();

    if (!userId || !leadId || !sequenceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    // Get the lead candidate
    const { data: candidate } = await supabase
      .from("lead_candidates").select("*")
      .eq("id", leadId).eq("user_id", userId).single();

    if (!candidate) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (!candidate.email) {
      return NextResponse.json({ error: "Lead has no email address — cannot add to sequence" }, { status: 400 });
    }

    // Verify sequence exists and belongs to user
    const { data: sequence } = await supabase
      .from("email_sequences").select("id, name")
      .eq("id", sequenceId).eq("user_id", userId).single();

    if (!sequence) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    // Check if lead already exists in main leads table (by email or linkedin)
    let existingLead = null;

    if (candidate.email) {
      const { data } = await supabase.from("leads").select("id")
        .eq("user_id", userId).eq("email", candidate.email).maybeSingle();
      existingLead = data;
    }

    if (!existingLead && candidate.linkedin_url) {
      const { data } = await supabase.from("leads").select("id")
        .eq("user_id", userId).eq("linkedin_url", candidate.linkedin_url).maybeSingle();
      existingLead = data;
    }

    // If not in leads table, copy them over
    if (!existingLead) {
      const { data: newLead, error: insertError } = await supabase.from("leads").insert({
        user_id: userId,
        client_id: candidate.client_id,
        name: candidate.name,
        first_name: candidate.first_name,
        last_name: candidate.last_name,
        email: candidate.email,
        company: candidate.company,
        job_title: candidate.title,
        headline: candidate.title,
        industry: candidate.industry,
        location: candidate.location,
        linkedin_url: candidate.linkedin_url,
        website: candidate.website,
        lead_score: "warm",
        lead_score_reason: "Added from Lead Radar — approved for outreach",
      }).select().single();

      if (insertError) throw insertError;
      existingLead = newLead;
    }

    // Update lead candidate status
    await supabase.from("lead_candidates").update({
      status: "in_sequence",
      updated_at: new Date().toISOString(),
    }).eq("id", leadId);

    return NextResponse.json({
      success: true,
      message: `Added to "${sequence.name}" sequence`,
      leadId: existingLead.id,
    });
  } catch (error) {
    console.error("Add to sequence error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
