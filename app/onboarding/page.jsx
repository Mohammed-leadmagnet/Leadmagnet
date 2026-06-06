"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [agencyName, setAgencyName] = useState("");
  const [clientCount, setClientCount] = useState("");
  const [source, setSource] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const totalSteps = 5;

  useEffect(() => {
    document.title = "Get Started — LeadMagnet";
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
    });
  }, []);

  const togglePlatform = (p) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleFinish = async () => {
    setLoading(true);
    if (user) {
      await supabase.from("profiles").upsert({
        user_id: user.id,
        agency_name: agencyName,
        client_count: clientCount,
        source,
        platforms,
        onboarded: true,
      }, { onConflict: "user_id" });
    }
    setLoading(false);
    setStep(5);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#22c97a;letter-spacing:-0.02em;position:fixed;top:1.5rem;left:2rem;}
        .progress-bar{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,0.06);}
        .progress-fill{height:100%;background:#22c97a;transition:width 0.4s ease;}
        .step-counter{position:fixed;top:1.5rem;right:2rem;font-size:0.775rem;color:#2a3d2e;font-weight:500;}
        .card{background:#0f1a11;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:2.5rem;width:100%;max-width:540px;}
        .step-tag{font-size:0.68rem;font-weight:600;color:#3d5240;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1.25rem;}
        .card-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.625rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.03em;margin-bottom:0.5rem;line-height:1.15;}
        .card-sub{font-size:0.875rem;color:#3d5240;margin-bottom:2rem;line-height:1.6;}
        .form-label{display:block;font-size:0.775rem;font-weight:600;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.02em;}
        .form-input{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1.25rem;transition:border-color 0.15s;}
        .form-input:focus{border-color:rgba(34,201,122,0.4);}
        .form-input::placeholder{color:#2a3d2e;}
        .option-grid{display:flex;flex-direction:column;gap:0.625rem;margin-bottom:2rem;}
        .option{background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:0.875rem 1.125rem;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:0.875rem;}
        .option:hover{border-color:rgba(34,201,122,0.3);}
        .option.selected{border-color:rgba(34,201,122,0.5);background:rgba(34,201,122,0.06);}
        .option-icon{font-size:1.1rem;flex-shrink:0;}
        .option-title{font-size:0.875rem;font-weight:600;color:#c4d4c8;margin-bottom:0.1rem;}
        .option-desc{font-size:0.75rem;color:#3d5240;}
        .source-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:2rem;}
        .source-btn{background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 0.5rem;cursor:pointer;transition:all 0.15s;text-align:center;font-size:0.815rem;font-weight:500;color:#6b7f70;font-family:'Inter',sans-serif;}
        .source-btn:hover{border-color:rgba(34,201,122,0.3);color:#c4d4c8;}
        .source-btn.selected{border-color:rgba(34,201,122,0.5);background:rgba(34,201,122,0.06);color:#22c97a;font-weight:600;}
        .platform-grid{display:flex;flex-direction:column;gap:0.625rem;margin-bottom:2rem;}
        .platform-opt{background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1rem 1.125rem;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:0.875rem;}
        .platform-opt:hover{border-color:rgba(34,201,122,0.3);}
        .platform-opt.selected{border-color:rgba(34,201,122,0.5);background:rgba(34,201,122,0.06);}
        .platform-check{width:20px;height:20px;border-radius:5px;border:1.5px solid rgba(255,255,255,0.12);margin-left:auto;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;font-size:0.75rem;font-weight:700;color:#071209;}
        .platform-opt.selected .platform-check{background:#22c97a;border-color:#22c97a;}
        .btn-primary{width:100%;background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.925rem;padding:0.875rem;border-radius:11px;border:none;cursor:pointer;transition:all 0.15s;}
        .btn-primary:hover{background:#1db36c;transform:translateY(-1px);}
        .btn-primary:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
        .btn-skip{width:100%;background:transparent;border:none;color:#2a3d2e;font-size:0.815rem;cursor:pointer;font-family:'Inter',sans-serif;margin-top:0.75rem;padding:0.5rem;}
        .btn-skip:hover{color:#4d6b54;}
        .back-link{text-align:center;margin-top:0.75rem;}
        .back-link button{background:none;border:none;color:#2a3d2e;font-size:0.815rem;cursor:pointer;font-family:'Inter',sans-serif;}
        .back-link button:hover{color:#4d6b54;}
        .success-wrap{text-align:center;padding:0.5rem 0;}
        .success-icon{font-size:3rem;margin-bottom:1.25rem;display:block;}
        .success-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;color:#f0f7f2;margin-bottom:0.5rem;letter-spacing:-0.03em;}
        .success-sub{font-size:0.875rem;color:#3d5240;margin-bottom:1.75rem;line-height:1.6;}
        .checklist{display:flex;flex-direction:column;gap:0.5rem;margin-bottom:2rem;text-align:left;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:1.25rem;}
        .check-item{display:flex;align-items:center;gap:0.625rem;font-size:0.845rem;color:#4d6b54;}
        .check-item.done{color:#4d6b54;}
        .check-item.todo{color:#2a3d2e;}
        .check-green{color:#22c97a;font-weight:700;}
        .next-steps{display:flex;flex-direction:column;gap:0.5rem;margin-bottom:2rem;}
        .next-step-card{background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:0.875rem 1rem;display:flex;align-items:center;gap:0.875rem;cursor:pointer;transition:all 0.15s;text-decoration:none;}
        .next-step-card:hover{border-color:rgba(34,201,122,0.25);}
        .next-step-label{font-size:0.835rem;font-weight:600;color:#c4d4c8;}
        .next-step-desc{font-size:0.72rem;color:#2a3d2e;margin-top:0.1rem;}
        .next-step-arrow{margin-left:auto;color:#2a3d2e;font-size:0.875rem;}
      `}</style>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
      </div>
      <div className="logo">⚡ LeadMagnet</div>
      {step < 5 && <div className="step-counter">Step {step} of {totalSteps - 1}</div>}

      {/* STEP 1 — Agency name */}
      {step === 1 && (
        <div className="card">
          <div className="step-tag">Step 1 of 4 · Your agency</div>
          <h1 className="card-title">Welcome to LeadMagnet! 👋</h1>
          <p className="card-sub">Let's set up your workspace. What's your agency or business name?</p>
          <label className="form-label">AGENCY / BUSINESS NAME</label>
          <input
            className="form-input"
            placeholder="e.g. Smith Marketing Agency"
            value={agencyName}
            onChange={e => setAgencyName(e.target.value)}
            autoFocus
          />
          <label className="form-label">HOW MANY CLIENTS DO YOU MANAGE?</label>
          <div className="option-grid">
            {[
              { id: "1", label: "Just me / 1 client", desc: "Getting started with lead generation" },
              { id: "2-5", label: "2–5 clients", desc: "Small agency or freelancer" },
              { id: "6-15", label: "6–15 clients", desc: "Growing agency" },
              { id: "15+", label: "15+ clients", desc: "Full-scale agency" },
            ].map(o => (
              <div key={o.id} className={`option ${clientCount === o.id ? "selected" : ""}`} onClick={() => setClientCount(o.id)}>
                <div>
                  <div className="option-title">{o.label}</div>
                  <div className="option-desc">{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" disabled={!agencyName.trim() || !clientCount} onClick={() => setStep(2)}>Continue →</button>
        </div>
      )}

      {/* STEP 2 — Where did you find us */}
      {step === 2 && (
        <div className="card">
          <div className="step-tag">Step 2 of 4 · Discovery</div>
          <h1 className="card-title">Where did you find us?</h1>
          <p className="card-sub">This helps us understand how to reach more agencies like yours.</p>
          <div className="source-grid">
            {["Google", "LinkedIn", "YouTube", "Instagram", "ChatGPT", "Claude", "A friend", "Twitter / X", "Other"].map(s => (
              <button key={s} className={`source-btn ${source === s ? "selected" : ""}`} onClick={() => setSource(s)}>{s}</button>
            ))}
          </div>
          <button className="btn-primary" disabled={!source} onClick={() => setStep(3)}>Continue →</button>
          <div className="back-link"><button onClick={() => setStep(1)}>← Back</button></div>
        </div>
      )}

      {/* STEP 3 — Platforms */}
      {step === 3 && (
        <div className="card">
          <div className="step-tag">Step 3 of 4 · Platforms</div>
          <h1 className="card-title">Which platforms do you want to use?</h1>
          <p className="card-sub">Select all that apply. You can connect them from your dashboard after setup.</p>
          <div className="platform-grid">
            {[
              { id: "linkedin", icon: "💼", title: "LinkedIn", desc: "Capture engaged prospects from LinkedIn campaigns" },
              { id: "instagram", icon: "📸", title: "Instagram", desc: "Capture engaged prospects from Instagram campaigns" },
              { id: "gmail", icon: "📧", title: "Gmail", desc: "Send automated follow-up email sequences via Google OAuth" },
            ].map(p => (
              <div key={p.id} className={`platform-opt ${platforms.includes(p.id) ? "selected" : ""}`} onClick={() => togglePlatform(p.id)}>
                <span style={{ fontSize: "1.25rem" }}>{p.icon}</span>
                <div>
                  <div className="option-title">{p.title}</div>
                  <div className="option-desc">{p.desc}</div>
                </div>
                <div className="platform-check">{platforms.includes(p.id) ? "✓" : ""}</div>
              </div>
            ))}
          </div>
          <button className="btn-primary" disabled={platforms.length === 0} onClick={() => setStep(4)}>Continue →</button>
          <div className="back-link"><button onClick={() => setStep(2)}>← Back</button></div>
        </div>
      )}

      {/* STEP 4 — First goal */}
      {step === 4 && (
        <div className="card">
          <div className="step-tag">Step 4 of 4 · Your goal</div>
          <h1 className="card-title">What's your first goal?</h1>
          <p className="card-sub">This helps us show you the right features first.</p>
          <div className="option-grid">
            {[
              { id: "capture", icon: "🎯", title: "Capture leads from campaigns", desc: "Start collecting prospects who engage with my content" },
              { id: "followup", icon: "📧", title: "Automate Gmail follow-ups", desc: "Set up email sequences that send automatically to leads" },
              { id: "clients", icon: "🏢", title: "Manage client campaigns", desc: "Set up workspaces and run campaigns for multiple clients" },
              { id: "reports", icon: "📊", title: "Send reports to clients", desc: "Automate monthly performance reports via Gmail" },
            ].map(o => (
              <div key={o.id} className={`option ${source === o.id ? "selected" : ""}`} onClick={() => setSource(o.id)}>
                <div className="option-icon">{o.icon}</div>
                <div>
                  <div className="option-title">{o.title}</div>
                  <div className="option-desc">{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" disabled={loading} onClick={handleFinish}>
            {loading ? "Saving..." : "Finish Setup →"}
          </button>
          <div className="back-link"><button onClick={() => setStep(3)}>← Back</button></div>
        </div>
      )}

      {/* STEP 5 — Done */}
      {step === 5 && (
        <div className="card">
          <div className="success-wrap">
            <span className="success-icon">🎉</span>
            <h1 className="success-title">You're all set{agencyName ? `, ${agencyName.split(" ")[0]}` : ""}!</h1>
            <p className="success-sub">Your LeadMagnet workspace is ready. Here's what to do next:</p>
            <div className="checklist">
              <div className="check-item done"><span className="check-green">✓</span> Account created</div>
              <div className="check-item done"><span className="check-green">✓</span> Workspace configured</div>
              <div className="check-item done"><span className="check-green">✓</span> 7-day free trial activated</div>
            </div>
            <div className="next-steps">
              {platforms.includes("gmail") && (
                <a href="/gmail" className="next-step-card">
                  <span style={{ fontSize: "1.1rem" }}>📧</span>
                  <div>
                    <div className="next-step-label">Connect Gmail</div>
                    <div className="next-step-desc">Set up email sequences for your leads</div>
                  </div>
                  <span className="next-step-arrow">→</span>
                </a>
              )}
              {platforms.includes("linkedin") && (
                <a href="/linkedin" className="next-step-card">
                  <span style={{ fontSize: "1.1rem" }}>💼</span>
                  <div>
                    <div className="next-step-label">Connect LinkedIn</div>
                    <div className="next-step-desc">Add your LinkedIn account to start capturing prospects</div>
                  </div>
                  <span className="next-step-arrow">→</span>
                </a>
              )}
              {platforms.includes("instagram") && (
                <a href="/instagram" className="next-step-card">
                  <span style={{ fontSize: "1.1rem" }}>📸</span>
                  <div>
                    <div className="next-step-label">Connect Instagram</div>
                    <div className="next-step-desc">Add your Instagram account for campaign tracking</div>
                  </div>
                  <span className="next-step-arrow">→</span>
                </a>
              )}
              <a href="/dashboard" className="next-step-card">
                <span style={{ fontSize: "1.1rem" }}>⚡</span>
                <div>
                  <div className="next-step-label">Go to Dashboard</div>
                  <div className="next-step-desc">Create your first campaign and start capturing leads</div>
                </div>
                <span className="next-step-arrow">→</span>
              </a>
            </div>
            <button className="btn-primary" onClick={() => window.location.href = "/dashboard"}>
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}