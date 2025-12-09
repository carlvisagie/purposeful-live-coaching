-- Create AI Coach tables only (no foreign keys to avoid conflicts)

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

CREATE TABLE IF NOT EXISTS "aiChatMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversationId" integer NOT NULL,
	"role" varchar(50),
	"content" text NOT NULL,
	"emotionDetected" varchar(100),
	"crisisFlag" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);

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
