<<<<<<< HEAD
# OwnAccessy.in Testing Guide
=======
# ownaccessy Testing Guide
>>>>>>> 20260118033327-qey66h1e3v

**Application URL:** https://qey66h1e3v.preview.c24.airoapp.ai
**Date:** January 9, 2026
**Status:** Ready for comprehensive testing

---

## 🎯 Quick Test Checklist

### ✅ Core Features to Test
- [ ] User Registration & Login
- [ ] Property Browsing & Search
- [ ] Property Details & Unlock
- [ ] Admin Dashboard
- [ ] Property Management (CRUD)
- [ ] User Profile & Token Balance
- [ ] Referral System
- [ ] Favorites System

### ⚠️ Features Requiring Configuration
- [ ] Razorpay Payments (needs API keys)
- [ ] Email Notifications (needs SMTP setup)

---

## 1. User Registration & Authentication

### Test New User Registration

**URL:** https://qey66h1e3v.preview.c24.airoapp.ai/register

**Steps:**
1. Click "Register" or go to /register
2. Fill in:
   - Name: Test User
   - Email: testuser@example.com
   - Password: Test@123
   - Referral Code: (optional - leave blank for now)
3. Click "Register"

**Expected Results:**
- ✅ Registration successful
- ✅ Redirected to /dashboard
- ✅ User receives 100 initial tokens
- ✅ Token balance shows in header
- ✅ Dashboard displays user profile

### Test User Login

**URL:** https://qey66h1e3v.preview.c24.airoapp.ai/login

**Steps:**
1. Go to /login
2. Enter credentials:
   - Email: testuser@example.com
   - Password: Test@123
3. Click "Login"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to /dashboard
- ✅ Token balance visible in header
- ✅ Profile dropdown works

### Test Admin Login

**Admin Credentials:**
- Email: `admin@ownaccessy.com`
- Password: `Admin@098`

**Steps:**
1. Go to /login
2. Enter admin credentials
3. Click "Login"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to /dashboard
- ✅ Admin dashboard with 6 tabs visible
- ✅ Analytics, Properties, Users tabs accessible

---

## 2. Property Browsing & Search

### Test Properties Page

**URL:** https://qey66h1e3v.preview.c24.airoapp.ai/properties

**Steps:**
1. Go to /properties
2. Observe property listings
3. Try search functionality
4. Try filters (location, type, price)
5. Click on a property card

**Expected Results:**
- ✅ Properties load and display
- ✅ Property cards show:
  - Image
  - Title
  - Location
  - Price
  - Token cost
  - Type badge
- ✅ Search works (type location/title)
- ✅ Filters work (location, type, price range)
- ✅ Auto-refresh every 30 seconds
- ✅ Manual refresh button works
- ✅ Clicking property opens detail page

### Test Property Details

**URL:** https://qey66h1e3v.preview.c24.airoapp.ai/properties/[id]

**Steps:**
1. Click on any property from listings
2. View property details
3. Check "Unlock Owner Details" button
4. Try favoriting the property (heart icon)

**Expected Results:**
- ✅ Property details display:
  - Large image
  - Title, location, price
  - Description
  - Area, type
  - Token cost
- ✅ "Unlock" button visible (if not unlocked)
- ✅ Favorite button works (heart icon)
- ✅ Back button returns to listings

### Test Property Unlock (Requires Tokens)

**Prerequisites:** User must have sufficient tokens (100 initial tokens)

**Steps:**
1. On property detail page
2. Click "Unlock Owner Details" button
3. Confirm unlock

**Expected Results:**
- ✅ Tokens deducted from balance
- ✅ Owner details revealed:
  - Owner name
  - Owner email
  - Owner phone
  - Owner address
- ✅ "Unlock" button changes to "Unlocked"
- ✅ Property appears in "Unlocked Properties" tab
- ✅ Toast notification confirms unlock

---

## 3. User Dashboard

### Test User Profile Tab

**URL:** https://qey66h1e3v.preview.c24.airoapp.ai/dashboard

**Steps:**
1. Login as regular user
2. Go to /dashboard (default view)
3. View Profile tab

**Expected Results:**
- ✅ Profile information displays:
  - Name
  - Email
  - Phone (if set)
  - Address (if set)
- ✅ Account statistics cards:
  - Token balance
  - Unlocked properties count
  - Favorites count
- ✅ Referral section:
  - Referral code
  - Copy button
  - Referral stats
- ✅ Quick action buttons work

### Test Edit Profile

**Steps:**
1. In Profile tab, click "Edit Profile"
2. Update:
   - Name
   - Phone
   - Address
3. Click "Save Changes"

