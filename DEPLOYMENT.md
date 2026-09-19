# DEPLOYMENT.md — How to put Revenue Leak Hunter live (free tools, no code)

This guide is written for a complete beginner. You will publish the app so
anyone on the internet can visit the sales page and try the demo, connected to
**free** accounts. Total cost: **$0**.

---

## What you end up with

1. A live **public website** (your landing page + product demo) on a free host.
2. A live **database** (Supabase free tier) so recoveries, contacts, and analytics survive restarts.
3. A real **email inbox** for the contact form (free email forwarding).
4. Optionally, a **real Stripe account** (free to create) to test live billing-data scanning.

---

## Step 1 — Put your code on GitHub (free)

1. Go to https://github.com and sign up (free). Confirm your email.
2. Click the **"+"** icon (top right) → **New repository**.
3. Name it `revenue-leak-hunter`, choose **Public**, do **not** tick "Add a README" (your project already has one). Click **Create repository**.
4. On the next screen, PowerShell will be mentioned. Follow these exact commands (replace `YOUR_USERNAME`):

```powershell
cd C:\Users\user\Downloads\revenue-leak-hunter
git init
git add -A
git commit -m "Revenue Leak Hunter initial release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/revenue-leak-hunter.git
git push -u origin main
```

> If you have already used GitHub on this machine, your computer may ask you to
> log in to your browser once. Choose "Sign in with browser".

---

## Step 2 — Deploy the app (Render free tier)

Render gives you a free web server for the app. It builds and hosts your Node app.

1. Go to https://render.com → **Sign up for free** (GitHub login is easiest).
2. Click **New +** → **Web Service**.
3. Click **Connect** next to your `revenue-leak-hunter` repository.
4. Fill in the settings:
   - **Name**: `revenue-leak-hunter`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: **Free**
5. Click **Create Web Service**. Render will start building automatically.
6. Wait a few minutes. When it shows **Live** (green) you'll get a URL like
   `https://revenue-leak-hunter.onrender.com`. **That is your public site.**

> **Faster option (recommended):** the project includes a `render.yaml`
> blueprint. Instead of steps 2–5, click **New + → Blueprint**, connect your
> repository, and Render fills in every setting itself.

### Optional: go to a custom domain
Buy a domain (e.g. `revenueleakhunter.com` at Namecheap, ~$10/yr). In Render →
your service → **Settings → Custom Domains**, add it, then set the DNS pointer
exactly as Render shows. This is optional — the free URL works fine.

---

## Step 3 — Real database with Supabase (free)

Right now data lives in memory and resets on restart. For sales, add persistence:

> **Note:** The current build is fully demo-functional with the in-memory
> database. If you are just demoing for prospects right now, you can use
> **Step 3 later** and ship now.
>
> **Local durability before Supabase (recommended):** set one environment
> variable so demo/bookkeeping data survives restarts **on your own computer**,
> with zero accounts: `RLH_STORE_FILE=data/rlh-data.json` (start via
> `npm run build` then set the variable and `npm run start`). Every change is
> saved and restored automatically; resetting the demo restores the baseline.
>
> **On Render (free tier)** storage is wiped whenever the service restarts or
> redeploys, so for a live public site use Supabase (Step 3) instead of a file.

1. Go to https://supabase.com → **Start your project** (free tier).
2. Create a project. Pick any region and password you can remember.
3. Copy the **project URL** and **anon/public key** from **Project Settings → API**.
4. Add them as environment variables on Render (Settings → Environment):
   - `SUPABASE_URL` = your URL
   - `SUPABASE_ANON_KEY` = your public key
5. Ask your developer (or me) to switch the app's storage layer from `store.ts`
   memory maps to Supabase tables (customers, subscriptions, invoices, leaks,
   recoveries, payments, audit_logs). This is a ~2-day task.

---

## Step 4 — Contact form email (free)

Create a free account at https://forwardemail.net. Verify that you own the domain,
then forward `revops@yourdomain.com` to your personal email. The contact form
already submits to a real endpoint — a backend job/hook then forwards messages.

---

## Step 5 — Real Stripe connection (free, optional)

1. Create a Stripe account at https://stripe.com (free; per-charge fees only).
2. In Stripe → **Developers → API keys**, copy a **Restricted key** (`rk_...`)
   with read-only permissions (customers, subscriptions, invoices, prices).
3. In the app's **Integration** console, paste the key and click **Test Connection**.
4. For live scanning, the app's webhook receiver (`/api/v1/webhooks/stripe`) must
   be reachable: add it as a webhook endpoint in Stripe → **Developers →
   Webhooks** pointing to `https://YOUR-APP.onrender.com/api/v1/webhooks/stripe`.

---

## Day-of-launch checklist

- [ ] Landing page loads on your phone + desktop
- [ ] Free scan completes and shows 3 findings
- [ ] Enter app → opportunities list has data
- [ ] Verify one leak → record a payment → dashboard numbers move
- [ ] Report generates and downloads as CSV
- [ ] Send a test contact message → you receive it by email
- [ ] Switch tenant in the top bar → Vortex shows an empty, isolated view
- [ ] Dark mode, Thai/Arabic language, THB currency all switch instantly
- [ ] Test suite shows all green (Docs → Test Suite)

## If something breaks

- Check Render logs: your service → **Logs** tab. Errors appear here.
- Rerun `npm run build` and `npm run lint` locally — the user-facing text tells you exactly what failed.
- The app ships a built-in smoke-test suite (`/api/v1/test-suite/run`) that verifies 124 checks; run it from the app UI first.