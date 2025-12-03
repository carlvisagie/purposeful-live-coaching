# Session Recording & Documentation Research
## Industry Standards for Coaching Platforms

**Research Date:** December 3, 2025  
**Purpose:** Determine best practices for session recording, storage, and client access

---

## Key Findings

### 1. **Two Types of Documentation (Mental Health Standard)**

**Progress Notes (Client-Accessible):**
- Official medical/coaching record
- Documents session content, goals, interventions, progress
- **Clients HAVE RIGHT TO ACCESS** under HIPAA
- Must be shared with insurance, other providers
- Required for continuity of care
- Stored in main client record
- **Examples:** Session date, goals discussed, techniques used, homework assigned, progress made

**Psychotherapy Notes (Private, Coach-Only):**
- Personal notes for coach's use only
- Impressions, hunches, supervision questions
- **Clients DO NOT have right to access**
- NOT shared with anyone (except court order)
- Stored separately from client record
- **Examples:** "Client seems resistant to discussing father," "Need to explore this in supervision," "Reminds me of another case"

### 2. **Recording Storage Standards**

**Security Requirements:**
- Encrypted storage (HIPAA-compliant)
- Secure cloud storage (AWS S3, Google Cloud, Azure)
- Access controls (who can view/download)
- Audit trails (who accessed when)

**Popular Solutions:**
- **Coaching Platforms:** CoachingLoft, Simply.Coach, TheraPlatform
- **Cloud Storage:** Dropbox Business (HIPAA), Google Drive Enterprise, Microsoft OneDrive
- **Specialized:** Upheal (AI transcription + secure storage)

### 3. **Client Access Best Practices**

**What Clients Should Access:**
- ✅ Session recordings (video/audio)
- ✅ Session transcripts
- ✅ Progress notes/session summaries
- ✅ Goals and action items
- ✅ Homework assignments
- ❌ Coach's private notes/impressions

**Access Methods:**
- Secure client portal
- Time-limited download links
- Streaming (no download option for extra security)
- Mobile app access

### 4. **Consent & Legal Requirements**

**Before Recording:**
- ✅ Explicit written consent required
- ✅ Explain how recordings will be used
- ✅ Explain how recordings will be stored
- ✅ Explain who can access recordings
- ✅ Right to decline recording
- ✅ Right to request deletion

**Retention Policies:**
- Minimum: Duration of coaching relationship
- Recommended: 7 years after last session
- Some jurisdictions: Indefinite retention

### 5. **Recording Features (Industry Standard)**

**Must-Have:**
- High-quality audio/video recording
- Automatic transcription
- Secure encrypted storage
- Easy client access
- Search functionality (search transcripts)
- Download capability

**Nice-to-Have:**
- AI-generated session summaries
- Keyword tagging
- Emotion detection
- Progress tracking over time
- Integration with scheduling/billing

---

## Recommendations for Purposeful Live Coaching

### **Proposed System Architecture**

**Two-Tier Documentation System:**

**Tier 1: Client-Accessible (Progress Documentation)**
- Session recordings (video + audio)
- AI-generated transcripts
- Session summaries (what was discussed, goals, homework)
- Progress tracking
- Emotion logs from session
- Action items

**Tier 2: Coach-Only (Private Notes)**
- Coach's personal impressions
- Supervision questions
- Clinical hunches
- AI coaching prompts received during session
- Private reflections

### **Storage Structure**

```
Client Dashboard:
├── My Sessions
│   ├── Session 1 (Date)
│   │   ├── 📹 Video Recording
│   │   ├── 🎤 Audio Recording
│   │   ├── 📝 Transcript
│   │   ├── 📊 Session Summary
│   │   ├── 🎯 Goals & Action Items
│   │   └── 💭 Emotion Timeline
│   ├── Session 2 (Date)
│   └── ...
└── My Progress
    ├── Emotion Trends
    ├── Goal Completion
    └── Overall Journey

Coach Dashboard:
├── All Clients
│   ├── Client A
│   │   ├── Session History (with recordings)
│   │   ├── Private Notes (coach-only)
│   │   ├── AI Insights
│   │   └── Progress Analytics
│   └── ...
└── Today's Sessions
```

### **Implementation Plan**

**Database Tables Needed:**
```sql
sessionRecordings:
- id
- sessionId (links to sessions table)
- clientId
- coachId
- videoUrl (S3)
- audioUrl (S3)
- transcriptUrl (S3)
- duration
- recordedAt
- status (processing/ready/failed)
- clientCanAccess (boolean)

sessionSummaries:
- id
- sessionId
- summary (AI-generated, client-accessible)
- goals (array)
- homework (array)
- emotionTimeline (JSON)
- keyMoments (array)

coachPrivateNotes:
- id
- sessionId
- coachId
- notes (private, coach-only)
- aiPromptsReceived (JSON)
- supervisionQuestions (text)
- createdAt
```

**Features to Build:**
1. ✅ Record session (video + audio)
2. ✅ Auto-transcribe with Whisper API
3. ✅ AI-generate session summary
4. ✅ Store recordings in S3
5. ✅ Client portal to view sessions
6. ✅ Coach portal with private notes
7. ✅ Search transcripts
8. ✅ Download recordings
9. ✅ Consent management
10. ✅ Retention policy automation

---

## Competitive Analysis

**What Top Platforms Offer:**

**CoachingLoft:**
- Integrated video recording
- Automatic transcription
- Session notes
- Client portal access
- Secure storage

**Simply.Coach:**
- Video call + recording
- Note-taking during session
- Client access to recordings
- Progress tracking

**TheraPlatform:**
- HIPAA-compliant recording
- Encrypted cloud storage
- Client portal
- Automatic transcription
- Session summaries

**Upheal (AI-Powered):**
- AI transcription
- AI-generated insights
- Emotion detection
- Progress tracking
- Separate psychotherapy notes

---

## Conclusion

**Golden Standard = Two-Tier System:**

1. **Client-Facing:** Full access to recordings, transcripts, summaries, progress
2. **Coach-Private:** Separate private notes, AI prompts, supervision questions

**Why This Works:**
- ✅ Meets legal requirements (HIPAA, consent)
- ✅ Protects coach's clinical process
- ✅ Gives clients maximum value
- ✅ Enables quality improvement
- ✅ Supports supervision/training
- ✅ Creates competitive advantage

**Our Advantage:**
- AI-powered transcription (automatic)
- Real-time emotion detection
- AI coaching assistant prompts
- Comprehensive progress tracking
- All in ONE platform (no switching tools)

---

## Next Steps

1. Build `sessionRecordings` table
2. Integrate Zoom recording API (or built-in recording)
3. Auto-upload recordings to S3
4. Generate AI summaries
5. Build client portal for session access
6. Build coach portal with private notes
7. Implement consent workflow
8. Add search functionality
9. Create retention policy automation

**Estimated Build Time:** 2-3 days for MVP
