import Link from "next/link";

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

export default function BrotCard({ brot, photoUrl, starterName }) {
  return (
    <Link href={`/brote/${brot.id}`} className="group block animate-rise">
      <article className="overflow-hidden rounded-3xl border border-mauve-500/15 bg-cream-50 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-warm">
        {photoUrl ? (
          <div className="aspect-[4/3] overflow-hidden bg-cream-200/50">
            <img
              src={photoUrl}
              alt={brot.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-honey-400/20 to-terra-500/15">
            <span className="text-6xl">🍞</span>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold text-cocoa-900 truncate">
                {brot.name}
              </h3>
              <p className="text-xs text-cocoa-700/65">
                {new Date(brot.baked_at).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {brot.rating > 0 && (
              <div className="shrink-0 text-sm font-semibold text-honey-500">
                {"★".repeat(brot.rating)}
                <span className="text-mauve-500/25">
                  {"★".repeat(5 - brot.rating)}
                </span>
              </div>
            )}
          </div>

          {(starterName || brot.crust || brot.crumb) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {starterName && (
                <span className="chip border-honey-400/30 bg-honey-400/15 text-honey-600 text-[10px]">
                  🫙 {starterName}
                </span>
              )}
              {brot.crust && (
                <span className="chip border-terra-500/25 bg-terra-500/10 text-terra-700 text-[10px]">
                  Kruste: {CRUST_LABELS[brot.crust]}
                </span>
              )}
              {brot.crumb && (
                <span className="chip border-mauve-500/25 bg-mauve-500/10 text-mauve-700 text-[10px]">
                  Krume: {CRUMB_LABELS[brot.crumb]}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
