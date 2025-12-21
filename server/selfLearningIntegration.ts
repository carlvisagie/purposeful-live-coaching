/**
 * SELF-LEARNING INTEGRATION
 * 
 * Universal integration layer that connects ALL modules to Platform Intelligence.
 * Every interaction, every outcome, every piece of feedback feeds the learning engine.
 * 
 * THE GOAL: The platform bends entirely toward what clients want.
 * 
 * This module provides:
 * 1. Easy integration for any module to report outcomes
 * 2. Automatic pattern detection across all interactions
 * 3. Client preference learning
 * 4. Effectiveness tracking for all features
 * 5. Self-fixing through continuous improvement
 */

import PlatformIntelligence, { ModuleType, EvidenceLevel } from "./platformIntelligence";
import { db } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";

// ============================================================================
// EXTENDED MODULE TYPES (Beyond original 12)
// ============================================================================

export type ExtendedModuleType = ModuleType 
  | "ai_chat"
  | "sleep_stories"
  | "focus_coach"
  | "meditation"
  | "just_talk"
  | "structured_programs"
  | "client_recognition"
  | "voice_coaching"
  | "session_analysis"
  | "onboarding"
  | "notifications"
  | "landing_page";

// Map extended types to base types for Platform Intelligence
function mapToBaseModuleType(extended: ExtendedModuleType): ModuleType {
  const mapping: Record<string, ModuleType> = {
    ai_chat: "emotional_wellness",
    sleep_stories: "sleep",
    focus_coach: "mental_health",
    meditation: "mental_health",
    just_talk: "emotional_wellness",
    structured_programs: "coaching_techniques",
    client_recognition: "coaching_techniques",
    voice_coaching: "coaching_techniques",
    session_analysis: "coaching_techniques",
    onboarding: "coaching_techniques",
    notifications: "coaching_techniques",
    landing_page: "coaching_techniques",
  };
  
  return mapping[extended] || (extended as ModuleType);
}

// ============================================================================
// INTERACTION TRACKING
// ============================================================================

export interface InteractionData {
  moduleType: ExtendedModuleType;
  userId?: number;
  sessionId?: string;
  
  // What happened
  action: string;  // e.g., "started_meditation", "completed_program", "sent_message"
  duration?: number;  // seconds
  
  // Outcome
  wasSuccessful: boolean;
  userSatisfaction?: number;  // 1-10
  userFeedback?: string;
  
  // Context
  timeOfDay?: string;
  dayOfWeek?: number;
  deviceType?: string;
  
  // What the user chose (for preference learning)
  userChoice?: string;  // e.g., "rain_sounds", "body_scan", "anxiety_program"
  alternatives?: string[];  // What other options were available
  
  // Metadata
  metadata?: Record<string, any>;
}

/**
 * Track any interaction for learning
 * Call this from EVERY module after any significant action
 */
export async function trackInteraction(data: InteractionData): Promise<void> {
  try {
    const baseModuleType = mapToBaseModuleType(data.moduleType);
    
    // Record to Platform Intelligence
    PlatformIntelligence.recordModuleInteraction(
      baseModuleType,
      data.wasSuccessful,
      data.userSatisfaction,
      data.userFeedback
    );
    
    // Track specific feature effectiveness
    const featureId = `${data.moduleType}_${data.action}`;
    PlatformIntelligence.recordRuleEffectiveness(
      featureId,
      data.wasSuccessful ? "positive" : data.userSatisfaction && data.userSatisfaction < 5 ? "negative" : "neutral",
      data.userSatisfaction
    );
    
    // Track user preferences if they made a choice
    if (data.userChoice) {
      trackUserPreference(data.moduleType, data.userChoice, data.wasSuccessful);
    }
    
    console.log(`[SelfLearning] Tracked: ${data.moduleType}/${data.action} - Success: ${data.wasSuccessful}`);
  } catch (error) {
    console.error("[SelfLearning] Failed to track interaction:", error);
  }
}

// ============================================================================
// USER PREFERENCE LEARNING
// ============================================================================

// In-memory preference store (would be database in production)
const userPreferences: Map<string, Map<string, number>> = new Map();
const globalPreferences: Map<string, Map<string, number>> = new Map();

/**
 * Track what users prefer within each module
 */
function trackUserPreference(
  moduleType: ExtendedModuleType,
  choice: string,
  wasSuccessful: boolean
): void {
  // Update global preferences
  if (!globalPreferences.has(moduleType)) {
    globalPreferences.set(moduleType, new Map());
  }
  const modulePrefs = globalPreferences.get(moduleType)!;
  const currentScore = modulePrefs.get(choice) || 0;
  modulePrefs.set(choice, currentScore + (wasSuccessful ? 1 : -0.5));
}

