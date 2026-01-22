import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties, userPropertyAccess } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { verifyToken, type JWTPayload } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const propertyId = parseInt(req.params.id);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Get property details
    const propertyResult = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);

    if (propertyResult.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = propertyResult[0];

    // Check if user is authenticated and has unlocked this property
    let isUnlocked = false;
    let owner = null;
    let user: JWTPayload | null = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      user = verifyToken(token);

      if (user) {
        // Check if user has unlocked this property
        const accessResult = await db.select()
          .from(userPropertyAccess)
          .where(
            and(
              eq(userPropertyAccess.userId, user.userId),
              eq(userPropertyAccess.propertyId, propertyId)
            )
          )
          .limit(1);

        if (accessResult.length > 0) {
          isUnlocked = true;

          // Get owner details from properties table (denormalized)
          if (property.ownerName && property.ownerEmail && property.ownerPhone) {
            owner = {
              name: property.ownerName,
              email: property.ownerEmail,
              phone: property.ownerPhone,
              address: property.ownerAddress || 'Not provided',
            };
          }
        }
      }
    }

    res.json({
      property: {
        id: property.id,
        title: property.title,
        propertyCategory: property.propertyCategory,
        type: property.type,
        location: property.location,
        address: property.address,
        propertyId: property.propertyId,
        propertyStatus: property.propertyStatus,
        
        // Areas
        landArea: property.landArea,
        builtUpArea: property.builtUpArea,
        area: property.area,
        plotDimensions: property.plotDimensions,
        
        // Zoning & Development
        zoning: property.zoning,
        landUse: property.landUse,
        developmentType: property.developmentType,
        layoutName: property.layoutName,
        numberOfUnits: property.numberOfUnits,
        unitSizes: property.unitSizes,
        floorPlan: property.floorPlan,
        
        // Infrastructure
        roadAccess: property.roadAccess,
        roadWidth: property.roadWidth,
        powerAvailability: property.powerAvailability,
        waterAvailability: property.waterAvailability,
        drainageSystem: property.drainageSystem,
        sewageSystem: property.sewageSystem,
        parkingSpaces: property.parkingSpaces,
        vehicleAccess: property.vehicleAccess,
        
        // Amenities & Construction
        amenities: property.amenities,
        infrastructure: property.infrastructure,
        furnishingStatus: property.furnishingStatus,
        constructionStatus: property.constructionStatus,
        
        // Legal & Approvals
        governmentApprovals: property.governmentApprovals,
        reraStatus: property.reraStatus,
        dtcpStatus: property.dtcpStatus,
        cmdaStatus: property.cmdaStatus,
        environmentalClearance: property.environmentalClearance,
        legalVerificationStatus: property.legalVerificationStatus,
        
        // Ownership
        ownershipType: property.ownershipType,
        titleDeedDetails: property.titleDeedDetails,
        taxStatus: property.taxStatus,
        encumbranceStatus: property.encumbranceStatus,
        
        // Financial
        investmentPotential: property.investmentPotential,
        rentalIncome: property.rentalIncome,
        leaseTerms: property.leaseTerms,
        price: property.price,
        paymentTerms: property.paymentTerms,
        pricePerSqft: property.pricePerSqft,
        pricePerAcre: property.pricePerAcre,
        marketValueTrend: property.marketValueTrend,
        
        // Description & Location
        description: property.description,
        connectivity: property.connectivity,
        nearbyFacilities: property.nearbyFacilities,
        suitability: property.suitability,
        
        // Development
        projectPhase: property.projectPhase,
        developmentStage: property.developmentStage,
        builderName: property.builderName,
        developerName: property.developerName,
        contractorName: property.contractorName,
        maintenanceCost: property.maintenanceCost,
        operatingCost: property.operatingCost,
        
        // Risk
        riskAssessment: property.riskAssessment,
        complianceCheck: property.complianceCheck,
        
        // Media
        imageUrl: property.imageUrl,
        images: property.images,
        
        // Meta
        viewsCount: property.viewsCount,
        tokenCost: property.tokenCost,
        isActive: property.isActive,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
      },
      isUnlocked,
      owner: owner ? {
        ...owner,
        identityVerification: property.identityVerification,
      } : null,
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property', message: String(error) });
  }
}