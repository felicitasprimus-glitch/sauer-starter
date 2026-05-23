"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BestenlistePage() {
  const [brote, setBrote] = useState([]);
  const [starter, setStarter] = useState([]);
  const [tab, setTab] = useState("brote");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bestenliste");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bestenliste konnte nicht geladen werden");
        setLoading(false);
        return;
      }
      setBrote(data.brote || []);
      setStarter(data.starter || []);
    } catch (err) {
      setError(err.message || "Etwas ist schiefgelaufen");
    }
    setLoading(false);
  }

  const medal = (i) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Link href="/community" className="mini-label">
          ← Zurueck zur Community
        </Link>
        <p className="brand-mark mt-3">Sauer macht krustig</p>
        <h1 className="font-display-italic text-display-lg mt-2">Bestenliste</h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa-700/80">
          Wer backt die schoenste Krume und zieht den staerksten Starter? Wer
          ein Brot teilt oder seinen Starter freigibt, ist dabei.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("brote")}
          className={`flex-1 border p-3 text-center transition-all ${
            tab === "brote"
              ? "border-gold-500 bg-gold-100/40"
              : "border-cream-300 bg-cream-50"
          }`}
        >
          <div className="font-display-italic text-base text-cocoa-900">
            Beste Brote
          </div>
          <div className="text-[10px] uppercase tracking-widest text-mauve-700">
            Krume-Score
          </div>
        </button>
        <button
          type="button"
          onClick={() => setTab("starter")}
          className={`flex-1 border p-3 text-center transition-all ${
            tab === "starter"
              ? "border-gold-500 bg-gold-100/40"
              : "border-cream-300 bg-cream-50"
          }`}
        >
          <div className="font-display-italic text-base text-cocoa-900">
            Staerkste Starter
          </div>
          <div className="text-[10px] uppercase tracking-widest text-mauve-700">
            Triebkraft
          </div>
        </button>
      </div>

      {loading ? (
        <div className="card text-center text-sm text-cocoa-700">
          Laedt Bestenliste ...
        </div>
      ) : error ? (
        <div className="border border-terra-500/40 bg-terra-400/10 px-4 py-3 text-sm text-terra-700">
          {error}
        </div>
      ) : tab === "brote" ? (
        brote.length === 0 ? (
          <div className="card text-center">
            <p className="text-4xl">🥖</p>
            <p className="mt-3 text-sm text-cocoa-700/70">
              Noch keine bewerteten Brote geteilt. Teile ein Brot mit
              Krume-Analyse, um die Liste zu eroeffnen!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {brote.map((b, i) => (
              <div
                key={b.id}
                className={`flex items-center gap-3 border p-3 ${
                  b.isOwn
                    ? "border-gold-500 bg-gold-100/40"
                    : "border-cream-300 bg-cream-50"
                }`}
              >
                <div className="w-7 flex-shrink-0 text-center font-display-italic text-lg text-cocoa-900">
                  {medal(i) || i + 1}
                </div>
                {b.fotoUrl ? (
                  <img
                    src={b.fotoUrl}
                    alt={b.name}
                    className="h-12 w-12 flex-shrink-0 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-cream-300 text-lg">
                    🍞
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-cocoa-900">
                    {b.name}
                  </div>
                  <div className="truncate text-xs text-cocoa-700/65">
                    von {b.autor}
                    {b.isOwn ? " (du)" : ""}
                  </div>
                </div>
                <div className="flex-shrink-0 text-center">
                  <div className="font-display-italic text-xl text-cocoa-900">
                    {b.krumeScore}/10
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-mauve-700">
                    Krume
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : starter.length === 0 ? (
        <div className="card text-center">
          <p className="text-4xl">🫙</p>
          <p className="mt-3 text-sm text-cocoa-700/70">
            Noch macht kein Starter mit. Aktiviere bei deinem Starter den
            Schalter An der Bestenliste teilnehmen, um die Liste zu eroeffnen!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {starter.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 border p-3 ${
                s.isOwn
                  ? "border-gold-500 bg-gold-100/40"
                  : "border-cream-300 bg-cream-50"
              }`}
            >
              <div className="w-7 flex-shrink-0 text-center font-display-italic text-lg text-cocoa-900">
                {medal(i) || i + 1}
              </div>
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-cream-300 text-lg">
                🫙
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-cocoa-900">
                  {s.name}
                </div>
                <div className="truncate text-xs text-cocoa-700/65">
                  von {s.autor}
                  {s.isOwn ? " (du)" : ""}
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className="font-display-italic text-xl text-cocoa-900">
                  {s.score}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-mauve-700">
                  Triebkraft
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
