# Purposeful Live Coaching - Complete Platform Test Script

## Test Environment
- **Production URL:** https://purposeful-live-coaching-production.onrender.com
- **Test Date:** December 12, 2025
- **Deployment ID:** dep-d4u5a8ruibrs73eorpv0
- **Commit:** "fix: Update pnpm lockfile after removing incompatible dependency"

---

## PRE-TEST CHECKLIST

### ✅ Deployment Status
- [ ] Deployment status = "live"
- [ ] finishedAt timestamp exists
- [ ] No build errors in logs
- [ ] Service health check passes

### ✅ Browser Setup
- [ ] Clear browser cache (Ctrl+Shift+Del)
- [ ] Open incognito/private window
- [ ] Enable console (F12)
- [ ] Enable network tab

---

## TEST SUITE 1: CORE PAGES (29 Pages)

### Public Pages
- [ ] `/` - Homepage loads
- [ ] `/pricing` - All 6 tiers display
- [ ] `/about` - About page loads
- [ ] `/contact` - Contact form works
- [ ] `/terms` - Terms of service loads
- [ ] `/privacy` - Privacy policy loads

### Authentication
- [ ] `/login` - Login page loads
- [ ] `/signup` - Signup page loads
- [ ] Login flow works (test account)
- [ ] Logout works

### Client Dashboard
- [ ] `/dashboard` - Client dashboard loads
- [ ] `/ai-coach` - AI chat interface loads
- [ ] `/my-sessions` - Session booking page loads
- [ ] `/my-profile` - Profile page loads

### Coach Dashboard
- [ ] `/coach/dashboard` - Coach dashboard loads
- [ ] `/coach/availability` - Availability settings load
- [ ] `/live-session` - **CRITICAL: Live Session Assistant loads**

### Admin
- [ ] `/admin` - Admin dashboard loads
- [ ] `/admin/ai-monitoring` - AI monitoring loads

---

## TEST SUITE 2: STRIPE PAYMENTS

### Payment Flow
- [ ] Click "Get Started" on AI Chat tier ($29/month)
- [ ] Stripe checkout loads
- [ ] Test card works (4242 4242 4242 4242)
- [ ] Payment succeeds
- [ ] Redirects to success page
- [ ] Subscription created in database
- [ ] Email confirmation sent (check Stripe dashboard)

### All Tiers
- [ ] AI Chat - $29/month
- [ ] AI + Monthly Check-in - $149/month
- [ ] AI + Weekly Support - $299/month
- [ ] Human Starter - $800/month
- [ ] Human Professional - $1200/month
- [ ] Human Elite - $2000/month

### Stripe Customer Portal
- [ ] Access customer portal from dashboard
- [ ] Can view subscription
- [ ] Can update payment method
- [ ] Can cancel subscription
- [ ] Portal URL points to production (not Manus preview)

---

## TEST SUITE 3: AI COACHING (GPT-4o)

### AI Chat Interface
- [ ] Navigate to `/ai-coach`
- [ ] Chat interface loads
- [ ] Send message: "Hello, I'm feeling anxious today"
- [ ] AI responds within 5 seconds
- [ ] Response is relevant and empathetic
- [ ] Conversation saves to database
- [ ] Can view conversation history

### Crisis Detection
- [ ] Send message: "I'm thinking about hurting myself"
- [ ] Crisis alert triggers
- [ ] Emergency resources displayed
- [ ] Alert logged in database
- [ ] (Optional) Owner notification sent

### Professional Disclaimers
- [ ] Disclaimer visible on AI chat page
- [ ] "Not a substitute for professional help" message
- [ ] Crisis hotline numbers displayed

---

## TEST SUITE 4: VIDEO IMPLEMENTATION ⭐ CRITICAL

### Access Live Session Assistant
- [ ] Log in as coach
- [ ] Navigate to `/live-session`
- [ ] Page loads without errors
- [ ] No console errors

### Video Preview Component
- [ ] "Video Preview" card visible
- [ ] Video element present
- [ ] Placeholder shows "Camera not started" initially
- [ ] 16:9 aspect ratio maintained
- [ ] Professional styling (rounded corners, shadow)

### Equipment Testing
- [ ] "Test Equipment" button visible
- [ ] Click "Test Equipment"
- [ ] Browser requests camera/microphone permissions
- [ ] Allow permissions
- [ ] Video feed appears in preview
- [ ] Video quality indicator shows (e.g., "1280x720 @ 30fps")
- [ ] No lag or stuttering

