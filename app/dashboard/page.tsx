"use client";

import AppNavigator from "@/app/components/AppNavigator";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode, SVGProps } from "react";

type Range = "7d" | "14d" | "30d" | "all";
type LeadView = "chart" | "table";

type IconProps = {
  name: string;
  size?: number;
};

type Metric = {
  title: string;
  value: string;
  change: string;
  icon: string;
  tone: "coral" | "mint" | "dark" | "soft";
};

type DashboardMetrics = {
  comments_processed: number;
  replies_sent: number;
  dms_sent: number;
  connections: number;
  new_leads: number;
  lead_candidates: number;
  active_campaigns: number;
  completed_radar_runs: number;
  average_lead_score: number;
};

type ScheduledPost = {
  id: string;
  status?: string;
  platform?: string;
  post_url?: string;
  created_at?: string;
};

type DailyActivityPoint = {
  date: string;
  label: string;
  dms_sent: number;
  replies_sent: number;
  new_connections: number;
  new_leads: number;
  comments_processed: number;
};

type ChartPoint = {
  date: string;
  label: string;
  value: number;
};

type DashboardData = {
  range: Range;
  metrics: DashboardMetrics;
  scheduled_posts: ScheduledPost[];
  daily_activity: DailyActivityPoint[];
  daily_new_leads: ChartPoint[];
  comments_processed: ChartPoint[];
};

type ChartSeries = {
  name: string;
  color: string;
  data: ChartPoint[];
};

const emptyMetrics: DashboardMetrics = {
  comments_processed: 0,
  replies_sent: 0,
  dms_sent: 0,
  connections: 0,
  new_leads: 0,
  lead_candidates: 0,
  active_campaigns: 0,
  completed_radar_runs: 0,
  average_lead_score: 0,
};

function formatNumber(value: number | undefined | null) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function formatDate(value?: string) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getRangeLabel(range: Range) {
  return range === "all" ? "All" : range;
}

