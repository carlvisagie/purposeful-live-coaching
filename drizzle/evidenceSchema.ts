/**
 * Keepers of the Truth - Evidence Validation Schema
 * 
 * This schema stores evidence ratings and source citations for all recommendations
 * made by the platform. Every recommendation must be backed by scientific research.
 */

import { pgTable, text, integer, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core";

/**
 * Evidence Records - Main table for evidence validation
 * Each record represents the evidence backing for a specific recommendation
 */
export const evidenceRecords = pgTable("evidence_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  recommendationId: text("recommendation_id").notNull().unique(), // Unique ID for the recommendation
  recommendationText: text("recommendation_text").notNull(), // The actual recommendation
  category: text("category").notNull(), // e.g., "nutrition", "sleep", "exercise"
  
  // Evidence Strength Rating (ESR) - 1 to 5 stars
  evidenceStrength: integer("evidence_strength").notNull(), // 1-5 (⭐ to ⭐⭐⭐⭐⭐)
  confidenceScore: integer("confidence_score").notNull(), // 0-100 (how confident we are in this rating)
  
  // Metadata
  sourceCount: integer("source_count").notNull().default(0), // Number of sources backing this
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  controversyFlag: boolean("controversy_flag").default(false), // True if conflicting evidence exists
  qualityAssessment: text("quality_assessment"), // Brief quality summary
});

/**
 * Evidence Sources - Individual research studies/sources
 * Each evidence record can have multiple sources
 */
export const evidenceSources = pgTable("evidence_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  evidenceId: uuid("evidence_id").notNull().references(() => evidenceRecords.id, { onDelete: "cascade" }),
  
  // Source Information
  title: text("title").notNull(),
  authors: jsonb("authors").notNull(), // Array of author names
  journal: text("journal"),
  year: integer("year").notNull(),
  doi: text("doi"), // Digital Object Identifier
  pubmedId: text("pubmed_id"), // PubMed ID if available
  url: text("url").notNull(),
  
  // Study Quality
  studyType: text("study_type").notNull(), // "meta-analysis", "rct", "cohort", etc.
  sampleSize: integer("sample_size"),
  quality: integer("quality").notNull(), // 1-5 rating of study quality
  
  // Timestamps
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

/**
 * Evidence Updates Log - Track when evidence is updated
 * Important for transparency and keeping evidence current
 */
export const evidenceUpdates = pgTable("evidence_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  evidenceId: uuid("evidence_id").notNull().references(() => evidenceRecords.id, { onDelete: "cascade" }),
  
  // Update Information
  updateType: text("update_type").notNull(), // "new_source", "rating_change", "controversy_detected"
  previousRating: integer("previous_rating"),
  newRating: integer("new_rating"),
  reason: text("reason"), // Why was this updated?
  
  // Metadata
  updatedBy: text("updated_by"), // "system" or user ID
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
