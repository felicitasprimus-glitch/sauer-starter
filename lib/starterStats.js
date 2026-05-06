// lib/starterStats.js
// Berechnet Statistiken aus dem Fütterungsverlauf eines Starters

export function calculateStats(feedings) {
  if (!feedings || feedings.length === 0) {
    return {
      totalFeedings: 0,
      avgGapHours: null,
      avgTemperature: null,
      mostUsedRatio: null,
      mostUsedState: null,
      peakRate: 0,
      triebkraftScore: 0,
      lastFeedingHoursAgo: null,
      streak: 0,
    };
  }

  // Sortiert: neueste zuerst (sollte schon der Fall sein)
  const sorted = [...feedings].sort(
    (a, b) => new Date(b.fed_at) - new Date(a.fed_at)
  );

  // 1. Lücken zwischen Fütterungen (in Stunden)
  const gaps = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const diff =
      (new Date(sorted[i].fed_at) - new Date(sorted[i + 1].fed_at)) /
      (1000 * 60 * 60);
    if (diff > 0 && diff < 24 * 14) gaps.push(diff); // max 14 Tage
  }
  const avgGapHours =
    gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;

  // 2. Durchschnittstemperatur
  const temps = sorted
    .map((f) => f.temperature)
    .filter((t) => t != null);
  const avgTemperature =
    temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : null;

  // 3. Häufigstes Verhältnis (gerundet auf 1:X:X)
  const ratios = sorted.map((f) => {
    const asg = Number(f.asg_g);
    const flour = Number(f.flour_g);
    const water = Number(f.water_g);
    if (asg <= 0) return null;
    return `1:${Math.round(flour / asg)}:${Math.round(water / asg)}`;
  }).filter(Boolean);
  const ratioCounts = {};
  ratios.forEach((r) => (ratioCounts[r] = (ratioCounts[r] || 0) + 1));
  const mostUsedRatio = Object.keys(ratioCounts).length
    ? Object.entries(ratioCounts).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  // 4. Häufigster Zustand
  const stateCounts = {};
  sorted.forEach((f) => {
    if (f.state) stateCounts[f.state] = (stateCounts[f.state] || 0) + 1;
  });
  const mostUsedState = Object.keys(stateCounts).length
    ? Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  // 5. Peak-Rate (wie oft wurde "am Peak" oder "aktiv" eingetragen)
  const peakStates = sorted.filter((f) =>
    ["am_peak", "aktiv"].includes(f.state)
  ).length;
  const peakRate = sorted.length > 0 ? peakStates / sorted.length : 0;

  // 6. Stunden seit letzter Fütterung
  const lastFeedingHoursAgo =
    sorted.length > 0
      ? (Date.now() - new Date(sorted[0].fed_at).getTime()) / (1000 * 60 * 60)
      : null;

  // 7. Streak (Tage in Folge mit mindestens einer Fütterung, von heute zurück)
  const streak = calculateStreak(sorted);

  // 8. Triebkraft-Score (0–100)
  // Setzt sich aus mehreren Faktoren zusammen:
  // - Peak-Rate (40%)
  // - Regelmäßigkeit (30%) — niedrige Standardabweichung bei Lücken
  // - Datenmenge (30%) — mehr Fütterungen = stabilere Bewertung
  let triebkraftScore = 0;
  triebkraftScore += peakRate * 40;
  if (gaps.length >= 3) {
    const mean = avgGapHours;
    const variance =
      gaps.reduce((s, g) => s + Math.pow(g - mean, 2), 0) / gaps.length;
    const stdDev = Math.sqrt(variance);
    // Je geringer Streuung, desto besser. Ab stdDev > 24h: 0 Punkte
    const consistency = Math.max(0, 1 - stdDev / 24);
    triebkraftScore += consistency * 30;
  }
  triebkraftScore += Math.min(sorted.length / 10, 1) * 30;
  triebkraftScore = Math.round(triebkraftScore);

  return {
    totalFeedings: sorted.length,
    avgGapHours,
    avgTemperature,
    mostUsedRatio,
    mostUsedState,
    peakRate,
    triebkraftScore,
    lastFeedingHoursAgo,
    streak,
  };
}

function calculateStreak(sortedFeedings) {
  if (sortedFeedings.length === 0) return 0;

  const dayKey = (d) => {
    const x = new Date(d);
    return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
  };

  const days = new Set(sortedFeedings.map((f) => dayKey(f.fed_at)));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const checkDay = new Date(today);
    checkDay.setDate(today.getDate() - i);
    if (days.has(dayKey(checkDay))) {
      streak++;
    } else {
      // Heute darf fehlen, danach reißt's ab
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

// Daten für das Diagramm aufbereiten
// Gibt einen Verlauf pro Tag mit Anzahl der Fütterungen + Ø Temperatur
export function buildChartData(feedings, days = 14) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    buckets.push({
      date: d,
      label: d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
      }),
      shortLabel: d.toLocaleDateString("de-DE", { weekday: "short" }).slice(0, 2),
      count: 0,
      temps: [],
      states: [],
    });
  }

  feedings.forEach((f) => {
    const fed = new Date(f.fed_at);
    const bucket = buckets.find((b) => {
      const next = new Date(b.date);
      next.setDate(b.date.getDate() + 1);
      return fed >= b.date && fed < next;
    });
    if (bucket) {
      bucket.count++;
      if (f.temperature != null) bucket.temps.push(Number(f.temperature));
      if (f.state) bucket.states.push(f.state);
    }
  });

  return buckets.map((b) => ({
    label: b.label,
    shortLabel: b.shortLabel,
    count: b.count,
    avgTemp:
      b.temps.length > 0
        ? b.temps.reduce((a, b) => a + b, 0) / b.temps.length
        : null,
    dominantState:
      b.states.length > 0
        ? b.states.reduce((acc, s) => {
            acc[s] = (acc[s] || 0) + 1;
            return acc;
          }, {}) && Object.entries(b.states.reduce((acc, s) => {
            acc[s] = (acc[s] || 0) + 1;
            return acc;
          }, {})).sort((a, b) => b[1] - a[1])[0][0]
        : null,
  }));
}

export function scoreLabel(score) {
  if (score >= 80) return { label: "Spitzentriebkraft", emoji: "🔥", color: "terra" };
  if (score >= 60) return { label: "Stark & gesund", emoji: "💪", color: "honey" };
  if (score >= 40) return { label: "Im guten Schwung", emoji: "🌾", color: "honey" };
  if (score >= 20) return { label: "Braucht etwas Liebe", emoji: "🌱", color: "mauve" };
  return { label: "Frischer Start", emoji: "🫙", color: "mauve" };
}

export function formatGap(hours) {
  if (hours == null) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} Min.`;
  if (hours < 24) return `${hours.toFixed(1)} Std.`;
  return `${(hours / 24).toFixed(1)} Tage`;
}
