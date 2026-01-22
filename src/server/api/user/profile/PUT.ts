import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { name, phone, address } = req.body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Update user profile
    await db
      .update(users)
      .set({
        name: name.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
      })
      .where(eq(users.id, decoded.userId));

    // Fetch updated user
    const [updatedUser] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        phone: users.phone,
        address: users.address,
        role: users.role,
        tokenBalance: users.tokenBalance,
        referralCode: users.referralCode,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile', message: error.message });
  }
}
