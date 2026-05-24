"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { translations, LANGS } from "@/lib/translations";

const LangContext = createContext({
  lang: "de",
  setLang: () => {},
  t: (k) => k,
});

function writeCookie(l) {
  try {
    document.cookie = "lang=" + l + ";path=/;max-age=31536000";
  } catch (e) {}
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("de");
  const router = useRouter();

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
    // Cookie setzen, damit auch Server-Seiten die Sprache kennen
    writeCookie(saved);
  }, []);

  function setLang(l) {
    if (!LANGS.includes(l)) return;
    setLangState(l);
    try {
      window.localStorage.setItem("lang", l);
    } catch (e) {}
    writeCookie(l);
    // Server-Seiten (z. B. Brote, SOS) neu rendern lassen
    router.refresh();
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
