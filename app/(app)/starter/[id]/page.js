import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSignedPhotoUrls } from "@/lib/photos";
import FeedingForm from "@/components/FeedingForm";
import FeedingHistory from "@/components/FeedingHistory";
import { calculateStats, scoreLabel } from "@/lib/starterStats";

export const dynamic = "force-dynamic";

export default async function StarterDetailPage({ params }) {
  const supabase = createClient();
  const { id } = params;

  const { data: starter, error } = await supabase
    .from("starters")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !starter) {
    notFound();
  }

  const { data: feedings } = await supabase
    .from("feedings")
    .select("*")
    .eq("starter_id", id)
    .order("fed_at", { ascending: false })
    .limit(50);

  // Foto-URLs für die Fütterungen holen
  const photoPaths = (feedings ?? []).map((f) => f.photo_path).filter(Boolean);
  const photoUrls = await getSignedPhotoUrls(photoPaths);

  const daysOld = starter.start_date
    ? Math.floor(
        (Date.now() - new Date(starter.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const stats = calculateStats(feedings ?? []);
  const scoreInfo = scoreLabel(stats.triebkraftScore);

  return (
    <main className="px-5 pt-6">
      <Link href="/dashboard" className="btn-ghost -ml-3 text-sm">
        ← Meine Starter
      </Link>

      <header className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900 break-words">
            {starter.name}
          </h1>
          {starter.flour_type && (
            <p className="mt-0.5 text-sm text-cocoa-700/70">
              {starter.flour_type}
            </p>
          )}
        </div>
        <Link
          href={`/starter/${starter.id}/edit`}
          className="btn-secondary px-4 py-2 text-sm"
        >
          Bearbeiten
        </Link>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="chip border-honey-400/30 bg-honey-400/15 text-honey-600">
          {starter.hydration ?? 100}% TA
        </span>
        {starter.default_ratio && (
          <span className="chip border-mauve-500/25 bg-mauve-500/10 text-mauve-700">
            Standard {starter.default_ratio}
          </span>
        )}
        {daysOld != null && (
          <span className="chip border-terra-500/25 bg-terra-500/10 text-terra-700">
            {daysOld === 0 ? "frisch angesetzt" : `${daysOld} Tage`}
          </span>
        )}
      </div>

      {starter.notes && (
        <div className="mt-4 rounded-2xl border border-mauve-500/15 bg-cream-200/40 p-4 text-sm italic text-cocoa-700/85">
          „{starter.notes}"
        </div>
      )}

      {feedings && feedings.length > 0 && (
        <Link
          href={`/starter/${starter.id}/stats`}
          className="mt-4 block group"
        >
          <div className="rounded-2xl border border-honey-400/30 bg-gradient-to-br from-honey-400/15 to-terra-500/10 p-4 transition-all hover:-translate-y-0.5 hover:shadow-warm">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{scoreInfo.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-mauve-700">
                  Triebkraft
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-semibold text-cocoa-900">
                    {stats.triebkraftScore}
                  </span>
                  <span className="text-xs text-cocoa-700/65">/ 100</span>
                  <span className="ml-auto text-xs text-terra-600 transition-transform group-hover:translate-x-0.5">
                    Verlauf ansehen →
                  </span>
                </div>
                <div className="mt-0.5 text-sm text-cocoa-700/80">
                  {scoreInfo.label}
                  {stats.streak >= 2 && (
                    <span className="ml-2 text-xs text-honey-600">
                      🔥 {stats.streak} Tage Streak
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-cocoa-900">
          Fütterung eintragen
        </h2>
        <p className="text-sm text-cocoa-700/70">
          Die Uhrzeit wird automatisch übernommen.
        </p>
        <div className="mt-4 card">
          <FeedingForm starter={starter} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-cocoa-900">
          Verlauf
        </h2>
        <p className="text-sm text-cocoa-700/70">Letzte 50 Fütterungen.</p>
        <div className="mt-4">
          <FeedingHistory feedings={feedings ?? []} photoUrls={photoUrls} />
        </div>
      </section>
    </main>
  );
}