/**
 * Get top preferences for a module (what clients want most)
 */
export function getTopPreferences(moduleType: ExtendedModuleType, limit: number = 5): string[] {
  const modulePrefs = globalPreferences.get(moduleType);
  if (!modulePrefs) return [];
  
  return Array.from(modulePrefs.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([choice]) => choice);
}

// ============================================================================
// FEATURE EFFECTIVENESS
// ============================================================================

/**
 * Get effectiveness score for any feature
 * Returns 0-100 score based on user outcomes
 */
export function getFeatureEffectiveness(moduleType: ExtendedModuleType, action: string): number {
  const featureId = `${moduleType}_${action}`;
  const effectiveness = PlatformIntelligence.getRuleEffectiveness(featureId);
  return effectiveness?.effectivenessScore || 50; // Default to neutral
}

/**
 * Check if a feature should be promoted or demoted
 */
export function shouldPromoteFeature(moduleType: ExtendedModuleType, action: string): boolean {
  return getFeatureEffectiveness(moduleType, action) >= 70;
}

export function shouldDemoteFeature(moduleType: ExtendedModuleType, action: string): boolean {
  return getFeatureEffectiveness(moduleType, action) < 40;
}

// ============================================================================
// SELF-FIXING RECOMMENDATIONS
// ============================================================================

export interface FixRecommendation {
  moduleType: ExtendedModuleType;
  issue: string;
  recommendation: string;
  priority: "critical" | "high" | "medium" | "low";
  dataPoints: number;  // How many interactions informed this
}

/**
 * Get recommendations for fixing underperforming features
 */
