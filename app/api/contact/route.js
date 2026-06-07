import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `LeadMagnet Support <${process.env.GMAIL_USER}>`,
      to: "support@leadmagnetinc.com",
      replyTo: email,
      subject: `[Support] ${subject} — from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#080c09;padding:1.5rem;border-radius:12px 12px 0 0;">
            <h2 style="color:#22c97a;margin:0;font-size:1.1rem;">⚡ New Support Request</h2>
          </div>
          <div style="background:#0f1a11;padding:1.5rem;border-radius:0 0 12px 12px;border:1px solid rgba(255,255,255,0.08);">
            <p style="color:#94a3b8;font-size:0.875rem;margin-bottom:1rem;"><strong style="color:#c4d4c8;">From:</strong> ${name} (${email})</p>
            <p style="color:#94a3b8;font-size:0.875rem;margin-bottom:1rem;"><strong style="color:#c4d4c8;">Subject:</strong> ${subject}</p>
            <p style="color:#94a3b8;font-size:0.875rem;margin-bottom:0.5rem;"><strong style="color:#c4d4c8;">Message:</strong></p>
            <p style="color:#94a3b8;font-size:0.875rem;line-height:1.6;background:#080c09;padding:1rem;border-radius:8px;">${message.replace(/\n/g, "<br>")}</p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:1.5rem 0;">
            <p style="color:#3d5240;font-size:0.775rem;">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}