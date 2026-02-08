# Clear Browser Cache - Fix Content Not Showing

The content is working on other devices but not on your local device because your browser has cached the old version.

## Quick Fix - Hard Refresh

**In Microsoft Edge (or Chrome):**
1. Open http://localhost:3000
2. Press **Ctrl + Shift + R** (or **Ctrl + F5**)
3. This will force a hard refresh and bypass the cache

## If Hard Refresh Doesn't Work

### Option 1: Clear Edge Cache Manually
1. Open Edge
2. Press **Ctrl + Shift + Delete**
3. Select:
   - Time range: **All time**
   - Check: **Cached images and files**
   - Check: **Cookies and other site data**
4. Click **Clear now**
5. Close and reopen Edge
6. Go to http://localhost:3000

### Option 2: Use Incognito/Private Mode
1. Open Edge
2. Press **Ctrl + Shift + N** (opens private window)
3. Go to http://localhost:3000
4. Content should display correctly

### Option 3: Disable Cache in DevTools
1. Open Edge
2. Press **F12** to open DevTools
3. Go to **Network** tab
4. Check the box **Disable cache**
5. Keep DevTools open
6. Refresh the page with **Ctrl + R**

## After Clearing Cache

The About and Experience pages should now display content correctly without it disappearing!

**Test URLs:**
- Homepage: http://localhost:3000
- About: http://localhost:3000/about
- Experience: http://localhost:3000/experience
- Contact: http://localhost:3000/contact
