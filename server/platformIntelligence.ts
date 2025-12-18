/**
 * PLATFORM INTELLIGENCE ENGINE
 * 
 * Self-learning, self-evolving system that:
 * 1. Aggregates data from ALL modules across ALL clients
 * 2. Continuously validates against Truth Keepers (empirical research only)
 * 3. Auto-updates rules, recommendations, and approaches based on what works
 * 4. Bends towards what clients actually need
 * 
 * CORE PRINCIPLES:
 * - Only evidence-based, empirically proven approaches
 * - Continuous learning from client outcomes
 * - Automatic rule evolution based on effectiveness
 * - Research validation through Truth Keepers
 * - Platform-wide pattern detection
 */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// TYPES
// ============================================================================

export type ModuleType = 
  | "compliance"
  | "emotional_wellness"
  | "mental_health"
  | "physical_fitness"
  | "nutrition"
  | "sleep"
  | "relationships"
  | "financial"
  | "spiritual"
  | "career"
  | "coaching_techniques"
  | "crisis_intervention";

export type EvidenceLevel = "A" | "B" | "C" | "D";

export interface ResearchValidation {
  isValid: boolean;
  evidenceLevel: EvidenceLevel;
  sources: string[];
  lastValidated: Date;
  confidence: number; // 0-100
}

export interface RuleEffectiveness {
  ruleId: string;
  timesTriggered: number;
  clientsAffected: number;
  positiveOutcomes: number;
  negativeOutcomes: number;
  neutralOutcomes: number;
  averageClientSatisfaction: number; // 1-10
  effectivenessScore: number; // Calculated: 0-100
  lastUpdated: Date;
}

export interface ModuleLearning {
  moduleType: ModuleType;
  totalInteractions: number;
  successRate: number;
  topEffectiveStrategies: string[];
  topIneffectiveStrategies: string[];
  clientPreferences: Record<string, number>; // preference -> count
  emergingPatterns: string[];
  suggestedImprovements: string[];
  lastAnalyzed: Date;
}

export interface PlatformInsight {
  id: string;
  type: "trend" | "pattern" | "recommendation" | "warning" | "research_update";
  title: string;
  description: string;
  affectedModules: ModuleType[];
  affectedPercentage: number; // % of clients affected
  suggestedAction: string;
  researchBasis?: string;
  confidence: number;
  createdAt: Date;
}

export interface EvolutionEvent {
  id: string;
  eventType: "rule_updated" | "rule_added" | "rule_deprecated" | "strategy_changed" | "research_validated";
  moduleType: ModuleType;
  description: string;
  reason: string;
  previousValue?: any;
  newValue?: any;
  researchBasis?: string;
  timestamp: Date;
}

// ============================================================================
// IN-MEMORY STORES (Would be database in production)
// ============================================================================

const ruleEffectivenessStore: Map<string, RuleEffectiveness> = new Map();
const moduleLearningStore: Map<ModuleType, ModuleLearning> = new Map();
const platformInsightsStore: PlatformInsight[] = [];
const evolutionHistoryStore: EvolutionEvent[] = [];
const researchValidationCache: Map<string, ResearchValidation> = new Map();

// ============================================================================
// TRUTH KEEPERS INTEGRATION
// ============================================================================

/**
 * Validate a claim against empirical research
 * Only Level A and B evidence is accepted
 */
