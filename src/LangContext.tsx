import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Lang, Translations } from './i18n';

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  return (
    <LangContext.Provider value={{
      lang,
      t: translations[lang] as unknown as Translations,
      toggle: () => setLang(l => l === 'en' ? 'ko' : 'en'),
    }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
