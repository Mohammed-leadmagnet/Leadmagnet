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

export default function LeadRadar() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ICP
  const [icp, setIcp] = useState(null);
  const [icpLoading, setIcpLoading] = useState(false);
  const [icpSaving, setIcpSaving] = useState(false);
  const [icpForm, setIcpForm] = useState({ target_industries: [], target_locations: [], company_sizes: [], job_titles: [], keywords: [], competitors: [], excluded_industries: [], excluded_titles: [], target_platforms: [] });
  const [tagInputs, setTagInputs] = useState({ target_industries: "", target_locations: "", job_titles: "", keywords: "", competitors: "", excluded_industries: "", excluded_titles: "" });

  // Credits
  const [credits, setCredits] = useState(null);

  // Leads
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [addingLead, setAddingLead] = useState(false);
  const [importing, setImporting] = useState(false);
  const [filterTemp, setFilterTemp] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const csvRef = useRef(null);

  const [leadForm, setLeadForm] = useState({ name: "", first_name: "", last_name: "", title: "", company: "", industry: "", location: "", email: "", website: "", linkedin_url: "", instagram_handle: "", source_type: "manual_entry" });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      const { data: sub } = await supabase.from("subscriptions").select("plan, status").eq("user_id", data.user.id).maybeSingle();
      setSubscription(sub);
      setCheckingAccess(false);
      if (sub && sub.plan === "scale" && (sub.status === "active" || sub.status === "trialing")) {
        loadClients(data.user.id);
        loadCredits(data.user.id);
      }
    });
  }, []);

  const hasScale = subscription && subscription.plan === "scale" && (subscription.status === "active" || subscription.status === "trialing");
  const hasAgency = subscription && (subscription.plan === "agency" || subscription.plan === "scale") && (subscription.status === "active" || subscription.status === "trialing");

  const loadClients = async (uid) => { const { data } = await supabase.from("agency_clients").select("id, name, company").eq("agency_user_id", uid).order("name"); if (data) setClients(data); };
  const loadCredits = async (uid) => { try { const r = await fetch(`/api/lead-radar/credits?userId=${uid}`); const d = await r.json(); if (d.credits) setCredits(d.credits); } catch {} };

  const loadIcp = async (cid) => {
    if (!user || !cid) return;
    setIcpLoading(true);
    try {
      const r = await fetch(`/api/lead-radar/icp?userId=${user.id}&clientId=${cid}`);
      const d = await r.json();
      if (d.icp) { setIcp(d.icp); setIcpForm({ target_industries: d.icp.target_industries || [], target_locations: d.icp.target_locations || [], company_sizes: d.icp.company_sizes || [], job_titles: d.icp.job_titles || [], keywords: d.icp.keywords || [], competitors: d.icp.competitors || [], excluded_industries: d.icp.excluded_industries || [], excluded_titles: d.icp.excluded_titles || [], target_platforms: d.icp.target_platforms || [] }); }
      else { setIcp(null); setIcpForm({ target_industries: [], target_locations: [], company_sizes: [], job_titles: [], keywords: [], competitors: [], excluded_industries: [], excluded_titles: [], target_platforms: [] }); }
    } catch {} setIcpLoading(false);
  };

  const loadLeads = async (cid) => {
    if (!user || !cid) return;
    setLeadsLoading(true);
    try {
      const r = await fetch(`/api/lead-radar/leads?userId=${user.id}&clientId=${cid}`);
      const d = await r.json();
      setLeads(d.leads || []);
    } catch {} setLeadsLoading(false);
  };

  useEffect(() => { if (selectedClientId && hasScale) { loadIcp(selectedClientId); loadLeads(selectedClientId); } }, [selectedClientId]);

  const saveIcp = async () => {
    if (!user || !selectedClientId) return;
    setIcpSaving(true);
    try {
      const r = await fetch("/api/lead-radar/icp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, clientId: selectedClientId, ...icpForm }) });
      const d = await r.json();
      if (d.success) { setIcp(d.icp); setSuccess("ICP profile saved!"); } else setError(d.error || "Failed");
    } catch (e) { setError(e.message); }
    setIcpSaving(false); setTimeout(() => { setSuccess(""); setError(""); }, 4000);
  };

  const addTag = (f, v) => { if (!v.trim() || icpForm[f].includes(v.trim())) return; setIcpForm(p => ({ ...p, [f]: [...p[f], v.trim()] })); setTagInputs(p => ({ ...p, [f]: "" })); };
  const removeTag = (f, i) => setIcpForm(p => ({ ...p, [f]: p[f].filter((_, x) => x !== i) }));
  const handleTagKeyDown = (f, e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(f, tagInputs[f]); } };
  const toggleSize = (s) => setIcpForm(p => ({ ...p, company_sizes: p.company_sizes.includes(s) ? p.company_sizes.filter(x => x !== s) : [...p.company_sizes, s] }));
  const togglePlatform = (p) => setIcpForm(prev => ({ ...prev, target_platforms: prev.target_platforms.includes(p) ? prev.target_platforms.filter(x => x !== p) : [...prev.target_platforms, p] }));

  const handleAddLead = async () => {
    if (!user || !selectedClientId) return;
    setAddingLead(true);
    try {
      const r = await fetch("/api/lead-radar/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, clientId: selectedClientId, lead: leadForm }) });
      const d = await r.json();
      if (d.success) { setSuccess("Lead added!"); setShowAddLead(false); setLeadForm({ name: "", first_name: "", last_name: "", title: "", company: "", industry: "", location: "", email: "", website: "", linkedin_url: "", instagram_handle: "", source_type: "manual_entry" }); loadLeads(selectedClientId); loadCredits(user.id); }
      else setError(d.error || "Failed");
    } catch (e) { setError(e.message); }
    setAddingLead(false); setTimeout(() => { setSuccess(""); setError(""); }, 4000);
  };

  const handleCSV = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) { setError("CSV must have a header + at least 1 row"); setImporting(false); return; }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
        const row = {};
        headers.forEach((h, j) => { if (vals[j]) row[h] = vals[j]; });
        rows.push(row);
      }
      const r = await fetch("/api/lead-radar/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, clientId: selectedClientId, leads: rows }) });
      const d = await r.json();
      if (d.success) { setSuccess(`Imported ${d.imported} leads (${d.skipped} skipped)`); loadLeads(selectedClientId); loadCredits(user.id); }
      else setError(d.error || "Import failed");
    } catch (e) { setError(e.message); }
    setImporting(false); if (csvRef.current) csvRef.current.value = ""; setTimeout(() => { setSuccess(""); setError(""); }, 5000);
  };

  const handleScore = async () => {
    if (!user || !selectedClientId) return;
    setScoring(true);
    try {
      const r = await fetch("/api/lead-radar/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, clientId: selectedClientId }) });
      const d = await r.json();
      if (d.success) { setSuccess(`Scored ${d.scored} leads (${d.creditsUsed} credits used)${d.warning ? " — " + d.warning : ""}`); loadLeads(selectedClientId); loadCredits(user.id); }
      else setError(d.error || "Scoring failed");
    } catch (e) { setError(e.message); }
    setScoring(false); setTimeout(() => { setSuccess(""); setError(""); }, 5000);
  };

  const updateStatus = async (leadId, status) => {
    try {
      const r = await fetch("/api/lead-radar/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, leadId, status }) });
      const d = await r.json();
      if (d.success) { setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l)); setSuccess(`Lead ${status}`); }
      else setError(d.error);
    } catch (e) { setError(e.message); }
    setTimeout(() => { setSuccess(""); setError(""); }, 3000);
  };

  const getBadge = (t) => {
    if (t === "hot") return { label: "🔥 Hot", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", color: "#f87171" };
    if (t === "warm") return { label: "🟡 Warm", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", color: "#fbbf24" };
    return { label: "🔵 Cold", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", color: "#60a5fa" };
  };

  const getStatusColor = (s) => {
    const m = { new: "#3d5240", approved: "#22c97a", in_sequence: "#a78bfa", saved: "#fbbf24", dismissed: "#6b7280", converted: "#22c97a", duplicate: "#f87171" };
    return m[s] || "#3d5240";
  };

  const filteredLeads = leads.filter(l => {
    const score = l.lead_scores?.[0];
    if (filterTemp !== "All" && score?.temperature !== filterTemp.toLowerCase()) return false;
    if (filterStatus !== "All" && l.status !== filterStatus) return false;
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

  return (
    <main style={{ minHeight: "100vh", background: "#060a07", fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .n{background:rgba(8,14,10,0.85);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.05);padding:0 1.75rem;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#22c97a;text-decoration:none;display:flex;align-items:center;gap:0.4rem;}.logo-dot{width:8px;height:8px;background:#22c97a;border-radius:50%;box-shadow:0 0 10px rgba(34,201,122,0.5);}
        .bk{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-size:0.82rem;padding:0.4rem 0.9rem;border-radius:8px;cursor:pointer;text-decoration:none;font-family:'Inter',sans-serif;font-weight:500;}.bk:hover{border-color:rgba(34,201,122,0.25);color:#22c97a;}
        .ct{max-width:1100px;margin:0 auto;padding:2rem 1.5rem 3rem;}
        .al{font-size:0.82rem;padding:0.75rem 1rem;border-radius:11px;margin-bottom:1.5rem;font-family:'Inter',sans-serif;font-weight:500;}
        .al-s{background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.15);color:#22c97a;}
        .al-e{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);color:#f87171;}
        .hd{margin-bottom:1.5rem;}.hd h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.6rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.035em;}.hd p{font-size:0.84rem;color:#3d5240;font-family:'Inter',sans-serif;}
        .badge{display:inline-flex;align-items:center;gap:0.3rem;font-size:0.68rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:100px;background:rgba(147,51,234,0.08);border:1px solid rgba(147,51,234,0.18);color:#a78bfa;font-family:'Plus Jakarta Sans',sans-serif;margin-left:0.5rem;vertical-align:middle;}
        .cs{width:100%;max-width:360px;background:rgba(12,21,16,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.65rem 1rem;color:#e2ede7;font-size:0.84rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1.5rem;}
        .cs option{background:#080c09;color:#e2ede7;}
        .tabs{display:flex;gap:0.35rem;margin-bottom:2rem;background:rgba(12,21,16,0.6);padding:0.25rem;border-radius:10px;width:fit-content;}
        .tab{background:transparent;border:none;color:#3d5240;font-size:0.82rem;padding:0.5rem 1.15rem;border-radius:8px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;transition:all 0.15s;}.tab.on{background:rgba(34,201,122,0.1);color:#22c97a;}
        .sec{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1.5rem;margin-bottom:1rem;}
        .sec-t{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#c4d4c8;margin-bottom:1.25rem;}
        .fl{display:block;font-size:0.72rem;font-weight:700;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.03em;text-transform:uppercase;font-family:'Inter',sans-serif;}
        .fh{font-size:0.7rem;color:#2a3d2e;margin-bottom:0.5rem;font-family:'Inter',sans-serif;}
        .tw{display:flex;flex-wrap:wrap;gap:0.35rem;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.5rem 0.75rem;margin-bottom:1rem;min-height:42px;align-items:center;}.tw:focus-within{border-color:rgba(34,201,122,0.25);}
        .tg{display:inline-flex;align-items:center;gap:0.25rem;background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.15);color:#22c97a;font-size:0.72rem;font-weight:600;padding:0.2rem 0.5rem;border-radius:6px;font-family:'Inter',sans-serif;}.tg-x{cursor:pointer;font-size:0.8rem;opacity:0.6;}.tg-x:hover{opacity:1;}
        .tf{background:transparent;border:none;outline:none;color:#e2ede7;font-size:0.82rem;font-family:'Inter',sans-serif;min-width:120px;flex:1;}.tf::placeholder{color:#1e2e22;}
        .tgr{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem;}
        .to{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-size:0.78rem;padding:0.4rem 0.85rem;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;transition:all 0.15s;}.to.on{background:rgba(34,201,122,0.08);border-color:rgba(34,201,122,0.25);color:#22c97a;font-weight:600;}
        .btn{background:linear-gradient(135deg,#22c97a,#1aae6a);color:#071209;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.82rem;padding:0.55rem 1.15rem;border-radius:9px;border:none;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 8px rgba(34,201,122,0.15);}.btn:hover{transform:translateY(-1px);}.btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
        .btn-s{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.15);color:#22c97a;box-shadow:none;}.btn-s:hover{background:rgba(34,201,122,0.15);}
        .btn-p{background:rgba(147,51,234,0.08);border:1px solid rgba(147,51,234,0.15);color:#a78bfa;box-shadow:none;}.btn-p:hover{background:rgba(147,51,234,0.15);}
        .btn-d{background:rgba(99,179,237,0.08);border:1px solid rgba(99,179,237,0.15);color:#63b3ed;box-shadow:none;}.btn-d:hover{background:rgba(99,179,237,0.15);}
        .btn-g{background:rgba(160,160,160,0.08);border:1px solid rgba(160,160,160,0.15);color:#a0a0a0;box-shadow:none;}
        .fr{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
        .hr{border:none;border-top:1px solid rgba(255,255,255,0.04);margin:1.25rem 0;}
        .sts{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:0.75rem;margin-bottom:1.5rem;}
        .st{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1rem;text-align:center;}.st-v{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;line-height:1;letter-spacing:-0.04em;}.st-l{font-size:0.66rem;color:#3d5240;margin-top:0.25rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Inter',sans-serif;font-weight:600;}
        .acts{display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;margin-bottom:1.25rem;}
        .fi{background:transparent;border:1px solid rgba(255,255,255,0.05);color:#2a3d2e;font-size:0.75rem;padding:0.35rem 0.75rem;border-radius:100px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;transition:all 0.15s;}.fi.on{background:rgba(34,201,122,0.08);border-color:rgba(34,201,122,0.2);color:#22c97a;}
        .tbw{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;overflow:hidden;}
        .tb{width:100%;border-collapse:collapse;}
        .tb th{font-size:0.64rem;color:#2a3d2e;text-transform:uppercase;letter-spacing:0.1em;padding:0.7rem 0.75rem;text-align:left;border-bottom:1px solid rgba(255,255,255,0.04);font-weight:700;background:rgba(0,0,0,0.2);font-family:'Inter',sans-serif;}
        .tb td{font-size:0.8rem;color:#8fa696;padding:0.65rem 0.75rem;border-bottom:1px solid rgba(255,255,255,0.025);font-family:'Inter',sans-serif;}
        .tb tr:hover td{background:rgba(34,201,122,0.02);}
        .ln{font-weight:600;color:#e2ede7;font-family:'Plus Jakarta Sans',sans-serif;}
        .sb{display:inline-flex;align-items:center;gap:0.2rem;font-size:0.68rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;}
        .stb{font-size:0.68rem;font-weight:600;padding:0.15rem 0.5rem;border-radius:100px;text-transform:capitalize;font-family:'Inter',sans-serif;}
        .ab{font-size:0.68rem;padding:0.3rem 0.55rem;border-radius:7px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;border:none;transition:all 0.15s;}
        .cbw{height:8px;background:rgba(255,255,255,0.04);border-radius:100px;overflow:hidden;margin-top:0.5rem;}.cb{height:100%;border-radius:100px;transition:width 0.4s;}
        .emp{text-align:center;padding:3rem 2rem;color:#2a3d2e;}.emp-i{font-size:2.5rem;margin-bottom:1rem;display:block;}.emp-t{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:700;color:#c4d4c8;margin-bottom:0.4rem;}.emp-s{font-size:0.84rem;color:#3d5240;line-height:1.55;max-width:400px;margin:0 auto;font-family:'Inter',sans-serif;}
        .dis{font-size:0.72rem;color:#2a3d2e;font-family:'Inter',sans-serif;text-align:center;margin-top:2rem;line-height:1.5;max-width:600px;margin-left:auto;margin-right:auto;}
        .mo{position:fixed;inset:0;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem;backdrop-filter:blur(8px);}
        .md{background:#0c1510;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:2rem;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;}
        .md-t{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.25rem;font-weight:800;color:#f0f7f2;margin-bottom:1.5rem;}
        .inp{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.65rem 0.85rem;color:#e2ede7;font-size:0.84rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:0.75rem;}.inp:focus{border-color:rgba(34,201,122,0.3);}
        .sel{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.65rem 0.85rem;color:#e2ede7;font-size:0.84rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:0.75rem;}
        .mb{display:flex;gap:0.75rem;margin-top:0.5rem;}
        .mc{flex:1;background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:0.84rem;padding:0.7rem;border-radius:10px;cursor:pointer;}
        .ms{flex:2;background:linear-gradient(135deg,#22c97a,#1aae6a);color:#071209;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.84rem;padding:0.7rem;border-radius:10px;border:none;cursor:pointer;}.ms:disabled{opacity:0.4;cursor:not-allowed;}
        @media(max-width:768px){.fr{grid-template-columns:1fr;}.sts{grid-template-columns:repeat(2,1fr);}.ct{padding:1.5rem 1rem;}.acts{flex-direction:column;align-items:flex-start;}}
      `}</style>

      <nav className="n"><a href="/" className="logo"><span className="logo-dot"></span> LeadMagnet</a><a href="/agency" className="bk">← Client Manager</a></nav>

      {checkingAccess ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}><div style={{ fontSize: "1.2rem", color: "#22c97a", fontWeight: 800 }}>Loading...</div></div>
      ) : !hasAgency && !hasScale ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "2rem" }}><div style={{ textAlign: "center", maxWidth: "480px" }}><div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div><div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#f0f7f2", marginBottom: "0.5rem" }}>Scale Plan Required</div><div style={{ fontSize: "0.88rem", color: "#3d5240", lineHeight: 1.6, marginBottom: "2rem" }}>Lead Radar is a premium feature for Scale subscribers.</div><button onClick={() => window.location.href = "/pricing"} style={{ background: "linear-gradient(135deg,#22c97a,#1aae6a)", color: "#071209", fontWeight: 700, fontSize: "0.9rem", padding: "0.7rem 1.5rem", borderRadius: "10px", border: "none", cursor: "pointer" }}>View Plans & Upgrade →</button></div></div>
      ) : hasAgency && !hasScale ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "2rem" }}><div style={{ textAlign: "center", maxWidth: "520px" }}><div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛰️</div><div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#f0f7f2", marginBottom: "0.5rem" }}>Lead Radar <span className="badge">Scale</span></div><div style={{ fontSize: "0.88rem", color: "#3d5240", lineHeight: 1.7, marginBottom: "2rem" }}>Discover hot potential leads, prioritize prospects by fit and intent, and turn campaign signals into qualified opportunities.</div><button onClick={() => window.location.href = "/pricing"} style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", padding: "0.7rem 1.5rem", borderRadius: "10px", border: "none", cursor: "pointer" }}>Upgrade to Scale →</button></div></div>
      ) : (
        <div className="ct">
          {success && <div className="al al-s">✓ {success}</div>}
          {error && <div className="al al-e">⚠ {error}</div>}

          <div className="hd"><h1>Lead Radar <span className="badge">Scale</span></h1><p>Discover, score, and prioritize high-potential prospects for each client.</p></div>

          <select className="cs" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
            <option value="">Select a client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ""}</option>)}
          </select>

          {!selectedClientId ? (
            <div className="sec"><div className="emp"><span className="emp-i">🛰️</span><div className="emp-t">Select a client to get started</div><div className="emp-s">Choose a client above to build their ICP, import leads, and run scoring.</div></div></div>
          ) : (
            <>
              <div className="tabs">
                <button className={`tab ${activeTab === "leads" ? "on" : ""}`} onClick={() => setActiveTab("leads")}>👥 Leads ({leads.length})</button>
                <button className={`tab ${activeTab === "icp" ? "on" : ""}`} onClick={() => setActiveTab("icp")}>🎯 ICP Profile</button>
                <button className={`tab ${activeTab === "credits" ? "on" : ""}`} onClick={() => setActiveTab("credits")}>⚡ Credits</button>
              </div>

              {/* ====== LEADS TAB ====== */}
              {activeTab === "leads" && (<>
                <div className="sts">
                  <div className="st"><div className="st-v" style={{ color: "#22c97a" }}>{totalLeads}</div><div className="st-l">Total</div></div>
                  <div className="st"><div className="st-v" style={{ color: "#f87171" }}>{hotCount}</div><div className="st-l">🔥 Hot</div></div>
                  <div className="st"><div className="st-v" style={{ color: "#fbbf24" }}>{warmCount}</div><div className="st-l">🟡 Warm</div></div>
                  <div className="st"><div className="st-v" style={{ color: "#60a5fa" }}>{coldCount}</div><div className="st-l">🔵 Cold</div></div>
                  <div className="st"><div className="st-v" style={{ color: "#3d5240" }}>{unscoredCount}</div><div className="st-l">Unscored</div></div>
                  <div className="st"><div className="st-v" style={{ color: "#a78bfa" }}>{creditsRemaining}</div><div className="st-l">Credits Left</div></div>
                </div>

                <div className="acts">
                  <button className="btn" onClick={() => setShowAddLead(true)}>+ Add Lead</button>
                  <label className="btn btn-d" style={{ cursor: "pointer" }}>{importing ? "Importing..." : "📁 Import CSV"}<input type="file" accept=".csv" ref={csvRef} onChange={handleCSV} style={{ display: "none" }} /></label>
                  <button className="btn btn-p" onClick={handleScore} disabled={scoring || leads.length === 0}>{scoring ? "Scoring..." : `⚡ Run Scoring (${leads.length})`}</button>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {["All", "Hot", "Warm", "Cold"].map(t => <button key={t} className={`fi ${filterTemp === t ? "on" : ""}`} onClick={() => setFilterTemp(t)}>{t}</button>)}
                    {["All", "new", "approved", "saved", "dismissed"].map(s => <button key={s} className={`fi ${filterStatus === s ? "on" : ""}`} onClick={() => setFilterStatus(s)} style={{ textTransform: "capitalize" }}>{s === "All" ? "All Status" : s}</button>)}
                  </div>
                </div>

                {leadsLoading ? <div style={{ textAlign: "center", padding: "2rem", color: "#3d5240" }}>Loading leads...</div> :
                  filteredLeads.length === 0 ? (
                    <div className="sec"><div className="emp"><span className="emp-i">👥</span><div className="emp-t">{leads.length === 0 ? "No leads yet" : "No leads match filters"}</div><div className="emp-s">{leads.length === 0 ? "Add leads manually, import a CSV, or run Lead Radar scoring." : "Try adjusting your filters."}</div></div></div>
                  ) : (
                    <div className="tbw" style={{ overflowX: "auto" }}>
                      <table className="tb" style={{ minWidth: "850px" }}>
                        <thead><tr><th>Name</th><th>Company</th><th>Title</th><th>Source</th><th>Score</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                          {filteredLeads.map(l => {
                            const sc = l.lead_scores?.[0];
                            const b = getBadge(sc?.temperature);
                            return (
                              <tr key={l.id}>
                                <td className="ln">{l.name || `${l.first_name || ""} ${l.last_name || ""}`.trim() || "Unknown"}</td>
                                <td style={{ color: "#4d6b54" }}>{l.company || "—"}</td>
                                <td style={{ color: "#4d6b54", fontSize: "0.76rem" }}>{l.title || "—"}</td>
                                <td style={{ color: "#3d5240", fontSize: "0.72rem" }}>{(l.source_type || "—").replace(/_/g, " ")}</td>
                                <td>{sc ? <span className="sb" style={{ background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>{sc.total_score} · {b.label}</span> : <span style={{ color: "#2a3d2e", fontSize: "0.75rem" }}>Unscored</span>}</td>
                                <td><span className="stb" style={{ background: `${getStatusColor(l.status)}15`, border: `1px solid ${getStatusColor(l.status)}30`, color: getStatusColor(l.status) }}>{l.status}</span></td>
                                <td style={{ display: "flex", gap: "0.25rem" }}>
                                  {l.status !== "approved" && <button className="ab" style={{ background: "rgba(34,201,122,0.08)", border: "1px solid rgba(34,201,122,0.15)", color: "#22c97a" }} onClick={() => updateStatus(l.id, "approved")}>✓</button>}
                                  {l.status !== "saved" && <button className="ab" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)", color: "#fbbf24" }} onClick={() => updateStatus(l.id, "saved")}>★</button>}
                                  {l.status !== "dismissed" && <button className="ab" style={{ background: "rgba(107,114,128,0.08)", border: "1px solid rgba(107,114,128,0.15)", color: "#6b7280" }} onClick={() => updateStatus(l.id, "dismissed")}>✕</button>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
              </>)}

              {/* ====== ICP TAB ====== */}
              {activeTab === "icp" && (<>
                <div className="sec">
                  <div className="sec-t">🎯 Ideal Customer Profile</div>
                  <p style={{ fontSize: "0.82rem", color: "#3d5240", marginBottom: "1.5rem", fontFamily: "Inter,sans-serif", lineHeight: 1.6 }}>Define who the perfect lead looks like for this client. Lead Radar uses this to score every prospect.</p>
                  {icpLoading ? <div style={{ textAlign: "center", padding: "2rem", color: "#3d5240" }}>Loading ICP...</div> : (<>
                    {[
                      { key: "target_industries", label: "Target Industries", help: "e.g. SaaS, Marketing, E-commerce" },
                      { key: "target_locations", label: "Target Locations", help: "e.g. Netherlands, Amsterdam, USA" },
                      { key: "job_titles", label: "Target Job Titles", help: "e.g. CEO, Marketing Director, Founder" },
                      { key: "keywords", label: "Keywords", help: "Topics that signal a good fit" },
                      { key: "competitors", label: "Competitors", help: "Companies whose customers might be a good fit" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="fl">{f.label}</label><div className="fh">{f.help}</div>
                        <div className="tw">
                          {icpForm[f.key].map((t, i) => <span key={i} className="tg">{t}<span className="tg-x" onClick={() => removeTag(f.key, i)}>×</span></span>)}
                          <input className="tf" placeholder="Type and press Enter..." value={tagInputs[f.key]} onChange={e => setTagInputs(p => ({ ...p, [f.key]: e.target.value }))} onKeyDown={e => handleTagKeyDown(f.key, e)} />
                        </div>
                      </div>
                    ))}
                    <div className="fr"><div><label className="fl">Company Sizes</label><div className="tgr">{COMPANY_SIZES.map(s => <button key={s} type="button" className={`to ${icpForm.company_sizes.includes(s) ? "on" : ""}`} onClick={() => toggleSize(s)}>{s}</button>)}</div></div><div><label className="fl">Platforms</label><div className="tgr">{PLATFORM_OPTIONS.map(p => <button key={p} type="button" className={`to ${icpForm.target_platforms.includes(p) ? "on" : ""}`} onClick={() => togglePlatform(p)}>{p}</button>)}</div></div></div>
                    <hr className="hr" />
                    {[
                      { key: "excluded_industries", label: "Excluded Industries", help: "Industries to skip" },
                      { key: "excluded_titles", label: "Excluded Titles", help: "Job titles to ignore" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="fl">{f.label}</label><div className="fh">{f.help}</div>
                        <div className="tw">
                          {icpForm[f.key].map((t, i) => <span key={i} className="tg" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.15)", color: "#f87171" }}>{t}<span className="tg-x" onClick={() => removeTag(f.key, i)}>×</span></span>)}
                          <input className="tf" placeholder="Type and press Enter..." value={tagInputs[f.key]} onChange={e => setTagInputs(p => ({ ...p, [f.key]: e.target.value }))} onKeyDown={e => handleTagKeyDown(f.key, e)} />
                        </div>
                      </div>
                    ))}
                    <button className="btn" onClick={saveIcp} disabled={icpSaving}>{icpSaving ? "Saving..." : icp ? "Update ICP Profile" : "Save ICP Profile"}</button>
                  </>)}
                </div>
              </>)}

              {/* ====== CREDITS TAB ====== */}
              {activeTab === "credits" && (<>
                <div className="sts">
                  <div className="st"><div className="st-v" style={{ color: "#22c97a" }}>{creditsRemaining}</div><div className="st-l">Remaining</div></div>
                  <div className="st"><div className="st-v" style={{ color: "#a78bfa" }}>{creditsUsed}</div><div className="st-l">Used</div></div>
                  <div className="st"><div className="st-v" style={{ color: "#22c97a" }}>{creditsLimit}</div><div className="st-l">Monthly Limit</div></div>
                  <div className="st"><div className="st-v" style={{ color: "#3d5240", fontSize: "1rem" }}>{credits?.reset_date || "—"}</div><div className="st-l">Next Reset</div></div>
                </div>
                <div className="sec">
                  <div className="sec-t">Credit Usage</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#3d5240", marginBottom: "0.4rem" }}><span>{creditsUsed} used</span><span>{creditsRemaining} remaining</span></div>
                  <div className="cbw"><div className="cb" style={{ width: `${creditsPct}%`, background: creditsPct > 90 ? "#f87171" : creditsPct > 70 ? "#fbbf24" : "#22c97a" }} /></div>
                  <div style={{ marginTop: "1.25rem", fontSize: "0.82rem", color: "#3d5240", lineHeight: 1.6 }}>Each lead scored uses 1 credit. AI recommendations use 1 additional credit. Credits reset on the 1st of each month.</div>
                </div>
              </>)}

              <div className="dis">Lead Radar uses approved sources, existing campaign activity, uploaded data, and public business signals to identify potential leads. Users are responsible for complying with platform terms and privacy rules.</div>
            </>
          )}
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showAddLead && (
        <div className="mo"><div className="md">
          <div className="md-t">Add Lead Candidate</div>
          <div className="fr">
            <div><label className="fl">First Name</label><input className="inp" value={leadForm.first_name} onChange={e => setLeadForm(p => ({ ...p, first_name: e.target.value }))} placeholder="John" /></div>
            <div><label className="fl">Last Name</label><input className="inp" value={leadForm.last_name} onChange={e => setLeadForm(p => ({ ...p, last_name: e.target.value }))} placeholder="Smith" /></div>
          </div>
          <label className="fl">Full Name</label><input className="inp" value={leadForm.name} onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))} placeholder="Or enter full name" />
          <div className="fr">
            <div><label className="fl">Job Title</label><input className="inp" value={leadForm.title} onChange={e => setLeadForm(p => ({ ...p, title: e.target.value }))} placeholder="CEO" /></div>
            <div><label className="fl">Company</label><input className="inp" value={leadForm.company} onChange={e => setLeadForm(p => ({ ...p, company: e.target.value }))} placeholder="Acme Corp" /></div>
          </div>
          <div className="fr">
            <div><label className="fl">Industry</label><input className="inp" value={leadForm.industry} onChange={e => setLeadForm(p => ({ ...p, industry: e.target.value }))} placeholder="SaaS" /></div>
            <div><label className="fl">Location</label><input className="inp" value={leadForm.location} onChange={e => setLeadForm(p => ({ ...p, location: e.target.value }))} placeholder="Amsterdam, NL" /></div>
          </div>
          <label className="fl">Email</label><input className="inp" type="email" value={leadForm.email} onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))} placeholder="john@acme.com" />
          <div className="fr">
            <div><label className="fl">LinkedIn URL</label><input className="inp" value={leadForm.linkedin_url} onChange={e => setLeadForm(p => ({ ...p, linkedin_url: e.target.value }))} placeholder="linkedin.com/in/..." /></div>
            <div><label className="fl">Website</label><input className="inp" value={leadForm.website} onChange={e => setLeadForm(p => ({ ...p, website: e.target.value }))} placeholder="acme.com" /></div>
          </div>
          <label className="fl">Source</label>
          <select className="sel" value={leadForm.source_type} onChange={e => setLeadForm(p => ({ ...p, source_type: e.target.value }))}>
            {SOURCE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <div className="mb">
            <button className="mc" onClick={() => setShowAddLead(false)}>Cancel</button>
            <button className="ms" onClick={handleAddLead} disabled={addingLead || (!leadForm.name && !leadForm.first_name)}>{addingLead ? "Adding..." : "Add Lead →"}</button>
          </div>
        </div></div>
      )}
    </main>
  );
}
