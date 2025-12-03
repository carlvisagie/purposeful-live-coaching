// ============================================================================
// PURPOSEFULLIVECOACHING.COM — SAFETY GUARDRAILS
// Production-Ready. No placeholders. Strictly Wellness Coaching.
// ============================================================================

/**
 * Core Principles:
 * - AI Coaches NEVER provide therapy, diagnosis, medical, legal, financial, or crisis counseling.
 * - AI Coaches operate strictly within "wellness coaching," mindset, discipline, lifestyle support.
 * - AI Coaches prevent emotional dependency and maintain boundaries at all times.
 * - AI Coaches follow trauma-informed principles without acting as clinicians.
 */

export const SAFETY = {
  // ------------------------------------------------------------
  // 1. BLOCKED DOMAINS (Hard Red Lines)
  // ------------------------------------------------------------
  forbiddenDomains: [
    "medical diagnosis",
    "medical treatment advice",
    "psychiatric advice",
    "psychotherapy",
    "counseling",
    "suicide advice",
    "self-harm instructions",
    "legal advice",
    "financial fiduciary advice",
    "real-time crisis intervention",
    "relationship matchmaking",
    "sexual content",
    "addiction treatment",
    "trauma processing",
    "past life regression",
    "professional therapy",
    "drug dosage",
    "child discipline methods",
    "marriage counseling",
    "violence",
    "hate speech",
    "criminal activity",
    "weapons construction",
  ],

  // ------------------------------------------------------------
  // 2. BLOCKED WORDS & PHRASES
  // (Hard filter before LLM receives the prompt)
  // ------------------------------------------------------------
  forbiddenPhrases: [
    "kill myself",
    "kill yourself",
    "end my life",
    "suicide",
    "how to hurt myself",
    "I'm worthless",
    "I want to die",
    "no reason to live",
    "better off dead",
    "diagnose me",
    "what is my mental disorder",
    "should I leave my wife",
    "how to punish my child",
    "how to get revenge",
    "give me legal advice",
    "give me medical advice",
    "what dose should I take",
    "how to manipulate someone",
    "how to brainwash someone",
  ],

  // ------------------------------------------------------------
  // 3. ETHICAL COACHING BOUNDARIES
  // ------------------------------------------------------------
  coachingRules: [
    "The AI Coach must maintain strict emotional boundaries.",
    "The AI Coach must NEVER imply romantic, sexual, or intimate connection.",
    "The AI Coach must avoid creating dependency or acting as a savior.",
    "The AI Coach must always empower the user's autonomy.",
    "The AI Coach must never make promises of outcomes.",
    "The AI Coach must always remind users that it is NOT a therapist.",
    "The AI Coach must redirect medical or psychological concerns to professionals.",
    "The AI Coach may provide grounding, mindfulness, and stabilizing tools — NOT therapy.",
    "The AI Coach must respect user privacy and avoid asking for unnecessary personal details.",
    "The AI Coach must avoid any coercive influence.",
  ],

  // ------------------------------------------------------------
  // 4. CRISIS SIGNAL DETECTION (Lightweight for MVP)
  // ------------------------------------------------------------
  crisisIndicators: [
    // Emotional collapse
    "I can't take it anymore",
    "I can't keep going",
    "I'm losing control",
    "I'm scared of myself",

    // Isolation / despair
    "nobody cares",
    "I'm alone",
    "I'm done",

    // Harm intent
    "hurt myself",
    "end it all",
    "I won't be here tomorrow",
  ],

  // ------------------------------------------------------------
  // 5. SAFE RESPONSE TEMPLATES
  // ------------------------------------------------------------
  safeRedirect: {
    medical:
      "I can help with wellness strategies, but I can't give medical guidance. You should reach out to a qualified medical professional for this.",
    psychological:
      "I can support with general wellness and emotional stability, but I can't provide therapy or diagnose mental health conditions.",
    crisis:
      "I'm not equipped to help with crisis situations. Please contact local emergency services or a crisis hotline immediately: Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).",
    legal:
      "I can help with mindset and strategy, but I can't provide legal advice. A licensed attorney is the right person for this.",
    sexual: "I can't discuss sexual content. Let's refocus on your goals, wellness, and personal growth.",
  },
};

// ============================================================================
//  SAFETY EVALUATION ENGINE
// ============================================================================

export interface SafetyEvaluation {
  safe: boolean;
  type?: "hard-block" | "crisis" | "restricted-domain";
  category?: string;
  redirect?: boolean;
  output?: string;
}

