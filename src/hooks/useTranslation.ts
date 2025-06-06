
import { useCallback } from 'react';
import plTranslations from '@/locales/pl.json';
import enTranslations from '@/locales/en.json';

type TranslationKey = string;
type Translations = typeof plTranslations;

export const useTranslation = (language: 'pl' | 'en' = 'pl') => {
  const translations: Translations = language === 'pl' ? plTranslations : enTranslations;

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

  return { t, tArray };
};
