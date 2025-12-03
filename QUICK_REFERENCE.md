# Quick Reference Card - Keep This Open!

**Print this or keep it on your phone while you work through TONIGHT_SETUP_GUIDE.md**

---

## The 9-Step Process

1. ✅ Install WSL2 (10 min)
2. ✅ Install Node.js (10 min)
3. ✅ Install PostgreSQL (15 min)
4. ✅ Clone project from GitHub (5 min)
5. ✅ Configure environment (10 min)
6. ✅ Install dependencies (10 min)
7. ✅ Start application (5 min)
8. ✅ Set up Cloudflare Tunnel (15 min)
9. ✅ Test everything (10 min)

**Total Time:** 2-3 hours

---

## Most Important Commands

### Check Status
```bash
# Is PostgreSQL running?
sudo service postgresql status

# Is app running?
curl http://localhost:3000

# What's using port 3000?
sudo lsof -i :3000
```

### Start Services
```bash
# Start PostgreSQL
sudo service postgresql start

# Start app
cd ~/purposeful-live-coaching
pnpm dev

# Start Cloudflare tunnel (in new terminal)
cloudflared tunnel run purposeful-coaching
```

### Fix Common Issues
```bash
# Kill process on port 3000
sudo kill -9 $(sudo lsof -t -i:3000)

# Restart PostgreSQL
sudo service postgresql restart

# Reinstall dependencies
rm -rf node_modules && pnpm install

# Reset database migration
rm -rf drizzle/.migrations && pnpm db:push
```

---

## File Locations

```
~/purposeful-live-coaching/          # Your project
~/purposeful-live-coaching/.env      # Environment variables
~/.cloudflared/config.yml            # Cloudflare tunnel config
/var/log/postgresql/                 # PostgreSQL logs
```

---

## Passwords to Remember

1. **Ubuntu password:** (you created in Step 1.4)
2. **PostgreSQL password:** (you created in Step 3.4)
3. **GitHub token:** (created during gh auth login)

**Write these down somewhere safe!**

---

## Emergency Contacts

### If Stuck:
1. Check TROUBLESHOOTING_GUIDE.md
2. Google the exact error message
3. Message me with screenshot

### Useful Resources:
- WSL2 docs: https://docs.microsoft.com/en-us/windows/wsl/
- Node.js docs: https://nodejs.org/docs/
- PostgreSQL docs: https://www.postgresql.org/docs/
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/

---

## Success Checklist

### ✅ You're Done When:
- [ ] `node --version` shows v22.x.x
- [ ] `sudo service postgresql status` shows "online"
- [ ] `cd ~/purposeful-live-coaching` works
- [ ] `pnpm dev` starts without errors
- [ ] `http://localhost:3000` shows your site
- [ ] Cloudflare tunnel URL works (optional for tonight)

### 🎉 Celebrate!
When all checkboxes are checked, you've successfully deployed your platform!

---

## What's Next (Tomorrow)

1. Complete age verification feature
2. Add crisis referral tracking
3. Run QA testing
4. Create Stripe products
5. Set up Calendly

---

## Keep This Terminal Open

**Terminal 1:** Running `pnpm dev`  
**Terminal 2:** Running `cloudflared tunnel run` (if using)  
**Terminal 3:** For running commands

**To open new terminal:** Right-click Ubuntu icon → "New Window"

---

## Pro Tips

1. **Copy-paste commands** - Don't type them manually
2. **Read error messages** - They usually tell you what's wrong
3. **One step at a time** - Don't skip ahead
4. **Take breaks** - If frustrated, step away for 5 minutes
5. **Screenshot errors** - Makes it easier to get help

---

## You Got This! 💪

Remember: This is a one-time setup. Once it's done, starting your app tomorrow will just be:

```bash
sudo service postgresql start
cd ~/purposeful-live-coaching
pnpm dev
```

That's it! 3 commands.

**The hard part is tonight. Tomorrow it's easy.** 🚀
