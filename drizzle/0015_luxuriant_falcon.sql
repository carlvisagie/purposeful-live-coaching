CREATE TABLE `clientPatterns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patternName` varchar(255) NOT NULL,
	`patternDescription` text NOT NULL,
	`patternType` varchar(100) NOT NULL,
	`occurrenceCount` int NOT NULL DEFAULT 1,
	`affectedClientCount` int NOT NULL DEFAULT 1,
	`commonTriggers` text,
	`effectiveSolutions` text,
	`relatedPatterns` text,
	`isValidated` enum('true','false') NOT NULL DEFAULT 'false',
	`confidenceScore` int NOT NULL DEFAULT 50,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientPatterns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `outcomeTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`baselineDate` timestamp NOT NULL,
	`baselineEmotionalState` int NOT NULL,
	`baselineFunctioning` int NOT NULL,
	`baselineGoals` text,
	`currentEmotionalState` int,
	`currentFunctioning` int,
	`goalsAchieved` text,
	`emotionalImprovement` int,
	`functioningImprovement` int,
	`daysInCoaching` int,
	`sleepImproved` enum('yes','no','unknown'),
	`relationshipsImproved` enum('yes','no','unknown'),
	`workPerformanceImproved` enum('yes','no','unknown'),
	`physicalHealthImproved` enum('yes','no','unknown'),
	`attributedToCoaching` enum('yes','no','partially'),
	`mostHelpfulAspect` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `outcomeTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recommendationFeedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`recommendationType` varchar(100) NOT NULL,
	`recommendationContent` text NOT NULL,
	`context` text,
	`wasUsed` enum('yes','no') NOT NULL,
	`wasHelpful` enum('yes','no','somewhat'),
	`rating` int,
	`feedbackNotes` text,
	`problemResolved` enum('yes','no','partially'),
	`timeToResolution` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recommendationFeedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategyAdjustments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adjustmentType` varchar(100) NOT NULL,
	`adjustmentDescription` text NOT NULL,
	`triggeringData` text,
	`expectedImprovement` text,
	`implementedAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`measuredImprovement` text,
	`wasSuccessful` enum('yes','no','unknown'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strategyAdjustments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `techniqueEffectiveness` (
	`id` int AUTO_INCREMENT NOT NULL,
	`techniqueName` varchar(255) NOT NULL,
	`techniqueCategory` varchar(100) NOT NULL,
	`techniqueDescription` text,
	`problemType` varchar(255) NOT NULL,
	`clientDemographic` text,
	`timesRecommended` int NOT NULL DEFAULT 0,
	`timesUsed` int NOT NULL DEFAULT 0,
	`successCount` int NOT NULL DEFAULT 0,
	`failureCount` int NOT NULL DEFAULT 0,
	`averageRating` int,
	`lastRecommended` timestamp,
	`confidenceScore` int NOT NULL DEFAULT 50,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `techniqueEffectiveness_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trendDetection` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trendName` varchar(255) NOT NULL,
	`trendDescription` text NOT NULL,
	`trendCategory` varchar(100) NOT NULL,
	`affectedPercentage` int NOT NULL,
	`totalClientsAnalyzed` int NOT NULL,
	`affectedClientCount` int NOT NULL,
	`suggestedContent` text,
	`suggestedApproach` text,
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`isAddressed` enum('true','false') NOT NULL DEFAULT 'false',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trendDetection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `outcomeTracking` ADD CONSTRAINT `outcomeTracking_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recommendationFeedback` ADD CONSTRAINT `recommendationFeedback_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;