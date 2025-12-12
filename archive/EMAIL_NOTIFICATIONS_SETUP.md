# Email Notifications Setup Guide

Your platform now has **automated email notifications** for all subscription events! This guide will help you set up the email delivery service.

---

## What's Already Built ✅

Your platform automatically sends beautiful HTML emails for:

1. **New Subscription** - Welcome email when someone subscribes
2. **Payment Confirmed** - Receipt email after successful payment
3. **Payment Failed** - Alert email when payment fails
4. **Subscription Cancelled** - Goodbye email when someone cancels

All emails are professionally designed with your branding and include:
- Beautiful HTML templates with gradients and colors
- Responsive design (works on mobile and desktop)
- Clear call-to-action buttons
- Professional footer with your contact info

---

## How It Works

### Stripe Webhooks → Your Server → Email Service

1. Customer subscribes/pays/cancels in Stripe
2. Stripe sends webhook event to your server (`/api/webhooks/stripe`)
3. Your server processes the event and updates the database
4. Your server sends email notification to the customer

---

## Setup Options

You have **3 options** for sending emails. Choose the one that fits your needs:

### Option 1: Console Logging (Current - For Testing)

**Status:** ✅ Already working  
**Cost:** Free  
**Best for:** Testing and development

Emails are currently logged to your server console. You can see what emails would be sent without actually sending them.

**No setup needed** - this is already working!

---

### Option 2: SendGrid (Recommended for Production)

**Cost:** Free for 100 emails/day, then $15/month for 40,000 emails  
**Setup time:** 10 minutes  
**Best for:** Production use with professional email delivery

#### Step-by-Step Setup:

1. **Create SendGrid Account**
   - Go to: https://signup.sendgrid.com/
   - Sign up with your email
   - Verify your email address

2. **Create API Key**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: `Purposeful Live Coaching`
   - Permissions: **Full Access**
   - Click "Create & View"
   - **COPY THE API KEY** (you'll only see it once!)

3. **Verify Sender Identity**
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Fill in:
     - From Name: `Purposeful Live Coaching`
     - From Email: `carl@keepyourcontracts.com`
     - Reply To: `carl@keepyourcontracts.com`
   - Check your email and click verification link

4. **Add to Your Platform**
   - Go to your platform Settings → Secrets
   - Add secret:
     - Key: `SENDGRID_API_KEY`
     - Value: (paste your API key from step 2)

5. **Update Email Service Code**
   - See "SendGrid Integration Code" section below

---

### Option 3: Gmail SMTP (Easiest for Small Scale)

**Cost:** Free for up to 500 emails/day  
**Setup time:** 5 minutes  
**Best for:** Small scale, personal use

#### Step-by-Step Setup:

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" → Type: "Purposeful Live"
   - Click "Generate"
   - **COPY THE 16-CHARACTER PASSWORD**

3. **Add to Your Platform**
   - Go to your platform Settings → Secrets
   - Add these secrets:
     - Key: `SMTP_HOST` → Value: `smtp.gmail.com`
     - Key: `SMTP_PORT` → Value: `587`
     - Key: `SMTP_USER` → Value: `carl@keepyourcontracts.com`
     - Key: `SMTP_PASS` → Value: (paste app password from step 2)
     - Key: `SMTP_FROM` → Value: `carl@keepyourcontracts.com`

4. **Update Email Service Code**
   - See "Gmail SMTP Integration Code" section below

---

## Integration Code

### SendGrid Integration

Replace the `sendSubscriptionEmail` function in `/server/services/emailService.ts`:

```typescript
import sgMail from '@sendgrid/mail';
import { ENV } from '../_core/env';

// Initialize SendGrid
if (ENV.sendgridApiKey) {
  sgMail.setApiKey(ENV.sendgridApiKey);
}

export async function sendSubscriptionEmail(params: EmailParams): Promise<void> {
  const { type, to, customerName } = params;

  let subject: string;
  let htmlBody: string;

  // ... (keep existing switch statement for templates)

  // Send email via SendGrid
  if (!ENV.sendgridApiKey) {
    console.log(`[Email] SendGrid not configured, logging to console`);
    console.log(`[Email] To: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    await sgMail.send({
      to: to,
      from: 'carl@keepyourcontracts.com', // Must be verified in SendGrid
      subject: subject,
      html: htmlBody,
    });
    console.log(`[Email] Sent ${type} email to ${to}`);
  } catch (error) {
    console.error(`[Email] Failed to send email:`, error);
  }
}
```

**Install SendGrid:**
```bash
pnpm add @sendgrid/mail
```

**Add to env.ts:**
```typescript
sendgridApiKey: process.env.SENDGRID_API_KEY || "",
```

---

### Gmail SMTP Integration

Replace the `sendSubscriptionEmail` function in `/server/services/emailService.ts`:

```typescript
import nodemailer from 'nodemailer';
import { ENV } from '../_core/env';

