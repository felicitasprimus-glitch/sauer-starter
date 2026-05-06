"use client";

import { scoreLabel } from "@/lib/starterStats";

export default function TriebkraftScore({ score }) {
  const { label, emoji } = scoreLabel(score);

  // Kreis-Fortschritt
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="card flex items-center gap-4">
      <div className="relative shrink-0">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle
            cx="44"
            cy="44"
            r={radius}
            stroke="#9D6B7E"
            strokeOpacity="0.15"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            stroke="#C97B5B"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 44 44)"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
          <text
            x="44"
            y="42"
            textAnchor="middle"
            fontSize="22"
            fontWeight="600"
            fill="#3D2A20"
            fontFamily="serif"
          >
            {score}
          </text>
          <text
            x="44"
            y="56"
            textAnchor="middle"
            fontSize="9"
            fill="#5C4232"
            opacity="0.55"
            fontFamily="system-ui, sans-serif"
            letterSpacing="1"
          >
            VON 100
          </text>
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-mauve-700">
          Triebkraft
        </div>
        <div className="mt-0.5 font-display text-xl font-semibold text-cocoa-900 leading-tight">
          {emoji} {label}
        </div>
        <p className="mt-1 text-xs text-cocoa-700/65">
          Setzt sich aus Peak-Quote, Regelmäßigkeit und Datenmenge zusammen.
        </p>
      </div>
    </div>
  );
}
