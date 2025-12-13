-- Fix aiChatConversations table schema
-- This script ensures the production database matches the Drizzle schema

-- Check if columns exist and add them if missing
DO $$ 
BEGIN
    -- Add sessionDuration if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aiChatConversations' AND column_name = 'session_duration'
    ) THEN
        ALTER TABLE "aiChatConversations" 
        ADD COLUMN "session_duration" INTEGER DEFAULT 0;
    END IF;

    -- Add title if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aiChatConversations' AND column_name = 'title'
    ) THEN
        ALTER TABLE "aiChatConversations" 
        ADD COLUMN "title" VARCHAR(255);
    END IF;

    -- Add rating if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aiChatConversations' AND column_name = 'rating'
    ) THEN
        ALTER TABLE "aiChatConversations" 
        ADD COLUMN "rating" INTEGER;
    END IF;

    -- Add feedbackText if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aiChatConversations' AND column_name = 'feedback_text'
    ) THEN
        ALTER TABLE "aiChatConversations" 
        ADD COLUMN "feedback_text" TEXT;
    END IF;

    -- Add feedbackCategory if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aiChatConversations' AND column_name = 'feedback_category'
    ) THEN
        ALTER TABLE "aiChatConversations" 
        ADD COLUMN "feedback_category" VARCHAR(50);
    END IF;

    -- Add wasHelpful if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aiChatConversations' AND column_name = 'was_helpful'
    ) THEN
        ALTER TABLE "aiChatConversations" 
        ADD COLUMN "was_helpful" VARCHAR(50);
    END IF;

    -- Add reviewedByAdmin if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aiChatConversations' AND column_name = 'reviewed_by_admin'
    ) THEN
        ALTER TABLE "aiChatConversations" 
        ADD COLUMN "reviewed_by_admin" VARCHAR(50);
    END IF;

    -- Add adminNotes if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aiChatConversations' AND column_name = 'admin_notes'
    ) THEN
        ALTER TABLE "aiChatConversations" 
        ADD COLUMN "admin_notes" TEXT;
    END IF;

    -- Ensure lastMessageAt has default
    ALTER TABLE "aiChatConversations" 
    ALTER COLUMN "last_message_at" SET DEFAULT NOW();

    -- Ensure createdAt has default
    ALTER TABLE "aiChatConversations" 
    ALTER COLUMN "created_at" SET DEFAULT NOW();

    -- Ensure updatedAt has default
    ALTER TABLE "aiChatConversations" 
    ALTER COLUMN "updated_at" SET DEFAULT NOW();

END $$;

-- Verify the changes
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'aiChatConversations'
ORDER BY ordinal_position;
