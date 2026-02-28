# 🔗 Connect Backend (Railway) to Frontend (Vercel)

## Overview

This guide will help you:
1. ✅ Deploy backend to Railway
2. ✅ Connect MongoDB Atlas database
3. ✅ Link backend to Vercel frontend
4. ✅ Test the complete system

---

## Step 1: Deploy Backend to Railway

### Quick Deploy:
```powershell
.\deploy-backend-railway.ps1
```

### Manual Deploy:
```powershell
# Navigate to backend
cd backend

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# Get your URL
railway domain
```

---

## Step 2: Configure Environment Variables in Railway

### Required Variables:

1. **Go to Railway Dashboard:**
   ```
   https://railway.app/dashboard
   ```

2. **Select your project** → **Variables** tab

3. **Add these variables:**

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
   FRONTEND_URL=https://lewisgathaiya.vercel.app
   NODE_ENV=production
   PORT=5000
   ```

### Get MongoDB URI:

**If you have MongoDB Atlas:**
1. Go to https://cloud.mongodb.com
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

**If you don't have MongoDB Atlas:**
1. Go to https://cloud.mongodb.com
2. Sign up for free
3. Create a new cluster (free tier)
4. Create a database user
5. Whitelist all IPs: `0.0.0.0/0`
6. Get connection string

### Generate JWT Secret:

```powershell
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Step 3: Get Railway Backend URL

### Option 1: Using CLI
```powershell
cd backend
railway domain
```

### Option 2: Using Dashboard
1. Go to Railway Dashboard
2. Select your project
3. Click "Settings" → "Domains"
4. Copy the generated domain (e.g., `your-project.up.railway.app`)

### Your backend URL will look like:
```
https://lewis-portfolio-backend.up.railway.app
```

---

## Step 4: Update Vercel Frontend

### Add Backend URL to Vercel:

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/lewis-projects-6eb496b8/lewisgathaiya
   ```

2. **Click "Settings" → "Environment Variables"**

3. **Add new variable:**
   - **Name:** `NEXT_PUBLIC_BACKEND_URL`
   - **Value:** `https://your-railway-url.up.railway.app`
   - **Environment:** Production, Preview, Development

4. **Click "Save"**

### Redeploy Vercel:

```powershell
vercel --prod
```

Or trigger redeploy in Vercel dashboard:
- Go to Deployments
- Click "..." on latest deployment
- Click "Redeploy"

---

## Step 5: Update Backend CORS

Your backend needs to allow requests from Vercel.

### In Railway Dashboard:

1. Go to Variables
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://lewisgathaiya.vercel.app
   ```

3. Railway will auto-redeploy

---

## Step 6: Initialize Admin User

### Create admin account:

```powershell
cd backend

# Set Railway environment
railway run node scripts/init-admin.js
```

Or manually in Railway:
1. Go to Railway Dashboard
2. Click your project
3. Go to "Deployments" → "..." → "View Logs"
4. Use Railway CLI to run script

---

## Step 7: Test the Connection

### Test Backend Health:
```
https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-..."
}
```

### Test Frontend:
```
https://lewisgathaiya.vercel.app
```

### Test Contact Form:
1. Go to https://lewisgathaiya.vercel.app/contact
2. Fill out the form
3. Submit
4. Should see success message

### Test Admin Dashboard:
1. Go to https://lewisgathaiya.vercel.app/admin
2. Login with: `gathaiyalewis1122@gmail.com`
3. Use password you set during init
4. Should see dashboard

---

## Complete Environment Variables Reference

### Railway (Backend):
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio

# Security
JWT_SECRET=your_64_character_random_secret_key

# Server
PORT=5000
NODE_ENV=production

# Frontend (for CORS)
FRONTEND_URL=https://lewisgathaiya.vercel.app

# Optional: Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Optional: GitHub
GITHUB_TOKEN=your_github_token
```

