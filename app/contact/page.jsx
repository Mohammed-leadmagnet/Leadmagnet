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
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;}
        .back-btn{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.835rem;padding:0.4rem 0.875rem;border-radius:8px;cursor:pointer;text-decoration:none;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .back-btn:hover{border-color:rgba(255,255,255,0.15);color:#94a3b8;}
        .container{max-width:640px;margin:0 auto;padding:4rem 1.5rem 6rem;}
        .page-tag{font-size:0.7rem;font-weight:600;color:#22c97a;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.875rem;display:block;}
        .page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:2rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.03em;margin-bottom:0.5rem;}
        .page-sub{font-size:0.875rem;color:#3d5240;margin-bottom:3rem;line-height:1.6;}
        .contact-options{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2.5rem;}
        .contact-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.25rem;}
        .contact-card-icon{font-size:1.25rem;margin-bottom:0.625rem;display:block;}
        .contact-card-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.875rem;font-weight:700;color:#c4d4c8;margin-bottom:0.25rem;}
        .contact-card-val{font-size:0.815rem;color:#3d5240;}
        .contact-card-val a{color:#22c97a;text-decoration:none;}
        .form-label{display:block;font-size:0.775rem;font-weight:600;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.02em;}
        .form-input{width:100%;background:#0f1a11;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1.25rem;transition:border-color 0.15s;}
        .form-input:focus{border-color:rgba(34,201,122,0.35);}
        .form-input::placeholder{color:#2a3d2e;}
        .form-textarea{width:100%;background:#0f1a11;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1.25rem;resize:vertical;min-height:140px;transition:border-color 0.15s;}
        .form-textarea:focus{border-color:rgba(34,201,122,0.35);}
        .form-select{width:100%;background:#0f1a11;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;font-family:'Inter',sans-serif;margin-bottom:1.25rem;}
        .btn{width:100%;background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.925rem;padding:0.875rem;border-radius:11px;border:none;cursor:pointer;transition:all 0.15s;}
        .btn:hover{background:#1db36c;transform:translateY(-1px);}
        .btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .success{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.2);color:#22c97a;font-size:0.875rem;padding:1.5rem;border-radius:12px;text-align:center;line-height:1.6;}
        .error{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171;font-size:0.835rem;padding:0.75rem 1rem;border-radius:10px;margin-bottom:1rem;line-height:1.5;}
        .divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:2rem 0;}
        footer{border-top:1px solid rgba(255,255,255,0.06);padding:1.75rem 2rem;display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:#2a3d2e;flex-wrap:wrap;gap:1rem;background:#0b120d;}
        .footer-logo{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#22c97a;font-size:0.975rem;}
        .footer-links{display:flex;gap:1.5rem;}
        .footer-links a{color:#2a3d2e;text-decoration:none;}
        .footer-links a:hover{color:#4d6b54;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <a href="/" className="back-btn">← Back to home</a>
      </nav>

      <div className="container">
        <span className="page-tag">Support</span>
        <h1 className="page-title">How can we help?</h1>
        <p className="page-sub">Send us a message and we'll get back to you within 24 hours. For urgent issues, email us directly.</p>

        <div className="contact-options">
          <div className="contact-card">
            <span className="contact-card-icon">📧</span>
            <div className="contact-card-title">Email Support</div>
            <div className="contact-card-val"><a href="mailto:support@leadmagnetinc.com">support@leadmagnetinc.com</a></div>
          </div>
          <div className="contact-card">
            <span className="contact-card-icon">⚡</span>
            <div className="contact-card-title">Response Time</div>
            <div className="contact-card-val">Within 24 hours on business days</div>
          </div>
        </div>

        <hr className="divider" />

        {sent ? (
          <div className="success">
            ✓ Message sent!<br /><br />
            Thanks for reaching out. We'll get back to you at <strong>{form.email}</strong> within 24 hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="error">⚠ {error}</div>}
            <label className="form-label">YOUR NAME</label>
            <input className="form-input" placeholder="John Smith" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            <label className="form-label">EMAIL ADDRESS</label>
            <input className="form-input" type="email" placeholder="you@agency.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            <label className="form-label">SUBJECT</label>
            <select className="form-select" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required>
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
            <textarea className="form-textarea" placeholder="Describe your issue or question in detail..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message →"}
            </button>
          </form>
        )}
      </div>

      <footer>
        <div className="footer-logo">⚡ LeadMagnet</div>
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