import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Customer } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

export interface CustomerWithMetrics extends Customer {
  opportunityCount: number;
  potentialAmount: string;
  verifiedAmount: string;
  recoveredAmount: string;
  risk: 'HIGH' | 'LOW';
}

interface CustomersViewProps {
  customers: CustomerWithMetrics[];
  onSelectCustomer: (customer: CustomerWithMetrics) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers, onSelectCustomer }) => {
  const { theme, formatMoney } = useApp();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'HIGH' | 'LOW'>('ALL');

  const filtered = customers.filter(c => {
    if (filterRisk !== 'ALL' && c.risk !== filterRisk) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        c.externalId.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Customer Revenue Profiles</h1>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Normalized billing entities, active leak exposure, and verified recoveries by customer.
        </p>
      </div>

      {/* Search & Filter */}
      <div
        className={`p-3 rounded-xl border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers by name, email, or Stripe ID..."
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Risk Exposure:</span>
          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value as any)}
            className={`text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="ALL">All Customers</option>
            <option value="HIGH">High Risk (Active Leaks)</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div
        className={`rounded-xl border overflow-hidden shadow-xs ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b uppercase font-semibold text-[11px] ${
                isDark
                  ? 'bg-slate-800/60 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <tr>
                <th className="py-2.5 px-3.5">Customer Name</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5">Open Opportunities</th>
                <th className="py-2.5 px-3.5">Potential Recovery</th>
                <th className="py-2.5 px-3.5">Verified</th>
                <th className="py-2.5 px-3.5">Recovered</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map(cust => (
                  <tr
                    key={cust.id}
                    onClick={() => onSelectCustomer(cust)}
                    className={`transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-3.5 font-semibold">
                      <div>{cust.name}</div>
                      <div className={`text-[11px] font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {cust.externalId}
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cust.status === 'ACTIVE'
                            ? isDark
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-emerald-100 text-emerald-800'
                            : cust.status === 'DELINQUENT'
                            ? isDark
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-rose-100 text-rose-800'
                            : isDark
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-medium">
                      {cust.opportunityCount > 0 ? (
                        <span className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                          {cust.opportunityCount} detected
                        </span>
                      ) : (
                        <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>0</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-bold">
                      {formatMoney(cust.potentialAmount)}/yr
                    </td>
                    <td className={`py-3 px-3.5 font-medium ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                      {formatMoney(cust.verifiedAmount)}/yr
                    </td>
                    <td className={`py-3 px-3.5 font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {formatMoney(cust.recoveredAmount)}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectCustomer(cust);
                        }}
                        className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                          isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
