"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const plans = [
  {
    name: "Starter",
    planKey: "starter",
    price: "€49",
    period: "/ month",
    desc: "For consultants & freelancers getting started with lead generation.",
    features: [
      "1 client workspace",
      "5 active campaigns",
      "LinkedIn lead capture",
      "Leads dashboard",
      "CSV export",
      "Basic analytics",
      "Email support",
    ],
    popular: false,
    color: "#22c97a",
  },
  {
    name: "Pro",
    planKey: "pro",
    price: "€99",
    period: "/ month",
    desc: "For growing agencies managing multiple clients and platforms.",
    features: [
      "5 client workspaces",
      "25 active campaigns",
      "Everything in Starter",
      "Instagram lead capture",
      "Gmail follow-up sequences",
      "AI lead score filters",
      "Priority support",
    ],
    popular: false,
    color: "#63b3ed",
  },
  {
    name: "Agency",
    planKey: "agency",
    price: "€199",
    period: "/ month",
    desc: "For full-scale agencies with automation, reports, and client portals.",
    features: [
      "15 client workspaces",
      "Unlimited campaigns",
      "Everything in Pro",
      "Client Manager",
      "AI lead scoring",
      "Automated PDF reports",
      "White-label client portal",
      "One-click client onboarding",
      "Revenue & churn dashboard",
      "Client health alerts",
      "Per-client email sequences",
    ],
    popular: true,
    color: "#22c97a",
  },
  {
    name: "Scale",
    planKey: "scale",
    price: "€399",
    period: "/ month",
    desc: "For high-volume agencies that want AI-powered lead intelligence.",
    features: [
      "Unlimited workspaces",
      "Unlimited campaigns",
      "Everything in Agency",
      "Lead Radar",
      "ICP profile builder",
      "Lead scoring engine",
      "AI-powered recommendations",
      "CSV & manual lead import",
      "Campaign lead sync",
      "Duplicate detection",
      "Add-to-sequence workflow",
      "2,000 monthly Lead Radar credits",
    ],
    popular: false,
    color: "#a78bfa",
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Pricing — LeadMagnet";
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });
  }, []);

  const handleSubscribe = async (planKey, planName) => {
    setLoading(planName);
    try {
      if (!user) {
        window.location.href = "/signup";
        return;
      }
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, userId: user.id, email: user.email }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong: " + (data.error || "Please try again."));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(null);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;letter-spacing:-0.02em;display:flex;align-items:center;gap:0.4rem;}
        .logo-dot{width:8px;height:8px;background:#22c97a;border-radius:50%;box-shadow:0 0 10px rgba(34,201,122,0.5);}
        .nav-links{display:flex;gap:1.5rem;align-items:center;}
        .nav-links a{color:#3d5240;text-decoration:none;font-size:0.875rem;font-weight:500;transition:color 0.15s;}
        .nav-links a:hover{color:#94a3b8;}
        .nav-cta{background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;padding:0.5rem 1.1rem;border-radius:9px;text-decoration:none;font-size:0.855rem;transition:all 0.15s;}
        .nav-cta:hover{background:#1db36c;}
        .hero{text-align:center;padding:4.5rem 1.5rem 2rem;}
        .section-tag{display:inline-block;font-size:0.7rem;font-weight:600;color:#22c97a;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.875rem;}
        .hero-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(2rem,5vw,3rem);font-weight:800;color:#e8f4ec;letter-spacing:-0.03em;margin-bottom:0.875rem;line-height:1.1;}
        .hero-sub{color:#3d5240;font-size:1rem;margin-bottom:0.375rem;}
        .hero-note{color:#2a3d2e;font-size:0.815rem;}
        .trial-note{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.15);color:#22c97a;font-size:0.78rem;font-weight:600;padding:0.4rem 1rem;border-radius:100px;margin-bottom:2.5rem;}
        .plans{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;max-width:1200px;margin:0 auto;padding:0 1.5rem 5rem;}
        .plan{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:1.75rem;position:relative;transition:all 0.2s;display:flex;flex-direction:column;}
        .plan:hover{border-color:rgba(34,201,122,0.15);transform:translateY(-2px);}
        .plan.popular{border-color:rgba(34,201,122,0.35);background:linear-gradient(135deg,rgba(34,201,122,0.04) 0%,#0f1a11 60%);transform:translateY(-4px);box-shadow:0 8px 32px rgba(34,201,122,0.08);}
        .plan.popular:hover{transform:translateY(-6px);}
        .plan.scale-plan{border-color:rgba(147,51,234,0.25);background:linear-gradient(135deg,rgba(147,51,234,0.04) 0%,#0f1a11 60%);}
        .plan.scale-plan:hover{border-color:rgba(147,51,234,0.4);}
        .pop-badge{position:absolute;top:1rem;right:1rem;background:rgba(34,201,122,0.1);border:1px solid rgba(34,201,122,0.25);color:#22c97a;font-size:0.64rem;font-weight:700;padding:0.175rem 0.6rem;border-radius:100px;text-transform:uppercase;letter-spacing:0.08em;}
        .scale-badge{position:absolute;top:1rem;right:1rem;background:rgba(147,51,234,0.1);border:1px solid rgba(147,51,234,0.25);color:#a78bfa;font-size:0.64rem;font-weight:700;padding:0.175rem 0.6rem;border-radius:100px;text-transform:uppercase;letter-spacing:0.08em;}
        .plan-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:700;color:#94a3b8;margin-bottom:0.5rem;}
        .plan-price-wrap{display:flex;align-items:baseline;gap:0.25rem;margin-bottom:0.35rem;}
        .plan-price{font-family:'Plus Jakarta Sans',sans-serif;font-size:2.25rem;font-weight:800;color:#e8f4ec;letter-spacing:-0.04em;}
        .plan-period{font-size:0.82rem;color:#2a3d2e;}
        .plan-desc{font-size:0.78rem;color:#2a3d2e;margin-bottom:1.25rem;line-height:1.45;}
        .plan-divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin-bottom:1.125rem;}
        .features{list-style:none;display:flex;flex-direction:column;gap:0.45rem;margin-bottom:1.5rem;flex:1;}
        .features li{font-size:0.8rem;color:#3d5240;display:flex;align-items:flex-start;gap:0.5rem;line-height:1.35;}
        .features li::before{content:'✓';color:#22c97a;font-weight:700;font-size:0.75rem;flex-shrink:0;margin-top:1px;}
        .scale-plan .features li::before{color:#a78bfa;}
        .features li.highlight{color:#c4d4c8;font-weight:600;}
        .btn{width:100%;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.84rem;padding:0.7rem;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#94a3b8;cursor:pointer;transition:all 0.15s;letter-spacing:-0.01em;}
        .btn:hover{border-color:rgba(255,255,255,0.2);color:#c4d4c8;transform:translateY(-1px);}
        .btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
        .plan.popular .btn{background:linear-gradient(135deg,#22c97a,#1aae6a);color:#071209;border-color:#22c97a;box-shadow:0 2px 8px rgba(34,201,122,0.15);}
        .plan.popular .btn:hover{background:linear-gradient(135deg,#1db36c,#18a060);box-shadow:0 4px 16px rgba(34,201,122,0.25);}
        .scale-plan .btn{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;border-color:#a78bfa;box-shadow:0 2px 8px rgba(147,51,234,0.15);}
        .scale-plan .btn:hover{box-shadow:0 4px 16px rgba(147,51,234,0.25);}
        .guarantee{text-align:center;padding:0 1.5rem 4rem;color:#2a3d2e;font-size:0.835rem;line-height:1.6;}
        .guarantee strong{color:#4d6b54;}
        .compare{max-width:1200px;margin:0 auto;padding:0 1.5rem 4rem;}
        .compare-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.3rem;font-weight:800;color:#f0f7f2;text-align:center;margin-bottom:2rem;}
        .compare-grid{display:grid;grid-template-columns:2fr repeat(4,1fr);gap:0;border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;}
        .compare-cell{padding:0.7rem 0.85rem;font-size:0.78rem;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;align-items:center;}
        .compare-cell:last-child{border-bottom:none;}
        .compare-header{background:rgba(0,0,0,0.3);font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;color:#c4d4c8;font-size:0.82rem;justify-content:center;text-align:center;}
        .compare-feature{color:#4d6b54;font-family:'Inter',sans-serif;}
        .compare-check{color:#22c97a;font-weight:700;justify-content:center;font-size:0.85rem;}
        .compare-dash{color:#1e2e22;justify-content:center;}
        .compare-purple{color:#a78bfa;font-weight:700;justify-content:center;font-size:0.85rem;}
        @media(max-width:1100px){.plans{grid-template-columns:repeat(2,1fr);}.compare-grid{display:none;}}
        @media(max-width:600px){.plans{grid-template-columns:1fr;}.nav-links a:not(.nav-cta){display:none;}}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo"><span className="logo-dot"></span> LeadMagnet</a>
        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="/#faq">FAQ</a>
          <a href="/login">Log in</a>
          <a href="/signup" className="nav-cta">Start Free Trial</a>
        </div>
      </nav>

      <div className="hero">
        <div className="section-tag">Pricing</div>
        <h1 className="hero-title">Simple, transparent pricing</h1>
        <p className="hero-sub">Start free for 7 days. No credit card required.</p>
        <p className="hero-note">Cancel anytime · Billed monthly · All prices in EUR excl. VAT</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <div className="trial-note">🎉 Every plan includes a 7-day free trial — no credit card needed</div>
      </div>

      <div className="plans">
        {plans.map(plan => (
          <div className={`plan${plan.popular ? " popular" : ""}${plan.planKey === "scale" ? " scale-plan" : ""}`} key={plan.name}>
            {plan.popular && <div className="pop-badge">Most Popular</div>}
            {plan.planKey === "scale" && <div className="scale-badge">Premium</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price-wrap">
              <div className="plan-price">{plan.price}</div>
              <div className="plan-period">{plan.period}</div>
            </div>
            <div className="plan-desc">{plan.desc}</div>
            <hr className="plan-divider" />
            <ul className="features">
              {plan.features.map((f, i) => (
                <li key={f} className={f.includes("Everything in") || f === "Lead Radar" ? "highlight" : ""}>{f}</li>
              ))}
            </ul>
            <button
              className="btn"
              onClick={() => handleSubscribe(plan.planKey, plan.name)}
              disabled={loading === plan.name}
            >
              {loading === plan.name ? "Redirecting..." : `Start ${plan.name} Trial →`}
            </button>
          </div>
        ))}
      </div>

      {/* COMPARISON TABLE */}
      <div className="compare">
        <div className="compare-title">Compare plans</div>
        <div className="compare-grid">
          {/* Header */}
          <div className="compare-cell compare-header" style={{ background: "rgba(0,0,0,0.4)" }}></div>
          <div className="compare-cell compare-header">Starter</div>
          <div className="compare-cell compare-header">Pro</div>
          <div className="compare-cell compare-header" style={{ color: "#22c97a" }}>Agency</div>
          <div className="compare-cell compare-header" style={{ color: "#a78bfa" }}>Scale</div>

          {[
            ["Client workspaces", "1", "5", "15", "Unlimited"],
            ["Active campaigns", "5", "25", "Unlimited", "Unlimited"],
            ["LinkedIn lead capture", "✓", "✓", "✓", "✓"],
            ["Instagram lead capture", "—", "✓", "✓", "✓"],
            ["Gmail sequences", "—", "✓", "✓", "✓"],
            ["AI lead scoring", "—", "—", "✓", "✓"],
            ["Client Manager", "—", "—", "✓", "✓"],
            ["Automated PDF reports", "—", "—", "✓", "✓"],
            ["White-label client portal", "—", "—", "✓", "✓"],
            ["Client health alerts", "—", "—", "✓", "✓"],
            ["Revenue dashboard", "—", "—", "✓", "✓"],
            ["One-click onboarding", "—", "—", "✓", "✓"],
            ["Lead Radar", "—", "—", "—", "✓"],
            ["ICP profile builder", "—", "—", "—", "✓"],
            ["AI recommendations", "—", "—", "—", "✓"],
            ["Duplicate detection", "—", "—", "—", "✓"],
            ["Lead scoring engine", "—", "—", "—", "✓"],
            ["Monthly Lead Radar credits", "—", "—", "—", "2,000"],
          ].map(([feature, ...values]) => (
            <React.Fragment key={feature}>
              <div className="compare-cell compare-feature">{feature}</div>
              {values.map((v, i) => (
                <div key={i} className={`compare-cell ${v === "✓" ? (i === 3 ? "compare-purple" : "compare-check") : v === "—" ? "compare-dash" : "compare-check"}`}>
                  {v}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="guarantee">
        <strong>🔒 Secure payments by Stripe</strong> · Your payment info is never stored on our servers.<br />
        Questions? Email us at <a href="mailto:support@leadmagnetinc.com" style={{ color: "#3d5240" }}>support@leadmagnetinc.com</a>
      </div>
    </main>
  );
}
