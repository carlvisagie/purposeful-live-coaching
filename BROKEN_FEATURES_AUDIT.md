# BROKEN FEATURES AUDIT

**Date:** December 26, 2025  
**Status:** 🔴 Multiple features incomplete or non-functional

---

## 🔴 CRITICAL - CORE FEATURES BROKEN

### 1. **Crisis Detection Not Working**
**Location:** `server/routers/aiChat.ts:L420`
```typescript
const crisisFlag = "none"; // TODO: Implement crisis detection from AI response
```
**Impact:** HIGH - Safety feature not functional  
**Priority:** 🔴 CRITICAL  
**Fix Required:** Implement actual crisis detection using AI sentiment analysis

---

### 2. **Face Recognition Not Implemented**
**Location:** `server/routers/faceRecognition.ts`
```typescript
// TODO: Integrate with actual face recognition API
```
**Impact:** HIGH - Biometric authentication not working  
**Priority:** 🔴 CRITICAL  
**Fix Required:** Integrate with AWS Rekognition or similar service

---

### 3. **Voice Recognition Not Implemented**
**Location:** `server/routers/voiceRecognition.ts`
```typescript
// TODO: Integrate with actual voice biometrics API
```
**Impact:** HIGH - Biometric authentication not working  
**Priority:** 🔴 CRITICAL  
**Fix Required:** Integrate with voice biometrics service

---

### 4. **YouTube Publishing Not Working**
**Location:** `server/routers/contentPipeline.ts:L250`
```typescript
// TODO: Implement YouTube API publishing
```
**Impact:** HIGH - Content pipeline incomplete  
**Priority:** 🔴 CRITICAL  
**Fix Required:** Implement YouTube Data API v3 integration

---

### 5. **Podcast Publishing Not Working**
**Location:** `server/routers/contentPipeline.ts:L255`
```typescript
// TODO: Implement podcast publishing
```
**Impact:** HIGH - Content pipeline incomplete  
**Priority:** 🔴 CRITICAL  
**Fix Required:** Integrate with Buzzsprout/Libsyn API

---

## 🟡 HIGH PRIORITY - IMPORTANT FEATURES INCOMPLETE

### 6. **Audio Sentiment Analysis Placeholder**
**Location:** `server/lib/ai/sentimentEmotionTracker.ts`
```typescript
// For now, return mock analysis
```
**Impact:** MEDIUM - Sentiment tracking not accurate  
**Priority:** 🟡 HIGH  
**Fix Required:** Implement real audio processing with speech-to-text + sentiment

---

### 7. **Usage Tracking Incomplete**
**Location:** `server/subscriptionTierEnforcement.ts`
```typescript
sleepStoriesUsed: 0, // TODO: Track in usageTracking
focusSessionsUsed: 0, // TODO: Track in usageTracking
meditationSessionsUsed: 0, // TODO: Track in usageTracking
```
**Impact:** MEDIUM - Can't enforce subscription limits properly  
**Priority:** 🟡 HIGH  
**Fix Required:** Add tracking for all module usage

---

### 8. **Analytics Using Mock Data**
**Location:** `server/routers/analytics.ts`
```typescript
// TODO: Query real A/B test data from database
// TODO: Query real chat metrics from database
// TODO: Query real exit-intent metrics from database
// TODO: Query real ROI calculator metrics from database
// TODO: Query real conversion trend data from database
```
**Impact:** MEDIUM - Admin dashboard showing fake data  
**Priority:** 🟡 HIGH  
**Fix Required:** Connect to real database tables

---

### 9. **Scheduling CoachId Hardcoded**
**Location:** `server/routers/scheduling.ts`
```typescript
const coachId = 1; // TODO: Get from session type
```
**Impact:** MEDIUM - Can't support multiple coaches  
**Priority:** 🟡 HIGH  
**Fix Required:** Implement proper coach assignment logic

---

### 10. **Client Profile Export Placeholder**
**Location:** `server/routers/clientProfileExport.ts`
```typescript
html: "<html><body>Profile export coming soon</body></html>"
```
**Impact:** MEDIUM - Feature advertised but not working  
**Priority:** 🟡 HIGH  
**Fix Required:** Implement actual PDF generation

---

## 🟢 MEDIUM PRIORITY - NICE TO HAVE

### 11. **Vector Search Not Implemented**
**Location:** `server/coachAssistant.ts`
```typescript
// TODO: Implement vector similarity search for better matching
```
**Impact:** LOW - Would improve coach matching  
**Priority:** 🟢 MEDIUM  
**Fix Required:** Add vector database (Pinecone/Weaviate)

---

