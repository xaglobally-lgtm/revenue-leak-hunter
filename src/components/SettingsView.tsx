import React, { useEffect, useState } from 'react';
import { Settings, Save, ShieldCheck, Bell, Users, FileText, Loader2 } from 'lucide-react';
import { rlhFetch } from '../lib/api.ts';

export const SettingsView: React.FC = () => {
  const [orgName, setOrgName] = useState('Acme Technologies Inc');
  const [currency, setCurrency] = useState('USD');
  const [financeEmail, setFinanceEmail] = useState('billing-alerts@acme.com');

  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [highValueAlerts, setHighValueAlerts] = useState(true);
  const [immediatePaymentAlerts, setImmediatePaymentAlerts] = useState(true);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await rlhFetch<{ data: { organization: { name?: string; settings?: Record<string, unknown> } } }>(
        '/api/v1/settings'
      );
      if (res.ok && res.data?.data?.organization) {
        const org = res.data.data.organization;
        const s = org.settings || {};
        if (org.name) setOrgName(org.name);
        if (s.baseCurrency) setCurrency(String(s.baseCurrency));
        if (s.financeEmail) setFinanceEmail(String(s.financeEmail));
        if (typeof s.weeklyDigest === 'boolean') setWeeklyDigest(s.weeklyDigest);
        if (typeof s.highValueAlerts === 'boolean') setHighValueAlerts(s.highValueAlerts);
        if (typeof s.immediatePaymentAlerts === 'boolean') setImmediatePaymentAlerts(s.immediatePaymentAlerts);
      }
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await rlhFetch('/api/v1/settings', {
      method: 'PATCH',
      body: JSON.stringify({
        name: orgName,
        settings: {
          baseCurrency: currency,
          financeEmail,
          weeklyDigest,
          highValueAlerts,
          immediatePaymentAlerts,
        },
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(res.status === 401 ? 'Session expired. Please sign in again.' : 'Could not save preferences. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Settings</h1>
        <p className="text-sm text-slate-500">
          Manage multi-tenant configuration, notification preferences, and commercial fee agreements.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Organization Profile</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Finance Alert Notification Email</label>
              <input
                type="email"
                value={financeEmail}
                onChange={e => setFinanceEmail(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">Intelligence Notifications</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={e => setWeeklyDigest(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="font-semibold text-slate-900">Weekly Executive Leak Digest</p>
                <p className="text-slate-500">Summary of new opportunities and incremental cash recovered sent Monday morning.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={highValueAlerts}
                onChange={e => setHighValueAlerts(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="font-semibold text-slate-900">High-Value Leak Alerts (≥ $5,000/yr)</p>
                <p className="text-slate-500">Immediate alert when high-confidence discrepancies exceed $5,000 annualized value.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={immediatePaymentAlerts}
                onChange={e => setImmediatePaymentAlerts(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <p className="font-semibold text-slate-900">Payment Failure Immediate Notification</p>
                <p className="text-slate-500">Notification when recurring payment attempts fail (PAY-001).</p>
              </div>
            </label>
          </div>
        </div>

        {/* Commercial Terms / Contract Card (Section 2) */}
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Commercial Terms Agreement</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Active Agreement
            </span>
          </div>

          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong>Contingency Model:</strong> Revenue Leak Hunter charges exactly 10% of verified attributable revenue recovered through opportunities identified by the system.
            </p>
            <p>
              <strong>Attribution Period:</strong> 12 months from the date the opportunity is verified and corrected in billing.
            </p>
            <p>
              <strong>No Monthly Retainers:</strong> Zero recurring software subscriptions or setup fees.
            </p>
          </div>
        </div>

        {/* Data Governance & Audit Export Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Data Governance &amp; Audit Tools</h3>
              <p className="text-xs text-slate-500 mt-0.5">Export immutable audit logs or reset environment state for demonstration testing</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="/api/v1/system/export-audit"
              download
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Export Audit Trail (JSON)</span>
            </a>

            <button
              type="button"
              onClick={async () => {
                if (window.confirm('Reset all tenant data to pristine demonstration baseline?')) {
                  await fetch('/api/v1/system/reset-demo', { method: 'POST' });
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Restore Pristine Demo Baseline</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-emerald-700 font-bold">Preferences saved successfully!</span>}
          {error && <span className="text-xs text-rose-700 font-bold">{error}</span>}
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
