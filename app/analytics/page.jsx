"use client";

import { useEffect, useState } from "react";
import AppNavigator from "@/app/components/AppNavigator";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AnalyticsPage() {
  const [allLeads, setAllLeads] = useState([]);
  const [analyticsRange, setAnalyticsRange] = useState("7d");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      loadAllLeads(data.user.id);
    });
  }, []);

  const loadAllLeads = async (userId) => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setAllLeads(data);
  };

  const getDailyLeads = () => {
    const days = analyticsRange === "7d" ? 7 : analyticsRange === "14d" ? 14 : 30;
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const count = allLeads.filter(l =>
        new Date(l.created_at).toDateString() === date.toDateString()
      ).length;

      result.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
      });
    }

    return result;
  };

  const getLeadsInRange = (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return allLeads.filter(l => new Date(l.created_at) >= cutoff).length;
  };

  const hotCount = allLeads.filter(l => l.lead_score === "hot").length;
  const warmCount = allLeads.filter(l => l.lead_score === "warm").length;
  const coldCount = allLeads.filter(l => l.lead_score === "cold").length;

  const dailyLeads = getDailyLeads();
  const maxCount = Math.max(...dailyLeads.map(d => d.count), 1);
  const selectedDays = analyticsRange === "7d" ? 7 : analyticsRange === "14d" ? 14 : 30;

  return (
    <main className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        *{box-sizing:border-box;margin:0;padding:0;}

        .page{
          min-height:100vh;
          background:radial-gradient(circle at 12% 10%, rgba(255,127,103,0.08), transparent 28%),#FBF3E3;
          font-family:'Plus Jakarta Sans','Inter',sans-serif;
          color:#173838;
          display:grid;
          grid-template-columns:290px minmax(0, 1fr);
        }

        .content{
          padding:2rem 2.25rem 3rem;
          max-width:1180px;
          width:100%;
        }

        .page-header{
          background:linear-gradient(145deg,#ffffff,#f8fbfa);
          border:1px solid rgba(23,56,56,0.08);
          border-radius:26px;
          padding:1.7rem;
          box-shadow:0 24px 60px rgba(23,56,56,0.08);
          margin-bottom:1.25rem;
        }

        .page-title{
          font-size:clamp(2rem,4vw,3rem);
          font-weight:900;
          letter-spacing:-0.065em;
          line-height:1.04;
          margin-bottom:0.6rem;
        }

        .page-sub{
          color:#5f7774;
          font-size:0.95rem;
          line-height:1.65;
        }

        .range-tabs{
          display:flex;
          gap:0.35rem;
          margin-bottom:1.75rem;
        }

        .range-tab{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.10);
          color:#5f7774;
          font-size:0.8rem;
          padding:0.45rem 0.9rem;
          border-radius:10px;
          cursor:pointer;
          font-weight:900;
        }

        .range-tab.active{
          background:rgba(255,127,103,0.10);
          border-color:rgba(255,127,103,0.24);
          color:#ff7f67;
        }

        .analytics-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:0.85rem;
          margin-bottom:1.5rem;
        }

        .analytics-card{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.08);
          border-radius:18px;
          padding:1.2rem;
          box-shadow:0 16px 34px rgba(23,56,56,0.05);
        }

        .analytics-val{
          font-size:1.8rem;
          font-weight:900;
          color:#ff7f67;
          letter-spacing:-0.05em;
        }

        .analytics-lbl{
          font-size:0.72rem;
          color:#173838;
          font-weight:900;
          text-transform:uppercase;
          letter-spacing:0.08em;
          margin-top:0.35rem;
        }

        .analytics-sub{
          font-size:0.75rem;
          color:#819693;
          margin-top:0.2rem;
        }

        .chart-card{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.08);
          border-radius:18px;
          padding:1.25rem;
          margin-bottom:1rem;
          box-shadow:0 16px 34px rgba(23,56,56,0.05);
        }

        .chart-title{
          font-size:1rem;
          font-weight:900;
          color:#173838;
          margin-bottom:1rem;
        }

        .bar-chart{
          height:170px;
          display:flex;
          align-items:flex-end;
          gap:0.5rem;
          padding-top:1rem;
        }

        .bar-wrap{
          flex:1;
          height:100%;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-end;
          gap:0.4rem;
        }

        .bar{
          width:100%;
          max-width:40px;
          background:linear-gradient(180deg,#ff7f67,#8fc8c1);
          border-radius:8px 8px 0 0;
        }

        .bar-val{
          font-size:0.72rem;
          font-weight:900;
          color:#173838;
          min-height:14px;
        }

        .bar-label{
          font-size:0.66rem;
          color:#819693;
          white-space:nowrap;
          transform:rotate(-30deg);
          margin-top:0.35rem;
        }

        .location-row{
          display:grid;
          grid-template-columns:150px 1fr 40px;
          gap:0.75rem;
          align-items:center;
          margin-bottom:0.75rem;
        }

        .location-name{
          color:#5f7774;
          font-size:0.82rem;
          font-weight:800;
        }

        .location-bar-wrap{
          height:8px;
          background:#FBF3E3;
          border-radius:100px;
          overflow:hidden;
        }

        .location-bar{
          height:100%;
          background:linear-gradient(90deg,#ff7f67,#8fc8c1);
          border-radius:100px;
        }

        .location-count{
          color:#173838;
          font-size:0.82rem;
          font-weight:900;
          text-align:right;
        }

        @media(max-width:1150px){
          .page{grid-template-columns:1fr;}
        }

        @media(max-width:900px){
          .content{padding:1.5rem 1rem 2rem;}
        }
      `}</style>

      <AppNavigator
        leadCandidates={allLeads.length}
        completedRadarRuns={0}
        averageLeadScore={0}
      />

      <div className="content">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Track your lead generation performance over time.</p>
        </div>

        <div className="range-tabs">
          {["7d", "14d", "30d"].map(r => (
            <button
              key={r}
              className={`range-tab ${analyticsRange === r ? "active" : ""}`}
              onClick={() => setAnalyticsRange(r)}
            >
              {r === "7d" ? "7 days" : r === "14d" ? "14 days" : "30 days"}
            </button>
          ))}
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-val">{getLeadsInRange(selectedDays)}</div>
            <div className="analytics-lbl">New Leads</div>
            <div className="analytics-sub">in selected period</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-val" style={{ color: "#ff7f67" }}>{hotCount}</div>
            <div className="analytics-lbl">Hot Leads</div>
            <div className="analytics-sub">high priority</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-val" style={{ color: "#b45309" }}>{warmCount}</div>
            <div className="analytics-lbl">Warm Leads</div>
            <div className="analytics-sub">worth following up</div>
          </div>

          <div className="analytics-card">
            <div className="analytics-val" style={{ color: "#2f625d" }}>{coldCount}</div>
            <div className="analytics-lbl">Cold Leads</div>
            <div className="analytics-sub">low priority</div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Daily New Leads</div>

          <div className="bar-chart">
            {dailyLeads.map((d, i) => (
              <div className="bar-wrap" key={i}>
                <div className="bar-val">{d.count > 0 ? d.count : ""}</div>
                <div className="bar" style={{ height: `${Math.max((d.count / maxCount) * 110, 4)}px` }} title={`${d.date}: ${d.count}`} />
                <div className="bar-label">{d.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Leads by Location</div>

          {allLeads.length === 0 ? (
            <div style={{ color: "#819693", fontSize: "0.82rem" }}>No data yet</div>
          ) : (() => {
            const lc = {};

            allLeads.forEach(l => {
              const loc = l.location || "Unknown";
              lc[loc] = (lc[loc] || 0) + 1;
            });

            return Object.entries(lc)
              .sort((a, b) => b[1] - a[1])
              .map(([loc, count]) => (
                <div key={loc} className="location-row">
                  <div className="location-name">{loc}</div>
                  <div className="location-bar-wrap">
                    <div className="location-bar" style={{ width: `${(count / allLeads.length) * 100}%` }} />
                  </div>
                  <div className="location-count">{count}</div>
                </div>
              ));
          })()}
        </div>
      </div>
    </main>
  );
}
