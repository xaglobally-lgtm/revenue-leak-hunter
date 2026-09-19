import { Detector, DetectionContext, CandidateLeak } from './base.ts';
import { Pay001Detector } from './pay-001.ts';
import { Bill001Detector } from './bill-001.ts';
import { Price001Detector } from './price-001.ts';
import { Inv001Detector } from './inv-001.ts';
import { Usage001Detector } from './usage-001.ts';
import { db } from '../db/store.ts';
import { Leak, LeakStatus } from '../../types.ts';

export const allDetectors: Detector[] = [
  new Pay001Detector(),
  new Bill001Detector(),
  new Price001Detector(),
  new Inv001Detector(),
  new Usage001Detector(),
];

export async function runDetectorsForOrg(orgId: string, detectorIds?: string[]): Promise<Leak[]> {
  const org = db.organizations.get(orgId);
  if (!org) throw new Error(`Organization ${orgId} not found`);

  // Gather normalized data strictly scoped to this organization
  const customers = Array.from(db.customers.values()).filter(c => c.organizationId === orgId);
  const subscriptions = Array.from(db.subscriptions.values()).filter(s => s.organizationId === orgId);
  const invoices = Array.from(db.invoices.values()).filter(i => i.organizationId === orgId);
  const payments = Array.from(db.payments.values()).filter(p => p.organizationId === orgId);
  const discounts = Array.from(db.discounts.values()).filter(d => d.organizationId === orgId);
  const usageRecords = Array.from(db.usageRecords.values()).filter(u => u.organizationId === orgId);
  const prices = Array.from(db.prices.values()).filter(p => p.organizationId === orgId);

  const context: DetectionContext = {
    organizationId: orgId,
    customers,
    subscriptions,
    invoices,
    payments,
    discounts,
    usageRecords,
    prices,
    exclusions: org.settings?.exclusionRules || [],
  };

  const activeDetectors = detectorIds
    ? allDetectors.filter(d => detectorIds.includes(d.id))
    : allDetectors;

  const candidateFindings: CandidateLeak[] = [];
  for (const detector of activeDetectors) {
    try {
      const findings = await detector.detect(context);
      candidateFindings.push(...findings);
    } catch (err) {
      console.error(`Detector ${detector.id} failed:`, err);
    }
  }

  // Deduplicate and persist candidate leaks into database
  const createdOrUpdatedLeaks: Leak[] = [];
  for (const candidate of candidateFindings) {
    // Check if finding is suppressed by rule or previous action
    let existingLeak: Leak | undefined;
    for (const l of db.leaks.values()) {
      if (l.organizationId === orgId && l.fingerprint === candidate.fingerprint) {
        existingLeak = l;
        break;
      }
    }

    if (existingLeak) {
      // If already verified or suppressed or rejected, preserve user state
      if (
        existingLeak.status === LeakStatus.VERIFIED ||
        existingLeak.status === LeakStatus.REJECTED ||
        existingLeak.status === LeakStatus.SUPPRESSED ||
        existingLeak.status === LeakStatus.RECOVERING
      ) {
        createdOrUpdatedLeaks.push(existingLeak);
        continue;
      }
    }

    const leakId = existingLeak ? existingLeak.id : `leak_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newLeak: Leak = {
      id: leakId,
      organizationId: orgId,
      customerId: candidate.customerId,
      detectorId: candidate.detectorId,
      type: candidate.type,
      severity: candidate.severity,
      status: existingLeak ? existingLeak.status : LeakStatus.DETECTED,
      estimatedMonthlyLoss: candidate.estimatedMonthlyLoss,
      estimatedAnnualLoss: candidate.estimatedAnnualLoss,
      confidence: candidate.confidence,
      title: candidate.title,
      summary: candidate.summary,
      fingerprint: candidate.fingerprint,
      evidenceSummary: candidate.evidenceSummary,
      detectedAt: existingLeak ? existingLeak.detectedAt : new Date().toISOString(),
      createdAt: existingLeak ? existingLeak.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.upsertLeak(newLeak);

    // Save Evidence records
    for (const ev of candidate.evidence) {
      const evidenceId = `evi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      db.evidence.set(evidenceId, {
        id: evidenceId,
        organizationId: orgId,
        leakId: newLeak.id,
        source: ev.source,
        sourceRecordId: ev.sourceRecordId,
        field: ev.field,
        observedValue: ev.observedValue,
        expectedValue: ev.expectedValue,
        capturedAt: ev.capturedAt,
        createdAt: new Date().toISOString(),
      });
    }

    // Save Recommendation
    const recId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    db.recommendations.set(recId, {
      id: recId,
      organizationId: orgId,
      leakId: newLeak.id,
      title: candidate.recommendation.title,
      description: candidate.recommendation.description,
      status: 'PENDING',
      generatedBy: candidate.recommendation.generatedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    createdOrUpdatedLeaks.push(newLeak);
  }

  return createdOrUpdatedLeaks;
}
