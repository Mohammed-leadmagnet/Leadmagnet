export default function Terms() {
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
        <h1 className="page-title">Algemene Voorwaarden</h1>
        <p className="page-date">Laatste update: 19 mei 2026 · Versie 1.0 · Van toepassing op alle overeenkomsten met LeadMagnet Inc.</p>

        <div className="highlight-box">
          <p>Deze algemene voorwaarden zijn opgesteld conform Nederlands recht en de Europese regelgeving. Door gebruik te maken van LeadMagnet gaat u akkoord met deze voorwaarden. Lees ze zorgvuldig door.</p>
        </div>

        <div className="section">
          <h2>1. Definities</h2>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>LeadMagnet / Wij:</strong> LeadMagnet Inc., gevestigd in Nederland, ingeschreven bij de KVK.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Gebruiker / U:</strong> De natuurlijke persoon of rechtspersoon die een account aanmaakt en gebruik maakt van de Dienst.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Dienst:</strong> Het SaaS-platform LeadMagnet, inclusief alle functionaliteiten voor LinkedIn-, Instagram- en Gmail-automatisering.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Account:</strong> De persoonlijke omgeving van de Gebruiker binnen de Dienst.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Abonnement:</strong> De betaalde of gratis toegang tot de Dienst voor een bepaalde periode.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Leads:</strong> Contactpersonen die via de Dienst worden verzameld.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Content:</strong> Alle teksten, berichten, gegevens en andere inhoud die via de Dienst worden verwerkt.</li>
          </ul>
        </div>

        <div className="section">
          <h2>2. Toepasselijkheid</h2>
          <p>Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen LeadMagnet en de Gebruiker. Afwijkende voorwaarden van de Gebruiker worden uitdrukkelijk van de hand gewezen, tenzij schriftelijk anders overeengekomen.</p>
          <p>Door een account aan te maken, op "Akkoord" te klikken of de Dienst te gebruiken, aanvaardt u deze voorwaarden volledig en onvoorwaardelijk.</p>
        </div>

        <div className="section">
          <h2>3. De Dienst</h2>
          <h3>3.1 Beschrijving</h3>
          <p>LeadMagnet biedt een SaaS-platform waarmee Gebruikers automatisch kunnen reageren op commentaren op LinkedIn- en Instagram-posts en geautomatiseerde e-mailsequenties kunnen versturen via Gmail. De Dienst maakt gebruik van sessiecookies en API-koppelingen.</p>

          <h3>3.2 Beschikbaarheid</h3>
          <p>Wij streven naar een beschikbaarheid van 99,5% per kalendermaand, gemeten op maandbasis. Gepland onderhoud wordt minimaal 24 uur van tevoren aangekondigd. Wij zijn niet aansprakelijk voor onderbrekingen veroorzaakt door derden (waaronder LinkedIn, Instagram, Google of Phantombuster).</p>

          <h3>3.3 Gratis proefperiode</h3>
          <p>Nieuwe Gebruikers ontvangen een gratis proefperiode van 7 dagen. Na afloop van de proefperiode wordt de Dienst automatisch beëindigd, tenzij u een betaald abonnement afsluit. Er zijn geen automatische kosten verbonden aan de proefperiode.</p>

          <h3>3.4 Wijzigingen</h3>
          <p>Wij behouden het recht de Dienst te wijzigen, uit te breiden of te beperken. Wezenlijke wijzigingen worden minimaal 30 dagen van tevoren gecommuniceerd. Bij substantiële nadelige wijzigingen heeft u het recht de overeenkomst kosteloos te beëindigen.</p>
        </div>

        <div className="section">
          <h2>4. Account en toegang</h2>
          <h3>4.1 Registratie</h3>
          <p>U bent verantwoordelijk voor de juistheid van de bij registratie opgegeven gegevens. U dient minimaal 18 jaar oud te zijn om een account aan te maken. Zakelijke gebruikers dienen bevoegd te zijn om namens de rechtspersoon te handelen.</p>

          <h3>4.2 Accountbeveiliging</h3>
          <p>U bent verantwoordelijk voor de beveiliging van uw inloggegevens en alle activiteiten die via uw account plaatsvinden. Bij vermoeden van ongeautoriseerde toegang dient u ons onmiddellijk te informeren via support@leadmagnetinc.com.</p>

          <h3>4.3 Één account per persoon</h3>
          <p>Het is niet toegestaan meerdere accounts aan te maken voor hetzelfde individu, tenzij dit expliciet door ons is toegestaan (bijv. voor agentschappen op het Agency-plan).</p>
        </div>

        <div className="section">
          <h2>5. Abonnementen en betaling</h2>
          <h3>5.1 Abonnementsvormen</h3>
          <p>De Dienst wordt aangeboden in de volgende abonnementen:</p>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Starter:</strong> €49 per maand</li>
            <li><strong style={{ color: "#c4d4c8" }}>Pro:</strong> €99 per maand</li>
            <li><strong style={{ color: "#c4d4c8" }}>Agency:</strong> €199 per maand</li>
          </ul>
          <p>Alle prijzen zijn exclusief btw (21%). Als zakelijke gebruiker is de btw aftrekbaar conform de Wet OB 1968.</p>

          <h3>5.2 Facturering</h3>
          <p>Abonnementen worden maandelijks vooruitbetaald. Betaling geschiedt via Stripe. Facturen worden automatisch per e-mail verzonden. U bent verantwoordelijk voor correcte facturatiegegevens voor btw-doeleinden.</p>

          <h3>5.3 Automatische verlenging</h3>
          <p>Abonnementen worden automatisch verlengd tenzij u het abonnement minimaal 1 dag voor de verlengingsdatum opzegt via uw accountinstellingen.</p>

          <h3>5.4 Prijswijzigingen</h3>
          <p>Wij behouden het recht prijzen te wijzigen. Prijsverhogingen worden minimaal 30 dagen van tevoren schriftelijk medegedeeld. Bij substantiële prijsverhogingen (>15%) heeft u het recht de overeenkomst kosteloos te beëindigen.</p>

          <h3>5.5 Restitutie</h3>
          <p>Betalingen zijn niet restitueerbaar, behoudens gevallen van ernstige tekortkoming aan onze zijde of verplichtingen op grond van het consumentenrecht. Als consument heeft u een wettelijk herroepingsrecht van 14 dagen na aanvang van het abonnement, mits de Dienst nog niet is gebruikt.</p>
        </div>

        <div className="section">
          <h2>6. Acceptabel gebruik</h2>
          <div className="warning-box">
            <p>⚠️ Het gebruik van LeadMagnet voor spam, misleiding of het overtreden van de gebruiksvoorwaarden van LinkedIn, Instagram of Google is verboden en kan leiden tot onmiddellijke beëindiging van uw account zonder restitutie.</p>
          </div>

          <h3>6.1 Toegestaan gebruik</h3>
          <p>U mag de Dienst uitsluitend gebruiken voor legale, zakelijke doeleinden in overeenstemming met:</p>
          <ul>
            <li>De Telecommunicatiewet (inclusief artikel 11.7 inzake spam)</li>
            <li>De AVG en UAVG</li>
            <li>De gebruiksvoorwaarden van LinkedIn, Instagram en Google</li>
            <li>Toepasselijk Europees en nationaal recht</li>
          </ul>

          <h3>6.2 Verboden gebruik</h3>
          <p>Het is verboden de Dienst te gebruiken voor:</p>
          <ul>
            <li>Het versturen van ongewenste commerciële berichten (spam)</li>
            <li>Misleidende, leugenachtige of frauduleuze communicatie</li>
            <li>Phishing, identiteitsdiefstal of andere vormen van oplichting</li>
            <li>Illegale verzameling van persoonsgegevens</li>
            <li>Het omzeilen van beveiligingsmaatregelen van platforms</li>
            <li>Het doorverkopen van toegang tot de Dienst zonder toestemming</li>
            <li>Activiteiten die in strijd zijn met toepasselijke wet- en regelgeving</li>
          </ul>

          <h3>6.3 Verantwoordelijkheid voor leadcommunicatie</h3>
          <p>U bent als Gebruiker volledig verantwoordelijk voor de inhoud van berichten die via de Dienst worden verstuurd. U vrijwaart LeadMagnet van alle aanspraken voortvloeiende uit door u verstuurd berichtverkeer.</p>
        </div>

        <div className="section">
          <h2>7. Gegevensbescherming en verwerkersovereenkomst</h2>
          <p>Voor zover u via de Dienst persoonsgegevens van derden (leads) verwerkt, treedt LeadMagnet op als verwerker in de zin van artikel 28 AVG. U bent de verwerkingsverantwoordelijke.</p>
          <p>Door akkoord te gaan met deze voorwaarden sluit u tevens een verwerkersovereenkomst met LeadMagnet. Wij verwerken leadgegevens uitsluitend op uw instructie en beveiligen deze conform artikel 32 AVG. U garandeert dat u gerechtigd bent de betreffende persoonsgegevens te verwerken en dat uw communicatie met leads voldoet aan de AVG.</p>
        </div>

        <div className="section">
          <h2>8. Intellectueel eigendom</h2>
          <h3>8.1 LeadMagnet IP</h3>
          <p>Alle intellectuele eigendomsrechten met betrekking tot de Dienst, inclusief software, ontwerp, logo's, documentatie en knowhow, berusten bij LeadMagnet. U verkrijgt uitsluitend een niet-exclusief, niet-overdraagbaar gebruiksrecht voor de duur van het abonnement.</p>

          <h3>8.2 Gebruikerscontent</h3>
          <p>U behoudt alle rechten op content die u via de Dienst verwerkt. U verleent LeadMagnet een beperkte licentie om deze content te verwerken uitsluitend ten behoeve van de levering van de Dienst.</p>
        </div>

        <div className="section">
          <h2>9. Aansprakelijkheid</h2>
          <h3>9.1 Beperking van aansprakelijkheid</h3>
          <p>De totale aansprakelijkheid van LeadMagnet voor directe schade is in alle gevallen beperkt tot het bedrag dat u in de 3 maanden voorafgaand aan het schadeveroorzakend voorval aan abonnementskosten heeft betaald, met een maximum van €1.000 per incident.</p>

          <h3>9.2 Uitsluitingen</h3>
          <p>LeadMagnet is niet aansprakelijk voor:</p>
          <ul>
            <li>Indirecte schade, gevolgschade, gederfde winst of reputatieschade</li>
            <li>Schade veroorzaakt door wijzigingen in de API's of gebruiksvoorwaarden van LinkedIn, Instagram of Google</li>
            <li>Schade als gevolg van blokkering of beperking van uw LinkedIn-, Instagram- of Google-account</li>
            <li>Schade veroorzaakt door onjuist gebruik van de Dienst</li>
            <li>Schade door overmacht, waaronder storingen bij derden, cyberaanvallen of overheidsmaatregelen</li>
          </ul>

          <h3>9.3 Consumentenbescherming</h3>
          <p>Bovenstaande aansprakelijkheidsbeperkingen gelden niet voor consumenten voor zover dwingend consumentenrecht van toepassing is.</p>
        </div>

        <div className="section">
          <h2>10. Duur en beëindiging</h2>
          <h3>10.1 Opzegging door Gebruiker</h3>
          <p>U kunt het abonnement te allen tijde opzeggen via uw accountinstellingen. Opzegging heeft geen terugwerkende kracht; u behoudt toegang tot het einde van de lopende betaalperiode.</p>

          <h3>10.2 Beëindiging door LeadMagnet</h3>
          <p>Wij kunnen uw account onmiddellijk beëindigen bij:</p>
          <ul>
            <li>Overtreding van deze voorwaarden</li>
            <li>Frauduleuze activiteiten</li>
            <li>Niet-betaling na aanmaning</li>
            <li>Gebruik dat reputatie- of juridische schade veroorzaakt aan LeadMagnet of derden</li>
          </ul>

          <h3>10.3 Gevolgen van beëindiging</h3>
          <p>Na beëindiging van het account worden uw gegevens binnen 30 dagen verwijderd, behoudens wettelijke bewaarverplichtingen. U exporteert uw leadgegevens vóór beëindiging via de exportfunctie.</p>
        </div>

        <div className="section">
          <h2>11. Klachtenregeling</h2>
          <p>Klachten over de Dienst dienen schriftelijk te worden ingediend via support@leadmagnetinc.com. Wij reageren binnen 5 werkdagen. Als wij er samen niet uitkomen, kunt u een klacht indienen bij:</p>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Geschillencommissie ICT:</strong> <a href="https://www.degeschillencommissie.nl" target="_blank" style={{ color: "#22c97a" }}>degeschillencommissie.nl</a></li>
            <li><strong style={{ color: "#c4d4c8" }}>ODR-platform EU:</strong> <a href="https://ec.europa.eu/consumers/odr" target="_blank" style={{ color: "#22c97a" }}>ec.europa.eu/consumers/odr</a></li>
          </ul>
        </div>

        <div className="section">
          <h2>12. Toepasselijk recht en bevoegde rechter</h2>
          <p>Op deze algemene voorwaarden en alle overeenkomsten tussen LeadMagnet en de Gebruiker is uitsluitend Nederlands recht van toepassing.</p>
          <p>Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar LeadMagnet is gevestigd, tenzij dwingend recht anders bepaalt. Voor consumenten geldt de woonplaats van de consument als bevoegde rechtbank.</p>
        </div>

        <div className="section">
          <h2>13. Overige bepalingen</h2>
          <ul>
            <li><strong style={{ color: "#c4d4c8" }}>Nietigheid:</strong> Indien een bepaling nietig of vernietigbaar is, tast dit de geldigheid van de overige bepalingen niet aan.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Overdracht:</strong> U kunt uw rechten en verplichtingen niet overdragen zonder onze schriftelijke toestemming.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Volledige overeenkomst:</strong> Deze voorwaarden vormen samen met het privacybeleid de volledige overeenkomst tussen partijen.</li>
            <li><strong style={{ color: "#c4d4c8" }}>Taal:</strong> In geval van tegenstrijdigheid tussen de Nederlandse en een vertaalde versie, prevaleert de Nederlandse tekst.</li>
          </ul>
        </div>

        <div className="contact-card">
          <h3>Contact</h3>
          <p>Voor vragen over deze algemene voorwaarden:</p>
          <p style={{ marginTop: "0.5rem" }}>📧 <a href="mailto:legal@leadmagnetinc.com">legal@leadmagnetinc.com</a></p>
          <p>🌐 <a href="https://leadmagnetinc.com">leadmagnetinc.com</a></p>
          <p>📍 Nederland</p>
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