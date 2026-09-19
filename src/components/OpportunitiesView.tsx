import React, { useState } from 'react';
import { Search, Sparkles, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { Leak, LeakStatus } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

interface OpportunitiesViewProps {
  opportunities: Leak[];
  onSelectOpportunity: (leak: Leak) => void;
  onRefresh: () => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  onSelectOpportunity,
}) => {
  const { t, formatMoney, theme } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [detectorFilter, setDetectorFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const isDark = theme === 'dark';

  const filtered = opportunities.filter(item => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'HIGH_CONFIDENCE') {
        if (parseFloat(item.confidence) < 0.9) return false;
      } else if (item.status !== statusFilter) {
        return false;
      }
    }
    if (detectorFilter !== 'ALL' && item.detectorId !== detectorFilter) {
      return false;
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchCustomer = item.customer?.name?.toLowerCase().includes(term);
      const matchTitle = item.title.toLowerCase().includes(term);
      const matchDetector = item.detectorId.toLowerCase().includes(term);
      if (!matchCustomer && !matchTitle && !matchDetector) return false;
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col justify-between gap-2.5 p-1 select-none">
      {/* Header & Filter Row (Compact, Screen-Fitted) */}
      <div
        className={`p-2.5 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer, title, or detector..."
            className={`w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-emerald-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-600'
            }`}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-50 border-slate-300 text-slate-700'
            }`}
          >
            <option value="ALL">All Statuses</option>
            <option value="DETECTED">New (Detected)</option>
            <option value="HIGH_CONFIDENCE">High Confidence (≥90%)</option>
            <option value="VERIFIED">Verified</option>
            <option value="RECOVERING">Recovering</option>
            <option value="RECOVERED">Recovered</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={detectorFilter}
            onChange={e => setDetectorFilter(e.target.value)}
            className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-50 border-slate-300 text-slate-700'
            }`}
          >
            <option value="ALL">All Detectors</option>
            <option value="BILL-001">BILL-001 (Seat Discrepancy)</option>
            <option value="PAY-001">PAY-001 (Failed Recurring Card)</option>
            <option value="PRICE-001">PRICE-001 (Expired Promo Coupon)</option>
            <option value="INV-001">INV-001 (Missing Invoice Cadence)</option>
            <option value="USAGE-001">USAGE-001 (Unbilled Metered Usage)</option>
          </select>
        </div>
      </div>

      {/* Screen-Fitted Table (Internal Scroll Only) */}
      <div
        className={`flex-1 rounded-xl border overflow-hidden flex flex-col min-h-0 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead
              className={`sticky top-0 z-10 border-b text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Finding Title</th>
                <th className="py-2.5 px-3">Rule</th>
                <th className="py-2.5 px-3">Annual Impact</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No discrepancies found matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map(item => {
                  const conf = Math.round(parseFloat(item.confidence) * 100);
                  const isNew = item.status === LeakStatus.DETECTED;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectOpportunity(item)}
                      className={`transition-colors cursor-pointer ${
                        isDark ? 'hover:bg-slate-800/60' : 'hover:bg-emerald-50/40'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {item.customer?.name || item.customerName || 'Customer'}
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                        <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.summary}
                        </p>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 font-mono text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.detectorId}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-rose-500">
                          +{formatMoney(item.estimatedAnnualLoss)}/yr
                        </span>
                        <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {formatMoney(item.estimatedMonthlyLoss)}/mo
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 font-bold rounded text-[10px] ${
                            conf >= 90
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {conf}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isNew ? (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onSelectOpportunity(item);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded shadow-[0_0_10px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                          >
                            <Sparkles className="w-3 h-3 text-slate-950" />
                            <span>Verify</span>
                          </button>
                        ) : (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onSelectOpportunity(item);
                            }}
                            className={`px-2 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                              isDark
                                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            Inspect
                          </button>
                        )}
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

export const StatusBadge: React.FC<{ status: LeakStatus }> = ({ status }) => {
  switch (status) {
    case LeakStatus.VERIFIED:
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">VERIFIED</span>;
    case LeakStatus.RECOVERING:
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">RECOVERING</span>;
    case LeakStatus.RECOVERED:
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">RECOVERED</span>;
    case LeakStatus.REJECTED:
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">REJECTED</span>;
    default:
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">DETECTED</span>;
  }
};
