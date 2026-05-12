"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getStarterFeedingStatus, formatTimeAgo } from "@/lib/feedingStatus";

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [starters, setStarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return;
    }
    setUser(userData.user);

    // Alle Starter laden mit ihren neuesten Fuetterungen
    const { data: starterData } = await supabase
      .from("starters")
      .select("*, feedings(*)")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (starterData) {
      // Fuetterungen pro Starter sortieren (neueste zuerst)
      const startersWithSorted = starterData.map((s) => ({
        ...s,
        feedings: (s.feedings || []).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ),
      }));
      setStarters(startersWithSorted);

      // Photo-URLs vorab laden
      const urls = {};
      for (const s of startersWithSorted) {
        if (s.photo_path) {
          const { data } = await supabase.storage
            .from("photos")
            .createSignedUrl(s.photo_path, 3600);
          if (data?.signedUrl) urls[s.id] = data.signedUrl;
        }
      }
      setImageUrls(urls);
    }

    setLoading(false);
  }

  // Status fuer jeden Starter berechnen
  const startersWithStatus = starters.map((s) => ({
    ...s,
    status: getStarterFeedingStatus(s, s.feedings),
  }));

  // Starter die jetzt Aufmerksamkeit brauchen
  const needsAttention = startersWithStatus.filter(
    (s) => s.status?.needsAttention
  );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="brand-mark">Sauer macht krustig</p>
        <h1 className="font-display-italic text-display-lg mt-2">Starter</h1>
      </div>

      {/* WARNUNGEN — wenn ein Starter Hunger hat */}
      {needsAttention.length > 0 && (
        <div className="space-y-3">
          {needsAttention.map((s) => (
            <Link
              key={s.id}
              href={`/starter/${s.id}`}
              className={`block border-2 p-4 transition-all hover:shadow-glow ${
                s.status.isOverdue
                  ? "border-terra-600 bg-terra-400/10"
                  : "border-gold-500 bg-gold-100/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{s.status.statusEmoji}</div>
                <div className="flex-1">
                  <p className="mini-label text-cocoa-900">
                    {s.status.isOverdue ? "Dringend" : "Erinnerung"}
                  </p>
                  <p className="font-display-italic text-xl text-cocoa-900">
                    {s.name} braucht Futter
                  </p>
                  <p className="text-xs text-cocoa-700">
                    Letzte Fuetterung {formatTimeAgo(s.status.hoursSinceLastFeeding)}
                  </p>
                </div>
                <div className="text-mauve-700">→</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Starter-Liste */}
      {loading ? (
        <div className="card text-center text-sm text-cocoa-700">Laedt ...</div>
      ) : starters.length === 0 ? (
        <div className="card text-center">
          <p className="text-4xl">🌾</p>
          <h2 className="mt-3 font-display-italic text-2xl">Noch kein Starter</h2>
          <p className="mt-2 text-sm text-cocoa-700/70">
            Leg deinen ersten Sauerteig-Starter an.
          </p>
          <Link href="/starter/new" className="btn-primary mt-4 inline-block">
            Starter anlegen
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {startersWithStatus.map((s) => (
            <Link
              key={s.id}
              href={`/starter/${s.id}`}
              className="card flex gap-4 transition-all hover:shadow-editorial active:scale-[0.99]"
            >
              {imageUrls[s.id] ? (
                <img
                  src={imageUrls[s.id]}
                  alt={s.name}
                  className="h-20 w-20 flex-shrink-0 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center bg-cream-200 text-3xl">
                  🌾
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-display-italic text-xl text-cocoa-900">{s.name}</h3>
                {s.flour_type && (
                  <p className="mini-label mt-1">{s.flour_type}</p>
                )}

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-sm">{s.status?.statusEmoji}</span>
                  <span
                    className={`text-xs ${
                      s.status?.statusColor === "danger"
                        ? "font-semibold text-terra-700"
                        : s.status?.statusColor === "warning"
                        ? "font-semibold text-gold-700"
                        : "text-cocoa-700/80"
                    }`}
                  >
                    {s.status?.statusText}
                  </span>
                </div>

                {s.in_fridge && (
                  <span className="chip mt-2">❄️ Kuehlschrank</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Link href="/starter/new" className="btn-secondary block text-center">
          + Neuer Starter
        </Link>
      </div>
    </div>
  );
}
