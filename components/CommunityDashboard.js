"use client";

import { useMemo } from "react";

export default function CommunityDashboard({ posts }) {
  const data = useMemo(() => {
    if (!posts || posts.length === 0) return null;

    const broteCount = posts.length;
    const baecker = new Set(posts.map((p) => p.autor)).size;
    const herzchen = posts.reduce((s, p) => s + (p.likeCount || 0), 0);

    // Top-Baeckerinnen: pro Autorin Schnitt-Krume-Score + Anzahl Brote
    const byAutor = {};
    posts.forEach((p) => {
      if (!byAutor[p.autor]) {
        byAutor[p.autor] = { autor: p.autor, scores: [], count: 0 };
      }
      byAutor[p.autor].count += 1;
      if (p.krumeScore != null) byAutor[p.autor].scores.push(p.krumeScore);
    });
    const topBaecker = Object.values(byAutor)
      .map((b) => ({
        autor: b.autor,
        count: b.count,
        avg: b.scores.length
          ? Math.round(
              (b.scores.reduce((a, c) => a + c, 0) / b.scores.length) * 10
            ) / 10
          : null,
      }))
      .filter((b) => b.avg != null)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);

    // Spitzen-Brot: hoechster Krume-Score
    const highlight =
      posts
        .filter((p) => p.krumeScore != null)
        .sort((a, b) => b.krumeScore - a.krumeScore)[0] || null;

    // Geteilte Rezepte
    const rezepte = posts
      .filter((p) => p.rezept)
      .map((p) => ({ id: p.id, name: p.name, autor: p.autor }));

    return { broteCount, baecker, herzchen, topBaecker, highlight, rezepte };
  }, [posts]);

  if (!data) return null;

  const medal = (i) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null);

  return (
    <div className="space-y-4">
      {/* Live-Zahlen */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <div className="font-display-italic text-3xl text-cocoa-900">
            {data.broteCount}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-mauve-700">
            Brote
          </div>
        </div>
        <div className="card text-center">
          <div className="font-display-italic text-3xl text-cocoa-900">
            {data.baecker}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-mauve-700">
            Baeckerinnen
          </div>
        </div>
        <div className="card text-center">
          <div className="font-display-italic text-3xl text-cocoa-900">
            {data.herzchen}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-mauve-700">
            Herzchen
          </div>
        </div>
      </div>

      {/* Spitzen-Brot */}
      {data.highlight && (
        <div className="card overflow-hidden">
          <p className="brand-mark">Aktuelles Spitzen-Brot</p>
          {data.highlight.fotoUrl && (
            <div className="-mx-6 mt-3">
              <img
                src={data.highlight.fotoUrl}
                alt={data.highlight.name}
                className="h-44 w-full object-cover"
              />
            </div>
          )}
          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display-italic text-xl text-cocoa-900">
                {data.highlight.name}
              </h3>
              <p className="mini-label mt-0.5">von {data.highlight.autor}</p>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="font-display-italic text-2xl text-cocoa-900">
                {data.highlight.krumeScore}/10
              </div>
              <div className="text-[9px] uppercase tracking-widest text-mauve-700">
                Krume
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top-Baeckerinnen */}
      {data.topBaecker.length > 0 && (
        <div className="card">
          <p className="brand-mark">Top-Baeckerinnen</p>
          <div className="mt-3 space-y-2">
            {data.topBaecker.map((b, i) => (
              <div key={b.autor} className="flex items-center gap-3">
                <div className="w-6 flex-shrink-0 text-center font-display-italic text-base text-cocoa-900">
                  {medal(i) || i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-cocoa-900">
                    {b.autor}
                  </div>
                  <div className="text-[10px] text-cocoa-700/65">
                    {b.count} {b.count === 1 ? "Brot" : "Brote"}
                  </div>
                </div>
                <div className="flex-shrink-0 text-center">
                  <div className="font-display-italic text-base text-cocoa-900">
                    {b.avg}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-mauve-700">
                    Schnitt
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community-Rezepte */}
      {data.rezepte.length > 0 && (
        <div className="card">
          <p className="brand-mark">Community-Rezepte</p>
          <p className="mt-1 text-xs text-cocoa-700/65">
            {data.rezepte.length}{" "}
            {data.rezepte.length === 1 ? "Rezept geteilt" : "Rezepte geteilt"}
          </p>
          <div className="mt-3 space-y-1.5">
            {data.rezepte.slice(0, 4).map((r) => (
              <div key={r.id} className="text-sm text-cocoa-800">
                <span className="font-semibold">{r.name}</span>
                <span className="text-cocoa-700/60"> von {r.autor}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-cocoa-700/60">
            Tipp: Im Feed unten kannst du jedes Rezept aufklappen.
          </p>
        </div>
      )}
    </div>
  );
}
