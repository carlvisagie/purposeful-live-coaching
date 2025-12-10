# 📧 Email Notifications Setup Guide

**Date:** December 10, 2025  
**Status:** Email service implemented, needs SMTP configuration

---

## ✅ WHAT'S BEEN IMPLEMENTED

### Email Templates Created:
1. **Welcome Email** - Sent on user signup
2. **Session Confirmation** - Sent when session is booked/rescheduled
3. **Payment Receipt** - Sent after successful payment
4. **Crisis Alert** - Sent to coaches when AI detects crisis
5. **Weekly Progress Report** - Sent to clients with their stats

### Features:
- ✅ Professional HTML email templates
- ✅ Responsive design
- ✅ Brand colors and styling
- ✅ Call-to-action buttons
- ✅ Plain text fallback
- ✅ Error handling

---

## 🔧 SETUP REQUIRED

To enable email notifications, you need to add SMTP credentials to Render environment variables.

### Option 1: Gmail (Recommended for Testing)

1. **Create App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Purposeful Coaching"
   - Copy the 16-character password

2. **Add to Render:**
   - Go to Render Dashboard → purposeful-live-coaching-production
   - Settings → Environment
   - Add these variables:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=Purposeful Live Coaching
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Create SendGrid Account:**
   - Sign up at https://sendgrid.com
   - Free tier: 100 emails/day
   - Verify your sender email

2. **Get API Key:**
   - Go to Settings → API Keys
   - Create new API key with "Mail Send" permission
   - Copy the key

3. **Add to Render:**
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   FROM_EMAIL=verified-email@yourdomain.com
   FROM_NAME=Purposeful Live Coaching
   ```

### Option 3: Resend (Modern Alternative)

1. **Create Resend Account:**
   - Sign up at https://resend.com
   - Free tier: 100 emails/day, 3,000/month
   - Very developer-friendly

2. **Get API Key:**
   - Go to API Keys → Create API Key
   - Copy the key

3. **Add to Render:**
   ```
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=resend
   SMTP_PASS=your-resend-api-key
   FROM_EMAIL=onboarding@resend.dev
   FROM_NAME=Purposeful Live Coaching
   ```

---

## 🎯 HOW TO INTEGRATE

### 1. Welcome Email (User Signup)

Add to your signup handler:

```typescript
import { emailService } from "../lib/email";

// After user is created
await emailService.sendWelcomeEmail({
  to: user.email,
  name: user.name,
});
```

### 2. Session Confirmation (Booking)

Add to session booking handler:

```typescript
// After session is booked
await emailService.sendSessionConfirmationEmail({
  to: client.email,
  name: client.name,
  sessionDate: session.scheduledDate,
  sessionType: session.sessionType,
  duration: session.duration,
  coachName: coach.name,
});
```

### 3. Payment Receipt (Stripe Webhook)

Add to Stripe payment success handler:

```typescript
// After payment succeeds
await emailService.sendPaymentReceiptEmail({
  to: user.email,
  name: user.name,
  amount: paymentIntent.amount, // in cents
  description: "Coaching Session",
  receiptUrl: paymentIntent.charges.data[0].receipt_url,
});
```

### 4. Crisis Alert (AI Detection)

Add to AI chat handler when crisis is detected:

```typescript
// When AI detects crisis keywords
await emailService.sendCrisisAlertEmail({
  to: coach.email,
  clientName: client.name,
  message: aiMessage.content,
  severity: "high",
  dashboardUrl: `${process.env.FRONTEND_URL}/coach/clients/${client.id}`,
});
```

### 5. Weekly Progress Report (Cron Job)

Create a weekly cron job:

```typescript
// Run every Sunday at 9 AM
await emailService.sendWeeklyProgressEmail({
  to: user.email,
  name: user.name,
  weekStart: new Date(/* start of week */),
  weekEnd: new Date(/* end of week */),
  stats: {
    sessionsCompleted: 2,
    aiConversations: 15,
    journalEntries: 7,
    moodAverage: 7.5,
    goalsAchieved: 3,
  },
});
```

---

## 🧪 TESTING

### Test Email Sending:

```bash
# Create a test script
cat > server/test-email.ts << 'EOF'
import { emailService } from "./lib/email";

async function test() {
  const result = await emailService.sendWelcomeEmail({
    to: "your-email@example.com",
    name: "Test User",
  });
  console.log("Email sent:", result);
}

test();
EOF

# Run it
pnpm tsx server/test-email.ts
```

---

## 📊 EMAIL LIMITS

| Provider | Free Tier | Cost |
|----------|-----------|------|
| Gmail | 500/day | Free |
| SendGrid | 100/day | Free, then $15/mo for 40k |
| Resend | 100/day, 3k/month | Free, then $20/mo for 50k |
| Mailgun | 100/day | Free, then $35/mo for 50k |

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Choose email provider (Gmail/SendGrid/Resend)
- [ ] Get SMTP credentials
- [ ] Add environment variables to Render
- [ ] Restart Render service
- [ ] Test welcome email
- [ ] Integrate into signup flow
- [ ] Integrate into booking flow
- [ ] Integrate into payment flow
- [ ] Set up crisis alert integration
- [ ] (Optional) Set up weekly progress reports

---

## 🎯 PRIORITY

**Recommended Order:**
1. **Welcome Email** - Immediate user engagement (HIGH)
2. **Session Confirmation** - Critical for bookings (HIGH)
3. **Payment Receipt** - Legal requirement (HIGH)
4. **Crisis Alert** - Safety feature (MEDIUM)
5. **Weekly Progress** - Engagement feature (LOW)

---

## 📝 NOTES

- Email service is already implemented in `server/lib/email.ts`
- All templates are production-ready
- Just needs SMTP configuration to work
- Can be tested locally with Gmail app password
- Estimated setup time: **15-30 minutes**

---

## ✅ NEXT STEPS

1. Choose your email provider
2. Get credentials
3. Add to Render environment variables
4. Restart service
5. Test with welcome email
6. Integrate into application flows

**Email notifications are ready to go - just add SMTP config!** 📧
