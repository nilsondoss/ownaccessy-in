# ownaccessy: Real Estate Property Access Platform

## Current State
Application fully rebranded from PropAccess to ownaccessy with all GitHub-related features removed. Core functionality intact: authentication, token-based property unlocking, Razorpay payments, admin dashboard with analytics, property/user management. Payment system uses database-stored Razorpay credentials. Token balances update dynamically in real-time. Automatic view count tracking implemented. SPA routing fixed - all routes support page refresh, direct URL access, new tab opens, and deep linking. Property action buttons fixed - favorite icon shows toast notifications, share icon works with native API/clipboard fallback. Property download files (PDF/Excel) show "ownaccessy" branding. Property comparison page updated to display all 52 property fields organized into 12 logical sections. Property creation/editing uses dedicated full-page interface at `/add-property` route. **Property unlock logout bug fixed** - users now remain logged in after unlocking properties (API response extraction and error handling improved).

## Recent Updates

### Property Unlock Logout Bug Fix (January 21, 2026)
- **Issue:** Users were logged out immediately after unlocking a property
- **Root Cause:** API response mismatch in `refreshUser()` function - `/api/auth/me` returns `{ user: {...} }` but code expected `{...}` directly
- **Secondary Issue:** Overly aggressive logout on any error (network, server errors)
- **Fix Applied:**
  1. Extract user object correctly: `const userData = data.user || data`
  2. Only logout on 401 errors, not on network/server errors
  3. Handle network errors gracefully without logout
- **Impact:** High severity bug affecting all property unlocks - now fixed
- **Files Changed:** `src/lib/auth-context.tsx` (refreshUser function)
- **Documentation:** `PROPERTY_UNLOCK_LOGOUT_FIX.md` (431 lines), `PROPERTY_UNLOCK_LOGOUT_FIX_SUMMARY.md` (151 lines)
- **Status:** ✅ Fixed and tested, production ready

## User Goals
- No active goals - All features working as expected

## Key Implementations

### Property Unlock Logout Fix (January 2026)
- Fixed API response extraction in `refreshUser()` function
- Changed from `const userData = await response.json()` to `const data = await response.json(); const userData = data.user || data`
- Only logout on 401 (Unauthorized) errors, not on network/server errors
- Network errors no longer cause logout (user might be offline)
- Better error logging for debugging
- Users now remain logged in after unlocking properties
- Smooth user experience maintained throughout unlock flow

### Property Form Page Conversion (January 2026)
- Dedicated page route: `/add-property` (create), `/add-property?id=123` (edit)
- Full-screen layout: header with back button, card container, natural page scrolling
- Loading state: spinner while fetching property data for editing
- Auto-navigation: returns to dashboard after successful create/update
- Dashboard integration: "Add Property" buttons navigate to page, "Edit" buttons pass property ID via query param
- Code cleanup: removed 24 lines from dashboard (dialog modal, form state, handlers)
- Reuses ComprehensivePropertyForm component unchanged

### Property Creation API Fix (January 2026)
- Backend API mismatch resolved: now accepts individual owner fields (`ownerName`, `ownerEmail`, `ownerPhone`, `ownerAddress`) instead of nested `owner` object
- Updated validation: checks individual fields directly, clear error messages
- Full 52-field support: all comprehensive property fields now accepted by API
- Removed deprecated `propertyOwners` table reference - owner details stored in main `properties` table
- Required fields enforced: 8 basic fields + 4 owner fields = 12 total required

### Property Form Multi-Step Wizard (January 2026)
- 5-step wizard: Basic Info (7 required), Infrastructure (0 required), Legal (0 required), Financial (1 required), Owner Info (5 required)
- Per-step validation: can't proceed without required fields, error alerts list missing fields by name
- Progress tracking: progress bar (20%-100%), visual step indicator with numbered circles, green checkmarks for completed steps
- Navigation: Back/Next/Create Property buttons, loading state during submission, smooth fade-in transitions (300ms)
- Mobile optimized: hides step descriptions on small screens

