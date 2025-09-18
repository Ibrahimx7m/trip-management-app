'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, getNestedTranslation } from '@/i18n/translations';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      
      // Update document direction and language
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      
      // Update document title
      const siteName = language === 'ar' ? 'نخبة النقل' : 'Nukhbat Al-Naql';
      document.title = siteName;
    }
  }, [language]);

  const t = (key: string): string => {
    return getNestedTranslation(translations[language], key);
  };

  const isRTL = language === 'ar';

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <TranslationContext.Provider value={value}>
      <div className={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    // Return default values instead of throwing error during SSR
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      isRTL: false
    };
  }
  return context;
};

// Hook for easy access to translation function
export const useT = () => {
  const { t } = useTranslation();
  return t;
};
