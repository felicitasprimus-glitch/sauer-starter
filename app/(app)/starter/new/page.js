import Link from "next/link";
import StarterForm from "@/components/StarterForm";

export default function NewStarterPage() {
  return (
    <main className="px-5 pt-6">
      <Link href="/dashboard" className="btn-ghost -ml-3 text-sm">
        ← Zurück
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900">
          Neuer{" "}
          <span className="italic text-terra-600">Starter</span>
        </h1>
        <p className="mt-1 text-sm text-cocoa-700/70">
          Gib ihm einen Namen — Hildegard, Roggen-Romeo, Bubbles … alles erlaubt.
        </p>
      </header>

      <section className="mt-6">
        <StarterForm mode="create" />
      </section>
    </main>
  );
}
