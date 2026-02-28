# 🚀 Deploy Backend to Render - Step by Step

## ✅ Pre-Deployment Check: PASSED

Your backend is ready to deploy!

## 🎯 Deploy to Render (No CLI Required)

### Step 1: Go to Render

Open your browser and go to: **https://render.com**

### Step 2: Sign Up / Login

1. Click **"Get Started for Free"** or **"Sign In"**
2. Choose **"Sign in with GitHub"**
3. Authorize Render to access your GitHub account

### Step 3: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if needed to connect GitHub
4. Find and select your repository: **`ytlewis/mwangilewis-portfolio-website`**
5. Click **"Connect"**

### Step 4: Configure Web Service

Fill in these settings:

**Basic Settings:**
- **Name**: `lewis-portfolio-backend`
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `master` (or `main`)
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (0$/month)

### Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**

Add these one by one:

```
Key: MONGODB_URI
Value: mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0

Key: JWT_SECRET
Value: lewis-portfolio-super-secret-jwt-key-2024-production

Key: JWT_EXPIRES_IN
Value: 24h

Key: NODE_ENV
Value: production

Key: FRONTEND_URL
Value: https://lewisgathaiya.vercel.app

Key: EMAIL_SERVICE
Value: gmail

Key: EMAIL_USER
Value: gathaiyalewis1122@gmail.com

Key: EMAIL_PASS
Value: Lewis001!

Key: ADMIN_EMAIL
Value: gathaiyalewis1122@gmail.com
```

**Important:** Make sure to copy these exactly, including the `%21` in MONGODB_URI!

### Step 6: Advanced Settings (Optional)

Scroll down to **"Advanced"** and set:

- **Health Check Path**: `/api/health`
- **Auto-Deploy**: `Yes` (recommended)

### Step 7: Create Web Service

Click **"Create Web Service"** button at the bottom

### Step 8: Wait for Deployment

Render will now:
1. Clone your repository
2. Install dependencies
3. Start your backend
4. Assign a URL

This takes about 3-5 minutes. Watch the logs for progress.

### Step 9: Get Your Backend URL

Once deployed, you'll see your URL at the top:

```
https://lewis-portfolio-backend.onrender.com
```

**Copy this URL!** You'll need it for the next step.

### Step 10: Test Your Backend

Click on your backend URL and add `/api/health`:

```
https://lewis-portfolio-backend.onrender.com/api/health
```

You should see:
```json
{"status":"OK","timestamp":"2024-..."}
```

If you see this, your backend is live! 🎉

## 🔗 Update Vercel with Backend URL

### Step 1: Go to Vercel Dashboard

Open: **https://vercel.com/dashboard**

### Step 2: Select Your Project

Click on: **`lewisgathaiya`**

### Step 3: Go to Settings

Click **"Settings"** tab

### Step 4: Environment Variables

1. Click **"Environment Variables"** in the left sidebar
2. Click **"Add New"** button

### Step 5: Add Backend URL

Fill in:
- **Key**: `NEXT_PUBLIC_BACKEND_URL`
- **Value**: `https://lewis-portfolio-backend.onrender.com` (your Render URL)
- **Environments**: Check all three:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

Click **"Save"**

### Step 6: Redeploy Frontend

You have two options:

**Option A: Trigger Redeploy in Vercel**
1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

**Option B: Push to GitHub (Recommended)**
```powershell
git add .
git commit -m "Connect to deployed backend on Render"
git push origin master
```

Vercel will automatically redeploy!

## 🧪 Test Everything

### Test 1: Backend Health Check

Visit: `https://lewis-portfolio-backend.onrender.com/api/health`

Should return: `{"status":"OK"}`

### Test 2: Contact Form

1. Go to: `https://lewisgathaiya.vercel.app/contact`
2. Fill in the form:
   - Name: Test User
   - Email: your-email@example.com
   - Message: Testing deployed backend
3. Click **"Send Message"**
4. Should see green "Sent!" button
5. Check your email (gathaiyalewis1122@gmail.com) for notification

### Test 3: Admin Login

