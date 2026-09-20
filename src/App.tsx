import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/Sidebar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { GuidedWorkflowBar } from './components/GuidedWorkflowBar.tsx';
import { AboutContactModal } from './components/AboutContactModal.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { OpportunitiesView } from './components/OpportunitiesView.tsx';
import { OpportunityDetailModal } from './components/OpportunityDetailModal.tsx';
import { VerifyModal } from './components/VerifyModal.tsx';
import { RejectModal } from './components/RejectModal.tsx';
import { RecoveriesView } from './components/RecoveriesView.tsx';
import { RecoveryDetailModal } from './components/RecoveryDetailModal.tsx';
import { RecordPaymentModal } from './components/RecordPaymentModal.tsx';
import { CustomersView, CustomerWithMetrics } from './components/CustomersView.tsx';
import { CustomerDetailModal } from './components/CustomerDetailModal.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { IntegrationView } from './components/IntegrationView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { TestSuiteView } from './components/TestSuiteView.tsx';
import { DocumentationView } from './components/DocumentationView.tsx';
import { PublicLanding } from './components/PublicLanding.tsx';
import { FreeScanFlow } from './components/FreeScanFlow.tsx';
import { LoginView } from './components/LoginView.tsx';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DashboardOverview, Leak, Recovery, User } from './types.ts';
import { rlhFetch } from './lib/api.ts';
import { trackEvent, initErrorTracking } from './lib/telemetry.ts';
import { LegalModal } from './components/LegalModal.tsx';

