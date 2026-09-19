import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Leak } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

interface VerifyModalProps {
  leak: Leak;
  onClose: () => void;
  onConfirm: (leakId: string, notes: string) => void;
}

export const VerifyModal: React.FC<VerifyModalProps> = ({ leak, onClose, onConfirm }) => {
  const { theme, formatMoney } = useApp();
  const isDark = theme === 'dark';
  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [notes, setNotes] = useState('');

  const handleVerify = () => {
    if (!confirmedCheck) return;
    onConfirm(leak.id, notes);
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
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Confirm Legitimate Opportunity</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Track attributable recovery</p>
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

        <div
          className={`p-3.5 rounded-xl border space-y-2 text-xs ${
            isDark ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Customer:</span>
            <span className="font-semibold">{leak.customer?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Potential Recovery:</span>
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {formatMoney(leak.estimatedAnnualLoss)}/year
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Monthly Run Rate:</span>
            <span className="font-medium">{formatMoney(leak.estimatedMonthlyLoss)}/mo</span>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Optional Confirmation Notes
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Confirmed with customer account executive that seats are billable."
            className={`w-full p-2 text-xs rounded-lg border focus:outline-none transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-600 focus:bg-white'
            }`}
          />
        </div>

        <div
          className={`p-3 rounded-xl border flex items-start gap-2.5 ${
            isDark
              ? 'bg-emerald-950/40 border-emerald-900 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <input
            type="checkbox"
            id="verify-checkbox"
            checked={confirmedCheck}
            onChange={e => setConfirmedCheck(e.target.checked)}
            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="verify-checkbox" className="text-xs font-medium cursor-pointer">
            I confirm this opportunity represents legitimate revenue we intend to recover through billing adjustments.
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
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
            onClick={handleVerify}
            disabled={!confirmedCheck}
            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm &amp; Track Recovery</span>
          </button>
        </div>
      </div>
    </div>
  );
};
