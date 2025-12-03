# AI-First Subscription Model Architecture

## Executive Summary

Transforming from human-coaching-first to 100% AI-first platform with subscription billing, instant access, and optional human coaching upgrades for 24/7 automated revenue generation.

---

## Business Model Transformation

### Before (Human-First)
```
Client → Books Session → Waits for Availability → Pays $49-149 → Human Coaching
```

**Limitations:**
- Revenue capped by coach availability
- Can't scale beyond 40 hours/week
- Max ~30 clients/week = $15,000/month
- High customer acquisition cost (CAC)
- Long sales cycle (scheduling friction)

### After (AI-First)
```
Client → Subscribes $29-299/month → Instant AI Access → Optional Human Upgrade
```

**Advantages:**
- Unlimited scale (AI handles 90% of interactions)
- 24/7 revenue generation
- 1,000+ clients possible with same infrastructure
- Low CAC (instant value, no scheduling)
- Recurring revenue (predictable cash flow)
- 95% profit margin on AI-only tier

---

## Pricing Tiers

### Tier 1: AI Coaching ($29/month)

**Target Audience:** Budget-conscious, self-directed individuals

**What's Included:**
- Unlimited 24/7 AI chat sessions
- Real-time emotion tracking
- Progress dashboard with insights
- Coping strategies library (personalized)
- Crisis detection with auto-escalation
- Email support (24-hour response)
- Mobile app access

**Usage Limits:** None (unlimited AI sessions)

**Value Proposition:** "Your personal AI coach, available 24/7, for less than a single therapy session"

**Conversion Strategy:**
- 7-day free trial
- No credit card required for trial
- Upgrade prompts after 5 AI sessions
- Show progress to demonstrate value

**Churn Prevention:**
- Weekly progress emails
- Milestone celebrations
- Streak tracking (consecutive days)
- Community features (optional)

---

### Tier 2: Hybrid ($149/month)

**Target Audience:** Serious about growth, want human connection

**What's Included:**
- Everything in Tier 1 PLUS
- 1 live human coaching session/month (30 min)
- Priority email support (12-hour response)
- Advanced analytics & insights
- Personalized action plans
- Session recordings & transcripts
- Direct booking link (no waiting)

**Usage Limits:** 1 human session/month (additional $99 each)

**Value Proposition:** "AI coaching 24/7 + expert human guidance when you need it most"

**Conversion Strategy:**
- Upgrade prompt after 30 days on AI-only
- "Book your first human session" CTA
- Show AI insights: "Here's what we learned about you"
- Warm handoff (AI briefs coach before session)

**Churn Prevention:**
- Monthly check-in emails
- Pre-session AI briefing (shows value)
- Post-session follow-up
- Quarterly progress reports

---

### Tier 3: Premium ($299/month)

**Target Audience:** High-performers, executives, serious transformation

**What's Included:**
- Everything in Tier 2 PLUS
- 4 live human coaching sessions/month (30 min each)
- Direct SMS access to coach
- Priority scheduling (24-hour booking)
- Custom coping strategies (tailored by coach)
- Weekly check-in messages
- Quarterly deep-dive reviews

**Usage Limits:** 4 human sessions/month (additional $99 each)

**Value Proposition:** "Comprehensive AI + human coaching for serious transformation"

**Conversion Strategy:**
- Invite-only (after 3 months on Hybrid)
- "You're ready for the next level" message
- Show transformation metrics
- Emphasize exclusivity

**Churn Prevention:**
- White-glove service
- Personalized attention
- Quarterly goal-setting sessions
- Annual transformation report

---

## Add-Ons & Upsells

### Extra Human Session: $99
- Available to Hybrid & Premium tiers
- Book anytime (subject to availability)
- Same quality as included sessions

### Crisis Intervention: Included
- Auto-escalation when AI detects crisis
- Coach notified within 15 minutes
- Emergency resources provided immediately
- Follow-up within 24 hours
- No additional charge (builds trust)

### Couples Coaching: $199/session
- Joint sessions with partner
- Relationship-focused AI insights
- Shared progress dashboard
- Available as add-on to any tier

---

## Technical Architecture

### Database Schema Changes

**New Tables:**

