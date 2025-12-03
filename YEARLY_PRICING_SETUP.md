# 📅 Yearly Pricing & Split Payments Setup Guide

**Status:** Code complete, ready for Stripe configuration

---

## 🎯 What's New

### Pricing Options Added
- **Monthly billing:** $29, $149, $299 per month
- **Yearly billing:** $290, $1,490, $2,990 per year (save 17% - 2 months free)
- **Split payments:** Pay yearly subscriptions in 3 installments (no fees)

### User Experience
- Toggle between monthly/yearly on pricing page
- See yearly savings displayed prominently
- Checkbox to enable split payment for yearly plans
- Subscription dashboard shows billing frequency

---

## 🔧 STEP 1: Create Yearly Stripe Products (15 minutes)

You already created monthly products. Now create yearly versions:

### Go to Stripe Dashboard
1. Log in to https://dashboard.stripe.com
2. Make sure you're in **LIVE MODE**

### Create Yearly Price for AI Coaching
1. Go to **Products** → Find "AI Coaching" product
2. Click **Add another price**
3. Fill in:
   - **Price:** $290.00 USD
   - **Billing period:** Yearly
   - **Free trial:** 7 days
4. Click **Save**
5. **COPY THE PRICE ID** (starts with `price_...`)

### Create Yearly Price for Hybrid Coaching
1. Go to **Products** → Find "Hybrid Coaching" product
2. Click **Add another price**
3. Fill in:
   - **Price:** $1,490.00 USD
   - **Billing period:** Yearly
   - **Free trial:** 7 days
4. Click **Save**
5. **COPY THE PRICE ID**

### Create Yearly Price for Premium Coaching
1. Go to **Products** → Find "Premium Coaching" product
2. Click **Add another price**
3. Fill in:
   - **Price:** $2,990.00 USD
   - **Billing period:** Yearly
   - **Free trial:** 7 days
4. Click **Save**
5. **COPY THE PRICE ID**

---

## 🔧 STEP 2: Update Price IDs in Code (5 minutes)

Open `server/routers/subscriptions.ts` and update the `TIER_CONFIG`:

```typescript
const TIER_CONFIG = {
  ai_only: {
    name: "AI Coaching",
    monthlyPrice: 2900,
    yearlyPrice: 29000,
    humanSessionsIncluded: 0,
    stripePriceId: {
      monthly: "price_XXXXX", // Your monthly price ID
      yearly: "price_YYYYY",  // Your yearly price ID ← ADD THIS
    },
    features: [...]
  },
  hybrid: {
    name: "Hybrid Coaching",
    monthlyPrice: 14900,
    yearlyPrice: 149000,
    humanSessionsIncluded: 1,
    stripePriceId: {
      monthly: "price_XXXXX", // Your monthly price ID
      yearly: "price_YYYYY",  // Your yearly price ID ← ADD THIS
    },
    features: [...]
  },
  premium: {
    name: "Premium Coaching",
    monthlyPrice: 29900,
    yearlyPrice: 299000,
    humanSessionsIncluded: 4,
    stripePriceId: {
      monthly: "price_XXXXX", // Your monthly price ID
      yearly: "price_YYYYY",  // Your yearly price ID ← ADD THIS
    },
    features: [...]
  },
};
```

---

## 🔧 STEP 3: Enable Stripe Installments (5 minutes)

To allow split payments, enable Stripe's installment feature:

### In Stripe Dashboard
1. Go to **Settings** → **Payment methods**
2. Scroll to **Card payments**
3. Find **Installments** section
4. Click **Enable installments**
5. Configure:
   - **Supported countries:** Select your target countries (US, UK, etc.)
   - **Installment plans:** Enable "Fixed count" plans
   - **Default plan:** 3 installments (already configured in code)
6. Click **Save**

