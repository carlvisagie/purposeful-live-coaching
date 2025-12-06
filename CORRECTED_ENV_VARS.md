# Corrected Environment Variables for Render Backend

## ✅ COPY THIS INTO RENDER

```bash
# Database (already set)
DATABASE_URL=postgresql://...

# Security (already set)
JWT_SECRET=your-secret-key

# App Config (already set)
NODE_ENV=production
VITE_APP_TITLE=Purposeful Live Coaching

# Stripe Payments (already set)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# AI Features (ADD THIS)
OPENAI_API_KEY=sk-proj-...

# Mailgun SMTP Email (ADD THESE)
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=postmaster@sandbox.mailgun.org
SMTP_PASSWORD=key-3ax6xnjp29jd6fds4n8a87gdi93fjs29

# Crisis Alerts (ADD THESE)
CRISIS_ALERT_EMAIL=carlhvisagie@yahoo.com
EMERGENCY_CONTACT_PHONE=+18507252089

# File Storage (ADD THESE)
UPLOAD_DIR=/opt/render/project/src/uploads
BASE_URL=https://purposeful-live-backend.onrender.com
```

---

## 📧 Email System Features

Your platform now sends emails for:

1. **Booking Confirmations** - Client receives confirmation with session details
2. **Payment Receipts** - Client receives receipt after payment
3. **Session Reminders** - Client receives reminder 24 hours before session
4. **Coach Notifications** - You receive email when new booking is made
5. **Crisis Alerts** - You receive urgent email if AI detects crisis (suicide, self-harm, etc.)

All emails use your **Mailgun SMTP** credentials.

---

## 🚨 Crisis Alert System

When AI chat detects crisis keywords (suicide, self-harm, etc.), it automatically:
1. Sends urgent email to: `carlhvisagie@yahoo.com`
2. Includes client info, crisis type, and message
3. Shows emergency contact phone: `+18507252089`

---

## ✅ What's Working

- ✅ Zero Manus dependencies
- ✅ Mailgun SMTP email system
- ✅ Crisis alert system
- ✅ Local file storage
- ✅ Stripe payments
- ✅ AI features (with OpenAI key)
- ✅ All 25+ platform features

---

## 🚀 Ready to Deploy

1. Add these env vars to Render
2. Render auto-deploys (already triggered)
3. Test at: https://purposeful-live-backend.onrender.com

**No Manus. No bullshit. Your enterprise platform.**
