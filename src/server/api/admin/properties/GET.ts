import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { verifyToken } from '../../../lib/auth.js';

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

    const allProperties = await db
      .select({
        id: properties.id,
        title: properties.title,
        type: properties.type,
        location: properties.location,
        address: properties.address,
        price: properties.price,
        area: properties.area,
        description: properties.description,
        imageUrl: properties.imageUrl,
        tokenCost: properties.tokenCost,
        isActive: properties.isActive,
        createdAt: properties.createdAt,
        ownerName: properties.ownerName,
        ownerEmail: properties.ownerEmail,
        ownerPhone: properties.ownerPhone,
        ownerAddress: properties.ownerAddress,
      })
      .from(properties);

    res.json({ properties: allProperties });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties', message: String(error) });
  }
}
