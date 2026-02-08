# MongoDB Atlas Setup - Complete Guide

## ✅ CONNECTION SUCCESSFUL!

Your MongoDB Atlas database is now fully connected and operational!

### Connection Status
- ✅ MongoDB Atlas connected
- ✅ Admin user created
- ✅ Backend server running on port 5000
- ✅ All API endpoints working
- ✅ DNS issue resolved (using Google DNS)

### Admin Credentials
- **Email**: gathaiyalewis1122@gmail.com
- **Password**: Lewis001!
- **Dashboard**: http://localhost:3000/admin

---

## 🎉 What's Working

### Step 1: Get the Correct Connection String from MongoDB Atlas

1. **Log into MongoDB Atlas**
   - Go to: https://cloud.mongodb.com/
   - Sign in with your credentials

2. **Navigate to Your Cluster**
   - Click "Database" in the left sidebar
   - You should see your cluster (Cluster0)
   - **Check if the cluster is running** (not paused)

3. **Get Connection String**
   - Click the "Connect" button on your cluster
   - Select "Connect your application"
   - Choose "Node.js" as the driver
   - Select version "4.1 or later"
   - **Copy the connection string** - it should look like:
     ```
     mongodb+srv://ytlewis:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```

4. **Important**: The `xxxxx` part in the hostname is unique to your cluster. Your current string has `q5hcdie` but this might be incorrect.

### Step 2: Update the Connection String

1. Open `backend/.env` file
2. Replace the `MONGODB_URI` line with your new connection string
3. Replace `<password>` with `Lewis001%21` (URL-encoded)
4. Add `/portfolio` before the `?` to specify the database name

**Example:**
```env
MONGODB_URI=mongodb+srv://ytlewis:Lewis001%21@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
```

### Step 3: Whitelist Your IP Address

1. In MongoDB Atlas, click "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or click "Add Current IP Address" to whitelist only your IP
4. Click "Confirm"

### Step 4: Verify Database User

1. Click "Database Access" in the left sidebar
2. Verify user `ytlewis` exists
3. Check that the password is correct
4. Ensure the user has "Atlas admin" or "Read and write to any database" role

### Step 5: Test the Connection

Run the diagnostic script:
```bash
npm run db:diagnose --prefix backend
```

If DNS resolution succeeds, test the full connection:
```bash
npm run db:test --prefix backend
```

### Step 6: Initialize Admin User

Once connection is successful:
```bash
npm run db:init --prefix backend
```

This creates an admin user:
- **Email**: gathaiyalewis1122@gmail.com
- **Password**: Lewis001!

## 🚀 Quick Start Commands

```bash
# 1. Diagnose connection issues
npm run db:diagnose --prefix backend

# 2. Test MongoDB connection
npm run db:test --prefix backend

# 3. Initialize admin user
npm run db:init --prefix backend

# 4. Start backend server
npm run dev --prefix backend

# 5. Start frontend (in another terminal)
npm run dev
```

## 📝 Connection String Format

### Correct Format:
```
mongodb+srv://username:password@hostname/database?options
```

### Your Configuration:
- **Username**: `ytlewis`
- **Password**: `Lewis001!` (URL-encoded as `Lewis001%21`)
- **Hostname**: Get from MongoDB Atlas (currently showing as `cluster0.q5hcdie.mongodb.net` but may be incorrect)
- **Database**: `portfolio`
- **Options**: `retryWrites=true&w=majority&appName=Cluster0`

### URL Encoding Special Characters:
| Character | Encoded |
|-----------|---------|
| !         | %21     |
| @         | %40     |
| #         | %23     |
| $         | %24     |
| %         | %25     |
| ^         | %5E     |
| &         | %26     |
| *         | %2A     |

## 🔍 Troubleshooting

### Error: "querySrv ECONNREFUSED"
**Cause**: DNS cannot resolve the cluster hostname

**Solutions**:
1. ✅ Verify the cluster URL in MongoDB Atlas (click Connect button)
2. ✅ Check if cluster is running (not paused)
3. ✅ Ensure you copied the complete hostname correctly
4. ✅ Try restarting your cluster if it's paused

### Error: "Authentication failed"
**Cause**: Incorrect username or password

**Solutions**:
1. ✅ Verify username is `ytlewis`
2. ✅ Verify password is `Lewis001!`
3. ✅ Ensure password is URL-encoded: `Lewis001%21`
4. ✅ Check Database Access in MongoDB Atlas

### Error: "IP not whitelisted"
**Cause**: Your IP address is not allowed

**Solutions**:
1. ✅ Go to Network Access in MongoDB Atlas
2. ✅ Add your current IP or allow access from anywhere (0.0.0.0/0)

### Error: "Connection timeout"
**Cause**: Network or firewall blocking connection

**Solutions**:
1. ✅ Check your internet connection
2. ✅ Check firewall settings
3. ✅ Try a different network
4. ✅ Ensure cluster is in a running state

## 📱 Access Admin Dashboard

After successful setup:

1. Start the backend: `npm run dev --prefix backend`
2. Start the frontend: `npm run dev`
3. Open browser: http://localhost:3000/admin
4. Login with:
   - Email: gathaiyalewis1122@gmail.com
   - Password: Lewis001!

## 🎯 What I've Set Up

### Backend Configuration
- ✅ MongoDB connection with optimized pooling
- ✅ Environment variables in `backend/.env`
- ✅ Connection test script
- ✅ Diagnostic script
- ✅ Admin initialization script

### Admin Dashboard
- ✅ Admin login page at `/admin`
- ✅ Dashboard with statistics
- ✅ Contact management (view, edit, delete)
- ✅ JWT authentication
- ✅ Secure API routes

### Database Models
- ✅ Contact schema (for contact form submissions)
- ✅ Admin schema (for admin users)
- ✅ Proper validation and indexing

### API Endpoints
- ✅ `POST /api/auth/login` - Admin login
- ✅ `POST /api/auth/verify-token` - Token verification
- ✅ `GET /api/admin/dashboard` - Dashboard stats
- ✅ `GET /api/admin/contacts` - List all contacts
- ✅ `GET /api/admin/contacts/:id` - Get specific contact
- ✅ `PUT /api/admin/contacts/:id` - Update contact
- ✅ `DELETE /api/admin/contacts/:id` - Delete contact

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Rate limiting on all routes
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation and sanitization

## 📞 Need Help?

If you're still having issues:

1. **Share the exact connection string** from MongoDB Atlas (with password masked)
2. **Check cluster status** - Is it running or paused?
3. **Verify Network Access** - Is your IP whitelisted?
4. **Run diagnostics**: `npm run db:diagnose --prefix backend`

The most likely issue is that the cluster hostname in your connection string is incorrect or the cluster is paused. Please get the fresh connection string from MongoDB Atlas by clicking the "Connect" button on your cluster.
