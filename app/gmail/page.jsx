"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import AppNavigator from "@/app/components/AppNavigator";

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
    plus: (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
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

        <a className="side-item active" href="/gmail">
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

        <a className="side-item" href="/settings">
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
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);

      const params = new URLSearchParams(window.location.search);

      if (params.get("connected") === "true") {
        await supabase.from("gmail_accounts").upsert(
          {
            user_id: data.user.id,
            email: data.user.email,
          },
          { onConflict: "user_id" }
        );

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

  const handleConnect = () => {
    window.location.href = "https://leadmagnetinc.com/api/auth/google";
  };

  const handleDisconnect = async () => {
    if (!user) return;

    await supabase
      .from("gmail_accounts")
      .delete()
      .eq("user_id", user.id);

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
        .insert({
          user_id: user.id,
          name: seqName,
          emails: seqEmails,
          status: "Active",
          send_frequency: seqFrequency,
        })
        .select()
        .single();

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
    setSeqEmails(prev =>
      prev.map((email, i) => i === index ? { ...email, [field]: value } : email)
    );
  };

  const removeEmail = (index) => {
    setSeqEmails(prev => prev.filter((_, i) => i !== index));
  };

  const deleteSequence = async (id) => {
    await supabase
      .from("email_sequences")
      .delete()
      .eq("id", id);

    setSequences(prev => prev.filter(s => s.id !== id));
  };

  const getFrequencyLabel = (val) =>
    FREQUENCIES.find(f => f.value === val)?.label || val;

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

        .top-link:hover {
          color: #ff7f67;
          border-color: rgba(255,127,103,0.28);
          background: rgba(255,127,103,0.06);
        }

        .app-layout {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          min-height: 100vh;
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
          max-width: 1180px;
          margin: 0 auto;
        }

        .hero-card,
        .connect-card,
        .seq-card,
        .empty-state,
        .modal,
        .email-step {
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
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.25rem;
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
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .connect-card {
          max-width: 660px;
          border-radius: 24px;
          padding: 1.7rem;
        }

        .connect-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.8rem;
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.055em;
          margin-bottom: 0.55rem;
        }

        .connect-sub {
          color: #5f7774;
          line-height: 1.65;
          font-size: 0.94rem;
          margin-bottom: 1.5rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .feature-card {
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 16px;
          padding: 1rem;
        }

        .feature-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid rgba(255,127,103,0.18);
          background: rgba(255,127,103,0.08);
          color: #ff7f67;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.7rem;
        }

        .feature-title {
          font-weight: 900;
          color: #173838;
          font-size: 0.86rem;
          margin-bottom: 0.25rem;
        }

        .feature-desc {
          color: #819693;
          font-size: 0.76rem;
          line-height: 1.45;
        }

        .google-btn {
          width: 100%;
          background: #ffffff;
          color: #173838;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 0.92rem;
          padding: 0.9rem;
          border-radius: 13px;
          border: 1px solid rgba(23,56,56,0.12);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 14px 28px rgba(23,56,56,0.06);
        }

        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #819693;
          font-size: 0.78rem;
          margin-top: 0.85rem;
        }

        .connected-bar {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          border-radius: 18px;
          padding: 1rem 1.15rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .connected-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #2f625d;
          font-weight: 900;
        }

        .connected-dot {
          width: 10px;
          height: 10px;
          background: #8fc8c1;
          border-radius: 50%;
          box-shadow: 0 0 0 6px rgba(143,200,193,0.18);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
        }

        .seq-card {
          border-radius: 20px;
          padding: 1.15rem;
          margin-bottom: 0.85rem;
        }

        .seq-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 0.9rem;
        }

        .seq-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.25rem;
        }

        .seq-info {
          font-size: 0.8rem;
          color: #819693;
        }

        .seq-freq {
          display: inline-flex;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.20);
          color: #ff7f67;
          font-size: 0.72rem;
          padding: 0.22rem 0.58rem;
          border-radius: 100px;
          font-weight: 900;
          margin-left: 0.5rem;
        }

        .seq-steps {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .seq-step {
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 10px;
          padding: 0.38rem 0.7rem;
          font-size: 0.74rem;
          color: #5f7774;
          font-weight: 800;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.32rem 0.68rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 900;
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
        }

        .empty-state {
          border-radius: 22px;
          padding: 3rem 2rem;
          text-align: center;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.4rem;
        }

        .empty-sub {
          font-size: 0.86rem;
          color: #5f7774;
          margin-bottom: 1.5rem;
          line-height: 1.55;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(23,56,56,0.30);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
          backdrop-filter: blur(8px);
        }

        .modal {
          border-radius: 24px;
          padding: 1.7rem;
          width: 100%;
          max-width: 720px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 30px 80px rgba(23,56,56,0.18);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.35rem;
          letter-spacing: -0.045em;
        }

        .modal-sub {
          color: #5f7774;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 900;
          color: #2f625d;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.45rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.12);
          border-radius: 13px;
          padding: 0.85rem 1rem;
          color: #173838;
          font-size: 0.9rem;
          outline: none;
          font-family: 'Inter', sans-serif;
          margin-bottom: 1rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 110px;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: rgba(255,127,103,0.42);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
        }

        .freq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .freq-btn {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          font-size: 0.8rem;
          padding: 0.65rem;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          text-align: center;
        }

        .freq-btn.selected {
          background: rgba(255,127,103,0.10);
          border-color: rgba(255,127,103,0.28);
          color: #ff7f67;
        }

        .email-step {
          border-radius: 18px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .email-step-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .email-step-title {
          font-weight: 900;
          color: #173838;
        }

        .var-tags {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-bottom: 0.65rem;
        }

        .var-tag {
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.20);
          color: #ff7f67;
          font-size: 0.76rem;
          padding: 0.28rem 0.62rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 900;
        }

        .modal-divider {
          border: none;
          border-top: 1px solid rgba(23,56,56,0.08);
          margin: 1.25rem 0;
        }

        .modal-btns {
          display: flex;
          gap: 0.75rem;
        }

        .modal-cancel,
        .modal-submit {
          min-height: 42px;
          border-radius: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .modal-cancel {
          flex: 1;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #2f625d;
        }

        .modal-submit {
          flex: 2;
          background: #ff7f67;
          color: #173838;
          border: 0;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
        }

        .modal-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

          .hero-card {
            flex-direction: column;
          }
        }

        @media(max-width: 760px) {
          .content {
            padding: 1rem;
          }

          .feature-grid,
          .freq-grid {
            grid-template-columns: 1fr;
          }

          .modal-btns {
            flex-direction: column;
          }

          .topbar {
            padding: 0 1rem;
          }

          .connected-bar,
          .section-header,
          .seq-top {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="app-layout">
        <AppNavigator />

        <section className="content">
          <div className="content-inner">
            {success && <div className="success-bar">{success}</div>}
            {error && <div className="error-bar">{error}</div>}

            <div className="hero-card">
              <div>
                <div className="page-kicker">Gmail</div>
                <h1 className="page-title">Gmail Sequences</h1>
                <p className="page-sub">
                  Connect Gmail, create follow-up sequences, and automate email outreach from your lead workflow.
                </p>
              </div>

              {connected && (
                <button className="btn btn-secondary" onClick={() => setShowNewSequence(true)}>
                  New Sequence
                </button>
              )}
            </div>

            {!connected ? (
              <div className="connect-card">
                <div className="connect-title">Connect Gmail</div>
                <p className="connect-sub">
                  Connect your Gmail account to create and manage email sequences. You will be redirected to Google to approve access.
                </p>

                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon"><Icon name="gmail" /></div>
                    <div className="feature-title">Email Sequences</div>
                    <div className="feature-desc">Build timed follow-ups for leads and prospects.</div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon"><Icon name="leads" /></div>
                    <div className="feature-title">Lead Follow-up</div>
                    <div className="feature-desc">Use sequence steps to contact warm leads faster.</div>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon"><Icon name="analytics" /></div>
                    <div className="feature-title">Simple Control</div>
                    <div className="feature-desc">Manage sequence timing and email steps in one place.</div>
                  </div>
                </div>

                <button className="google-btn" onClick={handleConnect} disabled={loading}>
                  <Icon name="gmail" />
                  {loading ? "Connecting..." : "Connect with Google"}
                </button>

                <div className="security-note">
                  Secure Google OAuth connection.
                </div>
              </div>
            ) : (
              <>
                <div className="connected-bar">
                  <div className="connected-left">
                    <span className="connected-dot" />
                    Gmail connected: {gmailUser}
                  </div>

                  <button className="btn btn-danger" onClick={handleDisconnect}>
                    Disconnect
                  </button>
                </div>

                <div className="section-header">
                  <div className="section-title">Email Sequences</div>
                  <button className="btn" onClick={() => setShowNewSequence(true)}>New Sequence</button>
                </div>

                {sequences.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon"><Icon name="gmail" /></div>
                    <div className="empty-title">No email sequences yet</div>
                    <div className="empty-sub">
                      Create your first Gmail sequence to automate follow-up messages.
                    </div>
                    <button className="btn" onClick={() => setShowNewSequence(true)}>Create First Sequence</button>
                  </div>
                ) : (
                  sequences.map(sequence => (
                    <div className="seq-card" key={sequence.id}>
                      <div className="seq-top">
                        <div>
                          <div className="seq-name">{sequence.name}</div>
                          <div className="seq-info">
                            {sequence.emails?.length || 0} emails
                            <span className="seq-freq">{getFrequencyLabel(sequence.send_frequency)}</span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                          <span className="status-pill">{sequence.status || "Active"}</span>
                          <button className="btn btn-danger" onClick={() => deleteSequence(sequence.id)}>
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="seq-steps">
                        {(sequence.emails || []).map((email, index) => (
                          <span className="seq-step" key={index}>
                            Day {email.day}: {email.subject || "No subject"}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {showNewSequence && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Create Email Sequence</div>
            <div className="modal-sub">
              Build a sequence of follow-up emails and choose how often it should run.
            </div>

            <form onSubmit={handleCreateSequence}>
              <label className="form-label">Sequence Name</label>
              <input
                className="form-input"
                placeholder="Example: Warm Lead Follow-up"
                value={seqName}
                onChange={e => setSeqName(e.target.value)}
                required
              />

              <label className="form-label">Send Frequency</label>
              <div className="freq-grid">
                {FREQUENCIES.map(frequency => (
                  <button
                    key={frequency.value}
                    type="button"
                    className={`freq-btn ${seqFrequency === frequency.value ? "selected" : ""}`}
                    onClick={() => setSeqFrequency(frequency.value)}
                  >
                    {frequency.label}
                  </button>
                ))}
              </div>

              <hr className="modal-divider" />

              <label className="form-label">Emails</label>

              {seqEmails.map((email, index) => (
                <div className="email-step" key={index}>
                  <div className="email-step-top">
                    <div className="email-step-title">Email {index + 1}</div>

                    {seqEmails.length > 1 && (
                      <button type="button" className="btn btn-danger" onClick={() => removeEmail(index)}>
                        Remove
                      </button>
                    )}
                  </div>

                  <label className="form-label">Send Day</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    value={email.day}
                    onChange={e => updateEmail(index, "day", parseInt(e.target.value))}
                    required
                  />

                  <label className="form-label">Subject</label>
                  <input
                    className="form-input"
                    placeholder="Subject line"
                    value={email.subject}
                    onChange={e => updateEmail(index, "subject", e.target.value)}
                    required
                  />

                  <label className="form-label">Body</label>

                  <div className="var-tags">
                    {["[Name]", "[Company]", "[Link]"].map(tag => (
                      <span
                        key={tag}
                        className="var-tag"
                        onClick={() => updateEmail(index, "body", email.body + tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <textarea
                    className="form-textarea"
                    placeholder="Write your email body..."
                    value={email.body}
                    onChange={e => updateEmail(index, "body", e.target.value)}
                    required
                  />
                </div>
              ))}

              <button type="button" className="btn btn-secondary" onClick={addEmail} style={{ marginBottom: "1rem" }}>
                <Icon name="plus" />
                Add Email
              </button>

              <div className="modal-btns">
                <button type="button" className="modal-cancel" onClick={() => setShowNewSequence(false)}>
                  Cancel
                </button>

                <button type="submit" className="modal-submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Sequence →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}