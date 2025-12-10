# Quick Start - Get Revenue-Ready in 15 Minutes

## What's Fixed ✅
- AI Chat error logging (shows actual error)
- Payment buttons (uses environment variables)
- No more Manus code (100% independent)

## What You Need to Do 🎯

### 1. Test Deployment (2 min)
Visit: https://purposeful-live-coaching-production.onrender.com
- Try AI Chat → See error message
- Try payment button → See "Price ID not configured"
- **Confirms:** Fixes are deployed

### 2. Add OpenAI Key (2 min)
1. Get key: https://platform.openai.com/api-keys
2. Render → Environment → Add:
   ```
   OPENAI_API_KEY = sk-...
   ```
3. Save → Wait for restart
4. **Test:** AI Chat should work!

### 3. Add Stripe Keys (10 min)
1. Get secret key: https://dashboard.stripe.com/test/apikeys
2. Create 6 products: $29, $149, $299, $800, $1200, $2000
3. Copy each Price ID
4. Render → Environment → Add 7 variables:
   ```
   STRIPE_SECRET_KEY = sk_test_...
   STRIPE_PRICE_AI_BASIC = price_...
   STRIPE_PRICE_AI_PREMIUM = price_...
   STRIPE_PRICE_AI_ELITE = price_...
   STRIPE_PRICE_HUMAN_BASIC = price_...
   STRIPE_PRICE_HUMAN_PREMIUM = price_...
   STRIPE_PRICE_HUMAN_ELITE = price_...
   ```
5. Save → Wait for restart
6. **Test:** Payment buttons should work!

### 4. Test End-to-End (3 min)
- Go to /pricing
- Click "Subscribe"
- Use test card: 4242 4242 4242 4242
- Complete checkout
- **Success:** Platform is revenue-ready! 🎉

---

## Need More Details?
- Full testing guide: `TESTING_CHECKLIST.md`
- Stripe setup: `STRIPE_SETUP_RENDER.md`
- Environment vars: `ENV_VARS_NEEDED.md`
- Technical details: `FIXES_APPLIED.md`

---

## Total Time: 15 minutes
## Result: Revenue-ready platform
