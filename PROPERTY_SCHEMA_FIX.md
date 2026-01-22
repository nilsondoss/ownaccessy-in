# Property Schema Fix - January 9, 2026

## Issue
Properties page and admin dashboard were not showing properties correctly. The database schema was missing several critical columns that the application code was trying to use.

## Root Cause
The `properties` table schema in `src/server/db/schema.ts` was outdated and missing:
- `imageUrl` - Primary image URL
- `tokenCost` - Tokens required to unlock property
- `isActive` - Active/inactive status flag
- Owner information fields (ownerName, ownerEmail, ownerPhone, ownerAddress)

The application code was trying to query these non-existent columns, causing SQL errors.

## Solution

### 1. Updated Schema Definition

Added missing columns to the `properties` table:

```typescript
export const properties = mysqlTable('properties', {
  // ... existing fields ...
  imageUrl: text('image_url'),
  tokenCost: int('token_cost').notNull().default(5),
  isActive: boolean('is_active').notNull().default(true),
  status: boolean('status').notNull().default(true), // Alias for isActive
  ownerId: int('owner_id'),
  ownerName: varchar('owner_name', { length: 255 }),
  ownerEmail: varchar('owner_email', { length: 255 }),
  ownerPhone: varchar('owner_phone', { length: 20 }),
  ownerAddress: text('owner_address'),
  // ...
});
```

### 2. Changed Price Column Type

Changed from `decimal(15,2)` to `varchar(50)` for flexibility:

```typescript
// Before
price: decimal('price', { precision: 15, scale: 2 }).notNull(),

// After
price: varchar('price', { length: 50 }).notNull(),
```

### 3. Fixed Admin Properties Endpoint

Removed the unnecessary join with `property_owners` table since owner data is now denormalized in the `properties` table:

```typescript
// Before (caused errors)
const allProperties = await db
  .select({ /* ... */ })
  .from(properties)
  .leftJoin(propertyOwners, eq(properties.ownerId, propertyOwners.id));

// After (works correctly)
const allProperties = await db
  .select({
    id: properties.id,
    // ... other fields ...
    ownerName: properties.ownerName,
    ownerEmail: properties.ownerEmail,
    ownerPhone: properties.ownerPhone,
    ownerAddress: properties.ownerAddress,
  })
  .from(properties);
```

### 4. Generated and Applied Migration

Created migration `0003_smiling_obadiah_stane.sql` that:
- Modified `price` column to varchar(50)
- Added `image_url` column
- Added `token_cost` column with default value 5
- Added `is_active` column with default value true
- Added `owner_id`, `owner_name`, `owner_email`, `owner_phone`, `owner_address` columns
- Created index on `is_active` column

## Database Architecture Decision

**Denormalization Strategy:**

We're storing owner information directly in the `properties` table (denormalized) rather than using a separate `property_owners` table (normalized). This is because:

1. **Performance**: Avoids JOIN queries for common property listings
2. **Simplicity**: Easier to query and maintain
3. **Use Case**: Owner info is always displayed with property info
4. **Trade-off**: Slight data duplication is acceptable for this use case

The `property_owners` table still exists but is marked as deprecated in the schema.

## Files Modified

1. **src/server/db/schema.ts**
   - Added missing columns to properties table
   - Changed price column type
   - Added indexes
   - Marked property_owners table as deprecated

2. **src/server/api/admin/properties/GET.ts**
   - Removed join with property_owners table
   - Query owner fields directly from properties table
   - Removed unused imports

3. **drizzle/0003_smiling_obadiah_stane.sql** (generated)
   - Migration to add missing columns

## Testing

### Test Admin Dashboard

1. Login as admin: https://qey66h1e3v.preview.c24.airoapp.ai/login
   - Email: `admin@ownaccessy.com`
   - Password: `Admin@098`

2. Go to Dashboard → Properties tab

3. Verify:
   - ✅ Properties table loads without errors
   - ✅ All property data displays correctly
   - ✅ Owner information shows in each row
   - ✅ Can create new properties
   - ✅ Can edit existing properties
   - ✅ Can delete properties
   - ✅ Bulk upload works

### Test Properties Page

1. Go to: https://qey66h1e3v.preview.c24.airoapp.ai/properties

2. Verify:
   - ✅ Properties load and display
   - ✅ Images show correctly
   - ✅ Token costs display
   - ✅ Search and filters work
   - ✅ Can view property details
   - ✅ Auto-refresh works (every 30 seconds)
   - ✅ Manual refresh button works

### Test Property Creation

1. Admin Dashboard → Properties → Add Property

2. Fill in all fields including owner information

3. Submit

4. Verify:
   - ✅ Property appears in admin table immediately
   - ✅ Toast notification shows success
   - ✅ Property appears on /properties page (after refresh)
   - ✅ All data including owner info is saved correctly

## Expected Results

✅ No more SQL errors about missing columns
✅ Properties page loads and displays all properties
✅ Admin dashboard shows properties with full details
✅ Property creation/editing works correctly
✅ Bulk upload works with owner information
✅ Owner information displays properly

## Related Fixes in This Session

1. **Login Redirect** - Fixed to redirect to `/dashboard` for all users
2. **Bulk Upload** - Fixed phone number handling (convert to string before trim)
3. **Property Schema** - Added missing columns and fixed admin endpoint

## Migration Commands Used

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migration to database
npm run db:migrate
```

## Technical Notes

- **Column Naming**: Using snake_case in database (`image_url`, `token_cost`) but camelCase in TypeScript (`imageUrl`, `tokenCost`)
- **Boolean Columns**: Both `status` and `isActive` exist for backward compatibility
- **Default Values**: `tokenCost` defaults to 5, `isActive` defaults to true
- **Indexes**: Added index on `is_active` for faster filtering of active properties
- **Price Storage**: Changed to varchar for flexibility (can store formatted strings like "₹5,000,000")

---

**Status:** ✅ Fixed and migrated
**Date:** January 9, 2026
**Migration:** 0003_smiling_obadiah_stane.sql
**Commit:** a63270a95e0e8fc1a4eed1fb8cfbd99f8f2cef6f
