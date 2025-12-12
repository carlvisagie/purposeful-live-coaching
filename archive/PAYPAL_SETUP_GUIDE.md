# PayPal Integration Setup Guide

**Platform:** Purposeful Live Coaching  
**PayPal Business Account:** carl@keepyourcontracts.com  
**Status:** Code integrated, awaiting PayPal button configuration

---

## Overview

Your platform now has **full PayPal integration** for both Individual (B2C) and Enterprise (B2B) payment processing. The code is production-ready and waiting for your PayPal subscription and payment button URLs.

### What's Already Done ✅

1. **Individual Landing Page** (`/individual`):
   - 3 subscription buttons: $99/mo, $199/mo, $299/mo
   - "Subscribe with PayPal" buttons integrated
   - Secure payment messaging

2. **Enterprise Landing Page** (`/`):
   - 2 buy now buttons: $2,500/mo, $7,500/mo
   - "Pay with PayPal" buttons integrated
   - Custom pricing option still uses Calendly

3. **PayPal Configuration File**:
   - Located at: `client/src/config/paypal.ts`
   - Smart fallback to Calendly until buttons configured
   - Console warnings to help with setup

---

## Step-by-Step Setup Instructions

### Part 1: Create PayPal Subscription Buttons (Individual Plans)

These are for **recurring monthly subscriptions** on the Individual landing page.

#### 1. Log in to PayPal Business Account
- Go to: https://www.paypal.com/businessmanage/
- Sign in with: carl@keepyourcontracts.com

#### 2. Navigate to Subscriptions
- Click **"Products & Services"** in left sidebar
- Click **"Subscriptions"**
- Click **"Create Subscription Button"** or **"Create Plan"**

#### 3. Create Starter Plan ($99/month)
- **Plan Name:** Emotional Resilience Coaching - Starter
- **Plan Description:** 24/7 AI coaching access, emotional pattern tracking, basic trigger detection, monthly coach check-in, crisis support resources
- **Billing Cycle:** Monthly
- **Price:** $99 USD
- **Trial Period:** None (or add 7-day free trial if desired)
- Click **"Create Plan"**

#### 4. Get Starter Plan URL
After creating the plan, PayPal will show you a **Plan ID** (looks like: `P-XXXXXXXXXXXXXXXXXXXX`)

Your subscription URL will be:
```
https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-XXXXXXXXXXXXXXXXXXXX
```

**Copy this entire URL** - you'll need it in Step 7.

#### 5. Create Professional Plan ($199/month)
Repeat the process:
- **Plan Name:** Emotional Resilience Coaching - Professional
- **Plan Description:** Everything in Starter, plus: Advanced AI pattern analysis, weekly coach check-ins, personalized 30-day roadmap, priority crisis response, progress tracking dashboard
- **Billing Cycle:** Monthly
- **Price:** $199 USD
- **Copy the subscription URL**

#### 6. Create Premium Plan ($299/month)
Repeat the process:
- **Plan Name:** Emotional Resilience Coaching - Premium
- **Plan Description:** Everything in Professional, plus: Bi-weekly 1-on-1 coaching calls, custom resilience strategies, family/partner support resources, direct coach messaging, lifetime access to materials
- **Billing Cycle:** Monthly
- **Price:** $299 USD
- **Copy the subscription URL**

#### 7. Update Your Code
Open the file: `client/src/config/paypal.ts`

Find this section:
```typescript
const PAYPAL_SUBSCRIPTION_URLS = {
  starter: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=STARTER_PLAN_ID_HERE',
  professional: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=PROFESSIONAL_PLAN_ID_HERE',
  premium: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=PREMIUM_PLAN_ID_HERE',
};
```

Replace the placeholder URLs with your actual PayPal subscription URLs:
```typescript
const PAYPAL_SUBSCRIPTION_URLS = {
  starter: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-YOUR-ACTUAL-STARTER-PLAN-ID',
  professional: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-YOUR-ACTUAL-PRO-PLAN-ID',
  premium: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-YOUR-ACTUAL-PREMIUM-PLAN-ID',
};
```

---

