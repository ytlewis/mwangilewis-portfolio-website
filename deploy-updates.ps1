# Deploy Updates to Production
# This script will:
# 1. Commit and push changes to GitHub
# 2. Deploy frontend to Vercel
# 3. Provide instructions for updating backend environment variables

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploying Updates to Production" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if there are changes to commit
Write-Host "Step 1: Checking for changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "✓ Changes detected" -ForegroundColor Green
    
    # Show what changed
    Write-Host "`nFiles changed:" -ForegroundColor Cyan
    git status --short
    
    # Ask for confirmation
    Write-Host "`nDo you want to commit these changes? (Y/N): " -ForegroundColor Yellow -NoNewline
    $confirm = Read-Host
    
    if ($confirm -eq 'Y' -or $confirm -eq 'y') {
        # Commit changes
        Write-Host "`nCommitting changes..." -ForegroundColor Yellow
        git add .
        git commit -m "Fix: Update GitHub username to lewisgathaiya and improve email notifications"
        
        # Push to GitHub
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git push origin main
        
        Write-Host "✓ Changes pushed to GitHub" -ForegroundColor Green
    } else {
        Write-Host "Skipping commit..." -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ No changes to commit" -ForegroundColor Green
}

Write-Host ""

# Step 2: Deploy to Vercel
Write-Host "Step 2: Deploying to Vercel..." -ForegroundColor Yellow
Write-Host ""

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if ($vercelInstalled) {
    Write-Host "Deploying to Vercel (this may take a few minutes)..." -ForegroundColor Cyan
    vercel --prod
    
    Write-Host ""
    Write-Host "✓ Frontend deployed to Vercel" -ForegroundColor Green
} else {
    Write-Host "⚠ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    
    Write-Host "Please run this script again to deploy." -ForegroundColor Yellow
    exit
}

Write-Host ""

# Step 3: Backend Environment Variables
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IMPORTANT: Update Backend Settings" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Your backend needs to be updated with the correct GitHub username." -ForegroundColor Yellow
Write-Host ""

Write-Host "If your backend is hosted on Render:" -ForegroundColor Cyan
Write-Host "1. Go to https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Select your backend service" -ForegroundColor White
Write-Host "3. Go to 'Environment' tab" -ForegroundColor White
Write-Host "4. Add/Update this variable:" -ForegroundColor White
Write-Host "   GITHUB_USERNAME = lewisgathaiya" -ForegroundColor Green
Write-Host "5. Click 'Save Changes'" -ForegroundColor White
Write-Host "6. The service will automatically redeploy" -ForegroundColor White
Write-Host ""

Write-Host "If your backend is hosted on Railway:" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app/dashboard" -ForegroundColor White
Write-Host "2. Select your backend project" -ForegroundColor White
Write-Host "3. Go to 'Variables' tab" -ForegroundColor White
Write-Host "4. Add/Update this variable:" -ForegroundColor White
Write-Host "   GITHUB_USERNAME = lewisgathaiya" -ForegroundColor Green
Write-Host "5. The service will automatically redeploy" -ForegroundColor White
Write-Host ""

# Step 4: Email Setup Reminder
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Email Notifications Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "To receive email notifications when users contact you:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Generate a Gmail App Password:" -ForegroundColor Cyan
Write-Host "   - Go to https://myaccount.google.com/apppasswords" -ForegroundColor White
Write-Host "   - Create an app password for 'Mail'" -ForegroundColor White
Write-Host "   - Copy the 16-character password" -ForegroundColor White
Write-Host ""

Write-Host "2. Update your backend environment variables:" -ForegroundColor Cyan
Write-Host "   EMAIL_SERVICE = gmail" -ForegroundColor Green
Write-Host "   EMAIL_USER = gathaiyalewis1122@gmail.com" -ForegroundColor Green
Write-Host "   EMAIL_PASS = [your-16-character-app-password]" -ForegroundColor Green
Write-Host "   ADMIN_EMAIL = gathaiyalewis1122@gmail.com" -ForegroundColor Green
Write-Host ""

Write-Host "3. See EMAIL_SETUP_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""

# Step 5: Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ Frontend deployed to Vercel" -ForegroundColor Green
Write-Host "✓ GitHub username updated to 'lewisgathaiya'" -ForegroundColor Green
Write-Host "✓ Project links will now open correctly" -ForegroundColor Green
Write-Host ""

Write-Host "⚠ Action Required:" -ForegroundColor Yellow
Write-Host "1. Update GITHUB_USERNAME in your backend hosting platform" -ForegroundColor White
Write-Host "2. Set up Gmail App Password for email notifications" -ForegroundColor White
Write-Host "3. Test the contact form at https://lewismwangi.com/contact" -ForegroundColor White
Write-Host ""

Write-Host "Your website is now live at: https://lewismwangi.com" -ForegroundColor Green
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