```sql
-- Subscriptions
CREATE TABLE subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  stripeSubscriptionId VARCHAR(255) UNIQUE NOT NULL,
  stripePriceId VARCHAR(255) NOT NULL,
  tier ENUM('ai_only', 'hybrid', 'premium') NOT NULL,
  status ENUM('active', 'canceled', 'past_due', 'unpaid') NOT NULL,
  currentPeriodStart TIMESTAMP NOT NULL,
  currentPeriodEnd TIMESTAMP NOT NULL,
  cancelAtPeriodEnd BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Usage Tracking
CREATE TABLE usageTracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subscriptionId INT NOT NULL,
  userId INT NOT NULL,
  periodStart TIMESTAMP NOT NULL,
  periodEnd TIMESTAMP NOT NULL,
  aiSessionsUsed INT DEFAULT 0,
  humanSessionsUsed INT DEFAULT 0,
  humanSessionsIncluded INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subscriptionId) REFERENCES subscriptions(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Human Session Bookings (Premium Tier)
CREATE TABLE humanSessionBookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  coachId INT NOT NULL,
  subscriptionId INT NOT NULL,
  sessionDate TIMESTAMP NOT NULL,
  duration INT NOT NULL DEFAULT 30,
  status ENUM('scheduled', 'completed', 'canceled', 'no_show') NOT NULL,
  zoomLink TEXT,
  aiPreSessionBrief TEXT, -- AI generates brief for coach
  coachNotes TEXT,
  recordingUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (coachId) REFERENCES coaches(id),
  FOREIGN KEY (subscriptionId) REFERENCES subscriptions(id)
);
```

---

### Stripe Integration

**Products to Create:**

1. **AI Coaching ($29/month)**
   - Product ID: `prod_ai_coaching`
   - Price ID: `price_ai_monthly`
   - Recurring: monthly
   - Trial: 7 days

2. **Hybrid Coaching ($149/month)**
   - Product ID: `prod_hybrid_coaching`
   - Price ID: `price_hybrid_monthly`
   - Recurring: monthly
   - Trial: 7 days

3. **Premium Coaching ($299/month)**
   - Product ID: `prod_premium_coaching`
   - Price ID: `price_premium_monthly`
   - Recurring: monthly
   - Trial: none (invite-only)

4. **Extra Human Session ($99)**
   - Product ID: `prod_extra_session`
   - Price ID: `price_extra_session`
   - One-time payment

**Webhooks to Handle:**

- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Upgrade/downgrade
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Successful payment
- `invoice.payment_failed` - Failed payment
- `customer.subscription.trial_will_end` - Trial ending soon

---

### User Flow Changes

**Old Flow:**
```
Homepage → Pricing → Book Session → Calendly → Payment → Confirmation
```

**New Flow:**
```
Homepage → Pricing → Choose Tier → Sign Up (7-day trial) → Instant AI Access
```

**Onboarding Flow:**
```
1. Sign up (email + password)
2. Choose subscription tier
3. Enter payment info (trial starts immediately)
4. Quick onboarding survey (3 questions)
5. Launch first AI session (instant)
6. Show progress dashboard
7. Upgrade prompt (after 5 sessions)
```

---

### AI Session Flow

**Old:** Client books → Waits for human → Gets session

**New:** Client clicks "Start Session" → AI responds immediately

**Implementation:**

1. User clicks "Start AI Session" button
2. Check subscription status (active?)
3. Check usage limits (if any)
4. Launch AI chat interface
5. AI greets user by name
6. AI references past sessions (context)
7. Session tracked in database
8. Usage counter incremented
9. Post-session summary generated
10. Progress updated on dashboard

**No scheduling. No waiting. Instant value.**

---

### Human Session Booking (Hybrid & Premium)

**Flow:**

1. User clicks "Book Human Session"
2. Check subscription tier (Hybrid or Premium?)
3. Check usage (sessions remaining this month?)
4. Show coach availability (Calendly or custom)
5. User selects time
6. AI generates pre-session brief for coach
7. Confirmation email sent
8. Reminder 24 hours before
9. Zoom link provided
10. Post-session: AI generates summary
11. Usage counter incremented

**AI Pre-Session Brief:**
```
Coach Brief for Sarah Johnson
Session scheduled: Tomorrow at 2pm

Key Insights:
- 12 AI sessions in past 30 days
- Primary concern: Work-related anxiety
- Breakthrough moment: Realized perfectionism is root cause
- Coping strategies working: Breathing exercises (8/10 effectiveness)
- Coping strategies not working: Journaling (3/10 effectiveness)
- Recent trigger: Performance review next week
- Emotional state: Anxiety increasing (6/10 → 8/10 in past week)

Suggested Focus:
- Explore perfectionism deeper
- Prepare for performance review
- Introduce cognitive reframing techniques

Client Goals:
1. Reduce anxiety before review
2. Build confidence in abilities
3. Develop healthier work boundaries
```

