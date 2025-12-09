/**
 * EMOTIONAL ENGINE
 * Evidence-based approach using DBT, ACT, Emotion Regulation Research, and Resilience Science
 * Research sources: Marsha Linehan (DBT), Steven Hayes (ACT), Lisa Feldman Barrett (emotion construction), Susan David (emotional agility)
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Identifies emotional patterns and triggers for each user
 * - Learns which regulation strategies work best per individual
 * - Predicts emotional states based on context
 * - Adapts interventions based on effectiveness
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Emotional Profiles
export const emotionalProfiles = pgTable("emotional_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Baseline Emotional State
  baselineEmotionalState: varchar("baseline_emotional_state", { length: 100 }),
  emotionalRange: varchar("emotional_range", { length: 50 }), // How much do emotions fluctuate?
  emotionalIntensity: varchar("emotional_intensity", { length: 50 }),
  
  // Regulation Ability
  regulationSkillLevel: integer("regulation_skill_level"), // 1-10
  awarenessLevel: integer("awareness_level"), // 1-10 (how aware are you of your emotions?)
  
  // Challenges
  primaryChallenges: text("primary_challenges"), // JSON: overwhelm, numbness, mood_swings, anger, anxiety, etc.
  
  // Goals
  primaryGoal: varchar("primary_goal", { length: 50 }),
  
  // Emotional Patterns (self-learning)
  commonTriggers: text("common_triggers"), // JSON: learned from tracking
  commonEmotions: text("common_emotions"), // JSON: most frequent emotions
  emotionalCycles: text("emotional_cycles"), // JSON: patterns (e.g., anxiety peaks in morning)
  
  // Effective Strategies (self-learning)
  mostEffectiveStrategies: text("most_effective_strategies"), // JSON: what works for this user
  leastEffectiveStrategies: text("least_effective_strategies"), // JSON: what doesn't work
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emotion Tracking (Mood Logging)
export const emotionEntries = pgTable("emotion_entries", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  entryDate: timestamp("entry_date").notNull(),
  
  // Primary Emotion (Lisa Feldman Barrett's emotion categories)
  primaryEmotion: varchar("primary_emotion", { length: 100 }).notNull(), // joy, sadness, anger, fear, disgust, surprise, etc.
  secondaryEmotions: text("secondary_emotions"), // JSON array
  
  // Intensity
  intensity: integer("intensity"), // 1-10
  
  // Valence & Arousal (circumplex model)
  valence: integer("valence"), // -5 to +5 (negative to positive)
  arousal: integer("arousal"), // 1-10 (low energy to high energy)
  
  // Context
  trigger: text("trigger"), // What caused this emotion?
  situation: text("situation"),
  thoughts: text("thoughts"), // What were you thinking?
  
  // Physical Sensations
  physicalSensations: text("physical_sensations"), // JSON: heart racing, tension, warmth, etc.
  
  // Behavior
  urge: text("urge"), // What did you want to do?
  actualBehavior: text("actual_behavior"), // What did you actually do?
  
  // Duration
  durationMinutes: integer("duration_minutes"),
  
  // Regulation Attempted
  regulationUsed: boolean("regulation_used"),
  regulationStrategy: varchar("regulation_strategy", { length: 255 }),
  regulationEffectiveness: integer("regulation_effectiveness"), // 1-10
  
  createdAt: timestamp("created_at").defaultNow(),
});

// DBT Skills Practice
export const dbtSkillsPractice = pgTable("dbt_skills_practice", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // DBT Module
  dbtModule: varchar("dbt_module", { length: 50 }),
  
  // Specific Skill
  skillUsed: varchar("skill_used", { length: 50 }).notNull(),
  
  // Context
  situation: text("situation"),
  emotionBefore: varchar("emotion_before", { length: 100 }),
  intensityBefore: integer("intensity_before"), // 1-10
  
  // Practice
  howUsed: text("how_used"),
  
  // Outcome
  emotionAfter: varchar("emotion_after", { length: 100 }),
  intensityAfter: integer("intensity_after"), // 1-10
  
  // Effectiveness
  effectiveness: integer("effectiveness"), // 1-10
  wouldUseAgain: boolean("would_use_again"),
  
  // Challenges
  challenges: text("challenges"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// ACT (Acceptance & Commitment Therapy) Practices
export const actPractices = pgTable("act_practices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // ACT Process
  actProcess: varchar("act_process", { length: 50 }),
  
  // Specific Technique
  technique: varchar("technique", { length: 255 }),
  
  // Practice
  situation: text("situation"),
  difficultThought: text("difficult_thought"),
  difficultEmotion: varchar("difficult_emotion", { length: 100 }),
  
  // ACT Response
  acceptanceLevel: integer("acceptance_level"), // 1-10 (how much did you accept vs. struggle?)
  defusionLevel: integer("defusion_level"), // 1-10 (how much did you separate from the thought?)
  
  // Values Alignment
  valueIdentified: varchar("value_identified", { length: 255 }),
  actionTaken: text("action_taken"), // Values-based action
  
  // Outcome
  psychologicalFlexibility: integer("psychological_flexibility"), // 1-10 (how flexible were you?)
  effectiveness: integer("effectiveness"), // 1-10
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Emotion Regulation Strategies
export const emotionRegulationStrategies = pgTable("emotion_regulation_strategies", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  useDate: timestamp("use_date").notNull(),
  
  // Strategy Type (evidence-based)
  strategyType: varchar("strategy_type", { length: 50 }).notNull(),
  
  // Context
  emotion: varchar("emotion", { length: 100 }).notNull(),
  intensityBefore: integer("intensity_before"), // 1-10
  trigger: text("trigger"),
  
  // Strategy Application
  whatYouDid: text("what_you_did"),
  duration: integer("duration"), // minutes
  
  // Outcome
  intensityAfter: integer("intensity_after"), // 1-10
  emotionChanged: boolean("emotion_changed"),
  newEmotion: varchar("new_emotion", { length: 100 }),
  
  // Effectiveness
  immediateEffectiveness: integer("immediate_effectiveness"), // 1-10
  longTermHelpful: boolean("long_term_helpful"), // Did this actually help or just avoid?
  
  // Side Effects
  sideEffects: text("side_effects"), // Any negative consequences?
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Resilience Building Activities
export const resilienceActivities = pgTable("resilience_activities", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  activityDate: timestamp("activity_date").notNull(),
  
  // Activity Type (evidence-based resilience factors)
  activityType: varchar("activity_type", { length: 50 }),
  
  activity: varchar("activity", { length: 255 }).notNull(),
  description: text("description"),
  
  duration: integer("duration"), // minutes
  
  // Impact
  resilienceImpact: integer("resilience_impact"), // 1-10
  emotionalImpact: integer("emotional_impact"), // 1-10
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Emotional Processing (for difficult emotions)
export const emotionalProcessing = pgTable("emotional_processing", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  processingDate: timestamp("processing_date").notNull(),
  
  // What You're Processing
  emotionToProcess: varchar("emotion_to_process", { length: 100 }).notNull(),
  relatedEvent: text("related_event"),
  
  // Processing Method
  processingMethod: varchar("processing_method", { length: 50 }),
  
  // Process
  whatCameUp: text("what_came_up"), // Insights, memories, realizations
  physicalSensations: text("physical_sensations"),
  
  // Depth
  processingDepth: varchar("processing_depth", { length: 50 }),
  
  // Outcome
  feelingAfter: varchar("feeling_after", { length: 100 }),
  resolutionLevel: integer("resolution_level"), // 1-10 (how resolved does this feel?)
  
  // Integration
  insights: text("insights"),
  actionSteps: text("action_steps"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Emotional Wins & Breakthroughs
export const emotionalWins = pgTable("emotional_wins", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  winDate: timestamp("win_date").notNull(),
  
  winType: varchar("win_type", { length: 50 }),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Significance
  significance: text("significance"),
  howYouGrew: text("how_you_grew"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Emotional Engine Self-Learning Analytics
export const emotionalEngineAnalytics = pgTable("emotional_engine_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Strategy Effectiveness (aggregated)
  strategyType: varchar("strategy_type", { length: 100 }).notNull(),
  emotionType: varchar("emotion_type", { length: 100 }).notNull(),
  
  // Effectiveness Metrics
  avgIntensityReduction: decimal("avg_intensity_reduction", { precision: 5, scale: 2 }),
  avgEffectivenessRating: decimal("avg_effectiveness_rating", { precision: 5, scale: 2 }),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }), // % of times it helped
  
  // Optimal Parameters
  optimalDuration: integer("optimal_duration"), // minutes
  
  // User Segments
  mostEffectiveFor: text("most_effective_for"), // JSON: different emotional profiles
  
  // Sample Size
  useCount: integer("use_count"),
  userCount: integer("user_count"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
