import React, { useState } from 'react';
import { XCircle, X } from 'lucide-react';
import { Leak } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

interface RejectModalProps {
  leak: Leak;
  onClose: () => void;
  onConfirm: (leakId: string, reason: string, notes: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({ leak, onClose, onConfirm }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [reason, setReason] = useState('CONTRACTUAL_EXCEPTION');
  const [notes, setNotes] = useState('');

  const rejectionOptions = [
    { value: 'CONTRACTUAL_EXCEPTION', label: 'Contractual exception (negotiated tier)' },
    { value: 'INTENTIONAL_PRICING', label: 'Intentional pricing or promotional waiver' },
    { value: 'INCORRECT_USAGE_DATA', label: 'Incorrect usage or test data' },
    { value: 'ALREADY_RECOVERED', label: 'Already recovered or corrected internally' },
    { value: 'DUPLICATE', label: 'Duplicate economic event' },
    { value: 'CUSTOMER_SPECIFIC_EXCEPTION', label: 'Customer-specific policy exception' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleReject = () => {
    onConfirm(leak.id, reason, notes);
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
                isDark ? 'bg-slate-800 text-rose-400' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Why isn&apos;t this a leak?</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Feedback helps calibrate detection models
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

        <div className="space-y-3">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Rejection Reason
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className={`w-full p-2 text-xs rounded-lg border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-500'
              }`}
            >
              {rejectionOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Optional Feedback Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Provide context on why this is not considered billable revenue leakage..."
              className={`w-full p-2 text-xs rounded-lg border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-500'
              }`}
            />
          </div>
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
            onClick={handleReject}
            className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Reject Opportunity
          </button>
        </div>
      </div>
    </div>
  );
};
