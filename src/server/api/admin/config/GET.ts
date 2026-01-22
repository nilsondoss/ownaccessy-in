import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { systemConfig } from '../../../db/schema.js';

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

    // Fetch all configuration
    const configs = await db.select().from(systemConfig);
    
    // Convert to key-value object
    const configData: Record<string, string> = {};
    configs.forEach(config => {
      configData[config.configKey] = config.configValue || '';
    });

    res.json({
      razorpayKeyId: configData['razorpay_key_id'] || '',
      razorpayKeySecret: configData['razorpay_key_secret'] || '',
    });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
}
