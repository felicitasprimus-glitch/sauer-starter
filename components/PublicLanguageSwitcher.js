"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LANGS, LANG_LABELS } from "@/lib/translations";

// Sprach-Umschalter fuer oeffentliche Seiten (vor dem Login).
// Schreibt Cookie "lang" + localStorage "lang" - genau wie der App-Umschalter,
// damit die Sprachwahl spaeter in der eingeloggten App weiterlaeuft.
export default function PublicLanguageSwitcher({ initialLang = "de" }) {
  const router = useRouter();
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang");
      if (stored && stored !== initialLang && LANGS.includes(stored)) {
        document.cookie = "lang=" + stored + ";path=/;max-age=31536000";
        setLang(stored);
        router.refresh();
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(l) {
    if (l === lang) return;
    setLang(l);
    try {
      localStorage.setItem("lang", l);
    } catch (e) {}
    document.cookie = "lang=" + l + ";path=/;max-age=31536000";
    router.refresh();
  }

  return (
    <div className="flex justify-center gap-1.5">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          className={
            "rounded-full px-3 py-1 text-xs font-semibold transition " +
            (lang === l
              ? "bg-mauve-500 text-cream-50"
              : "border border-mauve-200 bg-white text-mauve-700 hover:border-mauve-500")
          }
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
