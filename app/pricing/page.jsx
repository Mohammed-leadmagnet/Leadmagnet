"use client";
import { useState, useEffect } from "react";
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
    desc: "For consultants & small agencies",
    features: [
      "1 workspace",
      "5 active campaigns",
      "LinkedIn automation",
      "Leads dashboard",
      "CSV export",
      "Basic analytics",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    planKey: "pro",
    price: "€99",
    period: "/ month",
    desc: "For growing agencies",
    features: [
      "5 client workspaces",
      "25 active campaigns",
      "Everything in Starter",
      "Instagram automation",
      "Gmail sequences",
      "Advanced analytics",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Agency",
    planKey: "agency",
    price: "€199",
    period: "/ month",
    desc: "For full-scale agencies",
    features: [
      "15 client workspaces",
      "75 active campaigns",
      "Everything in Pro",
      "Agency client manager",
      "Automated client reports",
      "White-label dashboard",
      "Dedicated account manager",
    ],
    popular: false,
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
        body: JSON.stringify({
          plan: planKey,
          userId: user.id,
          email: user.email,
        }),
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;letter-spacing:-0.02em;}
        .nav-links{display:flex;gap:1.5rem;align-items:center;}
        .nav-links a{color:#3d5240;text-decoration:none;font-size:0.875rem;font-weight:500;transition:color 0.15s;}
        .nav-links a:hover{color:#94a3b8;}
        .nav-cta{background:#22c97a;color:#071209;font-family:'Inter',sans-serif;font-weight:600;padding:0.5rem 1.1rem;border-radius:9px;text-decoration:none;font-size:0.855rem;transition:all 0.15s;}
        .nav-cta:hover{background:#1db36c;}
        .hero{text-align:center;padding:5rem 1.5rem 2.5rem;}
        .section-tag{display:inline-block;font-size:0.7rem;font-weight:600;color:#22c97a;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.875rem;}
        .hero-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(2rem,5vw,3rem);font-weight:800;color:#e8f4ec;letter-spacing:-0.03em;margin-bottom:0.875rem;line-height:1.1;}
        .hero-sub{color:#3d5240;font-size:1rem;margin-bottom:0.375rem;}
        .hero-note{color:#2a3d2e;font-size:0.815rem;}
        .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;max-width:1060px;margin:3rem auto;padding:0 1.5rem 5rem;}
        .plan{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:18px;padding:1.875rem;position:relative;transition:border-color 0.15s;}
        .plan:hover{border-color:rgba(34,201,122,0.15);}
        .plan.popular{border-color:rgba(34,201,122,0.35);background:linear-gradient(135deg,rgba(34,201,122,0.04) 0%,#0f1a11 60%);}
        .pop-badge{position:absolute;top:1.125rem;right:1.125rem;background:rgba(34,201,122,0.1);border:1px solid rgba(34,201,122,0.25);color:#22c97a;font-size:0.67rem;font-weight:700;padding:0.2rem 0.65rem;border-radius:100px;text-transform:uppercase;letter-spacing:0.08em;}
        .plan-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.925rem;font-weight:700;color:#94a3b8;margin-bottom:0.625rem;}
        .plan-price-wrap{display:flex;align-items:baseline;gap:0.25rem;margin-bottom:0.375rem;}
        .plan-price{font-family:'Plus Jakarta Sans',sans-serif;font-size:2.375rem;font-weight:800;color:#e8f4ec;letter-spacing:-0.04em;}
        .plan-period{font-size:0.875rem;color:#2a3d2e;}
        .plan-desc{font-size:0.8rem;color:#2a3d2e;margin-bottom:1.5rem;}
        .plan-divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin-bottom:1.25rem;}
        .features{list-style:none;display:flex;flex-direction:column;gap:0.55rem;margin-bottom:1.875rem;}
        .features li{font-size:0.845rem;color:#3d5240;display:flex;align-items:center;gap:0.55rem;}
        .features li::before{content:'✓';color:#22c97a;font-weight:700;font-size:0.8rem;flex-shrink:0;}
        .btn{width:100%;font-family:'Inter',sans-serif;font-weight:600;font-size:0.875rem;padding:0.75rem;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#94a3b8;cursor:pointer;transition:all 0.15s;letter-spacing:-0.01em;}
        .btn:hover{border-color:rgba(255,255,255,0.2);color:#c4d4c8;}
        .btn:disabled{opacity:0.5;cursor:not-allowed;}
        .plan.popular .btn{background:#22c97a;color:#071209;border-color:#22c97a;}
        .plan.popular .btn:hover{background:#1db36c;}
        .guarantee{text-align:center;padding:0 1.5rem 4rem;color:#2a3d2e;font-size:0.835rem;line-height:1.6;}
        .guarantee strong{color:#4d6b54;}
        .trial-note{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(34,201,122,0.06);border:1px solid rgba(34,201,122,0.15);color:#22c97a;font-size:0.78rem;font-weight:600;padding:0.4rem 1rem;border-radius:100px;margin-bottom:3rem;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
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
          <div className={`plan${plan.popular ? " popular" : ""}`} key={plan.name}>
            {plan.popular && <div className="pop-badge">Most Popular</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price-wrap">
              <div className="plan-price">{plan.price}</div>
              <div className="plan-period">{plan.period}</div>
            </div>
            <div className="plan-desc">{plan.desc}</div>
            <hr className="plan-divider" />
            <ul className="features">
              {plan.features.map(f => <li key={f}>{f}</li>)}
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

      <div className="guarantee">
        <strong>🔒 Secure payments by Stripe</strong> · Your payment info is never stored on our servers.<br />
        Questions? Email us at <a href="mailto:support@leadmagnetinc.com" style={{ color: "#3d5240" }}>support@leadmagnetinc.com</a>
      </div>
    </main>
  );
}