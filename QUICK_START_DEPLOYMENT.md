# Quick Start Deployment Guide

Get your Lewis Portfolio Website deployed to production in under 30 minutes!

## Prerequisites

- [ ] GitHub account
- [ ] Domain name purchased (mwangilewis.com)
- [ ] Gmail account with 2FA enabled (for email notifications)

## Step-by-Step Deployment

### 1. MongoDB Atlas Setup (5 minutes)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select region closest to your backend
   - Name: `lewis-portfolio-cluster`

3. **Create Database User**
   - Username: `portfolio-admin`
   - Password: Generate strong password (save it!)

4. **Configure Network Access**
   - Click "Network Access"
   - Add IP: `0.0.0.0/0` (allow from anywhere)

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Add database name: `/lewis-portfolio?`

**Connection String Format:**
```
mongodb+srv://portfolio-admin:YOUR_PASSWORD@cluster.mongodb.net/lewis-portfolio?retryWrites=true&w=majority
```

### 2. Backend Deployment - Railway (10 minutes)

1. **Create Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` folder as root

3. **Add Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=generate-random-string-32-characters
   JWT_EXPIRES_IN=24h
   FRONTEND_URL=https://mwangilewis.com
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ADMIN_EMAIL=gathaiyalewis1122@gmail.com
   GITHUB_TOKEN=your-github-token-optional
   ```

4. **Add Custom Domain**
   - Click "Settings" → "Domains"
   - Add: `api.mwangilewis.com`
   - Copy the CNAME target (e.g., `your-app.railway.app`)

5. **Wait for Deployment**
   - Check logs for successful deployment
   - Test: `https://your-app.railway.app/api/health`

### 3. Frontend Deployment - Vercel (5 minutes)

1. **Create Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework: Next.js (auto-detected)

3. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://api.mwangilewis.com
   NEXT_PUBLIC_SITE_URL=https://mwangilewis.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

5. **Add Custom Domain**
   - Go to "Settings" → "Domains"
   - Add: `mwangilewis.com`
   - Add: `www.mwangilewis.com`

### 4. Domain Configuration (5 minutes)

**Option A: Use Vercel DNS (Recommended)**

1. In Vercel, when adding domain, choose "Use Vercel DNS"
2. Copy the nameservers provided
3. Go to your domain registrar
4. Update nameservers to Vercel's nameservers
5. Add CNAME record in Vercel DNS:
   ```
   Type: CNAME
   Name: api
   Value: your-app.railway.app
   ```

**Option B: Use Your Registrar's DNS**

Add these DNS records at your domain registrar:

```
# Root domain
Type: A
Name: @
Value: 76.76.19.61

# WWW subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com

# API subdomain
Type: CNAME
Name: api
Value: your-app.railway.app
```

### 5. Email Configuration (5 minutes)

1. **Enable 2FA on Gmail**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Enable 2FA

2. **Generate App Password**
   - Go to Security → App passwords
   - Select "Mail" and "Other"
   - Name it "Portfolio Website"
   - Copy the 16-character password

3. **Update Backend Environment**
   - In Railway dashboard
   - Update `EMAIL_PASS` with app password
   - Redeploy if needed

### 6. Initialize Database (3 minutes)

1. **Clone Repository Locally**
   ```bash
   git clone your-repo-url
   cd lewis-portfolio-website/backend
   ```

2. **Create .env File**
   ```bash
   cp .env.example .env
   # Edit .env with your production MongoDB URI
   ```

3. **Run Setup Scripts**
   ```bash
   npm install
   node scripts/test-connection.js
   node scripts/setup-database.js
   node scripts/create-indexes.js
   node scripts/create-admin.js "YourSecurePassword123!"
   ```

### 7. Verification (2 minutes)

**Test Frontend:**
- Visit https://mwangilewis.com
- Check all pages load
- Test theme toggle
- Test language switcher

**Test Backend:**
- Visit https://api.mwangilewis.com/api/health
- Should return: `{"status":"OK","timestamp":"..."}`

**Test Contact Form:**
- Fill out contact form
- Submit
- Check email received

**Test Admin Dashboard:**
- Go to https://mwangilewis.com/admin
- Login with: gathaiyalewis1122@gmail.com
- Use password from step 6
- Verify contact submission appears

## Troubleshooting

### Backend Not Responding
```bash
# Check Railway logs
# Verify environment variables are set
# Test MongoDB connection
```

### Frontend Build Failed
```bash
# Check Vercel logs
# Verify environment variables
# Check for TypeScript errors
```

### Email Not Sending
```bash
# Verify Gmail app password
# Check EMAIL_USER and EMAIL_PASS
# Test with a simple email
```

### Domain Not Resolving
```bash
# Wait for DNS propagation (up to 48 hours)
# Check DNS records are correct
# Use https://www.whatsmydns.net/ to check
```

## Next Steps

After successful deployment:

1. **Security**
   - [ ] Change admin password
   - [ ] Review security headers
   - [ ] Enable rate limiting

2. **Monitoring**
   - [ ] Set up uptime monitoring
   - [ ] Configure error tracking
   - [ ] Enable analytics

3. **Performance**
   - [ ] Run Lighthouse audit
   - [ ] Optimize images
   - [ ] Check load times

4. **Backup**
   - [ ] Configure MongoDB backups
   - [ ] Document environment variables
   - [ ] Test restoration process

## Support

Need help? Check these resources:

- **Full Deployment Guide**: See `DEPLOYMENT.md`
- **MongoDB Setup**: See `MONGODB_ATLAS_SETUP.md`
- **Domain Configuration**: See `DOMAIN_CONFIGURATION.md`
- **Deployment Checklist**: See `DEPLOYMENT_CHECKLIST.md`

---

**Estimated Total Time**: 30 minutes
**Difficulty**: Beginner-friendly

🎉 **Congratulations!** Your portfolio is now live at https://mwangilewis.com
