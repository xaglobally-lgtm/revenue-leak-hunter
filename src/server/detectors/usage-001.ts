import { CandidateLeak, DetectionContext, Detector } from './base.ts';
import { BillingModel, LeakSeverity, LeakType } from '../../types.ts';
import { Money } from '../lib/money.ts';

export class Usage001Detector implements Detector {
  readonly id = 'USAGE-001';
  readonly name = 'Usage Exceeds Billed Quantity';
  readonly category = LeakType.USAGE_MISMATCH;
  readonly requiredData = ['usageRecords', 'invoices', 'prices', 'customers'];

  async detect(context: DetectionContext): Promise<CandidateLeak[]> {
    const candidates: CandidateLeak[] = [];

    // Group usage records by customer and metric
    const customerUsageMap = new Map<string, Map<string, number>>();

    for (const record of context.usageRecords) {
      if (!customerUsageMap.has(record.customerId)) {
        customerUsageMap.set(record.customerId, new Map());
      }
      const metricMap = customerUsageMap.get(record.customerId)!;
      const current = metricMap.get(record.metric) || 0;
      metricMap.set(record.metric, current + parseFloat(record.quantity || '0'));
    }

    for (const [customerId, metricMap] of customerUsageMap.entries()) {
      const customer = context.customers.find(c => c.id === customerId);
      if (customer?.metadata?.billing_exception === true) continue;

      for (const [metric, totalUsage] of metricMap.entries()) {
        // Find latest invoice billed quantity for this customer / metric
        const invoices = context.invoices
          .filter(inv => inv.customerId === customerId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const latestInvoice = invoices[0];
        const billedUsage = latestInvoice?.metadata?.billedQuantity !== undefined
          ? Number(latestInvoice.metadata.billedQuantity)
          : 0;

        // Section 66 negative test: if usage <= billed, no leak
        if (totalUsage <= billedUsage) {
          continue;
        }

        const unbilledUnits = totalUsage - billedUsage;
        if (unbilledUnits <= 0) continue;

        // Find pricing model for this metric (prefer BillingModel.USAGE over seat PER_UNIT)
        const price = context.prices.find(p => p.billingModel === BillingModel.USAGE) ||
          context.prices.find(p => p.billingModel === BillingModel.PER_UNIT);

        // Section 98: if price is missing, do not fabricate price or guess!
        if (!price || !price.amount) {
          continue;
        }

        const unitPriceNum = parseFloat(price.amount);
        if (isNaN(unitPriceNum) || unitPriceNum <= 0) continue;

        const currency = price.currency || 'USD';
        const impactMoney = new Money(unbilledUnits * unitPriceNum, currency);
        const annualLoss = impactMoney.multiply(12);

        // Confidence: Base 70 + direct comparison 10 + known unit price 8 = 88
        let confidenceScore = 70 + 10 + 8;
        if (confidenceScore > 95) confidenceScore = 95;
        const confidenceDecimal = (confidenceScore / 100).toFixed(2);

        const fingerprint = `usage001_${context.organizationId}_${customerId}_${metric}_unbilled_units`;

        candidates.push({
          detectorId: this.id,
          customerId,
          type: this.category,
          severity: annualLoss.toCents() > 100000 ? LeakSeverity.HIGH : LeakSeverity.MEDIUM,
          title: `Unbilled ${metric.toUpperCase()} Usage Exceeds Invoiced Quantity`,
          summary: `Recorded ${totalUsage.toLocaleString()} ${metric} units during current billing cycle, but only ${billedUsage.toLocaleString()} units were invoiced, leaving ${unbilledUnits.toLocaleString()} unbilled.`,
          estimatedMonthlyLoss: impactMoney.toDecimalString(),
          estimatedAnnualLoss: annualLoss.toDecimalString(),
          confidence: confidenceDecimal,
          fingerprint,
          evidence: [
            {
              source: 'UsageRecord',
              sourceRecordId: `usage_${customerId}_${metric}`,
              field: 'quantity',
              observedValue: { observedUsage: totalUsage, metric },
              expectedValue: { billedUsage: totalUsage },
              capturedAt: new Date().toISOString(),
            },
            {
              source: 'Invoice',
              sourceRecordId: latestInvoice?.id || 'inv_recent',
              field: 'billedQuantity',
              observedValue: { billedUsage },
              expectedValue: { billedUsage: totalUsage },
              capturedAt: new Date().toISOString(),
            },
            {
              source: 'Price',
              sourceRecordId: price.id,
              field: 'amount',
              observedValue: { unitPrice: price.amount, metric },
              expectedValue: { unitPrice: price.amount },
              capturedAt: new Date().toISOString(),
            },
          ],
          recommendation: {
            title: `Sync Metered Overage to Stripe Billing Engine`,
            description: `Transmit unbilled overage of ${unbilledUnits.toLocaleString()} ${metric} units (${impactMoney.toFormatted()}) to Stripe usage records to be billed on the next invoice.`,
            status: 'PENDING',
            generatedBy: 'RULE_ENGINE',
          },
          evidenceSummary: {
            metric,
            recordedUsage: totalUsage,
            billedUsage,
            unbilledDelta: unbilledUnits,
            unitRate: price.amount,
            monthlyLoss: impactMoney.toDecimalString(),
          },
        });
      }
    }

    return candidates;
  }
}
