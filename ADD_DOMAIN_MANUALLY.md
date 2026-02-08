# Add Domain Manually via Vercel Dashboard

## Current Situation

Your domain `mwangilewis.com` is already registered in your Vercel account but assigned to another project.

## Solution: Add Domain via Dashboard

### Step 1: Go to Vercel Dashboard

Visit: https://vercel.com/lewis-projects-6eb496b8/lewis-portfolio-website/settings/domains

### Step 2: Add Domains

Add these two domains:

1. **www.mwangilewis.com**
2. **mwangilewis.com**

### Step 3: Configure Domain Settings

For `mwangilewis.com`:
- Set it to redirect to `www.mwangilewis.com`
- This ensures all traffic goes to the www version

### Step 4: DNS Configuration

Add these DNS records at your domain registrar:

**For www.mwangilewis.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For mwangilewis.com:**
```
Type: A
Name: @
Value: 76.76.21.21
```

## Alternative: Remove from Other Project First

If the domain is assigned to an old/test project:

1. Go to: https://vercel.com/lewis-projects-6eb496b8
2. Find the old project using mwangilewis.com
3. Go to that project's Settings → Domains
4. Remove mwangilewis.com and www.mwangilewis.com
5. Then add them to lewis-portfolio-website

## Quick Link

**Add domains here**: https://vercel.com/lewis-projects-6eb496b8/lewis-portfolio-website/settings/domains

---

**Your production site is live at**: https://lewis-portfolio-website.vercel.app

Once you add the custom domain, it will be accessible at: https://www.mwangilewis.com
