"use client";

import {
  predictPeakHours,
  predictPeakTime,
  formatHours,
} from "@/lib/peakPrediction";

export default function PeakPrognose({ asg, flour, water, temperature, fedAt }) {
  const hours = predictPeakHours({ asg, flour, water, temperature });
  const peakTime = predictPeakTime({ asg, flour, water, temperature, fedAt });

  if (hours == null) {
    return (
      <div className="rounded-2xl border border-mauve-500/15 bg-cream-200/40 px-4 py-3 text-sm text-cocoa-700/70">
        Trag ASG, Mehl & Wasser ein, dann schätze ich den Peak.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-honey-400/30 bg-gradient-to-br from-honey-400/10 to-terra-500/10 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-2xl animate-bubble">⏳</div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold text-cocoa-800">
            Peak-Prognose
          </div>
          <div className="mt-0.5 text-base font-bold text-terra-700">
            in ca. {formatHours(hours)}
          </div>
          {peakTime && (
            <div className="text-xs text-cocoa-700/70">
              voraussichtlich gegen{" "}
              {peakTime.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              Uhr
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
