/**
 * USER SETTINGS & PREFERENCES SYSTEM
 * Comprehensive platform customization and user control
 * 
 * CORE PRINCIPLES:
 * 1. User Control (users own their experience)
 * 2. Privacy First (transparent data practices)
 * 3. Accessibility (WCAG 2.1 AA compliance)
 * 4. Personalization (adapt to preferences)
 * 5. Sensible Defaults (works out of box)
 * 6. Progressive Disclosure (don't overwhelm)
 * 
 * SETTINGS CATEGORIES:
 * - Account (profile, email, password)
 * - Privacy (data sharing, visibility)
 * - Notifications (channels, frequency, timing)
 * - Appearance (theme, layout, accessibility)
 * - Data & Storage (export, backup, deletion)
 * - Integrations (connected services)
 * - Preferences (units, language, timezone)
 * - AI & Automation (AI features, automation)
 */

import { boolean, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// User Settings
export const userSettings = pgTable("user_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  
  // Account Settings
  displayName: varchar("display_name", { length: 255 }),
  bio: text("bio"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  
  // Contact
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  
  // Location
  timezone: varchar("timezone", { length: 100 }).default("UTC"),
  country: varchar("country", { length: 100 }),
  language: varchar("language", { length: 10 }).default("en"),
  
  // Units
  measurementSystem: varchar("measurement_system", { length: 50 }),
  temperatureUnit: varchar("temperature_unit", { length: 50 }),
  
  // Date & Time Format
  dateFormat: varchar("date_format", { length: 50 }).default("YYYY-MM-DD"),
  timeFormat: varchar("time_format", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Privacy Settings
export const privacySettings = pgTable("privacy_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  
  // Profile Visibility
  profileVisibility: varchar("profile_visibility", { length: 50 }),
  
  // Data Sharing
  shareDataForResearch: boolean("share_data_for_research").default(false),
  shareDataForAI: boolean("share_data_for_ai").default(true),
  shareProgressWithCommunity: boolean("share_progress_with_community").default(false),
  
  // Activity Visibility
  showActivityFeed: boolean("show_activity_feed").default(false),
  showGoals: boolean("show_goals").default(false),
  showAchievements: boolean("show_achievements").default(true),
  showStats: boolean("show_stats").default(false),
  
  // Social
  allowFriendRequests: boolean("allow_friend_requests").default(true),
  allowMessages: boolean("allow_messages").default(true),
  
  // Search
  searchable: boolean("searchable").default(false),
  
  // Analytics
  allowAnalyticsCookies: boolean("allow_analytics_cookies").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appearance Settings
export const appearanceSettings = pgTable("appearance_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  
  // Theme
  theme: varchar("theme", { length: 50 }),
  accentColor: varchar("accent_color", { length: 50 }).default("#3B82F6"),
  
  // Layout
  sidebarPosition: varchar("sidebar_position", { length: 50 }),
  compactMode: boolean("compact_mode").default(false),
  
  // Typography
  fontSize: varchar("font_size", { length: 50 }),
  fontFamily: varchar("font_family", { length: 100 }).default("system"),
  
  // Accessibility
  highContrast: boolean("high_contrast").default(false),
  reduceMotion: boolean("reduce_motion").default(false),
  screenReaderOptimized: boolean("screen_reader_optimized").default(false),
  
  // Dashboard
  defaultDashboard: varchar("default_dashboard", { length: 100 }).default("overview"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI & Automation Settings
export const aiSettings = pgTable("ai_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  
  // AI Features
  aiCoachEnabled: boolean("ai_coach_enabled").default(true),
  aiInsightsEnabled: boolean("ai_insights_enabled").default(true),
  aiRecommendationsEnabled: boolean("ai_recommendations_enabled").default(true),
  aiPredictionsEnabled: boolean("ai_predictions_enabled").default(true),
  
  // Automation
  autoHabitTracking: boolean("auto_habit_tracking").default(false),
  autoGoalSuggestions: boolean("auto_goal_suggestions").default(true),
  autoProgressReports: boolean("auto_progress_reports").default(true),
  
  // Proactivity
  proactiveCheckIns: boolean("proactive_check_ins").default(true),
  proactiveInterventions: boolean("proactive_interventions").default(true),
  
  // AI Personality
  aiTone: varchar("ai_tone", { length: 50 }),
  aiVerbosity: varchar("ai_verbosity", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Data & Storage Settings
export const dataSettings = pgTable("data_settings", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  
  // Backup
  autoBackupEnabled: boolean("auto_backup_enabled").default(true),
  backupFrequency: varchar("backup_frequency", { length: 50 }),
  lastBackupAt: timestamp("last_backup_at"),
  
  // Data Retention
  dataRetentionPeriod: varchar("data_retention_period", { length: 50 }),
  
  // Export
  exportFormat: varchar("export_format", { length: 50 }),
  
  // Storage
  storageUsed: integer("storage_used").default(0), // bytes
  storageLimit: integer("storage_limit").default(1073741824), // 1GB default
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Module Preferences
export const modulePreferences = pgTable("module_preferences", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Module
  moduleName: varchar("module_name", { length: 100 }).notNull(),
  
  // Enabled
  enabled: boolean("enabled").default(true),
  
  // Visibility
  showInDashboard: boolean("show_in_dashboard").default(true),
  dashboardOrder: integer("dashboard_order"),
  
  // Settings
  moduleSettings: text("module_settings"), // JSON: module-specific settings
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feature Flags (for gradual rollout)
export const userFeatureFlags = pgTable("user_feature_flags", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Feature
  featureName: varchar("feature_name", { length: 100 }).notNull(),
  
  // Enabled
  enabled: boolean("enabled").default(false),
  
  // Metadata
  enabledAt: timestamp("enabled_at"),
  enabledBy: varchar("enabled_by", { length: 100 }), // "user", "admin", "auto"
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Consent Records (GDPR compliance)
export const consentRecords = pgTable("consent_records", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Consent Type
  consentType: varchar("consent_type", { length: 50 }),
  
  // Consent
  consented: boolean("consented").notNull(),
  
  // Version
  policyVersion: varchar("policy_version", { length: 50 }),
  
  // IP & User Agent (for audit)
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  
  consentedAt: timestamp("consented_at").defaultNow(),
});

// Session Preferences (temporary, per-session)
export const sessionPreferences = pgTable("session_preferences", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  
  // Preferences
  preferences: text("preferences"), // JSON: temporary preferences
  
  // Expiry
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blocked Users
export const blockedUsers = pgTable("blocked_users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(), // Who blocked
  blockedUserId: varchar("blocked_user_id", { length: 255 }).notNull(), // Who was blocked
  
  // Reason
  reason: text("reason"),
  
  blockedAt: timestamp("blocked_at").defaultNow(),
});

// Account Deletion Requests
export const accountDeletionRequests = pgTable("account_deletion_requests", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Reason
  reason: text("reason"),
  feedback: text("feedback"),
  
  // Status
  status: varchar("status", { length: 50 }),
  
  // Scheduled Deletion
  scheduledFor: timestamp("scheduled_for"), // Grace period (e.g., 30 days)
  
  // Completion
  completedAt: timestamp("completed_at"),
  
  requestedAt: timestamp("requested_at").defaultNow(),
});

// Settings Change Log (audit trail)
export const settingsChangeLog = pgTable("settings_change_log", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Change Details
  settingCategory: varchar("setting_category", { length: 100 }).notNull(),
  settingName: varchar("setting_name", { length: 100 }).notNull(),
  
  // Values
  oldValue: text("old_value"),
  newValue: text("new_value"),
  
  // Context
  changedBy: varchar("changed_by", { length: 100 }), // "user", "admin", "system"
  ipAddress: varchar("ip_address", { length: 50 }),
  
  changedAt: timestamp("changed_at").defaultNow(),
});

// Accessibility Profiles
export const accessibilityProfiles = pgTable("accessibility_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  
  // Visual
  screenReaderEnabled: boolean("screen_reader_enabled").default(false),
  highContrast: boolean("high_contrast").default(false),
  largeText: boolean("large_text").default(false),
  colorBlindMode: varchar("color_blind_mode", { length: 50 }),
  
  // Motor
  reduceMotion: boolean("reduce_motion").default(false),
  keyboardNavigation: boolean("keyboard_navigation").default(false),
  stickyKeys: boolean("sticky_keys").default(false),
  
  // Cognitive
  simplifiedInterface: boolean("simplified_interface").default(false),
  reducedDistractions: boolean("reduced_distractions").default(false),
  
  // Audio
  closedCaptions: boolean("closed_captions").default(false),
  audioDescriptions: boolean("audio_descriptions").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Beta Features
export const betaFeatures = pgTable("beta_features", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Feature Details
  featureName: varchar("feature_name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Status
  status: varchar("status", { length: 50 }),
  
  // Availability
  availableToAll: boolean("available_to_all").default(false),
  requiresOptIn: boolean("requires_opt_in").default(true),
  
  // Stats
  totalOptIns: integer("total_opt_ins").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Beta Opt-Ins
export const userBetaOptIns = pgTable("user_beta_opt_ins", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  betaFeatureId: varchar("beta_feature_id", { length: 255 }).notNull(),
  
  // Feedback
  feedback: text("feedback"),
  rating: integer("rating"), // 1-10
  
  optedInAt: timestamp("opted_in_at").defaultNow(),
  optedOutAt: timestamp("opted_out_at"),
});
