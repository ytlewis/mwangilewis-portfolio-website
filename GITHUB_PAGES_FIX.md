# GitHub Pages 404 Fix - Complete Guide

## What Was Fixed

Your site was showing a 404 error because Next.js apps need special configuration to work on GitHub Pages. I've made the following changes:

### 1. Updated `next.config.js`
- Added `output: 'export'` to generate static files
- Added `trailingSlash: true` for proper routing
- Set `images.unoptimized: true` (required for static export)

### 2. Created GitHub Pages Workflow
- New file: `.github/workflows/github-pages.yml`
- Automatically builds and deploys on push to main branch
- Uses the `/out` directory for deployment

### 3. Added `.nojekyll` File
- Prevents GitHub Pages from processing files with Jekyll
- Ensures proper serving of Next.js static files

### 4. Updated `.gitignore`
- Commented out `/out/` to allow deployment artifacts

## How to Deploy

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - (NOT "Deploy from a branch")

### Step 2: Push Your Changes

```powershell
# Add all changes
git add .

# Commit the fixes
git commit -m "Fix: Configure Next.js for GitHub Pages deployment"

# Push to GitHub
git push origin main
```

### Step 3: Wait for Deployment

1. Go to the **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow run
3. Once complete (green checkmark), your site will be live!

### Step 4: Access Your Site

Your site will be available at:
- `https://[your-username].github.io/[repository-name]/`

For example:
- If your username is `lewismwangi` and repo is `portfolio`
- URL: `https://lewismwangi.github.io/portfolio/`

## Important Notes

### Backend API Limitations

⚠️ **GitHub Pages only hosts static files** - it cannot run your Node.js backend.

For the backend API, you need to:
1. Deploy backend separately to Render/Railway (as per previous guides)
2. Update `NEXT_PUBLIC_BACKEND_URL` in the workflow to point to your backend

### Custom Domain (Optional)

If you want to use `mwangilewis.com`:

1. In GitHub Settings → Pages → Custom domain
2. Enter: `mwangilewis.com`
3. Add these DNS records at your domain registrar:

```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: [your-username].github.io
```

4. Wait 24-48 hours for DNS propagation

## Troubleshooting

### Still Getting 404?

1. **Check GitHub Actions**: Go to Actions tab, ensure workflow succeeded
2. **Check Pages Settings**: Settings → Pages, ensure "GitHub Actions" is selected
3. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check URL**: Make sure you're using the correct GitHub Pages URL

### Build Failing?

1. Check the Actions tab for error messages
2. Common issues:
   - TypeScript errors: Fix in your code
   - Missing dependencies: Run `npm install` locally first
   - Environment variables: Check workflow file

### Images Not Loading?

- GitHub Pages requires `images.unoptimized: true` (already set)
- Use relative paths for images in `/public` folder
- Example: `/images/photo.jpg` not `./images/photo.jpg`

### API Calls Failing?

- Update `NEXT_PUBLIC_BACKEND_URL` in `.github/workflows/github-pages.yml`
- Ensure backend is deployed and accessible
- Check CORS settings in backend

## Alternative: Use Vercel Instead

If you prefer easier deployment with full Next.js features:

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your repository
4. Vercel will auto-deploy on every push
5. Free tier includes custom domains!

**Vercel Benefits:**
- Full Next.js support (no static export needed)
- Automatic deployments
- Better performance
- Built-in analytics
- Easy custom domain setup

## Next Steps

1. ✅ Push the changes to GitHub
2. ✅ Enable GitHub Actions in repository settings
3. ✅ Wait for deployment to complete
4. ✅ Visit your GitHub Pages URL
5. 🎉 Your site is live!

## Need Help?

If you're still having issues:
1. Check the Actions tab for detailed error logs
2. Ensure all files are committed and pushed
3. Verify GitHub Pages is enabled in Settings
4. Try clearing your browser cache

---

**Quick Command to Deploy:**

```powershell
git add . && git commit -m "Deploy to GitHub Pages" && git push origin main
```

Then check the Actions tab to watch the deployment!
