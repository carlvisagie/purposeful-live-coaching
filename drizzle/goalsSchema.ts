/**
 * GOAL SETTING & ACHIEVEMENT SYSTEM
 * Evidence-based approach using Goal-Setting Theory, Implementation Science, and Achievement Psychology
 * Research sources: Edwin Locke & Gary Latham (goal-setting theory), Gabriele Oettingen (WOOP),
 * Peter Gollwitzer (implementation intentions), Angela Duckworth (grit), Carol Dweck (growth mindset),
 * Heidi Grant Halvorson (goal achievement), James Clear (systems vs goals), Charles Duhigg (goal frameworks)
 * 
 * CORE PRINCIPLES:
 * 1. Specific > Vague (SMART goals)
 * 2. Process > Outcome (systems thinking)
 * 3. Implementation Intentions (if-then planning)
 * 4. Mental Contrasting (WOOP method)
 * 5. Progress Tracking (what gets measured gets done)
 * 6. Identity-Based Goals (who you're becoming)
 * 
 * GOAL FRAMEWORKS SUPPORTED:
 * - SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
 * - OKRs (Objectives & Key Results)
 * - WOOP (Wish, Outcome, Obstacle, Plan)
 * - Implementation Intentions (if-then planning)
 * - Habit-Based Goals (systems approach)
 * - Identity-Based Goals (I am X type of person)
 * 
 * GOAL TYPES:
 * - Outcome goals (what you want to achieve)
 * - Process goals (what you'll do)
 * - Performance goals (standards to meet)
 * - Learning goals (skills to acquire)
 * - Avoidance goals (what to stop doing)
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Identifies which goal types you achieve most
 * - Predicts goal success probability
 * - Learns optimal goal difficulty for you
 * - Suggests accountability mechanisms
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Goal Profiles
export const goalProfiles = pgTable("goal_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Achievement Stats
  totalGoalsSet: integer("total_goals_set").default(0),
  totalGoalsAchieved: integer("total_goals_achieved").default(0),
  totalGoalsAbandoned: integer("total_goals_abandoned").default(0),
  achievementRate: decimal("achievement_rate", { precision: 5, scale: 2 }), // %
  
  // Goal-Setting Style
  preferredFramework: varchar("preferred_framework", { length: 50 }),
  
  // Optimal Parameters (Self-Learning)
  optimalGoalDifficulty: integer("optimal_goal_difficulty"), // 1-10
  optimalTimeframe: varchar("optimal_timeframe", { length: 100 }), // "30 days", "90 days", etc.
  optimalGoalCount: integer("optimal_goal_count"), // How many concurrent goals?
  
  // Motivation Type
  motivationType: varchar("motivation_type", { length: 50 }),
  
  // Accountability Preferences
  needsAccountability: boolean("needs_accountability").default(false),
  preferredAccountabilityType: varchar("preferred_accountability_type", { length: 50 }),
  
  // Success Patterns
  successPatterns: text("success_patterns"), // JSON: what leads to success for this user
  failurePatterns: text("failure_patterns"), // JSON: what leads to failure
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Goals
export const goals = pgTable("goals", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Goal Details
  goalName: varchar("goal_name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Goal Type
  goalType: varchar("goal_type", { length: 50 }),
  
  // Framework
  framework: varchar("framework", { length: 50 }),
  
  // SMART Criteria
  specific: boolean("specific").default(false), // Is it specific?
  measurable: boolean("measurable").default(false), // Can it be measured?
  achievable: boolean("achievable").default(false), // Is it realistic?
  relevant: boolean("relevant").default(false), // Does it matter?
  timeBound: boolean("time_bound").default(false), // Does it have a deadline?
  
  // Category
  category: varchar("category", { length: 50 }),
  
  // Difficulty
  difficulty: integer("difficulty"), // 1-10
  
  // Timeline
  startDate: timestamp("start_date"),
  targetDate: timestamp("target_date"),
  
  // Measurement
  metricType: varchar("metric_type", { length: 50 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  targetValue: decimal("target_value", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 50 }), // kg, %, hours, etc.
  
  // Progress
  progressPercent: decimal("progress_percent", { precision: 5, scale: 2 }), // 0-100
  
  // Status
  status: varchar("status", { length: 50 }),
  
  // Priority
  priority: varchar("priority", { length: 50 }),
  
  // Visibility
  isPublic: boolean("is_public").default(false), // Share with community?
  
  // Related
  relatedHabitId: varchar("related_habit_id", { length: 255 }), // Link to habit
  relatedGoalId: varchar("related_goal_id", { length: 255 }), // Parent/child goals
  
  // Completion
  completedAt: timestamp("completed_at"),
  abandonedAt: timestamp("abandoned_at"),
  abandonReason: text("abandon_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OKRs (Objectives & Key Results)
export const okrs = pgTable("okrs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Objective (the goal)
  objective: text("objective").notNull(),
  
  // Time Period
  timePeriod: varchar("time_period", { length: 50 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  // Overall Progress
  overallProgress: decimal("overall_progress", { precision: 5, scale: 2 }), // 0-100
  
  // Status
  status: varchar("status", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Key Results
export const keyResults = pgTable("key_results", {
  id: varchar("id", { length: 255 }).primaryKey(),
  okrId: varchar("okr_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Key Result Details
  keyResult: text("key_result").notNull(),
  
  // Measurement
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  targetValue: decimal("target_value", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 50 }),
  
  // Progress
  progressPercent: decimal("progress_percent", { precision: 5, scale: 2 }), // 0-100
  
  // Status
  status: varchar("status", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// WOOP Plans (Mental Contrasting)
export const woopPlans = pgTable("woop_plans", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Wish
  wish: text("wish").notNull(), // What do you want?
  
  // Outcome
  outcome: text("outcome").notNull(), // What's the best outcome?
  outcomeVisualization: text("outcome_visualization"), // Detailed visualization
  
  // Obstacle
  obstacle: text("obstacle").notNull(), // What will get in the way?
  obstacleAnticipation: text("obstacle_anticipation"), // How likely is this obstacle?
  
  // Plan
  plan: text("plan").notNull(), // If obstacle occurs, then I will...
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Implementation Intentions (If-Then Plans)
export const implementationIntentions = pgTable("implementation_intentions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // If-Then Statement
  ifCondition: text("if_condition").notNull(), // If [situation]...
  thenAction: text("then_action").notNull(), // Then I will [action]...
  
  // Type
  intentionType: varchar("intention_type", { length: 50 }),
  
  // Effectiveness
  timesTriggered: integer("times_triggered").default(0),
  timesExecuted: integer("times_executed").default(0),
  executionRate: decimal("execution_rate", { precision: 5, scale: 2 }), // %
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Goal Milestones
export const goalMilestones = pgTable("goal_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Milestone Details
  milestoneName: varchar("milestone_name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Target
  targetValue: decimal("target_value", { precision: 10, scale: 2 }),
  targetDate: timestamp("target_date"),
  
  // Progress
  achieved: boolean("achieved").default(false),
  achievedAt: timestamp("achieved_at"),
  
  // Order
  sequenceOrder: integer("sequence_order"), // 1st milestone, 2nd, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Goal Progress Logs
export const goalProgressLogs = pgTable("goal_progress_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Progress Update
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).notNull(),
  progressPercent: decimal("progress_percent", { precision: 5, scale: 2 }),
  
  // Context
  notes: text("notes"),
  
  // Momentum
  momentum: varchar("momentum", { length: 50 }),
  
  logDate: timestamp("log_date").defaultNow(),
});

// Goal Obstacles
export const goalObstacles = pgTable("goal_obstacles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Obstacle Details
  obstacleName: varchar("obstacle_name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Type
  obstacleType: varchar("obstacle_type", { length: 50 }),
  
  // Severity
  severity: integer("severity"), // 1-10
  
  // Frequency
  occurrenceCount: integer("occurrence_count").default(0),
  lastOccurrence: timestamp("last_occurrence"),
  
  // Solution
  solution: text("solution"), // How to overcome this
  solutionEffective: boolean("solution_effective"),
  
  // Status
  overcome: boolean("overcome").default(false),
  overcameAt: timestamp("overcame_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Goal Accountability
export const goalAccountability = pgTable("goal_accountability", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Accountability Type
  accountabilityType: varchar("accountability_type", { length: 50 }),
  
  // Partner (if applicable)
  partnerId: varchar("partner_id", { length: 255 }),
  
  // Check-In Frequency
  checkInFrequency: varchar("check_in_frequency", { length: 50 }),
  
  // Last Check-In
  lastCheckIn: timestamp("last_check_in"),
  nextCheckIn: timestamp("next_check_in"),
  
  // Effectiveness
  adherenceRate: decimal("adherence_rate", { precision: 5, scale: 2 }), // % of check-ins completed
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Goal Reflections
export const goalReflections = pgTable("goal_reflections", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Reflection Type
  reflectionType: varchar("reflection_type", { length: 50 }),
  
  // Reflection Questions
  whatWorked: text("what_worked"),
  whatDidntWork: text("what_didnt_work"),
  lessonsLearned: text("lessons_learned"),
  adjustmentsNeeded: text("adjustments_needed"),
  
  // Mood
  confidenceLevel: integer("confidence_level"), // 1-10
  motivationLevel: integer("motivation_level"), // 1-10
  
  reflectionDate: timestamp("reflection_date").defaultNow(),
});

// Goal Predictions (AI-Powered)
export const goalPredictions = pgTable("goal_predictions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  goalId: varchar("goal_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Prediction Type
  predictionType: varchar("prediction_type", { length: 50 }),
  
  // Prediction
  prediction: text("prediction"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // %
  
  // Contributing Factors
  factors: text("factors"), // JSON: what influences this prediction
  
  // Recommendation
  recommendation: text("recommendation"),
  
  // Validation
  actualOutcome: text("actual_outcome"),
  predictionAccurate: boolean("prediction_accurate"),
  
  createdAt: timestamp("created_at").defaultNow(),
  validatedAt: timestamp("validated_at"),
});

// Goal Analytics (Self-Learning)
export const goalAnalytics = pgTable("goal_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Goal Type
  goalType: varchar("goal_type", { length: 100 }).notNull(),
  
  // Success Metrics
  avgAchievementRate: decimal("avg_achievement_rate", { precision: 5, scale: 2 }), // %
  avgTimeToCompletion: integer("avg_time_to_completion"), // days
  avgAbandonmentRate: decimal("avg_abandonment_rate", { precision: 5, scale: 2 }), // %
  
  // Optimal Parameters
  optimalDifficulty: integer("optimal_difficulty"), // 1-10
  optimalTimeframe: integer("optimal_timeframe"), // days
  optimalAccountabilityType: varchar("optimal_accountability_type", { length: 100 }),
  
  // Success Factors
  successFactors: text("success_factors"), // JSON: what predicts success
  failureFactors: text("failure_factors"), // JSON: what predicts failure
  
  // Sample Size
  userCount: integer("user_count"),
  totalGoals: integer("total_goals"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
