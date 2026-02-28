# 🚀 Backend Deployment - Fixed & Ready

## ✅ Pre-Deployment Check Passed

Your backend is ready to deploy! All checks passed:
- ✅ All required files present
- ✅ All dependencies installed
- ✅ Database connection configured
- ✅ Security headers configured
- ✅ CORS configured
- ✅ Environment variables documented

## 🎯 Choose Your Deployment Method

### Method 1: Railway (Recommended - Easiest)

**Why Railway?**
- ✅ FREE tier with $5 credit/month
- ✅ Automatic HTTPS
- ✅ Easy CLI deployment
- ✅ GitHub integration
- ✅ 500 hours/month (24/7 uptime)

**Deploy with CLI:**

```powershell
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Run the deployment script
.\deploy-backend-railway.ps1
```

**Or deploy manually:**

1. Go to https://railway.app
2. Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `ytlewis/mwangilewis-portfolio-website`
5. Set Root Directory: `backend`
6. Add environment variables (see below)
7. Deploy!

### Method 2: Render (Alternative - Also FREE)

**Why Render?**
- ✅ FREE tier with 750 hours/month
- ✅ Automatic HTTPS
- ✅ GitHub auto-deploy
- ⚠️  Spins down after 15 min inactivity

**Deploy to Render:**

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect: `ytlewis/mwangilewis-portfolio-website`
5. Configure:
   - **Name**: `lewis-portfolio-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
6. Add environment variables (see below)
7. Click "Create Web Service"

### Method 3: Vercel (Serverless)

**Note:** Vercel can also host the backend as serverless functions.

1. Create `api` folder in root
2. Move backend routes to serverless functions
3. Deploy with: `vercel --prod`

(This requires code restructuring - not recommended for now)

## 🔐 Environment Variables

Add these to your deployment platform:

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

**Important Notes:**
- ⚠️  The `!` in password is URL-encoded as `%21` in MONGODB_URI
- ⚠️  Use the plain password `Lewis001!` for EMAIL_PASS
- ⚠️  Make sure FRONTEND_URL matches your Vercel URL

## 🧪 Test Your Deployment

After deployment, test with:

```powershell
# Replace with your actual backend URL
node backend/scripts/verify-deployment.js https://your-backend-url.up.railway.app
```

**Manual testing:**

1. **Health Check:**
   ```
   https://your-backend-url/api/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Contact Form:**
   ```powershell
   curl -X POST https://your-backend-url/api/contact `
     -H "Content-Type: application/json" `
     -d '{"name":"Test","email":"test@example.com","message":"Test message from deployment"}'
   ```

3. **GitHub API:**
   ```
   https://your-backend-url/api/github/repos
   ```

## 🔗 Update Frontend

After backend is deployed:

### Step 1: Get Your Backend URL

**Railway:**
```powershell
cd backend
railway domain
```

**Render:**
- Check your Render dashboard
- URL format: `https://lewis-portfolio-backend.onrender.com`

### Step 2: Update Vercel Environment Variable

1. Go to https://vercel.com/dashboard
2. Select project: `lewisgathaiya`
3. Settings → Environment Variables
4. Add/Update:
   - **Name**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: `https://your-backend-url`
   - **Environments**: ✅ Production ✅ Preview ✅ Development
5. Click "Save"

### Step 3: Redeploy Frontend

```powershell
# Commit the change
git add .
git commit -m "Update backend URL for production"
git push origin master
```

Vercel will auto-deploy!

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend health check works
- [ ] Contact form works on live site
- [ ] Admin login works on live site
- [ ] GitHub data loads on projects page
- [ ] Email notifications are sent
- [ ] No CORS errors in browser console

## 🐛 Troubleshooting

### Deployment Fails

**Check logs:**

**Railway:**
```powershell
cd backend
railway logs
```

**Render:**
- Go to dashboard → Your service → Logs tab

**Common issues:**
1. **MongoDB connection timeout**
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

2. **Port binding error**
   - Railway/Render auto-assign PORT
   - Make sure server.js uses `process.env.PORT`

3. **Missing dependencies**
   - Run `npm install` locally first
   - Check package.json has all dependencies

### Contact Form Not Working

1. Check browser console for errors
2. Verify NEXT_PUBLIC_BACKEND_URL in Vercel
3. Test backend directly: `POST /api/contact`
4. Check CORS settings allow your frontend URL

### Admin Login Fails

1. Initialize admin user:
   ```powershell
   cd backend
   node scripts/init-admin.js
   ```

2. Verify JWT_SECRET is set
3. Check browser console for errors

## 📊 Deployment Status

Current status:
- ✅ Backend code ready
- ✅ Pre-deployment checks passed
- ✅ MongoDB Atlas configured
- ✅ Environment variables prepared
- 🔄 Waiting for deployment

## 🎯 Quick Deploy Commands

**Railway (Recommended):**
```powershell
.\deploy-backend-railway.ps1
```

**Or manual Railway:**
```powershell
cd backend
railway login
railway init
railway up
railway domain
```

**Render:**
Just use the web interface - it's easier!

## 💡 Tips

1. **Use Railway for development** - easier CLI
2. **Use Render for production** - more stable free tier
3. **Monitor logs** after deployment
4. **Test thoroughly** before announcing
5. **Keep environment variables secure**

## 🎉 Success!

Once deployed:
- ✅ Contact form works globally
- ✅ Admin dashboard accessible anywhere
- ✅ Email notifications sent
- ✅ GitHub data updates automatically
- ✅ Fully production-ready!

---

**Ready to deploy? Run: `.\deploy-backend-railway.ps1`**

Or follow the manual steps above for Railway or Render!
