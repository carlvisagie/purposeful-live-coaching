# Complete Platform Audit & Fix Plan

## Issues Found

### 1. Authentication Blocking Everything
- [ ] Dashboard requires login but OAuth disabled
- [ ] Coach dashboard blocked
- [ ] Admin pages blocked
- [ ] All protected routes inaccessible

### 2. Backend Issues to Check
- [ ] tRPC procedures requiring auth
- [ ] Database queries failing
- [ ] Protected procedures blocking access
- [ ] Context user checks

### 3. Frontend Issues to Check
- [ ] useAuth() hooks blocking renders
- [ ] Protected route components
- [ ] Sign-in redirects
- [ ] Navigation guards

### 4. Feature-Specific Issues
- [ ] AI Coach accessible?
- [ ] Session booking works?
- [ ] Client management works?
- [ ] Stripe payments functional?
- [ ] File uploads working?
- [ ] Email notifications sending?

### 5. Navigation Issues
- [ ] All routes defined in App.tsx?
- [ ] Links working properly?
- [ ] 404 pages vs actual pages?
- [ ] Redirects functioning?

---

## Fix Strategy

### Phase 1: Remove All Auth Gates
1. Comment out all `if (!user)` checks in pages
2. Make all tRPC procedures public (or mock user)
3. Remove DashboardLayout auth requirements
4. Make useAuth() return mock user

### Phase 2: Fix Backend
1. Change all `protectedProcedure` to `publicProcedure`
2. Or mock ctx.user in context
3. Fix database queries that depend on user ID
4. Test all tRPC routes

### Phase 3: Fix Frontend
1. Remove auth checks from all pages
2. Fix navigation components
3. Test all major user flows
4. Ensure no dead ends

### Phase 4: Test Everything
1. Homepage → works
2. Dashboard → loads with data
3. AI Coach → chat works
4. Booking → can create session
5. Payments → Stripe checkout works
6. Admin → all admin features accessible

---

## Files to Fix

### Frontend Pages (Remove Auth):
- client/src/pages/Dashboard.tsx ✅ DONE
- client/src/pages/CoachDashboard.tsx
- client/src/pages/Clients.tsx
- client/src/pages/AICoach.tsx
- client/src/pages/MySessions.tsx
- client/src/pages/AdminAIMonitoring.tsx
- client/src/pages/AdminClientHistory.tsx
- All other protected pages

### Frontend Components:
- client/src/components/DashboardLayout.tsx
- client/src/contexts/AuthContext.tsx (if exists)
- client/src/hooks/useAuth.ts (if exists)

### Backend Procedures:
- server/routers.ts - Change protectedProcedure to publicProcedure
- server/_core/context.ts - Mock user in context
- All router files in server/routers/

---

## Testing Checklist

After fixes:
- [ ] / → Homepage loads
- [ ] /dashboard → Dashboard loads with stats
- [ ] /coach/dashboard → Coach dashboard loads
- [ ] /clients → Client list loads
- [ ] /ai-coach → AI chat interface loads
- [ ] /my-sessions → Sessions page loads
- [ ] /pricing → Pricing page loads
- [ ] /admin/ai-monitoring → Admin page loads
- [ ] Stripe checkout → Can initiate payment
- [ ] File upload → Can upload files
- [ ] AI chat → Can send messages
- [ ] Navigation → All links work

---

## Deployment Checklist

- [ ] All fixes committed
- [ ] Pushed to GitHub
- [ ] Render auto-deploys
- [ ] Test on live URL
- [ ] All features working
- [ ] No console errors
- [ ] Database connected
- [ ] APIs responding
