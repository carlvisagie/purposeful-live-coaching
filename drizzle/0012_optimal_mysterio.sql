CREATE TABLE `coachNotifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coachId` int NOT NULL,
	`notificationType` enum('escalation','compliance_flag','crisis_alert','new_client','session_reminder') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`relatedId` int,
	`isRead` enum('true','false') NOT NULL DEFAULT 'false',
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coachNotifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complianceFlags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`messageId` int NOT NULL,
	`flagType` enum('medical_advice','diagnosis','prescription','legal_advice','financial_advice','harmful_content') NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`flaggedContent` text NOT NULL,
	`aiResponse` text,
	`reviewStatus` enum('pending','reviewed','dismissed','escalated') NOT NULL DEFAULT 'pending',
	`reviewedBy` int,
	`reviewNotes` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `complianceFlags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `escalationQueue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`userId` int NOT NULL,
	`clientId` int,
	`escalationType` enum('crisis','client_request','ai_uncertainty','compliance_flag','complex_issue') NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`reason` text NOT NULL,
	`context` text,
	`status` enum('pending','assigned','in_progress','resolved','closed') NOT NULL DEFAULT 'pending',
	`assignedTo` int,
	`assignedAt` timestamp,
	`resolvedAt` timestamp,
	`resolutionNotes` text,
	`notificationSent` enum('true','false') NOT NULL DEFAULT 'false',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `escalationQueue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `similarCases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseTitle` varchar(255) NOT NULL,
	`caseDescription` text NOT NULL,
	`clientIssues` text NOT NULL,
	`interventions` text NOT NULL,
	`outcome` text NOT NULL,
	`successRating` int NOT NULL,
	`timeToResolution` int,
	`coachNotes` text,
	`tags` text,
	`isPublic` enum('true','false') NOT NULL DEFAULT 'false',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `similarCases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `coachNotifications` ADD CONSTRAINT `coachNotifications_coachId_coaches_id_fk` FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complianceFlags` ADD CONSTRAINT `complianceFlags_conversationId_aiChatConversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `aiChatConversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complianceFlags` ADD CONSTRAINT `complianceFlags_messageId_aiChatMessages_id_fk` FOREIGN KEY (`messageId`) REFERENCES `aiChatMessages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complianceFlags` ADD CONSTRAINT `complianceFlags_reviewedBy_users_id_fk` FOREIGN KEY (`reviewedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `escalationQueue` ADD CONSTRAINT `escalationQueue_conversationId_aiChatConversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `aiChatConversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `escalationQueue` ADD CONSTRAINT `escalationQueue_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `escalationQueue` ADD CONSTRAINT `escalationQueue_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `escalationQueue` ADD CONSTRAINT `escalationQueue_assignedTo_coaches_id_fk` FOREIGN KEY (`assignedTo`) REFERENCES `coaches`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `similarCases` ADD CONSTRAINT `similarCases_createdBy_coaches_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `coaches`(`id`) ON DELETE no action ON UPDATE no action;