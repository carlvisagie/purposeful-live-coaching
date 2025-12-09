CREATE TABLE `sessionTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`coachId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`duration` int NOT NULL,
	`price` int NOT NULL,
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessionTypes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD `sessionTypeId` int;--> statement-breakpoint
ALTER TABLE `sessions` ADD `price` int;--> statement-breakpoint
ALTER TABLE `sessions` ADD `paymentStatus` enum('pending','paid','refunded','failed') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `sessions` ADD `stripePaymentIntentId` varchar(255);--> statement-breakpoint
ALTER TABLE `sessionTypes` ADD CONSTRAINT `sessionTypes_coachId_coaches_id_fk` FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_sessionTypeId_sessionTypes_id_fk` FOREIGN KEY (`sessionTypeId`) REFERENCES `sessionTypes`(`id`) ON DELETE no action ON UPDATE no action;