"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MODI = [
  { key: "powerkur", emoji: "💪", label: "Powerkur", desc: "Alle 8h, Raumtemperatur", sub: "Schwachen Starter aufpaeppeln", in_fridge: false, hours: 8, ratio: "1:2:3" },
  { key: "backbereit", emoji: "🔥", label: "Backbereit", desc: "Alle 12h, Raumtemperatur", sub: "Volle Triebkraft fuer den Backtag", in_fridge: false, hours: 12, ratio: "1:2:2" },
  { key: "ausgeglichen", emoji: "⚖️", label: "Ausgeglichen", desc: "Alle 24h, Raumtemperatur", sub: "Der entspannte Alltag", in_fridge: false, hours: 24, ratio: "1:3:3" },
  { key: "sparflamme", emoji: "😴", label: "Sparflamme", desc: "Kuehlschrank, alle 7 Tage", sub: "Wenig Aufwand", in_fridge: true, days: 7, ratio: "1:5:5" },
  { key: "urlaub", emoji: "🏖️", label: "Urlaubsmodus", desc: "Kuehlschrank, alle 14 Tage", sub: "Fuer laengere Pausen", in_fridge: true, days: 14, ratio: "1:10:10" },
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

export default function StarterModi({ starterId, inFridge, feedIntervalHours, fridgeIntervalDays, shareInRanking }) {
  const router = useRouter();
  const supabase = createClient();

  const [vals, setVals] = useState({
    inFridge: !!inFridge,
    hours: Number(feedIntervalHours) || 12,
    days: Number(fridgeIntervalDays) || 7,
  });
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState("");
  const [opt, setOpt] = useState(!!shareInRanking);
  const [optBusy, setOptBusy] = useState(false);

  useEffect(() => {
    setVals({
      inFridge: !!inFridge,
      hours: Number(feedIntervalHours) || 12,
      days: Number(fridgeIntervalDays) || 7,
    });
  }, [inFridge, feedIntervalHours, fridgeIntervalDays]);

  useEffect(() => {
    setOpt(!!shareInRanking);
  }, [shareInRanking]);

  async function toggleRanking() {
    const next = !opt;
    setOpt(next);
    setOptBusy(true);
    setErr("");
    const { error } = await supabase
      .from("starters")
      .update({ share_in_ranking: next })
      .eq("id", starterId);
    setOptBusy(false);
    if (error) {
      setOpt(!next);
      setErr(error.message);
      return;
    }
    router.refresh();
  }

  const active = deriveActive(vals.inFridge, vals.hours, vals.days);

  async function setModus(m) {
    setBusy(m.key);
    setErr("");
    const patch = m.in_fridge
      ? { in_fridge: true, fridge_interval_days: m.days, default_ratio: m.ratio }
      : { in_fridge: false, feed_interval_hours: m.hours, default_ratio: m.ratio };

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
              <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold-700">
                Futter {m.ratio}
              </div>
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

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-cream-300 pt-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-cocoa-900">
            An der Bestenliste teilnehmen
          </p>
          <p className="mt-0.5 text-xs text-cocoa-700/65">
            Zeigt diesen Starter mit Triebkraft-Score in der Community-Rangliste.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleRanking}
          disabled={optBusy}
          aria-pressed={opt}
          className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
            opt ? "bg-gold-500" : "bg-cream-300"
          }`}
        >
          <span
            className="absolute top-0.5 h-6 w-6 rounded-full bg-white"
            style={{
              left: opt ? "22px" : "2px",
              transition: "left .2s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,.2)",
            }}
          />
        </button>
      </div>

      {err && (
        <div className="mt-3 border border-terra-500/40 bg-terra-400/10 px-4 py-3 text-sm text-terra-700">
          {err}
        </div>
      )}
    </section>
  );
}
