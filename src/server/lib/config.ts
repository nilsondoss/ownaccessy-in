import { db } from '../db/client.js';
import { systemConfig } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Fetch a configuration value from the database
 */
export async function getConfigValue(key: string): Promise<string | null> {
  try {
    const result = await db
      .select()
      .from(systemConfig)
      .where(eq(systemConfig.configKey, key))
      .limit(1);

    return result[0]?.configValue || null;
  } catch (error) {
    console.error(`Error fetching config value for key: ${key}`, error);
    return null;
  }
}

/**
 * Fetch Razorpay credentials from database
 */
export async function getRazorpayConfig(): Promise<{
  keyId: string | null;
  keySecret: string | null;
}> {
  const [keyId, keySecret] = await Promise.all([
    getConfigValue('razorpay_key_id'),
    getConfigValue('razorpay_key_secret'),
  ]);

  return { keyId, keySecret };
}

/**
 * Check if Razorpay is configured
 */
export async function isRazorpayConfigured(): Promise<boolean> {
  const config = await getRazorpayConfig();
  return !!(config.keyId && config.keySecret);
}
