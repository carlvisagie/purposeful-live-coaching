# 🚀 Subscription System Setup Guide

**Status:** Backend complete, frontend complete, ready for database migration and Stripe configuration

---

## ✅ WHAT'S BEEN BUILT (While You Were at Work)

### Backend (100% Complete)
1. **Database Schema** - 3 new tables added to drizzle/schema.ts:
   - `subscriptions` - Tracks user subscriptions (tier, status, billing periods)
   - `usageTracking` - Tracks AI/human session usage per billing period
   - `humanSessionBookings` - Tracks human coaching session bookings
   - Updated `aiChatConversations` - Added subscriptionId field for usage tracking

2. **Subscription Router** (`server/routers/subscriptions.ts`):
   - `getMySubscription` - Get current user's subscription details
   - `createCheckoutSession` - Create Stripe checkout for new subscription
   - `createExtraSessionCheckout` - Purchase extra human sessions ($99)
   - `getCurrentUsage` - Get usage for current billing period
   - `trackAiSession` - Track AI session usage (called automatically)
   - `cancelSubscription` - Cancel subscription at period end
   - `reactivateSubscription` - Reactivate canceled subscription
   - `getPricingTiers` - Public pricing information

3. **Webhook Handler** (`server/routers/subscriptionWebhook.ts`):
   - Handles all Stripe subscription lifecycle events
   - Creates subscriptions when checkout completes
   - Updates subscription status on changes
   - Resets usage tracking on billing period renewal
   - Marks subscriptions as past_due on payment failure

4. **Usage Tracking Integration**:
   - AICoach page automatically tracks usage when user starts conversation
   - Usage resets automatically at start of each billing period

### Frontend (100% Complete)
1. **Pricing Page** (`/pricing`):
   - Beautiful 3-tier pricing display
   - AI-Only ($29/mo), Hybrid ($149/mo), Premium ($299/mo)
   - Feature comparison
   - 7-day free trial messaging
   - FAQ section
   - Stripe checkout integration

2. **Subscription Dashboard** (`/subscription`):
   - Current plan display with status badge
   - Billing amount & next billing date
   - Usage tracking (AI unlimited, human sessions with progress bar)
   - Cancel/reactivate subscription
   - Purchase extra sessions
   - Upgrade CTA for AI-only users

3. **Success Pages**:
   - `/subscription/success` - After subscription purchase
   - `/subscription/session-success` - After extra session purchase

4. **Routes Added to App.tsx**:
   - All subscription pages wired up and ready to use

---

## 🔧 STEP 1: Run Database Migration (5 minutes)

**CRITICAL:** This must be done first before anything else works!

```bash
# Navigate to project directory
cd /home/ubuntu/purposeful-live-coaching

# Run database migration
pnpm db:push
```

**What this does:**
- Creates 3 new tables: subscriptions, usageTracking, humanSessionBookings
- Adds subscriptionId field to aiChatConversations table
- Updates database schema to match code

**Expected output:**
```
✓ Applying changes...
✓ Changes applied successfully
```

**If you see errors:**
- Check DATABASE_URL is set correctly
- Make sure database is accessible
- Check for any conflicting table names

---

## 🔧 STEP 2: Create Stripe Products & Prices (10 minutes)

### Go to Stripe Dashboard
1. Log in to https://dashboard.stripe.com
2. Make sure you're in **LIVE MODE** (toggle in top right)

### Create Product 1: AI Coaching
1. Click **Products** → **Add product**
2. Fill in:
   - **Name:** AI Coaching
   - **Description:** Unlimited 24/7 AI chat sessions with emotion tracking, progress dashboard, and crisis detection
   - **Pricing model:** Recurring
   - **Price:** $29.00 USD
   - **Billing period:** Monthly
   - **Free trial:** 7 days
3. Click **Save product**
4. **COPY THE PRICE ID** (starts with `price_...`) - You'll need this!

### Create Product 2: Hybrid Coaching
1. Click **Products** → **Add product**
2. Fill in:
   - **Name:** Hybrid Coaching
   - **Description:** Everything in AI Coaching PLUS 1 live human coaching session per month
   - **Pricing model:** Recurring
   - **Price:** $149.00 USD
   - **Billing period:** Monthly
   - **Free trial:** 7 days
3. Click **Save product**
4. **COPY THE PRICE ID** (starts with `price_...`)

