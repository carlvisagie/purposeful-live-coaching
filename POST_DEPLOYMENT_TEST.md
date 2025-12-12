# Post-Deployment Test Checklist
## Live Session Assistant - Audio & Voice Recognition

**Test URL:** https://purposeful-live-coaching-production.onrender.com/live-session

---

## ✅ Test 1: Audio Level Monitoring

1. **Open Live Session Assistant**
   - Navigate to `/live-session`
   - Page should load without errors

2. **Click "Test Equipment"**
   - Browser asks for camera/mic permissions → Click "Allow"
   - Video preview should show your Insta360 Link camera feed
   - Audio Level indicator should appear below video

3. **Speak into your Rode NT1 microphone**
   - Audio level bar should move up and down as you speak
   - Percentage should update in real-time (0-100%)
   - Colors should change:
     - **Red** (0-30%) = Too quiet
     - **Yellow** (30-70%) = Moderate
     - **Green** (70-100%) = Good levels

4. **Expected Result:**
   - ✅ Audio levels update smoothly and continuously
   - ✅ No lag or stuttering
   - ✅ Levels respond immediately to voice

---

## ✅ Test 2: Voice Recognition (Client Identification)

1. **Click "Start Session"** (not "Test Equipment")
   - Browser asks for permissions → Click "Allow"
   - Recording starts
   - Toast message: "Session recording started"

2. **Speak continuously for 5 seconds**
   - Say something like: "Hello, this is [your name], testing the voice recognition system"
   - Keep speaking naturally

3. **After 5 seconds:**
   - **If client recognized:** Toast appears with "Welcome back, [Name]! 👋"
   - **If not recognized:** Toast appears with "Client not recognized"
   - **If error:** Toast appears with "Voice recognition unavailable"

4. **Expected Result:**
   - ✅ No "Voice recognition unavailable" error
   - ✅ System attempts recognition (even if client not found in database)
   - ✅ No console errors

---

## ✅ Test 3: Live Transcription

1. **While session is recording:**
   - Speak clearly into the microphone
   - Wait 5-10 seconds

2. **Check "Live Transcript" section**
   - Should show transcribed text appearing in real-time
   - Each segment should have timestamp and speaker label

3. **Expected Result:**
   - ✅ Transcript updates as you speak
   - ✅ Text is accurate
   - ✅ No lag > 10 seconds

---

## ✅ Test 4: AI Coaching Prompts

1. **While session is recording:**
   - Speak about emotions or challenges
   - Example: "I've been feeling really anxious lately about work"

2. **Check "AI Coaching Prompts" panel**
   - Should populate with relevant coaching suggestions
   - Prompts should be specific to what you said

3. **Expected Result:**
   - ✅ Prompts appear after speaking
   - ✅ Prompts are relevant to conversation
   - ✅ Prompts have priority levels

---

## ✅ Test 5: Session Recording & Stop

1. **Click "Stop Session"**
   - Recording stops
   - Video preview goes black
   - Audio levels stop updating
   - Toast message: "Session recording stopped"

2. **Expected Result:**
   - ✅ Clean stop, no errors
   - ✅ Session summary generated
   - ✅ All data saved

---

## 🚨 Known Limitations (Not Bugs)

- **Voice recognition requires backend API** - May show "not recognized" if no clients in database yet
- **Transcription requires Whisper API** - Check server logs if transcription fails
- **5-second delay** - Voice recognition waits for first audio chunk (normal)

---

## 📊 What to Report Back

**If everything works:**
- ✅ "All tests passed! Audio levels working, voice recognition attempting, transcription running"

**If something fails:**
- ❌ Which test failed?
- ❌ What error message appeared?
- ❌ What did you see in the browser console (F12 → Console tab)?

---

**Deployment Status:** Waiting for build to complete...
**ETA:** ~10 minutes from push (7:58 PM)
