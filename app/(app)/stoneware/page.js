"use client";

import { useRouter } from "next/navigation";

export default function StonewarePage() {
  const router = useRouter();
  return (
    <div style={{ margin: "-1.5rem -1rem 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          background: "#F6EFEA",
          borderBottom: "1px solid rgba(90,61,84,.12)",
        }}
      >
        <button
          onClick={() => router.push("/start")}
          style={{
            background: "none",
            border: "none",
            color: "#5A3D54",
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 15,
            cursor: "pointer",
            padding: 0,
          }}
        >
          ← Zurück
        </button>
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#5A3D54",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Stoneware &amp; Pflege
        </span>
      </div>
      <iframe
        title="Stoneware & Pflege"
        src="/stoneware.html"
        style={{
          width: "100%",
          height: "calc(100dvh - 150px)",
          border: 0,
          display: "block",
        }}
        allow="clipboard-write; camera"
      />
    </div>
  );
}
