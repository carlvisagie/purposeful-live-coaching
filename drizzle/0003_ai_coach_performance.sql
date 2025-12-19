-- AI Coach Performance Tracking Tables
-- Migration: 0003_ai_coach_performance.sql

-- Table for tracking individual AI coaching sessions
CREATE TABLE IF NOT EXISTS "ai_coach_sessions" (
  "id" SERIAL PRIMARY KEY,
  "session_id" VARCHAR(255) NOT NULL UNIQUE,
  "coach_type" VARCHAR(50) NOT NULL,
  "session_mode" VARCHAR(50),
  "client_id" INTEGER REFERENCES "clients"("id"),
  "user_id" INTEGER REFERENCES "users"("id"),
  "started_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "ended_at" TIMESTAMP,
  "duration_seconds" INTEGER,
  "message_count" INTEGER,
  "client_message_count" INTEGER,
  "coach_message_count" INTEGER,
  "session_completed" BOOLEAN DEFAULT true,
  "client_initiated_end" BOOLEAN DEFAULT true,
  "starting_mood" VARCHAR(50),
  "ending_mood" VARCHAR(50),
  "mood_improvement" DECIMAL(3,1),
  "breakthrough_moments" JSONB,
  "breakthrough_count" INTEGER DEFAULT 0,
  "techniques_used" JSONB,
  "client_rating" INTEGER,
  "client_feedback" TEXT,
  "would_recommend" BOOLEAN,
  "what_worked" JSONB,
  "what_didnt_work" JSONB,
  "rapport_level" VARCHAR(50),
  "transcript_summary" TEXT,
  "key_topics_discussed" JSONB,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table for aggregated performance metrics per coach
CREATE TABLE IF NOT EXISTS "ai_coach_performance_aggregates" (
  "id" SERIAL PRIMARY KEY,
  "coach_type" VARCHAR(50) NOT NULL,
  "period_start" TIMESTAMP NOT NULL,
  "period_end" TIMESTAMP NOT NULL,
  "total_sessions" INTEGER DEFAULT 0,
  "completed_sessions" INTEGER DEFAULT 0,
  "avg_duration_seconds" INTEGER,
  "avg_client_rating" DECIMAL(3,2),
  "total_breakthroughs" INTEGER DEFAULT 0,
  "avg_mood_improvement" DECIMAL(3,2),
  "unique_clients" INTEGER DEFAULT 0,
  "retention_rate" DECIMAL(5,2),
  "top_techniques" JSONB,
  "common_issues" JSONB,
  "calculated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("coach_type", "period_start", "period_end")
);

-- Table for tracking technique effectiveness
CREATE TABLE IF NOT EXISTS "ai_coach_technique_effectiveness" (
  "id" SERIAL PRIMARY KEY,
  "coach_type" VARCHAR(50) NOT NULL,
  "technique_name" VARCHAR(255) NOT NULL,
  "times_used" INTEGER DEFAULT 0,
  "avg_client_rating_when_used" DECIMAL(3,2),
  "breakthrough_correlation" DECIMAL(5,4),
  "mood_improvement_correlation" DECIMAL(5,4),
  "last_updated" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("coach_type", "technique_name")
);

-- Table for comparison insights between coaches
CREATE TABLE IF NOT EXISTS "ai_coach_comparison_insights" (
  "id" SERIAL PRIMARY KEY,
  "generated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "overall_ranking" JSONB,
  "top_performer_insights" JSONB,
  "improvement_opportunities" JSONB,
  "recommendations" JSONB
);

-- Table for tracking coach evolution/changes over time
CREATE TABLE IF NOT EXISTS "ai_coach_evolution_log" (
  "id" SERIAL PRIMARY KEY,
  "coach_type" VARCHAR(50) NOT NULL,
  "change_type" VARCHAR(50) NOT NULL,
  "change_description" TEXT NOT NULL,
  "change_made_by" VARCHAR(100),
  "metrics_before" JSONB,
  "metrics_after" JSONB,
  "impact_assessment" VARCHAR(50),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_ai_coach_sessions_coach_type" ON "ai_coach_sessions"("coach_type");
CREATE INDEX IF NOT EXISTS "idx_ai_coach_sessions_started_at" ON "ai_coach_sessions"("started_at");
CREATE INDEX IF NOT EXISTS "idx_ai_coach_sessions_client_id" ON "ai_coach_sessions"("client_id");
CREATE INDEX IF NOT EXISTS "idx_ai_coach_technique_effectiveness_coach" ON "ai_coach_technique_effectiveness"("coach_type");
CREATE INDEX IF NOT EXISTS "idx_ai_coach_evolution_log_coach" ON "ai_coach_evolution_log"("coach_type");
