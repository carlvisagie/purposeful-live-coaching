/**
 * SPIRITUAL ENGINE
 * Evidence-based approach using Mindfulness Research, Contemplative Science, Purpose Psychology, and Meditation Studies
 * Research sources: Jon Kabat-Zinn (MBSR), Richie Davidson (neuroscience of meditation), Viktor Frankl (logotherapy), William Damon (purpose research)
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Tracks what practices work best for each user
 * - Adapts recommendations based on user response
 * - Learns optimal timing and duration for each individual
 * - Integrates with latest meditation & mindfulness research
 */

import { boolean, decimal, int, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Spiritual Profiles
export const spiritualProfiles = pgTable("spiritual_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Spiritual Background
  spiritualBackground: pgEnum("spiritual_background", [
    "religious",
    "spiritual_not_religious",
    "secular",
    "agnostic",
    "atheist",
    "exploring",
    "prefer_not_to_say"
  ]),
  
  religiousTradition: varchar("religious_tradition", { length: 255 }), // Optional: Buddhism, Christianity, Islam, etc.
  
  // Current Practice
  hasMeditationPractice: boolean("has_meditation_practice").default(false),
  meditationExperience: pgEnum("meditation_experience", ["none", "beginner", "intermediate", "advanced"]),
  currentPractices: text("current_practices"), // JSON array
  
  // Spiritual Goals
  primaryGoal: pgEnum("primary_goal", [
    "reduce_stress",
    "find_peace",
    "discover_purpose",
    "connect_with_something_greater",
    "develop_compassion",
    "increase_awareness",
    "heal_spiritually",
    "deepen_practice"
  ]),
  
  specificGoals: text("specific_goals"), // JSON array
  
  // Barriers
  barriers: text("barriers"), // JSON array: time, skepticism, don't know how, etc.
  
  // Preferences
  preferredPracticeTime: pgEnum("preferred_practice_time", ["morning", "afternoon", "evening", "night", "flexible"]),
  preferredDuration: integer("preferred_duration"), // minutes
  preferredStyle: text("preferred_style"), // JSON array: guided, silent, movement, etc.
  
  // Self-Learning Data
  mostEffectivePractices: text("most_effective_practices"), // JSON: practices that work best for this user
  optimalPracticeTime: integer("optimal_practice_time"), // minutes (learned from user data)
  bestTimeOfDay: varchar("best_time_of_day", { length: 50 }), // learned from completion rates
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Meditation Sessions
export const meditationSessions = pgTable("meditation_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  sessionDate: timestamp("session_date").notNull(),
  
  // Practice Details
  practiceType: pgEnum("practice_type", [
    "mindfulness", // MBSR-based
    "loving_kindness", // Metta meditation
    "body_scan", // Body awareness
    "breath_awareness", // Anapanasati
    "walking_meditation",
    "transcendental", // TM
    "visualization",
    "mantra",
    "open_awareness",
    "compassion", // Tonglen
    "gratitude",
    "prayer"
  ]),
  
  guidedOrSilent: pgEnum("guided_or_silent", ["guided", "silent", "hybrid"]),
  guideSource: varchar("guide_source", { length: 255 }), // App, teacher, self, etc.
  
  // Duration
  plannedDuration: integer("planned_duration"), // minutes
  actualDuration: integer("actual_duration"), // minutes
  
  // Quality Metrics
  focusLevel: integer("focus_level"), // 1-10 (how focused were you?)
  distractionLevel: integer("distraction_level"), // 1-10
  peaceLevel: integer("peace_level"), // 1-10 (how peaceful did you feel?)
  insightLevel: integer("insight_level"), // 1-10 (any insights or realizations?)
  
  // State Before/After
  emotionBefore: varchar("emotion_before", { length: 255 }),
  stressLevelBefore: integer("stress_level_before"), // 1-10
  emotionAfter: varchar("emotion_after", { length: 255 }),
  stressLevelAfter: integer("stress_level_after"), // 1-10
  
  // Experience
  experiences: text("experiences"), // JSON array: calm, restless, sleepy, energized, etc.
  insights: text("insights"), // Any realizations or insights
  challenges: text("challenges"), // What was difficult?
  
  // Completion
  completed: boolean("completed").default(true),
  
  // Self-Learning Data
  effectiveness: integer("effectiveness"), // 1-10 (calculated from before/after metrics)
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Mindfulness Practices (Daily Informal Practice)
export const mindfulnessPractices = pgTable("mindfulness_practices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // Practice Type (informal mindfulness)
  practiceType: pgEnum("practice_type", [
    "mindful_eating",
    "mindful_walking",
    "mindful_listening",
    "mindful_breathing",
    "mindful_observation",
    "mindful_movement",
    "mindful_work",
    "mindful_conversation",
    "pause_practice", // Stop and breathe
    "gratitude_practice",
    "loving_kindness_moment"
  ]),
  
  duration: integer("duration"), // minutes
  
  // Context
  activity: varchar("activity", { length: 255 }), // What were you doing?
  location: varchar("location", { length: 255 }),
  
  // Quality
  presenceLevel: integer("presence_level"), // 1-10 (how present were you?)
  awarenessLevel: integer("awareness_level"), // 1-10
  
  // Experience
  whatYouNoticed: text("what_you_noticed"),
  howItFelt: text("how_it_felt"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Purpose & Meaning Exploration
export const purposeExplorations = pgTable("purpose_explorations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  explorationDate: timestamp("exploration_date").notNull(),
  
  // Exploration Type (evidence-based purpose discovery)
  explorationType: pgEnum("exploration_type", [
    "ikigai_reflection", // Japanese concept: reason for being
    "values_clarification", // ACT-based
    "life_review", // Narrative therapy
    "peak_experiences", // Maslow
    "legacy_reflection", // What do you want to leave behind?
    "suffering_meaning", // Frankl's logotherapy
    "contribution_mapping", // How do you want to serve?
    "death_meditation", // Memento mori
    "gratitude_reflection",
    "awe_experience" // Keltner's awe research
  ]),
  
  // Reflection
  prompt: text("prompt"),
  reflection: text("reflection").notNull(),
  
  // Insights
  insights: text("insights"), // JSON array
  patterns: text("patterns"), // Recurring themes
  
  // Purpose Elements
  passions: text("passions"), // JSON array
  strengths: text("strengths"),
  values: text("values"),
  contribution: text("contribution"), // How you want to serve the world
  
  // Clarity Level
  clarityLevel: integer("clarity_level"), // 1-10 (how clear is your purpose?)
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Gratitude Practice
export const gratitudeEntries = pgTable("gratitude_entries", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  entryDate: timestamp("entry_date").notNull(),
  
  // Gratitude Items (research shows 3-5 is optimal)
  gratitude1: text("gratitude_1").notNull(),
  gratitude2: text("gratitude_2"),
  gratitude3: text("gratitude_3"),
  gratitude4: text("gratitude_4"),
  gratitude5: text("gratitude_5"),
  
  // Depth
  gratitudeDepth: pgEnum("gratitude_depth", ["surface", "moderate", "deep"]), // Surface = "coffee", Deep = "my health that allows me to enjoy coffee"
  
  // Emotional Impact
  emotionalImpact: integer("emotional_impact"), // 1-10
  
  // Savoring
  savoringTime: integer("savoring_time"), // seconds spent savoring each gratitude
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Compassion & Loving-Kindness Practice
export const compassionPractices = pgTable("compassion_practices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  practiceType: pgEnum("practice_type", [
    "loving_kindness_self", // Metta for self
    "loving_kindness_loved_one",
    "loving_kindness_neutral",
    "loving_kindness_difficult", // For someone you have conflict with
    "loving_kindness_all_beings",
    "compassion_for_suffering", // Tonglen
    "self_compassion", // Kristin Neff's research
    "forgiveness_practice",
    "acts_of_kindness" // Behavioral compassion
  ]),
  
  duration: integer("duration"), // minutes
  
  // Target
  target: varchar("target", { length: 255 }), // Who was the practice directed toward?
  
  // Experience
  emotionBefore: varchar("emotion_before", { length: 255 }),
  emotionAfter: varchar("emotion_after", { length: 255 }),
  
  warmthLevel: integer("warmth_level"), // 1-10 (how much warmth/compassion did you feel?)
  resistanceLevel: integer("resistance_level"), // 1-10 (any resistance or difficulty?)
  
  // Insights
  insights: text("insights"),
  
  // Behavioral Follow-up (for acts of kindness)
  actionTaken: text("action_taken"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Spiritual Experiences & Insights
export const spiritualExperiences = pgTable("spiritual_experiences", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  experienceDate: timestamp("experience_date").notNull(),
  
  experienceType: pgEnum("experience_type", [
    "peak_experience", // Maslow
    "flow_state", // Csikszentmihalyi
    "awe_experience", // Keltner
    "mystical_experience",
    "synchronicity",
    "insight",
    "connection",
    "transcendence",
    "presence",
    "oneness"
  ]),
  
  // Context
  context: text("context"), // What were you doing when this happened?
  trigger: varchar("trigger", { length: 255 }), // What triggered it?
  
  // Description
  description: text("description").notNull(),
  
  // Qualities
  intensity: integer("intensity"), // 1-10
  duration: integer("duration"), // minutes or hours
  
  // Impact
  emotionalImpact: integer("emotional_impact"), // 1-10
  meaningfulness: integer("meaningfulness"), // 1-10
  lifeChanging: boolean("life_changing").default(false),
  
  // Integration
  insights: text("insights"),
  howItChangedYou: text("how_it_changed_you"),
  actionsTaken: text("actions_taken"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Spiritual Milestones
export const spiritualMilestones = pgTable("spiritual_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  milestoneType: pgEnum("milestone_type", [
    "meditation_streak",
    "retreat_completed",
    "practice_deepened",
    "purpose_discovered",
    "forgiveness_achieved",
    "peace_found",
    "compassion_breakthrough",
    "spiritual_awakening",
    "habit_established"
  ]),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  achievedDate: timestamp("achieved_date"),
  
  // Significance
  significance: text("significance"),
  howYouGrew: text("how_you_grew"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Self-Learning Analytics (Engine learns from all users)
export const spiritualEngineAnalytics = pgTable("spiritual_engine_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Practice Effectiveness (aggregated across all users)
  practiceType: varchar("practice_type", { length: 100 }).notNull(),
  
  // Effectiveness Metrics
  avgStressReduction: decimal("avg_stress_reduction", { precision: 5, scale: 2 }), // Average stress reduction
  avgPeaceIncrease: decimal("avg_peace_increase", { precision: 5, scale: 2 }),
  avgCompletionRate: decimal("avg_completion_rate", { precision: 5, scale: 2 }), // % who complete
  
  // Optimal Parameters (learned)
  optimalDuration: integer("optimal_duration"), // minutes
  optimalTimeOfDay: varchar("optimal_time_of_day", { length: 50 }),
  
  // User Segments
  mostEffectiveFor: text("most_effective_for"), // JSON: {beginners: 8.5, advanced: 7.2, etc.}
  
  // Sample Size
  sessionCount: integer("session_count"), // How many sessions analyzed
  userCount: integer("user_count"), // How many users
  
  // Last Updated
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
