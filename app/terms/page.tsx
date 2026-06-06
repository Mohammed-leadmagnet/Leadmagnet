export default function Terms() {
  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: "#080c09", color: "#d1e0d6", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;}
        .back-btn{background:transparent;border:1px solid rgba(255,255,255,0.08);color:#4d6b54;font-size:0.835rem;padding:0.4rem 0.875rem;border-radius:8px;cursor:pointer;text-decoration:none;font-family:'Inter',sans-serif;}
        .container{max-width:760px;margin:0 auto;padding:4rem 1.5rem 6rem;}
        .page-tag{font-size:0.7rem;font-weight:600;color:#22c97a;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.875rem;display:block;}
        .page-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:2.25rem;font-weight:800;color:#f0f7f2;letter-spacing:-0.03em;margin-bottom:0.5rem;line-height:1.1;}
        .page-date{font-size:0.815rem;color:#3d5240;margin-bottom:3rem;padding-bottom:2rem;border-bottom:1px solid rgba(255,255,255,0.06);}
        .section{margin-bottom:2.5rem;}
        h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:700;color:#c4d4c8;margin-bottom:0.875rem;}
        h3{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.95rem;font-weight:700;color:#94a3b8;margin-bottom:0.625rem;margin-top:1.25rem;}
        p{font-size:0.9rem;color:#3d5240;line-height:1.75;margin-bottom:0.875rem;}
        ul{padding-left:1.25rem;margin-bottom:0.875rem;}
        li{font-size:0.9rem;color:#3d5240;line-height:1.7;margin-bottom:0.3rem;}
        .highlight-box{background:rgba(34,201,122,0.04);border:1px solid rgba(34,201,122,0.12);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;}
        .highlight-box p{color:#2d4a33;margin-bottom:0;}
        .warning-box{background:rgba(251,191,36,0.04);border:1px solid rgba(251,191,36,0.15);border-radius:12px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;}
        .warning-box p{color:#92752a;margin-bottom:0;}
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
        <h1 className="page-title">Terms & Conditions</h1>
        <p className="page-date">Last updated: June 2026 · Version 1.0 · Applies to all agreements with LeadMagnet Inc.</p>

        <div className="highlight-box">
          <p>These terms are governed by Dutch law and European regulations. By using LeadMagnet you agree to these terms. Please read them carefully.</p>
        </div>

        <div className="section">
          <h2>1. Definitions</h2>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>LeadMagnet / We:</strong> LeadMagnet Inc., based in the Netherlands.</li>
            <li><strong style={{ color: "#c4d4c8" }}>User / You:</strong> The person or legal entity that creates an account and uses the Service.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Service:</strong> The LeadMagnet SaaS platform including all LinkedIn, Instagram, and Gmail automation features.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Account:</strong> Your personal environment within the Service.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Subscription:</strong> Paid or free access to the Service for a set period.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Leads:</strong> Contacts collected via the Service.</li>
          </ul>
        </div>

        <div className="section">
          <h2>2. Applicability</h2>
          <p>These terms apply to all agreements between LeadMagnet and the User. By creating an account or using the Service, you accept these terms fully and unconditionally.</p>
        </div>

        <div className="section">
          <h2>3. The Service</h2>
          <h3>3.1 Description</h3>
          <p>LeadMagnet provides a SaaS platform that helps users capture engaged prospects from LinkedIn and Instagram campaigns, organise them in a dashboard, and automate Gmail follow-up sequences.</p>
          <h3>3.2 Availability</h3>
          <p>We aim for 99.5% monthly availability. We are not liable for interruptions caused by third parties including LinkedIn, Instagram, Google, or Phantombuster.</p>
          <h3>3.3 Free Trial</h3>
          <p>New users receive a 7-day free trial. After the trial the Service ends automatically unless you subscribe. No automatic charges apply during the trial.</p>
          <h3>3.4 Changes</h3>
          <p>We reserve the right to modify or limit the Service. Material changes will be communicated at least 30 days in advance.</p>
        </div>

        <div className="section">
          <h2>4. Account & Access</h2>
          <h3>4.1 Registration</h3>
          <p>You are responsible for the accuracy of your registration details. You must be at least 18 years old to create an account.</p>
          <h3>4.2 Security</h3>
          <p>You are responsible for the security of your login credentials and all activity under your account. Report any unauthorised access immediately to support@leadmagnetinc.com.</p>
        </div>

        <div className="section">
          <h2>5. Subscriptions & Payment</h2>
          <h3>5.1 Plans</h3>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Starter:</strong> €49/month</li>
            <li><strong style={{ color: "#c4d4c8" }}>Pro:</strong> €99/month</li>
            <li><strong style={{ color: "#c4d4c8" }}>Agency:</strong> €199/month</li>
          </ul>
          <p>All prices exclude VAT (21%). Business users may deduct VAT in accordance with applicable tax law.</p>
          <h3>5.2 Billing</h3>
          <p>Subscriptions are billed monthly in advance via Stripe. Invoices are sent automatically by email.</p>
          <h3>5.3 Auto-renewal</h3>
          <p>Subscriptions auto-renew unless cancelled at least 1 day before the renewal date via your account settings.</p>
          <h3>5.4 Refunds</h3>
          <p>Payments are non-refundable except in cases of serious failure on our part or as required by consumer law. Consumers have a 14-day right of withdrawal from the start of a subscription, provided the Service has not been used.</p>
        </div>

        <div className="section">
          <h2>6. Acceptable Use</h2>
          <div className="warning-box">
            <p>⚠️ Using LeadMagnet for spam, deception, or violating the terms of LinkedIn, Instagram, or Google is strictly prohibited and may result in immediate account termination without refund.</p>
          </div>
          <h3>6.1 Permitted Use</h3>
          <p>You may only use the Service for lawful, responsible business purposes in compliance with LinkedIn's, Instagram's, Gmail's, and applicable privacy rules.</p>
          <h3>6.2 Prohibited Use</h3>
          <ul>
            <li>Sending unsolicited commercial messages (spam)</li>
            <li>Misleading, fraudulent, or deceptive communication</li>
            <li>Phishing or identity theft</li>
            <li>Illegal collection of personal data</li>
            <li>Bypassing platform security measures</li>
            <li>Reselling access to the Service without permission</li>
          </ul>
          <h3>6.3 Responsibility for Communications</h3>
          <p>You are fully responsible for the content of messages sent via the Service. You indemnify LeadMagnet against all claims arising from your message traffic.</p>
        </div>

        <div className="section">
          <h2>7. Data Protection</h2>
          <p>To the extent you process personal data of third parties (leads) via the Service, LeadMagnet acts as a processor under Article 28 GDPR. You are the controller. By agreeing to these terms, you also enter into a data processing agreement with LeadMagnet.</p>
        </div>

        <div className="section">
          <h2>8. Intellectual Property</h2>
          <p>All intellectual property rights in the Service belong to LeadMagnet. You receive a non-exclusive, non-transferable right to use the Service for the duration of your subscription. You retain all rights to content you process via the Service.</p>
        </div>

        <div className="section">
          <h2>9. Liability</h2>
          <p>LeadMagnet's total liability for direct damages is limited to the subscription fees paid in the 3 months prior to the incident, with a maximum of €1,000 per incident. LeadMagnet is not liable for indirect damages, lost profits, or damages caused by changes to LinkedIn, Instagram, or Google APIs or policies.</p>
        </div>

        <div className="section">
          <h2>10. Termination</h2>
          <p>You may cancel your subscription at any time via your account settings. Cancellation takes effect at the end of the current billing period. We may terminate your account immediately for breach of these terms, fraud, or non-payment.</p>
        </div>

        <div className="section">
          <h2>11. Governing Law</h2>
          <p>These terms are governed exclusively by Dutch law. Disputes will be submitted to the competent court in the district where LeadMagnet is established, unless mandatory law provides otherwise.</p>
        </div>

        <div className="contact-card">
          <h3>Contact</h3>
          <p>For questions about these terms:</p>
          <p style={{ marginTop: "0.5rem" }}>📧 <a href="mailto:legal@leadmagnetinc.com">legal@leadmagnetinc.com</a></p>
          <p>🌐 <a href="https://leadmagnetinc.com">leadmagnetinc.com</a></p>
          <p>📍 Netherlands</p>
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