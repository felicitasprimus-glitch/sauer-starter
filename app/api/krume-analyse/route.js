import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const DAILY_LIMIT = 5;

const LANG_NAME = { de: "Deutsch", en: "Englisch", es: "Spanisch (Espanol)" };

const ERR = {
  de: {
    notLoggedIn: "Nicht eingeloggt",
    noImage: "Kein Bild uebergeben",
    noKey: "ANTHROPIC_API_KEY fehlt",
    limit: (n) => `Du hast heute schon ${n} Krumen-Analysen gemacht. Versuch es morgen wieder!`,
    parse: "KI-Antwort konnte nicht gelesen werden",
  },
  en: {
    notLoggedIn: "Not logged in",
    noImage: "No image provided",
    noKey: "ANTHROPIC_API_KEY missing",
    limit: (n) => `You have already done ${n} crumb analyses today. Try again tomorrow!`,
    parse: "Could not read the AI response",
  },
  es: {
    notLoggedIn: "No has iniciado sesión",
    noImage: "No se envió ninguna imagen",
    noKey: "Falta ANTHROPIC_API_KEY",
    limit: (n) => `Ya has hecho ${n} análisis de miga hoy. ¡Inténtalo mañana!`,
    parse: "No se pudo leer la respuesta de la IA",
  },
};

const BROT_PROFILE = {
  vollkorn: {
    name: "Vollkornbrot",
    ideal: "feinporig, dicht, gleichmaessig — ist normal und gut bei 100% Vollkorn",
    warnung: "Bewerte feine dichte Krume bei Vollkorn POSITIV (8-10), nicht negativ.",
  },
  weissbrot: {
    name: "Weissbrot/Weizen/Ciabatta/Baguette",
    ideal: "wilde offene Porung, glaenzende Wabenwaende, ungleichmaessige grosse Loecher",
    warnung: "DICHTE FESTE GLEICHMAESSIGE KRUME bei Weissbrot bedeutet UNTERGARE oder fehlender Trieb — niedrige Bewertung (1-4)!",
  },
  mischbrot: {
    name: "Mischbrot",
    ideal: "mittelgrosse gleichmaessige Poren, leicht offen aber stabil",
    warnung: "Sehr dichte Krume = Untergare. Sehr grosse Loecher = Uebergare.",
  },
  roggen: {
    name: "Roggenbrot",
    ideal: "feinporig, dicht, kompakt — ist NORMAL bei Roggen wegen wenig Gluten",
    warnung: "Bewerte feinporige dichte Krume bei Roggen POSITIV (8-10).",
  },
  unbekannt: {
    name: "Unbekannte Brot-Art",
    ideal: "schwer zu sagen ohne Brot-Art",
    warnung: "Bewerte konservativ. Wenn Krume sehr dicht und feucht wirkt, koennte es Untergare sein.",
  },
};

