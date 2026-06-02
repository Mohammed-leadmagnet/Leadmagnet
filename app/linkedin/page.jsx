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

    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true") {
      setConnected(true);
      setSuccess("LinkedIn connected successfully!");
      window.history.replaceState({}, "", "/linkedin");
    }
    if (params.get("error")) {
      setError("Connection failed: " + params.get("error"));
      window.history.replaceState({}, "", "/linkedin");
    }
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

  const handleConnect = () => {
    window.location.href = "/api/auth/linkedin";
  };

  const handleDisconnect = async () => {
    if (!user) return;
    await supabase.from("linkedin_accounts").delete().eq("user_id", user.id);
    setConnected(false);
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
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;letter-spacing:-0.02em;}
        .back-btn{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.835rem;padding:0.4rem 0.875rem;border-radius:8px;cursor:pointer;text-decoration:none;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .back-btn:hover{border-color:rgba(255,255,255,0.15);color:#94a3b8;}
        .container{max-width:900px;margin:0 auto;padding:2rem 1.5rem;}
        .page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:700;color:#f0f7f2;letter-spacing:-0.03em;margin-bottom:0.25rem;}
        .page-sub{font-size:0.855rem;color:#4d6b54;margin-bottom:2rem;}
        .connected-bar{background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.15);border-radius:12px;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;}
        .connected-dot{width:8px;height:8px;background:#22c97a;border-radius:50%;animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .connected-text{font-size:0.875rem;color:#22c97a;font-weight:500;}
        .disconnect-btn{background:transparent;border:1px solid rgba(239,68,68,0.2);color:#f87171;font-size:0.78rem;padding:0.3rem 0.75rem;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .disconnect-btn:hover{background:rgba(239,68,68,0.08);}
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
        .section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.975rem;font-weight:700;color:#c4d4c8;}
        .btn-primary{background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.835rem;padding:0.55rem 1.1rem;border-radius:9px;border:none;cursor:pointer;transition:all 0.15s;}
        .btn-primary:hover{background:#1db36c;transform:translateY(-1px);}
        .post-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.125rem 1.25rem;margin-bottom:0.75rem;}
        .post-url{font-size:0.82rem;color:#22c97a;font-weight:500;word-break:break-all;margin-bottom:0.4rem;}
        .post-msg{font-size:0.78rem;color:#3d5240;margin-bottom:0.75rem;}
        .post-stats{display:flex;gap:1.5rem;margin-bottom:0.75rem;}
        .ps-val{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:700;color:#f0f7f2;}
        .ps-lbl{font-size:0.68rem;color:#3d5240;text-transform:uppercase;letter-spacing:0.06em;}
        .post-actions{display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;}
        .status-active{font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:100px;font-weight:600;background:rgba(34,201,122,0.1);border:1px solid rgba(34,201,122,0.2);color:#22c97a;}
        .status-paused{font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:100px;font-weight:600;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);color:#fbbf24;}
        .toggle-btn{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.78rem;padding:0.3rem 0.65rem;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .toggle-btn:hover{border-color:rgba(34,201,122,0.3);color:#22c97a;}
        .delete-btn{background:transparent;border:1px solid rgba(239,68,68,0.2);color:#f87171;font-family:'Inter',sans-serif;font-weight:500;font-size:0.78rem;padding:0.3rem 0.65rem;border-radius:7px;cursor:pointer;transition:all 0.15s;}
        .delete-btn:hover{background:rgba(239,68,68,0.08);}
        .empty-state{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:3rem 2rem;text-align:center;}
        .empty-icon{font-size:2.25rem;margin-bottom:0.875rem;display:block;}
        .empty-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;font-weight:700;color:#c4d4c8;margin-bottom:0.4rem;}
        .empty-sub{font-size:0.835rem;color:#3d5240;margin-bottom:1.5rem;line-height:1.5;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem;backdrop-filter:blur(4px);}
        .modal{background:#0f1a11;border:1px solid rgba(255,255,255,0.09);border-radius:18px;padding:1.875rem;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;}
        .modal-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.2rem;font-weight:700;color:#f0f7f2;margin-bottom:0.3rem;letter-spacing:-0.02em;}
        .modal-sub{font-size:0.835rem;color:#3d5240;margin-bottom:1.5rem;line-height:1.5;}
        .form-label{display:block;font-size:0.775rem;font-weight:600;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.02em;}
        .form-input{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;transition:border-color 0.15s;}
        .form-input:focus{border-color:rgba(34,201,122,0.35);}
        .form-textarea{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;resize:vertical;min-height:120px;transition:border-color 0.15s;}
        .form-textarea:focus{border-color:rgba(34,201,122,0.35);}
        .modal-btns{display:flex;gap:0.75rem;}
        .modal-cancel{flex:1;background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-family:'Inter',sans-serif;font-weight:500;font-size:0.875rem;padding:0.75rem;border-radius:10px;cursor:pointer;}
        .modal-submit{flex:2;background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.875rem;padding:0.75rem;border-radius:10px;border:none;cursor:pointer;}
        .modal-submit:disabled{opacity:0.5;cursor:not-allowed;}
        .success-bar{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.2);color:#22c97a;font-size:0.835rem;padding:0.75rem 1rem;border-radius:10px;margin-bottom:1.5rem;}
        .error-bar{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171;font-size:0.835rem;padding:0.75rem 1rem;border-radius:10px;margin-bottom:1.5rem;}
        .connect-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:2.5rem;max-width:520px;margin:0 auto;}
        .connect-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;color:#f0f7f2;margin-bottom:0.5rem;letter-spacing:-0.03em;}
        .connect-sub{font-size:0.875rem;color:#3d5240;margin-bottom:1.75rem;line-height:1.6;}
        .feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.75rem;margin-bottom:2rem;}
        .feature-card{background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:1rem;}
        .feature-icon{font-size:1.25rem;margin-bottom:0.5rem;}
        .feature-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.835rem;font-weight:700;color:#c4d4c8;margin-bottom:0.2rem;}
        .feature-desc{font-size:0.75rem;color:#2d4a33;line-height:1.4;}
        .linkedin-btn{width:100%;background:#0A66C2;color:#fff;font-family:'Inter',sans-serif;font-weight:600;font-size:0.925rem;padding:0.875rem;border-radius:11px;border:none;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:0.75rem;letter-spacing:-0.01em;}
        .linkedin-btn:hover{background:#084fa1;transform:translateY(-1px);box-shadow:0 4px 16px rgba(10,102,194,0.3);}
        .linkedin-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .security-note{display:flex;align-items:center;gap:0.5rem;font-size:0.775rem;color:#2a3d2e;margin-top:0.875rem;justify-content:center;}
        .var-tag{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.18);color:#22c97a;font-size:0.72rem;padding:0.2rem 0.55rem;border-radius:6px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;margin-right:0.375rem;}
        .var-tag:hover{background:rgba(34,201,122,0.15);}
        .date-text{font-size:0.72rem;color:#3d5240;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <a href="/dashboard" className="back-btn">← Dashboard</a>
      </nav>

      <div className="container">
        {success && <div className="success-bar">✓ {success}</div>}
        {error && <div className="error-bar">⚠ {error}</div>}

        {!connected ? (
          <div className="connect-card">
            <div className="connect-title">💼 Connect LinkedIn</div>
            <p className="connect-sub">Connect your LinkedIn account with one click. We'll redirect you to LinkedIn to approve access — no password stored.</p>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <div className="feature-title">Auto-DM</div>
                <div className="feature-desc">Automatically DM everyone who comments on your posts</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <div className="feature-title">Lead Capture</div>
                <div className="feature-desc">Capture leads directly into your dashboard</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <div className="feature-title">24/7 Autopilot</div>
                <div className="feature-desc">Runs while you sleep — never miss a comment</div>
              </div>
            </div>

            <button className="linkedin-btn" onClick={handleConnect} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {loading ? "Connecting..." : "Connect with LinkedIn"}
            </button>
            <div className="security-note">
              🔒 We only request basic profile access. Your password is never stored.
            </div>
          </div>
        ) : (
          <>
            <h1 className="page-title">💼 LinkedIn Automation</h1>
            <p className="page-sub">Manage which posts are automated. Toggle on/off anytime.</p>

            <div className="connected-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="connected-dot"></div>
                <div className="connected-text">LinkedIn connected & active</div>
              </div>
              <button className="disconnect-btn" onClick={handleDisconnect}>Disconnect</button>
            </div>

            <div className="section-header">
              <div className="section-title">Your Automated Posts</div>
              <button className="btn-primary" onClick={() => setShowNewPost(true)}>+ Add Post</button>
            </div>

            {campaigns.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📝</span>
                <div className="empty-title">No automated posts yet</div>
                <div className="empty-sub">Add your first LinkedIn post URL to start automating DMs to everyone who comments.</div>
                <button className="btn-primary" onClick={() => setShowNewPost(true)}>+ Add your first post</button>
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
                      {c.status === "Active" ? "Active" : "Paused"}
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
              <label className="form-label">LinkedIn Post URL</label>
              <input className="form-input" type="url" placeholder="https://linkedin.com/posts/..." value={postUrl} onChange={e => setPostUrl(e.target.value)} required />
              <label className="form-label">DM Message</label>
              <div style={{ marginBottom: "0.5rem" }}>
                {["[Name]", "[Link]"].map(tag => (
                  <span key={tag} className="var-tag" onClick={() => setDmMessage(prev => prev + tag)}>{tag}</span>
                ))}
              </div>
              <textarea className="form-textarea" placeholder="Hey [Name], thanks for commenting! Here's the resource: [Link]" value={dmMessage} onChange={e => setDmMessage(e.target.value)} required />
              <div className="modal-btns">
                <button type="button" className="modal-cancel" onClick={() => setShowNewPost(false)}>Cancel</button>
                <button type="submit" className="modal-submit" disabled={loading}>{loading ? "Starting..." : "Start Automation →"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}