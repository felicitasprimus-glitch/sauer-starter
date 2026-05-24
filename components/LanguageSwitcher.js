"use client";

import { useLang } from "@/components/LanguageProvider";
import { LANGS, LANG_LABELS } from "@/lib/translations";

export default function LanguageSwitcher({ variant = "onDark" }) {
  const { lang, setLang } = useLang();
  const light = variant === "light";

  const wrap = light
    ? "inline-flex overflow-hidden rounded-full border border-line bg-white"
    : "inline-flex overflow-hidden rounded-full border border-white/40 bg-white/15 backdrop-blur";

  function btnStyle(active) {
    if (light) {
      return active
        ? { background: "#8b6a7d", color: "#fff" }
        : { color: "#9a8290" };
    }
    return active
      ? { background: "rgba(255,255,255,0.9)", color: "#5a3f56" }
      : { color: "rgba(255,255,255,0.9)" };
  }

  return (
    <div className={wrap}>
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className="px-2.5 py-1 text-[11px] font-bold transition-colors"
          style={btnStyle(lang === code)}
        >
          {LANG_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
