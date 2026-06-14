"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TIERS = ["VIP", "Standard", "Trial", "Inactive"];
const TIER_COLORS = {
  VIP: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", color: "#fbbf24" },
  Standard: { bg: "rgba(34,201,122,0.08)", border: "rgba(34,201,122,0.2)", color: "#22c97a" },
  Trial: { bg: "rgba(99,179,237,0.08)", border: "rgba(99,179,237,0.2)", color: "#63b3ed" },
  Inactive: { bg: "rgba(160,160,160,0.08)", border: "rgba(160,160,160,0.2)", color: "#a0a0a0" },
};
const PLATFORMS = ["LinkedIn", "Instagram", "Gmail"];
const REPORT_FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

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
    name: "", email: "", company: "", phone: "",
    tier: "Standard", platforms: [], mrr: "",
    notes: "", health_score: 75,
    auto_report: false, report_frequency: "monthly",
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", data.user.id)
        .maybeSingle();

      setSubscription(sub);
      setCheckingAccess(false);

      if (sub && (sub.plan === "agency" || sub.plan === "scale") && (sub.status === "active" || sub.status === "trialing")) {
        loadClients(data.user.id);
      }
    });
  }, []);

  const hasAccess = subscription && (subscription.plan === "agency" || subscription.plan === "scale") && (subscription.status === "active" || subscription.status === "trialing");

  const loadClients = async (userId) => {
    const { data: clientsData } = await supabase.from("agency_clients").select("*").eq("agency_user_id", userId).order("created_at", { ascending: false });
    if (!clientsData) return;
    const enriched = await Promise.all(clientsData.map(async (c) => {
      const { count: campaignsCount } = await supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("client_id", c.id);
      const { data: clientLeads } = await supabase.from("leads").select("lead_score").eq("client_id", c.id);
      const leadsCount = clientLeads?.length || 0;
      const hotLeads = clientLeads?.filter(l => l.lead_score === "hot").length || 0;
      const warmLeads = clientLeads?.filter(l => l.lead_score === "warm").length || 0;
      const coldLeads = clientLeads?.filter(l => l.lead_score === "cold").length || 0;
      return { ...c, campaigns_count: campaignsCount || 0, leads_count: leadsCount, hot_leads: hotLeads, warm_leads: warmLeads, cold_leads: coldLeads };
    }));
    setClients(enriched);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (showEditClient && selectedClient) {
        const { error: dbError } = await supabase.from("agency_clients").update({ ...form, mrr: parseFloat(form.mrr) || 0 }).eq("id", selectedClient.id);
        if (dbError) throw dbError;
        setSuccess("Client updated!");
      } else {
        const { data: client, error: dbError } = await supabase.from("agency_clients").insert({
          agency_user_id: user.id, ...form, mrr: parseFloat(form.mrr) || 0, status: "Active", portal_token: crypto.randomUUID(),
        }).select().single();
        if (dbError) throw dbError;
        if (client) setClients(prev => [{ ...client, campaigns_count: 0, leads_count: 0, hot_leads: 0, warm_leads: 0, cold_leads: 0 }, ...prev]);
        setSuccess("Client added!");
      }
      setShowAddClient(false); setShowEditClient(false); resetForm();
      if (user) loadClients(user.id);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) { setError("Error: " + err.message); }
    setLoading(false);
  };

  const resetForm = () => setForm({ name: "", email: "", company: "", phone: "", tier: "Standard", platforms: [], mrr: "", notes: "", health_score: 75, auto_report: false, report_frequency: "monthly" });

  const handleSendReport = async (client, e) => {
    e.stopPropagation(); setSendingReport(client.id);
    try {
      const res = await fetch("/api/send-report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId: client.id, userId: user.id }) });
      const data = await res.json();
      if (data.success) { setSuccess(`Report sent to ${client.email}!`); setClients(prev => prev.map(c => c.id === client.id ? { ...c, last_report_sent: new Date().toISOString() } : c)); }
      else setError("Failed: " + (data.error || "Unknown error"));
    } catch (err) { setError("Error: " + err.message); }
    setSendingReport(null); setTimeout(() => { setSuccess(""); setError(""); }, 5000);
  };

  const handleOnboard = async (client, e) => {
    e.stopPropagation(); setOnboardingClient(client.id);
    try {
      const res = await fetch("/api/onboard-client", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId: client.id, userId: user.id }) });
      const data = await res.json();
      if (data.success) { setSuccess(`🎉 ${client.name} onboarded!`); if (user) loadClients(user.id); }
      else setError("Onboarding failed: " + (data.error || "Unknown error"));
    } catch (err) { setError("Error: " + err.message); }
    setOnboardingClient(null); setTimeout(() => { setSuccess(""); setError(""); }, 5000);
  };

  const copyPortalLink = (client, e) => {
    e.stopPropagation();
    if (!client.portal_token) { setError("No portal token — edit and re-save this client."); setTimeout(() => setError(""), 3000); return; }
    navigator.clipboard.writeText(`https://leadmagnetinc.com/portal/${client.portal_token}`);
    setSuccess(`Portal link copied for ${client.name}!`); setTimeout(() => setSuccess(""), 3000);
  };

  const openEdit = (client, e) => {
    e.stopPropagation();
    setForm({ name: client.name || "", email: client.email || "", company: client.company || "", phone: client.phone || "", tier: client.tier || "Standard", platforms: client.platforms || [], mrr: client.mrr || "", notes: client.notes || "", health_score: client.health_score || 75, auto_report: client.auto_report || false, report_frequency: client.report_frequency || "monthly" });
    setSelectedClient(client); setShowEditClient(true);
  };

  const deleteClient = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this client? This cannot be undone.")) return;
    await supabase.from("agency_clients").delete().eq("id", id);
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const togglePlatform = (platform) => setForm(prev => ({ ...prev, platforms: prev.platforms.includes(platform) ? prev.platforms.filter(p => p !== platform) : [...prev.platforms, platform] }));
  const getHealthColor = (score) => score >= 75 ? "#22c97a" : score >= 40 ? "#fbbf24" : "#f87171";

  const filteredClients = clients.filter(c => filterTier === "All" || c.tier === filterTier).sort((a, b) => {
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
  const mrrByTier = {}; const clientsByTier = {};
  TIERS.forEach(t => { mrrByTier[t] = 0; clientsByTier[t] = 0; });
  clients.forEach(c => { const t = c.tier || "Standard"; mrrByTier[t] += (c.mrr || 0); clientsByTier[t]++; });
  const maxClientMRR = Math.max(...clients.map(c => c.mrr || 0), 1);
  const avgMRR = clients.length > 0 ? Math.round(totalMRR / clients.length) : 0;
  const annualRevenue = totalMRR * 12;
  const atRiskClients = clients.filter(c => c.health_score < 40 || (c.leads_count === 0 && c.campaigns_count === 0));
  const atRiskMRR = atRiskClients.reduce((a, c) => a + (c.mrr || 0), 0);

  return (
    <main style={{ minHeight: "100vh", background: "#060a07", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:rgba(8,14,10,0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.05);padding:0 1.75rem;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#22c97a;text-decoration:none;display:flex;align-items:center;gap:0.4rem;}
        .logo-dot{width:8px;height:8px;background:#22c97a;border-radius:50%;box-shadow:0 0 10px rgba(34,201,122,0.5);}
        .back-btn{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-size:0.82rem;padding:0.4rem 0.9rem;border-radius:8px;cursor:pointer;text-decoration:none;font-family:'Inter',sans-serif;font-weight:500;transition:all 0.2s;}
        .back-btn:hover{border-color:rgba(34,201,122,0.25);color:#22c97a;}
        .container{max-width:1120px;margin:0 auto;padding:2rem 1.5rem 3rem;}
        .page-header{margin-bottom:1.25rem;}
        .page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.6rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.035em;margin-bottom:0.2rem;}
        .page-sub{font-size:0.84rem;color:#3d5240;font-family:'Inter',sans-serif;}
        .success-bar{background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.15);color:#22c97a;font-size:0.82rem;padding:0.75rem 1rem;border-radius:11px;margin-bottom:1.5rem;font-family:'Inter',sans-serif;font-weight:500;}
        .error-bar{background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);color:#f87171;font-size:0.82rem;padding:0.75rem 1rem;border-radius:11px;margin-bottom:1.5rem;font-family:'Inter',sans-serif;}
        .view-toggle{display:flex;gap:0.35rem;margin-bottom:1.75rem;background:rgba(12,21,16,0.6);padding:0.25rem;border-radius:10px;width:fit-content;}
        .view-btn{background:transparent;border:none;color:#3d5240;font-size:0.82rem;padding:0.5rem 1.15rem;border-radius:8px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;transition:all 0.15s;}
        .view-btn.active{background:rgba(34,201,122,0.1);color:#22c97a;}
        .stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:0.75rem;margin-bottom:2rem;}
        .stat-card{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1.15rem 1.25rem;transition:border-color 0.2s;}
        .stat-card:hover{border-color:rgba(34,201,122,0.12);}
        .stat-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.75rem;font-weight:800;color:#22c97a;letter-spacing:-0.04em;line-height:1;}
        .stat-lbl{font-size:0.68rem;color:#3d5240;margin-top:0.3rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Inter',sans-serif;font-weight:600;}
        .controls{display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem;}
        .filter-btn{background:transparent;border:1px solid rgba(255,255,255,0.05);color:#2a3d2e;font-size:0.78rem;padding:0.4rem 0.85rem;border-radius:100px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;transition:all 0.15s;}
        .filter-btn.active{background:rgba(34,201,122,0.08);border-color:rgba(34,201,122,0.2);color:#22c97a;}
        .sort-select{background:rgba(12,21,16,0.8);border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-size:0.78rem;padding:0.4rem 0.85rem;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;outline:none;}
        .add-btn{background:linear-gradient(135deg,#22c97a,#1aae6a);color:#071209;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.82rem;padding:0.55rem 1.15rem;border-radius:9px;border:none;cursor:pointer;margin-left:auto;transition:all 0.2s;box-shadow:0 2px 8px rgba(34,201,122,0.15);}
        .add-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(34,201,122,0.25);}
        .client-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:0.875rem;}
        .client-card{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:16px;padding:1.5rem;transition:all 0.2s;position:relative;cursor:pointer;}
        .client-card:hover{border-color:rgba(34,201,122,0.12);transform:translateY(-1px);}
        .mrr-badge{position:absolute;top:1.25rem;right:1.25rem;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.82rem;font-weight:800;color:#22c97a;}
        .card-top{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;}
        .client-avatar{width:40px;height:40px;background:linear-gradient(135deg,rgba(34,201,122,0.12),rgba(34,201,122,0.04));border:1px solid rgba(34,201,122,0.15);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#22c97a;font-size:0.95rem;}
        .card-top-info{flex:1;min-width:0;}
        .client-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#e2ede7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .client-company{font-size:0.75rem;color:#3d5240;font-family:'Inter',sans-serif;}
        .tier-badge{font-size:0.65rem;font-weight:700;padding:0.175rem 0.55rem;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;flex-shrink:0;}
        .client-email-row{font-size:0.72rem;color:#2a3d2e;margin-bottom:1rem;font-family:'Inter',sans-serif;}
        .health-wrap{margin-bottom:1rem;}.health-top{display:flex;justify-content:space-between;font-size:0.7rem;margin-bottom:0.3rem;font-family:'Inter',sans-serif;}.health-lbl{color:#2a3d2e;font-weight:500;}.health-bar{height:4px;background:rgba(255,255,255,0.04);border-radius:100px;overflow:hidden;}.health-fill{height:100%;border-radius:100px;transition:width 0.4s;}
        .score-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-bottom:1rem;}.score-box{background:#080c09;border:1px solid rgba(255,255,255,0.03);border-radius:9px;padding:0.55rem 0.4rem;text-align:center;}.score-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;font-weight:800;line-height:1;}.score-lbl{font-size:0.58rem;color:#2a3d2e;text-transform:uppercase;letter-spacing:0.08em;margin-top:0.2rem;font-family:'Inter',sans-serif;font-weight:600;}
        .platforms-row{display:flex;gap:0.3rem;margin-bottom:0.75rem;flex-wrap:wrap;}.platform-tag{font-size:0.66rem;padding:0.15rem 0.45rem;border-radius:5px;background:rgba(34,201,122,0.04);border:1px solid rgba(34,201,122,0.1);color:#3d5240;font-family:'Inter',sans-serif;}
        .auto-row{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;}.auto-tag{display:inline-flex;align-items:center;gap:0.25rem;font-size:0.65rem;font-weight:600;padding:0.15rem 0.5rem;border-radius:5px;font-family:'Inter',sans-serif;}.auto-tag.report{background:rgba(99,179,237,0.06);border:1px solid rgba(99,179,237,0.15);color:#63b3ed;}.auto-tag.routing{background:rgba(147,51,234,0.06);border:1px solid rgba(147,51,234,0.15);color:#a78bfa;}
        .last-report{font-size:0.65rem;color:#1e2e22;font-family:'Inter',sans-serif;margin-bottom:0.5rem;}
        .card-actions{display:flex;gap:0.35rem;margin-top:0.875rem;padding-top:0.875rem;border-top:1px solid rgba(255,255,255,0.03);}
        .act-btn{flex:1;font-size:0.7rem;padding:0.425rem;border-radius:8px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;text-align:center;transition:all 0.15s;border:none;}
        .act-onboard{background:rgba(147,51,234,0.08);border:1px solid rgba(147,51,234,0.15);color:#a78bfa;}.act-onboard:hover{background:rgba(147,51,234,0.15);}.act-onboard:disabled{opacity:0.4;cursor:not-allowed;}
        .act-portal{background:rgba(99,179,237,0.08);border:1px solid rgba(99,179,237,0.15);color:#63b3ed;}.act-portal:hover{background:rgba(99,179,237,0.15);}
        .act-report{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.15);color:#22c97a;}.act-report:hover{background:rgba(34,201,122,0.15);}.act-report:disabled{opacity:0.4;cursor:not-allowed;}
        .act-edit{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;}.act-edit:hover{border-color:rgba(34,201,122,0.2);color:#22c97a;}
        .act-del{background:transparent;border:1px solid rgba(239,68,68,0.1);color:#f87171;flex:0.4;}.act-del:hover{background:rgba(239,68,68,0.05);}
        .expanded-section{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.04);}.expanded-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.82rem;font-weight:700;color:#8fa696;margin-bottom:0.75rem;}.notes-box{background:#080c09;border:1px solid rgba(255,255,255,0.03);border-radius:8px;padding:0.65rem 0.75rem;font-size:0.78rem;color:#3d5240;line-height:1.5;font-family:'Inter',sans-serif;}
        .empty-state{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:16px;padding:3.5rem 2rem;text-align:center;}.empty-icon{font-size:2.5rem;margin-bottom:1rem;display:block;}.empty-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:700;color:#c4d4c8;margin-bottom:0.4rem;}.empty-sub{font-size:0.84rem;color:#3d5240;margin-bottom:1.75rem;line-height:1.55;font-family:'Inter',sans-serif;}
        .rev-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:2rem;}.rev-card{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1.25rem;}.rev-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.85rem;font-weight:800;letter-spacing:-0.04em;line-height:1;}.rev-lbl{font-size:0.68rem;color:#3d5240;margin-top:0.3rem;text-transform:uppercase;letter-spacing:0.08em;font-family:'Inter',sans-serif;font-weight:600;}.rev-sub{font-size:0.7rem;color:#1e2e22;margin-top:0.15rem;font-family:'Inter',sans-serif;}
        .rev-section{background:linear-gradient(145deg,#0c1510,#0a120d);border:1px solid rgba(255,255,255,0.04);border-radius:14px;padding:1.5rem;margin-bottom:1rem;}.rev-section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#c4d4c8;margin-bottom:1.25rem;}
        .rev-client-row{display:flex;align-items:center;gap:0.75rem;padding:0.7rem 0;border-bottom:1px solid rgba(255,255,255,0.03);}.rev-client-row:last-child{border-bottom:none;}.rev-client-avatar{width:32px;height:32px;background:linear-gradient(135deg,rgba(34,201,122,0.1),rgba(34,201,122,0.03));border:1px solid rgba(34,201,122,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#22c97a;font-size:0.8rem;flex-shrink:0;}.rev-client-info{flex:1;min-width:0;}.rev-client-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.84rem;font-weight:700;color:#e2ede7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.rev-client-tier{font-size:0.68rem;color:#3d5240;font-family:'Inter',sans-serif;}.rev-client-bar-wrap{flex:2;height:6px;background:rgba(255,255,255,0.03);border-radius:100px;overflow:hidden;}.rev-client-bar{height:100%;border-radius:100px;background:linear-gradient(90deg,#22c97a,#0d9456);}.rev-client-mrr{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.85rem;font-weight:800;color:#22c97a;min-width:70px;text-align:right;}
        .tier-row{display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0;border-bottom:1px solid rgba(255,255,255,0.03);}.tier-row:last-child{border-bottom:none;}.tier-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}.tier-name{font-size:0.84rem;color:#c4d4c8;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;min-width:80px;}.tier-clients{font-size:0.75rem;color:#3d5240;font-family:'Inter',sans-serif;min-width:60px;}.tier-bar-wrap{flex:1;height:6px;background:rgba(255,255,255,0.03);border-radius:100px;overflow:hidden;}.tier-bar{height:100%;border-radius:100px;}.tier-mrr{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.85rem;font-weight:800;color:#22c97a;min-width:70px;text-align:right;}
        .risk-card{background:#080c09;border:1px solid rgba(239,68,68,0.1);border-radius:10px;padding:0.875rem 1rem;margin-bottom:0.5rem;display:flex;align-items:center;justify-content:space-between;}.risk-info{display:flex;align-items:center;gap:0.6rem;}.risk-avatar{width:30px;height:30px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#f87171;font-size:0.75rem;}.risk-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.84rem;font-weight:700;color:#e2ede7;}.risk-reason{font-size:0.7rem;color:#f87171;font-family:'Inter',sans-serif;}.risk-mrr{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.82rem;font-weight:800;color:#f87171;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem;backdrop-filter:blur(8px);}.modal{background:#0c1510;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:2rem;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 48px rgba(0,0,0,0.4);}.modal-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.25rem;font-weight:800;color:#f0f7f2;margin-bottom:0.25rem;}.modal-sub{font-size:0.82rem;color:#3d5240;margin-bottom:1.75rem;font-family:'Inter',sans-serif;}
        .form-label{display:block;font-size:0.72rem;font-weight:700;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.03em;text-transform:uppercase;font-family:'Inter',sans-serif;}.form-input{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;transition:all 0.2s;}.form-input:focus{border-color:rgba(34,201,122,0.3);box-shadow:0 0 0 3px rgba(34,201,122,0.05);}.form-select{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;}.form-textarea{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;resize:vertical;min-height:80px;}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;}.divider{border:none;border-top:1px solid rgba(255,255,255,0.04);margin:1rem 0;}
        .platforms-select{display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;}.platform-toggle{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-size:0.78rem;padding:0.4rem 0.85rem;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}.platform-toggle.selected{background:rgba(34,201,122,0.08);border-color:rgba(34,201,122,0.25);color:#22c97a;font-weight:600;}
        .health-input{width:100%;accent-color:#22c97a;margin-bottom:1rem;}
        .toggle-row{display:flex;align-items:center;justify-content:space-between;background:#080c09;border:1px solid rgba(255,255,255,0.04);border-radius:10px;padding:0.75rem 1rem;margin-bottom:1rem;}.toggle-label{font-size:0.82rem;color:#c4d4c8;font-family:'Inter',sans-serif;}.toggle-sub{font-size:0.7rem;color:#2a3d2e;margin-top:2px;font-family:'Inter',sans-serif;}.toggle-switch{width:40px;height:22px;background:rgba(255,255,255,0.06);border-radius:100px;position:relative;cursor:pointer;transition:background 0.2s;border:none;}.toggle-switch.on{background:#22c97a;}.toggle-knob{width:16px;height:16px;background:#fff;border-radius:50%;position:absolute;top:3px;left:3px;transition:left 0.2s;}.toggle-switch.on .toggle-knob{left:21px;}
        .freq-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1rem;}.freq-btn{background:#080c09;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-size:0.78rem;padding:0.6rem;border-radius:9px;cursor:pointer;font-family:'Inter',sans-serif;text-align:center;transition:all 0.15s;}.freq-btn.selected{background:rgba(34,201,122,0.08);border-color:rgba(34,201,122,0.25);color:#22c97a;font-weight:600;}
        .modal-btns{display:flex;gap:0.75rem;margin-top:0.5rem;}.modal-cancel{flex:1;background:transparent;border:1px solid rgba(255,255,255,0.06);color:#4d6b54;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:0.875rem;padding:0.75rem;border-radius:10px;cursor:pointer;}.modal-submit{flex:2;background:linear-gradient(135deg,#22c97a,#1aae6a);color:#071209;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.875rem;padding:0.75rem;border-radius:10px;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(34,201,122,0.15);}.modal-submit:disabled{opacity:0.4;cursor:not-allowed;}
        @media(max-width:900px){.stats-row,.rev-stats{grid-template-columns:repeat(2,1fr);}.client-grid{grid-template-columns:1fr;}}
        @media(max-width:600px){.container{padding:1.5rem 1rem;}.form-row{grid-template-columns:1fr;}}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo"><span className="logo-dot"></span> LeadMagnet</a>
        <a href="/dashboard" className="back-btn">← Dashboard</a>
      </nav>

      {/* ACCESS CHECK */}
      {checkingAccess ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.2rem", color: "#22c97a", fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading...</div>
          </div>
        </div>
      ) : !hasAccess ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#f0f7f2", marginBottom: "0.5rem" }}>Agency Plan Required</div>
            <div style={{ fontSize: "0.88rem", color: "#3d5240", lineHeight: 1.6, marginBottom: "2rem", fontFamily: "Inter,sans-serif" }}>
              The Client Manager and all automation features are exclusive to Agency subscribers. Upgrade to unlock AI lead scoring, automated reports, client portals, health alerts, and more.
            </div>
            <button onClick={() => window.location.href = "/pricing"} style={{ background: "linear-gradient(135deg,#22c97a,#1aae6a)", color: "#071209", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: "0.9rem", padding: "0.7rem 1.5rem", borderRadius: "10px", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(34,201,122,0.15)" }}>
              View Plans & Upgrade →
            </button>
          </div>
        </div>
      ) : (
        /* MAIN CONTENT — AGENCY ACCESS GRANTED */
        <div className="container">
          {success && <div className="success-bar">✓ {success}</div>}
          {error && <div className="error-bar">⚠ {error}</div>}

          <div className="page-header">
            <h1 className="page-title">Client Manager</h1>
            <p className="page-sub">Your automation command center — manage clients, track leads, and monitor revenue.</p>
          </div>

          <div className="view-toggle">
            <button className={`view-btn ${activeView === "clients" ? "active" : ""}`} onClick={() => setActiveView("clients")}>👥 Clients</button>
            <button className={`view-btn ${activeView === "revenue" ? "active" : ""}`} onClick={() => setActiveView("revenue")}>💰 Revenue</button>
          </div>

          {activeView === "clients" && (
            <>
              <div className="stats-row">
                <div className="stat-card"><div className="stat-val">{clients.length}</div><div className="stat-lbl">Total Clients</div></div>
                <div className="stat-card"><div className="stat-val">{activeClients}</div><div className="stat-lbl">Active</div></div>
                <div className="stat-card"><div className="stat-val" style={{ color: "#f87171" }}>{totalHot}</div><div className="stat-lbl">Hot Leads</div></div>
                <div className="stat-card"><div className="stat-val">€{totalMRR.toLocaleString()}</div><div className="stat-lbl">Total MRR</div></div>
                <div className="stat-card"><div className="stat-val">{totalLeads}</div><div className="stat-lbl">Total Leads</div></div>
              </div>
              <div className="controls">
                {["All", ...TIERS].map(t => (<button key={t} className={`filter-btn ${filterTier === t ? "active" : ""}`} onClick={() => setFilterTier(t)}>{t}</button>))}
                <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="created_at">Sort: Recent</option><option value="mrr">Sort: MRR</option><option value="leads">Sort: Leads</option><option value="hot">Sort: Hot Leads</option><option value="health">Sort: Health</option>
                </select>
                <button className="add-btn" onClick={() => setShowAddClient(true)}>+ Add Client</button>
              </div>
              {filteredClients.length === 0 ? (
                <div className="empty-state"><span className="empty-icon">🏢</span><div className="empty-title">No clients {filterTier !== "All" ? `in ${filterTier} tier` : "yet"}</div><div className="empty-sub">Add your first client to start managing their campaigns and automation.</div><button className="add-btn" onClick={() => setShowAddClient(true)}>+ Add Client</button></div>
              ) : (
                <div className="client-grid">
                  {filteredClients.map(c => {
                    const tier = c.tier || "Standard"; const tierStyle = TIER_COLORS[tier] || TIER_COLORS.Standard; const health = c.health_score || 75; const isExpanded = expandedClient === c.id;
                    return (
                      <div className="client-card" key={c.id} onClick={() => setExpandedClient(isExpanded ? null : c.id)}>
                        {c.mrr > 0 && <div className="mrr-badge">€{c.mrr}/mo</div>}
                        <div className="card-top">
                          <div className="client-avatar">{c.name?.charAt(0).toUpperCase()}</div>
                          <div className="card-top-info"><div className="client-name">{c.name}</div>{c.company && <div className="client-company">{c.company}</div>}</div>
                          <div className="tier-badge" style={{ background: tierStyle.bg, border: `1px solid ${tierStyle.border}`, color: tierStyle.color }}>{tier === "VIP" ? "⭐ VIP" : tier}</div>
                        </div>
                        <div className="client-email-row">✉️ {c.email}</div>
                        <div className="health-wrap">
                          <div className="health-top"><span className="health-lbl">Client Health</span><span style={{ color: getHealthColor(health), fontWeight: 700 }}>{health}/100</span></div>
                          <div className="health-bar"><div className="health-fill" style={{ width: `${health}%`, background: getHealthColor(health) }} /></div>
                        </div>
                        <div className="score-row">
                          <div className="score-box"><div className="score-val" style={{ color: "#e2ede7" }}>{c.leads_count || 0}</div><div className="score-lbl">Leads</div></div>
                          <div className="score-box"><div className="score-val" style={{ color: "#f87171" }}>{c.hot_leads || 0}</div><div className="score-lbl">🔥 Hot</div></div>
                          <div className="score-box"><div className="score-val" style={{ color: "#fbbf24" }}>{c.warm_leads || 0}</div><div className="score-lbl">🟡 Warm</div></div>
                          <div className="score-box"><div className="score-val" style={{ color: "#60a5fa" }}>{c.cold_leads || 0}</div><div className="score-lbl">🔵 Cold</div></div>
                        </div>
                        {c.platforms?.length > 0 && (<div className="platforms-row">{c.platforms.map(p => <span key={p} className="platform-tag">{p}</span>)}<span className="platform-tag" style={{ color: "#2a3d2e" }}>{c.campaigns_count || 0} campaigns</span></div>)}
                        <div className="auto-row">
                          {c.auto_report && <span className="auto-tag report">📊 Auto-report: {c.report_frequency || "monthly"}</span>}
                          {c.campaigns_count > 0 && <span className="auto-tag routing">🔀 Lead routing active</span>}
                        </div>
                        {c.last_report_sent && <div className="last-report">Last report: {new Date(c.last_report_sent).toLocaleDateString()}</div>}
                        <div className="card-actions">
                          <button className="act-btn act-onboard" onClick={(e) => handleOnboard(c, e)} disabled={onboardingClient === c.id}>{onboardingClient === c.id ? "Setting up..." : "🚀 Onboard"}</button>
                          <button className="act-btn act-portal" onClick={(e) => copyPortalLink(c, e)}>🔗 Portal</button>
                          <button className="act-btn act-report" onClick={(e) => handleSendReport(c, e)} disabled={sendingReport === c.id}>{sendingReport === c.id ? "Sending..." : "📊 Report"}</button>
                          <button className="act-btn act-edit" onClick={(e) => openEdit(c, e)}>Edit</button>
                          <button className="act-btn act-del" onClick={(e) => deleteClient(c.id, e)}>✕</button>
                        </div>
                        {isExpanded && c.notes && (<div className="expanded-section"><div className="expanded-title">📝 Notes</div><div className="notes-box">{c.notes}</div></div>)}
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
                <div className="rev-card"><div className="rev-val" style={{ color: "#22c97a" }}>€{totalMRR.toLocaleString()}</div><div className="rev-lbl">Monthly Revenue</div><div className="rev-sub">across {clients.length} clients</div></div>
                <div className="rev-card"><div className="rev-val" style={{ color: "#22c97a" }}>€{annualRevenue.toLocaleString()}</div><div className="rev-lbl">Annual Forecast</div><div className="rev-sub">projected at current MRR</div></div>
                <div className="rev-card"><div className="rev-val" style={{ color: "#22c97a" }}>€{avgMRR}</div><div className="rev-lbl">Avg per Client</div><div className="rev-sub">{clients.length} total clients</div></div>
                <div className="rev-card"><div className="rev-val" style={{ color: atRiskMRR > 0 ? "#f87171" : "#22c97a" }}>€{atRiskMRR.toLocaleString()}</div><div className="rev-lbl">At-Risk MRR</div><div className="rev-sub">{atRiskClients.length} client{atRiskClients.length !== 1 ? "s" : ""} flagged</div></div>
              </div>
              <div className="rev-section">
                <div className="rev-section-title">Revenue by Client</div>
                {clients.length === 0 ? <div style={{ color: "#2a3d2e", fontSize: "0.82rem" }}>No clients yet</div> :
                  [...clients].sort((a, b) => (b.mrr || 0) - (a.mrr || 0)).map(c => (
                    <div className="rev-client-row" key={c.id}><div className="rev-client-avatar">{c.name?.charAt(0).toUpperCase()}</div><div className="rev-client-info"><div className="rev-client-name">{c.name}</div><div className="rev-client-tier">{c.tier || "Standard"} · {c.leads_count || 0} leads</div></div><div className="rev-client-bar-wrap"><div className="rev-client-bar" style={{ width: `${((c.mrr || 0) / maxClientMRR) * 100}%` }} /></div><div className="rev-client-mrr">€{(c.mrr || 0).toLocaleString()}</div></div>
                  ))}
              </div>
              <div className="rev-section">
                <div className="rev-section-title">Revenue by Tier</div>
                {TIERS.map(t => { const tierStyle = TIER_COLORS[t]; return (<div className="tier-row" key={t}><div className="tier-dot" style={{ background: tierStyle.color }} /><div className="tier-name">{t}</div><div className="tier-clients">{clientsByTier[t]} client{clientsByTier[t] !== 1 ? "s" : ""}</div><div className="tier-bar-wrap"><div className="tier-bar" style={{ width: totalMRR > 0 ? `${(mrrByTier[t] / totalMRR) * 100}%` : "0%", background: tierStyle.color }} /></div><div className="tier-mrr">€{mrrByTier[t].toLocaleString()}</div></div>); })}
              </div>
              <div className="rev-section">
                <div className="rev-section-title">⚠️ At-Risk Clients</div>
                {atRiskClients.length === 0 ? (<div style={{ color: "#22c97a", fontSize: "0.84rem", fontFamily: "Inter,sans-serif" }}>All clients are healthy — no churn risk detected.</div>) :
                  atRiskClients.map(c => (<div className="risk-card" key={c.id}><div className="risk-info"><div className="risk-avatar">{c.name?.charAt(0).toUpperCase()}</div><div><div className="risk-name">{c.name}</div><div className="risk-reason">{c.health_score < 40 ? `Health: ${c.health_score}/100` : "No leads or campaigns"}</div></div></div><div className="risk-mrr">€{(c.mrr || 0).toLocaleString()}/mo</div></div>))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(showAddClient || showEditClient) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">{showEditClient ? "Edit Client" : "Add New Client"}</div>
            <div className="modal-sub">Fill in client details, set their tier and configure automation.</div>
            <form onSubmit={handleSubmit}>
              <div className="form-row"><div><label className="form-label">Client Name</label><input className="form-input" placeholder="e.g. John Smith" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div><div><label className="form-label">Company</label><input className="form-input" placeholder="e.g. Acme Corp" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></div></div>
              <div className="form-row"><div><label className="form-label">Email</label><input className="form-input" type="email" placeholder="client@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></div><div><label className="form-label">Phone</label><input className="form-input" placeholder="+31 6 12345678" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div></div>
              <hr className="divider" />
              <div className="form-row"><div><label className="form-label">Client Tier</label><select className="form-select" value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}>{TIERS.map(t => <option key={t} value={t}>{t}</option>)}</select></div><div><label className="form-label">Monthly Revenue (€)</label><input className="form-input" type="number" placeholder="0" value={form.mrr} onChange={e => setForm(p => ({ ...p, mrr: e.target.value }))} /></div></div>
              <label className="form-label">Platforms</label>
              <div className="platforms-select">{PLATFORMS.map(p => (<button key={p} type="button" className={`platform-toggle ${form.platforms.includes(p) ? "selected" : ""}`} onClick={() => togglePlatform(p)}>{p}</button>))}</div>
              <label className="form-label">Health Score: {form.health_score}/100</label>
              <input type="range" min="0" max="100" value={form.health_score} onChange={e => setForm(p => ({ ...p, health_score: parseInt(e.target.value) }))} className="health-input" />
              <hr className="divider" />
              <div className="toggle-row"><div><div className="toggle-label">Auto-send performance reports</div><div className="toggle-sub">Automatically email reports to this client</div></div><button type="button" className={`toggle-switch ${form.auto_report ? "on" : ""}`} onClick={() => setForm(p => ({ ...p, auto_report: !p.auto_report }))}><div className="toggle-knob" /></button></div>
              {form.auto_report && (<><label className="form-label">Report Frequency</label><div className="freq-grid">{REPORT_FREQUENCIES.map(f => (<button key={f.value} type="button" className={`freq-btn ${form.report_frequency === f.value ? "selected" : ""}`} onClick={() => setForm(p => ({ ...p, report_frequency: f.value }))}>{f.label}</button>))}</div></>)}
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" placeholder="Notes about this client..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              <div className="modal-btns"><button type="button" className="modal-cancel" onClick={() => { setShowAddClient(false); setShowEditClient(false); resetForm(); }}>Cancel</button><button type="submit" className="modal-submit" disabled={loading}>{loading ? "Saving..." : showEditClient ? "Save Changes →" : "Add Client →"}</button></div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
