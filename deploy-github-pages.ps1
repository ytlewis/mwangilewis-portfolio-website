# Deploy to GitHub Pages - PowerShell Script

Write-Host "🚀 Deploying to GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "❌ Error: Git repository not initialized" -ForegroundColor Red
    Write-Host "Run: git init" -ForegroundColor Yellow
    exit 1
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Found uncommitted changes. Adding all files..." -ForegroundColor Yellow
    git add .
    
    Write-Host ""
    Write-Host "💬 Enter commit message (or press Enter for default):" -ForegroundColor Cyan
    $commitMessage = Read-Host
    
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Deploy: Fix GitHub Pages configuration"
    }
    
    Write-Host ""
    Write-Host "📦 Committing changes..." -ForegroundColor Yellow
    git commit -m $commitMessage
} else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}

# Check if remote exists
$remotes = git remote
if (-not $remotes) {
    Write-Host ""
    Write-Host "❌ Error: No git remote configured" -ForegroundColor Red
    Write-Host "Add your GitHub repository:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Yellow
    exit 1
}

# Get current branch
$branch = git branch --show-current

Write-Host ""
Write-Host "🔄 Pushing to GitHub ($branch branch)..." -ForegroundColor Yellow
git push origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your GitHub repository" -ForegroundColor White
    Write-Host "2. Click 'Settings' → 'Pages'" -ForegroundColor White
    Write-Host "3. Under 'Build and deployment', select 'GitHub Actions'" -ForegroundColor White
    Write-Host "4. Go to 'Actions' tab to watch the deployment" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Your site will be available at:" -ForegroundColor Cyan
    Write-Host "https://YOUR_USERNAME.github.io/YOUR_REPO/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⏱️  Deployment usually takes 2-5 minutes" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Check the error message above" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
