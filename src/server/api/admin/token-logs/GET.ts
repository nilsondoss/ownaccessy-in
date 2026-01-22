import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { tokenTransactions, users, properties } from '../../../db/schema.js';
import { eq, desc } from 'drizzle-orm';
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

    const logs = await db
      .select({
        id: tokenTransactions.id,
        userId: tokenTransactions.userId,
        userName: users.name,
        propertyId: tokenTransactions.relatedPropertyId,
        propertyTitle: properties.title,
        action: tokenTransactions.type,
        tokensUsed: tokenTransactions.amount,
        timestamp: tokenTransactions.createdAt,
      })
      .from(tokenTransactions)
      .leftJoin(users, eq(tokenTransactions.userId, users.id))
      .leftJoin(properties, eq(tokenTransactions.relatedPropertyId, properties.id))
      .orderBy(desc(tokenTransactions.createdAt))
      .limit(100);

    res.json({ logs });
  } catch (error) {
    console.error('Get token logs error:', error);
    res.status(500).json({ error: 'Failed to fetch token logs', message: String(error) });
  }
}
