/**
 * Seed Coach Availability
 * Creates default availability for demo coach (Monday-Friday, 9 AM - 5 PM)
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { coachAvailability, coaches } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seedCoachAvailability() {
  console.log('🌱 Seeding coach availability...');

  try {
    // Get the first coach (demo coach)
    const [coach] = await db.select().from(coaches).limit(1);
    
    if (!coach) {
      console.log('⚠️  No coaches found. Creating demo coach first...');
      // Note: In production, coaches should be created separately
      console.log('Please create a coach first, then run this script again.');
      process.exit(1);
    }

    console.log(`✓ Found coach ID: ${coach.id}`);

    // Check if availability already exists
    const existing = await db
      .select()
      .from(coachAvailability)
      .where(eq(coachAvailability.coachId, coach.id));

    if (existing.length > 0) {
      console.log(`⚠️  Coach already has ${existing.length} availability slots configured.`);
      console.log('   Delete existing slots first if you want to reseed.');
      process.exit(0);
    }

    // Create default availability: Monday-Friday, 9 AM - 5 PM
    const availabilitySlots = [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
    ];

    for (const slot of availabilitySlots) {
      await db.insert(coachAvailability).values({
        coachId: coach.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: 'true',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log('✅ Successfully seeded coach availability!');
    console.log('   Monday-Friday: 9:00 AM - 5:00 PM');
    console.log('   Coach ID:', coach.id);
    console.log('\n🎉 Booking system is now ready to use!');

  } catch (error) {
    console.error('❌ Error seeding coach availability:', error);
    throw error;
  } finally {
    await client.end();
  }
}

seedCoachAvailability();
