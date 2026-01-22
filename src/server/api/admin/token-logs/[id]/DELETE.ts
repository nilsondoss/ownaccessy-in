import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { tokenLogs, tokenTransactions } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../../../lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const logId = parseInt(req.params.id);
    if (isNaN(logId)) {
      return res.status(400).json({ error: 'Invalid log ID' });
    }

    // Check if log exists in tokenLogs table
    const existingLog = await db.select()
      .from(tokenLogs)
      .where(eq(tokenLogs.id, logId))
      .limit(1);

    // Check if log exists in tokenTransactions table
    const existingTransaction = await db.select()
      .from(tokenTransactions)
      .where(eq(tokenTransactions.id, logId))
      .limit(1);

    if (existingLog.length === 0 && existingTransaction.length === 0) {
      return res.status(404).json({ error: 'Token log not found' });
    }

    // Delete from both tables (if exists)
    if (existingLog.length > 0) {
      await db.delete(tokenLogs).where(eq(tokenLogs.id, logId));
    }
    
    if (existingTransaction.length > 0) {
      await db.delete(tokenTransactions).where(eq(tokenTransactions.id, logId));
    }

    res.json({ 
      success: true, 
      message: 'Token log deleted successfully',
      deletedFrom: {
        tokenLogs: existingLog.length > 0,
        tokenTransactions: existingTransaction.length > 0
      }
    });
  } catch (error: any) {
    console.error('Delete token log error:', error);
    res.status(500).json({ error: 'Failed to delete token log', message: error.message });
  }
}
