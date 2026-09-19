import { CandidateLeak, DetectionContext, Detector } from './base.ts';
import { BillingInterval, LeakSeverity, LeakType, SubscriptionStatus } from '../../types.ts';
import { Money } from '../lib/money.ts';

export class Bill001Detector implements Detector {
  readonly id = 'BILL-001';
  readonly name = 'Subscription Quantity / Billing Inconsistency';
  readonly category = LeakType.BILLING_MISMATCH;
  readonly requiredData = ['subscriptions', 'prices', 'invoices', 'customers'];

  async detect(context: DetectionContext): Promise<CandidateLeak[]> {
    const candidates: CandidateLeak[] = [];

    for (const sub of context.subscriptions) {
      // Ignore non-active subscriptions (e.g. CANCELED, INCOMPLETE) - Section 66 negative test
      if (sub.status !== SubscriptionStatus.ACTIVE) {
        continue;
      }

      if (!sub.quantity) {
        continue;
      }

      const customer = context.customers.find(c => c.id === sub.customerId);
      if (customer?.metadata?.billing_exception === true) {
        continue;
      }

      const activeQuantity = parseFloat(sub.quantity);
      if (isNaN(activeQuantity) || activeQuantity <= 0) {
        continue;
      }

      // Find latest invoice for this subscription
      const customerInvoices = context.invoices
        .filter(inv => inv.subscriptionId === sub.id || inv.customerId === sub.customerId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const latestInvoice = customerInvoices[0];
      if (!latestInvoice || !latestInvoice.metadata) {
        continue;
      }

      // If invoice was legitimately prorated mid-month, skip false positive (Section 92)
      if (latestInvoice.metadata.isProrated === true) {
        continue;
      }

      const billedQuantity = latestInvoice.metadata.billedQuantity;
      if (billedQuantity === undefined || billedQuantity === null) {
        continue;
      }

      const delta = activeQuantity - billedQuantity;
      if (delta <= 0) {
        continue; // Billed matches or exceeds observed
      }

      // Price lookup
      const price = sub.priceId ? context.prices.find(p => p.id === sub.priceId) : undefined;
      const unitPriceAmount = price ? parseFloat(price.amount) : 200.0;
      const currency = price?.currency || 'USD';

      // Monthly impact = delta * unitPrice
      const unitMoney = new Money(unitPriceAmount, currency);
      const monthlyImpact = unitMoney.multiply(delta);
      const annualImpact = price?.interval === BillingInterval.YEAR ? monthlyImpact : monthlyImpact.multiply(12);

      // Confidence: Base 75 + 10 invoice quantity differs directly + 5 active sub + 4 unambiguous price = 94 to 96
      let confidenceScore = 75;
      confidenceScore += 10; // direct difference
      confidenceScore += 5; // active sub
      if (price) confidenceScore += 6; // unambiguous price
      if (confidenceScore > 99) confidenceScore = 99;

      const confidenceDecimal = (confidenceScore / 100).toFixed(2);
      const fingerprint = `bill001_${context.organizationId}_${sub.customerId}_${sub.id}_qty_mismatch`;

      candidates.push({
        detectorId: this.id,
        customerId: sub.customerId,
        type: this.category,
        severity: annualImpact.toCents() > 1000000 ? LeakSeverity.CRITICAL : LeakSeverity.HIGH,
        title: `${delta} Unbilled Seats on Subscription ${sub.externalId}`,
        summary: `${customer?.name || 'Customer'} currently has ${activeQuantity} active seats while billing for ${billedQuantity}, resulting in a ${delta} seat discrepancy.`,
        estimatedMonthlyLoss: monthlyImpact.toDecimalString(),
        estimatedAnnualLoss: annualImpact.toDecimalString(),
        confidence: confidenceDecimal,
        fingerprint,
        evidence: [
          {
            source: 'Subscription',
            sourceRecordId: sub.id,
            field: 'quantity',
            observedValue: { quantity: activeQuantity, status: sub.status },
            expectedValue: { billedQuantity: activeQuantity },
            capturedAt: new Date().toISOString(),
          },
          {
            source: 'Invoice',
            sourceRecordId: latestInvoice.id,
            field: 'billedQuantity',
            observedValue: { billedQuantity },
            expectedValue: { billedQuantity: activeQuantity },
            capturedAt: new Date().toISOString(),
          },
          {
            source: 'Price',
            sourceRecordId: price?.id || 'price_default',
            field: 'amount',
            observedValue: { unitPrice: unitMoney.toDecimalString(), currency },
            expectedValue: { unitPrice: unitMoney.toDecimalString() },
            capturedAt: new Date().toISOString(),
          },
        ],
        recommendation: {
          title: `Update Subscription Quantity to ${activeQuantity} Seats`,
          description: `Verify the customer's contracted seat count. If all ${activeQuantity} seats are billable, update the subscription quantity in Stripe to reflect the additional ${delta} seats ($${monthlyImpact.toFormatted()}/mo).`,
          status: 'PENDING',
          generatedBy: 'RULE_ENGINE',
        },
        evidenceSummary: {
          observedSeats: activeQuantity,
          billedSeats: billedQuantity,
          difference: delta,
          pricePerUnit: unitMoney.toDecimalString(),
          monthlyImpact: monthlyImpact.toDecimalString(),
          annualImpact: annualImpact.toDecimalString(),
        },
      });
    }

    return candidates;
  }
}
