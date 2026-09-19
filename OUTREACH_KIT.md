# OUTREACH_KIT.md — First prospect: who, where, what to say

Use this kit for the FIRST prospect only. It is the practical, no-padding version of
`SALES_PACKET.md`. Read that file once before outreach and once before the first call.

Remember the model you are selling: **flat 10% contingency, only on cash actually
recovered.** You keep the fee only after they keep 90%. Nothing upfront, no subscription,
12-month attribution window from verification. Recovered cash never touches you or RLH —
it lands 100% in the client's own Stripe/bank, and you invoice your 10% separately with
the printed Client Fee Statement generated in the app.

---

## 1. Who to target first

**ICP one-liner:** Stripe-connected B2B SaaS, roughly $250k–$25M ARR, with paid
customers, subscription + usage billing, and seats, tiers, usage, or invoicing
complexity. Talk to the person who owns the number: **VP Finance, Head of RevOps,
or the founder-operator of a small SaaS** — not the CTO.

**5 quick checks to qualify (pass = worth contacting):**
1. Runs billing on **Stripe** (their checkout, invoices, or subscriptions mention Stripe).
2. ARR is roughly **$250k–$25M** (a few hundred thousand to tens of millions of dollars).
3. Has **paid customers** on recurring plans (not free tier only).
4. Pricing has **seats, tiers, usage metering, or per-plan invoicing** (the leak surface).
5. A person who **owns revenue/ARR exists** and can approve fixes in Stripe.

If 4 of 5 pass, contact. If they have zero billing complexity or only one enterprise
contract, move on — low leak surface.

---

## 2. Where to find the first prospect

Free channels only. Search in this order:

**Founder communities (warmest leads, lowest friction)**
- Search on X: `"saas ar" OR "recurring revenue" founder` , `"stripe" B2B saas`
- Search on Reddit: `r/SaaS`, `r/Stripe` for: `stripe subscriptions seats overcharged`
- Indie Hackers: browse "B2B SaaS" launch posts; post a comment offering a free scan.

**Stripe partner / directory ecosystem**
- Search: `site:stripe.com partners` and `"Stripe" app marketplace B2B SaaS`
- Look at SaaS directories: `site:saashub.com billing usage metering`, `G2 "usage based billing"`

**#buildinpublic on X / Bluesky**
- X: search `(from:anywhere) "buildinpublic" saas stripe` and `#buildinpublic arnumber`
- Bluesky: use their search for `buildinpublic saas stripe billing`.

**Local SaaS meetups**
- Search: `site:meetup.com saas founders`, `site:lu.ma saas revenue`
- Attend with a laptop and the demo app open; hand out the demo URL live.

**LinkedIn**
- Search: `B2B SaaS "VP Finance" ARR` filtered to your region.
- Search: `"Head of RevOps" stripe`.

**Product Hunt top makers**
- Open the Product Hunt makers leaderboard; filter to SaaS makers.
- Check their profile links for a company on Stripe, then use the LinkedIn note below.

---

## 3. The 3-touch reach-out sequence

No fake urgency, no "just checking in" spam. Space touches a few days apart.

### 3a. LinkedIn connection note (~75 words)

> Hi [NAME], I built Revenue Leak Hunter — a scanner that reads your Stripe billing and
> finds cash you're already owed: seats past the plan limit, expired discounts still
> applying, failed card renewals never recharged. It is read-only and success-only:
> no subscription, no setup fee, just 10% of cash actually recovered — you keep 90%.
> I typically surface around [$AMOUNT]/yr in a scan of a company [COMPANY]'s size.
> Could I run one for you?

### 3b. Cold email — 3 short versions (pick one per prospect)

**Version 1 (the number opener) — ~85 words**
> Subject: [$AMOUNT]/yr sitting in [COMPANY]'s billing?
>
> Hi [NAME], most B2B SaaS companies silently leak 2–7% of recurring revenue to billing
> gaps: seats past the limit, expired discounts, failed card renewals. Revenue Leak
> Hunter scans your Stripe and proves each finding with exact records, no guesses.
> No setup fee, no subscription — we take 10% only of cash actually recovered. You keep
> 90%. Want the 60-second scan for [COMPANY]? Reply "scan" and I'll send the link.

**Version 2 (the pain opener) — ~80 words**
> Subject: See money you're owed in Stripe
>
> Hi [NAME], I built a scanner for the problem finance teams hate: money owed but never
> billed. It connects to Stripe read-only, checks seats, invoices, usage, and plan vs.
> price mismatches, and attaches a paper trail to every finding. Success-only pricing —
> 10% of what we actually recover, 90% stays with you. Nothing found, nothing paid.
> May I send the free scan for [COMPANY]?