**Expected Results:**
- ✅ Edit dialog opens
- ✅ Current values pre-filled
- ✅ Can update fields
- ✅ Save button works
- ✅ Profile updates immediately
- ✅ Toast notification confirms save

### Test Unlocked Properties Tab

**Steps:**
1. Click "Unlocked Properties" tab
2. View list of unlocked properties
3. Click on a property

**Expected Results:**
- ✅ Shows all properties user has unlocked
- ✅ Displays owner details for each
- ✅ Shows unlock date
- ✅ Can click to view full property details

### Test Favorites Tab

**Steps:**
1. Click "Favorites" tab
2. View favorited properties
3. Click heart icon to unfavorite

**Expected Results:**
- ✅ Shows all favorited properties
- ✅ Can remove from favorites
- ✅ Empty state if no favorites
- ✅ Can click to view property details

### Test Transactions Tab

**Steps:**
1. Click "Transactions" tab
2. View token transaction history

**Expected Results:**
- ✅ Shows all token transactions:
  - Type (purchase/unlock/referral)
  - Amount
  - Description
  - Date
- ✅ Sorted by date (newest first)
- ✅ Shows initial 100 tokens
- ✅ Shows unlock transactions

### Test Referrals Tab

**Steps:**
1. Click "Referrals" tab
2. View referral code
3. Copy referral code
4. View referral statistics

**Expected Results:**
- ✅ Displays unique referral code
- ✅ Copy button works
- ✅ Shows referral stats:
  - Total referrals
  - Tokens earned
  - Pending referrals
- ✅ Lists referred users (if any)

---

## 4. Admin Dashboard

### Test Admin Profile Tab

**URL:** https://qey66h1e3v.preview.c24.airoapp.ai/dashboard
**Login:** admin@ownaccessy.com / Admin@098

**Steps:**
1. Login as admin
2. View Profile tab (default)

**Expected Results:**
- ✅ Admin information displays
- ✅ Platform overview cards:
  - Total users
  - Total properties
  - Total revenue
  - Total unlocks
- ✅ Recent activity summary
- ✅ Quick action buttons

### Test Analytics Tab

**Steps:**
1. Click "Analytics" tab
2. View charts and statistics

**Expected Results:**
- ✅ Overview metrics display:
  - Total revenue
  - Total tokens sold
  - Total users
  - Total properties
  - Total unlocks
  - Average token balance
  - Conversion rate
- ✅ Charts render:
  - Revenue trends (30 days)
  - User growth (30 days)
  - Property unlocks (30 days)
  - Token distribution
- ✅ Popular properties list
- ✅ Recent transactions table

### Test Properties Management Tab

**Steps:**
1. Click "Properties" tab
2. View properties table
3. Test property creation
4. Test property editing
5. Test property deletion
6. Test bulk upload

#### Create New Property

**Steps:**
1. Click "Add Property" button
2. Fill in form:
   - Title: Test Property
   - Type: residential
   - Location: Mumbai
   - Address: 123 Test Street
   - Price: 5000000
   - Area: 1200
   - Description: Test description
   - Token Cost: 5
   - Image URL: (paste any image URL)
   - Owner Name: John Doe
   - Owner Email: john@example.com
   - Owner Phone: 9876543210
   - Owner Address: 456 Owner Street
3. Click "Create Property"

**Expected Results:**
- ✅ Form validates all fields
- ✅ Property created successfully
- ✅ Toast notification shows success
- ✅ Property appears in table immediately
- ✅ Property visible on /properties page

#### Edit Property

**Steps:**
1. Find a property in table
2. Click "Edit" button
3. Modify any field
4. Click "Save Changes"

**Expected Results:**
- ✅ Edit dialog opens with current values
- ✅ Can modify all fields
- ✅ Save button works
- ✅ Toast notification confirms update
- ✅ Table updates immediately
- ✅ Changes reflect on /properties page

#### Delete Property

**Steps:**
1. Find a property in table
2. Click "Delete" button
3. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Property deleted successfully
- ✅ Toast notification confirms deletion
- ✅ Property removed from table
- ✅ Property removed from /properties page

#### Bulk Upload Properties

**Steps:**
1. Click "Bulk Upload" button
2. Download CSV template
3. Fill in template with test data
4. Upload filled CSV
5. Click "Upload"

**Expected Results:**
- ✅ Template downloads correctly
- ✅ File upload accepts CSV/Excel
- ✅ Upload processes successfully
- ✅ Toast shows success count
- ✅ New properties appear in table
- ✅ Properties visible on /properties page

**CSV Template Format:**
```csv
title,type,location,address,price,area,description,tokenCost,imageUrl,ownerName,ownerEmail,ownerPhone,ownerAddress
Luxury Villa,residential,Mumbai,"123 Marine Drive",15000000,2500,Beautiful sea-facing villa,10,https://example.com/image.jpg,Raj Kumar,raj@example.com,9876543210,"456 Owner Street, Mumbai"
```

