/**
 * HABIT FORMATION SYSTEM
 * Evidence-based approach using Habit Science, Behavioral Psychology, and Language Patterns
 * Research sources: James Clear (Atomic Habits), BJ Fogg (Tiny Habits), Charles Duhigg (Power of Habit),
 * Wendy Wood (habit automaticity), Peter Gollwitzer (implementation intentions),
 * Jerry Bresser (language patterns), NLP (reframing), Marshall Rosenberg (NVC),
 * Byron Katie (The Work), Carol Dweck (growth mindset language)
 * 
 * CORE PRINCIPLES:
 * 1. Identity-Based Habits (who you are, not what you do)
 * 2. Tiny Habits (start ridiculously small)
 * 3. Habit Stacking (anchor to existing habits)
 * 4. Cue-Routine-Reward (habit loop)
 * 5. Implementation Intentions (if-then planning)
 * 6. Environment Design (make it obvious/easy)
 * 7. Language Patterns (empowering self-talk)
 * 8. Spaced Repetition (memory integration from Memory Engine)
 * 
 * LANGUAGE PATTERN INTEGRATION:
 * - Limiting language → Empowering language
 * - Fixed mindset → Growth mindset
 * - "I can't" → "I'm learning to"
 * - "I have to" → "I choose to"
 * - "I'm bad at" → "I'm becoming better at"
 * 
 * SELF-LEARNING CAPABILITIES:
 * - Tracks which habit formation strategies work best per user
 * - Identifies optimal cue-routine-reward combinations
 * - Learns ideal habit stack sequences
 * - Predicts habit sustainability based on patterns
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Habit Profiles
export const habitProfiles = pgTable("habit_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Current State
  totalActiveHabits: integer("total_active_habits").default(0),
  totalMasteredHabits: integer("total_mastered_habits").default(0),
  longestStreak: integer("longest_streak").default(0),
  
  // Preferences
  preferredHabitTime: varchar("preferred_habit_time", { length: 50 }),
  
  // Self-Learning Data
  mostSuccessfulCues: text("most_successful_cues"), // JSON: which cues lead to habit completion
  optimalHabitStackSequence: text("optimal_habit_stack_sequence"), // JSON: best order for habits
  personalSuccessFactors: text("personal_success_factors"), // JSON: what makes habits stick for this user
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Habit Formation Habits (Advanced)
export const habitFormationHabits = pgTable("habit_formation_habits", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Habit Details
  habitName: varchar("habit_name", { length: 255 }).notNull(),
  habitDescription: text("habit_description"),
  
  // Identity Connection (James Clear)
  identityStatement: varchar("identity_statement", { length: 255 }), // "I am a person who..."
  
  // Habit Type
  habitType: varchar("habit_type", { length: 50 }),
  
  // Category
  category: varchar("category", { length: 50 }),
  
  // Tiny Habits Method (BJ Fogg)
  tinyVersion: varchar("tiny_version", { length: 255 }), // Ridiculously small version
  fullVersion: varchar("full_version", { length: 255 }), // Full habit once established
  
  // Habit Loop (Charles Duhigg)
  cue: varchar("cue", { length: 255 }).notNull(), // What triggers the habit?
  cueType: varchar("cue_type", { length: 50 }),
  routine: varchar("routine", { length: 255 }).notNull(), // The habit itself
  reward: varchar("reward", { length: 255 }), // What you get from it
  
  // Habit Stacking (James Clear)
  anchorHabit: varchar("anchor_habit", { length: 255 }), // Existing habit to stack onto
  stackingFormula: varchar("stacking_formula", { length: 255 }), // "After [anchor], I will [new habit]"
  
  // Implementation Intention (Peter Gollwitzer)
  implementationIntention: varchar("implementation_intention", { length: 255 }), // "If [situation], then I will [action]"
  
  // Environment Design
  environmentChanges: text("environment_changes"), // JSON: how to make it obvious/easy
  
  // Frequency
  targetFrequency: varchar("target_frequency", { length: 50 }),
  customFrequency: text("custom_frequency"), // JSON: specific days
  
  // Duration
  targetDuration: integer("target_duration"), // minutes (if applicable)
  
  // Difficulty
  difficulty: integer("difficulty"), // 1-10
  
  // Progress
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalCompletions: integer("total_completions").default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }), // %
  
  // Automaticity (Wendy Wood)
  automaticityLevel: integer("automaticity_level"), // 1-10: How automatic is this habit?
  
  // Status
  status: varchar("status", { length: 50 }),
  
  // Dates
  startDate: timestamp("start_date").notNull(),
  masteredDate: timestamp("mastered_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Habit Tracking
export const habitTracking = pgTable("habit_tracking", {
  id: varchar("id", { length: 255 }).primaryKey(),
  habitId: varchar("habit_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  trackingDate: timestamp("tracking_date").notNull(),
  
  // Completion
  completed: boolean("completed").notNull(),
  
  // Details
  duration: integer("duration"), // minutes (if applicable)
  intensity: integer("intensity"), // 1-10 (if applicable)
  
  // Context
  timeOfDay: varchar("time_of_day", { length: 50 }),
  location: varchar("location", { length: 255 }),
  
  // Cue Recognition
  cuePresent: boolean("cue_present"), // Was the cue there?
  cueEffectiveness: integer("cue_effectiveness"), // 1-10: How well did the cue work?
  
  // Resistance & Ease
  resistanceLevel: integer("resistance_level"), // 1-10: How hard was it to start?
  easeOfCompletion: integer("ease_of_completion"), // 1-10: How easy once started?
  
  // Reward
  rewardExperienced: boolean("reward_experienced"),
  rewardSatisfaction: integer("reward_satisfaction"), // 1-10
  
  // Automaticity
  feltAutomatic: boolean("felt_automatic"), // Did it feel automatic?
  
  // Mood & Energy
  moodBefore: varchar("mood_before", { length: 100 }),
  moodAfter: varchar("mood_after", { length: 100 }),
  energyBefore: integer("energy_before"), // 1-10
  energyAfter: integer("energy_after"), // 1-10
  
  // Notes
  notes: text("notes"),
  challenges: text("challenges"),
  wins: text("wins"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Language Patterns (Self-Talk Tracking)
export const languagePatterns = pgTable("language_patterns", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Pattern Type
  patternType: varchar("pattern_type", { length: 50 }),
  
  // The Language
  originalStatement: text("original_statement"), // What you used to say
  reframedStatement: text("reframed_statement"), // New empowering version
  
  // Context
  context: varchar("context", { length: 255 }), // When does this come up?
  relatedHabit: varchar("related_habit_id", { length: 255 }), // Which habit is this about?
  
  // Belief Level
  beliefInOld: integer("belief_in_old"), // 1-10: How much do you still believe the old statement?
  beliefInNew: integer("belief_in_new"), // 1-10: How much do you believe the new statement?
  
  // Impact
  impactOnBehavior: integer("impact_on_behavior"), // 1-10
  
  // Status
  status: varchar("status", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Language Pattern Practice (Daily Reframing)
export const languagePatternPractice = pgTable("language_pattern_practice", {
  id: varchar("id", { length: 255 }).primaryKey(),
  patternId: varchar("pattern_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  practiceDate: timestamp("practice_date").notNull(),
  
  // What Happened
  situation: text("situation"), // When did the old pattern show up?
  
  // Caught Yourself?
  caughtOldPattern: boolean("caught_old_pattern"), // Did you notice yourself using limiting language?
  
  // Reframed?
  usedNewPattern: boolean("used_new_pattern"), // Did you use the empowering language?
  
  // Impact
  impactOnMood: integer("impact_on_mood"), // 1-10
  impactOnAction: integer("impact_on_action"), // 1-10
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Habit Obstacles & Solutions
export const habitObstacles = pgTable("habit_obstacles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  habitId: varchar("habit_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Obstacle
  obstacleDescription: text("obstacle_description").notNull(),
  obstacleType: varchar("obstacle_type", { length: 50 }),
  
  // Frequency
  frequency: varchar("frequency", { length: 50 }),
  
  // Solution (Implementation Intention)
  ifThenPlan: text("if_then_plan"), // "If [obstacle], then I will [solution]"
  
  // Effectiveness
  solutionEffectiveness: integer("solution_effectiveness"), // 1-10
  
  // Status
  resolved: boolean("resolved").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Habit Milestones
export const habitMilestones = pgTable("habit_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  habitId: varchar("habit_id", { length: 255 }).notNull(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  milestoneType: varchar("milestone_type", { length: 50 }),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  achievedDate: timestamp("achieved_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Habit Stacks (Sequences of Habits)
export const habitStacks = pgTable("habit_stacks", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  stackName: varchar("stack_name", { length: 255 }).notNull(),
  description: text("description"),
  
  // When
  timeOfDay: varchar("time_of_day", { length: 50 }),
  
  // Habits in Stack (ordered)
  habitSequence: text("habit_sequence"), // JSON array: ordered habit IDs
  
  // Total Duration
  estimatedDuration: integer("estimated_duration"), // minutes
  
  // Performance
  totalCompletions: integer("total_completions").default(0),
  currentStreak: integer("current_streak").default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }),
  
  // Status
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Weekly Habit Reviews
export const weeklyHabitReviews = pgTable("weekly_habit_reviews", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  weekStartDate: timestamp("week_start_date").notNull(),
  
  // Overall Performance
  overallSuccessRate: decimal("overall_success_rate", { precision: 5, scale: 2 }),
  totalHabitsCompleted: integer("total_habits_completed"),
  
  // Wins
  biggestWins: text("biggest_wins"), // JSON array
  habitsGettingEasier: text("habits_getting_easier"), // JSON: habit IDs
  
  // Challenges
  biggestChallenges: text("biggest_challenges"), // JSON array
  habitsStrugglingWith: text("habits_struggling_with"), // JSON: habit IDs
  
  // Language Patterns
  limitingLanguageCaught: integer("limiting_language_caught"), // How many times caught yourself
  empoweringLanguageUsed: integer("empowering_language_used"), // How many times used new patterns
  
  // Insights
  keyInsights: text("key_insights"),
  lessonsLearned: text("lessons_learned"),
  
  // Next Week
  adjustmentsPlanned: text("adjustments_planned"), // JSON array
  newHabitsToStart: text("new_habits_to_start"), // JSON array
  habitsToModify: text("habits_to_modify"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Habit Formation Analytics (Self-Learning)
export const habitFormationAnalytics = pgTable("habit_formation_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Strategy Effectiveness (aggregated)
  strategy: varchar("strategy", { length: 100 }).notNull(), // tiny_habits, stacking, implementation_intention, etc.
  habitCategory: varchar("habit_category", { length: 100 }),
  
  // Success Metrics
  avgSuccessRate: decimal("avg_success_rate", { precision: 5, scale: 2 }),
  avgTimeToAutomaticity: integer("avg_time_to_automaticity"), // days
  avgStreakLength: integer("avg_streak_length"),
  
  // Optimal Parameters
  optimalCueType: varchar("optimal_cue_type", { length: 100 }),
  optimalTimeOfDay: varchar("optimal_time_of_day", { length: 50 }),
  
  // User Segments
  mostEffectiveFor: text("most_effective_for"), // JSON: different user types
  
  // Sample Size
  habitCount: integer("habit_count"),
  userCount: integer("user_count"),
  
  lastCalculated: timestamp("last_calculated").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
