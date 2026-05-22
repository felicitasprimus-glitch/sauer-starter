import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function normalizeMimeType(mimeType, base64Data) {
  if (base64Data) {
    if (base64Data.startsWith("/9j/")) return "image/jpeg";
    if (base64Data.startsWith("iVBORw")) return "image/png";
    if (base64Data.startsWith("R0lGOD")) return "image/gif";
    if (base64Data.startsWith("UklGR")) return "image/webp";
  }
  if (ALLOWED_MIME_TYPES.includes(mimeType)) return mimeType;
  return "image/jpeg";
}

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const { imageBase64, mimeType } = await request.json();
    if (!imageBase64) {
      return Response.json({ error: "Kein Bild uebergeben" }, { status: 400 });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY fehlt" }, { status: 500 });
    }

    const validMimeType = normalizeMimeType(mimeType, imageBase64);

    const systemPrompt = `Du liest ein Foto oder einen Screenshot eines Brot-Rezepts und schreibst es sauber und uebersichtlich ab.

REGELN:
- Gib NUR den Rezept-Text zurueck, sauber strukturiert
- Erfinde NICHTS dazu - schreibe nur was wirklich im Bild steht
- Struktur: zuerst eine Liste der Zutaten mit Mengen, dann die Arbeitsschritte
- Nutze einfache Formatierung mit Zeilenumbruechen (keine Markdown-Sternchen)
- Keine Einleitung wie "Hier ist das Rezept" - leg direkt los
- Wenn etwas unleserlich ist, schreibe [unleserlich] an die Stelle
- Antworte auf Deutsch`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
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
                media_type: validMimeType,
                data: imageBase64,
              },
            },
            { type: "text", text: "Schreibe dieses Rezept sauber und uebersichtlich ab." },
          ],
        },
      ],
    });

    const rezeptText = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!rezeptText) {
      return Response.json(
        { error: "Konnte kein Rezept im Bild erkennen" },
        { status: 500 }
      );
    }

    return Response.json({ rezeptText });
  } catch (err) {
    return Response.json(
      { error: err.message || "Fehler beim Lesen des Rezepts" },
      { status: 500 }
    );
  }
}
