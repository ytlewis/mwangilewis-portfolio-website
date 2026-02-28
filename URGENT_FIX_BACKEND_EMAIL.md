# 🚨 URGENT FIX: Projects Not Loading & Email Not Working

## Problem
1. Projects page is not loading from GitHub
2. Contact form emails are not being sent

## Root Cause
Your backend is either:
- Not deployed
- Not configured with correct environment variables
- Not connected to the frontend

## Quick Fix (Choose One)

### Option A: Use Existing Backend (If Deployed)

#### Step 1: Find Your Backend URL
Check where your backend is deployed:
- **Render**: https://dashboard.render.com
- **Railway**: https://railway.app/dashboard

Look for a service named something like:
- `lewis-portfolio-backend`
- `mwangilewis-backend`
- `portfolio-backend`

Copy the URL (it will look like):
- `https://your-service.onrender.com`
- `https://your-service.up.railway.app`

#### Step 2: Update Backend Environment Variables
In your backend hosting platform, add/update these variables:

```env
GITHUB_USERNAME=ytlewis
EMAIL_SERVICE=gmail
EMAIL_USER=gathaiyalewis1122@gmail.com
EMAIL_PASS=[get from https://myaccount.google.com/apppasswords]
ADMIN_EMAIL=gathaiyalewis1122@gmail.com
FRONTEND_URL=https://lewismwangi.com
```

**To get EMAIL_PASS**:
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with gathaiyalewis1122@gmail.com
3. Enable 2-Step Verification if needed
4. Create app password for "Mail" → "Other (Portfolio Website)"
5. Copy the 16-character password (remove spaces)

#### Step 3: Update Vercel Environment Variable
```bash
vercel env add NEXT_PUBLIC_BACKEND_URL production
```
When prompted, enter your backend URL from Step 1

#### Step 4: Redeploy
```bash
vercel --prod
```

---

### Option B: Start Backend Locally (For Testing)

#### Step 1: Update backend/.env
Open `backend/.env` and update:

```env
GITHUB_USERNAME=ytlewis
EMAIL_SERVICE=gmail
EMAIL_USER=gathaiyalewis1122@gmail.com
EMAIL_PASS=[your-gmail-app-password]
ADMIN_EMAIL=gathaiyalewis1122@gmail.com
```

#### Step 2: Start Backend
```bash
cd backend
npm install
npm start
```

Backend will run at `http://localhost:5000`

#### Step 3: Update Vercel (Temporary)
```bash
vercel env add NEXT_PUBLIC_BACKEND_URL production
```
Enter: `http://localhost:5000`

#### Step 4: Deploy
```bash
vercel --prod
```

**Note**: This is temporary. For production, deploy backend to Render/Railway.

---

### Option C: Deploy Backend Now (Recommended)

#### Using Render:

1. **Go to Render**: https://dashboard.render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `mwangilewis-portfolio-website`
   - Name: `lewis-portfolio-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**:
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
   EMAIL_PASS=[your-gmail-app-password]
   ADMIN_EMAIL=gathaiyalewis1122@gmail.com
   ```

4. **Deploy**: Click "Create Web Service"

5. **Copy Backend URL**: After deployment, copy the URL (e.g., `https://lewis-portfolio-backend.onrender.com`)

6. **Update Vercel**:
   ```bash
   vercel env add NEXT_PUBLIC_BACKEND_URL production
   ```
   Enter the Render URL

7. **Redeploy Frontend**:
   ```bash
   vercel --prod
   ```

---

## Testing

### Test Projects:
1. Go to https://lewismwangi.com/projects
2. Projects should load
3. Click "View Code" should open GitHub

### Test Email:
1. Go to https://lewismwangi.com/contact
2. Submit a test message
3. Check gathaiyalewis1122@gmail.com

---

## Troubleshooting

### Projects Still Not Loading?
- Check browser console for errors (F12)
- Verify backend URL is correct in Vercel
- Check backend logs for errors
- Make sure `GITHUB_USERNAME=ytlewis` is set

### Email Still Not Working?
- Verify Gmail App Password is correct (16 characters, no spaces)
- Check 2-Step Verification is enabled
- Check backend logs for email errors
- Test email service:
  ```bash
  cd backend
  node -e "require('./services/emailService').sendContactNotification({name:'Test',email:'test@test.com',message:'Test'}).then(console.log)"
  ```

### Backend Not Responding?
- Check if backend is deployed and running
- Check backend logs for errors
- Verify MongoDB connection is working
- Check all environment variables are set

---

## Quick Commands

### Check Backend Status:
```bash
node test-backend-connection.js
```

### Update Vercel:
```bash
vercel env add NEXT_PUBLIC_BACKEND_URL production
vercel --prod
```

### Start Backend Locally:
```bash
cd backend
npm start
```

### Deploy Backend to Render:
See Option C above

---

## Need Help?

1. **Check Backend Logs**: Look for errors in your hosting platform
2. **Check Vercel Logs**: https://vercel.com/dashboard
3. **Test Locally**: Start backend locally to isolate the issue
4. **Verify Environment Variables**: Make sure all are set correctly

---

**Priority**: Fix backend deployment first, then email will work automatically.

