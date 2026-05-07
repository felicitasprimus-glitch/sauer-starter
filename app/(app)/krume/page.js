"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const BROT_ARTEN = [
  { value: "vollkorn", label: "Vollkorn", emoji: "🌾", desc: "100% Vollkorn" },
  { value: "weissbrot", label: "Weissbrot", emoji: "🍞", desc: "Helles Weizenbrot, Ciabatta, Baguette" },
  { value: "mischbrot", label: "Mischbrot", emoji: "🥖", desc: "Mix aus hell und Vollkorn" },
  { value: "roggen", label: "Roggenbrot", emoji: "🌑", desc: "Hauptsaechlich Roggen" },
  { value: "unbekannt", label: "Weiss nicht", emoji: "❓", desc: "Lass die KI raten" },
];

const AUFGANG_OPTIONEN = [
  { value: "gut", label: "Gut aufgegangen", emoji: "📈" },
  { value: "okay", label: "Okay aufgegangen", emoji: "👌" },
  { value: "kaum", label: "Kaum aufgegangen", emoji: "📉" },
];

const GEFUEHL_OPTIONEN = [
  { value: "luftig", label: "Leicht und luftig", emoji: "☁️" },
  { value: "normal", label: "Normal", emoji: "👍" },
  { value: "schwer", label: "Schwer / feucht", emoji: "🥄" },
];

const KRUME_OPTIONEN = [
  { value: "luftig", label: "Luftig mit Poren", emoji: "🫧" },
  { value: "dicht-fein", label: "Dicht und fein", emoji: "📏" },
  { value: "gummig", label: "Gummig / klitschig", emoji: "🍮" },
  { value: "speck", label: "Speckschicht unten", emoji: "🥓" },
  { value: "risse", label: "Risse / Hohlraeume", emoji: "🕳️" },
];

async function calculateFileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function detectBrotArt(brot) {
  if (!brot) return null;
  const text = `${brot.name || ""} ${brot.flour_types || ""}`.toLowerCase();
  if (text.includes("vollkorn")) return "vollkorn";
  if (text.includes("roggen") && !text.includes("misch")) return "roggen";
  if (text.includes("misch")) return "mischbrot";
  if (text.includes("weiss") || text.includes("weizen") || text.includes("ciabatta") || text.includes("baguette")) return "weissbrot";
  return null;
}

