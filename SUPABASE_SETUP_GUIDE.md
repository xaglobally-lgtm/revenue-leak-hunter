# Supabase Setup Guide — Revenue Leak Hunter

This guide takes you from zero to persistent database in **10 minutes**.

---

## Step 1: Create Supabase Account (2 min)

1. Go to https://supabase.com
2. Click **Start Your Project** (top right)
3. Click **Create a new project**
4. Fill in:
   - **Database Password:** Choose something you'll remember (e.g., `MySecurePass123`)
   - **Region:** Pick the closest to your users (e.g., `us-east-1` for USA)
   - **Pricing Plan:** Keep **Free**
5. Click **Create new project**
6. Wait 2–3 minutes while Supabase sets up your database

---

## Step 2: Get Your API Keys (1 min)

1. Once the project is ready, click your project name
2. In the left sidebar, click **Settings** (gear icon)
3. Click **API**
4. Copy these two values:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** (looks like `eyJhbGc...` — a long string)

**Save these somewhere safe** — you'll paste them into your .env file next.

---

## Step 3: Run the Schema Setup (2 min)

1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click **New Query** (top right)
3. Paste this entire SQL script:

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

4. Click **Run** (or press Ctrl+Enter)
5. You should see: `Success. No rows returned`

✓ **Your database schema is now ready.**

---

## Step 4: Configure Your Local App (2 min)

1. Open `C:\Users\user\Downloads\BUILDS\revenue-leak-hunter` in a text editor
2. Create or edit a file called `.env` (in the root folder, same level as package.json)
3. Paste this:

```
PORT=3002
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

4. **Replace the placeholder values** with the ones you copied in Step 2
5. Save the file

**Important:** `.env` is already in `.gitignore` — it won't be committed to GitHub.

---

## Step 5: Test Locally with Persistence (3 min)

1. Stop your dev server if it's running (Ctrl+C in the terminal)
2. Start it again with Supabase enabled:

```powershell
$env:PORT=3002; npm run dev
```

3. You should see in the console:
   ```
   [RLH] Supabase persistence bound to https://xxxxxxxxxxxx.supabase.co
   ```

4. Open http://localhost:3002
5. **Make a change** (e.g., verify a leak, record a payment, change language/currency)
6. **Refresh the page** (Ctrl+R or F5)
7. **Your changes persist** ✓

✓ **Data now survives restarts.**

---

## Verify It Worked

**In Supabase:**
1. Go to **SQL Editor**
2. Run this query:
   ```sql
   SELECT entity, COUNT(*) as count FROM public.rlh_entities GROUP BY entity;
   ```
3. You should see multiple rows (organizations, users, leaks, recoveries, etc.)

**In the app:**
1. Go to **Docs → Test Suite**
2. All 124 checks should still pass ✓

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `[RLH] Supabase read failed 401` | Your SUPABASE_ANON_KEY is wrong. Copy it again from Settings → API. |
| `[RLH] Supabase read failed 404` | The rlh_entities table wasn't created. Run the SQL script again in SQL Editor. |
| App loads but data disappears on refresh | .env not found or SUPABASE_URL is missing. Check the file exists and `.env` is in the root folder. |
| Changes don't sync | Make sure dev server is running (watch for `[RLH] Supabase sync` in console). |

---

## Next: Deploy to Render

Once this works locally, you'll deploy to Render with the same environment variables:

1. Push to GitHub
2. Create Render service
3. Add SUPABASE_URL + SUPABASE_ANON_KEY to Render environment
4. Deploy

Your data will persist across Render restarts. ✓

---

## Cost

**Supabase Free Tier:**
- Database: 500 MB storage (plenty for thousands of leaks/recoveries)
- API calls: unlimited
- Cost: **$0**

**When you scale:**
- Database grows: $0.125/GB/month
- Unused for 7 days: auto-paused

For now, you're completely free.
