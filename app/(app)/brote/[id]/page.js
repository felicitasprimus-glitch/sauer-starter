import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSignedPhotoUrl } from "@/lib/photos";

export const dynamic = "force-dynamic";

const CRUST_LABELS = {
  hell: "Hell",
  goldbraun: "Goldbraun",
  dunkel: "Dunkel",
  rustikal: "Rustikal",
};

const CRUMB_LABELS = {
  fein: "Fein",
  mittel: "Mittel",
  offen: "Offen",
  wild_offen: "Wild offen",
};

function scoreLabel(score) {
  if (score >= 8) return { text: "Spitzenkrume!", emoji: "🏆", color: "text-emerald-700" };
  if (score >= 6) return { text: "Gut gelungen", emoji: "👍", color: "text-emerald-600" };
  if (score >= 4) return { text: "Solide Krume", emoji: "🌾", color: "text-honey-600" };
  if (score >= 2) return { text: "Da geht noch was", emoji: "🌱", color: "text-terra-500" };
  return { text: "Foto unklar", emoji: "🤔", color: "text-cocoa-500" };
}

export default async function BrotDetailPage({ params }) {
  const supabase = createClient();
  const { id } = params;

  const { data: brot } = await supabase
    .from("brote")
    .select("*")
    .eq("id", id)
    .single();

  if (!brot) notFound();

  const photoUrl = await getSignedPhotoUrl(brot.photo_path);

  let starterName = null;
  if (brot.starter_id) {
    const { data: starter } = await supabase
      .from("starters")
      .select("name")
      .eq("id", brot.starter_id)
      .single();
    starterName = starter?.name;
  }

  let krumeAnalyse = null;
  let krumePhotoUrl = null;
  if (brot.krume_analyse_id) {
    const { data: analyse } = await supabase
      .from("krumen_analysen")
      .select("*")
      .eq("id", brot.krume_analyse_id)
      .single();
    if (analyse) {
      krumeAnalyse = analyse;
      if (analyse.photo_path) {
        krumePhotoUrl = await getSignedPhotoUrl(analyse.photo_path);
      }
    }
  }

  const krumeTippsList =
    brot.krume_tipps && typeof brot.krume_tipps === "string"
      ? brot.krume_tipps.split("\n").filter((t) => t.trim())
      : krumeAnalyse?.raw_json?.tipps || [];

  const krumeScore = brot.krume_score || krumeAnalyse?.score;
  const krumeDiagnose = brot.krume_diagnose || krumeAnalyse?.diagnose;

  return (
    <main className="px-5 pt-6">
      <Link href="/brote" className="btn-ghost -ml-3 text-sm">
        ← Brot-Tagebuch
      </Link>

      {photoUrl && (
        <div className="mt-4 overflow-hidden rounded-3xl shadow-soft">
          <img
            src={photoUrl}
            alt={brot.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      )}

      <header className="mt-5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900 break-words">
            {brot.name}
          </h1>
          <p className="mt-0.5 text-sm text-cocoa-700/70">
            Gebacken am{" "}
            {new Date(brot.baked_at).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link
          href={`/brote/${brot.id}/edit`}
          className="btn-secondary px-4 py-2 text-sm"
        >
          Bearbeiten
        </Link>
      </header>

      {brot.rating > 0 && (
        <div className="mt-3 text-2xl text-honey-500">
          {"★".repeat(brot.rating)}
          <span className="text-mauve-500/25">
            {"★".repeat(5 - brot.rating)}
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {starterName && (
          <span className="chip border-honey-400/30 bg-honey-400/15 text-honey-600">
            🫙 {starterName}
          </span>
        )}
        {brot.hydration && (
          <span className="chip border-mauve-500/25 bg-mauve-500/10 text-mauve-700">
            {brot.hydration}% TA
          </span>
        )}
        {brot.crust && (
          <span className="chip border-terra-500/25 bg-terra-500/10 text-terra-700">
            Kruste: {CRUST_LABELS[brot.crust]}
          </span>
        )}
        {brot.crumb && (
          <span className="chip border-mauve-500/25 bg-mauve-500/10 text-mauve-700">
            Krume: {CRUMB_LABELS[brot.crumb]}
          </span>
        )}
      </div>

      {krumeScore != null && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-mauve-700">
            KI-Krumen-Analyse
          </h2>

          <div className="mt-2 rounded-2xl bg-cream-50 p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <div className={`text-4xl font-bold ${scoreLabel(krumeScore).color}`}>
                  {krumeScore}/10
                </div>
                <div className={`text-sm font-medium ${scoreLabel(krumeScore).color}`}>
                  {scoreLabel(krumeScore).emoji} {scoreLabel(krumeScore).text}
                </div>
              </div>
              {krumeAnalyse && (
                <div className="text-right text-xs text-cocoa-500">
                  {krumeAnalyse.porung && <div>Porung: {krumeAnalyse.porung}</div>}
                  {krumeAnalyse.hydration_estimate && (
                    <div>Hydration: {krumeAnalyse.hydration_estimate}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {krumePhotoUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl shadow-sm">
              <img
                src={krumePhotoUrl}
                alt="Krume"
                className="aspect-square w-full object-cover"
              />
            </div>
          )}

          {krumeDiagnose && (
            <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-cocoa-900">Diagnose</h3>
              <p className="mt-1 text-sm text-cocoa-700">{krumeDiagnose}</p>
            </div>
          )}

          {krumeTippsList && krumeTippsList.length > 0 && (
            <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-cocoa-900">
                Tipps fuers naechste Mal
              </h3>
              <ul className="mt-2 space-y-1.5">
                {krumeTippsList.map((tipp, i) => (
                  <li key={i} className="flex gap-2 text-sm text-cocoa-700">
                    <span className="text-terra-500">→</span>
                    <span>{tipp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {!krumeScore && (
        <section className="mt-6 rounded-2xl border border-dashed border-mauve-300 bg-cream-50 p-4 text-center">
          <p className="text-sm text-cocoa-700">
            Noch keine Krumen-Analyse fuer dieses Brot.
          </p>
          <Link
            href="/krume"
            className="mt-2 inline-block text-sm font-medium text-terra-600 hover:text-terra-700"
          >
            Jetzt Krume analysieren →
          </Link>
        </section>
      )}

      {brot.flour_types && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-mauve-700">
            Mehle
          </h2>
          <p className="mt-1 text-cocoa-800">{brot.flour_types}</p>
        </section>
      )}

      {brot.notes && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-mauve-700">
            Notizen
          </h2>
          <p className="mt-1 whitespace-pre-wrap italic text-cocoa-800/85">
            {brot.notes}
          </p>
        </section>
      )}
    </main>
  );
}
