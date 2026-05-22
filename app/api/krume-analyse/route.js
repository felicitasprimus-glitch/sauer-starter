import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const DAILY_LIMIT = 5;

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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Nicht eingeloggt" }, { status: 401 });
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
          error: `Du hast heute schon ${DAILY_LIMIT} Krumen-Analysen gemacht. Versuch es morgen wieder!`,
          limitReached: true,
          dailyLimit: DAILY_LIMIT,
        },
        { status: 429 }
      );
    }

    const { imageBase64, mimeType, brotArt, userBeobachtungen } = await request.json();

    if (!imageBase64) {
      return Response.json({ error: "Kein Bild uebergeben" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY fehlt" }, { status: 500 });
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
}`;

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
        { error: "KI-Antwort konnte nicht gelesen werden", raw: text },
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