export default function KrumePage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [brote, setBrote] = useState([]);
  const [selectedBrotId, setSelectedBrotId] = useState("");
  const [showBrotPicker, setShowBrotPicker] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPath, setPhotoPath] = useState(null);
  const [preview, setPreview] = useState(null);

  const [brotArt, setBrotArt] = useState("unbekannt");
  const [userAufgang, setUserAufgang] = useState("");
  const [userGefuehl, setUserGefuehl] = useState("");
  const [userKrume, setUserKrume] = useState("");
  const [userScore, setUserScore] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [showAttachUI, setShowAttachUI] = useState(false);
  const [newBrotName, setNewBrotName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadBrote(data.user.id);
    });
  }, []);

  async function loadBrote(userId) {
    const { data } = await supabase
      .from("brote")
      .select("id, name, baked_at, flour_types")
      .eq("user_id", userId)
      .order("baked_at", { ascending: false })
      .limit(20);
    setBrote(data || []);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
    setPhotoPath(null);
  }

  async function uploadPhoto(file) {
    if (!user) return null;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/krume/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (uploadError) throw new Error(uploadError.message);
    return path;
  }

  async function handleAnalyze() {
    if (!photoFile || !user) return;
    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const photoHash = await calculateFileHash(photoFile);

      const { data: existing } = await supabase
        .from("krumen_analysen")
        .select("*")
        .eq("user_id", user.id)
        .eq("photo_hash", photoHash)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let activeBrotArt = brotArt;
      if (selectedBrotId && brotArt === "unbekannt") {
        const brot = brote.find((b) => b.id === selectedBrotId);
        const detected = detectBrotArt(brot);
        if (detected) activeBrotArt = detected;
      }

      if (existing && existing.brot_art === activeBrotArt) {
        setResult({
          ...existing,
          tipps: typeof existing.tipps === "string" ? JSON.parse(existing.tipps || "[]") : (existing.tipps || []),
          isExisting: true,
        });
        setPhotoPath(existing.photo_path);
        setAnalyzing(false);
        return;
      }

      const newPhotoPath = await uploadPhoto(photoFile);
      setPhotoPath(newPhotoPath);

      const { data: signedData } = await supabase.storage
        .from("photos")
        .createSignedUrl(newPhotoPath, 3600);

      const imageRes = await fetch(signedData.signedUrl);
      const blob = await imageRes.blob();
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const userBeobachtungen = {
        aufgang: userAufgang || null,
        gefuehl: userGefuehl || null,
        krume: userKrume || null,
        eigeneNote: userScore ? Number(userScore) : null,
      };

      const apiRes = await fetch("/api/krume-analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: blob.type,
          brotArt: activeBrotArt,
          userBeobachtungen,
        }),
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok) {
        setError(apiData.error || "Analyse fehlgeschlagen");
        setAnalyzing(false);
        return;
      }

      const analysis = apiData.analysis;

      const { data: saved, error: saveError } = await supabase
        .from("krumen_analysen")
        .insert({
          user_id: user.id,
          brot_id: selectedBrotId || null,
          photo_path: newPhotoPath,
          photo_hash: photoHash,
          brot_art: activeBrotArt,
          analysis_text: analysis.zusammenfassung || "",
          porung: analysis.porung || null,
          hydration_estimate: analysis.hydration_estimate || null,
          diagnose: analysis.diagnose || null,
          tipps: JSON.stringify(analysis.tipps || []),
          score: analysis.score || null,
          raw_json: analysis,
          user_aufgang: userBeobachtungen.aufgang,
          user_gefuehl: userBeobachtungen.gefuehl,
          user_krume: userBeobachtungen.krume,
          user_score: userBeobachtungen.eigeneNote,
        })
        .select()
        .single();

      if (saveError) {
        setError(saveError.message);
        setAnalyzing(false);
        return;
      }

      if (selectedBrotId) {
        await supabase
          .from("brote")
          .update({
            krume_analyse_id: saved.id,
            krume_score: analysis.score,
            krume_diagnose: analysis.diagnose,
            krume_tipps: JSON.stringify(analysis.tipps || []),
          })
          .eq("id", selectedBrotId);
      }

      setResult({
        ...saved,
        tipps: analysis.tipps || [],
      });
      setAnalyzing(false);
    } catch (err) {
      setError(err.message || "Etwas ist schiefgelaufen");
      setAnalyzing(false);
    }
  }

  async function attachToExisting(brotId) {
    if (!result) return;
    const tippsArr = typeof result.tipps === "string" ? JSON.parse(result.tipps || "[]") : (result.tipps || []);
    await supabase.from("krumen_analysen").update({ brot_id: brotId }).eq("id", result.id);
    await supabase
      .from("brote")
      .update({
        krume_analyse_id: result.id,
        krume_score: result.score,
        krume_diagnose: result.diagnose,
        krume_tipps: JSON.stringify(tippsArr),
      })
      .eq("id", brotId);
    router.push(`/brote/${brotId}`);
  }

  async function createNewBrot() {
    if (!result || !newBrotName.trim() || !user) return;
    const tippsArr = typeof result.tipps === "string" ? JSON.parse(result.tipps || "[]") : (result.tipps || []);
    const { data: newBrot, error } = await supabase
      .from("brote")
      .insert({
        user_id: user.id,
        name: newBrotName.trim(),
        baked_at: new Date().toISOString().slice(0, 10),
        photo_path: result.photo_path,
        krume_analyse_id: result.id,
        krume_score: result.score,
        krume_diagnose: result.diagnose,
        krume_tipps: JSON.stringify(tippsArr),
      })
      .select()
      .single();
    if (!error) {
      await supabase.from("krumen_analysen").update({ brot_id: newBrot.id }).eq("id", result.id);
      router.push(`/brote/${newBrot.id}`);
    }
  }

  function reset() {
    setPhotoFile(null);
    setPhotoPath(null);
    setPreview(null);
    setResult(null);
    setError("");
    setSelectedBrotId("");
    setBrotArt("unbekannt");
    setUserAufgang("");
    setUserGefuehl("");
    setUserKrume("");
    setUserScore("");
    setShowAttachUI(false);
    setNewBrotName("");
  }

  function getScoreLabel(score) {
    if (!score) return null;
    if (score >= 8) return { emoji: "🏆", text: "Spitzenkrume" };
    if (score >= 6) return { emoji: "👍", text: "Gut gelungen" };
    if (score >= 4) return { emoji: "🌾", text: "Solide" };
    if (score >= 2) return { emoji: "🌱", text: "Da geht noch was" };
    return { emoji: "🤔", text: "Foto unklar" };
  }

  const userScoreNum = userScore ? Number(userScore) : null;
  const aiScoreNum = result?.score ? Number(result.score) : null;
  const scoreDiff = userScoreNum && aiScoreNum ? Math.abs(userScoreNum - aiScoreNum) : 0;
  const bigDisagreement = scoreDiff >= 3;

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="font-display text-3xl text-cocoa-900">Krumenleser</h1>
        <p className="mt-1 text-sm text-cocoa-700/70">
          Foto deines angeschnittenen Brotes hochladen — KI analysiert die Krume.
        </p>
      </div>

      <div className="rounded-2xl border border-honey-500/30 bg-honey-500/10 px-4 py-3">
        <p className="text-xs leading-relaxed text-cocoa-800">
          <strong>Wichtig:</strong> KI-Vision-Modelle koennen Untergare/Uebergare
          oft schlecht erkennen. Deine eigene Einschaetzung ist immer wertvoller —
          die KI ist nur Zweitmeinung. Vertrau deinen Sinnen!
        </p>
      </div>

      {!result && (
        <div className="space-y-5">
          <div className="card space-y-3">
            <label className="label">1. Welche Brot-Art?</label>
            <div className="grid grid-cols-2 gap-2">
              {BROT_ARTEN.map((art) => (
                <button
                  key={art.value}
                  type="button"
                  onClick={() => setBrotArt(art.value)}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    brotArt === art.value
                      ? "border-terra-500 bg-terra-500/10"
                      : "border-mauve-500/25 bg-cream-50 hover:border-terra-500/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{art.emoji}</span>
                    <span className="text-sm font-semibold text-cocoa-800">
                      {art.label}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-cocoa-700/60">
                    {art.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <label className="label">2. Wie ist es aufgegangen? (optional)</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {AUFGANG_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserAufgang(userAufgang === opt.value ? "" : opt.value)}
                    className={`rounded-2xl border p-2 text-center transition-all ${
                      userAufgang === opt.value
                        ? "border-terra-500 bg-terra-500/10"
                        : "border-mauve-500/25 bg-cream-50 hover:border-terra-500/50"
                    }`}
                  >
                    <div className="text-xl">{opt.emoji}</div>
                    <div className="text-[10px] font-semibold text-cocoa-800">
                      {opt.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">3. Wie fuehlt sich das Brot an? (optional)</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {GEFUEHL_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserGefuehl(userGefuehl === opt.value ? "" : opt.value)}
                    className={`rounded-2xl border p-2 text-center transition-all ${
                      userGefuehl === opt.value
                        ? "border-terra-500 bg-terra-500/10"
                        : "border-mauve-500/25 bg-cream-50 hover:border-terra-500/50"
                    }`}
                  >
                    <div className="text-xl">{opt.emoji}</div>
                    <div className="text-[10px] font-semibold text-cocoa-800">
                      {opt.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">4. Wie wirkt die Krume? (optional)</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {KRUME_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserKrume(userKrume === opt.value ? "" : opt.value)}
                    className={`rounded-2xl border p-2 text-left transition-all ${
                      userKrume === opt.value
                        ? "border-terra-500 bg-terra-500/10"
                        : "border-mauve-500/25 bg-cream-50 hover:border-terra-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-xs font-semibold text-cocoa-800">
                        {opt.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="userScore">
                5. Deine eigene Bewertung 1-10 (optional)
              </label>
              <input
                id="userScore"
                type="number"
                inputMode="decimal"
                min="1"
                max="10"
                step="0.5"
                placeholder="z.B. 7"
                className="input mt-1"
                value={userScore}
                onChange={(e) => setUserScore(e.target.value)}
              />
              <p className="mt-1 text-[10px] text-cocoa-700/60">
                Du bist die Baeckerin. Deine Einschaetzung zaehlt!
              </p>
            </div>
          </div>

          {brote.length > 0 && (
            <div className="card">
              <button
                type="button"
                onClick={() => setShowBrotPicker(!showBrotPicker)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-cocoa-800">
                  6. Mit Brot verknuepfen? (optional)
                </span>
                <span className="text-xs text-mauve-700">
                  {showBrotPicker ? "Schliessen" : "Auswaehlen"}
                </span>
              </button>
              {showBrotPicker && (
                <div className="mt-3 space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedBrotId("")}
                    className={`w-full rounded-2xl border p-2 text-left text-xs ${
                      selectedBrotId === ""
                        ? "border-terra-500 bg-terra-500/10"
                        : "border-mauve-500/25 bg-cream-50"
                    }`}
                  >
                    Kein Brot zuordnen
                  </button>
                  {brote.map((brot) => (
                    <button
                      key={brot.id}
                      type="button"
                      onClick={() => setSelectedBrotId(brot.id)}
                      className={`w-full rounded-2xl border p-2 text-left text-xs ${
                        selectedBrotId === brot.id
                          ? "border-terra-500 bg-terra-500/10"
                          : "border-mauve-500/25 bg-cream-50"
                      }`}
                    >
                      <div className="font-semibold text-cocoa-800">{brot.name}</div>
                      <div className="text-[10px] text-cocoa-700/60">
                        {new Date(brot.baked_at).toLocaleDateString("de-DE")}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card">
            <label className="label">7. Foto des Anschnitts</label>
            <div className="mt-2">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Vorschau" className="h-48 w-full rounded-2xl object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPreview(null); }}
                    className="absolute right-2 top-2 rounded-full bg-cream-50/95 px-3 py-1 text-xs font-semibold text-cocoa-800"
                  >
                    Anderes Foto
                  </button>
                </div>
              ) : (
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mauve-500/30 bg-cream-200/30 hover:border-terra-500/50">
                  <span className="text-2xl">📷</span>
                  <span className="text-xs font-semibold text-cocoa-800">Foto hochladen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!photoFile || analyzing}
            className="btn-primary w-full"
          >
            {analyzing ? "KI analysiert ..." : "Krume analysieren"}
          </button>

          {error && (
            <div className="rounded-2xl border border-terra-500/40 bg-terra-500/10 px-4 py-3 text-sm text-terra-700">
              {error}
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {result.isExisting && (
            <div className="rounded-2xl border border-mauve-500/30 bg-mauve-500/10 px-4 py-3 text-xs text-cocoa-800">
              ✨ Bereits analysiert — gespeichertes Ergebnis wird gezeigt.
            </div>
          )}

          {result.photo_path && preview && (
            <img src={preview} alt="Krume" className="h-48 w-full rounded-2xl object-cover shadow-soft" />
          )}

          <div className="grid grid-cols-2 gap-3">
            {(() => {
              const aiLabel = getScoreLabel(result.score);
              const userLabel = getScoreLabel(userScoreNum);
              return (
                <>
                  <div className="card text-center">
                    <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                      KI-Score
                    </div>
                    <div className="mt-1 text-3xl font-bold text-cocoa-900">
                      {result.score ? `${result.score}/10` : "—"}
                    </div>
                    {aiLabel && (
                      <div className="mt-1 text-xs text-cocoa-700">
                        {aiLabel.emoji} {aiLabel.text}
                      </div>
                    )}
                  </div>
                  <div className="card text-center">
                    <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                      Dein Score
                    </div>
                    <div className="mt-1 text-3xl font-bold text-cocoa-900">
                      {userScoreNum ? `${userScoreNum}/10` : "—"}
                    </div>
                    {userLabel && (
                      <div className="mt-1 text-xs text-cocoa-700">
                        {userLabel.emoji} {userLabel.text}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>

          {bigDisagreement && (
            <div className="rounded-2xl border border-terra-500/40 bg-terra-500/10 px-4 py-3">
              <p className="text-xs leading-relaxed text-terra-700">
                <strong>🤔 Du und die KI seid uneinig.</strong> Vertrau deinen
                Sinnen — du hast das Brot in den Haenden, gerochen, geschmeckt.
                Die KI sieht nur das Foto.
              </p>
            </div>
          )}

          {result.diagnose && (
            <div className="card">
              <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                KI-Diagnose
              </div>
              <p className="mt-1 text-sm text-cocoa-800">{result.diagnose}</p>
            </div>
          )}

          {result.analysis_text && (
            <div className="card">
              <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                Was die KI sieht
              </div>
              <p className="mt-1 text-sm leading-relaxed text-cocoa-800">
                {result.analysis_text}
              </p>
            </div>
          )}

          {Array.isArray(result.tipps) && result.tipps.length > 0 && (
            <div className="card">
              <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                Tipps fuer naechstes Mal
              </div>
              <ul className="mt-2 space-y-1">
                {result.tipps.map((tipp, i) => (
                  <li key={i} className="text-sm text-cocoa-800">• {tipp}</li>
                ))}
              </ul>
            </div>
          )}

          {!selectedBrotId && !result.brot_id && !showAttachUI && (
            <div className="card space-y-2">
              <p className="text-sm text-cocoa-800">Mit einem Brot verknuepfen?</p>
              <button
                type="button"
                onClick={() => setShowAttachUI(true)}
                className="btn-primary w-full"
              >
                Ja, zuordnen
              </button>
            </div>
          )}

          {showAttachUI && (
            <div className="card space-y-3">
              <div>
                <label className="label">Als neuen Brot-Eintrag speichern</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Name des Brotes"
                    value={newBrotName}
                    onChange={(e) => setNewBrotName(e.target.value)}
                    className="input"
                  />
                  <button
                    type="button"
                    onClick={createNewBrot}
                    disabled={!newBrotName.trim()}
                    className="btn-primary whitespace-nowrap"
                  >
                    Anlegen
                  </button>
                </div>
              </div>

              {brote.length > 0 && (
                <div>
                  <label className="label">Oder an bestehendes Brot anhaengen</label>
                  <div className="mt-1 space-y-1">
                    {brote.map((brot) => (
                      <button
                        key={brot.id}
                        type="button"
                        onClick={() => attachToExisting(brot.id)}
                        className="w-full rounded-2xl border border-mauve-500/25 bg-cream-50 p-2 text-left text-xs hover:border-terra-500"
                      >
                        <div className="font-semibold text-cocoa-800">{brot.name}</div>
                        <div className="text-[10px] text-cocoa-700/60">
                          {new Date(brot.baked_at).toLocaleDateString("de-DE")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-mauve-500/30 bg-cream-50 px-4 py-3">
            <p className="text-[10px] leading-relaxed text-cocoa-700/70">
              KI-Einschaetzung — kein Profibaecker-Urteil. Bei Untergare/Uebergare
              kann die KI besonders danebenliegen. Vertrau auch deinem Gefuehl. 🥖
            </p>
          </div>

          <button type="button" onClick={reset} className="btn-secondary w-full">
            Neue Analyse starten
          </button>
        </div>
      )}
    </div>
  );
}
