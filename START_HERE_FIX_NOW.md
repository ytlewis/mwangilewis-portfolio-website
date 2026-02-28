# 🚨 START HERE - Fix Projects & Email NOW

## What's Wrong?
1. ❌ Projects page not loading
2. ❌ Contact form emails not being sent

## Why?
Your backend is not deployed or not configured properly.

## Quick Fix (15 minutes)

### Run This Script:
```powershell
.\deploy-backend-render-now.ps1
```

This automated script will:
1. Help you get a Gmail App Password
2. Deploy your backend to Render
3. Configure all environment variables
4. Update Vercel with the backend URL
5. Deploy everything to production

### What You'll Need:
- Access to gathaiyalewis1122@gmail.com
- GitHub account (already connected)
- Render account (free - will create if needed)

---

## Manual Steps (If Script Doesn't Work)

### Step 1: Get Gmail App Password (5 min)

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with: gathaiyalewis1122@gmail.com
3. If needed, enable 2-Step Verification
4. Create app password:
   - App: Mail
   - Device: Other (Custom name)
   - Name: Portfolio Website
5. Copy the 16-character password (remove spaces)

### Step 2: Deploy Backend to Render (5 min)

1. Go to: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository: `mwangilewis-portfolio-website`
4. Configure:
   - Name: `lewis-portfolio-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add these environment variables:

```
MONGODB_URI=mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=lewis-portfolio-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://lewismwangi.com
GITHUB_USERNAME=ytlewis
EMAIL_SERVICE=gmail
EMAIL_USER=gathaiyalewis1122@gmail.com
EMAIL_PASS=[your-16-character-password-from-step-1]
ADMIN_EMAIL=gathaiyalewis1122@gmail.com
```

6. Click "Create Web Service"
7. Wait 2-3 minutes for deployment
8. Copy the backend URL (e.g., `https://lewis-portfolio-backend.onrender.com`)

### Step 3: Update Vercel (3 min)

```bash
# Add backend URL to Vercel
vercel env add NEXT_PUBLIC_BACKEND_URL production
# When prompted, paste your Render backend URL

# Deploy to production
vercel --prod
```

### Step 4: Test (2 min)

1. **Test Projects**: https://lewismwangi.com/projects
   - Should load GitHub projects
   - "View Code" should work

2. **Test Email**: https://lewismwangi.com/contact
   - Submit a test message
   - Check gathaiyalewis1122@gmail.com

---

## Troubleshooting

### Projects Still Not Loading?

**Check Backend Status**:
```bash
node test-backend-connection.js
```

**Check Vercel Environment Variable**:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly

**Check Backend Logs**:
1. Go to Render dashboard
2. Select your backend service
3. Click "Logs" tab
4. Look for errors

### Email Still Not Working?

**Verify Gmail App Password**:
- Must be 16 characters
- No spaces
- From https://myaccount.google.com/apppasswords

**Check Backend Environment Variables**:
1. Go to Render dashboard
2. Select backend service
3. Go to "Environment" tab
4. Verify all email variables are set:
   - `EMAIL_SERVICE=gmail`
   - `EMAIL_USER=gathaiyalewis1122@gmail.com`
   - `EMAIL_PASS=[your-password]`
   - `ADMIN_EMAIL=gathaiyalewis1122@gmail.com`

**Test Email Service**:
```bash
cd backend
npm start
# In another terminal:
node -e "require('./services/emailService').sendContactNotification({name:'Test',email:'test@test.com',message:'Test message'}).then(r => console.log('Email sent:', r))"
```

### Backend Deployment Failed?

**Check Render Logs**:
- Look for build errors
- Check if MongoDB connection is working
- Verify all environment variables are set

**Common Issues**:
- MongoDB URI incorrect → Check connection string
- Missing environment variables → Add all required vars
- Build failed → Check `backend/package.json` exists

---

## Quick Commands Reference

### Deploy Backend:
```powershell
.\deploy-backend-render-now.ps1
```

### Test Backend:
```bash
node test-backend-connection.js
```

### Update Vercel:
```bash
vercel env add NEXT_PUBLIC_BACKEND_URL production
vercel --prod
```

### Check Logs:
- **Render**: https://dashboard.render.com → Select service → Logs
- **Vercel**: https://vercel.com/dashboard → Select project → Deployments → View logs

---

## Success Checklist

- [ ] Gmail App Password created
- [ ] Backend deployed to Render
- [ ] All environment variables set in Render
- [ ] Backend URL copied
- [ ] Vercel environment variable updated
- [ ] Frontend deployed to Vercel
- [ ] Projects page loads correctly
- [ ] Contact form sends emails

---

## Need Help?

1. **Run the automated script**: `.\deploy-backend-render-now.ps1`
2. **Check the detailed guide**: `URGENT_FIX_BACKEND_EMAIL.md`
3. **Test backend connection**: `node test-backend-connection.js`
4. **Check logs**: Render dashboard → Logs tab

---

**Estimated Time**: 15 minutes total

**Your website will be fully functional after completing these steps!**