### Vercel (Frontend):
```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.up.railway.app
```

---

## Troubleshooting

### Issue: Contact form not working

**Check:**
1. Backend deployed and running?
   ```powershell
   railway logs
   ```

2. Backend URL correct in Vercel?
   - Check Vercel → Settings → Environment Variables

3. CORS configured?
   - Check Railway → Variables → FRONTEND_URL

**Solution:**
```powershell
# Check backend logs
cd backend
railway logs

# Verify environment variables
railway variables

# Redeploy if needed
railway up
```

---

### Issue: Admin login not working

**Check:**
1. MongoDB connected?
2. Admin user created?
3. JWT_SECRET set?

**Solution:**
```powershell
# Check MongoDB connection
cd backend
railway run node scripts/test-connection.js

# Create admin user
railway run node scripts/init-admin.js

# Check logs
railway logs
```

---

### Issue: CORS errors in browser console

**Error:**
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS
```

**Solution:**
1. Update FRONTEND_URL in Railway:
   ```
   FRONTEND_URL=https://lewisgathaiya.vercel.app
   ```

2. Redeploy backend:
   ```powershell
   cd backend
   railway up
   ```

---

### Issue: MongoDB connection failed

**Check:**
1. MongoDB URI correct?
2. Database user created?
3. IP whitelist configured?

**Solution:**
1. Go to MongoDB Atlas
2. Network Access → Add IP: `0.0.0.0/0`
3. Database Access → Create user
4. Update MONGODB_URI in Railway
5. Redeploy

---

## Verification Checklist

### Backend (Railway):
- [ ] Backend deployed successfully
- [ ] Health endpoint working: `/api/health`
- [ ] MongoDB connected
- [ ] Environment variables set
- [ ] Admin user created
- [ ] Logs show no errors

### Frontend (Vercel):
- [ ] Frontend deployed successfully
- [ ] Backend URL configured
- [ ] Contact form submits
- [ ] Admin login works
- [ ] No CORS errors in console

### Integration:
- [ ] Contact form saves to database
- [ ] Admin dashboard shows contacts
- [ ] Email notifications working (optional)
- [ ] GitHub integration working

---

## Useful Commands

### Railway:
```powershell
# View logs
railway logs

# View variables
railway variables

# Set variable
railway variables set KEY=value

# Get domain
railway domain

# Redeploy
railway up

# Open dashboard
railway open
```

### Vercel:
```powershell
# Redeploy
vercel --prod

# View logs
vercel logs

# View deployments
vercel ls

# Open dashboard
vercel open
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  User Browser                                               │
│  https://lewisgathaiya.vercel.app                          │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│                                                             │
│  Vercel (Frontend)                                          │
│  - Next.js App                                              │
│  - Static Pages                                             │
│  - Client-side JavaScript                                   │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ API Calls
                     │ NEXT_PUBLIC_BACKEND_URL
                     │
┌────────────────────▼────────────────────────────────────────┐
│                                                             │
│  Railway (Backend)                                          │
│  https://your-project.up.railway.app                       │
│  - Express.js API                                           │
│  - Authentication                                           │
│  - Contact Form Handler                                     │
│  - Admin Endpoints                                          │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MONGODB_URI
                     │
┌────────────────────▼────────────────────────────────────────┐
│                                                             │
│  MongoDB Atlas (Database)                                   │
│  - User Contacts                                            │
│  - Admin Users                                              │
│  - Application Data                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Configure environment variables
3. ✅ Get Railway URL
4. ✅ Update Vercel with backend URL
5. ✅ Test contact form
6. ✅ Test admin dashboard
7. ✅ Monitor logs for errors

---

## Support

### Railway:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Vercel:
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### MongoDB:
- Docs: https://docs.mongodb.com
- Support: https://support.mongodb.com

---

**Ready to deploy?**

```powershell
.\deploy-backend-railway.ps1
```

Then follow the steps above to connect everything! 🚀