function extractJson(text) {
  if (!text) return null;
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = codeBlockMatch ? codeBlockMatch[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const supabase = createClient();

    const body = await request.json().catch(() => ({}));
    const { imageBase64, mimeType, brotArt, userBeobachtungen, lang } = body;
    const L = ERR[lang] || ERR.de;
    const langName = LANG_NAME[lang] || "Deutsch";

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: L.notLoggedIn }, { status: 401 });
    }

    // LIMIT-CHECK: Wie viele Analysen heute schon gemacht?
    const today = new Date().toISOString().slice(0, 10);

    const { data: limitData } = await supabase
      .from("krumen_limits")
      .select("count")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    const todayCount = limitData?.count || 0;

    // Admin-Check: Admins haben kein Limit
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.is_admin === true;

    if (!isAdmin && todayCount >= DAILY_LIMIT) {
      return Response.json(
        {
          error: L.limit(DAILY_LIMIT),
          limitReached: true,
          dailyLimit: DAILY_LIMIT,
        },
        { status: 429 }
      );
    }

    if (!imageBase64) {
      return Response.json({ error: L.noImage }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: L.noKey }, { status: 500 });
    }

    const profile2 = BROT_PROFILE[brotArt] || BROT_PROFILE.unbekannt;

    let userInfoBlock = "";
    if (userBeobachtungen) {
      const parts = [];
      if (userBeobachtungen.aufgang) {
        const map = { gut: "Brot ist gut aufgegangen", okay: "Brot ist okay aufgegangen", kaum: "Brot ist KAUM aufgegangen — starkes Indiz fuer Untergare oder schwachen Trieb!" };
        parts.push("- Aufgang: " + (map[userBeobachtungen.aufgang] || userBeobachtungen.aufgang));
      }
      if (userBeobachtungen.gefuehl) {
        const map = { luftig: "Brot fuehlt sich leicht und luftig an", normal: "Brot fuehlt sich normal an", schwer: "Brot fuehlt sich SCHWER und FEUCHT an — starkes Indiz fuer Untergare!" };
        parts.push("- Gewicht/Gefuehl: " + (map[userBeobachtungen.gefuehl] || userBeobachtungen.gefuehl));
      }
      if (userBeobachtungen.krume) {
        const map = {
          luftig: "Krume wirkt luftig mit Poren",
          "dicht-fein": "Krume wirkt dicht und fein",
          gummig: "Krume ist GUMMIG/KLITSCHIG — typisch fuer Untergare!",
          speck: "Es gibt eine SPECKSCHICHT unten — typisch fuer Untergare oder zu nasse Krume!",
          risse: "Es gibt RISSE oder grosse HOHLRAEUME — typisch fuer Uebergare oder Formfehler!",
        };
        parts.push("- Krumen-Eindruck: " + (map[userBeobachtungen.krume] || userBeobachtungen.krume));
      }
      if (userBeobachtungen.openCrumb === "ja") {
        parts.push("- ZIEL OPEN CRUMB: Die Baeckerin wollte eine wilde, offene Porung (Open Crumb). Bewerte gezielt, wie offen und unregelmaessig die Porung ist, und gib konkrete Tipps fuer eine offenere Krume.");
      } else if (userBeobachtungen.openCrumb === "nein") {
        parts.push("- KEIN Open Crumb angestrebt: Die Baeckerin wollte eine normale, gleichmaessige Krume. Bewerte NICHT negativ wenn die Porung nicht wild-offen ist.");
      }
      if (userBeobachtungen.hydration) {
        const map = {
          unter65: "Teig-Hydration UNTER 65% (fester Teig) - hier ist eine dichtere, gleichmaessige Krume voellig normal. Erwarte KEINE offene Porung.",
          "65-70": "Teig-Hydration 65-70% (Standard) - moderate Porung erwartbar, keine wilde Offenheit.",
          "70-75": "Teig-Hydration 70-75% (weicher Teig) - offenere Porung moeglich.",
          "75-80": "Teig-Hydration 75-80% (hoch) - offene, unregelmaessige Porung gut moeglich.",
          ueber80: "Teig-Hydration UEBER 80% (high hydration, z.B. Ciabatta oder Pan de Cristal) - sehr offene, wilde, glasige Porung ist hier das ZIEL. Solche Brote sind oft flach, haben KEIN Ohr und werden teils gar nicht eingeschnitten - das ist VOELLIG NORMAL und kein Mangel.",
          weissnicht: "Hydration unbekannt - schaetze sie aus dem Foto und beruecksichtige sie.",
        };
        parts.push("- HYDRATION: " + (map[userBeobachtungen.hydration] || userBeobachtungen.hydration));
      }
      if (userBeobachtungen.eigeneNote) {
        parts.push("- Selbsteinschaetzung der Baeckerin: " + userBeobachtungen.eigeneNote + "/10");
      }
      if (parts.length > 0) {
        userInfoBlock = "\n\nWICHTIGE BEOBACHTUNGEN DER BAECKERIN (du MUSST diese in deine Bewertung einfliessen lassen):\n" + parts.join("\n");
      }
    }

    const systemPrompt = `Du bist ein erfahrener Sauerteig-Baecker und bewertest Brot-Krumen.

BROT-ART: ${profile2.name}
Ideale Krume bei dieser Art: ${profile2.ideal}
WARNUNG: ${profile2.warnung}

KRITISCHE REGELN — UNBEDINGT BEACHTEN:

1. UNTERGARE ERKENNEN bei Weissbrot/Mischbrot:
   - Dichte feste gleichmaessige Krume
   - Speckschicht unten (klitschiger Streifen)
   - Krume fuehlt sich gummig/klitschig an
   - Brot ist schwer und kaum aufgegangen
   → Score 1-4, Diagnose: "Untergare"

2. UEBERGARE ERKENNEN:
   - Sehr grosse unregelmaessige Loecher/Hohlraeume
   - Eingefallene Krume
   - Risse durch die Krume
   → Score 2-5, Diagnose: "Uebergare"

3. GUTE FERMENTATION bei Weissbrot:
   - Wilde offene Porung mit verschiedenen Lochgroessen
   - Glaenzende Wabenwaende
   - Stabile aber luftige Struktur
   → Score 7-10

4. WENN DIE BAECKERIN BEOBACHTUNGEN MITGIBT:
   - Diese Beobachtungen sind WICHTIGER als das Foto allein
   - Eine Baeckerin die "schwer feucht" oder "gummig" sagt, hat fast immer Recht
   - Passe deinen Score entsprechend an

5. SCORE-VERTEILUNG (sei ehrlich, nicht zu nett):
   - 9-10: Spitzenkrume, perfekt fuer die Brot-Art
   - 7-8: Gut gelungen, kleine Optimierungen moeglich
   - 5-6: Solide, aber sichtbare Schwaechen
   - 3-4: Klare Probleme (Untergare, schwacher Trieb)
   - 1-2: Stark fehlerhaft

6. OPEN CRUMB (nur wenn die Baeckerin es als Ziel angibt):
   - Open Crumb = wilde, sehr offene, unregelmaessige Porung mit grossen glaenzenden Loechern
   - Foerdernde Faktoren: hohe Hydration (75%+), schonendes Formen, ausreichende Stockgare, gutes Dehnen-und-Falten, starker Trieb, heisses Anbacken mit Dampf
   - Wenn Open Crumb angestrebt wurde: bewerte gezielt die Offenheit und gib in den Tipps KONKRETE Hinweise fuer eine offenere Krume
   - Open Crumb ist NUR bei Weiss-/Weizenbrot sinnvoll, NICHT bei Vollkorn oder Roggen (dort ist feine dichte Krume normal und gut)

7. NUR DIE KRUME BEWERTEN - NICHT die Kruste, NICHT die Form:
   - Du bewertest den ANSCHNITT (die Porung im Inneren), NICHT die aussere Kruste
   - Erwaehne NIEMALS ein fehlendes "Ohr" (das ist ein Krusten-Merkmal beim Einschneiden und gehoert NICHT zur Krumenanalyse)
   - Bemaengle NICHT die Hoehe, Woelbung oder flache Form - viele tolle Brote sind flach
   - Konzentriere dich rein auf: Porung, Porenverteilung, Krumenfeuchtigkeit, Struktur

8. HYDRATION beruecksichtigen:
   - Bei niedriger Hydration (unter 70%) ist eine dichtere, gleichmaessige Krume normal und gut - bewerte sie NICHT als zu dicht
   - Bei hoher Hydration (75%+) ist eine offene Porung erwartbar
   - SPEZIALBROTE wie Pan de Cristal, Ciabatta oder Focaccia (sehr hohe Hydration 80%+): wilde glasige Porung, oft flach, KEIN Ohr, teils nicht eingeschnitten - das ist PERFEKT und kein Mangel. Bewerte solche Brote nach ihrer Offenheit und Struktur, nicht nach Standardkriterien.

Antworte AUSSCHLIESSLICH mit JSON in diesem Format (kein Markdown, kein Code-Block, keine Erklaerung davor oder danach):

{
  "porung": "fein/mittel/grob/wild-offen/dicht/uneinheitlich",
  "hydration_estimate": "60-65% / 70-75% / 80%+ / unklar",
  "score": <Zahl 1-10>,
  "diagnose": "<Hauptproblem oder 'Gut gelungen'>",
  "zusammenfassung": "<2-3 Saetze: was siehst du in der Krume>",
  "tipps": [
    "<konkreter Tipp>",
    "<konkreter Tipp>",
    "<konkreter Tipp>"
  ]
}

SPRACHE: Schreibe die Werte der Felder "diagnose", "zusammenfassung", "tipps", "porung" und "hydration_estimate" AUSSCHLIESSLICH auf ${langName}. Die JSON-Schluesselnamen bleiben EXAKT wie oben (porung, hydration_estimate, score, diagnose, zusammenfassung, tipps) - nur die Werte uebersetzen.`;

    const userMessage = `Bewerte diese Krume.${userInfoBlock}\n\nDenk dran: Beobachtungen der Baeckerin sind sehr wichtig!`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            { type: "text", text: userMessage },
          ],
        },
      ],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const analysis = extractJson(text);

    if (!analysis) {
      return Response.json(
        { error: L.parse, raw: text },
        { status: 500 }
      );
    }

    // LIMIT-COUNTER hochzaehlen (auch fuer Admins, dann sieht man Trends)
    if (limitData) {
      await supabase
        .from("krumen_limits")
        .update({ count: todayCount + 1, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("date", today);
    } else {
      await supabase
        .from("krumen_limits")
        .insert({ user_id: user.id, date: today, count: 1 });
    }

    return Response.json({
      analysis,
      remainingToday: isAdmin ? null : Math.max(0, DAILY_LIMIT - (todayCount + 1)),
    });
  } catch (err) {
    return Response.json(
      { error: err.message || "Fehler bei der Analyse" },
      { status: 500 }
    );
  }
}
