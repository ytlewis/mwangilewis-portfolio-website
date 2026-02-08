# Simple GitHub Push Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get GitHub username
Write-Host "Enter your GitHub username: " -ForegroundColor Yellow -NoNewline
$username = Read-Host

# Get repository name
Write-Host "Enter repository name: " -ForegroundColor Yellow -NoNewline
$repoName = Read-Host

# Construct URL
$githubUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "Repository URL: $githubUrl" -ForegroundColor Cyan
Write-Host ""

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "Removing existing remote..." -ForegroundColor Yellow
    git remote remove origin
}

# Add remote
Write-Host "Adding remote..." -ForegroundColor Yellow
git remote add origin $githubUrl

# Verify
Write-Host ""
git remote -v

# Push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

git push -u origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Success! Repository: https://github.com/$username/$repoName" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push failed. Check the error above." -ForegroundColor Red
}
