"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openRezept, setOpenRezept] = useState(null);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/community-feed");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Feed konnte nicht geladen werden");
        setLoading(false);
        return;
      }
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message || "Etwas ist schiefgelaufen");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="brand-mark">Sauer macht krustig</p>
        <h1 className="font-display-italic text-display-lg mt-2">Community</h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa-700/80">
          Was die anderen so backen. Lass dich inspirieren — und teile
          deine eigenen Brote mit.
        </p>
      </div>

      <Link href="/community/teilen" className="btn-primary block text-center">
        Eigenes Brot teilen
      </Link>

      {loading ? (
        <div className="card text-center text-sm text-cocoa-700">
          Laedt Community-Feed ...
        </div>
      ) : error ? (
        <div className="border border-terra-500/40 bg-terra-400/10 px-4 py-3 text-sm text-terra-700">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center">
          <p className="text-4xl">🥖</p>
          <h2 className="mt-3 font-display-italic text-2xl">
            Noch keine Brote geteilt
          </h2>
          <p className="mt-2 text-sm text-cocoa-700/70">
            Sei die Erste! Teile ein Brot aus deinem Tagebuch.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <article key={post.id} className="card overflow-hidden">
              {post.fotoUrl && (
                <div className="-mx-6 -mt-6 mb-4">
                  <img
                    src={post.fotoUrl}
                    alt={post.name}
                    className="h-56 w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display-italic text-2xl text-cocoa-900">
                    {post.name}
                  </h3>
                  <p className="mini-label mt-1">von {post.autor}</p>
                </div>
                {post.krumeScore && (
                  <div className="flex-shrink-0 text-center">
                    <div className="font-display-italic text-2xl text-cocoa-900">
                      {post.krumeScore}/10
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-mauve-700">
                      Krume
                    </div>
                  </div>
                )}
              </div>

              {post.krumeDiagnose && (
                <p className="mt-2 text-xs text-cocoa-700/70">
                  {post.krumeDiagnose}
                </p>
              )}

              {post.rezept && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenRezept(openRezept === post.id ? null : post.id)
                    }
                    className="text-mini font-semibold uppercase tracking-widest text-gold-700"
                  >
                    {openRezept === post.id ? "Rezept schliessen" : "Rezept ansehen"}
                  </button>
                  {openRezept === post.id && (
                    <div className="mt-2 whitespace-pre-wrap border-t border-cream-300 pt-3 text-sm leading-relaxed text-cocoa-800">
                      {post.rezept}
                    </div>
                  )}
                </div>
              )}

              {post.isOwn && (
                <div className="mt-3">
                  <span className="chip">Dein Brot</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
