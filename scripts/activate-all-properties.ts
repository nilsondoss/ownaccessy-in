import { db } from '../src/server/db/client.js';
import { properties } from '../src/server/db/schema.js';
import { eq } from 'drizzle-orm';

async function activateAllProperties() {
  try {
    console.log('\n=== Activating All Properties ===\n');
    
    // Get all properties
    const allProperties = await db.select({
      id: properties.id,
      title: properties.title,
      isActive: properties.isActive
    }).from(properties);
    
    console.log(`Total properties in database: ${allProperties.length}`);
    
    // Count inactive properties
    const inactiveCount = allProperties.filter(p => !p.isActive).length;
    console.log(`Inactive properties: ${inactiveCount}`);
    console.log(`Active properties: ${allProperties.length - inactiveCount}\n`);
    
    if (inactiveCount === 0) {
      console.log('✅ All properties are already active!');
      console.log('\nAll properties will be visible on /properties page.\n');
      process.exit(0);
    }
    
    // Show inactive properties
    console.log('Inactive properties to be activated:');
    allProperties.filter(p => !p.isActive).forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.title} (ID: ${prop.id})`);
    });
    
    // Activate all properties
    console.log('\nActivating all properties...');
    
    for (const prop of allProperties) {
      if (!prop.isActive) {
        await db.update(properties)
          .set({ isActive: true })
          .where(eq(properties.id, prop.id));
        console.log(`✅ Activated: ${prop.title}`);
      }
    }
    
    console.log('\n✅ All properties are now active!');
    console.log('All properties will now be visible on /properties page.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error activating properties:', error);
    process.exit(1);
  }
}

activateAllProperties();
