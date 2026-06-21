"use client";

import { useEffect, useState } from "react";

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

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loadAdmin = async () => {
    setChecking(true);

    try {
      const res = await fetch("/api/admin/overview");

      if (res.status === 401) {
        setAuthorized(false);
        setDashboard(null);
        setChecking(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not load admin dashboard.");
        setAuthorized(false);
        setChecking(false);
        return;
      }

      setDashboard(data);
      setAuthorized(true);
    } catch {
      setAuthorized(false);
    }

    setChecking(false);
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid admin login.");
        setLoading(false);
        return;
      }

      setUsername("");
      setPassword("");
      await loadAdmin();
    } catch {
      setError("Could not log in.");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthorized(false);
    setDashboard(null);
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
  };

  return (
    <main className="admin-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .admin-page {
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

        .container {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
        }

        .hero-card {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 26px;
          padding: 1.7rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
          margin-bottom: 1.25rem;
        }

        .kicker {
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

        .title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.065em;
          line-height: 1.04;
          margin-bottom: 0.6rem;
        }

        .subtitle {
          color: #5f7774;
          font-size: 0.95rem;
          line-height: 1.65;
          max-width: 720px;
        }

        .login-wrap {
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 26px;
          padding: 1.5rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.10);
        }

        .login-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #173838;
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          margin-bottom: 0.4rem;
        }

        .login-sub {
          color: #5f7774;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.2rem;
        }

        .field {
          margin-bottom: 0.9rem;
        }

        .label {
          display: block;
          color: #173838;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 0.4rem;
        }

        .input {
          width: 100%;
          border: 1px solid rgba(23,56,56,0.10);
          background: #FBF3E3;
          color: #173838;
          border-radius: 14px;
          min-height: 46px;
          padding: 0 0.9rem;
          outline: none;
          font-size: 0.92rem;
          font-family: 'Inter', sans-serif;
        }

        .input:focus {
          border-color: rgba(255,127,103,0.40);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
        }

        .btn {
          width: 100%;
          background: #ff7f67;
          color: #173838;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 0.9rem;
          min-height: 46px;
          padding: 0 1rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
        }

        .btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .error {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          color: #ef4444;
          font-size: 0.84rem;
          padding: 0.8rem 0.9rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 0.85rem;
          margin-bottom: 1rem;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 18px;
          padding: 1rem;
          box-shadow: 0 14px 28px rgba(23,56,56,0.04);
        }

        .stat-label {
          color: #819693;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.45rem;
        }

        .stat-value {
          color: #173838;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.7rem;
          font-weight: 900;
          letter-spacing: -0.05em;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .panel {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .panel-head {
          padding: 1rem 1.1rem;
          border-bottom: 1px solid rgba(23,56,56,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .panel-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.03em;
        }

        .panel-tag {
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          padding: 0.25rem 0.55rem;
          border-radius: 100px;
          font-size: 0.68rem;
          font-weight: 900;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          color: #819693;
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-align: left;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(23,56,56,0.08);
        }

        .table td {
          color: #173838;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(23,56,56,0.06);
          vertical-align: top;
        }

        .table tr:last-child td {
          border-bottom: none;
        }

        .muted {
          color: #819693;
          font-weight: 700;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          border-radius: 100px;
          padding: 0.25rem 0.55rem;
          background: rgba(143,200,193,0.18);
          color: #2f625d;
          border: 1px solid rgba(143,200,193,0.34);
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: capitalize;
        }

        @media(max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width: 700px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
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
          {authorized && (
            <button className="logout-btn" onClick={handleLogout}>
              Admin logout
            </button>
          )}
        </div>
      </header>

      {checking ? (
        <div className="login-wrap">
          <div className="login-card">
            <div className="login-title">Checking admin session...</div>
            <p className="login-sub">Please wait.</p>
          </div>
        </div>
      ) : !authorized ? (
        <div className="login-wrap">
          <form className="login-card" onSubmit={handleLogin}>
            <div className="login-title">Admin Login</div>
            <p className="login-sub">
              Enter your admin credentials to access the internal dashboard.
            </p>

            {error && <div className="error">{error}</div>}

            <div className="field">
              <label className="label">Admin email</label>
              <input
                className="input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin@leadmagnetinc.com"
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label className="label">Password</label>
              <input
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                type="password"
                autoComplete="current-password"
              />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      ) : (
        <div className="container">
          <div className="hero-card">
            <div className="kicker">Internal</div>
            <h1 className="title">Admin Dashboard</h1>
            <p className="subtitle">
              Monitor users, campaigns, leads, clients, subscriptions, and recent platform activity.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Users</div>
              <div className="stat-value">{dashboard?.stats?.users || 0}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Campaigns</div>
              <div className="stat-value">{dashboard?.stats?.campaigns || 0}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Leads</div>
              <div className="stat-value">{dashboard?.stats?.leads || 0}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Clients</div>
              <div className="stat-value">{dashboard?.stats?.clients || 0}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Sequences</div>
              <div className="stat-value">{dashboard?.stats?.sequences || 0}</div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Subscriptions</div>
              <div className="stat-value">{dashboard?.stats?.subscriptions || 0}</div>
            </div>
          </div>

          <div className="grid">
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Recent Users</div>
                <div className="panel-tag">Auth</div>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Last Login</th>
                  </tr>
                </thead>

                <tbody>
                  {(dashboard?.recentUsers || []).map(user => (
                    <tr key={user.id}>
                      <td>{user.email || "—"}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td className="muted">{formatDate(user.last_sign_in_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">Recent Subscriptions</div>
                <div className="panel-tag">Stripe</div>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {(dashboard?.recentSubscriptions || []).map(sub => (
                    <tr key={sub.id}>
                      <td>{sub.plan || "—"}</td>
                      <td><span className="pill">{sub.status || "—"}</span></td>
                      <td className="muted">{formatDate(sub.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel" style={{ gridColumn: "1 / -1" }}>
              <div className="panel-head">
                <div className="panel-title">Recent Campaigns</div>
                <div className="panel-tag">Campaigns</div>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Status</th>
                    <th>Post URL</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {(dashboard?.recentCampaigns || []).map(campaign => (
                    <tr key={campaign.id}>
                      <td>{campaign.platform || "linkedin"}</td>
                      <td><span className="pill">{campaign.status || "—"}</span></td>
                      <td className="muted">
                        {campaign.post_url
                          ? campaign.post_url.slice(0, 70) + "..."
                          : "—"}
                      </td>
                      <td className="muted">{formatDate(campaign.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}