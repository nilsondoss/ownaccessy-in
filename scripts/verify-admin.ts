import { db } from '../src/server/db/client.js';
import { users } from '../src/server/db/schema.js';
import { eq } from 'drizzle-orm';

async function verifyAdmin() {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@ownaccessy.com'))
      .limit(1);

    if (user.length === 0) {
      console.log('❌ Admin user NOT found');
      process.exit(1);
    }

    console.log('✅ Admin user verified!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', user[0].email);
    console.log('👤 Name:', user[0].name);
    console.log('👑 Role:', user[0].role);
    console.log('🪙 Token Balance:', user[0].tokenBalance);
    console.log('🔗 Referral Code:', user[0].referralCode);
    console.log('📅 Created:', user[0].createdAt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Login at: https://ownaccessy.in/login');
    console.log('🛡️  Admin Dashboard: https://ownaccessy.in/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying admin:', error);
    process.exit(1);
  }
}

verifyAdmin();
