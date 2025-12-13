# Purposeful Live Coaching - Complete Feature TODO

## 🔴 CRITICAL - REVENUE BLOCKERS

- [x] Fix /daily-os/morning route (404 error) - REVERTED (requires backend wor- [x] Implement tier differentiation system
  - [x] Add subscription tier checks to AI chat router
  - [x] Enforce message limits per tier (Basic: 100, Premium: 500, Elite: unlimited)
  - [ ] Filter wellness modules by tier (Basic: 5, Premium: 31, Elite: 31) - Frontend pending
  - [x] Use GPT-4o-mini for Basic tier, GPT-4o for Premium/Elite
  - [ ] Display tier limits in UI - Frontend pending
  - [x] Add upgrade prompts when limits reachedng limits
- [ ] Test payment processing for all tiers

## 🟡 HIGH PRIORITY - Daily Operating System

- [ ] Create complete morning routine page
- [ ] Create evening routine page
- [ ] Create daily check-in system
- [ ] Add habit tracking (physical health, emotional regulation, focus)
- [ ] Add accountability system
- [ ] Add progress tracking dashboard
- [ ] Add stress reduction tools
- [ ] Add mindfulness/awareness exercises
- [ ] Add discipline loop tracking
- [ ] Add micro-habits system
- [ ] Add long-term trajectory visualization
- [ ] Add mission alignment tracker
- [ ] Add impulse control tools
- [ ] Add recovery/restoration tracking

## 🟢 MEDIUM PRIORITY - Video Implementation

- [ ] Complete video preview UI component
- [ ] Add equipment testing interface
- [ ] Add audio level monitoring
- [ ] Implement client video display (WebRTC)
- [ ] Add video quality indicators
- [ ] Integrate face recognition
- [ ] Add video storage (S3)
- [ ] Implement video analysis for observational principles

## 🔵 POLISH & OPTIMIZATION

- [ ] Full platform QA (all 29 pages)
- [ ] Test all user flows
- [ ] Test error handling
- [ ] User guide documentation
- [ ] Coach onboarding documentation
- [ ] Admin documentation
- [ ] Landing page optimization
- [ ] SEO implementation
- [ ] Email sequences
- [ ] Social proof collection

## 🟣 FUTURE ENHANCEMENTS

- [ ] Observational framework (Chase Hughes principles)
- [ ] Real-time behavioral analysis
- [ ] Coach prompting system
- [ ] Beta testing program
- [ ] Feedback collection system
- [ ] Pricing validation
- [ ] Support system setup

---

**Last Updated:** December 13, 2025
**Status:** Starting comprehensive repair and implementation

## 🟠 UI/UX IMPROVEMENTS

- [x] Clean up wellness modules UI
  - [x] Integrate 33 wellness modules with comprehensive display
  - [x] Remove small/obscured buttons
  - [x] Create unified, clean wellness modules interface
  - [x] Ensure all 33 modules are easily accessible

## 🔴 URGENT - Deployment Fixes

- [x] Fix database migration syntax error (PostgreSQL AFTER clause)
- [x] Ensure schema changes are compatible with production database
- [x] Test migration locally before deploying

## 🔴 FRICTIONLESS CLIENT IDENTIFICATION (NEW)

- [x] Remove AI disclosure compliance dialog blocking chat access
- [x] Remove subscription requirement for guest AI chat access
- [x] Enable guest access to conversation list
- [x] Fix AI chat button disabled state
- [x] Fix database column naming (camelCase to snake_case)
- [x] Drop duplicate columns (conversationId, createdAt, etc.)
- [x] Test AI Coach messaging end-to-end - WORKING IN PRODUCTION
- [ ] Implement anonymous client ID generation (browser fingerprint + localStorage)
- [x] Add voice input button to AI chat interface
- [ ] Integrate Whisper API for voice transcription
- [ ] AI extraction of client info from natural conversation
- [ ] Store client metadata in conversation context
- [ ] Implement persistent identity across sessions
- [ ] Add optional account linking for multi-device access

## 🔴 TIER DIFFERENTIATION IMPLEMENTATION (Dec 13, 12:15 PM)

- [x] Add message_count tracking to subscriptions table
- [x] Add tier_level enum to subscriptions table (already exists as 'tier')
- [x] Update AI chat router to check subscription tier before processing
- [x] Enforce message limits (Basic: 100, Premium: 500, Elite: unlimited)
- [x] Use GPT-4o-mini for Basic tier, GPT-4o for Premium/Elite
- [x] Filter wellness modules by tier (Basic: 5, Premium/Elite: 33)
- [x] Add usage counter display in AI chat UI
- [x] Add "upgrade to unlock" prompts when limits reached
- [ ] Test all three AI tiers end-to-end
- [ ] Document tier differentiation in MASTER_GUIDE.md

## 🟢 DAILY OPERATING SYSTEM (Dec 13, 1:30 PM)

- [x] Create daily check-ins schema (morning/evening)
- [x] Create habits schema with streak tracking
- [x] Create dailyCheckIns tRPC router
- [x] Create DailyCheckIn page (morning + evening combined)
- [x] Add route to App.tsx
- [ ] Create HabitTracker page
- [ ] Create ProgressDashboard page
- [ ] Test daily check-in flow
- [ ] Test habit tracking with streaks
- [ ] Add navigation links to Dashboard

## 🔴 UX CONSOLIDATION - ONE UNIFIED CONTROL CENTER (Dec 13, 4:30 PM)

- [ ] Consolidate all dashboards into ONE unified Mission Control interface
- [ ] Remove separate /dashboard, /coach/dashboard, /admin navigation confusion
- [ ] Create single hub with all features accessible from one place
- [ ] Unified navigation: AI Coach, Sessions, Wellness, Health, Daily OS, Settings
- [ ] Eliminate multiple interfaces that serve no purpose
