import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function generatePDF(client, campaigns, leads) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const green = rgb(0.133, 0.788, 0.478);
  const dark = rgb(0.031, 0.047, 0.035);
  const gray = rgb(0.42, 0.486, 0.451);
  const white = rgb(1, 1, 1);
  const lightBg = rgb(0.973, 0.98, 0.973);
  const red = rgb(0.973, 0.263, 0.443);
  const amber = rgb(0.961, 0.749, 0.145);
  const blue = rgb(0.376, 0.647, 0.961);
  const borderGray = rgb(0.878, 0.91, 0.878);

  const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const totalLeads = leads?.length || 0;
  const hotLeads = leads?.filter(l => l.lead_score === "hot").length || 0;
  const warmLeads = leads?.filter(l => l.lead_score === "warm").length || 0;
  const coldLeads = leads?.filter(l => l.lead_score === "cold").length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === "Active").length || 0;
  const totalCampaigns = campaigns?.length || 0;
  const totalDms = campaigns?.reduce((a, c) => a + (c.dms_sent || 0), 0) || 0;
  const health = client.health_score || 75;
  const healthColor = health >= 75 ? green : health >= 40 ? amber : red;

  const thisMonthLeads = leads?.filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length || 0;

  // === HEADER BAR ===
  page.drawRectangle({ x: 0, y: 742, width: 595, height: 100, color: dark });
  page.drawText("LeadMagnet", { x: 50, y: 800, size: 22, font: fontBold, color: green });
  page.drawText("Performance Report", { x: 50, y: 778, size: 11, font, color: gray });
  page.drawText(month, { x: 50, y: 762, size: 10, font, color: gray });

  const clientLabel = `Prepared for: ${client.name}${client.company ? " - " + client.company : ""}`;
  const labelWidth = font.widthOfTextAtSize(clientLabel, 9);
  page.drawText(clientLabel, { x: 545 - labelWidth, y: 785, size: 9, font, color: gray });

  // === OVERVIEW TITLE ===
  page.drawText("Overview", { x: 50, y: 720, size: 14, font: fontBold, color: dark });
  page.drawRectangle({ x: 50, y: 712, width: 495, height: 0.5, color: borderGray });

  // === STAT BOXES ===
  const statsY = 660;
  const statBoxes = [
    { label: "TOTAL LEADS", value: `${totalLeads}`, color: green },
    { label: "THIS MONTH", value: `${thisMonthLeads}`, color: green },
    { label: "CAMPAIGNS", value: `${activeCampaigns}`, color: green },
    { label: "DMS SENT", value: `${totalDms}`, color: green },
    { label: "HEALTH", value: `${health}/100`, color: healthColor },
  ];

  statBoxes.forEach((stat, i) => {
    const x = 50 + i * 100;
    page.drawRectangle({ x, y: statsY, width: 90, height: 55, color: lightBg, borderColor: borderGray, borderWidth: 0.5 });
    const valWidth = fontBold.widthOfTextAtSize(stat.value, 18);
    page.drawText(stat.value, { x: x + (90 - valWidth) / 2, y: statsY + 28, size: 18, font: fontBold, color: stat.color });
    const lblWidth = font.widthOfTextAtSize(stat.label, 6.5);
    page.drawText(stat.label, { x: x + (90 - lblWidth) / 2, y: statsY + 10, size: 6.5, font, color: gray });
  });

  // === AI LEAD SCORES ===
  page.drawText("AI Lead Scoring", { x: 50, y: 630, size: 14, font: fontBold, color: dark });
  page.drawRectangle({ x: 50, y: 622, width: 495, height: 0.5, color: borderGray });

  const scoreY = 570;
  const scoreBoxes = [
    { label: "HOT LEADS", value: `${hotLeads}`, color: red, sub: "High priority prospects" },
    { label: "WARM LEADS", value: `${warmLeads}`, color: amber, sub: "Worth following up" },
    { label: "COLD LEADS", value: `${coldLeads}`, color: blue, sub: "Lower priority" },
  ];

  scoreBoxes.forEach((s, i) => {
    const x = 50 + i * 168;
    page.drawRectangle({ x, y: scoreY, width: 155, height: 45, color: lightBg, borderColor: borderGray, borderWidth: 0.5 });
    page.drawText(s.value, { x: x + 12, y: scoreY + 18, size: 20, font: fontBold, color: s.color });
    page.drawText(s.label, { x: x + 55, y: scoreY + 25, size: 7.5, font: fontBold, color: dark });
    page.drawText(s.sub, { x: x + 55, y: scoreY + 12, size: 6.5, font, color: gray });
  });

  // === HOT LEADS TABLE ===
  const hotLeadsList = leads?.filter(l => l.lead_score === "hot").slice(0, 8) || [];

  let tableEndY = scoreY - 20;

  if (hotLeadsList.length > 0) {
    page.drawText("Top Hot Leads", { x: 50, y: 540, size: 14, font: fontBold, color: dark });
    page.drawRectangle({ x: 50, y: 532, width: 495, height: 0.5, color: borderGray });

    // Table header
    const headerY = 510;
    page.drawRectangle({ x: 50, y: headerY, width: 495, height: 18, color: lightBg });
    page.drawText("NAME", { x: 55, y: headerY + 5, size: 6.5, font: fontBold, color: gray });
    page.drawText("COMPANY", { x: 185, y: headerY + 5, size: 6.5, font: fontBold, color: gray });
    page.drawText("TITLE", { x: 315, y: headerY + 5, size: 6.5, font: fontBold, color: gray });
    page.drawText("SCORE", { x: 490, y: headerY + 5, size: 6.5, font: fontBold, color: gray });

    hotLeadsList.forEach((lead, i) => {
      const rowY = headerY - 18 - i * 20;
      if (i % 2 === 0) {
        page.drawRectangle({ x: 50, y: rowY, width: 495, height: 20, color: rgb(0.98, 0.99, 0.98) });
      }
      page.drawText((lead.name || "Unknown").slice(0, 28), { x: 55, y: rowY + 6, size: 7.5, font: fontBold, color: dark });
      page.drawText((lead.company || "-").slice(0, 22), { x: 185, y: rowY + 6, size: 7.5, font, color: gray });
      page.drawText((lead.job_title || lead.headline || "-").slice(0, 25), { x: 315, y: rowY + 6, size: 7.5, font, color: gray });
      page.drawText("HOT", { x: 493, y: rowY + 6, size: 7, font: fontBold, color: red });
      tableEndY = rowY - 5;
    });
  }

  // === CAMPAIGNS LIST ===
  if (totalCampaigns > 0 && tableEndY > 120) {
    const campTitleY = tableEndY - 15;
    page.drawText("Campaigns", { x: 50, y: campTitleY, size: 14, font: fontBold, color: dark });
    page.drawRectangle({ x: 50, y: campTitleY - 8, width: 495, height: 0.5, color: borderGray });

    campaigns.slice(0, 5).forEach((c, i) => {
      const y = campTitleY - 28 - i * 20;
      if (y < 60) return;
      const platform = c.platform === "instagram" ? "Instagram Campaign" : "LinkedIn Campaign";
      page.drawText(platform, { x: 55, y, size: 8, font: fontBold, color: dark });
      page.drawText(`${c.leads_count || 0} leads`, { x: 380, y, size: 7, font, color: gray });
      const statusColor = c.status === "Active" ? green : amber;
      page.drawText(c.status || "Active", { x: 470, y, size: 7, font: fontBold, color: statusColor });
    });
  }

  // === FOOTER ===
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 40, color: dark });
  page.drawText("Generated by LeadMagnet  |  leadmagnetinc.com", { x: 50, y: 15, size: 7, font, color: gray });
  const dateStr = new Date().toLocaleDateString();
  const dateWidth = font.widthOfTextAtSize(dateStr, 7);
  page.drawText(dateStr, { x: 545 - dateWidth, y: 15, size: 7, font, color: gray });

  return await doc.save();
}

