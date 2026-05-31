"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://azcqdqbaqgamxjpctcrk.supabase.co",
  "sb_publishable_9YIhEZZUcTL3USh6Q8GiXg_IUKcA6Yf"
);

const plans = [
  {
    name: "Starter",
    price: "€29",
    period: "/ month",
    desc: "Perfect for solopreneurs just getting started",
    priceId: "price_1TVUIdDeNM7EDvOYHmyWQwcl",
    features: [
      "Up to 5 active automations",
      "Auto-DM on comment",
      "Link click tracking",
      "Email collection gate",
      "Basic analytics dashboard",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "€59",
    period: "/ month",
    desc: "For creators & consultants scaling their pipeline",
    priceId: "price_1TVUJCDeNM7EDvOY8br67Hgr",
    features: [
      "Up to 50 active automations",
      "Everything in Starter",
      "Intent-based follow-up sequences",
      "Auto-accept connections",
      "CRM & newsletter integrations",
      "Post scheduling",
    ],
    popular: true,
  },
  {
    name: "Apex",
    price: "€99",
    period: "/ month",
    desc: "For agencies & power users at full scale",
    priceId: "price_1TVUJMDeNM7EDvOYNUi0CJfV",
    features: [
      "Unlimited automations",
      "Everything in Pro",
      "ICP enrichment & email lookup",
      "Multi-account management",
      "Priority support",
    ],
    popular: false,
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (priceId, planName) => {
    setLoading(planName);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/signup";
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userEmail: user.email }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }

    setLoading(null);
  };

  return (
    <main style={{ minHeight:"100vh", background:"#0a0a0a", fontFamily:"'DM Sans', sans-serif", color:"#e8f0ec" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0d1410;border-bottom:1px solid #1e2b24;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;}
        .logo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#00e5a0;text-decoration:none;}
        .nav-links{display:flex;gap:1.5rem;align-items:center;}
        .nav-links a{color:#a0a8a3;text-decoration:none;font-size:0.88rem;}
        .nav-cta{background:#00e5a0;color:#0a0a0a;font-family:'Syne',sans-serif;font-weight:700;padding:0.5rem 1rem;border-radius:8px;text-decoration:none;font-size:0.85rem;}
        .hero{text-align:center;padding:4rem 1.5rem 2rem;}
        .tag{display:inline-block;font-size:0.75rem;font-weight:600;color:#00e5a0;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:1rem;}
        .title{font-family:'Syne',sans-serif;font-size:clamp(2rem,5vw,3rem);font-weight:800;color:#fff;letter-spacing:-0.03em;margin-bottom:1rem;}
        .subtitle{color:#6b7c73;font-size:1rem;font-weight:300;margin-bottom:0.5rem;}
        .note{color:#6b7c73;font-size:0.82rem;}
        .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;margin:3rem auto;padding:0 1.5rem 4rem;}
        .plan{background:#111714;border:1px solid #1e2b24;border-radius:22px;padding:2rem;position:relative;}
        .plan.popular{border-color:rgba(0,229,160,0.5);}
        .pop-badge{position:absolute;top:1.2rem;right:1.2rem;background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.3);color:#00e5a0;font-size:0.7rem;font-weight:600;padding:0.2rem 0.7rem;border-radius:100px;text-transform:uppercase;letter-spacing:0.06em;}
        .plan-name{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#fff;margin-bottom:0.4rem;}
        .plan-price{font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;color:#fff;}
        .plan-price span{font-size:1rem;font-weight:400;color:#6b7c73;}
        .plan-desc{font-size:0.82rem;color:#6b7c73;margin-bottom:1.5rem;margin-top:0.3rem;}
        .features{list-style:none;display:flex;flex-direction:column;gap:0.6rem;margin-bottom:2rem;}
        .features li{font-size:0.88rem;color:#a0a8a3;display:flex;align-items:center;gap:0.6rem;}
        .features li::before{content:'✓';color:#00e5a0;font-weight:700;min-width:16px;}
        .btn{width:100%;font-family:'Syne',sans-serif;font-weight:700;font-size:0.9rem;padding:0.85rem;border-radius:10px;border:1px solid #2a2a2a;background:transparent;color:#e8f0ec;cursor:pointer;transition:background 0.2s;}
        .btn:hover{background:#1a1a1a;}
        .btn:disabled{opacity:0.6;cursor:not-allowed;}
        .plan.popular .btn{background:#00e5a0;color:#0a0a0a;border-color:#00e5a0;}
        .plan.popular .btn:hover{opacity:0.88;}
        .guarantee{text-align:center;padding:0 1.5rem 4rem;color:#6b7c73;font-size:0.85rem;}
        .guarantee strong{color:#a0a8a3;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="/login">Log in</a>
          <a href="/signup" className="nav-cta">Start Free Trial</a>
        </div>
      </nav>

      <div className="hero">
        <div className="tag">Pricing</div>
        <h1 className="title">Simple, transparent pricing</h1>
        <p className="subtitle">Start free for 7 days. No credit card required.</p>
        <p className="note">Cancel anytime · Billed monthly · All prices in EUR</p>
      </div>

      <div className="plans">
        {plans.map(plan => (
          <div className={`plan${plan.popular ? " popular" : ""}`} key={plan.name}>
            {plan.popular && <div className="pop-badge">Most Popular</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">{plan.price} <span>{plan.period}</span></div>
            <div className="plan-desc">{plan.desc}</div>
            <ul className="features">
              {plan.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button
              className="btn"
              onClick={() => handleSubscribe(plan.priceId, plan.name)}
              disabled={loading === plan.name}
            >
              {loading === plan.name ? "Redirecting to payment..." : `Get ${plan.name} →`}
            </button>
          </div>
        ))}
      </div>

      <div className="guarantee">
        <strong>🔒 Secure payments by Stripe</strong> · Your payment info is never stored on our servers.<br />
        Questions? Email us at hello@leadmagnet.io
      </div>
    </main>
  );
}