### Audio Level Monitoring
- [ ] Audio level bar visible
- [ ] Speak into microphone
- [ ] Audio level bar moves in real-time
- [ ] Percentage displays (0-100%)
- [ ] Color changes based on level:
  - Green when >70%
  - Yellow when 30-70%
  - Red when <30%
- [ ] Updates smoothly (<100ms latency)

### Video/Audio Toggle Controls
- [ ] "Toggle Video" button visible
- [ ] "Toggle Microphone" button visible
- [ ] Click "Toggle Video"
  - [ ] Video feed stops
  - [ ] Button turns red
  - [ ] Click again to restart
  - [ ] Button turns green
- [ ] Click "Toggle Microphone"
  - [ ] Audio mutes
  - [ ] Button turns red
  - [ ] Click again to unmute
  - [ ] Button turns green

### Session Recording
- [ ] Click "Start Session"
- [ ] Recording indicator appears
- [ ] Speak and move for 10 seconds
- [ ] Click "End Session"
- [ ] Recording stops
- [ ] Check console for recording blob
- [ ] Check network tab for upload (if implemented)

### Error Handling
- [ ] Deny camera permissions
  - [ ] Helpful error message displays
  - [ ] "Please allow camera access" message
- [ ] Disconnect camera during session
  - [ ] Graceful error handling
  - [ ] Option to reconnect
- [ ] Test on unsupported browser (IE11)
  - [ ] "Please use Chrome" message

### Performance
- [ ] Video preview smooth (30fps)
- [ ] Audio monitoring responsive
- [ ] CPU usage reasonable (<50%)
- [ ] Memory usage stable (no leaks)
- [ ] No frame drops during 5-minute test

---

## TEST SUITE 5: HUMAN COACHING

### Session Booking
- [ ] Log in as client
- [ ] Navigate to `/my-sessions`
- [ ] "Book New Session" button works
- [ ] Calendar displays available slots
- [ ] Can select date/time
- [ ] Booking confirmation works
- [ ] Session appears in "My Sessions"
- [ ] Email confirmation sent

### Coach Dashboard
- [ ] Log in as coach
- [ ] Navigate to `/coach/dashboard`
- [ ] See list of upcoming sessions
- [ ] See client names
- [ ] See session times
- [ ] Can view client profiles

### Availability Settings
- [ ] Navigate to `/coach/availability`
- [ ] Can set weeknight hours (7:30-9:30 PM)
- [ ] Can set weekend hours (9 AM - 9 PM)
- [ ] Can block specific dates
- [ ] Changes save successfully

---

## TEST SUITE 6: DATABASE & BACKEND

### Database Tables (20 tables)
- [ ] `users` - User accounts created
- [ ] `subscriptions` - Stripe subscriptions saved
- [ ] `aiConversations` - AI chat history saved
- [ ] `humanSessionBookings` - Sessions saved
- [ ] `clientProfiles` - Client data saved

### API Endpoints (43 routers)
- [ ] tRPC endpoints respond
- [ ] No 500 errors
- [ ] Authentication works
- [ ] Authorization works (coach vs. client)

### Performance
- [ ] Page load time <3 seconds
- [ ] API response time <500ms
- [ ] Database queries optimized
- [ ] No N+1 query issues

---

## TEST SUITE 7: CROSS-BROWSER COMPATIBILITY

### Desktop Browsers
- [ ] Chrome (latest) - Full support expected
- [ ] Firefox (latest) - Should work
- [ ] Safari (latest) - May have codec issues (VP9)
- [ ] Edge (latest) - Full support expected

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Responsive design works
- [ ] Touch controls work

---

## TEST SUITE 8: SECURITY & PRIVACY

### Authentication
- [ ] Can't access coach pages as client
- [ ] Can't access admin pages as coach
- [ ] Session timeout works
- [ ] CSRF protection enabled

### Data Privacy
- [ ] AI conversations encrypted
- [ ] Video recordings secure
- [ ] Payment data not stored (Stripe only)
- [ ] HIPAA compliance considerations

---

## TEST SUITE 9: OBSERVATIONAL FRAMEWORK

### Framework Status
- [ ] Research completed? (Per Master Guide: NOT STARTED)
- [ ] Framework documented?
- [ ] AI analysis endpoints ready?
- [ ] Face recognition integrated?

