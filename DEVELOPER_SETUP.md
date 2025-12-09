# Developer Setup Guide
**Purposeful Live Coaching Platform**

---

## Prerequisites

- Node.js 22.x
- pnpm (package manager)
- Git
- PostgreSQL client (optional, for database access)

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/carlvisagie/purposeful-live-coaching.git
cd purposeful-live-coaching
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Credentials (REQUIRED)

**Create `RENDER_CREDENTIALS.md` in the project root:**

This file is gitignored for security. You need to create it manually.

**Template:**
```markdown
# Render Credentials & Infrastructure Map
**CONFIDENTIAL - DO NOT COMMIT TO GIT**

## API Access

**Render API Key:**
```
[GET FROM PROJECT OWNER]
```

**API Documentation:** https://api-docs.render.com/

## Web Services

[See full template in project documentation]
```

**To get credentials:**
- Contact project owner (Carl Visagie)
- Or access Render Dashboard: https://dashboard.render.com
- Generate new API key: Account Settings → API Keys

### 4. Set Up Environment Variables

**Create `.env.local` in the project root:**

```bash
# Database
DATABASE_URL="[GET FROM RENDER DASHBOARD]"

# OpenAI
OPENAI_API_KEY="[GET FROM PROJECT OWNER]"

# AWS S3
AWS_ACCESS_KEY_ID="[GET FROM PROJECT OWNER]"
AWS_SECRET_ACCESS_KEY="[GET FROM PROJECT OWNER]"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="[GET FROM PROJECT OWNER]"

# Stripe (if needed)
STRIPE_SECRET_KEY="[GET FROM PROJECT OWNER]"
STRIPE_PUBLISHABLE_KEY="[GET FROM PROJECT OWNER]"

# SMTP (email)
SMTP_HOST="[GET FROM PROJECT OWNER]"
SMTP_PORT="587"
SMTP_USER="[GET FROM PROJECT OWNER]"
SMTP_PASS="[GET FROM PROJECT OWNER]"

# Slack (notifications)
SLACK_WEBHOOK_URL="[GET FROM PROJECT OWNER]"

# Vapi (voice AI)
VAPI_API_KEY="[GET FROM PROJECT OWNER]"
```

**Note:** `.env.local` is gitignored. Never commit credentials to Git.

---

## Development Workflow

### Run Development Server

```bash
pnpm dev
```

Server runs on: http://localhost:5173 (frontend) + http://localhost:3000 (backend)

### Build for Production

```bash
pnpm build
```

Output: `dist/` directory

### Type Checking

```bash
pnpm check
```

### Run Tests

```bash
pnpm test
```

### Database Operations

**Push schema changes to database:**
```bash
pnpm db:push
```

**Note:** This runs `drizzle-kit generate && drizzle-kit migrate`

---

## Project Structure

```
purposeful-live-coaching/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                # Backend Node.js/Express
│   ├── routers/           # tRPC routers
│   ├── services/          # Business logic
│   ├── db/                # Database helpers
│   └── _core/             # Core setup (trpc, llm, etc.)
├── drizzle/               # Database schemas
│   └── schema.ts          # Main schema (33 tables)
├── shared/                # Shared types/constants
└── dist/                  # Build output (gitignored)
```

---

## Deployment

### Manual Deploy to Render

**Option 1: Via Git Push (Automatic)**
```bash
git push origin main
```
Render auto-deploys on push to main branch.

**Option 2: Via Render API**
```bash
# Get service ID from RENDER_CREDENTIALS.md
curl -X POST "https://api.render.com/v1/services/{SERVICE_ID}/deploys" \
  -H "Authorization: Bearer {YOUR_RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": "do_not_clear"}'
```

**Option 3: Via Render Dashboard**
1. Go to https://dashboard.render.com
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"

### Check Deployment Status

```bash
# Using Render API
curl -H "Authorization: Bearer {YOUR_RENDER_API_KEY}" \
  "https://api.render.com/v1/services/{SERVICE_ID}/deploys?limit=5"
```

---

## Database Access

### Via Render Dashboard
1. Go to https://dashboard.render.com
2. Select database: `purposefullive-db`
3. Click "Connect" → Use provided connection string

### Via Command Line
```bash
# Get connection string from RENDER_CREDENTIALS.md or .env.local
psql $DATABASE_URL
```

### Run Migrations
```bash
pnpm db:push
```

---

## Troubleshooting

### Build Failures

**Check Render deployment logs:**
1. Dashboard → Service → Logs
2. Look for error messages during build

**Common issues:**
- Environment mismatch (Python vs Node)
- Missing environment variables
- TypeScript compilation errors

**Fix:**
```bash
# Test build locally first
pnpm build

# Check TypeScript
pnpm check
```

### Database Connection Issues

**Verify DATABASE_URL:**
```bash
echo $DATABASE_URL
```

**Test connection:**
```bash
psql $DATABASE_URL -c "SELECT version();"
```

### Environment Variable Issues

**Check if .env.local exists:**
```bash
ls -la .env.local
```

**Verify variables are loaded:**
```bash
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.DATABASE_URL ? 'OK' : 'MISSING')"
```

---

## Security Best Practices

### ✅ DO:
- Keep `RENDER_CREDENTIALS.md` local only
- Use `.env.local` for local development
- Store production secrets in Render Dashboard (Environment Variables)
- Rotate API keys regularly
- Use different keys for development vs production

### ❌ DON'T:
- Commit `.env` or `.env.local` to Git
- Share API keys in Slack/email
- Use production credentials in development
- Hardcode secrets in code

---

## Getting Help

**Documentation:**
- Project README: `README.md`
- Infrastructure Audit: `DEEP_AUDIT_REPORT.md`
- Render Credentials: `RENDER_CREDENTIALS.md` (local only)

**Resources:**
- Render Docs: https://render.com/docs
- tRPC Docs: https://trpc.io
- Drizzle ORM: https://orm.drizzle.team

**Contact:**
- Project Owner: Carl Visagie (carlhvisagie@gmail.com)

---

## Quick Reference

### Common Commands
```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm check            # TypeScript check
pnpm test             # Run tests

# Database
pnpm db:push          # Push schema changes

# Deployment
git push origin main  # Auto-deploy to Render
```

### Important Files
- `RENDER_CREDENTIALS.md` - Render API keys and service IDs (local only)
- `.env.local` - Environment variables (local only)
- `package.json` - Dependencies and scripts
- `drizzle/schema.ts` - Database schema
- `server/_core/index.ts` - Backend entry point
- `client/src/main.tsx` - Frontend entry point

---

**Last Updated:** December 9, 2025
