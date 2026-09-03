"use client";

import { useState } from "react";

const PLUM = "#5A3D54";
const WINE = "#6E3348";
const TAUPE = "#8B796D";
const LINE = "rgba(90,61,84,.14)";
const SERIF = "'Playfair Display', Georgia, serif";

function num(v) {
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? null : n;
}
function fmt(v) {
  if (v == null || !isFinite(v)) return "–";
  const r = v >= 20 ? Math.round(v) : Math.round(v * 10) / 10;
  return String(r).replace(".", ",");
}

const cardS = {
  background: "#fff",
  border: "1px solid " + LINE,
  borderRadius: 20,
  boxShadow: "0 10px 26px -18px rgba(90,61,84,.5)",
};
const inWrap = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#FBF6EF",
  border: "1px solid " + LINE,
  borderRadius: 12,
  padding: "6px 12px",
};
const inS = {
  width: 70,
  border: "none",
  background: "transparent",
  fontSize: 17,
  fontWeight: 600,
  color: PLUM,
  textAlign: "right",
  fontFamily: "inherit",
  outline: "none",
};
const rowS = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  fontSize: 15,
  color: "#4A2F3A",
  fontWeight: 500,
  padding: "9px 0",
};
const resBox = {
  marginTop: 16,
  background: "linear-gradient(150deg,#9A6F82,#7C3E50)",
  color: "#fff",
  borderRadius: 18,
  padding: "18px 20px",
  textAlign: "center",
};
const hintS = { color: TAUPE, fontSize: 12.5, lineHeight: 1.55, margin: "14px 4px 0" };

function Field({ label, value, set, unit, step = "1" }) {
  return (
    <label style={rowS}>
      {label}
      <span style={inWrap}>
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={(e) => set(e.target.value)}
          style={inS}
        />
        {unit && <span style={{ fontSize: 13, color: "#9a8290" }}>{unit}</span>}
      </span>
    </label>
  );
}
function Big({ label, value, unit }) {
  return (
    <div style={resBox}>
      <div style={{ fontSize: 12, opacity: 0.85, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700 }}>
        {value} {unit}
      </div>
    </div>
  );
}

function Schuettwasser() {
  const [ziel, setZiel] = useState("26");
  const [mehl, setMehl] = useState("20");
  const z = num(ziel), m = num(mehl);
  let w = z != null && m != null ? 2 * z - m : null;
  if (w != null) w = Math.max(0, Math.min(60, w));
  return (
    <div>
      <div style={{ ...cardS, padding: "16px 18px" }}>
        <Field label="Zielteig-Temperatur" value={ziel} set={setZiel} unit="°C" step="0.5" />
        <div style={{ borderTop: "1px solid " + LINE }} />
        <Field label="Mehltemperatur" value={mehl} set={setMehl} unit="°C" step="0.5" />
      </div>
      <Big label="Deine Wassertemperatur" value={fmt(w)} unit="°C" />
      <p style={hintS}>Faustformel: 2 × Zielteig-Temperatur − Mehltemperatur. Ist deine Küche sehr warm, nimm etwas kälteres Wasser.</p>
    </div>
  );
}

