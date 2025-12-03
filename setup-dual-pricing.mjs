import Stripe from 'stripe';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { sessionTypes } from './drizzle/schema.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const db = drizzle(process.env.DATABASE_URL);

async function setupDualPricing() {
  console.log('🚀 Creating Stripe one-time Price IDs...\n');

  // Define the 3 coaching tiers with one-time pricing
  const tiers = [
    {
      name: 'Essential Coaching',
      oneTimePrice: 9900, // $99.00
      subscriptionPrice: 7900, // $79.00/month (20% savings)
      description: '24/7 AI coaching access, emotional pattern tracking, basic trigger detection, monthly coach check-in, crisis support resources',
    },
    {
      name: 'Growth Coaching',
      oneTimePrice: 19900, // $199.00
      subscriptionPrice: 15900, // $159.00/month (20% savings)
      description: 'Everything in Essential, plus: Advanced AI pattern analysis, weekly coach check-ins, personalized 30-day roadmap, priority crisis response, progress tracking dashboard',
    },
    {
      name: 'Transformation Coaching',
      oneTimePrice: 29900, // $299.00
      subscriptionPrice: 23900, // $239.00/month (20% savings)
      description: 'Everything in Growth, plus: Bi-weekly 1-on-1 coaching calls, custom resilience strategies, family/partner support resources, direct coach messaging, lifetime access to materials',
    },
  ];

  for (const tier of tiers) {
    console.log(`📦 Creating one-time price for ${tier.name}...`);

    // Create one-time Stripe Price
    const oneTimePrice = await stripe.prices.create({
      currency: 'usd',
      unit_amount: tier.oneTimePrice,
      product_data: {
        name: `${tier.name} - Single Session`,
      },
    });

    console.log(`✅ One-time Price ID: ${oneTimePrice.id} ($${tier.oneTimePrice / 100})`);

    // Find existing session type by name
    const existingTypes = await db.select().from(sessionTypes).where(eq(sessionTypes.name, tier.name));

    if (existingTypes.length > 0) {
      const existingType = existingTypes[0];
      
      // Update with one-time price ID and subscription price
      await db.update(sessionTypes)
        .set({
          oneTimePriceId: oneTimePrice.id,
          subscriptionPrice: tier.subscriptionPrice,
        })
        .where(eq(sessionTypes.id, existingType.id));

      console.log(`✅ Updated ${tier.name} with one-time pricing\n`);
    } else {
      console.log(`⚠️  Session type "${tier.name}" not found in database. Skipping...\n`);
    }
  }

  console.log('🎉 Dual pricing setup complete!');
  console.log('\n📊 Summary:');
  console.log('- Essential: $99 one-time OR $79/month (save $20/month)');
  console.log('- Growth: $199 one-time OR $159/month (save $40/month)');
  console.log('- Transformation: $299 one-time OR $239/month (save $60/month)');
  
  process.exit(0);
}

setupDualPricing().catch((error) => {
  console.error('❌ Error setting up dual pricing:', error);
  process.exit(1);
});
