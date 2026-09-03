"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Guten Morgen";
  if (h < 18) return "Hallo";
  return "Guten Abend";
}

const TILES = [
  {
    href: "/dashboard",
    emoji: "🫙",
    title: "Starter-Tagebuch",
    sub: "Anstellgut füttern, beobachten, retten",
  },
  {
    href: "/rezepte",
    emoji: "🍞",
    title: "Rezepte",
    sub: "Deine Rezepte, Grundstock & Discard",
  },
  {
    href: "/brote",
    emoji: "🥖",
    title: "Meine Brote",
    sub: "Halte deine Backwerke fest",
  },
  {
    href: "/krume",
    emoji: "🔬",
    title: "Krume analysieren",
    sub: "Krumenfoto hochladen, KI wertet aus",
  },
  {
    href: "/community",
    emoji: "👥",
    title: "Community",
    sub: "Zeig dein Brot & back mit anderen",
  },
  {
    href: "/fehlerfinder",
    emoji: "🔍",
    title: "Fehlerfinder",
    sub: "Finde heraus, was schiefgelaufen ist",
  },
];

export default function StartPage() {
  const supabase = createClient();
  const [name, setName] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && !cancelled) {
          const { data } = await supabase
            .from("user_profiles")
            .select("display_name")
            .eq("id", user.id)
            .single();
          if (!cancelled) setName((data && data.display_name) || "");
        }
      } catch (e) {}
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-2">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-gold-300 to-cocoa-900 px-6 py-8 text-white shadow-lg">
        <p className="text-sm opacity-90" style={SERIF}>
          {getGreeting()},
        </p>
        <h1 className="mt-0.5 text-3xl leading-tight" style={SERIF}>
          {name || "Bäckerin"} <span className="opacity-80">♥</span>
        </h1>
        <p className="mt-3 text-sm opacity-90">
          Bereit für deinen Backmoment heute?
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-cocoa-900"
        >
          Tagebuch öffnen →
        </Link>
      </div>

      {/* Überschrift */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl text-cocoa-900" style={SERIF}>
          Deine Backstube
        </h2>
        <div className="mx-auto mt-1 h-px w-24 bg-cocoa-200" />
      </div>

      {/* Kacheln */}
      <div className="mt-4 flex flex-col gap-3">
        {TILES.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex items-center gap-4 rounded-3xl border border-cocoa-200/50 bg-white p-4 shadow-sm active:scale-[0.99] transition"
          >
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gold-100 text-2xl">
              {t.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block text-lg leading-tight text-cocoa-900"
                style={SERIF}
              >
                {t.title}
              </span>
              <span className="block truncate text-xs text-terra-600">
                {t.sub}
              </span>
            </span>
            <span className="flex-none text-xl text-gold-400">›</span>
          </Link>
        ))}
      </div>

      {/* Platzhalter für später */}
      <p className="mt-6 text-center text-xs text-terra-600/70">
        Rechner, Wissen &amp; Brotbackplaner kommen als Nächstes dazu.
      </p>
    </div>
  );
}
