import { pgTable, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

/**
 * Daily Check-Ins
 * User-initiated morning and evening routines
 */
export const dailyCheckIns = pgTable("daily_check_ins", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Type
  type: varchar("type", { length: 20 }).notNull(), // "morning" | "evening"
  
  // Universal Fields
  gratitude: text("gratitude"),
  
  // Morning Fields
  intention: text("intention"),
  
  // Evening Fields
  reflection: text("reflection"),
  wins: text("wins"),
  lessons: text("lessons"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Habits
 * Daily habit tracking with streaks
 */
export const habits = pgTable("habits", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Habit Details
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }), // "health", "productivity", "mindfulness", etc.
  icon: varchar("icon", { length: 50 }), // Lucide icon name
  color: varchar("color", { length: 50 }), // Tailwind color class
  
  // Frequency
  frequency: varchar("frequency", { length: 20 }).notNull().default("daily"), // "daily", "weekly"
  targetDays: varchar("target_days", { length: 255 }), // JSON array of days for weekly habits
  
  // Tracking
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalCompletions: integer("total_completions").default(0),
  
  // Status
  isActive: boolean("is_active").default(true),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Habit Completions
 * Track daily habit completions
 */
export const habitCompletions = pgTable("habit_completions", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => createId()),
  habitId: varchar("habit_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Completion Data
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD for easy querying
  
  // Optional Notes
  notes: text("notes"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
