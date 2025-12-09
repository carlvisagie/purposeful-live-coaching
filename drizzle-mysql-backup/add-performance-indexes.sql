-- Performance Optimization: Add indexes for frequently queried columns
-- Run this after initial schema is created
-- These indexes will significantly improve query performance for common operations

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(createdAt);

-- Coaches table indexes
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON coaches(userId);
CREATE INDEX IF NOT EXISTS idx_coaches_is_active ON coaches(isActive);

-- Clients table indexes
CREATE INDEX IF NOT EXISTS idx_clients_coach_id ON clients(coachId);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_start_date ON clients(startDate);

-- Sessions table indexes (CRITICAL for booking dashboard)
CREATE INDEX IF NOT EXISTS idx_sessions_coach_id ON sessions(coachId);
CREATE INDEX IF NOT EXISTS idx_sessions_client_id ON sessions(clientId);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_date ON sessions(scheduledDate);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_payment_status ON sessions(paymentStatus);
CREATE INDEX IF NOT EXISTS idx_sessions_stripe_payment_intent_id ON sessions(stripePaymentIntentId);
CREATE INDEX IF NOT EXISTS idx_sessions_stripe_session_id ON sessions(stripeSessionId);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(createdAt);

-- Composite index for common query: coach's upcoming sessions
CREATE INDEX IF NOT EXISTS idx_sessions_coach_scheduled ON sessions(coachId, scheduledDate, status);

-- Composite index for common query: client's session history
CREATE INDEX IF NOT EXISTS idx_sessions_client_scheduled ON sessions(clientId, scheduledDate);

-- Session types table indexes
CREATE INDEX IF NOT EXISTS idx_session_types_coach_id ON sessionTypes(coachId);
CREATE INDEX IF NOT EXISTS idx_session_types_is_active ON sessionTypes(isActive);
CREATE INDEX IF NOT EXISTS idx_session_types_display_order ON sessionTypes(displayOrder);

-- Journal entries indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_client_id ON journalEntries(clientId);
CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON journalEntries(entryDate);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood ON journalEntries(mood);

-- Emotion logs indexes
CREATE INDEX IF NOT EXISTS idx_emotion_logs_client_id ON emotionLogs(clientId);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_log_date ON emotionLogs(logDate);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_emotion_type ON emotionLogs(emotionType);

-- Coping strategies indexes
CREATE INDEX IF NOT EXISTS idx_coping_strategies_client_id ON copingStrategies(clientId);
CREATE INDEX IF NOT EXISTS idx_coping_strategies_category ON copingStrategies(category);
CREATE INDEX IF NOT EXISTS idx_coping_strategies_last_used ON copingStrategies(lastUsed);

-- AI insights indexes
CREATE INDEX IF NOT EXISTS idx_ai_insights_client_id ON aiInsights(clientId);
CREATE INDEX IF NOT EXISTS idx_ai_insights_insight_date ON aiInsights(insightDate);
CREATE INDEX IF NOT EXISTS idx_ai_insights_severity ON aiInsights(severity);
CREATE INDEX IF NOT EXISTS idx_ai_insights_is_read ON aiInsights(isRead);

-- Coach availability indexes
CREATE INDEX IF NOT EXISTS idx_coach_availability_coach_id ON coachAvailability(coachId);
CREATE INDEX IF NOT EXISTS idx_coach_availability_day_of_week ON coachAvailability(dayOfWeek);
CREATE INDEX IF NOT EXISTS idx_coach_availability_is_active ON coachAvailability(isActive);

-- Availability exceptions indexes
CREATE INDEX IF NOT EXISTS idx_availability_exceptions_coach_id ON availabilityExceptions(coachId);
CREATE INDEX IF NOT EXISTS idx_availability_exceptions_start_date ON availabilityExceptions(startDate);
CREATE INDEX IF NOT EXISTS idx_availability_exceptions_end_date ON availabilityExceptions(endDate);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(userId);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripeSubscriptionId);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripeCustomerId);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(currentPeriodEnd);

-- Performance note: These indexes will:
-- 1. Speed up dashboard queries (coach viewing their sessions)
-- 2. Speed up client lookups by email
-- 3. Speed up payment status checks
-- 4. Speed up date-range queries for calendar views
-- 5. Improve join performance on foreign keys
