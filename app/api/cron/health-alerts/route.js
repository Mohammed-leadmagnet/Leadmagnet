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

  try {
    // Get all agency users with clients
    const { data: clients } = await supabase
      .from("agency_clients")
      .select("*")
      .neq("tier", "Inactive");

    if (!clients || clients.length === 0) {
      return NextResponse.json({ message: "No active clients" });
    }

    // Group clients by agency user
    const byUser = {};
    for (const c of clients) {
      if (!byUser[c.agency_user_id]) byUser[c.agency_user_id] = [];
      byUser[c.agency_user_id].push(c);
    }

    let totalAlerts = 0;

    for (const [userId, userClients] of Object.entries(byUser)) {
      const alerts = [];

      for (const client of userClients) {
        // Get leads from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { count: recentLeads } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("client_id", client.id)
          .gte("created_at", sevenDaysAgo.toISOString());

        // Get leads from 7-14 days ago for comparison
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const { count: previousLeads } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("client_id", client.id)
          .gte("created_at", fourteenDaysAgo.toISOString())
          .lt("created_at", sevenDaysAgo.toISOString());

        // Get active campaigns
        const { count: activeCampaigns } = await supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("client_id", client.id)
          .eq("status", "Active");

        // ALERT 1: Zero leads in 7 days
        if (recentLeads === 0) {
          alerts.push({
            client: client.name,
            type: "no_leads",
            emoji: "🚨",
            message: `${client.name} has had 0 new leads in the last 7 days.`,
            action: "Check if campaigns are running and post URLs are still active.",
          });
        }
        // ALERT 2: Lead flow dropped significantly
        else if (previousLeads > 0 && recentLeads < previousLeads * 0.5) {
          alerts.push({
            client: client.name,
            type: "lead_drop",
            emoji: "📉",
            message: `${client.name}'s leads dropped from ${previousLeads} to ${recentLeads} this week (${Math.round((1 - recentLeads / previousLeads) * 100)}% decline).`,
            action: "Review campaign performance and consider adding new campaigns.",
          });
        }

        // ALERT 3: No active campaigns
        if (activeCampaigns === 0) {
          alerts.push({
            client: client.name,
            type: "no_campaigns",
            emoji: "⚠️",
            message: `${client.name} has no active campaigns running.`,
            action: "Create a new campaign to keep lead flow going.",
          });
        }

        // ALERT 4: Low health score
        if (client.health_score && client.health_score < 40) {
          alerts.push({
            client: client.name,
            type: "low_health",
            emoji: "💔",
            message: `${client.name}'s health score is critically low at ${client.health_score}/100.`,
            action: "Schedule a check-in call with this client to address concerns.",
          });
        }
      }

      // Only send email if there are alerts
      if (alerts.length === 0) continue;

      // Get user email
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      const userEmail = userData?.user?.email;
      if (!userEmail) continue;

      // Build alert email
      const alertRows = alerts.map(a => `
        <div style="background:#0f1a11;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1rem 1.25rem;margin-bottom:0.625rem;">
          <div style="font-size:0.9rem;font-weight:700;color:#f0f7f2;margin-bottom:0.3rem;">${a.emoji} ${a.message}</div>
          <div style="font-size:0.8rem;color:#4d6b54;">💡 ${a.action}</div>
        </div>
      `).join("");

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:2rem 1rem;">
    <div style="background:#080c09;border-radius:16px 16px 0 0;padding:2rem;text-align:center;">
      <div style="font-size:1.1rem;font-weight:800;color:#22c97a;">⚡ LeadMagnet</div>
      <div style="font-size:1.3rem;font-weight:700;color:#f0f7f2;margin-top:0.75rem;">Client Health Alerts</div>
      <div style="font-size:0.875rem;color:#4d6b54;margin-top:0.375rem;">${alerts.length} alert${alerts.length > 1 ? "s" : ""} need your attention</div>
    </div>
    <div style="background:#080c09;padding:1.5rem;">
      ${alertRows}
    </div>
    <div style="background:#ffffff;padding:1.5rem;text-align:center;border-radius:0 0 16px 16px;">
      <div style="font-size:0.82rem;color:#6b7c73;margin-bottom:1rem;">Take action now to keep your clients happy.</div>
      <a href="https://leadmagnetinc.com/agency" style="background:#22c97a;color:#071209;font-weight:700;font-size:0.82rem;padding:0.65rem 1.25rem;border-radius:8px;text-decoration:none;display:inline-block;">Open Client Manager →</a>
    </div>
  </div>
</body>
</html>`;

      // Send via system Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `LeadMagnet Alerts <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: `⚠️ ${alerts.length} Client Alert${alerts.length > 1 ? "s" : ""} — LeadMagnet`,
        html,
      });

      totalAlerts += alerts.length;
    }

    return NextResponse.json({ success: true, totalAlerts });
  } catch (error) {
    console.error("Health alerts error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
