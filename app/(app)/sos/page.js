import { cookies } from "next/headers";
import { translate } from "@/lib/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const dynamic = "force-dynamic";

const ISSUES = {
  de: [
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
  ],
  en: [
    {
      icon: "💧",
      title: "Hooch on top (gray liquid)",
      cause: "Your starter is hungry — the yeasts are spent and producing alcohol.",
      fix: [
        "Pour off the hooch or stir it in (adds sourness)",
        "Feed right away, ideally 1:5:5 or 1:10:10",
        "Next time feed earlier or keep it cooler",
      ],
    },
    {
      icon: "😴",
      title: "Weak & sluggish, barely rises",
      cause: "Too cold, too long in the fridge, or too little food.",
      fix: [
        "Move it to a warm spot (24–28°C)",
        "Feed every 12 h for two to three days (1:1:1)",
        "Increase the wholegrain share — more minerals",
      ],
    },
    {
      icon: "🍷",
      title: "Smells strongly of acetone or nail polish",
      cause: "Classic hunger signal with over-acidification.",
      fix: [
        "Generous refresh 1:10:10",
        "Feed again 12 h later",
        "If needed, refresh daily for 2–3 days",
      ],
    },
    {
      icon: "🦠",
      title: "Mold (pink, black, green, fuzzy)",
      cause: "Real mold — no debate.",
      fix: [
        "Throw it all out, wash the jar with hot water",
        "Start fresh with new flour & a clean jar",
        "Do not risk it, do not scrape it off",
      ],
    },
    {
      icon: "🌫️",
      title: "Whitish film or skin",
      cause: "Usually kahm yeast — harmless but unsightly.",
      fix: [
        "Remove the film and top layer",
        "Feed fresh, wipe the jar clean",
        "Feed more often or lower the hydration",
      ],
    },
    {
      icon: "🍌",
      title: "Smells sweet / like banana",
      cause: "Early phase — young starter without mature acids.",
      fix: [
        "Patience: feed daily for 5–10 days",
        "Increase the rye share for more acidity",
        "Warmth (24–26°C) helps the bacteria develop",
      ],
    },
    {
      icon: "📏",
      title: "Rises high but collapses right away",
      cause: "Peak already passed — all good, just use the timing.",
      fix: [
        "Feed higher: 1:5:5 or 1:10:10",
        "Keep it cooler to stretch the peak",
        "Mark the height with a rubber band — hit the peak better",
      ],
    },
  ],
  es: [
    {
      icon: "💧",
      title: "Hooch encima (líquido gris)",
      cause: "Tu masa madre tiene hambre — las levaduras están agotadas y producen alcohol.",
      fix: [
        "Escurre el hooch o intégralo (aporta acidez)",
        "Aliméntala enseguida, ideal 1:5:5 o 1:10:10",
        "La próxima vez aliméntala antes o ponla más fresca",
      ],
    },
    {
      icon: "😴",
      title: "Débil y perezosa, apenas sube",
      cause: "Demasiado fría, mucho tiempo en la nevera o poco alimento.",
      fix: [
        "Ponla en un lugar cálido (24–28°C)",
        "Aliméntala cada 12 h durante dos o tres días (1:1:1)",
        "Aumenta la proporción de harina integral — más minerales",
      ],
    },
    {
      icon: "🍷",
      title: "Huele fuerte a acetona o quitaesmalte",
      cause: "Señal clásica de hambre con exceso de acidez.",
      fix: [
        "Refresco generoso 1:10:10",
        "Aliméntala otra vez 12 h después",
        "Si hace falta, refresca a diario 2–3 días",
      ],
    },
    {
      icon: "🦠",
      title: "Moho (rosa, negro, verde, peludo)",
      cause: "Moho de verdad — sin discusión.",
      fix: [
        "Tírala entera, lava el frasco con agua caliente",
        "Empieza de nuevo con harina fresca y frasco limpio",
        "No te arriesgues, no la rasques",
      ],
    },
    {
      icon: "🌫️",
      title: "Capa o película blanquecina",
      cause: "Suele ser levadura kahm — inofensiva pero fea.",
      fix: [
        "Retira la capa y la parte superior",
        "Aliméntala fresca, limpia bien el frasco",
        "Aliméntala más a menudo o baja la hidratación",
      ],
    },
    {
      icon: "🍌",
      title: "Huele dulce / a plátano",
      cause: "Fase joven — masa madre nueva sin ácidos maduros.",
      fix: [
        "Paciencia: aliméntala a diario 5–10 días",
        "Aumenta la proporción de centeno para más acidez",
        "El calor (24–26°C) ayuda a desarrollar las bacterias",
      ],
    },
    {
      icon: "📏",
      title: "Sube mucho pero se desploma enseguida",
      cause: "Ya pasó el punto máximo — todo bien, aprovecha el tiempo.",
      fix: [
        "Aliméntala más alta: 1:5:5 o 1:10:10",
        "Ponla más fresca para alargar el punto máximo",
        "Marca la altura con una goma — acierta mejor el punto",
      ],
    },
  ],
};

export default function SosPage() {
  const lang = cookies().get("lang")?.value || "de";
  const t = (k) => translate(lang, k);
  const issues = ISSUES[lang] || ISSUES.de;

  return (
    <div className="pb-6">
      {/* HERO mit rotem !-Punkt (zeigt Verlauf, solange kein Bild da ist) */}
      <div className="relative">
        <div
          className="h-[180px] overflow-hidden rounded-[24px]"
          style={{
            backgroundImage:
              "url(/starter-hero.jpg), linear-gradient(135deg, #8b6a7d 0%, #5a3f56 100%)",
            backgroundSize: "cover, cover",
            backgroundPosition: "center, center",
          }}
        />
        <div className="absolute right-3 top-3 z-10">
          <LanguageSwitcher />
        </div>
        <div
          className="absolute -bottom-4 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{
            background: "#c0392b",
            border: "3px solid #faf4ee",
            boxShadow: "0 6px 16px rgba(192,57,43,0.30)",
          }}
        >
          !
        </div>
      </div>

      <div className="mb-5 mt-8 text-center">
        <h1 className="font-display text-[30px] font-semibold text-brombeer">
          {t("sos.title")}
        </h1>
        <p className="mx-auto mt-1 max-w-xs text-[13px] leading-relaxed text-muted">
          {t("sos.subtitle")}
        </p>
      </div>

      <section className="space-y-3.5">
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
                <p className="mt-0.5 text-sm text-cocoa-700/70">{issue.cause}</p>
              </div>
              <span className="chev shrink-0 text-terra-600 transition-transform">
                ›
              </span>
            </summary>
            <div className="mt-4 border-t border-mauve-500/10 pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-mauve-700">
                {t("sos.fixLabel")}
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
        {t("sos.footer")}
      </p>
    </div>
  );
}
