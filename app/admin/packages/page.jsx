"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  id: null,
  plan_key: "",
  name: "",
  display_price: "",
  period: "/ month",
  description: "",
  features: "",
  popular: false,
  active: true,
  sort_order: 1,
  stripe_price_id: "",
};

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

export default function AdminPackagesPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPlans = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }

      if (!res.ok) {
        setError(data.error || "Could not load packages.");
        setLoading(false);
        return;
      }

      setPlans(data.plans || []);
    } catch {
      setError("Could not load packages.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  const editPlan = (plan) => {
    setForm({
      id: plan.id,
      plan_key: plan.plan_key || "",
      name: plan.name || "",
      display_price: plan.display_price || "",
      period: plan.period || "/ month",
      description: plan.description || "",
      features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
      popular: Boolean(plan.popular),
      active: Boolean(plan.active),
      sort_order: Number(plan.sort_order || 1),
      stripe_price_id: plan.stripe_price_id || "",
    });

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const savePlan = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      features: form.features,
      sort_order: Number(form.sort_order || 1),
    };

    try {
      const res = await fetch("/api/admin/packages", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save package.");
        setSaving(false);
        return;
      }

      setSuccess(form.id ? "Package updated." : "Package created.");
      resetForm();
      await loadPlans();
    } catch {
      setError("Could not save package.");
    }

    setSaving(false);
  };

  const deletePlan = async (plan) => {
    const ok = window.confirm(`Delete ${plan.name}?`);
    if (!ok) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/packages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: plan.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not delete package.");
        return;
      }

      setSuccess("Package deleted.");
      await loadPlans();
    } catch {
      setError("Could not delete package.");
    }
  };

  return (
    <main className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');

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

        .top-link {
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
        }

        .container {
          width: 100%;
          max-width: 1180px;
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
          max-width: 760px;
        }

        .alert-error {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          color: #ef4444;
          font-size: 0.86rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .alert-success {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
          font-size: 0.86rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .layout {
          display: grid;
          grid-template-columns: 400px minmax(0, 1fr);
          gap: 1rem;
          align-items: start;
        }

        .card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
          overflow: hidden;
        }

        .card-head {
          padding: 1rem 1.1rem;
          border-bottom: 1px solid rgba(23,56,56,0.08);
        }

        .card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.03em;
        }

        .card-body {
          padding: 1.1rem;
        }

        .field {
          margin-bottom: 0.9rem;
        }

        .label {
          display: block;
          font-size: 0.76rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.38rem;
        }

        .input,
        .textarea {
          width: 100%;
          border: 1px solid rgba(23,56,56,0.10);
          background: #FBF3E3;
          color: #173838;
          border-radius: 13px;
          padding: 0.72rem 0.85rem;
          outline: none;
          font-size: 0.88rem;
          font-family: 'Inter', sans-serif;
        }

        .textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.5;
        }

        .input:focus,
        .textarea:focus {
          border-color: rgba(255,127,103,0.40);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
        }

        .hint {
          color: #819693;
          font-size: 0.75rem;
          line-height: 1.45;
          margin-top: 0.35rem;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .switch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 0;
          border-top: 1px solid rgba(23,56,56,0.08);
        }

        .switch-label {
          font-size: 0.84rem;
          font-weight: 900;
          color: #173838;
        }

        .checkbox {
          width: 20px;
          height: 20px;
          accent-color: #ff7f67;
        }

        .btn-row {
          display: flex;
          gap: 0.65rem;
          margin-top: 1rem;
        }

        .btn {
          border: 0;
          border-radius: 13px;
          min-height: 42px;
          padding: 0 1rem;
          cursor: pointer;
          font-size: 0.84rem;
          font-weight: 900;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .btn-primary {
          background: #ff7f67;
          color: #173838;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
          flex: 1;
        }

        .btn-secondary {
          background: #ffffff;
          color: #2f625d;
          border: 1px solid rgba(23,56,56,0.10);
        }

        .btn-danger {
          background: rgba(239,68,68,0.08);
          color: #ef4444;
          border: 1px solid rgba(239,68,68,0.18);
        }

        .btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .plan-list {
          display: grid;
          gap: 0.85rem;
        }

        .plan-card {
          padding: 1rem;
          border-bottom: 1px solid rgba(23,56,56,0.08);
        }

        .plan-card:last-child {
          border-bottom: 0;
        }

        .plan-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 0.65rem;
        }

        .plan-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #173838;
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .plan-key {
          color: #819693;
          font-size: 0.76rem;
          font-weight: 800;
          margin-top: 0.15rem;
        }

        .price {
          color: #ff7f67;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.35rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .desc {
          color: #5f7774;
          font-size: 0.84rem;
          line-height: 1.6;
          margin-bottom: 0.8rem;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.8rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          border-radius: 100px;
          padding: 0.28rem 0.58rem;
          font-size: 0.7rem;
          font-weight: 900;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          background: #FBF3E3;
        }

        .badge.green {
          color: #2f625d;
          background: rgba(143,200,193,0.18);
          border-color: rgba(143,200,193,0.34);
        }

        .badge.coral {
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border-color: rgba(255,127,103,0.20);
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
        }

        .feature {
          color: #5f7774;
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 999px;
          padding: 0.28rem 0.55rem;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .empty {
          padding: 1.25rem;
          color: #819693;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media(max-width: 980px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width: 640px) {
          .topbar {
            padding: 0 1rem;
          }

          .top-actions .top-link:nth-child(2) {
            display: none;
          }

          .container {
            padding: 1rem;
          }

          .row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="topbar">
        <BrandLogo />

        <div className="top-actions">
          <a href="/admin" className="top-link">Admin</a>
          <a href="/pricing" className="top-link">View Pricing</a>
        </div>
      </header>

      <div className="container">
        <div className="hero-card">
          <div className="kicker">Admin</div>
          <h1 className="title">Packages Manager</h1>
          <p className="subtitle">
            Add packages, edit prices, change features, hide inactive plans, and control the order shown on the website.
          </p>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <div className="layout">
          <form className="card" onSubmit={savePlan}>
            <div className="card-head">
              <div className="card-title">
                {form.id ? "Edit Package" : "Add New Package"}
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="field">
                  <label className="label">Package Key</label>
                  <input
                    className="input"
                    value={form.plan_key}
                    onChange={e => updateField("plan_key", e.target.value)}
                    placeholder="starter"
                  />
                  <div className="hint">Use lowercase, like starter, pro, agency, scale.</div>
                </div>

                <div className="field">
                  <label className="label">Package Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={e => updateField("name", e.target.value)}
                    placeholder="Starter"
                  />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">Price Display</label>
                  <input
                    className="input"
                    value={form.display_price}
                    onChange={e => updateField("display_price", e.target.value)}
                    placeholder="€49"
                  />
                </div>

                <div className="field">
                  <label className="label">Period</label>
                  <input
                    className="input"
                    value={form.period}
                    onChange={e => updateField("period", e.target.value)}
                    placeholder="/ month"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  value={form.description}
                  onChange={e => updateField("description", e.target.value)}
                  placeholder="For agencies starting with lead automation."
                />
              </div>

              <div className="field">
                <label className="label">Features</label>
                <textarea
                  className="textarea"
                  value={form.features}
                  onChange={e => updateField("features", e.target.value)}
                  placeholder={"1 workspace\n5 active campaigns\nLinkedIn automation"}
                />
                <div className="hint">Write one feature per line.</div>
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">Sort Order</label>
                  <input
                    className="input"
                    type="number"
                    value={form.sort_order}
                    onChange={e => updateField("sort_order", e.target.value)}
                    placeholder="1"
                  />
                </div>

                <div className="field">
                  <label className="label">Stripe Price ID</label>
                  <input
                    className="input"
                    value={form.stripe_price_id}
                    onChange={e => updateField("stripe_price_id", e.target.value)}
                    placeholder="price_..."
                  />
                  <div className="hint">Needed later if checkout should follow this package.</div>
                </div>
              </div>

              <div className="switch-row">
                <span className="switch-label">Popular package</span>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={form.popular}
                  onChange={e => updateField("popular", e.target.checked)}
                />
              </div>

              <div className="switch-row">
                <span className="switch-label">Active / visible</span>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={form.active}
                  onChange={e => updateField("active", e.target.checked)}
                />
              </div>

              <div className="btn-row">
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : form.id ? "Save Changes" : "Add Package"}
                </button>

                {form.id && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Current Packages</div>
            </div>

            {loading ? (
              <div className="empty">Loading packages...</div>
            ) : plans.length === 0 ? (
              <div className="empty">No packages found yet.</div>
            ) : (
              <div className="plan-list">
                {plans.map(plan => (
                  <div className="plan-card" key={plan.id}>
                    <div className="plan-top">
                      <div>
                        <div className="plan-name">{plan.name}</div>
                        <div className="plan-key">{plan.plan_key}</div>
                      </div>

                      <div className="price">
                        {plan.display_price}
                        <span style={{ color: "#819693", fontSize: "0.76rem", marginLeft: 4 }}>
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <p className="desc">{plan.description}</p>

                    <div className="badges">
                      <span className={`badge ${plan.active ? "green" : ""}`}>
                        {plan.active ? "Active" : "Hidden"}
                      </span>

                      {plan.popular && <span className="badge coral">Popular</span>}

                      <span className="badge">Order {plan.sort_order}</span>

                      {plan.stripe_price_id && <span className="badge">Stripe connected</span>}
                    </div>

                    <div className="features">
                      {(Array.isArray(plan.features) ? plan.features : []).slice(0, 8).map(feature => (
                        <span className="feature" key={feature}>{feature}</span>
                      ))}
                    </div>

                    <div className="actions">
                      <button className="btn btn-secondary" onClick={() => editPlan(plan)}>
                        Edit
                      </button>

                      <button className="btn btn-danger" onClick={() => deletePlan(plan)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}