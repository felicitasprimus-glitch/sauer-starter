"use client";

import { useEffect, useState } from "react";

export default function BrotbackplanerPage() {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let bp = "";
    try {
      bp = new URLSearchParams(window.location.search).get("bp") || "";
    } catch (e) {}
    setSrc("/brotbackplaner.html" + (bp ? "?bp=" + encodeURIComponent(bp) : ""));
  }, []);

  return (
    <div style={{ margin: "-1.5rem -1rem 0", height: "calc(100dvh - 100px)" }}>
      {src && (
        <iframe
          title="Brotbackplaner"
          src={src}
          style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          allow="clipboard-write"
        />
      )}
    </div>
  );
}