function AppContent() {
  const { theme, workflowStep, setWorkflowStep, activeOrgId, setActiveOrgId } = useApp();
  const { authEnabled, loading: authLoading, session, signOut } = useAuth();
  const isDark = theme === 'dark';

  const [viewMode, setViewMode] = useState<'app' | 'public' | 'scan'>('app');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Real signed-in identity (populated from /api/v1/me once authenticated).
  // Unused in demo mode (authEnabled === false), where the app keeps its
  // original hardcoded demo user/tenants below.
  const [meData, setMeData] = useState<{ user: User; organization: { id: string; name: string } } | null>(null);

  useEffect(() => {
    if (!authEnabled || !session) return;
    let cancelled = false;
    rlhFetch<{ data: { user: User; organization: { id: string; name: string } } }>('/api/v1/me').then(res => {
      if (cancelled || !res.ok || !res.data?.data) return;
      setMeData(res.data.data);
      setActiveOrgId(res.data.data.organization.id);
    });
    return () => {
      cancelled = true;
    };
  }, [authEnabled, session, setActiveOrgId]);

  // Switch tenant (kept in sync with server via x-organization-id header)
  const handleSwitchTenant = (orgId: string) => {
    setActiveOrgId(orgId);
    localStorage.setItem('rlh_org', orgId);
  };

  // In real-auth mode each signed-in user has exactly one organization
  // (auto-created on first login) — no demo tenant switcher. In demo mode
  // (authEnabled === false) this keeps the original two synthetic tenants.
  const availableTenants = authEnabled
    ? meData
      ? [{ id: meData.organization.id, name: meData.organization.name }]
      : []
    : [
        { id: 'org_acme_corp', name: 'Acme Revenue Operations' },
        { id: 'org_vortex_global', name: 'Vortex Global (Isolated Tenant)' },
      ];

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [opportunities, setOpportunities] = useState<Leak[]>([]);
  const [recoveries, setRecoveries] = useState<Recovery[]>([]);
  const [recoverySummaryData, setRecoverySummaryData] = useState<{
    verified: string;
    recovered: string;
    rlhFees: string;
    netBenefit: string;
  } | null>(null);
  const [customers, setCustomers] = useState<CustomerWithMetrics[]>([]);
  // Demo-mode fallback identity, used only when authEnabled === false.
  const [demoUser] = useState<User>({
    id: 'user-1',
    organizationId: 'org-acme-prod',
    name: 'Jane Doe',
    email: 'jane@acme.com',
    role: 'OWNER' as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const currentUser: User | null = authEnabled ? meData?.user ?? null : demoUser;

  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [selectedLeak, setSelectedLeak] = useState<Leak | null>(null);
  const [verifyingLeak, setVerifyingLeak] = useState<Leak | null>(null);
  const [rejectingLeak, setRejectingLeak] = useState<Leak | null>(null);

  const [selectedRecovery, setSelectedRecovery] = useState<Recovery | null>(null);
  const [recordingPaymentRecovery, setRecordingPaymentRecovery] = useState<Recovery | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithMetrics | null>(null);

  // Fetch all tenant data. Skipped while a real-auth deployment hasn't
  // finished signing the visitor in yet (avoids a burst of 401s against the
  // protected endpoints right before the login screen renders).
  const fetchData = useCallback(async () => {
    if (authEnabled && !session) return;
    try {
      const [dashRes, oppsRes, recsRes, custRes] = await Promise.all([
        rlhFetch<{ data: DashboardOverview }>(`/api/v1/dashboard`, undefined, activeOrgId),
        rlhFetch<{ data: Leak[] }>(`/api/v1/opportunities`, undefined, activeOrgId),
        rlhFetch<{ data: { items: Recovery[]; summary: { verified: string; recovered: string; rlhFees: string; netBenefit: string } } }>(
          `/api/v1/recoveries`,
          undefined,
          activeOrgId
        ),
        rlhFetch<{ data: CustomerWithMetrics[] }>(`/api/v1/customers`, undefined, activeOrgId),
      ]);

      if (dashRes.ok && dashRes.data?.data) {
        setDashboardData(dashRes.data.data);
      }
      if (oppsRes.ok && oppsRes.data) {
        const items = oppsRes.data.data || [];
        setOpportunities(items);
        if (items.some((o: Leak) => o.status === 'DETECTED')) {
          setWorkflowStep('detect');
        }
      }
      if (recsRes.ok && recsRes.data) {
        setRecoveries(recsRes.data.data?.items || []);
        setRecoverySummaryData(recsRes.data.data?.summary || null);
      }
      if (custRes.ok && custRes.data) {
        setCustomers(custRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch application state:', err);
    }
  }, [activeOrgId, setWorkflowStep, authEnabled, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Global error logging + app opened event
  useEffect(() => {
    const stop = initErrorTracking();
    trackEvent('app_opened', { org: activeOrgId });
    return stop;
  }, []);

  // Sync trigger (runs detectors against current tenant)
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await rlhFetch(`/api/v1/integrations/stripe/sync`, { method: 'POST' }, activeOrgId);
      if (res.ok) {
        trackEvent('sync_completed', { org: activeOrgId });
      }
      await fetchData();
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Actions
  const handleVerify = async (leakId: string, notes: string) => {
    try {
      const res = await rlhFetch(
        `/api/v1/opportunities/${leakId}/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        },
        activeOrgId
      );
      if (res.ok) {
        setVerifyingLeak(null);
        setSelectedLeak(null);
        setWorkflowStep('collect');
        trackEvent('leak_verified', { leakId });
        await fetchData();
      }
    } catch (e) {
      console.error('Failed to verify leak:', e);
    }
  };

  const handleReject = async (leakId: string, reason: string) => {
    try {
      const res = await rlhFetch(
        `/api/v1/opportunities/${leakId}/reject`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason }),
        },
        activeOrgId
      );
      if (res.ok) {
        setRejectingLeak(null);
        setSelectedLeak(null);
        await fetchData();
      }
    } catch (e) {
      console.error('Failed to reject leak:', e);
    }
  };

  const handleSuppress = async (leakId: string) => {
    try {
      const res = await rlhFetch(
        `/api/v1/opportunities/${leakId}/suppress`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        activeOrgId
      );
      if (res.ok) {
        setSelectedLeak(null);
        await fetchData();
      }
    } catch (e) {
      console.error('Failed to suppress leak:', e);
    }
  };

  const handleRecordPayment = async (
    recoveryId: string,
    paymentOrAmount: any,
    stripePaymentId?: string,
    stripeInvoiceId?: string
  ) => {
    try {
      let payload: any = {};
      if (typeof paymentOrAmount === 'object' && paymentOrAmount !== null) {
        payload = {
          amount: paymentOrAmount.amount,
          currency: paymentOrAmount.currency || 'USD',
          externalPaymentId: paymentOrAmount.externalPaymentId || stripePaymentId,
          paymentDate: paymentOrAmount.paymentDate || new Date().toISOString(),
        };
      } else {
        payload = {
          amount: String(paymentOrAmount),
          stripePaymentId,
          stripeInvoiceId,
        };
      }

      const res = await rlhFetch(
        `/api/v1/recoveries/${recoveryId}/payment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
        activeOrgId
      );
      if (res.ok) {
        setRecordingPaymentRecovery(null);
        setWorkflowStep('ledger');
        trackEvent('payment_recorded', { recoveryId });
        await fetchData();
      }
    } catch (e) {
      console.error('Failed to record payment:', e);
    }
  };

  // Switch public vs app
  if (viewMode === 'public') {
    trackEvent('view_landing');
    return (
      <>
        <PublicLanding
          onStartFreeScan={() => setViewMode('scan')}
          onEnterApp={() => setViewMode('app')}
        />
        <AboutContactModal />
        <LegalModal />
      </>
    );
  }

  if (viewMode === 'scan') {
    return (
      <>
        <FreeScanFlow
          onBackToHome={() => setViewMode('public')}
          onCompleteScan={() => {
            setViewMode('app');
            setCurrentTab('opportunities');
            trackEvent('free_scan_completed');
            fetchData();
          }}
        />
        <AboutContactModal />
        <LegalModal />
      </>
    );
  }

  // Real-auth login wall: only applies when this deployment has
  // VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY configured. Demo deployments
  // (authEnabled === false) are completely unaffected by any of this.
  if (authEnabled && authLoading) {
    return (
      <div
        className={`h-screen w-screen flex items-center justify-center ${
          isDark ? 'bg-slate-950' : 'bg-slate-100'
        }`}
      />
    );
  }
  if (authEnabled && !session) {
    return <LoginView onBackToHome={() => setViewMode('public')} />;
  }
  if (authEnabled && session && !meData) {
    // Signed in, waiting on the one /me round-trip that resolves this
    // user's organization before rendering data that depends on it.
    return (
      <div
        className={`h-screen w-screen flex items-center justify-center ${
          isDark ? 'bg-slate-950' : 'bg-slate-100'
        }`}
      />
    );
  }

  const currentTenant = availableTenants.find(t => t.id === activeOrgId);

  const recoverySummary = recoverySummaryData || {
    verified: dashboardData?.verifiedRecovery.amount || '0.00',
    recovered: dashboardData?.actualRecovery.amount || '0.00',
    rlhFees: dashboardData?.rlhFees.amount || '0.00',
    netBenefit: dashboardData?.netBenefit.amount || '0.00',
  };

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex font-sans antialiased select-none ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Left Resizable Sidebar (Slide Boundary) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        opportunityCount={opportunities.filter(o => o.status === 'DETECTED').length}
        onOpenPublicSite={() => setViewMode('public')}
      />

      {/* Main App Canvas - Strict Non-Scrolling Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar with Language, Currency, Theme toggles */}
        <Navbar
          user={currentUser}
          orgName={currentTenant?.name || 'Acme Revenue Operations'}
          availableTenants={availableTenants}
          activeOrgId={activeOrgId}
          onSwitchTenant={handleSwitchTenant}
          onReviewOpportunities={() => setCurrentTab('opportunities')}
          onViewRecoveries={() => setCurrentTab('recoveries')}
          onTriggerSync={handleTriggerSync}
          isSyncing={isSyncing}
          onSignOut={authEnabled ? signOut : undefined}
        />

        {/* Next-Touch Guided Workflow Bar */}
        <GuidedWorkflowBar
          currentTab={currentTab}
          onNavigateTab={setCurrentTab}
          unverifiedLeaksCount={opportunities.filter(o => o.status === 'DETECTED').length}
          unrecordedRecoveriesCount={recoveries.filter(r => r.status === 'VERIFIED').length}
          onInspectNextLeak={() => {
            const nextLeak = opportunities.find(o => o.status === 'DETECTED') || opportunities[0];
            if (nextLeak) {
              setCurrentTab('opportunities');
              setSelectedLeak(nextLeak);
            }
          }}
          onRecordNextPayment={() => {
            const nextRec = recoveries.find(r => r.status === 'VERIFIED') || recoveries[0];
            if (nextRec) {
              setCurrentTab('recoveries');
              setRecordingPaymentRecovery(nextRec);
            }
          }}
        />

        {/* Primary Viewport Area (Strict Zero Document Scroll) */}
        <main className="flex-1 p-2 sm:p-2.5 overflow-hidden flex flex-col min-h-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              data={dashboardData}
              onViewOpportunity={setSelectedLeak}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'opportunities' && (
            <OpportunitiesView
              opportunities={opportunities}
              onSelectOpportunity={setSelectedLeak}
              onRefresh={fetchData}
            />
          )}

          {currentTab === 'recoveries' && (
            <RecoveriesView
              recoveries={recoveries}
              summary={recoverySummary}
              onSelectRecovery={setSelectedRecovery}
              onOpenRecordPayment={setRecordingPaymentRecovery}
            />
          )}

          {currentTab === 'customers' && (
            <div className="h-full flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <CustomersView
                customers={customers}
                onSelectCustomer={setSelectedCustomer}
              />
            </div>
          )}

          {currentTab === 'reports' && (
            <div className="h-full flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <ReportsView />
            </div>
          )}

          {currentTab === 'integration' && (
            <div className="h-full flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <IntegrationView />
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="h-full flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <SettingsView />
            </div>
          )}

          {currentTab === 'docs' && <DocumentationView />}

          {currentTab === 'tests' && (
            <div className="h-full flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <TestSuiteView />
            </div>
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      {selectedLeak && (
        <OpportunityDetailModal
          leak={selectedLeak}
          onClose={() => setSelectedLeak(null)}
          onOpenVerify={leak => setVerifyingLeak(leak)}
          onOpenReject={leak => setRejectingLeak(leak)}
          onSuppress={handleSuppress}
        />
      )}

      {verifyingLeak && (
        <VerifyModal
          leak={verifyingLeak}
          onClose={() => setVerifyingLeak(null)}
          onConfirm={handleVerify}
        />
      )}

      {rejectingLeak && (
        <RejectModal
          leak={rejectingLeak}
          onClose={() => setRejectingLeak(null)}
          onConfirm={handleReject}
        />
      )}

      {selectedRecovery && (
        <RecoveryDetailModal
          recovery={selectedRecovery}
          onClose={() => setSelectedRecovery(null)}
          onRecordPayment={rec => setRecordingPaymentRecovery(rec)}
        />
      )}

      {recordingPaymentRecovery && (
        <RecordPaymentModal
          recovery={recordingPaymentRecovery}
          onClose={() => setRecordingPaymentRecovery(null)}
          onSubmit={handleRecordPayment}
        />
      )}

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSelectOpportunity={leak => {
            setSelectedCustomer(null);
            setSelectedLeak(leak);
          }}
        />
      )}

      {/* About & Contact Modal */}
      <AboutContactModal />

      {/* Privacy / Terms Modal */}
      <LegalModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}
