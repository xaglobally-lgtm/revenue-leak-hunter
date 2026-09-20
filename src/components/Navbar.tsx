import React from 'react';
import {
  Globe,
  Coins,
  Sun,
  Moon,
  RefreshCw,
  DollarSign,
  Wifi,
  WifiOff,
  HelpCircle,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Locale } from '../lib/i18n.ts';
import { supportedCurrencies } from '../lib/currency.ts';
import { User } from '../types.ts';

interface NavbarProps {
  user: User | null;
  orgName: string;
  availableTenants: { id: string; name: string }[];
  activeOrgId: string;
  onSwitchTenant: (orgId: string) => void;
  onReviewOpportunities: () => void;
  onViewRecoveries: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  onSignOut?: () => void;
}

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'th', label: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ar', label: 'العربية (Arabic)', flag: '🇦🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '简体中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export const Navbar: React.FC<NavbarProps> = ({
  orgName,
  availableTenants,
  activeOrgId,
  onSwitchTenant,
  onViewRecoveries,
  onTriggerSync,
  isSyncing,
  onSignOut,
}) => {
  const {
    theme,
    toggleTheme,
    locale,
    setLocale,
    currency,
    setCurrency,
    isOnline,
    t,
    setIsAboutOpen,
  } = useApp();

  const isDark = theme === 'dark';

  return (
    <header
      className={`h-12 px-3 sm:px-4 border-b flex items-center justify-between shrink-0 select-none ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Left: Tenant & Mode badge */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs tracking-tight">{orgName}</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>{t.connected}</span>
          </span>
        </div>

        {/* Tenant selector */}
        <div className="hidden md:flex items-center pl-2 border-l border-slate-200 dark:border-slate-800">
          <select
            value={activeOrgId}
            onChange={e => onSwitchTenant(e.target.value)}
            className={`text-[11px] font-medium rounded px-1.5 py-1 border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {availableTenants.map(tenant => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Online / Offline indicator */}
        <div
          title={isOnline ? t.online : t.offline}
          className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
            isOnline
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
              : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
          }`}
        >
          {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          <span className="hidden lg:inline">{isOnline ? t.online : t.offline}</span>
        </div>
      </div>

      {/* Right: Currency, Language Selector, Dark/Light mode, Sync button */}
      <div className="flex items-center gap-2">
        {/* Currency Dropdown Selector */}
        <div className="flex items-center gap-1">
          <Coins className="w-3 h-3 text-slate-400" />
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            title={t.currency}
            className={`text-xs font-semibold rounded px-1.5 py-1 border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {Object.values(supportedCurrencies).map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Language Dropdown Selector (Top Right as requested) */}
        <div className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={locale}
            onChange={e => setLocale(e.target.value as Locale)}
            title={t.language}
            className={`text-xs font-semibold rounded px-1.5 py-1 border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? t.lightMode : t.darkMode}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750 hover:text-amber-300'
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Sync Trigger Action */}
        <button
          onClick={onTriggerSync}
          disabled={isSyncing}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? '...' : t.syncData}</span>
        </button>

        {/* About & Contact Icon */}
        <button
          onClick={() => setIsAboutOpen(true)}
          title={t.aboutContact}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
        </button>

        {/* Sign Out (only rendered when real auth is active) */}
        {onSignOut && (
          <button
            onClick={onSignOut}
            title="Sign out"
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
