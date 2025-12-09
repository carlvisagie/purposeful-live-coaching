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
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
  isValidated: varchar("isValidated", { length: 50 }),
  confidenceScore: integer("confidenceScore").default(50).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
  wasUsed: varchar("wasUsed", { length: 50 }),
  wasHelpful: varchar("wasHelpful", { length: 50 }),
  rating: integer("rating"), // 1-10 scale
  feedbackNotes: text("feedbackNotes"),
  
  // Outcome tracking
  problemResolved: varchar("problemResolved", { length: 50 }),
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
  sleepImproved: varchar("sleepImproved", { length: 50 }),
  relationshipsImproved: varchar("relationshipsImproved", { length: 50 }),
  workPerformanceImproved: varchar("workPerformanceImproved", { length: 50 }),
  physicalHealthImproved: varchar("physicalHealthImproved", { length: 50 }),
  
  // Attribution
  attributedToCoaching: varchar("attributedToCoaching", { length: 50 }),
  mostHelpfulAspect: text("mostHelpfulAspect"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
  isActive: varchar("isActive", { length: 50 }),
  isAddressed: varchar("isAddressed", { length: 50 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
  isActive: varchar("isActive", { length: 50 }),
  
  // Results
  measuredImprovement: text("measuredImprovement"), // JSON: Actual results
  wasSuccessful: varchar("wasSuccessful", { length: 50 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type StrategyAdjustment = typeof strategyAdjustments.$inferSelect;
export type InsertStrategyAdjustment = typeof strategyAdjustments.$inferInsert;
