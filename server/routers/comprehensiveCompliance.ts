import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import {
  comprehensiveComplianceCheck,
  preSpeechCheck,
  generateRealTimeAlert,
  getComplianceRules,
  recordComplianceForLearning,
  getAdaptiveComplianceRules,
  validateComplianceRule,
  evolveComplianceRules,
  getComplianceLearningStatus,
  type ComplianceResult,
  type RealTimeAlert,
  type ComplianceCategory
} from "../comprehensiveCompliance";

/**
 * Comprehensive Compliance Router
 * 
 * Provides API endpoints for:
 * - Real-time compliance checking during sessions
 * - Pre-speech validation for AI suggestions
 * - Compliance rules reference
 * - Session compliance scoring
 * - Self-learning and rule evolution
 */

export const comprehensiveComplianceRouter = router({
  /**
   * Check text for compliance violations
   * Used for real-time monitoring during coaching sessions
   */
  checkCompliance: publicProcedure
    .input(
      z.object({
        text: z.string(),
        isCoachSpeaking: z.boolean().default(true),
        sessionType: z.enum(["training", "live_client"]).default("live_client"),
        coachName: z.string().optional()
      })
    )
    .mutation(async ({ input }): Promise<ComplianceResult> => {
      return comprehensiveComplianceCheck(input.text, {
        isCoachSpeaking: input.isCoachSpeaking,
        sessionType: input.sessionType,
        coachName: input.coachName
      });
    }),

  /**
   * Pre-speech check for AI-generated suggestions
   * Validates and potentially improves responses before delivery
   */
  preSpeechValidation: publicProcedure
    .input(
      z.object({
        proposedResponse: z.string()
      })
    )
    .mutation(async ({ input }) => {
      return preSpeechCheck(input.proposedResponse);
    }),

  /**
   * Get all compliance rules for UI display
   */
  getComplianceRules: publicProcedure.query(() => {
    return getComplianceRules();
  }),

  /**
   * Stream compliance alerts for real-time feedback
   * This is designed to be called frequently during sessions
   */
  streamComplianceCheck: publicProcedure
    .input(
      z.object({
        text: z.string(),
        previousViolations: z.array(z.string()).optional()
      })
    )
    .mutation(async ({ input }): Promise<{
      alerts: RealTimeAlert[];
      newViolations: string[];
      overallScore: number;
    }> => {
      const result = await comprehensiveComplianceCheck(input.text, {
        isCoachSpeaking: true,
        sessionType: "live_client"
      });

      // Filter to only new violations
      const previousSet = new Set(input.previousViolations || []);
      const newViolations = result.violations.filter(
        v => !previousSet.has(`${v.category}:${v.subcategory}:${v.flaggedContent}`)
      );

      const alerts = newViolations.map(v => generateRealTimeAlert(v));

      return {
        alerts,
        newViolations: newViolations.map(v => `${v.category}:${v.subcategory}:${v.flaggedContent}`),
        overallScore: result.overallScore
      };
    }),

  /**
   * Get compliance summary for a session
   */
  getSessionComplianceSummary: publicProcedure
    .input(
      z.object({
        sessionTranscript: z.array(
          z.object({
            speaker: z.enum(["coach", "client"]),
            text: z.string(),
            timestamp: z.number()
          })
        )
      })
    )
    .mutation(async ({ input }) => {
      const coachStatements = input.sessionTranscript.filter(s => s.speaker === "coach");
      
      const allViolations: Array<{
        timestamp: number;
        text: string;
        violations: ComplianceResult["violations"];
      }> = [];

      let totalScore = 0;

      for (const statement of coachStatements) {
        const result = await comprehensiveComplianceCheck(statement.text, {
          isCoachSpeaking: true,
          sessionType: "live_client"
        });

        totalScore += result.overallScore;

        if (result.violations.length > 0) {
          allViolations.push({
            timestamp: statement.timestamp,
            text: statement.text,
            violations: result.violations
          });
        }
      }

      const averageScore = coachStatements.length > 0 
        ? Math.round(totalScore / coachStatements.length) 
        : 100;

      // Group violations by category
      const violationsByCategory: Record<ComplianceCategory, number> = {
        legal: 0,
        banned_words: 0,
        ethical: 0,
        social: 0,
        wisdom: 0,
        interpersonal: 0,
        crisis: 0
      };

      for (const item of allViolations) {
        for (const v of item.violations) {
          violationsByCategory[v.category]++;
        }
      }

      return {
        averageScore,
        totalStatements: coachStatements.length,
        totalViolations: allViolations.length,
        violationsByCategory,
        detailedViolations: allViolations,
        recommendations: generateSessionRecommendations(violationsByCategory, averageScore)
      };
    }),

  /**
   * Get specific guidance for a compliance category
   */
  getCategoryGuidance: publicProcedure
    .input(
      z.object({
        category: z.enum(["legal", "banned_words", "ethical", "social", "wisdom", "interpersonal", "crisis"])
      })
    )
    .query(({ input }) => {
      const guidance: Record<ComplianceCategory, {
        title: string;
        description: string;
        doList: string[];
        dontList: string[];
        resources: string[];
      }> = {
        legal: {
          title: "Legal Compliance",
          description: "Stay within your scope of practice as a wellness coach",
          doList: [
            "Refer to appropriate professionals for medical, legal, or financial matters",
            "Use phrases like 'I'm not qualified to advise on that, but...'",
            "Focus on emotional support and coping strategies",
            "Document when you make referrals"
          ],
          dontList: [
            "Diagnose mental health conditions",
            "Recommend specific medications or treatments",
            "Give legal advice or opinions",
            "Provide specific financial investment guidance"
          ],
          resources: [
            "ICF Code of Ethics Section 4",
            "State coaching regulations",
            "Professional liability guidelines"
          ]
        },
        banned_words: {
          title: "Effective Communication",
          description: "Avoid language that triggers defensiveness or resistance",
          doList: [
            "Use 'Help me understand...' instead of 'Why did you...'",
            "Replace 'You always/never' with 'I've noticed sometimes...'",
            "Validate emotions before offering solutions",
            "Ask permission before sharing observations"
          ],
          dontList: [
            "Start questions with accusatory 'Why'",
            "Use absolute statements (always, never)",
            "Dismiss feelings with 'Just calm down'",
            "Use toxic positivity ('Just think positive!')"
          ],
          resources: [
            "Psychology Today - 10 Phrases That Create Defensiveness",
            "Gottman Institute - Four Horsemen",
            "Nonviolent Communication by Marshall Rosenberg"
          ]
        },
        ethical: {
          title: "Ethical Standards",
          description: "Maintain professional integrity and boundaries",
          doList: [
            "Be transparent about your qualifications",
            "Maintain clear professional boundaries",
            "Honor confidentiality agreements",
            "Pursue ongoing professional development"
          ],
          dontList: [
            "Promise specific outcomes or results",
            "Blur personal and professional boundaries",
            "Claim expertise you don't have",
            "Keep secrets that could harm the client"
          ],
          resources: [
            "ICF Code of Ethics (2025)",
            "ICF Core Competencies",
            "Professional coaching ethics courses"
          ]
        },
        social: {
          title: "Cultural Sensitivity",
          description: "Practice cultural humility and inclusive communication",
          doList: [
            "Ask about individual experiences and values",
            "Respect diverse spiritual and cultural backgrounds",
            "Use inclusive, person-first language",
            "Acknowledge your own cultural lens"
          ],
          dontList: [
            "Make assumptions based on cultural background",
            "Generalize about gender roles",
            "Impose your spiritual beliefs",
            "Assume 'normal' means your norm"
          ],
          resources: [
            "Multicultural Counseling Competencies",
            "Cultural humility training",
            "Inclusive language guides"
          ]
        },
        wisdom: {
          title: "Research-Based Communication",
          description: "Apply evidence-based communication principles",
          doList: [
            "Ask permission before offering input",
            "Understand fully before problem-solving",
            "Use the 3-second pause before responding",
            "Explore what the client has already tried"
          ],
          dontList: [
            "Give unsolicited advice",
            "Jump to solutions too quickly",
            "Interrupt or finish sentences",
            "Assume you know what's best"
          ],
          resources: [
            "Motivational Interviewing",
            "Active Listening research",
            "Cialdini's Ethical Influence"
          ]
        },
        interpersonal: {
          title: "Human Nature Alignment",
          description: "Support basic psychological needs: autonomy, competence, relatedness",
          doList: [
            "Offer choices rather than directives",
            "Acknowledge challenges and celebrate progress",
            "Maintain connection even when setting boundaries",
            "Use 'and' instead of 'but'"
          ],
          dontList: [
            "Give ultimatums or remove choice",
            "Make things sound 'easy' or 'obvious'",
            "Dismiss concerns as 'not your problem'",
            "Negate with 'but' after validating"
          ],
          resources: [
            "Self-Determination Theory",
            "Improv 'Yes, And' principle",
            "Attachment theory basics"
          ]
        },
        crisis: {
          title: "Crisis Response",
          description: "Recognize and respond appropriately to safety concerns",
          doList: [
            "Ask directly about safety when concerned",
            "Provide crisis resources immediately",
            "Stay calm and present",
            "Document and follow up appropriately"
          ],
          dontList: [
            "Ignore warning signs",
            "Promise to keep dangerous secrets",
            "Handle crisis situations alone",
            "Leave someone in immediate danger"
          ],
          resources: [
            "988 Suicide & Crisis Lifeline",
            "Crisis Text Line (text HOME to 741741)",
            "National DV Hotline: 1-800-799-7233",
            "Mandatory reporting guidelines"
          ]
        }
      };

      return guidance[input.category];
    }),

  // ============================================================================
  // SELF-LEARNING ENDPOINTS
  // ============================================================================

  /**
   * Record compliance feedback for learning
   * Called after coach receives compliance alert
   */
  recordFeedback: publicProcedure
    .input(
      z.object({
        violations: z.array(z.object({
          category: z.string(),
          subcategory: z.string(),
          severity: z.string(),
          flaggedContent: z.string(),
          reason: z.string(),
          suggestion: z.string(),
        })),
        overallScore: z.number(),
        wasHelpful: z.boolean(),
        satisfaction: z.number().min(1).max(10),
        preferredAlternative: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      recordComplianceForLearning(
        {
          isCompliant: input.violations.length === 0,
          overallScore: input.overallScore,
          violations: input.violations as any,
          suggestions: [],
          requiresImmediateAction: false,
        },
        {
          wasHelpful: input.wasHelpful,
          satisfaction: input.satisfaction,
          preferredAlternative: input.preferredAlternative,
        }
      );
      return { success: true };
    }),

  /**
   * Get adaptive compliance rules with effectiveness data
   */
  getAdaptiveRules: publicProcedure
    .query(async () => {
      return getAdaptiveComplianceRules();
    }),

  /**
   * Validate a compliance rule against current research
   */
  validateRule: protectedProcedure
    .input(
      z.object({
        ruleId: z.string(),
        ruleSuggestion: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return validateComplianceRule(input.ruleId, input.ruleSuggestion);
    }),

  /**
   * Trigger compliance rules evolution
   * Should be called periodically (e.g., weekly cron job)
   */
  evolveRules: protectedProcedure
    .mutation(async () => {
      return evolveComplianceRules();
    }),

  /**
   * Get compliance module learning status
   */
  getLearningStatus: publicProcedure
    .query(() => {
      return getComplianceLearningStatus();
    }),
});

/**
 * Generate personalized recommendations based on session violations
 */
function generateSessionRecommendations(
  violationsByCategory: Record<ComplianceCategory, number>,
  averageScore: number
): string[] {
  const recommendations: string[] = [];

  if (averageScore >= 90) {
    recommendations.push("Excellent session! Your communication was highly compliant and effective.");
  } else if (averageScore >= 70) {
    recommendations.push("Good session with room for improvement in specific areas.");
  } else {
    recommendations.push("This session had several compliance concerns. Review the detailed feedback below.");
  }

  // Category-specific recommendations
  if (violationsByCategory.banned_words > 2) {
    recommendations.push("Focus on replacing accusatory questions with curious inquiry. Practice 'Help me understand...' framing.");
  }

  if (violationsByCategory.wisdom > 2) {
    recommendations.push("Try asking permission before offering suggestions. 'Would you like to explore some options?' creates buy-in.");
  }

  if (violationsByCategory.interpersonal > 1) {
    recommendations.push("Practice the 'Yes, and...' technique to honor client perspectives while adding your observations.");
  }

  if (violationsByCategory.legal > 0) {
    recommendations.push("Review scope of practice guidelines. Consider having referral resources readily available.");
  }

  if (violationsByCategory.social > 0) {
    recommendations.push("Consider cultural humility training. Ask about individual experiences rather than assuming.");
  }

  if (violationsByCategory.crisis > 0) {
    recommendations.push("Review crisis response protocols. Ensure you have current crisis resources accessible.");
  }

  return recommendations;
}

export type ComprehensiveComplianceRouter = typeof comprehensiveComplianceRouter;
