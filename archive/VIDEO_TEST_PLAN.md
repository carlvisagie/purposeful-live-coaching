# Video Implementation Test Plan

## Expected Features (Per Master Guide + Code)

### 1. Video Preview Component
**Location:** Live Session Assistant page (`/live-session`)

**Expected UI:**
- Card titled "Video Preview"
- Video element showing coach's camera feed
- Placeholder when camera is off: "Camera not started"
- 16:9 aspect ratio
- Rounded corners, professional styling

**Test Steps:**
1. Navigate to `/live-session`
2. Verify "Video Preview" card exists
3. Click "Test Equipment" button
4. Allow camera/microphone permissions
5. Verify video feed appears
6. Verify video quality indicator shows (e.g., "1280x720 @ 30fps")

### 2. Equipment Testing
**Expected UI:**
- "Test Equipment" button
- Shows video quality (resolution + FPS)
- Shows audio level monitoring
- Green/red indicators for video/audio status

**Test Steps:**
1. Click "Test Equipment"
2. Verify camera activates
3. Verify audio level bar appears and moves when speaking
4. Verify video quality text displays
5. Verify no errors in console

### 3. Audio Level Monitoring
**Expected UI:**
- Progress bar showing audio level (0-100%)
- Color-coded: green (>70%), yellow (30-70%), red (<30%)
- Percentage display
- Updates in real-time

**Test Steps:**
1. Start equipment test
2. Speak into microphone
3. Verify audio level bar moves
4. Verify percentage updates
5. Verify color changes based on level

### 4. Video/Audio Toggle Controls
**Expected UI:**
- "Toggle Video" button (green when on, red when off)
- "Toggle Microphone" button (green when on, red when off)
- Icons: Video camera, microphone
- Buttons work during active session

**Test Steps:**
1. Start session
2. Click "Toggle Video"
3. Verify video feed stops/starts
4. Click "Toggle Microphone"
5. Verify audio mutes/unmutes
6. Verify button colors change

### 5. Session Recording
**Expected Functionality:**
- Records video + audio when session starts
- MediaRecorder uses VP9 + Opus codecs
- WebM format
- Saves to database/S3 (if implemented)

**Test Steps:**
1. Click "Start Session"
2. Verify recording starts
3. Speak and move
4. Click "End Session"
5. Verify recording stops
6. Check if recording saved (console/network tab)

## Browser Compatibility
- Chrome/Edge: Full support expected
- Firefox: Should work
- Safari: May have codec issues (VP9)

## Console Checks
- No errors related to getUserMedia
- No errors related to MediaRecorder
- No errors related to Web Audio API
- No TypeScript errors

## Network Checks
- Video/audio permissions requested
- MediaStream created successfully
- Recording blob created
- Upload to backend (if implemented)

## Performance Checks
- Video preview smooth (30fps)
- Audio monitoring responsive (<100ms latency)
- No memory leaks
- CPU usage reasonable

## Edge Cases
- Camera/mic permissions denied
- No camera/mic available
- Multiple cameras available
- Browser doesn't support getUserMedia
- Network interruption during recording

## Success Criteria
✅ All UI components visible
✅ Camera feed displays correctly
✅ Audio monitoring works
✅ Toggle controls function
✅ Recording captures video+audio
✅ No console errors
✅ Performance acceptable
✅ Graceful error handling

## Failure Scenarios to Handle
- ❌ Permissions denied → Show helpful message
- ❌ No devices → Show "No camera/mic detected"
- ❌ Browser unsupported → Show "Please use Chrome"
- ❌ Recording fails → Show error, allow retry
