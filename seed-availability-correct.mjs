import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

// Availability schedule:
// Weekdays (Mon-Fri): 19:45 - 21:45 (7:45 PM - 9:45 PM)
// Weekends (Sat-Sun): 09:00 - 16:30 (9:00 AM - 4:30 PM)
const availability = [
  // Monday (1)
  { coachId: 1, dayOfWeek: 1, startTime: '19:45', endTime: '21:45', isActive: true },
  // Tuesday (2)
  { coachId: 1, dayOfWeek: 2, startTime: '19:45', endTime: '21:45', isActive: true },
  // Wednesday (3)
  { coachId: 1, dayOfWeek: 3, startTime: '19:45', endTime: '21:45', isActive: true },
  // Thursday (4)
  { coachId: 1, dayOfWeek: 4, startTime: '19:45', endTime: '21:45', isActive: true },
  // Friday (5)
  { coachId: 1, dayOfWeek: 5, startTime: '19:45', endTime: '21:45', isActive: true },
  // Saturday (6)
  { coachId: 1, dayOfWeek: 6, startTime: '09:00', endTime: '16:30', isActive: true },
  // Sunday (0)
  { coachId: 1, dayOfWeek: 0, startTime: '09:00', endTime: '16:30', isActive: true },
];

console.log('Seeding coach availability with correct schedule...');
console.log('Weekdays (Mon-Fri): 19:45 - 21:45');
console.log('Weekends (Sat-Sun): 09:00 - 16:30');
console.log('');

try {
  // First, clear existing availability
  await pool.query('DELETE FROM coach_availability WHERE coach_id = 1');
  console.log('Cleared existing availability for coach_id = 1');
  
  // Insert new availability
  for (const slot of availability) {
    await pool.query(
      'INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
      [slot.coachId, slot.dayOfWeek, slot.startTime, slot.endTime, slot.isActive]
    );
    console.log(`✓ Added: Day ${slot.dayOfWeek} (${slot.startTime} - ${slot.endTime})`);
  }
  
  console.log('');
  console.log('✅ Availability seeded successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Test booking at: https://purposeful-live-coaching-production.onrender.com/sessions/book');
  console.log('2. Select a date and verify time slots appear');
  console.log('3. Complete a test booking');
  
} catch (error) {
  console.error('❌ Error seeding availability:', error.message);
  process.exit(1);
} finally {
  await pool.end();
}
