import { db } from '../src/server/db/client.js';
import { properties } from '../src/server/db/schema.js';
import { eq } from 'drizzle-orm';

async function checkProperties() {
  try {
    console.log('\n=== Checking Properties in Database ===\n');
    
    // Get all properties
    const allProperties = await db.select({
      id: properties.id,
      title: properties.title,
      propertyStatus: properties.propertyStatus,
      isActive: properties.isActive,
      createdAt: properties.createdAt
    }).from(properties);
    
    console.log(`Total properties in database: ${allProperties.length}\n`);
    
    // Show all properties
    console.log('All Properties:');
    allProperties.forEach((prop, index) => {
      console.log(`${index + 1}. ID: ${prop.id}`);
      console.log(`   Title: ${prop.title}`);
      console.log(`   Status: ${prop.propertyStatus}`);
      console.log(`   Active: ${prop.isActive ? 'Yes' : 'No'}`);
      console.log(`   Created: ${prop.createdAt}`);
      console.log('');
    });
    
    // Get only active properties
    const activeProperties = await db.select({
      id: properties.id,
      title: properties.title,
      propertyStatus: properties.propertyStatus
    }).from(properties).where(eq(properties.isActive, true));
    
    console.log(`\nActive properties (shown on /properties page): ${activeProperties.length}`);
    activeProperties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.title} (ID: ${prop.id})`);
    });
    
    // Get inactive properties
    const inactiveProperties = await db.select({
      id: properties.id,
      title: properties.title,
      propertyStatus: properties.propertyStatus
    }).from(properties).where(eq(properties.isActive, false));
    
    if (inactiveProperties.length > 0) {
      console.log(`\nInactive properties (hidden from /properties page): ${inactiveProperties.length}`);
      inactiveProperties.forEach((prop, index) => {
        console.log(`${index + 1}. ${prop.title} (ID: ${prop.id})`);
      });
    }
    
    console.log('\n=== Check Complete ===\n');
    process.exit(0);
  } catch (error) {
    console.error('Error checking properties:', error);
    process.exit(1);
  }
}

checkProperties();