function Icon({ name, size = 22 }: IconProps) {
  const common: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons: Record<string, ReactNode> = {
    analytics: (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="M7 14l3-3 3 2 5-6" />
      </svg>
    ),
    leads: (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    message: (
      <svg {...common}>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    ),
    reply: (
      <svg {...common}>
        <path d="M9 17l-5-5 5-5" />
        <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
      </svg>
    ),
    send: (
      <svg {...common}>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
    user: (
      <svg {...common}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    calendar: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </svg>
    ),
    refresh: (
      <svg {...common}>
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
      </svg>
    ),
    support: (
      <svg {...common}>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    ),
  };

  return icons[name] || null;
}

export default function DashboardPage() {
  const [range, setRange] = useState<Range>("7d");
  const [leadView, setLeadView] = useState<LeadView>("chart");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/dashboard?range=${range}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load dashboard data");
        }

        if (active) {
          setDashboardData(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [range, refreshKey]);

  const dashboardMetrics = dashboardData?.metrics || emptyMetrics;

  const metrics: Metric[] = useMemo(
    () => [
      {
        title: "Comments",
        value: loading && !dashboardData ? "..." : formatNumber(dashboardMetrics.comments_processed),
        change: "0%",
        icon: "message",
        tone: "mint",
      },
      {
        title: "Replies Sent",
        value: loading && !dashboardData ? "..." : formatNumber(dashboardMetrics.replies_sent),
        change: "0%",
        icon: "reply",
        tone: "coral",
      },
      {
        title: "DMs Sent",
        value: loading && !dashboardData ? "..." : formatNumber(dashboardMetrics.dms_sent),
        change: "0%",
        icon: "send",
        tone: "dark",
      },
      {
        title: "Connections",
        value: loading && !dashboardData ? "..." : formatNumber(dashboardMetrics.connections),
        change: "0%",
        icon: "user",
        tone: "soft",
      },
    ],
    [dashboardData, dashboardMetrics, loading]
  );

  const dailyActivity: DailyActivityPoint[] = dashboardData?.daily_activity || [];
  const dailyNewLeads: ChartPoint[] = dashboardData?.daily_new_leads || [];
  const commentsProcessed: ChartPoint[] = dashboardData?.comments_processed || [];
  const scheduledPosts = dashboardData?.scheduled_posts || [];

  const activitySeries: ChartSeries[] = [
    {
      name: "DMs Sent",
      color: "#2f625d",
      data: dailyActivity.map((item) => ({
        date: item.date,
        label: item.label,
        value: item.dms_sent,
      })),
    },
    {
      name: "New Connections",
      color: "#ff7f67",
      data: dailyActivity.map((item) => ({
        date: item.date,
        label: item.label,
        value: item.new_connections,
      })),
    },
    {
      name: "Replies Sent",
      color: "#8fc8c1",
      data: dailyActivity.map((item) => ({
        date: item.date,
        label: item.label,
        value: item.replies_sent,
      })),
    },
  ];

  return (
    <main className="dashboard-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .dashboard-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 10%, rgba(255,127,103,0.08), transparent 28%),
            #FBF3E3;
          color: #173838;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
        }

        .dashboard-main {
          min-width: 0;
          padding: 2rem;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.4rem;
        }

        .greeting {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .sun {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex: 0 0 auto;
        }

        .greeting h1 {
          color: #819693;
          font-size: clamp(1.65rem, 3vw, 2.35rem);
          font-weight: 700;
          letter-spacing: -0.045em;
          line-height: 1.1;
        }

        .greeting strong {
          color: #173838;
          font-weight: 900;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(23,56,56,0.08);
          background: rgba(255,255,255,0.78);
          color: #2f625d;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(23,56,56,0.05);
        }

        .icon-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .tabs {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255,255,255,0.64);
          border: 1px solid rgba(23,56,56,0.06);
          border-radius: 14px;
          padding: 0.35rem;
          margin-bottom: 1.7rem;
          box-shadow: 0 12px 26px rgba(23,56,56,0.04);
        }

        .tab {
          border: 0;
          min-height: 34px;
          min-width: 48px;
          border-radius: 10px;
          background: transparent;
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 900;
          cursor: pointer;
          padding: 0 0.8rem;
        }

        .tab.active {
          background: #ffffff;
          color: #173838;
          box-shadow: 0 8px 18px rgba(23,56,56,0.06);
        }

        .data-alert {
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.20);
          color: #173838;
          border-radius: 16px;
          padding: 0.9rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.84rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metric-card,
        .panel {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 24px;
          box-shadow: 0 18px 42px rgba(23,56,56,0.06);
        }

        .metric-card {
          padding: 1.25rem;
          min-height: 170px;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          overflow: hidden;
        }

        .metric-title {
          color: #173838;
          font-size: 0.92rem;
          font-weight: 900;
          margin-bottom: 1.25rem;
        }

        .metric-value {
          color: #173838;
          font-size: 2.2rem;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.06em;
          margin-bottom: 0.8rem;
        }

        .metric-change {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #819693;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .metric-change strong {
          color: #2f625d;
          font-weight: 900;
        }

        .metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .metric-icon.coral {
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
        }

        .metric-icon.mint {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.34);
          color: #2f625d;
        }

        .metric-icon.dark {
          background: rgba(23,56,56,0.08);
          border: 1px solid rgba(23,56,56,0.10);
          color: #173838;
        }

        .metric-icon.soft {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(23,56,56,0.08);
          color: #ff7f67;
        }

        .section-stack {
          display: grid;
          gap: 1.5rem;
        }

        .panel {
          padding: 1.35rem;
        }

        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.15rem;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          color: #173838;
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: -0.025em;
        }

        .panel-title-icon {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .panel-actions {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          border-radius: 12px;
          padding: 0 1rem;
          text-decoration: none;
          border: 0;
          font-family: 'Inter', sans-serif;
          font-size: 0.86rem;
          font-weight: 900;
          cursor: pointer;
        }

        .primary-btn {
          background: #ff7f67;
          color: #173838;
          box-shadow: 0 10px 22px rgba(255,127,103,0.22);
        }

        .secondary-btn {
          background: #ffffff;
          color: #2f625d;
          border: 1px solid rgba(23,56,56,0.10);
          box-shadow: 0 10px 22px rgba(23,56,56,0.04);
        }

        .empty-scheduled {
          background: rgba(255,127,103,0.06);
          border: 1px solid rgba(255,127,103,0.16);
          border-radius: 18px;
          padding: 1rem;
          display: flex;
          gap: 0.85rem;
          align-items: center;
        }

        .empty-icon {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          background: rgba(255,255,255,0.76);
          color: #ff7f67;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .empty-title {
          color: #173838;
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 0.25rem;
        }

        .empty-title span {
          color: #ff7f67;
        }

        .empty-copy {
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-size: 0.84rem;
          line-height: 1.55;
        }

        .scheduled-list {
          display: grid;
          gap: 0.75rem;
        }

        .scheduled-post {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: rgba(255,127,103,0.06);
          border: 1px solid rgba(255,127,103,0.16);
          border-radius: 18px;
          padding: 1rem;
        }

        .scheduled-post-title {
          color: #173838;
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 0.25rem;
        }

        .scheduled-post-meta {
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .scheduled-post-status {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.34);
          color: #2f625d;
          border-radius: 100px;
          padding: 0.35rem 0.7rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .chart-card {
          min-height: 410px;
        }

        .chart-wrap {
          height: 280px;
          position: relative;
          padding-left: 42px;
          padding-bottom: 36px;
          margin-top: 0.8rem;
        }

        .chart-wrap.tall {
          height: 370px;
        }

        .chart-y {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 36px;
          width: 34px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #819693;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 800;
          text-align: right;
        }

        .chart-grid {
          position: absolute;
          left: 42px;
          right: 0;
          top: 0;
          bottom: 36px;
          border-left: 1px solid rgba(23,56,56,0.22);
          border-bottom: 2px solid #ff7f67;
          background-image:
            linear-gradient(to right, rgba(23,56,56,0.09) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(23,56,56,0.09) 1px, transparent 1px);
          background-size: calc(100% / 7) calc(100% / 4);
          border-radius: 0 12px 0 0;
        }

        .chart-svg {
          position: absolute;
          left: 42px;
          right: 0;
          top: 0;
          bottom: 36px;
          width: calc(100% - 42px);
          height: calc(100% - 36px);
          overflow: visible;
          pointer-events: none;
        }

        .chart-svg polyline {
          fill: none;
          stroke-width: 2.4;
          vector-effect: non-scaling-stroke;
        }

        .chart-svg circle {
          stroke: #ffffff;
          stroke-width: 1.8;
          vector-effect: non-scaling-stroke;
        }

        .chart-line {
          position: absolute;
          left: 42px;
          right: 0;
          bottom: 36px;
          height: 2px;
          background: #ff7f67;
        }

        .chart-x {
          position: absolute;
          left: 42px;
          right: 0;
          bottom: 0;
          height: 28px;
          display: grid;
          color: #819693;
          font-family: 'Inter', sans-serif;
          font-size: 0.74rem;
          font-weight: 800;
        }

        .chart-x span {
          white-space: nowrap;
          transform: translateX(-14px);
        }

        .legend {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.8rem;
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .legend-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .legend-dot {
          width: 18px;
          height: 3px;
          border-radius: 100px;
          display: inline-block;
        }

        .view-switch {
          display: inline-flex;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 12px;
          padding: 0.25rem;
        }

        .view-switch button {
          min-height: 34px;
          border: 0;
          border-radius: 9px;
          padding: 0 0.85rem;
          background: transparent;
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 900;
          cursor: pointer;
        }

        .view-switch button.active {
          background: #ff7f67;
          color: #173838;
          box-shadow: 0 8px 18px rgba(255,127,103,0.18);
        }

        .lead-table {
          width: 100%;
          border-collapse: collapse;
          overflow: hidden;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          font-family: 'Inter', sans-serif;
          margin-top: 1rem;
        }

        .lead-table th,
        .lead-table td {
          padding: 0.9rem;
          border-bottom: 1px solid rgba(23,56,56,0.06);
          text-align: left;
          font-size: 0.84rem;
        }

        .lead-table th {
          color: #2f625d;
          font-weight: 900;
          background: rgba(143,200,193,0.12);
        }

        .lead-table td {
          color: #5f7774;
          font-weight: 700;
        }

        .floating-chat {
          position: fixed;
          right: 1.35rem;
          bottom: 1.35rem;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 1px solid rgba(23,56,56,0.10);
          background: #ff7f67;
          color: #173838;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 18px 44px rgba(255,127,103,0.24);
          cursor: pointer;
          z-index: 80;
        }

        @media(max-width: 1150px) {
          .dashboard-shell {
            grid-template-columns: 1fr;
          }

          .metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width: 680px) {
          .dashboard-main {
            padding: 1.2rem;
          }

          .topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .metric-grid {
            grid-template-columns: 1fr;
          }

          .panel-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .panel-actions {
            width: 100%;
          }

          .primary-btn,
          .secondary-btn {
            width: 100%;
          }

          .empty-scheduled {
            align-items: flex-start;
            flex-direction: column;
          }

          .scheduled-post {
            align-items: flex-start;
            flex-direction: column;
          }

          .chart-x {
            font-size: 0.64rem;
          }
        }
      `}</style>

      <AppNavigator
        leadCandidates={dashboardMetrics.lead_candidates}
        completedRadarRuns={dashboardMetrics.completed_radar_runs}
        averageLeadScore={dashboardMetrics.average_lead_score}
      />

      <section className="dashboard-main">
        <header className="topbar">
          <div className="greeting">
            <span className="sun">☀</span>
            <h1>
              Good evening, <strong>Mohammed!</strong>
            </h1>
          </div>

          <div className="top-actions">
            <button
              className="icon-btn"
              type="button"
              aria-label="Refresh dashboard"
              disabled={loading}
              onClick={() => setRefreshKey((current) => current + 1)}
            >
              <Icon name="refresh" size={19} />
            </button>
            <Link className="primary-btn" href="/campaigns">
              New campaign <Icon name="arrow" size={15} />
            </Link>
          </div>
        </header>

        <div className="tabs" aria-label="Date range filter">
          {[
            { label: "7d", value: "7d" },
            { label: "14d", value: "14d" },
            { label: "30d", value: "30d" },
            { label: "All", value: "all" },
          ].map((item) => (
            <button
              key={item.value}
              className={`tab ${range === item.value ? "active" : ""}`}
              type="button"
              onClick={() => setRange(item.value as Range)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && <div className="data-alert">{error}</div>}

        <div className="metric-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.title}>
              <div>
                <div className="metric-title">
                  {metric.title} ({getRangeLabel(range)})
                </div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-change">
                  <strong>↗ {metric.change}</strong>
                  <span>vs previous period</span>
                </div>
              </div>

              <div className={`metric-icon ${metric.tone}`}>
                <Icon name={metric.icon} size={22} />
              </div>
            </article>
          ))}
        </div>

        <div className="section-stack">
          <section className="panel">
            <div className="panel-head">
              <h2 className="panel-title">
                <span className="panel-title-icon">
                  <Icon name="calendar" size={20} />
                </span>
                Scheduled Posts
              </h2>

              <div className="panel-actions">
                <Link className="primary-btn" href="/campaigns">
                  Schedule <Icon name="arrow" size={15} />
                </Link>
                <Link className="secondary-btn" href="/campaigns">
                  View All
                </Link>
              </div>
            </div>

            {scheduledPosts.length > 0 ? (
              <div className="scheduled-list">
                {scheduledPosts.map((post) => (
                  <div className="scheduled-post" key={post.id}>
                    <div>
                      <div className="scheduled-post-title">
                        {post.platform || "Campaign"} post
                      </div>
                      <div className="scheduled-post-meta">
                        Created {formatDate(post.created_at)}
                        {post.post_url ? ` · ${post.post_url}` : ""}
                      </div>
                    </div>
                    <div className="scheduled-post-status">{post.status || "scheduled"}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-scheduled">
                <div className="empty-icon">
                  <Icon name="calendar" size={20} />
                </div>
                <div>
                  <div className="empty-title">
                    <span>No posts scheduled</span> · Schedule your first post
                  </div>
                  <p className="empty-copy">
                    You can schedule and pre-automate posts from the campaign page.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="charts-grid">
            <article className="panel chart-card">
              <div className="panel-head">
                <h2 className="panel-title">
                  <span className="panel-title-icon">
                    <Icon name="analytics" size={20} />
                  </span>
                  Daily Activity
                </h2>
              </div>

              <Chart series={activitySeries} />

              <div className="legend">
                {activitySeries.map((item) => (
                  <span className="legend-item" key={item.name}>
                    <i className="legend-dot" style={{ background: item.color }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </article>

            <article className="panel chart-card">
              <div className="panel-head">
                <h2 className="panel-title">
                  <span className="panel-title-icon">
                    <Icon name="leads" size={20} />
                  </span>
                  Daily New Leads
                </h2>

                <div className="view-switch">
                  <button
                    className={leadView === "chart" ? "active" : ""}
                    type="button"
                    onClick={() => setLeadView("chart")}
                  >
                    Chart
                  </button>
                  <button
                    className={leadView === "table" ? "active" : ""}
                    type="button"
                    onClick={() => setLeadView("table")}
                  >
                    Table
                  </button>
                </div>
              </div>

              {leadView === "chart" ? (
                <Chart
                  series={[
                    {
                      name: "New Leads",
                      color: "#ff7f67",
                      data: dailyNewLeads,
                    },
                  ]}
                />
              ) : (
                <table className="lead-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>New Leads</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyNewLeads.map((day) => (
                      <tr key={day.date}>
                        <td>{day.label}</td>
                        <td>{formatNumber(day.value)}</td>
                        <td>Campaigns</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </article>
          </section>

          <section className="panel chart-card">
            <div className="panel-head">
              <h2 className="panel-title">
                <span className="panel-title-icon">
                  <Icon name="message" size={20} />
                </span>
                Comments Processed
              </h2>
            </div>

            <Chart
              tall
              series={[
                {
                  name: "Comments Processed",
                  color: "#ff7f67",
                  data: commentsProcessed,
                },
              ]}
            />
          </section>
        </div>
      </section>

      <button className="floating-chat" type="button" aria-label="Open support chat">
        <Icon name="support" size={23} />
      </button>
    </main>
  );
}

function Chart({ series, tall = false }: { series: ChartSeries[]; tall?: boolean }) {
  const firstSeries = series[0]?.data || [];
  const labels = firstSeries.map((item) => item.label);
  const allValues = series.flatMap((item) => item.data.map((point) => Number(point.value) || 0));
  const maxValue = Math.max(4, ...allValues);
  const ticks = [
    maxValue,
    Math.round(maxValue * 0.75),
    Math.round(maxValue * 0.5),
    Math.round(maxValue * 0.25),
    0,
  ];

  const labelStep = labels.length > 14 ? 4 : labels.length > 8 ? 2 : 1;

  return (
    <div className={`chart-wrap ${tall ? "tall" : ""}`}>
      <div className="chart-y">
        {ticks.map((tick, index) => (
          <span key={`${tick}-${index}`}>{tick}</span>
        ))}
      </div>

      <div className="chart-grid" />

      <svg className="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {series.map((seriesItem) => {
          const data = seriesItem.data.length ? seriesItem.data : firstSeries;
          const points = data.map((point, index) => {
            const x = data.length <= 1 ? 0 : (index / (data.length - 1)) * 100;
            const y = 100 - ((Number(point.value) || 0) / maxValue) * 100;

            return `${x},${y}`;
          });

          return (
            <g key={seriesItem.name}>
              <polyline points={points.join(" ")} stroke={seriesItem.color} />
              {data.map((point, index) => {
                const x = data.length <= 1 ? 0 : (index / (data.length - 1)) * 100;
                const y = 100 - ((Number(point.value) || 0) / maxValue) * 100;

                return (
                  <circle
                    key={`${seriesItem.name}-${point.date}-${index}`}
                    cx={x}
                    cy={y}
                    r="1.6"
                    fill={seriesItem.color}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      <div className="chart-line" />

      <div
        className="chart-x"
        style={{
          gridTemplateColumns: `repeat(${Math.max(labels.length, 1)}, 1fr)`,
        }}
      >
        {labels.map((label, index) => (
          <span key={`${label}-${index}`}>{index % labelStep === 0 ? label : ""}</span>
        ))}
      </div>
    </div>
  );
}