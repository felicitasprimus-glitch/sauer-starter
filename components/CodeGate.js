"use client";

import { useEffect, useState } from "react";

const CODE = "SAUER2026";
const KEY = "smk-code-ok";
const SERIF = "'Playfair Display', Georgia, serif";
const PLUM = "#5A3D54";
const CREAM = "#F6EFEA";
const TAUPE = "#8B796D";

export default function CodeGate({ children }) {
  const [ok, setOk] = useState(null);
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      setOk(localStorage.getItem(KEY) === "1");
    } catch (e) {
      setOk(false);
    }
  }, []);

  function submit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const val = input.trim().toUpperCase().replace(/\s/g, "");
    if (val === CODE) {
      try {
        localStorage.setItem(KEY, "1");
      } catch (e2) {}
      setOk(true);
    } else {
      setErr("Dieser Code stimmt leider nicht.");
    }
  }

  if (ok === null) return null;
  if (ok) return children;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: CREAM,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Lora', Georgia, serif",
      }}
    >
      <div style={{ fontSize: 46 }}>🍞</div>
      <h1 style={{ fontFamily: SERIF, color: PLUM, fontSize: 30, fontWeight: 700, margin: "10px 0 2px", textAlign: "center" }}>
        Sauer macht krustig
      </h1>
      <p style={{ color: TAUPE, fontSize: 14, textAlign: "center", margin: "0 0 22px" }}>
        Bitte gib deinen Zugangscode ein.
      </p>
      <input
        type="text"
        value={input}
        onChange={(e) => { setInput(e.target.value); setErr(""); }}
        onKeyDown={(e) => { if (e.key === "Enter") submit(e); }}
        placeholder="Zugangscode"
        autoCapitalize="characters"
        style={{ width: "100%", maxWidth: 300, textAlign: "center", fontSize: 18, letterSpacing: "2px", border: "1px solid rgba(90,61,84,.2)", borderRadius: 14, padding: "14px", background: "#fff", color: PLUM, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
      />
      {err && <p style={{ color: "#b5793b", fontSize: 13, margin: "10px 0 0" }}>{err}</p>}
      <button
        onClick={submit}
        style={{ width: "100%", maxWidth: 300, marginTop: 14, background: PLUM, color: "#fff", border: "none", borderRadius: 999, padding: "14px", fontFamily: "inherit", fontWeight: 600, fontSize: 15, cursor: "pointer" }}
      >
        Freischalten
      </button>
      <p style={{ color: TAUPE, fontSize: 12, textAlign: "center", margin: "22px 0 0", maxWidth: 300, lineHeight: 1.5 }}>
        Noch keinen Code? Den Zugang gibt es auf sauermachtkrustig.de
      </p>
    </div>
  );
}
