"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ChallengePage() {
  const [challenge, setChallenge] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [saving, setSaving] = useState(false);

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
      setChallenge(data.challenge);
      setShowForm(false);
      setTitle("");
      setDescription("");
      setStartsAt("");
      setEndsAt("");
    } catch (err) {
      setError("Fehler beim Speichern");
    }
    setSaving(false);
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
