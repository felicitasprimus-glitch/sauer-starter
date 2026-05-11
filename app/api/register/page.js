"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          masterPassword: masterPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registrierung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      setError("Netzwerkfehler. Versuch es nochmal.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="card w-full max-w-sm text-center">
          <div className="text-5xl">🥖</div>
          <h1 className="mt-3 font-display text-2xl text-cocoa-900">
            Willkommen!
          </h1>
          <p className="mt-2 text-sm text-cocoa-700">
            Registrierung erfolgreich. Du wirst gleich zum Login weitergeleitet.
          </p>
          <p className="mt-3 text-[10px] text-cocoa-700/60">
            Dein Zugang ist 90 Tage gueltig.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <div className="text-4xl">🍞</div>
          <h1 className="mt-2 font-display text-3xl text-cocoa-900">
            Konto erstellen
          </h1>
          <p className="mt-1 text-sm text-cocoa-700/70">
            Sauer macht krustig
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
            />
          </div>

          <div>
            <label className="label" htmlFor="reg-password">
              Passwort waehlen
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
            />
          </div>

          <div>
            <label className="label" htmlFor="reg-master">
              Aktivierungs-Code
            </label>
            <input
              id="reg-master"
              type="text"
              required
              className="input"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              placeholder="Code aus deiner Bestellung"
              autoComplete="off"
            />
            <p className="mt-1 text-[10px] text-cocoa-700/60">
              Den Code findest du bei deiner Pampered-Chef-Bestellung.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-terra-500/40 bg-terra-500/10 px-3 py-2 text-xs text-terra-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Wird angelegt ..." : "Konto erstellen"}
          </button>
        </form>

        <div className="text-center text-xs text-cocoa-700/70">
          Schon ein Konto?{" "}
          <Link href="/login" className="font-semibold text-mauve-700 hover:text-cocoa-900">
            Hier einloggen
          </Link>
        </div>

        <div className="rounded-2xl border border-mauve-500/30 bg-cream-50 px-4 py-3">
          <p className="text-[10px] leading-relaxed text-cocoa-700/70">
            Mit dem Aktivierungs-Code bekommst du 3 Monate kostenfreien Zugang
            zur App. Du kannst dein Konto jederzeit verlaengern.
          </p>
        </div>
      </div>
    </div>
  );
}
