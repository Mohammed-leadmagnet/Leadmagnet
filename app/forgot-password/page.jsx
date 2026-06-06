"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Reset Password — LeadMagnet";
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://leadmagnetinc.com/reset-password",
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080c09", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: "1rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .card{background:#0f1a11;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:2.5rem;width:100%;max-width:420px;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:800;color:#22c97a;margin-bottom:2rem;display:block;text-decoration:none;letter-spacing:-0.02em;}
        .title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.625rem;font-weight:800;color:#f0f7f2;margin-bottom:0.4rem;letter-spacing:-0.03em;}
        .subtitle{font-size:0.875rem;color:#3d5240;margin-bottom:2rem;font-weight:400;line-height:1.6;}
        .label{display:block;font-size:0.775rem;font-weight:600;color:#4d6b54;margin-bottom:0.4rem;letter-spacing:0.02em;}
        .input{width:100%;background:#080c09;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:0.75rem 1rem;color:#e2ede7;font-size:0.875rem;outline:none;transition:border-color 0.15s;margin-bottom:1rem;font-family:'Inter',sans-serif;}
        .input:focus{border-color:rgba(34,201,122,0.4);}
        .input::placeholder{color:#2a3d2e;}
        .btn{width:100%;background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;font-size:0.925rem;padding:0.875rem;border-radius:11px;border:none;cursor:pointer;transition:all 0.15s;letter-spacing:-0.01em;}
        .btn:hover{background:#1db36c;transform:translateY(-1px);}
        .btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .error{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171;font-size:0.835rem;padding:0.75rem 1rem;border-radius:10px;margin-bottom:1rem;line-height:1.5;}
        .success{background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.2);color:#22c97a;font-size:0.875rem;padding:1.25rem;border-radius:12px;line-height:1.6;text-align:center;}
        .divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:1.5rem 0;}
        .back-link{text-align:center;font-size:0.835rem;color:#2a3d2e;}
        .back-link a{color:#22c97a;text-decoration:none;font-weight:500;}
        .back-link a:hover{color:#1db36c;}
      `}</style>

      <div className="card">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <h1 className="title">Reset your password</h1>
        <p className="subtitle">Enter your email address and we'll send you a link to reset your password.</p>

        {error && <div className="error">⚠ {error}</div>}

        {sent ? (
          <div className="success">
            ✓ Reset link sent!<br /><br />
            Check your inbox at <strong>{email}</strong> for a password reset link. It may take a minute to arrive.
          </div>
        ) : (
          <form onSubmit={handleReset}>
            <label className="label">Email address</label>
            <input
              className="input"
              type="email"
              placeholder="you@agency.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link →"}
            </button>
          </form>
        )}

        <hr className="divider" />
        <div className="back-link">
          Remember your password? <a href="/login">Log in →</a>
        </div>
      </div>
    </main>
  );
}