export async function POST(request) {
  try {
    const { clientId, userId } = await request.json();

    const { data: client } = await supabase
      .from("agency_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const { data: gmail } = await supabase
      .from("gmail_accounts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!gmail?.email || !gmail?.app_password) {
      return NextResponse.json({ error: "Gmail not connected. Connect Gmail first." }, { status: 400 });
    }

    const { data: campaigns } = await supabase.from("campaigns").select("*").eq("client_id", clientId);
    const { data: leads } = await supabase.from("leads").select("*").eq("client_id", clientId);

    // Generate PDF
    const pdfBytes = await generatePDF(client, campaigns, leads);
    const pdfBuffer = Buffer.from(pdfBytes);

    // Stats for email
    const totalLeads = leads?.length || 0;
    const hotLeads = leads?.filter(l => l.lead_score === "hot").length || 0;
    const warmLeads = leads?.filter(l => l.lead_score === "warm").length || 0;
    const activeCampaigns = campaigns?.filter(c => c.status === "Active").length || 0;
    const health = client.health_score || 75;
    const healthColor = health >= 75 ? "#22c97a" : health >= 40 ? "#fbbf24" : "#f87171";
    const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:2rem 1rem;">
    <div style="background:#080c09;border-radius:16px 16px 0 0;padding:2rem;text-align:center;">
      <div style="font-size:1.1rem;font-weight:800;color:#22c97a;">⚡ LeadMagnet</div>
      <div style="font-size:1.4rem;font-weight:700;color:#f0f7f2;margin-top:0.75rem;">Performance Report</div>
      <div style="font-size:0.875rem;color:#4d6b54;margin-top:0.375rem;">${month}</div>
    </div>
    <div style="background:#0f1a11;padding:1.25rem 2rem;border-left:4px solid #22c97a;">
      <div style="font-size:1rem;font-weight:700;color:#f0f7f2;">Prepared for: ${client.name}</div>
      ${client.company ? `<div style="font-size:0.875rem;color:#4d6b54;margin-top:0.2rem;">${client.company}</div>` : ""}
    </div>
    <div style="background:#ffffff;padding:2rem;">
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.5rem;">
        <div style="flex:1;min-width:100px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:10px;padding:1rem;text-align:center;">
          <div style="font-size:1.75rem;font-weight:800;color:#22c97a;">${totalLeads}</div>
          <div style="font-size:0.7rem;color:#6b7c73;text-transform:uppercase;">Total Leads</div>
        </div>
        <div style="flex:1;min-width:100px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:10px;padding:1rem;text-align:center;">
          <div style="font-size:1.75rem;font-weight:800;color:#f87171;">${hotLeads}</div>
          <div style="font-size:0.7rem;color:#6b7c73;text-transform:uppercase;">Hot Leads</div>
        </div>
        <div style="flex:1;min-width:100px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:10px;padding:1rem;text-align:center;">
          <div style="font-size:1.75rem;font-weight:800;color:#fbbf24;">${warmLeads}</div>
          <div style="font-size:0.7rem;color:#6b7c73;text-transform:uppercase;">Warm Leads</div>
        </div>
        <div style="flex:1;min-width:100px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:10px;padding:1rem;text-align:center;">
          <div style="font-size:1.75rem;font-weight:800;color:#22c97a;">${activeCampaigns}</div>
          <div style="font-size:0.7rem;color:#6b7c73;text-transform:uppercase;">Campaigns</div>
        </div>
      </div>
      <div style="margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#6b7c73;margin-bottom:0.4rem;">
          <span>Client Health</span><span style="color:${healthColor};font-weight:600;">${health}/100</span>
        </div>
        <div style="height:6px;background:#e0e8e0;border-radius:100px;overflow:hidden;">
          <div style="height:100%;width:${health}%;background:${healthColor};border-radius:100px;"></div>
        </div>
      </div>
      <div style="background:#f0faf4;border:1px solid #c8e8d0;border-radius:10px;padding:1rem;margin-bottom:1.5rem;">
        <div style="font-size:0.82rem;color:#22c97a;font-weight:600;">Full PDF report attached</div>
        <div style="font-size:0.78rem;color:#3d5240;margin-top:0.2rem;">Includes detailed lead list, AI scoring breakdown, and campaign performance.</div>
      </div>
      <div style="text-align:center;padding:1.25rem;background:#080c09;border-radius:10px;">
        <div style="font-size:0.82rem;color:#4d6b54;margin-bottom:0.875rem;">Questions about your results?</div>
        <a href="mailto:${gmail.email}" style="background:#22c97a;color:#071209;font-weight:700;font-size:0.82rem;padding:0.65rem 1.25rem;border-radius:8px;text-decoration:none;display:inline-block;">Reply to this report</a>
      </div>
    </div>
    <div style="background:#080c09;border-radius:0 0 16px 16px;padding:1.25rem 2rem;text-align:center;">
      <div style="font-size:0.72rem;color:#2d4a33;">Sent via LeadMagnet · leadmagnetinc.com</div>
    </div>
  </div>
</body>
</html>`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmail.email, pass: gmail.app_password },
    });

    const filename = `LeadMagnet-Report-${client.name.replace(/[^a-zA-Z0-9]/g, "-")}-${month.replace(/\s/g, "-")}.pdf`;

    await transporter.sendMail({
      from: `LeadMagnet Reports <${gmail.email}>`,
      to: client.email,
      subject: `${month} Performance Report — ${client.name}`,
      html,
      attachments: [{ filename, content: pdfBuffer, contentType: "application/pdf" }],
    });

    await supabase
      .from("agency_clients")
      .update({ last_report_sent: new Date().toISOString() })
      .eq("id", clientId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
