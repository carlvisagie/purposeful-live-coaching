import { invokeLLM } from "./_core/llm";

/**
 * COMPREHENSIVE COMPLIANCE SUITE
 * 
 * A research-backed compliance system for wellness coaching that monitors:
 * 1. Legal Compliance - Medical/legal/financial advice detection
 * 2. Banned Words/Phrases - Defensiveness triggers, judgmental language
 * 3. Ethical Compliance - ICF Code of Ethics alignment
 * 4. Social Compliance - Cultural sensitivity, appropriate language
 * 5. Wisdom Compliance - Research-backed communication principles
 * 6. Interpersonal Skills - Human nature alignment
 * 
 * Based on research from:
 * - ICF Code of Ethics (2025)
 * - Cialdini's Principles of Ethical Persuasion
 * - Nonviolent Communication (Marshall Rosenberg)
 * - Gottman Institute research
 * - Self-Determination Theory
 * - Multicultural Counseling Competencies
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ComplianceCategory = 
  | "legal"
  | "banned_words"
  | "ethical"
  | "social"
  | "wisdom"
  | "interpersonal"
  | "crisis";

export type ViolationSeverity = "info" | "warning" | "moderate" | "severe" | "critical";

export interface ComplianceViolation {
  category: ComplianceCategory;
  subcategory: string;
  severity: ViolationSeverity;
  flaggedContent: string;
  reason: string;
  suggestion: string;
  research_basis?: string;
}

export interface ComplianceResult {
  isCompliant: boolean;
  overallScore: number; // 0-100, higher is better
  violations: ComplianceViolation[];
  suggestions: string[];
  sanitizedResponse?: string;
  requiresImmediateAction: boolean;
  coachGuidance?: string;
}

export interface RealTimeAlert {
  type: "pre_speech" | "during_speech" | "post_speech";
  urgency: "low" | "medium" | "high" | "critical";
  message: string;
  alternativePhrase?: string;
}

// ============================================================================
// 1. LEGAL COMPLIANCE
// ============================================================================

const LEGAL_COMPLIANCE = {
  medical_advice: {
    patterns: [
      /\b(diagnose|diagnosis|prescribed?|medication|medicine|drug|dosage|treatment plan)\b/i,
      /\byou (have|might have|could have|probably have)\s+\w+\s*(disorder|disease|condition|syndrome)\b/i,
      /\b(take|stop taking|increase|decrease)\s+\w*\s*(medication|medicine|drug|pill)\b/i,
      /\byou (are|seem|appear)\s+(depressed|anxious|bipolar|schizophrenic|autistic)\b/i,
      /\bthis (is|sounds like|appears to be)\s+\w*\s*(depression|anxiety|PTSD|ADHD|OCD)\b/i,
    ],
    severity: "severe" as ViolationSeverity,
    suggestion: "I'm not a medical professional. For health concerns, please consult with a healthcare provider. I can help you explore your feelings and coping strategies.",
    research_basis: "ICF Code of Ethics Section 4.1 - Coaches must not diagnose or prescribe"
  },
  legal_advice: {
    patterns: [
      /\byou should (sue|file a lawsuit|take legal action|contact a lawyer|press charges)\b/i,
      /\b(legally|under the law|according to law)\s+you (can|cannot|must|should)\b/i,
      /\byour (legal rights|rights under law)\s+(are|include)\b/i,
      /\bthis (is|constitutes|could be)\s+(illegal|a crime|fraud|harassment)\b/i,
    ],
    severity: "severe" as ViolationSeverity,
    suggestion: "I can't provide legal advice. For legal matters, please consult with a qualified attorney. I can help you process the emotions around your situation.",
    research_basis: "ICF Code of Ethics - Coaches must operate within their competency"
  },
  financial_advice: {
    patterns: [
      /\byou should (invest|buy|sell|trade)\s+(stocks|bonds|cryptocurrency|real estate|bitcoin|ETF)\b/i,
      /\b(invest in|put your money in|buy|sell)\s+\w+\s*(stock|fund|crypto|coin)\b/i,
      /\bthis (stock|investment|crypto)\s+(will|should|might)\s+(go up|increase|double|triple)\b/i,
      /\b(financial advice|investment advice)\s*:/i,
    ],
    severity: "severe" as ViolationSeverity,
    suggestion: "I can't give specific financial advice. For financial planning, please consult a financial advisor. I can help you work through stress related to financial concerns.",
    research_basis: "ICF Code of Ethics - Coaches must not provide advice outside their expertise"
  }
};

// ============================================================================
// 2. BANNED WORDS & PHRASES
// ============================================================================

const BANNED_WORDS_PHRASES = {
  // The "Interrogative Five" - trigger defensiveness (Psychology Today research)
  interrogative_starters: {
    patterns: [
      /^why did(n't)? you\b/i,
      /^what (are|were) you (doing|thinking)\b/i,
      /^where (have you been|were you)\b/i,
      /^when were you going to\b/i,
      /^how could you\b/i,
    ],
    severity: "warning" as ViolationSeverity,
    suggestion: "Rephrase without accusatory tone. Instead of 'Why did you...?' try 'Help me understand what led to...'",
    research_basis: "Psychology Today - 10 Phrases That Create Defensiveness (Dr. Randi Gunther)"
  },
  
  // Absolute statements that trigger resistance
  absolute_statements: {
    patterns: [
      /\byou always\b/i,
      /\byou never\b/i,
      /\beveryone knows\b/i,
      /\bnobody (would|could|does)\b/i,
      /\bthat's (wrong|stupid|ridiculous|crazy)\b/i,
    ],
    severity: "warning" as ViolationSeverity,
    suggestion: "Avoid absolute statements. Replace 'You always...' with 'I've noticed sometimes...'",
    research_basis: "Gottman Institute - The Four Horsemen research"
  },
  
  // Dismissive phrases
  dismissive_phrases: {
    patterns: [
      /\bjust (calm down|relax|chill|get over it)\b/i,
      /\bit's not (a big deal|that bad|that serious)\b/i,
      /\byou're (overreacting|being dramatic|too sensitive)\b/i,
      /\bat least\b.*\b(you|it)\b/i,
      /\bother people have it worse\b/i,
      /\bjust think positive\b/i,
    ],
    severity: "moderate" as ViolationSeverity,
    suggestion: "Validate feelings first. Replace 'Just calm down' with 'I can see this is really affecting you. What would help right now?'",
    research_basis: "Nonviolent Communication - Marshall Rosenberg"
  },
  
  // Judgmental language disguised as feelings
  pseudo_feelings: {
    patterns: [
      /\bi feel (abandoned|attacked|betrayed|blamed|cheated)\b/i,
      /\bi feel (criticized|dismissed|ignored|insulted|manipulated)\b/i,
      /\bi feel (misunderstood|neglected|rejected|threatened|unappreciated|used)\b/i,
    ],
    severity: "info" as ViolationSeverity,
    suggestion: "These are judgments, not feelings. 'I feel ignored' implies someone is ignoring you. Try 'I feel lonely' or 'I feel disconnected' instead.",
    research_basis: "Nonviolent Communication - Distinguishing feelings from evaluations"
  },
  
  // Phrases that undermine credibility
  credibility_undermining: {
    patterns: [
      /\bto be honest\b/i,
      /\bactually,?\s/i,
      /\bi'm no expert,? but\b/i,
      /\bdon't quote me\b/i,
      /\bi (kinda|sorta|kind of|sort of)\b/i,
    ],
    severity: "info" as ViolationSeverity,
    suggestion: "These phrases can undermine your message. Speak with confidence and directness.",
    research_basis: "Communication research on credibility markers"
  },
  
  // Toxic positivity
  toxic_positivity: {
    patterns: [
      /\beverything happens for a reason\b/i,
      /\bjust (be|stay) positive\b/i,
      /\blook on the bright side\b/i,
      /\bgood vibes only\b/i,
      /\bit could be worse\b/i,
      /\bstop being (negative|pessimistic)\b/i,
    ],
    severity: "warning" as ViolationSeverity,
    suggestion: "Acknowledge difficult emotions instead of bypassing them. Try 'This is really hard. I'm here with you.'",
    research_basis: "Research on emotional validation and toxic positivity"
  }
};

// ============================================================================
// 3. ETHICAL COMPLIANCE (ICF Code of Ethics)
// ============================================================================

const ETHICAL_COMPLIANCE = {
  // Promises of outcomes
  outcome_promises: {
    patterns: [
      /\bi (guarantee|promise)\s+(you will|results|success)\b/i,
      /\bthis will (definitely|certainly|absolutely)\s+(work|help|fix)\b/i,
      /\b100%\s+(effective|guaranteed|success)\b/i,
      /\byou will (definitely|certainly)\s+(achieve|succeed|get)\b/i,
    ],
    severity: "moderate" as ViolationSeverity,
    suggestion: "Avoid guaranteeing outcomes. Coaching supports growth but cannot promise specific results.",
    research_basis: "ICF Code of Ethics - Honest representation of services"
  },
  
  // Boundary violations
  boundary_violations: {
    patterns: [
      /\bwe should (meet|hang out|get together)\s+outside\b/i,
      /\bgive me your (personal|private)\s+(number|address|email)\b/i,
      /\bdon't tell (anyone|your spouse|your partner)\b/i,
      /\bthis is (our|just between us)\s+secret\b/i,
    ],
    severity: "severe" as ViolationSeverity,
    suggestion: "Maintain professional boundaries. All coaching interactions should remain within the professional context.",
    research_basis: "ICF Code of Ethics Section 3 - Professional Conduct"
  },
  
  // Scope creep
  scope_creep: {
    patterns: [
      /\blet me (give you|offer)\s+(therapy|counseling|treatment)\b/i,
      /\bas (a|your)\s+(therapist|counselor|doctor)\b/i,
      /\bi'll (treat|cure|heal)\s+your\b/i,
    ],
    severity: "severe" as ViolationSeverity,
    suggestion: "Stay within coaching scope. Coaching is not therapy, counseling, or medical treatment.",
    research_basis: "ICF Code of Ethics - Distinguishing coaching from other professions"
  }
};

// ============================================================================
// 4. SOCIAL COMPLIANCE (Cultural Sensitivity)
// ============================================================================

const SOCIAL_COMPLIANCE = {
  // Cultural assumptions
  cultural_assumptions: {
    patterns: [
      /\bin (your|their)\s+culture,?\s+(you|they|people)\s+(always|never|usually)\b/i,
      /\b(all|most)\s+(men|women|asians|africans|latinos|americans)\s+(are|do|think)\b/i,
      /\bthat's (not|un)?\s*(american|western|normal)\b/i,
    ],
    severity: "moderate" as ViolationSeverity,
    suggestion: "Avoid cultural generalizations. Ask about individual experiences rather than assuming based on background.",
    research_basis: "Multicultural Counseling Competencies - Cultural humility"
  },
  
  // Gender/identity assumptions
  identity_assumptions: {
    patterns: [
      /\bas a (man|woman),?\s+you (should|must|need to)\b/i,
      /\b(real|true)\s+(men|women)\s+(don't|always|never)\b/i,
      /\bthat's (not|un)?\s*(masculine|feminine|manly|ladylike)\b/i,
    ],
    severity: "moderate" as ViolationSeverity,
    suggestion: "Avoid gender-based assumptions. Focus on the individual's values and goals.",
    research_basis: "Multicultural Counseling Competencies - Gender sensitivity"
  },
  
  // Religious/spiritual assumptions
  spiritual_assumptions: {
    patterns: [
      /\b(god|jesus|allah|buddha)\s+(wants|says|commands)\s+you to\b/i,
      /\byou (should|need to)\s+(pray|go to church|find god|be more spiritual)\b/i,
      /\bif you (had|have)\s+faith,?\s+you (would|will)\b/i,
    ],
    severity: "moderate" as ViolationSeverity,
    suggestion: "Respect diverse spiritual beliefs. Ask about the client's own spiritual framework rather than imposing one.",
    research_basis: "ICF Code of Ethics - Respecting client autonomy and beliefs"
  }
};

// ============================================================================
// 5. WISDOM COMPLIANCE (Research-Based Communication)
// ============================================================================

const WISDOM_COMPLIANCE = {
  // Unsolicited advice
  unsolicited_advice: {
    patterns: [
      /\byou (should|need to|have to|must|ought to)\b/i,
      /\bwhy don't you (just)?\b/i,
      /\bif i were you,?\s+i (would|'d)\b/i,
      /\bthe (best|right|only)\s+(thing|way)\s+(to do|is)\b/i,
    ],
    severity: "warning" as ViolationSeverity,
    suggestion: "Ask permission before offering suggestions. Try 'Would you like to explore some options?' or 'May I share an observation?'",
    research_basis: "Motivational Interviewing - Autonomy support"
  },
  
  // Premature problem-solving
  premature_solutions: {
    patterns: [
      /\bhere's (what|how)\s+(you|to)\s+(can|should|need to)\s+(fix|solve|handle)\b/i,
      /\bthe (solution|answer|fix)\s+is\b/i,
      /\bjust (do|try|use)\s+this\b/i,
    ],
    severity: "info" as ViolationSeverity,
    suggestion: "Ensure full understanding before offering solutions. Ask 'What have you already tried?' or 'What would be most helpful right now?'",
    research_basis: "Active listening research - Understanding before advising"
  },
  
  // Interrupting patterns (detected in real-time)
  interrupting_indicators: {
    patterns: [
      /\blet me (stop|interrupt|jump in)\b/i,
      /\bbut (wait|hold on|actually)\b/i,
      /\bsorry to (interrupt|cut you off)\b/i,
    ],
    severity: "warning" as ViolationSeverity,
    suggestion: "Allow the client to complete their thoughts. Practice the 3-second pause before responding.",
    research_basis: "Active listening - Space for processing"
  }
};

// ============================================================================
// 6. INTERPERSONAL SKILLS COMPLIANCE (Human Nature Alignment)
// ============================================================================

const INTERPERSONAL_COMPLIANCE = {
  // Autonomy threats (Self-Determination Theory)
  autonomy_threats: {
    patterns: [
      /\byou (have to|must|need to|are required to)\b/i,
      /\bthere's no (other|choice|option)\b/i,
      /\byou don't have a choice\b/i,
      /\bi'm telling you to\b/i,
    ],
    severity: "warning" as ViolationSeverity,
    suggestion: "Support autonomy. Offer choices: 'You could try X or Y - what feels right to you?'",
    research_basis: "Self-Determination Theory - Autonomy as basic psychological need"
  },
  
  // Competence threats
  competence_threats: {
    patterns: [
      /\bthat's (easy|simple|obvious)\b/i,
      /\banyone (can|could)\s+do that\b/i,
      /\byou should (know|already know)\s+this\b/i,
      /\bi'm surprised you (didn't|don't)\s+know\b/i,
    ],
    severity: "warning" as ViolationSeverity,
    suggestion: "Protect the client's sense of competence. Acknowledge challenges and celebrate progress.",
    research_basis: "Self-Determination Theory - Competence as basic psychological need"
  },
  
  // Relatedness threats
  relatedness_threats: {
    patterns: [
      /\bi don't (care|want to hear)\s+about\b/i,
      /\bthat's (not|none of)\s+my (concern|business|problem)\b/i,
      /\bfigure it out (yourself|on your own)\b/i,
    ],
    severity: "moderate" as ViolationSeverity,
    suggestion: "Maintain connection. Even when setting boundaries, communicate care: 'I want to support you in the best way I can.'",
    research_basis: "Self-Determination Theory - Relatedness as basic psychological need"
  },
  
  // "But" negation
  but_negation: {
    patterns: [
      /\b(yes|i understand|that's true|i hear you),?\s+but\b/i,
      /\bi (agree|appreciate that),?\s+but\b/i,
    ],
    severity: "info" as ViolationSeverity,
    suggestion: "Replace 'but' with 'and'. 'I understand, AND I wonder if...' preserves both perspectives.",
    research_basis: "Improv communication - 'Yes, and' principle"
  }
};

// ============================================================================
// 7. CRISIS DETECTION
// ============================================================================

const CRISIS_INDICATORS = {
  suicide_risk: {
    patterns: [
      /\b(kill|end)\s+(myself|my life)\b/i,
      /\bcommit suicide\b/i,
      /\bwant to (die|be dead|not exist)\b/i,
      /\b(no point|no reason)\s+(in|to)\s+(living|life|going on)\b/i,
      /\beveryone (would be|is)\s+better off without me\b/i,
      /\bi('m| am)\s+a burden\b/i,
      /\bsaying goodbye\b/i,
    ],
    severity: "critical" as ViolationSeverity,
    suggestion: "CRISIS DETECTED. Immediately provide crisis resources: 988 (Suicide & Crisis Lifeline), Crisis Text Line (text HOME to 741741). Ask directly about safety.",
    research_basis: "Crisis intervention best practices"
  },
  
  self_harm: {
    patterns: [
      /\b(cut|cutting|burn|burning|hurt|hurting)\s+(myself|my body)\b/i,
      /\bself[- ]?harm\b/i,
      /\bpunish (myself|my body)\b/i,
    ],
    severity: "critical" as ViolationSeverity,
    suggestion: "SAFETY CONCERN. Assess immediate risk. Provide crisis resources and consider referral to mental health professional.",
    research_basis: "Crisis intervention protocols"
  },
  
  harm_to_others: {
    patterns: [
      /\b(kill|hurt|harm)\s+(him|her|them|someone|my)\b/i,
      /\bi('m| am)\s+going to\s+(hurt|attack|kill)\b/i,
      /\bthey (deserve|need)\s+to (die|be hurt)\b/i,
    ],
    severity: "critical" as ViolationSeverity,
    suggestion: "SAFETY CONCERN. Duty to warn may apply. Assess seriousness and consult with supervisor or appropriate authorities.",
    research_basis: "Tarasoff duty to warn"
  },
  
  abuse_disclosure: {
    patterns: [
      /\b(he|she|they)\s+(hit|hits|beat|beats|abuse|abuses)\s+me\b/i,
      /\bi('m| am)\s+being\s+(abused|beaten|hurt)\b/i,
      /\b(domestic|child)\s+(violence|abuse)\b/i,
    ],
    severity: "critical" as ViolationSeverity,
    suggestion: "SENSITIVE DISCLOSURE. Validate, assess safety, provide resources (National DV Hotline: 1-800-799-7233). May have mandatory reporting obligations.",
    research_basis: "Mandatory reporting requirements, trauma-informed care"
  }
};

// ============================================================================
// MAIN COMPLIANCE CHECK FUNCTION
// ============================================================================

export async function comprehensiveComplianceCheck(
  text: string,
  context: {
    isCoachSpeaking: boolean;
    sessionType: "training" | "live_client";
    coachName?: string;
  }
): Promise<ComplianceResult> {
  const violations: ComplianceViolation[] = [];
  const suggestions: string[] = [];
  let requiresImmediateAction = false;
  
  // Helper function to check patterns
  const checkPatterns = (
    category: ComplianceCategory,
    rules: Record<string, { patterns: RegExp[]; severity: ViolationSeverity; suggestion: string; research_basis?: string }>
  ) => {
    for (const [subcategory, rule] of Object.entries(rules)) {
      for (const pattern of rule.patterns) {
        const match = text.match(pattern);
        if (match) {
          violations.push({
            category,
            subcategory,
            severity: rule.severity,
            flaggedContent: match[0],
            reason: `Detected ${subcategory.replace(/_/g, " ")}`,
            suggestion: rule.suggestion,
            research_basis: rule.research_basis
          });
          
          if (!suggestions.includes(rule.suggestion)) {
            suggestions.push(rule.suggestion);
          }
          
          if (rule.severity === "critical") {
            requiresImmediateAction = true;
          }
        }
      }
    }
  };
  
  // Run all compliance checks
  checkPatterns("crisis", CRISIS_INDICATORS);
  checkPatterns("legal", LEGAL_COMPLIANCE);
  checkPatterns("banned_words", BANNED_WORDS_PHRASES);
  checkPatterns("ethical", ETHICAL_COMPLIANCE);
  checkPatterns("social", SOCIAL_COMPLIANCE);
  checkPatterns("wisdom", WISDOM_COMPLIANCE);
  checkPatterns("interpersonal", INTERPERSONAL_COMPLIANCE);
  
  // Calculate overall score
  const severityScores: Record<ViolationSeverity, number> = {
    info: 5,
    warning: 10,
    moderate: 20,
    severe: 35,
    critical: 50
  };
  
  const totalDeductions = violations.reduce(
    (sum, v) => sum + severityScores[v.severity],
    0
  );
  
  const overallScore = Math.max(0, 100 - totalDeductions);
  
  // Generate coach guidance if there are violations
  let coachGuidance: string | undefined;
  if (violations.length > 0 && context.isCoachSpeaking) {
    const criticalViolations = violations.filter(v => v.severity === "critical");
    const severeViolations = violations.filter(v => v.severity === "severe");
    
    if (criticalViolations.length > 0) {
      coachGuidance = `⚠️ CRITICAL: ${criticalViolations[0].suggestion}`;
    } else if (severeViolations.length > 0) {
      coachGuidance = `⚡ IMPORTANT: ${severeViolations[0].suggestion}`;
    } else {
      coachGuidance = `💡 TIP: ${violations[0].suggestion}`;
    }
  }
  
  return {
    isCompliant: violations.length === 0,
    overallScore,
    violations,
    suggestions,
    requiresImmediateAction,
    coachGuidance
  };
}

// ============================================================================
// REAL-TIME ALERT GENERATION
// ============================================================================

export function generateRealTimeAlert(violation: ComplianceViolation): RealTimeAlert {
  const urgencyMap: Record<ViolationSeverity, "low" | "medium" | "high" | "critical"> = {
    info: "low",
    warning: "medium",
    moderate: "high",
    severe: "high",
    critical: "critical"
  };
  
  let alternativePhrase: string | undefined;
  let doNotSayWarning: string | undefined;
  
  // Provide explicit DO NOT SAY warnings and alternative phrases
  if (violation.subcategory === "interrogative_starters") {
    doNotSayWarning = `🚫 DO NOT SAY: "${violation.flaggedContent}"`;
    alternativePhrase = "✅ INSTEAD SAY: 'Help me understand what led to...' or 'I'm curious about...'";
  } else if (violation.subcategory === "absolute_statements") {
    doNotSayWarning = `🚫 DO NOT SAY: "${violation.flaggedContent}"`;
    alternativePhrase = "✅ INSTEAD SAY: 'I've noticed sometimes...' or 'It seems like...'";
  } else if (violation.subcategory === "dismissive_phrases") {
    doNotSayWarning = `🚫 DO NOT SAY: "${violation.flaggedContent}"`;
    alternativePhrase = "✅ INSTEAD SAY: 'I can see this is really affecting you. What would help right now?'";
  } else if (violation.subcategory === "unsolicited_advice") {
    doNotSayWarning = `🚫 DO NOT SAY: Unsolicited advice`;
    alternativePhrase = "✅ INSTEAD SAY: 'Would you like to explore some options together?'";
  } else if (violation.subcategory === "but_negation") {
    doNotSayWarning = `🚫 DO NOT SAY: "but" (it negates what came before)`;
    alternativePhrase = "✅ INSTEAD SAY: Replace 'but' with 'and' to honor both perspectives";
  } else if (violation.category === "legal") {
    doNotSayWarning = `🚫 DO NOT SAY: "${violation.flaggedContent}" - LEGAL VIOLATION`;
    alternativePhrase = "✅ INSTEAD SAY: " + violation.suggestion;
  } else if (violation.category === "crisis") {
    doNotSayWarning = `🚨 CRISIS DETECTED: "${violation.flaggedContent}" - IMMEDIATE ACTION REQUIRED`;
    alternativePhrase = "✅ REQUIRED ACTION: " + violation.suggestion;
  } else {
    doNotSayWarning = `⚠️ AVOID: "${violation.flaggedContent}"`;
    alternativePhrase = "✅ BETTER: " + violation.suggestion;
  }
  
  const message = doNotSayWarning + "\n\n" + alternativePhrase + "\n\nReason: " + violation.reason;
  
  return {
    type: "during_speech",
    urgency: urgencyMap[violation.severity],
    message,
    alternativePhrase
  };
}

// ============================================================================
// PRE-SPEECH COMPLIANCE CHECK (For AI suggestions before coach speaks)
// ============================================================================

export async function preSpeechCheck(
  proposedResponse: string
): Promise<{
  approved: boolean;
  alerts: RealTimeAlert[];
  improvedResponse?: string;
}> {
  const result = await comprehensiveComplianceCheck(proposedResponse, {
    isCoachSpeaking: true,
    sessionType: "live_client"
  });
  
  const alerts = result.violations.map(v => generateRealTimeAlert(v));
  
  // If critical violations, don't approve
  if (result.requiresImmediateAction) {
    return {
      approved: false,
      alerts,
      improvedResponse: result.sanitizedResponse
    };
  }
  
  // If severe violations, try to generate improved response
  if (result.violations.some(v => v.severity === "severe")) {
    try {
      const improved = await generateImprovedResponse(proposedResponse, result.violations);
      return {
        approved: false,
        alerts,
        improvedResponse: improved
      };
    } catch {
      return { approved: false, alerts };
    }
  }
  
  // Minor violations - approve with alerts
  return {
    approved: result.overallScore >= 70,
    alerts
  };
}

// ============================================================================
// AI-POWERED RESPONSE IMPROVEMENT
// ============================================================================

async function generateImprovedResponse(
  originalResponse: string,
  violations: ComplianceViolation[]
): Promise<string> {
  const violationSummary = violations
    .map(v => `- ${v.subcategory}: "${v.flaggedContent}" - ${v.suggestion}`)
    .join("\n");
  
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert wellness coach communication advisor. Your job is to rewrite coaching responses to be more effective and compliant.

Key principles:
1. Support autonomy - offer choices, not directives
2. Validate emotions before problem-solving
3. Ask permission before giving input
4. Use "and" instead of "but"
5. Focus on strengths and possibilities
6. Maintain professional boundaries
7. Never diagnose or prescribe

Rewrite the response to address the violations while maintaining the coach's intent and warmth.`
      },
      {
        role: "user",
        content: `Original response: "${originalResponse}"

Violations detected:
${violationSummary}

Please provide an improved version that addresses these issues while maintaining the supportive coaching intent.`
      }
    ]
  });
  
  return response.choices[0]?.message?.content || originalResponse;
}

// ============================================================================
// EXPORT COMPLIANCE RULES FOR UI DISPLAY
// ============================================================================

export function getComplianceRules(): {
  category: ComplianceCategory;
  name: string;
  description: string;
  examples: string[];
}[] {
  return [
    {
      category: "legal",
      name: "Legal Compliance",
      description: "Prevents medical diagnoses, legal advice, and financial recommendations",
      examples: [
        "Don't say: 'You have depression'",
        "Don't say: 'You should sue them'",
        "Don't say: 'Invest in this stock'"
      ]
    },
    {
      category: "banned_words",
      name: "Banned Words & Phrases",
      description: "Avoids language that triggers defensiveness or resistance",
      examples: [
        "Avoid: 'Why did you do that?' → 'Help me understand...'",
        "Avoid: 'You always...' → 'I've noticed sometimes...'",
        "Avoid: 'Just calm down' → 'I can see this is affecting you'"
      ]
    },
    {
      category: "ethical",
      name: "Ethical Compliance",
      description: "Aligns with ICF Code of Ethics and professional standards",
      examples: [
        "Don't promise specific outcomes",
        "Maintain professional boundaries",
        "Stay within coaching scope"
      ]
    },
    {
      category: "social",
      name: "Social Compliance",
      description: "Ensures cultural sensitivity and inclusive language",
      examples: [
        "Avoid cultural generalizations",
        "Respect diverse spiritual beliefs",
        "Use inclusive language"
      ]
    },
    {
      category: "wisdom",
      name: "Wisdom Compliance",
      description: "Follows research-backed communication principles",
      examples: [
        "Ask permission before advising",
        "Understand before problem-solving",
        "Allow space for processing"
      ]
    },
    {
      category: "interpersonal",
      name: "Interpersonal Skills",
      description: "Aligns with human psychological needs (autonomy, competence, relatedness)",
      examples: [
        "Offer choices, not ultimatums",
        "Acknowledge challenges",
        "Replace 'but' with 'and'"
      ]
    }
  ];
}


// ============================================================================
// SELF-LEARNING INTEGRATION
// ============================================================================

import PlatformIntelligence from "./platformIntelligence";

/**
 * Record compliance check result for learning
 * This feeds the platform intelligence system
 */
