import { int, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { clients } from "./schema";

/**
 * Adaptive Learning Engine Schema
 * Platform learns from all clients and evolves coaching strategies
 */

/**
 * Technique Effectiveness Tracking
 * Track which coaching techniques work best for which situations
 */
export const techniqueEffectiveness = pgTable("techniqueEffectiveness", {
  id: serial("id").primaryKey(),
  
  // Technique details
  techniqueName: varchar("technique_name", { length: 255 }).notNull(),
  techniqueCategory: varchar("technique_category", { length: 100 }).notNull(), // CBT, DBT, mindfulness, etc.
  techniqueDescription: text("technique_description"),
  
  // Context
  problemType: varchar("problem_type", { length: 255 }).notNull(), // anxiety, depression, stress, etc.
  clientDemographic: text("client_demographic"), // JSON: age range, background, etc.
  
  // Effectiveness metrics
  timesRecommended: integer("times_recommended").default(0).notNull(),
  timesUsed: integer("times_used").default(0).notNull(),
  successCount: integer("success_count").default(0).notNull(),
  failureCount: integer("failure_count").default(0).notNull(),
  averageRating: integer("average_rating"), // 1-10 scale
  
  // Learning data
  lastRecommended: timestamp("last_recommended"),
  confidenceScore: integer("confidence_score").default(50).notNull(), // 0-100, increases with data
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TechniqueEffectiveness = typeof techniqueEffectiveness.$inferSelect;
export type InsertTechniqueEffectiveness = typeof techniqueEffectiveness.$inferInsert;

/**
 * Client Pattern Detection
 * Identify patterns across all clients
 */
export const clientPatterns = pgTable("clientPatterns", {
  id: serial("id").primaryKey(),
  
  // Pattern details
  patternName: varchar("pattern_name", { length: 255 }).notNull(),
  patternDescription: text("pattern_description").notNull(),
  patternType: varchar("pattern_type", { length: 100 }).notNull(), // trigger, coping, emotional, behavioral
  
  // Frequency
  occurrenceCount: integer("occurrence_count").default(1).notNull(),
  affectedClientCount: integer("affected_client_count").default(1).notNull(),
  
  // Associated data
  commonTriggers: text("common_triggers"), // JSON array
  effectiveSolutions: text("effective_solutions"), // JSON array
  relatedPatterns: text("related_patterns"), // JSON array of pattern IDs
  
  // Learning status
  isValidated: varchar("is_validated", { length: 50 }),
  confidenceScore: integer("confidence_score").default(50).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClientPattern = typeof clientPatterns.$inferSelect;
export type InsertClientPattern = typeof clientPatterns.$inferInsert;

/**
 * Client Feedback on Recommendations
 * Track whether AI recommendations actually helped
 */
export const recommendationFeedback = pgTable("recommendationFeedback", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  
  // Recommendation details
  recommendationType: varchar("recommendation_type", { length: 100 }).notNull(), // technique, strategy, habit, etc.
  recommendationContent: text("recommendation_content").notNull(),
  context: text("context"), // What situation prompted this recommendation
  
  // Feedback
  wasUsed: varchar("was_used", { length: 50 }),
  wasHelpful: varchar("was_helpful", { length: 50 }),
  rating: integer("rating"), // 1-10 scale
  feedbackNotes: text("feedback_notes"),
  
  // Outcome tracking
  problemResolved: varchar("problem_resolved", { length: 50 }),
  timeToResolution: integer("time_to_resolution"), // minutes or hours
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RecommendationFeedback = typeof recommendationFeedback.$inferSelect;
export type InsertRecommendationFeedback = typeof recommendationFeedback.$inferInsert;

/**
 * Outcome Tracking
 * Did the coaching actually improve their life?
 */
export const adaptiveOutcomeTracking = pgTable("adaptiveOutcomeTracking", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  
  // Baseline (when they started)
  baselineDate: timestamp("baseline_date").notNull(),
  baselineEmotionalState: integer("baseline_emotional_state").notNull(), // 1-10
  baselineFunctioning: integer("baseline_functioning").notNull(), // 1-10
  baselineGoals: text("baseline_goals"), // JSON array
  
  // Current state
  currentEmotionalState: integer("current_emotional_state"),
  currentFunctioning: integer("current_functioning"),
  goalsAchieved: text("goals_achieved"), // JSON array
  
  // Improvement metrics
  emotionalImprovement: integer("emotional_improvement"), // Calculated: current - baseline
  functioningImprovement: integer("functioning_improvement"),
  daysInCoaching: integer("days_in_coaching"),
  
  // Specific improvements
  sleepImproved: varchar("sleep_improved", { length: 50 }),
  relationshipsImproved: varchar("relationships_improved", { length: 50 }),
  workPerformanceImproved: varchar("work_performance_improved", { length: 50 }),
  physicalHealthImproved: varchar("physical_health_improved", { length: 50 }),
  
  // Attribution
  attributedToCoaching: varchar("attributed_to_coaching", { length: 50 }),
  mostHelpfulAspect: text("most_helpful_aspect"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AdaptiveOutcomeTracking = typeof adaptiveOutcomeTracking.$inferSelect;
export type InsertAdaptiveOutcomeTracking = typeof adaptiveOutcomeTracking.$inferInsert;

/**
 * Trend Detection
 * Platform notices "80% of clients struggle with X"
 */
export const trendDetection = pgTable("trendDetection", {
  id: serial("id").primaryKey(),
  
  // Trend details
  trendName: varchar("trend_name", { length: 255 }).notNull(),
  trendDescription: text("trend_description").notNull(),
  trendCategory: varchar("trend_category", { length: 100 }).notNull(), // struggle, success, pattern, etc.
  
  // Statistics
  affectedPercentage: integer("affected_percentage").notNull(), // 0-100
  totalClientsAnalyzed: integer("total_clients_analyzed").notNull(),
  affectedClientCount: integer("affected_client_count").notNull(),
  
  // Recommendations
  suggestedContent: text("suggested_content"), // New tools/content to create
  suggestedApproach: text("suggested_approach"), // How to address this trend
  
  // Status
  isActive: varchar("is_active", { length: 50 }),
  isAddressed: varchar("is_addressed", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type TrendDetection = typeof trendDetection.$inferSelect;
export type InsertTrendDetection = typeof trendDetection.$inferInsert;

/**
 * Strategy Adjustments
 * AI automatically changes its approach based on what's working
 */
export const strategyAdjustments = pgTable("strategyAdjustments", {
  id: serial("id").primaryKey(),
  
  // Adjustment details
  adjustmentType: varchar("adjustment_type", { length: 100 }).notNull(), // technique_priority, approach_change, etc.
  adjustmentDescription: text("adjustment_description").notNull(),
  
  // Reason
  triggeringData: text("triggering_data"), // JSON: What data prompted this adjustment
  expectedImprovement: text("expected_improvement"),
  
  // Implementation
  implementedAt: timestamp("implemented_at").defaultNow().notNull(),
  isActive: varchar("is_active", { length: 50 }),
  
  // Results
  measuredImprovement: text("measured_improvement"), // JSON: Actual results
  wasSuccessful: varchar("was_successful", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type StrategyAdjustment = typeof strategyAdjustments.$inferSelect;
export type InsertStrategyAdjustment = typeof strategyAdjustments.$inferInsert;
