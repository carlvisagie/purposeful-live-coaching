# Troubleshooting Guide - Common Issues & Solutions

**Use this guide when something goes wrong during setup or running your platform.**

---

## Quick Diagnostic Commands

Run these to check system health:

```bash
# Check if WSL2 is running
wsl --status

# Check Node.js version
node --version

# Check if PostgreSQL is running
sudo service postgresql status

# Check if port 3000 is in use
sudo lsof -i :3000

# Check disk space
df -h

# Check memory usage
free -h
```

---

## Installation Issues

### WSL2 Won't Install

**Symptom:** `wsl --install` fails or shows errors

**Solutions:**

1. **Enable Virtualization in BIOS:**
   - Restart computer
   - Press F2/F10/Del during boot (depends on laptop)
   - Find "Virtualization" or "Intel VT-x" or "AMD-V"
   - Enable it
   - Save and exit

2. **Enable Windows Features:**
   - Open PowerShell as Admin
   - Run:
   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```
   - Restart computer

3. **Update Windows:**
   - Go to Settings → Update & Security
   - Install all updates
   - Restart
   - Try `wsl --install` again

---

### Node.js Installation Fails

**Symptom:** `node --version` shows "command not found"

**Solutions:**

1. **Try alternative installation:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
```

2. **Check if Node is installed but not in PATH:**
```bash
which node
```
If it shows a path, add to PATH:
```bash
echo 'export PATH=$PATH:/usr/bin' >> ~/.bashrc
source ~/.bashrc
```

---

### PostgreSQL Won't Start

**Symptom:** `sudo service postgresql status` shows "down" or "failed"

**Solutions:**

1. **Check if installed:**
```bash
dpkg -l | grep postgresql
```
If nothing shows, reinstall:
```bash
sudo apt remove --purge postgresql postgresql-contrib
sudo apt autoremove
sudo apt install postgresql postgresql-contrib
```

2. **Check logs:**
```bash
sudo tail -50 /var/log/postgresql/postgresql-*.log
```
Look for errors and Google them.

3. **Reset PostgreSQL:**
```bash
sudo service postgresql stop
sudo rm -rf /var/lib/postgresql/14/main
sudo service postgresql start
```
**WARNING:** This deletes all data! Only do this on fresh install.

---

## Database Issues

### "Database connection failed"

**Symptom:** App can't connect to database

**Solutions:**

1. **Check PostgreSQL is running:**
```bash
sudo service postgresql status
```
If not running:
```bash
sudo service postgresql start
```

2. **Check DATABASE_URL in .env:**
```bash
cat .env | grep DATABASE_URL
```
Should look like:
```
DATABASE_URL="postgresql://purposeful:PASSWORD@localhost:5432/purposeful_coaching"
```

3. **Test connection manually:**
```bash
psql -h localhost -U purposeful -d purposeful_coaching
```
Enter your password. If it connects, your credentials are correct.

4. **Check if database exists:**
```bash
sudo -u postgres psql -l
```
Look for `purposeful_coaching` in the list.

If missing, create it:
```bash
sudo -u postgres psql
CREATE DATABASE purposeful_coaching;
GRANT ALL PRIVILEGES ON DATABASE purposeful_coaching TO purposeful;
\q
```

---

### "pnpm db:push" Fails

**Symptom:** Migration fails with errors

**Solutions:**

1. **Check database connection first** (see above)

2. **Clear migration state:**
```bash
rm -rf drizzle/.migrations
pnpm db:push
```

3. **Drop and recreate database:**
```bash
sudo -u postgres psql
DROP DATABASE purposeful_coaching;
CREATE DATABASE purposeful_coaching;
GRANT ALL PRIVILEGES ON DATABASE purposeful_coaching TO purposeful;
\q
pnpm db:push
```

4. **Check for syntax errors in schema:**
```bash
cat drizzle/schema.ts | grep -i error
```

---

## Application Issues

