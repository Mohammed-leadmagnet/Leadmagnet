"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TIERS = ["VIP", "Standard", "Trial", "Inactive"];
const TIER_COLORS = {
  VIP: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", color: "#fbbf24" },
  Standard: { bg: "rgba(34,201,122,0.1)", border: "rgba(34,201,122,0.3)", color: "#22c97a" },
  Trial: { bg: "rgba(99,179,237,0.1)", border: "rgba(99,179,237,0.3)", color: "#63b3ed" },
  Inactive: { bg: "rgba(160,160,160,0.1)", border: "rgba(160,160,160,0.3)", color: "#a0a0a0" },
};
const PLATFORMS = ["LinkedIn", "Instagram", "Gmail"];

export default function Agency() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filterTier, setFilterTier] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "",
    tier: "Standard", platforms: [], mrr: "",
    notes: "", health_score: 75,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      loadClients(data.user.id);
    });
  }, []);

  const loadClients = async (userId) => {
    const { data: clientsData } = await supabase
      .from("agency_clients")
      .select("*")
      .eq("agency_user_id", userId)
      .order("created_at", { ascending: false });

    if (!clientsData) return;

    const enriched = await Promise.all(clientsData.map(async (c) => {
      const { count: campaignsCount } = await supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("client_id", c.id);

      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("client_id", c.id);

      return {
        ...c,
        campaigns_count: campaignsCount || 0,
        leads_count: leadsCount || 0,
      };
    }));

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
        setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...c, ...form, mrr: parseFloat(form.mrr) || 0 } : c));
        setSuccess("Client updated!");
      } else {
        const { data: client, error: dbError } = await supabase
          .from("agency_clients")
          .insert({
            agency_user_id: user.id,
            ...form,
            mrr: parseFloat(form.mrr) || 0,
            status: "Active",
            leads_count: 0,
            dms_sent: 0,
            campaigns_count: 0,
          })
          .select().single();
        if (dbError) throw dbError;
        if (client) setClients(prev => [{ ...client, campaigns_count: 0, leads_count: 0 }, ...prev]);
        setSuccess("Client added!");
      }
      setShowAddClient(false);
      setShowEditClient(false);
      setForm({ name: "", email: "", company: "", phone: "", tier: "Standard", platforms: [], mrr: "", notes: "", health_score: 75 });
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
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
    });
    setSelectedClient(client);
    setShowEditClient(true);
  };

  const deleteClient = async (id, e) => {
    e.stopPropagation();
    await supabase.from("agency_clients").delete().eq("id", id);
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const togglePlatform = (platform) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const getHealthColor = (score) => {
    if (score >= 75) return "#22c97a";
    if (score >= 40) return "#fbbf24";
    return "#f87171";
  };

  const filteredClients = clients
    .filter(c => filterTier === "All" || c.tier === filterTier)
    .sort((a, b) => {
      if (sortBy === "mrr") return (b.mrr || 0) - (a.mrr || 0);
      if (sortBy === "leads") return (b.leads_count || 0) - (a.leads_count || 0);
      if (sortBy === "health") return (b.health_score || 0) - (a.health_score || 0);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const totalMRR = clients.reduce((a, c) => a + (c.mrr || 0), 0);
  const totalLeads = clients.reduce((a, c) => a + (c.leads_count || 0), 0);
  const activeClients = clients.filter(c => c.status === "Active").length;
  const vipClients = clients.filter(c => c.tier === "VIP").length;

  return (
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;}
        .back-btn{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.835rem;padding:0.4rem 0.875rem;border-radius:8px;cursor:pointer;text-decoration:none;transition:all 0.15s;}
        .back-btn:hover{border-color:rgba(255,255,255,0.15);color:#94a3b8;}
        .container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem;}
        .page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.03em;margin-bottom:0.25rem;}
        .page-sub{font-size:0.855rem;color:#4d6b54;margin-bottom:2rem;}
        .stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem;}
        .stat-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.25rem;}
        .stat-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.75rem;font-weight:800;color:#22c97a;letter-spacing:-0.03em;}
        .stat-lbl{font-size:0.72rem;color:#3d5240;margin-top:0.25rem;text-transform:uppercase;letter-spacing:0.08em;}
        .controls{display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem;}
        .filter-btn{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.78rem;padding:0.4rem 0.875rem;border-radius:100px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .filter-btn.active{background:rgba(34,201,122,0.1);border-color:rgba(34,201,122,0.3);color:#22c97a;}
        .sort-select{background:#0f1a11;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.78rem;padding:0.4rem 0.875rem;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;outline:none;}
        .add-btn{background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.835rem;padding:0.55rem 1.1rem;border-radius:9px;border:none;cursor:pointer;margin-left:auto;transition:all 0.15s;}
        .add-btn:hover{background:#1db36c;transform:translateY(-1px);}
        .client-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem;}
        .client-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;transition:all 0.15s;position:relative;}
        .client-card:hover{border-color:rgba(34,201,122,0.2);transform:translateY(-1px);}
        .card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;}
        .client-avatar{width:42px;height:42px;background:rgba(34,201,122,0.1);border:1px solid rgba(34,201,122,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#22c97a;font-size:1rem;}
        .tier-badge{font-size:0.68rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:100px;letter-spacing:0.04em;}
        .client-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.975rem;font-weight:700;color:#e2ede7;margin-bottom:0.15rem;}
        .client-company{font-size:0.78rem;color:#4d6b54;margin-bottom:0.125rem;}
        .client-email{font-size:0.75rem;color:#2d4a33;margin-bottom:1rem;}
        .health-bar-wrap{margin-bottom:1rem;}
        .health-label{display:flex;justify-content:space-between;font-size:0.72rem;color:#3d5240;margin-bottom:0.3rem;}
        .health-bar{height:4px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;}
        .health-fill{height:100%;border-radius:100px;transition:width 0.3s;}
        .client-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1rem;}
        .metric{background:#080c09;border:1px solid rgba(255,255,255,0.05);border-radius:8px;padding:0.5rem;text-align:center;}
        .metric-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.975rem;font-weight:700;color:#c4d4c8;}
        .metric-lbl{font-size:0.62rem;color:#2d4a33;text-transform:uppercase;letter-spacing:0.06em;margin-top:0.15rem;}
        .platforms-row{display:flex;gap:0.375rem;margin-bottom:1rem;flex-wrap:wrap;}
        .platform-tag{font-size:0.68rem;padding:0.2rem 0.5rem;border-radius:5px;background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.12);color:#4d6b54;}
        .card-actions{display:flex;gap:0.5rem;margin-top:1rem;}
        .edit-btn{flex:1;background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.775rem;padding:0.4rem;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;text-align:center;}
        .edit-btn:hover{border-color:rgba(34,201,122,0.3);color:#22c97a;}
        .del-btn{background:transparent;border:1px solid rgba(239,68,68,0.15);color:#f87171;font-size:0.775rem;padding:0.4rem 0.65rem;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .del-btn:hover{background:rgba(239,68,68,0.08);}
        .mrr-badge{position:absolute;top:1rem;right:1rem;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.78rem;font-weight:700;color:#22c97a;}
        .empty-state{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:3rem 2rem;text-align:center;}
        .empty-icon{font-size:2.25rem;margin-bottom:0.875rem;display:block;}
        .empty-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;font-weight:700;color:#c4d4c8;margin-bottom:0.4rem;}
        .empty-sub{font-size:0.835rem;color:#3d5240;margin-bottom:1.5rem;line-height:1.5;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem;backdrop-filter:blur(4px);}
        .modal{background:#0f1a11;border:1px solid rgba(255,255,255,0.09);border-radius:18px;padding:1.875rem;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;}
        .modal-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.2rem;font-weight:700;color:#f0f7f2;margin-bottom:0.3rem;}
        .modal-sub{font-size:0.835rem;color:#3d5240;margin-bottom:1.5rem;}
        .form-label{display:block;font-size:0.775rem;font-weight:600;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.02em;}
        .form-input{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;transition:border-color 0.15s;}
        .form-input:focus{border-color:rgba(34,201,122,0.35);}
        .form-select{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;}
        .form-textarea{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;resize:vertical;min-height:80px;}
        .platforms-select{display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;}
        .platform-toggle{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.78rem;padding:0.4rem 0.875rem;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .platform-toggle.selected{background:rgba(34,201,122,0.1);border-color:rgba(34,201,122,0.3);color:#22c97a;}
        .modal-btns{display:flex;gap:0.75rem;margin-top:0.5rem;}
        .modal-cancel{flex:1;background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-family:'Inter',sans-serif;font-weight:500;font-size:0.875rem;padding:0.75rem;border-radius:10px;cursor:pointer;}
        .modal-submit{flex:2;background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.875rem;padding:0.75rem;border-radius:10px;border:none;cursor:pointer;}
        .modal-submit:disabled{opacity:0.5;cursor:not-allowed;}
        .success-bar{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.2);color:#22c97a;font-size:0.835rem;padding:0.75rem 1rem;border-radius:10px;margin-bottom:1.5rem;}
        .error-bar{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171;font-size:0.835rem;padding:0.75rem 1rem;border-radius:10px;margin-bottom:1.5rem;}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;}
        .divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:1rem 0;}
        .health-input{width:100%;accent-color:#22c97a;margin-bottom:1rem;}
        .notes-card{background:#080c09;border:1px solid rgba(255,255,255,0.05);border-radius:8px;padding:0.75rem;margin-top:0.75rem;}
        .notes-text{font-size:0.78rem;color:#3d5240;line-height:1.6;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <a href="/dashboard" className="back-btn">← Dashboard</a>
      </nav>

      <div className="container">
        {success && <div className="success-bar">✓ {success}</div>}
        {error && <div className="error-bar">⚠ {error}</div>}

        <h1 className="page-title">🏢 Agency Client Manager</h1>
        <p className="page-sub">Segment, track and manage all your clients from one place.</p>

        <div className="stats-row">
          <div className="stat-card"><div className="stat-val">{clients.length}</div><div className="stat-lbl">Total Clients</div></div>
          <div className="stat-card"><div className="stat-val">{activeClients}</div><div className="stat-lbl">Active Clients</div></div>
          <div className="stat-card"><div className="stat-val">{vipClients}</div><div className="stat-lbl">VIP Clients</div></div>
          <div className="stat-card"><div className="stat-val">€{totalMRR.toLocaleString()}</div><div className="stat-lbl">Total MRR</div></div>
          <div className="stat-card"><div className="stat-val">{totalLeads}</div><div className="stat-lbl">Total Leads</div></div>
        </div>

        <div className="controls">
          {["All", ...TIERS].map(t => (
            <button key={t} className={`filter-btn ${filterTier === t ? "active" : ""}`} onClick={() => setFilterTier(t)}>{t}</button>
          ))}
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="created_at">Sort: Recent</option>
            <option value="mrr">Sort: MRR</option>
            <option value="leads">Sort: Leads</option>
            <option value="health">Sort: Health</option>
          </select>
          <button className="add-btn" onClick={() => setShowAddClient(true)}>+ Add Client</button>
        </div>

        {filteredClients.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🏢</span>
            <div className="empty-title">No clients {filterTier !== "All" ? `in ${filterTier} tier` : "yet"}</div>
            <div className="empty-sub">Add your first client to start managing their automation from this dashboard.</div>
            <button className="add-btn" onClick={() => setShowAddClient(true)}>+ Add your first client</button>
          </div>
        ) : (
          <div className="client-grid">
            {filteredClients.map(c => {
              const tier = c.tier || "Standard";
              const tierStyle = TIER_COLORS[tier] || TIER_COLORS.Standard;
              const health = c.health_score || 75;
              return (
                <div className="client-card" key={c.id}>
                  {c.mrr > 0 && <div className="mrr-badge">€{c.mrr}/mo</div>}
                  <div className="card-top">
                    <div className="client-avatar">{c.name?.charAt(0).toUpperCase()}</div>
                    <div className="tier-badge" style={{ background: tierStyle.bg, border: `1px solid ${tierStyle.border}`, color: tierStyle.color }}>
                      {tier === "VIP" ? "⭐ VIP" : tier}
                    </div>
                  </div>
                  <div className="client-name">{c.name}</div>
                  {c.company && <div className="client-company">🏢 {c.company}</div>}
                  <div className="client-email">✉️ {c.email}</div>

                  <div className="health-bar-wrap">
                    <div className="health-label">
                      <span>Client Health</span>
                      <span style={{ color: getHealthColor(health) }}>{health}/100</span>
                    </div>
                    <div className="health-bar">
                      <div className="health-fill" style={{ width: `${health}%`, background: getHealthColor(health) }} />
                    </div>
                  </div>

                  <div className="client-metrics">
                    <div className="metric"><div className="metric-val">{c.leads_count || 0}</div><div className="metric-lbl">Leads</div></div>
                    <div className="metric"><div className="metric-val">{c.dms_sent || 0}</div><div className="metric-lbl">DMs</div></div>
                    <div className="metric"><div className="metric-val">{c.campaigns_count || 0}</div><div className="metric-lbl">Campaigns</div></div>
                  </div>

                  {c.platforms?.length > 0 && (
                    <div className="platforms-row">
                      {c.platforms.map(p => <span key={p} className="platform-tag">{p}</span>)}
                    </div>
                  )}

                  {c.notes && (
                    <div className="notes-card">
                      <div className="notes-text">📝 {c.notes}</div>
                    </div>
                  )}

                  <div className="card-actions">
                    <button className="edit-btn" onClick={(e) => openEdit(c, e)}>✏️ Edit</button>
                    <button className="del-btn" onClick={(e) => deleteClient(c.id, e)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {(showAddClient || showEditClient) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">{showEditClient ? "Edit Client" : "Add New Client"}</div>
            <div className="modal-sub">Fill in the client details, set their tier and platforms.</div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div>
                  <label className="form-label">CLIENT NAME</label>
                  <input className="form-input" placeholder="e.g. John Smith" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">COMPANY</label>
                  <input className="form-input" placeholder="e.g. Acme Corp" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="form-label">EMAIL</label>
                  <input className="form-input" type="email" placeholder="client@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">PHONE</label>
                  <input className="form-input" placeholder="+31 6 12345678" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>

              <hr className="divider" />

              <div className="form-row">
                <div>
                  <label className="form-label">CLIENT TIER</label>
                  <select className="form-select" value={form.tier} onChange={e => setForm(p => ({ ...p, tier: e.target.value }))}>
                    {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">MONTHLY REVENUE (€)</label>
                  <input className="form-input" type="number" placeholder="0" value={form.mrr} onChange={e => setForm(p => ({ ...p, mrr: e.target.value }))} />
                </div>
              </div>

              <label className="form-label">PLATFORMS</label>
              <div className="platforms-select">
                {PLATFORMS.map(p => (
                  <button key={p} type="button" className={`platform-toggle ${form.platforms.includes(p) ? "selected" : ""}`} onClick={() => togglePlatform(p)}>{p}</button>
                ))}
              </div>

              <label className="form-label">HEALTH SCORE: {form.health_score}/100</label>
              <input type="range" min="0" max="100" value={form.health_score} onChange={e => setForm(p => ({ ...p, health_score: parseInt(e.target.value) }))} className="health-input" />

              <label className="form-label">NOTES</label>
              <textarea className="form-textarea" placeholder="Any notes about this client..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />

              <div className="modal-btns">
                <button type="button" className="modal-cancel" onClick={() => { setShowAddClient(false); setShowEditClient(false); }}>Cancel</button>
                <button type="submit" className="modal-submit" disabled={loading}>{loading ? "Saving..." : showEditClient ? "Save Changes →" : "Add Client →"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}