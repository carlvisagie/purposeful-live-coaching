CREATE TABLE "client_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"speechPatterns" jsonb,
	"emotionalPatterns" jsonb,
	"communicationStyle" jsonb,
	"preferredTopics" jsonb,
	"avoidedTopics" jsonb,
	"sessionPreferences" jsonb,
	"strengths" jsonb,
	"challenges" jsonb,
	"goals" jsonb,
	"confidenceScore" integer DEFAULT 0,
	"lastUpdatedFromSession" timestamp,
	"totalSessionsAnalyzed" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "face_embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"faceEmbedding" text NOT NULL,
	"faceEmbeddingVersion" varchar(20) DEFAULT '1.0',
	"enrollmentPhotos" integer DEFAULT 3,
	"enrollmentQuality" varchar(20),
	"lightingConditions" varchar(50),
	"verificationCount" integer DEFAULT 0,
	"lastVerifiedAt" timestamp,
	"verificationAccuracy" integer DEFAULT 0,
	"isActive" varchar(10) DEFAULT 'active',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recognition_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"sessionId" integer,
	"recognitionType" varchar(20) NOT NULL,
	"recognitionResult" varchar(20) NOT NULL,
	"confidenceScore" integer,
	"attemptedUserId" integer,
	"actualUserId" integer,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voice_prints" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"voicePrint" text NOT NULL,
	"voicePrintVersion" varchar(20) DEFAULT '1.0',
	"enrollmentSamples" integer DEFAULT 3,
	"enrollmentQuality" varchar(20),
	"verificationCount" integer DEFAULT 0,
	"lastVerifiedAt" timestamp,
	"verificationAccuracy" integer DEFAULT 0,
	"isActive" varchar(10) DEFAULT 'active',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coachAvailability" ALTER COLUMN "isActive" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "coachAvailability" ALTER COLUMN "isActive" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "coachAvailability" ALTER COLUMN "isActive" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "client_features" ADD CONSTRAINT "client_features_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "face_embeddings" ADD CONSTRAINT "face_embeddings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recognition_events" ADD CONSTRAINT "recognition_events_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_prints" ADD CONSTRAINT "voice_prints_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;