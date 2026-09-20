import {
  Organization,
  User,
  Integration,
  Customer,
  Product,
  Price,
  Subscription,
  Invoice,
  Payment,
  UsageRecord,
  Discount,
  Leak,
  EvidenceItem,
  RecommendationItem,
  Recovery,
  RecoveryPayment,
  Report,
  AuditLog,
  WebhookEvent,
  LeakStatus,
  RecoveryStatus,
} from '../../types.ts';
import { Money } from '../lib/money.ts';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export class DatabaseStore {
  public organizations: Map<string, Organization> = new Map();
  public users: Map<string, User> = new Map();
  public integrations: Map<string, Integration> = new Map();
  public customers: Map<string, Customer> = new Map();
  public products: Map<string, Product> = new Map();
  public prices: Map<string, Price> = new Map();
  public subscriptions: Map<string, Subscription> = new Map();
  public invoices: Map<string, Invoice> = new Map();
  public payments: Map<string, Payment> = new Map();
  public usageRecords: Map<string, UsageRecord> = new Map();
  public discounts: Map<string, Discount> = new Map();
  public leaks: Map<string, Leak> = new Map();
  public evidence: Map<string, EvidenceItem> = new Map();
  public recommendations: Map<string, RecommendationItem> = new Map();
  public recoveries: Map<string, Recovery> = new Map();
  public recoveryPayments: Map<string, RecoveryPayment> = new Map();
  public reports: Map<string, Report> = new Map();
  public auditLogs: Map<string, AuditLog> = new Map();
  public webhookEvents: Map<string, WebhookEvent> = new Map();

  // Optional durable file persistence (opt-in via RLH_STORE_FILE).
  // Everything is flushed as one JSON snapshot; reads/writes are synchronous
  // and atomic (temp file + rename) so a crash never corrupts the file.
  private filePath: string | null = null;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  // Optional Supabase persistence (opt-in via SUPABASE_URL + SUPABASE_ANON_KEY).
  // Supabase takes precedence over the local file when both are configured.
  // All RLH data lives in one table `rlh_entities (entity, id, payload)` so it
  // can safely share a database with other apps. Data is hydrated at boot and
  // written through on every mutation (full snapshot replace per sync).
  private remote: { url: string; key: string } | null = null;

  isPersistent(): boolean {
    return this.filePath !== null || this.remote !== null;
  }

  async initSupabasePersistence(url: string, key: string): Promise<boolean> {
    this.filePath = null; // Supabase wins over the local file
    this.remote = { url: url.replace(/\/+$/, ''), key };
    this.cancelFlush();
    const restored = await this.hydrateFromRemote();
    if (!restored) {
      await this.syncRemote('merge');
      console.log('[RLH] Supabase persistence initialized (baseline uploaded)');
    } else {
      console.log('[RLH] Supabase persistence restored');
    }
    return restored;
  }

  private async hydrateFromRemote(): Promise<boolean> {
    if (!this.remote) return false;
    try {
      const res = await fetch(`${this.remote.url}/rest/v1/rlh_entities?select=entity,payload&limit=10000`, {
        headers: { apikey: this.remote.key, Authorization: `Bearer ${this.remote.key}`, Accept: 'application/json' },
      });
      if (!res.ok) {
        console.warn('[RLH] Supabase read failed', res.status);
        return false;
      }
      const rows = (await res.json()) as { entity: string; payload: Record<string, unknown> }[];
      if (!rows.length) return false;

      const data: Record<string, unknown> = {};
      for (const r of rows) {
        const id = r.payload?.id;
        if (typeof id !== 'string' || !id) continue;
        const list = (data[r.entity] ??= [] as [string, unknown][]) as [string, unknown][];
        list.push([id, r.payload]);
      }
      this.restoreSnapshot(data);
      console.log(`[RLH] Supabase: restored ${rows.length} rows across ${Object.keys(data).length} entity tables`);
      return true;
    } catch (err) {
      console.warn('[RLH] Supabase read failed', err);
      return false;
    }
  }

  private syncQueue: Promise<void> = Promise.resolve();

  // Fire-and-forget wrapper: serializes syncs so overlapping timers can never
  // interleave a DELETE with another DELETE/INSERT. Normal writes UPSERT only
  // (no DELETE), so readers never see an empty table; replace is reserved for
  // reset-demo, which must drop rows that no longer exist locally.
  private syncNow(mode: 'merge' | 'replace' = 'merge'): void {
    this.syncQueue = this.syncQueue
      .then(() => this.syncRemote(mode))
      .catch(err => console.warn('[RLH] Supabase sync failed', err));
  }

  replaceAllNow(): void {
    if (this.remote) {
      this.syncNow('replace');
      return;
    }
    this.persistNow();
  }

  private async syncRemote(mode: 'merge' | 'replace'): Promise<void> {
    if (!this.remote) return;
    const snap = this.snapshot();
    const rows: { entity: string; id: string; payload: unknown }[] = [];
    for (const [entity, entries] of Object.entries(snap)) {
      for (const [id, value] of entries as [string, unknown][]) {
        rows.push({ entity, id, payload: value });
      }
    }
    try {
      const base = `${this.remote.url}/rest/v1/rlh_entities`;
      const headers = {
        apikey: this.remote.key,
        Authorization: `Bearer ${this.remote.key}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      if (mode === 'replace') {
        const del = await fetch(`${base}?id=not.is.null`, { method: 'DELETE', headers });
        if (!del.ok && del.status !== 404) {
          throw new Error(`delete-all failed (${del.status})`);
        }
      }
      if (rows.length) {
        const ins = await fetch(`${base}?on_conflict=entity,id`, {
          method: 'POST',
          headers: { ...headers, Prefer: 'return=minimal,resolution=merge-duplicates' },
          body: JSON.stringify(rows),
        });
        if (!ins.ok) {
          throw new Error(`insert failed (${ins.status})`);
        }
      }
      console.log(`[RLH] Supabase sync ${mode}: ${rows.length} rows`);
    } catch (err) {
      console.warn('[RLH] Supabase write failed', err);
    }
  }

  snapshot(): Record<string, unknown> {
    return {
      organizations: Array.from(this.organizations.entries()),
      users: Array.from(this.users.entries()),
      integrations: Array.from(this.integrations.entries()),
      customers: Array.from(this.customers.entries()),
      products: Array.from(this.products.entries()),
      prices: Array.from(this.prices.entries()),
      subscriptions: Array.from(this.subscriptions.entries()),
      invoices: Array.from(this.invoices.entries()),
      payments: Array.from(this.payments.entries()),
      discounts: Array.from(this.discounts.entries()),
      usageRecords: Array.from(this.usageRecords.entries()),
      leaks: Array.from(this.leaks.entries()),
      evidence: Array.from(this.evidence.entries()),
      recommendations: Array.from(this.recommendations.entries()),
      recoveries: Array.from(this.recoveries.entries()),
      recoveryPayments: Array.from(this.recoveryPayments.entries()),
      reports: Array.from(this.reports.entries()),
      auditLogs: Array.from(this.auditLogs.entries()),
      webhookEvents: Array.from(this.webhookEvents.entries()),
    };
  }

  restoreSnapshot(data: Record<string, unknown>): void {
    const set = <V>(map: Map<string, V>, key: string): void => {
      const rows = data[key] as [string, V][] | undefined;
      if (!Array.isArray(rows)) return;
      map.clear();
      for (const [k, v] of rows) map.set(k, v);
    };
    set(this.organizations, 'organizations');
    set(this.users, 'users');
    set(this.integrations, 'integrations');
    set(this.customers, 'customers');
    set(this.products, 'products');
    set(this.prices, 'prices');
    set(this.subscriptions, 'subscriptions');
    set(this.invoices, 'invoices');
    set(this.payments, 'payments');
    set(this.discounts, 'discounts');
    set(this.usageRecords, 'usageRecords');
    set(this.leaks, 'leaks');
    set(this.evidence, 'evidence');
    set(this.recommendations, 'recommendations');
    set(this.recoveries, 'recoveries');
    set(this.recoveryPayments, 'recoveryPayments');
    set(this.reports, 'reports');
    set(this.auditLogs, 'auditLogs');
    set(this.webhookEvents, 'webhookEvents');
  }

  initFilePersistence(filePath: string): boolean {
    this.filePath = filePath;
    this.cancelFlush();
    if (existsSync(filePath)) {
      try {
        const raw = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, unknown>;
        this.restoreSnapshot(raw);
        return true;
      } catch (err) {
        console.warn('[RLH] Persistence load failed; starting fresh', err);
      }
    }
    this.persistNow();
    return false;
  }

  persistNow(): void {
    if (this.remote) {
      void this.syncNow('merge');
      return;
    }
    if (!this.filePath) return;
    try {
      mkdirSync(dirname(this.filePath), { recursive: true });
      const tmp = `${this.filePath}.tmp`;
      writeFileSync(tmp, JSON.stringify(this.snapshot(), null, 2), 'utf8');
      renameSync(tmp, this.filePath);
    } catch (err) {
      console.warn('[RLH] Persistence write failed', err);
    }
  }

  persistSoon(): void {
    if ((!this.filePath && !this.remote) || this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.persistNow();
    }, 400);
  }

  private cancelFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  // Tenant Isolation Helper
  private assertTenant<T extends { organizationId: string }>(item: T | undefined, orgId: string): T | null {
    if (!item) return null;
    if (item.organizationId !== orgId) return null;
    return item;
  }

  // AUDIT LOG
  logAudit(
    organizationId: string,
    action: string,
    entityType: string,
    entityId?: string,
    before?: unknown,
    after?: unknown,
    metadata?: unknown,
    userId?: string
  ): AuditLog {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId,
      userId,
      action,
      entityType,
      entityId,
      before: before ? JSON.parse(JSON.stringify(before)) : null,
      after: after ? JSON.parse(JSON.stringify(after)) : null,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.set(log.id, log);
    this.persistSoon();
    return log;
  }

  // LEAKS & OPPORTUNITIES
  getLeaks(orgId: string, filter?: { status?: string; detectorId?: string; search?: string }): Leak[] {
    const results: Leak[] = [];
    for (const leak of this.leaks.values()) {
      if (leak.organizationId !== orgId) continue;
      if (filter?.status && filter.status !== 'ALL' && leak.status !== filter.status) continue;
      if (filter?.detectorId && filter.detectorId !== 'ALL' && leak.detectorId !== filter.detectorId) continue;

      const customer = this.customers.get(leak.customerId);
      if (filter?.search) {
        const term = filter.search.toLowerCase();
        const matchesTitle = leak.title.toLowerCase().includes(term);
        const matchesCustomer = customer?.name.toLowerCase().includes(term);
        if (!matchesTitle && !matchesCustomer) continue;
      }

      // attach customer & evidence & recovery
      const evidence = Array.from(this.evidence.values()).filter(e => e.leakId === leak.id);
      const recommendations = Array.from(this.recommendations.values()).filter(r => r.leakId === leak.id);
      const recovery = Array.from(this.recoveries.values()).find(rec => rec.leakId === leak.id);

      results.push({
        ...leak,
        customer,
        evidence,
        recommendations,
        recovery,
      });
    }

    // Sort by priority: expected annual recovery * confidence
    return results.sort((a, b) => {
      const scoreA = parseFloat(a.estimatedAnnualLoss) * parseFloat(a.confidence);
      const scoreB = parseFloat(b.estimatedAnnualLoss) * parseFloat(b.confidence);
      return scoreB - scoreA;
    });
  }

  getLeakById(orgId: string, id: string): Leak | null {
    const leak = this.assertTenant(this.leaks.get(id), orgId);
    if (!leak) return null;

    const customer = this.customers.get(leak.customerId);
    const evidence = Array.from(this.evidence.values()).filter(e => e.leakId === leak.id);
    const recommendations = Array.from(this.recommendations.values()).filter(r => r.leakId === leak.id);
    const recovery = Array.from(this.recoveries.values()).find(rec => rec.leakId === leak.id);

    return {
      ...leak,
      customer,
      evidence,
      recommendations,
      recovery,
    };
  }

  upsertLeak(leak: Leak): Leak {
    // Check for existing fingerprint within org for idempotency
    let existingId: string | null = null;
    for (const l of this.leaks.values()) {
      if (l.organizationId === leak.organizationId && l.fingerprint === leak.fingerprint) {
        existingId = l.id;
        break;
      }
    }

    if (existingId) {
      const existing = this.leaks.get(existingId)!;
      // Do not overwrite user-actioned states (VERIFIED, REJECTED, SUPPRESSED)
      if (existing.status === LeakStatus.VERIFIED || existing.status === LeakStatus.REJECTED || existing.status === LeakStatus.SUPPRESSED) {
        return existing;
      }
      const updated: Leak = {
        ...existing,
        ...leak,
        id: existing.id,
        updatedAt: new Date().toISOString(),
      };
      this.leaks.set(existing.id, updated);
      this.persistSoon();
      return updated;
    }

    this.leaks.set(leak.id, leak);
    this.persistSoon();
    return leak;
  }

  // RECOVERIES
  getRecoveries(orgId: string): Recovery[] {
    const list: Recovery[] = [];
    for (const rec of this.recoveries.values()) {
      if (rec.organizationId !== orgId) continue;
      const leak = this.leaks.get(rec.leakId);
      const customer = this.customers.get(rec.customerId);
      const payments = Array.from(this.recoveryPayments.values()).filter(p => p.recoveryId === rec.id);

      list.push({
        ...rec,
        leak,
        customer,
        payments,
      });
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getRecoveryById(orgId: string, id: string): Recovery | null {
    const rec = this.assertTenant(this.recoveries.get(id), orgId);
    if (!rec) return null;
    const leak = this.leaks.get(rec.leakId);
    const customer = this.customers.get(rec.customerId);
    const payments = Array.from(this.recoveryPayments.values()).filter(p => p.recoveryId === rec.id);

    return {
      ...rec,
      leak,
      customer,
      payments,
    };
  }

  // RECORD RECOVERY PAYMENT & 10% FEE
  recordRecoveryPayment(
    orgId: string,
    recoveryId: string,
    payment: {
      amount: string;
      currency: string;
      paymentDate: string;
      source: string;
      externalPaymentId?: string;
    }
  ): { payment: RecoveryPayment; recovery: Recovery } {
    const rec = this.getRecoveryById(orgId, recoveryId);
    if (!rec) {
      throw new Error('Recovery record not found or access denied');
    }

    // Check for duplicate payment ID in this org (Section 89)
    if (payment.externalPaymentId) {
      for (const p of this.recoveryPayments.values()) {
        if (p.organizationId === orgId && p.externalPaymentId === payment.externalPaymentId) {
          throw new Error(`Payment with external ID ${payment.externalPaymentId} has already been attributed.`);
        }
      }
    }

    const moneyAmount = new Money(payment.amount, payment.currency);
    const feeMoney = moneyAmount.calculateRLHFee();

    const paymentRecord: RecoveryPayment = {
      id: `rec_pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: orgId,
      recoveryId: rec.id,
      externalPaymentId: payment.externalPaymentId,
      amount: moneyAmount.toDecimalString(),
      currency: payment.currency.toUpperCase(),
      paymentDate: payment.paymentDate,
      source: payment.source,
      attributableAmount: moneyAmount.toDecimalString(),
      feeAmount: feeMoney.toDecimalString(),
      createdAt: new Date().toISOString(),
    };

    this.recoveryPayments.set(paymentRecord.id, paymentRecord);

    // Update Recovery actualAmount atomically
    const currentActual = new Money(rec.actualAmount || '0.00', rec.currency);
    const newActual = currentActual.add(moneyAmount);

    const updatedRec: Recovery = {
      ...rec,
      actualAmount: newActual.toDecimalString(),
      status: RecoveryStatus.RECOVERING,
      updatedAt: new Date().toISOString(),
    };
    this.recoveries.set(updatedRec.id, updatedRec);
    this.persistSoon();

    // Audit log
    this.logAudit(
      orgId,
      'RECOVERY_PAYMENT_RECORDED',
      'RecoveryPayment',
      paymentRecord.id,
      { previousActual: currentActual.toDecimalString() },
      { newActual: newActual.toDecimalString(), fee: feeMoney.toDecimalString() },
      { paymentDate: payment.paymentDate, recoveryId }
    );

    return { payment: paymentRecord, recovery: updatedRec };
  }

  // WEBHOOK EVENT DEDUPLICATION (Section 25 & 87)
  recordWebhookEvent(orgId: string, externalEventId: string, eventType: string, payload: Record<string, unknown>): WebhookEvent {
    // Check if duplicate
    for (const evt of this.webhookEvents.values()) {
      if (evt.organizationId === orgId && evt.externalEventId === externalEventId) {
        return evt;
      }
    }

    const evt: WebhookEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      organizationId: orgId,
      provider: 'stripe',
      externalEventId,
      eventType,
      payload,
      processed: false,
      createdAt: new Date().toISOString(),
    };
    this.webhookEvents.set(evt.id, evt);
    this.persistSoon();
    return evt;
  }
}

export const db = new DatabaseStore();
