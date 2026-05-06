"use client";

import { useState, useMemo } from "react";
import { calculateStats, buildChartData, formatGap } from "@/lib/starterStats";
import { STATE_LABELS } from "@/lib/peakPrediction";
import FeedingChart from "./FeedingChart";
import TriebkraftScore from "./TriebkraftScore";

export default function StatsPanel({ feedings }) {
  const [range, setRange] = useState(14); // Tage

  const stats = useMemo(() => calculateStats(feedings), [feedings]);
  const chartData = useMemo(
    () => buildChartData(feedings, range),
    [feedings, range]
  );

  if (!feedings || feedings.length === 0) {
    return (
      <div className="card text-center">
        <div className="mb-2 text-3xl">📊</div>
        <p className="font-display text-cocoa-900">Noch keine Statistik</p>
        <p className="mt-1 text-sm text-cocoa-700/65">
          Trag ein paar Fütterungen ein, dann zeige ich dir die Triebkraft
          deines Starters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TriebkraftScore score={stats.triebkraftScore} />

      {/* Diagramm */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-cocoa-900">
              Verlauf
            </h3>
            <p className="text-xs text-cocoa-700/60">
              Fütterungen pro Tag
            </p>
          </div>
          <div className="flex gap-1 rounded-full border border-mauve-500/20 bg-cream-50 p-1">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  range === d
                    ? "bg-terra-500 text-cream-50"
                    : "text-cocoa-700/70 hover:text-cocoa-900"
                }`}
              >
                {d}T
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <FeedingChart data={chartData} />
        </div>
      </div>

      {/* Kennzahlen-Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile
          icon="🍽️"
          label="Fütterungen"
          value={stats.totalFeedings}
          sub="insgesamt"
        />
        <StatTile
          icon="🔥"
          label="Streak"
          value={`${stats.streak} ${stats.streak === 1 ? "Tag" : "Tage"}`}
          sub="in Folge"
          highlight={stats.streak >= 3}
        />
        <StatTile
          icon="⏱️"
          label="Ø Abstand"
          value={formatGap(stats.avgGapHours)}
          sub="zwischen Fütterungen"
        />
        <StatTile
          icon="🌡️"
          label="Ø Temperatur"
          value={
            stats.avgTemperature != null
              ? `${stats.avgTemperature.toFixed(1)}°C`
              : "—"
          }
          sub="bei der Fütterung"
        />
        <StatTile
          icon="⚖️"
          label="Lieblings-Verhältnis"
          value={stats.mostUsedRatio ?? "—"}
          sub="meistgenutzt"
        />
        <StatTile
          icon="🎯"
          label="Peak-Quote"
          value={`${Math.round(stats.peakRate * 100)}%`}
          sub="aktiv oder am Peak"
        />
      </div>

      {/* Letzte Fütterung */}
      {stats.lastFeedingHoursAgo != null && (
        <div
          className={`card ${
            stats.lastFeedingHoursAgo > 24
              ? "border-terra-500/30 bg-terra-500/5"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {stats.lastFeedingHoursAgo > 24
                ? "👀"
                : stats.lastFeedingHoursAgo > 12
                ? "⏳"
                : "✨"}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-mauve-700">
                Letzte Fütterung
              </div>
              <div className="font-display text-base text-cocoa-900">
                vor {formatGap(stats.lastFeedingHoursAgo)}
              </div>
              {stats.lastFeedingHoursAgo > 24 && (
                <p className="mt-0.5 text-xs text-terra-700">
                  Vielleicht ist es Zeit für eine Auffrischung?
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatTile({ icon, label, value, sub, highlight }) {
  return (
    <div
      className={`rounded-2xl border p-3 shadow-soft ${
        highlight
          ? "border-honey-400/40 bg-gradient-to-br from-honey-400/15 to-terra-500/10"
          : "border-mauve-500/15 bg-cream-50"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-mauve-700">
          {label}
        </span>
      </div>
      <div className="mt-1.5 font-display text-xl font-semibold text-cocoa-900 leading-tight">
        {value}
      </div>
      <div className="text-[11px] text-cocoa-700/60">{sub}</div>
    </div>
  );
}
