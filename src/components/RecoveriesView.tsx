import React from 'react';
import { CircleDollarSign, Plus, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';
import { Recovery } from '../types.ts';
import { calculateFee } from '../lib/fee.ts';
import { useApp } from '../context/AppContext.tsx';

interface RecoveriesViewProps {
  recoveries: Recovery[];
  summary: {
    verified: string;
    recovered: string;
    rlhFees: string;
    netBenefit: string;
  };
  onSelectRecovery: (rec: Recovery) => void;
  onOpenRecordPayment: (rec: Recovery) => void;
}

export const RecoveriesView: React.FC<RecoveriesViewProps> = ({
  recoveries,
  summary,
  onSelectRecovery,
  onOpenRecordPayment,
}) => {
  const { t, formatMoney, theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="h-full flex flex-col justify-between gap-2.5 p-1 select-none">
      {/* 4 Financial Summary Cards (Compact, Screen-Fitted) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0">
        <div
          className={`p-2.5 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t.verifiedRecovery}
          </span>
          <div className="text-lg sm:text-xl font-black text-blue-500 mt-0.5">
            {formatMoney(summary.verified)}
          </div>
          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target verified revenue</p>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50/60 border-emerald-200 shadow-2xs'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t.actualRecovered}
          </span>
          <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatMoney(summary.recovered)}
          </div>
          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-emerald-700'}`}>Direct merchant payments</p>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t.performanceFee}
          </span>
          <div className={`text-lg sm:text-xl font-black mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {formatMoney(summary.rlhFees)}
          </div>
          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Contingency success fee</p>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            isDark ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-slate-900 text-white shadow-2xs'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {t.netBenefit}
          </span>
          <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
            {formatMoney(summary.netBenefit)}
          </div>
          <p className="text-[10px] text-slate-400">90% retained in your bank</p>
        </div>
      </div>

      {/* Screen-Fitted Recoveries Table (Internal Scroll Only) */}
      <div
        className={`flex-1 rounded-xl border overflow-hidden flex flex-col min-h-0 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div
          className={`px-3 py-2 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">{t.recoveries}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {recoveries.length}
            </span>
          </div>
          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            100% Direct Stripe Payouts
          </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead
              className={`sticky top-0 z-10 border-b text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Opportunity</th>
                <th className="py-2.5 px-3">Verified Annual</th>
                <th className="py-2.5 px-3">Recovered Cash</th>
                <th className="py-2.5 px-3">RLH Fee (10%)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recoveries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No verified recoveries yet. Verify a leak opportunity to begin recording incremental cash.
                  </td>
                </tr>
              ) : (
                recoveries.map(rec => {
                  const feeMoney = calculateFee(rec.actualAmount);
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => onSelectRecovery(rec)}
                      className={`transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-slate-800/60' : 'hover:bg-emerald-50/40'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {rec.customer?.name || 'Customer'}
                      </td>
                      <td className="py-2.5 px-3 max-w-xs truncate text-slate-700 dark:text-slate-300">
                        {rec.leak?.title || 'Verified Leak Finding'}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-400">
                        {formatMoney(rec.verifiedAmount)}/yr
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMoney(rec.actualAmount)}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {formatMoney(feeMoney.toFixed(2))}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1.5">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onOpenRecordPayment(rec);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-[0_0_10px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50 transition-all cursor-pointer inline-flex items-center gap-1"
                          title="Record customer invoice payment"
                        >
                          <Sparkles className="w-3 h-3 text-slate-950" />
                          <span>+ {t.recordPayment}</span>
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectRecovery(rec);
                          }}
                          className={`px-2 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                            isDark
                              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
