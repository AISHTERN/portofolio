import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LanguageContext } from "./context";
import {
  detectInitialLang,
  getBrowserLanguages,
  readStoredLang,
  storeLang,
} from "./lang";
import type { Lang, Localized } from "./types";

type LanguageProviderProps = { children: ReactNode };

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Lang>(() =>
    detectInitialLang(readStoredLang(), getBrowserLanguages()),
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storeLang(next);
  }, []);

  const t = useCallback(<T,>(value: Localized<T>): T => value[lang], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
