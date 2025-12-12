# Disaster Recovery & Backup Strategy
## PurposefulLive Coaching Platform

**Purpose:** Ensure business continuity and data protection in case of system failures, data loss, or catastrophic events.

**Recovery Time Objective (RTO):** 4 hours (maximum acceptable downtime)

**Recovery Point Objective (RPO):** 24 hours (maximum acceptable data loss)

---

## 🎯 Disaster Scenarios & Response

### Scenario 1: Laptop Crash / Hardware Failure

**Probability:** Medium (hardware fails eventually)

**Impact:** HIGH - Complete service outage

**Prevention:**
- Keep code in GitHub (cloud backup)
- Keep database in Manus cloud (not on laptop)
- Keep files in S3 (not on laptop)

**Recovery Steps:**
1. Get backup laptop
2. Install Node.js, pnpm, git
3. Clone repository from GitHub
4. Copy `.env` file from secure backup
5. Run `pnpm install`
6. Run `pnpm dev`
7. Verify site loads
8. **Estimated recovery time: 2 hours**

---

### Scenario 2: Manus Platform Outage

**Probability:** Low (Manus has 99.9% uptime)

**Impact:** HIGH - Complete service outage

**Prevention:**
- Have backup hosting ready (Render, Railway, Fly.io)
- Keep deployment scripts ready
- Monitor Manus status page

**Recovery Steps:**
1. Check Manus status page
2. If outage >1 hour, deploy to backup hosting
3. Update DNS if needed
4. Notify customers of temporary URL
5. **Estimated recovery time: 3-4 hours**

**Backup Hosting Options:**
- **Render:** $25/month, easy deployment
- **Railway:** $20/month, similar to Manus
- **Fly.io:** $10/month, more technical

---

### Scenario 3: Database Corruption / Data Loss

**Probability:** Low (Manus has automated backups)

**Impact:** CRITICAL - Loss of customer data

**Prevention:**
- Automated daily backups (Manus built-in)
- Export critical data weekly
- Test restore procedure monthly

**Recovery Steps:**
1. Contact Manus support immediately
2. Request database restore from latest backup
3. Verify data integrity after restore
4. Notify affected customers if data lost
5. **Estimated recovery time: 2-4 hours**

---

### Scenario 4: Stripe Account Suspended

**Probability:** Very Low (if you follow Stripe rules)

**Impact:** HIGH - Cannot process payments

**Prevention:**
- Follow Stripe terms of service
- Respond to Stripe inquiries immediately
- Keep business documentation ready
- Have backup payment processor account

**Recovery Steps:**
1. Contact Stripe support immediately
2. Provide requested documentation
3. If suspended >24 hours, activate backup processor
4. Update payment integration
5. **Estimated recovery time: 1-3 days**

**Backup Payment Processors:**
- **PayPal:** Easy to integrate
- **Square:** Good for small businesses
- **Paddle:** Merchant of record (handles compliance)

---

### Scenario 5: Accidental Code Deployment (Breaks Site)

**Probability:** Medium (human error happens)

**Impact:** MEDIUM - Site broken but data safe

**Prevention:**
- Use git branches for development
- Test locally before deploying
- Use Manus checkpoints before risky changes

**Recovery Steps:**
1. Go to Manus dashboard
2. Click "Checkpoints"
3. Find last working checkpoint
4. Click "Rollback"
5. Verify site works
6. **Estimated recovery time: 15 minutes**

---

### Scenario 6: S3 File Storage Failure

**Probability:** Very Low (AWS has 99.99% durability)

**Impact:** MEDIUM - Uploaded files inaccessible

**Prevention:**
- S3 has built-in redundancy
- Keep critical files backed up locally

**Recovery Steps:**
1. Check AWS status page
2. If S3 outage, files will return when service restores
3. If permanent loss, restore from local backup
4. **Estimated recovery time: Depends on AWS**

---

### Scenario 7: Internet Outage (Your Location)

**Probability:** Low (you have Starlink backup)

**Impact:** MEDIUM - You can't access admin dashboard

**Prevention:**
- Starlink as backup internet
- Mobile hotspot as tertiary backup
- Platform continues running (hosted in cloud)

