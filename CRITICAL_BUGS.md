# CRITICAL BUGS - December 15, 2025

## Status

- [x] Admin page SQL error - FIXED ($returningId removed from all database inserts)
- [ ] Booking system - no available times loading
- [ ] Live session recording - "Failed to start recording" error
- [ ] Live session timer - stuck at 00:00

## Bug #1: Admin Page SQL Error ✅ FIXED

**Error:** `coach_availability` table query failing
**Root Cause:** Using `$returningId()` which doesn't exist in Drizzle ORM
**Fix:** Changed all `.$returningId()` to `.returning({ id: table.id })` in 5 files
**Files Fixed:**
- server/routers/chat.ts
- server/routers/clientFiles.ts
- server/routers/identity.ts (6 occurrences)
- server/routers/liveSession.ts
- server/routers/webhooks.ts

## Bug #2: Booking System - No Available Times

**Symptom:** Calendar shows dates but "Available Times" section is empty
**URL:** /sessions/book
**Screenshot:** Shows "Sunday, December 14" but no time slots

**Investigation needed:**
- Check if coach_availability table exists and has data
- Check booking API endpoint
- Check frontend time slot rendering logic

## Bug #3: Live Session Recording Failure

**Symptom:** "Failed to start recording" error message
**URL:** /live-session
**Screenshot:** Error shown in bottom right corner

**Investigation needed:**
- Check browser permissions (camera/microphone)
- Check MediaRecorder API implementation
- Check if recording endpoint exists

## Bug #4: Live Session Timer Stuck

**Symptom:** Session timer shows "00:00" and doesn't count up
**URL:** /live-session
**Screenshot:** Timer visible but not incrementing

**Investigation needed:**
- Check timer state management
- Check if timer starts when session starts
- Check timer update interval


---

## Bug #2: Booking System - FIXED (Code Level) ✅

**Root Cause:** `coachAvailability.isActive` field was `varchar(50)` but code expected boolean
**Fix Applied:**
1. Changed schema: `isActive: boolean("isActive").notNull().default(true)`
2. Updated query: `eq(coachAvailability.isActive, true)` (removed quotes)
3. Migration generated: `drizzle/0001_unknown_earthquake.sql`

**Files Changed:**
- drizzle/schema.ts (added boolean import, fixed isActive type)
- server/db/scheduling.ts (changed "true" to true)

**Status:** Code fixed, will apply on next deployment

**Next:** Need to seed initial coach availability data after deployment

---

## Bug #3: Live Session Recording - IN PROGRESS

**Starting investigation...**
