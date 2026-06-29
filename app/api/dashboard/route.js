import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function getDays(range) {
  if (range === "14d") return 14;
  if (range === "30d") return 30;
  if (range === "all") return null;
  return 7;
}

function startDateForRange(range) {
  const days = getDays(range);

  if (!days) return null;

  const date = new Date();
  date.setDate(date.getDate() - (days - 1));
  date.setHours(0, 0, 0, 0);

  return date.toISOString();
}

function formatDay(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function buildDailyBuckets(range) {
  const days = getDays(range) || 7;
  const buckets = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    buckets.push({
      date: date.toISOString().slice(0, 10),
      label: formatDay(date.toISOString()),
      dms_sent: 0,
      replies_sent: 0,
      new_connections: 0,
      new_leads: 0,
      comments_processed: 0,
    });
  }

  return buckets;
}

function addToBucket(buckets, dateValue, field, amount = 1) {
  if (!dateValue) return;

  const key = new Date(dateValue).toISOString().slice(0, 10);
  const bucket = buckets.find((item) => item.date === key);

  if (bucket) {
    bucket[field] += Number(amount) || 0;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";
    const startDate = startDateForRange(range);

    const buckets = buildDailyBuckets(range);

    let leadsQuery = supabase
      .from("leads")
      .select("id, created_at, commented_at");

    let emailSendLogQuery = supabase
      .from("email_send_log")
      .select("id, sent_at, status");

    let campaignsQuery = supabase
      .from("campaigns")
      .select("id, status, created_at, leads_count, dms_sent, platform, post_url");

    if (startDate) {
      leadsQuery = leadsQuery.gte("created_at", startDate);
      emailSendLogQuery = emailSendLogQuery.gte("sent_at", startDate);
      campaignsQuery = campaignsQuery.gte("created_at", startDate);
    }

    const [
      leadsResult,
      emailSendLogResult,
      campaignsResult,
      leadCandidatesCountResult,
      leadRadarRunsResult,
      leadScoresResult,
    ] = await Promise.all([
      leadsQuery,
      emailSendLogQuery,
      campaignsQuery,
      supabase
        .from("lead_candidates")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("lead_radar_runs")
        .select("id, status, leads_processed, credits_used, created_at, completed_at"),
      supabase
        .from("lead_scores")
        .select("id, total_score, temperature, created_at"),
    ]);

    if (leadsResult.error) throw leadsResult.error;
    if (emailSendLogResult.error) throw emailSendLogResult.error;
    if (campaignsResult.error) throw campaignsResult.error;

    const leads = leadsResult.data || [];
    const emailSendLogs = emailSendLogResult.data || [];
    const campaigns = campaignsResult.data || [];
    const leadRadarRuns = leadRadarRunsResult.data || [];
    const leadScores = leadScoresResult.data || [];

    leads.forEach((lead) => {
      addToBucket(buckets, lead.created_at, "new_leads", 1);

      if (lead.commented_at) {
        addToBucket(buckets, lead.commented_at, "comments_processed", 1);
      }
    });

    emailSendLogs.forEach((log) => {
      addToBucket(buckets, log.sent_at, "replies_sent", 1);
    });

    campaigns.forEach((campaign) => {
      addToBucket(buckets, campaign.created_at, "dms_sent", campaign.dms_sent || 0);
    });

    const commentsProcessed = leads.filter((lead) => lead.commented_at).length;
    const repliesSent = emailSendLogs.length;
    const dmsSent = campaigns.reduce(
      (total, campaign) => total + (Number(campaign.dms_sent) || 0),
      0
    );

    const scheduledPosts = campaigns.filter(
      (campaign) => campaign.status === "scheduled"
    );

    const activeCampaigns = campaigns.filter(
      (campaign) => campaign.status === "active"
    ).length;

    const completedRadarRuns = leadRadarRuns.filter(
      (run) => run.status === "completed"
    ).length;

    const averageLeadScore =
      leadScores.length > 0
        ? Math.round(
            leadScores.reduce(
              (total, score) => total + (Number(score.total_score) || 0),
              0
            ) / leadScores.length
          )
        : 0;

    return NextResponse.json({
      range,
      metrics: {
        comments_processed: commentsProcessed,
        replies_sent: repliesSent,
        dms_sent: dmsSent,
        connections: 0,
        new_leads: leads.length,
        lead_candidates: leadCandidatesCountResult.count || 0,
        active_campaigns: activeCampaigns,
        completed_radar_runs: completedRadarRuns,
        average_lead_score: averageLeadScore,
      },
      scheduled_posts: scheduledPosts.map((campaign) => ({
        id: campaign.id,
        status: campaign.status,
        platform: campaign.platform,
        post_url: campaign.post_url,
        created_at: campaign.created_at,
      })),
      daily_activity: buckets,
      daily_new_leads: buckets.map((bucket) => ({
        date: bucket.date,
        label: bucket.label,
        value: bucket.new_leads,
      })),
      comments_processed: buckets.map((bucket) => ({
        date: bucket.date,
        label: bucket.label,
        value: bucket.comments_processed,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard data",
        metrics: {
          comments_processed: 0,
          replies_sent: 0,
          dms_sent: 0,
          connections: 0,
          new_leads: 0,
          lead_candidates: 0,
          active_campaigns: 0,
          completed_radar_runs: 0,
          average_lead_score: 0,
        },
        scheduled_posts: [],
        daily_activity: [],
        daily_new_leads: [],
        comments_processed: [],
      },
      { status: 500 }
    );
  }
}