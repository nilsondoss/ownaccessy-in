import { db } from '../src/server/db/client.js';
import { properties } from '../src/server/db/schema.js';

async function addCommercialProperty() {
  try {
    console.log('Adding commercial property sample...');

    const commercialProperty = {
      // Basic Information
      title: 'Premium Commercial Office Space - MG Road',
      propertyCategory: 'Commercial',
      type: 'Office Space',
      location: 'MG Road, Bangalore',
      address: 'UB City, 5th Floor, Vittal Mallya Road, MG Road, Bangalore - 560001',
      propertyId: 'PROP-MG-2024-002',
      propertyStatus: 'Ready to Occupy',

      // Areas
      landArea: 'N/A',
      builtUpArea: '5500 sq ft',
      area: '5500',
      plotDimensions: 'N/A',

      // Zoning & Development
      zoning: 'Commercial Zone C1',
      landUse: 'Commercial',
      developmentType: 'Premium Commercial Complex',
      layoutName: 'UB City Tower A',
      numberOfUnits: 45,
      unitSizes: '2000-8000 sq ft',
      floorPlan: '5th Floor - Open plan with cabin options',

      // Infrastructure
      roadAccess: 'MG Road - 100 feet wide',
      roadWidth: '100 feet',
      powerAvailability: 'BESCOM 3-phase with 100% DG backup',
      waterAvailability: 'BWSSB + Water storage tanks',
      drainageSystem: 'Commercial drainage system',
      sewageSystem: 'Centralized sewage treatment',
      parkingSpaces: '15 reserved parking slots',
      vehicleAccess: 'Multi-level parking with valet service',

      // Amenities & Construction
      amenities: 'High-speed elevators, 24x7 Security, Cafeteria, Conference rooms, Centralized AC, High-speed internet ready, Reception area, Visitor lounge, ATM, Food court',
      infrastructure: 'Fire safety systems, CCTV surveillance, Access control, Intercom, Video door phones, Waste management, Housekeeping services',
      furnishingStatus: 'Bare Shell',
      constructionStatus: 'Completed',

      // Legal & Approvals
      governmentApprovals: 'BDA Approved, BBMP Approved, Fire NOC, Occupancy Certificate',
      reraStatus: 'RERA Registered - PRM/KA/RERA/1251/446/PR/171120/003456',
      dtcpStatus: 'BBMP Approved',
      cmdaStatus: 'BDA Approved',
      environmentalClearance: 'Environmental Clearance Obtained',
      legalVerificationStatus: 'Verified - Clear Commercial Title',

      // Ownership
      ownershipType: 'Freehold',
      titleDeedDetails: 'Clear freehold commercial title with UDS',
      taxStatus: 'Commercial property tax paid',
      encumbranceStatus: 'No Encumbrance - Clear EC',

      // Financial
      investmentPotential: 'Excellent - MG Road is Bangalore\'s premier business district. High rental yields of 6-8% annually. Strong capital appreciation.',
      rentalIncome: '₹3,50,000 - ₹4,50,000 per month',
      leaseTerms: 'Minimum 3 years lease, lock-in period negotiable',
      price: '8,25,00,000',
      paymentTerms: 'Bank loan available - 70% funding. Flexible payment schedule available.',
      pricePerSqft: '15,000',
      pricePerAcre: 'N/A',
      marketValueTrend: 'Stable with steady growth - 8% appreciation in last 3 years',

      // Description & Location
      description: 'Premium Grade-A commercial office space in the iconic UB City complex on MG Road. This spacious office features modern infrastructure, high ceilings, excellent natural lighting, and stunning city views. Perfect for corporate offices, IT companies, consulting firms, or financial institutions. The property offers world-class amenities and is located in Bangalore\'s most prestigious business address.',
      connectivity: 'MG Road Metro Station - 500m, Trinity Metro Station - 800m, Kempegowda Bus Station - 2 km, City Railway Station - 3 km, International Airport - 38 km',
      nearbyFacilities: 'Banks: All major banks within 200m | Hotels: The Oberoi (adjacent), ITC Windsor (1 km) | Restaurants: Multiple fine dining options in UB City | Shopping: UB City Mall, Commercial Street (1 km) | Hospitals: Mallya Hospital (500m)',
      suitability: 'Commercial - Corporate Offices, IT Companies, Consulting Firms',

      // Development
      projectPhase: 'Completed',
      developmentStage: 'Fully Operational',
      builderName: 'UB Group',
      developerName: 'Prestige Group',
      contractorName: 'Shapoorji Pallonji',
      maintenanceCost: '₹55,000 per month',
      operatingCost: '₹75,000 per month (including CAM charges)',

      // Risk
      riskAssessment: 'Very Low Risk - Prime location, Grade-A building, established business district',
      complianceCheck: 'Fully Compliant - All commercial approvals in place',

      // Media
      imageUrl: 'https://media.gettyimages.com/id/1629266462/photo/view-of-moody-rainy-morning-at-san-francisco-downtown-district-california.jpg?b=1&s=2048x2048&w=0&k=20&c=R3c-wrqmmivWr4y1fpWyXt2dZfy_FY8omL4L8KiEA9k=',
      images: null,
      documents: null,
      legalDocuments: null,
      approvalDocuments: null,
      ownershipProof: null,

      // Owner (Token Protected)
      ownerName: 'Prestige Estates Projects Ltd',
      ownerEmail: 'sales.commercial@prestigegroup.com',
      ownerPhone: '+91 80 2559 9000',
      ownerAddress: 'Prestige Falcon Tower, Brunton Road, Bangalore - 560025',
      identityVerification: 'Corporate Entity - Verified',

      // Meta
      viewsCount: 532,
      tokenCost: 75,
      isActive: true,
    };

    const result = await db.insert(properties).values(commercialProperty);
    const propertyId = Number(result[0].insertId);

    console.log('✅ Commercial property added successfully!');
    console.log(`Property ID: ${propertyId}`);
    console.log(`Title: ${commercialProperty.title}`);
    console.log(`Location: ${commercialProperty.location}`);
    console.log(`Price: ₹${commercialProperty.price}`);
    console.log(`\nYou can view it at: /properties/${propertyId}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding commercial property:', error);
    process.exit(1);
  }
}

addCommercialProperty();
