# 🚀 Automated Setup — Run This First

## One-Step Setup (Recommended)

### Before You Run This
You need THREE things from Supabase:
1. Your Supabase Project URL (https://xxx.supabase.co)
2. Your Supabase Anon Key (eyJhbGc...)
3. Your GitHub username (if pushing to GitHub)

**Don't have these?** Go here first:
- **Supabase:** https://supabase.com → Start Project → Settings → API (copy URL + anon key)
- **GitHub:** https://github.com → create account (free)

---

## Step 1: Run the Automated Setup Script

Open **PowerShell** in your `revenue-leak-hunter` folder and run:

```powershell
# Option A: Interactive (prompts for credentials)
.\setup-production.ps1

# Option B: Provide credentials as parameters
.\setup-production.ps1 -SupabaseUrl "https://xxx.supabase.co" -SupabaseKey "eyJhbGc..." -GitHubUsername "your-username"
```

**What this script does:**
- ✓ Creates .env file with your Supabase credentials
- ✓ Tests Supabase connectivity
- ✓ Initializes Git repository
- ✓ Installs dependencies (npm install)
- ✓ Builds the app (npm run build)
- ✓ Runs TypeScript checks (npm run lint)
- ✓ Commits code to Git
- ✓ Pushes to GitHub (if username provided)

**Takes:** ~5–10 minutes (mostly npm install + build time)

---

## Step 2: Verify Locally (2 minutes)

```powershell
$env:PORT=3002; npm run dev
```

Visit http://localhost:3002:
- [ ] Dashboard loads with data
- [ ] Make a change (verify a leak, record a payment)
- [ ] Refresh page (Ctrl+R)
- [ ] **Change persists** ✓

Watch the console for:
```
[RLH] Supabase persistence bound to https://xxx.supabase.co
```

---

## Step 3: Deploy to Render (10 minutes)

1. Go to https://render.com
2. Sign up with GitHub (use same account as your git push)
3. Click **New +** → **Blueprint**
4. Select your `revenue-leak-hunter` repository
5. Scroll to **Environment Variables** section
6. Add:
   - `SUPABASE_URL` = your Supabase Project URL
   - `SUPABASE_ANON_KEY` = your Supabase anon key
7. Click **Deploy**
8. Wait 3–5 minutes
9. Get your live URL (looks like `https://revenue-leak-hunter.onrender.com`)

---

## Step 4: Verify Live (2 minutes)

Visit your Render URL on phone + desktop:
- [ ] Landing page loads
- [ ] Free scan works
- [ ] Dashboard visible with data
- [ ] Dark mode + language switching work
- [ ] Go to **Docs → Test Suite** → all 124 checks green ✓

---

## That's It! 🎉

Your app is now:
- ✓ Live on the internet
- ✓ Persistent (data survives restarts)
- ✓ Auto-deploying (every git push = update)
- ✓ Free ($0/month)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Script won't run | Open PowerShell as Admin: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| "Supabase read failed 401" | Your anon key is wrong. Copy it again from Supabase Settings → API |
| GitHub push fails | Run `git remote add origin https://github.com/YOUR_USERNAME/revenue-leak-hunter.git` manually, then `git push -u origin main` |
| npm install fails | Delete `node_modules` folder and `package-lock.json`, then try again |
| Build fails | Run `npm run lint` to see TypeScript errors, fix them, then `npm run build` again |

---

## Need Help?

- **Supabase issues:** See SUPABASE_SETUP_GUIDE.md
- **Deployment details:** See DEPLOYMENT_COMPLETE_GUIDE.md
- **Quick summary:** See QUICK_START_PRODUCTION.md

---

## For Later: Manual Steps (if script doesn't work)

If the automated script fails, here are the manual commands:

```powershell
# 1. Create .env file (open in text editor, paste this):
PORT=3002
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...

# 2. Test Supabase is working
npm run dev

# 3. Initialize Git
git init
git add -A
git commit -m "Revenue Leak Hunter - v1.0"
git branch -M main

# 4. Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/revenue-leak-hunter.git

# 5. Push to GitHub
git push -u origin main

# 6. Go to Render.com and deploy
```

**But try the automated script first!** It handles all of this for you.