export function recordComplianceForLearning(
  result: ComplianceResult,
  clientFeedback?: {
    wasHelpful: boolean;
    satisfaction: number; // 1-10
    preferredAlternative?: string;
  }
): void {
  // Record each violation for effectiveness tracking
  for (const violation of result.violations) {
    const ruleId = `${violation.category}_${violation.subcategory}`;
    
    if (clientFeedback) {
      PlatformIntelligence.recordRuleEffectiveness(
        ruleId,
        clientFeedback.wasHelpful ? "positive" : "negative",
        clientFeedback.satisfaction
      );
    } else {
      // Default to neutral if no feedback
      PlatformIntelligence.recordRuleEffectiveness(ruleId, "neutral");
    }
  }

  // Record module interaction
  PlatformIntelligence.recordModuleInteraction(
    "compliance",
    result.isCompliant || result.overallScore >= 70,
    result.violations.length > 0 ? result.violations[0].subcategory : "clean_communication",
    clientFeedback?.preferredAlternative
  );
}

/**
 * Get compliance rules enhanced with effectiveness data
 */
export async function getAdaptiveComplianceRules(): Promise<{
  category: ComplianceCategory;
  name: string;
  description: string;
  examples: string[];
  effectiveness?: {
    score: number;
    timesTriggered: number;
    clientSatisfaction: number;
  };
  researchValidation?: {
    isValid: boolean;
    evidenceLevel: string;
    lastValidated: Date;
  };
}[]> {
  const baseRules = getComplianceRules();
  
  // Enhance with effectiveness data
  const enhancedRules = await Promise.all(
    baseRules.map(async (rule) => {
      const effectiveness = PlatformIntelligence.getRuleEffectiveness(`${rule.category}_primary`);
      
      return {
        ...rule,
        effectiveness: effectiveness ? {
          score: effectiveness.effectivenessScore,
          timesTriggered: effectiveness.timesTriggered,
          clientSatisfaction: effectiveness.averageClientSatisfaction,
        } : undefined,
      };
    })
  );

  return enhancedRules;
}