### Test Users Management Tab

**Steps:**
1. Click "Users" tab
2. View users table
3. Test user editing

#### Edit User

**Steps:**
1. Find a user in table
2. Click "Edit" button
3. Modify fields:
   - Name
   - Email
   - Phone
   - Address
   - Token Balance
   - Role (admin/user)
4. Click "Save Changes"

**Expected Results:**
- ✅ Edit dialog opens
- ✅ Current values pre-filled
- ✅ Can modify all fields
- ✅ Can change token balance
- ✅ Can change role
- ✅ Save button works
- ✅ Toast notification confirms update
- ✅ Table updates immediately

### Test Payments Tab

**Steps:**
1. Click "Payments" tab
2. View payment transactions

**Expected Results:**
- ✅ Shows all payment records
- ✅ Displays:
  - User name/email
  - Amount
  - Tokens
  - Status
  - Razorpay IDs
  - Date
- ✅ Can filter by status
- ✅ Sorted by date

### Test Token Logs Tab

**Steps:**
1. Click "Token Logs" tab
2. View token transaction logs

**Expected Results:**
- ✅ Shows all token transactions
- ✅ Displays:
  - User
  - Action type
  - Tokens used
  - Balance before/after
  - Date
- ✅ Can filter by user
- ✅ Can filter by action type
- ✅ Sorted by date

---

## 5. Referral System

### Test Referral Flow

**Steps:**
1. Login as User A
2. Go to Dashboard → Referrals tab
3. Copy referral code
4. Logout
5. Register new User B with referral code
6. Login as User A again
7. Check Referrals tab

**Expected Results:**
- ✅ User A gets referral code
- ✅ User B can use referral code during registration
- ✅ User A receives 50 bonus tokens
- ✅ User B receives 25 bonus tokens (on top of 100 initial)
- ✅ User A sees User B in referrals list
- ✅ Referral stats update
- ✅ Token transactions recorded

---

## 6. Favorites System

### Test Add to Favorites

**Steps:**
1. Go to /properties
2. Click heart icon on any property
3. Go to Dashboard → Favorites tab

**Expected Results:**
- ✅ Heart icon fills (becomes solid)
- ✅ Toast notification confirms add
- ✅ Property appears in Favorites tab
- ✅ Favorite persists across sessions

### Test Remove from Favorites

**Steps:**
1. Go to Dashboard → Favorites tab
2. Click heart icon on favorited property
3. Refresh page

**Expected Results:**
- ✅ Heart icon empties (becomes outline)
- ✅ Toast notification confirms removal
- ✅ Property removed from Favorites tab
- ✅ Removal persists across sessions

---

## 7. Search & Filters

### Test Search Functionality

**Steps:**
1. Go to /properties
2. Type in search box:
   - Property title
   - Location name
   - Partial matches
3. Observe results

**Expected Results:**
- ✅ Search filters properties in real-time
- ✅ Matches title and location
- ✅ Case-insensitive search
- ✅ Shows "No properties found" if no matches
- ✅ Clear search resets results

### Test Location Filter

**Steps:**
1. Go to /properties
2. Select location from dropdown
3. Observe filtered results

**Expected Results:**
- ✅ Dropdown shows all unique locations
- ✅ Selecting location filters properties
- ✅ "All Locations" shows all properties
- ✅ Filter works with search

### Test Type Filter

**Steps:**
1. Go to /properties
2. Select type (residential/commercial/land)
3. Observe filtered results

**Expected Results:**
- ✅ Type filter works correctly
- ✅ Shows only selected type
- ✅ "All Types" shows all properties
- ✅ Filter works with search and location

### Test Price Range Filter

**Steps:**
1. Go to /properties
2. Adjust price range sliders
3. Observe filtered results

**Expected Results:**
- ✅ Min/max price filters work
- ✅ Shows properties in range
- ✅ Updates count dynamically
- ✅ Works with other filters

---

## 8. Responsive Design

### Test Mobile View

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Android)
4. Navigate through all pages

**Expected Results:**
- ✅ Header collapses to hamburger menu
- ✅ Property cards stack vertically
- ✅ Tables scroll horizontally
- ✅ Forms are mobile-friendly
- ✅ Buttons are touch-friendly
- ✅ Dashboard tabs work on mobile
- ✅ All features accessible

### Test Tablet View

**Steps:**
1. Set viewport to tablet size (768px - 1024px)
2. Navigate through pages

**Expected Results:**
- ✅ Layout adapts to tablet size
- ✅ Property grid shows 2 columns
- ✅ Dashboard layout responsive
- ✅ All features work correctly

