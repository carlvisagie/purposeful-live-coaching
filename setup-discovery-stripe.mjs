import Stripe from 'stripe';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { sessionTypes } from './drizzle/schema.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});

const db = drizzle(process.env.DATABASE_URL);

async function setupDiscoverySession() {
  console.log('🚀 Setting up Stripe Product and Price for $1 Discovery Session...\n');

  try {
    // Create Stripe Product
    console.log('Creating Stripe Product...');
    const product = await stripe.products.create({
      name: 'Breakthrough Discovery Session',
      description: 'A complimentary 15-minute breakthrough session to explore your emotional challenges, discuss your goals, and determine if our coaching is the right fit for you. Normally $50, today just $1 to show you\'re serious about change.',
      metadata: {
        sessionType: 'discovery',
        duration: '15',
      },
    });
    console.log(`✅ Product created: ${product.id}\n`);

    // Create one-time payment Price
    console.log('Creating one-time Price ($1)...');
    const oneTimePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 100, // $1.00 in cents
      currency: 'usd',
      metadata: {
        type: 'one-time',
      },
    });
    console.log(`✅ One-time Price created: ${oneTimePrice.id}\n`);

    // Create subscription Price (same $1/month)
    console.log('Creating subscription Price ($1/month)...');
    const subscriptionPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 100, // $1.00/month in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        type: 'subscription',
      },
    });
    console.log(`✅ Subscription Price created: ${subscriptionPrice.id}\n`);

    // Update database with Stripe IDs
    console.log('Updating database with Stripe Price IDs...');
    await db
      .update(sessionTypes)
      .set({
        stripeProductId: product.id,
        oneTimePriceId: oneTimePrice.id,
        stripePriceId: subscriptionPrice.id,
      })
      .where(eq(sessionTypes.name, 'Breakthrough Discovery Session'));
    
    console.log('✅ Database updated!\n');

    console.log('🎉 SUCCESS! $1 Discovery Session is ready for Stripe checkout!');
    console.log(`\nStripe Product ID: ${product.id}`);
    console.log(`One-time Price ID: ${oneTimePrice.id}`);
    console.log(`Subscription Price ID: ${subscriptionPrice.id}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDiscoverySession();
