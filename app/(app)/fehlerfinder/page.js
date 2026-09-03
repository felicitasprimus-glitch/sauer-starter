export default function FehlerfinderPage() {
  return (
    <div style={{ margin: "-1.5rem -1rem 0", height: "calc(100dvh - 100px)" }}>
      <iframe
        title="Fehlerfinder"
        src="/fehlerfinder.html"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        allow="clipboard-write"
      />
    </div>
  );
}
