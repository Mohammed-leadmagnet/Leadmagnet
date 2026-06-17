"use client";
import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Do I need a credit card to start the trial?", a: "No. Your 7-day free trial starts immediately with just your email. No payment info required. At the end of the trial, you choose to subscribe or walk away — no strings attached." },
    { q: "Is this allowed by LinkedIn?", a: "LeadMagnet is designed to support responsible lead organisation and follow-up workflows. Users are responsible for complying with LinkedIn's terms of service and for avoiding spam or unauthorised activity. We recommend conservative outreach limits and quality-first campaigns. Always review LinkedIn's guidelines before running campaigns." },
    { q: "What is a lead magnet exactly?", a: "A lead magnet is a free resource you offer in exchange for attention — a PDF guide, template, checklist, or video. You post about it on LinkedIn or Instagram and offer to send it to anyone who engages. LeadMagnet helps you organise and follow up with those engaged prospects from one dashboard." },
    { q: "How does outreach work?", a: "LeadMagnet captures engaged prospects from your campaigns and organises them in your dashboard. You can then follow up via personalised Gmail sequences with daily send limits and quality controls. We recommend conservative volumes and genuine, value-driven messages." },
    { q: "Can I connect multiple client accounts?", a: "Yes. Pro and Agency plans are built for agencies managing multiple clients. Each client has a separate workspace, campaigns, and leads — fully isolated from each other." },
    { q: "Which platforms does LeadMagnet support?", a: "LeadMagnet supports LinkedIn, Instagram, and Gmail. Connect Gmail via secure Google OAuth. Add LinkedIn and Instagram campaign sources through guided setup. Instagram integration is currently in beta." },
    { q: "Does LeadMagnet replace a CRM?", a: "No. LeadMagnet helps you capture and organise leads from social campaigns, then export or follow up via Gmail. You can use it alongside your existing CRM." },
    { q: "How does Gmail integration work?", a: "We use Google OAuth — you connect your Gmail account securely via Google's official login. Your password is never stored. We only request permission to send emails on your behalf for follow-up sequences." },
    { q: "What is Lead Radar?", a: "Lead Radar is a Scale-plan feature that helps agencies discover, score, and prioritise high-potential prospects. It includes ICP profile building, AI-powered scoring, recommendations, duplicate detection, and a monthly credit system. It turns your campaign data into qualified opportunities." },
  ];

  const features = [
    { icon: "🔗", title: "Campaign Manager", desc: "Create LinkedIn and Instagram campaigns in one click. Set your post URL and follow-up message — LeadMagnet organises engaged prospects into your dashboard automatically." },
    { icon: "📧", title: "Gmail Sequences", desc: "Connect Gmail securely via Google OAuth. Send personalised follow-up emails on a schedule — with [Name] and [Company] variables. No password stored." },
    { icon: "📊", title: "Leads Dashboard", desc: "All your prospects in one place. Search, filter by AI score, export to CSV, and archive leads. See name, company, headline, location and more at a glance." },
    { icon: "🤖", title: "AI Lead Scoring", desc: "Every lead is automatically scored as Hot, Warm, or Cold based on their job title, company, industry, and engagement signals. Focus on the leads most likely to convert." },
    { icon: "🏢", title: "Agency Client Manager", desc: "Manage multiple clients from one dashboard. Track campaigns, send automated reports, monitor client health, and give each client a branded portal." },
    { icon: "🛰️", title: "Lead Radar", desc: "Our Scale-plan intelligence engine. Build ICP profiles, score prospects with AI, detect duplicates, and get personalised outreach recommendations for every lead." },
  ];

  const plans = [
    {
      name: "Starter", price: "€49", period: "/ month", desc: "For consultants & freelancers",
      features: ["1 client workspace", "5 active campaigns", "LinkedIn lead capture", "Leads dashboard", "CSV export", "Basic analytics", "Email support"],
      popular: false, isScale: false,
    },
    {
      name: "Pro", price: "€99", period: "/ month", desc: "For growing agencies",
      features: ["5 client workspaces", "25 active campaigns", "Everything in Starter", "Instagram lead capture", "Gmail follow-up sequences", "AI lead score filters", "Priority support"],
      popular: true, isScale: false,
    },
    {
      name: "Agency", price: "€199", period: "/ month", desc: "For full-scale agencies",
      features: ["15 client workspaces", "Unlimited campaigns", "Everything in Pro", "Client Manager", "Automated PDF reports", "White-label client portal", "Client health alerts"],
      popular: false, isScale: false,
    },
    {
      name: "Scale", price: "€399", period: "/ month", desc: "For high-volume agencies",
      features: ["Unlimited workspaces", "Everything in Agency", "Lead Radar", "ICP profile builder", "AI recommendations", "Lead scoring engine", "2,000 monthly credits"],
      popular: false, isScale: true,
    },
  ];

  const stats = [
    { n: "< 10min", l: "Setup time" },
    { n: "3", l: "Platforms supported" },
    { n: "7-day", l: "Free trial" },
    { n: "100%", l: "No credit card needed" },
  ];

  const howItWorks = [
    { step: "01", title: "Connect your platforms", desc: "Connect Gmail via secure Google OAuth. Add LinkedIn and Instagram campaign sources through guided setup." },
    { step: "02", title: "Create a campaign", desc: "Add your post URL and follow-up message. Choose which platform to track engagement on." },
    { step: "03", title: "Leads are organised automatically", desc: "Engaged prospects from your campaigns appear in your leads dashboard — organised, scored, and ready." },
    { step: "04", title: "Follow up with Gmail sequences", desc: "Send personalised follow-up emails that go out on a schedule — tailored for each lead with dynamic variables." },
    { step: "05", title: "Report results to clients", desc: "Send branded performance reports directly to clients — weekly, monthly, or on demand. Show leads, scores, and ROI." },
  ];

  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: "#080c09", color: "#d1e0d6", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --green: #22c97a; --green-dim: rgba(34,201,122,0.1); --green-border: rgba(34,201,122,0.2); --bg: #080c09; --bg2: #0b120d; --bg3: #0f1a11; --border: rgba(255,255,255,0.07); }
        html { scroll-behavior: smooth; }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 60px; background: rgba(8,12,9,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
        .nav-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--green); letter-spacing: -0.02em; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; }
        .nav-logo-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; box-shadow: 0 0 10px rgba(34,201,122,0.5); }
        .nav-links { display: flex; gap: 1.75rem; list-style: none; }
        .nav-links a { color: #3d5240; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.15s; }
        .nav-links a:hover { color: #94a3b8; }
        .nav-cta { background: var(--green); color: #071209; font-family: 'Inter', sans-serif; font-weight: 600; padding: 0.5rem 1.1rem; border-radius: 9px; text-decoration: none; font-size: 0.855rem; transition: all 0.15s; }
        .nav-cta:hover { background: #1db36c; transform: translateY(-1px); }
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 8rem 1.5rem 5rem; position: relative; overflow: hidden; }
        .hero-glow { position: absolute; top: -120px; left: 50%; transform: translateX(-50%); width: 800px; height: 600px; background: radial-gradient(ellipse, rgba(34,201,122,0.08) 0%, transparent 70%); pointer-events: none; }
        .hero-glow2 { position: absolute; bottom: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(34,201,122,0.05) 0%, transparent 70%); pointer-events: none; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: var(--green-dim); border: 1px solid var(--green-border); color: var(--green); font-size: 0.72rem; font-weight: 600; padding: 0.35rem 0.875rem; border-radius: 100px; margin-bottom: 2rem; letter-spacing: 0.06em; text-transform: uppercase; }
        .badge-dot { width: 5px; height: 5px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(34,201,122,0.4); } 50% { opacity:0.6; box-shadow: 0 0 0 4px rgba(34,201,122,0); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .hero-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(2.6rem, 6.5vw, 5rem); font-weight: 800; line-height: 1.06; letter-spacing: -0.04em; color: #e8f4ec; max-width: 860px; margin-bottom: 1.5rem; animation: fadeUp 0.6s 0.1s both; }
        .hero-title em { font-style: normal; color: var(--green); }
        .hero-sub { font-size: 1.05rem; color: #3d5240; max-width: 560px; margin-bottom: 2.5rem; font-weight: 400; line-height: 1.65; animation: fadeUp 0.6s 0.2s both; }
        .btn-row { display: flex; gap: 0.875rem; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s both; }
        .btn-primary { background: var(--green); color: #071209; font-family: 'Inter', sans-serif; font-weight: 600; padding: 0.8rem 1.75rem; border-radius: 10px; text-decoration: none; font-size: 0.925rem; transition: all 0.15s; }
        .btn-primary:hover { background: #1db36c; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,201,122,0.2); }
        .btn-secondary { background: transparent; color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); font-family: 'Inter', sans-serif; font-weight: 500; padding: 0.8rem 1.75rem; border-radius: 10px; text-decoration: none; font-size: 0.925rem; transition: all 0.15s; }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.2); color: #c4d4c8; }
        .hero-note { font-size: 0.775rem; color: #2a3d2e; margin-top: 1.125rem; animation: fadeUp 0.6s 0.4s both; }
        .stats-bar { display: flex; justify-content: center; flex-wrap: wrap; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg2); }
        .stat-item { flex: 1; min-width: 150px; max-width: 240px; padding: 1.625rem 1.5rem; text-align: center; border-right: 1px solid var(--border); }
        .stat-item:last-child { border-right: none; }
        .stat-n { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.875rem; font-weight: 800; color: var(--green); letter-spacing: -0.03em; }
        .stat-l { font-size: 0.72rem; color: #2a3d2e; margin-top: 0.25rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500; }
        section { padding: 5.5rem 1.5rem; }
        .container { max-width: 1080px; margin: 0 auto; }
        .section-tag { display: inline-block; font-size: 0.7rem; font-weight: 600; color: var(--green); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.875rem; }
        .section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(1.75rem, 3.5vw, 2.5rem); font-weight: 800; letter-spacing: -0.03em; color: #e8f4ec; margin-bottom: 0.875rem; line-height: 1.1; }
        .section-sub { color: #3d5240; font-size: 1rem; max-width: 520px; font-weight: 400; line-height: 1.6; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 1.25rem; margin-top: 2.75rem; }
        .feature-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 16px; padding: 1.625rem; transition: all 0.15s; }
        .feature-card:hover { border-color: var(--green-border); transform: translateY(-2px); }
        .f-icon-wrap { width: 40px; height: 40px; border-radius: 10px; background: var(--green-dim); border: 1px solid var(--green-border); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin-bottom: 1rem; }
        .f-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.935rem; font-weight: 700; color: #c4d4c8; margin-bottom: 0.4rem; }
        .f-desc { color: #2d4a33; font-size: 0.845rem; line-height: 1.6; }
        .how-it-works { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .steps-list { display: flex; flex-direction: column; margin-top: 2.75rem; }
        .step-item { display: flex; gap: 2rem; align-items: flex-start; padding: 1.5rem 0; border-bottom: 1px solid var(--border); }
        .step-item:last-child { border-bottom: none; }
        .step-num { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.75rem; font-weight: 800; color: var(--green); background: var(--green-dim); border: 1px solid var(--green-border); border-radius: 8px; padding: 0.3rem 0.6rem; flex-shrink: 0; }
        .step-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1rem; font-weight: 700; color: #c4d4c8; margin-bottom: 0.375rem; }
        .step-desc { font-size: 0.875rem; color: #2d4a33; line-height: 1.6; }
        .compliance-box { background: rgba(251,191,36,0.04); border: 1px solid rgba(251,191,36,0.15); border-radius: 14px; padding: 1.5rem; margin-top: 3rem; }
        .compliance-title { font-size: 0.835rem; font-weight: 600; color: #fbbf24; margin-bottom: 0.5rem; }
        .compliance-text { font-size: 0.815rem; color: #92752a; line-height: 1.65; }
        .pricing-surface { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .pricing-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-top: 2.75rem; }
        .plan-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 18px; padding: 1.75rem; position: relative; display: flex; flex-direction: column; }
        .plan-card:hover { border-color: var(--green-border); }
        .plan-card.popular { border-color: rgba(34,201,122,0.35); background: linear-gradient(135deg, rgba(34,201,122,0.04) 0%, var(--bg3) 60%); }
        .plan-card.scale { border-color: rgba(147,51,234,0.25); background: linear-gradient(135deg, rgba(147,51,234,0.04) 0%, var(--bg3) 60%); }
        .pop-label { position: absolute; top: 1rem; right: 1rem; background: rgba(34,201,122,0.1); border: 1px solid rgba(34,201,122,0.25); color: var(--green); font-size: 0.64rem; font-weight: 700; padding: 0.175rem 0.6rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.08em; }
        .scale-label { position: absolute; top: 1rem; right: 1rem; background: rgba(147,51,234,0.1); border: 1px solid rgba(147,51,234,0.25); color: #a78bfa; font-size: 0.64rem; font-weight: 700; padding: 0.175rem 0.6rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.08em; }
        .plan-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.5rem; }
        .plan-price-wrap { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 0.35rem; }
        .plan-price { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2.25rem; font-weight: 800; color: #e8f4ec; letter-spacing: -0.04em; }
        .plan-period { font-size: 0.82rem; color: #2a3d2e; }
        .plan-desc { font-size: 0.78rem; color: #2a3d2e; margin-bottom: 1.25rem; }
        .plan-divider { border: none; border-top: 1px solid var(--border); margin-bottom: 1.125rem; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1.5rem; flex: 1; }
        .plan-features li { font-size: 0.8rem; color: #3d5240; display: flex; align-items: flex-start; gap: 0.5rem; line-height: 1.35; }
        .plan-features li::before { content: '✓'; color: var(--green); font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 1px; }
        .plan-card.scale .plan-features li::before { color: #a78bfa; }
        .plan-btn { display: block; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.84rem; padding: 0.7rem; border-radius: 10px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #94a3b8; width: 100%; transition: all 0.15s; }
        .plan-btn:hover { border-color: rgba(255,255,255,0.2); color: #c4d4c8; }
        .plan-card.popular .plan-btn { background: var(--green); color: #071209; border-color: var(--green); }
        .plan-card.popular .plan-btn:hover { background: #1db36c; }
        .plan-card.scale .plan-btn { background: linear-gradient(135deg,#a78bfa,#7c3aed); color: #fff; border-color: #a78bfa; }
        .faq-list { display: flex; flex-direction: column; margin-top: 2.75rem; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-q { width: 100%; text-align: left; background: none; border: none; cursor: pointer; color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 0.935rem; font-weight: 500; padding: 1.25rem 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: color 0.15s; }
        .faq-q:hover { color: #c4d4c8; }
        .faq-icon { color: #2a3d2e; font-size: 1.1rem; transition: transform 0.2s; flex-shrink: 0; }
        .faq-icon.open { transform: rotate(45deg); color: var(--green); }
        .faq-a-wrap { overflow: hidden; max-height: 0; transition: max-height 0.3s ease; }
        .faq-a-wrap.open { max-height: 400px; }
        .faq-a { font-size: 0.875rem; color: #2d4a33; padding-bottom: 1.25rem; line-height: 1.7; max-width: 720px; }
        .cta-surface { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); text-align: center; padding: 6rem 1.5rem; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; bottom: -80px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(34,201,122,0.07) 0%, transparent 70%); pointer-events: none; }
        .cta-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(1.875rem, 4.5vw, 3.25rem); font-weight: 800; color: #e8f4ec; letter-spacing: -0.04em; margin-bottom: 0.875rem; line-height: 1.1; }
        .cta-sub { color: #3d5240; font-size: 1rem; margin-bottom: 2.25rem; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
        .cta-note { font-size: 0.755rem; color: #2a3d2e; margin-top: 1rem; }
        footer { border-top: 1px solid var(--border); padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #2a3d2e; flex-wrap: wrap; gap: 1rem; background: var(--bg2); }
        .footer-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--green); font-size: 0.975rem; display: flex; align-items: center; gap: 0.35rem; }
        .footer-dot { width: 7px; height: 7px; background: var(--green); border-radius: 50%; }
        .footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .footer-links a { color: #2a3d2e; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .footer-links a:hover { color: #4d6b54; }
        .disclaimer { font-size: 0.72rem; color: #1e2b20; text-align: center; padding: 1rem 2rem; background: var(--bg2); border-top: 1px solid var(--border); line-height: 1.6; }
        @media(max-width:1100px){.pricing-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:600px){.pricing-grid{grid-template-columns:1fr;}.nav-links{display:none;}}
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo"><span className="nav-logo-dot"></span> LeadMagnet</a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="/signup" className="nav-cta">Start Free Trial</a>
      </nav>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="badge"><span className="badge-dot" />Built for Marketing Agencies</div>
        <h1 className="hero-title">Turn social engagement into<br /><em>qualified leads</em></h1>
        <p className="hero-sub">LeadMagnet helps agencies capture engaged prospects from LinkedIn and Instagram campaigns, organise them in one dashboard, and automate responsible Gmail follow-ups.</p>
        <div className="btn-row">
          <a href="/signup" className="btn-primary">Start Free Trial →</a>
          <a href="#how-it-works" className="btn-secondary">See how it works</a>
        </div>
        <p className="hero-note">No credit card required · 7-day free trial · Built for agencies managing multiple clients</p>
      </section>

      <div className="stats-bar">
        {stats.map(s => (<div className="stat-item" key={s.l}><div className="stat-n">{s.n}</div><div className="stat-l">{s.l}</div></div>))}
      </div>

      <section id="features">
        <div className="container">
          <div className="section-tag">Features</div>
          <h2 className="section-title">Everything your agency needs<br />to scale lead generation</h2>
          <p className="section-sub">From campaign management to AI lead intelligence — one platform handles your entire pipeline.</p>
          <div className="features-grid">
            {features.map(f => (<div className="feature-card" key={f.title}><div className="f-icon-wrap">{f.icon}</div><div className="f-title">{f.title}</div><div className="f-desc">{f.desc}</div></div>))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-tag">How it works</div>
          <h2 className="section-title">How agencies use LeadMagnet</h2>
          <p className="section-sub">A simple 5-step workflow that turns social engagement into organised, followed-up leads.</p>
          <div className="steps-list">
            {howItWorks.map(s => (<div className="step-item" key={s.step}><div className="step-num">{s.step}</div><div><div className="step-title">{s.title}</div><div className="step-desc">{s.desc}</div></div></div>))}
          </div>
          <div className="compliance-box">
            <div className="compliance-title">⚠️ Responsible Use Notice</div>
            <div className="compliance-text">Users are responsible for ensuring their campaigns comply with LinkedIn's, Instagram's, Gmail's, and applicable privacy regulations. LeadMagnet is designed to support responsible outreach workflows — not spam or unauthorised activity. Always review the terms of service of each platform before running campaigns. LeadMagnet Inc. is not affiliated with, endorsed by, or officially connected to LinkedIn, Instagram, Google, or Gmail.</div>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing-surface">
        <div className="container">
          <div className="section-tag">Pricing</div>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-sub">Start free for 7 days. No credit card required. Scale as your agency grows.</p>
          <div className="pricing-grid">
            {plans.map(p => (
              <div className={`plan-card${p.popular ? " popular" : ""}${p.isScale ? " scale" : ""}`} key={p.name}>
                {p.popular && <div className="pop-label">Most Popular</div>}
                {p.isScale && <div className="scale-label">Premium</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price-wrap"><div className="plan-price">{p.price}</div><div className="plan-period">{p.period}</div></div>
                <div className="plan-desc">{p.desc}</div>
                <hr className="plan-divider" />
                <ul className="plan-features">{p.features.map(f => <li key={f}>{f}</li>)}</ul>
                <button className="plan-btn" onClick={() => window.location.href = "/signup"}>Start Free Trial</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="container">
          <div className="section-tag">FAQ</div>
          <h2 className="section-title">Common questions</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>{f.q}<span className={`faq-icon${openFaq === i ? " open" : ""}`}>+</span></button>
                <div className={`faq-a-wrap${openFaq === i ? " open" : ""}`}><div className="faq-a">{f.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-surface">
        <div className="cta-glow" />
        <div className="container">
          <h2 className="cta-title">Start turning campaign engagement<br />into qualified leads today</h2>
          <p className="cta-sub">Join agencies across Europe capturing qualified prospects from LinkedIn and Instagram — and following up responsibly via Gmail.</p>
          <div className="btn-row"><a href="/signup" className="btn-primary">Start Your Free 7-Day Trial →</a></div>
          <p className="cta-note">No credit card · Cancel anytime · Set up in under 10 minutes</p>
        </div>
      </div>

      <footer>
        <div className="footer-logo"><span className="footer-dot"></span> LeadMagnet</div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/blog">Blog</a>
          <a href="#faq">FAQ</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <div>© 2026 LeadMagnet Inc. All rights reserved.</div>
      </footer>
      <div className="disclaimer">LeadMagnet is not affiliated with, endorsed by, or officially connected to LinkedIn, Instagram, Google, or Gmail. All trademarks belong to their respective owners.</div>
    </main>
  );
}
