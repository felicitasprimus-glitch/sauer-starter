import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSignedPhotoUrls } from "@/lib/photos";
import BrotCard from "@/components/BrotCard";

export const dynamic = "force-dynamic";

export default async function BrotePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initial = "S";
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    const base = (profile && profile.display_name) || user.email || "S";
    initial = base.trim().charAt(0).toUpperCase();
  }

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
    <div className="pb-6">
      {/* TOP BAR */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[3px] text-mauve-700">
          Sauer · macht · krustig
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-altrosa font-display text-base font-bold text-brombeer">
          {initial}
        </div>
      </div>

      {/* HERO BANNER (zeigt Verlauf, solange kein brote-hero.jpg da ist) */}
      <div
        className="mb-4 h-[180px] overflow-hidden rounded-[24px]"
        style={{
          backgroundImage:
            "url(/brote-hero.jpg), linear-gradient(135deg, #8b6a7d 0%, #5a3f56 100%)",
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
        }}
      />

      {/* TITEL */}
      <div className="mb-5 text-center">
        <h1 className="font-display text-[30px] font-semibold text-brombeer">
          Mein Brot-Tagebuch
        </h1>
        <p className="mt-1 text-[13px] text-muted">
          Fortschritte festhalten & besser werden.
        </p>
      </div>

      {/* LISTE */}
      {brote && brote.length > 0 ? (
        <div className="space-y-3.5">
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
            className="flex items-center justify-center gap-2 rounded-[22px] border-[1.6px] border-dashed border-altrosa px-4 py-4 text-sm font-semibold text-mauve-500"
            style={{ background: "rgba(221,188,198,0.10)" }}
          >
            + Neues Brot eintragen
          </Link>
        </div>
      ) : (
        <div className="rounded-[24px] border border-line bg-white p-8 text-center shadow-card">
          <div className="text-4xl">🍞</div>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
            Noch kein Brot im Tagebuch
          </h2>
          <p className="mt-2 text-sm text-muted">
            Halte fest, was du gebacken hast - mit Foto, Bewertung und Notizen.
          </p>
          <Link
            href="/brote/new"
            className="mt-5 inline-block rounded-2xl bg-mauve-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Erstes Brot eintragen
          </Link>
        </div>
      )}
    </div>
  );
}
