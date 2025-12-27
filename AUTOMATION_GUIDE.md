# Purposeful Live Coaching - Automation & Integration Guide

**Last Updated:** December 27, 2024  
**Status:** Production Ready

---

## 🎯 Overview

This guide documents all automation systems, integrations, and AI-powered workflows for the Purposeful Live Coaching platform. All sensitive credentials are stored securely in Render environment variables (see [CREDENTIALS.md](./CREDENTIALS.md)).

---

## 📹 Video Hosting Infrastructure

### Cloudflare R2 Storage

**Purpose:** Host all wellness module lesson videos  
**Status:** ✅ Active

**Configuration:**
- **Bucket Name:** `purposeful-videos`
- **Public URL:** `https://pub-bcca76051b654756be8514e67a819c51.r2.dev`
- **Storage Used:** ~750MB / 10GB free tier
- **CORS Enabled:** Yes (for purposefullivecoaching.com and purposefullivecoaching.academy)

**Videos Hosted:**
- Nutrition Lessons (6 videos)
- Physical Fitness Lessons (5 videos)
- Emotional Wellness Lessons (1 video)
- Spiritual Wellness Lessons (4 videos)

**Total:** 16 lesson videos across 4 wellness modules

---

## 📱 SMS Notifications - Twilio

### Configuration

**Purpose:** Send booking confirmations, reminders, and alerts via SMS  
**Status:** ✅ Active (Trial - needs upgrade for production)

**Account Details:**
- **Phone Number:** `+17754558329`
- **Trial Credit:** $14.35 (limited to verified numbers)
- **Credentials:** Stored securely in Render environment variables

**⚠️ Action Required:**
- **Upgrade to paid plan** to send SMS to all customers (not just verified numbers)
- Go to: https://console.twilio.com/ → Click "Upgrade" button
- Current limitation: Can only send to verified phone numbers in trial mode

**Use Cases:**
- Booking confirmations
- Session reminders (24h before)
- Payment confirmations
- Important platform updates

---

## 📧 Email Notifications - SendGrid

### Configuration

**Purpose:** Send transactional emails  
**Status:** ⚠️ Trial Ended (August 13, 2025)

**Account:** carlhvisagie@gmail.com  
**Dashboard:** https://app.sendgrid.com/

**⚠️ Action Required:**
- Choose SendGrid plan and upgrade
- Configure sender identity
- Add API key to Render environment variables

**Use Cases:**
- Welcome emails
- Password resets
- Booking confirmations (email)
- Weekly wellness tips
- Newsletter

---

## 🎬 AI Content Creator

### Overview

**Purpose:** Generate marketing videos for wellness coaching services  
**Status:** ✅ Active  
**URL:** `/coach/content-creator` or `/content-creator`

**Integration:**
- **AI Media Engine:** https://jpxfdzvm.manus.space/
- **Technology:** OpenAI GPT + DALL-E for video generation
- **Access:** Available to all coaches in dashboard

**Features:**
1. Generate promotional videos for coaching services
2. Create social media content (YouTube, Instagram, TikTok, LinkedIn, Facebook)
3. Automated script writing and voiceover
4. Visual generation using AI

**Workflow:**
1. Coach enters video topic and platform
2. AI generates script, voiceover, and visuals
3. Video is rendered and ready for download
4. Coach can share directly to social media

---

## 🤖 Sintra Virtual Employees Integration

### Overview

**Purpose:** Automate marketing, content creation, and customer engagement  
**Status:** 🔄 Ready for Configuration

### Connected Integrations

Sintra has access to:
- ✅ LinkedIn (Personal & Organization)
- ✅ Facebook + Instagram
- ✅ Gmail
- ✅ Google Calendar
- ✅ Outlook
- ✅ Google Drive
- ✅ QuickBooks
- ✅ Strava
- ✅ Notion

### Recommended Virtual Employees

#### 1. **Soshie** - Social Media Manager
**Role:** Automate social media marketing  
**Tasks:**
- Generate daily wellness tips using AI Content Creator
- Post to Instagram, Facebook, LinkedIn, TikTok
- Schedule content calendar
- Engage with comments and messages
- Track social media analytics

**Setup Instructions:**
1. In Sintra, assign Soshie to your account
2. Connect her to Facebook + Instagram integration
3. Give her instructions:
   ```
   Post daily wellness content from purposefullivecoaching.com
   - Generate 1 video per day using /content-creator
   - Post to Instagram Reels at 9 AM EST
   - Post to TikTok at 12 PM EST
   - Post to LinkedIn at 3 PM EST
   - Engage with comments within 1 hour
   ```

#### 2. **Penn** - Copywriter
**Role:** Write marketing copy and blog posts  
**Tasks:**
- Write blog posts about wellness topics
- Create email marketing campaigns
- Generate lesson descriptions
- Write social media captions
- Create landing page copy

**Setup Instructions:**
1. Assign Penn to your account
2. Connect to Google Drive (for document storage)
3. Give her instructions:
   ```
   Write 3 blog posts per week about wellness coaching
   - Topics: nutrition, fitness, emotional wellness, spiritual wellness
   - SEO-optimized (target keywords provided)
   - 1500-2000 words each
   - Save to Google Drive folder: /Blog Posts
   ```

#### 3. **Seomi** - SEO Specialist
**Role:** Optimize content for search engines  
**Tasks:**
- Keyword research for wellness coaching
- Optimize blog posts and landing pages
- Monitor search rankings
- Generate SEO reports
- Build backlinks

**Setup Instructions:**
1. Assign Seomi to your account
2. Connect to Google Analytics integration
3. Give her instructions:
   ```
   Optimize all content for SEO
   - Target keywords: "wellness coaching", "life coaching", "nutrition coaching"
   - Monitor rankings weekly
   - Generate monthly SEO report
   - Suggest content improvements
   ```

