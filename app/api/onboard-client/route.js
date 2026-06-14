import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { hasAgencyAccess } from "@/lib/subscription";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  try {
    const { clientId, userId } = await request.json();

    if (!clientId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const hasAccess = await hasAgencyAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Agency plan required" }, { status: 403 });
    }

    const { data: client } = await supabase
      .from("agency_clients").select("*")
      .eq("id", clientId).eq("agency_user_id", userId).single();

    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const { data: profile } = await supabase.from("profiles").select("agency_name").eq("user_id", userId).maybeSingle();
    const agencyName = profile?.agency_name || "Your Agency";

    const defaultSequence = {
      user_id: userId, client_id: clientId,
      name: `${client.name} — Welcome Sequence`,
      status: "Active", send_frequency: "medium",
      emails: [
        { day: 0, subject: "Welcome [Name] — excited to work together!", body: `Hi [Name],\n\nThanks for connecting! We're thrilled to have you on board.\n\nBest,\n${agencyName}` },
        { day: 3, subject: "[Name], here's how we'll grow your pipeline", body: `Hi [Name],\n\nHere's our approach:\n\n1. Identify ideal prospects\n2. Engage through targeted content\n3. Capture and qualify leads\n4. Deliver hot leads to you\n\nBest,\n${agencyName}` },
        { day: 7, subject: "Your first week update — [Name]", body: `Hi [Name],\n\nOne week check-in. We'll send a performance report soon.\n\nReply with any questions.\n\nBest,\n${agencyName}` },
      ],
    };

    const { data: sequence } = await supabase.from("email_sequences").insert(defaultSequence).select().single();

    await supabase.from("agency_clients").update({ auto_report: true, report_frequency: "monthly", health_score: 80 }).eq("id", clientId);

    let welcomeSent = false;
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && client.email) {
      try {
        const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
        await transporter.sendMail({
          from: `${agencyName} <${process.env.GMAIL_USER}>`,
          to: client.email,
          subject: `Welcome to ${agencyName}!`,
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><div style="background:#080c09;padding:2rem;text-align:center;border-radius:16px 16px 0 0;"><div style="color:#22c97a;font-size:1.1rem;font-weight:800;">${agencyName}</div><div style="color:#f0f7f2;font-size:1.4rem;font-weight:700;margin-top:0.75rem;">Welcome Aboard!</div></div><div style="background:#fff;padding:2rem;border-radius:0 0 16px 16px;"><p style="color:#1a1a1a;line-height:1.7;">Hi ${client.name},<br><br>We're excited to start working with you${client.company ? ` at ${client.company}` : ""}! Your account is set up and ready.</p></div></div>`,
        });
        welcomeSent = true;
      } catch (e) { console.error("Welcome email failed:", e.message); }
    }

    return NextResponse.json({ success: true, sequenceCreated: !!sequence, welcomeEmailSent: welcomeSent, autoReportEnabled: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}