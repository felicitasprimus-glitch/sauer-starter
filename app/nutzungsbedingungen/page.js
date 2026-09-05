export const metadata = {
  title: "Nutzungsbedingungen – Meine Backstube",
};

export default function NutzungsbedingungenPage() {
  const seite = {
    fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif",
    background: "#F6EFEA",
    minHeight: "100vh",
    padding: "32px 20px 80px",
    color: "#3f2e3a",
    lineHeight: 1.65,
  };
  const inner = { maxWidth: 680, margin: "0 auto" };
  const h1 = {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: "#5A3D54",
    fontSize: 32,
    fontWeight: 700,
    margin: "0 0 6px",
    lineHeight: 1.15,
  };
  const h2 = {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: "#5A3D54",
    fontSize: 21,
    fontWeight: 600,
    margin: "30px 0 8px",
  };
  const p = { fontSize: 15, margin: "0 0 12px" };
  const li = { fontSize: 15, margin: "0 0 8px" };
  const stand = { fontSize: 13, color: "#8B796D", margin: "0 0 26px" };

  return (
    <div style={seite}>
      <div style={inner}>
        <h1 style={h1}>Nutzungsbedingungen</h1>
        <p style={stand}>Meine Backstube · Stand: September 2026</p>

        <h2 style={h2}>1. Geltungsbereich</h2>
        <p style={p}>
          Diese Bedingungen gelten fuer die Nutzung der App &bdquo;Meine
          Backstube&ldquo; und der zugehoerigen Website unter
          app.sauermachtkrustig.de. Anbieterin ist Felicitas Reitmeier, Hammeler
          Str. 34, 86356 Neusaess, Sauermachtkrustig@gmail.com.
        </p>

        <h2 style={h2}>2. Konto</h2>
        <p style={p}>
          Fuer die Nutzung ist ein Konto mit E-Mail-Adresse und Passwort
          erforderlich. Die Zugangsdaten sind vertraulich zu behandeln und
          nicht an Dritte weiterzugeben. Pro Person ist ein Konto vorgesehen.
        </p>
        <p style={p}>
          Die Nutzung ist Personen ab 16 Jahren gestattet. Juengere Personen
          duerfen die App nur mit Zustimmung der Erziehungsberechtigten nutzen.
        </p>

        <h2 style={h2}>3. Inhalte im Community-Bereich</h2>
        <p style={p}>
          Im Community-Bereich koennen eigene Fotos, Rezepte und Kommentare
          veroeffentlicht werden. Fuer diese Inhalte ist allein die
          veroeffentlichende Person verantwortlich.
        </p>
        <p style={p}>Nicht erlaubt sind insbesondere:</p>
        <ul style={{ paddingLeft: 20, margin: "0 0 12px" }}>
          <li style={li}>
            beleidigende, bedrohende, diskriminierende oder belaestigende
            Inhalte
          </li>
          <li style={li}>
            gewaltverherrlichende, sexuelle oder jugendgefaehrdende Inhalte
          </li>
          <li style={li}>
            Inhalte, die gegen geltendes Recht verstossen oder Rechte Dritter
            verletzen
          </li>
          <li style={li}>
            fremde Fotos, Texte oder Rezepte ohne Erlaubnis der Urheberin oder
            des Urhebers
          </li>
          <li style={li}>
            Fotos, auf denen andere Personen ohne deren Einverstaendnis
            erkennbar sind
          </li>
          <li style={li}>Werbung, Spam und wiederholt gleiche Beitraege</li>
          <li style={li}>
            personenbezogene Daten Dritter, etwa Adressen oder Telefonnummern
          </li>
        </ul>
        <p style={p}>
          Mit dem Veroeffentlichen wird der Anbieterin das einfache Recht
          eingeraeumt, den Inhalt innerhalb der App darzustellen. Die Rechte am
          Inhalt selbst verbleiben bei der veroeffentlichenden Person.
        </p>

        <h2 style={h2}>4. Melden und Blockieren</h2>
        <p style={p}>
          Jeder Beitrag und jeder Kommentar kann ueber das Menue am Beitrag
          gemeldet werden. Gemeldete Inhalte werden innerhalb von 24 Stunden
          geprueft und bei einem Verstoss entfernt.
        </p>
        <p style={p}>
          Ausserdem koennen einzelne Personen blockiert werden. Deren Beitraege
          und Kommentare werden dann nicht mehr angezeigt.
        </p>

        <h2 style={h2}>5. Folgen bei Verstoessen</h2>
        <p style={p}>
          Inhalte, die gegen diese Bedingungen verstossen, koennen ohne
          Vorankuendigung geloescht werden. Bei schweren oder wiederholten
          Verstoessen kann das Konto gesperrt oder geloescht werden.
        </p>

        <h2 style={h2}>6. Verfuegbarkeit und Inhalte der App</h2>
        <p style={p}>
          Die App wird mit Sorgfalt gepflegt, eine ununterbrochene
          Verfuegbarkeit kann jedoch nicht zugesichert werden. Rezepte,
          Zeitplaene, Rechner und Hinweise sind unverbindliche Empfehlungen.
          Backergebnisse haengen von Mehl, Temperatur, Ofen und weiteren
          Faktoren ab.
        </p>
        <p style={p}>
          Angaben zu Zutaten ersetzen keine Pruefung auf Unvertraeglichkeiten.
          Bitte pruefe Zutaten stets selbst.
        </p>

        <h2 style={h2}>7. Konto loeschen</h2>
        <p style={p}>
          Das Konto kann jederzeit geloescht werden. Eine formlose Nachricht an
          Sauermachtkrustig@gmail.com genuegt. Mit der Loeschung werden die
          gespeicherten Inhalte entfernt.
        </p>

        <h2 style={h2}>8. Datenschutz</h2>
        <p style={p}>
          Wie personenbezogene Daten verarbeitet werden, steht in der{" "}
          <a href="/datenschutz" style={{ color: "#7C3E50" }}>
            Datenschutzerklaerung
          </a>
          .
        </p>

        <h2 style={h2}>9. Aenderungen</h2>
        <p style={p}>
          Diese Bedingungen koennen angepasst werden, etwa wenn neue Funktionen
          hinzukommen. Ueber wesentliche Aenderungen wird in der App informiert.
        </p>

        <h2 style={h2}>10. Kontakt</h2>
        <p style={p}>
          Felicitas Reitmeier · Hammeler Str. 34 · 86356 Neusaess ·
          Sauermachtkrustig@gmail.com
        </p>
      </div>
    </div>
  );
}
