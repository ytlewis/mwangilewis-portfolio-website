# ⚠️ ACTION REQUIRED - Complete Your Website Setup

## 🎉 Good News!

Your website **lewismwangi.com** is LIVE and working!

## ⏰ Quick Setup Needed (15 minutes)

To enable **GitHub project links** and **email notifications**, complete these 2 tasks:

---

## Task 1: Update Backend (5 minutes)

### Where is your backend hosted?

#### Option A: Render
1. Open https://dashboard.render.com
2. Click on your backend service
3. Click "Environment" tab on the left
4. Click "Add Environment Variable"
5. Add:
   - **Key**: `GITHUB_USERNAME`
   - **Value**: `lewisgathaiya`
6. Click "Save Changes"
7. Wait 2-3 minutes for automatic redeploy

#### Option B: Railway
1. Open https://railway.app/dashboard
2. Click on your backend project
3. Click "Variables" tab
4. Click "New Variable"
5. Add:
   - **Variable**: `GITHUB_USERNAME`
   - **Value**: `lewisgathaiya`
6. Service will redeploy automatically

---

## Task 2: Setup Email Notifications (10 minutes)

### Step 1: Get Gmail App Password

1. **Open**: https://myaccount.google.com/apppasswords
2. **Sign in** with: gathaiyalewis1122@gmail.com
3. **If asked to enable 2-Step Verification**:
   - Click "Get Started"
   - Follow the prompts (takes 2 minutes)
   - Come back to App Passwords page
4. **Select**:
   - App: "Mail"
   - Device: "Other (Custom name)"
5. **Type**: "Portfolio Website"
6. **Click**: "Generate"
7. **Copy** the 16-character password (looks like: `abcd efgh ijkl mnop`)
8. **Remove spaces**: `abcdefghijklmnop`

### Step 2: Add to Backend

Go back to your backend hosting platform (Render or Railway) and add these 4 variables:

```
EMAIL_SERVICE = gmail
EMAIL_USER = gathaiyalewis1122@gmail.com
EMAIL_PASS = [paste your 16-character password here]
ADMIN_EMAIL = gathaiyalewis1122@gmail.com
```

**On Render**:
- Click "Add Environment Variable" for each one
- Click "Save Changes" after adding all 4

**On Railway**:
- Click "New Variable" for each one
- They save automatically

---

## ✅ Test Your Setup

### Test 1: GitHub Links (1 minute)
1. Go to https://lewismwangi.com/projects
2. Click on any project
3. Click "View Code" button
4. Should open the correct GitHub page

### Test 2: Email Notifications (2 minutes)
1. Go to https://lewismwangi.com/contact
2. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Message: Testing email notifications
3. Click "Send Message"
4. Check your email: gathaiyalewis1122@gmail.com
5. You should receive an email!

---

## 🎯 What You'll Get

### After Task 1 (Backend Update):
✅ All GitHub project links work correctly
✅ Projects page shows live data from your GitHub
✅ "View Code" buttons open correct repositories

### After Task 2 (Email Setup):
✅ Receive email for every contact form submission
✅ Email includes: name, email, message, timestamp
✅ Can reply directly to users from your email

---

## 📱 Quick Links

### Your Website:
- **Home**: https://lewismwangi.com
- **Projects**: https://lewismwangi.com/projects
- **Contact**: https://lewismwangi.com/contact

### Setup Pages:
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
- **Render Dashboard**: https://dashboard.render.com
- **Railway Dashboard**: https://railway.app/dashboard

### Your GitHub:
- **Profile**: https://github.com/lewisgathaiya

---

## 🆘 Need Help?

### GitHub Links Not Working?
- Make sure you added `GITHUB_USERNAME=lewisgathaiya` to backend
- Wait 2-3 minutes after saving for redeploy
- Clear browser cache (Ctrl+Shift+Delete)

### Email Not Working?
- Check you copied all 16 characters of the App Password
- Make sure 2-Step Verification is enabled
- Check backend logs for errors

### Detailed Guides:
- **Email Setup**: Open `EMAIL_SETUP_GUIDE.md`
- **Full Instructions**: Open `START_HERE_FINAL_SETUP.md`

---

## ⏱️ Time Estimate

- **Task 1**: 5 minutes
- **Task 2**: 10 minutes
- **Testing**: 3 minutes
- **Total**: ~18 minutes

---

## 🚀 Ready to Start?

1. **Choose your backend platform** (Render or Railway)
2. **Follow Task 1** above
3. **Follow Task 2** above
4. **Test everything**
5. **Done!** 🎉

Your website will be fully functional with working GitHub links and email notifications!

---

**Questions?** Check the detailed guides in your project folder or review your backend logs.

**Your website is already live at**: https://lewismwangi.com ✨
