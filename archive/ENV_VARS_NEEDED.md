# Environment Variables Needed in Render

## Critical for AI Chat
```
OPENAI_API_KEY=sk-...
```
Get from: https://platform.openai.com/api-keys

---

## Critical for Payments (7 variables)

### Stripe API Key
```
STRIPE_SECRET_KEY=sk_test_...
```
Get from: https://dashboard.stripe.com/test/apikeys

### Stripe Price IDs (create products first)
```
STRIPE_PRICE_AI_BASIC=price_...
STRIPE_PRICE_AI_PREMIUM=price_...
STRIPE_PRICE_AI_ELITE=price_...
STRIPE_PRICE_HUMAN_BASIC=price_...
STRIPE_PRICE_HUMAN_PREMIUM=price_...
STRIPE_PRICE_HUMAN_ELITE=price_...
```
Get from: https://dashboard.stripe.com/test/products

---

## How to Add to Render

1. Go to: https://dashboard.render.com
2. Click your service: **purposeful-live-coaching-production**
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Paste name and value
6. Click **"Save Changes"**
7. Render will auto-restart

---

## Priority

**Fix AI Chat:** Add `OPENAI_API_KEY` (1 variable)
**Fix Payments:** Add `STRIPE_SECRET_KEY` + 6 price IDs (7 variables)

**Total:** 8 environment variables to get platform revenue-ready
