"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const VOLUMEN_OPTIONEN = [
  { value: "verdoppelt", label: "Verdoppelt", emoji: "📈" },
  { value: "gewachsen", label: "Gewachsen", emoji: "📊" },
  { value: "kaum", label: "Kaum", emoji: "📉" },
];

const BLAESCHEN_OPTIONEN = [
  { value: "viele", label: "Viele", emoji: "🫧" },
  { value: "einige", label: "Einige", emoji: "💧" },
  { value: "wenige", label: "Wenige", emoji: "🌊" },
];

const GERUCH_OPTIONEN = [
  { value: "fruchtig", label: "Fruchtig", emoji: "🍎" },
  { value: "mild", label: "Mild-sauer", emoji: "🍋" },
  { value: "essig", label: "Essig", emoji: "🧪" },
  { value: "neutral", label: "Kaum", emoji: "🌬️" },
];

const KUPPEL_OPTIONEN = [
  { value: "kuppelig", label: "Kuppelig", emoji: "⛰️" },
  { value: "flach", label: "Flach", emoji: "➖" },
  { value: "eingefallen", label: "Eingefallen", emoji: "🕳️" },
];

async function calculateFileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function StarterAnalyseSection({ starter }) {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [userVolumen, setUserVolumen] = useState("");
  const [userBlaeschen, setUserBlaeschen] = useState("");
  const [userGeruch, setUserGeruch] = useState("");
  const [userKuppel, setUserKuppel] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [latestAnalyse, setLatestAnalyse] = useState(null);
  const [latestPhotoUrl, setLatestPhotoUrl] = useState(null);

  useEffect(() => {
    init();
  }, [starter?.id]);

  async function init() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    setUser(userData.user);
    loadLatestAnalyse(userData.user.id);
  }

  async function loadLatestAnalyse(userId) {
    if (!starter?.id) return;
    const { data } = await supabase
      .from("starter_analysen")
      .select("*")
      .eq("user_id", userId)
      .eq("starter_id", starter.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setLatestAnalyse(data);
      if (data.photo_path) {
        const { data: signedData } = await supabase.storage
          .from("photos")
          .createSignedUrl(data.photo_path, 3600);
        if (signedData?.signedUrl) setLatestPhotoUrl(signedData.signedUrl);
      }
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  }

  async function uploadPhoto(file) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/starter-analyse/${Date.now()}.${ext}`;
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

    try {
      const photoHash = await calculateFileHash(photoFile);
      const photoPath = await uploadPhoto(photoFile);

      const { data: signedData } = await supabase.storage
        .from("photos")
        .createSignedUrl(photoPath, 3600);

      const imageRes = await fetch(signedData.signedUrl);
      const blob = await imageRes.blob();
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const userBeobachtungen = {
        volumen: userVolumen || null,
        blaeschen: userBlaeschen || null,
        geruch: userGeruch || null,
        kuppel: userKuppel || null,
      };

      const apiRes = await fetch("/api/starter-analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: blob.type,
          userBeobachtungen,
          starterId: starter.id,
        }),
      });

      const apiData = await apiRes.json();
      if (!apiRes.ok) {
        setError(apiData.error || "Analyse fehlgeschlagen");
        setAnalyzing(false);
        return;
      }

      const analysis = apiData.analysis;

      const { data: saved } = await supabase
        .from("starter_analysen")
        .insert({
          user_id: user.id,
          starter_id: starter.id,
          photo_path: photoPath,
          photo_hash: photoHash,
          bereit_status: analysis.status,
          ki_score: analysis.score,
          ki_begruendung: analysis.begruendung,
          ki_tipps: JSON.stringify(analysis.tipps || []),
          user_volumen: userBeobachtungen.volumen,
          user_blaeschen: userBeobachtungen.blaeschen,
          user_geruch: userBeobachtungen.geruch,
          user_kuppel: userBeobachtungen.kuppel,
          raw_json: analysis,
        })
        .select()
        .single();

      setResult({ ...analysis, _saved: saved });
      setLatestAnalyse(saved);
      setLatestPhotoUrl(preview);
      setAnalyzing(false);
    } catch (err) {
      setError(err.message || "Etwas ist schiefgelaufen");
      setAnalyzing(false);
    }
  }

  function reset() {
    setPhotoFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    setUserVolumen("");
    setUserBlaeschen("");
    setUserGeruch("");
    setUserKuppel("");
  }

  function getStatusStyle(status) {
    const styles = {
      BEREIT: {
        bg: "bg-gold-400/30",
        border: "border-gold-500",
        text: "text-gold-700",
        label: "BACKBEREIT",
        emoji: "🌾",
      },
      BALD: {
        bg: "bg-honey-400/20",
        border: "border-honey-500",
        text: "text-honey-600",
        label: "BALD BEREIT",
        emoji: "⏳",
      },
      NEIN: {
        bg: "bg-cream-200",
        border: "border-cream-300",
        text: "text-cocoa-700",
        label: "NOCH NICHT",
        emoji: "🌱",
      },
      UEBERREIF: {
        bg: "bg-terra-400/20",
        border: "border-terra-500",
        text: "text-terra-700",
        label: "UEBERREIF",
        emoji: "⚠️",
      },
    };
    return styles[status] || styles.NEIN;
  }

  const activeResult = result || latestAnalyse;
  const statusStyle = activeResult?.bereit_status || activeResult?.status
    ? getStatusStyle(activeResult.bereit_status || activeResult.status)
    : null;

  const tippsArr = activeResult?.ki_tipps
    ? typeof activeResult.ki_tipps === "string"
      ? JSON.parse(activeResult.ki_tipps || "[]")
      : activeResult.ki_tipps
    : activeResult?.tipps || [];

  return (
    <div className="space-y-4">
      <div>
        <p className="brand-mark">KI-Baecker</p>
        <h2 className="font-display-italic text-display-md mt-1">
          Ist {starter?.name || "dein Starter"} backbereit?
        </h2>
      </div>

      {/* Status-Banner wenn schon Analyse vorhanden */}
      {activeResult && statusStyle && !photoFile && (
        <div
          className={`border-2 p-6 ${statusStyle.border} ${statusStyle.bg}`}
        >
          <div className="text-center">
            <div className="text-5xl">{statusStyle.emoji}</div>
            <p className={`mini-label mt-2 ${statusStyle.text}`}>
              {statusStyle.label}
            </p>
            {(activeResult.ki_score || activeResult.score) && (
              <div className="mt-3 font-display-italic text-display-lg text-cocoa-900">
                {activeResult.ki_score || activeResult.score}/10
              </div>
            )}
          </div>

          {(activeResult.ki_begruendung || activeResult.begruendung) && (
            <p className="mt-4 text-sm leading-relaxed text-cocoa-800">
              {activeResult.ki_begruendung || activeResult.begruendung}
            </p>
          )}

          {tippsArr.length > 0 && (
            <div className="mt-4 border-t border-cream-300 pt-3">
              <p className="label">Tipps</p>
              <ul className="mt-2 space-y-1">
                {tippsArr.map((tipp, i) => (
                  <li key={i} className="text-xs text-cocoa-800">• {tipp}</li>
                ))}
              </ul>
            </div>
          )}

          {latestPhotoUrl && (
            <img
              src={latestPhotoUrl}
              alt="Starter"
              className="mt-4 h-32 w-full object-cover"
            />
          )}

          {activeResult.created_at && (
            <p className="mt-3 text-center text-[10px] text-cocoa-700/60">
              Analyse vom{" "}
              {new Date(activeResult.created_at).toLocaleString("de-DE", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      )}

      {/* Wenn schon Analyse aber neue starten */}
      {activeResult && !photoFile && (
        <button
          type="button"
          onClick={() => { reset(); setResult(null); setLatestAnalyse(null); }}
          className="btn-secondary w-full"
        >
          Neue Analyse starten
        </button>
      )}

      {/* Keine bisherige Analyse - Eingabe-Form */}
      {(!activeResult || photoFile) && (
        <div className="space-y-4">
          <div className="border border-honey-500/40 bg-honey-500/10 px-4 py-3">
            <p className="text-xs leading-relaxed text-cocoa-800">
              Mach ein Foto deines Starters und gib uns ein paar Hinweise.
              Der KI-Baecker schaetzt dann, ob er backbereit ist.
            </p>
          </div>

          {/* Foto Upload */}
          <div className="card">
            <label className="label">Foto vom Starter</label>
            <div className="mt-2">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Vorschau" className="h-48 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPreview(null); }}
                    className="absolute right-2 top-2 bg-cream-50/95 px-3 py-1 text-xs font-semibold text-cocoa-800"
                  >
                    Anderes Foto
                  </button>
                </div>
              ) : (
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-cream-300 bg-cream-100/50 hover:border-gold-500/50">
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

          {/* User-Beobachtungen */}
          <div className="card space-y-4">
            <p className="label">Deine Beobachtungen (optional, aber hilft sehr!)</p>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-mauve-700">Volumen</label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {VOLUMEN_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserVolumen(userVolumen === opt.value ? "" : opt.value)}
                    className={`border p-2 text-center transition-all ${
                      userVolumen === opt.value
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="text-lg">{opt.emoji}</div>
                    <div className="text-[10px] font-semibold text-cocoa-800">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-mauve-700">Blaeschen</label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {BLAESCHEN_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserBlaeschen(userBlaeschen === opt.value ? "" : opt.value)}
                    className={`border p-2 text-center transition-all ${
                      userBlaeschen === opt.value
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="text-lg">{opt.emoji}</div>
                    <div className="text-[10px] font-semibold text-cocoa-800">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-mauve-700">Geruch</label>
              <div className="mt-1 grid grid-cols-4 gap-2">
                {GERUCH_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserGeruch(userGeruch === opt.value ? "" : opt.value)}
                    className={`border p-2 text-center transition-all ${
                      userGeruch === opt.value
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="text-lg">{opt.emoji}</div>
                    <div className="text-[10px] font-semibold text-cocoa-800">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-mauve-700">Form</label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {KUPPEL_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserKuppel(userKuppel === opt.value ? "" : opt.value)}
                    className={`border p-2 text-center transition-all ${
                      userKuppel === opt.value
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="text-lg">{opt.emoji}</div>
                    <div className="text-[10px] font-semibold text-cocoa-800">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!photoFile || analyzing}
            className="btn-primary w-full"
          >
            {analyzing ? "Der KI-Baecker prueft ..." : "Vom KI-Baecker pruefen lassen"}
          </button>

          {error && (
            <div className="border border-terra-500/40 bg-terra-400/10 px-4 py-3 text-sm text-terra-700">
              {error}
            </div>
          )}

          <p className="text-center text-[10px] text-cocoa-700/60">
            Max. 3 Analysen pro Tag. Vertrau auch deinem Bauchgefuehl 🌾
          </p>
        </div>
      )}
    </div>
  );
}