**Version 3 (the "found it" opener) — ~85 words**
> Subject: A leak check for [COMPANY]'s Stripe
>
> Hi [NAME], I'm a solo founder building Revenue Leak Hunter. It hunts billing leakage
> in Stripe-connected SaaS: seats, invoices, usage, plan mismatches. It reads your
> account read-only and every finding comes with proof. I only get paid when money
> actually lands — 10% of recovered cash, and you keep 90%. If your billing has any
> seats or tiers, there is likely [$AMOUNT]+ there. 15-minute look?

### 3c. Follow-up DM — ~85 words

> Hi [NAME], following up once. I've scanned a few small SaaS Stripe accounts this week
> and keep seeing [$AMOUNT]-scale recoveries from seat and plan mismatches alone. If
> [COMPANY] has subscriptions or usage billing, that money is probably there too. There
> is no fee unless you approve a recovery and the cash actually lands — you keep 90%. If
> it's not for you, no worries at all.

---

## 4. Running the free-scan pitch

Keep it under 15 minutes. This is a funnel, not a demo.

1. Send them the live demo link: **http://localhost:3000** — "try the free revenue scan."
2. Ask two questions before they click:
   - "What's your annual revenue?"
   - "Roughly how many paid customers do you have?"
   (Their answers anchor the $ amounts below and tell you if they qualify.)
3. Recap the landing pitch in one line: *"It's a free scan of your billing health. If
   it finds money, you keep 90% and I earn 10% only when cash actually lands."*
4. Guide them into the **free scan**. It shows a live preview of **~$73,420/yr across
   3 findings**. Walk each finding and name what it maps to in their world
   (seats / invoices / pricing).
5. End with the call to action: *"That's the preview. Inside the app is the full
   dashboard — want to see it live on a call? Or connect your Stripe for a real scan."*

---

## 5. 15-minute discovery call script

**Opening (2 min)**
> "Thanks for the time. Quick setup: I scan Stripe-connected SaaS for billing leaks and
> get paid only when money actually lands. I'll show the product in a minute. First,
> tell me — what's your annual revenue and roughly how many paid customers do you have?"

**5 discovery questions (5 min)**
1. "Where does billing live — Stripe only, or Stripe plus something else?"
2. "What does your pricing look like: seats, tiers, usage metering, any of it?"
3. "What's the biggest surprise you've seen in billing lately?" (Their answer is your
   next leak story and possibly a detector idea.)
4. "Who handles finance / ARR if a billing issue is found — you or someone else?"
5. "Has anyone ever shown you a number tied to billing leakage at your company?"

**The demo moment (5 min)**
Run the free scan for them live, then hand over to the dashboard ($97,760/yr potential
and the 8 opportunities list). Pick one big opportunity with its evidence trail and
verify it together on screen so it feels like their workflow, not a slideshow.

**The fee pitch — say this verbatim (1 min)**
> "Here's the deal. You keep 90% of anything recovered, and Revenue Leak Hunter takes a
> flat 10% — but only when money actually lands in your Stripe or bank. No setup fee,
> no subscription, no recovery means no fee. Recovered cash never touches us; it goes
> 100% to you, and we invoice our 10% separately on a printed fee statement you can
> hand to your accountant. We measure recoveries for 12 months from the date each
> finding is verified, so the fee only applies to money attached to real leaks."

**Next step (1 min)**
> "Here's where we go: I'll send the demo link with your numbers, a sample fee
> statement, and a sample monthly report. If it looks right, we start a 30-day pilot
> with a read-only Stripe key to run a real scan. Sound good?"

---

## 6. Demo walkthrough script — mapped to real screens

Run this live, screen by screen, pointing at what happens on screen as you go.

**Screen 1 — Landing page**
Say: "This is the free revenue scan. One button, no signup." Click **Run My Free
Revenue Scan**.

**Screen 2 — Free scan preview (~$73,420/yr across 3 findings)**
Say: "This is a healthy Instant preview — about $73,420 a year in potential leakage
across these 3 findings. Yours will use your own Stripe data. Each finding is a
specific leak, not a guess."

**Screen 3 — App dashboard (~$97,760/yr potential, 8 opportunities, 10 customers)**
Say: "The full dashboard. ~$97,760 a year in potential, 8 opportunities across 10
customers. Look at the cards: Potential, Verified, Actual, Net — we never mix potential
with money already in hand."