---

## 9. Performance & UX

### Test Page Load Times

**Steps:**
1. Open DevTools → Network tab
2. Navigate to different pages
3. Check load times

**Expected Results:**
- ✅ Homepage loads < 2 seconds
- ✅ Properties page loads < 3 seconds
- ✅ Dashboard loads < 2 seconds
- ✅ No console errors
- ✅ Images load progressively

### Test Auto-Refresh

**Steps:**
1. Go to /properties
2. Open admin dashboard in another tab
3. Create a new property
4. Wait 30 seconds on /properties

**Expected Results:**
- ✅ New property appears automatically
- ✅ No page reload required
- ✅ Toast notification shows refresh
- ✅ Manual refresh button works

---

## 10. Error Handling

### Test Invalid Login

**Steps:**
1. Go to /login
2. Enter wrong credentials
3. Click "Login"

**Expected Results:**
- ✅ Error message displays
- ✅ Form doesn't submit
- ✅ User stays on login page
- ✅ Can retry login

### Test Insufficient Tokens

**Steps:**
1. Login with user having < 5 tokens
2. Try to unlock property costing 5 tokens

**Expected Results:**
- ✅ Error message displays
- ✅ Unlock button disabled or shows error
- ✅ Suggests purchasing tokens
- ✅ No tokens deducted

### Test Network Errors

**Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try any action

**Expected Results:**
- ✅ Error message displays
- ✅ User-friendly error text
- ✅ Retry option available
- ✅ No app crash

---

## 11. Security Testing

### Test Unauthorized Access

**Steps:**
1. Logout
2. Try to access /dashboard directly
3. Try to access /admin directly

**Expected Results:**
- ✅ Redirected to /login
- ✅ Cannot access protected routes
- ✅ Token validation works

### Test Admin-Only Features

**Steps:**
1. Login as regular user
2. Try to access admin endpoints via DevTools

**Expected Results:**
- ✅ Admin tabs not visible to regular users
- ✅ API returns 403 Forbidden
- ✅ Cannot access admin features

---

## 12. Known Limitations (Require Configuration)

### Razorpay Payments

**Status:** ⚠️ Requires API keys

**To Test:**
1. Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
2. Test token purchase flow
3. Verify payment webhook

**Expected Flow:**
- User clicks "Buy Tokens"
- Razorpay modal opens
- User completes payment
- Tokens credited automatically
- Email confirmation sent

### Email Notifications

**Status:** ⚠️ Requires SMTP configuration

**To Test:**
1. Configure email service
2. Test welcome email
3. Test unlock notification
4. Test payment confirmation
5. Test low balance alert

---

## 13. Test Data

### Admin Account
```
Email: admin@ownaccessy.com
Password: Admin@098
Role: admin
```

### Test User Accounts
```
Create via /register:
Email: testuser1@example.com
Password: Test@123
Tokens: 100 (initial)

Email: testuser2@example.com
Password: Test@123
Tokens: 100 (initial)
```

### Sample Property Data
```
Title: Luxury Apartment in Bandra
Type: residential
Location: Mumbai
Price: ₹8,500,000
Area: 1500 sq ft
Token Cost: 5
```

---

## 14. Bug Reporting Template

If you find any issues:

```
**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. Observe...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
[Attach if applicable]

**Browser/Device:**
Chrome 120 / Windows 11

**Console Errors:**
[Copy any errors from browser console]
```

---

## 15. Testing Priorities

### High Priority (Must Work)
1. ✅ User registration & login
2. ✅ Property browsing & search
3. ✅ Property unlock with tokens
4. ✅ Admin property management
5. ✅ Token balance tracking

### Medium Priority (Should Work)
6. ✅ Referral system
7. ✅ Favorites system
8. ✅ User profile editing
9. ✅ Admin analytics
10. ✅ Bulk upload

### Low Priority (Nice to Have)
11. ⚠️ Razorpay payments (needs config)
12. ⚠️ Email notifications (needs config)
13. ✅ Auto-refresh
14. ✅ Mobile responsiveness

---

## 16. Next Steps After Testing

### If All Tests Pass:
1. ✅ Configure Razorpay API keys
2. ✅ Test payment flow
3. ✅ Configure email service
4. ✅ Test email notifications
5. ✅ Publish to production
6. ✅ Connect custom domain (ownaccessy.in)

### If Issues Found:
1. Document bugs using template above
2. Report to development team
3. Prioritize fixes
4. Retest after fixes

---

**Testing Status:** 🟢 Ready for testing
**Last Updated:** January 9, 2026
**Tester:** [Your Name]
**Application Version:** 1.0.0