**This makes YOU 10x more effective in 30 minutes!**

---

## Revenue Model

### Unit Economics

**Tier 1 (AI-Only):**
- Revenue: $29/month
- Cost: $1.50/month (AI usage)
- Profit: $27.50/month
- Margin: 95%

**Tier 2 (Hybrid):**
- Revenue: $149/month
- Cost: $1.50 (AI) + $30 (human time) = $31.50
- Profit: $117.50/month
- Margin: 79%

**Tier 3 (Premium):**
- Revenue: $299/month
- Cost: $1.50 (AI) + $120 (human time) = $121.50
- Profit: $177.50/month
- Margin: 59%

### Growth Projections

**Month 1-3 (Launch & Validation):**
- 100 subscribers (70 AI, 25 Hybrid, 5 Premium)
- Revenue: $6,510/month
- Profit: $5,725/month
- Your time: 22.5 hours/month

**Month 4-6 (Growth):**
- 500 subscribers (350 AI, 125 Hybrid, 25 Premium)
- Revenue: $32,550/month
- Profit: $28,625/month
- Your time: 112.5 hours/month

**Month 7-12 (Scale):**
- 1,000 subscribers (700 AI, 250 Hybrid, 50 Premium)
- Revenue: $72,500/month
- Profit: $68,625/month
- Your time: 225 hours/month (split with wife)

**Year 2 (Mature):**
- 5,000 subscribers (3,500 AI, 1,250 Hybrid, 250 Premium)
- Revenue: $362,500/month
- Profit: $343,125/month
- Your time: 1,125 hours/month (hire 3 more coaches)

---

## Implementation Plan

### Phase 1: Stripe Setup (Day 1)
- Create Stripe products & prices
- Set up webhooks
- Build subscription checkout flow
- Test payment flow

### Phase 2: Database & Backend (Day 1-2)
- Add subscription tables
- Add usage tracking tables
- Build tRPC routers for subscriptions
- Implement usage limits
- Build upgrade/downgrade logic

### Phase 3: Frontend Rebuild (Day 2-3)
- Rebuild homepage for subscriptions
- Build subscription checkout page
- Build instant AI session launcher
- Build subscription management dashboard
- Build usage meter display

### Phase 4: Testing (Day 3)
- Test subscription signup
- Test AI instant access
- Test usage tracking
- Test upgrade flows
- Test human session booking

### Phase 5: Launch (Day 4)
- Deploy to production
- Monitor for issues
- Gather user feedback
- Iterate quickly

---

## Success Metrics

### Week 1:
- 10 trial signups
- 5 conversions to paid
- 50 AI sessions delivered
- 0 critical bugs

### Month 1:
- 100 subscribers
- 80% trial-to-paid conversion
- <5% churn
- 4.5+ star rating

### Month 3:
- 500 subscribers
- $30,000+ MRR
- <3% churn
- 90+ NPS score

### Month 6:
- 1,000 subscribers
- $70,000+ MRR
- <2% churn
- Profitable & scaling

---

## Risk Mitigation

**Risk 1: AI quality not good enough**
- Mitigation: Extensive testing before launch
- Fallback: Human escalation always available
- Monitoring: Track AI session ratings

**Risk 2: Low trial-to-paid conversion**
- Mitigation: Show value immediately (progress tracking)
- Fallback: Extend trial to 14 days
- Monitoring: Track engagement metrics

**Risk 3: High churn rate**
- Mitigation: Weekly engagement emails, progress tracking
- Fallback: Win-back campaigns, pause subscription option
- Monitoring: Cohort analysis, exit surveys

**Risk 4: Can't handle human session volume**
- Mitigation: Limit Premium tier to 50 subscribers initially
- Fallback: Hire additional coaches
- Monitoring: Coach utilization rates

---

## Next Steps

1. **Create Stripe products** (30 minutes)
2. **Build subscription database schema** (1 hour)
3. **Implement Stripe checkout** (3 hours)
4. **Rebuild homepage** (2 hours)
5. **Build instant AI launcher** (2 hours)
6. **Test end-to-end** (2 hours)
7. **Deploy & launch** (1 hour)

**Total: 2-3 days to transform platform**

---

## Conclusion

This transformation changes the business from a time-limited coaching practice to a scalable SaaS platform. The AI handles 90% of interactions, allowing unlimited scale while you focus on high-value human coaching for premium tiers.

**Key Insight:** You're not selling coaching sessions anymore. You're selling 24/7 AI-powered transformation with optional human guidance.

This is the difference between a $15,000/month ceiling and a $700,000/month potential.
