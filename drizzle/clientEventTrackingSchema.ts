import { pgTable, serial, integer, text, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { clients } from "./schema";

/**
 * CLIENT EVENT TRACKING SCHEMA
 * 
 * Part of the Unified Client Profile - captures EVERY interaction to better
 * understand and help clients.
 * 
 * This data enables Sage to:
 * - Notice patterns ("You've been spending a lot of time in the journal section...")
 * - Identify hesitation ("You keep coming back to goal-setting but haven't set one yet...")
 * - Understand engagement ("You seem most active in the evenings around 9pm...")
 * - Detect struggles ("I noticed you started the meditation but stopped halfway...")
 * - Celebrate progress ("You've logged in every day this week!")
 * 
 * EVERY interaction is gold for understanding the client.
 */

/**
 * Client Events Table
 * Captures every interaction: button clicks, link clicks, page visits, 
 * feature usage, time spent, scroll patterns, and more.
 */
export const clientEvents = pgTable("client_events", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  
  // Event identification
  eventType: varchar("event_type", { length: 50 }).notNull(), // click, view, scroll, input, navigation, etc.
  eventCategory: varchar("event_category", { length: 50 }).notNull(), // ui, feature, content, session, etc.
  eventAction: varchar("event_action", { length: 100 }).notNull(), // button_click, page_view, feature_start, etc.
  eventLabel: varchar("event_label", { length: 255 }), // Specific identifier (button name, page name, etc.)
  
  // Context
  pagePath: varchar("page_path", { length: 255 }), // /dashboard, /journal, /chat, etc.
  pageTitle: varchar("page_title", { length: 255 }), // Human-readable page name
  componentName: varchar("component_name", { length: 100 }), // React component that triggered event
  elementId: varchar("element_id", { length: 100 }), // DOM element ID if applicable
  elementText: text("element_text"), // Text content of clicked element
  
  // Timing
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionId: varchar("session_id", { length: 64 }), // Browser session ID for grouping
  timeOnPage: integer("time_on_page"), // Seconds spent on page before this event
  timeSinceLastEvent: integer("time_since_last_event"), // Seconds since previous event
  
  // Scroll & Engagement
  scrollDepth: integer("scroll_depth"), // Percentage of page scrolled (0-100)
  viewportPosition: varchar("viewport_position", { length: 20 }), // top, middle, bottom
  
  // Device & Context
  deviceType: varchar("device_type", { length: 20 }), // mobile, tablet, desktop
  browserName: varchar("browser_name", { length: 50 }),
  screenSize: varchar("screen_size", { length: 20 }), // e.g., "1920x1080"
  
  // Rich metadata (flexible JSON for additional context)
  metadata: jsonb("metadata"), // Any additional event-specific data
  
  // For AI analysis
  sentimentHint: varchar("sentiment_hint", { length: 20 }), // positive, negative, neutral, frustrated, excited
  engagementLevel: varchar("engagement_level", { length: 20 }), // high, medium, low, abandoning
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Indexes for fast queries
  clientIdIdx: index("client_events_client_id_idx").on(table.clientId),
  timestampIdx: index("client_events_timestamp_idx").on(table.timestamp),
  eventTypeIdx: index("client_events_event_type_idx").on(table.eventType),
  sessionIdIdx: index("client_events_session_id_idx").on(table.sessionId),
  pagePathIdx: index("client_events_page_path_idx").on(table.pagePath),
}));

export type ClientEvent = typeof clientEvents.$inferSelect;
export type InsertClientEvent = typeof clientEvents.$inferInsert;

/**
 * Client Sessions Table
 * Tracks browsing sessions for grouping events and understanding visit patterns
 */
export const clientSessions = pgTable("client_sessions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id", { length: 64 }).notNull().unique(),
  
  // Session timing
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
  
  // Session context
  entryPage: varchar("entry_page", { length: 255 }), // First page visited
  exitPage: varchar("exit_page", { length: 255 }), // Last page visited
  pageCount: integer("page_count").default(0), // Number of pages visited
  eventCount: integer("event_count").default(0), // Number of events in session
  
  // Device info
  deviceType: varchar("device_type", { length: 20 }),
  browserName: varchar("browser_name", { length: 50 }),
  operatingSystem: varchar("operating_system", { length: 50 }),
  screenSize: varchar("screen_size", { length: 20 }),
  
  // Traffic source
  referrer: varchar("referrer", { length: 500 }),
  utmSource: varchar("utm_source", { length: 100 }),
  utmMedium: varchar("utm_medium", { length: 100 }),
  utmCampaign: varchar("utm_campaign", { length: 100 }),
  
  // Session quality indicators
  bounced: varchar("bounced", { length: 10 }), // yes/no - left after one page
  engaged: varchar("engaged", { length: 10 }), // yes/no - meaningful interaction
  converted: varchar("converted", { length: 10 }), // yes/no - completed key action
  
  // AI-generated insights
  sessionSummary: text("session_summary"), // AI summary of what they did
  sessionMood: varchar("session_mood", { length: 20 }), // detected mood during session
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  clientIdIdx: index("client_sessions_client_id_idx").on(table.clientId),
  startedAtIdx: index("client_sessions_started_at_idx").on(table.startedAt),
}));

