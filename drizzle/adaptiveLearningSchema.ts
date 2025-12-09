import { pgTable, int, varchar, text, timestamp, pgEnum, serial } from "drizzle-orm/pg-core";
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
  techniqueName: varchar("techniqueName", { length: 255 }).notNull(),
  techniqueCategory: varchar("techniqueCategory", { length: 100 }).notNull(), // CBT, DBT, mindfulness, etc.
  techniqueDescription: text("techniqueDescription"),
  
  // Context
  problemType: varchar("problemType", { length: 255 }).notNull(), // anxiety, depression, stress, etc.
  clientDemographic: text("clientDemographic"), // JSON: age range, background, etc.
  
  // Effectiveness metrics
  timesRecommended: integer("timesRecommended").default(0).notNull(),
  timesUsed: integer("timesUsed").default(0).notNull(),
  successCount: integer("successCount").default(0).notNull(),
  failureCount: integer("failureCount").default(0).notNull(),
  averageRating: integer("averageRating"), // 1-10 scale
  
  // Learning data
  lastRecommended: timestamp("lastRecommended"),
  confidenceScore: integer("confidenceScore").default(50).notNull(), // 0-100, increases with data
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
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
  patternName: varchar("patternName", { length: 255 }).notNull(),
  patternDescription: text("patternDescription").notNull(),
  patternType: varchar("patternType", { length: 100 }).notNull(), // trigger, coping, emotional, behavioral
  
  // Frequency
  occurrenceCount: integer("occurrenceCount").default(1).notNull(),
  affectedClientCount: integer("affectedClientCount").default(1).notNull(),
  
  // Associated data
  commonTriggers: text("commonTriggers"), // JSON array
  effectiveSolutions: text("effectiveSolutions"), // JSON array
  relatedPatterns: text("relatedPatterns"), // JSON array of pattern IDs
  
  // Learning status
  isValidated: pgEnum("isValidated", ["true", "false"]).default("false").notNull(),
  confidenceScore: integer("confidenceScore").default(50).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientPattern = typeof clientPatterns.$inferSelect;
export type InsertClientPattern = typeof clientPatterns.$inferInsert;

/**
 * Client Feedback on Recommendations
 * Track whether AI recommendations actually helped
 */
export const recommendationFeedback = pgTable("recommendationFeedback", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  
  // Recommendation details
  recommendationType: varchar("recommendationType", { length: 100 }).notNull(), // technique, strategy, habit, etc.
  recommendationContent: text("recommendationContent").notNull(),
  context: text("context"), // What situation prompted this recommendation
  
  // Feedback
  wasUsed: pgEnum("wasUsed", ["yes", "no"]).notNull(),
  wasHelpful: pgEnum("wasHelpful", ["yes", "no", "somewhat"]),
  rating: integer("rating"), // 1-10 scale
  feedbackNotes: text("feedbackNotes"),
  
  // Outcome tracking
  problemResolved: pgEnum("problemResolved", ["yes", "no", "partially"]),
  timeToResolution: integer("timeToResolution"), // minutes or hours
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RecommendationFeedback = typeof recommendationFeedback.$inferSelect;
export type InsertRecommendationFeedback = typeof recommendationFeedback.$inferInsert;

/**
 * Outcome Tracking
 * Did the coaching actually improve their life?
 */
export const adaptiveOutcomeTracking = pgTable("adaptiveOutcomeTracking", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  
  // Baseline (when they started)
  baselineDate: timestamp("baselineDate").notNull(),
  baselineEmotionalState: integer("baselineEmotionalState").notNull(), // 1-10
  baselineFunctioning: integer("baselineFunctioning").notNull(), // 1-10
  baselineGoals: text("baselineGoals"), // JSON array
  
  // Current state
  currentEmotionalState: integer("currentEmotionalState"),
  currentFunctioning: integer("currentFunctioning"),
  goalsAchieved: text("goalsAchieved"), // JSON array
  
  // Improvement metrics
  emotionalImprovement: integer("emotionalImprovement"), // Calculated: current - baseline
  functioningImprovement: integer("functioningImprovement"),
  daysInCoaching: integer("daysInCoaching"),
  
  // Specific improvements
  sleepImproved: pgEnum("sleepImproved", ["yes", "no", "unknown"]),
  relationshipsImproved: pgEnum("relationshipsImproved", ["yes", "no", "unknown"]),
  workPerformanceImproved: pgEnum("workPerformanceImproved", ["yes", "no", "unknown"]),
  physicalHealthImproved: pgEnum("physicalHealthImproved", ["yes", "no", "unknown"]),
  
  // Attribution
  attributedToCoaching: pgEnum("attributedToCoaching", ["yes", "no", "partially"]),
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
export const trendDetection = pgTable("trendDetection", {
  id: serial("id").primaryKey(),
  
  // Trend details
  trendName: varchar("trendName", { length: 255 }).notNull(),
  trendDescription: text("trendDescription").notNull(),
  trendCategory: varchar("trendCategory", { length: 100 }).notNull(), // struggle, success, pattern, etc.
  
  // Statistics
  affectedPercentage: integer("affectedPercentage").notNull(), // 0-100
  totalClientsAnalyzed: integer("totalClientsAnalyzed").notNull(),
  affectedClientCount: integer("affectedClientCount").notNull(),
  
  // Recommendations
  suggestedContent: text("suggestedContent"), // New tools/content to create
  suggestedApproach: text("suggestedApproach"), // How to address this trend
  
  // Status
  isActive: pgEnum("isActive", ["true", "false"]).default("true").notNull(),
  isAddressed: pgEnum("isAddressed", ["true", "false"]).default("false").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
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
  adjustmentType: varchar("adjustmentType", { length: 100 }).notNull(), // technique_priority, approach_change, etc.
  adjustmentDescription: text("adjustmentDescription").notNull(),
  
  // Reason
  triggeringData: text("triggeringData"), // JSON: What data prompted this adjustment
  expectedImprovement: text("expectedImprovement"),
  
  // Implementation
  implementedAt: timestamp("implementedAt").defaultNow().notNull(),
  isActive: pgEnum("isActive", ["true", "false"]).default("true").notNull(),
  
  // Results
  measuredImprovement: text("measuredImprovement"), // JSON: Actual results
  wasSuccessful: pgEnum("wasSuccessful", ["yes", "no", "unknown"]),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StrategyAdjustment = typeof strategyAdjustments.$inferSelect;
export type InsertStrategyAdjustment = typeof strategyAdjustments.$inferInsert;
