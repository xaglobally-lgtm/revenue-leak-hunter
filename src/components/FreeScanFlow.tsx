import React, { useState, useEffect, useRef } from 'react';
import { rlhFetch } from '../lib/api.ts';
import { RLH_FEE_PERCENT } from '../lib/fee.ts';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Lock, Loader2, Sparkles, Building2, Mail, User, DollarSign } from 'lucide-react';

interface FreeScanFlowProps {
  onCompleteScan: () => void;
  onBackToHome: () => void;
}

export const FreeScanFlow: React.FC<FreeScanFlowProps> = ({ onCompleteScan, onBackToHome }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form fields
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@acme.com');
  const [company, setCompany] = useState('Acme Technologies Inc');
  const [companySize, setCompanySize] = useState('51-200 employees');
  const [revenue, setRevenue] = useState('$10M - $25M');

  // Step 3 animation stages
  const scanStages = [
    'Connecting securely to billing API...',
    'Importing customers and normalized subscriptions...',
    'Analyzing billing intervals and price structures...',
    'Checking invoice lines against seat quantities (BILL-001)...',
    'Checking failed and uncaptured payments (PAY-001)...',
    'Checking expired discounts and promotional coupons (PRICE-001)...',
    'Looking for missing invoice cadence (INV-001)...',
    'Calculating deterministic potential recovery and confidence scores...',
  ];
  interface FreeScanFinding {
  detectorId: string;
  title: string;
  potentialAmount: string;
  confidence: string;
  summary: string;
}

interface FreeScanResult {
  company: string;
  totalPotentialRecovery: string;
  findingsCount: number;
  topFindings: FreeScanFinding[];
}

const [scanResult, setScanResult] = useState<FreeScanResult | null>(null);
const [scanError, setScanError] = useState(false);
const scanStartedRef = useRef(false);

const runScan = async () => {
  setScanError(false);
  try {
    const res = await rlhFetch<{ data: FreeScanResult }>('/api/v1/scan', {
      method: 'POST',
      body: JSON.stringify({ company, workEmail: email, companySize, annualRevenue: revenue }),
    });
    if (res.ok && res.data?.data) {
      setScanResult(res.data.data);
    } else {
      setScanError(true);
    }
  } catch {
    setScanError(true);
  }
};

const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (step === 3) {
      if (!scanStartedRef.current) {
        scanStartedRef.current = true;
        runScan();
      }
      const interval = setInterval(() => {
        setCurrentStageIdx(prev => {
          if (prev < scanStages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => setStep(4), 800);
            return prev;
          }
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Scan</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Free Revenue Scan</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Step {step} of 4
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-xl mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Let&apos;s find your leaks.</h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Enter your organization details so we can tailor the billing scan to your revenue operations.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Size</label>
                  <select
                    value={companySize}
                    onChange={e => setCompanySize(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Approx. Annual Revenue</label>
                  <select
                    value={revenue}
                    onChange={e => setRevenue(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option>&lt; $1M</option>
                    <option>$1M - $5M</option>
                    <option>$5M - $10M</option>
                    <option>$10M - $25M</option>
                    <option>$25M+</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Connect your billing system.</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              We connect via standard OAuth to analyze historical subscriptions, prices, discounts, and payments.
            </p>

            <div className="my-6 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-left flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-emerald-900">Read-only financial analysis</p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  We use read-only access to analyze your billing data. We will never modify customer subscriptions or charge customers.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Connect Stripe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-5" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Scanning your billing data...</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">Running deterministic audit routines against normalized records</p>

            <div className="p-4 bg-slate-900 rounded-xl text-left font-mono text-xs text-slate-300 space-y-2 max-h-56 overflow-y-auto">
              {scanStages.slice(0, currentStageIdx + 1).map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className={idx === currentStageIdx ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center animate-in fade-in zoom-in-95 duration-300">
            {scanError ? (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Scan Interrupted</span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">We could not complete the scan.</h2>
                <p className="text-xs text-slate-500 mt-1">Check your connection and try again.</p>
                <button
                  onClick={runScan}
                  className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Retry Scan
                </button>
              </div>
            ) : !scanResult ? (
              <div className="py-10">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-700 mt-4">Preparing your results...</p>
              </div>
            ) : (
              <>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Scan Complete</span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">We found potential revenue recovery.</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Deterministic opportunities identified from your normalized billing records.
                </p>

                <div className="my-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-4xl sm:text-5xl font-extrabold text-emerald-900 tracking-tight">
                    ${Number(parseFloat(scanResult.totalPotentialRecovery).toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    <span className="text-xl text-emerald-700 font-medium">/year</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mt-1">Potential Recovery</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Calculated across {scanResult.findingsCount} high-confidence findings
                  </p>
                </div>

                <div className="text-left space-y-2.5 mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Findings</p>
                  {scanResult.topFindings.map(f => (
                    <div
                      key={f.detectorId}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div className="text-left min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{f.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{f.summary}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900">
                          ${Number(parseFloat(f.potentialAmount).toFixed(2)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="ml-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {Math.round(parseFloat(f.confidence) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onCompleteScan}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>See My Full Results in Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
        Revenue Leak Hunter &bull; 100% Deterministic Financial Calculations &bull; {RLH_FEE_PERCENT}% Recovery Model
      </footer>
    </div>
  );
};
