# 🧪 Testing Guide - Lewis Portfolio Website

## 🌐 Live Site
**URL**: https://lewisgathaiya.vercel.app

## ✅ Features to Test

### 1. Contact Form with Green "Sent!" Button

**Steps to Test**:
1. Go to: https://lewisgathaiya.vercel.app/contact
2. Fill in the form:
   - Name: Your Name
   - Email: your@email.com
   - Message: Test message (at least 10 characters)
3. Click "Send Message"
4. **Expected Result**:
   - Button changes to green background
   - Shows "Sent!" with a checkmark ✓
   - Toast notification appears
   - Form clears after 3 seconds
   - Button returns to normal state

**Note**: For the contact form to actually send emails, the backend must be running and deployed.

### 2. Admin Login

**Steps to Test**:
1. Go to: https://lewisgathaiya.vercel.app/admin
2. Enter credentials:
   - **Email**: gathaiyalewis1122@gmail.com
   - **Password**: Lewis001!
3. Click "Sign in"
4. **Expected Result**:
   - Redirects to admin dashboard
   - Shows contact submissions
   - Can view, edit, and delete contacts

**Note**: Admin login requires backend to be running. Currently works with local backend on port 5000.

### 3. Theme Toggle

**Steps to Test**:
1. Look for the sun/moon icon in the navigation
2. Click to toggle between light and dark mode
3. **Expected Result**:
   - Smooth transition between themes
   - All elements change color
   - Preference is saved

### 4. Language Switcher

**Steps to Test**:
1. Look for the language dropdown (EN/FR/SW)
2. Switch between languages
3. **Expected Result**:
   - All text updates immediately
   - Language preference is saved
   - Works on all pages

### 5. Particle Background

**Steps to Test**:
1. Visit the homepage
2. Observe the animated particles
3. Scroll down and up
4. **Expected Result**:
   - Particles animate smoothly
   - Background color changes on scroll
   - Performance is smooth (60fps)

### 6. Navigation

**Steps to Test**:
1. Click each navigation link:
   - Home
   - About
   - Projects
   - Experience
   - Contact
2. **Expected Result**:
   - Each page loads correctly
   - Smooth transitions
   - Active link is highlighted

### 7. Responsive Design

**Steps to Test**:
1. Open site on different devices:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
2. Or use browser DevTools to test
3. **Expected Result**:
   - Layout adapts to screen size
   - All features work on mobile
   - Navigation becomes hamburger menu on mobile

### 8. Projects Page

**Steps to Test**:
1. Go to: https://lewisgathaiya.vercel.app/projects
2. Hover over project cards
3. **Expected Result**:
   - Cards have hover animations
   - GitHub data is displayed
   - Links work correctly

### 9. About Page

**Steps to Test**:
1. Go to: https://lewisgathaiya.vercel.app/about
2. Scroll through the page
3. **Expected Result**:
   - Skills bars animate
   - Timeline displays correctly
   - All information is visible

### 10. Experience Page

**Steps to Test**:
1. Go to: https://lewisgathaiya.vercel.app/experience
2. View the timeline
3. **Expected Result**:
   - Work experience is displayed
   - Timeline is interactive
   - Dates and descriptions are correct

## 🐛 Known Issues & Workarounds

### Issue 1: Contact Form Not Sending Emails
**Cause**: Backend not deployed to production
**Workaround**: 
- Start backend locally: `cd backend && npm start`
- Or deploy backend to Railway/Render

### Issue 2: Admin Login Not Working
**Cause**: Backend not accessible from Vercel
**Workaround**:
- Ensure backend is running locally
- Or deploy backend and update `NEXT_PUBLIC_BACKEND_URL`

### Issue 3: GitHub Projects Not Updating
**Cause**: Backend scheduler not running
**Workaround**:
- Start backend to enable automatic updates
- Or manually trigger update via admin dashboard

## 📊 Performance Checklist

Test these performance metrics:

- [ ] Page loads in under 3 seconds
- [ ] Animations run at 60fps
- [ ] No console errors
- [ ] Images load properly
- [ ] Forms validate correctly
- [ ] Mobile experience is smooth
- [ ] Theme switching is instant
- [ ] Language switching is instant

## 🔧 Backend Setup (For Full Functionality)

To enable all features, start the backend:

```bash
cd backend
npm start
```

Backend will run on: http://localhost:5000

Then test:
1. Contact form submission
2. Admin login
3. Email notifications
4. GitHub data updates

## 📱 Mobile Testing

Test on actual devices:
- iPhone (Safari)
- Android (Chrome)
- iPad (Safari)

Or use browser DevTools:
- Chrome: F12 → Toggle Device Toolbar
- Firefox: F12 → Responsive Design Mode
- Safari: Develop → Enter Responsive Design Mode

## 🎯 Success Criteria

All features should:
- ✅ Load without errors
- ✅ Work on all devices
- ✅ Have smooth animations
- ✅ Validate user input
- ✅ Provide clear feedback
- ✅ Be accessible (keyboard navigation)
- ✅ Support all 3 languages

## 📞 Reporting Issues

If you find any issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Test on different browsers
4. Verify backend is running (if needed)

## 🎊 Testing Complete!

Once all tests pass, your portfolio is ready to share! 🚀

**Share your portfolio**: https://lewisgathaiya.vercel.app

---

**Last Updated**: ${new Date().toLocaleString()}
