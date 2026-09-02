"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const GRUNDSTOCK = [
  {
    id: "g1",
    name: "Einfaches Weizensauerteigbrot",
    zutaten:
      "500 g Weizenmehl 550\n350 g Wasser\n100 g aktives Anstellgut\n10 g Salz",
    schritte:
      "1. Mehl und Wasser vermengen, 30 Min. Autolyse.\n2. Anstellgut und Salz einarbeiten.\n3. 4 Stunden Stockgare mit 3-4x Dehnen und Falten.\n4. Rund wirken, 20 Min. Ruhe, final formen.\n5. Über Nacht im Kühlschrank (8-12 h).\n6. Bei 250 °C mit Dampf 20 Min., dann 220 °C 20-25 Min. backen.",
    mehl_gramm: 500,
    hydration: 70,
  },
  {
    id: "g2",
    name: "Roggenmischbrot",
    zutaten:
      "300 g Roggenmehl 1150\n200 g Weizenmehl 1050\n375 g Wasser\n150 g Roggen-Anstellgut\n11 g Salz",
    schritte:
      "1. Alles zu einem klebrigen Teig vermengen.\n2. 2-3 Stunden Stockgare (warm).\n3. In eine gefettete Kastenform geben.\n4. 60-90 Min. Stückgare, bis der Teig sichtbar aufgeht.\n5. Bei 240 °C mit Dampf 15 Min., dann 200 °C 40-45 Min. backen.",
    mehl_gramm: 500,
    hydration: 75,
  },
  {
    id: "g3",
    name: "Dinkel-Vollkornbrot",
    zutaten:
      "500 g Dinkelvollkornmehl\n375 g Wasser\n100 g Anstellgut\n10 g Salz\n1 EL Honig",
    schritte:
      "1. Zutaten vermengen (Dinkel nicht zu lange kneten).\n2. 3 Stunden Stockgare mit 2x Dehnen und Falten.\n3. Formen und in ein Gärkörbchen setzen.\n4. 60 Min. Stückgare.\n5. Bei 230 °C mit Dampf 15 Min., dann 210 °C 35 Min. backen.",
    mehl_gramm: 500,
    hydration: 75,
  },
];

