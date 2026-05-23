"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CommunityPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [myDisplayName, setMyDisplayName] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openRezept, setOpenRezept] = useState(null);
  const [openKomm, setOpenKomm] = useState(null);
  const [kommentarDraft, setKommentarDraft] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      setUser(userData.user);
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("display_name")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (profile?.display_name) setMyDisplayName(profile.display_name);
    }
    await loadFeed();
  }

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

  async function toggleLike(post) {
    if (!user || busy) return;
    setBusy(true);

    // Optimistisch lokal updaten
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likeCount: p.likeCount + (p.likedByMe ? -1 : 1),
            }
          : p
      )
    );

    if (post.likedByMe) {
      await supabase
        .from("brot_likes")
        .delete()
        .eq("brot_id", post.id)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("brot_likes")
        .insert({ brot_id: post.id, user_id: user.id });
    }
    setBusy(false);
  }

  async function sendKommentar(post) {
    if (!user) return;
    const text = (kommentarDraft[post.id] || "").trim();
    if (!text) return;

    const { data, error: kErr } = await supabase
      .from("brot_kommentare")
      .insert({ brot_id: post.id, user_id: user.id, text })
      .select()
      .single();

    if (!kErr && data) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                kommentare: [
                  ...p.kommentare,
                  {
                    id: data.id,
                    text,
                    autor: myDisplayName || "Du",
                    istEigener: true,
                    createdAt: data.created_at,
                  },
                ],
              }
            : p
        )
      );
      setKommentarDraft((prev) => ({ ...prev, [post.id]: "" }));
    }
  }

  async function deleteKommentar(post, komm) {
    if (!user) return;
    await supabase.from("brot_kommentare").delete().eq("id", komm.id);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, kommentare: p.kommentare.filter((k) => k.id !== komm.id) }
          : p
      )
    );
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

      <Link
        href="/community/bestenliste"
        className="btn-secondary block text-center"
      >
        🏆 Bestenliste ansehen
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

              {(post.rezept || post.rezeptFotoUrl) && (
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
                    <div className="mt-2 border-t border-cream-300 pt-3">
                      {post.rezeptFotoUrl && (
                        <img
                          src={post.rezeptFotoUrl}
                          alt="Rezept"
                          className="mb-3 w-full object-cover"
                        />
                      )}
                      {post.rezept && (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-cocoa-800">
                          {post.rezept}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Like + Kommentar-Leiste */}
              <div className="mt-4 flex items-center gap-4 border-t border-cream-300 pt-3">
                <button
                  type="button"
                  onClick={() => toggleLike(post)}
                  className="flex items-center gap-1.5"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={post.likedByMe ? "#c87f63" : "none"}
                    stroke={post.likedByMe ? "#c87f63" : "#7a5e75"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="text-sm font-semibold text-cocoa-800">
                    {post.likeCount > 0 ? post.likeCount : ""}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOpenKomm(openKomm === post.id ? null : post.id)}
                  className="flex items-center gap-1.5"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7a5e75"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-cocoa-800">
                    {post.kommentare.length > 0 ? post.kommentare.length : ""}
                  </span>
                </button>

                {post.isOwn && (
                  <span className="ml-auto chip">Dein Brot</span>
                )}
              </div>

              {/* Kommentar-Bereich */}
              {openKomm === post.id && (
                <div className="mt-3 space-y-3 border-t border-cream-300 pt-3">
                  {post.kommentare.length === 0 ? (
                    <p className="text-xs text-cocoa-700/60">
                      Noch keine Kommentare. Schreib den ersten!
                    </p>
                  ) : (
                    post.kommentare.map((komm) => (
                      <div key={komm.id} className="text-sm">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-mauve-700">
                            {komm.autor}
                          </span>
                          {komm.istEigener && (
                            <button
                              type="button"
                              onClick={() => deleteKommentar(post, komm)}
                              className="text-[10px] text-cocoa-700/50 hover:text-terra-600"
                            >
                              loeschen
                            </button>
                          )}
                        </div>
                        <p className="text-cocoa-800">{komm.text}</p>
                      </div>
                    ))
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kommentar schreiben ..."
                      value={kommentarDraft[post.id] || ""}
                      onChange={(e) =>
                        setKommentarDraft({
                          ...kommentarDraft,
                          [post.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendKommentar(post);
                      }}
                      className="input"
                    />
                    <button
                      type="button"
                      onClick={() => sendKommentar(post)}
                      disabled={!(kommentarDraft[post.id] || "").trim()}
                      className="btn-primary whitespace-nowrap"
                    >
                      Senden
                    </button>
                  </div>

                  {!myDisplayName && (
                    <p className="text-[10px] text-cocoa-700/60">
                      Tipp: Leg unter <Link href="/community/teilen" className="underline">Teilen</Link> einen Anzeigenamen fest, damit dein Name beim Kommentar erscheint.
                    </p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
