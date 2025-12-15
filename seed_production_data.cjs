const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // First, ensure coach exists (upsert)
    const coachResult = await client.query(`
      INSERT INTO coaches (id, name, email, bio, specialties, created_at, updated_at)
      VALUES (1, 'Carl Visagie', 'carl@purposefullive.com', 'Professional Life Coach specializing in holistic wellness and personal transformation', 'Emotional Wellness, Mental Health, Physical Fitness, Nutrition, Spiritual Wellness', NOW(), NOW())
      ON CONFLICT (id) DO UPDATE 
      SET name = EXCLUDED.name, 
          email = EXCLUDED.email,
          bio = EXCLUDED.bio,
          specialties = EXCLUDED.specialties,
          updated_at = NOW()
      RETURNING id
    `);
    
    const coachId = coachResult.rows[0].id;
    console.log('✅ Coach created/updated. ID:', coachId);
    
    // Delete existing availability for this coach
    await client.query('DELETE FROM coach_availability WHERE coach_id = $1', [coachId]);
    console.log('✅ Cleared existing availability');
    
    // Insert fresh availability (Monday-Friday, 9 AM - 5 PM)
    await client.query(`
      INSERT INTO coach_availability (coach_id, day_of_week, start_time, end_time, is_active, created_at, updated_at)
      VALUES 
        ($1, 1, '09:00', '17:00', true, NOW(), NOW()),
        ($1, 2, '09:00', '17:00', true, NOW(), NOW()),
        ($1, 3, '09:00', '17:00', true, NOW(), NOW()),
        ($1, 4, '09:00', '17:00', true, NOW(), NOW()),
        ($1, 5, '09:00', '17:00', true, NOW(), NOW())
    `, [coachId]);
    
    await client.query('COMMIT');
    
    console.log('✅ Coach availability seeded successfully!');
    console.log('   Monday-Friday, 9:00 AM - 5:00 PM');
    console.log('   5 availability slots created');
    
    // Verify the data
    const verify = await client.query('SELECT * FROM coach_availability WHERE coach_id = $1 ORDER BY day_of_week', [coachId]);
    console.log('\n📊 Verification:');
    verify.rows.forEach(row => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      console.log(`   ${days[row.day_of_week]}: ${row.start_time} - ${row.end_time} (Active: ${row.is_active})`);
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
