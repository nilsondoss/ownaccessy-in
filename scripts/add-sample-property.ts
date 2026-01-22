import { db } from '../src/server/db/client.js';
import { properties } from '../src/server/db/schema.js';

async function addSampleProperty() {
  try {
    console.log('Adding comprehensive sample property...');

    const sampleProperty = {
      // Basic Information
      title: 'Premium Gated Community Villa - Whitefield',
      propertyCategory: 'Residential',
      type: 'Villa',
      location: 'Whitefield, Bangalore',
      address: 'Plot No. 45, Brigade Meadows, ITPL Main Road, Whitefield, Bangalore - 560066',
      propertyId: 'PROP-WF-2024-001',
      propertyStatus: 'Ready to Move',

      // Areas
      landArea: '2400 sq ft',
      builtUpArea: '3200 sq ft',
      area: '3200',
      plotDimensions: '40x60 feet',

      // Zoning & Development
      zoning: 'Residential Zone R2',
      landUse: 'Residential',
      developmentType: 'Gated Community',
      layoutName: 'Brigade Meadows Phase 2',
      numberOfUnits: 120,
      unitSizes: '2400-3500 sq ft',
      floorPlan: 'G+2 floors with terrace',

      // Infrastructure
      roadAccess: 'ITPL Main Road - 80 feet wide',
      roadWidth: '80 feet',
      powerAvailability: 'BESCOM 3-phase connection with backup',
      waterAvailability: 'BWSSB connection + Borewell + Rainwater harvesting',
      drainageSystem: 'Underground drainage system',
      sewageSystem: 'STP treated sewage system',
      parkingSpaces: '2 covered + 2 open parking',
      vehicleAccess: '24x7 wide entry gates with security',

      // Amenities & Construction
      amenities: 'Clubhouse, Swimming Pool, Gym, Children Play Area, Jogging Track, 24x7 Security, Power Backup, Landscaped Gardens, Indoor Games Room, Yoga/Meditation Hall',
      infrastructure: 'Paved internal roads, Street lighting, CCTV surveillance, Intercom facility, Visitor parking, Waste management system',
      furnishingStatus: 'Semi-Furnished',
      constructionStatus: 'Completed',

      // Legal & Approvals
      governmentApprovals: 'BDA Approved, RERA Registered, Occupancy Certificate Obtained',
      reraStatus: 'RERA Approved - PRM/KA/RERA/1251/446/PR/171120/002345',
      dtcpStatus: 'DTCP Approved',
      cmdaStatus: 'BDA Approved',
      environmentalClearance: 'Environmental Clearance Obtained',
      legalVerificationStatus: 'Verified - Clear Title',

      // Ownership
      ownershipType: 'Freehold',
      titleDeedDetails: 'Clear freehold title with all original documents available',
      taxStatus: 'Property tax paid up to date',
      encumbranceStatus: 'No Encumbrance - EC available for 30 years',

      // Financial
      investmentPotential: 'High - Whitefield is a prime IT hub with excellent appreciation potential. Expected 8-10% annual appreciation.',
      rentalIncome: '₹60,000 - ₹75,000 per month',
      leaseTerms: 'Available for lease - Minimum 11 months, negotiable',
      price: '2,85,00,000',
      paymentTerms: 'Bank loan available - 80% funding from all major banks. Flexible payment plans available.',
      pricePerSqft: '8,906',
      pricePerAcre: 'N/A',
      marketValueTrend: 'Rising - 12% growth in last 2 years',

      // Description & Location
      description: 'Luxurious 4BHK villa in the prestigious Brigade Meadows gated community. This spacious villa features modern architecture with high-quality finishes, modular kitchen, branded fixtures, and ample natural lighting. The property offers a perfect blend of comfort and luxury with world-class amenities. Ideal for families looking for a premium lifestyle in Bangalore\'s IT corridor.',
      connectivity: 'ITPL - 2 km, Whitefield Railway Station - 3 km, KR Puram Railway Station - 8 km, Kempegowda International Airport - 35 km, Outer Ring Road - 5 km, Proposed Metro Station - 1.5 km',
      nearbyFacilities: 'Schools: Delhi Public School (1 km), Ryan International (2 km) | Hospitals: Columbia Asia (2 km), Manipal Hospital (3 km) | Shopping: Phoenix Marketcity (4 km), VR Bengaluru (5 km) | IT Parks: ITPL (2 km), Prestige Tech Park (3 km)',
      suitability: 'Residential - Premium Family Living',

      // Development
      projectPhase: 'Phase 2 - Completed',
      developmentStage: 'Completed and Occupied',
      builderName: 'Brigade Group',
      developerName: 'Brigade Enterprises Limited',
      contractorName: 'L&T Construction',
      maintenanceCost: '₹8,500 per month',
      operatingCost: '₹12,000 per month (including maintenance)',

      // Risk
      riskAssessment: 'Low Risk - Reputed builder, clear title, all approvals in place, established locality',
      complianceCheck: 'Fully Compliant - All statutory approvals obtained and verified',

      // Media
      imageUrl: 'https://media.gettyimages.com/id/1937435181/photo/luxury-modern-house-exterior.jpg?b=1&s=2048x2048&w=0&k=20&c=NLG6hfh7uzWj75IgWcfTLct6kvNaLmeh9zzAMDjHmFw=',
      images: null,
      documents: null,
      legalDocuments: null,
      approvalDocuments: null,
      ownershipProof: null,

      // Owner (Token Protected)
      ownerName: 'Rajesh Kumar Sharma',
      ownerEmail: 'rajesh.sharma@example.com',
      ownerPhone: '+91 98765 43210',
      ownerAddress: 'Brigade Meadows, Whitefield, Bangalore - 560066',
      identityVerification: 'Aadhaar Verified',

      // Meta
      viewsCount: 247,
      tokenCost: 50,
      isActive: true,
    };

    const result = await db.insert(properties).values(sampleProperty);
    const propertyId = Number(result[0].insertId);

    console.log('✅ Sample property added successfully!');
    console.log(`Property ID: ${propertyId}`);
    console.log(`Title: ${sampleProperty.title}`);
    console.log(`Location: ${sampleProperty.location}`);
    console.log(`Price: ₹${sampleProperty.price}`);
    console.log(`\nYou can view it at: /properties/${propertyId}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample property:', error);
    process.exit(1);
  }
}

addSampleProperty();
