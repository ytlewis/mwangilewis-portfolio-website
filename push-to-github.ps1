# Push to GitHub Script
# This script helps you push your portfolio to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Lewis Portfolio - Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Error: Git is not initialized!" -ForegroundColor Red
    Write-Host "Please run: git init" -ForegroundColor Yellow
    exit 1
}

Write-Host "Git repository is initialized ✓" -ForegroundColor Green
Write-Host ""

# Get GitHub username
Write-Host "Enter your GitHub username:" -ForegroundColor Yellow
$username = Read-Host

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "Error: Username cannot be empty!" -ForegroundColor Red
    exit 1
}

# Get repository name
Write-Host ""
Write-Host "Enter your repository name (e.g., lewis-portfolio):" -ForegroundColor Yellow
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "Error: Repository name cannot be empty!" -ForegroundColor Red
    exit 1
}

# Construct GitHub URL
$githubUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "Repository URL: $githubUrl" -ForegroundColor Cyan
Write-Host ""

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    Write-Host "Do you want to replace it? (y/n):" -ForegroundColor Yellow
    $replace = Read-Host
    
    if ($replace -eq "y" -or $replace -eq "Y") {
        Write-Host "Removing existing remote..." -ForegroundColor Yellow
        git remote remove origin
        Write-Host "Adding new remote..." -ForegroundColor Yellow
        git remote add origin $githubUrl
    } else {
        Write-Host "Keeping existing remote." -ForegroundColor Green
    }
} else {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin $githubUrl
}

Write-Host ""
Write-Host "Verifying remote..." -ForegroundColor Yellow
git remote -v

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ready to push to GitHub!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Make sure you have created the repository on GitHub first!" -ForegroundColor Yellow
Write-Host "Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "Do you want to push now? (y/n):" -ForegroundColor Yellow
$pushNow = Read-Host

if ($pushNow -eq "y" -or $pushNow -eq "Y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host ""
    
    git push -u origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  Successfully pushed to GitHub! 🎉" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Deploy frontend to Vercel: https://vercel.com" -ForegroundColor White
        Write-Host "2. Deploy backend to Railway: https://railway.app" -ForegroundColor White
        Write-Host "3. Configure environment variables on both platforms" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  Push failed!" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "1. Repository doesn't exist on GitHub - create it first" -ForegroundColor White
        Write-Host "2. Authentication failed - you may need a Personal Access Token" -ForegroundColor White
        Write-Host "3. No internet connection" -ForegroundColor White
        Write-Host ""
        Write-Host "For authentication, use a Personal Access Token:" -ForegroundColor Yellow
        Write-Host "https://github.com/settings/tokens" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "Skipping push. You can push later with:" -ForegroundColor Yellow
    Write-Host "git push -u origin master" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
