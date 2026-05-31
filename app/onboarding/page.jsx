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
  const [source, setSource] = useState("");
  const [goal, setGoal] = useState("");
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/login"; return; }
      setUser(data.user);
    });
  }, []);

  const togglePlatform = (p) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const totalSteps = 4;

  return (
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#22c97a;letter-spacing:-0.02em;position:fixed;top:1.5rem;left:2rem;}
        .progress-bar{position:fixed;top:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.06);}
        .progress-fill{height:100%;background:#22c97a;transition:width 0.4s ease;}
        .card{background:#0f1a11;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:2.5rem;width:100%;max-width:560px;}
        .step-tag{font-size:0.68rem;font-weight:600;color:#3d5240;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1.25rem;}
        .card-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.625rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.03em;margin-bottom:0.5rem;line-height:1.15;}
        .card-sub{font-size:0.9rem;color:#3d5240;margin-bottom:2rem;line-height:1.6;}
        .option-grid{display:flex;flex-direction:column;gap:0.75rem;margin-bottom:2rem;}
        .option{background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1rem 1.25rem;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:1rem;}
        .option:hover{border-color:rgba(34,201,122,0.3);background:#0b120d;}
        .option.selected{border-color:rgba(34,201,122,0.5);background:rgba(34,201,122,0.06);}
        .option-icon{font-size:1.25rem;flex-shrink:0;}
        .option-title{font-size:0.9rem;font-weight:600;color:#c4d4c8;margin-bottom:0.1rem;}
        .option-desc{font-size:0.775rem;color:#3d5240;font-weight:400;}
        .source-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.625rem;margin-bottom:2rem;}
        .source-btn{background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.875rem 0.5rem;cursor:pointer;transition:all 0.15s;text-align:center;font-size:0.845rem;font-weight:500;color:#6b7f70;font-family:'Inter',sans-serif;}
        .source-btn:hover{border-color:rgba(34,201,122,0.3);color:#c4d4c8;}
        .source-btn.selected{border-color:rgba(34,201,122,0.5);background:rgba(34,201,122,0.06);color:#22c97a;font-weight:600;}
        .platform-grid{display:flex;flex-direction:column;gap:0.625rem;margin-bottom:2rem;}
        .platform-opt{background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1rem 1.25rem;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:1rem;}
        .platform-opt:hover{border-color:rgba(34,201,122,0.3);}
        .platform-opt.selected{border-color:rgba(34,201,122,0.5);background:rgba(34,201,122,0.06);}
        .platform-check{width:20px;height:20px;border-radius:5px;border:1.5px solid rgba(255,255,255,0.12);margin-left:auto;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;font-size:0.75rem;font-weight:700;}
        .platform-opt.selected .platform-check{background:#22c97a;border-color:#22c97a;color:#071209;}
        .btn-primary{width:100%;background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.925rem;padding:0.875rem;border-radius:11px;border:none;cursor:pointer;transition:all 0.15s;letter-spacing:-0.01em;}
        .btn-primary:hover{background:#1db36c;transform:translateY(-1px);}
        .btn-primary:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
        .success-wrap{text-align:center;padding:1rem 0;}
        .success-icon{font-size:3.5rem;margin-bottom:1.25rem;display:block;}
        .success-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.5rem;font-weight:800;color:#f0f7f2;margin-bottom:0.5rem;letter-spacing:-0.03em;}
        .success-sub{font-size:0.9rem;color:#3d5240;margin-bottom:2rem;line-height:1.6;}
        .checklist{display:flex;flex-direction:column;gap:0.5rem;margin-bottom:2rem;text-align:left;background:#080c09;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:1.25rem;}
        .check-item{display:flex;align-items:center;gap:0.625rem;font-size:0.855rem;color:#4d6b54;}
        .check-green{color:#22c97a;font-weight:700;}
        .back-link{text-align:center;margin-top:0.875rem;}
        .back-link button{background:none;border:none;color:#2a3d2e;font-size:0.815rem;cursor:pointer;font-family:'Inter',sans-serif;}
        .back-link button:hover{color:#4d6b54;}
      `}</style>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
      </div>

      <div className="logo">⚡ LeadMagnet</div>

      {/* STEP 1 — What brought you here */}
      {step === 1 && (
        <div className="card">
          <div className="step-tag">Step 1 of 4 · Welcome</div>
          <h1 className="card-title">Welcome to LeadMagnet! 👋</h1>
          <p className="card-sub">What brought you here today?</p>
          <div className="option-grid">
            {[
              { id: "returning", icon: "🔄", title: "I had an account before", desc: "Welcome back! Let's get you set up again." },
              { id: "referral", icon: "🤝", title: "Someone referred me", desc: "A friend, colleague, or agency recommended LeadMagnet." },
              { id: "self", icon: "🔍", title: "I found it myself", desc: "Search, social media, or an AI tool led me here." },
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
          <button className="btn-primary" disabled={!source} onClick={() => setStep(2)}>Continue →</button>
        </div>
      )}

      {/* STEP 2 — Where did you find us */}
      {step === 2 && (
        <div className="card">
          <div className="step-tag">Step 2 of 4 · Discovery</div>
          <h1 className="card-title">Where did you find us?</h1>
          <p className="card-sub">This helps us understand how to reach more people like you.</p>
          <div className="source-grid">
            {["Google", "LinkedIn", "YouTube", "Instagram", "ChatGPT", "Claude", "A friend", "Twitter / X", "Other"].map(s => (
              <button key={s} className={`source-btn ${goal === s ? "selected" : ""}`} onClick={() => setGoal(s)}>{s}</button>
            ))}
          </div>
          <button className="btn-primary" disabled={!goal} onClick={() => setStep(3)}>Continue →</button>
          <div className="back-link"><button onClick={() => setStep(1)}>← Back</button></div>
        </div>
      )}

      {/* STEP 3 — Platforms */}
      {step === 3 && (
        <div className="card">
          <div className="step-tag">Step 3 of 4 · Platforms</div>
          <h1 className="card-title">Which platforms do you use?</h1>
          <p className="card-sub">Select all that apply. You can connect them from your dashboard anytime.</p>
          <div className="platform-grid">
            {[
              { id: "linkedin", icon: "💼", title: "LinkedIn", desc: "Auto-DM commenters on your posts" },
              { id: "instagram", icon: "📸", title: "Instagram", desc: "Auto-DM commenters on your reels & posts" },
              { id: "gmail", icon: "📧", title: "Gmail", desc: "Send automated email follow-up sequences" },
            ].map(p => (
              <div key={p.id} className={`platform-opt ${platforms.includes(p.id) ? "selected" : ""}`} onClick={() => togglePlatform(p.id)}>
                <span style={{ fontSize: "1.25rem" }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#c4d4c8", marginBottom: "0.1rem" }}>{p.title}</div>
                  <div style={{ fontSize: "0.775rem", color: "#3d5240" }}>{p.desc}</div>
                </div>
                <div className="platform-check">{platforms.includes(p.id) ? "✓" : ""}</div>
              </div>
            ))}
          </div>
          <button className="btn-primary" disabled={platforms.length === 0} onClick={() => setStep(4)}>Continue →</button>
          <div className="back-link"><button onClick={() => setStep(2)}>← Back</button></div>
        </div>
      )}

      {/* STEP 4 — Done */}
      {step === 4 && (
        <div className="card">
          <div className="success-wrap">
            <span className="success-icon">🎉</span>
            <h1 className="success-title">You're all set!</h1>
            <p className="success-sub">Your LeadMagnet account is ready. Head to your dashboard to connect your platforms and create your first campaign.</p>
            <div className="checklist">
              <div className="check-item"><span className="check-green">✓</span> Account created successfully</div>
              <div className="check-item"><span className="check-green">✓</span> Platform preferences saved</div>
              <div className="check-item"><span className="check-green">✓</span> 7-day free trial activated</div>
              <div className="check-item" style={{ color: "#2a3d2e" }}>○ Connect LinkedIn, Instagram or Gmail</div>
              <div className="check-item" style={{ color: "#2a3d2e" }}>○ Create your first campaign</div>
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