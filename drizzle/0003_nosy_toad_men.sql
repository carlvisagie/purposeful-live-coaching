CREATE TABLE `availabilityExceptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coachId` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`reason` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `availabilityExceptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coachAvailability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coachId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coachAvailability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessionReminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`reminderType` enum('24_hour','1_hour') NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessionReminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `availabilityExceptions` ADD CONSTRAINT `availabilityExceptions_coachId_coaches_id_fk` FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `coachAvailability` ADD CONSTRAINT `coachAvailability_coachId_coaches_id_fk` FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessionReminders` ADD CONSTRAINT `sessionReminders_sessionId_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON DELETE cascade ON UPDATE no action;