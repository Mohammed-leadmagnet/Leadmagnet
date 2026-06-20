"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    agency: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10" />
        <path d="M7 12h6" />
        <path d="M7 16h8" />
      </svg>
    ),
    target: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
    linkedin: (
      <svg {...common}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    instagram: (
      <svg {...common}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
    gmail: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
    leads: (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    reports: (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </svg>
    ),
    check: (
      <svg {...common}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </svg>
    ),
    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    back: (
      <svg {...common}>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    ),
  };

  return icons[name] || null;
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [agencyName, setAgencyName] = useState("");
  const [clientCount, setClientCount] = useState("");
  const [source, setSource] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;
  const progress = step < 5 ? ((step - 1) / 4) * 100 : 100;

  useEffect(() => {
    document.title = "Get Started — LeadMagnet Inc";

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);
    });
  }, []);

  const togglePlatform = (platform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform)
        : [...prev, platform]
    );
  };

  const handleFinish = async () => {
    setLoading(true);

    if (user) {
      await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          agency_name: agencyName,
          client_count: clientCount,
          source,
          platforms,
          onboarded: true,
        },
        { onConflict: "user_id" }
      );
    }

    setLoading(false);
    setStep(5);
  };

  return (
    <main className="page-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .page-shell {
          min-height: 100vh;
          background: #FBF3E3;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          color: #173838;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(23,56,56,0.08);
          z-index: 20;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg,#ff7f67,#8fc8c1);
          transition: width 0.35s ease;
        }

        .top-logo {
          position: fixed;
          top: 1.5rem;
          left: 2rem;
          display: flex;
          align-items: center;
          gap: 0.62rem;
          text-decoration: none;
        }

        .brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: conic-gradient(from -12deg,#ff7f67 0 44%,transparent 44% 51%,#8fc8c1 51% 86%,transparent 86% 100%);
          position: relative;
          flex: 0 0 auto;
        }

        .brand-mark:after {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: #ffffff;
        }

        .brand-name {
          font-size: 1.06rem;
          font-weight: 900;
          letter-spacing: -0.035em;
          color: #173838;
          line-height: 1;
        }

        .brand-name .lead {
          color: #ff7f67;
        }

        .brand-name .magnet {
          color: #8fc8c1;
        }

        .step-counter {
          position: fixed;
          top: 1.75rem;
          right: 2rem;
          font-size: 0.78rem;
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(23,56,56,0.08);
          padding: 0.42rem 0.85rem;
          border-radius: 100px;
        }

        .card {
          width: 100%;
          max-width: 560px;
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 24px 60px rgba(23,56,56,0.10);
          border-radius: 24px;
          padding: 2.25rem;
        }

        .step-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #ff7f67;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 0.85rem;
        }

        .tag-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.22);
          color: #ff7f67;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .card-title {
          font-size: 1.75rem;
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.045em;
          margin-bottom: 0.45rem;
          line-height: 1.15;
        }

        .card-sub {
          font-size: 0.92rem;
          color: #5f7774;
          line-height: 1.65;
          margin-bottom: 1.65rem;
          font-family: 'Inter', sans-serif;
        }

        .form-label {
          display: block;
          font-size: 0.74rem;
          font-weight: 900;
          color: #2f625d;
          margin-bottom: 0.45rem;
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.04em;
        }

        .form-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          border-radius: 12px;
          color: #173838;
          font-size: 0.9rem;
          outline: none;
          font-family: 'Inter', sans-serif;
          padding: 0.85rem 1rem;
          margin-bottom: 1.15rem;
        }

        .form-input:focus {
          border-color: rgba(255,127,103,0.42);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
        }

        .form-input::placeholder {
          color: #819693;
        }

        .option-grid,
        .platform-grid {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1.45rem;
        }

        .option,
        .platform-opt {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 14px;
          padding: 0.95rem 1rem;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          box-shadow: 0 10px 24px rgba(23,56,56,0.03);
        }

        .option:hover,
        .platform-opt:hover {
          border-color: rgba(255,127,103,0.26);
          background: rgba(255,127,103,0.035);
        }

        .option.selected,
        .platform-opt.selected {
          border-color: rgba(255,127,103,0.36);
          background: rgba(255,127,103,0.08);
        }

        .option-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(143,200,193,0.16);
          border: 1px solid rgba(143,200,193,0.30);
          color: #2f625d;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .option-title {
          font-size: 0.9rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.15rem;
        }

        .option-desc {
          font-size: 0.76rem;
          color: #819693;
          line-height: 1.4;
          font-family: 'Inter', sans-serif;
        }

        .source-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 0.55rem;
          margin-bottom: 1.5rem;
        }

        .source-btn {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          border-radius: 11px;
          padding: 0.75rem 0.55rem;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
          font-size: 0.82rem;
          font-weight: 800;
          color: #5f7774;
          font-family: 'Inter', sans-serif;
        }

        .source-btn:hover {
          border-color: rgba(255,127,103,0.28);
          color: #173838;
          background: rgba(255,127,103,0.04);
        }

        .source-btn.selected {
          border-color: rgba(255,127,103,0.36);
          background: rgba(255,127,103,0.10);
          color: #ff7f67;
          font-weight: 900;
        }

        .platform-check {
          width: 22px;
          height: 22px;
          border-radius: 7px;
          border: 1.5px solid rgba(23,56,56,0.14);
          margin-left: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #2f625d;
          background: #ffffff;
        }

        .platform-opt.selected .platform-check {
          background: rgba(143,200,193,0.18);
          border-color: rgba(143,200,193,0.34);
        }

        .btn-primary {
          width: 100%;
          background: #ff7f67;
          color: #173838;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: 0.92rem;
          padding: 0.9rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 12px 24px rgba(255,127,103,0.24);
        }

        .btn-primary:hover {
          background: #ec6f5b;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        .back-link {
          text-align: center;
          margin-top: 0.9rem;
        }

        .back-link button {
          background: none;
          border: none;
          color: #5f7774;
          font-size: 0.82rem;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .back-link button:hover {
          color: #ff7f67;
        }

        .success-wrap {
          text-align: center;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.34);
          color: #2f625d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .success-title {
          font-size: 1.55rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.5rem;
          letter-spacing: -0.04em;
        }

        .success-sub {
          font-size: 0.9rem;
          color: #5f7774;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-family: 'Inter', sans-serif;
        }

        .checklist {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-bottom: 1.5rem;
          text-align: left;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 14px;
          padding: 1rem;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.84rem;
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
        }

        .check-green {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.34);
          color: #2f625d;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .next-steps {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1.5rem;
        }

        .next-step-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 14px;
          padding: 0.95rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
          text-align: left;
          box-shadow: 0 10px 24px rgba(23,56,56,0.03);
        }

        .next-step-card:hover {
          border-color: rgba(255,127,103,0.28);
          background: rgba(255,127,103,0.035);
        }

        .next-step-label {
          font-size: 0.86rem;
          font-weight: 900;
          color: #173838;
        }

        .next-step-desc {
          font-size: 0.74rem;
          color: #819693;
          margin-top: 0.1rem;
          line-height: 1.45;
          font-family: 'Inter', sans-serif;
        }

        .next-step-arrow {
          margin-left: auto;
          color: #ff7f67;
          display: flex;
          align-items: center;
        }

        @media(max-width:650px) {
          .page-shell {
            padding: 1rem;
          }

          .top-logo {
            position: static;
            margin-bottom: 1.25rem;
          }

          .step-counter {
            display: none;
          }

          .card {
            padding: 1.5rem;
            border-radius: 20px;
          }

          .source-grid {
            grid-template-columns: 1fr 1fr;
          }

          .card-title {
            font-size: 1.45rem;
          }
        }
      `}</style>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <a href="/" className="top-logo">
        <span className="brand-mark" />
        <span className="brand-name">
          <span className="lead">lead</span><span className="magnet">magnet</span> inc
        </span>
      </a>

      {step < 5 && <div className="step-counter">Step {step} of 4</div>}

      {step === 1 && (
        <div className="card">
          <div className="step-tag">
            <span className="tag-icon"><Icon name="agency" size={14} /></span>
            Workspace Setup
          </div>

          <h1 className="card-title">Welcome to LeadMagnet</h1>
          <p className="card-sub">Let’s set up your workspace so your dashboard matches the way you work.</p>

          <label className="form-label">Agency / Business Name</label>
          <input
            className="form-input"
            placeholder="e.g. Smith Marketing Agency"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            autoFocus
          />

          <label className="form-label">How many clients do you manage?</label>

          <div className="option-grid">
            {[
              { id: "1", label: "Just me / 1 client", desc: "Getting started with lead generation" },
              { id: "2-5", label: "2–5 clients", desc: "Small agency or freelancer" },
              { id: "6-15", label: "6–15 clients", desc: "Growing agency" },
              { id: "15+", label: "15+ clients", desc: "Full-scale agency" },
            ].map((item) => (
              <div
                key={item.id}
                className={`option ${clientCount === item.id ? "selected" : ""}`}
                onClick={() => setClientCount(item.id)}
              >
                <div className="option-icon"><Icon name="agency" /></div>
                <div>
                  <div className="option-title">{item.label}</div>
                  <div className="option-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            disabled={!agencyName.trim() || !clientCount}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <div className="step-tag">
            <span className="tag-icon"><Icon name="target" size={14} /></span>
            Discovery
          </div>

          <h1 className="card-title">Where did you find us?</h1>
          <p className="card-sub">This helps us understand how agencies discover LeadMagnet.</p>

          <div className="source-grid">
            {["Google", "LinkedIn", "YouTube", "Instagram", "ChatGPT", "Claude", "A friend", "Twitter / X", "Other"].map((item) => (
              <button
                key={item}
                type="button"
                className={`source-btn ${source === item ? "selected" : ""}`}
                onClick={() => setSource(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="btn-primary" disabled={!source} onClick={() => setStep(3)}>
            Continue
          </button>

          <div className="back-link">
            <button type="button" onClick={() => setStep(1)}>
              <Icon name="back" size={14} />
              Back
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <div className="step-tag">
            <span className="tag-icon"><Icon name="linkedin" size={14} /></span>
            Platforms
          </div>

          <h1 className="card-title">Which platforms do you want to use?</h1>
          <p className="card-sub">Select all that apply. You can connect them after setup.</p>

          <div className="platform-grid">
            {[
              { id: "linkedin", icon: "linkedin", title: "LinkedIn", desc: "Capture engaged prospects from LinkedIn campaigns" },
              { id: "instagram", icon: "instagram", title: "Instagram", desc: "Capture engaged prospects from Instagram campaigns" },
              { id: "gmail", icon: "gmail", title: "Gmail", desc: "Send automated follow-up email sequences" },
            ].map((item) => (
              <div
                key={item.id}
                className={`platform-opt ${platforms.includes(item.id) ? "selected" : ""}`}
                onClick={() => togglePlatform(item.id)}
              >
                <div className="option-icon"><Icon name={item.icon} /></div>

                <div>
                  <div className="option-title">{item.title}</div>
                  <div className="option-desc">{item.desc}</div>
                </div>

                <div className="platform-check">
                  {platforms.includes(item.id) && <Icon name="check" size={13} />}
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary" disabled={platforms.length === 0} onClick={() => setStep(4)}>
            Continue
          </button>

          <div className="back-link">
            <button type="button" onClick={() => setStep(2)}>
              <Icon name="back" size={14} />
              Back
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card">
          <div className="step-tag">
            <span className="tag-icon"><Icon name="target" size={14} /></span>
            First Goal
          </div>

          <h1 className="card-title">What is your first goal?</h1>
          <p className="card-sub">This helps us guide you to the right part of the product first.</p>

          <div className="option-grid">
            {[
              { id: "capture", icon: "leads", title: "Capture leads from campaigns", desc: "Start collecting prospects who engage with my content" },
              { id: "followup", icon: "gmail", title: "Automate Gmail follow-ups", desc: "Set up email sequences that send to leads" },
              { id: "clients", icon: "agency", title: "Manage client campaigns", desc: "Set up workspaces for multiple clients" },
              { id: "reports", icon: "reports", title: "Send reports to clients", desc: "Automate performance reporting" },
            ].map((item) => (
              <div
                key={item.id}
                className={`option ${goal === item.id ? "selected" : ""}`}
                onClick={() => setGoal(item.id)}
              >
                <div className="option-icon"><Icon name={item.icon} /></div>

                <div>
                  <div className="option-title">{item.title}</div>
                  <div className="option-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary" disabled={loading || !goal} onClick={handleFinish}>
            {loading ? "Saving..." : "Finish Setup"}
          </button>

          <div className="back-link">
            <button type="button" onClick={() => setStep(3)}>
              <Icon name="back" size={14} />
              Back
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="card">
          <div className="success-wrap">
            <div className="success-icon">
              <Icon name="check" size={28} />
            </div>

            <h1 className="success-title">
              You’re all set{agencyName ? `, ${agencyName.split(" ")[0]}` : ""}
            </h1>

            <p className="success-sub">
              Your LeadMagnet workspace is ready. Choose your next step below.
            </p>

            <div className="checklist">
              <div className="check-item">
                <span className="check-green"><Icon name="check" size={12} /></span>
                Account created
              </div>
              <div className="check-item">
                <span className="check-green"><Icon name="check" size={12} /></span>
                Workspace configured
              </div>
              <div className="check-item">
                <span className="check-green"><Icon name="check" size={12} /></span>
                7-day free trial activated
              </div>
            </div>

            <div className="next-steps">
              {platforms.includes("gmail") && (
                <a href="/gmail" className="next-step-card">
                  <div className="option-icon"><Icon name="gmail" /></div>
                  <div>
                    <div className="next-step-label">Connect Gmail</div>
                    <div className="next-step-desc">Set up email sequences for your leads</div>
                  </div>
                  <span className="next-step-arrow"><Icon name="arrow" size={15} /></span>
                </a>
              )}

              {platforms.includes("linkedin") && (
                <a href="/linkedin" className="next-step-card">
                  <div className="option-icon"><Icon name="linkedin" /></div>
                  <div>
                    <div className="next-step-label">Connect LinkedIn</div>
                    <div className="next-step-desc">Add your LinkedIn account to start capturing prospects</div>
                  </div>
                  <span className="next-step-arrow"><Icon name="arrow" size={15} /></span>
                </a>
              )}

              {platforms.includes("instagram") && (
                <a href="/instagram" className="next-step-card">
                  <div className="option-icon"><Icon name="instagram" /></div>
                  <div>
                    <div className="next-step-label">Connect Instagram</div>
                    <div className="next-step-desc">Add your Instagram account for campaign tracking</div>
                  </div>
                  <span className="next-step-arrow"><Icon name="arrow" size={15} /></span>
                </a>
              )}

              <a href="/dashboard" className="next-step-card">
                <div className="option-icon"><Icon name="dashboard" /></div>
                <div>
                  <div className="next-step-label">Go to Dashboard</div>
                  <div className="next-step-desc">Create your first campaign and start capturing leads</div>
                </div>
                <span className="next-step-arrow"><Icon name="arrow" size={15} /></span>
              </a>
            </div>

            <button className="btn-primary" onClick={() => window.location.href = "/dashboard"}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </main>
  );
}