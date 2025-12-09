/**
 * MEMORY MASTERY ENGINE
 * Evidence-based approach using Memory Science, Neuroscience, Learning Theory, and Cognitive Psychology
 * Research sources: Barbara Oakley (learning science), Hermann Ebbinghaus (spaced repetition), 
 * Joshua Foer (memory palace), Piotr Wozniak (SuperMemo/spaced repetition algorithms),
 * Matthew Walker (sleep & memory consolidation), John Medina (Brain Rules),
 * Harry Lorayne (name-face association, link system, phonetic number system)
 * 
 * CORE MEMORY TECHNIQUES:
 * 1. Spaced Repetition (Ebbinghaus Forgetting Curve)
 * 2. Active Recall (retrieval practice)
 * 3. Memory Palace / Method of Loci
 * 4. Chunking (Miller's 7±2)
 * 5. Elaborative Encoding (connecting to existing knowledge)
 * 6. Dual Coding (verbal + visual)
 * 7. Interleaving (mixing topics)
 * 8. Sleep-Based Consolidation
 * 9. Mnemonics & Acronyms
 * 10. Storytelling & Narrative
 * 11. Name-Face Association (Harry Lorayne)
 * 12. Link System (absurd imagery)
 * 13. Phonetic Number System (Major System)
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Tracks which techniques work best for each user
 * - Optimizes review timing based on individual forgetting curves
 * - Identifies optimal study/review times based on retention data
 * - Learns which content types benefit from which techniques
 */

