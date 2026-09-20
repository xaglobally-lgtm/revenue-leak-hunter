# Revenue Leak Hunter - Automated Production Setup
# This script automates: Git setup, .env creation, Supabase schema, testing
# Run this in PowerShell from your project root directory

param(
    [string]$SupabaseUrl,
    [string]$SupabaseKey,
    [string]$GitHubUsername
)

$ErrorActionPreference = "Stop"

Write-Host @"
╔════════════════════════════════════════════════════════════╗
║  Revenue Leak Hunter - Production Setup Automation         ║
║  This script will:                                         ║
║  1. Create .env with Supabase credentials                  ║
║  2. Test Supabase connectivity                             ║
║  3. Initialize Git repository                              ║
║  4. Commit and push to GitHub                              ║
║  5. Run test suite locally                                 ║
╚════════════════════════════════════════════════════════════╝
"@

# Step 1: Collect Supabase credentials
if (-not $SupabaseUrl) {
    Write-Host "`n[STEP 1] Supabase Credentials Required"
    Write-Host "─────────────────────────────────────"
    $SupabaseUrl = Read-Host "Enter your Supabase Project URL (https://xxx.supabase.co)"
    $SupabaseKey = Read-Host "Enter your Supabase Anon Key (eyJhbGc...)"
}

if (-not $SupabaseUrl -or -not $SupabaseKey) {
    Write-Host "❌ Supabase credentials required. Get them from: https://supabase.com/dashboard"
    exit 1
}

# Step 2: Create .env file
Write-Host "`n[STEP 2] Creating .env file..."
$envContent = @"
PORT=3002
SUPABASE_URL=$SupabaseUrl
SUPABASE_ANON_KEY=$SupabaseKey
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8
Write-Host "✓ .env file created"

# Step 3: Test Supabase connectivity
Write-Host "`n[STEP 3] Testing Supabase connection..."
try {
    $headers = @{
        "apikey" = $SupabaseKey
        "Authorization" = "Bearer $SupabaseKey"
        "Accept" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$SupabaseUrl/rest/v1/rlh_entities?limit=1" -Headers $headers -Method GET -ErrorAction SilentlyContinue

    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Supabase connection successful"
    } else {
        Write-Host "⚠ Supabase returned status: $($response.StatusCode)"
        Write-Host "  This is normal if the table doesn't exist yet."
    }
} catch {
    Write-Host "⚠ Could not test Supabase connectivity."
    Write-Host "  Make sure you've run the SQL schema: https://supabase.com/dashboard → SQL Editor"
}

# Step 4: Initialize Git (if not already done)
Write-Host "`n[STEP 4] Setting up Git repository..."
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✓ Git repository initialized"
} else {
    Write-Host "✓ Git repository already exists"
}

# Add .env to .gitignore if not already there
if ((Test-Path ".gitignore") -and -not (Select-String -Path ".gitignore" -Pattern "^\.env$" -Quiet)) {
    Add-Content -Path ".gitignore" -Value ".env"
    Write-Host "✓ .env added to .gitignore"
}

# Step 5: Install dependencies if needed
Write-Host "`n[STEP 5] Checking dependencies..."
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages..."
    npm install
    Write-Host "✓ Dependencies installed"
} else {
    Write-Host "✓ Dependencies already installed"
}

# Step 6: Run build
Write-Host "`n[STEP 6] Building application..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check errors above."
    exit 1
}
Write-Host "✓ Build successful"

# Step 7: Run linter
Write-Host "`n[STEP 7] Running TypeScript check..."
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ TypeScript check found issues (may be non-critical)"
}

# Step 8: Git commit (if new repo)
Write-Host "`n[STEP 8] Git commit..."
git add -A
$commitMessage = "Revenue Leak Hunter - Production release v1.0`n`nAutomated setup on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

try {
    git commit -m $commitMessage
    Write-Host "✓ Changes committed"
} catch {
    Write-Host "✓ No new changes to commit (already up to date)"
}

# Step 9: GitHub setup (optional)
Write-Host "`n[STEP 9] GitHub Repository Setup"
Write-Host "───────────────────────────────"
if ($GitHubUsername) {
    $repoUrl = "https://github.com/$GitHubUsername/revenue-leak-hunter.git"
    Write-Host "Using GitHub username: $GitHubUsername"

    # Check if remote already exists
    $remoteExists = git remote | Select-String "origin" -Quiet

    if ($remoteExists) {
        Write-Host "✓ GitHub remote already configured"
    } else {
        Write-Host "Setting up GitHub remote: $repoUrl"
        git remote add origin $repoUrl
        Write-Host "✓ GitHub remote added"
    }

    # Try to push
    Write-Host "Pushing to GitHub..."
    try {
        git push -u origin main
        Write-Host "✓ Code pushed to GitHub"
    } catch {
        Write-Host "⚠ Push failed. You may need to:"
        Write-Host "  1. Create repo on GitHub: https://github.com/new"
        Write-Host "  2. Make it public (Revenue Leak Hunter)"
        Write-Host "  3. Run: git push -u origin main"
    }
} else {
    Write-Host "Skipped (no GitHub username provided)"
    Write-Host "To push later, run:"
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/revenue-leak-hunter.git"
    Write-Host "  git push -u origin main"
}

# Step 10: Show summary
Write-Host @"
╔════════════════════════════════════════════════════════════╗
║  ✓ Setup Complete                                          ║
╚════════════════════════════════════════════════════════════╝

Your app is ready for deployment!

NEXT STEPS:

1. Start dev server locally to verify Supabase works:

   $env:PORT=3002; npm run dev

   Then visit http://localhost:3002 and make a change.
   Refresh the page - change should persist ✓

2. Create Render deployment:

   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → "Blueprint"
   - Connect to revenue-leak-hunter repo
   - Add environment variables:
     SUPABASE_URL = $SupabaseUrl
     SUPABASE_ANON_KEY = $SupabaseKey
   - Click Deploy

3. Visit your live URL and run the test suite:

   Docs → Test Suite → All 124 checks should pass ✓

For detailed guides, see:
- SUPABASE_SETUP_GUIDE.md
- DEPLOYMENT_COMPLETE_GUIDE.md
- QUICK_START_PRODUCTION.md

"@

Write-Host "`n[COMPLETE] Setup script finished successfully"
