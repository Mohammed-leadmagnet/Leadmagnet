"use client";

import { useEffect, useState } from "react";
import AppNavigator from "@/app/components/AppNavigator";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LeadsPage() {
  const [user, setUser] = useState(null);
  const [allLeads, setAllLeads] = useState([]);
  const [agencyClients, setAgencyClients] = useState([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);
      loadAllLeads(data.user.id);
      loadAgencyClients(data.user.id);
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

  const loadAgencyClients = async (userId) => {
    const { data } = await supabase
      .from("agency_clients")
      .select("*")
      .eq("agency_user_id", userId)
      .order("name", { ascending: true });

    if (data) setAgencyClients(data);
  };

  const getClientName = (clientId) => {
    if (!clientId) return null;
    const client = agencyClients.find(c => c.id === clientId);
    return client?.name || null;
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
    if (score === "hot") return { emoji: "🔥", label: "Hot", bg: "rgba(255,127,103,0.10)", border: "rgba(255,127,103,0.20)", color: "#ff7f67" };
    if (score === "warm") return { emoji: "🟡", label: "Warm", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.22)", color: "#b45309" };
    if (score === "cold") return { emoji: "🔵", label: "Cold", bg: "rgba(143,200,193,0.18)", border: "rgba(143,200,193,0.34)", color: "#2f625d" };
    return { emoji: "—", label: "N/A", bg: "rgba(23,56,56,0.04)", border: "rgba(23,56,56,0.10)", color: "#819693" };
  };

  const exportLeadsCSV = () => {
    const headers = ["Name", "Headline", "Company", "Location", "Email", "Score", "Score Reason", "Client", "LinkedIn", "Collected"];

    const rows = allLeads.map(l => {
      const client = agencyClients.find(c => c.id === l.client_id);

      return [
        l.name,
        l.headline,
        l.company,
        l.location,
        l.email,
        l.lead_score || "—",
        l.lead_score_reason || "—",
        client?.name || "—",
        l.linkedin_url,
        new Date(l.created_at).toLocaleDateString(),
      ];
    });

    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${v || ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  const archiveLead = async (id) => {
    await supabase.from("leads").delete().eq("id", id);
    setAllLeads(prev => prev.filter(l => l.id !== id));
  };

  const hotCount = allLeads.filter(l => l.lead_score === "hot").length;
  const warmCount = allLeads.filter(l => l.lead_score === "warm").length;
  const coldCount = allLeads.filter(l => l.lead_score === "cold").length;
  const totalLeads = allLeads.length;

  const filteredLeads = allLeads.filter(l => {
    if (scoreFilter !== "all" && l.lead_score !== scoreFilter) return false;
    if (!leadSearch) return true;

    const s = leadSearch.toLowerCase();

    return (
      l.name?.toLowerCase().includes(s) ||
      l.headline?.toLowerCase().includes(s) ||
      l.company?.toLowerCase().includes(s) ||
      l.location?.toLowerCase().includes(s)
    );
  });

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

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:0.85rem;
          margin-bottom:1.25rem;
        }

        .stat-card{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.08);
          border-radius:18px;
          padding:1.25rem;
          box-shadow:0 16px 34px rgba(23,56,56,0.05);
        }

        .stat-val{
          font-size:1.9rem;
          font-weight:900;
          color:#ff7f67;
          line-height:1;
          letter-spacing:-0.05em;
        }

        .stat-lbl{
          font-size:0.7rem;
          color:#819693;
          font-weight:900;
          text-transform:uppercase;
          letter-spacing:0.08em;
          margin-top:0.35rem;
        }

        .search-row{
          display:flex;
          gap:0.75rem;
          margin-bottom:0.875rem;
          flex-wrap:wrap;
        }

        .search-input{
          flex:1;
          min-width:200px;
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.12);
          border-radius:12px;
          padding:0.75rem 1rem;
          color:#173838;
          font-size:0.84rem;
          outline:none;
          font-family:'Inter',sans-serif;
        }

        .search-input:focus{
          border-color:rgba(255,127,103,0.35);
          box-shadow:0 0 0 4px rgba(255,127,103,0.08);
        }

        .btn-primary{
          background:#ff7f67;
          color:#173838;
          font-weight:900;
          font-size:0.82rem;
          padding:0.65rem 1.15rem;
          border-radius:12px;
          border:none;
          cursor:pointer;
          box-shadow:0 14px 28px rgba(255,127,103,0.22);
        }

        .filter-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:1.25rem;
          flex-wrap:wrap;
          gap:0.5rem;
        }

        .score-filters{
          display:flex;
          gap:0.35rem;
          flex-wrap:wrap;
        }

        .score-filter-btn{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.10);
          color:#5f7774;
          font-size:0.78rem;
          padding:0.42rem 0.8rem;
          border-radius:10px;
          cursor:pointer;
          font-weight:800;
          display:flex;
          align-items:center;
          gap:0.3rem;
        }

        .score-filter-btn.active{
          background:rgba(255,127,103,0.10);
          border-color:rgba(255,127,103,0.24);
          color:#ff7f67;
        }

        .table-wrap{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.08);
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 16px 34px rgba(23,56,56,0.05);
        }

        .leads-table{
          width:100%;
          border-collapse:collapse;
        }

        .leads-table th{
          font-size:0.66rem;
          color:#819693;
          text-transform:uppercase;
          letter-spacing:0.1em;
          padding:0.75rem 1rem;
          text-align:left;
          border-bottom:1px solid rgba(23,56,56,0.08);
          font-weight:900;
          background:#FBF3E3;
        }

        .leads-table td{
          font-size:0.82rem;
          color:#5f7774;
          padding:0.875rem 1rem;
          border-bottom:1px solid rgba(23,56,56,0.06);
        }

        .leads-table tr:hover td{
          background:rgba(255,127,103,0.03);
        }

        .lead-name{
          font-weight:900;
          color:#173838;
        }

        .lead-sub{
          font-size:0.7rem;
          color:#819693;
          margin-top:2px;
        }

        .score-badge{
          display:inline-flex;
          align-items:center;
          gap:0.3rem;
          font-size:0.72rem;
          font-weight:900;
          padding:0.22rem 0.6rem;
          border-radius:100px;
          white-space:nowrap;
        }

        .score-badge-tooltip{
          position:relative;
        }

        .score-badge-tooltip .score-tooltip{
          display:none;
          position:absolute;
          bottom:calc(100% + 6px);
          left:50%;
          transform:translateX(-50%);
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.10);
          border-radius:10px;
          padding:0.6rem 0.75rem;
          font-size:0.72rem;
          color:#5f7774;
          width:220px;
          text-align:center;
          z-index:20;
          box-shadow:0 12px 30px rgba(23,56,56,0.10);
          line-height:1.4;
        }

        .score-badge-tooltip:hover .score-tooltip{
          display:block;
        }

        .client-tag{
          display:inline-flex;
          font-size:0.68rem;
          font-weight:800;
          padding:0.18rem 0.55rem;
          border-radius:100px;
          background:rgba(167,139,250,0.12);
          border:1px solid rgba(167,139,250,0.24);
          color:#7c3aed;
          white-space:nowrap;
        }

        .btn-outline{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.10);
          color:#5f7774;
          font-weight:800;
          font-size:0.72rem;
          padding:0.25rem 0.55rem;
          border-radius:9px;
          cursor:pointer;
        }

        .btn-danger{
          background:#ffffff;
          border:1px solid rgba(239,68,68,0.18);
          color:#ef4444;
          font-size:0.72rem;
          padding:0.25rem 0.55rem;
          border-radius:9px;
          cursor:pointer;
          font-weight:800;
        }

        .empty-state{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.08);
          border-radius:18px;
          padding:3.5rem 2rem;
          text-align:center;
          box-shadow:0 16px 34px rgba(23,56,56,0.05);
        }

        .empty-icon{
          font-size:2.5rem;
          margin-bottom:1rem;
          display:block;
        }

        .empty-title{
          font-size:1.05rem;
          font-weight:900;
          color:#173838;
          margin-bottom:0.4rem;
        }

        .empty-sub{
          font-size:0.84rem;
          color:#5f7774;
          line-height:1.55;
        }

        @media(max-width:1150px){
          .page{grid-template-columns:1fr;}
        }

        @media(max-width:900px){
          .stats-grid{grid-template-columns:repeat(2,1fr);}
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
          <h1 className="page-title">All Leads</h1>
          <p className="page-sub">Every contact collected across all your campaigns.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-val">{totalLeads}</div><div className="stat-lbl">Total Leads</div></div>
          <div className="stat-card"><div className="stat-val">{hotCount}</div><div className="stat-lbl">Hot Leads</div></div>
          <div className="stat-card"><div className="stat-val">{warmCount}</div><div className="stat-lbl">Warm Leads</div></div>
          <div className="stat-card"><div className="stat-val">{coldCount}</div><div className="stat-lbl">Cold Leads</div></div>
        </div>

        <div className="search-row">
          <input
            className="search-input"
            placeholder="Search by name, headline, company or location..."
            value={leadSearch}
            onChange={e => setLeadSearch(e.target.value)}
          />

          <button className="btn-primary" onClick={exportLeadsCSV}>↓ Export CSV</button>
        </div>

        <div className="filter-row">
          <div className="score-filters">
            {[
              { id: "all", label: "All", count: totalLeads },
              { id: "hot", label: "🔥 Hot", count: hotCount },
              { id: "warm", label: "🟡 Warm", count: warmCount },
              { id: "cold", label: "🔵 Cold", count: coldCount },
            ].map(f => (
              <button
                key={f.id}
                className={`score-filter-btn ${scoreFilter === f.id ? "active" : ""}`}
                onClick={() => setScoreFilter(f.id)}
              >
                {f.label} <span>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">👥</span>
            <div className="empty-title">{scoreFilter !== "all" ? `No ${scoreFilter} leads yet` : "No leads yet"}</div>
            <div className="empty-sub">{scoreFilter !== "all" ? "Try a different filter or wait for more leads." : "Create a campaign to start collecting leads."}</div>
          </div>
        ) : (
          <div className="table-wrap" style={{ overflowX: "auto" }}>
            <table className="leads-table" style={{ minWidth: "950px" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Headline</th>
                  <th>Company</th>
                  <th>Score</th>
                  <th>Client</th>
                  <th>Location</th>
                  <th>LinkedIn</th>
                  <th>Collected</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map(lead => {
                  const badge = getScoreBadge(lead.lead_score);
                  const clientName = getClientName(lead.client_id);

                  return (
                    <tr key={lead.id}>
                      <td>
                        <div className="lead-name">{lead.name}</div>
                        {lead.email && <div className="lead-sub">{lead.email}</div>}
                      </td>

                      <td style={{ maxWidth: "180px" }}>
                        {lead.headline?.slice(0, 50)}{lead.headline?.length > 50 ? "..." : ""}
                      </td>

                      <td>{lead.company || "—"}</td>

                      <td>
                        <div className="score-badge-tooltip">
                          <span className="score-badge" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
                            {badge.emoji} {badge.label}
                          </span>
                          {lead.lead_score_reason && <div className="score-tooltip">{lead.lead_score_reason}</div>}
                        </div>
                      </td>

                      <td>
                        {clientName ? <span className="client-tag">🏢 {clientName}</span> : <span style={{ color: "#819693" }}>—</span>}
                      </td>

                      <td>{lead.location || "—"}</td>

                      <td>
                        {lead.linkedin_url ? (
                          <a href={lead.linkedin_url} target="_blank" style={{ color: "#ff7f67", fontWeight: 800 }}>
                            View →
                          </a>
                        ) : "—"}
                      </td>

                      <td style={{ color: "#819693", whiteSpace: "nowrap" }}>{getTimeAgo(lead.created_at)}</td>

                      <td>
                        <div style={{ display: "flex", gap: "0.375rem" }}>
                          <button className="btn-outline" onClick={() => window.open(lead.linkedin_url, "_blank")}>
                            DM
                          </button>
                          <button className="btn-danger" onClick={() => archiveLead(lead.id)}>Archive</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
