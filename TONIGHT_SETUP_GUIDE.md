# Tonight's Setup Guide - Step by Step

**Goal:** Get your platform running on your Lenovo laptop by the end of tonight  
**Time Estimate:** 2-3 hours  
**Difficulty:** Beginner-friendly (I'll walk you through everything)

---

## Before You Start

### What You Need:
1. ✅ Lenovo laptop (1TB drive)
2. ✅ Stable internet connection
3. ✅ GitHub account (you already have this)
4. ✅ This guide open on your phone or another device

### What You'll Get:
- ✅ Your platform running locally on Lenovo
- ✅ Database connected and working
- ✅ Publicly accessible via Cloudflare Tunnel (free SSL)
- ✅ Ready to test and launch

---

## Part 1: Install WSL2 (Windows Subsystem for Linux)
**Time:** 10 minutes  
**Why:** Gives you a Linux environment inside Windows

### Step 1.1: Open PowerShell as Administrator
1. Press `Windows key` on keyboard
2. Type: `PowerShell`
3. You'll see "Windows PowerShell" in results
4. **Right-click** on it
5. Click **"Run as administrator"**
6. Click **"Yes"** if Windows asks for permission

**You should see:** A blue window with text like `PS C:\WINDOWS\system32>`

### Step 1.2: Install WSL2
1. In the PowerShell window, type this EXACT command:
```powershell
wsl --install
```
2. Press `Enter`
3. Wait 5-10 minutes (it's downloading Ubuntu)

**You should see:** Progress messages like "Installing..." and "Ubuntu installed"

### Step 1.3: Restart Your Computer
1. Close all programs
2. Click Start menu → Power → Restart
3. Wait for computer to restart (2-3 minutes)

### Step 1.4: Set Up Ubuntu
**After restart, Ubuntu will open automatically**

1. You'll see: "Enter new UNIX username:"
2. Type a username (lowercase, no spaces, e.g., `yourname`)
3. Press `Enter`
4. You'll see: "New password:"
5. Type a password (you won't see it as you type - that's normal!)
6. Press `Enter`
7. You'll see: "Retype new password:"
8. Type the SAME password again
9. Press `Enter`

**You should see:** A prompt like `yourname@Lenovo:~$`

**✅ CHECKPOINT:** If you see that prompt, WSL2 is installed! Take a screenshot.

---

## Part 2: Install Node.js and pnpm
**Time:** 10 minutes  
**Why:** Your app needs Node.js to run

### Step 2.1: Update Ubuntu
Copy and paste this command (right-click to paste in Ubuntu):
```bash
sudo apt update && sudo apt upgrade -y
```
- Type your password when asked
- Press `Enter`
- Wait 2-3 minutes

### Step 2.2: Install Node.js 22
Copy and paste these commands ONE AT A TIME:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
```
Press `Enter`, wait for it to finish.

```bash
sudo apt install -y nodejs
```
Press `Enter`, wait for it to finish.

### Step 2.3: Verify Node.js Installed
```bash
node --version
```
**You should see:** `v22.something.something`

```bash
npm --version
```
**You should see:** A version number like `10.something.something`

### Step 2.4: Install pnpm
```bash
npm install -g pnpm
```
Wait 1-2 minutes.

```bash
pnpm --version
```
**You should see:** A version number like `9.something.something`

**✅ CHECKPOINT:** If all three commands show version numbers, you're good!

---

## Part 3: Install PostgreSQL Database
**Time:** 15 minutes  
**Why:** Your app needs a database to store user data

### Step 3.1: Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```
Wait 2-3 minutes.

### Step 3.2: Start PostgreSQL
```bash
sudo service postgresql start
```

### Step 3.3: Check PostgreSQL is Running
```bash
sudo service postgresql status
```
**You should see:** Green text with "online" or "running"

Press `q` to exit.

### Step 3.4: Create Database User
```bash
sudo -u postgres psql
```
**You should see:** A prompt like `postgres=#`

Now type these commands ONE AT A TIME (press Enter after each):

```sql
CREATE USER purposeful WITH PASSWORD 'your_secure_password_here';
```
**Replace `your_secure_password_here` with a password you'll remember!**

```sql
CREATE DATABASE purposeful_coaching;
```

```sql
GRANT ALL PRIVILEGES ON DATABASE purposeful_coaching TO purposeful;
```

```sql
\q
```
This exits PostgreSQL.

**✅ CHECKPOINT:** You should be back to the `yourname@Lenovo:~$` prompt.

---

## Part 4: Clone Your Project from GitHub
**Time:** 5 minutes  
**Why:** Get your code onto the Lenovo

### Step 4.1: Install Git
```bash
sudo apt install -y git
```

### Step 4.2: Configure Git
Replace with YOUR name and email:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4.3: Clone Your Repository
```bash
cd ~
gh auth login
```

Follow the prompts:
1. "What account do you want to log into?" → Select **GitHub.com**
2. "What is your preferred protocol?" → Select **HTTPS**
3. "Authenticate Git with your GitHub credentials?" → Select **Yes**
4. "How would you like to authenticate?" → Select **Login with a web browser**
5. Copy the 8-character code shown
6. Press `Enter`
7. Browser will open → Paste the code → Click "Authorize"

Now clone your repo:
```bash
gh repo clone YOUR_GITHUB_USERNAME/purposeful-live-coaching
```
**Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username!**

### Step 4.4: Navigate to Project
```bash
cd purposeful-live-coaching
ls
```
**You should see:** A list of files including `package.json`, `README.md`, etc.

**✅ CHECKPOINT:** If you see those files, your code is downloaded!

---

## Part 5: Configure Environment Variables
**Time:** 10 minutes  
**Why:** Tell your app how to connect to the database and services

### Step 5.1: Create .env File
```bash
nano .env
```
This opens a text editor.

### Step 5.2: Paste Your Environment Variables
Copy this template and paste it (right-click in Ubuntu):

```bash
# Database
DATABASE_URL="postgresql://purposeful:your_secure_password_here@localhost:5432/purposeful_coaching"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-to-random-string"

# Manus OAuth (if you're still using Manus temporarily)
VITE_APP_ID="your-manus-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://oauth.manus.im"
OWNER_OPEN_ID="your-owner-openid"
OWNER_NAME="Your Name"

# Manus Forge API (if using temporarily)
BUILT_IN_FORGE_API_URL="https://forge.manus.im"
BUILT_IN_FORGE_API_KEY="your-forge-api-key"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-forge-key"
VITE_FRONTEND_FORGE_API_URL="https://forge.manus.im"

# Stripe (you'll add these after creating Stripe account)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App Info
VITE_APP_TITLE="Purposeful Live Coaching"
VITE_APP_LOGO="/logo.png"

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=""
VITE_ANALYTICS_WEBSITE_ID=""
```

**IMPORTANT:** Replace these values:
- `your_secure_password_here` → The password you created in Step 3.4
- `your-super-secret-jwt-key-change-this-to-random-string` → Any random long string

### Step 5.3: Save and Exit
1. Press `Ctrl + X`
2. Press `Y` (yes to save)
3. Press `Enter` (confirm filename)

**✅ CHECKPOINT:** File saved!

---

## Part 6: Install Dependencies and Run Database Migration
**Time:** 10 minutes  
**Why:** Install all the code libraries your app needs

### Step 6.1: Install Dependencies
```bash
pnpm install
```
Wait 3-5 minutes (it's downloading a lot of packages).

**You should see:** Progress bars and "Packages: +XXX" at the end

### Step 6.2: Run Database Migration
```bash
pnpm db:push
```

**IMPORTANT:** This will ask you questions about tables. For each question:
- Use arrow keys to select **"+ tablename create table"** (the first option)
- Press `Enter`
- Repeat for all questions

Wait 2-3 minutes.

**You should see:** "✔ Done!" at the end

**✅ CHECKPOINT:** Database is set up!

---

## Part 7: Start Your Application
**Time:** 5 minutes  
**Why:** See if everything works!

### Step 7.1: Start the Dev Server
```bash
pnpm dev
```

**You should see:**
```
Server running on http://localhost:3000/
```

**✅ SUCCESS!** Your app is running locally!

### Step 7.2: Test It
1. Open a web browser on your Lenovo
2. Go to: `http://localhost:3000`
3. You should see your landing page!

**✅ CHECKPOINT:** If you see your website, IT WORKS! 🎉

---

## Part 8: Make It Publicly Accessible (Cloudflare Tunnel)
**Time:** 15 minutes  
**Why:** So you can access it from anywhere, not just your Lenovo

### Step 8.1: Create Cloudflare Account
1. Go to: https://dash.cloudflare.com/sign-up
2. Enter your email and create password
3. Verify your email
4. Log in

### Step 8.2: Install Cloudflare Tunnel
Open a NEW Ubuntu terminal (keep the old one running!):
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### Step 8.3: Authenticate Cloudflare
```bash
cloudflared tunnel login
```
- Browser will open
- Select your Cloudflare account
- Authorize

### Step 8.4: Create Tunnel
```bash
cloudflared tunnel create purposeful-coaching
```
**You should see:** "Created tunnel purposeful-coaching with id XXXXX"

**Copy the tunnel ID** (the long string of letters/numbers)

### Step 8.5: Configure Tunnel
```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste this (replace `YOUR_TUNNEL_ID` with the ID from Step 8.4):
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/yourname/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: purposeful-coaching.your-domain.com
    service: http://localhost:3000
  - service: http_status:404
```

**Replace:**
- `YOUR_TUNNEL_ID` → The ID from Step 8.4
- `yourname` → Your Ubuntu username
- `purposeful-coaching.your-domain.com` → Any subdomain you want (or use the Cloudflare-provided one)

Save: `Ctrl + X`, `Y`, `Enter`

### Step 8.6: Start Tunnel
```bash
cloudflared tunnel run purposeful-coaching
```

**You should see:** "Connection established" and a URL

**✅ SUCCESS!** Your site is now publicly accessible!

---

## Part 9: Keep It Running (Optional, for tonight just test)
**Time:** 5 minutes  
**Why:** So it doesn't stop when you close the terminal

### For Tonight (Simple Way):
Just keep the terminal windows open. Don't close them.

### For Production (Tomorrow):
We'll set up a proper service that runs automatically.

---

## Verification Checklist

Go through this list to make sure everything works:

### ✅ WSL2 Installed
- [ ] Ubuntu terminal opens
- [ ] You can type commands

### ✅ Node.js Installed
- [ ] `node --version` shows v22.x.x
- [ ] `pnpm --version` shows a version number

### ✅ PostgreSQL Running
- [ ] `sudo service postgresql status` shows "online"
- [ ] Database `purposeful_coaching` exists

### ✅ Project Cloned
- [ ] `cd ~/purposeful-live-coaching` works
- [ ] `ls` shows project files

### ✅ Environment Configured
- [ ] `.env` file exists
- [ ] Database password is correct

### ✅ Dependencies Installed
- [ ] `pnpm install` completed successfully
- [ ] `node_modules` folder exists

### ✅ Database Migrated
- [ ] `pnpm db:push` completed successfully
- [ ] No errors shown

### ✅ App Running Locally
- [ ] `pnpm dev` starts server
- [ ] `http://localhost:3000` shows your site

### ✅ Publicly Accessible (Optional for tonight)
- [ ] Cloudflare tunnel running
- [ ] Public URL works

---

## What to Do If Something Goes Wrong

### "Command not found"
**Problem:** You typed a command and it says "command not found"  
**Solution:** Make sure you installed that tool first. Go back to the relevant section.

### "Permission denied"
**Problem:** Command fails with "permission denied"  
**Solution:** Add `sudo` before the command. Example: `sudo apt install ...`

### "Port already in use"
**Problem:** Can't start server, port 3000 in use  
**Solution:**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```
Replace `<PID>` with the number shown.

### "Database connection failed"
**Problem:** App can't connect to database  
**Solution:** Check these:
1. PostgreSQL is running: `sudo service postgresql status`
2. Password in `.env` matches password from Step 3.4
3. Database name is correct: `purposeful_coaching`

### "pnpm install fails"
**Problem:** Errors during `pnpm install`  
**Solution:**
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

## After Tonight

### Tomorrow's Tasks:
1. ✅ Complete database migration (age verification field)
2. ✅ Add crisis referral tracking
3. ✅ Run QA testing
4. ✅ Create Stripe products
5. ✅ Set up Calendly

### This Week:
1. ✅ Test everything thoroughly
2. ✅ Fix any bugs
3. ✅ **LAUNCH!**

---

## Need Help?

**If you get stuck:**
1. Take a screenshot of the error
2. Message me with:
   - What step you're on
   - What command you ran
   - What error you see
3. I'll help you troubleshoot!

---

## You Got This! 💪

This might seem like a lot, but it's actually straightforward. Just follow the steps one at a time, don't skip anything, and you'll be up and running in 2-3 hours.

**Remember:** Every successful entrepreneur started exactly where you are right now. The difference is they took action. Tonight, you're taking action.

**Let's build this! 🚀**
