import Link from "next/link";
import { translate } from "@/lib/translations";

const DATE_LOCALE = { de: "de-DE", en: "en-US", es: "es-ES" };

export default function BrotCard({ brot, photoUrl, starterName, lang = "de" }) {
  const t = (k) => translate(lang, k);

  const date = brot.baked_at
    ? new Date(brot.baked_at).toLocaleDateString(DATE_LOCALE[lang] || "de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";
  const rating = brot.rating || 0;

  return (
    <Link
      href={`/brote/${brot.id}`}
      className="flex items-center gap-3.5 rounded-[24px] border border-line bg-white p-3.5 shadow-card"
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={brot.name}
          className="h-[66px] w-[66px] flex-shrink-0 rounded-[18px] object-cover"
        />
      ) : (
        <div
          className="flex h-[66px] w-[66px] flex-shrink-0 items-center justify-center rounded-[18px] text-2xl"
          style={{ background: "#F3E8EE" }}
        >
          🍞
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-display text-[19px] font-semibold text-ink">
            {brot.name}
          </h3>
          {rating > 0 ? (
            <span
              className="flex-shrink-0 text-[13px]"
              style={{ color: "#c9a14e", letterSpacing: "1px" }}
            >
              {"\u2605".repeat(rating)}
              <span style={{ color: "#e3d3da" }}>
                {"\u2605".repeat(5 - rating)}
              </span>
            </span>
          ) : null}
        </div>

        {date ? <p className="mt-0.5 text-xs text-muted">{date}</p> : null}

        {brot.crust || brot.crumb ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {brot.crust ? (
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: "#F3ECE0", color: "#9a6e82" }}
              >
                {t("brote.crust")}: {t("crust." + brot.crust)}
              </span>
            ) : null}
            {brot.crumb ? (
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: "#F1EAEF", color: "#8b6a7d" }}
              >
                {t("brote.crumb")}: {t("crumb." + brot.crumb)}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
