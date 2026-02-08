# 🚀 Vercel Deployment Guide

## Overview

This guide will help you deploy your portfolio frontend to Vercel (FREE hosting).

## Prerequisites

✅ Code pushed to GitHub: https://github.com/ytlewis/mwangilewis-portfolio-website
✅ Vercel CLI installed
✅ Next.js project configured

## Deployment Options

### Option 1: Deploy via Vercel CLI (Automated)

We'll use this method - it's the fastest!

### Option 2: Deploy via Vercel Dashboard (Manual)

Use this if CLI deployment fails.

## 🎯 CLI Deployment Steps

### Step 1: Login to Vercel

```powershell
vercel login
```

This will open your browser to authenticate.

### Step 2: Deploy

```powershell
vercel
```

Answer the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **mwangilewis-portfolio**
- In which directory is your code located? **./** (press Enter)
- Want to override settings? **N**

### Step 3: Deploy to Production

```powershell
vercel --prod
```

## 🌐 Alternative: Dashboard Deployment

If you prefer using the web interface:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository**
   - Click "Import Project"
   - Select: `ytlewis/mwangilewis-portfolio-website`
   - Click "Import"

3. **Configure Project**
   - Project Name: `mwangilewis-portfolio`
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)

4. **Environment Variables**
   
   Add this variable (we'll update it after backend deployment):
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```
   
   (You'll update this to your Railway backend URL later)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

## 🔧 Environment Variables

### Required Variables:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
```

### How to Add/Update Environment Variables:

**Via CLI:**
```powershell
vercel env add NEXT_PUBLIC_BACKEND_URL
```

**Via Dashboard:**
1. Go to your project on Vercel
2. Click "Settings"
3. Click "Environment Variables"
4. Add variable name and value
5. Click "Save"
6. Redeploy the project

## 📊 What Happens During Deployment

1. **Build Process**:
   - Vercel detects Next.js
   - Installs dependencies (`npm install`)
   - Builds the project (`npm run build`)
   - Optimizes assets
   - Generates static pages

2. **Deployment**:
   - Uploads build to Vercel CDN
   - Configures serverless functions
   - Sets up automatic HTTPS
   - Assigns domain

3. **Result**:
   - Your site is live!
   - URL: `mwangilewis-portfolio.vercel.app`
   - Automatic SSL certificate
   - Global CDN distribution

## 🌍 Custom Domain Setup

### Add mwangilewis.com:

1. **In Vercel Dashboard**:
   - Go to Project Settings
   - Click "Domains"
   - Add domain: `mwangilewis.com`
   - Add domain: `www.mwangilewis.com`

2. **Configure DNS**:
   
   Add these records to your domain registrar:
   
   **For root domain (mwangilewis.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
   
   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation**:
   - Usually takes 5-60 minutes
   - Vercel will automatically issue SSL certificate

## ✅ Deployment Checklist

- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Project deployed
- [ ] Deployment successful
- [ ] Site accessible at Vercel URL
- [ ] Environment variables configured
- [ ] Custom domain added (optional)
- [ ] SSL certificate active

## 🔍 Verify Deployment

After deployment, check:

1. **Homepage**: Should load with particle background
2. **Navigation**: All links work
3. **Theme Toggle**: Dark/light mode switches
4. **Language Toggle**: EN/FR/SW switches
5. **Pages**: About, Projects, Experience, Contact all load
6. **Responsive**: Works on mobile, tablet, desktop

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**
- Solution: Check package.json dependencies
- Run: `npm install` locally to verify

**Error: "Build exceeded time limit"**
- Solution: Optimize build process
- Remove unused dependencies

### Deployment Succeeds but Site Doesn't Work

**Blank page or errors:**
- Check browser console for errors
- Verify environment variables are set
- Check Vercel deployment logs

**API calls fail:**
- Backend not deployed yet (deploy to Railway next)
- Update `NEXT_PUBLIC_BACKEND_URL` after backend deployment

### Custom Domain Issues

**Domain not connecting:**
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check domain registrar settings

## 📈 Post-Deployment

### Automatic Features:

✅ **HTTPS**: Automatic SSL certificate
✅ **CDN**: Global content delivery
✅ **Caching**: Optimized asset caching
✅ **Compression**: Automatic gzip/brotli
✅ **Analytics**: Built-in analytics available
✅ **Previews**: Automatic preview deployments for PRs

### Continuous Deployment:

Every time you push to GitHub:
1. Vercel automatically detects changes
2. Builds and deploys new version
3. Updates live site
4. No manual deployment needed!

## 🔄 Update Deployment

### Push changes to GitHub:
```powershell
git add .
git commit -m "Update portfolio"
git push
```

Vercel automatically deploys the changes!

### Manual redeploy:
```powershell
vercel --prod
```

## 📊 Monitoring

### View Deployment Logs:

**Via CLI:**
```powershell
vercel logs
```

**Via Dashboard:**
1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. View logs and build output

### Analytics:

1. Go to project dashboard
2. Click "Analytics"
3. View traffic, performance, and user data

## 🎯 Expected URLs

After deployment:

- **Vercel URL**: `https://mwangilewis-portfolio.vercel.app`
- **Custom Domain**: `https://mwangilewis.com` (after DNS setup)
- **API Routes**: `https://mwangilewis-portfolio.vercel.app/api/*`

## 🚀 Next Steps

After frontend is deployed:

1. ✅ Frontend deployed to Vercel
2. ⏭️ Deploy backend to Railway
3. ⏭️ Update `NEXT_PUBLIC_BACKEND_URL` in Vercel
4. ⏭️ Test contact form
5. ⏭️ Test admin login
6. ⏭️ Configure custom domain

## 💡 Pro Tips

1. **Preview Deployments**: Every branch gets a preview URL
2. **Environment Variables**: Use different values for preview vs production
3. **Build Cache**: Vercel caches builds for faster deployments
4. **Edge Functions**: API routes run on edge network for low latency
5. **Image Optimization**: Next.js Image component automatically optimized

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support

---

**Ready to deploy?** Run `vercel` in your terminal!
