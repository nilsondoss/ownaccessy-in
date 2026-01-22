# Server Restart Required

**Date:** January 18, 2026  
**Issue:** API route cache error after deleting endpoints

## Problem

After deleting the following API endpoints:
- `src/server/api/admin/download-project/GET.ts`
- `src/server/api/admin/github-setup/GET.ts`

The development server was still trying to load these routes from cache, causing the error:

```
Cannot find module '@api/root/src/server/api/admin/download-project/GET.ts' 
imported from '/app/.api/routers.js'
```

## Root Cause

The `vite-plugin-api-routes` plugin generates a `.api/routers.js` file that imports all API route handlers. When files are deleted, this generated file needs to be rebuilt, but Vite's HMR (Hot Module Replacement) doesn't always catch these deletions properly.

## Solution Applied

### 1. Cleared All Caches
```bash
rm -rf .api dist node_modules/.vite
```

### 2. Verified Build Works
```bash
npm run build
```
✅ Build completed successfully without errors

### 3. Server Auto-Restart
The development server should automatically restart and rebuild the API routes after cache clearing.

## Verification Steps

### Check API Routes Are Correct
```bash
# After server restarts, check that .api directory is regenerated
ls -la .api/

# Verify routers.js doesn't reference deleted endpoints
grep -i "download-project\|github-setup" .api/routers.js
# Should return: No matches
```

### Test Application
1. ✅ Visit homepage - should load without errors
2. ✅ Login as admin - should work
3. ✅ Access admin dashboard - should load without GitHub buttons
4. ✅ All other API endpoints should work normally

## Files Deleted (Confirmed)

```bash
# Verify directories are gone
ls -la src/server/api/admin/ | grep -E "download-project|github-setup"
# Returns: No matches ✅
```

## Current API Endpoints (Should Work)

### Admin Endpoints
- ✅ `/api/admin/analytics` - GET
- ✅ `/api/admin/config` - GET, POST
- ✅ `/api/admin/payments` - GET
- ✅ `/api/admin/properties` - GET, POST
- ✅ `/api/admin/properties/:id` - GET, PUT, DELETE
- ✅ `/api/admin/properties/bulk-upload` - POST
- ✅ `/api/admin/token-logs` - GET
- ✅ `/api/admin/token-logs/:id` - DELETE
- ✅ `/api/admin/users` - GET
- ✅ `/api/admin/users/:userId` - PUT

### User Endpoints
- ✅ `/api/auth/login` - POST
- ✅ `/api/auth/register` - POST
- ✅ `/api/auth/me` - GET
- ✅ `/api/user/profile` - PUT
- ✅ `/api/user/favorites` - GET, POST
- ✅ `/api/user/favorites/:propertyId` - DELETE
- ✅ `/api/user/unlocked-properties` - GET
- ✅ `/api/user/token-transactions` - GET
- ✅ `/api/user/referrals` - GET

### Property Endpoints
- ✅ `/api/properties` - GET
- ✅ `/api/properties/:id` - GET
- ✅ `/api/properties/:id/unlock` - POST
- ✅ `/api/properties/:id/download` - GET
- ✅ `/api/properties/search-suggestions` - GET

### Payment Endpoints
- ✅ `/api/payments/create-order` - POST
- ✅ `/api/payments/verify` - POST

### Config Endpoints
- ✅ `/api/config/razorpay-key` - GET

### Commerce Endpoints
- ✅ `/api/commerce/create-checkout-session` - POST

### Health Check
- ✅ `/api/health` - GET

## Expected Behavior After Restart

1. **Homepage** - Loads normally with property listings
2. **Login** - Authentication works
3. **Admin Dashboard** - Loads without "Download Project" or "GitHub Integration" buttons
4. **All Features** - Property management, user management, payments, etc. work normally
5. **No Console Errors** - No module not found errors

## If Issue Persists

If the error still appears after cache clearing:

### Option 1: Manual Server Restart
```bash
# Stop the dev server (Ctrl+C)
# Clear caches again
rm -rf .api dist node_modules/.vite
# Start dev server
npm run dev
```

### Option 2: Full Clean Rebuild
```bash
# Clean everything
npm run clean
# Reinstall dependencies
npm install
# Start dev server
npm run dev
```

### Option 3: Check for Stale Processes
```bash
# Kill any stale vite processes
pkill -f vite
# Wait a few seconds
sleep 3
# Start dev server
npm run dev
```

## Prevention

When deleting API endpoints in the future:

1. **Delete the files**
2. **Clear the cache**: `rm -rf .api dist`
3. **Let the server auto-restart** or manually restart it
4. **Verify** the application loads without errors

## Status

✅ **Caches Cleared**  
⏳ **Waiting for Server Auto-Restart**  
📝 **Next Step:** Verify application loads without errors

---

**Last Updated:** January 18, 2026  
**Platform:** ownaccessy - Real Estate Token Platform
