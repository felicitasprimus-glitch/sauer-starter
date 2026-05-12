"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function StarterEditPage({ params }) {
  const router = useRouter();
  const supabase = createClient();
  const starterId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    flour_type: "",
    notes: "",
    in_fridge: false,
    feed_interval_hours: 12,
    fridge_interval_days: 7,
  });

  useEffect(() => {
    load();
  }, [starterId]);

  async function load() {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("starters")
      .select("*")
      .eq("id", starterId)
      .single();

    if (loadError || !data) {
      setError("Starter nicht gefunden.");
      setLoading(false);
      return;
    }

    setForm({
      name: data.name || "",
      flour_type: data.flour_type || "",
      notes: data.notes || "",
      in_fridge: data.in_fridge || false,
      feed_interval_hours: data.feed_interval_hours || 12,
      fridge_interval_days: data.fridge_interval_days || 7,
    });
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { error: updateError } = await supabase
      .from("starters")
      .update({
        name: form.name.trim(),
        flour_type: form.flour_type.trim() || null,
        notes: form.notes.trim() || null,
        in_fridge: form.in_fridge,
        feed_interval_hours: Number(form.feed_interval_hours) || 12,
        fridge_interval_days: Number(form.fridge_interval_days) || 7,
      })
      .eq("id", starterId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push(`/starter/${starterId}`);
  }

  if (loading) {
    return <div className="card text-center text-sm text-cocoa-700">Laedt ...</div>;
  }

  return (
    <div className="space-y-5 pb-8">
      <Link href={`/starter/${starterId}`} className="mini-label">
        ← Zurueck zum Starter
      </Link>

      <div>
        <p className="brand-mark">Bearbeiten</p>
        <h1 className="font-display-italic text-display-md mt-1">
          {form.name || "Starter"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              required
              className="input mt-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="flour">Mehl-Sorte</label>
            <input
              id="flour"
              type="text"
              className="input mt-2"
              placeholder="z.B. Roggenvollkorn"
              value={form.flour_type}
              onChange={(e) => setForm({ ...form, flour_type: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="notes">Notizen</label>
            <textarea
              id="notes"
              rows={3}
              className="input mt-2 resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        {/* KUEHLSCHRANK-MODUS */}
        <div className="card space-y-4">
          <div>
            <p className="label">Lagerung & Erinnerung</p>
            <p className="mt-1 text-xs text-cocoa-700/70">
              Wo lagerst du diesen Starter? Wir erinnern dich rechtzeitig an die naechste Fuetterung.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, in_fridge: false })}
              className={`border p-4 text-left transition-all ${
                !form.in_fridge
                  ? "border-gold-500 bg-gold-100/40"
                  : "border-cream-300 bg-cream-50"
              }`}
            >
              <div className="text-2xl">🌡️</div>
              <div className="mt-2 font-display-italic text-base text-cocoa-900">
                Raumtemperatur
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-mauve-700">
                Alle 12-24h fuettern
              </div>
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, in_fridge: true })}
              className={`border p-4 text-left transition-all ${
                form.in_fridge
                  ? "border-gold-500 bg-gold-100/40"
                  : "border-cream-300 bg-cream-50"
              }`}
            >
              <div className="text-2xl">❄️</div>
              <div className="mt-2 font-display-italic text-base text-cocoa-900">
                Kuehlschrank
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-mauve-700">
                Alle 7-14 Tage fuettern
              </div>
            </button>
          </div>

          {/* Intervall anpassen */}
          {!form.in_fridge ? (
            <div>
              <label className="label" htmlFor="interval-hours">
                Erinnerung nach (Stunden)
              </label>
              <input
                id="interval-hours"
                type="number"
                min="6"
                max="48"
                className="input mt-2"
                value={form.feed_interval_hours}
                onChange={(e) =>
                  setForm({ ...form, feed_interval_hours: e.target.value })
                }
              />
              <p className="mt-1 text-[10px] text-cocoa-700/60">
                Empfehlung: 12h bei 24°C, 24h bei kuehler Raumtemperatur
              </p>
            </div>
          ) : (
            <div>
              <label className="label" htmlFor="interval-days">
                Erinnerung nach (Tagen)
              </label>
              <input
                id="interval-days"
                type="number"
                min="3"
                max="21"
                className="input mt-2"
                value={form.fridge_interval_days}
                onChange={(e) =>
                  setForm({ ...form, fridge_interval_days: e.target.value })
                }
              />
              <p className="mt-1 text-[10px] text-cocoa-700/60">
                Empfehlung: 7 Tage fuer aktive Starter, 14 Tage fuer Pause-Modus
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="border border-terra-500/40 bg-terra-400/10 px-4 py-3 text-sm text-terra-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href={`/starter/${starterId}`}
            className="btn-secondary text-center"
          >
            Abbrechen
          </Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Speichert ..." : "Speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}
