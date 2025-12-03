import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await connection.query('SELECT * FROM bookings ORDER BY createdAt DESC LIMIT 5');
console.log('Recent bookings:', JSON.stringify(result[0], null, 2));

await connection.end();
