"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons: Record<string, JSX.Element> = {
    campaign: (
      <svg {...common}>
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
    mail: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
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
        <path d="M7 14l3-3 3 2 5-6" />
      </svg>
    ),
    client: (
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
        <path d="M12 12l6-3" />
        <path d="M12 3v3" />
        <path d="M21 12h-3" />
        <path d="M12 21v-3" />
        <path d="M3 12h3" />
      </svg>
    ),
    check: (
      <svg {...common}>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    arrow: (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
      </svg>
    ),
  };

  return icons[name] || null;
}

type Plan = {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  popular: boolean;
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [plans, setPlans] = useState<Plan[]>([
    {
      name: "Starter",
      price: "€49",
      period: "/ month",
      desc: "For consultants and small agencies starting with lead automation.",
      features: [
        "1 workspace",
        "5 active campaigns",
        "LinkedIn automation",
        "Leads dashboard",
        "CSV export",
        "Basic analytics",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "€99",
      period: "/ month",
      desc: "For growing agencies using multiple platforms and follow-ups.",
      features: [
        "5 client workspaces",
        "25 active campaigns",
        "Everything in Starter",
        "Instagram automation",
        "Gmail sequences",
        "Advanced analytics",
      ],
      popular: true,
    },
    {
      name: "Agency",
      price: "€199",
      period: "/ month",
      desc: "For full-scale agencies managing clients, reports, and growth.",
      features: [
        "15 client workspaces",
        "75 active campaigns",
        "Everything in Pro",
        "Agency client manager",
        "Automated reports",
        "Dedicated support",
      ],
      popular: false,
    },
    {
      name: "Scale",
      price: "€399",
      period: "/ month",
      desc: "For agencies scaling lead intelligence and prospect discovery.",
      features: [
        "Everything in Agency",
        "Lead Radar",
        "ICP profiles",
        "Lead scoring",
        "Advanced reporting",
        "Scale support",
      ],
      popular: false,
    },
  ]);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.plans?.length) {
          setPlans(
            data.plans.map((plan: any) => ({
              name: plan.name,
              price: plan.display_price,
              period: plan.period,
              desc: plan.description,
              features: plan.features || [],
              popular: plan.popular,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const features = [
    {
      icon: "campaign",
      title: "Campaign Manager",
      desc: "Create LinkedIn and Instagram campaigns, track sources, and manage follow-up workflows from one dashboard.",
    },
    {
      icon: "mail",
      title: "Gmail Sequences",
      desc: "Connect Gmail securely and run structured follow-up sequences without storing passwords.",
    },
    {
      icon: "leads",
      title: "Leads Dashboard",
      desc: "Search, filter, score, archive, and export prospects captured from your campaigns.",
    },
    {
      icon: "analytics",
      title: "Analytics",
      desc: "See campaign performance, lead volume, conversion quality, and activity trends.",
    },
    {
      icon: "client",
      title: "Client Manager",
      desc: "Manage agency clients, portals, tiers, health scores, reports, and revenue in one place.",
    },
    {
      icon: "radar",
      title: "Lead Radar",
      desc: "Use ICP profiles and lead scoring to identify better-fit prospects for outreach.",
    },
  ];

  const faqs = [
    {
      q: "Do I need a credit card to start?",
      a: "No. You can start the trial without a credit card and choose a plan when you are ready.",
    },
    {
      q: "Which platforms does LeadMagnet support?",
      a: "LeadMagnet supports LinkedIn, Instagram, and Gmail workflows, with agency tools for client management and reporting.",
    },
    {
      q: "Is this built for agencies?",
      a: "Yes. Agency and Scale plans include client management, reporting, portals, and Lead Radar for prospect discovery.",
    },
    {
      q: "Can I export leads?",
      a: "Yes. Leads can be searched, filtered, archived, and exported for CRM or reporting workflows.",
    },
  ];

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
          overflow-x: hidden;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 64px;
          padding: 0 1.75rem;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(23,56,56,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 10px 30px rgba(23,56,56,0.04);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.62rem;
          text-decoration: none;
          flex-shrink: 0;
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

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .nav-link {
          color: #5f7774;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 0.5rem 0.8rem;
          border-radius: 9px;
          border: 1px solid transparent;
          transition: all 0.15s;
        }

        .nav-link:hover {
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border-color: rgba(255,127,103,0.18);
        }

        .nav-cta {
          background: #ff7f67;
          color: #173838;
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 900;
          padding: 0.62rem 1rem;
          border-radius: 10px;
          box-shadow: 0 10px 22px rgba(255,127,103,0.22);
        }

        .container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hero {
          padding: 6rem 0 4.5rem;
          position: relative;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.95fr);
          gap: 3rem;
          align-items: center;
        }

        .kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          padding: 0.45rem 0.8rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1.2rem;
          font-family: 'Inter', sans-serif;
        }

        .hero-title {
          font-size: clamp(2.8rem, 6vw, 5.6rem);
          line-height: 0.96;
          letter-spacing: -0.075em;
          color: #173838;
          font-weight: 900;
          margin-bottom: 1.25rem;
        }

        .hero-title span {
          color: #ff7f67;
        }

        .hero-copy {
          max-width: 620px;
          color: #5f7774;
          font-size: 1.05rem;
          line-height: 1.75;
          font-family: 'Inter', sans-serif;
          margin-bottom: 1.8rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .primary-btn,
        .secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          min-height: 44px;
          padding: 0.8rem 1.15rem;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 900;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
        }

        .primary-btn {
          background: #ff7f67;
          color: #173838;
          box-shadow: 0 16px 34px rgba(255,127,103,0.24);
        }

        .secondary-btn {
          background: #ffffff;
          color: #2f625d;
          border: 1px solid rgba(23,56,56,0.10);
          box-shadow: 0 12px 28px rgba(23,56,56,0.05);
        }

        .hero-note {
          color: #819693;
          font-size: 0.84rem;
          font-family: 'Inter', sans-serif;
        }

        .preview-card {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 28px;
          padding: 1.2rem;
          box-shadow: 0 26px 70px rgba(23,56,56,0.11);
          position: relative;
        }

        .preview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .preview-title {
          font-size: 0.9rem;
          font-weight: 900;
          color: #173838;
        }

        .status-pill {
          background: rgba(143,200,193,0.20);
          border: 1px solid rgba(143,200,193,0.36);
          color: #2f625d;
          border-radius: 100px;
          padding: 0.35rem 0.7rem;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
          margin-bottom: 0.9rem;
        }

        .metric {
          background: #FBF3E3;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 16px;
          padding: 1rem;
        }

        .metric strong {
          display: block;
          color: #ff7f67;
          font-size: 1.65rem;
          letter-spacing: -0.05em;
          margin-bottom: 0.2rem;
        }

        .metric span {
          color: #5f7774;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .lead-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 16px;
          padding: 0.9rem;
          margin-top: 0.7rem;
        }

        .lead-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg,#ff7f67,#8fc8c1);
        }

        .lead-name {
          font-size: 0.86rem;
          font-weight: 900;
          color: #173838;
        }

        .lead-meta {
          font-size: 0.76rem;
          color: #819693;
          margin-top: 0.12rem;
          font-family: 'Inter', sans-serif;
        }

        .score {
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.22);
          color: #ff7f67;
          border-radius: 100px;
          padding: 0.28rem 0.55rem;
          font-size: 0.7rem;
          font-weight: 900;
        }

        .section {
          padding: 4.5rem 0;
        }

        .section-head {
          max-width: 720px;
          margin-bottom: 2rem;
        }

        .section-tag {
          color: #ff7f67;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-family: 'Inter', sans-serif;
          margin-bottom: 0.75rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3.3rem);
          color: #173838;
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 1.05;
          margin-bottom: 0.8rem;
        }

        .section-copy {
          color: #5f7774;
          font-size: 0.98rem;
          line-height: 1.7;
          font-family: 'Inter', sans-serif;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .feature-card {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          padding: 1.35rem;
          box-shadow: 0 18px 40px rgba(23,56,56,0.05);
        }

        .feature-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.20);
          color: #ff7f67;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          color: #173838;
          font-size: 1rem;
          font-weight: 900;
          margin-bottom: 0.55rem;
        }

        .feature-card p {
          color: #5f7774;
          font-size: 0.88rem;
          line-height: 1.65;
          font-family: 'Inter', sans-serif;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .plan-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.09);
          border-radius: 22px;
          padding: 1.45rem;
          box-shadow: 0 18px 40px rgba(23,56,56,0.05);
          position: relative;
        }

        .plan-badge {
          position: absolute;
          right: 1rem;
          top: 1rem;
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          border-radius: 100px;
          padding: 0.25rem 0.6rem;
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .plan-name {
          color: #2f625d;
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 0.65rem;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 0.45rem;
        }

        .price strong {
          font-size: 2.2rem;
          color: #173838;
          font-weight: 900;
          letter-spacing: -0.05em;
        }

        .price span {
          color: #819693;
          font-size: 0.84rem;
          font-family: 'Inter', sans-serif;
        }

        .plan-desc {
          color: #5f7774;
          font-size: 0.84rem;
          line-height: 1.55;
          min-height: 42px;
          font-family: 'Inter', sans-serif;
          margin-bottom: 1.1rem;
        }

        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-bottom: 1.25rem;
        }

        .features-list li {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
          color: #5f7774;
          font-size: 0.84rem;
          line-height: 1.4;
          font-family: 'Inter', sans-serif;
        }

        .check-icon {
          color: #ff7f67;
          flex: 0 0 auto;
          margin-top: 0.05rem;
        }

        .plan-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          background: #ff7f67;
          color: #173838;
          border-radius: 12px;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 900;
          font-family: 'Inter', sans-serif;
        }

        .faq-list {
          display: grid;
          gap: 0.8rem;
        }

        .faq-item {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 16px;
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          background: transparent;
          border: 0;
          padding: 1rem 1.15rem;
          color: #173838;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          cursor: pointer;
          font-size: 0.94rem;
          font-weight: 900;
          text-align: left;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }

        .faq-answer {
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          line-height: 1.7;
          padding: 0 1.15rem 1.1rem;
        }

        .cta-band {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 28px;
          padding: 2.4rem;
          text-align: center;
          box-shadow: 0 22px 55px rgba(23,56,56,0.07);
        }

        .footer {
          border-top: 1px solid rgba(23,56,56,0.08);
          padding: 1.5rem 0;
          color: #819693;
          font-size: 0.82rem;
          font-family: 'Inter', sans-serif;
        }

        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-links {
          display: flex;
          gap: 1rem;
        }

        .footer-links a {
          color: #5f7774;
          text-decoration: none;
          font-weight: 700;
        }

        @media(max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr 1fr;
          }

          .nav-links .hide-mobile {
            display: none;
          }
        }

        @media(max-width: 640px) {
          .nav {
            padding: 0 1rem;
          }

          .brand-name {
            font-size: 0.95rem;
          }

          .hero {
            padding: 4rem 0 3rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .metric-grid {
            grid-template-columns: 1fr;
          }

          .preview-card {
            border-radius: 22px;
          }

          .cta-band {
            padding: 1.6rem;
          }
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="logo">
          <span className="brand-mark" />
          <span className="brand-name">
            <span className="lead">lead</span>
            <span className="magnet">magnet</span> inc
          </span>
        </Link>

        <div className="nav-links">
          <a href="#features" className="nav-link hide-mobile">Features</a>
          <a href="#pricing" className="nav-link hide-mobile">Pricing</a>
          <a href="#faq" className="nav-link hide-mobile">FAQ</a>
          <Link href="/login" className="nav-link">Log in</Link>
          <Link href="/signup" className="nav-cta">Start Free Trial</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="kicker">Built for marketing agencies</div>

            <h1 className="hero-title">
              Turn social engagement into <span>qualified leads</span>
            </h1>

            <p className="hero-copy">
              LeadMagnet helps agencies capture engaged prospects from LinkedIn
              and Instagram campaigns, organise them in one dashboard, and
              automate responsible Gmail follow-ups.
            </p>

            <div className="hero-actions">
              <Link href="/signup" className="primary-btn">
                Start Free Trial <Icon name="arrow" size={16} />
              </Link>
              <a href="#features" className="secondary-btn">
                See how it works
              </a>
            </div>

            <p className="hero-note">
              No credit card required. Try the full workflow before choosing a
              plan.
            </p>
          </div>

          <div className="preview-card">
            <div className="preview-top">
              <div className="preview-title">Agency Dashboard</div>
              <div className="status-pill">Live workflow</div>
            </div>

            <div className="metric-grid">
              <div className="metric">
                <strong>124</strong>
                <span>Total leads</span>
              </div>

              <div className="metric">
                <strong>38</strong>
                <span>Hot prospects</span>
              </div>

              <div className="metric">
                <strong>12</strong>
                <span>Campaigns</span>
              </div>

              <div className="metric">
                <strong>4</strong>
                <span>Clients</span>
              </div>
            </div>

            <div className="lead-row">
              <div className="lead-info">
                <div className="avatar" />
                <div>
                  <div className="lead-name">Sarah Mitchell</div>
                  <div className="lead-meta">Founder at Studio North</div>
                </div>
              </div>
              <div className="score">Hot</div>
            </div>

            <div className="lead-row">
              <div className="lead-info">
                <div className="avatar" />
                <div>
                  <div className="lead-name">Daniel Hart</div>
                  <div className="lead-meta">Growth Lead at Orbit</div>
                </div>
              </div>
              <div className="score">Warm</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Platform</div>

            <h2 className="section-title">
              Everything your agency needs to capture, manage, and report leads.
            </h2>

            <p className="section-copy">
              Run campaigns, organise lead data, create follow-up sequences,
              manage clients, and show results without switching between
              scattered spreadsheets.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon name={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Pricing</div>

            <h2 className="section-title">
              Choose the plan that matches your agency stage.
            </h2>

            <p className="section-copy">
              Start small, then upgrade when you need more clients, campaigns,
              reports, and Lead Radar intelligence.
            </p>
          </div>

          <div className="plans-grid">
            {plans.map((plan) => (
              <div className="plan-card" key={plan.name}>
                {plan.popular && <div className="plan-badge">Popular</div>}

                <div className="plan-name">{plan.name}</div>

                <div className="price">
                  <strong>{plan.price}</strong>
                  <span>{plan.period}</span>
                </div>

                <p className="plan-desc">{plan.desc}</p>

                <ul className="features-list">
                  {plan.features.slice(0, 6).map((feature) => (
                    <li key={feature}>
                      <span className="check-icon">
                        <Icon name="check" size={14} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="plan-btn">
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">FAQ</div>
            <h2 className="section-title">Questions before you start?</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={faq.q}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.q}
                  <span>{openFaq === index ? "−" : "+"}</span>
                </button>

                {openFaq === index && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div className="section-tag">Start today</div>

            <h2 className="section-title">
              Launch your first lead workflow in minutes.
            </h2>

            <p
              className="section-copy"
              style={{ margin: "0 auto 1.4rem", maxWidth: 620 }}
            >
              Create your account, connect your platforms, and start organising
              prospects from social campaigns.
            </p>

            <Link href="/signup" className="primary-btn">
              Start Free Trial <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>© 2026 LeadMagnet Inc. All rights reserved.</div>

          <div className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}