/**
 * HEALTH OPTIMIZATION ENGINE
 * Evidence-based approach using Longevity Science, Preventive Medicine, Biomarker Research, and Biohacking
 * Research sources: Peter Attia (longevity), David Sinclair (aging), Andrew Huberman (protocols), Bryan Johnson (Blueprint)
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Tracks biomarker trends and interventions
 * - Identifies health risks early
 * - Learns which protocols work for each user
 * - Predicts health outcomes based on current trajectory
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Health Optimization Profiles
export const healthOptimizationProfiles = pgTable("health_optimization_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Current Health Status
  overallHealth: integer("overall_health"), // 1-10 self-assessment
  
  // Age & Biological Age
  chronologicalAge: integer("chronological_age"),
  estimatedBiologicalAge: integer("estimated_biological_age"), // Based on biomarkers
  
  // Health Goals
  primaryGoal: varchar("primary_goal", { length: 50 }),
  
  // Risk Factors
  familyHistory: text("family_history"), // JSON: diseases in family
  currentConditions: text("current_conditions"), // JSON array
  riskFactors: text("risk_factors"), // JSON: smoking, sedentary, etc.
  
  // Medications
  currentMedications: text("current_medications"), // JSON array
  
  // Lifestyle
  smokingStatus: varchar("smoking_status", { length: 50 }),
  alcoholConsumption: varchar("alcohol_consumption", { length: 50 }),
  
  // Health Optimization Protocols
  activeProtocols: text("active_protocols"), // JSON: protocols currently following
  
  // Self-Learning Data
  mostEffectiveInterventions: text("most_effective_interventions"), // JSON
  biomarkerTrends: text("biomarker_trends"), // JSON: improving, stable, declining
  healthTrajectory: varchar("health_trajectory", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Biomarker Tracking
export const biomarkers = pgTable("biomarkers", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  testDate: timestamp("test_date").notNull(),
  
  // Metabolic Health
  fastingGlucose: decimal("fasting_glucose", { precision: 5, scale: 2 }), // mg/dL
  hbA1c: decimal("hba1c", { precision: 4, scale: 2 }), // % (diabetes marker)
  fastingInsulin: decimal("fasting_insulin", { precision: 5, scale: 2 }), // μIU/mL
  homaIR: decimal("homa_ir", { precision: 5, scale: 2 }), // Insulin resistance
  
  // Lipid Panel
  totalCholesterol: integer("total_cholesterol"), // mg/dL
  ldlCholesterol: integer("ldl_cholesterol"), // mg/dL
  hdlCholesterol: integer("hdl_cholesterol"), // mg/dL
  triglycerides: integer("triglycerides"), // mg/dL
  apoB: integer("apo_b"), // mg/dL (best predictor of cardiovascular risk)
  lpA: integer("lp_a"), // mg/dL (genetic risk factor)
  
  // Inflammation
  hsCRP: decimal("hs_crp", { precision: 5, scale: 2 }), // mg/L (high-sensitivity C-reactive protein)
  
  // Liver Function
  alt: integer("alt"), // U/L
  ast: integer("ast"), // U/L
  ggt: integer("ggt"), // U/L
  
  // Kidney Function
  creatinine: decimal("creatinine", { precision: 4, scale: 2 }), // mg/dL
  eGFR: integer("egfr"), // mL/min/1.73m² (kidney filtration rate)
  bun: integer("bun"), // mg/dL
  
  // Thyroid
  tsh: decimal("tsh", { precision: 5, scale: 3 }), // mIU/L
  freeT3: decimal("free_t3", { precision: 4, scale: 2 }), // pg/mL
  freeT4: decimal("free_t4", { precision: 4, scale: 2 }), // ng/dL
  
  // Hormones
  testosterone: integer("testosterone"), // ng/dL
  estradiol: integer("estradiol"), // pg/mL
  cortisol: decimal("cortisol", { precision: 5, scale: 2 }), // μg/dL
  dhea: integer("dhea"), // μg/dL
  
  // Vitamins & Minerals
  vitaminD: decimal("vitamin_d", { precision: 5, scale: 2 }), // ng/mL
  vitaminB12: integer("vitamin_b12"), // pg/mL
  folate: decimal("folate", { precision: 5, scale: 2 }), // ng/mL
  iron: integer("iron"), // μg/dL
  ferritin: integer("ferritin"), // ng/mL
  magnesium: decimal("magnesium", { precision: 4, scale: 2 }), // mg/dL
  
  // Complete Blood Count
  wbc: decimal("wbc", { precision: 4, scale: 2 }), // K/μL (white blood cells)
  rbc: decimal("rbc", { precision: 4, scale: 2 }), // M/μL (red blood cells)
  hemoglobin: decimal("hemoglobin", { precision: 4, scale: 1 }), // g/dL
  hematocrit: decimal("hematocrit", { precision: 4, scale: 1 }), // %
  platelets: integer("platelets"), // K/μL
  
  // Advanced Longevity Markers
  homocysteine: decimal("homocysteine", { precision: 5, scale: 2 }), // μmol/L (cardiovascular & cognitive risk)
  uricAcid: decimal("uric_acid", { precision: 4, scale: 2 }), // mg/dL
  
  // Source
  testSource: varchar("test_source", { length: 255 }), // Lab name
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Protocols (Interventions)
export const healthProtocols = pgTable("health_protocols", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  protocolName: varchar("protocol_name", { length: 255 }).notNull(),
  
  // Protocol Type
  protocolType: varchar("protocol_type", { length: 50 }),
  
  // Details
  description: text("description"),
  protocol: text("protocol"), // Specific steps
  
  // Target
  targetBiomarker: varchar("target_biomarker", { length: 255 }), // What are you trying to improve?
  targetCondition: varchar("target_condition", { length: 255 }),
  
  // Duration
  startDate: timestamp("start_date"),
  plannedDuration: integer("planned_duration"), // days
  endDate: timestamp("end_date"),
  
  // Baseline
  baselineMeasurement: text("baseline_measurement"), // JSON: relevant biomarkers before
  
  // Results
  endMeasurement: text("end_measurement"), // JSON: biomarkers after
  
  // Effectiveness
  effectiveness: integer("effectiveness"), // 1-10
  sideEffects: text("side_effects"),
  
  // Decision
  willContinue: boolean("will_continue"),
  
  // Status
  status: varchar("status", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Health Metrics
export const dailyHealthMetrics = pgTable("daily_health_metrics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  metricDate: timestamp("metric_date").notNull(),
  
  // Vitals
  restingHeartRate: integer("resting_heart_rate"), // bpm
  hrv: integer("hrv"), // ms (Heart Rate Variability - autonomic nervous system health)
  bloodPressureSystolic: integer("blood_pressure_systolic"), // mmHg
  bloodPressureDiastolic: integer("blood_pressure_diastolic"), // mmHg
  oxygenSaturation: integer("oxygen_saturation"), // % (SpO2)
  bodyTemperature: decimal("body_temperature", { precision: 4, scale: 2 }), // °C
  
  // Weight & Composition
  weight: decimal("weight", { precision: 5, scale: 2 }), // kg
  bodyFat: decimal("body_fat", { precision: 4, scale: 1 }), // %
  
  // Sleep
  sleepDuration: decimal("sleep_duration", { precision: 3, scale: 1 }), // hours
  sleepQuality: integer("sleep_quality"), // 1-10
  deepSleepMinutes: integer("deep_sleep_minutes"),
  remSleepMinutes: integer("rem_sleep_minutes"),
  
  // Energy & Performance
  energyLevel: integer("energy_level"), // 1-10
  mentalClarity: integer("mental_clarity"), // 1-10
  physicalPerformance: integer("physical_performance"), // 1-10
  
  // Stress & Recovery
  stressLevel: integer("stress_level"), // 1-10
  recoveryScore: integer("recovery_score"), // 1-10
  
  // Symptoms
  symptoms: text("symptoms"), // JSON array: headache, fatigue, pain, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Sleep Tracking (Detailed)
export const sleepSessions = pgTable("sleep_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sleepDate: timestamp("sleep_date").notNull(),
  
  // Duration
  bedTime: timestamp("bed_time"),
  wakeTime: timestamp("wake_time"),
  totalTimeInBed: integer("total_time_in_bed"), // minutes
  totalSleepTime: integer("total_sleep_time"), // minutes
  sleepEfficiency: integer("sleep_efficiency"), // % (sleep time / time in bed)
  
  // Sleep Stages
  awakeDuration: integer("awake_duration"), // minutes
  lightSleepDuration: integer("light_sleep_duration"), // minutes
  deepSleepDuration: integer("deep_sleep_duration"), // minutes
  remSleepDuration: integer("rem_sleep_duration"), // minutes
  
  // Quality
  sleepQuality: integer("sleep_quality"), // 1-10
  timesToWake: integer("times_to_wake"),
  timeToFallAsleep: integer("time_to_fall_asleep"), // minutes (sleep latency)
  
  // Factors
  caffeineAfter2pm: boolean("caffeine_after_2pm"),
  alcoholBeforeBed: boolean("alcohol_before_bed"),
  screenTimeBeforeBed: integer("screen_time_before_bed"), // minutes
  exerciseToday: boolean("exercise_today"),
  stressLevel: integer("stress_level"), // 1-10
  
  // Environment
  roomTemperature: integer("room_temperature"), // °C
  noiseLevel: varchar("noise_level", { length: 50 }),
  lightLevel: varchar("light_level", { length: 50 }),
  
  // Morning Metrics
  morningEnergy: integer("morning_energy"), // 1-10
  morningMood: varchar("morning_mood", { length: 100 }),
  
  // Source
  dataSource: varchar("data_source", { length: 255 }), // Oura, Whoop, Apple Watch, manual, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Stress & Recovery
export const stressRecoveryLogs = pgTable("stress_recovery_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  logDate: timestamp("log_date").notNull(),
  
  // Stress Metrics
  perceivedStress: integer("perceived_stress"), // 1-10
  stressSources: text("stress_sources"), // JSON array
  
  // HRV (Heart Rate Variability - stress indicator)
  morningHRV: integer("morning_hrv"), // ms
  
  // Recovery Metrics
  recoveryScore: integer("recovery_score"), // 1-10
  restingHeartRate: integer("resting_heart_rate"), // bpm
  
  // Strain (if tracking like Whoop)
  dailyStrain: decimal("daily_strain", { precision: 4, scale: 1 }), // Cardiovascular load
  
  // Recovery Strategies Used
  recoveryStrategies: text("recovery_strategies"), // JSON: meditation, sauna, massage, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Screenings & Tests
export const healthScreenings = pgTable("health_screenings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  screeningDate: timestamp("screening_date").notNull(),
  
  // Screening Type
  screeningType: varchar("screening_type", { length: 50 }),
  
  screeningName: varchar("screening_name", { length: 255 }),
  
  // Results
  results: text("results"), // JSON or text
  abnormalFindings: text("abnormal_findings"),
  
  // Follow-up
  followUpNeeded: boolean("follow_up_needed"),
  followUpDate: timestamp("follow_up_date"),
  
  // Provider
  provider: varchar("provider", { length: 255 }),
  
  // Files
  resultsFile: varchar("results_file", { length: 255 }),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Longevity Practices
export const longevityPractices = pgTable("longevity_practices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // Practice Type (evidence-based longevity interventions)
  practiceType: varchar("practice_type", { length: 50 }),
  
  // Details
  duration: integer("duration"), // minutes
  intensity: varchar("intensity", { length: 50 }),
  
  // Specific Metrics
  specificMetrics: text("specific_metrics"), // JSON: temperature, heart rate, etc.
  
  // How It Felt
  howItFelt: text("how_it_felt"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Milestones
export const healthMilestones = pgTable("health_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  milestoneType: varchar("milestone_type", { length: 50 }),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  achievedDate: timestamp("achieved_date"),
  
  // Significance
  significance: text("significance"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Optimization Engine Self-Learning Analytics
export const healthOptimizationAnalytics = pgTable("health_optimization_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Intervention Effectiveness (aggregated)
  interventionType: varchar("intervention_type", { length: 100 }).notNull(),
  targetBiomarker: varchar("target_biomarker", { length: 100 }),
  
  // Effectiveness Metrics
  avgBiomarkerImprovement: decimal("avg_biomarker_improvement", { precision: 6, scale: 2 }), // % change
  successRate: decimal("success_rate", { precision: 5, scale: 2 }), // % of users who improved
  
  // Optimal Parameters
  optimalDuration: integer("optimal_duration"), // days
  optimalDosage: varchar("optimal_dosage", { length: 255 }),
  
  // User Segments
  mostEffectiveFor: text("most_effective_for"), // JSON: different health profiles
  
  // Sample Size
  protocolCount: integer("protocol_count"),
  userCount: integer("user_count"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
