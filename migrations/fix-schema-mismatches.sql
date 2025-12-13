-- Migration: Fix all schema mismatches between code and database
-- This migration is idempotent (safe to run multiple times)

-- Add missing columns to aiChatConversations table
DO $$ 
BEGIN
    -- client_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='client_id') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE;
    END IF;
    
    -- subscription_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='subscription_id') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL;
    END IF;
    
    -- session_duration
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='session_duration') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN session_duration INTEGER DEFAULT 0;
    END IF;
    
    -- title
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='title') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN title TEXT;
    END IF;
    
    -- rating
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='rating') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN rating INTEGER;
    END IF;
    
    -- feedback_text
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='feedback_text') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN feedback_text TEXT;
    END IF;
    
    -- feedback_category
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='feedback_category') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN feedback_category TEXT;
    END IF;
    
    -- was_helpful
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='was_helpful') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN was_helpful BOOLEAN;
    END IF;
    
    -- reviewed_by_admin
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='reviewed_by_admin') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN reviewed_by_admin BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- admin_notes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='admin_notes') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN admin_notes TEXT;
    END IF;
    
    -- last_message_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='last_message_at') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN last_message_at TIMESTAMP;
    END IF;
END $$;

-- Add missing columns to coaches table
DO $$ 
BEGIN
    -- specialization
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='specialization') THEN
        ALTER TABLE coaches ADD COLUMN specialization TEXT;
    END IF;
    
    -- bio
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='bio') THEN
        ALTER TABLE coaches ADD COLUMN bio TEXT;
    END IF;
    
    -- certifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='certifications') THEN
        ALTER TABLE coaches ADD COLUMN certifications TEXT;
    END IF;
    
    -- years_experience
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='years_experience') THEN
        ALTER TABLE coaches ADD COLUMN years_experience INTEGER;
    END IF;
    
    -- is_active
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='is_active') THEN
        ALTER TABLE coaches ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;
