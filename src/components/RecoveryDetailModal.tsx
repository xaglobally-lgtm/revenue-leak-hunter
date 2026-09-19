import React from 'react';
import { X, CheckCircle2, DollarSign, Calendar, Clock, ArrowRight, ShieldCheck, Receipt, Printer } from 'lucide-react';
import { Recovery } from '../types.ts';
import { calculateFee } from '../lib/fee.ts';
import { buildFeeStatementHtml } from '../lib/statement.ts';
import { useApp } from '../context/AppContext.tsx';

interface RecoveryDetailModalProps {
  recovery: Recovery;
  onClose: () => void;
  onRecordPayment: (rec: Recovery) => void;
}

export const RecoveryDetailModal: React.FC<RecoveryDetailModalProps> = ({
  recovery,
  onClose,
  onRecordPayment,
}) => {
  const { theme, currency: appCurrency, formatMoney } = useApp();
  const isDark = theme === 'dark';

  const recoveredMoney = parseFloat(recovery.actualAmount || '0');
  const verifiedMoney = parseFloat(recovery.verifiedAmount || '0');
  const remainingMoney = Math.max(0, verifiedMoney - recoveredMoney);
  const rlhFee = calculateFee(recoveredMoney);

  const handlePrintStatement = () => {
    const total = recoveredMoney;
    const fee = calculateFee(total);
    const net = total - fee;
    const currencyLabel = (recovery.currency || appCurrency || 'USD').toUpperCase();
    const paid = recovery.payments || [];
    const fmt = (n: number) => formatMoney(n.toFixed(2));
    const fmtDate = (d?: string, long = true) =>
      d
        ? new Date(d).toLocaleDateString('en-US', long ? { year: 'numeric', month: 'long', day: 'numeric' } : { year: 'numeric', month: 'short', day: 'numeric' })
        : '—';

    const html = buildFeeStatementHtml({
      invoiceNo: `RLH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${recovery.id.slice(-4).toUpperCase()}`,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      periodEnd: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      customerName: recovery.customer?.name || 'Client',
      recoveryTitle: recovery.leak?.title || 'Verified revenue leak',
      attributionWindow: `${fmtDate(recovery.recoveryStart)} → ${fmtDate(recovery.recoveryEnd)}`,
      recoveredTotal: fmt(total),
      feeTotal: fmt(fee),
      netTotal: fmt(net),
      currencyLabel,
      lines: paid.map(p => ({
        date: fmtDate(p.paymentDate, false),
        externalId: p.externalPaymentId || '—',
        description: 'Incremental attributable payment',
        amount: fmt(parseFloat(p.amount || '0')),
        fee: fmt(parseFloat(p.feeAmount || '0')),
      })),
    });

    const w = window.open('', '_blank', 'width=880,height=1000,scrollbars=yes');
    if (!w) {
      window.alert('Please allow pop-ups to print the fee statement.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 350);
  };

  const attributionPeriod = `${recovery.recoveryStart ? recovery.recoveryStart.split('T')[0] : 'N/A'} → ${
    recovery.recoveryEnd ? recovery.recoveryEnd.split('T')[0] : 'N/A'
  }`;

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
                  isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {recovery.status}
              </span>
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                12-Month Attribution Window
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {recovery.customer?.name} &mdash; Recovery Ledger
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{recovery.leak?.title}</p>
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

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              className={`p-3 rounded-xl border text-xs ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified Potential</span>
              <div className="text-base font-bold mt-1">{formatMoney(recovery.verifiedAmount)}</div>
            </div>
            <div
              className={`p-3 rounded-xl border text-xs ${
                isDark
                  ? 'bg-emerald-950/40 border-emerald-900 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <span className="font-semibold">Recovered Cash</span>
              <div className="text-base font-extrabold mt-1">{formatMoney(recovery.actualAmount)}</div>
            </div>
            <div
              className={`p-3 rounded-xl border text-xs ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Remaining Run Rate</span>
              <div className="text-base font-bold mt-1">{formatMoney(remainingMoney.toFixed(2))}</div>
            </div>
            <div
              className={`p-3 rounded-xl text-xs ${
                isDark ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-slate-900 text-white'
              }`}
            >
              <span className="text-emerald-400 font-semibold">RLH Fee (10%)</span>
              <div className="text-base font-extrabold text-white mt-1">{formatMoney(rlhFee.toFixed(2))}</div>
            </div>
          </div>

          {/* Section 14: Fee Explanation Widget */}
          <div
            className={`p-4 rounded-xl border space-y-3 ${
              isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Transparent Fee Explanation
                </h3>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}
              >
                10% Recovery Only
              </span>
            </div>

            <div className={`text-xs divide-y border-t pt-2 ${isDark ? 'divide-slate-700 border-slate-700' : 'divide-slate-200 border-slate-200'}`}>
              <div className="flex items-center justify-between py-1.5">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Recovered Revenue Actually Collected</span>
                <span className="font-mono font-bold">{formatMoney(recovery.actualAmount)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Attribution Period (12 Months)</span>
                <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{attributionPeriod}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Revenue Leak Hunter Agreed Rate</span>
                <span className="font-mono font-bold">10%</span>
              </div>
              <div
                className={`flex items-center justify-between py-1.5 font-bold px-2 rounded ${
                  isDark ? 'bg-emerald-950/50 text-emerald-300' : 'bg-emerald-50/60 text-emerald-900'
                }`}
              >
                <span>Calculated Fee</span>
                <span className="font-mono">{formatMoney(rlhFee.toFixed(2))}</span>
              </div>
            </div>

            <p className={`text-[11px] leading-relaxed italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Fees are only generated when incremental attributable payments are actually received. No fees are ever charged on unrealized potential or refunded payments.
            </p>
          </div>

          {/* Timeline of Recovery Events */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Attribution Timeline
            </h3>
            <div className={`space-y-3 border-l-2 pl-4 text-xs ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400 absolute -left-[21px] top-1" />
                <p className="font-semibold">Opportunity Detected</p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {new Date(recovery.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[21px] top-1" />
                <p className="font-semibold">Customer Verified Finding</p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {recovery.verifiedAt ? new Date(recovery.verifiedAt).toLocaleDateString() : 'Confirmed'} &bull; Target set to {formatMoney(recovery.verifiedAmount)}/yr
                </p>
              </div>

              {recovery.payments && recovery.payments.length > 0 ? (
                recovery.payments.map((p) => (
                  <div key={p.id} className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[21px] top-1" />
                    <p className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-900'}`}>
                      +{formatMoney(p.amount)} Incremental Payment Collected
                    </p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(p.paymentDate).toLocaleDateString()} &bull; External ID: {p.externalPaymentId || 'Stripe'} &bull; RLH Fee: {formatMoney(p.feeAmount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className={`text-[11px] italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Awaiting first attributable billing cycle payment...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-2 ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRecordPayment(recovery)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Record Incremental Payment</span>
            </button>
            <button
              onClick={handlePrintStatement}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Fee Statement</span>
            </button>
          </div>
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
