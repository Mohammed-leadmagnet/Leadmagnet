"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const PLATFORM_OPTIONS = ["LinkedIn", "Instagram", "Gmail", "Website"];

export default function LeadRadar() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [activeTab, setActiveTab] = useState("icp");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ICP state
  const [icp, setIcp] = useState(null);
  const [icpLoading, setIcpLoading] = useState(false);
  const [icpSaving, setIcpSaving] = useState(false);
  const [icpForm, setIcpForm] = useState({
    target_industries: [], target_locations: [], company_sizes: [],
    job_titles: [], keywords: [], competitors: [],
    excluded_industries: [], excluded_titles: [], target_platforms: [],
  });
  const [tagInputs, setTagInputs] = useState({
    target_industries: "", target_locations: "", job_titles: "",
    keywords: "", competitors: "", excluded_industries: "", excluded_titles: "",
  });

  // Credits state
  const [credits, setCredits] = useState(null);

  // Leads state
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);

      const { data: sub } = await supabase.from("subscriptions").select("plan, status").eq("user_id", data.user.id).maybeSingle();
      setSubscription(sub);
      setCheckingAccess(false);

      if (sub && (sub.plan === "scale") && (sub.status === "active" || sub.status === "trialing")) {
        loadClients(data.user.id);
        loadCredits(data.user.id);
      }
    });
  }, []);

  const hasScale = subscription && subscription.plan === "scale" && (subscription.status === "active" || subscription.status === "trialing");
  const hasAgency = subscription && (subscription.plan === "agency" || subscription.plan === "scale") && (subscription.status === "active" || subscription.status === "trialing");

  const loadClients = async (userId) => {
    const { data } = await supabase.from("agency_clients").select("id, name, company").eq("agency_user_id", userId).order("name");
    if (data) setClients(data);
  };

  const loadCredits = async (userId) => {
    try {
      const res = await fetch(`/api/lead-radar/credits?userId=${userId}`);
      const data = await res.json();
      if (data.credits) setCredits(data.credits);
    } catch {}
  };

  const loadIcp = async (clientId) => {
    if (!user || !clientId) return;
    setIcpLoading(true);
    try {
      const res = await fetch(`/api/lead-radar/icp?userId=${user.id}&clientId=${clientId}`);
      const data = await res.json();
      if (data.icp) {
        setIcp(data.icp);
        setIcpForm({
          target_industries: data.icp.target_industries || [],
          target_locations: data.icp.target_locations || [],
          company_sizes: data.icp.company_sizes || [],
          job_titles: data.icp.job_titles || [],
          keywords: data.icp.keywords || [],
          competitors: data.icp.competitors || [],
          excluded_industries: data.icp.excluded_industries || [],
          excluded_titles: data.icp.excluded_titles || [],
          target_platforms: data.icp.target_platforms || [],
        });
      } else {
        setIcp(null);
        setIcpForm({ target_industries: [], target_locations: [], company_sizes: [], job_titles: [], keywords: [], competitors: [], excluded_industries: [], excluded_titles: [], target_platforms: [] });
      }
    } catch {}
    setIcpLoading(false);
  };

  const loadLeads = async (clientId) => {
    if (!user || !clientId) return;
    setLeadsLoading(true);
    try {
      const { data } = await supabase.from("lead_candidates").select("*, lead_scores(*)").eq("user_id", user.id).eq("client_id", clientId).order("created_at", { ascending: false });
      setLeads(data || []);
    } catch {}
    setLeadsLoading(false);
  };

  useEffect(() => {
    if (selectedClientId && hasScale) {
      loadIcp(selectedClientId);
      loadLeads(selectedClientId);
    }
  }, [selectedClientId]);

  const saveIcp = async () => {
    if (!user || !selectedClientId) return;
    setIcpSaving(true);
    try {
      const res = await fetch("/api/lead-radar/icp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clientId: selectedClientId, ...icpForm }),
      });
      const data = await res.json();
      if (data.success) { setIcp(data.icp); setSuccess("ICP profile saved!"); }
      else setError(data.error || "Failed to save ICP");
    } catch (err) { setError("Error: " + err.message); }
    setIcpSaving(false);
    setTimeout(() => { setSuccess(""); setError(""); }, 4000);
  };

  const addTag = (field, value) => {
    if (!value.trim()) return;
    if (icpForm[field].includes(value.trim())) return;
    setIcpForm(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setTagInputs(prev => ({ ...prev, [field]: "" }));
  };

  const removeTag = (field, index) => {
    setIcpForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
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

  const togglePlatform = (p) => {
    setIcpForm(prev => ({
      ...prev,
      target_platforms: prev.target_platforms.includes(p)
        ? prev.target_platforms.filter(x => x !== p)
        : [...prev.target_platforms, p],
    }));
  };

  const getScoreBadge = (temp) => {
    if (temp === "hot") return { label: "🔥 Hot", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", color: "#f87171" };
    if (temp === "warm") return { label: "🟡 Warm", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", color: "#fbbf24" };
    return { label: "🔵 Cold", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", color: "#60a5fa" };
  };

  const creditsUsed = credits?.used_this_month || 0;
  const creditsLimit = credits?.monthly_limit || 2000;
  const creditsRemaining = creditsLimit - creditsUsed;
  const creditsPct = Math.min((creditsUsed / creditsLimit) * 100, 100);

  return (
    <main style={{ minHeight: "100vh", background: "#060a07", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .lr-nav{background:rgba(8,14,10,0.85);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.05);padding:0 1.75rem;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .lr-logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#22c97a;text-decoration:none;display:flex;align-items:center;gap:0.4rem;}
        .lr-logo-dot{width:8px;height:8px;background:#22c97a;border-radius:50%;box-shadow:0 0 10px rgba(34,201,122,0.5);}
        .lr-back{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-size:0.82rem;padding:0.4rem 0.9rem;border-radius:8px;cursor:pointer;text-decoration:none;font-family:'Inter',sans-serif;font-weight:500;transition:all 0.2s;}
        .lr-back:hover{border-color:rgba(34,201,122,0.25);color:#22c97a;}
        .lr-container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem 3rem;}
        .lr-header{margin-bottom:1.5rem;}
        .lr-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.6rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.035em;margin-bottom:0.2rem;}
        .lr-sub{font-size:0.84rem;color:#3d5240;font-family:'Inter',sans-serif;}
        .lr-badge{display:inline-flex;align-items:center;gap:0.3rem;font-size:0.68rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:100px;background:rgba(147,51,234,0.08);border:1px solid rgba(147,51,234,0.18);color:#a78bfa;font-family:'Plus Jakarta Sans',sans-serif;margin-left:0.5rem;vertical-align:middle;}
        .lr-alert{font-size:0.82rem;padding:0.75rem 1rem;border-radius:11px;margin-bottom:1.5rem;font-family:'Inter',sans-serif;font-weight:500;}
        .lr-success{background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.15);color:#22c97a;}
        .lr-error{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);color:#f87171;}
        .lr-client-select{width:100%;max-width:360px;background:rgba(12,21,16,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.65rem 1rem;color:#e2ede7;font-size:0.84rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1.5rem;appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234d6b54' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 1rem center;}
        .lr-client-select:focus{border-color:rgba(34,201,122,0.25);}
        .lr-client-select option{background:#080c09;color:#e2ede7;}
        .lr-tabs{display:flex;gap:0.35rem;margin-bottom:2rem;background:rgba(12,21,16,0.6);padding:0.25rem;border-radius:10px;width:fit-content;}
        .lr-tab{background:transparent;border:none;color:#3d5240;font-size:0.82rem;padding:0.5rem 1.15rem;border-radius:8px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;transition:all 0.15s;}
        .lr-tab.active{background:rgba(34,201,122,0.1);color:#22c97a;}
        .lr-section{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1.5rem;margin-bottom:1rem;}
        .lr-section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#c4d4c8;margin-bottom:1.25rem;}
        .lr-form-label{display:block;font-size:0.72rem;font-weight:700;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.03em;text-transform:uppercase;font-family:'Inter',sans-serif;}
        .lr-form-help{font-size:0.7rem;color:#2a3d2e;margin-bottom:0.5rem;font-family:'Inter',sans-serif;}
        .lr-tag-input-wrap{display:flex;flex-wrap:wrap;gap:0.35rem;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.5rem 0.75rem;margin-bottom:1rem;min-height:42px;align-items:center;}
        .lr-tag-input-wrap:focus-within{border-color:rgba(34,201,122,0.25);}
        .lr-tag{display:inline-flex;align-items:center;gap:0.25rem;background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.15);color:#22c97a;font-size:0.72rem;font-weight:600;padding:0.2rem 0.5rem;border-radius:6px;font-family:'Inter',sans-serif;}
        .lr-tag-x{cursor:pointer;font-size:0.8rem;opacity:0.6;margin-left:0.15rem;}
        .lr-tag-x:hover{opacity:1;}
        .lr-tag-field{background:transparent;border:none;outline:none;color:#e2ede7;font-size:0.82rem;font-family:'Inter',sans-serif;min-width:120px;flex:1;}
        .lr-tag-field::placeholder{color:#1e2e22;}
        .lr-toggle-grid{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem;}
        .lr-toggle{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-size:0.78rem;padding:0.4rem 0.85rem;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;transition:all 0.15s;}
        .lr-toggle.on{background:rgba(34,201,122,0.08);border-color:rgba(34,201,122,0.25);color:#22c97a;font-weight:600;}
        .lr-btn{background:linear-gradient(135deg,#22c97a,#1aae6a);color:#071209;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.82rem;padding:0.55rem 1.15rem;border-radius:9px;border:none;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 8px rgba(34,201,122,0.15);}
        .lr-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(34,201,122,0.25);}
        .lr-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none;}
        .lr-form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
        .lr-divider{border:none;border-top:1px solid rgba(255,255,255,0.04);margin:1.25rem 0;}
        .lr-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.75rem;margin-bottom:1.5rem;}
        .lr-stat{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1.15rem 1.25rem;text-align:center;}
        .lr-stat-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.75rem;font-weight:800;line-height:1;letter-spacing:-0.04em;}
        .lr-stat-lbl{font-size:0.68rem;color:#3d5240;margin-top:0.3rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Inter',sans-serif;font-weight:600;}
        .lr-credit-bar-wrap{height:8px;background:rgba(255,255,255,0.04);border-radius:100px;overflow:hidden;margin-top:0.5rem;}
        .lr-credit-bar{height:100%;border-radius:100px;transition:width 0.4s;}
        .lr-empty{text-align:center;padding:3rem 2rem;color:#2a3d2e;font-family:'Inter',sans-serif;}
        .lr-empty-icon{font-size:2.5rem;margin-bottom:1rem;display:block;}
        .lr-empty-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:700;color:#c4d4c8;margin-bottom:0.4rem;}
        .lr-empty-sub{font-size:0.84rem;color:#3d5240;line-height:1.55;max-width:400px;margin:0 auto;}
        .lr-disclaimer{font-size:0.72rem;color:#2a3d2e;font-family:'Inter',sans-serif;text-align:center;margin-top:2rem;line-height:1.5;max-width:600px;margin-left:auto;margin-right:auto;}
        .lr-table-wrap{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;overflow:hidden;}
        .lr-table{width:100%;border-collapse:collapse;}
        .lr-table th{font-size:0.66rem;color:#2a3d2e;text-transform:uppercase;letter-spacing:0.1em;padding:0.75rem 1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.04);font-weight:700;background:rgba(0,0,0,0.2);font-family:'Inter',sans-serif;}
        .lr-table td{font-size:0.82rem;color:#8fa696;padding:0.75rem 1rem;border-bottom:1px solid rgba(255,255,255,0.025);font-family:'Inter',sans-serif;}
        .lr-table tr:last-child td{border-bottom:none;}
        .lr-table tr:hover td{background:rgba(34,201,122,0.02);}
        .lr-lead-name{font-weight:600;color:#e2ede7;font-family:'Plus Jakarta Sans',sans-serif;}
        .lr-score-badge{display:inline-flex;align-items:center;gap:0.25rem;font-size:0.7rem;font-weight:700;padding:0.175rem 0.55rem;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;}
        @media(max-width:768px){.lr-form-row{grid-template-columns:1fr;}.lr-stats{grid-template-columns:repeat(2,1fr);}.lr-container{padding:1.5rem 1rem;}}
      `}</style>

      <nav className="lr-nav">
        <a href="/" className="lr-logo"><span className="lr-logo-dot"></span> LeadMagnet</a>
        <a href="/agency" className="lr-back">← Client Manager</a>
      </nav>

      {/* ACCESS CHECK */}
      {checkingAccess ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ fontSize: "1.2rem", color: "#22c97a", fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading...</div>
        </div>
      ) : !hasAgency && !hasScale ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#f0f7f2", marginBottom: "0.5rem" }}>Scale Plan Required</div>
            <div style={{ fontSize: "0.88rem", color: "#3d5240", lineHeight: 1.6, marginBottom: "2rem", fontFamily: "Inter,sans-serif" }}>Lead Radar is a premium feature for Scale subscribers. Upgrade to discover hot potential leads, AI recommendations, and opportunity scoring.</div>
            <button onClick={() => window.location.href = "/pricing"} style={{ background: "linear-gradient(135deg,#22c97a,#1aae6a)", color: "#071209", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.9rem", padding: "0.7rem 1.5rem", borderRadius: "10px", border: "none", cursor: "pointer" }}>View Plans & Upgrade →</button>
          </div>
        </div>
      ) : hasAgency && !hasScale ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "520px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛰️</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#f0f7f2", marginBottom: "0.5rem" }}>Lead Radar <span className="lr-badge">Scale</span></div>
            <div style={{ fontSize: "0.88rem", color: "#3d5240", lineHeight: 1.7, marginBottom: "2rem", fontFamily: "Inter,sans-serif" }}>Discover hot potential leads, prioritize prospects by fit and intent, and turn campaign signals into qualified opportunities. Lead Radar uses AI scoring, ICP matching, and duplicate detection to find your best leads across all clients.</div>
            <button onClick={() => window.location.href = "/pricing"} style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.9rem", padding: "0.7rem 1.5rem", borderRadius: "10px", border: "none", cursor: "pointer" }}>Upgrade to Scale →</button>
          </div>
        </div>
      ) : (
        /* SCALE ACCESS — FULL LEAD RADAR */
        <div className="lr-container">
          {success && <div className="lr-alert lr-success">✓ {success}</div>}
          {error && <div className="lr-alert lr-error">⚠ {error}</div>}

          <div className="lr-header">
            <h1 className="lr-title">Lead Radar <span className="lr-badge">Scale</span></h1>
            <p className="lr-sub">Discover, score, and prioritize high-potential prospects for each client.</p>
          </div>

          {/* CLIENT SELECTOR */}
          <select className="lr-client-select" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
            <option value="">Select a client...</option>
            {clients.map(c => (<option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</option>))}
          </select>

          {!selectedClientId ? (
            <div className="lr-section">
              <div className="lr-empty">
                <span className="lr-empty-icon">🛰️</span>
                <div className="lr-empty-title">Select a client to get started</div>
                <div className="lr-empty-sub">Choose a client above to build their ICP profile, view lead candidates, and run Lead Radar scoring.</div>
              </div>
            </div>
          ) : (
            <>
              {/* TABS */}
              <div className="lr-tabs">
                <button className={`lr-tab ${activeTab === "icp" ? "active" : ""}`} onClick={() => setActiveTab("icp")}>🎯 ICP Profile</button>
                <button className={`lr-tab ${activeTab === "leads" ? "active" : ""}`} onClick={() => setActiveTab("leads")}>👥 Leads ({leads.length})</button>
                <button className={`lr-tab ${activeTab === "credits" ? "active" : ""}`} onClick={() => setActiveTab("credits")}>⚡ Credits</button>
              </div>

              {/* ====== ICP TAB ====== */}
              {activeTab === "icp" && (
                <>
                  <div className="lr-section">
                    <div className="lr-section-title">🎯 Ideal Customer Profile</div>
                    <p style={{ fontSize: "0.82rem", color: "#3d5240", marginBottom: "1.5rem", fontFamily: "Inter,sans-serif", lineHeight: 1.6 }}>
                      Define who the perfect lead looks like for this client. Lead Radar uses this profile to score and prioritize every prospect.
                    </p>

                    {icpLoading ? (
                      <div style={{ textAlign: "center", padding: "2rem", color: "#3d5240" }}>Loading ICP...</div>
                    ) : (
                      <>
                        {/* Target Industries */}
                        <label className="lr-form-label">Target Industries</label>
                        <div className="lr-form-help">e.g. SaaS, Marketing, E-commerce, Healthcare</div>
                        <div className="lr-tag-input-wrap">
                          {icpForm.target_industries.map((t, i) => (<span key={i} className="lr-tag">{t}<span className="lr-tag-x" onClick={() => removeTag("target_industries", i)}>×</span></span>))}
                          <input className="lr-tag-field" placeholder="Type and press Enter..." value={tagInputs.target_industries} onChange={e => setTagInputs(p => ({ ...p, target_industries: e.target.value }))} onKeyDown={e => handleTagKeyDown("target_industries", e)} />
                        </div>

                        {/* Target Locations */}
                        <label className="lr-form-label">Target Locations</label>
                        <div className="lr-form-help">e.g. Netherlands, Amsterdam, DACH region, USA</div>
                        <div className="lr-tag-input-wrap">
                          {icpForm.target_locations.map((t, i) => (<span key={i} className="lr-tag">{t}<span className="lr-tag-x" onClick={() => removeTag("target_locations", i)}>×</span></span>))}
                          <input className="lr-tag-field" placeholder="Type and press Enter..." value={tagInputs.target_locations} onChange={e => setTagInputs(p => ({ ...p, target_locations: e.target.value }))} onKeyDown={e => handleTagKeyDown("target_locations", e)} />
                        </div>

                        <div className="lr-form-row">
                          <div>
                            {/* Company Sizes */}
                            <label className="lr-form-label">Company Sizes</label>
                            <div className="lr-toggle-grid">
                              {COMPANY_SIZES.map(s => (<button key={s} type="button" className={`lr-toggle ${icpForm.company_sizes.includes(s) ? "on" : ""}`} onClick={() => toggleSize(s)}>{s}</button>))}
                            </div>
                          </div>
                          <div>
                            {/* Platforms */}
                            <label className="lr-form-label">Target Platforms</label>
                            <div className="lr-toggle-grid">
                              {PLATFORM_OPTIONS.map(p => (<button key={p} type="button" className={`lr-toggle ${icpForm.target_platforms.includes(p) ? "on" : ""}`} onClick={() => togglePlatform(p)}>{p}</button>))}
                            </div>
                          </div>
                        </div>

                        {/* Job Titles */}
                        <label className="lr-form-label">Target Job Titles</label>
                        <div className="lr-form-help">e.g. CEO, Marketing Director, Head of Growth, Founder</div>
                        <div className="lr-tag-input-wrap">
                          {icpForm.job_titles.map((t, i) => (<span key={i} className="lr-tag">{t}<span className="lr-tag-x" onClick={() => removeTag("job_titles", i)}>×</span></span>))}
                          <input className="lr-tag-field" placeholder="Type and press Enter..." value={tagInputs.job_titles} onChange={e => setTagInputs(p => ({ ...p, job_titles: e.target.value }))} onKeyDown={e => handleTagKeyDown("job_titles", e)} />
                        </div>

                        {/* Keywords */}
                        <label className="lr-form-label">Keywords</label>
                        <div className="lr-form-help">Topics and terms that signal a good fit</div>
                        <div className="lr-tag-input-wrap">
                          {icpForm.keywords.map((t, i) => (<span key={i} className="lr-tag">{t}<span className="lr-tag-x" onClick={() => removeTag("keywords", i)}>×</span></span>))}
                          <input className="lr-tag-field" placeholder="Type and press Enter..." value={tagInputs.keywords} onChange={e => setTagInputs(p => ({ ...p, keywords: e.target.value }))} onKeyDown={e => handleTagKeyDown("keywords", e)} />
                        </div>

                        {/* Competitors */}
                        <label className="lr-form-label">Competitors</label>
                        <div className="lr-form-help">Companies whose customers might be a good fit</div>
                        <div className="lr-tag-input-wrap">
                          {icpForm.competitors.map((t, i) => (<span key={i} className="lr-tag">{t}<span className="lr-tag-x" onClick={() => removeTag("competitors", i)}>×</span></span>))}
                          <input className="lr-tag-field" placeholder="Type and press Enter..." value={tagInputs.competitors} onChange={e => setTagInputs(p => ({ ...p, competitors: e.target.value }))} onKeyDown={e => handleTagKeyDown("competitors", e)} />
                        </div>

                        <hr className="lr-divider" />

                        {/* Exclusions */}
                        <label className="lr-form-label">Excluded Industries</label>
                        <div className="lr-form-help">Industries to skip</div>
                        <div className="lr-tag-input-wrap">
                          {icpForm.excluded_industries.map((t, i) => (<span key={i} className="lr-tag" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.15)", color: "#f87171" }}>{t}<span className="lr-tag-x" onClick={() => removeTag("excluded_industries", i)}>×</span></span>))}
                          <input className="lr-tag-field" placeholder="Type and press Enter..." value={tagInputs.excluded_industries} onChange={e => setTagInputs(p => ({ ...p, excluded_industries: e.target.value }))} onKeyDown={e => handleTagKeyDown("excluded_industries", e)} />
                        </div>

                        <label className="lr-form-label">Excluded Titles</label>
                        <div className="lr-form-help">Job titles to ignore</div>
                        <div className="lr-tag-input-wrap">
                          {icpForm.excluded_titles.map((t, i) => (<span key={i} className="lr-tag" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.15)", color: "#f87171" }}>{t}<span className="lr-tag-x" onClick={() => removeTag("excluded_titles", i)}>×</span></span>))}
                          <input className="lr-tag-field" placeholder="Type and press Enter..." value={tagInputs.excluded_titles} onChange={e => setTagInputs(p => ({ ...p, excluded_titles: e.target.value }))} onKeyDown={e => handleTagKeyDown("excluded_titles", e)} />
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                          <button className="lr-btn" onClick={saveIcp} disabled={icpSaving}>{icpSaving ? "Saving..." : icp ? "Update ICP Profile" : "Save ICP Profile"}</button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* ====== LEADS TAB ====== */}
              {activeTab === "leads" && (
                <>
                  <div className="lr-stats">
                    <div className="lr-stat"><div className="lr-stat-val" style={{ color: "#22c97a" }}>{leads.length}</div><div className="lr-stat-lbl">Total Candidates</div></div>
                    <div className="lr-stat"><div className="lr-stat-val" style={{ color: "#f87171" }}>{leads.filter(l => l.lead_scores?.[0]?.temperature === "hot").length}</div><div className="lr-stat-lbl">🔥 Hot</div></div>
                    <div className="lr-stat"><div className="lr-stat-val" style={{ color: "#fbbf24" }}>{leads.filter(l => l.lead_scores?.[0]?.temperature === "warm").length}</div><div className="lr-stat-lbl">🟡 Warm</div></div>
                    <div className="lr-stat"><div className="lr-stat-val" style={{ color: "#60a5fa" }}>{leads.filter(l => l.lead_scores?.[0]?.temperature === "cold").length}</div><div className="lr-stat-lbl">🔵 Cold</div></div>
                  </div>

                  {leads.length === 0 ? (
                    <div className="lr-section">
                      <div className="lr-empty">
                        <span className="lr-empty-icon">👥</span>
                        <div className="lr-empty-title">No lead candidates yet</div>
                        <div className="lr-empty-sub">Import leads via CSV, add them manually, or run Lead Radar scoring on existing campaign leads. Coming in the next update.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="lr-table-wrap" style={{ overflowX: "auto" }}>
                      <table className="lr-table" style={{ minWidth: "700px" }}>
                        <thead><tr><th>Name</th><th>Company</th><th>Title</th><th>Source</th><th>Score</th><th>Status</th></tr></thead>
                        <tbody>
                          {leads.map(l => {
                            const score = l.lead_scores?.[0];
                            const badge = getScoreBadge(score?.temperature);
                            return (
                              <tr key={l.id}>
                                <td className="lr-lead-name">{l.name || `${l.first_name || ""} ${l.last_name || ""}`.trim() || "Unknown"}</td>
                                <td style={{ color: "#4d6b54" }}>{l.company || "—"}</td>
                                <td style={{ color: "#4d6b54", fontSize: "0.78rem" }}>{l.title || "—"}</td>
                                <td style={{ color: "#3d5240", fontSize: "0.75rem" }}>{l.source_type?.replace(/_/g, " ") || "—"}</td>
                                <td>{score ? <span className="lr-score-badge" style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}>{score.total_score} · {badge.label}</span> : <span style={{ color: "#2a3d2e" }}>—</span>}</td>
                                <td style={{ fontSize: "0.75rem", color: "#3d5240", textTransform: "capitalize" }}>{l.status}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* ====== CREDITS TAB ====== */}
              {activeTab === "credits" && (
                <>
                  <div className="lr-stats">
                    <div className="lr-stat"><div className="lr-stat-val" style={{ color: "#22c97a" }}>{creditsRemaining}</div><div className="lr-stat-lbl">Credits Remaining</div></div>
                    <div className="lr-stat"><div className="lr-stat-val" style={{ color: "#a78bfa" }}>{creditsUsed}</div><div className="lr-stat-lbl">Used This Month</div></div>
                    <div className="lr-stat"><div className="lr-stat-val" style={{ color: "#22c97a" }}>{creditsLimit}</div><div className="lr-stat-lbl">Monthly Limit</div></div>
                    <div className="lr-stat"><div className="lr-stat-val" style={{ color: "#3d5240", fontSize: "1rem" }}>{credits?.reset_date || "—"}</div><div className="lr-stat-lbl">Next Reset</div></div>
                  </div>

                  <div className="lr-section">
                    <div className="lr-section-title">Credit Usage</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#3d5240", marginBottom: "0.4rem", fontFamily: "Inter,sans-serif" }}>
                      <span>{creditsUsed} used</span>
                      <span>{creditsRemaining} remaining</span>
                    </div>
                    <div className="lr-credit-bar-wrap">
                      <div className="lr-credit-bar" style={{ width: `${creditsPct}%`, background: creditsPct > 90 ? "#f87171" : creditsPct > 70 ? "#fbbf24" : "#22c97a" }} />
                    </div>
                    <div style={{ marginTop: "1.25rem", fontSize: "0.82rem", color: "#3d5240", lineHeight: 1.6, fontFamily: "Inter,sans-serif" }}>
                      Each lead scored or enriched uses 1 credit. AI recommendations use 1 additional credit. Credits reset automatically on the 1st of each month.
                    </div>
                  </div>
                </>
              )}

              <div className="lr-disclaimer">
                Lead Radar uses approved sources, existing campaign activity, uploaded data, and public business signals to identify potential leads. Users are responsible for complying with platform terms and privacy rules.
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
