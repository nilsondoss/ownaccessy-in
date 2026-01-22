import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { users } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { name, email, phone, address, tokenBalance, role } = req.body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (address !== undefined) updateData.address = address?.trim() || null;
    if (tokenBalance !== undefined) updateData.tokenBalance = parseInt(tokenBalance);
    if (role !== undefined && ['user', 'admin'].includes(role)) updateData.role = role;

    // Validate required fields
    if (updateData.name && updateData.name.length === 0) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }
    if (updateData.email && updateData.email.length === 0) {
      return res.status(400).json({ error: 'Email cannot be empty' });
    }

    // Check if email is already taken by another user
    if (updateData.email) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, updateData.email))
        .limit(1);

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update user
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    // Fetch updated user - use simpler select
    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({ 
      message: 'User updated successfully',
      user: userWithoutPassword 
    });
  } catch (error: any) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Failed to update user', message: error.message });
  }
}
