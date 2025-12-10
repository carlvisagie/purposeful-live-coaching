# ⚠️⚠️⚠️ STOP! READ THIS BEFORE TOUCHING ANYTHING ⚠️⚠️⚠️

## 🚨 RULE #1: ZERO MANUS CODE ALLOWED 🚨

### THIS IS THE #1 RULE - VIOLATE THIS AND YOU'LL BREAK EVERYTHING

**THIS PLATFORM IS 100% INDEPENDENT - ABSOLUTELY NO MANUS CODE ALLOWED**

❌ **NEVER EVER DO THIS:**
- Import ANYTHING from Manus templates or webdev tools
- Use Manus-specific utilities, helpers, or components
- Add Manus OAuth code (we just spent HOURS removing it)
- Reference Manus APIs (except standard storage/LLM if absolutely needed)
- Use Manus command-line utilities in the application code
- Copy code from Manus examples or templates
- Use `getLoginUrl()` or any Manus OAuth functions
- Add `redirectToLoginIfUnauthorized()` or similar interceptors

✅ **ALWAYS DO THIS INSTEAD:**
- Use standard npm packages from npmjs.com
- Use industry-standard tools (React, tRPC, Stripe, OpenAI, etc.)
- Deploy to Render.com (NOT Manus hosting)
- Use simple `/login` routes (NOT Manus OAuth)
- Use user's OPENAI_API_KEY (NOT Manus LLM endpoints)
- Use PostgreSQL on Render (NOT Manus database)
- Check if standard solutions exist before adding dependencies

**WHY THIS MATTERS:**
- We just removed ALL Manus OAuth code (commits 639e715 + 50d6dc0)
- Manus code causes OAuth redirects that block guest checkout
- Manus code makes platform dependent on Manus infrastructure
- Owner explicitly requires 100% independent platform
- Every time an agent adds Manus code, we waste hours removing it

**CURRENT STATUS:**
- ✅ Frontend: 100% Manus-free (verified December 10, 2025)
- ⏳ Backend: Still has some Manus OAuth code (needs cleanup)
- ✅ Database: Independent PostgreSQL on Render
- ✅ Deployment: Independent Render.com deployment