### Part 2: Create PayPal Buy Now Buttons (Enterprise Plans)

These are for **one-time or custom payments** on the Enterprise landing page.

#### 1. Navigate to Buy Now Buttons
- In PayPal dashboard, go to **"Products & Services"**
- Click **"Buy Now Buttons"**
- Click **"Create Buy Now Button"**

#### 2. Create Enterprise Starter Button ($2,500)
- **Button Type:** Buy Now
- **Item Name:** Enterprise Starter Package - Monthly Service
- **Price:** $2,500 USD
- **Currency:** USD
- **Customization Options:**
  - Allow buyer to change quantity: **No**
  - Add drop-down menu: **No** (unless you want to offer options)
- **Shipping:** No shipping
- **Tax:** No tax (unless required)
- Click **"Create Button"**

#### 3. Get Button URL
PayPal will generate a button. Look for the **hosted button URL** or **button link**.

It will look like:
```
https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=XXXXXXXXXX
```

**Copy this URL** - you'll need it in Step 6.

#### 4. Create Enterprise Professional Button ($7,500)
Repeat the process:
- **Item Name:** Enterprise Professional Package - Monthly Service
- **Price:** $7,500 USD
- **Copy the button URL**

#### 5. (Optional) Create Custom Enterprise Button
For custom pricing deals:
- **Item Name:** Enterprise Custom Package
- **Price:** Leave blank or set to $10,000 (you can adjust per deal)
- **Copy the button URL**

#### 6. Update Your Code
Open the file: `client/src/config/paypal.ts`

Find this section:
```typescript
const PAYPAL_BUYNOW_URLS = {
  starter: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ENTERPRISE_STARTER_BUTTON_ID',
  professional: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ENTERPRISE_PRO_BUTTON_ID',
  enterprise: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ENTERPRISE_CUSTOM_BUTTON_ID',
};
```

Replace with your actual button URLs:
```typescript
const PAYPAL_BUYNOW_URLS = {
  starter: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YOUR_ACTUAL_STARTER_BUTTON_ID',
  professional: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YOUR_ACTUAL_PRO_BUTTON_ID',
  enterprise: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YOUR_ACTUAL_CUSTOM_BUTTON_ID',
};
```

---

## Testing Your PayPal Integration

### Before Going Live

1. **Test in Sandbox Mode** (Recommended):
   - PayPal offers a sandbox environment for testing
   - Go to: https://developer.paypal.com/
   - Create sandbox accounts (test buyer and test seller)
   - Test all subscription and payment flows

2. **Test with Small Amounts**:
   - Create a test subscription button with $1/month
   - Subscribe yourself to verify the flow works
   - Cancel the test subscription immediately

### What to Test

✅ **Individual Landing Page** (`/individual`):
- Click "Subscribe with PayPal - $99/mo" → Should open PayPal subscription page
- Click "Subscribe with PayPal - $199/mo" → Should open PayPal subscription page
- Click "Subscribe with PayPal - $299/mo" → Should open PayPal subscription page

✅ **Enterprise Landing Page** (`/`):
- Click "Pay with PayPal" on Starter package → Should open PayPal payment page for $2,500
- Click "Pay with PayPal" on Professional package → Should open PayPal payment page for $7,500
- Click "Contact Sales" on Enterprise package → Should open Calendly

### Expected User Flow

1. User clicks "Subscribe with PayPal" or "Pay with PayPal"
2. New tab opens with PayPal payment page
3. User logs into PayPal or pays as guest
4. User completes payment
5. PayPal redirects to success page (you can configure this in PayPal settings)
6. User receives email confirmation from PayPal

---

## Managing Subscriptions

### View Active Subscriptions
- Log in to PayPal Business account
- Go to **"Activity"** → **"Subscriptions"**
- See all active, cancelled, and expired subscriptions

### Cancel a Subscription
- Find the subscription in your PayPal dashboard
- Click **"Cancel Subscription"**
- Customer will be notified automatically

### Refund a Payment
- Go to **"Activity"** → **"All Transactions"**
- Find the payment
- Click **"Issue Refund"**
- Enter refund amount (full or partial)

