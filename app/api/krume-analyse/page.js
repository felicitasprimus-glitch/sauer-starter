"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function KrumeAnalysePage() {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Bitte ein Bild auswaehlen.");
      return;
    }
    setError(null);
    setResult(null);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function analyze() {
    if (!photoFile) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const photoBase64 = await fileToBase64(photoFile);
      const mediaType = photoFile.type;

      const response = await fetch("/api/krume-analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoBase64, mediaType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analyse fehlgeschlagen");
      }

      setResult(data.analysis);

      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const ext = photoFile.name.split(".").pop() || "jpg";
          const path = `${userData.user.id}/krume/${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("photos")
            .upload(path, photoFile);

          if (!upErr) {
            await supabase.from("krumen_analysen").insert({
              user_id: userData.user.id,
              photo_path: path,
              analysis_text: JSON.stringify(data.analysis),
              porung: data.analysis.porung,
              hydration_estimate: data.analysis.hydration_estimate,
              diagnose: data.analysis.diagnose,
              tipps: data.analysis.tipps?.join("\n"),
              score: data.analysis.score,
              raw_json: data.analysis,
            });
          }
        }
      } catch (saveErr) {
        console.error("Speichern fehlgeschlagen:", saveErr);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setResult(null);
    setError(null);
  }

  function scoreLabel(score) {
    if (score >= 8) return { text: "Spitzenkrume!", emoji: "🏆", color: "text-emerald-700" };
    if (score >= 6) return { text: "Gut gelungen", emoji: "👍", color: "text-emerald-600" };
    if (score >= 4) return { text: "Solide Krume", emoji: "🌾", color: "text-honey-600" };
    if (score >= 2) return { text: "Da geht noch was", emoji: "🌱", color: "text-terra-500" };
    return { text: "Foto unklar", emoji: "🤔", color: "text-cocoa-500" };
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-cocoa-600 hover:text-terra-600">
          Zurueck
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-3xl text-cocoa-900">Krumenleser</h1>
        <p className="mt-2 text-sm text-cocoa-600">
          Mach ein Foto vom Anschnitt deines Brotes - die KI analysiert die Krume und gibt dir Tipps fuers naechste Backen.
        </p>
      </div>

      {!result && (
        <div className="rounded-2xl bg-cream-50 p-6 shadow-sm">
          {!photoPreview ? (
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-mauve-300 bg-white px-6 py-8 text-center hover:border-terra-400 hover:bg-cream-100">
                <span className="text-3xl">📸</span>
                <span className="mt-2 text-sm font-medium text-cocoa-800">Foto aufnehmen</span>
                <span className="mt-1 text-xs text-cocoa-500">oder aus Galerie waehlen</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-center text-xs text-cocoa-500">
                Tipp: Schneide das Brot frisch an, sorge fuer gutes Licht und halte die Kamera ruhig.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <img
                src={photoPreview}
                alt="Krume-Vorschau"
                className="aspect-square w-full rounded-xl object-cover"
              />
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  disabled={analyzing}
                  className="flex-1 rounded-full border border-mauve-300 bg-white px-4 py-3 text-sm font-medium text-cocoa-700 hover:bg-cream-100 disabled:opacity-50"
                >
                  Anderes Foto
                </button>
                <button
                  onClick={analyze}
                  disabled={analyzing}
                  className="flex-1 rounded-full bg-terra-500 px-4 py-3 text-sm font-medium text-white hover:bg-terra-600 disabled:opacity-50"
                >
                  {analyzing ? "Analysiere..." : "Krume analysieren"}
                </button>
              </div>
              {analyzing && (
                <p className="text-center text-xs text-cocoa-500">
                  Felicitas KI-Baeckerin schaut sich deine Krume an... 🥖
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Analysierte Krume"
              className="aspect-square w-full rounded-2xl object-cover shadow-sm"
            />
          )}

          <div className="rounded-2xl bg-cream-50 p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <div className={`text-4xl font-bold ${scoreLabel(result.score).color}`}>
                  {result.score}/10
                </div>
                <div className={`text-sm font-medium ${scoreLabel(result.score).color}`}>
                  {scoreLabel(result.score).emoji} {scoreLabel(result.score).text}
                </div>
              </div>
              <div className="text-right text-xs text-cocoa-500">
                <div>Porung: {result.porung}</div>
                <div>Hydration: {result.hydration_estimate}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg text-cocoa-900">Diagnose</h2>
            <p className="mt-2 text-sm text-cocoa-700">{result.diagnose}</p>
          </div>

          {result.tipps && result.tipps.length > 0 && (
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="font-display text-lg text-cocoa-900">Tipps fuers naechste Mal</h2>
              <ul className="mt-2 space-y-2">
                {result.tipps.map((tipp, i) => (
                  <li key={i} className="flex gap-2 text-sm text-cocoa-700">
                    <span className="text-terra-500">→</span>
                    <span>{tipp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={reset}
            className="w-full rounded-full bg-terra-500 px-4 py-3 text-sm font-medium text-white hover:bg-terra-600"
          >
            Nochmal analysieren
          </button>

          <p className="text-center text-xs text-cocoa-400">
            KI-Einschaetzung - kein Profibaecker-Urteil. Vertrau auch deinem Gefuehl. 🥖
          </p>
        </div>
      )}
    </div>
  );
}
