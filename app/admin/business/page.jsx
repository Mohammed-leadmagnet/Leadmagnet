"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  id: null,
  name: "",
  amount_eur: "",
  start_month: new Date().toISOString().slice(0, 10),
  duration_months: "1",
  is_forever: false,
  notes: "",
  active: true,
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

export default function AdminBusinessPage() {
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formatEuro = value => {
    const number = Number(value || 0);

    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = value => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/business");
      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }

      if (!res.ok) {
        setError(data.error || "Could not load business dashboard.");
        setLoading(false);
        return;
      }

      setDashboard(data);
    } catch {
      setError("Could not load business dashboard.");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  const editExpense = expense => {
    setForm({
      id: expense.id,
      name: expense.name || "",
      amount_eur: String(expense.amount_eur || ""),
      start_month: expense.start_month || new Date().toISOString().slice(0, 10),
      duration_months: String(expense.duration_months || "1"),
      is_forever: Boolean(expense.is_forever),
      notes: expense.notes || "",
      active: Boolean(expense.active),
    });

    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveExpense = async e => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        amount_eur: Number(form.amount_eur || 0),
        duration_months: form.is_forever ? null : Number(form.duration_months || 1),
      };

      const res = await fetch("/api/admin/business", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save expense.");
        setSaving(false);
        return;
      }

      setSuccess(form.id ? "Expense updated." : "Expense added.");
      resetForm();
      await loadDashboard();
    } catch {
      setError("Could not save expense.");
    }

    setSaving(false);
  };

  const deleteExpense = async expense => {
    const ok = window.confirm(`Delete ${expense.name}?`);
    if (!ok) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/business", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: expense.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not delete expense.");
        return;
      }

      setSuccess("Expense deleted.");
      await loadDashboard();
    } catch {
      setError("Could not delete expense.");
    }
  };

  const stats = dashboard?.stats || {
    monthly_revenue: 0,
    monthly_expenses: 0,
    net_monthly: 0,
    paid_people_count: 0,
    active_expenses_count: 0,
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
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
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
          white-space: nowrap;
        }

        .btn-primary {
          background: #ff7f67;
          color: #173838;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
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
          font-size: 1.6rem;
          font-weight: 900;
          letter-spacing: -0.05em;
        }

        .stat-value.good {
          color: #2f625d;
        }

        .stat-value.bad {
          color: #ef4444;
        }

        .layout {
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 1rem;
          align-items: start;
        }

        .card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .card-head {
          padding: 1rem 1.1rem;
          border-bottom: 1px solid rgba(23,56,56,0.08);
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
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
          min-height: 90px;
          resize: vertical;
          line-height: 1.5;
        }

        .input:focus,
        .textarea:focus {
          border-color: rgba(255,127,103,0.40);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
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

        .expense-list {
          display: grid;
        }

        .expense-item {
          padding: 1rem;
          border-bottom: 1px solid rgba(23,56,56,0.08);
        }

        .expense-item:last-child {
          border-bottom: 0;
        }

        .expense-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.55rem;
        }

        .expense-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          color: #173838;
          font-size: 1rem;
        }

        .expense-amount {
          color: #ff7f67;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 1.2rem;
          white-space: nowrap;
        }

        .meta {
          color: #819693;
          font-size: 0.78rem;
          font-weight: 700;
          line-height: 1.55;
          margin-bottom: 0.7rem;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
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

        .actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .table-wrap {
          overflow-x: auto;
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
          padding: 0.85rem 1rem;
          border-bottom: 1px solid rgba(23,56,56,0.08);
        }

        .table td {
          color: #173838;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid rgba(23,56,56,0.06);
        }

        .table tr:last-child td {
          border-bottom: none;
        }

        .empty {
          padding: 1.25rem;
          color: #819693;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        @media(max-width: 1050px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .layout {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width: 650px) {
          .topbar {
            padding: 0 1rem;
          }

          .container {
            padding: 1rem;
          }

          .hero-card {
            flex-direction: column;
          }

          .row {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="topbar">
        <BrandLogo />

        <div className="top-actions">
          <a href="/admin" className="top-link">Admin</a>
          <a href="/admin/packages" className="top-link">Packages</a>
          <a href="/pricing" className="top-link">Pricing</a>
        </div>
      </header>

      <div className="container">
        <div className="hero-card">
          <div>
            <div className="kicker">Admin</div>
            <h1 className="title">Business Expenses</h1>
            <p className="subtitle">
              Track company expenses, monthly recurring costs, customer payments, revenue, and estimated monthly profit.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add Expense
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        {loading ? (
          <div className="card">
            <div className="empty">Loading business dashboard...</div>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Monthly Revenue</div>
                <div className="stat-value good">{formatEuro(stats.monthly_revenue)}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Monthly Expenses</div>
                <div className="stat-value bad">{formatEuro(stats.monthly_expenses)}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Net Monthly</div>
                <div className={`stat-value ${stats.net_monthly >= 0 ? "good" : "bad"}`}>
                  {formatEuro(stats.net_monthly)}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Paid People</div>
                <div className="stat-value">{stats.paid_people_count}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Active Expenses</div>
                <div className="stat-value">{stats.active_expenses_count}</div>
              </div>
            </div>

            {showForm && (
              <form className="card" onSubmit={saveExpense}>
                <div className="card-head">
                  <div className="card-title">
                    {form.id ? "Edit Expense" : "Add New Expense"}
                  </div>

                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>

                <div className="card-body">
                  <div className="row">
                    <div className="field">
                      <label className="label">Expense Name</label>
                      <input
                        className="input"
                        value={form.name}
                        onChange={e => updateField("name", e.target.value)}
                        placeholder="Vercel, Supabase, Domain..."
                      />
                    </div>

                    <div className="field">
                      <label className="label">Amount in EUR</label>
                      <input
                        className="input"
                        type="number"
                        step="0.01"
                        value={form.amount_eur}
                        onChange={e => updateField("amount_eur", e.target.value)}
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="field">
                      <label className="label">Start Month</label>
                      <input
                        className="input"
                        type="date"
                        value={form.start_month}
                        onChange={e => updateField("start_month", e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <label className="label">Duration in Months</label>
                      <input
                        className="input"
                        type="number"
                        min="1"
                        disabled={form.is_forever}
                        value={form.duration_months}
                        onChange={e => updateField("duration_months", e.target.value)}
                        placeholder="12"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Notes</label>
                    <textarea
                      className="textarea"
                      value={form.notes}
                      onChange={e => updateField("notes", e.target.value)}
                      placeholder="Optional notes..."
                    />
                  </div>

                  <div className="switch-row">
                    <span className="switch-label">Forever expense</span>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={form.is_forever}
                      onChange={e => updateField("is_forever", e.target.checked)}
                    />
                  </div>

                  <div className="switch-row">
                    <span className="switch-label">Active</span>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={form.active}
                      onChange={e => updateField("active", e.target.checked)}
                    />
                  </div>

                  <div className="btn-row">
                    <button className="btn btn-primary" disabled={saving}>
                      {saving ? "Saving..." : form.id ? "Save Changes" : "Add Expense"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="layout">
              <div>
                <div className="card">
                  <div className="card-head">
                    <div className="card-title">All Expenses</div>
                  </div>

                  {(dashboard?.expenses || []).length === 0 ? (
                    <div className="empty">No expenses added yet.</div>
                  ) : (
                    <div className="expense-list">
                      {dashboard.expenses.map(expense => (
                        <div className="expense-item" key={expense.id}>
                          <div className="expense-top">
                            <div>
                              <div className="expense-name">{expense.name}</div>
                              <div className="meta">
                                Starts {formatDate(expense.start_month)}
                                {expense.is_forever
                                  ? " · Forever"
                                  : ` · ${expense.duration_months} month(s)`}
                              </div>
                            </div>

                            <div className="expense-amount">
                              {formatEuro(expense.amount_eur)}
                            </div>
                          </div>

                          <div className="badges">
                            <span className={`badge ${expense.active ? "green" : ""}`}>
                              {expense.active ? "Active" : "Inactive"}
                            </span>

                            {expense.is_forever && <span className="badge coral">Forever</span>}
                          </div>

                          {expense.notes && <div className="meta">{expense.notes}</div>}

                          <div className="actions">
                            <button className="btn btn-secondary" onClick={() => editExpense(expense)}>
                              Edit
                            </button>

                            <button className="btn btn-danger" onClick={() => deleteExpense(expense)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="card">
                  <div className="card-head">
                    <div className="card-title">People Who Paid</div>
                  </div>

                  {(dashboard?.paidPeople || []).length === 0 ? (
                    <div className="empty">No paid subscriptions found yet.</div>
                  ) : (
                    <div className="table-wrap">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {dashboard.paidPeople.map(person => (
                            <tr key={person.id}>
                              <td>{person.email}</td>
                              <td>{person.plan_name}</td>
                              <td>{formatEuro(person.amount_eur)}</td>
                              <td>{person.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="card">
                  <div className="card-head">
                    <div className="card-title">Active This Month</div>
                  </div>

                  {(dashboard?.activeExpenses || []).length === 0 ? (
                    <div className="empty">No active expenses this month.</div>
                  ) : (
                    <div className="table-wrap">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Expense</th>
                            <th>Amount</th>
                          </tr>
                        </thead>

                        <tbody>
                          {dashboard.activeExpenses.map(expense => (
                            <tr key={expense.id}>
                              <td>{expense.name}</td>
                              <td>{formatEuro(expense.amount_eur)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}