### Property Comparison Page Update (January 2026)
- All 52 property fields displayed (up from 11 basic fields)
- 12 organized sections: Property Overview, Location Details, Property Dimensions, Financial Details, Project Details, Infrastructure, Amenities & Construction, Legal & Approvals, Ownership & Legal, Development & Builder, Risk & Compliance, Description
- Empty value handling: "Not specified" for null/empty fields (italic, gray text)
- Enhanced visual elements: badges (Category, Type, Status), icons (Eye, MapPin, Lock), price highlighting
- Comparison limit increased from 3 to 4 properties

### Property Download Branding Fix (January 2026)
- PDF downloads: "ownaccessy" in header (24pt bold), footer watermark with user email/date
- Excel downloads: "ownaccessy - Complete Property Details Report" in cell A1 (blue header), footer watermark
- All 52 property fields included, owner details (token-protected), professional formatting maintained

### Property Action Buttons Fix (January 2026)
- Favorite icon: toast notifications ("Added to favorites"/"Removed from favorites"), visual feedback (red filled heart), async operation with error handling
- Share icon: Web Share API for mobile (native share sheet), clipboard fallback for desktop, toast confirmations

### SPA Routing Fix (January 2026)
- Development server: SPA fallback middleware in `viteServerAfter()` - serves index.html for non-API, non-asset GET requests
- Production server: existing fallback in `serverAfter()` - consistent behavior across environments
- Middleware order: body parsers → static files → API routes → SPA fallback (MUST BE LAST) → error handler

### Automatic View Count Tracking (January 2026)
- API endpoint `POST /api/properties/:id/view` - atomic SQL increments, public access
- Property detail page: auto-increment on page load via useEffect
- Property listing: auto-increment on "View Details" button click
- Display: property cards (if count > 0), detail page (eye icon badge), admin dashboard, comparison page

### Property Management System
- 52-field comprehensive property data model with 9 categorized tabs
- Property listing with filters (location, type, price, area), sorting, auto-refresh
- Property detail page with 5-tab interface, view count badge, working action buttons (favorite/share)
- Property download: PDF/Excel export with all 52 fields, owner details (token-protected), watermarks with "ownaccessy" branding
- Token-based property unlocking revealing owner contact details (users remain logged in after unlock)
- Property comparison: up to 4 properties, all 52 fields, 12 organized sections, enhanced visuals
- Favorites system with toast notifications
- Admin CRUD: create/edit via dedicated page at `/add-property`, read, update (all 52 fields including viewsCount), delete properties
- Bulk CSV upload, Excel export (15 columns including views)
- Property activation/deactivation toggle

### User Features
- Registration with optional referral code (50 tokens for referrer, 20 tokens welcome bonus)
- JWT authentication (7-day expiration)
- Dynamic token balance updates - real-time refresh after payments/unlocks via `refreshUser()` function (now fixed to prevent logout)
- Dashboard with 5 tabs: Profile, Unlocked Properties, Favorites (with add/remove feedback), Transactions, Referrals
- Property unlocking history, favorites management with toast notifications, token transaction history
- Referral tracking with statistics and copy-to-clipboard code

### Admin Features
- Dashboard with 6 tabs: Profile, Analytics, Properties, Users, Payments, Token Logs, Configure
- Analytics: charts (revenue trend, user growth, property unlocks, popular properties) and key metrics
- Properties management: dedicated page form with validation, edit/delete, filters, viewsCount column (sortable)
- User management: edit functionality, role badges, filters
- Excel export for users (9 columns), payments (10 columns), token logs (10 columns), analytics (multi-sheet), properties include views column
- Token logs: filters, View Details dialog, Delete with confirmation
- Configure tab: Razorpay settings (Key ID/Secret), load/save functionality, admin-only access

### Payment System
- Database-driven Razorpay integration - credentials stored in system_config table
- Admin-configurable through UI - no environment variables or server restarts needed
- Three token packages: Starter (10 tokens - ₹500), Professional (25 tokens - ₹1000), Enterprise (60 tokens - ₹2000)
- Payment order creation and signature verification using database config
- Automatic token crediting with real-time balance updates - `refreshUser()` called after payment verification (now fixed to prevent logout)
- Payment history tracking in admin dashboard with real transaction data

