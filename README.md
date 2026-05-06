# 🫙 Sauer macht Krustig — Starter Tagebuch

MVP-App zum Führen deines Sauerteig-Starters.
Jeder User sieht nur seine eigenen Daten (Row Level Security).

**Stack:** Next.js 14 (App Router) · Supabase (Auth + Postgres + RLS) · Tailwind CSS

---

## 📋 Funktionen

- ✅ Landing-Page & Login/Registrierung
- ✅ Dashboard „Meine Starter"
- ✅ Starter anlegen, bearbeiten, löschen
- ✅ Fütterung eintragen (ASG, Mehl, Wasser, Temperatur, Zustand, Notiz)
- ✅ Verlauf pro Starter
- ✅ Peak-Prognose (Q10-Regel + Verhältnis)
- ✅ SOS-Bereich
- ✅ Mobile Bottom-Navigation
- ✅ Daten pro User getrennt

---

## 🚀 Schritt-für-Schritt Setup (für Anfänger)

### Schritt 1 — Voraussetzungen installieren

Du brauchst auf deinem Rechner:
- **Node.js** (Version 18 oder höher) — herunterladen: https://nodejs.org
- Ein **Code-Editor** wie VS Code (https://code.visualstudio.com)

Prüfen, ob Node läuft:
```bash
node --version
# Sollte v18.x oder höher zeigen
```

### Schritt 2 — Projekt vorbereiten

1. Den ganzen Projekt-Ordner an einen festen Ort kopieren, z. B. `Dokumente/sauer-starter`
2. Terminal/Eingabeaufforderung im Projekt-Ordner öffnen
3. Pakete installieren:
```bash
npm install
```
Das dauert 1–2 Minuten.

### Schritt 3 — Supabase-Projekt erstellen

1. Auf https://supabase.com gehen → **Sign in** mit GitHub oder E-Mail
2. **New Project** klicken
3. Ausfüllen:
   - **Name:** `sauer-starter` (oder beliebig)
   - **Database Password:** sicheres Passwort merken!
   - **Region:** `Frankfurt (eu-central-1)` (am nächsten an Deutschland)
4. **Create new project** — dauert ca. 2 Minuten

### Schritt 4 — Datenbank-Tabellen anlegen

1. In deinem Supabase-Projekt links auf das **SQL Editor** Symbol klicken (sieht aus wie `</>`)
2. **+ New query** klicken
3. Inhalt von `supabase/schema.sql` aus diesem Projekt **komplett** hineinkopieren
4. Unten rechts auf **Run** klicken (oder `Cmd/Ctrl + Enter`)
5. Es sollte erscheinen: „Success. No rows returned"

Damit sind beide Tabellen (`starters`, `feedings`) angelegt — inklusive Row-Level-Security.

### Schritt 5 — Supabase URL & Key holen

1. In Supabase links auf das **Settings**-Zahnrad klicken
2. → **API**
3. Du siehst zwei wichtige Werte:
   - **Project URL** — sieht aus wie `https://xyzabc123.supabase.co`
   - **Project API Keys** → **anon public** — ein langer Schlüssel
4. Beide kopieren

### Schritt 6 — Schlüssel ins Projekt eintragen

1. Im Projekt-Ordner die Datei `.env.local.example` **kopieren** und in `.env.local` umbenennen
2. Mit dem Editor öffnen
3. Werte einsetzen:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...DEIN-LANGER-KEY
```
4. **Speichern**.

> ⚠️ Die Datei `.env.local` ist in `.gitignore` — sie kommt **nicht** in dein Repository.

### Schritt 7 — E-Mail-Bestätigung (optional, aber für den Start nervig)

Beim ersten Testen ist es einfacher, wenn man sich nicht jedes Mal per E-Mail bestätigen muss.

1. In Supabase: **Authentication** → **Providers** → **Email**
2. Den Schalter **Confirm email** **deaktivieren**
3. **Save**

> Für den echten Live-Betrieb später wieder einschalten!

### Schritt 8 — App starten

Im Terminal, im Projekt-Ordner:
```bash
npm run dev
```

Die App läuft auf http://localhost:3000

Du kannst dich registrieren, einloggen, Starter anlegen und Fütterungen eintragen. 🎉

---

## 🗂 Projektstruktur

```
sauer-starter/
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root Layout, Fonts
│   ├── page.js                   # Landing-Seite
│   ├── globals.css               # Tailwind + Basis-Styles
│   ├── login/page.js             # Login
│   ├── register/page.js          # Registrierung
│   └── (app)/                    # Geschützte Routen mit Bottom-Nav
│       ├── layout.js
│       ├── dashboard/page.js     # „Meine Starter"
│       ├── sos/page.js           # SOS-Bereich
│       └── starter/
│           ├── new/page.js
│           └── [id]/
│               ├── page.js       # Detail + Verlauf
│               └── edit/page.js
├── components/
│   ├── BottomNav.js
│   ├── FeedingForm.js
│   ├── FeedingHistory.js
│   ├── Logo.js
│   ├── PeakPrognose.js
│   ├── SignOutButton.js
│   ├── StarterCard.js
│   └── StarterForm.js
├── lib/
│   ├── peakPrediction.js         # Peak-Algorithmus
│   └── supabase/
│       ├── client.js             # Browser-Client
│       ├── server.js             # Server-Client (RSC)
│       └── middleware.js         # Session-Refresh
├── supabase/
│   └── schema.sql                # ← in Supabase ausführen!
├── middleware.js                 # Auth-Routing
├── tailwind.config.js
├── next.config.mjs
├── package.json
└── .env.local                    # ← deine Schlüssel!
```

---

## 🧮 Peak-Prognose — wie funktioniert die?

Zwei Faktoren werden zusammengefasst:

1. **Temperatur** (Q10-Regel)
   Aktivität verdoppelt sich pro 10°C wärmer.
   Basis: 24°C → 6 Std. bis Peak.

2. **Verhältnis** (logarithmisch skaliert)
   Mehr Futter = etwas mehr Zeit, aber nicht linear.
   Basis: 1:5:5 (Summe = 10).

Formel:
```
hours = 6 × 2^((24 - temp) / 10) × log(ratio + 1) / log(11)
```

Begrenzt auf 1.5–48 Stunden. Erfahrungswerte aus der Bäckerei.

---

## 🔐 Sicherheit (RLS)

Jede Zeile in `starters` und `feedings` ist mit einer `user_id` verknüpft.
Die Policies stellen sicher, dass User A nur seine eigenen Daten sehen, ändern oder löschen kann — ganz egal, was im Frontend passiert.

Du kannst das in Supabase prüfen:
**Authentication** → **Policies** → es sollten je 4 Policies pro Tabelle stehen.

---

## 🚧 Was kommt später (nicht im MVP)

- Bilder zum Starter (Supabase Storage)
- Reminder & Push-Notifications
- KI-Auswertung des Verlaufs
- Pampered-Chef-Shop-Verlinkung im Dashboard
- Pro-Account / Payment

---

## 🎨 Design

Eigenes Design im „Sauer macht Krustig"-Stil:
- **Farben:** Creme, Mauve, Terracotta, Honiggold, Kakao-Braun
- **Schriften:** Fraunces (Display, charakterstark) + Manrope (Body)
- **Mood:** warm, handwerklich, gemütliches Bäckerinnen-Tagebuch
- **Eigenes Logo:** Glas mit Sauerteig und Bläschen (SVG)

Keine Kopie von bestehenden Apps — alles handgebaut. 🍞

---

## ❓ Häufige Probleme

**„Invalid API URL" beim Login**
→ `.env.local` prüfen. URL muss mit `https://` anfangen, kein Slash am Ende.
→ App neu starten: Strg+C, dann `npm run dev`.

**„Email not confirmed"**
→ Schritt 7 nicht gemacht. In Supabase Confirm-Email deaktivieren oder E-Mail im Postfach bestätigen.

**Tabellen-Fehler („relation 'starters' does not exist")**
→ Schema-SQL in Supabase noch nicht ausgeführt (Schritt 4).

**Module not found**
→ `npm install` neu laufen lassen.

---

Viel Spaß beim Backen — und beim Tracking. 🥖
