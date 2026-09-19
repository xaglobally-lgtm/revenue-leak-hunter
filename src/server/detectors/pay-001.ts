import { CandidateLeak, DetectionContext, Detector } from './base.ts';
import { InvoiceStatus, LeakSeverity, LeakType, PaymentStatus, SubscriptionStatus } from '../../types.ts';
import { Money } from '../lib/money.ts';

export class Pay001Detector implements Detector {
  readonly id = 'PAY-001';
  readonly name = 'Failed / Uncaptured Recurring Payment';
  readonly category = LeakType.FAILED_PAYMENT;
  readonly requiredData = ['invoices', 'payments', 'subscriptions'];

  async detect(context: DetectionContext): Promise<CandidateLeak[]> {
    const candidates: CandidateLeak[] = [];
    const now = new Date();

    for (const invoice of context.invoices) {
      // Ignore canceled, fully paid, or draft invoices
      if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.VOID || invoice.status === InvoiceStatus.DRAFT) {
        continue;
      }

      // Check customer exclusions
      const customer = context.customers.find(c => c.id === invoice.customerId);
      if (customer?.metadata?.billing_exception === true) {
        continue;
      }

      const dueAmount = new Money(invoice.amountDue, invoice.currency);
      const paidAmount = new Money(invoice.amountPaid, invoice.currency);
      const outstanding = dueAmount.subtract(paidAmount);

      if (!outstanding.isPositive()) {
        continue;
      }

      // If due date is in the future, not yet overdue (Section 66 negative test)
      if (invoice.dueAt) {
        const dueDate = new Date(invoice.dueAt);
        if (dueDate > now) {
          continue;
        }
      }

      // Find failed payments linked to this invoice
      const failedPayments = context.payments.filter(
        p => (p.invoiceId === invoice.id || p.customerId === invoice.customerId) && p.status === PaymentStatus.FAILED
      );

      const hasFailedPayment = failedPayments.length > 0;
      const isOpenOrUncollectible = invoice.status === InvoiceStatus.OPEN || invoice.status === InvoiceStatus.UNCOLLECTIBLE;

      if (hasFailedPayment || isOpenOrUncollectible) {
        // Calculate Confidence: Base 85 + 10 if failed payment + 5 if overdue
        let confidenceScore = 85;
        if (hasFailedPayment) confidenceScore += 10;
        if (invoice.dueAt && new Date(invoice.dueAt) < now) confidenceScore += 4;

        // Check if related subscription is active
        const sub = invoice.subscriptionId ? context.subscriptions.find(s => s.id === invoice.subscriptionId) : undefined;
        if (sub && sub.status === SubscriptionStatus.ACTIVE) {
          confidenceScore += 5;
        }
        if (confidenceScore > 99) confidenceScore = 99;

        const confidenceDecimal = (confidenceScore / 100).toFixed(2);
        const monthlyLoss = outstanding.toDecimalString();
        // Overdue invoice is a one-time uncollected recovery, but if recurring subscription, annualize conservatively
        const annualLoss = sub && sub.status === SubscriptionStatus.ACTIVE ? outstanding.multiply(12).toDecimalString() : outstanding.toDecimalString();

        const fingerprint = `pay001_${context.organizationId}_${invoice.customerId}_${invoice.id}_failed_payment`;

        candidates.push({
          detectorId: this.id,
          customerId: invoice.customerId,
          type: this.category,
          severity: outstanding.toCents() > 100000 ? LeakSeverity.CRITICAL : LeakSeverity.HIGH,
          title: `Overdue Payment on Invoice ${invoice.externalId}`,
          summary: `Invoice ${invoice.externalId} for ${outstanding.toFormatted()} is past due with an uncaptured or failed payment status.`,
          estimatedMonthlyLoss: monthlyLoss,
          estimatedAnnualLoss: annualLoss,
          confidence: confidenceDecimal,
          fingerprint,
          evidence: [
            {
              source: 'Invoice',
              sourceRecordId: invoice.id,
              field: 'amountDue vs amountPaid',
              observedValue: { amountDue: invoice.amountDue, amountPaid: invoice.amountPaid, status: invoice.status },
              expectedValue: { amountPaid: invoice.amountDue, status: 'PAID' },
              capturedAt: new Date().toISOString(),
            },
            ...(failedPayments[0]
              ? [
                  {
                    source: 'Payment',
                    sourceRecordId: failedPayments[0].id,
                    field: 'status',
                    observedValue: { status: failedPayments[0].status, failureReason: failedPayments[0].failureReason || 'Declined' },
                    expectedValue: { status: 'SUCCEEDED' },
                    capturedAt: new Date().toISOString(),
                  },
                ]
              : []),
          ],
          recommendation: {
            title: 'Trigger Automated Dunning / Retry Collection',
            description: `Retry the payment method on file or send an updated payment authorization link to collect the overdue ${outstanding.toFormatted()}.`,
            status: 'PENDING',
            generatedBy: 'RULE_ENGINE',
          },
          evidenceSummary: {
            invoiceId: invoice.externalId,
            dueAmount: invoice.amountDue,
            outstandingAmount: outstanding.toDecimalString(),
            dueDate: invoice.dueAt,
            hasFailedPayment,
          },
        });
      }
    }

    return candidates;
  }
}
