import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { properties } from '../../../../db/schema.js';
import { verifyToken } from '../../../../lib/auth.js';
import formidable from 'formidable';
import * as XLSX from 'xlsx';
import fs from 'fs';

interface PropertyRow {
  title: string;
  type: string;
  location: string;
  address: string;
  price: string;
  area: string;
  description: string;
  images: string;
  tokenCost: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export default async function handler(req: Request, res: Response) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Parse multipart form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const uploadedFile = files.file?.[0];

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read and parse the file
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<PropertyRow>(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ error: 'File is empty or invalid format' });
    }

    // Validate data
    const errors: ValidationError[] = [];
    const validProperties: any[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because Excel rows start at 1 and first row is header

      // Required fields validation
      if (!row.title || row.title.trim() === '') {
        errors.push({ row: rowNumber, field: 'title', message: 'Title is required' });
      }
      if (!row.type || row.type.trim() === '') {
        errors.push({ row: rowNumber, field: 'type', message: 'Type is required' });
      }
      if (!row.location || row.location.trim() === '') {
        errors.push({ row: rowNumber, field: 'location', message: 'Location is required' });
      }
      if (!row.address || row.address.trim() === '') {
        errors.push({ row: rowNumber, field: 'address', message: 'Address is required' });
      }
      if (!row.price || row.price.toString().trim() === '') {
        errors.push({ row: rowNumber, field: 'price', message: 'Price is required' });
      }
      if (!row.ownerName || row.ownerName.trim() === '') {
        errors.push({ row: rowNumber, field: 'ownerName', message: 'Owner name is required' });
      }
      if (!row.ownerEmail || row.ownerEmail.trim() === '') {
        errors.push({ row: rowNumber, field: 'ownerEmail', message: 'Owner email is required' });
      }
      if (!row.ownerPhone || row.ownerPhone.toString().trim() === '') {
        errors.push({ row: rowNumber, field: 'ownerPhone', message: 'Owner phone is required' });
      }

      // Type validation
      const validTypes = ['residential', 'commercial', 'land'];
      if (row.type && !validTypes.includes(row.type.toLowerCase())) {
        errors.push({
          row: rowNumber,
          field: 'type',
          message: `Type must be one of: ${validTypes.join(', ')}`,
        });
      }

      // Price validation
      if (row.price && isNaN(Number(row.price))) {
        errors.push({ row: rowNumber, field: 'price', message: 'Price must be a number' });
      }

      // Area validation
      if (row.area && isNaN(Number(row.area))) {
        errors.push({ row: rowNumber, field: 'area', message: 'Area must be a number' });
      }

      // Token cost validation
      if (row.tokenCost && isNaN(Number(row.tokenCost))) {
        errors.push({ row: rowNumber, field: 'tokenCost', message: 'Token cost must be a number' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (row.ownerEmail && !emailRegex.test(row.ownerEmail)) {
        errors.push({ row: rowNumber, field: 'ownerEmail', message: 'Invalid email format' });
      }

      // If no errors for this row, add to valid properties
      if (!errors.some(e => e.row === rowNumber)) {
        validProperties.push({
          title: row.title.trim(),
          type: row.type.toLowerCase().trim(),
          location: row.location.trim(),
          address: row.address.trim(),
          price: row.price.toString().trim(),
          area: row.area ? row.area.toString().trim() : null,
          description: row.description ? row.description.trim() : null,
          images: row.images ? row.images.trim() : null,
          tokenCost: row.tokenCost ? Number(row.tokenCost) : 5,
          ownerName: row.ownerName.trim(),
          ownerEmail: row.ownerEmail.trim(),
          ownerPhone: row.ownerPhone.toString().trim(),
          ownerAddress: row.ownerAddress ? row.ownerAddress.toString().trim() : '',
          status: true,
        });
      }
    });

    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        errors,
        validCount: validProperties.length,
        totalCount: data.length,
      });
    }

    // Bulk insert valid properties
    let insertedCount = 0;
    if (validProperties.length > 0) {
      await db.insert(properties).values(validProperties);
      insertedCount = validProperties.length;
    }

    // Clean up uploaded file
    fs.unlinkSync(uploadedFile.filepath);

    res.json({
      success: true,
      message: `Successfully uploaded ${insertedCount} properties`,
      successCount: insertedCount,
      insertedCount,
      totalCount: data.length,
      errors: [],
    });
  } catch (error) {
    console.error('Error uploading properties:', error);
    res.status(500).json({ error: 'Failed to upload properties', message: String(error) });
  }
}
