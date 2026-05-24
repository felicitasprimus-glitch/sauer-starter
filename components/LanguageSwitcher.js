"use client";

import { useLang } from "@/components/LanguageProvider";
import { LANGS, LANG_LABELS } from "@/lib/translations";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="inline-flex overflow-hidden rounded-full border border-white/40 bg-white/15 backdrop-blur">
      {LANGS.map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className="px-2.5 py-1 text-[11px] font-bold transition-colors"
            style={
              active
                ? { background: "rgba(255,255,255,0.9)", color: "#5a3f56" }
                : { color: "rgba(255,255,255,0.9)" }
            }
          >
            {LANG_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
