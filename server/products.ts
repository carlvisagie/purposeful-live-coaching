/**
 * Stripe Products Configuration
 * Individual Coaching Site - AI Coaching Tiers + Session Payments ONLY
 * NO ENTERPRISE CONTENT
 */

/**
 * AI Coaching Subscription Products
 */
export const PRODUCTS = {
  AI_ESSENTIAL: {
    id: "ai_essential",
    name: "AI Essential",
    description: "24/7 AI coaching support with unlimited check-ins and crisis detection",
    priceMonthly: 4900, // $49 in cents
    priceYearly: 49000, // $490 in cents (save $98/year)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_AI_ESSENTIAL_MONTHLY || "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_AI_ESSENTIAL_YEARLY || "",
    stripePriceIdYearlySplit: process.env.STRIPE_PRICE_AI_ESSENTIAL_YEARLY_SPLIT || "", // 2 payments of $245
    features: [
      "24/7 AI coaching chat",
      "Unlimited daily check-ins",
      "Crisis detection & alerts",
      "Emotion tracking & insights",
      "Progress visualization",
      "Email support"
    ],
    splitPayment: {
      enabled: true,
      installments: 2,
      amount: 24500 // $245 per payment (yearly only)
    },
    category: "ai" as const
  },
  AI_GROWTH: {
    id: "ai_growth",
    name: "AI Growth",
    description: "Advanced AI coaching with personalized insights and monthly human coach check-ins",
    priceMonthly: 7900, // $79 in cents
    priceYearly: 79000, // $790 in cents (save $158/year)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_AI_GROWTH_MONTHLY || "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_AI_GROWTH_YEARLY || "",
    stripePriceIdYearlySplit: process.env.STRIPE_PRICE_AI_GROWTH_YEARLY_SPLIT || "", // 2 payments of $395
    features: [
      "Everything in AI Essential",
      "Advanced pattern detection",
      "Personalized coping strategies",
      "Monthly human coach check-in",
      "Priority crisis escalation",
      "Weekly progress reports"
    ],
    splitPayment: {
      enabled: true,
      installments: 2,
      amount: 39500 // $395 per payment (yearly only)
    },
    category: "ai" as const,
    featured: true
  },
  AI_TRANSFORMATION: {
    id: "ai_transformation",
    name: "AI Transformation",
    description: "Premium AI coaching with bi-weekly human sessions and custom goal tracking",
    priceMonthly: 9900, // $99 in cents
    priceYearly: 99000, // $990 in cents (save $198/year)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_AI_TRANSFORMATION_MONTHLY || "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_AI_TRANSFORMATION_YEARLY || "",
    stripePriceIdYearlySplit: process.env.STRIPE_PRICE_AI_TRANSFORMATION_YEARLY_SPLIT || "", // 2 payments of $495
    features: [
      "Everything in AI Growth",
      "Bi-weekly human coach sessions",
      "Custom goal tracking",
      "Unlimited crisis support",
      "Family support resources",
      "Lifetime access to insights"
    ],
    splitPayment: {
      enabled: true,
      installments: 2,
      amount: 49500 // $495 per payment (yearly only)
    },
    category: "ai" as const
  }
} as const;

export type ProductId = keyof typeof PRODUCTS;

/**
 * Get product by ID
 */
export function getProduct(id: ProductId) {
  return PRODUCTS[id];
}

/**
 * Get all products as array
 */
export function getAllProducts() {
  return Object.values(PRODUCTS);
}

/**
 * Check if product supports split payments (yearly only for AI products)
 */
export function supportsSplitPayment(productId: ProductId): boolean {
  const product = PRODUCTS[productId];
  return 'splitPayment' in product && product.splitPayment?.enabled === true;
}

/**
 * Get split payment details for a product
 */
export function getSplitPaymentDetails(productId: ProductId) {
  const product = PRODUCTS[productId];
  if (!('splitPayment' in product)) return null;
  return product.splitPayment;
}

/**
 * Session Payment Products (One-time payments for coaching sessions)
 */
export const SESSION_PRODUCTS = [
  {
    id: 'intro_session',
    name: '$1 Intro Session',
    description: '20-minute clarity session with personalized insight',
    price: 100, // $1.00 in cents
    duration: 20,
    stripePriceId: process.env.STRIPE_INTRO_SESSION_PRICE_ID || 'price_intro_session' // TODO: Create in Stripe
  },
  {
    id: 'foundation_session',
    name: 'Foundation Session',
    description: '45-minute 1-on-1 coaching session with action plan',
    price: 4900, // $49.00 in cents
    duration: 45,
    stripePriceId: process.env.STRIPE_FOUNDATION_SESSION_PRICE_ID || 'price_foundation_session' // TODO: Create in Stripe
  },
  {
    id: 'growth_session',
    name: 'Growth Session',
    description: '60-minute intensive session with 30-day roadmap',
    price: 9900, // $99.00 in cents
    duration: 60,
    stripePriceId: process.env.STRIPE_GROWTH_SESSION_PRICE_ID || 'price_growth_session' // TODO: Create in Stripe
  },
  {
    id: 'transformation_session',
    name: 'Transformation Session',
    description: '90-minute breakthrough session with extended support',
    price: 14900, // $149.00 in cents
    duration: 90,
    stripePriceId: process.env.STRIPE_TRANSFORMATION_SESSION_PRICE_ID || 'price_transformation_session' // TODO: Create in Stripe
  }
] as const;

export type SessionProductId = typeof SESSION_PRODUCTS[number]['id'];

/**
 * Get session product by ID
 */
export function getSessionProduct(sessionId: string) {
  return SESSION_PRODUCTS.find(p => p.id === sessionId);
}

/**
 * Get all session products
 */
export function getAllSessionProducts() {
  return SESSION_PRODUCTS;
}
