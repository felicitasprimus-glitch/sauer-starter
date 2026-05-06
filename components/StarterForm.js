"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StarterForm({ initial, mode = "create" }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    flour_type: initial?.flour_type ?? "",
    hydration: initial?.hydration ?? 100,
    default_ratio: initial?.default_ratio ?? "1:1:1",
    start_date: initial?.start_date ?? new Date().toISOString().slice(0, 10),
    notes: initial?.notes ?? "",
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
      flour_type: form.flour_type.trim() || null,
      hydration: Number(form.hydration) || 100,
      default_ratio: form.default_ratio.trim() || "1:1:1",
      start_date: form.start_date || null,
      notes: form.notes.trim() || null,
    };

    if (mode === "edit" && initial?.id) {
      const { error } = await supabase
        .from("starters")
        .update(payload)
        .eq("id", initial.id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(`/starter/${initial.id}`);
      router.refresh();
    } else {
      const { data, error } = await supabase
        .from("starters")
        .insert({ ...payload, user_id: user.id })
        .select()
        .single();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push(`/starter/${data.id}`);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Diesen Starter wirklich löschen? Alle Fütterungen gehen mit.")) return;
    setLoading(true);
    const { error } = await supabase
      .from("starters")
      .delete()
      .eq("id", initial.id);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label" htmlFor="name">Name *</label>
        <input
          id="name"
          required
          className="input"
          placeholder="z. B. Hildegard, Roggen-Romeo …"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="flour_type">Mehlart</label>
        <input
          id="flour_type"
          className="input"
          placeholder="z. B. Roggen 1150, Weizen 550"
          value={form.flour_type}
          onChange={(e) => update("flour_type", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="hydration">Hydration (%)</label>
          <input
            id="hydration"
            type="number"
            min="50"
            max="200"
            className="input"
            value={form.hydration}
            onChange={(e) => update("hydration", e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="default_ratio">Standard-Verhältnis</label>
          <input
            id="default_ratio"
            className="input"
            placeholder="1:1:1"
            value={form.default_ratio}
            onChange={(e) => update("default_ratio", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="start_date">Startdatum</label>
        <input
          id="start_date"
          type="date"
          className="input"
          value={form.start_date}
          onChange={(e) => update("start_date", e.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="notes">Notizen</label>
        <textarea
          id="notes"
          rows={4}
          className="input resize-none"
          placeholder="Herkunft, Charakter, Lieblings-Brot …"
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
          {loading ? "Speichert …" : mode === "edit" ? "Änderungen sichern" : "Starter anlegen"}
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
