# SPECIFICATIONS.md — Build Packet (Requirements Spec Summary)

Companion to `DOCUMENTATION.md` (user manual) and `SALES_PACKET.md` (commercial).
This file records **what the product is required to do**, in the order buyers experience it.

## Product definition

Revenue Leak Hunter is a **service machine**: it operates the economic capability of
revenue-leak detection and recovery for client businesses. It is not sold as software;
it is sold as an outcome. The only revenue model is a **10% contingency fee** on
attributable cash actually recovered (12-month window, no setup fee, no subscription).

## Functional specification

### A. Public surface (buyer-facing)
1. **Landing page** — problem statement, three commitments (Find → Prove → Recover),
   contingency pricing, FAQ (4 questions), Privacy Policy, Terms of Service, About/Contact.
2. **Free guided scan** — 4-step funnel: intro → company facts → live animated scan →
   results with 3 top findings (detector id, potential amount, confidence).
3. **Contact/feedback form** — references a real endpoint; messages are stored server-side.
4. **Authentication** — *currently a single-owner demo session.* Real auth (email magic
   link via Supabase Auth) is a remaining production item.

### B. Core product surface (client-facing)
5. **Dashboard** — 4 live cards: Potential Annual Leak, Verified Recovery, Actual
   Recovered Cash, Net Retained (after 10% fee). Two panels: top opportunities, recovery leaderboard.
6. **Opportunities pipeline** — filters (status/detector/search), pagination, detail modal
   (evidence, recommendations), actions: **Verify / Reject / Suppress**.
7. **Recoveries ledger** — recovery list + summary (verified/recovered/fee/net), detail
   with fee explanation, **Record Payment** flow (amount, currency, external id, date)
   with automatic 10% fee preview.
8. **Customers** — metrics per customer (potential/verified/recovered, risk), detail modal
   with tenant-isolated records (404 for cross-tenant access).
9. **Reports** — generate monthly audit statement from live data; 4-stat executive summary,
   fee attribution statement; CSV export; print.
10. **Integration console** — Stripe restricted-key test, manual sync, seat telemetry sync,
    alert webhook test, webhook URL display.
11. **Settings & audit** — org info, users, recent audit log, 10% fee policy statement.

### C. Detection engine (deterministic financial logic)
12. Five detectors, each producing evidence-backed, reproducible findings:
    - `PAY-001` failed/un-captured recurring payments (#payments with failed status)
    - `BILL-001` seat quantity = active users vs invoiced quantity × unit price
    - `PRICE-001` expired promo coupons still deducting `percentOff` from invoices
    - `INV-001` missing invoice cadence (expected interval vs issued dates, grace period)
    - `USAGE-001` unbilled metered usage (recorded usage vs billed quantity)
13. Negative tests: canceled subtotal; fully-paid invoices; contract partner tiers;
    future invoices; floating-point-safe fee math. **All 5/5 pass.**
14. Webhook receiver is idempotent/deduplicated; sync and detectors are per-tenant.

### D. Cross-cutting requirements
15. **Tenant isolation** — every request scoped to `x-organization-id`; leaks/recoveries/
    customers/audit are org-filtered; cross-tenant detail access returns 404.
16. **i18n** — 11 locales (en, th, vi, id, ar, es, zh, ko, ja, de, fr); RTL for Arabic;
    persisted in localStorage.
17. **Currencies** — 12 currencies with conversion display rates; persisted; applies to all
    money renderings via a single `formatMoney` helper.
18. **Appearance/USP** — light/dark theme, zero outer scroll (inner panels scroll),
    resizable sidebar, daily-tools vs admin menu separation, guided next-touch workflow bar.
19. **Online/offline** indicator; offline-state handling.
20. **Error logging & analytics** — client errors and funnel events POST to
    `/api/v1/analytics/event`, stored in the audit log (no external dependency).
21. **Automated verification** — `/api/v1/test-suite/run` runs 124 checks: planted leaks,
    negative cases, tenant isolation, fee arithmetic, webhook dedup. All pass.

## API contract (v1)

All responses `{ data: ... }` (success) or `{ error: { code, message } }`. All scoped by
`x-organization-id`. Paths: `/me`, `/switch-tenant`, `/integrations`, `/integrations/stripe/
(connect|sync|test-key)`, `/webhooks/stripe`, `/dashboard`, `/opportunities(+/:id/verify|
reject|suppress)`, `/recoveries(+/:id/payment)`, `/customers(+/:id)`, `/reports`,
`/reports/monthly/generate`, `/settings`, `/scan`, `/scan/run`, `/test-suite/run`,
`/telemetry/seats/sync`, `/alerts/test`, `/contact`, `/analytics/event`,
`/system/reset-demo`, `/system/export-audit`.

## Production gaps (known & tracked)

| Gap | Impact | Effort | How |
|-----|--------|--------|-----|
| In-memory DB (resets on restart) | Real production data loss | 2 days | Supabase storage layer |
| No real auth | Only demo session | 1–2 days | Supabase Auth magic link |
| Contact email forwarding | Messages stored but not emailed | 1 day | forwardemail.net + webhook |
| No multi-provider billing | Only Stripe | weeks | Next connectors (Chargebee, etc.) |
| Legal review of contingency wording | Contract exposure | 1 day | Lawyer review of Terms text |
| No usage metering supplier | USAGE-001 needs metric source | 1–2 weeks | Integrate usage API |