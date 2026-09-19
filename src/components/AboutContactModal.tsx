import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  Lock,
  Globe2,
  Award,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const AboutContactModal: React.FC = () => {
  const { isAboutOpen, setIsAboutOpen, t, theme, setLegalDoc } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  if (!isAboutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(false);
    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        setSubmitError(true);
        return;
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setMessage('');
        setIsAboutOpen(false);
      }, 2200);
    } catch {
      setSubmitError(true);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
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
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
              RLH
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Revenue Leak Hunter</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Automated Revenue Leak Detection &amp; Contingency Recovery
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAboutOpen(false)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Content (only inner modal scrolls if screen is very small) */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Executive Overview */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-500">
              <Sparkles className="w-4 h-4" />
              <span>Why We Built Revenue Leak Hunter</span>
            </div>
            <p className="leading-relaxed">
              Every B2B SaaS company loses between <strong>2% to 7% of ARR</strong> to silent billing gaps: active
              employees exceeding billed seat counts, expired discount codes continuing indefinitely, failed card renewals past dunning cycles, and unmetered API calls. Revenue Leak Hunter replaces manual spreadsheets with <strong>deterministic financial logic</strong>, requiring zero write permissions to your Stripe infrastructure.
            </p>
          </div>

          {/* Guarantees & Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1.5" />
              <p className="font-bold">100% Read-Only</p>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Zero write/charge scope. You make all adjustments directly inside your Stripe dashboard.
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <Award className="w-4 h-4 text-emerald-500 mb-1.5" />
              <p className="font-bold">Pure Contingency</p>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                10% fee only after customer payment clears into your bank account. You retain 90% net cash.
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <Lock className="w-4 h-4 text-emerald-500 mb-1.5" />
              <p className="font-bold">SOC-2 Type II</p>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Complete tenant isolation, mathematical audit logging, and encrypted webhook deduplication.
              </p>
            </div>
          </div>

          {/* Contact Details & Direct Inquiry Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Direct Contact Info */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-bold text-sm">Direct RevOps Support</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Inquiries &amp; Audits</p>
                    <a href="mailto:revops@revenueleakhunter.io" className="font-semibold text-emerald-600 hover:underline">
                      revops@revenueleakhunter.io
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Executive Hotline</p>
                    <p className="font-semibold">+1 (888) 492-LEAK (5325)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>SLA Response Time</p>
                    <p className="font-semibold">Sub-2 hour guaranteed response for high-priority findings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-850 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="font-bold text-sm mb-2">Send Message to RevOps</h3>
              {submitted ? (
                <div className="h-40 flex flex-col items-center justify-center text-center space-y-2 text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                  <p className="font-bold">Message Dispatched</p>
                  <p className="text-[11px] text-slate-500">Our senior billing engineers will review within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {submitError && (
                    <p className="text-[11px] font-medium text-rose-500">
                      Could not dispatch your message. Please try again or email revops@revenueleakhunter.io directly.
                    </p>
                  )}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Work Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      rows={2}
                      placeholder="Billing question or custom detector request..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to Engineering Team</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-3 border-t flex items-center justify-between text-[11px] shrink-0 ${
            isDark ? 'border-slate-800 bg-slate-950/50 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
          }`}
        >
          <span>RLH v2.4.0 &bull; Multi-Tenant Isolated &bull; SHA-256 Verified</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsAboutOpen(false);
                setLegalDoc('privacy');
              }}
              className="font-medium text-emerald-600 hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                setIsAboutOpen(false);
                setLegalDoc('terms');
              }}
              className="font-medium text-emerald-600 hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setIsAboutOpen(false)}
              className="font-medium text-emerald-600 hover:underline cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
