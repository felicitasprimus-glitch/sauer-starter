import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <Link
        href="/"
        className="text-xs uppercase tracking-wider text-mauve-700 hover:text-cocoa-900"
      >
        ← Sauer macht krustig
      </Link>

      <h1 className="mt-6 font-display text-3xl text-cocoa-900">
        Datenschutzerklaerung – Starter App
      </h1>
      <p className="mt-1 text-xs text-cocoa-700/60">Stand: 25. Mai 2026</p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-cocoa-800">
        <p>
          Der Schutz deiner personenbezogenen Daten ist uns wichtig. Nachfolgend
          informieren wir dich darueber, welche Daten innerhalb der Starter App
          verarbeitet werden und zu welchem Zweck dies geschieht.
        </p>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">1. Verantwortliche Stelle</h2>
          <p className="mt-2 whitespace-pre-line">
            {`Felicitas Reitmeier
Sauer macht krustig
E-Mail: [E-Mail-Adresse]
Website: [Website]`}
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">
            2. Erhebung und Verarbeitung personenbezogener Daten
          </h2>
          <p className="mt-2">Bei Nutzung der App koennen folgende Daten verarbeitet werden:</p>

          <h3 className="mt-4 font-semibold text-cocoa-900">Kontodaten</h3>
          <p className="mt-1">Bei Erstellung eines Benutzerkontos:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Name</li>
            <li>E-Mail-Adresse</li>
            <li>Login-Daten</li>
            <li>Profilbild (optional)</li>
          </ul>
          <p className="mt-2">Anmeldungen koennen gegebenenfalls ueber Drittanbieter erfolgen:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Google Login</li>
            <li>Apple Login</li>
          </ul>
          <p className="mt-2">
            Es werden nur die fuer die Anmeldung notwendigen Informationen verarbeitet.
          </p>

          <h3 className="mt-4 font-semibold text-cocoa-900">Starter-Daten</h3>
          <p className="mt-1">Die App speichert Daten, die du selbst eingibst:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Name deines Starters</li>
            <li>Starter-Art</li>
            <li>Fuetterungszeiten</li>
            <li>Erinnerungen</li>
            <li>Notizen</li>
            <li>Aktivitaeten</li>
            <li>Bilder deines Starters</li>
          </ul>
          <p className="mt-2">
            Diese Daten dienen ausschliesslich der Nutzung der App-Funktionen.
          </p>

          <h3 className="mt-4 font-semibold text-cocoa-900">
            KI-Analyse ("Ist mein Starter backbereit?")
          </h3>
          <p className="mt-1">
            Wenn du Bilder hochlaedst, koennen diese zur Analyse durch KI-Systeme
            verarbeitet werden. Dabei koennen verarbeitet werden:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>hochgeladene Bilder</li>
            <li>Zeitpunkt des Uploads</li>
            <li>Analyse-Ergebnisse</li>
          </ul>
          <p className="mt-2">
            Die Bilder werden ausschliesslich zur Bereitstellung dieser Funktion verwendet.
          </p>

          <h3 className="mt-4 font-semibold text-cocoa-900">Geraeteinformationen</h3>
          <p className="mt-1">
            Zur technischen Bereitstellung koennen automatisch folgende Daten verarbeitet
            werden:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Geraetetyp</li>
            <li>Betriebssystem</li>
            <li>Browserinformationen</li>
            <li>App-Version</li>
            <li>technische Fehlerprotokolle</li>
            <li>anonymisierte Nutzungsdaten</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">3. Push-Benachrichtigungen</h2>
          <p className="mt-2">Die App kann Benachrichtigungen senden:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Fuetterungserinnerungen</li>
            <li>Hinweise auf Starter-Aktivitaet</li>
            <li>Kurs-Erinnerungen</li>
            <li>Community-Aktivitaeten</li>
          </ul>
          <p className="mt-2">
            Benachrichtigungen koennen jederzeit in den Geraeteeinstellungen deaktiviert
            werden.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">4. Community-Bereich</h2>
          <p className="mt-2">Falls Community-Funktionen genutzt werden:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Profilname</li>
            <li>Profilbild</li>
            <li>Kommentare</li>
            <li>Beitraege</li>
            <li>hochgeladene Bilder</li>
          </ul>
          <p className="mt-2">koennen fuer andere Nutzer sichtbar sein.</p>
          <p className="mt-2">Bitte teile keine sensiblen Daten oeffentlich.</p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">5. Kurse und Inhalte</h2>
          <p className="mt-2">Innerhalb der App koennen Kursfortschritte gespeichert werden:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>abgeschlossene Module</li>
            <li>Lernfortschritte</li>
            <li>Favoriten</li>
            <li>gespeicherte Inhalte</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">6. Weitergabe von Daten</h2>
          <p className="mt-2">Deine personenbezogenen Daten werden nicht verkauft.</p>
          <p className="mt-2">
            Eine Weitergabe erfolgt nur, wenn dies technisch notwendig ist, beispielsweise
            an:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Hosting-Anbieter</li>
            <li>Datenbank-Anbieter</li>
            <li>Cloud-Dienste</li>
            <li>Analyse-Dienste</li>
            <li>KI-Dienste</li>
          </ul>
          <p className="mt-2">
            Diese Dienstleister verarbeiten Daten ausschliesslich im Rahmen der
            gesetzlichen Vorschriften.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">7. Speicherdauer</h2>
          <p className="mt-2">
            Personenbezogene Daten werden nur solange gespeichert, wie dies fuer die
            Nutzung der App notwendig ist oder gesetzliche Aufbewahrungsfristen bestehen.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">8. Deine Rechte</h2>
          <p className="mt-2">Du hast jederzeit das Recht auf:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Auskunft</li>
            <li>Berichtigung</li>
            <li>Loeschung</li>
            <li>Einschraenkung der Verarbeitung</li>
            <li>Datenuebertragbarkeit</li>
            <li>Widerruf einer Einwilligung</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">9. Kontakt</h2>
          <p className="mt-2">Bei Fragen zum Datenschutz:</p>
          <p className="mt-2 whitespace-pre-line">
            {`Felicitas Reitmeier
Sauer macht krustig
E-Mail: [E-Mail-Adresse]`}
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">
            10. Aenderungen dieser Datenschutzerklaerung
          </h2>
          <p className="mt-2">
            Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, damit sie den
            aktuellen rechtlichen Anforderungen entspricht.
          </p>
        </section>
      </div>
    </div>
  );
}
