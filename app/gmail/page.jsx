"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const FREQUENCIES = [
  { value: "hourly", label: "Every hour" },
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every 30 days" },
];

export default function Gmail() {
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gmailUser, setGmailUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sequences, setSequences] = useState([]);
  const [showNewSequence, setShowNewSequence] = useState(false);
  const [seqName, setSeqName] = useState("");
  const [seqFrequency, setSeqFrequency] = useState("daily");
  const [seqEmails, setSeqEmails] = useState([{ day: 1, subject: "", body: "" }]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);

      const params = new URLSearchParams(window.location.search);
      if (params.get("connected") === "true") {
        await supabase.from("gmail_accounts").upsert({
          user_id: data.user.id,
          email: data.user.email,
        }, { onConflict: "user_id" });
        setConnected(true);
        setGmailUser(data.user.email);
        setSuccess("Gmail connected successfully!");
        window.history.replaceState({}, "", "/gmail");
      } else {
        checkConnection(data.user.id);
      }
      loadSequences(data.user.id);
    });
  }, []);

  const checkConnection = async (userId) => {
    const { data } = await supabase
      .from("gmail_accounts")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      setConnected(true);
      setGmailUser(data.email);
    }
  };

  const loadSequences = async (userId) => {
    const { data } = await supabase
      .from("email_sequences")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setSequences(data);
  };

  const handleConnect = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) { window.location.href = "/login"; return; }
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
          redirectTo: "https://leadmagnetinc.com/gmail?connected=true",
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError("Failed to connect: " + err.message);
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    await supabase.from("gmail_accounts").delete().eq("user_id", user.id);
    setConnected(false);
    setGmailUser("");
  };

  const handleCreateSequence = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data: seq, error: seqError } = await supabase
        .from("email_sequences")
        .insert({ user_id: user.id, name: seqName, emails: seqEmails, status: "Active", send_frequency: seqFrequency })
        .select().single();
      if (seqError) throw seqError;
      if (seq) setSequences(prev => [seq, ...prev]);
      setSeqName("");
      setSeqFrequency("daily");
      setSeqEmails([{ day: 1, subject: "", body: "" }]);
      setShowNewSequence(false);
      setSuccess("Email sequence created!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  const addEmail = () => {
    const lastDay = seqEmails[seqEmails.length - 1]?.day || 0;
    setSeqEmails(prev => [...prev, { day: lastDay + 7, subject: "", body: "" }]);
  };

  const updateEmail = (index, field, value) => {
    setSeqEmails(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  const removeEmail = (index) => {
    setSeqEmails(prev => prev.filter((_, i) => i !== index));
  };

  const deleteSequence = async (id) => {
    await supabase.from("email_sequences").delete().eq("id", id);
    setSequences(prev => prev.filter(s => s.id !== id));
  };

  const getFrequencyLabel = (val) => FREQUENCIES.find(f => f.value === val)?.label || val;

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
        .reconnect-btn{background:transparent;border:1px solid rgba(239,68,68,0.2);color:#f87171;font-size:0.78rem;padding:0.3rem 0.75rem;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .reconnect-btn:hover{background:rgba(239,68,68,0.08);}
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
        .section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.975rem;font-weight:700;color:#c4d4c8;}
        .btn-primary{background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.835rem;padding:0.55rem 1.1rem;border-radius:9px;border:none;cursor:pointer;transition:all 0.15s;}
        .btn-primary:hover{background:#1db36c;transform:translateY(-1px);}
        .seq-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.125rem 1.25rem;margin-bottom:0.75rem;}
        .seq-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#e2ede7;margin-bottom:0.3rem;}
        .seq-info{font-size:0.78rem;color:#3d5240;}
        .seq-freq{display:inline-block;background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.12);color:#4d6b54;font-size:0.7rem;padding:0.15rem 0.5rem;border-radius:5px;margin-left:0.5rem;}
        .seq-steps{display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap;}
        .seq-step{background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:7px;padding:0.3rem 0.65rem;font-size:0.72rem;color:#4d6b54;}
        .status-pill{font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:100px;font-weight:600;background:rgba(34,201,122,0.1);border:1px solid rgba(34,201,122,0.2);color:#22c97a;}
        .btn-danger{background:transparent;border:1px solid rgba(239,68,68,0.2);color:#f87171;font-family:'Inter',sans-serif;font-weight:500;font-size:0.78rem;padding:0.3rem 0.65rem;border-radius:7px;cursor:pointer;transition:all 0.15s;}
        .btn-danger:hover{background:rgba(239,68,68,0.08);}
        .empty-state{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:3rem 2rem;text-align:center;}
        .empty-icon{font-size:2.25rem;margin-bottom:0.875rem;display:block;}
        .empty-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;font-weight:700;color:#c4d4c8;margin-bottom:0.4rem;}
        .empty-sub{font-size:0.835rem;color:#3d5240;margin-bottom:1.5rem;line-height:1.5;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:100;padding:1rem;backdrop-filter:blur(4px);}
        .modal{background:#0f1a11;border:1px solid rgba(255,255,255,0.09);border-radius:18px;padding:1.875rem;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;}
        .modal-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.2rem;font-weight:700;color:#f0f7f2;margin-bottom:0.3rem;letter-spacing:-0.02em;}
        .modal-sub{font-size:0.835rem;color:#3d5240;margin-bottom:1.5rem;line-height:1.5;}
        .form-label{display:block;font-size:0.775rem;font-weight:600;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.02em;}
        .form-input{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;transition:border-color 0.15s;}
        .form-input:focus{border-color:rgba(34,201,122,0.35);}
        .form-textarea{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1rem;resize:vertical;min-height:110px;transition:border-color 0.15s;}
        .form-textarea:focus{border-color:rgba(34,201,122,0.35);}
        .freq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;margin-bottom:1rem;}
        .freq-btn{background:#080c09;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.8rem;padding:0.65rem;border-radius:9px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.15s;text-align:center;}
        .freq-btn.selected{background:rgba(34,201,122,0.1);border-color:rgba(34,201,122,0.35);color:#22c97a;font-weight:600;}
        .freq-btn:hover{border-color:rgba(34,201,122,0.2);color:#94a3b8;}
        .modal-btns{display:flex;gap:0.75rem;margin-top:0.25rem;}
        .modal-cancel{flex:1;background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-family:'Inter',sans-serif;font-weight:500;font-size:0.875rem;padding:0.75rem;border-radius:10px;cursor:pointer;}
        .modal-submit{flex:2;background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.875rem;padding:0.75rem;border-radius:10px;border:none;cursor:pointer;}
        .modal-submit:disabled{opacity:0.5;cursor:not-allowed;}
        .modal-divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:1.25rem 0;}
        .var-tags{display:flex;gap:0.375rem;flex-wrap:wrap;margin-bottom:0.625rem;}
        .var-tag{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.18);color:#22c97a;font-size:0.72rem;padding:0.2rem 0.55rem;border-radius:6px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:500;}
        .var-tag:hover{background:rgba(34,201,122,0.15);}
        .email-block{background:#080c09;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:1rem;margin-bottom:1rem;position:relative;}
        .email-block-title{font-size:0.78rem;font-weight:600;color:#22c97a;margin-bottom:0.875rem;text-transform:uppercase;letter-spacing:0.02em;}
        .remove-email-btn{position:absolute;top:0.875rem;right:0.875rem;background:transparent;border:none;color:#3d5240;cursor:pointer;font-size:0.9rem;}
        .remove-email-btn:hover{color:#f87171;}
        .add-email-btn{width:100%;background:transparent;border:1px dashed rgba(255,255,255,0.08);color:#3d5240;font-size:0.835rem;padding:0.7rem;border-radius:10px;cursor:pointer;font-family:'Inter',sans-serif;margin-bottom:1rem;transition:all 0.15s;}
        .add-email-btn:hover{border-color:rgba(34,201,122,0.3);color:#22c97a;}
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
        .google-btn{width:100%;background:#fff;color:#1a1a1a;font-family:'Inter',sans-serif;font-weight:600;font-size:0.925rem;padding:0.875rem;border-radius:11px;border:none;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:0.75rem;letter-spacing:-0.01em;}
        .google-btn:hover{background:#f5f5f5;transform:translateY(-1px);box-shadow:0 4px 16px rgba(255,255,255,0.1);}
        .google-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .security-note{display:flex;align-items:center;gap:0.5rem;font-size:0.775rem;color:#2a3d2e;margin-top:0.875rem;justify-content:center;}
        .tip-card{background:rgba(34,201,122,0.04);border:1px solid rgba(34,201,122,0.1);border-radius:12px;padding:1rem 1.25rem;margin-top:1.5rem;}
        .tip-title{font-size:0.815rem;font-weight:600;color:#22c97a;margin-bottom:0.3rem;}
        .tip-text{font-size:0.785rem;color:#2d4a33;line-height:1.6;}
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
            <div className="connect-title">📧 Connect Gmail</div>
            <p className="connect-sub">Connect your Gmail account to send automated follow-up emails to your leads — directly from your own inbox.</p>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">📅</div>
                <div className="feature-title">Scheduled Sequences</div>
                <div className="feature-desc">Send emails on day 1, 7, 14, 30 automatically</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <div className="feature-title">Personalised</div>
                <div className="feature-desc">Use [Name], [Company] in every email</div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <div className="feature-title">Track Opens</div>
                <div className="feature-desc">See who opens and clicks your emails</div>
              </div>
            </div>
            <button className="google-btn" onClick={handleConnect} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
              </svg>
              {loading ? "Connecting..." : "Connect with Google"}
            </button>
            <div className="security-note">
              🔒 We only request permission to send emails on your behalf. Your password is never stored.
            </div>
          </div>
        ) : (
          <>
            <h1 className="page-title">📧 Gmail Automation</h1>
            <p className="page-sub">Manage your email sequences. Emails send automatically to new leads.</p>

            <div className="connected-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div className="connected-dot"></div>
                <div className="connected-text">Gmail connected — {gmailUser}</div>
              </div>
              <button className="reconnect-btn" onClick={handleDisconnect}>Disconnect</button>
            </div>

            <div className="section-header">
              <div className="section-title">Your Email Sequences</div>
              <button className="btn-primary" onClick={() => setShowNewSequence(true)}>+ New Sequence</button>
            </div>

            {sequences.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📧</span>
                <div className="empty-title">No sequences yet</div>
                <div className="empty-sub">Create your first email sequence to automatically follow up with leads.</div>
                <button className="btn-primary" onClick={() => setShowNewSequence(true)}>+ Create first sequence</button>
              </div>
            ) : (
              sequences.map(s => (
                <div className="seq-card" key={s.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <div className="seq-name">
                      {s.name}
                      <span className="seq-freq">{getFrequencyLabel(s.send_frequency)}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <div className="status-pill">{s.status}</div>
                      <button className="btn-danger" onClick={() => deleteSequence(s.id)}>Delete</button>
                    </div>
                  </div>
                  <div className="seq-info">{s.emails?.length || 0} emails in sequence</div>
                  <div className="seq-steps">
                    {s.emails?.map((email, i) => (
                      <div className="seq-step" key={i}>Day {email.day} — {email.subject?.slice(0, 25)}...</div>
                    ))}
                  </div>
                </div>
              ))
            )}

            <div className="tip-card">
              <div className="tip-title">How email sequences work</div>
              <div className="tip-text">Set up once — runs forever. Day 1 sends immediately when a lead is captured. Day 7 follows up one week later. Use [Name], [Company], and [Link] to personalise every email automatically.</div>
            </div>
          </>
        )}
      </div>

      {showNewSequence && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">New Email Sequence</div>
            <div className="modal-sub">Set up automatic follow-up emails that send to leads on your schedule.</div>
            <form onSubmit={handleCreateSequence}>
              <label className="form-label">SEQUENCE NAME</label>
              <input className="form-input" placeholder="e.g. 30-day follow-up sequence" value={seqName} onChange={e => setSeqName(e.target.value)} required />

              <label className="form-label">SEND FREQUENCY</label>
              <div className="freq-grid">
                {FREQUENCIES.map(f => (
                  <button key={f.value} type="button" className={`freq-btn ${seqFrequency === f.value ? "selected" : ""}`} onClick={() => setSeqFrequency(f.value)}>
                    {f.label}
                  </button>
                ))}
              </div>

              <hr className="modal-divider" />

              {seqEmails.map((email, index) => (
                <div className="email-block" key={index}>
                  <div className="email-block-title">Email {index + 1} · Day {email.day}</div>
                  {index > 0 && <button type="button" className="remove-email-btn" onClick={() => removeEmail(index)}>✕</button>}
                  <label className="form-label">SEND ON DAY</label>
                  <input className="form-input" type="number" min="1" value={email.day} onChange={e => updateEmail(index, "day", parseInt(e.target.value))} required />
                  <label className="form-label">SUBJECT LINE</label>
                  <input className="form-input" placeholder="e.g. Quick follow-up, [Name]" value={email.subject} onChange={e => updateEmail(index, "subject", e.target.value)} required />
                  <label className="form-label">EMAIL BODY</label>
                  <div className="var-tags">
                    {["[Name]", "[Company]", "[Link]"].map(tag => (
                      <span key={tag} className="var-tag" onClick={() => updateEmail(index, "body", email.body + tag)}>{tag}</span>
                    ))}
                  </div>
                  <textarea className="form-textarea" placeholder={`Hey [Name],\n\nJust checking in!\n\n[Your Name]`} value={email.body} onChange={e => updateEmail(index, "body", e.target.value)} required />
                </div>
              ))}
              <button type="button" className="add-email-btn" onClick={addEmail}>+ Add another email</button>
              <div className="modal-btns">
                <button type="button" className="modal-cancel" onClick={() => setShowNewSequence(false)}>Cancel</button>
                <button type="submit" className="modal-submit" disabled={loading}>{loading ? "Saving..." : "Create Sequence →"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}