**Screen 4 — Open an opportunity with evidence**
Say: "Open the biggest one — say a plan mismatch. Here's the evidence trail: customer,
plan, what they pay, what they should pay, the rule that fired. Deterministic
calculation, not AI guessing."

**Screen 5 — Verify**
Say: "You approve every fix. Click Verify and it moves from potential into the
recoveries ledger. You can Reject or Suppress anything you disagree with — nothing
is auto-changed in your account."

**Screen 6 — Record a payment (fee shows 10%)**
Say: "When the recovered cash actually lands in your Stripe, we record it here and the
app shows the 10% fee — $X on that payment, 90% stays yours. Fee appears only when
money appears."

**Screen 7 — Recoveries ledger**
Say: "Every dollar is tied to a leak ID, a payment ID, and a timestamp. Audit it
yourself at any time."

**Screen 8 — Print fee statement**
Say: "This is your Client Fee Statement — printable, for your accountant. This is also
our invoice: 10% of what actually landed, with the proof right below it. Money never
moves through us."

**Screen 9 — Monthly reports**
Say: "Every month you get a report: what we found, what we recovered, net benefit. That
is the paper trail that makes the fee fair."

**Screen 10 — Test suite (124 green)**
Say: "This is a 124-check automated suite — every check is a leak rule with exact
records, 0 false positives. It's the proof that the math is right and repeatable."

(Optional closer in a security-minded call: switch the tenant to *Vortex Global
(Isolated Tenant)* and show an empty, isolated view. "Every customer's data is sealed.")

---

## 7. Objection handling

**"How do you access my Stripe?"**
> "Read-only, by design. We connect with a restricted key plus a webhook. We can look
> and analyze; we cannot charge a customer, change a price, or move money. Recovered
> cash lands in your Stripe or bank, never ours."

**"Is my data safe / is this a demo or real?"**
> "Each tenant is fully isolated — there's an in-app demo where one customer's view
> shows completely empty. The free scan is a live preview with sample data; a real scan
> reads your actual Stripe records with your key. Nothing is written to your account,
> only read."

**"Who runs this daily?"**
> "Me — the founder. I've documented the workflow at about 30 minutes a day: check new
> findings, review evidence, flag what needs your sign-off. You approve every fix
> before anything is final. Nothing runs on autopilot against your account."

**"Can you prove it catches real leaks?"**
> "Yes. Every finding comes with an evidence trail — customer, plan, numbers — and the
> product ships a 124-check automated test suite that runs those rules end to end with
> zero false positives. You can audit every dollar in the ledger before you pay a fee."

**"Why 10%?"**
> "No setup fee, no subscription, nothing upfront. Ten percent is an industry-standard
> contingency rate and it only applies to cash that actually lands — so the bet is
> ours, not yours. If we find nothing, you paid nothing."

**"This is just a demo with fake data"**
> "Honest answer: yes, the live demo runs on synthetic fixture data so anyone can try
> it safely. A real scan needs your Stripe keys. So let's prove it: connect a read-only
> restricted key for a 30-day pilot, and if your real data shows nothing recoverable,
> we're done and you owe nothing."

---

## 8. Closing + next steps

If the call went well, lock these specifics:

1. **Agree the terms on the call:** flat **10%**, you keep **90%**, **12-month
   attribution window** from the date each finding is verified, fee only on cash that
   actually lands.
2. **Send them immediately:** the demo link, a **sample Client Fee Statement**, and a
   **sample monthly report** — proof of what their first invoice and report will look
   like before they say yes.
3. **Book the 30-day pilot review** right there: same time next month, review
   recoveries, cause any leak they approved was paid, and decide if the fee is worth
   it. No obligation past that review.

Closing line to use:
> "If you'd like, try it for 30 days with a read-only key. You lose nothing if it finds
> nothing, and you keep 90% of whatever it does find."

---

## 9. The 30-day pilot plan

- **Day 0:** they create a restricted, read-only Stripe key and share the webhook; you
  connect the real scan and confirm connections are visible in their Stripe dashboard.
- **Day 1–3:** run the first real scan, review every finding, and hand the verified list
  to the client — they approve, reject, or suppress each one.
- **Weekly:** a 30-minute recoveries review — what changed in the client's Stripe, what
  cash landed this week, and what still needs their action.
- **As money lands:** record each payment in the recoveries ledger, the app shows the
  10% fee, and you invoice that 10% with the printed Client Fee Statement (client keeps
  the other 90%).
- **Day 30:** the pilot review call — total cash landed, total leaked, net to them; if
  the numbers stand, you agree to continue on the same 10% terms and book the parent
  monthly reporting loop.