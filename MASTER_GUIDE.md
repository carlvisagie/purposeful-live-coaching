# 🛑 STOP - MANDATORY READING BEFORE ANY ACTION

```
╔══════════════════════════════════════════════════════════════════╗
║  🚨 THIS IS A LIVE PRODUCTION PLATFORM WITH REAL PAYING USERS 🚨  ║
║                                                                  ║
║  YOU MUST ANSWER THESE QUESTIONS BEFORE WRITING ANY CODE:        ║
║                                                                  ║
║  1. What is ProfileGuard and why is it mandatory?                ║
║  2. Name 5 features that are ALREADY BUILT                       ║
║  3. What happens if you rebuild something that exists?           ║
║                                                                  ║
║  PASTE YOUR ANSWERS IN YOUR FIRST RESPONSE TO THE USER.          ║
║  IF YOU CANNOT ANSWER, YOU HAVE NOT READ THIS GUIDE.             ║
╚══════════════════════════════════════════════════════════════════╝
```

**Answers are at the bottom of this section. Read the guide to find them.**

---

## CRITICAL FACTS (Memorize These)

| Fact | Value |
|------|-------|
| **Status** | 🟢 LIVE PRODUCTION - 100% Complete |
| **Users** | Real paying customers |
| **Sacred System** | ProfileGuard - MUST be used in ALL user-facing code |
| **Priority** | Revenue-blocking bugs FIRST, everything else SECOND |
| **Rule #1** | DO NOT rebuild existing features |
| **Production URL** | https://purposefullivecoaching.com |
| **Owner** | Carl Visagie |

---

## THE 4 GOLDEN RULES

1. **READ THIS ENTIRE GUIDE** before touching any code
2. **USE PROFILEGUARD** in any code that touches user data
3. **DO NOT REBUILD** - check the feature list first
4. **FIX REVENUE BLOCKERS** before anything else

---

## ANSWERS TO GATE QUESTIONS

> **1. What is ProfileGuard?**  
> ProfileGuard is the central system that loads unified client context (name, preferences, history, goals) for EVERY user interaction. It ensures we NEVER forget a client. All user-facing modules MUST call `ProfileGuard.getClientContext()` to maintain continuity.

> **2. Features already built (there are 50+, here are key ones):**  
> AI Coach (Sage), Real-Time Voice Coach, Sleep Stories, Focus Coach, AI Meditation, Structured Programs, Goals System, Habit Tracking, Health Optimization, Daily Check-ins, Coaching Dashboard, Live Session Assistant, Speaker Training, Compliance System, Crisis Detection

> **3. What happens if you rebuild something?**  
> You waste time, introduce bugs, break integrations with ProfileGuard, potentially take down the live platform, and lose the owner's trust and revenue.

**Now state your answers and this confirmation:**
> "I have read MASTER_GUIDE.md. ProfileGuard is mandatory. I will not rebuild existing features. I understand this is a live platform with real users."

---

# 🔴 MASTER GUIDE - PURPOSEFUL LIVE COACHING 🔴

**Last Updated:** December 21, 2025  
**Repository:** https://github.com/carlvisagie/purposeful-live-coaching

---

## 📋 TABLE OF CONTENTS

