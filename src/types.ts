/**
 * Revenue Leak Hunter - Core Types and Schema
 * Build Packet v1.1 & v1.2 Compliant
 */

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  settings?: {
    annualRevenue?: number;
    companySize?: string;
    exclusionRules?: string[];
    weeklyAlerts?: boolean;
    recoveryNotifications?: boolean;
  };
}

export enum IntegrationProvider {
  STRIPE = 'STRIPE',
}

export enum IntegrationStatus {
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR',
  DISCONNECTED = 'DISCONNECTED',
  REAUTH_REQUIRED = 'REAUTH_REQUIRED',
}

export interface Integration {
  id: string;
  organizationId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  externalAccountId?: string;
  lastSyncAt?: string;
  lastSuccessfulSyncAt?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELINQUENT = 'DELINQUENT',
  CHURNED = 'CHURNED',
  UNKNOWN = 'UNKNOWN',
}

export interface Customer {
  id: string;
  organizationId: string;
  externalId: string;
  name: string;
  email?: string;
  status: CustomerStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  organizationId: string;
  externalId: string;
  name: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export enum BillingInterval {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  ONE_TIME = 'ONE_TIME',
}

export enum BillingModel {
  FLAT = 'FLAT',
  PER_UNIT = 'PER_UNIT',
  TIERED = 'TIERED',
  USAGE = 'USAGE',
  UNKNOWN = 'UNKNOWN',
}

export interface Price {
  id: string;
  organizationId: string;
  productId?: string;
  externalId: string;
  amount: string; // Decimal string representation e.g. "200.00"
  currency: string;
  interval?: BillingInterval;
  intervalCount?: number;
  billingModel: BillingModel;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  UNPAID = 'UNPAID',
  INCOMPLETE = 'INCOMPLETE',
  INCOMPLETE_EXPIRED = 'INCOMPLETE_EXPIRED',
  PAUSED = 'PAUSED',
  UNKNOWN = 'UNKNOWN',
}

export interface Subscription {
  id: string;
  organizationId: string;
  customerId: string;
  externalId: string;
  status: SubscriptionStatus;
  priceId?: string;
  quantity?: string; // Decimal representation e.g. "25.00"
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAt?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  PAID = 'PAID',
  VOID = 'VOID',
  UNCOLLECTIBLE = 'UNCOLLECTIBLE',
  UNKNOWN = 'UNKNOWN',
}

export interface Invoice {
  id: string;
  organizationId: string;
  customerId: string;
  subscriptionId?: string;
  externalId: string;
  status: InvoiceStatus;
  amountDue: string; // Decimal string
  amountPaid: string; // Decimal string
  currency: string;
  issuedAt?: string;
  dueAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    billedQuantity?: number;
    discountApplied?: boolean;
    discountId?: string;
    isProrated?: boolean;
    [key: string]: unknown;
  };
}

export enum PaymentStatus {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  CANCELED = 'CANCELED',
  UNKNOWN = 'UNKNOWN',
}

