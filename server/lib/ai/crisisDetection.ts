/**
 * CRISIS DETECTION MODULE
 * 
 * Evidence-based crisis detection for suicide ideation, self-harm, and immediate danger.
 * Based on research from:
 * - American Association of Suicidology
 * - National Suicide Prevention Lifeline protocols
 * - Columbia-Suicide Severity Rating Scale (C-SSRS)
 * 
 * SAFETY CRITICAL: This module must be highly accurate and never miss true positives.
 */

import { invokeLLM } from "../../_core/llm.js";

export type CrisisLevel = "none" | "low" | "medium" | "high" | "critical";

export interface CrisisDetectionResult {
  level: CrisisLevel;
  confidence: number; // 0-1
  indicators: string[];
  immediateAction: string;
  recommendedResponse: string;
  shouldEscalate: boolean;
  shouldNotifyEmergency: boolean;
}

/**
 * Research-backed crisis keywords and phrases
 * Source: Columbia-Suicide Severity Rating Scale (C-SSRS)
 */
const CRISIS_INDICATORS = {
  // CRITICAL - Immediate danger
  critical: [
    "going to kill myself",
    "want to die",
    "end my life",
    "suicide plan",
    "have a gun",
    "have pills",
    "tonight is the night",
    "goodbye forever",
    "won't be here tomorrow",
    "better off dead",
    "can't go on",
    "no reason to live",
  ],
  
  // HIGH - Active ideation
  high: [
    "kill myself",
    "end it all",
    "don't want to live",
    "wish I was dead",
    "thinking about suicide",
    "hurt myself",
    "self harm",
    "cut myself",
    "overdose",
    "jump off",
    "everyone would be better without me",
  ],
  
  // MEDIUM - Passive ideation or severe distress
  medium: [
    "life isn't worth living",
    "nothing matters anymore",
    "hopeless",
    "no way out",
    "can't take it anymore",
    "give up",
    "worthless",
    "burden to everyone",
    "tired of living",
    "sleep forever",
  ],
  
  // LOW - Warning signs
  low: [
    "don't care anymore",
    "what's the point",
    "nobody cares",
    "alone in this",
    "can't do this",
    "too much pain",
    "unbearable",
    "trapped",
  ],
};

/**
 * Protective factors that reduce crisis risk
 */
const PROTECTIVE_FACTORS = [
  "but I won't",
  "but I have",
  "talking helps",
  "getting help",
  "therapy",
  "support",
  "family",
  "friends",
  "reasons to live",
  "hope",
  "future",
  "goals",
];

/**
 * Detect crisis level from text using keyword matching
 */
function detectCrisisKeywords(text: string): {
  level: CrisisLevel;
  indicators: string[];
  hasProtectiveFactors: boolean;
} {
  const lowerText = text.toLowerCase();
  const indicators: string[] = [];
  let level: CrisisLevel = "none";
  
  // Check for protective factors
  const hasProtectiveFactors = PROTECTIVE_FACTORS.some(factor => 
    lowerText.includes(factor)
  );
  
  // Check critical indicators first
  for (const indicator of CRISIS_INDICATORS.critical) {
    if (lowerText.includes(indicator)) {
      indicators.push(indicator);
      level = "critical";
    }
  }
  
  // If not critical, check high
  if (level === "none") {
    for (const indicator of CRISIS_INDICATORS.high) {
      if (lowerText.includes(indicator)) {
        indicators.push(indicator);
        level = "high";
      }
    }
  }
  
  // If not high, check medium
  if (level === "none") {
    for (const indicator of CRISIS_INDICATORS.medium) {
      if (lowerText.includes(indicator)) {
        indicators.push(indicator);
        level = "medium";
      }
    }
  }
  
  // If not medium, check low
  if (level === "none") {
    for (const indicator of CRISIS_INDICATORS.low) {
      if (lowerText.includes(indicator)) {
        indicators.push(indicator);
        level = "low";
      }
    }
  }
  
  // Reduce severity if protective factors present
  if (hasProtectiveFactors && level === "high") {
    level = "medium";
  } else if (hasProtectiveFactors && level === "medium") {
    level = "low";
  }
  
  return { level, indicators, hasProtectiveFactors };
}

/**
 * Use AI to analyze context and confirm crisis level
 */
async function aiCrisisAnalysis(text: string, keywordLevel: CrisisLevel): Promise<{
  confirmedLevel: CrisisLevel;
  reasoning: string;
}> {
  try {
    const prompt = `You are a crisis assessment expert trained in the Columbia-Suicide Severity Rating Scale (C-SSRS).

Analyze this message for suicide risk:

"${text}"

Initial keyword-based assessment: ${keywordLevel}

Provide:
1. Confirmed crisis level: none, low, medium, high, or critical
2. Brief reasoning (1-2 sentences)

Respond in JSON format:
{
  "level": "none|low|medium|high|critical",
  "reasoning": "..."
}`;

    const response = await invokeLLM({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1, // Very low temperature for consistency
      maxTokens: 200,
    });
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        confirmedLevel: parsed.level || keywordLevel,
        reasoning: parsed.reasoning || "AI analysis completed",
      };
    }
    
    // Fallback to keyword level if parsing fails
    return {
      confirmedLevel: keywordLevel,
      reasoning: "AI analysis inconclusive, using keyword-based assessment",
    };
  } catch (error) {
    console.error("[CrisisDetection] AI analysis error:", error);
    // On error, use keyword level (fail-safe)
    return {
      confirmedLevel: keywordLevel,
      reasoning: "AI analysis failed, using keyword-based assessment",
    };
  }
}

