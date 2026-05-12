// Helper fuer Fuetterungs-Erinnerungen

/**
 * Berechnet den Status eines Starters basierend auf letzter Fuetterung
 * @param {Object} starter - Starter-Objekt aus DB
 * @param {Array} feedings - Liste der Fuetterungen (neueste zuerst)
 * @returns {Object} Status-Informationen
 */
export function getStarterFeedingStatus(starter, feedings = []) {
  if (!starter) return null;

  const inFridge = starter.in_fridge === true;
  const intervalHours = inFridge
    ? (starter.fridge_interval_days || 7) * 24
    : (starter.feed_interval_hours || 12);

  const lastFeeding = feedings && feedings.length > 0 ? feedings[0] : null;

  if (!lastFeeding) {
    return {
      hasNeverBeenFed: true,
      hoursSinceLastFeeding: null,
      hoursUntilFeed: null,
      isDue: false,
      isOverdue: false,
      isComingUp: false,
      inFridge,
      intervalHours,
      statusText: "Noch nie gefuettert",
      statusEmoji: "🆕",
      statusColor: "neutral",
    };
  }

  const lastFedAt = new Date(lastFeeding.created_at);
  const now = new Date();
  const hoursSince = (now - lastFedAt) / (1000 * 60 * 60);
  const hoursUntilFeed = intervalHours - hoursSince;

  // Status bestimmen
  let isDue = false;
  let isOverdue = false;
  let isComingUp = false;
  let statusText = "";
  let statusEmoji = "🌾";
  let statusColor = "neutral";

  if (hoursUntilFeed <= 0) {
    // Bereits faellig oder ueberfaellig
    if (Math.abs(hoursUntilFeed) >= intervalHours) {
      // Doppelt ueberfaellig
      isOverdue = true;
      statusText = "Dringend fuettern!";
      statusEmoji = "🚨";
      statusColor = "danger";
    } else {
      isDue = true;
      statusText = "Fuetterung faellig";
      statusEmoji = "⏰";
      statusColor = "warning";
    }
  } else if (hoursUntilFeed <= 2) {
    // Bald faellig (innerhalb 2h)
    isComingUp = true;
    statusText = `Bald fuettern (in ${Math.round(hoursUntilFeed)}h)`;
    statusEmoji = "⏳";
    statusColor = "soon";
  } else {
    // Alles okay
    if (inFridge) {
      const daysUntil = Math.floor(hoursUntilFeed / 24);
      statusText = `Im Kuehlschrank · noch ${daysUntil} Tage`;
    } else {
      statusText = `Naechste Fuetterung in ${Math.round(hoursUntilFeed)}h`;
    }
    statusEmoji = inFridge ? "❄️" : "✨";
    statusColor = "okay";
  }

  return {
    hasNeverBeenFed: false,
    hoursSinceLastFeeding: hoursSince,
    hoursUntilFeed,
    isDue,
    isOverdue,
    isComingUp,
    needsAttention: isDue || isOverdue,
    inFridge,
    intervalHours,
    statusText,
    statusEmoji,
    statusColor,
  };
}

/**
 * Formatiert "vor X Stunden/Tagen" als deutscher String
 */
export function formatTimeAgo(hours) {
  if (hours == null) return "";
  if (hours < 1) return "vor wenigen Minuten";
  if (hours < 24) {
    const h = Math.round(hours);
    return `vor ${h} ${h === 1 ? "Stunde" : "Stunden"}`;
  }
  const days = Math.floor(hours / 24);
  return `vor ${days} ${days === 1 ? "Tag" : "Tagen"}`;
}
