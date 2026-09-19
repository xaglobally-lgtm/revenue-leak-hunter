# Revenue Leak Hunter (RLH) — System Documentation & User Manual

Welcome to **Revenue Leak Hunter (RLH)**. This document provides complete operational guidance for understanding, operating, and downloading the codebase and financial reports.

---

## Table of Contents
1. [How to Download the Application Files](#1-how-to-download-the-application-files)
2. [Executive Overview: What It Does](#2-executive-overview-what-it-does)
3. [How to Use the Application (Step-by-Step)](#3-how-to-use-the-application-step-by-step)
4. [Guide A: The Plain-English (Layman's) Guide](#4-guide-a-the-plain-english-laymans-guide)
5. [Guide B: The Finance & RevOps Professional Guide](#5-guide-b-the-finance--revops-professional-guide)
6. [Detection Engine Specifications & Rule Reference](#6-detection-engine-specifications--rule-reference)
7. [API & Export Reference](#7-api--export-reference)

---

## 1. How to Download the Application Files

### Option 1: Export Complete Codebase via AI Studio (ZIP or GitHub)
1. In the upper-right corner of the **Google AI Studio** window, click the **Settings / Menu icon** (or the project actions dropdown).
2. Select **"Export to GitHub"** to push the entire repository to your GitHub account, or **"Download ZIP"** to download the entire source tree directly to your computer.
3. The downloaded project contains all frontend React components, backend Express and detector services, test suites, database schemas, and documentation.

### Option 2: Download Audit Reports & Financial Data (In-App)
1. Open the **Reports** tab in the navigation sidebar.
2. Click the **Download** button on any monthly or weekly audit report to download a CSV file of all detected discrepancies, verified amounts, recovered cash, and 10% contingency fee breakdowns.
3. You can also print or export official PDF summaries via the **"Print Statement"** button in any report preview.

---

## 2. Executive Overview: What It Does

**Revenue Leak Hunter (RLH)** is a continuous financial intelligence platform built for SaaS and recurring-revenue businesses. It connects directly to billing providers (like Stripe) and operational databases to identify discrepancies between what customers consume and what they are actually invoiced.

### Core Capabilities:
- **Autonomous Detection**: Continuously monitors billing feeds, usage records, contracts, and subscription lifecycles to surface unbilled revenue.
- **Auditable Evidence (Proof)**: Provides deterministic line-item calculations (observed vs. invoiced) with zero floating-point arithmetic drift.
- **Verification Workflow**: Gives finance and account teams tools to review, confirm, reject with reason codes, or suppress false positives.
- **Attributable Recovery Ledger**: Tracks cash actually collected after discrepancy resolution over a 12-month attribution window.
- **Contingency Fee Model**: Transparently calculates a 10% performance-based fee only on verified, collected revenue.

---

## 3. How to Use the Application (Step-by-Step)

### Step 1: Scan & Ingest
- When you open the dashboard, the system displays your connected Stripe organization (`Acme Technologies`).
- Click **"Sync Data"** in the top navigation bar or **"Run Engine Scan"** in the Opportunities tab. The 5 deterministic rule engines will scan active subscriptions, invoices, coupons, and usage records.

### Step 2: Review Findings in the Opportunities Tab
- Navigate to **"Opportunities"** in the sidebar.
- Filter candidate leaks by category (**Billing Quantity**, **Failed Payment**, **Expired Discount**, **Missing Invoice**, **Metered Usage**) or severity (**Critical**, **High**, **Medium**).
- Click **"Inspect Evidence"** on any finding to view:
  - The mathematical formula showing observed vs. billed units.
  - Collapsible source evidence records (exact Stripe subscription IDs, invoice numbers, price IDs).
  - Prescriptive remediation steps for your billing operations team.

### Step 3: Verify or Dismiss Opportunities
- **To Verify**: Click **"Verify Discrepancy"**. Confirm the authorization checkbox and enter any audit notes. This promotes the finding to a **Verified Recovery**, automatically establishing a 12-month attribution window in your recovery ledger.
- **To Reject**: Click **"Reject"** and select a structured reason code (e.g., `CONTRACTUAL_EXCEPTION`, `INTENTIONAL_PROMOTION`, `DATA_ERROR`) with notes to train and calibrate detection thresholds.
- **To Suppress**: Click **"Dismiss / Suppress"** to mute this rule for this customer if it represents an approved custom commercial agreement.

### Step 4: Track Recovered Cash in Recoveries
- Navigate to **"Recoveries"**.
- View your active recovery cohort, including:
  - **Verified Target**: The total annualized discrepancy agreed upon.
  - **Actual Collected**: Incremental cash collected from subsequent invoices.
  - **RLH Contingency Fee (10%)**: Exactly 10% of the newly collected revenue.
  - **Net Financial Benefit**: The 90% revenue retained directly by your business.
- Click **"Record Payment"** to log new Stripe charges or payments collected against the resolution.

### Step 5: Export Reports & Audit Digests
- Open **"Reports"** to view monthly statements and weekly executive digests.
- Click the download icon to save a CSV audit file, or click **"View Report"** to view a formal breakdown ready for executive presentation or printing.

### Step 6: Verify Multi-Tenant Security & Test Suite
- Use the **Tenant Switcher** in the top header to toggle between `Acme Technologies` and `Vortex Global (Isolated Tenant)`. Notice that customer data and leakage findings are strictly isolated—cross-tenant data access returns a secure 404.
- Open **"Synthetic Tests"** in the sidebar to run the automated validation suite testing all 5 detectors, 5 negative false-positive guard tests, and Decimal minor-unit precision.

---

## 4. Guide A: The Plain-English (Layman's) Guide

### "Why do companies lose money without knowing it?"
Imagine you run a gym or a digital subscription club. 
- A customer signs up for 5 family members, but 6 months later they have 11 people using the club while your front-desk computer is still only billing them for 5.
- Another member's credit card expired, but their account wasn't flagged, so they keep using your service for free month after month.
- A holiday promotion gave a company a 20% discount for 3 months, but when the 3 months ended, nobody flipped the switch to turn the discount off, so they continue getting 20% off forever.
- A client uses 10,000 text messages through your system, but your monthly billing system only generated a bill for 7,000.

In the software industry, this is called **"Revenue Leakage"**. It is not fraud; it is simply what happens when computer systems, user accounts, and billing tools fall out of sync as a company grows.

### What Revenue Leak Hunter Does
Revenue Leak Hunter is like a **diligent digital accountant** that works 24/7 in the background:
1. **It looks at what your customers are actually using** (how many team members logged into your software, how many API calls were sent, what their contracts say).
2. **It compares that against what was actually invoiced in Stripe**.
3. **If there is a mismatch where you did not bill for something**, it flags it as an **"Opportunity"** and shows you the exact math.
4. **It tells your team how to fix it** (for example: "Update Acme's subscription from 25 seats to 31 seats in Stripe").
5. **It keeps track of the recovered money** as the customer pays their new, correct bills over the next year.
6. **Performance Fee**: Revenue Leak Hunter only takes a 10% fee if you actually recover the money. If a finding turns out to be an approved exception, you click "Reject" and pay $0.

---

## 5. Guide B: The Finance & RevOps Professional Guide

### 1. Reconciliation Architecture
Revenue Leak Hunter acts as a continuous automated revenue assurance layer operating between your **Product Usage Logs / Provisioning Layer** and your **Billing & Invoicing Engine (Stripe / ERP)**.

```
┌─────────────────────────┐         ┌───────────────────────────┐
│ Product Usage & Seats   │         │  Stripe / Billing Engine  │
│ (Active Directory/DB)   │         │  (Subs, Invoices, Prices) │
└────────────┬────────────┘         └─────────────┬─────────────┘
             │                                    │
             └───────────────► ┌───────┐ ◄────────┘
                               │  RLH  │
                               └───┬───┘
                                   ▼
             ┌──────────────────────────────────────────┐
             │  Deterministic Rule Engines & Evidence   │
             │  • Minor-unit Decimal precision (10%)    │
             │  • Fingerprinted idempotency deduplication│
             │  • 12-Month Attribution Window Tracking  │
             └──────────────────────────────────────────┘
```

### 2. Strict Arithmetic & Minor-Unit Math
To prevent rounding errors and financial discrepancies:
- All monetary amounts are stored and calculated using integer minor units (cents) or fixed-point representations.
- Floating-point calculations are strictly prohibited in the core engine.
- Contingency fee liability is evaluated as:
  $$\text{Fee} = \text{floor}\left(\frac{\text{Recovered Amount} \times 10}{100}\right)$$
  - Example: A recovered invoice payment of $\$1,200.00$ attributes an exact $\$120.00$ fee liability, leaving $\$1,080.00$ in net retained operating cash.

### 3. Verification & Governance Lifecycle
Every identified leak adheres to a strict state machine:
```
[ DETECTED ] ──► [ VERIFIED ] ──► [ RECOVERING ] ──► [ RECOVERED ]
      │
      ├──► [ REJECTED ] (Captures Reason: CONTRACTUAL_EXCEPTION, PROMOTION, DATA_ERROR)
      │
      └──► [ SUPPRESSED ] (Permanent rule mute for specific customer account)
```
- **Attribution Period**: Promoted verified leaks instantiate a 365-day attribution window starting on the verification date (`recoveryStart` to `recoveryEnd`).
- **Idempotency**: Webhook events from Stripe are tracked via `externalEventId` in `memoryStore.ts`, preventing duplicate processing of retry webhooks.
- **Multi-Tenant Scoping**: All database queries require tenant identification (`orgId`), enforcing physical row isolation between client organizations.

---

## 6. Detection Engine Specifications & Rule Reference

| Detector ID | Name | Category | Logic & Trigger Conditions |
| :--- | :--- | :--- | :--- |
| **PAY-001** | Failed Recurring Payment | Collections & Dunning | Overdue invoice with payment failure status or past due date exceeding 3-day grace period. |
| **BILL-001** | Subscription Quantity Discrepancy | Seat Underbilling | Active provisioned users/seats in product database exceed `quantity` on active Stripe subscription. |
| **PRICE-001** | Expired Promotional Discount | Pricing Integrity | Invoice applied a discount/coupon code whose `endDate` is prior to invoice issuance date. |
| **INV-001** | Missing Invoice Cadence | Billing Cadence | Active subscription with regular monthly cycle has no generated invoice $\ge 15$ days past period renewal. |
| **USAGE-001** | Unbilled Metered Usage | Metered Invoicing | Sum of recorded meter events in billing cycle exceeds `billedQuantity` on corresponding usage invoice line. |

---

## 7. API & Export Reference

All endpoints accept and return JSON. Authenticate via session or `x-organization-id` header:

- `GET /api/health` — System status and health check.
- `GET /api/v1/dashboard` — Six top-level financial metrics and prioritized opportunities.
- `GET /api/v1/opportunities` — Full candidate leak inventory with filter parameters (`?type=...&severity=...`).
- `POST /api/v1/opportunities/:id/verify` — Verify leak and initiate 12-month recovery ledger.
- `POST /api/v1/opportunities/:id/reject` — Reject with audit reason and feedback notes.
- `POST /api/v1/opportunities/:id/suppress` — Suppress detector rule for customer.
- `GET /api/v1/recoveries` — Active recovery records, collections to date, and fee liabilities.
- `POST /api/v1/recoveries/:id/payment` — Record incremental collected invoice payment.
- `GET /api/v1/customers` — Customer revenue profiles and risk indicators.
- `POST /api/v1/scan/run` — Run complete synchronous detector scan across the organization.
- `POST /api/v1/test-suite/run` — Run synthetic test harness verifying all detectors, negative cases, and multi-tenant security.
