# Quick Start: Production Deployment (TL;DR)

## The Goal
Launch your app live on a free URL that survives restarts.

## The Timeline
- **Supabase setup:** 10 minutes
- **GitHub:** 5 minutes  
- **Render deploy:** 10 minutes
- **Testing:** 5 minutes
- **Total:** ~30 minutes + waiting for services

## Your Checklist

### 1. LOCAL TEST WITH SUPABASE (Do this first)

**Time: 10 minutes**

```bash
# 1. Create .env in your repo root:
# (same level as package.json)

# Content:
PORT=3002
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...

# 2. Follow SUPABASE_SETUP_GUIDE.md to:
#    - Create Supabase account
#    - Get your API keys
#    - Run the SQL schema
#    - Test persistence locally

# 3. Restart your dev server:
$env:PORT=3002; npm run dev

# 4. Verify in console:
# [RLH] Supabase persistence bound to https://xxx.supabase.co

# 5. Test: Make a change, refresh page, change persists ✓
```

### 2. GITHUB (5 minutes)

```bash
# Go to github.com → create public repo "revenue-leak-hunter"

# Then in PowerShell:
cd C:\Users\user\Downloads\BUILDS\revenue-leak-hunter

git init
git add -A
git commit -m "Initial release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/revenue-leak-hunter.git
git push -u origin main
```

### 3. RENDER DEPLOY (10 minutes)

1. Go to **render.com** → Sign up with GitHub
2. Click **New +** → **Blueprint**
3. Connect to `revenue-leak-hunter` repo
4. Scroll to **Environment Variables**
5. Add:
   - `SUPABASE_URL=https://xxx.supabase.co`
   - `SUPABASE_ANON_KEY=eyJhbGc...`
6. Click **Deploy**
7. Wait 3–5 minutes for build
8. Get your live URL: `https://revenue-leak-hunter.onrender.com`

### 4. TEST LIVE (5 minutes)

Visit your live URL on phone + desktop:
- [ ] Landing page loads
- [ ] Free scan works
- [ ] Enter app → dashboard visible
- [ ] Verify a leak → check persists on refresh
- [ ] Test suite all green (Docs → Test Suite)

## That's It

Your app is now:
- ✓ Live on the internet
- ✓ Persistent (data survives restarts)
- ✓ Free ($0/month)
- ✓ Auto-deploying (every git push = instant update)

## Files You Need

1. **SUPABASE_SETUP_GUIDE.md** — Detailed Supabase walkthrough
2. **DEPLOYMENT_COMPLETE_GUIDE.md** — Full deployment with all options
3. **.env.example** — Environment variable template

All three are in your `/outputs` folder. Read them in order.

## Common Issues

| Issue | Fix |
|-------|-----|
| `Supabase read failed 401` | Wrong API key. Copy again from Supabase Settings → API |
| `Build fails on Render` | Missing SUPABASE_URL / SUPABASE_ANON_KEY in Render env |
| `Data doesn't persist` | Check Render env vars; restart your local dev server |
| `Can't push to GitHub` | Run `git remote add origin ...` with correct repo URL |

## Next: Email Forwarding (Optional)

Once you're live, add email forwarding so contact form reaches your inbox:

1. forwardemail.net → create account
2. Verify your domain
3. Forward `revops@yourdomain.com` to your email

(Instructions in DEPLOYMENT_COMPLETE_GUIDE.md)

---

**Start with:** SUPABASE_SETUP_GUIDE.md → local .env test → GitHub push → Render deploy
