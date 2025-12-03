-- Migration: Add AI-First Subscription Model
-- Run this when you get home to enable subscription billing

-- Step 1: Add new fields to existing subscriptions table
ALTER TABLE subscriptions
ADD COLUMN tier ENUM('ai_only', 'hybrid', 'premium') AFTER stripePriceId,
ADD COLUMN cancelAtPeriodEnd BOOLEAN DEFAULT FALSE AFTER currentPeriodEnd,
ADD COLUMN trialStart TIMESTAMP NULL AFTER cancelAtPeriodEnd,
ADD COLUMN trialEnd TIMESTAMP NULL AFTER trialStart;

-- Step 2: Update status enum to include 'trialing'
ALTER TABLE subscriptions
MODIFY COLUMN status ENUM('active', 'cancelled', 'past_due', 'unpaid', 'trialing') NOT NULL DEFAULT 'active';

-- Step 3: Create usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subscription_id INT NOT NULL,
  user_id INT NOT NULL,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  ai_sessions_used INT DEFAULT 0,
  human_sessions_used INT DEFAULT 0,
  human_sessions_included INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_subscription_period (subscription_id, period_start, period_end),
  INDEX idx_user_period (user_id, period_start, period_end)
);

-- Step 4: Create human session bookings table
CREATE TABLE IF NOT EXISTS human_session_bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  coach_id INT NOT NULL,
  subscription_id INT NOT NULL,
  session_date TIMESTAMP NOT NULL,
  duration INT NOT NULL DEFAULT 30,
  status ENUM('scheduled', 'completed', 'canceled', 'no_show') NOT NULL,
  zoom_link TEXT,
  ai_pre_session_brief TEXT,
  coach_notes TEXT,
  recording_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, session_date),
  INDEX idx_coach_date (coach_id, session_date),
  INDEX idx_subscription (subscription_id)
);

-- Step 5: Add AI session tracking to aiChatConversations
ALTER TABLE aiChatConversations
ADD COLUMN subscription_id INT NULL AFTER clientId,
ADD COLUMN session_duration INT DEFAULT 0 COMMENT 'Duration in minutes' AFTER subscription_id,
ADD FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL;

-- Step 6: Create index for faster subscription lookups
CREATE INDEX idx_user_status ON subscriptions(userId, status);
CREATE INDEX idx_stripe_subscription ON subscriptions(stripeSubscriptionId);

-- Verification queries (run these to check migration succeeded)
-- SELECT COUNT(*) FROM usage_tracking;
-- SELECT COUNT(*) FROM human_session_bookings;
-- DESCRIBE subscriptions;
-- SHOW INDEX FROM subscriptions;
