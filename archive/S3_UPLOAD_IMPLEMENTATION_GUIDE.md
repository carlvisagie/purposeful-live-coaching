# S3 Upload Implementation Guide for LiveSessionAssistant

**Date:** December 10, 2025  
**Status:** ⚠️ Incomplete - S3 upload not implemented  
**Priority:** Medium

---

## 🎯 CURRENT STATUS

### What Works
- ✅ UI for LiveSessionAssistant
- ✅ Audio recording in browser
- ✅ Backend transcription API (`liveSession.transcribeAudio`)
- ✅ Basic keyword analysis

### What Doesn't Work
- ❌ S3 upload for audio files (Line 262)
- ❌ Real audio URL (using placeholder)
- ❌ Speaker detection (defaults to "client")
- ❌ Advanced AI analysis (using regex keywords)

---

## 📋 IMPLEMENTATION PLAN

### Step 1: Add S3 Upload to Frontend

**File:** `client/src/pages/LiveSessionAssistant.tsx`  
**Line:** 262

**Current Code:**
```typescript
// TODO: Upload to S3 and get URL
// For now, use a placeholder
const audioUrl = "https://placeholder-audio-url.com/chunk.webm";
```

**Required Changes:**
```typescript
// Upload audio chunk to S3
const formData = new FormData();
formData.append('audio', audioBlob, `session-${Date.now()}.webm`);

const uploadResponse = await fetch('/api/upload-audio', {
  method: 'POST',
  body: formData,
});

const { audioUrl } = await uploadResponse.json();
```

---

### Step 2: Create Audio Upload Endpoint

**File:** `server/routers/liveSession.ts` (or new file)

**Add Procedure:**
```typescript
uploadAudio: protectedProcedure
  .input(z.object({
    audioData: z.string(), // Base64 encoded audio
    fileName: z.string(),
    mimeType: z.string(),
  }))
  .mutation(async ({ input }) => {
    // Decode base64 audio
    const audioBuffer = Buffer.from(input.audioData, 'base64');
    
    // Generate unique S3 key
    const fileKey = `live-sessions/${Date.now()}-${input.fileName}`;
    
    // Upload to S3
    const { url } = await storagePut(
      fileKey,
      audioBuffer,
      input.mimeType
    );
    
    return { audioUrl: url, fileKey };
  }),
```

---

### Step 3: Update Frontend to Use Upload Endpoint

**File:** `client/src/pages/LiveSessionAssistant.tsx`

**Replace placeholder code with:**
```typescript
// Convert audio blob to base64
const reader = new FileReader();
reader.readAsDataURL(audioBlob);
reader.onloadend = async () => {
  const base64Audio = reader.result.split(',')[1]; // Remove data:audio/webm;base64, prefix
  
  // Upload to S3 via tRPC
  const { audioUrl } = await trpc.liveSession.uploadAudio.mutate({
    audioData: base64Audio,
    fileName: `chunk-${Date.now()}.webm`,
    mimeType: 'audio/webm',
  });
  
  // Now transcribe the uploaded audio
  const transcription = await trpc.liveSession.transcribeAudio.mutate({
    audioUrl,
  });
  
  // Process transcription...
};
```

---

### Step 4: Add Speaker Detection (Optional Enhancement)

**Current:** Defaults to "client" (Line 191)

**Enhancement Options:**

1. **Simple approach:** Let coach manually tag speaker
2. **AI approach:** Use voice recognition API
3. **Pattern approach:** Analyze speaking patterns

**Recommended:** Start with manual tagging, add AI later

**Code:**
```typescript
// Add speaker selector in UI
const [currentSpeaker, setCurrentSpeaker] = useState<"client" | "coach">("client");

// Use in transcription
speaker: currentSpeaker,
```

---

### Step 5: Enhance AI Analysis (Optional)

**Current:** Using regex keyword matching (Line 279)

