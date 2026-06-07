"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [postUrl, setPostUrl] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [campaignPlatform, setCampaignPlatform] = useState("linkedin");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [analyticsRange, setAnalyticsRange] = useState("7d");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      loadCampaigns(data.user.id);
      loadAllLeads(data.user.id);
    });
  }, []);

  const loadCampaigns = async (userId) => {
    const { data } = await supabase.from("campaigns").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (data) setCampaigns(data);
  };

  const loadLeads = async (campaignId) => {
    const { data } = await supabase.from("leads").select("*").eq("campaign_id", campaignId).order("created_at", { ascending: false });
    if (data) setLeads(data);
  };

  const loadAllLeads = async (userId) => {
    const { data } = await supabase.from("leads").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (data) setAllLeads(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scrape_post", postUrl, dmMessage, userId: user.id, platform: campaignPlatform }),
      });
      const data = await response.json();
      if (data.success) {
        const { data: campaign } = await supabase.from("campaigns").insert({
          user_id: user.id, post_url: postUrl, dm_message: dmMessage,
          status: "Active", container_id: data.containerId, platform: campaignPlatform
        }).select().single();
        if (campaign) setCampaigns(prev => [campaign, ...prev]);
        setPostUrl(""); setDmMessage(""); setShowNewCampaign(false);
        setSuccess(`🚀 ${campaignPlatform === "linkedin" ? "LinkedIn" : "Instagram"} campaign started!`);
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError("Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  const handleViewLeads = (campaign) => {
    setSelectedCampaign(prev => prev?.id === campaign.id ? null : campaign);
    loadLeads(campaign.id);
  };

  const exportLeadsCSV = () => {
    const headers = ["Name", "Headline", "Company", "Location", "Email", "LinkedIn", "Collected"];
    const rows = allLeads.map(l => [l.name, l.headline, l.company, l.location, l.email, l.linkedin_url, new Date(l.created_at).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v || ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads.csv"; a.click();
  };

  const archiveLead = async (id) => {
    await supabase.from("leads").delete().eq("id", id);
    setAllLeads(prev => prev.filter(l => l.id !== id));
  };

  const getDailyLeads = () => {
    const days = analyticsRange === "7d" ? 7 : analyticsRange === "14d" ? 14 : 30;
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const count = allLeads.filter(l => new Date(l.created_at).toDateString() === date.toDateString()).length;
      result.push({ date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), count });
    }
    return result;
  };

  const getLeadsInRange = (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return allLeads.filter(l => new Date(l.created_at) >= cutoff).length;
  };

  const totalLeads = allLeads.length;
  const totalDms = campaigns.reduce((a, c) => a + (c.dms_sent || 0), 0);
  const filteredLeads = allLeads.filter(l => {
    if (!leadSearch) return true;
    const s = leadSearch.toLowerCase();
    return l.name?.toLowerCase().includes(s) || l.headline?.toLowerCase().includes(s) || l.company?.toLowerCase().includes(s) || l.location?.toLowerCase().includes(s);
  });
  const dailyLeads = getDailyLeads();
  const maxCount = Math.max(...dailyLeads.map(d => d.count), 1);

  const platformBtn = (id, icon, label) => ({
    type: "button",
    onClick: () => setCampaignPlatform(id),
    style: {
      flex: 1, padding: "0.75rem", borderRadius: "10px",
      border: `1px solid ${campaignPlatform === id ? "rgba(34,201,122,0.5)" : "rgba(255,255,255,0.08)"}`,
      background: campaignPlatform === id ? "rgba(34,201,122,0.08)" : "transparent",
      color: campaignPlatform === id ? "#22c97a" : "#4d6b54",
      cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.875rem",
      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "all 0.15s"
    }
  });

  return (
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 1.5rem;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;letter-spacing:-0.02em;}
        .nav-right{display:flex;align-items:center;gap:0.75rem;}
        .user-pill{display:flex;align-items:center;gap:0.5rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:100px;padding:0.3rem 0.75rem 0.3rem 0.3rem;}
        .user-avatar{width:26px;height:26px;background:linear-gradient(135deg,#22c97a,#15803d);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#fff;}
        .user-email{font-size:0.78rem;color:#94a3b8;font-weight:500;}
        .logout-btn{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#64748b;font-size:0.78rem;padding:0.35rem 0.75rem;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .logout-btn:hover{border-color:rgba(255,255,255,0.15);color:#94a3b8;}
        .layout{display:flex;flex:1;min-height:calc(100vh - 56px);}
        .sidebar{width:232px;background:#0b120d;border-right:1px solid rgba(255,255,255,0.06);padding:1.25rem 0.875rem;display:flex;flex-direction:column;gap:2px;position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto;}
        .sidebar-section{font-size:0.65rem;font-weight:600;color:#3d5240;text-transform:uppercase;letter-spacing:0.1em;padding:0.75rem 0.625rem 0.375rem;margin-top:0.25rem;}
        .sidebar-section:first-child{margin-top:0;}
        .nav-item{display:flex;align-items:center;gap:0.625rem;padding:0.5rem 0.625rem;border-radius:8px;cursor:pointer;font-size:0.845rem;color:#6b7f70;transition:all 0.12s;border:none;background:transparent;width:100%;text-align:left;font-family:'Inter',sans-serif;font-weight:500;position:relative;}
        .nav-item:hover{background:rgba(255,255,255,0.04);color:#c4d4c8;}
        .nav-item.active{background:rgba(34,201,122,0.1);color:#22c97a;font-weight:600;}
        .nav-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:16px;background:#22c97a;border-radius:0 3px 3px 0;}
        .nav-icon{font-size:0.9rem;width:18px;text-align:center;flex-shrink:0;}
        .nav-badge{margin-left:auto;background:rgba(34,201,122,0.15);color:#22c97a;font-size:0.68rem;font-weight:600;padding:0.1rem 0.45rem;border-radius:100px;}
        .sidebar-footer{margin-top:auto;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.06);}
        .plan-pill{background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.15);border-radius:10px;padding:0.625rem 0.75rem;margin-top:0.5rem;}
        .plan-name{font-size:0.78rem;font-weight:600;color:#22c97a;}
        .plan-sub{font-size:0.68rem;color:#4d6b54;margin-top:1px;}
        .content{flex:1;padding:2rem 2rem 3rem;max-width:1020px;}
        .page-header{margin-bottom:1.75rem;}
        .page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:700;color:#f0f7f2;letter-spacing:-0.03em;margin-bottom:0.25rem;}
        .page-sub{font-size:0.855rem;color:#4d6b54;font-weight:400;}
        .success-bar{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.2);color:#22c97a;font-size:0.835rem;padding:0.75rem 1rem;border-radius:10px;margin-bottom:1.5rem;display:flex;align-items:center;gap:0.5rem;}
        .error-bar{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171;font-size:0.835rem;padding:0.75rem 1rem;border-radius:10px;margin-bottom:1.5rem;}
        .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0.875rem;margin-bottom:2rem;}
        .stat-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.125rem 1.25rem;position:relative;overflow:hidden;}
        .stat-card::after{content:'';position:absolute;top:0;right:0;width:60px;height:60px;background:radial-gradient(circle at top right,rgba(34,201,122,0.06),transparent 70%);pointer-events:none;}
        .stat-icon{font-size:1.1rem;margin-bottom:0.625rem;display:block;}
        .stat-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.75rem;font-weight:700;color:#f0f7f2;line-height:1;margin-bottom:0.3rem;letter-spacing:-0.03em;}
        .stat-lbl{font-size:0.72rem;color:#3d5240;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;}
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
        .section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.975rem;font-weight:700;color:#c4d4c8;letter-spacing:-0.01em;}
        .btn-primary{background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.835rem;padding:0.55rem 1.1rem;border-radius:9px;border:none;cursor:pointer;transition:all 0.15s;letter-spacing:-0.01em;}
        .btn-primary:hover{background:#1db36c;transform:translateY(-1px);}
        .btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .btn-outline{background:transparent;border:1px solid rgba(255,255,255,0.1);color:#6b7f70;font-family:'Inter',sans-serif;font-weight:500;font-size:0.815rem;padding:0.45rem 0.875rem;border-radius:8px;cursor:pointer;transition:all 0.15s;}
        .btn-outline:hover{border-color:rgba(34,201,122,0.3);color:#22c97a;}
        .btn-danger{background:transparent;border:1px solid rgba(239,68,68,0.2);color:#f87171;font-family:'Inter',sans-serif;font-weight:500;font-size:0.78rem;padding:0.3rem 0.65rem;border-radius:7px;cursor:pointer;transition:all 0.15s;}
        .btn-danger:hover{background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.4);}
        .campaign-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.25rem;margin-bottom:0.75rem;transition:border-color 0.15s;}
        .campaign-card:hover{border-color:rgba(34,201,122,0.15);}
        .campaign-top{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;}
        .campaign-url{font-size:0.815rem;color:#22c97a;font-weight:500;margin-bottom:0.35rem;word-break:break-all;line-height:1.4;}
        .campaign-msg{font-size:0.775rem;color:#3d5240;font-weight:400;font-style:italic;}
        .campaign-meta{display:flex;align-items:center;gap:1rem;flex-shrink:0;}
        .meta-stat{text-align:center;}
        .meta-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:700;color:#c4d4c8;display:block;}
        .meta-lbl{font-size:0.65rem;color:#3d5240;text-transform:uppercase;letter-spacing:0.08em;}
        .status-pill{font-size:0.7rem;padding:0.2rem 0.625rem;border-radius:100px;font-weight:600;background:rgba(34,201,122,0.1);border:1px solid rgba(34,201,122,0.2);color:#22c97a;letter-spacing:0.02em;}
        .status-pill.paused{background:rgba(251,191,36,0.08);border-color:rgba(251,191,36,0.2);color:#fbbf24;}
        .platform-pill{font-size:0.68rem;padding:0.15rem 0.5rem;border-radius:100px;font-weight:600;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:#6b7f70;}
        .campaign-footer{display:flex;align-items:center;gap:0.5rem;margin-top:0.875rem;padding-top:0.875rem;border-top:1px solid rgba(255,255,255,0.04);}
        .empty-state{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:3rem 2rem;text-align:center;}
        .empty-icon{font-size:2.25rem;margin-bottom:0.875rem;display:block;}
        .empty-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;font-weight:700;color:#c4d4c8;margin-bottom:0.4rem;}
        .empty-sub{font-size:0.835rem;color:#3d5240;font-weight:400;margin-bottom:1.5rem;line-height:1.5;}
        .table-wrap{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;}
        .leads-table{width:100%;border-collapse:collapse;}
        .leads-table th{font-size:0.68rem;color:#3d5240;text-transform:uppercase;letter-spacing:0.09em;padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.05);font-weight:600;background:#0b120d;}
        .leads-table td{font-size:0.835rem;color:#c4d4c8;padding:0.875rem 1rem;border-bottom:1px solid rgba(255,255,255,0.04);}
        .leads-table tr:last-child td{border-bottom:none;}
        .leads-table tr:hover td{background:rgba(34,201,122,0.03);}
        .lead-name{font-weight:600;color:#e2ede7;}
        .lead-sub{font-size:0.72rem;color:#3d5240;margin-top:2px;}
        .search-row{display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap;}
        .search-input{flex:1;min-width:200px;background:#0f1a11;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.65rem 1rem;color:#e2ede7;font-size:0.845rem;outline:none;font-family:'Inter',sans-serif;transition:border-color 0.15s;}
        .search-input:focus{border-color:rgba(34,201,122,0.3);}
        .search-input::placeholder{color:#2a3d2e;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem;backdrop-filter:blur(4px);}
        .modal{background:#0f1a11;border:1px solid rgba(255,255,255,0.09);border-radius:18px;padding:1.875rem;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;}
        .modal-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.2rem;font-weight:700;color:#f0f7f2;margin-bottom:0.3rem;letter-spacing:-0.02em;}
        .modal-sub{font-size:0.835rem;color:#3d5240;margin-bottom:1.5rem;line-height:1.5;}
        .form-label{display:block;font-size:0.775rem;font-weight:600;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.02em;}
        .form-input{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;transition:border-color 0.15s;}
        .form-input:focus{border-color:rgba(34,201,122,0.35);}
        .form-textarea{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;resize:vertical;min-height:110px;transition:border-color 0.15s;}
        .form-textarea:focus{border-color:rgba(34,201,122,0.35);}
        .modal-btns{display:flex;gap:0.75rem;margin-top:0.25rem;}
        .modal-cancel{flex:1;background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-family:'Inter',sans-serif;font-weight:500;font-size:0.875rem;padding:0.75rem;border-radius:10px;cursor:pointer;}
        .modal-cancel:hover{border-color:rgba(255,255,255,0.15);color:#6b7f70;}
        .modal-submit{flex:2;background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.875rem;padding:0.75rem;border-radius:10px;border:none;cursor:pointer;transition:background 0.15s;}
        .modal-submit:hover{background:#1db36c;}
        .modal-submit:disabled{opacity:0.5;cursor:not-allowed;}
        .var-tags{display:flex;gap:0.375rem;flex-wrap:wrap;margin-bottom:0.625rem;}
        .var-tag{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.18);color:#22c97a;font-size:0.72rem;padding:0.2rem 0.55rem;border-radius:6px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;transition:background 0.12s;}
        .var-tag:hover{background:rgba(34,201,122,0.15);}
        .range-tabs{display:flex;gap:0.375rem;margin-bottom:1.75rem;}
        .range-tab{background:transparent;border:1px solid rgba(255,255,255,0.07);color:#3d5240;font-size:0.815rem;padding:0.4rem 0.875rem;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;transition:all 0.15s;}
        .range-tab.active{background:rgba(34,201,122,0.1);border-color:rgba(34,201,122,0.25);color:#22c97a;font-weight:600;}
        .analytics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.875rem;margin-bottom:1.75rem;}
        .analytics-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.125rem 1.25rem;}
        .analytics-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.875rem;font-weight:700;color:#22c97a;line-height:1;margin-bottom:0.3rem;}
        .analytics-lbl{font-size:0.72rem;color:#3d5240;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;}
        .analytics-sub{font-size:0.72rem;color:#2a3d2e;margin-top:0.3rem;}
        .chart-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.5rem;margin-bottom:1.25rem;}
        .chart-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:700;color:#c4d4c8;margin-bottom:1.5rem;}
        .bar-chart{display:flex;align-items:flex-end;gap:0.375rem;height:140px;}
        .bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:0.35rem;}
        .bar{width:100%;background:rgba(34,201,122,0.15);border-radius:5px 5px 0 0;min-height:4px;transition:background 0.15s;}
        .bar:hover{background:rgba(34,201,122,0.4);}
        .bar-val{font-size:0.65rem;color:#22c97a;font-weight:600;}
        .bar-label{font-size:0.6rem;color:#2a3d2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:36px;text-align:center;}
        .location-row{display:flex;align-items:center;gap:0.875rem;margin-bottom:0.75rem;}
        .location-name{font-size:0.835rem;color:#c4d4c8;min-width:180px;}
        .location-bar-wrap{flex:1;background:rgba(255,255,255,0.04);border-radius:4px;height:7px;overflow:hidden;}
        .location-bar{background:linear-gradient(90deg,#22c97a,#15803d);height:100%;border-radius:4px;}
        .location-count{font-size:0.78rem;color:#22c97a;font-weight:600;min-width:20px;text-align:right;}
        .info-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.375rem 1.5rem;margin-bottom:0.75rem;}
        .info-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#e2ede7;margin-bottom:0.875rem;}
        .info-row{display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.04);}
        .info-row:last-child{border-bottom:none;}
        .info-key{font-size:0.815rem;color:#3d5240;font-weight:500;}
        .info-val{font-size:0.815rem;color:#94a3b8;font-weight:500;}
        .no-leads{font-size:0.815rem;color:#2a3d2e;padding:1.25rem;text-align:center;font-style:italic;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <div className="nav-right">
          <div className="user-pill">
            <div className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</div>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign out</button>
        </div>
      </nav>

      <div className="layout">
        <div className="sidebar">
          <div className="sidebar-section">Main</div>
          {[
            { id: "campaigns", icon: "⚡", label: "Campaigns" },
            { id: "leads", icon: "👥", label: "All Leads", badge: allLeads.length || null },
            { id: "analytics", icon: "📊", label: "Analytics" },
          ].map(item => (
            <button key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </button>
          ))}

          <div className="sidebar-section">Platforms</div>
          {[
            { label: "LinkedIn", icon: "💼", href: "/linkedin" },
            { label: "Instagram", icon: "📸", href: "/instagram" },
            { label: "Gmail", icon: "📧", href: "/gmail" },
          ].map(p => (
            <button key={p.href} className="nav-item" onClick={() => window.location.href = p.href}>
              <span className="nav-icon">{p.icon}</span>{p.label}
            </button>
          ))}

          <div className="sidebar-section">Agency</div>
          <button className="nav-item" onClick={() => window.location.href = "/agency"}>
            <span className="nav-icon">🏢</span>Client Manager
          </button>

          <div className="sidebar-section">Account</div>
          <button className={`nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
            <span className="nav-icon">⚙️</span>Settings
          </button>
          <button className={`nav-item ${activeTab === "billing" ? "active" : ""}`} onClick={() => setActiveTab("billing")}>
            <span className="nav-icon">💳</span>Billing
          </button>
          <button className="nav-item" onClick={() => window.location.href = "/contact"}>
            <span className="nav-icon">💬</span>Support
          </button>

          <div className="sidebar-footer">
            <div className="plan-pill">
              <div className="plan-name">Free Trial</div>
              <div className="plan-sub">7 days remaining</div>
            </div>
          </div>
        </div>

        <div className="content">
          {success && <div className="success-bar">✓ {success}</div>}
          {error && <div className="error-bar">⚠ {error}</div>}

          {/* CAMPAIGNS */}
          {activeTab === "campaigns" && (
            <>
              <div className="page-header">
                <h1 className="page-title">Campaigns</h1>
                <p className="page-sub">Manage your LinkedIn and Instagram lead generation automations</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card"><span className="stat-icon">⚡</span><div className="stat-val">{campaigns.length}</div><div className="stat-lbl">Active Campaigns</div></div>
                <div className="stat-card"><span className="stat-icon">👥</span><div className="stat-val">{totalLeads}</div><div className="stat-lbl">Total Leads</div></div>
                <div className="stat-card"><span className="stat-icon">💬</span><div className="stat-val">{totalDms}</div><div className="stat-lbl">DMs Sent</div></div>
                <div className="stat-card"><span className="stat-icon">⏳</span><div className="stat-val">7</div><div className="stat-lbl">Trial Days Left</div></div>
              </div>
              <div className="section-header">
                <span className="section-title">Your Campaigns</span>
                <button className="btn-primary" onClick={() => setShowNewCampaign(true)}>+ New Campaign</button>
              </div>
              {campaigns.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🚀</span>
                  <div className="empty-title">No campaigns yet</div>
                  <div className="empty-sub">Create your first campaign to start automating your LinkedIn or Instagram lead magnet DMs.</div>
                  <button className="btn-primary" onClick={() => setShowNewCampaign(true)}>Create your first campaign</button>
                </div>
              ) : campaigns.map(c => (
                <div className="campaign-card" key={c.id}>
                  <div className="campaign-top">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                        <span className="platform-pill">{c.platform === "instagram" ? "📸 Instagram" : "💼 LinkedIn"}</span>
                      </div>
                      <div className="campaign-url">{c.post_url}</div>
                      <div className="campaign-msg">"{c.dm_message?.slice(0, 70)}..."</div>
                    </div>
                    <div className="campaign-meta">
                      <div className="meta-stat"><span className="meta-val">{c.leads_count || 0}</span><span className="meta-lbl">Leads</span></div>
                      <div className="meta-stat"><span className="meta-val">{c.dms_sent || 0}</span><span className="meta-lbl">DMs</span></div>
                      <span className={`status-pill ${c.status === "Paused" ? "paused" : ""}`}>{c.status}</span>
                    </div>
                  </div>
                  <div className="campaign-footer">
                    <button className="btn-outline" onClick={() => handleViewLeads(c)}>
                      {selectedCampaign?.id === c.id ? "Hide leads ▲" : "View leads ▼"}
                    </button>
                    <span style={{ fontSize: "0.72rem", color: "#2a3d2e", marginLeft: "auto" }}>Created {new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  {selectedCampaign?.id === c.id && (
                    leads.length === 0 ? (
                      <div className="no-leads">No leads collected yet — automation is running...</div>
                    ) : (
                      <div className="table-wrap" style={{ marginTop: "1rem" }}>
                        <table className="leads-table">
                          <thead><tr><th>Name</th><th>Headline</th><th>LinkedIn</th><th>Collected</th></tr></thead>
                          <tbody>
                            {leads.map(lead => (
                              <tr key={lead.id}>
                                <td className="lead-name">{lead.name}</td>
                                <td style={{ fontSize: "0.775rem", color: "#3d5240", maxWidth: "220px" }}>{lead.headline?.slice(0, 55)}...</td>
                                <td><a href={lead.linkedin_url} target="_blank" style={{ color: "#22c97a", fontSize: "0.775rem" }}>View →</a></td>
                                <td style={{ fontSize: "0.72rem", color: "#2a3d2e" }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </div>
              ))}
            </>
          )}

          {/* ALL LEADS */}
          {activeTab === "leads" && (
            <>
              <div className="page-header">
                <h1 className="page-title">All Leads</h1>
                <p className="page-sub">Every contact collected across all your campaigns</p>
              </div>
              <div className="search-row">
                <input className="search-input" placeholder="Search by name, headline, company or location..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)} />
                <button className="btn-primary" onClick={exportLeadsCSV}>↓ Export CSV</button>
              </div>
              {filteredLeads.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">👥</span>
                  <div className="empty-title">No leads yet</div>
                  <div className="empty-sub">Create a campaign to start collecting leads.</div>
                </div>
              ) : (
                <div className="table-wrap" style={{ overflowX: "auto" }}>
                  <table className="leads-table" style={{ minWidth: "800px" }}>
                    <thead><tr><th>Name</th><th>Headline</th><th>Company</th><th>Location</th><th>LinkedIn</th><th>Collected</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredLeads.map(lead => (
                        <tr key={lead.id}>
                          <td><div className="lead-name">{lead.name}</div>{lead.email && <div className="lead-sub">{lead.email}</div>}</td>
                          <td style={{ maxWidth: "200px", fontSize: "0.775rem", color: "#4d6b54" }}>{lead.headline?.slice(0, 55)}{lead.headline?.length > 55 ? "..." : ""}</td>
                          <td style={{ fontSize: "0.815rem", color: "#4d6b54" }}>{lead.company || "—"}</td>
                          <td style={{ fontSize: "0.815rem", color: "#4d6b54" }}>{lead.location || "—"}</td>
                          <td>{lead.linkedin_url ? <a href={lead.linkedin_url} target="_blank" style={{ color: "#22c97a", fontSize: "0.775rem" }}>View →</a> : "—"}</td>
                          <td style={{ fontSize: "0.72rem", color: "#2a3d2e", whiteSpace: "nowrap" }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                          <td><div style={{ display: "flex", gap: "0.375rem" }}><button className="btn-outline" style={{ fontSize: "0.72rem", padding: "0.25rem 0.55rem" }} onClick={() => window.open(lead.linkedin_url, "_blank")}>DM</button><button className="btn-danger" onClick={() => archiveLead(lead.id)}>Archive</button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <>
              <div className="page-header">
                <h1 className="page-title">Analytics</h1>
                <p className="page-sub">Track your lead generation performance over time</p>
              </div>
              <div className="range-tabs">
                {["7d", "14d", "30d"].map(r => (
                  <button key={r} className={`range-tab ${analyticsRange === r ? "active" : ""}`} onClick={() => setAnalyticsRange(r)}>
                    {r === "7d" ? "7 days" : r === "14d" ? "14 days" : "30 days"}
                  </button>
                ))}
              </div>
              <div className="analytics-grid">
                <div className="analytics-card"><div className="analytics-val">{getLeadsInRange(analyticsRange === "7d" ? 7 : analyticsRange === "14d" ? 14 : 30)}</div><div className="analytics-lbl">New Leads</div><div className="analytics-sub">in selected period</div></div>
                <div className="analytics-card"><div className="analytics-val">{campaigns.length}</div><div className="analytics-lbl">Campaigns</div><div className="analytics-sub">running automations</div></div>
                <div className="analytics-card"><div className="analytics-val">{totalLeads}</div><div className="analytics-lbl">Total Leads</div><div className="analytics-sub">all time</div></div>
                <div className="analytics-card"><div className="analytics-val">{totalDms}</div><div className="analytics-lbl">DMs Sent</div><div className="analytics-sub">all time</div></div>
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
                {allLeads.length === 0 ? <div style={{ color: "#2a3d2e", fontSize: "0.835rem" }}>No data yet</div> : (() => {
                  const lc = {};
                  allLeads.forEach(l => { const loc = l.location || "Unknown"; lc[loc] = (lc[loc] || 0) + 1; });
                  return Object.entries(lc).sort((a, b) => b[1] - a[1]).map(([loc, count]) => (
                    <div key={loc} className="location-row">
                      <div className="location-name">{loc}</div>
                      <div className="location-bar-wrap"><div className="location-bar" style={{ width: `${(count / allLeads.length) * 100}%` }} /></div>
                      <div className="location-count">{count}</div>
                    </div>
                  ));
                })()}
              </div>
            </>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <>
              <div className="page-header"><h1 className="page-title">Settings</h1><p className="page-sub">Manage your account and preferences</p></div>
              <div className="info-card">
                <div className="info-title">Account Details</div>
                <div className="info-row"><span className="info-key">Email address</span><span className="info-val">{user?.email}</span></div>
                <div className="info-row"><span className="info-key">Member since</span><span className="info-val">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</span></div>
                <div className="info-row"><span className="info-key">Account status</span><span className="info-val" style={{ color: "#22c97a" }}>Active</span></div>
              </div>
            </>
          )}

          {/* BILLING */}
          {activeTab === "billing" && (
            <>
              <div className="page-header"><h1 className="page-title">Billing</h1><p className="page-sub">Manage your subscription and payment details</p></div>
              <div className="info-card">
                <div className="info-title">Current Plan</div>
                <div className="info-row"><span className="info-key">Plan</span><span className="info-val">Free Trial</span></div>
                <div className="info-row"><span className="info-key">Days remaining</span><span className="info-val" style={{ color: "#22c97a" }}>7 days</span></div>
                <div className="info-row"><span className="info-key">Next billing</span><span className="info-val">—</span></div>
                <div style={{ marginTop: "1.25rem" }}><button className="btn-primary" onClick={() => window.location.href = "/pricing"}>Upgrade to Pro →</button></div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* NEW CAMPAIGN MODAL */}
      {showNewCampaign && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">New Campaign</div>
            <div className="modal-sub">Choose your platform and write the DM message your leads will receive automatically.</div>
            <form onSubmit={handleCreateCampaign}>
              <label className="form-label">Platform</label>
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                <button {...platformBtn("linkedin", "💼", "LinkedIn")} type="button">💼 LinkedIn</button>
                <button {...platformBtn("instagram", "📸", "Instagram")} type="button">📸 Instagram</button>
              </div>
              <label className="form-label">{campaignPlatform === "linkedin" ? "LinkedIn" : "Instagram"} Post URL</label>
              <input className="form-input" type="url" placeholder={campaignPlatform === "linkedin" ? "https://linkedin.com/posts/..." : "https://instagram.com/p/..."} value={postUrl} onChange={e => setPostUrl(e.target.value)} required />
              <label className="form-label">DM Message</label>
              <div className="var-tags">
                {["[Name]", "[Post]", "[Link]"].map(tag => (
                  <span key={tag} className="var-tag" onClick={() => setDmMessage(prev => prev + tag)}>{tag}</span>
                ))}
              </div>
              <textarea className="form-textarea" placeholder="Hey [Name], thanks for commenting! Here's the resource I promised: [Link]" value={dmMessage} onChange={e => setDmMessage(e.target.value)} required />
              <div className="modal-btns">
                <button type="button" className="modal-cancel" onClick={() => { setShowNewCampaign(false); setCampaignPlatform("linkedin"); }}>Cancel</button>
                <button type="submit" className="modal-submit" disabled={loading}>{loading ? "Starting..." : `Start ${campaignPlatform === "linkedin" ? "LinkedIn" : "Instagram"} Campaign →`}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
