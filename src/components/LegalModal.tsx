import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const LegalModal: React.FC = () => {
  const { legalDoc, setLegalDoc, theme } = useApp();
  const isDark = theme === 'dark';

  if (!legalDoc) return null;

  const close = () => setLegalDoc(null);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {legalDoc === 'privacy' ? <ShieldCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {legalDoc === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Revenue Leak Hunter &bull; Effective {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs leading-relaxed">
          {legalDoc === 'privacy' ? (
            <>
              <section>
                <h3 className="font-bold text-sm mb-1.5">1. What We Collect</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Revenue Leak Hunter connects to your billing provider (e.g. Stripe) using read-only credentials. We
                  analyze customer records, subscriptions, invoices, prices, discounts, and usage records solely to
                  detect revenue leaks. We do not ask for, request, or store cardholder full payment details, security
                  codes, or bank account credentials.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">2. How We Use Data</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Your billing data is used exclusively to compute deterministic leak findings, evidence, measurable
                  recovery amounts, and fee attribution statements. Data is never sold and never used to train any model.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">3. Tenant Isolation &amp; Security</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Every organization operates inside a fully isolated tenant. All API requests are scoped by your
                  organization id. All actions are recorded in an immutable, timestamped audit log. Webhooks are
                  idempotent and deduplicated to prevent double processing.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">4. Data Retention &amp; Deletion</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Findings and ledger records are retained for as long as your organization maintains an active recovery
                  agreement. On cancellation, you may request full deletion of your tenant data at any time by writing to
                  revops@revenueleakhunter.io.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">5. Contact</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Privacy questions: revops@revenueleakhunter.io. We respond within 2 business days.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="font-bold text-sm mb-1.5">1. Service Description</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Revenue Leak Hunter is a financial intelligence service that detects billing, payment, pricing, and
                  usage revenue leaks in your revenue operations and attributes recovered cash to your organization.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">2. Read-Only Access Guarantee</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  We connect with read-only permission. We never charge customers, edit subscriptions, void invoices, or
                  modify any financial record on your behalf. All corrections are performed by your team inside your own
                  billing dashboard.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">3. Contingency Fee Terms (Important)</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  There is no setup fee and no recurring software subscription. You pay Revenue Leak Hunter exactly{' '}
                  <strong>10% of attributable revenue actually received</strong> through opportunities we identified,
                  measured over the 12-month attribution window following verification. No recovery, no fee. You retain
                  90% of every recovered dollar.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">4. Attribution &amp; Invoicing</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Every fee is traceable to a specific verified opportunity and recorded payment. Revenue Leak Hunter
                  invoices the 10% fee monthly against the transparent attribution ledger shown inside the product. You
                  may dispute any entry within 30 days.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">5. Termination</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Either party may terminate this agreement with 30 days written notice. Fees earned for recoveries
                  received before termination remain payable.
                </p>
              </section>
              <section>
                <h3 className="font-bold text-sm mb-1.5">6. Contact</h3>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Questions about these terms: revops@revenueleakhunter.io.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};