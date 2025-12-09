import { int, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { clients } from "./schema";

/**
 * Identity Profiles - Track user's evolving identity
 * Based on Master Prompt: Identity over motivation
 */
export const identityProfiles = pgTable("identityProfiles", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  
  // Current identity markers
  currentIdentity: text("currentIdentity"), // JSON: ["disciplined", "resilient", etc.]
  targetIdentity: text("targetIdentity"), // JSON: ["unstoppable", "mission-driven", etc.]
  identityGaps: text("identityGaps"), // JSON: What's missing between current and target
  
  // Core values and mission
  coreValues: text("coreValues"), // JSON array
  lifeMission: text("lifeMission"),
  longTermVision: text("longTermVision"),
  
  // Identity reinforcement tracking
  identityWins: text("identityWins"), // JSON: Recent actions that reinforced identity
  identityContradictions: text("identityContradictions"), // JSON: Actions that contradicted identity
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type IdentityProfile = typeof identityProfiles.$inferSelect;
export type InsertIdentityProfile = typeof identityProfiles.$inferInsert;

/**
 * Daily Check-ins - Minimal cognitive load tracking
 */
export const dailyCheckins = pgTable("dailyCheckins", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  checkinDate: timestamp("checkinDate").defaultNow().notNull(),
  
  // Physical health (minimal questions)
  sleptWell: pgEnum("sleptWell", ["yes", "no"]),
  ateWell: pgEnum("ateWell", ["yes", "no"]),
  movedBody: pgEnum("movedBody", ["yes", "no"]),
  
  // Emotional state (single rating)
  emotionalState: integer("emotionalState").notNull(), // 1-10 scale
  
  // Discipline tracking
  followedPlan: pgEnum("followedPlan", ["yes", "no"]),
  controlledImpulses: pgEnum("controlledImpulses", ["yes", "no"]),
  
  // Identity reinforcement
  actedLikeTargetIdentity: pgEnum("actedLikeTargetIdentity", ["yes", "no"]),
  
  // Optional notes (not required)
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type InsertDailyCheckin = typeof dailyCheckins.$inferInsert;

// Habit tracking moved to habitFormationSchema.ts for better structure

/**
 * Habit Completions - Track daily execution
 */
export const habitCompletions = pgTable("habitCompletions", {
  id: serial("id").primaryKey(),
  habitId: integer("habitId").notNull().references(() => habits.id),
  completionDate: timestamp("completionDate").defaultNow().notNull(),
  completed: pgEnum("completed", ["yes", "no"]),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type InsertHabitCompletion = typeof habitCompletions.$inferInsert;

/**
 * Discipline Events - Track impulse control and discipline moments
 */
export const disciplineEvents = pgTable("disciplineEvents", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  eventDate: timestamp("eventDate").defaultNow().notNull(),
  
  // Event details
  eventType: pgEnum("eventType", ["impulse_controlled", "impulse_failed", "discipline_win", "discipline_fail"]),
  situation: text("situation"), // What happened
  response: text("response"), // How they responded
  outcome: text("outcome"), // Result
  
  // Identity impact
  reinforcedIdentity: pgEnum("reinforcedIdentity", ["yes", "no"]),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DisciplineEvent = typeof disciplineEvents.$inferSelect;
export type InsertDisciplineEvent = typeof disciplineEvents.$inferInsert;

/**
 * Micro-Habits - Tiny, stackable behaviors
 */
export const microHabits = pgTable("microHabits", {
  id: serial("id").primaryKey(),
  clientId: integer("clientId").notNull().references(() => clients.id),
  
  // Micro-habit definition (must be < 2 minutes)
  microHabitName: varchar("microHabitName", { length: 255 }).notNull(),
  trigger: varchar("trigger", { length: 255 }).notNull(), // "After I [existing habit]"
  action: varchar("action", { length: 255 }).notNull(), // "I will [micro-habit]"
  
  // Identity connection
  identityReinforcement: text("identityReinforcement"), // "This makes me [identity]"
  
  // Status
  isActive: pgEnum("isActive", ["true", "false"]),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type MicroHabit = typeof microHabits.$inferSelect;
export type InsertMicroHabit = typeof microHabits.$inferInsert;
