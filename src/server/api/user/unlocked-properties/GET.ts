import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { userPropertyAccess, properties } from '../../../db/schema.js';
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

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get unlocked properties with property details
    const unlockedProperties = await db
      .select({
        id: userPropertyAccess.id,
        propertyId: userPropertyAccess.propertyId,
        propertyTitle: properties.title,
        propertyType: properties.type,
        propertyLocation: properties.location,
        unlockedAt: userPropertyAccess.unlockedAt,
      })
      .from(userPropertyAccess)
      .innerJoin(properties, eq(userPropertyAccess.propertyId, properties.id))
      .where(eq(userPropertyAccess.userId, user.userId))
      .orderBy(userPropertyAccess.unlockedAt);

    res.json({ properties: unlockedProperties });
  } catch (error) {
    console.error('Get unlocked properties error:', error);
    res.status(500).json({ error: 'Failed to fetch unlocked properties', message: String(error) });
  }
}
