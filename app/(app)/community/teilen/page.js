"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function TeilenPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [brote, setBrote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [savedDisplayName, setSavedDisplayName] = useState("");
  const [openBrot, setOpenBrot] = useState(null);
  const [rezeptDraft, setRezeptDraft] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [ocrId, setOcrId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setLoading(false);
      return;
    }
    setUser(userData.user);

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
      setSavedDisplayName(profile.display_name);
    }

    const { data: broteData } = await supabase
      .from("brote")
      .select("id, name, baked_at, is_shared, rezept_text, krume_score")
      .eq("user_id", userData.user.id)
      .order("baked_at", { ascending: false });

    if (broteData) {
      setBrote(broteData);
      const drafts = {};
      broteData.forEach((b) => {
        drafts[b.id] = b.rezept_text || "";
      });
      setRezeptDraft(drafts);
    }
    setLoading(false);
  }

  async function saveDisplayName() {
    if (!user || !displayName.trim()) return;
    await supabase
      .from("user_profiles")
      .update({ display_name: displayName.trim() })
      .eq("id", user.id);
    setSavedDisplayName(displayName.trim());
    setMessage("Anzeigename gespeichert");
    setTimeout(() => setMessage(""), 2000);
  }

  // Screenshot lesen und in Rezept-Text umwandeln
  async function handleScreenshot(brot, e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setOcrId(brot.id);
    setMessage("");
    try {
      // Datei zu base64
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/rezept-ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Konnte das Rezept nicht lesen");
        setOcrId(null);
        return;
      }

      // Umgewandelten Text ins Textfeld setzen (an evtl. vorhandenen anhaengen)
      setRezeptDraft((prev) => {
        const existing = prev[brot.id]?.trim();
        const combined = existing
          ? existing + "\n\n" + data.rezeptText
          : data.rezeptText;
        return { ...prev, [brot.id]: combined };
      });
      setOpenBrot(brot.id);
      setMessage("Rezept erkannt! Schau drueber und speichere es.");
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setMessage("Fehler: " + err.message);
    }
    setOcrId(null);
  }

  async function toggleShare(brot) {
    if (!user) return;

    if (!brot.is_shared && !savedDisplayName) {
      setMessage("Bitte zuerst einen Anzeigenamen eingeben und speichern");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setSavingId(brot.id);
    const newShared = !brot.is_shared;

    const { error } = await supabase
      .from("brote")
      .update({
        is_shared: newShared,
        shared_at: newShared ? new Date().toISOString() : null,
        rezept_text: rezeptDraft[brot.id]?.trim() || null,
      })
      .eq("id", brot.id);

    if (!error) {
      setBrote((prev) =>
        prev.map((b) =>
          b.id === brot.id
            ? { ...b, is_shared: newShared, rezept_text: rezeptDraft[brot.id] }
            : b
        )
      );
      setMessage(newShared ? "Brot geteilt!" : "Brot ist wieder privat");
      setTimeout(() => setMessage(""), 2000);
    }
    setSavingId(null);
  }

  async function saveRezept(brot) {
    if (!user) return;
    setSavingId(brot.id);
    await supabase
      .from("brote")
      .update({ rezept_text: rezeptDraft[brot.id]?.trim() || null })
      .eq("id", brot.id);
    setBrote((prev) =>
      prev.map((b) =>
        b.id === brot.id ? { ...b, rezept_text: rezeptDraft[brot.id] } : b
      )
    );
    setSavingId(null);
    setMessage("Rezept gespeichert");
    setTimeout(() => setMessage(""), 2000);
  }

  return (
    <div className="space-y-6 pb-8">
      <Link href="/community" className="mini-label">
        ← Zurueck zur Community
      </Link>

      <div>
        <p className="brand-mark">Teilen</p>
        <h1 className="font-display-italic text-display-lg mt-1">
          Deine Brote teilen
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa-700/80">
          Stell ein Brot auf oeffentlich, damit andere es im Community-Feed
          sehen. Du kannst jederzeit wieder auf privat stellen.
        </p>
      </div>

      {/* Anzeigename */}
      <div className="card space-y-3">
        <label className="label">Dein Anzeigename in der Community</label>
        <p className="text-xs text-cocoa-700/70">
          Dieser Name erscheint bei deinen geteilten Broten (nicht deine Email).
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="z.B. Feli"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input"
          />
          <button
            type="button"
            onClick={saveDisplayName}
            disabled={!displayName.trim() || displayName.trim() === savedDisplayName}
            className="btn-primary whitespace-nowrap"
          >
            Speichern
          </button>
        </div>
      </div>

      {message && (
        <div className="border border-gold-500/40 bg-gold-100/40 px-4 py-3 text-sm text-cocoa-800">
          {message}
        </div>
      )}

      {loading ? (
        <div className="card text-center text-sm text-cocoa-700">Laedt ...</div>
      ) : brote.length === 0 ? (
        <div className="card text-center">
          <p className="text-4xl">🍞</p>
          <h2 className="mt-3 font-display-italic text-2xl">Noch keine Brote</h2>
          <p className="mt-2 text-sm text-cocoa-700/70">
            Lege erst ein Brot in deinem Tagebuch an, dann kannst du es teilen.
          </p>
          <Link href="/brote/new" className="btn-primary mt-4 inline-block">
            Brot anlegen
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {brote.map((brot) => (
            <div key={brot.id} className="card space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display-italic text-xl text-cocoa-900">
                    {brot.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-mauve-700">
                    {brot.baked_at
                      ? new Date(brot.baked_at).toLocaleDateString("de-DE")
                      : ""}
                    {brot.krume_score ? ` · Krume ${brot.krume_score}/10` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleShare(brot)}
                  disabled={savingId === brot.id}
                  className={brot.is_shared ? "btn-primary" : "btn-secondary"}
                >
                  {savingId === brot.id
                    ? "..."
                    : brot.is_shared
                    ? "Geteilt ✓"
                    : "Teilen"}
                </button>
              </div>

              {/* Rezept-Bereich */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenBrot(openBrot === brot.id ? null : brot.id)}
                  className="text-mini font-semibold uppercase tracking-widest text-gold-700"
                >
                  {openBrot === brot.id
                    ? "Rezept schliessen"
                    : brot.rezept_text
                    ? "Rezept bearbeiten"
                    : "+ Rezept hinzufuegen"}
                </button>

                {openBrot === brot.id && (
                  <div className="mt-3 space-y-4">
                    {/* Screenshot-Upload mit KI-Umwandlung */}
                    <div className="border border-gold-400/40 bg-gold-100/30 p-3">
                      <p className="label">Rezept aus Screenshot</p>
                      <p className="mt-1 text-xs text-cocoa-700/70">
                        Lade einen Screenshot oder ein Foto deines Rezepts hoch.
                        Der KI-Baecker schreibt es automatisch ab.
                      </p>
                      <label className="mt-2 flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-gold-400/50 bg-cream-50 hover:border-gold-500">
                        <span className="text-2xl">📸</span>
                        <span className="text-xs font-semibold text-cocoa-800">
                          {ocrId === brot.id
                            ? "Der KI-Baecker liest das Rezept ..."
                            : "Screenshot hochladen"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleScreenshot(brot, e)}
                          className="hidden"
                          disabled={ocrId === brot.id}
                        />
                      </label>
                    </div>

                    {/* Textfeld (editierbar - auch nach OCR) */}
                    <div>
                      <label className="label">Rezept-Text</label>
                      <p className="mt-1 text-[10px] text-cocoa-700/60">
                        Hier kannst du das erkannte Rezept noch anpassen oder
                        selbst eintippen.
                      </p>
                      <textarea
                        rows={8}
                        placeholder="Zutaten, Mengen, Schritte ... oder oben einen Screenshot hochladen"
                        value={rezeptDraft[brot.id] || ""}
                        onChange={(e) =>
                          setRezeptDraft({ ...rezeptDraft, [brot.id]: e.target.value })
                        }
                        className="input mt-2 resize-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveRezept(brot)}
                        disabled={savingId === brot.id}
                        className="btn-primary mt-2 w-full"
                      >
                        Rezept speichern
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {brot.is_shared && (
                <span className="chip">Im Community-Feed sichtbar</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
