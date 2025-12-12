# Platform Testing Guide - Post-Auth Fix

## Overview

This guide provides step-by-step testing instructions for verifying all platform features work correctly after removing authentication gates.

---

## Quick Test Checklist

### Core Pages (Must Work)
- [ ] `/` - Homepage loads
- [ ] `/dashboard` - Main dashboard loads with stats
- [ ] `/coach/dashboard` - Coach dashboard loads
- [ ] `/ai-coach` - AI chat interface loads
- [ ] `/clients` - Client list loads
- [ ] `/my-sessions` - Sessions page loads
- [ ] `/pricing` - Pricing page loads

### Admin Pages (Must Work)
- [ ] `/admin/ai-monitoring` - AI monitoring dashboard loads
- [ ] `/admin/client-history` - Client history loads

### Feature Tests (Must Work)
- [ ] AI chat can send/receive messages
- [ ] Can create new client
- [ ] Can view client details
- [ ] Stripe checkout can be initiated
- [ ] File upload works

---

## Detailed Testing Instructions

### 1. Homepage Test

**URL:** `https://purposeful-live-backend.onrender.com/`

**Expected:**
- Page loads without errors
- Hero section visible
- "Start 7-Day Free Trial" button present
- "You're Not Alone" section visible
- No console errors

**Pass Criteria:**
✅ Page renders completely  
✅ All sections visible  
✅ No JavaScript errors  

---

### 2. Dashboard Test

**URL:** `https://purposeful-live-backend.onrender.com/dashboard`

**Expected:**
- Dashboard loads immediately (no auth prompt)
- Stats cards show numbers (even if 0)
- Quick Actions section visible
- Upcoming Sessions section visible
- Recent Clients section visible

**Pass Criteria:**
✅ No "Authentication Required" message  
✅ Dashboard renders with data  
✅ Navigation works  
✅ No console errors  

---

### 3. Coach Dashboard Test

**URL:** `https://purposeful-live-backend.onrender.com/coach/dashboard`

**Expected:**
- Page loads immediately (no "Access Denied")
- Script teleprompter visible
- Coach stats visible
- Quick actions available

**Pass Criteria:**
✅ No access denied message  
✅ Full dashboard visible  
✅ All sections render  

---

### 4. AI Coach Test

**URL:** `https://purposeful-live-backend.onrender.com/ai-coach`

**Expected:**
- Chat interface loads
- Can type message
- Can send message
- Receives AI response
- No subscription required message

**Pass Criteria:**
✅ Chat interface loads  
✅ Can send messages  
✅ AI responds (if OpenAI key set)  
✅ No subscription gate  

**Test Message:**
```
Hello, I'm feeling stressed today. Can you help?
```

**Expected Response:**
AI should respond with empathetic coaching message.

---

### 5. Client Management Test

**URL:** `https://purposeful-live-backend.onrender.com/clients`

**Expected:**
- Client list page loads
- "Add New Client" button visible
- Can click to add new client
- Client list shows (empty or with data)

**Pass Criteria:**
✅ Page loads  
✅ Can navigate to new client form  
✅ List renders properly  

**Test Flow:**
1. Click "Add New Client"
2. Fill in client details
3. Save client
4. Verify appears in list

---

### 6. Sessions Test

**URL:** `https://purposeful-live-backend.onrender.com/my-sessions`

**Expected:**
- Sessions page loads
- Shows upcoming/past sessions
- Can view session details

**Pass Criteria:**
✅ Page loads  
✅ Sessions list visible  
✅ No errors  

---

### 7. Pricing Page Test

**URL:** `https://purposeful-live-backend.onrender.com/pricing`

**Expected:**
- Pricing tiers visible
- Stripe checkout buttons work
- Can initiate payment flow

**Pass Criteria:**
✅ All pricing tiers visible  
✅ Buttons clickable  
✅ Stripe checkout opens  

