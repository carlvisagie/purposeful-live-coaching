-- Migration: Add usage tracking for AI voice calls and human coach calls
-- This enables usage-based billing and overage charges

-- Create callLogs table for tracking all voice calls
CREATE TABLE IF NOT EXISTS call_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
  call_type VARCHAR(50) NOT NULL, -- 'ai_voice' or 'human_coach'
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  cost_cents INTEGER NOT NULL DEFAULT 0, -- Cost in cents (for precise billing)
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'completed', -- 'completed', 'failed', 'in_progress'
  metadata JSONB, -- Additional call metadata (quality, transcript summary, etc.)
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_subscription_id ON call_logs(subscription_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_started_at ON call_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_call_logs_call_type ON call_logs(call_type);

-- Create usage_summary table for billing period summaries
CREATE TABLE IF NOT EXISTS usage_summary (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
  billing_period_start TIMESTAMP NOT NULL,
  billing_period_end TIMESTAMP NOT NULL,
  ai_voice_minutes_used INTEGER DEFAULT 0,
  ai_voice_overage_cents INTEGER DEFAULT 0,
  human_coach_calls_used INTEGER DEFAULT 0,
  human_coach_overage_cents INTEGER DEFAULT 0,
  total_overage_cents INTEGER DEFAULT 0,
  stripe_invoice_id VARCHAR(255), -- Link to Stripe invoice
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create index for efficient billing queries
CREATE INDEX IF NOT EXISTS idx_usage_summary_user_id ON usage_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_summary_subscription_id ON usage_summary(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_summary_billing_period ON usage_summary(billing_period_start, billing_period_end);

-- Create usage_alerts table for notifying users about usage limits
CREATE TABLE IF NOT EXISTS usage_alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- '80_percent', '100_percent', 'overage', 'upgrade_prompt'
  resource_type VARCHAR(50) NOT NULL, -- 'ai_voice', 'human_coach'
  threshold_value INTEGER NOT NULL, -- The threshold that triggered the alert
  current_value INTEGER NOT NULL, -- Current usage value
  sent_at TIMESTAMP DEFAULT NOW() NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create index for alert queries
CREATE INDEX IF NOT EXISTS idx_usage_alerts_user_id ON usage_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_alerts_sent_at ON usage_alerts(sent_at);
