import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://purposeful_db_user:FRwMlkxLfZMcFRxVWXHYNIzwlTVvF3Hb@dpg-ct9jjrbtq21c73bqp0p0-a.oregon-postgres.render.com/purposeful_db",
  ssl: { rejectUnauthorized: false }
});

try {
  console.log('Connecting to database...');
  const client = await pool.connect();
  console.log('Connected!');
  
  // Check if coach_availability table exists
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'coach_availability'
  `);
  
  console.log('coach_availability table exists:', result.rows.length > 0);
  
  if (result.rows.length > 0) {
    // Check current data
    const data = await client.query('SELECT * FROM coach_availability LIMIT 5');
    console.log('Current rows:', data.rows.length);
    console.log('Sample data:', data.rows);
  }
  
  client.release();
} catch (error) {
  console.error('Error:', error.message);
} finally {
  await pool.end();
}
