# Payment Integration with Database Configuration

## Overview
Updated the payment system to use Razorpay credentials from the database configuration instead of environment variables. This allows admins to configure payment settings through the UI without requiring server restarts or environment file edits.

## Changes Made

### 1. Configuration Helper Functions
**File**: `src/server/lib/config.ts` (NEW)

Created utility functions to fetch configuration from the database:

```typescript
// Fetch a single configuration value
export async function getConfigValue(key: string): Promise<string | null>

// Fetch Razorpay credentials (Key ID and Secret)
export async function getRazorpayConfig(): Promise<{
  keyId: string | null;
  keySecret: string | null;
}>

// Check if Razorpay is properly configured
export async function isRazorpayConfigured(): Promise<boolean>
```

### 2. Payment Order Creation
**File**: `src/server/api/payments/create-order/POST.ts` (MODIFIED)

**Before**:
- Read credentials from environment variables (`process.env.RAZORPAY_KEY_ID`, `process.env.RAZORPAY_KEY_SECRET`)
- Static configuration loaded at server start

**After**:
- Fetch credentials from database using `getRazorpayConfig()`
- Dynamic configuration loaded per request
- Better error messages when Razorpay is not configured

**Key Changes**:
```typescript
// OLD
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

// NEW
const razorpayConfig = await getRazorpayConfig();
if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
  return res.status(500).json({ 
    error: 'Razorpay not configured', 
    message: 'Please configure Razorpay credentials in the admin dashboard' 
  });
}
```

### 3. Payment Verification
**File**: `src/server/api/payments/verify/POST.ts` (MODIFIED)

**Before**:
- Read Key Secret from environment variable
- Static configuration

**After**:
- Fetch Key Secret from database
- Dynamic configuration per request
- Improved error handling

**Key Changes**:
```typescript
// OLD
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const generatedSignature = createHmac('sha256', RAZORPAY_KEY_SECRET)

// NEW
const razorpayConfig = await getRazorpayConfig();
const generatedSignature = createHmac('sha256', razorpayConfig.keySecret)
```

### 4. Public Razorpay Key Endpoint
**File**: `src/server/api/config/razorpay-key/GET.ts` (NEW)

Created a public endpoint to fetch the Razorpay Key ID for frontend use:

**Endpoint**: `GET /api/config/razorpay-key`

**Response**:
```json
{
  "keyId": "rzp_live_xxxxxxxxxxxxx"
}
```

**Error Response** (when not configured):
```json
{
  "error": "Payment system not configured",
  "message": "Razorpay is not configured. Please contact the administrator."
}
```

**Security Note**: Only the Key ID is exposed (safe for public use). The Key Secret remains private.

### 5. Frontend Integration
**File**: `src/pages/pricing.tsx` (NO CHANGES NEEDED)

The frontend already receives the Key ID from the order creation response, so no changes were required. The payment flow works automatically with the new backend implementation.

## How It Works

### Payment Flow

1. **User Clicks "Buy" on Pricing Page**
   - Frontend calls `POST /api/payments/create-order`
   - Backend fetches Razorpay credentials from database
   - Backend creates Razorpay order using fetched credentials
   - Backend returns order details including Key ID

2. **Razorpay Checkout Opens**
   - Frontend initializes Razorpay with received Key ID
   - User completes payment on Razorpay

3. **Payment Verification**
   - Razorpay calls webhook with payment details
   - Backend calls `POST /api/payments/verify`
   - Backend fetches Key Secret from database
   - Backend verifies payment signature
   - Backend credits tokens to user account

### Configuration Flow

1. **Admin Configures Razorpay**
   - Admin logs into dashboard
   - Navigates to "Configure" tab
   - Enters Razorpay Key ID and Secret
   - Clicks "Save Configuration"
   - Credentials stored in `system_config` table

2. **Payment System Uses Configuration**
   - Every payment request fetches fresh credentials from database
   - No server restart required
   - Changes take effect immediately

## Benefits

### 1. **No Server Restarts Required**
- Admins can update Razorpay credentials without restarting the server
- Changes take effect immediately
- Zero downtime for configuration updates

### 2. **UI-Based Configuration**
- No need to edit environment files
- No need for SSH/terminal access
- User-friendly form with validation

### 3. **Dynamic Configuration**
- Credentials fetched per request (always up-to-date)
- Can switch between test and live keys easily
- Supports multiple environments

### 4. **Better Error Messages**
- Clear messages when Razorpay is not configured
- Guides users to configure in admin dashboard
- Helps with troubleshooting

### 5. **Audit Trail**
- Configuration changes tracked in database
- `updated_by` field shows which admin made changes
- `updated_at` timestamp for change history

## Database Schema

The `system_config` table stores all configuration:

```sql
CREATE TABLE `system_config` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `config_key` varchar(100) NOT NULL UNIQUE,
  `config_value` text,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int,
  INDEX `config_key_idx` (`config_key`)
);
```

**Razorpay Configuration Keys**:
- `razorpay_key_id` - Razorpay API Key ID (public)
- `razorpay_key_secret` - Razorpay API Key Secret (private)

