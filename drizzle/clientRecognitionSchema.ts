import { pgTable, serial, integer, text, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { users } from "./schema";

/**
 * CLIENT RECOGNITION SYSTEM SCHEMA
 * 
 * Enables AI to remember clients through:
 * - Voice recognition (voice biometrics)
 * - Face recognition (facial embeddings)
 * - Feature recognition (behavioral patterns, preferences)
 * 
 * IMPORTANT: Phone numbers are NOT stored here.
 * Phone numbers belong ONLY in the Unified Client Profile (clients table).
 * This ensures perfect continuity - all client data in ONE place.
 * 
 * Privacy: All biometric data is encrypted at rest
 * Accuracy target: >95% recognition rate
 */

/**
 * Voice Prints Table
 * Stores voice biometric data for client identification
 * Links to clients table (Unified Client Profile) via clientId
 */
export const voicePrints = pgTable("voice_prints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Voice biometric data (encrypted)
  voicePrint: text("voice_print").notNull(), // Base64 encoded voice embedding
  voicePrintVersion: varchar("voice_print_version", { length: 20 }).default("1.0"), // For future upgrades
  
  // Enrollment metadata
  enrollmentSamples: integer("enrollment_samples").default(3), // Number of samples used
  enrollmentQuality: varchar("enrollment_quality", { length: 20 }), // "high", "medium", "low"
  
  // Verification tracking
  verificationCount: integer("verification_count").default(0), // Times successfully verified
  lastVerifiedAt: timestamp("last_verified_at"),
  verificationAccuracy: integer("verification_accuracy").default(0), // Average confidence %
  
  // Status
  isActive: varchar("is_active", { length: 10 }).default("active"), // "active", "disabled", "expired"
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type VoicePrint = typeof voicePrints.$inferSelect;
export type InsertVoicePrint = typeof voicePrints.$inferInsert;

/**
 * Face Embeddings Table
 * Stores facial recognition data for client identification
 */
export const faceEmbeddings = pgTable("face_embeddings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Face biometric data (encrypted)
  faceEmbedding: text("face_embedding").notNull(), // Base64 encoded face embedding (512-dim vector)
  faceEmbeddingVersion: varchar("face_embedding_version", { length: 20 }).default("1.0"),
  
  // Enrollment metadata
  enrollmentPhotos: integer("enrollment_photos").default(3), // Number of photos used
  enrollmentQuality: varchar("enrollment_quality", { length: 20 }), // "high", "medium", "low"
  lightingConditions: varchar("lighting_conditions", { length: 50 }), // "good", "low-light", "varied"
  
  // Verification tracking
  verificationCount: integer("verification_count").default(0),
  lastVerifiedAt: timestamp("last_verified_at"),
  verificationAccuracy: integer("verification_accuracy").default(0), // Average confidence %
  
  // Status
  isActive: varchar("is_active", { length: 10 }).default("active"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type FaceEmbedding = typeof faceEmbeddings.$inferSelect;
export type InsertFaceEmbedding = typeof faceEmbeddings.$inferInsert;

/**
 * Client Features Table
 * Stores behavioral patterns, preferences, and characteristics
 * for enhanced client recognition and personalization
 * 
 * NOTE: This extends the Unified Client Profile with recognition-specific data.
 * Core client info (name, phone, goals, etc.) stays in the clients table.
 */
export const clientFeatures = pgTable("client_features", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Behavioral patterns (learned from sessions)
  speechPatterns: jsonb("speech_patterns"), // { pace, vocabulary, filler_words, etc }
  emotionalPatterns: jsonb("emotional_patterns"), // { baseline_mood, triggers, coping_styles }
  communicationStyle: jsonb("communication_style"), // { directness, formality, humor_level }
  
  // Session preferences
  preferredTopics: jsonb("preferred_topics"), // Array of topics client engages with most
  avoidedTopics: jsonb("avoided_topics"), // Topics client shows discomfort with
  sessionPreferences: jsonb("session_preferences"), // { time_of_day, duration, frequency }
  
  // Progress tracking
  strengths: jsonb("strengths"), // Identified strengths and resources
  challenges: jsonb("challenges"), // Current challenges and obstacles
  goals: jsonb("goals"), // Active goals and aspirations
  
  // Recognition metadata
  confidenceScore: integer("confidence_score").default(0), // 0-100, how well we "know" this client
  lastUpdatedFromSession: timestamp("last_updated_from_session"),
  totalSessionsAnalyzed: integer("total_sessions_analyzed").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ClientFeatures = typeof clientFeatures.$inferSelect;
export type InsertClientFeatures = typeof clientFeatures.$inferInsert;

/**
 * Recognition Events Table
 * Logs all recognition attempts for security and accuracy tracking
 */
export const recognitionEvents = pgTable("recognition_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }), // Null if unrecognized
  sessionId: integer("session_id"), // Link to session if applicable
  
  // Recognition attempt details
  recognitionType: varchar("recognition_type", { length: 20 }).notNull(), // "voice", "face", "both"
  recognitionResult: varchar("recognition_result", { length: 20 }).notNull(), // "success", "failure", "uncertain"
  confidenceScore: integer("confidence_score"), // 0-100
  
  // Context
  attemptedUserId: integer("attempted_user_id"), // Who the system thought it was
  actualUserId: integer("actual_user_id"), // Who it actually was (for accuracy tracking)
  
  // Metadata
  metadata: jsonb("metadata"), // Additional context (lighting, audio quality, etc)
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RecognitionEvent = typeof recognitionEvents.$inferSelect;
export type InsertRecognitionEvent = typeof recognitionEvents.$inferInsert;

/**
 * ============================================================================
 * PHONE CALLER REGISTRY - REMOVED
 * ============================================================================
 * 
 * Phone numbers do NOT get their own table or registry.
 * 
 * The Unified Client Profile is a COMPLETE REPOSITORY of everything:
 * - All sessions (coaching, therapy, etc.)
 * - Video footage from sessions
 * - Audio recordings from calls
 * - Chat transcripts
 * - Phone call history
 * - Goals, progress, challenges
 * - Every interaction they've ever had on the platform
 * 
 * The phone number is just ONE identifier that points to this repository.
 * 
 * Why? PERFECT CONTINUITY.
 * 
 * When someone calls:
 * 1. Look up phone number → Find their Unified Client Profile
 * 2. Access their COMPLETE repository (sessions, videos, audio, chats, everything)
 * 3. Sage knows EVERYTHING about them instantly
 * 
 * No separate lists. No data fragmentation. One complete repository.
 * ============================================================================
 */
