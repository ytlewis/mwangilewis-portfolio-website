# 🚀 Deploy to Vercel Using CLI

## Quick Start

Run this command:
```powershell
.\deploy-vercel.ps1
```

That's it! The script will:
1. ✅ Check if Vercel CLI is installed (installs if needed)
2. ✅ Install project dependencies
3. ✅ Build your project to check for errors
4. ✅ Deploy to Vercel

---

## Manual Step-by-Step Guide

If you prefer to run commands manually:

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

This will:
- Open your browser
- Ask you to sign in with GitHub, GitLab, or Bitbucket
- Authenticate your CLI

### Step 3: Deploy

```powershell
# Deploy to production
vercel --prod
```

You'll be asked:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (if exists)
- **What's your project's name?** → Press Enter (uses folder name)
- **In which directory is your code located?** → ./ (press Enter)
- **Want to override settings?** → No (press Enter)

### Step 4: Wait for Deployment

Vercel will:
1. Upload your files
2. Build your Next.js app
3. Deploy to production
4. Give you a live URL

---

## What Happens During Deployment

### 1. Pre-deployment Checks
- ✅ Vercel CLI installation
- ✅ Node.js and npm versions
- ✅ Project dependencies
- ✅ Build validation

### 2. Build Process
- Compiles TypeScript
- Bundles JavaScript
- Optimizes images
- Generates static pages
- Creates API routes

### 3. Deployment
- Uploads to Vercel CDN
- Configures serverless functions
- Sets up routing
- Enables HTTPS

### 4. Post-deployment
- Provides live URL
- Enables automatic deployments
- Sets up preview deployments

---

## Environment Variables

### Backend URL Configuration

The deployment uses this backend URL:
```
NEXT_PUBLIC_BACKEND_URL=https://lewis-portfolio-backend.onrender.com
```

### To Change Backend URL:

**Option 1: Update vercel.json**
```json
{
  "env": {
    "NEXT_PUBLIC_BACKEND_URL": "your-backend-url-here"
  }
}
```

**Option 2: Use Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `NEXT_PUBLIC_BACKEND_URL`
5. Redeploy

---

## Deployment URLs

### Production URL
After deployment, you'll get:
```
https://your-project.vercel.app
```

### Preview URLs
Every git push creates a preview:
```
https://your-project-git-branch.vercel.app
```

### Custom Domain
Add your own domain:
```
https://mwangilewis.com
```

---

## Automatic Deployments

### Connect to GitHub

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Git
4. Connect your GitHub repository

**Now every push to GitHub will:**
- ✅ Automatically deploy to Vercel
- ✅ Create preview deployments for PRs
- ✅ Run build checks
- ✅ Update production on main branch

---

## Custom Domain Setup

### Add mwangilewis.com

1. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Add: `mwangilewis.com`
   - Add: `www.mwangilewis.com`

2. **In Your Domain Registrar:**
   Add these DNS records:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation:**
   - Usually takes 1-24 hours
   - Check status in Vercel dashboard

---

## Troubleshooting

### Issue: "vercel: command not found"

**Solution:**
```powershell
npm install -g vercel
```

If still not working:
```powershell
# Close and reopen PowerShell
# Or add npm global folder to PATH
```

---

### Issue: "Build failed"

**Solution:**
1. Check error message in terminal
2. Fix TypeScript/syntax errors
3. Run locally first:
   ```powershell
   npm run build
   ```
4. Fix any errors
5. Deploy again

---

### Issue: "Not logged in"

**Solution:**
```powershell
vercel login
```

Follow the browser prompts to authenticate.

---

### Issue: "Contact form not working"

**Possible causes:**
1. Backend not deployed
2. Wrong backend URL
3. CORS issues

**Solution:**
1. Deploy backend to Render (see `DEPLOY_BACKEND_NOW.md`)
2. Update `NEXT_PUBLIC_BACKEND_URL` in `vercel.json`
3. Redeploy: `vercel --prod`

---

### Issue: "Images not loading"

**Solution:**
1. Check image paths (use `/images/...` not `./images/...`)
2. Ensure images are in `/public` folder
3. Clear browser cache

---

## Useful Commands

### Deploy to Production
```powershell
vercel --prod
```

### Deploy to Preview
```powershell
vercel
```

### Check Deployment Status
```powershell
vercel ls
```

### View Logs
```powershell
vercel logs
```

### Remove Deployment
```powershell
vercel rm [deployment-url]
```

### Login/Logout
```powershell
vercel login
vercel logout
```

### View Project Info
```powershell
vercel inspect
```

---

## Deployment Checklist

Before deploying:
- [ ] All code committed to git
- [ ] No TypeScript errors
- [ ] `npm run build` works locally
- [ ] Backend deployed (if using contact form)
- [ ] Environment variables configured
- [ ] Vercel CLI installed
- [ ] Logged in to Vercel

After deploying:
- [ ] Visit deployment URL
- [ ] Test all pages
- [ ] Test contact form
- [ ] Test admin dashboard
- [ ] Test on mobile
- [ ] Check console for errors

---

## What Gets Deployed

### Included:
- ✅ All pages (Home, About, Projects, Contact, Experience)
- ✅ API routes (contact, admin, auth)
- ✅ Static assets (images, fonts, icons)
- ✅ Styles (CSS, Tailwind)
- ✅ Client-side JavaScript
- ✅ Serverless functions

### Excluded (from .gitignore):
- ❌ node_modules
- ❌ .env files
- ❌ .next folder
- ❌ Build artifacts

---

## Performance Features

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Edge caching
- ✅ Compression
- ✅ HTTP/2
- ✅ Serverless functions

---

## Monitoring & Analytics

### View Analytics:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Analytics" tab

**You can see:**
- Page views
- Unique visitors
- Top pages
- Performance metrics
- Error rates

---

## Cost

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments
- ✅ Analytics

**Perfect for personal portfolios!**

---

## Next Steps After Deployment

1. **Test Everything:**
   - Visit your live site
   - Test contact form
   - Test admin login
   - Check mobile responsiveness

2. **Connect GitHub:**
   - Enable automatic deployments
   - Get preview URLs for PRs

3. **Add Custom Domain:**
   - Use mwangilewis.com
   - Configure DNS records

4. **Monitor Performance:**
   - Check analytics
   - Review error logs
   - Optimize as needed

---

## Quick Reference

### Deploy Now:
```powershell
.\deploy-vercel.ps1
```

### Manual Deploy:
```powershell
vercel --prod
```

### View Dashboard:
https://vercel.com/dashboard

### Get Help:
```powershell
vercel --help
```

---

## Support

### Vercel Documentation:
https://vercel.com/docs

### Vercel Support:
https://vercel.com/support

### Community:
https://github.com/vercel/vercel/discussions

---

**Ready to deploy? Run:**
```powershell
.\deploy-vercel.ps1
```

🚀 Your portfolio will be live in minutes!