---

## Important Notes

### Subscription Management
- **PayPal handles all recurring billing automatically**
- Customers can cancel their own subscriptions from their PayPal account
- You'll receive email notifications for new subscriptions, cancellations, and failed payments

### Failed Payments
- PayPal will automatically retry failed payments
- You'll be notified if a subscription payment fails
- Customer will be notified to update their payment method

### Tax Considerations
- PayPal can automatically calculate and collect sales tax if configured
- Consult with your accountant about tax requirements
- You may need to enable tax collection in PayPal settings

### EIN Not Required
- PayPal Business accounts do NOT require an EIN initially
- You can operate with your SSN (Social Security Number)
- You'll need to provide tax information when you reach $20,000 in sales or 200 transactions
- This is why we chose PayPal over Stripe (Stripe requires EIN immediately)

---

## Troubleshooting

### Buttons Not Working?

**Check 1:** Did you update `client/src/config/paypal.ts` with your actual PayPal URLs?
- Open the file and verify no placeholder text remains

**Check 2:** Are the PayPal URLs correct?
- Test the URLs directly in your browser
- They should open PayPal payment pages

**Check 3:** Check browser console for errors
- Right-click on page → "Inspect" → "Console" tab
- Look for PayPal-related warnings or errors

### Customers Can't Complete Payment?

**Check 1:** Is your PayPal Business account verified?
- Log in to PayPal
- Complete any verification steps requested

**Check 2:** Are there spending limits on your account?
- New PayPal accounts may have receiving limits
- Verify your account to remove limits

**Check 3:** Is the subscription plan active?
- Check PayPal dashboard → Subscriptions
- Ensure plans are "Active" not "Inactive"

### Fallback to Calendly

Until you configure PayPal buttons, the platform will **automatically fall back to Calendly** booking. This ensures:
- No broken buttons for users
- You can still book strategy calls
- Platform remains functional while you set up PayPal

---

## Next Steps After Setup

1. **Test all payment flows** (both Individual and Enterprise)
2. **Set up PayPal email notifications** for new subscriptions
3. **Configure success/cancel redirect URLs** in PayPal settings
4. **Add payment confirmation page** to your platform (optional)
5. **Set up accounting integration** (QuickBooks, Xero, etc.)
6. **Monitor first few transactions** to ensure everything works

---

## Support Resources

### PayPal Help
- **PayPal Help Center:** https://www.paypal.com/us/smarthelp/home
- **PayPal Phone Support:** 1-888-221-1161 (US)
- **PayPal Developer Docs:** https://developer.paypal.com/docs/

### Platform Support
- **Configuration File:** `/home/ubuntu/purposeful-live-coaching/client/src/config/paypal.ts`
- **Individual Landing Page:** `/home/ubuntu/purposeful-live-coaching/client/src/pages/Individual.tsx`
- **Enterprise Landing Page:** `/home/ubuntu/purposeful-live-coaching/client/src/pages/Landing.tsx`

---

## Quick Reference

### Individual Plans (Subscriptions)
| Plan | Price | Button Location |
|------|-------|----------------|
| Starter | $99/mo | Individual landing page |
| Professional | $199/mo | Individual landing page |
| Premium | $299/mo | Individual landing page |

### Enterprise Plans (One-Time/Custom)
| Plan | Price | Button Location |
|------|-------|----------------|
| Starter | $2,500/mo | Enterprise landing page |
| Professional | $7,500/mo | Enterprise landing page |
| Enterprise | Custom | Calendly (strategy call) |

---

## Summary

✅ **Code is ready** - All PayPal integration is complete  
✅ **Buttons are integrated** - Both landing pages have payment buttons  
✅ **Fallback works** - Calendly booking until PayPal configured  
✅ **Testing ready** - Platform ready for payment testing  

**Your only task:** Create PayPal buttons and update the URLs in `client/src/config/paypal.ts`

**Estimated setup time:** 30-45 minutes

Once you complete the PayPal button setup, your platform will be **100% ready for revenue generation** with both Individual and Enterprise clients! 🚀
