/**
 * PHYSICAL / EXERCISE ENGINE
 * Evidence-based approach using Exercise Science, Biomechanics, Recovery Science, and Movement Research
 * Research sources: Andrew Huberman (exercise neuroscience), Peter Attia (longevity), Kelly Starrett (mobility), Pavel Tsatsouline (strength)
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Tracks exercise response and recovery patterns
 * - Learns optimal training frequency/volume for each user
 * - Identifies injury risk patterns
 * - Adapts programming based on progress and recovery
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Physical Profiles
export const physicalProfiles = pgTable("physical_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Current State
  fitnessLevel: varchar("fitness_level", { length: 50 }),
  
  // Measurements
  height: integer("height"), // cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // kg
  bodyFatPercentage: decimal("body_fat_percentage", { precision: 4, scale: 1 }),
  
  // Goals
  primaryGoal: varchar("primary_goal", { length: 50 }),
  
  specificGoals: text("specific_goals"), // JSON array
  
  // Limitations
  injuries: text("injuries"), // JSON array: current injuries
  injuryHistory: text("injury_history"), // JSON array: past injuries
  limitations: text("limitations"), // JSON: mobility restrictions, pain, etc.
  
  // Experience
  experienceLevel: text("experience_level"), // JSON: {strength_training: "intermediate", cardio: "advanced", etc.}
  
  // Preferences
  preferredExerciseTypes: text("preferred_exercise_types"), // JSON array
  availableEquipment: text("available_equipment"), // JSON array
  timeAvailable: integer("time_available"), // minutes per session
  
  // Self-Learning Data
  optimalTrainingFrequency: integer("optimal_training_frequency"), // days per week
  optimalSessionDuration: integer("optimal_session_duration"), // minutes
  bestRecoveryStrategies: text("best_recovery_strategies"), // JSON
  injuryRiskFactors: text("injury_risk_factors"), // JSON: patterns that lead to injury
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workouts
export const workouts = pgTable("workouts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  workoutDate: timestamp("workout_date").notNull(),
  
  // Workout Type
  workoutType: varchar("workout_type", { length: 50 }),
  
  // Focus
  primaryFocus: varchar("primary_focus", { length: 50 }),
  
  // Duration & Intensity
  duration: integer("duration"), // minutes
  intensity: varchar("intensity", { length: 50 }),
  perceivedExertion: integer("perceived_exertion"), // 1-10 (RPE)
  
  // State Before
  energyBefore: integer("energy_before"), // 1-10
  sorenessBefore: integer("soreness_before"), // 1-10
  motivationBefore: integer("motivation_before"), // 1-10
  
  // Performance
  performanceRating: integer("performance_rating"), // 1-10
  personalRecords: text("personal_records"), // JSON: any PRs achieved
  
  // State After
  energyAfter: integer("energy_after"), // 1-10
  sorenessAfter: integer("soreness_after"), // 1-10
  satisfactionLevel: integer("satisfaction_level"), // 1-10
  
  // Environment
  location: varchar("location", { length: 255 }),
  temperature: integer("temperature"), // celsius
  
  // Notes
  notes: text("notes"),
  
  // Completion
  completed: boolean("completed").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Exercises (within workouts)
export const exercises = pgTable("exercises", {
  id: varchar("id", { length: 255 }).primaryKey(),
  workoutId: varchar("workout_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Exercise Details
  exerciseName: varchar("exercise_name", { length: 255 }).notNull(),
  exerciseType: varchar("exercise_type", { length: 50 }),
  
  muscleGroup: varchar("muscle_group", { length: 255 }), // Primary muscle worked
  
  // Sets & Reps
  sets: integer("sets"),
  reps: text("reps"), // JSON array (can vary per set)
  weight: text("weight"), // JSON array (kg per set)
  
  // Rest
  restBetweenSets: integer("rest_between_sets"), // seconds
  
  // Tempo (if tracked)
  tempo: varchar("tempo", { length: 50 }), // e.g., "3-1-2-0" (eccentric-pause-concentric-pause)
  
  // Range of Motion
  rangeOfMotion: varchar("range_of_motion", { length: 50 }),
  
  // Quality
  formQuality: integer("form_quality"), // 1-10
  difficulty: integer("difficulty"), // 1-10
  
  // Progression
  progressionFromLast: varchar("progression_from_last", { length: 255 }), // More weight, reps, better form, etc.
  
  // Pain/Discomfort
  painDuring: boolean("pain_during"),
  painLocation: varchar("pain_location", { length: 255 }),
  painLevel: integer("pain_level"), // 1-10
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Cardio Sessions
export const cardioSessions = pgTable("cardio_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  workoutId: varchar("workout_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionDate: timestamp("session_date").notNull(),
  
  // Activity
  activityType: varchar("activity_type", { length: 50 }),
  
  // Duration & Distance
  duration: integer("duration"), // minutes
  distance: decimal("distance", { precision: 6, scale: 2 }), // km
  
  // Intensity
  avgHeartRate: integer("avg_heart_rate"), // bpm
  maxHeartRate: integer("max_heart_rate"), // bpm
  heartRateZones: text("heart_rate_zones"), // JSON: time in each zone
  
  avgPace: varchar("avg_pace", { length: 50 }), // min/km
  avgSpeed: decimal("avg_speed", { precision: 5, scale: 2 }), // km/h
  
  // Elevation
  elevationGain: integer("elevation_gain"), // meters
  
  // Calories
  caloriesBurned: integer("calories_burned"),
  
  // Performance
  performanceRating: integer("performance_rating"), // 1-10
  
  // Recovery
  recoveryHeartRate: integer("recovery_heart_rate"), // HR 1 min after stopping
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Mobility & Flexibility Work
export const mobilityWork = pgTable("mobility_work", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionDate: timestamp("session_date").notNull(),
  
  // Session Type
  sessionType: varchar("session_type", { length: 50 }),
  
  // Focus Areas
  areasWorked: text("areas_worked"), // JSON: hips, shoulders, ankles, etc.
  
  // Duration
  duration: integer("duration"), // minutes
  
  // Quality
  rangeOfMotionBefore: integer("range_of_motion_before"), // 1-10
  rangeOfMotionAfter: integer("range_of_motion_after"), // 1-10
  
  painBefore: integer("pain_before"), // 1-10
  painAfter: integer("pain_after"), // 1-10
  
  // Techniques Used
  techniquesUsed: text("techniques_used"), // JSON array
  
  // Effectiveness
  effectiveness: integer("effectiveness"), // 1-10
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Recovery Tracking
export const recoveryTracking = pgTable("recovery_tracking", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  trackingDate: timestamp("tracking_date").notNull(),
  
  // Recovery Score (calculated or self-reported)
  recoveryScore: integer("recovery_score"), // 1-10
  
  // Metrics
  restingHeartRate: integer("resting_heart_rate"), // bpm
  hrv: integer("hrv"), // Heart Rate Variability (ms)
  
  sleepQuality: integer("sleep_quality"), // 1-10
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
  
  // Soreness
  overallSoreness: integer("overall_soreness"), // 1-10
  soreAreas: text("sore_areas"), // JSON: specific muscles/joints
  
  // Energy & Readiness
  energyLevel: integer("energy_level"), // 1-10
  readinessToTrain: integer("readiness_to_train"), // 1-10
  
  // Stress
  stressLevel: integer("stress_level"), // 1-10
  
  // Recovery Strategies Used
  recoveryStrategies: text("recovery_strategies"), // JSON: sleep, nutrition, massage, ice bath, etc.
  
  // Recommendations (self-learning)
  recommendedAction: varchar("recommended_action", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Body Measurements
export const bodyMeasurements = pgTable("body_measurements", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  measurementDate: timestamp("measurement_date").notNull(),
  
  // Weight
  weight: decimal("weight", { precision: 5, scale: 2 }), // kg
  
  // Body Composition
  bodyFatPercentage: decimal("body_fat_percentage", { precision: 4, scale: 1 }),
  muscleMass: decimal("muscle_mass", { precision: 5, scale: 2 }), // kg
  
  // Circumferences (cm)
  neck: decimal("neck", { precision: 4, scale: 1 }),
  chest: decimal("chest", { precision: 4, scale: 1 }),
  waist: decimal("waist", { precision: 4, scale: 1 }),
  hips: decimal("hips", { precision: 4, scale: 1 }),
  bicepLeft: decimal("bicep_left", { precision: 4, scale: 1 }),
  bicepRight: decimal("bicep_right", { precision: 4, scale: 1 }),
  thighLeft: decimal("thigh_left", { precision: 4, scale: 1 }),
  thighRight: decimal("thigh_right", { precision: 4, scale: 1 }),
  calfLeft: decimal("calf_left", { precision: 4, scale: 1 }),
  calfRight: decimal("calf_right", { precision: 4, scale: 1 }),
  
  // Photos
  frontPhoto: varchar("front_photo", { length: 255 }),
  sidePhoto: varchar("side_photo", { length: 255 }),
  backPhoto: varchar("back_photo", { length: 255 }),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Strength Benchmarks
export const strengthBenchmarks = pgTable("strength_benchmarks", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  testDate: timestamp("test_date").notNull(),
  
  // Exercise
  exercise: varchar("exercise", { length: 255 }).notNull(),
  
  // Test Type
  testType: varchar("test_type", { length: 50 }),
  
  // Result
  weight: decimal("weight", { precision: 6, scale: 2 }), // kg
  reps: integer("reps"),
  duration: integer("duration"), // seconds (for time-based tests)
  
  // Relative Strength
  bodyweightRatio: decimal("bodyweight_ratio", { precision: 4, scale: 2 }), // weight lifted / bodyweight
  
  // Comparison
  improvementFromLast: decimal("improvement_from_last", { precision: 5, scale: 2 }), // percentage
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Physical Engine Self-Learning Analytics
export const physicalEngineAnalytics = pgTable("physical_engine_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Training Effectiveness (aggregated)
  workoutType: varchar("workout_type", { length: 100 }).notNull(),
  
  // Effectiveness Metrics
  avgRecoveryScore: decimal("avg_recovery_score", { precision: 5, scale: 2 }),
  avgProgressionRate: decimal("avg_progression_rate", { precision: 5, scale: 2 }), // % improvement per week
  injuryRate: decimal("injury_rate", { precision: 5, scale: 2 }), // % of users who get injured
  
  // Optimal Parameters
  optimalFrequency: integer("optimal_frequency"), // sessions per week
  optimalDuration: integer("optimal_duration"), // minutes
  optimalIntensity: varchar("optimal_intensity", { length: 50 }),
  
  // Recovery
  avgRecoveryTime: integer("avg_recovery_time"), // hours needed
  
  // User Segments
  mostEffectiveFor: text("most_effective_for"), // JSON: different fitness levels
  
  // Sample Size
  workoutCount: integer("workout_count"),
  userCount: integer("user_count"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
