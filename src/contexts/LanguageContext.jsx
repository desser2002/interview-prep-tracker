import { useState } from 'react';
import { translations } from '../i18n/translations';
import { LanguageContext } from './languageContext';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem('app-lang');
      return stored === 'en' || stored === 'ru' ? stored : 'ru';
    } catch {
      return 'ru';
    }
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('app-lang', newLang);
    } catch {
      // ignore
    }
  };

  const t = (key, ...args) => {
    const dict = translations[lang] ?? translations.ru;
    const val = dict[key] ?? translations.ru[key] ?? key;
    if (typeof val === 'function') return val(...args);
    return val;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
