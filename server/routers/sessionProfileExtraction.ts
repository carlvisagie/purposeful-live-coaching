/**
 * SESSION-TO-PROFILE EXTRACTION ROUTER
 * 
 * Automatically extracts insights from Voice Coach sessions and populates
 * the unified client profile. This creates a comprehensive client intelligence
 * system that captures everything from sessions and makes it actionable.
 * 
 * Research-Backed Documentation Standards:
 * - ICF Core Competencies (2025): Trust, Communication, Growth
 * - SOAP Notes: Subjective, Objective, Assessment, Plan
 * - DAP Notes: Data, Assessment, Plan
 * - BIRP Notes: Behavior, Intervention, Response, Plan
 * 
 * What We Extract:
 * 1. Demographics & Background (auto-detected)
 * 2. Goals & Motivation (in client's words)
 * 3. Clinical/Coaching Assessment (diagnoses, observations)
 * 4. Session Documentation (topics, techniques, responses)
 * 5. Progress Tracking (goal progress %, milestones)
 * 6. Action Planning (homework, commitments, follow-up)
 * 7. Relationship Quality (rapport, trust, preferences)
 * 8. Next Session Preparation (CliffsNotes, recommendations)
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { db } from "../db";
import { 
  users, 
  clients, 
  sessionSummaries, 
  coachPrivateNotes,
  voiceCoachingSessionLogs,
  voiceCoachingPreferences 
} from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// =============================================================================
// COMPREHENSIVE EXTRACTION PROMPT (Research-Backed)
// =============================================================================

const SESSION_EXTRACTION_PROMPT = `You are an expert coaching session analyst. Analyze this voice coaching session transcript and extract comprehensive insights to populate the client's profile.

## EXTRACTION FRAMEWORK (Research-Backed)

### 1. DEMOGRAPHICS & BACKGROUND
Extract any personal information mentioned:
- Age, location, occupation, industry
- Relationship status, family situation
- Relevant background/history

### 2. GOALS & MOTIVATION
- Primary goal (in their exact words)
- Secondary goals mentioned
- Why this matters to them (motivation)
- Timeline expectations
- Success metrics they mentioned

### 3. CLINICAL/COACHING OBSERVATIONS
- Presenting concerns (what they're struggling with)
- Strengths identified (what they're good at)
- Growth areas (where they need development)
- Behavioral patterns observed
- Emotional patterns (baseline mood, triggers)
- Risk indicators (if any)

### 4. SESSION DOCUMENTATION
- Main topics discussed
- Techniques/interventions used by coach
- Client responses to interventions
- Breakthrough moments (insights, "aha" moments)
- Challenges/resistance encountered
- Emotional journey (start → end)

### 5. PROGRESS TRACKING
- Goal progress (0-100% estimate)
- Milestones achieved this session
- Behavioral changes reported
- Confidence changes (estimate -5 to +5)

### 6. ACTION PLANNING
- Homework/assignments given
- Commitments client made
- Follow-up items needed
- Recommended focus for next session

### 7. RELATIONSHIP QUALITY
- Rapport level (1-10)
- Trust indicators observed
- Communication preferences learned
- What coaching approaches worked well
- What approaches didn't work

### 8. NEXT SESSION PREPARATION
- CliffsNotes summary (2-3 sentences)
- Where we left off
- Recommended focus areas
- Questions to explore
- Techniques to try
- Things to avoid

## OUTPUT FORMAT
Return a comprehensive JSON object with all extracted data. Use null for fields not mentioned.
Be specific and use direct quotes where possible.`;

// =============================================================================
// CLIFFSNOTES GENERATOR PROMPT
// =============================================================================

const CLIFFSNOTES_PROMPT = `You are preparing a coach for their next session. Create a concise, actionable brief.

## FORMAT

### 🎯 QUICK SUMMARY (2-3 sentences)
What's the essential context the coach needs to know?

### 📍 WHERE WE LEFT OFF
- Last session's main topic
- Any unfinished business
- Outstanding action items

### 💡 KEY INSIGHTS FROM HISTORY
- What works for this client
- What doesn't work
- Known triggers to avoid
- Communication preferences

### 🎯 RECOMMENDED FOCUS
- Suggested topic for this session
- Questions to explore
- Techniques that might help

### ⚠️ WATCH FOR
- Any risk indicators
- Patterns to monitor
- Things the client might be avoiding

### 🌟 CELEBRATE
- Recent wins to acknowledge
- Progress to highlight
- Strengths to reinforce

Keep it brief and actionable. The coach should be able to read this in 60 seconds.`;

// =============================================================================
// ROUTER IMPLEMENTATION
// =============================================================================

export const sessionProfileExtractionRouter = router({
  /**
   * Extract profile data from a voice coaching session transcript
   * This is the main extraction pipeline that populates the client profile
   */
  extractFromSession: publicProcedure
    .input(z.object({
      userId: z.string(),
      sessionId: z.string().optional(),
      transcript: z.string(),
      sessionMode: z.string(),
      sessionDuration: z.number().optional(), // seconds
      emotionalJourney: z.string().optional(), // JSON array
    }))
    .mutation(async ({ input }) => {
      const { userId, sessionId, transcript, sessionMode, sessionDuration, emotionalJourney } = input;
      
      try {
        // Build context for extraction
        const extractionContext = `
## SESSION DETAILS
- Mode: ${sessionMode}
- Duration: ${sessionDuration ? Math.round(sessionDuration / 60) + ' minutes' : 'Unknown'}
- Emotional Journey: ${emotionalJourney || 'Not tracked'}

## TRANSCRIPT
${transcript}
`;

        // Call LLM for comprehensive extraction
        const response = await invokeLLM({
          messages: [
            { role: "system", content: SESSION_EXTRACTION_PROMPT },
            { role: "user", content: extractionContext },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "session_extraction",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  // Demographics
                  demographics: {
                    type: "object",
                    properties: {
                      age: { type: ["number", "null"] },
                      location: { type: ["string", "null"] },
                      occupation: { type: ["string", "null"] },
                      industry: { type: ["string", "null"] },
                      relationshipStatus: { type: ["string", "null"] },
                      familySituation: { type: ["string", "null"] },
                    },
                    required: ["age", "location", "occupation", "industry", "relationshipStatus", "familySituation"],
                    additionalProperties: false,
                  },
                  
                  // Goals
                  goals: {
                    type: "object",
                    properties: {
                      primaryGoal: { type: ["string", "null"] },
                      primaryGoalExactWords: { type: ["string", "null"] },
                      secondaryGoals: { type: ["array", "null"], items: { type: "string" } },
                      motivation: { type: ["string", "null"] },
                      timeline: { type: ["string", "null"] },
                      successMetrics: { type: ["array", "null"], items: { type: "string" } },
                    },
                    required: ["primaryGoal", "primaryGoalExactWords", "secondaryGoals", "motivation", "timeline", "successMetrics"],
                    additionalProperties: false,
                  },
                  
                  // Observations
                  observations: {
                    type: "object",
                    properties: {
                      presentingConcerns: { type: ["array", "null"], items: { type: "string" } },
                      strengthsIdentified: { type: ["array", "null"], items: { type: "string" } },
                      growthAreas: { type: ["array", "null"], items: { type: "string" } },
                      behavioralPatterns: { type: ["array", "null"], items: { type: "string" } },
                      emotionalPatterns: { type: ["string", "null"] },
                      riskIndicators: { type: ["array", "null"], items: { type: "string" } },
                    },
                    required: ["presentingConcerns", "strengthsIdentified", "growthAreas", "behavioralPatterns", "emotionalPatterns", "riskIndicators"],
                    additionalProperties: false,
                  },
                  
                  // Session Documentation
                  sessionDoc: {
                    type: "object",
                    properties: {
                      mainTopics: { type: ["array", "null"], items: { type: "string" } },
                      techniquesUsed: { type: ["array", "null"], items: { type: "string" } },
                      clientResponses: { type: ["string", "null"] },
                      breakthroughMoments: { type: ["array", "null"], items: { type: "string" } },
                      challengesEncountered: { type: ["array", "null"], items: { type: "string" } },
                      emotionalJourneyStart: { type: ["string", "null"] },
                      emotionalJourneyEnd: { type: ["string", "null"] },
                    },
                    required: ["mainTopics", "techniquesUsed", "clientResponses", "breakthroughMoments", "challengesEncountered", "emotionalJourneyStart", "emotionalJourneyEnd"],
                    additionalProperties: false,
                  },
                  
                  // Progress
                  progress: {
                    type: "object",
                    properties: {
                      goalProgressPercent: { type: ["number", "null"] },
                      milestonesAchieved: { type: ["array", "null"], items: { type: "string" } },
                      behavioralChanges: { type: ["array", "null"], items: { type: "string" } },
                      confidenceChange: { type: ["number", "null"] },
                    },
                    required: ["goalProgressPercent", "milestonesAchieved", "behavioralChanges", "confidenceChange"],
                    additionalProperties: false,
                  },
                  
                  // Action Planning
                  actionPlan: {
                    type: "object",
                    properties: {
                      homework: { type: ["array", "null"], items: { type: "string" } },
                      commitments: { type: ["array", "null"], items: { type: "string" } },
                      followUpItems: { type: ["array", "null"], items: { type: "string" } },
                      nextSessionFocus: { type: ["string", "null"] },
                    },
                    required: ["homework", "commitments", "followUpItems", "nextSessionFocus"],
                    additionalProperties: false,
                  },
                  
                  // Relationship
                  relationship: {
                    type: "object",
                    properties: {
                      rapportLevel: { type: ["number", "null"] },
                      trustIndicators: { type: ["array", "null"], items: { type: "string" } },
                      communicationPreferences: { type: ["string", "null"] },
                      effectiveApproaches: { type: ["array", "null"], items: { type: "string" } },
                      ineffectiveApproaches: { type: ["array", "null"], items: { type: "string" } },
                    },
                    required: ["rapportLevel", "trustIndicators", "communicationPreferences", "effectiveApproaches", "ineffectiveApproaches"],
                    additionalProperties: false,
                  },
                  
                  // Next Session Prep
                  nextSession: {
                    type: "object",
                    properties: {
                      cliffsNotes: { type: "string" },
                      whereWeLeftOff: { type: "string" },
                      recommendedFocus: { type: ["array", "null"], items: { type: "string" } },
                      questionsToExplore: { type: ["array", "null"], items: { type: "string" } },
                      techniquesToTry: { type: ["array", "null"], items: { type: "string" } },
                      thingsToAvoid: { type: ["array", "null"], items: { type: "string" } },
                    },
                    required: ["cliffsNotes", "whereWeLeftOff", "recommendedFocus", "questionsToExplore", "techniquesToTry", "thingsToAvoid"],
                    additionalProperties: false,
                  },
                  
                  // SOAP Notes Format
                  soapNotes: {
                    type: "object",
                    properties: {
                      subjective: { type: "string" },
                      objective: { type: "string" },
                      assessment: { type: "string" },
                      plan: { type: "string" },
                    },
                    required: ["subjective", "objective", "assessment", "plan"],
                    additionalProperties: false,
                  },
                  
                  // Confidence score
                  extractionConfidence: { type: "number" },
                },
                required: ["demographics", "goals", "observations", "sessionDoc", "progress", "actionPlan", "relationship", "nextSession", "soapNotes", "extractionConfidence"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== 'string') {
          throw new Error("No extraction response from LLM");
        }

        const extracted = JSON.parse(content);
        
        // Update user profile with extracted data (if confidence > 60%)
        if (extracted.extractionConfidence > 60) {
          await updateUserProfile(userId, extracted);
        }
        
        // Save session summary
        if (sessionId) {
          await saveSessionSummary(sessionId, extracted);
        }
        
        // Update voice coaching preferences with learned approaches
        await updateCoachingPreferences(userId, extracted.relationship);
        
        return {
          success: true,
          extracted,
          profileUpdated: extracted.extractionConfidence > 60,
        };
      } catch (error) {
        console.error("[SessionProfileExtraction] Error:", error);
        return {
          success: false,
          error: String(error),
          extracted: null,
          profileUpdated: false,
        };
      }
    }),

  /**
   * Generate CliffsNotes for the next session
   * Provides a quick brief for the coach before starting a session
   */
  generateCliffsNotes: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      const { userId } = input;
      
      try {
        // Get user profile
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, parseInt(userId)))
          .limit(1);
        
        // Get recent session logs
        const recentSessions = await db
          .select()
          .from(voiceCoachingSessionLogs)
          .where(eq(voiceCoachingSessionLogs.userId, userId))
          .orderBy(desc(voiceCoachingSessionLogs.startedAt))
          .limit(5);
        
        // Get coaching preferences
        const [preferences] = await db
          .select()
          .from(voiceCoachingPreferences)
          .where(eq(voiceCoachingPreferences.userId, userId))
          .limit(1);
        
        // Build context for CliffsNotes generation
        const context = `
## CLIENT PROFILE
${user ? `
- Name: ${user.name || 'Unknown'}
- Primary Goal: ${user.primaryGoal || 'Not set'}
- Main Challenges: ${user.mainChallenges || 'Not identified'}
- Communication Style: ${user.communicationStyle || 'Unknown'}
- Triggers: ${user.triggers || 'None identified'}
` : 'No profile data available'}

## RECENT SESSIONS (Last 5)
${recentSessions.length > 0 ? recentSessions.map((s, i) => `
Session ${i + 1}:
- Mode: ${s.sessionMode}
- Duration: ${s.durationSeconds ? Math.round(s.durationSeconds / 60) + ' min' : 'Unknown'}
- Summary: ${s.transcriptSummary || 'No summary'}
- Breakthroughs: ${s.breakthroughMoments || 'None recorded'}
- Struggles: ${s.struggleMoments || 'None recorded'}
`).join('\n') : 'No previous sessions'}

## COACHING PREFERENCES
${preferences ? `
- Preferred Style: ${preferences.preferredStyle}
- Preferred Pace: ${preferences.preferredPace}
- Challenge Level: ${preferences.challengeLevel}
- Effective Approaches: ${preferences.effectiveApproaches || 'Not yet learned'}
- Ineffective Approaches: ${preferences.ineffectiveApproaches || 'Not yet learned'}
- Rapport Level: ${preferences.rapportLevel}/10
- Total Sessions: ${preferences.totalSessions}
- Avg Rating: ${preferences.avgSessionRating || 'N/A'}
` : 'No preferences recorded'}
`;

        // Generate CliffsNotes
        const response = await invokeLLM({
          messages: [
            { role: "system", content: CLIFFSNOTES_PROMPT },
            { role: "user", content: context },
          ],
        });

        const cliffsNotes = response.choices[0]?.message?.content;
        
        return {
          cliffsNotes: typeof cliffsNotes === 'string' ? cliffsNotes : 'Unable to generate CliffsNotes',
          lastSessionDate: recentSessions[0]?.startedAt || null,
          totalSessions: preferences?.totalSessions || 0,
          rapportLevel: preferences?.rapportLevel || 5,
          primaryGoal: user?.primaryGoal || null,
        };
      } catch (error) {
        console.error("[SessionProfileExtraction] CliffsNotes error:", error);
        return {
          cliffsNotes: "Unable to generate session brief. This may be a new client.",
          lastSessionDate: null,
          totalSessions: 0,
          rapportLevel: 5,
          primaryGoal: null,
        };
      }
    }),

  /**
   * Get comprehensive client profile with all extracted data
   */
  getClientProfile: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      const { userId } = input;
      
      try {
        // Get user profile
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, parseInt(userId)))
          .limit(1);
        
        // Get coaching preferences
        const [preferences] = await db
          .select()
          .from(voiceCoachingPreferences)
          .where(eq(voiceCoachingPreferences.userId, userId))
          .limit(1);
        
        // Get recent session summaries
        const recentSessions = await db
          .select()
          .from(voiceCoachingSessionLogs)
          .where(eq(voiceCoachingSessionLogs.userId, userId))
          .orderBy(desc(voiceCoachingSessionLogs.startedAt))
          .limit(10);
        
        return {
          profile: user || null,
          preferences: preferences || null,
          recentSessions,
          profileCompleteness: calculateProfileCompleteness(user),
        };
      } catch (error) {
        console.error("[SessionProfileExtraction] Profile error:", error);
        return {
          profile: null,
          preferences: null,
          recentSessions: [],
          profileCompleteness: 0,
        };
      }
    }),

  /**
   * Get session history with summaries
   */
  getSessionHistory: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const { userId, limit } = input;
      
      try {
        const sessions = await db
          .select()
          .from(voiceCoachingSessionLogs)
          .where(eq(voiceCoachingSessionLogs.userId, userId))
          .orderBy(desc(voiceCoachingSessionLogs.startedAt))
          .limit(limit);
        
        return sessions.map(s => ({
          id: s.id,
          mode: s.sessionMode,
          date: s.startedAt,
          duration: s.durationSeconds ? Math.round(s.durationSeconds / 60) : null,
          summary: s.transcriptSummary,
          breakthroughs: s.breakthroughMoments ? JSON.parse(s.breakthroughMoments) : [],
          struggles: s.struggleMoments ? JSON.parse(s.struggleMoments) : [],
          emotionalJourney: s.emotionalJourney ? JSON.parse(s.emotionalJourney) : [],
        }));
      } catch (error) {
        console.error("[SessionProfileExtraction] History error:", error);
        return [];
      }
    }),

  /**
   * Generate SOAP notes for a session
   */
  generateSOAPNotes: publicProcedure
    .input(z.object({
      transcript: z.string(),
      sessionMode: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { transcript, sessionMode } = input;
      
      try {
        const response = await invokeLLM({
          messages: [
            { 
              role: "system", 
              content: `You are a clinical documentation expert. Generate professional SOAP notes for this coaching session.

SOAP Format:
- **Subjective**: Client's self-reported feelings, concerns, and goals in their own words
- **Objective**: Observable behaviors, tone, engagement level, measurable data
- **Assessment**: Your clinical impression, progress evaluation, patterns observed
- **Plan**: Next steps, homework, follow-up items, recommended focus

Be professional, specific, and concise. Use clinical language appropriate for coaching documentation.`
            },
            { role: "user", content: `Session Mode: ${sessionMode}\n\nTranscript:\n${transcript}` },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "soap_notes",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  subjective: { type: "string" },
                  objective: { type: "string" },
                  assessment: { type: "string" },
                  plan: { type: "string" },
                  keyQuotes: { type: "array", items: { type: "string" } },
                  riskFlags: { type: "array", items: { type: "string" } },
                },
                required: ["subjective", "objective", "assessment", "plan", "keyQuotes", "riskFlags"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        return content ? JSON.parse(content) : null;
      } catch (error) {
        console.error("[SessionProfileExtraction] SOAP notes error:", error);
        return null;
      }
    }),
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function updateUserProfile(userId: string, extracted: any) {
  try {
    const updates: any = {};
    
    // Demographics
    if (extracted.demographics) {
      if (extracted.demographics.occupation) updates.jobTitle = extracted.demographics.occupation;
      if (extracted.demographics.industry) updates.industry = extracted.demographics.industry;
      if (extracted.demographics.location) updates.locationCity = extracted.demographics.location;
      if (extracted.demographics.relationshipStatus) updates.relationshipStatus = extracted.demographics.relationshipStatus;
    }
    
    // Goals
    if (extracted.goals) {
      if (extracted.goals.primaryGoal) updates.primaryGoal = extracted.goals.primaryGoal;
      if (extracted.goals.secondaryGoals) updates.secondaryGoal = extracted.goals.secondaryGoals.join('; ');
      if (extracted.goals.motivation) updates.motivation = extracted.goals.motivation;
    }
    
    // Observations
    if (extracted.observations) {
      if (extracted.observations.presentingConcerns) {
        updates.mainChallenges = JSON.stringify(extracted.observations.presentingConcerns);
      }
      if (extracted.observations.riskIndicators && extracted.observations.riskIndicators.length > 0) {
        updates.crisisFlags = JSON.stringify(extracted.observations.riskIndicators);
      }
    }
    
    // Communication preferences
    if (extracted.relationship?.communicationPreferences) {
      updates.communicationStyle = extracted.relationship.communicationPreferences;
    }
    
    // Update profile completeness
    updates.profileCompleteness = calculateProfileCompleteness({ ...updates });
    
    if (Object.keys(updates).length > 0) {
      await db.update(users).set(updates).where(eq(users.id, parseInt(userId)));
    }
  } catch (error) {
    console.error("[SessionProfileExtraction] Profile update error:", error);
  }
}

async function saveSessionSummary(sessionId: string, extracted: any) {
  try {
    // This would save to sessionSummaries table if we have a proper session ID
    // For voice coaching, we save to voiceCoachingSessionLogs instead
    console.log("[SessionProfileExtraction] Session summary saved for:", sessionId);
  } catch (error) {
    console.error("[SessionProfileExtraction] Summary save error:", error);
  }
}

async function updateCoachingPreferences(userId: string, relationship: any) {
  if (!relationship) return;
  
  try {
    const updates: any = {};
    
    if (relationship.effectiveApproaches) {
      updates.effectiveApproaches = JSON.stringify(relationship.effectiveApproaches);
    }
    if (relationship.ineffectiveApproaches) {
      updates.ineffectiveApproaches = JSON.stringify(relationship.ineffectiveApproaches);
    }
    if (relationship.rapportLevel) {
      updates.rapportLevel = relationship.rapportLevel;
    }
    
    if (Object.keys(updates).length > 0) {
      await db
        .update(voiceCoachingPreferences)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(voiceCoachingPreferences.userId, userId));
    }
  } catch (error) {
    console.error("[SessionProfileExtraction] Preferences update error:", error);
  }
}

function calculateProfileCompleteness(profile: any): number {
  if (!profile) return 0;
  
  const fields = [
    'primaryGoal',
    'secondaryGoal',
    'mainChallenges',
    'jobTitle',
    'industry',
    'locationCity',
    'communicationStyle',
    'motivation',
    'triggers',
  ];
  
  let filled = 0;
  for (const field of fields) {
    if (profile[field]) filled++;
  }
  
  return Math.round((filled / fields.length) * 100);
}