export async function validateAgainstResearch(
  claim: string,
  domain: ModuleType
): Promise<ResearchValidation> {
  const cacheKey = `${domain}:${claim.toLowerCase().slice(0, 100)}`;
  
  // Check cache first
  const cached = researchValidationCache.get(cacheKey);
  if (cached && Date.now() - cached.lastValidated.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return cached;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a research validator for a wellness coaching platform. Your job is to validate claims against empirical, peer-reviewed research ONLY.

EVIDENCE LEVELS (Oxford Centre for Evidence-Based Medicine):
- Level A (High): Systematic reviews, meta-analyses, multiple RCTs - ACCEPT
- Level B (Moderate): Individual RCTs, cohort studies, strong observational data - ACCEPT
- Level C (Low): Case-control studies, expert consensus, limited evidence - CAUTION
- Level D (Insufficient): Anecdotal, single studies, not peer-reviewed - REJECT

VALIDATION CRITERIA:
1. Must be peer-reviewed
2. Must have adequate sample size
3. Must be replicable
4. Must have clinical significance (not just p < 0.05)
5. Prefer recent research (last 10 years)
6. No conflicts of interest

Domain: ${domain}

Respond in JSON:
{
  "isValid": boolean,
  "evidenceLevel": "A" | "B" | "C" | "D",
  "sources": ["citation 1", "citation 2"],
  "confidence": 0-100,
  "reasoning": "why this is/isn't valid"
}`
        },
        {
          role: "user",
          content: `Validate this claim: "${claim}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    const validation: ResearchValidation = {
      isValid: result.isValid && (result.evidenceLevel === "A" || result.evidenceLevel === "B"),
      evidenceLevel: result.evidenceLevel,
      sources: result.sources || [],
      lastValidated: new Date(),
      confidence: result.confidence || 50,
    };

    researchValidationCache.set(cacheKey, validation);
    return validation;
  } catch (error) {
    console.error("[TruthKeepers] Validation error:", error);
    return {
      isValid: false,
      evidenceLevel: "D",
      sources: [],
      lastValidated: new Date(),
      confidence: 0,
    };
  }
}

/**
 * Search for new research on a topic
 */
export async function searchNewResearch(
  topic: string,
  domain: ModuleType
): Promise<{
  newFindings: string[];
  contradictions: string[];
  recommendations: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a research analyst for a wellness coaching platform. Search for the latest empirical research on the given topic.

Focus on:
1. New findings from peer-reviewed sources (last 2 years)
2. Any contradictions to existing beliefs
3. Actionable recommendations based on evidence

Domain: ${domain}

Only include Level A or B evidence. Reject anything without strong empirical backing.

Respond in JSON:
{
  "newFindings": ["finding 1 with citation", "finding 2 with citation"],
  "contradictions": ["old belief vs new evidence"],
  "recommendations": ["actionable recommendation based on research"]
}`
        },
        {
          role: "user",
          content: `Find latest research on: "${topic}"`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("[TruthKeepers] Research search error:", error);
    return { newFindings: [], contradictions: [], recommendations: [] };
  }
}

// ============================================================================
// SELF-LEARNING ENGINE
// ============================================================================

/**
 * Record rule effectiveness from client interaction
 */
export function recordRuleEffectiveness(
  ruleId: string,
  outcome: "positive" | "negative" | "neutral",
  clientSatisfaction?: number
): void {
  const existing = ruleEffectivenessStore.get(ruleId) || {
    ruleId,
    timesTriggered: 0,
    clientsAffected: 0,
    positiveOutcomes: 0,
    negativeOutcomes: 0,
    neutralOutcomes: 0,
    averageClientSatisfaction: 5,
    effectivenessScore: 50,
    lastUpdated: new Date(),
  };

  existing.timesTriggered++;
  existing.clientsAffected++;
  
  if (outcome === "positive") existing.positiveOutcomes++;
  else if (outcome === "negative") existing.negativeOutcomes++;
  else existing.neutralOutcomes++;

  if (clientSatisfaction) {
    const totalRatings = existing.timesTriggered;
    existing.averageClientSatisfaction = 
      ((existing.averageClientSatisfaction * (totalRatings - 1)) + clientSatisfaction) / totalRatings;
  }

  // Calculate effectiveness score
  const total = existing.positiveOutcomes + existing.negativeOutcomes + existing.neutralOutcomes;
  if (total > 0) {
    existing.effectivenessScore = Math.round(
      ((existing.positiveOutcomes * 100) + (existing.neutralOutcomes * 50)) / total
    );
  }

  existing.lastUpdated = new Date();
  ruleEffectivenessStore.set(ruleId, existing);

  // Check if rule needs evolution
  checkRuleEvolution(ruleId, existing);
}

/**
 * Check if a rule should evolve based on effectiveness
 */
async function checkRuleEvolution(ruleId: string, effectiveness: RuleEffectiveness): Promise<void> {
  // Only evolve after sufficient data
  if (effectiveness.timesTriggered < 50) return;

  // Rule is ineffective - needs improvement
  if (effectiveness.effectivenessScore < 40) {
    const evolution: EvolutionEvent = {
      id: `evo_${Date.now()}`,
      eventType: "rule_updated",
      moduleType: "compliance",
      description: `Rule ${ruleId} marked for improvement due to low effectiveness`,
      reason: `Effectiveness score: ${effectiveness.effectivenessScore}%, Client satisfaction: ${effectiveness.averageClientSatisfaction}/10`,
      timestamp: new Date(),
    };
    evolutionHistoryStore.push(evolution);

    // Generate improvement suggestion
    await suggestRuleImprovement(ruleId, effectiveness);
  }

  // Rule is highly effective - reinforce
  if (effectiveness.effectivenessScore > 85 && effectiveness.averageClientSatisfaction > 8) {
    const evolution: EvolutionEvent = {
      id: `evo_${Date.now()}`,
      eventType: "rule_updated",
      moduleType: "compliance",
      description: `Rule ${ruleId} validated as highly effective`,
      reason: `Effectiveness score: ${effectiveness.effectivenessScore}%, Client satisfaction: ${effectiveness.averageClientSatisfaction}/10`,
      timestamp: new Date(),
    };
    evolutionHistoryStore.push(evolution);
  }
}

/**
 * Generate AI suggestion for improving an ineffective rule
 */
async function suggestRuleImprovement(
  ruleId: string,
  effectiveness: RuleEffectiveness
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert in coaching communication and behavioral psychology. A compliance rule is underperforming and needs improvement.

Current effectiveness: ${effectiveness.effectivenessScore}%
Client satisfaction: ${effectiveness.averageClientSatisfaction}/10
Times triggered: ${effectiveness.timesTriggered}
Positive outcomes: ${effectiveness.positiveOutcomes}
Negative outcomes: ${effectiveness.negativeOutcomes}

Suggest improvements based on:
1. Latest research in communication psychology
2. What makes coaching interventions effective
3. Client-centered approaches
4. Evidence-based alternatives

Provide specific, actionable improvements.`
        },
        {
          role: "user",
          content: `Improve rule: ${ruleId}`
        }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("[Evolution] Suggestion error:", error);
    return "";
  }
}

