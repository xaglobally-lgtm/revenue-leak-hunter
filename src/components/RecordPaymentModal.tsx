import React, { useState } from 'react';
import { DollarSign, X, CheckCircle2 } from 'lucide-react';
import { Recovery } from '../types.ts';
import { calculateFee } from '../lib/fee.ts';
import { useApp } from '../context/AppContext.tsx';

interface RecordPaymentModalProps {
  recovery: Recovery;
  onClose: () => void;
  onSubmit: (recoveryId: string, payment: { amount: string; currency: string; externalPaymentId?: string; paymentDate: string }) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  recovery,
  onClose,
  onSubmit,
}) => {
  const { theme, currency: appCurrency, formatMoney } = useApp();
  const isDark = theme === 'dark';

  const [amount, setAmount] = useState('1200.00');
  const [currency, setCurrency] = useState(recovery.currency || appCurrency || 'USD');
  const [paymentId, setPaymentId] = useState(`pi_${Date.now().toString().slice(-6)}`);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const numAmount = parseFloat(amount || '0');
  const calculatedFee = calculateFee(numAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;
    onSubmit(recovery.id, {
      amount,
      currency,
      externalPaymentId: paymentId,
      paymentDate: new Date(paymentDate).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className={`rounded-2xl max-w-md w-full border shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Record Recovery Payment</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Attribute incremental recovered cash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Customer / Opportunity
            </label>
            <p
              className={`p-2 rounded-lg border font-medium ${
                isDark ? 'bg-slate-800/70 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {recovery.customer?.name} &bull; {recovery.leak?.title}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Recovered Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className={`w-full p-2 rounded-lg border font-mono font-bold focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className={`w-full p-2 rounded-lg border font-mono focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                }`}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                External Payment ID
              </label>
              <input
                type="text"
                value={paymentId}
                onChange={e => setPaymentId(e.target.value)}
                placeholder="pi_stripe_123"
                className={`w-full p-2 rounded-lg border font-mono focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                }`}
                required
              />
            </div>
            <div>
              <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className={`w-full p-2 rounded-lg border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600'
                }`}
                required
              />
            </div>
          </div>

          {/* Transparent Fee Preview */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark
                ? 'bg-emerald-950/40 border-emerald-900 text-emerald-300'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}
          >
            <div>
              <p className="font-semibold">Attributable 10% Fee</p>
              <p className={`text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Calculated automatically on receipt
              </p>
            </div>
            <div className="text-right font-mono font-extrabold text-sm">
              +{formatMoney(calculatedFee.toFixed(2))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Record &amp; Calculate Fee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
