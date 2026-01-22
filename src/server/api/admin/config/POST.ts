import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { systemConfig } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { razorpayKeyId, razorpayKeySecret } = req.body;

    // Update or insert Razorpay Key ID
    if (razorpayKeyId !== undefined) {
      const existing = await db
        .select()
        .from(systemConfig)
        .where(eq(systemConfig.configKey, 'razorpay_key_id'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(systemConfig)
          .set({ 
            configValue: razorpayKeyId,
            updatedBy: decoded.userId 
          })
          .where(eq(systemConfig.configKey, 'razorpay_key_id'));
      } else {
        await db.insert(systemConfig).values({
          configKey: 'razorpay_key_id',
          configValue: razorpayKeyId,
          updatedBy: decoded.userId,
        });
      }
    }

    // Update or insert Razorpay Key Secret
    if (razorpayKeySecret !== undefined) {
      const existing = await db
        .select()
        .from(systemConfig)
        .where(eq(systemConfig.configKey, 'razorpay_key_secret'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(systemConfig)
          .set({ 
            configValue: razorpayKeySecret,
            updatedBy: decoded.userId 
          })
          .where(eq(systemConfig.configKey, 'razorpay_key_secret'));
      } else {
        await db.insert(systemConfig).values({
          configKey: 'razorpay_key_secret',
          configValue: razorpayKeySecret,
          updatedBy: decoded.userId,
        });
      }
    }

    res.json({ 
      success: true, 
      message: 'Configuration saved successfully' 
    });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
}
