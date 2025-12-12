import { date, decimal, int, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Export identity schema tables
export * from "./identitySchema";

// Export client recognition schema tables
export * from "./clientRecognitionSchema";

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
export * from "./contentModerationSchema";
export * from "./notificationsSchema";
export * from "./securitySchema";
export * from "./settingsSchema";

// Export wellness & lifestyle schemas
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
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  birthdate: date("birthdate"), // For age verification (18+ requirement)
  role: varchar("role", { length: 50 }),
  
  // Profile fields extracted from AI conversations
  primaryGoal: text("primaryGoal"), // e.g., "stress management", "career transition"
  secondaryGoal: text("secondaryGoal"),
  mainChallenges: text("mainChallenges"), // JSON array of challenges
  preferredFrequency: varchar("preferredFrequency", { length: 50 }),
  timezone: varchar("timezone", { length: 64 }), // e.g., "America/Los_Angeles"
  availability: text("availability"), // e.g., "evenings", "weekends", "flexible"
  communicationStyle: varchar("communicationStyle", { length: 50 }),
  triggers: text("triggers"), // JSON array of triggers to watch for
  profileCompleteness: integer("profileCompleteness").default(0), // 0-100%
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Coaches table - extends users with coaching-specific information
 */
export const coaches = pgTable("coaches", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  specialization: text("specialization"),
  bio: text("bio"),
  certifications: text("certifications"),
  yearsExperience: integer("yearsExperience"),
  isActive: varchar("isActive", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = typeof coaches.$inferInsert;

/**
 * Clients table - people being coached
 */
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  coachId: integer("coachId").notNull().references(() => coaches.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  dateOfBirth: timestamp("dateOfBirth"),
  goals: text("goals"),
  notes: text("notes"),
  status: varchar("status", { length: 50 }),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  
  // Professional Info (auto-extracted from conversations)
  jobTitle: varchar("jobTitle", { length: 200 }),
  company: varchar("company", { length: 200 }),
  industry: varchar("industry", { length: 100 }),
  careerGoals: text("careerGoals"),
  
  // Personal Info (auto-extracted)
  age: integer("age"),
  locationCity: varchar("locationCity", { length: 100 }),
  locationState: varchar("locationState", { length: 100 }),
  locationCountry: varchar("locationCountry", { length: 100 }),
  relationshipStatus: varchar("relationshipStatus", { length: 50 }),
  hasChildren: varchar("hasChildren", { length: 50 }),
  
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
  hasDebt: varchar("hasDebt", { length: 50 }),
  monthlyExpensesEstimate: integer("monthlyExpensesEstimate"),
  
  // Communication Preferences (auto-extracted)
  preferredContact: varchar("preferredContact", { length: 50 }),
  bestTimeToReach: varchar("bestTimeToReach", { length: 50 }),
  communicationStyle: varchar("communicationStyle", { length: 50 }),
  
  // Crisis Indicators (auto-detected)
  suicideRiskLevel: varchar("suicideRiskLevel", { length: 20 }),
  crisisFlags: text("crisisFlags"), // JSON array
  lastCrisisCheck: timestamp("lastCrisisCheck"),
  
  // Extraction Metadata
  profileCompleteness: integer("profileCompleteness").default(0),
  confidenceScores: text("confidenceScores"), // JSON object
  lastProfileUpdate: timestamp("lastProfileUpdate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Journal entries with emotional resilience tracking
 */
export const journalEntries = pgTable("journalEntries", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  entryDate: timestamp("entryDate").defaultNow().notNull(),
  content: text("content").notNull(),
  mood: varchar("mood", { length: 50 }),
  moodIntensity: integer("moodIntensity"), // 1-10 scale
  emotions: text("emotions"), // JSON array of emotions
  triggers: text("triggers"), // What triggered the emotions
  copingStrategies: text("copingStrategies"), // What they did to cope
  copingEffectiveness: integer("copingEffectiveness"), // 1-10 scale
  resilienceScore: integer("resilienceScore"), // Calculated resilience score
  isPrivate: varchar("isPrivate", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

/**
 * Emotion logs - detailed tracking of emotional states
 */
export const emotionLogs = pgTable("emotionLogs", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  journalEntryId: integer("journalEntryId").references(() => journalEntries.id),
  logDate: timestamp("logDate").defaultNow().notNull(),
  emotionType: varchar("emotionType", { length: 100 }).notNull(), // joy, sadness, anger, fear, etc.
  intensity: integer("intensity").notNull(), // 1-10 scale
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
export const copingStrategies = pgTable("copingStrategies", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  strategyName: varchar("strategyName", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // breathing, physical, social, cognitive, etc.
  timesUsed: integer("timesUsed").default(0).notNull(),
  averageEffectiveness: integer("averageEffectiveness"), // Average rating 1-10
  lastUsed: timestamp("lastUsed"),
  isRecommended: varchar("isRecommended", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CopingStrategy = typeof copingStrategies.$inferSelect;
export type InsertCopingStrategy = typeof copingStrategies.$inferInsert;

/**
 * AI insights and pattern detection results
 */
export const aiInsights = pgTable("aiInsights", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  insightDate: timestamp("insightDate").defaultNow().notNull(),
  insightType: varchar("insightType", { length: 100 }).notNull(), // pattern, trend, recommendation, alert
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 50 }),
  actionable: text("actionable"), // Suggested actions
  isRead: varchar("isRead", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = typeof aiInsights.$inferInsert;

/**
 * Session types - configurable session offerings with pricing
 */
export const sessionTypes = pgTable("sessionTypes", {
  id: serial("id").primaryKey(),
  coachId: integer("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price").notNull(), // in cents (e.g., 7500 = $75.00)
  stripePriceId: varchar("stripePriceId", { length: 255 }), // Stripe recurring price ID for subscriptions
  oneTimePriceId: varchar("oneTimePriceId", { length: 255 }), // Stripe one-time price ID for single sessions
  subscriptionPrice: integer("subscriptionPrice"), // Monthly subscription price in cents (optional, defaults to price)
  isActive: varchar("isActive", { length: 50 }),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SessionType = typeof sessionTypes.$inferSelect;
export type InsertSessionType = typeof sessionTypes.$inferInsert;

/**
 * Sessions/appointments between coach and client
 */
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  coachId: integer("coachId").notNull().references(() => coaches.id),
  clientId: integer("clientId").references(() => clients.id), // Nullable for anonymous sessions
  sessionTypeId: integer("sessionTypeId").references(() => sessionTypes.id),
  scheduledDate: timestamp("scheduledDate").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price"), // in cents - captured at booking time
  sessionType: varchar("sessionType", { length: 100 }), // legacy field, kept for backward compatibility
  notes: text("notes"),
  status: varchar("status", { length: 50 }),
  paymentStatus: varchar("paymentStatus", { length: 50 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }), // Stripe checkout session ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Subscriptions table for tracking Stripe subscriptions (AI-First Model)
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  productId: varchar("productId", { length: 64 }).notNull(),
  tier: varchar("tier", { length: 50 }),
  billingFrequency: varchar("billingFrequency", { length: 50 }),
  status: varchar("status", { length: 50 }),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelAtPeriodEnd: varchar("cancelAtPeriodEnd", { length: 50 }),
  trialStart: timestamp("trialStart"),
  trialEnd: timestamp("trialEnd"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Usage tracking for subscription billing periods
 */
export const usageTracking = pgTable("usage_tracking", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscriptionId").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  aiSessionsUsed: integer("aiSessionsUsed").default(0).notNull(),
  humanSessionsUsed: integer("humanSessionsUsed").default(0).notNull(),
  humanSessionsIncluded: integer("humanSessionsIncluded").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;

/**
 * Human session bookings for Hybrid and Premium tiers
 */
export const humanSessionBookings = pgTable("human_session_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  coachId: integer("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  subscriptionId: integer("subscriptionId").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  sessionDate: timestamp("sessionDate").notNull(),
  duration: integer("duration").default(30).notNull(),
  status: varchar("status", { length: 50 }),
  zoomLink: text("zoomLink"),
  aiPreSessionBrief: text("aiPreSessionBrief"),
  coachNotes: text("coachNotes"),
  recordingUrl: text("recordingUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type HumanSessionBooking = typeof humanSessionBookings.$inferSelect;
export type InsertHumanSessionBooking = typeof humanSessionBookings.$inferInsert;
/**
 * Coach availability - recurring weekly schedule
 */
export const coachAvailability = pgTable("coachAvailability", {
  id: serial("id").primaryKey(),
  coachId: integer("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  dayOfWeek: integer("dayOfWeek").notNull(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM format (e.g., "09:00")
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:MM format (e.g., "17:00")
  isActive: varchar("isActive", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CoachAvailability = typeof coachAvailability.$inferSelect;
export type InsertCoachAvailability = typeof coachAvailability.$inferInsert;

/**
 * Availability exceptions - time off, holidays, blocked dates
 */
export const availabilityExceptions = pgTable("availabilityExceptions", {
  id: serial("id").primaryKey(),
  coachId: integer("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  reason: varchar("reason", { length: 255 }), // vacation, holiday, personal, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AvailabilityException = typeof availabilityExceptions.$inferSelect;
export type InsertAvailabilityException = typeof availabilityExceptions.$inferInsert;

/**
 * Session reminders - track sent reminder emails
 */
export const sessionReminders = pgTable("sessionReminders", {
  id: serial("id").primaryKey(),
  sessionId: integer("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  reminderType: varchar("reminderType", { length: 50 }),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SessionReminder = typeof sessionReminders.$inferSelect;
export type InsertSessionReminder = typeof sessionReminders.$inferInsert;

/**
 * Discount codes table - for promotional offers and exit-intent popups
 */
export const discountCodes = pgTable("discountCodes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountPercent: integer("discountPercent").notNull(), // 10 for 10%
  discountAmount: integer("discountAmount"), // Fixed amount in cents (optional)
  maxUses: integer("maxUses"), // null = unlimited
  usedCount: integer("usedCount").default(0).notNull(),
  expiresAt: timestamp("expiresAt"),
  isActive: varchar("isActive", { length: 50 }),
  createdBy: integer("createdBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = typeof discountCodes.$inferInsert;

/**
 * Discount code usage tracking
 */
export const discountCodeUsage = pgTable("discountCodeUsage", {
  id: serial("id").primaryKey(),
  discountCodeId: integer("discountCodeId").notNull().references(() => discountCodes.id),
  userId: integer("userId").references(() => users.id),
  sessionId: integer("sessionId").references(() => sessions.id),
  usedAt: timestamp("usedAt").defaultNow().notNull(),
});

export type DiscountCodeUsage = typeof discountCodeUsage.$inferSelect;
export type InsertDiscountCodeUsage = typeof discountCodeUsage.$inferInsert;

/**
 * AI chat conversations - 24/7 AI coaching chat history
 */
export const aiChatConversations = pgTable("aiChatConversations", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }), // Nullable for guest users
  clientId: integer("clientId").references(() => clients.id, { onDelete: "cascade" }), // Optional link to client profile
  subscriptionId: integer("subscriptionId").references(() => subscriptions.id, { onDelete: "set null" }), // Link to subscription for usage tracking
  sessionDuration: integer("sessionDuration").default(0), // Duration in minutes
  title: varchar("title", { length: 255 }), // Auto-generated conversation title
  
  // Quality monitoring fields
  rating: integer("rating"), // 1-5 stars (null = not rated yet)
  feedbackText: text("feedbackText"), // Optional detailed feedback
  feedbackCategory: varchar("feedbackCategory", { length: 50 }),
  wasHelpful: varchar("wasHelpful", { length: 50 }), // Simple thumbs up/down
  reviewedByAdmin: varchar("reviewedByAdmin", { length: 50 }),
  adminNotes: text("adminNotes"), // Admin review notes
  
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AiChatConversation = typeof aiChatConversations.$inferSelect;
export type InsertAiChatConversation = typeof aiChatConversations.$inferInsert;

/**
 * AI chat messages - individual messages in conversations
 */
export const aiChatMessages = pgTable("aiChatMessages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }),
  content: text("content").notNull(),
  emotionDetected: varchar("emotionDetected", { length: 100 }), // AI-detected emotion from user message
  crisisFlag: varchar("crisisFlag", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type InsertAiChatMessage = typeof aiChatMessages.$inferInsert;

/**
 * Platform settings - global configuration for the coaching platform
 */
export const platformSettings = pgTable("platformSettings", {
  id: serial("id").primaryKey(),
  aiCoachingEnabled: varchar("aiCoachingEnabled", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
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
  metricValue: varchar("metricValue", { length: 100 }).notNull(), // Metric value (e.g., "$2.3M")
  videoUrl: text("videoUrl"), // S3 URL to video file
  videoKey: varchar("videoKey", { length: 500 }), // S3 key for video file
  thumbnailUrl: text("thumbnailUrl"), // S3 URL to thumbnail image
  thumbnailKey: varchar("thumbnailKey", { length: 500 }), // S3 key for thumbnail
  duration: integer("duration"), // Video duration in seconds
  isPublished: varchar("isPublished", { length: 50 }),
  displayOrder: integer("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type VideoTestimonial = typeof videoTestimonials.$inferSelect;
export type InsertVideoTestimonial = typeof videoTestimonials.$inferInsert;

/**
 * Compliance flags - track prohibited content in AI conversations
 */
export const complianceFlags = pgTable("complianceFlags", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  messageId: integer("messageId").notNull().references(() => aiChatMessages.id, { onDelete: "cascade" }),
  flagType: varchar("flagType", { length: 50 }),
  severity: varchar("severity", { length: 50 }),
  flaggedContent: text("flaggedContent").notNull(), // The specific content that triggered the flag
  aiResponse: text("aiResponse"), // How the AI responded to the flagged content
  reviewStatus: varchar("reviewStatus", { length: 50 }),
  reviewedBy: integer("reviewedBy").references(() => users.id), // Coach who reviewed
  reviewNotes: text("reviewNotes"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ComplianceFlag = typeof complianceFlags.$inferSelect;
export type InsertComplianceFlag = typeof complianceFlags.$inferInsert;

/**
 * Escalation queue - AI to human coach handoff requests
 */
export const escalationQueue = pgTable("escalationQueue", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id),
  clientId: integer("clientId").references(() => clients.id),
  escalationType: varchar("escalationType", { length: 50 }),
  priority: varchar("priority", { length: 50 }),
  reason: text("reason").notNull(), // Why escalation was triggered
  context: text("context"), // Recent conversation context
  status: varchar("status", { length: 50 }),
  assignedTo: integer("assignedTo").references(() => coaches.id), // Which coach is handling it
  assignedAt: timestamp("assignedAt"),
  resolvedAt: timestamp("resolvedAt"),
  resolutionNotes: text("resolutionNotes"),
  notificationSent: varchar("notificationSent", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type EscalationQueue = typeof escalationQueue.$inferSelect;
export type InsertEscalationQueue = typeof escalationQueue.$inferInsert;

/**
 * Similar cases library - context helpers for coaches
 */
export const similarCases = pgTable("similarCases", {
  id: serial("id").primaryKey(),
  caseTitle: varchar("caseTitle", { length: 255 }).notNull(),
  caseDescription: text("caseDescription").notNull(),
  clientIssues: text("clientIssues").notNull(), // JSON array of issues/symptoms
  interventions: text("interventions").notNull(), // What the coach did
  outcome: text("outcome").notNull(), // What happened
  successRating: integer("successRating").notNull(), // 1-10 scale
  timeToResolution: integer("timeToResolution"), // Days to resolution
  coachNotes: text("coachNotes"), // Coach insights and recommendations
  tags: text("tags"), // JSON array of searchable tags
  isPublic: varchar("isPublic", { length: 50 }), // Share with other coaches
  createdBy: integer("createdBy").notNull().references(() => coaches.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SimilarCase = typeof similarCases.$inferSelect;
export type InsertSimilarCase = typeof similarCases.$inferInsert;

/**
 * Coach notifications - alerts for escalations and flags
 */
export const coachNotifications = pgTable("coachNotifications", {
  id: serial("id").primaryKey(),
  coachId: integer("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  notificationType: varchar("notificationType", { length: 50 }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  priority: varchar("priority", { length: 50 }),
  relatedId: integer("relatedId"), // ID of related escalation, flag, etc.
  isRead: varchar("isRead", { length: 50 }),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachNotification = typeof coachNotifications.$inferSelect;
export type InsertCoachNotification = typeof coachNotifications.$inferInsert;


// Live Session Transcripts (for real-time coach assistance)
export const liveSessionTranscripts = pgTable("liveSessionTranscripts", {
  id: serial("id").primaryKey(),
  sessionId: integer("sessionId").notNull(),
  speaker: varchar("speaker", { length: 50 }),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

// Coach Guidance (AI suggestions during live sessions)
export const coachGuidance = pgTable("coachGuidance", {
  id: serial("id").primaryKey(),
  sessionId: integer("sessionId").notNull(),
  guidanceType: varchar("guidanceType", { length: 50 }),
  priority: varchar("priority", { length: 50 }),
  message: text("message").notNull(),
  context: text("context"),
  timestamp: timestamp("timestamp").notNull(),
  wasFollowed: varchar("wasFollowed", { length: 50 }),
});


/**
 * Session Recordings - Store video/audio recordings with 2-tier access
 */
export const sessionRecordings = pgTable("sessionRecordings", {
  id: serial("id").primaryKey(),
  sessionId: integer("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  clientId: integer("clientId").notNull().references(() => clients.id),
  coachId: integer("coachId").notNull().references(() => coaches.id),
  videoUrl: text("videoUrl"), // S3 URL to video recording
  videoKey: varchar("videoKey", { length: 500 }), // S3 key for video
  audioUrl: text("audioUrl"), // S3 URL to audio recording
  audioKey: varchar("audioKey", { length: 500 }), // S3 key for audio
  transcriptUrl: text("transcriptUrl"), // S3 URL to transcript file
  transcriptKey: varchar("transcriptKey", { length: 500 }), // S3 key for transcript
  duration: integer("duration"), // Duration in seconds
  fileSize: integer("fileSize"), // Total file size in bytes
  status: varchar("status", { length: 50 }),
  clientCanAccess: varchar("clientCanAccess", { length: 50 }), // Client access control
  consentGiven: varchar("consentGiven", { length: 50 }), // Recording consent
  recordedAt: timestamp("recordedAt").notNull(),
  expiresAt: timestamp("expiresAt"), // Retention policy
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SessionRecording = typeof sessionRecordings.$inferSelect;
export type InsertSessionRecording = typeof sessionRecordings.$inferInsert;

/**
 * Session Summaries - AI-generated summaries (client-accessible)
 */
export const sessionSummaries = pgTable("sessionSummaries", {
  id: serial("id").primaryKey(),
  sessionId: integer("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  recordingId: integer("recordingId").references(() => sessionRecordings.id),
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
export const coachPrivateNotes = pgTable("coachPrivateNotes", {
  id: serial("id").primaryKey(),
  sessionId: integer("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  coachId: integer("coachId").notNull().references(() => coaches.id),
  notes: text("notes").notNull(), // Private coach impressions
  aiPromptsReceived: text("aiPromptsReceived"), // JSON of AI prompts during session
  supervisionQuestions: text("supervisionQuestions"), // Questions for supervision
  clinicalObservations: text("clinicalObservations"), // Private clinical notes
  reminders: text("reminders"), // Reminders for next session
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CoachPrivateNote = typeof coachPrivateNotes.$inferSelect;
export type InsertCoachPrivateNote = typeof coachPrivateNotes.$inferInsert;

/**
 * Platform Analytics - Bird's eye view across all clients
 */
export const platformAnalytics = pgTable("platformAnalytics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metricType", { length: 50 }),
  metricName: varchar("metricName", { length: 255 }).notNull(),
  metricValue: text("metricValue").notNull(), // JSON with metric data
  sampleSize: integer("sampleSize").notNull(), // Number of clients/sessions analyzed
  confidence: integer("confidence").notNull(), // Confidence score 0-100
  timeframe: varchar("timeframe", { length: 100 }).notNull(), // e.g., "2025-Q1", "2025-11"
  demographics: text("demographics"), // JSON of demographic breakdown
  insights: text("insights"), // Human-readable insights
  actionable: varchar("actionable", { length: 50 }),
  implemented: varchar("implemented", { length: 50 }),
  calculatedAt: timestamp("calculatedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlatformAnalytic = typeof platformAnalytics.$inferSelect;
export type InsertPlatformAnalytic = typeof platformAnalytics.$inferInsert;

/**
 * Technique Effectiveness - Track success rates of coaching techniques
 */
export const techniqueEffectiveness = pgTable("techniqueEffectiveness", {
  id: serial("id").primaryKey(),
  techniqueName: varchar("techniqueName", { length: 255 }).notNull(),
  techniqueCategory: varchar("techniqueCategory", { length: 100 }).notNull(), // e.g., "CBT", "mindfulness", "somatic"
  totalUsage: integer("totalUsage").notNull(), // Times used
  successCount: integer("successCount").notNull(), // Times it worked
  successRate: integer("successRate").notNull(), // Percentage 0-100
  avgTimeToResults: integer("avgTimeToResults"), // Average days to see results
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
export const clientPatterns = pgTable("clientPatterns", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  patternType: varchar("patternType", { length: 50 }),
  patternName: varchar("patternName", { length: 255 }).notNull(),
  description: text("description").notNull(),
  frequency: integer("frequency").notNull(), // How often this pattern occurs
  confidence: integer("confidence").notNull(), // Confidence score 0-100
  firstDetected: timestamp("firstDetected").notNull(),
  lastOccurred: timestamp("lastOccurred").notNull(),
  relatedSessions: text("relatedSessions"), // JSON array of session IDs
  actionable: text("actionable"), // What coach should do about this pattern
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ClientPattern = typeof clientPatterns.$inferSelect;
export type InsertClientPattern = typeof clientPatterns.$inferInsert;

/**
 * Client Preferences - What works best for each client
 */
export const clientPreferences = pgTable("clientPreferences", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  preferenceType: varchar("preferenceType", { length: 50 }),
  preferenceName: varchar("preferenceName", { length: 255 }).notNull(),
  preferenceValue: text("preferenceValue").notNull(), // What they prefer
  effectiveness: integer("effectiveness").notNull(), // How well it works 0-100
  timesUsed: integer("timesUsed").notNull(),
  lastUsed: timestamp("lastUsed").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ClientPreference = typeof clientPreferences.$inferSelect;
export type InsertClientPreference = typeof clientPreferences.$inferInsert;

/**
 * Client Predictions - AI predictions about client needs
 */
export const clientPredictions = pgTable("clientPredictions", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  predictionType: varchar("predictionType", { length: 50 }),
  prediction: text("prediction").notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  reasoning: text("reasoning").notNull(), // Why AI made this prediction
  basedOnData: text("basedOnData"), // JSON of data points used
  validUntil: timestamp("validUntil").notNull(),
  wasAccurate: varchar("wasAccurate", { length: 50 }),
  actualOutcome: text("actualOutcome"), // What actually happened
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ClientPrediction = typeof clientPredictions.$inferSelect;
export type InsertClientPrediction = typeof clientPredictions.$inferInsert;

/**
 * Coach Feedback - Feedback on AI suggestions for adaptive learning
 */
export const coachFeedback = pgTable("coachFeedback", {
  id: serial("id").primaryKey(),
  coachId: integer("coachId").notNull().references(() => coaches.id),
  sessionId: integer("sessionId").references(() => sessions.id),
  suggestionType: varchar("suggestionType", { length: 100 }).notNull(), // What type of AI suggestion
  suggestionContent: text("suggestionContent").notNull(), // What AI suggested
  feedbackType: varchar("feedbackType", { length: 50 }),
  rating: integer("rating"), // 1-5 stars
  notes: text("notes"), // Coach's explanation
  wasUsed: varchar("wasUsed", { length: 50 }),
  outcome: text("outcome"), // What happened after using/ignoring suggestion
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachFeedback = typeof coachFeedback.$inferSelect;
export type InsertCoachFeedback = typeof coachFeedback.$inferInsert;

/**
 * Suggestion Effectiveness - Track how well AI suggestions work
 */
export const suggestionEffectiveness = pgTable("suggestionEffectiveness", {
  id: serial("id").primaryKey(),
  suggestionType: varchar("suggestionType", { length: 100 }).notNull(),
  totalSuggestions: integer("totalSuggestions").notNull(),
  timesUsed: integer("timesUsed").notNull(),
  timesHelpful: integer("timesHelpful").notNull(),
  usageRate: integer("usageRate").notNull(), // Percentage 0-100
  helpfulnessRate: integer("helpfulnessRate").notNull(), // Percentage 0-100
  avgRating: integer("avgRating"), // Average rating 1-5
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
export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailType: varchar("emailType", { length: 50 }),
  sentAt: timestamp("sentAt").notNull().defaultNow(),
  subject: varchar("subject", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }),
  metadata: text("metadata"), // JSON string with additional data like usage stats
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

/**
 * Client Files - Store all files uploaded by or generated for clients
 * Organized in per-client folders in S3
 */
export const clientFiles = pgTable("client_files", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  conversationId: integer("conversationId").references(() => aiChatConversations.id, { onDelete: "set null" }), // Link to conversation if applicable
  sessionId: integer("sessionId").references(() => humanSessionBookings.id, { onDelete: "set null" }), // Link to session if applicable
  
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileType: varchar("fileType", { length: 50 }),
  fileCategory: varchar("fileCategory", { length: 50 }),
  
  fileUrl: text("fileUrl").notNull(), // Public S3 URL
  fileKey: text("fileKey").notNull(), // S3 key for deletion/management
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: integer("fileSize"), // Size in bytes
  duration: integer("duration"), // Duration in seconds for audio/video
  
  transcriptionText: text("transcriptionText"), // Auto-generated transcription for audio/video
  transcriptionStatus: varchar("transcriptionStatus", { length: 50 }),
  
  coachNotes: text("coachNotes"), // Coach can add notes about this file
  tags: text("tags"), // JSON array of tags for organization
  
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ClientFile = typeof clientFiles.$inferSelect;
export type InsertClientFile = typeof clientFiles.$inferInsert;
