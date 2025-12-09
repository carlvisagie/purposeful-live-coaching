/**
 * SECURITY & AUDIT SYSTEM
 * Comprehensive security, compliance, and audit trail management
 * 
 * CORE PRINCIPLES:
 * 1. Defense in Depth (multiple security layers)
 * 2. Least Privilege (minimal access by default)
 * 3. Zero Trust (verify everything)
 * 4. Audit Everything (complete trail)
 * 5. Privacy by Design (GDPR, HIPAA compliant)
 * 6. Incident Response (detect & respond)
 * 
 * SECURITY FEATURES:
 * - Multi-factor authentication (MFA)
 * - Session management
 * - IP whitelisting/blacklisting
 * - Rate limiting
 * - Suspicious activity detection
 * - Data encryption (at rest & in transit)
 * - Audit logging
 * 
 * COMPLIANCE:
 * - GDPR (General Data Protection Regulation)
 * - HIPAA (Health Insurance Portability and Accountability Act)
 * - SOC 2 (Service Organization Control)
 * - ISO 27001 (Information Security Management)
 */

import { boolean, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Security Profiles
export const securityProfiles = pgTable("security_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  
  // Multi-Factor Authentication
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaMethod: varchar("mfa_method", { length: 50 }),
  mfaSecret: varchar("mfa_secret", { length: 500 }), // Encrypted
  mfaBackupCodes: text("mfa_backup_codes"), // Encrypted JSON array
  
  // Password
  passwordHash: varchar("password_hash", { length: 500 }).notNull(),
  passwordSalt: varchar("password_salt", { length: 255 }),
  passwordLastChanged: timestamp("password_last_changed"),
  passwordExpiresAt: timestamp("password_expires_at"),
  
  // Password Policy
  requirePasswordChange: boolean("require_password_change").default(false),
  
  // Security Questions (backup recovery)
  securityQuestions: text("security_questions"), // Encrypted JSON
  
  // Account Security
  accountLocked: boolean("account_locked").default(false),
  accountLockedUntil: timestamp("account_locked_until"),
  accountLockedReason: text("account_locked_reason"),
  
  // Failed Login Attempts
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lastFailedLoginAt: timestamp("last_failed_login_at"),
  
  // Suspicious Activity
  suspiciousActivityDetected: boolean("suspicious_activity_detected").default(false),
  suspiciousActivityCount: integer("suspicious_activity_count").default(0),
  
  // IP Restrictions
  ipWhitelistEnabled: boolean("ip_whitelist_enabled").default(false),
  ipWhitelist: text("ip_whitelist"), // JSON array
  
  // Session Settings
  maxActiveSessions: integer("max_active_sessions").default(5),
  sessionTimeout: integer("session_timeout").default(3600), // seconds
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Active Sessions
export const activeSessions = pgTable("active_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Session Details
  sessionToken: varchar("session_token", { length: 500 }).notNull().unique(),
  
  // Device Info
  deviceId: varchar("device_id", { length: 255 }),
  deviceName: varchar("device_name", { length: 255 }),
  deviceType: varchar("device_type", { length: 50 }),
  
  // Location
  ipAddress: varchar("ip_address", { length: 50 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  
  // Browser
  userAgent: text("user_agent"),
  browser: varchar("browser", { length: 100 }),
  os: varchar("os", { length: 100 }),
  
  // Status
  active: boolean("active").default(true),
  
  // Activity
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  
  // Expiry
  expiresAt: timestamp("expires_at"),
  
  // Security
  mfaVerified: boolean("mfa_verified").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  terminatedAt: timestamp("terminated_at"),
});

// Login History
export const loginHistory = pgTable("login_history", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Login Details
  loginMethod: varchar("login_method", { length: 50 }),
  
  // Status
  success: boolean("success").notNull(),
  failureReason: varchar("failure_reason", { length: 255 }),
  
  // Device & Location
  ipAddress: varchar("ip_address", { length: 50 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  userAgent: text("user_agent"),
  
  // MFA
  mfaRequired: boolean("mfa_required").default(false),
  mfaCompleted: boolean("mfa_completed").default(false),
  
  // Risk Assessment
  riskScore: integer("risk_score"), // 0-100
  riskFactors: text("risk_factors"), // JSON: what made this risky
  
  loginAt: timestamp("login_at").defaultNow(),
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }), // Null for system events
  
  // Event Details
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventCategory: varchar("event_category", { length: 50 }),
  
  // Action
  action: varchar("action", { length: 255 }).notNull(),
  resource: varchar("resource", { length: 255 }), // What was accessed/modified
  resourceId: varchar("resource_id", { length: 255 }),
  
  // Details
  details: text("details"), // JSON: additional context
  
  // Result
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
  
  // Context
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id", { length: 255 }),
  
  // Severity
  severity: varchar("severity", { length: 50 }),
  
  eventTimestamp: timestamp("event_timestamp").defaultNow(),
});

// Security Incidents
export const securityIncidents = pgTable("security_incidents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }), // Null for system-wide incidents
  
  // Incident Details
  incidentType: varchar("incident_type", { length: 50 }),
  
  // Severity
  severity: varchar("severity", { length: 50 }),
  
  // Description
  description: text("description"),
  
  // Detection
  detectedBy: varchar("detected_by", { length: 100 }), // "system", "user", "admin"
  detectionMethod: varchar("detection_method", { length: 255 }),
  
  // Status
  status: varchar("status", { length: 50 }),
  
  // Response
  responseActions: text("response_actions"), // JSON: actions taken
  
  // Impact
  impactAssessment: text("impact_assessment"),
  affectedUsers: integer("affected_users"),
  dataCompromised: boolean("data_compromised").default(false),
  
  // Resolution
  resolvedBy: varchar("resolved_by", { length: 255 }),
  resolutionNotes: text("resolution_notes"),
  
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Keys
export const apiKeys = pgTable("api_keys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Key Details
  keyName: varchar("key_name", { length: 255 }).notNull(),
  keyHash: varchar("key_hash", { length: 500 }).notNull(), // Hashed API key
  keyPrefix: varchar("key_prefix", { length: 20 }), // First few chars for identification
  
  // Permissions
  permissions: text("permissions"), // JSON: what this key can do
  
  // Restrictions
  ipWhitelist: text("ip_whitelist"), // JSON: allowed IPs
  rateLimit: integer("rate_limit"), // requests per hour
  
  // Status
  active: boolean("active").default(true),
  
  // Usage
  lastUsedAt: timestamp("last_used_at"),
  totalRequests: integer("total_requests").default(0),
  
  // Expiry
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  revokedAt: timestamp("revoked_at"),
});

// API Request Logs
export const apiRequestLogs = pgTable("api_request_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  apiKeyId: varchar("api_key_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  
  // Request Details
  method: varchar("method", { length: 10 }).notNull(), // GET, POST, etc.
  endpoint: varchar("endpoint", { length: 500 }).notNull(),
  
  // Response
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time"), // milliseconds
  
  // Context
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  
  // Error
  errorMessage: text("error_message"),
  
  requestTimestamp: timestamp("request_timestamp").defaultNow(),
});

// Rate Limiting
export const rateLimits = pgTable("rate_limits", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Identifier (user ID, IP, API key)
  identifier: varchar("identifier", { length: 255 }).notNull(),
  identifierType: varchar("identifier_type", { length: 50 }),
  
  // Endpoint
  endpoint: varchar("endpoint", { length: 500 }),
  
  // Limits
  requestsPerMinute: integer("requests_per_minute"),
  requestsPerHour: integer("requests_per_hour"),
  requestsPerDay: integer("requests_per_day"),
  
  // Current Usage
  requestsThisMinute: integer("requests_this_minute").default(0),
  requestsThisHour: integer("requests_this_hour").default(0),
  requestsToday: integer("requests_today").default(0),
  
  // Reset Times
  minuteResetAt: timestamp("minute_reset_at"),
  hourResetAt: timestamp("hour_reset_at"),
  dayResetAt: timestamp("day_reset_at"),
  
  // Throttling
  throttled: boolean("throttled").default(false),
  throttledUntil: timestamp("throttled_until"),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Data Access Logs (GDPR/HIPAA compliance)
export const dataAccessLogs = pgTable("data_access_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Who accessed
  accessedBy: varchar("accessed_by", { length: 255 }).notNull(),
  accessedByType: varchar("accessed_by_type", { length: 50 }),
  
  // What was accessed
  dataType: varchar("data_type", { length: 100 }).notNull(),
  dataId: varchar("data_id", { length: 255 }),
  dataOwnerId: varchar("data_owner_id", { length: 255 }), // Whose data was accessed
  
  // How
  accessMethod: varchar("access_method", { length: 100 }),
  
  // Why
  purpose: varchar("purpose", { length: 255 }),
  
  // Context
  ipAddress: varchar("ip_address", { length: 50 }),
  
  accessedAt: timestamp("accessed_at").defaultNow(),
});

// Encryption Keys (metadata only, not actual keys)
export const encryptionKeys = pgTable("encryption_keys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Key Details
  keyId: varchar("key_id", { length: 255 }).notNull().unique(),
  keyType: varchar("key_type", { length: 50 }),
  algorithm: varchar("algorithm", { length: 100 }).notNull(),
  
  // Status
  active: boolean("active").default(true),
  
  // Rotation
  rotationSchedule: varchar("rotation_schedule", { length: 50 }),
  lastRotatedAt: timestamp("last_rotated_at"),
  nextRotationAt: timestamp("next_rotation_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  retiredAt: timestamp("retired_at"),
});

// Compliance Reports
export const complianceReports = pgTable("compliance_reports", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Report Details
  reportType: varchar("report_type", { length: 50 }),
  reportPeriodStart: timestamp("report_period_start").notNull(),
  reportPeriodEnd: timestamp("report_period_end").notNull(),
  
  // Status
  status: varchar("status", { length: 50 }),
  
  // Findings
  findings: text("findings"), // JSON: compliance findings
  
  // File
  filePath: varchar("file_path", { length: 500 }),
  
  generatedBy: varchar("generated_by", { length: 255 }),
  generatedAt: timestamp("generated_at").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Security Alerts
export const securityAlerts = pgTable("security_alerts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  
  // Alert Details
  alertType: varchar("alert_type", { length: 50 }),
  
  // Severity
  severity: varchar("severity", { length: 50 }),
  
  // Message
  message: text("message"),
  
  // Action Required
  actionRequired: boolean("action_required").default(false),
  actionUrl: varchar("action_url", { length: 500 }),
  
  // Status
  acknowledged: boolean("acknowledged").default(false),
  acknowledgedAt: timestamp("acknowledged_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Trusted Devices
export const trustedDevices = pgTable("trusted_devices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Device Details
  deviceId: varchar("device_id", { length: 255 }).notNull(),
  deviceName: varchar("device_name", { length: 255 }),
  deviceType: varchar("device_type", { length: 50 }),
  
  // Fingerprint
  deviceFingerprint: varchar("device_fingerprint", { length: 500 }),
  
  // Status
  trusted: boolean("trusted").default(true),
  
  // Last Seen
  lastSeenAt: timestamp("last_seen_at"),
  lastSeenIp: varchar("last_seen_ip", { length: 50 }),
  
  trustedAt: timestamp("trusted_at").defaultNow(),
  untrustedAt: timestamp("untrusted_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});
