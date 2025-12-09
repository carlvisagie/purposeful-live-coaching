/**
 * CONTENT MODERATION & AI SAFETY SYSTEM
 * 
 * Enterprise-grade content moderation with self-learning capabilities
 * Protects against legal, ethical, financial, and reputational risks
 * 
 * COMPLIANCE FRAMEWORKS:
 * - HIPAA (Health Insurance Portability and Accountability Act)
 * - GDPR (General Data Protection Regulation)
 * - Professional Liability Protection
 * - Insurance Requirements
 * - Brand Safety
 * 
 * CORE PRINCIPLES:
 * 1. Self-Learning: Automatically updates from flagged content
 * 2. Multi-Layered: Pre-filter, real-time, post-analysis
 * 3. Context-Aware: Understands coaching vs therapy boundaries
 * 4. Evolving: Learns new patterns and threats
 * 5. Auditable: Complete trail for legal protection
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// ============================================================================
// FORBIDDEN CONTENT DICTIONARY (Self-Learning)
// ============================================================================

export const forbiddenContentDictionary = pgTable("forbidden_content_dictionary", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Content Details
  contentType: varchar("content_type", { length: 50 }),
  
  content: text("content").notNull(), // The actual forbidden content
  pattern: text("pattern"), // Regex pattern for matching
  
  // Risk Category
  riskCategory: varchar("risk_category", { length: 50 }),
  
  // Severity
  severityLevel: varchar("severity_level", { length: 50 }),
  
  // Action
  action: varchar("action", { length: 50 }),
  
  // Source
  source: varchar("source", { length: 50 }),
  
  // Learning Data
  detectionCount: integer("detection_count").default(0), // How many times detected
  falsePositiveCount: integer("false_positive_count").default(0), // How many false positives
  truePositiveCount: integer("true_positive_count").default(0), // How many true positives
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }), // % accuracy
  
  // Status
  active: boolean("active").default(true),
  
  // Metadata
  description: text("description"), // Why this is forbidden
  legalBasis: text("legal_basis"), // Legal reason (HIPAA, etc.)
  redirectMessage: text("redirect_message"), // What to tell user
  
  // Version Control
  version: integer("version").default(1),
  replacedBy: varchar("replaced_by", { length: 255 }), // If updated
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }),
});

// ============================================================================
// CONTENT MODERATION LOGS
// ============================================================================

export const contentModerationLogs = pgTable("content_moderation_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // User & Session
  userId: varchar("user_id", { length: 255 }),
  sessionId: varchar("session_id", { length: 255 }),
  
  // Content
  originalContent: text("original_content").notNull(),
  contentHash: varchar("content_hash", { length: 255 }), // For deduplication
  
  // Detection
  detectedViolations: text("detected_violations"), // JSON: array of violations
  matchedRules: text("matched_rules"), // JSON: which rules triggered
  
  // Risk Assessment
  riskScore: integer("risk_score"), // 0-100
  riskCategory: varchar("risk_category", { length: 100 }),
  severityLevel: varchar("severity_level", { length: 50 }),
  
  // Action Taken
  actionTaken: varchar("action_taken", { length: 50 }),
  
  // Response
  userResponse: text("user_response"), // What we told the user
  
  // Context
  conversationContext: text("conversation_context"), // Previous messages
  userIntent: text("user_intent"), // AI-detected intent
  
  // Review
  requiresHumanReview: boolean("requires_human_review").default(false),
  reviewedBy: varchar("reviewed_by", { length: 255 }),
  reviewedAt: timestamp("reviewed_at"),
  reviewDecision: varchar("review_decision", { length: 50 }),
  reviewNotes: text("review_notes"),
  
  // Learning
  feedbackProvided: boolean("feedback_provided").default(false),
  improvedAccuracy: boolean("improved_accuracy").default(false),
  
  detectedAt: timestamp("detected_at").defaultNow(),
});

// ============================================================================
// AI SAFETY RULES (Dynamic System Prompts)
// ============================================================================

export const aiSafetyRules = pgTable("ai_safety_rules", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Rule Details
  ruleName: varchar("rule_name", { length: 255 }).notNull(),
  ruleType: varchar("rule_type", { length: 50 }),
  
  // Rule Content
  systemPromptAddition: text("system_prompt_addition"), // Added to AI system prompt
  validationLogic: text("validation_logic"), // How to validate
  
  // Scope
  appliesTo: varchar("applies_to", { length: 50 }),
  
  // Priority
  priority: integer("priority").default(100), // Higher = more important
  
  // Status
  active: boolean("active").default(true),
  
  // Effectiveness
  violationsPrevented: integer("violations_prevented").default(0),
  effectiveness: decimal("effectiveness", { precision: 5, scale: 2 }), // %
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// BRAND SAFETY KEYWORDS
// ============================================================================

export const brandSafetyKeywords = pgTable("brand_safety_keywords", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Keyword
  keyword: varchar("keyword", { length: 500 }).notNull(),
  keywordType: varchar("keyword_type", { length: 50 }),
  
  // Risk
  riskLevel: varchar("risk_level", { length: 50 }),
  
  // Action
  alertTeam: boolean("alert_team").default(false),
  escalateToHuman: boolean("escalate_to_human").default(false),
  
  // Context
  context: text("context"), // When this is/isn't a problem
  
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// COMPLIANCE CHECKPOINTS
// ============================================================================

export const complianceCheckpoints = pgTable("compliance_checkpoints", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Checkpoint Details
  checkpointName: varchar("checkpoint_name", { length: 255 }).notNull(),
  complianceFramework: varchar("compliance_framework", { length: 50 }),
  
  // Requirement
  requirement: text("requirement").notNull(),
  validationCriteria: text("validation_criteria"), // How to check compliance
  
  // Enforcement
  mandatory: boolean("mandatory").default(true),
  
  // Violation Handling
  violationSeverity: varchar("violation_severity", { length: 50 }),
  violationAction: text("violation_action"), // What to do if violated
  
  // Documentation
  legalReference: text("legal_reference"), // Citation of law/regulation
  documentationRequired: text("documentation_required"), // What docs needed
  
  // Audit
  lastAuditDate: timestamp("last_audit_date"),
  nextAuditDate: timestamp("next_audit_date"),
  auditFrequency: varchar("audit_frequency", { length: 50 }),
  
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// PATTERN LEARNING ENGINE
// ============================================================================

export const patternLearning = pgTable("pattern_learning", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Pattern Details
  patternType: varchar("pattern_type", { length: 50 }),
  
  // Pattern Data
  patternSignature: text("pattern_signature"), // What the pattern looks like
  detectionAlgorithm: text("detection_algorithm"), // How to detect
  
  // Learning Metrics
  occurrences: integer("occurrences").default(0),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  
  // Evolution
  learnedFrom: text("learned_from"), // JSON: source incidents
  improvedBy: text("improved_by"), // JSON: refinements
  
  // Status
  validated: boolean("validated").default(false),
  active: boolean("active").default(false), // Only active after validation
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// CRISIS INTERVENTION LOGS
// ============================================================================

export const crisisInterventionLogs = pgTable("crisis_intervention_logs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // User
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Crisis Details
  crisisType: varchar("crisis_type", { length: 50 }),
  
  // Detection
  detectedContent: text("detected_content"),
  crisisIndicators: text("crisis_indicators"), // JSON: what triggered
  riskLevel: varchar("risk_level", { length: 50 }),
  
  // Response
  responseProvided: text("response_provided"),
  resourcesOffered: text("resources_offered"), // JSON: hotlines, etc.
  
  // Escalation
  escalated: boolean("escalated").default(false),
  escalatedTo: varchar("escalated_to", { length: 255 }), // Who was notified
  escalatedAt: timestamp("escalated_at"),
  
  // Follow-up
  followUpRequired: boolean("follow_up_required").default(true),
  followUpCompleted: boolean("follow_up_completed").default(false),
  followUpNotes: text("follow_up_notes"),
  
  // Outcome
  outcome: varchar("outcome", { length: 50 }),
  
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// ============================================================================
// PROFESSIONAL BOUNDARY VIOLATIONS
// ============================================================================

export const professionalBoundaryViolations = pgTable("professional_boundary_violations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Violation Details
  violationType: varchar("violation_type", { length: 50 }),
  
  // Context
  conversationId: varchar("conversation_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  coachId: varchar("coach_id", { length: 255 }),
  
  // Content
  violatingContent: text("violating_content"),
  context: text("context"),
  
  // Detection
  detectedBy: varchar("detected_by", { length: 50 }),
  
  // Severity
  severity: varchar("severity", { length: 50 }),
  
  // Response
  correctionProvided: text("correction_provided"),
  educationProvided: text("education_provided"),
  
  // Accountability
  coachNotified: boolean("coach_notified").default(false),
  trainingRequired: boolean("training_required").default(false),
  
  detectedAt: timestamp("detected_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// ============================================================================
// SAFETY ANALYTICS
// ============================================================================

export const safetyAnalytics = pgTable("safety_analytics", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Time Period
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Metrics
  totalInteractions: integer("total_interactions"),
  violationsDetected: integer("violations_detected"),
  violationRate: decimal("violation_rate", { precision: 5, scale: 2 }), // %
  
  // By Category
  legalViolations: integer("legal_violations"),
  ethicalViolations: integer("ethical_violations"),
  brandSafetyIssues: integer("brand_safety_issues"),
  crisisInterventions: integer("crisis_interventions"),
  
  // Actions
  contentBlocked: integer("content_blocked"),
  contentFlagged: integer("content_flagged"),
  usersEscalated: integer("users_escalated"),
  
  // Accuracy
  falsePositiveRate: decimal("false_positive_rate", { precision: 5, scale: 2 }),
  falseNegativeRate: decimal("false_negative_rate", { precision: 5, scale: 2 }),
  
  // Learning
  newPatternsDetected: integer("new_patterns_detected"),
  rulesUpdated: integer("rules_updated"),
  dictionaryExpanded: integer("dictionary_expanded"),
  
  generatedAt: timestamp("generated_at").defaultNow(),
});
