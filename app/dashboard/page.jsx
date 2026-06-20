"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Icon({ name }) {
  const common = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
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
    analytics: (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-7" />
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
    gmail: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    clients: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10" />
        <path d="M7 12h6" />
        <path d="M7 16h8" />
      </svg>
    ),
    radar: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m12 12 5-5" />
      </svg>
    ),
    blog: (
      <svg {...common}>
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
    settings: (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="m4.93 4.93 2.12 2.12" />
        <path d="m16.95 16.95 2.12 2.12" />
        <path d="m19.07 4.93-2.12 2.12" />
        <path d="m7.05 16.95-2.12 2.12" />
      </svg>
    ),
    billing: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    support: (
      <svg {...common}>
        <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    ),
    campaign: (
      <svg {...common}>
        <path d="M4 13a8 8 0 0 1 8-8h8" />
        <path d="M16 3h4v4" />
        <path d="M20 11a8 8 0 0 1-8 8H4" />
        <path d="M8 21H4v-4" />
      </svg>
    ),
  };

  return icons[name];
}

function BrandLogo() {
  return (
    <a href="/" className="logo">
      <span className="brand-mark" />
      <span className="brand-name">
        <span className="lead">lead</span>
        <span className="magnet">magnet</span> inc
      </span>
    </a>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [agencyClients, setAgencyClients] = useState([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("campaigns");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [postUrl, setPostUrl] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [campaignPlatform, setCampaignPlatform] = useState("linkedin");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [analyticsRange, setAnalyticsRange] = useState("7d");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }
      setUser(data.user);
      loadCampaigns(data.user.id);
      loadAllLeads(data.user.id);
      loadAgencyClients(data.user.id);
    });
  }, []);

  const loadCampaigns = async (userId) => {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setCampaigns(data);
  };

  const loadLeads = async (campaignId) => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false });
    if (data) setLeads(data);
  };

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
        body: JSON.stringify({
          action: "scrape_post",
          postUrl,
          dmMessage,
          userId: user.id,
          platform: campaignPlatform,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const insertData = {
          user_id: user.id,
          post_url: postUrl,
          dm_message: dmMessage,
          status: "Active",
          container_id: data.containerId,
          platform: campaignPlatform,
        };

        if (selectedClientId) insertData.client_id = selectedClientId;

        const { data: campaign } = await supabase
          .from("campaigns")
          .insert(insertData)
          .select()
          .single();

        if (campaign) setCampaigns(prev => [campaign, ...prev]);

        setPostUrl("");
        setDmMessage("");
        setShowNewCampaign(false);
        setSelectedClientId("");
        setSuccess(`${campaignPlatform === "linkedin" ? "LinkedIn" : "Instagram"} campaign started successfully!`);
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

  const getCampaignName = (campaign, index) => {
    const platform = campaign.platform === "instagram" ? "Instagram" : "LinkedIn";

    try {
      const url = new URL(campaign.post_url);
      const parts = url.pathname.split("/").filter(Boolean);

      if (campaign.platform === "instagram" && parts.length >= 2) {
        return `${platform} Campaign — Post ${parts[1]?.slice(0, 8)}`;
      }

      if (parts.length >= 2) {
        const slug = parts[1]?.split("-").slice(0, 5).join(" ");
        if (slug && slug.length > 3) {
          return slug.charAt(0).toUpperCase() + slug.slice(1);
        }
      }
    } catch {}

    return `${platform} Campaign #${index + 1}`;
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getUserName = () => {
    if (!user?.email) return "";
    return user.email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const getScoreBadge = (score) => {
    if (score === "hot") return { emoji: "🔥", label: "Hot", bg: "rgba(255,127,103,0.10)", border: "rgba(255,127,103,0.20)", color: "#ff7f67" };
    if (score === "warm") return { emoji: "🟡", label: "Warm", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.22)", color: "#b45309" };
    if (score === "cold") return { emoji: "🔵", label: "Cold", bg: "rgba(143,200,193,0.18)", border: "rgba(143,200,193,0.34)", color: "#2f625d" };
    return { emoji: "—", label: "N/A", bg: "rgba(23,56,56,0.04)", border: "rgba(23,56,56,0.10)", color: "#819693" };
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

  const dailyLeads = getDailyLeads();
  const maxCount = Math.max(...dailyLeads.map(d => d.count), 1);

  const platformBtn = (id) => ({
    type: "button",
    onClick: () => setCampaignPlatform(id),
    style: {
      flex: 1,
      padding: "0.75rem",
      borderRadius: "12px",
      border: `1px solid ${campaignPlatform === id ? "rgba(255,127,103,0.35)" : "rgba(23,56,56,0.10)"}`,
      background: campaignPlatform === id ? "rgba(255,127,103,0.10)" : "#ffffff",
      color: campaignPlatform === id ? "#ff7f67" : "#5f7774",
      cursor: "pointer",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 900,
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      transition: "all 0.2s",
    },
  });

  return (
    <main className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        *{box-sizing:border-box;margin:0;padding:0;}

        .page{
          min-height:100vh;
          background:#FBF3E3;
          font-family:'Plus Jakarta Sans','Inter',sans-serif;
          color:#173838;
          display:flex;
          flex-direction:column;
        }

        .nav{
          background:rgba(255,255,255,0.94);
          backdrop-filter:blur(18px);
          border-bottom:1px solid rgba(23,56,56,0.08);
          padding:0 1.5rem;
          height:72px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          position:sticky;
          top:0;
          z-index:50;
          box-shadow:0 10px 30px rgba(23,56,56,0.04);
        }

        .logo{
          display:flex;
          align-items:center;
          gap:0.62rem;
          text-decoration:none;
        }

        .brand-mark{
          width:30px;
          height:30px;
          border-radius:50%;
          background:conic-gradient(from -12deg,#ff7f67 0 44%,transparent 44% 51%,#8fc8c1 51% 86%,transparent 86% 100%);
          position:relative;
          flex:0 0 auto;
        }

        .brand-mark:after{
          content:"";
          position:absolute;
          inset:8px;
          border-radius:50%;
          background:#ffffff;
        }

        .brand-name{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:1.06rem;
          font-weight:900;
          letter-spacing:-0.035em;
          color:#173838;
          line-height:1;
        }

        .brand-name .lead{color:#ff7f67;}
        .brand-name .magnet{color:#8fc8c1;}

        .nav-right{
          display:flex;
          align-items:center;
          gap:0.75rem;
        }

        .user-pill{
          display:flex;
          align-items:center;
          gap:0.5rem;
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.10);
          border-radius:100px;
          padding:0.3rem 0.85rem 0.3rem 0.3rem;
        }

        .user-avatar{
          width:28px;
          height:28px;
          background:rgba(255,127,103,0.10);
          border:1px solid rgba(255,127,103,0.18);
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:0.72rem;
          font-weight:900;
          color:#ff7f67;
        }

        .user-email{
          font-size:0.78rem;
          color:#5f7774;
          font-weight:800;
          font-family:'Inter',sans-serif;
        }

        .logout-btn{
          background:#ffffff;
          border:1px solid rgba(239,68,68,0.18);
          color:#ef4444;
          font-size:0.78rem;
          padding:0.5rem 0.9rem;
          border-radius:12px;
          cursor:pointer;
          font-family:'Inter',sans-serif;
          font-weight:900;
        }

        .logout-btn:hover{
          background:rgba(239,68,68,0.06);
        }

        .layout{
          display:flex;
          flex:1;
          min-height:calc(100vh - 72px);
        }

        .sidebar{
          width:230px;
          background:rgba(255,255,255,0.72);
          border-right:1px solid rgba(23,56,56,0.08);
          padding:1.2rem 0.85rem;
          display:flex;
          flex-direction:column;
          gap:1px;
          position:sticky;
          top:72px;
          height:calc(100vh - 72px);
          overflow-y:auto;
        }

        .sidebar-section{
          font-size:0.68rem;
          font-weight:900;
          color:#819693;
          text-transform:uppercase;
          letter-spacing:0.12em;
          padding:1rem 0.55rem 0.5rem;
          margin-top:0.125rem;
        }

        .sidebar-section:first-child{
          margin-top:0;
          padding-top:0.25rem;
        }

        .nav-item{
          display:flex;
          align-items:center;
          gap:0.7rem;
          min-height:40px;
          border-radius:12px;
          cursor:pointer;
          font-size:0.86rem;
          color:#5f7774;
          transition:all 0.15s;
          border:1px solid transparent;
          background:transparent;
          width:100%;
          text-align:left;
          font-family:'Inter',sans-serif;
          font-weight:800;
          position:relative;
          padding:0 0.7rem;
          text-decoration:none;
          margin-bottom:0.25rem;
        }

        .nav-item:hover,
        .nav-item.active{
          background:rgba(255,127,103,0.12);
          color:#ff7f67;
          border-color:rgba(255,127,103,0.22);
        }

        .nav-icon{
          width:18px;
          height:18px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
          color:currentColor;
        }

        .nav-icon svg{
          width:18px;
          height:18px;
        }

        .nav-badge{
          margin-left:auto;
          background:rgba(255,127,103,0.10);
          color:#ff7f67;
          font-size:0.65rem;
          font-weight:900;
          padding:0.1rem 0.5rem;
          border-radius:100px;
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        .sidebar-footer{
          margin-top:auto;
          padding-top:1rem;
          border-top:1px solid rgba(23,56,56,0.08);
        }

        .plan-pill{
          background:rgba(143,200,193,0.18);
          border:1px solid rgba(143,200,193,0.34);
          border-radius:14px;
          padding:0.7rem 0.85rem;
          margin-top:0.5rem;
        }

        .plan-name{
          font-size:0.78rem;
          font-weight:900;
          color:#2f625d;
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        .plan-sub{
          font-size:0.68rem;
          color:#819693;
          margin-top:2px;
          font-family:'Inter',sans-serif;
        }

        .content{
          flex:1;
          padding:2rem 2.25rem 3rem;
          max-width:1060px;
        }

        .welcome-section{
          margin-bottom:2rem;
        }

        .welcome-greeting{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:1.9rem;
          font-weight:900;
          color:#173838;
          letter-spacing:-0.055em;
        }

        .welcome-sub{
          font-size:0.9rem;
          color:#5f7774;
          margin-top:0.35rem;
          font-family:'Inter',sans-serif;
        }

        .page-header{
          margin-bottom:1.75rem;
        }

        .page-title{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:1.65rem;
          font-weight:900;
          color:#173838;
          letter-spacing:-0.045em;
          margin-bottom:0.2rem;
        }

        .page-sub{
          font-size:0.86rem;
          color:#5f7774;
          font-family:'Inter',sans-serif;
        }

        .success-bar{
          background:rgba(143,200,193,0.18);
          border:1px solid rgba(143,200,193,0.36);
          color:#2f625d;
          font-size:0.82rem;
          padding:0.75rem 1rem;
          border-radius:12px;
          margin-bottom:1.5rem;
          font-family:'Inter',sans-serif;
          font-weight:800;
        }

        .error-bar{
          background:rgba(239,68,68,0.07);
          border:1px solid rgba(239,68,68,0.18);
          color:#ef4444;
          font-size:0.82rem;
          padding:0.75rem 1rem;
          border-radius:12px;
          margin-bottom:1.5rem;
          font-family:'Inter',sans-serif;
          font-weight:800;
        }

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:0.85rem;
          margin-bottom:2rem;
        }

        .stat-card{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.08);
          border-radius:18px;
          padding:1.25rem;
          position:relative;
          overflow:hidden;
          box-shadow:0 16px 34px rgba(23,56,56,0.05);
        }

        .stat-card:hover{
          border-color:rgba(255,127,103,0.20);
        }

        .stat-icon-wrap{
          width:34px;
          height:34px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:0.9rem;
          margin-bottom:0.875rem;
          background:rgba(255,127,103,0.10);
          border:1px solid rgba(255,127,103,0.18);
        }

        .stat-icon-blue{
          background:rgba(143,200,193,0.18);
          border-color:rgba(143,200,193,0.34);
        }

        .stat-icon-red{
          background:rgba(255,127,103,0.10);
          border-color:rgba(255,127,103,0.18);
        }

        .stat-icon-amber{
          background:rgba(245,158,11,0.10);
          border-color:rgba(245,158,11,0.24);
        }

        .stat-val{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:1.9rem;
          font-weight:900;
          color:#ff7f67;
          line-height:1;
          margin-bottom:0.25rem;
          letter-spacing:-0.05em;
        }

        .stat-lbl{
          font-size:0.7rem;
          color:#819693;
          font-weight:900;
          text-transform:uppercase;
          letter-spacing:0.08em;
          font-family:'Inter',sans-serif;
        }

        .section-header{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:1.125rem;
        }

        .section-title{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:1rem;
          font-weight:900;
          color:#173838;
        }

        .btn-primary{
          background:#ff7f67;
          color:#173838;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:900;
          font-size:0.82rem;
          padding:0.6rem 1.15rem;
          border-radius:12px;
          border:none;
          cursor:pointer;
          box-shadow:0 14px 28px rgba(255,127,103,0.22);
        }

        .btn-primary:hover{
          transform:translateY(-1px);
        }

        .btn-primary:disabled{
          opacity:0.5;
          cursor:not-allowed;
          transform:none;
        }

        .btn-outline{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.10);
          color:#5f7774;
          font-family:'Inter',sans-serif;
          font-weight:800;
          font-size:0.8rem;
          padding:0.45rem 0.85rem;
          border-radius:10px;
          cursor:pointer;
        }

        .btn-outline:hover{
          border-color:rgba(255,127,103,0.28);
          color:#ff7f67;
        }

        .btn-danger{
          background:#ffffff;
          border:1px solid rgba(239,68,68,0.18);
          color:#ef4444;
          font-size:0.75rem;
          padding:0.35rem 0.65rem;
          border-radius:9px;
          cursor:pointer;
          font-weight:800;
        }

        .btn-danger:hover{
          background:rgba(239,68,68,0.06);
        }

        .score-badge{
          display:inline-flex;
          align-items:center;
          gap:0.3rem;
          font-size:0.72rem;
          font-weight:900;
          padding:0.22rem 0.6rem;
          border-radius:100px;
          font-family:'Plus Jakarta Sans',sans-serif;
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
          font-weight:600;
          white-space:normal;
          width:220px;
          text-align:center;
          z-index:20;
          box-shadow:0 12px 30px rgba(23,56,56,0.10);
          font-family:'Inter',sans-serif;
          line-height:1.4;
        }

        .score-badge-tooltip:hover .score-tooltip{
          display:block;
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
          font-family:'Plus Jakarta Sans',sans-serif;
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

        .filter-count{
          font-size:0.65rem;
          opacity:0.75;
        }

        .client-tag{
          display:inline-flex;
          align-items:center;
          gap:0.25rem;
          font-size:0.68rem;
          font-weight:800;
          padding:0.18rem 0.55rem;
          border-radius:100px;
          background:rgba(167,139,250,0.12);
          border:1px solid rgba(167,139,250,0.24);
          color:#7c3aed;
          font-family:'Plus Jakarta Sans',sans-serif;
          white-space:nowrap;
          margin-left:0.4rem;
        }

        .campaign-card{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.08);
          border-radius:18px;
          padding:1.375rem;
          margin-bottom:0.75rem;
          box-shadow:0 16px 34px rgba(23,56,56,0.05);
        }

        .campaign-card:hover{
          border-color:rgba(255,127,103,0.18);
        }

        .campaign-top{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:1rem;
        }

        .campaign-info{
          flex:1;
          min-width:0;
        }

        .campaign-header-row{
          display:flex;
          align-items:center;
          gap:0.5rem;
          margin-bottom:0.5rem;
          flex-wrap:wrap;
        }

        .platform-icon{
          width:30px;
          height:30px;
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:0.85rem;
          flex-shrink:0;
        }

        .platform-icon.linkedin{
          background:rgba(10,102,194,0.08);
          border:1px solid rgba(10,102,194,0.16);
        }

        .platform-icon.instagram{
          background:rgba(228,64,95,0.08);
          border:1px solid rgba(228,64,95,0.16);
        }

        .campaign-name{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:0.98rem;
          font-weight:900;
          color:#173838;
        }

        .campaign-dm-preview{
          font-size:0.8rem;
          color:#5f7774;
          font-style:italic;
          margin-top:0.4rem;
          line-height:1.45;
          font-family:'Inter',sans-serif;
        }

        .campaign-right{
          display:flex;
          align-items:center;
          gap:1.25rem;
          flex-shrink:0;
        }

        .campaign-metric{
          text-align:center;
        }

        .campaign-metric-val{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:1.2rem;
          font-weight:900;
          color:#173838;
          display:block;
        }

        .campaign-metric-lbl{
          font-size:0.62rem;
          color:#819693;
          text-transform:uppercase;
          letter-spacing:0.1em;
          font-weight:900;
          font-family:'Inter',sans-serif;
        }

        .status-pill{
          font-size:0.7rem;
          padding:0.25rem 0.7rem;
          border-radius:100px;
          font-weight:900;
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        .status-active{
          background:rgba(143,200,193,0.18);
          border:1px solid rgba(143,200,193,0.34);
          color:#2f625d;
        }

        .status-paused{
          background:rgba(245,158,11,0.10);
          border:1px solid rgba(245,158,11,0.24);
          color:#b45309;
        }

        .campaign-footer{
          display:flex;
          align-items:center;
          gap:0.5rem;
          margin-top:1rem;
          padding-top:0.875rem;
          border-top:1px solid rgba(23,56,56,0.08);
        }

        .campaign-date{
          font-size:0.72rem;
          color:#819693;
          margin-left:auto;
          font-family:'Inter',sans-serif;
          font-weight:700;
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
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:1.05rem;
          font-weight:900;
          color:#173838;
          margin-bottom:0.4rem;
        }

        .empty-sub{
          font-size:0.84rem;
          color:#5f7774;
          margin-bottom:1.75rem;
          line-height:1.55;
          font-family:'Inter',sans-serif;
          max-width:360px;
          margin-left:auto;
          margin-right:auto;
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
          font-family:'Inter',sans-serif;
        }

        .leads-table td{
          font-size:0.82rem;
          color:#5f7774;
          padding:0.875rem 1rem;
          border-bottom:1px solid rgba(23,56,56,0.06);
          font-family:'Inter',sans-serif;
        }

        .leads-table tr:last-child td{
          border-bottom:none;
        }

        .leads-table tr:hover td{
          background:rgba(255,127,103,0.03);
        }

        .lead-name{
          font-weight:900;
          color:#173838;
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        .lead-sub{
          font-size:0.7rem;
          color:#819693;
          margin-top:2px;
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

        .search-input::placeholder{
          color:#819693;
        }

        .filter-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:1.25rem;
          flex-wrap:wrap;
          gap:0.5rem;
        }

        .modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(23,56,56,0.30);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:100;
          padding:1rem;
          backdrop-filter:blur(8px);
        }

        .modal{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.10);
          border-radius:24px;
          padding:1.8rem;
          width:100%;
          max-width:520px;
          max-height:90vh;
          overflow-y:auto;
          box-shadow:0 30px 80px rgba(23,56,56,0.18);
        }

        .modal-title{
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:1.35rem;
          font-weight:900;
          color:#173838;
          margin-bottom:0.25rem;
        }

        .modal-sub{
          font-size:0.84rem;
          color:#5f7774;
          margin-bottom:1.75rem;
          font-family:'Inter',sans-serif;
          line-height:1.55;
        }

        .form-label{
          display:block;
          font-size:0.75rem;
          font-weight:900;
          color:#2f625d;
          margin-bottom:0.4rem;
          text-transform:uppercase;
          font-family:'Inter',sans-serif;
          letter-spacing:0.05em;
        }

        .form-input,
        .form-select,
        .form-textarea{
          width:100%;
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.12);
          border-radius:12px;
          padding:0.78rem 1rem;
          color:#173838;
          font-size:0.875rem;
          outline:none;
          font-family:'Inter',sans-serif;
          margin-bottom:1rem;
        }

        .form-select option{
          background:#ffffff;
          color:#173838;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus{
          border-color:rgba(255,127,103,0.35);
          box-shadow:0 0 0 4px rgba(255,127,103,0.08);
        }

        .form-textarea{
          resize:vertical;
          min-height:110px;
        }

        .modal-btns{
          display:flex;
          gap:0.75rem;
          margin-top:0.5rem;
        }

        .modal-cancel{
          flex:1;
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.10);
          color:#2f625d;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:900;
          font-size:0.875rem;
          padding:0.75rem;
          border-radius:12px;
          cursor:pointer;
        }

        .modal-submit{
          flex:2;
          background:#ff7f67;
          color:#173838;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-weight:900;
          font-size:0.875rem;
          padding:0.75rem;
          border-radius:12px;
          border:none;
          cursor:pointer;
          box-shadow:0 14px 28px rgba(255,127,103,0.22);
        }

        .modal-submit:disabled{
          opacity:0.5;
          cursor:not-allowed;
        }

        .var-tags{
          display:flex;
          gap:0.375rem;
          flex-wrap:wrap;
          margin-bottom:0.625rem;
        }

        .var-tag{
          background:rgba(255,127,103,0.10);
          border:1px solid rgba(255,127,103,0.20);
          color:#ff7f67;
          font-size:0.72rem;
          padding:0.25rem 0.58rem;
          border-radius:8px;
          cursor:pointer;
          font-family:'Inter',sans-serif;
          font-weight:900;
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
          font-family:'Plus Jakarta Sans',sans-serif;
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
          font-family:'Plus Jakarta Sans',sans-serif;
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

        .chart-card,
        .info-card{
          background:#ffffff;
          border:1px solid rgba(23,56,56,0.08);
          border-radius:18px;
          padding:1.25rem;
          margin-bottom:1rem;
          box-shadow:0 16px 34px rgba(23,56,56,0.05);
        }

        .chart-title,
        .info-title{
          font-family:'Plus Jakarta Sans',sans-serif;
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

        .info-row{
          display:flex;
          justify-content:space-between;
          gap:1rem;
          padding:0.8rem 0;
          border-bottom:1px solid rgba(23,56,56,0.08);
        }

        .info-row:last-child{
          border-bottom:none;
        }

        .info-key{
          color:#819693;
          font-size:0.84rem;
          font-weight:800;
        }

        .info-val{
          color:#173838;
          font-size:0.84rem;
          font-weight:900;
        }

        .no-leads{
          font-size:0.82rem;
          color:#819693;
          padding:1.25rem;
          text-align:center;
          font-style:italic;
          font-family:'Inter',sans-serif;
        }

        @media(max-width:900px){
          .sidebar{display:none;}
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .content{padding:1.5rem 1rem 2rem;}
        }

        @media(max-width:600px){
          .stats-grid{grid-template-columns:1fr 1fr;}
          .campaign-top{flex-direction:column;}
          .nav{padding:0 1rem;}
          .user-email{display:none;}
        }
      `}</style>

      <nav className="nav">
        <BrandLogo />

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
            { id: "campaigns", icon: "campaign", label: "Campaigns" },
            { id: "leads", icon: "leads", label: "All Leads", badge: allLeads.length || null },
            { id: "analytics", icon: "analytics", label: "Analytics" },
          ].map(item => (
            <button key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
              <span className="nav-icon"><Icon name={item.icon} /></span>
              {item.label}
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </button>
          ))}

          <div className="sidebar-section">Platforms</div>

          {[
            { label: "LinkedIn", icon: "linkedin", href: "/linkedin" },
            { label: "Instagram", icon: "instagram", href: "/instagram" },
            { label: "Gmail", icon: "gmail", href: "/gmail" },
          ].map(p => (
            <button key={p.href} className="nav-item" onClick={() => window.location.href = p.href}>
              <span className="nav-icon"><Icon name={p.icon} /></span>
              {p.label}
            </button>
          ))}

          <div className="sidebar-section">Agency</div>

          <button className="nav-item" onClick={() => window.location.href = "/agency"}>
            <span className="nav-icon"><Icon name="clients" /></span>
            Client Manager
          </button>

          <button className="nav-item" onClick={() => window.location.href = "/agency/lead-radar"}>
            <span className="nav-icon"><Icon name="radar" /></span>
            Lead Radar
          </button>

          <div className="sidebar-section">Resources</div>

          <button className="nav-item" onClick={() => window.location.href = "/blog"}>
            <span className="nav-icon"><Icon name="blog" /></span>
            Blog
          </button>

          <div className="sidebar-section">Account</div>

          <button className={`nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
            <span className="nav-icon"><Icon name="settings" /></span>
            Settings
          </button>

          <button className={`nav-item ${activeTab === "billing" ? "active" : ""}`} onClick={() => setActiveTab("billing")}>
            <span className="nav-icon"><Icon name="billing" /></span>
            Billing
          </button>

          <button className="nav-item" onClick={() => window.location.href = "/contact"}>
            <span className="nav-icon"><Icon name="support" /></span>
            Support
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

          {activeTab === "campaigns" && (
            <>
              <div className="welcome-section">
                <h1 className="welcome-greeting">{getGreeting()}, {getUserName()}</h1>
                <p className="welcome-sub">Here&apos;s what&apos;s happening with your lead generation today.</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrap stat-icon-green">⚡</div>
                  <div className="stat-val">{campaigns.length}</div>
                  <div className="stat-lbl">Campaigns</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap stat-icon-blue">👥</div>
                  <div className="stat-val">{totalLeads}</div>
                  <div className="stat-lbl">Total Leads</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap stat-icon-red">🔥</div>
                  <div className="stat-val">{hotCount}</div>
                  <div className="stat-lbl">Hot Leads</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrap stat-icon-amber">⏳</div>
                  <div className="stat-val">7</div>
                  <div className="stat-lbl">Trial Days</div>
                </div>
              </div>

              <div className="section-header">
                <span className="section-title">Your Campaigns</span>
                <button className="btn-primary" onClick={() => setShowNewCampaign(true)}>+ New Campaign</button>
              </div>

              {campaigns.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🚀</span>
                  <div className="empty-title">Launch your first campaign</div>
                  <div className="empty-sub">Start automating your LinkedIn or Instagram lead magnet DMs in under 2 minutes.</div>
                  <button className="btn-primary" onClick={() => setShowNewCampaign(true)}>Create Campaign</button>
                </div>
              ) : campaigns.map((c, idx) => (
                <div className="campaign-card" key={c.id}>
                  <div className="campaign-top">
                    <div className="campaign-info">
                      <div className="campaign-header-row">
                        <div className={`platform-icon ${c.platform === "instagram" ? "instagram" : "linkedin"}`}>
                          {c.platform === "instagram" ? "📸" : "💼"}
                        </div>

                        <div>
                          <div className="campaign-name">
                            {getCampaignName(c, idx)}
                            {getClientName(c.client_id) && <span className="client-tag">🏢 {getClientName(c.client_id)}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="campaign-dm-preview">
                        &ldquo;{c.dm_message?.slice(0, 80)}{c.dm_message?.length > 80 ? "..." : ""}&rdquo;
                      </div>
                    </div>

                    <div className="campaign-right">
                      <div className="campaign-metric">
                        <span className="campaign-metric-val">{c.leads_count || 0}</span>
                        <span className="campaign-metric-lbl">Leads</span>
                      </div>

                      <div className="campaign-metric">
                        <span className="campaign-metric-val">{c.dms_sent || 0}</span>
                        <span className="campaign-metric-lbl">DMs</span>
                      </div>

                      <span className={`status-pill ${c.status === "Paused" ? "status-paused" : "status-active"}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <div className="campaign-footer">
                    <button className="btn-outline" onClick={() => handleViewLeads(c)}>
                      {selectedCampaign?.id === c.id ? "Hide leads ▲" : "View leads ▼"}
                    </button>

                    <span className="campaign-date">{getTimeAgo(c.created_at)}</span>
                  </div>

                  {selectedCampaign?.id === c.id && (
                    leads.length === 0 ? (
                      <div className="no-leads">No leads collected yet — automation is running...</div>
                    ) : (
                      <div className="table-wrap" style={{ marginTop: "1rem" }}>
                        <table className="leads-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Headline</th>
                              <th>Score</th>
                              <th>LinkedIn</th>
                              <th>Collected</th>
                            </tr>
                          </thead>

                          <tbody>
                            {leads.map(lead => {
                              const badge = getScoreBadge(lead.lead_score);

                              return (
                                <tr key={lead.id}>
                                  <td className="lead-name">{lead.name}</td>

                                  <td style={{ fontSize: "0.775rem", color: "#5f7774", maxWidth: "220px" }}>
                                    {lead.headline?.slice(0, 55)}{lead.headline?.length > 55 ? "..." : ""}
                                  </td>

                                  <td>
                                    <div className="score-badge-tooltip">
                                      <span className="score-badge" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
                                        {badge.emoji} {badge.label}
                                      </span>
                                      {lead.lead_score_reason && <div className="score-tooltip">{lead.lead_score_reason}</div>}
                                    </div>
                                  </td>

                                  <td>
                                    <a href={lead.linkedin_url} target="_blank" style={{ color: "#ff7f67", fontSize: "0.775rem", fontWeight: 800 }}>
                                      View →
                                    </a>
                                  </td>

                                  <td style={{ fontSize: "0.7rem", color: "#819693" }}>{getTimeAgo(lead.created_at)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </div>
              ))}
            </>
          )}

          {activeTab === "leads" && (
            <>
              <div className="page-header">
                <h1 className="page-title">All Leads</h1>
                <p className="page-sub">Every contact collected across all your campaigns</p>
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
                    <button key={f.id} className={`score-filter-btn ${scoreFilter === f.id ? "active" : ""}`} onClick={() => setScoreFilter(f.id)}>
                      {f.label} <span className="filter-count">{f.count}</span>
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

                            <td style={{ maxWidth: "180px", fontSize: "0.775rem", color: "#5f7774" }}>
                              {lead.headline?.slice(0, 50)}{lead.headline?.length > 50 ? "..." : ""}
                            </td>

                            <td style={{ fontSize: "0.82rem", color: "#5f7774" }}>{lead.company || "—"}</td>

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

                            <td style={{ fontSize: "0.82rem", color: "#5f7774" }}>{lead.location || "—"}</td>

                            <td>
                              {lead.linkedin_url ? (
                                <a href={lead.linkedin_url} target="_blank" style={{ color: "#ff7f67", fontSize: "0.775rem", fontWeight: 800 }}>
                                  View →
                                </a>
                              ) : "—"}
                            </td>

                            <td style={{ fontSize: "0.7rem", color: "#819693", whiteSpace: "nowrap" }}>{getTimeAgo(lead.created_at)}</td>

                            <td>
                              <div style={{ display: "flex", gap: "0.375rem" }}>
                                <button className="btn-outline" style={{ fontSize: "0.72rem", padding: "0.25rem 0.55rem" }} onClick={() => window.open(lead.linkedin_url, "_blank")}>
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
            </>
          )}

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
                <div className="analytics-card">
                  <div className="analytics-val">{getLeadsInRange(analyticsRange === "7d" ? 7 : analyticsRange === "14d" ? 14 : 30)}</div>
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
            </>
          )}

          {activeTab === "settings" && (
            <>
              <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-sub">Manage your account and preferences</p>
              </div>

              <div className="info-card">
                <div className="info-title">Account Details</div>

                <div className="info-row">
                  <span className="info-key">Email address</span>
                  <span className="info-val">{user?.email}</span>
                </div>

                <div className="info-row">
                  <span className="info-key">Member since</span>
                  <span className="info-val">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</span>
                </div>

                <div className="info-row">
                  <span className="info-key">Account status</span>
                  <span className="info-val" style={{ color: "#2f625d" }}>Active</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "billing" && (
            <>
              <div className="page-header">
                <h1 className="page-title">Billing</h1>
                <p className="page-sub">Manage your subscription and payment details</p>
              </div>

              <div className="info-card">
                <div className="info-title">Current Plan</div>

                <div className="info-row">
                  <span className="info-key">Plan</span>
                  <span className="info-val">Free Trial</span>
                </div>

                <div className="info-row">
                  <span className="info-key">Days remaining</span>
                  <span className="info-val" style={{ color: "#2f625d" }}>7 days</span>
                </div>

                <div className="info-row">
                  <span className="info-key">Next billing</span>
                  <span className="info-val">—</span>
                </div>

                <div style={{ marginTop: "1.25rem" }}>
                  <button className="btn-primary" onClick={() => window.location.href = "/pricing"}>Upgrade to Pro →</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showNewCampaign && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">New Campaign</div>
            <div className="modal-sub">Choose your platform, assign a client, and write the DM your leads will receive.</div>

            <form onSubmit={handleCreateCampaign}>
              <label className="form-label">Platform</label>

              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                <button {...platformBtn("linkedin")} type="button">💼 LinkedIn</button>
                <button {...platformBtn("instagram")} type="button">📸 Instagram</button>
              </div>

              <label className="form-label">
                Assign to Client <span style={{ opacity: 0.5, textTransform: "none", fontWeight: 400 }}>(optional)</span>
              </label>

              <select className="form-select" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
                <option value="">No client — personal campaign</option>
                {agencyClients.map(client => (
                  <option key={client.id} value={client.id}>
                    🏢 {client.name}{client.company ? ` — ${client.company}` : ""}
                  </option>
                ))}
              </select>

              <label className="form-label">{campaignPlatform === "linkedin" ? "LinkedIn" : "Instagram"} Post URL</label>

              <input
                className="form-input"
                type="url"
                placeholder={campaignPlatform === "linkedin" ? "https://linkedin.com/posts/..." : "https://instagram.com/p/..."}
                value={postUrl}
                onChange={e => setPostUrl(e.target.value)}
                required
              />

              <label className="form-label">DM Message</label>

              <div className="var-tags">
                {["[Name]", "[Post]", "[Link]"].map(tag => (
                  <span key={tag} className="var-tag" onClick={() => setDmMessage(prev => prev + tag)}>
                    {tag}
                  </span>
                ))}
              </div>

              <textarea
                className="form-textarea"
                placeholder="Hey [Name], thanks for commenting! Here's the resource I promised: [Link]"
                value={dmMessage}
                onChange={e => setDmMessage(e.target.value)}
                required
              />

              <div className="modal-btns">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => {
                    setShowNewCampaign(false);
                    setCampaignPlatform("linkedin");
                    setSelectedClientId("");
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="modal-submit" disabled={loading}>
                  {loading ? "Starting..." : "Launch Campaign →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}