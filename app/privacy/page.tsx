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
        <h1 className="page-title">Privacybeleid</h1>
        <p className="page-date">Laatste update: 19 mei 2026 · Versie 1.0 · LeadMagnet Inc.</p>

        <div className="highlight-box">
          <p>Dit privacybeleid is opgesteld conform de AVG (Algemene Verordening Gegevensbescherming) en de Nederlandse Uitvoeringswet AVG (UAVG). Wij nemen uw privacy serieus en verwerken uw gegevens zorgvuldig en transparant.</p>
        </div>

        <div className="section">
          <h2>1. Wie zijn wij?</h2>
          <p>LeadMagnet Inc. is een SaaS-bedrijf gevestigd in Nederland, ingeschreven bij de Kamer van Koophandel. Wij bieden een platform voor LinkedIn-, Instagram- en Gmail-automatisering voor marketingbureaus en ondernemers.</p>
          <p>📧 privacy@leadmagnetinc.com · 🌐 leadmagnetinc.com · 📍 Nederland</p>
        </div>

        <div className="section">
          <h2>2. Welke gegevens verzamelen wij?</h2>
          <h3>2.1 Accountgegevens</h3>
          <ul>
            <li>E-mailadres en wachtwoord (versleuteld)</li>
            <li>Naam en bedrijfsnaam (indien opgegeven)</li>
            <li>Facturatiegegevens (verwerkt via Stripe)</li>
          </ul>
          <h3>2.2 Platformkoppelingen</h3>
          <ul>
            <li>LinkedIn sessiecookie (li_at) voor automatisering</li>
            <li>Gmail App Password voor e-mailverzending</li>
            <li>Instagram accountgegevens</li>
          </ul>
          <h3>2.3 Leadgegevens</h3>
          <ul>
            <li>Namen, functies, bedrijven en LinkedIn-profielen van verzamelde leads</li>
            <li>Tijdstip van interactie (bijv. commentaar op een post)</li>
          </ul>
          <h3>2.4 Gebruiksgegevens</h3>
          <ul>
            <li>IP-adres en browsertype (voor beveiliging)</li>
            <li>Activiteitslogboeken binnen het platform</li>
          </ul>
        </div>

        <div className="section">
          <h2>3. Waarom verwerken wij uw gegevens?</h2>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Uitvoering overeenkomst:</strong> Om de Dienst te leveren waarvoor u zich heeft aangemeld.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Wettelijke verplichting:</strong> Fiscale bewaarplicht van factuurgegevens (7 jaar).</li>
            <li><strong style={{ color: "#c4d4c8" }}>Gerechtvaardigd belang:</strong> Beveiliging van het platform en fraudepreventie.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Toestemming:</strong> Voor marketingcommunicatie (u kunt zich altijd afmelden).</li>
          </ul>
        </div>

        <div className="section">
          <h2>4. Hoe lang bewaren wij uw gegevens?</h2>
          <ul>
            <li>Accountgegevens: zolang uw account actief is + 30 dagen na opzegging</li>
            <li>Factuurgegevens: 7 jaar (wettelijke bewaarplicht)</li>
            <li>Leadgegevens: tot u ze verwijdert of uw account opzegt</li>
            <li>Logboeken: maximaal 90 dagen</li>
          </ul>
        </div>

        <div className="section">
          <h2>5. Delen wij uw gegevens?</h2>
          <p>Wij verkopen uw gegevens nooit. Wij delen gegevens uitsluitend met:</p>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Supabase:</strong> Databaseopslag (EU-servers)</li>
            <li><strong style={{ color: "#c4d4c8" }}>Stripe:</strong> Betalingsverwerking</li>
            <li><strong style={{ color: "#c4d4c8" }}>Phantombuster:</strong> LinkedIn-automatisering</li>
            <li><strong style={{ color: "#c4d4c8" }}>Vercel:</strong> Hostingprovider</li>
          </ul>
          <p>Met alle verwerkers zijn verwerkersovereenkomsten gesloten conform artikel 28 AVG.</p>
        </div>

        <div className="section">
          <h2>6. Uw rechten</h2>
          <p>Op grond van de AVG heeft u de volgende rechten:</p>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Inzage:</strong> U kunt opvragen welke gegevens wij van u verwerken.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Rectificatie:</strong> U kunt onjuiste gegevens laten corrigeren.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Verwijdering:</strong> U kunt verzoeken uw gegevens te verwijderen.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Bezwaar:</strong> U kunt bezwaar maken tegen verwerking op basis van gerechtvaardigd belang.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Overdraagbaarheid:</strong> U kunt uw gegevens in een machine-leesbaar formaat opvragen.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Klacht:</strong> U kunt een klacht indienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).</li>
          </ul>
          <p>Verzoeken kunt u indienen via privacy@leadmagnetinc.com. Wij reageren binnen 30 dagen.</p>
        </div>

        <div className="section">
          <h2>7. Beveiliging</h2>
          <p>Wij treffen passende technische en organisatorische maatregelen conform artikel 32 AVG, waaronder:</p>
          <ul>
            <li>Versleutelde opslag van wachtwoorden en gevoelige gegevens</li>
            <li>HTTPS-encryptie voor alle dataoverdracht</li>
            <li>Toegangsbeperking op basis van het need-to-know principe</li>
            <li>Regelmatige beveiligingsaudits</li>
          </ul>
        </div>

        <div className="section">
          <h2>8. Cookies</h2>
          <p>Wij gebruiken uitsluitend functionele cookies die noodzakelijk zijn voor het functioneren van de Dienst. Er worden geen tracking- of advertentiecookies geplaatst zonder uw toestemming.</p>
        </div>

        <div className="section">
          <h2>9. Wijzigingen</h2>
          <p>Wij kunnen dit privacybeleid aanpassen. Wezenlijke wijzigingen worden minimaal 30 dagen van tevoren gecommuniceerd via e-mail. De meest actuele versie is altijd beschikbaar op leadmagnetinc.com/privacy.</p>
        </div>

        <div className="contact-card">
          <h3>Contact & vragen</h3>
          <p>Voor vragen over uw privacy of dit beleid:</p>
          <p style={{ marginTop: "0.5rem" }}>📧 <a href="mailto:privacy@leadmagnetinc.com">privacy@leadmagnetinc.com</a></p>
          <p>🌐 <a href="https://leadmagnetinc.com">leadmagnetinc.com</a></p>
          <p>📍 Nederland · Autoriteit Persoonsgegevens: <a href="https://autoriteitpersoonsgegevens.nl" target="_blank">autoriteitpersoonsgegevens.nl</a></p>
        </div>
      </div>

      <footer>
        <div className="footer-logo">⚡ LeadMagnet</div>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Voorwaarden</a>
          <a href="/">Home</a>
        </div>
        <div>© 2026 LeadMagnet Inc.</div>
      </footer>
    </main>
  );
}