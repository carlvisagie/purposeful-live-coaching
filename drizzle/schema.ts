import { date, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// Export identity schema tables
export * from "./identitySchema";

// Export adaptive learning schema tables
export * from "./adaptiveLearningSchema";

// Export autism transformation module schema tables
export * from "./autismSchema";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  birthdate: date("birthdate"), // For age verification (18+ requirement)
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Profile fields extracted from AI conversations
  primaryGoal: text("primaryGoal"), // e.g., "stress management", "career transition"
  secondaryGoal: text("secondaryGoal"),
  mainChallenges: text("mainChallenges"), // JSON array of challenges
  preferredFrequency: mysqlEnum("preferredFrequency", ["daily", "weekly", "as_needed"]),
  timezone: varchar("timezone", { length: 64 }), // e.g., "America/Los_Angeles"
  availability: text("availability"), // e.g., "evenings", "weekends", "flexible"
  communicationStyle: mysqlEnum("communicationStyle", ["concise", "detailed", "balanced"]).default("balanced"),
  triggers: text("triggers"), // JSON array of triggers to watch for
  profileCompleteness: int("profileCompleteness").default(0), // 0-100%
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Coaches table - extends users with coaching-specific information
 */
export const coaches = mysqlTable("coaches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  specialization: text("specialization"),
  bio: text("bio"),
  certifications: text("certifications"),
  yearsExperience: int("yearsExperience"),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = typeof coaches.$inferInsert;

/**
 * Clients table - people being coached
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  dateOfBirth: timestamp("dateOfBirth"),
  goals: text("goals"),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "inactive", "completed"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  
  // Professional Info (auto-extracted from conversations)
  jobTitle: varchar("jobTitle", { length: 200 }),
  company: varchar("company", { length: 200 }),
  industry: varchar("industry", { length: 100 }),
  careerGoals: text("careerGoals"),
  
  // Personal Info (auto-extracted)
  age: int("age"),
  locationCity: varchar("locationCity", { length: 100 }),
  locationState: varchar("locationState", { length: 100 }),
  locationCountry: varchar("locationCountry", { length: 100 }),
  relationshipStatus: varchar("relationshipStatus", { length: 50 }),
  hasChildren: mysqlEnum("hasChildren", ["true", "false"]),
  
  // Goals & Motivation (auto-extracted)
  primaryGoal: text("primaryGoal"),
  goalTimeline: varchar("goalTimeline", { length: 100 }),
  motivation: text("motivation"),
  
  // Identity Architecture (auto-extracted)
  currentIdentity: text("currentIdentity"), // JSON array
  targetIdentity: text("targetIdentity"), // JSON array
  identityGap: text("identityGap"),
  coreValues: text("coreValues"), // JSON array
  lifeMission: text("lifeMission"),
  
  // Behavioral Patterns (auto-extracted)
  procrastinationTriggers: text("procrastinationTriggers"), // JSON array
  energyPattern: varchar("energyPattern", { length: 50 }),
  stressResponses: text("stressResponses"), // JSON array
  
  // Health & Wellness (auto-extracted)
  sleepHours: decimal("sleepHours", { precision: 3, scale: 1 }),
  exerciseFrequency: varchar("exerciseFrequency", { length: 50 }),
  dietPattern: varchar("dietPattern", { length: 100 }),
  mentalHealthNotes: text("mentalHealthNotes"),
  
  // Financial (auto-extracted)
  savingsLevel: varchar("savingsLevel", { length: 50 }),
  hasDebt: mysqlEnum("hasDebt", ["true", "false"]),
  monthlyExpensesEstimate: int("monthlyExpensesEstimate"),
  
  // Communication Preferences (auto-extracted)
  preferredContact: varchar("preferredContact", { length: 50 }),
  bestTimeToReach: varchar("bestTimeToReach", { length: 50 }),
  communicationStyle: varchar("communicationStyle", { length: 50 }),
  
  // Crisis Indicators (auto-detected)
  suicideRiskLevel: varchar("suicideRiskLevel", { length: 20 }),
  crisisFlags: text("crisisFlags"), // JSON array
  lastCrisisCheck: timestamp("lastCrisisCheck"),
  
  // Extraction Metadata
  profileCompleteness: int("profileCompleteness").default(0),
  confidenceScores: text("confidenceScores"), // JSON object
  lastProfileUpdate: timestamp("lastProfileUpdate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Journal entries with emotional resilience tracking
 */
export const journalEntries = mysqlTable("journalEntries", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  entryDate: timestamp("entryDate").defaultNow().notNull(),
  content: text("content").notNull(),
  mood: varchar("mood", { length: 50 }),
  moodIntensity: int("moodIntensity"), // 1-10 scale
  emotions: text("emotions"), // JSON array of emotions
  triggers: text("triggers"), // What triggered the emotions
  copingStrategies: text("copingStrategies"), // What they did to cope
  copingEffectiveness: int("copingEffectiveness"), // 1-10 scale
  resilienceScore: int("resilienceScore"), // Calculated resilience score
  isPrivate: mysqlEnum("isPrivate", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

/**
 * Emotion logs - detailed tracking of emotional states
 */
export const emotionLogs = mysqlTable("emotionLogs", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  journalEntryId: int("journalEntryId").references(() => journalEntries.id),
  logDate: timestamp("logDate").defaultNow().notNull(),
  emotionType: varchar("emotionType", { length: 100 }).notNull(), // joy, sadness, anger, fear, etc.
  intensity: int("intensity").notNull(), // 1-10 scale
  trigger: text("trigger"),
  physicalSensations: text("physicalSensations"),
  thoughts: text("thoughts"),
  behaviors: text("behaviors"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmotionLog = typeof emotionLogs.$inferSelect;
export type InsertEmotionLog = typeof emotionLogs.$inferInsert;

/**
 * Coping strategies library and effectiveness tracking
 */
export const copingStrategies = mysqlTable("copingStrategies", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  strategyName: varchar("strategyName", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // breathing, physical, social, cognitive, etc.
  timesUsed: int("timesUsed").default(0).notNull(),
  averageEffectiveness: int("averageEffectiveness"), // Average rating 1-10
  lastUsed: timestamp("lastUsed"),
  isRecommended: mysqlEnum("isRecommended", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CopingStrategy = typeof copingStrategies.$inferSelect;
export type InsertCopingStrategy = typeof copingStrategies.$inferInsert;

/**
 * AI insights and pattern detection results
 */
export const aiInsights = mysqlTable("aiInsights", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  insightDate: timestamp("insightDate").defaultNow().notNull(),
  insightType: varchar("insightType", { length: 100 }).notNull(), // pattern, trend, recommendation, alert
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("low").notNull(),
  actionable: text("actionable"), // Suggested actions
  isRead: mysqlEnum("isRead", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = typeof aiInsights.$inferInsert;

/**
 * Session types - configurable session offerings with pricing
 */
export const sessionTypes = mysqlTable("sessionTypes", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  duration: int("duration").notNull(), // in minutes
  price: int("price").notNull(), // in cents (e.g., 7500 = $75.00)
  stripePriceId: varchar("stripePriceId", { length: 255 }), // Stripe recurring price ID for subscriptions
  oneTimePriceId: varchar("oneTimePriceId", { length: 255 }), // Stripe one-time price ID for single sessions
  subscriptionPrice: int("subscriptionPrice"), // Monthly subscription price in cents (optional, defaults to price)
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SessionType = typeof sessionTypes.$inferSelect;
export type InsertSessionType = typeof sessionTypes.$inferInsert;

/**
 * Sessions/appointments between coach and client
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id),
  clientId: int("clientId").notNull().references(() => clients.id),
  sessionTypeId: int("sessionTypeId").references(() => sessionTypes.id),
  scheduledDate: timestamp("scheduledDate").notNull(),
  duration: int("duration").notNull(), // in minutes
  price: int("price"), // in cents - captured at booking time
  sessionType: varchar("sessionType", { length: 100 }), // legacy field, kept for backward compatibility
  notes: text("notes"),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no-show"]).default("scheduled").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded", "failed"]).default("pending"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }), // Stripe checkout session ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Subscriptions table for tracking Stripe subscriptions (AI-First Model)
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  productId: varchar("productId", { length: 64 }).notNull(),
  tier: mysqlEnum("tier", ["ai_only", "hybrid", "premium"]),
  billingFrequency: mysqlEnum("billingFrequency", ["monthly", "yearly"]).default("monthly").notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "past_due", "unpaid", "trialing"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: mysqlEnum("cancelAtPeriodEnd", ["true", "false"]).default("false"),
  trialStart: timestamp("trialStart"),
  trialEnd: timestamp("trialEnd"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Usage tracking for subscription billing periods
 */
export const usageTracking = mysqlTable("usage_tracking", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscriptionId").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  aiSessionsUsed: int("aiSessionsUsed").default(0).notNull(),
  humanSessionsUsed: int("humanSessionsUsed").default(0).notNull(),
  humanSessionsIncluded: int("humanSessionsIncluded").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;

/**
 * Human session bookings for Hybrid and Premium tiers
 */
export const humanSessionBookings = mysqlTable("human_session_bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  coachId: int("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  subscriptionId: int("subscriptionId").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  sessionDate: timestamp("sessionDate").notNull(),
  duration: int("duration").default(30).notNull(),
  status: mysqlEnum("status", ["scheduled", "completed", "canceled", "no_show"]).notNull(),
  zoomLink: text("zoomLink"),
  aiPreSessionBrief: text("aiPreSessionBrief"),
  coachNotes: text("coachNotes"),
  recordingUrl: text("recordingUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HumanSessionBooking = typeof humanSessionBookings.$inferSelect;
export type InsertHumanSessionBooking = typeof humanSessionBookings.$inferInsert;
/**
 * Coach availability - recurring weekly schedule
 */
export const coachAvailability = mysqlTable("coachAvailability", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  dayOfWeek: int("dayOfWeek").notNull(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM format (e.g., "09:00")
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:MM format (e.g., "17:00")
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachAvailability = typeof coachAvailability.$inferSelect;
export type InsertCoachAvailability = typeof coachAvailability.$inferInsert;

/**
 * Availability exceptions - time off, holidays, blocked dates
 */
export const availabilityExceptions = mysqlTable("availabilityExceptions", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  reason: varchar("reason", { length: 255 }), // vacation, holiday, personal, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AvailabilityException = typeof availabilityExceptions.$inferSelect;
export type InsertAvailabilityException = typeof availabilityExceptions.$inferInsert;

/**
 * Session reminders - track sent reminder emails
 */
export const sessionReminders = mysqlTable("sessionReminders", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  reminderType: mysqlEnum("reminderType", ["24_hour", "1_hour"]).notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SessionReminder = typeof sessionReminders.$inferSelect;
export type InsertSessionReminder = typeof sessionReminders.$inferInsert;

/**
 * Discount codes table - for promotional offers and exit-intent popups
 */
export const discountCodes = mysqlTable("discountCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountPercent: int("discountPercent").notNull(), // 10 for 10%
  discountAmount: int("discountAmount"), // Fixed amount in cents (optional)
  maxUses: int("maxUses"), // null = unlimited
  usedCount: int("usedCount").default(0).notNull(),
  expiresAt: timestamp("expiresAt"),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdBy: int("createdBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = typeof discountCodes.$inferInsert;

/**
 * Discount code usage tracking
 */
export const discountCodeUsage = mysqlTable("discountCodeUsage", {
  id: int("id").autoincrement().primaryKey(),
  discountCodeId: int("discountCodeId").notNull().references(() => discountCodes.id),
  userId: int("userId").references(() => users.id),
  sessionId: int("sessionId").references(() => sessions.id),
  usedAt: timestamp("usedAt").defaultNow().notNull(),
});

export type DiscountCodeUsage = typeof discountCodeUsage.$inferSelect;
export type InsertDiscountCodeUsage = typeof discountCodeUsage.$inferInsert;

/**
 * AI chat conversations - 24/7 AI coaching chat history
 */
export const aiChatConversations = mysqlTable("aiChatConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientId: int("clientId").references(() => clients.id, { onDelete: "cascade" }), // Optional link to client profile
  subscriptionId: int("subscriptionId").references(() => subscriptions.id, { onDelete: "set null" }), // Link to subscription for usage tracking
  sessionDuration: int("sessionDuration").default(0), // Duration in minutes
  title: varchar("title", { length: 255 }), // Auto-generated conversation title
  
  // Quality monitoring fields
  rating: int("rating"), // 1-5 stars (null = not rated yet)
  feedbackText: text("feedbackText"), // Optional detailed feedback
  feedbackCategory: mysqlEnum("feedbackCategory", ["helpful", "unhelpful", "inappropriate", "technical_error", "other"]),
  wasHelpful: mysqlEnum("wasHelpful", ["yes", "no"]), // Simple thumbs up/down
  reviewedByAdmin: mysqlEnum("reviewedByAdmin", ["yes", "no"]).default("no"),
  adminNotes: text("adminNotes"), // Admin review notes
  
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiChatConversation = typeof aiChatConversations.$inferSelect;
export type InsertAiChatConversation = typeof aiChatConversations.$inferInsert;

/**
 * AI chat messages - individual messages in conversations
 */
export const aiChatMessages = mysqlTable("aiChatMessages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  emotionDetected: varchar("emotionDetected", { length: 100 }), // AI-detected emotion from user message
  crisisFlag: mysqlEnum("crisisFlag", ["none", "low", "medium", "high", "critical"]).default("none").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type InsertAiChatMessage = typeof aiChatMessages.$inferInsert;

/**
 * Platform settings - global configuration for the coaching platform
 */
export const platformSettings = mysqlTable("platformSettings", {
  id: int("id").autoincrement().primaryKey(),
  aiCoachingEnabled: mysqlEnum("aiCoachingEnabled", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = typeof platformSettings.$inferInsert;


/**
 * Video Testimonials - real client video testimonials
 */
export const videoTestimonials = mysqlTable("videoTestimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Client name
  title: varchar("title", { length: 255 }).notNull(), // Client title/role
  company: varchar("company", { length: 255 }).notNull(), // Client company
  quote: text("quote").notNull(), // Text quote/testimonial
  metric: varchar("metric", { length: 255 }).notNull(), // Metric name (e.g., "Healthcare Cost Savings")
  metricValue: varchar("metricValue", { length: 100 }).notNull(), // Metric value (e.g., "$2.3M")
  videoUrl: text("videoUrl"), // S3 URL to video file
  videoKey: varchar("videoKey", { length: 500 }), // S3 key for video file
  thumbnailUrl: text("thumbnailUrl"), // S3 URL to thumbnail image
  thumbnailKey: varchar("thumbnailKey", { length: 500 }), // S3 key for thumbnail
  duration: int("duration"), // Video duration in seconds
  isPublished: mysqlEnum("isPublished", ["true", "false"]).default("false").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VideoTestimonial = typeof videoTestimonials.$inferSelect;
export type InsertVideoTestimonial = typeof videoTestimonials.$inferInsert;

/**
 * Compliance flags - track prohibited content in AI conversations
 */
export const complianceFlags = mysqlTable("complianceFlags", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  messageId: int("messageId").notNull().references(() => aiChatMessages.id, { onDelete: "cascade" }),
  flagType: mysqlEnum("flagType", ["medical_advice", "diagnosis", "prescription", "legal_advice", "financial_advice", "harmful_content"]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  flaggedContent: text("flaggedContent").notNull(), // The specific content that triggered the flag
  aiResponse: text("aiResponse"), // How the AI responded to the flagged content
  reviewStatus: mysqlEnum("reviewStatus", ["pending", "reviewed", "dismissed", "escalated"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy").references(() => users.id), // Coach who reviewed
  reviewNotes: text("reviewNotes"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ComplianceFlag = typeof complianceFlags.$inferSelect;
export type InsertComplianceFlag = typeof complianceFlags.$inferInsert;

/**
 * Escalation queue - AI to human coach handoff requests
 */
export const escalationQueue = mysqlTable("escalationQueue", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id),
  clientId: int("clientId").references(() => clients.id),
  escalationType: mysqlEnum("escalationType", ["crisis", "client_request", "ai_uncertainty", "compliance_flag", "complex_issue"]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  reason: text("reason").notNull(), // Why escalation was triggered
  context: text("context"), // Recent conversation context
  status: mysqlEnum("status", ["pending", "assigned", "in_progress", "resolved", "closed"]).default("pending").notNull(),
  assignedTo: int("assignedTo").references(() => coaches.id), // Which coach is handling it
  assignedAt: timestamp("assignedAt"),
  resolvedAt: timestamp("resolvedAt"),
  resolutionNotes: text("resolutionNotes"),
  notificationSent: mysqlEnum("notificationSent", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EscalationQueue = typeof escalationQueue.$inferSelect;
export type InsertEscalationQueue = typeof escalationQueue.$inferInsert;

/**
 * Similar cases library - context helpers for coaches
 */
export const similarCases = mysqlTable("similarCases", {
  id: int("id").autoincrement().primaryKey(),
  caseTitle: varchar("caseTitle", { length: 255 }).notNull(),
  caseDescription: text("caseDescription").notNull(),
  clientIssues: text("clientIssues").notNull(), // JSON array of issues/symptoms
  interventions: text("interventions").notNull(), // What the coach did
  outcome: text("outcome").notNull(), // What happened
  successRating: int("successRating").notNull(), // 1-10 scale
  timeToResolution: int("timeToResolution"), // Days to resolution
  coachNotes: text("coachNotes"), // Coach insights and recommendations
  tags: text("tags"), // JSON array of searchable tags
  isPublic: mysqlEnum("isPublic", ["true", "false"]).default("false").notNull(), // Share with other coaches
  createdBy: int("createdBy").notNull().references(() => coaches.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SimilarCase = typeof similarCases.$inferSelect;
export type InsertSimilarCase = typeof similarCases.$inferInsert;

/**
 * Coach notifications - alerts for escalations and flags
 */
export const coachNotifications = mysqlTable("coachNotifications", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  notificationType: mysqlEnum("notificationType", ["escalation", "compliance_flag", "crisis_alert", "new_client", "session_reminder"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  relatedId: int("relatedId"), // ID of related escalation, flag, etc.
  isRead: mysqlEnum("isRead", ["true", "false"]).default("false").notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachNotification = typeof coachNotifications.$inferSelect;
export type InsertCoachNotification = typeof coachNotifications.$inferInsert;


// Live Session Transcripts (for real-time coach assistance)
export const liveSessionTranscripts = mysqlTable("liveSessionTranscripts", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  speaker: mysqlEnum("speaker", ["client", "coach"]).notNull(),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

// Coach Guidance (AI suggestions during live sessions)
export const coachGuidance = mysqlTable("coachGuidance", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  guidanceType: mysqlEnum("guidanceType", ["suggest", "alert", "reference", "technique", "crisis"]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).notNull(),
  message: text("message").notNull(),
  context: text("context"),
  timestamp: timestamp("timestamp").notNull(),
  wasFollowed: mysqlEnum("wasFollowed", ["true", "false"]).default("false"),
});


/**
 * Session Recordings - Store video/audio recordings with 2-tier access
 */
export const sessionRecordings = mysqlTable("sessionRecordings", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  clientId: int("clientId").notNull().references(() => clients.id),
  coachId: int("coachId").notNull().references(() => coaches.id),
  videoUrl: text("videoUrl"), // S3 URL to video recording
  videoKey: varchar("videoKey", { length: 500 }), // S3 key for video
  audioUrl: text("audioUrl"), // S3 URL to audio recording
  audioKey: varchar("audioKey", { length: 500 }), // S3 key for audio
  transcriptUrl: text("transcriptUrl"), // S3 URL to transcript file
  transcriptKey: varchar("transcriptKey", { length: 500 }), // S3 key for transcript
  duration: int("duration"), // Duration in seconds
  fileSize: int("fileSize"), // Total file size in bytes
  status: mysqlEnum("status", ["processing", "ready", "failed", "deleted"]).default("processing").notNull(),
  clientCanAccess: mysqlEnum("clientCanAccess", ["true", "false"]).default("true").notNull(), // Client access control
  consentGiven: mysqlEnum("consentGiven", ["true", "false"]).default("false").notNull(), // Recording consent
  recordedAt: timestamp("recordedAt").notNull(),
  expiresAt: timestamp("expiresAt"), // Retention policy
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SessionRecording = typeof sessionRecordings.$inferSelect;
export type InsertSessionRecording = typeof sessionRecordings.$inferInsert;

/**
 * Session Summaries - AI-generated summaries (client-accessible)
 */
export const sessionSummaries = mysqlTable("sessionSummaries", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  recordingId: int("recordingId").references(() => sessionRecordings.id),
  summary: text("summary").notNull(), // AI-generated summary
  goals: text("goals"), // JSON array of goals discussed
  homework: text("homework"), // JSON array of homework assigned
  keyMoments: text("keyMoments"), // JSON array of breakthrough moments
  emotionTimeline: text("emotionTimeline"), // JSON of emotion changes during session
  techniquesUsed: text("techniquesUsed"), // JSON array of coaching techniques
  nextSteps: text("nextSteps"), // Recommended next steps
  clientProgress: text("clientProgress"), // Progress assessment
  generatedAt: timestamp("generatedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SessionSummary = typeof sessionSummaries.$inferSelect;
export type InsertSessionSummary = typeof sessionSummaries.$inferInsert;

/**
 * Coach Private Notes - Coach-only notes (NOT client-accessible)
 */
export const coachPrivateNotes = mysqlTable("coachPrivateNotes", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  coachId: int("coachId").notNull().references(() => coaches.id),
  notes: text("notes").notNull(), // Private coach impressions
  aiPromptsReceived: text("aiPromptsReceived"), // JSON of AI prompts during session
  supervisionQuestions: text("supervisionQuestions"), // Questions for supervision
  clinicalObservations: text("clinicalObservations"), // Private clinical notes
  reminders: text("reminders"), // Reminders for next session
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachPrivateNote = typeof coachPrivateNotes.$inferSelect;
export type InsertCoachPrivateNote = typeof coachPrivateNotes.$inferInsert;

/**
 * Platform Analytics - Bird's eye view across all clients
 */
export const platformAnalytics = mysqlTable("platformAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  metricType: mysqlEnum("metricType", ["technique_effectiveness", "common_trigger", "demographic_insight", "seasonal_pattern", "trend"]).notNull(),
  metricName: varchar("metricName", { length: 255 }).notNull(),
  metricValue: text("metricValue").notNull(), // JSON with metric data
  sampleSize: int("sampleSize").notNull(), // Number of clients/sessions analyzed
  confidence: int("confidence").notNull(), // Confidence score 0-100
  timeframe: varchar("timeframe", { length: 100 }).notNull(), // e.g., "2025-Q1", "2025-11"
  demographics: text("demographics"), // JSON of demographic breakdown
  insights: text("insights"), // Human-readable insights
  actionable: mysqlEnum("actionable", ["true", "false"]).default("true").notNull(),
  implemented: mysqlEnum("implemented", ["true", "false"]).default("false").notNull(),
  calculatedAt: timestamp("calculatedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlatformAnalytic = typeof platformAnalytics.$inferSelect;
export type InsertPlatformAnalytic = typeof platformAnalytics.$inferInsert;

/**
 * Technique Effectiveness - Track success rates of coaching techniques
 */
export const techniqueEffectiveness = mysqlTable("techniqueEffectiveness", {
  id: int("id").autoincrement().primaryKey(),
  techniqueName: varchar("techniqueName", { length: 255 }).notNull(),
  techniqueCategory: varchar("techniqueCategory", { length: 100 }).notNull(), // e.g., "CBT", "mindfulness", "somatic"
  totalUsage: int("totalUsage").notNull(), // Times used
  successCount: int("successCount").notNull(), // Times it worked
  successRate: int("successRate").notNull(), // Percentage 0-100
  avgTimeToResults: int("avgTimeToResults"), // Average days to see results
  bestForIssues: text("bestForIssues"), // JSON array of issues it works best for
  bestForDemographics: text("bestForDemographics"), // JSON of demographics
  clientFeedback: text("clientFeedback"), // JSON array of feedback quotes
  coachNotes: text("coachNotes"), // Coach observations
  lastUpdated: timestamp("lastUpdated").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TechniqueEffectiveness = typeof techniqueEffectiveness.$inferSelect;
export type InsertTechniqueEffectiveness = typeof techniqueEffectiveness.$inferInsert;

/**
 * Client Patterns - Individual client intelligence
 */
export const clientPatterns = mysqlTable("clientPatterns", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  patternType: mysqlEnum("patternType", ["trigger", "breakthrough", "resistance", "engagement", "communication_style", "optimal_timing"]).notNull(),
  patternName: varchar("patternName", { length: 255 }).notNull(),
  description: text("description").notNull(),
  frequency: int("frequency").notNull(), // How often this pattern occurs
  confidence: int("confidence").notNull(), // Confidence score 0-100
  firstDetected: timestamp("firstDetected").notNull(),
  lastOccurred: timestamp("lastOccurred").notNull(),
  relatedSessions: text("relatedSessions"), // JSON array of session IDs
  actionable: text("actionable"), // What coach should do about this pattern
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientPattern = typeof clientPatterns.$inferSelect;
export type InsertClientPattern = typeof clientPatterns.$inferInsert;

/**
 * Client Preferences - What works best for each client
 */
export const clientPreferences = mysqlTable("clientPreferences", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  preferenceType: mysqlEnum("preferenceType", ["technique", "communication", "timing", "homework_format", "session_structure"]).notNull(),
  preferenceName: varchar("preferenceName", { length: 255 }).notNull(),
  preferenceValue: text("preferenceValue").notNull(), // What they prefer
  effectiveness: int("effectiveness").notNull(), // How well it works 0-100
  timesUsed: int("timesUsed").notNull(),
  lastUsed: timestamp("lastUsed").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientPreference = typeof clientPreferences.$inferSelect;
export type InsertClientPreference = typeof clientPreferences.$inferInsert;

/**
 * Client Predictions - AI predictions about client needs
 */
export const clientPredictions = mysqlTable("clientPredictions", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  predictionType: mysqlEnum("predictionType", ["next_breakthrough", "dropout_risk", "recommended_focus", "technique_suggestion", "optimal_session_time"]).notNull(),
  prediction: text("prediction").notNull(),
  confidence: int("confidence").notNull(), // 0-100
  reasoning: text("reasoning").notNull(), // Why AI made this prediction
  basedOnData: text("basedOnData"), // JSON of data points used
  validUntil: timestamp("validUntil").notNull(),
  wasAccurate: mysqlEnum("wasAccurate", ["true", "false", "unknown"]).default("unknown").notNull(),
  actualOutcome: text("actualOutcome"), // What actually happened
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientPrediction = typeof clientPredictions.$inferSelect;
export type InsertClientPrediction = typeof clientPredictions.$inferInsert;

/**
 * Coach Feedback - Feedback on AI suggestions for adaptive learning
 */
export const coachFeedback = mysqlTable("coachFeedback", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id),
  sessionId: int("sessionId").references(() => sessions.id),
  suggestionType: varchar("suggestionType", { length: 100 }).notNull(), // What type of AI suggestion
  suggestionContent: text("suggestionContent").notNull(), // What AI suggested
  feedbackType: mysqlEnum("feedbackType", ["helpful", "not_helpful", "partially_helpful", "used", "ignored"]).notNull(),
  rating: int("rating"), // 1-5 stars
  notes: text("notes"), // Coach's explanation
  wasUsed: mysqlEnum("wasUsed", ["true", "false"]).notNull(),
  outcome: text("outcome"), // What happened after using/ignoring suggestion
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachFeedback = typeof coachFeedback.$inferSelect;
export type InsertCoachFeedback = typeof coachFeedback.$inferInsert;

/**
 * Suggestion Effectiveness - Track how well AI suggestions work
 */
export const suggestionEffectiveness = mysqlTable("suggestionEffectiveness", {
  id: int("id").autoincrement().primaryKey(),
  suggestionType: varchar("suggestionType", { length: 100 }).notNull(),
  totalSuggestions: int("totalSuggestions").notNull(),
  timesUsed: int("timesUsed").notNull(),
  timesHelpful: int("timesHelpful").notNull(),
  usageRate: int("usageRate").notNull(), // Percentage 0-100
  helpfulnessRate: int("helpfulnessRate").notNull(), // Percentage 0-100
  avgRating: int("avgRating"), // Average rating 1-5
  bestContext: text("bestContext"), // JSON of when it works best
  improvements: text("improvements"), // Suggested improvements
  lastUpdated: timestamp("lastUpdated").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SuggestionEffectiveness = typeof suggestionEffectiveness.$inferSelect;
export type InsertSuggestionEffectiveness = typeof suggestionEffectiveness.$inferInsert;

/**
 * Email automation tracking - logs all automated emails sent to users
 */
export const emailLogs = mysqlTable("email_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailType: mysqlEnum("emailType", [
    "trial_day5_reminder",
    "welcome",
    "payment_failed",
    "payment_recovered",
    "monthly_summary",
    "subscription_cancelled",
    "subscription_reactivated",
  ]).notNull(),
  sentAt: timestamp("sentAt").notNull().defaultNow(),
  subject: varchar("subject", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["sent", "failed", "bounced"]).notNull().default("sent"),
  metadata: text("metadata"), // JSON string with additional data like usage stats
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

/**
 * Client Files - Store all files uploaded by or generated for clients
 * Organized in per-client folders in S3
 */
export const clientFiles = mysqlTable("client_files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  conversationId: int("conversationId").references(() => aiChatConversations.id, { onDelete: "set null" }), // Link to conversation if applicable
  sessionId: int("sessionId").references(() => humanSessionBookings.id, { onDelete: "set null" }), // Link to session if applicable
  
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileType: mysqlEnum("fileType", ["audio", "video", "document", "image", "transcript"]).notNull(),
  fileCategory: mysqlEnum("fileCategory", [
    "voice_memo",
    "session_recording",
    "journal_entry",
    "photo",
    "document",
    "ai_transcript",
    "other"
  ]).notNull().default("other"),
  
  fileUrl: text("fileUrl").notNull(), // Public S3 URL
  fileKey: text("fileKey").notNull(), // S3 key for deletion/management
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"), // Size in bytes
  duration: int("duration"), // Duration in seconds for audio/video
  
  transcriptionText: text("transcriptionText"), // Auto-generated transcription for audio/video
  transcriptionStatus: mysqlEnum("transcriptionStatus", ["pending", "completed", "failed"]).default("pending"),
  
  coachNotes: text("coachNotes"), // Coach can add notes about this file
  tags: text("tags"), // JSON array of tags for organization
  
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientFile = typeof clientFiles.$inferSelect;
export type InsertClientFile = typeof clientFiles.$inferInsert;
