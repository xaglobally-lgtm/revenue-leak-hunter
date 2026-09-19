import { CandidateLeak, DetectionContext, Detector } from './base.ts';
import { DiscountStatus, LeakSeverity, LeakType, SubscriptionStatus } from '../../types.ts';
import { Money } from '../lib/money.ts';

export class Price001Detector implements Detector {
  readonly id = 'PRICE-001';
  readonly name = 'Expired Discount Still Applied';
  readonly category = LeakType.EXPIRED_DISCOUNT;
  readonly requiredData = ['discounts', 'subscriptions', 'invoices', 'prices'];

  async detect(context: DetectionContext): Promise<CandidateLeak[]> {
    const candidates: CandidateLeak[] = [];
    const now = new Date();

    for (const discount of context.discounts) {
      // Must have an end date that has passed
      if (!discount.endDate) continue;
      const end = new Date(discount.endDate);
      if (end >= now) continue; // Discount is still legitimately active

      const customer = context.customers.find(c => c.id === discount.customerId);
      if (customer?.metadata?.billing_exception === true) continue;

      // Find subscriptions for this customer
      const subs = context.subscriptions.filter(
        s => s.customerId === discount.customerId && (s.status === SubscriptionStatus.ACTIVE || s.status === SubscriptionStatus.PAST_DUE)
      );

      for (const sub of subs) {
        // Find latest invoice
        const invoices = context.invoices
          .filter(inv => inv.subscriptionId === sub.id || inv.customerId === sub.customerId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const latestInvoice = invoices[0];
        if (!latestInvoice) continue;

        // Check if invoice metadata indicates discount was still applied
        const discountStillApplied =
          latestInvoice.metadata?.discountApplied === true ||
          latestInvoice.metadata?.discountId === discount.id ||
          latestInvoice.metadata?.discountId === discount.externalId;

        // If discount is NOT applied on latest invoice, it was correctly removed (Section 66 negative test)
        if (!discountStillApplied) {
          continue;
        }

        // Calculate recurring discount value
        const subPrice = sub.priceId ? context.prices.find(p => p.id === sub.priceId) : undefined;
        const subAmount = subPrice ? parseFloat(subPrice.amount) : 1000.0;
        const currency = subPrice?.currency || 'USD';

        let monthlyDiscountVal = Money.zero(currency);
        if (discount.percentOff) {
          const pct = parseFloat(discount.percentOff) / 100;
          monthlyDiscountVal = new Money(subAmount * pct, currency);
        } else if (discount.amountOff) {
          monthlyDiscountVal = new Money(discount.amountOff, currency);
        } else {
          monthlyDiscountVal = new Money(subAmount * 0.2, currency); // 20% fallback if not specified
        }

        if (!monthlyDiscountVal.isPositive()) continue;

        const annualLoss = monthlyDiscountVal.multiply(12);

        // Confidence: Base 80 + 10 expired passed + 5 latest invoice still applies + 2 active sub = 97
        let confidenceScore = 80 + 10 + 5 + 2;
        if (confidenceScore > 99) confidenceScore = 99;
        const confidenceDecimal = (confidenceScore / 100).toFixed(2);

        const daysExpired = Math.floor((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
        const fingerprint = `price001_${context.organizationId}_${discount.customerId}_${discount.id}_expired_applied`;

        candidates.push({
          detectorId: this.id,
          customerId: discount.customerId || sub.customerId,
          type: this.category,
          severity: annualImpactToSeverity(annualLoss),
          title: `Expired Discount Still Applied on ${sub.externalId}`,
          summary: `A promotional discount expired ${daysExpired} days ago on ${end.toLocaleDateString()}, but the most recent invoice continues to deduct ${monthlyDiscountVal.toFormatted()}/month.`,
          estimatedMonthlyLoss: monthlyDiscountVal.toDecimalString(),
          estimatedAnnualLoss: annualLoss.toDecimalString(),
          confidence: confidenceDecimal,
          fingerprint,
          evidence: [
            {
              source: 'Discount',
              sourceRecordId: discount.id,
              field: 'endDate',
              observedValue: { endDate: discount.endDate, status: DiscountStatus.EXPIRED },
              expectedValue: { status: 'REMOVED_FROM_INVOICE' },
              capturedAt: new Date().toISOString(),
            },
            {
              source: 'Invoice',
              sourceRecordId: latestInvoice.id,
              field: 'discountApplied',
              observedValue: { discountApplied: true, deduction: monthlyDiscountVal.toDecimalString() },
              expectedValue: { discountApplied: false, deduction: '0.00' },
              capturedAt: new Date().toISOString(),
            },
          ],
          recommendation: {
            title: 'Remove Expired Coupon from Stripe Subscription',
            description: `Remove the coupon from subscription ${sub.externalId} to restore standard billing cadence of ${new Money(subAmount, currency).toFormatted()}/month.`,
            status: 'PENDING',
            generatedBy: 'RULE_ENGINE',
          },
          evidenceSummary: {
            discountId: discount.externalId || discount.id,
            expiredOn: discount.endDate,
            daysExpired,
            monthlyDeduction: monthlyDiscountVal.toDecimalString(),
            annualImpact: annualLoss.toDecimalString(),
          },
        });
      }
    }

    return candidates;
  }
}

function annualImpactToSeverity(loss: Money): LeakSeverity {
  const cents = loss.toCents();
  if (cents >= 500000) return LeakSeverity.CRITICAL;
  if (cents >= 100000) return LeakSeverity.HIGH;
  return LeakSeverity.MEDIUM;
}
