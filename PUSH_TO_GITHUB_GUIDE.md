# 📤 Push Your Portfolio to GitHub - Complete Guide

## Step 1: Install Git (If Not Installed)

### Download Git for Windows
1. Go to: https://git-scm.com/download/win
2. Download the installer
3. Run the installer (use default settings)
4. Restart your terminal/command prompt

### Verify Git Installation
Open a new terminal and run:
```bash
git --version
```
You should see something like: `git version 2.x.x`

---

## Step 2: Configure Git (First Time Only)

Open your terminal and run these commands:

```bash
# Set your name
git config --global user.name "Lewis Gathaiya"

# Set your email (use your GitHub email)
git config --global user.email "gathaiyalewis1122@gmail.com"

# Verify configuration
git config --list
```

---

## Step 3: Create a GitHub Account (If You Don't Have One)

1. Go to: https://github.com
2. Click "Sign up"
3. Follow the registration process
4. Verify your email

---

## Step 4: Create a New Repository on GitHub

1. **Log in to GitHub**
2. **Click the "+" icon** in the top right
3. **Select "New repository"**
4. **Fill in the details**:
   - Repository name: `lewis-portfolio-website` (or any name you prefer)
   - Description: "Professional portfolio website with multilingual support"
   - Visibility: **Public** (so it can be deployed for free)
   - **DO NOT** check "Initialize with README" (we already have code)
5. **Click "Create repository"**

GitHub will show you a page with instructions. **Keep this page open!**

---

## Step 5: Initialize Git in Your Project

Open your terminal in the project folder and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: Portfolio website with multilingual support"
```

---

## Step 6: Connect to GitHub and Push

Copy the commands from GitHub (they'll look like this):

```bash
# Add GitHub as remote origin (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR_USERNAME/lewis-portfolio-website.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Important**: Replace `YOUR_USERNAME` with your actual GitHub username!

---

## Step 7: Verify Upload

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files uploaded!

---

## 🔒 Important: Protect Sensitive Files

Before pushing, make sure these files are in `.gitignore`:

```
# .gitignore should contain:
node_modules/
.next/
.env
.env.local
.env.production
backend/.env
backend/node_modules/
*.log
.DS_Store
```

Let me check and update your `.gitignore` file...

---

## 📝 What Gets Pushed to GitHub

✅ **Will be pushed**:
- All source code files
- Configuration files
- Documentation
- Public assets
- Package.json files

❌ **Will NOT be pushed** (protected by .gitignore):
- node_modules folders
- .env files (sensitive data)
- Build folders (.next)
- Log files
- Database credentials

---

## 🚨 IMPORTANT: Remove Sensitive Data

**Before pushing, remove sensitive information from these files:**

### 1. Backend .env file
Your `backend/.env` contains:
- MongoDB connection string with password
- JWT secrets

**Solution**: 
- Make sure `backend/.env` is in `.gitignore`
- Create `backend/.env.example` with placeholder values

### 2. Frontend .env.local
Contains backend URL and other configs

**Solution**:
- Make sure `.env.local` is in `.gitignore`
- Create `.env.example` with placeholder values

---

## 🔐 Create Example Environment Files

### Create `backend/.env.example`:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Email Configuration (if using)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Create `.env.example`:
```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Other environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📋 Complete Push Commands (Copy & Paste)

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: Portfolio website with multilingual support"

# 4. Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/lewis-portfolio-website.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔄 Future Updates (After Initial Push)

When you make changes and want to update GitHub:

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with a message
git commit -m "Description of what you changed"

# 4. Push to GitHub
git push origin main
```

---

## 🆘 Troubleshooting

### Error: "git is not recognized"
**Solution**: Install Git from https://git-scm.com/download/win

### Error: "Permission denied"
**Solution**: 
1. Use HTTPS URL (not SSH)
2. GitHub will prompt for username/password
3. Use Personal Access Token instead of password

### Error: "Repository not found"
**Solution**: 
1. Check the repository URL is correct
2. Make sure repository exists on GitHub
3. Check you're logged into the correct GitHub account

### Error: "Failed to push"
**Solution**:
1. Pull first: `git pull origin main`
2. Then push: `git push origin main`

### Large files error
**Solution**:
1. Check file sizes
2. Add large files to `.gitignore`
3. Use Git LFS for large files if needed

---

## 🎯 After Pushing to GitHub

### Next Steps:

1. **Verify Upload**
   - Go to your GitHub repository
   - Check all files are there
   - Verify .env files are NOT visible

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Import your repository
   - Deploy!

3. **Add Repository Description**
   - Go to repository settings
   - Add description
   - Add topics: `portfolio`, `nextjs`, `typescript`, `multilingual`

4. **Add README.md** (optional but recommended)
   - Create a nice README with:
     - Project description
     - Features
     - Technologies used
     - Setup instructions
     - Live demo link

---

## 📱 GitHub Desktop (Alternative Method)

If you prefer a GUI instead of command line:

1. **Download GitHub Desktop**: https://desktop.github.com
2. **Install and sign in**
3. **Add your project**:
   - File → Add Local Repository
   - Select your project folder
4. **Commit changes**:
   - Write commit message
   - Click "Commit to main"
5. **Publish to GitHub**:
   - Click "Publish repository"
   - Choose public/private
   - Click "Publish"

---

## ✅ Checklist Before Pushing

- [ ] Git installed
- [ ] Git configured (name and email)
- [ ] GitHub account created
- [ ] New repository created on GitHub
- [ ] .gitignore file updated
- [ ] Sensitive data removed/protected
- [ ] .env.example files created
- [ ] All changes committed
- [ ] Remote origin added
- [ ] Pushed to GitHub
- [ ] Verified on GitHub website

---

## 🎉 Success!

Once pushed, your repository will be at:
`https://github.com/YOUR_USERNAME/lewis-portfolio-website`

You can now:
- ✅ Share your code
- ✅ Deploy to Vercel
- ✅ Collaborate with others
- ✅ Track changes
- ✅ Show on your resume

---

## 📞 Quick Reference

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## 🔗 Useful Links

- **Git Download**: https://git-scm.com/download/win
- **GitHub**: https://github.com
- **GitHub Desktop**: https://desktop.github.com
- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com

---

**Your code will be safely stored on GitHub and ready to deploy! 🚀**
