-- Simple Booking System Tables
-- Created: December 24, 2025

-- Coach Availability Slots
CREATE TABLE IF NOT EXISTS coach_availability_slots (
  id SERIAL PRIMARY KEY,
  coach_id INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_coach_availability_slots_coach_id ON coach_availability_slots(coach_id);
CREATE INDEX idx_coach_availability_slots_day ON coach_availability_slots(day_of_week);

-- Simple Bookings
CREATE TABLE IF NOT EXISTS simple_bookings (
  id SERIAL PRIMARY KEY,
  coach_id INTEGER NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  booking_date_time TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL DEFAULT 15,
  status VARCHAR(50) DEFAULT 'confirmed' NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_simple_bookings_coach_id ON simple_bookings(coach_id);
CREATE INDEX idx_simple_bookings_date ON simple_bookings(booking_date_time);
CREATE INDEX idx_simple_bookings_status ON simple_bookings(status);

-- Session Duration Options
CREATE TABLE IF NOT EXISTS session_duration_options (
  id SERIAL PRIMARY KEY,
  coach_id INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  label VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_session_duration_options_coach_id ON session_duration_options(coach_id);

-- Insert default availability for Carl (coach_id = 1)
-- 24/7 availability
INSERT INTO coach_availability_slots (coach_id, day_of_week, start_time, end_time, is_active)
VALUES
  (1, 0, '00:00', '23:59', true), -- Sunday
  (1, 1, '00:00', '23:59', true), -- Monday
  (1, 2, '00:00', '23:59', true), -- Tuesday
  (1, 3, '00:00', '23:59', true), -- Wednesday
  (1, 4, '00:00', '23:59', true), -- Thursday
  (1, 5, '00:00', '23:59', true), -- Friday
  (1, 6, '00:00', '23:59', true); -- Saturday

-- Insert default session durations for Carl
INSERT INTO session_duration_options (coach_id, duration, label, is_active, display_order)
VALUES
  (1, 15, 'Quick Check-in (15 min)', true, 1),
  (1, 30, 'Standard Session (30 min)', true, 2),
  (1, 60, 'Deep Dive (60 min)', true, 3);
