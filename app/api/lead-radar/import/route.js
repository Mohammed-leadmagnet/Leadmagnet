import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasScaleAccess } from "@/lib/subscription";
import { validateCSVRow } from "@/lib/lead-radar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// POST — add single lead or batch import
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, clientId, leads, lead } = body;

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

    // Single lead entry
    if (lead) {
      const errors = validateCSVRow(lead);
      if (errors.length > 0) {
        return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
      }

      const name = lead.name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim();

      const { data: newLead, error: dbError } = await supabase.from("lead_candidates").insert({
        user_id: userId,
        client_id: clientId,
        source_type: lead.source_type || "manual_entry",
        source_name: lead.source_name || "Manual entry",
        name,
        first_name: lead.first_name || null,
        last_name: lead.last_name || null,
        title: lead.title || null,
        company: lead.company || null,
        industry: lead.industry || null,
        location: lead.location || null,
        email: lead.email || null,
        website: lead.website || null,
        linkedin_url: lead.linkedin_url || null,
        instagram_handle: lead.instagram_handle || null,
        company_domain: lead.company_domain || null,
        status: "new",
      }).select().single();

      if (dbError) throw dbError;

      return NextResponse.json({ success: true, imported: 1, lead: newLead });
    }

    // Batch CSV import
    if (leads && Array.isArray(leads)) {
      if (leads.length === 0) {
        return NextResponse.json({ error: "No leads to import" }, { status: 400 });
      }

      if (leads.length > 500) {
        return NextResponse.json({ error: "Maximum 500 leads per import" }, { status: 400 });
      }

      let imported = 0;
      let skipped = 0;
      const errors = [];

      const toInsert = [];

      for (let i = 0; i < leads.length; i++) {
        const row = leads[i];
        const rowErrors = validateCSVRow(row);

        if (rowErrors.length > 0) {
          skipped++;
          errors.push({ row: i + 1, errors: rowErrors });
          continue;
        }

        const name = row.name || `${row.first_name || ""} ${row.last_name || ""}`.trim();

        toInsert.push({
          user_id: userId,
          client_id: clientId,
          source_type: row.source_type || "csv_upload",
          source_name: row.source_name || "CSV import",
          name,
          first_name: row.first_name || null,
          last_name: row.last_name || null,
          title: row.title || null,
          company: row.company || null,
          industry: row.industry || null,
          location: row.location || null,
          email: row.email || null,
          website: row.website || null,
          linkedin_url: row.linkedin_url || null,
          instagram_handle: row.instagram_handle || null,
          company_domain: row.company_domain || null,
          status: "new",
        });
      }

      if (toInsert.length > 0) {
        const { error: dbError } = await supabase.from("lead_candidates").insert(toInsert);
        if (dbError) throw dbError;
        imported = toInsert.length;
      }

      return NextResponse.json({
        success: true,
        imported,
        skipped,
        total: leads.length,
        errors: errors.slice(0, 10),
      });
    }

    return NextResponse.json({ error: "Provide 'lead' or 'leads'" }, { status: 400 });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
