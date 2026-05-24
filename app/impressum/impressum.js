import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-10">
      <Link
        href="/"
        className="text-xs uppercase tracking-wider text-mauve-700 hover:text-cocoa-900"
      >
        ← Sauer macht krustig
      </Link>

      <h1 className="mt-6 font-display text-3xl text-cocoa-900">Impressum</h1>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-cocoa-800">
        <section>
          <h2 className="font-display text-lg text-cocoa-900">Angaben gemaess § 5 DDG</h2>
          <p className="mt-2 whitespace-pre-line">
            {`[Vorname Nachname]
[Strasse Hausnummer]
[PLZ Ort]
Deutschland`}
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">Kontakt</h2>
          <p className="mt-2 whitespace-pre-line">
            {`E-Mail: [deine-email@beispiel.de]
[optional: Telefon: ...]`}
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">
            Verantwortlich fuer den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-2">[Vorname Nachname], Anschrift wie oben</p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">Haftung fuer Inhalte</h2>
          <p className="mt-2">
            Die Inhalte dieser Seiten wurden mit groesster Sorgfalt erstellt. Fuer die
            Richtigkeit, Vollstaendigkeit und Aktualitaet der Inhalte kann jedoch keine
            Gewaehr uebernommen werden.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">Haftung fuer Links</h2>
          <p className="mt-2">
            Dieses Angebot enthaelt Links zu externen Websites Dritter, auf deren Inhalte
            kein Einfluss besteht. Fuer die Inhalte der verlinkten Seiten ist stets der
            jeweilige Anbieter verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-cocoa-900">Urheberrecht</h2>
          <p className="mt-2">
            Die durch den Seitenbetreiber erstellten Inhalte unterliegen dem deutschen
            Urheberrecht. Beitraege Dritter sind als solche gekennzeichnet.
          </p>
        </section>
      </div>
    </div>
  );
}
