"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
    // Find client by portal token
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

    // Get agency name
    const { data: profile } = await supabase
      .from("profiles")
      .select("agency_name")
      .eq("user_id", clientData.agency_user_id)
      .maybeSingle();

    setAgencyName(profile?.agency_name || "Your Agency");

    // Get leads
    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("client_id", clientData.id)
      .order("created_at", { ascending: false });

    setLeads(leadsData || []);

    // Get campaigns
    const { data: campaignsData } = await supabase
      .from("campaigns")
      .select("*")
      .eq("client_id", clientData.id)
      .order("created_at", { ascending: false });

    setCampaigns(campaignsData || []);
    setLoadingState("loaded");
  };

  if (loadingState === "loading") {
    return (
      <main style={{ minHeight: "100vh", background: "#060a07", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", color: "#22c97a", fontWeight: 800, marginBottom: "0.5rem" }}>Loading your portal...</div>
          <div style={{ fontSize: "0.85rem", color: "#3d5240" }}>Please wait a moment</div>
        </div>
      </main>
    );
  }

  if (loadingState === "not_found") {
    return (
      <main style={{ minHeight: "100vh", background: "#060a07", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
          <div style={{ fontSize: "1.3rem", color: "#f0f7f2", fontWeight: 800, marginBottom: "0.5rem" }}>Portal Not Found</div>
          <div style={{ fontSize: "0.85rem", color: "#3d5240", maxWidth: "320px" }}>This portal link is invalid or has expired. Contact your agency for a new link.</div>
        </div>
      </main>
    );
  }

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.lead_score === "hot").length;
  const warmLeads = leads.filter(l => l.lead_score === "warm").length;
  const coldLeads = leads.filter(l => l.lead_score === "cold").length;
  const activeCampaigns = campaigns.filter(c => c.status === "Active").length;
  const health = client.health_score || 75;
  const healthColor = health >= 75 ? "#22c97a" : health >= 40 ? "#fbbf24" : "#f87171";

  const thisMonthLeads = leads.filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const getScoreBadge = (score) => {
    if (score === "hot") return { label: "🔥 Hot", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", color: "#f87171" };
    if (score === "warm") return { label: "🟡 Warm", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", color: "#fbbf24" };
    if (score === "cold") return { label: "🔵 Cold", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", color: "#60a5fa" };
    return { label: "—", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.06)", color: "#3d5240" };
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <main style={{ minHeight: "100vh", background: "#060a07", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .p-nav{background:rgba(8,14,10,0.85);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.05);padding:0 1.75rem;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .p-logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#22c97a;display:flex;align-items:center;gap:0.4rem;}
        .p-logo-dot{width:8px;height:8px;background:#22c97a;border-radius:50%;box-shadow:0 0 10px rgba(34,201,122,0.5);}
        .p-client-pill{display:flex;align-items:center;gap:0.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:100px;padding:0.3rem 0.85rem 0.3rem 0.3rem;}
        .p-client-avatar{width:28px;height:28px;background:linear-gradient(135deg,#22c97a,#0d9456);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:#fff;}
        .p-client-name{font-size:0.78rem;color:#6b7f70;font-weight:500;font-family:'Inter',sans-serif;}
        .p-container{max-width:960px;margin:0 auto;padding:2rem 1.5rem 3rem;}
        .p-welcome{margin-bottom:2rem;}
        .p-welcome h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.035em;margin-bottom:0.2rem;}
        .p-welcome p{font-size:0.84rem;color:#3d5240;font-family:'Inter',sans-serif;}
        .p-tabs{display:flex;gap:0.35rem;margin-bottom:2rem;background:rgba(12,21,16,0.6);padding:0.25rem;border-radius:10px;width:fit-content;}
        .p-tab{background:transparent;border:none;color:#3d5240;font-size:0.82rem;padding:0.5rem 1.15rem;border-radius:8px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;transition:all 0.15s;}
        .p-tab.active{background:rgba(34,201,122,0.1);color:#22c97a;}
        .p-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.75rem;margin-bottom:2rem;}
        .p-stat{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1.15rem 1.25rem;text-align:center;}
        .p-stat-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.75rem;font-weight:800;line-height:1;letter-spacing:-0.04em;}
        .p-stat-lbl{font-size:0.68rem;color:#3d5240;margin-top:0.3rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Inter',sans-serif;font-weight:600;}
        .p-section{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1.5rem;margin-bottom:1rem;}
        .p-section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#c4d4c8;margin-bottom:1.25rem;}
        .p-health-wrap{margin-bottom:0.5rem;}
        .p-health-top{display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.4rem;font-family:'Inter',sans-serif;}
        .p-health-bar{height:6px;background:rgba(255,255,255,0.04);border-radius:100px;overflow:hidden;}
        .p-health-fill{height:100%;border-radius:100px;}
        .p-table{width:100%;border-collapse:collapse;}
        .p-table th{font-size:0.66rem;color:#2a3d2e;text-transform:uppercase;letter-spacing:0.1em;padding:0.75rem 0.875rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.04);font-weight:700;background:rgba(0,0,0,0.2);font-family:'Inter',sans-serif;}
        .p-table td{font-size:0.82rem;color:#8fa696;padding:0.75rem 0.875rem;border-bottom:1px solid rgba(255,255,255,0.025);font-family:'Inter',sans-serif;}
        .p-table tr:last-child td{border-bottom:none;}
        .p-table tr:hover td{background:rgba(34,201,122,0.02);}
        .p-lead-name{font-weight:600;color:#e2ede7;font-family:'Plus Jakarta Sans',sans-serif;}
        .p-badge{display:inline-flex;align-items:center;gap:0.25rem;font-size:0.7rem;font-weight:700;padding:0.175rem 0.55rem;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;}
        .p-campaign{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid rgba(255,255,255,0.03);}
        .p-campaign:last-child{border-bottom:none;}
        .p-campaign-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.84rem;font-weight:700;color:#e2ede7;}
        .p-campaign-meta{font-size:0.72rem;color:#3d5240;font-family:'Inter',sans-serif;margin-top:0.15rem;}
        .p-campaign-status{font-size:0.7rem;font-weight:700;padding:0.175rem 0.6rem;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;}
        .p-empty{text-align:center;padding:2rem;color:#2a3d2e;font-size:0.84rem;font-family:'Inter',sans-serif;}
        .p-footer{text-align:center;padding:2rem 1rem;font-size:0.72rem;color:#1e2e22;font-family:'Inter',sans-serif;}
        @media(max-width:600px){.p-container{padding:1.5rem 1rem;}.p-stats{grid-template-columns:repeat(2,1fr);}}
      `}</style>

      <nav className="p-nav">
        <div className="p-logo"><span className="p-logo-dot"></span> {agencyName}</div>
        <div className="p-client-pill">
          <div className="p-client-avatar">{client.name?.charAt(0).toUpperCase()}</div>
          <span className="p-client-name">{client.name}</span>
        </div>
      </nav>

      <div className="p-container">
        <div className="p-welcome">
          <h1>Welcome, {client.name}</h1>
          <p>Your lead generation dashboard — updated in real time by {agencyName}.</p>
        </div>

        <div className="p-tabs">
          <button className={`p-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
          <button className={`p-tab ${activeTab === "leads" ? "active" : ""}`} onClick={() => setActiveTab("leads")}>Leads ({totalLeads})</button>
          <button className={`p-tab ${activeTab === "campaigns" ? "active" : ""}`} onClick={() => setActiveTab("campaigns")}>Campaigns ({campaigns.length})</button>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="p-stats">
              <div className="p-stat"><div className="p-stat-val" style={{ color: "#22c97a" }}>{totalLeads}</div><div className="p-stat-lbl">Total Leads</div></div>
              <div className="p-stat"><div className="p-stat-val" style={{ color: "#22c97a" }}>{thisMonthLeads}</div><div className="p-stat-lbl">This Month</div></div>
              <div className="p-stat"><div className="p-stat-val" style={{ color: "#f87171" }}>{hotLeads}</div><div className="p-stat-lbl">🔥 Hot Leads</div></div>
              <div className="p-stat"><div className="p-stat-val" style={{ color: "#fbbf24" }}>{warmLeads}</div><div className="p-stat-lbl">🟡 Warm</div></div>
              <div className="p-stat"><div className="p-stat-val" style={{ color: "#22c97a" }}>{activeCampaigns}</div><div className="p-stat-lbl">Campaigns</div></div>
            </div>

            <div className="p-section">
              <div className="p-section-title">Account Health</div>
              <div className="p-health-wrap">
                <div className="p-health-top">
                  <span style={{ color: "#3d5240" }}>Overall Score</span>
                  <span style={{ color: healthColor, fontWeight: 700 }}>{health}/100</span>
                </div>
                <div className="p-health-bar">
                  <div className="p-health-fill" style={{ width: `${health}%`, background: healthColor }} />
                </div>
              </div>
            </div>

            <div className="p-section">
              <div className="p-section-title">AI Lead Score Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem" }}>
                <div style={{ background: "#080c09", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "10px", padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#f87171" }}>{hotLeads}</div>
                  <div style={{ fontSize: "0.7rem", color: "#3d5240", textTransform: "uppercase", marginTop: "0.2rem", fontFamily: "Inter,sans-serif", fontWeight: 600 }}>🔥 Hot — Ready to Buy</div>
                </div>
                <div style={{ background: "#080c09", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "10px", padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fbbf24" }}>{warmLeads}</div>
                  <div style={{ fontSize: "0.7rem", color: "#3d5240", textTransform: "uppercase", marginTop: "0.2rem", fontFamily: "Inter,sans-serif", fontWeight: 600 }}>🟡 Warm — Interested</div>
                </div>
                <div style={{ background: "#080c09", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "10px", padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#60a5fa" }}>{coldLeads}</div>
                  <div style={{ fontSize: "0.7rem", color: "#3d5240", textTransform: "uppercase", marginTop: "0.2rem", fontFamily: "Inter,sans-serif", fontWeight: 600 }}>🔵 Cold — Nurturing</div>
                </div>
              </div>
            </div>

            {leads.length > 0 && (
              <div className="p-section">
                <div className="p-section-title">Recent Leads</div>
                <div style={{ overflowX: "auto" }}>
                  <table className="p-table">
                    <thead><tr><th>Name</th><th>Company</th><th>Score</th><th>Added</th></tr></thead>
                    <tbody>
                      {leads.slice(0, 5).map(l => {
                        const badge = getScoreBadge(l.lead_score);
                        return (
                          <tr key={l.id}>
                            <td className="p-lead-name">{l.name || "Unknown"}</td>
                            <td style={{ color: "#4d6b54" }}>{l.company || "—"}</td>
                            <td><span className="p-badge" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>{badge.label}</span></td>
                            <td style={{ color: "#2a3d2e", fontSize: "0.75rem" }}>{getTimeAgo(l.created_at)}</td>
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

        {/* LEADS */}
        {activeTab === "leads" && (
          <div className="p-section">
            <div className="p-section-title">All Leads ({totalLeads})</div>
            {leads.length === 0 ? (
              <div className="p-empty">No leads collected yet. Your agency is setting things up!</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="p-table" style={{ minWidth: "600px" }}>
                  <thead><tr><th>Name</th><th>Headline</th><th>Company</th><th>Score</th><th>Added</th></tr></thead>
                  <tbody>
                    {leads.map(l => {
                      const badge = getScoreBadge(l.lead_score);
                      return (
                        <tr key={l.id}>
                          <td className="p-lead-name">{l.name || "Unknown"}</td>
                          <td style={{ color: "#4d6b54", maxWidth: "200px", fontSize: "0.78rem" }}>{l.headline?.slice(0, 50) || "—"}{l.headline?.length > 50 ? "..." : ""}</td>
                          <td style={{ color: "#4d6b54" }}>{l.company || "—"}</td>
                          <td><span className="p-badge" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>{badge.label}</span></td>
                          <td style={{ color: "#2a3d2e", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{getTimeAgo(l.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CAMPAIGNS */}
        {activeTab === "campaigns" && (
          <div className="p-section">
            <div className="p-section-title">Your Campaigns ({campaigns.length})</div>
            {campaigns.length === 0 ? (
              <div className="p-empty">No campaigns running yet. Your agency is preparing your first campaign!</div>
            ) : campaigns.map(c => (
              <div className="p-campaign" key={c.id}>
                <div>
                  <div className="p-campaign-name">{c.platform === "instagram" ? "📸 Instagram" : "💼 LinkedIn"} Campaign</div>
                  <div className="p-campaign-meta">{c.leads_count || 0} leads collected · Created {getTimeAgo(c.created_at)}</div>
                </div>
                <span className="p-campaign-status" style={{
                  background: c.status === "Active" ? "rgba(34,201,122,0.08)" : "rgba(251,191,36,0.06)",
                  border: `1px solid ${c.status === "Active" ? "rgba(34,201,122,0.18)" : "rgba(251,191,36,0.15)"}`,
                  color: c.status === "Active" ? "#22c97a" : "#fbbf24",
                }}>{c.status}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-footer">
          Powered by {agencyName} · Portal updates in real time
        </div>
      </div>
    </main>
  );
}
