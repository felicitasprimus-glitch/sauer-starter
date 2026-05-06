import Link from "next/link";

export default function StarterCard({ starter, lastFeeding }) {
  const daysOld = starter.start_date
    ? Math.floor(
        (Date.now() - new Date(starter.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <Link
      href={`/starter/${starter.id}`}
      className="group block animate-rise"
    >
      <article className="card transition-all hover:-translate-y-0.5 hover:shadow-warm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-semibold text-cocoa-900 truncate">
              {starter.name}
            </h3>
            {starter.flour_type && (
              <p className="mt-0.5 text-sm text-cocoa-700/70">
                {starter.flour_type}
              </p>
            )}
          </div>
          <div className="shrink-0 rounded-full bg-honey-400/15 px-3 py-1 text-xs font-bold text-honey-600">
            {starter.hydration ?? 100}% TA
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {starter.default_ratio && (
            <span className="chip border-mauve-500/25 bg-mauve-500/10 text-mauve-700">
              {starter.default_ratio}
            </span>
          )}
          {daysOld != null && (
            <span className="chip border-terra-500/25 bg-terra-500/10 text-terra-700">
              {daysOld === 0 ? "frisch angesetzt" : `${daysOld} Tage alt`}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-mauve-500/10 pt-3">
          <span className="text-xs text-cocoa-700/60">
            {lastFeeding
              ? `Letzte Fütterung: ${new Date(
                  lastFeeding.fed_at
                ).toLocaleString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Noch keine Fütterung"}
          </span>
          <span className="text-terra-600 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </article>
    </Link>
  );
}