**Recovery Steps:**
1. Switch to Starlink
2. If Starlink down, use mobile hotspot
3. Platform continues serving customers
4. You just can't access admin dashboard
5. **Estimated recovery time: 5 minutes**

---

### Scenario 8: Security Breach / Hacking

**Probability:** Low (if you follow security best practices)

**Impact:** CRITICAL - Data exposure, legal liability

**Prevention:**
- Never share `.env` file
- Use strong passwords
- Enable 2FA on all accounts
- Keep dependencies updated

**Recovery Steps:**
1. Change all passwords immediately
2. Rotate API keys and secrets
3. Review access logs
4. Notify affected users (GDPR requirement)
5. Contact Manus security team
6. **Estimated recovery time: 1-2 days**

---

## 💾 Backup Strategy

### What to Backup

**1. Database (Critical)**
- User accounts
- Subscriptions
- AI conversations
- Session notes
- File metadata

**Backup Frequency:** Daily (automated by Manus)

**Retention:** 30 days

**Storage:** Manus cloud + weekly export to local

---

**2. Uploaded Files (Important)**
- Voice memos
- Session recordings
- Documents
- Photos

**Backup Frequency:** Real-time (S3 has built-in redundancy)

**Retention:** Indefinite (until user deletes)

**Storage:** S3 (99.99% durability)

---

**3. Code Repository (Critical)**
- All application code
- Configuration files (except `.env`)
- Database schema

**Backup Frequency:** Every code change (git push)

**Retention:** Indefinite (git history)

**Storage:** GitHub private repository

---

**4. Environment Variables (Critical)**
- `.env` file with secrets
- Stripe API keys
- Database credentials
- OAuth secrets

**Backup Frequency:** After any change

**Retention:** Keep 2 versions (current + previous)

**Storage:** Encrypted USB drive + password manager

---

### Backup Procedures

#### Daily Automated Backup (Manus)

**What:** Database snapshot

**When:** Every day at 3 AM UTC

**How:** Automatic (Manus platform feature)

**Verification:** Check Manus dashboard weekly

---

#### Weekly Manual Backup (Your Responsibility)

**What:** Export critical data to local machine

**When:** Every Sunday evening

**How:**

```bash
# 1. Export database
pnpm db:export > backup-$(date +%Y-%m-%d).sql

# 2. Download recent files from S3 (optional)
# Use AWS CLI or S3 browser

# 3. Commit code to GitHub
git add .
git commit -m "Weekly checkpoint"
git push origin main

# 4. Copy .env file to encrypted USB
cp .env /Volumes/BACKUP/.env.backup
```

**Storage:** External USB drive (keep in safe place)

---

#### Monthly Restore Test

**What:** Verify backups actually work

**When:** First Sunday of each month

**How:**

```bash
# 1. Create test environment
# 2. Restore database from backup
# 3. Verify data loads correctly
# 4. Test login and basic functions
# 5. Delete test environment
```

**Why:** Many businesses discover backups don't work when it's too late!

---

## 🔄 Environment Cloning (Backup Laptop Setup)

### Prerequisites

**Hardware:**
- Laptop with 8GB+ RAM
- 50GB+ free disk space
- macOS, Windows, or Linux

**Software:**
- Node.js 22.x
- pnpm
- Git
- Code editor (VS Code recommended)

---

### Setup Instructions (From Scratch)

**Estimated time:** 1-2 hours

#### Step 1: Install Node.js

```bash
# macOS (using Homebrew)
brew install node@22

# Windows (download from nodejs.org)
# Linux (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
```

#### Step 2: Install pnpm

```bash
npm install -g pnpm
```

#### Step 3: Clone Repository

```bash
# Create projects directory
mkdir ~/projects
cd ~/projects

# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/purposeful-live-coaching.git
cd purposeful-live-coaching
```

#### Step 4: Set Up Environment Variables

```bash
# Copy .env file from backup
# (Get from encrypted USB or password manager)
cp /path/to/backup/.env .env

# Verify all secrets present
cat .env | grep -E "DATABASE_URL|STRIPE_SECRET_KEY|JWT_SECRET"
```

#### Step 5: Install Dependencies

```bash
pnpm install
```

#### Step 6: Start Development Server

```bash
pnpm dev
```

