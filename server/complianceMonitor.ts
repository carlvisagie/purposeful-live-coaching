import { invokeLLM } from "./_core/llm";

/**
 * Compliance Monitor - Prevents AI from giving prohibited advice
 * 
 * This system monitors every AI response for:
 * - Medical advice, diagnoses, or prescriptions
 * - Legal advice
 * - Financial advice (beyond general wellness)
 * - Harmful content
 * 
 * It flags violations and prevents them from being sent to the client.
 */

export interface ComplianceCheck {
  isCompliant: boolean;
  violations: ComplianceViolation[];
  sanitizedResponse?: string; // If we can fix it automatically
}

export interface ComplianceViolation {
  type: "medical_advice" | "diagnosis" | "prescription" | "legal_advice" | "financial_advice" | "harmful_content";
  severity: "low" | "medium" | "high" | "critical";
  flaggedContent: string;
  reason: string;
}

const PROHIBITED_PATTERNS = {
  medical_advice: [
    /\b(diagnose|diagnosis|prescribed?|medication|medicine|drug|dosage|treatment plan)\b/i,
    /\byou (have|might have|could have|probably have)\s+\w+\s+(disorder|disease|condition|syndrome)\b/i,
    /\b(take|stop taking|increase|decrease)\s+\w+\s+(medication|medicine|drug|pill)\b/i,
  ],
  diagnosis: [
    /\byou (have|are suffering from|show signs of)\s+\w+\s+(disorder|disease|condition|syndrome|depression|anxiety|ptsd|adhd|bipolar)\b/i,
    /\bthis (is|sounds like|appears to be)\s+\w+\s+(disorder|disease|condition)\b/i,
  ],
  prescription: [
    /\b(prescribe|recommend taking|should take|need to take)\s+\w+\s+(medication|medicine|drug|pill)\b/i,
    /\b(mg|milligrams|dosage|dose)\s+of\s+\w+/i,
  ],
  legal_advice: [
    /\byou should (sue|file a lawsuit|take legal action|contact a lawyer)\b/i,
    /\b(legally|under the law|according to law)\s+you (can|cannot|must|should)\b/i,
  ],
  financial_advice: [
    /\byou should (invest|buy|sell|trade)\s+(stocks|bonds|cryptocurrency|real estate)\b/i,
    /\b(invest in|put your money in|buy|sell)\s+\w+\s+(stock|fund|crypto)\b/i,
  ],
  harmful_content: [
    /\b(kill yourself|end your life|commit suicide|hurt yourself)\b/i,
    /\b(self-harm|cutting|burning yourself)\s+(is|can be|might be)\s+(good|helpful|effective)\b/i,
  ],
};

const SAFE_ALTERNATIVES = {
  medical_advice: "I'm not a medical professional, so I can't provide medical advice. However, I can help you explore your feelings and coping strategies. For medical concerns, please consult with a healthcare provider.",
  diagnosis: "I'm not qualified to diagnose conditions. What I can do is help you understand your emotions and develop healthy coping strategies. If you're concerned about your mental health, please speak with a licensed mental health professional.",
  prescription: "I can't recommend medications - that's something only a licensed healthcare provider can do. But I can help you explore non-medical coping strategies and emotional regulation techniques.",
  legal_advice: "I'm not able to provide legal advice. For legal matters, please consult with a qualified attorney. I can help you process the emotions around your situation though.",
  financial_advice: "I can't give specific financial advice, but I can help you work through the stress and emotions related to financial concerns. For financial planning, please consult a financial advisor.",
  harmful_content: "I'm very concerned about what you've shared. Your safety is the top priority. Please reach out to a crisis helpline immediately: Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line). I'm here to support you, but professional crisis intervention is essential right now.",
};

/**
 * Check if an AI response contains prohibited content
 */
export async function checkCompliance(aiResponse: string, userMessage: string): Promise<ComplianceCheck> {
  const violations: ComplianceViolation[] = [];

  // Pattern-based detection (fast, deterministic)
  for (const [type, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
    for (const pattern of patterns) {
      const match = aiResponse.match(pattern);
      if (match) {
        violations.push({
          type: type as any,
          severity: type === "harmful_content" ? "critical" : type === "diagnosis" || type === "prescription" ? "high" : "medium",
          flaggedContent: match[0],
          reason: `Detected ${type.replace(/_/g, " ")} in response`,
        });
      }
    }
  }

  // If we found violations, use AI to double-check and suggest safe alternative
  if (violations.length > 0) {
    try {
      const llmCheck = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a compliance checker for an AI coaching platform. Your job is to identify if the AI response contains:
- Medical advice, diagnoses, or prescriptions
- Legal advice
- Financial investment advice
- Harmful content

If violations are found, provide a safe alternative response that:
1. Acknowledges the user's concern
2. Redirects to appropriate professional help
3. Offers emotional support within coaching scope

Respond in JSON format:
{
  "hasViolations": boolean,
  "violationTypes": string[],
  "safeAlternative": string
}`,
          },
          {
            role: "user",
            content: `User message: "${userMessage}"\n\nAI response to check: "${aiResponse}"`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "compliance_check",
            strict: true,
            schema: {
              type: "object",
              properties: {
                hasViolations: { type: "boolean" },
                violationTypes: { type: "array", items: { type: "string" } },
                safeAlternative: { type: "string" },
              },
              required: ["hasViolations", "violationTypes", "safeAlternative"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = llmCheck.choices[0]?.message?.content;
      const contentString = typeof content === 'string' ? content : '{}';
      const result = JSON.parse(contentString);
      
      if (result.hasViolations && result.safeAlternative) {
        return {
          isCompliant: false,
          violations,
          sanitizedResponse: result.safeAlternative,
        };
      }
    } catch (error) {
      console.error("[Compliance] LLM check failed:", error);
      // Fall through to pattern-based result
    }
  }

  // If critical violations (harmful content), always replace with crisis resources
  const criticalViolation = violations.find(v => v.severity === "critical");
  if (criticalViolation) {
    return {
      isCompliant: false,
      violations,
      sanitizedResponse: SAFE_ALTERNATIVES.harmful_content,
    };
  }

  // If high severity violations, replace with safe alternative
  const highSeverityViolation = violations.find(v => v.severity === "high");
  if (highSeverityViolation) {
    return {
      isCompliant: false,
      violations,
      sanitizedResponse: SAFE_ALTERNATIVES[highSeverityViolation.type] || aiResponse,
    };
  }

  // Medium severity - flag for review but allow with warning
  if (violations.length > 0) {
    return {
      isCompliant: false,
      violations,
      // Don't sanitize medium severity - just flag for coach review
    };
  }

  return {
    isCompliant: true,
    violations: [],
  };
}

/**
 * Get safe alternative response for a violation type
 */
export function getSafeAlternative(violationType: string): string {
  return SAFE_ALTERNATIVES[violationType as keyof typeof SAFE_ALTERNATIVES] || 
    "I want to make sure I'm providing appropriate support. Let me connect you with the right professional resources for this concern.";
}
