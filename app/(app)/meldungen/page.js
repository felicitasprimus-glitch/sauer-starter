"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MeldungenPage() {
  const supabase = createClient();
  const [status, setStatus] = useState("laden");
  const [meldungen, setMeldungen] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function init() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
      setStatus("kein-zugriff");
      return;
    }
    const { data: profil } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (!profil || !profil.is_admin) {
      setStatus("kein-zugriff");
      return;
    }
    await laden();
  }

  async function laden() {
    setStatus("laden");
    const { data, error } = await supabase
      .from("brot_meldungen")
      .select("*")
      .eq("erledigt", false)
      .order("created_at", { ascending: false });
    if (error) {
      setStatus("fehler");
      return;
    }
    const liste = data || [];

    // Gemeldete Inhalte dazuladen
    const brotIds = liste.filter((m) => m.brot_id).map((m) => m.brot_id);
    const kommIds = liste.filter((m) => m.kommentar_id).map((m) => m.kommentar_id);

    const brotMap = {};
    if (brotIds.length) {
      const { data: brote } = await supabase
        .from("brote")
        .select("id, name, user_id")
        .in("id", brotIds);
      (brote || []).forEach((b) => {
        brotMap[b.id] = b;
      });
    }

    const kommMap = {};
    if (kommIds.length) {
      const { data: komms } = await supabase
        .from("brot_kommentare")
        .select("id, text, user_id")
        .in("id", kommIds);
      (komms || []).forEach((k) => {
        kommMap[k.id] = k;
      });
    }

    setMeldungen(
      liste.map((m) => ({
        ...m,
        brot: m.brot_id ? brotMap[m.brot_id] || null : null,
        kommentar: m.kommentar_id ? kommMap[m.kommentar_id] || null : null,
      }))
    );
    setStatus("ok");
  }

  async function erledigt(m) {
    if (busy) return;
    setBusy(true);
    await supabase
      .from("brot_meldungen")
      .update({ erledigt: true })
      .eq("id", m.id);
    setBusy(false);
    await laden();
  }

  async function inhaltLoeschen(m) {
    if (busy) return;
    const was = m.kommentar_id ? "diesen Kommentar" : "diesen Beitrag";
    if (!window.confirm("Willst du " + was + " wirklich loeschen?")) return;
    setBusy(true);
    if (m.kommentar_id) {
      await supabase.from("brot_kommentare").delete().eq("id", m.kommentar_id);
    } else if (m.brot_id) {
      await supabase.from("brote").delete().eq("id", m.brot_id);
    }
    await supabase
      .from("brot_meldungen")
      .update({ erledigt: true })
      .eq("id", m.id);
    setBusy(false);
    await laden();
  }

  const seite = {
    fontFamily: "'Montserrat', system-ui, sans-serif",
    background: "#F6EFEA",
    minHeight: "100vh",
    padding: "24px 18px 60px",
    color: "#3f2e3a",
  };
  const karte = {
    background: "#fff",
    border: "1px solid rgba(90,61,84,.14)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  };
  const knopf = {
    border: "none",
    borderRadius: 999,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  };

  if (status === "kein-zugriff") {
    return (
      <div style={seite}>
        <p>Diese Seite ist nur fuer die Administration.</p>
      </div>
    );
  }

  if (status === "laden") {
    return (
      <div style={seite}>
        <p>Meldungen werden geladen …</p>
      </div>
    );
  }

  if (status === "fehler") {
    return (
      <div style={seite}>
        <p>Die Meldungen konnten nicht geladen werden.</p>
        <button onClick={laden} style={{ ...knopf, background: "#5A3D54", color: "#fff", marginTop: 12 }}>
          Nochmal versuchen
        </button>
      </div>
    );
  }

  return (
    <div style={seite}>
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#5A3D54",
          fontSize: 30,
          fontWeight: 700,
          margin: "0 0 4px",
        }}
      >
        Gemeldete Inhalte
      </h1>
      <p style={{ color: "#8B796D", fontSize: 13, margin: "0 0 20px" }}>
        {meldungen.length === 0
          ? "Zurzeit liegt nichts vor."
          : meldungen.length + " offene Meldung(en)"}
      </p>

      {meldungen.map((m) => (
        <div key={m.id} style={karte}>
          <p style={{ fontSize: 11, color: "#8B796D", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: ".06em" }}>
            {m.kommentar_id ? "Kommentar" : "Beitrag"} ·{" "}
            {new Date(m.created_at).toLocaleString("de-DE")}
          </p>

          <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>
            {m.kommentar
              ? m.kommentar.text
              : m.brot
              ? m.brot.name
              : "Inhalt wurde bereits geloescht"}
          </p>

          <p style={{ fontSize: 13, color: "#6b5560", margin: "0 0 14px" }}>
            Grund: {m.grund || "ohne Angabe"}
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => inhaltLoeschen(m)}
              disabled={busy}
              style={{ ...knopf, background: "#7C3E50", color: "#fff" }}
            >
              Inhalt loeschen
            </button>
            <button
              onClick={() => erledigt(m)}
              disabled={busy}
              style={{ ...knopf, background: "rgba(90,61,84,.10)", color: "#5A3D54" }}
            >
              In Ordnung, erledigt
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
