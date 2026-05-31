"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LinkedIn() {
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [step, setStep] = useState(1);
  const [cookie, setCookie] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [dmMessage, setDmMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      checkConnection(data.user.id);
      loadCampaigns(data.user.id);
    });
  }, []);

  const checkConnection = async (userId) => {
    const { data } = await supabase
      .from("linkedin_accounts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) setConnected(true);
  };

  const loadCampaigns = async (userId) => {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setCampaigns(data);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: dbError } = await supabase
        .from("linkedin_accounts")
        .upsert({ user_id: user.id, session_cookie: cookie, status: "Active", connected_at: new Date().toISOString() });
      if (dbError) throw dbError;
      setConnected(true);
      setCookie("");
      setSuccess("✅ LinkedIn connected successfully!");
    } catch (err) {
      setError("Failed to connect: " + err.message);
    }
    setLoading(false);
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scrape_post", postUrl, dmMessage, userId: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        const { data: campaign } = await supabase
          .from("campaigns")
          .insert({ user_id: user.id, post_url: postUrl, dm_message: dmMessage, status: "Active", container_id: data.containerId })
          .select().single();
        if (campaign) setCampaigns(prev => [campaign, ...prev]);
        setPostUrl(""); setDmMessage(""); setShowNewPost(false);
        setSuccess("🚀 Post automation started!");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError("Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  const toggleCampaign = async (campaign) => {
    const newStatus = campaign.status === "Active" ? "Paused" : "Active";
    await supabase.from("campaigns").update({ status: newStatus }).eq("id", campaign.id);
    setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: newStatus } : c));
  };

  const deleteCampaign = async (id) => {
    await supabase.from("campaigns").delete().eq("id", id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", color: "#e8f0ec", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0d1410;border-bottom:1px solid #1e2b24;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#00e5a0;text-decoration:none;}
        .back-btn{background:transparent;border:1px solid #1e2b24;color:#a0a8a3;font-size:0.82rem;padding:0.4rem 0.9rem;border-radius:8px;cursor:pointer;text-decoration:none;}
        .back-btn:hover{border-color:#2a3a2a;color:#e8f0ec;}
        .container{max-width:900px;margin:0 auto;padding:2rem 1.5rem;}
        .page-title{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:0.4rem;letter-spacing:-0.03em;}
        .page-sub{font-size:0.9rem;color:#6b7c73;margin-bottom:2rem;font-weight:300;}
        .connected-bar{background:rgba(0,229,160,0.08);border:1px solid rgba(0,229,160,0.2);border-radius:12px;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;}
        .connected-info{display:flex;align-items:center;gap:0.75rem;}
        .connected-dot{width:10px;height:10px;background:#00e5a0;border-radius:50%;animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .connected-text{font-size:0.88rem;color:#00e5a0;font-weight:500;}
        .reconnect-btn{background:transparent;border:1px solid #1e2b24;color:#6b7c73;font-size:0.78rem;padding:0.3rem 0.8rem;border-radius:8px;cursor:pointer;}
        .reconnect-btn:hover{border-color:#00e5a0;color:#00e5a0;}
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
        .section-title{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:#fff;}
        .new-btn{background:#00e5a0;color:#0a0a0a;font-family:'Syne',sans-serif;font-weight:700;font-size:0.85rem;padding:0.55rem 1.2rem;border-radius:8px;border:none;cursor:pointer;}
        .new-btn:hover{opacity:0.88;}
        .post-card{background:#111714;border:1px solid #1e2b24;border-radius:16px;padding:1.25rem 1.5rem;margin-bottom:0.75rem;}
        .post-url{font-size:0.82rem;color:#00e5a0;font-weight:500;word-break:break-all;margin-bottom:0.4rem;}
        .post-msg{font-size:0.78rem;color:#6b7c73;font-weight:300;margin-bottom:0.75rem;}
        .post-stats{display:flex;gap:1.5rem;margin-bottom:0.75rem;}
        .ps-val{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:#fff;}
        .ps-lbl{font-size:0.68rem;color:#6b7c73;text-transform:uppercase;letter-spacing:0.06em;}
        .post-actions{display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;}
        .status-active{font-size:0.72rem;padding:0.25rem 0.7rem;border-radius:100px;font-weight:600;background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.3);color:#00e5a0;}
        .status-paused{font-size:0.72rem;padding:0.25rem 0.7rem;border-radius:100px;font-weight:600;background:rgba(255,165,0,0.1);border:1px solid rgba(255,165,0,0.3);color:#ffa500;}
        .toggle-btn{background:transparent;border:1px solid #1e2b24;color:#a0a8a3;font-size:0.78rem;padding:0.3rem 0.8rem;border-radius:8px;cursor:pointer;}
        .toggle-btn:hover{border-color:#00e5a0;color:#00e5a0;}
        .delete-btn{background:transparent;border:1px solid #1e2b24;color:#6b7c73;font-size:0.78rem;padding:0.3rem 0.8rem;border-radius:8px;cursor:pointer;}
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
        .textarea{width:100%;background:#0a0a0a;border:1px solid #1e2b24;border-radius:10px;padding:0.85rem 1rem;color:#e8f0ec;font-size:0.9rem;outline:none;transition:border-color 0.2s;margin-bottom:1rem;font-family:'DM Sans',sans-serif;resize:vertical;min-height:120px;}
        .textarea:focus{border-color:#00e5a0;}
        .modal-btns{display:flex;gap:0.75rem;}
        .cancel-btn{flex:1;background:transparent;border:1px solid #1e2b24;color:#a0a8a3;font-family:'Syne',sans-serif;font-weight:600;font-size:0.88rem;padding:0.8rem;border-radius:10px;cursor:pointer;}
        .submit-btn{flex:2;background:#00e5a0;color:#0a0a0a;font-family:'Syne',sans-serif;font-weight:700;font-size:0.88rem;padding:0.8rem;border-radius:10px;border:none;cursor:pointer;}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .success-bar{background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.3);color:#00e5a0;font-size:0.85rem;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;}
        .error-bar{background:rgba(255,77,109,0.1);border:1px solid rgba(255,77,109,0.3);color:#ff4d6d;font-size:0.85rem;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;}
        .tag{display:inline-block;background:rgba(0,229,160,0.08);border:1px solid rgba(0,229,160,0.2);color:#00e5a0;font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:100px;margin-right:0.4rem;margin-bottom:0.4rem;cursor:pointer;}
        .connect-card{background:#111714;border:1px solid #1e2b24;border-radius:22px;padding:2.5rem;max-width:520px;margin:0 auto;}
        .connect-title{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:800;color:#fff;margin-bottom:0.5rem;}
        .connect-sub{font-size:0.88rem;color:#6b7c73;margin-bottom:1.5rem;line-height:1.6;}
        .warning{background:rgba(255,165,0,0.08);border:1px solid rgba(255,165,0,0.2);color:#ffa500;font-size:0.82rem;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;line-height:1.5;}
        .instruction-box{background:#0d1410;border:1px solid #1e2b24;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;}
        .instruction-step{display:flex;gap:0.75rem;align-items:flex-start;margin-bottom:0.75rem;}
        .instruction-step:last-child{margin-bottom:0;}
        .num{background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.3);color:#00e5a0;font-family:'Syne',sans-serif;font-weight:700;font-size:0.8rem;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .instruction-text{font-size:0.85rem;color:#a0a8a3;line-height:1.5;}
        .instruction-text code{background:#1e2b24;padding:0.1rem 0.4rem;border-radius:4px;font-size:0.8rem;color:#00e5a0;}
        .btn{width:100%;background:#00e5a0;color:#0a0a0a;font-family:'Syne',sans-serif;font-weight:700;font-size:0.95rem;padding:0.9rem;border-radius:10px;border:none;cursor:pointer;}
        .btn:hover{opacity:0.88;}
        .btn:disabled{opacity:0.5;cursor:not-allowed;}
        .steps-bar{display:flex;gap:0.5rem;margin-bottom:2rem;}
        .step-bar{flex:1;height:4px;border-radius:100px;background:#1e2b24;}
        .step-bar.active{background:#00e5a0;}
        .date-text{font-size:0.72rem;color:#6b7c73;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <a href="/dashboard" className="back-btn">← Dashboard</a>
      </nav>

      <div className="container">
        {success && <div className="success-bar">{success}</div>}
        {error && <div className="error-bar">❌ {error}</div>}

        {!connected ? (
          <div className="connect-card">
            <div className="steps-bar">
              <div className={`step-bar ${step >= 1 ? "active" : ""}`}></div>
              <div className={`step-bar ${step >= 2 ? "active" : ""}`}></div>
            </div>

            {step === 1 && (
              <>
                <div className="connect-title">💼 Connect LinkedIn</div>
                <p className="connect-sub">Connect your LinkedIn account using your session cookie. We never ask for your password — 100% safe.</p>
                <div className="warning">🔒 We only store your session cookie — the same token your browser uses to keep you logged in. No password stored.</div>
                <div className="instruction-box">
                  <div className="instruction-step"><div className="num">1</div><div className="instruction-text">Open <strong>linkedin.com</strong> and make sure you're logged in</div></div>
                  <div className="instruction-step"><div className="num">2</div><div className="instruction-text">Press <code>F12</code> → click <code>Application</code> tab</div></div>
                  <div className="instruction-step"><div className="num">3</div><div className="instruction-text">Click <code>Cookies</code> → <code>https://www.linkedin.com</code></div></div>
                  <div className="instruction-step"><div className="num">4</div><div className="instruction-text">Find <code>li_at</code> and copy its value</div></div>
                </div>
                <button className="btn" onClick={() => setStep(2)}>I have my cookie →</button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="connect-title">Paste your cookie</div>
                <p className="connect-sub">Paste the li_at cookie value from LinkedIn below.</p>
                {error && <div className="error-bar">{error}</div>}
                <form onSubmit={handleConnect}>
                  <label className="label">li_at cookie value</label>
                  <input className="input" placeholder="AQEDATd6Ux8AAAA..." value={cookie} onChange={e => setCookie(e.target.value)} required />
                  <button className="btn" type="submit" disabled={loading || !cookie}>
                    {loading ? "Connecting..." : "Connect LinkedIn →"}
                  </button>
                </form>
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <a href="#" onClick={() => setStep(1)} style={{ color: "#6b7c73", fontSize: "0.85rem" }}>← Back</a>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <h1 className="page-title">💼 LinkedIn Automation</h1>
            <p className="page-sub">Manage which posts are automated. Toggle on/off anytime.</p>

            <div className="connected-bar">
              <div className="connected-info">
                <div className="connected-dot"></div>
                <div className="connected-text">LinkedIn connected & active</div>
              </div>
              <button className="reconnect-btn" onClick={() => setConnected(false)}>Reconnect</button>
            </div>

            <div className="section-header">
              <div className="section-title">Your Automated Posts</div>
              <button className="new-btn" onClick={() => setShowNewPost(true)}>+ Add Post</button>
            </div>

            {campaigns.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <div className="empty-title">No automated posts yet</div>
                <div className="empty-sub">Add your first LinkedIn post URL to start automating DMs to everyone who comments.</div>
                <button className="new-btn" onClick={() => setShowNewPost(true)}>+ Add your first post</button>
              </div>
            ) : (
              campaigns.map(c => (
                <div className="post-card" key={c.id}>
                  <div className="post-url">🔗 {c.post_url?.slice(0, 70)}...</div>
                  <div className="post-msg">DM: "{c.dm_message?.slice(0, 70)}..."</div>
                  <div className="post-stats">
                    <div><div className="ps-val">{c.leads_count || 0}</div><div className="ps-lbl">Leads</div></div>
                    <div><div className="ps-val">{c.dms_sent || 0}</div><div className="ps-lbl">DMs Sent</div></div>
                  </div>
                  <div className="post-actions">
                    <div className={c.status === "Active" ? "status-active" : "status-paused"}>
                      {c.status === "Active" ? "🟢 Active" : "⏸ Paused"}
                    </div>
                    <button className="toggle-btn" onClick={() => toggleCampaign(c)}>
                      {c.status === "Active" ? "Pause" : "Resume"}
                    </button>
                    <button className="delete-btn" onClick={() => deleteCampaign(c.id)}>Delete</button>
                    <span className="date-text">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {showNewPost && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Automate a Post</div>
            <div className="modal-sub">Paste your LinkedIn post URL and write the DM to send to everyone who comments.</div>
            <form onSubmit={handleAddPost}>
              <label className="label">LinkedIn Post URL</label>
              <input className="input" type="url" placeholder="https://linkedin.com/posts/..." value={postUrl} onChange={e => setPostUrl(e.target.value)} required />
              <label className="label">DM Message</label>
              <div style={{ marginBottom: "0.5rem" }}>
                {["[Name]", "[Link]"].map(tag => (
                  <span key={tag} className="tag" onClick={() => setDmMessage(prev => prev + tag)}>{tag}</span>
                ))}
              </div>
              <textarea className="textarea" placeholder="Hey [Name], thanks for commenting! Here's the resource: [Link]" value={dmMessage} onChange={e => setDmMessage(e.target.value)} required />
              <div className="modal-btns">
                <button type="button" className="cancel-btn" onClick={() => setShowNewPost(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Starting..." : "Start Automation →"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}