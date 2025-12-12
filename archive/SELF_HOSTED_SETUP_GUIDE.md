# Self-Hosted Server Setup Guide
## Run PurposefulLive on Your Own Hardware

**Purpose:** Complete guide to hosting your coaching platform on your own server for total independence.

**Timeline:** Start TODAY on your ASUS laptop, scale later when needed.

---

## 🎯 Phase 1: Start TODAY on Your ASUS Laptop (0-100 Users)

Your ASUS laptop is **perfect** for getting started. Here's why:

**Your ASUS Specs (Estimated):**
- CPU: Modern Intel/AMD (4-8 cores)
- RAM: 16-32GB
- Storage: 512GB+ SSD
- **This can easily handle 100+ concurrent users**

**What you can do with it:**
- ✅ Run the entire platform
- ✅ Handle 0-100 paying customers
- ✅ Test everything in production
- ✅ Generate $3,000-10,000/month revenue
- ✅ Prove the business model works

**When to upgrade:** After 100+ customers or $10k/month revenue

---

## 🚀 Quick Start: Get Running in 2 Hours

### Step 1: Check Your Laptop (5 minutes)

**Open terminal and check specs:**

**On Windows:**
```powershell
# Check CPU
wmic cpu get name

# Check RAM
wmic computersystem get totalphysicalmemory

# Check disk space
wmic logicaldisk get size,freespace,caption
```

**On macOS:**
```bash
# Check CPU
sysctl -n machdep.cpu.brand_string

# Check RAM
sysctl hw.memsize

# Check disk space
df -h
```

**On Linux:**
```bash
# Check CPU
lscpu | grep "Model name"

# Check RAM
free -h

# Check disk space
df -h
```

**Minimum requirements:**
- ✅ 4+ CPU cores
- ✅ 8GB+ RAM (16GB+ is better)
- ✅ 50GB+ free disk space
- ✅ Stable internet connection

**If you have these, you're good to go!**

---

### Step 2: Install Required Software (30 minutes)

**Option A: Windows (Recommended for your ASUS)**

**Install WSL2 (Windows Subsystem for Linux):**
```powershell
# Open PowerShell as Administrator
wsl --install

# Restart computer
# After restart, open Ubuntu from Start menu
```

**Install Node.js in WSL:**
```bash
# In Ubuntu terminal
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Verify
node --version  # Should show v22.x
pnpm --version  # Should show 9.x
```

**Install PostgreSQL:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Create database
sudo -u postgres createdb purposeful_coaching

# Create user
sudo -u postgres psql -c "CREATE USER coaching_user WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE purposeful_coaching TO coaching_user;"
```

---

**Option B: macOS**

**Install Homebrew (if not installed):**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Install Node.js and PostgreSQL:**
```bash
# Install Node.js 22
brew install node@22

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb purposeful_coaching

# Create user
psql postgres -c "CREATE USER coaching_user WITH PASSWORD 'your_secure_password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE purposeful_coaching TO coaching_user;"
```

---

**Option C: Linux (Ubuntu/Debian)**

```bash
# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb purposeful_coaching

# Create user
sudo -u postgres psql -c "CREATE USER coaching_user WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE purposeful_coaching TO coaching_user;"
```

---

### Step 3: Clone and Configure Your Project (15 minutes)

```bash
# Clone from GitHub
cd ~
git clone https://github.com/YOUR_USERNAME/purposeful-live-coaching.git
cd purposeful-live-coaching

# Install dependencies
pnpm install

# Create .env file
cat > .env << 'EOF'
NODE_ENV=development
DATABASE_URL=postgresql://coaching_user:your_secure_password@localhost:5432/purposeful_coaching

# OpenAI (get from https://platform.openai.com)
OPENAI_API_KEY=sk-proj-your-key-here

# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_your-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-secret-here

# JWT Secret (generate random string)
JWT_SECRET=your-random-secret-here-make-it-long-and-random

# Resend Email (get from https://resend.com)
RESEND_API_KEY=re_your-key-here
OWNER_EMAIL=your-email@example.com

# AWS S3 (optional, for file storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=purposeful-coaching-files
EOF

# Run database migration
pnpm db:push

# Start development server
pnpm dev
```

**Your app is now running at http://localhost:3000** 🎉

---

### Step 4: Make It Accessible from Internet (30 minutes)

**Option A: Cloudflare Tunnel (Recommended - Free & Secure)**

Cloudflare Tunnel creates a secure connection from your laptop to the internet without opening ports or needing a static IP.

**Install Cloudflare Tunnel:**

```bash
# Download cloudflared
# For Windows (in PowerShell):
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# For macOS:
brew install cloudflared

