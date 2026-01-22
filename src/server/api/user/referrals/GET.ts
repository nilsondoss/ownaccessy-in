import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { referrals, users } from '../../../db/schema.js';
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

    // Get user's referral code
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get referral stats
    const userReferrals = await db
      .select({
        id: referrals.id,
        refereeId: referrals.refereeId,
        refereeName: users.name,
        refereeEmail: users.email,
        status: referrals.status,
        referrerBonus: referrals.referrerBonus,
        refereeBonus: referrals.refereeBonus,
        completedAt: referrals.completedAt,
        createdAt: referrals.createdAt,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.refereeId, users.id))
      .where(eq(referrals.referrerId, userId));

    // Calculate totals
    const totalReferrals = userReferrals.length;
    const completedReferrals = userReferrals.filter(r => r.status === 'completed').length;
    const pendingReferrals = userReferrals.filter(r => r.status === 'pending').length;
    const totalEarned = userReferrals.reduce((sum, r) => sum + (r.referrerBonus || 0), 0);

    res.json({
      referralCode: user[0].referralCode,
      stats: {
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        totalEarned,
      },
      referrals: userReferrals,
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
}