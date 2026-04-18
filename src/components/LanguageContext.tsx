"use client";
// src/components/LanguageContext.tsx — FR / EN bilingual system

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

interface LangCtx {
  lang:    Lang;
  setLang: (l: Lang) => void;
  /** Accepts both plain strings and JSX for inline bilingual content. */
  t:       (fr: ReactNode, en: ReactNode) => ReactNode;
}

const Ctx = createContext<LangCtx>({
  lang:    "fr",
  setLang: () => {},
  t:       (fr) => fr,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const stored = localStorage.getItem("dme-lang");
    if (stored === "fr" || stored === "en") setLang(stored as Lang);
  }, []);

  const handle = (l: Lang) => {
    setLang(l);
    localStorage.setItem("dme-lang", l);
  };

  return (
    <Ctx.Provider
      value={{
        lang,
        setLang: handle,
        t: (fr, en) => (lang === "en" ? en : fr),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
