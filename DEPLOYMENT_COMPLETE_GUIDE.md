# Complete Deployment Guide — Revenue Leak Hunter

**Goal:** Launch your app live on a free public URL that survives restarts.

**Total time:** 1–2 hours (mostly waiting for services to activate)  
**Total cost:** $0

---

## Prerequisites

✓ App runs locally at http://localhost:3002  
✓ Test suite passes (Docs → Test Suite, all 124 checks green)

**Accounts you'll need (all free):**
- GitHub (github.com)
- Render (render.com)
- Supabase (supabase.com)

---

## PART 1: SUPABASE DATABASE (10 min)

**Why:** Your app needs persistent storage. Without this, all data resets when Render restarts.

### Step 1.1: Create Supabase Account
1. Go to https://supabase.com
2. Click **Start Your Project**
3. Choose a database password and region
4. Wait 2–3 minutes for setup

### Step 1.2: Get API Credentials
1. Click **Settings** (gear icon, left sidebar)
2. Click **API**
3. Copy and save:
   - **Project URL** (https://xxx.supabase.co)
   - **anon public** key (eyJhbGc...)

### Step 1.3: Create Database Schema
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste the entire SQL script below
4. Click **Run**

```sql
create table if not exists public.rlh_entities (
  entity     text        not null,
  id         text        not null,
  payload    jsonb       not null,
  created_at timestamptz not null default now(),
  primary key (entity, id)
);

alter table public.rlh_entities enable row level security;

drop policy if exists "rlh_anon_all" on public.rlh_entities;
create policy "rlh_anon_all" on public.rlh_entities
  for all
  to anon
  using (true)
  with check (true);

grant select, insert, update, delete on public.rlh_entities to anon, authenticated;
```

✓ **Supabase is ready.**

---

## PART 2: TEST LOCALLY WITH SUPABASE (5 min)

**Why:** Verify persistent storage works before deploying to production.

### Step 2.1: Create .env File
1. In your `revenue-leak-hunter` folder, create a file called `.env`
2. Paste this:

```
PORT=3002
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

3. Replace the values with your Supabase credentials from Step 1.2
4. Save the file

### Step 2.2: Test Persistence
1. Stop your dev server (Ctrl+C)
2. Restart:
   ```powershell
   $env:PORT=3002; npm run dev
   ```
3. You should see:
   ```
   [RLH] Supabase persistence bound to https://xxx.supabase.co
   ```
4. Visit http://localhost:3002
5. Make a change (verify a leak, record a payment, etc.)
6. Refresh the page (Ctrl+R)
7. **Change persists** ✓

✓ **Data survives restarts.**

---

## PART 3: GITHUB (5 min)

**Why:** Render deploys directly from GitHub. Every git push = automatic deploy.

### Step 3.1: Create GitHub Account (if needed)
1. Go to https://github.com
2. Sign up (free)
3. Confirm your email

### Step 3.2: Create Repository
1. Click **+** (top right) → **New repository**
2. Fill in:
   - **Name:** `revenue-leak-hunter`
   - **Visibility:** **Public** (Render can see it)
   - **Do NOT** tick "Add a README" (you have one)
3. Click **Create repository**

### Step 3.3: Push Your Code
1. Open PowerShell in `C:\Users\user\Downloads\BUILDS\revenue-leak-hunter`
2. Run these commands (replace `YOUR_USERNAME`):

```powershell
git init
git add -A
git commit -m "Revenue Leak Hunter — production release v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/revenue-leak-hunter.git
git push -u origin main
```

3. When prompted, sign in with your browser
4. You should see:
   ```
   * [new branch] main -> main
   ```

✓ **Code is on GitHub.**

---

## PART 4: RENDER DEPLOYMENT (10 min)

**Why:** Render hosts your app for free. Every git push auto-deploys.

### Step 4.1: Create Render Account
1. Go to https://render.com
2. Click **Sign up for free**
3. Choose **Continue with GitHub** (easiest)
4. Authorize Render to access your GitHub repos

### Step 4.2: Deploy via Blueprint (Recommended)
1. Click **New +** → **Blueprint**
2. Click **Connect** next to `revenue-leak-hunter`
3. Render auto-fills all settings from `render.yaml` in your repo
4. Scroll down to **Environment** section
5. Add these environment variables:
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click **Deploy**
7. Wait 3–5 minutes while Render builds and starts your app

### Step 4.3: Get Your Live URL
1. Once the build completes (shows **Live** in green)
2. Render gives you a URL like: `https://revenue-leak-hunter.onrender.com`
3. **That is your live app** — bookmark it!
4. Test it: visit the URL on your phone and desktop

✓ **App is live and data persists.**

---

## PART 5: OPTIONAL — CUSTOM DOMAIN (10 min)

**Why:** Look professional (`revenueleakhunter.com` instead of `.onrender.com`)

### Step 5.1: Buy a Domain
1. Go to https://namecheap.com (or any registrar)
2. Search for your domain (e.g., `revenueleakhunter.com`)
3. Buy it (~$10/year)

### Step 5.2: Point to Render
1. In Render, go to your service → **Settings** → **Custom Domains**
2. Add your domain
3. Render shows you the DNS CNAME to add
4. In Namecheap (or your registrar), update DNS records with that CNAME
5. Wait 24–48 hours for DNS to propagate

✓ **Your domain now points to your live app.**

---

## PART 6: OPTIONAL — EMAIL CONTACT FORM (10 min)

**Why:** Sales inquiries should arrive in your inbox, not disappear.

### Step 6.1: Set Up Email Forwarding
1. Go to https://forwardemail.net
2. Sign up (free)
3. Verify you own your domain
4. Add a forward rule: `revops@yourdomain.com` → your personal email

### Step 6.2: Wire Backend (If Using Supabase)
Contact form messages are stored in the audit log. To forward them to email:
1. Use a job scheduler (Vercel Cron, AWS Lambda, or manual script)
2. Fetch unnotified messages from `/api/v1/system/export-audit`
3. POST each one to forwardemail.net via its API

**For now:** Messages arrive in the app's audit log. Email forwarding can be added later.

---

## VERIFICATION CHECKLIST

Run through this to confirm everything works:

- [ ] Live URL loads on mobile + desktop
- [ ] Landing page visible
- [ ] Free scan completes, shows 3 findings
- [ ] Click "Enter App" → dashboard loads
- [ ] Opportunities list has data
- [ ] Verify a leak → amount updates
- [ ] Record a payment → fee calculates (10%)
- [ ] Dashboard numbers update
- [ ] Switch tenant (Vortex) → isolated
- [ ] Dark mode toggles instantly
- [ ] Language changes to Thai/Arabic ✓
- [ ] Currency changes to THB/AED ✓
- [ ] Docs → Test Suite → all 124 checks green ✓
- [ ] Contact form submits (message stored in audit log)
- [ ] Refresh page → all changes persist ✓

**If all green:** You're live and production-ready.

---

## DAILY OPERATIONS

### Pushing Updates
```powershell
git add -A
git commit -m "Your change description"
git push
```
Render auto-deploys within 60 seconds.

### Monitoring
- Check Render Logs: your service → **Logs** tab
- Check Supabase: in your project dashboard
- Check test suite: in-app at **Docs → Test Suite**

### Backup Your Data
Once weekly:
1. In Supabase → **SQL Editor**
2. Run: `SELECT * FROM public.rlh_entities`
3. Export as CSV
4. Save locally

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Build fails on Render | Check Render Logs. Usually missing env vars. |
| Data not persisting | Confirm SUPABASE_URL + SUPABASE_ANON_KEY in Render env. |
| Contact form not saving | Check if `/api/v1/contact` endpoint works locally first. |
| Live URL slow | Render free tier may sleep after 15 min inactivity. Click to wake it. |
| App crashes on Render | Check Logs tab. Usually database connection issue. |

---

## COST SUMMARY

| Service | Cost |
|---------|------|
| Render | Free (512 MB RAM, may throttle at high traffic) |
| Supabase | Free (500 MB storage, unlimited API) |
| Domain | ~$10/year (optional) |
| Email | Free (forwardemail.net) |
| **TOTAL** | **$0–10/year** |

Free tier is plenty for testing and small-scale sales.

---

## NEXT STEPS

Once live:

1. **Share your URL** with early customers/prospects
2. **Collect feedback** via the Contact form
3. **Monitor test suite** — if checks fail, something broke
4. **Plan real auth** — multi-user features require Supabase Auth (email login)
5. **Plan email** — forward contact form to inbox
6. **Plan monitoring** — set up error alerts

---

## Support

If stuck:
1. Check **Render Logs** (your service → Logs tab)
2. Check **Supabase SQL Editor** to verify schema exists
3. Run `npm run lint` locally to catch TypeScript errors
4. Test the free scan — if that works, core app is fine
