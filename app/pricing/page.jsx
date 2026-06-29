"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import AppNavigator from "@/app/components/AppNavigator";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const fallbackPlans = [
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
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [user, setUser] = useState(null);
  const [pricingPlans, setPricingPlans] = useState(fallbackPlans);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    document.title = "Pricing — LeadMagnet";

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });

    fetch("/api/plans")
      .then(res => res.json())
      .then(data => {
        if (data.plans?.length) {
          setPricingPlans(
            data.plans.map(plan => ({
              name: plan.name,
              planKey: plan.planKey || plan.plan_key,
              price: plan.price || plan.display_price,
              period: plan.period || "/ month",
              desc: plan.desc || plan.description,
              features: Array.isArray(plan.features) ? plan.features : [],
              popular: Boolean(plan.popular),
            }))
          );
        } else {
          setPricingPlans(fallbackPlans);
        }
      })
      .catch(() => {
        setPricingPlans(fallbackPlans);
      })
      .finally(() => {
        setPlansLoading(false);
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

  const getComparePlans = () => {
    const order = ["starter", "pro", "agency", "scale"];

    return order.map(key => {
      const found = pricingPlans.find(plan => plan.planKey === key);
      return found || fallbackPlans.find(plan => plan.planKey === key);
    }).filter(Boolean);
  };

  const comparePlans = getComparePlans();

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
          cursor: pointer;
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

        .hero-card {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 26px;
          padding: 1.7rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
          margin-bottom: 1.25rem;
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
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.065em;
          line-height: 1.04;
          margin-bottom: 0.65rem;
        }

        .page-sub {
          font-size: 0.95rem;
          color: #5f7774;
          line-height: 1.65;
          max-width: 760px;
        }

        .billing-note {
          margin-top: 1rem;
          display: inline-flex;
          background: rgba(143,200,193,0.18);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
          border-radius: 100px;
          padding: 0.45rem 0.8rem;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .loading-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          padding: 1.5rem;
          color: #5f7774;
          font-size: 0.95rem;
          font-weight: 800;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
          margin-bottom: 1.25rem;
        }

        .plans {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .plan {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          padding: 1.25rem;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        .plan.popular {
          border-color: rgba(255,127,103,0.32);
          box-shadow: 0 20px 44px rgba(255,127,103,0.10);
        }

        .scale-plan {
          border-color: rgba(124,58,237,0.22);
        }

        .pop-badge,
        .scale-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.62rem;
          font-weight: 900;
          padding: 0.22rem 0.55rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .pop-badge {
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.20);
          color: #ff7f67;
        }

        .scale-badge {
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.24);
          color: #7c3aed;
        }

        .plan-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.5rem;
          padding-right: 5rem;
        }

        .plan-price-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 0.35rem;
        }

        .plan-price {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2.3rem;
          font-weight: 900;
          color: #ff7f67;
          letter-spacing: -0.06em;
        }

        .scale-plan .plan-price {
          color: #7c3aed;
        }

        .plan-period {
          color: #819693;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .plan-desc {
          font-size: 0.8rem;
          color: #5f7774;
          line-height: 1.5;
          margin-bottom: 1rem;
          min-height: 58px;
        }

        .plan-divider {
          border: none;
          border-top: 1px solid rgba(23,56,56,0.08);
          margin-bottom: 1rem;
        }

        .features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.52rem;
          margin-bottom: 1.2rem;
          flex: 1;
        }

        .features li {
          font-size: 0.8rem;
          color: #5f7774;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.4;
        }

        .features li::before {
          content: "✓";
          color: #2f625d;
          font-weight: 900;
          flex-shrink: 0;
        }

        .features li.highlight {
          color: #173838;
          font-weight: 900;
        }

        .btn {
          width: 100%;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 0.84rem;
          padding: 0.78rem;
          border-radius: 12px;
          border: 1px solid rgba(23,56,56,0.10);
          background: #ffffff;
          color: #2f625d;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn:hover {
          border-color: rgba(255,127,103,0.28);
          color: #ff7f67;
          transform: translateY(-1px);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .plan.popular .btn {
          background: #ff7f67;
          color: #173838;
          border-color: #ff7f67;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
        }

        .scale-plan .btn {
          background: #7c3aed;
          color: #ffffff;
          border-color: #7c3aed;
          box-shadow: 0 14px 28px rgba(124,58,237,0.16);
        }

        .compare-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
          border-radius: 22px;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          overflow: hidden;
        }

        .compare-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.2rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 1rem;
          letter-spacing: -0.04em;
        }

        .compare-grid {
          display: grid;
          grid-template-columns: 2fr repeat(4, 1fr);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 16px;
          overflow: hidden;
        }

        .compare-cell {
          padding: 0.72rem 0.85rem;
          font-size: 0.78rem;
          border-bottom: 1px solid rgba(23,56,56,0.06);
          border-right: 1px solid rgba(23,56,56,0.06);
          display: flex;
          align-items: center;
        }

        .compare-header {
          background: #FBF3E3;
          font-weight: 900;
          color: #173838;
          justify-content: center;
          text-align: center;
        }

        .compare-feature {
          color: #5f7774;
          font-weight: 800;
        }

        .compare-check {
          color: #2f625d;
          font-weight: 900;
          justify-content: center;
        }

        .compare-purple {
          color: #7c3aed;
          font-weight: 900;
          justify-content: center;
        }

        .compare-dash {
          color: #c2cfcb;
          justify-content: center;
        }

        .guarantee-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
          border-radius: 20px;
          padding: 1rem 1.25rem;
          color: #5f7774;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .guarantee-card strong {
          color: #173838;
        }

        .guarantee-card a {
          color: #ff7f67;
          font-weight: 900;
          text-decoration: none;
        }

        @media(max-width: 1100px) {
          .plans {
            grid-template-columns: repeat(2, 1fr);
          }

          .compare-grid {
            display: none;
          }
        }

        @media(max-width: 1000px) {
          .app-layout {
            grid-template-columns: 1fr;
          }

        }

        @media(max-width: 650px) {
          .content {
            padding: 1rem;
          }

          .plans {
            grid-template-columns: 1fr;
          }

          .topbar {
            padding: 0 1rem;
          }
        }
      `}</style>

      <div className="app-layout">
        <AppNavigator />

        <section className="content">
          <div className="content-inner">
            <div className="hero-card">
              <div className="page-kicker">Billing</div>
              <h1 className="page-title">Choose the right plan</h1>
              <p className="page-sub">
                Start free for 7 days. Cancel anytime. Billing is monthly and all prices are in EUR excluding VAT.
              </p>
              <div className="billing-note">Secure payments by Stripe</div>
            </div>

            {plansLoading ? (
              <div className="loading-card">Loading latest packages...</div>
            ) : (
              <div className="plans">
                {pricingPlans.map(plan => (
                  <div
                    className={`plan${plan.popular ? " popular" : ""}${plan.planKey === "scale" ? " scale-plan" : ""}`}
                    key={plan.planKey || plan.name}
                  >
                    {plan.popular && <div className="pop-badge">Popular</div>}
                    {plan.planKey === "scale" && <div className="scale-badge">Premium</div>}

                    <div className="plan-name">{plan.name}</div>

                    <div className="plan-price-wrap">
                      <div className="plan-price">{plan.price}</div>
                      <div className="plan-period">{plan.period}</div>
                    </div>

                    <div className="plan-desc">{plan.desc}</div>

                    <hr className="plan-divider" />

                    <ul className="features">
                      {plan.features.map(feature => (
                        <li
                          key={feature}
                          className={
                            feature.includes("Everything in") || feature === "Lead Radar"
                              ? "highlight"
                              : ""
                          }
                        >
                          {feature}
                        </li>
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
            )}

            <div className="compare-card">
              <div className="compare-title">Compare plans</div>

              <div className="compare-grid">
                <div className="compare-cell compare-header"></div>
                {comparePlans.map(plan => (
                  <div
                    key={plan.planKey}
                    className="compare-cell compare-header"
                    style={{
                      color:
                        plan.planKey === "scale"
                          ? "#7c3aed"
                          : plan.planKey === "agency"
                            ? "#ff7f67"
                            : "#173838",
                    }}
                  >
                    {plan.name}
                  </div>
                ))}

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

                    {values.map((value, index) => (
                      <div
                        key={index}
                        className={`compare-cell ${
                          value === "✓"
                            ? index === 3
                              ? "compare-purple"
                              : "compare-check"
                            : value === "—"
                              ? "compare-dash"
                              : "compare-check"
                        }`}
                      >
                        {value}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="guarantee-card">
              <strong>Secure payments by Stripe.</strong> Your payment info is never stored on our servers.
              <br />
              Questions? Email us at <a href="mailto:support@leadmagnetinc.com">support@leadmagnetinc.com</a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}