"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FEHLERFINDER_PROBLEMS } from "@/lib/fehlerfinder-data";

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

  // ============== HOME / SYMPTOM-AUSWAHL ==============
  if (!selectedProblem && !showGefaessTest) {
    return (
      <div className="space-y-6 pb-8">
        <div className="text-center">
          <h1 className="font-display text-3xl text-cocoa-900">Fehlerfinder</h1>
          <p className="mt-2 text-sm text-cocoa-700/70">
            Dein Brot hat nicht geklappt? Tippe dein Symptom an — wir finden die Ursache.
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-mauve-700">
            12 Symptome · 57 Loesungen
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FEHLERFINDER_PROBLEMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectProblem(p.id)}
              className="card flex flex-col items-center justify-center gap-2 p-4 transition-all hover:border-terra-500 hover:shadow-soft active:scale-95"
            >
              <span className="text-3xl">{p.emoji}</span>
              <span className="text-center text-sm font-semibold text-cocoa-900">
                {p.titel}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============== GEFAESS-TEST ==============
  if (showGefaessTest) {
    if (gefaessResult) {
      return (
        <div className="space-y-4 pb-8">
          <div className="text-center">
            <h1 className="font-display text-2xl text-cocoa-900">Deine Empfehlung</h1>
          </div>

          <div className="card text-center">
            {gefaessResult === "ofenmeister" ? (
              <>
                <div className="text-4xl">🔥</div>
                <h2 className="mt-2 font-display text-xl text-cocoa-900">Ofenmeister</h2>
                <p className="mt-2 text-sm leading-relaxed text-cocoa-800">
                  Nimm den Ofenmeister — er verzeiht mehr Fehler und liefert konstant gute Ergebnisse.
                </p>
                <a
                  className="btn-primary mt-4 inline-block w-full"
                  href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/store/DEO/catalog/Stoneware/Deep%20Covered%20Baker-2023"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ofenmeister ansehen
                </a>
              </>
            ) : (
              <>
                <div className="text-4xl">🌸</div>
                <h2 className="mt-2 font-display text-xl text-cocoa-900">Lilly</h2>
                <p className="mt-2 text-sm leading-relaxed text-cocoa-800">
                  Nimm die Lilly — perfekt fuer kleinere Mengen und den Einstieg.
                </p>
                <a
                  className="btn-primary mt-4 inline-block w-full"
                  href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/eventstore428480/DEO/catalog/Stoneware/Mini%20Deep%20Covered%20Baker-2023"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lilly ansehen
                </a>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowGefaessTest(false);
              setGefaessResult(null);
            }}
            className="btn-secondary w-full"
          >
            Zurueck
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 pb-8">
        <div className="text-center">
          <h1 className="font-display text-2xl text-cocoa-900">Welches Gefaess passt zu dir?</h1>
        </div>

        <button
          type="button"
          onClick={() => setGefaessResult("ofenmeister")}
          className="card flex w-full items-center gap-3 p-4 text-left transition-all hover:border-terra-500"
        >
          <span className="text-3xl">🔥</span>
          <span className="text-sm font-semibold text-cocoa-900">
            Ich will einfach sichere Ergebnisse
          </span>
        </button>

        <button
          type="button"
          onClick={() => setGefaessResult("lilly")}
          className="card flex w-full items-center gap-3 p-4 text-left transition-all hover:border-terra-500"
        >
          <span className="text-3xl">🌸</span>
          <span className="text-sm font-semibold text-cocoa-900">
            Ich backe kleinere Brote / will starten
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowGefaessTest(false)}
          className="btn-secondary w-full"
        >
          Zurueck
        </button>
      </div>
    );
  }

  // ============== URSACHEN-AUSWAHL ==============
  if (!selectedUrsache) {
    return (
      <div className="space-y-5 pb-8">
        <button
          type="button"
          onClick={backToHome}
          className="text-xs uppercase tracking-wider text-mauve-700 hover:text-cocoa-900"
        >
          ← Zurueck zur Auswahl
        </button>

        <div className="text-center">
          <div className="text-5xl">{selectedProblem.emoji}</div>
          <h1 className="mt-2 font-display text-2xl text-cocoa-900">{selectedProblem.titel}</h1>
          <p className="mt-1 text-sm text-cocoa-700/70">
            Was davon trifft am ehesten zu?
          </p>
        </div>

        <div className="space-y-2">
          {selectedProblem.ursachen.map((u, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectCause(i)}
              className="card flex w-full items-center gap-3 p-3 text-left transition-all hover:border-terra-500 hover:translate-x-0.5"
            >
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-mauve-500 text-xs font-bold text-cream-50">
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-cocoa-900">{u.label}</span>
              <span className="text-mauve-700">→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============== LOESUNG / DETAIL ==============
  return (
    <div className="space-y-4 pb-8">
      <button
        type="button"
        onClick={backToCauses}
        className="text-xs uppercase tracking-wider text-mauve-700 hover:text-cocoa-900"
      >
        ← Andere Ursache
      </button>

      <div className="text-center">
        <p className="text-[10px] uppercase tracking-wider text-mauve-700">
          {selectedProblem.titel}
        </p>
        <h1 className="mt-1 font-display text-xl text-cocoa-900">
          {selectedUrsache.label}
        </h1>
      </div>

      <div className="card">
        <p className="text-[10px] uppercase tracking-wider text-mauve-700">Warum</p>
        <p className="mt-1 text-sm leading-relaxed text-cocoa-800">
          {selectedUrsache.warum}
        </p>
      </div>

      <div className="rounded-2xl border-2 border-terra-500/50 bg-terra-500/5 p-4 shadow-soft">
        <div className="text-center">
          <span className="inline-block rounded-full bg-terra-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cream-50">
            Loesung
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-cocoa-900">
          {selectedUrsache.loesung}
        </p>
      </div>

      {selectedProblem.hasGefaessLink && (
        <div className="space-y-3">
          <div className="card">
            <p className="text-[10px] uppercase tracking-wider text-mauve-700">
              Mit dem richtigen Gefaess
            </p>
            <p className="mt-2 text-sm italic leading-relaxed text-cocoa-800">
              Hier hilft ein verlaessliches Backgefaess, weil dein Brot gleichmaessiger ausbacken kann.
            </p>

            <div className="mt-3 space-y-2">
              <a
                href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/store/DEO/catalog/Stoneware/Deep%20Covered%20Baker-2023"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary block w-full text-center"
              >
                🔥 Ofenmeister — fuer beste Ergebnisse
              </a>
              <a
                href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/eventstore428480/DEO/catalog/Stoneware/Mini%20Deep%20Covered%20Baker-2023"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary block w-full text-center"
              >
                🌸 Lilly — fuer kleinere Brote
              </a>
              <button
                type="button"
                onClick={() => setShowGefaessTest(true)}
                className="btn-secondary block w-full"
              >
                Welches Gefaess passt zu mir?
              </button>
            </div>
          </div>

          <div className="card border-honey-500/40 bg-honey-500/10">
            <p className="text-[10px] uppercase tracking-wider text-cocoa-800">
              Wichtig danach
            </p>
            <p className="mt-1 text-sm font-semibold italic text-cocoa-900">
              Stoneware nie direkt auf die Arbeitsplatte
            </p>
            <p className="mt-1 text-sm leading-relaxed text-cocoa-800">
              Stell sie immer auf ein Abkuehlgitter, damit dein Brot nicht nachfeuchtet und deine Stoneware keinen Schaden nimmt.
            </p>
            <a
              href="https://www.pamperedchef.eu/pws/FelicitasReitmeier/store/DEO/catalog/Backen/Kuchengitter"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-3 block w-full text-center"
            >
              Abkuehlgitter ansehen
            </a>
          </div>
        </div>
      )}

      <div className="space-y-2 pt-2">
        <button type="button" onClick={backToCauses} className="btn-primary w-full">
          Andere Ursache pruefen
        </button>
        <button type="button" onClick={backToHome} className="btn-secondary w-full">
          Neues Problem
        </button>
      </div>
    </div>
  );
}

export default function FehlerfinderPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-cocoa-700">Laedt ...</div>}>
      <FehlerfinderInner />
    </Suspense>
  );
}
