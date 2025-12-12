# Purposeful Live Coaching - Render Deployment Guide

**Status:** Ready for deployment  
**Last Updated:** December 8, 2024

---

## 🎯 What's Been Built

### ✅ Intelligence Foundation (ACTIVATED)
1. **Compliance Engine** (`server/complianceMonitor.ts`)
   - Blocks medical/legal/financial advice
   - Detects harmful content
   - Auto-sanitizes violations

2. **Research Engine** (11 database tables)
   - Platform analytics (bird's eye view)
   - Technique effectiveness tracking
   - Client pattern detection
   - Prediction system (dropout risk, breakthroughs)
   - Feedback loop (coaches rate AI suggestions)

3. **Rich Client Profiles** (50+ auto-extracted fields)
   - Professional, personal, goals, identity
   - Behavioral patterns, health, financial
   - Communication preferences, crisis indicators
   - Profile completeness tracking

4. **AI Extraction Engine** (`server/lib/ai/extraction.ts`)
   - Auto-fills profiles from conversations
   - No forms required - clients just chat
   - Confidence scoring for each field

5. **Coach Dashboard** (`client/src/pages/CoachView.tsx`)
   - Real-time client profiles
   - Active session tracking
   - Conversation history
   - Crisis alerts

---

## 📋 Pre-Deployment Checklist

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub account
- Verify email

### 2. Create MySQL Database on Render
1. Click "New +" → "PostgreSQL" (or use external MySQL provider like PlanetScale)
2. Name: `purposeful-live-coaching-db`
3. Plan: Starter ($7/month) or Free tier for testing
4. Region: Oregon (US West) - closest to your users
5. Copy the **Internal Database URL** (starts with `mysql://`)

### 3. Create Web Service on Render
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Settings:
   - **Name:** `purposeful-live-coaching`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
   - **Plan:** Starter ($7/month) or Free tier

### 4. Configure Environment Variables
Add these in Render dashboard (Environment tab):

```bash
# Database
DATABASE_URL=<your-render-database-url>

# Authentication (Manus OAuth)
VITE_APP_ID=<get-from-manus>
JWT_SECRET=<generate-random-32-char-string>
OAUTH_SERVER_URL=https://oauth.manus.im
OWNER_OPEN_ID=<your-manus-open-id>

# Stripe (get from stripe.com dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (get from resend.com)
RESEND_API_KEY=re_...
OWNER_EMAIL=your@email.com

# AI (if using Manus Forge API)
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=<your-forge-key>

# Production flag
NODE_ENV=production
```

---

## 🗄️ Database Migration

### Step 1: Run Rich Client Profile Migration
After database is created, run this SQL:

```bash
# Connect to your Render database
mysql -h <host> -u <user> -p <database>

# Run the migration
source /path/to/run_full_migration.sql
```

Or use Render's built-in SQL console.

### Step 2: Verify Tables Created
Check that these tables exist:
- `clients` (with 50+ columns)
- `sessionRecordings`
- `sessionSummaries`
- `coachPrivateNotes`
- `platformAnalytics`
- `techniqueEffectiveness`
- `clientPatterns`
- `clientPreferences`
- `clientPredictions`
- `coachFeedback`
- `suggestionEffectiveness`

---

## 🚀 Deployment Steps

### 1. Push Code to GitHub
```bash
cd /home/ubuntu/purposeful-live-coaching
git init
git add .
git commit -m "Initial deployment with intelligence foundation"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy on Render
- Render will auto-deploy when you push to `main`
- Monitor build logs in Render dashboard
- Wait for "Deploy succeeded" message

### 3. Run Database Migrations
- Go to Render database → "Shell" tab
- Paste contents of `run_full_migration.sql`
- Execute

### 4. Create Default Coach Account
```sql
INSERT INTO coaches (name, email, specialties, bio, isActive, createdAt, updatedAt)
VALUES (
  'Your Name',
  'your@email.com',
  'Life Coaching, Stress Management, Career Transition',
  'Helping people find purpose and quit their day jobs',
  'true',
  NOW(),
  NOW()
);
```

---

## 🔧 Post-Deployment Configuration

### 1. Set Up Stripe Products
1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Create 3 products:
   - **AI Coaching:** $29/month
   - **Hybrid:** $149/month  
   - **Premium:** $299/month
3. Copy Price IDs
4. Update `server/routers/subscriptions.ts` with real price IDs

### 2. Configure Stripe Webhook
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.onrender.com/api/subscriptionWebhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret → add to Render env vars

### 3. Test the Platform
1. Visit `https://your-app.onrender.com`
2. Test AI chat (should work without login)
3. Test subscription signup flow
4. Test coach dashboard at `/coach-view`
5. Verify profile extraction is working

---

## 📊 Monitoring & Maintenance

### Check Logs
```bash
# In Render dashboard
Logs tab → View real-time logs
```

### Monitor Database
- Check table row counts
- Monitor query performance
- Set up automated backups

### Monitor AI Costs
- Track OpenAI API usage
- Monitor extraction frequency
- Adjust extraction triggers if needed

---

## 🎯 Revenue Activation

### 1. Enable Payments
- Stripe products created ✓
- Webhook configured ✓
- Test subscription flow ✓

### 2. Marketing
- Update homepage with real pricing
- Add testimonials
- Enable exit-intent popup
- Configure email automation

### 3. Launch
- Announce on social media
- Email existing contacts
- Run ads (optional)

---

## 🆘 Troubleshooting

### Database Connection Fails
- Check DATABASE_URL is correct
- Verify database is running
- Check firewall rules

### AI Extraction Not Working
- Check OpenAI API key
- Verify extraction.ts is imported
- Check console logs for errors

### Stripe Webhook Fails
- Verify webhook secret matches
- Check endpoint URL is correct
- Test with Stripe CLI

---

## 📈 Success Metrics

**Week 1 Goals:**
- [ ] 10 signups
- [ ] $290 MRR
- [ ] 0 critical bugs

**Month 1 Goals:**
- [ ] 100 signups
- [ ] $2,900 MRR
- [ ] 5-star reviews

**Month 3 Goals:**
- [ ] 500 signups
- [ ] $14,500 MRR
- [ ] Profitable (costs < $500/month)

---

## 🎉 You're Ready!

The intelligence foundation is built. The revenue engine is ready. Time to make money! 💰
