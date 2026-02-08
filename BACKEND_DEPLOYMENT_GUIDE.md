# 🚀 Backend Deployment Guide - Railway

## Why Deploy the Backend?

Currently, your backend is running locally on `localhost:5000`. This means:
- ❌ Contact form won't work on the live site
- ❌ Admin login won't work on the live site
- ❌ Email notifications won't be sent

To fix this, we need to deploy the backend to a hosting service.

## 🎯 Deploy to Railway (FREE)

Railway offers free hosting for Node.js applications with MongoDB support.

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: `ytlewis/mwangilewis-portfolio-website`
4. Railway will detect your repository

### Step 3: Configure Backend Service

1. Railway will ask which folder to deploy
2. Set **Root Directory**: `backend`
3. Click "Deploy"

### Step 4: Add Environment Variables

In Railway dashboard, go to your project → Variables tab:

```env
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

### Step 5: Get Your Backend URL

After deployment, Railway will give you a URL like:
```
https://your-app-name.up.railway.app
```

Copy this URL!

### Step 6: Update Vercel Environment Variable

1. Go to https://vercel.com/dashboard
2. Select your project: `lewisgathaiya`
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: `https://your-app-name.up.railway.app`
   - **Environment**: Production, Preview, Development
5. Click "Save"

### Step 7: Redeploy Frontend

```bash
vercel --prod
```

Or just push to GitHub (auto-deploys):
```bash
git add .
git commit -m "Update backend URL"
git push origin master
```

## ✅ Verify Deployment

After deployment, test:

1. **Backend Health Check**:
   Visit: `https://your-app-name.up.railway.app/health`
   Should return: `{"status":"ok"}`

2. **Contact Form**:
   - Go to https://lewisgathaiya.vercel.app/contact
   - Submit a message
   - Should see green "Sent!" button

3. **Admin Login**:
   - Go to https://lewisgathaiya.vercel.app/admin
   - Login with credentials
   - Should access dashboard

## 🐛 Troubleshooting

### Backend Not Starting

**Check Railway Logs**:
1. Go to Railway dashboard
2. Click on your service
3. View "Deployments" tab
4. Check logs for errors

**Common Issues**:
- MongoDB connection failed → Check MONGODB_URI
- Port binding error → Railway auto-assigns port
- Missing dependencies → Check package.json

### Contact Form Still Not Working

1. Check browser console for errors
2. Verify NEXT_PUBLIC_BACKEND_URL in Vercel
3. Test backend directly: `https://your-backend-url/api/contact`
4. Check Railway logs for API errors

### Admin Login Fails

1. Verify admin user exists in MongoDB
2. Check JWT_SECRET is set in Railway
3. Test login endpoint: `POST https://your-backend-url/api/auth/login`
4. Check browser console for errors

## 💡 Alternative: Render.com

If Railway doesn't work, try Render.com (also FREE):

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add same environment variables
7. Deploy!

## 📊 Cost Breakdown

### Railway FREE Tier:
- ✅ 500 hours/month (enough for 24/7)
- ✅ $5 credit/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ GitHub integration

### Render FREE Tier:
- ✅ 750 hours/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Spins down after 15 min inactivity

## 🎯 Quick Deploy Commands

### For Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### For Render:
Just push to GitHub - Render auto-deploys!

## 📞 Need Help?

If deployment fails:
1. Check Railway/Render logs
2. Verify all environment variables
3. Test MongoDB connection
4. Check backend runs locally first

## 🎊 Success!

Once deployed:
- ✅ Contact form works globally
- ✅ Admin login works from anywhere
- ✅ Email notifications sent
- ✅ GitHub data updates automatically
- ✅ Fully production-ready!

---

**Next Steps**: Deploy backend → Update Vercel env → Test live site!