### 12. **Tone Adaptation Not Working**
**Location:** `server/lib/ai/aiCoachAssistant.ts`
```typescript
// TODO: Implement tone adaptation based on mood
```
**Impact:** LOW - AI responses less personalized  
**Priority:** 🟢 MEDIUM  
**Fix Required:** Add mood-based prompt engineering

---

### 13. **Goals Schema Not Connected**
**Location:** `server/lib/ai/aiCoachAssistant.ts`
```typescript
goals: [], // TODO: Fetch from goals schema when available
```
**Impact:** LOW - Goals not used in AI coaching  
**Priority:** 🟢 MEDIUM  
**Fix Required:** Connect to goals table

---

### 14. **Transcription Using Placeholder**
**Location:** `server/routers/contentPipeline.ts`
```typescript
return "This is a placeholder transcript. In production, this would be the actual transcription from the session recording."
```
**Impact:** LOW - Content pipeline won't work end-to-end  
**Priority:** 🟢 MEDIUM  
**Fix Required:** Integrate with Whisper API or similar

---

## 🔵 LOW PRIORITY - FUTURE ENHANCEMENTS

### 15. **Image/Video Processing Not Implemented**
**Location:** `server/services/mediaProcessing.ts`
```typescript
// TODO: Add actual image processing with sharp
// TODO: Add actual video processing with ffmpeg
```
**Impact:** LOW - Media features limited  
**Priority:** 🔵 LOW  
**Fix Required:** Add sharp and ffmpeg processing

---

### 16. **Multiple Candidate Support**
**Location:** `server/routers/faceRecognition.ts`, `server/routers/voiceRecognition.ts`
```typescript
? eq(faceEmbeddings.userId, input.candidateUserIds[0]) // TODO: Support multiple
```
**Impact:** LOW - Biometric matching limited  
**Priority:** 🔵 LOW  
**Fix Required:** Support multiple candidate matching

---

### 17. **Vapi Profile Extraction**
**Location:** `server/routers/vapiWebhook.ts`
```typescript
// TODO: Call LLM to extract: name, age, occupation, goals, challenges, etc.
```
**Impact:** LOW - Phone intake less automated  
**Priority:** 🔵 LOW  
**Fix Required:** Add LLM extraction logic

---

## 📊 SUMMARY

**Total Issues Found:** 17

**By Priority:**
- 🔴 **CRITICAL:** 5 issues (Crisis detection, Face/Voice recognition, YouTube/Podcast publishing)
- 🟡 **HIGH:** 5 issues (Audio sentiment, Usage tracking, Analytics, Scheduling, Profile export)
- 🟢 **MEDIUM:** 4 issues (Vector search, Tone adaptation, Goals connection, Transcription)
- 🔵 **LOW:** 3 issues (Media processing, Multiple candidates, Vapi extraction)

**By Category:**
- **Security/Safety:** 1 (Crisis detection)
- **Biometrics:** 2 (Face/Voice recognition)
- **Content Pipeline:** 3 (YouTube, Podcast, Transcription)
- **Analytics/Tracking:** 3 (Usage tracking, Analytics, Sentiment)
- **Admin/Management:** 2 (Scheduling, Profile export)
- **AI Enhancement:** 3 (Vector search, Tone, Goals)
- **Media Processing:** 2 (Image/Video)
- **Other:** 1 (Vapi extraction)

---

## 🎯 RECOMMENDED FIX ORDER

### Phase 1: Critical Safety & Core Features (Week 1)
1. ✅ Crisis detection (SAFETY CRITICAL)
2. ✅ Usage tracking (BILLING CRITICAL)
3. ✅ Analytics real data (ADMIN CRITICAL)

### Phase 2: Content Pipeline (Week 2)
4. ✅ YouTube publishing
5. ✅ Podcast publishing
6. ✅ Transcription service

### Phase 3: Biometrics (Week 3)
7. ✅ Face recognition integration
8. ✅ Voice recognition integration

### Phase 4: Enhancements (Week 4)
9. ✅ Audio sentiment analysis
10. ✅ Profile export
11. ✅ Scheduling improvements

### Phase 5: Nice-to-Have (Future)
12-17. All remaining features

---

## 🚨 IMMEDIATE ACTION REQUIRED

**These 3 must be fixed ASAP:**

1. **Crisis Detection** - This is a SAFETY feature. If someone is in crisis, the system should detect it.
2. **Usage Tracking** - Without this, you can't enforce subscription limits properly.
3. **Analytics** - Admin dashboard is showing fake data, making it useless for decision-making.

---

## 💡 GOOD NEWS

**The intelligent systems we just built will:**
- ✅ Detect when these broken features are called
- ✅ Log the errors with full context
- ✅ Track which features are never used (might not need fixing)
- ✅ Identify which broken features are causing the most issues

**So now you'll have DATA on which broken features to prioritize!**

---

**Would you like me to start fixing the critical issues now?**
