/**
 * AI Profile Extraction Engine
 * 
 * Automatically extracts client profile data from natural conversations
 * NO FORMS - just natural chat that builds comprehensive profiles
 * 
 * Based on CLIENT_PROFILE_SCHEMA.md - 40+ fields extracted intelligently
 */

import { invokeLLM } from "../../_core/llm";

export interface ExtractedProfile {
  // Professional
  jobTitle?: string;
  company?: string;
  industry?: string;
  careerGoals?: string;
  
  // Personal
  age?: number;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  relationshipStatus?: string;
  hasChildren?: "true" | "false";
  
  // Goals
  primaryGoal?: string;
  goalTimeline?: string;
  motivation?: string;
  
  // Identity
  currentIdentity?: string; // JSON array as string
  targetIdentity?: string; // JSON array as string
  identityGap?: string;
  coreValues?: string; // JSON array as string
  lifeMission?: string;
  
  // Behavioral
  procrastinationTriggers?: string; // JSON array as string
  energyPattern?: string;
  stressResponses?: string; // JSON array as string
  
  // Health
  sleepHours?: number;
  exerciseFrequency?: string;
  dietPattern?: string;
  mentalHealthNotes?: string;
  
  // Financial
  savingsLevel?: string;
  hasDebt?: "true" | "false";
  monthlyExpensesEstimate?: number;
  
  // Communication
  preferredContact?: string;
  bestTimeToReach?: string;
  communicationStyle?: string;
  
  // Crisis
  suicideRiskLevel?: string;
  crisisFlags?: string; // JSON array as string
  
  // Metadata
  confidenceScores?: string; // JSON object as string
}

const EXTRACTION_PROMPT = `You are a profile extraction AI. Your job is to extract structured client profile data from conversation history.

Extract ONLY information that is EXPLICITLY mentioned or strongly implied in the conversation. Do not make assumptions.

Return a JSON object with the following fields (only include fields where you found information):

PROFESSIONAL:
- jobTitle: string (their job title)
- company: string (company name)
- industry: string (industry/field)
- careerGoals: string (career aspirations)

PERSONAL:
- age: number (age in years)
- locationCity: string (city name)
- locationState: string (state/province)
- locationCountry: string (country)
- relationshipStatus: string (single/married/divorced/etc)
- hasChildren: "true" | "false"

GOALS:
- primaryGoal: string (main life goal)
- goalTimeline: string (when they want to achieve it)
- motivation: string (why they want this)

IDENTITY:
- currentIdentity: array of strings (how they see themselves now)
- targetIdentity: array of strings (who they want to become)
- identityGap: string (gap between current and target)
- coreValues: array of strings (their core values)
- lifeMission: string (their life purpose/mission)

BEHAVIORAL:
- procrastinationTriggers: array of strings (what makes them procrastinate)
- energyPattern: string (morning person/night owl/etc)
- stressResponses: array of strings (how they handle stress)

HEALTH:
- sleepHours: number (average hours of sleep)
- exerciseFrequency: string (how often they exercise)
- dietPattern: string (their eating habits)
- mentalHealthNotes: string (mental health concerns/notes)

FINANCIAL:
- savingsLevel: string (none/low/moderate/high)
- hasDebt: "true" | "false"
- monthlyExpensesEstimate: number (estimated monthly expenses in USD)

COMMUNICATION:
- preferredContact: string (email/phone/text/etc)
- bestTimeToReach: string (morning/afternoon/evening)
- communicationStyle: string (direct/gentle/analytical/etc)

CRISIS INDICATORS:
- suicideRiskLevel: string (none/low/medium/high/critical)
- crisisFlags: array of strings (specific crisis indicators mentioned)

CONFIDENCE SCORES:
- confidenceScores: object with field names as keys and confidence (0-100) as values

CRITICAL RULES:
1. Only extract information EXPLICITLY stated or strongly implied
2. For arrays, return actual arrays not strings
3. For confidence scores, rate 0-100 how confident you are in each extracted field
4. If suicide/self-harm is mentioned, flag it immediately
5. Be conservative - better to miss data than make assumptions

Return ONLY valid JSON, no explanation.`;

/**
 * Extract profile data from conversation history
 */
