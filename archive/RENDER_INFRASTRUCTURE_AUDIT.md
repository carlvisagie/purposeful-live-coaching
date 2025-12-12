# Render Infrastructure Audit
**Date:** December 9, 2025
**Account:** carlhvisagie@gmail.com

---

## WEB SERVICES (9 total)

### 1. **New-backend** ⚠️ UNCLEAR PURPOSE
- **ID:** srv-d4qhk3q4i8rc73fqbk50
- **URL:** https://new-backend-pg54.onrender.com
- **Repo:** github.com/carlvisagie/purposeful-live-coaching
- **Branch:** main
- **Environment:** Docker
- **Plan:** Starter
- **Status:** Live
- **Created:** Dec 7, 2025
- **Notes:** Same repo as purposeful-live-backend, unclear why duplicate exists

### 2. **purposeful-individual** ✅ ACTIVE
- **ID:** srv-d4m1h0c9c44c73fpgdqg
- **URL:** https://purposeful-individual.onrender.com
- **Repo:** github.com/carlvisagie/purposeful-individual
- **Branch:** main
- **Environment:** Node
- **Build:** `pnpm install && pnpm run build`
- **Start:** `node dist/index.js`
- **Plan:** Starter
- **Status:** Live
- **Created:** Nov 30, 2025

### 3. **purposeful-live-backend** 🎯 PRIMARY SERVICE (BROKEN)
- **ID:** srv-d4m1guc9c44c73fpgde0
- **URL:** https://purposeful-live-backend.onrender.com
- **Repo:** github.com/carlvisagie/purposeful-live-coaching
- **Branch:** main
- **Environment:** ❌ **PYTHON** (WRONG!)
- **Build:** `pnpm install && pnpm run build` (Node.js command)
- **Start:** `node dist/index.js` (Node.js command)
- **Plan:** Starter
- **Status:** Live (but deployments failing)
- **Storage:** 5GB disk mounted at /data/videos
- **Created:** Nov 30, 2025
- **CRITICAL ISSUE:** Environment set to Python but running Node.js commands

### 4. **purposeful-live-api** ⚠️ UNCLEAR PURPOSE
- **ID:** srv-d4m1gvbe5dus73bfhvgg
- **URL:** https://purposeful-live-api.onrender.com
- **Repo:** github.com/carlvisagie/purposeful-live-coaching
- **Branch:** main
- **Environment:** Node
- **Build:** `pnpm install && pnpm run build`
- **Start:** `node dist/index.js`
- **Plan:** Starter
- **Status:** Live
- **Created:** Nov 30, 2025
- **Notes:** Same repo as purposeful-live-backend, unclear differentiation

### 5. **purposeful-ai-backend-1** ⚠️ UNCLEAR PURPOSE
- **ID:** srv-d4h13815pdvs738ueub0
- **URL:** https://purposeful-ai-backend-1.onrender.com
- **Repo:** github.com/carlvisagie/purposeful-ai-backend
- **Branch:** main
- **Environment:** Node
- **Build:** `pip install -r requirements.txt` (Python command in Node env!)
- **Start:** `cd backend && python ai_api.py`
- **Plan:** Starter
- **Status:** Live
- **Created:** Nov 24, 2025
- **Notes:** Mismatched environment (Node with Python commands)

### 6. **purposeful-dashboard** ✅ ACTIVE
- **ID:** srv-d4ga21ruibrs73991l60
- **URL:** https://purposeful-dashboard.onrender.com
- **Repo:** github.com/carlvisagie/purposeful-dashboard
- **Branch:** main
- **Environment:** Node
- **Build:** `pnpm install && pnpm build`
- **Start:** `NODE_ENV=production node dist/index.js`
- **Plan:** Standard (PAID)
- **Status:** Live
- **Created:** Nov 21, 2025

### 7. **purposeful-live-frontend** ✅ STATIC SITE
- **ID:** srv-d0u66au3jp1c73fgfh1g
- **URL:** https://purposeful-live-frontend.onrender.com
- **Repo:** github.com/carlvisagie/purposeful-live-frontend
- **Branch:** main
- **Type:** Static Site
- **Plan:** Starter
- **Status:** Live
- **Created:** Jun 1, 2025

