"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getSupabase();

    if (!supabase) {
      setError("Authentication is not configured yet. Please check environment variables.");
      setLoading(false);
      return;
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : "https://leadmagnetinc.com/reset-password";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
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
          color: #173838;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .auth-card {
          width: 100%;
          max-width: 460px;
          background: linear-gradient(145deg, #ffffff, #f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 26px;
          padding: 2.2rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.10);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.62rem;
          text-decoration: none;
          margin-bottom: 2rem;
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

        .kicker {
          display: inline-flex;
          align-items: center;
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          padding: 0.45rem 0.8rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1rem;
          font-family: 'Inter', sans-serif;
        }

        .title {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.055em;
          color: #173838;
          margin-bottom: 0.55rem;
        }

        .subtitle {
          color: #5f7774;
          font-size: 0.94rem;
          line-height: 1.65;
          margin-bottom: 1.55rem;
          font-family: 'Inter', sans-serif;
        }

        .form {
          display: grid;
          gap: 1rem;
        }

        .field {
          display: grid;
          gap: 0.45rem;
        }

        .label {
          font-size: 0.76rem;
          font-weight: 900;
          color: #2f625d;
          text-transform: uppercase;
          letter-spacing: 0.045em;
          font-family: 'Inter', sans-serif;
        }

        .input {
          width: 100%;
          height: 52px;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          border-radius: 13px;
          color: #173838;
          font-size: 0.92rem;
          outline: none;
          padding: 0 1rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s;
        }

        .input:focus {
          border-color: rgba(255,127,103,0.42);
          box-shadow: 0 0 0 4px rgba(255,127,103,0.08);
        }

        .input::placeholder {
          color: #9aaba8;
        }

        .button {
          width: 100%;
          height: 54px;
          border: none;
          border-radius: 13px;
          background: #ff7f67;
          color: #173838;
          font-size: 0.94rem;
          font-weight: 900;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 14px 28px rgba(255,127,103,0.24);
          transition: all 0.15s;
          margin-top: 0.25rem;
        }

        .button:hover {
          background: #ec6f5b;
          transform: translateY(-1px);
        }

        .button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        .alert {
          padding: 0.8rem 0.95rem;
          border-radius: 13px;
          font-size: 0.85rem;
          line-height: 1.5;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
        }

        .alert-error {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          color: #ef4444;
        }

        .alert-success {
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
        }

        .divider {
          height: 1px;
          background: rgba(23,56,56,0.08);
          margin: 1.55rem 0 1.2rem;
        }

        .bottom {
          text-align: center;
          color: #819693;
          font-size: 0.86rem;
          font-family: 'Inter', sans-serif;
        }

        .bottom a {
          color: #ff7f67;
          font-weight: 900;
          text-decoration: none;
        }

        @media(max-width: 560px) {
          .page-shell {
            padding: 1rem;
          }

          .auth-card {
            padding: 1.65rem;
            border-radius: 22px;
          }

          .title {
            font-size: 1.65rem;
          }
        }
      `}</style>

      <section className="auth-card">
        <Link href="/" className="logo">
          <span className="brand-mark" />
          <span className="brand-name">
            <span className="lead">lead</span>
            <span className="magnet">magnet</span> inc
          </span>
        </Link>

        <div className="kicker">Password recovery</div>

        {sent ? (
          <>
            <h1 className="title">Check your email</h1>

            <p className="subtitle">
              We sent a password reset link to your email. Open it and follow the
              instructions to set a new password.
            </p>

            <div className="alert alert-success">
              Password reset email sent successfully.
            </div>

            <div className="divider" />

            <div className="bottom">
              Remember your password? <Link href="/login">Log in</Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="title">Reset your password</h1>

            <p className="subtitle">
              Enter the email address connected to your LeadMagnet account and
              we will send you a secure reset link.
            </p>

            <form className="form" onSubmit={handleReset}>
              {error && <div className="alert alert-error">{error}</div>}

              <label className="field">
                <span className="label">Email address</span>
                <input
                  className="input"
                  type="email"
                  placeholder="you@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <button className="button" type="submit" disabled={loading}>
                {loading ? "Sending reset link..." : "Send Reset Link"}
              </button>
            </form>

            <div className="divider" />

            <div className="bottom">
              Remember your password? <Link href="/login">Log in</Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}