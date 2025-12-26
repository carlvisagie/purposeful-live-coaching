/**
 * DATABASE SCHEMA FOR INTELLIGENT SYSTEMS
 * 
 * Persistent storage for:
 * - Self-Learning data (interactions, preferences, effectiveness)
 * - Self-Fixing data (errors, health checks, corrections)
 * - Self-Evolving data (insights, evolution events, research validations)
 */

import { pgTable, serial, text, integer, timestamp, boolean, jsonb, real, varchar } from "drizzle-orm/pg-core";

// ============================================================================
// SELF-LEARNING TABLES
// ============================================================================

/**
 * Tracks every interaction across all modules
 */
export const moduleInteractions = pgTable("module_interactions", {
  id: serial("id").primaryKey(),
  moduleType: varchar("module_type", { length: 100 }).notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  userId: integer("user_id"),
  sessionId: varchar("session_id", { length: 255 }),
  
  // Outcome
  wasSuccessful: boolean("was_successful").notNull(),
  userSatisfaction: integer("user_satisfaction"), // 1-10
  userFeedback: text("user_feedback"),
  
  // Performance
  duration: integer("duration"), // milliseconds
  
  // Context
  timeOfDay: varchar("time_of_day", { length: 50 }),
  dayOfWeek: integer("day_of_week"), // 0-6
  deviceType: varchar("device_type", { length: 50 }),
  
  // User choices (for preference learning)
  userChoice: varchar("user_choice", { length: 255 }),
  alternatives: jsonb("alternatives"), // string[]
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Aggregated learning data per module
 */
export const moduleLearning = pgTable("module_learning", {
  id: serial("id").primaryKey(),
  moduleType: varchar("module_type", { length: 100 }).notNull().unique(),
  
  // Statistics
  totalInteractions: integer("total_interactions").default(0).notNull(),
  successfulInteractions: integer("successful_interactions").default(0).notNull(),
  successRate: real("success_rate").default(0).notNull(), // 0-100
  
  // Strategies
  topEffectiveStrategies: jsonb("top_effective_strategies"), // string[]
  topIneffectiveStrategies: jsonb("top_ineffective_strategies"), // string[]
  
  // Preferences
  clientPreferences: jsonb("client_preferences"), // Record<string, number>
  
  // Patterns
  emergingPatterns: jsonb("emerging_patterns"), // string[]
  suggestedImprovements: jsonb("suggested_improvements"), // string[]
  
  lastAnalyzed: timestamp("last_analyzed").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Feature effectiveness tracking
 */
export const featureEffectiveness = pgTable("feature_effectiveness", {
  id: serial("id").primaryKey(),
  featureId: varchar("feature_id", { length: 255 }).notNull().unique(),
  moduleType: varchar("module_type", { length: 100 }).notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  
  // Effectiveness metrics
  timesUsed: integer("times_used").default(0).notNull(),
  successCount: integer("success_count").default(0).notNull(),
  failureCount: integer("failure_count").default(0).notNull(),
  effectivenessScore: real("effectiveness_score").default(50).notNull(), // 0-100
  
  // User satisfaction
  averageSatisfaction: real("average_satisfaction").default(5).notNull(), // 1-10
  totalSatisfactionRatings: integer("total_satisfaction_ratings").default(0).notNull(),
  
  lastUsed: timestamp("last_used").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// SELF-FIXING TABLES
// ============================================================================

/**
 * Error log for self-fixing analysis
 */
export const errorLogs = pgTable("error_logs", {
  id: serial("id").primaryKey(),
  
  // Error context
  module: varchar("module", { length: 100 }).notNull(),
  operation: varchar("operation", { length: 255 }).notNull(),
  userId: integer("user_id"),
  sessionId: varchar("session_id", { length: 255 }),
  
  // Error details
  errorType: varchar("error_type", { length: 50 }).notNull(), // network, database, api, validation, unknown
  severity: varchar("severity", { length: 20 }).notNull(), // low, medium, high, critical
  errorMessage: text("error_message").notNull(),
  errorStack: text("error_stack"),
  
  // Fix attempt
  attemptNumber: integer("attempt_number").default(1).notNull(),
  wasFixed: boolean("was_fixed").default(false).notNull(),
  fixMethod: varchar("fix_method", { length: 255 }),
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Service health monitoring
 */
export const serviceHealth = pgTable("service_health", {
  id: serial("id").primaryKey(),
  service: varchar("service", { length: 100 }).notNull().unique(),
  
  // Health status
  status: varchar("status", { length: 20 }).notNull(), // healthy, degraded, down
  lastCheck: timestamp("last_check").defaultNow().notNull(),
  responseTime: integer("response_time"), // milliseconds
  
  // Error tracking
  errorCount: integer("error_count").default(0).notNull(),
  consecutiveFailures: integer("consecutive_failures").default(0).notNull(),
  
  // History
  lastHealthyAt: timestamp("last_healthy_at"),
  lastDownAt: timestamp("last_down_at"),
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Auto-correction history
 */
export const correctionHistory = pgTable("correction_history", {
  id: serial("id").primaryKey(),
  errorLogId: integer("error_log_id").references(() => errorLogs.id),
  
  // Correction details
  correctionType: varchar("correction_type", { length: 100 }).notNull(),
  correctionDescription: text("correction_description").notNull(),
  wasSuccessful: boolean("was_successful").notNull(),
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// SELF-EVOLVING TABLES
// ============================================================================

/**
 * Rule effectiveness tracking
 */
export const ruleEffectiveness = pgTable("rule_effectiveness", {
  id: serial("id").primaryKey(),
  ruleId: varchar("rule_id", { length: 255 }).notNull().unique(),
  moduleType: varchar("module_type", { length: 100 }).notNull(),
  
  // Effectiveness metrics
  timesTriggered: integer("times_triggered").default(0).notNull(),
  clientsAffected: integer("clients_affected").default(0).notNull(),
  positiveOutcomes: integer("positive_outcomes").default(0).notNull(),
  negativeOutcomes: integer("negative_outcomes").default(0).notNull(),
  neutralOutcomes: integer("neutral_outcomes").default(0).notNull(),
  
  // Satisfaction
  averageClientSatisfaction: real("average_client_satisfaction").default(5).notNull(), // 1-10
  effectivenessScore: real("effectiveness_score").default(50).notNull(), // 0-100
  
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

/**
 * Platform insights generated by AI
 */
export const platformInsights = pgTable("platform_insights", {
  id: serial("id").primaryKey(),
  insightId: varchar("insight_id", { length: 100 }).notNull().unique(),
  
  // Insight details
  type: varchar("type", { length: 50 }).notNull(), // trend, pattern, recommendation, warning, research_update
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  
  // Impact
  affectedModules: jsonb("affected_modules"), // ModuleType[]
  affectedPercentage: real("affected_percentage").notNull(), // 0-100
  suggestedAction: text("suggested_action"),
  
  // Research
  researchBasis: text("research_basis"),
  confidence: real("confidence").notNull(), // 0-100
  
  // Status
  status: varchar("status", { length: 50 }).default("active").notNull(), // active, implemented, dismissed
  implementedAt: timestamp("implemented_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Evolution events (platform changes based on learning)
 */
export const evolutionEvents = pgTable("evolution_events", {
  id: serial("id").primaryKey(),
  eventId: varchar("event_id", { length: 100 }).notNull().unique(),
  
  // Event details
  eventType: varchar("event_type", { length: 50 }).notNull(), // rule_updated, rule_added, rule_deprecated, strategy_changed, research_validated
  moduleType: varchar("module_type", { length: 100 }).notNull(),
  description: text("description").notNull(),
  reason: text("reason").notNull(),
  
  // Changes
  previousValue: jsonb("previous_value"),
  newValue: jsonb("new_value"),
  
  // Research
  researchBasis: text("research_basis"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Research validation cache
 */
export const researchValidations = pgTable("research_validations", {
  id: serial("id").primaryKey(),
  cacheKey: varchar("cache_key", { length: 500 }).notNull().unique(),
  
  // Claim
  claim: text("claim").notNull(),
  domain: varchar("domain", { length: 100 }).notNull(),
  
  // Validation result
  isValid: boolean("is_valid").notNull(),
  evidenceLevel: varchar("evidence_level", { length: 10 }).notNull(), // A, B, C, D
  sources: jsonb("sources"), // string[]
  confidence: real("confidence").notNull(), // 0-100
  reasoning: text("reasoning"),
  
  // Cache management
  lastValidated: timestamp("last_validated").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // Cache for 7 days
});
