# Migration Plan: Off Manus Platform
## Move to Independent Infrastructure

**Purpose:** Migrate the PurposefulLive coaching platform from Manus-hosted services to fully independent infrastructure that you control.

**Goal:** Zero dependencies on Manus for hosting, authentication, storage, or AI services.

---

## 🎯 Current Manus Dependencies

### 1. **Hosting (Manus Platform)**
- **What:** Application hosted on Manus servers
- **URL:** https://purposeful-live-coaching.manus.space
- **Replacement:** Deploy to your own hosting (Render, Railway, DigitalOcean, AWS)

### 2. **Authentication (Manus OAuth)**
- **What:** User login through Manus OAuth system
- **Files:** `server/_core/oauth.ts`, `server/_core/sdk.ts`
- **Replacement:** Implement your own auth (NextAuth, Clerk, Auth0, or custom)

### 3. **Database (Manus-Provided PostgreSQL)**
- **What:** PostgreSQL database hosted by Manus
- **Connection:** Via `DATABASE_URL` environment variable
- **Replacement:** Your own PostgreSQL (Supabase, Railway, Neon, or self-hosted)

### 4. **File Storage (Manus S3 Proxy)**
- **What:** S3 storage accessed through Manus proxy
- **Files:** `server/storage.ts`
- **Replacement:** Direct AWS S3 or Cloudflare R2

### 5. **AI Services (Manus Forge API)**
- **What:** OpenAI/Gemini access through Manus proxy
- **Files:** `server/_core/llm.ts`, `server/_core/voiceTranscription.ts`
- **Replacement:** Direct OpenAI API or Anthropic Claude

### 6. **Notifications (Manus Notification API)**
- **What:** Email notifications through Manus
- **Files:** `server/_core/notification.ts`
- **Replacement:** Already planned (Resend/SendGrid)

---

## 🚀 Migration Strategy

### Phase 1: Set Up Independent Infrastructure (Day 1, 4-6 hours)

**1.1 Choose Hosting Provider**

**Recommended: Render.com**
- **Pros:** Easy deployment, automatic SSL, free PostgreSQL, similar to Manus
- **Cons:** Slightly more expensive than alternatives
- **Cost:** $25/month (web service) + $7/month (PostgreSQL starter)
- **Setup Time:** 30 minutes

**Alternative: Railway.app**
- **Pros:** Very similar to Manus, great developer experience
- **Cons:** Pricing can scale quickly
- **Cost:** ~$20-30/month
- **Setup Time:** 30 minutes

**Alternative: DigitalOcean App Platform**
- **Pros:** More control, good documentation
- **Cons:** More configuration required
- **Cost:** $12/month (basic droplet) + $15/month (managed PostgreSQL)
- **Setup Time:** 1-2 hours

---

**1.2 Set Up PostgreSQL Database**

**Option A: Use Hosting Provider's Database (Recommended)**
- Render: Includes PostgreSQL with web service
- Railway: Includes PostgreSQL addon
- DigitalOcean: Managed PostgreSQL available

**Option B: Separate Database Service**
- **Supabase:** Free tier, great for startups, includes auth
- **Neon:** Serverless PostgreSQL, free tier available
- **Railway:** Database-only hosting

**Setup Steps:**
1. Create database instance
2. Copy connection string (DATABASE_URL)
3. Run migration: `pnpm db:push`
4. Verify tables created

---

**1.3 Set Up S3 Storage**

**Option A: AWS S3 (Recommended)**
- **Pros:** Industry standard, reliable, cheap
- **Cons:** AWS interface can be confusing
- **Cost:** ~$1-5/month for small usage
- **Setup Time:** 30 minutes

**Option B: Cloudflare R2**
- **Pros:** No egress fees, cheaper than S3
- **Cons:** Newer service, less mature
- **Cost:** ~$0.50-2/month
- **Setup Time:** 20 minutes

**Setup Steps:**
1. Create AWS account (or use existing)
2. Create S3 bucket: `purposeful-coaching-files`
3. Set bucket policy to public-read for uploaded files
4. Create IAM user with S3 access
5. Generate access key and secret
6. Update storage.ts to use direct S3 (see code below)

---

**1.4 Set Up OpenAI API**

**Direct OpenAI Integration**
- **Cost:** Pay-as-you-go, ~$0.01-0.10 per conversation
- **Setup Time:** 10 minutes

**Setup Steps:**
1. Go to https://platform.openai.com
2. Create account (or use existing)
3. Add payment method
4. Generate API key
5. Update llm.ts to use direct OpenAI (see code below)

---

### Phase 2: Replace Authentication (Day 2, 6-8 hours)

