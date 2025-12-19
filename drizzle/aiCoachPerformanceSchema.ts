/**
 * AI COACH PERFORMANCE TRACKING SCHEMA
 * 
 * Tracks performance metrics for each AI coach to understand:
 * - Which coaches are most effective
 * - What techniques lead to breakthroughs
 * - Why some coaches outperform others
 * - How to continuously improve
 */

import { pgTable, serial, text, timestamp, integer, real, jsonb, boolean } from "drizzle-orm/pg-core";

/**
 * AI Coach Sessions - Detailed tracking of each coaching session
 */
export const aiCoachSessions = pgTable("ai_coach_sessions", {
  id: serial("id").primaryKey(),
  
  // Session identification
  sessionId: text("session_id").notNull().unique(), // UUID for the session
  coachType: text("coach_type").notNull(), // 'sage', 'alex', 'jordan', 'morgan', 'sam', 'memphis'
  sessionMode: text("session_mode"), // 'speaker_training', 'interview_prep', 'coaching_practice', 'singing', 'compliance', 'chat'
  clientId: integer("client_id"),
  userId: integer("user_id"),
  
  // Timing
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
  
  // Engagement metrics
  messageCount: integer("message_count").default(0),
  clientMessageCount: integer("client_message_count").default(0),
  coachMessageCount: integer("coach_message_count").default(0),
  averageResponseTime: real("average_response_time"), // seconds
  
  // Session quality
  sessionCompleted: boolean("session_completed").default(false),
  clientInitiatedEnd: boolean("client_initiated_end").default(false), // Did client end or abandon?
  
  // Emotional journey
  startingMood: text("starting_mood"), // 'positive', 'neutral', 'negative', 'anxious', 'excited'
  endingMood: text("ending_mood"),
  moodImprovement: real("mood_improvement"), // -1 to +1 scale
  emotionalPeaks: jsonb("emotional_peaks"), // Array of emotional high/low points
  
  // Breakthrough tracking
  breakthroughMoments: jsonb("breakthrough_moments"), // Array of breakthrough descriptions
  breakthroughCount: integer("breakthrough_count").default(0),
  
  // Techniques used
  techniquesUsed: jsonb("techniques_used"), // Array of technique names
  mostEffectiveTechnique: text("most_effective_technique"),
  
  // Client feedback (if provided)
  clientRating: integer("client_rating"), // 1-5 stars
  clientFeedback: text("client_feedback"),
  wouldRecommend: boolean("would_recommend"),
  
  // What worked / didn't work
  whatWorked: jsonb("what_worked"), // Array of things that resonated
  whatDidntWork: jsonb("what_didnt_work"), // Array of things that fell flat
  
  // Bonding indicators
  rapportLevel: text("rapport_level"), // 'low', 'medium', 'high', 'exceptional'
  trustIndicators: jsonb("trust_indicators"), // Signs of trust building
  connectionMoments: jsonb("connection_moments"), // Moments of genuine connection
  
  // Follow-up
  scheduledFollowUp: boolean("scheduled_follow_up").default(false),
  clientReturnedWithin7Days: boolean("client_returned_within_7_days"),
  
  // Transcript summary
  transcriptSummary: text("transcript_summary"),
  keyTopicsDiscussed: jsonb("key_topics_discussed"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * AI Coach Performance Aggregates - Daily/weekly/monthly rollups per coach
 */
export const aiCoachPerformanceAggregates = pgTable("ai_coach_performance_aggregates", {
  id: serial("id").primaryKey(),
  
  // Identification
  coachType: text("coach_type").notNull(), // 'sage', 'alex', 'jordan', 'morgan', 'sam', 'memphis'
  periodType: text("period_type").notNull(), // 'daily', 'weekly', 'monthly'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Volume metrics
  totalSessions: integer("total_sessions").default(0),
  completedSessions: integer("completed_sessions").default(0),
  abandonedSessions: integer("abandoned_sessions").default(0),
  completionRate: real("completion_rate"), // percentage
  
  // Engagement metrics
  totalMessages: integer("total_messages").default(0),
  avgSessionDuration: real("avg_session_duration"), // seconds
  avgMessagesPerSession: real("avg_messages_per_session"),
  
  // Quality metrics
  avgClientRating: real("avg_client_rating"), // 1-5
  totalRatings: integer("total_ratings").default(0),
  recommendationRate: real("recommendation_rate"), // percentage who would recommend
  
  // Effectiveness metrics
  totalBreakthroughs: integer("total_breakthroughs").default(0),
  avgBreakthroughsPerSession: real("avg_breakthroughs_per_session"),
  avgMoodImprovement: real("avg_mood_improvement"), // -1 to +1
  
  // Retention metrics
  uniqueClients: integer("unique_clients").default(0),
  returningClients: integer("returning_clients").default(0),
  retentionRate: real("retention_rate"), // percentage
  
  // Top performing techniques
  topTechniques: jsonb("top_techniques"), // Array of {technique, count, avgRating}
  
  // Common issues
  commonChallenges: jsonb("common_challenges"), // Array of things that didn't work
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * AI Coach Technique Effectiveness - Track which techniques work best
 */
export const aiCoachTechniqueEffectiveness = pgTable("ai_coach_technique_effectiveness", {
  id: serial("id").primaryKey(),
  
  // Identification
  coachType: text("coach_type").notNull(),
  techniqueName: text("technique_name").notNull(), // e.g., 'linguistic_mirroring', 'permission_ask', 'name_magic'
  
  // Usage stats
  timesUsed: integer("times_used").default(0),
  
  // Effectiveness metrics
  avgClientRatingWhenUsed: real("avg_client_rating_when_used"),
  breakthroughCorrelation: real("breakthrough_correlation"), // How often breakthroughs happen when this technique is used
  moodImprovementCorrelation: real("mood_improvement_correlation"),
  
  // Context
  bestUsedFor: jsonb("best_used_for"), // Array of situations where this works best
  avoidWhen: jsonb("avoid_when"), // Array of situations to avoid this technique
  
  // Examples
  successExamples: jsonb("success_examples"), // Array of anonymized success stories
  failureExamples: jsonb("failure_examples"), // Array of when it didn't work
  
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

/**
 * AI Coach Comparison Insights - Why some coaches outperform others
 */
export const aiCoachComparisonInsights = pgTable("ai_coach_comparison_insights", {
  id: serial("id").primaryKey(),
  
  // Comparison period
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Rankings
  overallRanking: jsonb("overall_ranking"), // Array of {coachType, score, rank}
  ratingRanking: jsonb("rating_ranking"),
  retentionRanking: jsonb("retention_ranking"),
  breakthroughRanking: jsonb("breakthrough_ranking"),
  
  // Key differentiators
  topPerformerInsights: jsonb("top_performer_insights"), // What the best coach does differently
  improvementOpportunities: jsonb("improvement_opportunities"), // What underperformers could learn
  
  // Specific comparisons
  coachComparisons: jsonb("coach_comparisons"), // Array of {coach1, coach2, differences}
  
  // Recommendations
  recommendations: jsonb("recommendations"), // Array of actionable improvements
  
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

/**
 * AI Coach Evolution Log - Track how coaches improve over time
 */
export const aiCoachEvolutionLog = pgTable("ai_coach_evolution_log", {
  id: serial("id").primaryKey(),
  
  // Identification
  coachType: text("coach_type").notNull(),
  
  // Change tracking
  changeType: text("change_type").notNull(), // 'prompt_update', 'technique_added', 'technique_removed', 'personality_tweak'
  changeDescription: text("change_description").notNull(),
  changeMadeBy: text("change_made_by"), // 'system', 'admin', 'ai_optimization'
  
  // Before/after metrics
  metricsBefore: jsonb("metrics_before"), // Snapshot of key metrics before change
  metricsAfter: jsonb("metrics_after"), // Snapshot after (filled in later)
  
  // Impact assessment
  impactAssessment: text("impact_assessment"), // 'positive', 'negative', 'neutral', 'pending'
  impactDetails: text("impact_details"),
  
  // Rollback info
  canRollback: boolean("can_rollback").default(true),
  rolledBack: boolean("rolled_back").default(false),
  rollbackReason: text("rollback_reason"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