### Create Product 3: Premium Coaching
1. Click **Products** → **Add product**
2. Fill in:
   - **Name:** Premium Coaching
   - **Description:** Everything in Hybrid Coaching PLUS 4 live human coaching sessions per month
   - **Pricing model:** Recurring
   - **Price:** $299.00 USD
   - **Billing period:** Monthly
   - **Free trial:** 7 days
3. Click **Save product**
4. **COPY THE PRICE ID** (starts with `price_...`)

---

## 🔧 STEP 3: Update Price IDs in Code (2 minutes)

Open `server/routers/subscriptions.ts` and replace the placeholder price IDs:

```typescript
// Around line 15-50, find this section:
const TIER_CONFIG = {
  ai_only: {
    name: "AI Coaching",
    price: 2900,
    humanSessionsIncluded: 0,
    stripePriceId: "price_ai_only_placeholder", // ← REPLACE THIS
    features: [...]
  },
  hybrid: {
    name: "Hybrid Coaching",
    price: 14900,
    humanSessionsIncluded: 1,
    stripePriceId: "price_hybrid_placeholder", // ← REPLACE THIS
    features: [...]
  },
  premium: {
    name: "Premium Coaching",
    price: 29900,
    humanSessionsIncluded: 4,
    stripePriceId: "price_premium_placeholder", // ← REPLACE THIS
    features: [...]
  },
};
```

**Replace with your actual Stripe price IDs:**
```typescript
stripePriceId: "price_1234567890abcdef", // Your real price ID from Stripe
```

---

## 🔧 STEP 4: Configure Stripe Webhook (5 minutes)

### Get Your Webhook URL
Your webhook URL will be:
```
https://[your-render-domain]/api/trpc/subscriptionWebhook.handleWebhook
```

Example: `https://purposeful-live-coaching.onrender.com/api/trpc/subscriptionWebhook.handleWebhook`

### Add Webhook in Stripe Dashboard
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL:** Paste your webhook URL
4. **Events to send:** Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. **COPY THE SIGNING SECRET** (starts with `whsec_...`)

### Add Webhook Secret to Environment Variables

**On Render.com:**
1. Go to your web service dashboard
2. Click **Environment** tab
3. Add new environment variable:
   - **Key:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (your signing secret)
4. Click **Save Changes**
5. Render will automatically redeploy

**Locally (for testing):**
Add to your `.env` file:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔧 STEP 5: Test Subscription Flow (10 minutes)

### Test Signup Flow
1. Go to `/pricing` on your site
2. Click "Start Free Trial" on any tier
3. Fill in test card: `4242 4242 4242 4242`
4. Complete checkout
5. You should be redirected to `/subscription/success`
6. Check `/subscription` dashboard - should show active trial

### Test Usage Tracking
1. Go to `/ai-coach`
2. Start a new conversation
3. Go back to `/subscription` dashboard
4. Should show 1 AI session used

### Test Cancellation
1. On `/subscription` dashboard
2. Click "Cancel Subscription"
3. Confirm cancellation
4. Should show "Scheduled for cancellation" banner
5. Click "Reactivate Subscription"
6. Banner should disappear

### Test Extra Session Purchase (Hybrid/Premium only)
1. Make sure you have Hybrid or Premium subscription
2. On `/subscription` dashboard
3. Click "Buy Extra Session ($99)"
4. Complete checkout
5. Should redirect to `/subscription/session-success`

### Verify Webhook Events
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Check **Recent events** - should see successful deliveries
4. If you see failures, check the error messages

---

## 🔧 STEP 6: Update Homepage (Optional but Recommended)

Currently the homepage (`client/src/pages/IndividualLanding.tsx`) is still showing the old session-based model. You should update it to promote subscriptions:

### Key Changes Needed:
1. **Hero Section:** Change CTA from "Book Session" to "Start Your 7-Day Free Trial"
2. **Pricing Preview:** Show 3 tiers with monthly pricing
3. **Value Proposition:** Emphasize "24/7 AI coaching" as primary benefit
4. **Social Proof:** Update testimonials to mention AI coaching
5. **CTA Buttons:** All should link to `/pricing` instead of `/book-session`

---

## 🔧 STEP 7: Add Subscription Gate (Optional but Recommended)

Currently anyone can access `/ai-coach` without a subscription. You should add a gate:

### Option 1: Soft Gate (Recommended for Launch)
- Allow 3 free AI sessions without subscription
- After 3 sessions, show upgrade prompt
- This lets users try before buying

