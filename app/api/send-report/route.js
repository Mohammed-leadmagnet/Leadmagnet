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

    // Get client data
    const { data: client } = await supabase
      .from("agency_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    // Get Gmail account
    const { data: gmail } = await supabase
      .from("gmail_accounts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!gmail?.email || !gmail?.app_password) {
      return NextResponse.json({ error: "Gmail not connected" }, { status: 400 });
    }

    // Get campaigns for this client
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("*")
      .eq("client_id", clientId);

    // Get leads for this client
    const { data: leads } = await supabase
      .from("leads")
      .select("*")
      .eq("client_id", clientId);

    // Calculate stats
    const totalCampaigns = campaigns?.length || 0;
    const activeCampaigns = campaigns?.filter(c => c.status === "Active").length || 0;
    const totalLeads = leads?.length || 0;
    const thisMonthLeads = leads?.filter(l => {
      const date = new Date(l.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length || 0;

    const health = client.health_score || 75;
    const healthColor = health >= 75 ? "#22c97a" : health >= 40 ? "#fbbf24" : "#f87171";
    const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });

    // Build HTML email
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Report</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:2rem 1rem;">

    <!-- Header -->
    <div style="background:#080c09;border-radius:16px 16px 0 0;padding:2rem;text-align:center;">
      <div style="font-size:1.1rem;font-weight:800;color:#22c97a;letter-spacing:-0.02em;">⚡ LeadMagnet</div>
      <div style="font-size:1.5rem;font-weight:700;color:#f0f7f2;margin-top:0.75rem;letter-spacing:-0.02em;">Monthly Performance Report</div>
      <div style="font-size:0.875rem;color:#4d6b54;margin-top:0.375rem;">${month}</div>
    </div>

    <!-- Client info -->
    <div style="background:#0f1a11;padding:1.5rem 2rem;border-left:4px solid #22c97a;">
      <div style="font-size:1rem;font-weight:700;color:#f0f7f2;">Prepared for: ${client.name}</div>
      ${client.company ? `<div style="font-size:0.875rem;color:#4d6b54;margin-top:0.25rem;">${client.company}</div>` : ""}
    </div>

    <!-- Stats grid -->
    <div style="background:#ffffff;padding:2rem;display:grid;">
      <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem;">

        <div style="flex:1;min-width:120px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:12px;padding:1.25rem;text-align:center;">
          <div style="font-size:2rem;font-weight:800;color:#22c97a;">${totalLeads}</div>
          <div style="font-size:0.75rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;margin-top:0.25rem;">Total Leads</div>
        </div>

        <div style="flex:1;min-width:120px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:12px;padding:1.25rem;text-align:center;">
          <div style="font-size:2rem;font-weight:800;color:#22c97a;">${thisMonthLeads}</div>
          <div style="font-size:0.75rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;margin-top:0.25rem;">This Month</div>
        </div>

        <div style="flex:1;min-width:120px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:12px;padding:1.25rem;text-align:center;">
          <div style="font-size:2rem;font-weight:800;color:#22c97a;">${activeCampaigns}</div>
          <div style="font-size:0.75rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;margin-top:0.25rem;">Active Campaigns</div>
        </div>

        <div style="flex:1;min-width:120px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:12px;padding:1.25rem;text-align:center;">
          <div style="font-size:2rem;font-weight:800;color:${healthColor};">${health}/100</div>
          <div style="font-size:0.75rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;margin-top:0.25rem;">Health Score</div>
        </div>

      </div>

      <!-- Health bar -->
      <div style="margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#6b7c73;margin-bottom:0.5rem;">
          <span>Client Health Score</span>
          <span style="color:${healthColor};font-weight:600;">${health}/100</span>
        </div>
        <div style="height:8px;background:#e0e8e0;border-radius:100px;overflow:hidden;">
          <div style="height:100%;width:${health}%;background:${healthColor};border-radius:100px;"></div>
        </div>
      </div>

      <!-- Campaigns list -->
      ${totalCampaigns > 0 ? `
      <div style="margin-bottom:1.5rem;">
        <div style="font-size:0.875rem;font-weight:600;color:#1a1a1a;margin-bottom:0.75rem;">Active Campaigns</div>
        ${campaigns?.slice(0, 5).map(c => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem;background:#f8faf8;border-radius:8px;margin-bottom:0.5rem;">
            <div style="font-size:0.8rem;color:#3d5240;">${c.post_url?.slice(0, 40) || "Campaign"}...</div>
            <div style="font-size:0.75rem;font-weight:600;color:${c.status === "Active" ? "#22c97a" : "#fbbf24"};">${c.status}</div>
          </div>
        `).join("") || ""}
      </div>
      ` : ""}

      <!-- Notes -->
      ${client.notes ? `
      <div style="background:#f0faf4;border:1px solid #c8e8d0;border-radius:8px;padding:1rem;margin-bottom:1.5rem;">
        <div style="font-size:0.8rem;font-weight:600;color:#22c97a;margin-bottom:0.375rem;">Notes</div>
        <div style="font-size:0.85rem;color:#3d5240;">${client.notes}</div>
      </div>
      ` : ""}

      <!-- CTA -->
      <div style="text-align:center;padding:1.5rem;background:#080c09;border-radius:12px;">
        <div style="font-size:0.875rem;color:#4d6b54;margin-bottom:1rem;">Questions about your results? Get in touch.</div>
        <a href="mailto:${gmail.email}" style="background:#22c97a;color:#071209;font-weight:700;font-size:0.875rem;padding:0.75rem 1.5rem;border-radius:9px;text-decoration:none;display:inline-block;">Reply to this report →</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#080c09;border-radius:0 0 16px 16px;padding:1.25rem 2rem;text-align:center;">
      <div style="font-size:0.75rem;color:#2d4a33;">Sent via ⚡ LeadMagnet · leadmagnetinc.com</div>
      <div style="font-size:0.72rem;color:#1e2b20;margin-top:0.25rem;">© 2026 LeadMagnet Inc. All rights reserved.</div>
    </div>

  </div>
</body>
</html>`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmail.email,
        pass: gmail.app_password,
      },
    });

    await transporter.sendMail({
      from: `LeadMagnet Reports <${gmail.email}>`,
      to: client.email,
      subject: `📊 ${month} Performance Report — ${client.name}`,
      html,
    });

    // Update last report sent
    await supabase
      .from("agency_clients")
      .update({ last_report_sent: new Date().toISOString() })
      .eq("id", clientId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}