### 8. **purposeful-ai-backend** 🐍 PYTHON SERVICE
- **ID:** srv-d0tv6fc9c44c73a0cod0
- **URL:** https://purposeful-ai-backend.onrender.com
- **Repo:** github.com/carlvisagie/purposeful-ai-backend
- **Branch:** main
- **Environment:** Python (CORRECT)
- **Build:** `pip install -r requirements.txt`
- **Start:** `cd backend && python ai_api.py`
- **Plan:** Starter
- **Status:** Live
- **Created:** Jun 1, 2025

### 9. **coaching-platform** 🐳 DOCKER (OLD)
- **ID:** srv-d0ko5cnfte5s738rs8vg
- **URL:** https://coaching-platform.onrender.com
- **Repo:** github.com/carlvisagie/coaching-platform
- **Branch:** master
- **Environment:** Docker
- **Plan:** Free
- **Status:** Live
- **Last Deploy:** Dec 6, 2025 (commit from May 18, 2025 - VERY OLD)
- **Created:** May 18, 2025
- **Notes:** Running 7-month-old code

---

## DATABASES (2 total)

### 1. **purposefullive-db** 💰 PAID PRIMARY
- **ID:** dpg-d4npae6uk2gs73fppev0-a
- **Type:** PostgreSQL 18
- **Database:** purposefullive_db
- **User:** purposefullive_db_user
- **Plan:** basic_256mb (PAID)
- **Size:** 15GB
- **Region:** Oregon
- **Access:** Open (0.0.0.0/0)
- **Status:** Available
- **Created:** Dec 3, 2025

### 2. **purposeful-db** 🆓 FREE (EXPIRES JAN 6, 2026)
- **ID:** dpg-d4qiaj49c44c73bdha6g-a
- **Type:** PostgreSQL 16
- **Database:** purposeful
- **User:** purposeful_user
- **Plan:** Free
- **Region:** Oregon
- **Status:** Available
- **Created:** Dec 7, 2025
- **⚠️ EXPIRES:** January 6, 2026 (28 days)

---

## CRITICAL ISSUES

### 🔴 **Issue #1: purposeful-live-backend Environment Mismatch**
- Service configured as "python" environment
- But running Node.js commands (`pnpm`, `node`)
- This causes deployment failures
- **Impact:** Auto-deploy broken, migrations not running

### 🔴 **Issue #2: Multiple Services for Same Repo**
- `purposeful-live-coaching` repo deployed to 3 services:
  - purposeful-live-backend (broken)
  - purposeful-live-api (working?)
  - New-backend (unclear)
- **Confusion:** Which one is production?

### 🟡 **Issue #3: Duplicate AI Backend Services**
- `purposeful-ai-backend` (Python, correct)
- `purposeful-ai-backend-1` (Node env with Python commands, broken)

### 🟡 **Issue #4: Old Code Running**
- `coaching-platform` running 7-month-old code
- Last commit: May 18, 2025
- **Risk:** Security vulnerabilities, missing features

### 🟡 **Issue #5: Free Database Expiring**
- `purposeful-db` expires Jan 6, 2026
- Need to migrate data or upgrade plan

---

## COST ANALYSIS

**Paid Services:**
- purposeful-dashboard: Standard plan
- purposefullive-db: basic_256mb plan

**Free/Starter Services:**
- 8 web services on Starter/Free plans
- 1 database on Free plan (expiring)

**Recommendation:** Consolidate services to reduce complexity and potential costs

---

## RECOMMENDED ACTIONS

### Immediate (Today)
1. ✅ Fix purposeful-live-backend environment (python → docker or node)
2. ✅ Trigger deployment to run migration script
3. ✅ Test + button functionality

### Short-term (This Week)
1. 🔍 Identify which services are actually in use
2. 🗑️ Delete unused/duplicate services
3. 📊 Clarify service purposes and naming
4. 🔄 Update coaching-platform to latest code or delete

### Medium-term (This Month)
1. 💾 Migrate data from free database before expiration
2. 📋 Document which service serves which purpose
3. 🏗️ Consolidate architecture (fewer services)

---

## QUESTIONS TO ANSWER

1. **What is the difference between:**
   - purposeful-live-backend
   - purposeful-live-api
   - New-backend
   
2. **Are these still needed:**
   - purposeful-ai-backend-1 (broken config)
   - coaching-platform (7 months old)
   
3. **Which database is production:**
   - purposefullive-db (paid)
   - purposeful-db (free, expiring)

4. **What is purposeful-individual used for?**

---

**Next Step:** Fix purposeful-live-backend environment configuration to enable deployments