## Testing the Integration

### Prerequisites
1. Database migration applied (`npm run db:migrate`)
2. Admin account created
3. Razorpay test/live account

### Test Steps

#### 1. Configure Razorpay
```bash
# Login as admin
# Navigate to Dashboard → Configure tab
# Enter Razorpay credentials:
#   Key ID: rzp_test_xxxxxxxxxxxxx (or rzp_live_xxxxxxxxxxxxx)
#   Key Secret: your_secret_key
# Click "Save Configuration"
# Verify success toast appears
```

#### 2. Test Payment Order Creation
```bash
# As authenticated user
POST /api/payments/create-order
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "amount": 500,
  "tokens": 10
}

# Expected Response:
{
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 50000,
  "currency": "INR",
  "keyId": "rzp_test_xxxxxxxxxxxxx"
}
```

#### 3. Test Payment Flow
```bash
# Go to /pricing page
# Click "Buy" on any package
# Complete payment on Razorpay
# Verify tokens are credited
# Check payment record in admin dashboard
```

#### 4. Test Configuration Update
```bash
# Change Razorpay credentials in Configure tab
# Save new credentials
# Immediately test payment (no restart needed)
# Verify new credentials are used
```

### Error Scenarios

#### Razorpay Not Configured
```bash
# Try creating order without configuration
POST /api/payments/create-order

# Expected Response:
{
  "error": "Razorpay not configured",
  "message": "Please configure Razorpay credentials in the admin dashboard"
}
```

#### Invalid Credentials
```bash
# Configure with invalid credentials
# Try creating order

# Expected: Razorpay API error
{
  "error": "Failed to create payment order",
  "details": { /* Razorpay error */ }
}
```

## Migration from Environment Variables

### Old Setup (Environment Variables)
```bash
# .env file
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

### New Setup (Database Configuration)
```bash
# No .env variables needed
# Configure through admin dashboard:
# 1. Login as admin
# 2. Go to Dashboard → Configure
# 3. Enter credentials
# 4. Save
```

### Migration Steps

1. **Backup existing credentials** from `.env` file
2. **Run database migration**: `npm run db:migrate`
3. **Login as admin** and navigate to Configure tab
4. **Enter credentials** from `.env` file
5. **Save configuration**
6. **Test payment flow** to verify
7. **Remove credentials** from `.env` file (optional)

## Security Considerations

### 1. **Key Secret Protection**
- Key Secret never exposed to frontend
- Only used server-side for signature verification
- Stored in database (not in code)

### 2. **Admin-Only Access**
- Configuration endpoints require admin JWT token
- Regular users cannot access or modify credentials

### 3. **Public Key ID Endpoint**
- `/api/config/razorpay-key` is public (no auth required)
- Only returns Key ID (safe to expose)
- Key Secret remains private

### 4. **Database Security**
- Configuration stored in database
- Protected by database access controls
- Can be encrypted at rest (database-level)

### 5. **Audit Trail**
- All configuration changes tracked
- `updated_by` field identifies admin
- `updated_at` timestamp for history

## Future Enhancements

1. **Encryption**: Encrypt sensitive configuration values in database
2. **Configuration History**: Track all configuration changes with full history
3. **Test Connection**: Add button to test Razorpay credentials
4. **Webhook Configuration**: Store and manage webhook URLs
5. **Multiple Payment Gateways**: Support Stripe, PayPal, etc.
6. **Environment-Specific Config**: Different credentials for dev/staging/production

## Troubleshooting

### Payment Order Creation Fails
```bash
# Check if Razorpay is configured
GET /api/config/razorpay-key

# If not configured:
# - Login as admin
# - Go to Configure tab
# - Enter credentials
# - Save
```

### Payment Verification Fails
```bash
# Check Key Secret is configured
# Verify signature generation uses correct secret
# Check Razorpay dashboard for payment status
```

### Configuration Not Saving
```bash
# Check admin authentication
# Verify database migration applied
# Check server logs for errors
# Verify system_config table exists
```

## Files Modified/Created

### Created
- `src/server/lib/config.ts` - Configuration helper functions
- `src/server/api/config/razorpay-key/GET.ts` - Public Key ID endpoint
- `PAYMENT_INTEGRATION_UPDATE.md` - This documentation

### Modified
- `src/server/api/payments/create-order/POST.ts` - Use database config
- `src/server/api/payments/verify/POST.ts` - Use database config

### No Changes
- `src/pages/pricing.tsx` - Frontend works automatically
- `index.html` - Razorpay script already loaded

## Summary

The payment system now uses database-stored Razorpay credentials instead of environment variables. This provides:

✅ **UI-based configuration** (no file editing)
✅ **No server restarts** (immediate effect)
✅ **Dynamic configuration** (always up-to-date)
✅ **Better error messages** (user-friendly)
✅ **Audit trail** (track changes)
✅ **Admin-only access** (secure)
✅ **Backward compatible** (frontend unchanged)

Admins can now manage Razorpay credentials through the dashboard Configure tab, making the system more flexible and easier to maintain.