export async function extractProfileFromConversation(
  conversationHistory: Array<{ role: string; content: string }>
): Promise<ExtractedProfile> {
  try {
    // Prepare conversation for extraction
    const conversationText = conversationHistory
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    // Call LLM with extraction prompt
    const response = await invokeLLM({
      messages: [
        { role: "system", content: EXTRACTION_PROMPT },
        { role: "user", content: `Extract profile data from this conversation:\n\n${conversationText}` }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "profile_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              // Professional
              jobTitle: { type: "string" },
              company: { type: "string" },
              industry: { type: "string" },
              careerGoals: { type: "string" },
              
              // Personal
              age: { type: "number" },
              locationCity: { type: "string" },
              locationState: { type: "string" },
              locationCountry: { type: "string" },
              relationshipStatus: { type: "string" },
              hasChildren: { type: "string", enum: ["true", "false"] },
              
              // Goals
              primaryGoal: { type: "string" },
              goalTimeline: { type: "string" },
              motivation: { type: "string" },
              
              // Identity
              currentIdentity: { type: "array", items: { type: "string" } },
              targetIdentity: { type: "array", items: { type: "string" } },
              identityGap: { type: "string" },
              coreValues: { type: "array", items: { type: "string" } },
              lifeMission: { type: "string" },
              
              // Behavioral
              procrastinationTriggers: { type: "array", items: { type: "string" } },
              energyPattern: { type: "string" },
              stressResponses: { type: "array", items: { type: "string" } },
              
              // Health
              sleepHours: { type: "number" },
              exerciseFrequency: { type: "string" },
              dietPattern: { type: "string" },
              mentalHealthNotes: { type: "string" },
              
              // Financial
              savingsLevel: { type: "string" },
              hasDebt: { type: "string", enum: ["true", "false"] },
              monthlyExpensesEstimate: { type: "number" },
              
              // Communication
              preferredContact: { type: "string" },
              bestTimeToReach: { type: "string" },
              communicationStyle: { type: "string" },
              
              // Crisis
              suicideRiskLevel: { type: "string" },
              crisisFlags: { type: "array", items: { type: "string" } },
              
              // Metadata
              confidenceScores: { type: "object" },
            },
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in LLM response");
    }

    // Handle content type (string or array)
    const contentText = typeof content === 'string' ? content : JSON.stringify(content);
    const extracted = JSON.parse(contentText);

    // Convert arrays to JSON strings for database storage
    const profile: ExtractedProfile = {
      ...extracted,
      currentIdentity: extracted.currentIdentity ? JSON.stringify(extracted.currentIdentity) : undefined,
      targetIdentity: extracted.targetIdentity ? JSON.stringify(extracted.targetIdentity) : undefined,
      coreValues: extracted.coreValues ? JSON.stringify(extracted.coreValues) : undefined,
      procrastinationTriggers: extracted.procrastinationTriggers ? JSON.stringify(extracted.procrastinationTriggers) : undefined,
      stressResponses: extracted.stressResponses ? JSON.stringify(extracted.stressResponses) : undefined,
      crisisFlags: extracted.crisisFlags ? JSON.stringify(extracted.crisisFlags) : undefined,
      confidenceScores: extracted.confidenceScores ? JSON.stringify(extracted.confidenceScores) : undefined,
    };

    return profile;
  } catch (error) {
    console.error("Profile extraction failed:", error);
    return {}; // Return empty profile on error
  }
}

/**
 * Incremental extraction - only extract new information from latest messages
 * More efficient than re-processing entire conversation every time
 */
export async function extractIncrementalUpdate(
  newMessages: Array<{ role: string; content: string }>,
  existingProfile: ExtractedProfile
): Promise<ExtractedProfile> {
  try {
    const newConversationText = newMessages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    const response = await invokeLLM({
      messages: [
        { role: "system", content: EXTRACTION_PROMPT + "\n\nEXISTING PROFILE:\n" + JSON.stringify(existingProfile, null, 2) },
        { role: "user", content: `Extract ONLY NEW information from these recent messages:\n\n${newConversationText}` }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "incremental_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              updates: { type: "object" },
              confidenceScores: { type: "object" },
            },
            required: ["updates"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return existingProfile;
    }

    const contentText = typeof content === 'string' ? content : JSON.stringify(content);
    const { updates, confidenceScores } = JSON.parse(contentText);

    // Merge updates with existing profile
    const updatedProfile: ExtractedProfile = {
      ...existingProfile,
      ...updates,
      confidenceScores: confidenceScores ? JSON.stringify(confidenceScores) : existingProfile.confidenceScores,
    };

    return updatedProfile;
  } catch (error) {
    console.error("Incremental extraction failed:", error);
    return existingProfile; // Return existing profile on error
  }
}

/**
 * Detect crisis indicators in conversation
 * Returns true if immediate intervention needed
 */
export async function detectCrisis(
  message: string
): Promise<{ isCrisis: boolean; level: string; flags: string[] }> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a crisis detection AI. Analyze the message for suicide risk, self-harm, or immediate danger.

Return JSON with:
- isCrisis: boolean (true if immediate intervention needed)
- level: "none" | "low" | "medium" | "high" | "critical"
- flags: array of specific crisis indicators found

CRISIS INDICATORS:
- Suicide ideation or planning
- Self-harm thoughts or actions
- Hopelessness/worthlessness
- Specific plans to harm self
- Giving away possessions
- Saying goodbye
- Recent traumatic event
- Substance abuse crisis
- Psychotic symptoms

Be conservative - flag anything concerning.`
        },
        { role: "user", content: message }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "crisis_detection",
          strict: true,
          schema: {
            type: "object",
            properties: {
              isCrisis: { type: "boolean" },
              level: { type: "string", enum: ["none", "low", "medium", "high", "critical"] },
              flags: { type: "array", items: { type: "string" } },
            },
            required: ["isCrisis", "level", "flags"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { isCrisis: false, level: "none", flags: [] };
    }

    const contentText = typeof content === 'string' ? content : JSON.stringify(content);
    return JSON.parse(contentText);
  } catch (error) {
    console.error("Crisis detection failed:", error);
    return { isCrisis: false, level: "none", flags: [] };
  }
}
