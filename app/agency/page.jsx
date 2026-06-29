"use client";
import { useState, useEffect } from "react";
import AppNavigator from "@/app/components/AppNavigator";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TIERS = ["VIP", "Standard", "Trial", "Inactive"];

const TIER_COLORS = {
  VIP: { bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.24)", color: "#b45309" },
  Standard: { bg: "rgba(143,200,193,0.18)", border: "rgba(143,200,193,0.36)", color: "#2f625d" },
  Trial: { bg: "rgba(255,127,103,0.10)", border: "rgba(255,127,103,0.22)", color: "#ff7f67" },
  Inactive: { bg: "rgba(23,56,56,0.04)", border: "rgba(23,56,56,0.10)", color: "#819693" },
};

const PLATFORMS = ["LinkedIn", "Instagram", "Gmail"];

const REPORT_FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

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

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="side-section">
        <div className="side-label">Main</div>

        <a className="side-item" href="/dashboard">
          <span className="side-icon"><Icon name="dashboard" /></span>
          Dashboard
        </a>

        <a className="side-item" href="/dashboard">
          <span className="side-icon"><Icon name="leads" /></span>
          All Leads
        </a>

        <a className="side-item" href="/dashboard">
          <span className="side-icon"><Icon name="analytics" /></span>
          Analytics
        </a>
      </div>

      <div className="side-section">
        <div className="side-label">Platforms</div>

        <a className="side-item" href="/linkedin">
          <span className="side-icon"><Icon name="linkedin" /></span>
          LinkedIn
        </a>

        <a className="side-item" href="/instagram">
          <span className="side-icon"><Icon name="instagram" /></span>
          Instagram
        </a>

        <a className="side-item" href="/gmail">
          <span className="side-icon"><Icon name="gmail" /></span>
          Gmail
        </a>
      </div>

      <div className="side-section">
        <div className="side-label">Agency</div>

        <a className="side-item active" href="/agency">
          <span className="side-icon"><Icon name="clients" /></span>
          Client Manager
        </a>

        <a className="side-item" href="/agency/lead-radar">
          <span className="side-icon"><Icon name="radar" /></span>
          Lead Radar
        </a>
      </div>

      <div className="side-section">
        <div className="side-label">Resources</div>

        <a className="side-item" href="/blog">
          <span className="side-icon"><Icon name="blog" /></span>
          Blog
        </a>
      </div>

      <div className="side-section">
        <div className="side-label">Account</div>

        <a className="side-item" href="/settings">
          <span className="side-icon"><Icon name="settings" /></span>
          Settings
        </a>

        <a className="side-item" href="/pricing">
          <span className="side-icon"><Icon name="billing" /></span>
          Billing
        </a>

        <a className="side-item" href="/contact">
          <span className="side-icon"><Icon name="support" /></span>
          Support
        </a>
      </div>
    </aside>
  );
}

