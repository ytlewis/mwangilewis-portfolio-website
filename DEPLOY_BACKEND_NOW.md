# 🚀 Deploy Backend to Railway - Step by Step

## Current Status
- ✅ Backend code is ready
- ✅ MongoDB Atlas is configured
- ✅ Environment variables are set
- 🔄 Need to deploy to Railway

## Option 1: Deploy to Railway (Recommended - FREE)

### Step 1: Install Railway CLI

```powershell
npm install -g @railway/cli
```

### Step 2: Login to Railway

```powershell
railway login
```

This will open your browser. Login with GitHub.

### Step 3: Initialize Railway Project

```powershell
cd backend
railway init
```

Choose:
- "Create a new project"
- Name it: `lewis-portfolio-backend`

### Step 4: Add Environment Variables

```powershell
railway variables set MONGODB_URI="mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0"

railway variables set JWT_SECRET="lewis-portfolio-super-secret-jwt-key-2024-production"

railway variables set JWT_EXPIRES_IN="24h"

railway variables set NODE_ENV="production"

railway variables set FRONTEND_URL="https://lewisgathaiya.vercel.app"

railway variables set EMAIL_SERVICE="gmail"

railway variables set EMAIL_USER="gathaiyalewis1122@gmail.com"

railway variables set EMAIL_PASS="Lewis001!"

railway variables set ADMIN_EMAIL="gathaiyalewis1122@gmail.com"
```

### Step 5: Deploy

```powershell
railway up
```

Wait for deployment to complete...

### Step 6: Get Your Backend URL

```powershell
railway domain
```

This will show your backend URL like: `https://lewis-portfolio-backend-production.up.railway.app`

### Step 7: Test Your Deployment

```powershell
# Test health endpoint
curl https://your-backend-url.up.railway.app/api/health

# Or use the verification script
node scripts/verify-deployment.js https://your-backend-url.up.railway.app
```

### Step 8: Update Frontend Environment Variable

1. Go to https://vercel.com/dashboard
2. Select your project: `lewisgathaiya`
3. Go to Settings → Environment Variables
4. Add or update:
   - **Name**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: `https://your-backend-url.up.railway.app`
   - **Environments**: Production, Preview, Development
5. Click "Save"

### Step 9: Redeploy Frontend

```powershell
# Go back to root directory
cd ..

# Commit and push (triggers auto-deploy)
git add .
git commit -m "Update backend URL for production"
git push origin master
```

## Option 2: Deploy to Render (Alternative - FREE)

### Step 1: Go to Render Dashboard

1. Visit https://render.com
2. Sign up/Login with GitHub

### Step 2: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `ytlewis/mwangilewis-portfolio-website`
3. Configure:
   - **Name**: `lewis-portfolio-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables

In the "Environment" section, add:

```
MONGODB_URI=mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=lewis-portfolio-super-secret-jwt-key-2024-production
JWT_EXPIRES_IN=24h
NODE_ENV=production
FRONTEND_URL=https://lewisgathaiya.vercel.app
EMAIL_SERVICE=gmail
EMAIL_USER=gathaiyalewis1122@gmail.com
EMAIL_PASS=Lewis001!
ADMIN_EMAIL=gathaiyalewis1122@gmail.com
```

### Step 4: Deploy

Click "Create Web Service" and wait for deployment.

### Step 5: Get Your Backend URL

Render will give you a URL like: `https://lewis-portfolio-backend.onrender.com`

### Step 6: Update Frontend (Same as Railway Step 8-9)

## Option 3: Quick Test Locally First

Before deploying, test locally:

```powershell
cd backend

# Start the backend
npm start

# In another terminal, verify
node scripts/verify-deployment.js http://localhost:5000
```

## Troubleshooting

### Railway Deployment Fails

**Check logs:**
```powershell
railway logs
```

**Common issues:**
- MongoDB connection timeout → Check MONGODB_URI
- Port binding error → Railway auto-assigns PORT
- Missing dependencies → Run `npm install` locally first

### Render Deployment Fails

**Check logs in Render dashboard:**
1. Go to your service
2. Click "Logs" tab
3. Look for errors

**Common issues:**
- Build timeout → Increase build timeout in settings
- MongoDB connection → Verify MONGODB_URI is correct
- Memory limit → Free tier has 512MB limit

### Backend URL Not Working

**Test the URL:**
```powershell
curl https://your-backend-url/api/health
```

**Should return:**
```json
{"status":"OK","timestamp":"2024-..."}
```

**If it doesn't work:**
1. Check deployment logs
2. Verify environment variables
3. Test MongoDB connection
4. Check CORS settings

## Verification Checklist

After deployment, verify:

- [ ] Health endpoint works: `GET /api/health`
- [ ] Contact form works on live site
- [ ] Admin login works on live site
- [ ] GitHub data loads on projects page
- [ ] Email notifications are sent
- [ ] No CORS errors in browser console

## Next Steps

Once backend is deployed:

1. ✅ Update `NEXT_PUBLIC_BACKEND_URL` in Vercel
2. ✅ Redeploy frontend
3. ✅ Test contact form on live site
4. ✅ Test admin login on live site
5. ✅ Verify email notifications work

## Need Help?

If deployment fails:
1. Check the logs (Railway: `railway logs`, Render: dashboard)
2. Verify all environment variables are set
3. Test MongoDB connection locally first
4. Check that backend runs locally: `npm start`

## Success Indicators

✅ Backend deployed successfully
✅ Health check returns 200 OK
✅ Contact form works on live site
✅ Admin dashboard accessible
✅ Email notifications sent
✅ No errors in logs

---

**Ready to deploy? Choose Railway (Option 1) or Render (Option 2) and follow the steps!**
