CREATE TABLE `aiInsights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`insightDate` timestamp NOT NULL DEFAULT (now()),
	`insightType` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'low',
	`actionable` text,
	`isRead` enum('true','false') NOT NULL DEFAULT 'false',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiInsights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coachId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`dateOfBirth` timestamp,
	`goals` text,
	`notes` text,
	`status` enum('active','inactive','completed') NOT NULL DEFAULT 'active',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coaches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`specialization` text,
	`bio` text,
	`certifications` text,
	`yearsExperience` int,
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coaches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `copingStrategies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`strategyName` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`timesUsed` int NOT NULL DEFAULT 0,
	`averageEffectiveness` int,
	`lastUsed` timestamp,
	`isRecommended` enum('true','false') NOT NULL DEFAULT 'false',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `copingStrategies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emotionLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`journalEntryId` int,
	`logDate` timestamp NOT NULL DEFAULT (now()),
	`emotionType` varchar(100) NOT NULL,
	`intensity` int NOT NULL,
	`trigger` text,
	`physicalSensations` text,
	`thoughts` text,
	`behaviors` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emotionLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journalEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`entryDate` timestamp NOT NULL DEFAULT (now()),
	`content` text NOT NULL,
	`mood` varchar(50),
	`moodIntensity` int,
	`emotions` text,
	`triggers` text,
	`copingStrategies` text,
	`copingEffectiveness` int,
	`resilienceScore` int,
	`isPrivate` enum('true','false') NOT NULL DEFAULT 'false',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journalEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coachId` int NOT NULL,
	`clientId` int NOT NULL,
	`scheduledDate` timestamp NOT NULL,
	`duration` int NOT NULL,
	`sessionType` varchar(100),
	`notes` text,
	`status` enum('scheduled','completed','cancelled','no-show') NOT NULL DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `aiInsights` ADD CONSTRAINT `aiInsights_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_coachId_coaches_id_fk` FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coaches` ADD CONSTRAINT `coaches_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `copingStrategies` ADD CONSTRAINT `copingStrategies_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emotionLogs` ADD CONSTRAINT `emotionLogs_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emotionLogs` ADD CONSTRAINT `emotionLogs_journalEntryId_journalEntries_id_fk` FOREIGN KEY (`journalEntryId`) REFERENCES `journalEntries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `journalEntries` ADD CONSTRAINT `journalEntries_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_coachId_coaches_id_fk` FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;