/**
 * TRUTH KEEPERS - RESEARCH VALIDATION SYSTEM
 * Ensures all platform recommendations are backed by peer-reviewed, empirical science
 * 
 * CORE PRINCIPLES:
 * - Only evidence-based, empirical science allowed
 * - Every claim must have peer-reviewed citations
 * - Research quality rated using standardized criteria
 * - Pseudoscience and unproven claims blocked
 * - Continuous monitoring for new research
 * 
 * EVIDENCE LEVELS (Based on Oxford Centre for Evidence-Based Medicine):
 * - Level A (High): Systematic reviews, meta-analyses, multiple RCTs
 * - Level B (Moderate): Individual RCTs, cohort studies, strong observational data
 * - Level C (Low): Case-control studies, expert consensus, limited evidence
 * - Level D (Insufficient): Anecdotal, single studies, not peer-reviewed → REJECTED
 * 
 * RESEARCH QUALITY CRITERIA:
 * 1. Peer-reviewed publication in reputable journal
 * 2. Adequate sample size (statistical power)
 * 3. Proper study design (RCT > cohort > case-control > case series)
 * 4. Replication (multiple independent studies)
 * 5. Effect size (clinically significant, not just p < 0.05)
 * 6. Recent research (prefer last 5-10 years)
 * 7. No conflicts of interest
 * 8. Independent verification
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// ============================================================================
// VALIDATED RESEARCH DATABASE
// ============================================================================

export const validatedResearch = pgTable("validated_research", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Research Details
  title: varchar("title", { length: 500 }).notNull(),
  authors: text("authors").notNull(), // JSON array
  journal: varchar("journal", { length: 255 }).notNull(),
  publicationYear: integer("publication_year").notNull(),
  doi: varchar("doi", { length: 255 }), // Digital Object Identifier
  pubmedId: varchar("pubmed_id", { length: 50 }),
  url: varchar("url", { length: 500 }),
  
  // Study Type
  studyType: varchar("study_type", { length: 50 }),
  
  // Evidence Level (Oxford CEBM)
  evidenceLevel: varchar("evidence_level", { length: 50 }),
  
  // Quality Metrics
  sampleSize: integer("sample_size"),
  hasControlGroup: boolean("has_control_group"),
  isRandomized: boolean("is_randomized"),
  isBlinded: boolean("is_blinded"), // Single, double, or triple blind
  hasReplication: boolean("has_replication"), // Multiple independent studies
  effectSize: decimal("effect_size", { precision: 6, scale: 3 }), // Cohen's d, odds ratio, etc.
  pValue: decimal("p_value", { precision: 10, scale: 9 }),
  confidenceInterval: varchar("confidence_interval", { length: 100 }), // "95% CI: 1.2-2.5"
  
  // Journal Quality
  journalImpactFactor: decimal("journal_impact_factor", { precision: 6, scale: 3 }),
  isPeerReviewed: boolean("is_peer_reviewed").notNull(),
  isOpenAccess: boolean("is_open_access"),
  
  // Conflicts of Interest
  hasConflictOfInterest: boolean("has_conflict_of_interest"),
  fundingSource: text("funding_source"), // Who funded the research?
  industrySponsored: boolean("industry_sponsored"),
  
  // Research Domain
  domain: varchar("domain", { length: 50 }),
  
  // Key Findings
  keyFindings: text("key_findings").notNull(), // Summary of main results
  clinicalSignificance: text("clinical_significance"), // Is it meaningful in real life?
  limitations: text("limitations"), // What are the study's limitations?
  
  // Practical Application
  practicalApplication: text("practical_application"), // How to apply this research
  targetPopulation: text("target_population"), // Who does this apply to?
  contraindications: text("contraindications"), // When NOT to apply this
  
  // Validation Status
  validationStatus: varchar("validation_status", { length: 50 }),
  
  // Reviewer Info
  reviewedBy: varchar("reviewed_by", { length: 255 }), // Who validated this?
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  
  // Usage Tracking
  citationCount: integer("citation_count").default(0), // How many times cited on platform
  recommendationCount: integer("recommendation_count").default(0), // How many recommendations use this
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// PLATFORM RECOMMENDATIONS (Linked to Research)
// ============================================================================

export const platformRecommendations = pgTable("platform_recommendations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Recommendation Details
  recommendationType: varchar("recommendation_type", { length: 50 }),
  
  // Content
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  howToImplement: text("how_to_implement"), // Step-by-step instructions
  
  // Evidence Backing
  evidenceLevel: varchar("evidence_level", { length: 50 }),
  
  // Research Citations (Links to validatedResearch table)
  primaryResearchId: varchar("primary_research_id", { length: 255 }).notNull(), // Main supporting study
  supportingResearchIds: text("supporting_research_ids"), // JSON array: additional studies
  
  // Confidence
  confidenceScore: integer("confidence_score"), // 0-100: How confident are we in this recommendation?
  
  // Domain
  domain: varchar("domain", { length: 100 }).notNull(),
  
  // Target Audience
  targetAudience: text("target_audience"), // Who is this for?
  contraindications: text("contraindications"), // Who should NOT do this?
  
  // Effectiveness Tracking (Self-Learning)
  totalUses: integer("total_uses").default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }), // % of users who found it helpful
  avgEffectivenessRating: decimal("avg_effectiveness_rating", { precision: 4, scale: 2 }), // 1-10
  
  // Status
  status: varchar("status", { length: 50 }),
  
  // Superseded Info
  supersededBy: varchar("superseded_by", { length: 255 }), // ID of newer recommendation
  supersededReason: text("superseded_reason"), // Why was this replaced?
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }),
});

// ============================================================================
// RESEARCH MONITORING (Watch for New Studies)
// ============================================================================

export const researchMonitoring = pgTable("research_monitoring", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // What to Monitor
  topic: varchar("topic", { length: 255 }).notNull(),
  keywords: text("keywords"), // JSON array: search terms
  domain: varchar("domain", { length: 100 }),
  
  // Monitoring Config
  monitoringFrequency: varchar("monitoring_frequency", { length: 50 }),
  
  // Alert Thresholds
  alertOnHighQuality: boolean("alert_on_high_quality").default(true), // Alert when Level A research found
  alertOnContradiction: boolean("alert_on_contradiction").default(true), // Alert when research contradicts current recommendations
  
  // Last Check
  lastCheckedAt: timestamp("last_checked_at"),
  newStudiesFound: integer("new_studies_found").default(0),
  
  // Status
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// PSEUDOSCIENCE BLOCKLIST
// ============================================================================

export const pseudoscienceBlocklist = pgTable("pseudoscience_blocklist", {
  id: varchar("id", { length: 255 }).primaryKey(),
  
  // Blocked Claim
  claim: text("claim").notNull(),
  category: varchar("category", { length: 50 }),
  
  // Why Blocked
  reason: text("reason").notNull(),
  evidenceAgainst: text("evidence_against"), // Research that debunks this
  
  // Severity
  severity: varchar("severity", { length: 50 }),
  
  // Action
  action: varchar("action", { length: 50 }),
  
  // Detection
  detectionCount: integer("detection_count").default(0), // How many times detected
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }),
});

// ============================================================================
// RESEARCH QUALITY REVIEWS
// ============================================================================

export const researchQualityReviews = pgTable("research_quality_reviews", {
  id: varchar("id", { length: 255 }).primaryKey(),
  researchId: varchar("research_id", { length: 255 }).notNull(),
  
  // Reviewer
  reviewerId: varchar("reviewer_id", { length: 255 }).notNull(),
  reviewerName: varchar("reviewer_name", { length: 255 }),
  reviewerCredentials: text("reviewer_credentials"), // PhD, MD, etc.
  
  // Quality Assessment
  methodologyScore: integer("methodology_score"), // 1-10
  sampleSizeAdequate: boolean("sample_size_adequate"),
  statisticalRigor: integer("statistical_rigor"), // 1-10
  clinicalRelevance: integer("clinical_relevance"), // 1-10
  replicationStatus: varchar("replication_status", { length: 50 }),
  
  // Bias Assessment
  selectionBias: boolean("selection_bias"),
  publicationBias: boolean("publication_bias"),
  confirmationBias: boolean("confirmation_bias"),
  
  // Overall Assessment
  overallQuality: varchar("overall_quality", { length: 50 }),
  
  // Recommendation
  recommendForPlatform: boolean("recommend_for_platform").notNull(),
  recommendedEvidenceLevel: varchar("recommended_evidence_level", { length: 50 }),
  
  // Notes
  reviewNotes: text("review_notes"),
  concerns: text("concerns"),
  
  reviewedAt: timestamp("reviewed_at").defaultNow(),
});