#### Step 7: Verify Everything Works

```bash
# Open browser to http://localhost:3000
# Test login
# Test AI chat
# Test payment flow
```

---

### Quick Recovery Script

Save this as `setup-backup-laptop.sh`:

```bash
#!/bin/bash

echo "🚀 Setting up PurposefulLive backup environment..."

# Install Node.js (macOS)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    brew install node@22
fi

# Install pnpm
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Clone repository
echo "Cloning repository..."
git clone https://github.com/YOUR_USERNAME/purposeful-live-coaching.git
cd purposeful-live-coaching

# Copy .env (you'll need to provide this manually)
echo "⚠️  Please copy .env file to this directory"
echo "Press Enter when ready..."
read

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Start server
echo "Starting development server..."
pnpm dev

echo "✅ Setup complete! Open http://localhost:3000"
```

**Usage:**

```bash
chmod +x setup-backup-laptop.sh
./setup-backup-laptop.sh
```

---

## 📋 Recovery Checklists

### Checklist 1: Laptop Crash Recovery

- [ ] Get backup laptop
- [ ] Install Node.js 22.x
- [ ] Install pnpm
- [ ] Clone repository from GitHub
- [ ] Copy `.env` file from backup
- [ ] Run `pnpm install`
- [ ] Run `pnpm dev`
- [ ] Test login works
- [ ] Test AI chat works
- [ ] Test payment processing works
- [ ] Notify customers if downtime >1 hour

**Estimated time:** 2 hours

---

### Checklist 2: Database Restore

- [ ] Contact Manus support
- [ ] Request restore from specific backup date
- [ ] Wait for Manus to complete restore
- [ ] Verify user accounts present
- [ ] Verify conversations present
- [ ] Verify subscriptions present
- [ ] Test login with known account
- [ ] Test AI chat functionality
- [ ] Notify affected users if data lost

**Estimated time:** 2-4 hours

---

### Checklist 3: Manus Platform Outage

- [ ] Check Manus status page
- [ ] If outage >1 hour, proceed with backup hosting
- [ ] Sign up for Render/Railway/Fly.io
- [ ] Deploy code to backup hosting
- [ ] Update environment variables
- [ ] Test deployment works
- [ ] Update DNS (if needed)
- [ ] Notify customers of temporary URL
- [ ] Monitor for Manus recovery
- [ ] Switch back when Manus restored

**Estimated time:** 3-4 hours

---

## 🔐 Security Best Practices

### Protect Your Secrets

**`.env` file contains:**
- Database credentials
- Stripe API keys
- JWT secrets
- OAuth secrets

**Never:**
- ❌ Commit `.env` to git
- ❌ Share `.env` in email/Slack
- ❌ Store `.env` in cloud (Dropbox, Google Drive)
- ❌ Leave `.env` on public computer

**Always:**
- ✅ Store `.env` on encrypted USB drive
- ✅ Keep backup in password manager (1Password, LastPass)
- ✅ Rotate secrets if exposed
- ✅ Use strong passwords (20+ characters)

---

### Enable 2FA Everywhere

**Critical accounts:**
- Manus platform
- GitHub
- Stripe
- Domain registrar
- Email account

**Why:** Even if password leaks, attacker can't access account

---

### Keep Dependencies Updated

**Why:** Security vulnerabilities get patched

**How:**

```bash
# Check for outdated packages
pnpm outdated

# Update all dependencies
pnpm update

# Test after updating
pnpm test
pnpm dev
```

**Frequency:** Monthly

---

## 📞 Emergency Contacts

### Manus Support
- **Email:** support@manus.im
- **Response time:** 24 hours
- **For:** Platform outages, database issues, deployment problems

### Stripe Support
- **Dashboard:** https://dashboard.stripe.com/support
- **Response time:** 1-2 business days
- **For:** Payment processing issues, account suspensions

### AWS Support (S3)
- **Dashboard:** https://console.aws.amazon.com/support
- **Response time:** Varies by plan
- **For:** File storage issues

### GitHub Support
- **Email:** support@github.com
- **Response time:** 24-48 hours
- **For:** Repository access issues

---

## 📊 Monitoring & Alerts

### What to Monitor

