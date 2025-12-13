import pg from 'pg';
const { Client } = pg;

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const client = new Client({ connectionString: DATABASE_URL });

async function fixColumns() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check current columns
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'aiChatConversations'
      ORDER BY ordinal_position
    `);
    
    console.log('Current columns:', result.rows.map(r => r.column_name));

    // Rename columns if they're in camelCase
    const renames = [
      ['userId', 'user_id'],
      ['clientId', 'client_id'],
      ['subscriptionId', 'subscription_id'],
      ['sessionDuration', 'session_duration'],
      ['feedbackText', 'feedback_text'],
      ['feedbackCategory', 'feedback_category'],
      ['wasHelpful', 'was_helpful'],
      ['reviewedByAdmin', 'reviewed_by_admin'],
      ['adminNotes', 'admin_notes'],
      ['lastMessageAt', 'last_message_at'],
      ['createdAt', 'created_at'],
      ['updatedAt', 'updated_at']
    ];

    for (const [from, to] of renames) {
      try {
        await client.query(`ALTER TABLE "aiChatConversations" RENAME COLUMN "${from}" TO "${to}"`);
        console.log(`✓ Renamed ${from} -> ${to}`);
      } catch (err) {
        if (err.code === '42703') {
          console.log(`- Column ${from} doesn't exist (already renamed or never existed)`);
        } else {
          console.error(`✗ Error renaming ${from}:`, err.message);
        }
      }
    }

    console.log('\n✅ Database columns fixed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

fixColumns();
