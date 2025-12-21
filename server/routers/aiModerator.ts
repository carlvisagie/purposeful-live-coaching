/**
 * AI MODERATOR SERVICE - Comprehensive Community Content Protection
 * 
 * INTEGRATES WITH:
 * - ProfileGuard (user context)
 * - SelfLearning (continuous improvement)
 * - ComprehensiveCompliance (legal, ethical, social protection)
 * 
 * PROTECTION LAYERS:
 * 1. LEGAL - Medical/legal/financial advice detection
 * 2. CRISIS - Immediate escalation for safety concerns
 * 3. ETHICAL - ICF Code of Ethics alignment
 * 4. SOCIAL - Cultural sensitivity, appropriate language
 * 5. PLATFORM - Criticism and reputation protection
 * 6. PRIVACY - PII detection and redaction
 * 7. COMMUNITY - Toxicity and harassment prevention
 * 
 * SELF-LEARNING:
 * - Tracks moderation decisions and outcomes
 * - Learns from user reports (false positives/negatives)
 * - Adapts thresholds based on community culture
 */

import OpenAI from "openai";
import { getDb } from "../db";
import { communityModerationLog } from "../../drizzle/communitySchema";
import { comprehensiveComplianceCheck } from "../comprehensiveCompliance";
import { v4 as uuidv4 } from "uuid";

// Initialize OpenAI client
const openai = new OpenAI();

export interface ModerationResult {
  shouldHide: boolean;
  confidence: number; // 0-100
  toxicity: number; // 0-100
  sentiment: number; // 0-100 (0=very negative, 100=very positive)
  platformCriticism: boolean;
  reason: string;
  categories: string[];
  supportNeeded: boolean;
  suggestedAction: "approve" | "review" | "hide" | "escalate";
  // Compliance integration
  complianceScore: number;
  complianceViolations: string[];
  legalConcerns: boolean;
  crisisDetected: boolean;
  privacyConcerns: boolean;
  // User guidance
  userFeedback?: string; // Message to show user if content needs adjustment
  disclaimerNeeded?: string; // Disclaimer to add to post
}

// ============================================================================
// PLATFORM PROTECTION PATTERNS
// ============================================================================

