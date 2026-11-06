import { createContext, useContext } from "react";
import type { Lang, Localized } from "./types";

export type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Pilih teks sesuai bahasa aktif. */
  t: <T>(value: Localized<T>) => T;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLang(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLang must be used inside <LanguageProvider>");
  }
  return context;
}
