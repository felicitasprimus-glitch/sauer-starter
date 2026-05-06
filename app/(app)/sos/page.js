import Link from "next/link";

const issues = [
  {
    icon: "💧",
    title: "Hooch oben (graue Flüssigkeit)",
    cause: "Dein Starter hat Hunger — die Hefen sind durch und produzieren Alkohol.",
    fix: [
      "Hooch abgießen oder unterrühren (gibt Säure)",
      "Sofort füttern, gerne im Verhältnis 1:5:5 oder 1:10:10",
      "Nächstes Mal früher füttern oder kühler stellen",
    ],
  },
  {
    icon: "😴",
    title: "Schwach & faul, geht kaum auf",
    cause: "Zu kalt, zu lange im Kühlschrank oder zu wenig Futter.",
    fix: [
      "An warmen Ort stellen (24–28°C)",
      "Zwei bis drei Tage je 12 Std. füttern (1:1:1)",
      "Vollkornmehl-Anteil erhöhen — gibt mehr Mineralien",
    ],
  },
  {
    icon: "🍷",
    title: "Riecht stark nach Aceton oder Nagellack",
    cause: "Klassisches Hunger-Signal mit Übersäuerung.",
    fix: [
      "Großzügige Auffrischung 1:10:10",
      "12 Std. später nochmal füttern",
      "Bei Bedarf 2–3 Tage täglich auffrischen",
    ],
  },
  {
    icon: "🦠",
    title: "Schimmel (rosa, schwarz, grün, pelzig)",
    cause: "Echter Schimmel — keine Diskussion.",
    fix: [
      "Komplett wegwerfen, Glas heiß auswaschen",
      "Neu ansetzen mit frischem Mehl & sauberem Glas",
      "Nicht riskieren, nicht abschoepfen",
    ],
  },
  {
    icon: "🌫️",
    title: "Weißlicher Belag oder Häutchen",
    cause: "Meist Kahmhefe — harmlos, aber unschön.",
    fix: [
      "Belag und obere Schicht abnehmen",
      "Frisch füttern, Glas sauber abwischen",
      "Häufiger füttern oder TA reduzieren",
    ],
  },
  {
    icon: "🍌",
    title: "Riecht süßlich / nach Banane",
    cause: "Frischphase — junger Starter ohne ausgereifte Säuren.",
    fix: [
      "Geduld: 5–10 Tage täglich füttern",
      "Roggenanteil erhöhen für mehr Säure",
      "Wärme (24–26°C) hilft beim Ausbau der Bakterien",
    ],
  },
  {
    icon: "📏",
    title: "Geht hoch, fällt aber sofort wieder zusammen",
    cause: "Peak schon überschritten — alles gut, nur Timing nutzen.",
    fix: [
      "Höher gefüttert: 1:5:5 oder 1:10:10",
      "Kühler stellen, um Peak zu strecken",
      "Mit Gummiband Höhe markieren — Peak besser treffen",
    ],
  },
];

export default function SosPage() {
  return (
    <main className="px-5 pt-6">
      <Link href="/dashboard" className="btn-ghost -ml-3 text-sm">
        ← Zurück
      </Link>

      <header className="mt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-terra-500/30 bg-terra-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-terra-700">
          <span>🆘</span> SOS
        </div>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-cocoa-900">
          Mein Starter{" "}
          <span className="italic text-terra-600">spinnt</span>.
        </h1>
        <p className="mt-1 text-sm text-cocoa-700/80">
          Die typischen Mucken und was du tun kannst. Tief durchatmen — fast immer rettbar.
        </p>
      </header>

      <section className="mt-6 space-y-4">
        {issues.map((issue, i) => (
          <details
            key={i}
            className="card group cursor-pointer animate-rise [&[open]_.chev]:rotate-90"
          >
            <summary className="flex items-start gap-3 list-none">
              <span className="text-2xl shrink-0">{issue.icon}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-semibold text-cocoa-900">
                  {issue.title}
                </h3>
                <p className="mt-0.5 text-sm text-cocoa-700/70">
                  {issue.cause}
                </p>
              </div>
              <span className="chev shrink-0 text-terra-600 transition-transform">
                ›
              </span>
            </summary>
            <div className="mt-4 border-t border-mauve-500/10 pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-mauve-700">
                So rettest du den Tag
              </p>
              <ul className="space-y-2">
                {issue.fix.map((step, j) => (
                  <li key={j} className="flex gap-2 text-sm text-cocoa-800">
                    <span className="text-terra-600">✓</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </section>

      <p className="mt-8 mb-4 text-center text-xs text-cocoa-700/60">
        Du bist nicht allein — die meisten Probleme sind normal. 🥖
      </p>
    </main>
  );
}
