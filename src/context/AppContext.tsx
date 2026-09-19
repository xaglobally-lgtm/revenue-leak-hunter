import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Locale, translations, TranslationDict } from '../lib/i18n.ts';
import { supportedCurrencies, formatConvertedMoney } from '../lib/currency.ts';

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDict;
  currency: string;
  setCurrency: (currency: string) => void;
  formatMoney: (amountInUSD: number | string | undefined | null) => string;
  isOnline: boolean;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
  guidedStep: number;
  setGuidedStep: (step: number) => void;
  workflowStep: 'detect' | 'verify' | 'collect' | 'ledger';
  setWorkflowStep: (step: 'detect' | 'verify' | 'collect' | 'ledger') => void;
  isRTL: boolean;
  activeOrgId: string;
  setActiveOrgId: (orgId: string) => void;
  legalDoc: 'privacy' | 'terms' | null;
  setLegalDoc: (doc: 'privacy' | 'terms' | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state with localStorage
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('rlh_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Locale state
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('rlh_locale') as Locale;
    if (saved && translations[saved]) return saved;
    return 'en';
  });

  // Currency state
  const [currency, setCurrencyState] = useState<string>(() => {
    const saved = localStorage.getItem('rlh_currency');
    if (saved && supportedCurrencies[saved]) return saved;
    return 'USD';
  });

  // Online / Offline tracking
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Resizable sidebar boundary (default 240px, adjustable between 68px and 360px)
  const [sidebarWidth, setSidebarWidthState] = useState<number>(() => {
    const saved = localStorage.getItem('rlh_sidebar_width');
    const parsed = saved ? parseInt(saved, 10) : 230;
    return isNaN(parsed) ? 230 : Math.min(Math.max(parsed, 68), 360);
  });

  // Guided next-touch workflow step (1: Detect, 2: Verify, 3: Collect, 4: Ledger)
  const [guidedStep, setGuidedStep] = useState<number>(1);
  const [workflowStep, setWorkflowStep] = useState<'detect' | 'verify' | 'collect' | 'ledger'>('detect');

  // About modal open state
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Active tenant organization (default: Acme Revenue Operations demo tenant)
  const [activeOrgId, setActiveOrgId] = useState<string>(() => localStorage.getItem('rlh_org') || 'org_acme_corp');

  // Legal documents (Privacy / Terms) modal state
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  // Sync theme changes to HTML element class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('rlh_theme', theme);
  }, [theme]);

  // Sync locale
  useEffect(() => {
    localStorage.setItem('rlh_locale', locale);
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Sync currency
  useEffect(() => {
    localStorage.setItem('rlh_currency', currency);
  }, [currency]);

  // Sync sidebar width
  const setSidebarWidth = (width: number) => {
    const clamped = Math.min(Math.max(width, 68), 360);
    setSidebarWidthState(clamped);
    localStorage.setItem('rlh_sidebar_width', clamped.toString());
  };

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
  };

  const t = useMemo(() => translations[locale] || translations.en, [locale]);
  const isRTL = locale === 'ar';

  const formatMoney = (amountInUSD: number | string | undefined | null) => {
    return formatConvertedMoney(amountInUSD, currency);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        locale,
        setLocale,
        t,
        currency,
        setCurrency,
        formatMoney,
        isOnline,
        sidebarWidth,
        setSidebarWidth,
        isAboutOpen,
        setIsAboutOpen,
        guidedStep,
        setGuidedStep,
        workflowStep,
        setWorkflowStep,
        isRTL,
        activeOrgId,
        setActiveOrgId,
        legalDoc,
        setLegalDoc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
