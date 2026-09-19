import {
  Customer,
  Subscription,
  Invoice,
  Payment,
  Discount,
  UsageRecord,
  Price,
  LeakType,
  LeakSeverity,
  EvidenceItem,
  RecommendationItem,
} from '../../types.ts';

export interface DetectionContext {
  organizationId: string;
  customers: Customer[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  payments: Payment[];
  discounts: Discount[];
  usageRecords: UsageRecord[];
  prices: Price[];
  exclusions?: string[]; // suppressed rule patterns
}

export interface CandidateLeak {
  detectorId: string;
  customerId: string;
  type: LeakType;
  severity: LeakSeverity;
  title: string;
  summary: string;
  estimatedMonthlyLoss: string;
  estimatedAnnualLoss: string;
  confidence: string; // 0.00 to 0.99
  fingerprint: string;
  evidence: Omit<EvidenceItem, 'id' | 'leakId' | 'organizationId' | 'createdAt'>[];
  recommendation: Omit<RecommendationItem, 'id' | 'leakId' | 'organizationId' | 'createdAt' | 'updatedAt'>;
  evidenceSummary: Record<string, unknown>;
}

export interface Detector {
  readonly id: string;
  readonly name: string;
  readonly category: LeakType;
  readonly requiredData: string[];

  detect(context: DetectionContext): Promise<CandidateLeak[]>;
}
