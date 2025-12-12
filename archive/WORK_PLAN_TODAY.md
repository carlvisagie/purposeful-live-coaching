# Work Plan - Making Platform 100% Ready for First Client

## Mission
Complete all remaining setup tasks while user is at work so the platform is ready for the first client with Insta360 Link webcam + Rhode NT1 mic + Focusrite Scarlett interface.

## Discovery from Previous Session
- ✅ Platform deployed to Render.com at https://purposeful-individual.onrender.com
- ✅ Database fully migrated (36 tables)
- ✅ Stripe webhook configured
- ✅ Homepage and pricing pages working
- ⚠️ Issue: "not configured" error is OAuth-related (not Stripe)
- ⚠️ Platform uses **Calendly** for booking (not Stripe payment forms)
- ⚠️ OAuth not configured for independent Render deployment

## Phase 1: Fix Authentication (CRITICAL)
**Problem:** OAuth redirects to `#oauth-not-configured` because VITE_OAUTH_PORTAL_URL and VITE_APP_ID are not set on Render.

**Solution Options:**
1. **Option A (Quick Fix):** Make booking pages work without authentication
2. **Option B (Proper Fix):** Implement email/password authentication
3. **Option C (Hybrid):** Public booking + optional login for dashboard

**Recommended:** Option C - Public booking works immediately, authenticated features for later

### Tasks:
- [ ] Fix `getLoginUrl()` in client/src/const.ts to return '/login' instead of '#oauth-not-configured'
- [ ] Create simple Login.tsx page
- [ ] Make BookSession.tsx work without authentication (public access)
- [ ] Test booking flow end-to-end

## Phase 2: Verify Calendly Integration
**Current State:** BookSession.tsx uses Calendly widgets for scheduling

### Tasks:
- [ ] Check if Calendly URLs are configured
- [ ] Test Calendly booking widget loads
- [ ] Verify payment flow after Calendly booking
- [ ] Document Calendly setup for user

## Phase 3: Audio/Video Hardware Research
**User's Setup:**
- Insta360 Link webcam
- Rhode NT1 microphone
- Focusrite Scarlett audio interface

### Research Tasks:
- [ ] Insta360 Link browser compatibility and WebRTC support
- [ ] Rhode NT1 + Focusrite Scarlett configuration for web conferencing
- [ ] Browser permissions setup (camera/microphone)
- [ ] Recommended settings for crystal-clear coaching sessions
- [ ] Troubleshooting guide for common issues
- [ ] Test procedure before first client

## Phase 4: End-to-End Testing
- [ ] Homepage loads correctly
- [ ] Pricing page displays all tiers
- [ ] Book Session page works (Calendly widget)
- [ ] Payment processing works (Stripe backend)
- [ ] Email notifications send correctly
- [ ] Mobile responsive design
- [ ] All links work (no 404s)

## Phase 5: Documentation
- [ ] Deployment checklist
- [ ] Hardware setup guide (webcam + mic + interface)
- [ ] Pre-session testing procedure
- [ ] First client preparation checklist
- [ ] Troubleshooting guide
- [ ] Remaining manual configuration steps

## Success Criteria
When user returns from work, they should be able to:
1. ✅ Book a session via Calendly
2. ✅ Process payment via Stripe
3. ✅ Test their webcam + microphone setup
4. ✅ Be 100% ready for their first client

## Current Status
- Project restored from checkpoint
- Starting Phase 1: Fix Authentication
