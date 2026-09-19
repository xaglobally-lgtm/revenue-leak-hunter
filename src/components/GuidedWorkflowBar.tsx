import React from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { NavTab } from './Sidebar.tsx';
import { Leak, Recovery } from '../types.ts';

interface GuidedWorkflowBarProps {
  currentTab: NavTab;
  onNavigateTab: (tab: NavTab) => void;
  unverifiedLeaksCount: number;
  unrecordedRecoveriesCount: number;
  onInspectNextLeak?: () => void;
  onRecordNextPayment?: () => void;
}

export const GuidedWorkflowBar: React.FC<GuidedWorkflowBarProps> = ({
  currentTab,
  onNavigateTab,
  unverifiedLeaksCount,
  unrecordedRecoveriesCount,
  onInspectNextLeak,
  onRecordNextPayment,
}) => {
  const { t, theme, workflowStep } = useApp();
  const isDark = theme === 'dark';

  // Determine current active step in the recovery pipeline (1: Detect, 2: Verify, 3: Collect, 4: Ledger)
  const activeStep: number =
    workflowStep === 'verify'
      ? 2
      : workflowStep === 'collect'
      ? 3
      : workflowStep === 'ledger'
      ? 4
      : unverifiedLeaksCount > 0
      ? 2
      : unrecordedRecoveriesCount > 0
      ? 4
      : 1;

  return (
    <div
      className={`px-4 py-1.5 border-b flex items-center justify-between text-xs shrink-0 select-none ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Workflow Process Pills */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
        <span className={`text-[10px] uppercase font-bold tracking-wider hidden md:inline-block mr-1 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {t.guidedProcess}:
        </span>

        {/* Step 1: Detect */}
        <button
          onClick={() => onNavigateTab('opportunities')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeStep === 1
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 ring-2 ring-emerald-500/30 shadow-xs'
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Search className="w-3 h-3" />
          <span>{t.step1Detect}</span>
        </button>

        <span className="text-slate-400 text-[10px]">&rarr;</span>

        {/* Step 2: Verify Evidence */}
        <button
          onClick={() => {
            onNavigateTab('opportunities');
            if (onInspectNextLeak) onInspectNextLeak();
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeStep === 2
              ? 'bg-emerald-600 text-white font-semibold ring-2 ring-emerald-400 ring-offset-1 shadow-sm'
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>{t.step2Verify}</span>
          {unverifiedLeaksCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white text-emerald-800 font-bold">
              {unverifiedLeaksCount}
            </span>
          )}
        </button>

        <span className="text-slate-400 text-[10px]">&rarr;</span>

        {/* Step 3: Collect in Stripe */}
        <button
          onClick={() => onNavigateTab('integration')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeStep === 3
              ? 'bg-emerald-600 text-white font-semibold ring-2 ring-emerald-400 ring-offset-1 shadow-sm'
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3 h-3" />
          <span>{t.step3Collect}</span>
        </button>

        <span className="text-slate-400 text-[10px]">&rarr;</span>

        {/* Step 4: Record 10% Fee */}
        <button
          onClick={() => {
            onNavigateTab('recoveries');
            if (onRecordNextPayment) onRecordNextPayment();
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            activeStep === 4
              ? 'bg-emerald-600 text-white font-semibold ring-2 ring-emerald-400 ring-offset-1 shadow-sm'
              : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-3 h-3" />
          <span>{t.step4Ledger}</span>
        </button>
      </div>

      {/* Right Guided Action Beacon */}
      <div className="hidden lg:flex items-center gap-2">
        {activeStep === 2 ? (
          <button
            onClick={() => {
              onNavigateTab('opportunities');
              if (onInspectNextLeak) onInspectNextLeak();
            }}
            className="px-3 py-1 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_12px_rgba(52,211,153,0.4)] flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-400/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{t.nextTouchAction}: {t.inspectEvidence}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : activeStep === 4 ? (
          <button
            onClick={() => {
              onNavigateTab('recoveries');
              if (onRecordNextPayment) onRecordNextPayment();
            }}
            className="px-3 py-1 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_12px_rgba(52,211,153,0.4)] flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-400/40"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{t.nextTouchAction}: {t.recordPayment}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className={`text-[11px] font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.readOnlyGuarantee}</span>
          </span>
        )}
      </div>
    </div>
  );
};
