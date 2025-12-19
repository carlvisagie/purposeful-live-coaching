/**
 * VOICE COACHING PREFERENCES SCHEMA
 * 
 * Stores user preferences for real-time voice coaching sessions.
 * This enables the 10X adaptive emotional intelligence system to:
 * - Remember what coaching style works for each user
 * - Track session feedback to improve over time
 * - Store notes about individual preferences
 * 
 * Research-backed: Working alliance is the #1 predictor of coaching outcomes
 * (Graßmann et al., 2020 - 291 citations)
 */

import { boolean, decimal, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Voice Coaching Preferences
 * Stores each user's preferred coaching style and adaptation settings
 */
export const voiceCoachingPreferences = pgTable("voice_coaching_preferences", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Preferred Coaching Style (learned from feedback)
  preferredStyle: varchar("preferred_style", { length: 50 }), // supportive, direct, challenging, exploratory
  
  // Energy/Pace Preferences
  preferredPace: varchar("preferred_pace", { length: 50 }), // slow, moderate, fast
  preferredEnergy: varchar("preferred_energy", { length: 50 }), // calm, balanced, high-energy
  
  // Feedback Preferences
  feedbackDirectness: varchar("feedback_directness", { length: 50 }), // gentle, balanced, direct
  challengeLevel: varchar("challenge_level", { length: 50 }), // low, medium, high
  
  // What Works (learned from sessions)
  effectiveApproaches: text("effective_approaches"), // JSON: approaches that worked well
  ineffectiveApproaches: text("ineffective_approaches"), // JSON: approaches that didn't work
  
  // Personal Notes (coach observations)
  coachNotes: text("coach_notes"), // e.g., "Responds well to humor", "Needs extra encouragement"
  
  // Triggers to Watch
  knownTriggers: text("known_triggers"), // JSON: things that cause frustration or shutdown
  
  // Voice Preferences
  preferredVoice: varchar("preferred_voice", { length: 50 }), // alloy, coral, sage, etc.
  
  // Session Stats
  totalSessions: integer("total_sessions").default(0),
  avgSessionRating: decimal("avg_session_rating", { precision: 3, scale: 1 }), // 1-10
  lastSessionDate: timestamp("last_session_date"),
  
  // Trust & Rapport
  rapportLevel: integer("rapport_level"), // 1-10 (how comfortable they are with the coach)
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Voice Coaching Session Feedback
 * Captures feedback after each session to improve future sessions
 */
export const voiceCoachingFeedback = pgTable("voice_coaching_feedback", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  preferenceId: varchar("preference_id", { length: 255 }),
  
  // Session Details
  sessionMode: varchar("session_mode", { length: 50 }), // speaker_training, interview_prep, etc.
  sessionDuration: integer("session_duration"), // seconds
  
  // User Ratings
  overallRating: integer("overall_rating"), // 1-10
  styleRating: varchar("style_rating", { length: 50 }), // too_soft, just_right, too_harsh
  paceRating: varchar("pace_rating", { length: 50 }), // too_slow, just_right, too_fast
  helpfulnessRating: integer("helpfulness_rating"), // 1-10
  
  // Qualitative Feedback
  whatWorked: text("what_worked"),
  whatDidntWork: text("what_didnt_work"),
  suggestions: text("suggestions"),
  
  // Emotional State
  startingMood: varchar("starting_mood", { length: 50 }),
  endingMood: varchar("ending_mood", { length: 50 }),
  confidenceChange: integer("confidence_change"), // -5 to +5
  
  // Would Recommend
  wouldRecommend: boolean("would_recommend"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Voice Coaching Session Logs
 * Detailed logs of each session for analysis and improvement
 */
export const voiceCoachingSessionLogs = pgTable("voice_coaching_session_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Session Details
  sessionMode: varchar("session_mode", { length: 50 }),
  voiceUsed: varchar("voice_used", { length: 50 }),
  
  // Timing
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
  
  // Engagement Metrics
  userSpeakingTime: integer("user_speaking_time"), // seconds
  coachSpeakingTime: integer("coach_speaking_time"), // seconds
  silenceTime: integer("silence_time"), // seconds
  
  // Emotional Journey (detected during session)
  emotionalJourney: text("emotional_journey"), // JSON: array of {timestamp, emotion, intensity}
  
  // Key Moments
  breakthroughMoments: text("breakthrough_moments"), // JSON: moments of insight
  struggleMoments: text("struggle_moments"), // JSON: moments of difficulty
  
  // Adaptations Made
  adaptationsMade: text("adaptations_made"), // JSON: how coach adapted during session
  
  // Transcript Summary
  transcriptSummary: text("transcript_summary"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports
export type VoiceCoachingPreference = typeof voiceCoachingPreferences.$inferSelect;
export type InsertVoiceCoachingPreference = typeof voiceCoachingPreferences.$inferInsert;

export type VoiceCoachingFeedback = typeof voiceCoachingFeedback.$inferSelect;
export type InsertVoiceCoachingFeedback = typeof voiceCoachingFeedback.$inferInsert;

export type VoiceCoachingSessionLog = typeof voiceCoachingSessionLogs.$inferSelect;
export type InsertVoiceCoachingSessionLog = typeof voiceCoachingSessionLogs.$inferInsert;
