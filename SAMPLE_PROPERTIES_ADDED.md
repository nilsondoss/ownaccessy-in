# Sample Properties Added to ownaccessy

## Overview
Two comprehensive sample properties have been added to showcase all 52 fields in the property detail system.

---

## Property 1: Residential Villa

**Property ID:** 10  
**View at:** `/properties/10`

### Basic Details
- **Title:** Premium Gated Community Villa - Whitefield
- **Category:** Residential
- **Type:** Villa
- **Location:** Whitefield, Bangalore
- **Price:** ₹2,85,00,000 (₹8,906/sq.ft)
- **Token Cost:** 50 tokens

### Key Features
- **Land Area:** 2400 sq ft
- **Built-up Area:** 3200 sq ft
- **Plot Dimensions:** 40x60 feet
- **Configuration:** 4BHK with G+2 floors
- **Status:** Ready to Move

### Highlights
- Premium gated community by Brigade Group
- RERA approved with clear title
- World-class amenities (pool, gym, clubhouse)
- Excellent connectivity to IT corridor
- High investment potential (8-10% annual appreciation)
- Rental income: ₹60,000 - ₹75,000/month

### Legal Status
- ✅ RERA Approved
- ✅ DTCP Approved
- ✅ BDA Approved
- ✅ Environmental Clearance
- ✅ Clear Title - No Encumbrance

### Owner Details (Token Protected)
- **Name:** Rajesh Kumar Sharma
- **Phone:** +91 98765 43210
- **Email:** rajesh.sharma@example.com
- **Verification:** Aadhaar Verified

---

## Property 2: Commercial Office Space

**Property ID:** 11  
**View at:** `/properties/11`

### Basic Details
- **Title:** Premium Commercial Office Space - MG Road
- **Category:** Commercial
- **Type:** Office Space
- **Location:** MG Road, Bangalore
- **Price:** ₹8,25,00,000 (₹15,000/sq.ft)
- **Token Cost:** 75 tokens

### Key Features
- **Built-up Area:** 5500 sq ft
- **Floor:** 5th Floor, UB City Tower A
- **Configuration:** Open plan with cabin options
- **Status:** Ready to Occupy
- **Furnishing:** Bare Shell

### Highlights
- Grade-A commercial space in iconic UB City
- Prime MG Road location
- 100% DG backup power
- 15 reserved parking slots
- High rental yields (6-8% annually)
- Rental income: ₹3,50,000 - ₹4,50,000/month

### Legal Status
- ✅ RERA Registered
- ✅ BBMP Approved
- ✅ Fire NOC
- ✅ Occupancy Certificate
- ✅ Clear Commercial Title

### Owner Details (Token Protected)
- **Name:** Prestige Estates Projects Ltd
- **Phone:** +91 80 2559 9000
- **Email:** sales.commercial@prestigegroup.com
- **Verification:** Corporate Entity - Verified

---

## Fields Demonstrated

Both properties showcase all 52 comprehensive fields:

### ✅ Populated Fields (50+)
1. Basic Information (title, category, type, location)
2. Property Details (ID, status, areas)
3. Dimensions & Zoning
4. Project Details (layout, units, floor plan)
5. Infrastructure (roads, utilities, parking)
6. Amenities & Construction
7. Legal & Approvals (RERA, DTCP, CMDA, etc.)
8. Ownership & Legal Status
9. Financial Details (pricing, investment potential)
10. Description & Location Details
11. Development & Builder Information
12. Risk Assessment & Compliance
13. Owner Details (token-protected)
14. Analytics (views count)

### 🎨 UI Features Demonstrated
- 5-tab organization (Overview, Infrastructure, Legal, Financial, Location)
- Color-coded approval status badges
- Icon-based information display
- Token-protected owner section
- Share, favorite, and report buttons
- View counter
- Identity verification badges
- PDF/Excel download options (after unlock)

---

## Testing the Properties

### View Properties
1. Navigate to `/properties` to see both properties in the listing
2. Click on either property to view full details
3. Explore all 5 tabs to see comprehensive information

### Test Token Unlock
1. Login with a user account
2. Ensure you have sufficient tokens (50 for villa, 75 for office)
3. Click "Unlock Now" to reveal owner details
4. Download PDF/Excel after unlocking

### Admin Testing
1. Login as admin
2. Go to Dashboard → Properties tab
3. View/edit these sample properties
4. Test bulk upload with similar data

---

## Scripts Available

```bash
# Add residential villa sample
npm run add-sample-property

# Add commercial office sample (manual)
npx tsx scripts/add-commercial-property.ts
```

---

## Next Steps

1. **Test Property Pages:** Visit `/properties/10` and `/properties/11`
2. **Test Unlock Flow:** Unlock properties with tokens
3. **Admin Dashboard:** Edit properties to test all fields
4. **Add More Samples:** Create land/agricultural property samples
5. **Configure Payments:** Setup Razorpay to buy tokens

---

## Notes

- Both properties have realistic, comprehensive data
- All legal statuses are marked as approved for demo purposes
- Owner details are sample data (not real contacts)
- Images are stock photos from Getty Images
- View counts are simulated for demonstration
