# Revenue Leak Hunter (RLH)

**Find the revenue you're losing.** Revenue Leak Hunter is a financial intelligence system that continuously detects billing, payment, pricing, and usage discrepancies hiding inside your revenue operations — then measures and attributes the cash actually recovered.

- **Zero subscription fee.** You pay **10%** only of revenue actually recovered through opportunities we identify.
- **100% read-only.** We never write to your billing account.
- **Deterministic proof.** Every finding carries exact source records, reproducible calculations, and confidence scores.

---

## What it does

| Step | What happens |
|------|--------------|
| **Detect** | Five detector families scan your billing data (Stripe) around the clock: failed recurring payments (`PAY-001`), seat/quantity discrepancies (`BILL-001`), expired discounts (`PRICE-001`), missing invoice cadence (`INV-001`), unbilled metered usage (`USAGE-001`). |
| **Verify** | Your team reviews evidence, adjusts the verified amount, and rejects or suppresses false positives. |
| **Collect** | You make the fix inside your own billing dashboard. When cash arrives, you record the payment. |
| **Ledger** | Every recovery is attributed to a specific leak, with a transparent 10% fee statement and audit log. |

## Feature checklist

- Landing page with free guided scan funnel (60-second demo)
- Live product dashboard (potential leak, verified, actual recovered, net benefit)
- Opportunities pipeline with detail, verify, reject, suppress actions
- Recoveries ledger with fee attribution + record-payment flow
- Customers, financial reports (PDF/CSV-ready), Stripe integration console
- Automated test suite: 124 specification checks (5/5 planted leaks detected)
- **11 languages** (EN, TH, VI, ID, AR, ES, ZH, KO, JA, DE, FR) with RTL support
- **12 currencies** (USD, EUR, GBP, JPY, THB, IDR, VND, AED, KRW, CNY, CAD, AUD)
- Light/dark theme, resizable sidebar, guided next-touch workflow bar
- Multi-tenant isolation (Acme + Vortex demo tenants), online/offline badge
- Privacy Policy & Terms of Service, about/contact with working feedback form
- Client error logging + analytics events (stored in server audit log)

## Run locally

**Prerequisite:** Node.js (18+). No Gemini key is required for the core app.

```bash
npm install     # install dependencies
npm run dev     # start dev server (Vite + Express) → http://localhost:3000
```

Production build:

```bash
npm run build   # vite build + server bundle → dist/
npm run start   # node dist/server.cjs → http://localhost:3000
```

Quality gate:

```bash
npm run lint    # TypeScript check (tsc --noEmit)
```

Run the 124-check automated test suite inside the app UI: **Docs → Test Suite**.

## API overview

All endpoints live under `/api/v1` and scope every record to the
`x-organization-id` header (tenant isolation enforced server-side).

| Endpoint | Purpose |
|----------|---------|
| `GET /dashboard` | Aggregate financial metrics |
| `GET /opportunities` / `POST :id/verify\|reject\|suppress` | Leak pipeline |
| `GET /recoveries` / `POST :id/payment` | Recovery ledger + fee attribution |
| `GET /customers` / `GET :id` | Customers with metrics + tenant isolation |
| `POST /integrations/stripe/sync` | Run detectors against current tenant |
| `GET|POST /test-suite/run` | 124-check automated verification |
| `POST /contact` | Feedback / contact form inbox (stored in audit log) |
| `POST /analytics/event` | Lightweight analytics + client error logging |
| `POST /system/reset-demo` | Restore clean demo data |

## Documentation

- [`DEPLOYMENT.md`](DEPLOYMENT.md) — click-by-click deployment guide (free tier)
- [`SALES_PACKET.md`](SALES_PACKET.md) — positioning, pricing, sales summary, launch checklist
- [`SPECIFICATIONS.md`](SPECIFICATIONS.md) — build/requirements spec summary
- [`DOCUMENTATION.md`](DOCUMENTATION.md) — in-app user + ops manual (also `.docx` in `/public`)