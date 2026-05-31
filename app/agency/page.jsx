"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Agency() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientLinkedIn, setClientLinkedIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      loadClients(data.user.id);
    });
  }, []);

  const loadClients = async (userId) => {
    const { data } = await supabase
      .from("agency_clients")
      .select("*")
      .eq("agency_user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setClients(data);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data: client, error: dbError } = await supabase
        .from("agency_clients")
        .insert({
          agency_user_id: user.id,
          name: clientName,
          email: clientEmail,
          linkedin_cookie: clientLinkedIn,
          status: "Active",
        })
        .select().single();
      if (dbError) throw dbError;
      if (client) setClients(prev => [client, ...prev]);
      setClientName(""); setClientEmail(""); setClientLinkedIn("");
      setShowAddClient(false);
      setSuccess("✅ Client added successfully!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  const toggleClient = async (client) => {
    const newStatus = client.status === "Active" ? "Paused" : "Active";
    await supabase.from("agency_clients").update({ status: newStatus }).eq("id", client.id);
    setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: newStatus } : c));
  };

  const deleteClient = async (id) => {
    await supabase.from("agency_clients").delete().eq("id", id);
    setClients(prev => prev.filter(c => c.id !== id));
    if (selectedClient?.id === id) setSelectedClient(null);
  };

  const totalLeads = clients.reduce((a, c) => a + (c.leads_count || 0), 0);
  const totalDms = clients.reduce((a, c) => a + (c.dms_sent || 0), 0);
  const activeClients = clients.filter(c => c.status === "Active").length;

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#e8f0ec", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0d1410;border-bottom:1px solid #1e2b24;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#00e5a0;text-decoration:none;}
        .back-btn{background:transparent;border:1px solid #1e2b24;color:#a0a8a3;font-size:0.82rem;padding:0.4rem 0.9rem;border-radius:8px;cursor:pointer;text-decoration:none;}
        .back-btn:hover{border-color:#2a3a2a;color:#e8f0ec;}
        .container{max-width:1100px;margin:0 auto;padding:2rem 1.5rem;}
        .page-title{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:0.4rem;letter-spacing:-0.03em;}
        .page-sub{font-size:0.9rem;color:#6b7c73;margin-bottom:2rem;font-weight:300;}
        .stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:2rem;}
        .stat-card{background:#111714;border:1px solid #1e2b24;border-radius:16px;padding:1.25rem;}
        .stat-val{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:#00e5a0;}
        .stat-lbl{font-size:0.78rem;color:#6b7c73;margin-top:0.25rem;text-transform:uppercase;letter-spacing:0.06em;}
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
        .section-title{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:#fff;}
        .new-btn{background:#00e5a0;color:#0a0a0a;font-family:'Syne',sans-serif;font-weight:700;font-size:0.85rem;padding:0.55rem 1.2rem;border-radius:8px;border:none;cursor:pointer;}
        .new-btn:hover{opacity:0.88;}
        .client-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;}
        .client-card{background:#111714;border:1px solid #1e2b24;border-radius:16px;padding:1.5rem;cursor:pointer;transition:border-color 0.2s;}
        .client-card:hover{border-color:rgba(0,229,160,0.3);}
        .client-card.selected{border-color:rgba(0,229,160,0.5);background:#0d1a14;}
        .client-avatar{width:44px;height:44px;background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;color:#00e5a0;font-size:1.1rem;margin-bottom:1rem;}
        .client-name{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#fff;margin-bottom:0.25rem;}
        .client-email{font-size:0.78rem;color:#6b7c73;margin-bottom:1rem;}
        .client-stats{display:flex;gap:1.5rem;margin-bottom:1rem;}
        .cs-val{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:#fff;}
        .cs-lbl{font-size:0.68rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;}
        .client-actions{display:flex;gap:0.5rem;align-items:center;}
        .status-active{font-size:0.72rem;padding:0.25rem 0.7rem;border-radius:100px;font-weight:600;background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.3);color:#00e5a0;}
        .status-paused{font-size:0.72rem;padding:0.25rem 0.7rem;border-radius:100px;font-weight:600;background:rgba(255,165,0,0.1);border:1px solid rgba(255,165,0,0.3);color:#ffa500;}
        .toggle-btn{background:transparent;border:1px solid #1e2b24;color:#a0a8a3;font-size:0.75rem;padding:0.25rem 0.7rem;border-radius:8px;cursor:pointer;}
        .toggle-btn:hover{border-color:#00e5a0;color:#00e5a0;}
        .delete-btn{background:transparent;border:1px solid #1e2b24;color:#6b7c73;font-size:0.75rem;padding:0.25rem 0.7rem;border-radius:8px;cursor:pointer;}
        .delete-btn:hover{border-color:#ff4d6d;color:#ff4d6d;}
        .empty-state{background:#111714;border:1px solid #1e2b24;border-radius:16px;padding:3rem;text-align:center;}
        .empty-icon{font-size:2.5rem;margin-bottom:1rem;}
        .empty-title{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:0.5rem;}
        .empty-sub{font-size:0.88rem;color:#6b7c73;font-weight:300;margin-bottom:1.5rem;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem;}
        .modal{background:#111714;border:1px solid #1e2b24;border-radius:22px;padding:2rem;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;}
        .modal-title{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:0.4rem;}
        .modal-sub{font-size:0.85rem;color:#6b7c73;margin-bottom:1.5rem;font-weight:300;}
        .label{display:block;font-size:0.82rem;font-weight:500;color:#a0a8a3;margin-bottom:0.5rem;}
        .input{width:100%;background:#0a0a0a;border:1px solid #1e2b24;border-radius:10px;padding:0.85rem 1rem;color:#e8f0ec;font-size:0.9rem;outline:none;transition:border-color 0.2s;margin-bottom:1rem;font-family:'DM Sans',sans-serif;}
        .input:focus{border-color:#00e5a0;}
        .modal-btns{display:flex;gap:0.75rem;}
        .cancel-btn{flex:1;background:transparent;border:1px solid #1e2b24;color:#a0a8a3;font-family:'Syne',sans-serif;font-weight:600;font-size:0.88rem;padding:0.8rem;border-radius:10px;cursor:pointer;}
        .submit-btn{flex:2;background:#00e5a0;color:#0a0a0a;font-family:'Syne',sans-serif;font-weight:700;font-size:0.88rem;padding:0.8rem;border-radius:10px;border:none;cursor:pointer;}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .success-bar{background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.3);color:#00e5a0;font-size:0.85rem;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;}
        .error-bar{background:rgba(255,77,109,0.1);border:1px solid rgba(255,77,109,0.3);color:#ff4d6d;font-size:0.85rem;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;}
        .agency-badge{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(0,229,160,0.08);border:1px solid rgba(0,229,160,0.2);color:#00e5a0;font-size:0.78rem;padding:0.4rem 1rem;border-radius:100px;margin-bottom:2rem;}
        .tip-card{background:#0d1410;border:1px solid #1e2b24;border-radius:16px;padding:1.25rem 1.5rem;margin-top:2rem;}
        .tip-title{font-family:'Syne',sans-serif;font-size:0.9rem;font-weight:700;color:#fff;margin-bottom:0.5rem;}
        .tip-text{font-size:0.83rem;color:#6b7c73;line-height:1.6;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <a href="/dashboard" className="back-btn">← Dashboard</a>
      </nav>

      <div className="container">
        {success && <div className="success-bar">{success}</div>}
        {error && <div className="error-bar">❌ {error}</div>}

        <div className="agency-badge">🏢 Agency Dashboard — Apex Plan</div>

        <h1 className="page-title">Agency Client Manager</h1>
        <p className="page-sub">Manage LinkedIn automation for all your clients from one place.</p>

        <div className="stats-row">
          <div className="stat-card"><div className="stat-val">{clients.length}</div><div className="stat-lbl">Total Clients</div></div>
          <div className="stat-card"><div className="stat-val">{activeClients}</div><div className="stat-lbl">Active Clients</div></div>
          <div className="stat-card"><div className="stat-val">{totalLeads}</div><div className="stat-lbl">Total Leads</div></div>
          <div className="stat-card"><div className="stat-val">{totalDms}</div><div className="stat-lbl">Total DMs Sent</div></div>
        </div>

        <div className="section-header">
          <div className="section-title">Your Clients</div>
          <button className="new-btn" onClick={() => setShowAddClient(true)}>+ Add Client</button>
        </div>

        {clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <div className="empty-title">No clients yet</div>
            <div className="empty-sub">Add your first client to start managing their LinkedIn automation from this dashboard.</div>
            <button className="new-btn" onClick={() => setShowAddClient(true)}>+ Add your first client</button>
          </div>
        ) : (
          <div className="client-grid">
            {clients.map(c => (
              <div
                className={`client-card ${selectedClient?.id === c.id ? "selected" : ""}`}
                key={c.id}
                onClick={() => setSelectedClient(prev => prev?.id === c.id ? null : c)}
              >
                <div className="client-avatar">{c.name?.charAt(0).toUpperCase()}</div>
                <div className="client-name">{c.name}</div>
                <div className="client-email">{c.email}</div>
                <div className="client-stats">
                  <div><div className="cs-val">{c.leads_count || 0}</div><div className="cs-lbl">Leads</div></div>
                  <div><div className="cs-val">{c.dms_sent || 0}</div><div className="cs-lbl">DMs</div></div>
                  <div><div className="cs-val">{c.campaigns_count || 0}</div><div className="cs-lbl">Campaigns</div></div>
                </div>
                <div className="client-actions" onClick={e => e.stopPropagation()}>
                  <div className={c.status === "Active" ? "status-active" : "status-paused"}>
                    {c.status === "Active" ? "🟢 Active" : "⏸ Paused"}
                  </div>
                  <button className="toggle-btn" onClick={() => toggleClient(c)}>
                    {c.status === "Active" ? "Pause" : "Resume"}
                  </button>
                  <button className="delete-btn" onClick={() => deleteClient(c.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="tip-card">
          <div className="tip-title">💡 How agency management works</div>
          <div className="tip-text">
            Add each client with their name, email, and LinkedIn session cookie. LeadMagnet runs separate automations for each client. All leads and campaigns are kept completely separate per client. You can pause or resume any client at any time.
          </div>
        </div>
      </div>

      {showAddClient && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Add New Client</div>
            <div className="modal-sub">Add a client to manage their LinkedIn automation from your agency dashboard.</div>
            <form onSubmit={handleAddClient}>
              <label className="label">Client Name</label>
              <input className="input" placeholder="e.g. Acme Corp" value={clientName} onChange={e => setClientName(e.target.value)} required />
              <label className="label">Client Email</label>
              <input className="input" type="email" placeholder="client@company.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required />
              <label className="label">LinkedIn Session Cookie (li_at)</label>
              <input className="input" placeholder="AQEDATd6Ux8AAAA..." value={clientLinkedIn} onChange={e => setClientLinkedIn(e.target.value)} />
              <div className="modal-btns">
                <button type="button" className="cancel-btn" onClick={() => setShowAddClient(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Adding..." : "Add Client →"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}