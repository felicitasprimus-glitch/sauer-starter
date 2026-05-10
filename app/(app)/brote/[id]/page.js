"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { findProblemByDiagnose } from "@/lib/fehlerfinder-data";

export default function BrotDetailPage({ params }) {
  const router = useRouter();
  const supabase = createClient();
  const brotId = params.id;

  const [brot, setBrot] = useState(null);
  const [krumeAnalyse, setKrumeAnalyse] = useState(null);
  const [brotPhotoUrl, setBrotPhotoUrl] = useState(null);
  const [krumePhotoUrl, setKrumePhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", baked_at: "", flour_types: "", notes: "" });

  useEffect(() => {
    loadBrot();
  }, [brotId]);

  async function loadBrot() {
    setLoading(true);

    const { data: brotData, error } = await supabase
      .from("brote")
      .select("*")
      .eq("id", brotId)
      .single();

    console.log("BROT DEBUG:", { brotId, brotData, error });

    if (error || !brotData) {
      setLoading(false);
      return;
    }

    setBrot(brotData);
    setForm({
      name: brotData.name || "",
      baked_at: brotData.baked_at || "",
      flour_types: brotData.flour_types || "",
      notes: brotData.notes || "",
    });

    // Brot-Foto Signed URL
    if (brotData.photo_path) {
      const { data: signedBrot } = await supabase.storage
        .from("photos")
        .createSignedUrl(brotData.photo_path, 3600);
      if (signedBrot?.signedUrl) setBrotPhotoUrl(signedBrot.signedUrl);
    }

    // Krume-Analyse laden wenn verknuepft
    if (brotData.krume_analyse_id) {
      const { data: krumeData, error: krumeError } = await supabase
        .from("krumen_analysen")
        .select("*")
        .eq("id", brotData.krume_analyse_id)
        .single();

      console.log("KRUME DEBUG:", {
        krumeAnalyseId: brotData.krume_analyse_id,
        krumeData,
        krumeError,
      });

      if (krumeData) {
        setKrumeAnalyse(krumeData);

        // Krume-Foto Signed URL
        if (krumeData.photo_path) {
          const { data: signedKrume } = await supabase.storage
            .from("photos")
            .createSignedUrl(krumeData.photo_path, 3600);
          if (signedKrume?.signedUrl) setKrumePhotoUrl(signedKrume.signedUrl);
        }
      }
    } else {
      console.log("KRUME DEBUG: keine krume_analyse_id auf diesem Brot");
    }

    setLoading(false);
  }

  async function saveEdit() {
    await supabase
      .from("brote")
      .update({
        name: form.name.trim(),
        baked_at: form.baked_at,
        flour_types: form.flour_types.trim() || null,
        notes: form.notes.trim() || null,
      })
      .eq("id", brotId);
    setEditing(false);
    loadBrot();
  }

  async function deleteBrot() {
    if (!confirm("Brot wirklich loeschen? Foto bleibt erhalten falls eine Krumen-Analyse drauf zeigt.")) return;
    // Verknuepfung zur Krumen-Analyse loesen (Analyse selbst bleibt)
    if (brot?.krume_analyse_id) {
      await supabase
        .from("krumen_analysen")
        .update({ brot_id: null })
        .eq("id", brot.krume_analyse_id);
    }
    await supabase.from("brote").delete().eq("id", brotId);
    router.push("/brote");
  }

  function getScoreEmoji(score) {
    if (!score) return "🤔";
    if (score >= 8) return "🏆";
    if (score >= 6) return "👍";
    if (score >= 4) return "🌾";
    if (score >= 2) return "🌱";
    return "🤔";
  }

  if (loading) {
    return (
      <div className="card text-center text-sm text-cocoa-700">Laedt ...</div>
    );
  }

  if (!brot) {
    return (
      <div className="card text-center">
        <p className="text-sm text-cocoa-700">Brot nicht gefunden.</p>
        <Link href="/brote" className="btn-primary mt-3 inline-block">
          Zurueck zur Liste
        </Link>
      </div>
    );
  }

  // Tipps parsen
  const krumeTippsArr = krumeAnalyse?.tipps
    ? typeof krumeAnalyse.tipps === "string"
      ? JSON.parse(krumeAnalyse.tipps || "[]")
      : krumeAnalyse.tipps
    : brot.krume_tipps
    ? typeof brot.krume_tipps === "string"
      ? JSON.parse(brot.krume_tipps || "[]")
      : brot.krume_tipps
    : [];

  // Fallback fuer score/diagnose: nutze brot-felder wenn analyse nicht geladen
  const score = krumeAnalyse?.score ?? brot.krume_score;
  const diagnose = krumeAnalyse?.diagnose ?? brot.krume_diagnose;
  const matchedProblem = diagnose ? findProblemByDiagnose(diagnose) : null;

  return (
    <div className="space-y-5 pb-8">
      <Link href="/brote" className="text-xs uppercase tracking-wider text-mauve-700">
        ← Alle Brote
      </Link>

      {!editing ? (
        <>
          <div>
            <h1 className="font-display text-3xl text-cocoa-900">{brot.name}</h1>
            <p className="mt-1 text-sm text-cocoa-700/70">
              Gebacken am {new Date(brot.baked_at).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {brotPhotoUrl && (
            <img
              src={brotPhotoUrl}
              alt={brot.name}
              className="h-64 w-full rounded-2xl object-cover shadow-soft"
            />
          )}

          {brot.flour_types && (
            <div className="card">
              <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                Mehle
              </div>
              <p className="mt-1 text-sm text-cocoa-900">{brot.flour_types}</p>
            </div>
          )}

          {brot.notes && (
            <div className="card">
              <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                Notizen
              </div>
              <p className="mt-1 text-sm leading-relaxed text-cocoa-800">{brot.notes}</p>
            </div>
          )}

          {/* KRUMEN-ANALYSE SEKTION */}
          {brot.krume_analyse_id || score ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-cocoa-900">
                  Krumen-Analyse
                </h2>
                <Link
                  href="/krume/verlauf"
                  className="text-[10px] uppercase tracking-wider text-mauve-700"
                >
                  Verlauf →
                </Link>
              </div>

              {krumePhotoUrl && (
                <img
                  src={krumePhotoUrl}
                  alt="Krume"
                  className="h-56 w-full rounded-2xl object-cover shadow-soft"
                />
              )}

              {score && (
                <div className="card text-center">
                  <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                    Score
                  </div>
                  <div className="mt-1 text-4xl font-bold text-cocoa-900">
                    {score}/10
                  </div>
                  <div className="mt-1 text-2xl">{getScoreEmoji(score)}</div>
                  {krumeAnalyse?.user_score && (
                    <div className="mt-2 text-xs text-cocoa-700/70">
                      Deine Einschaetzung: {krumeAnalyse.user_score}/10
                    </div>
                  )}
                </div>
              )}

              {diagnose && (
                <div className="card">
                  <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                    Diagnose
                  </div>
                  <p className="mt-1 text-sm text-cocoa-900">{diagnose}</p>
                </div>
              )}

              {krumeAnalyse?.analysis_text && (
                <div className="card">
                  <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                    Was die KI sieht
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-cocoa-800">
                    {krumeAnalyse.analysis_text}
                  </p>
                </div>
              )}

              {krumeTippsArr.length > 0 && (
                <div className="card">
                  <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                    Tipps fuer naechstes Mal
                  </div>
                  <ul className="mt-2 space-y-1">
                    {krumeTippsArr.map((tipp, i) => (
                      <li key={i} className="text-sm text-cocoa-800">
                        • {tipp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {matchedProblem && (
                <Link
                  href={`/fehlerfinder?problem=${matchedProblem.id}`}
                  className="block rounded-2xl border-2 border-mauve-500/40 bg-gradient-to-br from-mauve-500/10 to-terra-500/5 p-4 transition-all hover:border-mauve-500/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{matchedProblem.emoji}</div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-mauve-700">
                        Tiefer eintauchen
                      </div>
                      <div className="text-sm font-semibold text-cocoa-900">
                        Fehlerfinder: {matchedProblem.titel}
                      </div>
                    </div>
                    <div className="text-mauve-700">→</div>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div className="card text-center">
              <p className="text-2xl">🔬</p>
              <p className="mt-2 text-sm text-cocoa-700">
                Noch keine Krumen-Analyse fuer dieses Brot.
              </p>
              <Link href="/krume" className="btn-primary mt-3 inline-block">
                Krume analysieren
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="btn-secondary"
            >
              Bearbeiten
            </button>
            <button
              type="button"
              onClick={deleteBrot}
              className="rounded-2xl border border-terra-500/30 bg-terra-500/5 px-4 py-2 text-sm text-terra-700 hover:bg-terra-500/15"
            >
              Loeschen
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <h2 className="font-display text-2xl text-cocoa-900">Brot bearbeiten</h2>

          <div>
            <label className="label" htmlFor="edit-name">Name</label>
            <input
              id="edit-name"
              type="text"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="edit-baked">Backdatum</label>
            <input
              id="edit-baked"
              type="date"
              className="input"
              value={form.baked_at}
              onChange={(e) => setForm({ ...form, baked_at: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="edit-flour">Mehle</label>
            <input
              id="edit-flour"
              type="text"
              className="input"
              placeholder="z.B. Weizen 550, Roggen Vollkorn"
              value={form.flour_types}
              onChange={(e) => setForm({ ...form, flour_types: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="edit-notes">Notizen</label>
            <textarea
              id="edit-notes"
              rows={3}
              className="input resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
              Abbrechen
            </button>
            <button type="button" onClick={saveEdit} className="btn-primary">
              Speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