export function evaluateSafety(userMessage: string): SafetyEvaluation {
  const lower = userMessage.toLowerCase();

  // 1. Forbidden phrases (hard block)
  for (const phrase of SAFETY.forbiddenPhrases) {
    if (lower.includes(phrase)) {
      return { safe: false, type: "hard-block", category: "forbiddenPhrase" };
    }
  }

  // 2. Crisis indicators
  for (const signal of SAFETY.crisisIndicators) {
    if (lower.includes(signal)) {
      return { safe: false, type: "crisis", category: "crisis" };
    }
  }

  // 3. Domain safety
  for (const domain of SAFETY.forbiddenDomains) {
    if (lower.includes(domain)) {
      return { safe: false, type: "restricted-domain", category: domain };
    }
  }

  // Otherwise OK
  return { safe: true };
}

// ============================================================================
//  SAFETY ROUTER — WHAT THE AI COACH SHOULD DO WHEN SAFETY FAILS
// ============================================================================

export function routeSafety(evaluation: SafetyEvaluation): { redirect: boolean; output?: string } {
  if (evaluation.type === "crisis") {
    return {
      redirect: true,
      output: SAFETY.safeRedirect.crisis,
    };
  }

  if (evaluation.type === "hard-block") {
    return {
      redirect: true,
      output: SAFETY.safeRedirect.psychological,
    };
  }

  if (evaluation.type === "restricted-domain" && evaluation.category) {
    if (evaluation.category.includes("legal")) {
      return { redirect: true, output: SAFETY.safeRedirect.legal };
    }
    if (evaluation.category.includes("medical")) {
      return { redirect: true, output: SAFETY.safeRedirect.medical };
    }
    if (evaluation.category.includes("psychiatr")) {
      return { redirect: true, output: SAFETY.safeRedirect.psychological };
    }
    if (evaluation.category.includes("sexual")) {
      return { redirect: true, output: SAFETY.safeRedirect.sexual };
    }

    // default fallback
    return {
      redirect: true,
      output: SAFETY.safeRedirect.psychological,
    };
  }

  return { redirect: false };
}

// ============================================================================
//  MAIN EXPORTED SAFETY CHECK
//  (Call this BEFORE sending prompt to the AI Coach)
// ============================================================================

export function safetyCheck(userMessage: string): SafetyEvaluation & { redirect: boolean; output?: string } {
  const evalResult = evaluateSafety(userMessage);
  const route = routeSafety(evalResult);

  return {
    safe: evalResult.safe,
    type: evalResult.type,
    category: evalResult.category,
    ...route,
  };
}

// ============================================================================
//  COACH GUIDANCE SYSTEM PROMPT
//  (For AI Assistant helping coaches during live sessions)
// ============================================================================

export const COACH_ASSISTANT_SYSTEM_PROMPT = `You are an AI Assistant helping professional wellness coaches (Carl and his wife) during live coaching sessions.

**YOUR ROLE:**
- Listen to the conversation between the coach and client
- Provide real-time guidance ONLY to the coach (via headset - client cannot hear you)
- Suggest questions, techniques, and interventions
- Alert the coach if they're approaching prohibited territory
- Reference similar client situations and what worked
- Keep suggestions brief, actionable, and immediate

**STRICT BOUNDARIES:**
You must ensure the COACH stays within wellness coaching boundaries:
${SAFETY.coachingRules.map((rule) => `- ${rule}`).join("\n")}

**PROHIBITED DOMAINS:**
Alert the coach immediately if the conversation enters:
${SAFETY.forbiddenDomains.map((domain) => `- ${domain}`).join("\n")}

**YOUR GUIDANCE FORMAT:**
- **Suggest**: "Ask about their morning routine"
- **Alert**: "⚠️ Approaching medical advice - redirect to wellness strategies"
- **Reference**: "Similar client: Used habit stacking, saw 40% improvement"
- **Technique**: "Try: Socratic questioning to help them discover their own answer"

**CRISIS DETECTION:**
If you detect crisis indicators, immediately alert the coach:
"🚨 CRISIS SIGNAL: Client mentioned [indicator]. Recommend: Acknowledge concern, provide crisis resources (988), consider escalation."

Remember: You're the coach's secret weapon. Keep them safe, effective, and compliant.`;

// ============================================================================
//  END OF FILE
// ============================================================================
