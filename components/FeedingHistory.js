"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STATE_LABELS, STATE_COLORS } from "@/lib/peakPrediction";

export default function FeedingHistory({ feedings, photoUrls = {} }) {
  const router = useRouter();
  const supabase = createClient();
  const [deletingId, setDeletingId] = useState(null);
  const [zoomedPhoto, setZoomedPhoto] = useState(null);

  async function handleDelete(id, photoPath) {
    if (!confirm("Diese Fütterung löschen?")) return;
    setDeletingId(id);
    if (photoPath) {
      await supabase.storage.from("photos").remove([photoPath]);
    }
    const { error } = await supabase.from("feedings").delete().eq("id", id);
    setDeletingId(null);
    if (!error) router.refresh();
  }

  if (!feedings || feedings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-mauve-500/30 bg-cream-200/30 p-6 text-center">
        <div className="text-3xl">🌾</div>
        <p className="mt-2 font-display text-cocoa-800">
          Noch keine Fütterungen
        </p>
        <p className="text-sm text-cocoa-700/70">
          Trag oben deine erste Fütterung ein.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {feedings.map((f) => {
          const date = new Date(f.fed_at);
          const total = Number(f.asg_g) + Number(f.flour_g) + Number(f.water_g);
          const photoUrl = f.photo_path ? photoUrls[f.photo_path] : null;
          return (
            <li key={f.id} className="card flex items-start gap-4 animate-rise">
              <div className="shrink-0 text-center">
                <div className="font-display text-2xl font-semibold text-cocoa-900">
                  {date.getDate()}.
                </div>
                <div className="-mt-1 text-xs uppercase tracking-wider text-cocoa-700/60">
                  {date.toLocaleString("de-DE", { month: "short" })}
                </div>
                <div className="mt-1 text-xs font-semibold text-terra-600">
                  {date.toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-body text-sm font-semibold text-cocoa-800">
                    {f.asg_g}g · {f.flour_g}g · {f.water_g}g
                  </span>
                  {f.temperature != null && (
                    <span className="text-xs text-cocoa-700/60">
                      {f.temperature}°C
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-cocoa-700/50">
                  Gesamt: {total}g
                </div>

                {f.state && (
                  <span className={`chip mt-2 ${STATE_COLORS[f.state] ?? ""}`}>
                    {STATE_LABELS[f.state] ?? f.state}
                  </span>
                )}

                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setZoomedPhoto(photoUrl)}
                    className="mt-3 block w-full overflow-hidden rounded-2xl"
                  >
                    <img
                      src={photoUrl}
                      alt="Fütterung"
                      className="h-32 w-full object-cover transition-transform hover:scale-[1.02]"
                    />
                  </button>
                )}

                {f.notes && (
                  <p className="mt-2 text-sm italic text-cocoa-700/80">
                    „{f.notes}"
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(f.id, f.photo_path)}
                disabled={deletingId === f.id}
                className="shrink-0 text-cocoa-700/40 transition-colors hover:text-terra-600 disabled:opacity-40"
                aria-label="Fütterung löschen"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 7 L 19 7 M 9 7 V 5 Q 9 4, 10 4 L 14 4 Q 15 4, 15 5 V 7 M 7 7 L 8 20 Q 8 21, 9 21 L 15 21 Q 16 21, 16 20 L 17 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Foto-Lightbox */}
      {zoomedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-900/90 p-4 backdrop-blur-sm"
          onClick={() => setZoomedPhoto(null)}
        >
          <img
            src={zoomedPhoto}
            alt="Foto vergrößert"
            className="max-h-[90vh] max-w-full rounded-2xl object-contain"
          />
          <button
            onClick={() => setZoomedPhoto(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/95 text-cocoa-800"
            aria-label="Schließen"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6 L 18 18 M 18 6 L 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
