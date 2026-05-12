import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <div className="text-5xl">🍞</div>
          <h1 className="mt-3 font-display text-4xl text-cocoa-900">
            Sauer macht krustig
          </h1>
          <p className="mt-2 text-sm text-cocoa-700/70">
            Dein Sauerteig-Tagebuch
          </p>
        </div>

        <div className="card space-y-4 text-left">
          <p className="text-sm leading-relaxed text-cocoa-800">
            Tracke deinen Starter, dokumentiere deine Brote und analysiere
            deine Krume mit KI. Alles an einem Ort.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/register" className="btn-primary text-center">
            Kostenlos starten
          </Link>

          <Link href="/login" className="btn-secondary text-center">
            Ich habe schon ein Konto
          </Link>
        </div>

        <p className="text-[10px] text-cocoa-700/60">
          Du brauchst einen Aktivierungs-Code zur Anmeldung. 🥖
        </p>
      </div>
    </div>
  );
}
