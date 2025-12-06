# Render Environment Variables - Complete List

## ✅ REQUIRED (Server Won't Start Without These)

### 1. DATABASE_URL
**What:** PostgreSQL database connection string  
**Format:** `postgresql://user:password@host:port/database?sslmode=require`  
**Where to get:** Render auto-creates this when you add PostgreSQL database  
**Example:** `postgresql://user:pass@dpg-xxx.oregon-postgres.render.com/dbname`

### 2. JWT_SECRET
**What:** Secret key for signing session cookies  
**Format:** Any random string (32+ characters recommended)  
**Where to get:** Generate with: `openssl rand -base64 32`  
**Example:** `your-super-secret-jwt-key-here-make-it-long`

### 3. NODE_ENV
**What:** Tells app it's running in production  
**Value:** `production`  
**Where to get:** Just type `production`

---

## ✅ REQUIRED FOR PAYMENTS (Stripe)

### 4. STRIPE_SECRET_KEY
**What:** Stripe API key for processing payments  
**Format:** Starts with `sk_live_` (production) or `sk_test_` (testing)  
**Where to get:** https://dashboard.stripe.com/apikeys  
**Example:** `sk_test_51Abc...xyz`

### 5. STRIPE_WEBHOOK_SECRET
**What:** Secret for verifying Stripe webhook events  
**Format:** Starts with `whsec_`  
**Where to get:** https://dashboard.stripe.com/webhooks (after creating webhook endpoint)  
**Example:** `whsec_abc123...`

### 6. VITE_STRIPE_PUBLISHABLE_KEY
**What:** Stripe public key for frontend checkout  
**Format:** Starts with `pk_live_` or `pk_test_`  
**Where to get:** https://dashboard.stripe.com/apikeys  
**Example:** `pk_test_51Abc...xyz`

---

## ✅ REQUIRED FOR AI FEATURES

### 7. OPENAI_API_KEY
**What:** OpenAI API key for AI coach, transcription, insights  
**Format:** Starts with `sk-proj-` or `sk-`  
**Where to get:** https://platform.openai.com/api-keys  
**Cost:** ~$5-20/month pay-as-you-go  
**Example:** `sk-proj-abc123...`

**What breaks without it:**
- AI Chat Coach
- Live session transcription
- Client file transcription
- AI-powered insights

---

## ⚠️ OPTIONAL (Nice to Have)

### 8. RESEND_API_KEY
**What:** Email service for sending notifications  
**Format:** Starts with `re_`  
**Where to get:** https://resend.com/api-keys  
**Cost:** Free tier: 100 emails/day  
**Example:** `re_abc123...`

**What breaks without it:** Email notifications won't send (but app still works)

### 9. OWNER_EMAIL
**What:** Your email for admin notifications  
**Format:** Standard email  
**Example:** `you@example.com`

---

## ❌ NOT NEEDED (Manus-Specific - Already Removed)

These were in the old code but are NO LONGER REQUIRED:

- ~~`OAUTH_SERVER_URL`~~ - OAuth disabled
- ~~`OWNER_OPEN_ID`~~ - OAuth disabled
- ~~`VITE_APP_ID`~~ - OAuth disabled
- ~~`BUILT_IN_FORGE_API_URL`~~ - Using OpenAI directly
- ~~`BUILT_IN_FORGE_API_KEY`~~ - Using OpenAI directly

---

## 🚀 MINIMUM TO START SERVER

**Absolute minimum (server starts but limited functionality):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

**Recommended minimum (payments + AI work):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
OPENAI_API_KEY=sk-proj-...
```

**Full production setup:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
OPENAI_API_KEY=sk-proj-...
RESEND_API_KEY=re_...
OWNER_EMAIL=you@example.com
```

---

## 📋 How to Add in Render

1. Go to https://dashboard.render.com
2. Click your `purposeful-live-backend` service
3. Click **Settings** tab
4. Scroll to **Environment** section
5. Click **Add Environment Variable**
6. Enter key name (e.g., `OPENAI_API_KEY`)
7. Enter value (e.g., `sk-proj-abc123...`)
8. Click **Save Changes**
9. Render will auto-redeploy (2-3 minutes)

---

## 🔍 How to Check What You Have

In Render dashboard:
1. Go to your service
2. Settings → Environment
3. You'll see list of all env vars (values hidden for security)

---

## ⚡ Quick Setup Checklist

- [ ] `DATABASE_URL` - Should already be set by Render
- [ ] `JWT_SECRET` - Generate: `openssl rand -base64 32`
- [ ] `NODE_ENV` - Set to `production`
- [ ] `STRIPE_SECRET_KEY` - Get from Stripe dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` - Get from Stripe webhooks
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Get from Stripe dashboard
- [ ] `OPENAI_API_KEY` - Get from OpenAI platform
- [ ] `RESEND_API_KEY` - (Optional) Get from Resend
- [ ] `OWNER_EMAIL` - (Optional) Your email

---

## 💰 Total Cost

**Required services:**
- Render hosting: $7/month (Starter plan)
- PostgreSQL: $7/month (Starter plan)
- Stripe: Free (2.9% + 30¢ per transaction)
- OpenAI: ~$5-20/month (pay-as-you-go)

**Total: ~$20-35/month** for full production platform

---

## ✅ What You Already Have Set

Based on your deployment checklist, you already have:
- ✅ `DATABASE_URL`
- ✅ `JWT_SECRET`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY`
- ✅ `NODE_ENV`
- ✅ `VITE_APP_TITLE`

**You only need to add:**
- ⚠️ `OPENAI_API_KEY` - For AI features

That's it! One environment variable and you're live.
