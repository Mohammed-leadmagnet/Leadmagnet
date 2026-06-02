"use client";
import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Do I need a credit card to start the trial?", a: "No. Your 7-day free trial starts immediately with just your email. No payment info required. At the end of the trial, you can choose to subscribe or walk away — no strings attached." },
    { q: "Is this allowed by LinkedIn?", a: "LeadMagnet uses cookie-based automation with human-like delays, making it safe and undetectable. Thousands of users run it safely every day. We provide safe usage guidelines to protect your account." },
    { q: "What is a lead magnet exactly?", a: "A lead magnet is a free resource you offer in exchange for attention — a PDF guide, template, checklist, or video. On LinkedIn, you post about it and offer to DM it to anyone who comments. LeadMagnet automates the entire delivery." },
    { q: "How many DMs can I send per day?", a: "We recommend capping at 50–80 DMs per day for account safety. LeadMagnet automatically paces delivery with randomized human-like delays so it never looks like bot activity." },
    { q: "Can I connect multiple LinkedIn accounts?", a: "Yes, multi-account management is available on the Agency plan — ideal for agencies managing LinkedIn automation for multiple clients." },
    { q: "Which platforms does LeadMagnet support?", a: "LeadMagnet supports LinkedIn, Instagram, and Gmail. Connect your accounts in one click and manage all your outreach from one dashboard." },
  ];

  const features = [
    { icon: "🔗", title: "LinkedIn Automation", desc: "Connect your LinkedIn account and automatically capture leads who comment on your posts. Phantombuster powers the scraping engine behind the scenes." },
    { icon: "📧", title: "Gmail Sequences", desc: "Connect Gmail with one click via Google OAuth. Send automated follow-up emails on day 1, 7, 14, and 30 — personalised with [Name] and [Company]." },
    { icon: "📊", title: "Leads Dashboard", desc: "All your leads in one place. Search, filter, export to CSV, and archive leads. See first name, company, headline, location and more." },
    { icon: "📈", title: "Analytics", desc: "Daily leads bar chart, location breakdown, and industry breakdown. Know exactly where your best leads are coming from." },
    { icon: "🏢", title: "Agency Client Manager", desc: "Manage multiple clients from one dashboard. Add clients, track their campaigns, and deliver results at scale." },
    { icon: "🤖", title: "Campaign Manager", desc: "Create LinkedIn and Instagram campaigns with one click. Set your post URL, DM template, and let LeadMagnet run it 24/7." },
  ];

  const plans = [
    {
      name: "Starter",
      price: "€49",
      period: "/ month",
      desc: "For solopreneurs & coaches",
      features: ["1 LinkedIn account", "Up to 10 active campaigns", "LinkedIn automation", "Leads dashboard", "CSV export", "Basic analytics", "Email support"],
      popular: false,
      cta: "Start Free Trial",
    },
    {
      name: "Pro",
      price: "€99",
      period: "/ month",
      desc: "For growing agencies",
      features: ["Up to 5 client accounts", "Up to 50 active campaigns", "Everything in Starter", "Instagram automation", "Gmail sequences", "Advanced analytics", "Priority support"],
      popular: true,
      cta: "Start Free Trial",
    },
    {
      name: "Agency",
      price: "€199",
      period: "/ month",
      desc: "For full-scale agencies",
      features: ["Unlimited client accounts", "Unlimited campaigns", "Everything in Pro", "Agency client manager", "White-label dashboard", "Dedicated account manager", "Custom integrations"],
      popular: false,
      cta: "Start Free Trial",
    },
  ];

  const stats = [
    { n: "0", l: "DMs Delivered" },
    { n: "0", l: "Campaigns Created" },
    { n: "0", l: "Leads Generated" },
    { n: "< 10m", l: "Avg Setup Time" },
  ];

  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: "#080c09", color: "#d1e0d6", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --green: #22c97a;
          --green-dim: rgba(34,201,122,0.1);
          --green-border: rgba(34,201,122,0.2);
          --bg: #080c09;
          --bg2: #0b120d;
          --bg3: #0f1a11;
          --border: rgba(255,255,255,0.07);
          --muted: #4d6b54;
          --text: #d1e0d6;
          --text-dim: #3d5240;
        }
        html { scroll-behavior: smooth; }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 60px; background: rgba(8,12,9,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
        .nav-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--green); letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.4rem; }
        .nav-links { display: flex; gap: 1.75rem; list-style: none; }
        .nav-links a { color: #3d5240; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.15s; }
        .nav-links a:hover { color: #94a3b8; }
        .nav-cta { background: var(--green); color: #071209; font-family: 'Inter', sans-serif; font-weight: 600; padding: 0.5rem 1.1rem; border-radius: 9px; text-decoration: none; font-size: 0.855rem; transition: all 0.15s; letter-spacing: -0.01em; }
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
        .hero-sub { font-size: 1.05rem; color: #3d5240; max-width: 520px; margin-bottom: 2.5rem; font-weight: 400; line-height: 1.65; animation: fadeUp 0.6s 0.2s both; }
        .btn-row { display: flex; gap: 0.875rem; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s both; }
        .btn-primary { background: var(--green); color: #071209; font-family: 'Inter', sans-serif; font-weight: 600; padding: 0.8rem 1.75rem; border-radius: 10px; text-decoration: none; font-size: 0.925rem; transition: all 0.15s; letter-spacing: -0.01em; }
        .btn-primary:hover { background: #1db36c; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,201,122,0.2); }
        .btn-secondary { background: transparent; color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); font-family: 'Inter', sans-serif; font-weight: 500; padding: 0.8rem 1.75rem; border-radius: 10px; text-decoration: none; font-size: 0.925rem; transition: all 0.15s; }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.2); color: #c4d4c8; }
        .hero-note { font-size: 0.775rem; color: #2a3d2e; margin-top: 1.125rem; animation: fadeUp 0.6s 0.4s both; letter-spacing: 0.01em; }
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
        .f-desc { color: #2d4a33; font-size: 0.845rem; line-height: 1.6; font-weight: 400; }
        .pricing-surface { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 1.25rem; margin-top: 2.75rem; }
        .plan-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 18px; padding: 1.875rem; position: relative; transition: border-color 0.15s; }
        .plan-card.popular { border-color: rgba(34,201,122,0.35); background: linear-gradient(135deg, rgba(34,201,122,0.04) 0%, var(--bg3) 60%); }
        .pop-label { position: absolute; top: 1.125rem; right: 1.125rem; background: rgba(34,201,122,0.1); border: 1px solid rgba(34,201,122,0.25); color: var(--green); font-size: 0.67rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.08em; }
        .plan-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.925rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.625rem; }
        .plan-price-wrap { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 0.375rem; }
        .plan-price { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2.375rem; font-weight: 800; color: #e8f4ec; letter-spacing: -0.04em; }
        .plan-period { font-size: 0.875rem; color: #2a3d2e; font-weight: 400; }
        .plan-desc { font-size: 0.8rem; color: #2a3d2e; margin-bottom: 1.5rem; font-weight: 400; }
        .plan-divider { border: none; border-top: 1px solid var(--border); margin-bottom: 1.25rem; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1.875rem; }
        .plan-features li { font-size: 0.845rem; color: #3d5240; display: flex; align-items: center; gap: 0.55rem; font-weight: 400; }
        .plan-features li::before { content: '✓'; color: var(--green); font-weight: 700; font-size: 0.8rem; flex-shrink: 0; }
        .plan-btn { display: block; text-align: center; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 0.875rem; padding: 0.75rem; border-radius: 10px; text-decoration: none; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #94a3b8; width: 100%; transition: all 0.15s; letter-spacing: -0.01em; }
        .plan-btn:hover { border-color: rgba(255,255,255,0.2); color: #c4d4c8; }
        .plan-card.popular .plan-btn { background: var(--green); color: #071209; border-color: var(--green); }
        .plan-card.popular .plan-btn:hover { background: #1db36c; }
        .faq-list { display: flex; flex-direction: column; margin-top: 2.75rem; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-q { width: 100%; text-align: left; background: none; border: none; cursor: pointer; color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 0.935rem; font-weight: 500; padding: 1.25rem 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: color 0.15s; }
        .faq-q:hover { color: #c4d4c8; }
        .faq-icon { color: #2a3d2e; font-size: 1.1rem; transition: transform 0.2s; flex-shrink: 0; }
        .faq-icon.open { transform: rotate(45deg); color: var(--green); }
        .faq-a { font-size: 0.875rem; color: #2d4a33; padding-bottom: 1.25rem; line-height: 1.7; font-weight: 400; max-width: 720px; }
        .cta-surface { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); text-align: center; padding: 6rem 1.5rem; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; bottom: -80px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(34,201,122,0.07) 0%, transparent 70%); pointer-events: none; }
        .cta-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(1.875rem, 4.5vw, 3.25rem); font-weight: 800; color: #e8f4ec; letter-spacing: -0.04em; margin-bottom: 0.875rem; line-height: 1.1; }
        .cta-sub { color: #3d5240; font-size: 1rem; margin-bottom: 2.25rem; font-weight: 400; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }
        .cta-note { font-size: 0.755rem; color: #2a3d2e; margin-top: 1rem; letter-spacing: 0.01em; }
        footer { border-top: 1px solid var(--border); padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #2a3d2e; flex-wrap: wrap; gap: 1rem; background: var(--bg2); }
        .footer-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--green); font-size: 0.975rem; letter-spacing: -0.02em; }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a { color: #2a3d2e; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .footer-links a:hover { color: #4d6b54; }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">⚡ LeadMagnet</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="/signup" className="nav-cta">Start Free Trial</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="badge"><span className="badge-dot" />LinkedIn · Instagram · Gmail Automation</div>
        <h1 className="hero-title">The lead generation platform<br /><em>built for agencies</em></h1>
        <p className="hero-sub">Automate your LinkedIn, Instagram, and Gmail outreach. Collect leads, send DMs, follow up — all on autopilot. Your clients get results while you sleep.</p>
        <div className="btn-row">
          <a href="/signup" className="btn-primary">Start Free Trial →</a>
          <a href="#features" className="btn-secondary">See how it works</a>
        </div>
        <p className="hero-note">No credit card required · 7-day free trial · Cancel anytime</p>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {stats.map(s => (
          <div className="stat-item" key={s.l}>
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features">
        <div className="container">
          <div className="section-tag">Features</div>
          <h2 className="section-title">Everything your agency needs<br />to scale lead generation</h2>
          <p className="section-sub">From LinkedIn automation to Gmail sequences — one platform handles your entire outreach pipeline automatically.</p>
          <div className="features-grid">
            {features.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="f-icon-wrap">{f.icon}</div>
                <div className="f-title">{f.title}</div>
                <div className="f-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-surface">
        <div className="container">
          <div className="section-tag">Pricing</div>
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="section-sub">Start free for 7 days. No credit card required. Scale as your agency grows.</p>
          <div className="pricing-grid">
            {plans.map(p => (
              <div className={`plan-card${p.popular ? " popular" : ""}`} key={p.name}>
                {p.popular && <div className="pop-label">Most Popular</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price-wrap">
                  <div className="plan-price">{p.price}</div>
                  <div className="plan-period">{p.period}</div>
                </div>
                <div className="plan-desc">{p.desc}</div>
                <hr className="plan-divider" />
                <ul className="plan-features">
                  {p.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className="plan-btn" onClick={() => window.location.href = "/signup"}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <div className="section-tag">FAQ</div>
          <h2 className="section-title">Common questions</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <span className={`faq-icon${openFaq === i ? " open" : ""}`}>+</span>
                </button>
                {openFaq === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-surface">
        <div className="cta-glow" />
        <div className="container">
          <h2 className="cta-title">Start generating leads<br />on autopilot today</h2>
          <p className="cta-sub">Join agencies and consultants across Europe turning LinkedIn comments into paying customers — automatically.</p>
          <div className="btn-row">
            <a href="/signup" className="btn-primary">Start Your Free 7-Day Trial →</a>
          </div>
          <p className="cta-note">No credit card · Cancel anytime · Set up in under 10 minutes</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">⚡ LeadMagnet</div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Voorwaarden</a>
        </div>
        <div>© 2026 LeadMagnet Inc. All rights reserved.</div>
      </footer>
    </main>
  );
}