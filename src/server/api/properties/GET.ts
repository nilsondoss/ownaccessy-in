import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { properties } from '../../db/schema.js';
import { eq, like, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { type, location, search } = req.query;

    let query = db.select().from(properties).where(eq(properties.isActive, true));

    // Apply filters
    const conditions = [eq(properties.isActive, true)];
    
    if (type && type !== 'all') {
      conditions.push(eq(properties.type, type as string));
    }
    
    if (location) {
      conditions.push(like(properties.location, `%${location}%`));
    }

    const result = await db.select({
      id: properties.id,
      title: properties.title,
      propertyCategory: properties.propertyCategory,
      type: properties.type,
      propertyStatus: properties.propertyStatus,
      location: properties.location,
      address: properties.address,
      price: properties.price,
      area: properties.area,
      builtUpArea: properties.builtUpArea,
      description: properties.description,
      imageUrl: properties.imageUrl,
      tokenCost: properties.tokenCost,
      isActive: properties.isActive,
      viewsCount: properties.viewsCount,
    }).from(properties).where(and(...conditions));

    res.json({ properties: result });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties', message: String(error) });
  }
}