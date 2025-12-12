# Stripe Setup for Render - Quick Guide

**Time needed:** 10 minutes to get payments working

---

## Step 1: Get Your Stripe Secret Key (2 minutes)

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Click "Reveal test key" for the **Secret key**
3. Copy the key (starts with `sk_test_...`)

---

## Step 2: Create Your Products in Stripe (5 minutes)

You need to create 6 products. For each one:

1. Go to: https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**
3. Fill in the details below
4. **COPY THE PRICE ID** (starts with `price_...`)

### Product 1: AI Coaching - Basic
- Name: `AI Coaching - Basic`
- Price: `$29.00` / month (recurring)
- **Copy Price ID →** `price_________________`

### Product 2: AI Coaching - Premium  
- Name: `AI Coaching - Premium`
- Price: `$149.00` / month (recurring)
- **Copy Price ID →** `price_________________`

### Product 3: AI Coaching - Elite
- Name: `AI Coaching - Elite`
- Price: `$299.00` / month (recurring)
- **Copy Price ID →** `price_________________`

### Product 4: Human Coaching - Basic
- Name: `Human Coaching - Basic`
- Price: `$800.00` / month (recurring)
- **Copy Price ID →** `price_________________`

### Product 5: Human Coaching - Premium
- Name: `Human Coaching - Premium`
- Price: `$1,200.00` / month (recurring)
- **Copy Price ID →** `price_________________`

### Product 6: Human Coaching - Elite
- Name: `Human Coaching - Elite`
- Price: `$2,000.00` / month (recurring)
- **Copy Price ID →** `price_________________`

---

## Step 3: Add Environment Variables to Render (3 minutes)

1. Go to your Render dashboard
2. Click on your service: **purposeful-live-coaching-production**
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"** for each of these:

| Variable Name | Value |
|---------------|-------|
| `STRIPE_SECRET_KEY` | sk_test_... (from Step 1) |
| `STRIPE_PRICE_AI_BASIC` | price_... (Product 1) |
| `STRIPE_PRICE_AI_PREMIUM` | price_... (Product 2) |
| `STRIPE_PRICE_AI_ELITE` | price_... (Product 3) |
| `STRIPE_PRICE_HUMAN_BASIC` | price_... (Product 4) |
| `STRIPE_PRICE_HUMAN_PREMIUM` | price_... (Product 5) |
| `STRIPE_PRICE_HUMAN_ELITE` | price_... (Product 6) |

5. Click **"Save Changes"**
6. Render will automatically restart your service

---

## Step 4: Test It! (2 minutes)

1. Wait for Render to finish restarting (watch the logs)
2. Go to: https://purposeful-live-coaching-production.onrender.com/pricing
3. Click **"Subscribe"** on any plan
4. You should see Stripe checkout page!
5. Test with card: `4242 4242 4242 4242`, expiry `12/28`, CVC `123`

---

## ✅ Done!

Your payment buttons will now work. When you're ready for real customers:

1. Activate your Stripe account
2. Create the same products in **live mode**
3. Replace `sk_test_...` with `sk_live_...`
4. Replace test price IDs with live price IDs

---

## Need Help?

If payment buttons still show "Error":
1. Check Render logs for `[createCheckoutSession]` messages
2. Verify all 7 environment variables are set correctly
3. Make sure Price IDs match exactly (no extra spaces)
