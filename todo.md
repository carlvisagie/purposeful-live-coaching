# Purposeful Live Coaching - TODO

## 🚀 AI-FIRST PLATFORM TRANSFORMATION (24/7 Revenue Machine)

**NEW BUSINESS MODEL:** 100% AI-first with subscription billing, instant access, and optional human coaching upgrade

---

### Phase 1: Subscription Architecture ✅ COMPLETE
- [x] Design 3-tier pricing model (AI-only $29, Hybrid $149, Premium $299)
- [x] Create Stripe subscription products (placeholders - need real price IDs)
- [x] Design database schema for subscriptions
- [x] Plan usage tracking system
- [x] Design upgrade/downgrade flows

### Phase 2: Stripe Subscription System ✅ COMPLETE
- [ ] Create Stripe products and prices (MANUAL STEP - do when home)
- [x] Build subscription checkout flow
- [x] Implement webhook handlers (checkout.session.completed, customer.subscription.*, invoice.*)
- [x] Build usage tracking (AI sessions + human sessions per month)
- [x] Add subscription status to user accounts
- [x] Build subscription management dashboard (cancel, reactivate, buy extra sessions)

### Phase 3: Instant AI Access ✅ COMPLETE
- [x] Pricing page built (/pricing)
- [x] Subscription dashboard built (/subscription)
- [x] Success pages created
- [x] AI Coach already provides instant access (no scheduling)
- [x] Usage tracking integrated into AI Coach
- [ ] Rebuild homepage for subscription model (TODO)
- [ ] Add subscription gate to AI chat (require active subscription)

### Phase 4: Subscription Management ✅ COMPLETE
- [x] Build user subscription dashboard (/subscription)
- [x] Add upgrade/downgrade UI (link to /pricing)
- [x] Build usage meter display (AI unlimited, human sessions with progress bar)
- [x] Build subscription cancellation flow (cancel at period end)
- [x] Add reactivation flow
- [ ] Add payment method management (use Stripe billing portal)

### Phase 5: Usage Limits & Escalation
- [ ] Implement session limits per tier
- [ ] Build usage warning system (80% limit reached)
- [ ] Add upgrade prompts when limit reached
- [ ] Build auto-escalation for crisis
- [ ] Add SMS/email alerts for escalations
- [ ] Build human session booking (premium tier only)

### Phase 6: Testing & Launch ⏳ IN PROGRESS
- [ ] **RUN DATABASE MIGRATION** (pnpm db:push) - CRITICAL FIRST STEP
- [ ] Create Stripe products & prices in Stripe Dashboard
- [ ] Update placeholder price IDs in subscriptions.ts
- [ ] Configure Stripe webhook endpoint
- [ ] Test subscription signup flow
- [ ] Test AI session instant access
- [ ] Test usage tracking
- [ ] Test upgrade flows
- [ ] Test webhook events
- [ ] Save production checkpoint
- [ ] Deploy to Render

---

## ✅ COMPLETED (Previous Work)

### Core AI Features (FULLY FUNCTIONAL)
- [x] 24/7 AI Chat Coach (aiChat router)
- [x] Live Session AI Assistant (liveSession router)
- [x] Real-time transcription (Whisper API)
- [x] Emotion detection
- [x] Coaching prompt generation
- [x] Compliance monitoring
- [x] Auto-generated session summaries
- [x] Crisis detection system