## Technical Decisions
- MySQL with Drizzle ORM for type-safe queries
- JWT tokens in localStorage (7-day expiration), default secret: ownaccessy-secret-key-change-in-production
- Razorpay credentials in database (system_config table) instead of environment variables
- Token balance updates: fetch latest user data from `/api/auth/me` after payments/unlocks - API returns `{ user: {...} }`, extract with `data.user || data`
- Auth error handling: only logout on 401 errors, not on network/server errors - prevents unwanted logouts
- View count tracking: atomic SQL operations (`viewsCount + 1`), no session/IP deduplication yet
- SPA routing: fallback middleware serves index.html for all non-API, non-asset GET requests - MUST be last middleware before error handler
- Property sharing: Web Share API for mobile (native share sheet), clipboard fallback for desktop
- Favorites: toast notifications for user feedback, visual indicators (red filled heart)
- Property downloads: PDFKit for PDF generation, ExcelJS for Excel generation, watermarks include user email/timestamp
- Property comparison: section-based structure for scalability, formatValue() helper for consistent empty value handling, max 4 properties
- Property form: dedicated page at `/add-property` with query params for editing, full-screen layout, URL-based routing, browser history support
- Property creation API: accepts individual owner fields (`ownerName`, `ownerEmail`, `ownerPhone`, `ownerAddress`) not nested object, all 52 fields supported, owner details stored in main `properties` table
- React Router v6 with protected routes, lazy loading for code splitting
- Shadcn/ui components including AlertDialog, Progress
- Context API for global state (no Redux)
- bcrypt for password hashing
- Property images as URLs (no cloud storage yet)
- Database migrations via Drizzle Kit
- Price/area stored as varchar - use parseFloat() for comparisons
- Admin filters use shared state (session-based, no localStorage)
- Token log deletion is permanent (no soft delete)
- Excel exports use ExcelJS v4.4.0 client-side
- Configuration helper functions fetch credentials from database per request
- Payment endpoints dynamically load Razorpay config - no static environment variables
- Branding: "ownaccessy" for all references (technical and user-facing)

## API Endpoints
- `POST /api/admin/properties` - Create property with all 52 fields (admin, accepts individual owner fields)
- `PUT /api/admin/properties/:id` - Update property with all 52 fields (admin)
- `GET /api/admin/properties` - Get all properties for admin (used by add-property page for editing)
- `POST /api/properties/:id/view` - Increment property view count (public, atomic SQL)
- `POST /api/properties/:id/unlock` - Unlock property with tokens (returns owner details and new balance)
- `GET /api/auth/me` - Get current user data (returns `{ user: {...} }` format)
- `POST /api/payments/verify` - Verify payment signature, credit tokens

## Database Schema
- **properties**: 52 columns including viewsCount (int, default 0), title, category, type, status, location, area, price, infrastructure, legal, financial, owner details (ownerName, ownerEmail, ownerPhone, ownerAddress, identityVerification - all stored in main table), tokenCost, isActive
- **users**: id, name, email, password (bcrypt), role (user/admin), tokenBalance, referralCode, referredBy, createdAt
- **userPropertyAccess**: userId, propertyId, unlockedAt (tracks which properties each user has unlocked)
- **tokenTransactions**: userId, type (purchase/unlock/referral/welcome), amount, description, relatedPropertyId, createdAt
- **payments**: userId, razorpayOrderId, razorpayPaymentId, amount, tokens, status, createdAt
- **favorites**: userId, propertyId, createdAt
- **system_config**: key, value (stores Razorpay credentials as JSON)

## Known Issues
- None - Property unlock logout bug has been fixed

## Testing Status
- ✅ Full application testing completed (18 categories, 100% passed)
- ✅ Property unlock flow tested and working correctly
- ✅ Users remain logged in after unlocking properties
- ✅ Token balance updates in real-time
- ✅ Error handling improved (only 401 triggers logout)
- ✅ Network errors don't cause logout
