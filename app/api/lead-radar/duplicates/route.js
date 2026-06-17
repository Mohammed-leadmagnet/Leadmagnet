import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasScaleAccess } from "@/lib/subscription";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// POST — check duplicates for a single lead or batch
export async function POST(request) {
  try {
    const { userId, clientId, leadId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const hasAccess = await hasScaleAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Scale plan required" }, { status: 403 });
    }

    // Check duplicates for a specific lead
    if (leadId) {
      const { data: lead } = await supabase
        .from("lead_candidates").select("*")
        .eq("id", leadId).eq("user_id", userId).single();

      if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

      const duplicates = await findDuplicates(userId, lead, clientId);
      return NextResponse.json({ success: true, duplicates });
    }

    // Check all leads for a client
    if (clientId) {
      const { data: leads } = await supabase
        .from("lead_candidates").select("*")
        .eq("user_id", userId).eq("client_id", clientId)
        .not("status", "eq", "duplicate");

      if (!leads || leads.length === 0) {
        return NextResponse.json({ success: true, duplicateCount: 0, duplicates: [] });
      }

      const allDuplicates = [];

      for (const lead of leads) {
        const dups = await findDuplicates(userId, lead, clientId);
        if (dups.length > 0) {
          allDuplicates.push({ lead, duplicates: dups });

          // Save to duplicate_lead_matches
          for (const dup of dups) {
            await supabase.from("duplicate_lead_matches").upsert({
              user_id: userId,
              client_id: clientId,
              lead_candidate_id: lead.id,
              matched_lead_id: dup.id,
              match_type: dup.match_type,
              confidence: dup.confidence,
              action_taken: "pending",
            }, { onConflict: "lead_candidate_id,matched_lead_id" }).select();
          }
        }
      }

      return NextResponse.json({
        success: true,
        duplicateCount: allDuplicates.length,
        duplicates: allDuplicates.slice(0, 50),
      });
    }

    return NextResponse.json({ error: "Provide leadId or clientId" }, { status: 400 });
  } catch (error) {
    console.error("Duplicate check error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function findDuplicates(userId, lead, currentClientId) {
  const duplicates = [];

  // 1. Check by email (exact match, different client or same client different lead)
  if (lead.email) {
    const { data: emailMatches } = await supabase
      .from("lead_candidates").select("id, name, email, company, client_id")
      .eq("user_id", userId).eq("email", lead.email)
      .neq("id", lead.id);

    if (emailMatches) {
      emailMatches.forEach(m => {
        duplicates.push({
          id: m.id, name: m.name, email: m.email, company: m.company,
          client_id: m.client_id,
          match_type: "email",
          confidence: 100,
          reason: `Same email: ${lead.email}`,
          cross_client: m.client_id !== currentClientId,
        });
      });
    }

    // Also check main leads table
    const { data: mainEmailMatches } = await supabase
      .from("leads").select("id, name, email, company, client_id")
      .eq("user_id", userId).eq("email", lead.email);

    if (mainEmailMatches) {
      mainEmailMatches.forEach(m => {
        duplicates.push({
          id: m.id, name: m.name, email: m.email, company: m.company,
          client_id: m.client_id,
          match_type: "email_main_leads",
          confidence: 95,
          reason: `Same email in campaign leads: ${lead.email}`,
          cross_client: m.client_id !== currentClientId,
        });
      });
    }
  }

  // 2. Check by LinkedIn URL (exact match)
  if (lead.linkedin_url) {
    const { data: linkedinMatches } = await supabase
      .from("lead_candidates").select("id, name, linkedin_url, company, client_id")
      .eq("user_id", userId).eq("linkedin_url", lead.linkedin_url)
      .neq("id", lead.id);

    if (linkedinMatches) {
      linkedinMatches.forEach(m => {
        if (!duplicates.find(d => d.id === m.id)) {
          duplicates.push({
            id: m.id, name: m.name, linkedin_url: m.linkedin_url, company: m.company,
            client_id: m.client_id,
            match_type: "linkedin",
            confidence: 100,
            reason: `Same LinkedIn URL`,
            cross_client: m.client_id !== currentClientId,
          });
        }
      });
    }
  }

  // 3. Check by company + similar name (fuzzy)
  if (lead.company && lead.name) {
    const { data: companyMatches } = await supabase
      .from("lead_candidates").select("id, name, company, email, client_id")
      .eq("user_id", userId).ilike("company", lead.company)
      .neq("id", lead.id);

    if (companyMatches) {
      companyMatches.forEach(m => {
        if (!duplicates.find(d => d.id === m.id)) {
          const nameSimilarity = getNameSimilarity(lead.name, m.name);
          if (nameSimilarity > 0.7) {
            duplicates.push({
              id: m.id, name: m.name, company: m.company, email: m.email,
              client_id: m.client_id,
              match_type: "company_name",
              confidence: Math.round(nameSimilarity * 80),
              reason: `Similar name at same company: ${m.name} at ${m.company}`,
              cross_client: m.client_id !== currentClientId,
            });
          }
        }
      });
    }
  }

  return duplicates;
}

function getNameSimilarity(name1, name2) {
  if (!name1 || !name2) return 0;
  const a = name1.toLowerCase().trim();
  const b = name2.toLowerCase().trim();
  if (a === b) return 1;

  const aWords = a.split(/\s+/).sort();
  const bWords = b.split(/\s+/).sort();
  const common = aWords.filter(w => bWords.includes(w));
  return common.length / Math.max(aWords.length, bWords.length);
}
