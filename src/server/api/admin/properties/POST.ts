import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const propertyData = req.body;

    // Validate required fields
    if (!propertyData.title || !propertyData.type || !propertyData.location || 
        !propertyData.address || !propertyData.price || !propertyData.area || 
        !propertyData.description || !propertyData.tokenCost) {
      return res.status(400).json({ error: 'Missing required basic fields' });
    }

    // Validate owner details
    if (!propertyData.ownerName || !propertyData.ownerEmail || 
        !propertyData.ownerPhone || !propertyData.ownerAddress) {
      return res.status(400).json({ error: 'Missing owner details' });
    }

    // Create property with all 52 fields
    const propertyResult = await db.insert(properties).values({
      // Basic Information
      title: propertyData.title,
      propertyCategory: propertyData.propertyCategory || null,
      type: propertyData.type,
      propertyStatus: propertyData.propertyStatus || null,
      location: propertyData.location,
      address: propertyData.address,
      propertyId: propertyData.propertyId || null,
      
      // Areas & Dimensions
      landArea: propertyData.landArea || null,
      builtUpArea: propertyData.builtUpArea || null,
      area: propertyData.area,
      plotDimensions: propertyData.plotDimensions || null,
      
      // Zoning & Development
      zoning: propertyData.zoning || null,
      landUse: propertyData.landUse || null,
      developmentType: propertyData.developmentType || null,
      layoutName: propertyData.layoutName || null,
      numberOfUnits: propertyData.numberOfUnits || null,
      unitSizes: propertyData.unitSizes || null,
      floorPlan: propertyData.floorPlan || null,
      
      // Infrastructure
      roadAccess: propertyData.roadAccess || null,
      roadWidth: propertyData.roadWidth || null,
      powerAvailability: propertyData.powerAvailability || null,
      waterAvailability: propertyData.waterAvailability || null,
      drainageSystem: propertyData.drainageSystem || null,
      sewageSystem: propertyData.sewageSystem || null,
      parkingSpaces: propertyData.parkingSpaces || null,
      vehicleAccess: propertyData.vehicleAccess || null,
      
      // Amenities & Construction
      amenities: propertyData.amenities || null,
      infrastructure: propertyData.infrastructure || null,
      furnishingStatus: propertyData.furnishingStatus || null,
      constructionStatus: propertyData.constructionStatus || null,
      
      // Legal & Approvals
      governmentApprovals: propertyData.governmentApprovals || null,
      reraStatus: propertyData.reraStatus || null,
      dtcpStatus: propertyData.dtcpStatus || null,
      cmdaStatus: propertyData.cmdaStatus || null,
      environmentalClearance: propertyData.environmentalClearance || null,
      legalVerificationStatus: propertyData.legalVerificationStatus || null,
      
      // Ownership
      ownershipType: propertyData.ownershipType || null,
      titleDeedDetails: propertyData.titleDeedDetails || null,
      taxStatus: propertyData.taxStatus || null,
      encumbranceStatus: propertyData.encumbranceStatus || null,
      
      // Financial
      price: propertyData.price,
      pricePerSqft: propertyData.pricePerSqft || null,
      pricePerAcre: propertyData.pricePerAcre || null,
      marketValueTrend: propertyData.marketValueTrend || null,
      investmentPotential: propertyData.investmentPotential || null,
      rentalIncome: propertyData.rentalIncome || null,
      leaseTerms: propertyData.leaseTerms || null,
      paymentTerms: propertyData.paymentTerms || null,
      
      // Description & Location
      description: propertyData.description,
      connectivity: propertyData.connectivity || null,
      nearbyFacilities: propertyData.nearbyFacilities || null,
      suitability: propertyData.suitability || null,
      
      // Development
      projectPhase: propertyData.projectPhase || null,
      developmentStage: propertyData.developmentStage || null,
      builderName: propertyData.builderName || null,
      developerName: propertyData.developerName || null,
      contractorName: propertyData.contractorName || null,
      maintenanceCost: propertyData.maintenanceCost || null,
      operatingCost: propertyData.operatingCost || null,
      
      // Risk
      riskAssessment: propertyData.riskAssessment || null,
      complianceCheck: propertyData.complianceCheck || null,
      
      // Media
      imageUrl: propertyData.imageUrl || null,
      
      // Owner (Token Protected)
      ownerName: propertyData.ownerName,
      ownerEmail: propertyData.ownerEmail,
      ownerPhone: propertyData.ownerPhone,
      ownerAddress: propertyData.ownerAddress,
      identityVerification: propertyData.identityVerification || null,
      
      // Meta
      tokenCost: propertyData.tokenCost,
      viewsCount: propertyData.viewsCount || 0,
      isActive: true,
    });

    const propertyId = Number(propertyResult[0].insertId);
    const newProperty = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);

    res.status(201).json({ property: newProperty[0] });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property', message: String(error) });
  }
}
