# Deployment Guide - Lewis Portfolio Website

This guide covers deploying the Lewis Portfolio Website to production environments.

## 📚 Documentation Index

- **Quick Start**: [`QUICK_START_DEPLOYMENT.md`](./QUICK_START_DEPLOYMENT.md) - Deploy in 30 minutes
- **Deployment Checklist**: [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) - Complete pre/post-deployment checklist
- **MongoDB Setup**: [`MONGODB_ATLAS_SETUP.md`](./MONGODB_ATLAS_SETUP.md) - Detailed database configuration
- **Domain Configuration**: [`DOMAIN_CONFIGURATION.md`](./DOMAIN_CONFIGURATION.md) - DNS and domain setup
- **This Guide**: Comprehensive deployment instructions

## 🌐 Architecture Overview

- **Frontend**: Deployed on Vercel (Next.js)
- **Backend**: Deployed on Railway or Render (Node.js/Express)
- **Database**: MongoDB Atlas (Cloud)
- **Domain**: mwangilewis.com

## 🚀 Quick Start

For a streamlined deployment process, see [`QUICK_START_DEPLOYMENT.md`](./QUICK_START_DEPLOYMENT.md).

The quick start guide will have you deployed in approximately 30 minutes.

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository
- Vercel account
- Domain configured (mwangilewis.com)

### Steps

1. **Connect Repository to Vercel**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project root
   vercel
   ```

2. **Configure Environment Variables in Vercel Dashboard**
   ```env
   NEXT_PUBLIC_API_URL=https://api.mwangilewis.com
   NEXT_PUBLIC_SITE_URL=https://mwangilewis.com
   ```

3. **Domain Configuration**
   - Add custom domain: `mwangilewis.com`
   - Configure DNS records:
     ```
     Type: A
     Name: @
     Value: 76.76.19.61 (Vercel IP)
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

4. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Automatic Deployments
- Main branch deploys to production
- Pull requests create preview deployments
- Build logs available in Vercel dashboard

## 🖥️ Backend Deployment

### Option 1: Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect GitHub repository
   - Select backend folder as root

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lewis-portfolio
   JWT_SECRET=your-super-secret-jwt-key-production
   JWT_EXPIRES_IN=24h
   FRONTEND_URL=https://mwangilewis.com
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=gathaiyalewis1122@gmail.com
   GITHUB_TOKEN=your-github-token
   ```

3. **Custom Domain**
   - Add custom domain: `api.mwangilewis.com`
   - Configure DNS:
     ```
     Type: CNAME
     Name: api
     Value: your-app.railway.app
     ```

### Option 2: Render

1. **Create Web Service**
   - Connect GitHub repository
   - Select backend folder
   - Use `render.yaml` configuration

2. **Environment Variables**
   - Same as Railway configuration above
   - Configure in Render dashboard

3. **Database Setup**
   - Create MongoDB database in Render
   - Or use external MongoDB Atlas

### Option 3: Docker Deployment

1. **Build Docker Image**
   ```bash
   cd backend
   docker build -t lewis-portfolio-api .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name lewis-portfolio-api \
     -p 5000:5000 \
     --env-file .env \
     lewis-portfolio-api
   ```

3. **Docker Compose** (Optional)
   ```yaml
   version: '3.8'
   services:
     api:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=${MONGODB_URI}
         - JWT_SECRET=${JWT_SECRET}
       depends_on:
         - mongodb
     
     mongodb:
       image: mongo:latest
       ports:
         - "27017:27017"
       volumes:
         - mongodb_data:/data/db
   
   volumes:
     mongodb_data:
   ```

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster (Free tier available)
   - Choose region closest to your backend

2. **Database Configuration**
   ```
   Database Name: lewis-portfolio
   Collections: contacts, admins
   ```

3. **Security Setup**
   - Create database user
   - Configure IP whitelist (0.0.0.0/0 for cloud deployment)
   - Get connection string

4. **Connection String Format**
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lewis-portfolio?retryWrites=true&w=majority
   ```

## 📧 Email Service Setup

### Gmail Configuration

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA

2. **Generate App Password**
   - Go to App Passwords section
   - Generate password for "Mail"
   - Use this password in EMAIL_PASS

3. **Environment Variables**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ADMIN_EMAIL=gathaiyalewis1122@gmail.com
   ```

### Alternative: SendGrid

1. **Create SendGrid Account**
   - Sign up at [SendGrid](https://sendgrid.com)
   - Verify sender identity

2. **Get API Key**
   - Create API key with mail send permissions

3. **Update Email Service**
   ```javascript
   // In backend/services/emailService.js
   // Replace Nodemailer with SendGrid configuration
   ```

## 🔐 Security Configuration

### SSL/TLS Certificates
- Vercel: Automatic SSL
- Railway/Render: Automatic SSL
- Custom deployment: Use Let's Encrypt

### Environment Security
```env
# Use strong, unique values for production
JWT_SECRET=generate-a-strong-random-string-here
MONGODB_URI=use-connection-string-with-strong-password
EMAIL_PASS=use-app-specific-password
```

### Security Headers
- Configured in `backend/server.js` with Helmet.js
- Additional headers in `vercel.json`

## 📊 Monitoring and Analytics

### Health Checks
- Backend: `/api/health` endpoint
- Frontend: Vercel automatic monitoring

### Error Tracking
```javascript
// Add to backend/server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});
```

### Performance Monitoring
- Vercel Analytics (built-in)
- Google Analytics (add to frontend)
- Backend performance monitoring with APM tools

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: cd backend && npm install && npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🧪 Production Testing

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Email service configured
- [ ] SSL certificates active
- [ ] Domain DNS configured
- [ ] Health checks responding

### Automated Deployment Scripts

The backend includes several scripts to help with deployment:

```bash
cd backend

# Test database connection
npm run test:connection

# Set up database collections
npm run setup:db

# Create database indexes
npm run setup:indexes

# Create admin user (provide password as argument)
npm run setup:admin "YourSecurePassword123!"

# Verify complete deployment
npm run verify:deployment
```

### Post-deployment Verification

Run the comprehensive verification script:

```bash
cd backend
FRONTEND_URL=https://mwangilewis.com \
BACKEND_URL=https://api.mwangilewis.com \
npm run verify:deployment
```

This script tests:
- ✅ Environment variables
- ✅ Database connection
- ✅ Backend health endpoint
- ✅ CORS configuration
- ✅ Security headers
- ✅ Frontend accessibility
- ✅ SSL/HTTPS configuration
- ✅ GitHub integration
- ✅ Email configuration

### Manual Testing
```bash
# Test API endpoints
curl https://api.mwangilewis.com/api/health

# Test frontend
curl https://mwangilewis.com

# Test contact form
curl -X POST https://api.mwangilewis.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Check TypeScript compilation errors

2. **Database Connection Issues**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure database user has proper permissions

3. **Email Not Sending**
   - Verify Gmail app password
   - Check SMTP configuration
   - Test with email service provider

4. **CORS Errors**
   - Verify frontend URL in backend CORS config
   - Check environment variables
   - Ensure proper headers

### Logs and Debugging
- Vercel: Function logs in dashboard
- Railway: Application logs in dashboard
- Render: Logs in service dashboard

## 📈 Scaling Considerations

### Performance Optimization
- Enable Vercel Edge Functions
- Implement Redis caching for backend
- Use CDN for static assets
- Database indexing optimization

### Load Balancing
- Railway/Render: Automatic scaling
- Custom deployment: Use load balancer
- Database: MongoDB Atlas auto-scaling

## 🔄 Backup and Recovery

### Database Backups
- MongoDB Atlas: Automatic backups
- Manual exports: `mongodump` command
- Backup frequency: Daily recommended

### Code Backups
- GitHub repository (primary)
- Local development backups
- Deployment artifacts

---

## 📞 Support

For deployment issues:
1. Check logs in respective platforms
2. Review environment variables
3. Test individual components
4. Contact platform support if needed

**Author**: Lewis Gathaiya  
**Email**: gathaiyalewis1122@gmail.com  
**Website**: [mwangilewis.com](https://mwangilewis.com)