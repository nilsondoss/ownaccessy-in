import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users, properties, payments, userPropertyAccess, tokenTransactions } from '../../../db/schema.js';
import { eq, sql, and, gte } from 'drizzle-orm';
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

    // Get date 30 days ago for trends
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total revenue
    const revenueResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${payments.amount}), 0)` })
      .from(payments)
      .where(eq(payments.status, 'completed'));
    const totalRevenue = Number(revenueResult[0]?.total || 0);

    // Total tokens sold
    const tokensSoldResult = await db
      .select({ total: sql<number>`COALESCE(SUM(tokens), 0)` })
      .from(payments)
      .where(eq(payments.status, 'completed'));
    const totalTokensSold = Number(tokensSoldResult[0]?.total || 0);

    // Total users
    const usersResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users);
    const totalUsers = Number(usersResult[0]?.count || 0);

    // Total properties
    const propertiesResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(properties);
    const totalProperties = Number(propertiesResult[0]?.count || 0);

    // Total unlocks
    const unlocksResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userPropertyAccess);
    const totalUnlocks = Number(unlocksResult[0]?.count || 0);

    // Revenue by day (last 30 days)
    const revenueByDay = await db
      .select({
        date: sql<string>`DATE(${payments.createdAt})`,
        revenue: sql<number>`SUM(${payments.amount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(payments)
      .where(and(
        eq(payments.status, 'completed'),
        gte(payments.createdAt, thirtyDaysAgo)
      ))
      .groupBy(sql`DATE(${payments.createdAt})`);

    // User growth by day (last 30 days)
    const userGrowth = await db
      .select({
        date: sql<string>`DATE(${users.createdAt})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${users.createdAt})`);

    // Property unlocks by day (last 30 days)
    const unlocksByDay = await db
      .select({
        date: sql<string>`DATE(${userPropertyAccess.unlockedAt})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(userPropertyAccess)
      .where(gte(userPropertyAccess.unlockedAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${userPropertyAccess.unlockedAt})`);

    // Most popular properties (by unlocks)
    const popularProperties = await db
      .select({
        propertyId: userPropertyAccess.propertyId,
        title: properties.title,
        location: properties.location,
        unlockCount: sql<number>`COUNT(*)`,
      })
      .from(userPropertyAccess)
      .leftJoin(properties, eq(userPropertyAccess.propertyId, properties.id))
      .groupBy(userPropertyAccess.propertyId, properties.title, properties.location)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(5);

    // Token distribution by transaction type
    const tokenDistribution = await db
      .select({
        type: tokenTransactions.type,
        total: sql<number>`SUM(${tokenTransactions.amount})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(tokenTransactions)
      .groupBy(tokenTransactions.type);

    // Recent high-value transactions
    const recentTransactions = await db
      .select({
        id: payments.id,
        userId: payments.userId,
        userName: users.name,
        userEmail: users.email,
        amount: payments.amount,
        tokens: payments.tokens,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .where(eq(payments.status, 'completed'))
      .orderBy(sql`${payments.createdAt} DESC`)
      .limit(10);

    // Average tokens per user
    const avgTokensResult = await db
      .select({ avg: sql<number>`AVG(${users.tokenBalance})` })
      .from(users);
    const avgTokenBalance = Number(avgTokensResult[0]?.avg || 0).toFixed(1);

    // Conversion rate (users who made purchases)
    const purchasedUsersResult = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${payments.userId})` })
      .from(payments)
      .where(eq(payments.status, 'completed'));
    const purchasedUsers = Number(purchasedUsersResult[0]?.count || 0);
    const conversionRate = totalUsers > 0 ? ((purchasedUsers / totalUsers) * 100).toFixed(1) : '0';

    res.json({
      overview: {
        totalRevenue,
        totalTokensSold,
        totalUsers,
        totalProperties,
        totalUnlocks,
        avgTokenBalance: parseFloat(avgTokenBalance),
        conversionRate: parseFloat(conversionRate),
      },
      charts: {
        revenueByDay: revenueByDay.map(r => ({
          date: r.date,
          revenue: Number(r.revenue),
          count: Number(r.count),
        })),
        userGrowth: userGrowth.map(u => ({
          date: u.date,
          count: Number(u.count),
        })),
        unlocksByDay: unlocksByDay.map(u => ({
          date: u.date,
          count: Number(u.count),
        })),
        tokenDistribution: tokenDistribution.map(t => ({
          type: t.type,
          total: Number(t.total),
          count: Number(t.count),
        })),
      },
      popularProperties: popularProperties.map(p => ({
        propertyId: p.propertyId,
        title: p.title,
        location: p.location,
        unlockCount: Number(p.unlockCount),
      })),
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        userId: t.userId,
        userName: t.userName,
        userEmail: t.userEmail,
        amount: t.amount,
        tokens: t.tokens,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}