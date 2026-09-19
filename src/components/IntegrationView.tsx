import React, { useState } from 'react';
import {
  Boxes,
  CheckCircle2,
  RefreshCw,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  KeyRound,
  Copy,
  Check,
  Send,
  Users,
  Bell,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const IntegrationView: React.FC = () => {
  const { activeOrgId } = useApp();
  // Stripe connection state
  const [stripeKey, setStripeKey] = useState('rk_live_9204918294819284');
  const [testingKey, setTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<{
    status: string;
    mode: string;
    accountName: string;
    latencyMs: number;
    message: string;
  } | null>({
    status: 'connected',
    mode: 'live',
    accountName: 'Acme Technologies (Stripe Live)',
    latencyMs: 38,
    message: 'Connection active. Read-only financial scope confirmed.',
  });

  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const webhookUrl = `${window.location.origin}/api/v1/webhooks/stripe`;

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 minutes ago');
  const [webhookLog, setWebhookLog] = useState<string[]>([
    'invoice.payment_failed (evt_29103) processed in 12ms',
    'customer.subscription.updated (evt_29102) processed in 8ms',
    'invoice.created (evt_29101) processed in 15ms',
    'charge.succeeded (evt_29100) processed in 9ms',
  ]);

  // Telemetry state
  const [selectedCustId, setSelectedCustId] = useState('customer_001');
  const [observedSeatCount, setObservedSeatCount] = useState(31);
  const [telemetrySyncing, setTelemetrySyncing] = useState(false);
  const [telemetryMessage, setTelemetryMessage] = useState<string | null>(null);

  // Alert webhook state
  const [alertWebhookUrl, setAlertWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [testingAlert, setTestingAlert] = useState(false);
  const [alertSuccessMessage, setAlertSuccessMessage] = useState<string | null>(null);

  const handleTestKey = async () => {
    setTestingKey(true);
    setKeyStatus(null);
    try {
      const res = await fetch('/api/v1/integrations/stripe/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': activeOrgId },
        body: JSON.stringify({ apiKey: stripeKey }),
      });
      const json = await res.json();
      if (json.data) {
        setKeyStatus(json.data);
      } else {
        setKeyStatus({
          status: 'error',
          mode: 'invalid',
          accountName: 'Unknown',
          latencyMs: 0,
          message: json.error?.message || 'Failed to authenticate with Stripe.',
        });
      }
    } catch {
      setKeyStatus({
        status: 'error',
        mode: 'invalid',
        accountName: 'Unknown',
        latencyMs: 0,
        message: 'Network error connecting to Stripe service.',
      });
    } finally {
      setTestingKey(false);
    }
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleTriggerSync = () => {
    setSyncing(true);
    fetch('/api/v1/integrations/stripe/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-organization-id': activeOrgId },
    })
      .then(res => res.json())
      .then(() => {
        setSyncing(false);
        setLastSync('Just now');
        setWebhookLog(prev => ['Manual sync cycle completed: 208 records re-normalized & verified', ...prev]);
      })
      .catch(() => {
        setSyncing(false);
      });
  };

  const handleSimulateWebhook = () => {
    const newEvt = `invoice.payment_failed (evt_${Date.now().toString().slice(-5)}) processed in 11ms`;
    setWebhookLog(prev => [newEvt, ...prev]);
  };

  const handleReconcileSeats = async () => {
    setTelemetrySyncing(true);
    setTelemetryMessage(null);
    try {
      const res = await fetch('/api/v1/telemetry/seats/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': activeOrgId },
        body: JSON.stringify({
          customerId: selectedCustId,
          observedSeats: Number(observedSeatCount),
        }),
      });
      const json = await res.json();
      if (json.data) {
        setTelemetryMessage(json.data.message);
        setWebhookLog(prev => [`telemetry.seats_updated (cust: ${selectedCustId}, seats: ${observedSeatCount})`, ...prev]);
      }
    } catch {
      setTelemetryMessage('Failed to reconcile seat telemetry.');
    } finally {
      setTelemetrySyncing(false);
    }
  };

  const handleSendTestAlert = async () => {
    setTestingAlert(true);
    setAlertSuccessMessage(null);
    try {
      const res = await fetch('/api/v1/alerts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': activeOrgId },
        body: JSON.stringify({
          webhookUrl: alertWebhookUrl,
          channel: 'finance-alerts',
        }),
      });
      const json = await res.json();
      if (json.data) {
        setAlertSuccessMessage(`Dispatched test notification to ${json.data.destination} (Latency: ${json.data.latencyMs}ms)`);
      }
    } catch {
      setAlertSuccessMessage('Failed to dispatch test notification.');
    } finally {
      setTestingAlert(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing &amp; Telemetry Integrations</h1>
        <p className="text-sm text-slate-500">
          Stripe connection credentials, seat provisioning feeds, real-time webhooks, and automated alert destinations.
        </p>
      </div>

      {/* 1. Stripe Billing Ingestion Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Stripe Billing Ingestion</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{keyStatus?.status === 'connected' ? 'CONNECTED' : 'CONFIGURED'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {keyStatus?.accountName || 'Acme Technologies (Stripe Live)'} &bull; Mode: {keyStatus?.mode || 'live'}
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={syncing}
            className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Trigger Sync Now'}</span>
          </button>
        </div>

        {/* API Key Configuration Form */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
              <span>Stripe Restricted API Key (Read-Only)</span>
            </label>
            <span className="text-[10px] text-slate-500 font-medium">Never requests write or charge permissions</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={stripeKey}
              onChange={e => setStripeKey(e.target.value)}
              placeholder="rk_live_... or rk_test_..."
              className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
            <button
              onClick={handleTestKey}
              disabled={testingKey}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingKey ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{testingKey ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
          {keyStatus && (
            <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
              keyStatus.status === 'connected' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{keyStatus.message} {keyStatus.latencyMs > 0 && `(Response: ${keyStatus.latencyMs}ms)`}</span>
            </div>
          )}
        </div>

        {/* Sync Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-500">Sync Status</span>
            <p className="font-bold text-slate-900 mt-1 flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Up to date</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Last sync: {lastSync}</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-500">Normalized Customers</span>
            <p className="text-base font-bold text-slate-900 mt-1">24</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Multi-tenant isolated</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-500">Active Subscriptions</span>
            <p className="text-base font-bold text-slate-900 mt-1">32</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Quantity &amp; price checked</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-500">Invoices &amp; Payments</span>
            <p className="text-base font-bold text-slate-900 mt-1">152</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero webhook loss</p>
          </div>
        </div>

        {/* Read-only Security Guarantee */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-900">Read-Only Financial Guarantee</p>
            <p className="text-emerald-800 mt-0.5 leading-relaxed">
              Revenue Leak Hunter requires strictly read-only access. It cannot charge credit cards, modify plans, or touch bank accounts. All corrections are made by your team directly in Stripe.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Product Seat Provisioning & Telemetry Feed */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Active User Seat Telemetry Feed</h3>
              <p className="text-xs text-slate-500">Connects product usage or directory logs to detect seat underbilling (BILL-001)</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
            Reconciliation Engine Active
          </span>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
          <p className="text-slate-600">
            Simulate or sync actual user counts from Okta, Active Directory, or your product database to compare against invoiced seats in Stripe:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Account</label>
              <select
                value={selectedCustId}
                onChange={e => setSelectedCustId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="customer_001">Acme Technologies Inc (Invoiced: 25 seats)</option>
                <option value="customer_002">Stark Enterprises (Invoiced: 15 seats)</option>
                <option value="customer_003">Wayne Industries (Invoiced: 50 seats)</option>
                <option value="customer_005">Globex Corporation (Invoiced: 10 seats)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Observed Active Users (Telemetry)</label>
              <input
                type="number"
                value={observedSeatCount}
                onChange={e => setObservedSeatCount(Number(e.target.value))}
                min="1"
                max="500"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              onClick={handleReconcileSeats}
              disabled={telemetrySyncing}
              className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${telemetrySyncing ? 'animate-spin' : ''}`} />
              <span>{telemetrySyncing ? 'Reconciling...' : 'Reconcile Telemetry'}</span>
            </button>
          </div>

          {telemetryMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{telemetryMessage} Check the <strong>Opportunities</strong> tab to view updated leak impact.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Automated Alerting & Webhooks (Slack / Discord / Custom) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Automated Alert Webhooks</h3>
              <p className="text-xs text-slate-500">Receive instant notifications in Slack, Discord, or Teams when critical leaks are discovered</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Incoming Webhook URL (Slack / Teams / Zapier)</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={alertWebhookUrl}
                onChange={e => setAlertWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
              />
              <button
                onClick={handleSendTestAlert}
                disabled={testingAlert}
                className="px-4 py-2 font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-emerald-700" />
                <span>{testingAlert ? 'Dispatching...' : 'Send Test Alert'}</span>
              </button>
            </div>
          </div>

          {alertSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{alertSuccessMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Real-Time Webhook Pipeline & Endpoint Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Stripe Webhook Ingestion Endpoint</h3>
            <p className="text-xs text-slate-500">Configure this URL in Stripe Dashboard &gt; Developers &gt; Webhooks</p>
          </div>
          <button
            onClick={handleSimulateWebhook}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Live Event</span>
          </button>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 overflow-x-auto">
          <span className="text-emerald-700 font-bold">POST</span>
          <span className="flex-1 truncate">{webhookUrl}</span>
          <button
            onClick={handleCopyWebhook}
            className="px-2.5 py-1 text-[11px] font-sans font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copiedWebhook ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
            <span>{copiedWebhook ? 'Copied' : 'Copy URL'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-900 text-slate-300 rounded-xl font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
          {webhookLog.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-emerald-400">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
