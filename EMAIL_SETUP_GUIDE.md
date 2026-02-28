# Email Notification Setup Guide

## Overview
This guide will help you set up email notifications so that when users submit the contact form, you'll receive an email at gathaiyalewis1122@gmail.com.

## Step 1: Generate Gmail App Password

Since Gmail requires App Passwords for third-party applications, follow these steps:

### 1. Enable 2-Step Verification (if not already enabled)
1. Go to https://myaccount.google.com/security
2. Scroll down to "How you sign in to Google"
3. Click on "2-Step Verification"
4. Follow the prompts to enable it

### 2. Create an App Password
1. Go to https://myaccount.google.com/apppasswords
2. You may need to sign in again
3. Under "Select app", choose "Mail"
4. Under "Select device", choose "Other (Custom name)"
5. Enter "Portfolio Website" as the name
6. Click "Generate"
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
8. Remove the spaces to get: `abcdefghijklmnop`

## Step 2: Update Backend Environment Variables

### For Local Development (backend/.env):
```env
EMAIL_SERVICE=gmail
EMAIL_USER=gathaiyalewis1122@gmail.com
EMAIL_PASS=abcdefghijklmnop
ADMIN_EMAIL=gathaiyalewis1122@gmail.com
```

### For Production (Render/Railway):
You need to update the environment variables on your hosting platform:

#### If using Render:
1. Go to https://dashboard.render.com
2. Select your backend service
3. Go to "Environment" tab
4. Update these variables:
   - `EMAIL_SERVICE` = `gmail`
   - `EMAIL_USER` = `gathaiyalewis1122@gmail.com`
   - `EMAIL_PASS` = `your-16-character-app-password`
   - `ADMIN_EMAIL` = `gathaiyalewis1122@gmail.com`
5. Click "Save Changes"
6. The service will automatically redeploy

#### If using Railway:
1. Go to https://railway.app/dashboard
2. Select your backend project
3. Go to "Variables" tab
4. Update these variables:
   - `EMAIL_SERVICE` = `gmail`
   - `EMAIL_USER` = `gathaiyalewis1122@gmail.com`
   - `EMAIL_PASS` = `your-16-character-app-password`
   - `ADMIN_EMAIL` = `gathaiyalewis1122@gmail.com`
5. The service will automatically redeploy

## Step 3: Test Email Notifications

### Test Locally:
1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Submit a test contact form on your website
3. Check your email at gathaiyalewis1122@gmail.com
4. You should receive an email with the subject: "New Contact Form Submission from [Name]"

### Test in Production:
1. Go to https://lewismwangi.com/contact
2. Fill out and submit the contact form
3. Check your email at gathaiyalewis1122@gmail.com

## Email Notification Features

When a user submits the contact form, you'll receive an email containing:
- **Subject**: "New Contact Form Submission from [User's Name]"
- **Contact Details**:
  - Name
  - Email address
  - Submission timestamp
- **Message**: The full message from the user
- **Footer**: Confirmation that it was sent from mwangilewis.com

## Troubleshooting

### Email not sending?
1. **Check App Password**: Make sure you copied the 16-character password correctly (no spaces)
2. **Check 2-Step Verification**: Ensure it's enabled on your Google account
3. **Check Environment Variables**: Verify they're set correctly in your hosting platform
4. **Check Logs**: Look at your backend logs for error messages
5. **Test Connection**: Run the email service test script:
   ```bash
   cd backend
   node -e "const emailService = require('./services/emailService'); emailService.sendContactNotification({name: 'Test', email: 'test@example.com', message: 'Test message'}).then(console.log).catch(console.error)"
   ```

### Still not working?
- Check if Gmail is blocking the login attempt
- Go to https://myaccount.google.com/notifications
- Look for any security alerts
- Make sure "Less secure app access" is NOT needed (App Passwords bypass this)

## Security Notes

- **Never commit your App Password to Git**
- The `.env` file is already in `.gitignore`
- Always use environment variables for sensitive data
- Rotate your App Password periodically for security

## Alternative: Using SendGrid (Optional)

If you prefer to use SendGrid instead of Gmail:

1. Sign up at https://sendgrid.com
2. Get your API key
3. Update backend/.env:
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your-sendgrid-api-key
   EMAIL_USER=noreply@lewismwangi.com
   ADMIN_EMAIL=gathaiyalewis1122@gmail.com
   ```
4. Update the email service code to use SendGrid

## Next Steps

After setting up email notifications:
1. ✅ Generate Gmail App Password
2. ✅ Update environment variables (local and production)
3. ✅ Test email notifications
4. ✅ Deploy changes to production
5. ✅ Monitor email delivery

---

**Need Help?** If you encounter any issues, check the backend logs or contact support.
