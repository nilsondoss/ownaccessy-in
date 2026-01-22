# Bulk Upload Fix - January 9, 2026

## Issue
Bulk upload feature was failing with error:
```
Error uploading properties: TypeError: row.ownerPhone.trim is not a function
```

## Root Cause
When reading CSV/Excel files, numeric values (like phone numbers) are parsed as numbers, not strings. The code was trying to call `.trim()` on a number, which caused the error.

## Solution

### 1. Fixed Phone Number Handling
Converted phone numbers to strings before calling `.trim()`:

```typescript
// Before (caused error)
if (!row.ownerPhone || row.ownerPhone.trim() === '') {
  // ...
}

// After (works correctly)
if (!row.ownerPhone || row.ownerPhone.toString().trim() === '') {
  // ...
}
```

### 2. Fixed Owner Address Handling
Also converted owner address to string for consistency:

```typescript
// Before
ownerAddress: row.ownerAddress ? row.ownerAddress.trim() : '',

// After
ownerAddress: row.ownerAddress ? row.ownerAddress.toString().trim() : '',
```

### 3. Added Excel Support
Updated file input to accept Excel files in addition to CSV:

```typescript
// Before
accept=".csv"

// After
accept=".csv,.xlsx,.xls"
```

### 4. Fixed API Response
Added `successCount` field to match frontend expectations:

```typescript
res.json({
  success: true,
  message: `Successfully uploaded ${insertedCount} properties`,
  successCount: insertedCount,  // Added this
  insertedCount,
  totalCount: data.length,
  errors: [],  // Added this
});
```

## Testing

### Test with CSV Template

1. Login as admin
2. Go to Dashboard → Properties tab
3. Click "Bulk Upload"
4. Click "Download Template"
5. Fill in the template with test data:

```csv
title,type,location,address,price,area,description,images,tokenCost,ownerName,ownerEmail,ownerPhone,ownerAddress
Test Property 1,residential,Mumbai,"Test Address 1",5000000,1200,"Test description",https://example.com/img.jpg,2,Test Owner,test@example.com,9876543210,"Mumbai, India"
Test Property 2,commercial,Delhi,"Test Address 2",10000000,2500,"Test description 2",,3,Test Owner 2,test2@example.com,9876543211,"Delhi, India"
```

6. Upload the file
7. Verify success toast: "X properties uploaded successfully and are now live!"
8. Check properties appear in the table
9. Go to /properties page and verify they appear there too

### Expected Results

✅ File uploads without errors
✅ Toast notification shows success message
✅ Properties appear in admin dashboard immediately
✅ Properties appear on public properties page (after refresh)
✅ All property details are correct
✅ Phone numbers are properly formatted

## Files Modified

1. `src/server/api/admin/properties/bulk-upload/POST.ts`
   - Convert phone numbers and addresses to strings
   - Add `successCount` and `errors` to response

2. `src/pages/dashboard.tsx`
   - Update file input to accept Excel files
   - Add helper text for supported formats

## Additional Notes

- The backend uses the `xlsx` library which can read both CSV and Excel files
- Phone numbers in CSV/Excel are often parsed as numbers (e.g., `9876543210` becomes a numeric value)
- Always use `.toString()` before calling string methods on values that might be numbers
- The fix also handles cases where owner address might be numeric

## Related Issues Fixed

- Login redirect now goes to `/dashboard` for both admin and regular users
- Removed old `/admin` route references
- Updated admin credentials documentation with correct URLs

---

**Status:** ✅ Fixed and tested
**Date:** January 9, 2026
**Commit:** 62d1f90caa443c7f81c77271d2934db9c34ea2bf
