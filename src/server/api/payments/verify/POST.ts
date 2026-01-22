import type { Request, Response } from 'express';
import { createHmac } from 'crypto';
import { db } from '../../../db/client.js';
import { users, payments, tokenTransactions, referrals } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '../../../lib/auth.js';
import { emailService } from '../../../lib/email.js';
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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, tokens } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount || !tokens) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch Razorpay configuration from database
    const razorpayConfig = await getRazorpayConfig();
    
    if (!razorpayConfig.keySecret) {
      return res.status(500).json({ 
        error: 'Razorpay not configured', 
        message: 'Please configure Razorpay credentials in the admin dashboard' 
      });
    }

    // Verify signature
    const generatedSignature = createHmac('sha256', razorpayConfig.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Check if payment already processed
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.razorpayPaymentId, razorpay_payment_id))
      .limit(1);

    if (existingPayment.length > 0) {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    // Create payment record
    await db.insert(payments).values({
      userId: user.id,
      amount: amount,
      tokensGranted: tokens,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'completed',
    });

    // Update user token balance
    const currentUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const newBalance = (currentUser[0]?.tokenBalance || 0) + tokens;

    await db.update(users)
      .set({ tokenBalance: newBalance })
      .where(eq(users.id, user.id));

    // Create token transaction record
    await db.insert(tokenTransactions).values({
      userId: user.id,
      type: 'purchase',
      amount: tokens,
      description: `Purchased ${tokens} tokens for ₹${amount}`,
      relatedPropertyId: null,
    });

    // Check if this is first purchase and user was referred
    const userReferral = await db
      .select()
      .from(referrals)
      .where(and(
        eq(referrals.refereeId, user.id),
        eq(referrals.status, 'pending')
      ))
      .limit(1);

    if (userReferral.length > 0) {
      const referral = userReferral[0];
      const referrerBonus = 10; // 10 tokens for successful referral

      // Update referrer's token balance
      const referrer = await db.select().from(users).where(eq(users.id, referral.referrerId)).limit(1);
      if (referrer.length > 0) {
        const referrerNewBalance = (referrer[0].tokenBalance || 0) + referrerBonus;
        await db.update(users)
          .set({ tokenBalance: referrerNewBalance })
          .where(eq(users.id, referral.referrerId));

        // Log referrer bonus transaction
        await db.insert(tokenTransactions).values({
          userId: referral.referrerId,
          type: 'referral_bonus',
          amount: referrerBonus,
          description: `Referral bonus: ${currentUser[0].name} made their first purchase`,
          relatedReferralId: referral.id,
        });

        // Update referral status
        await db.update(referrals)
          .set({
            status: 'completed',
            referrerBonus: referrerBonus,
            completedAt: new Date(),
          })
          .where(eq(referrals.id, referral.id));
      }
    }

    // Send purchase confirmation email (async, don't wait)
    emailService.sendTokenPurchaseEmail(
      currentUser[0].email,
      currentUser[0].name,
      tokens,
      amount,
      razorpay_order_id
    ).catch(err => {
      console.error('Failed to send purchase confirmation email:', err);
    });

    res.json({
      success: true,
      message: 'Payment verified and tokens credited',
      newBalance,
      tokensAdded: tokens,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment', message: String(error) });
  }
}
