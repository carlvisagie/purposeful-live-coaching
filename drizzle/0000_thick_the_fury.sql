CREATE TABLE IF NOT EXISTS "aiChatConversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"clientId" integer,
	"subscriptionId" integer,
	"sessionDuration" integer DEFAULT 0,
	"title" varchar(255),
	"rating" integer,
	"feedbackText" text,
	"feedbackCategory" varchar(50),
	"wasHelpful" varchar(50),
	"reviewedByAdmin" varchar(50),
	"adminNotes" text,
	"lastMessageAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aiChatMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversationId" integer NOT NULL,
	"role" varchar(50),
	"content" text NOT NULL,
	"emotionDetected" varchar(100),
	"crisisFlag" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aiInsights" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"insightDate" timestamp DEFAULT now() NOT NULL,
	"insightType" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"severity" varchar(50),
	"actionable" text,
	"isRead" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "availabilityExceptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"coachId" integer NOT NULL,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"reason" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"conversationId" integer,
	"sessionId" integer,
	"fileName" varchar(255) NOT NULL,
	"fileType" varchar(50),
	"fileCategory" varchar(50),
	"fileUrl" text NOT NULL,
	"fileKey" text NOT NULL,
	"mimeType" varchar(100),
	"fileSize" integer,
	"duration" integer,
	"transcriptionText" text,
	"transcriptionStatus" varchar(50),
	"coachNotes" text,
	"tags" text,
	"uploadedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clientPatterns" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"patternType" varchar(50),
	"patternName" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"frequency" integer NOT NULL,
	"confidence" integer NOT NULL,
	"firstDetected" timestamp NOT NULL,
	"lastOccurred" timestamp NOT NULL,
	"relatedSessions" text,
	"actionable" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clientPredictions" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"predictionType" varchar(50),
	"prediction" text NOT NULL,
	"confidence" integer NOT NULL,
	"reasoning" text NOT NULL,
	"basedOnData" text,
	"validUntil" timestamp NOT NULL,
	"wasAccurate" varchar(50),
	"actualOutcome" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clientPreferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"preferenceType" varchar(50),
	"preferenceName" varchar(255) NOT NULL,
	"preferenceValue" text NOT NULL,
	"effectiveness" integer NOT NULL,
	"timesUsed" integer NOT NULL,
	"lastUsed" timestamp NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"coachId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320),
	"phone" varchar(50),
	"dateOfBirth" timestamp,
	"goals" text,
	"notes" text,
	"status" varchar(50),
	"startDate" timestamp DEFAULT now() NOT NULL,
	"endDate" timestamp,
	"jobTitle" varchar(200),
	"company" varchar(200),
	"industry" varchar(100),
	"careerGoals" text,
	"age" integer,
	"locationCity" varchar(100),
	"locationState" varchar(100),
	"locationCountry" varchar(100),
	"relationshipStatus" varchar(50),
	"hasChildren" varchar(50),
	"primaryGoal" text,
	"goalTimeline" varchar(100),
	"motivation" text,
	"currentIdentity" text,
	"targetIdentity" text,
	"identityGap" text,
	"coreValues" text,
	"lifeMission" text,
	"procrastinationTriggers" text,
	"energyPattern" varchar(50),
	"stressResponses" text,
	"sleepHours" numeric(3, 1),
	"exerciseFrequency" varchar(50),
	"dietPattern" varchar(100),
	"mentalHealthNotes" text,
	"savingsLevel" varchar(50),
	"hasDebt" varchar(50),
	"monthlyExpensesEstimate" integer,
	"preferredContact" varchar(50),
	"bestTimeToReach" varchar(50),
	"communicationStyle" varchar(50),
	"suicideRiskLevel" varchar(20),
	"crisisFlags" text,
	"lastCrisisCheck" timestamp,
	"profileCompleteness" integer DEFAULT 0,
	"confidenceScores" text,
	"lastProfileUpdate" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coachAvailability" (
	"id" serial PRIMARY KEY NOT NULL,
	"coachId" integer NOT NULL,
	"dayOfWeek" integer NOT NULL,
	"startTime" varchar(5) NOT NULL,
	"endTime" varchar(5) NOT NULL,
	"isActive" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coachFeedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"coachId" integer NOT NULL,
	"sessionId" integer,
	"suggestionType" varchar(100) NOT NULL,
	"suggestionContent" text NOT NULL,
	"feedbackType" varchar(50),
	"rating" integer,
	"notes" text,
	"wasUsed" varchar(50),
	"outcome" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coachGuidance" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" integer NOT NULL,
	"guidanceType" varchar(50),
	"priority" varchar(50),
	"message" text NOT NULL,
	"context" text,
	"timestamp" timestamp NOT NULL,
	"wasFollowed" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coachNotifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"coachId" integer NOT NULL,
	"notificationType" varchar(50),
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"priority" varchar(50),
	"relatedId" integer,
	"isRead" varchar(50),
	"readAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coachPrivateNotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" integer NOT NULL,
	"coachId" integer NOT NULL,
	"notes" text NOT NULL,
	"aiPromptsReceived" text,
	"supervisionQuestions" text,
	"clinicalObservations" text,
	"reminders" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coaches" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"specialization" text,
	"bio" text,
	"certifications" text,
	"yearsExperience" integer,
	"isActive" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "complianceFlags" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversationId" integer NOT NULL,
	"messageId" integer NOT NULL,
	"flagType" varchar(50),
	"severity" varchar(50),
	"flaggedContent" text NOT NULL,
	"aiResponse" text,
	"reviewStatus" varchar(50),
	"reviewedBy" integer,
	"reviewNotes" text,
	"reviewedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "copingStrategies" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"strategyName" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"timesUsed" integer DEFAULT 0 NOT NULL,
	"averageEffectiveness" integer,
	"lastUsed" timestamp,
	"isRecommended" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discountCodeUsage" (
	"id" serial PRIMARY KEY NOT NULL,
	"discountCodeId" integer NOT NULL,
	"userId" integer,
	"sessionId" integer,
	"usedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discountCodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"discountPercent" integer NOT NULL,
	"discountAmount" integer,
	"maxUses" integer,
	"usedCount" integer DEFAULT 0 NOT NULL,
	"expiresAt" timestamp,
	"isActive" varchar(50),
	"createdBy" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "discountCodes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"emailType" varchar(50),
	"sentAt" timestamp DEFAULT now() NOT NULL,
	"subject" varchar(255) NOT NULL,
	"status" varchar(50),
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emotionLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"journalEntryId" integer,
	"logDate" timestamp DEFAULT now() NOT NULL,
	"emotionType" varchar(100) NOT NULL,
	"intensity" integer NOT NULL,
	"trigger" text,
	"physicalSensations" text,
	"thoughts" text,
	"behaviors" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "escalationQueue" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversationId" integer NOT NULL,
	"userId" integer NOT NULL,
	"clientId" integer,
	"escalationType" varchar(50),
	"priority" varchar(50),
	"reason" text NOT NULL,
	"context" text,
	"status" varchar(50),
	"assignedTo" integer,
	"assignedAt" timestamp,
	"resolvedAt" timestamp,
	"resolutionNotes" text,
	"notificationSent" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "human_session_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"coachId" integer NOT NULL,
	"subscriptionId" integer NOT NULL,
	"sessionDate" timestamp NOT NULL,
	"duration" integer DEFAULT 30 NOT NULL,
	"status" varchar(50),
	"zoomLink" text,
	"aiPreSessionBrief" text,
	"coachNotes" text,
	"recordingUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journalEntries" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"entryDate" timestamp DEFAULT now() NOT NULL,
	"content" text NOT NULL,
	"mood" varchar(50),
	"moodIntensity" integer,
	"emotions" text,
	"triggers" text,
	"copingStrategies" text,
	"copingEffectiveness" integer,
	"resilienceScore" integer,
	"isPrivate" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "liveSessionTranscripts" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" integer NOT NULL,
	"speaker" varchar(50),
	"text" text NOT NULL,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platformAnalytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metricType" varchar(50),
	"metricName" varchar(255) NOT NULL,
	"metricValue" text NOT NULL,
	"sampleSize" integer NOT NULL,
	"confidence" integer NOT NULL,
	"timeframe" varchar(100) NOT NULL,
	"demographics" text,
	"insights" text,
	"actionable" varchar(50),
	"implemented" varchar(50),
	"calculatedAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platformSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"aiCoachingEnabled" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessionRecordings" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" integer NOT NULL,
	"clientId" integer NOT NULL,
	"coachId" integer NOT NULL,
	"videoUrl" text,
	"videoKey" varchar(500),
	"audioUrl" text,
	"audioKey" varchar(500),
	"transcriptUrl" text,
	"transcriptKey" varchar(500),
	"duration" integer,
	"fileSize" integer,
	"status" varchar(50),
	"clientCanAccess" varchar(50),
	"consentGiven" varchar(50),
	"recordedAt" timestamp NOT NULL,
	"expiresAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessionReminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" integer NOT NULL,
	"reminderType" varchar(50),
	"sentAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessionSummaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" integer NOT NULL,
	"recordingId" integer,
	"summary" text NOT NULL,
	"goals" text,
	"homework" text,
	"keyMoments" text,
	"emotionTimeline" text,
	"techniquesUsed" text,
	"nextSteps" text,
	"clientProgress" text,
	"generatedAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessionTypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"coachId" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"duration" integer NOT NULL,
	"price" integer NOT NULL,
	"stripePriceId" varchar(255),
	"oneTimePriceId" varchar(255),
	"subscriptionPrice" integer,
	"isActive" varchar(50),
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"coachId" integer NOT NULL,
	"clientId" integer NOT NULL,
	"sessionTypeId" integer,
	"scheduledDate" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"price" integer,
	"sessionType" varchar(100),
	"notes" text,
	"status" varchar(50),
	"paymentStatus" varchar(50),
	"stripePaymentIntentId" varchar(255),
	"stripeSessionId" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "similarCases" (
	"id" serial PRIMARY KEY NOT NULL,
	"caseTitle" varchar(255) NOT NULL,
	"caseDescription" text NOT NULL,
	"clientIssues" text NOT NULL,
	"interventions" text NOT NULL,
	"outcome" text NOT NULL,
	"successRating" integer NOT NULL,
	"timeToResolution" integer,
	"coachNotes" text,
	"tags" text,
	"isPublic" varchar(50),
	"createdBy" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"stripeSubscriptionId" varchar(255),
	"stripeCustomerId" varchar(255),
	"stripePriceId" varchar(255),
	"productId" varchar(64) NOT NULL,
	"tier" varchar(50),
	"billingFrequency" varchar(50),
	"status" varchar(50),
	"currentPeriodStart" timestamp,
	"currentPeriodEnd" timestamp,
	"cancelAtPeriodEnd" varchar(50),
	"trialStart" timestamp,
	"trialEnd" timestamp,
	"cancelledAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "suggestionEffectiveness" (
	"id" serial PRIMARY KEY NOT NULL,
	"suggestionType" varchar(100) NOT NULL,
	"totalSuggestions" integer NOT NULL,
	"timesUsed" integer NOT NULL,
	"timesHelpful" integer NOT NULL,
	"usageRate" integer NOT NULL,
	"helpfulnessRate" integer NOT NULL,
	"avgRating" integer,
	"bestContext" text,
	"improvements" text,
	"lastUpdated" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "techniqueEffectiveness" (
	"id" serial PRIMARY KEY NOT NULL,
	"techniqueName" varchar(255) NOT NULL,
	"techniqueCategory" varchar(100) NOT NULL,
	"totalUsage" integer NOT NULL,
	"successCount" integer NOT NULL,
	"successRate" integer NOT NULL,
	"avgTimeToResults" integer,
	"bestForIssues" text,
	"bestForDemographics" text,
	"clientFeedback" text,
	"coachNotes" text,
	"lastUpdated" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usage_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"subscriptionId" integer NOT NULL,
	"userId" integer NOT NULL,
	"periodStart" timestamp NOT NULL,
	"periodEnd" timestamp NOT NULL,
	"aiSessionsUsed" integer DEFAULT 0 NOT NULL,
	"humanSessionsUsed" integer DEFAULT 0 NOT NULL,
	"humanSessionsIncluded" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"birthdate" date,
	"role" varchar(50),
	"primaryGoal" text,
	"secondaryGoal" text,
	"mainChallenges" text,
	"preferredFrequency" varchar(50),
	"timezone" varchar(64),
	"availability" text,
	"communicationStyle" varchar(50),
	"triggers" text,
	"profileCompleteness" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videoTestimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"quote" text NOT NULL,
	"metric" varchar(255) NOT NULL,
	"metricValue" varchar(100) NOT NULL,
	"videoUrl" text,
	"videoKey" varchar(500),
	"thumbnailUrl" text,
	"thumbnailKey" varchar(500),
	"duration" integer,
	"isPublished" varchar(50),
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dailyCheckins" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"checkinDate" timestamp DEFAULT now() NOT NULL,
	"sleptWell" varchar(50),
	"ateWell" varchar(50),
	"movedBody" varchar(50),
	"emotionalState" integer NOT NULL,
	"followedPlan" varchar(50),
	"controlledImpulses" varchar(50),
	"actedLikeTargetIdentity" varchar(50),
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "disciplineEvents" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"eventDate" timestamp DEFAULT now() NOT NULL,
	"eventType" varchar(50),
	"situation" text,
	"response" text,
	"outcome" text,
	"reinforcedIdentity" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habitCompletions" (
	"id" serial PRIMARY KEY NOT NULL,
	"habitId" integer NOT NULL,
	"completionDate" timestamp DEFAULT now() NOT NULL,
	"completed" varchar(50),
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "identityProfiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"currentIdentity" text,
	"targetIdentity" text,
	"identityGaps" text,
	"coreValues" text,
	"lifeMission" text,
	"longTermVision" text,
	"identityWins" text,
	"identityContradictions" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "microHabits" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"microHabitName" varchar(255) NOT NULL,
	"trigger" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"identityReinforcement" text,
	"isActive" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "adaptiveOutcomeTracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"baselineDate" timestamp NOT NULL,
	"baselineEmotionalState" integer NOT NULL,
	"baselineFunctioning" integer NOT NULL,
	"baselineGoals" text,
	"currentEmotionalState" integer,
	"currentFunctioning" integer,
	"goalsAchieved" text,
	"emotionalImprovement" integer,
	"functioningImprovement" integer,
	"daysInCoaching" integer,
	"sleepImproved" varchar(50),
	"relationshipsImproved" varchar(50),
	"workPerformanceImproved" varchar(50),
	"physicalHealthImproved" varchar(50),
	"attributedToCoaching" varchar(50),
	"mostHelpfulAspect" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendationFeedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" integer NOT NULL,
	"recommendationType" varchar(100) NOT NULL,
	"recommendationContent" text NOT NULL,
	"context" text,
	"wasUsed" varchar(50),
	"wasHelpful" varchar(50),
	"rating" integer,
	"feedbackNotes" text,
	"problemResolved" varchar(50),
	"timeToResolution" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strategyAdjustments" (
	"id" serial PRIMARY KEY NOT NULL,
	"adjustmentType" varchar(100) NOT NULL,
	"adjustmentDescription" text NOT NULL,
	"triggeringData" text,
	"expectedImprovement" text,
	"implementedAt" timestamp DEFAULT now() NOT NULL,
	"isActive" varchar(50),
	"measuredImprovement" text,
	"wasSuccessful" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trendDetection" (
	"id" serial PRIMARY KEY NOT NULL,
	"trendName" varchar(255) NOT NULL,
	"trendDescription" text NOT NULL,
	"trendCategory" varchar(100) NOT NULL,
	"affectedPercentage" integer NOT NULL,
	"totalClientsAnalyzed" integer NOT NULL,
	"affectedClientCount" integer NOT NULL,
	"suggestedContent" text,
	"suggestedApproach" text,
	"isActive" varchar(50),
	"isAddressed" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "autismOutcomeTracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"assessmentDate" timestamp NOT NULL,
	"atecScore" integer,
	"carsScore" integer,
	"communicationLevel" varchar(50),
	"behaviorScore" integer,
	"adaptiveFunctionScore" integer,
	"giSymptomScore" integer,
	"sleepScore" integer,
	"familyQOL" integer,
	"parentStress" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "autismPatternDetection" (
	"id" serial PRIMARY KEY NOT NULL,
	"childProfile" text NOT NULL,
	"interventionCombination" text NOT NULL,
	"outcomeData" text NOT NULL,
	"patternType" varchar(50),
	"confidence" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "autismProfiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"childName" varchar(255) NOT NULL,
	"dateOfBirth" timestamp NOT NULL,
	"diagnosisDate" timestamp,
	"severity" varchar(50),
	"atecScore" integer,
	"carsScore" integer,
	"communicationLevel" varchar(50),
	"giSymptoms" text,
	"sleepIssues" text,
	"sensoryProfile" text,
	"behaviorChallenges" text,
	"familyResources" text,
	"treatmentPriorities" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "autismProviders" (
	"id" serial PRIMARY KEY NOT NULL,
	"providerType" varchar(50),
	"name" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"phone" varchar(50),
	"email" varchar(320),
	"website" varchar(500),
	"rating" integer,
	"reviewCount" integer,
	"acceptsInsurance" varchar(50),
	"costRange" varchar(100),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dietaryInterventions" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"dietType" varchar(50),
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"adherence" integer,
	"giSymptomChanges" text,
	"behaviorChanges" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interventionPlans" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"tier1Interventions" text NOT NULL,
	"tier2Interventions" text,
	"tier3Interventions" text,
	"tier4Interventions" text,
	"currentPhase" varchar(50),
	"startDate" timestamp NOT NULL,
	"providerDirectory" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplementTracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"supplementName" varchar(255) NOT NULL,
	"dosage" varchar(255) NOT NULL,
	"frequency" varchar(50),
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"adherence" integer,
	"sideEffects" text,
	"perceivedBenefit" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "therapySessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"therapyType" varchar(50),
	"sessionDate" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"goalsAddressed" text,
	"progress" text,
	"parentFeedback" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "act_practices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"act_process" varchar(50),
	"technique" varchar(255),
	"situation" text,
	"difficult_thought" text,
	"difficult_emotion" varchar(100),
	"acceptance_level" integer,
	"defusion_level" integer,
	"value_identified" varchar(255),
	"action_taken" text,
	"psychological_flexibility" integer,
	"effectiveness" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dbt_skills_practice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"dbt_module" varchar(50),
	"skill_used" varchar(50) NOT NULL,
	"situation" text,
	"emotion_before" varchar(100),
	"intensity_before" integer,
	"how_used" text,
	"emotion_after" varchar(100),
	"intensity_after" integer,
	"effectiveness" integer,
	"would_use_again" boolean,
	"challenges" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emotion_entries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"entry_date" timestamp NOT NULL,
	"primary_emotion" varchar(100) NOT NULL,
	"secondary_emotions" text,
	"intensity" integer,
	"valence" integer,
	"arousal" integer,
	"trigger" text,
	"situation" text,
	"thoughts" text,
	"physical_sensations" text,
	"urge" text,
	"actual_behavior" text,
	"duration_minutes" integer,
	"regulation_used" boolean,
	"regulation_strategy" varchar(255),
	"regulation_effectiveness" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emotion_regulation_strategies" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"use_date" timestamp NOT NULL,
	"strategy_type" varchar(50) NOT NULL,
	"emotion" varchar(100) NOT NULL,
	"intensity_before" integer,
	"trigger" text,
	"what_you_did" text,
	"duration" integer,
	"intensity_after" integer,
	"emotion_changed" boolean,
	"new_emotion" varchar(100),
	"immediate_effectiveness" integer,
	"long_term_helpful" boolean,
	"side_effects" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emotional_engine_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"strategy_type" varchar(100) NOT NULL,
	"emotion_type" varchar(100) NOT NULL,
	"avg_intensity_reduction" numeric(5, 2),
	"avg_effectiveness_rating" numeric(5, 2),
	"success_rate" numeric(5, 2),
	"optimal_duration" integer,
	"most_effective_for" text,
	"use_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emotional_processing" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"processing_date" timestamp NOT NULL,
	"emotion_to_process" varchar(100) NOT NULL,
	"related_event" text,
	"processing_method" varchar(50),
	"what_came_up" text,
	"physical_sensations" text,
	"processing_depth" varchar(50),
	"feeling_after" varchar(100),
	"resolution_level" integer,
	"insights" text,
	"action_steps" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emotional_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"baseline_emotional_state" varchar(100),
	"emotional_range" varchar(50),
	"emotional_intensity" varchar(50),
	"regulation_skill_level" integer,
	"awareness_level" integer,
	"primary_challenges" text,
	"primary_goal" varchar(50),
	"common_triggers" text,
	"common_emotions" text,
	"emotional_cycles" text,
	"most_effective_strategies" text,
	"least_effective_strategies" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emotional_wins" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"win_date" timestamp NOT NULL,
	"win_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"significance" text,
	"how_you_grew" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resilience_activities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"activity_date" timestamp NOT NULL,
	"activity_type" varchar(50),
	"activity" varchar(255) NOT NULL,
	"description" text,
	"duration" integer,
	"resilience_impact" integer,
	"emotional_impact" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brain_training_exercises" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"exercise_date" timestamp NOT NULL,
	"exercise_type" varchar(50),
	"exercise_name" varchar(255),
	"score" integer,
	"accuracy" integer,
	"speed" integer,
	"difficulty_level" integer,
	"duration" integer,
	"personal_best" boolean,
	"improvement_from_last" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cognitive_performance" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"assessment_date" timestamp NOT NULL,
	"mental_clarity" integer,
	"focus_ability" integer,
	"memory_sharpness" integer,
	"processing_speed" integer,
	"decision_quality" integer,
	"creativity" integer,
	"brain_fog" integer,
	"mental_fatigue" integer,
	"sleep_quality" integer,
	"sleep_hours" numeric(3, 1),
	"exercise_today" boolean,
	"stress_level" integer,
	"hydration" varchar(50),
	"nutrition" varchar(50),
	"caffeine_intake" integer,
	"alcohol_yesterday" boolean,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "focus_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_date" timestamp NOT NULL,
	"session_type" varchar(50),
	"task" varchar(255) NOT NULL,
	"task_type" varchar(50),
	"planned_duration" integer,
	"actual_duration" integer,
	"location" varchar(255),
	"noise_level" varchar(50),
	"used_noise_blocking" boolean,
	"energy_before" integer,
	"focus_before" integer,
	"stress_before" integer,
	"focus_quality" integer,
	"flow_state" boolean,
	"distraction_count" integer,
	"distraction_types" text,
	"energy_after" integer,
	"focus_after" integer,
	"satisfaction_level" integer,
	"productivity_rating" integer,
	"output_quality" integer,
	"what_helped" text,
	"what_hindered" text,
	"effectiveness" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_date" timestamp NOT NULL,
	"topic" varchar(255) NOT NULL,
	"subject" varchar(255),
	"learning_method" varchar(50),
	"duration" integer,
	"engagement_level" integer,
	"comprehension_level" integer,
	"techniques_used" text,
	"notes_created" boolean,
	"practice_completed" boolean,
	"taught_to_someone" boolean,
	"immediate_recall" integer,
	"will_review" boolean,
	"next_review_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_practices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"practice_type" varchar(50),
	"content_type" varchar(50),
	"topic" varchar(255),
	"duration" integer,
	"items_reviewed" integer,
	"items_recalled" integer,
	"recall_accuracy" integer,
	"confidence_level" integer,
	"difficulty" varchar(50),
	"next_review_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mental_breaks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"break_date" timestamp NOT NULL,
	"break_type" varchar(50),
	"duration" integer,
	"activity" varchar(255),
	"mental_fatigue_before" integer,
	"mental_fatigue_after" integer,
	"restoration_level" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mental_engine_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"technique_type" varchar(100) NOT NULL,
	"avg_focus_improvement" numeric(5, 2),
	"avg_productivity_score" numeric(5, 2),
	"avg_flow_state_rate" numeric(5, 2),
	"optimal_duration" integer,
	"optimal_time_of_day" varchar(50),
	"optimal_break_frequency" integer,
	"most_effective_for" text,
	"session_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mental_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"mental_clarity" integer,
	"focus_ability" integer,
	"memory_quality" integer,
	"cognitive_energy" integer,
	"primary_challenges" text,
	"primary_goal" varchar(50),
	"learning_style" text,
	"best_learning_time" varchar(50),
	"sleep_quality" integer,
	"exercise_frequency" varchar(50),
	"screen_time_hours" integer,
	"cognitive_supplements" text,
	"medications" text,
	"peak_focus_hours" text,
	"optimal_work_duration" integer,
	"most_effective_techniques" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reading_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_date" timestamp NOT NULL,
	"content_type" varchar(50),
	"title" varchar(255),
	"author" varchar(255),
	"pages_read" integer,
	"duration" integer,
	"words_per_minute" integer,
	"comprehension_level" integer,
	"retention_level" integer,
	"active_reading" boolean,
	"speed_reading" boolean,
	"skimming" boolean,
	"notes_taken" boolean,
	"summary_written" boolean,
	"value_rating" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "body_measurements" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"measurement_date" timestamp NOT NULL,
	"weight" numeric(5, 2),
	"body_fat_percentage" numeric(4, 1),
	"muscle_mass" numeric(5, 2),
	"neck" numeric(4, 1),
	"chest" numeric(4, 1),
	"waist" numeric(4, 1),
	"hips" numeric(4, 1),
	"bicep_left" numeric(4, 1),
	"bicep_right" numeric(4, 1),
	"thigh_left" numeric(4, 1),
	"thigh_right" numeric(4, 1),
	"calf_left" numeric(4, 1),
	"calf_right" numeric(4, 1),
	"front_photo" varchar(255),
	"side_photo" varchar(255),
	"back_photo" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cardio_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"workout_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_date" timestamp NOT NULL,
	"activity_type" varchar(50),
	"duration" integer,
	"distance" numeric(6, 2),
	"avg_heart_rate" integer,
	"max_heart_rate" integer,
	"heart_rate_zones" text,
	"avg_pace" varchar(50),
	"avg_speed" numeric(5, 2),
	"elevation_gain" integer,
	"calories_burned" integer,
	"performance_rating" integer,
	"recovery_heart_rate" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercises" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"workout_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"exercise_name" varchar(255) NOT NULL,
	"exercise_type" varchar(50),
	"muscle_group" varchar(255),
	"sets" integer,
	"reps" text,
	"weight" text,
	"rest_between_sets" integer,
	"tempo" varchar(50),
	"range_of_motion" varchar(50),
	"form_quality" integer,
	"difficulty" integer,
	"progression_from_last" varchar(255),
	"pain_during" boolean,
	"pain_location" varchar(255),
	"pain_level" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mobility_work" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_date" timestamp NOT NULL,
	"session_type" varchar(50),
	"areas_worked" text,
	"duration" integer,
	"range_of_motion_before" integer,
	"range_of_motion_after" integer,
	"pain_before" integer,
	"pain_after" integer,
	"techniques_used" text,
	"effectiveness" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "physical_engine_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"workout_type" varchar(100) NOT NULL,
	"avg_recovery_score" numeric(5, 2),
	"avg_progression_rate" numeric(5, 2),
	"injury_rate" numeric(5, 2),
	"optimal_frequency" integer,
	"optimal_duration" integer,
	"optimal_intensity" varchar(50),
	"avg_recovery_time" integer,
	"most_effective_for" text,
	"workout_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "physical_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"fitness_level" varchar(50),
	"height" integer,
	"weight" numeric(5, 2),
	"body_fat_percentage" numeric(4, 1),
	"primary_goal" varchar(50),
	"specific_goals" text,
	"injuries" text,
	"injury_history" text,
	"limitations" text,
	"experience_level" text,
	"preferred_exercise_types" text,
	"available_equipment" text,
	"time_available" integer,
	"optimal_training_frequency" integer,
	"optimal_session_duration" integer,
	"best_recovery_strategies" text,
	"injury_risk_factors" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recovery_tracking" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"tracking_date" timestamp NOT NULL,
	"recovery_score" integer,
	"resting_heart_rate" integer,
	"hrv" integer,
	"sleep_quality" integer,
	"sleep_hours" numeric(3, 1),
	"overall_soreness" integer,
	"sore_areas" text,
	"energy_level" integer,
	"readiness_to_train" integer,
	"stress_level" integer,
	"recovery_strategies" text,
	"recommended_action" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "strength_benchmarks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"test_date" timestamp NOT NULL,
	"exercise" varchar(255) NOT NULL,
	"test_type" varchar(50),
	"weight" numeric(6, 2),
	"reps" integer,
	"duration" integer,
	"bodyweight_ratio" numeric(4, 2),
	"improvement_from_last" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workouts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"workout_date" timestamp NOT NULL,
	"workout_type" varchar(50),
	"primary_focus" varchar(50),
	"duration" integer,
	"intensity" varchar(50),
	"perceived_exertion" integer,
	"energy_before" integer,
	"soreness_before" integer,
	"motivation_before" integer,
	"performance_rating" integer,
	"personal_records" text,
	"energy_after" integer,
	"soreness_after" integer,
	"satisfaction_level" integer,
	"location" varchar(255),
	"temperature" integer,
	"notes" text,
	"completed" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_nutrition_summary" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"summary_date" timestamp NOT NULL,
	"total_calories" integer,
	"total_protein" numeric(6, 1),
	"total_carbs" numeric(6, 1),
	"total_fat" numeric(6, 1),
	"total_fiber" numeric(5, 1),
	"water_intake" numeric(4, 1),
	"calorie_adherence" integer,
	"protein_adherence" integer,
	"vegetable_servings" integer,
	"fruit_servings" integer,
	"processed_food_servings" integer,
	"nutrition_quality" integer,
	"adherence_rating" integer,
	"avg_energy_level" integer,
	"sleep_quality" integer,
	"workout_performance" integer,
	"bowel_movements" integer,
	"digestive_comfort" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "food_reactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"reaction_date" timestamp NOT NULL,
	"suspected_food" varchar(255) NOT NULL,
	"reaction_type" varchar(50),
	"symptoms" text,
	"severity" varchar(50),
	"onset_time" integer,
	"duration" integer,
	"consistent_reaction" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hydration_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"log_date" timestamp NOT NULL,
	"water_intake" numeric(4, 2),
	"coffee" integer,
	"tea" integer,
	"alcohol" integer,
	"urine_color" varchar(50),
	"headache" boolean,
	"fatigue" boolean,
	"dry_mouth" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meal_plans" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"plan_name" varchar(255) NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"meals" text,
	"shopping_list" text,
	"prep_notes" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"meal_date" timestamp NOT NULL,
	"meal_type" varchar(50),
	"foods" text,
	"total_calories" integer,
	"total_protein" numeric(5, 1),
	"total_carbs" numeric(5, 1),
	"total_fat" numeric(5, 1),
	"total_fiber" numeric(5, 1),
	"total_sugar" numeric(5, 1),
	"location" varchar(255),
	"social_context" varchar(50),
	"eating_speed" varchar(50),
	"mindful_eating" boolean,
	"distractions" text,
	"hunger_before" integer,
	"hunger_after" integer,
	"satisfaction_level" integer,
	"emotion_before" varchar(100),
	"emotional_eating" boolean,
	"energy_after" integer,
	"digestion_quality" integer,
	"bloating" integer,
	"meal_photo" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrition_engine_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"food_category" varchar(100) NOT NULL,
	"avg_energy_impact" numeric(5, 2),
	"avg_digestive_impact" numeric(5, 2),
	"avg_workout_impact" numeric(5, 2),
	"optimal_meal_timing" varchar(100),
	"most_beneficial_for" text,
	"meal_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrition_experiments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"experiment_name" varchar(255) NOT NULL,
	"experiment_type" varchar(50),
	"hypothesis" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"protocol" text,
	"baseline_weight" numeric(5, 2),
	"baseline_energy" integer,
	"baseline_digestion" integer,
	"end_weight" numeric(5, 2),
	"end_energy" integer,
	"end_digestion" integer,
	"findings" text,
	"conclusion" text,
	"will_continue" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nutrition_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"current_weight" numeric(5, 2),
	"target_weight" numeric(5, 2),
	"height" integer,
	"primary_goal" varchar(50),
	"dietary_approach" varchar(50),
	"allergies" text,
	"intolerances" text,
	"restrictions" text,
	"health_conditions" text,
	"medications" text,
	"target_calories" integer,
	"target_protein" integer,
	"target_carbs" integer,
	"target_fat" integer,
	"target_fiber" integer,
	"meals_per_day" integer,
	"fasting_window" integer,
	"eating_window" integer,
	"optimal_macro_ratio" text,
	"energy_optimal_foods" text,
	"trigger_foods" text,
	"best_meal_timing" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplement_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"supplement_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"log_date" timestamp NOT NULL,
	"taken" boolean DEFAULT true,
	"dosage" varchar(255),
	"timing" varchar(100),
	"with_food" boolean,
	"perceived_effect" integer,
	"side_effects" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplements" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"supplement_name" varchar(255) NOT NULL,
	"brand" varchar(255),
	"purpose" varchar(50),
	"dosage" varchar(255),
	"unit" varchar(50),
	"frequency" varchar(50),
	"timing" varchar(50),
	"active" boolean DEFAULT true,
	"start_date" timestamp,
	"end_date" timestamp,
	"perceived_effectiveness" integer,
	"side_effects" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compassion_practices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"practice_type" varchar(50),
	"duration" integer,
	"target" varchar(255),
	"emotion_before" varchar(255),
	"emotion_after" varchar(255),
	"warmth_level" integer,
	"resistance_level" integer,
	"insights" text,
	"action_taken" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gratitude_entries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"entry_date" timestamp NOT NULL,
	"gratitude_1" text NOT NULL,
	"gratitude_2" text,
	"gratitude_3" text,
	"gratitude_4" text,
	"gratitude_5" text,
	"gratitude_depth" varchar(50),
	"emotional_impact" integer,
	"savoring_time" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meditation_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_date" timestamp NOT NULL,
	"practice_type" varchar(50),
	"guided_or_silent" varchar(50),
	"guide_source" varchar(255),
	"planned_duration" integer,
	"actual_duration" integer,
	"focus_level" integer,
	"distraction_level" integer,
	"peace_level" integer,
	"insight_level" integer,
	"emotion_before" varchar(255),
	"stress_level_before" integer,
	"emotion_after" varchar(255),
	"stress_level_after" integer,
	"experiences" text,
	"insights" text,
	"challenges" text,
	"completed" boolean DEFAULT true,
	"effectiveness" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mindfulness_practices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"practice_type" varchar(50),
	"duration" integer,
	"activity" varchar(255),
	"location" varchar(255),
	"presence_level" integer,
	"awareness_level" integer,
	"what_you_noticed" text,
	"how_it_felt" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purpose_explorations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"exploration_date" timestamp NOT NULL,
	"exploration_type" varchar(50),
	"prompt" text,
	"reflection" text NOT NULL,
	"insights" text,
	"patterns" text,
	"passions" text,
	"strengths" text,
	"values" text,
	"contribution" text,
	"clarity_level" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spiritual_engine_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"practice_type" varchar(100) NOT NULL,
	"avg_stress_reduction" numeric(5, 2),
	"avg_peace_increase" numeric(5, 2),
	"avg_completion_rate" numeric(5, 2),
	"optimal_duration" integer,
	"optimal_time_of_day" varchar(50),
	"most_effective_for" text,
	"session_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spiritual_experiences" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"experience_date" timestamp NOT NULL,
	"experience_type" varchar(50),
	"context" text,
	"trigger" varchar(255),
	"description" text NOT NULL,
	"intensity" integer,
	"duration" integer,
	"emotional_impact" integer,
	"meaningfulness" integer,
	"life_changing" boolean DEFAULT false,
	"insights" text,
	"how_it_changed_you" text,
	"actions_taken" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spiritual_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"achieved_date" timestamp,
	"significance" text,
	"how_you_grew" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spiritual_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"spiritual_background" varchar(50),
	"religious_tradition" varchar(255),
	"has_meditation_practice" boolean DEFAULT false,
	"meditation_experience" varchar(50),
	"current_practices" text,
	"primary_goal" varchar(50),
	"specific_goals" text,
	"barriers" text,
	"preferred_practice_time" varchar(50),
	"preferred_duration" integer,
	"preferred_style" text,
	"most_effective_practices" text,
	"optimal_practice_time" integer,
	"best_time_of_day" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_actions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"admin_user_id" varchar(255) NOT NULL,
	"action_type" varchar(100) NOT NULL,
	"action_category" varchar(50),
	"target_type" varchar(100),
	"target_id" varchar(255),
	"description" text,
	"changes" text,
	"ip_address" varchar(50),
	"action_timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_notifications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"notification_type" varchar(50),
	"title" varchar(500) NOT NULL,
	"message" text,
	"action_url" varchar(500),
	"priority" varchar(50),
	"read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" varchar(50),
	"permissions" text,
	"active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "article_feedback" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"article_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"helpful" boolean NOT NULL,
	"feedback" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bug_reports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"steps_to_reproduce" text,
	"expected_behavior" text,
	"actual_behavior" text,
	"severity" varchar(50),
	"browser" varchar(100),
	"os" varchar(100),
	"device_type" varchar(100),
	"screenshots" text,
	"logs" text,
	"status" varchar(50),
	"assigned_to" varchar(255),
	"fixed_in" varchar(100),
	"fixed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feature_flags" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"flag_name" varchar(255) NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT false,
	"rollout_percentage" integer DEFAULT 0,
	"target_user_ids" text,
	"target_roles" text,
	"environments" text,
	"last_modified_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "feature_flags_flag_name_unique" UNIQUE("flag_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "knowledge_base_articles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"category" varchar(100),
	"tags" text,
	"slug" varchar(500) NOT NULL,
	"meta_description" text,
	"status" varchar(50),
	"author_id" varchar(255),
	"public" boolean DEFAULT true,
	"helpful_count" integer DEFAULT 0,
	"not_helpful_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "knowledge_base_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platform_metrics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"metric_date" timestamp NOT NULL,
	"total_users" integer,
	"active_users" integer,
	"new_users" integer,
	"churned_users" integer,
	"avg_session_duration" numeric(10, 2),
	"avg_daily_active_users" integer,
	"avg_weekly_active_users" integer,
	"avg_monthly_active_users" integer,
	"total_goals" integer,
	"total_habits" integer,
	"total_journal_entries" integer,
	"open_tickets" integer,
	"avg_ticket_resolution_time" numeric(10, 2),
	"avg_satisfaction_rating" numeric(4, 2),
	"api_requests" integer,
	"avg_response_time" numeric(8, 2),
	"error_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "support_tickets" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"ticket_number" varchar(50) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"description" text,
	"category" varchar(50),
	"priority" varchar(50),
	"status" varchar(50),
	"assigned_to" varchar(255),
	"assigned_at" timestamp,
	"resolved_by" varchar(255),
	"resolved_at" timestamp,
	"resolution_notes" text,
	"satisfaction_rating" integer,
	"satisfaction_feedback" text,
	"first_response_at" timestamp,
	"first_response_sla" integer,
	"resolution_sla" integer,
	"sla_breached" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"closed_at" timestamp,
	CONSTRAINT "support_tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "system_announcements" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"message" text NOT NULL,
	"announcement_type" varchar(50),
	"severity" varchar(50),
	"target_audience" varchar(50),
	"target_user_ids" text,
	"display_location" text,
	"dismissible" boolean DEFAULT true,
	"start_date" timestamp,
	"end_date" timestamp,
	"active" boolean DEFAULT true,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ticket_messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"ticket_id" varchar(255) NOT NULL,
	"sender_id" varchar(255) NOT NULL,
	"sender_type" varchar(50),
	"message" text NOT NULL,
	"attachments" text,
	"internal_note" boolean DEFAULT false,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_feedback" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"feedback_type" varchar(50),
	"title" varchar(500),
	"description" text NOT NULL,
	"page" varchar(255),
	"feature" varchar(255),
	"attachments" text,
	"status" varchar(50),
	"upvotes" integer DEFAULT 0,
	"admin_response" text,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_reports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"reported_by" varchar(255) NOT NULL,
	"reported_type" varchar(50),
	"reported_id" varchar(255) NOT NULL,
	"reason" varchar(50),
	"description" text,
	"status" varchar(50),
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp,
	"review_notes" text,
	"action_taken" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_coach_feedback" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"conversation_id" varchar(255),
	"message_id" varchar(255),
	"feedback_type" varchar(50),
	"feedback_text" text,
	"rating" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_coach_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"preferred_coaching_style" varchar(50),
	"preferred_tone" varchar(50),
	"verbosity" varchar(50),
	"proactive_checkins" boolean DEFAULT true,
	"daily_check_in" boolean DEFAULT false,
	"weekly_review" boolean DEFAULT true,
	"data_sharing" boolean DEFAULT true,
	"effective_question_types" text,
	"effective_intervention_types" text,
	"optimal_check_in_timing" text,
	"trust_level" integer,
	"satisfaction_level" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_recommendations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"recommendation_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"reasoning" text,
	"supporting_data" text,
	"confidence" numeric(5, 2),
	"priority" varchar(50),
	"status" varchar(50),
	"user_feedback" text,
	"helpfulness_rating" integer,
	"implemented" boolean DEFAULT false,
	"implemented_at" timestamp,
	"outcome_positive" boolean,
	"created_at" timestamp DEFAULT now(),
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coaching_conversations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"conversation_title" varchar(255),
	"conversation_type" varchar(50),
	"status" varchar(50),
	"insights_generated" integer DEFAULT 0,
	"actions_identified" integer DEFAULT 0,
	"helpfulness_rating" integer,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coaching_effectiveness" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"element_type" varchar(100) NOT NULL,
	"element_value" varchar(255) NOT NULL,
	"avg_engagement_rate" numeric(5, 2),
	"avg_insight_rate" numeric(5, 2),
	"avg_action_rate" numeric(5, 2),
	"avg_helpfulness_rating" numeric(4, 2),
	"avg_behavior_change" numeric(5, 2),
	"optimal_context" text,
	"optimal_user_type" text,
	"user_count" integer,
	"total_uses" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coaching_goals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255),
	"goal_id" varchar(255),
	"user_id" varchar(255) NOT NULL,
	"initial_clarity" integer,
	"final_clarity" integer,
	"ai_contribution" text,
	"obstacles_identified" text,
	"strategies_developed" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coaching_insights" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"insight_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"evidence" text,
	"actionable" boolean DEFAULT false,
	"suggested_action" text,
	"viewed" boolean DEFAULT false,
	"viewed_at" timestamp,
	"resonated" boolean,
	"action_taken" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coaching_questions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"question_text" text NOT NULL,
	"question_type" varchar(50),
	"category" varchar(100),
	"best_for" text,
	"research_backed" boolean DEFAULT false,
	"research_source" text,
	"avg_insight_rate" numeric(5, 2),
	"avg_action_rate" numeric(5, 2),
	"avg_helpfulness_rating" numeric(4, 2),
	"total_uses" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coaching_resources" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"resource_name" varchar(255) NOT NULL,
	"description" text,
	"resource_type" varchar(50),
	"url" varchar(500),
	"category" varchar(100),
	"research_backed" boolean DEFAULT false,
	"recommend_for" text,
	"avg_helpfulness_rating" numeric(4, 2),
	"total_recommendations" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversation_messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"sender" varchar(50),
	"message_text" text NOT NULL,
	"message_type" varchar(50),
	"coaching_technique" varchar(50),
	"context_data" text,
	"user_engaged" boolean,
	"user_insight" boolean,
	"user_action" boolean,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "proactive_check_ins" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"check_in_type" varchar(50),
	"trigger_type" varchar(50),
	"message" text,
	"responded" boolean DEFAULT false,
	"responded_at" timestamp,
	"response_quality" varchar(50),
	"helpful" boolean,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_resource_interactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"resource_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"viewed" boolean DEFAULT false,
	"viewed_at" timestamp,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"helpful" boolean,
	"helpfulness_rating" integer,
	"action_taken" boolean DEFAULT false,
	"impact_description" text,
	"recommended_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_events" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_data" text,
	"session_id" varchar(255),
	"event_timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_learning" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"insight_type" varchar(100) NOT NULL,
	"avg_view_rate" numeric(5, 2),
	"avg_action_rate" numeric(5, 2),
	"avg_helpfulness_rating" numeric(4, 2),
	"avg_behavior_change" numeric(5, 2),
	"optimal_timing" varchar(100),
	"optimal_frequency" varchar(100),
	"most_effective_for" text,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"preferred_view" varchar(50),
	"preferred_chart_type" varchar(50),
	"tracking_frequency" varchar(50),
	"insight_frequency" varchar(50),
	"insight_types" text,
	"most_actionable_insights" text,
	"preferred_metrics" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comparative_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"comparison_type" varchar(50),
	"metric" varchar(255) NOT NULL,
	"current_value" numeric(10, 2),
	"comparison_value" numeric(10, 2),
	"absolute_change" numeric(10, 2),
	"percent_change" numeric(6, 2),
	"trend" varchar(50),
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "correlations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"variable1" varchar(255) NOT NULL,
	"variable2" varchar(255) NOT NULL,
	"correlation_coefficient" numeric(4, 3),
	"p_value" numeric(6, 5),
	"relationship" varchar(50),
	"insight" text,
	"actionable" boolean DEFAULT false,
	"data_points" integer,
	"confidence_level" numeric(5, 2),
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_snapshots" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"snapshot_date" timestamp NOT NULL,
	"overall_wellness_score" integer,
	"physical_score" integer,
	"mental_score" integer,
	"emotional_score" integer,
	"spiritual_score" integer,
	"habits_completed" integer,
	"habits_total" integer,
	"habit_completion_rate" numeric(5, 2),
	"sleep_duration" numeric(4, 2),
	"sleep_quality" integer,
	"avg_mood" integer,
	"avg_energy" integer,
	"productivity_score" integer,
	"stress_level" integer,
	"recovery_score" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insights" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"insight_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"supporting_data" text,
	"actionable" boolean DEFAULT false,
	"suggested_action" text,
	"priority" varchar(50),
	"viewed" boolean DEFAULT false,
	"viewed_at" timestamp,
	"action_taken" boolean DEFAULT false,
	"action_taken_at" timestamp,
	"helpful" boolean,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monthly_reports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"month_start_date" timestamp NOT NULL,
	"transformation_score" integer,
	"habits_started" integer,
	"habits_mastered" integer,
	"habits_abandoned" integer,
	"avg_habit_success_rate" numeric(5, 2),
	"goals_set" integer,
	"goals_achieved" integer,
	"goal_achievement_rate" numeric(5, 2),
	"physical_trend" varchar(50),
	"mental_trend" varchar(50),
	"emotional_trend" varchar(50),
	"spiritual_trend" varchar(50),
	"community_engagement" integer,
	"supports_given" integer,
	"supports_received" integer,
	"achievements_unlocked" integer,
	"milestones_reached" integer,
	"identity_shift_score" integer,
	"month_summary" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "predictions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"prediction_type" varchar(50),
	"target_id" varchar(255),
	"target_name" varchar(255),
	"prediction" text,
	"confidence" numeric(5, 2),
	"timeframe" varchar(100),
	"key_factors" text,
	"recommendation" text,
	"actual_outcome" text,
	"prediction_accurate" boolean,
	"created_at" timestamp DEFAULT now(),
	"validated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "progress_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"metric" varchar(255),
	"baseline_value" numeric(10, 2),
	"current_value" numeric(10, 2),
	"improvement_percent" numeric(6, 2),
	"related_to" varchar(255),
	"achieved_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weekly_reports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"week_start_date" timestamp NOT NULL,
	"overall_score" integer,
	"score_change" numeric(6, 2),
	"avg_habit_completion_rate" numeric(5, 2),
	"habits_completion_change" numeric(6, 2),
	"avg_sleep_duration" numeric(4, 2),
	"avg_sleep_quality" numeric(4, 2),
	"sleep_consistency" numeric(5, 2),
	"avg_mood" numeric(4, 2),
	"avg_energy" numeric(4, 2),
	"mood_stability" numeric(5, 2),
	"goals_achieved" integer,
	"goals_in_progress" integer,
	"biggest_wins" text,
	"biggest_challenges" text,
	"key_insights" text,
	"recommendations" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_safety_rules" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"rule_name" varchar(255) NOT NULL,
	"rule_type" varchar(50),
	"system_prompt_addition" text,
	"validation_logic" text,
	"applies_to" varchar(50),
	"priority" integer DEFAULT 100,
	"active" boolean DEFAULT true,
	"violations_prevented" integer DEFAULT 0,
	"effectiveness" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brand_safety_keywords" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"keyword" varchar(500) NOT NULL,
	"keyword_type" varchar(50),
	"risk_level" varchar(50),
	"alert_team" boolean DEFAULT false,
	"escalate_to_human" boolean DEFAULT false,
	"context" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compliance_checkpoints" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"checkpoint_name" varchar(255) NOT NULL,
	"compliance_framework" varchar(50),
	"requirement" text NOT NULL,
	"validation_criteria" text,
	"mandatory" boolean DEFAULT true,
	"violation_severity" varchar(50),
	"violation_action" text,
	"legal_reference" text,
	"documentation_required" text,
	"last_audit_date" timestamp,
	"next_audit_date" timestamp,
	"audit_frequency" varchar(50),
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content_moderation_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"original_content" text NOT NULL,
	"content_hash" varchar(255),
	"detected_violations" text,
	"matched_rules" text,
	"risk_score" integer,
	"risk_category" varchar(100),
	"severity_level" varchar(50),
	"action_taken" varchar(50),
	"user_response" text,
	"conversation_context" text,
	"user_intent" text,
	"requires_human_review" boolean DEFAULT false,
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp,
	"review_decision" varchar(50),
	"review_notes" text,
	"feedback_provided" boolean DEFAULT false,
	"improved_accuracy" boolean DEFAULT false,
	"detected_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "crisis_intervention_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"crisis_type" varchar(50),
	"detected_content" text,
	"crisis_indicators" text,
	"risk_level" varchar(50),
	"response_provided" text,
	"resources_offered" text,
	"escalated" boolean DEFAULT false,
	"escalated_to" varchar(255),
	"escalated_at" timestamp,
	"follow_up_required" boolean DEFAULT true,
	"follow_up_completed" boolean DEFAULT false,
	"follow_up_notes" text,
	"outcome" varchar(50),
	"detected_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "forbidden_content_dictionary" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"content_type" varchar(50),
	"content" text NOT NULL,
	"pattern" text,
	"risk_category" varchar(50),
	"severity_level" varchar(50),
	"action" varchar(50),
	"source" varchar(50),
	"detection_count" integer DEFAULT 0,
	"false_positive_count" integer DEFAULT 0,
	"true_positive_count" integer DEFAULT 0,
	"accuracy" numeric(5, 2),
	"active" boolean DEFAULT true,
	"description" text,
	"legal_basis" text,
	"redirect_message" text,
	"version" integer DEFAULT 1,
	"replaced_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pattern_learning" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"pattern_type" varchar(50),
	"pattern_signature" text,
	"detection_algorithm" text,
	"occurrences" integer DEFAULT 0,
	"accuracy" numeric(5, 2),
	"confidence" numeric(5, 2),
	"learned_from" text,
	"improved_by" text,
	"validated" boolean DEFAULT false,
	"active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professional_boundary_violations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"violation_type" varchar(50),
	"conversation_id" varchar(255),
	"user_id" varchar(255),
	"coach_id" varchar(255),
	"violating_content" text,
	"context" text,
	"detected_by" varchar(50),
	"severity" varchar(50),
	"correction_provided" text,
	"education_provided" text,
	"coach_notified" boolean DEFAULT false,
	"training_required" boolean DEFAULT false,
	"detected_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "safety_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"total_interactions" integer,
	"violations_detected" integer,
	"violation_rate" numeric(5, 2),
	"legal_violations" integer,
	"ethical_violations" integer,
	"brand_safety_issues" integer,
	"crisis_interventions" integer,
	"content_blocked" integer,
	"content_flagged" integer,
	"users_escalated" integer,
	"false_positive_rate" numeric(5, 2),
	"false_negative_rate" numeric(5, 2),
	"new_patterns_detected" integer,
	"rules_updated" integer,
	"dictionary_expanded" integer,
	"generated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_queue" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"notification_id" varchar(255),
	"to_email" varchar(255) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"body" text NOT NULL,
	"body_html" text,
	"priority" varchar(50),
	"status" varchar(50),
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"opened" boolean DEFAULT false,
	"opened_at" timestamp,
	"clicked" boolean DEFAULT false,
	"clicked_at" timestamp,
	"error_message" text,
	"retry_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"notification_type" varchar(100) NOT NULL,
	"avg_view_rate" numeric(5, 2),
	"avg_click_rate" numeric(5, 2),
	"avg_action_rate" numeric(5, 2),
	"avg_dismiss_rate" numeric(5, 2),
	"optimal_time_of_day" varchar(100),
	"optimal_day_of_week" varchar(100),
	"best_channel" varchar(100),
	"channel_performance" text,
	"avg_behavior_change" numeric(5, 2),
	"fatigue_threshold" integer,
	"user_count" integer,
	"total_sent" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification_batches" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"batch_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"summary" text,
	"notification_count" integer DEFAULT 0,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification_preferences" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"notification_type" varchar(50),
	"enabled" boolean DEFAULT true,
	"email_enabled" boolean DEFAULT true,
	"push_enabled" boolean DEFAULT true,
	"sms_enabled" boolean DEFAULT false,
	"in_app_enabled" boolean DEFAULT true,
	"frequency" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"notifications_enabled" boolean DEFAULT true,
	"quiet_hours_enabled" boolean DEFAULT true,
	"quiet_hours_start" varchar(10),
	"quiet_hours_end" varchar(10),
	"email_enabled" boolean DEFAULT true,
	"push_enabled" boolean DEFAULT true,
	"sms_enabled" boolean DEFAULT false,
	"in_app_enabled" boolean DEFAULT true,
	"batching_enabled" boolean DEFAULT true,
	"batching_window" integer DEFAULT 60,
	"max_notifications_per_day" integer DEFAULT 10,
	"optimal_times" text,
	"effective_channels" text,
	"notification_fatigue_risk" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"notification_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"body" text,
	"action_url" varchar(500),
	"action_text" varchar(100),
	"priority" varchar(50),
	"channels" text,
	"scheduled_for" timestamp,
	"status" varchar(50),
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"viewed" boolean DEFAULT false,
	"viewed_at" timestamp,
	"clicked" boolean DEFAULT false,
	"clicked_at" timestamp,
	"dismissed" boolean DEFAULT false,
	"dismissed_at" timestamp,
	"action_taken" boolean DEFAULT false,
	"related_id" varchar(255),
	"related_type" varchar(100),
	"batch_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "push_tokens" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"token" varchar(500) NOT NULL,
	"platform" varchar(50),
	"device_id" varchar(255),
	"device_name" varchar(255),
	"active" boolean DEFAULT true,
	"last_used_at" timestamp,
	"registered_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reminder_occurrences" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"reminder_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"status" varchar(50),
	"snoozed_until" timestamp,
	"snooze_count" integer DEFAULT 0,
	"completed_at" timestamp,
	"notification_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reminders" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"reminder_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"related_id" varchar(255),
	"related_type" varchar(100),
	"schedule_type" varchar(50),
	"reminder_time" varchar(10),
	"days_of_week" text,
	"day_of_month" integer,
	"custom_recurrence" text,
	"lead_time_minutes" integer,
	"snooze_enabled" boolean DEFAULT true,
	"snooze_duration_minutes" integer DEFAULT 10,
	"active" boolean DEFAULT true,
	"next_occurrence" timestamp,
	"total_sent" integer DEFAULT 0,
	"total_completed" integer DEFAULT 0,
	"total_snoozed" integer DEFAULT 0,
	"completion_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sms_queue" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"notification_id" varchar(255),
	"to_phone" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(50),
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"error_message" text,
	"retry_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_notification_feedback" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"notification_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"feedback_type" varchar(50),
	"feedback_text" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "active_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_token" varchar(500) NOT NULL,
	"device_id" varchar(255),
	"device_name" varchar(255),
	"device_type" varchar(50),
	"ip_address" varchar(50),
	"country" varchar(100),
	"city" varchar(100),
	"user_agent" text,
	"browser" varchar(100),
	"os" varchar(100),
	"active" boolean DEFAULT true,
	"last_activity_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"mfa_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"terminated_at" timestamp,
	CONSTRAINT "active_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"key_name" varchar(255) NOT NULL,
	"key_hash" varchar(500) NOT NULL,
	"key_prefix" varchar(20),
	"permissions" text,
	"ip_whitelist" text,
	"rate_limit" integer,
	"active" boolean DEFAULT true,
	"last_used_at" timestamp,
	"total_requests" integer DEFAULT 0,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_request_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"api_key_id" varchar(255),
	"user_id" varchar(255),
	"method" varchar(10) NOT NULL,
	"endpoint" varchar(500) NOT NULL,
	"status_code" integer NOT NULL,
	"response_time" integer,
	"ip_address" varchar(50),
	"user_agent" text,
	"error_message" text,
	"request_timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"event_type" varchar(100) NOT NULL,
	"event_category" varchar(50),
	"action" varchar(255) NOT NULL,
	"resource" varchar(255),
	"resource_id" varchar(255),
	"details" text,
	"success" boolean NOT NULL,
	"error_message" text,
	"ip_address" varchar(50),
	"user_agent" text,
	"session_id" varchar(255),
	"severity" varchar(50),
	"event_timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compliance_reports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"report_type" varchar(50),
	"report_period_start" timestamp NOT NULL,
	"report_period_end" timestamp NOT NULL,
	"status" varchar(50),
	"findings" text,
	"file_path" varchar(500),
	"generated_by" varchar(255),
	"generated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_access_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"accessed_by" varchar(255) NOT NULL,
	"accessed_by_type" varchar(50),
	"data_type" varchar(100) NOT NULL,
	"data_id" varchar(255),
	"data_owner_id" varchar(255),
	"access_method" varchar(100),
	"purpose" varchar(255),
	"ip_address" varchar(50),
	"accessed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "encryption_keys" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"key_id" varchar(255) NOT NULL,
	"key_type" varchar(50),
	"algorithm" varchar(100) NOT NULL,
	"active" boolean DEFAULT true,
	"rotation_schedule" varchar(50),
	"last_rotated_at" timestamp,
	"next_rotation_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"retired_at" timestamp,
	CONSTRAINT "encryption_keys_key_id_unique" UNIQUE("key_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "login_history" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"login_method" varchar(50),
	"success" boolean NOT NULL,
	"failure_reason" varchar(255),
	"ip_address" varchar(50),
	"country" varchar(100),
	"city" varchar(100),
	"user_agent" text,
	"mfa_required" boolean DEFAULT false,
	"mfa_completed" boolean DEFAULT false,
	"risk_score" integer,
	"risk_factors" text,
	"login_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rate_limits" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"identifier_type" varchar(50),
	"endpoint" varchar(500),
	"requests_per_minute" integer,
	"requests_per_hour" integer,
	"requests_per_day" integer,
	"requests_this_minute" integer DEFAULT 0,
	"requests_this_hour" integer DEFAULT 0,
	"requests_today" integer DEFAULT 0,
	"minute_reset_at" timestamp,
	"hour_reset_at" timestamp,
	"day_reset_at" timestamp,
	"throttled" boolean DEFAULT false,
	"throttled_until" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security_alerts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"alert_type" varchar(50),
	"severity" varchar(50),
	"message" text,
	"action_required" boolean DEFAULT false,
	"action_url" varchar(500),
	"acknowledged" boolean DEFAULT false,
	"acknowledged_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security_incidents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"incident_type" varchar(50),
	"severity" varchar(50),
	"description" text,
	"detected_by" varchar(100),
	"detection_method" varchar(255),
	"status" varchar(50),
	"response_actions" text,
	"impact_assessment" text,
	"affected_users" integer,
	"data_compromised" boolean DEFAULT false,
	"resolved_by" varchar(255),
	"resolution_notes" text,
	"detected_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "security_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"mfa_enabled" boolean DEFAULT false,
	"mfa_method" varchar(50),
	"mfa_secret" varchar(500),
	"mfa_backup_codes" text,
	"password_hash" varchar(500) NOT NULL,
	"password_salt" varchar(255),
	"password_last_changed" timestamp,
	"password_expires_at" timestamp,
	"require_password_change" boolean DEFAULT false,
	"security_questions" text,
	"account_locked" boolean DEFAULT false,
	"account_locked_until" timestamp,
	"account_locked_reason" text,
	"failed_login_attempts" integer DEFAULT 0,
	"last_failed_login_at" timestamp,
	"suspicious_activity_detected" boolean DEFAULT false,
	"suspicious_activity_count" integer DEFAULT 0,
	"ip_whitelist_enabled" boolean DEFAULT false,
	"ip_whitelist" text,
	"max_active_sessions" integer DEFAULT 5,
	"session_timeout" integer DEFAULT 3600,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "security_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trusted_devices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"device_name" varchar(255),
	"device_type" varchar(50),
	"device_fingerprint" varchar(500),
	"trusted" boolean DEFAULT true,
	"last_seen_at" timestamp,
	"last_seen_ip" varchar(50),
	"trusted_at" timestamp DEFAULT now(),
	"untrusted_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accessibility_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"screen_reader_enabled" boolean DEFAULT false,
	"high_contrast" boolean DEFAULT false,
	"large_text" boolean DEFAULT false,
	"color_blind_mode" varchar(50),
	"reduce_motion" boolean DEFAULT false,
	"keyboard_navigation" boolean DEFAULT false,
	"sticky_keys" boolean DEFAULT false,
	"simplified_interface" boolean DEFAULT false,
	"reduced_distractions" boolean DEFAULT false,
	"closed_captions" boolean DEFAULT false,
	"audio_descriptions" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "accessibility_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_deletion_requests" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"reason" text,
	"feedback" text,
	"status" varchar(50),
	"scheduled_for" timestamp,
	"completed_at" timestamp,
	"requested_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"ai_coach_enabled" boolean DEFAULT true,
	"ai_insights_enabled" boolean DEFAULT true,
	"ai_recommendations_enabled" boolean DEFAULT true,
	"ai_predictions_enabled" boolean DEFAULT true,
	"auto_habit_tracking" boolean DEFAULT false,
	"auto_goal_suggestions" boolean DEFAULT true,
	"auto_progress_reports" boolean DEFAULT true,
	"proactive_check_ins" boolean DEFAULT true,
	"proactive_interventions" boolean DEFAULT true,
	"ai_tone" varchar(50),
	"ai_verbosity" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appearance_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"theme" varchar(50),
	"accent_color" varchar(50) DEFAULT '#3B82F6',
	"sidebar_position" varchar(50),
	"compact_mode" boolean DEFAULT false,
	"font_size" varchar(50),
	"font_family" varchar(100) DEFAULT 'system',
	"high_contrast" boolean DEFAULT false,
	"reduce_motion" boolean DEFAULT false,
	"screen_reader_optimized" boolean DEFAULT false,
	"default_dashboard" varchar(100) DEFAULT 'overview',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "appearance_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "beta_features" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"feature_name" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50),
	"available_to_all" boolean DEFAULT false,
	"requires_opt_in" boolean DEFAULT true,
	"total_opt_ins" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blocked_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"blocked_user_id" varchar(255) NOT NULL,
	"reason" text,
	"blocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "consent_records" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"consent_type" varchar(50),
	"consented" boolean NOT NULL,
	"policy_version" varchar(50),
	"ip_address" varchar(50),
	"user_agent" text,
	"consented_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"auto_backup_enabled" boolean DEFAULT true,
	"backup_frequency" varchar(50),
	"last_backup_at" timestamp,
	"data_retention_period" varchar(50),
	"export_format" varchar(50),
	"storage_used" integer DEFAULT 0,
	"storage_limit" integer DEFAULT 1073741824,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "data_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "module_preferences" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"module_name" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT true,
	"show_in_dashboard" boolean DEFAULT true,
	"dashboard_order" integer,
	"module_settings" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "privacy_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"profile_visibility" varchar(50),
	"share_data_for_research" boolean DEFAULT false,
	"share_data_for_ai" boolean DEFAULT true,
	"share_progress_with_community" boolean DEFAULT false,
	"show_activity_feed" boolean DEFAULT false,
	"show_goals" boolean DEFAULT false,
	"show_achievements" boolean DEFAULT true,
	"show_stats" boolean DEFAULT false,
	"allow_friend_requests" boolean DEFAULT true,
	"allow_messages" boolean DEFAULT true,
	"searchable" boolean DEFAULT false,
	"allow_analytics_cookies" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "privacy_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_preferences" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"preferences" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings_change_log" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"setting_category" varchar(100) NOT NULL,
	"setting_name" varchar(100) NOT NULL,
	"old_value" text,
	"new_value" text,
	"changed_by" varchar(100),
	"ip_address" varchar(50),
	"changed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_beta_opt_ins" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"beta_feature_id" varchar(255) NOT NULL,
	"feedback" text,
	"rating" integer,
	"opted_in_at" timestamp DEFAULT now(),
	"opted_out_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_feature_flags" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"feature_name" varchar(100) NOT NULL,
	"enabled" boolean DEFAULT false,
	"enabled_at" timestamp,
	"enabled_by" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"bio" text,
	"avatar_url" varchar(500),
	"email" varchar(255),
	"phone_number" varchar(50),
	"timezone" varchar(100) DEFAULT 'UTC',
	"country" varchar(100),
	"language" varchar(10) DEFAULT 'en',
	"measurement_system" varchar(50),
	"temperature_unit" varchar(50),
	"date_format" varchar(50) DEFAULT 'YYYY-MM-DD',
	"time_format" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "career_experiments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"experiment_type" varchar(50),
	"experiment_name" varchar(255) NOT NULL,
	"description" text,
	"hypothesis" text,
	"success_criteria" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"what_you_learned" text,
	"what_you_liked" text,
	"what_you_disliked" text,
	"conclusion" text,
	"next_steps" text,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "career_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"target_date" timestamp,
	"achieved_date" timestamp,
	"progress" integer,
	"status" varchar(50),
	"impact" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "career_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"employment_status" varchar(50),
	"current_role" varchar(255),
	"current_industry" varchar(255),
	"years_experience" integer,
	"primary_goal" varchar(50),
	"target_role" varchar(255),
	"target_industry" varchar(255),
	"target_timeline" integer,
	"what_you_love" text,
	"what_youre_good_at" text,
	"what_world_needs" text,
	"what_you_can_be_paid_for" text,
	"purpose_statement" text,
	"core_values" text,
	"current_skills" text,
	"skills_to_learn" text,
	"strengths" text,
	"main_barriers" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_search_activities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"activity_date" timestamp NOT NULL,
	"activity_type" varchar(50),
	"company_name" varchar(255),
	"job_title" varchar(255),
	"job_url" text,
	"application_method" varchar(255),
	"referral_source" varchar(255),
	"interview_type" varchar(50),
	"interview_round" integer,
	"interview_notes" text,
	"status" varchar(50),
	"next_steps" text,
	"follow_up_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "networking_contacts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"title" varchar(255),
	"company" varchar(255),
	"industry" varchar(255),
	"how_met" text,
	"connection_strength" varchar(50),
	"email" varchar(255),
	"linkedin" varchar(255),
	"phone" varchar(50),
	"last_contact" timestamp,
	"contact_frequency" varchar(50),
	"how_they_can_help" text,
	"how_you_can_help" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purpose_activities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"activity_date" timestamp NOT NULL,
	"activity_type" varchar(50),
	"insights" text,
	"patterns" text,
	"emotions" text,
	"passions" text,
	"strengths" text,
	"values" text,
	"impact" text,
	"action_steps" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skill_development" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"skill_name" varchar(255) NOT NULL,
	"skill_category" varchar(50),
	"current_level" varchar(50),
	"target_level" varchar(50),
	"learning_resources" text,
	"practice_activities" text,
	"hours_invested" numeric(10, 2) DEFAULT '0',
	"completed_milestones" text,
	"projects_used" text,
	"certifications_earned" text,
	"start_date" timestamp,
	"target_completion_date" timestamp,
	"completion_date" timestamp,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accountability_partnerships" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user1_id" varchar(255) NOT NULL,
	"user2_id" varchar(255) NOT NULL,
	"shared_goals" text,
	"check_in_frequency" varchar(50),
	"last_check_in" timestamp,
	"total_check_ins" integer DEFAULT 0,
	"partnership_satisfaction" integer,
	"helpfulness_rating" integer,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenge_participants" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"challenge_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"completion_rate" numeric(5, 2),
	"last_update" timestamp,
	"completed" boolean DEFAULT false,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communities" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"cover_image" varchar(500),
	"community_type" varchar(50),
	"privacy" varchar(50),
	"moderator_ids" text,
	"guidelines" text,
	"member_count" integer DEFAULT 0,
	"active_members" integer DEFAULT 0,
	"total_posts" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"support_type" varchar(100) NOT NULL,
	"avg_user_retention" numeric(5, 2),
	"avg_goal_achievement" numeric(5, 2),
	"avg_satisfaction" numeric(4, 2),
	"optimal_check_in_frequency" varchar(50),
	"optimal_group_size" integer,
	"most_effective_for" text,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_challenges" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"community_id" varchar(255),
	"challenge_name" varchar(255) NOT NULL,
	"description" text,
	"challenge_type" varchar(50),
	"start_date" timestamp,
	"end_date" timestamp,
	"duration" integer,
	"participant_count" integer DEFAULT 0,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_comments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"likes_count" integer DEFAULT 0,
	"flagged" boolean DEFAULT false,
	"visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_memberships" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"community_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" varchar(50),
	"last_active_at" timestamp,
	"posts_count" integer DEFAULT 0,
	"comments_count" integer DEFAULT 0,
	"notifications_enabled" boolean DEFAULT true,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_posts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"community_id" varchar(255) NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"post_type" varchar(50),
	"title" varchar(255),
	"content" text NOT NULL,
	"images" text,
	"tags" text,
	"likes_count" integer DEFAULT 0,
	"comments_count" integer DEFAULT 0,
	"supports_count" integer DEFAULT 0,
	"flagged" boolean DEFAULT false,
	"flag_reason" text,
	"visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"bio" text,
	"profile_photo" varchar(500),
	"share_progress" boolean DEFAULT true,
	"share_struggles" boolean DEFAULT true,
	"share_wins" boolean DEFAULT true,
	"primary_challenges" text,
	"primary_goals" text,
	"role" varchar(50),
	"available_as_mentor" boolean DEFAULT false,
	"mentorship_areas" text,
	"total_posts" integer DEFAULT 0,
	"total_comments" integer DEFAULT 0,
	"total_supports_given" integer DEFAULT 0,
	"total_supports_received" integer DEFAULT 0,
	"helpfulness_score" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_check_ins" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"check_in_date" timestamp NOT NULL,
	"mood" varchar(100),
	"energy" integer,
	"today_goals" text,
	"grateful_for" text,
	"struggling_with" text,
	"need_support" boolean DEFAULT false,
	"wins_today" text,
	"share_with_community" boolean DEFAULT true,
	"supports_received" integer DEFAULT 0,
	"comments_received" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentorships" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"mentor_id" varchar(255) NOT NULL,
	"mentee_id" varchar(255) NOT NULL,
	"focus_area" varchar(255) NOT NULL,
	"meeting_frequency" varchar(50),
	"total_sessions" integer DEFAULT 0,
	"last_session" timestamp,
	"mentee_progress" integer,
	"mentee_satisfaction" integer,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partner_check_ins" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"partnership_id" varchar(255) NOT NULL,
	"initiator_id" varchar(255) NOT NULL,
	"check_in_date" timestamp NOT NULL,
	"user1_progress" text,
	"user1_struggles" text,
	"user1_wins" text,
	"user1_next_steps" text,
	"user2_progress" text,
	"user2_struggles" text,
	"user2_wins" text,
	"user2_next_steps" text,
	"encouragement_given" text,
	"helpfulness" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "budget_categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"category_type" varchar(50),
	"category_name" varchar(255) NOT NULL,
	"planned_amount" numeric(10, 2) NOT NULL,
	"actual_amount" numeric(10, 2) DEFAULT '0',
	"is_essential" boolean DEFAULT true,
	"is_variable" boolean DEFAULT false,
	"budget_month" varchar(7),
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "debt_accounts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"debt_type" varchar(50),
	"creditor_name" varchar(255) NOT NULL,
	"original_balance" numeric(10, 2) NOT NULL,
	"current_balance" numeric(10, 2) NOT NULL,
	"interest_rate" numeric(5, 2),
	"minimum_payment" numeric(10, 2),
	"payoff_method" varchar(50),
	"payoff_priority" integer,
	"last_payment_date" timestamp,
	"last_payment_amount" numeric(10, 2),
	"projected_payoff_date" timestamp,
	"total_interest_paid" numeric(10, 2) DEFAULT '0',
	"status" varchar(50),
	"paid_off_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "debt_payments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"debt_account_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"payment_date" timestamp NOT NULL,
	"payment_amount" numeric(10, 2) NOT NULL,
	"principal_paid" numeric(10, 2),
	"interest_paid" numeric(10, 2),
	"balance_after_payment" numeric(10, 2),
	"emotional_impact" integer,
	"motivation_boost" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expense_date" timestamp NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"category_id" varchar(255),
	"category_name" varchar(255) NOT NULL,
	"description" varchar(255),
	"merchant" varchar(255),
	"was_planned" boolean,
	"was_necessary" boolean,
	"was_impulse" boolean,
	"emotional_state" varchar(100),
	"trigger" varchar(255),
	"satisfaction_level" integer,
	"regret_level" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_education" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"topic" varchar(50),
	"resource_type" varchar(50),
	"resource_name" varchar(255),
	"resource_url" text,
	"completed_date" timestamp,
	"key_takeaways" text,
	"applied_learning" text,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"employment_status" varchar(50),
	"monthly_income" numeric(10, 2),
	"income_stability" varchar(50),
	"total_debt" numeric(10, 2),
	"debt_types" text,
	"has_emergency_fund" boolean DEFAULT false,
	"emergency_fund_months" integer,
	"has_budget" boolean DEFAULT false,
	"tracks_spending" boolean DEFAULT false,
	"financial_stress_level" integer,
	"primary_goal" varchar(50),
	"specific_goals" text,
	"money_scripts" text,
	"financial_trauma" text,
	"impulse_buying_triggers" text,
	"emotional_spending_triggers" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_wins" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"win_date" timestamp NOT NULL,
	"win_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"amount_involved" numeric(10, 2),
	"emotional_impact" integer,
	"what_you_learned" text,
	"who_you_became" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "income_entries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"income_date" timestamp NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"income_type" varchar(50),
	"source" varchar(255),
	"description" text,
	"is_recurring" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "money_mindset_reflections" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"reflection_date" timestamp NOT NULL,
	"prompt_type" varchar(50),
	"reflection" text NOT NULL,
	"insights" text,
	"limiting_beliefs" text,
	"empowering_beliefs" text,
	"action_steps" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "savings_goals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"goal_type" varchar(50),
	"goal_name" varchar(255) NOT NULL,
	"description" text,
	"target_amount" numeric(10, 2) NOT NULL,
	"current_amount" numeric(10, 2) DEFAULT '0',
	"start_date" timestamp,
	"target_date" timestamp,
	"monthly_contribution" numeric(10, 2),
	"percent_complete" integer DEFAULT 0,
	"why_it_matters" text,
	"visual_reminder" varchar(255),
	"status" varchar(50),
	"completed_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_accountability" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"accountability_type" varchar(50),
	"partner_id" varchar(255),
	"check_in_frequency" varchar(50),
	"last_check_in" timestamp,
	"next_check_in" timestamp,
	"adherence_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_type" varchar(100) NOT NULL,
	"avg_achievement_rate" numeric(5, 2),
	"avg_time_to_completion" integer,
	"avg_abandonment_rate" numeric(5, 2),
	"optimal_difficulty" integer,
	"optimal_timeframe" integer,
	"optimal_accountability_type" varchar(100),
	"success_factors" text,
	"failure_factors" text,
	"user_count" integer,
	"total_goals" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_name" varchar(255) NOT NULL,
	"description" text,
	"target_value" numeric(10, 2),
	"target_date" timestamp,
	"achieved" boolean DEFAULT false,
	"achieved_at" timestamp,
	"sequence_order" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_obstacles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"obstacle_name" varchar(255) NOT NULL,
	"description" text,
	"obstacle_type" varchar(50),
	"severity" integer,
	"occurrence_count" integer DEFAULT 0,
	"last_occurrence" timestamp,
	"solution" text,
	"solution_effective" boolean,
	"overcome" boolean DEFAULT false,
	"overcame_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_predictions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"prediction_type" varchar(50),
	"prediction" text,
	"confidence" numeric(5, 2),
	"factors" text,
	"recommendation" text,
	"actual_outcome" text,
	"prediction_accurate" boolean,
	"created_at" timestamp DEFAULT now(),
	"validated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"total_goals_set" integer DEFAULT 0,
	"total_goals_achieved" integer DEFAULT 0,
	"total_goals_abandoned" integer DEFAULT 0,
	"achievement_rate" numeric(5, 2),
	"preferred_framework" varchar(50),
	"optimal_goal_difficulty" integer,
	"optimal_timeframe" varchar(100),
	"optimal_goal_count" integer,
	"motivation_type" varchar(50),
	"needs_accountability" boolean DEFAULT false,
	"preferred_accountability_type" varchar(50),
	"success_patterns" text,
	"failure_patterns" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_progress_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"current_value" numeric(10, 2) NOT NULL,
	"progress_percent" numeric(5, 2),
	"notes" text,
	"momentum" varchar(50),
	"log_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_reflections" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"reflection_type" varchar(50),
	"what_worked" text,
	"what_didnt_work" text,
	"lessons_learned" text,
	"adjustments_needed" text,
	"confidence_level" integer,
	"motivation_level" integer,
	"reflection_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"goal_name" varchar(255) NOT NULL,
	"description" text,
	"goal_type" varchar(50),
	"framework" varchar(50),
	"specific" boolean DEFAULT false,
	"measurable" boolean DEFAULT false,
	"achievable" boolean DEFAULT false,
	"relevant" boolean DEFAULT false,
	"time_bound" boolean DEFAULT false,
	"category" varchar(50),
	"difficulty" integer,
	"start_date" timestamp,
	"target_date" timestamp,
	"metric_type" varchar(50),
	"current_value" numeric(10, 2),
	"target_value" numeric(10, 2),
	"unit" varchar(50),
	"progress_percent" numeric(5, 2),
	"status" varchar(50),
	"priority" varchar(50),
	"is_public" boolean DEFAULT false,
	"related_habit_id" varchar(255),
	"related_goal_id" varchar(255),
	"completed_at" timestamp,
	"abandoned_at" timestamp,
	"abandon_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "implementation_intentions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"if_condition" text NOT NULL,
	"then_action" text NOT NULL,
	"intention_type" varchar(50),
	"times_triggered" integer DEFAULT 0,
	"times_executed" integer DEFAULT 0,
	"execution_rate" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "key_results" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"okr_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"key_result" text NOT NULL,
	"current_value" numeric(10, 2),
	"target_value" numeric(10, 2),
	"unit" varchar(50),
	"progress_percent" numeric(5, 2),
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "okrs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"objective" text NOT NULL,
	"time_period" varchar(50),
	"start_date" timestamp,
	"end_date" timestamp,
	"overall_progress" numeric(5, 2),
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "woop_plans" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"goal_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"wish" text NOT NULL,
	"outcome" text NOT NULL,
	"outcome_visualization" text,
	"obstacle" text NOT NULL,
	"obstacle_anticipation" text,
	"plan" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habit_formation_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"strategy" varchar(100) NOT NULL,
	"habit_category" varchar(100),
	"avg_success_rate" numeric(5, 2),
	"avg_time_to_automaticity" integer,
	"avg_streak_length" integer,
	"optimal_cue_type" varchar(100),
	"optimal_time_of_day" varchar(50),
	"most_effective_for" text,
	"habit_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habit_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"habit_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"achieved_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habit_obstacles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"habit_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"obstacle_description" text NOT NULL,
	"obstacle_type" varchar(50),
	"frequency" varchar(50),
	"if_then_plan" text,
	"solution_effectiveness" integer,
	"resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habit_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"total_active_habits" integer DEFAULT 0,
	"total_mastered_habits" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"preferred_habit_time" varchar(50),
	"most_successful_cues" text,
	"optimal_habit_stack_sequence" text,
	"personal_success_factors" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habit_stacks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"stack_name" varchar(255) NOT NULL,
	"description" text,
	"time_of_day" varchar(50),
	"habit_sequence" text,
	"estimated_duration" integer,
	"total_completions" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"success_rate" numeric(5, 2),
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habit_tracking" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"habit_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"tracking_date" timestamp NOT NULL,
	"completed" boolean NOT NULL,
	"duration" integer,
	"intensity" integer,
	"time_of_day" varchar(50),
	"location" varchar(255),
	"cue_present" boolean,
	"cue_effectiveness" integer,
	"resistance_level" integer,
	"ease_of_completion" integer,
	"reward_experienced" boolean,
	"reward_satisfaction" integer,
	"felt_automatic" boolean,
	"mood_before" varchar(100),
	"mood_after" varchar(100),
	"energy_before" integer,
	"energy_after" integer,
	"notes" text,
	"challenges" text,
	"wins" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "habits" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"habit_name" varchar(255) NOT NULL,
	"habit_description" text,
	"identity_statement" varchar(255),
	"habit_type" varchar(50),
	"category" varchar(50),
	"tiny_version" varchar(255),
	"full_version" varchar(255),
	"cue" varchar(255) NOT NULL,
	"cue_type" varchar(50),
	"routine" varchar(255) NOT NULL,
	"reward" varchar(255),
	"anchor_habit" varchar(255),
	"stacking_formula" varchar(255),
	"implementation_intention" varchar(255),
	"environment_changes" text,
	"target_frequency" varchar(50),
	"custom_frequency" text,
	"target_duration" integer,
	"difficulty" integer,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"total_completions" integer DEFAULT 0,
	"success_rate" numeric(5, 2),
	"automaticity_level" integer,
	"status" varchar(50),
	"start_date" timestamp NOT NULL,
	"mastered_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "language_pattern_practice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"pattern_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"situation" text,
	"caught_old_pattern" boolean,
	"used_new_pattern" boolean,
	"impact_on_mood" integer,
	"impact_on_action" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "language_patterns" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"pattern_type" varchar(50),
	"original_statement" text,
	"reframed_statement" text,
	"context" varchar(255),
	"related_habit_id" varchar(255),
	"belief_in_old" integer,
	"belief_in_new" integer,
	"impact_on_behavior" integer,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weekly_habit_reviews" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"week_start_date" timestamp NOT NULL,
	"overall_success_rate" numeric(5, 2),
	"total_habits_completed" integer,
	"biggest_wins" text,
	"habits_getting_easier" text,
	"biggest_challenges" text,
	"habits_struggling_with" text,
	"limiting_language_caught" integer,
	"empowering_language_used" integer,
	"key_insights" text,
	"lessons_learned" text,
	"adjustments_planned" text,
	"new_habits_to_start" text,
	"habits_to_modify" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "biomarkers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"test_date" timestamp NOT NULL,
	"fasting_glucose" numeric(5, 2),
	"hba1c" numeric(4, 2),
	"fasting_insulin" numeric(5, 2),
	"homa_ir" numeric(5, 2),
	"total_cholesterol" integer,
	"ldl_cholesterol" integer,
	"hdl_cholesterol" integer,
	"triglycerides" integer,
	"apo_b" integer,
	"lp_a" integer,
	"hs_crp" numeric(5, 2),
	"alt" integer,
	"ast" integer,
	"ggt" integer,
	"creatinine" numeric(4, 2),
	"egfr" integer,
	"bun" integer,
	"tsh" numeric(5, 3),
	"free_t3" numeric(4, 2),
	"free_t4" numeric(4, 2),
	"testosterone" integer,
	"estradiol" integer,
	"cortisol" numeric(5, 2),
	"dhea" integer,
	"vitamin_d" numeric(5, 2),
	"vitamin_b12" integer,
	"folate" numeric(5, 2),
	"iron" integer,
	"ferritin" integer,
	"magnesium" numeric(4, 2),
	"wbc" numeric(4, 2),
	"rbc" numeric(4, 2),
	"hemoglobin" numeric(4, 1),
	"hematocrit" numeric(4, 1),
	"platelets" integer,
	"homocysteine" numeric(5, 2),
	"uric_acid" numeric(4, 2),
	"test_source" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_health_metrics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"metric_date" timestamp NOT NULL,
	"resting_heart_rate" integer,
	"hrv" integer,
	"blood_pressure_systolic" integer,
	"blood_pressure_diastolic" integer,
	"oxygen_saturation" integer,
	"body_temperature" numeric(4, 2),
	"weight" numeric(5, 2),
	"body_fat" numeric(4, 1),
	"sleep_duration" numeric(3, 1),
	"sleep_quality" integer,
	"deep_sleep_minutes" integer,
	"rem_sleep_minutes" integer,
	"energy_level" integer,
	"mental_clarity" integer,
	"physical_performance" integer,
	"stress_level" integer,
	"recovery_score" integer,
	"symptoms" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"achieved_date" timestamp,
	"significance" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_optimization_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"intervention_type" varchar(100) NOT NULL,
	"target_biomarker" varchar(100),
	"avg_biomarker_improvement" numeric(6, 2),
	"success_rate" numeric(5, 2),
	"optimal_duration" integer,
	"optimal_dosage" varchar(255),
	"most_effective_for" text,
	"protocol_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_optimization_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"overall_health" integer,
	"chronological_age" integer,
	"estimated_biological_age" integer,
	"primary_goal" varchar(50),
	"family_history" text,
	"current_conditions" text,
	"risk_factors" text,
	"current_medications" text,
	"smoking_status" varchar(50),
	"alcohol_consumption" varchar(50),
	"active_protocols" text,
	"most_effective_interventions" text,
	"biomarker_trends" text,
	"health_trajectory" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_protocols" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"protocol_name" varchar(255) NOT NULL,
	"protocol_type" varchar(50),
	"description" text,
	"protocol" text,
	"target_biomarker" varchar(255),
	"target_condition" varchar(255),
	"start_date" timestamp,
	"planned_duration" integer,
	"end_date" timestamp,
	"baseline_measurement" text,
	"end_measurement" text,
	"effectiveness" integer,
	"side_effects" text,
	"will_continue" boolean,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health_screenings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"screening_date" timestamp NOT NULL,
	"screening_type" varchar(50),
	"screening_name" varchar(255),
	"results" text,
	"abnormal_findings" text,
	"follow_up_needed" boolean,
	"follow_up_date" timestamp,
	"provider" varchar(255),
	"results_file" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "longevity_practices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"practice_type" varchar(50),
	"duration" integer,
	"intensity" varchar(50),
	"specific_metrics" text,
	"how_it_felt" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"sleep_date" timestamp NOT NULL,
	"bed_time" timestamp,
	"wake_time" timestamp,
	"total_time_in_bed" integer,
	"total_sleep_time" integer,
	"sleep_efficiency" integer,
	"awake_duration" integer,
	"light_sleep_duration" integer,
	"deep_sleep_duration" integer,
	"rem_sleep_duration" integer,
	"sleep_quality" integer,
	"times_to_wake" integer,
	"time_to_fall_asleep" integer,
	"caffeine_after_2pm" boolean,
	"alcohol_before_bed" boolean,
	"screen_time_before_bed" integer,
	"exercise_today" boolean,
	"stress_level" integer,
	"room_temperature" integer,
	"noise_level" varchar(50),
	"light_level" varchar(50),
	"morning_energy" integer,
	"morning_mood" varchar(100),
	"data_source" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_recovery_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"log_date" timestamp NOT NULL,
	"perceived_stress" integer,
	"stress_sources" text,
	"morning_hrv" integer,
	"recovery_score" integer,
	"resting_heart_rate" integer,
	"daily_strain" numeric(4, 1),
	"recovery_strategies" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "best_possible_self_entries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"journal_entry_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"timeframe" varchar(50),
	"personal_life" text,
	"relationships" text,
	"career" text,
	"health" text,
	"contributions" text,
	"who_you_are" text,
	"how_you_feel" text,
	"entry_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_reviews" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"journal_entry_id" varchar(255),
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"review_date" timestamp NOT NULL,
	"went_well" text,
	"why_it_went_well" text,
	"didnt_go_well" text,
	"why_it_didnt_go_well" text,
	"lessons_learned" text,
	"tomorrow_focus" text,
	"day_rating" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emotional_patterns" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"pattern_type" varchar(50) NOT NULL,
	"pattern_name" varchar(255) NOT NULL,
	"description" text,
	"occurrence_count" integer DEFAULT 0,
	"first_detected" timestamp,
	"last_detected" timestamp,
	"associated_emotions" text,
	"associated_triggers" text,
	"associated_contexts" text,
	"insight" text,
	"actionable" boolean DEFAULT false,
	"suggested_action" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entry_type" varchar(100) NOT NULL,
	"avg_mood_improvement" numeric(4, 2),
	"avg_insights_generated" numeric(4, 2),
	"avg_behavior_change" numeric(5, 2),
	"optimal_word_count" integer,
	"optimal_duration" integer,
	"optimal_time_of_day" varchar(100),
	"most_effective_for" text,
	"user_count" integer,
	"total_entries" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_insights" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"insight_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"supporting_entries" text,
	"actionable" boolean DEFAULT false,
	"suggested_action" text,
	"viewed" boolean DEFAULT false,
	"viewed_at" timestamp,
	"helpful" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"total_entries" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"preferred_journal_type" varchar(50),
	"preferred_time" varchar(50),
	"default_privacy" varchar(50),
	"enable_ai_insights" boolean DEFAULT true,
	"enable_emotion_detection" boolean DEFAULT true,
	"enable_pattern_recognition" boolean DEFAULT true,
	"most_beneficial_prompts" text,
	"emotional_patterns" text,
	"growth_areas" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_prompts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"prompt_text" text NOT NULL,
	"description" text,
	"category" varchar(50),
	"research_backed" boolean DEFAULT false,
	"research_source" text,
	"best_for" text,
	"difficulty" varchar(50),
	"avg_helpfulness_rating" numeric(4, 2),
	"total_uses" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "journal_reflections" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"period_type" varchar(50),
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"overall_themes" text,
	"emotional_journey" text,
	"growth_areas" text,
	"challenge_areas" text,
	"surprises" text,
	"gratitudes" text,
	"intentions_forward" text,
	"reflection_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompt_effectiveness" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"prompt_id" varchar(255) NOT NULL,
	"total_uses" integer DEFAULT 0,
	"avg_word_count" numeric(8, 2),
	"avg_writing_duration" numeric(6, 2),
	"avg_mood_improvement" numeric(4, 2),
	"avg_helpfulness_rating" numeric(4, 2),
	"avg_insights_generated" numeric(4, 2),
	"most_effective_for_emotions" text,
	"most_effective_for_situations" text,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "writing_streaks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"streak_length" integer,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mental_health_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"primary_diagnosis" varchar(255),
	"secondary_diagnoses" text,
	"diagnosis_date" timestamp,
	"treatment_history" text,
	"current_severity" varchar(50),
	"in_treatment" boolean DEFAULT false,
	"medication_list" text,
	"therapy_type" varchar(255),
	"suicidal_ideation" boolean DEFAULT false,
	"self_harm_risk" varchar(50),
	"crisis_contact_info" text,
	"recovery_goals" text,
	"current_phase" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mood_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"log_date" timestamp NOT NULL,
	"overall_mood" integer,
	"anxiety" integer,
	"depression" integer,
	"irritability" integer,
	"energy" integer,
	"sleep_quality" integer,
	"symptoms" text,
	"self_care_completed" boolean,
	"social_interaction" boolean,
	"physical_activity" boolean,
	"substance_use" boolean,
	"triggers" text,
	"coping_strategies_used" text,
	"coping_effectiveness" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recovery_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"target_date" timestamp,
	"achieved_date" timestamp,
	"progress" integer,
	"status" varchar(50),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "safety_plans" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"warning_signs" text,
	"internal_coping_strategies" text,
	"social_distractions" text,
	"support_contacts" text,
	"professional_contacts" text,
	"crisis_hotlines" text,
	"emergency_services" text,
	"means_restriction" text,
	"reasons_for_living" text,
	"last_reviewed" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thought_records" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"record_date" timestamp NOT NULL,
	"situation" text NOT NULL,
	"automatic_thought" text NOT NULL,
	"emotions_before" text,
	"evidence_for" text,
	"evidence_against" text,
	"cognitive_distortions" text,
	"balanced_thought" text,
	"emotions_after" text,
	"behavioral_response" text,
	"effectiveness" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "breakup_recovery" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"breakup_date" timestamp,
	"relationship_duration" integer,
	"initiator" varchar(50),
	"reason" text,
	"current_phase" varchar(50),
	"no_contact_active" boolean DEFAULT false,
	"no_contact_start_date" timestamp,
	"no_contact_duration" integer,
	"healing_activities" text,
	"support_system" text,
	"days_without_contact" integer DEFAULT 0,
	"good_days_count" integer DEFAULT 0,
	"bad_days_count" integer DEFAULT 0,
	"lessons_learned" text,
	"personal_growth" text,
	"future_goals" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communication_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"log_date" timestamp NOT NULL,
	"conversation_type" varchar(50),
	"topic" varchar(255) NOT NULL,
	"context" text,
	"emotion_before" varchar(255),
	"intensity_before" integer,
	"used_soft_startup" boolean,
	"expressed_needs" boolean,
	"listened_actively" boolean,
	"validated_partner" boolean,
	"found_compromise" boolean,
	"used_criticism" boolean,
	"used_contempt" boolean,
	"used_defensiveness" boolean,
	"used_stonewalling" boolean,
	"outcome" varchar(50),
	"emotion_after" varchar(255),
	"intensity_after" integer,
	"what_worked" text,
	"what_to_improve" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "connection_bids" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"bid_date" timestamp NOT NULL,
	"bid_type" varchar(50),
	"bid_description" text,
	"response" varchar(50),
	"response_description" text,
	"emotional_impact" integer,
	"connection_strength" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "love_language_actions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"action_date" timestamp NOT NULL,
	"action_type" varchar(50),
	"love_language" varchar(50),
	"action_description" text NOT NULL,
	"emotional_impact" integer,
	"connection_felt" integer,
	"partner_response" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "love_maps" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"partner_dreams" text,
	"partner_fears" text,
	"partner_stressors" text,
	"partner_joys" text,
	"partner_daily_routine" text,
	"partner_favorites" text,
	"partner_pet_peeves" text,
	"how_we_met" text,
	"best_memories" text,
	"hardest_moments" text,
	"shared_goals" text,
	"individual_goals" text,
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relationship_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"relationship_type" varchar(50),
	"relationship_status" varchar(50),
	"relationship_duration" integer,
	"partner_involved" boolean DEFAULT false,
	"partner_user_id" varchar(255),
	"attachment_style" varchar(50),
	"partner_attachment_style" varchar(50),
	"primary_love_language" varchar(50),
	"secondary_love_language" varchar(50),
	"partner_primary_love_language" varchar(50),
	"partner_secondary_love_language" varchar(50),
	"primary_goal" varchar(50),
	"specific_goals" text,
	"main_challenges" text,
	"conflict_frequency" varchar(50),
	"criticism_level" integer,
	"contempt_level" integer,
	"defensiveness_level" integer,
	"stonewalling_level" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relationship_rituals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"ritual_type" varchar(50),
	"ritual_name" varchar(255) NOT NULL,
	"description" text,
	"frequency" varchar(50),
	"last_completed" timestamp,
	"completion_count" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"connection_impact" integer,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repair_attempts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"attempt_date" timestamp NOT NULL,
	"conflict_description" text,
	"repair_strategy" varchar(50),
	"repair_details" text,
	"partner_response" varchar(50),
	"conflict_resolved" boolean,
	"connection_restored" boolean,
	"effectiveness" integer,
	"what_learned" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"practice" varchar(100) NOT NULL,
	"avg_sleep_quality_improvement" numeric(5, 2),
	"avg_sleep_duration_improvement" numeric(5, 2),
	"optimal_implementation_time" varchar(100),
	"most_effective_for" text,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_experiments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"experiment_name" varchar(255) NOT NULL,
	"hypothesis" text,
	"variable" varchar(255) NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"duration" integer,
	"baseline_sleep_quality" numeric(4, 2),
	"baseline_sleep_duration" numeric(4, 2),
	"avg_sleep_quality_during_experiment" numeric(4, 2),
	"avg_sleep_duration_during_experiment" numeric(4, 2),
	"improvement" numeric(6, 2),
	"conclusion" text,
	"keep_practice" boolean,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_hygiene_practices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"sleep_tracking_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"no_screens_1_hour_before" boolean,
	"dim_lights_evening" boolean,
	"cool_room_temp" boolean,
	"dark_room" boolean,
	"quiet_environment" boolean,
	"consistent_bedtime" boolean,
	"consistent_wake_time" boolean,
	"no_caffeine_after_2pm" boolean,
	"no_alcohol" boolean,
	"no_heavy_meal_before_3_hours" boolean,
	"morning_light_exposure" boolean,
	"exercised_today" boolean,
	"no_naps_after_3pm" boolean,
	"relaxation_practice" varchar(50),
	"supplements" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_insights" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"insight_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"supporting_data" text,
	"action_recommended" text,
	"priority" varchar(50),
	"acknowledged" boolean DEFAULT false,
	"action_taken" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_performance_correlations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"performance_area" varchar(50),
	"correlation_coefficient" numeric(4, 3),
	"optimal_sleep_duration" numeric(3, 1),
	"optimal_sleep_quality" integer,
	"data_points" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"target_sleep_duration" numeric(3, 1),
	"target_bedtime" varchar(10),
	"target_wake_time" varchar(10),
	"chronotype" varchar(50),
	"sleep_issues" text,
	"tracking_method" varchar(50),
	"wearable_device" varchar(100),
	"personal_sleep_need" numeric(3, 1),
	"optimal_bedtime" varchar(10),
	"optimal_wake_time" varchar(10),
	"sleep_performance_correlations" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_tracking" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"sleep_date" timestamp NOT NULL,
	"bedtime" timestamp,
	"wake_time" timestamp,
	"time_in_bed" numeric(4, 2),
	"actual_sleep_duration" numeric(4, 2),
	"sleep_efficiency" numeric(5, 2),
	"light_sleep_minutes" integer,
	"deep_sleep_minutes" integer,
	"rem_sleep_minutes" integer,
	"awake_minutes" integer,
	"sleep_quality" integer,
	"sleep_score" integer,
	"times_to_wake_up" integer,
	"time_to_fall_asleep" integer,
	"resting_heart_rate" integer,
	"hrv" integer,
	"respiratory_rate" numeric(4, 2),
	"body_temperature" numeric(4, 2),
	"recovery_score" integer,
	"readiness_score" integer,
	"morning_mood" varchar(100),
	"morning_energy" integer,
	"morning_focus" integer,
	"hygiene_score" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_stress_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"log_date" timestamp NOT NULL,
	"avg_stress_level" integer,
	"peak_stress_level" integer,
	"morning_hrv" numeric(6, 2),
	"avg_hrv" numeric(6, 2),
	"hrv_trend" varchar(50),
	"avg_resting_hr" integer,
	"peak_hr" integer,
	"morning_cortisol" varchar(50),
	"evening_cortisol" varchar(50),
	"cortisol_rhythm" varchar(50),
	"symptoms" text,
	"symptom_severity" integer,
	"sleep_quality" integer,
	"sleep_duration" numeric(4, 2),
	"irritability" integer,
	"concentration" integer,
	"appetite" varchar(50),
	"interventions_used" text,
	"intervention_effectiveness" integer,
	"recovery_quality" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hrv_measurements" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"measurement_time" timestamp NOT NULL,
	"measurement_type" varchar(50),
	"rmssd" numeric(6, 2),
	"sdnn" numeric(6, 2),
	"pnn50" numeric(5, 2),
	"avg_heart_rate" integer,
	"hrv_score" integer,
	"recovery_status" varchar(50),
	"sleep_quality_prior_night" integer,
	"stress_level_prior_day" integer,
	"exercise_intensity_prior_day" varchar(50),
	"measurement_device" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"intervention_type" varchar(100) NOT NULL,
	"avg_stress_reduction" numeric(5, 2),
	"avg_effectiveness_rating" numeric(4, 2),
	"success_rate" numeric(5, 2),
	"optimal_duration" integer,
	"optimal_timing" varchar(100),
	"most_effective_for_stress_type" text,
	"most_effective_for_user_type" text,
	"user_count" integer,
	"total_uses" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_events" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"stress_level" integer NOT NULL,
	"event_timestamp" timestamp NOT NULL,
	"trigger" varchar(255),
	"trigger_category" varchar(50),
	"location" varchar(255),
	"activity" varchar(255),
	"social_context" varchar(50),
	"heart_rate" integer,
	"physical_symptoms" text,
	"primary_emotion" varchar(50),
	"thoughts" text,
	"cognitive_distortions" text,
	"response_type" varchar(50),
	"intervention_used" varchar(255),
	"intervention_effective" boolean,
	"recovery_time" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_interventions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"intervention_name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(50),
	"research_backed" boolean DEFAULT false,
	"research_sources" text,
	"duration_minutes" integer,
	"instructions" text,
	"best_for" text,
	"avg_effectiveness_rating" numeric(4, 2),
	"total_uses" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_predictions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"prediction_type" varchar(50),
	"prediction" text,
	"confidence" numeric(5, 2),
	"timeframe" varchar(100),
	"factors" text,
	"recommendation" text,
	"actual_outcome" text,
	"prediction_accurate" boolean,
	"created_at" timestamp DEFAULT now(),
	"validated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"baseline_stress_level" integer,
	"baseline_hrv" numeric(6, 2),
	"baseline_resting_hr" integer,
	"stress_resilience_score" integer,
	"recovery_capacity" integer,
	"stress_mindset" varchar(50),
	"dominant_response" varchar(50),
	"common_triggers" text,
	"common_symptoms" text,
	"preferred_interventions" text,
	"stress_patterns" text,
	"optimal_recovery_time" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_recovery_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_type" varchar(50),
	"duration_minutes" integer,
	"stress_level_before" integer,
	"hrv_before" numeric(6, 2),
	"stress_level_after" integer,
	"hrv_after" numeric(6, 2),
	"recovery_score" integer,
	"notes" text,
	"session_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stress_triggers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"trigger_name" varchar(255) NOT NULL,
	"trigger_category" varchar(100),
	"occurrence_count" integer DEFAULT 0,
	"last_occurrence" timestamp,
	"avg_stress_level" numeric(4, 2),
	"avg_recovery_time" integer,
	"time_patterns" text,
	"context_patterns" text,
	"avoidable" boolean,
	"effective_strategies" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_intervention_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"intervention_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"stress_event_id" varchar(255),
	"stress_level_before" integer,
	"duration_minutes" integer,
	"completed_fully" boolean DEFAULT true,
	"stress_level_after" integer,
	"effectiveness_rating" integer,
	"side_effects" text,
	"notes" text,
	"used_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "achievements" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"achievement_name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(255),
	"category" varchar(50),
	"difficulty" varchar(50),
	"requirements" text,
	"experience_points" integer NOT NULL,
	"rarity" varchar(50),
	"total_unlocked" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "badges" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"badge_name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(255),
	"category" varchar(100),
	"rarity" varchar(50),
	"how_to_earn" text,
	"total_awarded" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenges" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"challenge_name" varchar(255) NOT NULL,
	"description" text,
	"challenge_type" varchar(50),
	"difficulty" integer,
	"requirements" text,
	"experience_points" integer,
	"badge_id" varchar(255),
	"start_date" timestamp,
	"end_date" timestamp,
	"total_attempts" integer DEFAULT 0,
	"total_completions" integer DEFAULT 0,
	"success_rate" numeric(5, 2),
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_rewards" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"reward_date" timestamp NOT NULL,
	"consecutive_days" integer,
	"streak_bonus" integer,
	"tasks_completed" integer,
	"completion_bonus" integer,
	"total_experience_points" integer,
	"claimed" boolean DEFAULT false,
	"claimed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experience_points_log" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"source" varchar(50),
	"source_id" varchar(255),
	"points_earned" integer NOT NULL,
	"description" varchar(255),
	"earned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gamification_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"element_type" varchar(100) NOT NULL,
	"avg_engagement_increase" numeric(5, 2),
	"avg_retention_impact" numeric(5, 2),
	"avg_goal_completion_impact" numeric(5, 2),
	"optimal_difficulty" integer,
	"optimal_reward_timing" varchar(100),
	"most_effective_for" text,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gamification_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"total_experience_points" integer DEFAULT 0,
	"current_level" integer DEFAULT 1,
	"experience_to_next_level" integer DEFAULT 100,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"total_days_active" integer DEFAULT 0,
	"total_achievements" integer DEFAULT 0,
	"total_badges" integer DEFAULT 0,
	"total_milestones" integer DEFAULT 0,
	"motivation_type" varchar(50),
	"likes_competition" boolean DEFAULT false,
	"likes_collaboration" boolean DEFAULT true,
	"likes_challenges" boolean DEFAULT true,
	"likes_rewards" boolean DEFAULT true,
	"most_motivating_rewards" text,
	"optimal_challenge_difficulty" integer,
	"motivation_patterns" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leaderboard_entries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"leaderboard_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"rank" integer,
	"score" integer,
	"opted_in" boolean DEFAULT false,
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leaderboards" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"leaderboard_name" varchar(255) NOT NULL,
	"description" text,
	"leaderboard_type" varchar(50),
	"time_period" varchar(50),
	"opt_in_only" boolean DEFAULT true,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"experience_points" integer,
	"related_to" varchar(255),
	"achieved_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motivation_boosts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"trigger_type" varchar(50),
	"boost_type" varchar(50),
	"message" text,
	"action_suggested" varchar(255),
	"opened" boolean DEFAULT false,
	"action_taken" boolean DEFAULT false,
	"sent_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_achievements" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"achievement_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"progress" integer DEFAULT 0,
	"completed" boolean DEFAULT false,
	"unlocked_at" timestamp,
	"display_on_profile" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_badges" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"badge_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"awarded_for" text,
	"display_on_profile" boolean DEFAULT true,
	"awarded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_challenges" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"challenge_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"progress" integer DEFAULT 0,
	"completed" boolean DEFAULT false,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"attempts" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_rate_limits" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_integration_id" varchar(255) NOT NULL,
	"requests_per_hour" integer,
	"requests_per_day" integer,
	"requests_this_hour" integer DEFAULT 0,
	"requests_today" integer DEFAULT 0,
	"hour_reset_at" timestamp,
	"day_reset_at" timestamp,
	"throttled" boolean DEFAULT false,
	"throttled_until" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "available_integrations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"integration_name" varchar(255) NOT NULL,
	"description" text,
	"provider" varchar(255) NOT NULL,
	"category" varchar(50),
	"auth_type" varchar(50),
	"capabilities" text,
	"data_types_supported" text,
	"supports_realtime" boolean DEFAULT false,
	"supports_bidirectional" boolean DEFAULT false,
	"api_endpoint" varchar(500),
	"api_documentation" varchar(500),
	"rate_limit_per_hour" integer,
	"active" boolean DEFAULT true,
	"beta" boolean DEFAULT false,
	"total_users" integer DEFAULT 0,
	"avg_satisfaction_rating" numeric(4, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_mapping_rules" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"integration_id" varchar(255) NOT NULL,
	"source_field" varchar(255) NOT NULL,
	"source_data_type" varchar(100),
	"destination_table" varchar(255) NOT NULL,
	"destination_field" varchar(255) NOT NULL,
	"transformation_rule" text,
	"validation_rule" text,
	"required" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "export_requests" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"export_type" varchar(50),
	"export_format" varchar(50),
	"filters" text,
	"status" varchar(50),
	"file_path" varchar(500),
	"file_size" integer,
	"download_url" varchar(500),
	"expires_at" timestamp,
	"error_message" text,
	"requested_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exported_data" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_integration_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"data_type" varchar(100) NOT NULL,
	"source_id" varchar(255) NOT NULL,
	"source_type" varchar(100) NOT NULL,
	"data_payload" text,
	"destination_id" varchar(255),
	"status" varchar(50),
	"error_message" text,
	"exported_at" timestamp DEFAULT now(),
	"confirmed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "imported_data" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_integration_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"data_type" varchar(50),
	"source_id" varchar(255),
	"data_payload" text,
	"data_timestamp" timestamp NOT NULL,
	"mapped_to_id" varchar(255),
	"mapped_to_type" varchar(100),
	"data_quality" varchar(50),
	"validation_errors" text,
	"imported_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"integration_id" varchar(255) NOT NULL,
	"total_users" integer DEFAULT 0,
	"active_users" integer DEFAULT 0,
	"avg_syncs_per_day" numeric(6, 2),
	"avg_records_per_sync" numeric(8, 2),
	"success_rate" numeric(5, 2),
	"avg_data_quality" numeric(4, 2),
	"avg_satisfaction_rating" numeric(4, 2),
	"avg_behavior_impact" numeric(5, 2),
	"optimal_sync_frequency" varchar(100),
	"common_errors" text,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"auto_sync_enabled" boolean DEFAULT true,
	"sync_frequency" varchar(50),
	"data_sharing" varchar(50),
	"total_integrations" integer DEFAULT 0,
	"active_integrations" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_recommendations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"integration_id" varchar(255) NOT NULL,
	"reason" text,
	"potential_value" text,
	"confidence" numeric(5, 2),
	"status" varchar(50),
	"user_feedback" text,
	"created_at" timestamp DEFAULT now(),
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sync_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_integration_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"sync_type" varchar(50),
	"status" varchar(50),
	"records_processed" integer DEFAULT 0,
	"records_successful" integer DEFAULT 0,
	"records_failed" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"duration_seconds" integer,
	"error_message" text,
	"error_details" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_integrations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"integration_id" varchar(255) NOT NULL,
	"status" varchar(50),
	"access_token" varchar(500),
	"refresh_token" varchar(500),
	"token_expires_at" timestamp,
	"api_key" varchar(500),
	"sync_enabled" boolean DEFAULT true,
	"sync_frequency" varchar(50),
	"last_sync_at" timestamp,
	"next_sync_at" timestamp,
	"data_types_to_sync" text,
	"total_syncs" integer DEFAULT 0,
	"total_records_imported" integer DEFAULT 0,
	"total_records_exported" integer DEFAULT 0,
	"last_error" text,
	"error_count" integer DEFAULT 0,
	"satisfaction_rating" integer,
	"connected_at" timestamp DEFAULT now(),
	"disconnected_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_events" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"webhook_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_payload" text,
	"processed" boolean DEFAULT false,
	"processed_at" timestamp,
	"processing_error" text,
	"received_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhooks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_integration_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"webhook_url" varchar(500) NOT NULL,
	"webhook_secret" varchar(255),
	"event_types" text,
	"active" boolean DEFAULT true,
	"total_received" integer DEFAULT 0,
	"last_received_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_challenges" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"challenge_name" varchar(255) NOT NULL,
	"challenge_type" varchar(50),
	"item_count" integer,
	"time_limit" integer,
	"items_recalled" integer,
	"accuracy" numeric(5, 2),
	"time_used" integer,
	"score" integer,
	"personal_best" boolean,
	"attempt_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"item_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"content" text,
	"category" varchar(255),
	"tags" text,
	"encoding_technique" varchar(50),
	"palace_location" varchar(255),
	"visual_image" text,
	"mnemonic_device" text,
	"related_items" text,
	"existing_knowledge" text,
	"importance" integer,
	"ease_factor" numeric(4, 2) DEFAULT '2.5',
	"interval" integer DEFAULT 1,
	"repetitions" integer DEFAULT 0,
	"next_review_date" timestamp,
	"total_reviews" integer DEFAULT 0,
	"successful_recalls" integer DEFAULT 0,
	"retention_rate" numeric(5, 2),
	"mastered" boolean DEFAULT false,
	"mastered_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_mastery_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"technique" varchar(100) NOT NULL,
	"item_type" varchar(100),
	"avg_retention_rate" numeric(5, 2),
	"avg_recall_speed" numeric(6, 2),
	"optimal_review_interval" integer,
	"optimal_session_duration" integer,
	"most_effective_for" text,
	"review_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_mastery_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"self_assessed_memory" integer,
	"primary_goal" varchar(50),
	"preferred_techniques" text,
	"learning_style" varchar(50),
	"daily_review_time" varchar(10),
	"weekly_goal_minutes" integer,
	"optimal_review_time" varchar(100),
	"personal_forgetting_curve" text,
	"most_effective_techniques" text,
	"optimal_review_intervals" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"achieved_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_palaces" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"palace_name" varchar(255) NOT NULL,
	"description" text,
	"locations" text,
	"purpose" varchar(255),
	"item_count" integer DEFAULT 0,
	"avg_recall_rate" numeric(5, 2),
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_reviews" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"item_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"review_date" timestamp NOT NULL,
	"review_type" varchar(50),
	"recalled" boolean NOT NULL,
	"recall_speed" varchar(50),
	"confidence" integer,
	"difficulty_rating" varchar(50) NOT NULL,
	"time_to_recall" integer,
	"review_context" varchar(255),
	"distractions" boolean,
	"next_interval" integer,
	"next_review_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "memory_technique_practice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"technique" varchar(50),
	"practice_type" varchar(255),
	"duration" integer,
	"items_attempted" integer,
	"items_recalled" integer,
	"accuracy_rate" numeric(5, 2),
	"difficulty" integer,
	"improvement_from_last" numeric(6, 2),
	"notes" text,
	"challenges_faced" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "name_face_memory" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"person_name" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"face_photo" varchar(255),
	"outstanding_feature" text,
	"name_association" text,
	"substitute_word" varchar(255),
	"mental_link" text,
	"where_met" varchar(255),
	"when_met" timestamp,
	"relationship" varchar(255),
	"occupation" varchar(255),
	"interests" text,
	"mutual_connections" text,
	"conversation_topics" text,
	"total_encounters" integer DEFAULT 1,
	"successful_recalls" integer DEFAULT 0,
	"last_encounter" timestamp,
	"importance" integer,
	"mastered" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "name_recall_practice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name_face_id" varchar(255) NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"practice_type" varchar(50),
	"recalled" boolean,
	"recall_speed" varchar(50),
	"confidence" integer,
	"time_to_recall" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "number_memory" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"number" varchar(255) NOT NULL,
	"number_type" varchar(50),
	"label" varchar(255),
	"phonetic_words" text,
	"visual_story" text,
	"chunks" text,
	"total_recalls" integer DEFAULT 0,
	"successful_recalls" integer DEFAULT 0,
	"mastered" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sleep_memory_tracking" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"tracking_date" timestamp NOT NULL,
	"studied_before_sleep" boolean,
	"study_topics" text,
	"study_duration" integer,
	"sleep_quality" integer,
	"sleep_duration" numeric(3, 1),
	"deep_sleep_minutes" integer,
	"morning_recall_test" boolean,
	"morning_recall_accuracy" numeric(5, 2),
	"consolidation_effect" numeric(6, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_affirmations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"affirmation_date" timestamp NOT NULL,
	"affirmations" text,
	"practice_method" varchar(50),
	"repetitions" integer,
	"belief_level" integer,
	"impact_on_mood" integer,
	"impact_on_behavior" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "identity_transformations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"old_identity_statement" text,
	"old_behaviors" text,
	"old_beliefs" text,
	"new_identity_statement" text,
	"new_behaviors" text,
	"new_beliefs" text,
	"supporting_principles" text,
	"transformation_progress" integer,
	"evidence_of_change" text,
	"start_date" timestamp,
	"target_date" timestamp,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "principle_goals" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"goal_title" varchar(255) NOT NULL,
	"goal_description" text,
	"primary_principle" varchar(255) NOT NULL,
	"supporting_principles" text,
	"identity_statement" text,
	"target_date" timestamp,
	"milestones" text,
	"progress" integer,
	"why_it_matters" text,
	"status" varchar(50),
	"achieved_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "principle_practices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"practice_date" timestamp NOT NULL,
	"principle_id" varchar(255) NOT NULL,
	"principle_number" integer NOT NULL,
	"practice_type" varchar(50),
	"time_spent" integer,
	"completed" boolean DEFAULT true,
	"reflection_notes" text,
	"insights" text,
	"actions_taken" text,
	"challenges_faced" text,
	"wins_achieved" text,
	"impact_on_day" integer,
	"embodiment_level" integer,
	"mood_before" varchar(100),
	"mood_after" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "principle_progress" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"principle_id" varchar(255) NOT NULL,
	"mastery_level" integer,
	"total_practices" integer,
	"current_streak" integer,
	"longest_streak" integer,
	"avg_embodiment_level" numeric(4, 2),
	"avg_life_impact" numeric(4, 2),
	"life_areas_improved" text,
	"milestones" text,
	"last_practiced" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "principles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"principle_number" integer NOT NULL,
	"principle_name" varchar(255) NOT NULL,
	"identity_statement" varchar(255) NOT NULL,
	"core_teaching" text,
	"why_it_matters" text,
	"daily_practice" text,
	"reflection_prompts" text,
	"key_habits" text,
	"life_applications" text,
	"research_basis" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transformative_moments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"moment_date" timestamp NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"related_principle" varchar(255),
	"moment_type" varchar(50),
	"significance" integer,
	"life_areas_affected" text,
	"insights" text,
	"lessons_learned" text,
	"how_to_maintain" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transformative_principles_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"principle_id" varchar(255) NOT NULL,
	"avg_life_impact" numeric(5, 2),
	"avg_embodiment_level" numeric(5, 2),
	"relationship_improvement" numeric(5, 2),
	"career_improvement" numeric(5, 2),
	"health_improvement" numeric(5, 2),
	"mental_health_improvement" numeric(5, 2),
	"optimal_practice_frequency" varchar(100),
	"optimal_practice_format" varchar(100),
	"most_effective_for" text,
	"practice_count" integer,
	"user_count" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transformative_principles_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"overall_growth" integer,
	"primary_principle" varchar(50),
	"preferred_practice_time" varchar(50),
	"practice_frequency" varchar(50),
	"reminders_enabled" boolean DEFAULT true,
	"reminder_time" varchar(10),
	"most_impactful_principles" text,
	"optimal_practice_format" text,
	"principle_life_correlations" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weekly_principle_reviews" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"week_start_date" timestamp NOT NULL,
	"overall_growth" integer,
	"focus_principle" varchar(255),
	"biggest_wins" text,
	"principles_embodied" text,
	"biggest_challenges" text,
	"principles_needed" text,
	"key_insights" text,
	"lessons_learned" text,
	"focus_for_next_week" varchar(255),
	"commitments" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "platform_recommendations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"recommendation_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"how_to_implement" text,
	"evidence_level" varchar(50),
	"primary_research_id" varchar(255) NOT NULL,
	"supporting_research_ids" text,
	"confidence_score" integer,
	"domain" varchar(100) NOT NULL,
	"target_audience" text,
	"contraindications" text,
	"total_uses" integer DEFAULT 0,
	"success_rate" numeric(5, 2),
	"avg_effectiveness_rating" numeric(4, 2),
	"status" varchar(50),
	"superseded_by" varchar(255),
	"superseded_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pseudoscience_blocklist" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"claim" text NOT NULL,
	"category" varchar(50),
	"reason" text NOT NULL,
	"evidence_against" text,
	"severity" varchar(50),
	"action" varchar(50),
	"detection_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "research_monitoring" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"topic" varchar(255) NOT NULL,
	"keywords" text,
	"domain" varchar(100),
	"monitoring_frequency" varchar(50),
	"alert_on_high_quality" boolean DEFAULT true,
	"alert_on_contradiction" boolean DEFAULT true,
	"last_checked_at" timestamp,
	"new_studies_found" integer DEFAULT 0,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "research_quality_reviews" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"research_id" varchar(255) NOT NULL,
	"reviewer_id" varchar(255) NOT NULL,
	"reviewer_name" varchar(255),
	"reviewer_credentials" text,
	"methodology_score" integer,
	"sample_size_adequate" boolean,
	"statistical_rigor" integer,
	"clinical_relevance" integer,
	"replication_status" varchar(50),
	"selection_bias" boolean,
	"publication_bias" boolean,
	"confirmation_bias" boolean,
	"overall_quality" varchar(50),
	"recommend_for_platform" boolean NOT NULL,
	"recommended_evidence_level" varchar(50),
	"review_notes" text,
	"concerns" text,
	"reviewed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validated_research" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"authors" text NOT NULL,
	"journal" varchar(255) NOT NULL,
	"publication_year" integer NOT NULL,
	"doi" varchar(255),
	"pubmed_id" varchar(50),
	"url" varchar(500),
	"study_type" varchar(50),
	"evidence_level" varchar(50),
	"sample_size" integer,
	"has_control_group" boolean,
	"is_randomized" boolean,
	"is_blinded" boolean,
	"has_replication" boolean,
	"effect_size" numeric(6, 3),
	"p_value" numeric(10, 9),
	"confidence_interval" varchar(100),
	"journal_impact_factor" numeric(6, 3),
	"is_peer_reviewed" boolean NOT NULL,
	"is_open_access" boolean,
	"has_conflict_of_interest" boolean,
	"funding_source" text,
	"industry_sponsored" boolean,
	"domain" varchar(50),
	"key_findings" text NOT NULL,
	"clinical_significance" text,
	"limitations" text,
	"practical_application" text,
	"target_population" text,
	"contraindications" text,
	"validation_status" varchar(50),
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp,
	"review_notes" text,
	"citation_count" integer DEFAULT 0,
	"recommendation_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chart_interactions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"widget_id" varchar(255),
	"interaction_type" varchar(50),
	"view_duration" integer,
	"action_taken" boolean DEFAULT false,
	"action_type" varchar(100),
	"interaction_timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comparison_views" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"comparison_type" varchar(50),
	"metric" varchar(255) NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"current_value" numeric(10, 2),
	"comparison_period_start" timestamp NOT NULL,
	"comparison_period_end" timestamp NOT NULL,
	"comparison_value" numeric(10, 2),
	"absolute_change" numeric(10, 2),
	"percent_change" numeric(6, 2),
	"interpretation" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_reports" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"report_name" varchar(255) NOT NULL,
	"description" text,
	"report_type" varchar(50),
	"metrics" text,
	"time_range" text,
	"visualizations" text,
	"scheduled" boolean DEFAULT false,
	"schedule_frequency" varchar(50),
	"export_format" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dashboard_configurations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"dashboard_name" varchar(255) NOT NULL,
	"description" text,
	"layout" text,
	"widgets" text,
	"is_default" boolean DEFAULT false,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "heatmap_data" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"heatmap_type" varchar(50),
	"date" timestamp NOT NULL,
	"intensity" integer,
	"day_of_week" integer,
	"hour_of_day" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestone_visualizations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"timeline_type" varchar(50),
	"related_id" varchar(255),
	"milestones" text,
	"current_position" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "progress_celebrations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"celebration_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(255),
	"color" varchar(50),
	"animation" varchar(100),
	"related_id" varchar(255),
	"related_type" varchar(100),
	"displayed" boolean DEFAULT false,
	"displayed_at" timestamp,
	"celebration_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "progress_snapshots" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"snapshot_date" timestamp NOT NULL,
	"overall_score" integer,
	"physical_score" integer,
	"mental_score" integer,
	"emotional_score" integer,
	"spiritual_score" integer,
	"habit_completion_rate" numeric(5, 2),
	"active_habits" integer,
	"goals_on_track" integer,
	"goals_at_risk" integer,
	"goals_achieved_this_period" integer,
	"avg_sleep_duration" numeric(4, 2),
	"avg_sleep_quality" numeric(4, 2),
	"avg_stress_level" numeric(4, 2),
	"avg_hrv" numeric(6, 2),
	"avg_mood" numeric(4, 2),
	"avg_energy" numeric(4, 2),
	"days_active" integer,
	"journal_entries" integer,
	"achievements_unlocked" integer,
	"experience_points" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report_generations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"report_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"generated_at" timestamp DEFAULT now(),
	"report_data" text,
	"file_path" varchar(500),
	"status" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trend_data" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"metric_name" varchar(255) NOT NULL,
	"metric_category" varchar(100),
	"period_type" varchar(50),
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"value" numeric(10, 2),
	"trend_direction" varchar(50),
	"change_percent" numeric(6, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visualization_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"widget_type" varchar(100) NOT NULL,
	"avg_view_duration" numeric(6, 2),
	"avg_views_per_user" numeric(6, 2),
	"action_rate" numeric(5, 2),
	"avg_behavior_change" numeric(5, 2),
	"avg_helpfulness_rating" numeric(4, 2),
	"optimal_time_range" varchar(100),
	"optimal_update_frequency" varchar(100),
	"most_effective_for" text,
	"user_count" integer,
	"total_views" integer,
	"last_calculated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visualization_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"default_dashboard" varchar(50),
	"preferred_chart_types" text,
	"default_time_range" varchar(50),
	"show_comparisons" boolean DEFAULT true,
	"show_trendlines" boolean DEFAULT true,
	"show_goal_lines" boolean DEFAULT true,
	"most_viewed_charts" text,
	"most_actionable_charts" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visualization_widgets" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"widget_name" varchar(255) NOT NULL,
	"description" text,
	"widget_type" varchar(50),
	"data_source" varchar(255) NOT NULL,
	"data_query" text,
	"configuration" text,
	"refresh_interval" integer,
	"total_uses" integer DEFAULT 0,
	"avg_helpfulness_rating" numeric(4, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenge_completions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"challenge_category" varchar(50),
	"challenge_name" varchar(255) NOT NULL,
	"description" text,
	"start_date" timestamp,
	"completion_date" timestamp,
	"what_you_learned" text,
	"how_you_grew" text,
	"badge_earned" varchar(255),
	"status" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "developmental_assets" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"family_support" integer,
	"positive_family_communication" integer,
	"other_adult_relationships" integer,
	"caring_neighborhood" integer,
	"community_values_youth" integer,
	"youth_as_resources" integer,
	"service_to_others" integer,
	"safety" integer,
	"family_boundaries" integer,
	"school_boundaries" integer,
	"neighborhood_boundaries" integer,
	"adult_role_models" integer,
	"positive_peer_influence" integer,
	"high_expectations" integer,
	"creative_activities" integer,
	"youth_programs" integer,
	"religious_community" integer,
	"time_at_home" integer,
	"achievement_motivation" integer,
	"school_engagement" integer,
	"homework" integer,
	"bonding_to_school" integer,
	"reading_for_pleasure" integer,
	"caring" integer,
	"equality" integer,
	"social_justice" integer,
	"integrity" integer,
	"honesty" integer,
	"responsibility" integer,
	"restraint" integer,
	"planning_decision_making" integer,
	"interpersonal_competence" integer,
	"cultural_competence" integer,
	"resistance_skills" integer,
	"peaceful_conflict_resolution" integer,
	"personal_power" integer,
	"self_esteem" integer,
	"sense_of_purpose" integer,
	"positive_view_of_future" integer,
	"total_assets" integer,
	"assessment_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "life_skills_development" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"skill_category" varchar(50),
	"skill_name" varchar(255) NOT NULL,
	"current_level" varchar(50),
	"target_level" varchar(50),
	"learning_method" varchar(50),
	"resources" text,
	"practice_count" integer DEFAULT 0,
	"last_practiced" timestamp,
	"mastery_achieved" boolean DEFAULT false,
	"mastery_date" timestamp,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "masculinity_reflections" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"reflection_date" timestamp NOT NULL,
	"prompt_type" varchar(50),
	"reflection" text NOT NULL,
	"insights" text,
	"action_steps" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mentorship_connections" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"mentor_type" varchar(50),
	"mentor_name" varchar(255),
	"mentor_area" varchar(255),
	"connection_date" timestamp,
	"meeting_frequency" varchar(50),
	"focus_areas" text,
	"sessions_completed" integer DEFAULT 0,
	"last_meeting" timestamp,
	"next_meeting" timestamp,
	"impact_rating" integer,
	"key_learnings" text,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "young_men_milestones" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"profile_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"milestone_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"achieved_date" timestamp,
	"why_it_matters" text,
	"who_you_became" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "young_men_profiles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"living_situation" varchar(50),
	"education_status" varchar(50),
	"employment_status" varchar(50),
	"has_father_figure" boolean DEFAULT false,
	"has_mother_figure" boolean DEFAULT false,
	"has_mentor" boolean DEFAULT false,
	"has_male_role_model" boolean DEFAULT false,
	"role_model_gaps" text,
	"primary_needs" text,
	"primary_goal" varchar(50),
	"specific_goals" text,
	"main_challenges" text,
	"strengths" text,
	"interests" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "aiChatConversations" ADD CONSTRAINT "aiChatConversations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aiChatConversations" ADD CONSTRAINT "aiChatConversations_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aiChatConversations" ADD CONSTRAINT "aiChatConversations_subscriptionId_subscriptions_id_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aiChatMessages" ADD CONSTRAINT "aiChatMessages_conversationId_aiChatConversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."aiChatConversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aiInsights" ADD CONSTRAINT "aiInsights_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availabilityExceptions" ADD CONSTRAINT "availabilityExceptions_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_files" ADD CONSTRAINT "client_files_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_files" ADD CONSTRAINT "client_files_conversationId_aiChatConversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."aiChatConversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_files" ADD CONSTRAINT "client_files_sessionId_human_session_bookings_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."human_session_bookings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientPatterns" ADD CONSTRAINT "clientPatterns_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientPredictions" ADD CONSTRAINT "clientPredictions_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientPreferences" ADD CONSTRAINT "clientPreferences_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coachAvailability" ADD CONSTRAINT "coachAvailability_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coachFeedback" ADD CONSTRAINT "coachFeedback_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coachFeedback" ADD CONSTRAINT "coachFeedback_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coachNotifications" ADD CONSTRAINT "coachNotifications_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coachPrivateNotes" ADD CONSTRAINT "coachPrivateNotes_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coachPrivateNotes" ADD CONSTRAINT "coachPrivateNotes_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complianceFlags" ADD CONSTRAINT "complianceFlags_conversationId_aiChatConversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."aiChatConversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complianceFlags" ADD CONSTRAINT "complianceFlags_messageId_aiChatMessages_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."aiChatMessages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complianceFlags" ADD CONSTRAINT "complianceFlags_reviewedBy_users_id_fk" FOREIGN KEY ("reviewedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "copingStrategies" ADD CONSTRAINT "copingStrategies_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discountCodeUsage" ADD CONSTRAINT "discountCodeUsage_discountCodeId_discountCodes_id_fk" FOREIGN KEY ("discountCodeId") REFERENCES "public"."discountCodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discountCodeUsage" ADD CONSTRAINT "discountCodeUsage_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discountCodeUsage" ADD CONSTRAINT "discountCodeUsage_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discountCodes" ADD CONSTRAINT "discountCodes_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emotionLogs" ADD CONSTRAINT "emotionLogs_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emotionLogs" ADD CONSTRAINT "emotionLogs_journalEntryId_journalEntries_id_fk" FOREIGN KEY ("journalEntryId") REFERENCES "public"."journalEntries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalationQueue" ADD CONSTRAINT "escalationQueue_conversationId_aiChatConversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."aiChatConversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalationQueue" ADD CONSTRAINT "escalationQueue_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalationQueue" ADD CONSTRAINT "escalationQueue_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalationQueue" ADD CONSTRAINT "escalationQueue_assignedTo_coaches_id_fk" FOREIGN KEY ("assignedTo") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "human_session_bookings" ADD CONSTRAINT "human_session_bookings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "human_session_bookings" ADD CONSTRAINT "human_session_bookings_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "human_session_bookings" ADD CONSTRAINT "human_session_bookings_subscriptionId_subscriptions_id_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journalEntries" ADD CONSTRAINT "journalEntries_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionRecordings" ADD CONSTRAINT "sessionRecordings_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionRecordings" ADD CONSTRAINT "sessionRecordings_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionRecordings" ADD CONSTRAINT "sessionRecordings_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionReminders" ADD CONSTRAINT "sessionReminders_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionSummaries" ADD CONSTRAINT "sessionSummaries_sessionId_sessions_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionSummaries" ADD CONSTRAINT "sessionSummaries_recordingId_sessionRecordings_id_fk" FOREIGN KEY ("recordingId") REFERENCES "public"."sessionRecordings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionTypes" ADD CONSTRAINT "sessionTypes_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_coachId_coaches_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_sessionTypeId_sessionTypes_id_fk" FOREIGN KEY ("sessionTypeId") REFERENCES "public"."sessionTypes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "similarCases" ADD CONSTRAINT "similarCases_createdBy_coaches_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_subscriptionId_subscriptions_id_fk" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dailyCheckins" ADD CONSTRAINT "dailyCheckins_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disciplineEvents" ADD CONSTRAINT "disciplineEvents_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habitCompletions" ADD CONSTRAINT "habitCompletions_habitId_habits_id_fk" FOREIGN KEY ("habitId") REFERENCES "public"."habits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identityProfiles" ADD CONSTRAINT "identityProfiles_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "microHabits" ADD CONSTRAINT "microHabits_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adaptiveOutcomeTracking" ADD CONSTRAINT "adaptiveOutcomeTracking_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendationFeedback" ADD CONSTRAINT "recommendationFeedback_clientId_clients_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "autismOutcomeTracking" ADD CONSTRAINT "autismOutcomeTracking_profileId_autismProfiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."autismProfiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "autismProfiles" ADD CONSTRAINT "autismProfiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dietaryInterventions" ADD CONSTRAINT "dietaryInterventions_profileId_autismProfiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."autismProfiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventionPlans" ADD CONSTRAINT "interventionPlans_profileId_autismProfiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."autismProfiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplementTracking" ADD CONSTRAINT "supplementTracking_profileId_autismProfiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."autismProfiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "therapySessions" ADD CONSTRAINT "therapySessions_profileId_autismProfiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."autismProfiles"("id") ON DELETE no action ON UPDATE no action;