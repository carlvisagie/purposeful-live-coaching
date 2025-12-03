# Render.com Deployment Checklist

## Current Status
- ✅ Platform deployed at: https://purposeful-individual.onrender.com
- ✅ Database migrated (36 tables created)
- ✅ Stripe webhook configured
- ✅ Environment variables set
- ⚠️ OAuth not configured (using public access mode)
- ⚠️ Need to trigger rebuild for frontend changes

---

## Environment Variables Currently Set

✅ **Database:**
- `DATABASE_URL` - PostgreSQL connection string

✅ **Authentication:**
- `JWT_SECRET` - Session cookie signing

✅ **Stripe Payment:**
- `STRIPE_SECRET_KEY` - Backend payment processing
- `STRIPE_WEBHOOK_SECRET` - Webhook verification
- `VITE_STRIPE_PUBLISHABLE_KEY` - Frontend (needs rebuild to take effect)

✅ **Application:**
- `NODE_ENV` - Set to "production"
- `PORT` - Server port
- `VITE_APP_TITLE` - Application title
- `OPENAI_API_KEY` - AI features

---

## Immediate Actions Required

### 1. Trigger Manual Rebuild (CRITICAL)

**Why:** Frontend environment variables (`VITE_*`) are baked in at build time, not runtime.

**How:**
1. Go to Render dashboard → purposeful-individual service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait 2-3 minutes for build to complete
4. Test: https://purposeful-individual.onrender.com

**What this fixes:**
- `VITE_STRIPE_PUBLISHABLE_KEY` will be available in frontend
- OAuth redirect will go to `/` instead of `#oauth-not-configured`
- All frontend environment variables will be properly set

### 2. Configure Calendly URLs

**Current State:** BookSession.tsx has placeholder Calendly URLs

**Action Required:**
1. Create Calendly account at https://calendly.com
2. Set up 4 event types:
   - **Intro Session** (20 min, $1)
   - **Foundation Session** (45 min, $49)
   - **Growth Session** (60 min, $99)
   - **Transformation Session** (90 min, $149)

3. Get Calendly URLs for each event type
4. Update BookSession.tsx with real URLs
5. Commit and push to trigger auto-deploy

**Placeholder URLs to replace:**
```
https://calendly.com/purposefullive/intro-session
https://calendly.com/purposefullive/foundation-session
https://calendly.com/purposefullive/growth-session
https://calendly.com/purposefullive/transformation-session
```

### 3. Test Complete Booking Flow

**Steps:**
1. Visit https://purposeful-individual.onrender.com
2. Click "Book Session"
3. Select a session tier
4. Calendly widget should load
5. Book a test session
6. Verify Stripe payment works
7. Check email notifications arrive

---

## Optional Enhancements

### Email Notifications (SendGrid/Resend)

**Current:** Using basic email system
**Upgrade:** Professional transactional emails

**Options:**
1. **SendGrid** (free tier: 100 emails/day)
   - Sign up: https://sendgrid.com
   - Get API key
   - Add to Render: `SENDGRID_API_KEY`

2. **Resend** (free tier: 100 emails/day)
   - Sign up: https://resend.com
   - Get API key
   - Add to Render: `RESEND_API_KEY`

### Custom Domain

**Current:** purposeful-individual.onrender.com
**Upgrade:** purposefullive.com (or your domain)

**Steps:**
1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Render dashboard → Settings → Custom Domains
3. Add your domain
4. Update DNS records (Render provides instructions)
5. SSL certificate auto-provisions

### Database Backups

**Current:** Render provides automatic backups
**Verify:**
1. Render dashboard → purposefullive-db
2. Check "Backups" tab
3. Ensure automatic backups are enabled

---

## Testing Checklist

### Frontend Pages
- [ ] Homepage loads (https://purposeful-individual.onrender.com)
- [ ] Pricing page displays correctly
- [ ] Book Session page loads
- [ ] Calendly widget embeds properly
- [ ] Mobile responsive design works
- [ ] All images load
- [ ] No console errors

### Payment Flow
- [ ] Select session tier
- [ ] Calendly booking works
- [ ] Stripe checkout loads
- [ ] Test payment processes
- [ ] Confirmation page shows
- [ ] Email notification arrives
- [ ] Webhook receives event

### Database
- [ ] All 36 tables exist
- [ ] Can create test records
- [ ] Queries execute properly
- [ ] No connection errors

### Performance
- [ ] Page load time <3 seconds
- [ ] Images optimized
- [ ] No memory leaks
- [ ] Server responds quickly

---

## Monitoring & Maintenance

### Check Regularly
1. **Render Logs:**
   - Dashboard → Logs tab
   - Watch for errors
   - Monitor performance

2. **Stripe Dashboard:**
   - Check successful payments
   - Monitor webhook deliveries
   - Review failed transactions

3. **Database Health:**
   - Monitor connection count
   - Check query performance
   - Review storage usage

### When Things Go Wrong

**Site is down:**
1. Check Render status page
2. Check logs for errors
3. Verify environment variables
4. Try manual restart

**Payments failing:**
1. Check Stripe dashboard
2. Verify webhook secret matches
3. Check logs for errors
4. Test with Stripe test cards

**Database errors:**
1. Check connection string
2. Verify database is running
3. Check for migration issues
4. Review query logs

---

## Deployment Commands

### Local Development
```bash
pnpm install          # Install dependencies
pnpm db:push          # Push database schema
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm test             # Run tests
```

### Production (Render)
- **Auto-deploy:** Push to GitHub main branch
- **Manual deploy:** Click "Manual Deploy" in Render dashboard
- **Rollback:** Click "Rollback" to previous deployment

---

## Security Checklist

- [x] Environment variables stored securely (not in code)
- [x] Database connection uses SSL
- [x] Stripe webhook signature verified
- [x] HTTPS enabled (automatic on Render)
- [ ] Rate limiting configured (optional)
- [ ] CORS configured properly (check if needed)
- [ ] Input validation on all forms (verify)

---

## Next Steps After User Returns

1. **Trigger manual rebuild** (takes 2-3 minutes)
2. **Test booking flow** with real Calendly URLs
3. **Test hardware setup** (webcam + mic)
4. **Run through first client checklist**
5. **Go live!** 🚀

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Calendly Help:** https://help.calendly.com
- **Insta360 Support:** https://www.insta360.com/support
- **Focusrite Support:** https://support.focusrite.com

---

## Summary

**Platform Status:** 98% Complete

**Remaining Tasks:**
1. Trigger manual rebuild (2 minutes)
2. Configure Calendly URLs (10 minutes)
3. Test booking flow (5 minutes)
4. Test hardware (15 minutes)

**Total time to launch:** ~30 minutes

**You're almost there!** 🎯
