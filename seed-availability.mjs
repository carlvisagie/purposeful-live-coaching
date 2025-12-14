import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

const availability = [
  { coachId: 1, dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true },
  { coachId: 1, dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isActive: true },
  { coachId: 1, dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true },
  { coachId: 1, dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isActive: true },
  { coachId: 1, dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isActive: true },
];

console.log('Seeding availability...');
for (const slot of availability) {
  await pool.query(
    'INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) ON CONFLICT DO NOTHING',
    [slot.coachId, slot.dayOfWeek, slot.startTime, slot.endTime, slot.isActive]
  );
}
console.log('Done!');
await pool.end();
