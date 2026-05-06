"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Wenn E-Mail-Bestätigung in Supabase deaktiviert ist, kommt direkt eine Session.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setInfo(
      "Fast geschafft! Schau in dein E-Mail-Postfach und bestätige deine Adresse."
    );
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col px-6 py-8">
      <Link href="/" className="self-start">
        <Logo />
      </Link>

      <div className="mx-auto mt-10 w-full max-w-sm">
        <h1 className="font-display text-4xl font-medium tracking-tight text-cocoa-900">
          Lass uns{" "}
          <span className="italic text-terra-600">starten</span>.
        </h1>
        <p className="mt-2 text-cocoa-700/80">
          Konto erstellen — kostenlos und ohne Schnickschnack.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label" htmlFor="email">E-Mail</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Passwort</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-cocoa-700/60">
              Mindestens 6 Zeichen.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-terra-500/40 bg-terra-500/10 px-4 py-3 text-sm text-terra-700">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-2xl border border-honey-400/40 bg-honey-400/15 px-4 py-3 text-sm text-honey-600">
              {info}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Konto wird angelegt …" : "Konto erstellen"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-cocoa-700/80">
          Schon ein Konto?{" "}
          <Link href="/login" className="font-semibold text-terra-600 hover:underline">
            Hier anmelden
          </Link>
        </p>
      </div>
    </main>
  );
}
