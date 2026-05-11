import Link from "next/link";

export default function ZugangAbgelaufenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <div className="text-5xl">⏰</div>
          <h1 className="mt-3 font-display text-3xl text-cocoa-900">
            Dein Zugang ist abgelaufen
          </h1>
          <p className="mt-2 text-sm text-cocoa-700/70">
            Schoen, dass du die App genutzt hast!
          </p>
        </div>

        <div className="card space-y-3">
          <p className="text-sm leading-relaxed text-cocoa-800">
            Deine 3 Monate kostenfreier Zugang sind vorbei. Wenn du
            weiter dabei sein moechtest, kannst du:
          </p>
          <ul className="space-y-2 text-sm text-cocoa-800">
            <li className="flex items-start gap-2">
              <span>🛒</span>
              <span>Bei deinem naechsten Pampered-Chef-Einkauf einen neuen Code mitnehmen</span>
            </li>
            <li className="flex items-start gap-2">
              <span>💬</span>
              <span>Mir direkt schreiben, falls du Fragen hast</span>
            </li>
          </ul>
        </div>

        <a
          href="https://www.instagram.com/sauer.macht.krustig/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary block text-center"
        >
          Auf Instagram melden
        </a>

        <Link
          href="/login"
          className="btn-secondary block text-center"
        >
          Zum Login zurueck
        </Link>

        <p className="text-center text-[10px] text-cocoa-700/60">
          Deine Daten bleiben gespeichert — bei Verlaengerung sind sie wieder da. 🥖
        </p>
      </div>
    </div>
  );
}