**Option A: Clerk (Recommended for Speed)**
- **Pros:** Drop-in replacement, beautiful UI, handles everything
- **Cons:** $25/month after 10,000 users
- **Setup Time:** 2-3 hours
- **Free Tier:** 10,000 monthly active users

**Option B: NextAuth / Auth.js**
- **Pros:** Free, open source, flexible
- **Cons:** More setup required, you handle security
- **Setup Time:** 4-6 hours

**Option C: Supabase Auth**
- **Pros:** Free, includes database, simple
- **Cons:** Tied to Supabase ecosystem
- **Setup Time:** 3-4 hours

**Option D: Custom Auth with Passport.js**
- **Pros:** Full control, no external dependencies
- **Cons:** Most work, you handle all security
- **Setup Time:** 8+ hours

**Recommended: Start with Clerk, migrate to custom later if needed**

---

**Clerk Setup Steps:**

1. **Create Clerk Account**
   - Go to https://clerk.com
   - Create account
   - Create new application

2. **Install Clerk**
   ```bash
   pnpm add @clerk/clerk-react @clerk/backend
   ```

3. **Replace OAuth Routes**
   - Remove `server/_core/oauth.ts`
   - Remove `server/_core/sdk.ts`
   - Add Clerk middleware to Express

4. **Update Frontend**
   - Wrap app in `<ClerkProvider>`
   - Replace login links with Clerk components
   - Update `useAuth()` hook to use Clerk

5. **Update Backend**
   - Replace `ctx.user` with Clerk user
   - Update `protectedProcedure` to use Clerk auth

**Estimated Time:** 2-3 hours

---

### Phase 3: Update Code for Direct Services (Day 2-3, 4-6 hours)

**3.1 Replace Storage with Direct S3**

Create new file: `server/storage-s3.ts`

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "purposeful-coaching-files";

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: data,
    ContentType: contentType,
    ACL: "public-read", // Make files publicly accessible
  });

  await s3Client.send(command);

  const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
  return { key, url };
}

export async function storageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return { key, url };
}
```

**Install AWS SDK:**
```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Update Environment Variables:**
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=purposeful-coaching-files
```

**Replace imports:**
```typescript
// Old: import { storagePut, storageGet } from "./storage";
// New: import { storagePut, storageGet } from "./storage-s3";
```

---

**3.2 Replace AI with Direct OpenAI**

Update `server/_core/llm.ts`:

```typescript
// Replace resolveApiUrl function:
const resolveApiUrl = () => "https://api.openai.com/v1/chat/completions";

// Replace assertApiKey function:
const assertApiKey = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
};

// Update fetch call in invokeLLM:
const response = await fetch(resolveApiUrl(), {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify(payload),
});
```

**Update model in payload:**
```typescript
const payload: Record<string, unknown> = {
  model: "gpt-4o", // or "gpt-4o-mini" for cheaper option
  messages: messages.map(normalizeMessage),
};
```

**Update Environment Variables:**
```env
OPENAI_API_KEY=sk-proj-...your-key...
```

---

**3.3 Replace Voice Transcription**

Update `server/_core/voiceTranscription.ts`:

```typescript
export async function transcribeAudio(params: {
  audioUrl: string;
  language?: string;
  prompt?: string;
}): Promise<TranscriptionResult> {
  const { audioUrl, language, prompt } = params;

  // Download audio file
  const audioResponse = await fetch(audioUrl);
  const audioBuffer = await audioResponse.arrayBuffer();
  
  // Create form data
  const formData = new FormData();
  formData.append("file", new Blob([audioBuffer]), "audio.mp3");
  formData.append("model", "whisper-1");
  if (language) formData.append("language", language);
  if (prompt) formData.append("prompt", prompt);
  formData.append("response_format", "verbose_json");

  // Call OpenAI Whisper API
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`);
  }

  return await response.json();
}
```

---

**3.4 Replace Email Notifications**

Already planned - use Resend or SendGrid (see EMAIL_AUTOMATION_GUIDE.md)

No changes needed here, just complete the production setup.

---

### Phase 4: Deploy to New Infrastructure (Day 3, 2-4 hours)

**4.1 Prepare for Deployment**

1. **Update package.json scripts:**
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "start": "NODE_ENV=production node dist/server/_core/index.js",
    "db:push": "drizzle-kit push"
  }
}
```

2. **Create Dockerfile (if using Docker):**
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

3. **Create .env.production:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-...
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=purposeful-coaching-files
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
JWT_SECRET=...random-string...
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

**4.2 Deploy to Render.com (Recommended)**

1. **Connect GitHub Repository**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `purposeful-live-coaching` repository

2. **Configure Service**
   - Name: `purposeful-coaching`
   - Environment: `Node`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Instance Type: `Starter ($7/month)` or `Standard ($25/month)`

3. **Add Environment Variables**
   - Copy all variables from `.env.production`
   - Add them in Render dashboard under "Environment"

4. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `purposeful-coaching-db`
   - Plan: `Starter ($7/month)`
   - Copy `DATABASE_URL` to web service environment variables

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Get your URL: `https://purposeful-coaching.onrender.com`

