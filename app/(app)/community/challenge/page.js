"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ChallengePage() {
  const supabase = createClient();

  const [challenge, setChallenge] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [einreichungen, setEinreichungen] = useState([]);
  const [eigeneBrote, setEigeneBrote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Admin-Formular
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [saving, setSaving] = useState(false);

  // Mitmachen
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/challenge");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Fehler beim Laden");
      } else {
        setChallenge(data.challenge);
        setIsAdmin(data.isAdmin);
        setEinreichungen(data.einreichungen || []);
        setEigeneBrote(data.eigeneBrote || []);
      }
    } catch (err) {
      setError("Fehler beim Laden");
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          starts_at: startsAt || null,
          ends_at: endsAt || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Fehler beim Speichern");
        setSaving(false);
        return;
      }
      setShowForm(false);
      setTitle("");
      setDescription("");
      setStartsAt("");
      setEndsAt("");
      await load();
    } catch (err) {
      setError("Fehler beim Speichern");
    }
    setSaving(false);
  }

  async function einreichen(brotId) {
    if (!challenge) return;
    setSubmitting(true);
    setError("");
    const { error: e } = await supabase
      .from("brote")
      .update({ challenge_id: challenge.id })
      .eq("id", brotId);
    setSubmitting(false);
    if (e) {
      setError(e.message);
      return;
    }
    setShowPicker(false);
    await load();
  }

  async function zurueckziehen(brotId) {
    setSubmitting(true);
    setError("");
    const { error: e } = await supabase
      .from("brote")
      .update({ challenge_id: null })
      .eq("id", brotId);
    setSubmitting(false);
    if (e) {
      setError(e.message);
      return;
    }
    await load();
  }

  function fmtDate(d) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
    });
  }

  function daysLeft(end) {
    if (!end) return null;
    return Math.ceil((new Date(end) - new Date()) / (1000 * 60 * 60 * 24));
  }

  const dl = challenge ? daysLeft(challenge.ends_at) : null;
  const meinEingereichtes = eigeneBrote.find((b) => b.eingereicht) || null;
  const offeneBrote = eigeneBrote.filter((b) => !b.eingereicht);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Link href="/community" className="text-xs text-mauve-700">
          &larr; Zurueck zur Community
        </Link>
        <p className="brand-mark mt-2">Sauer macht krustig</p>
        <h1 className="font-display-italic text-display-lg mt-1">Challenge</h1>
        <p className="mt-2 text-sm leading-relaxed text-cocoa-700/80">
          Die monatliche Back-Challenge. Mach mit und zeig dein Brot!
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-cocoa-700/60">Laedt ...</p>
      ) : (
        <>
          {challenge ? (
            <div className="card border-gold-500/40 bg-gold-100/30">
              <p className="brand-mark text-gold-700">Aktuelle Challenge</p>
              <h2 className="mt-1 font-display-italic text-2xl text-cocoa-900">
                {challenge.title}
              </h2>
              {challenge.description && (
                <p className="mt-2 text-sm leading-relaxed text-cocoa-800">
                  {challenge.description}
                </p>
              )}
              {(challenge.starts_at || challenge.ends_at) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gold-500/20 pt-3 text-xs text-cocoa-700/70">
                  {challenge.starts_at && challenge.ends_at && (
                    <span>
                      {fmtDate(challenge.starts_at)} bis {fmtDate(challenge.ends_at)}
                    </span>
                  )}
                  {dl != null && dl >= 0 && (
                    <span className="rounded-full bg-gold-500/15 px-2 py-0.5 font-semibold text-gold-700">
                      noch {dl} {dl === 1 ? "Tag" : "Tage"}
                    </span>
                  )}
                  {dl != null && dl < 0 && (
                    <span className="rounded-full bg-cream-200 px-2 py-0.5 text-cocoa-700/60">
                      beendet
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center">
              <p className="text-sm text-cocoa-700/70">
                Aktuell laeuft keine Challenge.
              </p>
            </div>
          )}

          {/* Mitmachen */}
          {challenge && (
            <div className="card">
              <p className="brand-mark">Mitmachen</p>
              {meinEingereichtes ? (
                <div className="mt-2">
                  <p className="text-sm text-cocoa-800">
                    Du bist dabei mit{" "}
                    <span className="font-semibold">{meinEingereichtes.name}</span>! 🎉
                  </p>
                  <button
                    type="button"
                    onClick={() => zurueckziehen(meinEingereichtes.id)}
                    disabled={submitting}
                    className="btn-secondary mt-3 w-full"
                  >
                    Brot zurueckziehen
                  </button>
                </div>
              ) : eigeneBrote.length === 0 ? (
                <p className="mt-2 text-sm leading-relaxed text-cocoa-700/70">
                  Teile zuerst ein Brot in der Community, dann kannst du es hier
                  zur Challenge einreichen.
                </p>
              ) : !showPicker ? (
                <button
                  type="button"
                  onClick={() => setShowPicker(true)}
                  className="btn-primary mt-2 w-full"
                >
                  Mein Brot einreichen
                </button>
              ) : (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-cocoa-800">
                    Welches Brot moechtest du einreichen?
                  </p>
                  {offeneBrote.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => einreichen(b.id)}
                      disabled={submitting}
                      className="w-full border border-cream-300 bg-cream-50 p-2 text-left text-sm font-semibold text-cocoa-800 hover:border-gold-400"
                    >
                      {b.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowPicker(false)}
                    className="btn-secondary w-full"
                  >
                    Abbrechen
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Eingereichte Brote */}
          {challenge && einreichungen.length > 0 && (
            <div className="card">
              <p className="brand-mark">
                Eingereichte Brote ({einreichungen.length})
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {einreichungen.map((e) => (
                  <div
                    key={e.id}
                    className={`overflow-hidden border bg-cream-50 ${
                      e.isOwn ? "border-gold-500/50" : "border-cream-300"
                    }`}
                  >
                    <div className="relative">
                      {e.fotoUrl ? (
                        <img
                          src={e.fotoUrl}
                          alt={e.name}
                          className="h-28 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-full items-center justify-center bg-cream-200 text-2xl">
                          🍞
                        </div>
                      )}
                      {e.krumeScore != null && (
                        <span className="absolute right-1.5 top-1.5 rounded-full bg-cocoa-900/80 px-2 py-0.5 text-[10px] font-semibold text-cream-50">
                          {e.krumeScore}/10
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="truncate text-xs font-semibold text-cocoa-900">
                        {e.name}
                      </div>
                      <div className="truncate text-[10px] text-cocoa-700/60">
                        von {e.autor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin: Challenge anlegen */}
          {isAdmin && (
            <div className="card">
              {!showForm ? (
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="btn-secondary w-full"
                >
                  {challenge ? "Neue Challenge anlegen" : "Erste Challenge anlegen"}
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="brand-mark">Neue Challenge</p>
                  <div>
                    <label className="label" htmlFor="ch-title">
                      Titel
                    </label>
                    <input
                      id="ch-title"
                      type="text"
                      className="input"
                      placeholder="z.B. Vollkorn-Power"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="ch-desc">
                      Beschreibung
                    </label>
                    <textarea
                      id="ch-desc"
                      rows={3}
                      className="input resize-none"
                      placeholder="Worum geht es? Was sollen die Baeckerinnen backen?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label" htmlFor="ch-start">
                        Start
                      </label>
                      <input
                        id="ch-start"
                        type="date"
                        className="input"
                        value={startsAt}
                        onChange={(e) => setStartsAt(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="ch-end">
                        Ende
                      </label>
                      <input
                        id="ch-end"
                        type="date"
                        className="input"
                        value={endsAt}
                        onChange={(e) => setEndsAt(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving || !title.trim()}
                      className="btn-primary flex-1"
                    >
                      {saving ? "Speichert ..." : "Challenge starten"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn-secondary"
                    >
                      Abbrechen
                    </button>
                  </div>
                  <p className="text-[10px] text-cocoa-700/60">
                    Die neue Challenge ersetzt die bisher aktive.
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="border border-terra-500/40 bg-terra-400/10 px-4 py-3 text-sm text-terra-700">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
