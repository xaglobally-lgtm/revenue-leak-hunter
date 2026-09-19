import React from 'react';
import { ShieldCheck, Search, FileText, ArrowRight, CheckCircle2, TrendingUp, Sparkles, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

interface PublicLandingProps {
  onStartFreeScan: () => void;
  onEnterApp: () => void;
}

const faqs: { q: string; a: string }[] = [
  {
    q: 'How does the 10% fee actually work?',
    a: 'There is no subscription and no setup fee. You only pay 10% of revenue that is actually received into your bank account because of an opportunity we identified — measured over 12 months after verification. No recovery, no fee. You keep 90%.',
  },
  {
    q: 'Do you need write access to my Stripe account?',
    a: 'No. We connect with strictly read-only credentials. Your team makes every correction inside your own billing dashboard. We only watch, measure, and prove.',
  },
  {
    q: 'What kinds of leaks does the scanner find?',
    a: 'Five detector families: failed recurring payments (PAY-001), subscription seat/quantity discrepancies (BILL-001), expired discounts still being applied (PRICE-001), missing invoice cadence (INV-001), and unbilled metered usage (USAGE-001).',
  },
  {
    q: 'How fast will I see results?',
    a: 'The free scan completes in about 60 seconds and returns your top findings with confidence scores. A full connected audit can be examined the same day, and verified recoveries begin as soon as your team applies the recommended fix.',
  },
];

export const PublicLanding: React.FC<PublicLandingProps> = ({ onStartFreeScan, onEnterApp }) => {
  const { setIsAboutOpen, setLegalDoc } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              RLH
            </div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight">Revenue Leak Hunter</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign In / App
            </button>
            <button
              onClick={onStartFreeScan}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              Run My Free Revenue Scan
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Continuous Revenue Operations Intelligence</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight">
          Find the revenue <br className="hidden sm:inline" />
          <span className="text-emerald-600">you&apos;re losing.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Revenue Leak Hunter continuously finds billing, payment, pricing, and usage discrepancies hiding inside your revenue operations.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartFreeScan}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
          >
            <span>Run My Free Revenue Scan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Enter Live Product Dashboard
          </button>
        </div>
      </section>

      {/* Trust Section (Section 2) */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">The Three Commitments</h2>
            <p className="text-sm text-slate-500 mt-2">Deterministic financial proof over generic AI estimations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Find</h3>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Identify Potential Leaks</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Scan billing data, customer subscriptions, pricing plans, expired promotions, and metered usage for hidden disconnects.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Prove</h3>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Evidence & Calculation</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                See exact source records, deterministic seat count comparisons, unit prices, and reproducible calculation formulas for every finding.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Recover</h3>
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">Attributable Cash Collected</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track incremental recovery payments as they hit your Stripe account with an immutable attribution timeline and recovery ledger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Positioning (Section 2) */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Zero Subscription Fee</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            You only pay when we recover money.
          </h2>
          <p className="mt-4 text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
            Revenue Leak Hunter charges 10% of verified attributable revenue recovered through opportunities we identify.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No monthly software fee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Read-only Stripe connection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Transparent fee ledger</span>
            </div>
          </div>
          <button
            onClick={onStartFreeScan}
            className="mt-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            Start 60-Second Free Scan
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Questions Buyers Ask</h2>
          <p className="text-sm text-slate-500 mt-2">Straight answers about how we get paid and what we touch.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group p-5 rounded-2xl bg-white border border-slate-200 open:border-emerald-200 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-slate-900">
                <span>{f.q}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 py-8 bg-white text-center text-xs text-slate-400">
        <p>Revenue Leak Hunter &copy; {new Date().getFullYear()}. Financial intelligence system for high-growth SaaS.</p>
        <div className="mt-3 flex items-center justify-center gap-4">
          <button onClick={() => setLegalDoc('privacy')} className="hover:text-emerald-600 transition-colors cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => setLegalDoc('terms')} className="hover:text-emerald-600 transition-colors cursor-pointer">
            Terms of Service
          </button>
          <button onClick={() => setIsAboutOpen(true)} className="hover:text-emerald-600 transition-colors cursor-pointer">
            About &amp; Contact
          </button>
        </div>
      </footer>
    </div>
  );
};
