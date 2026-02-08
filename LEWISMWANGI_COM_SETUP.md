# 🌐 lewismwangi.com Domain Setup Complete!

## ✅ What's Done

1. **Deployed to Vercel** - Your site is live
2. **Added Custom Domains** - lewismwangi.com and www.lewismwangi.com
3. **Updated Code** - All URLs now point to www.lewismwangi.com
4. **Pushed to GitHub** - Changes are saved

## 🔧 DNS Configuration Required

To make your domain work, you need to add DNS records at your domain registrar (where you bought lewismwangi.com).

### DNS Records to Add:

#### For www.lewismwangi.com:
```
Type: A
Name: www
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### For lewismwangi.com (root domain):
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

## 📋 Step-by-Step DNS Setup

### If using Namecheap:
1. Login to Namecheap
2. Go to Domain List
3. Click "Manage" next to lewismwangi.com
4. Go to "Advanced DNS" tab
5. Click "Add New Record"
6. Add both A records above
7. Save changes

### If using GoDaddy:
1. Login to GoDaddy
2. Go to My Products
3. Click DNS next to lewismwangi.com
4. Click "Add" under Records
5. Add both A records above
6. Save

### If using Google Domains:
1. Login to Google Domains
2. Select lewismwangi.com
3. Click "DNS" in the left menu
4. Scroll to "Custom resource records"
5. Add both A records above
6. Save

### If using Cloudflare:
1. Login to Cloudflare
2. Select lewismwangi.com
3. Go to DNS settings
4. Click "Add record"
5. Add both A records above
6. Set proxy status to "DNS only" (gray cloud icon)
7. Save

### If using another registrar:
1. Login to your domain registrar
2. Find DNS settings or DNS management
3. Add the two A records listed above
4. Save changes

## ⏱️ DNS Propagation Time

- **Minimum**: 5-15 minutes
- **Average**: 30 minutes - 2 hours
- **Maximum**: Up to 48 hours

## 🔍 Check DNS Propagation

### Method 1: Command Line
```powershell
nslookup www.lewismwangi.com
nslookup lewismwangi.com
```

Should show: `76.76.21.21`

### Method 2: Online Tool
Visit: https://dnschecker.org
- Enter: www.lewismwangi.com
- Check if it resolves to 76.76.21.21 globally

## 🎯 Current Status

### Vercel Deployment:
- ✅ Site deployed successfully
- ✅ Domains added to Vercel project
- ✅ Code updated with new URLs
- ⏳ Waiting for DNS configuration

### Your URLs:

**Temporary (works now):**
- https://lewis-portfolio-website-lewis-projects-6eb496b8.vercel.app

**Custom Domain (works after DNS setup):**
- https://www.lewismwangi.com
- https://lewismwangi.com (redirects to www)

## 📊 What Happens After DNS Setup

1. **DNS Propagates** (5 minutes - 48 hours)
2. **Vercel Detects DNS** (automatic)
3. **SSL Certificate Issued** (automatic, 5-10 minutes)
4. **Domain Goes Live** (automatic)
5. **HTTPS Enabled** (automatic)

## ✅ Verification Checklist

After adding DNS records:

- [ ] Added A record for www.lewismwangi.com
- [ ] Added A record for lewismwangi.com
- [ ] Saved DNS changes
- [ ] Waited 15-30 minutes
- [ ] Checked DNS propagation
- [ ] Visited www.lewismwangi.com
- [ ] Verified SSL certificate (https works)
- [ ] Tested all pages
- [ ] Confirmed lewismwangi.com redirects to www

## 🔐 SSL Certificate

Vercel will automatically issue an SSL certificate once DNS is configured. This usually takes 5-10 minutes after DNS propagates.

You'll know it's ready when:
- ✅ https://www.lewismwangi.com loads without warnings
- ✅ Browser shows padlock icon
- ✅ Certificate is valid

## 🎨 Your Live Portfolio

Once DNS is configured, your portfolio will be accessible at:

**Main URL**: https://www.lewismwangi.com

**Features:**
- ✅ Home page with animated hero
- ✅ About page with skills and education
- ✅ Projects page with GitHub integration
- ✅ Experience timeline
- ✅ Contact form
- ✅ Admin dashboard
- ✅ Dark/Light theme toggle
- ✅ Multi-language support (EN/FR/SW)
- ✅ Responsive design
- ✅ SEO optimized

## 🚀 Next Steps

### 1. Configure DNS (Do This Now)
Add the DNS records at your domain registrar as shown above.

### 2. Wait for Propagation
Give it 15-30 minutes for DNS to propagate globally.

### 3. Verify Domain Works
Visit https://www.lewismwangi.com and check if it loads.

### 4. Deploy Backend
Once frontend is working, deploy backend to Railway:
- Go to railway.app
- Deploy from GitHub
- Select backend folder
- Add environment variables
- Connect to frontend

### 5. Update Backend URL
After backend is deployed, add the backend URL to Vercel:
```powershell
vercel env add NEXT_PUBLIC_BACKEND_URL production
```

## 📞 Support

### If domain doesn't work after 2 hours:

1. **Verify DNS Records**
   - Check they're exactly as specified above
   - Ensure no typos in the IP address
   - Confirm records are saved

2. **Check Vercel Dashboard**
   - Go to: https://vercel.com/lewis-projects-6eb496b8/lewis-portfolio-website
   - Click "Settings" → "Domains"
   - Check domain status

3. **Contact Domain Registrar**
   - If DNS still not propagating after 24 hours
   - They can help troubleshoot DNS issues

## 🎉 Summary

Your portfolio is deployed and ready! Just need to:

1. **Add DNS records** at your domain registrar
2. **Wait 15-30 minutes** for DNS to propagate
3. **Visit www.lewismwangi.com** to see your live site!

---

**Current Status**: ✅ Deployed, ⏳ Waiting for DNS configuration

**Temporary URL**: https://lewis-portfolio-website-lewis-projects-6eb496b8.vercel.app

**Final URL**: https://www.lewismwangi.com (after DNS setup)
