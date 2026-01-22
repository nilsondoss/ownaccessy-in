/**
 * Script to create admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { db } from '../src/server/db/client.js';
import { users } from '../src/server/db/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function createAdmin() {
  try {
    const adminEmail = 'admin@ownaccessy.com';
    const adminPassword = 'Admin@098';
    const adminName = 'admin';

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('❌ Admin user already exists with email:', adminEmail);
      console.log('User ID:', existingAdmin[0].id);
      console.log('Role:', existingAdmin[0].role);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Generate unique referral code
    const referralCode = crypto.randomBytes(6).toString('hex').toUpperCase();

    // Create admin user
    const result = await db.insert(users).values({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      tokenBalance: 1000, // Give admin 1000 tokens
      referralCode: referralCode,
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('👤 Username:', adminName);
    console.log('🔑 Password:', adminPassword);
    console.log('👑 Role: admin');
    console.log('🪙 Token Balance: 1000');
    console.log('🔗 Referral Code:', referralCode);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Login at: https://ownaccessy.in/login');
    console.log('🛡️  Admin Dashboard: https://ownaccessy.in/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
