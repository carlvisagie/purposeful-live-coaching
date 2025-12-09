/**
 * MENTAL ENGINE
 * Evidence-based approach using Cognitive Psychology, Neuroscience, Learning Science, and Memory Research
 * Research sources: Barbara Oakley (learning), Jim Kwik (memory), Andrew Huberman (neuroscience), Cal Newport (deep work)
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Tracks cognitive performance patterns
 * - Identifies optimal focus times for each user
 * - Adapts difficulty based on cognitive load
 * - Learns best learning strategies for individual
 */

import { boolean, decimal, int, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Mental Profiles
export const mentalProfiles = pgTable("mental_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Current Mental State
  mentalClarity: integer("mental_clarity"), // 1-10 baseline
  focusAbility: integer("focus_ability"), // 1-10
  memoryQuality: integer("memory_quality"), // 1-10
  cognitiveEnergy: integer("cognitive_energy"), // 1-10
  
  // Challenges
  primaryChallenges: text("primary_challenges"), // JSON: brain_fog, poor_focus, memory_issues, overwhelm, etc.
  
  // Goals
  primaryGoal: pgEnum("primary_goal", [
    "improve_focus",
    "enhance_memory",
    "increase_clarity",
    "learn_faster",
    "reduce_brain_fog",
    "boost_creativity",
    "improve_decision_making",
    "mental_performance"
  ]),
  
  // Learning Style (evidence-based)
  learningStyle: text("learning_style"), // JSON: visual, auditory, kinesthetic, reading/writing
  bestLearningTime: varchar("best_learning_time", { length: 50 }), // morning, afternoon, evening
  
  // Current Habits
  sleepQuality: integer("sleep_quality"), // 1-10 (affects cognition)
  exerciseFrequency: pgEnum("exercise_frequency", ["none", "1-2x_week", "3-4x_week", "5+x_week"]),
  screenTimeHours: integer("screen_time_hours"), // daily
  
  // Medications/Supplements affecting cognition
  cognitiveSupplements: text("cognitive_supplements"), // JSON array
  medications: text("medications"), // JSON array
  
  // Self-Learning Data
  peakFocusHours: text("peak_focus_hours"), // JSON: hours of day when focus is best
  optimalWorkDuration: integer("optimal_work_duration"), // minutes before break needed
  mostEffectiveTechniques: text("most_effective_techniques"), // JSON: techniques that work for this user
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Focus Sessions (Deep Work / Flow States)
export const focusSessions = pgTable("focus_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionDate: timestamp("session_date").notNull(),
  
  // Session Details
  sessionType: pgEnum("session_type", [
    "deep_work", // Cal Newport
    "pomodoro", // 25/5 technique
    "flow_session", // Extended focus
    "time_blocking",
    "focused_learning",
    "creative_work",
    "problem_solving"
  ]),
  
  task: varchar("task", { length: 255 }).notNull(),
  taskType: pgEnum("task_type", ["learning", "creating", "analyzing", "writing", "coding", "planning"]),
  
  // Duration
  plannedDuration: integer("planned_duration"), // minutes
  actualDuration: integer("actual_duration"), // minutes
  
  // Environment
  location: varchar("location", { length: 255 }),
  noiseLevel: pgEnum("noise_level", ["silent", "quiet", "moderate", "noisy"]),
  usedNoiseBlocking: boolean("used_noise_blocking"), // Headphones, white noise, etc.
  
  // Pre-Session State
  energyBefore: integer("energy_before"), // 1-10
  focusBefore: integer("focus_before"), // 1-10
  stressBefore: integer("stress_before"), // 1-10
  
  // Session Quality
  focusQuality: integer("focus_quality"), // 1-10
  flowState: boolean("flow_state"), // Did you achieve flow?
  distractionCount: integer("distraction_count"),
  distractionTypes: text("distraction_types"), // JSON: phone, people, thoughts, etc.
  
  // Post-Session State
  energyAfter: integer("energy_after"), // 1-10
  focusAfter: integer("focus_after"), // 1-10
  satisfactionLevel: integer("satisfaction_level"), // 1-10 with output
  
  // Output
  productivityRating: integer("productivity_rating"), // 1-10
  outputQuality: integer("output_quality"), // 1-10
  
  // What Worked / Didn't Work
  whatHelped: text("what_helped"), // JSON array
  whatHindered: text("what_hindered"), // JSON array
  
  // Self-Learning Data
  effectiveness: integer("effectiveness"), // Calculated score
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Memory Training & Practice
export const memoryPractices = pgTable("memory_practices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // Practice Type (evidence-based memory techniques)
  practiceType: pgEnum("practice_type", [
    "spaced_repetition", // Anki, flashcards
    "memory_palace", // Method of loci
    "chunking", // Breaking info into chunks
    "mnemonics", // Memory aids
    "visualization", // Mental imagery
    "association", // Linking new to known
    "active_recall", // Testing yourself
    "elaboration", // Explaining in your own words
    "interleaving" // Mixing topics
  ]),
  
  // What You're Memorizing
  contentType: pgEnum("content_type", ["facts", "concepts", "skills", "names", "numbers", "language", "other"]),
  topic: varchar("topic", { length: 255 }),
  
  // Practice Details
  duration: integer("duration"), // minutes
  itemsReviewed: integer("items_reviewed"),
  itemsRecalled: integer("items_recalled"),
  
  // Performance
  recallAccuracy: integer("recall_accuracy"), // 0-100%
  confidenceLevel: integer("confidence_level"), // 1-10
  
  // Difficulty
  difficulty: pgEnum("difficulty", ["easy", "moderate", "hard"]),
  
  // Next Review (spaced repetition)
  nextReviewDate: timestamp("next_review_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Learning Sessions
export const learningSessions = pgTable("learning_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionDate: timestamp("session_date").notNull(),
  
  // What You're Learning
  topic: varchar("topic", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  
  // Learning Method
  learningMethod: pgEnum("learning_method", [
    "reading",
    "video",
    "course",
    "practice",
    "teaching_others", // Feynman technique
    "project_based",
    "discussion",
    "experimentation"
  ]),
  
  // Duration
  duration: integer("duration"), // minutes
  
  // Engagement
  engagementLevel: integer("engagement_level"), // 1-10
  comprehensionLevel: integer("comprehension_level"), // 1-10
  
  // Techniques Used
  techniquesUsed: text("techniques_used"), // JSON: active_recall, note_taking, summarizing, etc.
  
  // Output
  notesCreated: boolean("notes_created"),
  practiceCompleted: boolean("practice_completed"),
  taughtToSomeone: boolean("taught_to_someone"),
  
  // Retention
  immediateRecall: integer("immediate_recall"), // 1-10 (can you explain it now?)
  
  // Follow-up
  willReview: boolean("will_review"),
  nextReviewDate: timestamp("next_review_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Cognitive Performance Tracking
export const cognitivePerformance = pgTable("cognitive_performance", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  assessmentDate: timestamp("assessment_date").notNull(),
  
  // Daily Cognitive Metrics
  mentalClarity: integer("mental_clarity"), // 1-10
  focusAbility: integer("focus_ability"), // 1-10
  memorySharpness: integer("memory_sharpness"), // 1-10
  processingSpeed: integer("processing_speed"), // 1-10 (how quickly can you think?)
  decisionQuality: integer("decision_quality"), // 1-10
  creativity: integer("creativity"), // 1-10
  
  // Brain Fog
  brainFog: integer("brain_fog"), // 1-10 (higher = worse)
  mentalFatigue: integer("mental_fatigue"), // 1-10
  
  // Contributing Factors
  sleepQuality: integer("sleep_quality"), // 1-10
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
  exerciseToday: boolean("exercise_today"),
  stressLevel: integer("stress_level"), // 1-10
  hydration: pgEnum("hydration", ["poor", "moderate", "good"]),
  nutrition: pgEnum("nutrition", ["poor", "moderate", "good"]),
  
  // Substances
  caffeineIntake: integer("caffeine_intake"), // mg
  alcoholYesterday: boolean("alcohol_yesterday"),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Brain Training Exercises
export const brainTrainingExercises = pgTable("brain_training_exercises", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  exerciseDate: timestamp("exercise_date").notNull(),
  
  // Exercise Type
  exerciseType: pgEnum("exercise_type", [
    "working_memory", // N-back tasks
    "attention", // Focus exercises
    "processing_speed", // Reaction time
    "cognitive_flexibility", // Task switching
    "problem_solving", // Puzzles
    "pattern_recognition",
    "spatial_reasoning",
    "verbal_fluency"
  ]),
  
  exerciseName: varchar("exercise_name", { length: 255 }),
  
  // Performance
  score: integer("score"),
  accuracy: integer("accuracy"), // 0-100%
  speed: integer("speed"), // milliseconds or custom metric
  
  // Difficulty
  difficultyLevel: integer("difficulty_level"), // 1-10
  
  // Duration
  duration: integer("duration"), // minutes
  
  // Progress
  personalBest: boolean("personal_best"),
  improvementFromLast: integer("improvement_from_last"), // percentage
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Reading & Information Consumption
export const readingSessions = pgTable("reading_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionDate: timestamp("session_date").notNull(),
  
  // What You Read
  contentType: pgEnum("content_type", ["book", "article", "research_paper", "documentation", "news"]),
  title: varchar("title", { length: 255 }),
  author: varchar("author", { length: 255 }),
  
  // Reading Details
  pagesRead: integer("pages_read"),
  duration: integer("duration"), // minutes
  
  // Reading Speed
  wordsPerMinute: integer("words_per_minute"),
  
  // Comprehension
  comprehensionLevel: integer("comprehension_level"), // 1-10
  retentionLevel: integer("retention_level"), // 1-10 (how much will you remember?)
  
  // Techniques Used
  activeReading: boolean("active_reading"), // Highlighting, notes, questions
  speedReading: boolean("speed_reading"),
  skimming: boolean("skimming"),
  
  // Output
  notesTaken: boolean("notes_taken"),
  summaryWritten: boolean("summary_written"),
  
  // Value
  valueRating: integer("value_rating"), // 1-10 (how valuable was this?)
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Mental Breaks & Recovery
export const mentalBreaks = pgTable("mental_breaks", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  breakDate: timestamp("break_date").notNull(),
  
  // Break Type
  breakType: pgEnum("break_type", [
    "micro_break", // 1-5 min
    "short_break", // 5-15 min
    "long_break", // 15-30 min
    "walk_break",
    "meditation_break",
    "nap", // Power nap
    "nature_break",
    "social_break"
  ]),
  
  duration: integer("duration"), // minutes
  
  // Activity
  activity: varchar("activity", { length: 255 }),
  
  // State Before/After
  mentalFatigueBefore: integer("mental_fatigue_before"), // 1-10
  mentalFatigueAfter: integer("mental_fatigue_after"), // 1-10
  
  // Effectiveness
  restorationLevel: integer("restoration_level"), // 1-10 (how restored do you feel?)
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Mental Engine Self-Learning Analytics
export const mentalEngineAnalytics = pgTable("mental_engine_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Focus Patterns (aggregated)
  techniqueType: varchar("technique_type", { length: 100 }).notNull(),
  
  // Effectiveness Metrics
  avgFocusImprovement: decimal("avg_focus_improvement", { precision: 5, scale: 2 }),
  avgProductivityScore: decimal("avg_productivity_score", { precision: 5, scale: 2 }),
  avgFlowStateRate: decimal("avg_flow_state_rate", { precision: 5, scale: 2 }), // % of sessions achieving flow
  
  // Optimal Parameters
  optimalDuration: integer("optimal_duration"), // minutes
  optimalTimeOfDay: varchar("optimal_time_of_day", { length: 50 }),
  optimalBreakFrequency: integer("optimal_break_frequency"), // minutes between breaks
  
  // User Segments
  mostEffectiveFor: text("most_effective_for"), // JSON: different user types
  
  // Sample Size
  sessionCount: integer("session_count"),
  userCount: integer("user_count"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
