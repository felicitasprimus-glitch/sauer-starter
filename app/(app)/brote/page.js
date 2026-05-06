import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSignedPhotoUrls } from "@/lib/photos";
import BrotCard from "@/components/BrotCard";

export const dynamic = "force-dynamic";

export default async function BrotePage() {
  const supabase = createClient();

  const { data: brote } = await supabase
    .from("brote")
    .select("*")
    .order("baked_at", { ascending: false });

  const { data: starters } = await supabase.from("starters").select("id, name");
  const starterMap = {};
  (starters ?? []).forEach((s) => (starterMap[s.id] = s.name));

  const photoPaths = (brote ?? []).map((b) => b.photo_path).filter(Boolean);
  const photoUrls = await getSignedPhotoUrls(photoPaths);

  return (
    <main className="px-5 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-cocoa-700/70">Mein</p>
          <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900">
            Brot-{" "}
            <span className="italic text-terra-600 underline-wobble">
              Tagebuch
            </span>
          </h1>
        </div>
      </header>

      <section className="mt-6">
        {brote && brote.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {brote.map((b) => (
              <BrotCard
                key={b.id}
                brot={b}
                photoUrl={b.photo_path ? photoUrls[b.photo_path] : null}
                starterName={b.starter_id ? starterMap[b.starter_id] : null}
              />
            ))}
            <Link
              href="/brote/new"
              className="flex aspect-[4/3] items-center justify-center rounded-3xl border-2 border-dashed border-mauve-500/30 bg-cream-200/30 transition-colors hover:border-terra-500/50 hover:bg-cream-200/60"
            >
              <span className="text-center font-display text-cocoa-800">
                <span className="text-3xl">+</span>
                <br />
                <span className="text-sm">Brot eintragen</span>
              </span>
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-mauve-500/15 bg-cream-50 p-8 text-center shadow-soft">
            <div className="mb-3 text-5xl animate-bubble">🍞</div>
            <h2 className="font-display text-2xl font-medium text-cocoa-900">
              Noch kein Brot im Tagebuch
            </h2>
            <p className="mt-1 text-sm text-cocoa-700/70">
              Halte fest, was du gebacken hast — mit Foto, Bewertung und Notizen.
            </p>
            <Link href="/brote/new" className="btn-primary mt-5">
              Erstes Brot eintragen
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
