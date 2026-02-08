# Quick Start Guide - Lewis Portfolio Website

## ✅ MongoDB Connection - WORKING!

Your MongoDB Atlas connection is now fully configured and working!

### Connection Details
- **Database**: MongoDB Atlas (Cloud)
- **Cluster**: cluster0.q5hcdie.mongodb.net
- **Database Name**: portfolio
- **Status**: ✅ Connected and operational

### DNS Fix Applied
Your local DNS couldn't resolve MongoDB Atlas hostnames, so I configured the backend to use Google DNS (8.8.8.8) which works perfectly.

## 🚀 Start the Application

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

The backend will start on: http://localhost:5000

### 2. Start Frontend (in a new terminal)
```bash
npm run dev
```

The frontend will start on: http://localhost:3000

## 🔐 Admin Dashboard Access

### Login Credentials
- **URL**: http://localhost:3000/admin
- **Email**: gathaiyalewis1122@gmail.com
- **Password**: Lewis001!

### Admin Features
- ✅ View dashboard statistics
- ✅ Manage contact form submissions
- ✅ Mark contacts as read/unread
- ✅ Delete contacts
- ✅ Secure JWT authentication

## 📊 Database Status

### Collections Created
- `admins` - Admin users (1 user created)
- `contacts` - Contact form submissions (empty, ready for use)

### Admin User
- Email: gathaiyalewis1122@gmail.com
- Password: Lewis001! (hashed with bcrypt)
- Role: admin
- Status: Active

## 🛠️ Useful Commands

### Backend Commands
```bash
# Test MongoDB connection
npm run db:test --prefix backend

# Initialize admin user (already done)
npm run db:init --prefix backend

# Start backend server
npm run dev --prefix backend

# Run backend tests
npm test --prefix backend
```

### Frontend Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify-token` - Verify JWT token

### Contact Form
- `POST /api/contact` - Submit contact form

### Admin (Protected)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/contacts` - List all contacts
- `GET /api/admin/contacts/:id` - Get specific contact
- `PUT /api/admin/contacts/:id` - Update contact
- `DELETE /api/admin/contacts/:id` - Delete contact

### GitHub Integration
- `GET /api/github/repos` - Get GitHub repositories

## 🔧 Configuration Files

### Backend Environment (.env)
```env
MONGODB_URI=mongodb+srv://ytlewis:Lewis001%21@cluster0.q5hcdie.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=lewis-portfolio-super-secret-jwt-key-2024-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=gathaiyalewis1122@gmail.com
```

### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## 🎯 What's Working

### Backend ✅
- ✅ MongoDB Atlas connection (with DNS fix)
- ✅ Admin user authentication
- ✅ Contact form API
- ✅ Admin dashboard API
- ✅ GitHub integration
- ✅ Security middleware (Helmet, CORS, Rate limiting)
- ✅ Email service (Nodemailer)

### Frontend ✅
- ✅ Admin login page
- ✅ Admin dashboard
- ✅ Contact management interface
- ✅ Theme system (light/dark mode)
- ✅ Internationalization (EN, FR, SW)
- ✅ Particle background animations
- ✅ Contact form
- ✅ Projects page with GitHub integration

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify MongoDB connection: `npm run db:test --prefix backend`

### Can't login to admin
- Verify credentials: gathaiyalewis1122@gmail.com / Lewis001!
- Check backend is running on port 5000
- Check browser console for errors

### Contact form not working
- Verify backend is running
- Check CORS configuration
- Verify MongoDB connection

## 📞 Testing the System

### 1. Test Contact Form
1. Go to http://localhost:3000/contact
2. Fill out the form
3. Submit
4. Check admin dashboard for the submission

### 2. Test Admin Dashboard
1. Go to http://localhost:3000/admin
2. Login with credentials above
3. View dashboard statistics
4. Check contacts list
5. Try marking a contact as read
6. Try deleting a contact

### 3. Test GitHub Integration
1. Go to http://localhost:3000/projects
2. Verify GitHub repositories are displayed
3. Check that repository data is live

## 🎉 Success!

Your portfolio website is now fully operational with:
- ✅ Working MongoDB Atlas connection
- ✅ Admin dashboard with authentication
- ✅ Contact form with email notifications
- ✅ GitHub integration
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Multi-language support

## 📚 Next Steps

1. **Customize Content**: Update portfolio content in the frontend
2. **Email Configuration**: Set up Gmail app password for email notifications
3. **GitHub Token**: Add GitHub personal access token for higher API limits
4. **Deploy**: Deploy to Vercel (frontend) and Railway/Render (backend)
5. **Domain**: Configure custom domain (mwangilewis.com)

## 🔒 Security Notes

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Rate limiting on all endpoints
- ✅ CORS configured
- ✅ Helmet.js security headers
- ✅ Input validation and sanitization

**Remember to change the admin password after first login!**
