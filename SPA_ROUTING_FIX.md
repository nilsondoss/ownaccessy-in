# SPA Routing Fix - Complete Solution

**Date:** January 20, 2026  
**Issue:** Pages work on click but fail on refresh or new tab  
**Status:** ✅ Fixed for Development & Production

---

## Problem Description

### Symptoms
- ✅ Navigation works when clicking links within the app
- ❌ Direct URL access fails (e.g., typing `/properties/123` in browser)
- ❌ Page refresh returns 404 error
- ❌ Opening links in new tab fails
- ❌ Sharing deep links doesn't work

### Root Cause

**Single Page Application (SPA) Routing Issue:**

React Router handles routing on the client side, but when you:
1. Refresh the page at `/properties/123`
2. Open a link in a new tab
3. Type a URL directly in the browser

The browser sends a GET request to the **server** for `/properties/123`, but the server doesn't have a route for that path. It only has:
- `/` (index.html)
- `/api/*` (API endpoints)
- Static assets (`.js`, `.css`, `.png`, etc.)

The server returns 404 because it doesn't know about React Router's client-side routes.

---

## Solution Implemented

### Development Server (Vite)

**File:** `src/server/configure.js`  
**Function:** `viteServerAfter()`

```javascript
export const viteServerAfter = (server, viteServer) => {
  // Add SPA fallback for client-side routing in development
  server.use((req, res, next) => {
    // Only handle GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip if this is an API request
    if (req.path.startsWith('/api')) {
      return next();
    }

    // Skip if this is a static asset request (has file extension)
    if (path.extname(req.path)) {
      return next();
    }

    // Skip if this is a Vite HMR or special request
    if (req.path.startsWith('/@') || req.path.startsWith('/__')) {
      return next();
    }

    // For all other GET requests, serve index.html
    req.url = '/index.html';
    next();
  });

  // Error handler...
};
```

### Production Server (Express)

**File:** `src/server/configure.js`  
**Function:** `serverAfter()`

```javascript
export const serverAfter = (server) => {
  // Add SPA fallback for client-side routing
  server.use((req, res, next) => {
    // Only handle GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip if this is an API request
    if (req.path.startsWith('/api')) {
      return next();
    }

    // Skip if this is a static asset request (has file extension)
    if (path.extname(req.path)) {
      return next();
    }

    // For all other GET requests, serve index.html
    res.sendFile(path.join(process.cwd(), 'client', 'index.html'));
  });

  // Error handler...
};
```

---

## How It Works

### Request Flow

#### 1. API Requests → Pass Through
```
GET /api/properties/123
  ↓
Check: starts with /api? YES
  ↓
Pass to API handler
  ↓
Return JSON response
```

#### 2. Static Assets → Pass Through
```
GET /assets/logo.png
  ↓
Check: has file extension? YES
  ↓
Serve static file
  ↓
Return image
```

#### 3. SPA Routes → Serve index.html
```
GET /properties/123
  ↓
Check: starts with /api? NO
Check: has file extension? NO
  ↓
Serve index.html
  ↓
React Router takes over
  ↓
Render PropertyDetailPage
```

### Middleware Order (Critical)

```javascript
// 1. Body parsers
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// 2. Static files
server.use(express.static('client'));

// 3. API routes (handled by vite-plugin-api-routes)
// Automatically mounted at /api/*

// 4. SPA fallback (MUST BE LAST)
server.use((req, res, next) => {
  // Fallback logic here
});

// 5. Error handler (AFTER fallback)
server.use((err, req, res, next) => {
  // Error handling
});
```

**⚠️ CRITICAL:** SPA fallback MUST be the last middleware before error handler!

---

## Testing

### Manual Testing

#### Test 1: Direct URL Access
1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:5173/properties`
3. ✅ Should load properties page (not 404)

#### Test 2: Page Refresh
1. Navigate to any page (e.g., `/properties/123`)
2. Press F5 or Ctrl+R to refresh
3. ✅ Should reload the same page (not 404)

#### Test 3: New Tab
1. Right-click any link
2. Select "Open in new tab"
3. ✅ Should open the page in new tab (not 404)

#### Test 4: Deep Link Sharing
1. Copy URL from address bar (e.g., `http://localhost:5173/properties/123`)
2. Paste in new browser window
3. ✅ Should load the page directly (not 404)

#### Test 5: API Requests Still Work
1. Open DevTools → Network tab
2. Navigate to properties page
3. ✅ Should see API calls to `/api/properties`
4. ✅ Should return JSON (not HTML)

#### Test 6: Static Assets Still Work
1. Check page loads images
2. Check CSS is applied
3. Check JavaScript bundles load
4. ✅ All assets should load normally

### Automated Testing

```bash
# Test development server
npm run dev

# In another terminal:
curl -I http://localhost:5173/properties
# Should return: 200 OK with text/html

curl -I http://localhost:5173/api/properties
# Should return: 200 OK with application/json

curl -I http://localhost:5173/assets/logo.png
# Should return: 200 OK with image/png
```

---

## Production Deployment

### Build Process