1. Go to: `https://lewisgathaiya.vercel.app/admin`
2. Login with:
   - Email: `gathaiyalewis1122@gmail.com`
   - Password: `Lewis001!`
3. Should see admin dashboard

### Test 4: GitHub Data

1. Go to: `https://lewisgathaiya.vercel.app/projects`
2. Should see your GitHub projects loading

## ✅ Success Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL accessible
- [ ] Health check returns OK
- [ ] Environment variables set in Vercel
- [ ] Frontend redeployed
- [ ] Contact form works
- [ ] Email notification received
- [ ] Admin login works
- [ ] GitHub data loads
- [ ] No CORS errors in browser console

## 🐛 Troubleshooting

### Backend Deployment Failed

**Check Render Logs:**
1. Go to Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Look for error messages

**Common Issues:**

1. **Build Failed**
   - Check that Root Directory is set to `backend`
   - Verify Build Command is `npm install`

2. **MongoDB Connection Failed**
   - Verify MONGODB_URI is correct (with `%21` for `!`)
   - Check MongoDB Atlas allows all IPs (0.0.0.0/0)

3. **Service Won't Start**
   - Check Start Command is `npm start`
   - Verify all environment variables are set

### Contact Form Not Working

1. **Check Browser Console:**
   - Press F12
   - Look for errors
   - Check Network tab for failed requests

2. **Verify Backend URL:**
   - Go to Vercel → Settings → Environment Variables
   - Confirm NEXT_PUBLIC_BACKEND_URL is correct
   - Make sure it doesn't have trailing slash

3. **Test Backend Directly:**
   ```powershell
   curl -X POST https://lewis-portfolio-backend.onrender.com/api/contact `
     -H "Content-Type: application/json" `
     -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
   ```

### Admin Login Fails

**Initialize Admin User:**

If admin user doesn't exist, you need to create it:

1. Go to Render dashboard
2. Click on your service
3. Click **"Shell"** tab
4. Run: `node scripts/init-admin.js`

Or run locally:
```powershell
cd backend
node scripts/init-admin.js
```

### CORS Errors

**Check FRONTEND_URL:**
1. Go to Render dashboard
2. Click on your service
3. Click **"Environment"** tab
4. Verify FRONTEND_URL is: `https://lewisgathaiya.vercel.app`
5. If wrong, update and redeploy

## 📊 Render Free Tier Limits

- ✅ 750 hours/month (enough for 24/7)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️  Spins down after 15 min inactivity
- ⚠️  Cold start takes ~30 seconds

**Note:** First request after inactivity may be slow (cold start). This is normal for free tier.

## 🎉 Deployment Complete!

Once everything works:

✅ Backend is live on Render
✅ Frontend connected to backend
✅ Contact form works globally
✅ Admin dashboard accessible
✅ Email notifications sent
✅ GitHub data updates
✅ Fully production-ready!

## 📝 Important URLs

Save these for reference:

- **Backend URL**: `https://lewis-portfolio-backend.onrender.com`
- **Frontend URL**: `https://lewisgathaiya.vercel.app`
- **Admin Dashboard**: `https://lewisgathaiya.vercel.app/admin`
- **Render Dashboard**: `https://dashboard.render.com`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

## 🔄 Future Updates

When you update your backend code:

1. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Update backend"
   git push origin master
   ```

2. Render will automatically redeploy (if Auto-Deploy is enabled)

3. Check logs in Render dashboard to verify deployment

## 💡 Tips

1. **Monitor Logs**: Check Render logs regularly for errors
2. **Keep Awake**: Consider using a service like UptimeRobot to ping your backend every 5 minutes (prevents cold starts)
3. **Backup Data**: Regularly backup your MongoDB data
4. **Update Dependencies**: Keep packages updated for security

## 🆘 Need Help?

If you encounter issues:

1. Check Render logs for errors
2. Verify all environment variables are set correctly
3. Test backend endpoints directly
4. Check MongoDB Atlas connection
5. Verify CORS settings

---

**Ready to deploy?** Follow the steps above! 🚀

**Estimated time:** 10-15 minutes
**Difficulty:** Easy
**Cost:** FREE

Let's get your backend live! 🎉
