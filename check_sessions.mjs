import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSessions() {
  const client = await pool.connect();
  try {
    // Check sessions
    const sessions = await client.query('SELECT * FROM sessions ORDER BY created_at DESC LIMIT 10');
    console.log('=== SESSIONS ===');
    console.log(JSON.stringify(sessions.rows, null, 2));
    
    // Check clients
    const clients = await client.query('SELECT id, name, email, status FROM clients ORDER BY created_at DESC LIMIT 10');
    console.log('\n=== CLIENTS ===');
    console.log(JSON.stringify(clients.rows, null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}

checkSessions().catch(console.error);
