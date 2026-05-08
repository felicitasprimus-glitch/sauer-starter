"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FEHLERFINDER_PROBLEMS } from "@/lib/fehlerfinder-data";

// Wheat icon (vom Original)
function WheatIcon({ color = "#8e6d82", width = 16, height = 24 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 60"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M20 58 L20 15" />
      <path d="M20 30 C 14 28, 11 24, 10 18 C 14 19, 18 22, 20 28" />
      <path d="M20 30 C 26 28, 29 24, 30 18 C 26 19, 22 22, 20 28" />
      <path d="M20 22 C 14 20, 11 16, 10 10 C 14 11, 18 14, 20 20" />
      <path d="M20 22 C 26 20, 29 16, 30 10 C 26 11, 22 14, 20 20" />
      <path d="M20 14 C 16 12, 14 9, 13 4 C 16 5, 19 7, 20 12" />
      <path d="M20 14 C 24 12, 26 9, 27 4 C 24 5, 21 7, 20 12" />
      <path d="M20 40 C 15 38, 13 35, 13 30 M20 40 C 25 38, 27 35, 27 30" />
    </svg>
  );
}

function getCompareIntro(problemId, causeLabel) {
  if (![3, 7, 9, 10, 11].includes(problemId)) return "";
  const cause = (causeLabel || "").toLowerCase();

  if (problemId === 3) {
    if (cause.includes("kerntemperatur")) return "Hier hilft ein verlaessliches Backgefaess, weil dein Brot gleichmaessiger ausbacken kann.";
    if (cause.includes("dampf")) return "Hier spielt das Backklima eine grosse Rolle, damit dein Brot nicht feucht und speckig bleibt.";
    if (cause.includes("backzeit")) return "Auch hier hilft ein gutes Backgefaess, weil dein Brot gleichmaessiger und kontrollierter ausbackt.";
    return "Auch wenn die Ursache nicht nur am Backen liegt, kann das richtige Backgefaess dein Ergebnis deutlich verbessern.";
  }
  if (problemId === 7) {
    if (cause.includes("schnitt")) return "Der Schnitt ist wichtig - aber ohne passendes Backklima kann sich dein Brot trotzdem nicht sauber oeffnen.";
    if (cause.includes("dampf")) return "Genau hier entscheidet das Backklima darueber, ob sich dein Brot richtig oeffnen kann.";
    return "Das Backklima unterstuetzt hier stark - auch wenn Schnitt und Gare genauso wichtig bleiben.";
  }
  if (problemId === 9) {
    if (cause.includes("dampf")) return "Hier hilft ein kontrolliertes Backklima, damit die Kruste nicht sofort verhaertet.";
    return "Auch das Backgefaess beeinflusst, wie deine Kruste am Ende wird.";
  }
  if (problemId === 10) {
    if (cause.includes("ofen nicht heiss")) return "Hier hilft ein gutes Backgefaess, weil die Hitze gebuendelter am Brot ankommt.";
    return "Das Backklima spielt hier eine groessere Rolle, als viele denken.";
  }
  if (problemId === 11) {
    if (cause.includes("dampf")) return "Genau hier macht das Backklima den Unterschied, wie dein Brot aufreisst.";
    return "Auch das Backumfeld beeinflusst, wo dein Brot aufreisst.";
  }
  return "";
}

function FehlerfinderInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialProblemId = searchParams.get("problem")
    ? Number(searchParams.get("problem"))
    : null;

  const [problemId, setProblemId] = useState(initialProblemId);
  const [ursacheIdx, setUrsacheIdx] = useState(null);
  const [showGefaessTest, setShowGefaessTest] = useState(false);
  const [gefaessResult, setGefaessResult] = useState(null);

  useEffect(() => {
    if (initialProblemId !== problemId) {
      setProblemId(initialProblemId);
      setUrsacheIdx(null);
    }
  }, [initialProblemId]);

  const selectedProblem = FEHLERFINDER_PROBLEMS.find((p) => p.id === problemId) || null;
  const selectedUrsache =
    selectedProblem && ursacheIdx !== null ? selectedProblem.ursachen[ursacheIdx] : null;

  function selectProblem(id) {
    setProblemId(id);
    setUrsacheIdx(null);
    setShowGefaessTest(false);
    setGefaessResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectCause(i) {
    setUrsacheIdx(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToHome() {
    setProblemId(null);
    setUrsacheIdx(null);
    setShowGefaessTest(false);
    setGefaessResult(null);
    router.replace("/fehlerfinder");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function backToCauses() {
    setUrsacheIdx(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="ff-root">
      <div className="ff-blob ff-blob1"></div>
      <div className="ff-blob ff-blob2"></div>
      <div className="ff-blob ff-blob3"></div>
      <div className="ff-noise"></div>

      <div className="ff-wrap">
        <div className="ff-header-small">
          <p className="ff-brand">Sauer macht krustig</p>
          <div className="ff-divider">
            <div className="ff-divider-line"></div>
            <WheatIcon />
            <div className="ff-divider-line"></div>
          </div>
        </div>

        {showGefaessTest ? (
          gefaessResult ? (
            <section className="ff-section" style={{ textAlign: "center" }}>
              <h2 className="ff-h2">Deine Empfehlung</h2>
              {gefaessResult === "ofenmeister" ? (
                <>
                  <p className="ff-p">
                    Nimm den Ofenmeister - er verzeiht mehr Fehler und liefert konstant gute Ergebnisse.
                  </p>
                  <a
                    className="ff-primary-btn"
                    href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/store/DEO/catalog/Stoneware/Deep%20Covered%20Baker-2023"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ofenmeister ansehen
                  </a>
                </>
              ) : (
                <>
                  <p className="ff-p">
                    Nimm die Lilly - perfekt fuer kleinere Mengen und den Einstieg.
                  </p>
                  <a
                    className="ff-primary-btn"
                    href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/eventstore428480/DEO/catalog/Stoneware/Mini%20Deep%20Covered%20Baker-2023"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lilly ansehen
                  </a>
                </>
              )}
              <button
                className="ff-secondary-btn"
                onClick={() => {
                  setShowGefaessTest(false);
                  setGefaessResult(null);
                }}
              >
                Zurueck
              </button>
            </section>
          ) : (
            <section className="ff-section" style={{ textAlign: "center" }}>
              <h2 className="ff-h2">Welches Gefaess passt zu dir?</h2>
              <button className="ff-primary-btn" onClick={() => setGefaessResult("ofenmeister")}>
                Ich will einfach sichere Ergebnisse
              </button>
              <button className="ff-primary-btn" onClick={() => setGefaessResult("lilly")}>
                Ich backe kleinere Brote / will starten
              </button>
              <button
                className="ff-secondary-btn"
                onClick={() => setShowGefaessTest(false)}
              >
                Zurueck
              </button>
            </section>
          )
        ) : !selectedProblem ? (
          <section className="ff-section">
            <div className="ff-hero">
              <h1 className="ff-h1">Fehlerfinder</h1>
              <p className="ff-hero-sub">
                Dein Brot hat nicht geklappt? Tippe dein Symptom an - wir finden die Ursache.
              </p>
            </div>
            <div className="ff-grid">
              {FEHLERFINDER_PROBLEMS.map((p) => (
                <button
                  key={p.id}
                  className="ff-card"
                  type="button"
                  onClick={() => selectProblem(p.id)}
                >
                  <div className="ff-card-emoji">{p.emoji}</div>
                  <h2 className="ff-card-title">{p.titel}</h2>
                </button>
              ))}
            </div>
            <div className="ff-footer-home">
              <p className="ff-script">Diagnose durch Ausschluss</p>
              <div className="ff-meta">12 Symptome - 57 Loesungen</div>
            </div>
          </section>
        ) : !selectedUrsache ? (
          <section className="ff-section">
            <div className="ff-top-back-wrap">
              <button className="ff-top-back" onClick={backToHome}>
                <span>&larr; Zurueck</span>
              </button>
            </div>
            <div className="ff-problem-head">
              <div className="ff-problem-emoji">{selectedProblem.emoji}</div>
              <h1 className="ff-problem-title">{selectedProblem.titel}</h1>
              <p className="ff-problem-sub">Was davon trifft am ehesten zu?</p>
            </div>
            <div className="ff-cause-list">
              {selectedProblem.ursachen.map((u, i) => (
                <button
                  key={i}
                  className="ff-cause-btn"
                  type="button"
                  onClick={() => selectCause(i)}
                >
                  <span className="ff-cause-number">{i + 1}</span>
                  <span className="ff-cause-label">{u.label}</span>
                  <span className="ff-cause-arrow">&rarr;</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="ff-section">
            <div className="ff-top-back-wrap">
              <button className="ff-top-back" onClick={backToCauses}>
                <span>&larr; Andere Ursache</span>
              </button>
            </div>

            <div className="ff-breadcrumb">
              <span className="ff-bc-problem">{selectedProblem.titel}</span>
              <span className="ff-dot"> - </span>
              <span className="ff-bc-cause">{selectedUrsache.label}</span>
            </div>

            <div className="ff-section-why">
              <p className="ff-section-kicker">Warum</p>
              <p className="ff-why-text">{selectedUrsache.warum}</p>
            </div>

            <div className="ff-solution-divider">
              <div className="ff-divider-line"></div>
              <WheatIcon color="#a885a0" width={14} height={22} />
              <div className="ff-divider-line"></div>
            </div>

            <div className="ff-solution-card">
              <div className="ff-solution-pill">Loesung</div>
              <p className="ff-solution-text">{selectedUrsache.loesung}</p>

              {selectedProblem.hasGefaessLink && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <p style={{ fontStyle: "italic", marginBottom: "14px" }}>
                    {getCompareIntro(selectedProblem.id, selectedUrsache.label)}
                  </p>
                  <div className="ff-actions">
                    <a
                      href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/store/DEO/catalog/Stoneware/Deep%20Covered%20Baker-2023"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ff-primary-btn"
                    >
                      🔥 Ofenmeister - fuer beste Ergebnisse
                    </a>
                    <a
                      href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/eventstore428480/DEO/catalog/Stoneware/Mini%20Deep%20Covered%20Baker-2023"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ff-secondary-btn"
                    >
                      🌸 Lilly - fuer kleinere Brote
                    </a>
                  </div>
                  <div className="ff-actions" style={{ marginTop: "12px" }}>
                    <button className="ff-primary-btn" onClick={() => setShowGefaessTest(true)}>
                      Welches Gefaess passt zu mir?
                    </button>
                  </div>
                </div>
              )}
            </div>

            {selectedProblem.hasGefaessLink && (
              <div className="ff-solution-card" style={{ marginTop: "20px" }}>
                <div className="ff-solution-pill">Wichtig danach</div>
                <p className="ff-solution-text" style={{ fontStyle: "italic" }}>
                  Stoneware nie direkt auf die Arbeitsplatte
                </p>
                <p className="ff-solution-text">
                  Stoneware wie Ofenmeister oder Lilly nie direkt auf der Arbeitsplatte abkuehlen lassen.
                  Stell sie immer auf ein Abkuehlgitter, damit dein Brot nicht nachfeuchtet und deine Stoneware keinen Schaden nimmt.
                </p>
                <div className="ff-actions">
                  <a
                    href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/store/DEO/catalog/Backen/Kuchengitter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ff-secondary-btn"
                  >
                    Abkuehlgitter ansehen
                  </a>
                </div>
              </div>
            )}

            <div className="ff-actions">
              <button className="ff-primary-btn" onClick={backToCauses}>
                Andere Ursache pruefen
              </button>
              <button className="ff-secondary-btn" onClick={backToHome}>
                Neues Problem
              </button>
            </div>
          </section>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:wght@300;400;500&display=swap');
      `}</style>

      <style jsx>{`
        .ff-root {
          --bg1: #f2ecf0;
          --bg2: #e8dde5;
          --text-dark: #4e364a;
          --text-mid: #7a5e75;
          --text-soft: #8e6d82;
          --accent: #a885a0;
          --border: #ddc8d5;
          --white-glass: rgba(255, 255, 255, 0.75);

          font-family: 'Cormorant Garamond', serif;
          background: linear-gradient(180deg, var(--bg1) 0%, var(--bg2) 100%);
          color: var(--text-dark);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          margin: -1.5rem -1rem;
          padding: 1px 0;
        }

        .ff-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(24px);
          opacity: 0.45;
          z-index: 0;
          mix-blend-mode: multiply;
        }
        .ff-blob1 {
          width: 360px;
          height: 360px;
          left: -100px;
          top: -70px;
          background: radial-gradient(circle, rgba(221, 200, 213, 0.95) 0%, rgba(221, 200, 213, 0.45) 55%, rgba(221, 200, 213, 0) 100%);
        }
        .ff-blob2 {
          width: 320px;
          height: 320px;
          right: -90px;
          top: 28%;
          background: radial-gradient(circle, rgba(185, 157, 174, 0.9) 0%, rgba(185, 157, 174, 0.35) 55%, rgba(185, 157, 174, 0) 100%);
        }
        .ff-blob3 {
          width: 360px;
          height: 360px;
          left: 18%;
          bottom: -100px;
          background: radial-gradient(circle, rgba(216, 194, 208, 0.9) 0%, rgba(216, 194, 208, 0.4) 55%, rgba(216, 194, 208, 0) 100%);
        }

        .ff-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          z-index: 0;
        }

        .ff-wrap {
          position: relative;
          z-index: 1;
          max-width: 560px;
          margin: 0 auto;
          padding: 28px 20px 40px;
        }

        .ff-header-small {
          text-align: center;
          margin-bottom: 28px;
        }

        .ff-brand {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--text-soft);
          margin: 0 0 6px;
        }

        .ff-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .ff-divider-line {
          width: 40px;
          height: 1px;
          background: rgba(142, 109, 130, 0.4);
        }

        .ff-section {
          animation: ff-fade 0.45s ease;
        }

        @keyframes ff-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ff-hero { text-align: center; margin-bottom: 32px; }

        .ff-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 2.6rem;
          margin: 0 0 12px;
          color: var(--text-dark);
          letter-spacing: 0.01em;
        }

        .ff-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 1.8rem;
          margin: 0 0 20px;
          color: var(--text-dark);
        }

        .ff-hero-sub {
          font-size: 1.1rem;
          color: var(--text-mid);
          line-height: 1.5;
          margin: 0;
          font-weight: 300;
        }

        .ff-p {
          font-size: 1.1rem;
          color: var(--text-mid);
          line-height: 1.55;
          margin: 0 0 18px;
        }

        .ff-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .ff-card {
          background: var(--white-glass);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 20px 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
        }
        .ff-card:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(168, 133, 160, 0.18);
        }

        .ff-card-emoji { font-size: 2rem; margin-bottom: 10px; }

        .ff-card-title {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
          color: var(--text-dark);
          line-height: 1.3;
        }

        .ff-footer-home {
          text-align: center;
          margin-top: 32px;
          color: var(--text-soft);
        }

        .ff-script {
          font-family: 'Allura', cursive;
          font-size: 1.4rem;
          margin: 0 0 6px;
          color: var(--accent);
        }

        .ff-meta {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .ff-top-back-wrap { margin-bottom: 18px; }

        .ff-top-back {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-mid);
          padding: 6px 14px;
          border-radius: 999px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ff-top-back:hover {
          background: var(--white-glass);
          color: var(--text-dark);
        }

        .ff-problem-head { text-align: center; margin-bottom: 26px; }

        .ff-problem-emoji { font-size: 3rem; margin-bottom: 10px; }

        .ff-problem-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 2.1rem;
          margin: 0 0 8px;
          color: var(--text-dark);
        }

        .ff-problem-sub {
          color: var(--text-mid);
          font-size: 1.1rem;
          margin: 0;
          font-weight: 300;
        }

        .ff-cause-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ff-cause-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--white-glass);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Cormorant Garamond', serif;
          text-align: left;
          width: 100%;
        }
        .ff-cause-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateX(2px);
        }

        .ff-cause-number {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .ff-cause-label {
          flex: 1;
          font-size: 1.05rem;
          color: var(--text-dark);
        }

        .ff-cause-arrow { color: var(--text-soft); font-size: 1.2rem; }

        .ff-breadcrumb {
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-soft);
          margin-bottom: 22px;
        }
        .ff-bc-problem { color: var(--text-soft); }
        .ff-bc-cause { color: var(--accent); font-weight: 500; }

        .ff-section-why {
          background: var(--white-glass);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 22px 18px;
          margin-bottom: 22px;
        }

        .ff-section-kicker {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 0 0 8px;
        }

        .ff-why-text {
          font-size: 1.1rem;
          line-height: 1.55;
          color: var(--text-dark);
          margin: 0;
          font-weight: 300;
        }

        .ff-solution-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 22px 0;
        }

        .ff-solution-card {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.7) 100%);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 28px 20px 22px;
          position: relative;
          box-shadow: 0 4px 18px rgba(168, 133, 160, 0.12);
        }

        .ff-solution-pill {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent);
          color: white;
          padding: 4px 14px;
          border-radius: 999px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        .ff-solution-text {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-dark);
          margin: 0 0 12px;
          font-weight: 300;
        }
        .ff-solution-text:last-child { margin-bottom: 0; }

        .ff-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 22px;
        }

        .ff-primary-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 999px;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .ff-primary-btn:hover { background: #95738e; transform: translateY(-1px); }

        .ff-secondary-btn {
          background: transparent;
          color: var(--text-mid);
          border: 1px solid var(--border);
          padding: 11px 20px;
          border-radius: 999px;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .ff-secondary-btn:hover {
          background: var(--white-glass);
          color: var(--text-dark);
        }

        @media (max-width: 390px) {
          .ff-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default function FehlerfinderPage() {
  return (
    <Suspense fallback={<div>Laedt ...</div>}>
      <FehlerfinderInner />
    </Suspense>
  );
}
