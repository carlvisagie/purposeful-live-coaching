import 'dotenv/config';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment');
  process.exit(1);
}

const stripe = await import('stripe').then(m => m.default(STRIPE_SECRET_KEY));

// Price IDs from the products we just created
const PRICE_IDS = {
  ai_basic: 'price_1ScBLlCoewQKHsplOoYSMraW',
  ai_premium: 'price_1ScBLlCoewQKHsplhQPwTppM',
  ai_elite: 'price_1ScBLmCoewQKHsplFU27FCJU',
  human_basic: 'price_1ScBLmCoewQKHsplsWrQUuOt',
  human_premium: 'price_1ScBLnCoewQKHspleJO6p8XJ',
  human_elite: 'price_1ScBLnCoewQKHspl9iyjwFJ8',
};

const PRODUCTS = [
  { name: 'AI Coaching - Basic', priceId: PRICE_IDS.ai_basic, amount: '$29/month' },
  { name: 'AI Coaching - Premium', priceId: PRICE_IDS.ai_premium, amount: '$149/month' },
  { name: 'AI Coaching - Elite', priceId: PRICE_IDS.ai_elite, amount: '$299/month' },
  { name: 'Human Coaching - Basic', priceId: PRICE_IDS.human_basic, amount: '$800/month' },
  { name: 'Human Coaching - Premium', priceId: PRICE_IDS.human_premium, amount: '$1,200/month' },
  { name: 'Human Coaching - Elite', priceId: PRICE_IDS.human_elite, amount: '$2,000/month' },
];

async function main() {
  console.log('🔗 Creating Stripe Payment Links...\n');
  
  const paymentLinks = [];

  for (const product of PRODUCTS) {
    console.log(`Creating payment link for: ${product.name} (${product.amount})`);
    
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'hosted_confirmation',
        hosted_confirmation: {
          custom_message: 'Thank you for subscribing to Purposeful Live Coaching! Check your email for next steps.',
        },
      },
    });

    console.log(`✅ ${paymentLink.url}\n`);
    
    paymentLinks.push({
      name: product.name,
      amount: product.amount,
      url: paymentLink.url,
    });
  }

  console.log('\n\n✅ All payment links created!\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('📋 PAYMENT LINKS - Share these with customers:\n');
  paymentLinks.forEach(link => {
    console.log(`${link.name} (${link.amount}):`);
    console.log(`${link.url}\n`);
  });
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