export default function Agency() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [clients, setClients] = useState([]);
  const [activeView, setActiveView] = useState("clients");
  const [expandedClient, setExpandedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filterTier, setFilterTier] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [loading, setLoading] = useState(false);
  const [sendingReport, setSendingReport] = useState(null);
  const [onboardingClient, setOnboardingClient] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    tier: "Standard",
    platforms: [],
    mrr: "",
    notes: "",
    health_score: 75,
    auto_report: false,
    report_frequency: "monthly",
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", data.user.id)
        .maybeSingle();

      setSubscription(sub);
      setCheckingAccess(false);

      if (
        sub &&
        (sub.plan === "agency" || sub.plan === "scale") &&
        (sub.status === "active" || sub.status === "trialing")
      ) {
        loadClients(data.user.id);
      }
    });
  }, []);

  const hasAccess =
    subscription &&
    (subscription.plan === "agency" || subscription.plan === "scale") &&
    (subscription.status === "active" || subscription.status === "trialing");

  const loadClients = async (userId) => {
    const { data: clientsData } = await supabase
      .from("agency_clients")
      .select("*")
      .eq("agency_user_id", userId)
      .order("created_at", { ascending: false });

    if (!clientsData) return;

    const enriched = await Promise.all(
      clientsData.map(async (c) => {
        const { count: campaignsCount } = await supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("client_id", c.id);

        const { data: clientLeads } = await supabase
          .from("leads")
          .select("lead_score")
          .eq("client_id", c.id);

        const leadsCount = clientLeads?.length || 0;
        const hotLeads = clientLeads?.filter(l => l.lead_score === "hot").length || 0;
        const warmLeads = clientLeads?.filter(l => l.lead_score === "warm").length || 0;
        const coldLeads = clientLeads?.filter(l => l.lead_score === "cold").length || 0;

        return {
          ...c,
          campaigns_count: campaignsCount || 0,
          leads_count: leadsCount,
          hot_leads: hotLeads,
          warm_leads: warmLeads,
          cold_leads: coldLeads,
        };
      })
    );

    setClients(enriched);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (showEditClient && selectedClient) {
        const { error: dbError } = await supabase
          .from("agency_clients")
          .update({ ...form, mrr: parseFloat(form.mrr) || 0 })
          .eq("id", selectedClient.id);

        if (dbError) throw dbError;
        setSuccess("Client updated!");
      } else {
        const { data: client, error: dbError } = await supabase
          .from("agency_clients")
          .insert({
            agency_user_id: user.id,
            ...form,
            mrr: parseFloat(form.mrr) || 0,
            status: "Active",
            portal_token: crypto.randomUUID(),
          })
          .select()
          .single();

        if (dbError) throw dbError;

        if (client) {
          setClients(prev => [
            {
              ...client,
              campaigns_count: 0,
              leads_count: 0,
              hot_leads: 0,
              warm_leads: 0,
              cold_leads: 0,
            },
            ...prev,
          ]);
        }

        setSuccess("Client added!");
      }

      setShowAddClient(false);
      setShowEditClient(false);
      resetForm();

      if (user) loadClients(user.id);

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Error: " + err.message);
    }

    setLoading(false);
  };

  const resetForm = () =>
    setForm({
      name: "",
      email: "",
      company: "",
      phone: "",
      tier: "Standard",
      platforms: [],
      mrr: "",
      notes: "",
      health_score: 75,
      auto_report: false,
      report_frequency: "monthly",
    });

  const handleSendReport = async (client, e) => {
    e.stopPropagation();
    setSendingReport(client.id);

    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: client.id, userId: user.id }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(`Report sent to ${client.email}!`);
        setClients(prev =>
          prev.map(c =>
            c.id === client.id
              ? { ...c, last_report_sent: new Date().toISOString() }
              : c
          )
        );
      } else {
        setError("Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error: " + err.message);
    }

    setSendingReport(null);
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const handleOnboard = async (client, e) => {
    e.stopPropagation();
    setOnboardingClient(client.id);

    try {
      const res = await fetch("/api/onboard-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: client.id, userId: user.id }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(`${client.name} onboarded!`);
        if (user) loadClients(user.id);
      } else {
        setError("Onboarding failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error: " + err.message);
    }

    setOnboardingClient(null);
    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const copyPortalLink = (client, e) => {
    e.stopPropagation();

    if (!client.portal_token) {
      setError("No portal token — edit and re-save this client.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    window.open(`https://leadmagnetinc.com/portal/${client.portal_token}`, "_blank");
  };

  const openEdit = (client, e) => {
    e.stopPropagation();

    setForm({
      name: client.name || "",
      email: client.email || "",
      company: client.company || "",
      phone: client.phone || "",
      tier: client.tier || "Standard",
      platforms: client.platforms || [],
      mrr: client.mrr || "",
      notes: client.notes || "",
      health_score: client.health_score || 75,
      auto_report: client.auto_report || false,
      report_frequency: client.report_frequency || "monthly",
    });

    setSelectedClient(client);
    setShowEditClient(true);
  };

  const deleteClient = async (id, e) => {
    e.stopPropagation();

    if (!confirm("Delete this client? This cannot be undone.")) return;

    await supabase.from("agency_clients").delete().eq("id", id);
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const togglePlatform = (platform) =>
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));

  const getHealthColor = (score) =>
    score >= 75 ? "#2f625d" : score >= 40 ? "#b45309" : "#ef4444";

  const filteredClients = clients
    .filter(c => filterTier === "All" || c.tier === filterTier)
    .sort((a, b) => {
      if (sortBy === "mrr") return (b.mrr || 0) - (a.mrr || 0);
      if (sortBy === "leads") return (b.leads_count || 0) - (a.leads_count || 0);
      if (sortBy === "health") return (b.health_score || 0) - (a.health_score || 0);
      if (sortBy === "hot") return (b.hot_leads || 0) - (a.hot_leads || 0);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const totalMRR = clients.reduce((a, c) => a + (c.mrr || 0), 0);
  const totalLeads = clients.reduce((a, c) => a + (c.leads_count || 0), 0);
  const totalHot = clients.reduce((a, c) => a + (c.hot_leads || 0), 0);
  const activeClients = clients.filter(c => c.tier !== "Inactive").length;

  const mrrByTier = {};
  const clientsByTier = {};
  TIERS.forEach(t => {
    mrrByTier[t] = 0;
    clientsByTier[t] = 0;
  });

  clients.forEach(c => {
    const t = c.tier || "Standard";
    mrrByTier[t] += c.mrr || 0;
    clientsByTier[t]++;
  });

  const maxClientMRR = Math.max(...clients.map(c => c.mrr || 0), 1);
  const avgMRR = clients.length > 0 ? Math.round(totalMRR / clients.length) : 0;
  const annualRevenue = totalMRR * 12;
  const atRiskClients = clients.filter(c => c.health_score < 40 || (c.leads_count === 0 && c.campaigns_count === 0));
  const atRiskMRR = atRiskClients.reduce((a, c) => a + (c.mrr || 0), 0);

  return (
    <main className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .page {
          min-height: 100vh;
          background: #FBF3E3;
          color: #173838;
          font-family: 'Inter', sans-serif;
        }

        .topbar {
          height: 72px;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(23,56,56,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 10px 30px rgba(23,56,56,0.04);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.62rem;
          text-decoration: none;
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

        .brand-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.06rem;
          font-weight: 900;
          letter-spacing: -0.035em;
          color: #173838;
          line-height: 1;
        }

        .brand-name .lead {
          color: #ff7f67;
        }

        .brand-name .magnet {
          color: #8fc8c1;
        }

        .top-link {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          border-radius: 12px;
          min-height: 40px;
          padding: 0 1rem;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 900;
        }

        .top-link:hover {
          color: #ff7f67;
          border-color: rgba(255,127,103,0.28);
          background: rgba(255,127,103,0.06);
        }

        .app-layout {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          min-height: 100vh;
        }

        .sidebar {
          background: rgba(255,255,255,0.72);
          border-right: 1px solid rgba(23,56,56,0.08);
          padding: 1.2rem 0.85rem;
        }

        .side-section {
          margin-bottom: 1.35rem;
        }

        .side-label {
          color: #819693;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0.55rem 0.5rem;
        }

        .side-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          min-height: 40px;
          border-radius: 12px;
          padding: 0 0.7rem;
          background: transparent;
          border: 1px solid transparent;
          color: #5f7774;
          text-decoration: none;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.86rem;
          margin-bottom: 0.25rem;
        }

        .side-item:hover,
        .side-item.active {
          background: rgba(255,127,103,0.12);
          color: #ff7f67;
          border-color: rgba(255,127,103,0.22);
        }

        .side-icon {
          width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
          flex: 0 0 auto;
        }

        .side-icon svg {
          width: 18px;
          height: 18px;
        }

        .content {
          padding: 2rem;
          overflow-x: hidden;
        }

        .content-inner {
          max-width: 1180px;
          margin: 0 auto;
        }

        .access-card,
        .page-header,
        .client-card,
        .stat-card,
        .rev-card,
        .rev-section,
        .empty-state {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .access-card,
        .page-header {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border-radius: 26px;
          padding: 1.7rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
          margin-bottom: 1.25rem;
        }

        .access-card {
          max-width: 720px;
        }

        .page-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.065em;
          line-height: 1.04;
          margin-bottom: 0.6rem;
        }

        .page-sub {
          font-size: 0.95rem;
          color: #5f7774;
          line-height: 1.65;
        }

        .success-bar {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
          font-size: 0.86rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .error-bar {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          color: #ef4444;
          font-size: 0.86rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .view-toggle {
          display: flex;
          gap: 0.35rem;
          margin-bottom: 1.25rem;
          background: #ffffff;
          padding: 0.3rem;
          border-radius: 14px;
          width: fit-content;
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 12px 28px rgba(23,56,56,0.04);
        }

        .view-btn {
          background: transparent;
          border: none;
          color: #5f7774;
          font-size: 0.84rem;
          padding: 0.58rem 1.15rem;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
        }

        .view-btn.active {
          background: rgba(255,127,103,0.10);
          color: #ff7f67;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .rev-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .stat-card,
        .rev-card {
          border-radius: 20px;
          padding: 1.15rem;
        }

        .stat-val,
        .rev-val {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          color: #ff7f67;
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .stat-lbl,
        .rev-lbl {
          font-size: 0.72rem;
          color: #819693;
          margin-top: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-weight: 900;
        }

        .rev-sub {
          font-size: 0.74rem;
          color: #819693;
          margin-top: 0.2rem;
        }

        .controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .filter-btn,
        .sort-select,
        .add-btn,
        .act-btn,
        .modal-cancel,
        .modal-submit,
        .freq-btn {
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          cursor: pointer;
        }

        .filter-btn {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          font-size: 0.8rem;
          padding: 0.48rem 0.85rem;
        }

        .filter-btn.active {
          background: rgba(255,127,103,0.10);
          border-color: rgba(255,127,103,0.28);
          color: #ff7f67;
        }

        .sort-select {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          font-size: 0.8rem;
          padding: 0.48rem 0.85rem;
          outline: none;
        }

        .add-btn,
        .modal-submit {
          background: #ff7f67;
          color: #173838;
          border: none;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
        }

        .add-btn {
          font-size: 0.84rem;
          padding: 0.65rem 1rem;
          margin-left: auto;
        }

        .client-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1rem;
        }

        .client-card {
          border-radius: 20px;
          padding: 1.15rem;
          position: relative;
          cursor: pointer;
          transition: 0.15s ease;
        }

        .client-card:hover {
          transform: translateY(-1px);
          border-color: rgba(255,127,103,0.24);
        }

        .mrr-badge {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          font-size: 0.86rem;
          font-weight: 900;
          color: #ff7f67;
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-right: 4rem;
        }

        .client-avatar,
        .rev-client-avatar {
          width: 42px;
          height: 42px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #ff7f67;
        }

        .card-top-info {
          flex: 1;
          min-width: 0;
        }

        .client-name,
        .rev-client-name {
          font-size: 0.98rem;
          font-weight: 900;
          color: #173838;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .client-company,
        .client-email-row,
        .rev-client-tier,
        .last-report {
          font-size: 0.78rem;
          color: #819693;
        }

        .tier-badge {
          font-size: 0.7rem;
          font-weight: 900;
          padding: 0.22rem 0.6rem;
          border-radius: 100px;
        }

        .health-wrap {
          margin-bottom: 1rem;
        }

        .health-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          margin-bottom: 0.35rem;
        }

        .health-lbl {
          color: #819693;
          font-weight: 800;
        }

        .health-bar {
          height: 6px;
          background: #FBF3E3;
          border-radius: 100px;
          overflow: hidden;
        }

        .health-fill {
          height: 100%;
          border-radius: 100px;
        }

        .score-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .score-box {
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 12px;
          padding: 0.65rem 0.4rem;
          text-align: center;
        }

        .score-val {
          font-size: 1rem;
          font-weight: 900;
        }

        .score-lbl {
          font-size: 0.6rem;
          color: #819693;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.2rem;
          font-weight: 900;
        }

        .platforms-row,
        .auto-row,
        .card-actions {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .platform-tag,
        .auto-tag {
          font-size: 0.7rem;
          padding: 0.22rem 0.52rem;
          border-radius: 8px;
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.34);
          color: #2f625d;
          font-weight: 800;
        }

        .auto-tag.report {
          background: rgba(255,127,103,0.10);
          border-color: rgba(255,127,103,0.20);
          color: #ff7f67;
        }

        .auto-tag.routing {
          background: rgba(143,200,193,0.18);
          border-color: rgba(143,200,193,0.34);
          color: #2f625d;
        }

        .card-actions {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(23,56,56,0.08);
        }

        .act-btn {
          flex: 1;
          font-size: 0.72rem;
          padding: 0.5rem;
          border: 1px solid rgba(23,56,56,0.10);
          background: #ffffff;
          color: #5f7774;
        }

        .act-onboard,
        .act-report {
          color: #2f625d;
          background: rgba(143,200,193,0.18);
          border-color: rgba(143,200,193,0.34);
        }

        .act-portal {
          color: #ff7f67;
          background: rgba(255,127,103,0.10);
          border-color: rgba(255,127,103,0.20);
        }

        .act-del {
          color: #ef4444;
          border-color: rgba(239,68,68,0.18);
          flex: 0.45;
        }

        .expanded-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(23,56,56,0.08);
        }

        .expanded-title {
          font-size: 0.86rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.75rem;
        }

        .notes-box {
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 12px;
          padding: 0.75rem;
          font-size: 0.84rem;
          color: #5f7774;
          line-height: 1.5;
        }

        .empty-state {
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ff7f67;
          font-weight: 900;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.4rem;
        }

        .empty-sub {
          font-size: 0.86rem;
          color: #5f7774;
          margin-bottom: 1.5rem;
          line-height: 1.55;
        }

        .rev-section {
          border-radius: 20px;
          padding: 1.15rem;
          margin-bottom: 1rem;
        }

        .rev-section-title {
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 1rem;
        }

        .rev-client-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(23,56,56,0.08);
        }

        .rev-client-row:last-child {
          border-bottom: none;
        }

        .rev-client-info {
          flex: 1;
          min-width: 0;
        }

        .rev-client-bar-wrap {
          flex: 2;
          height: 8px;
          background: #FBF3E3;
          border-radius: 100px;
          overflow: hidden;
        }

        .rev-client-bar {
          height: 100%;
          border-radius: 100px;
          background: linear-gradient(90deg,#ff7f67,#8fc8c1);
        }

        .rev-client-mrr {
          font-weight: 900;
          color: #173838;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(23,56,56,0.30);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
          backdrop-filter: blur(8px);
        }

        .modal {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          border-radius: 24px;
          padding: 1.7rem;
          width: 100%;
          max-width: 620px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 30px 80px rgba(23,56,56,0.18);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.35rem;
          letter-spacing: -0.05em;
        }

        .modal-sub {
          color: #5f7774;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.35rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 900;
          color: #2f625d;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.45rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.12);
          border-radius: 13px;
          padding: 0.85rem 1rem;
          color: #173838;
          font-size: 0.9rem;
          outline: none;
          font-family: 'Inter', sans-serif;
          margin-bottom: 1rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: rgba(255,127,103,0.42);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
        }

        .platform-select {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .platform-option {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          padding: 0.55rem 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 800;
        }

        .platform-option.selected {
          background: rgba(255,127,103,0.10);
          border-color: rgba(255,127,103,0.28);
          color: #ff7f67;
        }

        .range-wrap {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .range {
          flex: 1;
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 16px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .toggle-label {
          font-weight: 900;
          color: #173838;
        }

        .toggle-sub {
          font-size: 0.8rem;
          color: #819693;
          margin-top: 0.2rem;
        }

        .toggle-switch {
          width: 48px;
          height: 28px;
          border: none;
          border-radius: 100px;
          background: #d8e3df;
          position: relative;
          cursor: pointer;
        }

        .toggle-switch.on {
          background: #ff7f67;
        }

        .toggle-knob {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: 0.2s;
        }

        .toggle-switch.on .toggle-knob {
          left: 23px;
        }

        .freq-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .freq-btn {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          font-size: 0.8rem;
          padding: 0.7rem;
        }

        .freq-btn.selected {
          background: rgba(255,127,103,0.10);
          border-color: rgba(255,127,103,0.28);
          color: #ff7f67;
        }

        .modal-btns {
          display: flex;
          gap: 0.75rem;
        }

        .modal-cancel,
        .modal-submit {
          min-height: 42px;
          border: none;
          padding: 0 0.95rem;
        }

        .modal-cancel {
          flex: 1;
          background: #ffffff;
          color: #2f625d;
          border: 1px solid rgba(23,56,56,0.10);
        }

        .modal-submit {
          flex: 2;
        }

        @media(max-width: 1000px) {
          .app-layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: flex;
            overflow-x: auto;
            gap: 0.8rem;
            padding: 0.8rem;
          }

          .side-section {
            min-width: 190px;
            margin-bottom: 0;
          }

          .stats-row,
          .rev-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .client-grid {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width: 650px) {
          .content {
            padding: 1rem;
          }

          .topbar {
            padding: 0 1rem;
          }

          .stats-row,
          .rev-stats {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal-btns,
          .freq-grid {
            grid-template-columns: 1fr;
            flex-direction: column;
          }

          .controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .add-btn {
            margin-left: 0;
          }
        }
      `}</style>

      <div className="app-layout">
        <AppNavigator leadCandidates={totalLeads} />

        <section className="content">
          <div className="content-inner">
            {checkingAccess ? (
              <div className="access-card">
                <h1 className="page-title">Checking access</h1>
                <p className="page-sub">Please wait while we confirm your agency workspace access.</p>
              </div>
            ) : !hasAccess ? (
              <div className="access-card">
                <h1 className="page-title">Upgrade to access Client Manager</h1>
                <p className="page-sub">
                  This workspace is available on the Agency or Scale plan. Upgrade to manage clients, reports, onboarding, and client portals.
                </p>
                <br />
                <a href="/pricing" className="add-btn" style={{ display: "inline-flex", textDecoration: "none", marginLeft: 0 }}>
                  View Plans
                </a>
              </div>
            ) : (
              <>
                {success && <div className="success-bar">{success}</div>}
                {error && <div className="error-bar">{error}</div>}

                <div className="page-header">
                  <h1 className="page-title">Client Manager</h1>
                  <p className="page-sub">Manage agency clients, revenue, reports, onboarding, and client portal access.</p>
                </div>

                <div className="view-toggle">
                  <button className={`view-btn ${activeView === "clients" ? "active" : ""}`} onClick={() => setActiveView("clients")}>Clients</button>
                  <button className={`view-btn ${activeView === "revenue" ? "active" : ""}`} onClick={() => setActiveView("revenue")}>Revenue</button>
                </div>

                {activeView === "clients" && (
                  <>
                    <div className="stats-row">
                      <div className="stat-card"><div className="stat-val">{activeClients}</div><div className="stat-lbl">Active Clients</div></div>
                      <div className="stat-card"><div className="stat-val">${totalMRR.toLocaleString()}</div><div className="stat-lbl">Monthly MRR</div></div>
                      <div className="stat-card"><div className="stat-val">{totalLeads}</div><div className="stat-lbl">Total Leads</div></div>
                      <div className="stat-card"><div className="stat-val">{totalHot}</div><div className="stat-lbl">Hot Leads</div></div>
                      <div className="stat-card"><div className="stat-val">{atRiskClients.length}</div><div className="stat-lbl">At Risk</div></div>
                    </div>

                    <div className="controls">
                      {["All", ...TIERS].map(tier => (
                        <button key={tier} className={`filter-btn ${filterTier === tier ? "active" : ""}`} onClick={() => setFilterTier(tier)}>
                          {tier}
                        </button>
                      ))}

                      <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="created_at">Newest</option>
                        <option value="mrr">Highest MRR</option>
                        <option value="leads">Most Leads</option>
                        <option value="health">Best Health</option>
                        <option value="hot">Hot Leads</option>
                      </select>

                      <button className="add-btn" onClick={() => setShowAddClient(true)}>Add Client</button>
                    </div>

                    {filteredClients.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">CM</div>
                        <div className="empty-title">No clients yet</div>
                        <div className="empty-sub">Add your first client to start managing campaigns, reports, and portals.</div>
                        <button className="add-btn" onClick={() => setShowAddClient(true)} style={{ marginLeft: 0 }}>Add First Client</button>
                      </div>
                    ) : (
                      <div className="client-grid">
                        {filteredClients.map(client => {
                          const tierStyle = TIER_COLORS[client.tier || "Standard"] || TIER_COLORS.Standard;
                          const isExpanded = expandedClient === client.id;

                          return (
                            <div className="client-card" key={client.id} onClick={() => setExpandedClient(isExpanded ? null : client.id)}>
                              <div className="mrr-badge">${Number(client.mrr || 0).toLocaleString()}</div>

                              <div className="card-top">
                                <div className="client-avatar">{client.name?.[0]?.toUpperCase() || "C"}</div>

                                <div className="card-top-info">
                                  <div className="client-name">{client.name}</div>
                                  <div className="client-company">{client.company || "No company"}</div>
                                </div>

                                <span className="tier-badge" style={{ background: tierStyle.bg, border: `1px solid ${tierStyle.border}`, color: tierStyle.color }}>
                                  {client.tier || "Standard"}
                                </span>
                              </div>

                              <div className="client-email-row">{client.email}</div>

                              <div className="health-wrap">
                                <div className="health-top">
                                  <span className="health-lbl">Health score</span>
                                  <span style={{ color: getHealthColor(client.health_score || 0), fontWeight: 900 }}>{client.health_score || 0}%</span>
                                </div>
                                <div className="health-bar">
                                  <div className="health-fill" style={{ width: `${client.health_score || 0}%`, background: getHealthColor(client.health_score || 0) }} />
                                </div>
                              </div>

                              <div className="score-row">
                                <div className="score-box"><div className="score-val">{client.campaigns_count || 0}</div><div className="score-lbl">Campaigns</div></div>
                                <div className="score-box"><div className="score-val">{client.leads_count || 0}</div><div className="score-lbl">Leads</div></div>
                                <div className="score-box"><div className="score-val" style={{ color: "#ff7f67" }}>{client.hot_leads || 0}</div><div className="score-lbl">Hot</div></div>
                                <div className="score-box"><div className="score-val">{client.warm_leads || 0}</div><div className="score-lbl">Warm</div></div>
                              </div>

                              <div className="platforms-row">
                                {(client.platforms || []).map(platform => <span key={platform} className="platform-tag">{platform}</span>)}
                              </div>

                              <div className="auto-row">
                                {client.auto_report && <span className="auto-tag report">Reports {client.report_frequency}</span>}
                                {client.portal_token && <span className="auto-tag routing">Portal ready</span>}
                              </div>

                              {client.last_report_sent && (
                                <div className="last-report">Last report: {new Date(client.last_report_sent).toLocaleDateString()}</div>
                              )}

                              <div className="card-actions">
                                <button className="act-btn act-onboard" disabled={onboardingClient === client.id} onClick={(e) => handleOnboard(client, e)}>
                                  {onboardingClient === client.id ? "..." : "Onboard"}
                                </button>

                                <button className="act-btn act-portal" onClick={(e) => copyPortalLink(client, e)}>Portal</button>

                                <button className="act-btn act-report" disabled={sendingReport === client.id} onClick={(e) => handleSendReport(client, e)}>
                                  {sendingReport === client.id ? "..." : "Report"}
                                </button>

                                <button className="act-btn act-edit" onClick={(e) => openEdit(client, e)}>Edit</button>

                                <button className="act-btn act-del" onClick={(e) => deleteClient(client.id, e)}>Delete</button>
                              </div>

                              {isExpanded && (
                                <div className="expanded-section">
                                  <div className="expanded-title">Client notes</div>
                                  <div className="notes-box">{client.notes || "No notes saved for this client."}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {activeView === "revenue" && (
                  <>
                    <div className="rev-stats">
                      <div className="rev-card"><div className="rev-val">${totalMRR.toLocaleString()}</div><div className="rev-lbl">MRR</div><div className="rev-sub">Monthly recurring revenue</div></div>
                      <div className="rev-card"><div className="rev-val">${annualRevenue.toLocaleString()}</div><div className="rev-lbl">ARR</div><div className="rev-sub">Projected annual revenue</div></div>
                      <div className="rev-card"><div className="rev-val">${avgMRR.toLocaleString()}</div><div className="rev-lbl">Avg MRR</div><div className="rev-sub">Per client</div></div>
                      <div className="rev-card"><div className="rev-val">${atRiskMRR.toLocaleString()}</div><div className="rev-lbl">Risk MRR</div><div className="rev-sub">Needs attention</div></div>
                    </div>

                    <div className="rev-section">
                      <div className="rev-section-title">MRR by client</div>

                      {clients.length === 0 ? (
                        <div className="empty-sub">No client revenue yet.</div>
                      ) : (
                        [...clients].sort((a, b) => (b.mrr || 0) - (a.mrr || 0)).map(client => (
                          <div className="rev-client-row" key={client.id}>
                            <div className="rev-client-avatar">{client.name?.[0]?.toUpperCase() || "C"}</div>

                            <div className="rev-client-info">
                              <div className="rev-client-name">{client.name}</div>
                              <div className="rev-client-tier">{client.tier || "Standard"}</div>
                            </div>

                            <div className="rev-client-bar-wrap">
                              <div className="rev-client-bar" style={{ width: `${((client.mrr || 0) / maxClientMRR) * 100}%` }} />
                            </div>

                            <div className="rev-client-mrr">${Number(client.mrr || 0).toLocaleString()}</div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="rev-section">
                      <div className="rev-section-title">Revenue by tier</div>

                      {TIERS.map(tier => (
                        <div className="rev-client-row" key={tier}>
                          <div className="rev-client-info">
                            <div className="rev-client-name">{tier}</div>
                            <div className="rev-client-tier">{clientsByTier[tier]} clients</div>
                          </div>

                          <div className="rev-client-bar-wrap">
                            <div className="rev-client-bar" style={{ width: `${totalMRR ? (mrrByTier[tier] / totalMRR) * 100 : 0}%` }} />
                          </div>

                          <div className="rev-client-mrr">${Number(mrrByTier[tier] || 0).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {(showAddClient || showEditClient) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">{showEditClient ? "Edit Client" : "Add Client"}</div>
            <div className="modal-sub">Add the client details, platforms, revenue, and reporting preferences.</div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div>
                  <label className="form-label">Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label className="form-label">Company</label>
                  <input className="form-input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
                </div>

                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label className="form-label">Tier</label>
                  <select className="form-select" value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}>
                    {TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                  </select>
                </div>

                <div>
                  <label className="form-label">Monthly Revenue</label>
                  <input className="form-input" type="number" min="0" value={form.mrr} onChange={e => setForm(p => ({ ...p, mrr: e.target.value }))} />
                </div>
              </div>

              <label className="form-label">Platforms</label>
              <div className="platform-select">
                {PLATFORMS.map(platform => (
                  <button key={platform} type="button" className={`platform-option ${form.platforms.includes(platform) ? "selected" : ""}`} onClick={() => togglePlatform(platform)}>
                    {platform}
                  </button>
                ))}
              </div>

              <label className="form-label">Health Score</label>
              <div className="range-wrap">
                <input className="range" type="range" min="0" max="100" value={form.health_score} onChange={e => setForm(p => ({ ...p, health_score: parseInt(e.target.value) }))} />
                <strong style={{ color: getHealthColor(form.health_score) }}>{form.health_score}%</strong>
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Auto-send performance reports</div>
                  <div className="toggle-sub">Automatically email reports to this client</div>
                </div>

                <button type="button" className={`toggle-switch ${form.auto_report ? "on" : ""}`} onClick={() => setForm(p => ({ ...p, auto_report: !p.auto_report }))}>
                  <div className="toggle-knob" />
                </button>
              </div>

              {form.auto_report && (
                <>
                  <label className="form-label">Report Frequency</label>
                  <div className="freq-grid">
                    {REPORT_FREQUENCIES.map(f => (
                      <button key={f.value} type="button" className={`freq-btn ${form.report_frequency === f.value ? "selected" : ""}`} onClick={() => setForm(p => ({ ...p, report_frequency: f.value }))}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <label className="form-label">Notes</label>
              <textarea className="form-textarea" placeholder="Notes about this client..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />

              <div className="modal-btns">
                <button type="button" className="modal-cancel" onClick={() => { setShowAddClient(false); setShowEditClient(false); resetForm(); }}>
                  Cancel
                </button>

                <button type="submit" className="modal-submit" disabled={loading}>
                  {loading ? "Saving..." : showEditClient ? "Save Changes →" : "Add Client →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}