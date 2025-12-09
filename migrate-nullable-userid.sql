-- Make userId nullable in aiChatConversations for guest users
ALTER TABLE aiChatConversations MODIFY COLUMN userId INT NULL;
