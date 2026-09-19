import { db } from '../db/store.ts';
import {
  BillingInterval,
  BillingModel,
  CustomerStatus,
  DiscountStatus,
  IntegrationProvider,
  IntegrationStatus,
  InvoiceStatus,
  PaymentStatus,
  SubscriptionStatus,
  UserRole,
} from '../../types.ts';
import { runDetectorsForOrg } from '../detectors/index.ts';

export async function seedDatabase(): Promise<void> {
  // Clear maps
  db.organizations.clear();
  db.users.clear();
  db.integrations.clear();
  db.customers.clear();
  db.products.clear();
  db.prices.clear();
  db.subscriptions.clear();
  db.invoices.clear();
  db.payments.clear();
  db.discounts.clear();
  db.usageRecords.clear();
  db.leaks.clear();
  db.evidence.clear();
  db.recommendations.clear();
  db.recoveries.clear();
  db.recoveryPayments.clear();
  db.reports.clear();
  db.auditLogs.clear();
  db.webhookEvents.clear();

  const orgId = 'org_acme_corp';

  // 1. PRIMARY ORGANIZATION: Acme Revenue Operations
  db.organizations.set(orgId, {
    id: orgId,
    name: 'Acme Revenue Operations',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    settings: {
      annualRevenue: 12500000,
      companySize: '51-200',
      weeklyAlerts: true,
      recoveryNotifications: true,
      exclusionRules: [],
    },
  });

  // User
  db.users.set('usr_jane_doe', {
    id: 'usr_jane_doe',
    organizationId: orgId,
    email: 'jane@acme.com',
    name: 'Jane Doe',
    role: UserRole.OWNER,
    createdAt: '2026-01-15T00:00:00.000Z',
  });

  // Stripe Integration
  db.integrations.set(`int_stripe_${orgId}`, {
    id: `int_stripe_${orgId}`,
    organizationId: orgId,
    provider: IntegrationProvider.STRIPE,
    status: IntegrationStatus.ACTIVE,
    externalAccountId: 'acct_1MqzStripeProd',
    lastSyncAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    lastSuccessfulSyncAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    createdAt: '2026-01-16T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  });

  // Secondary Tenant: Vortex Global (for testing tenant isolation Section 86)
  const secondaryOrgId = 'org_vortex_global';
  db.organizations.set(secondaryOrgId, {
    id: secondaryOrgId,
    name: 'Vortex Global',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  });
  db.customers.set('cust_vortex_isolated', {
    id: 'cust_vortex_isolated',
    organizationId: secondaryOrgId,
    externalId: 'cus_vortex_secret',
    name: 'Confidential Vortex Client',
    status: CustomerStatus.ACTIVE,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  });

  // 2. PRODUCTS & PRICES FOR ACME
  db.products.set('prod_enterprise_seats', {
    id: 'prod_enterprise_seats',
    organizationId: orgId,
    externalId: 'prod_ent_seat_1',
    name: 'Enterprise Cloud Workspace',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  });

  db.prices.set('price_seat_200', {
    id: 'price_seat_200',
    organizationId: orgId,
    productId: 'prod_enterprise_seats',
    externalId: 'price_seat_200_monthly',
    amount: '200.00',
    currency: 'USD',
    interval: BillingInterval.MONTH,
    intervalCount: 1,
    billingModel: BillingModel.PER_UNIT,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  });

  db.prices.set('price_api_usage', {
    id: 'price_api_usage',
    organizationId: orgId,
    externalId: 'price_api_call_tier',
    amount: '0.01',
    currency: 'USD',
    billingModel: BillingModel.USAGE,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  });

  db.prices.set('price_base_platform', {
    id: 'price_base_platform',
    organizationId: orgId,
    externalId: 'price_base_750',
    amount: '750.00',
    currency: 'USD',
    interval: BillingInterval.MONTH,
    intervalCount: 1,
    billingModel: BillingModel.FLAT,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  });

  db.prices.set('price_pro_1000', {
    id: 'price_pro_1000',
    organizationId: orgId,
    externalId: 'price_pro_1000_monthly',
    amount: '1000.00',
    currency: 'USD',
    interval: BillingInterval.MONTH,
    intervalCount: 1,
    billingModel: BillingModel.FLAT,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  });

  // 3. SYNTHETIC FIXTURES: revenue-leak-fixture-v1 (Sections 60-66)

  // PLANTED LEAK #1: customer_001 (Acme Corp) - BILL-001
  // 31 active seats in subscription, 25 billed in latest invoice, price $200/seat/mo
  // Expected: $1,200/mo, $14,400/yr potential, confidence >= 0.90
  const cust001 = {
    id: 'customer_001',
    organizationId: orgId,
    externalId: 'cus_acme_001',
    name: 'Acme Technologies Inc',
    email: 'billing@acmetech.io',
    status: CustomerStatus.ACTIVE,
    createdAt: '2025-05-10T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };
  db.customers.set(cust001.id, cust001);

  db.subscriptions.set('sub_001_acme', {
    id: 'sub_001_acme',
    organizationId: orgId,
    customerId: cust001.id,
    externalId: 'sub_acme_cloud_31',
    status: SubscriptionStatus.ACTIVE,
    priceId: 'price_seat_200',
    quantity: '31.00',
    currentPeriodStart: '2026-08-01T00:00:00.000Z',
    currentPeriodEnd: '2026-09-01T00:00:00.000Z',
    createdAt: '2025-05-10T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  });

  db.invoices.set('inv_001_acme', {
    id: 'inv_001_acme',
    organizationId: orgId,
    customerId: cust001.id,
    subscriptionId: 'sub_001_acme',
    externalId: 'in_acme_aug_25seats',
    status: InvoiceStatus.PAID,
    amountDue: '5000.00',
    amountPaid: '5000.00',
    currency: 'USD',
    issuedAt: '2026-08-01T00:00:00.000Z',
    paidAt: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    metadata: {
      billedQuantity: 25, // only 25 seats billed!
      isProrated: false,
    },
  });

  // PLANTED LEAK #2: customer_002 (Stark Enterprises) - PAY-001
  // $2,000 invoice OPEN, due 30 days ago, payment FAILED, confidence >= 0.95
  const cust002 = {
    id: 'customer_002',
    organizationId: orgId,
    externalId: 'cus_stark_002',
    name: 'Stark Enterprises',
    email: 'ap@starkenterprises.com',
    status: CustomerStatus.DELINQUENT,
    createdAt: '2025-08-20T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
  };
  db.customers.set(cust002.id, cust002);

  const overdueDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  db.invoices.set('inv_002_stark', {
    id: 'inv_002_stark',
    organizationId: orgId,
    customerId: cust002.id,
    externalId: 'in_stark_overdue_2000',
    status: InvoiceStatus.OPEN,
    amountDue: '2000.00',
    amountPaid: '0.00',
    currency: 'USD',
    issuedAt: overdueDate,
    dueAt: overdueDate,
    createdAt: overdueDate,
    updatedAt: overdueDate,
    metadata: {
      billedQuantity: 10,
    },
  });

  db.payments.set('pay_002_failed', {
    id: 'pay_002_failed',
    organizationId: orgId,
    customerId: cust002.id,
    invoiceId: 'inv_002_stark',
    externalId: 'ch_stark_failed_card',
    amount: '2000.00',
    currency: 'USD',
    status: PaymentStatus.FAILED,
    failureReason: 'card_declined_insufficient_funds',
    paymentDate: overdueDate,
    createdAt: overdueDate,
    updatedAt: overdueDate,
  });

  // PLANTED LEAK #3: customer_003 (Wayne Industries) - PRICE-001
  // 20% discount expired 60 days ago, but subscription still applies coupon, sub $1,000/mo
  // Expected: $200/mo, $2,400/yr, confidence >= 0.95
  const cust003 = {
    id: 'customer_003',
    organizationId: orgId,
    externalId: 'cus_wayne_003',
    name: 'Wayne Industries',
    email: 'finance@waynecorp.com',
    status: CustomerStatus.ACTIVE,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  };
  db.customers.set(cust003.id, cust003);

  const discountExpiredDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  db.discounts.set('disc_003_wayne', {
    id: 'disc_003_wayne',
    organizationId: orgId,
    customerId: cust003.id,
    externalId: 'coupon_vip_20pct',
    percentOff: '20.00',
    startDate: '2025-07-01T00:00:00.000Z',
    endDate: discountExpiredDate,
    status: DiscountStatus.EXPIRED,
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: discountExpiredDate,
  });

  db.subscriptions.set('sub_003_wayne', {
    id: 'sub_003_wayne',
    organizationId: orgId,
    customerId: cust003.id,
    externalId: 'sub_wayne_platform',
    status: SubscriptionStatus.ACTIVE,
    priceId: 'price_pro_1000',
    quantity: '1.00',
    currentPeriodStart: '2026-08-01T00:00:00.000Z',
    currentPeriodEnd: '2026-09-01T00:00:00.000Z',
    createdAt: '2025-07-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  });

  db.invoices.set('inv_003_wayne', {
    id: 'inv_003_wayne',
    organizationId: orgId,
    customerId: cust003.id,
    subscriptionId: 'sub_003_wayne',
    externalId: 'in_wayne_aug_discounted',
    status: InvoiceStatus.PAID,
    amountDue: '800.00', // Still reduced by 20% ($200)
    amountPaid: '800.00',
    currency: 'USD',
    issuedAt: '2026-08-01T00:00:00.000Z',
    paidAt: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    metadata: {
      discountApplied: true,
      discountId: 'disc_003_wayne',
    },
  });

  // PLANTED LEAK #4: customer_004 (Cyberdyne Systems) - INV-001
  // Active monthly subscription $750/mo, historical cadence regular, past expected date by 15 days, missing invoice
  const cust004 = {
    id: 'customer_004',
    organizationId: orgId,
    externalId: 'cus_cyberdyne_004',
    name: 'Cyberdyne Systems',
    email: 'billing@cyberdyne.ai',
    status: CustomerStatus.ACTIVE,
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  };
  db.customers.set(cust004.id, cust004);

  db.subscriptions.set('sub_004_cyberdyne', {
    id: 'sub_004_cyberdyne',
    organizationId: orgId,
    customerId: cust004.id,
    externalId: 'sub_cyberdyne_750',
    status: SubscriptionStatus.ACTIVE,
    priceId: 'price_base_platform',
    quantity: '1.00',
    currentPeriodStart: '2026-07-01T00:00:00.000Z',
    currentPeriodEnd: '2026-08-01T00:00:00.000Z',
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  });

  // Last invoice was 45 days ago, expected next was 15 days ago
  const cyberdyneLastInv = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
  db.invoices.set('inv_004_cyberdyne_prev', {
    id: 'inv_004_cyberdyne_prev',
    organizationId: orgId,
    customerId: cust004.id,
    subscriptionId: 'sub_004_cyberdyne',
    externalId: 'in_cyberdyne_july',
    status: InvoiceStatus.PAID,
    amountDue: '750.00',
    amountPaid: '750.00',
    currency: 'USD',
    issuedAt: cyberdyneLastInv,
    paidAt: cyberdyneLastInv,
    createdAt: cyberdyneLastInv,
    updatedAt: cyberdyneLastInv,
  });

  // PLANTED LEAK #5: customer_005 (Umbrella Corp) - USAGE-001
  // Usage: 10,000 API calls, Billed: 7,000, Price: $0.01/call. Delta = 3,000 * $0.01 = $30
  const cust005 = {
    id: 'customer_005',
    organizationId: orgId,
    externalId: 'cus_umbrella_005',
    name: 'Umbrella Corporation',
    email: 'finance@umbrellacorp.com',
    status: CustomerStatus.ACTIVE,
    createdAt: '2025-09-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
  db.customers.set(cust005.id, cust005);

  db.usageRecords.set('usage_005_api', {
    id: 'usage_005_api',
    organizationId: orgId,
    customerId: cust005.id,
    metric: 'api_calls',
    quantity: '10000.00',
    recordedAt: '2026-08-28T00:00:00.000Z',
    createdAt: '2026-08-28T00:00:00.000Z',
  });

  db.invoices.set('inv_005_umbrella', {
    id: 'inv_005_umbrella',
    organizationId: orgId,
    customerId: cust005.id,
    externalId: 'in_umbrella_aug_usage',
    status: InvoiceStatus.PAID,
    amountDue: '70.00',
    amountPaid: '70.00',
    currency: 'USD',
    issuedAt: '2026-08-01T00:00:00.000Z',
    paidAt: '2026-08-01T00:00:00.000Z',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
    metadata: {
      billedQuantity: 7000, // only 7,000 billed out of 10,000
    },
  });

  // 4. NEGATIVE TEST CASES (Section 66) - Must NOT produce leaks!

  // Negative Case 1: Canceled Subscription (customer_006)
  const cust006 = {
    id: 'customer_006',
    organizationId: orgId,
    externalId: 'cus_canceled_006',
    name: 'Soylent Industries (Canceled)',
    status: CustomerStatus.CHURNED,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
  db.customers.set(cust006.id, cust006);
  db.subscriptions.set('sub_006_canceled', {
    id: 'sub_006_canceled',
    organizationId: orgId,
    customerId: cust006.id,
    externalId: 'sub_canceled_qty50',
    status: SubscriptionStatus.CANCELED,
    quantity: '50.00',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  });

  // Negative Case 2: Fully Paid Invoice (customer_007)
  const cust007 = {
    id: 'customer_007',
    organizationId: orgId,
    externalId: 'cus_paid_007',
    name: 'Hooli Inc (Paid Cleanly)',
    status: CustomerStatus.ACTIVE,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
  db.customers.set(cust007.id, cust007);
  db.invoices.set('inv_007_paid', {
    id: 'inv_007_paid',
    organizationId: orgId,
    customerId: cust007.id,
    externalId: 'in_hooli_paid_full',
    status: InvoiceStatus.PAID,
    amountDue: '1000.00',
    amountPaid: '1000.00',
    currency: 'USD',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  });

  // Negative Case 3: Future Invoice (customer_008)
  const cust008 = {
    id: 'customer_008',
    organizationId: orgId,
    externalId: 'cus_future_008',
    name: 'Initech (Upcoming Invoice)',
    status: CustomerStatus.ACTIVE,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
  db.customers.set(cust008.id, cust008);
  const futureDue = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
  db.invoices.set('inv_008_future', {
    id: 'inv_008_future',
    organizationId: orgId,
    customerId: cust008.id,
    externalId: 'in_initech_future_due',
    status: InvoiceStatus.OPEN,
    amountDue: '500.00',
    amountPaid: '0.00',
    currency: 'USD',
    dueAt: futureDue,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  });

  // Negative Case 4: Intentional Free/Partner Account (customer_009)
  const cust009 = {
    id: 'customer_009',
    organizationId: orgId,
    externalId: 'cus_partner_009',
    name: 'Global Ventures (Complimentary Partner)',
    status: CustomerStatus.ACTIVE,
    metadata: {
      billing_exception: true, // explicitly exempt
    },
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  };
  db.customers.set(cust009.id, cust009);
  db.subscriptions.set('sub_009_partner', {
    id: 'sub_009_partner',
    organizationId: orgId,
    customerId: cust009.id,
    externalId: 'sub_partner_comp',
    status: SubscriptionStatus.ACTIVE,
    quantity: '100.00',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  });

  // Run the detection suite to populate the initial findings!
  await runDetectorsForOrg(orgId);

  // Now, create an existing VERIFIED recovery with recorded payments & 10% fee
  // to showcase the Recovery Ledger, Attribution timeline, and Fee explanation (Sections 12-14, 72-74)
  const verifiedCust = {
    id: 'customer_rec_01',
    organizationId: orgId,
    externalId: 'cus_globex_rec',
    name: 'Globex Corporation',
    email: 'treasury@globex.org',
    status: CustomerStatus.ACTIVE,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };
  db.customers.set(verifiedCust.id, verifiedCust);

  const globexLeak = {
    id: 'leak_globex_recovered',
    organizationId: orgId,
    customerId: verifiedCust.id,
    detectorId: 'BILL-001',
    type: db.leaks.get('leak_001')?.type || (('BILLING_MISMATCH' as unknown) as any),
    severity: db.leaks.get('leak_001')?.severity || (('HIGH' as unknown) as any),
    status: ('RECOVERING' as unknown) as any,
    estimatedMonthlyLoss: '1200.00',
    estimatedAnnualLoss: '14400.00',
    confidence: '0.96',
    title: '6 Unbilled Seats on Subscription sub_globex_ent',
    summary: 'Globex Corporation had 31 active seats while subscription invoiced for 25. Customer verified the finding and adjusted Stripe billing quantity.',
    fingerprint: `bill001_${orgId}_${verifiedCust.id}_globex_qty`,
    detectedAt: '2026-06-01T00:00:00.000Z',
    verifiedAt: '2026-06-03T00:00:00.000Z',
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  };
  db.leaks.set(globexLeak.id, globexLeak);

  const globexRecovery = {
    id: 'rec_globex_01',
    organizationId: orgId,
    leakId: globexLeak.id,
    customerId: verifiedCust.id,
    potentialAmount: '14400.00',
    verifiedAmount: '14400.00',
    actualAmount: '2400.00', // $1,200 * 2 payments collected
    currency: 'USD',
    recoveryStart: '2026-06-05T00:00:00.000Z',
    recoveryEnd: '2027-06-04T00:00:00.000Z',
    status: ('RECOVERING' as unknown) as any,
    verifiedAt: '2026-06-03T00:00:00.000Z',
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  };
  db.recoveries.set(globexRecovery.id, globexRecovery);

  // First recovery payment: Month 1
  db.recoveryPayments.set('pay_rec_01_m1', {
    id: 'pay_rec_01_m1',
    organizationId: orgId,
    recoveryId: globexRecovery.id,
    externalPaymentId: 'pi_globex_july_rec',
    amount: '1200.00',
    currency: 'USD',
    paymentDate: '2026-07-01T00:00:00.000Z',
    source: 'STRIPE',
    attributableAmount: '1200.00',
    feeAmount: '120.00', // 10% fee
    createdAt: '2026-07-01T00:00:00.000Z',
  });

  // Second recovery payment: Month 2
  db.recoveryPayments.set('pay_rec_01_m2', {
    id: 'pay_rec_01_m2',
    organizationId: orgId,
    recoveryId: globexRecovery.id,
    externalPaymentId: 'pi_globex_aug_rec',
    amount: '1200.00',
    currency: 'USD',
    paymentDate: '2026-08-01T00:00:00.000Z',
    source: 'STRIPE',
    attributableAmount: '1200.00',
    feeAmount: '120.00', // 10% fee
    createdAt: '2026-08-01T00:00:00.000Z',
  });

  // Audit record for initial verification
  db.logAudit(
    orgId,
    'OPPORTUNITY_VERIFIED',
    'Leak',
    globexLeak.id,
    { status: 'DETECTED' },
    { status: 'VERIFIED', verifiedAmount: '14400.00' },
    { notes: 'Confirmed 31 seats with sales engineering director.' },
    'usr_jane_doe'
  );

  // Generate an initial Monthly Report (Section 23 & 105)
  db.reports.set('rep_2026_08', {
    id: 'rep_2026_08',
    organizationId: orgId,
    periodStart: '2026-08-01T00:00:00.000Z',
    periodEnd: '2026-08-31T23:59:59.000Z',
    identifiedAmount: '33230.00',
    verifiedAmount: '14400.00',
    recoveredAmount: '2400.00',
    feeAmount: '240.00',
    netBenefit: '2160.00',
    findingsCount: 5,
    verifiedCount: 1,
    recoveredCount: 1,
    generatedAt: '2026-09-01T00:00:00.000Z',
  });
}
