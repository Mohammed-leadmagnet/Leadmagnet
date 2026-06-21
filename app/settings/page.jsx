"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Icon({ name }) {
  const common = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
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
    analytics: (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 3 3 5-7" />
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
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    clients: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10" />
        <path d="M7 12h6" />
        <path d="M7 16h8" />
      </svg>
    ),
    radar: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="m12 12 5-5" />
      </svg>
    ),
    blog: (
      <svg {...common}>
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
    settings: (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="m4.93 4.93 2.12 2.12" />
        <path d="m16.95 16.95 2.12 2.12" />
        <path d="m19.07 4.93-2.12 2.12" />
        <path d="m7.05 16.95-2.12 2.12" />
      </svg>
    ),
    billing: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    support: (
      <svg {...common}>
        <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    ),
    logout: (
      <svg {...common}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
    ),
  };

  return icons[name];
}

function BrandLogo() {
  return (
    <a href="/" className="logo">
      <span className="brand-mark" />
      <span className="brand-name">
        <span className="lead">lead</span>
        <span className="magnet">magnet</span> inc
      </span>
    </a>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="side-section">
        <div className="side-label">Main</div>

        <a className="side-item" href="/dashboard">
          <span className="side-icon"><Icon name="dashboard" /></span>
          Dashboard
        </a>

        <a className="side-item" href="/dashboard">
          <span className="side-icon"><Icon name="leads" /></span>
          All Leads
        </a>

        <a className="side-item" href="/dashboard">
          <span className="side-icon"><Icon name="analytics" /></span>
          Analytics
        </a>
      </div>

      <div className="side-section">
        <div className="side-label">Platforms</div>

        <a className="side-item" href="/linkedin">
          <span className="side-icon"><Icon name="linkedin" /></span>
          LinkedIn
        </a>

        <a className="side-item" href="/instagram">
          <span className="side-icon"><Icon name="instagram" /></span>
          Instagram
        </a>

        <a className="side-item" href="/gmail">
          <span className="side-icon"><Icon name="gmail" /></span>
          Gmail
        </a>
      </div>

      <div className="side-section">
        <div className="side-label">Agency</div>

        <a className="side-item" href="/agency">
          <span className="side-icon"><Icon name="clients" /></span>
          Client Manager
        </a>

        <a className="side-item" href="/agency/lead-radar">
          <span className="side-icon"><Icon name="radar" /></span>
          Lead Radar
        </a>
      </div>

      <div className="side-section">
        <div className="side-label">Resources</div>

        <a className="side-item" href="/blog">
          <span className="side-icon"><Icon name="blog" /></span>
          Blog
        </a>
      </div>

      <div className="side-section">
        <div className="side-label">Account</div>

        <a className="side-item active" href="/settings">
          <span className="side-icon"><Icon name="settings" /></span>
          Settings
        </a>

        <a className="side-item" href="/pricing">
          <span className="side-icon"><Icon name="billing" /></span>
          Billing
        </a>

        <a className="side-item" href="/contact">
          <span className="side-icon"><Icon name="support" /></span>
          Support
        </a>
      </div>
    </aside>
  );
}

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan,status,created_at")
        .eq("user_id", data.user.id)
        .maybeSingle();

      setSubscription(sub || null);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    setError("");
    setSuccess("");

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: "https://leadmagnetinc.com/reset-password",
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password reset email sent.");
  };

  const planName = subscription?.plan
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
    : "Free Trial";

  const statusName = subscription?.status
    ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)
    : "Trial";

  return (
    <main className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .page {
          min-height: 100vh;
          background: #FBF3E3;
          color: #173838;
          font-family: 'Inter', sans-serif;
        }

        .topbar {
          height: 72px;
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(23,56,56,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 10px 30px rgba(23,56,56,0.04);
        }

        .logo {
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
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.06rem;
          font-weight: 900;
          letter-spacing: -0.035em;
          color: #173838;
          line-height: 1;
        }

        .brand-name .lead { color: #ff7f67; }
        .brand-name .magnet { color: #8fc8c1; }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .top-link,
        .logout-btn {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          border-radius: 12px;
          min-height: 40px;
          padding: 0 1rem;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 900;
          cursor: pointer;
        }

        .logout-btn {
          border-color: rgba(239,68,68,0.18);
          color: #ef4444;
        }

        .app-layout {
          display: grid;
          grid-template-columns: 230px minmax(0, 1fr);
          min-height: calc(100vh - 72px);
        }

        .sidebar {
          background: rgba(255,255,255,0.72);
          border-right: 1px solid rgba(23,56,56,0.08);
          padding: 1.2rem 0.85rem;
        }

        .side-section {
          margin-bottom: 1.35rem;
        }

        .side-label {
          color: #819693;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0.55rem 0.5rem;
        }

        .side-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          min-height: 40px;
          border-radius: 12px;
          padding: 0 0.7rem;
          background: transparent;
          border: 1px solid transparent;
          color: #5f7774;
          text-decoration: none;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.86rem;
          margin-bottom: 0.25rem;
        }

        .side-item:hover,
        .side-item.active {
          background: rgba(255,127,103,0.12);
          color: #ff7f67;
          border-color: rgba(255,127,103,0.22);
        }

        .side-icon {
          width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: currentColor;
          flex: 0 0 auto;
        }

        .side-icon svg {
          width: 18px;
          height: 18px;
        }

        .content {
          padding: 2rem;
          overflow-x: hidden;
        }

        .content-inner {
          max-width: 980px;
          margin: 0 auto;
        }

        .hero-card,
        .settings-card,
        .info-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .hero-card {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border-radius: 26px;
          padding: 1.7rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
          margin-bottom: 1.25rem;
        }

        .page-kicker {
          display: inline-flex;
          align-items: center;
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          padding: 0.35rem 0.75rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.9rem;
        }

        .page-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.065em;
          line-height: 1.04;
          margin-bottom: 0.6rem;
        }

        .page-sub {
          font-size: 0.95rem;
          color: #5f7774;
          line-height: 1.65;
          max-width: 720px;
        }

        .success-bar {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
          font-size: 0.86rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .error-bar {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          color: #ef4444;
          font-size: 0.86rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .settings-card,
        .info-card {
          border-radius: 22px;
          padding: 1.35rem;
        }

        .card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(23,56,56,0.08);
          font-size: 0.86rem;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-key {
          color: #819693;
          font-weight: 800;
        }

        .info-val {
          color: #173838;
          font-weight: 900;
          text-align: right;
          word-break: break-word;
        }

        .btn {
          background: #ff7f67;
          color: #173838;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 0.84rem;
          padding: 0.72rem 1rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          width: 100%;
          margin-top: 0.5rem;
        }

        .btn-secondary {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #2f625d;
          box-shadow: none;
        }

        .btn-danger {
          background: #ffffff;
          border: 1px solid rgba(239,68,68,0.18);
          color: #ef4444;
          box-shadow: none;
        }

        .muted {
          color: #819693;
          font-size: 0.84rem;
          line-height: 1.6;
          margin-bottom: 0.8rem;
        }

        @media(max-width: 1000px) {
          .app-layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: flex;
            overflow-x: auto;
            gap: 0.8rem;
            padding: 0.8rem;
          }

          .side-section {
            min-width: 190px;
            margin-bottom: 0;
          }
        }

        @media(max-width: 760px) {
          .content {
            padding: 1rem;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .topbar {
            padding: 0 1rem;
          }

          .top-link {
            display: none;
          }
        }
      `}</style>

      <header className="topbar">
        <BrandLogo />

        <div className="top-actions">
          <a href="/dashboard" className="top-link">Dashboard</a>
          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="app-layout">
        <Sidebar />

        <section className="content">
          <div className="content-inner">
            {success && <div className="success-bar">{success}</div>}
            {error && <div className="error-bar">{error}</div>}

            <div className="hero-card">
              <div className="page-kicker">Account</div>
              <h1 className="page-title">Settings</h1>
              <p className="page-sub">
                Manage your account details, subscription, security, and quick links.
              </p>
            </div>

            {loading ? (
              <div className="settings-card">
                <div className="card-title">Loading settings...</div>
                <p className="muted">Please wait while we load your account information.</p>
              </div>
            ) : (
              <>
                <div className="grid">
                  <div className="settings-card">
                    <div className="card-title">Account Details</div>

                    <div className="info-row">
                      <span className="info-key">Email</span>
                      <span className="info-val">{user?.email || "—"}</span>
                    </div>

                    <div className="info-row">
                      <span className="info-key">User ID</span>
                      <span className="info-val">{user?.id?.slice(0, 8)}...</span>
                    </div>

                    <div className="info-row">
                      <span className="info-key">Member since</span>
                      <span className="info-val">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                      </span>
                    </div>

                    <button className="btn btn-secondary" onClick={handlePasswordReset}>
                      Send password reset email
                    </button>
                  </div>

                  <div className="settings-card">
                    <div className="card-title">Subscription</div>

                    <div className="info-row">
                      <span className="info-key">Plan</span>
                      <span className="info-val">{planName}</span>
                    </div>

                    <div className="info-row">
                      <span className="info-key">Status</span>
                      <span className="info-val">{statusName}</span>
                    </div>

                    <div className="info-row">
                      <span className="info-key">Billing</span>
                      <span className="info-val">Stripe</span>
                    </div>

                    <a href="/pricing" className="btn">
                      Manage billing
                    </a>
                  </div>
                </div>

                <div className="grid">
                  <div className="info-card">
                    <div className="card-title">Connected Tools</div>

                    <p className="muted">
                      Manage platform connections from their dedicated pages.
                    </p>

                    <a href="/linkedin" className="btn btn-secondary">LinkedIn settings</a>
                    <a href="/instagram" className="btn btn-secondary">Instagram settings</a>
                    <a href="/gmail" className="btn btn-secondary">Gmail settings</a>
                  </div>

                  <div className="info-card">
                    <div className="card-title">Support & Legal</div>

                    <p className="muted">
                      Need help or want to review the legal pages?
                    </p>

                    <a href="/contact" className="btn btn-secondary">Contact support</a>
                    <a href="/privacy" className="btn btn-secondary">Privacy policy</a>
                    <a href="/terms" className="btn btn-secondary">Terms of service</a>
                  </div>
                </div>

                <div className="settings-card">
                  <div className="card-title">Sign out</div>
                  <p className="muted">
                    Sign out from this browser. You can log back in anytime with your email.
                  </p>

                  <button className="btn btn-danger" onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}