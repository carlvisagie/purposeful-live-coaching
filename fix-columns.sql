-- Check current column names in aiChatConversations table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'aiChatConversations'
ORDER BY ordinal_position;

-- If columns are camelCase (userId, clientId), rename them to snake_case to match Drizzle schema
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "userId" TO "user_id";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "clientId" TO "client_id";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "subscriptionId" TO "subscription_id";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "sessionDuration" TO "session_duration";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "feedbackText" TO "feedback_text";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "feedbackCategory" TO "feedback_category";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "wasHelpful" TO "was_helpful";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "reviewedByAdmin" TO "reviewed_by_admin";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "adminNotes" TO "admin_notes";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "lastMessageAt" TO "last_message_at";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "createdAt" TO "created_at";
-- ALTER TABLE "aiChatConversations" RENAME COLUMN "updatedAt" TO "updated_at";
