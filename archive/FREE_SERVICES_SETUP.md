# Free Services Setup Guide - Purposeful Live Coaching

**Last Updated:** November 17, 2025  
**Purpose:** Complete list of free services needed to run the coaching platform

---

## ✅ SERVICES YOU ALREADY HAVE

1. **Calendly** (Free tier) - Client booking and scheduling
2. **Google Docs** (Free) - Document creation and collaboration
3. **Zoom** (Free tier: 40-min meetings) - Video calls with clients
4. **Gmail** (Free) - Email communication

---

## 🆓 FREE SERVICES YOU NEED TO ADD

### 1. STRIPE (Payment Processing)
**Cost:** Free account, 2.9% + $0.30 per transaction  
**Purpose:** Accept payments for coaching packages  
**Setup:**
1. Go to https://stripe.com
2. Click "Start now" (free account)
3. Complete business verification
4. Get your API keys (already integrated in platform)
5. **IMPORTANT:** Claim your test sandbox at: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1U4Ylo1d1VJbUhtWjc4LDE3NjM5NDg3OTcv100AyONk9A0 (expires Jan 16, 2026)

**Status:** ⚠️ REQUIRED - Platform already has Stripe integration

---

### 2. SENDGRID (Email Automation)
**Cost:** Free tier - 100 emails/day  
**Purpose:** Automated client notifications, reminders, and follow-ups  
**Setup:**
1. Go to https://sendgrid.com
2. Sign up for free account
3. Verify your sender email
4. Get API key from Settings → API Keys
5. Add to platform environment variables

**Status:** 🎯 HIGH PRIORITY - Automates client communication

---

### 3. GOOGLE ANALYTICS (Website Tracking)
**Cost:** Free  
**Purpose:** Track website visitors, conversion rates, and marketing performance  
**Setup:**
1. Go to https://analytics.google.com
2. Create account and property
3. Get tracking ID (GA4)
4. Add tracking code to platform

**Status:** 📊 RECOMMENDED - Measure marketing ROI

---

### 4. CANVA (Marketing Materials)
**Cost:** Free tier (Pro is $13/month but not needed yet)  
**Purpose:** Create social media posts, client handouts, presentations  
**Setup:**
1. Go to https://canva.com
2. Sign up with Google account
3. Use free templates for coaching materials

**Status:** 🎨 NICE TO HAVE - Professional marketing materials

---

### 5. MAILCHIMP (Email Marketing)
**Cost:** Free tier - 500 contacts, 1,000 emails/month  
**Purpose:** Newsletter campaigns, lead nurturing, promotional emails  
**Setup:**
1. Go to https://mailchimp.com
2. Sign up for free account
3. Create audience list
4. Design email templates

**Status:** 📧 OPTIONAL - For marketing campaigns (not client communication)

---

### 6. TYPEFORM (Client Intake Forms)
**Cost:** Free tier - 10 questions, 10 responses/month  
**Purpose:** Professional client intake forms and assessments  
**Setup:**
1. Go to https://typeform.com
2. Sign up for free account
3. Create intake questionnaire
4. Embed in website or send link

**Status:** 📝 OPTIONAL - Alternative to Google Forms

---

### 7. NOTION (Organization & Notes)
**Cost:** Free for personal use  
**Purpose:** Client notes, session planning, content calendar  
**Setup:**
1. Go to https://notion.so
2. Sign up with Google account
3. Create workspace for coaching business

**Status:** 📋 OPTIONAL - Alternative to Google Docs

---

### 8. LOOM (Video Messages)
**Cost:** Free tier - 25 videos, 5 min each  
**Purpose:** Send personalized video messages to clients  
**Setup:**
1. Go to https://loom.com
2. Install browser extension
3. Record and share videos

**Status:** 🎥 OPTIONAL - Personalized client communication

---

### 9. ZAPIER (Automation)
**Cost:** Free tier - 100 tasks/month  
**Purpose:** Connect Calendly → Gmail → Google Sheets automatically  
**Setup:**
1. Go to https://zapier.com
2. Sign up for free account
3. Create "Zaps" to automate workflows

**Status:** ⚡ RECOMMENDED - Save time on admin tasks

---

### 10. GOOGLE FORMS (Simple Surveys)
**Cost:** Free  
**Purpose:** Client feedback surveys, assessments  
**Setup:**
1. Go to https://forms.google.com
2. Create forms (already have Google account)
3. Share with clients

**Status:** ✅ ALREADY HAVE - Part of Google Workspace

---

## 🚀 PRIORITY SETUP ORDER

### WEEK 1 (Essential for Launch)
1. ✅ **Stripe** - Accept payments immediately
2. ✅ **SendGrid** - Automate client emails
3. ✅ **Google Analytics** - Track website performance

### WEEK 2 (Improve Operations)
4. **Zapier** - Automate booking → email workflows
5. **Canva** - Create professional marketing materials

### WEEK 3+ (Scale & Optimize)
6. **Mailchimp** - Build email list for marketing
7. **Typeform** - Professional intake forms
8. **Loom** - Personalized video messages

---

## 💰 COST SUMMARY

**Monthly Cost (All Free Tiers):** $0  
**Transaction Fees (Stripe):** 2.9% + $0.30 per payment  

**Example Revenue Math:**
- Client pays $2,500/month
- Stripe fee: $72.80
- You receive: $2,427.20
- **Net profit margin: 97.1%**

---

## 🔐 SECURITY BEST PRACTICES

1. **Use Strong Passwords:** Unique password for each service
2. **Enable 2FA:** Two-factor authentication on all accounts
3. **Don't Share API Keys:** Keep in environment variables only
4. **Review Permissions:** Only grant necessary access
5. **Monitor Activity:** Check for unauthorized logins weekly

---

## 📞 SUPPORT RESOURCES

- **Stripe Support:** https://support.stripe.com
- **SendGrid Support:** https://support.sendgrid.com
- **Google Analytics Help:** https://support.google.com/analytics
- **Calendly Help:** https://help.calendly.com
- **Zoom Support:** https://support.zoom.us

---

## ✅ SETUP CHECKLIST

- [ ] Claim Stripe test sandbox (expires Jan 16, 2026)
- [ ] Create Stripe production account
- [ ] Sign up for SendGrid (free tier)
- [ ] Set up Google Analytics tracking
- [ ] Create Canva account for marketing
- [ ] Configure Zapier automation (Calendly → Gmail)
- [ ] Test email notifications with SendGrid
- [ ] Verify Stripe payment flow with test card
- [ ] Add Google Analytics to platform
- [ ] Create first marketing materials in Canva

---

## 🎯 NEXT STEPS AFTER SETUP

1. **Test Complete Workflow:**
   - Client books on Calendly
   - Zapier sends confirmation email
   - Client pays via Stripe
   - SendGrid sends welcome email
   - You receive notification

2. **Create Marketing Assets:**
   - Social media graphics (Canva)
   - Email templates (SendGrid)
   - Client intake form (TypeForm/Google Forms)

3. **Monitor Performance:**
   - Track conversions (Google Analytics)
   - Review payment success rate (Stripe)
   - Check email open rates (SendGrid)

---

**Questions?** All these services have excellent documentation and free support for basic accounts.
