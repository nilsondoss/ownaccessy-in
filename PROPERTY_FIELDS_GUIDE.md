# Property Fields Guide - ownaccessy

## Complete Property Information Structure (52 Fields)

This document outlines all 52 fields available in the property detail system.

### Basic Information (Fields 1-4)
1. **Property Title** - Main property name/title
2. **Property Category** - Residential, Commercial, Industrial, Agricultural
3. **Property Type** - Apartment, Villa, Plot, Office, Warehouse, etc.
4. **Location & Address** - Full location and address details

### Property Details (Fields 5-7)
5. **Property ID** - Unique identifier for the property
6. **Property Status** - Sale, Rent, Lease, Development
7. **Land / Built-up Area** - Total land area and built-up area

### Dimensions & Zoning (Fields 8-10)
8. **Plot Dimensions** - e.g., "50x80 feet"
9. **Zoning & Land Use** - Residential, Commercial, Industrial zoning
10. **Development Type** - Gated Community, Standalone, etc.

### Project Details (Fields 11-14)
11. **Layout / Project Name** - Name of the layout or project
12. **Number of Units / Plots** - Total count of units or plots
13. **Unit Sizes** - Available unit size options
14. **Floor Plan / Layout Map** - Floor plan details or URL

### Infrastructure (Fields 15-18)
15. **Road Access & Road Width** - Type of road and width (e.g., "40 feet")
16. **Power & Water Availability** - Utility availability status
17. **Drainage & Sewage** - Drainage and sewage system details
18. **Parking & Vehicle Access** - Parking spaces and vehicle access info

### Amenities & Construction (Fields 19-20)
19. **Amenities & Infrastructure** - List of amenities and facilities
20. **Furnishing / Construction Status** - Furnished/Semi-furnished/Unfurnished, Construction status

### Legal & Approvals (Fields 21-24)
21. **Government Approvals** - List of government approvals obtained
22. **RERA / DTCP / CMDA Status** - Regulatory approval statuses
23. **Environmental Clearance** - Environmental clearance status
24. **Legal Verification Status** - Legal verification completion status

### Ownership & Legal (Fields 25-27)
25. **Ownership Type** - Freehold, Leasehold, Co-operative
26. **Title & Deed Details** - Title deed information
27. **Tax & Encumbrance Status** - Tax clearance and encumbrance status

### Financial Details (Fields 28-32)
28. **Investment Potential** - Investment analysis and potential
29. **Rental Income / Lease Terms** - Expected rental income and lease details
30. **Price & Payment Terms** - Total price and payment structure
31. **Price per Sq.ft / Acre** - Unit pricing information
32. **Market Value Trend** - Rising, Stable, Declining

### Description & Location (Fields 33-36)
33. **Property Description** - Detailed property description
34. **Location & Connectivity** - Transportation and connectivity details
35. **Nearby Facilities** - Schools, hospitals, malls, etc.
36. **Suitability** - Residential, Industrial, Commercial, Farm

### Development & Builder (Fields 37-39)
37. **Project Phase / Development Stage** - Current phase and stage
38. **Builder / Developer / Contractor** - Builder and developer information
39. **Maintenance & Operating Cost** - Ongoing costs

### Risk & Compliance (Field 40)
40. **Risk & Compliance Check** - Risk assessment and compliance status

### 🔒 Token-Protected Fields (Fields 41-47)
41. **Owner Name** - Property owner's full name
42. **Contact Number** - Owner's phone number
43. **Email ID** - Owner's email address
44. **Identity Verification** - Verification status (Verified/Pending/Not Verified)
45. **Download Property Documents** - PDF download with all details
46. **Download Legal & Approval Files** - Excel download option
47. **Download Ownership Proof** - Document downloads

### Analytics & Metadata (Fields 48-52)
48. **Property Views Count** - Number of times property was viewed
49. **Last Updated Date** - When property information was last updated
50. **Report / Flag Property** - Report inappropriate listings
51. **Similar Properties** - (Future feature)
52. **Save to Wishlist** - Add to favorites/wishlist

## UI Organization

The property detail page organizes these fields into 5 tabs:

### 1. Overview Tab
- Property details (type, category, status)
- Dimensions and zoning
- Development type and project info
- Furnishing and construction status
- Description
- Amenities
- Builder/Developer information

### 2. Infrastructure Tab
- Road access and width
- Power and water availability
- Drainage and sewage systems
- Parking and vehicle access
- Additional infrastructure details
- Operating costs

### 3. Legal Tab
- RERA, DTCP, CMDA status (with color-coded badges)
- Environmental clearance
- Legal verification status
- Ownership type
- Tax and encumbrance status
- Government approvals
- Title deed details
- Risk assessment
- Compliance check

### 4. Financial Tab
- Price and pricing per unit
- Market value trend
- Rental income potential
- Payment terms
- Lease terms
- Investment potential

### 5. Location Tab
- Location and address
- Connectivity details
- Nearby facilities

## Token-Protected Section

When a user unlocks a property:
- Owner contact details are revealed
- Identity verification status is shown
- PDF and Excel download buttons become available
- All information is accessible forever (one-time payment)

## Database Schema

All fields are stored in the `properties` table with appropriate data types:
- VARCHAR for short text fields
- TEXT for long descriptions
- INT for numeric values
- BOOLEAN for status flags
- TIMESTAMP for dates

## API Response

The GET `/api/properties/:id` endpoint returns all fields in a structured JSON format, with token-protected fields only included when `isUnlocked: true`.

## Admin Dashboard

Admins can add/edit all these fields through the property management interface in the dashboard.
