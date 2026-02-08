# Change Vercel Project Name to Get Shorter URL

## Current Situation

Your project is named `lewis-portfolio-website` which gives you:
- https://lewis-portfolio-website.vercel.app (long)

## Goal

Get a shorter URL like:
- https://lewismwangi.vercel.app (short)

## How to Change Project Name

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Project Settings**:
   https://vercel.com/lewis-projects-6eb496b8/lewis-portfolio-website/settings

2. **Scroll to "Project Name"**

3. **Change name to**: `lewismwangi`

4. **Click "Save"**

5. **Your new URL will be**: https://lewismwangi.vercel.app

### Option 2: Create New Project

If renaming doesn't work, create a new project:

1. **Delete current project** (optional - keep it as backup)

2. **Deploy with new name**:
   ```powershell
   # Remove .vercel folder
   Remove-Item -Recurse -Force .vercel
   
   # Deploy fresh
   vercel
   ```

3. **When prompted for project name**, enter: `lewismwangi`

4. **Deploy to production**:
   ```powershell
   vercel --prod
   ```

## Steps to Rename (Dashboard Method)

1. Visit: https://vercel.com/lewis-projects-6eb496b8/lewis-portfolio-website/settings

2. Find "Project Name" section

3. Change from `lewis-portfolio-website` to `lewismwangi`

4. Click "Save"

5. Wait a moment for changes to apply

6. Your new URL: https://lewismwangi.vercel.app

## After Renaming

Update the URLs in your code:

```typescript
// src/app/layout.tsx
metadataBase: new URL('https://lewismwangi.vercel.app')
```

Then commit and push:
```powershell
git add src/app/layout.tsx
git commit -m "Update to shorter Vercel URL"
git push
```

## Alternative: Keep Custom Domain

Instead of using vercel.app subdomain, you can:

1. **Use lewismwangi.com** (your custom domain)
   - Shorter than lewis-portfolio-website.vercel.app
   - More professional
   - Just need to configure DNS

2. **Configure DNS** (takes 15-30 minutes):
   - Add A record: `@ → 76.76.21.21`
   - Add A record: `www → 76.76.21.21`

## Recommendation

**Best option**: Use your custom domain **lewismwangi.com**
- It's shorter than the current vercel.app URL
- More professional
- Better for SEO
- Just needs DNS configuration

**Second option**: Rename project to get **lewismwangi.vercel.app**
- Via Vercel dashboard
- Takes 1 minute
- No DNS needed

---

**Which would you prefer?**
1. Use lewismwangi.com (custom domain - needs DNS)
2. Rename to lewismwangi.vercel.app (Vercel subdomain - instant)
