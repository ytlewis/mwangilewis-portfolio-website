# Production Deployment Checklist

This checklist ensures all necessary steps are completed before deploying the Lewis Portfolio Website to production.

## Pre-Deployment Checklist

### 1. Code Quality and Testing
- [ ] All unit tests passing (`npm test` in root and backend)
- [ ] All property-based tests passing
- [ ] All integration tests passing
- [ ] No TypeScript compilation errors
- [ ] No ESLint warnings or errors
- [ ] Code reviewed and approved

### 2. Environment Configuration

#### Frontend Environment Variables
- [ ] `NEXT_PUBLIC_API_URL` set to production API URL
- [ ] `NEXT_PUBLIC_SITE_URL` set to https://mwangilewis.com
- [ ] Analytics IDs configured (if using)
- [ ] All environment variables added to Vercel dashboard

#### Backend Environment Variables
- [ ] `MONGODB_URI` configured with MongoDB Atlas connection string
- [ ] `JWT_SECRET` set to a strong, unique random string (min 32 characters)
- [ ] `JWT_EXPIRES_IN` configured appropriately
- [ ] `NODE_ENV` set to "production"
- [ ] `PORT` configured (Railway/Render will set this automatically)
- [ ] `FRONTEND_URL` set to https://mwangilewis.com
- [ ] `EMAIL_SERVICE` configured (gmail or sendgrid)
- [ ] `EMAIL_USER` and `EMAIL_PASS` configured with app-specific password
- [ ] `ADMIN_EMAIL` set to gathaiyalewis1122@gmail.com
- [ ] `GITHUB_TOKEN` configured (optional but recommended)
- [ ] All environment variables added to hosting platform

### 3. Database Setup (MongoDB Atlas)

- [ ] MongoDB Atlas account created
- [ ] Cluster created and configured
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0 for cloud deployments)
- [ ] Connection string obtained and tested
- [ ] Database name set to "lewis-portfolio"
- [ ] Collections created: `contacts`, `admins`
- [ ] Indexes configured for performance
- [ ] Backup schedule configured
- [ ] Admin user created in database (run setup script)

### 4. Email Service Configuration

#### Option A: Gmail
- [ ] Gmail account 2FA enabled
- [ ] App-specific password generated
- [ ] Test email sent successfully

#### Option B: SendGrid
- [ ] SendGrid account created
- [ ] API key generated
- [ ] Sender identity verified
- [ ] Test email sent successfully

### 5. GitHub Integration

- [ ] GitHub personal access token generated
- [ ] Token has appropriate permissions (public_repo)
- [ ] GitHub API tested and working
- [ ] Fallback data prepared for API failures

### 6. Frontend Deployment (Vercel)

- [ ] Vercel account created and connected to GitHub
- [ ] Project imported to Vercel
- [ ] Build settings configured:
  - Framework: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`
- [ ] Environment variables configured in Vercel dashboard
- [ ] Custom domain added: mwangilewis.com
- [ ] DNS records configured:
  - A record: @ → Vercel IP
  - CNAME record: www → cname.vercel-dns.com
- [ ] SSL certificate active and verified
- [ ] Automatic deployments enabled for main branch
- [ ] Preview deployments enabled for pull requests

### 7. Backend Deployment

#### Option A: Railway
- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Backend folder selected as root
- [ ] Environment variables configured
- [ ] Custom domain added: api.mwangilewis.com
- [ ] DNS CNAME record configured
- [ ] Health check endpoint verified
- [ ] Automatic deployments enabled

#### Option B: Render
- [ ] Render account created
- [ ] Web service created
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Custom domain added: api.mwangilewis.com
- [ ] DNS CNAME record configured
- [ ] Health check endpoint verified
- [ ] Automatic deployments enabled

#### Option C: Docker/Custom
- [ ] Docker image built and tested
- [ ] Container registry configured
- [ ] Deployment server configured
- [ ] Environment variables set
- [ ] Health checks configured
- [ ] SSL certificate installed
- [ ] Reverse proxy configured (nginx/caddy)

### 8. Domain Configuration

- [ ] Domain purchased: mwangilewis.com
- [ ] DNS provider configured
- [ ] A record for root domain configured
- [ ] CNAME record for www subdomain configured
- [ ] CNAME record for api subdomain configured
- [ ] DNS propagation verified (use dig or nslookup)
- [ ] SSL certificates active for all subdomains

### 9. Security Configuration

- [ ] HTTPS enforced on all endpoints
- [ ] Security headers configured (Helmet.js)
- [ ] CORS policies properly configured
- [ ] Rate limiting active and tested
- [ ] Input validation working on all endpoints
- [ ] JWT tokens using secure settings
- [ ] Passwords hashed with bcrypt
- [ ] No sensitive data in logs
- [ ] No environment variables committed to git

### 10. Performance Optimization

- [ ] Frontend build optimized (check bundle size)
- [ ] Images optimized and using Next.js Image component
- [ ] Database queries optimized with indexes
- [ ] Caching implemented where appropriate
- [ ] CDN configured for static assets
- [ ] Lazy loading implemented for heavy components
- [ ] Animation performance tested on various devices

### 11. Monitoring and Analytics

- [ ] Health check endpoints responding
- [ ] Error tracking configured (Sentry optional)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Log aggregation configured
- [ ] Analytics configured (Google Analytics optional)

### 12. Backup and Recovery

- [ ] Database backup schedule configured
- [ ] Backup restoration tested
- [ ] Code repository backed up (GitHub)
- [ ] Environment variables documented securely
- [ ] Recovery procedures documented

## Post-Deployment Verification

### Functional Testing
- [ ] Homepage loads correctly
- [ ] All pages accessible and rendering properly
- [ ] Navigation working across all pages
- [ ] Theme toggle working (light/dark mode)
- [ ] Language switcher working (English/Swahili/French)
- [ ] Particle animations rendering smoothly
- [ ] Contact form submitting successfully
- [ ] Email notifications being received
- [ ] Admin login working
- [ ] Admin dashboard displaying data correctly
- [ ] GitHub projects displaying with live data
- [ ] Mobile responsive design working
- [ ] All links working correctly

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90 for performance
- [ ] Lighthouse score > 90 for accessibility
- [ ] Lighthouse score > 90 for SEO
- [ ] Animations running at 60fps
- [ ] No console errors in browser
- [ ] API response times acceptable

### Security Testing
- [ ] HTTPS working on all pages
- [ ] Security headers present (check with securityheaders.com)
- [ ] CORS working correctly
- [ ] Rate limiting preventing abuse
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] Admin routes protected
- [ ] JWT tokens expiring correctly

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large mobile (414x896)

## Rollback Plan

In case of deployment issues:

1. **Frontend Rollback (Vercel)**
   - Go to Vercel dashboard
   - Navigate to Deployments
   - Select previous working deployment
   - Click "Promote to Production"

2. **Backend Rollback (Railway/Render)**
   - Revert to previous commit in GitHub
   - Trigger new deployment
   - Or use platform's rollback feature

3. **Database Rollback**
   - Restore from latest backup
   - Verify data integrity
   - Test application functionality

## Support Contacts

- **Developer**: Lewis Gathaiya
- **Email**: gathaiyalewis1122@gmail.com
- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/help
- **Render Support**: https://render.com/docs/support
- **MongoDB Atlas Support**: https://www.mongodb.com/cloud/atlas/support

## Notes

- Keep this checklist updated as deployment procedures evolve
- Document any issues encountered during deployment
- Update environment variables documentation when adding new variables
- Review and update security configurations regularly
- Test backup restoration procedures quarterly

---

**Last Updated**: 2024
**Version**: 1.0.0
