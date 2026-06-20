export const metadata = {
  title: "Privacy Policy — LeadMagnet Inc",
  description: "Privacy Policy for LeadMagnet Inc.",
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function PrivacyPolicy() {
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

        .policy-card {
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

          .policy-card {
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

          <h1 className="title">Privacy Policy</h1>

          <p className="subtitle">
            This policy explains how LeadMagnet Inc collects, uses, stores, and protects information when you use our website, dashboard, integrations, and services.
          </p>
        </div>

        <article className="policy-card">
          <div className="updated">Last updated: June 2026</div>

          <h2>1. Information we collect</h2>
          <p>
            We collect information you provide directly, including your name, email address, agency or business name, account details, support messages, and billing-related information.
          </p>
          <p>
            We may also collect campaign and lead data that you upload, generate, or connect through supported integrations such as LinkedIn, Instagram, Gmail, and related automation tools.
          </p>

          <h2>2. Information from integrations</h2>
          <p>
            When you connect third-party platforms, we may process information needed to provide the service, such as account identifiers, campaign activity, messages, leads, engagement signals, email sequence data, and connection status.
          </p>
          <p>
            We only use connected platform data to operate the features you request, such as lead capture, campaign tracking, automation, reporting, and client portal updates.
          </p>

          <h2>3. How we use your information</h2>
          <ul>
            <li>To create and manage your LeadMagnet account.</li>
            <li>To provide campaign automation, lead capture, reporting, and client management features.</li>
            <li>To process payments, subscriptions, and plan access.</li>
            <li>To provide customer support and respond to inquiries.</li>
            <li>To improve product performance, reliability, and user experience.</li>
            <li>To protect against misuse, fraud, unauthorized access, and security risks.</li>
          </ul>

          <h2>4. Lead and client data</h2>
          <p>
            You are responsible for ensuring that any leads, clients, or contacts you upload or process through LeadMagnet are collected and used lawfully. We act as a service provider for the data you manage in your workspace.
          </p>

          <h2>5. Cookies and analytics</h2>
          <p>
            We may use cookies, local storage, and analytics tools to keep you signed in, measure product usage, improve performance, and understand how users interact with our website and dashboard.
          </p>

          <h2>6. Data sharing</h2>
          <p>
            We do not sell your personal data. We may share limited information with trusted service providers that help us operate LeadMagnet, including hosting, authentication, database, analytics, email, automation, and payment providers.
          </p>

          <h2>7. Payments</h2>
          <p>
            Payment processing is handled by Stripe or another payment provider. We do not store full payment card details on our own servers.
          </p>

          <h2>8. Data retention</h2>
          <p>
            We retain information for as long as needed to provide the service, comply with legal obligations, resolve disputes, prevent abuse, and maintain business records. You may request deletion of your account or data by contacting us.
          </p>

          <h2>9. Security</h2>
          <p>
            We use reasonable technical and organizational measures to protect your information. However, no online system can be guaranteed to be completely secure.
          </p>

          <h2>10. Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, delete, restrict, or export your personal data. You may contact us to request help with these rights.
          </p>

          <h2>11. Children’s privacy</h2>
          <p>
            LeadMagnet is not intended for children under 13, and we do not knowingly collect personal information from children.
          </p>

          <h2>12. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we will update the date above and may notify users through the product or by email.
          </p>

          <h2>13. Contact us</h2>
          <p>
            For privacy questions or data requests, contact us at{" "}
            <a href="mailto:support@leadmagnetinc.com">support@leadmagnetinc.com</a>.
          </p>

          <div className="footer-note">
            This page is a practical product privacy policy template. Before launch, have a qualified legal professional review it for your exact company, country, customers, integrations, and compliance obligations.
          </div>
        </article>
      </section>
    </main>
  );
}