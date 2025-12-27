/**
 * ACTION PLANS & HOMEWORK SCHEMA
 * 
 * Tables for coach-assigned action plans and homework tasks
 * Critical for client retention and accountability
 */

import { pgTable, serial, integer, text, timestamp, boolean, varchar } from "drizzle-orm/pg-core";

/**
 * Action Plans - Overall homework assignments
 */
export const actionPlans = pgTable("action_plans", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(), // User receiving the action plan
  coachId: integer("coach_id").notNull(), // Coach who assigned it
  sessionId: integer("session_id"), // Optional: linked to specific session
  
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, completed, cancelled
  dueDate: timestamp("due_date"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

/**
 * Action Plan Tasks - Individual tasks within an action plan
 */
export const actionPlanTasks = pgTable("action_plan_tasks", {
  id: serial("id").primaryKey(),
  actionPlanId: integer("action_plan_id").notNull(), // Foreign key to action_plans
  
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, in_progress, completed, skipped
  priority: varchar("priority", { length: 10 }).notNull().default("medium"), // low, medium, high
  
  estimatedMinutes: integer("estimated_minutes"), // How long task should take
  orderIndex: integer("order_index").notNull().default(0), // Order of tasks in plan
  
  completedAt: timestamp("completed_at"),
  completionNotes: text("completion_notes"), // Client can add notes when completing
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
