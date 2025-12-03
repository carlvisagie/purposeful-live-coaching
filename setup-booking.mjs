import Stripe from 'stripe';
import { drizzle } from 'drizzle-orm/mysql2';
import { sessionTypes, coachAvailability, coaches } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});

const db = drizzle(process.env.DATABASE_URL);

async function setupBookingSystem() {
  console.log('🚀 Setting up booking system...\n');

  // Step 1: Create Stripe Products and Prices
  console.log('📦 Creating Stripe products and prices...');
  
  const products = [
    {
      name: 'Essential Coaching',
      description: '24/7 AI coaching access, emotional pattern tracking, basic trigger detection, monthly coach check-in, crisis support resources',
      price: 9900, // $99 in cents
      duration: 60,
    },
    {
      name: 'Growth Coaching',
      description: 'Everything in Essential, plus: Advanced AI pattern analysis, weekly coach check-ins, personalized 30-day roadmap, priority crisis response, progress tracking dashboard',
      price: 19900, // $199 in cents
      duration: 60,
    },
    {
      name: 'Transformation Coaching',
      description: 'Everything in Growth, plus: Bi-weekly 1-on-1 coaching calls, custom resilience strategies, family/partner support resources, direct coach messaging, lifetime access to materials',
      price: 29900, // $299 in cents
      duration: 90,
    },
  ];

  const priceIds = [];

  for (const product of products) {
    try {
      // Create product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
      });

      // Create recurring price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
      });

      priceIds.push({
        ...product,
        stripePriceId: stripePrice.id,
        stripeProductId: stripeProduct.id,
      });

      console.log(`✅ Created: ${product.name} - ${stripePrice.id}`);
    } catch (error) {
      console.error(`❌ Failed to create ${product.name}:`, error.message);
    }
  }

  console.log('\n📊 Creating session types in database...');

  // Step 2: Get or create coach
  let coach = await db.select().from(coaches).limit(1);
  
  if (coach.length === 0) {
    console.log('Creating default coach...');
    await db.insert(coaches).values({
      userId: 1, // Assuming owner is user ID 1
      specialty: 'Emotional Resilience & Anxiety Management',
      bio: 'Certified emotional resilience coach specializing in anxiety reduction and stress management.',
      certifications: 'Certified Life Coach, Mental Health First Aid',
      yearsExperience: 10,
      isActive: 'true',
    });
    coach = await db.select().from(coaches).limit(1);
  }

  const coachId = coach[0].id;

  // Step 3: Create session types
  for (let i = 0; i < priceIds.length; i++) {
    const product = priceIds[i];
    try {
      await db.insert(sessionTypes).values({
        coachId,
        name: product.name,
        description: product.description,
        duration: product.duration,
        price: product.price,
        stripePriceId: product.stripePriceId,
        isActive: 'true',
        displayOrder: i + 1,
      });
      console.log(`✅ Created session type: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to create session type ${product.name}:`, error.message);
    }
  }

  console.log('\n📅 Setting up coach availability...');

  // Step 4: Create default availability (Mon-Fri, 9am-5pm)
  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
  
  for (const dayOfWeek of daysOfWeek) {
    try {
      await db.insert(coachAvailability).values({
        coachId,
        dayOfWeek,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: 'true',
      });
      console.log(`✅ Set availability for day ${dayOfWeek}`);
    } catch (error) {
      console.error(`❌ Failed to set availability for day ${dayOfWeek}:`, error.message);
    }
  }

  console.log('\n✨ Booking system setup complete!');
  console.log('\n📋 Summary:');
  console.log(`- Created ${priceIds.length} Stripe products and prices`);
  console.log(`- Created ${priceIds.length} session types`);
  console.log(`- Set availability for ${daysOfWeek.length} days (Mon-Fri, 9am-5pm)`);
  console.log('\n🎯 Next: Visit /book-session to test the booking flow!');
}

setupBookingSystem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
