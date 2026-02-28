# ✅ Render Deployment Checklist

## 🚀 Quick Deployment Steps

### 1. Open Render
Go to: **https://render.com**

### 2. Sign In
- Click "Sign In"
- Choose "Sign in with GitHub"
- Authorize Render

### 3. Create Web Service
- Click "New +" → "Web Service"
- Select repository: `ytlewis/mwangilewis-portfolio-website`
- Click "Connect"

### 4. Configure Service

**Name:** `lewis-portfolio-backend`

**Root Directory:** `backend`

**Build Command:** `npm install`

**Start Command:** `npm start`

**Plan:** Free

### 5. Environment Variables

Click "Add Environment Variable" for each:

```
MONGODB_URI = mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET = lewis-portfolio-super-secret-jwt-key-2024-production

JWT_EXPIRES_IN = 24h

NODE_ENV = production

FRONTEND_URL = https://lewisgathaiya.vercel.app

EMAIL_SERVICE = gmail

EMAIL_USER = gathaiyalewis1122@gmail.com

EMAIL_PASS = Lewis001!

ADMIN_EMAIL = gathaiyalewis1122@gmail.com
```

### 6. Deploy
Click "Create Web Service"

### 7. Get URL
Copy your URL: `https://lewis-portfolio-backend.onrender.com`

### 8. Update Vercel
- Go to https://vercel.com/dashboard
- Select `lewisgathaiya`
- Settings → Environment Variables
- Add: `NEXT_PUBLIC_BACKEND_URL` = `https://lewis-portfolio-backend.onrender.com`
- Save

### 9. Redeploy Frontend
```powershell
git add .
git commit -m "Connect to Render backend"
git push origin master
```

### 10. Test
Visit: `https://lewis-portfolio-backend.onrender.com/api/health`

Should see: `{"status":"OK"}`

---

## 📋 Environment Variables (Copy-Paste Ready)

```
MONGODB_URI
mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
lewis-portfolio-super-secret-jwt-key-2024-production

JWT_EXPIRES_IN
24h

NODE_ENV
production

FRONTEND_URL
https://lewisgathaiya.vercel.app

EMAIL_SERVICE
gmail

EMAIL_USER
gathaiyalewis1122@gmail.com

EMAIL_PASS
Lewis001!

ADMIN_EMAIL
gathaiyalewis1122@gmail.com
```

---

**Time:** 10 minutes | **Cost:** FREE | **Difficulty:** Easy
