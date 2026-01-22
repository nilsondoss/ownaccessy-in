import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { properties } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../../../lib/auth.js';

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

    const propertyId = parseInt(req.params.id);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Build update data from request body - accept all fields
    const updateData: any = {};
    const body = req.body;

    // Basic Information
    if (body.title !== undefined) updateData.title = body.title;
    if (body.propertyCategory !== undefined) updateData.propertyCategory = body.propertyCategory;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.propertyId !== undefined) updateData.propertyId = body.propertyId;
    if (body.propertyStatus !== undefined) updateData.propertyStatus = body.propertyStatus;

    // Areas
    if (body.landArea !== undefined) updateData.landArea = body.landArea;
    if (body.builtUpArea !== undefined) updateData.builtUpArea = body.builtUpArea;
    if (body.area !== undefined) updateData.area = body.area;
    if (body.plotDimensions !== undefined) updateData.plotDimensions = body.plotDimensions;

    // Zoning & Development
    if (body.zoning !== undefined) updateData.zoning = body.zoning;
    if (body.landUse !== undefined) updateData.landUse = body.landUse;
    if (body.developmentType !== undefined) updateData.developmentType = body.developmentType;
    if (body.layoutName !== undefined) updateData.layoutName = body.layoutName;
    if (body.numberOfUnits !== undefined) updateData.numberOfUnits = body.numberOfUnits;
    if (body.unitSizes !== undefined) updateData.unitSizes = body.unitSizes;
    if (body.floorPlan !== undefined) updateData.floorPlan = body.floorPlan;

    // Infrastructure
    if (body.roadAccess !== undefined) updateData.roadAccess = body.roadAccess;
    if (body.roadWidth !== undefined) updateData.roadWidth = body.roadWidth;
    if (body.powerAvailability !== undefined) updateData.powerAvailability = body.powerAvailability;
    if (body.waterAvailability !== undefined) updateData.waterAvailability = body.waterAvailability;
    if (body.drainageSystem !== undefined) updateData.drainageSystem = body.drainageSystem;
    if (body.sewageSystem !== undefined) updateData.sewageSystem = body.sewageSystem;
    if (body.parkingSpaces !== undefined) updateData.parkingSpaces = body.parkingSpaces;
    if (body.vehicleAccess !== undefined) updateData.vehicleAccess = body.vehicleAccess;
    if (body.amenities !== undefined) updateData.amenities = body.amenities;
    if (body.infrastructure !== undefined) updateData.infrastructure = body.infrastructure;
    if (body.furnishingStatus !== undefined) updateData.furnishingStatus = body.furnishingStatus;
    if (body.constructionStatus !== undefined) updateData.constructionStatus = body.constructionStatus;

    // Legal & Approvals
    if (body.governmentApprovals !== undefined) updateData.governmentApprovals = body.governmentApprovals;
    if (body.reraStatus !== undefined) updateData.reraStatus = body.reraStatus;
    if (body.dtcpStatus !== undefined) updateData.dtcpStatus = body.dtcpStatus;
    if (body.cmdaStatus !== undefined) updateData.cmdaStatus = body.cmdaStatus;
    if (body.environmentalClearance !== undefined) updateData.environmentalClearance = body.environmentalClearance;
    if (body.legalVerificationStatus !== undefined) updateData.legalVerificationStatus = body.legalVerificationStatus;
    if (body.ownershipType !== undefined) updateData.ownershipType = body.ownershipType;
    if (body.titleDeedDetails !== undefined) updateData.titleDeedDetails = body.titleDeedDetails;
    if (body.taxStatus !== undefined) updateData.taxStatus = body.taxStatus;
    if (body.encumbranceStatus !== undefined) updateData.encumbranceStatus = body.encumbranceStatus;

    // Financial
    if (body.price !== undefined) updateData.price = body.price;
    if (body.pricePerSqft !== undefined) updateData.pricePerSqft = body.pricePerSqft;
    if (body.pricePerAcre !== undefined) updateData.pricePerAcre = body.pricePerAcre;
    if (body.marketValueTrend !== undefined) updateData.marketValueTrend = body.marketValueTrend;
    if (body.investmentPotential !== undefined) updateData.investmentPotential = body.investmentPotential;
    if (body.rentalIncome !== undefined) updateData.rentalIncome = body.rentalIncome;
    if (body.leaseTerms !== undefined) updateData.leaseTerms = body.leaseTerms;
    if (body.paymentTerms !== undefined) updateData.paymentTerms = body.paymentTerms;

    // Description & Location
    if (body.description !== undefined) updateData.description = body.description;
    if (body.connectivity !== undefined) updateData.connectivity = body.connectivity;
    if (body.nearbyFacilities !== undefined) updateData.nearbyFacilities = body.nearbyFacilities;
    if (body.suitability !== undefined) updateData.suitability = body.suitability;

    // Development
    if (body.projectPhase !== undefined) updateData.projectPhase = body.projectPhase;
    if (body.developmentStage !== undefined) updateData.developmentStage = body.developmentStage;
    if (body.builderName !== undefined) updateData.builderName = body.builderName;
    if (body.developerName !== undefined) updateData.developerName = body.developerName;
    if (body.contractorName !== undefined) updateData.contractorName = body.contractorName;
    if (body.maintenanceCost !== undefined) updateData.maintenanceCost = body.maintenanceCost;
    if (body.operatingCost !== undefined) updateData.operatingCost = body.operatingCost;

    // Risk & Compliance
    if (body.riskAssessment !== undefined) updateData.riskAssessment = body.riskAssessment;
    if (body.complianceCheck !== undefined) updateData.complianceCheck = body.complianceCheck;

    // Media
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;

    // Owner Details (Token-Protected)
    if (body.ownerName !== undefined) updateData.ownerName = body.ownerName;
    if (body.ownerEmail !== undefined) updateData.ownerEmail = body.ownerEmail;
    if (body.ownerPhone !== undefined) updateData.ownerPhone = body.ownerPhone;
    if (body.ownerAddress !== undefined) updateData.ownerAddress = body.ownerAddress;
    if (body.identityVerification !== undefined) updateData.identityVerification = body.identityVerification;

    // Meta
    if (body.tokenCost !== undefined) updateData.tokenCost = body.tokenCost;
    if (body.viewsCount !== undefined) updateData.viewsCount = body.viewsCount;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Update the property
    await db.update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId));

    // Fetch updated property
    const updatedProperty = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);

    if (!updatedProperty || updatedProperty.length === 0) {
      return res.status(404).json({ error: 'Property not found after update' });
    }

    res.json({ property: updatedProperty[0] });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property', message: String(error) });
  }
}
