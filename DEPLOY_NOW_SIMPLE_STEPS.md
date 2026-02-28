# 🚀 Deploy Backend NOW - Simple Steps

## Step 1: Get Gmail App Password (5 minutes)

1. **Open this link**: https://myaccount.google.com/apppasswords
2. **Sign in** with: `gathaiyalewis1122@gmail.com`
3. **If you see "2-Step Verification is not turned on"**:
   - Click "Get Started" on 2-Step Verification
   - Follow the prompts (takes 2 minutes)
   - Come back to App Passwords page
4. **Create App Password**:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Type: **Portfolio Website**
   - Click **Generate**
5. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
6. **Remove the spaces**: `abcdefghijklmnop`
7. **Save it somewhere** - you'll need it in Step 3

---

## Step 2: Deploy Backend to Render (5 minutes)

1. **Open Render**: https://dashboard.render.com
   - Sign in or create free account

2. **Create New Web Service**:
   - Click **"New +"** button (top right)
   - Select **"Web Service"**

3. **Connect GitHub**:
   - If not connected, click **"Connect GitHub"**
   - Authorize Render
   - Select repository: **`mwangilewis-portfolio-website`**

4. **Configure Service**:
   - **Name**: `lewis-portfolio-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Add Environment Variables** (click "Add Environment Variable" for each):

```
MONGODB_URI
mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
lewis-portfolio-super-secret-jwt-key-2024-production

JWT_EXPIRES_IN
24h

PORT
5000

NODE_ENV
production

FRONTEND_URL
https://lewismwangi.com

GITHUB_USERNAME
ytlewis

EMAIL_SERVICE
gmail

EMAIL_USER
gathaiyalewis1122@gmail.com

EMAIL_PASS
[paste your 16-character password from Step 1]

ADMIN_EMAIL
gathaiyalewis1122@gmail.com
```

6. **Click "Create Web Service"**

7. **Wait for deployment** (2-3 minutes)
   - Watch the logs at the bottom
   - Wait for "Your service is live" message

8. **Copy your backend URL**:
   - It will look like: `https://lewis-portfolio-backend.onrender.com`
   - Or: `https://lewis-portfolio-backend-xxxx.onrender.com`
   - **Write it down** - you'll need it in Step 3

---

## Step 3: Update Vercel (3 minutes)

Open PowerShell in your project folder and run:

```powershell
# Remove old backend URL if it exists
vercel env rm NEXT_PUBLIC_BACKEND_URL production --yes

# Add new backend URL
vercel env add NEXT_PUBLIC_BACKEND_URL production
```

When prompted, **paste your Render backend URL** from Step 2

Then deploy:
```powershell
vercel --prod
```

Wait for deployment to complete (~1 minute)

---

## Step 4: Test Everything (2 minutes)

### Test 1: Projects Page
1. Open: https://lewismwangi.com/projects
2. **Should see**: GitHub projects loading
3. **Click**: "View Code" on any project
4. **Should open**: Correct GitHub repository

### Test 2: Contact Form & Email
1. Open: https://lewismwangi.com/contact
2. **Fill out** the form with test data:
   - Name: Test User
   - Email: test@example.com
   - Message: Testing email notifications
3. **Submit** the form
4. **Check**: gathaiyalewis1122@gmail.com
5. **Should receive**: Email with subject "New Contact Form Submission from Test User"

---

## ✅ Success Checklist

- [ ] Gmail App Password created
- [ ] Backend deployed to Render
- [ ] All environment variables added
- [ ] Backend URL copied
- [ ] Vercel environment variable updated
- [ ] Frontend deployed
- [ ] Projects page loads correctly
- [ ] Contact form sends emails

---

## 🆘 Troubleshooting

### Backend deployment failed?
- Check Render logs for errors
- Verify all environment variables are set
- Make sure MongoDB URI is correct

### Projects still not loading?
- Wait 2-3 minutes for Render to fully start
- Check backend URL is correct in Vercel
- Test backend directly: `[your-backend-url]/api/health`

### Email not working?
- Verify Gmail App Password is correct (16 characters, no spaces)
- Check 2-Step Verification is enabled
- Check Render logs for email errors

### Need to check backend logs?
1. Go to Render dashboard
2. Click on your backend service
3. Click "Logs" tab
4. Look for any error messages

---

## 📋 Quick Reference

**Your Backend URL**: `https://lewis-portfolio-backend.onrender.com` (or similar)

**Your Website**: https://lewismwangi.com

**Render Dashboard**: https://dashboard.render.com

**Vercel Dashboard**: https://vercel.com/dashboard

**Gmail App Passwords**: https://myaccount.google.com/apppasswords

---

## Time Estimate

- Step 1 (Gmail): 5 minutes
- Step 2 (Render): 5 minutes
- Step 3 (Vercel): 3 minutes
- Step 4 (Testing): 2 minutes
- **Total**: ~15 minutes

---

**Ready? Start with Step 1!** 🚀