// ============================================================================
// MODULE LEARNING AGGREGATION
// ============================================================================

/**
 * Record module interaction for learning
 */
export function recordModuleInteraction(
  moduleType: ModuleType,
  wasSuccessful: boolean,
  strategy: string,
  clientPreference?: string
): void {
  const existing = moduleLearningStore.get(moduleType) || {
    moduleType,
    totalInteractions: 0,
    successRate: 0.5,
    topEffectiveStrategies: [],
    topIneffectiveStrategies: [],
    clientPreferences: {},
    emergingPatterns: [],
    suggestedImprovements: [],
    lastAnalyzed: new Date(),
  };

  existing.totalInteractions++;
  
  // Update success rate (exponential moving average)
  const alpha = 0.1; // Learning rate
  existing.successRate = existing.successRate * (1 - alpha) + (wasSuccessful ? 1 : 0) * alpha;

  // Track strategy effectiveness
  if (wasSuccessful) {
    if (!existing.topEffectiveStrategies.includes(strategy)) {
      existing.topEffectiveStrategies.push(strategy);
      if (existing.topEffectiveStrategies.length > 10) {
        existing.topEffectiveStrategies.shift();
      }
    }
  } else {
    if (!existing.topIneffectiveStrategies.includes(strategy)) {
      existing.topIneffectiveStrategies.push(strategy);
      if (existing.topIneffectiveStrategies.length > 10) {
        existing.topIneffectiveStrategies.shift();
      }
    }
  }

  // Track client preferences
  if (clientPreference) {
    existing.clientPreferences[clientPreference] = 
      (existing.clientPreferences[clientPreference] || 0) + 1;
  }

  moduleLearningStore.set(moduleType, existing);
}

