/**
 * Structured Programs Schema
 * 
 * Multi-week programs with:
 * - Daily activities
 * - Progress tracking
 * - Completion certificates
 * 
 * Research: Users who complete structured programs have 3x higher retention
 */

import { mysqlTable, int, varchar, text, boolean, timestamp, json, mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { users } from "./schema";

// Program difficulty levels
export const programDifficulty = mysqlEnum('program_difficulty', ['beginner', 'intermediate', 'advanced']);

// Program categories
export const programCategory = mysqlEnum('program_category', [
  'anxiety',
  'depression', 
  'stress',
  'sleep',
  'mindfulness',
  'confidence',
  'relationships',
  'productivity',
  'grief',
  'addiction'
]);

// Programs table - the main program definitions
export const programs = mysqlTable('programs', {
  id: int('id').primaryKey().autoincrement(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  subtitle: varchar('subtitle', { length: 300 }),
  description: text('description').notNull(),
  category: programCategory.notNull(),
  difficulty: programDifficulty.notNull().default('beginner'),
  durationDays: int('duration_days').notNull(), // e.g., 7, 21, 42
  totalSessions: int('total_sessions').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  iconEmoji: varchar('icon_emoji', { length: 10 }).default('🎯'),
  
  // Program metadata
  benefits: json('benefits').$type<string[]>(),
  prerequisites: json('prerequisites').$type<string[]>(),
  targetAudience: text('target_audience'),
  scienceBasis: text('science_basis'), // Evidence-based explanation
  
  // Engagement
  estimatedMinutesPerDay: int('estimated_minutes_per_day').default(10),
  completionRate: int('completion_rate'), // Percentage of users who complete
  averageRating: int('average_rating'), // 1-5 stars * 100 for precision
  totalEnrollments: int('total_enrollments').default(0),
  
  // Status
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  isPremium: boolean('is_premium').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
});

// Program days - individual days within a program
export const programDays = mysqlTable('program_days', {
  id: int('id').primaryKey().autoincrement(),
  programId: int('program_id').notNull().references(() => programs.id),
  dayNumber: int('day_number').notNull(), // 1, 2, 3...
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  theme: varchar('theme', { length: 100 }), // e.g., "Understanding Anxiety"
  
  // Content
  lessonContent: text('lesson_content'), // Main educational content
  exerciseInstructions: text('exercise_instructions'),
  reflectionPrompts: json('reflection_prompts').$type<string[]>(),
  affirmation: varchar('affirmation', { length: 500 }),
  
  // Media
  audioUrl: varchar('audio_url', { length: 500 }),
  videoUrl: varchar('video_url', { length: 500 }),
  imageUrl: varchar('image_url', { length: 500 }),
  
  // Timing
  estimatedMinutes: int('estimated_minutes').default(10),
  
  // Unlocking
  unlockAfterDays: int('unlock_after_days').default(0), // Days since enrollment
  requiresPreviousCompletion: boolean('requires_previous_completion').default(true),
  
  createdAt: timestamp('created_at').defaultNow()
});

// User program enrollments
export const programEnrollments = mysqlTable('program_enrollments', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id),
  programId: int('program_id').notNull().references(() => programs.id),
  
  // Progress
  currentDay: int('current_day').default(1),
  completedDays: int('completed_days').default(0),
  totalDays: int('total_days').notNull(),
  progressPercent: int('progress_percent').default(0),
  
  // Status
  status: mysqlEnum('status', ['active', 'paused', 'completed', 'abandoned']).default('active'),
  
  // Dates
  enrolledAt: timestamp('enrolled_at').defaultNow(),
  startedAt: timestamp('started_at'),
  lastActivityAt: timestamp('last_activity_at'),
  completedAt: timestamp('completed_at'),
  pausedAt: timestamp('paused_at'),
  
  // Streak within program
  currentStreak: int('current_streak').default(0),
  longestStreak: int('longest_streak').default(0),
  
  // User feedback
  rating: int('rating'), // 1-5
  feedback: text('feedback'),
  
  // Reminders
  reminderEnabled: boolean('reminder_enabled').default(true),
  reminderTime: varchar('reminder_time', { length: 10 }).default('09:00')
});

// Day completions - tracks each day's completion
export const programDayCompletions = mysqlTable('program_day_completions', {
  id: int('id').primaryKey().autoincrement(),
  enrollmentId: int('enrollment_id').notNull().references(() => programEnrollments.id),
  programDayId: int('program_day_id').notNull().references(() => programDays.id),
  userId: int('user_id').notNull().references(() => users.id),
  
  // Completion details
  completedAt: timestamp('completed_at').defaultNow(),
  timeSpentMinutes: int('time_spent_minutes'),
  
  // User responses
  reflectionResponses: json('reflection_responses').$type<Record<string, string>>(),
  moodBefore: int('mood_before'), // 1-10
  moodAfter: int('mood_after'), // 1-10
  notes: text('notes'),
  
  // Engagement
  exerciseCompleted: boolean('exercise_completed').default(false),
  audioListened: boolean('audio_listened').default(false),
  videoWatched: boolean('video_watched').default(false)
});

// Program certificates
export const programCertificates = mysqlTable('program_certificates', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id),
  programId: int('program_id').notNull().references(() => programs.id),
  enrollmentId: int('enrollment_id').notNull().references(() => programEnrollments.id),
  
  certificateNumber: varchar('certificate_number', { length: 50 }).notNull().unique(),
  issuedAt: timestamp('issued_at').defaultNow(),
  
  // Certificate data
  userName: varchar('user_name', { length: 200 }),
  programTitle: varchar('program_title', { length: 200 }),
  completionDate: timestamp('completion_date'),
  daysCompleted: int('days_completed'),
  
  // Sharing
  publicUrl: varchar('public_url', { length: 500 }),
  linkedInShareUrl: varchar('linkedin_share_url', { length: 500 })
});

// Relations
export const programsRelations = relations(programs, ({ many }) => ({
  days: many(programDays),
  enrollments: many(programEnrollments),
  certificates: many(programCertificates)
}));

export const programDaysRelations = relations(programDays, ({ one, many }) => ({
  program: one(programs, {
    fields: [programDays.programId],
    references: [programs.id]
  }),
  completions: many(programDayCompletions)
}));

export const programEnrollmentsRelations = relations(programEnrollments, ({ one, many }) => ({
  user: one(users, {
    fields: [programEnrollments.userId],
    references: [users.id]
  }),
  program: one(programs, {
    fields: [programEnrollments.programId],
    references: [programs.id]
  }),
  dayCompletions: many(programDayCompletions),
  certificate: one(programCertificates)
}));

export const programDayCompletionsRelations = relations(programDayCompletions, ({ one }) => ({
  enrollment: one(programEnrollments, {
    fields: [programDayCompletions.enrollmentId],
    references: [programEnrollments.id]
  }),
  programDay: one(programDays, {
    fields: [programDayCompletions.programDayId],
    references: [programDays.id]
  }),
  user: one(users, {
    fields: [programDayCompletions.userId],
    references: [users.id]
  })
}));

export const programCertificatesRelations = relations(programCertificates, ({ one }) => ({
  user: one(users, {
    fields: [programCertificates.userId],
    references: [users.id]
  }),
  program: one(programs, {
    fields: [programCertificates.programId],
    references: [programs.id]
  }),
  enrollment: one(programEnrollments, {
    fields: [programCertificates.enrollmentId],
    references: [programEnrollments.id]
  })
}));
