# Deploy Backend to Render - Automated Setup
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Backend to Render" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will help you deploy your backend to Render." -ForegroundColor Yellow
Write-Host ""

# Step 1: Get Gmail App Password
Write-Host "Step 1: Gmail App Password Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Do you have a Gmail App Password? (Y/N): " -ForegroundColor Yellow -NoNewline
$hasPassword = Read-Host

if ($hasPassword -eq 'N' -or $hasPassword -eq 'n') {
    Write-Host ""
    Write-Host "Opening Gmail App Passwords page..." -ForegroundColor Cyan
    Start-Process "https://myaccount.google.com/apppasswords"
    Write-Host ""
    Write-Host "Follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Sign in with: gathaiyalewis1122@gmail.com" -ForegroundColor White
    Write-Host "2. Enable 2-Step Verification if prompted" -ForegroundColor White
    Write-Host "3. Select: Mail → Other (Custom name)" -ForegroundColor White
    Write-Host "4. Name it: Portfolio Website" -ForegroundColor White
    Write-Host "5. Click Generate" -ForegroundColor White
    Write-Host "6. Copy the 16-character password (remove spaces)" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Enter when you have the password..." -ForegroundColor Yellow
    Read-Host
}

Write-Host ""
Write-Host "Enter your Gmail App Password (16 characters): " -ForegroundColor Yellow -NoNewline
$emailPassword = Read-Host

Write-Host ""
Write-Host "✓ Email password saved" -ForegroundColor Green
Write-Host ""

# Step 2: Open Render and provide instructions
Write-Host "Step 2: Deploy to Render" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opening Render dashboard..." -ForegroundColor Cyan
Start-Process "https://dashboard.render.com"

Write-Host ""
Write-Host "Follow these steps in Render:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host ""

Write-Host "2. Connect your GitHub repository:" -ForegroundColor White
Write-Host "   - If not connected, click 'Connect GitHub'" -ForegroundColor Gray
Write-Host "   - Select: mwangilewis-portfolio-website" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Configure the service:" -ForegroundColor White
Write-Host "   Name: lewis-portfolio-backend" -ForegroundColor Gray
Write-Host "   Root Directory: backend" -ForegroundColor Gray
Write-Host "   Build Command: npm install" -ForegroundColor Gray
Write-Host "   Start Command: npm start" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Add Environment Variables (click 'Add Environment Variable'):" -ForegroundColor White
Write-Host ""

# Create environment variables list
$envVars = @"
MONGODB_URI=mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=lewis-portfolio-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://lewismwangi.com
GITHUB_USERNAME=ytlewis
EMAIL_SERVICE=gmail
EMAIL_USER=gathaiyalewis1122@gmail.com
EMAIL_PASS=$emailPassword
ADMIN_EMAIL=gathaiyalewis1122@gmail.com
"@

# Save to file for easy copying
$envVars | Out-File -FilePath "render-env-vars.txt" -Encoding UTF8

Write-Host "   Environment variables saved to: render-env-vars.txt" -ForegroundColor Green
Write-Host "   You can copy them from there!" -ForegroundColor Green
Write-Host ""

Write-Host "   Or copy these one by one:" -ForegroundColor Gray
Write-Host ""
foreach ($line in $envVars -split "`n") {
    if ($line.Trim()) {
        $parts = $line -split "=", 2
        if ($parts.Count -eq 2) {
            Write-Host "   $($parts[0])" -ForegroundColor Cyan -NoNewline
            Write-Host " = " -NoNewline
            Write-Host "$($parts[1])" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "5. Click 'Create Web Service'" -ForegroundColor White
Write-Host ""

Write-Host "6. Wait for deployment (2-3 minutes)" -ForegroundColor White
Write-Host ""

Write-Host "7. Copy the backend URL (looks like: https://lewis-portfolio-backend.onrender.com)" -ForegroundColor White
Write-Host ""

Write-Host "Press Enter when deployment is complete and you have the URL..." -ForegroundColor Yellow
$backendUrl = Read-Host "Enter your backend URL"

Write-Host ""
Write-Host "✓ Backend URL: $backendUrl" -ForegroundColor Green
Write-Host ""

# Step 3: Update Vercel
Write-Host "Step 3: Update Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Updating Vercel with backend URL..." -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (!$vercelInstalled) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Save backend URL to temp file
$backendUrl | Out-File -FilePath "temp_backend_url.txt" -NoNewline

Write-Host "Setting NEXT_PUBLIC_BACKEND_URL in Vercel..." -ForegroundColor Cyan
Write-Host ""

# Remove existing variable if it exists
try {
    vercel env rm NEXT_PUBLIC_BACKEND_URL production --yes 2>$null
} catch {}

# Add new variable
Write-Host "Running: vercel env add NEXT_PUBLIC_BACKEND_URL production" -ForegroundColor Gray
Write-Host ""
Write-Host "When prompted, paste this value:" -ForegroundColor Yellow
Write-Host "$backendUrl" -ForegroundColor Green
Write-Host ""

vercel env add NEXT_PUBLIC_BACKEND_URL production

Write-Host ""
Write-Host "✓ Vercel environment variable updated" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy to Vercel
Write-Host "Step 4: Deploy to Production" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✓ Deployment complete!" -ForegroundColor Green
Write-Host ""

# Step 5: Test
Write-Host "Step 5: Test Everything" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opening test pages..." -ForegroundColor Cyan
Start-Process "https://lewismwangi.com/projects"
Start-Sleep -Seconds 2
Start-Process "https://lewismwangi.com/contact"

Write-Host ""
Write-Host "Test Checklist:" -ForegroundColor Yellow
Write-Host "✓ Projects page: Should load GitHub projects" -ForegroundColor White
Write-Host "✓ Contact form: Submit a test message" -ForegroundColor White
Write-Host "✓ Email: Check gathaiyalewis1122@gmail.com" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✓ Backend deployed to Render: $backendUrl" -ForegroundColor Green
Write-Host "✓ Email configured: gathaiyalewis1122@gmail.com" -ForegroundColor Green
Write-Host "✓ Frontend deployed to Vercel: https://lewismwangi.com" -ForegroundColor Green
Write-Host ""

Write-Host "Your website is now fully functional!" -ForegroundColor Green
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