1. [Foundational Vision](#foundational-vision)
2. [Guiding Principles](#guiding-principles)
3. [What's Built & Working](#whats-built)
4. [Complete Feature Inventory](#feature-inventory)
5. [Architecture](#architecture)
17. [Community Feature](#community)

---

# PART 1: FOUNDATIONAL VISION {#foundational-vision}

> **"I bow to truth and reality, whatever the research proves is what we do, any other way is just wasting time, money, and will surely lead to disappointment."**

## 🎯 PLATFORM FOUNDATIONAL CAPABILITIES

### 1. Autonomous AI Coaching System

**Vision:** A fully autonomous AI coaching platform that:
- Onboards clients with frictionless flow (full access → free tier after 7 days)
- Uses evidence-based methods (Chase Hughes, Cialdini, behavioral science) to guide clients toward paid tiers
- Provides transformational coaching that makes lives better
- **Moral obligation:** If we fail to help them, they might use less competent platforms

**Self-Learning Requirements:**
- ✅ **Built:** Platform Intelligence Engine - aggregates data from all modules
- ✅ **Built:** Truth Keepers - validates research for empirical quality only
- ✅ **Built:** Adaptive Learning - tracks technique effectiveness per client
- ✅ **Built:** Self-evolving compliance rules based on what works
- 🟡 **In Progress:** Scraping known universe for latest research
- 🟡 **In Progress:** Auto-updating modules with new science

### 2. Human Coaching with AI Assistant

**Vision:** During live video sessions, the AI assistant speaks through the coach's headset to:
- Assess, categorize, diagnose, and observe all possible metrics
- Create on-the-spot programs taking clients from where they are to where they want to be
- Use all best behavioral change methods available on this planet
- Provide real measurable change

**Current Status:**
- ✅ **Built & Integrated:** Real-Time AI Voice & Video Coach (OpenAI Realtime API via WebRTC)
- ✅ **Built & Integrated:** Speaker Training Mode with 7 training types
- ✅ **Built & Integrated:** Live Session AI Assistant with full script generation
- ✅ **Built & Integrated:** 55 pre-written evidence-based coaching scripts
- ✅ **Built & Integrated:** Compliance monitoring during sessions
- ✅ **Built & Integrated:** Chase Hughes behavioral analysis overlay (HABIT framework)
- ✅ **Built & Integrated:** Micro-expression, body language, and voice stress analysis
- ✅ **Built & Integrated:** Real-time diagnostics and whispered guidance to coach

### 3. Holistic Approach

**Vision:** Address the whole person - Spiritual, Mental, Emotional, Nutrition, Exercise - because if the foundation is not healthy, no amount of "therapy" will help.

**Current Status:**
- ✅ **Built:** 34 Wellness Modules covering all domains
- ✅ **Built:** Morning Routine (Daily OS)
- ✅ **Built:** Evening Review (Daily OS)
- ✅ **Built:** Health Tracker (Movement, Nutrition, Hydration, Sleep)
- ✅ **Built:** Stress Relief Tools (Box breathing, 5-4-3-2-1 grounding)
- ✅ **Built:** Autism Transformation Dashboard
- 📋 **Planned:** Mortality screening and full biometrics

### 4. Comprehensive Compliance

**Vision:** Not just legal/ethical compliance, but interpersonal language compliance modeled after the best research available.

**Current Status:**
- ✅ **Built:** Comprehensive Compliance Suite with 6 categories:
  - Legal Compliance (medical/legal/financial advice detection)
  - Banned Words & Phrases (Gottman, NVC, Psychology Today research)
  - Ethical Compliance (ICF Code of Ethics)
  - Social Compliance (Cultural sensitivity)
  - Wisdom Compliance (Research-based communication)
  - Interpersonal Skills (Self-Determination Theory)
- ✅ **Built:** Crisis Detection with immediate alerts
- ✅ **Built:** Self-learning compliance rules that evolve based on effectiveness
- ✅ **Built:** Research validation through Truth Keepers

### 5. Mortality Screening & Biometrics

**Vision:** Comprehensive health assessment including DNA, bloodwork, and all factors affecting health. If a test doesn't exist that's thorough enough, design it.

**Current Status:**
- 📋 **Planned:** Lab partnerships for DNA/bloodwork processing
- 📋 **Planned:** Comprehensive health screening protocols
- 📋 **Planned:** Wearable device integration (Apple Health, Fitbit, Oura, WHOOP, Garmin)
- 📋 **Planned:** Japanese toilet-style automatic health monitoring

### 6. Frictionless User Experience

**Vision:** Every aspect designed with human nature in mind - eliminate friction, make it easy for clients to use, grow, excel, and become part of our community/tribe.

**Current Status:**
- ✅ **Built:** Frictionless onboarding flow
- ✅ **Built:** 7-day free trial with full access
- ✅ **Built:** Clean, intuitive UI (Headspace/Calm/BetterHelp standards)
- ✅ **Built:** Mobile-responsive design
- 🟡 **In Progress:** Gamification and motivation systems

### 7. Future Products

**Vision:** Wearables, supplements, vitamins, energy drinks, sleep aids, barometric containers, oxygen treatments, comfortable clothing - whatever research proves beneficial.

**Current Status:**
- 📋 **Planned:** All product development pending platform maturity

---

# PART 2: GUIDING PRINCIPLES {#guiding-principles}

## 🔴 **MANDATORY RULES FOR DEVELOPMENT** 🔴

1.  **READ FIRST, CODE SECOND.** Do not assume a feature is missing. Verify its existence in this guide. The platform is more complete than you think.
2.  **NO REBUILDING.** The existing systems are built on specific, evidence-based principles. Do not "improve" or "refactor" working code without explicit instruction. Focus on the requested task only.
3.  **REVENUE IS PARAMOUNT.** This is a business. Fix revenue-blocking bugs with the highest priority. All other tasks are secondary.
4.  **PROFILEGUARD IS SACRED.** The `ProfileGuard` system is the central nervous system of this platform. It ensures we **never forget a client**. All new features that interact with a user **MUST** integrate with `ProfileGuard` to maintain client context and continuity. No exceptions.

## Core Operating Philosophy

1. **Evidence-Based Only:** Only empirical research matters. Level A/B evidence (RCTs, meta-analyses) accepted. Everything else is filtered out by Truth Keepers.

2. **Self-Learning Systems:** Every module must:
   - Track its own effectiveness
   - Learn from client outcomes
   - Update itself with new research
   - Evolve toward what clients actually need

3. **Platform-Wide Intelligence:** The platform aggregates ALL data from ALL modules across ALL clients to:
   - Detect patterns and trends
   - Generate insights and recommendations
   - Move perpetually toward serving clients better

4. **One-and-Done:** Don't rebuild what's built properly. Focus effort on missing features, not polish of existing excellence.

5. **Revenue Blockers First:** Fix what blocks revenue before aesthetic improvements.

---

# PART 3: WHAT'S BUILT & WORKING {#whats-built}

## ✅ FULLY FUNCTIONAL SYSTEMS (December 21, 2025) - LAUNCH READY

### Critical Fixes (December 20)
| Fix | Status | Notes |
|---|---|---|
| Stripe Webhook URL | ✅ Fixed | Updated from old Render URL to purposefullivecoaching.com |
| Stripe Webhook Secret | ✅ Fixed | Added to Render environment variables |
| Webhook Handler | ✅ Fixed | Now creates user from Stripe customer info (frictionless) |
| Control Center Sessions | ✅ Fixed | Sessions now display correctly for owner |
| Control Center Clients | ✅ Fixed | Clients query now works without login |
| Voice Coach Route | ✅ Fixed | Added /voice-coach route |
| Availability Endpoint | ✅ Added | setOwnerAvailability for custom schedule |

### 🔥 NEW: Competitive Gap Features (December 20)
| Feature | Status | Notes |
|---|---|---|
| Push Notifications System | ✅ Working | Service worker, daily reminders, streak warnings, session alerts |
| Structured Programs | ✅ Working | 3 flagship programs: 6-Week Anxiety Reset, 21 Days Mindfulness, 7-Day Stress Detox |
| Just Talk (24/7 AI Support) | ✅ Working | Empathetic listening mode with crisis detection, 988 integration |
| Notification Settings UI | ✅ Working | Full settings panel in Settings > Notifications |
| Notification Prompt | ✅ Working | Onboarding prompt to enable notifications |

### 🚀 NEW: 10X Enhanced Modules (December 21) - Better Than Calm/Headspace
| Feature | Status | Routes | What Makes It 10X Better |
|---|---|---|---|
| AI Sleep Stories | ✅ Working | `/sleep-stories`, `/sleep`, `/bedtime` | Personalized AI-generated stories that adapt to mood, reference your day, include therapeutic elements |
| AI Focus Coach | ✅ Working | `/focus`, `/focus-coach`, `/pomodoro` | Pomodoro + adaptive soundscapes + AI voice coaching + distraction tracking |
| AI Meditation | ✅ Working | `/meditation`, `/meditate`, `/ai-meditation` | Real-time adaptive guidance, detects restlessness/tension, personalized scripts |

**Why These Are 10X Better:**
- **Calm/Headspace:** Pre-recorded, one-size-fits-all content
- **Our Platform:** AI-generated, personalized, adapts in real-time to user state
- **Unique Features:** Voice coaching, mood detection, therapeutic breathing cues, day personalization

### New Features & Hardening (December 19)
| Feature | Status | Notes |
|---|---|---|
| Streak Counter | ✅ Working | Gamified daily check-in streaks with badges |
| Progress Visualization | ✅ Working | 7-day wellness trend chart on dashboard |
| Onboarding Quiz | ✅ Working | 5-step personalization quiz for new users |
| API Rate Limiting | ✅ Working | Protects against brute-force attacks (100 req/15min) |
| Security Headers (Helmet) | ✅ Working | Added CSP and other security headers |
| Loading & Error States | ✅ Working | Improved spinners and error boundaries |
| Freedom Dashboard | ✅ Working | Marketing & business intelligence dashboard |

### Core Platform
| Feature | Status | Notes |
|---------|--------|-------|
| AI Coach Messaging | ✅ Working | GPT-4o integration, evidence-based responses |
| Real-Time AI Voice Coach | ✅ Working | OpenAI Realtime API via WebRTC |
| Speaker Training Mode | ✅ Working | 7 training modes (Free Practice, Storytelling, etc.) |
| Live Session AI Assistant | ✅ Working | Full script generation for coaches |
| Coaching Scripts Library | ✅ Working | 55 pre-written evidence-based scripts |
| Compliance Monitoring | ✅ Working | Real-time alerts for legal/ethical/social compliance |
| Behavioral Analysis | ✅ Working | Chase Hughes HABIT framework overlay |
| Micro-expression Analysis | ✅ Working | Real-time facial expression analysis |
| Voice Stress Analysis | ✅ Working | Detects emotional stress in voice tone |
| Frictionless Onboarding | ✅ Working | 7-day free trial, no credit card required |
| Stripe Integration | ✅ Working | Subscription management and payments |
| User Authentication | ✅ Working | Secure login and session management |
| Database (MySQL on PlanetScale) | ✅ Working | Scalable and reliable data storage |
| Hosting (Render) | ✅ Working | Auto-deploys from main branch |
| Email Capture & Nurturing | ✅ Working | ConvertKit integration for marketing automation |
| Client Recognition System | ✅ Working | Remembers returning clients across sessions |
| Self-Learning Platform | ✅ Working | Platform Intelligence Engine aggregates data |
| Truth Keepers | ✅ Working | Validates research for empirical quality |
| Adaptive Learning | ✅ Working | Tracks technique effectiveness per client |
| Perpetual Upgrade System | ✅ Working | Auto-updates modules with new science |
| **ProfileGuard** | ✅ **CRITICAL** | **Ensures perfect client continuity across all modules** |

---

# PART 4: COMPLETE FEATURE INVENTORY {#feature-inventory}

This section provides a detailed list of all existing features and their corresponding router files. **Review this list before assuming a feature needs to be built.**

| Feature Category | Feature Name | Router File(s) | Status |
|---|---|---|---|
| **Core Coaching** | AI Coach Messaging | `aiCoach.ts` | ✅ Live |
| | Real-Time AI Voice Coach | `realtimeVoice.ts` | ✅ Live |
| | Speaker Training Mode | `speakerTraining.ts` | ✅ Live |
| | Live Session AI Assistant | `liveSession.ts` | ✅ Live |
| | Coaching Scripts Library | Stored in DB, accessed via `aiCoach.ts` | ✅ Live |
| **Wellness Modules** | AI Sleep Stories | `sleepStories.ts` | ✅ Live |
| | AI Focus Coach | `focusCoach.ts` | ✅ Live |
| | AI Meditation | `aiMeditation.ts` | ✅ Live |
| | Structured Programs | `structuredPrograms.ts` | ✅ Live |
| | Daily Check-Ins / Journaling | `dailyCheckIns.ts`, `coaching.ts` | ✅ Live |
| | Habit Formation | `habitFormation.ts` | 🟡 Backend Only (Frontend Missing) |
| | Goal Setting & Tracking | `goals.ts` | 🟡 Backend Only (Frontend Missing) |
| | Health Optimization | `healthOptimization.ts` | ✅ Live |
| **Platform Systems** | User Authentication | `auth-standalone.ts` | ✅ Live |
| | Stripe Payments & Subscriptions | `stripe.ts`, `subscriptionWebhook.ts` | ✅ Live |
| | Database Health Check | `dbHealth.ts` | ✅ Live |
| | Email Automation (ConvertKit) | `emailAutomation.ts` | ✅ Live |
| | Push Notifications | `pushNotifications.ts` | ✅ Live |
| | Comprehensive Compliance | `comprehensiveCompliance.ts` | ✅ Live |
| | Platform Intelligence | `platformIntelligence.ts` | ✅ Live |
| | ProfileGuard | `profileGuard.ts` | ✅ **CRITICAL** |
| **Dashboards** | Client Dashboard | `coaching.ts` | ✅ Live |
| | Coach Control Center | `coachDashboard.ts` | ✅ Live |
| | Freedom (Admin) Dashboard | `admin.ts` | ✅ Live |
| **Community** | Community Feed & Posts | `community.ts` | ✅ Live |
| | AI Moderator (7 Layers) | `aiModerator.ts` | ✅ Live |
| | Anonymous Posting | `community.ts` | ✅ Live |
| | Daily Pulse Check-in | `community.ts` | ✅ Live |

---

# PART 5: ARCHITECTURE {#architecture}

- **Frontend:** React (Vite) with TypeScript and Tailwind CSS.
- **Backend:** Node.js with tRPC for API routes.
- **Database:** MySQL on PlanetScale (serverless).
- **Hosting:** Render (auto-deploys from `main` branch).
- **Authentication:** Custom JWT-based system.
- **Payments:** Stripe.
- **AI/ML:** OpenAI (GPT-4o, Realtime API, TTS), custom models for analysis.

## **ProfileGuard Architecture**

**This is the most important system in the platform.** It is the "brain" that remembers everything about a client.

- **`ProfileGuard.ts`:** The central module.
- **Unified Client Profile:** A single, comprehensive data model that aggregates information from all other modules.
- **How it Works:**
    1. Before any procedure that interacts with a user, `ProfileGuard.getClientContext()` **MUST** be called.
    2. This loads the complete client history, preferences, goals, challenges, and interaction patterns.
    3. This context is then used to personalize the AI's response, ensuring the platform feels continuous and intelligent.
    4. All new interactions are logged back to the Unified Client Profile via `SelfLearning.extractAndUpdateClientProfile()`.

**Any new feature MUST integrate with ProfileGuard. Failure to do so breaks the core value proposition of the platform.**

---

# PART 17: COMMUNITY FEATURE {#community}

## 🌐 Community Overview

**Status:** ✅ Built (December 21, 2025)  
**Route:** `/community`  
**URL:** https://purposefullivecoaching.com/community

### Vision

The Community is the tribal heart of Purposeful Live Coaching. It's where clients connect, support each other, celebrate wins, and find accountability partners. Built with the understanding that transformation happens faster in community than in isolation.

### What's Built

#### Stupid-Simple Frontend (`/community`)

| Feature | Description |
|---------|-------------|
| **One-tap Post Types** | 🎉 Win, 💙 Support, ❓ Question, 📈 Progress |
| **Card-based Feed** | No walls of text - easy to scan and engage |
| **Anonymous Mode** | Toggle to share without showing name |
| **Daily Pulse** | Quick mood check-in for the community |
| **Support Button** | One-tap "You got this!" reactions |

#### AI Moderator with 7 Protection Layers

| Layer | What It Does |
|-------|-------------|
| **1. Crisis Detection** | Immediately escalates suicide/self-harm language, shows 988 hotline |
| **2. Comprehensive Compliance** | Uses existing compliance engine (legal, ethical, social, wisdom, interpersonal) |
| **3. Privacy/PII Protection** | Detects emails, phones, SSNs, credit cards, addresses |
| **4. Platform Criticism** | Flags (doesn't hide) criticism for owner review |
| **5. Toxicity Filter** | Auto-hides harassment, discrimination, spam |
| **6. Sentiment Analysis** | Tracks positive patterns, identifies users needing support |
| **7. AI Analysis** | For nuanced cases, uses GPT-4.1-nano for cost efficiency |

#### Self-Learning Integration

- Tracks all community interactions
- Learns which content types get most engagement
- Identifies users who need extra support
- Improves moderation accuracy over time
- Feeds insights back to ProfileGuard

### Files

| File | Purpose |
|------|--------|
| `client/src/pages/Community.tsx` | Frontend UI |
| `server/routers/community.ts` | Backend API (14 procedures) |
| `server/routers/aiModerator.ts` | AI moderation service |
| `drizzle/communitySchema.ts` | Database schema with moderation fields |

### Database Tables

| Table | Purpose |
|-------|--------|
| `community_posts` | All posts with type, content, anonymous flag |
| `community_reactions` | Support reactions and engagement |
| `community_comments` | Threaded comments on posts |
| `community_reports` | User-reported content for review |
| `community_moderation_log` | AI moderation decisions and actions |

### Integration with ProfileGuard

The Community feature is fully integrated with ProfileGuard:
- User's community activity is part of their Unified Client Profile
- Sage can reference their community engagement in coaching sessions
- Support patterns help identify who needs extra attention
- Win celebrations inform goal tracking and progress

### Future Enhancements

- 📋 **Accountability Partners** - Match users with similar goals
- 📋 **Group Challenges** - Community-wide wellness challenges
- 📋 **Expert AMAs** - Live Q&A sessions with coaches
- 📋 **Success Stories** - Featured transformation journeys
- 📋 **Local Meetups** - In-person community events

---

*End of Master Guide*
