import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

const sessionId = 'cs_test_b1GP5wgXlKjtme1yLtETsCLjHiOMpY9wX28dL8tY7IkYrjOGjT1TsXTf3';

console.log('🔍 Fetching Stripe session details...\n');

try {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  console.log('✅ Session retrieved successfully!\n');
  console.log('Payment Status:', session.payment_status);
  console.log('Customer Email:', session.customer_email || session.customer_details?.email);
  console.log('Customer Name:', session.customer_details?.name);
  console.log('Amount:', session.amount_total, 'cents ($' + (session.amount_total / 100) + ')');
  console.log('\nMetadata:');
  console.log(JSON.stringify(session.metadata, null, 2));
  
  if (session.payment_status === 'paid') {
    console.log('\n✅ Payment is confirmed - booking should be created!');
  } else {
    console.log('\n❌ Payment not completed');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
