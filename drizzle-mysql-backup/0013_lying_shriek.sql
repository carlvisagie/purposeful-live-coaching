CREATE TABLE `coachGuidance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`guidanceType` enum('suggest','alert','reference','technique','crisis') NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL,
	`message` text NOT NULL,
	`context` text,
	`timestamp` timestamp NOT NULL,
	`wasFollowed` enum('true','false') DEFAULT 'false',
	CONSTRAINT `coachGuidance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `liveSessionTranscripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`speaker` enum('client','coach') NOT NULL,
	`text` text NOT NULL,
	`timestamp` timestamp NOT NULL,
	CONSTRAINT `liveSessionTranscripts_id` PRIMARY KEY(`id`)
);
