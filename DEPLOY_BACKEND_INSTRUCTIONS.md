# 🚀 Deploy Backend to Render - Do This Now

## ✅ Your Backend is Ready!

Pre-deployment check: **PASSED** (14/14 checks)

## 📝 Follow These Steps

### Step 1: Open Render
**Click this link:** https://render.com

### Step 2: Sign In with GitHub
1. Click "Sign In" (top right)
2. Click "Sign in with GitHub"
3. Authorize Render to access your GitHub

### Step 3: Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Find and click: `ytlewis/mwangilewis-portfolio-website`
4. Click "Connect"

### Step 4: Fill in Configuration

**Name:**
```
lewis-portfolio-backend
```

**Root Directory:**
```
backend
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Plan:**
- Select "Free"

### Step 5: Add Environment Variables

Scroll down to "Environment Variables" and add these 9 variables:

**Variable 1:**
- Key: `MONGODB_URI`
- Value: `mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0`

**Variable 2:**
- Key: `JWT_SECRET`
- Value: `lewis-portfolio-super-secret-jwt-key-2024-production`

**Variable 3:**
- Key: `JWT_EXPIRES_IN`
- Value: `24h`

**Variable 4:**
- Key: `NODE_ENV`
- Value: `production`

**Variable 5:**
- Key: `FRONTEND_URL`
- Value: `https://lewisgathaiya.vercel.app`

**Variable 6:**
- Key: `EMAIL_SERVICE`
- Value: `gmail`

**Variable 7:**
- Key: `EMAIL_USER`
- Value: `gathaiyalewis1122@gmail.com`

**Variable 8:**
- Key: `EMAIL_PASS`
- Value: `Lewis001!`

**Variable 9:**
- Key: `ADMIN_EMAIL`
- Value: `gathaiyalewis1122@gmail.com`

### Step 6: Advanced Settings (Optional)

Under "Advanced", set:
- **Health Check Path:** `/api/health`
- **Auto-Deploy:** Yes

### Step 7: Create Web Service

Click the big blue "Create Web Service" button at the bottom

### Step 8: Wait for Deployment

Watch the logs. Deployment takes 3-5 minutes.

You'll see:
- "Build started"
- "Installing dependencies"
- "Build successful"
- "Deploy live"

### Step 9: Copy Your Backend URL

Once deployed, you'll see your URL at the top:
```
https://lewis-portfolio-backend.onrender.com
```

**COPY THIS URL!**

### Step 10: Test Your Backend

Click on your URL and add `/api/health`:
```
https://lewis-portfolio-backend.onrender.com/api/health
```

You should see:
```json
{"status":"OK","timestamp":"2024-..."}
```

✅ If you see this, your backend is LIVE!

---

## 🔗 Now Update Vercel

### Step 1: Open Vercel
**Click this link:** https://vercel.com/dashboard

### Step 2: Select Your Project
Click on: `lewisgathaiya`

### Step 3: Go to Settings
Click "Settings" tab

### Step 4: Environment Variables
1. Click "Environment Variables" in left sidebar
2. Click "Add New"

### Step 5: Add Backend URL
- **Key:** `NEXT_PUBLIC_BACKEND_URL`
- **Value:** `https://lewis-portfolio-backend.onrender.com` (your Render URL)
- **Environments:** Check all three boxes:
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
- Click "Save"

### Step 6: Redeploy Frontend

Open PowerShell and run:
```powershell
git add .
git commit -m "Connect to Render backend"
git push origin master
```

Vercel will automatically redeploy!

---

## 🧪 Final Testing

### Test 1: Backend Health
Visit: `https://lewis-portfolio-backend.onrender.com/api/health`
✅ Should return: `{"status":"OK"}`

### Test 2: Contact Form
1. Go to: `https://lewisgathaiya.vercel.app/contact`
2. Fill in and submit the form
3. ✅ Should see green "Sent!" button
4. ✅ Check email for notification

### Test 3: Admin Login
1. Go to: `https://lewisgathaiya.vercel.app/admin`
2. Login with:
   - Email: `gathaiyalewis1122@gmail.com`
   - Password: `Lewis001!`
3. ✅ Should see admin dashboard

### Test 4: Projects Page
1. Go to: `https://lewisgathaiya.vercel.app/projects`
2. ✅ Should see GitHub projects loading

---

## ✅ Success Checklist

- [ ] Render account created
- [ ] Web service created
- [ ] All 9 environment variables added
- [ ] Service deployed successfully
- [ ] Backend URL accessible
- [ ] Health check returns OK
- [ ] Vercel environment variable updated
- [ ] Frontend redeployed
- [ ] Contact form works
- [ ] Admin login works
- [ ] Projects page loads

---

## 🐛 If Something Goes Wrong

### Deployment Failed
1. Check Render logs (in dashboard)
2. Verify Root Directory is `backend`
3. Check all environment variables are set

### Contact Form Not Working
1. Press F12 in browser
2. Check Console for errors
3. Verify NEXT_PUBLIC_BACKEND_URL in Vercel
4. Make sure backend URL has no trailing slash

### Admin Login Fails
Run this locally to create admin:
```powershell
cd backend
node scripts/init-admin.js
```

---

## 🎉 You're Done!

Once all tests pass:
- ✅ Backend is live on Render
- ✅ Frontend connected to backend
- ✅ Contact form works globally
- ✅ Admin dashboard accessible
- ✅ Fully production-ready!

---

**Start here:** https://render.com

**Time needed:** 10-15 minutes

**Let's deploy!** 🚀
