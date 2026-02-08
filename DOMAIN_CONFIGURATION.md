# Domain Configuration Guide

This guide covers setting up the domain `mwangilewis.com` for the Lewis Portfolio Website.

## Table of Contents
1. [Domain Purchase](#domain-purchase)
2. [DNS Configuration](#dns-configuration)
3. [Vercel Frontend Setup](#vercel-frontend-setup)
4. [Backend API Subdomain](#backend-api-subdomain)
5. [SSL/TLS Certificates](#ssltls-certificates)
6. [Email Configuration](#email-configuration)
7. [Verification and Testing](#verification-and-testing)
8. [Troubleshooting](#troubleshooting)

---

## Domain Purchase

### Recommended Registrars
- **Namecheap**: https://www.namecheap.com
- **Google Domains**: https://domains.google
- **GoDaddy**: https://www.godaddy.com
- **Cloudflare**: https://www.cloudflare.com/products/registrar/

### Purchase Steps
1. Search for `mwangilewis.com`
2. Add to cart and complete purchase
3. Enable domain privacy protection (recommended)
4. Set up auto-renewal to prevent expiration

**Cost**: Typically $10-15/year for .com domains

---

## DNS Configuration

### Overview
You'll need to configure DNS records to point your domain to:
- **Frontend**: Vercel (mwangilewis.com and www.mwangilewis.com)
- **Backend API**: Railway/Render (api.mwangilewis.com)

### Option 1: Using Vercel DNS (Recommended)

**Advantages:**
- Automatic SSL certificates
- Global CDN
- Simplified configuration
- Automatic DNS propagation

**Steps:**

1. **Transfer DNS to Vercel**
   - Go to Vercel dashboard
   - Navigate to your project
   - Click "Domains"
   - Add domain: `mwangilewis.com`
   - Vercel will provide nameservers

2. **Update Nameservers at Registrar**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

3. **Add WWW Subdomain**
   - In Vercel, add `www.mwangilewis.com`
   - Configure redirect from www to root (or vice versa)

4. **Add API Subdomain**
   - Add custom DNS record in Vercel:
   ```
   Type: CNAME
   Name: api
   Value: your-backend.railway.app (or your-backend.onrender.com)
   TTL: Auto
   ```

### Option 2: Using Registrar DNS

**Steps:**

1. **Configure Root Domain**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel IP - check current IP at vercel.com/docs)
   TTL: 3600
   ```

2. **Configure WWW Subdomain**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Configure API Subdomain**
   ```
   Type: CNAME
   Name: api
   Value: your-backend.railway.app
   TTL: 3600
   ```

### Option 3: Using Cloudflare (Advanced)

**Advantages:**
- Additional security features
- DDoS protection
- Analytics
- Page rules

**Steps:**

1. **Add Site to Cloudflare**
   - Sign up at cloudflare.com
   - Add site: `mwangilewis.com`
   - Cloudflare will scan existing DNS records

2. **Update Nameservers**
   - Cloudflare provides nameservers
   - Update at your registrar

3. **Configure DNS Records**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   Proxy: Enabled (orange cloud)
   
   Type: CNAME
   Name: www
   Value: mwangilewis.com
   Proxy: Enabled
   
   Type: CNAME
   Name: api
   Value: your-backend.railway.app
   Proxy: Enabled (or disabled for direct connection)
   ```

4. **Configure SSL/TLS**
   - SSL/TLS mode: Full (strict)
   - Always Use HTTPS: On
   - Automatic HTTPS Rewrites: On

---

## Vercel Frontend Setup

### Add Custom Domain

1. **Navigate to Project Settings**
   - Go to Vercel dashboard
   - Select your project
   - Click "Settings" → "Domains"

2. **Add Domain**
   ```
   Domain: mwangilewis.com
   ```
   Click "Add"

3. **Add WWW Subdomain**
   ```
   Domain: www.mwangilewis.com
   ```
   Click "Add"

4. **Configure Redirect**
   - Choose primary domain (with or without www)
   - Vercel will automatically redirect the other

### Verify Configuration

Vercel will show:
- ✅ Valid Configuration
- 🔒 SSL Certificate Active
- 🌍 Global CDN Enabled

### Update Environment Variables

In Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://api.mwangilewis.com
NEXT_PUBLIC_SITE_URL=https://mwangilewis.com
```

---

## Backend API Subdomain

### Railway Configuration

1. **Navigate to Project Settings**
   - Go to Railway dashboard
   - Select your backend project
   - Click "Settings"

2. **Add Custom Domain**
   ```
   Domain: api.mwangilewis.com
   ```

3. **Get CNAME Target**
   - Railway provides: `your-project.railway.app`
   - Add this as CNAME record in DNS

4. **Verify SSL**
   - Railway automatically provisions SSL
   - Wait 5-10 minutes for certificate

### Render Configuration

1. **Navigate to Service Settings**
   - Go to Render dashboard
   - Select your backend service
   - Click "Settings" → "Custom Domain"

2. **Add Custom Domain**
   ```
   Domain: api.mwangilewis.com
   ```

3. **Get CNAME Target**
   - Render provides: `your-service.onrender.com`
   - Add this as CNAME record in DNS

4. **Verify SSL**
   - Render automatically provisions SSL
   - Wait 5-10 minutes for certificate

### Update Backend Environment

```env
FRONTEND_URL=https://mwangilewis.com
```

Update CORS configuration to allow the production domain.

---

## SSL/TLS Certificates

### Automatic SSL (Vercel/Railway/Render)

All platforms provide automatic SSL certificates:
- **Vercel**: Let's Encrypt certificates
- **Railway**: Automatic SSL via Let's Encrypt
- **Render**: Automatic SSL via Let's Encrypt

**No manual configuration needed!**

### Verify SSL

1. **Check Certificate**
   ```bash
   # Check frontend
   curl -I https://mwangilewis.com
   
   # Check backend
   curl -I https://api.mwangilewis.com
   ```

2. **Online Tools**
   - SSL Labs: https://www.ssllabs.com/ssltest/
   - SSL Checker: https://www.sslshopper.com/ssl-checker.html

3. **Expected Results**
   - Certificate valid
   - Grade A or A+
   - TLS 1.2 or 1.3
   - Strong cipher suites

---

## Email Configuration

### Professional Email (Optional)

Set up professional email: `lewis@mwangilewis.com`

#### Option 1: Google Workspace

1. **Sign up for Google Workspace**
   - Go to workspace.google.com
   - Choose plan (starts at $6/user/month)

2. **Verify Domain**
   - Add TXT record provided by Google

3. **Configure MX Records**
   ```
   Priority: 1
   Value: ASPMX.L.GOOGLE.COM
   
   Priority: 5
   Value: ALT1.ASPMX.L.GOOGLE.COM
   
   Priority: 5
   Value: ALT2.ASPMX.L.GOOGLE.COM
   ```

#### Option 2: Zoho Mail (Free)

1. **Sign up for Zoho Mail**
   - Go to zoho.com/mail
   - Free plan: 1 domain, 5 users

2. **Verify Domain**
   - Add TXT record

3. **Configure MX Records**
   ```
   Priority: 10
   Value: mx.zoho.com
   
   Priority: 20
   Value: mx2.zoho.com
   ```

#### Option 3: Email Forwarding

Forward `lewis@mwangilewis.com` to `gathaiyalewis1122@gmail.com`

**Cloudflare Email Routing (Free):**
1. Enable Email Routing in Cloudflare
2. Add destination: `gathaiyalewis1122@gmail.com`
3. Create route: `lewis@mwangilewis.com` → destination

---

## Verification and Testing

### DNS Propagation Check

```bash
# Check DNS propagation
dig mwangilewis.com
dig www.mwangilewis.com
dig api.mwangilewis.com

# Or use online tools
# https://www.whatsmydns.net/
```

**Note**: DNS propagation can take 24-48 hours

### Test All Endpoints

```bash
# Test frontend
curl -I https://mwangilewis.com
curl -I https://www.mwangilewis.com

# Test backend
curl https://api.mwangilewis.com/api/health

# Test HTTPS redirect
curl -I http://mwangilewis.com
# Should redirect to https://
```

### Browser Testing

1. **Open in Browser**
   - https://mwangilewis.com
   - https://www.mwangilewis.com
   - https://api.mwangilewis.com/api/health

2. **Check SSL Certificate**
   - Click padlock icon in browser
   - Verify certificate is valid
   - Check certificate details

3. **Test Functionality**
   - Navigate all pages
   - Submit contact form
   - Check GitHub integration
   - Test admin login

### Performance Testing

```bash
# Test page load time
curl -w "@curl-format.txt" -o /dev/null -s https://mwangilewis.com

# Or use online tools
# https://pagespeed.web.dev/
# https://www.webpagetest.org/
```

---

## Troubleshooting

### DNS Not Resolving

**Problem**: Domain doesn't resolve to your site

**Solutions**:
1. Check DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Clear DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### SSL Certificate Error

**Problem**: Browser shows "Not Secure" warning

**Solutions**:
1. Wait for certificate provisioning (5-10 minutes)
2. Verify domain is correctly configured
3. Check platform dashboard for SSL status
4. Force SSL renewal in platform settings

### WWW Redirect Not Working

**Problem**: www subdomain doesn't redirect

**Solutions**:
1. Verify CNAME record for www
2. Check redirect configuration in Vercel
3. Wait for DNS propagation

### API Subdomain Not Working

**Problem**: api.mwangilewis.com not accessible

**Solutions**:
1. Verify CNAME record points to correct backend
2. Check backend is running and healthy
3. Verify SSL certificate for subdomain
4. Check CORS configuration allows frontend domain

### Mixed Content Warnings

**Problem**: Browser shows mixed content warnings

**Solutions**:
1. Ensure all resources use HTTPS
2. Update API URL to use HTTPS
3. Check for hardcoded HTTP URLs
4. Enable "Upgrade Insecure Requests" header

---

## DNS Record Summary

### Complete DNS Configuration

```
# Root domain
Type: A
Name: @
Value: 76.76.19.61 (Vercel IP)
TTL: 3600

# WWW subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600

# API subdomain
Type: CNAME
Name: api
Value: your-backend.railway.app (or .onrender.com)
TTL: 3600

# Email (if using Google Workspace)
Type: MX
Priority: 1
Value: ASPMX.L.GOOGLE.COM
TTL: 3600

# SPF record (if using email)
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

---

## Maintenance

### Regular Checks

- **Monthly**: Verify SSL certificates are valid
- **Quarterly**: Check DNS records are correct
- **Annually**: Renew domain registration
- **As needed**: Update DNS records for infrastructure changes

### Monitoring

Set up monitoring for:
- Domain expiration alerts
- SSL certificate expiration
- DNS resolution
- Uptime monitoring

**Recommended Tools**:
- UptimeRobot: https://uptimerobot.com/
- Pingdom: https://www.pingdom.com/
- StatusCake: https://www.statuscake.com/

---

## Support Resources

- **Vercel DNS Docs**: https://vercel.com/docs/concepts/projects/domains
- **Railway Custom Domains**: https://docs.railway.app/deploy/custom-domains
- **Render Custom Domains**: https://render.com/docs/custom-domains
- **Cloudflare Docs**: https://developers.cloudflare.com/dns/

---

**Last Updated**: 2024
**Version**: 1.0.0
