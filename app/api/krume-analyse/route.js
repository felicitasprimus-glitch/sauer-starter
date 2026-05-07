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

const BROT_ART_REGELN = {
  vollkorn: `VOLLKORNBROT - Bewertungsmassstab:
- Ideal: feine bis mittlere, gleichmaessige Porung
- Krume sollte saftig wirken, nicht trocken
- Etwas dichtere Struktur als Weissbrot ist NORMAL und gewuenscht
- Score 9-10: feine gleichmaessige Porung, saftig glaenzend, stabil
- Score 7-8: gleichmaessig, evtl. leicht dichter
- Erwartete Hydration: ~75-85% (Vollkorn braucht mehr Wasser)
- ROTE FLAGGEN: stark dichter Klumpen, Speckschicht unten, Risse`,

  weissbrot: `WEISSBROT / HELLES SAUERTEIGBROT - Bewertungsmassstab:
- Ideal: offene, glaenzende Porung mit Wabenstruktur
- Etwas wilde Porung ist GEWUENSCHT (Charakter)
- Eine zu feine, dichte Krume waere FEHLERHAFT
- Score 9-10: offene/wild offene Porung, glaenzende Wabenwaende, ungleichmaessig im positiven Sinn
- Score 7-8: offen, leicht ungleichmaessig
- Erwartete Hydration: ~70-80%
- ROTE FLAGGEN: dichte feine Krume (= zu wenig Triebkraft), Speckschicht`,

  mischbrot: `MISCHBROT - Bewertungsmassstab:
- Ideal: feine bis mittlere, gleichmaessige Porung
- Stabile Krume, saftig aber schnittfest
- Score 9-10: feine gleichmaessige Porung, glatte Schnittflaeche, stabil
- Score 7-8: gleichmaessig, kleine Auffaelligkeiten
- Erwartete Hydration: ~70-78%
- ROTE FLAGGEN: zu dicht/klumpig, sehr loechrig, Risse durchziehend`,

  roggen: `ROGGENBROT - Bewertungsmassstab:
- Ideal: sehr feine, gleichmaessige, dichte Porung
- Krume MUSS dichter sein als Weizenbrote (das ist KORREKT, kein Fehler!)
- Score 9-10: feine gleichmaessige Wabenstruktur, saftig, schnittfest
- Score 7-8: leichte Unregelmaessigkeit
- Erwartete Hydration: ~75-85%
- ROTE FLAGGEN: lockere Weizenbrot-Porung (Triebkraft falsch), Risse`,
};

const BROT_ART_LABELS = {
  vollkorn: "Vollkornbrot",
  weissbrot: "Weissbrot / Helles Sauerteigbrot",
  mischbrot: "Mischbrot",
  roggen: "Roggenbrot",
  unbekannt: "noch nicht zugeordnet",
};

