import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DashboardOverview, Leak } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

interface DashboardViewProps {
  data: DashboardOverview | null;
  onViewOpportunity: (leak: Leak) => void;
  onNavigateTab: (tab: 'opportunities' | 'recoveries') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onViewOpportunity,
  onNavigateTab,
}) => {
  const { t, formatMoney, theme } = useApp();
  const isDark = theme === 'dark';

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between gap-3 p-1">
      {/* 4 Core Financial Metrics - Compact & Screen-Fitted */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0">
        {/* 1. Potential Annual Leak */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.potentialAnnual}</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight">
            {formatMoney(data.potentialRecovery.annualized)}
          </div>
          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {formatMoney(data.potentialRecovery.monthly)} / month
          </p>
        </div>

        {/* 2. Verified Recovery */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.verifiedRecovery}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-500 tracking-tight">
            {formatMoney(data.verifiedRecovery.amount)}
          </div>
          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Audited &amp; ready for invoice
          </p>
        </div>

        {/* 3. Actual Recovered Cash */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.actualRecovered}</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-500 tracking-tight">
            {formatMoney(data.actualRecovery.amount)}
          </div>
          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            100% direct to your bank
          </p>
        </div>

        {/* 4. Net Retained (90%) */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isDark ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-emerald-50/60 border-emerald-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t.netBenefit}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatMoney(data.netBenefit.amount)}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            After 10% performance fee
          </p>
        </div>
      </div>

      {/* Main Dual-Panel Viewport (Fitted Screen, No Outer Scroll) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2.5 min-h-0">
        {/* Left: Active Unresolved Opportunities */}
        <div
          className={`flex flex-col rounded-xl border overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className={`px-3 py-2 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold">{t.opportunities}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-500">
                {data.topOpportunities.length}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('opportunities')}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
            {data.topOpportunities.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Zero active leaks detected.
              </div>
            ) : (
              data.topOpportunities.map(leak => (
                <div
                  key={leak.id}
                  onClick={() => onViewOpportunity(leak)}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-slate-850 border-slate-800 hover:bg-slate-800'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs truncate">{leak.customer?.name || 'Customer'}</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {leak.detectorId}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {leak.summary || leak.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-rose-500">
                      +{formatMoney(leak.estimatedAnnualLoss)}/yr
                    </div>
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      {(parseFloat(leak.confidence) * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recoveries Ledger & Attributable Payouts */}
        <div
          className={`flex flex-col rounded-xl border overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className={`px-3 py-2 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'
          }`}>
            <div className="flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-bold">{t.recoveries}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-500">
                {data.recentRecoveries.length}
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('recoveries')}
              className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
            >
              <span>Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
            {data.recentRecoveries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No recoveries logged yet. Verify a leak to collect cash.
              </div>
            ) : (
              data.recentRecoveries.map(rec => (
                <div
                  key={rec.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs truncate">{rec.customerName}</span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {rec.externalPaymentId || 'Direct Charge'}
                      </span>
                    </div>
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {rec.leakTitle} &bull; {new Date(rec.paymentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(rec.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Fee: {formatMoney(rec.feeAmount)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
