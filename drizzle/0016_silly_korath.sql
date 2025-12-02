CREATE TABLE `autismOutcomeTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`assessmentDate` timestamp NOT NULL,
	`atecScore` int,
	`carsScore` int,
	`communicationLevel` enum('nonverbal','minimally_verbal','verbal'),
	`behaviorScore` int,
	`adaptiveFunctionScore` int,
	`giSymptomScore` int,
	`sleepScore` int,
	`familyQOL` int,
	`parentStress` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `autismOutcomeTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `autismPatternDetection` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childProfile` text NOT NULL,
	`interventionCombination` text NOT NULL,
	`outcomeData` text NOT NULL,
	`patternType` enum('high_responder','moderate_responder','non_responder'),
	`confidence` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `autismPatternDetection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `autismProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`childName` varchar(255) NOT NULL,
	`dateOfBirth` timestamp NOT NULL,
	`diagnosisDate` timestamp,
	`severity` enum('mild','moderate','severe') NOT NULL,
	`atecScore` int,
	`carsScore` int,
	`communicationLevel` enum('nonverbal','minimally_verbal','verbal') NOT NULL,
	`giSymptoms` text,
	`sleepIssues` text,
	`sensoryProfile` text,
	`behaviorChallenges` text,
	`familyResources` text,
	`treatmentPriorities` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `autismProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `autismProviders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerType` enum('ABA','OT','speech','FMT_clinic','neurofeedback') NOT NULL,
	`name` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`phone` varchar(50),
	`email` varchar(320),
	`website` varchar(500),
	`rating` int,
	`reviewCount` int,
	`acceptsInsurance` enum('true','false') NOT NULL,
	`costRange` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `autismProviders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dietaryInterventions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`dietType` enum('GFCF','ketogenic','SCD') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`adherence` int,
	`giSymptomChanges` text,
	`behaviorChanges` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dietaryInterventions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `interventionPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`tier1Interventions` text NOT NULL,
	`tier2Interventions` text,
	`tier3Interventions` text,
	`tier4Interventions` text,
	`currentPhase` enum('foundation','biomedical','behavioral','advanced') NOT NULL,
	`startDate` timestamp NOT NULL,
	`providerDirectory` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `interventionPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplementTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`supplementName` varchar(255) NOT NULL,
	`dosage` varchar(255) NOT NULL,
	`frequency` enum('daily','twice_daily','every_3_days') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`adherence` int,
	`sideEffects` text,
	`perceivedBenefit` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supplementTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `therapySessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`therapyType` enum('ABA','OT','speech','Floortime','neurofeedback') NOT NULL,
	`sessionDate` timestamp NOT NULL,
	`duration` int NOT NULL,
	`goalsAddressed` text,
	`progress` text,
	`parentFeedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `therapySessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `autismOutcomeTracking` ADD CONSTRAINT `autismOutcomeTracking_profileId_autismProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `autismProfiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `autismProfiles` ADD CONSTRAINT `autismProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dietaryInterventions` ADD CONSTRAINT `dietaryInterventions_profileId_autismProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `autismProfiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `interventionPlans` ADD CONSTRAINT `interventionPlans_profileId_autismProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `autismProfiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplementTracking` ADD CONSTRAINT `supplementTracking_profileId_autismProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `autismProfiles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `therapySessions` ADD CONSTRAINT `therapySessions_profileId_autismProfiles_id_fk` FOREIGN KEY (`profileId`) REFERENCES `autismProfiles`(`id`) ON DELETE no action ON UPDATE no action;