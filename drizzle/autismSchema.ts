import { int, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./schema";

/**
 * AUTISM TRANSFORMATION MODULE - DATABASE SCHEMA (MySQL)
 * 
 * This schema supports the world-class autism transformation protocol
 * combining biomedical, behavioral, and cutting-edge interventions.
 */

// Child Profile & Assessment
export const autismProfiles = pgTable("autismProfiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id), // Parent's user ID
  childName: varchar("child_name", { length: 255 }).notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  diagnosisDate: timestamp("diagnosis_date"),
  severity: varchar("severity", { length: 50 }),
  
  // Assessment Data
  atecScore: integer("atec_score"), // Autism Treatment Evaluation Checklist
  carsScore: integer("cars_score"), // Childhood Autism Rating Scale
  communicationLevel: varchar("communication_level", { length: 50 }),
  
  // Symptoms & Challenges (stored as JSON text)
  giSymptoms: text("gi_symptoms"), // JSON: ["constipation", "diarrhea", "pain"]
  sleepIssues: text("sleep_issues"), // JSON: ["difficulty_falling_asleep", "night_wakings"]
  sensoryProfile: text("sensory_profile"), // JSON: {"hyper": ["sound", "touch"], "hypo": ["movement"]}
  behaviorChallenges: text("behavior_challenges"), // JSON: ["aggression", "self_injury", "tantrums"]
  
  // Family Context
  familyResources: text("family_resources"), // JSON: {"time": "limited", "budget": "moderate", "support": "high"}
  treatmentPriorities: text("treatment_priorities"), // JSON: ["communication", "behavior", "independence"]
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AutismProfile = typeof autismProfiles.$inferSelect;
export type InsertAutismProfile = typeof autismProfiles.$inferInsert;

// Personalized Intervention Plans
export const interventionPlans = pgTable("interventionPlans", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => autismProfiles.id),
  
  // Tiered Interventions (JSON arrays)
  tier1Interventions: text("tier1_interventions").notNull(), // JSON: ["nutrition", "sleep", "sensory"]
  tier2Interventions: text("tier2_interventions"), // JSON: ["FMT", "GFCF_diet", "omega3"]
  tier3Interventions: text("tier3_interventions"), // JSON: ["ABA", "OT", "speech"]
  tier4Interventions: text("tier4_interventions"), // JSON: ["neurofeedback", "TMS_trial"]
  
  // Timeline & Providers
  currentPhase: varchar("current_phase", { length: 50 }),
  startDate: timestamp("start_date").notNull(),
  providerDirectory: text("provider_directory"), // JSON: {"ABA": "provider_name", "OT": "provider_name"}
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InterventionPlan = typeof interventionPlans.$inferSelect;
export type InsertInterventionPlan = typeof interventionPlans.$inferInsert;

// Supplement Tracking
export const supplementTracking = pgTable("supplementTracking", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => autismProfiles.id),
  
  supplementName: varchar("supplement_name", { length: 255 }).notNull(), // "Omega-3", "Vitamin D", "Methylcobalamin"
  dosage: varchar("dosage", { length: 255 }).notNull(), // "1000mg EPA+DHA", "300 IU/kg/day"
  frequency: varchar("frequency", { length: 50 }),
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  
  // Tracking
  adherence: integer("adherence"), // Percentage: 0-100
  sideEffects: text("side_effects"), // JSON: ["fishy_burps", "loose_stools"]
  perceivedBenefit: integer("perceived_benefit"), // 1-10 scale
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SupplementTracking = typeof supplementTracking.$inferSelect;
export type InsertSupplementTracking = typeof supplementTracking.$inferInsert;

// Dietary Interventions
export const dietaryInterventions = pgTable("dietaryInterventions", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => autismProfiles.id),
  
  dietType: varchar("diet_type", { length: 50 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  
  // Tracking
  adherence: integer("adherence"), // Percentage: 0-100
  giSymptomChanges: text("gi_symptom_changes"), // JSON: {"constipation": "improved", "bloating": "resolved"}
  behaviorChanges: text("behavior_changes"), // JSON: {"attention": "improved", "sleep": "improved"}
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DietaryIntervention = typeof dietaryInterventions.$inferSelect;
export type InsertDietaryIntervention = typeof dietaryInterventions.$inferInsert;

// Therapy Sessions
export const therapySessions = pgTable("therapySessions", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => autismProfiles.id),
  
  therapyType: varchar("therapy_type", { length: 50 }),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration").notNull(), // Minutes
  
  // Session Details
  goalsAddressed: text("goals_addressed"), // JSON: ["increase_eye_contact", "reduce_tantrums"]
  progress: text("progress"), // JSON: {"eye_contact": "improved", "tantrums": "reduced_by_30%"}
  parentFeedback: text("parent_feedback"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TherapySession = typeof therapySessions.$inferSelect;
export type InsertTherapySession = typeof therapySessions.$inferInsert;

// Autism Outcome Tracking
export const autismOutcomeTracking = pgTable("autismOutcomeTracking", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => autismProfiles.id),
  
  assessmentDate: timestamp("assessment_date").notNull(),
  
  // Core Autism Symptoms
  atecScore: integer("atec_score"),
  carsScore: integer("cars_score"),
  communicationLevel: varchar("communication_level", { length: 50 }),
  
  // Behavior & Function
  behaviorScore: integer("behavior_score"), // 1-10 scale (parent-reported)
  adaptiveFunctionScore: integer("adaptive_function_score"), // 1-10 scale
  
  // Physical Health
  giSymptomScore: integer("gi_symptom_score"), // 1-10 scale (1=severe, 10=none)
  sleepScore: integer("sleep_score"), // 1-10 scale (1=severe issues, 10=excellent)
  
  // Family Quality of Life
  familyQOL: integer("family_qol"), // 1-10 scale
  parentStress: integer("parent_stress"), // 1-10 scale (1=low, 10=high)
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AutismOutcomeTracking = typeof autismOutcomeTracking.$inferSelect;
export type InsertAutismOutcomeTracking = typeof autismOutcomeTracking.$inferInsert;

// Adaptive Learning - Pattern Detection for Autism
export const autismPatternDetection = pgTable("autismPatternDetection", {
  id: serial("id").primaryKey(),
  
  // Child Profile Characteristics
  childProfile: text("child_profile").notNull(), // JSON: {"severity": "moderate", "giSymptoms": true, "age": 4}
  
  // Intervention Combination
  interventionCombination: text("intervention_combination").notNull(), // JSON: ["FMT", "omega3", "ABA"]
  
  // Outcome Data
  outcomeData: text("outcome_data").notNull(), // JSON: {"atec_improvement": 40, "behavior_improvement": 60}
  
  // Pattern Insights
  patternType: varchar("pattern_type", { length: 50 }),
  confidence: integer("confidence"), // 0-100
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AutismPatternDetection = typeof autismPatternDetection.$inferSelect;
export type InsertAutismPatternDetection = typeof autismPatternDetection.$inferInsert;

// Provider Directory for Autism Services
export const autismProviders = pgTable("autismProviders", {
  id: serial("id").primaryKey(),
  
  providerType: varchar("provider_type", { length: 50 }),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(), // City, State
  
  // Contact & Details
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  
  // Ratings & Reviews
  rating: integer("rating"), // 1-5 stars
  reviewCount: integer("review_count"),
  
  // Insurance & Cost
  acceptsInsurance: varchar("accepts_insurance", { length: 50 }),
  costRange: varchar("cost_range", { length: 100 }), // "$100-$200/session"
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AutismProvider = typeof autismProviders.$inferSelect;
export type InsertAutismProvider = typeof autismProviders.$inferInsert;
