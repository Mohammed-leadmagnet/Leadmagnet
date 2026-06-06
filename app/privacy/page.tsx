export default function Privacy() {
  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: "#080c09", color: "#d1e0d6", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;}
        .back-btn{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.835rem;padding:0.4rem 0.875rem;border-radius:8px;cursor:pointer;text-decoration:none;font-family:'Inter',sans-serif;transition:all 0.15s;}
        .back-btn:hover{border-color:rgba(255,255,255,0.15);color:#94a3b8;}
        .container{max-width:760px;margin:0 auto;padding:4rem 1.5rem 6rem;}
        .page-tag{font-size:0.7rem;font-weight:600;color:#22c97a;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.875rem;display:block;}
        .page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:2.25rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.03em;margin-bottom:0.5rem;line-height:1.1;}
        .page-date{font-size:0.815rem;color:#3d5240;margin-bottom:3rem;padding-bottom:2rem;border-bottom:1px solid rgba(255,255,255,0.06);}
        .section{margin-bottom:2.5rem;}
        h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:700;color:#c4d4c8;margin-bottom:0.875rem;letter-spacing:-0.02em;}
        h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#94a3b8;margin-bottom:0.625rem;margin-top:1.25rem;}
        p{font-size:0.9rem;color:#3d5240;line-height:1.75;margin-bottom:0.875rem;font-weight:400;}
        ul{padding-left:1.25rem;margin-bottom:0.875rem;}
        li{font-size:0.9rem;color:#3d5240;line-height:1.7;margin-bottom:0.3rem;}
        .highlight-box{background:rgba(34,201,122,0.04);border:1px solid rgba(34,201,122,0.12);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;}
        .highlight-box p{color:#2d4a33;margin-bottom:0;}
        .warning-box{background:rgba(251,191,36,0.04);border:1px solid rgba(251,191,36,0.15);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;}
        .warning-box p{color:#92752a;margin-bottom:0;}
        .disclaimer-box{background:rgba(99,179,237,0.04);border:1px solid rgba(99,179,237,0.15);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;}
        .disclaimer-box p{color:#4a7a9b;margin-bottom:0;}
        .contact-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:1.5rem;margin-top:2rem;}
        .contact-card h3{color:#c4d4c8;margin-top:0;}
        .contact-card p{color:#3d5240;}
        .contact-card a{color:#22c97a;text-decoration:none;}
        footer{border-top:1px solid rgba(255,255,255,0.06);padding:1.75rem 2rem;display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:#2a3d2e;flex-wrap:wrap;gap:1rem;background:#0b120d;}
        .footer-logo{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#22c97a;font-size:0.975rem;}
        .footer-links{display:flex;gap:1.5rem;}
        .footer-links a{color:#2a3d2e;text-decoration:none;}
        .footer-links a:hover{color:#4d6b54;}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">⚡ LeadMagnet</a>
        <a href="/" className="back-btn">← Back to home</a>
      </nav>

      <div className="container">
        <span className="page-tag">Legal</span>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-date">Last updated: June 2026 · Version 2.0 · LeadMagnet Inc. · Governed by Dutch law and GDPR</p>

        <div className="highlight-box">
          <p>This Privacy Policy is prepared in accordance with the GDPR (General Data Protection Regulation) and the Dutch Implementation Act (UAVG). We take your privacy seriously and process your data carefully and transparently.</p>
        </div>

        <div className="disclaimer-box">
          <p>⚠️ LeadMagnet is not affiliated with, endorsed by, or officially connected to LinkedIn, Instagram, Google, or Gmail. These are trademarks of their respective owners. Users are responsible for complying with the terms of service of each platform they connect to LeadMagnet.</p>
        </div>

        <div className="section">
          <h2>1. Who are we?</h2>
          <p>LeadMagnet Inc. is a SaaS company based in the Netherlands. We provide a platform for LinkedIn, Instagram, and Gmail outreach management for marketing agencies and consultants.</p>
          <p>📧 privacy@leadmagnetinc.com · 🌐 leadmagnetinc.com · 📍 Netherlands</p>
        </div>

        <div className="section">
          <h2>2. What data do we collect?</h2>
          <h3>2.1 Account data</h3>
          <ul>
            <li>Email address and password (encrypted)</li>
            <li>Name and company name (if provided)</li>
            <li>Billing details (processed via Stripe)</li>
          </ul>
          <h3>2.2 Platform connections</h3>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>LinkedIn:</strong> Campaign data and engagement metadata via Phantombuster integration. Users are responsible for their own LinkedIn account usage and compliance with LinkedIn's terms of service.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Gmail:</strong> OAuth access tokens only — connected via Google's official OAuth 2.0 flow. We never store your Gmail password or app password. We only request permission to send emails on your behalf for follow-up sequences.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Instagram:</strong> Account connection data for campaign management.</li>
          </ul>
          <h3>2.3 Lead data</h3>
          <ul>
            <li>Names, job titles, companies and LinkedIn profiles of collected leads</li>
            <li>Time of interaction (e.g. comment on a post)</li>
            <li>Email addresses if provided or collected via campaigns</li>
          </ul>
          <h3>2.4 Usage data</h3>
          <ul>
            <li>IP address and browser type (for security)</li>
            <li>Activity logs within the platform (max 90 days)</li>
          </ul>
        </div>

        <div className="section">
          <h2>3. Why do we process your data?</h2>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Contract performance:</strong> To deliver the Service you signed up for.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Legal obligation:</strong> Fiscal retention of invoice data (7 years).</li>
            <li><strong style={{ color: "#c4d4c8" }}>Legitimate interest:</strong> Platform security and fraud prevention.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Consent:</strong> For marketing communications (you can unsubscribe at any time).</li>
          </ul>
        </div>

        <div className="section">
          <h2>4. How long do we retain your data?</h2>
          <ul>
            <li>Account data: for as long as your account is active + 30 days after cancellation</li>
            <li>Invoice data: 7 years (legal retention requirement)</li>
            <li>Lead data: until you delete it or cancel your account</li>
            <li>Activity logs: maximum 90 days</li>
            <li>Gmail OAuth tokens: until you disconnect your Gmail account</li>
          </ul>
        </div>

        <div className="section">
          <h2>5. Do we share your data?</h2>
          <p>We never sell your data. We only share data with the following processors:</p>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Supabase:</strong> Database storage (EU servers)</li>
            <li><strong style={{ color: "#c4d4c8" }}>Stripe:</strong> Payment processing</li>
            <li><strong style={{ color: "#c4d4c8" }}>Phantombuster:</strong> LinkedIn campaign automation</li>
            <li><strong style={{ color: "#c4d4c8" }}>Vercel:</strong> Hosting provider</li>
            <li><strong style={{ color: "#c4d4c8" }}>Google:</strong> Gmail OAuth authentication and email sending</li>
          </ul>
          <p>Data processing agreements have been concluded with all processors in accordance with Article 28 GDPR.</p>
        </div>

        <div className="section">
          <h2>6. Gmail & Google OAuth</h2>
          <div className="highlight-box">
            <p>✓ LeadMagnet connects to Gmail using Google's official OAuth 2.0 protocol. We never ask for or store your Gmail password. Your Google credentials remain fully under your control. You can revoke access at any time via your Google account settings at myaccount.google.com.</p>
          </div>
          <p>We request the following Gmail permissions:</p>
          <ul>
            <li>Send emails on your behalf (for automated follow-up sequences)</li>
            <li>Read basic profile information (name and email address)</li>
          </ul>
          <p>We do not read, store, or analyse the content of your existing emails.</p>
        </div>

        <div className="section">
          <h2>7. LinkedIn & Platform Risk Notice</h2>
          <div className="warning-box">
            <p>⚠️ LinkedIn does not officially permit third-party automation tools. Users who connect LinkedIn accounts via LeadMagnet do so at their own risk. LeadMagnet is not responsible for any account restrictions, suspensions, or bans resulting from LinkedIn's enforcement of its terms of service. We recommend using conservative outreach limits and quality-first campaigns.</p>
          </div>
        </div>

        <div className="section">
          <h2>8. Your rights</h2>
          <p>Under GDPR you have the following rights:</p>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Access:</strong> You can request which data we process about you.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Rectification:</strong> You can have incorrect data corrected.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Deletion:</strong> You can request deletion of your data.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Objection:</strong> You can object to processing based on legitimate interest.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Portability:</strong> You can request your data in a machine-readable format.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Complaint:</strong> You can file a complaint with the Dutch Data Protection Authority at autoriteitpersoonsgegevens.nl.</li>
          </ul>
          <p>Submit requests to privacy@leadmagnetinc.com. We respond within 30 days.</p>
        </div>

        <div className="section">
          <h2>9. Security</h2>
          <p>We take appropriate technical and organisational measures in accordance with Article 32 GDPR, including:</p>
          <ul>
            <li>Encrypted storage of passwords and sensitive data</li>
            <li>HTTPS encryption for all data transfers</li>
            <li>Access restrictions based on the need-to-know principle</li>
            <li>OAuth 2.0 for all platform integrations (no passwords stored)</li>
            <li>Regular security reviews</li>
          </ul>
        </div>

        <div className="section">
          <h2>10. Cookies</h2>
          <p>We only use functional cookies that are necessary for the operation of the Service. No tracking or advertising cookies are placed without your consent.</p>
        </div>

        <div className="section">
          <h2>11. Changes</h2>
          <p>We may update this Privacy Policy. Material changes will be communicated at least 30 days in advance by email. The most current version is always available at leadmagnetinc.com/privacy.</p>
        </div>

        <div className="contact-card">
          <h3>Contact</h3>
          <p>For questions about your privacy or this policy:</p>
          <p style={{ marginTop: "0.5rem" }}>📧 <a href="mailto:privacy@leadmagnetinc.com">privacy@leadmagnetinc.com</a></p>
          <p>🌐 <a href="https://leadmagnetinc.com">leadmagnetinc.com</a></p>
          <p>📍 Netherlands · Dutch Data Protection Authority: <a href="https://autoriteitpersoonsgegevens.nl" target="_blank">autoriteitpersoonsgegevens.nl</a></p>
        </div>
      </div>

      <footer>
        <div className="footer-logo">⚡ LeadMagnet</div>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/">Home</a>
        </div>
        <div>© 2026 LeadMagnet Inc. All rights reserved.</div>
      </footer>
    </main>
  );
}