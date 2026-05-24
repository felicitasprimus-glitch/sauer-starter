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

      <h1 className="mt-6 font-display text-3xl text-cocoa-900">Datenschutzerklaerung</h1>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-cocoa-800">
        {/* ==========================================================
            HIER KOMMT DEIN GENERIERTER DATENSCHUTZ-TEXT REIN.
            Felicitas: generiere den Text bei eRecht24 / Haendlerbund
            (mit den Besonderheiten: KI-Analyse via Anthropic/USA,
            Supabase, Community-Profile, Cookies) und schick ihn mir -
            ich setze ihn dir hier sauber ein.
            ========================================================== */}
        <p>
          Diese Datenschutzerklaerung wird gerade finalisiert und in Kuerze ergaenzt.
        </p>
      </div>
    </div>
  );
}