export interface Payment {
  id: string;
  organizationId: string;
  customerId: string;
  invoiceId?: string;
  externalId: string;
  amount: string; // Decimal string
  currency: string;
  status: PaymentStatus;
  paymentDate?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface UsageRecord {
  id: string;
  organizationId: string;
  customerId: string;
  externalId?: string;
  metric: string;
  quantity: string; // Decimal string
  recordedAt: string;
  periodStart?: string;
  periodEnd?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export enum DiscountStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REDEEMED = 'REDEEMED',
  CANCELED = 'CANCELED',
  UNKNOWN = 'UNKNOWN',
}

export interface Discount {
  id: string;
  organizationId: string;
  customerId?: string;
  externalId?: string;
  percentOff?: string;
  amountOff?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
  status: DiscountStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export enum LeakType {
  FAILED_PAYMENT = 'FAILED_PAYMENT',
  BILLING_MISMATCH = 'BILLING_MISMATCH',
  EXPIRED_DISCOUNT = 'EXPIRED_DISCOUNT',
  MISSING_INVOICE = 'MISSING_INVOICE',
  USAGE_MISMATCH = 'USAGE_MISMATCH',
}

export enum LeakSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum LeakStatus {
  DETECTED = 'DETECTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  INVESTIGATING = 'INVESTIGATING',
  ACTIONED = 'ACTIONED',
  RECOVERING = 'RECOVERING',
  RECOVERED = 'RECOVERED',
  CLOSED = 'CLOSED',
  SUPPRESSED = 'SUPPRESSED',
}

export interface EvidenceItem {
  id: string;
  organizationId: string;
  leakId: string;
  source: string;
  sourceRecordId: string;
  field: string;
  observedValue?: unknown;
  expectedValue?: unknown;
  capturedAt: string;
  createdAt: string;
}

export interface RecommendationItem {
  id: string;
  organizationId: string;
  leakId: string;
  title: string;
  description: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  generatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Leak {
  id: string;
  organizationId: string;
  customerId: string;
  detectorId: string;
  type: LeakType;
  severity: LeakSeverity;
  status: LeakStatus;
  estimatedMonthlyLoss: string; // Decimal string
  estimatedAnnualLoss: string; // Decimal string
  confidence: string; // Decimal string between 0.00 and 0.99
  title: string;
  summary?: string;
  recommendation?: string;
  evidenceSummary?: Record<string, unknown>;
  fingerprint: string;
  detectedAt: string;
  verifiedAt?: string;
  rejectedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Joined fields for UI convenience
  customer?: Customer;
  evidence?: EvidenceItem[];
  recommendations?: RecommendationItem[];
  recovery?: Recovery;
}

export enum RecoveryStatus {
  POTENTIAL = 'POTENTIAL',
  VERIFIED = 'VERIFIED',
  ACTIONED = 'ACTIONED',
  RECOVERING = 'RECOVERING',
  RECOVERED = 'RECOVERED',
  DISPUTED = 'DISPUTED',
  CLOSED = 'CLOSED',
}

export interface RecoveryPayment {
  id: string;
  organizationId: string;
  recoveryId: string;
  externalPaymentId?: string;
  amount: string; // Decimal string
  currency: string;
  paymentDate: string;
  source: string;
  attributableAmount: string; // Decimal string
  feeAmount: string; // Decimal string (10% of attributableAmount)
  createdAt: string;
}

export interface Recovery {
  id: string;
  organizationId: string;
  leakId: string;
  customerId: string;
  potentialAmount: string;
  verifiedAmount: string;
  actualAmount: string;
  currency: string;
  recoveryStart?: string;
  recoveryEnd?: string;
  status: RecoveryStatus;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  payments?: RecoveryPayment[];
  customer?: Customer;
  leak?: Leak;
}

export interface Report {
  id: string;
  organizationId: string;
  periodStart: string;
  periodEnd: string;
  identifiedAmount: string;
  verifiedAmount: string;
  recoveredAmount: string;
  feeAmount: string;
  netBenefit: string;
  findingsCount: number;
  verifiedCount: number;
  recoveredCount: number;
  generatedAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  organizationId: string;
  provider: string;
  externalEventId: string;
  eventType: string;
  payload: Record<string, unknown>;
  processed: boolean;
  processedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface DashboardOverview {
  potentialRecovery: {
    amount: string;
    currency: string;
    annualized: string;
    monthly: string;
    count: number;
  };
  verifiedRecovery: {
    amount: string;
    currency: string;
    count: number;
  };
  actualRecovery: {
    amount: string;
    currency: string;
    count: number;
  };
  revenueAtRisk: {
    amount: string;
    currency: string;
    count: number;
  };
  rlhFees: {
    amount: string;
    rate: string; // "10%"
    currency: string;
  };
  netBenefit: {
    amount: string;
    currency: string;
  };
  topOpportunities: Leak[];
  recentRecoveries: (RecoveryPayment & { customerName: string; leakTitle: string })[];
}