### "Port 3000 already in use"

**Symptom:** Can't start dev server, port conflict

**Solutions:**

1. **Find what's using port 3000:**
```bash
sudo lsof -i :3000
```
You'll see a PID (process ID).

2. **Kill that process:**
```bash
sudo kill -9 <PID>
```
Replace `<PID>` with the number from step 1.

3. **Or use a different port:**
```bash
PORT=3001 pnpm dev
```

---

### "pnpm install" Fails

**Symptom:** Errors during dependency installation

**Solutions:**

1. **Clear cache and retry:**
```bash
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

2. **Check disk space:**
```bash
df -h
```
If `/` is >90% full, free up space:
```bash
sudo apt clean
sudo apt autoremove
```

3. **Check internet connection:**
```bash
ping google.com
```
Press Ctrl+C to stop.

4. **Try with npm instead:**
```bash
npm install
```

---

### "Module not found" Errors

**Symptom:** App crashes with "Cannot find module 'xyz'"

**Solutions:**

1. **Reinstall dependencies:**
```bash
rm -rf node_modules
pnpm install
```

2. **Check if module is in package.json:**
```bash
cat package.json | grep xyz
```
If missing, install it:
```bash
pnpm add xyz
```

3. **Check import paths:**
Look at the error message. If it says:
```
Cannot find module '@/components/...'
```
Check that the file exists at that path.

---

### App Crashes on Startup

**Symptom:** `pnpm dev` starts but immediately crashes

**Solutions:**

1. **Check error message carefully.** Look for:
   - Missing environment variables
   - Database connection errors
   - Port conflicts
   - Syntax errors

2. **Check .env file exists:**
```bash
ls -la .env
```
If missing, create it (see TONIGHT_SETUP_GUIDE.md Part 5).

3. **Check all required env vars:**
```bash
cat .env
```
Compare with the template in TONIGHT_SETUP_GUIDE.md.

4. **Check logs:**
```bash
pnpm dev 2>&1 | tee error.log
```
This saves errors to `error.log` file.

---

## GitHub Issues

### "gh: command not found"

**Symptom:** Can't use GitHub CLI

**Solutions:**

1. **Install GitHub CLI:**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

2. **Authenticate:**
```bash
gh auth login
```

---

### "Permission denied (publickey)"

**Symptom:** Can't clone repository, SSH key error

**Solutions:**

1. **Use HTTPS instead:**
```bash
gh auth login
# Select HTTPS when prompted
gh repo clone YOUR_USERNAME/purposeful-live-coaching
```

2. **Or set up SSH key:**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter 3 times (default location, no passphrase)
cat ~/.ssh/id_ed25519.pub
```
Copy the output, then:
- Go to GitHub.com → Settings → SSH Keys
- Click "New SSH key"
- Paste the key
- Save

---

## Cloudflare Tunnel Issues

### "cloudflared: command not found"

**Symptom:** Cloudflare tunnel won't install

**Solutions:**

1. **Check architecture:**
```bash
uname -m
```

2. **Download correct version:**
For x86_64:
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

For ARM:
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared-linux-arm64.deb
```

---

### Tunnel Won't Connect

**Symptom:** "Connection failed" or "Unable to reach origin"

**Solutions:**

1. **Check app is running:**
```bash
curl http://localhost:3000
```
Should return HTML.

2. **Check config file:**
```bash
cat ~/.cloudflared/config.yml
```
Verify:
- Tunnel ID is correct
- Service points to `http://localhost:3000`
- Credentials file path is correct

3. **Restart tunnel:**
```bash
# Press Ctrl+C to stop
cloudflared tunnel run purposeful-coaching
```

4. **Check Cloudflare dashboard:**
- Go to https://dash.cloudflare.com
- Check if tunnel shows as "Healthy"

---

## Performance Issues

### App is Slow

**Symptom:** Pages load slowly, lag when typing

**Solutions:**

