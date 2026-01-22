# Properties Visibility on /properties Page

## Current Behavior

The `/properties` page **only shows properties where `isActive = true`**. This is a standard security and content management practice.

### Why Properties Are Filtered

**Security & Content Control:**
- Draft properties (not ready for public viewing) can be hidden
- Sold/unavailable properties can be deactivated without deletion
- Admin can control which properties are publicly visible
- Prevents accidental exposure of incomplete property data

### Database Field: `isActive`

```typescript
isActive: boolean (default: true)
```

- `true` = Property is visible on `/properties` page
- `false` = Property is hidden from public view (but still in database)

## How to Check Properties Status

### Option 1: Run Check Script

```bash
npm run check-properties
```

This will show:
- Total properties in database
- List of all properties with their active status
- Count of active vs inactive properties

### Option 2: Check in Admin Dashboard

1. Login as admin at `/login`
2. Go to Dashboard
3. Click "Properties" tab
4. View all properties with their status
5. Toggle `isActive` status for any property

## How to Make All Properties Visible

### Option 1: Run Activation Script (Recommended)

```bash
npm run activate-all-properties
```

This will:
- Check all properties in database
- Show which properties are inactive
- Activate all inactive properties
- Confirm all properties are now visible

### Option 2: Manually Activate in Admin Dashboard

1. Login as admin
2. Go to Dashboard → Properties tab
3. For each inactive property:
   - Click "Edit" button
   - Check the "Active" checkbox
   - Click "Save"

### Option 3: Activate via Database (Advanced)

```sql
UPDATE properties SET is_active = 1 WHERE is_active = 0;
```

## How to Show ALL Properties (Including Inactive)

**⚠️ Not Recommended for Production**

If you want to show ALL properties regardless of active status on the public page:

### Modify API Endpoint

**File:** `src/server/api/properties/GET.ts`

**Current Code (Line 13):**
```typescript
const conditions = [eq(properties.isActive, true)];
```

**Change to:**
```typescript
const conditions = []; // Show all properties
```

**Or make it optional:**
```typescript
const { type, location, search, showInactive } = req.query;
const conditions = showInactive === 'true' ? [] : [eq(properties.isActive, true)];
```

## Property Creation Scripts

All property creation scripts set `isActive: true` by default:

### Sample Property Script
```bash
npm run add-sample-property
```

Creates properties with:
```typescript
{
  // ... other fields
  isActive: true,  // ✅ Active by default
}
```

### Bulk Upload CSV

When uploading properties via CSV in admin dashboard:
- Properties are created with `isActive: true` by default
- Admin can change status after upload

## Troubleshooting

### "No properties showing on /properties page"

**Possible causes:**

1. **All properties are inactive**
   - Solution: Run `npm run activate-all-properties`

2. **No properties in database**
   - Solution: Run `npm run add-sample-property` to add sample data

3. **Filters are too restrictive**
   - Solution: Click "Clear Filters" button on properties page

4. **Database connection issue**
   - Check server logs for errors
   - Verify database is running

### "Some properties are missing"

**Check:**

1. Run `npm run check-properties` to see all properties and their status
2. Check if missing properties have `isActive: false`
3. Activate them using `npm run activate-all-properties`

### "Properties show in admin but not on public page"

**This is expected behavior if:**
- Properties have `isActive: false`
- Admin dashboard shows ALL properties (active + inactive)
- Public page only shows active properties

**Solution:**
- Activate the properties using admin dashboard or activation script

## API Endpoints

### Get Properties (Public)
```
GET /api/properties
```

**Returns:** Only active properties (`isActive = true`)

**Query Parameters:**
- `type` - Filter by property type
- `location` - Filter by location (partial match)
- `search` - Search in title/description

### Get All Properties (Admin)
```
GET /api/admin/properties
```

**Returns:** ALL properties (active + inactive)
**Requires:** Admin authentication

## Best Practices

### For Production

1. **Keep inactive filter** - Don't show all properties publicly
2. **Use admin dashboard** - Manage property visibility
3. **Set isActive appropriately** - Only activate ready properties
4. **Test before activating** - Preview properties in admin before making public

### For Development

1. **Activate sample properties** - Run activation script for testing
2. **Check status regularly** - Use check-properties script
3. **Use admin dashboard** - Toggle status as needed

## Scripts Reference

| Script | Command | Purpose |
|--------|---------|----------|
| Check Properties | `npm run check-properties` | View all properties and their active status |
| Activate All | `npm run activate-all-properties` | Set all properties to active |
| Add Sample | `npm run add-sample-property` | Add a sample property (active by default) |
| Create Admin | `npm run create-admin` | Create admin user to manage properties |

## Summary

**Current Setup:**
- ✅ `/properties` page shows only active properties
- ✅ Admin dashboard shows all properties
- ✅ Properties are created active by default
- ✅ Admin can toggle active status
- ✅ Inactive properties are hidden but not deleted

**To see all properties on /properties page:**
1. Run `npm run check-properties` to see status
2. Run `npm run activate-all-properties` to activate all
3. Refresh `/properties` page

**This is the recommended approach** - it maintains proper content control while making properties visible.
