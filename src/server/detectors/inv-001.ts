import { CandidateLeak, DetectionContext, Detector } from './base.ts';
import { BillingInterval, LeakSeverity, LeakType, SubscriptionStatus } from '../../types.ts';
import { Money } from '../lib/money.ts';

export class Inv001Detector implements Detector {
  readonly id = 'INV-001';
  readonly name = 'Missing / Overdue Invoice';
  readonly category = LeakType.MISSING_INVOICE;
  readonly requiredData = ['subscriptions', 'invoices', 'prices', 'customers'];

  async detect(context: DetectionContext): Promise<CandidateLeak[]> {
    const candidates: CandidateLeak[] = [];
    const now = new Date();
    const GRACE_PERIOD_DAYS = 7;

    for (const sub of context.subscriptions) {
      // Must be ACTIVE. If TRIALING or CANCELED, do NOT trigger (Section 66 & 94)
      if (sub.status !== SubscriptionStatus.ACTIVE) {
        continue;
      }

      const customer = context.customers.find(c => c.id === sub.customerId);
      if (customer?.metadata?.billing_exception === true) {
        continue;
      }

      // Check price interval - if YEARLY, don't look for monthly invoices! (Section 95)
      const price = sub.priceId ? context.prices.find(p => p.id === sub.priceId) : undefined;
      if (price?.interval === BillingInterval.YEAR) {
        continue;
      }

      // Invoices for this subscription
      const subInvoices = context.invoices
        .filter(inv => inv.subscriptionId === sub.id || inv.customerId === sub.customerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Needs at least 1-2 historical invoices to establish cadence
      if (subInvoices.length === 0) {
        continue;
      }

      const latestInvoice = subInvoices[0];
      const latestInvoiceDate = new Date(latestInvoice.createdAt);

      // Expected next invoice is roughly 30 days after latest invoice
      const expectedNextDate = new Date(latestInvoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const graceCutoff = new Date(expectedNextDate.getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);

      // If we haven't crossed graceCutoff, it's not overdue
      if (now < graceCutoff) {
        continue;
      }

      const daysOverdue = Math.floor((now.getTime() - expectedNextDate.getTime()) / (1000 * 60 * 60 * 24));

      // Calculate expected monthly amount from latest invoice or price
      const expectedAmount = latestInvoice ? latestInvoice.amountDue : price ? price.amount : '750.00';
      const currency = latestInvoice?.currency || price?.currency || 'USD';
      const monthlyLoss = new Money(expectedAmount, currency);
      const annualLoss = monthlyLoss.multiply(12);

      // Confidence: Base 65 + 10 active sub + 10 historical cadence + 5 established amount = 90
      let confidenceScore = 65 + 10 + 10 + 5;
      if (confidenceScore > 95) confidenceScore = 95;
      const confidenceDecimal = (confidenceScore / 100).toFixed(2);

      const fingerprint = `inv001_${context.organizationId}_${sub.customerId}_${sub.id}_missing_invoice`;

      candidates.push({
        detectorId: this.id,
        customerId: sub.customerId,
        type: this.category,
        severity: annualLoss.toCents() > 500000 ? LeakSeverity.HIGH : LeakSeverity.MEDIUM,
        title: `Missing Recurring Invoice for ${sub.externalId}`,
        summary: `Subscription ${sub.externalId} is active with regular monthly billing history, but no invoice has been generated for ${daysOverdue} days past the expected renewal date.`,
        estimatedMonthlyLoss: monthlyLoss.toDecimalString(),
        estimatedAnnualLoss: annualLoss.toDecimalString(),
        confidence: confidenceDecimal,
        fingerprint,
        evidence: [
          {
            source: 'Subscription',
            sourceRecordId: sub.id,
            field: 'status',
            observedValue: { status: sub.status, currentPeriodEnd: sub.currentPeriodEnd },
            expectedValue: { invoiceStatus: 'GENERATED_FOR_PERIOD' },
            capturedAt: new Date().toISOString(),
          },
          {
            source: 'InvoiceHistory',
            sourceRecordId: latestInvoice.id,
            field: 'lastInvoiceDate',
            observedValue: { lastInvoiceDate: latestInvoice.createdAt, daysSince: Math.floor((now.getTime() - latestInvoiceDate.getTime()) / (1000 * 60 * 60 * 24)) },
            expectedValue: { expectedCadence: 'Monthly', expectedNextDate: expectedNextDate.toISOString() },
            capturedAt: new Date().toISOString(),
          },
        ],
        recommendation: {
          title: 'Trigger Manual or Automated Draft Invoice in Stripe',
          description: `Check Stripe subscription billing anchor and trigger invoice creation for the current period to prevent delayed revenue realization.`,
          status: 'PENDING',
          generatedBy: 'RULE_ENGINE',
        },
        evidenceSummary: {
          subscriptionId: sub.externalId,
          lastInvoiced: latestInvoice.createdAt,
          expectedInvoiceDate: expectedNextDate.toISOString().split('T')[0],
          daysOverdue,
          expectedMonthlyAmount: monthlyLoss.toDecimalString(),
        },
      });
    }

    return candidates;
  }
}
