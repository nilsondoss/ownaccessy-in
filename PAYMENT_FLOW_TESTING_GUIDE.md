# Payment Flow Testing Guide

## Overview
This guide walks you through testing the complete payment flow including Razorpay configuration, token purchase, and dynamic balance updates.

## Prerequisites

### 1. Razorpay Account Setup

**Test Mode (Recommended for Testing)**:
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Generate **Test Mode** API keys
5. Note down:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secure)

**Live Mode (Production Only)**:
- Use live keys only after thorough testing
- Live keys start with `rzp_live_`
- Real money transactions occur

### 2. Admin Account

You need an admin account to configure Razorpay credentials:

**Create Admin Account**:
```bash
npm run create-admin
```

Follow the prompts to create:
- Name: Admin User
- Email: admin@ownaccessy.in
- Password: (choose a secure password)

**Default Admin Credentials** (if already created):
- Email: `admin@ownaccessy.in`
- Password: Check `ADMIN_CREDENTIALS.md` file

### 3. Test User Account

Create a regular user account for testing purchases:
- Go to `/register`
- Create account with any email
- Note: You'll receive 20 welcome bonus tokens

## Testing Steps

### Step 1: Configure Razorpay Credentials

1. **Login as Admin**:
   - Go to `/login`
   - Use admin credentials
   - You'll be redirected to admin dashboard

2. **Navigate to Configuration Tab**:
   - Click on **Configure** tab in dashboard
   - You'll see Razorpay configuration form

3. **Enter Razorpay Credentials**:
   - **Razorpay Key ID**: Paste your test key (e.g., `rzp_test_xxxxx`)
   - **Razorpay Key Secret**: Paste your test secret
   - Click **Save Configuration**
   - Wait for success toast: "Configuration saved successfully"

4. **Verify Configuration**:
   - Click **Load Saved Configuration** button
   - Credentials should populate in the form
   - Key Secret will be masked (••••••••)

### Step 2: Test Token Purchase Flow

#### 2.1 Login as Regular User

1. **Logout from Admin**:
   - Click profile menu → Logout

2. **Login as Test User**:
   - Go to `/login`
   - Use test user credentials
   - Note current token balance in header (e.g., 20 tokens)

#### 2.2 Navigate to Pricing Page

1. **Go to Pricing**:
   - Click **Buy Tokens** in header, OR
   - Navigate to `/pricing`

2. **Review Token Packages**:
   - **Starter**: 10 tokens - ₹500
   - **Professional**: 25 tokens - ₹1,000 (Best Value)
   - **Enterprise**: 60 tokens - ₹2,000 (Maximum Savings)

#### 2.3 Initiate Payment

1. **Select Package**:
   - Click **Buy** button on any package
   - Example: Click "Buy" on Professional (25 tokens)

2. **Razorpay Checkout Opens**:
   - Modal appears with payment details
   - Amount: ₹1,000.00
   - Email: Pre-filled with your email
   - Payment methods available

#### 2.4 Complete Test Payment

**Test Mode Payment (Razorpay Test Keys)**:

1. **Select Payment Method**:
   - Choose **Card** or **UPI** or **Netbanking**

2. **Use Test Card Details**:
   ```
   Card Number: 4111 1111 1111 1111
   Expiry: Any future date (e.g., 12/25)
   CVV: Any 3 digits (e.g., 123)
   Name: Any name
   ```