### Option 2: Hard Gate
- Require active subscription to access AI chat
- Show pricing page if no subscription
- This maximizes revenue but may reduce conversions

**Implementation:** Add check in `AICoach.tsx`:
```typescript
const { data: subscription } = trpc.subscriptions.getMySubscription.useQuery();

if (!subscription || subscription.status !== 'active') {
  return <SubscriptionRequired />;
}
```

---

## 🎯 TESTING CHECKLIST

Before going live, test these scenarios:

### Subscription Lifecycle
- [ ] Sign up for AI-Only tier
- [ ] Verify 7-day trial starts
- [ ] Verify subscription shows in dashboard
- [ ] Cancel subscription
- [ ] Reactivate subscription
- [ ] Let trial expire (or use Stripe test clock)
- [ ] Verify first payment processes

### Usage Tracking
- [ ] Start AI conversation
- [ ] Verify usage increments
- [ ] Check usage resets on new billing period
- [ ] Verify unlimited AI sessions work

### Upgrades & Downgrades
- [ ] Upgrade from AI-Only to Hybrid
- [ ] Verify human session credits added
- [ ] Downgrade from Hybrid to AI-Only
- [ ] Verify human sessions removed

### Extra Sessions
- [ ] Purchase extra session as Hybrid user
- [ ] Verify payment processes
- [ ] Verify session credit added
- [ ] Try to purchase as AI-Only user (should fail)

### Webhook Events
- [ ] Verify checkout.session.completed creates subscription
- [ ] Verify customer.subscription.updated updates status
- [ ] Verify invoice.payment_succeeded resets usage
- [ ] Verify invoice.payment_failed marks as past_due
- [ ] Verify customer.subscription.deleted cancels subscription

---

## 🚨 TROUBLESHOOTING

### "No active subscription found" error
- Check database migration ran successfully
- Verify user has completed checkout
- Check webhook events delivered successfully
- Look for subscription record in database

### Webhook events not delivering
- Verify webhook URL is correct
- Check STRIPE_WEBHOOK_SECRET is set
- Look at Stripe webhook logs for errors
- Make sure endpoint is publicly accessible

### Usage not tracking
- Check aiChatConversations has subscriptionId field
- Verify trackAiSession mutation is being called
- Check usageTracking table has records
- Look for errors in browser console

### Stripe checkout fails
- Verify price IDs are correct
- Check Stripe is in live mode
- Verify STRIPE_SECRET_KEY is set
- Look at Stripe logs for errors

---

## 📊 MONITORING & ANALYTICS

### Key Metrics to Track
1. **Trial Conversion Rate** - % of trials that become paid
2. **Churn Rate** - % of subscribers who cancel
3. **MRR (Monthly Recurring Revenue)** - Total monthly revenue
4. **Average Revenue Per User (ARPU)** - MRR / active subscribers
5. **Tier Distribution** - % of users in each tier
6. **Usage Patterns** - AI sessions per user, human sessions per user

### Where to Find Data
- **Stripe Dashboard:** Revenue, subscriptions, churn
- **Database:** Usage tracking, session counts
- **Your Analytics:** User behavior, conversion funnels

---

## 🎉 YOU'RE DONE!

Once you complete all steps above, your platform will be:
- ✅ Accepting subscription payments
- ✅ Tracking usage automatically
- ✅ Generating recurring revenue 24/7
- ✅ Scaling without human bottleneck

**Next Steps:**
1. Save a checkpoint: `webdev_save_checkpoint`
2. Deploy to production (push to GitHub, Render auto-deploys)
3. Test everything in production
4. Start marketing your AI-first coaching platform!

---

## 💡 REVENUE POTENTIAL

**At 1,000 subscribers (6-month goal):**
- 700 AI-only ($29) = $20,300/mo
- 250 Hybrid ($149) = $37,250/mo
- 50 Premium ($299) = $14,950/mo
- **Total: $72,500/mo MRR**

**At 10,000 subscribers (2-year goal):**
- **Total: $725,000/mo MRR**
- **Your time: Same 225 hours/mo** (AI scales infinitely)

**This is the power of AI-first subscriptions!** 🚀

---

**Questions?** Check todo.md for detailed task breakdown or review the code in:
- `server/routers/subscriptions.ts` - Main subscription logic
- `server/routers/subscriptionWebhook.ts` - Stripe webhook handler
- `client/src/pages/Pricing.tsx` - Pricing page
- `client/src/pages/SubscriptionDashboard.tsx` - Subscription management