/**
 * Analyze all modules and generate platform-wide insights
 */
export async function analyzePlatformPatterns(): Promise<PlatformInsight[]> {
  const insights: PlatformInsight[] = [];

  // Aggregate data from all modules
  const moduleData = Array.from(moduleLearningStore.values());
  
  if (moduleData.length === 0) return insights;

  // Find cross-module patterns
  const allPreferences: Record<string, number> = {};
  const allEffectiveStrategies: string[] = [];
  const allIneffectiveStrategies: string[] = [];

  for (const module of moduleData) {
    for (const [pref, count] of Object.entries(module.clientPreferences)) {
      allPreferences[pref] = (allPreferences[pref] || 0) + count;
    }
    allEffectiveStrategies.push(...module.topEffectiveStrategies);
    allIneffectiveStrategies.push(...module.topIneffectiveStrategies);
  }

  // Generate insights using AI
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a platform intelligence analyst. Analyze the aggregated data from all wellness coaching modules and identify:

1. Cross-module patterns (things that work across multiple areas)
2. Client preference trends
3. Emerging needs not being addressed
4. Strategies that should be promoted platform-wide
5. Strategies that should be deprecated

Data:
- Modules analyzed: ${moduleData.length}
- Top preferences: ${JSON.stringify(Object.entries(allPreferences).sort((a, b) => b[1] - a[1]).slice(0, 5))}
- Effective strategies: ${allEffectiveStrategies.slice(0, 10).join(", ")}
- Ineffective strategies: ${allIneffectiveStrategies.slice(0, 10).join(", ")}

Respond in JSON:
{
  "insights": [
    {
      "type": "trend" | "pattern" | "recommendation" | "warning",
      "title": "short title",
      "description": "detailed description",
      "affectedModules": ["module1", "module2"],
      "affectedPercentage": 0-100,
      "suggestedAction": "what to do",
      "confidence": 0-100
    }
  ]
}`
        },
        {
          role: "user",
          content: "Analyze and generate platform insights"
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    for (const insight of result.insights || []) {
      insights.push({
        id: `insight_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...insight,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error("[PlatformIntelligence] Analysis error:", error);
  }

  platformInsightsStore.push(...insights);
  return insights;
}

// ============================================================================
// EVIDENCE-BASED TREATMENT DISCOVERY
// ============================================================================

/**
 * Search for evidence-based treatments across all domains
 * Includes: microdosing, stem cells, plant medicine, barometric treatment, etc.
 * ONLY if empirically proven beneficial
 */
export async function discoverEvidenceBasedTreatments(
  condition: string
): Promise<{
  treatments: Array<{
    name: string;
    description: string;
    evidenceLevel: EvidenceLevel;
    sources: string[];
    mechanism: string;
    contraindications: string[];
    legalStatus: string;
  }>;
  disclaimer: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a medical research analyst. Find ALL evidence-based treatments for the given condition, including:

CONVENTIONAL:
- Pharmaceutical interventions
- Surgical procedures
- Physical therapies

EMERGING/ALTERNATIVE (ONLY if empirically proven):
- Psychedelic-assisted therapy (psilocybin, MDMA, ketamine)
- Plant medicine (if peer-reviewed evidence exists)
- Stem cell treatments
- Hyperbaric/barometric therapy
- Nutritional interventions
- Mind-body practices

EVIDENCE REQUIREMENTS:
- Must have Level A or B evidence (RCTs, meta-analyses)
- Must be published in peer-reviewed journals
- Must show clinical significance
- Include legal status and contraindications

DO NOT include:
- Anecdotal evidence
- Single case studies
- Non-peer-reviewed claims
- Pseudoscience

Respond in JSON:
{
  "treatments": [
    {
      "name": "treatment name",
      "description": "what it is and how it works",
      "evidenceLevel": "A" | "B",
      "sources": ["citation 1", "citation 2"],
      "mechanism": "how it works biologically",
      "contraindications": ["who should not use this"],
      "legalStatus": "legal status in US/internationally"
    }
  ],
  "disclaimer": "appropriate medical disclaimer"
}`
        },
        {
          role: "user",
          content: `Find evidence-based treatments for: ${condition}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    return JSON.parse(response.choices[0].message.content || '{"treatments":[],"disclaimer":""}');
  } catch (error) {
    console.error("[TruthKeepers] Treatment discovery error:", error);
    return {
      treatments: [],
      disclaimer: "Unable to retrieve treatment information. Please consult a healthcare provider.",
    };
  }
}