/**
 * Generate appropriate response based on crisis level
 */
function generateCrisisResponse(level: CrisisLevel): {
  immediateAction: string;
  recommendedResponse: string;
  shouldEscalate: boolean;
  shouldNotifyEmergency: boolean;
} {
  switch (level) {
    case "critical":
      return {
        immediateAction: "IMMEDIATE INTERVENTION REQUIRED",
        recommendedResponse: "I'm very concerned about your safety right now. Please call 988 (Suicide & Crisis Lifeline) immediately, or text 'HELLO' to 741741 (Crisis Text Line). If you're in immediate danger, please call 911. You don't have to face this alone - help is available 24/7.",
        shouldEscalate: true,
        shouldNotifyEmergency: true,
      };
      
    case "high":
      return {
        immediateAction: "URGENT - Contact crisis resources",
        recommendedResponse: "I hear that you're going through an incredibly difficult time. Your safety is the top priority. Please reach out to the 988 Suicide & Crisis Lifeline (call or text 988) or the Crisis Text Line (text 'HELLO' to 741741). These services are free, confidential, and available 24/7. Would you be willing to connect with them now?",
        shouldEscalate: true,
        shouldNotifyEmergency: false,
      };
      
    case "medium":
      return {
        immediateAction: "Monitor closely and provide resources",
        recommendedResponse: "It sounds like you're carrying a heavy burden right now. I want you to know that support is available. The 988 Suicide & Crisis Lifeline (call or text 988) provides free, confidential support 24/7. Would it help to talk about what's making things feel so difficult?",
        shouldEscalate: true,
        shouldNotifyEmergency: false,
      };
      
    case "low":
      return {
        immediateAction: "Provide support and monitor",
        recommendedResponse: "I can hear that things are challenging right now. Remember that you don't have to face this alone. If you ever need immediate support, the 988 Suicide & Crisis Lifeline is available 24/7 (call or text 988). Let's work together to find ways to support you through this.",
        shouldEscalate: false,
        shouldNotifyEmergency: false,
      };
      
    case "none":
    default:
      return {
        immediateAction: "No crisis detected",
        recommendedResponse: "",
        shouldEscalate: false,
        shouldNotifyEmergency: false,
      };
  }
}

/**
 * Main crisis detection function
 * 
 * @param text - User message to analyze
 * @param useAI - Whether to use AI confirmation (default: true)
 * @returns Crisis detection result with recommended actions
 */
export async function detectCrisis(
  text: string,
  useAI: boolean = true
): Promise<CrisisDetectionResult> {
  // Step 1: Keyword-based detection (fast, reliable)
  const keywordResult = detectCrisisKeywords(text);
  
  // Step 2: AI confirmation for medium+ levels (slower, more nuanced)
  let finalLevel = keywordResult.level;
  let confidence = 0.7; // Base confidence for keyword matching
  
  if (useAI && (keywordResult.level === "medium" || keywordResult.level === "high" || keywordResult.level === "critical")) {
    const aiResult = await aiCrisisAnalysis(text, keywordResult.level);
    finalLevel = aiResult.confirmedLevel;
    confidence = 0.9; // Higher confidence with AI confirmation
    
    console.log(`[CrisisDetection] Keyword: ${keywordResult.level}, AI: ${aiResult.confirmedLevel}, Reasoning: ${aiResult.reasoning}`);
  }
  
  // Step 3: Generate response
  const response = generateCrisisResponse(finalLevel);
  
  // Step 4: Log for monitoring
  if (finalLevel !== "none") {
    console.warn(`[CrisisDetection] ⚠️ ${finalLevel.toUpperCase()} LEVEL DETECTED`);
    console.warn(`[CrisisDetection] Indicators: ${keywordResult.indicators.join(", ")}`);
    console.warn(`[CrisisDetection] Action: ${response.immediateAction}`);
  }
  
  return {
    level: finalLevel,
    confidence,
    indicators: keywordResult.indicators,
    immediateAction: response.immediateAction,
    recommendedResponse: response.recommendedResponse,
    shouldEscalate: response.shouldEscalate,
    shouldNotifyEmergency: response.shouldNotifyEmergency,
  };
}

/**
 * Quick crisis check (keyword-only, no AI)
 * Use for real-time monitoring where speed is critical
 */
export function quickCrisisCheck(text: string): CrisisLevel {
  const result = detectCrisisKeywords(text);
  return result.level;
}

/**
 * Get crisis resources for a specific level
 */
export function getCrisisResources(level: CrisisLevel): {
  hotlines: Array<{ name: string; number: string; text?: string }>;
  websites: Array<{ name: string; url: string }>;
} {
  return {
    hotlines: [
      {
        name: "988 Suicide & Crisis Lifeline",
        number: "988",
        text: "Text 988",
      },
      {
        name: "Crisis Text Line",
        number: "Text HELLO to 741741",
      },
      {
        name: "Emergency Services",
        number: "911",
      },
    ],
    websites: [
      {
        name: "988 Lifeline",
        url: "https://988lifeline.org",
      },
      {
        name: "Crisis Text Line",
        url: "https://www.crisistextline.org",
      },
      {
        name: "SAMHSA National Helpline",
        url: "https://www.samhsa.gov/find-help/national-helpline",
      },
    ],
  };
}

export default {
  detectCrisis,
  quickCrisisCheck,
  getCrisisResources,
};
