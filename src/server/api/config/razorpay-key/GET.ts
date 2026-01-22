import type { Request, Response } from 'express';
import { getRazorpayConfig } from '../../../lib/config.js';

/**
 * Public endpoint to get Razorpay Key ID
 * This is safe to expose as it's needed for frontend payment initialization
 */
export default async function handler(req: Request, res: Response) {
  try {
    const razorpayConfig = await getRazorpayConfig();
    
    if (!razorpayConfig.keyId) {
      return res.status(503).json({ 
        error: 'Payment system not configured',
        message: 'Razorpay is not configured. Please contact the administrator.' 
      });
    }

    // Only return the Key ID (safe to expose publicly)
    res.json({
      keyId: razorpayConfig.keyId,
    });
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment configuration',
      message: String(error) 
    });
  }
}