// ============================================================================
// COMPLIANCE SELF-LEARNING INTEGRATION
// ============================================================================

/**
 * Compliance rules that learn and evolve
 */
export interface AdaptiveComplianceRule {
  id: string;
  category: string;
  pattern: RegExp | string;
  suggestion: string;
  researchBasis: string;
  effectiveness: RuleEffectiveness;
  lastResearchValidation: Date;
  isActive: boolean;
  version: number;
}

const adaptiveComplianceRules: Map<string, AdaptiveComplianceRule> = new Map();

/**
 * Get compliance rules that adapt based on effectiveness
 */
export function getAdaptiveComplianceRules(): AdaptiveComplianceRule[] {
  return Array.from(adaptiveComplianceRules.values())
    .filter(rule => rule.isActive)
    .sort((a, b) => b.effectiveness.effectivenessScore - a.effectiveness.effectivenessScore);
}

/**
 * Update compliance rule based on client feedback
 */
export async function updateComplianceRuleFromFeedback(
  ruleId: string,
  wasHelpful: boolean,
  clientFeedback?: string
): Promise<void> {
  recordRuleEffectiveness(ruleId, wasHelpful ? "positive" : "negative");

  const rule = adaptiveComplianceRules.get(ruleId);
  if (!rule) return;

  // If rule is underperforming, trigger research revalidation
  const effectiveness = ruleEffectivenessStore.get(ruleId);
  if (effectiveness && effectiveness.effectivenessScore < 50 && effectiveness.timesTriggered > 30) {
    const validation = await validateAgainstResearch(rule.suggestion, "compliance");
    rule.lastResearchValidation = new Date();

    if (!validation.isValid) {
      // Deprecate rule if research doesn't support it
      rule.isActive = false;
      evolutionHistoryStore.push({
        id: `evo_${Date.now()}`,
        eventType: "rule_deprecated",
        moduleType: "compliance",
        description: `Rule ${ruleId} deprecated due to lack of research support`,
        reason: `Evidence level: ${validation.evidenceLevel}, Effectiveness: ${effectiveness.effectivenessScore}%`,
        timestamp: new Date(),
      });
    }
  }
}

// ============================================================================
// PLATFORM INTELLIGENCE API
// ============================================================================

export const PlatformIntelligence = {
  // Truth Keepers
  validateResearch: validateAgainstResearch,
  searchNewResearch,
  discoverTreatments: discoverEvidenceBasedTreatments,

  // Self-Learning
  recordRuleEffectiveness,
  recordModuleInteraction,
  analyzePlatformPatterns,

  // Compliance Integration
  getAdaptiveRules: getAdaptiveComplianceRules,
  updateRuleFromFeedback: updateComplianceRuleFromFeedback,

  // Insights & Evolution
  getInsights: () => platformInsightsStore.slice(-50),
  getEvolutionHistory: () => evolutionHistoryStore.slice(-100),
  getRuleEffectiveness: (ruleId: string) => ruleEffectivenessStore.get(ruleId),
  getModuleLearning: (moduleType: ModuleType) => moduleLearningStore.get(moduleType),

  // Summary
  getSummary: () => ({
    totalRulesTracked: ruleEffectivenessStore.size,
    totalModulesLearning: moduleLearningStore.size,
    totalInsights: platformInsightsStore.length,
    totalEvolutions: evolutionHistoryStore.length,
    researchValidationsCache: researchValidationCache.size,
  }),
};

export default PlatformIntelligence;
