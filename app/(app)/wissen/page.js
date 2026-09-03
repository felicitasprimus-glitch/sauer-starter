export default function WissenPage() {
  return (
    <div style={{ margin: "-1.5rem -1rem 0", height: "calc(100dvh - 100px)" }}>
      <iframe
        title="Wissensbibliothek"
        src="https://sauerteig-wissen.netlify.app/"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        allow="clipboard-write"
      />
    </div>
  );
}
