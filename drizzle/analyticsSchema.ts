/**
 * PROGRESS ANALYTICS & INSIGHTS
 * Evidence-based approach using Data Science, Behavioral Analytics, and Predictive Modeling
 * Research sources: Peter Drucker (what gets measured gets managed), Quantified Self movement,
 * N-of-1 trials (personalized experimentation), time series analysis, correlation vs causation research
 * 
 * CORE PRINCIPLES:
 * 1. Measure What Matters (not vanity metrics)
 * 2. Visualize Progress (charts, trends, patterns)
 * 3. Find Correlations (sleep → performance, etc.)
 * 4. Predict Outcomes (based on current trajectory)
 * 5. Actionable Insights (not just data dumps)
 * 6. Personalized Benchmarks (compare to YOUR baseline, not others)
 * 
 * ANALYTICS TYPES:
 * - Individual module analytics (habits, sleep, nutrition, etc.)
 * - Cross-module correlations (how areas affect each other)
 * - Trend analysis (are you improving?)
 * - Predictive analytics (where are you headed?)
 * - Comparative analytics (this week vs last week)
 * - Goal progress tracking
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Identifies personal success patterns
 * - Predicts optimal interventions
 * - Learns what insights drive action
 * - Personalizes dashboard priorities
 */

import { pgTable, varchar, text, int, timestamp, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";

// Analytics Profiles
export const analyticsProfiles = pgTable("analytics_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Dashboard Preferences
  preferredView: pgEnum("preferred_view", ["overview", "detailed", "minimal"]).default("overview"),
  preferredChartType: pgEnum("preferred_chart_type", ["line", "bar", "area", "mixed"]).default("line"),
  
  // Tracking Preferences
  trackingFrequency: pgEnum("tracking_frequency", ["daily", "weekly", "monthly"]),
  
  // Insights Preferences
  insightFrequency: pgEnum("insight_frequency", ["daily", "weekly", "monthly"]),
  insightTypes: text("insight_types"), // JSON: which types of insights to show
  
  // Self-Learning Data
  mostActionableInsights: text("most_actionable_insights"), // JSON: which insights led to action
  preferredMetrics: text("preferred_metrics"), // JSON: which metrics user checks most
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Snapshots (Overall Progress)
export const dailySnapshots = pgTable("daily_snapshots", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  snapshotDate: timestamp("snapshot_date").notNull(),
  
  // Overall Scores
  overallWellnessScore: integer("overall_wellness_score"), // 0-100
  physicalScore: integer("physical_score"), // 0-100
  mentalScore: integer("mental_score"), // 0-100
  emotionalScore: integer("emotional_score"), // 0-100
  spiritualScore: integer("spiritual_score"), // 0-100
  
  // Habit Completion
  habitsCompleted: integer("habits_completed"),
  habitsTotal: integer("habits_total"),
  habitCompletionRate: decimal("habit_completion_rate", { precision: 5, scale: 2 }), // %
  
  // Sleep
  sleepDuration: decimal("sleep_duration", { precision: 4, scale: 2 }), // hours
  sleepQuality: integer("sleep_quality"), // 1-10
  
  // Mood & Energy
  avgMood: integer("avg_mood"), // 1-10
  avgEnergy: integer("avg_energy"), // 1-10
  
  // Productivity
  productivityScore: integer("productivity_score"), // 0-100
  
  // Stress
  stressLevel: integer("stress_level"), // 1-10
  
  // Recovery
  recoveryScore: integer("recovery_score"), // 0-100
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Weekly Reports
export const weeklyReports = pgTable("weekly_reports", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  weekStartDate: timestamp("week_start_date").notNull(),
  
  // Overall Performance
  overallScore: integer("overall_score"), // 0-100
  scoreChange: decimal("score_change", { precision: 6, scale: 2 }), // % vs last week
  
  // Habits
  avgHabitCompletionRate: decimal("avg_habit_completion_rate", { precision: 5, scale: 2 }),
  habitsCompletionChange: decimal("habits_completion_change", { precision: 6, scale: 2 }), // % change
  
  // Sleep
  avgSleepDuration: decimal("avg_sleep_duration", { precision: 4, scale: 2 }),
  avgSleepQuality: decimal("avg_sleep_quality", { precision: 4, scale: 2 }),
  sleepConsistency: decimal("sleep_consistency", { precision: 5, scale: 2 }), // % (bedtime variance)
  
  // Mood & Energy
  avgMood: decimal("avg_mood", { precision: 4, scale: 2 }),
  avgEnergy: decimal("avg_energy", { precision: 4, scale: 2 }),
  moodStability: decimal("mood_stability", { precision: 5, scale: 2 }), // Low variance = stable
  
  // Goals
  goalsAchieved: integer("goals_achieved"),
  goalsInProgress: integer("goals_in_progress"),
  
  // Wins
  biggestWins: text("biggest_wins"), // JSON array
  
  // Challenges
  biggestChallenges: text("biggest_challenges"), // JSON array
  
  // Insights
  keyInsights: text("key_insights"), // JSON array
  
  // Recommendations
  recommendations: text("recommendations"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Monthly Reports
export const monthlyReports = pgTable("monthly_reports", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  monthStartDate: timestamp("month_start_date").notNull(),
  
  // Transformation Summary
  transformationScore: integer("transformation_score"), // 0-100
  
  // Habits
  habitsStarted: integer("habits_started"),
  habitsMastered: integer("habits_mastered"),
  habitsAbandoned: integer("habits_abandoned"),
  avgHabitSuccessRate: decimal("avg_habit_success_rate", { precision: 5, scale: 2 }),
  
  // Goals
  goalsSet: integer("goals_set"),
  goalsAchieved: integer("goals_achieved"),
  goalAchievementRate: decimal("goal_achievement_rate", { precision: 5, scale: 2 }),
  
  // Wellness Trends
  physicalTrend: pgEnum("physical_trend", ["improving", "stable", "declining"]),
  mentalTrend: pgEnum("mental_trend", ["improving", "stable", "declining"]),
  emotionalTrend: pgEnum("emotional_trend", ["improving", "stable", "declining"]),
  spiritualTrend: pgEnum("spiritual_trend", ["improving", "stable", "declining"]),
  
  // Community
  communityEngagement: integer("community_engagement"), // 0-100
  supportsGiven: integer("supports_given"),
  supportsReceived: integer("supports_received"),
  
  // Achievements
  achievementsUnlocked: integer("achievements_unlocked"),
  milestonesReached: integer("milestones_reached"),
  
  // Identity Shift
  identityShiftScore: integer("identity_shift_score"), // 0-100 (how much have you become who you want to be?)
  
  // Narrative Summary
  monthSummary: text("month_summary"), // AI-generated narrative
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Correlations (Cross-Module Insights)
export const correlations = pgTable("correlations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Variables
  variable1: varchar("variable1", { length: 255 }).notNull(), // e.g., "sleep_duration"
  variable2: varchar("variable2", { length: 255 }).notNull(), // e.g., "productivity_score"
  
  // Correlation Strength
  correlationCoefficient: decimal("correlation_coefficient", { precision: 4, scale: 3 }), // -1 to 1
  pValue: decimal("p_value", { precision: 6, scale: 5 }), // Statistical significance
  
  // Interpretation
  relationship: pgEnum("relationship", [
    "strong_positive",
    "moderate_positive",
    "weak_positive",
    "no_correlation",
    "weak_negative",
    "moderate_negative",
    "strong_negative"
  ]),
  
  // Insight
  insight: text("insight"), // Human-readable explanation
  actionable: boolean("actionable").default(false), // Can user do something with this?
  
  // Sample Size
  dataPoints: integer("data_points"),
  
  // Confidence
  confidenceLevel: decimal("confidence_level", { precision: 5, scale: 2 }), // %
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Predictions
export const predictions = pgTable("predictions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Prediction Type
  predictionType: pgEnum("prediction_type", [
    "goal_achievement", // Will you achieve this goal?
    "habit_sustainability", // Will this habit stick?
    "wellness_trajectory", // Where are you headed?
    "risk_assessment", // Risk of burnout, relapse, etc.
    "optimal_intervention" // What should you do next?
  ]).notNull(),
  
  // Target
  targetId: varchar("target_id", { length: 255 }), // Goal ID, habit ID, etc.
  targetName: varchar("target_name", { length: 255 }),
  
  // Prediction
  prediction: text("prediction"), // The actual prediction
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // %
  
  // Timeline
  timeframe: varchar("timeframe", { length: 100 }), // "in 30 days", "by end of year"
  
  // Factors
  keyFactors: text("key_factors"), // JSON: what influences this prediction
  
  // Recommendation
  recommendation: text("recommendation"), // What to do about it
  
  // Validation
  actualOutcome: text("actual_outcome"), // What actually happened
  predictionAccurate: boolean("prediction_accurate"),
  
  createdAt: timestamp("created_at").defaultNow(),
  validatedAt: timestamp("validated_at"),
});

// Insights (AI-Generated)
export const insights = pgTable("insights", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Insight Type
  insightType: pgEnum("insight_type", [
    "pattern_detected", // "You always sleep better after exercise"
    "correlation_found", // "Sleep affects your mood"
    "trend_alert", // "Your stress is increasing"
    "achievement_close", // "You're 90% to your goal"
    "recommendation", // "Try this intervention"
    "warning", // "You're at risk of burnout"
    "celebration" // "You've improved 50%!"
  ]).notNull(),
  
  // Content
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Supporting Data
  supportingData: text("supporting_data"), // JSON: charts, numbers, etc.
  
  // Actionability
  actionable: boolean("actionable").default(false),
  suggestedAction: text("suggested_action"),
  
  // Priority
  priority: pgEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  
  // User Response
  viewed: boolean("viewed").default(false),
  viewedAt: timestamp("viewed_at"),
  actionTaken: boolean("action_taken").default(false),
  actionTakenAt: timestamp("action_taken_at"),
  helpful: boolean("helpful"), // User feedback
  
  // Expiry
  expiresAt: timestamp("expires_at"), // Some insights are time-sensitive
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Progress Milestones (Auto-Detected)
export const progressMilestones = pgTable("progress_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Milestone Type
  milestoneType: pgEnum("milestone_type", [
    "first_improvement",
    "10_percent_improvement",
    "50_percent_improvement",
    "100_percent_improvement",
    "goal_halfway",
    "goal_75_percent",
    "goal_achieved",
    "consistency_milestone",
    "transformation_milestone"
  ]).notNull(),
  
  // Details
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Metric
  metric: varchar("metric", { length: 255 }), // What improved?
  baselineValue: decimal("baseline_value", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  improvementPercent: decimal("improvement_percent", { precision: 6, scale: 2 }),
  
  // Context
  relatedTo: varchar("related_to", { length: 255 }), // Module, goal, habit, etc.
  
  achievedAt: timestamp("achieved_at").defaultNow(),
});

// Comparative Analytics
export const comparativeAnalytics = pgTable("comparative_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Comparison Type
  comparisonType: pgEnum("comparison_type", [
    "week_over_week",
    "month_over_month",
    "quarter_over_quarter",
    "year_over_year",
    "best_week_vs_current",
    "worst_week_vs_current"
  ]).notNull(),
  
  // Metric
  metric: varchar("metric", { length: 255 }).notNull(),
  
  // Values
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  comparisonValue: decimal("comparison_value", { precision: 10, scale: 2 }),
  
  // Change
  absoluteChange: decimal("absolute_change", { precision: 10, scale: 2 }),
  percentChange: decimal("percent_change", { precision: 6, scale: 2 }),
  
  // Interpretation
  trend: pgEnum("trend", ["improving", "stable", "declining"]),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics Events (User Interactions)
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Event Type
  eventType: varchar("event_type", { length: 100 }).notNull(), // dashboard_viewed, insight_clicked, etc.
  
  // Event Data
  eventData: text("event_data"), // JSON: additional context
  
  // Session
  sessionId: varchar("session_id", { length: 255 }),
  
  eventTimestamp: timestamp("event_timestamp").defaultNow(),
});

// Analytics Self-Learning
export const analyticsLearning = pgTable("analytics_learning", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Insight Type Effectiveness
  insightType: varchar("insight_type", { length: 100 }).notNull(),
  
  // Engagement Metrics
  avgViewRate: decimal("avg_view_rate", { precision: 5, scale: 2 }), // %
  avgActionRate: decimal("avg_action_rate", { precision: 5, scale: 2 }), // % who took action
  avgHelpfulnessRating: decimal("avg_helpfulness_rating", { precision: 4, scale: 2 }), // 1-10
  
  // Impact Metrics
  avgBehaviorChange: decimal("avg_behavior_change", { precision: 5, scale: 2 }), // % improvement
  
  // Optimal Parameters
  optimalTiming: varchar("optimal_timing", { length: 100 }), // When to show this insight
  optimalFrequency: varchar("optimal_frequency", { length: 100 }),
  
  // User Segments
  mostEffectiveFor: text("most_effective_for"), // JSON: different user types
  
  // Sample Size
  userCount: integer("user_count"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
