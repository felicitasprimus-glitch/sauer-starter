"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    let timer = null;

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Wiederkehrend (anonym ODER eingeloggt) -> sofort weiter
        if (session) {
          if (!cancelled) router.replace("/dashboard");
          return;
        }

        // Erste Oeffnung: kurz die Login-Option zeigen, dann anonym starten
        setShowLogin(true);
        timer = setTimeout(async () => {
          if (cancelled) return;
          const { error } = await supabase.auth.signInAnonymously();
          if (error) {
            setErr("Konnte nicht starten. Bitte App neu laden.");
            return;
          }
          if (!cancelled) router.replace("/dashboard");
        }, 2200);
      } catch (e) {
        setErr("Konnte nicht starten. Bitte App neu laden.");
      }
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="text-5xl">🍞</div>
        <h1 className="font-display text-3xl text-cocoa-900">
          Sauer macht krustig
        </h1>
        <p className="text-sm text-cocoa-700/70">
          {err || "Dein Tagebuch wird geladen ..."}
        </p>

        {showLogin && !err && (
          <p className="pt-2 text-xs text-cocoa-700/60">
            Bereits ein Konto?{" "}
            <Link
              href="/login"
              className="font-semibold text-mauve-700 underline underline-offset-2"
            >
              Anmelden
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
