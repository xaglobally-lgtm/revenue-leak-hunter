# SALES_PACKET.md — How to sell Revenue Leak Hunter

This is the one-page story + operating plan for sales. Read it, then demo the app.

---

## 1. The 30-second pitch

> "Every B2B SaaS company silently loses 2–7% of annual recurring revenue to billing
> gaps: employees exceeding paid seats, expired discounts still applying, failed card
> renewals past dunning, and unmetered API usage. Revenue Leak Hunter finds that money
> continuously, proves each finding with exact records, and gets paid only **10% of what
> we actually recover for you**. No subscription. No setup fee. No recovery, no fee."

Use that verbatim. It ends in a risk-reversal, which is what opens the conversation.

## 2. Who buys (ideal customer profile)

| Fits well | Fits poorly |
|-----------|-------------|
| B2B SaaS with Stripe billing, $1M–$200M ARR | Tiny startups (<$1M ARR, little billing surface) |
| Self-serve + seats/usage pricing (leak-prone) | Single enterprise contract accounts |
| Has a RevOps/Finance person who owns ARR | Companies not on Stripe (we'd need to add providers) |
| Has hit a growth plateau or a "leaky bucket" problem | Teams with zero appetite for external fees |

Buying personas: **VP Finance / Head of RevOps** (owns the number) — *not* the CTO.

## 3. The pricing model (no entry price — this is your unfair advantage)

- **$0** setup, **$0/month** software
- **10% contingency** of attributable cash actually received, measured 12 months after
  the verified correction
- Every fee is backed by an immutable attribution ledger inside the product
- The buyer keeps 90% of every recovered dollar

Frame: *"If we find nothing, we cost you nothing. If we find money, you're far ahead."*

### Example math for a sales call
- Say the scan finds **$97,760/yr** of potential leakage (the seeded demo number).
- Even recovering **10% of that** = ~$9,776/yr cash in the customer's bank.
- The customer keeps ~$8,800; RLH earns ~$976. Customer is up, RLH is up, repeatable.

## 4. Where the money really is

Recovery is not the end game — **prevention is**. Once you prove leak #1, the natural
upsell is a continuous guardrail: "we now watch your funnel in real time so it never
silently leaks again." Same 10% outcome pricing, but now it's a recurring service with
rising retention. That is how you compound.

## 5. Demo script (5 minutes, always live)

1. **Landing → "Run My Free Revenue Scan"** (60s guided funnel with live animation).
2. Landing on the **Dashboard**: point at Potential/Verified/Actual/Net cards.
3. **Opportunities**: open the biggest finding (PRICE-001 expired discount), show the
   evidence and confidence. Click **Verify**.
4. **Recoveries**: open it, click **Record & Calculate Fee** → watch the 10% fee preview.
5. **Reports**: Generate New Audit Report → shows fee statement + net benefit.
6. **Resilience proof (the closer)**: switch tenant to *Vortex Global (Isolated Tenant)* —
   the app shows an empty, isolated view. "Every customer's data is sealed. That's what
   gets you through security review."

## 6. Objections → answers

- **"Why should I pay you 10% of money I'd have found anyway?"** — The average
  finance team finds ~5–10% of this leakage. We find it systematically, with proof, and
  you approve every fix. You keep 90% of revenue you otherwise never saw.
- **"Can you touch our Stripe account?"** — Read-only, by design. We can't charge or
  change anything. To connect we need a restricted key and a webhook — nothing else.
- **"How do I know the fee is fair?"** — Open the ledger: every dollar is tied to a leak
  ID, a payment ID, and a timestamp. Audit it yourself.
- **"Is this AI guesswork?"** — No. Every finding is a deterministic calculation
  (seat count vs invoice, rate vs list price, cadence vs interval). AI is never the
  source of truth.

## 7. Launch checklist (30 min/day budget — ~2 weeks)

**Week 1 — Ship & validate**
- [ ] Deploy per `DEPLOYMENT.md` (1 evening)
- [ ] Record a 2-minute Loom demo walking the 5-minute script above
- [ ] Post the demo on LinkedIn (tag #RevOps #SaaS), your personal profile

**Week 2 — First prospects**
- [ ] List 10 B2B SaaS companies you know; message the VP Finance/RevOps with:
      *"We recovered $X for Y Corp using a free 60-second scan — want to see yours?"*
- [ ] Do 5 live demos; capture everyone's name, company, and top objection
- [ ] Add Privacy/Terms/Sales pages are already live; keep them linked

**Ongoing (continuous)**
- [ ] Every demo → ask for a referral to their finance peers
- [ ] Blog / LinkedIn posts on "the silent revenue leak" (seat math makes great content)
- [ ] Ask every buyer: *"What's the biggest surprise you've seen in billing lately?"* —
      their answer becomes your next detector idea

## 8. Honest capacity check (for the founder)

- **Today:** fully working demo + tests + deploy + sales packet = you can sell and deploy.
- **Before taking real recurring money:** persistence (Supabase), real email forwarding,
  a signed Terms/Privacy page, and legal review of the 10% contingency agreement.
- **Before scaling:** multi-provider (not just Stripe), SOC-2 commitments behind sales claims,
  and a proper invoicing loop (email your fee statement each month).

## 9. Numbers to watch

| Metric | Healthy |
|--------|---------|
| Demo → scan completion | > 70% |
| Scan → "send me the report" | > 40% |
| Report → live connect | > 30% |
| Time to first paid recovery | < 45 days (your product's own speed) |
| Recovery → customer retention | > 90% (each recovery is a renewal argument) |