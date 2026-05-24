"use client";

import { useEffect, useState } from "react";

export default function MitgliederPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch("/api/community-feed");
      if (!res.ok) throw new Error("Feed konnte nicht geladen werden.");
      const data = await res.json();
      const posts = data.posts || [];
      const map = {};
      posts.forEach((p) => {
        const name = p.autor || "Unbekannt";
        if (!map[name]) map[name] = { autor: name, brote: 0, herzchen: 0 };
        map[name].brote += 1;
        map[name].herzchen += p.likeCount || 0;
      });
      const list = Object.values(map).sort(
        (a, b) => b.brote - a.brote || b.herzchen - a.herzchen
      );
      setMembers(list);
    } catch (e) {
      setError(e.message || "Fehler beim Laden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-6">
      <div className="mb-3">
        <span className="font-display text-[19px] text-brombeer">
          sauer
          <span className="text-muted">.macht.</span>
          <span className="text-mauve-500">krustig</span>
        </span>
      </div>

      <div className="mb-5 mt-2 text-center">
        <h1 className="font-display text-[30px] font-semibold text-brombeer">
          Mitglieder
        </h1>
        <p className="mx-auto mt-1 max-w-xs text-[13px] leading-relaxed text-muted">
          Die Baeckerinnen unserer Community.
        </p>
      </div>

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
      ) : members.length === 0 ? (
        <div className="rounded-[24px] border border-line bg-white p-8 text-center shadow-card">
          <p className="text-4xl">👥</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">
            Noch keine Mitglieder
          </h2>
          <p className="mt-2 text-sm text-muted">
            Sobald jemand ein Brot teilt, erscheint er hier.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((m, i) => (
            <div
              key={m.autor}
              className="flex items-center gap-3.5 rounded-[20px] border border-line bg-white p-3.5 shadow-card"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-altrosa font-display text-lg font-bold text-brombeer">
                {m.autor.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-[17px] font-semibold text-ink">
                  {m.autor}
                </div>
                <div className="mt-0.5 text-xs text-muted">
                  {m.brote} {m.brote === 1 ? "Brot" : "Brote"} · {m.herzchen}{" "}
                  Herzchen
                </div>
              </div>
              {i < 3 ? (
                <span className="flex-shrink-0 text-xl">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
