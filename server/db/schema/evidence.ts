/**
 * KEEPERS OF THE TRUTH - Evidence Validation Schema
 * 
 * This schema defines the foundational evidence validation system that ensures
 * all recommendations on the platform are backed by transparent, rated scientific evidence.
 */

import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from "drizzle-orm/pg-core";

/**
 * Evidence Strength Rating (ESR) Levels
 * ⭐⭐⭐⭐⭐ Level 1: Strong Evidence (Multiple high-quality RCTs, meta-analyses)
 * ⭐⭐⭐⭐ Level 2: Moderate Evidence (Some RCTs, systematic reviews)
 * ⭐⭐⭐ Level 3: Preliminary Evidence (Observational studies, small RCTs)
 * ⭐⭐ Level 4: Emerging Evidence (Case studies, pilot studies)
 * ⭐ Level 5: Anecdotal Evidence (Expert opinion, anecdotal reports)
 * ⚠️ Flagged: Controversial (Conflicting evidence)
 * ❌ Rejected: No Evidence (Insufficient or retracted studies)
 */

export const evidenceSources = pgTable("evidence_sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Source identification
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  journal: text("journal"),
  publicationDate: timestamp("publication_date"),
  doi: text("doi"),
  pmid: text("pmid"), // PubMed ID
  url: text("url").notNull(),
  
  // Source metadata
  studyType: text("study_type").notNull(), // "RCT", "Meta-Analysis", "Systematic Review", "Observational", "Case Study", "Expert Opinion"
  sampleSize: integer("sample_size"),
  peerReviewed: boolean("peer_reviewed").default(false),
  
  // Quality assessment
  evidenceLevel: integer("evidence_level").notNull(), // 1-5 (1=strongest, 5=weakest)
  qualityScore: integer("quality_score"), // 0-100
  
  // Content
  abstract: text("abstract"),
  keyFindings: jsonb("key_findings").$type<string[]>(),
  limitations: jsonb("limitations").$type<string[]>(),
  
  // Validation status
  isRetracted: boolean("is_retracted").default(false),
  retractionReason: text("retraction_reason"),
  lastValidated: timestamp("last_validated").defaultNow(),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const evidenceRecommendations = pgTable("evidence_recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Recommendation details
  topic: text("topic").notNull(), // e.g., "Sleep Optimization", "Stress Management"
  recommendation: text("recommendation").notNull(), // The actual recommendation text
  context: text("context"), // When/how to apply this recommendation
  
  // Evidence strength
  overallEvidenceLevel: integer("overall_evidence_level").notNull(), // 1-5
  confidenceScore: integer("confidence_score").notNull(), // 0-100
  
  // Controversy flags
  isControversial: boolean("is_controversial").default(false),
  controversyReason: text("controversy_reason"),
  conflictingEvidence: jsonb("conflicting_evidence").$type<string[]>(),
  
  // Supporting evidence (array of source IDs)
  sourceIds: jsonb("source_ids").$type<string[]>().notNull(),
  
  // Usage tracking
  timesShown: integer("times_shown").default(0),
  positiveOutcomes: integer("positive_outcomes").default(0),
  negativeOutcomes: integer("negative_outcomes").default(0),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastReviewed: timestamp("last_reviewed").defaultNow(),
});

export const evidenceUpdates = pgTable("evidence_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // What changed
  recommendationId: uuid("recommendation_id").references(() => evidenceRecommendations.id),
  changeType: text("change_type").notNull(), // "upgrade", "downgrade", "controversy", "retraction"
  
  // Old vs new
  oldEvidenceLevel: integer("old_evidence_level"),
  newEvidenceLevel: integer("new_evidence_level"),
  reason: text("reason").notNull(),
  
  // New sources that triggered the update
  newSourceIds: jsonb("new_source_ids").$type<string[]>(),
  
  // User notification
  usersNotified: integer("users_notified").default(0),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EvidenceSource = typeof evidenceSources.$inferSelect;
export type NewEvidenceSource = typeof evidenceSources.$inferInsert;
export type EvidenceRecommendation = typeof evidenceRecommendations.$inferSelect;
export type NewEvidenceRecommendation = typeof evidenceRecommendations.$inferInsert;
export type EvidenceUpdate = typeof evidenceUpdates.$inferSelect;
export type NewEvidenceUpdate = typeof evidenceUpdates.$inferInsert;
