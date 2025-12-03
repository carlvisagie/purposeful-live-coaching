import { mysqlTable, int, varchar, text, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { clients } from "./schema";

/**
 * Adaptive Learning Engine Schema
 * Platform learns from all clients and evolves coaching strategies
 */

/**
 * Technique Effectiveness Tracking
 * Track which coaching techniques work best for which situations
 */
export const techniqueEffectiveness = mysqlTable("techniqueEffectiveness", {
  id: int("id").autoincrement().primaryKey(),
  
  // Technique details
  techniqueName: varchar("techniqueName", { length: 255 }).notNull(),
  techniqueCategory: varchar("techniqueCategory", { length: 100 }).notNull(), // CBT, DBT, mindfulness, etc.
  techniqueDescription: text("techniqueDescription"),
  
  // Context
  problemType: varchar("problemType", { length: 255 }).notNull(), // anxiety, depression, stress, etc.
  clientDemographic: text("clientDemographic"), // JSON: age range, background, etc.
  
  // Effectiveness metrics
  timesRecommended: int("timesRecommended").default(0).notNull(),
  timesUsed: int("timesUsed").default(0).notNull(),
  successCount: int("successCount").default(0).notNull(),
  failureCount: int("failureCount").default(0).notNull(),
  averageRating: int("averageRating"), // 1-10 scale
  
  // Learning data
  lastRecommended: timestamp("lastRecommended"),
  confidenceScore: int("confidenceScore").default(50).notNull(), // 0-100, increases with data
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TechniqueEffectiveness = typeof techniqueEffectiveness.$inferSelect;
export type InsertTechniqueEffectiveness = typeof techniqueEffectiveness.$inferInsert;

/**
 * Client Pattern Detection
 * Identify patterns across all clients
 */
export const clientPatterns = mysqlTable("clientPatterns", {
  id: int("id").autoincrement().primaryKey(),
  
  // Pattern details
  patternName: varchar("patternName", { length: 255 }).notNull(),
  patternDescription: text("patternDescription").notNull(),
  patternType: varchar("patternType", { length: 100 }).notNull(), // trigger, coping, emotional, behavioral
  
  // Frequency
  occurrenceCount: int("occurrenceCount").default(1).notNull(),
  affectedClientCount: int("affectedClientCount").default(1).notNull(),
  
  // Associated data
  commonTriggers: text("commonTriggers"), // JSON array
  effectiveSolutions: text("effectiveSolutions"), // JSON array
  relatedPatterns: text("relatedPatterns"), // JSON array of pattern IDs
  
  // Learning status
  isValidated: mysqlEnum("isValidated", ["true", "false"]).default("false").notNull(),
  confidenceScore: int("confidenceScore").default(50).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientPattern = typeof clientPatterns.$inferSelect;
export type InsertClientPattern = typeof clientPatterns.$inferInsert;

/**
 * Client Feedback on Recommendations
 * Track whether AI recommendations actually helped
 */
export const recommendationFeedback = mysqlTable("recommendationFeedback", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  
  // Recommendation details
  recommendationType: varchar("recommendationType", { length: 100 }).notNull(), // technique, strategy, habit, etc.
  recommendationContent: text("recommendationContent").notNull(),
  context: text("context"), // What situation prompted this recommendation
  
  // Feedback
  wasUsed: mysqlEnum("wasUsed", ["yes", "no"]).notNull(),
  wasHelpful: mysqlEnum("wasHelpful", ["yes", "no", "somewhat"]),
  rating: int("rating"), // 1-10 scale
  feedbackNotes: text("feedbackNotes"),
  
  // Outcome tracking
  problemResolved: mysqlEnum("problemResolved", ["yes", "no", "partially"]),
  timeToResolution: int("timeToResolution"), // minutes or hours
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RecommendationFeedback = typeof recommendationFeedback.$inferSelect;
export type InsertRecommendationFeedback = typeof recommendationFeedback.$inferInsert;

/**
 * Outcome Tracking
 * Did the coaching actually improve their life?
 */
export const adaptiveOutcomeTracking = mysqlTable("adaptiveOutcomeTracking", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  
  // Baseline (when they started)
  baselineDate: timestamp("baselineDate").notNull(),
  baselineEmotionalState: int("baselineEmotionalState").notNull(), // 1-10
  baselineFunctioning: int("baselineFunctioning").notNull(), // 1-10
  baselineGoals: text("baselineGoals"), // JSON array
  
  // Current state
  currentEmotionalState: int("currentEmotionalState"),
  currentFunctioning: int("currentFunctioning"),
  goalsAchieved: text("goalsAchieved"), // JSON array
  
  // Improvement metrics
  emotionalImprovement: int("emotionalImprovement"), // Calculated: current - baseline
  functioningImprovement: int("functioningImprovement"),
  daysInCoaching: int("daysInCoaching"),
  
  // Specific improvements
  sleepImproved: mysqlEnum("sleepImproved", ["yes", "no", "unknown"]),
  relationshipsImproved: mysqlEnum("relationshipsImproved", ["yes", "no", "unknown"]),
  workPerformanceImproved: mysqlEnum("workPerformanceImproved", ["yes", "no", "unknown"]),
  physicalHealthImproved: mysqlEnum("physicalHealthImproved", ["yes", "no", "unknown"]),
  
  // Attribution
  attributedToCoaching: mysqlEnum("attributedToCoaching", ["yes", "no", "partially"]),
  mostHelpfulAspect: text("mostHelpfulAspect"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdaptiveOutcomeTracking = typeof adaptiveOutcomeTracking.$inferSelect;
export type InsertAdaptiveOutcomeTracking = typeof adaptiveOutcomeTracking.$inferInsert;

/**
 * Trend Detection
 * Platform notices "80% of clients struggle with X"
 */
export const trendDetection = mysqlTable("trendDetection", {
  id: int("id").autoincrement().primaryKey(),
  
  // Trend details
  trendName: varchar("trendName", { length: 255 }).notNull(),
  trendDescription: text("trendDescription").notNull(),
  trendCategory: varchar("trendCategory", { length: 100 }).notNull(), // struggle, success, pattern, etc.
  
  // Statistics
  affectedPercentage: int("affectedPercentage").notNull(), // 0-100
  totalClientsAnalyzed: int("totalClientsAnalyzed").notNull(),
  affectedClientCount: int("affectedClientCount").notNull(),
  
  // Recommendations
  suggestedContent: text("suggestedContent"), // New tools/content to create
  suggestedApproach: text("suggestedApproach"), // How to address this trend
  
  // Status
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  isAddressed: mysqlEnum("isAddressed", ["true", "false"]).default("false").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrendDetection = typeof trendDetection.$inferSelect;
export type InsertTrendDetection = typeof trendDetection.$inferInsert;

/**
 * Strategy Adjustments
 * AI automatically changes its approach based on what's working
 */
export const strategyAdjustments = mysqlTable("strategyAdjustments", {
  id: int("id").autoincrement().primaryKey(),
  
  // Adjustment details
  adjustmentType: varchar("adjustmentType", { length: 100 }).notNull(), // technique_priority, approach_change, etc.
  adjustmentDescription: text("adjustmentDescription").notNull(),
  
  // Reason
  triggeringData: text("triggeringData"), // JSON: What data prompted this adjustment
  expectedImprovement: text("expectedImprovement"),
  
  // Implementation
  implementedAt: timestamp("implementedAt").defaultNow().notNull(),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  
  // Results
  measuredImprovement: text("measuredImprovement"), // JSON: Actual results
  wasSuccessful: mysqlEnum("wasSuccessful", ["yes", "no", "unknown"]),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StrategyAdjustment = typeof strategyAdjustments.$inferSelect;
export type InsertStrategyAdjustment = typeof strategyAdjustments.$inferInsert;
