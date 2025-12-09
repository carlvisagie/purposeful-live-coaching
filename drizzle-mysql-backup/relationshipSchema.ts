/**
 * RELATIONSHIP CHALLENGES MODULE
 * Evidence-based approach using Gottman Method, Attachment Theory, and Communication Research
 * Research sources: Gottman Institute, Sue Johnson (EFT), John Bowlby (Attachment Theory)
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Relationship Profiles
export const relationshipProfiles = pgTable("relationship_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Relationship Type & Status
  relationshipType: varchar("relationship_type", { length: 50 }),
  relationshipStatus: varchar("relationship_status", { length: 50 }),
  relationshipDuration: integer("relationship_duration"), // months
  
  // Partner Information (optional, for privacy)
  partnerInvolved: boolean("partner_involved").default(false), // Is partner also using platform?
  partnerUserId: varchar("partner_user_id", { length: 255 }),
  
  // Attachment Style (evidence-based assessment)
  attachmentStyle: varchar("attachment_style", { length: 50 }),
  partnerAttachmentStyle: varchar("partner_attachment_style", { length: 50 }),
  
  // Love Languages (Gary Chapman's 5 Love Languages)
  primaryLoveLanguage: varchar("primary_love_language", { length: 50 }),
  secondaryLoveLanguage: varchar("secondary_love_language", { length: 50 }),
  partnerPrimaryLoveLanguage: varchar("partner_primary_love_language", { length: 50 }),
  partnerSecondaryLoveLanguage: varchar("partner_secondary_love_language", { length: 50 }),
  
  // Relationship Goals
  primaryGoal: varchar("primary_goal", { length: 50 }),
  
  specificGoals: text("specific_goals"), // JSON array
  
  // Current Challenges
  mainChallenges: text("main_challenges"), // JSON array
  conflictFrequency: varchar("conflict_frequency", { length: 50 }),
  
  // Gottman Four Horsemen Assessment
  criticismLevel: integer("criticism_level"), // 1-10
  contemptLevel: integer("contempt_level"),
  defensivenessLevel: integer("defensiveness_level"),
  stonewallinglevel: integer("stonewalling_level"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Communication Logs - Track conversations & conflicts
export const communicationLogs = pgTable("communication_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  logDate: timestamp("log_date").notNull(),
  
  // Conversation Type
  conversationType: varchar("conversation_type", { length: 50 }),
  
  // Topic & Context
  topic: varchar("topic", { length: 255 }).notNull(),
  context: text("context"),
  
  // Emotional State
  emotionBefore: varchar("emotion_before", { length: 255 }),
  intensityBefore: integer("intensity_before"), // 1-10
  
  // Communication Quality (Gottman-based)
  usedSoftStartup: boolean("used_soft_startup"), // Did you start gently?
  expressedNeeds: boolean("expressed_needs"), // Did you express your needs clearly?
  listenedActively: boolean("listened_actively"), // Did you listen to understand?
  validatedPartner: boolean("validated_partner"), // Did you validate their feelings?
  foundCompromise: boolean("found_compromise"), // Did you find a solution?
  
  // Four Horsemen Check
  usedCriticism: boolean("used_criticism"),
  usedContempt: boolean("used_contempt"),
  usedDefensiveness: boolean("used_defensiveness"),
  usedStonewalling: boolean("used_stonewalling"),
  
  // Outcome
  outcome: varchar("outcome", { length: 50 }),
  emotionAfter: varchar("emotion_after", { length: 255 }),
  intensityAfter: integer("intensity_after"),
  
  // Reflection
  whatWorked: text("what_worked"),
  whatToImprove: text("what_to_improve"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Gottman Love Maps - Know your partner deeply
export const loveMaps = pgTable("love_maps", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Partner's Inner World
  partnerDreams: text("partner_dreams"), // JSON array
  partnerFears: text("partner_fears"),
  partnerStressors: text("partner_stressors"),
  partnerJoys: text("partner_joys"),
  
  // Daily Life
  partnerDailyRoutine: text("partner_daily_routine"),
  partnerFavorites: text("partner_favorites"), // JSON: {food, movie, activity, etc.}
  partnerPetPeeves: text("partner_pet_peeves"),
  
  // Relationship History
  howWeMet: text("how_we_met"),
  bestMemories: text("best_memories"), // JSON array
  hardestMoments: text("hardest_moments"),
  
  // Future Vision
  sharedGoals: text("shared_goals"), // JSON array
  individualGoals: text("individual_goals"),
  
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bids for Connection - Gottman's turning toward/away/against
export const connectionBids = pgTable("connection_bids", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  bidDate: timestamp("bid_date").notNull(),
  
  // Bid Details
  bidType: varchar("bid_type", { length: 50 }),
  bidDescription: text("bid_description"),
  
  // Response
  response: varchar("response", { length: 50 }),
  responseDescription: text("response_description"),
  
  // Impact
  emotionalImpact: integer("emotional_impact"), // 1-10 (positive or negative)
  connectionStrength: integer("connection_strength"), // 1-10
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Repair Attempts - Track efforts to heal & reconnect
export const repairAttempts = pgTable("repair_attempts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  attemptDate: timestamp("attempt_date").notNull(),
  
  // What Happened
  conflictDescription: text("conflict_description"),
  
  // Repair Strategy
  repairStrategy: varchar("repair_strategy", { length: 50 }),
  
  repairDetails: text("repair_details"),
  
  // Partner Response
  partnerResponse: varchar("partner_response", { length: 50 }),
  
  // Outcome
  conflictResolved: boolean("conflict_resolved"),
  connectionRestored: boolean("connection_restored"),
  
  // Learning
  effectiveness: integer("effectiveness"), // 1-10
  whatLearned: text("what_learned"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relationship Rituals - Build connection through routines
export const relationshipRituals = pgTable("relationship_rituals", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  ritualType: varchar("ritual_type", { length: 50 }),
  
  ritualName: varchar("ritual_name", { length: 255 }).notNull(),
  description: text("description"),
  frequency: varchar("frequency", { length: 50 }),
  
  // Tracking
  lastCompleted: timestamp("last_completed"),
  completionCount: integer("completion_count").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  
  // Impact
  connectionImpact: integer("connection_impact"), // 1-10 average
  
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Breakup Recovery (if applicable)
export const breakupRecovery = pgTable("breakup_recovery", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  breakupDate: timestamp("breakup_date"),
  relationshipDuration: integer("relationship_duration"), // months
  
  // Breakup Context
  initiator: varchar("initiator", { length: 50 }),
  reason: text("reason"),
  
  // Recovery Phase (evidence-based stages of grief)
  currentPhase: varchar("current_phase", { length: 50 }),
  
  // No Contact
  noContactActive: boolean("no_contact_active").default(false),
  noContactStartDate: timestamp("no_contact_start_date"),
  noContactDuration: integer("no_contact_duration"), // days
  
  // Healing Activities
  healingActivities: text("healing_activities"), // JSON array
  supportSystem: text("support_system"), // JSON array
  
  // Progress Markers
  daysWithoutContact: integer("days_without_contact").default(0),
  goodDaysCount: integer("good_days_count").default(0),
  badDaysCount: integer("bad_days_count").default(0),
  
  // Growth & Lessons
  lessonsLearned: text("lessons_learned"), // JSON array
  personalGrowth: text("personal_growth"),
  futureGoals: text("future_goals"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// Love Language Actions - Track how you express & receive love (Gary Chapman's 5 Love Languages)
export const loveLanguageActions = pgTable("love_language_actions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  actionDate: timestamp("action_date").notNull(),
  
  // Action Type
  actionType: varchar("action_type", { length: 50 }),
  
  // Love Language
  loveLanguage: varchar("love_language", { length: 50 }),
  
  // Specific Action
  actionDescription: text("action_description").notNull(),
  
  // Examples by type:
  // Words: "Said 'I'm proud of you'", "Wrote a love note", "Complimented their effort"
  // Quality Time: "Had dinner without phones", "Went for a walk together", "Had deep conversation"
  // Gifts: "Brought their favorite coffee", "Surprise flowers", "Meaningful book"
  // Acts of Service: "Did the dishes", "Filled their car with gas", "Made their favorite meal"
  // Physical Touch: "Long hug", "Held hands during movie", "Back massage"
  
  // Impact
  emotionalImpact: integer("emotional_impact"), // 1-10
  connectionFelt: integer("connection_felt"), // 1-10
  
  // Partner Response (if given)
  partnerResponse: text("partner_response"),
  
  createdAt: timestamp("created_at").defaultNow(),
});
