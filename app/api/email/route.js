import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  try {
    const { action, userId, sequenceId, to, subject, body } = await request.json();

    if (action === "send_email") {
      // Send email via Gmail SMTP
      const nodemailer = require("nodemailer");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject,
        html: body.replace(/\n/g, "<br>"),
      });

      // Log the sent email in Supabase
      await supabase.from("email_logs").insert({
        user_id: userId,
        sequence_id: sequenceId,
        to_email: to,
        subject,
        sent_at: new Date().toISOString(),
        status: "sent",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}