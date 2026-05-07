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
              text: "Du bist Felicitas Sauerteig-Expertin. Analysiere dieses Foto vom Brot-Anschnitt (Krume) auf Deutsch, in einem warmen, freundlichen Ton.\n\nAntworte AUSSCHLIESSLICH mit gueltigem JSON in diesem Format. Kein Markdown-Codeblock, kein erklaerender Text, NUR das JSON-Objekt:\n\n{\n  \"score\": 7,\n  \"porung\": \"mittel\",\n  \"verteilung\": \"gleichmaessig\",\n  \"hydration_estimate\": \"~70%\",\n  \"diagnose\": \"Hier 2-3 Saetze was du siehst.\",\n  \"tipps\": [\"Tipp 1\", \"Tipp 2\", \"Tipp 3\"]\n}\n\nWerte fuer porung: fein, mittel, offen, wild_offen\nWerte fuer verteilung: gleichmaessig, unregelmaessig\nScore: 1-10 (10 = perfekt)\n\nSei ehrlich aber motivierend. Wenn das Foto unscharf ist oder keine Krume zeigt, gib score 0 und erklaere das in der diagnose.",
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
