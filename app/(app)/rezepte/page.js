"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const GRUNDSTOCK = [
  {
    "id": "g1",
    "kategorie": "Brote",
    "name": "Grundrezept Sauerteigbrot",
    "mehl_gramm": 500,
    "hydration": 66,
    "zutaten": "TEIG\n450 g Weizenmehl 550\n50 g Weizenvollkornmehl\n330 g Wasser, lauwarm\n100 g aktiver Sauerteigstarter\n10 g Salz\n\nHinweis: Der Starter sollte sich zuverlässig verdoppeln, bevor du ihn verwendest – er ist der Motor dieses Brots.",
    "schritte": "1. Autolyse: Mehle und Wasser mischen, bis keine trockenen Stellen mehr sichtbar sind. Abgedeckt 45 Min. ruhen lassen.\n2. Hauptteig: Aktiven Starter mit feuchten Händen einkneten, danach das Salz einarbeiten.\n3. Stockgare: 3–4 Std. bei 24–26 °C. In den ersten 2 Std. 3 Stretch & Folds. Ziel: ca. 60–70 % Volumenzunahme, gewölbte Oberfläche, Bläschen am Rand.\n4. Formen: Teig sanft rund- oder langwirken, bis die Oberfläche straff ist. Schluss nach oben ins bemehlte Gärkörbchen.\n5. Stückgare: Über Nacht (8–12 Std.) im Kühlschrank – oder 60–90 Min. warm, bis der Fingertest passt.\n\nBACKEN\nOfenmeister: kalt einschießen, 45–50 Min. bei 230 °C Ober-/Unterhitze, Deckel nach 35 Min. abnehmen.\nGusseisentopf: 30–45 Min. bei 250 °C vorheizen, 20 Min. mit Deckel bei 250 °C, dann 20–25 Min. offen bei 220 °C. Vorher ca. 1 cm tief einschneiden. Vollständig auskühlen lassen!\n\nTIPP: Basis aller Brote dieser Serie. Für mehr Aroma 50 g Mehl durch Roggenvollkorn ersetzen.\nVariationen: Saaten-Mix (80 g, geröstet), Röstzwiebeln, Oliven & Kräuter, Karotte & Walnuss, 20 % Dinkel."
  },
  {
    "id": "g2",
    "kategorie": "Brote",
    "name": "Pizza-Sauerteigbrot",
    "mehl_gramm": 500,
    "hydration": null,
    "zutaten": "TEIG\n500 g Weizenmehl 550\n170 g Wasser, lauwarm\n250 g passierte Tomaten\n100 g aktiver Sauerteigstarter\n10 g Salz\n2 TL italienische Kräuter\n½ TL Knoblauchpulver\n\nFÜLLUNG\n150 g Mozzarella oder Gouda, gerieben & gut abgetropft\n80 g Salami, in Stücken\n40 g Parmesan, gerieben\n60 g Oliven, halbiert\n\nOPTIONAL\nPaprika gewürfelt · Mais · Peperoni · Röstzwiebeln",
    "schritte": "1. Teig mischen: Starter, Wasser und passierte Tomaten verrühren. Mehl, Salz, Kräuter und Knoblauchpulver zugeben, zu einem klebrigen Teig mischen. 30 Min. ruhen lassen.\n2. Stockgare: 3–4 Std. bei 24–26 °C mit 3–4 Stretch & Folds im 30-Min.-Takt.\n3. Füllung Teil 1: Beim zweiten Fold die Oliven (und feste Wunschzutaten, gut abgetropft) auf dem Teig verteilen und einfalten.\n4. Formen mit Füllung: Teig ausbreiten, Salami und geriebenen Käse verteilen und beim Aufrollen einklappen. Straff formen, Schluss nach oben. Tipp: Alle Zutaten erst beim Formen einklappen hält sie schön in Schichten.\n5. Stückgare: Über Nacht im Kühlschrank oder 2–3 Std. warm, bis der Teig sichtbar aufgegangen ist.\n\nWICHTIG · TOMATEN SIND FLÜSSIGKEIT\nDie passierten Tomaten ersetzen einen Teil des Wassers – deshalb weniger Wasser als im Grundrezept. Sehr flüssige Tomaten? 20 g Wasser zurückhalten.\n\nBACKEN\nOfenmeister (kalt) oder vorgeheizter Gusseisentopf: 25 Min. mit Deckel bei 240 °C, dann 20 Min. offen bei 215 °C. Ausgetretener, gebräunter Käse ist das Highlight!\n\nTIPP: Mozzarella gut ausdrücken – je trockener der Käse, desto stabiler die Krume. Frisches Basilikum beim Servieren."
  },
  {
    "id": "g3",
    "kategorie": "Brote",
    "name": "Haselnuss-Apfel-Zimt-Brot",
    "mehl_gramm": 500,
    "hydration": null,
    "zutaten": "TEIG\n450 g Weizenmehl 550\n50 g Weizenvollkornmehl\n250 g Wasser + 25 g reserviert\n200 g Apfel, grob gerieben\n100 g aktiver Sauerteigstarter\n10 g Salz\n100 g Haselnüsse, geröstet & gehackt\n\nZIMTFÜLLUNG\n45 g Butter, weich (oder braune Butter, abgekühlt)\n80 g brauner Zucker\n1 TL Zimt\n1 TL Speisestärke\n½ TL Vanilleextrakt\n1 Prise Salz",
    "schritte": "1. Vorbereiten: Äpfel grob reiben und leicht ausdrücken. Haselnüsse in der Pfanne rösten, grob hacken.\n2. Teig mischen: Starter, Wasser, geriebenen Apfel und Mehle verrühren, 30 Min. ruhen. Dann Salz mit dem restlichen Wasser einarbeiten.\n3. Stockgare: 3–4 Std. bei 24–26 °C mit 3 Stretch & Folds. Beim zweiten Fold die Haselnüsse einarbeiten. Ziel: 40–50 % Volumenzunahme.\n4. Zimtfüllung: Weiche (oder braune) Butter mit Zucker, Zimt, Vanille, Stärke und Salz zu einer Paste verrühren.\n5. Formen mit Füllung: Teig zum Quadrat ausziehen, ⅔ der Paste aufstreichen, Seiten zur Mitte falten, restliche Paste darauf, aufrollen. Zügig arbeiten, direkt ins Gärkörbchen.\n6. Stückgare: Über Nacht (12–18 Std.) im Kühlschrank.\n\nWARUM ZIMT-ZUCKER ERST BEIM FORMEN?\nZucker zieht Wasser aus dem Teig (macht ihn weich), und Zimt bremst die Sauerteig-Mikroorganismen. Erst beim Formen eingearbeitet bleibt beides als karamellige Swirl-Schicht.\n\nBACKEN\nOfenmeister/Gusseisentopf: 25 Min. mit Deckel bei 240 °C, dann offen 20 Min. bei 200 °C (niedriger, damit austretender Zucker nicht verbrennt). Blech eine Schiene tiefer schützt den Boden.\n\nTIPP: Braune Butter hebt das Nussaroma. Säuerliche Äpfel (Boskoop, Elstar) halten die Balance zur Süße."
  },
  {
    "id": "g4",
    "kategorie": "Brote",
    "name": "Walnuss-Feigen-Brot",
    "mehl_gramm": 500,
    "hydration": 66,
    "zutaten": "TEIG\n500 g Weizenmehl\n330 g Wasser\n100 g aktiver Sauerteigstarter\n10 g Salz\n\nFÜLLUNG\n80–100 g Walnüsse, grob gehackt & angeröstet\n80–100 g getrocknete Feigen, gewürfelt\n80–100 g karamellisierte Balsamico-Zwiebeln\n1–2 EL frischer Rosmarin, fein gehackt",
    "schritte": "1. Autolyse: Mehl, Wasser und Starter vermengen und 30–60 Min. ruhen lassen.\n2. Salz einkneten.\n3. Stockgare: 3–4 Stretch & Folds. Walnüsse und Feigen beim ersten oder zweiten Fold vorsichtig einarbeiten.\n4. Formen: Karamellisierte Balsamico-Zwiebeln und Rosmarin beim Formen auf den ausgebreiteten Teig geben, dann straff aufrollen.\n5. Stückgare: Schluss nach oben ins Gärkörbchen. Direkt backen oder über Nacht im Kühlschrank reifen lassen.\n\nBACKEN\nLilly: ca. 45 Min. – für kräftige Kruste 5–10 Min. ohne Deckel fertig backen. Alternativ Gusseisentopf: 25 Min. mit Deckel bei 240 °C + 20 Min. offen bei 215 °C.\n\nTIPP: Walnüsse vorher anrösten. Zwiebeln gut auskühlen lassen. Passende Käse: Bergkäse, Ziegenfrischkäse, Gorgonzola dolce, Brie, Manchego."
  },
  {
    "id": "g5",
    "kategorie": "Brote",
    "name": "Jalapeño-Cheddar-Brot",
    "mehl_gramm": 500,
    "hydration": 68,
    "zutaten": "TEIG\n450 g Weizenmehl 550\n50 g Weizenvollkornmehl\n340 g Wasser, lauwarm\n100 g aktiver Sauerteigstarter\n11 g Salz\n\nFÜLLUNG\n170 g Cheddar (mittelalt), 1-cm-Würfel\n70 g eingelegte Jalapeños, abgetropft & gehackt\n\nOPTIONAL\n80 g Bacon, knusprig & zerkrümelt\n30 g Frühlingszwiebeln, in Ringen",
    "schritte": "1. Autolyse: Mehle und Wasser mischen, 45 Min. abgedeckt ruhen lassen.\n2. Hauptteig: Starter einkneten, dann Salz einarbeiten.\n3. Stockgare: 3–4 Std. bei 24–26 °C mit 3 Stretch & Folds. Beim zweiten Fold Cheddar, Jalapeños und Wunschzutaten einfalten. Ziel: 60–70 % Volumenzunahme.\n4. Formen: Rundwirken, bis die Oberfläche straff ist. Herausschauende Käsewürfel sanft hineindrücken – freiliegender Käse verbrennt.\n5. Stückgare: Über Nacht (8–12 Std.) im Kühlschrank oder 60–90 Min. warm.\n\nSO LÄUFT DER KÄSE NICHT AUS\nWürfel statt Reibekäse (Würfel bilden Taschen), beim Falten komplett mit Teig umschließen, sichtbare Stücke vor der Gare unter die Oberfläche drücken.\n\nBACKEN\nOfenmeister (kalt) oder Gusseisentopf: 20 Min. mit Deckel bei 250 °C, dann 20–25 Min. offen bei 220 °C. Mind. 1 Std. auskühlen lassen.\n\nTIPP: Eingelegte Jalapeños sind mild-würzig. Schärfer: ⅓ durch frische ersetzen. Milder: Kerne entfernen. Dips: Sour Cream mit Limette, Guacamole, Honig-Senf."
  },
  {
    "id": "g6",
    "kategorie": "Brote",
    "name": "Dubai-Schokoladenbrot",
    "mehl_gramm": null,
    "hydration": null,
    "zutaten": "SCHOKOTEIG (AUSSEN)\n460 g Weizenmehl 550\n40 g Backkakao\n290 g Wasser\n100 g aktiver Sauerteig\n40 g brauner Zucker\n30 g Butter, weich\n10 g Salz\n100 g backfeste Zartbitter-Schokotropfen\n\nPISTAZIENTEIG (INNEN)\n500 g Weizenmehl 550\n260 g Wasser\n100 g aktiver Sauerteig\n40 g Zucker\n40 g Pistazienmus (100 %)\n150 g Pistazien, gehackt\n10 g Salz\n\nFÜLLUNG\n100 g Engelshaar (Kadayif)\n70 g Pistazienmus (100 %)\n20 g Puderzucker\n10 g Butter",
    "schritte": "1. Autolyse (beide Teige getrennt): Jeweils Mehl (+ Kakao beim Schokoteig) und Wasser mischen, 45 Min. ruhen. Ein Teil des Wassers im Schokoteig darf durch Kaffee ersetzt werden.\n2. Hauptteige: Jeweils Starter einkneten, Zucker unterkneten. Schokoteig: Butter, dann Salz. Pistazienteig: Pistazienmus, dann Salz.\n3. Stockgare: Schokoteig 2,5–3 Std. (Ziel 60–65 %), beim 1. Fold Schokotropfen einarbeiten. Pistazienteig 3–4 Std. (Ziel 70–75 %), Pistazien einarbeiten. Jeweils bei 22–24 °C.\n4. Engelshaar-Füllung: Kadayif zerbröseln, in Butter goldbraun rösten, vollständig abkühlen. Pistazienmus und Puderzucker unterheben, bis eine formbare Masse entsteht.\n5. Füllen & Formen: Schokoteig zum Rechteck (1–1,5 cm), Pistazienteig gleich groß daraufsetzen. Füllung auf den Pistazienteig streichen, 2 cm Rand lassen. Wie ein Päckchen falten, Nähte versiegeln, umdrehen, sanft Spannung aufbauen.\n6. Endruhe: 30–45 Min. bei Raumtemperatur oder über Nacht im Kühlschrank.\n\nBACKEN\nGusseisentopf inkl. Deckel mind. 30 Min. bei 225 °C vorheizen, dann 40 Min. bei 225 °C mit Deckel. Ofenmeister: kalt einschießen, 50 Min. bei 225 °C, letzte 10 Min. offen.\n\nTIPP: Engelshaar vollständig abkühlen, bevor Pistazienmus dazukommt. Nähte doppelt prüfen – nur eine dichte Hülle hält die Füllung.\nVariationen: Haselnussmus statt Pistazie, weiße Schokotropfen, Orangenabrieb im Schokoteig, Meersalzflocken aufs fertige Brot."
  },
  {
    "id": "g7",
    "kategorie": "Brote",
    "name": "Kürbisbrot – Pumpkin Spice",
    "mehl_gramm": 1000,
    "hydration": 70,
    "zutaten": "Ergibt 2 Brote.\n\nTEIG\n1000 g Pizzeria-Mehl\nca. 700 g Wasser\n400 g aktiver Sauerteigstarter\n1 Hokkaido-Kürbis\n25 g Salz\n\nPUMPKIN SPICE\n4 TL Zimt\n2 TL gemahlener Ingwer\n1 TL Muskat\n1 TL gemahlene Nelken\n½ TL Piment\n\nPUMPKIN-SPICE-BUTTER\n250 g weiche Butter\nbrauner Zucker nach Geschmack\n2 EL Speisestärke\nkomplette Pumpkin-Spice-Mischung",
    "schritte": "1. Hokkaido würfeln, ca. 15 Min. im Ofen weich backen, dann weitergaren. Nicht pürieren.\n2. Mehl, Wasser, Starter und Salz mischen. Kürbiswürfel vorsichtig einkneten.\n3. Butter, braunen Zucker, Speisestärke und die komplette Pumpkin-Spice-Mischung verrühren.\n4. Zu 2 Platten streichen, einfrieren und beim Formen zwischen die Teiglagen geben.\n5. Für die Kürbisform die Brote 30–45 Min. anfrieren, dann mit Schnüren abbinden und einschneiden.\n6. Mit Dampf backen. Etwas auslaufende Butter ist normal.\n\nTIPP\nKürbisstückchen statt Püree = saftigere Krume mit echten Stückchen. Die orange Farbe kommt nur vom Hokkaido. Serviervorschlag: noch leicht warm mit Lotus Biscoff Creme."
  },
  {
    "id": "g8",
    "kategorie": "Brote",
    "name": "Japanisches Toastbrot",
    "mehl_gramm": 1000,
    "hydration": null,
    "zutaten": "HAUPTTEIG\n1000 g starkes Mehl\n60 g Olivenöl\n50 g Zucker\nca. 300 g Lievito Madre (LM)\n23 g Salz\n550 g Wasser\n\nKOCHSTÜCK (ergibt ca. 350 g)\n100 g Mehl\n250 g Milch\n\nBRÜHSTÜCK (ergibt ca. 175 g)\n50 g Brotbrösel\n125 g Milch\n\nMEINE VARIANTE\nmit Olivenöl · statt Hefe ca. 300 g LM · Koch- und Brühstück mit Milch",
    "schritte": "Hinweis: Diese Kurzanleitung ist ein Entwurf (auf dem Bild waren nur die Zutaten). Bitte prüfen/anpassen.\n\n1. Kochstück: Mehl und Milch verrühren, unter Rühren erhitzen, bis eine puddingartige Masse entsteht. Vollständig abkühlen lassen.\n2. Brühstück: Brotbrösel mit der Milch übergießen und quellen lassen.\n3. Hauptteig: Alle Zutaten inkl. abgekühltem Koch- und Brühstück zu einem geschmeidigen, glatten Teig kneten.\n4. Stockgare bei Raumtemperatur, bis der Teig deutlich aufgegangen ist.\n5. Formen und in gefettete Kastenformen legen, Stückgare bis knapp unter den Formrand.\n6. Backen (mit Dampf), bis das Brot goldbraun ist und hohl klingt. Vollständig auskühlen lassen.\n\nTIPP: Koch- und Brühstück machen die Krume besonders saftig und lange frisch."
  }
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
          {[...new Set(GRUNDSTOCK.map((r) => r.kategorie || "Weitere"))].map(
            (kat) => (
              <div key={kat} className="mt-5">
                <h3 className="mb-2 font-display text-lg text-terra-600">
                  {kat}
                </h3>
                <div className="space-y-3">
                  {GRUNDSTOCK.filter(
                    (r) => (r.kategorie || "Weitere") === kat
                  ).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setDetail(r);
                        setView("detail");
                      }}
                      className="card flex w-full items-center justify-between text-left"
                    >
                      <p className="font-display text-lg text-cocoa-900">
                        {r.name}
                      </p>
                      <span className="text-cocoa-400">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
