# Testing Checklist - Dec 10, 2025

## Phase 1: Verify Fixes Are Deployed ✅

### Test AI Chat Error Logging
- [ ] Go to: https://purposeful-live-coaching-production.onrender.com
- [ ] Open AI Chat interface
- [ ] Send a test message
- [ ] Note the error message shown
- [ ] Check Render logs for `[AI Chat Error]` details
- [ ] **Expected:** Clear error message showing root cause

### Test Payment Button Fix
- [ ] Go to: https://purposeful-live-coaching-production.onrender.com/pricing
- [ ] Click "Subscribe" on any plan
- [ ] Note the error message
- [ ] **Expected:** "Price ID not configured for [tier_name]"
- [ ] **Confirms:** Environment variables are needed

---

## Phase 2: Add Environment Variables

### Add OpenAI API Key
- [ ] Go to: https://platform.openai.com/api-keys
- [ ] Copy your API key (starts with `sk-...`)
- [ ] Go to Render → Environment tab
- [ ] Add: `OPENAI_API_KEY` = `sk-...`
- [ ] Save and wait for restart

### Add Stripe Keys
- [ ] Go to: https://dashboard.stripe.com/test/apikeys
- [ ] Copy Secret Key (starts with `sk_test_...`)
- [ ] Add to Render: `STRIPE_SECRET_KEY` = `sk_test_...`

### Create Stripe Products & Add Price IDs
- [ ] Create product: AI Basic ($29/month)
  - Copy Price ID → Add to Render: `STRIPE_PRICE_AI_BASIC`
- [ ] Create product: AI Premium ($149/month)
  - Copy Price ID → Add to Render: `STRIPE_PRICE_AI_PREMIUM`
- [ ] Create product: AI Elite ($299/month)
  - Copy Price ID → Add to Render: `STRIPE_PRICE_AI_ELITE`
- [ ] Create product: Human Basic ($800/month)
  - Copy Price ID → Add to Render: `STRIPE_PRICE_HUMAN_BASIC`
- [ ] Create product: Human Premium ($1200/month)
  - Copy Price ID → Add to Render: `STRIPE_PRICE_HUMAN_PREMIUM`
- [ ] Create product: Human Elite ($2000/month)
  - Copy Price ID → Add to Render: `STRIPE_PRICE_HUMAN_ELITE`

---

## Phase 3: Test End-to-End

### Test AI Chat Works
- [ ] Go to AI Chat interface
- [ ] Send a message
- [ ] **Expected:** AI responds properly
- [ ] **Success:** AI Chat is working!

### Test Payment Flow Works
- [ ] Go to /pricing
- [ ] Click "Subscribe" on any plan
- [ ] **Expected:** Redirects to Stripe checkout page
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete checkout
- [ ] **Expected:** Redirects to success page
- [ ] Check Stripe dashboard for test payment
- [ ] **Success:** Payments are working!

---

## ✅ Platform is Revenue-Ready!

Once all tests pass:
- AI Chat responds to users
- Payment buttons create Stripe checkouts
- Test payments complete successfully
- Platform is ready to accept real customers

**Next:** Switch to live Stripe keys when ready for production
