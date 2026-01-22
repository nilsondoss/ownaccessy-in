import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { properties } from '../../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

/**
 * POST /api/properties/:id/view
 * Increment the view count for a property
 * Public endpoint - no authentication required
 */
export default async function handler(req: Request, res: Response) {
  try {
    const propertyId = parseInt(req.params.id);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Check if property exists
    const property = await db
      .select({ id: properties.id, viewsCount: properties.viewsCount })
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count using SQL
    await db
      .update(properties)
      .set({ 
        viewsCount: sql`${properties.viewsCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(properties.id, propertyId));

    // Get updated count
    const updated = await db
      .select({ viewsCount: properties.viewsCount })
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    res.json({ 
      success: true, 
      viewsCount: updated[0]?.viewsCount || 0 
    });
  } catch (error) {
    console.error('Increment view count error:', error);
    res.status(500).json({ error: 'Failed to increment view count' });
  }
}
