import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';

/**
 * Test to validate Stripe AI tier price IDs are valid and configured correctly
 */
describe('Stripe AI Tier Products', () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-10-29.clover',
  });

  const priceIds = {
    essential: process.env.STRIPE_PRICE_AI_ESSENTIAL_MONTHLY,
    growth: process.env.STRIPE_PRICE_AI_GROWTH_MONTHLY,
    transformation: process.env.STRIPE_PRICE_AI_TRANSFORMATION_MONTHLY,
  };

  it('should have all AI tier price IDs defined', () => {
    expect(priceIds.essential).toBeDefined();
    expect(priceIds.growth).toBeDefined();
    expect(priceIds.transformation).toBeDefined();
  });

  it('should validate AI Essential price ID format', () => {
    expect(priceIds.essential).toMatch(/^price_/);
  });

  it('should validate AI Growth price ID format', () => {
    expect(priceIds.growth).toMatch(/^price_/);
  });

  it('should validate AI Transformation price ID format', () => {
    expect(priceIds.transformation).toMatch(/^price_/);
  });

  it('should fetch AI Essential price from Stripe', async () => {
    if (!priceIds.essential) {
      throw new Error('STRIPE_PRICE_AI_ESSENTIAL_MONTHLY not set');
    }

    const price = await stripe.prices.retrieve(priceIds.essential);
    expect(price.id).toBe(priceIds.essential);
    expect(price.unit_amount).toBe(4900); // $49.00 in cents
    expect(price.recurring?.interval).toBe('month');
    expect(price.type).toBe('recurring');
  });

  it('should fetch AI Growth price from Stripe', async () => {
    if (!priceIds.growth) {
      throw new Error('STRIPE_PRICE_AI_GROWTH_MONTHLY not set');
    }

    const price = await stripe.prices.retrieve(priceIds.growth);
    expect(price.id).toBe(priceIds.growth);
    expect(price.unit_amount).toBe(7900); // $79.00 in cents
    expect(price.recurring?.interval).toBe('month');
    expect(price.type).toBe('recurring');
  });

  it('should fetch AI Transformation price from Stripe', async () => {
    if (!priceIds.transformation) {
      throw new Error('STRIPE_PRICE_AI_TRANSFORMATION_MONTHLY not set');
    }

    const price = await stripe.prices.retrieve(priceIds.transformation);
    expect(price.id).toBe(priceIds.transformation);
    expect(price.unit_amount).toBe(9900); // $99.00 in cents
    expect(price.recurring?.interval).toBe('month');
    expect(price.type).toBe('recurring');
  });
});
