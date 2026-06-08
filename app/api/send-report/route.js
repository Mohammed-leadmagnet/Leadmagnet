import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function generatePDF(client, campaigns, leads, gmail) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const green = "#22c97a";
      const dark = "#080c09";
      const gray = "#6b7c73";
      const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });

      const totalLeads = leads?.length || 0;
      const hotLeads = leads?.filter(l => l.lead_score === "hot").length || 0;
      const warmLeads = leads?.filter(l => l.lead_score === "warm").length || 0;
      const coldLeads = leads?.filter(l => l.lead_score === "cold").length || 0;
      const activeCampaigns = campaigns?.filter(c => c.status === "Active").length || 0;
      const totalDms = campaigns?.reduce((a, c) => a + (c.dms_sent || 0), 0) || 0;
      const health = client.health_score || 75;

      const thisMonthLeads = leads?.filter(l => {
        const d = new Date(l.created_at);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length || 0;

      // === HEADER ===
      doc.rect(0, 0, 595, 100).fill(dark);
      doc.fontSize(22).fill(green).text("LeadMagnet", 50, 30, { continued: false });
      doc.fontSize(11).fill("#4d6b54").text("Performance Report", 50, 58);
      doc.fontSize(10).fill("#3d5240").text(month, 50, 75);
      doc.fontSize(10).fill("#4d6b54").text(`Prepared for: ${client.name}${client.company ? " — " + client.company : ""}`, 300, 40, { align: "right", width: 245 });

      // === OVERVIEW SECTION ===
      doc.fill(dark).fontSize(14).text("Overview", 50, 125);
      doc.moveTo(50, 145).lineTo(545, 145).strokeColor("#e0e8e0").lineWidth(0.5).stroke();

      // Stat boxes
      const statsY = 160;
      const statBoxes = [
        { label: "Total Leads", value: totalLeads.toString(), color: green },
        { label: "This Month", value: thisMonthLeads.toString(), color: green },
        { label: "Campaigns", value: activeCampaigns.toString(), color: green },
        { label: "DMs Sent", value: totalDms.toString(), color: green },
        { label: "Health", value: `${health}/100`, color: health >= 75 ? green : health >= 40 ? "#fbbf24" : "#f87171" },
      ];

      statBoxes.forEach((stat, i) => {
        const x = 50 + i * 100;
        doc.roundedRect(x, statsY, 90, 55, 6).fill("#f8faf8").stroke();
        doc.fill(stat.color).fontSize(18).text(stat.value, x, statsY + 8, { width: 90, align: "center" });
        doc.fill(gray).fontSize(7).text(stat.label.toUpperCase(), x, statsY + 33, { width: 90, align: "center" });
      });

      // === AI LEAD SCORES ===
      doc.fill(dark).fontSize(14).text("AI Lead Scoring", 50, 240);
      doc.moveTo(50, 260).lineTo(545, 260).strokeColor("#e0e8e0").lineWidth(0.5).stroke();

      const scoreY = 275;
      const scoreBoxes = [
        { label: "HOT LEADS", value: hotLeads.toString(), color: "#f87171", emoji: "High priority" },
        { label: "WARM LEADS", value: warmLeads.toString(), color: "#fbbf24", emoji: "Worth following up" },
        { label: "COLD LEADS", value: coldLeads.toString(), color: "#60a5fa", emoji: "Low priority" },
      ];

      scoreBoxes.forEach((s, i) => {
        const x = 50 + i * 165;
        doc.roundedRect(x, scoreY, 155, 50, 6).fill("#f8faf8").stroke();
        doc.fill(s.color).fontSize(20).text(s.value, x + 15, scoreY + 8);
        doc.fill(dark).fontSize(8).text(s.label, x + 55, scoreY + 10);
        doc.fill(gray).fontSize(7).text(s.emoji, x + 55, scoreY + 25);
      });

      // === TOP LEADS TABLE ===
      const hotLeadsList = leads?.filter(l => l.lead_score === "hot").slice(0, 10) || [];

      if (hotLeadsList.length > 0) {
        doc.fill(dark).fontSize(14).text("Top Hot Leads", 50, 350);
        doc.moveTo(50, 370).lineTo(545, 370).strokeColor("#e0e8e0").lineWidth(0.5).stroke();

        // Table header
        const tableY = 380;
        doc.rect(50, tableY, 495, 20).fill("#f0f4f0");
        doc.fill(gray).fontSize(7);
        doc.text("NAME", 55, tableY + 6);
        doc.text("COMPANY", 180, tableY + 6);
        doc.text("TITLE", 310, tableY + 6);
        doc.text("SCORE", 480, tableY + 6);

        // Table rows
        hotLeadsList.forEach((lead, i) => {
          const rowY = tableY + 22 + i * 22;
          if (i % 2 === 0) doc.rect(50, rowY, 495, 22).fill("#fafcfa");
          doc.fill(dark).fontSize(8);
          doc.text((lead.name || "Unknown").slice(0, 25), 55, rowY + 6);
          doc.fill(gray);
          doc.text((lead.company || "—").slice(0, 20), 180, rowY + 6);
          doc.text((lead.job_title || lead.headline || "—").slice(0, 25), 310, rowY + 6);
          doc.fill("#f87171").fontSize(7).text("HOT", 485, rowY + 7);
        });
      }

      // === CAMPAIGNS LIST ===
      const campaignsListY = hotLeadsList.length > 0 ? 400 + hotLeadsList.length * 22 + 30 : 350;

      if (campaigns?.length > 0 && campaignsListY < 700) {
        doc.fill(dark).fontSize(14).text("Campaigns", 50, campaignsListY);
        doc.moveTo(50, campaignsListY + 20).lineTo(545, campaignsListY + 20).strokeColor("#e0e8e0").lineWidth(0.5).stroke();

        campaigns.slice(0, 5).forEach((c, i) => {
          const y = campaignsListY + 30 + i * 22;
          if (y > 760) return;
          doc.fill(dark).fontSize(8).text(`${c.platform === "instagram" ? "Instagram" : "LinkedIn"} Campaign`, 55, y);
          doc.fill(c.status === "Active" ? green : "#fbbf24").fontSize(7).text(c.status, 480, y);
          doc.fill(gray).fontSize(7).text(`${c.leads_count || 0} leads`, 400, y);
        });
      }

      // === FOOTER ===
      doc.rect(0, 792, 595, 50).fill(dark);
      doc.fill("#3d5240").fontSize(7).text("Generated by LeadMagnet · leadmagnetinc.com", 50, 800);
      doc.fill("#2d4a33").fontSize(7).text(`Report sent on ${new Date().toLocaleDateString()}`, 400, 800, { align: "right", width: 145 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

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
      return NextResponse.json({ error: "Gmail not connected. Connect Gmail first in the dashboard." }, { status: 400 });
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

    // Generate PDF
    const pdfBuffer = await generatePDF(client, campaigns, leads, gmail);

    // Calculate stats for email
    const totalLeads = leads?.length || 0;
    const hotLeads = leads?.filter(l => l.lead_score === "hot").length || 0;
    const warmLeads = leads?.filter(l => l.lead_score === "warm").length || 0;
    const activeCampaigns = campaigns?.filter(c => c.status === "Active").length || 0;
    const health = client.health_score || 75;
    const healthColor = health >= 75 ? "#22c97a" : health >= 40 ? "#fbbf24" : "#f87171";
    const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });

    const thisMonthLeads = leads?.filter(l => {
      const date = new Date(l.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length || 0;

    // Build HTML email
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
          <div style="font-size:0.7rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;">Total Leads</div>
        </div>
        <div style="flex:1;min-width:100px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:10px;padding:1rem;text-align:center;">
          <div style="font-size:1.75rem;font-weight:800;color:#f87171;">${hotLeads}</div>
          <div style="font-size:0.7rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;">🔥 Hot Leads</div>
        </div>
        <div style="flex:1;min-width:100px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:10px;padding:1rem;text-align:center;">
          <div style="font-size:1.75rem;font-weight:800;color:#fbbf24;">${warmLeads}</div>
          <div style="font-size:0.7rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;">🟡 Warm Leads</div>
        </div>
        <div style="flex:1;min-width:100px;background:#f8faf8;border:1px solid #e0e8e0;border-radius:10px;padding:1rem;text-align:center;">
          <div style="font-size:1.75rem;font-weight:800;color:#22c97a;">${activeCampaigns}</div>
          <div style="font-size:0.7rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;">Campaigns</div>
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
        <div style="font-size:0.82rem;color:#22c97a;font-weight:600;margin-bottom:0.25rem;">📎 Full PDF report attached</div>
        <div style="font-size:0.78rem;color:#3d5240;">The attached PDF includes a detailed lead list, AI scoring breakdown, and campaign performance data.</div>
      </div>
      <div style="text-align:center;padding:1.25rem;background:#080c09;border-radius:10px;">
        <div style="font-size:0.82rem;color:#4d6b54;margin-bottom:0.875rem;">Questions about your results?</div>
        <a href="mailto:${gmail.email}" style="background:#22c97a;color:#071209;font-weight:700;font-size:0.82rem;padding:0.65rem 1.25rem;border-radius:8px;text-decoration:none;display:inline-block;">Reply to this report →</a>
      </div>
    </div>
    <div style="background:#080c09;border-radius:0 0 16px 16px;padding:1.25rem 2rem;text-align:center;">
      <div style="font-size:0.72rem;color:#2d4a33;">Sent via ⚡ LeadMagnet · leadmagnetinc.com</div>
      <div style="font-size:0.68rem;color:#1e2b20;margin-top:0.2rem;">© 2026 LeadMagnet Inc.</div>
    </div>
  </div>
</body>
</html>`;

    // Send email with PDF attachment
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmail.email, pass: gmail.app_password },
    });

    const filename = `LeadMagnet-Report-${client.name.replace(/[^a-zA-Z0-9]/g, "-")}-${month.replace(/\s/g, "-")}.pdf`;

    await transporter.sendMail({
      from: `LeadMagnet Reports <${gmail.email}>`,
      to: client.email,
      subject: `📊 ${month} Performance Report — ${client.name}`,
      html,
      attachments: [{
        filename,
        content: pdfBuffer,
        contentType: "application/pdf",
      }],
    });

    // Update last report sent
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
