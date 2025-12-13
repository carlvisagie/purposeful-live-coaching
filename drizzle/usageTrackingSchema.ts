import { pgTable, serial, integer, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./schema";
import { subscriptions } from "./schema";

/**
 * Call Logs - Track all AI voice and human coach calls
 */
export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  callType: varchar("call_type", { length: 50 }).notNull(), // 'ai_voice' or 'human_coach'
  durationSeconds: integer("duration_seconds").notNull().default(0),
  costCents: integer("cost_cents").notNull().default(0), // Cost in cents for precise billing
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  status: varchar("status", { length: 50 }).default('completed'), // 'completed', 'failed', 'in_progress'
  metadata: jsonb("metadata"), // Additional call metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CallLog = typeof callLogs.$inferSelect;
export type InsertCallLog = typeof callLogs.$inferInsert;

/**
 * Usage Summary - Billing period summaries for invoicing
 */
export const usageSummary = pgTable("usage_summary", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  billingPeriodStart: timestamp("billing_period_start").notNull(),
  billingPeriodEnd: timestamp("billing_period_end").notNull(),
  aiVoiceMinutesUsed: integer("ai_voice_minutes_used").default(0),
  aiVoiceOverageCents: integer("ai_voice_overage_cents").default(0),
  humanCoachCallsUsed: integer("human_coach_calls_used").default(0),
  humanCoachOverageCents: integer("human_coach_overage_cents").default(0),
  totalOverageCents: integer("total_overage_cents").default(0),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UsageSummary = typeof usageSummary.$inferSelect;
export type InsertUsageSummary = typeof usageSummary.$inferInsert;

/**
 * Usage Alerts - Notify users about usage limits
 */
export const usageAlerts = pgTable("usage_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  alertType: varchar("alert_type", { length: 50 }).notNull(), // '80_percent', '100_percent', 'overage', 'upgrade_prompt'
  resourceType: varchar("resource_type", { length: 50 }).notNull(), // 'ai_voice', 'human_coach'
  thresholdValue: integer("threshold_value").notNull(),
  currentValue: integer("current_value").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  acknowledged: boolean("acknowledged").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UsageAlert = typeof usageAlerts.$inferSelect;
export type InsertUsageAlert = typeof usageAlerts.$inferInsert;
