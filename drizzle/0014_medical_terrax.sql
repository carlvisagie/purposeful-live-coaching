CREATE TABLE `dailyCheckins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`checkinDate` timestamp NOT NULL DEFAULT (now()),
	`sleptWell` enum('yes','no') NOT NULL,
	`ateWell` enum('yes','no') NOT NULL,
	`movedBody` enum('yes','no') NOT NULL,
	`emotionalState` int NOT NULL,
	`followedPlan` enum('yes','no') NOT NULL,
	`controlledImpulses` enum('yes','no') NOT NULL,
	`actedLikeTargetIdentity` enum('yes','no') NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyCheckins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disciplineEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`eventDate` timestamp NOT NULL DEFAULT (now()),
	`eventType` enum('impulse_controlled','impulse_failed','discipline_win','discipline_fail') NOT NULL,
	`situation` text,
	`response` text,
	`outcome` text,
	`reinforcedIdentity` enum('yes','no') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `disciplineEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `habitCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`habitId` int NOT NULL,
	`completionDate` timestamp NOT NULL DEFAULT (now()),
	`completed` enum('yes','no') NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `habitCompletions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`habitName` varchar(255) NOT NULL,
	`habitDescription` text,
	`identityConnection` text,
	`frequency` enum('daily','weekly','custom') NOT NULL DEFAULT 'daily',
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `habits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `identityProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`currentIdentity` text,
	`targetIdentity` text,
	`identityGaps` text,
	`coreValues` text,
	`lifeMission` text,
	`longTermVision` text,
	`identityWins` text,
	`identityContradictions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `identityProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `microHabits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`microHabitName` varchar(255) NOT NULL,
	`trigger` varchar(255) NOT NULL,
	`action` varchar(255) NOT NULL,
	`identityReinforcement` text,
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `microHabits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `dailyCheckins` ADD CONSTRAINT `dailyCheckins_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `disciplineEvents` ADD CONSTRAINT `disciplineEvents_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `habitCompletions` ADD CONSTRAINT `habitCompletions_habitId_habits_id_fk` FOREIGN KEY (`habitId`) REFERENCES `habits`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `habits` ADD CONSTRAINT `habits_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `identityProfiles` ADD CONSTRAINT `identityProfiles_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `microHabits` ADD CONSTRAINT `microHabits_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;