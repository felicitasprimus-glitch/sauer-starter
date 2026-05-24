"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilPage() {
  const [name, setName] = useState("");
  const [breads, setBreads] = useState([]);
  const [herzchen, setHerzchen] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("name") || "";
    setName(n);
    load(n);
  }, []);

  async function load(n) {
    try {
      const res = await fetch("/api/community-feed");
      if (!res.ok) throw new Error("Feed konnte nicht geladen werden.");
      const data = await res.json();
      const posts = (data.posts || []).filter((p) => (p.autor || "") === n);
      setBreads(posts);
      setHerzchen(posts.reduce((s, p) => s + (p.likeCount || 0), 0));
    } catch (e) {
      setError(e.message || "Fehler beim Laden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-6">
      <Link
        href="/community/mitglieder"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-mauve-500"
      >
        ← Mitglieder
      </Link>

      {/* PROFIL-KOPF */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-altrosa font-display text-3xl font-bold text-brombeer">
          {(name || "?").charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-3 font-display text-[28px] font-semibold text-brombeer">
          {name || "Mitglied"}
        </h1>
        <div className="mt-3 flex gap-6">
          <div className="text-center">
            <div className="font-display text-xl font-semibold text-ink">
              {breads.length}
            </div>
            <div className="text-[11px] text-muted">Brote</div>
          </div>
          <div className="text-center">
            <div className="font-display text-xl font-semibold text-ink">
              {herzchen}
            </div>
            <div className="text-[11px] text-muted">Herzchen</div>
          </div>
        </div>
      </div>

      {/* BROTE */}
      <h2 className="mb-3 font-display text-[19px] font-semibold text-brombeer">
        Geteilte Brote
      </h2>

      {loading ? (
        <div className="rounded-[24px] border border-line bg-white p-6 text-center text-sm text-muted shadow-card">
          Laedt ...
        </div>
      ) : error ? (
        <div
          className="rounded-[20px] border px-4 py-3 text-sm"
          style={{ borderColor: "#e6c9c4", background: "#f7e3e1", color: "#B0524A" }}
        >
          {error}
        </div>
      ) : breads.length === 0 ? (
        <div className="rounded-[24px] border border-line bg-white p-8 text-center shadow-card">
          <p className="text-4xl">🍞</p>
          <p className="mt-3 text-sm text-muted">Noch keine geteilten Brote.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {breads.map((b) => (
            <div
              key={b.id}
              className="overflow-hidden rounded-[20px] border border-line bg-white shadow-card"
            >
              {b.fotoUrl ? (
                <img
                  src={b.fotoUrl}
                  alt={b.name}
                  className="h-32 w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-32 w-full items-center justify-center text-3xl"
                  style={{ background: "#F3E8EE" }}
                >
                  🍞
                </div>
              )}
              <div className="p-3">
                <div className="truncate font-display text-[15px] font-semibold text-ink">
                  {b.name}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                  <span>❤️ {b.likeCount || 0}</span>
                  {b.krumeScore ? <span>· Krume {b.krumeScore}/10</span> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
