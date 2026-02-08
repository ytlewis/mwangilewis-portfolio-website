# Domain Setup: www.mwangilewis.com

## Overview

Setting up your custom domain www.mwangilewis.com for your portfolio.

## Current Status

✅ Preview deployment successful: https://lewis-portfolio-website-dn9waftcm-lewis-projects-6eb496b8.vercel.app

## Steps to Configure Custom Domain

### Step 1: Deploy to Production First

We'll deploy to production, then add the custom domain.

```powershell
vercel --prod
```

This will give you: `lewis-portfolio-website.vercel.app`

### Step 2: Add Custom Domain in Vercel

**Option A: Via Vercel CLI**
```powershell
vercel domains add www.mwangilewis.com
```

**Option B: Via Vercel Dashboard**
1. Go to: https://vercel.com/lewis-projects-6eb496b8/lewis-portfolio-website
2. Click "Settings"
3. Click "Domains"
4. Add domain: `www.mwangilewis.com`
5. Add domain: `mwangilewis.com` (will redirect to www)

### Step 3: Configure DNS Records

You need to add these DNS records at your domain registrar (where you bought mwangilewis.com):

**For www.mwangilewis.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**For mwangilewis.com (root domain):**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**Alternative for root domain (if A record doesn't work):**
```
Type: CNAME
Name: @ (or leave blank)
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### Step 4: Wait for DNS Propagation

- DNS changes take 5 minutes to 48 hours
- Usually works within 15-30 minutes
- Vercel will automatically issue SSL certificate

### Step 5: Verify Domain

Check if domain is working:
```powershell
# Check DNS propagation
nslookup www.mwangilewis.com

# Or visit
https://www.mwangilewis.com
```

## Domain Registrar Instructions

### If using Namecheap:
1. Login to Namecheap
2. Go to Domain List
3. Click "Manage" next to mwangilewis.com
4. Go to "Advanced DNS" tab
5. Add the CNAME and A records above

### If using GoDaddy:
1. Login to GoDaddy
2. Go to My Products
3. Click DNS next to mwangilewis.com
4. Add the CNAME and A records above

### If using Google Domains:
1. Login to Google Domains
2. Select mwangilewis.com
3. Click "DNS" in the left menu
4. Add the CNAME and A records above

### If using Cloudflare:
1. Login to Cloudflare
2. Select mwangilewis.com
3. Go to DNS settings
4. Add the CNAME and A records above
5. Set proxy status to "DNS only" (gray cloud)

## Vercel Domain Configuration

After adding domain in Vercel, you'll see:

```
Domain: www.mwangilewis.com
Status: Pending (waiting for DNS)
SSL: Pending (will auto-issue after DNS)
```

Once DNS propagates:
```
Domain: www.mwangilewis.com
Status: ✓ Valid
SSL: ✓ Active
```

## Redirect Configuration

Set up redirects so all traffic goes to www:

**In Vercel Dashboard:**
1. Go to Project Settings
2. Click "Domains"
3. For `mwangilewis.com`, set redirect to `www.mwangilewis.com`

This ensures:
- `mwangilewis.com` → redirects to → `www.mwangilewis.com`
- `http://www.mwangilewis.com` → redirects to → `https://www.mwangilewis.com`

## Environment Variables Update

After domain is configured, update backend URL:

```powershell
vercel env add NEXT_PUBLIC_BACKEND_URL production
```

Enter value: `https://your-backend.railway.app`

Then redeploy:
```powershell
vercel --prod
```

## Verification Checklist

- [ ] Production deployed to Vercel
- [ ] Custom domain added in Vercel
- [ ] DNS records configured at registrar
- [ ] DNS propagation complete
- [ ] SSL certificate issued
- [ ] www.mwangilewis.com loads correctly
- [ ] mwangilewis.com redirects to www
- [ ] HTTPS works (SSL active)
- [ ] All pages load correctly
- [ ] Environment variables set

## Troubleshooting

### Domain shows "Invalid Configuration"
- Check DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Verify domain ownership

### SSL Certificate Not Issued
- Wait for DNS to fully propagate
- Vercel auto-issues SSL after DNS is valid
- Can take 5-60 minutes after DNS propagates

### Domain Not Resolving
```powershell
# Check DNS
nslookup www.mwangilewis.com

# Check if pointing to Vercel
ping www.mwangilewis.com
```

### "This site can't be reached"
- DNS not propagated yet - wait longer
- DNS records incorrect - double-check values
- Domain not added in Vercel - add it

## Expected Timeline

1. **Deploy to production**: 2-3 minutes
2. **Add domain in Vercel**: 1 minute
3. **Configure DNS**: 5 minutes
4. **DNS propagation**: 15 minutes - 48 hours (usually 30 minutes)
5. **SSL certificate**: Automatic after DNS propagates
6. **Total time**: 30 minutes - 48 hours

## What Happens Next

Once domain is configured:

1. ✅ Your portfolio will be live at www.mwangilewis.com
2. ✅ Automatic HTTPS with SSL certificate
3. ✅ Global CDN for fast loading worldwide
4. ✅ Automatic deployments on git push
5. ✅ Professional custom domain

## Pro Tips

1. **Use www**: It's more flexible for DNS configuration
2. **Enable redirect**: Always redirect root to www
3. **Check propagation**: Use https://dnschecker.org
4. **SSL is automatic**: Vercel handles it for you
5. **Update backend**: Don't forget to deploy backend and update URL

---

**Ready to proceed?** Let's deploy to production first!