# For Linux:
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

**Set up tunnel:**

```bash
# Login to Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create purposeful-coaching

# Configure tunnel
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: purposeful-coaching
credentials-file: /home/YOUR_USER/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: purposefullive.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Route DNS
cloudflared tunnel route dns purposeful-coaching purposefullive.com

# Run tunnel
cloudflared tunnel run purposeful-coaching
```

**Your site is now live at https://purposefullive.com** 🚀

**Pros:**
- ✅ Free
- ✅ Automatic SSL
- ✅ No port forwarding needed
- ✅ No static IP needed
- ✅ DDoS protection included
- ✅ Works behind any router/firewall

---

**Option B: ngrok (Quick Testing - Free Tier)**

```bash
# Install ngrok
# Download from https://ngrok.com/download

# Run ngrok
ngrok http 3000

# You'll get a URL like: https://abc123.ngrok.io
```

**Pros:**
- ✅ Super fast setup (30 seconds)
- ✅ Good for testing

**Cons:**
- ⚠️ URL changes every restart (unless paid plan)
- ⚠️ Limited to 40 connections/minute on free tier

---

**Option C: Port Forwarding (Traditional - Free but Complex)**

**Steps:**
1. Get static IP from your ISP (or use Dynamic DNS)
2. Forward port 80 and 443 on your router to your laptop
3. Set up Nginx as reverse proxy
4. Get SSL certificate from Let's Encrypt

**Pros:**
- ✅ Full control
- ✅ No third-party service

**Cons:**
- ⚠️ Security risk if not configured properly
- ⚠️ Complex setup
- ⚠️ Need static IP or Dynamic DNS

**Recommendation: Use Cloudflare Tunnel** - It's free, secure, and easy.

---

### Step 5: Replace Manus Services (1-2 hours)

Now that your app is running on your laptop, let's replace the Manus dependencies:

**5.1 Replace Authentication with NextAuth**

```bash
# Install NextAuth
pnpm add next-auth @auth/core
```

