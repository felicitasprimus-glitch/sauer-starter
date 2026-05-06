# 📊 Update 1 — Statistik & Triebkraft

Dieses Update fügt deinem Starter-Tracker hinzu:

- **Triebkraft-Score** (0–100) als Kachel auf der Detail-Seite
- **Eigene Statistik-Seite** pro Starter mit:
  - Linien-Diagramm der Fütterungen pro Tag (7/14/30 Tage)
  - Streak (Tage in Folge mit Fütterung) 🔥
  - Ø Abstand zwischen Fütterungen
  - Ø Temperatur
  - Lieblings-Verhältnis
  - Peak-Quote
  - „Letzte Fütterung war vor X Stunden"-Hinweis

**Keine Datenbank-Änderung nötig** — alles wird aus den vorhandenen Fütterungs-Daten berechnet. ✨

---

## 🔧 So baust du das Update ein

Du kopierst einfach die neuen Dateien in dein bestehendes Projekt. **Vorhandene Dateien werden überschrieben** — das ist gewollt (eine ist betroffen).

### Schritt 1 — Sicherheitskopie

Sicherheitshalber dein bestehendes Projekt einmal kopieren:
- Im Finder: Ordner `sauer-starter` rechtsklick → **Duplizieren**
- Falls was schiefgeht, hast du das Original noch.

### Schritt 2 — Dateien hineinkopieren

Im **Update-Paket** liegt die gleiche Ordner-Struktur wie in deinem Projekt. Einfach **alle Dateien** aus dem Update-Ordner in dein Projekt kopieren — gleiche Pfade.

**Konkret kopierst du:**

| Aus dem Update-Paket | In dein Projekt |
|---|---|
| `lib/starterStats.js` | `lib/starterStats.js` *(neu)* |
| `components/FeedingChart.js` | `components/FeedingChart.js` *(neu)* |
| `components/TriebkraftScore.js` | `components/TriebkraftScore.js` *(neu)* |
| `components/StatsPanel.js` | `components/StatsPanel.js` *(neu)* |
| `app/(app)/starter/[id]/stats/page.js` | `app/(app)/starter/[id]/stats/page.js` *(neu, Ordner muss angelegt werden)* |
| `app/(app)/starter/[id]/page.js` | `app/(app)/starter/[id]/page.js` *(überschreiben!)* |

> 💡 Am einfachsten: Im Finder beide Ordner nebeneinander öffnen und die Update-Dateien rüberziehen. Wenn der Mac fragt „Ersetzen?" → **Ja, ersetzen**.

### Schritt 3 — App neu starten

1. Im Terminal mit `Ctrl + C` die App stoppen
2. `npm run dev` zum Neustarten
3. Im Browser **Cmd + R** (neu laden)

### Schritt 4 — Anschauen

1. In der App auf einen Starter mit Fütterungen tippen
2. Du siehst jetzt eine **goldene Kachel** mit dem Triebkraft-Score
3. Klick darauf → ganze Statistik-Seite

> ⚠️ Für aussagekräftige Statistik brauchst du **mindestens 3–5 Fütterungen**. Vorher zeigt die Seite einen Hinweis.

---

## 🧮 Wie wird der Triebkraft-Score berechnet?

Ein gewichteter Mix aus drei Faktoren:

1. **Peak-Quote (40%)** — Anteil der Fütterungen, die als „aktiv" oder „am Peak" markiert sind
2. **Regelmäßigkeit (30%)** — wie konstant der Abstand zwischen Fütterungen ist (niedrige Streuung)
3. **Datenmenge (30%)** — bis 10 Fütterungen wird das stärker, danach maximal

Score-Stufen:
- **80–100** 🔥 Spitzentriebkraft
- **60–79** 💪 Stark & gesund
- **40–59** 🌾 Im guten Schwung
- **20–39** 🌱 Braucht etwas Liebe
- **0–19** 🫙 Frischer Start

---

## ❓ Falls etwas nicht klappt

**„Module not found: starterStats"**
→ Datei nicht im richtigen Ordner. `lib/starterStats.js` muss direkt neben `lib/peakPrediction.js` liegen.

**Statistik-Seite zeigt 404**
→ Der Ordner `app/(app)/starter/[id]/stats/` muss existieren, mit `page.js` darin.

**Diagramm wird nicht angezeigt**
→ Mindestens eine Fütterung in den letzten 14 Tagen nötig.

---

Viel Spaß mit den neuen Einsichten in deine Starter! 📈🥖
