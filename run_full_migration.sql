-- Add rich client profile fields to existing clients table
ALTER TABLE clients 
  ADD COLUMN IF NOT EXISTS jobTitle varchar(200),
  ADD COLUMN IF NOT EXISTS company varchar(200),
  ADD COLUMN IF NOT EXISTS industry varchar(100),
  ADD COLUMN IF NOT EXISTS careerGoals text,
  ADD COLUMN IF NOT EXISTS age int,
  ADD COLUMN IF NOT EXISTS locationCity varchar(100),
  ADD COLUMN IF NOT EXISTS locationState varchar(100),
  ADD COLUMN IF NOT EXISTS locationCountry varchar(100),
  ADD COLUMN IF NOT EXISTS relationshipStatus varchar(50),
  ADD COLUMN IF NOT EXISTS hasChildren enum('true', 'false'),
  ADD COLUMN IF NOT EXISTS primaryGoal text,
  ADD COLUMN IF NOT EXISTS goalTimeline varchar(100),
  ADD COLUMN IF NOT EXISTS motivation text,
  ADD COLUMN IF NOT EXISTS currentIdentity text,
  ADD COLUMN IF NOT EXISTS targetIdentity text,
  ADD COLUMN IF NOT EXISTS identityGap text,
  ADD COLUMN IF NOT EXISTS coreValues text,
  ADD COLUMN IF NOT EXISTS lifeMission text,
  ADD COLUMN IF NOT EXISTS procrastinationTriggers text,
  ADD COLUMN IF NOT EXISTS energyPattern varchar(50),
  ADD COLUMN IF NOT EXISTS stressResponses text,
  ADD COLUMN IF NOT EXISTS sleepHours decimal(3,1),
  ADD COLUMN IF NOT EXISTS exerciseFrequency varchar(50),
  ADD COLUMN IF NOT EXISTS dietPattern varchar(100),
  ADD COLUMN IF NOT EXISTS mentalHealthNotes text,
  ADD COLUMN IF NOT EXISTS savingsLevel varchar(50),
  ADD COLUMN IF NOT EXISTS hasDebt enum('true', 'false'),
  ADD COLUMN IF NOT EXISTS monthlyExpensesEstimate int,
  ADD COLUMN IF NOT EXISTS preferredContact varchar(50),
  ADD COLUMN IF NOT EXISTS bestTimeToReach varchar(50),
  ADD COLUMN IF NOT EXISTS communicationStyle varchar(50),
  ADD COLUMN IF NOT EXISTS suicideRiskLevel varchar(20),
  ADD COLUMN IF NOT EXISTS crisisFlags text,
  ADD COLUMN IF NOT EXISTS lastCrisisCheck timestamp,
  ADD COLUMN IF NOT EXISTS profileCompleteness int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS confidenceScores text,
  ADD COLUMN IF NOT EXISTS lastProfileUpdate timestamp;

SELECT 'Rich client profile fields added' as status;
-- Session Recording & Intelligence System Tables
-- Run this migration to add all new tables

-- Session Recordings (2-tier access system)
CREATE TABLE IF NOT EXISTS `sessionRecordings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `sessionId` int NOT NULL,
  `clientId` int NOT NULL,
  `coachId` int NOT NULL,
  `videoUrl` text,
  `videoKey` varchar(500),
  `audioUrl` text,
  `audioKey` varchar(500),
  `transcriptUrl` text,
  `transcriptKey` varchar(500),
  `duration` int,
  `fileSize` int,
  `status` enum('processing', 'ready', 'failed', 'deleted') NOT NULL DEFAULT 'processing',
  `clientCanAccess` enum('true', 'false') NOT NULL DEFAULT 'true',
  `consentGiven` enum('true', 'false') NOT NULL DEFAULT 'false',
  `recordedAt` timestamp NOT NULL,
  `expiresAt` timestamp,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`)
);

-- Session Summaries (client-accessible documentation)
CREATE TABLE IF NOT EXISTS `sessionSummaries` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `sessionId` int NOT NULL,
  `recordingId` int,
  `summary` text NOT NULL,
  `goals` text,
  `homework` text,
  `keyMoments` text,
  `emotionTimeline` text,
  `techniquesUsed` text,
  `nextSteps` text,
  `clientProgress` text,
  `generatedAt` timestamp NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recordingId`) REFERENCES `sessionRecordings`(`id`)
);

-- Coach Private Notes (coach-only, NOT client-accessible)
CREATE TABLE IF NOT EXISTS `coachPrivateNotes` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `sessionId` int NOT NULL,
  `coachId` int NOT NULL,
  `notes` text NOT NULL,
  `aiPromptsReceived` text,
  `supervisionQuestions` text,
  `clinicalObservations` text,
  `reminders` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`)
);

