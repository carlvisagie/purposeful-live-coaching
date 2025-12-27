# Platform Credentials Reference

**⚠️ IMPORTANT:** This file does NOT contain actual credentials. All sensitive credentials are stored securely in Render environment variables.

---

## Environment Variables Configuration

All credentials are configured in the Render dashboard at: https://dashboard.render.com/

### Twilio SMS Service

```
TWILIO_ACCOUNT_SID=[Configured in Render]
TWILIO_AUTH_TOKEN=[Configured in Render]
TWILIO_PHONE_NUMBER=+17754558329
```

**Access:** Twilio Console at https://console.twilio.com/

### Cloudflare R2 Storage

```
AWS_ACCESS_KEY_ID=[Configured in Render]
AWS_SECRET_ACCESS_KEY=[Configured in Render]
AWS_S3_BUCKET=purposeful-videos
AWS_REGION=auto
R2_ACCOUNT_ID=[Configured in Render]
```

**Access:** Cloudflare Dashboard at https://dash.cloudflare.com/

### SendGrid Email Service

```
SENDGRID_API_KEY=[To be configured after upgrade]
```

**Access:** SendGrid Dashboard at https://app.sendgrid.com/

---

## Public URLs and Resources

**Cloudflare R2 Public URL:**
- `https://pub-bcca76051b654756be8514e67a819c51.r2.dev`

**AI Media Engine:**
- `https://jpxfdzvm.manus.space/`

**Sintra Dashboard:**
- `https://sintra.ai/`

---

## Security Notes

1. Never commit actual credentials to Git
2. All sensitive values stored in Render environment variables
3. Access credentials only through Render dashboard
4. Rotate credentials if compromised
5. Use least-privilege access for all services

---

**For detailed integration documentation, see [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md)**