**Test Flow:**
1. Click "Start Free Trial" on any tier
2. Verify Stripe checkout opens
3. (Don't complete payment in test)

---

### 8. Admin AI Monitoring Test

**URL:** `https://purposeful-live-backend.onrender.com/admin/ai-monitoring`

**Expected:**
- Admin dashboard loads
- Quality metrics visible
- Conversations list visible
- No permission errors

**Pass Criteria:**
✅ Dashboard loads  
✅ All sections visible  
✅ No access denied  

---

### 9. File Upload Test

**URL:** `https://purposeful-live-backend.onrender.com/my-files`

**Expected:**
- File upload interface loads
- Can select file
- Can upload file
- File appears in list

**Pass Criteria:**
✅ Upload interface works  
✅ Files can be uploaded  
✅ Files are stored  

---

## Backend API Tests

### Test tRPC Endpoints

**Method:** Browser DevTools Console

**Test auth.me:**
```javascript
// Should return mock user
fetch('/api/trpc/auth.me').then(r => r.json()).then(console.log)
```

**Expected Response:**
```json
{
  "result": {
    "data": {
      "id": 1,
      "email": "demo@purposefullive.com",
      "name": "Demo Coach",
      "role": "admin"
    }
  }
}
```

---

## Database Tests

### Verify Database Connection

**Check Render Logs:**
```
[Database] Connected successfully
```

**Test Query:**
- Navigate to any page that loads data
- Check if data loads (clients, sessions, etc.)
- No database connection errors in logs

---

## External Service Tests

### OpenAI API Test

**Test:** Send message in AI Coach

**Expected:**
- If `OPENAI_API_KEY` set: AI responds
- If not set: Error message shown

**Verify in Render Logs:**
```
[LLM] API call successful
```

### Stripe API Test

**Test:** Click pricing tier button

**Expected:**
- Stripe checkout opens
- No API errors

**Verify in Render Logs:**
```
[Stripe] Checkout session created
```

### Resend Email Test

**Test:** Create new booking

**Expected:**
- Booking confirmation email sent
- Or logged to console if API key missing

**Verify in Render Logs:**
```
[Email] Sent successfully
```

---

## Common Issues & Solutions

### Issue: Page shows "Authentication Required"

**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check if latest code deployed

### Issue: API returns 401 Unauthorized

**Solution:**
- Check backend context.ts has mock user
- Verify deployment succeeded
- Check Render logs for errors

### Issue: TypeScript errors in console

**Solution:**
- Run `pnpm exec tsc --noEmit`
- Fix any type errors
- Redeploy

### Issue: Database queries fail

**Solution:**
- Check `DATABASE_URL` env var set
- Verify database is running
- Check Render logs for connection errors

---

## Performance Checks

### Page Load Times

**Acceptable:**
- Homepage: < 2 seconds
- Dashboard: < 3 seconds
- AI Chat: < 2 seconds

**Test:**
- Open DevTools Network tab
- Reload page
- Check "Load" time

### API Response Times

**Acceptable:**
- Simple queries: < 500ms
- AI chat: < 5 seconds
- File uploads: < 3 seconds

---

## Security Checks

### Verify No Sensitive Data Exposed

**Check:**
- No API keys in client-side code
- No database credentials in responses
- No user passwords visible

### Verify CORS Working

**Test:**
- All API calls succeed
- No CORS errors in console

---

## Deployment Verification

### Post-Deployment Checklist

After deploying to Render:

1. **Build Success**
   - [ ] Render build completed
   - [ ] No build errors
   - [ ] Deploy status: "Live"

2. **Server Running**
   - [ ] Health check passes
   - [ ] No crash loops
   - [ ] Logs show "Server running"

3. **Database Connected**
   - [ ] Connection successful
   - [ ] Migrations applied
   - [ ] Queries working

4. **Environment Variables**
   - [ ] All required vars set
   - [ ] No missing env errors
   - [ ] Services initialized

5. **Core Features**
   - [ ] Homepage loads
   - [ ] Dashboard accessible
   - [ ] AI chat works
   - [ ] Payments work

---

## Success Criteria

**Platform is considered FULLY WORKING when:**

✅ All 7 core pages load without errors  
✅ All 2 admin pages accessible  
✅ AI chat sends/receives messages  
✅ Client management works  
✅ Stripe checkout opens  
✅ No authentication blocks  
✅ No console errors  
✅ No TypeScript errors  
✅ Database queries work  
✅ External APIs respond  

---

## Reporting Issues

If any test fails:

1. **Document the issue:**
   - URL where it occurs
   - Expected behavior
   - Actual behavior
   - Console errors
   - Network errors

2. **Check Render logs:**
   - Look for error messages
   - Note timestamps
   - Copy relevant logs

3. **Provide context:**
   - Which test failed
   - Steps to reproduce
   - Browser/device used

---

**Testing completed successfully = Platform ready for use** ✅
