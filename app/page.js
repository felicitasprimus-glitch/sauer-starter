"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const CODE = "SAUER2026";
const PLUM = "#5A3D54";
const CREAM = "#F6EFEA";
const TAUPE = "#8B796D";
const LINE = "rgba(90,61,84,.2)";
const SERIF = "'Playfair Display', Georgia, serif";

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState("register"); // register | login | confirm
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && !cancelled) {
          router.replace("/start");
          return;
        }
      } catch (e) {}
      if (!cancelled) setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function register() {
    setErr("");
    if (code.trim().toUpperCase().replace(/\s/g, "") !== CODE) {
      setErr("Der Zugangscode stimmt nicht.");
      return;
    }
    if (!name.trim() || !email.trim() || !pw) {
      setErr("Bitte fülle alle Felder aus.");
      return;
    }
    if (pw.length < 6) {
      setErr("Das Passwort braucht mindestens 6 Zeichen.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pw,
      options: { data: { display_name: name.trim() } },
    });
    setBusy(false);
    if (error) {
      setErr(error.message || "Registrierung hat nicht geklappt.");
      return;
    }
    if (data.session) {
      router.replace("/start");
    } else {
      setMode("confirm");
    }
  }

  async function login() {
    setErr("");
    if (!email.trim() || !pw) {
      setErr("Bitte E-Mail und Passwort eingeben.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pw,
    });
    setBusy(false);
    if (error) {
      setErr("E-Mail oder Passwort stimmt nicht.");
      return;
    }
    router.replace("/start");
  }

  async function forgot() {
    setErr("");
    if (!email.trim()) { setErr("Bitte gib deine E-Mail ein."); return; }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: (typeof window !== "undefined" ? window.location.origin : "") + "/reset",
    });
    setBusy(false);
    if (error) { setErr(error.message || "Konnte die E-Mail nicht senden."); return; }
    setMode("sent");
  }

  const wrap = {
    minHeight: "100vh",
    background: CREAM,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'Lora', Georgia, serif",
  };
  const inp = {
    width: "100%",
    maxWidth: 320,
    fontSize: 15,
    border: "1px solid " + LINE,
    borderRadius: 12,
    padding: "13px 14px",
    background: "#fff",
    color: PLUM,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    marginTop: 10,
  };
  const btn = {
    width: "100%",
    maxWidth: 320,
    marginTop: 16,
    background: PLUM,
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "14px",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    opacity: busy ? 0.6 : 1,
  };

  if (checking) {
    return (
      <div style={wrap}>
        <p style={{ color: TAUPE, fontSize: 14 }}>Einen Moment …</p>
      </div>
    );
  }

  if (mode === "sent") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 46 }}>📧</div>
        <h1 style={{ fontFamily: SERIF, color: PLUM, fontSize: 26, fontWeight: 700, margin: "10px 0 8px", textAlign: "center" }}>
          E-Mail unterwegs
        </h1>
        <p style={{ color: TAUPE, fontSize: 14, textAlign: "center", maxWidth: 320, lineHeight: 1.55 }}>
          Wir haben dir einen Link zum Zurücksetzen geschickt. Öffne die E-Mail und wähle ein neues Passwort.
        </p>
        <button style={btn} onClick={() => { setMode("login"); setErr(""); }}>
          Zurück zur Anmeldung
        </button>
      </div>
    );
  }

  if (mode === "confirm") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 46 }}>📩</div>
        <h1 style={{ fontFamily: SERIF, color: PLUM, fontSize: 26, fontWeight: 700, margin: "10px 0 8px", textAlign: "center" }}>
          Fast geschafft!
        </h1>
        <p style={{ color: TAUPE, fontSize: 14, textAlign: "center", maxWidth: 320, lineHeight: 1.55 }}>
          Wir haben dir eine E-Mail geschickt. Bitte bestätige darin deine Adresse – danach kannst du dich anmelden.
        </p>
        <button style={btn} onClick={() => { setMode("login"); setErr(""); }}>
          Zur Anmeldung
        </button>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 46 }}>🔑</div>
        <h1 style={{ fontFamily: SERIF, color: PLUM, fontSize: 28, fontWeight: 700, margin: "10px 0 4px", textAlign: "center" }}>
          Passwort vergessen?
        </h1>
        <p style={{ color: TAUPE, fontSize: 14, textAlign: "center", margin: "0 0 14px", maxWidth: 320 }}>
          Gib deine E-Mail ein – wir schicken dir einen Link zum Zurücksetzen.
        </p>
        <input style={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" />
        {err && <p style={{ color: "#b5793b", fontSize: 13, margin: "12px 0 0", maxWidth: 320, textAlign: "center" }}>{err}</p>}
        <button style={btn} disabled={busy} onClick={forgot}>{busy ? "Bitte warten …" : "Link senden"}</button>
        <button onClick={() => { setMode("login"); setErr(""); }} style={{ background: "none", border: "none", color: PLUM, fontFamily: "inherit", fontSize: 13.5, cursor: "pointer", marginTop: 18, textDecoration: "underline" }}>
          Zurück zur Anmeldung
        </button>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={{ fontSize: 46 }}>🍞</div>
      <h1 style={{ fontFamily: SERIF, color: PLUM, fontSize: 30, fontWeight: 700, margin: "10px 0 2px", textAlign: "center" }}>
        Sauer macht krustig
      </h1>
      <p style={{ color: TAUPE, fontSize: 14, textAlign: "center", margin: "0 0 18px" }}>
        {mode === "register" ? "Erstelle dein Konto, um loszulegen." : "Willkommen zurück!"}
      </p>

      {mode === "register" && (
        <input style={inp} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dein Name" />
      )}
      <input style={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" />
      <input style={inp} type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Passwort" />
      {mode === "register" && (
        <input style={{ ...inp, letterSpacing: "1px" }} type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Zugangscode" autoCapitalize="characters" />
      )}

      {err && <p style={{ color: "#b5793b", fontSize: 13, margin: "12px 0 0", maxWidth: 320, textAlign: "center" }}>{err}</p>}

      <button style={btn} disabled={busy} onClick={mode === "register" ? register : login}>
        {busy ? "Bitte warten …" : mode === "register" ? "Registrieren" : "Anmelden"}
      </button>

      <button
        onClick={() => { setMode(mode === "register" ? "login" : "register"); setErr(""); }}
        style={{ background: "none", border: "none", color: PLUM, fontFamily: "inherit", fontSize: 13.5, cursor: "pointer", marginTop: 18, textDecoration: "underline" }}
      >
        {mode === "register" ? "Schon ein Konto? Hier anmelden" : "Noch kein Konto? Jetzt registrieren"}
      </button>

      {mode === "login" && (
        <button
          onClick={() => { setMode("forgot"); setErr(""); }}
          style={{ background: "none", border: "none", color: TAUPE, fontFamily: "inherit", fontSize: 12.5, cursor: "pointer", marginTop: 10 }}
        >
          Passwort vergessen?
        </button>
      )}
    </div>
  );
}
