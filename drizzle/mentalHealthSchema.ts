/**
 * MENTAL HEALTH & RECOVERY MODULE
 * Evidence-based approach using CBT, DBT, and trauma-informed care
 * Research sources: NIMH, APA, SAMHSA guidelines
 */

import { boolean, decimal, int, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Mental Health Profiles - Core user mental health data
export const mentalHealthProfiles = pgTable("mental_health_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Diagnosis & History
  primaryDiagnosis: varchar("primary_diagnosis", { length: 255 }),
  secondaryDiagnoses: text("secondary_diagnoses"), // JSON array
  diagnosisDate: timestamp("diagnosis_date"),
  treatmentHistory: text("treatment_history"), // JSON array of past treatments
  
  // Current Status
  currentSeverity: pgEnum("current_severity", ["mild", "moderate", "severe", "crisis"]),
  inTreatment: boolean("in_treatment").default(false),
  medicationList: text("medication_list"), // JSON array
  therapyType: varchar("therapy_type", { length: 255 }), // CBT, DBT, EMDR, etc.
  
  // Risk Assessment
  suicidalIdeation: boolean("suicidal_ideation").default(false),
  selfHarmRisk: pgEnum("self_harm_risk", ["none", "low", "moderate", "high"]),
  crisisContactInfo: text("crisis_contact_info"), // JSON
  
  // Goals & Progress
  recoveryGoals: text("recovery_goals"), // JSON array
  currentPhase: pgEnum("current_phase", ["crisis_stabilization", "active_treatment", "maintenance", "recovery"]),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Mood & Symptom Tracking - Evidence-based mood monitoring
export const moodLogs = pgTable("mood_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  logDate: timestamp("log_date").notNull(),
  
  // Mood Ratings (1-10 scale, evidence-based)
  overallMood: integer("overall_mood"), // 1=worst, 10=best
  anxiety: integer("anxiety"), // 1=none, 10=severe
  depression: integer("depression"),
  irritability: integer("irritability"),
  energy: integer("energy"),
  sleep_quality: integer("sleep_quality"),
  
  // Symptom Checklist (based on DSM-5 criteria)
  symptoms: text("symptoms"), // JSON array: ["racing_thoughts", "loss_of_interest", etc.]
  
  // Behavioral Markers
  selfCareCompleted: boolean("self_care_completed"),
  socialInteraction: boolean("social_interaction"),
  physicalActivity: boolean("physical_activity"),
  substanceUse: boolean("substance_use"),
  
  // Triggers & Coping
  triggers: text("triggers"), // JSON array
  copingStrategiesUsed: text("coping_strategies_used"), // JSON array
  copingEffectiveness: integer("coping_effectiveness"), // 1-10
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// CBT Thought Records - Evidence-based cognitive restructuring
export const thoughtRecords = pgTable("thought_records", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  recordDate: timestamp("record_date").notNull(),
  
  // Situation
  situation: text("situation").notNull(),
  
  // Automatic Thoughts
  automaticThought: text("automatic_thought").notNull(),
  emotionsBefore: text("emotions_before"), // JSON: [{emotion: "anxiety", intensity: 8}]
  
  // Evidence & Analysis
  evidenceFor: text("evidence_for"),
  evidenceAgainst: text("evidence_against"),
  cognitiveDistortions: text("cognitive_distortions"), // JSON array: ["catastrophizing", "black_and_white", etc.]
  
  // Balanced Thought
  balancedThought: text("balanced_thought"),
  emotionsAfter: text("emotions_after"), // JSON: [{emotion: "anxiety", intensity: 4}]
  
  // Outcome
  behavioralResponse: text("behavioral_response"),
  effectiveness: integer("effectiveness"), // 1-10
  
  createdAt: timestamp("created_at").defaultNow(),
});

// DBT Skills Practice - Evidence-based dialectical behavior therapy
export const dbtSkillsPractice = pgTable("dbt_skills_practice", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // DBT Module
  module: pgEnum("module", ["mindfulness", "distress_tolerance", "emotion_regulation", "interpersonal_effectiveness"]).notNull(),
  
  // Specific Skill
  skillName: varchar("skill_name", { length: 255 }).notNull(), // e.g., "TIPP", "DEAR MAN", "Opposite Action"
  
  // Practice Details
  situation: text("situation"),
  emotionBefore: varchar("emotion_before", { length: 255 }),
  intensityBefore: integer("intensity_before"), // 1-10
  
  // Skill Application
  skillStepsUsed: text("skill_steps_used"), // JSON array
  effectiveness: integer("effectiveness"), // 1-10
  
  emotionAfter: varchar("emotion_after", { length: 255 }),
  intensityAfter: integer("intensity_after"), // 1-10
  
  // Reflection
  whatWorked: text("what_worked"),
  whatDidntWork: text("what_didnt_work"),
  nextTime: text("next_time"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Safety Plans - Evidence-based suicide prevention
export const safetyPlans = pgTable("safety_plans", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Warning Signs
  warningSigns: text("warning_signs"), // JSON array
  
  // Coping Strategies (ordered by escalation)
  internalCopingStrategies: text("internal_coping_strategies"), // JSON array
  socialDistractions: text("social_distractions"), // JSON array
  
  // Support Contacts
  supportContacts: text("support_contacts"), // JSON: [{name, phone, relationship}]
  professionalContacts: text("professional_contacts"), // JSON: [{name, phone, role}]
  
  // Crisis Resources
  crisisHotlines: text("crisis_hotlines"), // JSON array
  emergencyServices: text("emergency_services"), // JSON
  
  // Environment Safety
  meansRestriction: text("means_restriction"), // Steps taken to reduce access to lethal means
  
  // Reasons for Living
  reasonsForLiving: text("reasons_for_living"), // JSON array
  
  lastReviewed: timestamp("last_reviewed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Recovery Milestones - Track progress markers
export const recoveryMilestones = pgTable("recovery_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  milestoneType: pgEnum("milestone_type", [
    "symptom_free_days",
    "therapy_completion",
    "medication_stabilization",
    "return_to_work",
    "social_reconnection",
    "self_care_consistency",
    "crisis_management",
    "skill_mastery"
  ]).notNull(),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  targetDate: timestamp("target_date"),
  achievedDate: timestamp("achieved_date"),
  
  progress: integer("progress"), // 0-100%
  status: pgEnum("status", ["not_started", "in_progress", "achieved", "on_hold"]),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