#### 4. **Milli** - Sales Representative
**Role:** Follow up with leads and convert trials  
**Tasks:**
- Follow up with trial users
- Send conversion emails
- Handle sales inquiries
- Schedule discovery calls
- Track sales pipeline

**Setup Instructions:**
1. Assign Milli to your account
2. Connect to Gmail and Google Calendar
3. Give her instructions:
   ```
   Follow up with trial users after 3 days
   - Send personalized email about their goals
   - Offer free discovery call
   - Schedule calls in Google Calendar
   - Track conversion rate
   ```

---

## 🔄 Automated Marketing Workflow

### Daily Content Generation Pipeline

**Objective:** Generate and post wellness content automatically every day

**Workflow:**

```
1. AI Content Creator (9:00 AM EST)
   ↓ Generates video about wellness topic
   
2. Soshie (Sintra)
   ↓ Downloads video from platform
   ↓ Adds captions and hashtags
   
3. Social Media Posting
   ├─→ Instagram Reels (9:30 AM EST)
   ├─→ TikTok (12:00 PM EST)
   ├─→ LinkedIn (3:00 PM EST)
   └─→ Facebook (6:00 PM EST)
   
4. Penn (Sintra)
   ↓ Writes blog post based on video content
   ↓ Publishes to website
   
5. Seomi (Sintra)
   ↓ Optimizes blog post for SEO
   ↓ Submits to Google Search Console
   
6. Milli (Sintra)
   ↓ Monitors new leads from content
   ↓ Sends follow-up emails
```

### Weekly Content Calendar

**Monday:** Nutrition tips  
**Tuesday:** Physical fitness routines  
**Wednesday:** Emotional wellness strategies  
**Thursday:** Spiritual wellness practices  
**Friday:** Success stories and testimonials  
**Saturday:** Live Q&A session promotion  
**Sunday:** Weekly wellness challenge

---

## 📊 Analytics & Monitoring

### Key Metrics to Track

**Platform Metrics:**
- Active users
- Session bookings
- Trial-to-paid conversion rate
- Churn rate
- Revenue

**Content Metrics:**
- Video views
- Social media engagement
- Blog traffic
- SEO rankings
- Email open rates

**Automation Metrics:**
- SMS delivery rate
- Email delivery rate
- Video generation success rate
- Social media posting consistency

### Monitoring Tools

- **Twilio Console:** SMS delivery and costs
- **SendGrid Dashboard:** Email analytics
- **Cloudflare R2:** Storage usage and bandwidth
- **Google Analytics:** Website traffic
- **Sintra Dashboard:** Virtual employee performance

---

## 🚀 Deployment Process

### Automatic Deployment

**Trigger:** Git push to `main` branch  
**Platform:** Render  
**Build Time:** ~3-5 minutes  
**Auto-deploy:** Enabled

**Deployment Steps:**
1. Code pushed to GitHub
2. Render detects changes
3. Builds new Docker container
4. Runs tests
5. Deploys to production
6. Health check
7. Live

---

## 🐛 Troubleshooting

### Videos Not Loading

**Symptom:** Black screen or "Failed to load" error  
**Solution:**
1. Check Cloudflare R2 CORS policy
2. Verify video URL format: `https://pub-bcca76051b654756be8514e67a819c51.r2.dev/{filename}.mp4`
3. Check browser console for CORS errors

### SMS Not Sending

**Symptom:** Twilio errors or messages not received  
**Solution:**
1. Check Twilio trial limitations (only verified numbers)
2. Upgrade to paid plan for production use
3. Verify phone number format: `+1XXXXXXXXXX`
4. Check Twilio console for error logs

### Email Not Sending

**Symptom:** SendGrid errors or emails not received  
**Solution:**
1. Verify SendGrid account is active (trial ended)
2. Upgrade SendGrid plan
3. Configure sender identity
4. Check spam folder

### AI Content Creator Not Working

**Symptom:** Video generation fails  
**Solution:**
1. Check AI Media Engine status: https://jpxfdzvm.manus.space/
2. Verify OpenAI API credits
3. Check browser console for errors

---

## 📈 Scaling Considerations

### When to Upgrade

**Twilio:**
- Upgrade when: Sending to more than 5 customers
- Cost: Pay-as-you-go ($0.0075/SMS)

**SendGrid:**
- Upgrade when: Sending more than 100 emails/day
- Recommended plan: Essentials ($19.95/month for 50K emails)

**Cloudflare R2:**
- Upgrade when: Exceeding 10GB storage
- Cost: $0.015/GB/month (very affordable)

**Sintra:**
- Current plan: Check Sintra dashboard
- Scale: Add more virtual employees as needed

---

## 📞 Support Contacts

**Technical Issues:**
- Render Support: https://render.com/support
- Twilio Support: https://support.twilio.com/
- SendGrid Support: https://support.sendgrid.com/
- Cloudflare Support: https://support.cloudflare.com/

**Platform Owner:**
- Email: carlhvisagie@gmail.com
- Platform: https://purposefullivecoaching.com

---

## 🎯 Next Steps

### Immediate Actions Required

1. ✅ **Upgrade Twilio** to paid plan (for production SMS)
2. ✅ **Upgrade SendGrid** and configure sender identity
3. ✅ **Configure Sintra employees** (Soshie, Penn, Seomi, Milli)
4. ✅ **Test automated workflows** end-to-end
5. ✅ **Monitor metrics** for first week

### Future Enhancements

- [ ] Add WhatsApp notifications (via Twilio)
- [ ] Integrate Stripe webhooks for payment notifications
- [ ] Add automated webinar system
- [ ] Implement AI-powered customer support chatbot
- [ ] Create mobile app with push notifications

---

**End of Automation Guide**
