CREATE TABLE `videoTestimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`quote` text NOT NULL,
	`metric` varchar(255) NOT NULL,
	`metricValue` varchar(100) NOT NULL,
	`videoUrl` text,
	`videoKey` varchar(500),
	`thumbnailUrl` text,
	`thumbnailKey` varchar(500),
	`duration` int,
	`isPublished` enum('true','false') NOT NULL DEFAULT 'false',
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videoTestimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `platformSettings` DROP INDEX `platformSettings_settingKey_unique`;--> statement-breakpoint
ALTER TABLE `platformSettings` ADD `aiCoachingEnabled` enum('true','false') DEFAULT 'false' NOT NULL;--> statement-breakpoint
ALTER TABLE `platformSettings` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `platformSettings` DROP COLUMN `settingKey`;--> statement-breakpoint
ALTER TABLE `platformSettings` DROP COLUMN `settingValue`;--> statement-breakpoint
ALTER TABLE `platformSettings` DROP COLUMN `description`;