1. **Check CPU usage:**
```bash
top
```
Press `q` to exit.

2. **Check memory:**
```bash
free -h
```
If "available" is <500MB, you're low on RAM.

3. **Restart services:**
```bash
sudo service postgresql restart
# Stop and restart pnpm dev
```

4. **Close other programs** on Lenovo to free up resources.

---

### Database is Slow

**Symptom:** Queries take a long time

**Solutions:**

1. **Check database size:**
```bash
sudo -u postgres psql purposeful_coaching -c "SELECT pg_size_pretty(pg_database_size('purposeful_coaching'));"
```

2. **Vacuum database:**
```bash
sudo -u postgres psql purposeful_coaching -c "VACUUM ANALYZE;"
```

3. **Add indexes** (if you have a lot of data):
```bash
sudo -u postgres psql purposeful_coaching
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
\q
```

---

## Environment Issues

### "Permission denied" for Files

**Symptom:** Can't read/write files

**Solutions:**

1. **Check file ownership:**
```bash
ls -la
```

2. **Fix ownership:**
```bash
sudo chown -R $USER:$USER ~/purposeful-live-coaching
```

3. **Fix permissions:**
```bash
chmod -R 755 ~/purposeful-live-coaching
```

---

### "Disk space full"

**Symptom:** Can't save files, app crashes

**Solutions:**

1. **Check disk usage:**
```bash
df -h
```

2. **Find large files:**
```bash
du -h ~ | sort -rh | head -20
```

3. **Clean up:**
```bash
# Remove old packages
sudo apt clean
sudo apt autoremove

# Remove old logs
sudo journalctl --vacuum-time=7d

# Remove node_modules from old projects
find ~ -name "node_modules" -type d -prune -exec du -sh {} \;
# Then manually delete ones you don't need
```

---

## Still Stuck?

### Gather Information

Before asking for help, collect this info:

1. **Error message** (exact text or screenshot)
2. **What you were doing** (which step, which command)
3. **System info:**
```bash
echo "OS: $(lsb_release -d)"
echo "Node: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "PostgreSQL: $(psql --version)"
```

4. **Logs:**
```bash
# App logs
pnpm dev 2>&1 | tee app.log

# PostgreSQL logs
sudo tail -50 /var/log/postgresql/postgresql-*.log
```

### Contact Me

Send me:
- The information above
- What step you're on in TONIGHT_SETUP_GUIDE.md
- What you've already tried

I'll help you get unstuck! 💪

---

## Prevention Tips

### Daily Checklist

Before starting work each day:

```bash
# 1. Start PostgreSQL
sudo service postgresql start

# 2. Navigate to project
cd ~/purposeful-live-coaching

# 3. Pull latest code (if working with team)
git pull

# 4. Install any new dependencies
pnpm install

# 5. Start dev server
pnpm dev
```

### Weekly Maintenance

Once a week:

```bash
# 1. Update Ubuntu
sudo apt update && sudo apt upgrade -y

# 2. Update Node packages
pnpm update

# 3. Vacuum database
sudo -u postgres psql purposeful_coaching -c "VACUUM ANALYZE;"

# 4. Check disk space
df -h
```

### Backup Your Data

**IMPORTANT:** Set up backups!

```bash
# Backup database
sudo -u postgres pg_dump purposeful_coaching > backup_$(date +%Y%m%d).sql

# Backup .env file
cp .env .env.backup
```

---

## Emergency Recovery

### If Everything is Broken

**Nuclear option - start fresh:**

```bash
# 1. Backup important data first!
sudo -u postgres pg_dump purposeful_coaching > emergency_backup.sql
cp .env .env.emergency_backup

# 2. Remove everything
cd ~
rm -rf purposeful-live-coaching

# 3. Start over from Part 4 of TONIGHT_SETUP_GUIDE.md
```

---

**Remember:** Every problem has a solution. Don't panic, read the error messages carefully, and work through the solutions step by step. You got this! 🚀
