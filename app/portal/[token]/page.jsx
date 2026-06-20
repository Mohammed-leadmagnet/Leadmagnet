"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    logo: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10" />
        <path d="M7 12h10" />
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
    campaign: (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
    hot: (
      <svg {...common}>
        <path d="M13 3s1 3-2 5c-2 1.5-3 3-3 5a5 5 0 0 0 10 0c0-3-2-5-5-10z" />
      </svg>
    ),
    warm: (
      <svg {...common}>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2" />
        <path d="M12 21v2" />
        <path d="M4.22 4.22l1.42 1.42" />
        <path d="M18.36 18.36l1.42 1.42" />
        <path d="M1 12h2" />
        <path d="M21 12h2" />
      </svg>
    ),
    cold: (
      <svg {...common}>
        <path d="M12 2v20" />
        <path d="M17 5l-5 5-5-5" />
        <path d="M17 19l-5-5-5 5" />
        <path d="M2 12h20" />
      </svg>
    ),
    health: (
      <svg {...common}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
    linkedin: (
      <svg {...common}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    instagram: (
      <svg {...common}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
    shield: (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    check: (
      <svg {...common}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  };

  return icons[name] || null;
}

export default function ClientPortal() {
  const params = useParams();
  const token = params.token;

  const [client, setClient] = useState(null);
  const [agencyName, setAgencyName] = useState("");
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loadingState, setLoadingState] = useState("loading");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!token) return;
    loadPortalData();
  }, [token]);

  const loadPortalData = async () => {
    const { data: clientData } = await supabase
      .from("agency_clients")
      .select("*")
      .eq("portal_token", token)
      .maybeSingle();

    if (!clientData) {
      setLoadingState("not_found");
      return;
    }

    setClient(clientData);

    const { data: profile } = await supabase
      .from("profiles")
      .select("agency_name")
      .eq("user_id", clientData.agency_user_id)
      .maybeSingle();

    setAgencyName(profile?.agency_name || "Your Agency");

    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("client_id", clientData.id)
      .order("created_at", { ascending: false });

    setLeads(leadsData || []);

    const { data: campaignsData } = await supabase
      .from("campaigns")
      .select("*")
      .eq("client_id", clientData.id)
      .order("created_at", { ascending: false });

    setCampaigns(campaignsData || []);
    setLoadingState("loaded");
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;

    return `${Math.floor(days / 30)}mo ago`;
  };

  const getScoreBadge = (score) => {
    if (score === "hot") {
      return {
        label: "Hot",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.20)",
        color: "#ef4444",
      };
    }

    if (score === "warm") {
      return {
        label: "Warm",
        bg: "rgba(245,158,11,0.10)",
        border: "rgba(245,158,11,0.24)",
        color: "#b45309",
      };
    }

    if (score === "cold") {
      return {
        label: "Cold",
        bg: "rgba(59,130,246,0.08)",
        border: "rgba(59,130,246,0.22)",
        color: "#2563eb",
      };
    }

    return {
      label: "Unscored",
      bg: "rgba(23,56,56,0.04)",
      border: "rgba(23,56,56,0.08)",
      color: "#819693",
    };
  };

  const getHealthColor = (score) => {
    if (score >= 75) return "#2f625d";
    if (score >= 40) return "#b45309";
    return "#ef4444";
  };

  if (loadingState === "loading") {
    return (
      <main className="state-page">
        <style>{stateStyles}</style>
        <div className="state-card">
          <div className="state-icon"><Icon name="logo" size={24} /></div>
          <div className="state-title">Loading portal</div>
          <div className="state-sub">Preparing your client dashboard.</div>
        </div>
      </main>
    );
  }

  if (loadingState === "not_found") {
    return (
      <main className="state-page">
        <style>{stateStyles}</style>
        <div className="state-card">
          <div className="state-icon"><Icon name="shield" size={24} /></div>
          <div className="state-title">Portal not found</div>
          <div className="state-sub">
            This portal link is invalid or has expired. Contact your agency for a new link.
          </div>
        </div>
      </main>
    );
  }

  const totalLeads = leads.length;
  const hotLeads = leads.filter((lead) => lead.lead_score === "hot").length;
  const warmLeads = leads.filter((lead) => lead.lead_score === "warm").length;
  const coldLeads = leads.filter((lead) => lead.lead_score === "cold").length;
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "Active").length;
  const health = client.health_score || 75;
  const healthColor = getHealthColor(health);

  const thisMonthLeads = leads.filter((lead) => {
    const date = new Date(lead.created_at);
    const now = new Date();

    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <main className="portal-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .portal-shell {
          min-height: 100vh;
          background: #FBF3E3;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          color: #173838;
        }

        .portal-nav {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(23,56,56,0.08);
          padding: 0 1.75rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 10px 30px rgba(23,56,56,0.04);
        }

        .portal-logo {
          display: flex;
          align-items: center;
          gap: 0.62rem;
          text-decoration: none;
          color: #173838;
        }

        .brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: conic-gradient(from -12deg,#ff7f67 0 44%,transparent 44% 51%,#8fc8c1 51% 86%,transparent 86% 100%);
          position: relative;
          flex: 0 0 auto;
        }

        .brand-mark:after {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: #ffffff;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .brand-name {
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: -0.035em;
          line-height: 1;
        }

        .brand-sub {
          font-size: 0.68rem;
          color: #819693;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
        }

        .client-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 100px;
          padding: 0.3rem 0.85rem 0.3rem 0.3rem;
          box-shadow: 0 10px 24px rgba(23,56,56,0.04);
        }

        .client-avatar {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg,#ff7f67,#ec6f5b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
          color: #ffffff;
        }

        .client-name {
          font-size: 0.78rem;
          color: #5f7774;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.6rem 1.5rem 3.5rem;
        }

        .welcome {
          margin-bottom: 1.75rem;
        }

        .page-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #ff7f67;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 0.75rem;
        }

        .kicker-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.22);
          color: #ff7f67;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .welcome h1 {
          font-size: 1.9rem;
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.045em;
          margin-bottom: 0.4rem;
        }

        .welcome p {
          font-size: 0.9rem;
          color: #5f7774;
          line-height: 1.6;
          font-family: 'Inter', sans-serif;
        }

        .tabs {
          display: flex;
          gap: 0.35rem;
          margin-bottom: 1.75rem;
          background: rgba(255,255,255,0.8);
          padding: 0.25rem;
          border-radius: 11px;
          border: 1px solid rgba(23,56,56,0.08);
          width: fit-content;
          box-shadow: 0 12px 24px rgba(23,56,56,0.04);
          flex-wrap: wrap;
        }

        .tab {
          background: transparent;
          border: none;
          color: #5f7774;
          font-size: 0.82rem;
          padding: 0.52rem 1.15rem;
          border-radius: 9px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
        }

        .tab.active {
          background: rgba(255,127,103,0.12);
          color: #ff7f67;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .stat,
        .section {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .stat {
          border-radius: 16px;
          padding: 1.2rem 1.25rem;
        }

        .stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.22);
          color: #ff7f67;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.85rem;
        }

        .stat-val {
          font-size: 1.75rem;
          font-weight: 900;
          color: #ff7f67;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .stat-lbl {
          font-size: 0.68rem;
          color: #819693;
          margin-top: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
        }

        .section {
          border-radius: 18px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 0.98rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 1.25rem;
        }

        .health-wrap {
          margin-bottom: 0.5rem;
        }

        .health-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 0.45rem;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
        }

        .health-label {
          color: #819693;
        }

        .health-bar {
          height: 7px;
          background: rgba(23,56,56,0.06);
          border-radius: 100px;
          overflow: hidden;
        }

        .health-fill {
          height: 100%;
          border-radius: 100px;
        }

        .score-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .score-box {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 14px;
          padding: 1rem;
          text-align: center;
        }

        .score-val {
          font-size: 1.55rem;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .score-lbl {
          font-size: 0.66rem;
          color: #819693;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.24rem;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
        }

        .table-wrap {
          overflow-x: auto;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 14px;
          background: #ffffff;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          font-size: 0.66rem;
          color: #819693;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.78rem 0.85rem;
          text-align: left;
          border-bottom: 1px solid rgba(23,56,56,0.08);
          font-weight: 900;
          background: rgba(23,56,56,0.025);
          font-family: 'Inter', sans-serif;
        }

        .table td {
          font-size: 0.82rem;
          color: #5f7774;
          padding: 0.78rem 0.85rem;
          border-bottom: 1px solid rgba(23,56,56,0.06);
          font-family: 'Inter', sans-serif;
        }

        .table tr:last-child td {
          border-bottom: none;
        }

        .lead-name {
          font-weight: 900;
          color: #173838;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          font-weight: 900;
          padding: 0.18rem 0.55rem;
          border-radius: 100px;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }

        .campaign {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.9rem 0;
          border-bottom: 1px solid rgba(23,56,56,0.08);
        }

        .campaign:last-child {
          border-bottom: none;
        }

        .campaign-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .campaign-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(143,200,193,0.16);
          border: 1px solid rgba(143,200,193,0.30);
          color: #2f625d;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .campaign-name {
          font-size: 0.88rem;
          font-weight: 900;
          color: #173838;
        }

        .campaign-meta {
          font-size: 0.74rem;
          color: #819693;
          font-family: 'Inter', sans-serif;
          margin-top: 0.15rem;
        }

        .campaign-status {
          font-size: 0.7rem;
          font-weight: 900;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }

        .empty {
          text-align: center;
          padding: 2rem;
          color: #819693;
          font-size: 0.84rem;
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 14px;
        }

        .footer {
          text-align: center;
          padding: 2rem 1rem 0;
          font-size: 0.74rem;
          color: #819693;
          font-family: 'Inter', sans-serif;
        }

        @media(max-width:720px) {
          .portal-nav {
            padding: 0 1rem;
          }

          .brand-sub {
            display: none;
          }

          .client-name {
            display: none;
          }

          .container {
            padding: 2rem 1rem 3rem;
          }

          .tabs {
            width: 100%;
          }

          .tab {
            flex: 1;
          }

          .score-grid {
            grid-template-columns: 1fr;
          }

          .campaign {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <nav className="portal-nav">
        <div className="portal-logo">
          <span className="brand-mark" />
          <div className="brand-text">
            <div className="brand-name">{agencyName}</div>
            <div className="brand-sub">Client Portal powered by LeadMagnet Inc</div>
          </div>
        </div>

        <div className="client-pill">
          <div className="client-avatar">{client.name?.charAt(0).toUpperCase()}</div>
          <span className="client-name">{client.name}</span>
        </div>
      </nav>

      <div className="container">
        <div className="welcome">
          <div className="page-kicker">
            <span className="kicker-icon"><Icon name="dashboard" size={14} /></span>
            Client Portal
          </div>

          <h1>Welcome, {client.name}</h1>
          <p>Your lead generation dashboard — updated in real time by {agencyName}.</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            className={`tab ${activeTab === "leads" ? "active" : ""}`}
            onClick={() => setActiveTab("leads")}
          >
            Leads ({totalLeads})
          </button>

          <button
            className={`tab ${activeTab === "campaigns" ? "active" : ""}`}
            onClick={() => setActiveTab("campaigns")}
          >
            Campaigns ({campaigns.length})
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="stats">
              <div className="stat">
                <div className="stat-icon"><Icon name="leads" /></div>
                <div className="stat-val">{totalLeads}</div>
                <div className="stat-lbl">Total Leads</div>
              </div>

              <div className="stat">
                <div className="stat-icon"><Icon name="leads" /></div>
                <div className="stat-val">{thisMonthLeads}</div>
                <div className="stat-lbl">This Month</div>
              </div>

              <div className="stat">
                <div className="stat-icon"><Icon name="hot" /></div>
                <div className="stat-val" style={{ color: "#ef4444" }}>{hotLeads}</div>
                <div className="stat-lbl">Hot Leads</div>
              </div>

              <div className="stat">
                <div className="stat-icon"><Icon name="warm" /></div>
                <div className="stat-val" style={{ color: "#b45309" }}>{warmLeads}</div>
                <div className="stat-lbl">Warm Leads</div>
              </div>

              <div className="stat">
                <div className="stat-icon"><Icon name="campaign" /></div>
                <div className="stat-val">{activeCampaigns}</div>
                <div className="stat-lbl">Active Campaigns</div>
              </div>
            </div>

            <div className="section">
              <div className="section-title">Account Health</div>

              <div className="health-wrap">
                <div className="health-top">
                  <span className="health-label">Overall Score</span>
                  <span style={{ color: healthColor }}>{health}/100</span>
                </div>

                <div className="health-bar">
                  <div className="health-fill" style={{ width: `${health}%`, background: healthColor }} />
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-title">Lead Score Breakdown</div>

              <div className="score-grid">
                <div className="score-box">
                  <div className="score-val" style={{ color: "#ef4444" }}>{hotLeads}</div>
                  <div className="score-lbl">Hot — Ready to Buy</div>
                </div>

                <div className="score-box">
                  <div className="score-val" style={{ color: "#b45309" }}>{warmLeads}</div>
                  <div className="score-lbl">Warm — Interested</div>
                </div>

                <div className="score-box">
                  <div className="score-val" style={{ color: "#2563eb" }}>{coldLeads}</div>
                  <div className="score-lbl">Cold — Nurturing</div>
                </div>
              </div>
            </div>

            {leads.length > 0 && (
              <div className="section">
                <div className="section-title">Recent Leads</div>

                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Company</th>
                        <th>Score</th>
                        <th>Added</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leads.slice(0, 5).map((lead) => {
                        const badge = getScoreBadge(lead.lead_score);

                        return (
                          <tr key={lead.id}>
                            <td className="lead-name">{lead.name || "Unknown"}</td>
                            <td>{lead.company || "—"}</td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  background: badge.bg,
                                  border: `1px solid ${badge.border}`,
                                  color: badge.color,
                                }}
                              >
                                {badge.label}
                              </span>
                            </td>
                            <td style={{ color: "#819693", fontSize: "0.75rem" }}>{getTimeAgo(lead.created_at)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "leads" && (
          <div className="section">
            <div className="section-title">All Leads ({totalLeads})</div>

            {leads.length === 0 ? (
              <div className="empty">No leads collected yet. Your agency is setting things up.</div>
            ) : (
              <div className="table-wrap">
                <table className="table" style={{ minWidth: "680px" }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Headline</th>
                      <th>Company</th>
                      <th>Score</th>
                      <th>Added</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leads.map((lead) => {
                      const badge = getScoreBadge(lead.lead_score);

                      return (
                        <tr key={lead.id}>
                          <td className="lead-name">{lead.name || "Unknown"}</td>
                          <td style={{ maxWidth: "240px", fontSize: "0.78rem" }}>
                            {lead.headline?.slice(0, 58) || "—"}
                            {lead.headline?.length > 58 ? "..." : ""}
                          </td>
                          <td>{lead.company || "—"}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background: badge.bg,
                                border: `1px solid ${badge.border}`,
                                color: badge.color,
                              }}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td style={{ color: "#819693", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                            {getTimeAgo(lead.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="section">
            <div className="section-title">Campaigns ({campaigns.length})</div>

            {campaigns.length === 0 ? (
              <div className="empty">No campaigns running yet. Your agency is preparing your first campaign.</div>
            ) : (
              campaigns.map((campaign) => {
                const isInstagram = campaign.platform === "instagram";

                return (
                  <div className="campaign" key={campaign.id}>
                    <div className="campaign-left">
                      <div className="campaign-icon">
                        <Icon name={isInstagram ? "instagram" : "linkedin"} />
                      </div>

                      <div>
                        <div className="campaign-name">
                          {isInstagram ? "Instagram Campaign" : "LinkedIn Campaign"}
                        </div>
                        <div className="campaign-meta">
                          {campaign.leads_count || 0} leads collected · Created {getTimeAgo(campaign.created_at)}
                        </div>
                      </div>
                    </div>

                    <span
                      className="campaign-status"
                      style={{
                        background: campaign.status === "Active" ? "rgba(143,200,193,0.18)" : "rgba(245,158,11,0.10)",
                        border: campaign.status === "Active" ? "1px solid rgba(143,200,193,0.34)" : "1px solid rgba(245,158,11,0.24)",
                        color: campaign.status === "Active" ? "#2f625d" : "#b45309",
                      }}
                    >
                      {campaign.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="footer">
          Powered by {agencyName} · Client portal updates in real time
        </div>
      </div>
    </main>
  );
}

const stateStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .state-page {
    min-height: 100vh;
    background: #FBF3E3;
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    color: #173838;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .state-card {
    width: 100%;
    max-width: 460px;
    background: linear-gradient(145deg,#ffffff,#f8fbfa);
    border: 1px solid rgba(23,56,56,0.08);
    box-shadow: 0 24px 60px rgba(23,56,56,0.10);
    border-radius: 24px;
    padding: 2.2rem;
    text-align: center;
  }

  .state-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(255,127,103,0.10);
    border: 1px solid rgba(255,127,103,0.22);
    color: #ff7f67;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  .state-title {
    font-size: 1.35rem;
    font-weight: 900;
    color: #173838;
    margin-bottom: 0.45rem;
    letter-spacing: -0.03em;
  }

  .state-sub {
    font-size: 0.9rem;
    color: #5f7774;
    line-height: 1.6;
    font-family: 'Inter', sans-serif;
  }
`;