**Enhancement:**
```typescript
// Call LLM for deeper analysis
const analysis = await trpc.liveSession.analyzeEmotion.mutate({
  transcription: text,
  context: conversationHistory,
});

setEmotionAnalysis({
  emotion: analysis.primaryEmotion,
  intensity: analysis.intensity,
  triggers: analysis.detectedTriggers,
  suggestions: analysis.coachSuggestions,
});
```

---

## 🔧 TECHNICAL REQUIREMENTS

### S3 Configuration
- ✅ S3 helpers already available in `server/storage.ts`
- ✅ Credentials injected from platform
- ✅ Public bucket (URLs work without signing)

### File Handling
- **Format:** WebM (browser default)
- **Size limit:** 16MB (Whisper API limit)
- **Naming:** `live-sessions/{timestamp}-{filename}.webm`
- **Cleanup:** Consider lifecycle policy to delete old files

### Security
- ✅ Protected procedure (requires authentication)
- ✅ Coach-only access (verify in procedure)
- ⚠️ Add file size validation (16MB max)
- ⚠️ Add rate limiting (prevent abuse)

---

## 📊 TESTING CHECKLIST

### Unit Tests
- [ ] Upload audio file to S3
- [ ] Verify S3 URL is returned
- [ ] Handle upload failures gracefully
- [ ] Validate file size limits
- [ ] Validate file types (audio only)

### Integration Tests
- [ ] Record audio in browser
- [ ] Upload to S3
- [ ] Transcribe uploaded audio
- [ ] Display transcription in UI
- [ ] Save session with audio URL

### Edge Cases
- [ ] Network failure during upload
- [ ] S3 service unavailable
- [ ] File too large (>16MB)
- [ ] Invalid audio format
- [ ] Concurrent uploads

---

## 🚀 DEPLOYMENT STEPS

1. **Implement S3 upload procedure** in backend
2. **Update frontend** to use real upload
3. **Test locally** with real audio files
4. **Deploy to staging** and test
5. **Monitor S3 usage** and costs
6. **Deploy to production**

---

## 💰 COST CONSIDERATIONS

### S3 Storage
- **Cost:** ~$0.023 per GB/month
- **Estimate:** 100 sessions/month × 5MB = 500MB = $0.01/month
- **Negligible cost** for typical usage

### Transcription (Whisper API)
- **Cost:** $0.006 per minute
- **Estimate:** 100 sessions × 30 min = 3000 min = $18/month
- **Moderate cost** - consider caching transcriptions

---

## ⚠️ KNOWN LIMITATIONS

### Current Implementation
- ❌ No S3 upload (placeholder URL)
- ❌ No speaker detection
- ❌ Basic keyword analysis only
- ❌ No audio file persistence

### After Implementation
- ✅ Real S3 upload
- ⚠️ Manual speaker tagging (not automatic)
- ⚠️ Basic AI analysis (can be enhanced)
- ✅ Audio files stored permanently

---

## 📝 ALTERNATIVE APPROACHES

### Option 1: Client-Side Direct Upload
- Upload directly from browser to S3 (presigned URL)
- **Pros:** Faster, no server load
- **Cons:** More complex, security concerns

### Option 2: Streaming Upload
- Stream audio chunks as they're recorded
- **Pros:** Real-time processing
- **Cons:** Complex implementation

### Option 3: Current Approach (Recommended)
- Upload complete audio file via backend
- **Pros:** Simple, secure, works
- **Cons:** Slight delay for large files

---

## ✅ CONCLUSION

**S3 upload is straightforward to implement:**
1. Use existing `storagePut` helper
2. Add upload procedure to backend
3. Update frontend to call procedure
4. Test and deploy

**Estimated effort:** 2-4 hours  
**Priority:** Medium (feature usable without it)  
**Blocker:** None (all dependencies ready)

**The backend transcription API already works - we just need to give it real URLs instead of placeholders!**