const PLATFORM_CRITICISM_PATTERNS = [
  // Direct criticism
  /\b(this|the)\s+(app|platform|service|site|website)\s+(sucks|is terrible|is awful|is garbage|is trash|doesn't work|is broken)\b/i,
  /\bwaste of (money|time)\b/i,
  /\b(scam|ripoff|rip off|fraud|con)\b/i,
  /\bwant (a |my )?refund\b/i,
  /\bcancel(ing|ling)?\s+(my\s+)?(subscription|membership|account)\b/i,
  // Comparative criticism
  /\b(better|cheaper|superior)\s+(apps?|alternatives?|options?)\b/i,
  /\bswitching to\s+\w+/i,
  /\b(calm|headspace|betterhelp|talkspace)\s+is better\b/i,
  // Sage/AI criticism
  /\bsage\s+(is|sucks|doesn't|can't|won't)\b/i,
  /\b(the\s+)?ai\s+(is\s+)?(broken|useless|stupid|dumb|terrible)\b/i,
  // Staff criticism
  /\b(coach|coaches|carl|staff)\s+(is|are|sucks?|terrible)\b/i,
];

// ============================================================================
// PRIVACY/PII DETECTION PATTERNS
// ============================================================================

const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  ssn: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
  credit_card: /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g,
  address: /\b\d+\s+[\w\s]+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)\b/i,
  // Medical info
  medical_record: /\b(medical record|patient id|mrn|health record)\s*[:#]?\s*\w+/i,
  prescription: /\b(rx|prescription)\s*[:#]?\s*\d+/i,
};

// ============================================================================
// CRISIS INDICATORS (Immediate escalation)
// ============================================================================

const CRISIS_PATTERNS = [
  // Suicidal ideation
  /\b(want to|going to|thinking about|planning to)\s+(kill|end|hurt)\s+(myself|my life)\b/i,
  /\b(suicide|suicidal|end it all|no reason to live)\b/i,
  /\bdon't want to (live|be alive|exist|be here)\b/i,
  /\b(better off dead|better off without me)\b/i,
  // Self-harm
  /\b(cutting|burning|hurting)\s+(myself|my body)\b/i,
  /\bself[- ]?harm\b/i,
  // Harm to others
  /\b(want to|going to|planning to)\s+(kill|hurt|harm)\s+(someone|him|her|them|my)\b/i,
  /\b(homicidal|homicide)\b/i,
  // Abuse disclosure
  /\b(being|am|was)\s+(abused|molested|raped|assaulted)\b/i,
  /\b(he|she|they)\s+(hit|beat|hurt|abuse)\s+(me|us)\b/i,
];

// ============================================================================
// COMMUNITY TOXICITY PATTERNS
// ============================================================================

const TOXICITY_PATTERNS = {
  // Personal attacks
  personal_attacks: [
    /\byou('re| are)\s+(an?\s+)?(idiot|moron|stupid|dumb|loser|pathetic)\b/i,
    /\b(shut up|stfu|f\*?u\*?c\*?k\s+you|go to hell)\b/i,
    /\b(hate|despise)\s+you\b/i,
  ],
  // Harassment
  harassment: [
    /\b(kill yourself|kys|go die)\b/i,
    /\b(nobody|no one)\s+(likes|cares about|wants)\s+you\b/i,
    /\byou should(n't| not)\s+(be here|exist|be alive)\b/i,
  ],
  // Discrimination
  discrimination: [
    /\b(all|every)\s+(men|women|blacks|whites|asians|gays|trans)\s+(are|should)\b/i,
    /\b(f\*?a\*?g|n\*?i\*?g|r\*?e\*?t\*?a\*?r\*?d)\b/i,
  ],
  // Spam/promotion
  spam: [
    /\b(click here|buy now|limited time|act now|free money)\b/i,
    /\b(dm me|message me)\s+(for|about)\s+(deals|offers|business)\b/i,
    /\bhttp[s]?:\/\/(?!purposefullivecoaching)/i, // External links
  ],
};

// ============================================================================
// POSITIVE PATTERNS (Encourage these)
// ============================================================================

const POSITIVE_PATTERNS = [
  /\b(grateful|thankful|blessed|appreciat)\b/i,
  /\b(achieved|accomplished|succeeded|proud)\b/i,
  /\b(helped|supported|encouraged)\b/i,
  /\b(breakthrough|progress|milestone|growth)\b/i,
  /\b(you got this|believe in you|proud of you|here for you)\b/i,
  /\b(thank you|thanks|appreciate)\b/i,
  /\b(love this|amazing|wonderful|beautiful)\s+(community|group|support)\b/i,
];

// ============================================================================
// MAIN MODERATION FUNCTION
// ============================================================================

export async function moderateContent(
  content: string,
  userId: string,
  context?: {
    postType?: string;
    isReply?: boolean;
    authorHistory?: { warningCount: number; hiddenCount: number };
  }
): Promise<ModerationResult> {
  const contentLower = content.toLowerCase();
  const categories: string[] = [];
  let shouldHide = false;
  let suggestedAction: ModerationResult["suggestedAction"] = "approve";
  let reason = "";
  let userFeedback: string | undefined;
  let disclaimerNeeded: string | undefined;
  
  // ========================================================================
  // LAYER 1: CRISIS DETECTION (Highest priority - immediate escalation)
  // ========================================================================
  
  const hasCrisisLanguage = CRISIS_PATTERNS.some(pattern => pattern.test(content));
  
  if (hasCrisisLanguage) {
    await logModerationDecision({
      userId,
      action: "escalate",
      reason: "Crisis language detected - immediate escalation",
      content: content.substring(0, 200),
      aiConfidence: 100,
    });
    
    return {
      shouldHide: false, // Don't hide - but escalate to human
      confidence: 100,
      toxicity: 0,
      sentiment: 10,
      platformCriticism: false,
      reason: "Crisis language detected - escalating to support team",
      categories: ["crisis"],
      supportNeeded: true,
      suggestedAction: "escalate",
      complianceScore: 0,
      complianceViolations: ["crisis_language"],
      legalConcerns: false,
      crisisDetected: true,
      privacyConcerns: false,
      userFeedback: "We noticed you might be going through a difficult time. If you're in crisis, please call 988 (Suicide & Crisis Lifeline) or text HOME to 741741. We care about you. 💙",
    };
  }
  
  // ========================================================================
  // LAYER 2: COMPREHENSIVE COMPLIANCE CHECK
  // ========================================================================
  
  const complianceResult = await comprehensiveComplianceCheck(content, {
    isCoachSpeaking: false, // This is user-generated content
    sessionType: "live_client",
  });
  
  const complianceViolations = complianceResult.violations.map(v => v.subcategory);
  const legalConcerns = complianceResult.violations.some(v => v.category === "legal");
  
  // If severe legal violations, add disclaimer
  if (legalConcerns) {
    categories.push("legal_concern");
    disclaimerNeeded = "⚠️ This post may contain content outside the scope of peer support. For medical, legal, or financial advice, please consult a qualified professional.";
  }
  
  // ========================================================================
  // LAYER 3: PRIVACY/PII DETECTION
  // ========================================================================
  
  let privacyConcerns = false;
  const piiFound: string[] = [];
  
  for (const [piiType, pattern] of Object.entries(PII_PATTERNS)) {
    if (pattern.test(content)) {
      privacyConcerns = true;
      piiFound.push(piiType);
    }
  }
  
  if (privacyConcerns) {
    categories.push("privacy_concern");
    suggestedAction = "review";
    userFeedback = "Your post may contain personal information (like email, phone, or address). For your safety, consider removing this before sharing.";
  }
  
  // ========================================================================
  // LAYER 4: PLATFORM CRITICISM DETECTION
  // ========================================================================
  
  const hasPlatformCriticism = PLATFORM_CRITICISM_PATTERNS.some(pattern => 
    pattern.test(content)
  );
  
  if (hasPlatformCriticism) {
    categories.push("platform_criticism");
    suggestedAction = "review"; // Don't auto-hide, but flag for owner review
    reason = "Platform criticism detected - flagged for review";
  }
  
  // ========================================================================
  // LAYER 5: TOXICITY DETECTION
  // ========================================================================
  
  let toxicityScore = 0;
  
  for (const [toxicType, patterns] of Object.entries(TOXICITY_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        categories.push(toxicType);
        
        switch (toxicType) {
          case "personal_attacks":
            toxicityScore += 40;
            break;
          case "harassment":
            toxicityScore += 80;
            shouldHide = true;
            suggestedAction = "hide";
            break;
          case "discrimination":
            toxicityScore += 70;
            shouldHide = true;
            suggestedAction = "hide";
            break;
          case "spam":
            toxicityScore += 50;
            shouldHide = true;
            suggestedAction = "hide";
            break;
        }
      }
    }
  }
  
  toxicityScore = Math.min(100, toxicityScore);
  
  // ========================================================================
  // LAYER 6: SENTIMENT ANALYSIS
  // ========================================================================
  
  const positiveCount = POSITIVE_PATTERNS.filter(p => p.test(content)).length;
  let sentimentScore = 50 + (positiveCount * 10) - (toxicityScore / 2);
  sentimentScore = Math.max(0, Math.min(100, sentimentScore));
  
  // ========================================================================
  // LAYER 7: AI ANALYSIS (For nuanced cases)
  // ========================================================================
  
  // Only use AI for borderline cases to save costs
  if (!shouldHide && (toxicityScore > 20 || hasPlatformCriticism || complianceResult.violations.length > 0)) {
    try {
      const aiAnalysis = await analyzeWithAI(content, {
        hasPlatformCriticism,
        toxicityScore,
        complianceViolations,
        postType: context?.postType,
      });
      
      // Adjust scores based on AI analysis
      toxicityScore = Math.round((toxicityScore + aiAnalysis.toxicity) / 2);
      sentimentScore = Math.round((sentimentScore + aiAnalysis.sentiment) / 2);
      
      if (aiAnalysis.shouldHide && !shouldHide) {
        shouldHide = true;
        suggestedAction = "hide";
        reason = aiAnalysis.reason;
      }
      
      categories.push(...aiAnalysis.categories.filter(c => !categories.includes(c)));
      
    } catch (error) {
      console.error("[AI Moderator] AI analysis failed, using rule-based only:", error);
    }
  }
  
  // ========================================================================
  // FINAL DECISION
  // ========================================================================
  
  // Calculate confidence
  const confidence = shouldHide ? 85 : (toxicityScore > 30 ? 70 : 90);
  
  // Determine support needed
  const supportNeeded = sentimentScore < 30 || categories.includes("struggling");
  
  // Build final reason
  if (!reason) {
    if (shouldHide) {
      reason = `Content hidden: ${categories.join(", ")}`;
    } else if (suggestedAction === "review") {
      reason = `Flagged for review: ${categories.join(", ")}`;
    } else {
      reason = "Content approved";
    }
  }
  
  const result: ModerationResult = {
    shouldHide,
    confidence,
    toxicity: toxicityScore,
    sentiment: sentimentScore,
    platformCriticism: hasPlatformCriticism,
    reason,
    categories,
    supportNeeded,
    suggestedAction,
    complianceScore: complianceResult.overallScore,
    complianceViolations,
    legalConcerns,
    crisisDetected: false,
    privacyConcerns,
    userFeedback,
    disclaimerNeeded,
  };
  
  // Log for self-learning
  await logModerationDecision({
    userId,
    action: suggestedAction,
    reason,
    content: content.substring(0, 200),
    aiConfidence: confidence,
    aiAnalysis: result,
  });
  
  return result;
}

// ============================================================================
// AI ANALYSIS (For nuanced cases)
// ============================================================================

async function analyzeWithAI(
  content: string,
  context: {
    hasPlatformCriticism: boolean;
    toxicityScore: number;
    complianceViolations: string[];
    postType?: string;
  }
): Promise<{
  toxicity: number;
  sentiment: number;
  shouldHide: boolean;
  reason: string;
  categories: string[];
}> {
  const systemPrompt = `You are a content moderator for a supportive wellness coaching community called "Purposeful Live Coaching".

COMMUNITY VALUES:
- Vulnerability and authenticity are encouraged
- Struggles are valid and should be supported, NOT hidden
- Celebrating wins builds community
- Peer support is powerful

WHAT TO FLAG (shouldHide: true):
- Personal attacks on other members
- Harassment or bullying
- Discrimination or hate speech
- Spam or promotional content
- Explicit harmful content

WHAT TO ALLOW (shouldHide: false):
- Sharing struggles (this is BRAVE, not negative)
- Asking for help
- Expressing difficult emotions
- Constructive feedback (even if critical)

PLATFORM CRITICISM:
- Flag but don't auto-hide
- Owner should review these personally

Return JSON:
{
  "toxicity": 0-100,
  "sentiment": 0-100 (0=negative, 100=positive),
  "shouldHide": boolean,
  "reason": "brief explanation",
  "categories": ["array", "of", "categories"]
}

Categories: supportive, win, struggling, question, toxic, spam, platform_criticism, needs_support`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano", // Use nano for cost efficiency
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Analyze this community post:

"${content}"

Context:
- Post type: ${context.postType || 'general'}
- Pre-detected platform criticism: ${context.hasPlatformCriticism}
- Pre-detected toxicity score: ${context.toxicityScore}
- Compliance violations: ${context.complianceViolations.join(", ") || "none"}`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 200,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    toxicity: result.toxicity || 0,
    sentiment: result.sentiment || 50,
    shouldHide: result.shouldHide || false,
    reason: result.reason || "AI analysis complete",
    categories: result.categories || [],
  };
}

// ============================================================================
// LOGGING FOR SELF-LEARNING
// ============================================================================

async function logModerationDecision(data: {
  userId: string;
  action: string;
  reason: string;
  content: string;
  aiConfidence: number;
  aiAnalysis?: any;
  postId?: string;
  commentId?: string;
}) {
  try {
    const db = await getDb();
    if (!db) return;
    
    await db.insert(communityModerationLog).values({
      id: uuidv4(),
      userId: data.userId,
      postId: data.postId || null,
      commentId: data.commentId || null,
      action: data.action,
      reason: data.reason,
      moderatorType: "ai",
      aiConfidence: data.aiConfidence,
      aiAnalysis: data.aiAnalysis ? JSON.stringify(data.aiAnalysis) : null,
    });
  } catch (error) {
    console.error("[AI Moderator] Failed to log decision:", error);
  }
}

// ============================================================================
// SELF-LEARNING: PATTERN ANALYSIS
// ============================================================================

export async function analyzeModerationPatterns(): Promise<{
  totalDecisions: number;
  approvalRate: number;
  escalationRate: number;
  topCategories: { category: string; count: number }[];
  recommendations: string[];
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalDecisions: 0,
      approvalRate: 0,
      escalationRate: 0,
      topCategories: [],
      recommendations: [],
    };
  }
  
  const recentDecisions = await db
    .select()
    .from(communityModerationLog)
    .orderBy(communityModerationLog.createdAt)
    .limit(1000);
  
  const total = recentDecisions.length;
  const approved = recentDecisions.filter(d => 
    d.action === "approve" || d.action === "auto_approve"
  ).length;
  const escalated = recentDecisions.filter(d => d.action === "escalate").length;
  
  const approvalRate = total > 0 ? (approved / total) * 100 : 0;
  const escalationRate = total > 0 ? (escalated / total) * 100 : 0;
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (approvalRate < 70) {
    recommendations.push("High rejection rate - consider reviewing moderation thresholds");
  }
  
  if (escalationRate > 5) {
    recommendations.push("High escalation rate - community may need additional support resources");
  }
  
  console.log(`[AI Moderator Self-Learning] ${total} decisions, ${approvalRate.toFixed(1)}% approved, ${escalationRate.toFixed(1)}% escalated`);
  
  return {
    totalDecisions: total,
    approvalRate,
    escalationRate,
    topCategories: [],
    recommendations,
  };
}

// ============================================================================
// SELF-LEARNING: FEEDBACK RECORDING
// ============================================================================

export async function recordModerationFeedback(data: {
  postId?: string;
  commentId?: string;
  feedbackType: "false_positive" | "false_negative" | "correct";
  userId: string;
  notes?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(communityModerationLog).values({
    id: uuidv4(),
    postId: data.postId || null,
    commentId: data.commentId || null,
    userId: data.userId,
    action: `feedback_${data.feedbackType}`,
    reason: data.notes || `User reported ${data.feedbackType}`,
    moderatorType: "human",
    aiConfidence: 0,
  });
  
  console.log(`[AI Moderator] Feedback recorded: ${data.feedbackType}`);
}

// ============================================================================
// ADMIN: GET MODERATION STATS
// ============================================================================

export async function getModerationStats(): Promise<{
  today: { total: number; approved: number; hidden: number; escalated: number };
  platformCriticismCount: number;
  crisisCount: number;
  needsReview: number;
}> {
  // Simplified - would implement with proper date filtering
  return {
    today: { total: 0, approved: 0, hidden: 0, escalated: 0 },
    platformCriticismCount: 0,
    crisisCount: 0,
    needsReview: 0,
  };
}

// ============================================================================
// CONTENT SANITIZATION (Remove PII)
// ============================================================================

export function sanitizeContent(content: string): string {
  let sanitized = content;
  
  // Redact email addresses
  sanitized = sanitized.replace(PII_PATTERNS.email, "[email redacted]");
  
  // Redact phone numbers
  sanitized = sanitized.replace(PII_PATTERNS.phone, "[phone redacted]");
  
  // Redact SSN
  sanitized = sanitized.replace(PII_PATTERNS.ssn, "[SSN redacted]");
  
  // Redact credit card numbers
  sanitized = sanitized.replace(PII_PATTERNS.credit_card, "[card redacted]");
  
  return sanitized;
}
