import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const DAILY_LIMIT = 3;

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

    // LIMIT-CHECK
    const today = new Date().toISOString().slice(0, 10);
    const { data: limitData } = await supabase
      .from("starter_limits")
      .select("count")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    const todayCount = limitData?.count || 0;

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.is_admin === true;

    if (!isAdmin && todayCount >= DAILY_LIMIT) {
      return Response.json(
        {
          error: `Du hast heute schon ${DAILY_LIMIT} Starter-Analysen gemacht. Versuch es morgen wieder!`,
          limitReached: true,
          dailyLimit: DAILY_LIMIT,
        },
        { status: 429 }
      );
    }

    const { imageBase64, mimeType, userBeobachtungen, starterId } = await request.json();

    if (!imageBase64) {
      return Response.json({ error: "Kein Bild uebergeben" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY fehlt" }, { status: 500 });
    }

    // User-Beobachtungen aufbereiten
    let userInfoBlock = "";
    if (userBeobachtungen) {
      const parts = [];
      if (userBeobachtungen.volumen) {
        const map = {
          verdoppelt: "Volumen hat sich verdoppelt - klares Anzeichen fuer Peak",
          gewachsen: "Volumen ist gewachsen aber noch nicht verdoppelt",
          kaum: "Volumen kaum veraendert - Starter noch nicht aktiv",
        };
        parts.push("- Volumen: " + (map[userBeobachtungen.volumen] || userBeobachtungen.volumen));
      }
      if (userBeobachtungen.blaeschen) {
        const map = {
          viele: "Viele Blaeschen an der Oberflaeche und im Glas",
          einige: "Einige Blaeschen sichtbar",
          wenige: "Wenige Blaeschen - schwacher Trieb",
        };
        parts.push("- Blaeschen: " + (map[userBeobachtungen.blaeschen] || userBeobachtungen.blaeschen));
      }
      if (userBeobachtungen.geruch) {
        const map = {
          fruchtig: "Fruchtig-saeuerlicher Geruch - PEAK!",
          mild: "Mild-saeuerlicher Geruch",
          essig: "Strenger Essig-Geruch - eher ueberfaellig",
          neutral: "Kaum Geruch - noch nicht aktiv",
        };
        parts.push("- Geruch: " + (map[userBeobachtungen.geruch] || userBeobachtungen.geruch));
      }
      if (userBeobachtungen.kuppel) {
        const map = {
          kuppelig: "Kuppelfoermig nach oben gewoelbt - klares Peak-Zeichen",
          flach: "Flach oder leicht gewoelbt",
          eingefallen: "Eingefallen in der Mitte - Peak ueberschritten",
        };
        parts.push("- Kuppel/Form: " + (map[userBeobachtungen.kuppel] || userBeobachtungen.kuppel));
      }

      if (parts.length > 0) {
        userInfoBlock = "\n\nBEOBACHTUNGEN DER BAECKERIN (du MUSST diese in deine Bewertung einfliessen lassen):\n" + parts.join("\n");
      }
    }

    const systemPrompt = `Du bist ein erfahrener Sauerteig-Baecker und bewertest, ob ein Starter backbereit ist.

DEINE AUFGABE: Erkenne ob der Starter am Peak ist und backbereit ist.

KRITISCHE REGELN:

1. BACKBEREITER STARTER (Peak):
   - Volumen hat sich (fast) verdoppelt
   - Kuppelfoermige Wassergeruch nach oben
   - Viele aktive Blaeschen im Teig und an der Oberflaeche
   - Fruchtig-saeuerlicher Geruch
   - Schwimmt im Wassertest
   - Status: BEREIT

2. KOMMT BALD (Aufgehend):
   - Volumen gewachsen aber noch nicht verdoppelt
   - Erste Blaeschen sichtbar
   - Status: BALD

3. NICHT BEREIT (Zu frueh):
   - Volumen kaum veraendert
   - Wenige Blaeschen
   - Status: NEIN

4. UEBERFAELLIG (Peak ueberschritten):
   - Eingefallene Mitte / Flach
   - Strenger Essig-Geruch
   - Wassertropfen oder Trennung Wasser/Mehl
   - Status: UEBERREIF

5. WENN DIE BAECKERIN BEOBACHTUNGEN MITGIBT:
   - Diese Beobachtungen sind WICHTIGER als das Foto allein
   - Vor allem "Volumen verdoppelt" und "kuppelfoermig" sind starke Peak-Indikatoren

Antworte AUSSCHLIESSLICH mit JSON in diesem Format (kein Markdown, kein Code-Block):

{
  "status": "BEREIT" | "BALD" | "NEIN" | "UEBERREIF",
  "score": <Zahl 1-10>,
  "begruendung": "<2-3 Saetze warum du diesen Status gibst>",
  "tipps": [
    "<konkreter Tipp>",
    "<konkreter Tipp>"
  ]
}

Score-Bedeutung:
- 9-10: Perfekter Peak, sofort backen
- 7-8: Sehr bald bereit (1-2 Stunden)
- 5-6: Noch ein paar Stunden warten
- 3-4: Frueh, mehrere Stunden warten oder fuettern
- 1-2: Komplett im falschen Zustand`;

    const userMessage = `Bewerte diesen Sauerteig-Starter. Ist er backbereit?${userInfoBlock}`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 800,
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

    // Limit-Counter hochzaehlen
    if (limitData) {
      await supabase
        .from("starter_limits")
        .update({ count: todayCount + 1, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("date", today);
    } else {
      await supabase
        .from("starter_limits")
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
