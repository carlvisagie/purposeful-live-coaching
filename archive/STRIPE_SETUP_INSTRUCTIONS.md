# Stripe Setup Instructions - FINAL STEP TO REVENUE

**Time Required:** 15 minutes  
**Result:** Platform is 100% revenue-ready

---

## Overview

Your platform needs 7 Stripe environment variables to process payments:
1. **STRIPE_SECRET_KEY** - Your Stripe API secret key
2. **STRIPE_PRICE_AI_BASIC** - Price ID for $29/month tier
3. **STRIPE_PRICE_AI_PREMIUM** - Price ID for $149/month tier
4. **STRIPE_PRICE_AI_ELITE** - Price ID for $299/month tier
5. **STRIPE_PRICE_HUMAN_BASIC** - Price ID for $800/month tier
6. **STRIPE_PRICE_HUMAN_PREMIUM** - Price ID for $1200/month tier
7. **STRIPE_PRICE_HUMAN_ELITE** - Price ID for $2000/month tier

---

## Step 1: Get Your Stripe Secret Key (2 minutes)

1. **Go to:** https://dashboard.stripe.com/test/apikeys
2. **Click:** "Reveal test key" button
3. **Copy the key** (starts with `sk_test_...`)
4. **Save it somewhere** - you'll need it in Step 3

**Example:** `sk_test_51AbC123dEf456GhI789jKl012MnO345pQr678StU901vWx234Yz567`

---

## Step 2: Create 6 Products in Stripe (10 minutes)

### Product 1: AI Basic ($29/month)
1. **Go to:** https://dashboard.stripe.com/test/products
2. **Click:** "+ Add product"
3. **Fill in:**
   - Name: `AI Basic`
   - Description: `AI-powered coaching with basic features`
   - Pricing model: `Recurring`
   - Price: `$29`
   - Billing period: `Monthly`
4. **Click:** "Save product"
5. **Copy the Price ID** (starts with `price_...`)
6. **Save it** - you'll need it in Step 3

### Product 2: AI Premium ($149/month)
1. **Click:** "+ Add product"
2. **Fill in:**
   - Name: `AI Premium`
   - Description: `AI-powered coaching with premium features`
   - Pricing model: `Recurring`
   - Price: `$149`
   - Billing period: `Monthly`
3. **Click:** "Save product"
4. **Copy the Price ID**
5. **Save it**

### Product 3: AI Elite ($299/month)
1. **Click:** "+ Add product"
2. **Fill in:**
   - Name: `AI Elite`
   - Description: `AI-powered coaching with elite features`
   - Pricing model: `Recurring`
   - Price: `$299`
   - Billing period: `Monthly`
3. **Click:** "Save product"
4. **Copy the Price ID**
5. **Save it**

### Product 4: Human Basic ($800/month)
1. **Click:** "+ Add product"
2. **Fill in:**
   - Name: `Human Basic`
   - Description: `Human coaching with basic features`
   - Pricing model: `Recurring`
   - Price: `$800`
   - Billing period: `Monthly`
3. **Click:** "Save product"
4. **Copy the Price ID**
5. **Save it**

### Product 5: Human Premium ($1200/month)
1. **Click:** "+ Add product"
2. **Fill in:**
   - Name: `Human Premium`
   - Description: `Human coaching with premium features`
   - Pricing model: `Recurring`
   - Price: `$1200`
   - Billing period: `Monthly`
3. **Click:** "Save product"
4. **Copy the Price ID**
5. **Save it**

### Product 6: Human Elite ($2000/month)
1. **Click:** "+ Add product"
2. **Fill in:**
   - Name: `Human Elite`
   - Description: `Human coaching with elite features`
   - Pricing model: `Recurring`
   - Price: `$2000`
   - Billing period: `Monthly`
3. **Click:** "Save product"
4. **Copy the Price ID**
5. **Save it**

---

## Step 3: Add Environment Variables to Render (3 minutes)

1. **Go to:** https://dashboard.render.com
2. **Click:** Your service (`purposeful-live-coaching-production`)
3. **Click:** "Environment" tab (left sidebar)
4. **Click:** "Add Environment Variable" button

### Add These 7 Variables:

**Variable 1:**
- Key: `STRIPE_SECRET_KEY`
- Value: (paste your secret key from Step 1)

**Variable 2:**
- Key: `STRIPE_PRICE_AI_BASIC`
- Value: (paste Price ID from Product 1)

**Variable 3:**
- Key: `STRIPE_PRICE_AI_PREMIUM`
- Value: (paste Price ID from Product 2)

**Variable 4:**
- Key: `STRIPE_PRICE_AI_ELITE`
- Value: (paste Price ID from Product 3)

**Variable 5:**
- Key: `STRIPE_PRICE_HUMAN_BASIC`
- Value: (paste Price ID from Product 4)

**Variable 6:**
- Key: `STRIPE_PRICE_HUMAN_PREMIUM`
- Value: (paste Price ID from Product 5)

**Variable 7:**
- Key: `STRIPE_PRICE_HUMAN_ELITE`
- Value: (paste Price ID from Product 6)

5. **Click:** "Save Changes"
6. **Wait:** Render will automatically restart your service (5-10 minutes)

---

## Step 4: Test Payment Flow (2 minutes)

**After Render restarts:**

1. **Go to:** https://purposeful-live-coaching-production.onrender.com/pricing
2. **Click:** Any "Subscribe" button
3. **Expected:** Stripe checkout page opens
4. **Use test card:** 4242 4242 4242 4242
5. **Expiry:** Any future date
6. **CVC:** Any 3 digits
7. **Click:** "Subscribe"
8. **Expected:** Payment succeeds, redirects to success page

---

## ✅ DONE!

**Your platform is now 100% revenue-ready!**

**What works:**
- ✅ AI Chat (OpenAI billing active)
- ✅ Payment buttons (Stripe configured)
- ✅ Checkout flow (test mode)
- ✅ All features functional

**To go live:**
1. Switch to live Stripe keys (instead of test keys)
2. Update `STRIPE_SECRET_KEY` to start with `sk_live_...`
3. Update all 6 `STRIPE_PRICE_*` variables to live Price IDs
4. Test with real payment
5. **START MAKING MONEY!** 💰

---

## Need Help?

**If payment buttons still show errors:**
- Check Render logs for `[createCheckoutSession]` messages
- Verify all 7 environment variables are set correctly
- Make sure Price IDs match your Stripe products
- Contact support if issues persist

**Common Issues:**
- **"Price ID not configured"** → Environment variable not set or typo
- **"Invalid API key"** → Wrong Stripe secret key or not set
- **"No such price"** → Price ID doesn't exist in your Stripe account
- **"Test mode mismatch"** → Using live key with test prices (or vice versa)

---

**Good luck! You're almost there!** 🚀
