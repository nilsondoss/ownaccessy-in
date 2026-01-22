import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { favorites, properties } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
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
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    // Verify property exists
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if already favorited
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)))
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Property already in favorites' });
    }

    // Add to favorites
    const result = await db.insert(favorites).values({
      userId,
      propertyId,
    });

    const insertId = Number(result[0].insertId);
    const newFavorite = await db
      .select()
      .from(favorites)
      .where(eq(favorites.id, insertId))
      .limit(1);

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
}