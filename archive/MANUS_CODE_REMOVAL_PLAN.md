# Manus Code Removal Plan

## 🎯 Goal
Remove ALL Manus-specific code and dependencies to make the platform 100% independent.

## 📋 Files to Modify

### 1. **client/src/const.ts**
- ❌ Remove `getLoginUrl()` function entirely
- ✅ Replace with simple `/login` route

### 2. **client/src/main.tsx**
- ❌ Remove `redirectToLoginIfUnauthorized()` function
- ❌ Remove query/mutation error subscribers that redirect to Manus OAuth
- ✅ Replace with toast notifications for errors

### 3. **client/src/_core/hooks/useAuth.ts**
- ❌ Remove stub OAuth hook
- ✅ Replace with real session-based auth hook

### 4. **client/src/pages/Dashboard.tsx**
- ❌ Remove `/api/oauth/logout` reference
- ✅ Replace with `/api/auth/logout`

### 5. **client/src/pages/EmotionTracker.tsx**
- ❌ Remove `getLoginUrl()` call
- ✅ Replace with `/login` redirect

### 6. **client/src/pages/InsightsDashboard.tsx**
- ❌ Remove `getLoginUrl()` call
- ✅ Replace with `/login` redirect

### 7. **client/src/components/DashboardLayout.tsx**
- ❌ Remove `getLoginUrl()` import and usage
- ✅ Replace with `/login` redirect

### 8. **server/_core/env.ts**
- ❌ Remove `oAuthServerUrl` env variable
- ❌ Remove `OAUTH_SERVER_URL` references

### 9. **drizzle/schema.ts**
- ❌ Remove `openId` field comments mentioning Manus
- ✅ Update to generic "OAuth identifier" or remove entirely

### 10. **Environment Variables (Render)**
- ❌ Remove `OAUTH_SERVER_URL`
- ❌ Remove `VITE_OAUTH_PORTAL_URL`
- ❌ Remove `VITE_APP_ID`
- ✅ Keep only: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, STRIPE keys

## 🔧 Implementation Steps

### Step 1: Create Independent Login Page
- Create `/client/src/pages/Login.tsx`
- Email/password form
- Magic link option
- No OAuth

### Step 2: Replace getLoginUrl() with /login
- Find all `getLoginUrl()` calls
- Replace with `window.location.href = '/login'`

### Step 3: Remove OAuth Error Handling
- Remove `redirectToLoginIfUnauthorized()` from main.tsx
- Add toast notifications for errors instead

### Step 4: Update Auth Routes
- Remove `/api/oauth/callback`
- Remove `/api/oauth/logout`
- Keep `/api/auth/login`, `/api/auth/logout`, `/api/auth/session`

### Step 5: Clean Up Environment
- Remove OAuth env vars from Render
- Update `.env.example` to remove OAuth vars

### Step 6: Test Guest Checkout
- Verify pricing page works without login
- Verify Stripe checkout works
- Verify AI Coach works for guests

### Step 7: Document Changes
- Update README
- Update PROJECT_MASTER_GUIDE
- Update CONSOLIDATION_STATUS

## ✅ Success Criteria

1. ✅ No references to "manus" in code (except comments)
2. ✅ No references to "oauth" except standard OAuth libraries
3. ✅ Pricing "Get Started" works without login
4. ✅ AI Coach works for guests
5. ✅ No redirects to manus.im domain
6. ✅ All authentication is session-based
7. ✅ Platform is 100% independent

## 📊 Estimated Time
- **2-3 hours** for complete removal and testing

## 🚨 Risk Assessment
- **Low risk** - Most OAuth code is already stubbed/commented
- **No data loss** - Only removing unused code
- **Easy rollback** - All changes in git

---

**Status:** Ready to execute
**Priority:** HIGH (blocking pricing page)
**Dependencies:** None