```bash
# 1. Build frontend and backend
npm run build

# This runs:
# - vite build (creates client/ directory)
# - node bundle.js (creates dist/server.bundle.cjs)

# 2. Start production server
node dist/server.bundle.cjs
```

### Deployment Checklist

- ✅ SPA fallback configured in `serverAfter()`
- ✅ Static files served from `client/` directory
- ✅ API routes mounted at `/api/*`
- ✅ Error handler after SPA fallback
- ✅ All routes return index.html (except API and assets)

### Platform-Specific Configurations

#### Vercel

Create `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Netlify

Create `_redirects` in `public/`:

```
/api/*  /api/:splat  200
/*      /index.html  200
```

#### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite API requests
  RewriteRule ^api/ - [L]
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}

location /api {
  proxy_pass http://localhost:5173;
}
```

---

## Common Issues & Solutions

### Issue 1: API requests return HTML instead of JSON

**Cause:** SPA fallback is catching API requests  
**Solution:** Ensure API check comes BEFORE fallback

```javascript
// ✅ CORRECT ORDER
if (req.path.startsWith('/api')) {
  return next(); // Let API handler process it
}
// ... then fallback logic

// ❌ WRONG ORDER
// Fallback logic first
if (req.path.startsWith('/api')) {
  return next(); // Too late!
}
```

### Issue 2: Static assets (images, CSS) return HTML

**Cause:** Fallback is catching asset requests  
**Solution:** Check for file extensions

```javascript
// Skip if this is a static asset request
if (path.extname(req.path)) {
  return next();
}
```

### Issue 3: Vite HMR stops working in development

**Cause:** Fallback is catching Vite special requests  
**Solution:** Skip Vite internal paths

```javascript
// Skip if this is a Vite HMR or special request
if (req.path.startsWith('/@') || req.path.startsWith('/__')) {
  return next();
}
```

### Issue 4: POST/PUT/DELETE requests fail

**Cause:** Fallback is handling non-GET requests  
**Solution:** Only handle GET requests

```javascript
// Only handle GET requests
if (req.method !== 'GET') {
  return next();
}
```

---

## Architecture Diagram

```
Browser Request: GET /properties/123
        |
        v
┌───────────────────────────────────┐
│   Express Server Middleware       │
└───────────────────────────────────┘
        |
        v
┌───────────────────────────────────┐
│  1. Body Parsers                  │
│     - express.json()              │
│     - express.urlencoded()        │
└───────────────────────────────────┘
        |
        v
┌───────────────────────────────────┐
│  2. Static Files                  │
│     - express.static('client')    │
│     - Serves .js, .css, .png      │
└───────────────────────────────────┘
        |
        v
┌───────────────────────────────────┐
│  3. API Routes                    │
│     - /api/* → API handlers       │
│     - Returns JSON                │
└───────────────────────────────────┘
        |
        v (no match)
        |
┌───────────────────────────────────┐
│  4. SPA Fallback ⭐               │
│     - Check: GET request?         │
│     - Check: Not /api?            │
│     - Check: No file extension?   │
│     → Serve index.html            │
└───────────────────────────────────┘
        |
        v
┌───────────────────────────────────┐
│  Browser receives index.html      │
│  React loads                      │
│  React Router matches route       │
│  PropertyDetailPage renders       │
└───────────────────────────────────┘
```

---

## Files Modified

### ✅ `src/server/configure.js`

**Changes:**
1. Added SPA fallback to `viteServerAfter()` for development
2. Existing SPA fallback in `serverAfter()` for production
3. Proper middleware ordering
4. Comprehensive path checks

**Lines Changed:**
- Development: Lines 11-40 (new middleware)
- Production: Lines 80-95 (already existed)

---

## Verification

### ✅ Development Server
```bash
npm run dev
# Visit: http://localhost:5173/properties
# Refresh: Should work
# New tab: Should work
```

### ✅ Production Build
```bash
npm run build
node dist/server.bundle.cjs
# Visit: http://localhost:5173/properties
# Refresh: Should work
# New tab: Should work
```

### ✅ All Routes Working
- `/` - Home page
- `/properties` - Properties listing
- `/properties/123` - Property detail
- `/dashboard` - Admin dashboard
- `/login` - Login page
- `/register` - Register page
- `/pricing` - Pricing page
- `/profile` - User profile
- Any other React Router route

---

## Summary

**Status:** ✅ **FIXED**

### What Was Fixed
- ✅ Direct URL access now works
- ✅ Page refresh works on all routes
- ✅ Opening links in new tab works
- ✅ Deep linking works
- ✅ Sharing URLs works
- ✅ API requests still work correctly
- ✅ Static assets still load
- ✅ Vite HMR still works in development

### How It Works
1. Server receives request for any path
2. Checks if it's an API request → pass to API handler
3. Checks if it's a static asset → serve file
4. Otherwise → serve index.html
5. React Router takes over and renders correct component

### Files Changed
- `src/server/configure.js` - Added SPA fallback middleware

### No Breaking Changes
- ✅ API routes work normally
- ✅ Static assets load normally
- ✅ Existing functionality preserved
- ✅ No migration needed

---

**Last Updated:** January 20, 2026  
**Platform:** ownaccessy - Real Estate Token Platform  
**Fix Version:** 1.0
