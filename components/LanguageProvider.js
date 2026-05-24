"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, LANGS } from "@/lib/translations";

const LangContext = createContext({
  lang: "de",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("de");

  useEffect(() => {
    let saved = null;
    try {
      saved = window.localStorage.getItem("lang");
    } catch (e) {}
    if (!saved || !LANGS.includes(saved)) {
      const nav = (navigator.language || "de").slice(0, 2).toLowerCase();
      saved = LANGS.includes(nav) ? nav : "de";
    }
    setLangState(saved);
  }, []);

  function setLang(l) {
    if (!LANGS.includes(l)) return;
    setLangState(l);
    try {
      window.localStorage.setItem("lang", l);
    } catch (e) {}
    try {
      document.cookie = "lang=" + l + ";path=/;max-age=31536000";
    } catch (e) {}
  }

  function t(key) {
    const dict = translations[lang] || translations.de;
    return dict[key] || translations.de[key] || key;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
