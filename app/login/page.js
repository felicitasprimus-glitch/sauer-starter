"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    window.location.href = "/start";
  }

  return (
    <main className="flex min-h-screen flex-col px-6 py-8">
      <Link href="/" className="self-start">
        <Logo />
      </Link>

      <div className="mx-auto mt-10 w-full max-w-sm">
        <h1 className="font-display text-4xl font-medium tracking-tight text-cocoa-900">
          Willkommen{" "}
          <span className="italic text-terra-600">zurück</span>.
        </h1>
        <p className="mt-2 text-cocoa-700/80">
          Schön, dass du wieder da bist.
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
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-terra-500/40 bg-terra-500/10 px-4 py-3 text-sm text-terra-700">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Anmeldung läuft …" : "Anmelden"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-cocoa-700/80">
          Noch kein Konto?{" "}
          <Link href="/register" className="font-semibold text-terra-600 hover:underline">
            Hier registrieren
          </Link>
        </p>
      </div>
    </main>
  );
}