function FeedRatio() {
  const [s, setS] = useState("20");
  const [a, setA] = useState("1");
  const [m, setM] = useState("5");
  const [w, setW] = useState("5");
  const [t, setT] = useState("24");
  const S = num(s), A = num(a), M = num(m), W = num(w), T = num(t);
  let mehl = null, wasser = null, gesamt = null, peak = null;
  if (S != null && A && M != null && W != null) {
    mehl = S * (M / A);
    wasser = S * (W / A);
    gesamt = S + mehl + wasser;
  }
  if (T != null && A) {
    const mp = M / A;
    const base = 2.5 + 0.85 * mp;
    const factor = Math.pow(2, (24 - T) / 8);
    const pk = base * factor;
    const lo = Math.max(1, Math.round(pk * 0.85));
    const hi = Math.round(pk * 1.15);
    peak = lo + "–" + (hi <= lo ? lo + 1 : hi);
  }
  return (
    <div>
      <div style={{ ...cardS, padding: "16px 18px" }}>
        <Field label="Anstellgut-Menge" value={s} set={setS} unit="g" />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid " + LINE }}>
          {[["Anstellgut", a, setA], ["Mehl", m, setM], ["Wasser", w, setW]].map(([lb, val, setter], i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: TAUPE, textTransform: "uppercase", letterSpacing: ".05em" }}>{lb}</span>
              <input type="number" inputMode="decimal" value={val} onChange={(e) => setter(e.target.value)}
                style={{ ...inS, width: "100%", textAlign: "center", background: "#FBF6EF", border: "1px solid " + LINE, borderRadius: 10, padding: "8px 4px" }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid " + LINE }}>
          <Field label="Raumtemperatur" value={t} set={setT} unit="°C" step="0.5" />
        </div>
      </div>
      <div style={{ ...resBox, textAlign: "left", padding: "14px 20px" }}>
        {[["Anstellgut", fmt(S) + " g"], ["Mehl", fmt(mehl) + " g"], ["Wasser", fmt(wasser) + " g"], ["Gesamt", fmt(gesamt) + " g"]].map(([lb, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 15, borderTop: i ? "1px solid rgba(255,255,255,.16)" : "none", fontWeight: i === 3 ? 700 : 400 }}>
            <span>{lb}</span><b>{v}</b>
          </div>
        ))}
      </div>
      <div style={{ ...resBox, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", fontSize: 15 }}>
        <span>Peak (geschätzt)</span><b>ca. {peak || "–"} Std.</b>
      </div>
      <p style={hintS}>Beispiel 1:5:5 – auf 1 Teil Anstellgut kommen 5 Teile Mehl und Wasser. Wärmer = schnellerer Peak.</p>
    </div>
  );
}

function HefeSauerteig() {
  const [fresh, setFresh] = useState("21");
  const [mehl, setMehl] = useState("500");
  const [km, setKm] = useState("500");
  const [share, setShare] = useState("50");
  const f = num(fresh), me = num(mehl), K = num(km);
  let ks = num(share); if (ks == null) ks = 0; ks = Math.max(0, Math.min(100, ks));
  const dry = f != null ? f / 3 : null;
  const ag = me != null ? me * 0.2 : null;
  const kAg = K != null ? 0.2 * K * (ks / 100) : null;
  const kFr = K != null ? 0.015 * K * (1 - ks / 100) : null;
  const kDry = kFr != null ? kFr / 3 : null;
  return (
    <div>
      <div style={{ ...cardS, padding: "16px 18px" }}>
        <div style={{ fontFamily: SERIF, fontSize: 17, color: WINE, fontWeight: 600, marginBottom: 10 }}>Frischhefe ↔ Trockenhefe</div>
        <Field label="Frischhefe" value={fresh} set={setFresh} unit="g" />
        <div style={{ ...resBox, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", fontSize: 15 }}>
          <span>entspricht</span><b>{fmt(dry)} g Trockenhefe</b>
        </div>
        <p style={{ ...hintS, marginTop: 8 }}>Regel: Trockenhefe = Frischhefe ÷ 3. Umgekehrt × 3.</p>
      </div>

      <div style={{ ...cardS, padding: "16px 18px", marginTop: 14 }}>
        <div style={{ fontFamily: SERIF, fontSize: 17, color: WINE, fontWeight: 600, marginBottom: 10 }}>Rezept auf Sauerteig umstellen</div>
        <Field label="Mehlmenge im Rezept" value={mehl} set={setMehl} unit="g" step="10" />
        <div style={{ ...resBox, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", fontSize: 15 }}>
          <span>Aktives Anstellgut</span><b>ca. {fmt(ag)} g</b>
        </div>
        <p style={{ ...hintS, marginTop: 8 }}>Faustregel: ca. 20 % der Mehlmenge als aktives Anstellgut. Mehl und Wasser im Rezept je um die Hälfte des Anstellguts reduzieren, mehr Zeit einplanen.</p>
      </div>

      <div style={{ ...cardS, padding: "16px 18px", marginTop: 14 }}>
        <div style={{ fontFamily: SERIF, fontSize: 17, color: WINE, fontWeight: 600, marginBottom: 10 }}>Sauerteig + Hefe kombiniert</div>
        <Field label="Mehlmenge" value={km} set={setKm} unit="g" step="10" />
        <div style={{ borderTop: "1px solid " + LINE }} />
        <Field label="Anteil Sauerteig" value={share} set={setShare} unit="%" step="5" />
        <div style={{ ...resBox, textAlign: "left", padding: "14px 20px", marginTop: 12 }}>
          {[["Anstellgut (aktiv)", fmt(kAg) + " g"], ["Frischhefe", fmt(kFr) + " g"], ["oder Trockenhefe", fmt(kDry) + " g"]].map(([lb, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 15, borderTop: i ? "1px solid rgba(255,255,255,.16)" : "none" }}>
              <span>{lb}</span><b>{v}</b>
            </div>
          ))}
        </div>
        <p style={{ ...hintS, marginTop: 8 }}>So bekommst du Sauerteig-Aroma mit der Planbarkeit von Hefe.</p>
      </div>
    </div>
  );
}

function Hydration() {
  const [mehl, setMehl] = useState("500");
  const [wasser, setWasser] = useState("350");
  const mf = num(mehl), w = num(wasser);
  const h = mf ? (w / mf) * 100 : null;
  return (
    <div>
      <div style={{ ...cardS, padding: "16px 18px" }}>
        <Field label="Mehl" value={mehl} set={setMehl} unit="g" step="10" />
        <div style={{ borderTop: "1px solid " + LINE }} />
        <Field label="Wasser" value={wasser} set={setWasser} unit="g" step="10" />
      </div>
      <Big label="Hydration" value={fmt(h)} unit="%" />
      <p style={hintS}>Hydration = Wasser ÷ Mehl × 100. (Anstellgut hier nicht eingerechnet.)</p>
    </div>
  );
}

function Stueckgare() {
  const [t, setT] = useState("24");
  const T = num(t);
  let txt = "–";
  if (T != null) {
    const base = 2.5;
    const factor = Math.pow(2, (24 - T) / 8);
    const pk = base * factor;
    const lo = Math.max(0.5, Math.round(pk * 0.75 * 2) / 2);
    const hi = Math.round(pk * 1.25 * 2) / 2;
    txt = fmt(lo) + "–" + fmt(hi <= lo ? lo + 0.5 : hi);
  }
  return (
    <div>
      <div style={{ ...cardS, padding: "16px 18px" }}>
        <Field label="Raumtemperatur" value={t} set={setT} unit="°C" step="0.5" />
      </div>
      <Big label="Stückgare (geschätzt)" value={txt} unit="Std." />
      <p style={hintS}>Grobe Orientierung für warme Stückgare. Der Fingertest bleibt der beste Freund: Delle federt langsam zurück = fertig.</p>
    </div>
  );
}

function MixIns() {
  const [mehl, setMehl] = useState("500");
  const [anteil, setAnteil] = useState("20");
  const mf = num(mehl), a = num(anteil);
  const menge = mf != null && a != null ? mf * (a / 100) : null;
  return (
    <div>
      <div style={{ ...cardS, padding: "16px 18px" }}>
        <Field label="Mehlmenge" value={mehl} set={setMehl} unit="g" step="10" />
        <div style={{ borderTop: "1px solid " + LINE }} />
        <Field label="Anteil (% vom Mehl)" value={anteil} set={setAnteil} unit="%" step="5" />
      </div>
      <Big label="Menge der Zutat" value={fmt(menge)} unit="g" />
      <p style={hintS}>Für Saaten, Nüsse, Körner &amp; Co.: übliche Menge sind 10–30 % der Mehlmenge. Saaten am besten vorher quellen oder rösten.</p>
    </div>
  );
}

const RECHNER = [
  { key: "sw", emoji: "🌡️", title: "Schüttwasser", sub: "Wassertemperatur bestimmen", comp: Schuettwasser },
  { key: "fr", emoji: "🥣", title: "Feed-Ratio", sub: "Fütterung + Peak-Vorhersage", comp: FeedRatio },
  { key: "he", emoji: "🔄", title: "Hefe ↔ Sauerteig", sub: "Umrechnen & kombinieren", comp: HefeSauerteig },
  { key: "hy", emoji: "💧", title: "Hydration", sub: "Wasseranteil berechnen", comp: Hydration },
  { key: "sg", emoji: "⏱️", title: "Stückgare", sub: "Gehzeit abschätzen", comp: Stueckgare },
  { key: "mi", emoji: "🌰", title: "Mix-ins", sub: "Nüsse, Saaten & Co. dosieren", comp: MixIns },
];

export default function RechnerPage() {
  const [open, setOpen] = useState("");

  return (
    <div style={{ fontFamily: "'Lora', Georgia, serif", paddingTop: 4 }}>
      <h1 style={{ fontFamily: SERIF, color: PLUM, fontSize: 34, fontWeight: 700, margin: "0 0 4px" }}>
        Rechner
      </h1>
      <p style={{ color: TAUPE, fontSize: 13, margin: "0 0 16px" }}>
        Tippe einen Rechner an, um ihn zu öffnen.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {RECHNER.map((r) => {
          const isOpen = open === r.key;
          const Comp = r.comp;
          return (
            <div key={r.key}>
              <button
                onClick={() => setOpen(isOpen ? "" : r.key)}
                style={{ ...cardS, display: "flex", alignItems: "center", gap: 13, width: "100%", textAlign: "left", padding: "13px 15px", cursor: "pointer" }}
              >
                <span style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(201,143,160,.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flex: "0 0 auto" }}>
                  {r.emoji}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: WINE, lineHeight: 1.1 }}>{r.title}</span>
                  <span style={{ display: "block", fontSize: 12.5, color: TAUPE }}>{r.sub}</span>
                </span>
                <span style={{ color: "#c9a3b3", fontSize: 22, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
              </button>
              {isOpen && <div style={{ marginTop: 12, marginBottom: 4 }}><Comp /></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
