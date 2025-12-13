import { int, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { clients } from "./schema";
import { habits } from "./habitFormationSchema";

/**
 * Identity Profiles - Track user's evolving identity
 * Based on Master Prompt: Identity over motivation
 */
export const identityProfiles = pgTable("identityProfiles", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  
  // Current identity markers
  currentIdentity: text("current_identity"), // JSON: ["disciplined", "resilient", etc.]
  targetIdentity: text("target_identity"), // JSON: ["unstoppable", "mission-driven", etc.]
  identityGaps: text("identity_gaps"), // JSON: What's missing between current and target
  
  // Core values and mission
  coreValues: text("core_values"), // JSON array
  lifeMission: text("life_mission"),
  longTermVision: text("long_term_vision"),
  
  // Identity reinforcement tracking
  identityWins: text("identity_wins"), // JSON: Recent actions that reinforced identity
  identityContradictions: text("identity_contradictions"), // JSON: Actions that contradicted identity
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type IdentityProfile = typeof identityProfiles.$inferSelect;
export type InsertIdentityProfile = typeof identityProfiles.$inferInsert;

/**
 * Daily Check-ins - Minimal cognitive load tracking
 */
export const dailyCheckins = pgTable("dailyCheckins", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  checkinDate: timestamp("checkin_date").defaultNow().notNull(),
  
  // Physical health (minimal questions)
  sleptWell: varchar("slept_well", { length: 50 }),
  ateWell: varchar("ate_well", { length: 50 }),
  movedBody: varchar("moved_body", { length: 50 }),
  
  // Emotional state (single rating)
  emotionalState: integer("emotional_state").notNull(), // 1-10 scale
  
  // Discipline tracking
  followedPlan: varchar("followed_plan", { length: 50 }),
  controlledImpulses: varchar("controlled_impulses", { length: 50 }),
  
  // Identity reinforcement
  actedLikeTargetIdentity: varchar("acted_like_target_identity", { length: 50 }),
  
  // Optional notes (not required)
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type InsertDailyCheckin = typeof dailyCheckins.$inferInsert;

// Habit tracking moved to habitFormationSchema.ts for better structure

/**
 * Identity Habit Completions - Track daily execution
 */
export const identityHabitCompletions = pgTable("identity_habit_completions", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull(), // references habits table
  completionDate: timestamp("completion_date").defaultNow().notNull(),
  completed: varchar("completed", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type IdentityHabitCompletion = typeof identityHabitCompletions.$inferSelect;
export type InsertIdentityHabitCompletion = typeof identityHabitCompletions.$inferInsert;

/**
 * Discipline Events - Track impulse control and discipline moments
 */
export const disciplineEvents = pgTable("disciplineEvents", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  eventDate: timestamp("event_date").defaultNow().notNull(),
  
  // Event details
  eventType: varchar("event_type", { length: 50 }),
  situation: text("situation"), // What happened
  response: text("response"), // How they responded
  outcome: text("outcome"), // Result
  
  // Identity impact
  reinforcedIdentity: varchar("reinforced_identity", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DisciplineEvent = typeof disciplineEvents.$inferSelect;
export type InsertDisciplineEvent = typeof disciplineEvents.$inferInsert;

/**
 * Micro-Habits - Tiny, stackable behaviors
 */
export const microHabits = pgTable("microHabits", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  
  // Micro-habit definition (must be < 2 minutes)
  microHabitName: varchar("micro_habit_name", { length: 255 }).notNull(),
  trigger: varchar("trigger", { length: 255 }).notNull(), // "After I [existing habit]"
  action: varchar("action", { length: 255 }).notNull(), // "I will [micro-habit]"
  
  // Identity connection
  identityReinforcement: text("identity_reinforcement"), // "This makes me [identity]"
  
  // Status
  isActive: varchar("is_active", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MicroHabit = typeof microHabits.$inferSelect;
export type InsertMicroHabit = typeof microHabits.$inferInsert;
