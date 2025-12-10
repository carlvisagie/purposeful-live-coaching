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
 * Privacy: All biometric data is encrypted at rest
 * Accuracy target: >95% recognition rate
 */

/**
 * Voice Prints Table
 * Stores voice biometric data for client identification
 */
export const voicePrints = pgTable("voice_prints", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Voice biometric data (encrypted)
  voicePrint: text("voicePrint").notNull(), // Base64 encoded voice embedding
  voicePrintVersion: varchar("voicePrintVersion", { length: 20 }).default("1.0"), // For future upgrades
  
  // Enrollment metadata
  enrollmentSamples: integer("enrollmentSamples").default(3), // Number of samples used
  enrollmentQuality: varchar("enrollmentQuality", { length: 20 }), // "high", "medium", "low"
  
  // Verification tracking
  verificationCount: integer("verificationCount").default(0), // Times successfully verified
  lastVerifiedAt: timestamp("lastVerifiedAt"),
  verificationAccuracy: integer("verificationAccuracy").default(0), // Average confidence %
  
  // Status
  isActive: varchar("isActive", { length: 10 }).default("active"), // "active", "disabled", "expired"
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type VoicePrint = typeof voicePrints.$inferSelect;
export type InsertVoicePrint = typeof voicePrints.$inferInsert;

/**
 * Face Embeddings Table
 * Stores facial recognition data for client identification
 */
export const faceEmbeddings = pgTable("face_embeddings", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Face biometric data (encrypted)
  faceEmbedding: text("faceEmbedding").notNull(), // Base64 encoded face embedding (512-dim vector)
  faceEmbeddingVersion: varchar("faceEmbeddingVersion", { length: 20 }).default("1.0"),
  
  // Enrollment metadata
  enrollmentPhotos: integer("enrollmentPhotos").default(3), // Number of photos used
  enrollmentQuality: varchar("enrollmentQuality", { length: 20 }), // "high", "medium", "low"
  lightingConditions: varchar("lightingConditions", { length: 50 }), // "good", "low-light", "varied"
  
  // Verification tracking
  verificationCount: integer("verificationCount").default(0),
  lastVerifiedAt: timestamp("lastVerifiedAt"),
  verificationAccuracy: integer("verificationAccuracy").default(0), // Average confidence %
  
  // Status
  isActive: varchar("isActive", { length: 10 }).default("active"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type FaceEmbedding = typeof faceEmbeddings.$inferSelect;
export type InsertFaceEmbedding = typeof faceEmbeddings.$inferInsert;

/**
 * Client Features Table
 * Stores behavioral patterns, preferences, and characteristics
 * for enhanced client recognition and personalization
 */
export const clientFeatures = pgTable("client_features", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Behavioral patterns (learned from sessions)
  speechPatterns: jsonb("speechPatterns"), // { pace, vocabulary, filler_words, etc }
  emotionalPatterns: jsonb("emotionalPatterns"), // { baseline_mood, triggers, coping_styles }
  communicationStyle: jsonb("communicationStyle"), // { directness, formality, humor_level }
  
  // Session preferences
  preferredTopics: jsonb("preferredTopics"), // Array of topics client engages with most
  avoidedTopics: jsonb("avoidedTopics"), // Topics client shows discomfort with
  sessionPreferences: jsonb("sessionPreferences"), // { time_of_day, duration, frequency }
  
  // Progress tracking
  strengths: jsonb("strengths"), // Identified strengths and resources
  challenges: jsonb("challenges"), // Current challenges and obstacles
  goals: jsonb("goals"), // Active goals and aspirations
  
  // Recognition metadata
  confidenceScore: integer("confidenceScore").default(0), // 0-100, how well we "know" this client
  lastUpdatedFromSession: timestamp("lastUpdatedFromSession"),
  totalSessionsAnalyzed: integer("totalSessionsAnalyzed").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ClientFeatures = typeof clientFeatures.$inferSelect;
export type InsertClientFeatures = typeof clientFeatures.$inferInsert;

/**
 * Recognition Events Table
 * Logs all recognition attempts for security and accuracy tracking
 */
export const recognitionEvents = pgTable("recognition_events", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id, { onDelete: "set null" }), // Null if unrecognized
  sessionId: integer("sessionId"), // Link to session if applicable
  
  // Recognition attempt details
  recognitionType: varchar("recognitionType", { length: 20 }).notNull(), // "voice", "face", "both"
  recognitionResult: varchar("recognitionResult", { length: 20 }).notNull(), // "success", "failure", "uncertain"
  confidenceScore: integer("confidenceScore"), // 0-100
  
  // Context
  attemptedUserId: integer("attemptedUserId"), // Who the system thought it was
  actualUserId: integer("actualUserId"), // Who it actually was (for accuracy tracking)
  
  // Metadata
  metadata: jsonb("metadata"), // Additional context (lighting, audio quality, etc)
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RecognitionEvent = typeof recognitionEvents.$inferSelect;
export type InsertRecognitionEvent = typeof recognitionEvents.$inferInsert;
