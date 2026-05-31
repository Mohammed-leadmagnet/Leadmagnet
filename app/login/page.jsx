"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://azcqdqbaqgamxjpctcrk.supabase.co",
  "sb_publishable_9YIhEZZUcTL3USh6Q8GiXg_IUKcA6Yf"
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <main style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans', sans-serif", padding:"1rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .card{background:#111714;border:1px solid #1e2b24;border-radius:22px;padding:2.5rem;width:100%;max-width:420px;}
        .logo{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#00e5a0;margin-bottom:2rem;display:block;text-decoration:none;}
        .title{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:0.5rem;letter-spacing:-0.03em;}
        .subtitle{font-size:0.9rem;color:#6b7c73;margin-bottom:2rem;font-weight:300;}
        .label{display:block;font-size:0.82rem;font-weight:500;color:#a0a8a3;margin-bottom:0.5rem;}
        .input{width:100%;background:#0a0a0a;border:1px solid #1e2b24;border-radius:10px;padding:0.85rem 1rem;color:#e8f0ec;font-size:0.95rem;outline:none;transition:border-color 0.2s;margin-bottom:1rem;}
        .input:focus{border-color:#00e5a0;}
        .btn{width:100%;background:#00e5a0;color:#0a0a0a;font-family:'Syne',sans-serif;font-weight:700;font-size:0.95rem;padding:0.9rem;border-radius:10px;border:none;cursor:pointer;transition:opacity 0.2s;margin-top:0.5rem;}
        .btn:hover{opacity:0.88;}
        .btn:disabled{opacity:0.5;cursor:not-allowed;}
        .error{background:rgba(255,77,109,0.1);border:1px solid rgba(255,77,109,0.3);color:#ff4d6d;font-size:0.85rem;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1rem;}
        .signup-link{text-align:center;margin-top:1.5rem;font-size:0.85rem;color:#6b7c73;}
        .signup-link a{color:#00e5a0;text-decoration:none;font-weight:500;}
        .divider{border:none;border-top:1px solid #1e2b24;margin:1.5rem 0;}
        .forgot{display:block;text-align:right;font-size:0.8rem;color:#00e5a0;text-decoration:none;margin-top:-0.5rem;margin-bottom:1rem;}
      `}</style>

      <div className="card">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <h1 className="title">Welcome back</h1>
        <p className="subtitle">Log in to your LeadMagnet account.</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin}>
          <label className="label">Email address</label>
          <input
            className="input"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <a href="#" className="forgot">Forgot password?</a>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In →"}
          </button>
        </form>

        <hr className="divider" />
        <div className="signup-link">
          Don't have an account? <a href="/signup">Start free trial</a>
        </div>
      </div>
    </main>
  );
}
