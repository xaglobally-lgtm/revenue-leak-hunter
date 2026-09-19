# Revenue Leak Hunter — Long-Term Strategy (v1)

**Status: locked.** This is the strategy. When in doubt, follow this document over any suggestion made in a chat.

## The Business Model (locked)

- **Pure contingency fee: flat 10%** on cash *actually recovered* through verified opportunities.
- **12-month attribution window** from verification. No setup fee, no subscription, no retainer.
- **You keep 90% of every recovered dollar.** RLH earns nothing on unrealized potential or rejected findings.
- Fee rate is carved in one place: `src/lib/fee.ts` (`RLH_FEE_RATE = 0.1`, `RLH_FEE_PERCENT = 10`). **Do not build fee tiers/settings until a real signed deal needs a different rate.**

### The Money Flow (locked)

1. RLH detects a leak; client fixes it in Stripe.
2. Recovered cash deposits **100% straight into the client's own bank/Stripe account** — RLH never holds or touches funds (read-only API key only).
3. RLH's 10% fee is calculated on the ledger and printed on the **Client Fee Statement** (`Recoveries → open recovery → Print Fee Statement`).
4. Founder emails/collects that statement as an invoice. Client pays directly via ACH/wire/card to the founder's account.
5. The app is deliberately NOT a payment processor. Auto-collection (Stripe Connect) is an optional later upgrade, not a prerequisite to earning.

### Pricing Ladder (locked)

| Phase | Structure |
|---|---|
| Now (first clients) | **10% flat**, 12-mo window — maximal sellability ("if we find nothing, you pay nothing") |
| After 5–10 paid clients | Add enterprise tier: **15%** on annualized deals > $100k (keep 10% for the rest) |
| Only if oversubscribed | Raise to **15% flat**, or $500/mo platform fee + 5% contingency |

## The Product (what it must always be)

- 100% deterministic audit (evidence, not guesses), read-only Stripe read, Decimal-exact fee math.
- Immutable audit trail, strict multi-tenant isolation, free-scan sales funnel, recoveries ledger, monthly reports, fee statements, self-running test suite (124 checks).
- Demo numbers are baked assets: ~$97,760/yr potential, 8 opportunities, $2,400 recovered baseline / $240 fee.

## Roadmap (ordered, honest)

1. **Deploy** — GitHub + Render + Supabase (see `DEPLOYMENT.md`). Requires owner accounts.
2. **Real authentication** (login + sessions) — before any real customer connects their data.
3. **Supabase persistence** — replace the in-memory store so data survives restarts.
4. **Email/alert delivery** — contact form + weekly digest + high-value alerts via real SMTP.
5. **Legal review** — one-page 10% contingency agreement reviewed by a lawyer.
6. **Stripe Connect autopay** (optional) — later; not needed to start earning.
7. **Sales outreach** — daily 30-min plan in `SALES_PACKET.md` §7.

## MANUAL MONEY/ADMIN STEPS — OWNER MUST TAKE (check as done)

- [ ] Create your own **Stripe account** (or equivalent) to receive client fee payments.
- [ ] Decide legal entity + bank account for ACH/wire deposits.
- [ ] Draft/sign a **one-page contingency agreement**: 10%, 12-month attribution, collection-only basis.
- [ ] Create GitHub, Render, Supabase accounts; deploy per `DEPLOYMENT.md`.
- [ ] Pick the pricing for the first prospect: **10% flat**.
- [ ] Land first 5–10 clients; only then revisit rates.
- [ ] Have a lawyer review the agreement and privacy/terms pages.

## Standing Instructions (apply to EVERY future chat)

1. At the **end of every chat**, remind the owner of the **manual steps not yet taken** (checklist above — update the checkboxes here as they're completed).
2. Remind the owner of anything related to **collecting money** (accounts, agreement, invoices, Stripe Connect) every time it's relevant.
3. Keep the fee **flat 10%**. Do not build tiered/variable fee code until a real signed deal needs it.
4. Re-read this file at the start of any session about strategy, money, pricing, or the roadmap.