3. **Alternative Test Cards**:
   - **Success**: `5104 0600 0000 0008`
   - **Failure**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0027 6000 0016`

4. **Submit Payment**:
   - Click **Pay** button
   - Wait for processing (2-3 seconds)

#### 2.5 Verify Payment Success

**Immediate Checks**:

1. **Token Balance Updates** ✅
   - Check header token count
   - Should increase immediately (no page refresh)
   - Example: 20 → 45 tokens (20 + 25)

2. **Success Message** ✅
   - Redirected to `/dashboard?payment=success`
   - Green success alert displayed
   - Message: "Payment successful! Tokens added to your account."

3. **Dashboard Updates** ✅
   - Navigate to **Transactions** tab
   - Latest transaction shows:
     - Type: "Token Purchase" badge (green)
     - Amount: +25 tokens
     - Timestamp: Just now

**Backend Verification**:

1. **Check Database** (Admin Dashboard):
   - Login as admin
   - Go to **Payments** tab
   - Latest payment shows:
     - User: Your test user email
     - Amount: ₹1,000
     - Tokens: 25
     - Status: Completed (green badge)
     - Payment ID: `pay_xxxxx`
     - Order ID: `order_xxxxx`

2. **Check Token Logs** (Admin Dashboard):
   - Go to **Token Logs** tab
   - Latest log shows:
     - User: Your test user
     - Action: "Token Purchase"
     - Tokens: +25
     - Timestamp: Just now

### Step 3: Test Property Unlock with Tokens

#### 3.1 Find a Property to Unlock

1. **Go to Properties**:
   - Navigate to `/properties`
   - Browse available properties

2. **Select Property**:
   - Click on any property card
   - Example: "Premium Commercial Plot in Chennai"

3. **Check Token Cost**:
   - Scroll to "Unlock Property Details" section
   - Note token cost (e.g., 5 tokens)
   - Verify your balance is sufficient

#### 3.2 Unlock Property

1. **Click Unlock Button**:
   - Click **Unlock Now** button
   - Wait for processing (1-2 seconds)

2. **Verify Token Deduction** ✅:
   - Check header token balance
   - Should decrease immediately (no page refresh)
   - Example: 45 → 40 tokens (45 - 5)

3. **Verify Owner Details Revealed** ✅:
   - Owner information section appears
   - Shows:
     - Owner Name
     - Email
     - Phone
     - Address
     - Identity Verification status

4. **Verify Download Buttons** ✅:
   - **Download PDF** button enabled
   - **Download Excel** button enabled
   - Both include complete property + owner details

#### 3.3 Check Transaction History

1. **Go to Dashboard**:
   - Navigate to `/dashboard`
   - Click **Transactions** tab

2. **Verify Unlock Transaction** ✅:
   - Latest transaction shows:
     - Type: "Property Unlock" badge (blue)
     - Amount: -5 tokens
     - Description: Property title
     - Timestamp: Just now

3. **Check Unlocked Properties Tab** ✅:
   - Click **Unlocked Properties** tab
   - Property appears in list
   - Shows unlock date
   - "View Details" link works

### Step 4: Test Edge Cases

#### 4.1 Insufficient Balance

1. **Find Expensive Property**:
   - Go to properties
   - Find property with token cost > your balance

2. **Try to Unlock**:
   - Click property
   - Click **Unlock Now**

3. **Expected Behavior** ✅:
   - Redirected to `/pricing`
   - Message: "Insufficient tokens"
   - Can purchase more tokens

#### 4.2 Payment Failure

1. **Use Failure Test Card**:
   - Go to `/pricing`
   - Click **Buy** on any package
   - Use card: `4000 0000 0000 0002`

2. **Expected Behavior** ✅:
   - Payment fails
   - Error message displayed
   - Token balance unchanged
   - No payment record created

#### 4.3 Duplicate Unlock Attempt

1. **Try to Unlock Same Property**:
   - Go to already unlocked property
   - Check unlock section

2. **Expected Behavior** ✅:
   - "Unlock Now" button not shown
   - Owner details already visible
   - Download buttons available
   - No additional tokens deducted

#### 4.4 Unauthenticated Access

1. **Logout**:
   - Click profile → Logout

2. **Try to Access Pricing**:
   - Go to `/pricing`

3. **Expected Behavior** ✅:
   - Can view packages
   - Click **Buy** redirects to `/login`
   - Must login to purchase

4. **Try to Unlock Property**:
   - Go to any property
   - Click **Unlock Now**

5. **Expected Behavior** ✅:
   - Redirected to `/login`
   - Must login to unlock

### Step 5: Admin Verification

#### 5.1 Check Analytics

1. **Login as Admin**:
   - Go to `/login`
   - Use admin credentials

2. **View Analytics Tab** ✅:
   - Total revenue updated
   - Payment count increased
   - Property unlocks count increased
   - Charts show recent activity

#### 5.2 Review Payments

1. **Go to Payments Tab** ✅:
   - All test payments listed
   - Status badges (Completed/Failed)
   - User details visible
   - Payment IDs from Razorpay

2. **Test Filters**:
   - Filter by status: Completed
   - Search by user email
   - Filter by date range
   - Export to Excel

#### 5.3 Review Token Logs

1. **Go to Token Logs Tab** ✅:
   - All token transactions listed
   - Purchase and unlock events
   - User details visible
   - Property details for unlocks

2. **Test Actions**:
   - Click **View Details** (eye icon)
   - Review transaction details
   - Close dialog
   - Test filters and export

## Test Checklist

### Configuration
- [ ] Admin can save Razorpay credentials
- [ ] Admin can load saved credentials
- [ ] Credentials persist in database
- [ ] Success/error toasts display correctly

### Payment Flow
- [ ] User can view token packages
- [ ] Razorpay checkout opens correctly
- [ ] Test payment succeeds
- [ ] Token balance updates immediately (no refresh)
- [ ] User redirected to dashboard
- [ ] Success message displayed
- [ ] Transaction recorded in database
- [ ] Payment appears in admin dashboard

### Property Unlock
- [ ] User can unlock property with tokens
- [ ] Token balance decreases immediately (no refresh)
- [ ] Owner details revealed
- [ ] Download buttons enabled
- [ ] Transaction recorded
- [ ] Property appears in unlocked list

### Edge Cases
- [ ] Insufficient balance redirects to pricing
- [ ] Payment failure handled gracefully
- [ ] Duplicate unlock prevented
- [ ] Unauthenticated users redirected to login
- [ ] Invalid tokens handled (logout)

### Admin Features
- [ ] Analytics updated correctly
- [ ] Payments tab shows all transactions
- [ ] Token logs show all events
- [ ] Filters work correctly
- [ ] Excel export works
- [ ] View details dialog works

## Common Issues & Solutions

### Issue: "Razorpay not configured" Error

**Cause**: No credentials in database

**Solution**:
1. Login as admin
2. Go to Configure tab
3. Enter Razorpay test keys
4. Click Save Configuration
5. Verify with Load button

### Issue: Payment Modal Doesn't Open

**Cause**: Razorpay script not loaded or invalid key

**Solution**:
1. Check browser console for errors
2. Verify Razorpay key ID is correct
3. Check network tab for API calls
4. Ensure key starts with `rzp_test_` or `rzp_live_`

### Issue: Token Balance Not Updating

**Cause**: `refreshUser()` not called or failed

**Solution**:
1. Check browser console for errors
2. Verify `/api/auth/me` endpoint works
3. Check JWT token is valid
4. Clear localStorage and re-login

### Issue: Payment Succeeds But Tokens Not Credited

**Cause**: Verification failed or database error

**Solution**:
1. Check server logs for errors
2. Verify payment in Razorpay dashboard
3. Check database for payment record
4. Manually credit tokens via admin dashboard

### Issue: "Invalid signature" Error

**Cause**: Razorpay key secret mismatch

**Solution**:
1. Verify key secret in admin config
2. Ensure test key used with test payments
3. Ensure live key used with live payments
4. Re-save configuration

## Razorpay Test Cards

### Successful Payments

| Card Number         | Type       | Behavior |
|---------------------|------------|----------|
| 4111 1111 1111 1111 | Visa       | Success  |
| 5104 0600 0000 0008 | Mastercard | Success  |
| 6011 0000 0000 0004 | Discover   | Success  |

### Failed Payments

| Card Number         | Type | Behavior      |
|---------------------|------|---------------|
| 4000 0000 0000 0002 | Visa | Card declined |
| 4000 0000 0000 0069 | Visa | Expired card  |
| 4000 0000 0000 0127 | Visa | Invalid CVV   |

### 3D Secure

| Card Number         | Type | Behavior              |
|---------------------|------|-----------------------|
| 4000 0027 6000 0016 | Visa | 3D Secure required    |
| 5200 0000 0000 0007 | MC   | 3D Secure required    |

**3D Secure OTP**: Use any 6-digit number (e.g., 123456)

## Production Deployment

### Before Going Live

1. **Switch to Live Keys**:
   - Login as admin
   - Go to Configure tab
   - Replace test keys with live keys
   - Keys start with `rzp_live_`
   - Save configuration

2. **Test with Small Amount**:
   - Make real payment with ₹1
   - Verify tokens credited
   - Check Razorpay dashboard
   - Refund test payment

3. **Enable Webhooks** (Optional):
   - Go to Razorpay Dashboard
   - Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
   - Select events: payment.captured, payment.failed
   - Save webhook secret

4. **Security Checklist**:
   - [ ] HTTPS enabled
   - [ ] API keys stored in database (not code)
   - [ ] Signature verification enabled
   - [ ] Error logging configured
   - [ ] Rate limiting enabled
   - [ ] CORS configured correctly

### Monitoring

1. **Razorpay Dashboard**:
   - Monitor payments in real-time
   - Check success/failure rates
   - Review customer disputes
   - Download settlement reports

2. **Application Logs**:
   - Monitor server logs for errors
   - Track payment verification failures
   - Alert on high failure rates

3. **Database Checks**:
   - Verify payment records match Razorpay
   - Check token balance consistency
   - Monitor transaction logs

## Support

### Razorpay Support
- Dashboard: https://dashboard.razorpay.com/
- Docs: https://razorpay.com/docs/
- Support: support@razorpay.com

### Application Support
- Check server logs: `npm run dev` console
- Check browser console: F12 → Console
- Review documentation: `DYNAMIC_TOKEN_UPDATES.md`
- Admin dashboard: `/dashboard` (admin login)

## Summary

This testing guide covers:
- ✅ Razorpay configuration setup
- ✅ Complete payment flow testing
- ✅ Dynamic token balance updates
- ✅ Property unlock with tokens
- ✅ Edge case handling
- ✅ Admin verification
- ✅ Production deployment checklist

Follow each step carefully and verify all checkboxes before deploying to production.
