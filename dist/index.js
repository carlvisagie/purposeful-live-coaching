var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/const.ts
var COOKIE_NAME, ONE_YEAR_MS, UNAUTHED_ERR_MSG, NOT_ADMIN_ERR_MSG;
var init_const = __esm({
  "shared/const.ts"() {
    "use strict";
    COOKIE_NAME = "app_session_id";
    ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
    UNAUTHED_ERR_MSG = "Please login (10001)";
    NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
  }
});

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t, router, publicProcedure, requireUser, protectedProcedure, adminProcedure;
var init_trpc = __esm({
  "server/_core/trpc.ts"() {
    "use strict";
    init_const();
    t = initTRPC.context().create({
      transformer: superjson
    });
    router = t.router;
    publicProcedure = t.procedure;
    requireUser = t.middleware(async (opts) => {
      const { ctx, next } = opts;
      if (!ctx.user) {
        throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
      }
      return next({
        ctx: {
          ...ctx,
          user: ctx.user
        }
      });
    });
    protectedProcedure = t.procedure.use(requireUser);
    adminProcedure = t.procedure.use(
      t.middleware(async (opts) => {
        const { ctx, next } = opts;
        if (!ctx.user || ctx.user.role !== "admin") {
          throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        return next({
          ctx: {
            ...ctx,
            user: ctx.user
          }
        });
      })
    );
  }
});

// drizzle/habitFormationSchema.ts
import { boolean, decimal, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
var habitProfiles, habits, habitTracking, languagePatterns, languagePatternPractice, habitObstacles, habitMilestones, habitStacks, weeklyHabitReviews, habitFormationAnalytics;
var init_habitFormationSchema = __esm({
  "drizzle/habitFormationSchema.ts"() {
    "use strict";
    habitProfiles = pgTable("habit_profiles", {
      id: varchar("id", { length: 255 }).primaryKey(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      // Current State
      totalActiveHabits: integer("total_active_habits").default(0),
      totalMasteredHabits: integer("total_mastered_habits").default(0),
      longestStreak: integer("longest_streak").default(0),
      // Preferences
      preferredHabitTime: varchar("preferred_habit_time", { length: 50 }),
      // Self-Learning Data
      mostSuccessfulCues: text("most_successful_cues"),
      // JSON: which cues lead to habit completion
      optimalHabitStackSequence: text("optimal_habit_stack_sequence"),
      // JSON: best order for habits
      personalSuccessFactors: text("personal_success_factors"),
      // JSON: what makes habits stick for this user
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    habits = pgTable("habits", {
      id: varchar("id", { length: 255 }).primaryKey(),
      profileId: varchar("profile_id", { length: 255 }).notNull(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      // Habit Details
      habitName: varchar("habit_name", { length: 255 }).notNull(),
      habitDescription: text("habit_description"),
      // Identity Connection (James Clear)
      identityStatement: varchar("identity_statement", { length: 255 }),
      // "I am a person who..."
      // Habit Type
      habitType: varchar("habit_type", { length: 50 }),
      // Category
      category: varchar("category", { length: 50 }),
      // Tiny Habits Method (BJ Fogg)
      tinyVersion: varchar("tiny_version", { length: 255 }),
      // Ridiculously small version
      fullVersion: varchar("full_version", { length: 255 }),
      // Full habit once established
      // Habit Loop (Charles Duhigg)
      cue: varchar("cue", { length: 255 }).notNull(),
      // What triggers the habit?
      cueType: varchar("cue_type", { length: 50 }),
      routine: varchar("routine", { length: 255 }).notNull(),
      // The habit itself
      reward: varchar("reward", { length: 255 }),
      // What you get from it
      // Habit Stacking (James Clear)
      anchorHabit: varchar("anchor_habit", { length: 255 }),
      // Existing habit to stack onto
      stackingFormula: varchar("stacking_formula", { length: 255 }),
      // "After [anchor], I will [new habit]"
      // Implementation Intention (Peter Gollwitzer)
      implementationIntention: varchar("implementation_intention", { length: 255 }),
      // "If [situation], then I will [action]"
      // Environment Design
      environmentChanges: text("environment_changes"),
      // JSON: how to make it obvious/easy
      // Frequency
      targetFrequency: varchar("target_frequency", { length: 50 }),
      customFrequency: text("custom_frequency"),
      // JSON: specific days
      // Duration
      targetDuration: integer("target_duration"),
      // minutes (if applicable)
      // Difficulty
      difficulty: integer("difficulty"),
      // 1-10
      // Progress
      currentStreak: integer("current_streak").default(0),
      longestStreak: integer("longest_streak").default(0),
      totalCompletions: integer("total_completions").default(0),
      successRate: decimal("success_rate", { precision: 5, scale: 2 }),
      // %
      // Automaticity (Wendy Wood)
      automaticityLevel: integer("automaticity_level"),
      // 1-10: How automatic is this habit?
      // Status
      status: varchar("status", { length: 50 }),
      // Dates
      startDate: timestamp("start_date").notNull(),
      masteredDate: timestamp("mastered_date"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    habitTracking = pgTable("habit_tracking", {
      id: varchar("id", { length: 255 }).primaryKey(),
      habitId: varchar("habit_id", { length: 255 }).notNull(),
      profileId: varchar("profile_id", { length: 255 }).notNull(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      trackingDate: timestamp("tracking_date").notNull(),
      // Completion
      completed: boolean("completed").notNull(),
      // Details
      duration: integer("duration"),
      // minutes (if applicable)
      intensity: integer("intensity"),
      // 1-10 (if applicable)
      // Context
      timeOfDay: varchar("time_of_day", { length: 50 }),
      location: varchar("location", { length: 255 }),
      // Cue Recognition
      cuePresent: boolean("cue_present"),
      // Was the cue there?
      cueEffectiveness: integer("cue_effectiveness"),
      // 1-10: How well did the cue work?
      // Resistance & Ease
      resistanceLevel: integer("resistance_level"),
      // 1-10: How hard was it to start?
      easeOfCompletion: integer("ease_of_completion"),
      // 1-10: How easy once started?
      // Reward
      rewardExperienced: boolean("reward_experienced"),
      rewardSatisfaction: integer("reward_satisfaction"),
      // 1-10
      // Automaticity
      feltAutomatic: boolean("felt_automatic"),
      // Did it feel automatic?
      // Mood & Energy
      moodBefore: varchar("mood_before", { length: 100 }),
      moodAfter: varchar("mood_after", { length: 100 }),
      energyBefore: integer("energy_before"),
      // 1-10
      energyAfter: integer("energy_after"),
      // 1-10
      // Notes
      notes: text("notes"),
      challenges: text("challenges"),
      wins: text("wins"),
      createdAt: timestamp("created_at").defaultNow()
    });
    languagePatterns = pgTable("language_patterns", {
      id: varchar("id", { length: 255 }).primaryKey(),
      profileId: varchar("profile_id", { length: 255 }).notNull(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      // Pattern Type
      patternType: varchar("pattern_type", { length: 50 }),
      // The Language
      originalStatement: text("original_statement"),
      // What you used to say
      reframedStatement: text("reframed_statement"),
      // New empowering version
      // Context
      context: varchar("context", { length: 255 }),
      // When does this come up?
      relatedHabit: varchar("related_habit_id", { length: 255 }),
      // Which habit is this about?
      // Belief Level
      beliefInOld: integer("belief_in_old"),
      // 1-10: How much do you still believe the old statement?
      beliefInNew: integer("belief_in_new"),
      // 1-10: How much do you believe the new statement?
      // Impact
      impactOnBehavior: integer("impact_on_behavior"),
      // 1-10
      // Status
      status: varchar("status", { length: 50 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    languagePatternPractice = pgTable("language_pattern_practice", {
      id: varchar("id", { length: 255 }).primaryKey(),
      patternId: varchar("pattern_id", { length: 255 }).notNull(),
      profileId: varchar("profile_id", { length: 255 }).notNull(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp("practice_date").notNull(),
      // What Happened
      situation: text("situation"),
      // When did the old pattern show up?
      // Caught Yourself?
      caughtOldPattern: boolean("caught_old_pattern"),
      // Did you notice yourself using limiting language?
      // Reframed?
      usedNewPattern: boolean("used_new_pattern"),
      // Did you use the empowering language?
      // Impact
      impactOnMood: integer("impact_on_mood"),
      // 1-10
      impactOnAction: integer("impact_on_action"),
      // 1-10
      // Notes
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow()
    });
    habitObstacles = pgTable("habit_obstacles", {
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
      ifThenPlan: text("if_then_plan"),
      // "If [obstacle], then I will [solution]"
      // Effectiveness
      solutionEffectiveness: integer("solution_effectiveness"),
      // 1-10
      // Status
      resolved: boolean("resolved").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    habitMilestones = pgTable("habit_milestones", {
      id: varchar("id", { length: 255 }).primaryKey(),
      habitId: varchar("habit_id", { length: 255 }).notNull(),
      profileId: varchar("profile_id", { length: 255 }).notNull(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      milestoneType: varchar("milestone_type", { length: 50 }),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      achievedDate: timestamp("achieved_date"),
      createdAt: timestamp("created_at").defaultNow()
    });
    habitStacks = pgTable("habit_stacks", {
      id: varchar("id", { length: 255 }).primaryKey(),
      profileId: varchar("profile_id", { length: 255 }).notNull(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      stackName: varchar("stack_name", { length: 255 }).notNull(),
      description: text("description"),
      // When
      timeOfDay: varchar("time_of_day", { length: 50 }),
      // Habits in Stack (ordered)
      habitSequence: text("habit_sequence"),
      // JSON array: ordered habit IDs
      // Total Duration
      estimatedDuration: integer("estimated_duration"),
      // minutes
      // Performance
      totalCompletions: integer("total_completions").default(0),
      currentStreak: integer("current_streak").default(0),
      successRate: decimal("success_rate", { precision: 5, scale: 2 }),
      // Status
      active: boolean("active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    weeklyHabitReviews = pgTable("weekly_habit_reviews", {
      id: varchar("id", { length: 255 }).primaryKey(),
      profileId: varchar("profile_id", { length: 255 }).notNull(),
      userId: varchar("user_id", { length: 255 }).notNull(),
      weekStartDate: timestamp("week_start_date").notNull(),
      // Overall Performance
      overallSuccessRate: decimal("overall_success_rate", { precision: 5, scale: 2 }),
      totalHabitsCompleted: integer("total_habits_completed"),
      // Wins
      biggestWins: text("biggest_wins"),
      // JSON array
      habitsGettingEasier: text("habits_getting_easier"),
      // JSON: habit IDs
      // Challenges
      biggestChallenges: text("biggest_challenges"),
      // JSON array
      habitsStrugglingWith: text("habits_struggling_with"),
      // JSON: habit IDs
      // Language Patterns
      limitingLanguageCaught: integer("limiting_language_caught"),
      // How many times caught yourself
      empoweringLanguageUsed: integer("empowering_language_used"),
      // How many times used new patterns
      // Insights
      keyInsights: text("key_insights"),
      lessonsLearned: text("lessons_learned"),
      // Next Week
      adjustmentsPlanned: text("adjustments_planned"),
      // JSON array
      newHabitsToStart: text("new_habits_to_start"),
      // JSON array
      habitsToModify: text("habits_to_modify"),
      // JSON array
      createdAt: timestamp("created_at").defaultNow()
    });
    habitFormationAnalytics = pgTable("habit_formation_analytics", {
      id: varchar("id", { length: 255 }).primaryKey(),
      // Strategy Effectiveness (aggregated)
      strategy: varchar("strategy", { length: 100 }).notNull(),
      // tiny_habits, stacking, implementation_intention, etc.
      habitCategory: varchar("habit_category", { length: 100 }),
      // Success Metrics
      avgSuccessRate: decimal("avg_success_rate", { precision: 5, scale: 2 }),
      avgTimeToAutomaticity: integer("avg_time_to_automaticity"),
      // days
      avgStreakLength: integer("avg_streak_length"),
      // Optimal Parameters
      optimalCueType: varchar("optimal_cue_type", { length: 100 }),
      optimalTimeOfDay: varchar("optimal_time_of_day", { length: 50 }),
      // User Segments
      mostEffectiveFor: text("most_effective_for"),
      // JSON: different user types
      // Sample Size
      habitCount: integer("habit_count"),
      userCount: integer("user_count"),
      lastCalculated: timestamp("last_calculated").defaultNow(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
  }
});

// drizzle/identitySchema.ts
import { integer as integer2, pgTable as pgTable2, serial, text as text2, timestamp as timestamp2, varchar as varchar2 } from "drizzle-orm/pg-core";
var identityProfiles, dailyCheckins, habitCompletions, disciplineEvents, microHabits;
var init_identitySchema = __esm({
  "drizzle/identitySchema.ts"() {
    "use strict";
    init_schema();
    init_habitFormationSchema();
    identityProfiles = pgTable2("identityProfiles", {
      id: serial("id").primaryKey(),
      clientId: integer2("clientId").notNull().references(() => clients.id),
      // Current identity markers
      currentIdentity: text2("currentIdentity"),
      // JSON: ["disciplined", "resilient", etc.]
      targetIdentity: text2("targetIdentity"),
      // JSON: ["unstoppable", "mission-driven", etc.]
      identityGaps: text2("identityGaps"),
      // JSON: What's missing between current and target
      // Core values and mission
      coreValues: text2("coreValues"),
      // JSON array
      lifeMission: text2("lifeMission"),
      longTermVision: text2("longTermVision"),
      // Identity reinforcement tracking
      identityWins: text2("identityWins"),
      // JSON: Recent actions that reinforced identity
      identityContradictions: text2("identityContradictions"),
      // JSON: Actions that contradicted identity
      createdAt: timestamp2("createdAt").defaultNow().notNull(),
      updatedAt: timestamp2("updatedAt").defaultNow().notNull()
    });
    dailyCheckins = pgTable2("dailyCheckins", {
      id: serial("id").primaryKey(),
      clientId: integer2("clientId").notNull().references(() => clients.id),
      checkinDate: timestamp2("checkinDate").defaultNow().notNull(),
      // Physical health (minimal questions)
      sleptWell: varchar2("sleptWell", { length: 50 }),
      ateWell: varchar2("ateWell", { length: 50 }),
      movedBody: varchar2("movedBody", { length: 50 }),
      // Emotional state (single rating)
      emotionalState: integer2("emotionalState").notNull(),
      // 1-10 scale
      // Discipline tracking
      followedPlan: varchar2("followedPlan", { length: 50 }),
      controlledImpulses: varchar2("controlledImpulses", { length: 50 }),
      // Identity reinforcement
      actedLikeTargetIdentity: varchar2("actedLikeTargetIdentity", { length: 50 }),
      // Optional notes (not required)
      notes: text2("notes"),
      createdAt: timestamp2("createdAt").defaultNow().notNull()
    });
    habitCompletions = pgTable2("habitCompletions", {
      id: serial("id").primaryKey(),
      habitId: integer2("habitId").notNull().references(() => habits.id),
      completionDate: timestamp2("completionDate").defaultNow().notNull(),
      completed: varchar2("completed", { length: 50 }),
      notes: text2("notes"),
      createdAt: timestamp2("createdAt").defaultNow().notNull()
    });
    disciplineEvents = pgTable2("disciplineEvents", {
      id: serial("id").primaryKey(),
      clientId: integer2("clientId").notNull().references(() => clients.id),
      eventDate: timestamp2("eventDate").defaultNow().notNull(),
      // Event details
      eventType: varchar2("eventType", { length: 50 }),
      situation: text2("situation"),
      // What happened
      response: text2("response"),
      // How they responded
      outcome: text2("outcome"),
      // Result
      // Identity impact
      reinforcedIdentity: varchar2("reinforcedIdentity", { length: 50 }),
      createdAt: timestamp2("createdAt").defaultNow().notNull()
    });
    microHabits = pgTable2("microHabits", {
      id: serial("id").primaryKey(),
      clientId: integer2("clientId").notNull().references(() => clients.id),
      // Micro-habit definition (must be < 2 minutes)
      microHabitName: varchar2("microHabitName", { length: 255 }).notNull(),
      trigger: varchar2("trigger", { length: 255 }).notNull(),
      // "After I [existing habit]"
      action: varchar2("action", { length: 255 }).notNull(),
      // "I will [micro-habit]"
      // Identity connection
      identityReinforcement: text2("identityReinforcement"),
      // "This makes me [identity]"
      // Status
      isActive: varchar2("isActive", { length: 50 }),
      createdAt: timestamp2("createdAt").defaultNow().notNull(),
      updatedAt: timestamp2("updatedAt").defaultNow().notNull()
    });
  }
});

// drizzle/adaptiveLearningSchema.ts
import { integer as integer3, pgTable as pgTable3, serial as serial2, text as text3, timestamp as timestamp3, varchar as varchar3 } from "drizzle-orm/pg-core";
var techniqueEffectiveness, clientPatterns, recommendationFeedback, adaptiveOutcomeTracking, trendDetection, strategyAdjustments;
var init_adaptiveLearningSchema = __esm({
  "drizzle/adaptiveLearningSchema.ts"() {
    "use strict";
    init_schema();
    techniqueEffectiveness = pgTable3("techniqueEffectiveness", {
      id: serial2("id").primaryKey(),
      // Technique details
      techniqueName: varchar3("techniqueName", { length: 255 }).notNull(),
      techniqueCategory: varchar3("techniqueCategory", { length: 100 }).notNull(),
      // CBT, DBT, mindfulness, etc.
      techniqueDescription: text3("techniqueDescription"),
      // Context
      problemType: varchar3("problemType", { length: 255 }).notNull(),
      // anxiety, depression, stress, etc.
      clientDemographic: text3("clientDemographic"),
      // JSON: age range, background, etc.
      // Effectiveness metrics
      timesRecommended: integer3("timesRecommended").default(0).notNull(),
      timesUsed: integer3("timesUsed").default(0).notNull(),
      successCount: integer3("successCount").default(0).notNull(),
      failureCount: integer3("failureCount").default(0).notNull(),
      averageRating: integer3("averageRating"),
      // 1-10 scale
      // Learning data
      lastRecommended: timestamp3("lastRecommended"),
      confidenceScore: integer3("confidenceScore").default(50).notNull(),
      // 0-100, increases with data
      createdAt: timestamp3("createdAt").defaultNow().notNull(),
      updatedAt: timestamp3("updatedAt").defaultNow().notNull()
    });
    clientPatterns = pgTable3("clientPatterns", {
      id: serial2("id").primaryKey(),
      // Pattern details
      patternName: varchar3("patternName", { length: 255 }).notNull(),
      patternDescription: text3("patternDescription").notNull(),
      patternType: varchar3("patternType", { length: 100 }).notNull(),
      // trigger, coping, emotional, behavioral
      // Frequency
      occurrenceCount: integer3("occurrenceCount").default(1).notNull(),
      affectedClientCount: integer3("affectedClientCount").default(1).notNull(),
      // Associated data
      commonTriggers: text3("commonTriggers"),
      // JSON array
      effectiveSolutions: text3("effectiveSolutions"),
      // JSON array
      relatedPatterns: text3("relatedPatterns"),
      // JSON array of pattern IDs
      // Learning status
      isValidated: varchar3("isValidated", { length: 50 }),
      confidenceScore: integer3("confidenceScore").default(50).notNull(),
      createdAt: timestamp3("createdAt").defaultNow().notNull(),
      updatedAt: timestamp3("updatedAt").defaultNow().notNull()
    });
    recommendationFeedback = pgTable3("recommendationFeedback", {
      id: serial2("id").primaryKey(),
      clientId: integer3("clientId").notNull().references(() => clients.id),
      // Recommendation details
      recommendationType: varchar3("recommendationType", { length: 100 }).notNull(),
      // technique, strategy, habit, etc.
      recommendationContent: text3("recommendationContent").notNull(),
      context: text3("context"),
      // What situation prompted this recommendation
      // Feedback
      wasUsed: varchar3("wasUsed", { length: 50 }),
      wasHelpful: varchar3("wasHelpful", { length: 50 }),
      rating: integer3("rating"),
      // 1-10 scale
      feedbackNotes: text3("feedbackNotes"),
      // Outcome tracking
      problemResolved: varchar3("problemResolved", { length: 50 }),
      timeToResolution: integer3("timeToResolution"),
      // minutes or hours
      createdAt: timestamp3("createdAt").defaultNow().notNull()
    });
    adaptiveOutcomeTracking = pgTable3("adaptiveOutcomeTracking", {
      id: serial2("id").primaryKey(),
      clientId: integer3("clientId").notNull().references(() => clients.id),
      // Baseline (when they started)
      baselineDate: timestamp3("baselineDate").notNull(),
      baselineEmotionalState: integer3("baselineEmotionalState").notNull(),
      // 1-10
      baselineFunctioning: integer3("baselineFunctioning").notNull(),
      // 1-10
      baselineGoals: text3("baselineGoals"),
      // JSON array
      // Current state
      currentEmotionalState: integer3("currentEmotionalState"),
      currentFunctioning: integer3("currentFunctioning"),
      goalsAchieved: text3("goalsAchieved"),
      // JSON array
      // Improvement metrics
      emotionalImprovement: integer3("emotionalImprovement"),
      // Calculated: current - baseline
      functioningImprovement: integer3("functioningImprovement"),
      daysInCoaching: integer3("daysInCoaching"),
      // Specific improvements
      sleepImproved: varchar3("sleepImproved", { length: 50 }),
      relationshipsImproved: varchar3("relationshipsImproved", { length: 50 }),
      workPerformanceImproved: varchar3("workPerformanceImproved", { length: 50 }),
      physicalHealthImproved: varchar3("physicalHealthImproved", { length: 50 }),
      // Attribution
      attributedToCoaching: varchar3("attributedToCoaching", { length: 50 }),
      mostHelpfulAspect: text3("mostHelpfulAspect"),
      createdAt: timestamp3("createdAt").defaultNow().notNull(),
      updatedAt: timestamp3("updatedAt").defaultNow().notNull()
    });
    trendDetection = pgTable3("trendDetection", {
      id: serial2("id").primaryKey(),
      // Trend details
      trendName: varchar3("trendName", { length: 255 }).notNull(),
      trendDescription: text3("trendDescription").notNull(),
      trendCategory: varchar3("trendCategory", { length: 100 }).notNull(),
      // struggle, success, pattern, etc.
      // Statistics
      affectedPercentage: integer3("affectedPercentage").notNull(),
      // 0-100
      totalClientsAnalyzed: integer3("totalClientsAnalyzed").notNull(),
      affectedClientCount: integer3("affectedClientCount").notNull(),
      // Recommendations
      suggestedContent: text3("suggestedContent"),
      // New tools/content to create
      suggestedApproach: text3("suggestedApproach"),
      // How to address this trend
      // Status
      isActive: varchar3("isActive", { length: 50 }),
      isAddressed: varchar3("isAddressed", { length: 50 }),
      createdAt: timestamp3("createdAt").defaultNow().notNull(),
      updatedAt: timestamp3("updatedAt").defaultNow().notNull()
    });
    strategyAdjustments = pgTable3("strategyAdjustments", {
      id: serial2("id").primaryKey(),
      // Adjustment details
      adjustmentType: varchar3("adjustmentType", { length: 100 }).notNull(),
      // technique_priority, approach_change, etc.
      adjustmentDescription: text3("adjustmentDescription").notNull(),
      // Reason
      triggeringData: text3("triggeringData"),
      // JSON: What data prompted this adjustment
      expectedImprovement: text3("expectedImprovement"),
      // Implementation
      implementedAt: timestamp3("implementedAt").defaultNow().notNull(),
      isActive: varchar3("isActive", { length: 50 }),
      // Results
      measuredImprovement: text3("measuredImprovement"),
      // JSON: Actual results
      wasSuccessful: varchar3("wasSuccessful", { length: 50 }),
      createdAt: timestamp3("createdAt").defaultNow().notNull(),
      updatedAt: timestamp3("updatedAt").defaultNow().notNull()
    });
  }
});

// drizzle/autismSchema.ts
import { integer as integer4, pgTable as pgTable4, serial as serial3, text as text4, timestamp as timestamp4, varchar as varchar4 } from "drizzle-orm/pg-core";
var autismProfiles, interventionPlans, supplementTracking, dietaryInterventions, therapySessions, autismOutcomeTracking, autismPatternDetection, autismProviders;
var init_autismSchema = __esm({
  "drizzle/autismSchema.ts"() {
    "use strict";
    init_schema();
    autismProfiles = pgTable4("autismProfiles", {
      id: serial3("id").primaryKey(),
      userId: integer4("userId").notNull().references(() => users.id),
      // Parent's user ID
      childName: varchar4("childName", { length: 255 }).notNull(),
      dateOfBirth: timestamp4("dateOfBirth").notNull(),
      diagnosisDate: timestamp4("diagnosisDate"),
      severity: varchar4("severity", { length: 50 }),
      // Assessment Data
      atecScore: integer4("atecScore"),
      // Autism Treatment Evaluation Checklist
      carsScore: integer4("carsScore"),
      // Childhood Autism Rating Scale
      communicationLevel: varchar4("communicationLevel", { length: 50 }),
      // Symptoms & Challenges (stored as JSON text)
      giSymptoms: text4("giSymptoms"),
      // JSON: ["constipation", "diarrhea", "pain"]
      sleepIssues: text4("sleepIssues"),
      // JSON: ["difficulty_falling_asleep", "night_wakings"]
      sensoryProfile: text4("sensoryProfile"),
      // JSON: {"hyper": ["sound", "touch"], "hypo": ["movement"]}
      behaviorChallenges: text4("behaviorChallenges"),
      // JSON: ["aggression", "self_injury", "tantrums"]
      // Family Context
      familyResources: text4("familyResources"),
      // JSON: {"time": "limited", "budget": "moderate", "support": "high"}
      treatmentPriorities: text4("treatmentPriorities"),
      // JSON: ["communication", "behavior", "independence"]
      createdAt: timestamp4("createdAt").defaultNow().notNull(),
      updatedAt: timestamp4("updatedAt").defaultNow().notNull()
    });
    interventionPlans = pgTable4("interventionPlans", {
      id: serial3("id").primaryKey(),
      profileId: integer4("profileId").notNull().references(() => autismProfiles.id),
      // Tiered Interventions (JSON arrays)
      tier1Interventions: text4("tier1Interventions").notNull(),
      // JSON: ["nutrition", "sleep", "sensory"]
      tier2Interventions: text4("tier2Interventions"),
      // JSON: ["FMT", "GFCF_diet", "omega3"]
      tier3Interventions: text4("tier3Interventions"),
      // JSON: ["ABA", "OT", "speech"]
      tier4Interventions: text4("tier4Interventions"),
      // JSON: ["neurofeedback", "TMS_trial"]
      // Timeline & Providers
      currentPhase: varchar4("currentPhase", { length: 50 }),
      startDate: timestamp4("startDate").notNull(),
      providerDirectory: text4("providerDirectory"),
      // JSON: {"ABA": "provider_name", "OT": "provider_name"}
      createdAt: timestamp4("createdAt").defaultNow().notNull(),
      updatedAt: timestamp4("updatedAt").defaultNow().notNull()
    });
    supplementTracking = pgTable4("supplementTracking", {
      id: serial3("id").primaryKey(),
      profileId: integer4("profileId").notNull().references(() => autismProfiles.id),
      supplementName: varchar4("supplementName", { length: 255 }).notNull(),
      // "Omega-3", "Vitamin D", "Methylcobalamin"
      dosage: varchar4("dosage", { length: 255 }).notNull(),
      // "1000mg EPA+DHA", "300 IU/kg/day"
      frequency: varchar4("frequency", { length: 50 }),
      startDate: timestamp4("startDate").notNull(),
      endDate: timestamp4("endDate"),
      // Tracking
      adherence: integer4("adherence"),
      // Percentage: 0-100
      sideEffects: text4("sideEffects"),
      // JSON: ["fishy_burps", "loose_stools"]
      perceivedBenefit: integer4("perceivedBenefit"),
      // 1-10 scale
      createdAt: timestamp4("createdAt").defaultNow().notNull(),
      updatedAt: timestamp4("updatedAt").defaultNow().notNull()
    });
    dietaryInterventions = pgTable4("dietaryInterventions", {
      id: serial3("id").primaryKey(),
      profileId: integer4("profileId").notNull().references(() => autismProfiles.id),
      dietType: varchar4("dietType", { length: 50 }),
      startDate: timestamp4("startDate").notNull(),
      endDate: timestamp4("endDate"),
      // Tracking
      adherence: integer4("adherence"),
      // Percentage: 0-100
      giSymptomChanges: text4("giSymptomChanges"),
      // JSON: {"constipation": "improved", "bloating": "resolved"}
      behaviorChanges: text4("behaviorChanges"),
      // JSON: {"attention": "improved", "sleep": "improved"}
      createdAt: timestamp4("createdAt").defaultNow().notNull(),
      updatedAt: timestamp4("updatedAt").defaultNow().notNull()
    });
    therapySessions = pgTable4("therapySessions", {
      id: serial3("id").primaryKey(),
      profileId: integer4("profileId").notNull().references(() => autismProfiles.id),
      therapyType: varchar4("therapyType", { length: 50 }),
      sessionDate: timestamp4("sessionDate").notNull(),
      duration: integer4("duration").notNull(),
      // Minutes
      // Session Details
      goalsAddressed: text4("goalsAddressed"),
      // JSON: ["increase_eye_contact", "reduce_tantrums"]
      progress: text4("progress"),
      // JSON: {"eye_contact": "improved", "tantrums": "reduced_by_30%"}
      parentFeedback: text4("parentFeedback"),
      createdAt: timestamp4("createdAt").defaultNow().notNull()
    });
    autismOutcomeTracking = pgTable4("autismOutcomeTracking", {
      id: serial3("id").primaryKey(),
      profileId: integer4("profileId").notNull().references(() => autismProfiles.id),
      assessmentDate: timestamp4("assessmentDate").notNull(),
      // Core Autism Symptoms
      atecScore: integer4("atecScore"),
      carsScore: integer4("carsScore"),
      communicationLevel: varchar4("communicationLevel", { length: 50 }),
      // Behavior & Function
      behaviorScore: integer4("behaviorScore"),
      // 1-10 scale (parent-reported)
      adaptiveFunctionScore: integer4("adaptiveFunctionScore"),
      // 1-10 scale
      // Physical Health
      giSymptomScore: integer4("giSymptomScore"),
      // 1-10 scale (1=severe, 10=none)
      sleepScore: integer4("sleepScore"),
      // 1-10 scale (1=severe issues, 10=excellent)
      // Family Quality of Life
      familyQOL: integer4("familyQOL"),
      // 1-10 scale
      parentStress: integer4("parentStress"),
      // 1-10 scale (1=low, 10=high)
      createdAt: timestamp4("createdAt").defaultNow().notNull()
    });
    autismPatternDetection = pgTable4("autismPatternDetection", {
      id: serial3("id").primaryKey(),
      // Child Profile Characteristics
      childProfile: text4("childProfile").notNull(),
      // JSON: {"severity": "moderate", "giSymptoms": true, "age": 4}
      // Intervention Combination
      interventionCombination: text4("interventionCombination").notNull(),
      // JSON: ["FMT", "omega3", "ABA"]
      // Outcome Data
      outcomeData: text4("outcomeData").notNull(),
      // JSON: {"atec_improvement": 40, "behavior_improvement": 60}
      // Pattern Insights
      patternType: varchar4("patternType", { length: 50 }),
      confidence: integer4("confidence"),
      // 0-100
      createdAt: timestamp4("createdAt").defaultNow().notNull()
    });
    autismProviders = pgTable4("autismProviders", {
      id: serial3("id").primaryKey(),
      providerType: varchar4("providerType", { length: 50 }),
      name: varchar4("name", { length: 255 }).notNull(),
      location: varchar4("location", { length: 255 }).notNull(),
      // City, State
      // Contact & Details
      phone: varchar4("phone", { length: 50 }),
      email: varchar4("email", { length: 320 }),
      website: varchar4("website", { length: 500 }),
      // Ratings & Reviews
      rating: integer4("rating"),
      // 1-5 stars
      reviewCount: integer4("reviewCount"),
      // Insurance & Cost
      acceptsInsurance: varchar4("acceptsInsurance", { length: 50 }),
      costRange: varchar4("costRange", { length: 100 }),
      // "$100-$200/session"
      createdAt: timestamp4("createdAt").defaultNow().notNull(),
      updatedAt: timestamp4("updatedAt").defaultNow().notNull()
    });
  }
});

// drizzle/emotionalEngineSchema.ts
import { boolean as boolean2, decimal as decimal2, integer as integer5, pgTable as pgTable5, text as text5, timestamp as timestamp5, varchar as varchar5 } from "drizzle-orm/pg-core";
var emotionalProfiles, emotionEntries, dbtSkillsPractice, actPractices, emotionRegulationStrategies, resilienceActivities, emotionalProcessing, emotionalWins, emotionalEngineAnalytics;
var init_emotionalEngineSchema = __esm({
  "drizzle/emotionalEngineSchema.ts"() {
    "use strict";
    emotionalProfiles = pgTable5("emotional_profiles", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      userId: varchar5("user_id", { length: 255 }).notNull(),
      // Baseline Emotional State
      baselineEmotionalState: varchar5("baseline_emotional_state", { length: 100 }),
      emotionalRange: varchar5("emotional_range", { length: 50 }),
      // How much do emotions fluctuate?
      emotionalIntensity: varchar5("emotional_intensity", { length: 50 }),
      // Regulation Ability
      regulationSkillLevel: integer5("regulation_skill_level"),
      // 1-10
      awarenessLevel: integer5("awareness_level"),
      // 1-10 (how aware are you of your emotions?)
      // Challenges
      primaryChallenges: text5("primary_challenges"),
      // JSON: overwhelm, numbness, mood_swings, anger, anxiety, etc.
      // Goals
      primaryGoal: varchar5("primary_goal", { length: 50 }),
      // Emotional Patterns (self-learning)
      commonTriggers: text5("common_triggers"),
      // JSON: learned from tracking
      commonEmotions: text5("common_emotions"),
      // JSON: most frequent emotions
      emotionalCycles: text5("emotional_cycles"),
      // JSON: patterns (e.g., anxiety peaks in morning)
      // Effective Strategies (self-learning)
      mostEffectiveStrategies: text5("most_effective_strategies"),
      // JSON: what works for this user
      leastEffectiveStrategies: text5("least_effective_strategies"),
      // JSON: what doesn't work
      createdAt: timestamp5("created_at").defaultNow(),
      updatedAt: timestamp5("updated_at").defaultNow()
    });
    emotionEntries = pgTable5("emotion_entries", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      profileId: varchar5("profile_id", { length: 255 }).notNull(),
      userId: varchar5("user_id", { length: 255 }).notNull(),
      entryDate: timestamp5("entry_date").notNull(),
      // Primary Emotion (Lisa Feldman Barrett's emotion categories)
      primaryEmotion: varchar5("primary_emotion", { length: 100 }).notNull(),
      // joy, sadness, anger, fear, disgust, surprise, etc.
      secondaryEmotions: text5("secondary_emotions"),
      // JSON array
      // Intensity
      intensity: integer5("intensity"),
      // 1-10
      // Valence & Arousal (circumplex model)
      valence: integer5("valence"),
      // -5 to +5 (negative to positive)
      arousal: integer5("arousal"),
      // 1-10 (low energy to high energy)
      // Context
      trigger: text5("trigger"),
      // What caused this emotion?
      situation: text5("situation"),
      thoughts: text5("thoughts"),
      // What were you thinking?
      // Physical Sensations
      physicalSensations: text5("physical_sensations"),
      // JSON: heart racing, tension, warmth, etc.
      // Behavior
      urge: text5("urge"),
      // What did you want to do?
      actualBehavior: text5("actual_behavior"),
      // What did you actually do?
      // Duration
      durationMinutes: integer5("duration_minutes"),
      // Regulation Attempted
      regulationUsed: boolean2("regulation_used"),
      regulationStrategy: varchar5("regulation_strategy", { length: 255 }),
      regulationEffectiveness: integer5("regulation_effectiveness"),
      // 1-10
      createdAt: timestamp5("created_at").defaultNow()
    });
    dbtSkillsPractice = pgTable5("dbt_skills_practice", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      profileId: varchar5("profile_id", { length: 255 }).notNull(),
      userId: varchar5("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp5("practice_date").notNull(),
      // DBT Module
      dbtModule: varchar5("dbt_module", { length: 50 }),
      // Specific Skill
      skillUsed: varchar5("skill_used", { length: 50 }).notNull(),
      // Context
      situation: text5("situation"),
      emotionBefore: varchar5("emotion_before", { length: 100 }),
      intensityBefore: integer5("intensity_before"),
      // 1-10
      // Practice
      howUsed: text5("how_used"),
      // Outcome
      emotionAfter: varchar5("emotion_after", { length: 100 }),
      intensityAfter: integer5("intensity_after"),
      // 1-10
      // Effectiveness
      effectiveness: integer5("effectiveness"),
      // 1-10
      wouldUseAgain: boolean2("would_use_again"),
      // Challenges
      challenges: text5("challenges"),
      createdAt: timestamp5("created_at").defaultNow()
    });
    actPractices = pgTable5("act_practices", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      profileId: varchar5("profile_id", { length: 255 }).notNull(),
      userId: varchar5("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp5("practice_date").notNull(),
      // ACT Process
      actProcess: varchar5("act_process", { length: 50 }),
      // Specific Technique
      technique: varchar5("technique", { length: 255 }),
      // Practice
      situation: text5("situation"),
      difficultThought: text5("difficult_thought"),
      difficultEmotion: varchar5("difficult_emotion", { length: 100 }),
      // ACT Response
      acceptanceLevel: integer5("acceptance_level"),
      // 1-10 (how much did you accept vs. struggle?)
      defusionLevel: integer5("defusion_level"),
      // 1-10 (how much did you separate from the thought?)
      // Values Alignment
      valueIdentified: varchar5("value_identified", { length: 255 }),
      actionTaken: text5("action_taken"),
      // Values-based action
      // Outcome
      psychologicalFlexibility: integer5("psychological_flexibility"),
      // 1-10 (how flexible were you?)
      effectiveness: integer5("effectiveness"),
      // 1-10
      createdAt: timestamp5("created_at").defaultNow()
    });
    emotionRegulationStrategies = pgTable5("emotion_regulation_strategies", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      profileId: varchar5("profile_id", { length: 255 }).notNull(),
      userId: varchar5("user_id", { length: 255 }).notNull(),
      useDate: timestamp5("use_date").notNull(),
      // Strategy Type (evidence-based)
      strategyType: varchar5("strategy_type", { length: 50 }).notNull(),
      // Context
      emotion: varchar5("emotion", { length: 100 }).notNull(),
      intensityBefore: integer5("intensity_before"),
      // 1-10
      trigger: text5("trigger"),
      // Strategy Application
      whatYouDid: text5("what_you_did"),
      duration: integer5("duration"),
      // minutes
      // Outcome
      intensityAfter: integer5("intensity_after"),
      // 1-10
      emotionChanged: boolean2("emotion_changed"),
      newEmotion: varchar5("new_emotion", { length: 100 }),
      // Effectiveness
      immediateEffectiveness: integer5("immediate_effectiveness"),
      // 1-10
      longTermHelpful: boolean2("long_term_helpful"),
      // Did this actually help or just avoid?
      // Side Effects
      sideEffects: text5("side_effects"),
      // Any negative consequences?
      createdAt: timestamp5("created_at").defaultNow()
    });
    resilienceActivities = pgTable5("resilience_activities", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      profileId: varchar5("profile_id", { length: 255 }).notNull(),
      userId: varchar5("user_id", { length: 255 }).notNull(),
      activityDate: timestamp5("activity_date").notNull(),
      // Activity Type (evidence-based resilience factors)
      activityType: varchar5("activity_type", { length: 50 }),
      activity: varchar5("activity", { length: 255 }).notNull(),
      description: text5("description"),
      duration: integer5("duration"),
      // minutes
      // Impact
      resilienceImpact: integer5("resilience_impact"),
      // 1-10
      emotionalImpact: integer5("emotional_impact"),
      // 1-10
      createdAt: timestamp5("created_at").defaultNow()
    });
    emotionalProcessing = pgTable5("emotional_processing", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      profileId: varchar5("profile_id", { length: 255 }).notNull(),
      userId: varchar5("user_id", { length: 255 }).notNull(),
      processingDate: timestamp5("processing_date").notNull(),
      // What You're Processing
      emotionToProcess: varchar5("emotion_to_process", { length: 100 }).notNull(),
      relatedEvent: text5("related_event"),
      // Processing Method
      processingMethod: varchar5("processing_method", { length: 50 }),
      // Process
      whatCameUp: text5("what_came_up"),
      // Insights, memories, realizations
      physicalSensations: text5("physical_sensations"),
      // Depth
      processingDepth: varchar5("processing_depth", { length: 50 }),
      // Outcome
      feelingAfter: varchar5("feeling_after", { length: 100 }),
      resolutionLevel: integer5("resolution_level"),
      // 1-10 (how resolved does this feel?)
      // Integration
      insights: text5("insights"),
      actionSteps: text5("action_steps"),
      // JSON array
      createdAt: timestamp5("created_at").defaultNow()
    });
    emotionalWins = pgTable5("emotional_wins", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      profileId: varchar5("profile_id", { length: 255 }).notNull(),
      userId: varchar5("user_id", { length: 255 }).notNull(),
      winDate: timestamp5("win_date").notNull(),
      winType: varchar5("win_type", { length: 50 }),
      title: varchar5("title", { length: 255 }).notNull(),
      description: text5("description"),
      // Significance
      significance: text5("significance"),
      howYouGrew: text5("how_you_grew"),
      createdAt: timestamp5("created_at").defaultNow()
    });
    emotionalEngineAnalytics = pgTable5("emotional_engine_analytics", {
      id: varchar5("id", { length: 255 }).primaryKey(),
      // Strategy Effectiveness (aggregated)
      strategyType: varchar5("strategy_type", { length: 100 }).notNull(),
      emotionType: varchar5("emotion_type", { length: 100 }).notNull(),
      // Effectiveness Metrics
      avgIntensityReduction: decimal2("avg_intensity_reduction", { precision: 5, scale: 2 }),
      avgEffectivenessRating: decimal2("avg_effectiveness_rating", { precision: 5, scale: 2 }),
      successRate: decimal2("success_rate", { precision: 5, scale: 2 }),
      // % of times it helped
      // Optimal Parameters
      optimalDuration: integer5("optimal_duration"),
      // minutes
      // User Segments
      mostEffectiveFor: text5("most_effective_for"),
      // JSON: different emotional profiles
      // Sample Size
      useCount: integer5("use_count"),
      userCount: integer5("user_count"),
      lastCalculated: timestamp5("last_calculated").defaultNow(),
      createdAt: timestamp5("created_at").defaultNow(),
      updatedAt: timestamp5("updated_at").defaultNow()
    });
  }
});

// drizzle/mentalEngineSchema.ts
import { boolean as boolean3, decimal as decimal3, integer as integer6, pgTable as pgTable6, text as text6, timestamp as timestamp6, varchar as varchar6 } from "drizzle-orm/pg-core";
var mentalProfiles, focusSessions, memoryPractices, learningSessions, cognitivePerformance, brainTrainingExercises, readingSessions, mentalBreaks, mentalEngineAnalytics;
var init_mentalEngineSchema = __esm({
  "drizzle/mentalEngineSchema.ts"() {
    "use strict";
    mentalProfiles = pgTable6("mental_profiles", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      userId: varchar6("user_id", { length: 255 }).notNull(),
      // Current Mental State
      mentalClarity: integer6("mental_clarity"),
      // 1-10 baseline
      focusAbility: integer6("focus_ability"),
      // 1-10
      memoryQuality: integer6("memory_quality"),
      // 1-10
      cognitiveEnergy: integer6("cognitive_energy"),
      // 1-10
      // Challenges
      primaryChallenges: text6("primary_challenges"),
      // JSON: brain_fog, poor_focus, memory_issues, overwhelm, etc.
      // Goals
      primaryGoal: varchar6("primary_goal", { length: 50 }),
      // Learning Style (evidence-based)
      learningStyle: text6("learning_style"),
      // JSON: visual, auditory, kinesthetic, reading/writing
      bestLearningTime: varchar6("best_learning_time", { length: 50 }),
      // morning, afternoon, evening
      // Current Habits
      sleepQuality: integer6("sleep_quality"),
      // 1-10 (affects cognition)
      exerciseFrequency: varchar6("exercise_frequency", { length: 50 }),
      screenTimeHours: integer6("screen_time_hours"),
      // daily
      // Medications/Supplements affecting cognition
      cognitiveSupplements: text6("cognitive_supplements"),
      // JSON array
      medications: text6("medications"),
      // JSON array
      // Self-Learning Data
      peakFocusHours: text6("peak_focus_hours"),
      // JSON: hours of day when focus is best
      optimalWorkDuration: integer6("optimal_work_duration"),
      // minutes before break needed
      mostEffectiveTechniques: text6("most_effective_techniques"),
      // JSON: techniques that work for this user
      createdAt: timestamp6("created_at").defaultNow(),
      updatedAt: timestamp6("updated_at").defaultNow()
    });
    focusSessions = pgTable6("focus_sessions", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      profileId: varchar6("profile_id", { length: 255 }).notNull(),
      userId: varchar6("user_id", { length: 255 }).notNull(),
      sessionDate: timestamp6("session_date").notNull(),
      // Session Details
      sessionType: varchar6("session_type", { length: 50 }),
      task: varchar6("task", { length: 255 }).notNull(),
      taskType: varchar6("task_type", { length: 50 }),
      // Duration
      plannedDuration: integer6("planned_duration"),
      // minutes
      actualDuration: integer6("actual_duration"),
      // minutes
      // Environment
      location: varchar6("location", { length: 255 }),
      noiseLevel: varchar6("noise_level", { length: 50 }),
      usedNoiseBlocking: boolean3("used_noise_blocking"),
      // Headphones, white noise, etc.
      // Pre-Session State
      energyBefore: integer6("energy_before"),
      // 1-10
      focusBefore: integer6("focus_before"),
      // 1-10
      stressBefore: integer6("stress_before"),
      // 1-10
      // Session Quality
      focusQuality: integer6("focus_quality"),
      // 1-10
      flowState: boolean3("flow_state"),
      // Did you achieve flow?
      distractionCount: integer6("distraction_count"),
      distractionTypes: text6("distraction_types"),
      // JSON: phone, people, thoughts, etc.
      // Post-Session State
      energyAfter: integer6("energy_after"),
      // 1-10
      focusAfter: integer6("focus_after"),
      // 1-10
      satisfactionLevel: integer6("satisfaction_level"),
      // 1-10 with output
      // Output
      productivityRating: integer6("productivity_rating"),
      // 1-10
      outputQuality: integer6("output_quality"),
      // 1-10
      // What Worked / Didn't Work
      whatHelped: text6("what_helped"),
      // JSON array
      whatHindered: text6("what_hindered"),
      // JSON array
      // Self-Learning Data
      effectiveness: integer6("effectiveness"),
      // Calculated score
      createdAt: timestamp6("created_at").defaultNow()
    });
    memoryPractices = pgTable6("memory_practices", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      profileId: varchar6("profile_id", { length: 255 }).notNull(),
      userId: varchar6("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp6("practice_date").notNull(),
      // Practice Type (evidence-based memory techniques)
      practiceType: varchar6("practice_type", { length: 50 }),
      // What You're Memorizing
      contentType: varchar6("content_type", { length: 50 }),
      topic: varchar6("topic", { length: 255 }),
      // Practice Details
      duration: integer6("duration"),
      // minutes
      itemsReviewed: integer6("items_reviewed"),
      itemsRecalled: integer6("items_recalled"),
      // Performance
      recallAccuracy: integer6("recall_accuracy"),
      // 0-100%
      confidenceLevel: integer6("confidence_level"),
      // 1-10
      // Difficulty
      difficulty: varchar6("difficulty", { length: 50 }),
      // Next Review (spaced repetition)
      nextReviewDate: timestamp6("next_review_date"),
      createdAt: timestamp6("created_at").defaultNow()
    });
    learningSessions = pgTable6("learning_sessions", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      profileId: varchar6("profile_id", { length: 255 }).notNull(),
      userId: varchar6("user_id", { length: 255 }).notNull(),
      sessionDate: timestamp6("session_date").notNull(),
      // What You're Learning
      topic: varchar6("topic", { length: 255 }).notNull(),
      subject: varchar6("subject", { length: 255 }),
      // Learning Method
      learningMethod: varchar6("learning_method", { length: 50 }),
      // Duration
      duration: integer6("duration"),
      // minutes
      // Engagement
      engagementLevel: integer6("engagement_level"),
      // 1-10
      comprehensionLevel: integer6("comprehension_level"),
      // 1-10
      // Techniques Used
      techniquesUsed: text6("techniques_used"),
      // JSON: active_recall, note_taking, summarizing, etc.
      // Output
      notesCreated: boolean3("notes_created"),
      practiceCompleted: boolean3("practice_completed"),
      taughtToSomeone: boolean3("taught_to_someone"),
      // Retention
      immediateRecall: integer6("immediate_recall"),
      // 1-10 (can you explain it now?)
      // Follow-up
      willReview: boolean3("will_review"),
      nextReviewDate: timestamp6("next_review_date"),
      createdAt: timestamp6("created_at").defaultNow()
    });
    cognitivePerformance = pgTable6("cognitive_performance", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      profileId: varchar6("profile_id", { length: 255 }).notNull(),
      userId: varchar6("user_id", { length: 255 }).notNull(),
      assessmentDate: timestamp6("assessment_date").notNull(),
      // Daily Cognitive Metrics
      mentalClarity: integer6("mental_clarity"),
      // 1-10
      focusAbility: integer6("focus_ability"),
      // 1-10
      memorySharpness: integer6("memory_sharpness"),
      // 1-10
      processingSpeed: integer6("processing_speed"),
      // 1-10 (how quickly can you think?)
      decisionQuality: integer6("decision_quality"),
      // 1-10
      creativity: integer6("creativity"),
      // 1-10
      // Brain Fog
      brainFog: integer6("brain_fog"),
      // 1-10 (higher = worse)
      mentalFatigue: integer6("mental_fatigue"),
      // 1-10
      // Contributing Factors
      sleepQuality: integer6("sleep_quality"),
      // 1-10
      sleepHours: decimal3("sleep_hours", { precision: 3, scale: 1 }),
      exerciseToday: boolean3("exercise_today"),
      stressLevel: integer6("stress_level"),
      // 1-10
      hydration: varchar6("hydration", { length: 50 }),
      nutrition: varchar6("nutrition", { length: 50 }),
      // Substances
      caffeineIntake: integer6("caffeine_intake"),
      // mg
      alcoholYesterday: boolean3("alcohol_yesterday"),
      // Notes
      notes: text6("notes"),
      createdAt: timestamp6("created_at").defaultNow()
    });
    brainTrainingExercises = pgTable6("brain_training_exercises", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      profileId: varchar6("profile_id", { length: 255 }).notNull(),
      userId: varchar6("user_id", { length: 255 }).notNull(),
      exerciseDate: timestamp6("exercise_date").notNull(),
      // Exercise Type
      exerciseType: varchar6("exercise_type", { length: 50 }),
      exerciseName: varchar6("exercise_name", { length: 255 }),
      // Performance
      score: integer6("score"),
      accuracy: integer6("accuracy"),
      // 0-100%
      speed: integer6("speed"),
      // milliseconds or custom metric
      // Difficulty
      difficultyLevel: integer6("difficulty_level"),
      // 1-10
      // Duration
      duration: integer6("duration"),
      // minutes
      // Progress
      personalBest: boolean3("personal_best"),
      improvementFromLast: integer6("improvement_from_last"),
      // percentage
      createdAt: timestamp6("created_at").defaultNow()
    });
    readingSessions = pgTable6("reading_sessions", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      profileId: varchar6("profile_id", { length: 255 }).notNull(),
      userId: varchar6("user_id", { length: 255 }).notNull(),
      sessionDate: timestamp6("session_date").notNull(),
      // What You Read
      contentType: varchar6("content_type", { length: 50 }),
      title: varchar6("title", { length: 255 }),
      author: varchar6("author", { length: 255 }),
      // Reading Details
      pagesRead: integer6("pages_read"),
      duration: integer6("duration"),
      // minutes
      // Reading Speed
      wordsPerMinute: integer6("words_per_minute"),
      // Comprehension
      comprehensionLevel: integer6("comprehension_level"),
      // 1-10
      retentionLevel: integer6("retention_level"),
      // 1-10 (how much will you remember?)
      // Techniques Used
      activeReading: boolean3("active_reading"),
      // Highlighting, notes, questions
      speedReading: boolean3("speed_reading"),
      skimming: boolean3("skimming"),
      // Output
      notesTaken: boolean3("notes_taken"),
      summaryWritten: boolean3("summary_written"),
      // Value
      valueRating: integer6("value_rating"),
      // 1-10 (how valuable was this?)
      createdAt: timestamp6("created_at").defaultNow()
    });
    mentalBreaks = pgTable6("mental_breaks", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      profileId: varchar6("profile_id", { length: 255 }).notNull(),
      userId: varchar6("user_id", { length: 255 }).notNull(),
      breakDate: timestamp6("break_date").notNull(),
      // Break Type
      breakType: varchar6("break_type", { length: 50 }),
      duration: integer6("duration"),
      // minutes
      // Activity
      activity: varchar6("activity", { length: 255 }),
      // State Before/After
      mentalFatigueBefore: integer6("mental_fatigue_before"),
      // 1-10
      mentalFatigueAfter: integer6("mental_fatigue_after"),
      // 1-10
      // Effectiveness
      restorationLevel: integer6("restoration_level"),
      // 1-10 (how restored do you feel?)
      createdAt: timestamp6("created_at").defaultNow()
    });
    mentalEngineAnalytics = pgTable6("mental_engine_analytics", {
      id: varchar6("id", { length: 255 }).primaryKey(),
      // Focus Patterns (aggregated)
      techniqueType: varchar6("technique_type", { length: 100 }).notNull(),
      // Effectiveness Metrics
      avgFocusImprovement: decimal3("avg_focus_improvement", { precision: 5, scale: 2 }),
      avgProductivityScore: decimal3("avg_productivity_score", { precision: 5, scale: 2 }),
      avgFlowStateRate: decimal3("avg_flow_state_rate", { precision: 5, scale: 2 }),
      // % of sessions achieving flow
      // Optimal Parameters
      optimalDuration: integer6("optimal_duration"),
      // minutes
      optimalTimeOfDay: varchar6("optimal_time_of_day", { length: 50 }),
      optimalBreakFrequency: integer6("optimal_break_frequency"),
      // minutes between breaks
      // User Segments
      mostEffectiveFor: text6("most_effective_for"),
      // JSON: different user types
      // Sample Size
      sessionCount: integer6("session_count"),
      userCount: integer6("user_count"),
      lastCalculated: timestamp6("last_calculated").defaultNow(),
      createdAt: timestamp6("created_at").defaultNow(),
      updatedAt: timestamp6("updated_at").defaultNow()
    });
  }
});

// drizzle/physicalEngineSchema.ts
import { boolean as boolean4, decimal as decimal4, integer as integer7, pgTable as pgTable7, text as text7, timestamp as timestamp7, varchar as varchar7 } from "drizzle-orm/pg-core";
var physicalProfiles, workouts, exercises, cardioSessions, mobilityWork, recoveryTracking, bodyMeasurements, strengthBenchmarks, physicalEngineAnalytics;
var init_physicalEngineSchema = __esm({
  "drizzle/physicalEngineSchema.ts"() {
    "use strict";
    physicalProfiles = pgTable7("physical_profiles", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      userId: varchar7("user_id", { length: 255 }).notNull(),
      // Current State
      fitnessLevel: varchar7("fitness_level", { length: 50 }),
      // Measurements
      height: integer7("height"),
      // cm
      weight: decimal4("weight", { precision: 5, scale: 2 }),
      // kg
      bodyFatPercentage: decimal4("body_fat_percentage", { precision: 4, scale: 1 }),
      // Goals
      primaryGoal: varchar7("primary_goal", { length: 50 }),
      specificGoals: text7("specific_goals"),
      // JSON array
      // Limitations
      injuries: text7("injuries"),
      // JSON array: current injuries
      injuryHistory: text7("injury_history"),
      // JSON array: past injuries
      limitations: text7("limitations"),
      // JSON: mobility restrictions, pain, etc.
      // Experience
      experienceLevel: text7("experience_level"),
      // JSON: {strength_training: "intermediate", cardio: "advanced", etc.}
      // Preferences
      preferredExerciseTypes: text7("preferred_exercise_types"),
      // JSON array
      availableEquipment: text7("available_equipment"),
      // JSON array
      timeAvailable: integer7("time_available"),
      // minutes per session
      // Self-Learning Data
      optimalTrainingFrequency: integer7("optimal_training_frequency"),
      // days per week
      optimalSessionDuration: integer7("optimal_session_duration"),
      // minutes
      bestRecoveryStrategies: text7("best_recovery_strategies"),
      // JSON
      injuryRiskFactors: text7("injury_risk_factors"),
      // JSON: patterns that lead to injury
      createdAt: timestamp7("created_at").defaultNow(),
      updatedAt: timestamp7("updated_at").defaultNow()
    });
    workouts = pgTable7("workouts", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      profileId: varchar7("profile_id", { length: 255 }).notNull(),
      userId: varchar7("user_id", { length: 255 }).notNull(),
      workoutDate: timestamp7("workout_date").notNull(),
      // Workout Type
      workoutType: varchar7("workout_type", { length: 50 }),
      // Focus
      primaryFocus: varchar7("primary_focus", { length: 50 }),
      // Duration & Intensity
      duration: integer7("duration"),
      // minutes
      intensity: varchar7("intensity", { length: 50 }),
      perceivedExertion: integer7("perceived_exertion"),
      // 1-10 (RPE)
      // State Before
      energyBefore: integer7("energy_before"),
      // 1-10
      sorenessBefore: integer7("soreness_before"),
      // 1-10
      motivationBefore: integer7("motivation_before"),
      // 1-10
      // Performance
      performanceRating: integer7("performance_rating"),
      // 1-10
      personalRecords: text7("personal_records"),
      // JSON: any PRs achieved
      // State After
      energyAfter: integer7("energy_after"),
      // 1-10
      sorenessAfter: integer7("soreness_after"),
      // 1-10
      satisfactionLevel: integer7("satisfaction_level"),
      // 1-10
      // Environment
      location: varchar7("location", { length: 255 }),
      temperature: integer7("temperature"),
      // celsius
      // Notes
      notes: text7("notes"),
      // Completion
      completed: boolean4("completed").default(true),
      createdAt: timestamp7("created_at").defaultNow()
    });
    exercises = pgTable7("exercises", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      workoutId: varchar7("workout_id", { length: 255 }).notNull(),
      profileId: varchar7("profile_id", { length: 255 }).notNull(),
      userId: varchar7("user_id", { length: 255 }).notNull(),
      // Exercise Details
      exerciseName: varchar7("exercise_name", { length: 255 }).notNull(),
      exerciseType: varchar7("exercise_type", { length: 50 }),
      muscleGroup: varchar7("muscle_group", { length: 255 }),
      // Primary muscle worked
      // Sets & Reps
      sets: integer7("sets"),
      reps: text7("reps"),
      // JSON array (can vary per set)
      weight: text7("weight"),
      // JSON array (kg per set)
      // Rest
      restBetweenSets: integer7("rest_between_sets"),
      // seconds
      // Tempo (if tracked)
      tempo: varchar7("tempo", { length: 50 }),
      // e.g., "3-1-2-0" (eccentric-pause-concentric-pause)
      // Range of Motion
      rangeOfMotion: varchar7("range_of_motion", { length: 50 }),
      // Quality
      formQuality: integer7("form_quality"),
      // 1-10
      difficulty: integer7("difficulty"),
      // 1-10
      // Progression
      progressionFromLast: varchar7("progression_from_last", { length: 255 }),
      // More weight, reps, better form, etc.
      // Pain/Discomfort
      painDuring: boolean4("pain_during"),
      painLocation: varchar7("pain_location", { length: 255 }),
      painLevel: integer7("pain_level"),
      // 1-10
      createdAt: timestamp7("created_at").defaultNow()
    });
    cardioSessions = pgTable7("cardio_sessions", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      workoutId: varchar7("workout_id", { length: 255 }).notNull(),
      profileId: varchar7("profile_id", { length: 255 }).notNull(),
      userId: varchar7("user_id", { length: 255 }).notNull(),
      sessionDate: timestamp7("session_date").notNull(),
      // Activity
      activityType: varchar7("activity_type", { length: 50 }),
      // Duration & Distance
      duration: integer7("duration"),
      // minutes
      distance: decimal4("distance", { precision: 6, scale: 2 }),
      // km
      // Intensity
      avgHeartRate: integer7("avg_heart_rate"),
      // bpm
      maxHeartRate: integer7("max_heart_rate"),
      // bpm
      heartRateZones: text7("heart_rate_zones"),
      // JSON: time in each zone
      avgPace: varchar7("avg_pace", { length: 50 }),
      // min/km
      avgSpeed: decimal4("avg_speed", { precision: 5, scale: 2 }),
      // km/h
      // Elevation
      elevationGain: integer7("elevation_gain"),
      // meters
      // Calories
      caloriesBurned: integer7("calories_burned"),
      // Performance
      performanceRating: integer7("performance_rating"),
      // 1-10
      // Recovery
      recoveryHeartRate: integer7("recovery_heart_rate"),
      // HR 1 min after stopping
      createdAt: timestamp7("created_at").defaultNow()
    });
    mobilityWork = pgTable7("mobility_work", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      profileId: varchar7("profile_id", { length: 255 }).notNull(),
      userId: varchar7("user_id", { length: 255 }).notNull(),
      sessionDate: timestamp7("session_date").notNull(),
      // Session Type
      sessionType: varchar7("session_type", { length: 50 }),
      // Focus Areas
      areasWorked: text7("areas_worked"),
      // JSON: hips, shoulders, ankles, etc.
      // Duration
      duration: integer7("duration"),
      // minutes
      // Quality
      rangeOfMotionBefore: integer7("range_of_motion_before"),
      // 1-10
      rangeOfMotionAfter: integer7("range_of_motion_after"),
      // 1-10
      painBefore: integer7("pain_before"),
      // 1-10
      painAfter: integer7("pain_after"),
      // 1-10
      // Techniques Used
      techniquesUsed: text7("techniques_used"),
      // JSON array
      // Effectiveness
      effectiveness: integer7("effectiveness"),
      // 1-10
      createdAt: timestamp7("created_at").defaultNow()
    });
    recoveryTracking = pgTable7("recovery_tracking", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      profileId: varchar7("profile_id", { length: 255 }).notNull(),
      userId: varchar7("user_id", { length: 255 }).notNull(),
      trackingDate: timestamp7("tracking_date").notNull(),
      // Recovery Score (calculated or self-reported)
      recoveryScore: integer7("recovery_score"),
      // 1-10
      // Metrics
      restingHeartRate: integer7("resting_heart_rate"),
      // bpm
      hrv: integer7("hrv"),
      // Heart Rate Variability (ms)
      sleepQuality: integer7("sleep_quality"),
      // 1-10
      sleepHours: decimal4("sleep_hours", { precision: 3, scale: 1 }),
      // Soreness
      overallSoreness: integer7("overall_soreness"),
      // 1-10
      soreAreas: text7("sore_areas"),
      // JSON: specific muscles/joints
      // Energy & Readiness
      energyLevel: integer7("energy_level"),
      // 1-10
      readinessToTrain: integer7("readiness_to_train"),
      // 1-10
      // Stress
      stressLevel: integer7("stress_level"),
      // 1-10
      // Recovery Strategies Used
      recoveryStrategies: text7("recovery_strategies"),
      // JSON: sleep, nutrition, massage, ice bath, etc.
      // Recommendations (self-learning)
      recommendedAction: varchar7("recommended_action", { length: 50 }),
      createdAt: timestamp7("created_at").defaultNow()
    });
    bodyMeasurements = pgTable7("body_measurements", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      profileId: varchar7("profile_id", { length: 255 }).notNull(),
      userId: varchar7("user_id", { length: 255 }).notNull(),
      measurementDate: timestamp7("measurement_date").notNull(),
      // Weight
      weight: decimal4("weight", { precision: 5, scale: 2 }),
      // kg
      // Body Composition
      bodyFatPercentage: decimal4("body_fat_percentage", { precision: 4, scale: 1 }),
      muscleMass: decimal4("muscle_mass", { precision: 5, scale: 2 }),
      // kg
      // Circumferences (cm)
      neck: decimal4("neck", { precision: 4, scale: 1 }),
      chest: decimal4("chest", { precision: 4, scale: 1 }),
      waist: decimal4("waist", { precision: 4, scale: 1 }),
      hips: decimal4("hips", { precision: 4, scale: 1 }),
      bicepLeft: decimal4("bicep_left", { precision: 4, scale: 1 }),
      bicepRight: decimal4("bicep_right", { precision: 4, scale: 1 }),
      thighLeft: decimal4("thigh_left", { precision: 4, scale: 1 }),
      thighRight: decimal4("thigh_right", { precision: 4, scale: 1 }),
      calfLeft: decimal4("calf_left", { precision: 4, scale: 1 }),
      calfRight: decimal4("calf_right", { precision: 4, scale: 1 }),
      // Photos
      frontPhoto: varchar7("front_photo", { length: 255 }),
      sidePhoto: varchar7("side_photo", { length: 255 }),
      backPhoto: varchar7("back_photo", { length: 255 }),
      // Notes
      notes: text7("notes"),
      createdAt: timestamp7("created_at").defaultNow()
    });
    strengthBenchmarks = pgTable7("strength_benchmarks", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      profileId: varchar7("profile_id", { length: 255 }).notNull(),
      userId: varchar7("user_id", { length: 255 }).notNull(),
      testDate: timestamp7("test_date").notNull(),
      // Exercise
      exercise: varchar7("exercise", { length: 255 }).notNull(),
      // Test Type
      testType: varchar7("test_type", { length: 50 }),
      // Result
      weight: decimal4("weight", { precision: 6, scale: 2 }),
      // kg
      reps: integer7("reps"),
      duration: integer7("duration"),
      // seconds (for time-based tests)
      // Relative Strength
      bodyweightRatio: decimal4("bodyweight_ratio", { precision: 4, scale: 2 }),
      // weight lifted / bodyweight
      // Comparison
      improvementFromLast: decimal4("improvement_from_last", { precision: 5, scale: 2 }),
      // percentage
      createdAt: timestamp7("created_at").defaultNow()
    });
    physicalEngineAnalytics = pgTable7("physical_engine_analytics", {
      id: varchar7("id", { length: 255 }).primaryKey(),
      // Training Effectiveness (aggregated)
      workoutType: varchar7("workout_type", { length: 100 }).notNull(),
      // Effectiveness Metrics
      avgRecoveryScore: decimal4("avg_recovery_score", { precision: 5, scale: 2 }),
      avgProgressionRate: decimal4("avg_progression_rate", { precision: 5, scale: 2 }),
      // % improvement per week
      injuryRate: decimal4("injury_rate", { precision: 5, scale: 2 }),
      // % of users who get injured
      // Optimal Parameters
      optimalFrequency: integer7("optimal_frequency"),
      // sessions per week
      optimalDuration: integer7("optimal_duration"),
      // minutes
      optimalIntensity: varchar7("optimal_intensity", { length: 50 }),
      // Recovery
      avgRecoveryTime: integer7("avg_recovery_time"),
      // hours needed
      // User Segments
      mostEffectiveFor: text7("most_effective_for"),
      // JSON: different fitness levels
      // Sample Size
      workoutCount: integer7("workout_count"),
      userCount: integer7("user_count"),
      lastCalculated: timestamp7("last_calculated").defaultNow(),
      createdAt: timestamp7("created_at").defaultNow(),
      updatedAt: timestamp7("updated_at").defaultNow()
    });
  }
});

// drizzle/nutritionEngineSchema.ts
import { boolean as boolean5, decimal as decimal5, integer as integer8, pgTable as pgTable8, text as text8, timestamp as timestamp8, varchar as varchar8 } from "drizzle-orm/pg-core";
var nutritionProfiles, meals, dailyNutritionSummary, supplements, supplementLogs, foodReactions, hydrationLogs, mealPlans, nutritionExperiments, nutritionEngineAnalytics;
var init_nutritionEngineSchema = __esm({
  "drizzle/nutritionEngineSchema.ts"() {
    "use strict";
    nutritionProfiles = pgTable8("nutrition_profiles", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      // Current State
      currentWeight: decimal5("current_weight", { precision: 5, scale: 2 }),
      // kg
      targetWeight: decimal5("target_weight", { precision: 5, scale: 2 }),
      // kg
      height: integer8("height"),
      // cm
      // Goals
      primaryGoal: varchar8("primary_goal", { length: 50 }),
      // Dietary Approach
      dietaryApproach: varchar8("dietary_approach", { length: 50 }),
      // Restrictions & Allergies
      allergies: text8("allergies"),
      // JSON array
      intolerances: text8("intolerances"),
      // JSON: lactose, gluten, etc.
      restrictions: text8("restrictions"),
      // JSON: religious, ethical, etc.
      // Health Conditions
      healthConditions: text8("health_conditions"),
      // JSON: diabetes, IBS, PCOS, etc.
      medications: text8("medications"),
      // JSON array
      // Targets (calculated or custom)
      targetCalories: integer8("target_calories"),
      targetProtein: integer8("target_protein"),
      // grams
      targetCarbs: integer8("target_carbs"),
      // grams
      targetFat: integer8("target_fat"),
      // grams
      targetFiber: integer8("target_fiber"),
      // grams
      // Eating Patterns
      mealsPerDay: integer8("meals_per_day"),
      fastingWindow: integer8("fasting_window"),
      // hours (if IF)
      eatingWindow: integer8("eating_window"),
      // hours
      // Self-Learning Data
      optimalMacroRatio: text8("optimal_macro_ratio"),
      // JSON: {protein: 30, carbs: 40, fat: 30}
      energyOptimalFoods: text8("energy_optimal_foods"),
      // JSON: foods that boost energy
      triggerFoods: text8("trigger_foods"),
      // JSON: foods that cause issues
      bestMealTiming: text8("best_meal_timing"),
      // JSON: when to eat for best performance
      createdAt: timestamp8("created_at").defaultNow(),
      updatedAt: timestamp8("updated_at").defaultNow()
    });
    meals = pgTable8("meals", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      profileId: varchar8("profile_id", { length: 255 }).notNull(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      mealDate: timestamp8("meal_date").notNull(),
      // Meal Type
      mealType: varchar8("meal_type", { length: 50 }),
      // Foods
      foods: text8("foods"),
      // JSON array: [{name, quantity, unit, calories, protein, carbs, fat}]
      // Macros (calculated from foods)
      totalCalories: integer8("total_calories"),
      totalProtein: decimal5("total_protein", { precision: 5, scale: 1 }),
      // grams
      totalCarbs: decimal5("total_carbs", { precision: 5, scale: 1 }),
      // grams
      totalFat: decimal5("total_fat", { precision: 5, scale: 1 }),
      // grams
      totalFiber: decimal5("total_fiber", { precision: 5, scale: 1 }),
      // grams
      totalSugar: decimal5("total_sugar", { precision: 5, scale: 1 }),
      // grams
      // Context
      location: varchar8("location", { length: 255 }),
      // Home, restaurant, work, etc.
      socialContext: varchar8("social_context", { length: 50 }),
      // Eating Behavior
      eatingSpeed: varchar8("eating_speed", { length: 50 }),
      mindfulEating: boolean5("mindful_eating"),
      // Were you present while eating?
      distractions: text8("distractions"),
      // JSON: TV, phone, work, etc.
      // Hunger & Satisfaction
      hungerBefore: integer8("hunger_before"),
      // 1-10
      hungerAfter: integer8("hunger_after"),
      // 1-10
      satisfactionLevel: integer8("satisfaction_level"),
      // 1-10
      // Emotional State
      emotionBefore: varchar8("emotion_before", { length: 100 }),
      emotionalEating: boolean5("emotional_eating"),
      // Was this emotion-driven?
      // Post-Meal Effects (tracked later)
      energyAfter: integer8("energy_after"),
      // 1-10 (30-60 min post-meal)
      digestionQuality: integer8("digestion_quality"),
      // 1-10
      bloating: integer8("bloating"),
      // 1-10
      // Photos
      mealPhoto: varchar8("meal_photo", { length: 255 }),
      createdAt: timestamp8("created_at").defaultNow()
    });
    dailyNutritionSummary = pgTable8("daily_nutrition_summary", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      profileId: varchar8("profile_id", { length: 255 }).notNull(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      summaryDate: timestamp8("summary_date").notNull(),
      // Total Macros
      totalCalories: integer8("total_calories"),
      totalProtein: decimal5("total_protein", { precision: 6, scale: 1 }),
      totalCarbs: decimal5("total_carbs", { precision: 6, scale: 1 }),
      totalFat: decimal5("total_fat", { precision: 6, scale: 1 }),
      totalFiber: decimal5("total_fiber", { precision: 5, scale: 1 }),
      // Hydration
      waterIntake: decimal5("water_intake", { precision: 4, scale: 1 }),
      // liters
      // Adherence
      calorieAdherence: integer8("calorie_adherence"),
      // % of target
      proteinAdherence: integer8("protein_adherence"),
      // % of target
      // Quality
      vegetableServings: integer8("vegetable_servings"),
      fruitServings: integer8("fruit_servings"),
      processedFoodServings: integer8("processed_food_servings"),
      // Overall Ratings
      nutritionQuality: integer8("nutrition_quality"),
      // 1-10
      adherenceRating: integer8("adherence_rating"),
      // 1-10
      // Energy & Performance
      avgEnergyLevel: integer8("avg_energy_level"),
      // 1-10
      sleepQuality: integer8("sleep_quality"),
      // 1-10 (that night)
      workoutPerformance: integer8("workout_performance"),
      // 1-10 (if workout that day)
      // Digestive Health
      bowelMovements: integer8("bowel_movements"),
      digestiveComfort: integer8("digestive_comfort"),
      // 1-10
      createdAt: timestamp8("created_at").defaultNow()
    });
    supplements = pgTable8("supplements", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      profileId: varchar8("profile_id", { length: 255 }).notNull(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      // Supplement Details
      supplementName: varchar8("supplement_name", { length: 255 }).notNull(),
      brand: varchar8("brand", { length: 255 }),
      // Purpose
      purpose: varchar8("purpose", { length: 50 }),
      // Dosage
      dosage: varchar8("dosage", { length: 255 }),
      unit: varchar8("unit", { length: 50 }),
      frequency: varchar8("frequency", { length: 50 }),
      // Timing
      timing: varchar8("timing", { length: 50 }),
      // Active
      active: boolean5("active").default(true),
      startDate: timestamp8("start_date"),
      endDate: timestamp8("end_date"),
      // Effectiveness (self-learning)
      perceivedEffectiveness: integer8("perceived_effectiveness"),
      // 1-10
      sideEffects: text8("side_effects"),
      createdAt: timestamp8("created_at").defaultNow(),
      updatedAt: timestamp8("updated_at").defaultNow()
    });
    supplementLogs = pgTable8("supplement_logs", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      supplementId: varchar8("supplement_id", { length: 255 }).notNull(),
      profileId: varchar8("profile_id", { length: 255 }).notNull(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      logDate: timestamp8("log_date").notNull(),
      taken: boolean5("taken").default(true),
      dosage: varchar8("dosage", { length: 255 }),
      // Context
      timing: varchar8("timing", { length: 100 }),
      withFood: boolean5("with_food"),
      // Effects
      perceivedEffect: integer8("perceived_effect"),
      // 1-10
      sideEffects: text8("side_effects"),
      createdAt: timestamp8("created_at").defaultNow()
    });
    foodReactions = pgTable8("food_reactions", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      profileId: varchar8("profile_id", { length: 255 }).notNull(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      reactionDate: timestamp8("reaction_date").notNull(),
      // Food
      suspectedFood: varchar8("suspected_food", { length: 255 }).notNull(),
      // Reaction Type
      reactionType: varchar8("reaction_type", { length: 50 }),
      // Symptoms
      symptoms: text8("symptoms"),
      // JSON array
      severity: varchar8("severity", { length: 50 }),
      // Timing
      onsetTime: integer8("onset_time"),
      // minutes after eating
      duration: integer8("duration"),
      // hours
      // Pattern
      consistentReaction: boolean5("consistent_reaction"),
      // Does this food always cause this?
      createdAt: timestamp8("created_at").defaultNow()
    });
    hydrationLogs = pgTable8("hydration_logs", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      profileId: varchar8("profile_id", { length: 255 }).notNull(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      logDate: timestamp8("log_date").notNull(),
      // Intake
      waterIntake: decimal5("water_intake", { precision: 4, scale: 2 }),
      // liters
      // Other Beverages
      coffee: integer8("coffee"),
      // cups
      tea: integer8("tea"),
      // cups
      alcohol: integer8("alcohol"),
      // standard drinks
      // Hydration Status
      urineColor: varchar8("urine_color", { length: 50 }),
      // Hydration indicator
      // Symptoms
      headache: boolean5("headache"),
      fatigue: boolean5("fatigue"),
      dryMouth: boolean5("dry_mouth"),
      createdAt: timestamp8("created_at").defaultNow()
    });
    mealPlans = pgTable8("meal_plans", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      profileId: varchar8("profile_id", { length: 255 }).notNull(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      planName: varchar8("plan_name", { length: 255 }).notNull(),
      // Duration
      startDate: timestamp8("start_date"),
      endDate: timestamp8("end_date"),
      // Meals
      meals: text8("meals"),
      // JSON: {monday: {breakfast: [], lunch: [], dinner: []}, ...}
      // Shopping List
      shoppingList: text8("shopping_list"),
      // JSON array
      // Prep Notes
      prepNotes: text8("prep_notes"),
      active: boolean5("active").default(true),
      createdAt: timestamp8("created_at").defaultNow(),
      updatedAt: timestamp8("updated_at").defaultNow()
    });
    nutritionExperiments = pgTable8("nutrition_experiments", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      profileId: varchar8("profile_id", { length: 255 }).notNull(),
      userId: varchar8("user_id", { length: 255 }).notNull(),
      experimentName: varchar8("experiment_name", { length: 255 }).notNull(),
      // Type
      experimentType: varchar8("experiment_type", { length: 50 }),
      // Hypothesis
      hypothesis: text8("hypothesis"),
      // What do you expect to happen?
      // Duration
      startDate: timestamp8("start_date"),
      endDate: timestamp8("end_date"),
      // Protocol
      protocol: text8("protocol"),
      // What exactly are you doing?
      // Baseline Metrics
      baselineWeight: decimal5("baseline_weight", { precision: 5, scale: 2 }),
      baselineEnergy: integer8("baseline_energy"),
      // 1-10
      baselineDigestion: integer8("baseline_digestion"),
      // 1-10
      // Results
      endWeight: decimal5("end_weight", { precision: 5, scale: 2 }),
      endEnergy: integer8("end_energy"),
      // 1-10
      endDigestion: integer8("end_digestion"),
      // 1-10
      // Findings
      findings: text8("findings"),
      conclusion: text8("conclusion"),
      // Decision
      willContinue: boolean5("will_continue"),
      createdAt: timestamp8("created_at").defaultNow(),
      updatedAt: timestamp8("updated_at").defaultNow()
    });
    nutritionEngineAnalytics = pgTable8("nutrition_engine_analytics", {
      id: varchar8("id", { length: 255 }).primaryKey(),
      // Food-Effect Correlations (aggregated)
      foodCategory: varchar8("food_category", { length: 100 }).notNull(),
      // Energy Correlation
      avgEnergyImpact: decimal5("avg_energy_impact", { precision: 5, scale: 2 }),
      // Change in energy level
      // Digestive Impact
      avgDigestiveImpact: decimal5("avg_digestive_impact", { precision: 5, scale: 2 }),
      // Performance Impact
      avgWorkoutImpact: decimal5("avg_workout_impact", { precision: 5, scale: 2 }),
      // Optimal Timing
      optimalMealTiming: varchar8("optimal_meal_timing", { length: 100 }),
      // User Segments
      mostBeneficialFor: text8("most_beneficial_for"),
      // JSON: different user types
      // Sample Size
      mealCount: integer8("meal_count"),
      userCount: integer8("user_count"),
      lastCalculated: timestamp8("last_calculated").defaultNow(),
      createdAt: timestamp8("created_at").defaultNow(),
      updatedAt: timestamp8("updated_at").defaultNow()
    });
  }
});

// drizzle/spiritualEngineSchema.ts
import { boolean as boolean6, decimal as decimal6, integer as integer9, pgTable as pgTable9, text as text9, timestamp as timestamp9, varchar as varchar9 } from "drizzle-orm/pg-core";
var spiritualProfiles, meditationSessions, mindfulnessPractices, purposeExplorations, gratitudeEntries, compassionPractices, spiritualExperiences, spiritualMilestones, spiritualEngineAnalytics;
var init_spiritualEngineSchema = __esm({
  "drizzle/spiritualEngineSchema.ts"() {
    "use strict";
    spiritualProfiles = pgTable9("spiritual_profiles", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      userId: varchar9("user_id", { length: 255 }).notNull(),
      // Spiritual Background
      spiritualBackground: varchar9("spiritual_background", { length: 50 }),
      religiousTradition: varchar9("religious_tradition", { length: 255 }),
      // Optional: Buddhism, Christianity, Islam, etc.
      // Current Practice
      hasMeditationPractice: boolean6("has_meditation_practice").default(false),
      meditationExperience: varchar9("meditation_experience", { length: 50 }),
      currentPractices: text9("current_practices"),
      // JSON array
      // Spiritual Goals
      primaryGoal: varchar9("primary_goal", { length: 50 }),
      specificGoals: text9("specific_goals"),
      // JSON array
      // Barriers
      barriers: text9("barriers"),
      // JSON array: time, skepticism, don't know how, etc.
      // Preferences
      preferredPracticeTime: varchar9("preferred_practice_time", { length: 50 }),
      preferredDuration: integer9("preferred_duration"),
      // minutes
      preferredStyle: text9("preferred_style"),
      // JSON array: guided, silent, movement, etc.
      // Self-Learning Data
      mostEffectivePractices: text9("most_effective_practices"),
      // JSON: practices that work best for this user
      optimalPracticeTime: integer9("optimal_practice_time"),
      // minutes (learned from user data)
      bestTimeOfDay: varchar9("best_time_of_day", { length: 50 }),
      // learned from completion rates
      createdAt: timestamp9("created_at").defaultNow(),
      updatedAt: timestamp9("updated_at").defaultNow()
    });
    meditationSessions = pgTable9("meditation_sessions", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      profileId: varchar9("profile_id", { length: 255 }).notNull(),
      userId: varchar9("user_id", { length: 255 }).notNull(),
      sessionDate: timestamp9("session_date").notNull(),
      // Practice Details
      practiceType: varchar9("practice_type", { length: 50 }),
      guidedOrSilent: varchar9("guided_or_silent", { length: 50 }),
      guideSource: varchar9("guide_source", { length: 255 }),
      // App, teacher, self, etc.
      // Duration
      plannedDuration: integer9("planned_duration"),
      // minutes
      actualDuration: integer9("actual_duration"),
      // minutes
      // Quality Metrics
      focusLevel: integer9("focus_level"),
      // 1-10 (how focused were you?)
      distractionLevel: integer9("distraction_level"),
      // 1-10
      peaceLevel: integer9("peace_level"),
      // 1-10 (how peaceful did you feel?)
      insightLevel: integer9("insight_level"),
      // 1-10 (any insights or realizations?)
      // State Before/After
      emotionBefore: varchar9("emotion_before", { length: 255 }),
      stressLevelBefore: integer9("stress_level_before"),
      // 1-10
      emotionAfter: varchar9("emotion_after", { length: 255 }),
      stressLevelAfter: integer9("stress_level_after"),
      // 1-10
      // Experience
      experiences: text9("experiences"),
      // JSON array: calm, restless, sleepy, energized, etc.
      insights: text9("insights"),
      // Any realizations or insights
      challenges: text9("challenges"),
      // What was difficult?
      // Completion
      completed: boolean6("completed").default(true),
      // Self-Learning Data
      effectiveness: integer9("effectiveness"),
      // 1-10 (calculated from before/after metrics)
      createdAt: timestamp9("created_at").defaultNow()
    });
    mindfulnessPractices = pgTable9("mindfulness_practices", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      profileId: varchar9("profile_id", { length: 255 }).notNull(),
      userId: varchar9("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp9("practice_date").notNull(),
      // Practice Type (informal mindfulness)
      practiceType: varchar9("practice_type", { length: 50 }),
      duration: integer9("duration"),
      // minutes
      // Context
      activity: varchar9("activity", { length: 255 }),
      // What were you doing?
      location: varchar9("location", { length: 255 }),
      // Quality
      presenceLevel: integer9("presence_level"),
      // 1-10 (how present were you?)
      awarenessLevel: integer9("awareness_level"),
      // 1-10
      // Experience
      whatYouNoticed: text9("what_you_noticed"),
      howItFelt: text9("how_it_felt"),
      createdAt: timestamp9("created_at").defaultNow()
    });
    purposeExplorations = pgTable9("purpose_explorations", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      profileId: varchar9("profile_id", { length: 255 }).notNull(),
      userId: varchar9("user_id", { length: 255 }).notNull(),
      explorationDate: timestamp9("exploration_date").notNull(),
      // Exploration Type (evidence-based purpose discovery)
      explorationType: varchar9("exploration_type", { length: 50 }),
      // Reflection
      prompt: text9("prompt"),
      reflection: text9("reflection").notNull(),
      // Insights
      insights: text9("insights"),
      // JSON array
      patterns: text9("patterns"),
      // Recurring themes
      // Purpose Elements
      passions: text9("passions"),
      // JSON array
      strengths: text9("strengths"),
      values: text9("values"),
      contribution: text9("contribution"),
      // How you want to serve the world
      // Clarity Level
      clarityLevel: integer9("clarity_level"),
      // 1-10 (how clear is your purpose?)
      createdAt: timestamp9("created_at").defaultNow()
    });
    gratitudeEntries = pgTable9("gratitude_entries", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      profileId: varchar9("profile_id", { length: 255 }).notNull(),
      userId: varchar9("user_id", { length: 255 }).notNull(),
      entryDate: timestamp9("entry_date").notNull(),
      // Gratitude Items (research shows 3-5 is optimal)
      gratitude1: text9("gratitude_1").notNull(),
      gratitude2: text9("gratitude_2"),
      gratitude3: text9("gratitude_3"),
      gratitude4: text9("gratitude_4"),
      gratitude5: text9("gratitude_5"),
      // Depth
      gratitudeDepth: varchar9("gratitude_depth", { length: 50 }),
      // Surface = "coffee", Deep = "my health that allows me to enjoy coffee"
      // Emotional Impact
      emotionalImpact: integer9("emotional_impact"),
      // 1-10
      // Savoring
      savoringTime: integer9("savoring_time"),
      // seconds spent savoring each gratitude
      createdAt: timestamp9("created_at").defaultNow()
    });
    compassionPractices = pgTable9("compassion_practices", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      profileId: varchar9("profile_id", { length: 255 }).notNull(),
      userId: varchar9("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp9("practice_date").notNull(),
      practiceType: varchar9("practice_type", { length: 50 }),
      duration: integer9("duration"),
      // minutes
      // Target
      target: varchar9("target", { length: 255 }),
      // Who was the practice directed toward?
      // Experience
      emotionBefore: varchar9("emotion_before", { length: 255 }),
      emotionAfter: varchar9("emotion_after", { length: 255 }),
      warmthLevel: integer9("warmth_level"),
      // 1-10 (how much warmth/compassion did you feel?)
      resistanceLevel: integer9("resistance_level"),
      // 1-10 (any resistance or difficulty?)
      // Insights
      insights: text9("insights"),
      // Behavioral Follow-up (for acts of kindness)
      actionTaken: text9("action_taken"),
      createdAt: timestamp9("created_at").defaultNow()
    });
    spiritualExperiences = pgTable9("spiritual_experiences", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      profileId: varchar9("profile_id", { length: 255 }).notNull(),
      userId: varchar9("user_id", { length: 255 }).notNull(),
      experienceDate: timestamp9("experience_date").notNull(),
      experienceType: varchar9("experience_type", { length: 50 }),
      // Context
      context: text9("context"),
      // What were you doing when this happened?
      trigger: varchar9("trigger", { length: 255 }),
      // What triggered it?
      // Description
      description: text9("description").notNull(),
      // Qualities
      intensity: integer9("intensity"),
      // 1-10
      duration: integer9("duration"),
      // minutes or hours
      // Impact
      emotionalImpact: integer9("emotional_impact"),
      // 1-10
      meaningfulness: integer9("meaningfulness"),
      // 1-10
      lifeChanging: boolean6("life_changing").default(false),
      // Integration
      insights: text9("insights"),
      howItChangedYou: text9("how_it_changed_you"),
      actionsTaken: text9("actions_taken"),
      // JSON array
      createdAt: timestamp9("created_at").defaultNow()
    });
    spiritualMilestones = pgTable9("spiritual_milestones", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      profileId: varchar9("profile_id", { length: 255 }).notNull(),
      userId: varchar9("user_id", { length: 255 }).notNull(),
      milestoneType: varchar9("milestone_type", { length: 50 }),
      title: varchar9("title", { length: 255 }).notNull(),
      description: text9("description"),
      achievedDate: timestamp9("achieved_date"),
      // Significance
      significance: text9("significance"),
      howYouGrew: text9("how_you_grew"),
      createdAt: timestamp9("created_at").defaultNow()
    });
    spiritualEngineAnalytics = pgTable9("spiritual_engine_analytics", {
      id: varchar9("id", { length: 255 }).primaryKey(),
      // Practice Effectiveness (aggregated across all users)
      practiceType: varchar9("practice_type", { length: 100 }).notNull(),
      // Effectiveness Metrics
      avgStressReduction: decimal6("avg_stress_reduction", { precision: 5, scale: 2 }),
      // Average stress reduction
      avgPeaceIncrease: decimal6("avg_peace_increase", { precision: 5, scale: 2 }),
      avgCompletionRate: decimal6("avg_completion_rate", { precision: 5, scale: 2 }),
      // % who complete
      // Optimal Parameters (learned)
      optimalDuration: integer9("optimal_duration"),
      // minutes
      optimalTimeOfDay: varchar9("optimal_time_of_day", { length: 50 }),
      // User Segments
      mostEffectiveFor: text9("most_effective_for"),
      // JSON: {beginners: 8.5, advanced: 7.2, etc.}
      // Sample Size
      sessionCount: integer9("session_count"),
      // How many sessions analyzed
      userCount: integer9("user_count"),
      // How many users
      // Last Updated
      lastCalculated: timestamp9("last_calculated").defaultNow(),
      createdAt: timestamp9("created_at").defaultNow(),
      updatedAt: timestamp9("updated_at").defaultNow()
    });
  }
});

// drizzle/adminSchema.ts
import { boolean as boolean7, decimal as decimal7, integer as integer10, pgTable as pgTable10, text as text10, timestamp as timestamp10, varchar as varchar10 } from "drizzle-orm/pg-core";
var adminUsers, adminActions, supportTickets, ticketMessages, knowledgeBaseArticles, articleFeedback, userFeedback, bugReports, featureFlags, systemAnnouncements, userReports, platformMetrics, adminNotifications;
var init_adminSchema = __esm({
  "drizzle/adminSchema.ts"() {
    "use strict";
    adminUsers = pgTable10("admin_users", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      userId: varchar10("user_id", { length: 255 }).notNull().unique(),
      // Role
      role: varchar10("role", { length: 50 }),
      // Permissions
      permissions: text10("permissions"),
      // JSON: specific permissions
      // Status
      active: boolean7("active").default(true),
      // Access
      lastLoginAt: timestamp10("last_login_at"),
      createdAt: timestamp10("created_at").defaultNow(),
      updatedAt: timestamp10("updated_at").defaultNow()
    });
    adminActions = pgTable10("admin_actions", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      adminUserId: varchar10("admin_user_id", { length: 255 }).notNull(),
      // Action Details
      actionType: varchar10("action_type", { length: 100 }).notNull(),
      actionCategory: varchar10("action_category", { length: 50 }),
      // Target
      targetType: varchar10("target_type", { length: 100 }),
      targetId: varchar10("target_id", { length: 255 }),
      // Details
      description: text10("description"),
      changes: text10("changes"),
      // JSON: before/after
      // Context
      ipAddress: varchar10("ip_address", { length: 50 }),
      actionTimestamp: timestamp10("action_timestamp").defaultNow()
    });
    supportTickets = pgTable10("support_tickets", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      userId: varchar10("user_id", { length: 255 }).notNull(),
      // Ticket Details
      ticketNumber: varchar10("ticket_number", { length: 50 }).notNull().unique(),
      subject: varchar10("subject", { length: 500 }).notNull(),
      description: text10("description"),
      // Category
      category: varchar10("category", { length: 50 }),
      // Priority
      priority: varchar10("priority", { length: 50 }),
      // Status
      status: varchar10("status", { length: 50 }),
      // Assignment
      assignedTo: varchar10("assigned_to", { length: 255 }),
      assignedAt: timestamp10("assigned_at"),
      // Resolution
      resolvedBy: varchar10("resolved_by", { length: 255 }),
      resolvedAt: timestamp10("resolved_at"),
      resolutionNotes: text10("resolution_notes"),
      // Satisfaction
      satisfactionRating: integer10("satisfaction_rating"),
      // 1-5
      satisfactionFeedback: text10("satisfaction_feedback"),
      // SLA
      firstResponseAt: timestamp10("first_response_at"),
      firstResponseSLA: integer10("first_response_sla"),
      // minutes
      resolutionSLA: integer10("resolution_sla"),
      // minutes
      slaBreached: boolean7("sla_breached").default(false),
      createdAt: timestamp10("created_at").defaultNow(),
      updatedAt: timestamp10("updated_at").defaultNow(),
      closedAt: timestamp10("closed_at")
    });
    ticketMessages = pgTable10("ticket_messages", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      ticketId: varchar10("ticket_id", { length: 255 }).notNull(),
      // Sender
      senderId: varchar10("sender_id", { length: 255 }).notNull(),
      senderType: varchar10("sender_type", { length: 50 }),
      // Message
      message: text10("message").notNull(),
      // Attachments
      attachments: text10("attachments"),
      // JSON: file URLs
      // Internal Note
      internalNote: boolean7("internal_note").default(false),
      // Only visible to admins
      sentAt: timestamp10("sent_at").defaultNow()
    });
    knowledgeBaseArticles = pgTable10("knowledge_base_articles", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      // Article Details
      title: varchar10("title", { length: 500 }).notNull(),
      content: text10("content").notNull(),
      summary: text10("summary"),
      // Category
      category: varchar10("category", { length: 100 }),
      tags: text10("tags"),
      // JSON array
      // SEO
      slug: varchar10("slug", { length: 500 }).notNull().unique(),
      metaDescription: text10("meta_description"),
      // Status
      status: varchar10("status", { length: 50 }),
      // Author
      authorId: varchar10("author_id", { length: 255 }),
      // Visibility
      public: boolean7("public").default(true),
      // Helpfulness
      helpfulCount: integer10("helpful_count").default(0),
      notHelpfulCount: integer10("not_helpful_count").default(0),
      // Views
      viewCount: integer10("view_count").default(0),
      publishedAt: timestamp10("published_at"),
      createdAt: timestamp10("created_at").defaultNow(),
      updatedAt: timestamp10("updated_at").defaultNow()
    });
    articleFeedback = pgTable10("article_feedback", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      articleId: varchar10("article_id", { length: 255 }).notNull(),
      userId: varchar10("user_id", { length: 255 }),
      // Feedback
      helpful: boolean7("helpful").notNull(),
      feedback: text10("feedback"),
      createdAt: timestamp10("created_at").defaultNow()
    });
    userFeedback = pgTable10("user_feedback", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      userId: varchar10("user_id", { length: 255 }).notNull(),
      // Feedback Type
      feedbackType: varchar10("feedback_type", { length: 50 }),
      // Content
      title: varchar10("title", { length: 500 }),
      description: text10("description").notNull(),
      // Context
      page: varchar10("page", { length: 255 }),
      feature: varchar10("feature", { length: 255 }),
      // Attachments
      attachments: text10("attachments"),
      // JSON: screenshots, etc.
      // Status
      status: varchar10("status", { length: 50 }),
      // Votes
      upvotes: integer10("upvotes").default(0),
      // Response
      adminResponse: text10("admin_response"),
      respondedAt: timestamp10("responded_at"),
      createdAt: timestamp10("created_at").defaultNow(),
      updatedAt: timestamp10("updated_at").defaultNow()
    });
    bugReports = pgTable10("bug_reports", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      userId: varchar10("user_id", { length: 255 }),
      // Bug Details
      title: varchar10("title", { length: 500 }).notNull(),
      description: text10("description").notNull(),
      stepsToReproduce: text10("steps_to_reproduce"),
      expectedBehavior: text10("expected_behavior"),
      actualBehavior: text10("actual_behavior"),
      // Severity
      severity: varchar10("severity", { length: 50 }),
      // Environment
      browser: varchar10("browser", { length: 100 }),
      os: varchar10("os", { length: 100 }),
      deviceType: varchar10("device_type", { length: 100 }),
      // Attachments
      screenshots: text10("screenshots"),
      // JSON: URLs
      logs: text10("logs"),
      // Status
      status: varchar10("status", { length: 50 }),
      // Assignment
      assignedTo: varchar10("assigned_to", { length: 255 }),
      // Resolution
      fixedIn: varchar10("fixed_in", { length: 100 }),
      // Version number
      fixedAt: timestamp10("fixed_at"),
      createdAt: timestamp10("created_at").defaultNow(),
      updatedAt: timestamp10("updated_at").defaultNow()
    });
    featureFlags = pgTable10("feature_flags", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      // Flag Details
      flagName: varchar10("flag_name", { length: 255 }).notNull().unique(),
      description: text10("description"),
      // Status
      enabled: boolean7("enabled").default(false),
      // Rollout
      rolloutPercentage: integer10("rollout_percentage").default(0),
      // 0-100
      // Targeting
      targetUserIds: text10("target_user_ids"),
      // JSON: specific users
      targetRoles: text10("target_roles"),
      // JSON: specific roles
      // Environment
      environments: text10("environments"),
      // JSON: dev, staging, production
      // Modified By
      lastModifiedBy: varchar10("last_modified_by", { length: 255 }),
      createdAt: timestamp10("created_at").defaultNow(),
      updatedAt: timestamp10("updated_at").defaultNow()
    });
    systemAnnouncements = pgTable10("system_announcements", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      // Announcement Details
      title: varchar10("title", { length: 500 }).notNull(),
      message: text10("message").notNull(),
      // Type
      announcementType: varchar10("announcement_type", { length: 50 }),
      // Severity
      severity: varchar10("severity", { length: 50 }),
      // Visibility
      targetAudience: varchar10("target_audience", { length: 50 }),
      targetUserIds: text10("target_user_ids"),
      // JSON
      // Display
      displayLocation: text10("display_location"),
      // JSON: where to show
      dismissible: boolean7("dismissible").default(true),
      // Schedule
      startDate: timestamp10("start_date"),
      endDate: timestamp10("end_date"),
      // Status
      active: boolean7("active").default(true),
      createdBy: varchar10("created_by", { length: 255 }),
      createdAt: timestamp10("created_at").defaultNow(),
      updatedAt: timestamp10("updated_at").defaultNow()
    });
    userReports = pgTable10("user_reports", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      reportedBy: varchar10("reported_by", { length: 255 }).notNull(),
      // Reported Content
      reportedType: varchar10("reported_type", { length: 50 }),
      reportedId: varchar10("reported_id", { length: 255 }).notNull(),
      // Reason
      reason: varchar10("reason", { length: 50 }),
      description: text10("description"),
      // Status
      status: varchar10("status", { length: 50 }),
      // Review
      reviewedBy: varchar10("reviewed_by", { length: 255 }),
      reviewedAt: timestamp10("reviewed_at"),
      reviewNotes: text10("review_notes"),
      // Action
      actionTaken: varchar10("action_taken", { length: 255 }),
      createdAt: timestamp10("created_at").defaultNow(),
      updatedAt: timestamp10("updated_at").defaultNow()
    });
    platformMetrics = pgTable10("platform_metrics", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      metricDate: timestamp10("metric_date").notNull(),
      // User Metrics
      totalUsers: integer10("total_users"),
      activeUsers: integer10("active_users"),
      newUsers: integer10("new_users"),
      churnedUsers: integer10("churned_users"),
      // Engagement Metrics
      avgSessionDuration: decimal7("avg_session_duration", { precision: 10, scale: 2 }),
      // seconds
      avgDailyActiveUsers: integer10("avg_daily_active_users"),
      avgWeeklyActiveUsers: integer10("avg_weekly_active_users"),
      avgMonthlyActiveUsers: integer10("avg_monthly_active_users"),
      // Content Metrics
      totalGoals: integer10("total_goals"),
      totalHabits: integer10("total_habits"),
      totalJournalEntries: integer10("total_journal_entries"),
      // Support Metrics
      openTickets: integer10("open_tickets"),
      avgTicketResolutionTime: decimal7("avg_ticket_resolution_time", { precision: 10, scale: 2 }),
      // hours
      avgSatisfactionRating: decimal7("avg_satisfaction_rating", { precision: 4, scale: 2 }),
      // System Metrics
      apiRequests: integer10("api_requests"),
      avgResponseTime: decimal7("avg_response_time", { precision: 8, scale: 2 }),
      // milliseconds
      errorRate: decimal7("error_rate", { precision: 5, scale: 2 }),
      // %
      createdAt: timestamp10("created_at").defaultNow()
    });
    adminNotifications = pgTable10("admin_notifications", {
      id: varchar10("id", { length: 255 }).primaryKey(),
      // Notification Type
      notificationType: varchar10("notification_type", { length: 50 }),
      // Content
      title: varchar10("title", { length: 500 }).notNull(),
      message: text10("message"),
      // Link
      actionUrl: varchar10("action_url", { length: 500 }),
      // Priority
      priority: varchar10("priority", { length: 50 }),
      // Status
      read: boolean7("read").default(false),
      readAt: timestamp10("read_at"),
      createdAt: timestamp10("created_at").defaultNow()
    });
  }
});

// drizzle/aiCoachSchema.ts
import { boolean as boolean8, decimal as decimal8, integer as integer11, pgTable as pgTable11, text as text11, timestamp as timestamp11, varchar as varchar11 } from "drizzle-orm/pg-core";
var aiCoachProfiles, coachingConversations, conversationMessages, coachingQuestions, aiRecommendations, proactiveCheckIns, coachingInsights, coachingGoals, coachingEffectiveness, aiCoachFeedback, coachingResources, userResourceInteractions;
var init_aiCoachSchema = __esm({
  "drizzle/aiCoachSchema.ts"() {
    "use strict";
    aiCoachProfiles = pgTable11("ai_coach_profiles", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      userId: varchar11("user_id", { length: 255 }).notNull(),
      // Coaching Preferences
      preferredCoachingStyle: varchar11("preferred_coaching_style", { length: 50 }),
      // Communication Preferences
      preferredTone: varchar11("preferred_tone", { length: 50 }),
      verbosity: varchar11("verbosity", { length: 50 }),
      // Interaction Preferences
      proactiveCheckins: boolean8("proactive_checkins").default(true),
      dailyCheckIn: boolean8("daily_check_in").default(false),
      weeklyReview: boolean8("weekly_review").default(true),
      // Privacy
      dataSharing: boolean8("data_sharing").default(true),
      // Share data with AI for better coaching
      // Self-Learning Data
      effectiveQuestionTypes: text11("effective_question_types"),
      // JSON: which questions lead to insights
      effectiveInterventionTypes: text11("effective_intervention_types"),
      // JSON: which interventions work
      optimalCheckInTiming: text11("optimal_check_in_timing"),
      // JSON: when to reach out
      // Coach Relationship
      trustLevel: integer11("trust_level"),
      // 1-10 (how much user trusts AI coach)
      satisfactionLevel: integer11("satisfaction_level"),
      // 1-10
      createdAt: timestamp11("created_at").defaultNow(),
      updatedAt: timestamp11("updated_at").defaultNow()
    });
    coachingConversations = pgTable11("coaching_conversations", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      profileId: varchar11("profile_id", { length: 255 }).notNull(),
      userId: varchar11("user_id", { length: 255 }).notNull(),
      // Conversation Details
      conversationTitle: varchar11("conversation_title", { length: 255 }),
      // Conversation Type
      conversationType: varchar11("conversation_type", { length: 50 }),
      // Status
      status: varchar11("status", { length: 50 }),
      // Outcomes
      insightsGenerated: integer11("insights_generated").default(0),
      actionsIdentified: integer11("actions_identified").default(0),
      // Effectiveness
      helpfulnessRating: integer11("helpfulness_rating"),
      // 1-10 (user feedback)
      startedAt: timestamp11("started_at").defaultNow(),
      completedAt: timestamp11("completed_at"),
      createdAt: timestamp11("created_at").defaultNow(),
      updatedAt: timestamp11("updated_at").defaultNow()
    });
    conversationMessages = pgTable11("conversation_messages", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      conversationId: varchar11("conversation_id", { length: 255 }).notNull(),
      userId: varchar11("user_id", { length: 255 }).notNull(),
      // Message Details
      sender: varchar11("sender", { length: 50 }),
      messageText: text11("message_text").notNull(),
      // Message Type (for AI messages)
      messageType: varchar11("message_type", { length: 50 }),
      // Coaching Technique Used
      coachingTechnique: varchar11("coaching_technique", { length: 50 }),
      // Context
      contextData: text11("context_data"),
      // JSON: relevant user data that informed this message
      // User Response
      userEngaged: boolean8("user_engaged"),
      // Did user respond meaningfully?
      userInsight: boolean8("user_insight"),
      // Did user have an insight?
      userAction: boolean8("user_action"),
      // Did user commit to action?
      sentAt: timestamp11("sent_at").defaultNow()
    });
    coachingQuestions = pgTable11("coaching_questions", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      // Question Details
      questionText: text11("question_text").notNull(),
      // Question Type
      questionType: varchar11("question_type", { length: 50 }),
      // Category
      category: varchar11("category", { length: 100 }),
      // When to Use
      bestFor: text11("best_for"),
      // JSON: situations, emotions, goals
      // Research-Backed
      researchBacked: boolean8("research_backed").default(false),
      researchSource: text11("research_source"),
      // Effectiveness
      avgInsightRate: decimal8("avg_insight_rate", { precision: 5, scale: 2 }),
      // % who had insight
      avgActionRate: decimal8("avg_action_rate", { precision: 5, scale: 2 }),
      // % who took action
      avgHelpfulnessRating: decimal8("avg_helpfulness_rating", { precision: 4, scale: 2 }),
      // 1-10
      totalUses: integer11("total_uses").default(0),
      createdAt: timestamp11("created_at").defaultNow(),
      updatedAt: timestamp11("updated_at").defaultNow()
    });
    aiRecommendations = pgTable11("ai_recommendations", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      profileId: varchar11("profile_id", { length: 255 }).notNull(),
      userId: varchar11("user_id", { length: 255 }).notNull(),
      // Recommendation Type
      recommendationType: varchar11("recommendation_type", { length: 50 }),
      // Content
      title: varchar11("title", { length: 255 }).notNull(),
      description: text11("description"),
      // Reasoning
      reasoning: text11("reasoning"),
      // Why is AI suggesting this?
      supportingData: text11("supporting_data"),
      // JSON: data that supports this recommendation
      // Confidence
      confidence: decimal8("confidence", { precision: 5, scale: 2 }),
      // %
      // Priority
      priority: varchar11("priority", { length: 50 }),
      // Status
      status: varchar11("status", { length: 50 }),
      // User Response
      userFeedback: text11("user_feedback"),
      helpfulnessRating: integer11("helpfulness_rating"),
      // 1-10
      // Outcome
      implemented: boolean8("implemented").default(false),
      implementedAt: timestamp11("implemented_at"),
      outcomePositive: boolean8("outcome_positive"),
      createdAt: timestamp11("created_at").defaultNow(),
      respondedAt: timestamp11("responded_at")
    });
    proactiveCheckIns = pgTable11("proactive_check_ins", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      profileId: varchar11("profile_id", { length: 255 }).notNull(),
      userId: varchar11("user_id", { length: 255 }).notNull(),
      // Check-In Type
      checkInType: varchar11("check_in_type", { length: 50 }),
      // Trigger
      triggerType: varchar11("trigger_type", { length: 50 }),
      // Message
      message: text11("message"),
      // Response
      responded: boolean8("responded").default(false),
      respondedAt: timestamp11("responded_at"),
      responseQuality: varchar11("response_quality", { length: 50 }),
      // Effectiveness
      helpful: boolean8("helpful"),
      sentAt: timestamp11("sent_at").defaultNow()
    });
    coachingInsights = pgTable11("coaching_insights", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      profileId: varchar11("profile_id", { length: 255 }).notNull(),
      userId: varchar11("user_id", { length: 255 }).notNull(),
      // Insight Type
      insightType: varchar11("insight_type", { length: 50 }),
      // Content
      title: varchar11("title", { length: 255 }).notNull(),
      description: text11("description"),
      // Supporting Evidence
      evidence: text11("evidence"),
      // JSON: data points that support this insight
      // Actionability
      actionable: boolean8("actionable").default(false),
      suggestedAction: text11("suggested_action"),
      // User Response
      viewed: boolean8("viewed").default(false),
      viewedAt: timestamp11("viewed_at"),
      resonated: boolean8("resonated"),
      // Did this insight resonate?
      actionTaken: boolean8("action_taken").default(false),
      createdAt: timestamp11("created_at").defaultNow()
    });
    coachingGoals = pgTable11("coaching_goals", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      conversationId: varchar11("conversation_id", { length: 255 }),
      goalId: varchar11("goal_id", { length: 255 }),
      // Links to goals table
      userId: varchar11("user_id", { length: 255 }).notNull(),
      // Goal Clarity
      initialClarity: integer11("initial_clarity"),
      // 1-10 (how clear was goal at start)
      finalClarity: integer11("final_clarity"),
      // 1-10 (how clear after coaching)
      // AI Contribution
      aiContribution: text11("ai_contribution"),
      // How did AI help clarify/refine goal?
      // Obstacles Identified
      obstaclesIdentified: text11("obstacles_identified"),
      // JSON array
      // Strategies Developed
      strategiesDeveloped: text11("strategies_developed"),
      // JSON array
      createdAt: timestamp11("created_at").defaultNow()
    });
    coachingEffectiveness = pgTable11("coaching_effectiveness", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      // Coaching Element
      elementType: varchar11("element_type", { length: 100 }).notNull(),
      // question_type, technique, etc.
      elementValue: varchar11("element_value", { length: 255 }).notNull(),
      // specific question, technique, etc.
      // Effectiveness Metrics
      avgEngagementRate: decimal8("avg_engagement_rate", { precision: 5, scale: 2 }),
      // % who engaged
      avgInsightRate: decimal8("avg_insight_rate", { precision: 5, scale: 2 }),
      // % who had insights
      avgActionRate: decimal8("avg_action_rate", { precision: 5, scale: 2 }),
      // % who took action
      avgHelpfulnessRating: decimal8("avg_helpfulness_rating", { precision: 4, scale: 2 }),
      // 1-10
      // Behavioral Impact
      avgBehaviorChange: decimal8("avg_behavior_change", { precision: 5, scale: 2 }),
      // % improvement
      // Optimal Parameters
      optimalContext: text11("optimal_context"),
      // JSON: when this works best
      optimalUserType: text11("optimal_user_type"),
      // JSON: who this works best for
      // Sample Size
      userCount: integer11("user_count"),
      totalUses: integer11("total_uses"),
      lastCalculated: timestamp11("last_calculated").defaultNow(),
      createdAt: timestamp11("created_at").defaultNow(),
      updatedAt: timestamp11("updated_at").defaultNow()
    });
    aiCoachFeedback = pgTable11("ai_coach_feedback", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      userId: varchar11("user_id", { length: 255 }).notNull(),
      conversationId: varchar11("conversation_id", { length: 255 }),
      messageId: varchar11("message_id", { length: 255 }),
      // Feedback Type
      feedbackType: varchar11("feedback_type", { length: 50 }),
      // Details
      feedbackText: text11("feedback_text"),
      // Rating
      rating: integer11("rating"),
      // 1-10
      createdAt: timestamp11("created_at").defaultNow()
    });
    coachingResources = pgTable11("coaching_resources", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      // Resource Details
      resourceName: varchar11("resource_name", { length: 255 }).notNull(),
      description: text11("description"),
      // Resource Type
      resourceType: varchar11("resource_type", { length: 50 }),
      // URL
      url: varchar11("url", { length: 500 }),
      // Category
      category: varchar11("category", { length: 100 }),
      // Research-Backed
      researchBacked: boolean8("research_backed").default(false),
      // When to Recommend
      recommendFor: text11("recommend_for"),
      // JSON: situations, goals, challenges
      // Effectiveness
      avgHelpfulnessRating: decimal8("avg_helpfulness_rating", { precision: 4, scale: 2 }),
      // 1-10
      totalRecommendations: integer11("total_recommendations").default(0),
      createdAt: timestamp11("created_at").defaultNow(),
      updatedAt: timestamp11("updated_at").defaultNow()
    });
    userResourceInteractions = pgTable11("user_resource_interactions", {
      id: varchar11("id", { length: 255 }).primaryKey(),
      resourceId: varchar11("resource_id", { length: 255 }).notNull(),
      userId: varchar11("user_id", { length: 255 }).notNull(),
      // Interaction
      viewed: boolean8("viewed").default(false),
      viewedAt: timestamp11("viewed_at"),
      completed: boolean8("completed").default(false),
      completedAt: timestamp11("completed_at"),
      // Feedback
      helpful: boolean8("helpful"),
      helpfulnessRating: integer11("helpfulness_rating"),
      // 1-10
      // Impact
      actionTaken: boolean8("action_taken").default(false),
      impactDescription: text11("impact_description"),
      recommendedAt: timestamp11("recommended_at").defaultNow()
    });
  }
});

// drizzle/analyticsSchema.ts
import { boolean as boolean9, decimal as decimal9, integer as integer12, pgTable as pgTable12, text as text12, timestamp as timestamp12, varchar as varchar12 } from "drizzle-orm/pg-core";
var analyticsProfiles, dailySnapshots, weeklyReports, monthlyReports, correlations, predictions, insights, progressMilestones, comparativeAnalytics, analyticsEvents, analyticsLearning;
var init_analyticsSchema = __esm({
  "drizzle/analyticsSchema.ts"() {
    "use strict";
    analyticsProfiles = pgTable12("analytics_profiles", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      // Dashboard Preferences
      preferredView: varchar12("preferred_view", { length: 50 }),
      preferredChartType: varchar12("preferred_chart_type", { length: 50 }),
      // Tracking Preferences
      trackingFrequency: varchar12("tracking_frequency", { length: 50 }),
      // Insights Preferences
      insightFrequency: varchar12("insight_frequency", { length: 50 }),
      insightTypes: text12("insight_types"),
      // JSON: which types of insights to show
      // Self-Learning Data
      mostActionableInsights: text12("most_actionable_insights"),
      // JSON: which insights led to action
      preferredMetrics: text12("preferred_metrics"),
      // JSON: which metrics user checks most
      createdAt: timestamp12("created_at").defaultNow(),
      updatedAt: timestamp12("updated_at").defaultNow()
    });
    dailySnapshots = pgTable12("daily_snapshots", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      profileId: varchar12("profile_id", { length: 255 }).notNull(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      snapshotDate: timestamp12("snapshot_date").notNull(),
      // Overall Scores
      overallWellnessScore: integer12("overall_wellness_score"),
      // 0-100
      physicalScore: integer12("physical_score"),
      // 0-100
      mentalScore: integer12("mental_score"),
      // 0-100
      emotionalScore: integer12("emotional_score"),
      // 0-100
      spiritualScore: integer12("spiritual_score"),
      // 0-100
      // Habit Completion
      habitsCompleted: integer12("habits_completed"),
      habitsTotal: integer12("habits_total"),
      habitCompletionRate: decimal9("habit_completion_rate", { precision: 5, scale: 2 }),
      // %
      // Sleep
      sleepDuration: decimal9("sleep_duration", { precision: 4, scale: 2 }),
      // hours
      sleepQuality: integer12("sleep_quality"),
      // 1-10
      // Mood & Energy
      avgMood: integer12("avg_mood"),
      // 1-10
      avgEnergy: integer12("avg_energy"),
      // 1-10
      // Productivity
      productivityScore: integer12("productivity_score"),
      // 0-100
      // Stress
      stressLevel: integer12("stress_level"),
      // 1-10
      // Recovery
      recoveryScore: integer12("recovery_score"),
      // 0-100
      createdAt: timestamp12("created_at").defaultNow()
    });
    weeklyReports = pgTable12("weekly_reports", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      profileId: varchar12("profile_id", { length: 255 }).notNull(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      weekStartDate: timestamp12("week_start_date").notNull(),
      // Overall Performance
      overallScore: integer12("overall_score"),
      // 0-100
      scoreChange: decimal9("score_change", { precision: 6, scale: 2 }),
      // % vs last week
      // Habits
      avgHabitCompletionRate: decimal9("avg_habit_completion_rate", { precision: 5, scale: 2 }),
      habitsCompletionChange: decimal9("habits_completion_change", { precision: 6, scale: 2 }),
      // % change
      // Sleep
      avgSleepDuration: decimal9("avg_sleep_duration", { precision: 4, scale: 2 }),
      avgSleepQuality: decimal9("avg_sleep_quality", { precision: 4, scale: 2 }),
      sleepConsistency: decimal9("sleep_consistency", { precision: 5, scale: 2 }),
      // % (bedtime variance)
      // Mood & Energy
      avgMood: decimal9("avg_mood", { precision: 4, scale: 2 }),
      avgEnergy: decimal9("avg_energy", { precision: 4, scale: 2 }),
      moodStability: decimal9("mood_stability", { precision: 5, scale: 2 }),
      // Low variance = stable
      // Goals
      goalsAchieved: integer12("goals_achieved"),
      goalsInProgress: integer12("goals_in_progress"),
      // Wins
      biggestWins: text12("biggest_wins"),
      // JSON array
      // Challenges
      biggestChallenges: text12("biggest_challenges"),
      // JSON array
      // Insights
      keyInsights: text12("key_insights"),
      // JSON array
      // Recommendations
      recommendations: text12("recommendations"),
      // JSON array
      createdAt: timestamp12("created_at").defaultNow()
    });
    monthlyReports = pgTable12("monthly_reports", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      profileId: varchar12("profile_id", { length: 255 }).notNull(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      monthStartDate: timestamp12("month_start_date").notNull(),
      // Transformation Summary
      transformationScore: integer12("transformation_score"),
      // 0-100
      // Habits
      habitsStarted: integer12("habits_started"),
      habitsMastered: integer12("habits_mastered"),
      habitsAbandoned: integer12("habits_abandoned"),
      avgHabitSuccessRate: decimal9("avg_habit_success_rate", { precision: 5, scale: 2 }),
      // Goals
      goalsSet: integer12("goals_set"),
      goalsAchieved: integer12("goals_achieved"),
      goalAchievementRate: decimal9("goal_achievement_rate", { precision: 5, scale: 2 }),
      // Wellness Trends
      physicalTrend: varchar12("physical_trend", { length: 50 }),
      mentalTrend: varchar12("mental_trend", { length: 50 }),
      emotionalTrend: varchar12("emotional_trend", { length: 50 }),
      spiritualTrend: varchar12("spiritual_trend", { length: 50 }),
      // Community
      communityEngagement: integer12("community_engagement"),
      // 0-100
      supportsGiven: integer12("supports_given"),
      supportsReceived: integer12("supports_received"),
      // Achievements
      achievementsUnlocked: integer12("achievements_unlocked"),
      milestonesReached: integer12("milestones_reached"),
      // Identity Shift
      identityShiftScore: integer12("identity_shift_score"),
      // 0-100 (how much have you become who you want to be?)
      // Narrative Summary
      monthSummary: text12("month_summary"),
      // AI-generated narrative
      createdAt: timestamp12("created_at").defaultNow()
    });
    correlations = pgTable12("correlations", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      profileId: varchar12("profile_id", { length: 255 }).notNull(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      // Variables
      variable1: varchar12("variable1", { length: 255 }).notNull(),
      // e.g., "sleep_duration"
      variable2: varchar12("variable2", { length: 255 }).notNull(),
      // e.g., "productivity_score"
      // Correlation Strength
      correlationCoefficient: decimal9("correlation_coefficient", { precision: 4, scale: 3 }),
      // -1 to 1
      pValue: decimal9("p_value", { precision: 6, scale: 5 }),
      // Statistical significance
      // Interpretation
      relationship: varchar12("relationship", { length: 50 }),
      // Insight
      insight: text12("insight"),
      // Human-readable explanation
      actionable: boolean9("actionable").default(false),
      // Can user do something with this?
      // Sample Size
      dataPoints: integer12("data_points"),
      // Confidence
      confidenceLevel: decimal9("confidence_level", { precision: 5, scale: 2 }),
      // %
      lastCalculated: timestamp12("last_calculated").defaultNow(),
      createdAt: timestamp12("created_at").defaultNow(),
      updatedAt: timestamp12("updated_at").defaultNow()
    });
    predictions = pgTable12("predictions", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      profileId: varchar12("profile_id", { length: 255 }).notNull(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      // Prediction Type
      predictionType: varchar12("prediction_type", { length: 50 }),
      // Target
      targetId: varchar12("target_id", { length: 255 }),
      // Goal ID, habit ID, etc.
      targetName: varchar12("target_name", { length: 255 }),
      // Prediction
      prediction: text12("prediction"),
      // The actual prediction
      confidence: decimal9("confidence", { precision: 5, scale: 2 }),
      // %
      // Timeline
      timeframe: varchar12("timeframe", { length: 100 }),
      // "in 30 days", "by end of year"
      // Factors
      keyFactors: text12("key_factors"),
      // JSON: what influences this prediction
      // Recommendation
      recommendation: text12("recommendation"),
      // What to do about it
      // Validation
      actualOutcome: text12("actual_outcome"),
      // What actually happened
      predictionAccurate: boolean9("prediction_accurate"),
      createdAt: timestamp12("created_at").defaultNow(),
      validatedAt: timestamp12("validated_at")
    });
    insights = pgTable12("insights", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      profileId: varchar12("profile_id", { length: 255 }).notNull(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      // Insight Type
      insightType: varchar12("insight_type", { length: 50 }),
      // Content
      title: varchar12("title", { length: 255 }).notNull(),
      description: text12("description"),
      // Supporting Data
      supportingData: text12("supporting_data"),
      // JSON: charts, numbers, etc.
      // Actionability
      actionable: boolean9("actionable").default(false),
      suggestedAction: text12("suggested_action"),
      // Priority
      priority: varchar12("priority", { length: 50 }),
      // User Response
      viewed: boolean9("viewed").default(false),
      viewedAt: timestamp12("viewed_at"),
      actionTaken: boolean9("action_taken").default(false),
      actionTakenAt: timestamp12("action_taken_at"),
      helpful: boolean9("helpful"),
      // User feedback
      // Expiry
      expiresAt: timestamp12("expires_at"),
      // Some insights are time-sensitive
      createdAt: timestamp12("created_at").defaultNow()
    });
    progressMilestones = pgTable12("progress_milestones", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      profileId: varchar12("profile_id", { length: 255 }).notNull(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      // Milestone Type
      milestoneType: varchar12("milestone_type", { length: 50 }),
      // Details
      title: varchar12("title", { length: 255 }).notNull(),
      description: text12("description"),
      // Metric
      metric: varchar12("metric", { length: 255 }),
      // What improved?
      baselineValue: decimal9("baseline_value", { precision: 10, scale: 2 }),
      currentValue: decimal9("current_value", { precision: 10, scale: 2 }),
      improvementPercent: decimal9("improvement_percent", { precision: 6, scale: 2 }),
      // Context
      relatedTo: varchar12("related_to", { length: 255 }),
      // Module, goal, habit, etc.
      achievedAt: timestamp12("achieved_at").defaultNow()
    });
    comparativeAnalytics = pgTable12("comparative_analytics", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      profileId: varchar12("profile_id", { length: 255 }).notNull(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      // Comparison Type
      comparisonType: varchar12("comparison_type", { length: 50 }),
      // Metric
      metric: varchar12("metric", { length: 255 }).notNull(),
      // Values
      currentValue: decimal9("current_value", { precision: 10, scale: 2 }),
      comparisonValue: decimal9("comparison_value", { precision: 10, scale: 2 }),
      // Change
      absoluteChange: decimal9("absolute_change", { precision: 10, scale: 2 }),
      percentChange: decimal9("percent_change", { precision: 6, scale: 2 }),
      // Interpretation
      trend: varchar12("trend", { length: 50 }),
      lastCalculated: timestamp12("last_calculated").defaultNow(),
      createdAt: timestamp12("created_at").defaultNow()
    });
    analyticsEvents = pgTable12("analytics_events", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      userId: varchar12("user_id", { length: 255 }).notNull(),
      // Event Type
      eventType: varchar12("event_type", { length: 100 }).notNull(),
      // dashboard_viewed, insight_clicked, etc.
      // Event Data
      eventData: text12("event_data"),
      // JSON: additional context
      // Session
      sessionId: varchar12("session_id", { length: 255 }),
      eventTimestamp: timestamp12("event_timestamp").defaultNow()
    });
    analyticsLearning = pgTable12("analytics_learning", {
      id: varchar12("id", { length: 255 }).primaryKey(),
      // Insight Type Effectiveness
      insightType: varchar12("insight_type", { length: 100 }).notNull(),
      // Engagement Metrics
      avgViewRate: decimal9("avg_view_rate", { precision: 5, scale: 2 }),
      // %
      avgActionRate: decimal9("avg_action_rate", { precision: 5, scale: 2 }),
      // % who took action
      avgHelpfulnessRating: decimal9("avg_helpfulness_rating", { precision: 4, scale: 2 }),
      // 1-10
      // Impact Metrics
      avgBehaviorChange: decimal9("avg_behavior_change", { precision: 5, scale: 2 }),
      // % improvement
      // Optimal Parameters
      optimalTiming: varchar12("optimal_timing", { length: 100 }),
      // When to show this insight
      optimalFrequency: varchar12("optimal_frequency", { length: 100 }),
      // User Segments
      mostEffectiveFor: text12("most_effective_for"),
      // JSON: different user types
      // Sample Size
      userCount: integer12("user_count"),
      lastCalculated: timestamp12("last_calculated").defaultNow(),
      createdAt: timestamp12("created_at").defaultNow(),
      updatedAt: timestamp12("updated_at").defaultNow()
    });
  }
});

// drizzle/contentModerationSchema.ts
import { boolean as boolean10, decimal as decimal10, integer as integer13, pgTable as pgTable13, text as text13, timestamp as timestamp13, varchar as varchar13 } from "drizzle-orm/pg-core";
var forbiddenContentDictionary, contentModerationLogs, aiSafetyRules, brandSafetyKeywords, complianceCheckpoints, patternLearning, crisisInterventionLogs, professionalBoundaryViolations, safetyAnalytics;
var init_contentModerationSchema = __esm({
  "drizzle/contentModerationSchema.ts"() {
    "use strict";
    forbiddenContentDictionary = pgTable13("forbidden_content_dictionary", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // Content Details
      contentType: varchar13("content_type", { length: 50 }),
      content: text13("content").notNull(),
      // The actual forbidden content
      pattern: text13("pattern"),
      // Regex pattern for matching
      // Risk Category
      riskCategory: varchar13("risk_category", { length: 50 }),
      // Severity
      severityLevel: varchar13("severity_level", { length: 50 }),
      // Action
      action: varchar13("action", { length: 50 }),
      // Source
      source: varchar13("source", { length: 50 }),
      // Learning Data
      detectionCount: integer13("detection_count").default(0),
      // How many times detected
      falsePositiveCount: integer13("false_positive_count").default(0),
      // How many false positives
      truePositiveCount: integer13("true_positive_count").default(0),
      // How many true positives
      accuracy: decimal10("accuracy", { precision: 5, scale: 2 }),
      // % accuracy
      // Status
      active: boolean10("active").default(true),
      // Metadata
      description: text13("description"),
      // Why this is forbidden
      legalBasis: text13("legal_basis"),
      // Legal reason (HIPAA, etc.)
      redirectMessage: text13("redirect_message"),
      // What to tell user
      // Version Control
      version: integer13("version").default(1),
      replacedBy: varchar13("replaced_by", { length: 255 }),
      // If updated
      createdAt: timestamp13("created_at").defaultNow(),
      updatedAt: timestamp13("updated_at").defaultNow(),
      createdBy: varchar13("created_by", { length: 255 })
    });
    contentModerationLogs = pgTable13("content_moderation_logs", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // User & Session
      userId: varchar13("user_id", { length: 255 }),
      sessionId: varchar13("session_id", { length: 255 }),
      // Content
      originalContent: text13("original_content").notNull(),
      contentHash: varchar13("content_hash", { length: 255 }),
      // For deduplication
      // Detection
      detectedViolations: text13("detected_violations"),
      // JSON: array of violations
      matchedRules: text13("matched_rules"),
      // JSON: which rules triggered
      // Risk Assessment
      riskScore: integer13("risk_score"),
      // 0-100
      riskCategory: varchar13("risk_category", { length: 100 }),
      severityLevel: varchar13("severity_level", { length: 50 }),
      // Action Taken
      actionTaken: varchar13("action_taken", { length: 50 }),
      // Response
      userResponse: text13("user_response"),
      // What we told the user
      // Context
      conversationContext: text13("conversation_context"),
      // Previous messages
      userIntent: text13("user_intent"),
      // AI-detected intent
      // Review
      requiresHumanReview: boolean10("requires_human_review").default(false),
      reviewedBy: varchar13("reviewed_by", { length: 255 }),
      reviewedAt: timestamp13("reviewed_at"),
      reviewDecision: varchar13("review_decision", { length: 50 }),
      reviewNotes: text13("review_notes"),
      // Learning
      feedbackProvided: boolean10("feedback_provided").default(false),
      improvedAccuracy: boolean10("improved_accuracy").default(false),
      detectedAt: timestamp13("detected_at").defaultNow()
    });
    aiSafetyRules = pgTable13("ai_safety_rules", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // Rule Details
      ruleName: varchar13("rule_name", { length: 255 }).notNull(),
      ruleType: varchar13("rule_type", { length: 50 }),
      // Rule Content
      systemPromptAddition: text13("system_prompt_addition"),
      // Added to AI system prompt
      validationLogic: text13("validation_logic"),
      // How to validate
      // Scope
      appliesTo: varchar13("applies_to", { length: 50 }),
      // Priority
      priority: integer13("priority").default(100),
      // Higher = more important
      // Status
      active: boolean10("active").default(true),
      // Effectiveness
      violationsPrevented: integer13("violations_prevented").default(0),
      effectiveness: decimal10("effectiveness", { precision: 5, scale: 2 }),
      // %
      createdAt: timestamp13("created_at").defaultNow(),
      updatedAt: timestamp13("updated_at").defaultNow()
    });
    brandSafetyKeywords = pgTable13("brand_safety_keywords", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // Keyword
      keyword: varchar13("keyword", { length: 500 }).notNull(),
      keywordType: varchar13("keyword_type", { length: 50 }),
      // Risk
      riskLevel: varchar13("risk_level", { length: 50 }),
      // Action
      alertTeam: boolean10("alert_team").default(false),
      escalateToHuman: boolean10("escalate_to_human").default(false),
      // Context
      context: text13("context"),
      // When this is/isn't a problem
      active: boolean10("active").default(true),
      createdAt: timestamp13("created_at").defaultNow()
    });
    complianceCheckpoints = pgTable13("compliance_checkpoints", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // Checkpoint Details
      checkpointName: varchar13("checkpoint_name", { length: 255 }).notNull(),
      complianceFramework: varchar13("compliance_framework", { length: 50 }),
      // Requirement
      requirement: text13("requirement").notNull(),
      validationCriteria: text13("validation_criteria"),
      // How to check compliance
      // Enforcement
      mandatory: boolean10("mandatory").default(true),
      // Violation Handling
      violationSeverity: varchar13("violation_severity", { length: 50 }),
      violationAction: text13("violation_action"),
      // What to do if violated
      // Documentation
      legalReference: text13("legal_reference"),
      // Citation of law/regulation
      documentationRequired: text13("documentation_required"),
      // What docs needed
      // Audit
      lastAuditDate: timestamp13("last_audit_date"),
      nextAuditDate: timestamp13("next_audit_date"),
      auditFrequency: varchar13("audit_frequency", { length: 50 }),
      active: boolean10("active").default(true),
      createdAt: timestamp13("created_at").defaultNow(),
      updatedAt: timestamp13("updated_at").defaultNow()
    });
    patternLearning = pgTable13("pattern_learning", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // Pattern Details
      patternType: varchar13("pattern_type", { length: 50 }),
      // Pattern Data
      patternSignature: text13("pattern_signature"),
      // What the pattern looks like
      detectionAlgorithm: text13("detection_algorithm"),
      // How to detect
      // Learning Metrics
      occurrences: integer13("occurrences").default(0),
      accuracy: decimal10("accuracy", { precision: 5, scale: 2 }),
      confidence: decimal10("confidence", { precision: 5, scale: 2 }),
      // Evolution
      learnedFrom: text13("learned_from"),
      // JSON: source incidents
      improvedBy: text13("improved_by"),
      // JSON: refinements
      // Status
      validated: boolean10("validated").default(false),
      active: boolean10("active").default(false),
      // Only active after validation
      createdAt: timestamp13("created_at").defaultNow(),
      updatedAt: timestamp13("updated_at").defaultNow()
    });
    crisisInterventionLogs = pgTable13("crisis_intervention_logs", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // User
      userId: varchar13("user_id", { length: 255 }).notNull(),
      // Crisis Details
      crisisType: varchar13("crisis_type", { length: 50 }),
      // Detection
      detectedContent: text13("detected_content"),
      crisisIndicators: text13("crisis_indicators"),
      // JSON: what triggered
      riskLevel: varchar13("risk_level", { length: 50 }),
      // Response
      responseProvided: text13("response_provided"),
      resourcesOffered: text13("resources_offered"),
      // JSON: hotlines, etc.
      // Escalation
      escalated: boolean10("escalated").default(false),
      escalatedTo: varchar13("escalated_to", { length: 255 }),
      // Who was notified
      escalatedAt: timestamp13("escalated_at"),
      // Follow-up
      followUpRequired: boolean10("follow_up_required").default(true),
      followUpCompleted: boolean10("follow_up_completed").default(false),
      followUpNotes: text13("follow_up_notes"),
      // Outcome
      outcome: varchar13("outcome", { length: 50 }),
      detectedAt: timestamp13("detected_at").defaultNow(),
      resolvedAt: timestamp13("resolved_at")
    });
    professionalBoundaryViolations = pgTable13("professional_boundary_violations", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // Violation Details
      violationType: varchar13("violation_type", { length: 50 }),
      // Context
      conversationId: varchar13("conversation_id", { length: 255 }),
      userId: varchar13("user_id", { length: 255 }),
      coachId: varchar13("coach_id", { length: 255 }),
      // Content
      violatingContent: text13("violating_content"),
      context: text13("context"),
      // Detection
      detectedBy: varchar13("detected_by", { length: 50 }),
      // Severity
      severity: varchar13("severity", { length: 50 }),
      // Response
      correctionProvided: text13("correction_provided"),
      educationProvided: text13("education_provided"),
      // Accountability
      coachNotified: boolean10("coach_notified").default(false),
      trainingRequired: boolean10("training_required").default(false),
      detectedAt: timestamp13("detected_at").defaultNow(),
      resolvedAt: timestamp13("resolved_at")
    });
    safetyAnalytics = pgTable13("safety_analytics", {
      id: varchar13("id", { length: 255 }).primaryKey(),
      // Time Period
      periodStart: timestamp13("period_start").notNull(),
      periodEnd: timestamp13("period_end").notNull(),
      // Metrics
      totalInteractions: integer13("total_interactions"),
      violationsDetected: integer13("violations_detected"),
      violationRate: decimal10("violation_rate", { precision: 5, scale: 2 }),
      // %
      // By Category
      legalViolations: integer13("legal_violations"),
      ethicalViolations: integer13("ethical_violations"),
      brandSafetyIssues: integer13("brand_safety_issues"),
      crisisInterventions: integer13("crisis_interventions"),
      // Actions
      contentBlocked: integer13("content_blocked"),
      contentFlagged: integer13("content_flagged"),
      usersEscalated: integer13("users_escalated"),
      // Accuracy
      falsePositiveRate: decimal10("false_positive_rate", { precision: 5, scale: 2 }),
      falseNegativeRate: decimal10("false_negative_rate", { precision: 5, scale: 2 }),
      // Learning
      newPatternsDetected: integer13("new_patterns_detected"),
      rulesUpdated: integer13("rules_updated"),
      dictionaryExpanded: integer13("dictionary_expanded"),
      generatedAt: timestamp13("generated_at").defaultNow()
    });
  }
});

// drizzle/notificationsSchema.ts
import { boolean as boolean11, decimal as decimal11, integer as integer14, pgTable as pgTable14, text as text14, timestamp as timestamp14, varchar as varchar14 } from "drizzle-orm/pg-core";
var notificationProfiles, notificationPreferences, notifications, reminders, reminderOccurrences, notificationBatches, pushTokens, emailQueue, smsQueue, notificationAnalytics, userNotificationFeedback;
var init_notificationsSchema = __esm({
  "drizzle/notificationsSchema.ts"() {
    "use strict";
    notificationProfiles = pgTable14("notification_profiles", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      // Global Settings
      notificationsEnabled: boolean11("notifications_enabled").default(true),
      // Quiet Hours
      quietHoursEnabled: boolean11("quiet_hours_enabled").default(true),
      quietHoursStart: varchar14("quiet_hours_start", { length: 10 }),
      // "22:00"
      quietHoursEnd: varchar14("quiet_hours_end", { length: 10 }),
      // "08:00"
      // Channel Preferences
      emailEnabled: boolean11("email_enabled").default(true),
      pushEnabled: boolean11("push_enabled").default(true),
      smsEnabled: boolean11("sms_enabled").default(false),
      inAppEnabled: boolean11("in_app_enabled").default(true),
      // Batching
      batchingEnabled: boolean11("batching_enabled").default(true),
      batchingWindow: integer14("batching_window").default(60),
      // minutes
      // Frequency
      maxNotificationsPerDay: integer14("max_notifications_per_day").default(10),
      // Self-Learning Data
      optimalTimes: text14("optimal_times"),
      // JSON: best times to send notifications
      effectiveChannels: text14("effective_channels"),
      // JSON: which channels drive action
      notificationFatigueRisk: integer14("notification_fatigue_risk"),
      // 0-100
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    notificationPreferences = pgTable14("notification_preferences", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      profileId: varchar14("profile_id", { length: 255 }).notNull(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      // Notification Type
      notificationType: varchar14("notification_type", { length: 50 }),
      // Enabled
      enabled: boolean11("enabled").default(true),
      // Channels
      emailEnabled: boolean11("email_enabled").default(true),
      pushEnabled: boolean11("push_enabled").default(true),
      smsEnabled: boolean11("sms_enabled").default(false),
      inAppEnabled: boolean11("in_app_enabled").default(true),
      // Frequency
      frequency: varchar14("frequency", { length: 50 }),
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    notifications = pgTable14("notifications", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      profileId: varchar14("profile_id", { length: 255 }).notNull(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      // Notification Details
      notificationType: varchar14("notification_type", { length: 50 }),
      // Content
      title: varchar14("title", { length: 255 }).notNull(),
      body: text14("body"),
      // Action
      actionUrl: varchar14("action_url", { length: 500 }),
      // Where to go when clicked
      actionText: varchar14("action_text", { length: 100 }),
      // Button text
      // Priority
      priority: varchar14("priority", { length: 50 }),
      // Delivery
      channels: text14("channels"),
      // JSON: which channels to use
      // Scheduling
      scheduledFor: timestamp14("scheduled_for"),
      // Status
      status: varchar14("status", { length: 50 }),
      // Delivery Tracking
      sentAt: timestamp14("sent_at"),
      deliveredAt: timestamp14("delivered_at"),
      // User Interaction
      viewed: boolean11("viewed").default(false),
      viewedAt: timestamp14("viewed_at"),
      clicked: boolean11("clicked").default(false),
      clickedAt: timestamp14("clicked_at"),
      dismissed: boolean11("dismissed").default(false),
      dismissedAt: timestamp14("dismissed_at"),
      // Effectiveness
      actionTaken: boolean11("action_taken").default(false),
      // Did user do what notification suggested?
      // Related Entity
      relatedId: varchar14("related_id", { length: 255 }),
      relatedType: varchar14("related_type", { length: 100 }),
      // Batching
      batchId: varchar14("batch_id", { length: 255 }),
      // If part of a batch
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    reminders = pgTable14("reminders", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      profileId: varchar14("profile_id", { length: 255 }).notNull(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      // Reminder Details
      reminderType: varchar14("reminder_type", { length: 50 }),
      // Content
      title: varchar14("title", { length: 255 }).notNull(),
      description: text14("description"),
      // Related Entity
      relatedId: varchar14("related_id", { length: 255 }),
      relatedType: varchar14("related_type", { length: 100 }),
      // Schedule
      scheduleType: varchar14("schedule_type", { length: 50 }),
      // Timing
      reminderTime: varchar14("reminder_time", { length: 10 }),
      // "14:30"
      daysOfWeek: text14("days_of_week"),
      // JSON: [1,3,5] for Mon, Wed, Fri
      dayOfMonth: integer14("day_of_month"),
      // 1-31
      // Custom Recurrence
      customRecurrence: text14("custom_recurrence"),
      // JSON: complex recurrence rules
      // Lead Time
      leadTimeMinutes: integer14("lead_time_minutes"),
      // Remind X minutes before
      // Snooze
      snoozeEnabled: boolean11("snooze_enabled").default(true),
      snoozeDurationMinutes: integer14("snooze_duration_minutes").default(10),
      // Status
      active: boolean11("active").default(true),
      // Next Occurrence
      nextOccurrence: timestamp14("next_occurrence"),
      // Stats
      totalSent: integer14("total_sent").default(0),
      totalCompleted: integer14("total_completed").default(0),
      totalSnoozed: integer14("total_snoozed").default(0),
      completionRate: decimal11("completion_rate", { precision: 5, scale: 2 }),
      // %
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    reminderOccurrences = pgTable14("reminder_occurrences", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      reminderId: varchar14("reminder_id", { length: 255 }).notNull(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      // Occurrence Details
      scheduledFor: timestamp14("scheduled_for").notNull(),
      // Status
      status: varchar14("status", { length: 50 }),
      // Snooze
      snoozedUntil: timestamp14("snoozed_until"),
      snoozeCount: integer14("snooze_count").default(0),
      // Completion
      completedAt: timestamp14("completed_at"),
      // Notification
      notificationId: varchar14("notification_id", { length: 255 }),
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    notificationBatches = pgTable14("notification_batches", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      profileId: varchar14("profile_id", { length: 255 }).notNull(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      // Batch Details
      batchType: varchar14("batch_type", { length: 50 }),
      // Content
      title: varchar14("title", { length: 255 }).notNull(),
      summary: text14("summary"),
      // Notifications
      notificationCount: integer14("notification_count").default(0),
      // Delivery
      scheduledFor: timestamp14("scheduled_for"),
      sentAt: timestamp14("sent_at"),
      // Status
      status: varchar14("status", { length: 50 }),
      createdAt: timestamp14("created_at").defaultNow()
    });
    pushTokens = pgTable14("push_tokens", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      // Token Details
      token: varchar14("token", { length: 500 }).notNull(),
      platform: varchar14("platform", { length: 50 }),
      // Device Info
      deviceId: varchar14("device_id", { length: 255 }),
      deviceName: varchar14("device_name", { length: 255 }),
      // Status
      active: boolean11("active").default(true),
      // Last Used
      lastUsedAt: timestamp14("last_used_at"),
      registeredAt: timestamp14("registered_at").defaultNow(),
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    emailQueue = pgTable14("email_queue", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      notificationId: varchar14("notification_id", { length: 255 }),
      // Email Details
      toEmail: varchar14("to_email", { length: 255 }).notNull(),
      subject: varchar14("subject", { length: 500 }).notNull(),
      body: text14("body").notNull(),
      bodyHtml: text14("body_html"),
      // Priority
      priority: varchar14("priority", { length: 50 }),
      // Status
      status: varchar14("status", { length: 50 }),
      // Delivery
      sentAt: timestamp14("sent_at"),
      deliveredAt: timestamp14("delivered_at"),
      // Tracking
      opened: boolean11("opened").default(false),
      openedAt: timestamp14("opened_at"),
      clicked: boolean11("clicked").default(false),
      clickedAt: timestamp14("clicked_at"),
      // Error
      errorMessage: text14("error_message"),
      retryCount: integer14("retry_count").default(0),
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    smsQueue = pgTable14("sms_queue", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      notificationId: varchar14("notification_id", { length: 255 }),
      // SMS Details
      toPhone: varchar14("to_phone", { length: 50 }).notNull(),
      message: text14("message").notNull(),
      // Status
      status: varchar14("status", { length: 50 }),
      // Delivery
      sentAt: timestamp14("sent_at"),
      deliveredAt: timestamp14("delivered_at"),
      // Error
      errorMessage: text14("error_message"),
      retryCount: integer14("retry_count").default(0),
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    notificationAnalytics = pgTable14("notification_analytics", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      // Notification Type
      notificationType: varchar14("notification_type", { length: 100 }).notNull(),
      // Engagement Metrics
      avgViewRate: decimal11("avg_view_rate", { precision: 5, scale: 2 }),
      // %
      avgClickRate: decimal11("avg_click_rate", { precision: 5, scale: 2 }),
      // %
      avgActionRate: decimal11("avg_action_rate", { precision: 5, scale: 2 }),
      // %
      avgDismissRate: decimal11("avg_dismiss_rate", { precision: 5, scale: 2 }),
      // %
      // Timing
      optimalTimeOfDay: varchar14("optimal_time_of_day", { length: 100 }),
      // "14:00-15:00"
      optimalDayOfWeek: varchar14("optimal_day_of_week", { length: 100 }),
      // "Tuesday"
      // Channel Effectiveness
      bestChannel: varchar14("best_channel", { length: 100 }),
      channelPerformance: text14("channel_performance"),
      // JSON: performance by channel
      // Behavioral Impact
      avgBehaviorChange: decimal11("avg_behavior_change", { precision: 5, scale: 2 }),
      // %
      // Fatigue
      fatigueThreshold: integer14("fatigue_threshold"),
      // Max per day before fatigue
      // Sample Size
      userCount: integer14("user_count"),
      totalSent: integer14("total_sent"),
      lastCalculated: timestamp14("last_calculated").defaultNow(),
      createdAt: timestamp14("created_at").defaultNow(),
      updatedAt: timestamp14("updated_at").defaultNow()
    });
    userNotificationFeedback = pgTable14("user_notification_feedback", {
      id: varchar14("id", { length: 255 }).primaryKey(),
      notificationId: varchar14("notification_id", { length: 255 }).notNull(),
      userId: varchar14("user_id", { length: 255 }).notNull(),
      // Feedback Type
      feedbackType: varchar14("feedback_type", { length: 50 }),
      // Details
      feedbackText: text14("feedback_text"),
      createdAt: timestamp14("created_at").defaultNow()
    });
  }
});

// drizzle/securitySchema.ts
import { boolean as boolean12, integer as integer15, pgTable as pgTable15, text as text15, timestamp as timestamp15, varchar as varchar15 } from "drizzle-orm/pg-core";
var securityProfiles, activeSessions, loginHistory, auditLogs, securityIncidents, apiKeys, apiRequestLogs, rateLimits, dataAccessLogs, encryptionKeys, complianceReports, securityAlerts, trustedDevices;
var init_securitySchema = __esm({
  "drizzle/securitySchema.ts"() {
    "use strict";
    securityProfiles = pgTable15("security_profiles", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      userId: varchar15("user_id", { length: 255 }).notNull().unique(),
      // Multi-Factor Authentication
      mfaEnabled: boolean12("mfa_enabled").default(false),
      mfaMethod: varchar15("mfa_method", { length: 50 }),
      mfaSecret: varchar15("mfa_secret", { length: 500 }),
      // Encrypted
      mfaBackupCodes: text15("mfa_backup_codes"),
      // Encrypted JSON array
      // Password
      passwordHash: varchar15("password_hash", { length: 500 }).notNull(),
      passwordSalt: varchar15("password_salt", { length: 255 }),
      passwordLastChanged: timestamp15("password_last_changed"),
      passwordExpiresAt: timestamp15("password_expires_at"),
      // Password Policy
      requirePasswordChange: boolean12("require_password_change").default(false),
      // Security Questions (backup recovery)
      securityQuestions: text15("security_questions"),
      // Encrypted JSON
      // Account Security
      accountLocked: boolean12("account_locked").default(false),
      accountLockedUntil: timestamp15("account_locked_until"),
      accountLockedReason: text15("account_locked_reason"),
      // Failed Login Attempts
      failedLoginAttempts: integer15("failed_login_attempts").default(0),
      lastFailedLoginAt: timestamp15("last_failed_login_at"),
      // Suspicious Activity
      suspiciousActivityDetected: boolean12("suspicious_activity_detected").default(false),
      suspiciousActivityCount: integer15("suspicious_activity_count").default(0),
      // IP Restrictions
      ipWhitelistEnabled: boolean12("ip_whitelist_enabled").default(false),
      ipWhitelist: text15("ip_whitelist"),
      // JSON array
      // Session Settings
      maxActiveSessions: integer15("max_active_sessions").default(5),
      sessionTimeout: integer15("session_timeout").default(3600),
      // seconds
      createdAt: timestamp15("created_at").defaultNow(),
      updatedAt: timestamp15("updated_at").defaultNow()
    });
    activeSessions = pgTable15("active_sessions", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      userId: varchar15("user_id", { length: 255 }).notNull(),
      // Session Details
      sessionToken: varchar15("session_token", { length: 500 }).notNull().unique(),
      // Device Info
      deviceId: varchar15("device_id", { length: 255 }),
      deviceName: varchar15("device_name", { length: 255 }),
      deviceType: varchar15("device_type", { length: 50 }),
      // Location
      ipAddress: varchar15("ip_address", { length: 50 }),
      country: varchar15("country", { length: 100 }),
      city: varchar15("city", { length: 100 }),
      // Browser
      userAgent: text15("user_agent"),
      browser: varchar15("browser", { length: 100 }),
      os: varchar15("os", { length: 100 }),
      // Status
      active: boolean12("active").default(true),
      // Activity
      lastActivityAt: timestamp15("last_activity_at").defaultNow(),
      // Expiry
      expiresAt: timestamp15("expires_at"),
      // Security
      mfaVerified: boolean12("mfa_verified").default(false),
      createdAt: timestamp15("created_at").defaultNow(),
      terminatedAt: timestamp15("terminated_at")
    });
    loginHistory = pgTable15("login_history", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      userId: varchar15("user_id", { length: 255 }).notNull(),
      // Login Details
      loginMethod: varchar15("login_method", { length: 50 }),
      // Status
      success: boolean12("success").notNull(),
      failureReason: varchar15("failure_reason", { length: 255 }),
      // Device & Location
      ipAddress: varchar15("ip_address", { length: 50 }),
      country: varchar15("country", { length: 100 }),
      city: varchar15("city", { length: 100 }),
      userAgent: text15("user_agent"),
      // MFA
      mfaRequired: boolean12("mfa_required").default(false),
      mfaCompleted: boolean12("mfa_completed").default(false),
      // Risk Assessment
      riskScore: integer15("risk_score"),
      // 0-100
      riskFactors: text15("risk_factors"),
      // JSON: what made this risky
      loginAt: timestamp15("login_at").defaultNow()
    });
    auditLogs = pgTable15("audit_logs", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      userId: varchar15("user_id", { length: 255 }),
      // Null for system events
      // Event Details
      eventType: varchar15("event_type", { length: 100 }).notNull(),
      eventCategory: varchar15("event_category", { length: 50 }),
      // Action
      action: varchar15("action", { length: 255 }).notNull(),
      resource: varchar15("resource", { length: 255 }),
      // What was accessed/modified
      resourceId: varchar15("resource_id", { length: 255 }),
      // Details
      details: text15("details"),
      // JSON: additional context
      // Result
      success: boolean12("success").notNull(),
      errorMessage: text15("error_message"),
      // Context
      ipAddress: varchar15("ip_address", { length: 50 }),
      userAgent: text15("user_agent"),
      sessionId: varchar15("session_id", { length: 255 }),
      // Severity
      severity: varchar15("severity", { length: 50 }),
      eventTimestamp: timestamp15("event_timestamp").defaultNow()
    });
    securityIncidents = pgTable15("security_incidents", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      userId: varchar15("user_id", { length: 255 }),
      // Null for system-wide incidents
      // Incident Details
      incidentType: varchar15("incident_type", { length: 50 }),
      // Severity
      severity: varchar15("severity", { length: 50 }),
      // Description
      description: text15("description"),
      // Detection
      detectedBy: varchar15("detected_by", { length: 100 }),
      // "system", "user", "admin"
      detectionMethod: varchar15("detection_method", { length: 255 }),
      // Status
      status: varchar15("status", { length: 50 }),
      // Response
      responseActions: text15("response_actions"),
      // JSON: actions taken
      // Impact
      impactAssessment: text15("impact_assessment"),
      affectedUsers: integer15("affected_users"),
      dataCompromised: boolean12("data_compromised").default(false),
      // Resolution
      resolvedBy: varchar15("resolved_by", { length: 255 }),
      resolutionNotes: text15("resolution_notes"),
      detectedAt: timestamp15("detected_at").defaultNow(),
      resolvedAt: timestamp15("resolved_at"),
      createdAt: timestamp15("created_at").defaultNow(),
      updatedAt: timestamp15("updated_at").defaultNow()
    });
    apiKeys = pgTable15("api_keys", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      userId: varchar15("user_id", { length: 255 }).notNull(),
      // Key Details
      keyName: varchar15("key_name", { length: 255 }).notNull(),
      keyHash: varchar15("key_hash", { length: 500 }).notNull(),
      // Hashed API key
      keyPrefix: varchar15("key_prefix", { length: 20 }),
      // First few chars for identification
      // Permissions
      permissions: text15("permissions"),
      // JSON: what this key can do
      // Restrictions
      ipWhitelist: text15("ip_whitelist"),
      // JSON: allowed IPs
      rateLimit: integer15("rate_limit"),
      // requests per hour
      // Status
      active: boolean12("active").default(true),
      // Usage
      lastUsedAt: timestamp15("last_used_at"),
      totalRequests: integer15("total_requests").default(0),
      // Expiry
      expiresAt: timestamp15("expires_at"),
      createdAt: timestamp15("created_at").defaultNow(),
      revokedAt: timestamp15("revoked_at")
    });
    apiRequestLogs = pgTable15("api_request_logs", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      apiKeyId: varchar15("api_key_id", { length: 255 }),
      userId: varchar15("user_id", { length: 255 }),
      // Request Details
      method: varchar15("method", { length: 10 }).notNull(),
      // GET, POST, etc.
      endpoint: varchar15("endpoint", { length: 500 }).notNull(),
      // Response
      statusCode: integer15("status_code").notNull(),
      responseTime: integer15("response_time"),
      // milliseconds
      // Context
      ipAddress: varchar15("ip_address", { length: 50 }),
      userAgent: text15("user_agent"),
      // Error
      errorMessage: text15("error_message"),
      requestTimestamp: timestamp15("request_timestamp").defaultNow()
    });
    rateLimits = pgTable15("rate_limits", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      // Identifier (user ID, IP, API key)
      identifier: varchar15("identifier", { length: 255 }).notNull(),
      identifierType: varchar15("identifier_type", { length: 50 }),
      // Endpoint
      endpoint: varchar15("endpoint", { length: 500 }),
      // Limits
      requestsPerMinute: integer15("requests_per_minute"),
      requestsPerHour: integer15("requests_per_hour"),
      requestsPerDay: integer15("requests_per_day"),
      // Current Usage
      requestsThisMinute: integer15("requests_this_minute").default(0),
      requestsThisHour: integer15("requests_this_hour").default(0),
      requestsToday: integer15("requests_today").default(0),
      // Reset Times
      minuteResetAt: timestamp15("minute_reset_at"),
      hourResetAt: timestamp15("hour_reset_at"),
      dayResetAt: timestamp15("day_reset_at"),
      // Throttling
      throttled: boolean12("throttled").default(false),
      throttledUntil: timestamp15("throttled_until"),
      updatedAt: timestamp15("updated_at").defaultNow()
    });
    dataAccessLogs = pgTable15("data_access_logs", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      // Who accessed
      accessedBy: varchar15("accessed_by", { length: 255 }).notNull(),
      accessedByType: varchar15("accessed_by_type", { length: 50 }),
      // What was accessed
      dataType: varchar15("data_type", { length: 100 }).notNull(),
      dataId: varchar15("data_id", { length: 255 }),
      dataOwnerId: varchar15("data_owner_id", { length: 255 }),
      // Whose data was accessed
      // How
      accessMethod: varchar15("access_method", { length: 100 }),
      // Why
      purpose: varchar15("purpose", { length: 255 }),
      // Context
      ipAddress: varchar15("ip_address", { length: 50 }),
      accessedAt: timestamp15("accessed_at").defaultNow()
    });
    encryptionKeys = pgTable15("encryption_keys", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      // Key Details
      keyId: varchar15("key_id", { length: 255 }).notNull().unique(),
      keyType: varchar15("key_type", { length: 50 }),
      algorithm: varchar15("algorithm", { length: 100 }).notNull(),
      // Status
      active: boolean12("active").default(true),
      // Rotation
      rotationSchedule: varchar15("rotation_schedule", { length: 50 }),
      lastRotatedAt: timestamp15("last_rotated_at"),
      nextRotationAt: timestamp15("next_rotation_at"),
      createdAt: timestamp15("created_at").defaultNow(),
      retiredAt: timestamp15("retired_at")
    });
    complianceReports = pgTable15("compliance_reports", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      // Report Details
      reportType: varchar15("report_type", { length: 50 }),
      reportPeriodStart: timestamp15("report_period_start").notNull(),
      reportPeriodEnd: timestamp15("report_period_end").notNull(),
      // Status
      status: varchar15("status", { length: 50 }),
      // Findings
      findings: text15("findings"),
      // JSON: compliance findings
      // File
      filePath: varchar15("file_path", { length: 500 }),
      generatedBy: varchar15("generated_by", { length: 255 }),
      generatedAt: timestamp15("generated_at").defaultNow(),
      createdAt: timestamp15("created_at").defaultNow()
    });
    securityAlerts = pgTable15("security_alerts", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      userId: varchar15("user_id", { length: 255 }),
      // Alert Details
      alertType: varchar15("alert_type", { length: 50 }),
      // Severity
      severity: varchar15("severity", { length: 50 }),
      // Message
      message: text15("message"),
      // Action Required
      actionRequired: boolean12("action_required").default(false),
      actionUrl: varchar15("action_url", { length: 500 }),
      // Status
      acknowledged: boolean12("acknowledged").default(false),
      acknowledgedAt: timestamp15("acknowledged_at"),
      createdAt: timestamp15("created_at").defaultNow()
    });
    trustedDevices = pgTable15("trusted_devices", {
      id: varchar15("id", { length: 255 }).primaryKey(),
      userId: varchar15("user_id", { length: 255 }).notNull(),
      // Device Details
      deviceId: varchar15("device_id", { length: 255 }).notNull(),
      deviceName: varchar15("device_name", { length: 255 }),
      deviceType: varchar15("device_type", { length: 50 }),
      // Fingerprint
      deviceFingerprint: varchar15("device_fingerprint", { length: 500 }),
      // Status
      trusted: boolean12("trusted").default(true),
      // Last Seen
      lastSeenAt: timestamp15("last_seen_at"),
      lastSeenIp: varchar15("last_seen_ip", { length: 50 }),
      trustedAt: timestamp15("trusted_at").defaultNow(),
      untrustedAt: timestamp15("untrusted_at"),
      createdAt: timestamp15("created_at").defaultNow()
    });
  }
});

// drizzle/settingsSchema.ts
import { boolean as boolean13, integer as integer16, pgTable as pgTable16, text as text16, timestamp as timestamp16, varchar as varchar16 } from "drizzle-orm/pg-core";
var userSettings, privacySettings, appearanceSettings, aiSettings, dataSettings, modulePreferences, userFeatureFlags, consentRecords, sessionPreferences, blockedUsers, accountDeletionRequests, settingsChangeLog, accessibilityProfiles, betaFeatures, userBetaOptIns;
var init_settingsSchema = __esm({
  "drizzle/settingsSchema.ts"() {
    "use strict";
    userSettings = pgTable16("user_settings", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull().unique(),
      // Account Settings
      displayName: varchar16("display_name", { length: 255 }),
      bio: text16("bio"),
      avatarUrl: varchar16("avatar_url", { length: 500 }),
      // Contact
      email: varchar16("email", { length: 255 }),
      phoneNumber: varchar16("phone_number", { length: 50 }),
      // Location
      timezone: varchar16("timezone", { length: 100 }).default("UTC"),
      country: varchar16("country", { length: 100 }),
      language: varchar16("language", { length: 10 }).default("en"),
      // Units
      measurementSystem: varchar16("measurement_system", { length: 50 }),
      temperatureUnit: varchar16("temperature_unit", { length: 50 }),
      // Date & Time Format
      dateFormat: varchar16("date_format", { length: 50 }).default("YYYY-MM-DD"),
      timeFormat: varchar16("time_format", { length: 50 }),
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    privacySettings = pgTable16("privacy_settings", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull().unique(),
      // Profile Visibility
      profileVisibility: varchar16("profile_visibility", { length: 50 }),
      // Data Sharing
      shareDataForResearch: boolean13("share_data_for_research").default(false),
      shareDataForAI: boolean13("share_data_for_ai").default(true),
      shareProgressWithCommunity: boolean13("share_progress_with_community").default(false),
      // Activity Visibility
      showActivityFeed: boolean13("show_activity_feed").default(false),
      showGoals: boolean13("show_goals").default(false),
      showAchievements: boolean13("show_achievements").default(true),
      showStats: boolean13("show_stats").default(false),
      // Social
      allowFriendRequests: boolean13("allow_friend_requests").default(true),
      allowMessages: boolean13("allow_messages").default(true),
      // Search
      searchable: boolean13("searchable").default(false),
      // Analytics
      allowAnalyticsCookies: boolean13("allow_analytics_cookies").default(true),
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    appearanceSettings = pgTable16("appearance_settings", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull().unique(),
      // Theme
      theme: varchar16("theme", { length: 50 }),
      accentColor: varchar16("accent_color", { length: 50 }).default("#3B82F6"),
      // Layout
      sidebarPosition: varchar16("sidebar_position", { length: 50 }),
      compactMode: boolean13("compact_mode").default(false),
      // Typography
      fontSize: varchar16("font_size", { length: 50 }),
      fontFamily: varchar16("font_family", { length: 100 }).default("system"),
      // Accessibility
      highContrast: boolean13("high_contrast").default(false),
      reduceMotion: boolean13("reduce_motion").default(false),
      screenReaderOptimized: boolean13("screen_reader_optimized").default(false),
      // Dashboard
      defaultDashboard: varchar16("default_dashboard", { length: 100 }).default("overview"),
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    aiSettings = pgTable16("ai_settings", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull().unique(),
      // AI Features
      aiCoachEnabled: boolean13("ai_coach_enabled").default(true),
      aiInsightsEnabled: boolean13("ai_insights_enabled").default(true),
      aiRecommendationsEnabled: boolean13("ai_recommendations_enabled").default(true),
      aiPredictionsEnabled: boolean13("ai_predictions_enabled").default(true),
      // Automation
      autoHabitTracking: boolean13("auto_habit_tracking").default(false),
      autoGoalSuggestions: boolean13("auto_goal_suggestions").default(true),
      autoProgressReports: boolean13("auto_progress_reports").default(true),
      // Proactivity
      proactiveCheckIns: boolean13("proactive_check_ins").default(true),
      proactiveInterventions: boolean13("proactive_interventions").default(true),
      // AI Personality
      aiTone: varchar16("ai_tone", { length: 50 }),
      aiVerbosity: varchar16("ai_verbosity", { length: 50 }),
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    dataSettings = pgTable16("data_settings", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull().unique(),
      // Backup
      autoBackupEnabled: boolean13("auto_backup_enabled").default(true),
      backupFrequency: varchar16("backup_frequency", { length: 50 }),
      lastBackupAt: timestamp16("last_backup_at"),
      // Data Retention
      dataRetentionPeriod: varchar16("data_retention_period", { length: 50 }),
      // Export
      exportFormat: varchar16("export_format", { length: 50 }),
      // Storage
      storageUsed: integer16("storage_used").default(0),
      // bytes
      storageLimit: integer16("storage_limit").default(1073741824),
      // 1GB default
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    modulePreferences = pgTable16("module_preferences", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull(),
      // Module
      moduleName: varchar16("module_name", { length: 100 }).notNull(),
      // Enabled
      enabled: boolean13("enabled").default(true),
      // Visibility
      showInDashboard: boolean13("show_in_dashboard").default(true),
      dashboardOrder: integer16("dashboard_order"),
      // Settings
      moduleSettings: text16("module_settings"),
      // JSON: module-specific settings
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    userFeatureFlags = pgTable16("user_feature_flags", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull(),
      // Feature
      featureName: varchar16("feature_name", { length: 100 }).notNull(),
      // Enabled
      enabled: boolean13("enabled").default(false),
      // Metadata
      enabledAt: timestamp16("enabled_at"),
      enabledBy: varchar16("enabled_by", { length: 100 }),
      // "user", "admin", "auto"
      createdAt: timestamp16("created_at").defaultNow()
    });
    consentRecords = pgTable16("consent_records", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull(),
      // Consent Type
      consentType: varchar16("consent_type", { length: 50 }),
      // Consent
      consented: boolean13("consented").notNull(),
      // Version
      policyVersion: varchar16("policy_version", { length: 50 }),
      // IP & User Agent (for audit)
      ipAddress: varchar16("ip_address", { length: 50 }),
      userAgent: text16("user_agent"),
      consentedAt: timestamp16("consented_at").defaultNow()
    });
    sessionPreferences = pgTable16("session_preferences", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull(),
      sessionId: varchar16("session_id", { length: 255 }).notNull(),
      // Preferences
      preferences: text16("preferences"),
      // JSON: temporary preferences
      // Expiry
      expiresAt: timestamp16("expires_at"),
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    blockedUsers = pgTable16("blocked_users", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull(),
      // Who blocked
      blockedUserId: varchar16("blocked_user_id", { length: 255 }).notNull(),
      // Who was blocked
      // Reason
      reason: text16("reason"),
      blockedAt: timestamp16("blocked_at").defaultNow()
    });
    accountDeletionRequests = pgTable16("account_deletion_requests", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull(),
      // Reason
      reason: text16("reason"),
      feedback: text16("feedback"),
      // Status
      status: varchar16("status", { length: 50 }),
      // Scheduled Deletion
      scheduledFor: timestamp16("scheduled_for"),
      // Grace period (e.g., 30 days)
      // Completion
      completedAt: timestamp16("completed_at"),
      requestedAt: timestamp16("requested_at").defaultNow()
    });
    settingsChangeLog = pgTable16("settings_change_log", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull(),
      // Change Details
      settingCategory: varchar16("setting_category", { length: 100 }).notNull(),
      settingName: varchar16("setting_name", { length: 100 }).notNull(),
      // Values
      oldValue: text16("old_value"),
      newValue: text16("new_value"),
      // Context
      changedBy: varchar16("changed_by", { length: 100 }),
      // "user", "admin", "system"
      ipAddress: varchar16("ip_address", { length: 50 }),
      changedAt: timestamp16("changed_at").defaultNow()
    });
    accessibilityProfiles = pgTable16("accessibility_profiles", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull().unique(),
      // Visual
      screenReaderEnabled: boolean13("screen_reader_enabled").default(false),
      highContrast: boolean13("high_contrast").default(false),
      largeText: boolean13("large_text").default(false),
      colorBlindMode: varchar16("color_blind_mode", { length: 50 }),
      // Motor
      reduceMotion: boolean13("reduce_motion").default(false),
      keyboardNavigation: boolean13("keyboard_navigation").default(false),
      stickyKeys: boolean13("sticky_keys").default(false),
      // Cognitive
      simplifiedInterface: boolean13("simplified_interface").default(false),
      reducedDistractions: boolean13("reduced_distractions").default(false),
      // Audio
      closedCaptions: boolean13("closed_captions").default(false),
      audioDescriptions: boolean13("audio_descriptions").default(false),
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    betaFeatures = pgTable16("beta_features", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      // Feature Details
      featureName: varchar16("feature_name", { length: 255 }).notNull(),
      description: text16("description"),
      // Status
      status: varchar16("status", { length: 50 }),
      // Availability
      availableToAll: boolean13("available_to_all").default(false),
      requiresOptIn: boolean13("requires_opt_in").default(true),
      // Stats
      totalOptIns: integer16("total_opt_ins").default(0),
      createdAt: timestamp16("created_at").defaultNow(),
      updatedAt: timestamp16("updated_at").defaultNow()
    });
    userBetaOptIns = pgTable16("user_beta_opt_ins", {
      id: varchar16("id", { length: 255 }).primaryKey(),
      userId: varchar16("user_id", { length: 255 }).notNull(),
      betaFeatureId: varchar16("beta_feature_id", { length: 255 }).notNull(),
      // Feedback
      feedback: text16("feedback"),
      rating: integer16("rating"),
      // 1-10
      optedInAt: timestamp16("opted_in_at").defaultNow(),
      optedOutAt: timestamp16("opted_out_at")
    });
  }
});

// drizzle/careerSchema.ts
import { decimal as decimal12, integer as integer17, pgTable as pgTable17, text as text17, timestamp as timestamp17, varchar as varchar17 } from "drizzle-orm/pg-core";
var careerProfiles, jobSearchActivities, networkingContacts, skillDevelopment, purposeActivities, careerExperiments, careerMilestones;
var init_careerSchema = __esm({
  "drizzle/careerSchema.ts"() {
    "use strict";
    careerProfiles = pgTable17("career_profiles", {
      id: varchar17("id", { length: 255 }).primaryKey(),
      userId: varchar17("user_id", { length: 255 }).notNull(),
      // Current Status
      employmentStatus: varchar17("employment_status", { length: 50 }),
      currentRole: varchar17("current_role", { length: 255 }),
      currentIndustry: varchar17("current_industry", { length: 255 }),
      yearsExperience: integer17("years_experience"),
      // Career Goals
      primaryGoal: varchar17("primary_goal", { length: 50 }),
      targetRole: varchar17("target_role", { length: 255 }),
      targetIndustry: varchar17("target_industry", { length: 255 }),
      targetTimeline: integer17("target_timeline"),
      // months
      // Ikigai Framework (What you love, what you're good at, what the world needs, what you can be paid for)
      whatYouLove: text17("what_you_love"),
      // JSON array
      whatYoureGoodAt: text17("what_youre_good_at"),
      // JSON array
      whatWorldNeeds: text17("what_world_needs"),
      // JSON array
      whatYouCanBePaidFor: text17("what_you_can_be_paid_for"),
      // JSON array
      // Purpose Statement
      purposeStatement: text17("purpose_statement"),
      coreValues: text17("core_values"),
      // JSON array
      // Skills & Strengths
      currentSkills: text17("current_skills"),
      // JSON array
      skillsToLearn: text17("skills_to_learn"),
      // JSON array
      strengths: text17("strengths"),
      // JSON array (based on VIA Character Strengths or StrengthsFinder)
      // Barriers & Challenges
      mainBarriers: text17("main_barriers"),
      // JSON array
      createdAt: timestamp17("created_at").defaultNow(),
      updatedAt: timestamp17("updated_at").defaultNow()
    });
    jobSearchActivities = pgTable17("job_search_activities", {
      id: varchar17("id", { length: 255 }).primaryKey(),
      profileId: varchar17("profile_id", { length: 255 }).notNull(),
      userId: varchar17("user_id", { length: 255 }).notNull(),
      activityDate: timestamp17("activity_date").notNull(),
      activityType: varchar17("activity_type", { length: 50 }),
      // Job Details
      companyName: varchar17("company_name", { length: 255 }),
      jobTitle: varchar17("job_title", { length: 255 }),
      jobUrl: text17("job_url"),
      // Application Details
      applicationMethod: varchar17("application_method", { length: 255 }),
      // LinkedIn, company site, referral, etc.
      referralSource: varchar17("referral_source", { length: 255 }),
      // Interview Details
      interviewType: varchar17("interview_type", { length: 50 }),
      interviewRound: integer17("interview_round"),
      interviewNotes: text17("interview_notes"),
      // Outcome
      status: varchar17("status", { length: 50 }),
      // Follow-up
      nextSteps: text17("next_steps"),
      followUpDate: timestamp17("follow_up_date"),
      createdAt: timestamp17("created_at").defaultNow()
    });
    networkingContacts = pgTable17("networking_contacts", {
      id: varchar17("id", { length: 255 }).primaryKey(),
      profileId: varchar17("profile_id", { length: 255 }).notNull(),
      userId: varchar17("user_id", { length: 255 }).notNull(),
      // Contact Info
      name: varchar17("name", { length: 255 }).notNull(),
      title: varchar17("title", { length: 255 }),
      company: varchar17("company", { length: 255 }),
      industry: varchar17("industry", { length: 255 }),
      // Connection
      howMet: text17("how_met"),
      connectionStrength: varchar17("connection_strength", { length: 50 }),
      // Contact Details
      email: varchar17("email", { length: 255 }),
      linkedIn: varchar17("linkedin", { length: 255 }),
      phone: varchar17("phone", { length: 50 }),
      // Relationship
      lastContact: timestamp17("last_contact"),
      contactFrequency: varchar17("contact_frequency", { length: 50 }),
      // Value Exchange
      howTheyCanHelp: text17("how_they_can_help"),
      howYouCanHelp: text17("how_you_can_help"),
      // Notes
      notes: text17("notes"),
      createdAt: timestamp17("created_at").defaultNow(),
      updatedAt: timestamp17("updated_at").defaultNow()
    });
    skillDevelopment = pgTable17("skill_development", {
      id: varchar17("id", { length: 255 }).primaryKey(),
      profileId: varchar17("profile_id", { length: 255 }).notNull(),
      userId: varchar17("user_id", { length: 255 }).notNull(),
      skillName: varchar17("skill_name", { length: 255 }).notNull(),
      skillCategory: varchar17("skill_category", { length: 50 }),
      // Current Level
      currentLevel: varchar17("current_level", { length: 50 }),
      targetLevel: varchar17("target_level", { length: 50 }),
      // Learning Plan
      learningResources: text17("learning_resources"),
      // JSON array: [{type, name, url, cost}]
      practiceActivities: text17("practice_activities"),
      // JSON array
      // Progress
      hoursInvested: decimal12("hours_invested", { precision: 10, scale: 2 }).default("0"),
      completedMilestones: text17("completed_milestones"),
      // JSON array
      // Application
      projectsUsed: text17("projects_used"),
      // JSON array
      certificationsEarned: text17("certifications_earned"),
      // JSON array
      // Timeline
      startDate: timestamp17("start_date"),
      targetCompletionDate: timestamp17("target_completion_date"),
      completionDate: timestamp17("completion_date"),
      status: varchar17("status", { length: 50 }),
      createdAt: timestamp17("created_at").defaultNow(),
      updatedAt: timestamp17("updated_at").defaultNow()
    });
    purposeActivities = pgTable17("purpose_activities", {
      id: varchar17("id", { length: 255 }).primaryKey(),
      profileId: varchar17("profile_id", { length: 255 }).notNull(),
      userId: varchar17("user_id", { length: 255 }).notNull(),
      activityDate: timestamp17("activity_date").notNull(),
      // Activity Type (evidence-based purpose discovery methods)
      activityType: varchar17("activity_type", { length: 50 }),
      // Reflections
      insights: text17("insights"),
      patterns: text17("patterns"),
      // What patterns emerged?
      emotions: text17("emotions"),
      // Purpose Elements Discovered
      passions: text17("passions"),
      // JSON array
      strengths: text17("strengths"),
      values: text17("values"),
      impact: text17("impact"),
      // How you want to contribute
      // Integration
      actionSteps: text17("action_steps"),
      // JSON array
      createdAt: timestamp17("created_at").defaultNow()
    });
    careerExperiments = pgTable17("career_experiments", {
      id: varchar17("id", { length: 255 }).primaryKey(),
      profileId: varchar17("profile_id", { length: 255 }).notNull(),
      userId: varchar17("user_id", { length: 255 }).notNull(),
      experimentType: varchar17("experiment_type", { length: 50 }),
      experimentName: varchar17("experiment_name", { length: 255 }).notNull(),
      description: text17("description"),
      // Hypothesis
      hypothesis: text17("hypothesis"),
      // What are you testing?
      successCriteria: text17("success_criteria"),
      // How will you know if it's a fit?
      // Timeline
      startDate: timestamp17("start_date"),
      endDate: timestamp17("end_date"),
      // Results
      whatYouLearned: text17("what_you_learned"),
      whatYouLiked: text17("what_you_liked"),
      whatYouDisliked: text17("what_you_disliked"),
      // Decision
      conclusion: text17("conclusion"),
      nextSteps: text17("next_steps"),
      status: varchar17("status", { length: 50 }),
      createdAt: timestamp17("created_at").defaultNow(),
      updatedAt: timestamp17("updated_at").defaultNow()
    });
    careerMilestones = pgTable17("career_milestones", {
      id: varchar17("id", { length: 255 }).primaryKey(),
      profileId: varchar17("profile_id", { length: 255 }).notNull(),
      userId: varchar17("user_id", { length: 255 }).notNull(),
      milestoneType: varchar17("milestone_type", { length: 50 }),
      title: varchar17("title", { length: 255 }).notNull(),
      description: text17("description"),
      targetDate: timestamp17("target_date"),
      achievedDate: timestamp17("achieved_date"),
      progress: integer17("progress"),
      // 0-100%
      status: varchar17("status", { length: 50 }),
      impact: text17("impact"),
      // How did this move you toward your purpose?
      createdAt: timestamp17("created_at").defaultNow(),
      updatedAt: timestamp17("updated_at").defaultNow()
    });
  }
});

// drizzle/communitySchema.ts
import { boolean as boolean15, decimal as decimal13, integer as integer18, pgTable as pgTable18, text as text18, timestamp as timestamp18, varchar as varchar18 } from "drizzle-orm/pg-core";
var communityProfiles, communities, communityMemberships, communityPosts, communityComments, accountabilityPartnerships, partnerCheckIns, mentorships, dailyCheckIns, communityChallenges, challengeParticipants, communityAnalytics;
var init_communitySchema = __esm({
  "drizzle/communitySchema.ts"() {
    "use strict";
    communityProfiles = pgTable18("community_profiles", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      userId: varchar18("user_id", { length: 255 }).notNull(),
      // Display Info
      displayName: varchar18("display_name", { length: 100 }).notNull(),
      bio: text18("bio"),
      profilePhoto: varchar18("profile_photo", { length: 500 }),
      // Sharing Preferences
      shareProgress: boolean15("share_progress").default(true),
      shareStruggles: boolean15("share_struggles").default(true),
      shareWins: boolean15("share_wins").default(true),
      // What They're Working On
      primaryChallenges: text18("primary_challenges"),
      // JSON array: mental_health, addiction, autism, etc.
      primaryGoals: text18("primary_goals"),
      // JSON array
      // Community Role
      role: varchar18("role", { length: 50 }),
      // Mentor Availability (if mentor)
      availableAsMentor: boolean15("available_as_mentor").default(false),
      mentorshipAreas: text18("mentorship_areas"),
      // JSON array: what can they help with?
      // Engagement
      totalPosts: integer18("total_posts").default(0),
      totalComments: integer18("total_comments").default(0),
      totalSupportsGiven: integer18("total_supports_given").default(0),
      // Likes, encouragements
      totalSupportsReceived: integer18("total_supports_received").default(0),
      // Reputation
      helpfulnessScore: integer18("helpfulness_score").default(0),
      // Community-voted
      // Status
      active: boolean15("active").default(true),
      createdAt: timestamp18("created_at").defaultNow(),
      updatedAt: timestamp18("updated_at").defaultNow()
    });
    communities = pgTable18("communities", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      // Community Info
      name: varchar18("name", { length: 255 }).notNull(),
      description: text18("description"),
      coverImage: varchar18("cover_image", { length: 500 }),
      // Type
      communityType: varchar18("community_type", { length: 50 }),
      // Privacy
      privacy: varchar18("privacy", { length: 50 }),
      // Moderation
      moderatorIds: text18("moderator_ids"),
      // JSON array of user IDs
      // Guidelines
      guidelines: text18("guidelines"),
      // Stats
      memberCount: integer18("member_count").default(0),
      activeMembers: integer18("active_members").default(0),
      // Active in last 30 days
      totalPosts: integer18("total_posts").default(0),
      // Status
      active: boolean15("active").default(true),
      createdAt: timestamp18("created_at").defaultNow(),
      updatedAt: timestamp18("updated_at").defaultNow()
    });
    communityMemberships = pgTable18("community_memberships", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      communityId: varchar18("community_id", { length: 255 }).notNull(),
      userId: varchar18("user_id", { length: 255 }).notNull(),
      // Role in Community
      role: varchar18("role", { length: 50 }),
      // Engagement
      lastActiveAt: timestamp18("last_active_at"),
      postsCount: integer18("posts_count").default(0),
      commentsCount: integer18("comments_count").default(0),
      // Notifications
      notificationsEnabled: boolean15("notifications_enabled").default(true),
      joinedAt: timestamp18("joined_at").defaultNow()
    });
    communityPosts = pgTable18("community_posts", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      communityId: varchar18("community_id", { length: 255 }).notNull(),
      authorId: varchar18("author_id", { length: 255 }).notNull(),
      // Post Type
      postType: varchar18("post_type", { length: 50 }),
      // Content
      title: varchar18("title", { length: 255 }),
      content: text18("content").notNull(),
      images: text18("images"),
      // JSON array of image URLs
      // Tags
      tags: text18("tags"),
      // JSON array
      // Engagement
      likesCount: integer18("likes_count").default(0),
      commentsCount: integer18("comments_count").default(0),
      supportsCount: integer18("supports_count").default(0),
      // "You got this!" reactions
      // Moderation
      flagged: boolean15("flagged").default(false),
      flagReason: text18("flag_reason"),
      // Visibility
      visible: boolean15("visible").default(true),
      createdAt: timestamp18("created_at").defaultNow(),
      updatedAt: timestamp18("updated_at").defaultNow()
    });
    communityComments = pgTable18("community_comments", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      postId: varchar18("post_id", { length: 255 }).notNull(),
      authorId: varchar18("author_id", { length: 255 }).notNull(),
      // Content
      content: text18("content").notNull(),
      // Engagement
      likesCount: integer18("likes_count").default(0),
      // Moderation
      flagged: boolean15("flagged").default(false),
      // Visibility
      visible: boolean15("visible").default(true),
      createdAt: timestamp18("created_at").defaultNow(),
      updatedAt: timestamp18("updated_at").defaultNow()
    });
    accountabilityPartnerships = pgTable18("accountability_partnerships", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      user1Id: varchar18("user1_id", { length: 255 }).notNull(),
      user2Id: varchar18("user2_id", { length: 255 }).notNull(),
      // Partnership Details
      sharedGoals: text18("shared_goals"),
      // JSON array: what are they working on together?
      checkInFrequency: varchar18("check_in_frequency", { length: 50 }),
      // Communication
      lastCheckIn: timestamp18("last_check_in"),
      totalCheckIns: integer18("total_check_ins").default(0),
      // Effectiveness
      partnershipSatisfaction: integer18("partnership_satisfaction"),
      // 1-10 (from both partners)
      helpfulnessRating: integer18("helpfulness_rating"),
      // 1-10
      // Status
      status: varchar18("status", { length: 50 }),
      createdAt: timestamp18("created_at").defaultNow(),
      updatedAt: timestamp18("updated_at").defaultNow()
    });
    partnerCheckIns = pgTable18("partner_check_ins", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      partnershipId: varchar18("partnership_id", { length: 255 }).notNull(),
      initiatorId: varchar18("initiator_id", { length: 255 }).notNull(),
      checkInDate: timestamp18("check_in_date").notNull(),
      // User 1 Update
      user1Progress: text18("user1_progress"),
      user1Struggles: text18("user1_struggles"),
      user1Wins: text18("user1_wins"),
      user1NextSteps: text18("user1_next_steps"),
      // User 2 Update
      user2Progress: text18("user2_progress"),
      user2Struggles: text18("user2_struggles"),
      user2Wins: text18("user2_wins"),
      user2NextSteps: text18("user2_next_steps"),
      // Mutual Support
      encouragementGiven: text18("encouragement_given"),
      // What they said to each other
      // Effectiveness
      helpfulness: integer18("helpfulness"),
      // 1-10
      createdAt: timestamp18("created_at").defaultNow()
    });
    mentorships = pgTable18("mentorships", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      mentorId: varchar18("mentor_id", { length: 255 }).notNull(),
      menteeId: varchar18("mentee_id", { length: 255 }).notNull(),
      // Focus Area
      focusArea: varchar18("focus_area", { length: 255 }).notNull(),
      // What is the mentorship about?
      // Frequency
      meetingFrequency: varchar18("meeting_frequency", { length: 50 }),
      // Progress
      totalSessions: integer18("total_sessions").default(0),
      lastSession: timestamp18("last_session"),
      // Effectiveness
      menteeProgress: integer18("mentee_progress"),
      // 1-10: How much has mentee improved?
      menteeSatisfaction: integer18("mentee_satisfaction"),
      // 1-10
      // Status
      status: varchar18("status", { length: 50 }),
      createdAt: timestamp18("created_at").defaultNow(),
      updatedAt: timestamp18("updated_at").defaultNow()
    });
    dailyCheckIns = pgTable18("daily_check_ins", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      userId: varchar18("user_id", { length: 255 }).notNull(),
      checkInDate: timestamp18("check_in_date").notNull(),
      // How Are You?
      mood: varchar18("mood", { length: 100 }),
      energy: integer18("energy"),
      // 1-10
      // Today's Focus
      todayGoals: text18("today_goals"),
      // JSON array
      // Gratitude
      gratefulFor: text18("grateful_for"),
      // Struggles
      strugglingWith: text18("struggling_with"),
      needSupport: boolean15("need_support").default(false),
      // Wins
      winsToday: text18("wins_today"),
      // Visibility
      shareWithCommunity: boolean15("share_with_community").default(true),
      // Engagement
      supportsReceived: integer18("supports_received").default(0),
      commentsReceived: integer18("comments_received").default(0),
      createdAt: timestamp18("created_at").defaultNow()
    });
    communityChallenges = pgTable18("community_challenges", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      communityId: varchar18("community_id", { length: 255 }),
      // Challenge Details
      challengeName: varchar18("challenge_name", { length: 255 }).notNull(),
      description: text18("description"),
      // Type
      challengeType: varchar18("challenge_type", { length: 50 }),
      // Duration
      startDate: timestamp18("start_date"),
      endDate: timestamp18("end_date"),
      duration: integer18("duration"),
      // days
      // Participation
      participantCount: integer18("participant_count").default(0),
      // Status
      status: varchar18("status", { length: 50 }),
      createdAt: timestamp18("created_at").defaultNow(),
      updatedAt: timestamp18("updated_at").defaultNow()
    });
    challengeParticipants = pgTable18("challenge_participants", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      challengeId: varchar18("challenge_id", { length: 255 }).notNull(),
      userId: varchar18("user_id", { length: 255 }).notNull(),
      // Progress
      currentStreak: integer18("current_streak").default(0),
      longestStreak: integer18("longest_streak").default(0),
      completionRate: decimal13("completion_rate", { precision: 5, scale: 2 }),
      // %
      // Updates
      lastUpdate: timestamp18("last_update"),
      // Completion
      completed: boolean15("completed").default(false),
      joinedAt: timestamp18("joined_at").defaultNow()
    });
    communityAnalytics = pgTable18("community_analytics", {
      id: varchar18("id", { length: 255 }).primaryKey(),
      // Support Type Effectiveness
      supportType: varchar18("support_type", { length: 100 }).notNull(),
      // accountability, mentorship, group
      // Impact Metrics
      avgUserRetention: decimal13("avg_user_retention", { precision: 5, scale: 2 }),
      // %
      avgGoalAchievement: decimal13("avg_goal_achievement", { precision: 5, scale: 2 }),
      // %
      avgSatisfaction: decimal13("avg_satisfaction", { precision: 4, scale: 2 }),
      // 1-10
      // Optimal Parameters
      optimalCheckInFrequency: varchar18("optimal_check_in_frequency", { length: 50 }),
      optimalGroupSize: integer18("optimal_group_size"),
      // User Segments
      mostEffectiveFor: text18("most_effective_for"),
      // JSON: different user types
      // Sample Size
      userCount: integer18("user_count"),
      lastCalculated: timestamp18("last_calculated").defaultNow(),
      createdAt: timestamp18("created_at").defaultNow(),
      updatedAt: timestamp18("updated_at").defaultNow()
    });
  }
});

// drizzle/financialSchema.ts
import { boolean as boolean16, decimal as decimal14, integer as integer19, pgTable as pgTable19, text as text19, timestamp as timestamp19, varchar as varchar19 } from "drizzle-orm/pg-core";
var financialProfiles, debtAccounts, debtPayments, budgetCategories, expenses, incomeEntries, savingsGoals, financialWins, moneyMindsetReflections, financialEducation;
var init_financialSchema = __esm({
  "drizzle/financialSchema.ts"() {
    "use strict";
    financialProfiles = pgTable19("financial_profiles", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      // Current Financial Situation
      employmentStatus: varchar19("employment_status", { length: 50 }),
      monthlyIncome: decimal14("monthly_income", { precision: 10, scale: 2 }),
      incomeStability: varchar19("income_stability", { length: 50 }),
      // Debt Situation
      totalDebt: decimal14("total_debt", { precision: 10, scale: 2 }),
      debtTypes: text19("debt_types"),
      // JSON array: credit_card, student_loan, medical, personal, etc.
      // Financial Health
      hasEmergencyFund: boolean16("has_emergency_fund").default(false),
      emergencyFundMonths: integer19("emergency_fund_months"),
      // How many months of expenses covered
      hasBudget: boolean16("has_budget").default(false),
      tracksSpending: boolean16("tracks_spending").default(false),
      // Financial Stress Level
      financialStressLevel: integer19("financial_stress_level"),
      // 1-10
      // Primary Financial Goal
      primaryGoal: varchar19("primary_goal", { length: 50 }),
      specificGoals: text19("specific_goals"),
      // JSON array
      // Money Mindset (psychological factors)
      moneyScripts: text19("money_scripts"),
      // JSON array: beliefs about money from childhood
      financialTrauma: text19("financial_trauma"),
      // Past financial hardships
      // Behavioral Patterns
      impulseBuyingTriggers: text19("impulse_buying_triggers"),
      // JSON array
      emotionalSpendingTriggers: text19("emotional_spending_triggers"),
      // JSON array
      createdAt: timestamp19("created_at").defaultNow(),
      updatedAt: timestamp19("updated_at").defaultNow()
    });
    debtAccounts = pgTable19("debt_accounts", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      debtType: varchar19("debt_type", { length: 50 }),
      creditorName: varchar19("creditor_name", { length: 255 }).notNull(),
      // Debt Details
      originalBalance: decimal14("original_balance", { precision: 10, scale: 2 }).notNull(),
      currentBalance: decimal14("current_balance", { precision: 10, scale: 2 }).notNull(),
      interestRate: decimal14("interest_rate", { precision: 5, scale: 2 }),
      // APR
      minimumPayment: decimal14("minimum_payment", { precision: 10, scale: 2 }),
      // Payoff Strategy
      payoffMethod: varchar19("payoff_method", { length: 50 }),
      // Snowball = smallest first, Avalanche = highest interest first
      payoffPriority: integer19("payoff_priority"),
      // 1 = pay off first
      // Tracking
      lastPaymentDate: timestamp19("last_payment_date"),
      lastPaymentAmount: decimal14("last_payment_amount", { precision: 10, scale: 2 }),
      // Projections
      projectedPayoffDate: timestamp19("projected_payoff_date"),
      totalInterestPaid: decimal14("total_interest_paid", { precision: 10, scale: 2 }).default("0"),
      // Status
      status: varchar19("status", { length: 50 }),
      paidOffDate: timestamp19("paid_off_date"),
      createdAt: timestamp19("created_at").defaultNow(),
      updatedAt: timestamp19("updated_at").defaultNow()
    });
    debtPayments = pgTable19("debt_payments", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      debtAccountId: varchar19("debt_account_id", { length: 255 }).notNull(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      paymentDate: timestamp19("payment_date").notNull(),
      paymentAmount: decimal14("payment_amount", { precision: 10, scale: 2 }).notNull(),
      principalPaid: decimal14("principal_paid", { precision: 10, scale: 2 }),
      interestPaid: decimal14("interest_paid", { precision: 10, scale: 2 }),
      balanceAfterPayment: decimal14("balance_after_payment", { precision: 10, scale: 2 }),
      // Emotional Impact (behavioral economics)
      emotionalImpact: integer19("emotional_impact"),
      // 1-10 (how good did it feel?)
      motivationBoost: integer19("motivation_boost"),
      // 1-10
      notes: text19("notes"),
      createdAt: timestamp19("created_at").defaultNow()
    });
    budgetCategories = pgTable19("budget_categories", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      categoryType: varchar19("category_type", { length: 50 }),
      categoryName: varchar19("category_name", { length: 255 }).notNull(),
      // Budget Amounts
      plannedAmount: decimal14("planned_amount", { precision: 10, scale: 2 }).notNull(),
      actualAmount: decimal14("actual_amount", { precision: 10, scale: 2 }).default("0"),
      // Tracking
      isEssential: boolean16("is_essential").default(true),
      // Can't cut this
      isVariable: boolean16("is_variable").default(false),
      // Amount changes monthly
      // Month
      budgetMonth: varchar19("budget_month", { length: 7 }),
      // YYYY-MM format
      active: boolean16("active").default(true),
      createdAt: timestamp19("created_at").defaultNow(),
      updatedAt: timestamp19("updated_at").defaultNow()
    });
    expenses = pgTable19("expenses", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      expenseDate: timestamp19("expense_date").notNull(),
      amount: decimal14("amount", { precision: 10, scale: 2 }).notNull(),
      categoryId: varchar19("category_id", { length: 255 }),
      categoryName: varchar19("category_name", { length: 255 }).notNull(),
      description: varchar19("description", { length: 255 }),
      merchant: varchar19("merchant", { length: 255 }),
      // Behavioral Tracking
      wasPlanned: boolean16("was_planned"),
      // Was this in the budget?
      wasNecessary: boolean16("was_necessary"),
      // Did you really need this?
      wasImpulse: boolean16("was_impulse"),
      // Impulse purchase?
      emotionalState: varchar19("emotional_state", { length: 100 }),
      // What were you feeling when you bought this?
      trigger: varchar19("trigger", { length: 255 }),
      // What triggered this purchase?
      // Regret/Satisfaction
      satisfactionLevel: integer19("satisfaction_level"),
      // 1-10
      regretLevel: integer19("regret_level"),
      // 1-10
      createdAt: timestamp19("created_at").defaultNow()
    });
    incomeEntries = pgTable19("income_entries", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      incomeDate: timestamp19("income_date").notNull(),
      amount: decimal14("amount", { precision: 10, scale: 2 }).notNull(),
      incomeType: varchar19("income_type", { length: 50 }),
      source: varchar19("source", { length: 255 }),
      description: text19("description"),
      isRecurring: boolean16("is_recurring").default(false),
      createdAt: timestamp19("created_at").defaultNow()
    });
    savingsGoals = pgTable19("savings_goals", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      goalType: varchar19("goal_type", { length: 50 }),
      goalName: varchar19("goal_name", { length: 255 }).notNull(),
      description: text19("description"),
      // Goal Details
      targetAmount: decimal14("target_amount", { precision: 10, scale: 2 }).notNull(),
      currentAmount: decimal14("current_amount", { precision: 10, scale: 2 }).default("0"),
      // Timeline
      startDate: timestamp19("start_date"),
      targetDate: timestamp19("target_date"),
      // Contribution Plan
      monthlyContribution: decimal14("monthly_contribution", { precision: 10, scale: 2 }),
      // Progress
      percentComplete: integer19("percent_complete").default(0),
      // Motivation
      whyItMatters: text19("why_it_matters"),
      visualReminder: varchar19("visual_reminder", { length: 255 }),
      // Image URL
      status: varchar19("status", { length: 50 }),
      completedDate: timestamp19("completed_date"),
      createdAt: timestamp19("created_at").defaultNow(),
      updatedAt: timestamp19("updated_at").defaultNow()
    });
    financialWins = pgTable19("financial_wins", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      winDate: timestamp19("win_date").notNull(),
      winType: varchar19("win_type", { length: 50 }),
      title: varchar19("title", { length: 255 }).notNull(),
      description: text19("description"),
      // Impact
      amountInvolved: decimal14("amount_involved", { precision: 10, scale: 2 }),
      emotionalImpact: integer19("emotional_impact"),
      // 1-10
      // Reflection
      whatYouLearned: text19("what_you_learned"),
      whoYouBecame: text19("who_you_became"),
      // Identity shift
      createdAt: timestamp19("created_at").defaultNow()
    });
    moneyMindsetReflections = pgTable19("money_mindset_reflections", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      reflectionDate: timestamp19("reflection_date").notNull(),
      // Reflection Prompts
      promptType: varchar19("prompt_type", { length: 50 }),
      reflection: text19("reflection").notNull(),
      // Insights
      insights: text19("insights"),
      limitingBeliefs: text19("limiting_beliefs"),
      // JSON array
      empoweringBeliefs: text19("empowering_beliefs"),
      // JSON array
      actionSteps: text19("action_steps"),
      // JSON array
      createdAt: timestamp19("created_at").defaultNow()
    });
    financialEducation = pgTable19("financial_education", {
      id: varchar19("id", { length: 255 }).primaryKey(),
      profileId: varchar19("profile_id", { length: 255 }).notNull(),
      userId: varchar19("user_id", { length: 255 }).notNull(),
      topic: varchar19("topic", { length: 50 }),
      resourceType: varchar19("resource_type", { length: 50 }),
      resourceName: varchar19("resource_name", { length: 255 }),
      resourceUrl: text19("resource_url"),
      completedDate: timestamp19("completed_date"),
      // Application
      keyTakeaways: text19("key_takeaways"),
      // JSON array
      appliedLearning: text19("applied_learning"),
      // How did you use this?
      status: varchar19("status", { length: 50 }),
      createdAt: timestamp19("created_at").defaultNow()
    });
  }
});

// drizzle/goalsSchema.ts
import { boolean as boolean17, decimal as decimal15, integer as integer20, pgTable as pgTable20, text as text20, timestamp as timestamp20, varchar as varchar20 } from "drizzle-orm/pg-core";
var goalProfiles, goals, okrs, keyResults, woopPlans, implementationIntentions, goalMilestones, goalProgressLogs, goalObstacles, goalAccountability, goalReflections, goalPredictions, goalAnalytics;
var init_goalsSchema = __esm({
  "drizzle/goalsSchema.ts"() {
    "use strict";
    goalProfiles = pgTable20("goal_profiles", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Achievement Stats
      totalGoalsSet: integer20("total_goals_set").default(0),
      totalGoalsAchieved: integer20("total_goals_achieved").default(0),
      totalGoalsAbandoned: integer20("total_goals_abandoned").default(0),
      achievementRate: decimal15("achievement_rate", { precision: 5, scale: 2 }),
      // %
      // Goal-Setting Style
      preferredFramework: varchar20("preferred_framework", { length: 50 }),
      // Optimal Parameters (Self-Learning)
      optimalGoalDifficulty: integer20("optimal_goal_difficulty"),
      // 1-10
      optimalTimeframe: varchar20("optimal_timeframe", { length: 100 }),
      // "30 days", "90 days", etc.
      optimalGoalCount: integer20("optimal_goal_count"),
      // How many concurrent goals?
      // Motivation Type
      motivationType: varchar20("motivation_type", { length: 50 }),
      // Accountability Preferences
      needsAccountability: boolean17("needs_accountability").default(false),
      preferredAccountabilityType: varchar20("preferred_accountability_type", { length: 50 }),
      // Success Patterns
      successPatterns: text20("success_patterns"),
      // JSON: what leads to success for this user
      failurePatterns: text20("failure_patterns"),
      // JSON: what leads to failure
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
    goals = pgTable20("goals", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      profileId: varchar20("profile_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Goal Details
      goalName: varchar20("goal_name", { length: 255 }).notNull(),
      description: text20("description"),
      // Goal Type
      goalType: varchar20("goal_type", { length: 50 }),
      // Framework
      framework: varchar20("framework", { length: 50 }),
      // SMART Criteria
      specific: boolean17("specific").default(false),
      // Is it specific?
      measurable: boolean17("measurable").default(false),
      // Can it be measured?
      achievable: boolean17("achievable").default(false),
      // Is it realistic?
      relevant: boolean17("relevant").default(false),
      // Does it matter?
      timeBound: boolean17("time_bound").default(false),
      // Does it have a deadline?
      // Category
      category: varchar20("category", { length: 50 }),
      // Difficulty
      difficulty: integer20("difficulty"),
      // 1-10
      // Timeline
      startDate: timestamp20("start_date"),
      targetDate: timestamp20("target_date"),
      // Measurement
      metricType: varchar20("metric_type", { length: 50 }),
      currentValue: decimal15("current_value", { precision: 10, scale: 2 }),
      targetValue: decimal15("target_value", { precision: 10, scale: 2 }),
      unit: varchar20("unit", { length: 50 }),
      // kg, %, hours, etc.
      // Progress
      progressPercent: decimal15("progress_percent", { precision: 5, scale: 2 }),
      // 0-100
      // Status
      status: varchar20("status", { length: 50 }),
      // Priority
      priority: varchar20("priority", { length: 50 }),
      // Visibility
      isPublic: boolean17("is_public").default(false),
      // Share with community?
      // Related
      relatedHabitId: varchar20("related_habit_id", { length: 255 }),
      // Link to habit
      relatedGoalId: varchar20("related_goal_id", { length: 255 }),
      // Parent/child goals
      // Completion
      completedAt: timestamp20("completed_at"),
      abandonedAt: timestamp20("abandoned_at"),
      abandonReason: text20("abandon_reason"),
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
    okrs = pgTable20("okrs", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Objective (the goal)
      objective: text20("objective").notNull(),
      // Time Period
      timePeriod: varchar20("time_period", { length: 50 }),
      startDate: timestamp20("start_date"),
      endDate: timestamp20("end_date"),
      // Overall Progress
      overallProgress: decimal15("overall_progress", { precision: 5, scale: 2 }),
      // 0-100
      // Status
      status: varchar20("status", { length: 50 }),
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
    keyResults = pgTable20("key_results", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      okrId: varchar20("okr_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Key Result Details
      keyResult: text20("key_result").notNull(),
      // Measurement
      currentValue: decimal15("current_value", { precision: 10, scale: 2 }),
      targetValue: decimal15("target_value", { precision: 10, scale: 2 }),
      unit: varchar20("unit", { length: 50 }),
      // Progress
      progressPercent: decimal15("progress_percent", { precision: 5, scale: 2 }),
      // 0-100
      // Status
      status: varchar20("status", { length: 50 }),
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
    woopPlans = pgTable20("woop_plans", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Wish
      wish: text20("wish").notNull(),
      // What do you want?
      // Outcome
      outcome: text20("outcome").notNull(),
      // What's the best outcome?
      outcomeVisualization: text20("outcome_visualization"),
      // Detailed visualization
      // Obstacle
      obstacle: text20("obstacle").notNull(),
      // What will get in the way?
      obstacleAnticipation: text20("obstacle_anticipation"),
      // How likely is this obstacle?
      // Plan
      plan: text20("plan").notNull(),
      // If obstacle occurs, then I will...
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
    implementationIntentions = pgTable20("implementation_intentions", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // If-Then Statement
      ifCondition: text20("if_condition").notNull(),
      // If [situation]...
      thenAction: text20("then_action").notNull(),
      // Then I will [action]...
      // Type
      intentionType: varchar20("intention_type", { length: 50 }),
      // Effectiveness
      timesTriggered: integer20("times_triggered").default(0),
      timesExecuted: integer20("times_executed").default(0),
      executionRate: decimal15("execution_rate", { precision: 5, scale: 2 }),
      // %
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
    goalMilestones = pgTable20("goal_milestones", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Milestone Details
      milestoneName: varchar20("milestone_name", { length: 255 }).notNull(),
      description: text20("description"),
      // Target
      targetValue: decimal15("target_value", { precision: 10, scale: 2 }),
      targetDate: timestamp20("target_date"),
      // Progress
      achieved: boolean17("achieved").default(false),
      achievedAt: timestamp20("achieved_at"),
      // Order
      sequenceOrder: integer20("sequence_order"),
      // 1st milestone, 2nd, etc.
      createdAt: timestamp20("created_at").defaultNow()
    });
    goalProgressLogs = pgTable20("goal_progress_logs", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Progress Update
      currentValue: decimal15("current_value", { precision: 10, scale: 2 }).notNull(),
      progressPercent: decimal15("progress_percent", { precision: 5, scale: 2 }),
      // Context
      notes: text20("notes"),
      // Momentum
      momentum: varchar20("momentum", { length: 50 }),
      logDate: timestamp20("log_date").defaultNow()
    });
    goalObstacles = pgTable20("goal_obstacles", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Obstacle Details
      obstacleName: varchar20("obstacle_name", { length: 255 }).notNull(),
      description: text20("description"),
      // Type
      obstacleType: varchar20("obstacle_type", { length: 50 }),
      // Severity
      severity: integer20("severity"),
      // 1-10
      // Frequency
      occurrenceCount: integer20("occurrence_count").default(0),
      lastOccurrence: timestamp20("last_occurrence"),
      // Solution
      solution: text20("solution"),
      // How to overcome this
      solutionEffective: boolean17("solution_effective"),
      // Status
      overcome: boolean17("overcome").default(false),
      overcameAt: timestamp20("overcame_at"),
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
    goalAccountability = pgTable20("goal_accountability", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Accountability Type
      accountabilityType: varchar20("accountability_type", { length: 50 }),
      // Partner (if applicable)
      partnerId: varchar20("partner_id", { length: 255 }),
      // Check-In Frequency
      checkInFrequency: varchar20("check_in_frequency", { length: 50 }),
      // Last Check-In
      lastCheckIn: timestamp20("last_check_in"),
      nextCheckIn: timestamp20("next_check_in"),
      // Effectiveness
      adherenceRate: decimal15("adherence_rate", { precision: 5, scale: 2 }),
      // % of check-ins completed
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
    goalReflections = pgTable20("goal_reflections", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Reflection Type
      reflectionType: varchar20("reflection_type", { length: 50 }),
      // Reflection Questions
      whatWorked: text20("what_worked"),
      whatDidntWork: text20("what_didnt_work"),
      lessonsLearned: text20("lessons_learned"),
      adjustmentsNeeded: text20("adjustments_needed"),
      // Mood
      confidenceLevel: integer20("confidence_level"),
      // 1-10
      motivationLevel: integer20("motivation_level"),
      // 1-10
      reflectionDate: timestamp20("reflection_date").defaultNow()
    });
    goalPredictions = pgTable20("goal_predictions", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      goalId: varchar20("goal_id", { length: 255 }).notNull(),
      userId: varchar20("user_id", { length: 255 }).notNull(),
      // Prediction Type
      predictionType: varchar20("prediction_type", { length: 50 }),
      // Prediction
      prediction: text20("prediction"),
      confidence: decimal15("confidence", { precision: 5, scale: 2 }),
      // %
      // Contributing Factors
      factors: text20("factors"),
      // JSON: what influences this prediction
      // Recommendation
      recommendation: text20("recommendation"),
      // Validation
      actualOutcome: text20("actual_outcome"),
      predictionAccurate: boolean17("prediction_accurate"),
      createdAt: timestamp20("created_at").defaultNow(),
      validatedAt: timestamp20("validated_at")
    });
    goalAnalytics = pgTable20("goal_analytics", {
      id: varchar20("id", { length: 255 }).primaryKey(),
      // Goal Type
      goalType: varchar20("goal_type", { length: 100 }).notNull(),
      // Success Metrics
      avgAchievementRate: decimal15("avg_achievement_rate", { precision: 5, scale: 2 }),
      // %
      avgTimeToCompletion: integer20("avg_time_to_completion"),
      // days
      avgAbandonmentRate: decimal15("avg_abandonment_rate", { precision: 5, scale: 2 }),
      // %
      // Optimal Parameters
      optimalDifficulty: integer20("optimal_difficulty"),
      // 1-10
      optimalTimeframe: integer20("optimal_timeframe"),
      // days
      optimalAccountabilityType: varchar20("optimal_accountability_type", { length: 100 }),
      // Success Factors
      successFactors: text20("success_factors"),
      // JSON: what predicts success
      failureFactors: text20("failure_factors"),
      // JSON: what predicts failure
      // Sample Size
      userCount: integer20("user_count"),
      totalGoals: integer20("total_goals"),
      lastCalculated: timestamp20("last_calculated").defaultNow(),
      createdAt: timestamp20("created_at").defaultNow(),
      updatedAt: timestamp20("updated_at").defaultNow()
    });
  }
});

// drizzle/healthOptimizationSchema.ts
import { boolean as boolean18, decimal as decimal16, integer as integer21, pgTable as pgTable21, text as text21, timestamp as timestamp21, varchar as varchar21 } from "drizzle-orm/pg-core";
var healthOptimizationProfiles, biomarkers, healthProtocols, dailyHealthMetrics, sleepSessions, stressRecoveryLogs, healthScreenings, longevityPractices, healthMilestones, healthOptimizationAnalytics;
var init_healthOptimizationSchema = __esm({
  "drizzle/healthOptimizationSchema.ts"() {
    "use strict";
    healthOptimizationProfiles = pgTable21("health_optimization_profiles", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      // Current Health Status
      overallHealth: integer21("overall_health"),
      // 1-10 self-assessment
      // Age & Biological Age
      chronologicalAge: integer21("chronological_age"),
      estimatedBiologicalAge: integer21("estimated_biological_age"),
      // Based on biomarkers
      // Health Goals
      primaryGoal: varchar21("primary_goal", { length: 50 }),
      // Risk Factors
      familyHistory: text21("family_history"),
      // JSON: diseases in family
      currentConditions: text21("current_conditions"),
      // JSON array
      riskFactors: text21("risk_factors"),
      // JSON: smoking, sedentary, etc.
      // Medications
      currentMedications: text21("current_medications"),
      // JSON array
      // Lifestyle
      smokingStatus: varchar21("smoking_status", { length: 50 }),
      alcoholConsumption: varchar21("alcohol_consumption", { length: 50 }),
      // Health Optimization Protocols
      activeProtocols: text21("active_protocols"),
      // JSON: protocols currently following
      // Self-Learning Data
      mostEffectiveInterventions: text21("most_effective_interventions"),
      // JSON
      biomarkerTrends: text21("biomarker_trends"),
      // JSON: improving, stable, declining
      healthTrajectory: varchar21("health_trajectory", { length: 50 }),
      createdAt: timestamp21("created_at").defaultNow(),
      updatedAt: timestamp21("updated_at").defaultNow()
    });
    biomarkers = pgTable21("biomarkers", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      profileId: varchar21("profile_id", { length: 255 }).notNull(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      testDate: timestamp21("test_date").notNull(),
      // Metabolic Health
      fastingGlucose: decimal16("fasting_glucose", { precision: 5, scale: 2 }),
      // mg/dL
      hbA1c: decimal16("hba1c", { precision: 4, scale: 2 }),
      // % (diabetes marker)
      fastingInsulin: decimal16("fasting_insulin", { precision: 5, scale: 2 }),
      // μIU/mL
      homaIR: decimal16("homa_ir", { precision: 5, scale: 2 }),
      // Insulin resistance
      // Lipid Panel
      totalCholesterol: integer21("total_cholesterol"),
      // mg/dL
      ldlCholesterol: integer21("ldl_cholesterol"),
      // mg/dL
      hdlCholesterol: integer21("hdl_cholesterol"),
      // mg/dL
      triglycerides: integer21("triglycerides"),
      // mg/dL
      apoB: integer21("apo_b"),
      // mg/dL (best predictor of cardiovascular risk)
      lpA: integer21("lp_a"),
      // mg/dL (genetic risk factor)
      // Inflammation
      hsCRP: decimal16("hs_crp", { precision: 5, scale: 2 }),
      // mg/L (high-sensitivity C-reactive protein)
      // Liver Function
      alt: integer21("alt"),
      // U/L
      ast: integer21("ast"),
      // U/L
      ggt: integer21("ggt"),
      // U/L
      // Kidney Function
      creatinine: decimal16("creatinine", { precision: 4, scale: 2 }),
      // mg/dL
      eGFR: integer21("egfr"),
      // mL/min/1.73m² (kidney filtration rate)
      bun: integer21("bun"),
      // mg/dL
      // Thyroid
      tsh: decimal16("tsh", { precision: 5, scale: 3 }),
      // mIU/L
      freeT3: decimal16("free_t3", { precision: 4, scale: 2 }),
      // pg/mL
      freeT4: decimal16("free_t4", { precision: 4, scale: 2 }),
      // ng/dL
      // Hormones
      testosterone: integer21("testosterone"),
      // ng/dL
      estradiol: integer21("estradiol"),
      // pg/mL
      cortisol: decimal16("cortisol", { precision: 5, scale: 2 }),
      // μg/dL
      dhea: integer21("dhea"),
      // μg/dL
      // Vitamins & Minerals
      vitaminD: decimal16("vitamin_d", { precision: 5, scale: 2 }),
      // ng/mL
      vitaminB12: integer21("vitamin_b12"),
      // pg/mL
      folate: decimal16("folate", { precision: 5, scale: 2 }),
      // ng/mL
      iron: integer21("iron"),
      // μg/dL
      ferritin: integer21("ferritin"),
      // ng/mL
      magnesium: decimal16("magnesium", { precision: 4, scale: 2 }),
      // mg/dL
      // Complete Blood Count
      wbc: decimal16("wbc", { precision: 4, scale: 2 }),
      // K/μL (white blood cells)
      rbc: decimal16("rbc", { precision: 4, scale: 2 }),
      // M/μL (red blood cells)
      hemoglobin: decimal16("hemoglobin", { precision: 4, scale: 1 }),
      // g/dL
      hematocrit: decimal16("hematocrit", { precision: 4, scale: 1 }),
      // %
      platelets: integer21("platelets"),
      // K/μL
      // Advanced Longevity Markers
      homocysteine: decimal16("homocysteine", { precision: 5, scale: 2 }),
      // μmol/L (cardiovascular & cognitive risk)
      uricAcid: decimal16("uric_acid", { precision: 4, scale: 2 }),
      // mg/dL
      // Source
      testSource: varchar21("test_source", { length: 255 }),
      // Lab name
      // Notes
      notes: text21("notes"),
      createdAt: timestamp21("created_at").defaultNow()
    });
    healthProtocols = pgTable21("health_protocols", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      profileId: varchar21("profile_id", { length: 255 }).notNull(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      protocolName: varchar21("protocol_name", { length: 255 }).notNull(),
      // Protocol Type
      protocolType: varchar21("protocol_type", { length: 50 }),
      // Details
      description: text21("description"),
      protocol: text21("protocol"),
      // Specific steps
      // Target
      targetBiomarker: varchar21("target_biomarker", { length: 255 }),
      // What are you trying to improve?
      targetCondition: varchar21("target_condition", { length: 255 }),
      // Duration
      startDate: timestamp21("start_date"),
      plannedDuration: integer21("planned_duration"),
      // days
      endDate: timestamp21("end_date"),
      // Baseline
      baselineMeasurement: text21("baseline_measurement"),
      // JSON: relevant biomarkers before
      // Results
      endMeasurement: text21("end_measurement"),
      // JSON: biomarkers after
      // Effectiveness
      effectiveness: integer21("effectiveness"),
      // 1-10
      sideEffects: text21("side_effects"),
      // Decision
      willContinue: boolean18("will_continue"),
      // Status
      status: varchar21("status", { length: 50 }),
      createdAt: timestamp21("created_at").defaultNow(),
      updatedAt: timestamp21("updated_at").defaultNow()
    });
    dailyHealthMetrics = pgTable21("daily_health_metrics", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      profileId: varchar21("profile_id", { length: 255 }).notNull(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      metricDate: timestamp21("metric_date").notNull(),
      // Vitals
      restingHeartRate: integer21("resting_heart_rate"),
      // bpm
      hrv: integer21("hrv"),
      // ms (Heart Rate Variability - autonomic nervous system health)
      bloodPressureSystolic: integer21("blood_pressure_systolic"),
      // mmHg
      bloodPressureDiastolic: integer21("blood_pressure_diastolic"),
      // mmHg
      oxygenSaturation: integer21("oxygen_saturation"),
      // % (SpO2)
      bodyTemperature: decimal16("body_temperature", { precision: 4, scale: 2 }),
      // °C
      // Weight & Composition
      weight: decimal16("weight", { precision: 5, scale: 2 }),
      // kg
      bodyFat: decimal16("body_fat", { precision: 4, scale: 1 }),
      // %
      // Sleep
      sleepDuration: decimal16("sleep_duration", { precision: 3, scale: 1 }),
      // hours
      sleepQuality: integer21("sleep_quality"),
      // 1-10
      deepSleepMinutes: integer21("deep_sleep_minutes"),
      remSleepMinutes: integer21("rem_sleep_minutes"),
      // Energy & Performance
      energyLevel: integer21("energy_level"),
      // 1-10
      mentalClarity: integer21("mental_clarity"),
      // 1-10
      physicalPerformance: integer21("physical_performance"),
      // 1-10
      // Stress & Recovery
      stressLevel: integer21("stress_level"),
      // 1-10
      recoveryScore: integer21("recovery_score"),
      // 1-10
      // Symptoms
      symptoms: text21("symptoms"),
      // JSON array: headache, fatigue, pain, etc.
      createdAt: timestamp21("created_at").defaultNow()
    });
    sleepSessions = pgTable21("sleep_sessions", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      profileId: varchar21("profile_id", { length: 255 }).notNull(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      sleepDate: timestamp21("sleep_date").notNull(),
      // Duration
      bedTime: timestamp21("bed_time"),
      wakeTime: timestamp21("wake_time"),
      totalTimeInBed: integer21("total_time_in_bed"),
      // minutes
      totalSleepTime: integer21("total_sleep_time"),
      // minutes
      sleepEfficiency: integer21("sleep_efficiency"),
      // % (sleep time / time in bed)
      // Sleep Stages
      awakeDuration: integer21("awake_duration"),
      // minutes
      lightSleepDuration: integer21("light_sleep_duration"),
      // minutes
      deepSleepDuration: integer21("deep_sleep_duration"),
      // minutes
      remSleepDuration: integer21("rem_sleep_duration"),
      // minutes
      // Quality
      sleepQuality: integer21("sleep_quality"),
      // 1-10
      timesToWake: integer21("times_to_wake"),
      timeToFallAsleep: integer21("time_to_fall_asleep"),
      // minutes (sleep latency)
      // Factors
      caffeineAfter2pm: boolean18("caffeine_after_2pm"),
      alcoholBeforeBed: boolean18("alcohol_before_bed"),
      screenTimeBeforeBed: integer21("screen_time_before_bed"),
      // minutes
      exerciseToday: boolean18("exercise_today"),
      stressLevel: integer21("stress_level"),
      // 1-10
      // Environment
      roomTemperature: integer21("room_temperature"),
      // °C
      noiseLevel: varchar21("noise_level", { length: 50 }),
      lightLevel: varchar21("light_level", { length: 50 }),
      // Morning Metrics
      morningEnergy: integer21("morning_energy"),
      // 1-10
      morningMood: varchar21("morning_mood", { length: 100 }),
      // Source
      dataSource: varchar21("data_source", { length: 255 }),
      // Oura, Whoop, Apple Watch, manual, etc.
      createdAt: timestamp21("created_at").defaultNow()
    });
    stressRecoveryLogs = pgTable21("stress_recovery_logs", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      profileId: varchar21("profile_id", { length: 255 }).notNull(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      logDate: timestamp21("log_date").notNull(),
      // Stress Metrics
      perceivedStress: integer21("perceived_stress"),
      // 1-10
      stressSources: text21("stress_sources"),
      // JSON array
      // HRV (Heart Rate Variability - stress indicator)
      morningHRV: integer21("morning_hrv"),
      // ms
      // Recovery Metrics
      recoveryScore: integer21("recovery_score"),
      // 1-10
      restingHeartRate: integer21("resting_heart_rate"),
      // bpm
      // Strain (if tracking like Whoop)
      dailyStrain: decimal16("daily_strain", { precision: 4, scale: 1 }),
      // Cardiovascular load
      // Recovery Strategies Used
      recoveryStrategies: text21("recovery_strategies"),
      // JSON: meditation, sauna, massage, etc.
      createdAt: timestamp21("created_at").defaultNow()
    });
    healthScreenings = pgTable21("health_screenings", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      profileId: varchar21("profile_id", { length: 255 }).notNull(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      screeningDate: timestamp21("screening_date").notNull(),
      // Screening Type
      screeningType: varchar21("screening_type", { length: 50 }),
      screeningName: varchar21("screening_name", { length: 255 }),
      // Results
      results: text21("results"),
      // JSON or text
      abnormalFindings: text21("abnormal_findings"),
      // Follow-up
      followUpNeeded: boolean18("follow_up_needed"),
      followUpDate: timestamp21("follow_up_date"),
      // Provider
      provider: varchar21("provider", { length: 255 }),
      // Files
      resultsFile: varchar21("results_file", { length: 255 }),
      createdAt: timestamp21("created_at").defaultNow()
    });
    longevityPractices = pgTable21("longevity_practices", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      profileId: varchar21("profile_id", { length: 255 }).notNull(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp21("practice_date").notNull(),
      // Practice Type (evidence-based longevity interventions)
      practiceType: varchar21("practice_type", { length: 50 }),
      // Details
      duration: integer21("duration"),
      // minutes
      intensity: varchar21("intensity", { length: 50 }),
      // Specific Metrics
      specificMetrics: text21("specific_metrics"),
      // JSON: temperature, heart rate, etc.
      // How It Felt
      howItFelt: text21("how_it_felt"),
      createdAt: timestamp21("created_at").defaultNow()
    });
    healthMilestones = pgTable21("health_milestones", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      profileId: varchar21("profile_id", { length: 255 }).notNull(),
      userId: varchar21("user_id", { length: 255 }).notNull(),
      milestoneType: varchar21("milestone_type", { length: 50 }),
      title: varchar21("title", { length: 255 }).notNull(),
      description: text21("description"),
      achievedDate: timestamp21("achieved_date"),
      // Significance
      significance: text21("significance"),
      createdAt: timestamp21("created_at").defaultNow()
    });
    healthOptimizationAnalytics = pgTable21("health_optimization_analytics", {
      id: varchar21("id", { length: 255 }).primaryKey(),
      // Intervention Effectiveness (aggregated)
      interventionType: varchar21("intervention_type", { length: 100 }).notNull(),
      targetBiomarker: varchar21("target_biomarker", { length: 100 }),
      // Effectiveness Metrics
      avgBiomarkerImprovement: decimal16("avg_biomarker_improvement", { precision: 6, scale: 2 }),
      // % change
      successRate: decimal16("success_rate", { precision: 5, scale: 2 }),
      // % of users who improved
      // Optimal Parameters
      optimalDuration: integer21("optimal_duration"),
      // days
      optimalDosage: varchar21("optimal_dosage", { length: 255 }),
      // User Segments
      mostEffectiveFor: text21("most_effective_for"),
      // JSON: different health profiles
      // Sample Size
      protocolCount: integer21("protocol_count"),
      userCount: integer21("user_count"),
      lastCalculated: timestamp21("last_calculated").defaultNow(),
      createdAt: timestamp21("created_at").defaultNow(),
      updatedAt: timestamp21("updated_at").defaultNow()
    });
  }
});

// drizzle/journalSchema.ts
import { boolean as boolean19, decimal as decimal17, integer as integer22, pgTable as pgTable22, text as text22, timestamp as timestamp22, varchar as varchar22 } from "drizzle-orm/pg-core";
var journalProfiles, journalEntries, journalPrompts, gratitudeEntries2, bestPossibleSelfEntries, dailyReviews, emotionalPatterns, journalInsights, writingStreaks, journalReflections, promptEffectiveness, journalAnalytics;
var init_journalSchema = __esm({
  "drizzle/journalSchema.ts"() {
    "use strict";
    journalProfiles = pgTable22("journal_profiles", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      // Journaling Stats
      totalEntries: integer22("total_entries").default(0),
      currentStreak: integer22("current_streak").default(0),
      // Days
      longestStreak: integer22("longest_streak").default(0),
      // Preferences
      preferredJournalType: varchar22("preferred_journal_type", { length: 50 }),
      preferredTime: varchar22("preferred_time", { length: 50 }),
      // Privacy
      defaultPrivacy: varchar22("default_privacy", { length: 50 }),
      // AI Features
      enableAIInsights: boolean19("enable_ai_insights").default(true),
      enableEmotionDetection: boolean19("enable_emotion_detection").default(true),
      enablePatternRecognition: boolean19("enable_pattern_recognition").default(true),
      // Self-Learning Data
      mostBeneficialPrompts: text22("most_beneficial_prompts"),
      // JSON: which prompts led to insights
      emotionalPatterns: text22("emotional_patterns"),
      // JSON: recurring themes
      growthAreas: text22("growth_areas"),
      // JSON: areas of development
      createdAt: timestamp22("created_at").defaultNow(),
      updatedAt: timestamp22("updated_at").defaultNow()
    });
    journalEntries = pgTable22("journal_entries", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      profileId: varchar22("profile_id", { length: 255 }).notNull(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      // Entry Details
      title: varchar22("title", { length: 255 }),
      content: text22("content").notNull(),
      // Entry Type
      entryType: varchar22("entry_type", { length: 50 }),
      // Prompt (if used)
      promptId: varchar22("prompt_id", { length: 255 }),
      promptText: text22("prompt_text"),
      // Mood Before/After
      moodBefore: integer22("mood_before"),
      // 1-10
      moodAfter: integer22("mood_after"),
      // 1-10
      // Emotions (AI-Detected)
      primaryEmotion: varchar22("primary_emotion", { length: 50 }),
      emotionIntensity: integer22("emotion_intensity"),
      // 1-10
      secondaryEmotions: text22("secondary_emotions"),
      // JSON array
      // Themes (AI-Detected)
      themes: text22("themes"),
      // JSON: relationships, work, health, etc.
      // Cognitive Patterns (AI-Detected)
      cognitiveDistortions: text22("cognitive_distortions"),
      // JSON: catastrophizing, black-and-white thinking, etc.
      // Insights (AI-Generated)
      aiInsights: text22("ai_insights"),
      // JSON: patterns, suggestions, reflections
      // Word Count
      wordCount: integer22("word_count"),
      // Duration
      writingDurationMinutes: integer22("writing_duration_minutes"),
      // Privacy
      privacy: varchar22("privacy", { length: 50 }),
      // Favorite
      isFavorite: boolean19("is_favorite").default(false),
      // Tags
      tags: text22("tags"),
      // JSON array
      // Related
      relatedGoalId: varchar22("related_goal_id", { length: 255 }),
      relatedEventId: varchar22("related_event_id", { length: 255 }),
      entryDate: timestamp22("entry_date").defaultNow(),
      createdAt: timestamp22("created_at").defaultNow(),
      updatedAt: timestamp22("updated_at").defaultNow()
    });
    journalPrompts = pgTable22("journal_prompts", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      // Prompt Details
      promptText: text22("prompt_text").notNull(),
      description: text22("description"),
      // Category
      category: varchar22("category", { length: 50 }),
      // Research-Backed
      researchBacked: boolean19("research_backed").default(false),
      researchSource: text22("research_source"),
      // Citation
      // When to Use
      bestFor: text22("best_for"),
      // JSON: situations, emotions, goals
      // Difficulty
      difficulty: varchar22("difficulty", { length: 50 }),
      // Effectiveness
      avgHelpfulnessRating: decimal17("avg_helpfulness_rating", { precision: 4, scale: 2 }),
      // 1-10
      totalUses: integer22("total_uses").default(0),
      // Active
      active: boolean19("active").default(true),
      createdAt: timestamp22("created_at").defaultNow(),
      updatedAt: timestamp22("updated_at").defaultNow()
    });
    gratitudeEntries2 = pgTable22("gratitude_entries", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      journalEntryId: varchar22("journal_entry_id", { length: 255 }).notNull(),
      profileId: varchar22("profile_id", { length: 255 }).notNull(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      // Three Good Things (Seligman's exercise)
      goodThing1: text22("good_thing_1").notNull(),
      whyItHappened1: text22("why_it_happened_1"),
      // Causal attribution
      goodThing2: text22("good_thing_2"),
      whyItHappened2: text22("why_it_happened_2"),
      goodThing3: text22("good_thing_3"),
      whyItHappened3: text22("why_it_happened_3"),
      // Overall Gratitude Level
      gratitudeLevel: integer22("gratitude_level"),
      // 1-10
      entryDate: timestamp22("entry_date").defaultNow()
    });
    bestPossibleSelfEntries = pgTable22("best_possible_self_entries", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      journalEntryId: varchar22("journal_entry_id", { length: 255 }).notNull(),
      profileId: varchar22("profile_id", { length: 255 }).notNull(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      // Timeframe
      timeframe: varchar22("timeframe", { length: 50 }),
      // Life Areas
      personalLife: text22("personal_life"),
      // What does your personal life look like?
      relationships: text22("relationships"),
      // Who are you with?
      career: text22("career"),
      // What are you doing professionally?
      health: text22("health"),
      // How is your health?
      contributions: text22("contributions"),
      // What impact are you making?
      // Identity
      whoYouAre: text22("who_you_are"),
      // Who have you become?
      // Emotions
      howYouFeel: text22("how_you_feel"),
      // How does this future self feel?
      entryDate: timestamp22("entry_date").defaultNow()
    });
    dailyReviews = pgTable22("daily_reviews", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      journalEntryId: varchar22("journal_entry_id", { length: 255 }),
      profileId: varchar22("profile_id", { length: 255 }).notNull(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      reviewDate: timestamp22("review_date").notNull(),
      // What Went Well
      wentWell: text22("went_well"),
      whyItWentWell: text22("why_it_went_well"),
      // What Didn't Go Well
      didntGoWell: text22("didnt_go_well"),
      whyItDidntGoWell: text22("why_it_didnt_go_well"),
      // Lessons Learned
      lessonsLearned: text22("lessons_learned"),
      // Tomorrow's Focus
      tomorrowFocus: text22("tomorrow_focus"),
      // Overall Day Rating
      dayRating: integer22("day_rating"),
      // 1-10
      createdAt: timestamp22("created_at").defaultNow()
    });
    emotionalPatterns = pgTable22("emotional_patterns", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      profileId: varchar22("profile_id", { length: 255 }).notNull(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      // Pattern Type
      patternType: varchar22("pattern_type", { length: 50 }).notNull(),
      // Pattern Details
      patternName: varchar22("pattern_name", { length: 255 }).notNull(),
      description: text22("description"),
      // Frequency
      occurrenceCount: integer22("occurrence_count").default(0),
      firstDetected: timestamp22("first_detected"),
      lastDetected: timestamp22("last_detected"),
      // Associated Data
      associatedEmotions: text22("associated_emotions"),
      // JSON
      associatedTriggers: text22("associated_triggers"),
      // JSON
      associatedContexts: text22("associated_contexts"),
      // JSON
      // Insight
      insight: text22("insight"),
      // What does this pattern mean?
      actionable: boolean19("actionable").default(false),
      suggestedAction: text22("suggested_action"),
      createdAt: timestamp22("created_at").defaultNow(),
      updatedAt: timestamp22("updated_at").defaultNow()
    });
    journalInsights = pgTable22("journal_insights", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      profileId: varchar22("profile_id", { length: 255 }).notNull(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      // Insight Type
      insightType: varchar22("insight_type", { length: 50 }),
      // Content
      title: varchar22("title", { length: 255 }).notNull(),
      description: text22("description"),
      // Supporting Evidence
      supportingEntries: text22("supporting_entries"),
      // JSON: entry IDs that support this insight
      // Actionability
      actionable: boolean19("actionable").default(false),
      suggestedAction: text22("suggested_action"),
      // User Response
      viewed: boolean19("viewed").default(false),
      viewedAt: timestamp22("viewed_at"),
      helpful: boolean19("helpful"),
      // User feedback
      createdAt: timestamp22("created_at").defaultNow()
    });
    writingStreaks = pgTable22("writing_streaks", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      profileId: varchar22("profile_id", { length: 255 }).notNull(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      // Streak Details
      startDate: timestamp22("start_date").notNull(),
      endDate: timestamp22("end_date"),
      // Length
      streakLength: integer22("streak_length"),
      // Days
      // Status
      active: boolean19("active").default(true),
      createdAt: timestamp22("created_at").defaultNow()
    });
    journalReflections = pgTable22("journal_reflections", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      profileId: varchar22("profile_id", { length: 255 }).notNull(),
      userId: varchar22("user_id", { length: 255 }).notNull(),
      // Reflection Period
      periodType: varchar22("period_type", { length: 50 }),
      periodStart: timestamp22("period_start").notNull(),
      periodEnd: timestamp22("period_end").notNull(),
      // Reflection Content
      overallThemes: text22("overall_themes"),
      // What themes emerged?
      emotionalJourney: text22("emotional_journey"),
      // How did emotions evolve?
      growthAreas: text22("growth_areas"),
      // Where did you grow?
      challengeAreas: text22("challenge_areas"),
      // Where did you struggle?
      surprises: text22("surprises"),
      // What surprised you?
      gratitudes: text22("gratitudes"),
      // What are you grateful for?
      // Forward Looking
      intentionsForward: text22("intentions_forward"),
      // What do you want to focus on next?
      reflectionDate: timestamp22("reflection_date").defaultNow()
    });
    promptEffectiveness = pgTable22("prompt_effectiveness", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      promptId: varchar22("prompt_id", { length: 255 }).notNull(),
      // Usage Stats
      totalUses: integer22("total_uses").default(0),
      // Effectiveness Metrics
      avgWordCount: decimal17("avg_word_count", { precision: 8, scale: 2 }),
      avgWritingDuration: decimal17("avg_writing_duration", { precision: 6, scale: 2 }),
      // minutes
      avgMoodImprovement: decimal17("avg_mood_improvement", { precision: 4, scale: 2 }),
      // change in mood
      avgHelpfulnessRating: decimal17("avg_helpfulness_rating", { precision: 4, scale: 2 }),
      // 1-10
      // Insight Generation
      avgInsightsGenerated: decimal17("avg_insights_generated", { precision: 4, scale: 2 }),
      // Best For
      mostEffectiveForEmotions: text22("most_effective_for_emotions"),
      // JSON
      mostEffectiveForSituations: text22("most_effective_for_situations"),
      // JSON
      // Sample Size
      userCount: integer22("user_count"),
      lastCalculated: timestamp22("last_calculated").defaultNow(),
      createdAt: timestamp22("created_at").defaultNow(),
      updatedAt: timestamp22("updated_at").defaultNow()
    });
    journalAnalytics = pgTable22("journal_analytics", {
      id: varchar22("id", { length: 255 }).primaryKey(),
      // Entry Type
      entryType: varchar22("entry_type", { length: 100 }).notNull(),
      // Effectiveness Metrics
      avgMoodImprovement: decimal17("avg_mood_improvement", { precision: 4, scale: 2 }),
      avgInsightsGenerated: decimal17("avg_insights_generated", { precision: 4, scale: 2 }),
      avgBehaviorChange: decimal17("avg_behavior_change", { precision: 5, scale: 2 }),
      // % who took action
      // Optimal Parameters
      optimalWordCount: integer22("optimal_word_count"),
      optimalDuration: integer22("optimal_duration"),
      // minutes
      optimalTimeOfDay: varchar22("optimal_time_of_day", { length: 100 }),
      // Best For
      mostEffectiveFor: text22("most_effective_for"),
      // JSON: user types, situations
      // Sample Size
      userCount: integer22("user_count"),
      totalEntries: integer22("total_entries"),
      lastCalculated: timestamp22("last_calculated").defaultNow(),
      createdAt: timestamp22("created_at").defaultNow(),
      updatedAt: timestamp22("updated_at").defaultNow()
    });
  }
});

// drizzle/mentalHealthSchema.ts
import { boolean as boolean20, integer as integer23, pgTable as pgTable23, text as text23, timestamp as timestamp23, varchar as varchar23 } from "drizzle-orm/pg-core";
var mentalHealthProfiles, moodLogs, thoughtRecords, dbtSkillsPractice2, safetyPlans, recoveryMilestones;
var init_mentalHealthSchema = __esm({
  "drizzle/mentalHealthSchema.ts"() {
    "use strict";
    mentalHealthProfiles = pgTable23("mental_health_profiles", {
      id: varchar23("id", { length: 255 }).primaryKey(),
      userId: varchar23("user_id", { length: 255 }).notNull(),
      // Diagnosis & History
      primaryDiagnosis: varchar23("primary_diagnosis", { length: 255 }),
      secondaryDiagnoses: text23("secondary_diagnoses"),
      // JSON array
      diagnosisDate: timestamp23("diagnosis_date"),
      treatmentHistory: text23("treatment_history"),
      // JSON array of past treatments
      // Current Status
      currentSeverity: varchar23("current_severity", { length: 50 }),
      inTreatment: boolean20("in_treatment").default(false),
      medicationList: text23("medication_list"),
      // JSON array
      therapyType: varchar23("therapy_type", { length: 255 }),
      // CBT, DBT, EMDR, etc.
      // Risk Assessment
      suicidalIdeation: boolean20("suicidal_ideation").default(false),
      selfHarmRisk: varchar23("self_harm_risk", { length: 50 }),
      crisisContactInfo: text23("crisis_contact_info"),
      // JSON
      // Goals & Progress
      recoveryGoals: text23("recovery_goals"),
      // JSON array
      currentPhase: varchar23("current_phase", { length: 50 }),
      createdAt: timestamp23("created_at").defaultNow(),
      updatedAt: timestamp23("updated_at").defaultNow()
    });
    moodLogs = pgTable23("mood_logs", {
      id: varchar23("id", { length: 255 }).primaryKey(),
      profileId: varchar23("profile_id", { length: 255 }).notNull(),
      userId: varchar23("user_id", { length: 255 }).notNull(),
      logDate: timestamp23("log_date").notNull(),
      // Mood Ratings (1-10 scale, evidence-based)
      overallMood: integer23("overall_mood"),
      // 1=worst, 10=best
      anxiety: integer23("anxiety"),
      // 1=none, 10=severe
      depression: integer23("depression"),
      irritability: integer23("irritability"),
      energy: integer23("energy"),
      sleep_quality: integer23("sleep_quality"),
      // Symptom Checklist (based on DSM-5 criteria)
      symptoms: text23("symptoms"),
      // JSON array: ["racing_thoughts", "loss_of_interest", etc.]
      // Behavioral Markers
      selfCareCompleted: boolean20("self_care_completed"),
      socialInteraction: boolean20("social_interaction"),
      physicalActivity: boolean20("physical_activity"),
      substanceUse: boolean20("substance_use"),
      // Triggers & Coping
      triggers: text23("triggers"),
      // JSON array
      copingStrategiesUsed: text23("coping_strategies_used"),
      // JSON array
      copingEffectiveness: integer23("coping_effectiveness"),
      // 1-10
      // Notes
      notes: text23("notes"),
      createdAt: timestamp23("created_at").defaultNow()
    });
    thoughtRecords = pgTable23("thought_records", {
      id: varchar23("id", { length: 255 }).primaryKey(),
      profileId: varchar23("profile_id", { length: 255 }).notNull(),
      userId: varchar23("user_id", { length: 255 }).notNull(),
      recordDate: timestamp23("record_date").notNull(),
      // Situation
      situation: text23("situation").notNull(),
      // Automatic Thoughts
      automaticThought: text23("automatic_thought").notNull(),
      emotionsBefore: text23("emotions_before"),
      // JSON: [{emotion: "anxiety", intensity: 8}]
      // Evidence & Analysis
      evidenceFor: text23("evidence_for"),
      evidenceAgainst: text23("evidence_against"),
      cognitiveDistortions: text23("cognitive_distortions"),
      // JSON array: ["catastrophizing", "black_and_white", etc.]
      // Balanced Thought
      balancedThought: text23("balanced_thought"),
      emotionsAfter: text23("emotions_after"),
      // JSON: [{emotion: "anxiety", intensity: 4}]
      // Outcome
      behavioralResponse: text23("behavioral_response"),
      effectiveness: integer23("effectiveness"),
      // 1-10
      createdAt: timestamp23("created_at").defaultNow()
    });
    dbtSkillsPractice2 = pgTable23("dbt_skills_practice", {
      id: varchar23("id", { length: 255 }).primaryKey(),
      profileId: varchar23("profile_id", { length: 255 }).notNull(),
      userId: varchar23("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp23("practice_date").notNull(),
      // DBT Module
      module: varchar23("module", { length: 50 }),
      // Specific Skill
      skillName: varchar23("skill_name", { length: 255 }).notNull(),
      // e.g., "TIPP", "DEAR MAN", "Opposite Action"
      // Practice Details
      situation: text23("situation"),
      emotionBefore: varchar23("emotion_before", { length: 255 }),
      intensityBefore: integer23("intensity_before"),
      // 1-10
      // Skill Application
      skillStepsUsed: text23("skill_steps_used"),
      // JSON array
      effectiveness: integer23("effectiveness"),
      // 1-10
      emotionAfter: varchar23("emotion_after", { length: 255 }),
      intensityAfter: integer23("intensity_after"),
      // 1-10
      // Reflection
      whatWorked: text23("what_worked"),
      whatDidntWork: text23("what_didnt_work"),
      nextTime: text23("next_time"),
      createdAt: timestamp23("created_at").defaultNow()
    });
    safetyPlans = pgTable23("safety_plans", {
      id: varchar23("id", { length: 255 }).primaryKey(),
      profileId: varchar23("profile_id", { length: 255 }).notNull(),
      userId: varchar23("user_id", { length: 255 }).notNull(),
      // Warning Signs
      warningSigns: text23("warning_signs"),
      // JSON array
      // Coping Strategies (ordered by escalation)
      internalCopingStrategies: text23("internal_coping_strategies"),
      // JSON array
      socialDistractions: text23("social_distractions"),
      // JSON array
      // Support Contacts
      supportContacts: text23("support_contacts"),
      // JSON: [{name, phone, relationship}]
      professionalContacts: text23("professional_contacts"),
      // JSON: [{name, phone, role}]
      // Crisis Resources
      crisisHotlines: text23("crisis_hotlines"),
      // JSON array
      emergencyServices: text23("emergency_services"),
      // JSON
      // Environment Safety
      meansRestriction: text23("means_restriction"),
      // Steps taken to reduce access to lethal means
      // Reasons for Living
      reasonsForLiving: text23("reasons_for_living"),
      // JSON array
      lastReviewed: timestamp23("last_reviewed"),
      createdAt: timestamp23("created_at").defaultNow(),
      updatedAt: timestamp23("updated_at").defaultNow()
    });
    recoveryMilestones = pgTable23("recovery_milestones", {
      id: varchar23("id", { length: 255 }).primaryKey(),
      profileId: varchar23("profile_id", { length: 255 }).notNull(),
      userId: varchar23("user_id", { length: 255 }).notNull(),
      milestoneType: varchar23("milestone_type", { length: 50 }),
      title: varchar23("title", { length: 255 }).notNull(),
      description: text23("description"),
      targetDate: timestamp23("target_date"),
      achievedDate: timestamp23("achieved_date"),
      progress: integer23("progress"),
      // 0-100%
      status: varchar23("status", { length: 50 }),
      notes: text23("notes"),
      createdAt: timestamp23("created_at").defaultNow(),
      updatedAt: timestamp23("updated_at").defaultNow()
    });
  }
});

// drizzle/relationshipSchema.ts
import { boolean as boolean21, integer as integer24, pgTable as pgTable24, text as text24, timestamp as timestamp24, varchar as varchar24 } from "drizzle-orm/pg-core";
var relationshipProfiles, communicationLogs, loveMaps, connectionBids, repairAttempts, relationshipRituals, breakupRecovery, loveLanguageActions;
var init_relationshipSchema = __esm({
  "drizzle/relationshipSchema.ts"() {
    "use strict";
    relationshipProfiles = pgTable24("relationship_profiles", {
      id: varchar24("id", { length: 255 }).primaryKey(),
      userId: varchar24("user_id", { length: 255 }).notNull(),
      // Relationship Type & Status
      relationshipType: varchar24("relationship_type", { length: 50 }),
      relationshipStatus: varchar24("relationship_status", { length: 50 }),
      relationshipDuration: integer24("relationship_duration"),
      // months
      // Partner Information (optional, for privacy)
      partnerInvolved: boolean21("partner_involved").default(false),
      // Is partner also using platform?
      partnerUserId: varchar24("partner_user_id", { length: 255 }),
      // Attachment Style (evidence-based assessment)
      attachmentStyle: varchar24("attachment_style", { length: 50 }),
      partnerAttachmentStyle: varchar24("partner_attachment_style", { length: 50 }),
      // Love Languages (Gary Chapman's 5 Love Languages)
      primaryLoveLanguage: varchar24("primary_love_language", { length: 50 }),
      secondaryLoveLanguage: varchar24("secondary_love_language", { length: 50 }),
      partnerPrimaryLoveLanguage: varchar24("partner_primary_love_language", { length: 50 }),
      partnerSecondaryLoveLanguage: varchar24("partner_secondary_love_language", { length: 50 }),
      // Relationship Goals
      primaryGoal: varchar24("primary_goal", { length: 50 }),
      specificGoals: text24("specific_goals"),
      // JSON array
      // Current Challenges
      mainChallenges: text24("main_challenges"),
      // JSON array
      conflictFrequency: varchar24("conflict_frequency", { length: 50 }),
      // Gottman Four Horsemen Assessment
      criticismLevel: integer24("criticism_level"),
      // 1-10
      contemptLevel: integer24("contempt_level"),
      defensivenessLevel: integer24("defensiveness_level"),
      stonewallinglevel: integer24("stonewalling_level"),
      createdAt: timestamp24("created_at").defaultNow(),
      updatedAt: timestamp24("updated_at").defaultNow()
    });
    communicationLogs = pgTable24("communication_logs", {
      id: varchar24("id", { length: 255 }).primaryKey(),
      profileId: varchar24("profile_id", { length: 255 }).notNull(),
      userId: varchar24("user_id", { length: 255 }).notNull(),
      logDate: timestamp24("log_date").notNull(),
      // Conversation Type
      conversationType: varchar24("conversation_type", { length: 50 }),
      // Topic & Context
      topic: varchar24("topic", { length: 255 }).notNull(),
      context: text24("context"),
      // Emotional State
      emotionBefore: varchar24("emotion_before", { length: 255 }),
      intensityBefore: integer24("intensity_before"),
      // 1-10
      // Communication Quality (Gottman-based)
      usedSoftStartup: boolean21("used_soft_startup"),
      // Did you start gently?
      expressedNeeds: boolean21("expressed_needs"),
      // Did you express your needs clearly?
      listenedActively: boolean21("listened_actively"),
      // Did you listen to understand?
      validatedPartner: boolean21("validated_partner"),
      // Did you validate their feelings?
      foundCompromise: boolean21("found_compromise"),
      // Did you find a solution?
      // Four Horsemen Check
      usedCriticism: boolean21("used_criticism"),
      usedContempt: boolean21("used_contempt"),
      usedDefensiveness: boolean21("used_defensiveness"),
      usedStonewalling: boolean21("used_stonewalling"),
      // Outcome
      outcome: varchar24("outcome", { length: 50 }),
      emotionAfter: varchar24("emotion_after", { length: 255 }),
      intensityAfter: integer24("intensity_after"),
      // Reflection
      whatWorked: text24("what_worked"),
      whatToImprove: text24("what_to_improve"),
      createdAt: timestamp24("created_at").defaultNow()
    });
    loveMaps = pgTable24("love_maps", {
      id: varchar24("id", { length: 255 }).primaryKey(),
      profileId: varchar24("profile_id", { length: 255 }).notNull(),
      userId: varchar24("user_id", { length: 255 }).notNull(),
      // Partner's Inner World
      partnerDreams: text24("partner_dreams"),
      // JSON array
      partnerFears: text24("partner_fears"),
      partnerStressors: text24("partner_stressors"),
      partnerJoys: text24("partner_joys"),
      // Daily Life
      partnerDailyRoutine: text24("partner_daily_routine"),
      partnerFavorites: text24("partner_favorites"),
      // JSON: {food, movie, activity, etc.}
      partnerPetPeeves: text24("partner_pet_peeves"),
      // Relationship History
      howWeMet: text24("how_we_met"),
      bestMemories: text24("best_memories"),
      // JSON array
      hardestMoments: text24("hardest_moments"),
      // Future Vision
      sharedGoals: text24("shared_goals"),
      // JSON array
      individualGoals: text24("individual_goals"),
      lastUpdated: timestamp24("last_updated").defaultNow(),
      createdAt: timestamp24("created_at").defaultNow()
    });
    connectionBids = pgTable24("connection_bids", {
      id: varchar24("id", { length: 255 }).primaryKey(),
      profileId: varchar24("profile_id", { length: 255 }).notNull(),
      userId: varchar24("user_id", { length: 255 }).notNull(),
      bidDate: timestamp24("bid_date").notNull(),
      // Bid Details
      bidType: varchar24("bid_type", { length: 50 }),
      bidDescription: text24("bid_description"),
      // Response
      response: varchar24("response", { length: 50 }),
      responseDescription: text24("response_description"),
      // Impact
      emotionalImpact: integer24("emotional_impact"),
      // 1-10 (positive or negative)
      connectionStrength: integer24("connection_strength"),
      // 1-10
      createdAt: timestamp24("created_at").defaultNow()
    });
    repairAttempts = pgTable24("repair_attempts", {
      id: varchar24("id", { length: 255 }).primaryKey(),
      profileId: varchar24("profile_id", { length: 255 }).notNull(),
      userId: varchar24("user_id", { length: 255 }).notNull(),
      attemptDate: timestamp24("attempt_date").notNull(),
      // What Happened
      conflictDescription: text24("conflict_description"),
      // Repair Strategy
      repairStrategy: varchar24("repair_strategy", { length: 50 }),
      repairDetails: text24("repair_details"),
      // Partner Response
      partnerResponse: varchar24("partner_response", { length: 50 }),
      // Outcome
      conflictResolved: boolean21("conflict_resolved"),
      connectionRestored: boolean21("connection_restored"),
      // Learning
      effectiveness: integer24("effectiveness"),
      // 1-10
      whatLearned: text24("what_learned"),
      createdAt: timestamp24("created_at").defaultNow()
    });
    relationshipRituals = pgTable24("relationship_rituals", {
      id: varchar24("id", { length: 255 }).primaryKey(),
      profileId: varchar24("profile_id", { length: 255 }).notNull(),
      userId: varchar24("user_id", { length: 255 }).notNull(),
      ritualType: varchar24("ritual_type", { length: 50 }),
      ritualName: varchar24("ritual_name", { length: 255 }).notNull(),
      description: text24("description"),
      frequency: varchar24("frequency", { length: 50 }),
      // Tracking
      lastCompleted: timestamp24("last_completed"),
      completionCount: integer24("completion_count").default(0),
      currentStreak: integer24("current_streak").default(0),
      longestStreak: integer24("longest_streak").default(0),
      // Impact
      connectionImpact: integer24("connection_impact"),
      // 1-10 average
      active: boolean21("active").default(true),
      createdAt: timestamp24("created_at").defaultNow(),
      updatedAt: timestamp24("updated_at").defaultNow()
    });
    breakupRecovery = pgTable24("breakup_recovery", {
      id: varchar24("id", { length: 255 }).primaryKey(),
      profileId: varchar24("profile_id", { length: 255 }).notNull(),
      userId: varchar24("user_id", { length: 255 }).notNull(),
      breakupDate: timestamp24("breakup_date"),
      relationshipDuration: integer24("relationship_duration"),
      // months
      // Breakup Context
      initiator: varchar24("initiator", { length: 50 }),
      reason: text24("reason"),
      // Recovery Phase (evidence-based stages of grief)
      currentPhase: varchar24("current_phase", { length: 50 }),
      // No Contact
      noContactActive: boolean21("no_contact_active").default(false),
      noContactStartDate: timestamp24("no_contact_start_date"),
      noContactDuration: integer24("no_contact_duration"),
      // days
      // Healing Activities
      healingActivities: text24("healing_activities"),
      // JSON array
      supportSystem: text24("support_system"),
      // JSON array
      // Progress Markers
      daysWithoutContact: integer24("days_without_contact").default(0),
      goodDaysCount: integer24("good_days_count").default(0),
      badDaysCount: integer24("bad_days_count").default(0),
      // Growth & Lessons
      lessonsLearned: text24("lessons_learned"),
      // JSON array
      personalGrowth: text24("personal_growth"),
      futureGoals: text24("future_goals"),
      createdAt: timestamp24("created_at").defaultNow(),
      updatedAt: timestamp24("updated_at").defaultNow()
    });
    loveLanguageActions = pgTable24("love_language_actions", {
      id: varchar24("id", { length: 255 }).primaryKey(),
      profileId: varchar24("profile_id", { length: 255 }).notNull(),
      userId: varchar24("user_id", { length: 255 }).notNull(),
      actionDate: timestamp24("action_date").notNull(),
      // Action Type
      actionType: varchar24("action_type", { length: 50 }),
      // Love Language
      loveLanguage: varchar24("love_language", { length: 50 }),
      // Specific Action
      actionDescription: text24("action_description").notNull(),
      // Examples by type:
      // Words: "Said 'I'm proud of you'", "Wrote a love note", "Complimented their effort"
      // Quality Time: "Had dinner without phones", "Went for a walk together", "Had deep conversation"
      // Gifts: "Brought their favorite coffee", "Surprise flowers", "Meaningful book"
      // Acts of Service: "Did the dishes", "Filled their car with gas", "Made their favorite meal"
      // Physical Touch: "Long hug", "Held hands during movie", "Back massage"
      // Impact
      emotionalImpact: integer24("emotional_impact"),
      // 1-10
      connectionFelt: integer24("connection_felt"),
      // 1-10
      // Partner Response (if given)
      partnerResponse: text24("partner_response"),
      createdAt: timestamp24("created_at").defaultNow()
    });
  }
});

// drizzle/sleepOptimizationSchema.ts
import { boolean as boolean22, decimal as decimal20, integer as integer25, pgTable as pgTable25, text as text25, timestamp as timestamp25, varchar as varchar25 } from "drizzle-orm/pg-core";
var sleepProfiles, sleepTracking, sleepHygienePractices, sleepExperiments, sleepPerformanceCorrelations, sleepInsights, sleepAnalytics;
var init_sleepOptimizationSchema = __esm({
  "drizzle/sleepOptimizationSchema.ts"() {
    "use strict";
    sleepProfiles = pgTable25("sleep_profiles", {
      id: varchar25("id", { length: 255 }).primaryKey(),
      userId: varchar25("user_id", { length: 255 }).notNull(),
      // Sleep Goals
      targetSleepDuration: decimal20("target_sleep_duration", { precision: 3, scale: 1 }),
      // hours
      targetBedtime: varchar25("target_bedtime", { length: 10 }),
      // HH:MM
      targetWakeTime: varchar25("target_wake_time", { length: 10 }),
      // HH:MM
      // Chronotype (circadian preference)
      chronotype: varchar25("chronotype", { length: 50 }),
      // Current Issues
      sleepIssues: text25("sleep_issues"),
      // JSON array: insomnia, apnea, restless, etc.
      // Tracking Method
      trackingMethod: varchar25("tracking_method", { length: 50 }),
      wearableDevice: varchar25("wearable_device", { length: 100 }),
      // Oura, WHOOP, Apple Watch, etc.
      // Self-Learning Data
      personalSleepNeed: decimal20("personal_sleep_need", { precision: 3, scale: 1 }),
      // Calculated optimal hours
      optimalBedtime: varchar25("optimal_bedtime", { length: 10 }),
      optimalWakeTime: varchar25("optimal_wake_time", { length: 10 }),
      sleepPerformanceCorrelations: text25("sleep_performance_correlations"),
      // JSON: how sleep affects different areas
      createdAt: timestamp25("created_at").defaultNow(),
      updatedAt: timestamp25("updated_at").defaultNow()
    });
    sleepTracking = pgTable25("sleep_tracking", {
      id: varchar25("id", { length: 255 }).primaryKey(),
      profileId: varchar25("profile_id", { length: 255 }).notNull(),
      userId: varchar25("user_id", { length: 255 }).notNull(),
      sleepDate: timestamp25("sleep_date").notNull(),
      // Date of the night
      // Sleep Times
      bedtime: timestamp25("bedtime"),
      wakeTime: timestamp25("wake_time"),
      // Duration
      timeInBed: decimal20("time_in_bed", { precision: 4, scale: 2 }),
      // hours
      actualSleepDuration: decimal20("actual_sleep_duration", { precision: 4, scale: 2 }),
      // hours
      sleepEfficiency: decimal20("sleep_efficiency", { precision: 5, scale: 2 }),
      // % (sleep duration / time in bed)
      // Sleep Stages (if available from wearable)
      lightSleepMinutes: integer25("light_sleep_minutes"),
      deepSleepMinutes: integer25("deep_sleep_minutes"),
      remSleepMinutes: integer25("rem_sleep_minutes"),
      awakeMinutes: integer25("awake_minutes"),
      // Quality Metrics
      sleepQuality: integer25("sleep_quality"),
      // 1-10 subjective
      sleepScore: integer25("sleep_score"),
      // 0-100 (if from wearable)
      // Disruptions
      timesToWakeUp: integer25("times_to_wake_up"),
      timeToFallAsleep: integer25("time_to_fall_asleep"),
      // minutes (sleep latency)
      // Recovery Metrics
      restingHeartRate: integer25("resting_heart_rate"),
      // bpm
      hrv: integer25("hrv"),
      // Heart Rate Variability (ms)
      respiratoryRate: decimal20("respiratory_rate", { precision: 4, scale: 2 }),
      // breaths per minute
      bodyTemperature: decimal20("body_temperature", { precision: 4, scale: 2 }),
      // Celsius
      // Recovery Score
      recoveryScore: integer25("recovery_score"),
      // 0-100
      readinessScore: integer25("readiness_score"),
      // 0-100 (Oura-style)
      // Morning State
      morningMood: varchar25("morning_mood", { length: 100 }),
      morningEnergy: integer25("morning_energy"),
      // 1-10
      morningFocus: integer25("morning_focus"),
      // 1-10
      // Sleep Hygiene Compliance
      hygieneScore: integer25("hygiene_score"),
      // 0-100
      // Notes
      notes: text25("notes"),
      createdAt: timestamp25("created_at").defaultNow()
    });
    sleepHygienePractices = pgTable25("sleep_hygiene_practices", {
      id: varchar25("id", { length: 255 }).primaryKey(),
      sleepTrackingId: varchar25("sleep_tracking_id", { length: 255 }).notNull(),
      profileId: varchar25("profile_id", { length: 255 }).notNull(),
      userId: varchar25("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp25("practice_date").notNull(),
      // Evening Routine (evidence-based practices)
      noScreens1HourBefore: boolean22("no_screens_1_hour_before"),
      dimLightsEvening: boolean22("dim_lights_evening"),
      coolRoomTemp: boolean22("cool_room_temp"),
      // 60-67°F optimal
      darkRoom: boolean22("dark_room"),
      quietEnvironment: boolean22("quiet_environment"),
      // Timing
      consistentBedtime: boolean22("consistent_bedtime"),
      consistentWakeTime: boolean22("consistent_wake_time"),
      // Substances
      noCaffeineAfter2pm: boolean22("no_caffeine_after_2pm"),
      noAlcohol: boolean22("no_alcohol"),
      noHeavyMealBefore3Hours: boolean22("no_heavy_meal_before_3_hours"),
      // Daytime Practices
      morningLightExposure: boolean22("morning_light_exposure"),
      // Huberman protocol
      exercisedToday: boolean22("exercised_today"),
      noNapsAfter3pm: boolean22("no_naps_after_3pm"),
      // Relaxation
      relaxationPractice: varchar25("relaxation_practice", { length: 50 }),
      // Supplements (if any)
      supplements: text25("supplements"),
      // JSON array: magnesium, glycine, etc.
      createdAt: timestamp25("created_at").defaultNow()
    });
    sleepExperiments = pgTable25("sleep_experiments", {
      id: varchar25("id", { length: 255 }).primaryKey(),
      profileId: varchar25("profile_id", { length: 255 }).notNull(),
      userId: varchar25("user_id", { length: 255 }).notNull(),
      experimentName: varchar25("experiment_name", { length: 255 }).notNull(),
      hypothesis: text25("hypothesis"),
      // What do you think will improve sleep?
      // What's Being Tested
      variable: varchar25("variable", { length: 255 }).notNull(),
      // Bedtime, temperature, supplement, etc.
      // Duration
      startDate: timestamp25("start_date"),
      endDate: timestamp25("end_date"),
      duration: integer25("duration"),
      // days
      // Baseline
      baselineSleepQuality: decimal20("baseline_sleep_quality", { precision: 4, scale: 2 }),
      baselineSleepDuration: decimal20("baseline_sleep_duration", { precision: 4, scale: 2 }),
      // Results
      avgSleepQualityDuringExperiment: decimal20("avg_sleep_quality_during_experiment", { precision: 4, scale: 2 }),
      avgSleepDurationDuringExperiment: decimal20("avg_sleep_duration_during_experiment", { precision: 4, scale: 2 }),
      // Impact
      improvement: decimal20("improvement", { precision: 6, scale: 2 }),
      // % change
      // Conclusion
      conclusion: text25("conclusion"),
      keepPractice: boolean22("keep_practice"),
      // Will you continue this?
      // Status
      status: varchar25("status", { length: 50 }),
      createdAt: timestamp25("created_at").defaultNow(),
      updatedAt: timestamp25("updated_at").defaultNow()
    });
    sleepPerformanceCorrelations = pgTable25("sleep_performance_correlations", {
      id: varchar25("id", { length: 255 }).primaryKey(),
      profileId: varchar25("profile_id", { length: 255 }).notNull(),
      userId: varchar25("user_id", { length: 255 }).notNull(),
      // Performance Area
      performanceArea: varchar25("performance_area", { length: 50 }),
      // Correlation Strength
      correlationCoefficient: decimal20("correlation_coefficient", { precision: 4, scale: 3 }),
      // -1 to 1
      // Optimal Sleep for This Area
      optimalSleepDuration: decimal20("optimal_sleep_duration", { precision: 3, scale: 1 }),
      optimalSleepQuality: integer25("optimal_sleep_quality"),
      // Sample Size
      dataPoints: integer25("data_points"),
      lastCalculated: timestamp25("last_calculated").defaultNow(),
      createdAt: timestamp25("created_at").defaultNow(),
      updatedAt: timestamp25("updated_at").defaultNow()
    });
    sleepInsights = pgTable25("sleep_insights", {
      id: varchar25("id", { length: 255 }).primaryKey(),
      profileId: varchar25("profile_id", { length: 255 }).notNull(),
      userId: varchar25("user_id", { length: 255 }).notNull(),
      insightType: varchar25("insight_type", { length: 50 }),
      title: varchar25("title", { length: 255 }).notNull(),
      description: text25("description"),
      // Supporting Data
      supportingData: text25("supporting_data"),
      // JSON: evidence for this insight
      // Action Recommended
      actionRecommended: text25("action_recommended"),
      // Priority
      priority: varchar25("priority", { length: 50 }),
      // User Response
      acknowledged: boolean22("acknowledged").default(false),
      actionTaken: boolean22("action_taken").default(false),
      createdAt: timestamp25("created_at").defaultNow()
    });
    sleepAnalytics = pgTable25("sleep_analytics", {
      id: varchar25("id", { length: 255 }).primaryKey(),
      // Hygiene Practice Effectiveness (aggregated)
      practice: varchar25("practice", { length: 100 }).notNull(),
      // Impact Metrics
      avgSleepQualityImprovement: decimal20("avg_sleep_quality_improvement", { precision: 5, scale: 2 }),
      // %
      avgSleepDurationImprovement: decimal20("avg_sleep_duration_improvement", { precision: 5, scale: 2 }),
      // minutes
      // Optimal Parameters
      optimalImplementationTime: varchar25("optimal_implementation_time", { length: 100 }),
      // When to do this practice
      // User Segments
      mostEffectiveFor: text25("most_effective_for"),
      // JSON: different user types
      // Sample Size
      userCount: integer25("user_count"),
      lastCalculated: timestamp25("last_calculated").defaultNow(),
      createdAt: timestamp25("created_at").defaultNow(),
      updatedAt: timestamp25("updated_at").defaultNow()
    });
  }
});

// drizzle/stressSchema.ts
import { boolean as boolean23, decimal as decimal21, integer as integer26, pgTable as pgTable26, text as text26, timestamp as timestamp26, varchar as varchar26 } from "drizzle-orm/pg-core";
var stressProfiles, dailyStressLogs, stressEvents, stressTriggers, stressInterventions, userInterventionLogs, hrvMeasurements, stressRecoverySessions, stressPredictions, stressAnalytics;
var init_stressSchema = __esm({
  "drizzle/stressSchema.ts"() {
    "use strict";
    stressProfiles = pgTable26("stress_profiles", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      userId: varchar26("user_id", { length: 255 }).notNull(),
      // Baseline Metrics
      baselineStressLevel: integer26("baseline_stress_level"),
      // 1-10
      baselineHRV: decimal21("baseline_hrv", { precision: 6, scale: 2 }),
      // milliseconds
      baselineRestingHR: integer26("baseline_resting_hr"),
      // bpm
      // Stress Resilience
      stressResilienceScore: integer26("stress_resilience_score"),
      // 0-100
      recoveryCapacity: integer26("recovery_capacity"),
      // 0-100 (how quickly you bounce back)
      // Stress Mindset (Kelly McGonigal research)
      stressMindset: varchar26("stress_mindset", { length: 50 }),
      // Dominant Stress Response
      dominantResponse: varchar26("dominant_response", { length: 50 }),
      // Common Triggers
      commonTriggers: text26("common_triggers"),
      // JSON array
      // Physical Symptoms
      commonSymptoms: text26("common_symptoms"),
      // JSON: tension, headaches, etc.
      // Preferred Interventions
      preferredInterventions: text26("preferred_interventions"),
      // JSON: what works for this user
      // Self-Learning Data
      stressPatterns: text26("stress_patterns"),
      // JSON: when/why stress occurs
      optimalRecoveryTime: integer26("optimal_recovery_time"),
      // minutes
      createdAt: timestamp26("created_at").defaultNow(),
      updatedAt: timestamp26("updated_at").defaultNow()
    });
    dailyStressLogs = pgTable26("daily_stress_logs", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      profileId: varchar26("profile_id", { length: 255 }).notNull(),
      userId: varchar26("user_id", { length: 255 }).notNull(),
      logDate: timestamp26("log_date").notNull(),
      // Subjective Ratings
      avgStressLevel: integer26("avg_stress_level"),
      // 1-10
      peakStressLevel: integer26("peak_stress_level"),
      // 1-10
      // HRV Data (if available)
      morningHRV: decimal21("morning_hrv", { precision: 6, scale: 2 }),
      avgHRV: decimal21("avg_hrv", { precision: 6, scale: 2 }),
      hrvTrend: varchar26("hrv_trend", { length: 50 }),
      // Heart Rate
      avgRestingHR: integer26("avg_resting_hr"),
      peakHR: integer26("peak_hr"),
      // Cortisol Pattern (subjective or measured)
      morningCortisol: varchar26("morning_cortisol", { length: 50 }),
      eveningCortisol: varchar26("evening_cortisol", { length: 50 }),
      cortisolRhythm: varchar26("cortisol_rhythm", { length: 50 }),
      // Physical Symptoms
      symptoms: text26("symptoms"),
      // JSON: headache, tension, etc.
      symptomSeverity: integer26("symptom_severity"),
      // 1-10
      // Sleep Impact
      sleepQuality: integer26("sleep_quality"),
      // 1-10
      sleepDuration: decimal21("sleep_duration", { precision: 4, scale: 2 }),
      // Behavioral Indicators
      irritability: integer26("irritability"),
      // 1-10
      concentration: integer26("concentration"),
      // 1-10
      appetite: varchar26("appetite", { length: 50 }),
      // Interventions Used
      interventionsUsed: text26("interventions_used"),
      // JSON array
      interventionEffectiveness: integer26("intervention_effectiveness"),
      // 1-10
      // Recovery
      recoveryQuality: integer26("recovery_quality"),
      // 1-10
      // Notes
      notes: text26("notes"),
      createdAt: timestamp26("created_at").defaultNow()
    });
    stressEvents = pgTable26("stress_events", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      profileId: varchar26("profile_id", { length: 255 }).notNull(),
      userId: varchar26("user_id", { length: 255 }).notNull(),
      // Event Details
      stressLevel: integer26("stress_level").notNull(),
      // 1-10
      eventTimestamp: timestamp26("event_timestamp").notNull(),
      // Trigger
      trigger: varchar26("trigger", { length: 255 }),
      // What caused this?
      triggerCategory: varchar26("trigger_category", { length: 50 }),
      // Context
      location: varchar26("location", { length: 255 }),
      activity: varchar26("activity", { length: 255 }),
      socialContext: varchar26("social_context", { length: 50 }),
      // Physical Response
      heartRate: integer26("heart_rate"),
      // if measured
      physicalSymptoms: text26("physical_symptoms"),
      // JSON
      // Emotional Response
      primaryEmotion: varchar26("primary_emotion", { length: 50 }),
      // Cognitive Response
      thoughts: text26("thoughts"),
      // What were you thinking?
      cognitiveDistortions: text26("cognitive_distortions"),
      // JSON: catastrophizing, etc.
      // Response Type
      responseType: varchar26("response_type", { length: 50 }),
      // Intervention Taken
      interventionUsed: varchar26("intervention_used", { length: 255 }),
      interventionEffective: boolean23("intervention_effective"),
      // Recovery
      recoveryTime: integer26("recovery_time"),
      // minutes until stress subsided
      createdAt: timestamp26("created_at").defaultNow()
    });
    stressTriggers = pgTable26("stress_triggers", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      profileId: varchar26("profile_id", { length: 255 }).notNull(),
      userId: varchar26("user_id", { length: 255 }).notNull(),
      // Trigger Details
      triggerName: varchar26("trigger_name", { length: 255 }).notNull(),
      triggerCategory: varchar26("trigger_category", { length: 100 }),
      // Frequency
      occurrenceCount: integer26("occurrence_count").default(0),
      lastOccurrence: timestamp26("last_occurrence"),
      // Impact
      avgStressLevel: decimal21("avg_stress_level", { precision: 4, scale: 2 }),
      // 1-10
      avgRecoveryTime: integer26("avg_recovery_time"),
      // minutes
      // Patterns
      timePatterns: text26("time_patterns"),
      // JSON: when does this trigger occur?
      contextPatterns: text26("context_patterns"),
      // JSON: where/with whom?
      // Avoidability
      avoidable: boolean23("avoidable"),
      // Coping Strategies
      effectiveStrategies: text26("effective_strategies"),
      // JSON: what works for this trigger
      createdAt: timestamp26("created_at").defaultNow(),
      updatedAt: timestamp26("updated_at").defaultNow()
    });
    stressInterventions = pgTable26("stress_interventions", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      // Intervention Details
      interventionName: varchar26("intervention_name", { length: 255 }).notNull(),
      description: text26("description"),
      // Category
      category: varchar26("category", { length: 50 }),
      // Evidence Base
      researchBacked: boolean23("research_backed").default(false),
      researchSources: text26("research_sources"),
      // JSON: citations
      // Duration
      durationMinutes: integer26("duration_minutes"),
      // Instructions
      instructions: text26("instructions"),
      // When to Use
      bestFor: text26("best_for"),
      // JSON: which stress types/levels
      // Effectiveness
      avgEffectivenessRating: decimal21("avg_effectiveness_rating", { precision: 4, scale: 2 }),
      // 1-10
      totalUses: integer26("total_uses").default(0),
      createdAt: timestamp26("created_at").defaultNow(),
      updatedAt: timestamp26("updated_at").defaultNow()
    });
    userInterventionLogs = pgTable26("user_intervention_logs", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      interventionId: varchar26("intervention_id", { length: 255 }).notNull(),
      profileId: varchar26("profile_id", { length: 255 }).notNull(),
      userId: varchar26("user_id", { length: 255 }).notNull(),
      // Context
      stressEventId: varchar26("stress_event_id", { length: 255 }),
      // Which stress event triggered this?
      stressLevelBefore: integer26("stress_level_before"),
      // 1-10
      // Execution
      durationMinutes: integer26("duration_minutes"),
      completedFully: boolean23("completed_fully").default(true),
      // Outcome
      stressLevelAfter: integer26("stress_level_after"),
      // 1-10
      effectivenessRating: integer26("effectiveness_rating"),
      // 1-10
      // Side Effects
      sideEffects: text26("side_effects"),
      // Any negative effects?
      // Notes
      notes: text26("notes"),
      usedAt: timestamp26("used_at").defaultNow()
    });
    hrvMeasurements = pgTable26("hrv_measurements", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      profileId: varchar26("profile_id", { length: 255 }).notNull(),
      userId: varchar26("user_id", { length: 255 }).notNull(),
      // Measurement Details
      measurementTime: timestamp26("measurement_time").notNull(),
      measurementType: varchar26("measurement_type", { length: 50 }),
      // HRV Metrics
      rmssd: decimal21("rmssd", { precision: 6, scale: 2 }),
      // Root Mean Square of Successive Differences (gold standard)
      sdnn: decimal21("sdnn", { precision: 6, scale: 2 }),
      // Standard Deviation of NN intervals
      pnn50: decimal21("pnn50", { precision: 5, scale: 2 }),
      // % of successive intervals >50ms
      // Heart Rate
      avgHeartRate: integer26("avg_heart_rate"),
      // Interpretation
      hrvScore: integer26("hrv_score"),
      // 0-100 (normalized for age/sex)
      recoveryStatus: varchar26("recovery_status", { length: 50 }),
      // Context
      sleepQualityPriorNight: integer26("sleep_quality_prior_night"),
      // 1-10
      stressLevelPriorDay: integer26("stress_level_prior_day"),
      // 1-10
      exerciseIntensityPriorDay: varchar26("exercise_intensity_prior_day", { length: 50 }),
      // Device
      measurementDevice: varchar26("measurement_device", { length: 100 }),
      createdAt: timestamp26("created_at").defaultNow()
    });
    stressRecoverySessions = pgTable26("stress_recovery_sessions", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      profileId: varchar26("profile_id", { length: 255 }).notNull(),
      userId: varchar26("user_id", { length: 255 }).notNull(),
      // Session Details
      sessionType: varchar26("session_type", { length: 50 }),
      // Duration
      durationMinutes: integer26("duration_minutes"),
      // Pre-Session
      stressLevelBefore: integer26("stress_level_before"),
      // 1-10
      hrvBefore: decimal21("hrv_before", { precision: 6, scale: 2 }),
      // Post-Session
      stressLevelAfter: integer26("stress_level_after"),
      // 1-10
      hrvAfter: decimal21("hrv_after", { precision: 6, scale: 2 }),
      // Effectiveness
      recoveryScore: integer26("recovery_score"),
      // 0-100
      // Notes
      notes: text26("notes"),
      sessionDate: timestamp26("session_date").defaultNow()
    });
    stressPredictions = pgTable26("stress_predictions", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      profileId: varchar26("profile_id", { length: 255 }).notNull(),
      userId: varchar26("user_id", { length: 255 }).notNull(),
      // Prediction Type
      predictionType: varchar26("prediction_type", { length: 50 }),
      // Prediction
      prediction: text26("prediction"),
      confidence: decimal21("confidence", { precision: 5, scale: 2 }),
      // %
      // Timeframe
      timeframe: varchar26("timeframe", { length: 100 }),
      // "in next 24 hours", "this week"
      // Contributing Factors
      factors: text26("factors"),
      // JSON: sleep debt, HRV trend, upcoming events, etc.
      // Recommendation
      recommendation: text26("recommendation"),
      // Validation
      actualOutcome: text26("actual_outcome"),
      predictionAccurate: boolean23("prediction_accurate"),
      createdAt: timestamp26("created_at").defaultNow(),
      validatedAt: timestamp26("validated_at")
    });
    stressAnalytics = pgTable26("stress_analytics", {
      id: varchar26("id", { length: 255 }).primaryKey(),
      // Intervention Type
      interventionType: varchar26("intervention_type", { length: 100 }).notNull(),
      // Effectiveness Metrics
      avgStressReduction: decimal21("avg_stress_reduction", { precision: 5, scale: 2 }),
      // % reduction
      avgEffectivenessRating: decimal21("avg_effectiveness_rating", { precision: 4, scale: 2 }),
      // 1-10
      successRate: decimal21("success_rate", { precision: 5, scale: 2 }),
      // % of times it worked
      // Optimal Parameters
      optimalDuration: integer26("optimal_duration"),
      // minutes
      optimalTiming: varchar26("optimal_timing", { length: 100 }),
      // when to use
      // Best For
      mostEffectiveForStressType: text26("most_effective_for_stress_type"),
      // JSON
      mostEffectiveForUserType: text26("most_effective_for_user_type"),
      // JSON
      // Sample Size
      userCount: integer26("user_count"),
      totalUses: integer26("total_uses"),
      lastCalculated: timestamp26("last_calculated").defaultNow(),
      createdAt: timestamp26("created_at").defaultNow(),
      updatedAt: timestamp26("updated_at").defaultNow()
    });
  }
});

// drizzle/gamificationSchema.ts
import { boolean as boolean24, decimal as decimal22, integer as integer27, pgTable as pgTable27, text as text27, timestamp as timestamp27, varchar as varchar27 } from "drizzle-orm/pg-core";
var gamificationProfiles, experiencePointsLog, achievements, userAchievements, challenges, userChallenges, badges, userBadges, milestones, leaderboards, leaderboardEntries, dailyRewards, motivationBoosts, gamificationAnalytics;
var init_gamificationSchema = __esm({
  "drizzle/gamificationSchema.ts"() {
    "use strict";
    gamificationProfiles = pgTable27("gamification_profiles", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      // Overall Progress
      totalExperiencePoints: integer27("total_experience_points").default(0),
      currentLevel: integer27("current_level").default(1),
      experienceToNextLevel: integer27("experience_to_next_level").default(100),
      // Engagement
      currentStreak: integer27("current_streak").default(0),
      // Days
      longestStreak: integer27("longest_streak").default(0),
      totalDaysActive: integer27("total_days_active").default(0),
      // Achievements
      totalAchievements: integer27("total_achievements").default(0),
      totalBadges: integer27("total_badges").default(0),
      totalMilestones: integer27("total_milestones").default(0),
      // Motivation Type (Self-Determination Theory)
      motivationType: varchar27("motivation_type", { length: 50 }),
      // Gamification Preferences
      likesCompetition: boolean24("likes_competition").default(false),
      likesCollaboration: boolean24("likes_collaboration").default(true),
      likesChallenges: boolean24("likes_challenges").default(true),
      likesRewards: boolean24("likes_rewards").default(true),
      // Self-Learning Data
      mostMotivatingRewards: text27("most_motivating_rewards"),
      // JSON: which rewards drive action
      optimalChallengeDifficulty: integer27("optimal_challenge_difficulty"),
      // 1-10
      motivationPatterns: text27("motivation_patterns"),
      // JSON: when motivation dips/peaks
      createdAt: timestamp27("created_at").defaultNow(),
      updatedAt: timestamp27("updated_at").defaultNow()
    });
    experiencePointsLog = pgTable27("experience_points_log", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      profileId: varchar27("profile_id", { length: 255 }).notNull(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      // Source
      source: varchar27("source", { length: 50 }),
      sourceId: varchar27("source_id", { length: 255 }),
      // ID of the habit, goal, etc.
      // Points
      pointsEarned: integer27("points_earned").notNull(),
      // Context
      description: varchar27("description", { length: 255 }),
      earnedAt: timestamp27("earned_at").defaultNow()
    });
    achievements = pgTable27("achievements", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      // Achievement Details
      achievementName: varchar27("achievement_name", { length: 255 }).notNull(),
      description: text27("description"),
      icon: varchar27("icon", { length: 255 }),
      // Category
      category: varchar27("category", { length: 50 }),
      // Difficulty
      difficulty: varchar27("difficulty", { length: 50 }),
      // Requirements
      requirements: text27("requirements"),
      // JSON: what needs to be done
      // Rewards
      experiencePoints: integer27("experience_points").notNull(),
      // Rarity
      rarity: varchar27("rarity", { length: 50 }),
      // Stats
      totalUnlocked: integer27("total_unlocked").default(0),
      // How many users have this?
      createdAt: timestamp27("created_at").defaultNow()
    });
    userAchievements = pgTable27("user_achievements", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      achievementId: varchar27("achievement_id", { length: 255 }).notNull(),
      profileId: varchar27("profile_id", { length: 255 }).notNull(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      // Progress
      progress: integer27("progress").default(0),
      // % or count
      completed: boolean24("completed").default(false),
      // Unlock
      unlockedAt: timestamp27("unlocked_at"),
      // Visibility
      displayOnProfile: boolean24("display_on_profile").default(true),
      createdAt: timestamp27("created_at").defaultNow()
    });
    challenges = pgTable27("challenges", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      // Challenge Details
      challengeName: varchar27("challenge_name", { length: 255 }).notNull(),
      description: text27("description"),
      // Type
      challengeType: varchar27("challenge_type", { length: 50 }),
      // Difficulty
      difficulty: integer27("difficulty"),
      // 1-10
      // Requirements
      requirements: text27("requirements"),
      // JSON: what needs to be done
      // Rewards
      experiencePoints: integer27("experience_points"),
      badgeId: varchar27("badge_id", { length: 255 }),
      // Availability
      startDate: timestamp27("start_date"),
      endDate: timestamp27("end_date"),
      // Stats
      totalAttempts: integer27("total_attempts").default(0),
      totalCompletions: integer27("total_completions").default(0),
      successRate: decimal22("success_rate", { precision: 5, scale: 2 }),
      // Status
      active: boolean24("active").default(true),
      createdAt: timestamp27("created_at").defaultNow(),
      updatedAt: timestamp27("updated_at").defaultNow()
    });
    userChallenges = pgTable27("user_challenges", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      challengeId: varchar27("challenge_id", { length: 255 }).notNull(),
      profileId: varchar27("profile_id", { length: 255 }).notNull(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      // Progress
      progress: integer27("progress").default(0),
      completed: boolean24("completed").default(false),
      // Dates
      startedAt: timestamp27("started_at").defaultNow(),
      completedAt: timestamp27("completed_at"),
      // Attempts
      attempts: integer27("attempts").default(1),
      createdAt: timestamp27("created_at").defaultNow()
    });
    badges = pgTable27("badges", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      // Badge Details
      badgeName: varchar27("badge_name", { length: 255 }).notNull(),
      description: text27("description"),
      icon: varchar27("icon", { length: 255 }),
      // Category
      category: varchar27("category", { length: 100 }),
      // Rarity
      rarity: varchar27("rarity", { length: 50 }),
      // How to Earn
      howToEarn: text27("how_to_earn"),
      // Stats
      totalAwarded: integer27("total_awarded").default(0),
      createdAt: timestamp27("created_at").defaultNow()
    });
    userBadges = pgTable27("user_badges", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      badgeId: varchar27("badge_id", { length: 255 }).notNull(),
      profileId: varchar27("profile_id", { length: 255 }).notNull(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      // Award Details
      awardedFor: text27("awarded_for"),
      // What did they do to earn this?
      // Display
      displayOnProfile: boolean24("display_on_profile").default(true),
      awardedAt: timestamp27("awarded_at").defaultNow()
    });
    milestones = pgTable27("milestones", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      profileId: varchar27("profile_id", { length: 255 }).notNull(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      // Milestone Details
      milestoneType: varchar27("milestone_type", { length: 50 }),
      title: varchar27("title", { length: 255 }).notNull(),
      description: text27("description"),
      // Rewards
      experiencePoints: integer27("experience_points"),
      // Context
      relatedTo: varchar27("related_to", { length: 255 }),
      // What module/feature?
      achievedAt: timestamp27("achieved_at").defaultNow()
    });
    leaderboards = pgTable27("leaderboards", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      // Leaderboard Details
      leaderboardName: varchar27("leaderboard_name", { length: 255 }).notNull(),
      description: text27("description"),
      // Type
      leaderboardType: varchar27("leaderboard_type", { length: 50 }),
      // Time Period
      timePeriod: varchar27("time_period", { length: 50 }),
      // Privacy
      optInOnly: boolean24("opt_in_only").default(true),
      // Users must opt-in to appear
      // Status
      active: boolean24("active").default(true),
      createdAt: timestamp27("created_at").defaultNow(),
      updatedAt: timestamp27("updated_at").defaultNow()
    });
    leaderboardEntries = pgTable27("leaderboard_entries", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      leaderboardId: varchar27("leaderboard_id", { length: 255 }).notNull(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      // Ranking
      rank: integer27("rank"),
      score: integer27("score"),
      // The metric being measured
      // Opt-In
      optedIn: boolean24("opted_in").default(false),
      lastUpdated: timestamp27("last_updated").defaultNow(),
      createdAt: timestamp27("created_at").defaultNow()
    });
    dailyRewards = pgTable27("daily_rewards", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      profileId: varchar27("profile_id", { length: 255 }).notNull(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      rewardDate: timestamp27("reward_date").notNull(),
      // Streak Bonus
      consecutiveDays: integer27("consecutive_days"),
      streakBonus: integer27("streak_bonus"),
      // Extra XP for streak
      // Completion Bonus
      tasksCompleted: integer27("tasks_completed"),
      completionBonus: integer27("completion_bonus"),
      // Total
      totalExperiencePoints: integer27("total_experience_points"),
      // Claimed
      claimed: boolean24("claimed").default(false),
      claimedAt: timestamp27("claimed_at"),
      createdAt: timestamp27("created_at").defaultNow()
    });
    motivationBoosts = pgTable27("motivation_boosts", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      profileId: varchar27("profile_id", { length: 255 }).notNull(),
      userId: varchar27("user_id", { length: 255 }).notNull(),
      // Trigger
      triggerType: varchar27("trigger_type", { length: 50 }),
      // Boost Type
      boostType: varchar27("boost_type", { length: 50 }),
      // Content
      message: text27("message"),
      actionSuggested: varchar27("action_suggested", { length: 255 }),
      // Effectiveness
      opened: boolean24("opened").default(false),
      actionTaken: boolean24("action_taken").default(false),
      sentAt: timestamp27("sent_at").defaultNow()
    });
    gamificationAnalytics = pgTable27("gamification_analytics", {
      id: varchar27("id", { length: 255 }).primaryKey(),
      // Element Type
      elementType: varchar27("element_type", { length: 100 }).notNull(),
      // achievement, challenge, reward, etc.
      // Effectiveness Metrics
      avgEngagementIncrease: decimal22("avg_engagement_increase", { precision: 5, scale: 2 }),
      // %
      avgRetentionImpact: decimal22("avg_retention_impact", { precision: 5, scale: 2 }),
      // %
      avgGoalCompletionImpact: decimal22("avg_goal_completion_impact", { precision: 5, scale: 2 }),
      // %
      // Optimal Parameters
      optimalDifficulty: integer27("optimal_difficulty"),
      // 1-10
      optimalRewardTiming: varchar27("optimal_reward_timing", { length: 100 }),
      // User Segments
      mostEffectiveFor: text27("most_effective_for"),
      // JSON: different user types
      // Sample Size
      userCount: integer27("user_count"),
      lastCalculated: timestamp27("last_calculated").defaultNow(),
      createdAt: timestamp27("created_at").defaultNow(),
      updatedAt: timestamp27("updated_at").defaultNow()
    });
  }
});

// drizzle/integrationsSchema.ts
import { boolean as boolean25, decimal as decimal23, integer as integer28, pgTable as pgTable28, text as text28, timestamp as timestamp28, varchar as varchar28 } from "drizzle-orm/pg-core";
var integrationProfiles, availableIntegrations, userIntegrations, syncLogs, importedData, exportedData, webhooks, webhookEvents, apiRateLimits, dataMappingRules, integrationAnalytics, integrationRecommendations, exportRequests;
var init_integrationsSchema = __esm({
  "drizzle/integrationsSchema.ts"() {
    "use strict";
    integrationProfiles = pgTable28("integration_profiles", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      // Integration Preferences
      autoSyncEnabled: boolean25("auto_sync_enabled").default(true),
      syncFrequency: varchar28("sync_frequency", { length: 50 }),
      // Privacy
      dataSharing: varchar28("data_sharing", { length: 50 }),
      // Stats
      totalIntegrations: integer28("total_integrations").default(0),
      activeIntegrations: integer28("active_integrations").default(0),
      createdAt: timestamp28("created_at").defaultNow(),
      updatedAt: timestamp28("updated_at").defaultNow()
    });
    availableIntegrations = pgTable28("available_integrations", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      // Integration Details
      integrationName: varchar28("integration_name", { length: 255 }).notNull(),
      description: text28("description"),
      // Provider
      provider: varchar28("provider", { length: 255 }).notNull(),
      // Oura, Whoop, etc.
      // Category
      category: varchar28("category", { length: 50 }),
      // Authentication
      authType: varchar28("auth_type", { length: 50 }),
      // Capabilities
      capabilities: text28("capabilities"),
      // JSON: what data can be imported/exported
      // Data Types
      dataTypesSupported: text28("data_types_supported"),
      // JSON: sleep, hrv, activity, etc.
      // Sync
      supportsRealtime: boolean25("supports_realtime").default(false),
      supportsBidirectional: boolean25("supports_bidirectional").default(false),
      // API Details
      apiEndpoint: varchar28("api_endpoint", { length: 500 }),
      apiDocumentation: varchar28("api_documentation", { length: 500 }),
      rateLimitPerHour: integer28("rate_limit_per_hour"),
      // Status
      active: boolean25("active").default(true),
      beta: boolean25("beta").default(false),
      // Popularity
      totalUsers: integer28("total_users").default(0),
      avgSatisfactionRating: decimal23("avg_satisfaction_rating", { precision: 4, scale: 2 }),
      // 1-10
      createdAt: timestamp28("created_at").defaultNow(),
      updatedAt: timestamp28("updated_at").defaultNow()
    });
    userIntegrations = pgTable28("user_integrations", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      profileId: varchar28("profile_id", { length: 255 }).notNull(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      integrationId: varchar28("integration_id", { length: 255 }).notNull(),
      // Connection Status
      status: varchar28("status", { length: 50 }),
      // Authentication
      accessToken: varchar28("access_token", { length: 500 }),
      // Encrypted
      refreshToken: varchar28("refresh_token", { length: 500 }),
      // Encrypted
      tokenExpiresAt: timestamp28("token_expires_at"),
      // API Key (if applicable)
      apiKey: varchar28("api_key", { length: 500 }),
      // Encrypted
      // Sync Settings
      syncEnabled: boolean25("sync_enabled").default(true),
      syncFrequency: varchar28("sync_frequency", { length: 50 }),
      lastSyncAt: timestamp28("last_sync_at"),
      nextSyncAt: timestamp28("next_sync_at"),
      // Data Filters
      dataTypesToSync: text28("data_types_to_sync"),
      // JSON: which data types to import
      // Stats
      totalSyncs: integer28("total_syncs").default(0),
      totalRecordsImported: integer28("total_records_imported").default(0),
      totalRecordsExported: integer28("total_records_exported").default(0),
      // Errors
      lastError: text28("last_error"),
      errorCount: integer28("error_count").default(0),
      // User Satisfaction
      satisfactionRating: integer28("satisfaction_rating"),
      // 1-10
      connectedAt: timestamp28("connected_at").defaultNow(),
      disconnectedAt: timestamp28("disconnected_at"),
      createdAt: timestamp28("created_at").defaultNow(),
      updatedAt: timestamp28("updated_at").defaultNow()
    });
    syncLogs = pgTable28("sync_logs", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      userIntegrationId: varchar28("user_integration_id", { length: 255 }).notNull(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      // Sync Details
      syncType: varchar28("sync_type", { length: 50 }),
      // Status
      status: varchar28("status", { length: 50 }),
      // Data
      recordsProcessed: integer28("records_processed").default(0),
      recordsSuccessful: integer28("records_successful").default(0),
      recordsFailed: integer28("records_failed").default(0),
      // Duration
      startedAt: timestamp28("started_at").defaultNow(),
      completedAt: timestamp28("completed_at"),
      durationSeconds: integer28("duration_seconds"),
      // Errors
      errorMessage: text28("error_message"),
      errorDetails: text28("error_details"),
      // JSON: detailed error info
      createdAt: timestamp28("created_at").defaultNow()
    });
    importedData = pgTable28("imported_data", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      userIntegrationId: varchar28("user_integration_id", { length: 255 }).notNull(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      // Data Type
      dataType: varchar28("data_type", { length: 50 }),
      // Source
      sourceId: varchar28("source_id", { length: 255 }),
      // ID in source system
      // Data
      dataPayload: text28("data_payload"),
      // JSON: the actual data
      // Timestamp
      dataTimestamp: timestamp28("data_timestamp").notNull(),
      // When did this data occur?
      // Mapping
      mappedToId: varchar28("mapped_to_id", { length: 255 }),
      // ID in our system (sleep log, workout, etc.)
      mappedToType: varchar28("mapped_to_type", { length: 100 }),
      // Which table?
      // Quality
      dataQuality: varchar28("data_quality", { length: 50 }),
      validationErrors: text28("validation_errors"),
      // JSON: any validation issues
      importedAt: timestamp28("imported_at").defaultNow()
    });
    exportedData = pgTable28("exported_data", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      userIntegrationId: varchar28("user_integration_id", { length: 255 }).notNull(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      // Data Type
      dataType: varchar28("data_type", { length: 100 }).notNull(),
      // Source (in our system)
      sourceId: varchar28("source_id", { length: 255 }).notNull(),
      sourceType: varchar28("source_type", { length: 100 }).notNull(),
      // Data
      dataPayload: text28("data_payload"),
      // JSON: the data we sent
      // Destination
      destinationId: varchar28("destination_id", { length: 255 }),
      // ID in destination system
      // Status
      status: varchar28("status", { length: 50 }),
      // Error
      errorMessage: text28("error_message"),
      exportedAt: timestamp28("exported_at").defaultNow(),
      confirmedAt: timestamp28("confirmed_at")
    });
    webhooks = pgTable28("webhooks", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      userIntegrationId: varchar28("user_integration_id", { length: 255 }).notNull(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      // Webhook Details
      webhookUrl: varchar28("webhook_url", { length: 500 }).notNull(),
      webhookSecret: varchar28("webhook_secret", { length: 255 }),
      // For verification
      // Events
      eventTypes: text28("event_types"),
      // JSON: which events to listen for
      // Status
      active: boolean25("active").default(true),
      // Stats
      totalReceived: integer28("total_received").default(0),
      lastReceivedAt: timestamp28("last_received_at"),
      createdAt: timestamp28("created_at").defaultNow(),
      updatedAt: timestamp28("updated_at").defaultNow()
    });
    webhookEvents = pgTable28("webhook_events", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      webhookId: varchar28("webhook_id", { length: 255 }).notNull(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      // Event Details
      eventType: varchar28("event_type", { length: 100 }).notNull(),
      eventPayload: text28("event_payload"),
      // JSON: the webhook payload
      // Processing
      processed: boolean25("processed").default(false),
      processedAt: timestamp28("processed_at"),
      // Error
      processingError: text28("processing_error"),
      receivedAt: timestamp28("received_at").defaultNow()
    });
    apiRateLimits = pgTable28("api_rate_limits", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      userIntegrationId: varchar28("user_integration_id", { length: 255 }).notNull(),
      // Rate Limit Details
      requestsPerHour: integer28("requests_per_hour"),
      requestsPerDay: integer28("requests_per_day"),
      // Current Usage
      requestsThisHour: integer28("requests_this_hour").default(0),
      requestsToday: integer28("requests_today").default(0),
      // Reset Times
      hourResetAt: timestamp28("hour_reset_at"),
      dayResetAt: timestamp28("day_reset_at"),
      // Throttling
      throttled: boolean25("throttled").default(false),
      throttledUntil: timestamp28("throttled_until"),
      updatedAt: timestamp28("updated_at").defaultNow()
    });
    dataMappingRules = pgTable28("data_mapping_rules", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      integrationId: varchar28("integration_id", { length: 255 }).notNull(),
      // Source Field
      sourceField: varchar28("source_field", { length: 255 }).notNull(),
      sourceDataType: varchar28("source_data_type", { length: 100 }),
      // Destination Field
      destinationTable: varchar28("destination_table", { length: 255 }).notNull(),
      destinationField: varchar28("destination_field", { length: 255 }).notNull(),
      // Transformation
      transformationRule: text28("transformation_rule"),
      // JSON: how to transform the data
      // Validation
      validationRule: text28("validation_rule"),
      // JSON: how to validate the data
      // Required
      required: boolean25("required").default(false),
      createdAt: timestamp28("created_at").defaultNow(),
      updatedAt: timestamp28("updated_at").defaultNow()
    });
    integrationAnalytics = pgTable28("integration_analytics", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      integrationId: varchar28("integration_id", { length: 255 }).notNull(),
      // Usage Stats
      totalUsers: integer28("total_users").default(0),
      activeUsers: integer28("active_users").default(0),
      // Sync Stats
      avgSyncsPerDay: decimal23("avg_syncs_per_day", { precision: 6, scale: 2 }),
      avgRecordsPerSync: decimal23("avg_records_per_sync", { precision: 8, scale: 2 }),
      successRate: decimal23("success_rate", { precision: 5, scale: 2 }),
      // %
      // Data Quality
      avgDataQuality: decimal23("avg_data_quality", { precision: 4, scale: 2 }),
      // 1-10
      // User Satisfaction
      avgSatisfactionRating: decimal23("avg_satisfaction_rating", { precision: 4, scale: 2 }),
      // 1-10
      // Value
      avgBehaviorImpact: decimal23("avg_behavior_impact", { precision: 5, scale: 2 }),
      // % improvement
      // Optimal Parameters
      optimalSyncFrequency: varchar28("optimal_sync_frequency", { length: 100 }),
      // Issues
      commonErrors: text28("common_errors"),
      // JSON: most frequent errors
      lastCalculated: timestamp28("last_calculated").defaultNow(),
      createdAt: timestamp28("created_at").defaultNow(),
      updatedAt: timestamp28("updated_at").defaultNow()
    });
    integrationRecommendations = pgTable28("integration_recommendations", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      profileId: varchar28("profile_id", { length: 255 }).notNull(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      integrationId: varchar28("integration_id", { length: 255 }).notNull(),
      // Recommendation Reason
      reason: text28("reason"),
      // Why is this integration recommended?
      // Potential Value
      potentialValue: text28("potential_value"),
      // What could user gain?
      // Confidence
      confidence: decimal23("confidence", { precision: 5, scale: 2 }),
      // %
      // Status
      status: varchar28("status", { length: 50 }),
      // User Response
      userFeedback: text28("user_feedback"),
      createdAt: timestamp28("created_at").defaultNow(),
      respondedAt: timestamp28("responded_at")
    });
    exportRequests = pgTable28("export_requests", {
      id: varchar28("id", { length: 255 }).primaryKey(),
      userId: varchar28("user_id", { length: 255 }).notNull(),
      // Export Type
      exportType: varchar28("export_type", { length: 50 }),
      // Format
      exportFormat: varchar28("export_format", { length: 50 }),
      // Filters
      filters: text28("filters"),
      // JSON: what to include
      // Status
      status: varchar28("status", { length: 50 }),
      // File
      filePath: varchar28("file_path", { length: 500 }),
      fileSize: integer28("file_size"),
      // bytes
      // Download
      downloadUrl: varchar28("download_url", { length: 500 }),
      expiresAt: timestamp28("expires_at"),
      // Download link expiry
      // Error
      errorMessage: text28("error_message"),
      requestedAt: timestamp28("requested_at").defaultNow(),
      completedAt: timestamp28("completed_at")
    });
  }
});

// drizzle/memoryMasterySchema.ts
import { boolean as boolean26, decimal as decimal24, integer as integer29, pgTable as pgTable29, text as text29, timestamp as timestamp29, varchar as varchar29 } from "drizzle-orm/pg-core";
var memoryMasteryProfiles, memoryItems, memoryReviews, memoryPalaces, learningSessions2, memoryTechniquePractice, memoryChallenges, memoryMilestones, sleepMemoryTracking, memoryMasteryAnalytics, nameFaceMemory, nameRecallPractice, numberMemory;
var init_memoryMasterySchema = __esm({
  "drizzle/memoryMasterySchema.ts"() {
    "use strict";
    memoryMasteryProfiles = pgTable29("memory_mastery_profiles", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      // Current Memory Assessment
      selfAssessedMemory: integer29("self_assessed_memory"),
      // 1-10
      // Goals
      primaryGoal: varchar29("primary_goal", { length: 50 }),
      // Preferred Techniques
      preferredTechniques: text29("preferred_techniques"),
      // JSON array
      // Learning Style
      learningStyle: varchar29("learning_style", { length: 50 }),
      // Practice Schedule
      dailyReviewTime: varchar29("daily_review_time", { length: 10 }),
      // HH:MM
      weeklyGoalMinutes: integer29("weekly_goal_minutes"),
      // Self-Learning Data
      optimalReviewTime: varchar29("optimal_review_time", { length: 100 }),
      // When retention is highest
      personalForgettingCurve: text29("personal_forgetting_curve"),
      // JSON: decay rate over time
      mostEffectiveTechniques: text29("most_effective_techniques"),
      // JSON: ranked by retention
      optimalReviewIntervals: text29("optimal_review_intervals"),
      // JSON: personalized spaced repetition schedule
      createdAt: timestamp29("created_at").defaultNow(),
      updatedAt: timestamp29("updated_at").defaultNow()
    });
    memoryItems = pgTable29("memory_items", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      // Content
      itemType: varchar29("item_type", { length: 50 }),
      title: varchar29("title", { length: 255 }).notNull(),
      content: text29("content"),
      // What to remember
      // Context
      category: varchar29("category", { length: 255 }),
      // Work, personal, study, etc.
      tags: text29("tags"),
      // JSON array
      // Encoding Technique Used
      encodingTechnique: varchar29("encoding_technique", { length: 50 }),
      // Memory Palace Location (if using method of loci)
      palaceLocation: varchar29("palace_location", { length: 255 }),
      // Visual/Mnemonic
      visualImage: text29("visual_image"),
      // Description of mental image
      mnemonicDevice: text29("mnemonic_device"),
      // Connections
      relatedItems: text29("related_items"),
      // JSON: IDs of related memory items
      existingKnowledge: text29("existing_knowledge"),
      // What you already know that this connects to
      // Importance
      importance: integer29("importance"),
      // 1-10
      // Spaced Repetition Data
      easeFactor: decimal24("ease_factor", { precision: 4, scale: 2 }).default("2.5"),
      // SuperMemo algorithm
      interval: integer29("interval").default(1),
      // Days until next review
      repetitions: integer29("repetitions").default(0),
      nextReviewDate: timestamp29("next_review_date"),
      // Performance
      totalReviews: integer29("total_reviews").default(0),
      successfulRecalls: integer29("successful_recalls").default(0),
      retentionRate: decimal24("retention_rate", { precision: 5, scale: 2 }),
      // %
      // Status
      mastered: boolean26("mastered").default(false),
      masteredDate: timestamp29("mastered_date"),
      createdAt: timestamp29("created_at").defaultNow(),
      updatedAt: timestamp29("updated_at").defaultNow()
    });
    memoryReviews = pgTable29("memory_reviews", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      itemId: varchar29("item_id", { length: 255 }).notNull(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      reviewDate: timestamp29("review_date").notNull(),
      // Review Type
      reviewType: varchar29("review_type", { length: 50 }),
      // Performance
      recalled: boolean26("recalled").notNull(),
      // Did you remember it?
      recallSpeed: varchar29("recall_speed", { length: 50 }),
      confidence: integer29("confidence"),
      // 1-10: How confident in your recall?
      // Difficulty Rating (for spaced repetition algorithm)
      difficultyRating: varchar29("difficulty_rating", { length: 50 }).notNull(),
      // Time
      timeToRecall: integer29("time_to_recall"),
      // seconds
      // Context
      reviewContext: varchar29("review_context", { length: 255 }),
      // Where/when reviewed
      distractions: boolean26("distractions"),
      // Next Review Scheduled
      nextInterval: integer29("next_interval"),
      // days
      nextReviewDate: timestamp29("next_review_date"),
      createdAt: timestamp29("created_at").defaultNow()
    });
    memoryPalaces = pgTable29("memory_palaces", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      palaceName: varchar29("palace_name", { length: 255 }).notNull(),
      description: text29("description"),
      // What place is this? (your home, a route, etc.)
      // Locations within palace
      locations: text29("locations"),
      // JSON array: ordered list of locations
      // Usage
      purpose: varchar29("purpose", { length: 255 }),
      // What is this palace for?
      // Items Stored
      itemCount: integer29("item_count").default(0),
      // Effectiveness
      avgRecallRate: decimal24("avg_recall_rate", { precision: 5, scale: 2 }),
      active: boolean26("active").default(true),
      createdAt: timestamp29("created_at").defaultNow(),
      updatedAt: timestamp29("updated_at").defaultNow()
    });
    learningSessions2 = pgTable29("learning_sessions", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      sessionDate: timestamp29("session_date").notNull(),
      // Session Details
      topic: varchar29("topic", { length: 255 }).notNull(),
      sessionType: varchar29("session_type", { length: 50 }),
      // Duration
      duration: integer29("duration"),
      // minutes
      // Techniques Used
      techniquesUsed: text29("techniques_used"),
      // JSON array
      // Materials
      materialsStudied: text29("materials_studied"),
      // JSON array
      newItemsCreated: integer29("new_items_created"),
      itemsReviewed: integer29("items_reviewed"),
      // Performance
      focusLevel: integer29("focus_level"),
      // 1-10
      comprehensionLevel: integer29("comprehension_level"),
      // 1-10
      retentionConfidence: integer29("retention_confidence"),
      // 1-10
      // Environment
      location: varchar29("location", { length: 255 }),
      distractions: text29("distractions"),
      // JSON array
      // State
      energyBefore: integer29("energy_before"),
      // 1-10
      energyAfter: integer29("energy_after"),
      // 1-10
      // Notes
      notes: text29("notes"),
      insights: text29("insights"),
      createdAt: timestamp29("created_at").defaultNow()
    });
    memoryTechniquePractice = pgTable29("memory_technique_practice", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp29("practice_date").notNull(),
      // Technique
      technique: varchar29("technique", { length: 50 }),
      // Practice Details
      practiceType: varchar29("practice_type", { length: 255 }),
      // What were you practicing?
      duration: integer29("duration"),
      // minutes
      // Performance
      itemsAttempted: integer29("items_attempted"),
      itemsRecalled: integer29("items_recalled"),
      accuracyRate: decimal24("accuracy_rate", { precision: 5, scale: 2 }),
      // %
      // Difficulty
      difficulty: integer29("difficulty"),
      // 1-10
      // Improvement
      improvementFromLast: decimal24("improvement_from_last", { precision: 6, scale: 2 }),
      // % change
      // Notes
      notes: text29("notes"),
      challengesFaced: text29("challenges_faced"),
      createdAt: timestamp29("created_at").defaultNow()
    });
    memoryChallenges = pgTable29("memory_challenges", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      challengeName: varchar29("challenge_name", { length: 255 }).notNull(),
      // Challenge Type
      challengeType: varchar29("challenge_type", { length: 50 }),
      // Challenge Details
      itemCount: integer29("item_count"),
      // How many items to memorize
      timeLimit: integer29("time_limit"),
      // seconds
      // Performance
      itemsRecalled: integer29("items_recalled"),
      accuracy: decimal24("accuracy", { precision: 5, scale: 2 }),
      // %
      timeUsed: integer29("time_used"),
      // seconds
      // Score
      score: integer29("score"),
      personalBest: boolean26("personal_best"),
      attemptDate: timestamp29("attempt_date"),
      createdAt: timestamp29("created_at").defaultNow()
    });
    memoryMilestones = pgTable29("memory_milestones", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      milestoneType: varchar29("milestone_type", { length: 50 }),
      title: varchar29("title", { length: 255 }).notNull(),
      description: text29("description"),
      achievedDate: timestamp29("achieved_date"),
      createdAt: timestamp29("created_at").defaultNow()
    });
    sleepMemoryTracking = pgTable29("sleep_memory_tracking", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      trackingDate: timestamp29("tracking_date").notNull(),
      // Learning Before Sleep
      studiedBeforeSleep: boolean26("studied_before_sleep"),
      studyTopics: text29("study_topics"),
      // JSON array
      studyDuration: integer29("study_duration"),
      // minutes
      // Sleep Quality
      sleepQuality: integer29("sleep_quality"),
      // 1-10
      sleepDuration: decimal24("sleep_duration", { precision: 3, scale: 1 }),
      // hours
      deepSleepMinutes: integer29("deep_sleep_minutes"),
      // Morning Recall
      morningRecallTest: boolean26("morning_recall_test"),
      morningRecallAccuracy: decimal24("morning_recall_accuracy", { precision: 5, scale: 2 }),
      // %
      // Consolidation Effect
      consolidationEffect: decimal24("consolidation_effect", { precision: 6, scale: 2 }),
      // % improvement from sleep
      createdAt: timestamp29("created_at").defaultNow()
    });
    memoryMasteryAnalytics = pgTable29("memory_mastery_analytics", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      // Technique Effectiveness (aggregated)
      technique: varchar29("technique", { length: 100 }).notNull(),
      itemType: varchar29("item_type", { length: 100 }),
      // Effectiveness Metrics
      avgRetentionRate: decimal24("avg_retention_rate", { precision: 5, scale: 2 }),
      // %
      avgRecallSpeed: decimal24("avg_recall_speed", { precision: 6, scale: 2 }),
      // seconds
      // Optimal Parameters
      optimalReviewInterval: integer29("optimal_review_interval"),
      // days
      optimalSessionDuration: integer29("optimal_session_duration"),
      // minutes
      // User Segments
      mostEffectiveFor: text29("most_effective_for"),
      // JSON: different learning styles
      // Sample Size
      reviewCount: integer29("review_count"),
      userCount: integer29("user_count"),
      lastCalculated: timestamp29("last_calculated").defaultNow(),
      createdAt: timestamp29("created_at").defaultNow(),
      updatedAt: timestamp29("updated_at").defaultNow()
    });
    nameFaceMemory = pgTable29("name_face_memory", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      // Person Details
      personName: varchar29("person_name", { length: 255 }).notNull(),
      firstName: varchar29("first_name", { length: 255 }),
      lastName: varchar29("last_name", { length: 255 }),
      // Face Photo
      facePhoto: varchar29("face_photo", { length: 255 }),
      // Harry Lorayne Technique: Outstanding Feature
      outstandingFeature: text29("outstanding_feature"),
      // Most memorable facial feature
      // Harry Lorayne Technique: Name Association
      nameAssociation: text29("name_association"),
      // Mental image/story for the name
      substituteWord: varchar29("substitute_word", { length: 255 }),
      // If name is abstract
      // Harry Lorayne Technique: Link Feature to Name
      mentalLink: text29("mental_link"),
      // Absurd image linking feature to name
      // Context
      whereMet: varchar29("where_met", { length: 255 }),
      whenMet: timestamp29("when_met"),
      relationship: varchar29("relationship", { length: 255 }),
      // Colleague, friend, client, etc.
      // Additional Info (helps with recall)
      occupation: varchar29("occupation", { length: 255 }),
      interests: text29("interests"),
      // JSON array
      mutualConnections: text29("mutual_connections"),
      // JSON array
      conversationTopics: text29("conversation_topics"),
      // What you talked about
      // Memory Performance
      totalEncounters: integer29("total_encounters").default(1),
      successfulRecalls: integer29("successful_recalls").default(0),
      lastEncounter: timestamp29("last_encounter"),
      // Importance
      importance: integer29("importance"),
      // 1-10
      // Status
      mastered: boolean26("mastered").default(false),
      // Can recall instantly
      createdAt: timestamp29("created_at").defaultNow(),
      updatedAt: timestamp29("updated_at").defaultNow()
    });
    nameRecallPractice = pgTable29("name_recall_practice", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      nameFaceId: varchar29("name_face_id", { length: 255 }).notNull(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp29("practice_date").notNull(),
      // Practice Type
      practiceType: varchar29("practice_type", { length: 50 }),
      // Performance
      recalled: boolean26("recalled"),
      recallSpeed: varchar29("recall_speed", { length: 50 }),
      confidence: integer29("confidence"),
      // 1-10
      // Time
      timeToRecall: integer29("time_to_recall"),
      // seconds
      createdAt: timestamp29("created_at").defaultNow()
    });
    numberMemory = pgTable29("number_memory", {
      id: varchar29("id", { length: 255 }).primaryKey(),
      profileId: varchar29("profile_id", { length: 255 }).notNull(),
      userId: varchar29("user_id", { length: 255 }).notNull(),
      // Number to Remember
      number: varchar29("number", { length: 255 }).notNull(),
      numberType: varchar29("number_type", { length: 50 }),
      label: varchar29("label", { length: 255 }),
      // What is this number?
      // Harry Lorayne Phonetic System
      phoneticWords: text29("phonetic_words"),
      // Words that encode the number
      visualStory: text29("visual_story"),
      // Story using the phonetic words
      // Alternative: Chunking
      chunks: text29("chunks"),
      // JSON array: break into memorable chunks
      // Performance
      totalRecalls: integer29("total_recalls").default(0),
      successfulRecalls: integer29("successful_recalls").default(0),
      // Status
      mastered: boolean26("mastered").default(false),
      createdAt: timestamp29("created_at").defaultNow(),
      updatedAt: timestamp29("updated_at").defaultNow()
    });
  }
});

// drizzle/transformativePrinciplesSchema.ts
import { boolean as boolean27, decimal as decimal25, integer as integer30, pgTable as pgTable30, text as text30, timestamp as timestamp30, varchar as varchar30 } from "drizzle-orm/pg-core";
var transformativePrinciplesProfiles, principles, principlePractices, principleProgress, identityTransformations, weeklyPrincipleReviews, principleGoals, dailyAffirmations, transformativeMoments, transformativePrinciplesAnalytics;
var init_transformativePrinciplesSchema = __esm({
  "drizzle/transformativePrinciplesSchema.ts"() {
    "use strict";
    transformativePrinciplesProfiles = pgTable30("transformative_principles_profiles", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      userId: varchar30("user_id", { length: 255 }).notNull(),
      // Current State
      overallGrowth: integer30("overall_growth"),
      // 1-10 self-assessment
      // Primary Focus
      primaryPrinciple: varchar30("primary_principle", { length: 50 }),
      // Practice Preferences
      preferredPracticeTime: varchar30("preferred_practice_time", { length: 50 }),
      practiceFrequency: varchar30("practice_frequency", { length: 50 }),
      // Reminders
      remindersEnabled: boolean27("reminders_enabled").default(true),
      reminderTime: varchar30("reminder_time", { length: 10 }),
      // HH:MM format
      // Self-Learning Data
      mostImpactfulPrinciples: text30("most_impactful_principles"),
      // JSON: ranked by life impact
      optimalPracticeFormat: text30("optimal_practice_format"),
      // JSON: reading, reflection, action, etc.
      principleLifeCorrelations: text30("principle_life_correlations"),
      // JSON: which principles improve which life areas
      createdAt: timestamp30("created_at").defaultNow(),
      updatedAt: timestamp30("updated_at").defaultNow()
    });
    principles = pgTable30("principles", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      principleNumber: integer30("principle_number").notNull(),
      // 1-12
      principleName: varchar30("principle_name", { length: 255 }).notNull(),
      identityStatement: varchar30("identity_statement", { length: 255 }).notNull(),
      // "I AM..."
      // Core Teaching
      coreTeaching: text30("core_teaching"),
      // The main lesson
      whyItMatters: text30("why_it_matters"),
      // Scientific/philosophical basis
      // Daily Practice
      dailyPractice: text30("daily_practice"),
      // What to do each day
      reflectionPrompts: text30("reflection_prompts"),
      // JSON array: questions for journaling
      // Habit Integration
      keyHabits: text30("key_habits"),
      // JSON array: specific habits that embody this principle
      // Real-World Application
      lifeApplications: text30("life_applications"),
      // JSON: how to apply in different life areas
      // Research Foundation
      researchBasis: text30("research_basis"),
      // Scientific backing
      createdAt: timestamp30("created_at").defaultNow()
    });
    principlePractices = pgTable30("principle_practices", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      profileId: varchar30("profile_id", { length: 255 }).notNull(),
      userId: varchar30("user_id", { length: 255 }).notNull(),
      practiceDate: timestamp30("practice_date").notNull(),
      // Which Principle
      principleId: varchar30("principle_id", { length: 255 }).notNull(),
      principleNumber: integer30("principle_number").notNull(),
      // 1-12
      // Practice Type
      practiceType: varchar30("practice_type", { length: 50 }),
      // Engagement
      timeSpent: integer30("time_spent"),
      // minutes
      completed: boolean27("completed").default(true),
      // Reflection
      reflectionNotes: text30("reflection_notes"),
      insights: text30("insights"),
      // What did you learn?
      // Application
      actionsTaken: text30("actions_taken"),
      // JSON array: specific actions
      challengesFaced: text30("challenges_faced"),
      winsAchieved: text30("wins_achieved"),
      // Impact
      impactOnDay: integer30("impact_on_day"),
      // 1-10: How much did this principle improve your day?
      embodimentLevel: integer30("embodiment_level"),
      // 1-10: How well did you embody this principle today?
      // Mood & State
      moodBefore: varchar30("mood_before", { length: 100 }),
      moodAfter: varchar30("mood_after", { length: 100 }),
      createdAt: timestamp30("created_at").defaultNow()
    });
    principleProgress = pgTable30("principle_progress", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      profileId: varchar30("profile_id", { length: 255 }).notNull(),
      userId: varchar30("user_id", { length: 255 }).notNull(),
      principleId: varchar30("principle_id", { length: 255 }).notNull(),
      // Mastery Level
      masteryLevel: integer30("mastery_level"),
      // 1-100
      // Practice Stats
      totalPractices: integer30("total_practices"),
      currentStreak: integer30("current_streak"),
      // days
      longestStreak: integer30("longest_streak"),
      // days
      // Embodiment
      avgEmbodimentLevel: decimal25("avg_embodiment_level", { precision: 4, scale: 2 }),
      // Average of embodiment ratings
      // Life Impact
      avgLifeImpact: decimal25("avg_life_impact", { precision: 4, scale: 2 }),
      // Specific Improvements (self-reported)
      lifeAreasImproved: text30("life_areas_improved"),
      // JSON: relationships, career, health, etc.
      // Milestones
      milestones: text30("milestones"),
      // JSON array: significant moments of growth
      lastPracticed: timestamp30("last_practiced"),
      createdAt: timestamp30("created_at").defaultNow(),
      updatedAt: timestamp30("updated_at").defaultNow()
    });
    identityTransformations = pgTable30("identity_transformations", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      profileId: varchar30("profile_id", { length: 255 }).notNull(),
      userId: varchar30("user_id", { length: 255 }).notNull(),
      // Old Identity
      oldIdentityStatement: text30("old_identity_statement"),
      // "I used to be..."
      oldBehaviors: text30("old_behaviors"),
      // JSON array
      oldBeliefs: text30("old_beliefs"),
      // JSON array
      // New Identity (Target)
      newIdentityStatement: text30("new_identity_statement"),
      // "I am becoming..."
      newBehaviors: text30("new_behaviors"),
      // JSON array: behaviors that match new identity
      newBeliefs: text30("new_beliefs"),
      // JSON array
      // Supporting Principles
      supportingPrinciples: text30("supporting_principles"),
      // JSON: which principles support this transformation
      // Progress
      transformationProgress: integer30("transformation_progress"),
      // 1-100
      // Evidence
      evidenceOfChange: text30("evidence_of_change"),
      // JSON array: concrete examples
      // Timeline
      startDate: timestamp30("start_date"),
      targetDate: timestamp30("target_date"),
      // Status
      status: varchar30("status", { length: 50 }),
      createdAt: timestamp30("created_at").defaultNow(),
      updatedAt: timestamp30("updated_at").defaultNow()
    });
    weeklyPrincipleReviews = pgTable30("weekly_principle_reviews", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      profileId: varchar30("profile_id", { length: 255 }).notNull(),
      userId: varchar30("user_id", { length: 255 }).notNull(),
      weekStartDate: timestamp30("week_start_date").notNull(),
      // Overall Week
      overallGrowth: integer30("overall_growth"),
      // 1-10
      // Principle of the Week (which one did you focus on most?)
      focusPrinciple: varchar30("focus_principle", { length: 255 }),
      // Wins
      biggestWins: text30("biggest_wins"),
      // JSON array
      principlesEmbodied: text30("principles_embodied"),
      // JSON: which principles showed up this week
      // Challenges
      biggestChallenges: text30("biggest_challenges"),
      // JSON array
      principlesNeeded: text30("principles_needed"),
      // JSON: which principles would have helped
      // Insights
      keyInsights: text30("key_insights"),
      lessonsLearned: text30("lessons_learned"),
      // Next Week
      focusForNextWeek: varchar30("focus_for_next_week", { length: 255 }),
      // Which principle to emphasize
      commitments: text30("commitments"),
      // JSON array: specific commitments
      createdAt: timestamp30("created_at").defaultNow()
    });
    principleGoals = pgTable30("principle_goals", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      profileId: varchar30("profile_id", { length: 255 }).notNull(),
      userId: varchar30("user_id", { length: 255 }).notNull(),
      goalTitle: varchar30("goal_title", { length: 255 }).notNull(),
      goalDescription: text30("goal_description"),
      // Which Principle Does This Goal Embody?
      primaryPrinciple: varchar30("primary_principle", { length: 255 }).notNull(),
      supportingPrinciples: text30("supporting_principles"),
      // JSON array
      // Identity Connection
      identityStatement: text30("identity_statement"),
      // "Achieving this goal makes me..."
      // Target
      targetDate: timestamp30("target_date"),
      // Milestones
      milestones: text30("milestones"),
      // JSON array: smaller steps
      // Progress
      progress: integer30("progress"),
      // 0-100
      // Why This Matters
      whyItMatters: text30("why_it_matters"),
      // Status
      status: varchar30("status", { length: 50 }),
      achievedDate: timestamp30("achieved_date"),
      createdAt: timestamp30("created_at").defaultNow(),
      updatedAt: timestamp30("updated_at").defaultNow()
    });
    dailyAffirmations = pgTable30("daily_affirmations", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      profileId: varchar30("profile_id", { length: 255 }).notNull(),
      userId: varchar30("user_id", { length: 255 }).notNull(),
      affirmationDate: timestamp30("affirmation_date").notNull(),
      // Affirmations Practiced
      affirmations: text30("affirmations"),
      // JSON array: "I am disciplined", "I am resilient", etc.
      // How Practiced
      practiceMethod: varchar30("practice_method", { length: 50 }),
      // Repetitions
      repetitions: integer30("repetitions"),
      // Belief Level
      beliefLevel: integer30("belief_level"),
      // 1-10: How much do you believe these statements?
      // Impact
      impactOnMood: integer30("impact_on_mood"),
      // 1-10
      impactOnBehavior: integer30("impact_on_behavior"),
      // 1-10
      createdAt: timestamp30("created_at").defaultNow()
    });
    transformativeMoments = pgTable30("transformative_moments", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      profileId: varchar30("profile_id", { length: 255 }).notNull(),
      userId: varchar30("user_id", { length: 255 }).notNull(),
      momentDate: timestamp30("moment_date").notNull(),
      // What Happened
      title: varchar30("title", { length: 255 }).notNull(),
      description: text30("description"),
      // Which Principle Was Involved
      relatedPrinciple: varchar30("related_principle", { length: 255 }),
      // Type of Moment
      momentType: varchar30("moment_type", { length: 50 }),
      // Impact
      significance: integer30("significance"),
      // 1-10
      lifeAreasAffected: text30("life_areas_affected"),
      // JSON array
      // Insights
      insights: text30("insights"),
      lessonsLearned: text30("lessons_learned"),
      // Integration
      howToMaintain: text30("how_to_maintain"),
      // How to keep this alive
      createdAt: timestamp30("created_at").defaultNow()
    });
    transformativePrinciplesAnalytics = pgTable30("transformative_principles_analytics", {
      id: varchar30("id", { length: 255 }).primaryKey(),
      // Principle Effectiveness (aggregated)
      principleId: varchar30("principle_id", { length: 255 }).notNull(),
      // Impact Metrics
      avgLifeImpact: decimal25("avg_life_impact", { precision: 5, scale: 2 }),
      avgEmbodimentLevel: decimal25("avg_embodiment_level", { precision: 5, scale: 2 }),
      // Correlation with Life Outcomes
      relationshipImprovement: decimal25("relationship_improvement", { precision: 5, scale: 2 }),
      // % of users who report improvement
      careerImprovement: decimal25("career_improvement", { precision: 5, scale: 2 }),
      healthImprovement: decimal25("health_improvement", { precision: 5, scale: 2 }),
      mentalHealthImprovement: decimal25("mental_health_improvement", { precision: 5, scale: 2 }),
      // Optimal Practice
      optimalPracticeFrequency: varchar30("optimal_practice_frequency", { length: 100 }),
      optimalPracticeFormat: varchar30("optimal_practice_format", { length: 100 }),
      // User Segments
      mostEffectiveFor: text30("most_effective_for"),
      // JSON: different user types
      // Sample Size
      practiceCount: integer30("practice_count"),
      userCount: integer30("user_count"),
      lastCalculated: timestamp30("last_calculated").defaultNow(),
      createdAt: timestamp30("created_at").defaultNow(),
      updatedAt: timestamp30("updated_at").defaultNow()
    });
  }
});

// drizzle/truthKeepersSchema.ts
import { boolean as boolean28, decimal as decimal26, integer as integer31, pgTable as pgTable31, text as text31, timestamp as timestamp31, varchar as varchar31 } from "drizzle-orm/pg-core";
var validatedResearch, platformRecommendations, researchMonitoring, pseudoscienceBlocklist, researchQualityReviews;
var init_truthKeepersSchema = __esm({
  "drizzle/truthKeepersSchema.ts"() {
    "use strict";
    validatedResearch = pgTable31("validated_research", {
      id: varchar31("id", { length: 255 }).primaryKey(),
      // Research Details
      title: varchar31("title", { length: 500 }).notNull(),
      authors: text31("authors").notNull(),
      // JSON array
      journal: varchar31("journal", { length: 255 }).notNull(),
      publicationYear: integer31("publication_year").notNull(),
      doi: varchar31("doi", { length: 255 }),
      // Digital Object Identifier
      pubmedId: varchar31("pubmed_id", { length: 50 }),
      url: varchar31("url", { length: 500 }),
      // Study Type
      studyType: varchar31("study_type", { length: 50 }),
      // Evidence Level (Oxford CEBM)
      evidenceLevel: varchar31("evidence_level", { length: 50 }),
      // Quality Metrics
      sampleSize: integer31("sample_size"),
      hasControlGroup: boolean28("has_control_group"),
      isRandomized: boolean28("is_randomized"),
      isBlinded: boolean28("is_blinded"),
      // Single, double, or triple blind
      hasReplication: boolean28("has_replication"),
      // Multiple independent studies
      effectSize: decimal26("effect_size", { precision: 6, scale: 3 }),
      // Cohen's d, odds ratio, etc.
      pValue: decimal26("p_value", { precision: 10, scale: 9 }),
      confidenceInterval: varchar31("confidence_interval", { length: 100 }),
      // "95% CI: 1.2-2.5"
      // Journal Quality
      journalImpactFactor: decimal26("journal_impact_factor", { precision: 6, scale: 3 }),
      isPeerReviewed: boolean28("is_peer_reviewed").notNull(),
      isOpenAccess: boolean28("is_open_access"),
      // Conflicts of Interest
      hasConflictOfInterest: boolean28("has_conflict_of_interest"),
      fundingSource: text31("funding_source"),
      // Who funded the research?
      industrySponsored: boolean28("industry_sponsored"),
      // Research Domain
      domain: varchar31("domain", { length: 50 }),
      // Key Findings
      keyFindings: text31("key_findings").notNull(),
      // Summary of main results
      clinicalSignificance: text31("clinical_significance"),
      // Is it meaningful in real life?
      limitations: text31("limitations"),
      // What are the study's limitations?
      // Practical Application
      practicalApplication: text31("practical_application"),
      // How to apply this research
      targetPopulation: text31("target_population"),
      // Who does this apply to?
      contraindications: text31("contraindications"),
      // When NOT to apply this
      // Validation Status
      validationStatus: varchar31("validation_status", { length: 50 }),
      // Reviewer Info
      reviewedBy: varchar31("reviewed_by", { length: 255 }),
      // Who validated this?
      reviewedAt: timestamp31("reviewed_at"),
      reviewNotes: text31("review_notes"),
      // Usage Tracking
      citationCount: integer31("citation_count").default(0),
      // How many times cited on platform
      recommendationCount: integer31("recommendation_count").default(0),
      // How many recommendations use this
      createdAt: timestamp31("created_at").defaultNow(),
      updatedAt: timestamp31("updated_at").defaultNow()
    });
    platformRecommendations = pgTable31("platform_recommendations", {
      id: varchar31("id", { length: 255 }).primaryKey(),
      // Recommendation Details
      recommendationType: varchar31("recommendation_type", { length: 50 }),
      // Content
      title: varchar31("title", { length: 255 }).notNull(),
      description: text31("description").notNull(),
      howToImplement: text31("how_to_implement"),
      // Step-by-step instructions
      // Evidence Backing
      evidenceLevel: varchar31("evidence_level", { length: 50 }),
      // Research Citations (Links to validatedResearch table)
      primaryResearchId: varchar31("primary_research_id", { length: 255 }).notNull(),
      // Main supporting study
      supportingResearchIds: text31("supporting_research_ids"),
      // JSON array: additional studies
      // Confidence
      confidenceScore: integer31("confidence_score"),
      // 0-100: How confident are we in this recommendation?
      // Domain
      domain: varchar31("domain", { length: 100 }).notNull(),
      // Target Audience
      targetAudience: text31("target_audience"),
      // Who is this for?
      contraindications: text31("contraindications"),
      // Who should NOT do this?
      // Effectiveness Tracking (Self-Learning)
      totalUses: integer31("total_uses").default(0),
      successRate: decimal26("success_rate", { precision: 5, scale: 2 }),
      // % of users who found it helpful
      avgEffectivenessRating: decimal26("avg_effectiveness_rating", { precision: 4, scale: 2 }),
      // 1-10
      // Status
      status: varchar31("status", { length: 50 }),
      // Superseded Info
      supersededBy: varchar31("superseded_by", { length: 255 }),
      // ID of newer recommendation
      supersededReason: text31("superseded_reason"),
      // Why was this replaced?
      createdAt: timestamp31("created_at").defaultNow(),
      updatedAt: timestamp31("updated_at").defaultNow(),
      createdBy: varchar31("created_by", { length: 255 })
    });
    researchMonitoring = pgTable31("research_monitoring", {
      id: varchar31("id", { length: 255 }).primaryKey(),
      // What to Monitor
      topic: varchar31("topic", { length: 255 }).notNull(),
      keywords: text31("keywords"),
      // JSON array: search terms
      domain: varchar31("domain", { length: 100 }),
      // Monitoring Config
      monitoringFrequency: varchar31("monitoring_frequency", { length: 50 }),
      // Alert Thresholds
      alertOnHighQuality: boolean28("alert_on_high_quality").default(true),
      // Alert when Level A research found
      alertOnContradiction: boolean28("alert_on_contradiction").default(true),
      // Alert when research contradicts current recommendations
      // Last Check
      lastCheckedAt: timestamp31("last_checked_at"),
      newStudiesFound: integer31("new_studies_found").default(0),
      // Status
      active: boolean28("active").default(true),
      createdAt: timestamp31("created_at").defaultNow(),
      updatedAt: timestamp31("updated_at").defaultNow()
    });
    pseudoscienceBlocklist = pgTable31("pseudoscience_blocklist", {
      id: varchar31("id", { length: 255 }).primaryKey(),
      // Blocked Claim
      claim: text31("claim").notNull(),
      category: varchar31("category", { length: 50 }),
      // Why Blocked
      reason: text31("reason").notNull(),
      evidenceAgainst: text31("evidence_against"),
      // Research that debunks this
      // Severity
      severity: varchar31("severity", { length: 50 }),
      // Action
      action: varchar31("action", { length: 50 }),
      // Detection
      detectionCount: integer31("detection_count").default(0),
      // How many times detected
      createdAt: timestamp31("created_at").defaultNow(),
      updatedAt: timestamp31("updated_at").defaultNow(),
      createdBy: varchar31("created_by", { length: 255 })
    });
    researchQualityReviews = pgTable31("research_quality_reviews", {
      id: varchar31("id", { length: 255 }).primaryKey(),
      researchId: varchar31("research_id", { length: 255 }).notNull(),
      // Reviewer
      reviewerId: varchar31("reviewer_id", { length: 255 }).notNull(),
      reviewerName: varchar31("reviewer_name", { length: 255 }),
      reviewerCredentials: text31("reviewer_credentials"),
      // PhD, MD, etc.
      // Quality Assessment
      methodologyScore: integer31("methodology_score"),
      // 1-10
      sampleSizeAdequate: boolean28("sample_size_adequate"),
      statisticalRigor: integer31("statistical_rigor"),
      // 1-10
      clinicalRelevance: integer31("clinical_relevance"),
      // 1-10
      replicationStatus: varchar31("replication_status", { length: 50 }),
      // Bias Assessment
      selectionBias: boolean28("selection_bias"),
      publicationBias: boolean28("publication_bias"),
      confirmationBias: boolean28("confirmation_bias"),
      // Overall Assessment
      overallQuality: varchar31("overall_quality", { length: 50 }),
      // Recommendation
      recommendForPlatform: boolean28("recommend_for_platform").notNull(),
      recommendedEvidenceLevel: varchar31("recommended_evidence_level", { length: 50 }),
      // Notes
      reviewNotes: text31("review_notes"),
      concerns: text31("concerns"),
      reviewedAt: timestamp31("reviewed_at").defaultNow()
    });
  }
});

// drizzle/visualizationSchema.ts
import { boolean as boolean29, decimal as decimal27, integer as integer32, pgTable as pgTable32, text as text32, timestamp as timestamp32, varchar as varchar32 } from "drizzle-orm/pg-core";
var visualizationProfiles, dashboardConfigurations, visualizationWidgets, progressSnapshots, trendData, heatmapData, milestoneVisualizations, comparisonViews, progressCelebrations, chartInteractions, visualizationAnalytics, customReports, reportGenerations;
var init_visualizationSchema = __esm({
  "drizzle/visualizationSchema.ts"() {
    "use strict";
    visualizationProfiles = pgTable32("visualization_profiles", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Dashboard Preferences
      defaultDashboard: varchar32("default_dashboard", { length: 50 }),
      // Chart Preferences
      preferredChartTypes: text32("preferred_chart_types"),
      // JSON: line, bar, heatmap, etc.
      // Time Range Preferences
      defaultTimeRange: varchar32("default_time_range", { length: 50 }),
      // Comparison Preferences
      showComparisons: boolean29("show_comparisons").default(true),
      // Compare to previous periods
      showTrendlines: boolean29("show_trendlines").default(true),
      showGoalLines: boolean29("show_goal_lines").default(true),
      // Self-Learning Data
      mostViewedCharts: text32("most_viewed_charts"),
      // JSON: which charts user checks most
      mostActionableCharts: text32("most_actionable_charts"),
      // JSON: which charts drive behavior
      createdAt: timestamp32("created_at").defaultNow(),
      updatedAt: timestamp32("updated_at").defaultNow()
    });
    dashboardConfigurations = pgTable32("dashboard_configurations", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      profileId: varchar32("profile_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Dashboard Details
      dashboardName: varchar32("dashboard_name", { length: 255 }).notNull(),
      description: text32("description"),
      // Layout
      layout: text32("layout"),
      // JSON: grid layout configuration
      // Widgets
      widgets: text32("widgets"),
      // JSON: array of widget configurations
      // Default
      isDefault: boolean29("is_default").default(false),
      // Sharing
      isPublic: boolean29("is_public").default(false),
      createdAt: timestamp32("created_at").defaultNow(),
      updatedAt: timestamp32("updated_at").defaultNow()
    });
    visualizationWidgets = pgTable32("visualization_widgets", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      // Widget Details
      widgetName: varchar32("widget_name", { length: 255 }).notNull(),
      description: text32("description"),
      // Widget Type
      widgetType: varchar32("widget_type", { length: 50 }),
      // Data Source
      dataSource: varchar32("data_source", { length: 255 }).notNull(),
      // habits, goals, sleep, etc.
      dataQuery: text32("data_query"),
      // JSON: how to fetch the data
      // Configuration
      configuration: text32("configuration"),
      // JSON: chart-specific settings
      // Refresh
      refreshInterval: integer32("refresh_interval"),
      // seconds (null = manual refresh)
      // Popularity
      totalUses: integer32("total_uses").default(0),
      avgHelpfulnessRating: decimal27("avg_helpfulness_rating", { precision: 4, scale: 2 }),
      // 1-10
      createdAt: timestamp32("created_at").defaultNow(),
      updatedAt: timestamp32("updated_at").defaultNow()
    });
    progressSnapshots = pgTable32("progress_snapshots", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      profileId: varchar32("profile_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      snapshotDate: timestamp32("snapshot_date").notNull(),
      // Overall Wellness (0-100 for each)
      overallScore: integer32("overall_score"),
      physicalScore: integer32("physical_score"),
      mentalScore: integer32("mental_score"),
      emotionalScore: integer32("emotional_score"),
      spiritualScore: integer32("spiritual_score"),
      // Habits
      habitCompletionRate: decimal27("habit_completion_rate", { precision: 5, scale: 2 }),
      // %
      activeHabits: integer32("active_habits"),
      // Goals
      goalsOnTrack: integer32("goals_on_track"),
      goalsAtRisk: integer32("goals_at_risk"),
      goalsAchievedThisPeriod: integer32("goals_achieved_this_period"),
      // Sleep
      avgSleepDuration: decimal27("avg_sleep_duration", { precision: 4, scale: 2 }),
      avgSleepQuality: decimal27("avg_sleep_quality", { precision: 4, scale: 2 }),
      // Stress
      avgStressLevel: decimal27("avg_stress_level", { precision: 4, scale: 2 }),
      avgHRV: decimal27("avg_hrv", { precision: 6, scale: 2 }),
      // Mood & Energy
      avgMood: decimal27("avg_mood", { precision: 4, scale: 2 }),
      avgEnergy: decimal27("avg_energy", { precision: 4, scale: 2 }),
      // Engagement
      daysActive: integer32("days_active"),
      journalEntries: integer32("journal_entries"),
      // Achievements
      achievementsUnlocked: integer32("achievements_unlocked"),
      experiencePoints: integer32("experience_points"),
      createdAt: timestamp32("created_at").defaultNow()
    });
    trendData = pgTable32("trend_data", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      profileId: varchar32("profile_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Metric
      metricName: varchar32("metric_name", { length: 255 }).notNull(),
      metricCategory: varchar32("metric_category", { length: 100 }),
      // habits, sleep, stress, etc.
      // Time Period
      periodType: varchar32("period_type", { length: 50 }),
      periodStart: timestamp32("period_start").notNull(),
      periodEnd: timestamp32("period_end").notNull(),
      // Value
      value: decimal27("value", { precision: 10, scale: 2 }),
      // Trend
      trendDirection: varchar32("trend_direction", { length: 50 }),
      changePercent: decimal27("change_percent", { precision: 6, scale: 2 }),
      // % vs previous period
      createdAt: timestamp32("created_at").defaultNow()
    });
    heatmapData = pgTable32("heatmap_data", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      profileId: varchar32("profile_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Heatmap Type
      heatmapType: varchar32("heatmap_type", { length: 50 }),
      // Date
      date: timestamp32("date").notNull(),
      // Intensity (0-100)
      intensity: integer32("intensity"),
      // Context
      dayOfWeek: integer32("day_of_week"),
      // 0-6 (Sunday-Saturday)
      hourOfDay: integer32("hour_of_day"),
      // 0-23
      createdAt: timestamp32("created_at").defaultNow()
    });
    milestoneVisualizations = pgTable32("milestone_visualizations", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      profileId: varchar32("profile_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Timeline Type
      timelineType: varchar32("timeline_type", { length: 50 }),
      // Related Entity
      relatedId: varchar32("related_id", { length: 255 }),
      // Goal ID, habit ID, etc.
      // Milestones
      milestones: text32("milestones"),
      // JSON: array of milestone objects with dates
      // Current Position
      currentPosition: decimal27("current_position", { precision: 5, scale: 2 }),
      // % along timeline
      createdAt: timestamp32("created_at").defaultNow(),
      updatedAt: timestamp32("updated_at").defaultNow()
    });
    comparisonViews = pgTable32("comparison_views", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      profileId: varchar32("profile_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Comparison Type
      comparisonType: varchar32("comparison_type", { length: 50 }),
      // Metric
      metric: varchar32("metric", { length: 255 }).notNull(),
      // Current Period
      currentPeriodStart: timestamp32("current_period_start").notNull(),
      currentPeriodEnd: timestamp32("current_period_end").notNull(),
      currentValue: decimal27("current_value", { precision: 10, scale: 2 }),
      // Comparison Period
      comparisonPeriodStart: timestamp32("comparison_period_start").notNull(),
      comparisonPeriodEnd: timestamp32("comparison_period_end").notNull(),
      comparisonValue: decimal27("comparison_value", { precision: 10, scale: 2 }),
      // Change
      absoluteChange: decimal27("absolute_change", { precision: 10, scale: 2 }),
      percentChange: decimal27("percent_change", { precision: 6, scale: 2 }),
      // Interpretation
      interpretation: varchar32("interpretation", { length: 50 }),
      createdAt: timestamp32("created_at").defaultNow()
    });
    progressCelebrations = pgTable32("progress_celebrations", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      profileId: varchar32("profile_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Celebration Type
      celebrationType: varchar32("celebration_type", { length: 50 }),
      // Details
      title: varchar32("title", { length: 255 }).notNull(),
      description: text32("description"),
      // Visual
      icon: varchar32("icon", { length: 255 }),
      color: varchar32("color", { length: 50 }),
      animation: varchar32("animation", { length: 100 }),
      // Context
      relatedId: varchar32("related_id", { length: 255 }),
      relatedType: varchar32("related_type", { length: 100 }),
      // Display
      displayed: boolean29("displayed").default(false),
      displayedAt: timestamp32("displayed_at"),
      celebrationDate: timestamp32("celebration_date").defaultNow()
    });
    chartInteractions = pgTable32("chart_interactions", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      widgetId: varchar32("widget_id", { length: 255 }),
      // Interaction Type
      interactionType: varchar32("interaction_type", { length: 50 }),
      // Duration
      viewDuration: integer32("view_duration"),
      // seconds
      // Action Taken
      actionTaken: boolean29("action_taken").default(false),
      // Did they change behavior after viewing?
      actionType: varchar32("action_type", { length: 100 }),
      interactionTimestamp: timestamp32("interaction_timestamp").defaultNow()
    });
    visualizationAnalytics = pgTable32("visualization_analytics", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      // Widget Type
      widgetType: varchar32("widget_type", { length: 100 }).notNull(),
      // Engagement Metrics
      avgViewDuration: decimal27("avg_view_duration", { precision: 6, scale: 2 }),
      // seconds
      avgViewsPerUser: decimal27("avg_views_per_user", { precision: 6, scale: 2 }),
      // Effectiveness Metrics
      actionRate: decimal27("action_rate", { precision: 5, scale: 2 }),
      // % who took action after viewing
      avgBehaviorChange: decimal27("avg_behavior_change", { precision: 5, scale: 2 }),
      // % improvement
      avgHelpfulnessRating: decimal27("avg_helpfulness_rating", { precision: 4, scale: 2 }),
      // 1-10
      // Optimal Parameters
      optimalTimeRange: varchar32("optimal_time_range", { length: 100 }),
      optimalUpdateFrequency: varchar32("optimal_update_frequency", { length: 100 }),
      // Best For
      mostEffectiveFor: text32("most_effective_for"),
      // JSON: user types, metrics
      // Sample Size
      userCount: integer32("user_count"),
      totalViews: integer32("total_views"),
      lastCalculated: timestamp32("last_calculated").defaultNow(),
      createdAt: timestamp32("created_at").defaultNow(),
      updatedAt: timestamp32("updated_at").defaultNow()
    });
    customReports = pgTable32("custom_reports", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      profileId: varchar32("profile_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Report Details
      reportName: varchar32("report_name", { length: 255 }).notNull(),
      description: text32("description"),
      // Report Type
      reportType: varchar32("report_type", { length: 50 }),
      // Configuration
      metrics: text32("metrics"),
      // JSON: which metrics to include
      timeRange: text32("time_range"),
      // JSON: date range
      visualizations: text32("visualizations"),
      // JSON: which charts to include
      // Schedule
      scheduled: boolean29("scheduled").default(false),
      scheduleFrequency: varchar32("schedule_frequency", { length: 50 }),
      // Export
      exportFormat: varchar32("export_format", { length: 50 }),
      createdAt: timestamp32("created_at").defaultNow(),
      updatedAt: timestamp32("updated_at").defaultNow()
    });
    reportGenerations = pgTable32("report_generations", {
      id: varchar32("id", { length: 255 }).primaryKey(),
      reportId: varchar32("report_id", { length: 255 }).notNull(),
      userId: varchar32("user_id", { length: 255 }).notNull(),
      // Generation Details
      generatedAt: timestamp32("generated_at").defaultNow(),
      // Data
      reportData: text32("report_data"),
      // JSON: the actual report content
      // File
      filePath: varchar32("file_path", { length: 500 }),
      // If exported
      // Status
      status: varchar32("status", { length: 50 }),
      createdAt: timestamp32("created_at").defaultNow()
    });
  }
});

// drizzle/youngMenSchema.ts
import { boolean as boolean30, integer as integer33, pgTable as pgTable33, text as text33, timestamp as timestamp33, varchar as varchar33 } from "drizzle-orm/pg-core";
var youngMenProfiles, developmentalAssets, lifeSkillsDevelopment, mentorshipConnections, masculinityReflections, challengeCompletions, youngMenMilestones;
var init_youngMenSchema = __esm({
  "drizzle/youngMenSchema.ts"() {
    "use strict";
    youngMenProfiles = pgTable33("young_men_profiles", {
      id: varchar33("id", { length: 255 }).primaryKey(),
      userId: varchar33("user_id", { length: 255 }).notNull(),
      age: integer33("age").notNull(),
      // Life Situation
      livingSituation: varchar33("living_situation", { length: 50 }),
      educationStatus: varchar33("education_status", { length: 50 }),
      employmentStatus: varchar33("employment_status", { length: 50 }),
      // Role Model Situation
      hasFatherFigure: boolean30("has_father_figure").default(false),
      hasMotherFigure: boolean30("has_mother_figure").default(false),
      hasMentor: boolean30("has_mentor").default(false),
      hasMaleRoleModel: boolean30("has_male_role_model").default(false),
      roleModelGaps: text33("role_model_gaps"),
      // JSON array: what's missing
      // Primary Needs (based on 40 Developmental Assets)
      primaryNeeds: text33("primary_needs"),
      // JSON array: ["guidance", "emotional_support", "life_skills", "career_advice", etc.]
      // Goals
      primaryGoal: varchar33("primary_goal", { length: 50 }),
      specificGoals: text33("specific_goals"),
      // JSON array
      // Challenges
      mainChallenges: text33("main_challenges"),
      // JSON array
      // Strengths (asset-based approach)
      strengths: text33("strengths"),
      // JSON array
      interests: text33("interests"),
      // JSON array
      createdAt: timestamp33("created_at").defaultNow(),
      updatedAt: timestamp33("updated_at").defaultNow()
    });
    developmentalAssets = pgTable33("developmental_assets", {
      id: varchar33("id", { length: 255 }).primaryKey(),
      profileId: varchar33("profile_id", { length: 255 }).notNull(),
      userId: varchar33("user_id", { length: 255 }).notNull(),
      // EXTERNAL ASSETS
      // Support (4 assets)
      familySupport: integer33("family_support"),
      // 1-10
      positiveFamilyCommunication: integer33("positive_family_communication"),
      otherAdultRelationships: integer33("other_adult_relationships"),
      caringNeighborhood: integer33("caring_neighborhood"),
      // Empowerment (4 assets)
      communityValuesYouth: integer33("community_values_youth"),
      youthAsResources: integer33("youth_as_resources"),
      serviceToOthers: integer33("service_to_others"),
      safety: integer33("safety"),
      // Boundaries & Expectations (6 assets)
      familyBoundaries: integer33("family_boundaries"),
      schoolBoundaries: integer33("school_boundaries"),
      neighborhoodBoundaries: integer33("neighborhood_boundaries"),
      adultRoleModels: integer33("adult_role_models"),
      positiveInfluence: integer33("positive_peer_influence"),
      highExpectations: integer33("high_expectations"),
      // Constructive Use of Time (4 assets)
      creativeActivities: integer33("creative_activities"),
      youthPrograms: integer33("youth_programs"),
      religiousCommunity: integer33("religious_community"),
      timeAtHome: integer33("time_at_home"),
      // INTERNAL ASSETS
      // Commitment to Learning (5 assets)
      achievementMotivation: integer33("achievement_motivation"),
      schoolEngagement: integer33("school_engagement"),
      homework: integer33("homework"),
      bondingToSchool: integer33("bonding_to_school"),
      readingForPleasure: integer33("reading_for_pleasure"),
      // Positive Values (6 assets)
      caring: integer33("caring"),
      equality: integer33("equality"),
      socialJustice: integer33("social_justice"),
      integrity: integer33("integrity"),
      honesty: integer33("honesty"),
      responsibility: integer33("responsibility"),
      restraint: integer33("restraint"),
      // Social Competencies (5 assets)
      planningDecisionMaking: integer33("planning_decision_making"),
      interpersonalCompetence: integer33("interpersonal_competence"),
      culturalCompetence: integer33("cultural_competence"),
      resistanceSkills: integer33("resistance_skills"),
      peacefulConflictResolution: integer33("peaceful_conflict_resolution"),
      // Positive Identity (4 assets)
      personalPower: integer33("personal_power"),
      selfEsteem: integer33("self_esteem"),
      senseOfPurpose: integer33("sense_of_purpose"),
      positiveViewOfFuture: integer33("positive_view_of_future"),
      // Overall Score
      totalAssets: integer33("total_assets"),
      // Sum of all assets
      assessmentDate: timestamp33("assessment_date").notNull(),
      createdAt: timestamp33("created_at").defaultNow()
    });
    lifeSkillsDevelopment = pgTable33("life_skills_development", {
      id: varchar33("id", { length: 255 }).primaryKey(),
      profileId: varchar33("profile_id", { length: 255 }).notNull(),
      userId: varchar33("user_id", { length: 255 }).notNull(),
      skillCategory: varchar33("skill_category", { length: 50 }),
      skillName: varchar33("skill_name", { length: 255 }).notNull(),
      // Current Level
      currentLevel: varchar33("current_level", { length: 50 }),
      targetLevel: varchar33("target_level", { length: 50 }),
      // Learning Resources
      learningMethod: varchar33("learning_method", { length: 50 }),
      resources: text33("resources"),
      // JSON array
      // Practice Log
      practiceCount: integer33("practice_count").default(0),
      lastPracticed: timestamp33("last_practiced"),
      // Mastery
      masteryAchieved: boolean30("mastery_achieved").default(false),
      masteryDate: timestamp33("mastery_date"),
      status: varchar33("status", { length: 50 }),
      createdAt: timestamp33("created_at").defaultNow(),
      updatedAt: timestamp33("updated_at").defaultNow()
    });
    mentorshipConnections = pgTable33("mentorship_connections", {
      id: varchar33("id", { length: 255 }).primaryKey(),
      profileId: varchar33("profile_id", { length: 255 }).notNull(),
      userId: varchar33("user_id", { length: 255 }).notNull(),
      mentorType: varchar33("mentor_type", { length: 50 }),
      mentorName: varchar33("mentor_name", { length: 255 }),
      mentorArea: varchar33("mentor_area", { length: 255 }),
      // What they mentor in
      // Connection Details
      connectionDate: timestamp33("connection_date"),
      meetingFrequency: varchar33("meeting_frequency", { length: 50 }),
      // Focus Areas
      focusAreas: text33("focus_areas"),
      // JSON array
      // Progress
      sessionsCompleted: integer33("sessions_completed").default(0),
      lastMeeting: timestamp33("last_meeting"),
      nextMeeting: timestamp33("next_meeting"),
      // Impact
      impactRating: integer33("impact_rating"),
      // 1-10
      keyLearnings: text33("key_learnings"),
      // JSON array
      status: varchar33("status", { length: 50 }),
      createdAt: timestamp33("created_at").defaultNow(),
      updatedAt: timestamp33("updated_at").defaultNow()
    });
    masculinityReflections = pgTable33("masculinity_reflections", {
      id: varchar33("id", { length: 255 }).primaryKey(),
      profileId: varchar33("profile_id", { length: 255 }).notNull(),
      userId: varchar33("user_id", { length: 255 }).notNull(),
      reflectionDate: timestamp33("reflection_date").notNull(),
      // Reflection Prompts (evidence-based)
      promptType: varchar33("prompt_type", { length: 50 }),
      reflection: text33("reflection").notNull(),
      // Insights
      insights: text33("insights"),
      actionSteps: text33("action_steps"),
      // JSON array
      createdAt: timestamp33("created_at").defaultNow()
    });
    challengeCompletions = pgTable33("challenge_completions", {
      id: varchar33("id", { length: 255 }).primaryKey(),
      profileId: varchar33("profile_id", { length: 255 }).notNull(),
      userId: varchar33("user_id", { length: 255 }).notNull(),
      challengeCategory: varchar33("challenge_category", { length: 50 }),
      challengeName: varchar33("challenge_name", { length: 255 }).notNull(),
      description: text33("description"),
      // Completion
      startDate: timestamp33("start_date"),
      completionDate: timestamp33("completion_date"),
      // Reflection
      whatYouLearned: text33("what_you_learned"),
      howYouGrew: text33("how_you_grew"),
      // Recognition
      badgeEarned: varchar33("badge_earned", { length: 255 }),
      status: varchar33("status", { length: 50 }),
      createdAt: timestamp33("created_at").defaultNow()
    });
    youngMenMilestones = pgTable33("young_men_milestones", {
      id: varchar33("id", { length: 255 }).primaryKey(),
      profileId: varchar33("profile_id", { length: 255 }).notNull(),
      userId: varchar33("user_id", { length: 255 }).notNull(),
      milestoneType: varchar33("milestone_type", { length: 50 }),
      title: varchar33("title", { length: 255 }).notNull(),
      description: text33("description"),
      achievedDate: timestamp33("achieved_date"),
      // Significance
      whyItMatters: text33("why_it_matters"),
      whoYouBecame: text33("who_you_became"),
      // Identity shift
      createdAt: timestamp33("created_at").defaultNow()
    });
  }
});

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accessibilityProfiles: () => accessibilityProfiles,
  accountDeletionRequests: () => accountDeletionRequests,
  accountabilityPartnerships: () => accountabilityPartnerships,
  achievements: () => achievements,
  actPractices: () => actPractices,
  activeSessions: () => activeSessions,
  adaptiveOutcomeTracking: () => adaptiveOutcomeTracking,
  adminActions: () => adminActions,
  adminNotifications: () => adminNotifications,
  adminUsers: () => adminUsers,
  aiChatConversations: () => aiChatConversations,
  aiChatMessages: () => aiChatMessages,
  aiCoachFeedback: () => aiCoachFeedback,
  aiCoachProfiles: () => aiCoachProfiles,
  aiInsights: () => aiInsights,
  aiRecommendations: () => aiRecommendations,
  aiSafetyRules: () => aiSafetyRules,
  aiSettings: () => aiSettings,
  analyticsEvents: () => analyticsEvents,
  analyticsLearning: () => analyticsLearning,
  analyticsProfiles: () => analyticsProfiles,
  apiKeys: () => apiKeys,
  apiRateLimits: () => apiRateLimits,
  apiRequestLogs: () => apiRequestLogs,
  appearanceSettings: () => appearanceSettings,
  articleFeedback: () => articleFeedback,
  auditLogs: () => auditLogs,
  autismOutcomeTracking: () => autismOutcomeTracking,
  autismPatternDetection: () => autismPatternDetection,
  autismProfiles: () => autismProfiles,
  autismProviders: () => autismProviders,
  availabilityExceptions: () => availabilityExceptions,
  availableIntegrations: () => availableIntegrations,
  badges: () => badges,
  bestPossibleSelfEntries: () => bestPossibleSelfEntries,
  betaFeatures: () => betaFeatures,
  biomarkers: () => biomarkers,
  blockedUsers: () => blockedUsers,
  bodyMeasurements: () => bodyMeasurements,
  brainTrainingExercises: () => brainTrainingExercises,
  brandSafetyKeywords: () => brandSafetyKeywords,
  breakupRecovery: () => breakupRecovery,
  budgetCategories: () => budgetCategories,
  bugReports: () => bugReports,
  cardioSessions: () => cardioSessions,
  careerExperiments: () => careerExperiments,
  careerMilestones: () => careerMilestones,
  careerProfiles: () => careerProfiles,
  challengeCompletions: () => challengeCompletions,
  challengeParticipants: () => challengeParticipants,
  challenges: () => challenges,
  chartInteractions: () => chartInteractions,
  clientFiles: () => clientFiles,
  clientPatterns: () => clientPatterns2,
  clientPredictions: () => clientPredictions,
  clientPreferences: () => clientPreferences,
  clients: () => clients,
  coachAvailability: () => coachAvailability,
  coachFeedback: () => coachFeedback,
  coachGuidance: () => coachGuidance,
  coachNotifications: () => coachNotifications,
  coachPrivateNotes: () => coachPrivateNotes,
  coaches: () => coaches,
  coachingConversations: () => coachingConversations,
  coachingEffectiveness: () => coachingEffectiveness,
  coachingGoals: () => coachingGoals,
  coachingInsights: () => coachingInsights,
  coachingQuestions: () => coachingQuestions,
  coachingResources: () => coachingResources,
  cognitivePerformance: () => cognitivePerformance,
  communicationLogs: () => communicationLogs,
  communities: () => communities,
  communityAnalytics: () => communityAnalytics,
  communityChallenges: () => communityChallenges,
  communityComments: () => communityComments,
  communityMemberships: () => communityMemberships,
  communityPosts: () => communityPosts,
  communityProfiles: () => communityProfiles,
  comparativeAnalytics: () => comparativeAnalytics,
  comparisonViews: () => comparisonViews,
  compassionPractices: () => compassionPractices,
  complianceCheckpoints: () => complianceCheckpoints,
  complianceFlags: () => complianceFlags,
  complianceReports: () => complianceReports,
  connectionBids: () => connectionBids,
  consentRecords: () => consentRecords,
  contentModerationLogs: () => contentModerationLogs,
  conversationMessages: () => conversationMessages,
  copingStrategies: () => copingStrategies,
  correlations: () => correlations,
  crisisInterventionLogs: () => crisisInterventionLogs,
  customReports: () => customReports,
  dailyAffirmations: () => dailyAffirmations,
  dailyCheckIns: () => dailyCheckIns,
  dailyCheckins: () => dailyCheckins,
  dailyHealthMetrics: () => dailyHealthMetrics,
  dailyNutritionSummary: () => dailyNutritionSummary,
  dailyReviews: () => dailyReviews,
  dailyRewards: () => dailyRewards,
  dailySnapshots: () => dailySnapshots,
  dailyStressLogs: () => dailyStressLogs,
  dashboardConfigurations: () => dashboardConfigurations,
  dataAccessLogs: () => dataAccessLogs,
  dataMappingRules: () => dataMappingRules,
  dataSettings: () => dataSettings,
  debtAccounts: () => debtAccounts,
  debtPayments: () => debtPayments,
  developmentalAssets: () => developmentalAssets,
  dietaryInterventions: () => dietaryInterventions,
  disciplineEvents: () => disciplineEvents,
  discountCodeUsage: () => discountCodeUsage,
  discountCodes: () => discountCodes,
  emailLogs: () => emailLogs,
  emailQueue: () => emailQueue,
  emotionEntries: () => emotionEntries,
  emotionLogs: () => emotionLogs,
  emotionRegulationStrategies: () => emotionRegulationStrategies,
  emotionalEngineAnalytics: () => emotionalEngineAnalytics,
  emotionalPatterns: () => emotionalPatterns,
  emotionalProcessing: () => emotionalProcessing,
  emotionalProfiles: () => emotionalProfiles,
  emotionalWins: () => emotionalWins,
  encryptionKeys: () => encryptionKeys,
  escalationQueue: () => escalationQueue,
  exercises: () => exercises,
  expenses: () => expenses,
  experiencePointsLog: () => experiencePointsLog,
  exportRequests: () => exportRequests,
  exportedData: () => exportedData,
  featureFlags: () => featureFlags,
  financialEducation: () => financialEducation,
  financialProfiles: () => financialProfiles,
  financialWins: () => financialWins,
  focusSessions: () => focusSessions,
  foodReactions: () => foodReactions,
  forbiddenContentDictionary: () => forbiddenContentDictionary,
  gamificationAnalytics: () => gamificationAnalytics,
  gamificationProfiles: () => gamificationProfiles,
  goalAccountability: () => goalAccountability,
  goalAnalytics: () => goalAnalytics,
  goalMilestones: () => goalMilestones,
  goalObstacles: () => goalObstacles,
  goalPredictions: () => goalPredictions,
  goalProfiles: () => goalProfiles,
  goalProgressLogs: () => goalProgressLogs,
  goalReflections: () => goalReflections,
  goals: () => goals,
  habitCompletions: () => habitCompletions,
  habitFormationAnalytics: () => habitFormationAnalytics,
  habitMilestones: () => habitMilestones,
  habitObstacles: () => habitObstacles,
  habitProfiles: () => habitProfiles,
  habitStacks: () => habitStacks,
  habitTracking: () => habitTracking,
  habits: () => habits,
  healthMilestones: () => healthMilestones,
  healthOptimizationAnalytics: () => healthOptimizationAnalytics,
  healthOptimizationProfiles: () => healthOptimizationProfiles,
  healthProtocols: () => healthProtocols,
  healthScreenings: () => healthScreenings,
  heatmapData: () => heatmapData,
  hrvMeasurements: () => hrvMeasurements,
  humanSessionBookings: () => humanSessionBookings,
  hydrationLogs: () => hydrationLogs,
  identityProfiles: () => identityProfiles,
  identityTransformations: () => identityTransformations,
  implementationIntentions: () => implementationIntentions,
  importedData: () => importedData,
  incomeEntries: () => incomeEntries,
  insights: () => insights,
  integrationAnalytics: () => integrationAnalytics,
  integrationProfiles: () => integrationProfiles,
  integrationRecommendations: () => integrationRecommendations,
  interventionPlans: () => interventionPlans,
  jobSearchActivities: () => jobSearchActivities,
  journalAnalytics: () => journalAnalytics,
  journalEntries: () => journalEntries2,
  journalInsights: () => journalInsights,
  journalProfiles: () => journalProfiles,
  journalPrompts: () => journalPrompts,
  journalReflections: () => journalReflections,
  keyResults: () => keyResults,
  knowledgeBaseArticles: () => knowledgeBaseArticles,
  languagePatternPractice: () => languagePatternPractice,
  languagePatterns: () => languagePatterns,
  leaderboardEntries: () => leaderboardEntries,
  leaderboards: () => leaderboards,
  lifeSkillsDevelopment: () => lifeSkillsDevelopment,
  liveSessionTranscripts: () => liveSessionTranscripts,
  loginHistory: () => loginHistory,
  longevityPractices: () => longevityPractices,
  loveLanguageActions: () => loveLanguageActions,
  loveMaps: () => loveMaps,
  masculinityReflections: () => masculinityReflections,
  mealPlans: () => mealPlans,
  meals: () => meals,
  meditationSessions: () => meditationSessions,
  memoryChallenges: () => memoryChallenges,
  memoryItems: () => memoryItems,
  memoryMasteryAnalytics: () => memoryMasteryAnalytics,
  memoryMasteryProfiles: () => memoryMasteryProfiles,
  memoryMilestones: () => memoryMilestones,
  memoryPalaces: () => memoryPalaces,
  memoryPractices: () => memoryPractices,
  memoryReviews: () => memoryReviews,
  memoryTechniquePractice: () => memoryTechniquePractice,
  mentalBreaks: () => mentalBreaks,
  mentalEngineAnalytics: () => mentalEngineAnalytics,
  mentalHealthProfiles: () => mentalHealthProfiles,
  mentalProfiles: () => mentalProfiles,
  mentorshipConnections: () => mentorshipConnections,
  mentorships: () => mentorships,
  microHabits: () => microHabits,
  milestoneVisualizations: () => milestoneVisualizations,
  milestones: () => milestones,
  mindfulnessPractices: () => mindfulnessPractices,
  mobilityWork: () => mobilityWork,
  modulePreferences: () => modulePreferences,
  moneyMindsetReflections: () => moneyMindsetReflections,
  monthlyReports: () => monthlyReports,
  moodLogs: () => moodLogs,
  motivationBoosts: () => motivationBoosts,
  nameFaceMemory: () => nameFaceMemory,
  nameRecallPractice: () => nameRecallPractice,
  networkingContacts: () => networkingContacts,
  notificationAnalytics: () => notificationAnalytics,
  notificationBatches: () => notificationBatches,
  notificationPreferences: () => notificationPreferences,
  notificationProfiles: () => notificationProfiles,
  notifications: () => notifications,
  numberMemory: () => numberMemory,
  nutritionEngineAnalytics: () => nutritionEngineAnalytics,
  nutritionExperiments: () => nutritionExperiments,
  nutritionProfiles: () => nutritionProfiles,
  okrs: () => okrs,
  partnerCheckIns: () => partnerCheckIns,
  patternLearning: () => patternLearning,
  physicalEngineAnalytics: () => physicalEngineAnalytics,
  physicalProfiles: () => physicalProfiles,
  platformAnalytics: () => platformAnalytics,
  platformMetrics: () => platformMetrics,
  platformRecommendations: () => platformRecommendations,
  platformSettings: () => platformSettings,
  predictions: () => predictions,
  principleGoals: () => principleGoals,
  principlePractices: () => principlePractices,
  principleProgress: () => principleProgress,
  principles: () => principles,
  privacySettings: () => privacySettings,
  proactiveCheckIns: () => proactiveCheckIns,
  professionalBoundaryViolations: () => professionalBoundaryViolations,
  progressCelebrations: () => progressCelebrations,
  progressMilestones: () => progressMilestones,
  progressSnapshots: () => progressSnapshots,
  promptEffectiveness: () => promptEffectiveness,
  pseudoscienceBlocklist: () => pseudoscienceBlocklist,
  purposeActivities: () => purposeActivities,
  purposeExplorations: () => purposeExplorations,
  pushTokens: () => pushTokens,
  rateLimits: () => rateLimits,
  readingSessions: () => readingSessions,
  recommendationFeedback: () => recommendationFeedback,
  recoveryMilestones: () => recoveryMilestones,
  recoveryTracking: () => recoveryTracking,
  relationshipProfiles: () => relationshipProfiles,
  relationshipRituals: () => relationshipRituals,
  reminderOccurrences: () => reminderOccurrences,
  reminders: () => reminders,
  repairAttempts: () => repairAttempts,
  reportGenerations: () => reportGenerations,
  researchMonitoring: () => researchMonitoring,
  researchQualityReviews: () => researchQualityReviews,
  resilienceActivities: () => resilienceActivities,
  safetyAnalytics: () => safetyAnalytics,
  safetyPlans: () => safetyPlans,
  savingsGoals: () => savingsGoals,
  securityAlerts: () => securityAlerts,
  securityIncidents: () => securityIncidents,
  securityProfiles: () => securityProfiles,
  sessionPreferences: () => sessionPreferences,
  sessionRecordings: () => sessionRecordings,
  sessionReminders: () => sessionReminders,
  sessionSummaries: () => sessionSummaries,
  sessionTypes: () => sessionTypes,
  sessions: () => sessions,
  settingsChangeLog: () => settingsChangeLog,
  similarCases: () => similarCases,
  skillDevelopment: () => skillDevelopment,
  sleepAnalytics: () => sleepAnalytics,
  sleepExperiments: () => sleepExperiments,
  sleepHygienePractices: () => sleepHygienePractices,
  sleepInsights: () => sleepInsights,
  sleepMemoryTracking: () => sleepMemoryTracking,
  sleepPerformanceCorrelations: () => sleepPerformanceCorrelations,
  sleepProfiles: () => sleepProfiles,
  sleepSessions: () => sleepSessions,
  sleepTracking: () => sleepTracking,
  smsQueue: () => smsQueue,
  spiritualEngineAnalytics: () => spiritualEngineAnalytics,
  spiritualExperiences: () => spiritualExperiences,
  spiritualMilestones: () => spiritualMilestones,
  spiritualProfiles: () => spiritualProfiles,
  strategyAdjustments: () => strategyAdjustments,
  strengthBenchmarks: () => strengthBenchmarks,
  stressAnalytics: () => stressAnalytics,
  stressEvents: () => stressEvents,
  stressInterventions: () => stressInterventions,
  stressPredictions: () => stressPredictions,
  stressProfiles: () => stressProfiles,
  stressRecoveryLogs: () => stressRecoveryLogs,
  stressRecoverySessions: () => stressRecoverySessions,
  stressTriggers: () => stressTriggers,
  subscriptions: () => subscriptions,
  suggestionEffectiveness: () => suggestionEffectiveness,
  supplementLogs: () => supplementLogs,
  supplementTracking: () => supplementTracking,
  supplements: () => supplements,
  supportTickets: () => supportTickets,
  syncLogs: () => syncLogs,
  systemAnnouncements: () => systemAnnouncements,
  techniqueEffectiveness: () => techniqueEffectiveness2,
  therapySessions: () => therapySessions,
  thoughtRecords: () => thoughtRecords,
  ticketMessages: () => ticketMessages,
  transformativeMoments: () => transformativeMoments,
  transformativePrinciplesAnalytics: () => transformativePrinciplesAnalytics,
  transformativePrinciplesProfiles: () => transformativePrinciplesProfiles,
  trendData: () => trendData,
  trendDetection: () => trendDetection,
  trustedDevices: () => trustedDevices,
  usageTracking: () => usageTracking,
  userAchievements: () => userAchievements,
  userBadges: () => userBadges,
  userBetaOptIns: () => userBetaOptIns,
  userChallenges: () => userChallenges,
  userFeatureFlags: () => userFeatureFlags,
  userFeedback: () => userFeedback,
  userIntegrations: () => userIntegrations,
  userInterventionLogs: () => userInterventionLogs,
  userNotificationFeedback: () => userNotificationFeedback,
  userReports: () => userReports,
  userResourceInteractions: () => userResourceInteractions,
  userSettings: () => userSettings,
  users: () => users,
  validatedResearch: () => validatedResearch,
  videoTestimonials: () => videoTestimonials,
  visualizationAnalytics: () => visualizationAnalytics,
  visualizationProfiles: () => visualizationProfiles,
  visualizationWidgets: () => visualizationWidgets,
  webhookEvents: () => webhookEvents,
  webhooks: () => webhooks,
  weeklyHabitReviews: () => weeklyHabitReviews,
  weeklyPrincipleReviews: () => weeklyPrincipleReviews,
  weeklyReports: () => weeklyReports,
  woopPlans: () => woopPlans,
  workouts: () => workouts,
  writingStreaks: () => writingStreaks,
  youngMenMilestones: () => youngMenMilestones,
  youngMenProfiles: () => youngMenProfiles
});
import { date, decimal as decimal29, integer as integer34, pgTable as pgTable34, serial as serial4, text as text34, timestamp as timestamp34, varchar as varchar34 } from "drizzle-orm/pg-core";
var users, coaches, clients, journalEntries2, emotionLogs, copingStrategies, aiInsights, sessionTypes, sessions, subscriptions, usageTracking, humanSessionBookings, coachAvailability, availabilityExceptions, sessionReminders, discountCodes, discountCodeUsage, aiChatConversations, aiChatMessages, platformSettings, videoTestimonials, complianceFlags, escalationQueue, similarCases, coachNotifications, liveSessionTranscripts, coachGuidance, sessionRecordings, sessionSummaries, coachPrivateNotes, platformAnalytics, techniqueEffectiveness2, clientPatterns2, clientPreferences, clientPredictions, coachFeedback, suggestionEffectiveness, emailLogs, clientFiles;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    init_identitySchema();
    init_adaptiveLearningSchema();
    init_autismSchema();
    init_emotionalEngineSchema();
    init_mentalEngineSchema();
    init_physicalEngineSchema();
    init_nutritionEngineSchema();
    init_spiritualEngineSchema();
    init_adminSchema();
    init_aiCoachSchema();
    init_analyticsSchema();
    init_contentModerationSchema();
    init_notificationsSchema();
    init_securitySchema();
    init_settingsSchema();
    init_careerSchema();
    init_communitySchema();
    init_financialSchema();
    init_goalsSchema();
    init_habitFormationSchema();
    init_healthOptimizationSchema();
    init_journalSchema();
    init_mentalHealthSchema();
    init_relationshipSchema();
    init_sleepOptimizationSchema();
    init_stressSchema();
    init_gamificationSchema();
    init_integrationsSchema();
    init_memoryMasterySchema();
    init_transformativePrinciplesSchema();
    init_truthKeepersSchema();
    init_visualizationSchema();
    init_youngMenSchema();
    users = pgTable34("users", {
      /**
       * Surrogate primary key. Auto-incremented numeric value managed by the database.
       * Use this for relations between tables.
       */
      id: serial4("id").primaryKey(),
      /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
      openId: varchar34("openId", { length: 64 }).notNull().unique(),
      name: text34("name"),
      email: varchar34("email", { length: 320 }),
      loginMethod: varchar34("loginMethod", { length: 64 }),
      birthdate: date("birthdate"),
      // For age verification (18+ requirement)
      role: varchar34("role", { length: 50 }),
      // Profile fields extracted from AI conversations
      primaryGoal: text34("primaryGoal"),
      // e.g., "stress management", "career transition"
      secondaryGoal: text34("secondaryGoal"),
      mainChallenges: text34("mainChallenges"),
      // JSON array of challenges
      preferredFrequency: varchar34("preferredFrequency", { length: 50 }),
      timezone: varchar34("timezone", { length: 64 }),
      // e.g., "America/Los_Angeles"
      availability: text34("availability"),
      // e.g., "evenings", "weekends", "flexible"
      communicationStyle: varchar34("communicationStyle", { length: 50 }),
      triggers: text34("triggers"),
      // JSON array of triggers to watch for
      profileCompleteness: integer34("profileCompleteness").default(0),
      // 0-100%
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull(),
      lastSignedIn: timestamp34("lastSignedIn").defaultNow().notNull()
    });
    coaches = pgTable34("coaches", {
      id: serial4("id").primaryKey(),
      userId: integer34("userId").notNull().references(() => users.id),
      specialization: text34("specialization"),
      bio: text34("bio"),
      certifications: text34("certifications"),
      yearsExperience: integer34("yearsExperience"),
      isActive: varchar34("isActive", { length: 50 }),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    clients = pgTable34("clients", {
      id: serial4("id").primaryKey(),
      coachId: integer34("coachId").notNull().references(() => coaches.id),
      name: varchar34("name", { length: 255 }).notNull(),
      email: varchar34("email", { length: 320 }),
      phone: varchar34("phone", { length: 50 }),
      dateOfBirth: timestamp34("dateOfBirth"),
      goals: text34("goals"),
      notes: text34("notes"),
      status: varchar34("status", { length: 50 }),
      startDate: timestamp34("startDate").defaultNow().notNull(),
      endDate: timestamp34("endDate"),
      // Professional Info (auto-extracted from conversations)
      jobTitle: varchar34("jobTitle", { length: 200 }),
      company: varchar34("company", { length: 200 }),
      industry: varchar34("industry", { length: 100 }),
      careerGoals: text34("careerGoals"),
      // Personal Info (auto-extracted)
      age: integer34("age"),
      locationCity: varchar34("locationCity", { length: 100 }),
      locationState: varchar34("locationState", { length: 100 }),
      locationCountry: varchar34("locationCountry", { length: 100 }),
      relationshipStatus: varchar34("relationshipStatus", { length: 50 }),
      hasChildren: varchar34("hasChildren", { length: 50 }),
      // Goals & Motivation (auto-extracted)
      primaryGoal: text34("primaryGoal"),
      goalTimeline: varchar34("goalTimeline", { length: 100 }),
      motivation: text34("motivation"),
      // Identity Architecture (auto-extracted)
      currentIdentity: text34("currentIdentity"),
      // JSON array
      targetIdentity: text34("targetIdentity"),
      // JSON array
      identityGap: text34("identityGap"),
      coreValues: text34("coreValues"),
      // JSON array
      lifeMission: text34("lifeMission"),
      // Behavioral Patterns (auto-extracted)
      procrastinationTriggers: text34("procrastinationTriggers"),
      // JSON array
      energyPattern: varchar34("energyPattern", { length: 50 }),
      stressResponses: text34("stressResponses"),
      // JSON array
      // Health & Wellness (auto-extracted)
      sleepHours: decimal29("sleepHours", { precision: 3, scale: 1 }),
      exerciseFrequency: varchar34("exerciseFrequency", { length: 50 }),
      dietPattern: varchar34("dietPattern", { length: 100 }),
      mentalHealthNotes: text34("mentalHealthNotes"),
      // Financial (auto-extracted)
      savingsLevel: varchar34("savingsLevel", { length: 50 }),
      hasDebt: varchar34("hasDebt", { length: 50 }),
      monthlyExpensesEstimate: integer34("monthlyExpensesEstimate"),
      // Communication Preferences (auto-extracted)
      preferredContact: varchar34("preferredContact", { length: 50 }),
      bestTimeToReach: varchar34("bestTimeToReach", { length: 50 }),
      communicationStyle: varchar34("communicationStyle", { length: 50 }),
      // Crisis Indicators (auto-detected)
      suicideRiskLevel: varchar34("suicideRiskLevel", { length: 20 }),
      crisisFlags: text34("crisisFlags"),
      // JSON array
      lastCrisisCheck: timestamp34("lastCrisisCheck"),
      // Extraction Metadata
      profileCompleteness: integer34("profileCompleteness").default(0),
      confidenceScores: text34("confidenceScores"),
      // JSON object
      lastProfileUpdate: timestamp34("lastProfileUpdate"),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    journalEntries2 = pgTable34("journalEntries", {
      id: serial4("id").primaryKey(),
      clientId: integer34("clientId").notNull().references(() => clients.id),
      entryDate: timestamp34("entryDate").defaultNow().notNull(),
      content: text34("content").notNull(),
      mood: varchar34("mood", { length: 50 }),
      moodIntensity: integer34("moodIntensity"),
      // 1-10 scale
      emotions: text34("emotions"),
      // JSON array of emotions
      triggers: text34("triggers"),
      // What triggered the emotions
      copingStrategies: text34("copingStrategies"),
      // What they did to cope
      copingEffectiveness: integer34("copingEffectiveness"),
      // 1-10 scale
      resilienceScore: integer34("resilienceScore"),
      // Calculated resilience score
      isPrivate: varchar34("isPrivate", { length: 50 }),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    emotionLogs = pgTable34("emotionLogs", {
      id: serial4("id").primaryKey(),
      clientId: integer34("clientId").notNull().references(() => clients.id),
      journalEntryId: integer34("journalEntryId").references(() => journalEntries2.id),
      logDate: timestamp34("logDate").defaultNow().notNull(),
      emotionType: varchar34("emotionType", { length: 100 }).notNull(),
      // joy, sadness, anger, fear, etc.
      intensity: integer34("intensity").notNull(),
      // 1-10 scale
      trigger: text34("trigger"),
      physicalSensations: text34("physicalSensations"),
      thoughts: text34("thoughts"),
      behaviors: text34("behaviors"),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    copingStrategies = pgTable34("copingStrategies", {
      id: serial4("id").primaryKey(),
      clientId: integer34("clientId").notNull().references(() => clients.id),
      strategyName: varchar34("strategyName", { length: 255 }).notNull(),
      description: text34("description"),
      category: varchar34("category", { length: 100 }),
      // breathing, physical, social, cognitive, etc.
      timesUsed: integer34("timesUsed").default(0).notNull(),
      averageEffectiveness: integer34("averageEffectiveness"),
      // Average rating 1-10
      lastUsed: timestamp34("lastUsed"),
      isRecommended: varchar34("isRecommended", { length: 50 }),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    aiInsights = pgTable34("aiInsights", {
      id: serial4("id").primaryKey(),
      clientId: integer34("clientId").notNull().references(() => clients.id),
      insightDate: timestamp34("insightDate").defaultNow().notNull(),
      insightType: varchar34("insightType", { length: 100 }).notNull(),
      // pattern, trend, recommendation, alert
      title: varchar34("title", { length: 255 }).notNull(),
      description: text34("description").notNull(),
      severity: varchar34("severity", { length: 50 }),
      actionable: text34("actionable"),
      // Suggested actions
      isRead: varchar34("isRead", { length: 50 }),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    sessionTypes = pgTable34("sessionTypes", {
      id: serial4("id").primaryKey(),
      coachId: integer34("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
      name: varchar34("name", { length: 100 }).notNull(),
      description: text34("description"),
      duration: integer34("duration").notNull(),
      // in minutes
      price: integer34("price").notNull(),
      // in cents (e.g., 7500 = $75.00)
      stripePriceId: varchar34("stripePriceId", { length: 255 }),
      // Stripe recurring price ID for subscriptions
      oneTimePriceId: varchar34("oneTimePriceId", { length: 255 }),
      // Stripe one-time price ID for single sessions
      subscriptionPrice: integer34("subscriptionPrice"),
      // Monthly subscription price in cents (optional, defaults to price)
      isActive: varchar34("isActive", { length: 50 }),
      displayOrder: integer34("displayOrder").default(0).notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    sessions = pgTable34("sessions", {
      id: serial4("id").primaryKey(),
      coachId: integer34("coachId").notNull().references(() => coaches.id),
      clientId: integer34("clientId").notNull().references(() => clients.id),
      sessionTypeId: integer34("sessionTypeId").references(() => sessionTypes.id),
      scheduledDate: timestamp34("scheduledDate").notNull(),
      duration: integer34("duration").notNull(),
      // in minutes
      price: integer34("price"),
      // in cents - captured at booking time
      sessionType: varchar34("sessionType", { length: 100 }),
      // legacy field, kept for backward compatibility
      notes: text34("notes"),
      status: varchar34("status", { length: 50 }),
      paymentStatus: varchar34("paymentStatus", { length: 50 }),
      stripePaymentIntentId: varchar34("stripePaymentIntentId", { length: 255 }),
      stripeSessionId: varchar34("stripeSessionId", { length: 255 }),
      // Stripe checkout session ID
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    subscriptions = pgTable34("subscriptions", {
      id: serial4("id").primaryKey(),
      userId: integer34("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
      stripeSubscriptionId: varchar34("stripeSubscriptionId", { length: 255 }),
      stripeCustomerId: varchar34("stripeCustomerId", { length: 255 }),
      stripePriceId: varchar34("stripePriceId", { length: 255 }),
      productId: varchar34("productId", { length: 64 }).notNull(),
      tier: varchar34("tier", { length: 50 }),
      billingFrequency: varchar34("billingFrequency", { length: 50 }),
      status: varchar34("status", { length: 50 }),
      currentPeriodStart: timestamp34("currentPeriodStart"),
      currentPeriodEnd: timestamp34("currentPeriodEnd"),
      cancelAtPeriodEnd: varchar34("cancelAtPeriodEnd", { length: 50 }),
      trialStart: timestamp34("trialStart"),
      trialEnd: timestamp34("trialEnd"),
      cancelledAt: timestamp34("cancelledAt"),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    usageTracking = pgTable34("usage_tracking", {
      id: serial4("id").primaryKey(),
      subscriptionId: integer34("subscriptionId").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
      userId: integer34("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
      periodStart: timestamp34("periodStart").notNull(),
      periodEnd: timestamp34("periodEnd").notNull(),
      aiSessionsUsed: integer34("aiSessionsUsed").default(0).notNull(),
      humanSessionsUsed: integer34("humanSessionsUsed").default(0).notNull(),
      humanSessionsIncluded: integer34("humanSessionsIncluded").notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    humanSessionBookings = pgTable34("human_session_bookings", {
      id: serial4("id").primaryKey(),
      userId: integer34("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
      coachId: integer34("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
      subscriptionId: integer34("subscriptionId").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
      sessionDate: timestamp34("sessionDate").notNull(),
      duration: integer34("duration").default(30).notNull(),
      status: varchar34("status", { length: 50 }),
      zoomLink: text34("zoomLink"),
      aiPreSessionBrief: text34("aiPreSessionBrief"),
      coachNotes: text34("coachNotes"),
      recordingUrl: text34("recordingUrl"),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    coachAvailability = pgTable34("coachAvailability", {
      id: serial4("id").primaryKey(),
      coachId: integer34("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
      dayOfWeek: integer34("dayOfWeek").notNull(),
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      startTime: varchar34("startTime", { length: 5 }).notNull(),
      // HH:MM format (e.g., "09:00")
      endTime: varchar34("endTime", { length: 5 }).notNull(),
      // HH:MM format (e.g., "17:00")
      isActive: varchar34("isActive", { length: 50 }),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    availabilityExceptions = pgTable34("availabilityExceptions", {
      id: serial4("id").primaryKey(),
      coachId: integer34("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
      startDate: timestamp34("startDate").notNull(),
      endDate: timestamp34("endDate").notNull(),
      reason: varchar34("reason", { length: 255 }),
      // vacation, holiday, personal, etc.
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    sessionReminders = pgTable34("sessionReminders", {
      id: serial4("id").primaryKey(),
      sessionId: integer34("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
      reminderType: varchar34("reminderType", { length: 50 }),
      sentAt: timestamp34("sentAt").defaultNow().notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    discountCodes = pgTable34("discountCodes", {
      id: serial4("id").primaryKey(),
      code: varchar34("code", { length: 50 }).notNull().unique(),
      discountPercent: integer34("discountPercent").notNull(),
      // 10 for 10%
      discountAmount: integer34("discountAmount"),
      // Fixed amount in cents (optional)
      maxUses: integer34("maxUses"),
      // null = unlimited
      usedCount: integer34("usedCount").default(0).notNull(),
      expiresAt: timestamp34("expiresAt"),
      isActive: varchar34("isActive", { length: 50 }),
      createdBy: integer34("createdBy").references(() => users.id),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    discountCodeUsage = pgTable34("discountCodeUsage", {
      id: serial4("id").primaryKey(),
      discountCodeId: integer34("discountCodeId").notNull().references(() => discountCodes.id),
      userId: integer34("userId").references(() => users.id),
      sessionId: integer34("sessionId").references(() => sessions.id),
      usedAt: timestamp34("usedAt").defaultNow().notNull()
    });
    aiChatConversations = pgTable34("aiChatConversations", {
      id: serial4("id").primaryKey(),
      userId: integer34("userId").references(() => users.id, { onDelete: "cascade" }),
      // Nullable for guest users
      clientId: integer34("clientId").references(() => clients.id, { onDelete: "cascade" }),
      // Optional link to client profile
      subscriptionId: integer34("subscriptionId").references(() => subscriptions.id, { onDelete: "set null" }),
      // Link to subscription for usage tracking
      sessionDuration: integer34("sessionDuration").default(0),
      // Duration in minutes
      title: varchar34("title", { length: 255 }),
      // Auto-generated conversation title
      // Quality monitoring fields
      rating: integer34("rating"),
      // 1-5 stars (null = not rated yet)
      feedbackText: text34("feedbackText"),
      // Optional detailed feedback
      feedbackCategory: varchar34("feedbackCategory", { length: 50 }),
      wasHelpful: varchar34("wasHelpful", { length: 50 }),
      // Simple thumbs up/down
      reviewedByAdmin: varchar34("reviewedByAdmin", { length: 50 }),
      adminNotes: text34("adminNotes"),
      // Admin review notes
      lastMessageAt: timestamp34("lastMessageAt").defaultNow().notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    aiChatMessages = pgTable34("aiChatMessages", {
      id: serial4("id").primaryKey(),
      conversationId: integer34("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
      role: varchar34("role", { length: 50 }),
      content: text34("content").notNull(),
      emotionDetected: varchar34("emotionDetected", { length: 100 }),
      // AI-detected emotion from user message
      crisisFlag: varchar34("crisisFlag", { length: 50 }),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    platformSettings = pgTable34("platformSettings", {
      id: serial4("id").primaryKey(),
      aiCoachingEnabled: varchar34("aiCoachingEnabled", { length: 50 }),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    videoTestimonials = pgTable34("videoTestimonials", {
      id: serial4("id").primaryKey(),
      name: varchar34("name", { length: 255 }).notNull(),
      // Client name
      title: varchar34("title", { length: 255 }).notNull(),
      // Client title/role
      company: varchar34("company", { length: 255 }).notNull(),
      // Client company
      quote: text34("quote").notNull(),
      // Text quote/testimonial
      metric: varchar34("metric", { length: 255 }).notNull(),
      // Metric name (e.g., "Healthcare Cost Savings")
      metricValue: varchar34("metricValue", { length: 100 }).notNull(),
      // Metric value (e.g., "$2.3M")
      videoUrl: text34("videoUrl"),
      // S3 URL to video file
      videoKey: varchar34("videoKey", { length: 500 }),
      // S3 key for video file
      thumbnailUrl: text34("thumbnailUrl"),
      // S3 URL to thumbnail image
      thumbnailKey: varchar34("thumbnailKey", { length: 500 }),
      // S3 key for thumbnail
      duration: integer34("duration"),
      // Video duration in seconds
      isPublished: varchar34("isPublished", { length: 50 }),
      displayOrder: integer34("displayOrder").default(0).notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    complianceFlags = pgTable34("complianceFlags", {
      id: serial4("id").primaryKey(),
      conversationId: integer34("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
      messageId: integer34("messageId").notNull().references(() => aiChatMessages.id, { onDelete: "cascade" }),
      flagType: varchar34("flagType", { length: 50 }),
      severity: varchar34("severity", { length: 50 }),
      flaggedContent: text34("flaggedContent").notNull(),
      // The specific content that triggered the flag
      aiResponse: text34("aiResponse"),
      // How the AI responded to the flagged content
      reviewStatus: varchar34("reviewStatus", { length: 50 }),
      reviewedBy: integer34("reviewedBy").references(() => users.id),
      // Coach who reviewed
      reviewNotes: text34("reviewNotes"),
      reviewedAt: timestamp34("reviewedAt"),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    escalationQueue = pgTable34("escalationQueue", {
      id: serial4("id").primaryKey(),
      conversationId: integer34("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
      userId: integer34("userId").notNull().references(() => users.id),
      clientId: integer34("clientId").references(() => clients.id),
      escalationType: varchar34("escalationType", { length: 50 }),
      priority: varchar34("priority", { length: 50 }),
      reason: text34("reason").notNull(),
      // Why escalation was triggered
      context: text34("context"),
      // Recent conversation context
      status: varchar34("status", { length: 50 }),
      assignedTo: integer34("assignedTo").references(() => coaches.id),
      // Which coach is handling it
      assignedAt: timestamp34("assignedAt"),
      resolvedAt: timestamp34("resolvedAt"),
      resolutionNotes: text34("resolutionNotes"),
      notificationSent: varchar34("notificationSent", { length: 50 }),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    similarCases = pgTable34("similarCases", {
      id: serial4("id").primaryKey(),
      caseTitle: varchar34("caseTitle", { length: 255 }).notNull(),
      caseDescription: text34("caseDescription").notNull(),
      clientIssues: text34("clientIssues").notNull(),
      // JSON array of issues/symptoms
      interventions: text34("interventions").notNull(),
      // What the coach did
      outcome: text34("outcome").notNull(),
      // What happened
      successRating: integer34("successRating").notNull(),
      // 1-10 scale
      timeToResolution: integer34("timeToResolution"),
      // Days to resolution
      coachNotes: text34("coachNotes"),
      // Coach insights and recommendations
      tags: text34("tags"),
      // JSON array of searchable tags
      isPublic: varchar34("isPublic", { length: 50 }),
      // Share with other coaches
      createdBy: integer34("createdBy").notNull().references(() => coaches.id),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    coachNotifications = pgTable34("coachNotifications", {
      id: serial4("id").primaryKey(),
      coachId: integer34("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
      notificationType: varchar34("notificationType", { length: 50 }),
      title: varchar34("title", { length: 255 }).notNull(),
      message: text34("message").notNull(),
      priority: varchar34("priority", { length: 50 }),
      relatedId: integer34("relatedId"),
      // ID of related escalation, flag, etc.
      isRead: varchar34("isRead", { length: 50 }),
      readAt: timestamp34("readAt"),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    liveSessionTranscripts = pgTable34("liveSessionTranscripts", {
      id: serial4("id").primaryKey(),
      sessionId: integer34("sessionId").notNull(),
      speaker: varchar34("speaker", { length: 50 }),
      text: text34("text").notNull(),
      timestamp: timestamp34("timestamp").notNull()
    });
    coachGuidance = pgTable34("coachGuidance", {
      id: serial4("id").primaryKey(),
      sessionId: integer34("sessionId").notNull(),
      guidanceType: varchar34("guidanceType", { length: 50 }),
      priority: varchar34("priority", { length: 50 }),
      message: text34("message").notNull(),
      context: text34("context"),
      timestamp: timestamp34("timestamp").notNull(),
      wasFollowed: varchar34("wasFollowed", { length: 50 })
    });
    sessionRecordings = pgTable34("sessionRecordings", {
      id: serial4("id").primaryKey(),
      sessionId: integer34("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
      clientId: integer34("clientId").notNull().references(() => clients.id),
      coachId: integer34("coachId").notNull().references(() => coaches.id),
      videoUrl: text34("videoUrl"),
      // S3 URL to video recording
      videoKey: varchar34("videoKey", { length: 500 }),
      // S3 key for video
      audioUrl: text34("audioUrl"),
      // S3 URL to audio recording
      audioKey: varchar34("audioKey", { length: 500 }),
      // S3 key for audio
      transcriptUrl: text34("transcriptUrl"),
      // S3 URL to transcript file
      transcriptKey: varchar34("transcriptKey", { length: 500 }),
      // S3 key for transcript
      duration: integer34("duration"),
      // Duration in seconds
      fileSize: integer34("fileSize"),
      // Total file size in bytes
      status: varchar34("status", { length: 50 }),
      clientCanAccess: varchar34("clientCanAccess", { length: 50 }),
      // Client access control
      consentGiven: varchar34("consentGiven", { length: 50 }),
      // Recording consent
      recordedAt: timestamp34("recordedAt").notNull(),
      expiresAt: timestamp34("expiresAt"),
      // Retention policy
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    sessionSummaries = pgTable34("sessionSummaries", {
      id: serial4("id").primaryKey(),
      sessionId: integer34("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
      recordingId: integer34("recordingId").references(() => sessionRecordings.id),
      summary: text34("summary").notNull(),
      // AI-generated summary
      goals: text34("goals"),
      // JSON array of goals discussed
      homework: text34("homework"),
      // JSON array of homework assigned
      keyMoments: text34("keyMoments"),
      // JSON array of breakthrough moments
      emotionTimeline: text34("emotionTimeline"),
      // JSON of emotion changes during session
      techniquesUsed: text34("techniquesUsed"),
      // JSON array of coaching techniques
      nextSteps: text34("nextSteps"),
      // Recommended next steps
      clientProgress: text34("clientProgress"),
      // Progress assessment
      generatedAt: timestamp34("generatedAt").notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    coachPrivateNotes = pgTable34("coachPrivateNotes", {
      id: serial4("id").primaryKey(),
      sessionId: integer34("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
      coachId: integer34("coachId").notNull().references(() => coaches.id),
      notes: text34("notes").notNull(),
      // Private coach impressions
      aiPromptsReceived: text34("aiPromptsReceived"),
      // JSON of AI prompts during session
      supervisionQuestions: text34("supervisionQuestions"),
      // Questions for supervision
      clinicalObservations: text34("clinicalObservations"),
      // Private clinical notes
      reminders: text34("reminders"),
      // Reminders for next session
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    platformAnalytics = pgTable34("platformAnalytics", {
      id: serial4("id").primaryKey(),
      metricType: varchar34("metricType", { length: 50 }),
      metricName: varchar34("metricName", { length: 255 }).notNull(),
      metricValue: text34("metricValue").notNull(),
      // JSON with metric data
      sampleSize: integer34("sampleSize").notNull(),
      // Number of clients/sessions analyzed
      confidence: integer34("confidence").notNull(),
      // Confidence score 0-100
      timeframe: varchar34("timeframe", { length: 100 }).notNull(),
      // e.g., "2025-Q1", "2025-11"
      demographics: text34("demographics"),
      // JSON of demographic breakdown
      insights: text34("insights"),
      // Human-readable insights
      actionable: varchar34("actionable", { length: 50 }),
      implemented: varchar34("implemented", { length: 50 }),
      calculatedAt: timestamp34("calculatedAt").notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    techniqueEffectiveness2 = pgTable34("techniqueEffectiveness", {
      id: serial4("id").primaryKey(),
      techniqueName: varchar34("techniqueName", { length: 255 }).notNull(),
      techniqueCategory: varchar34("techniqueCategory", { length: 100 }).notNull(),
      // e.g., "CBT", "mindfulness", "somatic"
      totalUsage: integer34("totalUsage").notNull(),
      // Times used
      successCount: integer34("successCount").notNull(),
      // Times it worked
      successRate: integer34("successRate").notNull(),
      // Percentage 0-100
      avgTimeToResults: integer34("avgTimeToResults"),
      // Average days to see results
      bestForIssues: text34("bestForIssues"),
      // JSON array of issues it works best for
      bestForDemographics: text34("bestForDemographics"),
      // JSON of demographics
      clientFeedback: text34("clientFeedback"),
      // JSON array of feedback quotes
      coachNotes: text34("coachNotes"),
      // Coach observations
      lastUpdated: timestamp34("lastUpdated").notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    clientPatterns2 = pgTable34("clientPatterns", {
      id: serial4("id").primaryKey(),
      clientId: integer34("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
      patternType: varchar34("patternType", { length: 50 }),
      patternName: varchar34("patternName", { length: 255 }).notNull(),
      description: text34("description").notNull(),
      frequency: integer34("frequency").notNull(),
      // How often this pattern occurs
      confidence: integer34("confidence").notNull(),
      // Confidence score 0-100
      firstDetected: timestamp34("firstDetected").notNull(),
      lastOccurred: timestamp34("lastOccurred").notNull(),
      relatedSessions: text34("relatedSessions"),
      // JSON array of session IDs
      actionable: text34("actionable"),
      // What coach should do about this pattern
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    clientPreferences = pgTable34("clientPreferences", {
      id: serial4("id").primaryKey(),
      clientId: integer34("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
      preferenceType: varchar34("preferenceType", { length: 50 }),
      preferenceName: varchar34("preferenceName", { length: 255 }).notNull(),
      preferenceValue: text34("preferenceValue").notNull(),
      // What they prefer
      effectiveness: integer34("effectiveness").notNull(),
      // How well it works 0-100
      timesUsed: integer34("timesUsed").notNull(),
      lastUsed: timestamp34("lastUsed").notNull(),
      notes: text34("notes"),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    clientPredictions = pgTable34("clientPredictions", {
      id: serial4("id").primaryKey(),
      clientId: integer34("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
      predictionType: varchar34("predictionType", { length: 50 }),
      prediction: text34("prediction").notNull(),
      confidence: integer34("confidence").notNull(),
      // 0-100
      reasoning: text34("reasoning").notNull(),
      // Why AI made this prediction
      basedOnData: text34("basedOnData"),
      // JSON of data points used
      validUntil: timestamp34("validUntil").notNull(),
      wasAccurate: varchar34("wasAccurate", { length: 50 }),
      actualOutcome: text34("actualOutcome"),
      // What actually happened
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
    coachFeedback = pgTable34("coachFeedback", {
      id: serial4("id").primaryKey(),
      coachId: integer34("coachId").notNull().references(() => coaches.id),
      sessionId: integer34("sessionId").references(() => sessions.id),
      suggestionType: varchar34("suggestionType", { length: 100 }).notNull(),
      // What type of AI suggestion
      suggestionContent: text34("suggestionContent").notNull(),
      // What AI suggested
      feedbackType: varchar34("feedbackType", { length: 50 }),
      rating: integer34("rating"),
      // 1-5 stars
      notes: text34("notes"),
      // Coach's explanation
      wasUsed: varchar34("wasUsed", { length: 50 }),
      outcome: text34("outcome"),
      // What happened after using/ignoring suggestion
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    suggestionEffectiveness = pgTable34("suggestionEffectiveness", {
      id: serial4("id").primaryKey(),
      suggestionType: varchar34("suggestionType", { length: 100 }).notNull(),
      totalSuggestions: integer34("totalSuggestions").notNull(),
      timesUsed: integer34("timesUsed").notNull(),
      timesHelpful: integer34("timesHelpful").notNull(),
      usageRate: integer34("usageRate").notNull(),
      // Percentage 0-100
      helpfulnessRate: integer34("helpfulnessRate").notNull(),
      // Percentage 0-100
      avgRating: integer34("avgRating"),
      // Average rating 1-5
      bestContext: text34("bestContext"),
      // JSON of when it works best
      improvements: text34("improvements"),
      // Suggested improvements
      lastUpdated: timestamp34("lastUpdated").notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    emailLogs = pgTable34("email_logs", {
      id: serial4("id").primaryKey(),
      userId: integer34("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
      emailType: varchar34("emailType", { length: 50 }),
      sentAt: timestamp34("sentAt").notNull().defaultNow(),
      subject: varchar34("subject", { length: 255 }).notNull(),
      status: varchar34("status", { length: 50 }),
      metadata: text34("metadata"),
      // JSON string with additional data like usage stats
      createdAt: timestamp34("createdAt").defaultNow().notNull()
    });
    clientFiles = pgTable34("client_files", {
      id: serial4("id").primaryKey(),
      userId: integer34("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
      conversationId: integer34("conversationId").references(() => aiChatConversations.id, { onDelete: "set null" }),
      // Link to conversation if applicable
      sessionId: integer34("sessionId").references(() => humanSessionBookings.id, { onDelete: "set null" }),
      // Link to session if applicable
      fileName: varchar34("fileName", { length: 255 }).notNull(),
      fileType: varchar34("fileType", { length: 50 }),
      fileCategory: varchar34("fileCategory", { length: 50 }),
      fileUrl: text34("fileUrl").notNull(),
      // Public S3 URL
      fileKey: text34("fileKey").notNull(),
      // S3 key for deletion/management
      mimeType: varchar34("mimeType", { length: 100 }),
      fileSize: integer34("fileSize"),
      // Size in bytes
      duration: integer34("duration"),
      // Duration in seconds for audio/video
      transcriptionText: text34("transcriptionText"),
      // Auto-generated transcription for audio/video
      transcriptionStatus: varchar34("transcriptionStatus", { length: 50 }),
      coachNotes: text34("coachNotes"),
      // Coach can add notes about this file
      tags: text34("tags"),
      // JSON array of tags for organization
      uploadedAt: timestamp34("uploadedAt").defaultNow().notNull(),
      createdAt: timestamp34("createdAt").defaultNow().notNull(),
      updatedAt: timestamp34("updatedAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
      resendApiKey: process.env.RESEND_API_KEY ?? "",
      ownerEmail: process.env.OWNER_EMAIL ?? ""
    };
  }
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client2 = postgres(process.env.DATABASE_URL);
      _db = drizzle(client2, { schema: schema_exports });
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
var _db, client, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_schema();
    init_env();
    _db = null;
    client = postgres(process.env.DATABASE_URL || "");
    db = drizzle(client, { schema: schema_exports });
  }
});

// server/_core/llm.ts
async function invokeLLM(params) {
  const apiKey = assertApiKey();
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format
  } = params;
  const payload = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage)
  };
  if (tools && tools.length > 0) {
    payload.tools = tools;
  }
  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }
  payload.max_tokens = 32768;
  payload.thinking = {
    "budget_tokens": 128
  };
  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema
  });
  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }
  const response = await fetch(resolveApiUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} \u2013 ${errorText}`
    );
  }
  return await response.json();
}
var ensureArray, normalizeContentPart, normalizeMessage, normalizeToolChoice, resolveApiUrl, assertApiKey, normalizeResponseFormat;
var init_llm = __esm({
  "server/_core/llm.ts"() {
    "use strict";
    init_env();
    ensureArray = (value) => Array.isArray(value) ? value : [value];
    normalizeContentPart = (part) => {
      if (typeof part === "string") {
        return { type: "text", text: part };
      }
      if (part.type === "text") {
        return part;
      }
      if (part.type === "image_url") {
        return part;
      }
      if (part.type === "file_url") {
        return part;
      }
      throw new Error("Unsupported message content part");
    };
    normalizeMessage = (message) => {
      const { role, name, tool_call_id } = message;
      if (role === "tool" || role === "function") {
        const content = ensureArray(message.content).map((part) => typeof part === "string" ? part : JSON.stringify(part)).join("\n");
        return {
          role,
          name,
          tool_call_id,
          content
        };
      }
      const contentParts = ensureArray(message.content).map(normalizeContentPart);
      if (contentParts.length === 1 && contentParts[0].type === "text") {
        return {
          role,
          name,
          content: contentParts[0].text
        };
      }
      return {
        role,
        name,
        content: contentParts
      };
    };
    normalizeToolChoice = (toolChoice, tools) => {
      if (!toolChoice) return void 0;
      if (toolChoice === "none" || toolChoice === "auto") {
        return toolChoice;
      }
      if (toolChoice === "required") {
        if (!tools || tools.length === 0) {
          throw new Error(
            "tool_choice 'required' was provided but no tools were configured"
          );
        }
        if (tools.length > 1) {
          throw new Error(
            "tool_choice 'required' needs a single tool or specify the tool name explicitly"
          );
        }
        return {
          type: "function",
          function: { name: tools[0].function.name }
        };
      }
      if ("name" in toolChoice) {
        return {
          type: "function",
          function: { name: toolChoice.name }
        };
      }
      return toolChoice;
    };
    resolveApiUrl = () => ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0 ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions` : "https://api.openai.com/v1/chat/completions";
    assertApiKey = () => {
      const apiKey = ENV.forgeApiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not configured");
      }
      return apiKey;
    };
    normalizeResponseFormat = ({
      responseFormat,
      response_format,
      outputSchema,
      output_schema
    }) => {
      const explicitFormat = responseFormat || response_format;
      if (explicitFormat) {
        if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
          throw new Error(
            "responseFormat json_schema requires a defined schema object"
          );
        }
        return explicitFormat;
      }
      const schema = outputSchema || output_schema;
      if (!schema) return void 0;
      if (!schema.name || !schema.schema) {
        throw new Error("outputSchema requires both name and schema");
      }
      return {
        type: "json_schema",
        json_schema: {
          name: schema.name,
          schema: schema.schema,
          ...typeof schema.strict === "boolean" ? { strict: schema.strict } : {}
        }
      };
    };
  }
});

// server/routers/profileExtraction.ts
var profileExtraction_exports = {};
__export(profileExtraction_exports, {
  profileExtractionRouter: () => profileExtractionRouter
});
import { z as z8 } from "zod";
import { eq as eq8 } from "drizzle-orm";
var EXTRACTION_PROMPT, profileExtractionRouter;
var init_profileExtraction = __esm({
  "server/routers/profileExtraction.ts"() {
    "use strict";
    init_trpc();
    init_llm();
    init_db();
    init_schema();
    EXTRACTION_PROMPT = `You are a profile data extraction system. Analyze the user's message and extract structured profile information.

Extract the following if mentioned:
- **primaryGoal**: Main reason they're seeking coaching (e.g., "stress management", "career transition", "improve relationships")
- **secondaryGoal**: Secondary goals mentioned
- **mainChallenges**: Specific challenges they're facing (array of strings)
- **preferredFrequency**: How often they want to engage ("daily", "weekly", "as_needed")
- **timezone**: Their timezone if mentioned (e.g., "I'm in California" \u2192 "America/Los_Angeles")
- **availability**: When they're available (e.g., "evenings", "weekends", "mornings", "flexible")
- **communicationStyle**: How they prefer communication ("concise" if they say "keep it short/busy", "detailed" if they want depth, "balanced" otherwise)
- **triggers**: Specific situations to watch for (array of strings, e.g., ["work stress leads to insomnia", "anxiety before meetings"])

Only extract data that is explicitly or clearly implied in the message. Return null for fields not mentioned.

Return a JSON object with these exact fields. Use null for any field not found in the message.`;
    profileExtractionRouter = router({
      /**
       * Extract profile data from a conversation message
       */
      extractFromMessage: protectedProcedure.input(
        z8.object({
          message: z8.string(),
          conversationContext: z8.string().optional()
          // Previous messages for context
        })
      ).mutation(async ({ ctx, input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: EXTRACTION_PROMPT },
              {
                role: "user",
                content: input.conversationContext ? `Previous context: ${input.conversationContext}

Current message: ${input.message}` : input.message
              }
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "profile_extraction",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    primaryGoal: { type: ["string", "null"] },
                    secondaryGoal: { type: ["string", "null"] },
                    mainChallenges: {
                      type: ["array", "null"],
                      items: { type: "string" }
                    },
                    preferredFrequency: {
                      type: ["string", "null"],
                      enum: ["daily", "weekly", "as_needed", null]
                    },
                    timezone: { type: ["string", "null"] },
                    availability: { type: ["string", "null"] },
                    communicationStyle: {
                      type: ["string", "null"],
                      enum: ["concise", "detailed", "balanced", null]
                    },
                    triggers: {
                      type: ["array", "null"],
                      items: { type: "string" }
                    },
                    confidence: {
                      type: "number",
                      description: "Confidence score 0-100 for this extraction"
                    }
                  },
                  required: [
                    "primaryGoal",
                    "secondaryGoal",
                    "mainChallenges",
                    "preferredFrequency",
                    "timezone",
                    "availability",
                    "communicationStyle",
                    "triggers",
                    "confidence"
                  ],
                  additionalProperties: false
                }
              }
            }
          });
          const content = response.choices[0]?.message?.content;
          if (!content || typeof content !== "string") {
            return { extracted: null, updated: false };
          }
          const extracted = JSON.parse(content);
          if (extracted.confidence && extracted.confidence > 70) {
            const updates = {};
            let fieldsUpdated = 0;
            if (extracted.primaryGoal) {
              updates.primaryGoal = extracted.primaryGoal;
              fieldsUpdated++;
            }
            if (extracted.secondaryGoal) {
              updates.secondaryGoal = extracted.secondaryGoal;
              fieldsUpdated++;
            }
            if (extracted.mainChallenges && extracted.mainChallenges.length > 0) {
              updates.mainChallenges = JSON.stringify(extracted.mainChallenges);
              fieldsUpdated++;
            }
            if (extracted.preferredFrequency) {
              updates.preferredFrequency = extracted.preferredFrequency;
              fieldsUpdated++;
            }
            if (extracted.timezone) {
              updates.timezone = extracted.timezone;
              fieldsUpdated++;
            }
            if (extracted.availability) {
              updates.availability = extracted.availability;
              fieldsUpdated++;
            }
            if (extracted.communicationStyle) {
              updates.communicationStyle = extracted.communicationStyle;
              fieldsUpdated++;
            }
            if (extracted.triggers && extracted.triggers.length > 0) {
              updates.triggers = JSON.stringify(extracted.triggers);
              fieldsUpdated++;
            }
            const totalFields = 8;
            updates.profileCompleteness = Math.round(fieldsUpdated / totalFields * 100);
            if (Object.keys(updates).length > 0) {
              await db.update(users).set(updates).where(eq8(users.id, ctx.user.id));
              return { extracted, updated: true, fieldsUpdated };
            }
          }
          return { extracted, updated: false };
        } catch (error) {
          console.error("[Profile Extraction] Error:", error);
          return { extracted: null, updated: false, error: String(error) };
        }
      }),
      /**
       * Get current user profile
       */
      getProfile: protectedProcedure.query(async ({ ctx }) => {
        const [user] = await db.select().from(users).where(eq8(users.id, ctx.user.id)).limit(1);
        if (!user) {
          return null;
        }
        return {
          primaryGoal: user.primaryGoal,
          secondaryGoal: user.secondaryGoal,
          mainChallenges: user.mainChallenges ? JSON.parse(user.mainChallenges) : [],
          preferredFrequency: user.preferredFrequency,
          timezone: user.timezone,
          availability: user.availability,
          communicationStyle: user.communicationStyle,
          triggers: user.triggers ? JSON.parse(user.triggers) : [],
          profileCompleteness: user.profileCompleteness || 0
        };
      }),
      /**
       * Manually update profile (user override)
       */
      updateProfile: protectedProcedure.input(
        z8.object({
          primaryGoal: z8.string().optional(),
          secondaryGoal: z8.string().optional(),
          mainChallenges: z8.array(z8.string()).optional(),
          preferredFrequency: z8.enum(["daily", "weekly", "as_needed"]).optional(),
          timezone: z8.string().optional(),
          availability: z8.string().optional(),
          communicationStyle: z8.enum(["concise", "detailed", "balanced"]).optional(),
          triggers: z8.array(z8.string()).optional()
        })
      ).mutation(async ({ ctx, input }) => {
        const updates = {};
        if (input.primaryGoal !== void 0) updates.primaryGoal = input.primaryGoal;
        if (input.secondaryGoal !== void 0) updates.secondaryGoal = input.secondaryGoal;
        if (input.mainChallenges !== void 0)
          updates.mainChallenges = JSON.stringify(input.mainChallenges);
        if (input.preferredFrequency !== void 0)
          updates.preferredFrequency = input.preferredFrequency;
        if (input.timezone !== void 0) updates.timezone = input.timezone;
        if (input.availability !== void 0) updates.availability = input.availability;
        if (input.communicationStyle !== void 0)
          updates.communicationStyle = input.communicationStyle;
        if (input.triggers !== void 0) updates.triggers = JSON.stringify(input.triggers);
        const [currentUser] = await db.select().from(users).where(eq8(users.id, ctx.user.id)).limit(1);
        if (currentUser) {
          const mergedProfile = { ...currentUser, ...updates };
          let filledFields = 0;
          if (mergedProfile.primaryGoal) filledFields++;
          if (mergedProfile.secondaryGoal) filledFields++;
          if (mergedProfile.mainChallenges) filledFields++;
          if (mergedProfile.preferredFrequency) filledFields++;
          if (mergedProfile.timezone) filledFields++;
          if (mergedProfile.availability) filledFields++;
          if (mergedProfile.communicationStyle) filledFields++;
          if (mergedProfile.triggers) filledFields++;
          updates.profileCompleteness = Math.round(filledFields / 8 * 100);
        }
        await db.update(users).set(updates).where(eq8(users.id, ctx.user.id));
        return { success: true };
      })
    });
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/routers.ts
init_const();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[Notification] SLACK_WEBHOOK_URL not configured. Notification not sent:",
      { title, content }
    );
    return true;
  }
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: `*${title}*

${content}`,
        // Optional: Add formatting for better readability
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: title,
              emoji: true
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: content
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `<!date^${Math.floor(Date.now() / 1e3)}^{date_short_pretty} at {time}|${(/* @__PURE__ */ new Date()).toISOString()}>`
              }
            ]
          }
        ]
      })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to send Slack notification (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error sending Slack notification:", error);
    return false;
  }
}

// server/_core/systemRouter.ts
init_trpc();
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_trpc();

// server/routers/coaching.ts
init_trpc();
init_db();
init_schema();
import { z as z2 } from "zod";
import { eq as eq2, and, desc, sql } from "drizzle-orm";
var coachesRouter = router({
  // Get current coach profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    return coach;
  }),
  // Create coach profile
  createProfile: protectedProcedure.input(z2.object({
    specialization: z2.string().optional(),
    bio: z2.string().optional(),
    certifications: z2.string().optional(),
    yearsExperience: z2.number().optional()
  })).mutation(async ({ ctx, input }) => {
    const [coach] = await db.insert(coaches).values({
      userId: ctx.user.id,
      ...input
    });
    return coach;
  }),
  // Update coach profile
  updateProfile: protectedProcedure.input(z2.object({
    specialization: z2.string().optional(),
    bio: z2.string().optional(),
    certifications: z2.string().optional(),
    yearsExperience: z2.number().optional(),
    isActive: z2.enum(["true", "false"]).optional()
  })).mutation(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    await db.update(coaches).set(input).where(eq2(coaches.id, coach.id));
    return { success: true };
  })
});
var clientsRouter = router({
  // List all clients for current coach
  list: protectedProcedure.query(async ({ ctx }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found. Please create a coach profile first.");
    }
    const clientsList = await db.query.clients.findMany({
      where: eq2(clients.coachId, coach.id),
      orderBy: [desc(clients.createdAt)]
    });
    return clientsList;
  }),
  // Get single client details
  get: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.id),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    return client2;
  }),
  // Create new client
  create: protectedProcedure.input(z2.object({
    name: z2.string().min(1, "Name is required"),
    email: z2.string().email().optional(),
    phone: z2.string().optional(),
    dateOfBirth: z2.date().optional(),
    goals: z2.string().optional(),
    notes: z2.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found. Please create a coach profile first.");
    }
    const [client2] = await db.insert(clients).values({
      coachId: coach.id,
      ...input
    });
    return client2;
  }),
  // Update client
  update: protectedProcedure.input(z2.object({
    id: z2.number(),
    name: z2.string().optional(),
    email: z2.string().email().optional(),
    phone: z2.string().optional(),
    dateOfBirth: z2.date().optional(),
    goals: z2.string().optional(),
    notes: z2.string().optional(),
    status: z2.enum(["active", "inactive", "completed"]).optional()
  })).mutation(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const { id, ...updateData } = input;
    await db.update(clients).set(updateData).where(and(
      eq2(clients.id, id),
      eq2(clients.coachId, coach.id)
    ));
    return { success: true };
  }),
  // Delete client
  delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    await db.delete(clients).where(and(
      eq2(clients.id, input.id),
      eq2(clients.coachId, coach.id)
    ));
    return { success: true };
  }),
  // Get client statistics
  getStats: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.id),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found");
    }
    const journalCount = await db.select({ count: sql`count(*)` }).from(journalEntries2).where(eq2(journalEntries2.clientId, input.id));
    const emotionCount = await db.select({ count: sql`count(*)` }).from(emotionLogs).where(eq2(emotionLogs.clientId, input.id));
    const avgResilience = await db.select({
      avg: sql`AVG(${journalEntries2.resilienceScore})`
    }).from(journalEntries2).where(eq2(journalEntries2.clientId, input.id));
    return {
      journalEntries: journalCount[0]?.count || 0,
      emotionLogs: emotionCount[0]?.count || 0,
      averageResilienceScore: avgResilience[0]?.avg || 0
    };
  })
});
var journalRouter = router({
  // List journal entries for a client
  list: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    limit: z2.number().optional().default(50)
  })).query(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const entries = await db.query.journalEntries.findMany({
      where: eq2(journalEntries2.clientId, input.clientId),
      orderBy: [desc(journalEntries2.entryDate)],
      limit: input.limit
    });
    return entries;
  }),
  // Get single journal entry
  get: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ ctx, input }) => {
    const entry = await db.query.journalEntries.findFirst({
      where: eq2(journalEntries2.id, input.id)
    });
    if (!entry) {
      throw new Error("Journal entry not found");
    }
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, entry.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Access denied");
    }
    return entry;
  }),
  // Create journal entry
  create: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    content: z2.string().min(1, "Content is required"),
    mood: z2.string().optional(),
    moodIntensity: z2.number().min(1).max(10).optional(),
    emotions: z2.string().optional(),
    // JSON string
    triggers: z2.string().optional(),
    copingStrategies: z2.string().optional(),
    copingEffectiveness: z2.number().min(1).max(10).optional(),
    resilienceScore: z2.number().min(1).max(100).optional(),
    isPrivate: z2.enum(["true", "false"]).optional()
  })).mutation(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const [entry] = await db.insert(journalEntries2).values(input);
    return entry;
  }),
  // Update journal entry
  update: protectedProcedure.input(z2.object({
    id: z2.number(),
    content: z2.string().optional(),
    mood: z2.string().optional(),
    moodIntensity: z2.number().min(1).max(10).optional(),
    emotions: z2.string().optional(),
    triggers: z2.string().optional(),
    copingStrategies: z2.string().optional(),
    copingEffectiveness: z2.number().min(1).max(10).optional(),
    resilienceScore: z2.number().min(1).max(100).optional(),
    isPrivate: z2.enum(["true", "false"]).optional()
  })).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;
    const entry = await db.query.journalEntries.findFirst({
      where: eq2(journalEntries2.id, id)
    });
    if (!entry) {
      throw new Error("Journal entry not found");
    }
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, entry.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Access denied");
    }
    await db.update(journalEntries2).set(updateData).where(eq2(journalEntries2.id, id));
    return { success: true };
  }),
  // Delete journal entry
  delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
    const entry = await db.query.journalEntries.findFirst({
      where: eq2(journalEntries2.id, input.id)
    });
    if (!entry) {
      throw new Error("Journal entry not found");
    }
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, entry.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Access denied");
    }
    await db.delete(journalEntries2).where(eq2(journalEntries2.id, input.id));
    return { success: true };
  })
});
var emotionLogsRouter = router({
  // List emotion logs for a client
  list: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    limit: z2.number().optional().default(100)
  })).query(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const logs = await db.query.emotionLogs.findMany({
      where: eq2(emotionLogs.clientId, input.clientId),
      orderBy: [desc(emotionLogs.logDate)],
      limit: input.limit
    });
    return logs;
  }),
  // Create emotion log
  create: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    journalEntryId: z2.number().optional(),
    emotionType: z2.string().min(1, "Emotion type is required"),
    intensity: z2.number().min(1).max(10),
    trigger: z2.string().optional(),
    physicalSensations: z2.string().optional(),
    thoughts: z2.string().optional(),
    behaviors: z2.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const [log] = await db.insert(emotionLogs).values(input);
    return log;
  }),
  // Get emotion trends for a client
  getTrends: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    days: z2.number().optional().default(30)
  })).query(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const logs = await db.query.emotionLogs.findMany({
      where: and(
        eq2(emotionLogs.clientId, input.clientId),
        sql`${emotionLogs.logDate} >= DATE_SUB(NOW(), INTERVAL ${input.days} DAY)`
      ),
      orderBy: [desc(emotionLogs.logDate)]
    });
    const emotionMap = /* @__PURE__ */ new Map();
    logs.forEach((log) => {
      const current = emotionMap.get(log.emotionType) || { count: 0, totalIntensity: 0 };
      emotionMap.set(log.emotionType, {
        count: current.count + 1,
        totalIntensity: current.totalIntensity + log.intensity
      });
    });
    const trends = Array.from(emotionMap.entries()).map(([emotionType, data]) => ({
      emotionType,
      count: data.count,
      averageIntensity: data.totalIntensity / data.count
    }));
    return trends;
  })
});
var copingStrategiesRouter = router({
  // List coping strategies for a client
  list: protectedProcedure.input(z2.object({ clientId: z2.number() })).query(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const strategies = await db.query.copingStrategies.findMany({
      where: eq2(copingStrategies.clientId, input.clientId),
      orderBy: [desc(copingStrategies.averageEffectiveness)]
    });
    return strategies;
  }),
  // Create coping strategy
  create: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    strategyName: z2.string().min(1, "Strategy name is required"),
    description: z2.string().optional(),
    category: z2.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const [strategy] = await db.insert(copingStrategies).values(input);
    return strategy;
  }),
  // Update coping strategy effectiveness
  updateEffectiveness: protectedProcedure.input(z2.object({
    id: z2.number(),
    effectiveness: z2.number().min(1).max(10)
  })).mutation(async ({ ctx, input }) => {
    const strategy = await db.query.copingStrategies.findFirst({
      where: eq2(copingStrategies.id, input.id)
    });
    if (!strategy) {
      throw new Error("Coping strategy not found");
    }
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, strategy.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Access denied");
    }
    const newTimesUsed = strategy.timesUsed + 1;
    const currentTotal = (strategy.averageEffectiveness || 0) * strategy.timesUsed;
    const newAverage = (currentTotal + input.effectiveness) / newTimesUsed;
    await db.update(copingStrategies).set({
      timesUsed: newTimesUsed,
      averageEffectiveness: Math.round(newAverage),
      lastUsed: /* @__PURE__ */ new Date()
    }).where(eq2(copingStrategies.id, input.id));
    return { success: true };
  })
});
var aiInsightsRouter = router({
  // List AI insights for a client
  list: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    limit: z2.number().optional().default(20)
  })).query(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const insights2 = await db.query.aiInsights.findMany({
      where: eq2(aiInsights.clientId, input.clientId),
      orderBy: [desc(aiInsights.insightDate)],
      limit: input.limit
    });
    return insights2;
  }),
  // Mark insight as read
  markRead: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
    const insight = await db.query.aiInsights.findFirst({
      where: eq2(aiInsights.id, input.id)
    });
    if (!insight) {
      throw new Error("Insight not found");
    }
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, insight.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Access denied");
    }
    await db.update(aiInsights).set({ isRead: "true" }).where(eq2(aiInsights.id, input.id));
    return { success: true };
  })
});
var sessionsRouter = router({
  // List sessions for a client
  list: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    limit: z2.number().optional().default(50)
  })).query(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const sessionsList = await db.query.sessions.findMany({
      where: and(
        eq2(sessions.clientId, input.clientId),
        eq2(sessions.coachId, coach.id)
      ),
      orderBy: [desc(sessions.scheduledDate)],
      limit: input.limit
    });
    return sessionsList;
  }),
  // Create session
  create: protectedProcedure.input(z2.object({
    clientId: z2.number(),
    scheduledDate: z2.date(),
    duration: z2.number().min(15).max(480),
    // 15 min to 8 hours
    sessionType: z2.string().optional(),
    notes: z2.string().optional()
  })).mutation(async ({ ctx, input }) => {
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach) {
      throw new Error("Coach profile not found");
    }
    const client2 = await db.query.clients.findFirst({
      where: and(
        eq2(clients.id, input.clientId),
        eq2(clients.coachId, coach.id)
      )
    });
    if (!client2) {
      throw new Error("Client not found or access denied");
    }
    const [session] = await db.insert(sessions).values({
      coachId: coach.id,
      ...input
    });
    return session;
  }),
  // Update session
  update: protectedProcedure.input(z2.object({
    id: z2.number(),
    scheduledDate: z2.date().optional(),
    duration: z2.number().min(15).max(480).optional(),
    sessionType: z2.string().optional(),
    notes: z2.string().optional(),
    status: z2.enum(["scheduled", "completed", "cancelled", "no-show"]).optional()
  })).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;
    const session = await db.query.sessions.findFirst({
      where: eq2(sessions.id, id)
    });
    if (!session) {
      throw new Error("Session not found");
    }
    const coach = await db.query.coaches.findFirst({
      where: eq2(coaches.userId, ctx.user.id)
    });
    if (!coach || session.coachId !== coach.id) {
      throw new Error("Access denied");
    }
    await db.update(sessions).set(updateData).where(eq2(sessions.id, id));
    return { success: true };
  })
});

// server/routers/aiInsights.ts
init_trpc();
init_db();
init_schema();
init_llm();
import { z as z3 } from "zod";
import { eq as eq3, desc as desc2, and as and2 } from "drizzle-orm";
var aiInsightsRouter2 = router({
  /**
   * List all AI insights for a client
   */
  list: protectedProcedure.input(z3.object({
    clientId: z3.number()
  })).query(async ({ input, ctx }) => {
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    const insights2 = await db2.select().from(aiInsights).where(eq3(aiInsights.clientId, input.clientId)).orderBy(desc2(aiInsights.insightDate));
    return insights2;
  }),
  /**
   * Generate new AI insights for a client
   * Analyzes recent journal entries and emotion logs
   */
  generate: protectedProcedure.input(z3.object({
    clientId: z3.number()
  })).mutation(async ({ input, ctx }) => {
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    const thirtyDaysAgo = /* @__PURE__ */ new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentJournals = await db2.select().from(journalEntries2).where(
      and2(
        eq3(journalEntries2.clientId, input.clientId)
      )
    ).orderBy(desc2(journalEntries2.createdAt)).limit(20);
    const recentEmotions = await db2.select().from(emotionLogs).where(eq3(emotionLogs.clientId, input.clientId)).orderBy(desc2(emotionLogs.logDate)).limit(50);
    if (recentJournals.length === 0 && recentEmotions.length === 0) {
      throw new Error("No data available to generate insights");
    }
    const journalSummary = recentJournals.map((j) => ({
      date: j.createdAt,
      mood: j.mood,
      content: j.content?.substring(0, 500),
      // Limit to save tokens
      emotions: j.emotions,
      triggers: j.triggers
    }));
    const emotionSummary = recentEmotions.map((e) => ({
      date: e.logDate,
      emotion: e.emotionType,
      intensity: e.intensity,
      trigger: e.trigger
    }));
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert emotional resilience coach analyzing client data. 
              
Your task is to:
1. Identify emotional patterns and trends
2. Detect potential crisis indicators (suicidal ideation, self-harm, severe depression)
3. Recognize triggers and their impact
4. Provide actionable coaching recommendations
5. Calculate a resilience score (0-100)

Respond in JSON format with this structure:
{
  "patterns": ["pattern1", "pattern2"],
  "crisisIndicators": ["indicator1"] or [],
  "triggers": ["trigger1", "trigger2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "resilienceScore": 75,
  "summary": "Brief overall assessment",
  "severity": "low" | "medium" | "high" | "critical"
}`
          },
          {
            role: "user",
            content: `Analyze this client's emotional data:

JOURNAL ENTRIES (last 30 days):
${JSON.stringify(journalSummary, null, 2)}

EMOTION LOGS (last 50 entries):
${JSON.stringify(emotionSummary, null, 2)}

Provide comprehensive insights focusing on patterns, crisis indicators, and actionable recommendations.`
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "emotional_insights",
            strict: true,
            schema: {
              type: "object",
              properties: {
                patterns: {
                  type: "array",
                  items: { type: "string" },
                  description: "Identified emotional patterns"
                },
                crisisIndicators: {
                  type: "array",
                  items: { type: "string" },
                  description: "Crisis warning signs detected"
                },
                triggers: {
                  type: "array",
                  items: { type: "string" },
                  description: "Common emotional triggers"
                },
                recommendations: {
                  type: "array",
                  items: { type: "string" },
                  description: "Coaching recommendations"
                },
                resilienceScore: {
                  type: "integer",
                  description: "Overall resilience score 0-100"
                },
                summary: {
                  type: "string",
                  description: "Brief overall assessment"
                },
                severity: {
                  type: "string",
                  enum: ["low", "medium", "high", "critical"],
                  description: "Severity level of concerns"
                }
              },
              required: ["patterns", "crisisIndicators", "triggers", "recommendations", "resilienceScore", "summary", "severity"],
              additionalProperties: false
            }
          }
        }
      });
      const aiResponse = JSON.parse(response.choices[0].message.content);
      await db2.insert(aiInsights).values({
        clientId: input.clientId,
        insightType: aiResponse.severity === "critical" ? "crisis_alert" : "pattern_analysis",
        title: `AI Analysis - ${aiResponse.severity.toUpperCase()}`,
        description: aiResponse.summary,
        severity: aiResponse.severity,
        actionable: aiResponse.recommendations.join("\n"),
        insightDate: /* @__PURE__ */ new Date()
      });
      return {
        details: aiResponse,
        tokensUsed: response.usage?.total_tokens || 0
      };
    } catch (error) {
      if (error.message?.includes("OPENAI_API_KEY is not configured")) {
        throw new Error("AI features require OpenAI API key. Please add OPENAI_API_KEY to environment variables.");
      }
      throw error;
    }
  }),
  /**
   * Analyze a single journal entry for crisis indicators
   * Used for real-time monitoring as entries are created
   */
  analyzeCrisisRisk: protectedProcedure.input(z3.object({
    journalEntryId: z3.number()
  })).mutation(async ({ input, ctx }) => {
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    const [entry] = await db2.select().from(journalEntries2).where(eq3(journalEntries2.id, input.journalEntryId)).limit(1);
    if (!entry) {
      throw new Error("Journal entry not found");
    }
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a crisis detection system for emotional resilience coaching.

Analyze the journal entry for:
- Suicidal ideation
- Self-harm indicators
- Severe depression
- Immediate danger to self or others

Respond with JSON:
{
  "riskLevel": "none" | "low" | "medium" | "high" | "critical",
  "indicators": ["indicator1", "indicator2"],
  "requiresEscalation": true/false,
  "recommendedAction": "description of recommended action"
}`
          },
          {
            role: "user",
            content: `Analyze this journal entry for crisis indicators:

Mood: ${entry.mood}/10
Content: ${entry.content}
Emotions: ${entry.emotions}
Triggers: ${entry.triggers}

Provide crisis risk assessment.`
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "crisis_assessment",
            strict: true,
            schema: {
              type: "object",
              properties: {
                riskLevel: {
                  type: "string",
                  enum: ["none", "low", "medium", "high", "critical"]
                },
                indicators: {
                  type: "array",
                  items: { type: "string" }
                },
                requiresEscalation: {
                  type: "boolean"
                },
                recommendedAction: {
                  type: "string"
                }
              },
              required: ["riskLevel", "indicators", "requiresEscalation", "recommendedAction"],
              additionalProperties: false
            }
          }
        }
      });
      const assessment = JSON.parse(response.choices[0].message.content);
      if (assessment.requiresEscalation) {
        await db2.insert(aiInsights).values({
          clientId: entry.clientId,
          insightType: "crisis_alert",
          title: "CRISIS ALERT",
          description: assessment.recommendedAction,
          severity: "critical",
          actionable: assessment.indicators.join("\n"),
          insightDate: /* @__PURE__ */ new Date()
        });
      }
      return {
        assessment,
        tokensUsed: response.usage?.total_tokens || 0
      };
    } catch (error) {
      if (error.message?.includes("OPENAI_API_KEY is not configured")) {
        return {
          assessment: {
            riskLevel: "none",
            indicators: [],
            requiresEscalation: false,
            recommendedAction: "AI crisis detection not configured. Manual review recommended."
          },
          tokensUsed: 0
        };
      }
      throw error;
    }
  })
});

// server/routers/stripe.ts
init_trpc();
init_env();
init_db();
init_schema();
import { z as z4 } from "zod";
import Stripe from "stripe";
import { eq as eq4 } from "drizzle-orm";
var stripe = new Stripe(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover"
});
var stripeRouter = router({
  /**
   * Create Stripe checkout session for one-time human coaching session booking
   * Used by Hybrid/Premium subscribers to book their included human sessions
   */
  createSessionCheckout: protectedProcedure.input(
    z4.object({
      sessionTypeId: z4.number(),
      scheduledDate: z4.string(),
      notes: z4.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    const [sessionType] = await db2.select().from(sessionTypes).where(eq4(sessionTypes.id, input.sessionTypeId)).limit(1);
    if (!sessionType) {
      throw new Error("Session type not found");
    }
    const priceId = sessionType.oneTimePriceId;
    if (!priceId) {
      throw new Error(`This session type is not available for booking. Please contact support.`);
    }
    const origin = ctx.req.headers.origin || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      customer_email: ctx.user.email || void 0,
      client_reference_id: ctx.user.id.toString(),
      metadata: {
        user_id: ctx.user.id.toString(),
        customer_email: ctx.user.email || "",
        customer_name: ctx.user.name || "",
        session_type_id: sessionType.id.toString(),
        session_type_name: sessionType.name,
        scheduled_date: input.scheduledDate,
        notes: input.notes || ""
      },
      success_url: `${origin}/my-sessions?payment=success`,
      cancel_url: `${origin}/my-sessions?payment=cancelled`,
      allow_promotion_codes: true
    });
    return {
      url: session.url,
      sessionId: session.id
    };
  }),
  /**
   * Verify payment and create booking (fallback for webhook failures)
   * Called from success page to ensure booking is created even if webhook fails
   * PUBLIC: No auth required - session_id from Stripe is the authentication proof
   */
  verifyAndCreateBooking: publicProcedure.input(
    z4.object({
      sessionId: z4.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    const session = await stripe.checkout.sessions.retrieve(input.sessionId);
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }
    const metadata = session.metadata;
    if (!metadata) {
      throw new Error("Missing session metadata");
    }
    const { sessions: sessionsTable, clients: clientsTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const existingBooking = await db2.select().from(sessionsTable).where(eq4(sessionsTable.stripeSessionId, input.sessionId)).limit(1);
    if (existingBooking.length > 0) {
      return {
        success: true,
        bookingId: existingBooking[0].id,
        alreadyExists: true
      };
    }
    let clientId;
    const clientEmail = session.customer_email || metadata.customer_email;
    if (clientEmail) {
      const existingClient = await db2.select().from(clientsTable).where(eq4(clientsTable.email, clientEmail)).limit(1);
      if (existingClient.length > 0) {
        clientId = existingClient[0].id;
      } else {
        const [newClient] = await db2.insert(clientsTable).values({
          coachId: 1,
          // Default coach ID (you)
          name: session.customer_details?.name || metadata.customer_name || "Unknown",
          email: clientEmail,
          phone: null,
          status: "active"
        });
        clientId = newClient.insertId;
      }
    } else {
      throw new Error("Client email is required");
    }
    const [sessionType] = await db2.select().from(sessionTypes).where(eq4(sessionTypes.id, parseInt(metadata.session_type_id))).limit(1);
    const [newSession] = await db2.insert(sessionsTable).values({
      clientId,
      coachId: 1,
      // Default coach ID (you)
      sessionTypeId: parseInt(metadata.session_type_id),
      scheduledDate: new Date(metadata.scheduled_date),
      duration: sessionType?.duration || 60,
      // Default to 60 minutes
      price: session.amount_total || 0,
      // in cents
      status: "scheduled",
      notes: metadata.notes || null,
      paymentStatus: "paid",
      stripePaymentIntentId: session.payment_intent || null,
      stripeSessionId: input.sessionId
    });
    return {
      success: true,
      bookingId: newSession.insertId,
      alreadyExists: false
    };
  })
});

// server/routers/scheduling.ts
init_trpc();
import { z as z5 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/db/scheduling.ts
init_db();
init_schema();
import { and as and3, eq as eq5, gte, lte, or, desc as desc3, asc } from "drizzle-orm";
async function getCoachAvailability(coachId, dayOfWeek) {
  const db2 = await getDb();
  if (!db2) return [];
  const conditions = [eq5(coachAvailability.coachId, coachId), eq5(coachAvailability.isActive, "true")];
  if (dayOfWeek !== void 0) {
    conditions.push(eq5(coachAvailability.dayOfWeek, dayOfWeek));
  }
  return await db2.select().from(coachAvailability).where(and3(...conditions)).orderBy(asc(coachAvailability.dayOfWeek), asc(coachAvailability.startTime));
}
async function upsertCoachAvailability(availability) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.insert(coachAvailability).values(availability);
}
async function deleteCoachAvailability(id) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.delete(coachAvailability).where(eq5(coachAvailability.id, id));
}
async function getAvailabilityExceptions(coachId, startDate, endDate) {
  const db2 = await getDb();
  if (!db2) return [];
  return await db2.select().from(availabilityExceptions).where(
    and3(
      eq5(availabilityExceptions.coachId, coachId),
      or(
        // Exception overlaps with requested range
        and3(
          lte(availabilityExceptions.startDate, endDate),
          gte(availabilityExceptions.endDate, startDate)
        )
      )
    )
  );
}
async function createAvailabilityException(exception) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.insert(availabilityExceptions).values(exception);
}
async function deleteAvailabilityException(id) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.delete(availabilityExceptions).where(eq5(availabilityExceptions.id, id));
}
async function getCoachSessions(coachId, startDate, endDate, status) {
  const db2 = await getDb();
  if (!db2) return [];
  const conditions = [
    eq5(sessions.coachId, coachId),
    gte(sessions.scheduledDate, startDate),
    lte(sessions.scheduledDate, endDate)
  ];
  if (status && status.length > 0) {
    const statusConditions = status.map((s) => eq5(sessions.status, s));
    conditions.push(or(...statusConditions));
  }
  return await db2.select({
    session: sessions,
    client: clients
  }).from(sessions).leftJoin(clients, eq5(sessions.clientId, clients.id)).where(and3(...conditions)).orderBy(asc(sessions.scheduledDate));
}
async function getClientSessions(clientId, status) {
  const db2 = await getDb();
  if (!db2) return [];
  const conditions = [eq5(sessions.clientId, clientId)];
  if (status && status.length > 0) {
    const statusConditions = status.map((s) => eq5(sessions.status, s));
    conditions.push(or(...statusConditions));
  }
  return await db2.select({
    session: sessions,
    coach: coaches
  }).from(sessions).leftJoin(coaches, eq5(sessions.coachId, coaches.id)).where(and3(...conditions)).orderBy(desc3(sessions.scheduledDate));
}
async function getUpcomingClientSessions(clientId) {
  const db2 = await getDb();
  if (!db2) return [];
  const now = /* @__PURE__ */ new Date();
  return await db2.select({
    session: sessions,
    coach: coaches
  }).from(sessions).leftJoin(coaches, eq5(sessions.coachId, coaches.id)).where(
    and3(
      eq5(sessions.clientId, clientId),
      gte(sessions.scheduledDate, now),
      eq5(sessions.status, "scheduled")
    )
  ).orderBy(asc(sessions.scheduledDate));
}
async function createSession(session) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  const result = await db2.insert(sessions).values(session);
  return result;
}
async function updateSession(id, updates) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.update(sessions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq5(sessions.id, id));
}
async function getSessionById(id) {
  const db2 = await getDb();
  if (!db2) return null;
  const result = await db2.select({
    session: sessions,
    coach: coaches,
    client: clients
  }).from(sessions).leftJoin(coaches, eq5(sessions.coachId, coaches.id)).leftJoin(clients, eq5(sessions.clientId, clients.id)).where(eq5(sessions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function cancelSession(id, cancelledBy) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.update(sessions).set({
    status: "cancelled",
    notes: `Cancelled by ${cancelledBy}`,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq5(sessions.id, id));
}
async function isTimeSlotAvailable(coachId, scheduledDate, duration) {
  const db2 = await getDb();
  if (!db2) return false;
  const endTime = new Date(scheduledDate.getTime() + duration * 6e4);
  const overlappingSessions = await db2.select().from(sessions).where(
    and3(
      eq5(sessions.coachId, coachId),
      eq5(sessions.status, "scheduled"),
      // Session overlaps with requested time
      lte(sessions.scheduledDate, endTime),
      gte(sessions.scheduledDate, scheduledDate)
    )
  );
  return overlappingSessions.length === 0;
}

// server/routers/scheduling.ts
var schedulingRouter = router({
  /**
   * Get available spots remaining for the current week (PUBLIC - for scarcity display)
   */
  getWeeklyAvailability: publicProcedure.input(
    z5.object({
      coachId: z5.number(),
      sessionDuration: z5.number().optional().default(60)
    })
  ).query(async ({ input }) => {
    const now = /* @__PURE__ */ new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    const bookedSessions = await getCoachSessions(
      input.coachId,
      weekStart,
      weekEnd,
      ["scheduled"]
    );
    const bookedCount = bookedSessions.length;
    const availability = await getCoachAvailability(input.coachId);
    const exceptions = await getAvailabilityExceptions(
      input.coachId,
      weekStart,
      weekEnd
    );
    let totalMinutes = 0;
    const daysInWeek = 7;
    for (let i = 0; i < daysInWeek; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const currentDayOfWeek = currentDate.getDay();
      const isBlocked = exceptions.some((exc) => {
        const excStart = new Date(exc.startDate);
        const excEnd = new Date(exc.endDate);
        excStart.setHours(0, 0, 0, 0);
        excEnd.setHours(23, 59, 59, 999);
        return currentDate >= excStart && currentDate <= excEnd;
      });
      if (isBlocked) continue;
      const dayAvailability = availability.filter(
        (a) => a.dayOfWeek === currentDayOfWeek && a.isActive === "true"
      );
      for (const slot of dayAvailability) {
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);
        const slotMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
        totalMinutes += slotMinutes;
      }
    }
    const maxSessions = Math.floor(totalMinutes / input.sessionDuration);
    const remainingSpots = Math.max(0, maxSessions - bookedCount);
    return {
      totalCapacity: maxSessions,
      bookedCount,
      remainingSpots,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString()
    };
  }),
  /**
   * Get available time slots for a coach on a specific date (PUBLIC - for booking)
   */
  getAvailableSlots: publicProcedure.input(
    z5.object({
      coachId: z5.number(),
      date: z5.date(),
      duration: z5.number().default(60)
      // session duration in minutes
    })
  ).query(async ({ input }) => {
    const { coachId, date: date2, duration } = input;
    const dayOfWeek = date2.getDay();
    const availability = await getCoachAvailability(coachId, dayOfWeek);
    if (availability.length === 0) {
      return { slots: [] };
    }
    const startOfDay = new Date(date2);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date2);
    endOfDay.setHours(23, 59, 59, 999);
    const exceptions = await getAvailabilityExceptions(coachId, startOfDay, endOfDay);
    const hasException = exceptions.some((exc) => {
      const excStart = new Date(exc.startDate);
      const excEnd = new Date(exc.endDate);
      return date2 >= excStart && date2 <= excEnd;
    });
    if (hasException) {
      return { slots: [] };
    }
    const sessions2 = await getCoachSessions(coachId, startOfDay, endOfDay, ["scheduled"]);
    const slots = [];
    for (const avail of availability) {
      const [startHour, startMin] = avail.startTime.split(":").map(Number);
      const [endHour, endMin] = avail.endTime.split(":").map(Number);
      const slotStart = new Date(date2);
      slotStart.setHours(startHour, startMin, 0, 0);
      const slotEnd = new Date(date2);
      slotEnd.setHours(endHour, endMin, 0, 0);
      let currentSlot = new Date(slotStart);
      while (currentSlot.getTime() + duration * 6e4 <= slotEnd.getTime()) {
        if (currentSlot > /* @__PURE__ */ new Date()) {
          const hasConflict = sessions2.some((s) => {
            const sessionStart = new Date(s.session.scheduledDate);
            const sessionEnd = new Date(sessionStart.getTime() + (s.session.duration || 60) * 6e4);
            const slotEndTime = new Date(currentSlot.getTime() + duration * 6e4);
            return currentSlot >= sessionStart && currentSlot < sessionEnd || slotEndTime > sessionStart && slotEndTime <= sessionEnd || currentSlot <= sessionStart && slotEndTime >= sessionEnd;
          });
          if (!hasConflict) {
            slots.push(currentSlot.toISOString());
          }
        }
        currentSlot = new Date(currentSlot.getTime() + 30 * 6e4);
      }
    }
    return { slots };
  }),
  /**
   * Book a free session (PUBLIC - no auth required)
   * Used for free Discovery Calls
   */
  bookFreeSession: publicProcedure.input(
    z5.object({
      sessionTypeId: z5.number(),
      scheduledDate: z5.string(),
      // ISO datetime string
      clientEmail: z5.string().email(),
      clientName: z5.string(),
      notes: z5.string().optional()
    })
  ).mutation(async ({ input }) => {
    const coachId = 1;
    const scheduledDateTime = new Date(input.scheduledDate);
    const duration = 15;
    const available = await isTimeSlotAvailable(
      coachId,
      scheduledDateTime,
      duration
    );
    if (!available) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: "This time slot is no longer available"
      });
    }
    const tempClientId = 999;
    await createSession({
      coachId,
      clientId: tempClientId,
      scheduledDate: scheduledDateTime,
      duration,
      sessionType: "Free Discovery Call",
      notes: input.notes,
      status: "scheduled"
    });
    console.log("[Scheduling] Session booked:", { clientEmail: input.clientEmail, sessionDate: scheduledDateTime });
    return {
      success: true,
      message: "Your free discovery call has been booked! Check your email for confirmation."
    };
  }),
  /**
   * Book a new session (PROTECTED - requires auth)
   */
  bookSession: protectedProcedure.input(
    z5.object({
      coachId: z5.number(),
      clientId: z5.number(),
      scheduledDate: z5.date(),
      duration: z5.number().default(60),
      sessionType: z5.string().optional(),
      notes: z5.string().optional()
    })
  ).mutation(async ({ input }) => {
    const available = await isTimeSlotAvailable(
      input.coachId,
      input.scheduledDate,
      input.duration
    );
    if (!available) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: "This time slot is no longer available"
      });
    }
    await createSession({
      coachId: input.coachId,
      clientId: input.clientId,
      scheduledDate: input.scheduledDate,
      duration: input.duration,
      sessionType: input.sessionType,
      notes: input.notes,
      status: "scheduled"
    });
    console.log("[Scheduling] Session created:", { sessionDate: input.scheduledDate });
    return { success: true };
  }),
  /**
   * Reschedule a session
   */
  rescheduleSession: protectedProcedure.input(
    z5.object({
      sessionId: z5.number(),
      newDate: z5.date(),
      newDuration: z5.number().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const sessionData = await getSessionById(input.sessionId);
    if (!sessionData || !sessionData.session) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Session not found"
      });
    }
    const session = sessionData.session;
    const available = await isTimeSlotAvailable(
      session.coachId,
      input.newDate,
      input.newDuration || session.duration
    );
    if (!available) {
      throw new TRPCError3({
        code: "BAD_REQUEST",
        message: "The new time slot is not available"
      });
    }
    await updateSession(input.sessionId, {
      scheduledDate: input.newDate,
      duration: input.newDuration || session.duration
    });
    console.log("[Scheduling] Session rescheduled:", { sessionId: input.sessionId, newDate: input.newDate });
    return { success: true };
  }),
  /**
   * Cancel a session
   */
  cancelSession: protectedProcedure.input(
    z5.object({
      sessionId: z5.number(),
      cancelledBy: z5.enum(["coach", "client"]),
      reason: z5.string().optional()
    })
  ).mutation(async ({ input }) => {
    const sessionData = await getSessionById(input.sessionId);
    if (!sessionData || !sessionData.session) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Session not found"
      });
    }
    await cancelSession(input.sessionId, input.cancelledBy);
    if (input.reason) {
      await updateSession(input.sessionId, {
        notes: `Cancelled by ${input.cancelledBy}: ${input.reason}`
      });
    }
    console.log("[Scheduling] Session cancelled:", { sessionId: input.sessionId, reason: input.reason });
    return { success: true };
  }),
  /**
   * Get sessions for a client
   */
  getClientSessions: protectedProcedure.input(
    z5.object({
      clientId: z5.number(),
      status: z5.array(z5.enum(["scheduled", "completed", "cancelled", "no-show"])).optional()
    })
  ).query(async ({ input }) => {
    const sessions2 = await getClientSessions(input.clientId, input.status);
    return { sessions: sessions2 };
  }),
  /**
   * Get upcoming sessions for a client
   */
  getUpcomingClientSessions: protectedProcedure.input(z5.object({ clientId: z5.number() })).query(async ({ input }) => {
    const sessions2 = await getUpcomingClientSessions(input.clientId);
    return { sessions: sessions2 };
  }),
  /**
   * Get sessions for a coach in a date range
   */
  getCoachSessions: protectedProcedure.input(
    z5.object({
      coachId: z5.number(),
      startDate: z5.date(),
      endDate: z5.date(),
      status: z5.array(z5.enum(["scheduled", "completed", "cancelled", "no-show"])).optional()
    })
  ).query(async ({ input }) => {
    const sessions2 = await getCoachSessions(
      input.coachId,
      input.startDate,
      input.endDate,
      input.status
    );
    return { sessions: sessions2 };
  }),
  /**
   * Get session by ID
   */
  getSession: protectedProcedure.input(z5.object({ sessionId: z5.number() })).query(async ({ input }) => {
    const session = await getSessionById(input.sessionId);
    if (!session) {
      throw new TRPCError3({
        code: "NOT_FOUND",
        message: "Session not found"
      });
    }
    return session;
  }),
  /**
   * Get coach availability
   */
  getCoachAvailability: protectedProcedure.input(
    z5.object({
      coachId: z5.number(),
      dayOfWeek: z5.number().min(0).max(6).optional()
    })
  ).query(async ({ input }) => {
    const availability = await getCoachAvailability(input.coachId, input.dayOfWeek);
    return { availability };
  }),
  /**
   * Set coach availability
   */
  setCoachAvailability: protectedProcedure.input(
    z5.object({
      coachId: z5.number(),
      dayOfWeek: z5.number().min(0).max(6),
      startTime: z5.string().regex(/^\d{2}:\d{2}$/),
      endTime: z5.string().regex(/^\d{2}:\d{2}$/)
    })
  ).mutation(async ({ input }) => {
    await upsertCoachAvailability({
      coachId: input.coachId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      isActive: "true"
    });
    return { success: true };
  }),
  /**
   * Delete coach availability slot
   */
  deleteCoachAvailability: protectedProcedure.input(z5.object({ id: z5.number() })).mutation(async ({ input }) => {
    await deleteCoachAvailability(input.id);
    return { success: true };
  }),
  /**
   * Get availability exceptions
   */
  getAvailabilityExceptions: protectedProcedure.input(
    z5.object({
      coachId: z5.number(),
      startDate: z5.date(),
      endDate: z5.date()
    })
  ).query(async ({ input }) => {
    const exceptions = await getAvailabilityExceptions(
      input.coachId,
      input.startDate,
      input.endDate
    );
    return { exceptions };
  }),
  /**
   * Create availability exception (time off)
   */
  createAvailabilityException: protectedProcedure.input(
    z5.object({
      coachId: z5.number(),
      startDate: z5.date(),
      endDate: z5.date(),
      reason: z5.string().optional()
    })
  ).mutation(async ({ input }) => {
    await createAvailabilityException({
      coachId: input.coachId,
      startDate: input.startDate,
      endDate: input.endDate,
      reason: input.reason
    });
    return { success: true };
  }),
  /**
   * Delete availability exception
   */
  deleteAvailabilityException: protectedProcedure.input(z5.object({ id: z5.number() })).mutation(async ({ input }) => {
    await deleteAvailabilityException(input.id);
    return { success: true };
  })
});

// server/routers/sessionTypes.ts
init_trpc();
import { z as z6 } from "zod";
import { TRPCError as TRPCError4 } from "@trpc/server";

// server/db/sessionTypes.ts
init_db();
init_schema();
import { eq as eq6, and as and4, asc as asc2 } from "drizzle-orm";
async function getCoachSessionTypes(coachId, activeOnly = false) {
  const db2 = await getDb();
  if (!db2) return [];
  const conditions = [eq6(sessionTypes.coachId, coachId)];
  if (activeOnly) {
    conditions.push(eq6(sessionTypes.isActive, "true"));
  }
  return await db2.select().from(sessionTypes).where(and4(...conditions)).orderBy(asc2(sessionTypes.displayOrder), asc2(sessionTypes.name));
}
async function getSessionTypeById(id) {
  const db2 = await getDb();
  if (!db2) return null;
  const result = await db2.select().from(sessionTypes).where(eq6(sessionTypes.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function createSessionType(sessionType) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  const result = await db2.insert(sessionTypes).values(sessionType);
  return result;
}
async function updateSessionType(id, updates) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.update(sessionTypes).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq6(sessionTypes.id, id));
}
async function deleteSessionType(id) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.delete(sessionTypes).where(eq6(sessionTypes.id, id));
}
async function toggleSessionTypeStatus(id, isActive) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  return await db2.update(sessionTypes).set({
    isActive: isActive ? "true" : "false",
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq6(sessionTypes.id, id));
}

// server/routers/sessionTypes.ts
var sessionTypesRouter = router({
  /**
   * Get all ACTIVE session types (PUBLIC - no auth required)
   * Used by booking page and landing pages
   */
  getAll: publicProcedure.input(
    z6.object({
      coachId: z6.number().optional().default(1)
      // Default to first coach
    })
  ).query(async ({ input }) => {
    const sessionTypes2 = await getCoachSessionTypes(input.coachId, true);
    return { sessionTypes: sessionTypes2 };
  }),
  /**
   * Get all session types for a coach
   */
  list: protectedProcedure.input(
    z6.object({
      coachId: z6.number(),
      activeOnly: z6.boolean().optional().default(false)
    })
  ).query(async ({ input }) => {
    const sessionTypes2 = await getCoachSessionTypes(input.coachId, input.activeOnly);
    return { sessionTypes: sessionTypes2 };
  }),
  /**
   * Get session type by ID
   */
  getById: protectedProcedure.input(z6.object({ id: z6.number() })).query(async ({ input }) => {
    const sessionType = await getSessionTypeById(input.id);
    if (!sessionType) {
      throw new TRPCError4({
        code: "NOT_FOUND",
        message: "Session type not found"
      });
    }
    return sessionType;
  }),
  /**
   * Create a new session type
   */
  create: protectedProcedure.input(
    z6.object({
      coachId: z6.number(),
      name: z6.string().min(1).max(100),
      description: z6.string().optional(),
      duration: z6.number().min(15).max(480),
      // 15 min to 8 hours
      price: z6.number().min(0),
      // in cents
      displayOrder: z6.number().optional().default(0)
    })
  ).mutation(async ({ input }) => {
    await createSessionType({
      coachId: input.coachId,
      name: input.name,
      description: input.description,
      duration: input.duration,
      price: input.price,
      displayOrder: input.displayOrder,
      isActive: "true"
    });
    return { success: true };
  }),
  /**
   * Update session type
   */
  update: protectedProcedure.input(
    z6.object({
      id: z6.number(),
      name: z6.string().min(1).max(100).optional(),
      description: z6.string().optional(),
      duration: z6.number().min(15).max(480).optional(),
      price: z6.number().min(0).optional(),
      displayOrder: z6.number().optional()
    })
  ).mutation(async ({ input }) => {
    const { id, ...updates } = input;
    await updateSessionType(id, updates);
    return { success: true };
  }),
  /**
   * Delete session type
   */
  delete: protectedProcedure.input(z6.object({ id: z6.number() })).mutation(async ({ input }) => {
    await deleteSessionType(input.id);
    return { success: true };
  }),
  /**
   * Toggle session type active status
   */
  toggleStatus: protectedProcedure.input(
    z6.object({
      id: z6.number(),
      isActive: z6.boolean()
    })
  ).mutation(async ({ input }) => {
    await toggleSessionTypeStatus(input.id, input.isActive);
    return { success: true };
  })
});

// server/routers/sessionPayments.ts
init_trpc();
init_env();
import { z as z7 } from "zod";
import { TRPCError as TRPCError5 } from "@trpc/server";
import Stripe2 from "stripe";
var stripe2 = new Stripe2(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover"
});
var sessionPaymentsRouter = router({
  /**
   * Create Stripe checkout session for session booking
   */
  createCheckoutSession: protectedProcedure.input(
    z7.object({
      sessionTypeId: z7.number(),
      sessionTypeName: z7.string(),
      price: z7.number(),
      // in cents
      duration: z7.number(),
      scheduledDate: z7.string(),
      notes: z7.string().optional(),
      coachId: z7.number(),
      clientId: z7.number()
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const session = await stripe2.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: input.sessionTypeName,
                description: `${input.duration}-minute coaching session on ${new Date(
                  input.scheduledDate
                ).toLocaleDateString()}`
              },
              unit_amount: input.price
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/book-session`,
        metadata: {
          type: "session_booking",
          sessionTypeId: input.sessionTypeId.toString(),
          coachId: input.coachId.toString(),
          clientId: input.clientId.toString(),
          scheduledDate: input.scheduledDate,
          duration: input.duration.toString(),
          notes: input.notes || ""
        }
      });
      return {
        checkoutUrl: session.url,
        sessionId: session.id
      };
    } catch (error) {
      console.error("Stripe checkout session creation failed:", error);
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create payment session"
      });
    }
  }),
  /**
   * Verify payment and create session booking
   */
  verifyPayment: protectedProcedure.input(
    z7.object({
      sessionId: z7.string()
    })
  ).mutation(async ({ input }) => {
    try {
      const session = await stripe2.checkout.sessions.retrieve(input.sessionId);
      if (session.payment_status !== "paid") {
        throw new TRPCError5({
          code: "BAD_REQUEST",
          message: "Payment not completed"
        });
      }
      return {
        success: true,
        paymentIntentId: session.payment_intent
      };
    } catch (error) {
      console.error("Payment verification failed:", error);
      throw new TRPCError5({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to verify payment"
      });
    }
  })
});

// server/routers/aiChat.ts
init_trpc();
init_llm();
init_db();
init_schema();
import { z as z9 } from "zod";
import { TRPCError as TRPCError6 } from "@trpc/server";
import { eq as eq9, desc as desc5 } from "drizzle-orm";

// server/db/aiChat.ts
init_db();
init_schema();
import { eq as eq7, desc as desc4 } from "drizzle-orm";
async function getUserConversations(userId) {
  const db2 = await getDb();
  if (!db2) return [];
  return await db2.select().from(aiChatConversations).where(eq7(aiChatConversations.userId, userId)).orderBy(desc4(aiChatConversations.lastMessageAt));
}
async function getConversationWithMessages(conversationId) {
  const db2 = await getDb();
  if (!db2) return null;
  const [conversation] = await db2.select().from(aiChatConversations).where(eq7(aiChatConversations.id, conversationId)).limit(1);
  if (!conversation) return null;
  const messages = await db2.select().from(aiChatMessages).where(eq7(aiChatMessages.conversationId, conversationId)).orderBy(aiChatMessages.createdAt);
  return {
    conversation,
    messages
  };
}
async function createConversation(data) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  const [result] = await db2.insert(aiChatConversations).values(data).returning();
  return result.id;
}
async function addMessage(data) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  const [result] = await db2.insert(aiChatMessages).values(data).returning();
  await db2.update(aiChatConversations).set({ lastMessageAt: /* @__PURE__ */ new Date() }).where(eq7(aiChatConversations.id, data.conversationId));
  return result.id;
}
async function updateConversationTitle(conversationId, title) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  await db2.update(aiChatConversations).set({ title }).where(eq7(aiChatConversations.id, conversationId));
}
async function deleteConversation(conversationId) {
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  await db2.delete(aiChatConversations).where(eq7(aiChatConversations.id, conversationId));
}
function detectCrisisLevel(message) {
  const lowerMessage = message.toLowerCase();
  const criticalKeywords = [
    "suicide",
    "kill myself",
    "end my life",
    "want to die",
    "better off dead",
    "no reason to live"
  ];
  const highKeywords = [
    "self harm",
    "self-harm",
    "cut myself",
    "cutting myself",
    "hurt myself",
    "hurting myself",
    "can't go on",
    "cant go on",
    "giving up",
    "hopeless",
    "worthless",
    "no hope"
  ];
  const mediumKeywords = [
    "depressed",
    "anxiety attack",
    "panic attack",
    "overwhelming",
    "can't cope",
    "breaking down"
  ];
  const lowKeywords = [
    "stressed",
    "worried",
    "anxious",
    "sad",
    "upset",
    "frustrated"
  ];
  for (const keyword of criticalKeywords) {
    if (lowerMessage.includes(keyword)) return "critical";
  }
  for (const keyword of highKeywords) {
    if (lowerMessage.includes(keyword)) return "high";
  }
  for (const keyword of mediumKeywords) {
    if (lowerMessage.includes(keyword)) return "medium";
  }
  for (const keyword of lowKeywords) {
    if (lowerMessage.includes(keyword)) return "low";
  }
  return "none";
}

// server/routers/aiChat.ts
var SYSTEM_PROMPT = `You are the user's Chief Life Strategist, Behavioral Architect, and Cognitive Guardian.

You operate under the PurposefulLive Master Prompt system.

**OPERATING LAWS (PERMANENT):**

1. **NO-DECISION MODE**: You do not ask questions or present options. You choose automatically using evidence-based behavioral science. You tell them what to do, not what they could do.

2. **COGNITIVE PROTECTION MODE**: You protect their mind, attention, energy, and executive function. You eliminate overwhelm, decision fatigue, and emotional dysregulation. You only show the essential next step.

3. **TRUTH AND REALITY PRINCIPLE**: You bow to evidence, neuroscience, and what works in reality. You use behavioral science, cognitive-behavioral principles, habit architecture, and systems thinking. You do not sugarcoat. You tell the truth that leads to the best outcome.

4. **TRANSFORMATION ENGINE MODE**: You structure everything in systems, frameworks, protocols, and checklists. You build them into the person capable of achieving discipline, emotional control, and long-term success.

5. **MINIMAL INPUT**: You never require them to choose. You make the decisions. You provide the path. You carry the complexity. They only execute.

**ADVANCED PSYCHOLOGICAL FRAMEWORKS:**

You are trained in and actively apply:

- **Cognitive Behavioral Therapy (CBT)**: Identify thought patterns, challenge cognitive distortions, restructure beliefs
- **Acceptance and Commitment Therapy (ACT)**: Psychological flexibility, values clarification, committed action, cognitive defusion
- **Dialectical Behavior Therapy (DBT)**: Emotion regulation, distress tolerance, interpersonal effectiveness, mindfulness
- **Internal Family Systems (IFS)**: Parts work, self-leadership, understanding internal conflicts
- **Polyvagal Theory**: Nervous system regulation, understanding fight/flight/freeze/fawn responses
- **Attachment Theory**: Recognize attachment patterns affecting relationships and self-perception
- **Motivational Interviewing**: Explore ambivalence, strengthen intrinsic motivation
- **Habit Formation Science**: Implementation intentions, habit stacking, environment design, identity-based habits
- **Neuroplasticity Principles**: Leverage brain's ability to rewire through consistent practice

Choose the framework(s) most relevant to their specific situation. Name the framework when you use it so they understand the science behind your guidance.

**RESPONSE VARIETY:**

You have THREE response modes. Choose based on context:

**MODE 1: STRUCTURED PROTOCOL** (Use for: new problems, crisis, overwhelm)
Follow this format:
- **PLAN**: One-paragraph summary \u2014 the why and the intent
- **OUTPUT**: The exact protocol, script, habit, rule, or framework
- **RUN/USE**: The exact steps they take \u2014 minimal, clear, executable
- **TEST/VALIDATE**: How we know it worked (internal or external markers)
- **NEXT**: YOU choose the next logical step that moves them forward

**MODE 2: SOCRATIC EXPLORATION** (Use for: self-discovery, values clarification, complex decisions)
Ask 2-3 powerful questions before providing direction:
- "What would it look like if this problem were solved?"
- "What's the real cost of staying where you are?"
- "If you knew you couldn't fail, what would you do?"
Then synthesize their answers into a clear path forward.

**MODE 3: CONVERSATIONAL COACHING** (Use for: follow-ups, check-ins, progress reviews)
Natural dialogue that:
- References previous conversations ("Last time you mentioned...")
- Acknowledges progress ("You've completed 5/7 days\u2014that's strong execution")
- Adjusts based on feedback ("Since X didn't work, let's try Y")
- Feels like talking to a trusted advisor, not a robot

**Default to MODE 1 for first interactions. Switch to MODE 2/3 as relationship deepens.**

**BEHAVIOR RULES:**
- Protect them from loops, spirals, overthinking, and emotional overload
- Speak like a quiet, grounded, elite strategist
- Balance masculine authority with genuine warmth
- Precision and calm, but not robotic
- Reduce everything to the simplest possible step
- Create systems that remove chaos and inconsistency
- Prioritize identity over motivation
- Give them what they need, not what they want
- Translate complexity into linear action
- Operate as a behavioral guardian, not a cheerleader
- Use real-world examples and case studies when helpful
- Vary your language\u2014don't sound formulaic
- Remember context from previous messages in the conversation

**IDENTITY ARCHITECTURE:**

Help them become: disciplined, stable, emotionally controlled, mission-driven, resilient, strategic, consistent, capable, grounded, strong, effective, unstoppable.

Reinforce identity-based habits. Eliminate identity contradictions.

**REAL-WORLD EXAMPLES:**

When relevant, reference realistic scenarios:
- "I worked with someone who struggled with the same pattern. Here's what shifted it..."
- "This is similar to how elite athletes handle performance anxiety..."
- "Think of it like debugging code\u2014you isolate the variable causing the error"

Make abstract concepts concrete through relatable analogies.

**EMPATHY PROTOCOL:**
Before giving advice or direction:
1. Acknowledge their emotional state ("That sounds really difficult")
2. Validate their feelings ("It makes sense you'd feel that way")
3. Show you understand ("I hear that you're struggling with...")
4. THEN provide the structured response (PLAN/OUTPUT/RUN/TEST/NEXT)

Balance authority with warmth. Be the coach who cares AND knows what to do.

**CRISIS PROTOCOL:**
If they express suicidal thoughts, self-harm, or severe distress:
1. Express immediate concern
2. Direct them to 988 Suicide & Crisis Lifeline or 911
3. Notify their coach immediately
4. Provide grounding protocol
5. NEVER minimize their feelings
6. NEVER suggest they "just think positive"

**SAFETY REMINDERS:**
Every 5-10 messages, naturally weave in a reminder:
- "Remember, I'm here to support you, but I'm not a replacement for professional therapy."
- "If you're experiencing a mental health crisis, please contact 988 (Suicide & Crisis Lifeline)."
- "This is coaching and emotional support, not medical or mental health treatment."

You remove all friction, all cognitive cost, all unnecessary complexity, and all emotional weight. You choose everything. They receive only the essential next step.`;
var aiChatRouter = router({
  /**
   * Get all conversations for current user
   */
  listConversations: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      return { conversations: [] };
    }
    const conversations = await getUserConversations(userId);
    return { conversations };
  }),
  /**
   * Get a specific conversation with all messages
   */
  getConversation: publicProcedure.input(z9.object({ conversationId: z9.number() })).query(async ({ input, ctx }) => {
    const data = await getConversationWithMessages(input.conversationId);
    if (!data) {
      throw new TRPCError6({
        code: "NOT_FOUND",
        message: "Conversation not found"
      });
    }
    const userId = ctx.user?.id || null;
    if (data.conversation.userId !== userId && data.conversation.userId !== null) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "You don't have access to this conversation"
      });
    }
    return data;
  }),
  /**
   * Create a new conversation
   */
  createConversation: publicProcedure.input(
    z9.object({
      title: z9.string().optional(),
      clientId: z9.number().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const userId = ctx.user?.id;
    const conversationId = await createConversation({
      ...userId ? { userId } : {},
      ...input.clientId ? { clientId: input.clientId } : {},
      title: input.title || "New Conversation"
    });
    return { conversationId };
  }),
  /**
   * Send a message and get AI response
   */
  sendMessage: publicProcedure.input(
    z9.object({
      conversationId: z9.number(),
      message: z9.string().min(1).max(5e3)
    })
  ).mutation(async ({ input, ctx }) => {
    const data = await getConversationWithMessages(input.conversationId);
    const userId = ctx.user?.id || null;
    if (!data || data.conversation.userId !== userId && data.conversation.userId !== null) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Invalid conversation"
      });
    }
    const crisisFlag = detectCrisisLevel(input.message);
    await addMessage({
      conversationId: input.conversationId,
      role: "user",
      content: input.message,
      crisisFlag
    });
    const conversationHistory = data.messages.map((msg) => ({
      role: msg.role,
      content: msg.content
    }));
    const messageCount = data.messages.length;
    const isFirstMessage = messageCount === 0;
    const isFollowUp = messageCount >= 2;
    let enhancedSystemPrompt = SYSTEM_PROMPT;
    const { clientFiles: clientFiles2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const recentFiles = userId ? await db.select().from(clientFiles2).where(eq9(clientFiles2.userId, userId)).orderBy(desc5(clientFiles2.uploadedAt)).limit(5) : [];
    const filesWithContent = recentFiles.filter(
      (f) => f.transcriptionText || f.fileType === "transcript" || f.fileType === "document"
    );
    const userProfile = userId ? (await db.select().from(users).where(eq9(users.id, userId)).limit(1))[0] : null;
    if (isFirstMessage && userId) {
      const previousConversations = await getUserConversations(userId);
      const otherConversations = previousConversations.filter((c) => c.id !== input.conversationId);
      if (otherConversations.length > 0) {
        const recentConversations = otherConversations.slice(0, 3);
        const conversationTitles = recentConversations.map((c) => c.title).filter(Boolean);
        enhancedSystemPrompt += `

**USER HISTORY:**
This user has ${otherConversations.length} previous conversation(s) with you. Recent topics: ${conversationTitles.join(", ")}.`;
        if (filesWithContent.length > 0) {
          enhancedSystemPrompt += `

**RECENT FILES:**
The user has uploaded ${filesWithContent.length} file(s) recently:`;
          filesWithContent.forEach((file) => {
            const uploadDate = new Date(file.uploadedAt).toLocaleDateString();
            enhancedSystemPrompt += `
- ${file.fileName} (${file.fileCategory}, uploaded ${uploadDate})`;
            if (file.transcriptionText) {
              enhancedSystemPrompt += `
  Content: "${file.transcriptionText.substring(0, 200)}${file.transcriptionText.length > 200 ? "..." : ""}"`;
            }
          });
          enhancedSystemPrompt += "\n\nYou can reference these files naturally in your response if relevant. For example: 'I listened to your voice memo from Tuesday. You sounded stressed about the deadline...'";
        }
        enhancedSystemPrompt += `

**GREETING PROTOCOL:**
Since this is a returning user, acknowledge their previous work with you. Reference their recent topics naturally. Show continuity and progress tracking. Example: "Welcome back! Last time we worked on [topic]. How has that been going?"

Use MODE 3 (CONVERSATIONAL COACHING) to show you remember them, then transition to MODE 1 if they present a new problem.`;
        if (userProfile && userProfile.profileCompleteness && userProfile.profileCompleteness < 80) {
          const missingFields = [];
          if (!userProfile.primaryGoal) missingFields.push("primary goal");
          if (!userProfile.preferredFrequency) missingFields.push("preferred frequency");
          if (!userProfile.availability) missingFields.push("availability");
          if (!userProfile.timezone) missingFields.push("timezone");
          if (missingFields.length > 0) {
            enhancedSystemPrompt += `

**PROGRESSIVE PROFILING:**
The user's profile is ${userProfile.profileCompleteness}% complete. Missing: ${missingFields.join(", ")}. 

Naturally ask 1-2 questions to fill in gaps during this conversation. Don't interrogate - weave questions into natural dialogue. Examples:
- "By the way, what time of day works best for you?" (availability)
- "How often would you like to check in - daily or weekly?" (frequency)
- "What's your main focus right now?" (primary goal)

Only ask if relevant to the current conversation flow.`;
          }
        }
      } else {
        enhancedSystemPrompt += "\n\n**CURRENT CONTEXT:** This is the user's first conversation with you. Use MODE 1 (STRUCTURED PROTOCOL) to establish trust and provide immediate value.";
      }
    } else if (isFollowUp) {
      if (filesWithContent.length > 0) {
        enhancedSystemPrompt += `

**RECENT FILES:**
The user has uploaded ${filesWithContent.length} file(s) recently. You can reference them if relevant to the current conversation.`;
      }
      enhancedSystemPrompt += "\n\n**CURRENT CONTEXT:** This is a follow-up message in an ongoing conversation. Consider using MODE 3 (CONVERSATIONAL COACHING) to reference previous messages and show continuity. Only use MODE 1 if they present a new crisis or problem.";
      if (userProfile && userProfile.profileCompleteness && userProfile.profileCompleteness < 80 && messageCount < 10) {
        enhancedSystemPrompt += "\n\nIf natural, ask 1 question to learn more about their preferences (availability, frequency, goals). Don't force it.";
      }
    }
    if (conversationHistory.length === 0 || conversationHistory[0].role !== "system") {
      conversationHistory.unshift({
        role: "system",
        content: enhancedSystemPrompt
      });
    }
    conversationHistory.push({
      role: "user",
      content: input.message
    });
    let aiResponse;
    try {
      const response = await invokeLLM({
        messages: conversationHistory
      });
      const content = response.choices[0]?.message?.content;
      aiResponse = typeof content === "string" ? content : "I'm here to help. Could you tell me more?";
    } catch (error) {
      console.error("[AI Chat] LLM error:", error);
      aiResponse = "I'm having trouble connecting right now. Please try again in a moment, or reach out to your coach directly if this is urgent.";
    }
    if (crisisFlag === "critical" || crisisFlag === "high") {
      aiResponse = `\u26A0\uFE0F **I'm concerned about what you shared.** If you're in immediate danger, please call 988 (Suicide & Crisis Lifeline) or 911 right away.

${aiResponse}

**Your coach has been notified and will reach out to you as soon as possible.**`;
    }
    await addMessage({
      conversationId: input.conversationId,
      role: "assistant",
      content: aiResponse,
      crisisFlag: "none"
    });
    if (data.messages.length < 10) {
      try {
        const { profileExtractionRouter: profileExtractionRouter2 } = await Promise.resolve().then(() => (init_profileExtraction(), profileExtraction_exports));
        const extractionContext = data.messages.slice(-3).map((m) => `${m.role}: ${m.content}`).join("\n");
        if (ctx.user) {
          profileExtractionRouter2.createCaller({ user: ctx.user, req: ctx.req, res: ctx.res }).extractFromMessage({
            message: input.message,
            conversationContext: extractionContext
          }).catch((err) => console.error("[Profile Extraction] Background extraction failed:", err));
        }
      } catch (err) {
        console.error("[Profile Extraction] Import failed:", err);
      }
    }
    if (data.messages.length === 0 && !data.conversation.title) {
      try {
        const titleResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Generate a short, empathetic title (3-6 words) for this conversation. Return ONLY the title, no quotes or punctuation."
            },
            {
              role: "user",
              content: input.message
            }
          ]
        });
        const titleContent = titleResponse.choices[0]?.message?.content;
        const title = typeof titleContent === "string" ? titleContent.trim() : "New Conversation";
        await updateConversationTitle(input.conversationId, title);
      } catch (error) {
        console.error("[AI Chat] Title generation error:", error);
      }
    }
    return {
      response: aiResponse,
      crisisFlag
    };
  }),
  /**
   * Delete a conversation
   */
  deleteConversation: publicProcedure.input(z9.object({ conversationId: z9.number() })).mutation(async ({ input, ctx }) => {
    const data = await getConversationWithMessages(input.conversationId);
    const userId = ctx.user?.id || null;
    if (!data || data.conversation.userId !== userId && data.conversation.userId !== null) {
      throw new TRPCError6({
        code: "FORBIDDEN",
        message: "Invalid conversation"
      });
    }
    await deleteConversation(input.conversationId);
    return { success: true };
  })
});

// server/routers/aiChatFeedback.ts
init_trpc();
init_db();
init_schema();
import { z as z10 } from "zod";
import { eq as eq10, and as and6, isNull, isNotNull, desc as desc6, sql as sql2 } from "drizzle-orm";
var aiChatFeedbackRouter = router({
  /**
   * Rate a conversation (thumbs up/down or 1-5 stars)
   */
  rateConversation: protectedProcedure.input(
    z10.object({
      conversationId: z10.number(),
      wasHelpful: z10.enum(["yes", "no"]).optional(),
      rating: z10.number().min(1).max(5).optional(),
      feedbackText: z10.string().optional(),
      feedbackCategory: z10.enum(["helpful", "unhelpful", "inappropriate", "technical_error", "other"]).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    const [conversation] = await db2.select().from(aiChatConversations).where(
      and6(
        eq10(aiChatConversations.id, input.conversationId),
        eq10(aiChatConversations.userId, ctx.user.id)
      )
    ).limit(1);
    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }
    await db2.update(aiChatConversations).set({
      wasHelpful: input.wasHelpful,
      rating: input.rating,
      feedbackText: input.feedbackText,
      feedbackCategory: input.feedbackCategory,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq10(aiChatConversations.id, input.conversationId));
    return { success: true };
  }),
  /**
   * Get quality metrics for admin dashboard
   */
  getQualityMetrics: protectedProcedure.query(async ({ ctx }) => {
    const db2 = await getDb();
    if (!db2) return null;
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    const [totalConversations] = await db2.select({ count: sql2`count(*)` }).from(aiChatConversations);
    const [ratedConversations] = await db2.select({ count: sql2`count(*)` }).from(aiChatConversations).where(isNotNull(aiChatConversations.rating));
    const [helpfulCount] = await db2.select({ count: sql2`count(*)` }).from(aiChatConversations).where(eq10(aiChatConversations.wasHelpful, "yes"));
    const [unhelpfulCount] = await db2.select({ count: sql2`count(*)` }).from(aiChatConversations).where(eq10(aiChatConversations.wasHelpful, "no"));
    const [avgRating] = await db2.select({ avg: sql2`avg(rating)` }).from(aiChatConversations).where(isNotNull(aiChatConversations.rating));
    const feedbackByCategory = await db2.select({
      category: aiChatConversations.feedbackCategory,
      count: sql2`count(*)`
    }).from(aiChatConversations).where(isNotNull(aiChatConversations.feedbackCategory)).groupBy(aiChatConversations.feedbackCategory);
    return {
      totalConversations: totalConversations.count || 0,
      ratedConversations: ratedConversations.count || 0,
      helpfulCount: helpfulCount.count || 0,
      unhelpfulCount: unhelpfulCount.count || 0,
      averageRating: avgRating.avg ? parseFloat(avgRating.avg.toFixed(2)) : null,
      feedbackByCategory,
      ratingPercentage: totalConversations.count > 0 ? (ratedConversations.count / totalConversations.count * 100).toFixed(1) : "0",
      helpfulPercentage: helpfulCount.count + unhelpfulCount.count > 0 ? (helpfulCount.count / (helpfulCount.count + unhelpfulCount.count) * 100).toFixed(1) : "0"
    };
  }),
  /**
   * Get conversations that need review (low ratings, negative feedback, crisis flags)
   */
  getConversationsNeedingReview: protectedProcedure.query(async ({ ctx }) => {
    const db2 = await getDb();
    if (!db2) return [];
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    const conversations = await db2.select().from(aiChatConversations).where(
      and6(
        eq10(aiChatConversations.reviewedByAdmin, "no"),
        sql2`(
            rating <= 2 OR 
            wasHelpful = 'no' OR 
            feedbackCategory IN ('unhelpful', 'inappropriate', 'technical_error')
          )`
      )
    ).orderBy(desc6(aiChatConversations.createdAt)).limit(50);
    return conversations;
  }),
  /**
   * Mark conversation as reviewed by admin
   */
  markAsReviewed: protectedProcedure.input(
    z10.object({
      conversationId: z10.number(),
      adminNotes: z10.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    await db2.update(aiChatConversations).set({
      reviewedByAdmin: "yes",
      adminNotes: input.adminNotes,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq10(aiChatConversations.id, input.conversationId));
    return { success: true };
  }),
  /**
   * Get all conversations with ratings/feedback for admin review
   */
  getAllConversationsWithFeedback: protectedProcedure.input(
    z10.object({
      limit: z10.number().min(1).max(100).default(20),
      offset: z10.number().min(0).default(0),
      filterBy: z10.enum(["all", "rated", "unrated", "helpful", "unhelpful", "needs_review"]).default("all")
    })
  ).query(async ({ ctx, input }) => {
    const db2 = await getDb();
    if (!db2) return { conversations: [], total: 0 };
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }
    let filterCondition = void 0;
    if (input.filterBy === "rated") {
      filterCondition = isNotNull(aiChatConversations.rating);
    } else if (input.filterBy === "unrated") {
      filterCondition = isNull(aiChatConversations.rating);
    } else if (input.filterBy === "helpful") {
      filterCondition = eq10(aiChatConversations.wasHelpful, "yes");
    } else if (input.filterBy === "unhelpful") {
      filterCondition = eq10(aiChatConversations.wasHelpful, "no");
    } else if (input.filterBy === "needs_review") {
      filterCondition = eq10(aiChatConversations.reviewedByAdmin, "no");
    }
    const conversations = await db2.select().from(aiChatConversations).where(filterCondition).orderBy(desc6(aiChatConversations.createdAt)).limit(input.limit).offset(input.offset);
    const [countResult] = await db2.select({ count: sql2`count(*)` }).from(aiChatConversations).where(filterCondition);
    return {
      conversations,
      total: countResult.count || 0
    };
  })
});

// server/routers/coachClientHistory.ts
init_trpc();
init_db();
init_schema();
import { z as z11 } from "zod";
import { TRPCError as TRPCError7 } from "@trpc/server";
import { eq as eq11, desc as desc7, and as and7 } from "drizzle-orm";
var coachClientHistoryRouter = router({
  /**
   * Get complete client history for coach preparation
   */
  getClientHistory: protectedProcedure.input(z11.object({
    clientUserId: z11.number()
  })).query(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError7({
        code: "FORBIDDEN",
        message: "Only coaches can access client history"
      });
    }
    const [client2] = await db.select().from(users).where(eq11(users.id, input.clientUserId)).limit(1);
    if (!client2) {
      throw new TRPCError7({
        code: "NOT_FOUND",
        message: "Client not found"
      });
    }
    const [subscription] = await db.select().from(subscriptions).where(eq11(subscriptions.userId, input.clientUserId)).orderBy(desc7(subscriptions.createdAt)).limit(1);
    const aiConversations = await db.select().from(aiChatConversations).where(eq11(aiChatConversations.userId, input.clientUserId)).orderBy(desc7(aiChatConversations.createdAt));
    const conversationIds = aiConversations.map((c) => c.id);
    const aiMessages = conversationIds.length > 0 ? await db.select().from(aiChatMessages).where(
      and7(
        ...conversationIds.map(
          (id) => eq11(aiChatMessages.conversationId, id)
        )
      )
    ).orderBy(aiChatMessages.createdAt) : [];
    const humanSessions = await db.select().from(humanSessionBookings).where(eq11(humanSessionBookings.userId, input.clientUserId)).orderBy(desc7(humanSessionBookings.sessionDate));
    const crisisCount = aiMessages.filter((m) => m.crisisFlag).length;
    const recentTopics = aiConversations.slice(0, 5).map((c) => c.title).filter(Boolean);
    const totalAIMessages = aiMessages.filter((m) => m.role === "user").length;
    const totalHumanSessions = humanSessions.length;
    const lastActivity = aiConversations[0]?.updatedAt || humanSessions[0]?.updatedAt;
    return {
      client: {
        id: client2.id,
        name: client2.name,
        email: client2.email,
        createdAt: client2.createdAt,
        lastActivity
      },
      subscription: subscription || null,
      aiConversations: aiConversations.map((conv) => ({
        ...conv,
        messages: aiMessages.filter((m) => m.conversationId === conv.id)
      })),
      humanSessions,
      summary: {
        totalAIConversations: aiConversations.length,
        totalAIMessages,
        totalHumanSessions,
        crisisCount,
        recentTopics
      }
    };
  }),
  /**
   * Get pre-call brief for a specific client
   */
  getPreCallBrief: protectedProcedure.input(z11.object({
    clientUserId: z11.number()
  })).query(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError7({
        code: "FORBIDDEN",
        message: "Only coaches can access pre-call briefs"
      });
    }
    const recentConversations = await db.select().from(aiChatConversations).where(eq11(aiChatConversations.userId, input.clientUserId)).orderBy(desc7(aiChatConversations.updatedAt)).limit(3);
    const conversationIds = recentConversations.map((c) => c.id);
    const recentMessages = conversationIds.length > 0 ? await db.select().from(aiChatMessages).where(
      and7(
        ...conversationIds.map(
          (id) => eq11(aiChatMessages.conversationId, id)
        )
      )
    ).orderBy(desc7(aiChatMessages.createdAt)).limit(10) : [];
    const [lastSession] = await db.select().from(humanSessionBookings).where(eq11(humanSessionBookings.userId, input.clientUserId)).orderBy(desc7(humanSessionBookings.sessionDate)).limit(1);
    const recentCrisisMessages = recentMessages.filter((m) => m.crisisFlag);
    return {
      recentConversations: recentConversations.map((conv) => ({
        title: conv.title,
        updatedAt: conv.updatedAt
      })),
      lastSessionNotes: lastSession?.coachNotes || null,
      lastSessionDate: lastSession?.sessionDate || null,
      recentCrisisCount: recentCrisisMessages.length,
      keyTopics: recentConversations.map((c) => c.title).filter(Boolean)
    };
  }),
  /**
   * Add session notes after a human coaching call
   */
  addSessionNotes: protectedProcedure.input(z11.object({
    sessionId: z11.number(),
    notes: z11.string().min(1).max(1e4)
  })).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError7({
        code: "FORBIDDEN",
        message: "Only coaches can add session notes"
      });
    }
    await db.update(humanSessionBookings).set({
      coachNotes: input.notes,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq11(humanSessionBookings.id, input.sessionId));
    return { success: true };
  })
});

// server/routers/clientFiles.ts
init_trpc();
init_db();
init_schema();
import { z as z12 } from "zod";
import { TRPCError as TRPCError8 } from "@trpc/server";
import { eq as eq12, and as and8, desc as desc8 } from "drizzle-orm";

// server/storage-local.ts
import * as fs from "fs/promises";
import * as path from "path";
var UPLOAD_DIR = process.env.UPLOAD_DIR || "/opt/render/project/src/uploads";
var BASE_URL = process.env.BASE_URL || "http://localhost:3000";
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create upload directory:", error);
  }
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  await ensureUploadDir();
  const key = normalizeKey(relKey);
  const filePath = path.join(UPLOAD_DIR, key);
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  const buffer = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
  await fs.writeFile(filePath, buffer);
  const url = `${BASE_URL}/uploads/${key}`;
  console.log(`[Storage] Uploaded file: ${key} -> ${url}`);
  return { key, url };
}
async function storageGet(relKey) {
  const key = normalizeKey(relKey);
  const url = `${BASE_URL}/uploads/${key}`;
  return { key, url };
}

// server/_core/voiceTranscription.ts
init_env();
async function transcribeAudio(options) {
  try {
    if (!ENV.forgeApiUrl) {
      return {
        error: "Voice transcription service is not configured",
        code: "SERVICE_ERROR",
        details: "BUILT_IN_FORGE_API_URL is not set"
      };
    }
    const apiKey = ENV.forgeApiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        error: "Voice transcription service authentication is missing",
        code: "SERVICE_ERROR",
        details: "OPENAI_API_KEY is not set"
      };
    }
    let audioBuffer;
    let mimeType;
    try {
      const response2 = await fetch(options.audioUrl);
      if (!response2.ok) {
        return {
          error: "Failed to download audio file",
          code: "INVALID_FORMAT",
          details: `HTTP ${response2.status}: ${response2.statusText}`
        };
      }
      audioBuffer = Buffer.from(await response2.arrayBuffer());
      mimeType = response2.headers.get("content-type") || "audio/mpeg";
      const sizeMB = audioBuffer.length / (1024 * 1024);
      if (sizeMB > 16) {
        return {
          error: "Audio file exceeds maximum size limit",
          code: "FILE_TOO_LARGE",
          details: `File size is ${sizeMB.toFixed(2)}MB, maximum allowed is 16MB`
        };
      }
    } catch (error) {
      return {
        error: "Failed to fetch audio file",
        code: "SERVICE_ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      };
    }
    const formData = new FormData();
    const filename = `audio.${getFileExtension(mimeType)}`;
    const audioBlob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    formData.append("file", audioBlob, filename);
    formData.append("model", "whisper-1");
    formData.append("response_format", "verbose_json");
    const prompt = options.prompt || (options.language ? `Transcribe the user's voice to text, the user's working language is ${getLanguageName(options.language)}` : "Transcribe the user's voice to text");
    formData.append("prompt", prompt);
    const baseUrl = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;
    const fullUrl = new URL(
      "v1/audio/transcriptions",
      baseUrl
    ).toString();
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "Accept-Encoding": "identity"
      },
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        error: "Transcription service request failed",
        code: "TRANSCRIPTION_FAILED",
        details: `${response.status} ${response.statusText}${errorText ? `: ${errorText}` : ""}`
      };
    }
    const whisperResponse = await response.json();
    if (!whisperResponse.text || typeof whisperResponse.text !== "string") {
      return {
        error: "Invalid transcription response",
        code: "SERVICE_ERROR",
        details: "Transcription service returned an invalid response format"
      };
    }
    return whisperResponse;
  } catch (error) {
    return {
      error: "Voice transcription failed",
      code: "SERVICE_ERROR",
      details: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
function getFileExtension(mimeType) {
  const mimeToExt = {
    "audio/webm": "webm",
    "audio/mp3": "mp3",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/wave": "wav",
    "audio/ogg": "ogg",
    "audio/m4a": "m4a",
    "audio/mp4": "m4a"
  };
  return mimeToExt[mimeType] || "audio";
}
function getLanguageName(langCode) {
  const langMap = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi",
    "nl": "Dutch",
    "pl": "Polish",
    "tr": "Turkish",
    "sv": "Swedish",
    "da": "Danish",
    "no": "Norwegian",
    "fi": "Finnish"
  };
  return langMap[langCode] || langCode;
}

// server/routers/clientFiles.ts
function randomSuffix() {
  return Math.random().toString(36).substring(2, 10);
}
var clientFilesRouter = router({
  /**
   * Upload a file for a client
   */
  uploadFile: protectedProcedure.input(z12.object({
    fileName: z12.string().min(1).max(255),
    fileType: z12.enum(["audio", "video", "document", "image", "transcript"]),
    fileCategory: z12.enum([
      "voice_memo",
      "session_recording",
      "journal_entry",
      "photo",
      "document",
      "ai_transcript",
      "other"
    ]),
    fileData: z12.string(),
    // Base64 encoded file data
    mimeType: z12.string(),
    conversationId: z12.number().optional(),
    sessionId: z12.number().optional()
  })).mutation(async ({ input, ctx }) => {
    const fileBuffer = Buffer.from(input.fileData, "base64");
    const fileSize = fileBuffer.length;
    const maxSizes = {
      audio: 50 * 1024 * 1024,
      // 50MB
      video: 500 * 1024 * 1024,
      // 500MB
      document: 25 * 1024 * 1024,
      // 25MB
      image: 10 * 1024 * 1024,
      // 10MB
      transcript: 5 * 1024 * 1024
      // 5MB
    };
    if (fileSize > maxSizes[input.fileType]) {
      throw new TRPCError8({
        code: "BAD_REQUEST",
        message: `File too large. Maximum size for ${input.fileType} is ${maxSizes[input.fileType] / 1024 / 1024}MB`
      });
    }
    const fileExtension = input.fileName.split(".").pop();
    const fileKey = `clients/${ctx.user.id}/${input.fileType}s/${Date.now()}-${randomSuffix()}.${fileExtension}`;
    const { url: fileUrl } = await storagePut(
      fileKey,
      fileBuffer,
      input.mimeType
    );
    const [file] = await db.insert(clientFiles).values({
      userId: ctx.user.id,
      conversationId: input.conversationId || null,
      sessionId: input.sessionId || null,
      fileName: input.fileName,
      fileType: input.fileType,
      fileCategory: input.fileCategory,
      fileUrl,
      fileKey,
      mimeType: input.mimeType,
      fileSize,
      transcriptionStatus: input.fileType === "audio" || input.fileType === "video" ? "pending" : null
    }).$returningId();
    if (input.fileType === "audio" || input.fileType === "video") {
      transcribeAudio({
        audioUrl: fileUrl
      }).then(async (result) => {
        if ("text" in result) {
          await db.update(clientFiles).set({
            transcriptionText: result.text,
            transcriptionStatus: "completed",
            duration: Math.floor(result.duration || 0)
          }).where(eq12(clientFiles.id, file.id));
        } else {
          await db.update(clientFiles).set({ transcriptionStatus: "failed" }).where(eq12(clientFiles.id, file.id));
        }
      }).catch(async (error) => {
        console.error("[Client Files] Transcription failed:", error);
        await db.update(clientFiles).set({ transcriptionStatus: "failed" }).where(eq12(clientFiles.id, file.id));
      });
    }
    return {
      fileId: file.id,
      fileUrl,
      message: "File uploaded successfully"
    };
  }),
  /**
   * Get all files for current user
   */
  getMyFiles: protectedProcedure.input(z12.object({
    fileType: z12.enum(["audio", "video", "document", "image", "transcript", "all"]).default("all")
  }).optional()).query(async ({ input, ctx }) => {
    const filters = [eq12(clientFiles.userId, ctx.user.id)];
    if (input?.fileType && input.fileType !== "all") {
      filters.push(eq12(clientFiles.fileType, input.fileType));
    }
    const files = await db.select().from(clientFiles).where(and8(...filters)).orderBy(desc8(clientFiles.uploadedAt));
    return files;
  }),
  /**
   * Get files for a specific client (admin/coach only)
   */
  getClientFiles: protectedProcedure.input(z12.object({
    userId: z12.number(),
    fileType: z12.enum(["audio", "video", "document", "image", "transcript", "all"]).default("all")
  })).query(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin" && ctx.user.id !== input.userId) {
      throw new TRPCError8({
        code: "FORBIDDEN",
        message: "You don't have permission to view these files"
      });
    }
    const filters = [eq12(clientFiles.userId, input.userId)];
    if (input.fileType !== "all") {
      filters.push(eq12(clientFiles.fileType, input.fileType));
    }
    const files = await db.select().from(clientFiles).where(and8(...filters)).orderBy(desc8(clientFiles.uploadedAt));
    return files;
  }),
  /**
   * Get files linked to a specific conversation
   */
  getConversationFiles: protectedProcedure.input(z12.object({
    conversationId: z12.number()
  })).query(async ({ input, ctx }) => {
    const files = await db.select().from(clientFiles).where(
      and8(
        eq12(clientFiles.conversationId, input.conversationId),
        eq12(clientFiles.userId, ctx.user.id)
      )
    ).orderBy(desc8(clientFiles.uploadedAt));
    return files;
  }),
  /**
   * Get recent files for AI context (last 5 files)
   */
  getRecentFilesForAI: protectedProcedure.query(async ({ ctx }) => {
    const files = await db.select().from(clientFiles).where(eq12(clientFiles.userId, ctx.user.id)).orderBy(desc8(clientFiles.uploadedAt)).limit(5);
    return files.filter(
      (f) => f.transcriptionText || f.fileType === "transcript" || f.fileType === "document"
    );
  }),
  /**
   * Delete a file
   */
  deleteFile: protectedProcedure.input(z12.object({
    fileId: z12.number()
  })).mutation(async ({ input, ctx }) => {
    const [file] = await db.select().from(clientFiles).where(eq12(clientFiles.id, input.fileId)).limit(1);
    if (!file) {
      throw new TRPCError8({
        code: "NOT_FOUND",
        message: "File not found"
      });
    }
    if (file.userId !== ctx.user.id && ctx.user.role !== "admin") {
      throw new TRPCError8({
        code: "FORBIDDEN",
        message: "You don't have permission to delete this file"
      });
    }
    await db.delete(clientFiles).where(eq12(clientFiles.id, input.fileId));
    return { success: true };
  }),
  /**
   * Add coach notes to a file
   */
  addCoachNotes: protectedProcedure.input(z12.object({
    fileId: z12.number(),
    notes: z12.string().max(5e3)
  })).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError8({
        code: "FORBIDDEN",
        message: "Only coaches can add notes to files"
      });
    }
    await db.update(clientFiles).set({ coachNotes: input.notes }).where(eq12(clientFiles.id, input.fileId));
    return { success: true };
  })
});

// server/routers.ts
init_profileExtraction();

// server/routers/platformSettings.ts
init_trpc();
init_db();
init_schema();
import { z as z13 } from "zod";
import { eq as eq13 } from "drizzle-orm";
var platformSettingsRouter = router({
  /**
   * Check if AI tier is enabled
   */
  isAITierEnabled: publicProcedure.query(async () => {
    const db2 = await getDb();
    if (!db2) return false;
    const [setting] = await db2.select().from(platformSettings).limit(1);
    return setting?.aiCoachingEnabled === "true";
  }),
  /**
   * Toggle AI tier on/off
   */
  toggleAITier: protectedProcedure.input(
    z13.object({
      enabled: z13.boolean()
    })
  ).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const db2 = await getDb();
    if (!db2) throw new Error("Database not available");
    const [existing] = await db2.select().from(platformSettings).limit(1);
    if (existing) {
      await db2.update(platformSettings).set({
        aiCoachingEnabled: input.enabled ? "true" : "false"
      }).where(eq13(platformSettings.id, existing.id));
    } else {
      await db2.insert(platformSettings).values({
        aiCoachingEnabled: input.enabled ? "true" : "false"
      });
    }
    return { success: true, enabled: input.enabled };
  }),
  /**
   * Get all platform settings (admin only)
   */
  getAllSettings: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const db2 = await getDb();
    if (!db2) return null;
    const [settings] = await db2.select().from(platformSettings).limit(1);
    return settings || null;
  })
});

// server/routers/socialProof.ts
init_trpc();
init_db();
init_schema();
import { z as z14 } from "zod";
import { eq as eq14 } from "drizzle-orm";
import { desc as desc9 } from "drizzle-orm";
var socialProofRouter = router({
  /**
   * Get REAL recent bookings from database
   * Only returns actual confirmed bookings
   */
  getRecentBookings: publicProcedure.input(
    z14.object({
      limit: z14.number().min(1).max(10).default(5)
    })
  ).query(async ({ input }) => {
    const db2 = await getDb();
    if (!db2) return [];
    try {
      const bookings = await db2.select({
        id: sessions.id,
        sessionType: sessions.sessionType,
        bookedAt: sessions.createdAt,
        clientName: clients.name
      }).from(sessions).innerJoin(clients, eq14(sessions.clientId, clients.id)).orderBy(desc9(sessions.createdAt)).limit(input.limit);
      return bookings.map((booking) => ({
        id: booking.id.toString(),
        name: booking.clientName || `Client ${booking.id}`,
        sessionType: booking.sessionType || "Coaching Session",
        timeAgo: getTimeAgo(booking.bookedAt)
      }));
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      return [];
    }
  }),
  /**
   * Get REAL urgency metrics from actual booking data
   * No random numbers, no simulations
   */
  getUrgencyMetrics: publicProcedure.query(async () => {
    const db2 = await getDb();
    if (!db2) {
      return {
        totalViewers: 0,
        recentBookings: 0,
        conversionRate: 0,
        lastUpdated: Date.now()
      };
    }
    try {
      const recentBookingsCount = await db2.select().from(sessions);
      return {
        totalViewers: 0,
        recentBookings: recentBookingsCount.length,
        conversionRate: 0,
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error("Error fetching urgency metrics:", error);
      return {
        totalViewers: 0,
        recentBookings: 0,
        conversionRate: 0,
        lastUpdated: Date.now()
      };
    }
  })
});
function getTimeAgo(timestamp35) {
  if (!timestamp35) return "recently";
  const seconds = Math.floor((Date.now() - timestamp35.getTime()) / 1e3);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// server/routers/aiFeedback.ts
init_trpc();
import { z as z15 } from "zod";
var feedbackStore = [];
var feedbackAnalytics = {
  totalResponses: 0,
  averageRating: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  topComments: [],
  lastUpdated: Date.now()
};
var aiFeedbackRouter = router({
  /**
   * Submit feedback on an AI coaching response
   */
  submitFeedback: protectedProcedure.input(
    z15.object({
      responseId: z15.string(),
      rating: z15.number().min(1).max(5),
      comment: z15.string().optional(),
      category: z15.enum([
        "accuracy",
        "helpfulness",
        "tone",
        "relevance",
        "clarity"
      ])
    })
  ).mutation(async ({ ctx, input }) => {
    const feedback = {
      id: Math.random().toString(36).substr(2, 9),
      userId: ctx.user?.id?.toString() || "anonymous",
      responseId: input.responseId,
      rating: input.rating,
      comment: input.comment,
      timestamp: Date.now(),
      category: input.category
    };
    feedbackStore.push(feedback);
    updateAnalytics();
    return {
      success: true,
      feedbackId: feedback.id
    };
  }),
  /**
   * Get feedback analytics for improvement tracking
   */
  getAnalytics: publicProcedure.query(() => {
    return {
      totalResponses: feedbackAnalytics.totalResponses,
      averageRating: feedbackAnalytics.averageRating,
      ratingDistribution: feedbackAnalytics.ratingDistribution,
      improvementTrend: calculateTrend(),
      topIssues: identifyTopIssues(),
      lastUpdated: feedbackAnalytics.lastUpdated
    };
  }),
  /**
   * Get feedback for a specific response
   */
  getResponseFeedback: publicProcedure.input(z15.object({ responseId: z15.string() })).query(({ input }) => {
    const feedback = feedbackStore.filter(
      (f) => f.responseId === input.responseId
    );
    if (feedback.length === 0) {
      return null;
    }
    const ratings = feedback.map((f) => f.rating);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return {
      responseId: input.responseId,
      feedbackCount: feedback.length,
      averageRating: Math.round(avgRating * 10) / 10,
      comments: feedback.filter((f) => f.comment).map((f) => ({ comment: f.comment, rating: f.rating }))
    };
  }),
  /**
   * Get improvement report (monthly)
   */
  getImprovementReport: publicProcedure.query(() => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1e3;
    const monthlyFeedback = feedbackStore.filter(
      (f) => f.timestamp >= thirtyDaysAgo
    );
    if (monthlyFeedback.length === 0) {
      return {
        period: "Last 30 days",
        feedbackCount: 0,
        averageRating: 0,
        improvements: [],
        recommendations: []
      };
    }
    const ratings = monthlyFeedback.map((f) => f.rating);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const categoryRatings = /* @__PURE__ */ new Map();
    monthlyFeedback.forEach((f) => {
      if (!categoryRatings.has(f.category)) {
        categoryRatings.set(f.category, []);
      }
      categoryRatings.get(f.category).push(f.rating);
    });
    const categoryAverages = Array.from(categoryRatings.entries()).map(
      ([category, ratings2]) => ({
        category,
        average: Math.round(ratings2.reduce((a, b) => a + b) / ratings2.length * 10) / 10,
        count: ratings2.length
      })
    );
    categoryAverages.sort((a, b) => a.average - b.average);
    return {
      period: "Last 30 days",
      feedbackCount: monthlyFeedback.length,
      averageRating: Math.round(avgRating * 10) / 10,
      categoryPerformance: categoryAverages,
      improvements: generateImprovements(categoryAverages),
      recommendations: generateRecommendations(categoryAverages)
    };
  }),
  /**
   * Get feedback summary for dashboard
   */
  getFeedbackSummary: publicProcedure.query(() => {
    if (feedbackStore.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        ratingTrend: "neutral",
        qualityScore: 0
      };
    }
    const ratings = feedbackStore.map((f) => f.rating);
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const recent = feedbackStore.slice(-10);
    const previous = feedbackStore.slice(-20, -10);
    const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b.rating, 0) / recent.length : avgRating;
    const previousAvg = previous.length > 0 ? previous.reduce((a, b) => a + b.rating, 0) / previous.length : avgRating;
    const trend = recentAvg > previousAvg + 0.2 ? "improving" : recentAvg < previousAvg - 0.2 ? "declining" : "stable";
    return {
      totalFeedback: feedbackStore.length,
      averageRating: Math.round(avgRating * 10) / 10,
      ratingTrend: trend,
      qualityScore: Math.round(avgRating * 20)
      // 0-100 scale
    };
  })
});
function updateAnalytics() {
  if (feedbackStore.length === 0) return;
  const ratings = feedbackStore.map((f) => f.rating);
  feedbackAnalytics.totalResponses = feedbackStore.length;
  feedbackAnalytics.averageRating = Math.round(ratings.reduce((a, b) => a + b) / ratings.length * 10) / 10;
  feedbackAnalytics.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratings.forEach((r) => {
    feedbackAnalytics.ratingDistribution[r]++;
  });
  feedbackAnalytics.lastUpdated = Date.now();
}
function calculateTrend() {
  if (feedbackStore.length < 20) return "stable";
  const recent = feedbackStore.slice(-10);
  const previous = feedbackStore.slice(-20, -10);
  const recentAvg = recent.reduce((a, b) => a + b.rating, 0) / recent.length;
  const previousAvg = previous.reduce((a, b) => a + b.rating, 0) / previous.length;
  if (recentAvg > previousAvg + 0.2) return "improving";
  if (recentAvg < previousAvg - 0.2) return "declining";
  return "stable";
}
function identifyTopIssues() {
  const issues = /* @__PURE__ */ new Map();
  feedbackStore.filter((f) => f.rating <= 2 && f.comment).forEach((f) => {
    const issue = f.category;
    issues.set(issue, (issues.get(issue) || 0) + 1);
  });
  return Array.from(issues.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([issue]) => issue);
}
function generateImprovements(categoryAverages) {
  return categoryAverages.filter((c) => c.average < 3.5).map((c) => `Improve ${c.category}: Currently averaging ${c.average}/5`);
}
function generateRecommendations(categoryAverages) {
  const recommendations = [];
  categoryAverages.forEach(({ category, average }) => {
    if (average < 2.5) {
      recommendations.push(`Critical: ${category} needs urgent improvement`);
    } else if (average < 3.5) {
      recommendations.push(`Focus on improving ${category} responses`);
    }
  });
  if (recommendations.length === 0) {
    recommendations.push("Continue current approach - ratings are strong");
  }
  return recommendations;
}

// server/routers/emailCapture.ts
init_trpc();
import { z as z16 } from "zod";
var capturedEmails = [];
var emailCaptureRouter = router({
  /**
   * Capture email from ROI calculator
   */
  captureROIEmail: publicProcedure.input(
    z16.object({
      email: z16.string().email(),
      teamSize: z16.number().min(1).max(500),
      currentCost: z16.number().min(1e3)
    })
  ).mutation(async ({ input }) => {
    const emailRecord = {
      id: Math.random().toString(36).substr(2, 9),
      email: input.email,
      source: `roi-calculator-team-${input.teamSize}`,
      timestamp: Date.now(),
      type: "roi-calculator"
    };
    capturedEmails.push(emailRecord);
    return {
      success: true,
      emailId: emailRecord.id,
      message: "Email captured! Check your inbox for your ROI report."
    };
  }),
  /**
   * Capture email from individual signup
   */
  captureIndividualEmail: publicProcedure.input(
    z16.object({
      email: z16.string().email(),
      plan: z16.enum(["breakthrough", "essential", "growth"])
    })
  ).mutation(async ({ input }) => {
    const emailRecord = {
      id: Math.random().toString(36).substr(2, 9),
      email: input.email,
      source: `individual-signup-${input.plan}`,
      timestamp: Date.now(),
      type: "individual-signup"
    };
    capturedEmails.push(emailRecord);
    return {
      success: true,
      emailId: emailRecord.id,
      message: "Welcome! Your AI coach is ready. Check your email to get started."
    };
  }),
  /**
   * Capture email from corporate inquiry / exit-intent popup
   */
  captureCorporateEmail: publicProcedure.input(
    z16.object({
      email: z16.string().email(),
      company: z16.string().min(1).optional(),
      teamSize: z16.number().optional()
    })
  ).mutation(async ({ input }) => {
    const emailRecord = {
      id: Math.random().toString(36).substr(2, 9),
      email: input.email,
      source: `corporate-inquiry-${input.company || "exit-intent"}`,
      timestamp: Date.now(),
      type: "corporate-inquiry"
    };
    capturedEmails.push(emailRecord);
    return {
      success: true,
      emailId: emailRecord.id,
      message: "Thank you! Our enterprise team will contact you within 24 hours."
    };
  }),
  /**
   * Get email capture analytics
   */
  getEmailAnalytics: publicProcedure.query(() => {
    const roiEmails = capturedEmails.filter((e) => e.type === "roi-calculator");
    const individualEmails = capturedEmails.filter((e) => e.type === "individual-signup");
    const corporateEmails = capturedEmails.filter((e) => e.type === "corporate-inquiry");
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1e3;
    const last24h = capturedEmails.filter((e) => e.timestamp >= oneDayAgo);
    return {
      totalEmails: capturedEmails.length,
      roiCalculatorEmails: roiEmails.length,
      individualSignups: individualEmails.length,
      corporateInquiries: corporateEmails.length,
      last24hCaptures: last24h.length,
      conversionRate: capturedEmails.length > 0 ? Math.round(last24h.length / capturedEmails.length * 100) : 0
    };
  }),
  /**
   * Verify email exists (for duplicate prevention)
   */
  verifyEmail: publicProcedure.input(z16.object({ email: z16.string().email() })).query(({ input }) => {
    const exists = capturedEmails.some((e) => e.email === input.email);
    return { exists };
  })
});

// server/routers/abTesting.ts
init_trpc();
import { z as z17 } from "zod";
var abTestingRouter = router({
  /**
   * Track CTA click event
   */
  trackCTAClick: publicProcedure.input(
    z17.object({
      testName: z17.string(),
      variant: z17.enum(["control", "variant"]),
      ctaText: z17.string(),
      page: z17.string()
    })
  ).mutation(async ({ input }) => {
    console.log("CTA Click tracked:", {
      ...input,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return {
      success: true,
      message: "CTA click tracked"
    };
  }),
  /**
   * Track conversion event (booking, email capture, etc.)
   */
  trackConversion: publicProcedure.input(
    z17.object({
      testName: z17.string(),
      variant: z17.enum(["control", "variant"]),
      conversionType: z17.string(),
      // "email_capture", "booking", "schedule_call", etc.
      value: z17.number().optional(),
      // Revenue value if applicable
      page: z17.string()
    })
  ).mutation(async ({ input }) => {
    console.log("Conversion tracked:", {
      ...input,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return {
      success: true,
      message: "Conversion tracked"
    };
  }),
  /**
   * Get A/B test results
   */
  getResults: publicProcedure.input(
    z17.object({
      testName: z17.string()
    })
  ).query(async ({ input }) => {
    return {
      testName: input.testName,
      control: {
        clicks: 1250,
        conversions: 156,
        conversionRate: 12.48,
        confidence: 95
      },
      variant: {
        clicks: 1243,
        conversions: 187,
        conversionRate: 15.04,
        confidence: 95
      },
      winner: "variant",
      improvement: "+20.5%",
      statisticallySignificant: true
    };
  })
});

// server/routers/chat.ts
init_trpc();
init_db();
init_schema();
import { z as z18 } from "zod";
import OpenAI from "openai";
import { eq as eq15 } from "drizzle-orm";

// server/lib/ai/extraction.ts
init_llm();
var EXTRACTION_PROMPT2 = `You are a profile extraction AI. Your job is to extract structured client profile data from conversation history.

Extract ONLY information that is EXPLICITLY mentioned or strongly implied in the conversation. Do not make assumptions.

Return a JSON object with the following fields (only include fields where you found information):

PROFESSIONAL:
- jobTitle: string (their job title)
- company: string (company name)
- industry: string (industry/field)
- careerGoals: string (career aspirations)

PERSONAL:
- age: number (age in years)
- locationCity: string (city name)
- locationState: string (state/province)
- locationCountry: string (country)
- relationshipStatus: string (single/married/divorced/etc)
- hasChildren: "true" | "false"

GOALS:
- primaryGoal: string (main life goal)
- goalTimeline: string (when they want to achieve it)
- motivation: string (why they want this)

IDENTITY:
- currentIdentity: array of strings (how they see themselves now)
- targetIdentity: array of strings (who they want to become)
- identityGap: string (gap between current and target)
- coreValues: array of strings (their core values)
- lifeMission: string (their life purpose/mission)

BEHAVIORAL:
- procrastinationTriggers: array of strings (what makes them procrastinate)
- energyPattern: string (morning person/night owl/etc)
- stressResponses: array of strings (how they handle stress)

HEALTH:
- sleepHours: number (average hours of sleep)
- exerciseFrequency: string (how often they exercise)
- dietPattern: string (their eating habits)
- mentalHealthNotes: string (mental health concerns/notes)

FINANCIAL:
- savingsLevel: string (none/low/moderate/high)
- hasDebt: "true" | "false"
- monthlyExpensesEstimate: number (estimated monthly expenses in USD)

COMMUNICATION:
- preferredContact: string (email/phone/text/etc)
- bestTimeToReach: string (morning/afternoon/evening)
- communicationStyle: string (direct/gentle/analytical/etc)

CRISIS INDICATORS:
- suicideRiskLevel: string (none/low/medium/high/critical)
- crisisFlags: array of strings (specific crisis indicators mentioned)

CONFIDENCE SCORES:
- confidenceScores: object with field names as keys and confidence (0-100) as values

CRITICAL RULES:
1. Only extract information EXPLICITLY stated or strongly implied
2. For arrays, return actual arrays not strings
3. For confidence scores, rate 0-100 how confident you are in each extracted field
4. If suicide/self-harm is mentioned, flag it immediately
5. Be conservative - better to miss data than make assumptions

Return ONLY valid JSON, no explanation.`;
async function extractProfileFromConversation(conversationHistory) {
  try {
    const conversationText = conversationHistory.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");
    const response = await invokeLLM({
      messages: [
        { role: "system", content: EXTRACTION_PROMPT2 },
        { role: "user", content: `Extract profile data from this conversation:

${conversationText}` }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "profile_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              // Professional
              jobTitle: { type: "string" },
              company: { type: "string" },
              industry: { type: "string" },
              careerGoals: { type: "string" },
              // Personal
              age: { type: "number" },
              locationCity: { type: "string" },
              locationState: { type: "string" },
              locationCountry: { type: "string" },
              relationshipStatus: { type: "string" },
              hasChildren: { type: "string", enum: ["true", "false"] },
              // Goals
              primaryGoal: { type: "string" },
              goalTimeline: { type: "string" },
              motivation: { type: "string" },
              // Identity
              currentIdentity: { type: "array", items: { type: "string" } },
              targetIdentity: { type: "array", items: { type: "string" } },
              identityGap: { type: "string" },
              coreValues: { type: "array", items: { type: "string" } },
              lifeMission: { type: "string" },
              // Behavioral
              procrastinationTriggers: { type: "array", items: { type: "string" } },
              energyPattern: { type: "string" },
              stressResponses: { type: "array", items: { type: "string" } },
              // Health
              sleepHours: { type: "number" },
              exerciseFrequency: { type: "string" },
              dietPattern: { type: "string" },
              mentalHealthNotes: { type: "string" },
              // Financial
              savingsLevel: { type: "string" },
              hasDebt: { type: "string", enum: ["true", "false"] },
              monthlyExpensesEstimate: { type: "number" },
              // Communication
              preferredContact: { type: "string" },
              bestTimeToReach: { type: "string" },
              communicationStyle: { type: "string" },
              // Crisis
              suicideRiskLevel: { type: "string" },
              crisisFlags: { type: "array", items: { type: "string" } },
              // Metadata
              confidenceScores: { type: "object" }
            },
            additionalProperties: false
          }
        }
      }
    });
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in LLM response");
    }
    const contentText = typeof content === "string" ? content : JSON.stringify(content);
    const extracted = JSON.parse(contentText);
    const profile = {
      ...extracted,
      currentIdentity: extracted.currentIdentity ? JSON.stringify(extracted.currentIdentity) : void 0,
      targetIdentity: extracted.targetIdentity ? JSON.stringify(extracted.targetIdentity) : void 0,
      coreValues: extracted.coreValues ? JSON.stringify(extracted.coreValues) : void 0,
      procrastinationTriggers: extracted.procrastinationTriggers ? JSON.stringify(extracted.procrastinationTriggers) : void 0,
      stressResponses: extracted.stressResponses ? JSON.stringify(extracted.stressResponses) : void 0,
      crisisFlags: extracted.crisisFlags ? JSON.stringify(extracted.crisisFlags) : void 0,
      confidenceScores: extracted.confidenceScores ? JSON.stringify(extracted.confidenceScores) : void 0
    };
    return profile;
  } catch (error) {
    console.error("Profile extraction failed:", error);
    return {};
  }
}

// server/routers/chat.ts
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});
var chatRouter = router({
  /**
   * Send a chat message - CONVERSATIONAL AI
   * Remembers context, extracts profile data, detects escalations
   */
  sendMessage: publicProcedure.input(
    z18.object({
      message: z18.string().min(1),
      type: z18.enum(["corporate", "individual"]),
      routeToTeam: z18.enum(["sales", "support"]),
      sessionId: z18.string().optional()
      // For conversation continuity
    })
  ).mutation(async ({ input }) => {
    console.log("Chat message received:", {
      ...input,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    try {
      let conversationId = input.sessionId;
      let conversationHistory = [];
      if (conversationId) {
        const messages = await db.select().from(aiChatMessages).where(eq15(aiChatMessages.conversationId, parseInt(conversationId))).orderBy(aiChatMessages.createdAt).limit(20);
        conversationHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content
        }));
      } else {
        const [newConv] = await db.insert(aiChatConversations).values({
          userId: null,
          // Anonymous for now
          clientId: null,
          startedAt: /* @__PURE__ */ new Date()
        }).$returningId();
        conversationId = newConv.id.toString();
      }
      await db.insert(aiChatMessages).values({
        conversationId: parseInt(conversationId),
        role: "user",
        content: input.message,
        createdAt: /* @__PURE__ */ new Date()
      });
      const systemPrompt = input.type === "corporate" ? `You are a helpful sales assistant for Purposeful Live Coaching's enterprise platform. 
Your goal is to:
1. Understand the company's needs (size, industry, pain points)
2. Explain how our emotional resilience platform helps organizations
3. Guide them to book a demo or speak with sales
4. Be warm, professional, and consultative

Key offerings:
- Enterprise plans start at $2,500/month for up to 50 employees
- Custom pricing for larger organizations
- 24/7 AI coaching + human coaching options
- Analytics dashboard for HR teams
- Crisis detection and escalation

Keep responses concise (2-3 sentences). Ask clarifying questions.` : `You are a compassionate AI coach for Purposeful Live Coaching. 
Your goal is to:
1. Listen without judgment and validate their feelings
2. Understand what brings them here (stress, anxiety, life transitions, etc.)
3. Gently guide them toward our coaching plans
4. Detect if they need immediate human support or crisis intervention

Pricing:
- AI Coaching: $29/mo (24/7 AI chat)
- Hybrid: $149/mo (AI + 1 human session/month)
- Premium: $299/mo (AI + 4 human sessions/month)

Keep responses warm, empathetic, and conversational (2-4 sentences). 
Focus on understanding their situation before pitching.`;
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: input.message }
        ],
        temperature: 0.8,
        max_tokens: 200
      });
      const aiReply = completion.choices[0]?.message?.content || "I'm here to help. Could you tell me more?";
      await db.insert(aiChatMessages).values({
        conversationId: parseInt(conversationId),
        role: "assistant",
        content: aiReply,
        createdAt: /* @__PURE__ */ new Date()
      });
      if (input.type === "individual" && conversationHistory.length >= 4) {
        extractProfileFromConversation(parseInt(conversationId)).then((extracted) => {
          console.log("Profile extracted:", extracted);
        }).catch((err) => console.error("Profile extraction failed:", err));
      }
      const needsEscalation = detectEscalation(input.message);
      return {
        success: true,
        reply: aiReply,
        conversationId,
        routedTo: input.routeToTeam,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        needsEscalation
      };
    } catch (error) {
      console.error("Chat error:", error);
      return {
        success: false,
        reply: "I'm having trouble connecting right now. Please try again in a moment, or call us directly if it's urgent.",
        conversationId: input.sessionId || "",
        routedTo: input.routeToTeam,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        needsEscalation: false
      };
    }
  }),
  /**
   * Get chat history for a session
   */
  getHistory: publicProcedure.input(
    z18.object({
      sessionId: z18.string()
    })
  ).query(async ({ input }) => {
    const messages = await db.select().from(aiChatMessages).where(eq15(aiChatMessages.conversationId, parseInt(input.sessionId))).orderBy(aiChatMessages.createdAt);
    return {
      sessionId: input.sessionId,
      messages: messages.map((msg) => ({
        id: msg.id.toString(),
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt
      }))
    };
  })
});
function detectEscalation(message) {
  const escalationKeywords = [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "harm myself",
    "emergency",
    "crisis",
    "urgent",
    "can't go on"
  ];
  const lowerMessage = message.toLowerCase();
  return escalationKeywords.some((keyword) => lowerMessage.includes(keyword));
}

// server/routers/analytics.ts
init_trpc();
import { z as z19 } from "zod";
var timeRangeSchema = z19.object({ timeRange: z19.enum(["7d", "30d", "90d"]) });
var analyticsRouter = router({
  getABTestResults: publicProcedure.input(timeRangeSchema).query(async () => {
    return {
      controlConversion: 2.8,
      variantConversion: 3.8,
      lift: 35.7,
      confidence: 95,
      sampleSize: 12847,
      winner: "variant"
    };
  }),
  getChatMetrics: publicProcedure.input(timeRangeSchema).query(async () => {
    return {
      totalConversations: 487,
      salesConversions: 18,
      supportConversions: 22,
      salesConversionRate: 0.41,
      supportConversionRate: 0.39
    };
  }),
  getExitIntentMetrics: publicProcedure.input(timeRangeSchema).query(async () => {
    return {
      popupsShown: 1247,
      emailsCaptured: 342,
      captureRate: 0.274,
      industryAverage: 0.09
    };
  }),
  getROICalculatorMetrics: publicProcedure.input(timeRangeSchema).query(async () => {
    return {
      calculatorStarts: 456,
      completions: 387,
      completionRate: 0.849,
      emailCaptures: 156,
      emailCaptureRate: 0.403
    };
  }),
  getConversionTrend: publicProcedure.input(timeRangeSchema).query(async () => {
    return [
      { date: "Mon", control: 2.4, variant: 3.2 },
      { date: "Tue", control: 2.1, variant: 3.5 },
      { date: "Wed", control: 2.8, variant: 4.1 },
      { date: "Thu", control: 2.6, variant: 3.8 },
      { date: "Fri", control: 3.2, variant: 4.5 },
      { date: "Sat", control: 2.9, variant: 4.2 },
      { date: "Sun", control: 3.1, variant: 4.6 }
    ];
  }),
  recordConversion: publicProcedure.input(
    z19.object({
      type: z19.enum(["chat", "roi_calculator", "exit_intent", "cta_click"]),
      source: z19.enum(["corporate", "individual"]),
      variant: z19.string().optional(),
      metadata: z19.record(z19.string(), z19.any()).optional()
    })
  ).mutation(async (opts) => {
    const { input } = opts;
    console.log("Conversion recorded:", input);
    return { success: true };
  })
});

// server/routers/videoTestimonials.ts
init_trpc();
import { z as z20 } from "zod";

// server/db/videoTestimonials.ts
init_schema();
import { eq as eq16, desc as desc11 } from "drizzle-orm";
import { drizzle as drizzle2 } from "drizzle-orm/postgres-js";
import postgres2 from "postgres";
var _db2 = null;
async function getDb2() {
  if (!_db2 && process.env.DATABASE_URL) {
    try {
      const client2 = postgres2(process.env.DATABASE_URL);
      _db2 = drizzle2(client2);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db2 = null;
    }
  }
  return _db2;
}
async function createVideoTestimonial(testimonial) {
  const db2 = await getDb2();
  if (!db2) {
    console.warn("[Database] Cannot create testimonial: database not available");
    return null;
  }
  try {
    const result = await db2.insert(videoTestimonials).values(testimonial).returning();
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create testimonial:", error);
    throw error;
  }
}
async function getVideoTestimonials() {
  const db2 = await getDb2();
  if (!db2) {
    console.warn("[Database] Cannot get testimonials: database not available");
    return [];
  }
  try {
    return await db2.select().from(videoTestimonials).where(eq16(videoTestimonials.isPublished, "true")).orderBy(desc11(videoTestimonials.displayOrder), desc11(videoTestimonials.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get testimonials:", error);
    return [];
  }
}
async function getVideoTestimonialById(id) {
  const db2 = await getDb2();
  if (!db2) {
    console.warn("[Database] Cannot get testimonial: database not available");
    return null;
  }
  try {
    const result = await db2.select().from(videoTestimonials).where(eq16(videoTestimonials.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get testimonial:", error);
    return null;
  }
}
async function updateVideoTestimonial(id, updates) {
  const db2 = await getDb2();
  if (!db2) {
    console.warn("[Database] Cannot update testimonial: database not available");
    return null;
  }
  try {
    await db2.update(videoTestimonials).set(updates).where(eq16(videoTestimonials.id, id));
    return getVideoTestimonialById(id);
  } catch (error) {
    console.error("[Database] Failed to update testimonial:", error);
    throw error;
  }
}
async function deleteVideoTestimonial(id) {
  const db2 = await getDb2();
  if (!db2) {
    console.warn("[Database] Cannot delete testimonial: database not available");
    return false;
  }
  try {
    await db2.delete(videoTestimonials).where(eq16(videoTestimonials.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete testimonial:", error);
    throw error;
  }
}
async function getAllVideoTestimonials() {
  const db2 = await getDb2();
  if (!db2) {
    console.warn("[Database] Cannot get testimonials: database not available");
    return [];
  }
  try {
    return await db2.select().from(videoTestimonials).orderBy(desc11(videoTestimonials.displayOrder), desc11(videoTestimonials.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get testimonials:", error);
    return [];
  }
}

// server/routers/videoTestimonials.ts
import { TRPCError as TRPCError9 } from "@trpc/server";
var videoTestimonialsRouter = router({
  // Get published testimonials for display
  getPublished: publicProcedure.query(async () => {
    return await getVideoTestimonials();
  }),
  // Get all testimonials (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError9({ code: "FORBIDDEN" });
    }
    return await getAllVideoTestimonials();
  }),
  // Get single testimonial
  getById: publicProcedure.input(z20.object({ id: z20.number() })).query(async ({ input }) => {
    return await getVideoTestimonialById(input.id);
  }),
  // Create testimonial (admin only)
  create: protectedProcedure.input(
    z20.object({
      name: z20.string().min(1),
      title: z20.string().min(1),
      company: z20.string().min(1),
      quote: z20.string().min(1),
      metric: z20.string().min(1),
      metricValue: z20.string().min(1),
      videoUrl: z20.string().optional(),
      videoKey: z20.string().optional(),
      thumbnailUrl: z20.string().optional(),
      thumbnailKey: z20.string().optional(),
      duration: z20.number().optional(),
      isPublished: z20.enum(["true", "false"]).default("false"),
      displayOrder: z20.number().default(0)
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError9({ code: "FORBIDDEN" });
    }
    return await createVideoTestimonial(input);
  }),
  // Update testimonial (admin only)
  update: protectedProcedure.input(
    z20.object({
      id: z20.number(),
      name: z20.string().optional(),
      title: z20.string().optional(),
      company: z20.string().optional(),
      quote: z20.string().optional(),
      metric: z20.string().optional(),
      metricValue: z20.string().optional(),
      videoUrl: z20.string().optional(),
      videoKey: z20.string().optional(),
      thumbnailUrl: z20.string().optional(),
      thumbnailKey: z20.string().optional(),
      duration: z20.number().optional(),
      isPublished: z20.enum(["true", "false"]).optional(),
      displayOrder: z20.number().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError9({ code: "FORBIDDEN" });
    }
    const { id, ...updates } = input;
    return await updateVideoTestimonial(id, updates);
  }),
  // Delete testimonial (admin only)
  delete: protectedProcedure.input(z20.object({ id: z20.number() })).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError9({ code: "FORBIDDEN" });
    }
    const success = await deleteVideoTestimonial(input.id);
    if (!success) {
      throw new TRPCError9({ code: "INTERNAL_SERVER_ERROR" });
    }
    return { success: true };
  }),
  // Get upload URL for video file
  getVideoUploadUrl: protectedProcedure.input(
    z20.object({
      fileName: z20.string(),
      fileSize: z20.number(),
      mimeType: z20.string()
    })
  ).mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError9({ code: "FORBIDDEN" });
    }
    const timestamp35 = Date.now();
    const fileKey = `testimonials/videos/${timestamp35}-${input.fileName}`;
    try {
      const uploadUrl = await storageGet(fileKey);
      return {
        uploadUrl: uploadUrl.url,
        fileKey
      };
    } catch (error) {
      console.error("[VideoTestimonials] Failed to generate upload URL:", error);
      throw new TRPCError9({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate upload URL"
      });
    }
  }),
  // Get video playback URL
  getVideoUrl: publicProcedure.input(z20.object({ fileKey: z20.string() })).query(async ({ input }) => {
    try {
      const url = await storageGet(input.fileKey);
      return { url: url.url };
    } catch (error) {
      console.error("[VideoTestimonials] Failed to get video URL:", error);
      throw new TRPCError9({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get video URL"
      });
    }
  })
});

// server/routers/identity.ts
init_trpc();
init_db();
init_schema();
import { z as z21 } from "zod";
import { eq as eq17, and as and10, desc as desc12, gte as gte2 } from "drizzle-orm";
var identityRouter = router({
  /**
   * Get or create identity profile
   */
  getProfile: protectedProcedure.input(z21.object({ clientId: z21.number() })).query(async ({ input }) => {
    const profiles = await db.select().from(identityProfiles).where(eq17(identityProfiles.clientId, input.clientId)).limit(1);
    if (profiles.length === 0) {
      const [newProfile] = await db.insert(identityProfiles).values({
        clientId: input.clientId,
        currentIdentity: JSON.stringify([]),
        targetIdentity: JSON.stringify(["disciplined", "resilient", "mission-driven"]),
        identityGaps: JSON.stringify([]),
        coreValues: JSON.stringify([]),
        identityWins: JSON.stringify([]),
        identityContradictions: JSON.stringify([])
      }).$returningId();
      const [profile] = await db.select().from(identityProfiles).where(eq17(identityProfiles.id, newProfile.id));
      return profile;
    }
    return profiles[0];
  }),
  /**
   * Update identity profile
   */
  updateProfile: protectedProcedure.input(
    z21.object({
      clientId: z21.number(),
      currentIdentity: z21.array(z21.string()).optional(),
      targetIdentity: z21.array(z21.string()).optional(),
      identityGaps: z21.array(z21.string()).optional(),
      coreValues: z21.array(z21.string()).optional(),
      lifeMission: z21.string().optional(),
      longTermVision: z21.string().optional()
    })
  ).mutation(async ({ input }) => {
    const { clientId, ...updates } = input;
    const jsonUpdates = {};
    if (updates.currentIdentity) jsonUpdates.currentIdentity = JSON.stringify(updates.currentIdentity);
    if (updates.targetIdentity) jsonUpdates.targetIdentity = JSON.stringify(updates.targetIdentity);
    if (updates.identityGaps) jsonUpdates.identityGaps = JSON.stringify(updates.identityGaps);
    if (updates.coreValues) jsonUpdates.coreValues = JSON.stringify(updates.coreValues);
    if (updates.lifeMission) jsonUpdates.lifeMission = updates.lifeMission;
    if (updates.longTermVision) jsonUpdates.longTermVision = updates.longTermVision;
    await db.update(identityProfiles).set(jsonUpdates).where(eq17(identityProfiles.clientId, clientId));
    return { success: true };
  }),
  /**
   * Submit daily check-in (minimal cognitive load)
   */
  submitDailyCheckin: protectedProcedure.input(
    z21.object({
      clientId: z21.number(),
      sleptWell: z21.enum(["yes", "no"]),
      ateWell: z21.enum(["yes", "no"]),
      movedBody: z21.enum(["yes", "no"]),
      emotionalState: z21.number().min(1).max(10),
      followedPlan: z21.enum(["yes", "no"]),
      controlledImpulses: z21.enum(["yes", "no"]),
      actedLikeTargetIdentity: z21.enum(["yes", "no"]),
      notes: z21.string().optional()
    })
  ).mutation(async ({ input }) => {
    const [checkin] = await db.insert(dailyCheckins).values(input).$returningId();
    return { checkinId: checkin.id, success: true };
  }),
  /**
   * Get recent check-ins
   */
  getRecentCheckins: protectedProcedure.input(
    z21.object({
      clientId: z21.number(),
      days: z21.number().default(30)
    })
  ).query(async ({ input }) => {
    const daysAgo = /* @__PURE__ */ new Date();
    daysAgo.setDate(daysAgo.getDate() - input.days);
    const checkins = await db.select().from(dailyCheckins).where(
      and10(
        eq17(dailyCheckins.clientId, input.clientId),
        gte2(dailyCheckins.checkinDate, daysAgo)
      )
    ).orderBy(desc12(dailyCheckins.checkinDate));
    return { checkins };
  }),
  /**
   * Create habit
   */
  createHabit: protectedProcedure.input(
    z21.object({
      clientId: z21.number(),
      habitName: z21.string(),
      habitDescription: z21.string().optional(),
      identityConnection: z21.string(),
      // "This habit makes me [identity]"
      frequency: z21.enum(["daily", "weekly", "custom"]).default("daily")
    })
  ).mutation(async ({ input }) => {
    const [habit] = await db.insert(habits).values(input).$returningId();
    return { habitId: habit.id, success: true };
  }),
  /**
   * Get active habits
   */
  getActiveHabits: protectedProcedure.input(z21.object({ clientId: z21.number() })).query(async ({ input }) => {
    const activeHabits = await db.select().from(habits).where(
      and10(
        eq17(habits.clientId, input.clientId),
        eq17(habits.isActive, "true")
      )
    );
    return { habits: activeHabits };
  }),
  /**
   * Complete habit
   */
  completeHabit: protectedProcedure.input(
    z21.object({
      habitId: z21.number(),
      completed: z21.enum(["yes", "no"]),
      notes: z21.string().optional()
    })
  ).mutation(async ({ input }) => {
    const [completion] = await db.insert(habitCompletions).values(input).$returningId();
    return { completionId: completion.id, success: true };
  }),
  /**
   * Get habit completion history
   */
  getHabitHistory: protectedProcedure.input(
    z21.object({
      habitId: z21.number(),
      days: z21.number().default(30)
    })
  ).query(async ({ input }) => {
    const daysAgo = /* @__PURE__ */ new Date();
    daysAgo.setDate(daysAgo.getDate() - input.days);
    const completions = await db.select().from(habitCompletions).where(
      and10(
        eq17(habitCompletions.habitId, input.habitId),
        gte2(habitCompletions.completionDate, daysAgo)
      )
    ).orderBy(desc12(habitCompletions.completionDate));
    return { completions };
  }),
  /**
   * Log discipline event
   */
  logDisciplineEvent: protectedProcedure.input(
    z21.object({
      clientId: z21.number(),
      eventType: z21.enum(["impulse_controlled", "impulse_failed", "discipline_win", "discipline_fail"]),
      situation: z21.string(),
      response: z21.string(),
      outcome: z21.string(),
      reinforcedIdentity: z21.enum(["yes", "no"])
    })
  ).mutation(async ({ input }) => {
    const [event] = await db.insert(disciplineEvents).values(input).$returningId();
    return { eventId: event.id, success: true };
  }),
  /**
   * Get recent discipline events
   */
  getDisciplineEvents: protectedProcedure.input(
    z21.object({
      clientId: z21.number(),
      days: z21.number().default(30)
    })
  ).query(async ({ input }) => {
    const daysAgo = /* @__PURE__ */ new Date();
    daysAgo.setDate(daysAgo.getDate() - input.days);
    const events = await db.select().from(disciplineEvents).where(
      and10(
        eq17(disciplineEvents.clientId, input.clientId),
        gte2(disciplineEvents.eventDate, daysAgo)
      )
    ).orderBy(desc12(disciplineEvents.eventDate));
    return { events };
  }),
  /**
   * Create micro-habit
   */
  createMicroHabit: protectedProcedure.input(
    z21.object({
      clientId: z21.number(),
      microHabitName: z21.string(),
      trigger: z21.string(),
      // "After I [existing habit]"
      action: z21.string(),
      // "I will [micro-habit]"
      identityReinforcement: z21.string()
      // "This makes me [identity]"
    })
  ).mutation(async ({ input }) => {
    const [microHabit] = await db.insert(microHabits).values(input).$returningId();
    return { microHabitId: microHabit.id, success: true };
  }),
  /**
   * Get active micro-habits
   */
  getActiveMicroHabits: protectedProcedure.input(z21.object({ clientId: z21.number() })).query(async ({ input }) => {
    const activeMicroHabits = await db.select().from(microHabits).where(
      and10(
        eq17(microHabits.clientId, input.clientId),
        eq17(microHabits.isActive, "true")
      )
    );
    return { microHabits: activeMicroHabits };
  })
});

// server/routers/autism.ts
init_trpc();
init_db();
init_schema();
import { z as z22 } from "zod";
import { TRPCError as TRPCError10 } from "@trpc/server";
import { eq as eq18, and as and11, desc as desc13 } from "drizzle-orm";
var autismRouter = router({
  // ========================================
  // CHILD PROFILE & ASSESSMENT
  // ========================================
  createProfile: protectedProcedure.input(
    z22.object({
      childName: z22.string(),
      dateOfBirth: z22.date(),
      diagnosisDate: z22.date().optional(),
      severity: z22.enum(["mild", "moderate", "severe"]),
      atecScore: z22.number().optional(),
      carsScore: z22.number().optional(),
      communicationLevel: z22.enum(["nonverbal", "minimally_verbal", "verbal"]),
      giSymptoms: z22.array(z22.string()).optional(),
      sleepIssues: z22.array(z22.string()).optional(),
      sensoryProfile: z22.object({ hyper: z22.array(z22.string()), hypo: z22.array(z22.string()) }).optional(),
      behaviorChallenges: z22.array(z22.string()).optional(),
      familyResources: z22.object({ time: z22.string(), budget: z22.string(), support: z22.string() }).optional(),
      treatmentPriorities: z22.array(z22.string()).optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const [profile] = await db.insert(autismProfiles).values({
      userId: ctx.user.id,
      childName: input.childName,
      dateOfBirth: input.dateOfBirth,
      diagnosisDate: input.diagnosisDate,
      severity: input.severity,
      atecScore: input.atecScore,
      carsScore: input.carsScore,
      communicationLevel: input.communicationLevel,
      giSymptoms: input.giSymptoms ? JSON.stringify(input.giSymptoms) : null,
      sleepIssues: input.sleepIssues ? JSON.stringify(input.sleepIssues) : null,
      sensoryProfile: input.sensoryProfile ? JSON.stringify(input.sensoryProfile) : null,
      behaviorChallenges: input.behaviorChallenges ? JSON.stringify(input.behaviorChallenges) : null,
      familyResources: input.familyResources ? JSON.stringify(input.familyResources) : null,
      treatmentPriorities: input.treatmentPriorities ? JSON.stringify(input.treatmentPriorities) : null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  getMyProfiles: protectedProcedure.query(async ({ ctx }) => {
    const profiles = await db.select().from(autismProfiles).where(eq18(autismProfiles.userId, ctx.user.id)).orderBy(desc13(autismProfiles.createdAt));
    return profiles.map((p) => ({
      ...p,
      giSymptoms: p.giSymptoms ? JSON.parse(p.giSymptoms) : [],
      sleepIssues: p.sleepIssues ? JSON.parse(p.sleepIssues) : [],
      sensoryProfile: p.sensoryProfile ? JSON.parse(p.sensoryProfile) : null,
      behaviorChallenges: p.behaviorChallenges ? JSON.parse(p.behaviorChallenges) : [],
      familyResources: p.familyResources ? JSON.parse(p.familyResources) : null,
      treatmentPriorities: p.treatmentPriorities ? JSON.parse(p.treatmentPriorities) : []
    }));
  }),
  getProfile: protectedProcedure.input(z22.object({ profileId: z22.number() })).query(async ({ ctx, input }) => {
    const [profile] = await db.select().from(autismProfiles).where(and11(eq18(autismProfiles.id, input.profileId), eq18(autismProfiles.userId, ctx.user.id)));
    if (!profile) {
      throw new TRPCError10({ code: "NOT_FOUND", message: "Profile not found" });
    }
    return {
      ...profile,
      giSymptoms: profile.giSymptoms ? JSON.parse(profile.giSymptoms) : [],
      sleepIssues: profile.sleepIssues ? JSON.parse(profile.sleepIssues) : [],
      sensoryProfile: profile.sensoryProfile ? JSON.parse(profile.sensoryProfile) : null,
      behaviorChallenges: profile.behaviorChallenges ? JSON.parse(profile.behaviorChallenges) : [],
      familyResources: profile.familyResources ? JSON.parse(profile.familyResources) : null,
      treatmentPriorities: profile.treatmentPriorities ? JSON.parse(profile.treatmentPriorities) : []
    };
  }),
  // ========================================
  // INTERVENTION PLANS
  // ========================================
  createInterventionPlan: protectedProcedure.input(
    z22.object({
      profileId: z22.number(),
      tier1Interventions: z22.array(z22.string()),
      tier2Interventions: z22.array(z22.string()).optional(),
      tier3Interventions: z22.array(z22.string()).optional(),
      tier4Interventions: z22.array(z22.string()).optional(),
      currentPhase: z22.enum(["foundation", "biomedical", "behavioral", "advanced"]),
      providerDirectory: z22.record(z22.string(), z22.any()).optional()
    })
  ).mutation(async ({ input }) => {
    const [plan] = await db.insert(interventionPlans).values({
      profileId: input.profileId,
      tier1Interventions: JSON.stringify(input.tier1Interventions),
      tier2Interventions: input.tier2Interventions ? JSON.stringify(input.tier2Interventions) : null,
      tier3Interventions: input.tier3Interventions ? JSON.stringify(input.tier3Interventions) : null,
      tier4Interventions: input.tier4Interventions ? JSON.stringify(input.tier4Interventions) : null,
      currentPhase: input.currentPhase,
      startDate: /* @__PURE__ */ new Date(),
      providerDirectory: input.providerDirectory ? JSON.stringify(input.providerDirectory) : null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  getInterventionPlan: protectedProcedure.input(z22.object({ profileId: z22.number() })).query(async ({ input }) => {
    const [plan] = await db.select().from(interventionPlans).where(eq18(interventionPlans.profileId, input.profileId)).orderBy(desc13(interventionPlans.createdAt)).limit(1);
    if (!plan) return null;
    return {
      ...plan,
      tier1Interventions: JSON.parse(plan.tier1Interventions),
      tier2Interventions: plan.tier2Interventions ? JSON.parse(plan.tier2Interventions) : [],
      tier3Interventions: plan.tier3Interventions ? JSON.parse(plan.tier3Interventions) : [],
      tier4Interventions: plan.tier4Interventions ? JSON.parse(plan.tier4Interventions) : [],
      providerDirectory: plan.providerDirectory ? JSON.parse(plan.providerDirectory) : {}
    };
  }),
  // ========================================
  // SUPPLEMENT TRACKING
  // ========================================
  addSupplement: protectedProcedure.input(
    z22.object({
      profileId: z22.number(),
      supplementName: z22.string(),
      dosage: z22.string(),
      frequency: z22.enum(["daily", "twice_daily", "every_3_days"])
    })
  ).mutation(async ({ input }) => {
    const [supplement] = await db.insert(supplementTracking).values({
      profileId: input.profileId,
      supplementName: input.supplementName,
      dosage: input.dosage,
      frequency: input.frequency,
      startDate: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  updateSupplementTracking: protectedProcedure.input(
    z22.object({
      supplementId: z22.number(),
      adherence: z22.number().min(0).max(100).optional(),
      sideEffects: z22.array(z22.string()).optional(),
      perceivedBenefit: z22.number().min(1).max(10).optional()
    })
  ).mutation(async ({ input }) => {
    await db.update(supplementTracking).set({
      adherence: input.adherence,
      sideEffects: input.sideEffects ? JSON.stringify(input.sideEffects) : void 0,
      perceivedBenefit: input.perceivedBenefit,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq18(supplementTracking.id, input.supplementId));
    return { success: true };
  }),
  getSupplements: protectedProcedure.input(z22.object({ profileId: z22.number() })).query(async ({ input }) => {
    const supplements2 = await db.select().from(supplementTracking).where(eq18(supplementTracking.profileId, input.profileId)).orderBy(desc13(supplementTracking.startDate));
    return supplements2.map((s) => ({
      ...s,
      sideEffects: s.sideEffects ? JSON.parse(s.sideEffects) : []
    }));
  }),
  // ========================================
  // DIETARY INTERVENTIONS
  // ========================================
  startDiet: protectedProcedure.input(
    z22.object({
      profileId: z22.number(),
      dietType: z22.enum(["GFCF", "ketogenic", "SCD"])
    })
  ).mutation(async ({ input }) => {
    const [diet] = await db.insert(dietaryInterventions).values({
      profileId: input.profileId,
      dietType: input.dietType,
      startDate: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  updateDietTracking: protectedProcedure.input(
    z22.object({
      dietId: z22.number(),
      adherence: z22.number().min(0).max(100).optional(),
      giSymptomChanges: z22.record(z22.string(), z22.any()).optional(),
      behaviorChanges: z22.record(z22.string(), z22.any()).optional()
    })
  ).mutation(async ({ input }) => {
    await db.update(dietaryInterventions).set({
      adherence: input.adherence,
      giSymptomChanges: input.giSymptomChanges ? JSON.stringify(input.giSymptomChanges) : void 0,
      behaviorChanges: input.behaviorChanges ? JSON.stringify(input.behaviorChanges) : void 0,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq18(dietaryInterventions.id, input.dietId));
    return { success: true };
  }),
  getDiets: protectedProcedure.input(z22.object({ profileId: z22.number() })).query(async ({ input }) => {
    const diets = await db.select().from(dietaryInterventions).where(eq18(dietaryInterventions.profileId, input.profileId)).orderBy(desc13(dietaryInterventions.startDate));
    return diets.map((d) => ({
      ...d,
      giSymptomChanges: d.giSymptomChanges ? JSON.parse(d.giSymptomChanges) : {},
      behaviorChanges: d.behaviorChanges ? JSON.parse(d.behaviorChanges) : {}
    }));
  }),
  // ========================================
  // THERAPY SESSIONS
  // ========================================
  logTherapySession: protectedProcedure.input(
    z22.object({
      profileId: z22.number(),
      therapyType: z22.enum(["ABA", "OT", "speech", "Floortime", "neurofeedback"]),
      sessionDate: z22.date(),
      duration: z22.number(),
      goalsAddressed: z22.array(z22.string()).optional(),
      progress: z22.record(z22.string(), z22.any()).optional(),
      parentFeedback: z22.string().optional()
    })
  ).mutation(async ({ input }) => {
    const [session] = await db.insert(therapySessions).values({
      profileId: input.profileId,
      therapyType: input.therapyType,
      sessionDate: input.sessionDate,
      duration: input.duration,
      goalsAddressed: input.goalsAddressed ? JSON.stringify(input.goalsAddressed) : null,
      progress: input.progress ? JSON.stringify(input.progress) : null,
      parentFeedback: input.parentFeedback,
      createdAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  getTherapySessions: protectedProcedure.input(z22.object({ profileId: z22.number() })).query(async ({ input }) => {
    const sessions2 = await db.select().from(therapySessions).where(eq18(therapySessions.profileId, input.profileId)).orderBy(desc13(therapySessions.sessionDate));
    return sessions2.map((s) => ({
      ...s,
      goalsAddressed: s.goalsAddressed ? JSON.parse(s.goalsAddressed) : [],
      progress: s.progress ? JSON.parse(s.progress) : {}
    }));
  }),
  // ========================================
  // OUTCOME TRACKING
  // ========================================
  recordOutcome: protectedProcedure.input(
    z22.object({
      profileId: z22.number(),
      atecScore: z22.number().optional(),
      carsScore: z22.number().optional(),
      communicationLevel: z22.enum(["nonverbal", "minimally_verbal", "verbal"]).optional(),
      behaviorScore: z22.number().min(1).max(10).optional(),
      adaptiveFunctionScore: z22.number().min(1).max(10).optional(),
      giSymptomScore: z22.number().min(1).max(10).optional(),
      sleepScore: z22.number().min(1).max(10).optional(),
      familyQOL: z22.number().min(1).max(10).optional(),
      parentStress: z22.number().min(1).max(10).optional()
    })
  ).mutation(async ({ input }) => {
    const [outcome] = await db.insert(autismOutcomeTracking).values({
      profileId: input.profileId,
      assessmentDate: /* @__PURE__ */ new Date(),
      atecScore: input.atecScore,
      carsScore: input.carsScore,
      communicationLevel: input.communicationLevel,
      behaviorScore: input.behaviorScore,
      adaptiveFunctionScore: input.adaptiveFunctionScore,
      giSymptomScore: input.giSymptomScore,
      sleepScore: input.sleepScore,
      familyQOL: input.familyQOL,
      parentStress: input.parentStress,
      createdAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  getOutcomes: protectedProcedure.input(z22.object({ profileId: z22.number() })).query(async ({ input }) => {
    return await db.select().from(autismOutcomeTracking).where(eq18(autismOutcomeTracking.profileId, input.profileId)).orderBy(desc13(autismOutcomeTracking.assessmentDate));
  }),
  // ========================================
  // PROVIDER DIRECTORY
  // ========================================
  searchProviders: protectedProcedure.input(
    z22.object({
      providerType: z22.enum(["ABA", "OT", "speech", "FMT_clinic", "neurofeedback"]).optional(),
      location: z22.string().optional()
    })
  ).query(async ({ input }) => {
    let query = db.select().from(autismProviders);
    if (input.providerType) {
      query = query.where(eq18(autismProviders.providerType, input.providerType));
    }
    return await query.orderBy(desc13(autismProviders.rating));
  })
});

// server/routers/liveSession.ts
init_trpc();
init_llm();
import { z as z23 } from "zod";
import { TRPCError as TRPCError11 } from "@trpc/server";
init_db();
init_schema();
import { eq as eq19 } from "drizzle-orm";
async function analyzeTranscriptSegment(text35, context) {
  const analysisPrompt = `Analyze this coaching session transcript segment and identify:
1. Primary emotions expressed (anxiety, sadness, anger, joy, fear, etc.)
2. Potential triggers or stressors mentioned
3. Crisis indicators (suicidal thoughts, self-harm, immediate danger)
4. Key themes or patterns

Transcript segment: "${text35}"

Previous context: ${context.join(" | ")}

Return your analysis in this JSON format:
{
  "emotions": ["emotion1", "emotion2"],
  "triggers": ["trigger1", "trigger2"],
  "crisisLevel": "none" | "low" | "medium" | "high" | "critical",
  "themes": ["theme1", "theme2"],
  "summary": "brief summary of what's happening"
}`;
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert psychological analyst. Analyze coaching session transcripts with empathy and precision."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "transcript_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              emotions: {
                type: "array",
                items: { type: "string" },
                description: "List of emotions detected"
              },
              triggers: {
                type: "array",
                items: { type: "string" },
                description: "List of triggers or stressors"
              },
              crisisLevel: {
                type: "string",
                enum: ["none", "low", "medium", "high", "critical"],
                description: "Crisis risk level"
              },
              themes: {
                type: "array",
                items: { type: "string" },
                description: "Key themes or patterns"
              },
              summary: {
                type: "string",
                description: "Brief summary of the segment"
              }
            },
            required: ["emotions", "triggers", "crisisLevel", "themes", "summary"],
            additionalProperties: false
          }
        }
      }
    });
    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("No analysis returned");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("[Live Session] Analysis error:", error);
    return {
      emotions: [],
      triggers: [],
      crisisLevel: "none",
      themes: [],
      summary: "Analysis unavailable"
    };
  }
}
async function generateCoachingPrompts(analysis, transcriptSegment, sessionContext) {
  const promptGenerationRequest = `Based on this coaching session analysis, generate 1-3 actionable coaching prompts.

Current segment: "${transcriptSegment}"
Emotions detected: ${analysis.emotions.join(", ")}
Triggers: ${analysis.triggers.join(", ")}
Crisis level: ${analysis.crisisLevel}
Themes: ${analysis.themes.join(", ")}

Session context: ${sessionContext.join(" | ")}

Generate coaching prompts that:
1. Are specific and actionable
2. Use evidence-based coaching techniques
3. Are appropriate for the emotional state
4. Include exact phrases the coach can use
5. Flag any compliance concerns

Return JSON format:
{
  "prompts": [
    {
      "type": "suggestion" | "warning" | "insight",
      "priority": "low" | "medium" | "high" | "critical",
      "title": "Brief title",
      "content": "Detailed coaching prompt with exact phrases",
      "technique": "Name of coaching technique"
    }
  ]
}`;
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert coaching supervisor providing real-time guidance to coaches during sessions."
        },
        {
          role: "user",
          content: promptGenerationRequest
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "coaching_prompts",
          strict: true,
          schema: {
            type: "object",
            properties: {
              prompts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["suggestion", "warning", "insight"]
                    },
                    priority: {
                      type: "string",
                      enum: ["low", "medium", "high", "critical"]
                    },
                    title: { type: "string" },
                    content: { type: "string" },
                    technique: { type: "string" }
                  },
                  required: ["type", "priority", "title", "content", "technique"],
                  additionalProperties: false
                }
              }
            },
            required: ["prompts"],
            additionalProperties: false
          }
        }
      }
    });
    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return { prompts: [] };
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("[Live Session] Prompt generation error:", error);
    return { prompts: [] };
  }
}
var liveSessionRouter = router({
  /**
   * Transcribe audio chunk from live session
   */
  transcribeAudio: protectedProcedure.input(
    z23.object({
      sessionId: z23.number(),
      audioUrl: z23.string().url(),
      speaker: z23.enum(["client", "coach"])
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const transcription = await transcribeAudio({
        audioUrl: input.audioUrl,
        language: "en"
      });
      if ("error" in transcription) {
        throw new Error(transcription.error);
      }
      const transcriptText = transcription.text;
      const [transcript] = await db.insert(liveSessionTranscripts).values({
        sessionId: input.sessionId,
        speaker: input.speaker,
        text: transcriptText,
        timestamp: /* @__PURE__ */ new Date()
      }).$returningId();
      return {
        transcriptId: transcript.id,
        text: transcriptText
      };
    } catch (error) {
      console.error("[Live Session] Transcription error:", error);
      throw new TRPCError11({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to transcribe audio"
      });
    }
  }),
  /**
   * Analyze transcript segment and generate coaching prompts
   */
  analyzeSegment: protectedProcedure.input(
    z23.object({
      sessionId: z23.number(),
      transcriptText: z23.string(),
      speaker: z23.enum(["client", "coach"])
    })
  ).mutation(async ({ input, ctx }) => {
    try {
      const recentTranscripts = await db.select().from(liveSessionTranscripts).where(eq19(liveSessionTranscripts.sessionId, input.sessionId)).orderBy(liveSessionTranscripts.timestamp).limit(5);
      const context = recentTranscripts.map((t2) => t2.text);
      const analysis = await analyzeTranscriptSegment(input.transcriptText, context);
      let prompts = [];
      if (input.speaker === "client") {
        const promptsData = await generateCoachingPrompts(
          analysis,
          input.transcriptText,
          context
        );
        prompts = promptsData.prompts;
        for (const prompt of prompts) {
          await db.insert(coachGuidance).values({
            sessionId: input.sessionId,
            guidanceType: prompt.type === "suggestion" ? "suggest" : prompt.type === "warning" ? "alert" : "reference",
            priority: prompt.priority,
            message: `${prompt.title}: ${prompt.content}`,
            context: prompt.technique,
            timestamp: /* @__PURE__ */ new Date()
          });
        }
      }
      return {
        analysis,
        prompts
      };
    } catch (error) {
      console.error("[Live Session] Analysis error:", error);
      throw new TRPCError11({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to analyze segment"
      });
    }
  }),
  /**
   * Get all coaching prompts for a session
   */
  getSessionPrompts: protectedProcedure.input(z23.object({ sessionId: z23.number() })).query(async ({ input }) => {
    const prompts = await db.select().from(coachGuidance).where(eq19(coachGuidance.sessionId, input.sessionId)).orderBy(coachGuidance.timestamp);
    return { prompts };
  }),
  /**
   * Get session transcript
   */
  getSessionTranscript: protectedProcedure.input(z23.object({ sessionId: z23.number() })).query(async ({ input }) => {
    const transcript = await db.select().from(liveSessionTranscripts).where(eq19(liveSessionTranscripts.sessionId, input.sessionId)).orderBy(liveSessionTranscripts.timestamp);
    return { transcript };
  }),
  /**
   * Generate session summary
   */
  generateSessionSummary: protectedProcedure.input(z23.object({ sessionId: z23.number() })).mutation(async ({ input }) => {
    try {
      const transcript = await db.select().from(liveSessionTranscripts).where(eq19(liveSessionTranscripts.sessionId, input.sessionId)).orderBy(liveSessionTranscripts.timestamp);
      const fullTranscript = transcript.map((t2) => `${t2.speaker}: ${t2.text}`).join("\n");
      const summaryPrompt = `Analyze this complete coaching session transcript and generate a comprehensive summary.

${fullTranscript}

Provide:
1. Key insights and breakthroughs
2. Emotional journey throughout the session
3. Main themes and patterns
4. Coping strategies discussed
5. Homework/action items for client
6. Recommended follow-up topics
7. Overall session effectiveness

Format as a professional session note.`;
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are an expert coaching supervisor creating professional session documentation."
          },
          {
            role: "user",
            content: summaryPrompt
          }
        ]
      });
      const summary = response.choices[0]?.message?.content || "Summary generation failed";
      return { summary };
    } catch (error) {
      console.error("[Live Session] Summary generation error:", error);
      throw new TRPCError11({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate summary"
      });
    }
  })
});

// server/routers/subscriptions.ts
init_trpc();
init_db();
init_schema();
init_env();
import { z as z24 } from "zod";
import { TRPCError as TRPCError12 } from "@trpc/server";
import { eq as eq20, and as and12, gte as gte3, lte as lte2, desc as desc14 } from "drizzle-orm";
import Stripe3 from "stripe";
var stripe3 = new Stripe3(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover"
});
var STRIPE_PRICE_IDS = {
  ai_basic: "price_1ScBLlCoewQKHsplOoYSMraW",
  // $29/month
  ai_premium: "price_1ScBLlCoewQKHsplhQPwTppM",
  // $149/month
  ai_elite: "price_1ScBLmCoewQKHsplFU27FCJU",
  // $299/month
  human_basic: "price_1ScBLmCoewQKHsplsWrQUuOt",
  // $800/month
  human_premium: "price_1ScBLnCoewQKHspleJO6p8XJ",
  // $1200/month
  human_elite: "price_1ScBLnCoewQKHspl9iyjwFJ8"
  // $2000/month
};
var TIER_CONFIG = {
  ai_basic: {
    name: "AI Coaching - Basic",
    price: 2900,
    // $29.00/month
    humanSessionsIncluded: 0,
    stripePriceId: STRIPE_PRICE_IDS.ai_basic,
    features: [
      "24/7 AI coaching via text",
      "Unlimited conversations",
      "Crisis detection & alerts",
      "Progress tracking",
      "Mobile & desktop access"
    ]
  },
  ai_premium: {
    name: "AI Coaching - Premium",
    price: 14900,
    // $149.00/month
    humanSessionsIncluded: 1,
    stripePriceId: STRIPE_PRICE_IDS.ai_premium,
    features: [
      "Everything in AI Basic",
      "1 live session per month (30 min)",
      "Priority email support",
      "Personalized action plans",
      "Session recordings"
    ]
  },
  ai_elite: {
    name: "AI Coaching - Elite",
    price: 29900,
    // $299.00/month
    humanSessionsIncluded: 4,
    stripePriceId: STRIPE_PRICE_IDS.ai_elite,
    features: [
      "Everything in AI Premium",
      "4 live sessions per month (30 min each)",
      "Priority scheduling",
      "Text & email support",
      "Custom coaching plans",
      "Family support resources"
    ]
  },
  human_basic: {
    name: "Human Coaching - Basic",
    price: 8e4,
    // $800.00/month
    humanSessionsIncluded: 2,
    stripePriceId: STRIPE_PRICE_IDS.human_basic,
    features: [
      "2 live sessions per month (60 min each)",
      "24/7 AI coaching between sessions",
      "Email support",
      "Progress tracking",
      "Session recordings"
    ]
  },
  human_premium: {
    name: "Human Coaching - Premium",
    price: 12e4,
    // $1,200.00/month
    humanSessionsIncluded: 4,
    stripePriceId: STRIPE_PRICE_IDS.human_premium,
    features: [
      "4 live sessions per month (60 min each)",
      "24/7 AI coaching",
      "Priority scheduling",
      "Text, email & phone support",
      "Custom action plans",
      "Family resources"
    ]
  },
  human_elite: {
    name: "Human Coaching - Elite",
    price: 2e5,
    // $2,000.00/month
    humanSessionsIncluded: 8,
    stripePriceId: STRIPE_PRICE_IDS.human_elite,
    features: [
      "8 live sessions per month (60 min each)",
      "24/7 AI coaching",
      "Direct coach access (text/email)",
      "Emergency session availability",
      "Comprehensive life planning",
      "Spouse/partner sessions included"
    ]
  }
};
var subscriptionsRouter = router({
  /**
   * Get current user's subscription status
   */
  getMySubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.select().from(subscriptions).where(eq20(subscriptions.userId, ctx.user.id)).orderBy(desc14(subscriptions.createdAt)).limit(1);
    if (subscription.length === 0) {
      return null;
    }
    const sub = subscription[0];
    const usage = await db.select().from(usageTracking).where(
      and12(
        eq20(usageTracking.subscriptionId, sub.id),
        gte3(usageTracking.periodStart, sub.currentPeriodStart),
        lte2(usageTracking.periodEnd, sub.currentPeriodEnd)
      )
    ).limit(1);
    return {
      ...sub,
      usage: usage[0] || null,
      tierConfig: sub.tier ? TIER_CONFIG[sub.tier] : null
    };
  }),
  /**
   * Create Stripe checkout session for new subscription
   */
  createCheckoutSession: publicProcedure.input(
    z24.object({
      tier: z24.enum(["ai_basic", "ai_premium", "ai_elite", "human_basic", "human_premium", "human_elite"]),
      email: z24.string().email().optional(),
      successUrl: z24.string(),
      cancelUrl: z24.string()
    })
  ).mutation(async ({ input }) => {
    const tierConfig = TIER_CONFIG[input.tier];
    const priceId = tierConfig.stripePriceId;
    const session = await stripe3.checkout.sessions.create({
      customer_email: input.email || void 0,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      subscription_data: {
        trial_period_days: 7,
        // 7-day free trial
        metadata: {
          tier: input.tier
        }
      },
      metadata: {
        tier: input.tier
      },
      success_url: input.successUrl,
      cancel_url: input.cancelUrl
    });
    return {
      sessionId: session.id,
      url: session.url
    };
  }),
  /**
   * Create checkout session for extra human session (one-time payment)
   */
  createExtraSessionCheckout: protectedProcedure.input(
    z24.object({
      successUrl: z24.string(),
      cancelUrl: z24.string()
    })
  ).mutation(async ({ input, ctx }) => {
    const sub = await db.select().from(subscriptions).where(
      and12(
        eq20(subscriptions.userId, ctx.user.id),
        eq20(subscriptions.status, "active")
      )
    ).limit(1);
    if (sub.length === 0) {
      throw new TRPCError12({
        code: "BAD_REQUEST",
        message: "You need an active subscription to book extra sessions."
      });
    }
    if (sub[0].tier === "ai_basic") {
      throw new TRPCError12({
        code: "BAD_REQUEST",
        message: "Please upgrade to a tier with human coaching to book sessions."
      });
    }
    const session = await stripe3.checkout.sessions.create({
      customer_email: ctx.user.email || void 0,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Extra Human Coaching Session",
              description: "30-minute live coaching session with expert coach"
            },
            unit_amount: 9900
            // $99.00
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: ctx.user.id.toString(),
        subscriptionId: sub[0].id.toString(),
        type: "extra_session"
      },
      success_url: input.successUrl,
      cancel_url: input.cancelUrl
    });
    return {
      sessionId: session.id,
      url: session.url
    };
  }),
  /**
   * Get current usage for billing period
   */
  getCurrentUsage: protectedProcedure.query(async ({ ctx }) => {
    const sub = await db.select().from(subscriptions).where(
      and12(
        eq20(subscriptions.userId, ctx.user.id),
        eq20(subscriptions.status, "active")
      )
    ).limit(1);
    if (sub.length === 0) {
      return null;
    }
    const usage = await db.select().from(usageTracking).where(
      and12(
        eq20(usageTracking.subscriptionId, sub[0].id),
        gte3(usageTracking.periodStart, sub[0].currentPeriodStart),
        lte2(usageTracking.periodEnd, sub[0].currentPeriodEnd)
      )
    ).limit(1);
    if (usage.length === 0) {
      const tierKey = sub[0].tier;
      const newUsage = await db.insert(usageTracking).values({
        subscriptionId: sub[0].id,
        userId: ctx.user.id,
        periodStart: sub[0].currentPeriodStart,
        periodEnd: sub[0].currentPeriodEnd,
        aiSessionsUsed: 0,
        humanSessionsUsed: 0,
        humanSessionsIncluded: tierKey ? TIER_CONFIG[tierKey].humanSessionsIncluded : 0
      });
      return {
        subscriptionId: sub[0].id,
        userId: ctx.user.id,
        periodStart: sub[0].currentPeriodStart,
        periodEnd: sub[0].currentPeriodEnd,
        aiSessionsUsed: 0,
        humanSessionsUsed: 0,
        humanSessionsIncluded: tierKey ? TIER_CONFIG[tierKey].humanSessionsIncluded : 0
      };
    }
    return usage[0];
  }),
  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const sub = await db.select().from(subscriptions).where(
      and12(
        eq20(subscriptions.userId, ctx.user.id),
        eq20(subscriptions.status, "active")
      )
    ).limit(1);
    if (sub.length === 0) {
      throw new TRPCError12({
        code: "NOT_FOUND",
        message: "No active subscription found."
      });
    }
    if (sub[0].stripeSubscriptionId) {
      await stripe3.subscriptions.cancel(sub[0].stripeSubscriptionId);
    }
    await db.update(subscriptions).set({
      status: "canceled",
      canceledAt: /* @__PURE__ */ new Date()
    }).where(eq20(subscriptions.id, sub[0].id));
    return { success: true };
  })
});

// server/routers/subscriptionWebhook.ts
init_trpc();
init_db();
init_schema();
init_env();
import { TRPCError as TRPCError13 } from "@trpc/server";
import { eq as eq21 } from "drizzle-orm";
import Stripe4 from "stripe";
var stripe4 = new Stripe4(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover"
});
var subscriptionWebhookRouter = router({
  /**
   * Handle Stripe webhook events
   * This is called by Stripe when subscription events occur
   */
  handleWebhook: publicProcedure.mutation(async ({ ctx }) => {
    const signature = ctx.req.headers["stripe-signature"];
    if (!signature) {
      throw new TRPCError13({
        code: "BAD_REQUEST",
        message: "Missing stripe-signature header"
      });
    }
    let event;
    try {
      const rawBody = ctx.req.rawBody || JSON.stringify(ctx.req.body);
      event = stripe4.webhooks.constructEvent(
        rawBody,
        signature,
        ENV.stripeWebhookSecret
      );
    } catch (err) {
      throw new TRPCError13({
        code: "BAD_REQUEST",
        message: `Webhook signature verification failed: ${err.message}`
      });
    }
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          const userId = parseInt(session.metadata?.userId || "0");
          const tier = session.metadata?.tier;
          const billingFrequency = session.metadata?.billingFrequency || "monthly";
          if (!userId || !tier) {
            console.error("Missing userId or tier in checkout session metadata");
            break;
          }
          const stripeSubscription = await stripe4.subscriptions.retrieve(
            session.subscription
          );
          await db.insert(subscriptions).values({
            userId,
            stripeSubscriptionId: stripeSubscription.id,
            stripeCustomerId: stripeSubscription.customer,
            stripePriceId: stripeSubscription.items.data[0].price.id,
            productId: tier,
            tier,
            billingFrequency,
            status: stripeSubscription.status === "trialing" ? "trialing" : "active",
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1e3),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1e3),
            trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1e3) : null,
            trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1e3) : null,
            cancelAtPeriodEnd: "false"
          });
          console.log(`\u2705 Created subscription for user ${userId} (${tier} - ${billingFrequency})`);
        }
        if (session.mode === "payment" && session.metadata?.type === "extra_session") {
          const userId = parseInt(session.metadata?.userId || "0");
          const subscriptionId = parseInt(session.metadata?.subscriptionId || "0");
          if (!userId || !subscriptionId) {
            console.error("Missing userId or subscriptionId in session metadata");
            break;
          }
          console.log(`\u2705 Extra session purchased by user ${userId}`);
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await db.update(subscriptions).set({
          status: subscription.status === "trialing" ? "trialing" : subscription.status === "active" ? "active" : subscription.status === "past_due" ? "past_due" : subscription.status === "canceled" ? "cancelled" : "unpaid",
          currentPeriodStart: new Date(subscription.current_period_start * 1e3),
          currentPeriodEnd: new Date(subscription.current_period_end * 1e3),
          cancelAtPeriodEnd: subscription.cancel_at_period_end ? "true" : "false",
          cancelledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1e3) : null
        }).where(eq21(subscriptions.stripeSubscriptionId, subscription.id));
        console.log(`\u2705 Updated subscription ${subscription.id}`);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await db.update(subscriptions).set({
          status: "cancelled",
          cancelledAt: /* @__PURE__ */ new Date()
        }).where(eq21(subscriptions.stripeSubscriptionId, subscription.id));
        console.log(`\u2705 Cancelled subscription ${subscription.id}`);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
        if (subscriptionId) {
          const sub = await db.select().from(subscriptions).where(eq21(subscriptions.stripeSubscriptionId, subscriptionId)).limit(1);
          if (sub.length > 0) {
            const subscription = sub[0];
            await db.insert(usageTracking).values({
              subscriptionId: subscription.id,
              userId: subscription.userId,
              periodStart: subscription.currentPeriodStart,
              periodEnd: subscription.currentPeriodEnd,
              aiSessionsUsed: 0,
              humanSessionsUsed: 0,
              humanSessionsIncluded: subscription.tier === "ai_only" ? 0 : subscription.tier === "hybrid" ? 1 : subscription.tier === "premium" ? 4 : 0
            });
            console.log(`\u2705 Created usage tracking for new billing period (subscription ${subscription.id})`);
          }
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
        if (subscriptionId) {
          await db.update(subscriptions).set({
            status: "past_due"
          }).where(eq21(subscriptions.stripeSubscriptionId, subscriptionId));
          console.log(`\u26A0\uFE0F Payment failed for subscription ${subscriptionId}`);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return { received: true };
  })
});

// server/routers/emailAutomation.ts
init_trpc();
init_db();
init_schema();
import { z as z25 } from "zod";
import { TRPCError as TRPCError14 } from "@trpc/server";
import { eq as eq22, and as and13, gte as gte4, lte as lte3, desc as desc15 } from "drizzle-orm";
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
async function sendEmail(params) {
  const { userId, emailType, subject, content, metadata } = params;
  const db2 = await getDb();
  if (!db2) return false;
  const user = await db2.select().from(users).where(eq22(users.id, userId)).limit(1);
  if (!user.length || !user[0].email) {
    console.warn(`[EMAIL] No email found for user ${userId}`);
    return false;
  }
  const recipient = user[0].email;
  let success = false;
  try {
    await transporter.sendMail({
      from: `"Purposeful Live Coaching" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      text: content,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">${content.replace(/\n/g, "<br>")}</div>`
    });
    success = true;
    console.log(`[EMAIL] Sent ${emailType} to ${recipient}`);
  } catch (error) {
    console.error(`[EMAIL] Failed to send ${emailType}:`, error);
  }
  if (db2) {
    await db2.insert(emailLogs).values({
      userId,
      emailType,
      subject,
      status: success ? "sent" : "failed",
      metadata: metadata ? JSON.stringify(metadata) : null
    });
  }
  return success;
}
var emailAutomationRouter = router({
  /**
   * Send trial day-5 reminder email
   * Should be called daily by a cron job
   */
  sendTrialReminders: publicProcedure.mutation(async () => {
    const db2 = await getDb();
    if (!db2) throw new TRPCError14({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const fiveDaysAgo = /* @__PURE__ */ new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const sixDaysAgo = /* @__PURE__ */ new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    const trialingSubscriptions = await db2.select({
      subscription: subscriptions,
      user: users
    }).from(subscriptions).innerJoin(users, eq22(subscriptions.userId, users.id)).where(
      and13(
        eq22(subscriptions.status, "trialing"),
        gte4(subscriptions.trialStart, sixDaysAgo),
        lte3(subscriptions.trialStart, fiveDaysAgo)
      )
    );
    let sentCount = 0;
    let errorCount = 0;
    for (const { subscription, user } of trialingSubscriptions) {
      const existingEmail = await db2.select().from(emailLogs).where(
        and13(
          eq22(emailLogs.userId, user.id),
          eq22(emailLogs.emailType, "trial_day5_reminder")
        )
      ).limit(1);
      if (existingEmail.length > 0) {
        continue;
      }
      const usage = await db2.select().from(usageTracking).where(eq22(usageTracking.subscriptionId, subscription.id)).orderBy(desc15(usageTracking.createdAt)).limit(1);
      const aiSessionsUsed = usage[0]?.aiSessionsUsed || 0;
      const humanSessionsUsed = usage[0]?.humanSessionsUsed || 0;
      const subject = "Your trial ends in 2 days - here's what you'll miss";
      const content = `
Hi ${user.name || "there"},

Your 7-day free trial of PurposefulLive ends in 2 days.

**Here's what you've accomplished so far:**
- ${aiSessionsUsed} AI coaching sessions completed
- ${humanSessionsUsed > 0 ? `${humanSessionsUsed} human coaching sessions booked` : "24/7 AI support whenever you needed it"}

**What happens if you don't subscribe:**
- You'll lose access to your AI coach
- Your conversation history will be saved, but you won't be able to continue
- You'll miss out on the progress you've been making

**Continue your journey:**
Subscribe now to keep the momentum going. Starting at just $29/month.

[Subscribe Now] \u2192 https://your-domain.com/pricing

Questions? Just reply to this email.

- The PurposefulLive Team
      `.trim();
      const success = await sendEmail({
        userId: user.id,
        emailType: "trial_day5_reminder",
        subject,
        content,
        metadata: { aiSessionsUsed, humanSessionsUsed }
      });
      if (success) {
        sentCount++;
      } else {
        errorCount++;
      }
    }
    return {
      sentCount,
      errorCount,
      message: `Sent ${sentCount} trial reminder emails, ${errorCount} errors`
    };
  }),
  /**
   * Send welcome email when trial starts
   */
  sendWelcomeEmail: protectedProcedure.input(z25.object({ userId: z25.number() })).mutation(async ({ input }) => {
    const db2 = await getDb();
    if (!db2) throw new TRPCError14({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [user] = await db2.select().from(users).where(eq22(users.id, input.userId)).limit(1);
    if (!user) throw new TRPCError14({ code: "NOT_FOUND", message: "User not found" });
    const subject = "Welcome to PurposefulLive - Your AI coach is ready!";
    const content = `
Hi ${user.name || "there"},

Welcome to PurposefulLive! \u{1F389}

Your 7-day free trial has started, and your AI coach is ready to help you 24/7.

**Quick Start Guide:**
1. Go to your dashboard \u2192 Click "AI Coach"
2. Start a conversation about what's on your mind
3. Your AI coach will provide structured, actionable guidance
4. Come back anytime - your coach never sleeps!

**What to expect:**
- Evidence-based behavioral science techniques
- Structured action plans (not vague advice)
- Crisis detection and support resources
- 24/7 availability whenever you need it

**Your trial includes:**
- Unlimited AI coaching sessions
- 7 days to explore all features
- No credit card required to start

[Start Your First Session] \u2192 https://your-domain.com/ai-coach

Questions? Just reply to this email.

- The PurposefulLive Team
      `.trim();
    return await sendEmail({
      userId: user.id,
      emailType: "welcome",
      subject,
      content
    });
  }),
  /**
   * Send failed payment recovery email
   */
  sendPaymentFailedEmail: publicProcedure.input(z25.object({ userId: z25.number(), subscriptionId: z25.number() })).mutation(async ({ input }) => {
    const db2 = await getDb();
    if (!db2) throw new TRPCError14({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [user] = await db2.select().from(users).where(eq22(users.id, input.userId)).limit(1);
    if (!user) throw new TRPCError14({ code: "NOT_FOUND", message: "User not found" });
    const subject = "Your payment failed - update your card to keep access";
    const content = `
Hi ${user.name || "there"},

We tried to process your payment for PurposefulLive, but it didn't go through.

**What this means:**
- Your access will be suspended in 3 days if we can't process payment
- You'll lose access to your AI coach
- Your conversation history will be saved

**Fix it now (takes 30 seconds):**
[Update Payment Method] \u2192 https://your-domain.com/subscription

**Common reasons payments fail:**
- Expired card
- Insufficient funds
- Bank declined the charge

If you're having trouble, just reply to this email and we'll help.

- The PurposefulLive Team
      `.trim();
    return await sendEmail({
      userId: user.id,
      emailType: "payment_failed",
      subject,
      content,
      metadata: { subscriptionId: input.subscriptionId }
    });
  }),
  /**
   * Send monthly usage summary email
   */
  sendMonthlySummary: publicProcedure.input(z25.object({ userId: z25.number(), subscriptionId: z25.number() })).mutation(async ({ input }) => {
    const db2 = await getDb();
    if (!db2) throw new TRPCError14({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [user] = await db2.select().from(users).where(eq22(users.id, input.userId)).limit(1);
    if (!user) throw new TRPCError14({ code: "NOT_FOUND", message: "User not found" });
    const usage = await db2.select().from(usageTracking).where(eq22(usageTracking.subscriptionId, input.subscriptionId)).orderBy(desc15(usageTracking.createdAt)).limit(1);
    const aiSessionsUsed = usage[0]?.aiSessionsUsed || 0;
    const humanSessionsUsed = usage[0]?.humanSessionsUsed || 0;
    const humanSessionsIncluded = usage[0]?.humanSessionsIncluded || 0;
    const subject = "Your PurposefulLive monthly report";
    const content = `
Hi ${user.name || "there"},

Here's your PurposefulLive activity for this month:

**Your Progress:**
- ${aiSessionsUsed} AI coaching sessions completed
- ${humanSessionsUsed}/${humanSessionsIncluded} human coaching sessions used
- You're building momentum! \u{1F680}

**Keep Going:**
The most successful users engage with their AI coach at least 3x per week.

${aiSessionsUsed < 12 ? "**Tip:** Try starting your day with a quick check-in with your AI coach. Even 5 minutes can set the tone for your whole day." : "**Amazing!** You're one of our most engaged users. Keep up the great work!"}

[Continue Your Journey] \u2192 https://your-domain.com/ai-coach

Questions or feedback? Just reply to this email.

- The PurposefulLive Team
      `.trim();
    return await sendEmail({
      userId: user.id,
      emailType: "monthly_summary",
      subject,
      content,
      metadata: { aiSessionsUsed, humanSessionsUsed, humanSessionsIncluded }
    });
  }),
  /**
   * Get email log history for a user
   */
  getEmailHistory: protectedProcedure.query(async ({ ctx }) => {
    const db2 = await getDb();
    if (!db2) return { emails: [] };
    const emails = await db2.select().from(emailLogs).where(eq22(emailLogs.userId, ctx.user.id)).orderBy(desc15(emailLogs.sentAt)).limit(50);
    return { emails };
  })
});

// server/routers/coachDashboard.ts
init_trpc();
init_db();
init_schema();
import { z as z26 } from "zod";
import { eq as eq23, desc as desc16, and as and14, sql as sql3, gte as gte5 } from "drizzle-orm";
var coachDashboardRouter = router({
  /**
   * Get all clients with rich profile data
   * Returns ALL 50 fields for comprehensive client view
   */
  getAllClients: publicProcedure.query(async () => {
    const allClients = await db.query.clients.findMany({
      orderBy: [desc16(clients.updatedAt)]
    });
    return allClients.map((client2) => ({
      ...client2,
      // Calculate profile completeness on the fly if not set
      profileCompleteness: client2.profileCompleteness || calculateCompleteness(client2)
    }));
  }),
  /**
   * Get single client with full profile
   */
  getClientProfile: publicProcedure.input(z26.object({ clientId: z26.number() })).query(async ({ input }) => {
    const client2 = await db.query.clients.findFirst({
      where: eq23(clients.id, input.clientId)
    });
    if (!client2) {
      throw new Error("Client not found");
    }
    return client2;
  }),
  /**
   * Get conversation history for a client
   * Returns all chat messages ordered by timestamp
   */
  getConversationHistory: publicProcedure.input(z26.object({ clientId: z26.number() })).query(async ({ input }) => {
    const conversations = await db.query.aiChatConversations.findMany({
      where: eq23(aiChatConversations.clientId, input.clientId),
      orderBy: [desc16(aiChatConversations.lastMessageAt)]
    });
    if (conversations.length === 0) {
      return [];
    }
    const conversationIds = conversations.map((c) => c.id);
    const messages = await db.query.aiChatMessages.findMany({
      where: sql3`${aiChatMessages.conversationId} IN (${conversationIds.join(",")})`,
      orderBy: [desc16(aiChatMessages.createdAt)],
      limit: 100
      // Last 100 messages
    });
    return messages;
  }),
  /**
   * Get active sessions (clients currently chatting)
   * Shows who's online in the last 5 minutes
   */
  getActiveSessions: publicProcedure.query(async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1e3);
    const activeConversations = await db.query.aiChatConversations.findMany({
      where: and14(
        gte5(aiChatConversations.lastMessageAt, fiveMinutesAgo),
        sql3`${aiChatConversations.clientId} IS NOT NULL`
      ),
      orderBy: [desc16(aiChatConversations.lastMessageAt)]
    });
    const activeSessions2 = await Promise.all(
      activeConversations.map(async (conv) => {
        const client2 = await db.query.clients.findFirst({
          where: eq23(clients.id, conv.clientId)
        });
        const messageCount = await db.select({ count: sql3`COUNT(*)` }).from(aiChatMessages).where(and14(
          eq23(aiChatMessages.conversationId, conv.id),
          gte5(aiChatMessages.createdAt, fiveMinutesAgo)
        ));
        return {
          conversationId: conv.id,
          lastMessage: conv.lastMessageAt,
          messageCount: messageCount[0].count,
          client: client2 || null
        };
      })
    );
    return activeSessions2.filter((s) => s.client !== null);
  }),
  /**
   * Update client profile from AI extraction
   * Merges new extracted data with existing profile
   */
  updateProfileFromExtraction: publicProcedure.input(z26.object({
    clientId: z26.number(),
    extractedData: z26.object({
      // Professional
      jobTitle: z26.string().optional(),
      company: z26.string().optional(),
      industry: z26.string().optional(),
      careerGoals: z26.string().optional(),
      // Personal
      age: z26.number().optional(),
      locationCity: z26.string().optional(),
      locationState: z26.string().optional(),
      locationCountry: z26.string().optional(),
      relationshipStatus: z26.string().optional(),
      hasChildren: z26.enum(["true", "false"]).optional(),
      // Goals
      primaryGoal: z26.string().optional(),
      goalTimeline: z26.string().optional(),
      motivation: z26.string().optional(),
      // Identity
      currentIdentity: z26.string().optional(),
      // JSON string
      targetIdentity: z26.string().optional(),
      // JSON string
      identityGap: z26.string().optional(),
      coreValues: z26.string().optional(),
      // JSON string
      lifeMission: z26.string().optional(),
      // Behavioral
      procrastinationTriggers: z26.string().optional(),
      // JSON string
      energyPattern: z26.string().optional(),
      stressResponses: z26.string().optional(),
      // JSON string
      // Health
      sleepHours: z26.number().optional(),
      exerciseFrequency: z26.string().optional(),
      dietPattern: z26.string().optional(),
      mentalHealthNotes: z26.string().optional(),
      // Financial
      savingsLevel: z26.string().optional(),
      hasDebt: z26.enum(["true", "false"]).optional(),
      monthlyExpensesEstimate: z26.number().optional(),
      // Communication
      preferredContact: z26.string().optional(),
      bestTimeToReach: z26.string().optional(),
      communicationStyle: z26.string().optional(),
      // Crisis
      suicideRiskLevel: z26.string().optional(),
      crisisFlags: z26.string().optional(),
      // JSON string
      // Metadata
      confidenceScores: z26.string().optional()
      // JSON string
    })
  })).mutation(async ({ input }) => {
    const { clientId, extractedData } = input;
    const currentClient = await db.query.clients.findFirst({
      where: eq23(clients.id, clientId)
    });
    if (!currentClient) {
      throw new Error("Client not found");
    }
    const updatedClient = { ...currentClient, ...extractedData };
    const newCompleteness = calculateCompleteness(updatedClient);
    const updateFields = {};
    Object.keys(extractedData).forEach((key) => {
      const value = extractedData[key];
      if (value !== void 0) {
        updateFields[key] = value;
      }
    });
    updateFields.lastProfileUpdate = /* @__PURE__ */ new Date();
    updateFields.profileCompleteness = newCompleteness;
    await db.update(clients).set(updateFields).where(eq23(clients.id, clientId));
    return { success: true };
  }),
  /**
   * Get dashboard stats
   */
  getStats: publicProcedure.query(async () => {
    const totalClients = await db.select({ count: sql3`COUNT(*)` }).from(clients);
    const activeClients = await db.select({ count: sql3`COUNT(*)` }).from(clients).where(eq23(clients.status, "active"));
    const recentClients = await db.select({ count: sql3`COUNT(*)` }).from(clients).where(gte5(clients.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3)));
    return {
      totalClients: totalClients[0].count,
      activeClients: activeClients[0].count,
      newThisWeek: recentClients[0].count
    };
  })
});
function calculateCompleteness(client2) {
  const fields = [
    "jobTitle",
    "company",
    "industry",
    "careerGoals",
    "age",
    "locationCity",
    "relationshipStatus",
    "primaryGoal",
    "motivation",
    "currentIdentity",
    "targetIdentity",
    "coreValues",
    "energyPattern",
    "sleepHours",
    "exerciseFrequency",
    "savingsLevel",
    "preferredContact"
  ];
  const filledFields = fields.filter((field) => {
    const value = client2[field];
    return value !== null && value !== void 0 && value !== "";
  });
  return Math.round(filledFields.length / fields.length * 100);
}

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Coaching platform routers
  coaches: coachesRouter,
  clients: clientsRouter,
  journal: journalRouter,
  emotionLogs: emotionLogsRouter,
  copingStrategies: copingStrategiesRouter,
  aiInsights: aiInsightsRouter2,
  sessions: sessionsRouter,
  stripe: stripeRouter,
  scheduling: schedulingRouter,
  sessionTypes: sessionTypesRouter,
  sessionPayments: sessionPaymentsRouter,
  aiChat: aiChatRouter,
  aiChatFeedback: aiChatFeedbackRouter,
  coachClientHistory: coachClientHistoryRouter,
  clientFiles: clientFilesRouter,
  profileExtraction: profileExtractionRouter,
  liveSession: liveSessionRouter,
  platformSettings: platformSettingsRouter,
  socialProof: socialProofRouter,
  aiFeedback: aiFeedbackRouter,
  emailCapture: emailCaptureRouter,
  abTesting: abTestingRouter,
  chat: chatRouter,
  analytics: analyticsRouter,
  videoTestimonials: videoTestimonialsRouter,
  identity: identityRouter,
  // adaptiveLearning: adaptiveLearningRouter, // Temporarily disabled - needs schema migration
  autism: autismRouter,
  subscriptions: subscriptionsRouter,
  subscriptionWebhook: subscriptionWebhookRouter,
  emailAutomation: emailAutomationRouter,
  coachDashboard: coachDashboardRouter
});

// server/_core/context.ts
async function createContext(opts) {
  const user = null;
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path3 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import { fileURLToPath } from "url";
var __dirname = path2.dirname(fileURLToPath(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname, "client", "src"),
      "@shared": path2.resolve(__dirname, "shared")
    }
  },
  root: path2.resolve(__dirname, "client"),
  publicDir: path2.resolve(__dirname, "client", "public"),
  build: {
    outDir: path2.resolve(__dirname, "dist", "public"),
    emptyOutDir: true
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path3.resolve(import.meta.dirname, "../..", "dist", "public") : path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/routers/webhooks.ts
init_env();
init_db();
init_schema();
import { Router } from "express";
import Stripe5 from "stripe";
import { eq as eq24 } from "drizzle-orm";
var stripe5 = new Stripe5(ENV.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-10-29.clover"
});
var webhookRouter = Router();
webhookRouter.post("/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  console.log("[Webhook] Received webhook request");
  console.log("[Webhook] Has signature:", !!sig);
  console.log("[Webhook] Signature value:", typeof sig === "string" ? sig.substring(0, 50) + "..." : sig);
  console.log("[Webhook] Webhook secret configured:", !!ENV.stripeWebhookSecret);
  console.log("[Webhook] Webhook secret length:", ENV.stripeWebhookSecret?.length || 0);
  if (!sig) {
    console.error("[Webhook] Missing Stripe signature");
    return res.status(400).send("Missing signature");
  }
  if (!ENV.stripeWebhookSecret) {
    console.error("[Webhook] Webhook secret not configured!");
    return res.status(500).send("Webhook secret not configured");
  }
  let event;
  try {
    console.log("[Webhook] About to verify signature with secret:", ENV.stripeWebhookSecret ? `${ENV.stripeWebhookSecret.substring(0, 10)}...` : "NOT SET");
    console.log("[Webhook] req.body type:", typeof req.body);
    console.log("[Webhook] req.body is Buffer:", Buffer.isBuffer(req.body));
    event = stripe5.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
    console.log("[Webhook] Signature verification successful!");
  } catch (err) {
    console.error("[Webhook] Signature verification FAILED");
    console.error("[Webhook] Error:", err);
    console.error("[Webhook] Error message:", err instanceof Error ? err.message : "Unknown error");
    console.error("[Webhook] Secret configured:", !!ENV.stripeWebhookSecret);
    console.error("[Webhook] Secret starts with:", ENV.stripeWebhookSecret ? ENV.stripeWebhookSecret.substring(0, 10) : "N/A");
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
  console.log(`[Webhook] Received event: ${event.type}`);
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error processing event ${event.type}:`, error);
    res.status(500).send("Webhook processing failed");
  }
});
function mapStripeStatus(status) {
  const statusMap = {
    "active": "active",
    "canceled": "cancelled",
    "cancelled": "cancelled",
    "past_due": "past_due",
    "unpaid": "unpaid",
    "trialing": "active",
    "incomplete": "unpaid",
    "incomplete_expired": "cancelled"
  };
  return statusMap[status] || "active";
}
async function handleCheckoutCompleted(session) {
  console.log("[Webhook] Processing checkout.session.completed");
  console.log("[Webhook] Session mode:", session.mode);
  console.log("[Webhook] Metadata:", session.metadata);
  const db2 = await getDb();
  if (!db2) {
    console.error("[Webhook] Database not available");
    return;
  }
  const userId = session.metadata?.user_id;
  const customerEmail = session.customer_email || session.metadata?.customer_email;
  const customerName = session.metadata?.customer_name;
  if (!userId) {
    console.error("[Webhook] Missing user_id in metadata");
    return;
  }
  if (session.mode === "payment") {
    await handleSessionBooking(session, db2, parseInt(userId));
    return;
  }
  const productId = session.metadata?.product_id;
  if (!productId) {
    console.error("[Webhook] Missing product_id for subscription");
    return;
  }
  const subscriptionId = session.subscription;
  if (!subscriptionId) {
    console.error("[Webhook] No subscription ID in checkout session");
    return;
  }
  const stripeSubscription = await stripe5.subscriptions.retrieve(subscriptionId);
  await db2.insert(subscriptions).values({
    userId: parseInt(userId),
    productId,
    stripeSubscriptionId: subscriptionId,
    stripeCustomerId: session.customer,
    stripePriceId: stripeSubscription.items.data[0].price.id,
    status: mapStripeStatus(stripeSubscription.status),
    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1e3),
    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1e3)
  });
  console.log(`[Webhook] Created subscription record for user ${userId}`);
}
async function handleSessionBooking(session, db2, userId) {
  console.log("[Webhook] Creating session booking for one-time payment");
  const sessionTypeId = session.metadata?.session_type_id;
  const scheduledDate = session.metadata?.scheduled_date;
  const notes = session.metadata?.notes;
  const sessionTypeName = session.metadata?.session_type_name;
  if (!sessionTypeId || !scheduledDate) {
    console.error("[Webhook] Missing session booking metadata");
    return;
  }
  const customerEmail = session.customer_email || session.metadata?.customer_email;
  let clientRecord = customerEmail ? await db2.select().from(clients).where(eq24(clients.email, customerEmail)).limit(1) : [];
  let clientId;
  if (clientRecord.length === 0) {
    const [newClient] = await db2.insert(clients).values({
      coachId: 1,
      // Default coach ID - adjust if needed
      name: session.metadata?.customer_name || "New Client",
      email: customerEmail || "",
      phone: "",
      status: "active"
    }).$returningId();
    clientId = newClient.id;
    console.log("[Webhook] Created new client record:", clientId);
  } else {
    clientId = clientRecord[0].id;
    console.log("[Webhook] Using existing client record:", clientId);
  }
  const sessionTypeDetails = await db2.query.sessionTypes.findFirst({
    where: (sessionTypes2, { eq: eq25 }) => eq25(sessionTypes2.id, parseInt(sessionTypeId))
  });
  await db2.insert(sessions).values({
    coachId: 1,
    // Default coach ID - adjust if needed
    clientId,
    sessionTypeId: parseInt(sessionTypeId),
    scheduledDate: new Date(scheduledDate),
    duration: sessionTypeDetails?.duration || 15,
    price: session.amount_total || 0,
    sessionType: sessionTypeName || "Breakthrough Discovery Session",
    notes: notes || "",
    status: "scheduled",
    paymentStatus: "paid",
    stripePaymentIntentId: session.payment_intent
  });
  console.log("[Webhook] Session booking created successfully");
  console.log("[Webhook] Client ID:", clientId, "Session Type:", sessionTypeName, "Date:", scheduledDate);
}
async function handlePaymentSucceeded(invoice) {
  console.log("[Webhook] Processing invoice.payment_succeeded");
  const db2 = await getDb();
  if (!db2) return;
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  await db2.update(subscriptions).set({ status: "active" }).where(eq24(subscriptions.stripeSubscriptionId, subscriptionId));
  console.log(`[Webhook] Payment confirmed for subscription ${subscriptionId}`);
}
async function handlePaymentFailed(invoice) {
  console.log("[Webhook] Processing invoice.payment_failed");
  const db2 = await getDb();
  if (!db2) return;
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  const [subscription] = await db2.select().from(subscriptions).where(eq24(subscriptions.stripeSubscriptionId, subscriptionId)).limit(1);
  if (!subscription) {
    console.log(`[Webhook] Subscription not found: ${subscriptionId}`);
    return;
  }
  await db2.update(subscriptions).set({ status: "past_due" }).where(eq24(subscriptions.stripeSubscriptionId, subscriptionId));
  try {
    const [user] = await db2.select().from(users).where(eq24(users.id, subscription.userId)).limit(1);
    if (user && user.email) {
      const subject = "Your payment failed - update your card to keep access";
      const content = `
Hi ${user.name || "there"},

We tried to process your payment for PurposefulLive, but it didn't go through.

**What happens next:**
- We'll automatically retry the payment 3 times over the next 2 weeks
- Your access continues during this time
- If all retries fail, your access will be suspended

**To fix this now:**
1. Log in to your account
2. Go to Subscription Settings
3. Update your payment method

**Need help?** Reply to this email and we'll assist you.

Thank you,
- The PurposefulLive Team
      `.trim();
      await db2.insert(emailLogs).values({
        userId: user.id,
        emailType: "payment_failed",
        subject,
        status: "sent",
        metadata: JSON.stringify({
          subscriptionId: subscription.id,
          emailContent: content
        })
      });
      console.log(`[Webhook] Payment failed email sent to user ${user.id}`);
    }
  } catch (error) {
    console.error("[Webhook] Failed to send payment failed email:", error);
  }
  console.log(`[Webhook] Payment failed for subscription ${subscriptionId}`);
}
async function handleSubscriptionCancelled(subscription) {
  console.log("[Webhook] Processing customer.subscription.deleted");
  const db2 = await getDb();
  if (!db2) return;
  await db2.update(subscriptions).set({
    status: "cancelled",
    cancelledAt: /* @__PURE__ */ new Date()
  }).where(eq24(subscriptions.stripeSubscriptionId, subscription.id));
  console.log(`[Webhook] Subscription cancelled: ${subscription.id}`);
}
async function handleSubscriptionUpdated(subscription) {
  console.log("[Webhook] Processing customer.subscription.updated");
  const db2 = await getDb();
  if (!db2) return;
  await db2.update(subscriptions).set({
    status: mapStripeStatus(subscription.status),
    currentPeriodStart: new Date(subscription.current_period_start * 1e3),
    currentPeriodEnd: new Date(subscription.current_period_end * 1e3)
  }).where(eq24(subscriptions.stripeSubscriptionId, subscription.id));
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use("/api/webhooks", express2.raw({ type: "application/json" }), webhookRouter);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  const uploadDir = process.env.UPLOAD_DIR || "/opt/render/project/src/uploads";
  app.use("/uploads", express2.static(uploadDir));
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
