-- Voice Coaching Preferences Table
CREATE TABLE IF NOT EXISTS "voice_coaching_preferences" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"preferred_style" varchar(50),
	"preferred_pace" varchar(50),
	"preferred_energy" varchar(50),
	"feedback_directness" varchar(50),
	"challenge_level" varchar(50),
	"effective_approaches" text,
	"ineffective_approaches" text,
	"coach_notes" text,
	"known_triggers" text,
	"preferred_voice" varchar(50),
	"total_sessions" integer DEFAULT 0,
	"avg_session_rating" numeric(3, 1),
	"last_session_date" timestamp,
	"rapport_level" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

--> statement-breakpoint

-- Voice Coaching Feedback Table
CREATE TABLE IF NOT EXISTS "voice_coaching_feedback" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"preference_id" varchar(255),
	"session_mode" varchar(50),
	"session_duration" integer,
	"overall_rating" integer,
	"style_rating" varchar(50),
	"pace_rating" varchar(50),
	"helpfulness_rating" integer,
	"what_worked" text,
	"what_didnt_work" text,
	"suggestions" text,
	"starting_mood" varchar(50),
	"ending_mood" varchar(50),
	"confidence_change" integer,
	"would_recommend" boolean,
	"created_at" timestamp DEFAULT now()
);

--> statement-breakpoint

-- Voice Coaching Session Logs Table
CREATE TABLE IF NOT EXISTS "voice_coaching_session_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_mode" varchar(50),
	"voice_used" varchar(50),
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"duration_seconds" integer,
	"user_speaking_time" integer,
	"coach_speaking_time" integer,
	"silence_time" integer,
	"emotional_journey" text,
	"breakthrough_moments" text,
	"struggle_moments" text,
	"adaptations_made" text,
	"transcript_summary" text,
	"created_at" timestamp DEFAULT now()
);
