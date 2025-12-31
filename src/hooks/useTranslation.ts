import { useCallback } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import plTranslations from '@/locales/pl.json';
import enTranslations from '@/locales/en.json';
import deTranslations from '@/locales/de.json';
import frTranslations from '@/locales/fr.json';
import esTranslations from '@/locales/es.json';

type TranslationKey = string;
type Translations = typeof enTranslations;

const translationsMap: Record<Language, Translations> = {
  en: enTranslations,
  pl: plTranslations,
  de: deTranslations,
  fr: frTranslations,
  es: esTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguage();
  const translations = translationsMap[language];

  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    return fallback || key;
  }, [translations]);

  const tArray = useCallback((key: TranslationKey): string[] => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return Array.isArray(value) ? value : [];
  }, [translations]);

  return { t, tArray, language };
};