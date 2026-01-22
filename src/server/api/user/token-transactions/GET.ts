import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { tokenTransactions } from '../../../db/schema.js';
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

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get token transactions
    const transactions = await db
      .select({
        id: tokenTransactions.id,
        type: tokenTransactions.type,
        amount: tokenTransactions.amount,
        description: tokenTransactions.description,
        createdAt: tokenTransactions.createdAt,
      })
      .from(tokenTransactions)
      .where(eq(tokenTransactions.userId, user.userId))
      .orderBy(desc(tokenTransactions.createdAt))
      .limit(50);

    res.json({ transactions });
  } catch (error) {
    console.error('Get token transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions', message: String(error) });
  }
}