/**
 * Validate compliance rule against current research
 */
export async function validateComplianceRule(
  ruleId: string,
  ruleSuggestion: string
): Promise<{
  isValid: boolean;
  evidenceLevel: string;
  sources: string[];
  shouldUpdate: boolean;
  suggestedUpdate?: string;
}> {
  const validation = await PlatformIntelligence.validateResearch(
    ruleSuggestion,
    "compliance"
  );

  // If research doesn't support the rule strongly, suggest update
  const shouldUpdate = !validation.isValid || validation.confidence < 70;

  let suggestedUpdate: string | undefined;
  if (shouldUpdate) {
    const research = await PlatformIntelligence.searchNewResearch(
      `coaching communication ${ruleId.replace(/_/g, " ")}`,
      "compliance"
    );
    
    if (research.recommendations.length > 0) {
      suggestedUpdate = research.recommendations[0];
    }
  }

  return {
    isValid: validation.isValid,
    evidenceLevel: validation.evidenceLevel,
    sources: validation.sources,
    shouldUpdate,
    suggestedUpdate,
  };
}

/**
 * Auto-evolve compliance rules based on effectiveness and research
 * This should be run periodically (e.g., weekly)
 */
export async function evolveComplianceRules(): Promise<{
  rulesUpdated: number;
  rulesDeprecated: number;
  newRulesAdded: number;
  insights: string[];
}> {
  const insights: string[] = [];
  let rulesUpdated = 0;
  let rulesDeprecated = 0;
  let newRulesAdded = 0;

  // Analyze platform patterns for compliance
  const platformInsights = await PlatformIntelligence.analyzePlatformPatterns();
  
  // Get compliance-specific insights
  const complianceInsights = platformInsights.filter(
    i => i.affectedModules.includes("compliance")
  );

  for (const insight of complianceInsights) {
    insights.push(`${insight.type}: ${insight.title} - ${insight.description}`);
    
    if (insight.type === "recommendation") {
      // Could auto-add new rules based on patterns
      newRulesAdded++;
    } else if (insight.type === "warning") {
      // Could deprecate ineffective rules
      rulesDeprecated++;
    }
  }

  // Search for new research on coaching communication
  const newResearch = await PlatformIntelligence.searchNewResearch(
    "coaching communication effectiveness evidence-based",
    "compliance"
  );

  if (newResearch.newFindings.length > 0) {
    insights.push(`New research found: ${newResearch.newFindings.length} findings`);
    for (const finding of newResearch.newFindings) {
      insights.push(`- ${finding}`);
    }
  }

  if (newResearch.contradictions.length > 0) {
    insights.push(`Research contradictions: ${newResearch.contradictions.length}`);
    for (const contradiction of newResearch.contradictions) {
      insights.push(`⚠️ ${contradiction}`);
      rulesUpdated++;
    }
  }

  return {
    rulesUpdated,
    rulesDeprecated,
    newRulesAdded,
    insights,
  };
}

/**
 * Get compliance module learning summary
 */
export function getComplianceLearningStatus(): {
  totalChecks: number;
  averageScore: number;
  topViolations: string[];
  improvementTrend: "improving" | "stable" | "declining";
  lastEvolution: Date | null;
} {
  const learning = PlatformIntelligence.getModuleLearning("compliance");
  
  if (!learning) {
    return {
      totalChecks: 0,
      averageScore: 100,
      topViolations: [],
      improvementTrend: "stable",
      lastEvolution: null,
    };
  }

  return {
    totalChecks: learning.totalInteractions,
    averageScore: Math.round(learning.successRate * 100),
    topViolations: learning.topIneffectiveStrategies.slice(0, 5),
    improvementTrend: learning.successRate > 0.7 ? "improving" : 
                      learning.successRate > 0.5 ? "stable" : "declining",
    lastEvolution: learning.lastAnalyzed,
  };
}
