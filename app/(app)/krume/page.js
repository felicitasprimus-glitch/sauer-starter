"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function KrumeAnalysePage() {
  const router = useRouter();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [error, setError] = useState(null);

  const [brote, setBrote] = useState([]);
  const [selectedBrotId, setSelectedBrotId] = useState("");
  const [showBrotPicker, setShowBrotPicker] = useState(false);

  const [postAction, setPostAction] = useState(null);
  const [savingPost, setSavingPost] = useState(false);
  const [postMessage, setPostMessage] = useState(null);
  const [newBrotName, setNewBrotName] = useState("");

  useEffect(() => {
    async function loadBrote() {
      const supabase = createClient();
      const { data } = await supabase
        .from("brote")
        .select("id, name, baked_at")
        .order("baked_at", { ascending: false })
        .limit(20);
      if (data) setBrote(data);
    }
    loadBrote();
  }, []);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Bitte ein Bild auswaehlen.");
      return;
    }
    setError(null);
    setResult(null);
    setPostAction(null);
    setPostMessage(null);
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
        body: JSON.stringify({ photoBase64, mediaType, brotId: selectedBrotId || null }),
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
            const { data: inserted } = await supabase
              .from("krumen_analysen")
              .insert({
                user_id: userData.user.id,
                brot_id: selectedBrotId || null,
                photo_path: path,
                analysis_text: JSON.stringify(data.analysis),
                porung: data.analysis.porung,
                hydration_estimate: data.analysis.hydration_estimate,
                diagnose: data.analysis.diagnose,
                tipps: data.analysis.tipps?.join("\n"),
                score: data.analysis.score,
                raw_json: data.analysis,
              })
              .select("id")
              .single();

            if (inserted) {
              setAnalysisId(inserted.id);
              setPhotoPath(path);

              if (selectedBrotId) {
                await supabase
                  .from("brote")
                  .update({
                    krume_analyse_id: inserted.id,
                    krume_score: data.analysis.score,
                    krume_diagnose: data.analysis.diagnose,
                    krume_tipps: data.analysis.tipps?.join("\n"),
                  })
                  .eq("id", selectedBrotId);
              }
            }
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

  async function saveAsNewBrot() {
    if (!newBrotName.trim() || !analysisId) return;
    setSavingPost(true);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("Nicht angemeldet");

      const { data: brot, error: brotErr } = await supabase
        .from("brote")
        .insert({
          user_id: userData.user.id,
          name: newBrotName.trim(),
          baked_at: new Date().toISOString().split("T")[0],
          photo_path: photoPath,
          krume_analyse_id: analysisId,
          krume_score: result.score,
          krume_diagnose: result.diagnose,
          krume_tipps: result.tipps?.join("\n"),
        })
        .select("id")
        .single();

      if (brotErr) throw brotErr;

      await supabase
        .from("krumen_analysen")
        .update({ brot_id: brot.id })
        .eq("id", analysisId);

      setPostMessage("Brot-Eintrag wurde angelegt!");
      setTimeout(() => router.push(`/brote/${brot.id}`), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPost(false);
    }
  }

  async function attachToBrot(brotId) {
    if (!brotId || !analysisId) return;
    setSavingPost(true);
    try {
      const supabase = createClient();
      await supabase
        .from("krumen_analysen")
        .update({ brot_id: brotId })
        .eq("id", analysisId);

      await supabase
        .from("brote")
        .update({
          krume_analyse_id: analysisId,
          krume_score: result.score,
          krume_diagnose: result.diagnose,
          krume_tipps: result.tipps?.join("\n"),
        })
        .eq("id", brotId);

      setPostMessage("Krume-Analyse wurde an das Brot angehaengt!");
      setTimeout(() => router.push(`/brote/${brotId}`), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPost(false);
    }
  }

  function reset() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setResult(null);
    setError(null);
    setAnalysisId(null);
    setPhotoPath(null);
    setPostAction(null);
    setPostMessage(null);
    setNewBrotName("");
    setSelectedBrotId("");
  }

  function scoreLabel(score) {
    if (score >= 8) return { text: "Spitzenkrume!", emoji: "🏆", color: "text-emerald-700" };
    if (score >= 6) return { text: "Gut gelungen", emoji: "👍", color: "text-emerald-600" };
    if (score >= 4) return { text: "Solide Krume", emoji: "🌾", color: "text-honey-600" };
    if (score >= 2) return { text: "Da geht noch was", emoji: "🌱", color: "text-terra-500" };
    return { text: "Foto unklar", emoji: "🤔", color: "text-cocoa-500" };
  }

  function formatDate(d) {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
    } catch {
      return "";
    }
  }

  const selectedBrot = brote.find((b) => b.id === selectedBrotId);

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
        <>
          {brote.length > 0 && (
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
              <button
                onClick={() => setShowBrotPicker(!showBrotPicker)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <div className="text-sm font-medium text-cocoa-800">
                    {selectedBrot ? `🔗 ${selectedBrot.name}` : "🔗 Zu einem Brot zuordnen?"}
                  </div>
                  <div className="text-xs text-cocoa-500">
                    {selectedBrot
                      ? `vom ${formatDate(selectedBrot.baked_at)} - tippen zum aendern`
                      : "Optional - kannst du auch nach der Analyse machen"}
                  </div>
                </div>
                <span className="text-cocoa-400">{showBrotPicker ? "▲" : "▼"}</span>
              </button>

              {showBrotPicker && (
                <div className="mt-3 space-y-2 border-t border-cream-200 pt-3">
                  <button
                    onClick={() => {
                      setSelectedBrotId("");
                      setShowBrotPicker(false);
                    }}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                      !selectedBrotId
                        ? "bg-terra-100 text-terra-700"
                        : "hover:bg-cream-100 text-cocoa-700"
                    }`}
                  >
                    Keine Zuordnung
                  </button>
                  {brote.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBrotId(b.id);
                        setShowBrotPicker(false);
                      }}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                        selectedBrotId === b.id
                          ? "bg-terra-100 text-terra-700"
                          : "hover:bg-cream-100 text-cocoa-700"
                      }`}
                    >
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-cocoa-500">{formatDate(b.baked_at)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl bg-cream-50 p-6 shadow-sm">
            {!photoPreview ? (
              <div className="flex flex-col gap-3">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-mauve-300 bg-white px-6 py-6 text-center hover:border-terra-400 hover:bg-cream-100">
                  <span className="text-3xl">📸</span>
                  <span className="mt-2 text-sm font-medium text-cocoa-800">Foto aufnehmen</span>
                  <span className="mt-1 text-xs text-cocoa-500">Mit der Kamera</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-mauve-300 bg-white px-6 py-6 text-center hover:border-terra-400 hover:bg-cream-100">
                  <span className="text-3xl">🖼️</span>
                  <span className="mt-2 text-sm font-medium text-cocoa-800">Aus Galerie waehlen</span>
                  <span className="mt-1 text-xs text-cocoa-500">Vorhandenes Foto</span>
                  <input
                    type="file"
                    accept="image/*"
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
        </>
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

          {!postMessage && analysisId && !selectedBrotId && (
            <div className="rounded-2xl border border-mauve-200 bg-white p-5 shadow-sm">
              <h2 className="font-display text-lg text-cocoa-900">Was moechtest du machen?</h2>
              <p className="mt-1 text-xs text-cocoa-500">
                Diese Analyse ist gespeichert. Optional kannst du sie einem Brot zuordnen.
              </p>

              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setPostAction("new")}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    postAction === "new"
                      ? "border-terra-400 bg-terra-50"
                      : "border-mauve-200 bg-white hover:bg-cream-50"
                  }`}
                >
                  <div className="font-medium text-cocoa-800">Als neuen Brot-Eintrag speichern</div>
                  <div className="text-xs text-cocoa-500">Foto + KI-Analyse landen im Brot-Tagebuch</div>
                </button>

                {brote.length > 0 && (
                  <button
                    onClick={() => setPostAction("attach")}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      postAction === "attach"
                        ? "border-terra-400 bg-terra-50"
                        : "border-mauve-200 bg-white hover:bg-cream-50"
                    }`}
                  >
                    <div className="font-medium text-cocoa-800">An bestehendes Brot anhaengen</div>
                    <div className="text-xs text-cocoa-500">Krume zu einem deiner Brote zuordnen</div>
                  </button>
                )}
              </div>

              {postAction === "new" && (
                <div className="mt-4 space-y-2">
                  <input
                    type="text"
                    placeholder="Name des Brotes (z.B. Mischbrot Sonntag)"
                    value={newBrotName}
                    onChange={(e) => setNewBrotName(e.target.value)}
                    className="w-full rounded-xl border border-mauve-200 bg-white px-4 py-3 text-sm focus:border-terra-400 focus:outline-none"
                  />
                  <button
                    onClick={saveAsNewBrot}
                    disabled={!newBrotName.trim() || savingPost}
                    className="w-full rounded-full bg-terra-500 px-4 py-3 text-sm font-medium text-white hover:bg-terra-600 disabled:opacity-50"
                  >
                    {savingPost ? "Speichere..." : "Brot-Eintrag anlegen"}
                  </button>
                </div>
              )}

              {postAction === "attach" && (
                <div className="mt-4 max-h-60 space-y-1 overflow-y-auto rounded-xl border border-cream-200 p-2">
                  {brote.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => attachToBrot(b.id)}
                      disabled={savingPost}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-cream-100 disabled:opacity-50"
                    >
                      <div className="font-medium text-cocoa-800">{b.name}</div>
                      <div className="text-xs text-cocoa-500">{formatDate(b.baked_at)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedBrotId && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
              ✅ Diese Analyse ist mit dem Brot &quot;{selectedBrot?.name}&quot; verknuepft.
              <Link
                href={`/brote/${selectedBrotId}`}
                className="ml-1 underline hover:text-emerald-800"
              >
                Brot ansehen
              </Link>
            </div>
          )}

          {postMessage && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
              ✅ {postMessage}
            </div>
          )}

          <button
            onClick={reset}
            className="w-full rounded-full border border-mauve-300 bg-white px-4 py-3 text-sm font-medium text-cocoa-700 hover:bg-cream-100"
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
