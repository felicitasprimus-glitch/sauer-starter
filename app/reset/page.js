"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PLUM = "#5A3D54";
const CREAM = "#F6EFEA";
const TAUPE = "#8B796D";
const LINE = "rgba(90,61,84,.2)";
const SERIF = "'Playfair Display', Georgia, serif";

export default function ResetPage() {
  const supabase = createClient();
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function save() {
    setErr("");
    if (pw.length < 6) { setErr("Das Passwort braucht mindestens 6 Zeichen."); return; }
    if (pw !== pw2) { setErr("Die Passwörter stimmen nicht überein."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      setErr("Das hat nicht geklappt – ist der Link vielleicht abgelaufen? Fordere einen neuen an.");
      return;
    }
    setDone(true);
    setTimeout(() => router.replace("/start"), 1500);
  }

  const wrap = { minHeight: "100vh", background: CREAM, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Lora', Georgia, serif" };
  const inp = { width: "100%", maxWidth: 320, fontSize: 15, border: "1px solid " + LINE, borderRadius: 12, padding: "13px 14px", background: "#fff", color: PLUM, outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginTop: 10 };
  const btn = { width: "100%", maxWidth: 320, marginTop: 16, background: PLUM, color: "#fff", border: "none", borderRadius: 999, padding: "14px", fontFamily: "inherit", fontWeight: 600, fontSize: 15, cursor: "pointer", opacity: busy ? 0.6 : 1 };

  if (done) {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 46 }}>✅</div>
        <h1 style={{ fontFamily: SERIF, color: PLUM, fontSize: 26, fontWeight: 700, margin: "10px 0 6px", textAlign: "center" }}>Passwort geändert!</h1>
        <p style={{ color: TAUPE, fontSize: 14, textAlign: "center" }}>Du wirst gleich weitergeleitet …</p>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{ fontSize: 46 }}>🔑</div>
      <h1 style={{ fontFamily: SERIF, color: PLUM, fontSize: 28, fontWeight: 700, margin: "10px 0 4px", textAlign: "center" }}>Neues Passwort</h1>
      <p style={{ color: TAUPE, fontSize: 14, textAlign: "center", margin: "0 0 14px", maxWidth: 320 }}>Wähle jetzt dein neues Passwort.</p>
      <input style={inp} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Neues Passwort" />
      <input style={inp} type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Passwort wiederholen" />
      {err && <p style={{ color: "#b5793b", fontSize: 13, margin: "12px 0 0", maxWidth: 320, textAlign: "center" }}>{err}</p>}
      <button style={btn} disabled={busy} onClick={save}>{busy ? "Bitte warten …" : "Passwort speichern"}</button>
    </div>
  );
}
