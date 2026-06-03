import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request) {
  // Security check
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all active sequences
    const { data: sequences } = await supabase
      .from("email_sequences")
      .select("*, gmail_accounts(*)")
      .eq("status", "Active");

    if (!sequences || sequences.length === 0) {
      return NextResponse.json({ message: "No active sequences" });
    }

    let totalSent = 0;

    for (const seq of sequences) {
      const gmailAccount = seq.gmail_accounts;
      if (!gmailAccount?.email || !gmailAccount?.app_password) continue;

      // Get leads for this user that haven't received this sequence yet
      const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", seq.user_id);

      if (!leads || leads.length === 0) continue;

      // Create Gmail transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailAccount.email,
          pass: gmailAccount.app_password,
        },
      });

      for (const lead of leads) {
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

          // Check if enough days have passed since lead was added
          const leadDate = new Date(lead.created_at);
          const sendDate = new Date(leadDate.getTime() + email.day * 24 * 60 * 60 * 1000);
          const now = new Date();

          if (now < sendDate) continue;

          // Personalise email
          const firstName = lead.first_name || lead.name?.split(" ")[0] || "there";
          const company = lead.company || "";
          const subject = email.subject
            .replace(/\[Name\]/g, firstName)
            .replace(/\[Company\]/g, company);
          const body = email.body
            .replace(/\[Name\]/g, firstName)
            .replace(/\[Company\]/g, company);

          // Send email
          try {
            await transporter.sendMail({
              from: gmailAccount.email,
              to: lead.email,
              subject,
              text: body,
            });

            // Log it
            await supabase.from("email_send_log").insert({
              user_id: seq.user_id,
              sequence_id: seq.id,
              lead_id: lead.id,
              email_day: email.day,
              status: "sent",
            });

            totalSent++;
          } catch (emailErr) {
            console.error("Failed to send email:", emailErr.message);
          }
        }
      }
    }

    return NextResponse.json({ success: true, totalSent });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}