# Stripe Setup Checklist - Do This Today!

**Time needed:** 25 minutes  
**Your platform is ready - just connect Stripe!**

---

## ☐ STEP 1: Create Stripe Account (5 minutes)

1. Go to: **https://dashboard.stripe.com/register**
2. Enter email: `carl@keepyourcontracts.com`
3. Create password
4. Click "Create account"
5. Check email and verify
6. When asked for business info:
   - Type: **Individual / Sole proprietor**
   - Tax ID: **Your SSN** (NOT EIN - you don't need one!)

**✓ Done? Check here: ☐**

---

## ☐ STEP 2: Create Product #1 - Essential Plan (2 minutes)

1. Click **"Products"** in left sidebar
2. Click **"+ Add product"**
3. Fill in:
   - Name: `Essential Plan - Individual Coaching`
   - Description: `24/7 AI coaching, emotional tracking, monthly check-in`
4. Click **"Add pricing"**
5. Select: **Recurring**
6. Enter: `$99.00`
7. Select: **Monthly**
8. Click **"Save product"**
9. **COPY THE PRICE ID** (starts with `price_...`) and paste here:

```
STRIPE_PRICE_INDIVIDUAL_STARTER = price_____________________
```

**✓ Done? Check here: ☐**

---

## ☐ STEP 3: Create Product #2 - Growth Plan (2 minutes)

1. Click **"+ Add product"** again
2. Fill in:
   - Name: `Growth Plan - Individual Coaching`
   - Description: `Advanced AI, weekly check-ins, personalized roadmap`
   - Pricing: **Recurring**, `$199.00`, **Monthly**
3. Click **"Save product"**
4. **COPY THE PRICE ID** and paste here:

```
STRIPE_PRICE_INDIVIDUAL_PROFESSIONAL = price_____________________
```

**✓ Done? Check here: ☐**

---

## ☐ STEP 4: Create Product #3 - Transformation Plan (2 minutes)

1. Click **"+ Add product"** again
2. Fill in:
   - Name: `Transformation Plan - Individual Coaching`
   - Description: `Bi-weekly 1-on-1 coaching, custom strategies, direct messaging`
   - Pricing: **Recurring**, `$299.00`, **Monthly**
3. Click **"Save product"**
4. **COPY THE PRICE ID** and paste here:

```
STRIPE_PRICE_INDIVIDUAL_PREMIUM = price_____________________
```

**✓ Done? Check here: ☐**

---

## ☐ STEP 5: Create Product #4 - Enterprise Starter (2 minutes)

1. Click **"+ Add product"** again
2. Fill in:
   - Name: `Enterprise Starter Package`
   - Description: `Up to 50 users with core emotional tracking`
   - Pricing: **Recurring**, `$2,500.00`, **Monthly**
3. Click **"Save product"**
4. **COPY THE PRICE ID** and paste here:

```
STRIPE_PRICE_ENTERPRISE_STARTER = price_____________________
```

**✓ Done? Check here: ☐**

---

## ☐ STEP 6: Create Product #5 - Enterprise Professional (2 minutes)

1. Click **"+ Add product"** again
2. Fill in:
   - Name: `Enterprise Professional Package`
   - Description: `Up to 250 users with advanced analytics and dedicated coach`
   - Pricing: **Recurring**, `$7,500.00`, **Monthly**
3. Click **"Save product"**
4. **COPY THE PRICE ID** and paste here:

```
STRIPE_PRICE_ENTERPRISE_PROFESSIONAL = price_____________________
```

**✓ Done? Check here: ☐**

---

## ☐ STEP 7: Get Your API Keys (2 minutes)

1. Click **"Developers"** in left sidebar
2. Click **"API keys"**
3. You'll see two keys - copy both:

**Publishable key** (starts with `pk_test_...`):
```
STRIPE_PUBLISHABLE_KEY = pk_test_____________________
```

**Secret key** (click "Reveal test key", starts with `sk_test_...`):
```
STRIPE_SECRET_KEY = sk_test_____________________
```

**✓ Done? Check here: ☐**

---

## ☐ STEP 8: Add Keys to Your Platform (5 minutes)

1. Open your platform management dashboard
2. Click **"Settings"** → **"Secrets"**
3. Add these 7 secrets (copy from above):

| Secret Name | Value (from above) |
|-------------|-------------------|
| `STRIPE_SECRET_KEY` | sk_test_... |
| `STRIPE_PUBLISHABLE_KEY` | pk_test_... |
| `STRIPE_PRICE_INDIVIDUAL_STARTER` | price_... (Step 2) |
| `STRIPE_PRICE_INDIVIDUAL_PROFESSIONAL` | price_... (Step 3) |
| `STRIPE_PRICE_INDIVIDUAL_PREMIUM` | price_... (Step 4) |
| `STRIPE_PRICE_ENTERPRISE_STARTER` | price_... (Step 5) |
| `STRIPE_PRICE_ENTERPRISE_PROFESSIONAL` | price_... (Step 6) |

4. Click **"Save"** after each one

**✓ Done? Check here: ☐**

---

## ☐ STEP 9: Test It! (3 minutes)

1. Go to your Individual landing page: `/individual`
2. Click **"Subscribe Now - $99/mo"**
3. You should see Stripe checkout page
4. Use test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
   - ZIP: `12345`
5. Complete payment
6. Check Stripe dashboard → "Payments" - see the test payment!

**✓ Done? Check here: ☐**

---

## 🎉 YOU'RE DONE!

Your platform is now accepting payments! 

### What happens next?

- Test mode = fake payments (for testing)
- When ready for real customers, activate your Stripe account
- Switch to live mode keys (same process, just live keys)

### Need help?

- Stripe support: 1-888-926-2289
- Or message me with questions!

---

## Quick Summary

✅ Create Stripe account (SSN only, no EIN needed)  
✅ Create 5 products ($99, $199, $299, $2,500, $7,500)  
✅ Copy 7 IDs (2 API keys + 5 price IDs)  
✅ Add to platform Settings → Secrets  
✅ Test with card 4242 4242 4242 4242  

**That's it! You're ready to make money! 💰**
