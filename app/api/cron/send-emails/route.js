import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // System Gmail must be configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: "System Gmail not configured" }, { status: 500 });
  }

  try {
    // Get all active sequences
    const { data: sequences } = await supabase
      .from("email_sequences")
      .select("*")
      .eq("status", "Active");

    if (!sequences || sequences.length === 0) {
      return NextResponse.json({ message: "No active sequences" });
    }

    // Create system Gmail transporter (used for all sending)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    let totalSent = 0;
    let errors = 0;

    for (const seq of sequences) {
      // Get leads — filter by client_id if sequence is client-specific
      let leadsQuery = supabase
        .from("leads")
        .select("*")
        .eq("user_id", seq.user_id)
        .not("email", "is", null);

      if (seq.client_id) {
        leadsQuery = leadsQuery.eq("client_id", seq.client_id);
      }

      const { data: leads } = await leadsQuery;
      if (!leads || leads.length === 0) continue;

      const now = new Date();

      for (const lead of leads) {
        if (!lead.email) continue;

        for (const email of seq.emails || []) {
          // Check if already sent
          const { data: alreadySent } = await supabase
            .from("email_send_log")
            .select("id")
            .eq("sequence_id", seq.id)
            .eq("lead_id", lead.id)
            .eq("email_day", email.day)
            .maybeSingle();

          if (alreadySent) continue;

          // Check if enough days have passed
          const leadDate = new Date(lead.created_at);
          const sendDate = new Date(leadDate.getTime() + email.day * 24 * 60 * 60 * 1000);

          if (now < sendDate) continue;

          // Check send frequency limits
          if (seq.send_frequency) {
            const todayStart = new Date(now);
            todayStart.setHours(0, 0, 0, 0);

            const { count: sentToday } = await supabase
              .from("email_send_log")
              .select("*", { count: "exact", head: true })
              .eq("sequence_id", seq.id)
              .gte("created_at", todayStart.toISOString());

            const dailyLimit = seq.send_frequency === "slow" ? 10 : seq.send_frequency === "medium" ? 25 : 50;
            if (sentToday >= dailyLimit) break;
          }

          // Personalise
          const firstName = lead.first_name || lead.name?.split(" ")[0] || "there";
          const company = lead.company || "";
          const headline = lead.headline || "";

          const subject = (email.subject || "")
            .replace(/\[Name\]/g, firstName)
            .replace(/\[Company\]/g, company)
            .replace(/\[Headline\]/g, headline);

          const body = (email.body || "")
            .replace(/\[Name\]/g, firstName)
            .replace(/\[Company\]/g, company)
            .replace(/\[Headline\]/g, headline);

          try {
            await transporter.sendMail({
              from: `LeadMagnet <${process.env.GMAIL_USER}>`,
              to: lead.email,
              subject,
              text: body,
            });

            await supabase.from("email_send_log").insert({
              user_id: seq.user_id,
              sequence_id: seq.id,
              lead_id: lead.id,
              email_day: email.day,
              status: "sent",
            });

            totalSent++;
          } catch (emailErr) {
            console.error("Email send failed:", emailErr.message);
            errors++;
          }
        }
      }
    }

    return NextResponse.json({ success: true, totalSent, errors });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
