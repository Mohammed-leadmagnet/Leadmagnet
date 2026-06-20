export const metadata = {
  title: "Terms of Service — LeadMagnet Inc",
  description: "Terms of Service for LeadMagnet Inc.",
};

function Icon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

export default function TermsOfService() {
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
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          color: #173838;
        }

        .nav {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(23,56,56,0.08);
          padding: 0 1.75rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          gap: 0.7rem;
        }

        .nav-link {
          color: #5f7774;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.48rem 0.85rem;
          border-radius: 9px;
          border: 1px solid transparent;
        }

        .nav-link:hover {
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border-color: rgba(255,127,103,0.18);
        }

        .nav-cta {
          background: #ff7f67;
          color: #173838;
          font-weight: 900;
          font-size: 0.82rem;
          padding: 0.58rem 1rem;
          border-radius: 9px;
          text-decoration: none;
          box-shadow: 0 10px 22px rgba(255,127,103,0.22);
        }

        .container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 4rem 1.5rem 5rem;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .kicker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          color: #ff7f67;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 0.9rem;
        }

        .kicker-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: rgba(255,127,103,0.10);
          border: 1px solid rgba(255,127,103,0.22);
          color: #ff7f67;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.06em;
          margin-bottom: 0.75rem;
        }

        .subtitle {
          color: #5f7774;
          font-size: 0.95rem;
          line-height: 1.65;
          max-width: 660px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }

        .terms-card {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          box-shadow: 0 18px 40px rgba(23,56,56,0.06);
          border-radius: 24px;
          padding: 2rem;
        }

        .updated {
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          color: #ff7f67;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.55rem 0.85rem;
          border-radius: 100px;
          display: inline-flex;
          margin-bottom: 1.5rem;
          font-family: 'Inter', sans-serif;
        }

        h2 {
          font-size: 1.05rem;
          font-weight: 900;
          color: #173838;
          margin: 1.7rem 0 0.65rem;
          letter-spacing: -0.02em;
        }

        h2:first-of-type {
          margin-top: 0;
        }

        p, li {
          color: #5f7774;
          font-size: 0.9rem;
          line-height: 1.75;
          font-family: 'Inter', sans-serif;
        }

        ul {
          padding-left: 1.2rem;
          margin-top: 0.5rem;
        }

        li {
          margin-bottom: 0.35rem;
        }

        strong {
          color: #173838;
          font-weight: 800;
        }

        a {
          color: #ff7f67;
          font-weight: 800;
          text-decoration: none;
        }

        .footer-note {
          margin-top: 1.75rem;
          background: rgba(143,200,193,0.14);
          border: 1px solid rgba(143,200,193,0.30);
          color: #2f625d;
          border-radius: 16px;
          padding: 1rem 1.1rem;
          font-size: 0.84rem;
          line-height: 1.65;
          font-family: 'Inter', sans-serif;
        }

        @media(max-width:700px) {
          .nav {
            padding: 0 1rem;
          }

          .nav-link {
            display: none;
          }

          .brand-name {
            font-size: 0.95rem;
          }

          .container {
            padding: 3rem 1rem 4rem;
          }

          .terms-card {
            padding: 1.5rem;
            border-radius: 20px;
          }
        }
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">
          <span className="brand-mark" />
          <span className="brand-name">
            <span className="lead">lead</span>
            <span className="magnet">magnet</span> inc
          </span>
        </a>

        <div className="nav-links">
          <a href="/pricing" className="nav-link">Pricing</a>
          <a href="/privacy" className="nav-link">Privacy</a>
          <a href="/contact" className="nav-link">Support</a>
          <a href="/login" className="nav-link">Log in</a>
          <a href="/signup" className="nav-cta">Start Free Trial</a>
        </div>
      </nav>

      <section className="container">
        <div className="header">
          <div className="kicker">
            <span className="kicker-icon"><Icon size={14} /></span>
            Legal
          </div>

          <h1 className="title">Terms of Service</h1>

          <p className="subtitle">
            These terms explain the rules for using LeadMagnet Inc, including our website, dashboard, integrations, automation tools, client portals, and related services.
          </p>
        </div>

        <article className="terms-card">
          <div className="updated">Last updated: June 2026</div>

          <h2>1. Acceptance of these terms</h2>
          <p>
            By accessing or using LeadMagnet Inc, you agree to these Terms of Service. If you do not agree, you must not use the service.
          </p>

          <h2>2. The service</h2>
          <p>
            LeadMagnet provides tools for lead capture, campaign tracking, client management, reporting, email sequences, and related automation workflows. Features may include integrations with platforms such as LinkedIn, Instagram, Gmail, Stripe, and other third-party services.
          </p>

          <h2>3. Accounts and eligibility</h2>
          <p>
            You must provide accurate account information and keep your login credentials secure. You are responsible for all activity that occurs under your account.
          </p>
          <p>
            You must be legally able to enter into these terms and use the service in compliance with applicable laws.
          </p>

          <h2>4. Your responsibilities</h2>
          <p>
            You are responsible for how you use LeadMagnet, including campaigns, messages, uploaded data, lead lists, client data, and third-party integrations.
          </p>
          <ul>
            <li>You must only use LeadMagnet for lawful business purposes.</li>
            <li>You must not send spam, deceptive messages, or unlawful outreach.</li>
            <li>You must not upload or process data you do not have permission to use.</li>
            <li>You must comply with platform rules for LinkedIn, Instagram, Gmail, and any other connected services.</li>
            <li>You must comply with applicable privacy, marketing, and data protection laws.</li>
          </ul>

          <h2>5. Third-party platforms and integrations</h2>
          <p>
            LeadMagnet may connect with third-party services. Your use of those services is also governed by their own terms, policies, and platform rules.
          </p>
          <p>
            We are not responsible for changes, outages, restrictions, account actions, API limits, or policy enforcement by third-party platforms.
          </p>

          <h2>6. Automation and outreach</h2>
          <p>
            You are responsible for reviewing, approving, and monitoring any automated workflows, messages, sequences, or campaigns you create through LeadMagnet.
          </p>
          <p>
            We do not guarantee that any campaign will generate a specific number of leads, sales, replies, conversions, or revenue.
          </p>

          <h2>7. Client portals and agency use</h2>
          <p>
            If you use LeadMagnet to manage clients, you are responsible for your relationship with those clients, the accuracy of reports, and the data you make available through client portals.
          </p>

          <h2>8. Subscriptions, trials, and payments</h2>
          <p>
            Some features require a paid plan. Pricing, trial terms, usage limits, and plan features may change over time.
          </p>
          <p>
            Payments are processed through Stripe or another payment provider. By starting a paid plan, you authorize the applicable recurring charges unless canceled according to the billing process.
          </p>

          <h2>9. Cancellations and refunds</h2>
          <p>
            You may cancel your subscription according to the instructions in your account or by contacting support. Unless required by law or explicitly stated otherwise, payments are generally non-refundable.
          </p>

          <h2>10. Data and content ownership</h2>
          <p>
            You retain ownership of your business data, client data, campaign content, lead data, and uploaded materials. You grant us permission to process this data only as needed to provide, maintain, secure, and improve the service.
          </p>

          <h2>11. Prohibited use</h2>
          <ul>
            <li>Do not use LeadMagnet for illegal, harmful, abusive, or deceptive activities.</li>
            <li>Do not attempt to reverse engineer, overload, scrape, attack, or disrupt the service.</li>
            <li>Do not bypass security, access controls, plan limits, or usage restrictions.</li>
            <li>Do not use the service to violate third-party rights or platform terms.</li>
            <li>Do not resell or redistribute the service without written permission.</li>
          </ul>

          <h2>12. Service availability</h2>
          <p>
            We aim to keep LeadMagnet reliable, but we do not guarantee uninterrupted service. Features may be updated, paused, limited, or removed as we improve the product or respond to technical, legal, security, or third-party platform changes.
          </p>

          <h2>13. Intellectual property</h2>
          <p>
            LeadMagnet, including its software, branding, interface, workflows, designs, and documentation, belongs to LeadMagnet Inc or its licensors. These terms do not transfer any ownership rights to you.
          </p>

          <h2>14. Disclaimers</h2>
          <p>
            The service is provided “as is” and “as available.” We do not guarantee that the service will be error-free, uninterrupted, or suitable for every business use case.
          </p>

          <h2>15. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, LeadMagnet Inc will not be liable for indirect, incidental, special, consequential, or punitive damages, including lost profits, lost data, lost business, platform restrictions, or lost opportunities.
          </p>

          <h2>16. Indemnification</h2>
          <p>
            You agree to protect and hold LeadMagnet Inc harmless from claims, losses, damages, liabilities, and expenses arising from your use of the service, your campaigns, your data, your client relationships, or your violation of these terms.
          </p>

          <h2>17. Termination</h2>
          <p>
            We may suspend or terminate access to the service if you violate these terms, misuse the platform, fail to pay, create security risks, or use the service in a way that may harm LeadMagnet, users, third-party platforms, or others.
          </p>

          <h2>18. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. If we make material changes, we may notify users through the product, by email, or by updating the date above.
          </p>

          <h2>19. Contact</h2>
          <p>
            For questions about these terms, contact us at{" "}
            <a href="mailto:support@leadmagnetinc.com">support@leadmagnetinc.com</a>.
          </p>

          <div className="footer-note">
            This page is a practical Terms of Service template for your SaaS. Before launch, have a qualified legal professional review it for your exact company, country, customers, integrations, billing model, and compliance obligations.
          </div>
        </article>
      </section>
    </main>
  );
}