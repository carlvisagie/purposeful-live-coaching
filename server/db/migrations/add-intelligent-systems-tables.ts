/**
 * MIGRATION: Add Intelligent Systems Tables
 * 
 * Creates tables for persistent storage of:
 * - Self-Learning data
 * - Self-Fixing data
 * - Self-Evolving data
 */

import { sql } from "drizzle-orm";
import { db } from "../../db.js";

export async function up() {
  console.log("[Migration] Creating intelligent systems tables...");
  
  // Self-Learning Tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS module_interactions (
      id SERIAL PRIMARY KEY,
      module_type VARCHAR(100) NOT NULL,
      action VARCHAR(255) NOT NULL,
      user_id INTEGER,
      session_id VARCHAR(255),
      was_successful BOOLEAN NOT NULL,
      user_satisfaction INTEGER,
      user_feedback TEXT,
      duration INTEGER,
      time_of_day VARCHAR(50),
      day_of_week INTEGER,
      device_type VARCHAR(50),
      user_choice VARCHAR(255),
      alternatives JSONB,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_module_interactions_module ON module_interactions(module_type);
    CREATE INDEX IF NOT EXISTS idx_module_interactions_user ON module_interactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_module_interactions_created ON module_interactions(created_at);
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS module_learning (
      id SERIAL PRIMARY KEY,
      module_type VARCHAR(100) NOT NULL UNIQUE,
      total_interactions INTEGER DEFAULT 0 NOT NULL,
      successful_interactions INTEGER DEFAULT 0 NOT NULL,
      success_rate REAL DEFAULT 0 NOT NULL,
      top_effective_strategies JSONB,
      top_ineffective_strategies JSONB,
      client_preferences JSONB,
      emerging_patterns JSONB,
      suggested_improvements JSONB,
      last_analyzed TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS feature_effectiveness (
      id SERIAL PRIMARY KEY,
      feature_id VARCHAR(255) NOT NULL UNIQUE,
      module_type VARCHAR(100) NOT NULL,
      action VARCHAR(255) NOT NULL,
      times_used INTEGER DEFAULT 0 NOT NULL,
      success_count INTEGER DEFAULT 0 NOT NULL,
      failure_count INTEGER DEFAULT 0 NOT NULL,
      effectiveness_score REAL DEFAULT 50 NOT NULL,
      average_satisfaction REAL DEFAULT 5 NOT NULL,
      total_satisfaction_ratings INTEGER DEFAULT 0 NOT NULL,
      last_used TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_feature_effectiveness_module ON feature_effectiveness(module_type);
  `);
  
  // Self-Fixing Tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS error_logs (
      id SERIAL PRIMARY KEY,
      module VARCHAR(100) NOT NULL,
      operation VARCHAR(255) NOT NULL,
      user_id INTEGER,
      session_id VARCHAR(255),
      error_type VARCHAR(50) NOT NULL,
      severity VARCHAR(20) NOT NULL,
      error_message TEXT NOT NULL,
      error_stack TEXT,
      attempt_number INTEGER DEFAULT 1 NOT NULL,
      was_fixed BOOLEAN DEFAULT FALSE NOT NULL,
      fix_method VARCHAR(255),
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_error_logs_module ON error_logs(module);
    CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
    CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at);
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS service_health (
      id SERIAL PRIMARY KEY,
      service VARCHAR(100) NOT NULL UNIQUE,
      status VARCHAR(20) NOT NULL,
      last_check TIMESTAMP DEFAULT NOW() NOT NULL,
      response_time INTEGER,
      error_count INTEGER DEFAULT 0 NOT NULL,
      consecutive_failures INTEGER DEFAULT 0 NOT NULL,
      last_healthy_at TIMESTAMP,
      last_down_at TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS correction_history (
      id SERIAL PRIMARY KEY,
      error_log_id INTEGER REFERENCES error_logs(id),
      correction_type VARCHAR(100) NOT NULL,
      correction_description TEXT NOT NULL,
      was_successful BOOLEAN NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  
  // Self-Evolving Tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS rule_effectiveness (
      id SERIAL PRIMARY KEY,
      rule_id VARCHAR(255) NOT NULL UNIQUE,
      module_type VARCHAR(100) NOT NULL,
      times_triggered INTEGER DEFAULT 0 NOT NULL,
      clients_affected INTEGER DEFAULT 0 NOT NULL,
      positive_outcomes INTEGER DEFAULT 0 NOT NULL,
      negative_outcomes INTEGER DEFAULT 0 NOT NULL,
      neutral_outcomes INTEGER DEFAULT 0 NOT NULL,
      average_client_satisfaction REAL DEFAULT 5 NOT NULL,
      effectiveness_score REAL DEFAULT 50 NOT NULL,
      last_updated TIMESTAMP DEFAULT NOW() NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_rule_effectiveness_module ON rule_effectiveness(module_type);
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS platform_insights (
      id SERIAL PRIMARY KEY,
      insight_id VARCHAR(100) NOT NULL UNIQUE,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT NOT NULL,
      affected_modules JSONB,
      affected_percentage REAL NOT NULL,
      suggested_action TEXT,
      research_basis TEXT,
      confidence REAL NOT NULL,
      status VARCHAR(50) DEFAULT 'active' NOT NULL,
      implemented_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_platform_insights_type ON platform_insights(type);
    CREATE INDEX IF NOT EXISTS idx_platform_insights_status ON platform_insights(status);
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS evolution_events (
      id SERIAL PRIMARY KEY,
      event_id VARCHAR(100) NOT NULL UNIQUE,
      event_type VARCHAR(50) NOT NULL,
      module_type VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      reason TEXT NOT NULL,
      previous_value JSONB,
      new_value JSONB,
      research_basis TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_evolution_events_module ON evolution_events(module_type);
    CREATE INDEX IF NOT EXISTS idx_evolution_events_created ON evolution_events(created_at);
  `);
  
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS research_validations (
      id SERIAL PRIMARY KEY,
      cache_key VARCHAR(500) NOT NULL UNIQUE,
      claim TEXT NOT NULL,
      domain VARCHAR(100) NOT NULL,
      is_valid BOOLEAN NOT NULL,
      evidence_level VARCHAR(10) NOT NULL,
      sources JSONB,
      confidence REAL NOT NULL,
      reasoning TEXT,
      last_validated TIMESTAMP DEFAULT NOW() NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_research_validations_domain ON research_validations(domain);
    CREATE INDEX IF NOT EXISTS idx_research_validations_expires ON research_validations(expires_at);
  `);
  
  console.log("[Migration] Intelligent systems tables created successfully!");
}

export async function down() {
  console.log("[Migration] Dropping intelligent systems tables...");
  
  await db.execute(sql`DROP TABLE IF EXISTS research_validations CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS evolution_events CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS platform_insights CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS rule_effectiveness CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS correction_history CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS service_health CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS error_logs CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS feature_effectiveness CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS module_learning CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS module_interactions CASCADE;`);
  
  console.log("[Migration] Intelligent systems tables dropped!");
}
