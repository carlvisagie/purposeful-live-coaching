/**
 * STRESS TRACKING & MANAGEMENT SYSTEM
 * Evidence-based approach using Psychophysiology, Neuroscience, and Stress Research
 * Research sources: Robert Sapolsky (stress biology), Andrew Huberman (stress protocols),
 * HeartMath Institute (HRV & coherence), Jon Kabat-Zinn (MBSR), Kelly McGonigal (stress mindset),
 * Peter Levine (somatic experiencing), Bessel van der Kolk (body keeps the score)
 * 
 * CORE PRINCIPLES:
 * 1. Stress is NOT the enemy (eustress vs distress)
 * 2. HRV is the gold standard biomarker
 * 3. Perception matters (stress mindset research)
 * 4. Recovery is as important as stress
 * 5. Chronic stress kills (cortisol dysregulation)
 * 6. Somatic awareness (body-based stress release)
 * 
 * TRACKING METHODS:
 * - Subjective stress ratings (perceived stress)
 * - HRV measurements (objective stress)
 * - Cortisol patterns (morning/evening)
 * - Stress triggers & contexts
 * - Physical symptoms (tension, headaches, etc.)
 * - Behavioral indicators (sleep, appetite, irritability)
 * 
 * INTERVENTIONS:
 * - Physiological sigh (Huberman protocol)
 * - Box breathing (4-4-4-4)
 * - HRV coherence training (HeartMath)
 * - Progressive muscle relaxation
 * - NSDR (Non-Sleep Deep Rest)
 * - Cold exposure (hormetic stress)
 * - Exercise (stress inoculation)
 * - Social connection (stress buffer)
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Identifies personal stress triggers
 * - Predicts stress spikes before they happen
 * - Learns which interventions work best for you
 * - Optimizes recovery protocols
 */

