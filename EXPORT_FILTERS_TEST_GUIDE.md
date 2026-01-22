# Export Filters Testing Guide

## Overview
Comprehensive export filters have been added to all admin dashboard tabs. This guide helps you test the functionality.

## Test Environment
- **Preview URL**: https://qey66h1e3v.preview.c24.airoapp.ai
- **Admin Login**: Use credentials from `ADMIN_CREDENTIALS.md`
- **Dashboard Path**: `/dashboard` (after login)

---

## Filter Features by Tab

### 1. Analytics Tab
**Location**: Dashboard → Analytics Tab → Export Filters Card

**Available Filters**:
- From Date (date picker)
- To Date (date picker)
- Clear Filters button

**Test Steps**:
1. Navigate to Analytics tab
2. Set date range (e.g., last 30 days)
3. Click "Download Excel" button
4. Open downloaded file
5. Verify:
   - Summary sheet shows filtered date range
   - Revenue by Day only includes dates in range
   - User Growth only includes dates in range
   - Unlocks by Day only includes dates in range
   - Totals are recalculated for filtered data

**Expected Behavior**:
- Empty filters = export all data ("All Time")
- From Date only = export from that date forward
- To Date only = export up to that date
- Both dates = export only data within range

---

### 2. Properties Tab
**Location**: Dashboard → Properties Tab → Export Filters Card

**Available Filters**:
- Category dropdown (Residential, Commercial, Agricultural, Industrial)
- Status dropdown (Available, Sold, Under Contract)
- From Date (property creation date)
- To Date (property creation date)
- Search box (title, location, address, owner name)
- Clear Filters button

**Test Steps**:
1. Navigate to Properties tab
2. Test each filter individually:
   - Select "Residential" category → Download → Verify only residential properties
   - Select "Available" status → Download → Verify only available properties
   - Set date range → Download → Verify only properties created in range
   - Search "Whitefield" → Download → Verify only matching properties
3. Test combined filters:
   - Category: Commercial + Status: Available → Download → Verify both conditions
   - Date range + Search term → Download → Verify both conditions
4. Click "Clear Filters" → Verify all filters reset

**Expected Behavior**:
- Filters are cumulative (AND logic)
- Search is case-insensitive
- Search matches partial text
- Empty filters = export all properties

---

### 3. Users Tab
**Location**: Dashboard → Users Tab → Export Filters Card

**Available Filters**:
- Role dropdown (User, Admin)
- From Date (registration date)
- To Date (registration date)
- Search box (name, email, phone)
- Clear Filters button

**Test Steps**:
1. Navigate to Users tab
2. Test each filter:
   - Select "Admin" role → Download → Verify only admin users
   - Set date range → Download → Verify only users registered in range
   - Search by email → Download → Verify matching users
3. Test combined filters:
   - Role: User + Date range → Download → Verify both conditions
4. Click "Clear Filters" → Verify all filters reset

**Expected Behavior**:
- Role filter shows only selected role
- Date range filters by registration date
- Search matches name, email, or phone
- Empty filters = export all users

---

### 4. Payments Tab
**Location**: Dashboard → Payments Tab

**Available Filters** (Backend logic ready):
- Status filter
- Date range filter
- Search filter (user name, email, order ID, payment ID)

**Test Steps**:
1. Navigate to Payments tab
2. Test filters when UI is added:
   - Filter by payment status
   - Filter by date range
   - Search by order ID or user email

**Note**: Filter UI needs to be added to this tab (similar to other tabs)

---

### 5. Token Logs Tab
**Location**: Dashboard → Token Logs Tab

**Available Filters** (Backend logic ready):
- Type filter (transaction type)
- Date range filter
- Search filter (user name, email, description)

**Test Steps**:
1. Navigate to Token Logs tab
2. Test filters when UI is added:
   - Filter by transaction type
   - Filter by date range
   - Search by user or description

**Note**: Filter UI needs to be added to this tab (similar to other tabs)

---

## Common Test Scenarios

### Scenario 1: Date Range Filtering
**Objective**: Verify date range filters work correctly

1. Go to Analytics tab
2. Set From Date: 2026-01-01
3. Set To Date: 2026-01-31
4. Download Excel
5. Verify only January 2026 data is included

### Scenario 2: Multi-Filter Combination
**Objective**: Verify multiple filters work together

1. Go to Properties tab
2. Set Category: Commercial
3. Set Status: Available
4. Set Search: "Bangalore"
5. Download Excel
6. Verify only commercial, available properties in Bangalore

### Scenario 3: Clear Filters
**Objective**: Verify clear filters button works

1. Go to any tab with filters
2. Set multiple filters
3. Click "Clear Filters"
4. Verify all filter fields are reset to empty/default
5. Download Excel
6. Verify all data is exported

### Scenario 4: Empty Results
**Objective**: Verify behavior when no data matches filters

1. Go to Properties tab
2. Set impossible combination (e.g., Category: Agricultural + Search: "nonexistent")
3. Download Excel
4. Verify Excel file is created with headers but no data rows

---

## Technical Verification

### Type Safety
```bash
npm run type-check
```
**Expected**: No filter-related TypeScript errors

### Filter State Management
- All filters use centralized `exportFilters` state
- State persists across tab switches within session
- State resets on page reload

### Filter Logic
- **Date filters**: Uses JavaScript Date comparison
- **Dropdown filters**: Exact string match
- **Search filters**: Case-insensitive substring match
- **Multiple filters**: AND logic (all conditions must match)

---

## Known Limitations

1. **Payments Tab**: Filter UI not yet added (backend logic ready)
2. **Token Logs Tab**: Filter UI not yet added (backend logic ready)
3. **Filter Persistence**: Filters reset on page reload
4. **Export Preview**: No preview of filtered data before download
5. **Filter Count**: No indicator showing how many records match filters

---

## Troubleshooting

### Issue: Download button not responding
**Solution**: Check browser console for errors, verify admin authentication

### Issue: Filters not applying
**Solution**: 
1. Verify filter values are set correctly
2. Check that "Clear Filters" wasn't accidentally clicked
3. Try refreshing the page and re-applying filters

### Issue: Excel file empty
**Solution**: 
1. Verify filters aren't too restrictive
2. Check that data exists in database
3. Try clearing filters and downloading again

### Issue: Date filters not working
**Solution**:
1. Verify date format is YYYY-MM-DD
2. Check that From Date is before To Date
3. Ensure dates are within data range

---

## Success Criteria

✅ **Analytics Tab**:
- Date range filter correctly limits chart data
- Filtered totals are recalculated
- Export shows date range in summary

✅ **Properties Tab**:
- Category filter shows only selected category
- Status filter shows only selected status
- Date range filters by creation date
- Search matches title, location, address, owner
- Multiple filters work together (AND logic)

✅ **Users Tab**:
- Role filter shows only selected role
- Date range filters by registration date
- Search matches name, email, phone

✅ **All Tabs**:
- Clear Filters button resets all fields
- Empty filters export all data
- Excel files download successfully
- Data in Excel matches applied filters

---

## Next Steps

1. **Add Filter UI to Payments Tab**
2. **Add Filter UI to Token Logs Tab**
3. **Add Export Count Indicator** ("Exporting X records")
4. **Add Filter Preview** (show filtered count before download)
5. **Add Filter Persistence** (save filters in localStorage)
6. **Add Advanced Filters** (amount range, token balance range)

---

## Feedback

If you encounter any issues or have suggestions for improvement, please document them for future enhancements.
