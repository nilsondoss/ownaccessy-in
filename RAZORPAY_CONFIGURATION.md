# Razorpay Configuration Feature

## Overview
Added a manual configuration interface for Razorpay payment gateway settings in the admin dashboard. Admins can now configure live Razorpay credentials directly through the UI without editing environment files.

## Features Implemented

### 1. Configuration Tab in Admin Dashboard
- New "Configure" tab added to admin dashboard (7th tab)
- Accessible only to admin users
- Clean, professional UI with form validation

### 2. Database Schema
- **Table**: `system_config`
- **Columns**:
  - `id` (int, primary key, auto-increment)
  - `config_key` (varchar 100, unique) - Configuration key name
  - `config_value` (text) - Configuration value
  - `updated_at` (timestamp) - Last update timestamp
  - `updated_by` (int) - Admin user ID who made the update
- **Index**: `config_key_idx` on `config_key` column

### 3. API Endpoints

#### GET `/api/admin/config`
- **Auth**: Requires admin JWT token
- **Returns**: Current Razorpay configuration
```json
{
  "razorpayKeyId": "rzp_live_xxxxx",
  "razorpayKeySecret": "secret_xxxxx"
}
```

#### POST `/api/admin/config`
- **Auth**: Requires admin JWT token
- **Body**:
```json
{
  "razorpayKeyId": "rzp_live_xxxxx",
  "razorpayKeySecret": "secret_xxxxx"
}
```
- **Returns**: Success confirmation
```json
{
  "success": true,
  "message": "Configuration saved successfully"
}
```

### 4. UI Components

#### Configuration Form
- **Razorpay Key ID** field (text input, required)
  - Placeholder: `rzp_live_xxxxxxxxxxxxx`
  - Help text: "Your Razorpay API Key ID (starts with rzp_live_ or rzp_test_)"
  
- **Razorpay Key Secret** field (password input, required)
  - Masked input for security
  - Help text: "Your Razorpay API Key Secret (keep this confidential)"

#### Action Buttons
- **Load Saved Configuration**: Fetches and populates current settings
- **Save Configuration**: Saves settings to database

#### User Feedback
- Toast notifications for success/error states
- Loading states during API calls
- Link to Razorpay Dashboard for obtaining credentials

## Usage Instructions

### For Admins

1. **Access Configuration**
   - Login as admin
   - Navigate to Dashboard
   - Click on "Configure" tab

2. **Get Razorpay Credentials**
   - Visit [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
   - Copy your Key ID (starts with `rzp_live_` or `rzp_test_`)
   - Copy your Key Secret

3. **Save Configuration**
   - Paste Key ID in the first field
   - Paste Key Secret in the second field
   - Click "Save Configuration"
   - Wait for success confirmation

4. **Load Existing Configuration**
   - Click "Load Saved Configuration" button
   - Form will populate with saved values
   - Key Secret will be masked for security

## Security Features

1. **Admin-Only Access**
   - Configuration endpoints require admin JWT token
   - Non-admin users cannot access configuration

2. **Password Field**
   - Key Secret is masked in the UI
   - Not visible in plain text

3. **Audit Trail**
   - `updated_by` field tracks which admin made changes
   - `updated_at` timestamp for change tracking

4. **Database Storage**
   - Credentials stored in database (not in code)
   - Can be backed up with regular database backups

## Database Migration

**Migration File**: `drizzle/0006_*.sql`

The migration creates the `system_config` table with proper indexes and constraints.

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

## Configuration Keys

Currently supported configuration keys:
- `razorpay_key_id` - Razorpay API Key ID
- `razorpay_key_secret` - Razorpay API Key Secret

## Future Enhancements

Potential additions:
1. Configuration history/audit log
2. Test connection button to verify credentials
3. Support for other payment gateways
4. Email/SMS service configuration
5. General site settings (site name, logo, etc.)
6. Encryption for sensitive configuration values

## Technical Details

### State Management
```typescript
const [configData, setConfigData] = useState({
  razorpayKeyId: '',
  razorpayKeySecret: '',
});
const [configLoading, setConfigLoading] = useState(false);
```

### Form Submission
- Prevents default form submission
- Shows loading state during save
- Displays toast notification on success/error
- Resets loading state in finally block

### Data Persistence
- Uses upsert pattern (update if exists, insert if not)
- Separate handling for each configuration key
- Tracks admin user who made the change

## Testing

### Manual Testing Steps

1. **Save Configuration**
   - Enter valid Razorpay credentials
   - Click Save
   - Verify success toast appears
   - Check database for saved values

2. **Load Configuration**
   - Click "Load Saved Configuration"
   - Verify form populates with saved values
   - Verify Key Secret is masked

3. **Update Configuration**
   - Load existing configuration
   - Modify values
   - Save again
   - Verify updated values in database

4. **Security Testing**
   - Try accessing endpoints without admin token (should fail)
   - Try accessing as regular user (should fail)
   - Verify Key Secret is not exposed in API responses

## Files Modified/Created

### Created
- `src/server/db/schema.ts` - Added `systemConfig` table definition
- `src/server/api/admin/config/GET.ts` - Get configuration endpoint
- `src/server/api/admin/config/POST.ts` - Save configuration endpoint
- `drizzle/0006_*.sql` - Database migration file
- `RAZORPAY_CONFIGURATION.md` - This documentation

### Modified
- `src/pages/dashboard.tsx` - Added Configure tab and UI

## Notes

- Configuration is stored in database, not environment variables
- Admin authentication required for all configuration operations
- Form includes validation (required fields)
- Toast notifications provide user feedback
- Link to Razorpay Dashboard for easy credential access