import { boolean, decimal, int, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Memory Mastery Profiles
export const memoryMasteryProfiles = pgTable("memory_mastery_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Current Memory Assessment
  selfAssessedMemory: integer("self_assessed_memory"), // 1-10
  
  // Goals
  primaryGoal: pgEnum("primary_goal", [
    "improve_retention",
    "learn_faster",
    "remember_names",
    "study_efficiency",
    "professional_knowledge",
    "language_learning",
    "prevent_decline",
    "peak_performance"
  ]).notNull(),
  
  // Preferred Techniques
  preferredTechniques: text("preferred_techniques"), // JSON array
  
  // Learning Style
  learningStyle: pgEnum("learning_style", ["visual", "auditory", "kinesthetic", "reading_writing", "mixed"]),
  
  // Practice Schedule
  dailyReviewTime: varchar("daily_review_time", { length: 10 }), // HH:MM
  weeklyGoalMinutes: integer("weekly_goal_minutes"),
  
  // Self-Learning Data
  optimalReviewTime: varchar("optimal_review_time", { length: 100 }), // When retention is highest
  personalForgettingCurve: text("personal_forgetting_curve"), // JSON: decay rate over time
  mostEffectiveTechniques: text("most_effective_techniques"), // JSON: ranked by retention
  optimalReviewIntervals: text("optimal_review_intervals"), // JSON: personalized spaced repetition schedule
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Memory Items (Things to Remember)
export const memoryItems = pgTable("memory_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Content
  itemType: pgEnum("item_type", [
    "fact",
    "concept",
    "name_face",
    "vocabulary", // Foreign language
    "number",
    "date",
    "formula",
    "procedure", // How to do something
    "quote",
    "list",
    "other"
  ]).notNull(),
  
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"), // What to remember
  
  // Context
  category: varchar("category", { length: 255 }), // Work, personal, study, etc.
  tags: text("tags"), // JSON array
  
  // Encoding Technique Used
  encodingTechnique: pgEnum("encoding_technique", [
    "rote_repetition",
    "spaced_repetition",
    "memory_palace",
    "chunking",
    "elaboration", // Connect to existing knowledge
    "dual_coding", // Visual + verbal
    "mnemonic",
    "story",
    "acronym",
    "rhyme",
    "visualization"
  ]),
  
  // Memory Palace Location (if using method of loci)
  palaceLocation: varchar("palace_location", { length: 255 }),
  
  // Visual/Mnemonic
  visualImage: text("visual_image"), // Description of mental image
  mnemonicDevice: text("mnemonic_device"),
  
  // Connections
  relatedItems: text("related_items"), // JSON: IDs of related memory items
  existingKnowledge: text("existing_knowledge"), // What you already know that this connects to
  
  // Importance
  importance: integer("importance"), // 1-10
  
  // Spaced Repetition Data
  easeFactor: decimal("ease_factor", { precision: 4, scale: 2 }).default("2.5"), // SuperMemo algorithm
  interval: integer("interval").default(1), // Days until next review
  repetitions: integer("repetitions").default(0),
  nextReviewDate: timestamp("next_review_date"),
  
  // Performance
  totalReviews: integer("total_reviews").default(0),
  successfulRecalls: integer("successful_recalls").default(0),
  retentionRate: decimal("retention_rate", { precision: 5, scale: 2 }), // %
  
  // Status
  mastered: boolean("mastered").default(false),
  masteredDate: timestamp("mastered_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Memory Reviews (Spaced Repetition Sessions)
export const memoryReviews = pgTable("memory_reviews", {
  id: varchar("id", { length: 255 }).primaryKey(),
  itemId: varchar("item_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  reviewDate: timestamp("review_date").notNull(),
  
  // Review Type
  reviewType: pgEnum("review_type", [
    "scheduled", // Spaced repetition
    "cramming", // Last-minute review
    "reinforcement", // Extra practice
    "test" // Self-testing
  ]).notNull(),
  
  // Performance
  recalled: boolean("recalled").notNull(), // Did you remember it?
  recallSpeed: pgEnum("recall_speed", ["instant", "quick", "slow", "failed"]),
  confidence: integer("confidence"), // 1-10: How confident in your recall?
  
  // Difficulty Rating (for spaced repetition algorithm)
  difficultyRating: pgEnum("difficulty_rating", [
    "again", // Didn't remember (0)
    "hard", // Remembered with difficulty (3)
    "good", // Remembered (4)
    "easy" // Remembered easily (5)
  ]).notNull(),
  
  // Time
  timeToRecall: integer("time_to_recall"), // seconds
  
  // Context
  reviewContext: varchar("review_context", { length: 255 }), // Where/when reviewed
  distractions: boolean("distractions"),
  
  // Next Review Scheduled
  nextInterval: integer("next_interval"), // days
  nextReviewDate: timestamp("next_review_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Memory Palaces (Method of Loci)
export const memoryPalaces = pgTable("memory_palaces", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  palaceName: varchar("palace_name", { length: 255 }).notNull(),
  description: text("description"), // What place is this? (your home, a route, etc.)
  
  // Locations within palace
  locations: text("locations"), // JSON array: ordered list of locations
  
  // Usage
  purpose: varchar("purpose", { length: 255 }), // What is this palace for?
  
  // Items Stored
  itemCount: integer("item_count").default(0),
  
  // Effectiveness
  avgRecallRate: decimal("avg_recall_rate", { precision: 5, scale: 2 }),
  
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Learning Sessions (Study Sessions)
export const learningSessions = pgTable("learning_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionDate: timestamp("session_date").notNull(),
  
  // Session Details
  topic: varchar("topic", { length: 255 }).notNull(),
  sessionType: pgEnum("session_type", [
    "new_learning", // Learning new material
    "review", // Reviewing old material
    "practice", // Active practice
    "testing" // Self-testing
  ]).notNull(),
  
  // Duration
  duration: integer("duration"), // minutes
  
  // Techniques Used
  techniquesUsed: text("techniques_used"), // JSON array
  
  // Materials
  materialsStudied: text("materials_studied"), // JSON array
  newItemsCreated: integer("new_items_created"),
  itemsReviewed: integer("items_reviewed"),
  
  // Performance
  focusLevel: integer("focus_level"), // 1-10
  comprehensionLevel: integer("comprehension_level"), // 1-10
  retentionConfidence: integer("retention_confidence"), // 1-10
  
  // Environment
  location: varchar("location", { length: 255 }),
  distractions: text("distractions"), // JSON array
  
  // State
  energyBefore: integer("energy_before"), // 1-10
  energyAfter: integer("energy_after"), // 1-10
  
  // Notes
  notes: text("notes"),
  insights: text("insights"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Memory Techniques Practice
export const memoryTechniquePractice = pgTable("memory_technique_practice", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // Technique
  technique: pgEnum("technique", [
    "memory_palace",
    "chunking",
    "peg_system",
    "major_system", // Number memory
    "link_method", // Linking items in a story
    "acronym",
    "visualization",
    "dual_coding",
    "elaboration",
    "active_recall"
  ]).notNull(),
  
  // Practice Details
  practiceType: varchar("practice_type", { length: 255 }), // What were you practicing?
  duration: integer("duration"), // minutes
  
  // Performance
  itemsAttempted: integer("items_attempted"),
  itemsRecalled: integer("items_recalled"),
  accuracyRate: decimal("accuracy_rate", { precision: 5, scale: 2 }), // %
  
  // Difficulty
  difficulty: integer("difficulty"), // 1-10
  
  // Improvement
  improvementFromLast: decimal("improvement_from_last", { precision: 6, scale: 2 }), // % change
  
  // Notes
  notes: text("notes"),
  challengesFaced: text("challenges_faced"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Memory Challenges (Gamification)
export const memoryChallenges = pgTable("memory_challenges", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  challengeName: varchar("challenge_name", { length: 255 }).notNull(),
  
  // Challenge Type
  challengeType: pgEnum("challenge_type", [
    "number_memorization", // Memorize long numbers
    "name_recall", // Remember names
    "card_memorization", // Deck of cards
    "word_list", // List of words
    "dates_events", // Historical dates
    "vocabulary", // Foreign language
    "custom"
  ]).notNull(),
  
  // Challenge Details
  itemCount: integer("item_count"), // How many items to memorize
  timeLimit: integer("time_limit"), // seconds
  
  // Performance
  itemsRecalled: integer("items_recalled"),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }), // %
  timeUsed: integer("time_used"), // seconds
  
  // Score
  score: integer("score"),
  personalBest: boolean("personal_best"),
  
  attemptDate: timestamp("attempt_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Memory Milestones
export const memoryMilestones = pgTable("memory_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  milestoneType: pgEnum("milestone_type", [
    "items_mastered", // Mastered X items
    "retention_rate", // Achieved X% retention
    "streak", // X day streak
    "technique_mastered", // Mastered a technique
    "challenge_completed", // Completed a challenge
    "palace_created", // Built a memory palace
    "personal_record"
  ]).notNull(),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  achievedDate: timestamp("achieved_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Sleep & Memory Consolidation Tracking
export const sleepMemoryTracking = pgTable("sleep_memory_tracking", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  trackingDate: timestamp("tracking_date").notNull(),
  
  // Learning Before Sleep
  studiedBeforeSleep: boolean("studied_before_sleep"),
  studyTopics: text("study_topics"), // JSON array
  studyDuration: integer("study_duration"), // minutes
  
  // Sleep Quality
  sleepQuality: integer("sleep_quality"), // 1-10
  sleepDuration: decimal("sleep_duration", { precision: 3, scale: 1 }), // hours
  deepSleepMinutes: integer("deep_sleep_minutes"),
  
  // Morning Recall
  morningRecallTest: boolean("morning_recall_test"),
  morningRecallAccuracy: decimal("morning_recall_accuracy", { precision: 5, scale: 2 }), // %
  
  // Consolidation Effect
  consolidationEffect: decimal("consolidation_effect", { precision: 6, scale: 2 }), // % improvement from sleep
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Memory Mastery Engine Self-Learning Analytics
export const memoryMasteryAnalytics = pgTable("memory_mastery_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Technique Effectiveness (aggregated)
  technique: varchar("technique", { length: 100 }).notNull(),
  itemType: varchar("item_type", { length: 100 }),
  
  // Effectiveness Metrics
  avgRetentionRate: decimal("avg_retention_rate", { precision: 5, scale: 2 }), // %
  avgRecallSpeed: decimal("avg_recall_speed", { precision: 6, scale: 2 }), // seconds
  
  // Optimal Parameters
  optimalReviewInterval: integer("optimal_review_interval"), // days
  optimalSessionDuration: integer("optimal_session_duration"), // minutes
  
  // User Segments
  mostEffectiveFor: text("most_effective_for"), // JSON: different learning styles
  
  // Sample Size
  reviewCount: integer("review_count"),
  userCount: integer("user_count"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Name-Face Memory (Harry Lorayne Method)
export const nameFaceMemory = pgTable("name_face_memory", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Person Details
  personName: varchar("person_name", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  
  // Face Photo
  facePhoto: varchar("face_photo", { length: 255 }),
  
  // Harry Lorayne Technique: Outstanding Feature
  outstandingFeature: text("outstanding_feature"), // Most memorable facial feature
  
  // Harry Lorayne Technique: Name Association
  nameAssociation: text("name_association"), // Mental image/story for the name
  substituteWord: varchar("substitute_word", { length: 255 }), // If name is abstract
  
  // Harry Lorayne Technique: Link Feature to Name
  mentalLink: text("mental_link"), // Absurd image linking feature to name
  
  // Context
  whereMet: varchar("where_met", { length: 255 }),
  whenMet: timestamp("when_met"),
  relationship: varchar("relationship", { length: 255 }), // Colleague, friend, client, etc.
  
  // Additional Info (helps with recall)
  occupation: varchar("occupation", { length: 255 }),
  interests: text("interests"), // JSON array
  mutualConnections: text("mutual_connections"), // JSON array
  conversationTopics: text("conversation_topics"), // What you talked about
  
  // Memory Performance
  totalEncounters: integer("total_encounters").default(1),
  successfulRecalls: integer("successful_recalls").default(0),
  lastEncounter: timestamp("last_encounter"),
  
  // Importance
  importance: integer("importance"), // 1-10
  
  // Status
  mastered: boolean("mastered").default(false), // Can recall instantly
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Name Recall Practice
export const nameRecallPractice = pgTable("name_recall_practice", {
  id: varchar("id", { length: 255 }).primaryKey(),
  nameFaceId: varchar("name_face_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // Practice Type
  practiceType: pgEnum("practice_type", [
    "face_to_name", // See face, recall name
    "name_to_face", // Hear name, visualize face
    "feature_identification", // Identify outstanding feature
    "association_review" // Review mental associations
  ]).notNull(),
  
  // Performance
  recalled: boolean("recalled"),
  recallSpeed: pgEnum("recall_speed", ["instant", "quick", "slow", "failed"]),
  confidence: integer("confidence"), // 1-10
  
  // Time
  timeToRecall: integer("time_to_recall"), // seconds
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Number Memory (Major/Phonetic System)
export const numberMemory = pgTable("number_memory", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Number to Remember
  number: varchar("number", { length: 255 }).notNull(),
  numberType: pgEnum("number_type", [
    "phone",
    "pin",
    "date",
    "address",
    "credit_card",
    "id_number",
    "mathematical_constant",
    "other"
  ]).notNull(),
  
  label: varchar("label", { length: 255 }), // What is this number?
  
  // Harry Lorayne Phonetic System
  phoneticWords: text("phonetic_words"), // Words that encode the number
  visualStory: text("visual_story"), // Story using the phonetic words
  
  // Alternative: Chunking
  chunks: text("chunks"), // JSON array: break into memorable chunks
  
  // Performance
  totalRecalls: integer("total_recalls").default(0),
  successfulRecalls: integer("successful_recalls").default(0),
  
  // Status
  mastered: boolean("mastered").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