-- Platform Analytics (bird's eye view)
CREATE TABLE IF NOT EXISTS `platformAnalytics` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `metricType` enum('technique_effectiveness', 'common_trigger', 'demographic_insight', 'seasonal_pattern', 'trend') NOT NULL,
  `metricName` varchar(255) NOT NULL,
  `metricValue` text NOT NULL,
  `sampleSize` int NOT NULL,
  `confidence` int NOT NULL,
  `timeframe` varchar(100) NOT NULL,
  `demographics` text,
  `insights` text,
  `actionable` enum('true', 'false') NOT NULL DEFAULT 'true',
  `implemented` enum('true', 'false') NOT NULL DEFAULT 'false',
  `calculatedAt` timestamp NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Technique Effectiveness Tracking
CREATE TABLE IF NOT EXISTS `techniqueEffectiveness` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `techniqueName` varchar(255) NOT NULL,
  `techniqueCategory` varchar(100) NOT NULL,
  `totalUsage` int NOT NULL,
  `successCount` int NOT NULL,
  `successRate` int NOT NULL,
  `avgTimeToResults` int,
  `bestForIssues` text,
  `bestForDemographics` text,
  `clientFeedback` text,
  `coachNotes` text,
  `lastUpdated` timestamp NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Client Patterns (individual intelligence)
CREATE TABLE IF NOT EXISTS `clientPatterns` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `patternType` enum('trigger', 'breakthrough', 'resistance', 'engagement', 'communication_style', 'optimal_timing') NOT NULL,
  `patternName` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `frequency` int NOT NULL,
  `confidence` int NOT NULL,
  `firstDetected` timestamp NOT NULL,
  `lastOccurred` timestamp NOT NULL,
  `relatedSessions` text,
  `actionable` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE CASCADE
);

-- Client Preferences (what works for each client)
CREATE TABLE IF NOT EXISTS `clientPreferences` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `preferenceType` enum('technique', 'communication', 'timing', 'homework_format', 'session_structure') NOT NULL,
  `preferenceName` varchar(255) NOT NULL,
  `preferenceValue` text NOT NULL,
  `effectiveness` int NOT NULL,
  `timesUsed` int NOT NULL,
  `lastUsed` timestamp NOT NULL,
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE CASCADE
);

-- Client Predictions (AI predictions)
CREATE TABLE IF NOT EXISTS `clientPredictions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `clientId` int NOT NULL,
  `predictionType` enum('next_breakthrough', 'dropout_risk', 'recommended_focus', 'technique_suggestion', 'optimal_session_time') NOT NULL,
  `prediction` text NOT NULL,
  `confidence` int NOT NULL,
  `reasoning` text NOT NULL,
  `basedOnData` text,
  `validUntil` timestamp NOT NULL,
  `wasAccurate` enum('true', 'false', 'unknown') NOT NULL DEFAULT 'unknown',
  `actualOutcome` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE CASCADE
);

-- Coach Feedback (for adaptive learning)
CREATE TABLE IF NOT EXISTS `coachFeedback` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `coachId` int NOT NULL,
  `sessionId` int,
  `suggestionType` varchar(100) NOT NULL,
  `suggestionContent` text NOT NULL,
  `feedbackType` enum('helpful', 'not_helpful', 'partially_helpful', 'used', 'ignored') NOT NULL,
  `rating` int,
  `notes` text,
  `wasUsed` enum('true', 'false') NOT NULL,
  `outcome` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`coachId`) REFERENCES `coaches`(`id`),
  FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`)
);

-- Suggestion Effectiveness (track AI suggestion success)
CREATE TABLE IF NOT EXISTS `suggestionEffectiveness` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `suggestionType` varchar(100) NOT NULL,
  `totalSuggestions` int NOT NULL,
  `timesUsed` int NOT NULL,
  `timesHelpful` int NOT NULL,
  `usageRate` int NOT NULL,
  `helpfulnessRate` int NOT NULL,
  `avgRating` int,
  `bestContext` text,
  `improvements` text,
  `lastUpdated` timestamp NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