**Note:** Per Master Guide, observational framework research is PRIORITY but NOT STARTED. Video can work without it, but AI analysis requires framework first.

---

## TEST SUITE 10: PRODUCTION READINESS

### Revenue Readiness
- [ ] Can accept payments ✅
- [ ] Can deliver AI coaching ✅
- [ ] Can deliver human coaching (video working?) ⚠️
- [ ] Can manage operations ✅

### Marketing Readiness
- [ ] Homepage compelling
- [ ] Pricing clear
- [ ] Value proposition strong
- [ ] Social proof (testimonials)
- [ ] Call-to-action buttons work

### Operational Readiness
- [ ] Coach availability set
- [ ] Email notifications working
- [ ] Customer support process defined
- [ ] Refund policy clear

---

## CRITICAL SUCCESS CRITERIA

### Must Pass (Blockers)
1. ✅ All 29 pages load without errors
2. ✅ Stripe payments work for all 6 tiers
3. ✅ AI chat functional and responsive
4. ⭐ **Video preview displays coach's camera**
5. ⭐ **Audio monitoring works in real-time**
6. ⭐ **Video/audio toggles function correctly**
7. ✅ Session booking works end-to-end
8. ✅ No console errors on any page

### Should Pass (Important)
9. ⚠️ Video recording saves successfully
10. ⚠️ Client video display (WebRTC) - **NOT IMPLEMENTED YET**
11. ⚠️ Video analysis for observational framework - **REQUIRES FRAMEWORK RESEARCH**
12. ✅ Mobile responsive design
13. ✅ Cross-browser compatibility
14. ✅ Performance acceptable

### Nice to Have (Future)
15. ⚠️ Auto-generate Zoom links (API integration)
16. ⚠️ Email automation
17. ⚠️ Referral program
18. ⚠️ Testimonials section

---

## POST-TEST ACTIONS

### If All Tests Pass
1. ✅ Update MASTER_GUIDE.md
   - Change video status from "50% complete" to "100% complete"
   - Update "What's Working" section
   - Update "Next Steps"
2. ✅ Commit and push to GitHub
3. ✅ Announce to owner: "Platform ready for tonight's sessions"
4. ✅ Create marketing checklist

### If Tests Fail
1. ❌ Document failures in detail
2. ❌ Prioritize by severity (blocker vs. minor)
3. ❌ Fix critical issues immediately
4. ❌ Retest after fixes
5. ❌ Update MASTER_GUIDE.md with accurate status

---

## KNOWN ISSUES (From Context)

### Fixed Issues
- ✅ pnpm lockfile out of sync - **FIXED**
- ✅ Incompatible dependency `@builder.io/vite-plugin-jsx-loc` - **REMOVED**
- ✅ Stripe Customer Portal URL pointing to Manus preview - **FIXED**
- ✅ Coach dashboard null error - **FIXED Dec 11**

### Outstanding Issues
- ⚠️ WebRTC two-way video NOT implemented (coach can't see client yet)
- ⚠️ Observational framework research NOT STARTED
- ⚠️ Video storage to S3 NOT implemented
- ⚠️ Face recognition NOT integrated
- ⚠️ Auto-generate Zoom links NOT implemented

---

## TEST EXECUTION LOG

**Tester:** Manus AI  
**Date:** December 12, 2025  
**Deployment:** dep-d4u5a8ruibrs73eorpv0  
**Status:** PENDING (waiting for deployment to complete)

### Results
- [ ] Test Suite 1: Core Pages - PENDING
- [ ] Test Suite 2: Stripe Payments - PENDING
- [ ] Test Suite 3: AI Coaching - PENDING
- [ ] Test Suite 4: Video Implementation - **CRITICAL** - PENDING
- [ ] Test Suite 5: Human Coaching - PENDING
- [ ] Test Suite 6: Database & Backend - PENDING
- [ ] Test Suite 7: Cross-Browser - PENDING
- [ ] Test Suite 8: Security - PENDING
- [ ] Test Suite 9: Observational Framework - N/A (not started)
- [ ] Test Suite 10: Production Readiness - PENDING

### Overall Status
**BLOCKED:** Waiting for deployment to complete

### Next Action
1. Monitor deployment status every 30 seconds
2. When status = "live", begin Test Suite 1
3. Prioritize Test Suite 4 (Video Implementation)
4. Document all findings
5. Update MASTER_GUIDE.md with results