**1. Uptime**
- Use: UptimeRobot (free)
- Check: Homepage loads every 5 minutes
- Alert: Email + SMS if down >5 minutes

**2. Error Rates**
- Use: Manus built-in logs
- Check: Daily review of error logs
- Alert: Manual review

**3. Payment Success Rate**
- Use: Stripe dashboard
- Check: Weekly review
- Alert: If success rate <95%

**4. Database Size**
- Use: Manus dashboard
- Check: Weekly
- Alert: If approaching limits

---

### Setting Up UptimeRobot

**Free tier:** 50 monitors, 5-minute checks

**Setup:**
1. Go to https://uptimerobot.com
2. Create account
3. Add monitor: https://your-domain.manus.space
4. Set alert contacts (email + SMS)
5. Test alert works

**Cost:** Free

---

## 🎯 Business Continuity Plan

### If Platform Down >4 Hours

**Communication Template:**

> **Subject: Service Interruption - PurposefulLive**
>
> Hi [Name],
>
> We're experiencing technical difficulties and our platform is temporarily unavailable. We're working to restore service as quickly as possible.
>
> **What this means for you:**
> - Your data is safe and backed up
> - Your subscription will be extended by [X days]
> - We'll notify you when service is restored
>
> **Estimated restoration:** [Time]
>
> We apologize for the inconvenience. If you need immediate support, please call the 988 Suicide & Crisis Lifeline.
>
> Thank you for your patience,
> [Your Name]
> PurposefulLive Team

---

### If Data Lost (Worst Case)

**Legal Requirements:**
- Notify affected users within 72 hours (GDPR)
- Explain what data was lost
- Explain what you're doing to prevent recurrence

**Communication Template:**

> **Subject: Important: Data Loss Notification**
>
> Hi [Name],
>
> We experienced a technical issue that resulted in the loss of some user data. We want to be transparent about what happened.
>
> **What was affected:**
> - [Specify: conversations, files, etc.]
> - Date range: [X] to [Y]
>
> **What was NOT affected:**
> - Your account and login
> - Your subscription status
> - Your payment information (stored securely with Stripe)
>
> **What we're doing:**
> - Implementing additional backup procedures
> - Extending your subscription by [X days] as compensation
> - Available for any questions: [email]
>
> We sincerely apologize for this incident.
>
> [Your Name]
> PurposefulLive Team

---

## 🚀 Launch Readiness

### Before Accepting First Paying Customer

- [ ] Database backups verified working
- [ ] GitHub repository set up and pushed
- [ ] `.env` file backed up to encrypted USB
- [ ] Backup laptop tested (can deploy from scratch)
- [ ] UptimeRobot monitoring configured
- [ ] Emergency contact list created
- [ ] Customer communication templates prepared
- [ ] Restore procedure tested (actually restore a backup)

---

## 📈 Scaling Considerations

### When You Reach 100 Customers

**Upgrade:**
- Dedicated database (not shared hosting)
- CDN for faster file delivery
- Load balancer for redundancy
- Paid monitoring service (Datadog, New Relic)

**Cost:** ~$200-300/month

---

### When You Reach 1,000 Customers

**Upgrade:**
- Multi-region deployment (US + EU)
- 24/7 monitoring and alerts
- Automated failover
- Dedicated DevOps engineer

**Cost:** ~$2,000-5,000/month

---

## 🎯 Final Recommendations

**Start Simple:**
1. Use Manus built-in backups (daily automated)
2. Keep code in GitHub (push after every session)
3. Back up `.env` to encrypted USB (weekly)
4. Test restore procedure (monthly)

**As You Grow:**
1. Add UptimeRobot monitoring (free)
2. Set up backup laptop (one-time, 2 hours)
3. Document recovery procedures (this document)
4. Test disaster scenarios (quarterly)

**Remember:**
- **Backups are useless if you never test restoring them**
- **Most businesses fail not from disasters, but from slow recovery**
- **Your customers trust you with their mental health data - take that seriously**

---

**Your platform can survive any disaster if you:**
1. Keep data in the cloud (not on laptop)
2. Keep code in GitHub (not just local)
3. Test backups regularly (don't assume they work)
4. Have a plan (this document)

**You're now prepared for 99% of disaster scenarios. 🛡️**
