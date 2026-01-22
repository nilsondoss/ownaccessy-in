import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { properties, userPropertyAccess, users } from '../../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '../../../../lib/auth.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export default async function handler(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const propertyId = parseInt(req.params.id);
    const format = req.query.format as string;

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    if (!format || !['pdf', 'excel'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Use pdf or excel' });
    }

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

    if (accessResult.length === 0) {
      return res.status(403).json({ error: 'Property not unlocked. Please unlock first.' });
    }

    // Get property details
    const propertyResult = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);

    if (propertyResult.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = propertyResult[0];

    // Check owner details exist in property
    if (!property.ownerName || !property.ownerEmail || !property.ownerPhone) {
      return res.status(404).json({ error: 'Owner details not found' });
    }

    const owner = {
      name: property.ownerName,
      email: property.ownerEmail,
      phone: property.ownerPhone,
      address: property.ownerAddress || 'Not provided',
      identityVerification: property.identityVerification || 'Not provided',
    };

    // Get user details for watermark
    const userResult = await db.select().from(users).where(eq(users.id, user.userId)).limit(1);
    const currentUser = userResult[0];

    const downloadDate = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (format === 'pdf') {
      // Generate PDF with all property details
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="property-${propertyId}-${Date.now()}.pdf"`);

      doc.pipe(res);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#000000').text('ownaccessy', { align: 'center' });
      doc.fontSize(12).font('Helvetica').text('Complete Property Details Report', { align: 'center' });
      doc.moveDown();

      // Watermark
      doc.fontSize(10).fillColor('#666666')
        .text(`Downloaded by: ${currentUser.email}`, { align: 'center' })
        .text(`Date: ${downloadDate}`, { align: 'center' })
        .text('This document is confidential and for authorized use only', { align: 'center' });
      doc.moveDown(2);

      // Helper function to add section
      const addSection = (title: string, fields: Array<{ label: string; value: any }>) => {
        doc.fontSize(14).fillColor('#000000').font('Helvetica-Bold').text(title);
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica');
        
        fields.forEach(field => {
          if (field.value && field.value !== 'N/A' && field.value !== 'Not provided') {
            doc.font('Helvetica-Bold').text(`${field.label}: `, { continued: true });
            doc.font('Helvetica').text(field.value);
          }
        });
        doc.moveDown(1);
      };

      // Basic Information
      addSection('BASIC INFORMATION', [
        { label: 'Property ID', value: property.propertyId || property.id },
        { label: 'Title', value: property.title },
        { label: 'Category', value: property.propertyCategory },
        { label: 'Type', value: property.type },
        { label: 'Status', value: property.propertyStatus },
        { label: 'Location', value: property.location },
        { label: 'Address', value: property.address },
      ]);

      // Property Details
      addSection('PROPERTY DETAILS', [
        { label: 'Land Area', value: property.landArea },
        { label: 'Built-up Area', value: property.builtUpArea },
        { label: 'Total Area', value: property.area },
        { label: 'Plot Dimensions', value: property.plotDimensions },
        { label: 'Zoning', value: property.zoning },
        { label: 'Land Use', value: property.landUse },
        { label: 'Development Type', value: property.developmentType },
      ]);

      // Project Details
      addSection('PROJECT DETAILS', [
        { label: 'Layout Name', value: property.layoutName },
        { label: 'Number of Units', value: property.numberOfUnits },
        { label: 'Unit Sizes', value: property.unitSizes },
        { label: 'Floor Plan', value: property.floorPlan },
      ]);

      // Infrastructure
      addSection('INFRASTRUCTURE', [
        { label: 'Road Access', value: property.roadAccess },
        { label: 'Road Width', value: property.roadWidth },
        { label: 'Power Availability', value: property.powerAvailability },
        { label: 'Water Availability', value: property.waterAvailability },
        { label: 'Drainage System', value: property.drainageSystem },
        { label: 'Sewage System', value: property.sewageSystem },
        { label: 'Parking Spaces', value: property.parkingSpaces },
        { label: 'Vehicle Access', value: property.vehicleAccess },
      ]);

      // Amenities & Construction
      addSection('AMENITIES & CONSTRUCTION', [
        { label: 'Amenities', value: property.amenities },
        { label: 'Infrastructure', value: property.infrastructure },
        { label: 'Furnishing Status', value: property.furnishingStatus },
        { label: 'Construction Status', value: property.constructionStatus },
      ]);

      // Legal & Approvals
      addSection('LEGAL & APPROVALS', [
        { label: 'Government Approvals', value: property.governmentApprovals },
        { label: 'RERA Status', value: property.reraStatus },
        { label: 'DTCP Status', value: property.dtcpStatus },
        { label: 'CMDA Status', value: property.cmdaStatus },
        { label: 'Environmental Clearance', value: property.environmentalClearance },
        { label: 'Legal Verification Status', value: property.legalVerificationStatus },
      ]);

      // Ownership
      addSection('OWNERSHIP & LEGAL', [
        { label: 'Ownership Type', value: property.ownershipType },
        { label: 'Title Deed Details', value: property.titleDeedDetails },
        { label: 'Tax Status', value: property.taxStatus },
        { label: 'Encumbrance Status', value: property.encumbranceStatus },
      ]);

      // Financial Details
      addSection('FINANCIAL DETAILS', [
        { label: 'Price', value: `₹${parseFloat(property.price).toLocaleString('en-IN')}` },
        { label: 'Price per Sqft', value: property.pricePerSqft },
        { label: 'Price per Acre', value: property.pricePerAcre },
        { label: 'Payment Terms', value: property.paymentTerms },
        { label: 'Rental Income', value: property.rentalIncome },
        { label: 'Lease Terms', value: property.leaseTerms },
        { label: 'Investment Potential', value: property.investmentPotential },
        { label: 'Market Value Trend', value: property.marketValueTrend },
      ]);

      // Location & Connectivity
      addSection('LOCATION & CONNECTIVITY', [
        { label: 'Description', value: property.description },
        { label: 'Connectivity', value: property.connectivity },
        { label: 'Nearby Facilities', value: property.nearbyFacilities },
        { label: 'Suitability', value: property.suitability },
      ]);

      // Development Details
      addSection('DEVELOPMENT DETAILS', [
        { label: 'Project Phase', value: property.projectPhase },
        { label: 'Development Stage', value: property.developmentStage },
        { label: 'Builder Name', value: property.builderName },
        { label: 'Developer Name', value: property.developerName },
        { label: 'Contractor Name', value: property.contractorName },
        { label: 'Maintenance Cost', value: property.maintenanceCost },
        { label: 'Operating Cost', value: property.operatingCost },
      ]);

      // Risk Assessment
      addSection('RISK ASSESSMENT', [
        { label: 'Risk Assessment', value: property.riskAssessment },
        { label: 'Compliance Check', value: property.complianceCheck },
      ]);

      // Add new page for owner details
      doc.addPage();

      // Owner Information (Token Protected)
      doc.fontSize(16).fillColor('#000000').font('Helvetica-Bold').text('OWNER INFORMATION', { align: 'center' });
      doc.fontSize(10).fillColor('#666666').text('(Confidential - Token Protected)', { align: 'center' });
      doc.moveDown(1.5);

      doc.fontSize(12).fillColor('#000000').font('Helvetica-Bold').text('Contact Details');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.font('Helvetica-Bold').text('Name: ', { continued: true });
      doc.font('Helvetica').text(owner.name);
      doc.font('Helvetica-Bold').text('Email: ', { continued: true });
      doc.font('Helvetica').text(owner.email);
      doc.font('Helvetica-Bold').text('Phone: ', { continued: true });
      doc.font('Helvetica').text(owner.phone);
      doc.font('Helvetica-Bold').text('Address: ', { continued: true });
      doc.font('Helvetica').text(owner.address);
      doc.font('Helvetica-Bold').text('Identity Verification: ', { continued: true });
      doc.font('Helvetica').text(owner.identityVerification);
      doc.moveDown(2);

      // Footer watermark
      doc.fontSize(8).fillColor('#999999')
        .text('━'.repeat(80), { align: 'center' })
        .text(`ownaccessy - Confidential Document - ${currentUser.email} - ${downloadDate}`, { align: 'center' });

      doc.end();
    } else {
      // Generate Excel with all property details
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Property Details');

      // Set column widths
      worksheet.columns = [
        { width: 30 },
        { width: 60 },
      ];

      // Header
      worksheet.mergeCells('A1:B1');
      worksheet.getCell('A1').value = 'ownaccessy - Complete Property Details Report';
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };
      worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
      worksheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };

      // Watermark
      worksheet.mergeCells('A2:B2');
      worksheet.getCell('A2').value = `Downloaded by: ${currentUser.email} | Date: ${downloadDate}`;
      worksheet.getCell('A2').font = { size: 10, color: { argb: 'FF666666' } };
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      worksheet.addRow([]);

      // Helper function to add section
      const addSection = (title: string, fields: Array<{ label: string; value: any }>) => {
        const titleRow = worksheet.addRow([title, '']);
        titleRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        titleRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF5B9BD5' },
        };
        worksheet.mergeCells(`A${titleRow.number}:B${titleRow.number}`);

        fields.forEach(field => {
          if (field.value && field.value !== 'N/A' && field.value !== 'Not provided') {
            worksheet.addRow([field.label, field.value]);
          }
        });

        worksheet.addRow([]);
      };

      // Basic Information
      addSection('BASIC INFORMATION', [
        { label: 'Property ID', value: property.propertyId || property.id },
        { label: 'Title', value: property.title },
        { label: 'Category', value: property.propertyCategory },
        { label: 'Type', value: property.type },
        { label: 'Status', value: property.propertyStatus },
        { label: 'Location', value: property.location },
        { label: 'Address', value: property.address },
      ]);

      // Property Details
      addSection('PROPERTY DETAILS', [
        { label: 'Land Area', value: property.landArea },
        { label: 'Built-up Area', value: property.builtUpArea },
        { label: 'Total Area', value: property.area },
        { label: 'Plot Dimensions', value: property.plotDimensions },
        { label: 'Zoning', value: property.zoning },
        { label: 'Land Use', value: property.landUse },
        { label: 'Development Type', value: property.developmentType },
      ]);

      // Project Details
      addSection('PROJECT DETAILS', [
        { label: 'Layout Name', value: property.layoutName },
        { label: 'Number of Units', value: property.numberOfUnits },
        { label: 'Unit Sizes', value: property.unitSizes },
        { label: 'Floor Plan', value: property.floorPlan },
      ]);

      // Infrastructure
      addSection('INFRASTRUCTURE', [
        { label: 'Road Access', value: property.roadAccess },
        { label: 'Road Width', value: property.roadWidth },
        { label: 'Power Availability', value: property.powerAvailability },
        { label: 'Water Availability', value: property.waterAvailability },
        { label: 'Drainage System', value: property.drainageSystem },
        { label: 'Sewage System', value: property.sewageSystem },
        { label: 'Parking Spaces', value: property.parkingSpaces },
        { label: 'Vehicle Access', value: property.vehicleAccess },
      ]);

      // Amenities & Construction
      addSection('AMENITIES & CONSTRUCTION', [
        { label: 'Amenities', value: property.amenities },
        { label: 'Infrastructure', value: property.infrastructure },
        { label: 'Furnishing Status', value: property.furnishingStatus },
        { label: 'Construction Status', value: property.constructionStatus },
      ]);

      // Legal & Approvals
      addSection('LEGAL & APPROVALS', [
        { label: 'Government Approvals', value: property.governmentApprovals },
        { label: 'RERA Status', value: property.reraStatus },
        { label: 'DTCP Status', value: property.dtcpStatus },
        { label: 'CMDA Status', value: property.cmdaStatus },
        { label: 'Environmental Clearance', value: property.environmentalClearance },
        { label: 'Legal Verification Status', value: property.legalVerificationStatus },
      ]);

      // Ownership
      addSection('OWNERSHIP & LEGAL', [
        { label: 'Ownership Type', value: property.ownershipType },
        { label: 'Title Deed Details', value: property.titleDeedDetails },
        { label: 'Tax Status', value: property.taxStatus },
        { label: 'Encumbrance Status', value: property.encumbranceStatus },
      ]);

      // Financial Details
      addSection('FINANCIAL DETAILS', [
        { label: 'Price', value: `₹${parseFloat(property.price).toLocaleString('en-IN')}` },
        { label: 'Price per Sqft', value: property.pricePerSqft },
        { label: 'Price per Acre', value: property.pricePerAcre },
        { label: 'Payment Terms', value: property.paymentTerms },
        { label: 'Rental Income', value: property.rentalIncome },
        { label: 'Lease Terms', value: property.leaseTerms },
        { label: 'Investment Potential', value: property.investmentPotential },
        { label: 'Market Value Trend', value: property.marketValueTrend },
      ]);

      // Location & Connectivity
      addSection('LOCATION & CONNECTIVITY', [
        { label: 'Description', value: property.description },
        { label: 'Connectivity', value: property.connectivity },
        { label: 'Nearby Facilities', value: property.nearbyFacilities },
        { label: 'Suitability', value: property.suitability },
      ]);

      // Development Details
      addSection('DEVELOPMENT DETAILS', [
        { label: 'Project Phase', value: property.projectPhase },
        { label: 'Development Stage', value: property.developmentStage },
        { label: 'Builder Name', value: property.builderName },
        { label: 'Developer Name', value: property.developerName },
        { label: 'Contractor Name', value: property.contractorName },
        { label: 'Maintenance Cost', value: property.maintenanceCost },
        { label: 'Operating Cost', value: property.operatingCost },
      ]);

      // Risk Assessment
      addSection('RISK ASSESSMENT', [
        { label: 'Risk Assessment', value: property.riskAssessment },
        { label: 'Compliance Check', value: property.complianceCheck },
      ]);

      // Owner Information (Token Protected)
      const ownerTitleRow = worksheet.addRow(['OWNER INFORMATION (Confidential - Token Protected)', '']);
      ownerTitleRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
      ownerTitleRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' },
      };
      worksheet.mergeCells(`A${ownerTitleRow.number}:B${ownerTitleRow.number}`);

      worksheet.addRow(['Name', owner.name]);
      worksheet.addRow(['Email', owner.email]);
      worksheet.addRow(['Phone', owner.phone]);
      worksheet.addRow(['Address', owner.address]);
      worksheet.addRow(['Identity Verification', owner.identityVerification]);

      worksheet.addRow([]);

      // Footer watermark
      worksheet.mergeCells(`A${worksheet.rowCount + 1}:B${worksheet.rowCount + 1}`);
      const footerCell = worksheet.getCell(`A${worksheet.rowCount}`);
      footerCell.value = `ownaccessy - Confidential Document - ${currentUser.email} - ${downloadDate}`;
      footerCell.font = { size: 8, color: { argb: 'FF999999' } };
      footerCell.alignment = { horizontal: 'center' };

      // Style the sheet
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 3) {
          row.eachCell((cell, colNumber) => {
            if (colNumber === 1 && !cell.fill) {
              cell.font = { bold: true };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF0F0F0' },
              };
            }
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="property-${propertyId}-${Date.now()}.xlsx"`);

      await workbook.xlsx.write(res);
      res.end();
    }
  } catch (error) {
    console.error('Download property error:', error);
    res.status(500).json({ error: 'Failed to generate download', message: String(error) });
  }
}
