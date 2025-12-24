/**
 * Simple Booking System Schema
 * 
 * A clean, simple booking system that ACTUALLY WORKS.
 * No complex timezone logic, no confusing availability rules.
 */

import { pgTable, serial, integer, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core";

/**
 * Coach Availability Slots
 * Simple time blocks when coach is available
 */
export const coachAvailabilitySlots = pgTable("coach_availability_slots", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull(),
  
  // Day of week (0 = Sunday, 6 = Saturday)
  dayOfWeek: integer("day_of_week").notNull(),
  
  // Start and end time (24-hour format, e.g., "09:00", "17:30")
  startTime: varchar("start_time", { length: 5 }).notNull(),
  endTime: varchar("end_time", { length: 5 }).notNull(),
  
  // Is this slot active?
  isActive: boolean("is_active").default(true).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Simple Bookings
 * Clean booking records
 */
export const simpleBookings = pgTable("simple_bookings", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull(),
  
  // Client info
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  clientPhone: varchar("client_phone", { length: 50 }),
  
  // Booking details
  bookingDateTime: timestamp("booking_date_time").notNull(), // UTC timestamp
  duration: integer("duration").notNull().default(15), // minutes
  
  // Status
  status: varchar("status", { length: 50 }).default("confirmed").notNull(), // confirmed, cancelled, completed
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Session Duration Options
 * Coach can define what session lengths they offer
 */
export const sessionDurationOptions = pgTable("session_duration_options", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id").notNull(),
  
  // Duration in minutes
  duration: integer("duration").notNull(),
  
  // Label (e.g., "Quick Check-in", "Standard Session", "Deep Dive")
  label: varchar("label", { length: 100 }).notNull(),
  
  // Is this option active?
  isActive: boolean("is_active").default(true).notNull(),
  
  // Display order
  displayOrder: integer("display_order").default(0).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
