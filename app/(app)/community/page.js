"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import NotificationBell from "@/components/NotificationBell";

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
    <div className="pb-6">
      {/* TOP-LEISTE */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-[19px] text-brombeer">
          sauer
          <span className="text-muted">.macht.</span>
          <span className="text-mauve-500">krustig</span>
        </span>
        <NotificationBell />
      </div>

      {/* HERO mit Text drauf (Verlauf-Fallback ohne Bild) */}
      <div
        className="relative mb-5 h-[230px] overflow-hidden rounded-[24px]"
        style={{
          backgroundImage:
            "url(/community-hero.jpg), linear-gradient(135deg, #8b6a7d 0%, #5a3f56 100%)",
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(62,44,57,0.05) 0%, rgba(62,44,57,0.15) 45%, rgba(62,44,57,0.75) 100%)",
          }}
        />
        <div className="absolute bottom-5 left-5 right-5 z-10">
          <h1
            className="font-display text-[30px] font-semibold leading-tight text-white"
            style={{ textShadow: "0 2px 14px rgba(62,44,57,0.45)" }}
          >
            Unsere Community
          </h1>
          <p
            className="mt-1 text-[13px] text-white/90"
            style={{ textShadow: "0 1px 8px rgba(62,44,57,0.4)" }}
          >
            Teile deine Brote und lass dich inspirieren.
          </p>
        </div>
      </div>

      {/* TEILEN-BUTTON */}
      <Link
        href="/community/teilen"
        className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-mauve-500 px-5 py-4 text-[15px] font-semibold text-white"
      >
        🥖 Eigenes Brot teilen
      </Link>

      {/* ENTDECKEN */}
      <h2 className="mb-3 font-display text-[21px] font-semibold text-brombeer">
        Entdecken
      </h2>
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Link
          href="/community/bestenliste"
          className="rounded-[20px] border border-line bg-white p-4 shadow-card"
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
            style={{ background: "#F6ECD5" }}
          >
            🏆
          </div>
          <h3 className="mt-3 font-display text-base font-semibold text-ink">
            Bestenliste
          </h3>
          <p className="mt-0.5 text-xs leading-snug text-muted">
            Sieh dir die beliebtesten Brote der Community an.
          </p>
        </Link>

        <Link
          href="/community/challenge"
          className="rounded-[20px] border border-line bg-white p-4 shadow-card"
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
            style={{ background: "#F6E2E2" }}
          >
            🎯
          </div>
          <h3 className="mt-3 font-display text-base font-semibold text-ink">
            Challenges
          </h3>
          <p className="mt-0.5 text-xs leading-snug text-muted">
            Nimm teil und sammle Punkte & Abzeichen.
          </p>
        </Link>

        <a
          href="#aktuelles"
          className="rounded-[20px] border border-line bg-white p-4 shadow-card"
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
            style={{ background: "#F1EAEF" }}
          >
            💬
          </div>
          <h3 className="mt-3 font-display text-base font-semibold text-ink">
            Neueste Beitraege
          </h3>
          <p className="mt-0.5 text-xs leading-snug text-muted">
            Was gibt es Neues in der Community?
          </p>
        </a>

        <Link
          href="/community/mitglieder"
          className="rounded-[20px] border border-line bg-white p-4 shadow-card"
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
            style={{ background: "#EDE6EA" }}
          >
            👥
          </div>
          <h3 className="mt-3 font-display text-base font-semibold text-ink">
            Mitglieder
          </h3>
          <p className="mt-0.5 text-xs leading-snug text-muted">
            Werde Teil unserer Community.
          </p>
        </Link>
      </div>

      {/* STATS */}
      {!loading && !error && posts.length > 0 && (
        <div className="mb-6 grid grid-cols-3 rounded-[20px] border border-line bg-white p-4 shadow-card">
          <div className="text-center">
            <div className="text-2xl">🍞</div>
            <div className="mt-1 font-display text-2xl font-semibold text-brombeer">
              {posts.length}
            </div>
            <div className="text-[11px] text-muted">Brote geteilt</div>
          </div>
          <div className="border-x text-center" style={{ borderColor: "#ece0e6" }}>
            <div className="text-2xl">👥</div>
            <div className="mt-1 font-display text-2xl font-semibold text-brombeer">
              {new Set(posts.map((p) => p.autor)).size}
            </div>
            <div className="text-[11px] text-muted">Baeckerinnen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">❤️</div>
            <div className="mt-1 font-display text-2xl font-semibold text-brombeer">
              {posts.reduce((s, p) => s + (p.likeCount || 0), 0)}
            </div>
            <div className="text-[11px] text-muted">Herzchen</div>
          </div>
        </div>
      )}

      {/* AKTUELLES */}
      <h2
        id="aktuelles"
        className="mb-3 font-display text-[21px] font-semibold text-brombeer"
      >
        Aktuelles aus der Community
      </h2>

      {loading ? (
        <div className="rounded-[24px] border border-line bg-white p-6 text-center text-sm text-muted shadow-card">
          Laedt Community-Feed ...
        </div>
      ) : error ? (
        <div
          className="rounded-[20px] border px-4 py-3 text-sm"
          style={{ borderColor: "#e6c9c4", background: "#f7e3e1", color: "#B0524A" }}
        >
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-[24px] border border-line bg-white p-8 text-center shadow-card">
          <p className="text-4xl">🥖</p>
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
            Noch keine Brote geteilt
          </h3>
          <p className="mt-2 text-sm text-muted">
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
                    fill={post.likedByMe ? "#8b6a7d" : "none"}
                    stroke={post.likedByMe ? "#8b6a7d" : "#9a8290"}
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
                    stroke="#9a8290"
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
