# Deployment Checklist

## Before You Start
- [ ] Have access to gathaiyalewis1122@gmail.com
- [ ] Have GitHub account (ytlewis)
- [ ] Have PowerShell open in project folder

---

## Step 1: Gmail App Password
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Sign in with gathaiyalewis1122@gmail.com
- [ ] Enable 2-Step Verification (if needed)
- [ ] Create app password: Mail → Other → "Portfolio Website"
- [ ] Copy 16-character password (remove spaces)
- [ ] Save password: `________________`

---

## Step 2: Deploy to Render
- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure:
  - [ ] Name: `lewis-portfolio-backend`
  - [ ] Root Directory: `backend`
  - [ ] Build: `npm install`
  - [ ] Start: `npm start`
- [ ] Add all 11 environment variables (see guide)
- [ ] Click "Create Web Service"
- [ ] Wait for "Your service is live"
- [ ] Copy backend URL: `________________________________`

---

## Step 3: Update Vercel
- [ ] Run: `vercel env rm NEXT_PUBLIC_BACKEND_URL production --yes`
- [ ] Run: `vercel env add NEXT_PUBLIC_BACKEND_URL production`
- [ ] Paste backend URL when prompted
- [ ] Run: `vercel --prod`
- [ ] Wait for deployment

---

## Step 4: Test
- [ ] Open https://lewismwangi.com/projects
- [ ] Projects load correctly
- [ ] "View Code" buttons work
- [ ] Open https://lewismwangi.com/contact
- [ ] Submit test message
- [ ] Check gathaiyalewis1122@gmail.com
- [ ] Email received

---

## ✅ Done!
- [ ] Backend deployed and running
- [ ] Projects loading from GitHub
- [ ] Email notifications working
- [ ] Website fully functional

---

## Notes
Backend URL: `________________________________`

Gmail App Password: `________________________________`

Deployment Date: `________________________________`

---

## If Something Goes Wrong
1. Check Render logs: Dashboard → Service → Logs
2. Check Vercel logs: Dashboard → Project → Deployments
3. Test backend: `[backend-url]/api/health`
4. Verify environment variables in Render
5. See DEPLOY_NOW_SIMPLE_STEPS.md for troubleshooting
