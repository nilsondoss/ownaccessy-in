import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users, referrals, tokenTransactions } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, generateToken } from '../../../lib/auth.js';
import { emailService } from '../../../lib/email.js';
import crypto from 'crypto';

// Generate unique referral code
function generateReferralCode(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

export default async function handler(req: Request, res: Response) {
  try {
    const { name, email, password, referralCode: usedReferralCode } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Check if referral code is valid
    let referrerId: number | null = null;
    if (usedReferralCode) {
      const referrer = await db.select().from(users).where(eq(users.referralCode, usedReferralCode)).limit(1);
      if (referrer.length > 0) {
        referrerId = referrer[0].id;
      }
    }

    // Generate unique referral code for new user
    let newReferralCode = generateReferralCode();
    let codeExists = true;
    while (codeExists) {
      const existing = await db.select().from(users).where(eq(users.referralCode, newReferralCode)).limit(1);
      if (existing.length === 0) {
        codeExists = false;
      } else {
        newReferralCode = generateReferralCode();
      }
    }

    // Create user with referral code and bonus tokens
    const refereeBonus = referrerId ? 5 : 0; // 5 bonus tokens for using referral code
    const result = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      tokenBalance: refereeBonus,
      referralCode: newReferralCode,
      referredBy: referrerId,
    });

    const userId = Number(result[0].insertId);

    // Fetch created user
    const newUser = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      tokenBalance: users.tokenBalance,
      referralCode: users.referralCode,
    }).from(users).where(eq(users.id, userId)).limit(1);

    // Create referral record if referred
    if (referrerId) {
      await db.insert(referrals).values({
        referrerId,
        refereeId: userId,
        referralCode: usedReferralCode,
        status: 'pending', // Will be completed on first purchase
        referrerBonus: 0,
        refereeBonus: refereeBonus,
      });

      // Log referee bonus transaction
      await db.insert(tokenTransactions).values({
        userId,
        type: 'referral_bonus',
        amount: refereeBonus,
        description: `Welcome bonus for using referral code ${usedReferralCode}`,
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: newUser[0].id,
      email: newUser[0].email,
      role: newUser[0].role,
    });

    // Send welcome email (async, don't wait)
    emailService.sendWelcomeEmail(newUser[0].email, newUser[0].name).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser[0],
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: String(error) });
  }
}
