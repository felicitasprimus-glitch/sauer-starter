"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { findProblemByDiagnose } from "@/lib/fehlerfinder-data";
import { useLang } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const BROT_ARTEN = [
  { value: "vollkorn", labelKey: "krume.art.vollkorn", emoji: "🌾", descKey: "krume.art.vollkornD" },
  { value: "weissbrot", labelKey: "krume.art.weissbrot", emoji: "🍞", descKey: "krume.art.weissbrotD" },
  { value: "mischbrot", labelKey: "krume.art.mischbrot", emoji: "🥖", descKey: "krume.art.mischbrotD" },
  { value: "roggen", labelKey: "krume.art.roggen", emoji: "🌑", descKey: "krume.art.roggenD" },
  { value: "unbekannt", labelKey: "krume.art.unbekannt", emoji: "❓", descKey: "krume.art.unbekanntD" },
];

const AUFGANG_OPTIONEN = [
  { value: "gut", labelKey: "krume.auf.gut", emoji: "📈" },
  { value: "okay", labelKey: "krume.auf.okay", emoji: "👌" },
  { value: "kaum", labelKey: "krume.auf.kaum", emoji: "📉" },
];

const GEFUEHL_OPTIONEN = [
  { value: "luftig", labelKey: "krume.feel.luftig", emoji: "☁️" },
  { value: "normal", labelKey: "krume.feel.normal", emoji: "👍" },
  { value: "schwer", labelKey: "krume.feel.schwer", emoji: "🥄" },
];

const KRUME_OPTIONEN = [
  { value: "luftig", labelKey: "krume.cr.luftig", emoji: "🫧" },
  { value: "dicht-fein", labelKey: "krume.cr.dichtfein", emoji: "📏" },
  { value: "gummig", labelKey: "krume.cr.gummig", emoji: "🍮" },
  { value: "speck", labelKey: "krume.cr.speck", emoji: "🥓" },
  { value: "risse", labelKey: "krume.cr.risse", emoji: "🕳️" },
];

const HYDRATION_OPTIONEN = [
  { value: "unter65", labelKey: "krume.hyd.unter65", descKey: "krume.hyd.unter65D" },
  { value: "65-70", labelKey: "krume.hyd.6570", descKey: "krume.hyd.6570D" },
  { value: "70-75", labelKey: "krume.hyd.7075", descKey: "krume.hyd.7075D" },
  { value: "75-80", labelKey: "krume.hyd.7580", descKey: "krume.hyd.7580D" },
  { value: "ueber80", labelKey: "krume.hyd.ueber80", descKey: "krume.hyd.ueber80D" },
  { value: "weissnicht", labelKey: "krume.hyd.weissnicht", descKey: "krume.hyd.weissnichtD" },
];

