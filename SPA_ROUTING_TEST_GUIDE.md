# SPA Routing Fix - Quick Test Guide

**Date:** January 20, 2026  
**Status:** ✅ Ready to Test

---

## Quick Test (2 Minutes)

### Test 1: Direct URL Access ⭐

**Before Fix:** 404 error  
**After Fix:** Page loads correctly

1. Open your browser
2. Go to: `https://qey66h1e3v.preview.c24.airoapp.ai/properties`
3. ✅ **Expected:** Properties page loads (not 404)

---

### Test 2: Page Refresh ⭐

**Before Fix:** 404 error  
**After Fix:** Page reloads correctly

1. Click on any property to view details
2. Press **F5** or **Ctrl+R** (Cmd+R on Mac)
3. ✅ **Expected:** Same page reloads (not 404)

---

### Test 3: Open in New Tab ⭐

**Before Fix:** 404 error  
**After Fix:** Opens correctly

1. Right-click any "View Details" button
2. Select "Open link in new tab"
3. ✅ **Expected:** Property page opens in new tab (not 404)

---

### Test 4: Share Link ⭐

**Before Fix:** Shared link shows 404  
**After Fix:** Shared link works

1. Navigate to any property: `/properties/1`
2. Copy URL from address bar
3. Open in **incognito/private window**
4. Paste URL and press Enter
5. ✅ **Expected:** Property page loads (not 404)

---

## All Routes to Test

### Public Routes
- ✅ `/` - Home page
- ✅ `/properties` - Properties listing
- ✅ `/properties/1` - Property detail (any ID)
- ✅ `/login` - Login page
- ✅ `/register` - Register page
- ✅ `/pricing` - Pricing page
- ✅ `/terms` - Terms page
- ✅ `/privacy` - Privacy page

### Protected Routes (Login Required)
- ✅ `/profile` - User profile
- ✅ `/dashboard` - Admin dashboard (admin only)

---

## Verify API Still Works

### Test API Endpoints

1. Open DevTools (F12)
2. Go to **Network** tab
3. Navigate to properties page
4. Look for API calls:
   - ✅ `GET /api/properties` → Returns JSON
   - ✅ `GET /api/auth/me` → Returns JSON
5. ✅ **Expected:** All API calls return JSON (not HTML)

---

## Verify Static Assets Load

1. Open any page
2. Check:
   - ✅ Images load
   - ✅ CSS is applied (page is styled)
   - ✅ JavaScript works (buttons clickable)
   - ✅ No console errors

---

## Common Test Scenarios

### Scenario 1: User Bookmarks Property
1. User visits property: `/properties/5`
2. User bookmarks the page
3. User closes browser
4. User opens bookmark later
5. ✅ **Expected:** Property page loads directly

### Scenario 2: User Shares Link on Social Media
1. User copies property URL: `/properties/10`
2. User shares on WhatsApp/Email/SMS
3. Friend clicks the link
4. ✅ **Expected:** Property page opens (not 404)

### Scenario 3: User Refreshes During Form Fill
1. User navigates to register page: `/register`
2. User fills out form
3. User accidentally presses F5
4. ✅ **Expected:** Register page reloads (form resets, but no 404)

### Scenario 4: User Uses Browser Back Button
1. User navigates: Home → Properties → Property Detail
2. User presses browser Back button twice
3. ✅ **Expected:** Returns to Home page (no 404)

---

## What Should NOT Break

### ✅ Navigation Still Works
- Clicking links navigates correctly
- React Router transitions work
- No page reloads on navigation

### ✅ API Calls Still Work
- All `/api/*` endpoints return JSON
- Authentication works
- Data fetching works

### ✅ Static Assets Still Load
- Images display
- CSS applies
- JavaScript executes
- Fonts load

### ✅ Vite HMR Still Works (Development)
- Code changes trigger hot reload
- No full page refresh needed
- State preserved during HMR

---

## Troubleshooting

### If Test Fails

#### Still Getting 404 on Refresh
1. Check server logs for errors
2. Verify server restarted successfully
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try hard refresh (Ctrl+Shift+R)

#### API Returns HTML Instead of JSON
1. Check middleware order in `src/server/configure.js`
2. Ensure API check comes BEFORE fallback
3. Restart server

#### Static Assets Return HTML
1. Check file extension check in fallback
2. Verify `path.extname(req.path)` is working
3. Check browser Network tab for asset requests

---

## Success Criteria

### All Tests Must Pass ✅

- [x] Direct URL access works
- [x] Page refresh works
- [x] Open in new tab works
- [x] Share link works
- [x] All routes load correctly
- [x] API endpoints return JSON
- [x] Static assets load
- [x] Navigation still works
- [x] No console errors

---

## Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________

✅ Test 1: Direct URL Access - PASS / FAIL
✅ Test 2: Page Refresh - PASS / FAIL
✅ Test 3: Open in New Tab - PASS / FAIL
✅ Test 4: Share Link - PASS / FAIL
✅ API Endpoints - PASS / FAIL
✅ Static Assets - PASS / FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## Quick Command Line Tests

```bash
# Test direct URL (should return HTML)
curl -I https://qey66h1e3v.preview.c24.airoapp.ai/properties
# Expected: 200 OK, Content-Type: text/html

# Test API endpoint (should return JSON)
curl -I https://qey66h1e3v.preview.c24.airoapp.ai/api/properties
# Expected: 200 OK, Content-Type: application/json

# Test static asset (should return image)
curl -I https://qey66h1e3v.preview.c24.airoapp.ai/favicon.ico
# Expected: 200 OK, Content-Type: image/x-icon
```

---

## Browser Compatibility

Test on multiple browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

**Last Updated:** January 20, 2026  
**Platform:** ownaccessy  
**Test Version:** 1.0