**IF YOU ADD MANUS CODE, YOU WILL:**
1. Break guest checkout (pricing page will redirect to Manus OAuth)
2. Break AI Coach (will try to use Manus LLM instead of user's OpenAI)
3. Create dependencies on Manus infrastructure
4. Waste hours of work that will need to be undone
5. Frustrate the project owner (this is a recurring problem)

---

## 🚨 MANDATORY FOR ALL AGENTS - NO EXCEPTIONS 🚨

**If you are a new agent starting work on this project, you MUST read this entire file before making ANY changes.**

**Failure to read this will cause you to:**
- Add Manus code we just removed (BIGGEST PROBLEM)
- Break working features
- Waste hours of work
- Frustrate the project owner
- Repeat mistakes that have already been fixed

---

## 📋 WHAT YOU MUST DO FIRST

### 1. READ THESE FILES IN ORDER (30 minutes)
1. **This file** (you're reading it now)
2. **README.md** - Project overview and current status
3. **PROJECT_MASTER_GUIDE_UPDATED.md** - Complete technical documentation
4. **ACTUAL_STATUS_REPORT.md** - What's actually built vs what's claimed

### 2. VERIFY CURRENT STATE
```bash
# Check what's actually in the codebase
cd /home/ubuntu/purposeful-live-coaching
git log --oneline -10  # See recent commits
git status             # Check for uncommitted changes
```

### 3. ASK BEFORE CHANGING ANYTHING
- Read the existing code first
- Check if the feature is already built
- Verify your assumptions with the owner
- Don't assume documentation is outdated - IT'S BEEN UPDATED

---

## 🚫 CRITICAL RULES - VIOLATE THESE AND YOU'LL BREAK EVERYTHING

### Rule #1: ZERO MANUS CODE ALLOWED
**THIS PLATFORM IS 100% INDEPENDENT - NO MANUS DEPENDENCIES**

❌ **NEVER DO THIS:**
- Import anything from Manus templates
- Use Manus-specific tools or utilities
- Add Manus OAuth code
- Reference Manus APIs (except standard ones like storage)
- Use Manus command-line utilities in the app

✅ **ALWAYS DO THIS:**
- Use standard npm packages
- Use industry-standard tools (React, tRPC, Stripe, etc.)
- Deploy to Render.com (NOT Manus hosting)
- Use OpenAI API with user's OPENAI_API_KEY

**STATUS:** Frontend is 100% Manus-free (commits 639e715 + 50d6dc0)

---

### Rule #2: READ BEFORE YOU CODE
**DON'T ASSUME FEATURES ARE MISSING - THEY'RE PROBABLY ALREADY BUILT**

This platform has **31 pages** and **31 API routers** already built. Before creating anything:

1. Check `client/src/pages/` for existing pages
2. Check `server/routers/` for existing API endpoints
3. Read `ACTUAL_STATUS_REPORT.md` for what's actually built
4. Search the codebase for similar functionality

**Common mistake:** "Let me build the AI Coach feature" → **IT'S ALREADY BUILT AND WORKING**

---

### Rule #3: USE THE CORRECT DATABASE
**PRODUCTION DATABASE: PostgreSQL on Render (NOT MySQL)**

❌ **NEVER DO THIS:**
- Use MySQL syntax (`.insertId`, `authPlugin`, etc.)
- Assume local database matches production
- Create tables without checking production first

✅ **ALWAYS DO THIS:**
- Use PostgreSQL syntax (`.returning()`, `.id`)
- Check production database before making schema changes
- Test with actual production DATABASE_URL

**Database Credentials:**
```
Host: dpg-d4npae6uk2gs73fppev0-a.oregon-postgres.render.com
Database: purposefullive_db
User: purposefullive_db_user
Password: l7FOZpyCwsHIKhiTwUhaFUDRSUd4N457
```

---

### Rule #4: GUEST CHECKOUT MUST WORK
**USERS MUST BE ABLE TO PURCHASE WITHOUT LOGGING IN**

The pricing page and checkout flow MUST work for unauthenticated users.

❌ **NEVER DO THIS:**
- Require authentication for pricing page
- Block guest users from checkout
- Redirect to login before Stripe checkout

✅ **ALWAYS DO THIS:**
- Use `publicProcedure` for checkout endpoints
- Disable auth queries on pricing page
- Allow guest users to complete purchase

**Recent fix:** Commits 639e715 + 50d6dc0 removed OAuth redirects

---

### Rule #5: AI COACH USES GPT-4O (NOT GEMINI)
**THE AI COACH USES USER'S OPENAI_API_KEY WITH GPT-4O MODEL**

❌ **NEVER DO THIS:**
- Use `gemini-2.5-flash` model
- Use Manus LLM endpoints
- Hardcode any LLM provider

✅ **ALWAYS DO THIS:**
- Use `gpt-4o` model
- Use user's OPENAI_API_KEY from Render environment
- Check `server/lib/llm.ts` for current configuration

**Recent fix:** Commit d7e8a38 changed model from gemini to gpt-4o

---

## 📊 WHAT'S ACTUALLY BUILT (VERIFIED)

### Frontend: 31 Pages ✅
- AICoach (working with GPT-4o)
- Dashboard
- Pricing (guest checkout enabled)
- SubscriptionDashboard
- AdminDashboard
- CoachDashboard
- AutismDashboard
- EmotionTracker
- And 23 more pages...

See `ACTUAL_STATUS_REPORT.md` for complete list.

### Backend: 31 API Routers ✅
- aiChat (working)
- subscriptions (guest checkout working)
- users
- coaches
- sessions
- And 26 more routers...

See `ACTUAL_STATUS_REPORT.md` for complete list.

### Database: 20 Tables in Production ✅
- aiChatConversations ✅
- aiChatMessages ✅
- aiInsights ✅
- subscriptions ✅
- users ✅
- And 15 more tables...

**Missing:** 13 tables still need to be created (see ACTUAL_STATUS_REPORT.md)

---

## 🔧 CURRENT DEPLOYMENT STATUS

### Production URL
https://purposeful-live-coaching-production.onrender.com

### GitHub Repository
https://github.com/carlvisagie/purposeful-live-coaching

### Deployment Method
- Push to `main` branch → Render auto-deploys
- Deployments take 5-10 minutes
- Check bundle hash to verify deployment

### Environment Variables (Render)
- DATABASE_URL (PostgreSQL connection string)
- OPENAI_API_KEY (user's OpenAI API key)
- STRIPE_SECRET_KEY (Stripe payments)
- JWT_SECRET (session management)

---

## 📝 RECENT FIXES (DON'T REDO THESE)

### December 10, 2025 - Manus OAuth Removed ✅
**Commits:** 639e715 + 50d6dc0

**What was fixed:**
- Removed `getLoginUrl()` function that generated Manus OAuth URLs
- Removed OAuth error interceptors in `main.tsx`
- Disabled `getMySubscription` query on Pricing page
- Updated 7 components to use `LOGIN_URL` instead of `getLoginUrl()`

**Result:** Frontend is 100% Manus-free, guest checkout works

### December 10, 2025 - AI Coach LLM Fixed ✅
**Commit:** d7e8a38

**What was fixed:**
- Changed model from `gemini-2.5-flash` to `gpt-4o`
- Fixed PostgreSQL syntax bugs
- Fixed guest user support

**Result:** AI Coach works with user's OpenAI API key

### December 10, 2025 - Database Migration ✅
**What was fixed:**
- Updated DATABASE_URL with correct PostgreSQL password
- Created AI Chat tables in production
- Fixed MySQL→PostgreSQL code bugs

**Result:** Database connection working, AI Chat functional

---

## ⚠️ COMMON MISTAKES TO AVOID

### Mistake #1: "Let me rebuild the AI Coach"
**NO!** It's already built and working. Check `client/src/pages/AICoach.tsx` and `server/routers/aiChat.ts`

### Mistake #2: "Let me add Manus OAuth"
**NO!** We just spent hours removing it. Use simple session-based auth instead.

### Mistake #3: "Let me use MySQL syntax"
**NO!** Production uses PostgreSQL. Use `.returning()` and `.id` instead of `.insertId`

### Mistake #4: "Let me require login for pricing"
**NO!** Guest checkout MUST work. Don't block unauthenticated users.

### Mistake #5: "Let me use gemini model"
**NO!** AI Coach uses GPT-4o with user's OPENAI_API_KEY. Don't change it.

### Mistake #6: "Documentation is probably outdated"
**NO!** Documentation was updated TODAY (December 10, 2025). Read it.

### Mistake #7: "Let me create a new feature without checking"
**NO!** Check if it already exists first. We have 31 pages and 31 routers.

---

## ✅ CHECKLIST BEFORE YOU START CODING

- [ ] I have read this entire file
- [ ] I have read README.md
- [ ] I have read PROJECT_MASTER_GUIDE_UPDATED.md
- [ ] I have read ACTUAL_STATUS_REPORT.md
- [ ] I understand ZERO MANUS CODE rule
- [ ] I know production uses PostgreSQL (not MySQL)
- [ ] I know AI Coach uses GPT-4o (not Gemini)
- [ ] I know guest checkout must work
- [ ] I have checked if the feature already exists
- [ ] I have verified current deployment status
- [ ] I have read recent commits (git log)
- [ ] I understand the consequences of not reading docs

---

## 🆘 IF YOU'RE CONFUSED

**DON'T GUESS. ASK THE OWNER.**

Better to ask a "stupid" question than to waste hours fixing your mistakes.

**Owner:** Carl Visagie (@carlvisagie)

---

## 🎯 YOUR MISSION

**Build on what exists. Don't rebuild what's already there.**

This platform is 78% complete. Your job is to:
1. Complete the remaining 22%
2. Fix actual bugs (not imaginary ones)
3. Add missing features (after verifying they're actually missing)
4. Update documentation when you make changes

**NOT to:**
1. Rebuild existing features
2. Add Manus code
3. Break guest checkout
4. Change working configurations
5. Ignore documentation

---

## 📚 DOCUMENTATION FILES (READ THESE)

1. **⚠️_READ_THIS_FIRST_⚠️.md** (this file) - Mandatory rules
2. **README.md** - Project overview
3. **PROJECT_MASTER_GUIDE_UPDATED.md** - Complete technical guide
4. **ACTUAL_STATUS_REPORT.md** - What's actually built
5. **MANUS_OAUTH_REMOVAL_COMPLETE.md** - OAuth removal details
6. **EXECUTIVE_SUMMARY.md** - Executive findings

---

## 🚀 NOW YOU CAN START

If you've read everything above and checked all the boxes, you're ready to start coding.

**Remember:**
- Read before you code
- Check before you create
- Ask before you assume
- Document after you fix

**Good luck, and please don't break what's already working!**

---

**Last Updated:** December 10, 2025 - 23:00 UTC  
**Status:** Mandatory reading for all agents  
**Violations:** Will result in wasted time and frustration
