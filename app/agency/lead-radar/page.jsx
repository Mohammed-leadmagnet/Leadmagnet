"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const PLATFORM_OPTIONS = ["LinkedIn", "Instagram", "Gmail", "Website"];

const SOURCE_TYPES = [
  { value: "manual_entry", label: "Manual Entry" },
  { value: "campaign_engagement", label: "Campaign Engagement" },
  { value: "csv_upload", label: "CSV Upload" },
  { value: "public_business_signal", label: "Public Signal" },
  { value: "crm_import", label: "CRM Import" },
  { value: "gmail_interaction", label: "Gmail Interaction" },
  { value: "existing_lead", label: "Existing Lead" },
  { value: "other", label: "Other" },
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

        <a className="side-item" href="/agency">
          <span className="side-icon"><Icon name="clients" /></span>
          Client Manager
        </a>

        <a className="side-item active" href="/agency/lead-radar">
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

export default function LeadRadar() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [icp, setIcp] = useState(null);
  const [icpLoading, setIcpLoading] = useState(false);
  const [icpSaving, setIcpSaving] = useState(false);

  const [icpForm, setIcpForm] = useState({
    target_industries: [],
    target_locations: [],
    company_sizes: [],
    job_titles: [],
    keywords: [],
    competitors: [],
    excluded_industries: [],
    excluded_titles: [],
    target_platforms: [],
  });

  const [tagInputs, setTagInputs] = useState({
    target_industries: "",
    target_locations: "",
    job_titles: "",
    keywords: "",
    competitors: "",
    excluded_industries: "",
    excluded_titles: "",
  });

  const [credits, setCredits] = useState(null);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [addingLead, setAddingLead] = useState(false);
  const [importing, setImporting] = useState(false);
  const [filterTemp, setFilterTemp] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const csvRef = useRef(null);

  const [leadForm, setLeadForm] = useState({
    name: "",
    first_name: "",
    last_name: "",
    title: "",
    company: "",
    industry: "",
    location: "",
    email: "",
    website: "",
    linkedin_url: "",
    instagram_handle: "",
    source_type: "manual_entry",
  });

  const [detailLead, setDetailLead] = useState(null);
  const [aiRec, setAiRec] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [duplicateMap, setDuplicateMap] = useState({});
  const [checkingDups, setCheckingDups] = useState(false);
  const [sequences, setSequences] = useState([]);
  const [showSeqModal, setShowSeqModal] = useState(false);
  const [seqLeadId, setSeqLeadId] = useState(null);
  const [addingToSeq, setAddingToSeq] = useState(false);

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

      if (sub && sub.plan === "scale" && (sub.status === "active" || sub.status === "trialing")) {
        loadClients(data.user.id);
        loadCredits(data.user.id);
      }
    });
  }, []);

  const hasScale =
    subscription &&
    subscription.plan === "scale" &&
    (subscription.status === "active" || subscription.status === "trialing");

  const loadClients = async (uid) => {
    const { data } = await supabase
      .from("agency_clients")
      .select("id, name, company")
      .eq("agency_user_id", uid)
      .order("name");

    if (data) setClients(data);
  };

  const loadCredits = async (uid) => {
    try {
      const r = await fetch(`/api/lead-radar/credits?userId=${uid}`);
      const d = await r.json();
      if (d.credits) setCredits(d.credits);
    } catch {}
  };

  const loadIcp = async (cid) => {
    if (!user || !cid) return;

    setIcpLoading(true);

    try {
      const r = await fetch(`/api/lead-radar/icp?userId=${user.id}&clientId=${cid}`);
      const d = await r.json();

      if (d.icp) {
        setIcp(d.icp);
        setIcpForm({
          target_industries: d.icp.target_industries || [],
          target_locations: d.icp.target_locations || [],
          company_sizes: d.icp.company_sizes || [],
          job_titles: d.icp.job_titles || [],
          keywords: d.icp.keywords || [],
          competitors: d.icp.competitors || [],
          excluded_industries: d.icp.excluded_industries || [],
          excluded_titles: d.icp.excluded_titles || [],
          target_platforms: d.icp.target_platforms || [],
        });
      } else {
        setIcp(null);
        setIcpForm({
          target_industries: [],
          target_locations: [],
          company_sizes: [],
          job_titles: [],
          keywords: [],
          competitors: [],
          excluded_industries: [],
          excluded_titles: [],
          target_platforms: [],
        });
      }
    } catch {}

    setIcpLoading(false);
  };

  const loadLeads = async (cid) => {
    if (!user || !cid) return;

    setLeadsLoading(true);

    try {
      const r = await fetch(`/api/lead-radar/leads?userId=${user.id}&clientId=${cid}`);
      const d = await r.json();
      setLeads(d.leads || []);
    } catch {}

    setLeadsLoading(false);
  };

  useEffect(() => {
    if (selectedClientId && hasScale) {
      loadIcp(selectedClientId);
      loadLeads(selectedClientId);
      setDuplicateMap({});
    }
  }, [selectedClientId]);

  const saveIcp = async () => {
    if (!user || !selectedClientId) return;

    setIcpSaving(true);

    try {
      const r = await fetch("/api/lead-radar/icp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clientId: selectedClientId, ...icpForm }),
      });

      const d = await r.json();

      if (d.success) {
        setIcp(d.icp);
        setSuccess("ICP saved!");
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setIcpSaving(false);

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);
  };

  const addTag = (field, value) => {
    if (!value.trim() || icpForm[field].includes(value.trim())) return;

    setIcpForm(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));

    setTagInputs(prev => ({
      ...prev,
      [field]: "",
    }));
  };

  const removeTag = (field, index) => {
    setIcpForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleTagKeyDown = (field, e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(field, tagInputs[field]);
    }
  };

  const toggleSize = (size) => {
    setIcpForm(prev => ({
      ...prev,
      company_sizes: prev.company_sizes.includes(size)
        ? prev.company_sizes.filter(s => s !== size)
        : [...prev.company_sizes, size],
    }));
  };

  const togglePlatform = (platform) => {
    setIcpForm(prev => ({
      ...prev,
      target_platforms: prev.target_platforms.includes(platform)
        ? prev.target_platforms.filter(p => p !== platform)
        : [...prev.target_platforms, platform],
    }));
  };

  const handleAddLead = async () => {
    if (!user || !selectedClientId) return;

    setAddingLead(true);

    try {
      const r = await fetch("/api/lead-radar/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clientId: selectedClientId, lead: leadForm }),
      });

      const d = await r.json();

      if (d.success) {
        setSuccess("Lead added!");
        setShowAddLead(false);
        setLeadForm({
          name: "",
          first_name: "",
          last_name: "",
          title: "",
          company: "",
          industry: "",
          location: "",
          email: "",
          website: "",
          linkedin_url: "",
          instagram_handle: "",
          source_type: "manual_entry",
        });
        loadLeads(selectedClientId);
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setAddingLead(false);

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);
  };

  const handleCSV = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setImporting(true);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim());

      if (lines.length < 2) {
        setError("CSV needs header + rows");
        setImporting(false);
        return;
      }

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
        const row = {};
        headers.forEach((h, j) => {
          if (vals[j]) row[h] = vals[j];
        });
        rows.push(row);
      }

      const r = await fetch("/api/lead-radar/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clientId: selectedClientId, leads: rows }),
      });

      const d = await r.json();

      if (d.success) {
        setSuccess(`Imported ${d.imported} leads`);
        loadLeads(selectedClientId);
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setImporting(false);

    if (csvRef.current) csvRef.current.value = "";

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const handleScore = async () => {
    if (!user || !selectedClientId) return;

    setScoring(true);

    try {
      const r = await fetch("/api/lead-radar/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clientId: selectedClientId }),
      });

      const d = await r.json();

      if (d.success) {
        setSuccess(`Scored ${d.scored} leads (${d.creditsUsed} credits)`);
        loadLeads(selectedClientId);
        loadCredits(user.id);
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setScoring(false);

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const handleSync = async () => {
    if (!user || !selectedClientId) return;

    setSyncing(true);

    try {
      const r = await fetch("/api/lead-radar/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clientId: selectedClientId }),
      });

      const d = await r.json();

      if (d.success) {
        setSuccess(`Synced ${d.synced} leads`);
        loadLeads(selectedClientId);
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setSyncing(false);

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const updateStatus = async (leadId, status) => {
    try {
      const r = await fetch("/api/lead-radar/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, leadId, status }),
      });

      const d = await r.json();

      if (d.success) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));

        if (detailLead?.id === leadId) {
          setDetailLead(prev => ({ ...prev, status }));
        }

        setSuccess(`Lead ${status}`);
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 3000);
  };

  const getAiRec = async (lead) => {
    if (!user) return;

    setAiLoading(true);
    setAiRec(null);

    try {
      const r = await fetch("/api/lead-radar/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, leadId: lead.id }),
      });

      const d = await r.json();

      if (d.success) {
        setAiRec(d.recommendation);
        loadCredits(user.id);
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setAiLoading(false);
    setTimeout(() => setError(""), 4000);
  };

  const checkDuplicates = async () => {
    if (!user || !selectedClientId) return;

    setCheckingDups(true);

    try {
      const r = await fetch("/api/lead-radar/duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clientId: selectedClientId }),
      });

      const d = await r.json();

      if (d.success) {
        const map = {};

        (d.duplicates || []).forEach(item => {
          map[item.lead.id] = item.duplicates;
        });

        setDuplicateMap(map);
        setSuccess(`Found ${d.duplicateCount} leads with duplicates`);
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setCheckingDups(false);

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 5000);
  };

  const openSeqModal = async (leadId) => {
    if (!user || !selectedClientId) return;

    setSeqLeadId(leadId);
    setShowSeqModal(true);

    try {
      const r = await fetch(`/api/lead-radar/add-to-sequence?userId=${user.id}&clientId=${selectedClientId}`);
      const d = await r.json();
      setSequences(d.sequences || []);
    } catch {}
  };

  const addToSequence = async (sequenceId) => {
    if (!user || !seqLeadId) return;

    setAddingToSeq(true);

    try {
      const r = await fetch("/api/lead-radar/add-to-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, leadId: seqLeadId, sequenceId }),
      });

      const d = await r.json();

      if (d.success) {
        setSuccess(d.message);
        setShowSeqModal(false);
        setSeqLeadId(null);
        loadLeads(selectedClientId);
      } else {
        setError(d.error);
      }
    } catch (e) {
      setError(e.message);
    }

    setAddingToSeq(false);

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);
  };

  const openDetail = (lead) => {
    setDetailLead(lead);
    setAiRec(null);
  };

  const getBadge = (temperature) => {
    if (temperature === "hot") {
      return {
        label: "Hot",
        bg: "rgba(255,127,103,0.10)",
        border: "rgba(255,127,103,0.20)",
        color: "#ff7f67",
      };
    }

    if (temperature === "warm") {
      return {
        label: "Warm",
        bg: "rgba(245,158,11,0.10)",
        border: "rgba(245,158,11,0.22)",
        color: "#b45309",
      };
    }

    return {
      label: "Cold",
      bg: "rgba(23,56,56,0.04)",
      border: "rgba(23,56,56,0.10)",
      color: "#819693",
    };
  };

  const formatAiRecommendation = (rec) => {
  if (!rec) return null;

  if (typeof rec === "string") {
    try {
      return JSON.parse(rec);
    } catch {
      return {
        why_valuable: rec,
        outreach_angle: "",
        suggested_message: "",
        risk_warning: "",
        next_action: "",
      };
    }
  }

  return rec;
};

  const getStatusColor = (status) => ({
    new: "#819693",
    approved: "#2f625d",
    in_sequence: "#ff7f67",
    saved: "#b45309",
    dismissed: "#6b7280",
    converted: "#2f625d",
    duplicate: "#ef4444",
  }[status] || "#819693");

  const filteredLeads = leads.filter(lead => {
    const score = lead.lead_scores?.[0];

    if (filterTemp !== "All" && score?.temperature !== filterTemp.toLowerCase()) return false;
    if (filterStatus !== "All" && lead.status !== filterStatus) return false;

    return true;
  });

  const totalLeads = leads.length;
  const hotCount = leads.filter(l => l.lead_scores?.[0]?.temperature === "hot").length;
  const warmCount = leads.filter(l => l.lead_scores?.[0]?.temperature === "warm").length;
  const coldCount = leads.filter(l => l.lead_scores?.[0]?.temperature === "cold").length;
  const unscoredCount = leads.filter(l => !l.lead_scores?.length).length;

  const creditsUsed = credits?.used_this_month || 0;
  const creditsLimit = credits?.monthly_limit || 2000;
  const creditsRemaining = creditsLimit - creditsUsed;
  const creditsPct = Math.min((creditsUsed / creditsLimit) * 100, 100);
  const dupCount = Object.keys(duplicateMap).length;

  const TagInput = ({ field, label, placeholder }) => (
    <div>
      <label className="form-label">{label}</label>

      <div className="tag-box">
        {icpForm[field].map((tag, index) => (
          <span className="tag-pill" key={tag}>
            {tag}
            <button type="button" onClick={() => removeTag(field, index)}>×</button>
          </span>
        ))}

        <input
          className="tag-input"
          placeholder={placeholder}
          value={tagInputs[field]}
          onChange={e => setTagInputs(prev => ({ ...prev, [field]: e.target.value }))}
          onKeyDown={e => handleTagKeyDown(field, e)}
        />
      </div>
    </div>
  );

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
          grid-template-columns: 230px minmax(0, 1fr);
          min-height: calc(100vh - 72px);
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

        .hero-card,
        .section,
        .stat-card,
        .table-wrap,
        .empty-state,
        .modal {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .hero-card {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border-radius: 26px;
          padding: 1.7rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
          margin-bottom: 1.25rem;
        }

        .page-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.065em;
          line-height: 1.04;
          color: #173838;
          margin-bottom: 0.6rem;
        }

        .page-sub {
          color: #5f7774;
          font-size: 0.95rem;
          line-height: 1.65;
          max-width: 760px;
        }

        .badge {
          display: inline-flex;
          font-size: 0.72rem;
          font-weight: 900;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.20);
          color: #ff7f67;
          margin-left: 0.5rem;
          vertical-align: middle;
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

        .client-select,
        .input,
        .select {
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

        .client-select {
          max-width: 420px;
        }

        .tabs {
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

        .tab {
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

        .tab.active {
          background: rgba(255,127,103,0.10);
          color: #ff7f67;
        }

        .section {
          border-radius: 20px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 1rem;
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

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .tag-box {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.12);
          border-radius: 13px;
          padding: 0.55rem 0.75rem;
          margin-bottom: 1rem;
          min-height: 44px;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
          font-size: 0.74rem;
          font-weight: 800;
          padding: 0.28rem 0.55rem;
          border-radius: 9px;
        }

        .tag-pill button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-weight: 900;
        }

        .tag-input {
          background: transparent;
          border: 0;
          outline: 0;
          color: #173838;
          font-size: 0.86rem;
          min-width: 120px;
          flex: 1;
        }

        .options {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .option {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          font-size: 0.8rem;
          padding: 0.5rem 0.8rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 800;
        }

        .option.active {
          background: rgba(255,127,103,0.10);
          border-color: rgba(255,127,103,0.28);
          color: #ff7f67;
        }

        .btn {
          background: #ff7f67;
          color: #173838;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 0.84rem;
          padding: 0.65rem 1rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #2f625d;
          box-shadow: none;
        }

        .btn-soft {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
          box-shadow: none;
        }

        .btn-orange {
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.20);
          color: #ff7f67;
          box-shadow: none;
        }

        .btn-danger {
          background: #ffffff;
          border: 1px solid rgba(239,68,68,0.18);
          color: #ef4444;
          box-shadow: none;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat-card {
          border-radius: 20px;
          padding: 1rem;
          text-align: center;
        }

        .stat-value {
          font-size: 1.6rem;
          font-weight: 900;
          line-height: 1;
          color: #ff7f67;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #819693;
          margin-top: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-weight: 900;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .filter {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          font-size: 0.76rem;
          padding: 0.42rem 0.75rem;
          border-radius: 100px;
          cursor: pointer;
          font-weight: 800;
        }

        .filter.active {
          background: rgba(255,127,103,0.10);
          border-color: rgba(255,127,103,0.28);
          color: #ff7f67;
        }

        .table-wrap {
          border-radius: 20px;
          overflow: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 960px;
        }

        .table th {
          font-size: 0.68rem;
          color: #819693;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid rgba(23,56,56,0.08);
          font-weight: 900;
          background: #f8fbfa;
        }

        .table td {
          font-size: 0.84rem;
          color: #5f7774;
          padding: 0.75rem;
          border-bottom: 1px solid rgba(23,56,56,0.06);
        }

        .lead-name {
          font-weight: 900;
          color: #173838;
        }

        .pill {
          display: inline-flex;
          font-size: 0.72rem;
          font-weight: 900;
          padding: 0.25rem 0.6rem;
          border-radius: 100px;
          text-transform: capitalize;
        }

        .small-btn {
          font-size: 0.72rem;
          padding: 0.38rem 0.6rem;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 800;
          border: 1px solid rgba(23,56,56,0.10);
          background: #ffffff;
          color: #5f7774;
          margin: 0.1rem;
        }

        .credits-bar {
          height: 8px;
          background: #FBF3E3;
          border-radius: 100px;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .credits-fill {
          height: 100%;
          border-radius: 100px;
          background: linear-gradient(90deg,#ff7f67,#8fc8c1);
        }

        .empty-state {
          border-radius: 20px;
          text-align: center;
          padding: 3rem 2rem;
          color: #5f7774;
        }

        .empty-title {
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.4rem;
        }

        .empty-sub {
          font-size: 0.86rem;
          line-height: 1.55;
          max-width: 420px;
          margin: 0 auto;
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
          border-radius: 24px;
          padding: 1.7rem;
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 30px 80px rgba(23,56,56,0.18);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 1rem;
          letter-spacing: -0.04em;
        }

        .modal-buttons {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .modal-cancel,
        .modal-submit {
          min-height: 42px;
          border-radius: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .modal-cancel {
          flex: 1;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #2f625d;
        }

        .modal-submit {
          flex: 2;
          background: #ff7f67;
          color: #173838;
          border: 0;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.55rem 0;
          border-bottom: 1px solid rgba(23,56,56,0.08);
          font-size: 0.86rem;
        }

        .detail-key {
          color: #819693;
          text-transform: capitalize;
        }

        .detail-val {
          color: #173838;
          font-weight: 800;
          word-break: break-word;
          text-align: right;
        }

.ai-box {
  background: linear-gradient(145deg,#ffffff,#f8fbfa);
  border: 1px solid rgba(23,56,56,0.08);
  border-radius: 18px;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 14px 30px rgba(23,56,56,0.06);
}

.ai-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.ai-label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  font-weight: 900;
  color: #ff7f67;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ai-label-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff7f67;
  box-shadow: 0 0 0 4px rgba(255,127,103,0.12);
}

.ai-pill {
  background: rgba(143,200,193,0.18);
  border: 1px solid rgba(143,200,193,0.34);
  color: #2f625d;
  border-radius: 100px;
  padding: 0.25rem 0.6rem;
  font-size: 0.68rem;
  font-weight: 900;
}

.ai-card-grid {
  display: grid;
  gap: 0.65rem;
}

.ai-card {
  background: #FBF3E3;
  border: 1px solid rgba(23,56,56,0.08);
  border-radius: 14px;
  padding: 0.85rem;
}

.ai-card-title {
  color: #173838;
  font-size: 0.78rem;
  font-weight: 900;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ai-card-text {
  color: #5f7774;
  font-size: 0.86rem;
  line-height: 1.6;
  font-weight: 700;
}

.ai-message {
  background: #ffffff;
  border: 1px solid rgba(255,127,103,0.18);
  color: #173838;
  border-radius: 14px;
  padding: 0.9rem;
  font-size: 0.9rem;
  line-height: 1.6;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(255,127,103,0.08);
}

.ai-warning {
  background: rgba(239,68,68,0.06);
  border-color: rgba(239,68,68,0.16);
}

.ai-warning .ai-card-title {
  color: #ef4444;
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
        }

        @media(max-width: 760px) {
          .content {
            padding: 1rem;
          }

          .grid-2 {
            grid-template-columns: 1fr;
          }

          .modal-buttons {
            flex-direction: column;
          }

          .tabs,
          .actions {
            width: 100%;
            overflow: auto;
          }

          .topbar {
            padding: 0 1rem;
          }
        }
      `}</style>

      <header className="topbar">
        <BrandLogo />
        <a href="/agency" className="top-link">Client Manager</a>
      </header>

      <div className="app-layout">
        <Sidebar />

        <section className="content">
          <div className="content-inner">
            {success && <div className="success-bar">{success}</div>}
            {error && <div className="error-bar">{error}</div>}

            {checkingAccess ? (
              <div className="hero-card">
                <h1 className="page-title">Checking access</h1>
                <p className="page-sub">Please wait while we confirm your Scale workspace access.</p>
              </div>
            ) : !hasScale ? (
              <div className="hero-card">
                <h1 className="page-title">Upgrade to access Lead Radar</h1>
                <p className="page-sub">
                  Lead Radar is available on the Scale plan. Upgrade to score leads, detect duplicates, sync leads, and get AI recommendations.
                </p>
                <br />
                <a href="/pricing" className="btn" style={{ display: "inline-flex", textDecoration: "none" }}>View Plans</a>
              </div>
            ) : (
              <>
                <div className="hero-card">
                  <h1 className="page-title">
                    Lead Radar <span className="badge">Scale</span>
                  </h1>
                  <p className="page-sub">
                    Score prospects against each client ICP, find duplicates, sync qualified leads,
                    and get AI follow-up recommendations.
                  </p>
                </div>

                <select className="client-select" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
                  <option value="">Select client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.company ? ` — ${c.company}` : ""}
                    </option>
                  ))}
                </select>

                {!selectedClientId ? (
                  <div className="empty-state">
                    <div className="empty-title">Choose a client to start</div>
                    <div className="empty-sub">
                      Lead Radar needs a client profile before it can load ICP rules, imported leads, scores, and recommendations.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="tabs">
                      <button className={`tab ${activeTab === "leads" ? "active" : ""}`} onClick={() => setActiveTab("leads")}>Leads</button>
                      <button className={`tab ${activeTab === "icp" ? "active" : ""}`} onClick={() => setActiveTab("icp")}>ICP</button>
                      <button className={`tab ${activeTab === "credits" ? "active" : ""}`} onClick={() => setActiveTab("credits")}>Credits</button>
                    </div>

                    {activeTab === "icp" && (
                      <div className="section">
                        <div className="section-title">Ideal Customer Profile</div>

                        {icpLoading ? (
                          <p>Loading ICP...</p>
                        ) : (
                          <>
                            <div className="grid-2">
                              <TagInput field="target_industries" label="Target industries" placeholder="Add industry..." />
                              <TagInput field="target_locations" label="Target locations" placeholder="Add location..." />
                              <TagInput field="job_titles" label="Job titles" placeholder="Add title..." />
                              <TagInput field="keywords" label="Keywords" placeholder="Add keyword..." />
                              <TagInput field="competitors" label="Competitors" placeholder="Add competitor..." />
                              <TagInput field="excluded_industries" label="Excluded industries" placeholder="Add excluded industry..." />
                              <TagInput field="excluded_titles" label="Excluded titles" placeholder="Add excluded title..." />
                            </div>

                            <label className="form-label">Company sizes</label>
                            <div className="options">
                              {COMPANY_SIZES.map(s => (
                                <button key={s} type="button" className={`option ${icpForm.company_sizes.includes(s) ? "active" : ""}`} onClick={() => toggleSize(s)}>
                                  {s}
                                </button>
                              ))}
                            </div>

                            <label className="form-label">Target platforms</label>
                            <div className="options">
                              {PLATFORM_OPTIONS.map(p => (
                                <button key={p} type="button" className={`option ${icpForm.target_platforms.includes(p) ? "active" : ""}`} onClick={() => togglePlatform(p)}>
                                  {p}
                                </button>
                              ))}
                            </div>

                            <button className="btn" onClick={saveIcp} disabled={icpSaving}>
                              {icpSaving ? "Saving..." : icp ? "Update ICP" : "Save ICP"}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {activeTab === "credits" && (
                      <div className="section">
                        <div className="section-title">Lead Radar Credits</div>

                        <div className="stats">
                          <div className="stat-card"><div className="stat-value">{creditsRemaining}</div><div className="stat-label">Remaining</div></div>
                          <div className="stat-card"><div className="stat-value">{creditsUsed}</div><div className="stat-label">Used</div></div>
                          <div className="stat-card"><div className="stat-value">{creditsLimit}</div><div className="stat-label">Monthly Limit</div></div>
                          <div className="stat-card"><div className="stat-value">{dupCount}</div><div className="stat-label">Duplicate Groups</div></div>
                        </div>

                        <div className="credits-bar">
                          <div className="credits-fill" style={{ width: `${creditsPct}%` }} />
                        </div>
                      </div>
                    )}

                    {activeTab === "leads" && (
                      <>
                        <div className="stats">
                          <div className="stat-card"><div className="stat-value">{totalLeads}</div><div className="stat-label">Total Leads</div></div>
                          <div className="stat-card"><div className="stat-value">{hotCount}</div><div className="stat-label">Hot</div></div>
                          <div className="stat-card"><div className="stat-value">{warmCount}</div><div className="stat-label">Warm</div></div>
                          <div className="stat-card"><div className="stat-value">{coldCount}</div><div className="stat-label">Cold</div></div>
                          <div className="stat-card"><div className="stat-value">{unscoredCount}</div><div className="stat-label">Unscored</div></div>
                        </div>

                        <div className="actions">
                          <button className="btn" onClick={() => setShowAddLead(true)}>Add Lead</button>
                          <button className="btn btn-secondary" onClick={() => csvRef.current?.click()} disabled={importing}>{importing ? "Importing..." : "Import CSV"}</button>
                          <input ref={csvRef} type="file" accept=".csv" hidden onChange={handleCSV} />
                          <button className="btn btn-soft" onClick={handleScore} disabled={scoring || !leads.length}>{scoring ? "Scoring..." : "Score Leads"}</button>
                          <button className="btn btn-orange" onClick={handleSync} disabled={syncing}>{syncing ? "Syncing..." : "Sync Leads"}</button>
                          <button className="btn btn-danger" onClick={checkDuplicates} disabled={checkingDups || !leads.length}>{checkingDups ? "Checking..." : "Find Duplicates"}</button>
                        </div>

                        <div className="actions">
                          {["All", "Hot", "Warm", "Cold"].map(t => (
                            <button key={t} className={`filter ${filterTemp === t ? "active" : ""}`} onClick={() => setFilterTemp(t)}>{t}</button>
                          ))}

                          {["All", "new", "approved", "in_sequence", "saved", "dismissed", "converted", "duplicate"].map(s => (
                            <button key={s} className={`filter ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>{s}</button>
                          ))}
                        </div>

                        {leadsLoading ? (
                          <div className="empty-state">
                            <div className="empty-title">Loading leads...</div>
                          </div>
                        ) : filteredLeads.length === 0 ? (
                          <div className="empty-state">
                            <div className="empty-title">No leads found</div>
                            <div className="empty-sub">Add a lead manually, import a CSV, or sync leads from campaigns.</div>
                          </div>
                        ) : (
                          <div className="table-wrap">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Lead</th>
                                  <th>Company</th>
                                  <th>Score</th>
                                  <th>Status</th>
                                  <th>Source</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>

                              <tbody>
                                {filteredLeads.map(lead => {
                                  const score = lead.lead_scores?.[0];
                                  const badge = getBadge(score?.temperature);

                                  return (
                                    <tr key={lead.id}>
                                      <td>
                                        <div className="lead-name">
                                          {lead.name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unnamed"}
                                        </div>
                                        <div>{lead.email || lead.linkedin_url || "—"}</div>

                                        {duplicateMap[lead.id] && (
                                          <span className="pill" style={{ background: "rgba(239,68,68,.07)", color: "#ef4444" }}>
                                            Duplicate
                                          </span>
                                        )}
                                      </td>

                                      <td>
                                        {lead.company || "—"}<br />
                                        <span>{lead.title || lead.industry || ""}</span>
                                      </td>

                                      <td>
                                        <span className="pill" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>
                                          {badge.label}
                                        </span>
                                        <div>{score?.fit_score ? `${score.fit_score}/100` : "Unscored"}</div>
                                      </td>

                                      <td>
                                        <span className="pill" style={{ background: "rgba(23,56,56,.04)", color: getStatusColor(lead.status) }}>
                                          {lead.status || "new"}
                                        </span>
                                      </td>

                                      <td>{lead.source_type || "—"}</td>

                                      <td>
                                        <button className="small-btn" onClick={() => openDetail(lead)}>View</button>
                                        <button className="small-btn" onClick={() => updateStatus(lead.id, "approved")}>Approve</button>
                                        <button className="small-btn" onClick={() => openSeqModal(lead.id)}>Sequence</button>
                                        <button className="small-btn" onClick={() => updateStatus(lead.id, "dismissed")}>Dismiss</button>
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
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {showAddLead && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Add Lead</div>

            <div className="grid-2">
              <input className="input" placeholder="Full name" value={leadForm.name} onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))} />
              <input className="input" placeholder="Email" value={leadForm.email} onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))} />
              <input className="input" placeholder="Title" value={leadForm.title} onChange={e => setLeadForm(p => ({ ...p, title: e.target.value }))} />
              <input className="input" placeholder="Company" value={leadForm.company} onChange={e => setLeadForm(p => ({ ...p, company: e.target.value }))} />
              <input className="input" placeholder="Industry" value={leadForm.industry} onChange={e => setLeadForm(p => ({ ...p, industry: e.target.value }))} />
              <input className="input" placeholder="Location" value={leadForm.location} onChange={e => setLeadForm(p => ({ ...p, location: e.target.value }))} />
              <input className="input" placeholder="Website" value={leadForm.website} onChange={e => setLeadForm(p => ({ ...p, website: e.target.value }))} />
              <input className="input" placeholder="LinkedIn URL" value={leadForm.linkedin_url} onChange={e => setLeadForm(p => ({ ...p, linkedin_url: e.target.value }))} />
            </div>

            <select className="select" value={leadForm.source_type} onChange={e => setLeadForm(p => ({ ...p, source_type: e.target.value }))}>
              {SOURCE_TYPES.map(source => (
                <option key={source.value} value={source.value}>{source.label}</option>
              ))}
            </select>

            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setShowAddLead(false)}>Cancel</button>
              <button className="modal-submit" onClick={handleAddLead} disabled={addingLead}>{addingLead ? "Adding..." : "Add Lead"}</button>
            </div>
          </div>
        </div>
      )}

      {detailLead && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">{detailLead.name || "Lead Details"}</div>

            {["email", "title", "company", "industry", "location", "website", "linkedin_url", "instagram_handle", "source_type", "status"].map(key => (
              <div className="detail-row" key={key}>
                <span className="detail-key">{key.replaceAll("_", " ")}</span>
                <span className="detail-val">{detailLead[key] || "—"}</span>
              </div>
            ))}

            <button className="btn btn-soft" style={{ marginTop: "1rem" }} onClick={() => getAiRec(detailLead)} disabled={aiLoading}>
              {aiLoading ? "Loading recommendation..." : "Get AI Recommendation"}
            </button>

           {aiRec && (() => {
  const rec = formatAiRecommendation(aiRec);

  return (
    <div className="ai-box">
      <div className="ai-header">
        <div className="ai-label">
          <span className="ai-label-dot" />
          AI Recommendation
        </div>

        <div className="ai-pill">Ready to use</div>
      </div>

      <div className="ai-card-grid">
        {rec.why_valuable && (
          <div className="ai-card">
            <div className="ai-card-title">Why this lead matters</div>
            <div className="ai-card-text">{rec.why_valuable}</div>
          </div>
        )}

        {rec.outreach_angle && (
          <div className="ai-card">
            <div className="ai-card-title">Best outreach angle</div>
            <div className="ai-card-text">{rec.outreach_angle}</div>
          </div>
        )}

        {rec.suggested_message && (
          <div>
            <div className="ai-card-title" style={{ marginBottom: "0.35rem" }}>
              Suggested message
            </div>
            <div className="ai-message">{rec.suggested_message}</div>
          </div>
        )}

        {rec.next_action && (
          <div className="ai-card">
            <div className="ai-card-title">Next action</div>
            <div className="ai-card-text">{rec.next_action}</div>
          </div>
        )}

        {rec.risk_warning && (
          <div className="ai-card ai-warning">
            <div className="ai-card-title">Risk warning</div>
            <div className="ai-card-text">{rec.risk_warning}</div>
          </div>
        )}
      </div>
    </div>
  );
})()}

            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setDetailLead(null)}>Close</button>
              <button className="modal-submit" onClick={() => updateStatus(detailLead.id, "converted")}>Mark Converted</button>
            </div>
          </div>
        </div>
      )}

      {showSeqModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Add Lead to Sequence</div>

            {sequences.length === 0 ? (
              <div className="empty-state">
                <div className="empty-title">No sequences found</div>
                <div className="empty-sub">Create a Gmail sequence first, then return here.</div>
              </div>
            ) : (
              sequences.map(sequence => (
                <button
                  key={sequence.id}
                  className="btn btn-secondary"
                  style={{ width: "100%", marginBottom: ".5rem" }}
                  onClick={() => addToSequence(sequence.id)}
                  disabled={addingToSeq}
                >
                  {sequence.name}
                </button>
              ))
            )}

            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => { setShowSeqModal(false); setSeqLeadId(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}