// Create SMTP transporter
const transporter = nodemailer.createTransporter({
  host: ENV.smtpHost,
  port: parseInt(ENV.smtpPort || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: ENV.smtpUser,
    pass: ENV.smtpPass,
  },
});

export async function sendSubscriptionEmail(params: EmailParams): Promise<void> {
  const { type, to, customerName } = params;

  let subject: string;
  let htmlBody: string;

  // ... (keep existing switch statement for templates)

  // Send email via SMTP
  if (!ENV.smtpHost || !ENV.smtpUser) {
    console.log(`[Email] SMTP not configured, logging to console`);
    console.log(`[Email] To: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: ENV.smtpFrom || 'carl@keepyourcontracts.com',
      to: to,
      subject: subject,
      html: htmlBody,
    });
    console.log(`[Email] Sent ${type} email to ${to}`);
  } catch (error) {
    console.error(`[Email] Failed to send email:`, error);
  }
}
```

**Install Nodemailer:**
```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

**Add to env.ts:**
```typescript
smtpHost: process.env.SMTP_HOST || "",
smtpPort: process.env.SMTP_PORT || "587",
smtpUser: process.env.SMTP_USER || "",
smtpPass: process.env.SMTP_PASS || "",
smtpFrom: process.env.SMTP_FROM || "",
```

---

## Webhook Setup in Stripe

Once you've chosen an email service, configure Stripe webhooks:

1. **Go to Stripe Dashboard**
   - https://dashboard.stripe.com/webhooks

2. **Add Endpoint**
   - Click "+ Add endpoint"
   - Endpoint URL: `https://your-domain.manus.space/api/webhooks/stripe`
   - Description: `Subscription email notifications`

3. **Select Events**
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`

4. **Get Webhook Secret**
   - After creating, click on the webhook
   - Click "Reveal" under "Signing secret"
   - **COPY THE SECRET** (starts with `whsec_...`)

5. **Add to Platform**
   - Go to Settings → Secrets
   - Add secret:
     - Key: `STRIPE_WEBHOOK_SECRET`
     - Value: (paste webhook secret)

---

## Testing

### Test with Stripe CLI (Recommended)

1. **Install Stripe CLI**
   ```bash
   # Mac
   brew install stripe/stripe-cli/stripe
   
   # Windows
   scoop install stripe
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward Webhooks to Local Server**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Trigger Test Events**
   ```bash
   # Test new subscription
   stripe trigger checkout.session.completed
   
   # Test payment success
   stripe trigger invoice.payment_succeeded
   
   # Test payment failure
   stripe trigger invoice.payment_failed
   ```

5. **Check Console**
   - You should see webhook events in your server console
   - Emails will be logged (or sent if you configured email service)

---

## Email Templates Preview

All emails include:
- **Header:** Gradient background with your branding
- **Body:** Clear, friendly message with customer name
- **Call-to-Action:** Button to dashboard or update payment
- **Footer:** Your contact info and unsubscribe option

### New Subscription Email
- Subject: "Welcome to Purposeful Live Coaching! 🎉"
- Includes: Subscription details, next steps, dashboard link

### Payment Confirmed Email
- Subject: "Payment Confirmed - Purposeful Live Coaching"
- Includes: Amount paid, invoice link, renewal date

### Payment Failed Email
- Subject: "Action Required: Payment Failed"
- Includes: Failure reason, update payment link, deadline

### Subscription Cancelled Email
- Subject: "Subscription Cancelled - We'll Miss You"
- Includes: Cancellation date, feedback request, reactivate link

---

## Troubleshooting

### Emails not sending?

1. **Check webhook is configured**
   - Stripe Dashboard → Webhooks → Verify endpoint URL
   - Check "Signing secret" is added to platform secrets

2. **Check email service is configured**
   - Verify API key or SMTP credentials in platform secrets
   - Check server console for error messages

3. **Test webhook manually**
   - Use Stripe CLI to trigger test events
   - Check server console for webhook logs

### Emails going to spam?

1. **Verify sender identity** (SendGrid)
   - Settings → Sender Authentication
   - Complete domain verification for best deliverability

2. **Use professional domain** (not Gmail)
   - Consider using your own domain: `notifications@purposefullive.com`
   - Set up SPF, DKIM, and DMARC records

---

## Summary

✅ **Already Built:**
- Webhook handler for all subscription events
- Beautiful HTML email templates
- Database updates for subscription tracking
- Console logging for testing

🔧 **You Need To:**
1. Choose email service (SendGrid or Gmail SMTP)
2. Add API key/credentials to platform secrets
3. Update email service code (copy-paste from above)
4. Configure Stripe webhook endpoint
5. Add webhook secret to platform secrets
6. Test with Stripe CLI

**Estimated setup time:** 15-20 minutes

Your customers will receive professional, branded emails for every subscription event! 🎉
