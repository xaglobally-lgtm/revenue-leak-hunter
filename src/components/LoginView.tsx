import React, { useState } from 'react';
import { ShieldCheck, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface LoginViewProps {
  onBackToHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBackToHome }) => {
  const { theme } = useApp();
  const { signInWithEmail } = useAuth();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setError(null);
    const res = await signInWithEmail(email.trim());
    if (res.ok) {
      setStatus('sent');
    } else {
      setStatus('error');
      setError(res.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center px-4 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <div className="w-full max-w-sm">
        <button
          onClick={onBackToHome}
          className={`flex items-center gap-1.5 text-xs font-medium mb-6 cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Revenue Leak Hunter</span>
        </div>

        <h1 className="text-xl font-bold mb-1">Sign in to your account</h1>
        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          We'll email you a secure sign-in link — no password needed.
        </p>

        {status === 'sent' ? (
          <div
            className={`rounded-xl border p-4 flex items-start gap-3 ${
              isDark ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Check your inbox</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                We sent a sign-in link to <span className="font-medium">{email}</span>. Click it to finish signing
                in — this tab will pick it up automatically.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline mt-2 cursor-pointer"
              >
                Use a different email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="login-email" className="text-xs font-medium block mb-1.5">
                Work email
              </label>
              <div className="relative">
                <Mail
                  className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-emerald-500 placeholder:text-slate-600'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {status === 'error' && error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || !email.trim()}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                'Send sign-in link'
              )}
            </button>
          </form>
        )}

        <p className={`text-[11px] mt-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
