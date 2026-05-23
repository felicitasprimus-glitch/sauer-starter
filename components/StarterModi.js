"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MODI = [
  { key: "powerkur", emoji: "💪", label: "Powerkur", desc: "Alle 8h, Raumtemperatur", sub: "Schwachen Starter aufpaeppeln", in_fridge: false, hours: 8 },
  { key: "backbereit", emoji: "🔥", label: "Backbereit", desc: "Alle 12h, Raumtemperatur", sub: "Volle Triebkraft fuer den Backtag", in_fridge: false, hours: 12 },
  { key: "ausgeglichen", emoji: "⚖️", label: "Ausgeglichen", desc: "Alle 24h, Raumtemperatur", sub: "Der entspannte Alltag", in_fridge: false, hours: 24 },
  { key: "sparflamme", emoji: "😴", label: "Sparflamme", desc: "Kuehlschrank, alle 7 Tage", sub: "Wenig Aufwand", in_fridge: true, days: 7 },
  { key: "urlaub", emoji: "🏖️", label: "Urlaubsmodus", desc: "Kuehlschrank, alle 14 Tage", sub: "Fuer laengere Pausen", in_fridge: true, days: 14 },
];

function deriveActive(inFridge, hours, days) {
  if (inFridge) {
    if (days === 7) return "sparflamme";
    if (days === 14) return "urlaub";
    return null;
  }
  if (hours === 8) return "powerkur";
  if (hours === 12) return "backbereit";
  if (hours === 24) return "ausgeglichen";
  return null;
}

export default function StarterModi({ starterId, inFridge, feedIntervalHours, fridgeIntervalDays }) {
  const router = useRouter();
  const supabase = createClient();

  const [vals, setVals] = useState({
    inFridge: !!inFridge,
    hours: Number(feedIntervalHours) || 12,
    days: Number(fridgeIntervalDays) || 7,
  });
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setVals({
      inFridge: !!inFridge,
      hours: Number(feedIntervalHours) || 12,
      days: Number(fridgeIntervalDays) || 7,
    });
  }, [inFridge, feedIntervalHours, fridgeIntervalDays]);

  const active = deriveActive(vals.inFridge, vals.hours, vals.days);

  async function setModus(m) {
    setBusy(m.key);
    setErr("");
    const patch = m.in_fridge
      ? { in_fridge: true, fridge_interval_days: m.days }
      : { in_fridge: false, feed_interval_hours: m.hours };

    const { error } = await supabase.from("starters").update(patch).eq("id", starterId);
    if (error) {
      setErr(error.message);
      setBusy(null);
      return;
    }
    setVals((v) => ({
      inFridge: m.in_fridge,
      hours: m.in_fridge ? v.hours : m.hours,
      days: m.in_fridge ? m.days : v.days,
    }));
    setBusy(null);
    router.refresh();
  }

  return (
    <section className="mt-8">
      <p className="brand-mark">Pflege-Modus</p>
      <h2 className="font-display-italic text-display-md mt-1">Aktuelles Ziel</h2>
      <p className="mt-1 text-sm text-cocoa-700/70">
        Waehle einen Rhythmus - wir erinnern dich passend an die naechste Fuetterung.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {MODI.map((m) => {
          const isActive = active === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setModus(m)}
              disabled={busy !== null}
              className={`border p-4 text-left transition-all ${
                isActive
                  ? "border-gold-500 bg-gold-100/40"
                  : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{m.emoji}</span>
                {isActive && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-700">
                    Aktiv
                  </span>
                )}
              </div>
              <div className="mt-2 font-display-italic text-base text-cocoa-900">
                {m.label}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-mauve-700">
                {busy === m.key ? "Speichert ..." : m.desc}
              </div>
              <div className="mt-2 text-xs text-cocoa-700/65">{m.sub}</div>
            </button>
          );
        })}
      </div>

      {active === null && (
        <p className="mt-3 text-xs text-cocoa-700/65">
          Aktuell hast du einen eigenen Rhythmus:{" "}
          {vals.inFridge
            ? `Kuehlschrank, alle ${vals.days} Tage`
            : `Raumtemperatur, alle ${vals.hours}h`}
          . Du kannst ihn jederzeit unter Bearbeiten anpassen.
        </p>
      )}

      {err && (
        <div className="mt-3 border border-terra-500/40 bg-terra-400/10 px-4 py-3 text-sm text-terra-700">
          {err}
        </div>
      )}
    </section>
  );
}
