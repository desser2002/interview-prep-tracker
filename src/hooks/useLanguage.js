import { useContext } from 'react';
import { LanguageContext } from '../contexts/languageContext';

export function useLanguage() {
  return useContext(LanguageContext);
}
