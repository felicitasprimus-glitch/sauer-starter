"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STATE_LABELS } from "@/lib/peakPrediction";
import PeakPrognose from "./PeakPrognose";
import PhotoUpload from "./PhotoUpload";

function parseRatio(ratio) {
  if (!ratio) return null;
  const parts = ratio.split(":").map((p) => Number(p.trim()));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return { asg: parts[0], flour: parts[1], water: parts[2] };
}

export default function FeedingForm({ starter }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, [supabase]);

  const ratio = parseRatio(starter.default_ratio) ?? { asg: 1, flour: 1, water: 1 };
  const baseAsg = 20;

  const [form, setForm] = useState({
    asg_g: baseAsg,
    flour_g: Math.round(baseAsg * ratio.flour / ratio.asg),
    water_g: Math.round(baseAsg * ratio.water / ratio.asg),
    temperature: 24,
    state: "aktiv",
    notes: "",
    photo_path: null,
  });

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Nicht eingeloggt.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("feedings").insert({
      starter_id: starter.id,
      user_id: user.id,
      asg_g: Number(form.asg_g),
      flour_g: Number(form.flour_g),
      water_g: Number(form.water_g),
      temperature: form.temperature ? Number(form.temperature) : null,
      state: form.state,
      notes: form.notes.trim() || null,
      photo_path: form.photo_path,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setForm((f) => ({
      ...f,
      notes: "",
      state: "aktiv",
      photo_path: null,
    }));
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label" htmlFor="asg_g">ASG (g)</label>
          <input
            id="asg_g"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            required
            className="input"
            value={form.asg_g}
            onChange={(e) => update("asg_g", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="flour_g">Mehl (g)</label>
          <input
            id="flour_g"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            required
            className="input"
            value={form.flour_g}
            onChange={(e) => update("flour_g", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="water_g">Wasser (g)</label>
          <input
            id="water_g"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            required
            className="input"
            value={form.water_g}
            onChange={(e) => update("water_g", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="temperature">Temperatur (°C)</label>
        <input
          id="temperature"
          type="number"
          inputMode="decimal"
          step="0.5"
          min="5"
          max="40"
          className="input"
          value={form.temperature}
          onChange={(e) => update("temperature", e.target.value)}
        />
      </div>

      <PeakPrognose
        asg={form.asg_g}
        flour={form.flour_g}
        water={form.water_g}
        temperature={form.temperature}
      />

      <div>
        <label className="label">Zustand</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATE_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => update("state", key)}
              className={`chip transition-all ${
                form.state === key
                  ? "border-terra-500 bg-terra-500 text-cream-50"
                  : "border-mauve-500/25 bg-cream-50 text-cocoa-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Foto-Upload */}
      {userId && (
        <div>
          <label className="label">Foto (optional)</label>
          <PhotoUpload
            value={form.photo_path}
            onChange={(path) => update("photo_path", path)}
            userId={userId}
            folder="feedings"
          />
        </div>
      )}

      <div>
        <label className="label" htmlFor="notes">Notiz</label>
        <textarea
          id="notes"
          rows={2}
          className="input resize-none"
          placeholder="Riecht fruchtig, viele Bläschen …"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-terra-500/40 bg-terra-500/10 px-4 py-3 text-sm text-terra-700">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Speichert …" : "Fütterung eintragen"}
      </button>
    </form>
  );
}