export async function getFixRecommendations(): Promise<FixRecommendation[]> {
  const recommendations: FixRecommendation[] = [];
  
  // Analyze each module's effectiveness
  const moduleTypes: ExtendedModuleType[] = [
    "ai_chat", "sleep_stories", "focus_coach", "meditation",
    "just_talk", "structured_programs", "client_recognition",
    "voice_coaching", "session_analysis"
  ];
  
  for (const moduleType of moduleTypes) {
    const learning = PlatformIntelligence.getModuleLearning(mapToBaseModuleType(moduleType));
    
    if (learning && learning.successRate < 60 && learning.totalInteractions > 20) {
      recommendations.push({
        moduleType,
        issue: `Low success rate: ${learning.successRate.toFixed(1)}%`,
        recommendation: learning.suggestedImprovements[0] || "Review user feedback and adjust approach",
        priority: learning.successRate < 40 ? "critical" : "high",
        dataPoints: learning.totalInteractions,
      });
    }
    
    // Check for ineffective strategies
    if (learning?.topIneffectiveStrategies.length) {
      for (const strategy of learning.topIneffectiveStrategies.slice(0, 2)) {
        recommendations.push({
          moduleType,
          issue: `Ineffective strategy: ${strategy}`,
          recommendation: `Consider removing or modifying "${strategy}"`,
          priority: "medium",
          dataPoints: learning.totalInteractions,
        });
      }
    }
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// ============================================================================
// CLIENT-CENTRIC EVOLUTION
// ============================================================================

export interface EvolutionSuggestion {
  type: "add_feature" | "modify_feature" | "remove_feature" | "change_default";
  moduleType: ExtendedModuleType;
  description: string;
  rationale: string;
  clientDemand: number;  // 0-100, how much clients want this
  confidence: number;  // 0-100, how confident we are in this suggestion
}

/**
 * Get suggestions for how the platform should evolve based on client behavior
 */
export async function getEvolutionSuggestions(): Promise<EvolutionSuggestion[]> {
  const suggestions: EvolutionSuggestion[] = [];
  
  // Analyze platform-wide patterns
  const insights = PlatformIntelligence.getInsights();
  
  for (const insight of insights) {
    if (insight.type === "recommendation" && insight.confidence >= 70) {
      suggestions.push({
        type: "modify_feature",
        moduleType: insight.affectedModules[0] as ExtendedModuleType || "coaching_techniques",
        description: insight.title,
        rationale: insight.description,
        clientDemand: insight.affectedPercentage,
        confidence: insight.confidence,
      });
    }
  }
  
  // Add suggestions based on top preferences
  for (const [moduleType, prefs] of globalPreferences) {
    const topChoices = Array.from(prefs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    for (const [choice, score] of topChoices) {
      if (score > 10) {  // Significant preference
        suggestions.push({
          type: "change_default",
          moduleType: moduleType as ExtendedModuleType,
          description: `Make "${choice}" more prominent or default`,
          rationale: `${score} positive interactions with this option`,
          clientDemand: Math.min(100, score * 5),
          confidence: Math.min(100, 50 + score * 2),
        });
      }
    }
  }
  
  return suggestions.sort((a, b) => b.clientDemand - a.clientDemand);
}

// ============================================================================
// EASY INTEGRATION HELPERS
// ============================================================================

/**
 * Track a successful completion (e.g., finished meditation, completed program day)
 */
export function trackCompletion(
  moduleType: ExtendedModuleType,
  action: string,
  userId?: number,
  satisfaction?: number
): void {
  trackInteraction({
    moduleType,
    userId,
    action,
    wasSuccessful: true,
    userSatisfaction: satisfaction,
  });
}

/**
 * Track an abandonment (e.g., stopped meditation early, left session)
 */
export function trackAbandonment(
  moduleType: ExtendedModuleType,
  action: string,
  userId?: number,
  duration?: number
): void {
  trackInteraction({
    moduleType,
    userId,
    action: `${action}_abandoned`,
    wasSuccessful: false,
    duration,
  });
}

/**
 * Track a user choice (for preference learning)
 */
export function trackChoice(
  moduleType: ExtendedModuleType,
  choice: string,
  alternatives: string[],
  userId?: number
): void {
  trackInteraction({
    moduleType,
    userId,
    action: "made_choice",
    wasSuccessful: true,
    userChoice: choice,
    alternatives,
  });
}

/**
 * Track user feedback
 */
export function trackFeedback(
  moduleType: ExtendedModuleType,
  action: string,
  satisfaction: number,
  feedback?: string,
  userId?: number
): void {
  trackInteraction({
    moduleType,
    userId,
    action,
    wasSuccessful: satisfaction >= 7,
    userSatisfaction: satisfaction,
    userFeedback: feedback,
  });
}

// ============================================================================
// UNIFIED CLIENT PROFILE EXTRACTION
// ============================================================================

/**
 * Extract profile information from ANY text interaction and update the Unified Client Profile.
 * This ensures perfect continuity across ALL modules.
 * 
 * Call this from any module that has text content from the user.
 */
export async function extractAndUpdateClientProfile(
  userId: number | undefined,
  userContent: string,
  context: {
    moduleType: ExtendedModuleType;
    sessionId?: string;
    additionalContext?: string;
  }
): Promise<void> {
  if (!userId || !userContent || userContent.length < 20) return;
  
  try {
    const extractionPrompt = `Analyze this user content from a ${context.moduleType} interaction and extract any profile information.

USER CONTENT: "${userContent}"
${context.additionalContext ? `\nCONTEXT: ${context.additionalContext}` : ""}

Extract any of the following if mentioned (return null if not mentioned):
- name: Their name
- primaryGoal: What they want to achieve (health, career, relationships, etc.)
- mainChallenges: What they're struggling with (as JSON array of strings)
- communicationStyle: How they prefer to communicate (direct, gentle, detailed, etc.)
- triggers: Things that upset or stress them (as JSON array of strings)
- sleepPatterns: Sleep habits, issues, or preferences
- stressors: Current sources of stress (as JSON array)
- healthConcerns: Physical or mental health concerns (as JSON array)
- preferences: Any preferences mentioned (meditation style, focus music, etc.)
- lifeContext: Important life context (job, family, location, etc.)

Return a JSON object with only the fields that were clearly mentioned. Be conservative - only extract if explicitly stated.
If nothing relevant is mentioned, return an empty object {}.`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a profile extraction assistant. Extract profile information from user content. Return valid JSON only, no markdown." },
        { role: "user", content: extractionPrompt }
      ],
      model: "gpt-4o-mini",
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return;

    // Parse the extracted data
    let extracted;
    try {
      // Handle markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      extracted = JSON.parse(jsonMatch[1] || content);
    } catch (e) {
      console.error(`[ProfileExtraction:${context.moduleType}] JSON parse error:`, e);
      return;
    }

    // Skip if nothing extracted
    if (!extracted || Object.keys(extracted).length === 0) return;

    // Build update data
    const updateData: Record<string, any> = {};
    
    // Map extracted fields to user profile fields
    if (extracted.name) updateData.name = extracted.name;
    if (extracted.primaryGoal) updateData.primaryGoal = extracted.primaryGoal;
    if (extracted.mainChallenges) {
      updateData.mainChallenges = typeof extracted.mainChallenges === 'string' 
        ? extracted.mainChallenges 
        : JSON.stringify(extracted.mainChallenges);
    }
    if (extracted.communicationStyle) updateData.communicationStyle = extracted.communicationStyle;
    if (extracted.triggers) {
      updateData.triggers = typeof extracted.triggers === 'string'
        ? extracted.triggers
        : JSON.stringify(extracted.triggers);
    }
    
    // Store additional extracted data in a flexible metadata field
    const additionalData: Record<string, any> = {};
    if (extracted.sleepPatterns) additionalData.sleepPatterns = extracted.sleepPatterns;
    if (extracted.stressors) additionalData.stressors = extracted.stressors;
    if (extracted.healthConcerns) additionalData.healthConcerns = extracted.healthConcerns;
    if (extracted.preferences) additionalData.preferences = extracted.preferences;
    if (extracted.lifeContext) additionalData.lifeContext = extracted.lifeContext;
    
    if (Object.keys(additionalData).length > 0) {
      // Merge with existing metadata
      const [currentUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      const existingMetadata = currentUser?.metadata ? JSON.parse(currentUser.metadata as string) : {};
      updateData.metadata = JSON.stringify({ ...existingMetadata, ...additionalData });
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      
      // Calculate profile completeness
      const [currentUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (currentUser) {
        const fields = ['name', 'primaryGoal', 'mainChallenges', 'communicationStyle', 'triggers', 'timezone', 'availability'];
        const merged = { ...currentUser, ...updateData };
        const filledFields = fields.filter(f => merged[f as keyof typeof merged]);
        updateData.profileCompleteness = Math.round((filledFields.length / fields.length) * 100);
      }
      
      await db.update(users).set(updateData).where(eq(users.id, userId));
      console.log(`[ProfileExtraction:${context.moduleType}] Updated profile for user ${userId} with:`, Object.keys(updateData));
    }
  } catch (error) {
    console.error(`[ProfileExtraction:${context.moduleType}] Failed:`, error);
  }
}

/**
 * Get the full unified client profile for continuity
 */
export async function getClientProfile(userId: number): Promise<Record<string, any> | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      primaryGoal: user.primaryGoal,
      mainChallenges: user.mainChallenges ? JSON.parse(user.mainChallenges as string) : [],
      communicationStyle: user.communicationStyle,
      triggers: user.triggers ? JSON.parse(user.triggers as string) : [],
      timezone: user.timezone,
      availability: user.availability,
      profileCompleteness: user.profileCompleteness,
      metadata: user.metadata ? JSON.parse(user.metadata as string) : {},
    };
  } catch (error) {
    console.error("[ProfileExtraction] Failed to get profile:", error);
    return null;
  }
}

/**
 * Get profile summary for AI context (to maintain continuity)
 */
export async function getProfileSummaryForAI(userId: number): Promise<string> {
  const profile = await getClientProfile(userId);
  if (!profile) return "";
  
  const parts: string[] = [];
  
  if (profile.name) parts.push(`Name: ${profile.name}`);
  if (profile.primaryGoal) parts.push(`Goal: ${profile.primaryGoal}`);
  if (profile.mainChallenges?.length) parts.push(`Challenges: ${profile.mainChallenges.join(", ")}`);
  if (profile.communicationStyle) parts.push(`Prefers: ${profile.communicationStyle} communication`);
  if (profile.triggers?.length) parts.push(`Triggers: ${profile.triggers.join(", ")}`);
  if (profile.metadata?.sleepPatterns) parts.push(`Sleep: ${profile.metadata.sleepPatterns}`);
  if (profile.metadata?.healthConcerns?.length) parts.push(`Health concerns: ${profile.metadata.healthConcerns.join(", ")}`);
  
  return parts.length > 0 ? `\n\nKNOWN ABOUT THIS CLIENT:\n${parts.join("\n")}` : "";
}

// ============================================================================
// EXPORT
// ============================================================================

export const SelfLearning = {
  // Core tracking
  trackInteraction,
  trackCompletion,
  trackAbandonment,
  trackChoice,
  trackFeedback,
  
  // Preferences
  getTopPreferences,
  
  // Effectiveness
  getFeatureEffectiveness,
  shouldPromoteFeature,
  shouldDemoteFeature,
  
  // Self-fixing
  getFixRecommendations,
  
  // Evolution
  getEvolutionSuggestions,
  
  // Unified Client Profile (continuity across all modules)
  extractAndUpdateClientProfile,
  getClientProfile,
  getProfileSummaryForAI,
};

export default SelfLearning;
