import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { favorites, properties } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    // Get user's favorites with property details
    const userFavorites = await db
      .select({
        id: favorites.id,
        propertyId: favorites.propertyId,
        createdAt: favorites.createdAt,
        property: {
          id: properties.id,
          title: properties.title,
          type: properties.type,
          location: properties.location,
          address: properties.address,
          price: properties.price,
          area: properties.area,
          description: properties.description,
          images: properties.images,
          status: properties.status,
        },
      })
      .from(favorites)
      .leftJoin(properties, eq(favorites.propertyId, properties.id))
      .where(eq(favorites.userId, userId));

    // Filter out favorites where property no longer exists
    const validFavorites = userFavorites.filter(f => f.property && f.property.id !== null);

    res.json(validFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
}