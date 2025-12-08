import 'dotenv/config';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment');
  process.exit(1);
}

const stripe = await import('stripe').then(m => m.default(STRIPE_SECRET_KEY));

// Define the products we need
const PRODUCTS_TO_CREATE = [
  {
    name: 'AI Coaching - Basic',
    description: 'AI-powered coaching with 24/7 access to your personal wellness coach',
    price: 2900, // $29.00
    interval: 'month',
    tier: 'ai_basic'
  },
  {
    name: 'AI Coaching - Premium',
    description: 'Advanced AI coaching with deeper insights and personalized wellness plans',
    price: 14900, // $149.00
    interval: 'month',
    tier: 'ai_premium'
  },
  {
    name: 'AI Coaching - Elite',
    description: 'Elite AI coaching with comprehensive wellness tracking and priority support',
    price: 29900, // $299.00
    interval: 'month',
    tier: 'ai_elite'
  },
  {
    name: 'Human Coaching - Basic',
    description: 'Personal 1-on-1 coaching sessions with certified wellness coach',
    price: 80000, // $800.00
    interval: 'month',
    tier: 'human_basic'
  },
  {
    name: 'Human Coaching - Premium',
    description: 'Premium human coaching with extended sessions and personalized plans',
    price: 120000, // $1,200.00
    interval: 'month',
    tier: 'human_premium'
  },
  {
    name: 'Human Coaching - Elite',
    description: 'Elite human coaching with unlimited access and comprehensive support',
    price: 200000, // $2,000.00
    interval: 'month',
    tier: 'human_elite'
  }
];

async function main() {
  console.log('🔍 Checking existing Stripe products...\n');
  
  // List existing products
  const existingProducts = await stripe.products.list({ limit: 100 });
  console.log(`Found ${existingProducts.data.length} existing products:`);
  existingProducts.data.forEach(p => {
    console.log(`  - ${p.name} (${p.id})`);
  });
  console.log('');

  const createdProducts = [];

  for (const productDef of PRODUCTS_TO_CREATE) {
    console.log(`\n📦 Creating: ${productDef.name}`);
    
    // Create product
    const product = await stripe.products.create({
      name: productDef.name,
      description: productDef.description,
      metadata: {
        tier: productDef.tier
      }
    });
    console.log(`   ✅ Product created: ${product.id}`);

    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productDef.price,
      currency: 'usd',
      recurring: {
        interval: productDef.interval
      }
    });
    console.log(`   ✅ Price created: ${price.id} ($${productDef.price / 100}/${productDef.interval})`);

    createdProducts.push({
      tier: productDef.tier,
      productId: product.id,
      priceId: price.id,
      amount: productDef.price
    });
  }

  console.log('\n\n✅ All products created successfully!\n');
  console.log('📋 Copy these Price IDs to server/config/stripe.ts:\n');
  console.log('export const STRIPE_PRICE_IDS = {');
  createdProducts.forEach(p => {
    console.log(`  ${p.tier}: '${p.priceId}', // $${p.amount / 100}/month`);
  });
  console.log('};');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
