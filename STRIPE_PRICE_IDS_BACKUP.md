# STRIPE PRICE IDS - CRITICAL BACKUP

**DO NOT DELETE THIS FILE**

These are the production Stripe price IDs for the AI coaching subscription tiers. If the sandbox resets and these are lost from environment variables, use these values to restore them immediately.

## AI Coaching Subscription Tiers

| Tier | Price | Stripe Price ID |
|------|-------|-----------------|
| AI Essential | $49/month | `price_1SVHwrCoewQKHsplKMdwFOWI` |
| AI Growth | $79/month | `price_1SVI1oCoewQKHsplzXpeOxxr` |
| AI Transformation | $99/month | `price_1SVI2sCoewQKHspl09ZfgFbx` |

## Environment Variables to Set

```
STRIPE_PRICE_AI_ESSENTIAL_MONTHLY=price_1SVHwrCoewQKHsplKMdwFOWI
STRIPE_PRICE_AI_GROWTH_MONTHLY=price_1SVI1oCoewQKHsplzXpeOxxr
STRIPE_PRICE_AI_TRANSFORMATION_MONTHLY=price_1SVI2sCoewQKHspl09ZfgFbx
```

## How to Restore

1. Go to Management UI → Settings → Secrets
2. Add the three environment variables above with their corresponding Stripe Price IDs
3. Dev server will automatically reload with the new secrets

**Last Updated:** 2025-11-21
