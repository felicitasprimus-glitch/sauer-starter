"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import PhotoUpload from "@/components/PhotoUpload";

export default function MeinProfilPage() {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPath, setAvatarPath] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [breads, setBreads] = useState([]);
  const [herzchen, setHerzchen] = useState(0);

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
      .select("display_name, bio, avatar_path")
      .eq("id", userData.user.id)
      .single();

    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setAvatarPath(profile.avatar_path || null);
      if (profile.avatar_path) loadAvatar(profile.avatar_path);
    }

    try {
      const res = await fetch("/api/community-feed");
      if (res.ok) {
        const data = await res.json();
        const mine = (data.posts || []).filter((p) => p.isOwn);
        setBreads(mine);
        setHerzchen(mine.reduce((s, p) => s + (p.likeCount || 0), 0));
      }
    } catch (e) {}

    setLoading(false);
  }

  async function loadAvatar(path) {
    const { data } = await supabase.storage
      .from("photos")
      .createSignedUrl(path, 3600);
    setAvatarUrl(data?.signedUrl || null);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("user_profiles")
      .update({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        avatar_path: avatarPath,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      setMessage("Speichern fehlgeschlagen: " + error.message);
      return;
    }
    if (avatarPath) loadAvatar(avatarPath);
    setEditing(false);
    setMessage("Profil gespeichert.");
  }

  const initial = (displayName || (user && user.email) || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  if (loading) {
    return (
      <div className="pb-6">
        <div className="rounded-[24px] border border-line bg-white p-6 text-center text-sm text-muted shadow-card">
          Laedt ...
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <Link
        href="/community"
        className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-mauve-500"
      >
        ← Community
      </Link>

      {/* COVER + AVATAR */}
      <div
        className="h-28 rounded-[24px]"
        style={{ background: "linear-gradient(135deg, #8b6a7d 0%, #5a3f56 100%)" }}
      />
      <div className="-mt-12 flex flex-col items-center text-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-24 w-24 rounded-full object-cover"
            style={{ border: "4px solid #faf4ee" }}
          />
        ) : (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full bg-altrosa font-display text-4xl font-bold text-brombeer"
            style={{ border: "4px solid #faf4ee" }}
          >
            {initial}
          </div>
        )}
        <h1 className="mt-2 font-display text-[26px] font-semibold text-brombeer">
          {displayName || "Dein Name"}
        </h1>
        {bio ? (
          <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-muted">
            {bio}
          </p>
        ) : null}

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

      {message ? (
        <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-2 text-center text-sm text-mauve-600">
          {message}
        </p>
      ) : null}

      {/* BEARBEITEN */}
      {editing ? (
        <div className="mt-5 rounded-[24px] border border-line bg-white p-5 shadow-card">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-mauve-700">
            Profilfoto
          </p>
          {user ? (
            <PhotoUpload
              value={avatarPath}
              onChange={setAvatarPath}
              userId={user.id}
              folder="profil"
            />
          ) : null}

          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-widest text-mauve-700">
            Name
          </p>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Dein Anzeigename"
            className="w-full rounded-xl border border-line bg-cream-50 px-4 py-3 text-base text-ink focus:border-mauve-500 focus:outline-none"
          />

          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-widest text-mauve-700">
            Ueber mich
          </p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Erzaehl ein bisschen ueber dich und dein Backen ..."
            className="w-full resize-none rounded-xl border border-line bg-cream-50 px-4 py-3 text-base text-ink focus:border-mauve-500 focus:outline-none"
          />

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="flex-1 rounded-2xl bg-mauve-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Speichert ..." : "Speichern"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-2xl border border-line bg-white px-5 py-3 text-sm font-semibold text-muted"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setEditing(true);
          }}
          className="mt-5 w-full rounded-2xl border border-altrosa bg-cream-100 px-5 py-3 text-sm font-semibold text-mauve-500"
        >
          Profil bearbeiten
        </button>
      )}

      {/* MEINE BROTE */}
      <h2 className="mb-3 mt-7 font-display text-[19px] font-semibold text-brombeer">
        Meine Brote
      </h2>
      {breads.length === 0 ? (
        <div className="rounded-[24px] border border-line bg-white p-8 text-center shadow-card">
          <p className="text-4xl">🍞</p>
          <p className="mt-3 text-sm text-muted">
            Du hast noch kein Brot in der Community geteilt.
          </p>
          <Link
            href="/community/teilen"
            className="mt-5 inline-block rounded-2xl bg-mauve-500 px-6 py-3 text-sm font-semibold text-white"
          >
            Brot teilen
          </Link>
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
                <div className="mt-0.5 text-xs text-muted">
                  ❤️ {b.likeCount || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
