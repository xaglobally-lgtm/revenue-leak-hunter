import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  ShieldCheck,
  Calculator,
  FileText,
  Users,
  DollarSign,
  HelpCircle,
  Code2,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

type DocSection = 'benefits' | 'audience' | 'operations' | 'examples' | 'downloads';

export const DocumentationView: React.FC = () => {
  const { theme, t } = useApp();
  const [activeSection, setActiveSection] = useState<DocSection>('benefits');
  const [operationsStep, setOperationsStep] = useState<number>(1);

  const isDark = theme === 'dark';

  const handleDownloadDocx = () => {
    const link = document.createElement('a');
    link.href = '/Revenue-Leak-Hunter-Documentation.docx';
    link.download = 'Revenue-Leak-Hunter-Documentation.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadDoc = () => {
    fetch('/DOCUMENTATION.md')
      .then(res => res.text())
      .then(text => {
        const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Revenue-Leak-Hunter-Documentation.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        const blob = new Blob(['# Revenue Leak Hunter Documentation\n\nPlease check DOCUMENTATION.md in root directory.'], {
          type: 'text/markdown;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Revenue-Leak-Hunter-Documentation.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="h-full flex flex-col justify-between gap-2.5 p-1 select-none">
      {/* Top Documentation Header & Tab Switcher (Compact, Screen-Fitted) */}
      <div
        className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold tracking-tight">Documentation &amp; Operations Manual</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                Benefit-First Edition
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Recover 2% to 7% of ARR with 100% deterministic, zero-write financial audits.
            </p>
          </div>
        </div>

        {/* Action Downloads */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadDocx}
            className="px-2.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download formatted Microsoft Word document (.docx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Word (.DOCX)</span>
          </button>
          <button
            onClick={handleDownloadDoc}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Markdown (.MD)</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 py-0.5">
        <button
          onClick={() => setActiveSection('benefits')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'benefits'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
                ? 'bg-slate-850 text-slate-400 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Why Use This &amp; Benefits
        </button>

        <button
          onClick={() => setActiveSection('audience')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'audience'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
                ? 'bg-slate-850 text-slate-400 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Who Should Use It
        </button>

        <button
          onClick={() => setActiveSection('operations')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'operations'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
                ? 'bg-slate-850 text-slate-400 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Operations Manual &amp; Screenshots
        </button>

        <button
          onClick={() => setActiveSection('examples')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'examples'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
                ? 'bg-slate-850 text-slate-400 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          4. Real-Life Case Studies
        </button>

        <button
          onClick={() => setActiveSection('downloads')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'downloads'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
                ? 'bg-slate-850 text-slate-400 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          5. Artifacts &amp; Direct Bank Payout
        </button>
      </div>

      {/* Main Reading Container (Internal Scroll Only, Outer Viewport Never Scrolls) */}
      <div
        className={`flex-1 rounded-xl border p-4 sm:p-5 overflow-y-auto min-h-0 text-xs leading-relaxed ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
        }`}
      >
        {/* Section 1: Why Use This & Core Financial Benefits */}
        {activeSection === 'benefits' && (
          <div className="space-y-4 max-w-4xl">
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>The Immediate Financial Advantage: Recover $20k to $150k+ in 5 Minutes</span>
              </div>
              <p>
                Modern SaaS companies silently lose between <strong>2% to 7% of their Annual Recurring Revenue (ARR)</strong> every single month. These are not churned customers—these are active, happy customers who simply were not billed correctly due to human oversights, expired promotional coupons that never turned off, unmonitored provisioned seats, or failed credit card dunning retries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-bold text-sm text-emerald-500 mb-1">100% Risk Free</div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Pure contingency fee (10%). If RLH finds $0 in unbilled leaks, you pay exactly $0. You keep 90% of all recovered cash.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-bold text-sm text-emerald-500 mb-1">Zero Disruption</div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  100% read-only restricted Stripe API key (`rk_live_...`). No write permissions. Customers continue paying via your standard Stripe checkout.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-bold text-sm text-emerald-500 mb-1">Mathematical Precision</div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  No fuzzy probabilistic guesses. Every leak is grounded in deterministic audit trails comparing Stripe invoice lines directly against actual provisioned user seat logs.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold">What the App Does</h3>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                Revenue Leak Hunter runs 5 deterministic detector engines across your recurring billing data:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400">
                <li><strong>BILL-001 (Subscription Seat Discrepancy)</strong>: Flags when provisioned seats in Okta or your user database exceed the billed Stripe quantity.</li>
                <li><strong>PAY-001 (Failed Dunning Recovery)</strong>: Detects overdue card charge failures where automated retry windows expired without customer cancellation.</li>
                <li><strong>PRICE-001 (Expired Promotional Discounts)</strong>: Identifies temporary promotional discounts (e.g. 20% launch discount) that continued deducting after the agreed expiration date.</li>
                <li><strong>INV-001 (Missing Invoice Cadence)</strong>: Flags active customers whose monthly or annual billing cycle has lapsed past grace periods without an invoice being generated.</li>
                <li><strong>USAGE-001 (Unbilled Metered Usage)</strong>: Reconciles high-volume API calls, storage gigabytes, or compute hours against invoiced meter counts.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Section 2: Who Should Use It */}
        {activeSection === 'audience' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-sm font-bold">Target Operators &amp; Executive Stakeholders</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <Users className="w-5 h-5 text-emerald-500 mb-2" />
                <h4 className="font-bold text-xs uppercase tracking-wider mb-1">Chief Financial Officers (CFOs)</h4>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Gain immediate bottom-line ARR expansion without increasing customer acquisition costs (CAC). Get auditable CSV statements for monthly financial close.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <Calculator className="w-5 h-5 text-emerald-500 mb-2" />
                <h4 className="font-bold text-xs uppercase tracking-wider mb-1">Revenue Operations (RevOps)</h4>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Replace manual monthly spreadsheet reconciliation with an automated daily sweep. Receive real-time webhook alerts in Slack or Teams when unbilled gaps occur.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <Code2 className="w-5 h-5 text-emerald-500 mb-2" />
                <h4 className="font-bold text-xs uppercase tracking-wider mb-1">Billing &amp; Platform Engineers</h4>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Verify that metered usage counters, webhook listeners, and subscription synchronization services are functioning accurately with synthetic end-to-end test suites.
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border mt-3 ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-xs mb-1">When Should You Run It?</h4>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                Run Revenue Leak Hunter immediately upon deployment to execute your initial baseline scan. Subsequently, leave live webhooks enabled to continuously audit incoming Stripe lifecycle events (`invoice.payment_failed`, `customer.subscription.updated`, etc.) in real time.
              </p>
            </div>
          </div>
        )}

        {/* Section 3: Operations Manual with Screenshot Diagrams */}
        {activeSection === 'operations' && (
          <div className="space-y-4 max-w-4xl">
            <div>
              <h3 className="text-sm font-bold mb-1">Operations Manual: The 4-Step Recovery Loop</h3>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Follow the guided process from detection to cash collection. Click any step below to inspect the visual walkthrough.
              </p>
            </div>

            {/* Step Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: '1. Detect', desc: 'Scan & Flag Leak' },
                { step: 2, title: '2. Verify', desc: 'Audit Mathematical Evidence' },
                { step: 3, title: '3. Collect', desc: 'Update Subscription in Stripe' },
                { step: 4, title: '4. Ledger', desc: 'Record Direct Payout & 10% Fee' },
              ].map(s => (
                <button
                  key={s.step}
                  onClick={() => setOperationsStep(s.step)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    operationsStep === s.step
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500'
                      : isDark ? 'bg-slate-850 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs">{s.title}</div>
                  <div className="text-[10px] truncate">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* Interactive Visual Screenshot Mockup Container */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b pb-2 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-emerald-500" />
                  <span>UI Screen Representation &bull; Step {operationsStep}</span>
                </span>
                <span className="text-emerald-500 font-bold">100% Deterministic Engine</span>
              </div>

              {operationsStep === 1 && (
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-500 mb-1">
                      <span>[BILL-001] Acme Technologies &bull; 6 Unbilled Active Seats</span>
                      <span>+$14,400.00 / yr</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Invoiced Quantity: 25 seats @ $200.00/mo &bull; Observed Telemetry: 31 active logins. Discrepancy: 6 unbilled seats ($1,200.00/mo).
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    <strong>How to operate:</strong> Open the <strong>Opportunities</strong> tab. Any detected discrepancy will be prominently highlighted with confidence ratings (&gt;90%) and financial impact.
                  </p>
                </div>
              )}

              {operationsStep === 2 && (
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-blue-200 dark:border-blue-900/60 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-500 mb-1">
                      <span>Verification Modal &bull; Confirm Attribution Window</span>
                      <span>365-Day Window</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      <div>&bull; Monthly Leak Loss: <strong>$1,200.00</strong></div>
                      <div>&bull; Annualized Recovery: <strong>$14,400.00</strong></div>
                      <div>&bull; Attributable Action: <strong>Verify &amp; lock baseline timestamp</strong></div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    <strong>How to operate:</strong> Click <strong>&quot;Verify Discrepancy&quot;</strong>. This creates an immutable audit record and moves the finding to the Verified status, establishing the legal attribution baseline.
                  </p>
                </div>
              )}

              {operationsStep === 3 && (
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      <span>Stripe Dashboard Correction &bull; Direct Merchant Payout</span>
                      <span>Customer Invoiced</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Open customer in Stripe ➔ Adjust subscription quantity from 25 to 31 seats ➔ Stripe issues updated invoice directly to Acme Technologies ➔ Customer pays via ACH/Card.
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    <strong>Important:</strong> The money is deposited <strong>directly from Stripe into your business bank account</strong>. RLH does not hold or touch your customer funds!
                  </p>
                </div>
              )}

              {operationsStep === 4 && (
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      <span>Recoveries Ledger &bull; 10% Performance Fee Calculation</span>
                      <span>Cash In Bank: $1,200.00</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div>&bull; Gross Customer Payment: <strong>$1,200.00</strong></div>
                      <div>&bull; RLH 10% Performance Fee: <strong>$120.00</strong></div>
                      <div>&bull; Net Cash Retained by You: <strong>$1,080.00 (90%)</strong></div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    <strong>How to operate:</strong> In the <strong>Recoveries</strong> tab, click <strong>&quot;Record Payment&quot;</strong>. Enter the Stripe Invoice ID (`in_...`) and payment amount to generate your monthly contingency reconciliation statement.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 4: Real-Life Case Studies */}
        {activeSection === 'examples' && (
          <div className="space-y-4 max-w-4xl">
            <h3 className="text-sm font-bold">Real-World Leak Scenarios &amp; Recovery Outcomes</h3>

            <div className="space-y-3">
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                  <span>Case 1: Acme Technologies &bull; Unbilled User Seats ($14,400/yr)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-[10px]">BILL-001</span>
                </div>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  <strong>What happened:</strong> Acme subscribed to the Enterprise Tier for 25 seats at $200/seat/month. Over 6 months, their team added 6 new engineers in Okta. The customer was actively utilizing 31 seats, but their recurring Stripe subscription was never incremented from 25.<br />
                  <strong>Recovery:</strong> RLH flagged the 6-seat discrepancy. RevOps updated the subscription in Stripe. Acme paid the revised monthly invoice ($6,200 vs $5,000), immediately recovering <strong>$1,200/month in net new recurring cash</strong>.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                  <span>Case 2: Stark Industries &bull; Failed Payment Past Dunning ($24,000/yr)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-[10px]">PAY-001</span>
                </div>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  <strong>What happened:</strong> Stark’s corporate card expired. Stripe’s automated dunning retries attempted 4 charges over 14 days and gave up. The subscription status remained &quot;past_due&quot; while Stark engineers continued using the software.<br />
                  <strong>Recovery:</strong> RLH detected the uncollected $2,000 charge. RevOps contacted Stark’s AP department with the audit invoice. Stark updated their billing details, collecting <strong>$2,000 in immediate overdue cash</strong> and saving the $24,000/yr account from silent churn.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                  <span>Case 3: Wayne Enterprises &bull; Expired Promotional Discount ($2,400/yr)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-[10px]">PRICE-001</span>
                </div>
                <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  <strong>What happened:</strong> Wayne received a temporary 20% discount coupon during onboarding for 3 months. When the 3 months ended, the discount rule was not automatically detached, causing the account to be underbilled by $200/month indefinitely.<br />
                  <strong>Recovery:</strong> RLH identified that the discount duration had lapsed 60 days prior. RevOps adjusted the coupon rule, restoring the contract to full list price and capturing <strong>$2,400/yr in recurring revenue</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Artifacts & Direct Bank Payout Clarification */}
        {activeSection === 'downloads' && (
          <div className="space-y-4 max-w-4xl">
            <div
              className={`p-4 rounded-xl border ${
                isDark ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
                <span>How Cash Enters Your Bank Account (Direct Payout Flow)</span>
              </div>
              <p>
                <strong>Revenue Leak Hunter never routes, holds, or mediates customer money.</strong> When you correct a subscription, Stripe charges your customer directly. Stripe deposits the funds into your company bank account through your normal automated payout schedule (e.g. 2-day rolling ACH).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold text-xs">Official Documentation Files</h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Download complete formatted guides to share with your executive finance committee or board.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleDownloadDocx}
                    className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Word Doc (.DOCX)</span>
                  </button>

                  <button
                    onClick={handleDownloadDoc}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Markdown Handbook (.MD)</span>
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold text-xs">Compliance &amp; Immutable Audit Trail</h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Export structured JSON records detailing every detector trigger, verification timestamp, and financial attribution record.
                </p>
                <a
                  href="/api/v1/system/export-audit"
                  download
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Download Audit Trail (JSON)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
