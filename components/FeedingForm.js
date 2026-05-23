"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STATE_LABELS } from "@/lib/peakPrediction";
import PeakPrognose from "./PeakPrognose";
import PhotoUpload from "./PhotoUpload";

const VERHAELTNIS_PRESETS = [
  { value: "1:1:1", label: "1:1:1", desc: "Auffrischung" },
  { value: "1:2:2", label: "1:2:2", desc: "Standard" },
  { value: "1:3:3", label: "1:3:3", desc: "Etwas schwaecher" },
  { value: "1:5:5", label: "1:5:5", desc: "Lange Standzeit" },
  { value: "1:10:10", label: "1:10:10", desc: "Ueber Nacht" },
  { value: "custom", label: "Eigenes", desc: "Frei eingeben" },
];

function parseRatio(ratio) {
  if (!ratio) return null;
  const parts = ratio.split(":").map((p) => Number(p.trim()));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return { asg: parts[0], flour: parts[1], water: parts[2] };
}

function berechneMengen(ratio, asgValue) {
  const asgVal = Number(asgValue) || 0;
  if (!ratio || !ratio.asg) return null;
  return {
    flour_g: Math.round((asgVal * ratio.flour) / ratio.asg),
    water_g: Math.round((asgVal * ratio.water) / ratio.asg),
  };
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

  const defaultRatio = parseRatio(starter.default_ratio) ?? { asg: 1, flour: 2, water: 2 };
  const defaultRatioStr = `${defaultRatio.asg}:${defaultRatio.flour}:${defaultRatio.water}`;
  const baseAsg = 20;

  const initialPreset = VERHAELTNIS_PRESETS.find((p) => p.value === defaultRatioStr)
    ? defaultRatioStr
    : "custom";

  const [verhaeltnis, setVerhaeltnis] = useState(initialPreset);
  const [customRatio, setCustomRatio] = useState({
    asg: defaultRatio.asg,
    flour: defaultRatio.flour,
    water: defaultRatio.water,
  });
  const [autoCalc, setAutoCalc] = useState(true);

  const [form, setForm] = useState({
    asg_g: baseAsg,
    flour_g: Math.round((baseAsg * defaultRatio.flour) / defaultRatio.asg),
    water_g: Math.round((baseAsg * defaultRatio.water) / defaultRatio.asg),
    temperature: 24,
    state: "aktiv",
    notes: "",
    photo_path: null,
  });

  const activeRatio =
    verhaeltnis === "custom" ? customRatio : parseRatio(verhaeltnis);

  // Wenn sich das empfohlene Verhaeltnis des Starters aendert (z.B. durch einen Pflege-Modus),
  // die Vorauswahl in der Fuetterung uebernehmen.
  useEffect(() => {
    const r = parseRatio(starter.default_ratio);
    if (!r) return;
    const str = `${r.asg}:${r.flour}:${r.water}`;
    const isPreset = VERHAELTNIS_PRESETS.some((p) => p.value === str);
    if (isPreset) {
      setVerhaeltnis(str);
    } else {
      setVerhaeltnis("custom");
      setCustomRatio({ asg: r.asg, flour: r.flour, water: r.water });
    }
    setAutoCalc(true);
  }, [starter.default_ratio]);

  // Mengen automatisch nachziehen, wenn sich ASG oder das eigene Verhaeltnis aendert
  useEffect(() => {
    if (!autoCalc) return;
    const ratio =
      verhaeltnis === "custom" ? customRatio : parseRatio(verhaeltnis);
    const mengen = berechneMengen(ratio, form.asg_g);
    if (mengen) setForm((f) => ({ ...f, ...mengen }));
  }, [verhaeltnis, customRatio.asg, customRatio.flour, customRatio.water, form.asg_g, autoCalc]);

  // Klick auf einen Verhaeltnis-Knopf: sofort ausrechnen und Auto-rechnen wieder anschalten
  function selectVerhaeltnis(presetValue) {
    setVerhaeltnis(presetValue);
    setAutoCalc(true);
    const ratio =
      presetValue === "custom" ? customRatio : parseRatio(presetValue);
    const mengen = berechneMengen(ratio, form.asg_g);
    if (mengen) setForm((f) => ({ ...f, ...mengen }));
  }

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateCustomRatio(key, value) {
    const num = Number(value) || 0;
    setCustomRatio((r) => ({ ...r, [key]: num }));
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

    const ratioString = activeRatio
      ? `${activeRatio.asg}:${activeRatio.flour}:${activeRatio.water}`
      : null;

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
      ratio_used: ratioString,
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

  const totalGramm =
    Number(form.asg_g || 0) + Number(form.flour_g || 0) + Number(form.water_g || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label mb-2 block">Verhaeltnis (ASG : Mehl : Wasser)</label>
        <div className="grid grid-cols-3 gap-2">
          {VERHAELTNIS_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => selectVerhaeltnis(preset.value)}
              className={`rounded-2xl border px-3 py-2 text-center transition-all ${
                verhaeltnis === preset.value
                  ? "border-terra-500 bg-terra-500/10"
                  : "border-mauve-500/25 bg-cream-50 hover:border-terra-500/50"
              }`}
            >
              <div className="text-sm font-semibold text-cocoa-800">
                {preset.label}
              </div>
              <div className="text-[10px] text-cocoa-700/60">{preset.desc}</div>
            </button>
          ))}
        </div>

        {verhaeltnis === "custom" && (
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border border-mauve-500/25 bg-cream-50 p-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-mauve-700">
                ASG
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={customRatio.asg}
                onChange={(e) => updateCustomRatio("asg", e.target.value)}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-mauve-700">
                Mehl
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={customRatio.flour}
                onChange={(e) => updateCustomRatio("flour", e.target.value)}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-mauve-700">
                Wasser
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={customRatio.water}
                onChange={(e) => updateCustomRatio("water", e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-mauve-500/25 bg-cream-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-mauve-700">
            Mengen (in Gramm)
          </span>
          <label className="flex items-center gap-2 text-xs text-cocoa-700/70">
            <input
              type="checkbox"
              checked={autoCalc}
              onChange={(e) => setAutoCalc(e.target.checked)}
              className="rounded"
            />
            Auto-rechnen
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label" htmlFor="asg_g">
              ASG (g)
            </label>
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
            <label className="label" htmlFor="flour_g">
              Mehl (g)
            </label>
            <input
              id="flour_g"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              required
              className={`input ${autoCalc ? "bg-cream-200/40" : ""}`}
              value={form.flour_g}
              onChange={(e) => {
                update("flour_g", e.target.value);
                setAutoCalc(false);
              }}
            />
          </div>
          <div>
            <label className="label" htmlFor="water_g">
              Wasser (g)
            </label>
            <input
              id="water_g"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              required
              className={`input ${autoCalc ? "bg-cream-200/40" : ""}`}
              value={form.water_g}
              onChange={(e) => {
                update("water_g", e.target.value);
                setAutoCalc(false);
              }}
            />
          </div>
        </div>

        {totalGramm > 0 && (
          <div className="mt-2 text-center text-[11px] text-cocoa-700/60">
            Gesamt: {totalGramm}g
          </div>
        )}
      </div>

      <div>
        <label className="label" htmlFor="temperature">
          Temperatur (°C)
        </label>
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
        <label className="label" htmlFor="notes">
          Notiz
        </label>
        <textarea
          id="notes"
          rows={2}
          className="input resize-none"
          placeholder="Riecht fruchtig, viele Blaeschen ..."
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
        {loading ? "Speichert ..." : "Fuetterung eintragen"}
      </button>
    </form>
  );
}