### Intelligence System (CODE COMPLETE - Needs Migration)
- [x] 11 database tables designed
- [x] Session recording architecture
- [x] Platform analytics (bird's eye view)
- [x] Individual client intelligence
- [x] Adaptive learning engine
- [x] Pattern detection system
- [ ] **Run database migration** (add-intelligence-tables.sql)

### Core Platform
- [x] Homepage
- [x] Stripe payment integration
- [x] Email notifications
- [x] Database (25+ tables)
- [x] Client dashboard
- [x] Coach dashboard
- [x] Emotion tracking
- [x] Journal system
- [x] Coping strategies

---

## 📋 NEW PRICING MODEL

### Tier 1: AI Coaching - $29/month
**What's Included:**
- Unlimited AI chat sessions (24/7)
- Emotion tracking & insights
- Progress dashboard
- Coping strategies library
- Crisis detection (auto-escalate)
- Email support

**Target:** 70% of users
**Margin:** 95% (AI costs ~$0.50/session)

---

### Tier 2: Hybrid - $149/month
**What's Included:**
- Everything in Tier 1 PLUS
- 1 live human coaching session/month
- Priority support
- Advanced analytics
- Personalized action plans

**Target:** 25% of users
**Margin:** 85% (includes human time)

---

### Tier 3: Premium - $299/month
**What's Included:**
- Everything in Tier 2 PLUS
- 4 live human coaching sessions/month
- Direct SMS access to coach
- Custom coping strategies
- Weekly check-ins

**Target:** 5% of users
**Margin:** 75% (more human time)

---

### Add-Ons:
- Extra human session: $99
- Crisis intervention: Included (auto-escalate to human)

---

## 🎯 REVENUE PROJECTIONS

**Target: 1,000 subscribers in 6 months**

**Monthly Breakdown:**
- 700 AI-only ($29) = $20,300
- 250 Hybrid ($149) = $37,250
- 50 Premium ($299) = $14,950
- **Total Revenue: $72,500/month**

**Monthly Costs:**
- AI (OpenAI): $1,500
- Hosting (Render): $200
- Stripe fees (3%): $2,175
- **Net Profit: $68,625/month** (95% margin)

**Your Time Required:**
- AI-only clients: 0 hours (fully automated)
- Hybrid: 250 sessions × 30 min = 125 hours/month
- Premium: 200 sessions × 30 min = 100 hours/month
- **Total: 225 hours/month** (split with wife = 112 hours each)

**At Scale (10,000 subscribers):**
- Revenue: $725,000/month
- Profit: $686,250/month
- Your time: Same 225 hours/month (AI scales infinitely)

---

## 🔑 KEY CHANGES FROM OLD MODEL

**OLD (Human-First):**
- Client books → Waits for human → Pays per session
- Revenue limited by your time
- Can't scale beyond 40 hours/week
- Max revenue: ~$15,000/month

**NEW (AI-First):**
- Client subscribes → Instant AI access → Optional human upgrade
- Revenue unlimited (AI scales infinitely)
- You only work on premium tiers
- Potential revenue: $725,000/month at scale

---

## 📝 IMPLEMENTATION NOTES

**Phase 1 Priority:** Get subscription billing working
**Phase 2 Priority:** Instant AI access (no scheduling)
**Phase 3 Priority:** Usage tracking & limits
**Phase 4 Priority:** Human session booking (premium only)

**Timeline:** 2-3 days to transform platform
**Goal:** Launch AI-first model, prove it works, scale to 1,000 subscribers

---

## 🚨 CRITICAL SUCCESS FACTORS

1. **AI must work flawlessly** - It's the product now
2. **Onboarding must be instant** - No friction
3. **Value must be obvious** - Show progress immediately
4. **Upgrade path must be clear** - When to add human coaching
5. **Retention must be high** - AI keeps them engaged

---

## 📚 DOCUMENTATION

- [x] AI Coaching Assistant Architecture
- [x] Session Recording Research
- [x] Hardware Setup Guide
- [x] Deployment Checklist
- [ ] Subscription Model Documentation (building now)
- [ ] AI-First Platform Guide (building now)



---

## 🆕 NEW REQUEST: Yearly Subscriptions + Split Payments

### Backend Updates
- [x] Add billingFrequency field to subscriptions table (monthly/yearly)
- [x] Update TIER_CONFIG to include yearly pricing (with 2 months free discount)
- [x] Add split payment configuration for yearly plans
- [x] Update createCheckoutSession to handle monthly vs yearly
- [x] Update webhook handler to track billing frequency

### Frontend Updates
- [x] Add monthly/yearly toggle to pricing page
- [x] Update pricing display to show yearly savings
- [x] Add split payment checkbox for yearly plans
- [x] Update subscription dashboard to show billing frequency
- [ ] Add "Switch to Yearly" upgrade option in dashboard (optional)

### Stripe Configuration
- [ ] Create yearly price IDs for all 3 tiers (MANUAL STEP)
- [x] Configure split payment in Stripe (using Stripe Installments API)
- [ ] Update placeholder price IDs in code (MANUAL STEP)
- [ ] Enable "Installment plans" in Stripe Dashboard settings

### Pricing Structure
- [x] AI-Only: $29/mo or $290/year (save $58 - 17% discount)
- [x] Hybrid: $149/mo or $1,490/year (save $298 - 17% discount)
- [x] Premium: $299/mo or $2,990/year (save $598 - 17% discount)
- [x] Split payment: 3 installments for yearly plans (configurable)
