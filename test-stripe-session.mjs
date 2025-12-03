import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const sessionId = process.argv[2];

if (!sessionId) {
  console.error('Usage: node test-stripe-session.mjs <session_id>');
  process.exit(1);
}

async function checkSession() {
  try {
    console.log('Fetching Stripe session:', sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('\n=== SESSION DATA ===');
    console.log('ID:', session.id);
    console.log('Payment Status:', session.payment_status);
    console.log('Customer Email:', session.customer_details?.email);
    console.log('Amount Total:', session.amount_total);
    console.log('\n=== METADATA ===');
    console.log(JSON.stringify(session.metadata, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSession();
