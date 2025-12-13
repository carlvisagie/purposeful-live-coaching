-- Add AI message count tracking for tier differentiation
-- December 13, 2025 12:20 PM EST

ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS ai_messages_used INTEGER DEFAULT 0 NOT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN usage_tracking.ai_messages_used IS 'Tracks AI chat messages used in current billing period for tier limit enforcement (Basic: 100, Premium: 500, Elite: unlimited)';
