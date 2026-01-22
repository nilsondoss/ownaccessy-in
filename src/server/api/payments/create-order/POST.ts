import type { Request, Response } from 'express';
import { verifyToken } from '../../../lib/auth.js';
import { getRazorpayConfig } from '../../../lib/config.js';

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

    const { amount, tokens, currency = 'INR' } = req.body;

    if (!amount || !tokens) {
      return res.status(400).json({ error: 'Missing required fields: amount, tokens' });
    }

    // Fetch Razorpay configuration from database
    const razorpayConfig = await getRazorpayConfig();
    
    if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
      return res.status(500).json({ 
        error: 'Razorpay not configured', 
        message: 'Please configure Razorpay credentials in the admin dashboard' 
      });
    }

    // Create Razorpay order
    const orderData = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id.toString(),
        tokens: tokens.toString(),
      },
    };

    const auth = Buffer.from(`${razorpayConfig.keyId}:${razorpayConfig.keySecret}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Razorpay order creation failed:', errorData);
      return res.status(500).json({ error: 'Failed to create payment order', details: errorData });
    }

    const order = await response.json();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpayConfig.keyId,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order', message: String(error) });
  }
}
