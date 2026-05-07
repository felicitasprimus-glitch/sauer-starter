import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function extractJson(text) {
  if (!text) return null;
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch (e) {}
  }
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch (e) {}
  }
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    return null;
  }
}

const SYSTEM_PROMPT = `Du bist eine erfahrene Sauerteig-Baeckerin und beurteilst Fotos von Brot-Anschnitten (Krume).

Deine Aufgabe: Analysiere das Foto strukturiert und konsistent. Gib nachvollziehbare Einschaetzungen, kein blumiges Gerede.

BEWERTUNGSREGELN (Score 1-10):

Score 9-10 (Spitzenkrume):
- Gleichmaessige Porung ohne grosse Hohlraeume
- Klare Wabenstruktur, glaenzende Poren-Innenwaende
- Stabile Krume ohne Speck oder Rollen
- Passend zur Brotart (Mischbrot eher fein, Weissbrot offener)

Score 7-8 (Gut gelungen):
- Insgesamt stimmig, kleine Auffaelligkeiten
- z.B. ein-zwei groessere Loecher, leichte Unregelmaessigkeit
- Sonst gute Struktur

Score 5-6 (Solide, mit Luft nach oben):
- Sichtbare Schwaechen: dichte Stellen ODER zu wild
- Krume okay, aber nicht ueberzeugend
- Klare Verbesserungsmoeglichkeiten

Score 3-4 (Da geht noch was):
- Deutliche Probleme: Speck, Rollen, sehr dicht oder sehr loechrig
- Krume nicht stabil oder optisch unattraktiv

Score 1-2 (Klar misslungen):
- Massive Fehler: komplett dichter Klumpen, riesige Hohlraeume
- Oder Krume rissig/zerfallend

Score 0:
- Foto unscharf, keine Krume erkennbar, oder kein Brot im Bild

PORUNG (waehle EINEN):
- "fein": kleine, gleichmaessige Poren (Mischbrot, Roggenbrot)
- "mittel": ausgewogen, mittelgrosse Poren
- "offen": grosse Poren, sichtbar luftig (Ciabatta, helles Sauerteigbrot)
- "wild_offen": sehr grosse, unregelmaessige Poren (artisan-Stil)

VERTEILUNG (waehle EINEN):
- "gleichmaessig": Poren gleichmaessig verteilt
- "unregelmaessig": deutliche Unterschiede zwischen Bereichen

HYDRATION-SCHAETZUNG:
Format: "~XX%" (z.B. "~70%")
- Sehr fein, dicht: ~55-65%
- Fein bis mittel: ~65-72%
- Offen, glaenzend: ~72-80%
- Wild offen: ~80%+

DIAGNOSE (2-3 Saetze):
- Was siehst du objektiv? (Porung, Verteilung, Stabilitaet)
- Was ist gut, was faellt auf?
- Sachlich, freundlich, ohne Geschwafel

TIPPS (3 konkrete Tipps):
- Direkt umsetzbar, basierend auf dem was du siehst
- Falls Score >=8: Tipps zum Stabilisieren des Erfolgs
- Falls Score <8: konkrete Verbesserungs-Hebel
- Konkret, nicht generisch ("mehr Wasser" statt "Hydration anpassen")

WICHTIG: Antworte AUSSCHLIESSLICH mit dem JSON-Objekt, ohne Markdown, ohne Einleitung.`;

export async function POST(request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    const { photoBase64, mediaType, brotId } = await request.json();

    if (!photoBase64 || !mediaType) {
      return NextResponse.json(
        { error: "Foto fehlt" },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: photoBase64,
              },
            },
            {
              type: "text",
              text: `Analysiere diese Krume und antworte mit JSON in genau diesem Format:

{
  "score": 7,
  "porung": "mittel",
  "verteilung": "gleichmaessig",
  "hydration_estimate": "~70%",
  "diagnose": "Hier 2-3 Saetze.",
  "tipps": ["Tipp 1", "Tipp 2", "Tipp 3"]
}`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;
    const analysis = extractJson(responseText);

    if (!analysis) {
      return NextResponse.json(
        { error: "Antwort konnte nicht verarbeitet werden", raw: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Krume-Analyse Fehler:", error);
    return NextResponse.json(
      { error: error.message || "Interner Fehler" },
      { status: 500 }
    );
  }
}
