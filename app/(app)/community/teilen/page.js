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

    // Anzeigename laden
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
      setSavedDisplayName(profile.display_name);
    }

    // Eigene Brote laden
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

  async function toggleShare(brot) {
    if (!user) return;

    // Vor dem ersten Teilen muss ein Anzeigename da sein
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

      {/* Brote-Liste */}
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
                  className={
                    brot.is_shared ? "btn-primary" : "btn-secondary"
                  }
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
                  onClick={() =>
                    setOpenBrot(openBrot === brot.id ? null : brot.id)
                  }
                  className="text-mini font-semibold uppercase tracking-widest text-gold-700"
                >
                  {openBrot === brot.id
                    ? "Rezept schliessen"
                    : brot.rezept_text
                    ? "Rezept bearbeiten"
                    : "+ Rezept hinzufuegen"}
                </button>

                {openBrot === brot.id && (
                  <div className="mt-2 space-y-2">
                    <textarea
                      rows={6}
                      placeholder="Schreib hier dein Rezept rein — Zutaten, Mengen, Schritte ..."
                      value={rezeptDraft[brot.id] || ""}
                      onChange={(e) =>
                        setRezeptDraft({
                          ...rezeptDraft,
                          [brot.id]: e.target.value,
                        })
                      }
                      className="input resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => saveRezept(brot)}
                      disabled={savingId === brot.id}
                      className="btn-secondary w-full"
                    >
                      Rezept speichern
                    </button>
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
