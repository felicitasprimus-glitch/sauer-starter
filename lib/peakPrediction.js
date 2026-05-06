// Peak-Prognose für Sauerteig
// ----------------------------
// Faustregel: Bei 24°C und Verhältnis 1:5:5 (10× ASG) liegt der Peak
// nach ungefähr 6 Stunden. Mit jedem Plus an Wärme verdoppelt sich
// die Aktivität alle ~10°C (Q10-Regel). Höheres Fütterungsverhältnis
// = mehr Futter = etwas längerer Weg zum Peak.

export function predictPeakHours({ asg, flour, water, temperature }) {
  if (!asg || asg <= 0) return null;
  if (!flour && !water) return null;

  const ratio = (Number(flour) + Number(water)) / Number(asg);
  if (ratio <= 0) return null;

  const baseHours = 6;
  const baseRatioSum = 10; // 1:5:5
  const baseTemp = 24;

  const temp = Number(temperature) || baseTemp;

  // Q10-Regel: Aktivität verdoppelt sich pro 10°C wärmer
  const tempFactor = Math.pow(2, (baseTemp - temp) / 10);

  // Ratio-Faktor: log-skaliert, damit 1:1:1 schneller ist als 1:10:10
  const ratioFactor = Math.log(ratio + 1) / Math.log(baseRatioSum + 1);

  const hours = baseHours * tempFactor * ratioFactor;

  // Sinnvolle Grenzen
  return Math.max(1.5, Math.min(48, hours));
}

export function formatHours(hours) {
  if (hours == null) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} Min.`;
  if (m === 0) return `${h} Std.`;
  return `${h} Std. ${m} Min.`;
}

export function predictPeakTime({ asg, flour, water, temperature, fedAt }) {
  const hours = predictPeakHours({ asg, flour, water, temperature });
  if (hours == null) return null;
  const start = fedAt ? new Date(fedAt) : new Date();
  return new Date(start.getTime() + hours * 60 * 60 * 1000);
}

export const STATE_LABELS = {
  aktiv: "Aktiv",
  am_peak: "Am Peak",
  ueberreif: "Überreif",
  schwach: "Schwach",
  hooch: "Hooch oben",
};

export const STATE_COLORS = {
  aktiv: "bg-honey-400/20 text-honey-600 border-honey-400/40",
  am_peak: "bg-terra-500/20 text-terra-700 border-terra-500/40",
  ueberreif: "bg-mauve-500/20 text-mauve-700 border-mauve-500/40",
  schwach: "bg-cocoa-700/10 text-cocoa-700 border-cocoa-700/30",
  hooch: "bg-mauve-700/15 text-mauve-700 border-mauve-700/30",
};
