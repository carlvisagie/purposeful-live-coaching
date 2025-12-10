# 🎯 Purposeful Live Coaching Platform

**A comprehensive coaching platform with AI-powered support, subscription management, and specialized autism support.**

---

## ⚠️ MANDATORY: READ BEFORE STARTING ⚠️

**If you are a new agent working on this project:**

### 🚨 STOP AND READ THIS FILE FIRST 🚨
**[⚠️_READ_THIS_FIRST_⚠️.md](./⚠️_READ_THIS_FIRST_⚠️.md)**

**This is NOT optional. Reading this file will save you hours of wasted work.**

---

## 📊 Project Status

**Completion:** 78%  
**Last Updated:** December 10, 2025  
**Production URL:** https://purposeful-live-coaching-production.onrender.com  
**Repository:** https://github.com/carlvisagie/purposeful-live-coaching

### What's Working ✅
- ✅ AI Coach (GPT-4o with user's OpenAI API key)
- ✅ Guest checkout (no login required for pricing/purchase)
- ✅ Stripe subscription management
- ✅ PostgreSQL database on Render
- ✅ 31 frontend pages
- ✅ 31 backend API routers
- ✅ 20 database tables in production
- ✅ Frontend 100% Manus-free

### What's Not Working ❌
- ❌ 13 database tables still need to be created
- ❌ Some admin features need backend completion
- ❌ Backend still has some Manus OAuth code (needs cleanup)

---

## 🚨 CRITICAL RULES

### Rule #1: ZERO MANUS CODE ALLOWED
This platform is 100% independent. NO Manus-specific code, templates, or dependencies allowed.

**Status:** Frontend 100% Manus-free (commits 639e715 + 50d6dc0)

### Rule #2: Guest Checkout Must Work
Users must be able to purchase subscriptions WITHOUT logging in.

### Rule #3: AI Coach Uses GPT-4o
AI Coach uses user's OPENAI_API_KEY with `gpt-4o` model (NOT Gemini).

### Rule #4: Production Uses PostgreSQL
Database is PostgreSQL on Render (NOT MySQL). Use PostgreSQL syntax.

### Rule #5: Read Documentation First
Don't assume features are missing. Check the codebase and documentation first.

---

## 🏗️ Tech Stack

### Frontend
- React 19 + TypeScript
- Tailwind CSS
- tRPC for API calls
- Wouter for routing

### Backend
- Node.js + TypeScript
- tRPC for API layer
- Drizzle ORM
- Express server

### Database
- PostgreSQL on Render
- 20 tables in production
- Connection: See PROJECT_MASTER_GUIDE_UPDATED.md

### Deployment
- Render.com (auto-deploy from GitHub)
- Push to `main` branch triggers deployment
- Deployments take 5-10 minutes

### Integrations
- Stripe (payments & subscriptions)
- OpenAI GPT-4o (AI coaching)
- PostgreSQL (database)

---

## 📁 Project Structure

```
purposeful-live-coaching/
├── client/                      # Frontend React app
│   ├── src/
│   │   ├── pages/              # 31 pages (AICoach, Dashboard, Pricing, etc.)
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # Utilities and tRPC client
│   │   └── _core/              # Core hooks and utilities
│   └── public/                 # Static assets
│
├── server/                      # Backend Node.js server
│   ├── routers/                # 31 tRPC API routers
│   ├── db/                     # Database operations
│   ├── lib/                    # LLM and utilities
│   └── _core/                  # Core server utilities
│
├── drizzle/                     # Database schema and migrations
│   └── schema.ts               # Database table definitions
│
└── shared/                      # Shared types and constants

```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- PostgreSQL database (Render provides this)

### Installation
```bash
# Clone the repository
git clone https://github.com/carlvisagie/purposeful-live-coaching.git
cd purposeful-live-coaching

# Install dependencies
pnpm install

# Set up environment variables (see .env.example)
cp .env.example .env

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables
Required environment variables (set in Render):
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - User's OpenAI API key for AI Coach
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `JWT_SECRET` - Secret for session management

---

## 📚 Documentation

### Essential Reading (in order)
1. **[⚠️_READ_THIS_FIRST_⚠️.md](./⚠️_READ_THIS_FIRST_⚠️.md)** - Mandatory rules and guidelines
2. **[PROJECT_MASTER_GUIDE_UPDATED.md](./PROJECT_MASTER_GUIDE_UPDATED.md)** - Complete technical documentation
3. **[ACTUAL_STATUS_REPORT.md](./ACTUAL_STATUS_REPORT.md)** - What's actually built vs claimed
4. **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - Executive findings and recommendations

### Specialized Documentation
- **[MANUS_OAUTH_REMOVAL_COMPLETE.md](./MANUS_OAUTH_REMOVAL_COMPLETE.md)** - Details of OAuth removal
- **[MANUS_CODE_REMOVAL_PLAN.md](./MANUS_CODE_REMOVAL_PLAN.md)** - Plan for removing Manus code

---

## 🎯 What's Built (Verified)

### Frontend Pages (31 total)
**Core Features:**
- AICoach - AI chat interface with GPT-4o
- Dashboard - Main user dashboard
- Pricing - Pricing page (guest checkout enabled)
- SubscriptionDashboard - Subscription management
- MyProfile - User profile management
- MySessions - Session history

**Admin Features:**
- AdminDashboard - Admin metrics
- AdminAIMonitoring - AI monitoring
- AdminClientHistory - Client history
- AnalyticsDashboard - Analytics

**Coach Features:**
- CoachDashboard - Coach panel
- CoachAvailability - Scheduling
- CoachSetup - Onboarding
- CoachView - Profile

**Specialized:**
- AutismDashboard - Autism support
- EmotionTracker - Emotion tracking
- LiveSessionAssistant - Live session tool

**And 14 more pages...** (see ACTUAL_STATUS_REPORT.md)

### Backend API Routers (31 total)
- aiChat - AI coaching backend
- subscriptions - Subscription management
- users - User management
- coaches - Coach management
- sessions - Session management
- autism - Autism support
- emotions - Emotion tracking
- analytics - Analytics

**And 23 more routers...** (see ACTUAL_STATUS_REPORT.md)

### Database Tables (20 in production)
- aiChatConversations
- aiChatMessages
- aiInsights
- subscriptions
- users
- coaches
- sessions

**And 13 more tables...** (see ACTUAL_STATUS_REPORT.md)

**Missing:** 13 tables still need to be created in production

---

## 🔧 Recent Fixes

### December 10, 2025 - Manus OAuth Removal ✅
**Commits:** 639e715 + 50d6dc0

Removed ALL Manus OAuth code from frontend:
- Removed `getLoginUrl()` function
- Removed OAuth error interceptors
- Disabled auth queries on pricing page
- Updated 7 components

**Result:** Frontend 100% Manus-free, guest checkout works

### December 10, 2025 - AI Coach LLM Fix ✅
**Commit:** d7e8a38

Fixed AI Coach to use GPT-4o:
- Changed model from `gemini-2.5-flash` to `gpt-4o`
- Fixed PostgreSQL syntax bugs
- Fixed guest user support

**Result:** AI Coach works with user's OpenAI API key

### December 10, 2025 - Database Migration ✅
Migrated from MySQL to PostgreSQL:
- Updated DATABASE_URL
- Created AI Chat tables in production
- Fixed syntax bugs

**Result:** Database connection working

---

## 🐛 Known Issues

### High Priority
1. **13 database tables missing in production** - Need to run migrations
2. **Backend still has Manus OAuth code** - Needs cleanup (frontend is clean)
3. **Some admin features incomplete** - Backend needs completion

### Medium Priority
1. **Documentation needs continuous updates** - Keep docs in sync with code
2. **Testing coverage incomplete** - Need more tests

### Low Priority
1. **UI polish needed** - Some pages need design improvements
2. **Performance optimization** - Can be optimized further

---

## 🚀 Deployment

### Automatic Deployment
- Push to `main` branch on GitHub
- Render automatically deploys
- Takes 5-10 minutes to complete

### Manual Deployment
```bash
# Commit changes
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Render will auto-deploy
```

### Verify Deployment
```bash
# Check bundle hash changed
curl -s https://purposeful-live-coaching-production.onrender.com/ | grep "index-"

# Check site is live
curl -I https://purposeful-live-coaching-production.onrender.com/
```

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/routers/aiChat.test.ts
```

### Manual Testing Checklist
- [ ] Pricing page loads without login
- [ ] Guest checkout works (Stripe)
- [ ] AI Coach creates conversations
- [ ] AI Coach generates responses
- [ ] Subscription management works
- [ ] Admin dashboard accessible

---

## 📝 Contributing

### Before Making Changes
1. Read [⚠️_READ_THIS_FIRST_⚠️.md](./⚠️_READ_THIS_FIRST_⚠️.md)
2. Check if feature already exists
3. Verify current deployment status
4. Read recent commits (`git log`)

### Making Changes
1. Create feature branch (optional)
2. Make changes
3. Test locally
4. Commit with descriptive message
5. Push to GitHub
6. Wait for Render deployment
7. Verify in production
8. **Update documentation immediately**

### Commit Message Format
```
type: Brief description

- Detailed change 1
- Detailed change 2
- Impact/result

Example:
fix: Remove Manus OAuth code from frontend

- Removed getLoginUrl() function
- Removed OAuth error interceptors
- Updated 7 components
- Frontend now 100% Manus-free
```

---

## 🆘 Getting Help

### Documentation
1. Read [⚠️_READ_THIS_FIRST_⚠️.md](./⚠️_READ_THIS_FIRST_⚠️.md)
2. Check [PROJECT_MASTER_GUIDE_UPDATED.md](./PROJECT_MASTER_GUIDE_UPDATED.md)
3. Review [ACTUAL_STATUS_REPORT.md](./ACTUAL_STATUS_REPORT.md)

### Common Issues
- **401 errors on pricing page:** Check if deployment completed
- **AI Coach not working:** Verify OPENAI_API_KEY in Render
- **Database connection failed:** Check DATABASE_URL format
- **Manus OAuth redirect:** Check if frontend code is latest version

### Contact
**Owner:** Carl Visagie (@carlvisagie)

---

## ⚖️ License

Proprietary - All rights reserved

---

## 🎯 Next Steps

### Immediate (High Priority)
1. ✅ Remove Manus OAuth code (DONE - commits 639e715 + 50d6dc0)
2. ✅ Fix AI Coach LLM (DONE - commit d7e8a38)
3. ⏳ Wait for Render deployment to complete
4. ⏳ Verify guest checkout works in production
5. ⏳ Create remaining 13 database tables

### Short Term (This Week)
1. Clean up backend Manus OAuth code
2. Complete database migration
3. Test all user flows end-to-end
4. Fix any bugs discovered

### Medium Term (This Month)
1. Complete admin features
2. Add comprehensive testing
3. Optimize performance
4. Polish UI/UX
5. Prepare for production launch

---

**Last Updated:** December 10, 2025 - 23:00 UTC  
**Status:** Active Development  
**Deployment:** Auto-deploy from GitHub to Render
