import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const supabase = await createClient();

    // Auth-Check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    // Foto + optionale brot_id aus Request lesen
    const { photoBase64, mediaType, brotId } = await request.json();

    if (!photoBase64 || !mediaType) {
      return NextResponse.json(
        { error: "Foto fehlt" },
        { status: 400 }
      );
    }

    // Anfrage an Claude
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
              text: `Du bist Felicitas' Sauerteig-Expertin. Analysiere dieses Foto vom Brot-Anschnitt (Krume) auf Deutsch, in einem warmen, freundlichen Ton.

Antworte AUSSCHLIESSLICH mit gültigem JSON in diesem Format (ohne Markdown-Codeblock, ohne erklärenden Text drumherum):

{
  "score": <Zahl 1-10>,
  "porung": "<fein|mittel|offen|wild_offen>",
  "verteilung": "<gleichmäßig|unregelmäßig>",
  "hydration_estimate": "<z.B. ~70%>",
  "diagnose": "<2-3 Sätze: was du siehst, was gut/auffällig ist>",
  "tipps": ["<Tipp 1>", "<Tipp 2>", "<Tipp 3>"]
}

Sei ehrlich aber motivierend. Wenn das Foto unscharf ist oder keine Krume zeigt, gib score: 0 und erkläre das in der diagnose.`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;

    // JSON parsen
    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json(
        { error: "Antwort konnte nicht verarbeitet werden", raw: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, analysis }
