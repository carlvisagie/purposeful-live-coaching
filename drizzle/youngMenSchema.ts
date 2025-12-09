/**
 * YOUNG MEN WITHOUT ROLE MODELS MODULE
 * Evidence-based approach using Positive Youth Development, Mentorship Research, and Masculine Identity Theory
 * Research sources: Search Institute (40 Developmental Assets), Big Brothers Big Sisters research, APA Guidelines for Boys and Men
 */

import { boolean, decimal, int, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Young Men Profiles
export const youngMenProfiles = pgTable("young_men_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  age: integer("age").notNull(),
  
  // Life Situation
  livingSituation: pgEnum("living_situation", ["with_parents", "single_parent_home", "foster_care", "independent", "homeless", "other"]),
  educationStatus: pgEnum("education_status", ["in_school", "dropped_out", "graduated_hs", "in_college", "working"]),
  employmentStatus: pgEnum("employment_status", ["student", "employed", "unemployed", "seeking_work"]),
  
  // Role Model Situation
  hasFatherFigure: boolean("has_father_figure").default(false),
  hasMotherFigure: boolean("has_mother_figure").default(false),
  hasMentor: boolean("has_mentor").default(false),
  hasMaleRoleModel: boolean("has_male_role_model").default(false),
  
  roleModelGaps: text("role_model_gaps"), // JSON array: what's missing
  
  // Primary Needs (based on 40 Developmental Assets)
  primaryNeeds: text("primary_needs"), // JSON array: ["guidance", "emotional_support", "life_skills", "career_advice", etc.]
  
  // Goals
  primaryGoal: pgEnum("primary_goal", [
    "find_direction",
    "build_confidence",
    "learn_life_skills",
    "career_guidance",
    "emotional_regulation",
    "healthy_relationships",
    "financial_independence",
    "overcome_trauma"
  ]),
  
  specificGoals: text("specific_goals"), // JSON array
  
  // Challenges
  mainChallenges: text("main_challenges"), // JSON array
  
  // Strengths (asset-based approach)
  strengths: text("strengths"), // JSON array
  interests: text("interests"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Developmental Assets Tracking (Search Institute's 40 Assets)
export const developmentalAssets = pgTable("developmental_assets", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // EXTERNAL ASSETS
  // Support (4 assets)
  familySupport: integer("family_support"), // 1-10
  positiveFamilyCommunication: integer("positive_family_communication"),
  otherAdultRelationships: integer("other_adult_relationships"),
  caringNeighborhood: integer("caring_neighborhood"),
  
  // Empowerment (4 assets)
  communityValuesYouth: integer("community_values_youth"),
  youthAsResources: integer("youth_as_resources"),
  serviceToOthers: integer("service_to_others"),
  safety: integer("safety"),
  
  // Boundaries & Expectations (6 assets)
  familyBoundaries: integer("family_boundaries"),
  schoolBoundaries: integer("school_boundaries"),
  neighborhoodBoundaries: integer("neighborhood_boundaries"),
  adultRoleModels: integer("adult_role_models"),
  positiveInfluence: integer("positive_peer_influence"),
  highExpectations: integer("high_expectations"),
  
  // Constructive Use of Time (4 assets)
  creativeActivities: integer("creative_activities"),
  youthPrograms: integer("youth_programs"),
  religiousCommunity: integer("religious_community"),
  timeAtHome: integer("time_at_home"),
  
  // INTERNAL ASSETS
  // Commitment to Learning (5 assets)
  achievementMotivation: integer("achievement_motivation"),
  schoolEngagement: integer("school_engagement"),
  homework: integer("homework"),
  bondingToSchool: integer("bonding_to_school"),
  readingForPleasure: integer("reading_for_pleasure"),
  
  // Positive Values (6 assets)
  caring: integer("caring"),
  equality: integer("equality"),
  socialJustice: integer("social_justice"),
  integrity: integer("integrity"),
  honesty: integer("honesty"),
  responsibility: integer("responsibility"),
  restraint: integer("restraint"),
  
  // Social Competencies (5 assets)
  planningDecisionMaking: integer("planning_decision_making"),
  interpersonalCompetence: integer("interpersonal_competence"),
  culturalCompetence: integer("cultural_competence"),
  resistanceSkills: integer("resistance_skills"),
  peacefulConflictResolution: integer("peaceful_conflict_resolution"),
  
  // Positive Identity (4 assets)
  personalPower: integer("personal_power"),
  selfEsteem: integer("self_esteem"),
  senseOfPurpose: integer("sense_of_purpose"),
  positiveViewOfFuture: integer("positive_view_of_future"),
  
  // Overall Score
  totalAssets: integer("total_assets"), // Sum of all assets
  
  assessmentDate: timestamp("assessment_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Life Skills Development
export const lifeSkillsDevelopment = pgTable("life_skills_development", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  skillCategory: pgEnum("skill_category", [
    "financial_literacy",
    "cooking_nutrition",
    "personal_hygiene",
    "home_maintenance",
    "car_maintenance",
    "time_management",
    "communication",
    "conflict_resolution",
    "job_skills",
    "emotional_regulation"
  ]),
  
  skillName: varchar("skill_name", { length: 255 }).notNull(),
  
  // Current Level
  currentLevel: pgEnum("current_level", ["none", "beginner", "intermediate", "proficient"]),
  targetLevel: pgEnum("target_level", ["beginner", "intermediate", "proficient", "expert"]),
  
  // Learning Resources
  learningMethod: pgEnum("learning_method", ["video_tutorial", "mentor_teaching", "practice", "course", "reading"]),
  resources: text("resources"), // JSON array
  
  // Practice Log
  practiceCount: integer("practice_count").default(0),
  lastPracticed: timestamp("last_practiced"),
  
  // Mastery
  masteryAchieved: boolean("mastery_achieved").default(false),
  masteryDate: timestamp("mastery_date"),
  
  status: pgEnum("status", ["not_started", "learning", "practicing", "mastered"]),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mentorship Connections (virtual or real)
export const mentorshipConnections = pgTable("mentorship_connections", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  mentorType: pgEnum("mentor_type", [
    "platform_mentor", // Matched through platform
    "real_life_mentor", // External mentor they're tracking
    "virtual_role_model", // Public figure they follow
    "peer_mentor" // Older peer
  ]),
  
  mentorName: varchar("mentor_name", { length: 255 }),
  mentorArea: varchar("mentor_area", { length: 255 }), // What they mentor in
  
  // Connection Details
  connectionDate: timestamp("connection_date"),
  meetingFrequency: pgEnum("meeting_frequency", ["weekly", "biweekly", "monthly", "as_needed"]),
  
  // Focus Areas
  focusAreas: text("focus_areas"), // JSON array
  
  // Progress
  sessionsCompleted: integer("sessions_completed").default(0),
  lastMeeting: timestamp("last_meeting"),
  nextMeeting: timestamp("next_meeting"),
  
  // Impact
  impactRating: integer("impact_rating"), // 1-10
  keyLearnings: text("key_learnings"), // JSON array
  
  status: pgEnum("status", ["active", "on_hold", "completed"]),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Masculine Identity Development (healthy masculinity)
export const masculinityReflections = pgTable("masculinity_reflections", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  reflectionDate: timestamp("reflection_date").notNull(),
  
  // Reflection Prompts (evidence-based)
  promptType: pgEnum("prompt_type", [
    "what_is_a_man", // Defining healthy masculinity
    "role_models", // Who do you look up to and why?
    "emotions", // How do you handle emotions?
    "relationships", // How do you show care?
    "strength", // What does strength mean?
    "vulnerability", // When is it okay to be vulnerable?
    "responsibility", // What are you responsible for?
    "purpose" // What's your mission?
  ]),
  
  reflection: text("reflection").notNull(),
  
  // Insights
  insights: text("insights"),
  actionSteps: text("action_steps"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Challenge Completions (rite of passage style)
export const challengeCompletions = pgTable("challenge_completions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  challengeCategory: pgEnum("challenge_category", [
    "physical", // Fitness challenge
    "mental", // Learning challenge
    "emotional", // Vulnerability challenge
    "social", // Connection challenge
    "service", // Help others challenge
    "financial", // Money management challenge
    "creative" // Create something challenge
  ]),
  
  challengeName: varchar("challenge_name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Completion
  startDate: timestamp("start_date"),
  completionDate: timestamp("completion_date"),
  
  // Reflection
  whatYouLearned: text("what_you_learned"),
  howYouGrew: text("how_you_grew"),
  
  // Recognition
  badgeEarned: varchar("badge_earned", { length: 255 }),
  
  status: pgEnum("status", ["in_progress", "completed", "abandoned"]),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Milestones (Rites of Passage)
export const youngMenMilestones = pgTable("young_men_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  milestoneType: pgEnum("milestone_type", [
    "first_job",
    "financial_independence",
    "moved_out",
    "graduated",
    "learned_critical_skill",
    "overcame_fear",
    "helped_someone",
    "found_purpose",
    "built_discipline"
  ]),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  achievedDate: timestamp("achieved_date"),
  
  // Significance
  whyItMatters: text("why_it_matters"),
  whoYouBecame: text("who_you_became"), // Identity shift
  
  createdAt: timestamp("created_at").defaultNow(),
});
