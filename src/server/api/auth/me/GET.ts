import type { Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { authenticate, type AuthRequest } from '../../../lib/auth.js';

export const middleware = [authenticate];

export default async function handler(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userResult = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      tokenBalance: users.tokenBalance,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, req.user.userId)).limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userResult[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user', message: String(error) });
  }
}
