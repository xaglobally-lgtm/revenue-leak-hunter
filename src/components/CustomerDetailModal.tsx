import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CustomerWithMetrics } from './CustomersView.tsx';
import { Leak, Recovery, Subscription, Invoice } from '../types.ts';
import { StatusBadge } from './OpportunitiesView.tsx';
import { useApp } from '../context/AppContext.tsx';

interface CustomerDetailModalProps {
  customer: CustomerWithMetrics;
  onClose: () => void;
  onSelectOpportunity: (leak: Leak) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  onSelectOpportunity,
}) => {
  const { theme, formatMoney } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState<{
    opportunities: Leak[];
    recoveries: Recovery[];
    subscriptions: Subscription[];
    invoices: Invoice[];
  } | null>(null);
  const [tab, setTab] = useState<'opportunities' | 'recoveries' | 'billing'>('opportunities');

  useEffect(() => {
    fetch(`/api/v1/customers/${customer.id}`, {
      headers: { 'x-organization-id': customer.organizationId || 'org_acme_corp' },
    })
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setData(json.data);
        }
      })
      .catch(console.error);
  }, [customer.id, customer.organizationId]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`rounded-2xl max-w-2xl w-full border shadow-2xl overflow-hidden my-6 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-start justify-between ${
            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {customer.externalId}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {customer.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">{customer.name}</h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {customer.email || 'No billing email recorded'}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Financial Summary */}
        <div
          className={`p-3.5 grid grid-cols-3 gap-3 border-b text-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50/50 border-slate-200'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg border ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Revenue Opportunity</span>
            <div className="text-base font-bold mt-1">{formatMoney(customer.potentialAmount)}/yr</div>
          </div>
          <div
            className={`p-2.5 rounded-lg border ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Verified Target</span>
            <div className={`text-base font-bold mt-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
              {formatMoney(customer.verifiedAmount)}/yr
            </div>
          </div>
          <div
            className={`p-2.5 rounded-lg border ${
              isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Recovered Cash</span>
            <div className={`text-base font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              {formatMoney(customer.recoveredAmount)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`px-5 border-b flex items-center gap-4 text-xs font-semibold ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <button
            onClick={() => setTab('opportunities')}
            className={`py-2.5 border-b-2 transition-colors ${
              tab === 'opportunities'
                ? isDark
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-emerald-600 text-emerald-700'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Opportunities ({data?.opportunities.length || 0})
          </button>
          <button
            onClick={() => setTab('recoveries')}
            className={`py-2.5 border-b-2 transition-colors ${
              tab === 'recoveries'
                ? isDark
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-emerald-600 text-emerald-700'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Recoveries ({data?.recoveries.length || 0})
          </button>
          <button
            onClick={() => setTab('billing')}
            className={`py-2.5 border-b-2 transition-colors ${
              tab === 'billing'
                ? isDark
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-emerald-600 text-emerald-700'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Subscriptions &amp; Invoices
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[45vh] overflow-y-auto no-scrollbar text-xs space-y-3">
          {tab === 'opportunities' && (
            <div className="space-y-2">
              {!data?.opportunities.length ? (
                <p className={`text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No open opportunities for this customer.
                </p>
              ) : (
                data.opportunities.map(opp => (
                  <div
                    key={opp.id}
                    onClick={() => onSelectOpportunity(opp)}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      isDark
                        ? 'border-slate-800 hover:bg-slate-800/60 text-slate-200'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{opp.title}</span>
                        <StatusBadge status={opp.status} />
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {opp.summary}
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-bold ml-4">
                      {formatMoney(opp.estimatedAnnualLoss)}/yr
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'recoveries' && (
            <div className="space-y-2">
              {!data?.recoveries.length ? (
                <p className={`text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No verified recovery records yet.
                </p>
              ) : (
                data.recoveries.map(rec => (
                  <div
                    key={rec.id}
                    className={`p-3 rounded-lg border space-y-1 ${
                      isDark
                        ? 'border-emerald-900/60 bg-emerald-950/30'
                        : 'border-emerald-200 bg-emerald-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className={isDark ? 'text-emerald-300' : 'text-emerald-950'}>
                        Actual Recovered: {formatMoney(rec.actualAmount)}
                      </span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        Verified: {formatMoney(rec.verifiedAmount)}/yr
                      </span>
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Status: {rec.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'billing' && (
            <div className="space-y-4">
              <div>
                <h4 className={`font-bold mb-2 uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Active Subscriptions
                </h4>
                {data?.subscriptions.map(sub => (
                  <div
                    key={sub.id}
                    className={`p-2.5 rounded-lg border flex justify-between ${
                      isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{sub.externalId}</p>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Quantity: {sub.quantity || '1'} seats
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold self-center ${
                        isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className={`font-bold mb-2 uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Recent Invoices
                </h4>
                {data?.invoices.map(inv => (
                  <div
                    key={inv.id}
                    className={`p-2.5 rounded-lg border flex justify-between mb-1.5 ${
                      isDark ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{inv.externalId}</p>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                        Due: {inv.dueAt ? new Date(inv.dueAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatMoney(inv.amountDue)}</p>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-3.5 border-t text-right ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
