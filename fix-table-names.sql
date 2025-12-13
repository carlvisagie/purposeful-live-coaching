-- Rename tables from camelCase to snake_case
ALTER TABLE IF EXISTS "aiChatConversations" RENAME TO "ai_chat_conversations";
ALTER TABLE IF EXISTS "aiChatMessages" RENAME TO "ai_chat_messages";
ALTER TABLE IF EXISTS "aiInsights" RENAME TO "ai_insights";
