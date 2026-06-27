"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode, SVGProps } from "react";

type IconProps = {
  name: string;
  size?: number;
};

type Plan = {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  popular: boolean;
};

type ApiPlan = {
  name: string;
  display_price: string;
  period: string;
  description: string;
  features?: string[];
  popular: boolean;
};

function Icon({ name, size = 22 }: IconProps) {
  const common: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons: Record<string, ReactNode> = {
    campaign: (
      <svg {...common}>
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="M16 17l3 3" />
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
        <path d="M7 15l3-4 3 2 5-7" />
        <path d="M18 6h3v3" />
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
        <circle cx="12" cy="12" r="3" />
        <path d="M12 12l6-3" />
        <path d="M12 3v3" />
        <path d="M21 12h-3" />
        <path d="M12 21v-3" />
        <path d="M3 12h3" />
      </svg>
    ),
    shield: (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-5" />
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
    spark: (
      <svg {...common}>
        <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
      </svg>
    ),
  };

  return icons[name] || null;
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      .then((data: { plans?: ApiPlan[] }) => {
        if (data.plans?.length) {
          setPlans(
            data.plans.map((plan) => ({
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

  const metrics = [
    { value: "3", label: "channels connected", detail: "LinkedIn, Instagram, Gmail" },
    { value: "1", label: "agency dashboard", detail: "Campaigns, clients, and leads" },
    { value: "7 days", label: "free trial", detail: "Start without a credit card" },
  ];

  const features = [
    {
      icon: "campaign",
      title: "Campaign Manager",
      desc: "Create campaigns, track sources, assign owners, and monitor lead flow from one workspace.",
    },
    {
      icon: "mail",
      title: "Gmail Sequences",
      desc: "Build structured follow-up sequences with clear guardrails and a human-friendly workflow.",
    },
    {
      icon: "leads",
      title: "Leads Dashboard",
      desc: "Search, filter, score, archive, export, and review prospects captured from your campaigns.",
    },
    {
      icon: "radar",
      title: "Lead Radar",
      desc: "Match prospects against ICP profiles, spot high-intent accounts, and prioritize better-fit leads.",
    },
    {
      icon: "client",
      title: "Client Manager",
      desc: "Manage agency clients, portals, tiers, health scores, reports, and account performance.",
    },
    {
      icon: "analytics",
      title: "Reporting",
      desc: "Turn campaign activity into simple client-ready reports without building spreadsheets manually.",
    },
  ];

  const steps = [
    {
      label: "01",
      title: "Capture engagement",
      desc: "Bring LinkedIn and Instagram campaign signals into one lead workspace.",
    },
    {
      label: "02",
      title: "Qualify the prospect",
      desc: "Use Lead Radar, campaign source, and ICP fit to understand who deserves attention first.",
    },
    {
      label: "03",
      title: "Follow up responsibly",
      desc: "Move qualified leads into Gmail sequences while keeping the team in control.",
    },
    {
      label: "04",
      title: "Report the outcome",
      desc: "Show lead volume, quality, activity, and client progress from the same dashboard.",
    },
  ];

  const proof = [
    {
      title: "Cleaner pipeline",
      desc: "Replace scattered sheets with one flow from campaign signal to report-ready lead activity.",
    },
    {
      title: "Better prioritization",
      desc: "Give sales teams a clear reason to contact each lead, not just another raw list.",
    },
    {
      title: "Agency-ready control",
      desc: "Separate workspaces, client views, exports, and reporting make the product easier to sell.",
    },
  ];

  const testimonials = [
    {
      quote:
        "LeadMagnet gives agencies a stronger way to turn campaign engagement into a managed follow-up pipeline.",
      name: "Agency growth team",
    },
    {
      quote:
        "The value is clear: capture the signal, qualify the lead, and show the client what happened.",
      name: "Outbound consultant",
    },
    {
      quote:
        "The dashboard makes the product feel practical, not just another automation tool.",
      name: "Client success lead",
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        .page-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at 8% 8%, rgba(255,127,103,0.16), transparent 28%),
            radial-gradient(circle at 92% 2%, rgba(143,200,193,0.18), transparent 30%),
            linear-gradient(180deg, #fff8ee 0%, #fbf3e3 45%, #f8fbfa 100%);
          color: #173838;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          overflow-x: hidden;
        }

        a {
          color: inherit;
        }

        .container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 68px;
          padding: 0 1.75rem;
          background: rgba(255,255,255,0.86);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(23,56,56,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 12px 38px rgba(23,56,56,0.05);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.62rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .brand-mark {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: conic-gradient(from -12deg,#ff7f67 0 44%,transparent 44% 51%,#8fc8c1 51% 86%,transparent 86% 100%);
          position: relative;
          box-shadow: 0 12px 24px rgba(255,127,103,0.18);
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
          color: #67aaa1;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .nav-link {
          color: #5f7774;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.84rem;
          font-weight: 800;
          padding: 0.54rem 0.8rem;
          border-radius: 10px;
          border: 1px solid transparent;
          transition: all 0.18s ease;
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
          padding: 0.68rem 1rem;
          border-radius: 12px;
          box-shadow: 0 12px 26px rgba(255,127,103,0.24);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          white-space: nowrap;
        }

        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 34px rgba(255,127,103,0.28);
        }

        .hero {
          padding: 6.5rem 0 4.2rem;
          position: relative;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
          gap: 3rem;
          align-items: center;
        }

        .kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #ff7f67;
          background: rgba(255,127,103,0.09);
          border: 1px solid rgba(255,127,103,0.20);
          padding: 0.48rem 0.86rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1.25rem;
          font-family: 'Inter', sans-serif;
        }

        .hero-title {
          font-size: clamp(3rem, 6.3vw, 5.85rem);
          line-height: 0.95;
          letter-spacing: -0.078em;
          color: #173838;
          font-weight: 900;
          margin-bottom: 1.25rem;
          max-width: 760px;
        }

        .hero-title span {
          color: #ff7f67;
        }

        .hero-copy {
          max-width: 650px;
          color: #5f7774;
          font-size: 1.08rem;
          line-height: 1.78;
          font-family: 'Inter', sans-serif;
          margin-bottom: 1.8rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          flex-wrap: wrap;
          margin-bottom: 1.35rem;
        }

        .primary-btn,
        .secondary-btn,
        .ghost-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.48rem;
          min-height: 46px;
          padding: 0.84rem 1.2rem;
          border-radius: 14px;
          font-size: 0.92rem;
          font-weight: 900;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }

        .primary-btn {
          background: #ff7f67;
          color: #173838;
          box-shadow: 0 16px 34px rgba(255,127,103,0.24);
        }

        .primary-btn:hover,
        .secondary-btn:hover,
        .ghost-btn:hover {
          transform: translateY(-2px);
        }

        .secondary-btn {
          background: #ffffff;
          color: #2f625d;
          border: 1px solid rgba(23,56,56,0.10);
          box-shadow: 0 12px 28px rgba(23,56,56,0.05);
        }

        .ghost-btn {
          background: transparent;
          color: #2f625d;
          border: 1px solid rgba(47,98,93,0.14);
        }

        .hero-note {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #819693;
          font-size: 0.85rem;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.85rem;
          margin-top: 2rem;
          max-width: 700px;
        }

        .metric-card {
          background: rgba(255,255,255,0.74);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 18px;
          padding: 1rem;
          box-shadow: 0 16px 36px rgba(23,56,56,0.05);
        }

        .metric-card strong {
          display: block;
          font-size: 1.4rem;
          color: #173838;
          font-weight: 900;
          letter-spacing: -0.04em;
          margin-bottom: 0.2rem;
        }

        .metric-card span {
          display: block;
          color: #2f625d;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 0.15rem;
        }

        .metric-card small {
          color: #819693;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          line-height: 1.4;
        }

        .preview-card {
          background:
            radial-gradient(circle at 18% 12%, rgba(255,127,103,0.13), transparent 30%),
            radial-gradient(circle at 88% 92%, rgba(143,200,193,0.26), transparent 34%),
            linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 32px;
          padding: 1.35rem;
          box-shadow: 0 30px 80px rgba(23,56,56,0.13);
          position: relative;
          overflow: hidden;
        }

        .preview-card::before {
          content: "";
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(255,255,255,0.74);
          border-radius: 24px;
          pointer-events: none;
        }

        .preview-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.1rem;
          position: relative;
          z-index: 1;
        }

        .preview-title {
          font-size: 0.95rem;
          font-weight: 900;
          color: #173838;
        }

        .status-pill {
          background: rgba(143,200,193,0.22);
          border: 1px solid rgba(143,200,193,0.38);
          color: #2f625d;
          border-radius: 100px;
          padding: 0.38rem 0.72rem;
          font-size: 0.72rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .workflow-preview {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 0.86rem;
        }

        .workflow-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 18px;
          padding: 0.98rem;
          box-shadow: 0 12px 30px rgba(23,56,56,0.05);
        }

        .workflow-card.featured {
          background: #fff8ee;
          border-color: rgba(255,127,103,0.20);
        }

        .workflow-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .workflow-icon {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .workflow-icon.mint {
          background: rgba(143,200,193,0.18);
          border-color: rgba(143,200,193,0.34);
          color: #2f625d;
        }

        .workflow-content {
          flex: 1;
          min-width: 0;
        }

        .workflow-label {
          color: #819693;
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.2rem;
        }

        .workflow-title {
          color: #173838;
          font-size: 0.92rem;
          font-weight: 900;
          line-height: 1.35;
        }

        .workflow-copy {
          color: #5f7774;
          font-size: 0.79rem;
          line-height: 1.56;
          margin-top: 0.28rem;
          font-family: 'Inter', sans-serif;
        }

        .workflow-status {
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          border-radius: 100px;
          padding: 0.26rem 0.58rem;
          font-size: 0.68rem;
          font-weight: 900;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        .workflow-status.ready {
          color: #2f625d;
          background: rgba(143,200,193,0.18);
          border-color: rgba(143,200,193,0.34);
        }

        .pipeline {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: stretch;
          gap: 0.45rem;
        }

        .pipeline-step {
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 15px;
          padding: 0.72rem 0.55rem;
          text-align: center;
        }

        .pipeline-step strong {
          display: block;
          color: #173838;
          font-size: 0.76rem;
          font-weight: 900;
          margin-bottom: 0.15rem;
        }

        .pipeline-step span {
          color: #819693;
          font-size: 0.66rem;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
        }

        .pipeline-arrow {
          color: #ff7f67;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insight-card {
          background: linear-gradient(145deg,#173838,#2f625d);
          color: #ffffff;
          border-radius: 18px;
          padding: 1.05rem;
          position: relative;
          overflow: hidden;
        }

        .insight-card::after {
          content: "";
          position: absolute;
          width: 160px;
          height: 160px;
          right: -70px;
          top: -70px;
          background: rgba(255,255,255,0.10);
          border-radius: 50%;
        }

        .insight-label {
          color: rgba(255,255,255,0.68);
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .insight-text {
          font-size: 0.88rem;
          line-height: 1.58;
          font-weight: 800;
          position: relative;
          z-index: 1;
        }

        .preview-footer {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          color: #819693;
          font-size: 0.72rem;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
        }

        .logo-strip {
          padding: 0 0 3.5rem;
        }

        .strip-card {
          background: rgba(255,255,255,0.66);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          padding: 1rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          box-shadow: 0 16px 40px rgba(23,56,56,0.04);
        }

        .strip-label {
          color: #819693;
          font-family: 'Inter', sans-serif;
          font-size: 0.76rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .strip-items {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .strip-item {
          color: #2f625d;
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 100px;
          padding: 0.44rem 0.75rem;
          font-size: 0.78rem;
          font-weight: 900;
          font-family: 'Inter', sans-serif;
        }

        .section {
          padding: 4.7rem 0;
        }

        .section.alt {
          background: rgba(255,255,255,0.45);
          border-top: 1px solid rgba(23,56,56,0.06);
          border-bottom: 1px solid rgba(23,56,56,0.06);
        }

        .section-head {
          max-width: 750px;
          margin-bottom: 2rem;
        }

        .section-head.center {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
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
          font-size: clamp(2rem, 4vw, 3.35rem);
          color: #173838;
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 1.05;
          margin-bottom: 0.85rem;
        }

        .section-copy {
          color: #5f7774;
          font-size: 0.98rem;
          line-height: 1.75;
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
          border-radius: 23px;
          padding: 1.38rem;
          box-shadow: 0 18px 42px rgba(23,56,56,0.055);
          min-height: 210px;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 54px rgba(23,56,56,0.08);
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.20);
          color: #ff7f67;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .feature-card h3,
        .proof-card h3,
        .step-card h3,
        .testimonial-card h3 {
          color: #173838;
          font-size: 1rem;
          font-weight: 900;
          margin-bottom: 0.55rem;
          letter-spacing: -0.02em;
        }

        .feature-card p,
        .proof-card p,
        .step-card p,
        .testimonial-card p {
          color: #5f7774;
          font-size: 0.88rem;
          line-height: 1.66;
          font-family: 'Inter', sans-serif;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .step-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          padding: 1.35rem;
          box-shadow: 0 18px 42px rgba(23,56,56,0.05);
          position: relative;
          overflow: hidden;
        }

        .step-card::after {
          content: "";
          position: absolute;
          right: -38px;
          top: -38px;
          width: 92px;
          height: 92px;
          background: rgba(255,127,103,0.08);
          border-radius: 50%;
        }

        .step-label {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 14px;
          align-items: center;
          justify-content: center;
          background: #fbf3e3;
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
          font-weight: 900;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .radar-panel {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 1.2rem;
          align-items: stretch;
        }

        .radar-card,
        .proof-card,
        .testimonial-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 24px;
          padding: 1.4rem;
          box-shadow: 0 18px 42px rgba(23,56,56,0.05);
        }

        .radar-card.dark {
          background: linear-gradient(145deg,#173838,#2f625d);
          color: #ffffff;
        }

        .radar-card.dark h3,
        .radar-card.dark p {
          color: #ffffff;
        }

        .radar-score {
          display: grid;
          gap: 0.78rem;
          margin-top: 1rem;
        }

        .score-row {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 0.75rem;
          align-items: center;
          color: rgba(255,255,255,0.82);
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .score-track {
          height: 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.16);
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          border-radius: inherit;
          background: #8fc8c1;
        }

        .proof-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .proof-card {
          background: linear-gradient(145deg,#ffffff,#fffaf2);
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(235px, 1fr));
          gap: 1rem;
        }

        .plan-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.09);
          border-radius: 24px;
          padding: 1.45rem;
          box-shadow: 0 18px 42px rgba(23,56,56,0.055);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .plan-card.popular {
          border-color: rgba(255,127,103,0.28);
          box-shadow: 0 24px 58px rgba(255,127,103,0.12);
        }

        .plan-badge {
          position: absolute;
          right: 1rem;
          top: 1rem;
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          border-radius: 100px;
          padding: 0.26rem 0.62rem;
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
          font-size: 2.25rem;
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
          line-height: 1.56;
          min-height: 58px;
          font-family: 'Inter', sans-serif;
          margin-bottom: 1.1rem;
        }

        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.58rem;
          margin-bottom: 1.25rem;
          flex: 1;
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
          min-height: 44px;
          background: #ff7f67;
          color: #173838;
          border-radius: 13px;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 900;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 12px 26px rgba(255,127,103,0.18);
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .testimonial-card p {
          font-size: 0.94rem;
          color: #173838;
          font-weight: 700;
        }

        .testimonial-card h3 {
          color: #2f625d;
          font-size: 0.85rem;
          margin-top: 1rem;
          margin-bottom: 0;
        }

        .faq-list {
          display: grid;
          gap: 0.8rem;
          max-width: 860px;
          margin: 0 auto;
        }

        .faq-item {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(23,56,56,0.04);
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
          background:
            radial-gradient(circle at 12% 20%, rgba(255,127,103,0.16), transparent 30%),
            radial-gradient(circle at 92% 88%, rgba(143,200,193,0.22), transparent 30%),
            linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 30px;
          padding: 2.55rem;
          text-align: center;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
        }

        .cta-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          margin-top: 1.4rem;
        }

        .footer {
          border-top: 1px solid rgba(23,56,56,0.08);
          padding: 1.5rem 0;
          color: #819693;
          font-size: 0.82rem;
          font-family: 'Inter', sans-serif;
          background: rgba(255,255,255,0.45);
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
          flex-wrap: wrap;
        }

        .footer-links a {
          color: #5f7774;
          text-decoration: none;
          font-weight: 800;
        }

        @media(max-width: 1020px) {
          .hero-grid,
          .radar-panel {
            grid-template-columns: 1fr;
          }

          .features-grid,
          .steps-grid,
          .proof-grid,
          .testimonial-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media(max-width: 760px) {
          .nav {
            padding: 0 1rem;
          }

          .nav-links .hide-mobile {
            display: none;
          }

          .hero {
            padding: 4.6rem 0 3.2rem;
          }

          .hero-title {
            letter-spacing: -0.065em;
          }

          .metric-grid,
          .features-grid,
          .steps-grid,
          .proof-grid,
          .testimonial-grid {
            grid-template-columns: 1fr;
          }

          .strip-card {
            align-items: flex-start;
          }

          .pipeline {
            grid-template-columns: 1fr;
          }

          .pipeline-arrow {
            display: none;
          }

          .score-row {
            grid-template-columns: 1fr;
            gap: 0.35rem;
          }

          .preview-card {
            border-radius: 24px;
          }

          .workflow-row {
            flex-wrap: wrap;
          }

          .section {
            padding: 3.6rem 0;
          }

          .cta-band {
            padding: 1.7rem;
          }
        }

        @media(max-width: 500px) {
          .brand-name {
            font-size: 0.95rem;
          }

          .nav-cta {
            padding: 0.62rem 0.8rem;
            font-size: 0.78rem;
          }

          .hero-actions,
          .cta-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .primary-btn,
          .secondary-btn,
          .ghost-btn {
            width: 100%;
          }

          .preview-footer {
            flex-direction: column;
          }
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="logo" aria-label="LeadMagnet home">
          <span className="brand-mark" />
          <span className="brand-name">
            <span className="lead">lead</span>
            <span className="magnet">magnet</span> inc
          </span>
        </Link>

        <div className="nav-links">
          <a href="#features" className="nav-link hide-mobile">
            Features
          </a>
          <a href="#workflow" className="nav-link hide-mobile">
            Workflow
          </a>
          <a href="#pricing" className="nav-link hide-mobile">
            Pricing
          </a>
          <a href="#faq" className="nav-link hide-mobile">
            FAQ
          </a>
          <Link href="/login" className="nav-link">
            Log in
          </Link>
          <Link href="/signup" className="nav-cta">
            Start Free Trial
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="kicker">
              <Icon name="spark" size={15} /> Built for marketing agencies
            </div>

            <h1 className="hero-title">
              Turn campaign engagement into <span>qualified sales leads.</span>
            </h1>

            <p className="hero-copy">
              LeadMagnet helps agencies capture prospects from LinkedIn and
              Instagram campaigns, qualify them with Lead Radar, and move the
              right leads into structured Gmail follow-ups.
            </p>

            <div className="hero-actions">
              <Link href="/signup" className="primary-btn">
                Start Free Trial <Icon name="arrow" size={16} />
              </Link>
              <a href="#workflow" className="secondary-btn">
                See the workflow
              </a>
            </div>

            <p className="hero-note">
              <Icon name="shield" size={16} />
              No credit card required. Try the full workflow before choosing a plan.
            </p>

            <div className="metric-grid">
              {metrics.map((metric) => (
                <div className="metric-card" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                  <small>{metric.detail}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="preview-card" aria-label="LeadMagnet workflow preview">
            <div className="preview-top">
              <div className="preview-title">Live lead workflow</div>
              <div className="status-pill">Automated flow</div>
            </div>

            <div className="workflow-preview">
              <div className="workflow-card featured">
                <div className="workflow-row">
                  <div className="workflow-icon">
                    <Icon name="campaign" size={18} />
                  </div>

                  <div className="workflow-content">
                    <div className="workflow-label">Campaign signal</div>
                    <div className="workflow-title">
                      A prospect engages with your campaign
                    </div>
                    <div className="workflow-copy">
                      Capture the source, campaign context, and follow-up intent
                      in one organized workspace.
                    </div>
                  </div>

                  <div className="workflow-status">Captured</div>
                </div>
              </div>

              <div className="pipeline">
                <div className="pipeline-step">
                  <strong>Capture</strong>
                  <span>Social campaigns</span>
                </div>

                <div className="pipeline-arrow">→</div>

                <div className="pipeline-step">
                  <strong>Score</strong>
                  <span>Lead Radar</span>
                </div>

                <div className="pipeline-arrow">→</div>

                <div className="pipeline-step">
                  <strong>Follow up</strong>
                  <span>Gmail sequence</span>
                </div>
              </div>

              <div className="workflow-card">
                <div className="workflow-row">
                  <div className="workflow-icon mint">
                    <Icon name="radar" size={18} />
                  </div>

                  <div className="workflow-content">
                    <div className="workflow-label">AI qualification</div>
                    <div className="workflow-title">
                      Matched against your ideal client profile
                    </div>
                    <div className="workflow-copy">
                      LeadMagnet highlights fit, outreach angle, and the next
                      best action before your team replies.
                    </div>
                  </div>

                  <div className="workflow-status ready">Ready</div>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-label">Recommended next step</div>
                <div className="insight-text">
                  Send a short personalized intro, mention the campaign
                  interaction, then move the lead into a structured follow-up
                  sequence.
                </div>
              </div>

              <div className="preview-footer">
                <span>Client dashboard updated</span>
                <span>Report-ready activity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="logo-strip">
        <div className="container">
          <div className="strip-card">
            <div className="strip-label">Designed for agency workflows</div>
            <div className="strip-items">
              <span className="strip-item">Lead capture</span>
              <span className="strip-item">ICP scoring</span>
              <span className="strip-item">Gmail follow-up</span>
              <span className="strip-item">Client reports</span>
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
              Run campaigns, organize lead data, create follow-up sequences,
              manage clients, and show results without switching between
              disconnected tools.
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

      <section className="section alt" id="workflow">
        <div className="container">
          <div className="section-head center">
            <div className="section-tag">How it works</div>
            <h2 className="section-title">
              From first signal to client-ready report in one simple flow.
            </h2>
            <p className="section-copy">
              The page now explains the product faster: what comes in, how it is
              qualified, and what the agency can show the client.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <div className="step-card" key={step.label}>
                <div className="step-label">{step.label}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="lead-radar">
        <div className="container radar-panel">
          <div className="radar-card dark">
            <div className="section-tag">Lead Radar</div>
            <h2 className="section-title" style={{ color: "#ffffff" }}>
              Qualify before your team spends time on outreach.
            </h2>
            <p className="section-copy" style={{ color: "rgba(255,255,255,0.76)" }}>
              Lead Radar gives the landing page a stronger product hook by
              explaining how agencies can prioritize prospects with ICP fit,
              source context, and recommended next actions.
            </p>

            <div className="radar-score">
              <div className="score-row">
                <span>ICP fit</span>
                <div className="score-track">
                  <div className="score-fill" style={{ width: "86%" }} />
                </div>
                <strong>86%</strong>
              </div>
              <div className="score-row">
                <span>Intent signal</span>
                <div className="score-track">
                  <div className="score-fill" style={{ width: "74%" }} />
                </div>
                <strong>74%</strong>
              </div>
              <div className="score-row">
                <span>Next action</span>
                <div className="score-track">
                  <div className="score-fill" style={{ width: "92%" }} />
                </div>
                <strong>Ready</strong>
              </div>
            </div>
          </div>

          <div className="proof-grid">
            {proof.map((item) => (
              <div className="proof-card" key={item.title}>
                <div className="feature-icon">
                  <Icon name="check" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="pricing">
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
              <div
                className={`plan-card ${plan.popular ? "popular" : ""}`}
                key={plan.name}
              >
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

      <section className="section" id="proof">
        <div className="container">
          <div className="section-head center">
            <div className="section-tag">Why agencies care</div>
            <h2 className="section-title">
              Clear value, sharper messaging, and more trust before signup.
            </h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <div className="testimonial-card" key={testimonial.name}>
                <p>“{testimonial.quote}”</p>
                <h3>{testimonial.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="faq">
        <div className="container">
          <div className="section-head center">
            <div className="section-tag">FAQ</div>
            <h2 className="section-title">Questions before you start?</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={faq.q}>
                <button
                  className="faq-question"
                  type="button"
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-${index}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.q}
                  <span aria-hidden="true">{openFaq === index ? "−" : "+"}</span>
                </button>

                {openFaq === index && (
                  <div className="faq-answer" id={`faq-${index}`}>
                    {faq.a}
                  </div>
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
              style={{ margin: "0 auto", maxWidth: 660 }}
            >
              Create your account, connect your platforms, and start organizing
              prospects from social campaigns with a cleaner agency workflow.
            </p>

            <div className="cta-actions">
              <Link href="/signup" className="primary-btn">
                Start Free Trial <Icon name="arrow" size={16} />
              </Link>
              <Link href="/contact" className="ghost-btn">
                Talk to support
              </Link>
            </div>
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