export type ClientSession = typeof clientSessions.$inferSelect;
export type InsertClientSession = typeof clientSessions.$inferInsert;

/**
 * Feature Usage Table
 * Aggregated feature usage stats for quick insights
 */
export const clientFeatureUsage = pgTable("client_feature_usage", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  
  // Feature identification
  featureName: varchar("feature_name", { length: 100 }).notNull(), // journal, chat, meditation, goals, etc.
  featureCategory: varchar("feature_category", { length: 50 }), // core, wellness, productivity, etc.
  
  // Usage stats
  totalUses: integer("total_uses").default(0),
  totalTimeSeconds: integer("total_time_seconds").default(0),
  averageSessionSeconds: integer("average_session_seconds").default(0),
  
  // Engagement
  completionRate: integer("completion_rate").default(0), // 0-100%
  lastUsedAt: timestamp("last_used_at"),
  firstUsedAt: timestamp("first_used_at"),
  
  // Patterns
  preferredTimeOfDay: varchar("preferred_time_of_day", { length: 20 }), // morning, afternoon, evening, night
  preferredDayOfWeek: varchar("preferred_day_of_week", { length: 20 }), // monday, tuesday, etc.
  streakCurrent: integer("streak_current").default(0), // Current consecutive days
  streakLongest: integer("streak_longest").default(0), // Longest streak ever
  
  // AI insights
  usagePattern: varchar("usage_pattern", { length: 50 }), // regular, sporadic, declining, growing
  engagementTrend: varchar("engagement_trend", { length: 20 }), // up, down, stable
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  clientFeatureIdx: index("client_feature_usage_client_feature_idx").on(table.clientId, table.featureName),
}));

export type ClientFeatureUsage = typeof clientFeatureUsage.$inferSelect;
export type InsertClientFeatureUsage = typeof clientFeatureUsage.$inferInsert;

/**
 * Page Engagement Table
 * Tracks how clients engage with specific pages
 */
export const clientPageEngagement = pgTable("client_page_engagement", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  
  // Page identification
  pagePath: varchar("page_path", { length: 255 }).notNull(),
  pageTitle: varchar("page_title", { length: 255 }),
  
  // Engagement stats
  totalVisits: integer("total_visits").default(0),
  totalTimeSeconds: integer("total_time_seconds").default(0),
  averageTimeSeconds: integer("average_time_seconds").default(0),
  averageScrollDepth: integer("average_scroll_depth").default(0), // 0-100%
  
  // Behavior
  bounceRate: integer("bounce_rate").default(0), // 0-100%
  exitRate: integer("exit_rate").default(0), // 0-100%
  
  // Timing
  lastVisitedAt: timestamp("last_visited_at"),
  firstVisitedAt: timestamp("first_visited_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  clientPageIdx: index("client_page_engagement_client_page_idx").on(table.clientId, table.pagePath),
}));

export type ClientPageEngagement = typeof clientPageEngagement.$inferSelect;
export type InsertClientPageEngagement = typeof clientPageEngagement.$inferInsert;

/**
 * Behavioral Patterns Table
 * AI-detected patterns and insights from event data
 */
export const clientBehavioralPatterns = pgTable("client_behavioral_patterns", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  
  // Pattern identification
  patternType: varchar("pattern_type", { length: 50 }).notNull(), // engagement, avoidance, hesitation, habit, etc.
  patternName: varchar("pattern_name", { length: 100 }).notNull(), // specific pattern name
  
  // Pattern details
  description: text("description"), // Human-readable description
  evidence: jsonb("evidence"), // Events/data that support this pattern
  confidence: integer("confidence").default(0), // 0-100%
  
  // Coaching relevance
  coachingRelevance: varchar("coaching_relevance", { length: 20 }), // high, medium, low
  suggestedAction: text("suggested_action"), // What Sage could do with this insight
  
  // Status
  isActive: varchar("is_active", { length: 10 }).default("yes"),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  lastConfirmedAt: timestamp("last_confirmed_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  clientPatternIdx: index("client_behavioral_patterns_client_idx").on(table.clientId),
}));

export type ClientBehavioralPattern = typeof clientBehavioralPatterns.$inferSelect;
export type InsertClientBehavioralPattern = typeof clientBehavioralPatterns.$inferInsert;