Create `server/auth.ts`:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Your auth logic here
        const user = await db.getUserByEmail(credentials.email);
        if (user && verifyPassword(credentials.password, user.passwordHash)) {
          return { id: user.id, email: user.email, name: user.name };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
```

**Add to .env:**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
```

---

**5.2 Replace Storage with Direct S3**

Already documented in MIGRATION_OFF_MANUS.md - use the S3 code there.

**Or use local storage for now:**

Create `server/storage-local.ts`:

```typescript
import fs from "fs/promises";
import path from "path";

const STORAGE_DIR = path.join(process.cwd(), "uploads");

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const filePath = path.join(STORAGE_DIR, key);
  
  // Create directory if it doesn't exist
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  
  // Write file
  await fs.writeFile(filePath, data);
  
  // Return URL (served by your app)
  const url = `/uploads/${key}`;
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const url = `/uploads/${key}`;
  return { key, url };
}
```

**Serve uploads in Express:**

```typescript
// In server/_core/index.ts
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
```

---

**5.3 Replace AI with Direct OpenAI**

Already documented in MIGRATION_OFF_MANUS.md - just update the API endpoint and key.

---

**5.4 Replace Email with Resend**

```bash
pnpm add resend
```

Create `server/email.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { data, error } = await resend.emails.send({
    from: 'PurposefulLive <noreply@purposefullive.com>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Email send failed:', error);
    throw new Error(`Email send failed: ${error.message}`);
  }

  return data;
}
```

---

## 🔒 Security Hardening (30 minutes)

**Essential security measures:**

**1. Firewall (if using port forwarding):**

```bash
# Ubuntu/Debian
sudo ufw enable
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH if needed
```

**2. Fail2ban (prevent brute force):**

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

**3. Automatic security updates:**

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

**4. SSL Certificate (if using port forwarding):**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d purposefullive.com
```

**5. Environment variables security:**

```bash
# Never commit .env to git
echo ".env" >> .gitignore

# Restrict .env permissions
chmod 600 .env
```

---

## 🔄 Keep It Running (Process Management)

**Option A: PM2 (Recommended)**

```bash
# Install PM2
npm install -g pm2

# Start your app
pm2 start "pnpm dev" --name purposeful-coaching

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup

# View logs
pm2 logs purposeful-coaching

# Restart app
pm2 restart purposeful-coaching
```

**Option B: systemd (Linux only)**

Create `/etc/systemd/system/purposeful-coaching.service`:

```ini
[Unit]
Description=PurposefulLive Coaching Platform
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/purposeful-live-coaching
ExecStart=/usr/bin/pnpm dev
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable purposeful-coaching
sudo systemctl start purposeful-coaching

# View logs
sudo journalctl -u purposeful-coaching -f
```

---

## 📊 Monitoring Your Server

**1. System Resources:**

```bash
# Install htop
sudo apt install htop

# Monitor CPU, RAM, disk
htop
```

**2. Application Logs:**

```bash
# PM2 logs
pm2 logs

# Or systemd logs
sudo journalctl -u purposeful-coaching -f
```

**3. Uptime Monitoring:**

Use UptimeRobot (free) to monitor from outside:
- https://uptimerobot.com
- Add your domain
- Get alerts if site goes down

---

## 💾 Backup Strategy for Self-Hosted

**Automated daily backups:**

Create `backup.sh`:

```bash
#!/bin/bash

# Backup directory
BACKUP_DIR="/home/your-username/backups"
DATE=$(date +%Y-%m-%d)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U coaching_user purposeful_coaching > $BACKUP_DIR/db-$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads-$DATE.tar.gz uploads/

# Backup .env
cp .env $BACKUP_DIR/env-$DATE.backup

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

**Make it executable and schedule:**

```bash
chmod +x backup.sh

# Add to crontab (runs daily at 3 AM)
crontab -e

# Add this line:
0 3 * * * /home/your-username/purposeful-live-coaching/backup.sh
```

**Backup to cloud (optional):**

```bash
# Install rclone
curl https://rclone.org/install.sh | sudo bash

# Configure (follow prompts)
rclone config

# Sync backups to cloud
rclone sync /home/your-username/backups remote:purposeful-backups
```

---

## 🚀 When to Upgrade Hardware

**Signs you need dedicated server:**

- ✅ 100+ paying customers
- ✅ $10,000+/month revenue
- ✅ Laptop getting slow
- ✅ Need 99.9% uptime guarantee
- ✅ Want redundancy/failover

**Upgrade options when ready:**

**Option 1: Dedicated Server at Home**
- Intel NUC or similar mini PC
- 32GB RAM, 1TB SSD
- Cost: €500-800 one-time
- Runs 24/7, low power consumption

**Option 2: Colocation**
- Your server in professional data center
- Redundant power, internet, cooling
- Cost: €50-150/month + server hardware

**Option 3: Cloud VPS (if you change your mind)**
- Hetzner: €20-40/month (European, great value)
- DigitalOcean: €40-80/month
- Linode: €40-80/month

---

## 📋 Quick Start Checklist

**Today (2 hours):**
- [ ] Check ASUS laptop specs (meets requirements)
- [ ] Install Node.js, pnpm, PostgreSQL
- [ ] Clone project and install dependencies
- [ ] Create .env with your API keys
- [ ] Run database migration
- [ ] Start development server
- [ ] Test locally at http://localhost:3000

**This Week (4-6 hours):**
- [ ] Set up Cloudflare Tunnel for public access
- [ ] Replace Manus OAuth with NextAuth
- [ ] Set up direct OpenAI API
- [ ] Set up Resend email
- [ ] Configure PM2 for process management
- [ ] Set up automated backups
- [ ] Run complete QA testing

**Next Week:**
- [ ] Launch to first customers
- [ ] Monitor performance
- [ ] Optimize as needed
- [ ] Plan hardware upgrade when revenue justifies it

---

## 💰 Total Cost Breakdown

**Starting on Your Laptop:**
- Hardware: €0 (you already have it)
- OpenAI API: ~€50-200/month (based on usage)
- Resend Email: €0 (free up to 3,000/month)
- Domain: ~€10/year
- Cloudflare Tunnel: €0 (free)
- **Total: ~€50-200/month**

**After 100+ Customers (Dedicated Server):**
- Server hardware: €500-800 one-time
- Electricity: ~€10-20/month
- OpenAI API: ~€200-500/month (more usage)
- Everything else: Same as above
- **Total: ~€210-520/month + one-time hardware**

**Compare to Cloud Hosting:**
- Render/Railway: ~€100-200/month
- Plus OpenAI: ~€200-500/month
- **Total: ~€300-700/month**

**Your way is cheaper AND you own everything!** 🎯

---

## 🎯 Next Steps

**Right now:**
1. Check your ASUS laptop specs
2. Tell me what OS you're running (Windows/macOS/Linux)
3. I'll give you the exact commands to run

**Within 2 hours:**
- Your platform running on your laptop
- Accessible from internet via Cloudflare Tunnel
- Ready to test

**Within 1 week:**
- All Manus dependencies replaced
- Complete QA testing done
- Ready to launch

**Let's do this, brother! What OS is your ASUS running?** 🚀
