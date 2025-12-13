-- COMPLETE DATABASE MIGRATION SCRIPT
-- Run this on production database to fix all schema mismatches
-- Date: December 13, 2025

-- ============================================
-- 1. FIX COACHES TABLE
-- ============================================
-- Add missing columns to coaches table
DO $$ 
BEGIN
    -- Add specialization column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='specialization') THEN
        ALTER TABLE coaches ADD COLUMN specialization TEXT;
    END IF;
    
    -- Add bio column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='bio') THEN
        ALTER TABLE coaches ADD COLUMN bio TEXT;
    END IF;
    
    -- Add certifications column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='certifications') THEN
        ALTER TABLE coaches ADD COLUMN certifications TEXT;
    END IF;
    
    -- Add years_experience column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='years_experience') THEN
        ALTER TABLE coaches ADD COLUMN years_experience INTEGER;
    END IF;
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='coaches' AND column_name='is_active') THEN
        ALTER TABLE coaches ADD COLUMN is_active VARCHAR(50);
    END IF;
END $$;

-- ============================================
-- 2. FIX AICHATCONVERSATIONS TABLE
-- ============================================
DO $$ 
BEGIN
    -- Add subscription_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='subscription_id') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN subscription_id INTEGER;
    END IF;
    
    -- Add session_duration column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='session_duration') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN session_duration INTEGER DEFAULT 0;
    END IF;
    
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='title') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN title TEXT;
    END IF;
    
    -- Add rating column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='rating') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN rating INTEGER;
    END IF;
    
    -- Add feedback_text column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='feedback_text') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN feedback_text TEXT;
    END IF;
    
    -- Add feedback_category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='feedback_category') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN feedback_category TEXT;
    END IF;
    
    -- Add was_helpful column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='was_helpful') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN was_helpful BOOLEAN;
    END IF;
    
    -- Add reviewed_by_admin column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='reviewed_by_admin') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN reviewed_by_admin BOOLEAN;
    END IF;
    
    -- Add admin_notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='aiChatConversations' AND column_name='admin_notes') THEN
        ALTER TABLE "aiChatConversations" ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- ============================================
-- 3. VERIFY CHANGES
-- ============================================
-- Check coaches table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'coaches' 
ORDER BY ordinal_position;

-- Check aiChatConversations table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'aiChatConversations' 
ORDER BY ordinal_position;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- After running this script:
-- 1. Restart the Render service
-- 2. Test AI Coach conversation creation
-- 3. Test Live Session creation
-- 4. Verify all features work
