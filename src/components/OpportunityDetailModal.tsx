import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { Leak, LeakStatus } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { StatusBadge } from './OpportunitiesView.tsx';

interface OpportunityDetailModalProps {
  leak: Leak;
  onClose: () => void;
  onOpenVerify: (leak: Leak) => void;
  onOpenReject: (leak: Leak) => void;
  onSuppress: (leak: Leak) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  leak,
  onClose,
  onOpenVerify,
  onOpenReject,
  onSuppress,
}) => {
  const { theme, formatMoney, t } = useApp();
  const isDark = theme === 'dark';
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});

  const toggleEvidence = (id: string) => {
    setExpandedEvidence(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const conf = Math.round(parseFloat(leak.confidence) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`rounded-2xl max-w-3xl w-full border shadow-2xl overflow-hidden my-6 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Bar */}
        <div
          className={`p-5 border-b flex items-start justify-between ${
            isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {leak.detectorId}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  conf >= 95
                    ? isDark
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-emerald-100 text-emerald-800'
                    : conf >= 80
                    ? isDark
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : 'bg-blue-100 text-blue-800'
                    : isDark
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {conf}% confidence
              </span>
              <StatusBadge status={leak.status} />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Potential {formatMoney(leak.estimatedAnnualLoss)}/year recovery
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Customer:{' '}
              <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {leak.customer?.name}
              </span>{' '}
              &bull; Detected on {new Date(leak.detectedAt).toLocaleDateString()}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Section 1: Why we found this */}
          <div className="space-y-1.5">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Why we found this
            </h3>
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                isDark ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {leak.summary}
            </div>
          </div>

          {/* Section 2: Financial calculation (Deterministic) */}
          <div className="space-y-1.5">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Financial Calculation
            </h3>
            <div
              className={`border rounded-xl overflow-hidden text-xs ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <table className="w-full text-left">
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {leak.evidenceSummary && (
                    <>
                      {leak.evidenceSummary.observedSeats !== undefined && (
                        <tr className={isDark ? 'bg-slate-800/30' : 'bg-slate-50/50'}>
                          <td className={`py-2 px-3.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Observed Active Seats
                          </td>
                          <td className="py-2 px-3.5 text-right font-mono font-bold">
                            {String(leak.evidenceSummary.observedSeats)}
                          </td>
                        </tr>
                      )}
                      {leak.evidenceSummary.billedSeats !== undefined && (
                        <tr>
                          <td className={`py-2 px-3.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Billed Seats in Latest Invoice
                          </td>
                          <td className="py-2 px-3.5 text-right font-mono font-bold">
                            {String(leak.evidenceSummary.billedSeats)}
                          </td>
                        </tr>
                      )}
                      {leak.evidenceSummary.difference !== undefined && (
                        <tr className={isDark ? 'bg-amber-950/30 text-amber-300' : 'bg-amber-50/60 text-amber-900'}>
                          <td className="py-2 px-3.5 font-semibold">Unbilled Seat Difference</td>
                          <td className="py-2 px-3.5 text-right font-mono font-bold">
                            +{String(leak.evidenceSummary.difference)} seats
                          </td>
                        </tr>
                      )}
                      {leak.evidenceSummary.pricePerUnit !== undefined && (
                        <tr>
                          <td className={`py-2 px-3.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Contracted Price per Seat
                          </td>
                          <td className="py-2 px-3.5 text-right font-mono font-bold">
                            {formatMoney(String(leak.evidenceSummary.pricePerUnit))}/mo
                          </td>
                        </tr>
                      )}
                      {leak.evidenceSummary.recordedUsage !== undefined && (
                        <tr className={isDark ? 'bg-slate-800/30' : 'bg-slate-50/50'}>
                          <td className={`py-2 px-3.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Recorded Metered Units
                          </td>
                          <td className="py-2 px-3.5 text-right font-mono font-bold">
                            {Number(leak.evidenceSummary.recordedUsage).toLocaleString()}
                          </td>
                        </tr>
                      )}
                      {leak.evidenceSummary.billedUsage !== undefined && (
                        <tr>
                          <td className={`py-2 px-3.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Invoiced Metered Units
                          </td>
                          <td className="py-2 px-3.5 text-right font-mono font-bold">
                            {Number(leak.evidenceSummary.billedUsage).toLocaleString()}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                  <tr className={isDark ? 'bg-emerald-950/30 border-t border-slate-800' : 'bg-emerald-50/40 border-t-2 border-slate-200'}>
                    <td className="py-2 px-3.5 font-bold">Potential Monthly Recovery</td>
                    <td className={`py-2 px-3.5 text-right font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                      {formatMoney(leak.estimatedMonthlyLoss)}/mo
                    </td>
                  </tr>
                  <tr className={isDark ? 'bg-emerald-950/50' : 'bg-emerald-50'}>
                    <td className={`py-2.5 px-3.5 font-extrabold text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-950'}`}>
                      Potential Annualized Recovery
                    </td>
                    <td className={`py-2.5 px-3.5 text-right font-mono font-extrabold text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-950'}`}>
                      {formatMoney(leak.estimatedAnnualLoss)}/yr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Evidence (Why we believe this) */}
          <div className="space-y-1.5">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Source Verification Records
            </h3>
            <div className="space-y-2">
              {leak.evidence && leak.evidence.length > 0 ? (
                leak.evidence.map(ev => {
                  const isExpanded = expandedEvidence[ev.id];
                  return (
                    <div
                      key={ev.id}
                      className={`border rounded-xl overflow-hidden text-xs ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleEvidence(ev.id)}
                        className={`w-full p-2.5 flex items-center justify-between text-left transition-colors ${
                          isDark ? 'bg-slate-800/60 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{ev.source} Record</span>
                          <span className={`font-mono text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            ID: {ev.sourceRecordId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="text-[10px]">Field: {ev.field}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className={`p-3 border-t space-y-2 font-mono text-[10px] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                          <div>
                            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Observed Value:</span>
                            <pre className="mt-1 p-2 bg-slate-950 text-emerald-400 rounded overflow-x-auto border border-slate-800">
                              {JSON.stringify(ev.observedValue, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Expected Value:</span>
                            <pre className="mt-1 p-2 bg-slate-950 text-blue-400 rounded overflow-x-auto border border-slate-800">
                              {JSON.stringify(ev.expectedValue, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className={`p-3 text-xs italic rounded-lg ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                  Source records logged at timestamp {leak.detectedAt}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Recommended action */}
          {leak.recommendations && leak.recommendations[0] && (
            <div className="space-y-1.5">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Recommended Action
              </h3>
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  isDark
                    ? 'bg-blue-950/40 border-blue-900 text-blue-300'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                <p className="font-bold">{leak.recommendations[0].title}</p>
                <p className={`leading-relaxed ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                  {leak.recommendations[0].description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenReject(leak)}
              disabled={leak.status === LeakStatus.REJECTED}
              className={`w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Not a Leak</span>
            </button>

            <button
              onClick={() => onSuppress(leak)}
              className={`w-full sm:w-auto px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Add rule exclusion to ignore this pattern"
            >
              Suppress Rule
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Close
            </button>
            <button
              onClick={() => onOpenVerify(leak)}
              disabled={leak.status === LeakStatus.VERIFIED || leak.status === LeakStatus.RECOVERING}
              className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{leak.status === LeakStatus.VERIFIED ? 'Verified' : 'Verify Opportunity'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
