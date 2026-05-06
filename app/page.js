import Link from "next/link";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Dekorative Bläschen */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-honey-400/20 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-mauve-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-terra-500/15 blur-3xl" />
      </div>

      <header className="flex items-center justify-between px-6 py-5">
        <Logo />
        <Link href="/login" className="btn-ghost text-sm">
          Anmelden
        </Link>
      </header>

      <section className="mx-auto max-w-md px-6 pt-10 pb-32 text-center">
        <div className="mb-3 inline-block rounded-full border border-mauve-500/25 bg-cream-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mauve-700">
          Sauerteig · ehrlich · einfach
        </div>

        <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-cocoa-900">
          Dein Starter,{" "}
          <span className="italic text-terra-600 underline-wobble">
            im Blick
          </span>.
        </h1>

        <p className="mt-5 text-base text-cocoa-700/85">
          Fütterungen, Peak-Zeiten und kleine Aha-Momente — alles an einem Ort.
          Damit aus jedem Anstellgut ein krustiges Brot wird.
        </p>

        {/* Hero-Illustration: Glas mit Sauerteig */}
        <div className="my-10 flex justify-center">
          <svg
            width="200"
            height="220"
            viewBox="0 0 200 220"
            className="drop-shadow-xl"
          >
            <defs>
              <linearGradient id="dough" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8B547" />
                <stop offset="100%" stopColor="#C97B5B" />
              </linearGradient>
            </defs>
            {/* Glas */}
            <path
              d="M50 50 Q 50 40, 60 40 L 140 40 Q 150 40, 150 50 L 145 200 Q 145 210, 135 210 L 65 210 Q 55 210, 55 200 Z"
              fill="#FAF6F0"
              stroke="#5E3D4D"
              strokeWidth="2.5"
            />
            {/* Inhalt */}
            <path
              d="M58 110 Q 70 100, 85 110 T 115 110 T 142 110 L 144 198 Q 144 205, 137 205 L 63 205 Q 56 205, 56 198 Z"
              fill="url(#dough)"
            />
            {/* Bläschen */}
            <circle cx="75" cy="155" r="6" fill="#FAF6F0" opacity="0.9" />
            <circle cx="100" cy="170" r="9" fill="#FAF6F0" opacity="0.85" />
            <circle cx="125" cy="150" r="5" fill="#FAF6F0" opacity="0.9" />
            <circle cx="90" cy="130" r="4" fill="#FAF6F0" opacity="0.7" />
            <circle cx="115" cy="185" r="4" fill="#FAF6F0" opacity="0.8" />
            <circle cx="80" cy="190" r="3" fill="#FAF6F0" opacity="0.7" />
            {/* Wasserglas-Reflexion */}
            <path
              d="M68 70 L 68 180"
              stroke="#FAF6F0"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Markierung mit Gummiband */}
            <path
              d="M52 85 L 148 85"
              stroke="#9D6B7E"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            <text
              x="100"
              y="78"
              textAnchor="middle"
              fontFamily="serif"
              fontSize="11"
              fontStyle="italic"
              fill="#5E3D4D"
            >
              Peak
            </text>
            {/* Deckel */}
            <ellipse cx="100" cy="40" rx="50" ry="6" fill="#9D6B7E" />
          </svg>
        </div>

        <div className="mx-auto max-w-xs space-y-3">
          <Link href="/register" className="btn-primary w-full">
            Kostenlos starten
          </Link>
          <Link href="/login" className="btn-secondary w-full">
            Ich hab schon ein Konto
          </Link>
        </div>

        <ul className="mx-auto mt-10 max-w-sm space-y-2 text-left text-sm text-cocoa-700/80">
          <li className="flex gap-2"><span>🍞</span><span>Mehrere Starter parallel führen</span></li>
          <li className="flex gap-2"><span>⏳</span><span>Peak-Prognose nach Temperatur & Verhältnis</span></li>
          <li className="flex gap-2"><span>🆘</span><span>SOS-Bereich für die typischen Mucken</span></li>
        </ul>
      </section>

      <footer className="border-t border-mauve-500/10 px-6 py-6 text-center text-xs text-cocoa-700/60">
        Mit Liebe gemacht für die Sauerteig-Community.
      </footer>
    </main>
  );
}