function buildSystemPrompt(brotArt) {
  const artInfo = brotArt && BROT_ART_REGELN[brotArt]
    ? BROT_ART_REGELN[brotArt]
    : `Versuche zuerst die Brot-Art aus dem Foto zu erkennen (Vollkorn, Weissbrot, Mischbrot, Roggen).
Bewerte dann passend zur erkannten Brot-Art - die Erwartungen sind sehr unterschiedlich:
- Vollkorn: feinere Porung ist ideal
- Weissbrot/Helles Sauerteig: offene Porung ist ideal
- Mischbrot: feine bis mittlere Porung ist ideal
- Roggen: dichte feine Porung ist KORREKT (kein Fehler)`;

  return `Du bist eine erfahrene Sauerteig-Baeckerin und beurteilst Fotos von Brot-Anschnitten (Krume).

Deine Aufgabe: Analysiere das Foto strukturiert und konsistent.

WICHTIG: Bewerte IMMER passend zur Brot-Art. Eine fein-dichte Krume ist:
- Bei einem ROGGEN-/VOLLKORNBROT perfekt (Score 9-10)
- Bei einem WEISSBROT/SAUERTEIG-WEISS misslungen (Score 4-5)

Die Brot-Art fuer dieses Foto:
${artInfo}

ALLGEMEINE BEWERTUNG (nach Brot-Art-Kontext):

Score 9-10 (Spitzenkrume):
- Krume entspricht dem Ideal fuer diese Brot-Art
- Stabile Struktur ohne Speck oder Rollen
- Saftig wirkend, gut gebackene Wabenwaende

Score 7-8 (Gut gelungen):
- Insgesamt stimmig, kleine Auffaelligkeiten

Score 5-6 (Solide, mit Luft nach oben):
- Sichtbare Schwaechen fuer diese Brot-Art

Score 3-4 (Da geht noch was):
- Deutliche Probleme

Score 1-2 (Klar misslungen):
- Massive Fehler

Score 0:
- Foto unscharf, keine Krume erkennbar, oder kein Brot

PORUNG (waehle EINEN):
- "fein": kleine, gleichmaessige Poren
- "mittel": ausgewogen
- "offen": grosse Poren, sichtbar luftig
- "wild_offen": sehr grosse, unregelmaessige Poren

VERTEILUNG (waehle EINEN):
- "gleichmaessig": Poren gleichmaessig verteilt
- "unregelmaessig": deutliche Unterschiede

HYDRATION-SCHAETZUNG:
Format: "~XX%" (z.B. "~70%")

DIAGNOSE (2-3 Saetze):
- Beziehe die Brot-Art ein! ("Fuer ein Roggenbrot ist diese feine Krume ideal" statt nur "feine Krume")
- Was ist gut, was faellt auf?

TIPPS (3 konkrete Tipps):
- Brot-Art-spezifisch
- Direkt umsetzbar

WICHTIG: Antworte AUSSCHLIESSLICH mit dem JSON-Objekt, ohne Markdown.`;
}

export async function POST(request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    const { photoBase64, mediaType, brotId, brotArt } = await request.json();

    if (!photoBase64 || !mediaType) {
      return NextResponse.json(
        { error: "Foto fehlt" },
        { status: 400 }
      );
    }

    let resolvedBrotArt = brotArt;
    if (!resolvedBrotArt && brotId) {
      const { data: brot } = await supabase
        .from("brote")
        .select("flour_types, name")
        .eq("id", brotId)
        .single();

      if (brot) {
        const text = `${brot.name || ""} ${brot.flour_types || ""}`.toLowerCase();
        if (text.includes("vollkorn")) resolvedBrotArt = "vollkorn";
        else if (text.includes("roggen")) resolvedBrotArt = "roggen";
        else if (text.includes("misch")) resolvedBrotArt = "mischbrot";
        else if (text.includes("weiss") || text.includes("weizen") || text.includes("ciabatta") || text.includes("baguette")) {
          resolvedBrotArt = "weissbrot";
        }
      }
    }

    const systemPrompt = buildSystemPrompt(resolvedBrotArt);
    const brotArtLabel = resolvedBrotArt
      ? BROT_ART_LABELS[resolvedBrotArt] || resolvedBrotArt
      : "noch nicht zugeordnet - bitte aus Foto erkennen";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
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
                media_type: mediaType,
                data: photoBase64,
              },
            },
            {
              type: "text",
              text: `Brot-Art: ${brotArtLabel}

Analysiere diese Krume und antworte mit JSON in genau diesem Format:

{
  "score": 7,
  "porung": "mittel",
  "verteilung": "gleichmaessig",
  "hydration_estimate": "~70%",
  "erkannte_brotart": "${resolvedBrotArt || "raten"}",
  "diagnose": "Hier 2-3 Saetze, die die Brot-Art einbeziehen.",
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

    if (resolvedBrotArt && !analysis.erkannte_brotart) {
      analysis.erkannte_brotart = resolvedBrotArt;
    }

    return NextResponse.json({ success: true, analysis, brotArt: resolvedBrotArt });
  } catch (error) {
    console.error("Krume-Analyse Fehler:", error);
    return NextResponse.json(
      { error: error.message || "Interner Fehler" },
      { status: 500 }
    );
  }
}