6. **Run Database Migration**
   - In Render dashboard, go to "Shell"
   - Run: `pnpm db:push`
   - Verify tables created

---

**4.3 Configure Custom Domain (Optional)**

1. **Buy Domain** (if you don't have one)
   - Namecheap: ~$10/year
   - Google Domains: ~$12/year
   - Cloudflare: ~$9/year

2. **Add Domain to Render**
   - In Render dashboard, go to "Settings" → "Custom Domain"
   - Add your domain: `purposefullive.com`
   - Copy DNS records

3. **Update DNS**
   - Go to your domain registrar
   - Add CNAME record: `www` → `purposeful-coaching.onrender.com`
   - Add A record: `@` → Render IP address
   - Wait for DNS propagation (5-60 minutes)

4. **Enable SSL**
   - Render automatically provisions SSL certificate
   - Your site will be available at `https://purposefullive.com`

---

### Phase 5: Test Everything (Day 3-4, 4-6 hours)

**5.1 Critical Path Testing**

Run through PRE_LAUNCH_QA_CHECKLIST.md on new infrastructure:

- [ ] Homepage loads correctly
- [ ] Can create account (with new auth)
- [ ] Can login
- [ ] Can start subscription
- [ ] Stripe checkout works
- [ ] AI coach responds correctly
- [ ] File upload works (to S3)
- [ ] Files are accessible
- [ ] Crisis detection works
- [ ] Admin dashboard accessible
- [ ] Email notifications send

**5.2 Verify No Manus Dependencies**

Check that nothing calls Manus services:

```bash
# Search for Manus references
grep -r "manus.im" server/
grep -r "forge" server/
grep -r "BUILT_IN_FORGE" server/

# Should only find comments, no active code
```

**5.3 Load Testing**

Test that your infrastructure can handle load:

```bash
# Install Apache Bench
brew install ab  # macOS
apt-get install apache2-utils  # Linux

# Test homepage
ab -n 1000 -c 10 https://purposefullive.com/

# Test AI endpoint (requires auth token)
ab -n 100 -c 5 -H "Cookie: session=..." https://purposefullive.com/api/trpc/aiChat.sendMessage
```

**Target Performance:**
- Homepage: <2 seconds
- AI response: <10 seconds
- File upload: <5 seconds for 1MB

---

### Phase 6: Migrate Data (If Needed)

**If you have existing users on Manus:**

**6.1 Export Data from Manus Database**

```bash
# Connect to Manus database
psql $DATABASE_URL

# Export users
\copy users TO 'users.csv' CSV HEADER;

# Export conversations
\copy ai_conversations TO 'conversations.csv' CSV HEADER;

# Export messages
\copy conversation_messages TO 'messages.csv' CSV HEADER;

# Export subscriptions
\copy subscriptions TO 'subscriptions.csv' CSV HEADER;

# Exit
\q
```

**6.2 Import Data to New Database**

```bash
# Connect to new database
psql $NEW_DATABASE_URL

# Import users
\copy users FROM 'users.csv' CSV HEADER;

# Import conversations
\copy ai_conversations FROM 'conversations.csv' CSV HEADER;

# Import messages
\copy conversation_messages FROM 'messages.csv' CSV HEADER;

# Import subscriptions
\copy subscriptions FROM 'subscriptions.csv' CSV HEADER;

# Exit
\q
```

**6.3 Migrate Files from Manus S3 to Your S3**

```bash
# Install AWS CLI
brew install awscli  # macOS
apt-get install awscli  # Linux

# Configure AWS credentials
aws configure

# Copy files (if you have access to Manus S3)
aws s3 sync s3://manus-bucket/your-files/ s3://purposeful-coaching-files/

# Or download and re-upload manually
```

---

## 💰 Cost Comparison

### Current (Manus)
- Hosting: Included in Manus subscription
- Database: Included
- Storage: Included
- AI: Included (proxied)
- **Total: $0** (but dependent on Manus)

### After Migration (Recommended Setup)
- **Render Web Service:** $25/month
- **Render PostgreSQL:** $7/month
- **AWS S3:** ~$2/month
- **OpenAI API:** ~$50-200/month (depends on usage)
- **Clerk Auth:** Free (up to 10,000 users)
- **Resend Email:** Free (up to 3,000 emails/month)
- **Domain:** ~$1/month
- **Total: ~$85-210/month**

### Budget Alternative
- **Railway Web + DB:** $20/month
- **Cloudflare R2:** $1/month
- **OpenAI API:** ~$50-200/month
- **Supabase Auth:** Free
- **Resend Email:** Free
- **Domain:** ~$1/month
- **Total: ~$72-222/month**

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Choose hosting provider (Render recommended)
- [ ] Create accounts for all services
- [ ] Set up payment methods
- [ ] Backup all data from Manus
- [ ] Document current environment variables

### Infrastructure Setup
- [ ] Create PostgreSQL database
- [ ] Create S3 bucket (or R2)
- [ ] Create OpenAI account and API key
- [ ] Set up Clerk (or alternative auth)
- [ ] Set up Resend/SendGrid
- [ ] Configure all environment variables

### Code Changes
- [ ] Replace storage.ts with storage-s3.ts
- [ ] Update llm.ts to use direct OpenAI
- [ ] Update voiceTranscription.ts to use direct OpenAI
- [ ] Replace OAuth with Clerk
- [ ] Update all imports
- [ ] Test locally with new services

### Deployment
- [ ] Push code to GitHub
- [ ] Deploy to Render (or alternative)
- [ ] Run database migration
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate

### Testing
- [ ] Run complete QA checklist
- [ ] Verify no Manus dependencies
- [ ] Load test infrastructure
- [ ] Test payment processing
- [ ] Test AI coaching
- [ ] Test file uploads

### Data Migration (If Needed)
- [ ] Export data from Manus database
- [ ] Import data to new database
- [ ] Migrate files to new S3
- [ ] Verify data integrity

### Go Live
- [ ] Update DNS to point to new infrastructure
- [ ] Monitor for errors
- [ ] Notify users of any changes
- [ ] Decommission Manus deployment

---

## 🚨 Risks & Mitigation

### Risk 1: Downtime During Migration
**Impact:** Users can't access platform

**Mitigation:**
- Do migration during low-traffic hours (3-5 AM)
- Keep Manus deployment running until new one verified
- Use DNS to switch traffic (instant cutover)
- Have rollback plan ready

### Risk 2: Data Loss
**Impact:** User data, conversations, files lost

**Mitigation:**
- Export complete backup before migration
- Verify backup can be restored
- Test import process on staging environment
- Keep Manus database accessible for 30 days

### Risk 3: Cost Overruns
**Impact:** Monthly costs higher than expected

**Mitigation:**
- Start with smallest instance sizes
- Monitor usage closely first month
- Set up billing alerts in AWS/OpenAI
- Optimize after seeing real usage patterns

### Risk 4: Authentication Issues
**Impact:** Users can't log in

**Mitigation:**
- Test auth thoroughly before migration
- Keep old auth system running temporarily
- Provide clear migration instructions to users
- Have support email ready for issues

---

## 🎯 Recommended Timeline

### Conservative Approach (1 Week)
- **Day 1-2:** Set up all infrastructure, test locally
- **Day 3-4:** Deploy to staging, comprehensive testing
- **Day 5:** Data migration and final testing
- **Day 6:** Go live, monitor closely
- **Day 7:** Fix any issues, optimize

### Aggressive Approach (3 Days)
- **Day 1:** Set up infrastructure, update code
- **Day 2:** Deploy and test
- **Day 3:** Data migration and go live

### Recommended: **5 Days**
- Allows time for unexpected issues
- Thorough testing before go-live
- Less stressful than aggressive approach
- More confidence in production readiness

---

## 📞 Support Resources

### Render Support
- Docs: https://render.com/docs
- Community: https://community.render.com
- Email: support@render.com

### AWS Support
- Docs: https://docs.aws.amazon.com
- Forums: https://forums.aws.amazon.com
- Support: https://console.aws.amazon.com/support

### OpenAI Support
- Docs: https://platform.openai.com/docs
- Community: https://community.openai.com
- Email: support@openai.com

### Clerk Support
- Docs: https://clerk.com/docs
- Discord: https://clerk.com/discord
- Email: support@clerk.com

---

## 🎯 Final Recommendation

**Start with Render + Clerk + Direct OpenAI**

This combination gives you:
- ✅ Easy deployment (similar to Manus)
- ✅ Reliable infrastructure
- ✅ Professional authentication
- ✅ Full control over your platform
- ✅ Reasonable costs (~$100-200/month)

**Timeline:** 5 days for complete migration with thorough testing

**Cost:** ~$85-210/month (vs $0 on Manus but with full independence)

**You'll own your platform completely and can scale without limits. 🚀**
