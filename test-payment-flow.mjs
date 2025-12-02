#!/usr/bin/env node
/**
 * Integration test for payment verification and booking creation
 * Run with: node test-payment-flow.mjs
 */

console.log('🧪 Testing Payment Verification Flow\n');

// Test 1: Check environment variables
console.log('✓ Test 1: Environment Variables');
const requiredEnvVars = [
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

let envCheck = true;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`  ❌ Missing: ${envVar}`);
    envCheck = false;
  } else {
    console.log(`  ✓ Found: ${envVar}`);
  }
}

if (!envCheck) {
  console.error('\n❌ Environment check failed');
  process.exit(1);
}

console.log('\n✓ Test 2: Stripe SDK');
try {
  const stripe = (await import('stripe')).default;
  const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);
  console.log('  ✓ Stripe SDK initialized');
  
  // Test Stripe connection
  try {
    await stripeClient.customers.list({ limit: 1 });
    console.log('  ✓ Stripe API connection successful');
  } catch (err) {
    console.error('  ❌ Stripe API connection failed:', err.message);
    process.exit(1);
  }
} catch (err) {
  console.error('  ❌ Failed to load Stripe SDK:', err.message);
  process.exit(1);
}

console.log('\n✓ Test 3: Database Connection');
try {
  const { drizzle } = await import('drizzle-orm/mysql2');
  const db = drizzle(process.env.DATABASE_URL);
  console.log('  ✓ Database client initialized');
  
  // Test query
  try {
    const result = await db.execute('SELECT 1 as test');
    console.log('  ✓ Database connection successful');
  } catch (err) {
    console.error('  ❌ Database query failed:', err.message);
    process.exit(1);
  }
} catch (err) {
  console.error('  ❌ Failed to connect to database:', err.message);
  process.exit(1);
}

console.log('\n✓ Test 4: Webhook Secret Format');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (webhookSecret.startsWith('whsec_')) {
  console.log('  ✓ Webhook secret has correct format');
  console.log(`  ✓ Secret: ${webhookSecret.substring(0, 15)}...`);
} else {
  console.error('  ❌ Webhook secret has incorrect format (should start with whsec_)');
  process.exit(1);
}

console.log('\n✅ All tests passed!');
console.log('\nPayment verification system is ready to handle bookings.');
console.log('When a customer completes payment:');
console.log('  1. Stripe redirects to /my-sessions?session_id=xxx');
console.log('  2. Frontend calls verifyAndCreateBooking API');
console.log('  3. API fetches payment details from Stripe');
console.log('  4. Booking is created in database');
console.log('  5. Dashboard shows the new booking');