const DATE_LOCALE = { de: "de-DE", en: "en-US", es: "es-ES" };

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
  const { t, lang } = useLang();

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
  const [userOpenCrumb, setUserOpenCrumb] = useState("");
  const [userHydration, setUserHydration] = useState("");
  const [userScore, setUserScore] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [showAttachUI, setShowAttachUI] = useState(false);
  const [newBrotName, setNewBrotName] = useState("");

  const [pastAnalysen, setPastAnalysen] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [loadingPast, setLoadingPast] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
        openCrumb: userOpenCrumb || null,
        hydration: userHydration || null,
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
        setError(apiData.error || t("krume.analyzeFailed"));
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
      setError(err.message || t("comm.genericError"));
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
    setUserOpenCrumb("");
    setUserHydration("");
    setUserScore("");
    setShowAttachUI(false);
    setNewBrotName("");
    setShowPast(false);
  }

  async function loadPastAnalysen() {
    if (!user) return;
    setLoadingPast(true);
    const { data } = await supabase
      .from("krumen_analysen")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    const list = data || [];
    const withUrls = await Promise.all(
      list.map(async (a) => {
        if (!a.photo_path) return { ...a, thumbUrl: null };
        const { data: signed } = await supabase.storage
          .from("photos")
          .createSignedUrl(a.photo_path, 3600);
        return { ...a, thumbUrl: signed?.signedUrl || null };
      })
    );
    setPastAnalysen(withUrls);
    setLoadingPast(false);
  }

  function togglePast() {
    const next = !showPast;
    setShowPast(next);
    if (next) loadPastAnalysen();
  }

  function openPastAnalyse(a) {
    setResult({
      ...a,
      tipps: typeof a.tipps === "string" ? JSON.parse(a.tipps || "[]") : (a.tipps || []),
      isExisting: true,
    });
    setPreview(a.thumbUrl || null);
    setPhotoPath(a.photo_path || null);
    setUserScore(a.user_score != null ? String(a.user_score) : "");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteAnalyse(a) {
    if (!a?.id) return;
    if (!window.confirm(t("krume.confirmDelete"))) return;
    setDeletingId(a.id);
    try {
      // Falls die Analyse mit einem Brot verknuepft ist: Verknuepfung loesen
      await supabase
        .from("brote")
        .update({
          krume_analyse_id: null,
          krume_score: null,
          krume_diagnose: null,
          krume_tipps: null,
        })
        .eq("krume_analyse_id", a.id);
      // Analyse-Eintrag loeschen (Foto im Speicher bleibt erhalten)
      const { error: delError } = await supabase
        .from("krumen_analysen")
        .delete()
        .eq("id", a.id);
      if (delError) throw new Error(delError.message);
      // Liste sofort aktualisieren
      setPastAnalysen((prev) => prev.filter((x) => x.id !== a.id));
      // Falls die geloeschte gerade angezeigt wird: Ansicht zuruecksetzen
      if (result?.id === a.id) reset();
    } catch (err) {
      setError(err.message || t("krume.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  }

  function getScoreLabel(score) {
    if (!score) return null;
    if (score >= 8) return { emoji: "🏆", text: t("krume.scoreTop") };
    if (score >= 6) return { emoji: "👍", text: t("krume.scoreGood") };
    if (score >= 4) return { emoji: "🌾", text: t("krume.scoreSolid") };
    if (score >= 2) return { emoji: "🌱", text: t("krume.scoreMore") };
    return { emoji: "🤔", text: t("krume.scoreUnclear") };
  }

  const userScoreNum = userScore ? Number(userScore) : null;
  const aiScoreNum = result?.score ? Number(result.score) : null;
  const scoreDiff = userScoreNum && aiScoreNum ? Math.abs(userScoreNum - aiScoreNum) : 0;
  const bigDisagreement = scoreDiff >= 3;

  const matchedProblem = result ? findProblemByDiagnose(
    `${result.diagnose || ""} ${result.analysis_text || ""} ${userKrume || ""}`
  ) : null;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-end">
        <LanguageSwitcher variant="light" />
      </div>
      <div>
        {/* HERO BANNER (zeigt Verlauf, solange kein krume-hero.jpg da ist) */}
        <div
          className="h-[170px] overflow-hidden rounded-[24px]"
          style={{
            backgroundImage:
              "url(/krume-hero.jpg), linear-gradient(135deg, #8b6a7d 0%, #5a3f56 100%)",
            backgroundSize: "cover, cover",
            backgroundPosition: "center, center",
          }}
        />
        <div className="mt-4 text-center">
          <h1 className="font-display text-[30px] font-semibold text-brombeer">
            {t("krume.title")}
          </h1>
          <p className="mx-auto mt-1 max-w-xs text-[13px] leading-relaxed text-muted">
            {t("krume.subtitle")}
          </p>
        </div>
      </div>

      <div className="border border-honey-500/40 bg-honey-500/10 px-4 py-3">
        <p className="text-xs leading-relaxed text-cocoa-800">
          <strong>{t("krume.warnLabel")}</strong> {t("krume.warnText")}
        </p>
      </div>

      {!result && (
        <div className="space-y-5">
          <div className="card space-y-3">
            <label className="label">{t("krume.step1")}</label>
            <div className="grid grid-cols-2 gap-2">
              {BROT_ARTEN.map((art) => (
                <button
                  key={art.value}
                  type="button"
                  onClick={() => setBrotArt(art.value)}
                  className={`border p-3 text-left transition-all ${
                    brotArt === art.value
                      ? "border-gold-500 bg-gold-100/40"
                      : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{art.emoji}</span>
                    <span className="text-sm font-semibold text-cocoa-800">
                      {t(art.labelKey)}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-cocoa-700/60">
                    {t(art.descKey)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <label className="label">{t("krume.step2")}</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {AUFGANG_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserAufgang(userAufgang === opt.value ? "" : opt.value)}
                    className={`border p-2 text-center transition-all ${
                      userAufgang === opt.value
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="text-xl">{opt.emoji}</div>
                    <div className="text-[10px] font-semibold text-cocoa-800">
                      {t(opt.labelKey)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">{t("krume.step3")}</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {GEFUEHL_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserGefuehl(userGefuehl === opt.value ? "" : opt.value)}
                    className={`border p-2 text-center transition-all ${
                      userGefuehl === opt.value
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="text-xl">{opt.emoji}</div>
                    <div className="text-[10px] font-semibold text-cocoa-800">
                      {t(opt.labelKey)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">{t("krume.step4")}</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {KRUME_OPTIONEN.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setUserKrume(userKrume === opt.value ? "" : opt.value)}
                    className={`border p-2 text-left transition-all ${
                      userKrume === opt.value
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-xs font-semibold text-cocoa-800">
                        {t(opt.labelKey)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Open-Crumb-Angabe */}
              <div className="mt-3 border-t border-cream-300 pt-3">
                <label className="label">{t("krume.openCrumbLabel")}</label>
                <p className="mt-1 text-[10px] text-cocoa-700/60">
                  {t("krume.openCrumbHint")}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setUserOpenCrumb(userOpenCrumb === "ja" ? "" : "ja")
                    }
                    className={`border p-2 text-left transition-all ${
                      userOpenCrumb === "ja"
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🫧</span>
                      <span className="text-xs font-semibold text-cocoa-800">
                        {t("krume.openCrumbYes")}
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUserOpenCrumb(userOpenCrumb === "nein" ? "" : "nein")
                    }
                    className={`border p-2 text-left transition-all ${
                      userOpenCrumb === "nein"
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍞</span>
                      <span className="text-xs font-semibold text-cocoa-800">
                        {t("krume.openCrumbNo")}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Hydration-Angabe */}
              <div className="mt-3 border-t border-cream-300 pt-3">
                <label className="label">{t("krume.hydLabel")}</label>
                <p className="mt-1 text-[10px] text-cocoa-700/60">
                  {t("krume.hydHint")}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {HYDRATION_OPTIONEN.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setUserHydration(userHydration === opt.value ? "" : opt.value)
                      }
                      className={`border p-2 text-center transition-all ${
                        userHydration === opt.value
                          ? "border-gold-500 bg-gold-100/40"
                          : "border-cream-300 bg-cream-50 hover:border-gold-400/50"
                      }`}
                    >
                      <div className="text-xs font-semibold text-cocoa-800">
                        {t(opt.labelKey)}
                      </div>
                      <div className="text-[9px] text-cocoa-700/60">{t(opt.descKey)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="userScore">
                {t("krume.step5")}
              </label>
              <input
                id="userScore"
                type="number"
                inputMode="decimal"
                min="1"
                max="10"
                step="0.5"
                placeholder={t("krume.scorePlaceholder")}
                className="input mt-1"
                value={userScore}
                onChange={(e) => setUserScore(e.target.value)}
              />
              <p className="mt-1 text-[10px] text-cocoa-700/60">
                {t("krume.scoreHint")}
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
                  {t("krume.step6")}
                </span>
                <span className="text-xs text-mauve-700">
                  {showBrotPicker ? t("krume.close") : t("krume.choose")}
                </span>
              </button>
              {showBrotPicker && (
                <div className="mt-3 space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedBrotId("")}
                    className={`w-full border p-2 text-left text-xs ${
                      selectedBrotId === ""
                        ? "border-gold-500 bg-gold-100/40"
                        : "border-cream-300 bg-cream-50"
                    }`}
                  >
                    {t("krume.noBrot")}
                  </button>
                  {brote.map((brot) => (
                    <button
                      key={brot.id}
                      type="button"
                      onClick={() => setSelectedBrotId(brot.id)}
                      className={`w-full border p-2 text-left text-xs ${
                        selectedBrotId === brot.id
                          ? "border-gold-500 bg-gold-100/40"
                          : "border-cream-300 bg-cream-50"
                      }`}
                    >
                      <div className="font-semibold text-cocoa-800">{brot.name}</div>
                      <div className="text-[10px] text-cocoa-700/60">
                        {new Date(brot.baked_at).toLocaleDateString(DATE_LOCALE[lang] || "de-DE")}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card">
            <label className="label">{t("krume.step7")}</label>
            <div className="mt-2">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt={t("krume.previewAlt")} className="h-48 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPreview(null); }}
                    className="absolute right-2 top-2 bg-cream-50/95 px-3 py-1 text-xs font-semibold text-cocoa-800"
                  >
                    {t("krume.otherPhoto")}
                  </button>
                </div>
              ) : (
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-cream-300 bg-cream-100/50 hover:border-gold-500/50">
                  <span className="text-2xl">📷</span>
                  <span className="text-xs font-semibold text-cocoa-800">{t("krume.uploadPhoto")}</span>
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
            {analyzing ? t("krume.analyzing") : t("krume.analyzeBtn")}
          </button>

          {error && (
            <div className="border border-terra-500/40 bg-terra-400/10 px-4 py-3 text-sm text-terra-700">
              {error}
            </div>
          )}

          <div className="card">
            <button
              type="button"
              onClick={togglePast}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-cocoa-800">
                {t("krume.pastTitle")}
              </span>
              <span className="text-xs text-mauve-700">
                {showPast ? t("krume.close") : t("krume.show")}
              </span>
            </button>

            {showPast && (
              <div className="mt-3 space-y-2">
                {loadingPast && (
                  <p className="text-xs text-cocoa-700/60">{t("krume.loadingPast")}</p>
                )}
                {!loadingPast && pastAnalysen.length === 0 && (
                  <p className="text-xs text-cocoa-700/60">
                    {t("krume.noPast")}
                  </p>
                )}
                {pastAnalysen.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 border border-cream-300 bg-cream-50 p-2"
                  >
                    {a.thumbUrl ? (
                      <img
                        src={a.thumbUrl}
                        alt={t("krume.krumeAlt")}
                        className="h-14 w-14 flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center bg-cream-300 text-lg">
                        🍞
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => openPastAnalyse(a)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="truncate text-xs font-semibold text-cocoa-800">
                        {a.diagnose || t("krume.analyseFallback")}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px] text-cocoa-700/60">
                        <span>{a.score ? `${a.score}/10` : "—"}</span>
                        {a.porung && <span>• {a.porung}</span>}
                        {a.created_at && (
                          <span>
                            • {new Date(a.created_at).toLocaleDateString(DATE_LOCALE[lang] || "de-DE")}
                          </span>
                        )}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAnalyse(a)}
                      disabled={deletingId === a.id}
                      className="flex-shrink-0 px-2 py-1 text-[10px] font-semibold text-terra-700 hover:opacity-70"
                    >
                      {deletingId === a.id ? "..." : t("krume.deleteShort")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div>
            <p className="brand-mark">{t("krume.ratingLabel")}</p>
            <h2 className="font-display-italic text-display-md mt-1">
              {result.diagnose || t("krume.yourCrumb")}
            </h2>
          </div>

          {result.isExisting && (
            <div className="border border-mauve-500/30 bg-mauve-500/10 px-4 py-3 text-xs text-cocoa-800">
              {t("krume.existingNote")}
            </div>
          )}

          {result.photo_path && preview && (
            <img src={preview} alt={t("krume.krumeAlt")} className="h-48 w-full object-cover" />
          )}

          <div className="grid grid-cols-2 gap-3">
            {(() => {
              const aiLabel = getScoreLabel(result.score);
              const userLabel = getScoreLabel(userScoreNum);
              return (
                <>
                  <div className="card text-center">
                    <div className="label">{t("krume.aiCol")}</div>
                    <div className="mt-1 font-display-italic text-4xl font-bold text-cocoa-900">
                      {result.score ? `${result.score}/10` : "—"}
                    </div>
                    {aiLabel && (
                      <div className="mt-1 text-xs text-cocoa-700">
                        {aiLabel.emoji} {aiLabel.text}
                      </div>
                    )}
                  </div>
                  <div className="card text-center">
                    <div className="label">{t("krume.youCol")}</div>
                    <div className="mt-1 font-display-italic text-4xl font-bold text-cocoa-900">
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
            <div className="border border-terra-500/40 bg-terra-400/10 px-4 py-3">
              <p className="text-xs leading-relaxed text-terra-700">
                <strong>{t("krume.disagreeBold")}</strong> {t("krume.disagreeText")}
              </p>
            </div>
          )}

          {result.analysis_text && (
            <div className="card">
              <div className="label">{t("krume.sees")}</div>
              <p className="mt-2 text-sm leading-relaxed text-cocoa-800">
                {result.analysis_text}
              </p>
              {(result.porung || result.hydration_estimate) && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-cream-300 pt-3">
                  {result.porung && (
                    <span className="chip">{t("krume.porungLabel")}: {result.porung}</span>
                  )}
                  {result.hydration_estimate && (
                    <span className="chip">{t("krume.hydrationLabel")}: {result.hydration_estimate}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {Array.isArray(result.tipps) && result.tipps.length > 0 && (
            <div className="card">
              <div className="label">{t("krume.tippsLabel")}</div>
              <ul className="mt-2 space-y-1">
                {result.tipps.map((tipp, i) => (
                  <li key={i} className="text-sm text-cocoa-800">• {tipp}</li>
                ))}
              </ul>
            </div>
          )}

          {matchedProblem && (
            <Link
              href={`/fehlerfinder?problem=${matchedProblem.id}`}
              className="block border-2 border-gold-500 bg-gold-100/30 p-4 transition-all hover:shadow-glow"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{matchedProblem.emoji}</div>
                <div className="flex-1">
                  <div className="label text-gold-700">{t("krume.deeper")}</div>
                  <div className="font-display-italic text-base text-cocoa-900">
                    {t("krume.fehlerfinderPrefix")} {matchedProblem.titel}
                  </div>
                </div>
                <div className="text-mauve-700">→</div>
              </div>
            </Link>
          )}

          {!selectedBrotId && !result.brot_id && !showAttachUI && (
            <div className="card space-y-2">
              <p className="text-sm text-cocoa-800">{t("krume.linkBreadQ")}</p>
              <button
                type="button"
                onClick={() => setShowAttachUI(true)}
                className="btn-primary w-full"
              >
                {t("krume.yesAssign")}
              </button>
            </div>
          )}

          {showAttachUI && (
            <div className="card space-y-3">
              <div>
                <label className="label">{t("krume.saveNewLabel")}</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder={t("krume.breadNamePlaceholder")}
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
                    {t("krume.create")}
                  </button>
                </div>
              </div>

              {brote.length > 0 && (
                <div>
                  <label className="label">{t("krume.attachExisting")}</label>
                  <div className="mt-1 space-y-1">
                    {brote.map((brot) => (
                      <button
                        key={brot.id}
                        type="button"
                        onClick={() => attachToExisting(brot.id)}
                        className="w-full border border-cream-300 bg-cream-50 p-2 text-left text-xs hover:border-gold-400"
                      >
                        <div className="font-semibold text-cocoa-800">{brot.name}</div>
                        <div className="text-[10px] text-cocoa-700/60">
                          {new Date(brot.baked_at).toLocaleDateString(DATE_LOCALE[lang] || "de-DE")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border border-cream-300 bg-cream-100 px-4 py-3">
            <p className="text-[10px] leading-relaxed text-cocoa-700/70">
              {t("krume.disclaimer")}
            </p>
          </div>

          <button type="button" onClick={reset} className="btn-secondary w-full">
            {t("krume.newAnalysis")}
          </button>

          {result.id && (
            <button
              type="button"
              onClick={() => deleteAnalyse(result)}
              disabled={deletingId === result.id}
              className="w-full px-4 py-2 text-xs font-semibold text-terra-700 hover:opacity-70"
            >
              {deletingId === result.id ? t("krume.deleting") : t("krume.deleteThis")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