**Note:** Stripe Installments is available in select countries. Check [Stripe's documentation](https://stripe.com/docs/payments/installments) for availability.

---

## 🔧 STEP 4: Test Yearly Subscriptions (10 minutes)

### Test Monthly Subscription
1. Go to `/pricing`
2. Make sure "Monthly" tab is selected
3. Click "Start Free Trial" on any tier
4. Complete checkout with test card: `4242 4242 4242 4242`
5. Verify redirected to success page
6. Check subscription dashboard shows "monthly" billing

### Test Yearly Subscription
1. Go to `/pricing`
2. Click "Yearly" tab
3. Notice prices change and savings displayed
4. Click "Start Free Trial" on any tier
5. Complete checkout
6. Verify subscription dashboard shows "yearly" billing

### Test Split Payment
1. Go to `/pricing`
2. Click "Yearly" tab
3. Check "Pay in 3 installments" checkbox
4. Click "Start Free Trial"
5. At Stripe checkout, verify installment option appears
6. Complete checkout
7. In Stripe Dashboard, verify payment plan shows 3 installments

**Important:** Split payment option may only appear for certain card types and countries. Use a test card from a supported country.

---

## 📊 Pricing Comparison

### Monthly vs Yearly Savings

| Tier | Monthly | Yearly | Annual Savings | Discount |
|------|---------|--------|----------------|----------|
| AI-Only | $29/mo | $290/year | $58 | 17% |
| Hybrid | $149/mo | $1,490/year | $298 | 17% |
| Premium | $299/mo | $2,990/year | $598 | 17% |

### Split Payment Example (Premium Tier)

**Without Split Payment:**
- Pay $2,990 upfront

**With Split Payment (3 installments):**
- Payment 1: $996.67 (at checkout)
- Payment 2: $996.67 (30 days later)
- Payment 3: $996.66 (60 days later)
- **Total: $2,990** (no fees!)

---

## 🎯 Revenue Impact

### Monthly Revenue Potential
**At 1,000 subscribers (70% monthly, 30% yearly):**
- 700 monthly subscribers: $72,500/mo
- 300 yearly subscribers: $22,417/mo (amortized)
- **Total MRR: $94,917/mo**

### Yearly Revenue Boost
- **Upfront cash:** Yearly subscribers pay full year upfront (better cash flow)
- **Lower churn:** Yearly subscribers less likely to cancel
- **Higher LTV:** 17% discount still nets more revenue than monthly

### Split Payment Benefits
- **Higher conversions:** Lower barrier to entry for yearly plans
- **Same revenue:** You still get full payment (Stripe handles installments)
- **Lower risk:** Stripe guarantees full payment even if customer defaults

---

## 🚨 TROUBLESHOOTING

### "Installments not available" at checkout
- Check if installments are enabled in Stripe Dashboard
- Verify customer's country supports installments
- Try different test card (some cards don't support installments)

### Yearly price not showing
- Verify yearly price IDs are correct in code
- Check Stripe Dashboard that yearly prices exist
- Clear browser cache and reload pricing page

### Split payment checkbox not working
- Verify `enableSplitPayment` parameter is being passed to backend
- Check Stripe Dashboard installment settings
- Look at browser console for errors

---

## 📝 NEXT STEPS

### Recommended Enhancements
1. **Add "Switch to Yearly" option** in subscription dashboard
   - Let monthly subscribers upgrade to yearly
   - Prorate remaining monthly subscription
   - Apply discount immediately

2. **Show annual savings more prominently**
   - Add badge: "Save $598/year" on Premium tier
   - Highlight yearly as "Best Value"
   - Show monthly equivalent: "$249/mo billed yearly"

3. **Add 6-installment option**
   - Some customers prefer smaller payments
   - Update code to support 3 or 6 installments
   - Let user choose at checkout

4. **Email campaigns**
   - Remind monthly subscribers about yearly savings
   - Send "Save 17%" promotion emails
   - Offer limited-time bonus for yearly upgrades

---

## ✅ DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] Create yearly prices in Stripe Dashboard
- [ ] Update all 6 price IDs in code (3 monthly + 3 yearly)
- [ ] Enable Stripe Installments in Dashboard
- [ ] Test monthly subscription flow
- [ ] Test yearly subscription flow
- [ ] Test split payment flow
- [ ] Verify subscription dashboard shows correct billing frequency
- [ ] Check webhook events deliver correctly
- [ ] Save checkpoint
- [ ] Deploy to production
- [ ] Test in production with real card
- [ ] Monitor for any issues

---

## 💡 MARKETING TIPS

### Promote Yearly Plans
- **Homepage hero:** "Save 17% with yearly billing"
- **Pricing page:** Make yearly the default selection
- **Email footer:** "Upgrade to yearly and save"
- **In-app banner:** Show savings to monthly subscribers

### Highlight Split Payments
- **Pricing page:** "Or pay in 3 installments - no fees"
- **Checkout page:** Stripe shows installment option automatically
- **FAQ:** Explain how split payments work
- **Trust signals:** "Powered by Stripe" badge

### Conversion Tactics
- **Social proof:** "Join 500+ yearly subscribers"
- **Urgency:** "Limited time: Extra month free on yearly"
- **Guarantee:** "Cancel anytime, get prorated refund"
- **Comparison:** Show monthly vs yearly side-by-side

---

**Questions?** Check SUBSCRIPTION_SETUP_GUIDE.md for general setup or review the code in:
- `server/routers/subscriptions.ts` - Pricing configuration
- `client/src/pages/Pricing.tsx` - Pricing page UI
- `drizzle/schema.ts` - Database schema with billingFrequency field
