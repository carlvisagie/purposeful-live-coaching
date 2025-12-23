import { boolean, date, decimal, int, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Export identity schema tables
export * from "./identitySchema";

// Export client recognition schema tables
export * from "./clientRecognitionSchema";

// Export client event tracking schema tables (part of Unified Client Profile)
export * from "./clientEventTrackingSchema";

// Export adaptive learning schema tables
export * from "./adaptiveLearningSchema";

// Export autism transformation module schema tables
export * from "./autismSchema";

// Export core transformation engine schemas
export * from "./emotionalEngineSchema";
export * from "./mentalEngineSchema";
export * from "./physicalEngineSchema";
export * from "./nutritionEngineSchema";
export * from "./spiritualEngineSchema";

// Export admin & platform schemas
export * from "./adminSchema";
export * from "./aiCoachSchema";
export * from "./analyticsSchema";
export * from "./usageTrackingSchema";
export * from "./contentModerationSchema";
export * from "./notificationsSchema";
export * from "./securitySchema";
export * from "./settingsSchema";

// Export wellness & lifestyle schemas
export * from "./dailyCheckInsSchema";
export * from "./careerSchema";
export * from "./communitySchema";
export * from "./financialSchema";
export * from "./goalsSchema";
export * from "./habitFormationSchema";
export * from "./healthOptimizationSchema";
export * from "./journalSchema";
export * from "./mentalHealthSchema";
export * from "./relationshipSchema";
export * from "./sleepOptimizationSchema";
export * from "./stressSchema";

// Export voice coaching schema (10X Adaptive Emotional Intelligence)
export * from "./voiceCoachingSchema";

// Export AI Coach Performance tracking schema
export * from "./aiCoachPerformanceSchema";

// Export advanced features
export * from "./gamificationSchema";
export * from "./integrationsSchema";
export * from "./memoryMasterySchema";
export * from "./transformativePrinciplesSchema";
export * from "./truthKeepersSchema";
export * from "./visualizationSchema";
export * from "./youngMenSchema";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  birthdate: date("birthdate"), // For age verification (18+ requirement)
  role: varchar("role", { length: 50 }),
  
  // Profile fields extracted from AI conversations
  primaryGoal: text("primary_goal"), // e.g., "stress management", "career transition"
  secondaryGoal: text("secondary_goal"),
  mainChallenges: text("main_challenges"), // JSON array of challenges
  preferredFrequency: varchar("preferred_frequency", { length: 50 }),
  timezone: varchar("timezone", { length: 64 }), // e.g., "America/Los_Angeles"
  availability: text("availability"), // e.g., "evenings", "weekends", "flexible"
  communicationStyle: varchar("communication_style", { length: 50 }),
  triggers: text("triggers"), // JSON array of triggers to watch for
  profileCompleteness: integer("profile_completeness").default(0), // 0-100%
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Coaches table - extends users with coaching-specific information
 */
export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  specialization: text("specialization"),
  bio: text("bio"),
  certifications: text("certifications"),
  yearsExperience: integer("years_experience"),
  isActive: varchar("is_active", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = typeof coaches.$inferInsert;

/**
 * Clients table - people being coached
 */
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  // userId: integer("user_id").references(() => users.id), // TODO: Uncomment after running migration to add this column
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  dateOfBirth: timestamp("date_of_birth"),
  goals: text("goals"),
  notes: text("notes"),
  status: varchar("status", { length: 50 }),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  
  // Professional Info (auto-extracted from conversations)
  jobTitle: varchar("job_title", { length: 200 }),
  company: varchar("company", { length: 200 }),
  industry: varchar("industry", { length: 100 }),
  careerGoals: text("career_goals"),
  
  // Personal Info (auto-extracted)
  age: integer("age"),
  locationCity: varchar("location_city", { length: 100 }),
  locationState: varchar("location_state", { length: 100 }),
  locationCountry: varchar("location_country", { length: 100 }),
  relationshipStatus: varchar("relationship_status", { length: 50 }),
  hasChildren: varchar("has_children", { length: 50 }),
  
  // Goals & Motivation (auto-extracted)
  primaryGoal: text("primary_goal"),
  goalTimeline: varchar("goal_timeline", { length: 100 }),
  motivation: text("motivation"),
  
  // Identity Architecture (auto-extracted)
  currentIdentity: text("current_identity"), // JSON array
  targetIdentity: text("target_identity"), // JSON array
  identityGap: text("identity_gap"),
  coreValues: text("core_values"), // JSON array
  lifeMission: text("life_mission"),
  
  // Behavioral Patterns (auto-extracted)
  procrastinationTriggers: text("procrastination_triggers"), // JSON array
  energyPattern: varchar("energy_pattern", { length: 50 }),
  stressResponses: text("stress_responses"), // JSON array
  
  // Health & Wellness (auto-extracted)
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }),
  exerciseFrequency: varchar("exercise_frequency", { length: 50 }),
  dietPattern: varchar("diet_pattern", { length: 100 }),
  mentalHealthNotes: text("mental_health_notes"),
  
  // Financial (auto-extracted)
  savingsLevel: varchar("savings_level", { length: 50 }),
  hasDebt: varchar("has_debt", { length: 50 }),
  monthlyExpensesEstimate: integer("monthly_expenses_estimate"),
  
  // Communication Preferences (auto-extracted)
  preferredContact: varchar("preferred_contact", { length: 50 }),
  bestTimeToReach: varchar("best_time_to_reach", { length: 50 }),
  communicationStyle: varchar("communication_style", { length: 50 }),
  
  // Crisis Indicators (auto-detected)
  suicideRiskLevel: varchar("suicide_risk_level", { length: 20 }),
  crisisFlags: text("crisis_flags"), // JSON array
  lastCrisisCheck: timestamp("last_crisis_check"),
  
  // Extraction Metadata
  profileCompleteness: integer("profile_completeness").default(0),
  confidenceScores: text("confidence_scores"), // JSON object
  lastProfileUpdate: timestamp("last_profile_update"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Journal entries with emotional resilience tracking
 */
export const journalEntries = pgTable("journalEntries", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  entryDate: timestamp("entry_date").defaultNow().notNull(),
  content: text("content").notNull(),
  mood: varchar("mood", { length: 50 }),
  moodIntensity: integer("mood_intensity"), // 1-10 scale
  emotions: text("emotions"), // JSON array of emotions
  triggers: text("triggers"), // What triggered the emotions
  copingStrategies: text("coping_strategies"), // What they did to cope
  copingEffectiveness: integer("coping_effectiveness"), // 1-10 scale
  resilienceScore: integer("resilience_score"), // Calculated resilience score
  isPrivate: varchar("is_private", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

/**
 * Emotion logs - detailed tracking of emotional states
 */
export const emotionLogs = pgTable("emotionLogs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  journalEntryId: integer("journal_entry_id").references(() => journalEntries.id),
  logDate: timestamp("log_date").defaultNow().notNull(),
  emotionType: varchar("emotion_type", { length: 100 }).notNull(), // joy, sadness, anger, fear, etc.
  intensity: integer("intensity").notNull(), // 1-10 scale
  trigger: text("trigger"),
  physicalSensations: text("physical_sensations"),
  thoughts: text("thoughts"),
  behaviors: text("behaviors"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EmotionLog = typeof emotionLogs.$inferSelect;
export type InsertEmotionLog = typeof emotionLogs.$inferInsert;

/**
 * Coping strategies library and effectiveness tracking
 */
export const copingStrategies = pgTable("copingStrategies", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  strategyName: varchar("strategy_name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // breathing, physical, social, cognitive, etc.
  timesUsed: integer("times_used").default(0).notNull(),
  averageEffectiveness: integer("average_effectiveness"), // Average rating 1-10
  lastUsed: timestamp("last_used"),
  isRecommended: varchar("is_recommended", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CopingStrategy = typeof copingStrategies.$inferSelect;
export type InsertCopingStrategy = typeof copingStrategies.$inferInsert;

/**
 * AI insights and pattern detection results
 */
export const aiInsights = pgTable("aiInsights", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  insightDate: timestamp("insight_date").defaultNow().notNull(),
  insightType: varchar("insight_type", { length: 100 }).notNull(), // pattern, trend, recommendation, alert
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 50 }),
  actionable: text("actionable"), // Suggested actions
  isRead: varchar("is_read", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = typeof aiInsights.$inferInsert;

/**
 * Session types - configurable session offerings with pricing
 */
export const sessionTypes = pgTable("sessionTypes", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price").notNull(), // in cents (e.g., 7500 = $75.00)
  stripePriceId: varchar("stripe_price_id", { length: 255 }), // Stripe recurring price ID for subscriptions
  oneTimePriceId: varchar("one_time_price_id", { length: 255 }), // Stripe one-time price ID for single sessions
  subscriptionPrice: integer("subscription_price"), // Monthly subscription price in cents (optional, defaults to price)
  isActive: varchar("is_active", { length: 50 }),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SessionType = typeof sessionTypes.$inferSelect;
export type InsertSessionType = typeof sessionTypes.$inferInsert;

/**
 * Sessions/appointments between coach and client
 */
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  clientId: integer("client_id").references(() => clients.id), // Nullable for anonymous sessions
  sessionTypeId: integer("session_type_id").references(() => sessionTypes.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price"), // in cents - captured at booking time
  sessionType: varchar("session_type", { length: 100 }), // legacy field, kept for backward compatibility
  notes: text("notes"),
  status: varchar("status", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }), // Stripe checkout session ID
  videoUrl: text("video_url"), // S3 URL of session recording
  videoDuration: integer("video_duration"), // Duration in seconds
  videoFileSize: integer("video_file_size"), // File size in bytes
  startTime: timestamp("start_time"), // Actual session start time
  endTime: timestamp("end_time"), // Actual session end time
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Subscriptions table for tracking Stripe subscriptions (AI-First Model)
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  productId: varchar("product_id", { length: 64 }).notNull(),
  tier: varchar("tier", { length: 50 }),
  billingFrequency: varchar("billing_frequency", { length: 50 }),
  status: varchar("status", { length: 50 }),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: varchar("cancel_at_period_end", { length: 50 }),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Usage tracking for subscription billing periods
 */
export const usageTracking = pgTable("usage_tracking", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  aiSessionsUsed: integer("ai_sessions_used").default(0).notNull(),
  aiMessagesUsed: integer("ai_messages_used").default(0).notNull(), // Track message count for tier limits
  humanSessionsUsed: integer("human_sessions_used").default(0).notNull(),
  humanSessionsIncluded: integer("human_sessions_included").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;

/**
 * Human session bookings for Hybrid and Premium tiers
 */
export const humanSessionBookings = pgTable("human_session_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  coachId: integer("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration").default(30).notNull(),
  status: varchar("status", { length: 50 }),
  zoomLink: text("zoom_link"),
  aiPreSessionBrief: text("ai_pre_session_brief"),
  coachNotes: text("coach_notes"),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type HumanSessionBooking = typeof humanSessionBookings.$inferSelect;
export type InsertHumanSessionBooking = typeof humanSessionBookings.$inferInsert;
/**
 * Coach availability - recurring weekly schedule
 */
export const coachAvailability = pgTable("coach_availability", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM format (e.g., "09:00")
  endTime: varchar("end_time", { length: 5 }).notNull(), // HH:MM format (e.g., "17:00")
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CoachAvailability = typeof coachAvailability.$inferSelect;
export type InsertCoachAvailability = typeof coachAvailability.$inferInsert;

/**
 * Availability exceptions - time off, holidays, blocked dates
 */
export const availabilityExceptions = pgTable("availabilityExceptions", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: varchar("reason", { length: 255 }), // vacation, holiday, personal, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AvailabilityException = typeof availabilityExceptions.$inferSelect;
export type InsertAvailabilityException = typeof availabilityExceptions.$inferInsert;

/**
 * Session reminders - track sent reminder emails
 */
export const sessionReminders = pgTable("sessionReminders", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  reminderType: varchar("reminder_type", { length: 50 }),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SessionReminder = typeof sessionReminders.$inferSelect;
export type InsertSessionReminder = typeof sessionReminders.$inferInsert;

/**
 * Discount codes table - for promotional offers and exit-intent popups
 */
export const discountCodes = pgTable("discountCodes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountPercent: integer("discount_percent").notNull(), // 10 for 10%
  discountAmount: integer("discount_amount"), // Fixed amount in cents (optional)
  maxUses: integer("max_uses"), // null = unlimited
  usedCount: integer("used_count").default(0).notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: varchar("is_active", { length: 50 }),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = typeof discountCodes.$inferInsert;

/**
 * Discount code usage tracking
 */
export const discountCodeUsage = pgTable("discountCodeUsage", {
  id: serial("id").primaryKey(),
  discountCodeId: integer("discount_code_id").notNull().references(() => discountCodes.id),
  userId: integer("user_id").references(() => users.id),
  sessionId: integer("session_id").references(() => sessions.id),
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

export type DiscountCodeUsage = typeof discountCodeUsage.$inferSelect;
export type InsertDiscountCodeUsage = typeof discountCodeUsage.$inferInsert;

/**
 * AI chat conversations - 24/7 AI coaching chat history
 */
export const aiChatConversations = pgTable("ai_chat_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }), // Nullable for guest users
  clientId: integer("client_id").references(() => clients.id, { onDelete: "cascade" }), // Optional link to client profile
  subscriptionId: integer("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }), // Link to subscription for usage tracking
  sessionDuration: integer("session_duration").default(0), // Duration in minutes
  title: varchar("title", { length: 255 }), // Auto-generated conversation title
  
  // Quality monitoring fields
  rating: integer("rating"), // 1-5 stars (null = not rated yet)
  feedbackText: text("feedback_text"), // Optional detailed feedback
  feedbackCategory: varchar("feedback_category", { length: 50 }),
  wasHelpful: varchar("was_helpful", { length: 50 }), // Simple thumbs up/down
  reviewedByAdmin: varchar("reviewed_by_admin", { length: 50 }),
  adminNotes: text("admin_notes"), // Admin review notes
  
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AiChatConversation = typeof aiChatConversations.$inferSelect;
export type InsertAiChatConversation = typeof aiChatConversations.$inferInsert;

/**
 * AI chat messages - individual messages in conversations
 */
export const aiChatMessages = pgTable("ai_chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }),
  content: text("content").notNull(),
  emotionDetected: varchar("emotion_detected", { length: 100 }), // AI-detected emotion from user message
  crisisFlag: varchar("crisis_flag", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type InsertAiChatMessage = typeof aiChatMessages.$inferInsert;

/**
 * Platform settings - global configuration for the coaching platform
 */
export const platformSettings = pgTable("platformSettings", {
  id: serial("id").primaryKey(),
  aiCoachingEnabled: varchar("ai_coaching_enabled", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = typeof platformSettings.$inferInsert;


/**
 * Video Testimonials - real client video testimonials
 */
export const videoTestimonials = pgTable("videoTestimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Client name
  title: varchar("title", { length: 255 }).notNull(), // Client title/role
  company: varchar("company", { length: 255 }).notNull(), // Client company
  quote: text("quote").notNull(), // Text quote/testimonial
  metric: varchar("metric", { length: 255 }).notNull(), // Metric name (e.g., "Healthcare Cost Savings")
  metricValue: varchar("metric_value", { length: 100 }).notNull(), // Metric value (e.g., "$2.3M")
  videoUrl: text("video_url"), // S3 URL to video file
  videoKey: varchar("video_key", { length: 500 }), // S3 key for video file
  thumbnailUrl: text("thumbnail_url"), // S3 URL to thumbnail image
  thumbnailKey: varchar("thumbnail_key", { length: 500 }), // S3 key for thumbnail
  duration: integer("duration"), // Video duration in seconds
  isPublished: varchar("is_published", { length: 50 }),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type VideoTestimonial = typeof videoTestimonials.$inferSelect;
export type InsertVideoTestimonial = typeof videoTestimonials.$inferInsert;

/**
 * Compliance flags - track prohibited content in AI conversations
 */
export const complianceFlags = pgTable("complianceFlags", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  messageId: integer("message_id").notNull().references(() => aiChatMessages.id, { onDelete: "cascade" }),
  flagType: varchar("flag_type", { length: 50 }),
  severity: varchar("severity", { length: 50 }),
  flaggedContent: text("flagged_content").notNull(), // The specific content that triggered the flag
  aiResponse: text("ai_response"), // How the AI responded to the flagged content
  reviewStatus: varchar("review_status", { length: 50 }),
  reviewedBy: integer("reviewed_by").references(() => users.id), // Coach who reviewed
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ComplianceFlag = typeof complianceFlags.$inferSelect;
export type InsertComplianceFlag = typeof complianceFlags.$inferInsert;

/**
 * Escalation queue - AI to human coach handoff requests
 */
export const escalationQueue = pgTable("escalationQueue", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  escalationType: varchar("escalation_type", { length: 50 }),
  priority: varchar("priority", { length: 50 }),
  reason: text("reason").notNull(), // Why escalation was triggered
  context: text("context"), // Recent conversation context
  status: varchar("status", { length: 50 }),
  assignedTo: integer("assigned_to").references(() => coaches.id), // Which coach is handling it
  assignedAt: timestamp("assigned_at"),
  resolvedAt: timestamp("resolved_at"),
  resolutionNotes: text("resolution_notes"),
  notificationSent: varchar("notification_sent", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type EscalationQueue = typeof escalationQueue.$inferSelect;
export type InsertEscalationQueue = typeof escalationQueue.$inferInsert;

/**
 * Similar cases library - context helpers for coaches
 */
export const similarCases = pgTable("similarCases", {
  id: serial("id").primaryKey(),
  caseTitle: varchar("case_title", { length: 255 }).notNull(),
  caseDescription: text("case_description").notNull(),
  clientIssues: text("client_issues").notNull(), // JSON array of issues/symptoms
  interventions: text("interventions").notNull(), // What the coach did
  outcome: text("outcome").notNull(), // What happened
  successRating: integer("success_rating").notNull(), // 1-10 scale
  timeToResolution: integer("time_to_resolution"), // Days to resolution
  coachNotes: text("coach_notes"), // Coach insights and recommendations
  tags: text("tags"), // JSON array of searchable tags
  isPublic: varchar("is_public", { length: 50 }), // Share with other coaches
  createdBy: integer("created_by").notNull().references(() => coaches.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SimilarCase = typeof similarCases.$inferSelect;
export type InsertSimilarCase = typeof similarCases.$inferInsert;

/**
 * Coach notifications - alerts for escalations and flags
 */
export const coachNotifications = pgTable("coachNotifications", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  notificationType: varchar("notification_type", { length: 50 }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  priority: varchar("priority", { length: 50 }),
  relatedId: integer("related_id"), // ID of related escalation, flag, etc.
  isRead: varchar("is_read", { length: 50 }),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CoachNotification = typeof coachNotifications.$inferSelect;
export type InsertCoachNotification = typeof coachNotifications.$inferInsert;


// Live Session Transcripts (for real-time coach assistance)
export const liveSessionTranscripts = pgTable("liveSessionTranscripts", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  speaker: varchar("speaker", { length: 50 }),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

// Coach Guidance (AI suggestions during live sessions)
export const coachGuidance = pgTable("coachGuidance", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  guidanceType: varchar("guidance_type", { length: 50 }),
  priority: varchar("priority", { length: 50 }),
  message: text("message").notNull(),
  context: text("context"),
  timestamp: timestamp("timestamp").notNull(),
  wasFollowed: varchar("was_followed", { length: 50 }),
});


/**
 * Session Recordings - Store video/audio recordings with 2-tier access
 */
export const sessionRecordings = pgTable("sessionRecordings", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  clientId: integer("client_id").notNull().references(() => clients.id),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  videoUrl: text("video_url"), // S3 URL to video recording
  videoKey: varchar("video_key", { length: 500 }), // S3 key for video
  audioUrl: text("audio_url"), // S3 URL to audio recording
  audioKey: varchar("audio_key", { length: 500 }), // S3 key for audio
  transcriptUrl: text("transcript_url"), // S3 URL to transcript file
  transcriptKey: varchar("transcript_key", { length: 500 }), // S3 key for transcript
  duration: integer("duration"), // Duration in seconds
  fileSize: integer("file_size"), // Total file size in bytes
  status: varchar("status", { length: 50 }),
  clientCanAccess: varchar("client_can_access", { length: 50 }), // Client access control
  consentGiven: varchar("consent_given", { length: 50 }), // Recording consent
  recordedAt: timestamp("recorded_at").notNull(),
  expiresAt: timestamp("expires_at"), // Retention policy
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SessionRecording = typeof sessionRecordings.$inferSelect;
export type InsertSessionRecording = typeof sessionRecordings.$inferInsert;

/**
 * Session Summaries - AI-generated summaries (client-accessible)
 */
export const sessionSummaries = pgTable("sessionSummaries", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  recordingId: integer("recording_id").references(() => sessionRecordings.id),
  summary: text("summary").notNull(), // AI-generated summary
  goals: text("goals"), // JSON array of goals discussed
  homework: text("homework"), // JSON array of homework assigned
  keyMoments: text("key_moments"), // JSON array of breakthrough moments
  emotionTimeline: text("emotion_timeline"), // JSON of emotion changes during session
  techniquesUsed: text("techniques_used"), // JSON array of coaching techniques
  nextSteps: text("next_steps"), // Recommended next steps
  clientProgress: text("client_progress"), // Progress assessment
  generatedAt: timestamp("generated_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SessionSummary = typeof sessionSummaries.$inferSelect;
export type InsertSessionSummary = typeof sessionSummaries.$inferInsert;

/**
 * Coach Private Notes - Coach-only notes (NOT client-accessible)
 */
export const coachPrivateNotes = pgTable("coachPrivateNotes", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  notes: text("notes").notNull(), // Private coach impressions
  aiPromptsReceived: text("ai_prompts_received"), // JSON of AI prompts during session
  supervisionQuestions: text("supervision_questions"), // Questions for supervision
  clinicalObservations: text("clinical_observations"), // Private clinical notes
  reminders: text("reminders"), // Reminders for next session
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CoachPrivateNote = typeof coachPrivateNotes.$inferSelect;
export type InsertCoachPrivateNote = typeof coachPrivateNotes.$inferInsert;

/**
 * Platform Analytics - Bird's eye view across all clients
 */
export const platformAnalytics = pgTable("platformAnalytics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type", { length: 50 }),
  metricName: varchar("metric_name", { length: 255 }).notNull(),
  metricValue: text("metric_value").notNull(), // JSON with metric data
  sampleSize: integer("sample_size").notNull(), // Number of clients/sessions analyzed
  confidence: integer("confidence").notNull(), // Confidence score 0-100
  timeframe: varchar("timeframe", { length: 100 }).notNull(), // e.g., "2025-Q1", "2025-11"
  demographics: text("demographics"), // JSON of demographic breakdown
  insights: text("insights"), // Human-readable insights
  actionable: varchar("actionable", { length: 50 }),
  implemented: varchar("implemented", { length: 50 }),
  calculatedAt: timestamp("calculated_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PlatformAnalytic = typeof platformAnalytics.$inferSelect;
export type InsertPlatformAnalytic = typeof platformAnalytics.$inferInsert;

/**
 * Technique Effectiveness - Track success rates of coaching techniques
 */
export const techniqueEffectiveness = pgTable("techniqueEffectiveness", {
  id: serial("id").primaryKey(),
  techniqueName: varchar("technique_name", { length: 255 }).notNull(),
  techniqueCategory: varchar("technique_category", { length: 100 }).notNull(), // e.g., "CBT", "mindfulness", "somatic"
  totalUsage: integer("total_usage").notNull(), // Times used
  successCount: integer("success_count").notNull(), // Times it worked
  successRate: integer("success_rate").notNull(), // Percentage 0-100
  avgTimeToResults: integer("avg_time_to_results"), // Average days to see results
  bestForIssues: text("best_for_issues"), // JSON array of issues it works best for
  bestForDemographics: text("best_for_demographics"), // JSON of demographics
  clientFeedback: text("client_feedback"), // JSON array of feedback quotes
  coachNotes: text("coach_notes"), // Coach observations
  lastUpdated: timestamp("last_updated").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TechniqueEffectiveness = typeof techniqueEffectiveness.$inferSelect;
export type InsertTechniqueEffectiveness = typeof techniqueEffectiveness.$inferInsert;

/**
 * Client Patterns - Individual client intelligence
 */
export const clientPatterns = pgTable("clientPatterns", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  patternType: varchar("pattern_type", { length: 50 }),
  patternName: varchar("pattern_name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  frequency: integer("frequency").notNull(), // How often this pattern occurs
  confidence: integer("confidence").notNull(), // Confidence score 0-100
  firstDetected: timestamp("first_detected").notNull(),
  lastOccurred: timestamp("last_occurred").notNull(),
  relatedSessions: text("related_sessions"), // JSON array of session IDs
  actionable: text("actionable"), // What coach should do about this pattern
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClientPattern = typeof clientPatterns.$inferSelect;
export type InsertClientPattern = typeof clientPatterns.$inferInsert;

/**
 * Client Preferences - What works best for each client
 */
export const clientPreferences = pgTable("clientPreferences", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  preferenceType: varchar("preference_type", { length: 50 }),
  preferenceName: varchar("preference_name", { length: 255 }).notNull(),
  preferenceValue: text("preference_value").notNull(), // What they prefer
  effectiveness: integer("effectiveness").notNull(), // How well it works 0-100
  timesUsed: integer("times_used").notNull(),
  lastUsed: timestamp("last_used").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClientPreference = typeof clientPreferences.$inferSelect;
export type InsertClientPreference = typeof clientPreferences.$inferInsert;

/**
 * Client Predictions - AI predictions about client needs
 */
export const clientPredictions = pgTable("clientPredictions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  predictionType: varchar("prediction_type", { length: 50 }),
  prediction: text("prediction").notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  reasoning: text("reasoning").notNull(), // Why AI made this prediction
  basedOnData: text("based_on_data"), // JSON of data points used
  validUntil: timestamp("valid_until").notNull(),
  wasAccurate: varchar("was_accurate", { length: 50 }),
  actualOutcome: text("actual_outcome"), // What actually happened
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClientPrediction = typeof clientPredictions.$inferSelect;
export type InsertClientPrediction = typeof clientPredictions.$inferInsert;

/**
 * Coach Feedback - Feedback on AI suggestions for adaptive learning
 */
export const coachFeedback = pgTable("coachFeedback", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull().references(() => coaches.id),
  sessionId: integer("session_id").references(() => sessions.id),
  suggestionType: varchar("suggestion_type", { length: 100 }).notNull(), // What type of AI suggestion
  suggestionContent: text("suggestion_content").notNull(), // What AI suggested
  feedbackType: varchar("feedback_type", { length: 50 }),
  rating: integer("rating"), // 1-5 stars
  notes: text("notes"), // Coach's explanation
  wasUsed: varchar("was_used", { length: 50 }),
  outcome: text("outcome"), // What happened after using/ignoring suggestion
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CoachFeedback = typeof coachFeedback.$inferSelect;
export type InsertCoachFeedback = typeof coachFeedback.$inferInsert;

/**
 * Suggestion Effectiveness - Track how well AI suggestions work
 */
export const suggestionEffectiveness = pgTable("suggestionEffectiveness", {
  id: serial("id").primaryKey(),
  suggestionType: varchar("suggestion_type", { length: 100 }).notNull(),
  totalSuggestions: integer("total_suggestions").notNull(),
  timesUsed: integer("times_used").notNull(),
  timesHelpful: integer("times_helpful").notNull(),
  usageRate: integer("usage_rate").notNull(), // Percentage 0-100
  helpfulnessRate: integer("helpfulness_rate").notNull(), // Percentage 0-100
  avgRating: integer("avg_rating"), // Average rating 1-5
  bestContext: text("best_context"), // JSON of when it works best
  improvements: text("improvements"), // Suggested improvements
  lastUpdated: timestamp("last_updated").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SuggestionEffectiveness = typeof suggestionEffectiveness.$inferSelect;
export type InsertSuggestionEffectiveness = typeof suggestionEffectiveness.$inferInsert;

/**
 * Email automation tracking - logs all automated emails sent to users
 */
export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailType: varchar("email_type", { length: 50 }),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  subject: varchar("subject", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }),
  metadata: text("metadata"), // JSON string with additional data like usage stats
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

/**
 * Client Files - Store all files uploaded by or generated for clients
 * Organized in per-client folders in S3
 */
export const clientFiles = pgTable("client_files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").references(() => aiChatConversations.id, { onDelete: "set null" }), // Link to conversation if applicable
  sessionId: integer("session_id").references(() => humanSessionBookings.id, { onDelete: "set null" }), // Link to session if applicable
  
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 50 }),
  fileCategory: varchar("file_category", { length: 50 }),
  
  fileUrl: text("file_url").notNull(), // Public S3 URL
  fileKey: text("file_key").notNull(), // S3 key for deletion/management
  mimeType: varchar("mime_type", { length: 100 }),
  fileSize: integer("file_size"), // Size in bytes
  duration: integer("duration"), // Duration in seconds for audio/video
  
  transcriptionText: text("transcription_text"), // Auto-generated transcription for audio/video
  transcriptionStatus: varchar("transcription_status", { length: 50 }),
  
  coachNotes: text("coach_notes"), // Coach can add notes about this file
  tags: text("tags"), // JSON array of tags for organization
  
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClientFile = typeof clientFiles.$inferSelect;
export type InsertClientFile = typeof clientFiles.$inferInsert;