import { boolean, decimal, int, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Stress Profiles
export const stressProfiles = pgTable("stress_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Baseline Metrics
  baselineStressLevel: integer("baseline_stress_level"), // 1-10
  baselineHRV: decimal("baseline_hrv", { precision: 6, scale: 2 }), // milliseconds
  baselineRestingHR: integer("baseline_resting_hr"), // bpm
  
  // Stress Resilience
  stressResilienceScore: integer("stress_resilience_score"), // 0-100
  recoveryCapacity: integer("recovery_capacity"), // 0-100 (how quickly you bounce back)
  
  // Stress Mindset (Kelly McGonigal research)
  stressMindset: pgEnum("stress_mindset", [
    "stress_is_harmful", // Sees stress as purely negative
    "stress_is_enhancing", // Sees stress as growth opportunity
    "mixed"
  ]),
  
  // Dominant Stress Response
  dominantResponse: pgEnum("dominant_response", [
    "fight", // Anger, aggression
    "flight", // Avoidance, escape
    "freeze", // Shutdown, dissociation
    "fawn" // People-pleasing, appeasement
  ]),
  
  // Common Triggers
  commonTriggers: text("common_triggers"), // JSON array
  
  // Physical Symptoms
  commonSymptoms: text("common_symptoms"), // JSON: tension, headaches, etc.
  
  // Preferred Interventions
  preferredInterventions: text("preferred_interventions"), // JSON: what works for this user
  
  // Self-Learning Data
  stressPatterns: text("stress_patterns"), // JSON: when/why stress occurs
  optimalRecoveryTime: integer("optimal_recovery_time"), // minutes
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Stress Logs
export const dailyStressLogs = pgTable("daily_stress_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  logDate: timestamp("log_date").notNull(),
  
  // Subjective Ratings
  avgStressLevel: integer("avg_stress_level"), // 1-10
  peakStressLevel: integer("peak_stress_level"), // 1-10
  
  // HRV Data (if available)
  morningHRV: decimal("morning_hrv", { precision: 6, scale: 2 }),
  avgHRV: decimal("avg_hrv", { precision: 6, scale: 2 }),
  hrvTrend: pgEnum("hrv_trend", ["improving", "stable", "declining"]),
  
  // Heart Rate
  avgRestingHR: integer("avg_resting_hr"),
  peakHR: integer("peak_hr"),
  
  // Cortisol Pattern (subjective or measured)
  morningCortisol: pgEnum("morning_cortisol", ["low", "normal", "high"]),
  eveningCortisol: pgEnum("evening_cortisol", ["low", "normal", "high"]),
  cortisolRhythm: pgEnum("cortisol_rhythm", ["healthy", "disrupted"]),
  
  // Physical Symptoms
  symptoms: text("symptoms"), // JSON: headache, tension, etc.
  symptomSeverity: integer("symptom_severity"), // 1-10
  
  // Sleep Impact
  sleepQuality: integer("sleep_quality"), // 1-10
  sleepDuration: decimal("sleep_duration", { precision: 4, scale: 2 }),
  
  // Behavioral Indicators
  irritability: integer("irritability"), // 1-10
  concentration: integer("concentration"), // 1-10
  appetite: pgEnum("appetite", ["low", "normal", "high", "stress_eating"]),
  
  // Interventions Used
  interventionsUsed: text("interventions_used"), // JSON array
  interventionEffectiveness: integer("intervention_effectiveness"), // 1-10
  
  // Recovery
  recoveryQuality: integer("recovery_quality"), // 1-10
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Stress Events (Real-Time Tracking)
export const stressEvents = pgTable("stress_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Event Details
  stressLevel: integer("stress_level").notNull(), // 1-10
  eventTimestamp: timestamp("event_timestamp").notNull(),
  
  // Trigger
  trigger: varchar("trigger", { length: 255 }), // What caused this?
  triggerCategory: pgEnum("trigger_category", [
    "work",
    "relationships",
    "financial",
    "health",
    "family",
    "traffic",
    "technology",
    "uncertainty",
    "time_pressure",
    "conflict",
    "other"
  ]),
  
  // Context
  location: varchar("location", { length: 255 }),
  activity: varchar("activity", { length: 255 }),
  socialContext: pgEnum("social_context", ["alone", "with_others", "crowd"]),
  
  // Physical Response
  heartRate: integer("heart_rate"), // if measured
  physicalSymptoms: text("physical_symptoms"), // JSON
  
  // Emotional Response
  primaryEmotion: pgEnum("primary_emotion", [
    "anxiety",
    "anger",
    "frustration",
    "overwhelm",
    "fear",
    "sadness",
    "irritation"
  ]),
  
  // Cognitive Response
  thoughts: text("thoughts"), // What were you thinking?
  cognitiveDistortions: text("cognitive_distortions"), // JSON: catastrophizing, etc.
  
  // Response Type
  responseType: pgEnum("response_type", ["fight", "flight", "freeze", "fawn"]),
  
  // Intervention Taken
  interventionUsed: varchar("intervention_used", { length: 255 }),
  interventionEffective: boolean("intervention_effective"),
  
  // Recovery
  recoveryTime: integer("recovery_time"), // minutes until stress subsided
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Stress Triggers
export const stressTriggers = pgTable("stress_triggers", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Trigger Details
  triggerName: varchar("trigger_name", { length: 255 }).notNull(),
  triggerCategory: varchar("trigger_category", { length: 100 }),
  
  // Frequency
  occurrenceCount: integer("occurrence_count").default(0),
  lastOccurrence: timestamp("last_occurrence"),
  
  // Impact
  avgStressLevel: decimal("avg_stress_level", { precision: 4, scale: 2 }), // 1-10
  avgRecoveryTime: integer("avg_recovery_time"), // minutes
  
  // Patterns
  timePatterns: text("time_patterns"), // JSON: when does this trigger occur?
  contextPatterns: text("context_patterns"), // JSON: where/with whom?
  
  // Avoidability
  avoidable: boolean("avoidable"),
  
  // Coping Strategies
  effectiveStrategies: text("effective_strategies"), // JSON: what works for this trigger
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stress Interventions Library
export const stressInterventions = pgTable("stress_interventions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Intervention Details
  interventionName: varchar("intervention_name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Category
  category: pgEnum("category", [
    "breathing", // Physiological sigh, box breathing, etc.
    "movement", // Exercise, stretching, shaking
    "mindfulness", // Meditation, body scan
    "cognitive", // Reframing, CBT techniques
    "social", // Talk to friend, hug
    "sensory", // Cold water, music, nature
    "rest", // NSDR, nap, relaxation
    "creative", // Art, journaling, music
    "other"
  ]),
  
  // Evidence Base
  researchBacked: boolean("research_backed").default(false),
  researchSources: text("research_sources"), // JSON: citations
  
  // Duration
  durationMinutes: integer("duration_minutes"),
  
  // Instructions
  instructions: text("instructions"),
  
  // When to Use
  bestFor: text("best_for"), // JSON: which stress types/levels
  
  // Effectiveness
  avgEffectivenessRating: decimal("avg_effectiveness_rating", { precision: 4, scale: 2 }), // 1-10
  totalUses: integer("total_uses").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Intervention Logs
export const userInterventionLogs = pgTable("user_intervention_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  interventionId: varchar("intervention_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Context
  stressEventId: varchar("stress_event_id", { length: 255 }), // Which stress event triggered this?
  stressLevelBefore: integer("stress_level_before"), // 1-10
  
  // Execution
  durationMinutes: integer("duration_minutes"),
  completedFully: boolean("completed_fully").default(true),
  
  // Outcome
  stressLevelAfter: integer("stress_level_after"), // 1-10
  effectivenessRating: integer("effectiveness_rating"), // 1-10
  
  // Side Effects
  sideEffects: text("side_effects"), // Any negative effects?
  
  // Notes
  notes: text("notes"),
  
  usedAt: timestamp("used_at").defaultNow(),
});

// HRV Measurements
export const hrvMeasurements = pgTable("hrv_measurements", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Measurement Details
  measurementTime: timestamp("measurement_time").notNull(),
  measurementType: pgEnum("measurement_type", ["morning", "pre_workout", "post_workout", "evening", "random"]),
  
  // HRV Metrics
  rmssd: decimal("rmssd", { precision: 6, scale: 2 }), // Root Mean Square of Successive Differences (gold standard)
  sdnn: decimal("sdnn", { precision: 6, scale: 2 }), // Standard Deviation of NN intervals
  pnn50: decimal("pnn50", { precision: 5, scale: 2 }), // % of successive intervals >50ms
  
  // Heart Rate
  avgHeartRate: integer("avg_heart_rate"),
  
  // Interpretation
  hrvScore: integer("hrv_score"), // 0-100 (normalized for age/sex)
  recoveryStatus: pgEnum("recovery_status", ["recovered", "recovering", "not_recovered"]),
  
  // Context
  sleepQualityPriorNight: integer("sleep_quality_prior_night"), // 1-10
  stressLevelPriorDay: integer("stress_level_prior_day"), // 1-10
  exerciseIntensityPriorDay: pgEnum("exercise_intensity_prior_day", ["none", "light", "moderate", "intense"]),
  
  // Device
  measurementDevice: varchar("measurement_device", { length: 100 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Stress Recovery Sessions
export const stressRecoverySessions = pgTable("stress_recovery_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Session Details
  sessionType: pgEnum("session_type", [
    "nsdr", // Non-Sleep Deep Rest
    "yoga_nidra",
    "progressive_relaxation",
    "meditation",
    "breathwork",
    "cold_exposure",
    "sauna",
    "massage",
    "nature_walk",
    "creative_activity"
  ]),
  
  // Duration
  durationMinutes: integer("duration_minutes"),
  
  // Pre-Session
  stressLevelBefore: integer("stress_level_before"), // 1-10
  hrvBefore: decimal("hrv_before", { precision: 6, scale: 2 }),
  
  // Post-Session
  stressLevelAfter: integer("stress_level_after"), // 1-10
  hrvAfter: decimal("hrv_after", { precision: 6, scale: 2 }),
  
  // Effectiveness
  recoveryScore: integer("recovery_score"), // 0-100
  
  // Notes
  notes: text("notes"),
  
  sessionDate: timestamp("session_date").defaultNow(),
});

// Stress Predictions (AI-Powered)
export const stressPredictions = pgTable("stress_predictions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Prediction Type
  predictionType: pgEnum("prediction_type", [
    "stress_spike_risk", // You're likely to experience high stress soon
    "burnout_risk", // You're at risk of burnout
    "recovery_needed", // You need recovery time
    "optimal_intervention" // This intervention will work best
  ]),
  
  // Prediction
  prediction: text("prediction"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // %
  
  // Timeframe
  timeframe: varchar("timeframe", { length: 100 }), // "in next 24 hours", "this week"
  
  // Contributing Factors
  factors: text("factors"), // JSON: sleep debt, HRV trend, upcoming events, etc.
  
  // Recommendation
  recommendation: text("recommendation"),
  
  // Validation
  actualOutcome: text("actual_outcome"),
  predictionAccurate: boolean("prediction_accurate"),
  
  createdAt: timestamp("created_at").defaultNow(),
  validatedAt: timestamp("validated_at"),
});

// Stress Analytics (Self-Learning)
export const stressAnalytics = pgTable("stress_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Intervention Type
  interventionType: varchar("intervention_type", { length: 100 }).notNull(),
  
  // Effectiveness Metrics
  avgStressReduction: decimal("avg_stress_reduction", { precision: 5, scale: 2 }), // % reduction
  avgEffectivenessRating: decimal("avg_effectiveness_rating", { precision: 4, scale: 2 }), // 1-10
  successRate: decimal("success_rate", { precision: 5, scale: 2 }), // % of times it worked
  
  // Optimal Parameters
  optimalDuration: integer("optimal_duration"), // minutes
  optimalTiming: varchar("optimal_timing", { length: 100 }), // when to use
  
  // Best For
  mostEffectiveForStressType: text("most_effective_for_stress_type"), // JSON
  mostEffectiveForUserType: text("most_effective_for_user_type"), // JSON
  
  // Sample Size
  userCount: integer("user_count"),
  totalUses: integer("total_uses"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
