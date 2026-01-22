import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { users, properties, userPropertyAccess, tokenTransactions } from '../../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '../../../../lib/auth.js';
import { emailService } from '../../../../lib/email.js';

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

    const propertyId = parseInt(req.params.id);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    // Get property details
    const propertyResult = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);

    if (propertyResult.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = propertyResult[0];

    if (!property.isActive) {
      return res.status(400).json({ error: 'Property is not available' });
    }

    // Check if already unlocked (DEDUPLICATION)
    const existingAccess = await db.select()
      .from(userPropertyAccess)
      .where(
        and(
          eq(userPropertyAccess.userId, user.userId),
          eq(userPropertyAccess.propertyId, propertyId)
        )
      )
      .limit(1);

    if (existingAccess.length > 0) {
      // Already unlocked - return owner details without charging
      if (!property.ownerName || !property.ownerEmail || !property.ownerPhone) {
        return res.status(404).json({ error: 'Owner details not found' });
      }

      const userResult = await db.select().from(users).where(eq(users.id, user.userId)).limit(1);

      return res.json({
        message: 'Property already unlocked',
        owner: {
          name: property.ownerName,
          email: property.ownerEmail,
          phone: property.ownerPhone,
          address: property.ownerAddress || 'Not provided',
        },
        newTokenBalance: userResult[0].tokenBalance,
      });
    }

    // Get user's current token balance
    const userResult = await db.select().from(users).where(eq(users.id, user.userId)).limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = userResult[0];

    // Check if user has enough tokens
    if (currentUser.tokenBalance < property.tokenCost) {
      return res.status(400).json({ 
        error: 'Insufficient tokens',
        required: property.tokenCost,
        current: currentUser.tokenBalance,
      });
    }

    // Check owner details exist in property
    if (!property.ownerName || !property.ownerEmail || !property.ownerPhone) {
      return res.status(404).json({ error: 'Owner details not found' });
    }

    // Start transaction: Deduct tokens, create access record, log transaction
    const newTokenBalance = currentUser.tokenBalance - property.tokenCost;

    // Update user token balance
    await db.update(users)
      .set({ tokenBalance: newTokenBalance })
      .where(eq(users.id, user.userId));

    // Create access record
    await db.insert(userPropertyAccess).values({
      userId: user.userId,
      propertyId: propertyId,
    });

    // Log transaction
    await db.insert(tokenTransactions).values({
      userId: user.userId,
      type: 'unlock',
      amount: -property.tokenCost,
      description: `Unlocked property: ${property.title}`,
      relatedPropertyId: propertyId,
    });

    // Send unlock confirmation email (async, don't wait)
    emailService.sendPropertyUnlockEmail(
      currentUser.email,
      currentUser.name,
      property.title,
      property.location,
      property.tokenCost,
      newTokenBalance
    ).catch(err => {
      console.error('Failed to send unlock confirmation email:', err);
    });

    // Send low token alert if balance is low (< 5 tokens)
    if (newTokenBalance < 5 && newTokenBalance > 0) {
      emailService.sendLowTokenAlert(
        currentUser.email,
        currentUser.name,
        newTokenBalance
      ).catch(err => {
        console.error('Failed to send low token alert:', err);
      });
    }

    res.json({
      message: 'Property unlocked successfully',
      owner: {
        name: property.ownerName,
        email: property.ownerEmail,
        phone: property.ownerPhone,
        address: property.ownerAddress || 'Not provided',
      },
      newTokenBalance,
      tokensUsed: property.tokenCost,
    });
  } catch (error) {
    console.error('Unlock property error:', error);
    res.status(500).json({ error: 'Failed to unlock property', message: String(error) });
  }
}
