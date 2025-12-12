# Purposeful Live Coaching - Master Guide
## Single Source of Truth

**Last Updated:** December 11, 2025 - 10:00 PM EST  
**Status:** 🟡 IN DEVELOPMENT - Core features working, video implementation in progress  
**Owner:** Carl Visagie  
**Production URL:** https://purposeful-live-coaching-production.onrender.com  
**Repository:** https://github.com/carlvisagie/purposeful-live-coaching

---

## 📋 TABLE OF CONTENTS

1. [Platform Overview](#platform-overview)
2. [What's Working](#whats-working)
3. [What's In Progress](#whats-in-progress)
4. [Architecture](#architecture)
5. [Revenue Model](#revenue-model)
6. [Observational Framework](#observational-framework)
7. [Video Implementation](#video-implementation)
8. [Deployment](#deployment)
9. [Next Steps](#next-steps)

---

## 🎯 PLATFORM OVERVIEW {#platform-overview}

**Purposeful Live Coaching** is a holistic wellness coaching platform combining:
- AI-powered 24/7 coaching
- Human coaching sessions with AI assistance
- Real-time behavioral analysis during sessions
- Comprehensive wellness tracking (spiritual, mental, emotional, physical)

**Core Differentiator:** AI assistant that observes video sessions and provides real-time coaching prompts based on comprehensive observational principles (Chase Hughes + holistic wellness framework).

---

## ✅ WHAT'S WORKING {#whats-working}

### Payments & Revenue
- ✅ Stripe integration operational
- ✅ All 6 pricing tiers working ($29-$2000/month)
- ✅ Guest checkout enabled (no login required)
- ✅ Owner successfully tested payment (AI Coaching tier)
- ✅ Stripe products created:
  - AI Chat: $29/month
  - AI + Monthly Check-in: $149/month
  - AI + Weekly Support: $299/month
  - Human Starter: $800/month
  - Human Professional: $1200/month
  - Human Elite: $2000/month

### AI Coaching
- ✅ 24/7 AI Chat functional (GPT-4o)
- ✅ OpenAI billing configured ($100 credit)
- ✅ Conversations saving to database
- ✅ Crisis detection active
- ✅ Professional UI with disclaimers
- ✅ Owner confirmed "chat working"

### Human Coaching
- ✅ Session booking system working
- ✅ Clients can book via `/my-sessions`
- ✅ Coach dashboard operational (fixed null error Dec 11)
- ✅ Session management functional
- ✅ Zoom link field in database (manual entry)

### Platform Infrastructure
- ✅ 29 frontend pages (React 19 + TypeScript + Tailwind)
- ✅ 43 backend routers (Node.js + TypeScript + tRPC)
- ✅ 20 database tables (PostgreSQL on Render)
- ✅ Deployed on Render.com
- ✅ 100% Manus-free codebase
- ✅ GitHub repository active

---

## 🔄 WHAT'S IN PROGRESS {#whats-in-progress}

### 1. Video Implementation (50% Complete)
**Status:** PAUSED to prioritize observational framework research

**Completed:**
- Video capture added to getUserMedia
- State variables for video/audio management
- MediaRecorder updated to record video+audio
- Stream cleanup for video tracks

**Remaining:**
- Video preview UI component
- Equipment testing interface
- Audio level monitoring
- Client video display (WebRTC)
- Video quality indicators
- Face recognition integration
- Video storage (S3)
- Video analysis for observational principles

**Estimated Time to Complete:** 6-8 hours

### 2. Observational Framework Research (PRIORITY)
**Status:** STARTING NOW

**Goal:** Define comprehensive observational principles for AI assistant to analyze during video sessions.

**Scope:**
- Physical health indicators (body language, posture, energy)
- Mental health indicators (cognitive patterns, clarity)
- Emotional health indicators (facial expressions, emotional states)
- Spiritual health indicators (presence, alignment, purpose)
- Institutional/social indicators (relationship patterns, functioning)

**Research Sources:**
- Chase Hughes behavioral analysis
- Paul Ekman facial action coding
- Joe Navarro body language research
- Holistic wellness assessment frameworks
- Mental health diagnostic criteria

**Deliverable:** Proprietary observational framework that defines platform's competitive advantage

### 3. Sintra AI Assistant Strategy
**Status:** PLANNED

**Goal:** Automate business operations using Sintra's AI assistants

**Sintra Agents:**
- Soshie (Social Media) - Marketing content
- Penn (Copywriting) - Sales copy, emails
- Milli (Sales) - Lead qualification
- Cassie (Customer Support) - 24/7 support
- Buddy (Business Development) - Partnerships
- Others as needed

**Deliverable:** Business automation strategy document

---

## 🏗️ ARCHITECTURE {#architecture}

### Tech Stack
**Frontend:**
- React 19
- TypeScript
- Tailwind CSS 4
- Shadcn/ui components
- Wouter (routing)

**Backend:**
- Node.js 22
- TypeScript
- tRPC (API layer)
- Express
- Drizzle ORM

**Database:**
- PostgreSQL (Render)
- 20 tables
- Drizzle migrations

**AI/ML:**
- OpenAI GPT-4o (AI coaching)
- Whisper (transcription)
- Custom voice/face recognition

**Infrastructure:**
- Hosting: Render.com
- Storage: S3 (planned)
- Payments: Stripe
- Video: Custom WebRTC (in progress)

### Key Pages
**Public:**
- `/` - Homepage
- `/pricing` - Pricing tiers
- `/about` - About page

**Client:**
- `/dashboard` - Client dashboard
- `/ai-coach` - AI Chat interface
- `/my-sessions` - Book/manage sessions

**Coach:**
- `/coach/dashboard` - Manage clients
- `/coach/availability` - Set schedule
- `/live-session` - Session assistant (video + AI prompts)

**Admin:**
- `/admin` - Platform analytics
- `/admin/ai-monitoring` - AI quality monitoring

### Database Schema (Key Tables)
- `users` - User accounts
- `subscriptions` - Stripe subscriptions
- `aiConversations` - AI chat history
- `humanSessionBookings` - Coaching sessions
- `clientProfiles` - Client wellness data
- `voiceProfiles` - Voice recognition data
- `faceProfiles` - Face recognition data

---

## 💰 REVENUE MODEL {#revenue-model}

### Pricing Tiers

**AI Coaching:**
1. **AI Chat** - $29/month
   - 24/7 AI coaching
   - Unlimited conversations
   - Crisis detection
   - Progress tracking

2. **AI + Monthly Check-in** - $149/month
   - Everything in AI Chat
   - 1 live session/month (30 min)
   - Priority support

3. **AI + Weekly Support** - $299/month
   - Everything above
   - 4 live sessions/month (30 min each)
   - Priority scheduling

**Human Coaching:**
4. **Starter** - $800/month
   - 2 sessions/month (60 min each)
   - 24/7 AI coaching between sessions

5. **Professional** - $1200/month
   - 4 sessions/month (60 min each)
   - 24/7 AI coaching
   - Priority scheduling

6. **Elite** - $2000/month
   - 8 sessions/month (60 min each)
   - 24/7 AI coaching
   - Direct coach access

### Revenue Projections

**Carl's Availability:**
- Weeknights: Mon-Fri, 7:30-9:30 PM (10 hours/week)
- Weekends: Sat-Sun, 9 AM - 9 PM (24 hours/week)
- **Total: 34 hours/week = 34 sessions/week capacity**

**Conservative (10 customers):**
- 5 AI Chat + 3 AI Premium + 2 Starter = $2,192/month

**Moderate (25 customers):**
- 10 AI Chat + 8 AI Premium + 5 Starter + 2 Professional = $7,882/month

**Aggressive (50 customers):**
- 20 AI Chat + 15 AI Premium + 10 Starter + 3 Professional + 2 Elite = $18,415/month

**At Capacity (34 sessions/week @ avg $1000):**
- 136 sessions/month = $136,000/month

---

## 🔍 OBSERVATIONAL FRAMEWORK {#observational-framework}

### Purpose
Define what the AI assistant observes during video sessions to provide accurate, holistic coaching prompts.

### Framework Dimensions

**1. Physical Health Indicators**
- Body language and posture
- Energy levels and fatigue
- Physical tension patterns
- Movement quality
- Breathing patterns
- Facial color and vitality

**2. Mental Health Indicators**
- Cognitive clarity
- Thought patterns (circular, linear, scattered)
- Attention and focus
- Memory function
- Decision-making quality
- Mental fatigue signs

**3. Emotional Health Indicators**
- Facial expressions (Ekman FACS)
- Emotional congruence
- Emotional regulation
- Trigger responses
- Emotional range and depth
- Authenticity vs. masking

**4. Spiritual Health Indicators**
- Presence and groundedness
- Purpose alignment
- Values congruence
- Meaning-making patterns
- Connection to something larger
- Inner peace vs. inner conflict

**5. Behavioral Analysis (Chase Hughes)**
- Deception indicators
- Comfort/discomfort cues
- Engagement levels
- Rapport building
- Resistance patterns
- Openness to change

**6. Social/Relational Indicators**
- Communication patterns
- Boundary health
- Relationship dynamics
- Social functioning
- Support system quality
- Isolation vs. connection

### Research Status
**Status:** NOT STARTED  
**Priority:** CRITICAL - This defines competitive advantage  
**Next Step:** Deep research on each dimension  
**Timeline:** 2-3 days of focused research

---

## 🎥 VIDEO IMPLEMENTATION {#video-implementation}

### Current Status: 50% Complete (PAUSED)

**Why Paused:** Observational framework research is more strategic. Need to define WHAT to observe before building HOW to observe.

### Completed Work

**1. Video Capture**
```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 16000,
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  },
});
```

**2. State Management**
- `mediaStream` - Video+audio stream
- `videoRef` - Coach video element
- `clientVideoRef` - Client video element
- `videoQuality` - Resolution/FPS tracking
- `audioLevel` - Audio monitoring

**3. Recording**
- MediaRecorder configured for video+audio
- Codec: VP9 + Opus
- Format: WebM

### Remaining Work

**Phase 1: Video Preview (1 hour)**
- Video preview UI component
- Equipment testing button
- Camera/mic permissions display
- Quality indicators

**Phase 2: Audio Monitoring (30 min)**
- Web Audio API integration
- Audio level visualization
- Quality warnings

**Phase 3: Client Video (2 hours)**
- WebRTC peer connection
- Signaling server
- Two-way video streaming

**Phase 4: Video Analysis (AFTER framework research)**
- Frame capture every N seconds
- Send to AI analysis endpoint
- Extract observational indicators
- Generate coaching prompts

**Phase 5: Storage (1 hour)**
- S3 upload integration
- Video metadata storage
- Playback interface

**Total Remaining:** 6-8 hours

### Files Modified
- `client/src/pages/LiveSessionAssistant.tsx` (lines 73-81, 139-155, 157-162, 209, 240-248)

---

## 🚀 DEPLOYMENT {#deployment}

### Current Infrastructure

**Hosting:** Render.com  
**Service:** purposeful-live-coaching-production  
**URL:** https://purposeful-live-coaching-production.onrender.com

**Environment Variables (Configured):**
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_PRICE_AI_BASIC` - $29/month tier
- `STRIPE_PRICE_AI_PREMIUM` - $149/month tier
- `STRIPE_PRICE_AI_ELITE` - $299/month tier
- `STRIPE_PRICE_HUMAN_BASIC` - $800/month tier
- `STRIPE_PRICE_HUMAN_PREMIUM` - $1200/month tier
- `STRIPE_PRICE_HUMAN_ELITE` - $2000/month tier
- `OPENAI_API_KEY` - OpenAI API access
- `DATABASE_URL` - PostgreSQL connection

### Deployment Process

**Automatic:**
- Push to GitHub main branch
- Render auto-deploys
- Build time: ~5-10 minutes

**Manual:**
- Render dashboard → Manual Deploy
- Clear cache if needed

### Known Issues

**Manus OAuth in Manus Browser:**
- Only affects testing in Manus environment
- Production site works fine
- Not a blocker

---

## 🎯 NEXT STEPS {#next-steps}

### Immediate (This Week)

**1. Observational Framework Research (Priority 1)**
- Research all 6 dimensions
- Document findings
- Create proprietary framework
- Define AI analysis requirements
- **Timeline:** 2-3 days

**2. Finish Video Implementation (Priority 2)**
- Complete remaining 50%
- Test end-to-end
- Deploy to production
- **Timeline:** 1-2 days

**3. Set Coach Availability (Priority 3)**
- Configure schedule in `/coach/availability`
- Weeknights: 7:30-9:30 PM
- Weekends: 9 AM - 9 PM
- **Timeline:** 15 minutes

### Short Term (Next 2 Weeks)

**4. Sintra Business Automation**
- Define automation strategy
- Set up Sintra agents
- Create marketing calendar
- **Timeline:** 2-3 days

**5. Marketing Launch**
- Create launch content
- Social media posts
- Email to network
- **Timeline:** 1 week

**6. First 5 Customers**
- Validate product-market fit
- Collect testimonials
- Refine offering
- **Timeline:** 2 weeks

### Medium Term (Next 3 Months)

**7. Scale to 25 Customers**
- Content marketing
- Referral program
- Optimize pricing
- **Timeline:** 3 months

**8. Automate Operations**
- Auto-generate Zoom links (Zoom API)
- Auto-confirm bookings
- Email automation
- **Timeline:** Ongoing

### Long Term (6-12 Months)

**9. Scale to 50+ Customers**
- Paid advertising
- Strategic partnerships
- Hire virtual assistant
- **Timeline:** 6 months

**10. Build Coaching Team**
- Hire 2-3 additional coaches
- Create training program
- Quality assurance system
- **Timeline:** 12 months

---

## 📝 CRITICAL NOTES

### What Makes This Platform Unique

**1. Holistic Approach**
- Not just mental health
- Spiritual, emotional, physical, social dimensions
- Comprehensive wellness tracking

**2. AI-Assisted Human Coaching**
- AI observes video sessions
- Provides real-time coaching prompts
- Based on proprietary observational framework
- Coach gets "superpowers" during sessions

**3. Continuous Support**
- 24/7 AI coaching between human sessions
- Seamless integration
- Client never alone

### Revenue Readiness

**Can Accept Money:** ✅ YES  
**Can Deliver AI Coaching:** ✅ YES  
**Can Deliver Human Coaching:** ⚠️ PARTIAL (video in progress)  
**Can Manage Operations:** ✅ YES

**Recommendation:** Finish video implementation before marketing human coaching tiers. Can market AI coaching tiers NOW.

### Documentation Philosophy

**ONE Master Guide Only**
- This file is the single source of truth
- All other documentation files archived
- Update this file, not separate docs
- Keep it simple, keep it consolidated

---

**Last Updated:** December 11, 2025 - 10:00 PM EST  
**Next Update:** After observational framework research complete  
**Maintained By:** Carl Visagie + Manus AI
