"use client";

import { STATE_COLORS } from "@/lib/peakPrediction";

// State → Farbe für die Punkte im Chart
const stateDotColor = {
  aktiv: "#D4A04C",
  am_peak: "#C97B5B",
  ueberreif: "#9D6B7E",
  schwach: "#5C4232",
  hooch: "#5E3D4D",
};

export default function FeedingChart({ data }) {
  if (!data || data.length === 0) return null;

  const width = 320;
  const height = 180;
  const paddingLeft = 28;
  const paddingRight = 12;
  const paddingTop = 16;
  const paddingBottom = 28;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const maxCount = Math.max(1, ...data.map((d) => d.count));
  const stepX = chartW / Math.max(1, data.length - 1);

  // Punkte für Linie
  const points = data.map((d, i) => ({
    x: paddingLeft + i * stepX,
    y: paddingTop + chartH - (d.count / maxCount) * chartH,
    ...d,
  }));

  // Smoothed Line (kubische Bezier)
  function buildPath() {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const cpx = (prev.x + cur.x) / 2;
      path += ` Q ${cpx} ${prev.y}, ${(prev.x + cur.x) / 2} ${(prev.y + cur.y) / 2}`;
      path += ` T ${cur.x} ${cur.y}`;
    }
    return path;
  }

  // Bereich unter der Linie
  function buildAreaPath() {
    const linePath = buildPath();
    if (!linePath) return "";
    const baseY = paddingTop + chartH;
    return `${linePath} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;
  }

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C97B5B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C97B5B" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid-Linien horizontal */}
        {[0, 0.5, 1].map((p) => (
          <line
            key={p}
            x1={paddingLeft}
            x2={width - paddingRight}
            y1={paddingTop + chartH * p}
            y2={paddingTop + chartH * p}
            stroke="#9D6B7E"
            strokeOpacity="0.12"
            strokeDasharray="2 3"
          />
        ))}

        {/* Y-Achsen-Beschriftung */}
        <text
          x={paddingLeft - 6}
          y={paddingTop + 4}
          textAnchor="end"
          fontSize="9"
          fill="#5C4232"
          opacity="0.6"
          fontFamily="system-ui, sans-serif"
        >
          {maxCount}
        </text>
        <text
          x={paddingLeft - 6}
          y={paddingTop + chartH + 3}
          textAnchor="end"
          fontSize="9"
          fill="#5C4232"
          opacity="0.6"
          fontFamily="system-ui, sans-serif"
        >
          0
        </text>

        {/* Bereichsfüllung */}
        <path d={buildAreaPath()} fill="url(#areaGrad)" />

        {/* Linie */}
        <path
          d={buildPath()}
          fill="none"
          stroke="#C97B5B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Datenpunkte */}
        {points.map((p, i) => (
          <g key={i}>
            {p.count > 0 && (
              <>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill={stateDotColor[p.dominantState] ?? "#C97B5B"}
                  stroke="#FAF6F0"
                  strokeWidth="1.5"
                />
              </>
            )}
            {/* X-Achsen-Labels — nur jeden 2. anzeigen wenn viele */}
            {(data.length <= 7 || i % 2 === 0 || i === data.length - 1) && (
              <text
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                fontSize="9"
                fill="#5C4232"
                opacity="0.65"
                fontFamily="system-ui, sans-serif"
              >
                {p.shortLabel}
              </text>
            )}
            {(data.length <= 7 || i % 2 === 0 || i === data.length - 1) && (
              <text
                x={p.x}
                y={height - 2}
                textAnchor="middle"
                fontSize="8"
                fill="#5C4232"
                opacity="0.45"
                fontFamily="system-ui, sans-serif"
              >
                {p.label.slice(0, 5)}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Legende */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-cocoa-700/70">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#D4A04C" }} />
          Aktiv
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#C97B5B" }} />
          Peak
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#9D6B7E" }} />
          Überreif
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#5C4232" }} />
          Schwach
        </span>
      </div>
    </div>
  );
}
