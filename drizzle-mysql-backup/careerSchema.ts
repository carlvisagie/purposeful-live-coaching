/**
 * CAREER & PURPOSE MODULE
 * Evidence-based approach using Career Development Theory, Ikigai, and Purpose Research
 * Research sources: Stanford Career Development, Positive Psychology, Purpose Research (Damon, Bronk)
 */

import { boolean, decimal, int, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Career Profiles
export const careerProfiles = pgTable("career_profiles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Current Status
  employmentStatus: varchar("employment_status", { length: 50 }),
  
  currentRole: varchar("current_role", { length: 255 }),
  currentIndustry: varchar("current_industry", { length: 255 }),
  yearsExperience: integer("years_experience"),
  
  // Career Goals
  primaryGoal: varchar("primary_goal", { length: 50 }),
  
  targetRole: varchar("target_role", { length: 255 }),
  targetIndustry: varchar("target_industry", { length: 255 }),
  targetTimeline: integer("target_timeline"), // months
  
  // Ikigai Framework (What you love, what you're good at, what the world needs, what you can be paid for)
  whatYouLove: text("what_you_love"), // JSON array
  whatYoureGoodAt: text("what_youre_good_at"), // JSON array
  whatWorldNeeds: text("what_world_needs"), // JSON array
  whatYouCanBePaidFor: text("what_you_can_be_paid_for"), // JSON array
  
  // Purpose Statement
  purposeStatement: text("purpose_statement"),
  coreValues: text("core_values"), // JSON array
  
  // Skills & Strengths
  currentSkills: text("current_skills"), // JSON array
  skillsToLearn: text("skills_to_learn"), // JSON array
  strengths: text("strengths"), // JSON array (based on VIA Character Strengths or StrengthsFinder)
  
  // Barriers & Challenges
  mainBarriers: text("main_barriers"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job Search Tracking
export const jobSearchActivities = pgTable("job_search_activities", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  activityDate: timestamp("activity_date").notNull(),
  
  activityType: varchar("activity_type", { length: 50 }),
  
  // Job Details
  companyName: varchar("company_name", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  jobUrl: text("job_url"),
  
  // Application Details
  applicationMethod: varchar("application_method", { length: 255 }), // LinkedIn, company site, referral, etc.
  referralSource: varchar("referral_source", { length: 255 }),
  
  // Interview Details
  interviewType: varchar("interview_type", { length: 50 }),
  interviewRound: integer("interview_round"),
  interviewNotes: text("interview_notes"),
  
  // Outcome
  status: varchar("status", { length: 50 }),
  
  // Follow-up
  nextSteps: text("next_steps"),
  followUpDate: timestamp("follow_up_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Networking Contacts
export const networkingContacts = pgTable("networking_contacts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  // Contact Info
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  company: varchar("company", { length: 255 }),
  industry: varchar("industry", { length: 255 }),
  
  // Connection
  howMet: text("how_met"),
  connectionStrength: varchar("connection_strength", { length: 50 }),
  
  // Contact Details
  email: varchar("email", { length: 255 }),
  linkedIn: varchar("linkedin", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  
  // Relationship
  lastContact: timestamp("last_contact"),
  contactFrequency: varchar("contact_frequency", { length: 50 }),
  
  // Value Exchange
  howTheyCanHelp: text("how_they_can_help"),
  howYouCanHelp: text("how_you_can_help"),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skill Development Tracking
export const skillDevelopment = pgTable("skill_development", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  skillName: varchar("skill_name", { length: 255 }).notNull(),
  skillCategory: varchar("skill_category", { length: 50 }),
  
  // Current Level
  currentLevel: varchar("current_level", { length: 50 }),
  targetLevel: varchar("target_level", { length: 50 }),
  
  // Learning Plan
  learningResources: text("learning_resources"), // JSON array: [{type, name, url, cost}]
  practiceActivities: text("practice_activities"), // JSON array
  
  // Progress
  hoursInvested: decimal("hours_invested", { precision: 10, scale: 2 }).default("0"),
  completedMilestones: text("completed_milestones"), // JSON array
  
  // Application
  projectsUsed: text("projects_used"), // JSON array
  certificationsEarned: text("certifications_earned"), // JSON array
  
  // Timeline
  startDate: timestamp("start_date"),
  targetCompletionDate: timestamp("target_completion_date"),
  completionDate: timestamp("completion_date"),
  
  status: varchar("status", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purpose Exploration Activities
export const purposeActivities = pgTable("purpose_activities", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  activityDate: timestamp("activity_date").notNull(),
  
  // Activity Type (evidence-based purpose discovery methods)
  activityType: varchar("activity_type", { length: 50 }),
  
  // Reflections
  insights: text("insights"),
  patterns: text("patterns"), // What patterns emerged?
  emotions: text("emotions"),
  
  // Purpose Elements Discovered
  passions: text("passions"), // JSON array
  strengths: text("strengths"),
  values: text("values"),
  impact: text("impact"), // How you want to contribute
  
  // Integration
  actionSteps: text("action_steps"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Career Experiments - Test before committing
export const careerExperiments = pgTable("career_experiments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  experimentType: varchar("experiment_type", { length: 50 }),
  
  experimentName: varchar("experiment_name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Hypothesis
  hypothesis: text("hypothesis"), // What are you testing?
  successCriteria: text("success_criteria"), // How will you know if it's a fit?
  
  // Timeline
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  // Results
  whatYouLearned: text("what_you_learned"),
  whatYouLiked: text("what_you_liked"),
  whatYouDisliked: text("what_you_disliked"),
  
  // Decision
  conclusion: text("conclusion"),
  nextSteps: text("next_steps"),
  
  status: varchar("status", { length: 50 }),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Career Milestones
export const careerMilestones = pgTable("career_milestones", {
  id: varchar("id", { length: 255 }).primaryKey(),
  profileId: varchar("profile_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  
  milestoneType: varchar("milestone_type", { length: 50 }),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  targetDate: timestamp("target_date"),
  achievedDate: timestamp("achieved_date"),
  
  progress: integer("progress"), // 0-100%
  status: varchar("status", { length: 50 }),
  
  impact: text("impact"), // How did this move you toward your purpose?
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
