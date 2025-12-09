# DEPENDENCY REMOVAL STRATEGY

**Based on Industry Best Practices Research**  
**Date:** December 9, 2025  
**Goal:** Remove all Manus-specific code and create standalone, reliable platform

---

## 📚 RESEARCH FINDINGS

### Key Principles (Source: Christoph Nakazawa, Meta Engineer)

1. **Take Ownership** - Don't let dependencies control your stack
2. **Analyze First** - Understand what you have before removing
3. **Remove Unused** - Dead weight slows everything down
4. **Keep Updated** - Avoid "upgrade cliffs"
5. **Deduplicate** - Multiple versions = wasted space
6. **Fork When Needed** - Control critical dependencies
7. **Track Size** - Monitor dependency bloat

### What Makes Production Code Reliable

1. **Minimal Dependencies** - Fewer things to break
2. **Standard APIs** - Use industry standards, not proprietary
3. **Clear Ownership** - Know what every dependency does
4. **Easy Maintenance** - Can upgrade without breaking
5. **Framework Agnostic** - Not tied to specific platforms

---

## 🎯 OUR STRATEGY

### Phase 1: Analyze Manus Dependencies ✅ (DONE)

**Found:**
- `vite-plugin-manus-runtime` in package.json
- `ManusDialog.tsx` component
- Manus-specific comments in multiple files
- `storage.ts` - Manus WebDev template code
- `map.ts` - Manus Maps integration
- `notification.ts` - Manus notification service
- `emailAutomation.ts` - Manus notification API
- `db-auth.ts` - References Manus OAuth
- Schema comments about Manus OAuth

### Phase 2: Categorize by Risk

**HIGH RISK (Will break if removed without replacement):**
1. `vite-plugin-manus-runtime` - Build system dependency
2. `storage.ts` - File storage functionality
3. `notification.ts` - Push notifications
4. `emailAutomation.ts` - Email sending
5. `map.ts` - Google Maps integration

**MEDIUM RISK (May break some features):**
6. `ManusDialog.tsx` - Login dialog component
7. `db-auth.ts` - Authentication helpers

**LOW RISK (Safe to remove/update):**
8. Comments and documentation
9. Schema field descriptions
10. Test URLs

### Phase 3: Replace with Standard Alternatives

**Replacements Needed:**

1. **vite-plugin-manus-runtime** → Standard Vite config
   - Research: Check what this plugin does
   - Replace: Use standard Vite plugins

2. **storage.ts (S3)** → AWS SDK directly
   - Replace: `@aws-sdk/client-s3`
   - Standard S3 operations
   - No Manus wrapper

3. **notification.ts** → Standard push notification service
   - Options: Firebase Cloud Messaging, OneSignal, Pusher
   - Research: Which is most reliable?

4. **emailAutomation.ts** → Standard email service
   - Options: SendGrid, Mailgun, AWS SES
   - Research: Best for transactional emails

5. **map.ts** → Direct Google Maps API
   - Replace: `@googlemaps/js-api-loader`
   - Standard Google Maps integration

6. **ManusDialog.tsx** → Custom auth dialog
   - Build: Standard React component
   - Use: Auth0, Clerk, or custom OAuth

---

## 📋 EXECUTION PLAN

### Step 1: Analyze vite-plugin-manus-runtime
- [ ] Check what features it provides
- [ ] Identify what breaks without it
- [ ] Find standard Vite alternatives

### Step 2: Replace Storage
- [ ] Install `@aws-sdk/client-s3`
- [ ] Rewrite `storage.ts` with AWS SDK
- [ ] Test file upload/download
- [ ] Update all storage calls

### Step 3: Replace Notifications
- [ ] Choose notification service (Firebase/OneSignal/Pusher)
- [ ] Install SDK
- [ ] Rewrite `notification.ts`
- [ ] Test push notifications

### Step 4: Replace Email
- [ ] Choose email service (SendGrid/Mailgun/SES)
- [ ] Install SDK
- [ ] Rewrite `emailAutomation.ts`
- [ ] Test email sending

### Step 5: Replace Maps
- [ ] Install `@googlemaps/js-api-loader`
- [ ] Rewrite `map.ts`
- [ ] Test map functionality

### Step 6: Replace Auth Dialog
- [ ] Build custom auth dialog component
- [ ] Remove `ManusDialog.tsx`
- [ ] Update auth flows

### Step 7: Clean Up Comments
- [ ] Remove Manus references from comments
- [ ] Update documentation
- [ ] Update schema descriptions

### Step 8: Remove Package
- [ ] Remove `vite-plugin-manus-runtime` from package.json
- [ ] Update vite.config.ts
- [ ] Test build process

---

## ✅ SUCCESS CRITERIA

**Before Deployment:**
1. ✅ All tests pass
2. ✅ Build completes without errors
3. ✅ No Manus imports in code
4. ✅ No Manus packages in package.json
5. ✅ All features work with standard APIs
6. ✅ Documentation updated
7. ✅ Deployment works on Render

**After Deployment:**
8. ✅ All pages load correctly
9. ✅ Stripe checkout works
10. ✅ AI Coach works
11. ✅ Admin dashboard works
12. ✅ File storage works
13. ✅ Notifications work (if implemented)
14. ✅ Email works (if implemented)
15. ✅ Maps work (if implemented)

---

## 🚨 RISKS & MITIGATION

### Risk 1: Breaking Production
**Mitigation:**
- Test everything locally first
- Create backup branch
- Deploy to staging if available
- Have rollback plan ready

### Risk 2: Unknown Dependencies
**Mitigation:**
- Thoroughly analyze what each Manus feature does
- Document all replacements
- Test incrementally

### Risk 3: Time Investment
**Mitigation:**
- Do it right, not fast
- Follow research-backed best practices
- Don't rush to production

---

## 📊 PROGRESS TRACKER

**Phase 1: Analysis** - ✅ COMPLETE  
**Phase 2: Categorization** - ✅ COMPLETE  
**Phase 3: Replacement** - ⏳ IN PROGRESS  

**Current Task:** Analyzing vite-plugin-manus-runtime

---

## 🎓 LESSONS FROM RESEARCH

### From Meta/Facebook (Christoph Nakazawa):
- Reduced React Native dependencies by 10x
- Improved install times by equal factor
- Sustained wins through ownership

### Key Takeaway:
> "We gain option value and control by removing dependencies or by actively maintaining them."

### Our Application:
- Remove Manus dependencies completely
- Use standard, well-maintained packages
- Take full ownership of our stack
- Build for long-term reliability

---

**Next Steps:** Analyze vite-plugin-manus-runtime and begin systematic replacement

**Timeline:** 2-3 days for complete removal (doing it RIGHT)

**Owner:** Autonomous Agent (following research-backed best practices)
