"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PhotoUpload from "./PhotoUpload";

const CRUST_OPTIONS = [
  { key: "hell", label: "Hell" },
  { key: "goldbraun", label: "Goldbraun" },
  { key: "dunkel", label: "Dunkel" },
  { key: "rustikal", label: "Rustikal" },
];

const CRUMB_OPTIONS = [
  { key: "fein", label: "Fein" },
  { key: "mittel", label: "Mittel" },
  { key: "offen", label: "Offen" },
  { key: "wild_offen", label: "Wild offen" },
];

export default function BrotForm({ initial, mode = "create", starters = [] }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, [supabase]);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    starter_id: initial?.starter_id ?? "",
    baked_at: initial?.baked_at ?? new Date().toISOString().slice(0, 10),
    flour_types: initial?.flour_types ?? "",
    hydration: initial?.hydration ?? "",
    rating: initial?.rating ?? 0,
    crust: initial?.crust ?? "",
    crumb: initial?.crumb ?? "",
    notes: initial?.notes ?? "",
    photo_path: initial?.photo_path ?? null,
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

    const payload = {
      name: form.name.trim(),
      starter_id: form.starter_id || null,
      baked_at: form.baked_at,
      flour_types: form.flour_types.trim() || null,
      hydration: form.hydration ? Number(form.hydration) : null,
      rating: form.rating || null,
      crust: form.crust || null,
      crumb: form.crumb || null,
      notes: form.notes.trim() || null,
      photo_path: form.photo_path,
    };

    if (mode === "edit" && initial?.id) {
      const { error } = await supabase
        .from("brote")
        .update(payload)
        .eq("id", initial.id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(`/brote/${initial.id}`);
      router.refresh();
    } else {
      const { data, error } = await supabase
        .from("brote")
        .insert({ ...payload, user_id: user.id })
        .select()
        .single();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(`/brote/${data.id}`);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Dieses Brot wirklich löschen?")) return;
    setLoading(true);
    if (initial.photo_path) {
      await supabase.storage.from("photos").remove([initial.photo_path]);
    }
    const { error } = await supabase.from("brote").delete().eq("id", initial.id);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/brote");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Foto ganz oben — wichtigster Hingucker */}
      {userId && (
        <div>
          <label className="label">Foto</label>
          <PhotoUpload
            value={form.photo_path}
            onChange={(path) => update("photo_path", path)}
            userId={userId}
            folder="brote"
          />
        </div>
      )}

      <div>
        <label className="label" htmlFor="name">Name *</label>
        <input
          id="name"
          required
          className="input"
          placeholder="z. B. Roggenbrot, Bauernlaib, Vollkorntoast …"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="baked_at">Gebacken am</label>
          <input
            id="baked_at"
            type="date"
            className="input"
            value={form.baked_at}
            onChange={(e) => update("baked_at", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="hydration">TA gesamt (%)</label>
          <input
            id="hydration"
            type="number"
            inputMode="decimal"
            min="50"
            max="200"
            className="input"
            placeholder="z. B. 75"
            value={form.hydration}
            onChange={(e) => update("hydration", e.target.value)}
          />
        </div>
      </div>

      {starters.length > 0 && (
        <div>
          <label className="label" htmlFor="starter_id">Mit welchem Starter?</label>
          <select
            id="starter_id"
            className="input"
            value={form.starter_id}
            onChange={(e) => update("starter_id", e.target.value)}
          >
            <option value="">— Kein Starter zugeordnet —</option>
            {starters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="label" htmlFor="flour_types">Mehlsorten</label>
        <input
          id="flour_types"
          className="input"
          placeholder="z. B. 70% Weizen 550, 30% Roggen 1150"
          value={form.flour_types}
          onChange={(e) => update("flour_types", e.target.value)}
        />
      </div>

      <div>
        <label className="label">Bewertung</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update("rating", n === form.rating ? 0 : n)}
              className="text-3xl transition-transform hover:scale-110"
              aria-label={`${n} von 5 Sternen`}
            >
              <span className={n <= form.rating ? "text-honey-500" : "text-mauve-500/25"}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Kruste</label>
        <div className="flex flex-wrap gap-2">
          {CRUST_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => update("crust", opt.key === form.crust ? "" : opt.key)}
              className={`chip transition-all ${
                form.crust === opt.key
                  ? "border-terra-500 bg-terra-500 text-cream-50"
                  : "border-mauve-500/25 bg-cream-50 text-cocoa-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Krume</label>
        <div className="flex flex-wrap gap-2">
          {CRUMB_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => update("crumb", opt.key === form.crumb ? "" : opt.key)}
              className={`chip transition-all ${
                form.crumb === opt.key
                  ? "border-terra-500 bg-terra-500 text-cream-50"
                  : "border-mauve-500/25 bg-cream-50 text-cocoa-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="notes">Notizen</label>
        <textarea
          id="notes"
          rows={4}
          className="input resize-none"
          placeholder="Was ist gut gelaufen, was würdest du anders machen?"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-terra-500/40 bg-terra-500/10 px-4 py-3 text-sm text-terra-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Speichert …" : mode === "edit" ? "Änderungen sichern" : "Brot eintragen"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            className="btn-ghost text-terra-700"
            disabled={loading}
          >
            Löschen
          </button>
        )}
      </div>
    </form>
  );
}
