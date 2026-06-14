import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  try {
    const { clientId, userId } = await request.json();

    // Get client
    const { data: client } = await supabase
      .from("agency_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    // Get agency profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("agency_name")
      .eq("user_id", userId)
      .maybeSingle();

    const agencyName = profile?.agency_name || "Your Agency";

    // 1. Create default email sequence for this client
    const defaultSequence = {
      user_id: userId,
      client_id: clientId,
      name: `${client.name} — Welcome Sequence`,
      status: "Active",
      send_frequency: "medium",
      emails: [
        {
          day: 0,
          subject: "Welcome [Name] — excited to work together!",
          body: `Hi [Name],\n\nThanks for connecting! We're thrilled to have you on board.\n\nOver the next few days, we'll be sharing some valuable resources to help you get the most out of our partnership.\n\nFeel free to reply to this email with any questions.\n\nBest,\n${agencyName}`,
        },
        {
          day: 3,
          subject: "[Name], here's how we'll grow your pipeline",
          body: `Hi [Name],\n\nI wanted to share a quick overview of our approach:\n\n1. We identify your ideal prospects on LinkedIn\n2. Engage them through targeted content\n3. Automatically capture and qualify leads\n4. Deliver hot leads directly to you\n\nWe're already setting things up on our end. You'll start seeing results soon.\n\nBest,\n${agencyName}`,
        },
        {
          day: 7,
          subject: "Your first week update — [Name]",
          body: `Hi [Name],\n\nIt's been one week since we started working together. Here's a quick check-in.\n\nWe'll be sending you a detailed performance report soon with lead counts, engagement metrics, and next steps.\n\nIf you have any questions or want to adjust our strategy, just reply to this email.\n\nLooking forward to growing together!\n\nBest,\n${agencyName}`,
        },
      ],
    };

    const { data: sequence, error: seqError } = await supabase
      .from("email_sequences")
      .insert(defaultSequence)
      .select()
      .single();

    if (seqError) console.error("Sequence creation error:", seqError.message);

    // 2. Enable auto-reports for this client
    await supabase
      .from("agency_clients")
      .update({
        auto_report: true,
        report_frequency: "monthly",
        health_score: 80,
      })
      .eq("id", clientId);

    // 3. Send welcome email to client
    const { data: gmail } = await supabase
      .from("gmail_accounts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    let welcomeSent = false;

    if (gmail?.email && gmail?.app_password && client.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmail.email, pass: gmail.app_password },
      });

      const welcomeHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:2rem 1rem;">
    <div style="background:#080c09;border-radius:16px 16px 0 0;padding:2rem;text-align:center;">
      <div style="font-size:1.1rem;font-weight:800;color:#22c97a;">⚡ ${agencyName}</div>
      <div style="font-size:1.4rem;font-weight:700;color:#f0f7f2;margin-top:0.75rem;">Welcome Aboard! 🎉</div>
    </div>
    <div style="background:#ffffff;padding:2rem;">
      <div style="font-size:0.95rem;color:#1a1a1a;line-height:1.7;margin-bottom:1.5rem;">
        Hi ${client.name},<br><br>
        We're excited to start working with you${client.company ? ` at ${client.company}` : ""}! Your account has been set up and we're ready to start generating leads for you.
      </div>
      <div style="font-size:0.875rem;font-weight:700;color:#1a1a1a;margin-bottom:0.75rem;">Here's what happens next:</div>
      <div style="margin-bottom:1.5rem;">
        <div style="display:flex;gap:0.75rem;margin-bottom:0.75rem;">
          <div style="width:28px;height:28px;background:#22c97a;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:800;flex-shrink:0;">1</div>
          <div style="font-size:0.85rem;color:#3d5240;padding-top:0.25rem;">We set up targeted campaigns on your preferred platforms</div>
        </div>
        <div style="display:flex;gap:0.75rem;margin-bottom:0.75rem;">
          <div style="width:28px;height:28px;background:#22c97a;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:800;flex-shrink:0;">2</div>
          <div style="font-size:0.85rem;color:#3d5240;padding-top:0.25rem;">Leads are automatically captured and scored by AI</div>
        </div>
        <div style="display:flex;gap:0.75rem;margin-bottom:0.75rem;">
          <div style="width:28px;height:28px;background:#22c97a;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:800;flex-shrink:0;">3</div>
          <div style="font-size:0.85rem;color:#3d5240;padding-top:0.25rem;">You receive regular performance reports with all your data</div>
        </div>
      </div>
      ${client.platforms?.length > 0 ? `
      <div style="background:#f8faf8;border:1px solid #e0e8e0;border-radius:10px;padding:1rem;margin-bottom:1.5rem;">
        <div style="font-size:0.78rem;color:#6b7c73;margin-bottom:0.3rem;">YOUR PLATFORMS</div>
        <div style="font-size:0.9rem;color:#22c97a;font-weight:600;">${client.platforms.join(" • ")}</div>
      </div>` : ""}
      <div style="text-align:center;padding:1.25rem;background:#080c09;border-radius:10px;">
        <div style="font-size:0.82rem;color:#4d6b54;margin-bottom:0.875rem;">Questions? Reply directly to this email.</div>
        <a href="mailto:${gmail.email}" style="background:#22c97a;color:#071209;font-weight:700;font-size:0.82rem;padding:0.65rem 1.25rem;border-radius:8px;text-decoration:none;display:inline-block;">Get in Touch →</a>
      </div>
    </div>
    <div style="background:#080c09;border-radius:0 0 16px 16px;padding:1.25rem;text-align:center;">
      <div style="font-size:0.72rem;color:#2d4a33;">Powered by LeadMagnet · leadmagnetinc.com</div>
    </div>
  </div>
</body>
</html>`;

      try {
        await transporter.sendMail({
          from: `${agencyName} <${gmail.email}>`,
          to: client.email,
          subject: `Welcome to ${agencyName}! 🎉`,
          html: welcomeHtml,
        });
        welcomeSent = true;
      } catch (emailErr) {
        console.error("Welcome email failed:", emailErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      sequenceCreated: !!sequence,
      welcomeEmailSent: welcomeSent,
      autoReportEnabled: true,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
