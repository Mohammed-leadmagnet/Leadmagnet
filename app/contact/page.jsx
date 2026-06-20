"use client";
import { useState, useEffect } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Contact Support — LeadMagnet";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError("Something went wrong. Please email us directly at support@leadmagnetinc.com");
      }
    } catch {
      setError("Something went wrong. Please email us directly at support@leadmagnetinc.com");
    }
    setLoading(false);
  };

  return (
    <main className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

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
          display: flex;
          flex-direction: column;
        }

        .nav {
          height: 64px;
          background: rgba(255,255,255,0.92);
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

        .brand-name .lead {
          color: #ff7f67;
        }

        .brand-name .magnet {
          color: #8fc8c1;
        }

        .back-btn {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          border-radius: 10px;
          min-height: 36px;
          padding: 0 0.8rem;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .back-btn:hover {
          color: #ff7f67;
          border-color: rgba(255,127,103,0.28);
          background: rgba(255,127,103,0.06);
        }

        .container {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: 4rem 1.5rem 6rem;
          flex: 1;
        }

        .hero {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 28px;
          padding: 2rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
          margin-bottom: 1.2rem;
        }

        .page-tag {
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          display: inline-flex;
          padding: 0.4rem 0.75rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.9rem;
        }

        .page-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2.1rem, 5vw, 3.4rem);
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.07em;
          line-height: 1;
          margin-bottom: 0.65rem;
        }

        .page-sub {
          color: #5f7774;
          font-size: 0.96rem;
          line-height: 1.7;
          max-width: 620px;
        }

        .contact-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.2rem;
        }

        .contact-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 20px;
          padding: 1.15rem;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .contact-card-icon {
          width: 38px;
          height: 38px;
          border-radius: 13px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.8rem;
          font-weight: 900;
          font-size: 0.8rem;
        }

        .contact-card-title {
          color: #173838;
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 0.25rem;
        }

        .contact-card-val {
          color: #5f7774;
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .contact-card-val a {
          color: #ff7f67;
          text-decoration: none;
          font-weight: 800;
        }

        .form-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 24px;
          padding: 1.4rem;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
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
        .form-textarea,
        .form-select {
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

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          border-color: rgba(255,127,103,0.42);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #9aaba8;
        }

        .form-textarea {
          resize: vertical;
          min-height: 150px;
        }

        .btn {
          width: 100%;
          min-height: 46px;
          background: #ff7f67;
          color: #173838;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          font-size: 0.92rem;
          border-radius: 13px;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
        }

        .btn:hover {
          background: #ec6f5b;
          transform: translateY(-1px);
        }

        .btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .success {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
          font-size: 0.9rem;
          padding: 1.5rem;
          border-radius: 18px;
          text-align: center;
          line-height: 1.7;
          font-weight: 700;
        }

        .error {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          color: #ef4444;
          font-size: 0.84rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          margin-bottom: 1rem;
          line-height: 1.5;
          font-weight: 700;
        }

        footer {
          border-top: 1px solid rgba(23,56,56,0.08);
          padding: 1.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #819693;
          flex-wrap: wrap;
          gap: 1rem;
          background: rgba(255,255,255,0.72);
        }

        .footer-logo {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          color: #173838;
          font-size: 0.98rem;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-links a {
          color: #5f7774;
          text-decoration: none;
          font-weight: 700;
        }

        .footer-links a:hover {
          color: #ff7f67;
        }

        @media(max-width: 700px) {
          .container {
            padding: 2.5rem 1rem 4rem;
          }

          .nav {
            padding: 0 1rem;
          }

          .contact-options {
            grid-template-columns: 1fr;
          }

          .hero,
          .form-card {
            padding: 1.2rem;
          }

          footer {
            padding: 1.4rem 1rem;
          }
        }
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">
          <span className="brand-mark" />
          <span className="brand-name">
            <span className="lead">lead</span>
            <span className="magnet">magnet</span> inc
          </span>
        </a>

        <a href="/" className="back-btn">Back to home</a>
      </nav>

      <div className="container">
        <section className="hero">
          <span className="page-tag">Support</span>
          <h1 className="page-title">How can we help?</h1>
          <p className="page-sub">
            Send us a message and we will get back to you within 24 hours.
            For urgent issues, email us directly.
          </p>
        </section>

        <div className="contact-options">
          <div className="contact-card">
            <span className="contact-card-icon">EM</span>
            <div className="contact-card-title">Email Support</div>
            <div className="contact-card-val">
              <a href="mailto:support@leadmagnetinc.com">support@leadmagnetinc.com</a>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-card-icon">24</span>
            <div className="contact-card-title">Response Time</div>
            <div className="contact-card-val">
              Within 24 hours on business days
            </div>
          </div>
        </div>

        <div className="form-card">
          {sent ? (
            <div className="success">
              Message sent.<br /><br />
              Thanks for reaching out. We will get back to you at{" "}
              <strong>{form.email}</strong> within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error">{error}</div>}

              <label className="form-label">YOUR NAME</label>
              <input
                className="form-input"
                placeholder="John Smith"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
              />

              <label className="form-label">EMAIL ADDRESS</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@agency.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />

              <label className="form-label">SUBJECT</label>
              <select
                className="form-select"
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                required
              >
                <option value="">Select a topic...</option>
                <option value="Technical issue">Technical issue</option>
                <option value="Billing question">Billing question</option>
                <option value="LinkedIn / Instagram connection">LinkedIn / Instagram connection</option>
                <option value="Gmail sequences">Gmail sequences</option>
                <option value="Feature request">Feature request</option>
                <option value="Account question">Account question</option>
                <option value="Other">Other</option>
              </select>

              <label className="form-label">MESSAGE</label>
              <textarea
                className="form-textarea"
                placeholder="Describe your issue or question in detail..."
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                required
              />

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer>
        <div className="footer-logo">LeadMagnet Inc.</div>

        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/">Home</a>
        </div>

        <div>© 2026 LeadMagnet Inc. All rights reserved.</div>
      </footer>
    </main>
  );
}