export default function RezeptePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeFolder, setActiveFolder] = useState("alle");
  const [view, setView] = useState("list");
  const [detail, setDetail] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: "",
    ordner_id: "",
    zutaten: "",
    schritte: "",
    mehl_gramm: "",
    hydration: "",
  };
  const [form, setForm] = useState(emptyForm);

  async function loadData() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUserId(user.id);

    const { data: f } = await supabase
      .from("rezept_ordner")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setFolders(f || []);

    const { data: r } = await supabase
      .from("rezepte")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRecipes(r || []);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addFolder() {
    const name = window.prompt("Name des Ordners?");
    if (!name || !name.trim()) return;
    const { data, error } = await supabase
      .from("rezept_ordner")
      .insert({ user_id: userId, name: name.trim() })
      .select()
      .single();
    if (!error && data) {
      setFolders((prev) => [...prev, data]);
    }
  }

  async function saveRecipe() {
    if (!form.name.trim()) {
      window.alert("Bitte gib deinem Rezept einen Namen.");
      return;
    }
    setSaving(true);
    const payload = {
      user_id: userId,
      name: form.name.trim(),
      ordner_id: form.ordner_id || null,
      zutaten: form.zutaten || null,
      schritte: form.schritte || null,
      mehl_gramm: form.mehl_gramm ? Number(form.mehl_gramm) : null,
      hydration: form.hydration ? Number(form.hydration) : null,
    };
    const { data, error } = await supabase
      .from("rezepte")
      .insert(payload)
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      setRecipes((prev) => [data, ...prev]);
      setForm(emptyForm);
      setView("list");
    } else {
      window.alert("Konnte nicht speichern. Bitte nochmal versuchen.");
    }
  }

  async function deleteRecipe(id) {
    if (!window.confirm("Dieses Rezept wirklich löschen?")) return;
    await supabase.from("rezepte").delete().eq("id", id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    setDetail(null);
    setView("list");
  }

  function copyGrundstock(rec) {
    setForm({
      name: rec.name,
      ordner_id: "",
      zutaten: rec.zutaten || "",
      schritte: rec.schritte || "",
      mehl_gramm: rec.mehl_gramm ? String(rec.mehl_gramm) : "",
      hydration: rec.hydration ? String(rec.hydration) : "",
    });
    setDetail(null);
    setView("new");
  }

  const visibleRecipes =
    activeFolder === "alle"
      ? recipes
      : activeFolder === "ohne"
      ? recipes.filter((r) => !r.ordner_id)
      : recipes.filter((r) => r.ordner_id === activeFolder);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-cocoa-700/70">Rezepte werden geladen …</p>
      </div>
    );
  }

  // ---------- Detail-Ansicht ----------
  if (view === "detail" && detail) {
    const isGrund = String(detail.id).startsWith("g");
    return (
      <div className="pt-2">
        <button
          onClick={() => {
            setDetail(null);
            setView("list");
          }}
          className="btn-ghost -ml-3 text-sm"
        >
          ← Zurück
        </button>
        <h1 className="mt-3 font-display text-3xl text-cocoa-900">
          {detail.name}
        </h1>
        {(detail.mehl_gramm || detail.hydration) && (
          <p className="mt-1 text-sm text-cocoa-700/70">
            {detail.mehl_gramm ? `${detail.mehl_gramm} g Mehl` : ""}
            {detail.mehl_gramm && detail.hydration ? " · " : ""}
            {detail.hydration ? `${detail.hydration} % Hydration` : ""}
          </p>
        )}

        {detail.zutaten && (
          <div className="card mt-5">
            <h2 className="font-display text-xl text-cocoa-900">Zutaten</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-cocoa-800">
              {detail.zutaten}
            </p>
          </div>
        )}
        {detail.schritte && (
          <div className="card mt-4">
            <h2 className="font-display text-xl text-cocoa-900">Zubereitung</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-cocoa-800">
              {detail.schritte}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {isGrund ? (
            <button
              onClick={() => copyGrundstock(detail)}
              className="btn-primary"
            >
              In meine Rezepte übernehmen
            </button>
          ) : (
            <button
              onClick={() => deleteRecipe(detail.id)}
              className="btn-ghost text-sm text-terra-600"
            >
              Rezept löschen
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------- Neu-Formular ----------
  if (view === "new") {
    return (
      <div className="pt-2">
        <button
          onClick={() => {
            setForm(emptyForm);
            setView("list");
          }}
          className="btn-ghost -ml-3 text-sm"
        >
          ← Abbrechen
        </button>
        <h1 className="mt-3 font-display text-3xl text-cocoa-900">
          Neues Rezept
        </h1>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-cocoa-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="z. B. Mein Bauernbrot"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-cocoa-700">Ordner</label>
            <select
              value={form.ordner_id}
              onChange={(e) => setForm({ ...form, ordner_id: e.target.value })}
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
            >
              <option value="">Kein Ordner</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-cocoa-700">
                Mehl (g)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={form.mehl_gramm}
                onChange={(e) =>
                  setForm({ ...form, mehl_gramm: e.target.value })
                }
                placeholder="500"
                className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-cocoa-700">
                Hydration (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={form.hydration}
                onChange={(e) =>
                  setForm({ ...form, hydration: e.target.value })
                }
                placeholder="70"
                className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-cocoa-700">Zutaten</label>
            <textarea
              value={form.zutaten}
              onChange={(e) => setForm({ ...form, zutaten: e.target.value })}
              rows={5}
              placeholder="Eine Zutat pro Zeile"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-cocoa-700">
              Zubereitung
            </label>
            <textarea
              value={form.schritte}
              onChange={(e) => setForm({ ...form, schritte: e.target.value })}
              rows={7}
              placeholder="Schritt für Schritt"
              className="w-full rounded-xl border border-cocoa-200 bg-white px-4 py-3 text-sm"
            />
          </div>

          <button
            onClick={saveRecipe}
            disabled={saving}
            className="btn-primary w-full"
          >
            {saving ? "Speichert …" : "Rezept speichern"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Listen-Ansicht ----------
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cocoa-900">Rezepte</h1>
        <button onClick={addFolder} className="btn-ghost text-sm">
          + Ordner
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFolder("alle")}
          className={
            "rounded-full px-4 py-2 text-sm " +
            (activeFolder === "alle"
              ? "bg-cocoa-900 text-white"
              : "bg-white text-cocoa-800 border border-cocoa-200")
          }
        >
          Alle
        </button>
        {folders.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            className={
              "rounded-full px-4 py-2 text-sm " +
              (activeFolder === f.id
                ? "bg-cocoa-900 text-white"
                : "bg-white text-cocoa-800 border border-cocoa-200")
            }
          >
            {f.name}
          </button>
        ))}
        <button
          onClick={() => setActiveFolder("ohne")}
          className={
            "rounded-full px-4 py-2 text-sm " +
            (activeFolder === "ohne"
              ? "bg-cocoa-900 text-white"
              : "bg-white text-cocoa-800 border border-cocoa-200")
          }
        >
          Ohne Ordner
        </button>
      </div>

      <button
        onClick={() => {
          setForm(emptyForm);
          setView("new");
        }}
        className="btn-primary mt-5 w-full"
      >
        + Neues Rezept
      </button>

      {visibleRecipes.length > 0 && (
        <div className="mt-5 space-y-3">
          {visibleRecipes.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setDetail(r);
                setView("detail");
              }}
              className="card flex w-full items-center justify-between text-left"
            >
              <div>
                <p className="font-display text-lg text-cocoa-900">{r.name}</p>
                {(r.mehl_gramm || r.hydration) && (
                  <p className="text-xs text-cocoa-700/60">
                    {r.mehl_gramm ? `${r.mehl_gramm} g Mehl` : ""}
                    {r.mehl_gramm && r.hydration ? " · " : ""}
                    {r.hydration ? `${r.hydration} %` : ""}
                  </p>
                )}
              </div>
              <span className="text-cocoa-400">›</span>
            </button>
          ))}
        </div>
      )}

      {visibleRecipes.length === 0 && (
        <p className="mt-6 text-center text-sm text-cocoa-700/60">
          Noch keine eigenen Rezepte hier. Leg dein erstes an oder übernimm eins
          aus dem Grundstock.
        </p>
      )}

      {activeFolder === "alle" && (
        <div className="mt-8">
          <h2 className="font-display text-xl text-cocoa-900">Grundstock</h2>
          <p className="mb-3 text-xs text-cocoa-700/60">
            Fertige Rezepte zum Ausprobieren – tippe zum Ansehen oder übernehmen.
          </p>
          <div className="space-y-3">
            {GRUNDSTOCK.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setDetail(r);
                  setView("detail");
                }}
                className="card flex w-full items-center justify-between text-left"
              >
                <p className="font-display text-lg text-cocoa-900">{r.name}</p>
                <span className="text-cocoa-400">›</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
