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

    // Fetch property with all fields
    const result = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ property: result[0] });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property', message: String(error) });
  }
}
