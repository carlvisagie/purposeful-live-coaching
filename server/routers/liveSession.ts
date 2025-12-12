/**
 * Live Session AI Assistant Router
 * Real-time transcription, analysis, and coaching guidance
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "../_core/llm";
import { transcribeAudio } from "../_core/voiceTranscription";
import { db } from "../db";
import { liveSessionTranscripts, coachGuidance, sessions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Analyze transcript segment for emotions and triggers
 */
async function analyzeTranscriptSegment(text: string, context: string[]) {
  const analysisPrompt = `Analyze this coaching session transcript segment and identify:
1. Primary emotions expressed (anxiety, sadness, anger, joy, fear, etc.)
2. Potential triggers or stressors mentioned
3. Crisis indicators (suicidal thoughts, self-harm, immediate danger)
4. Key themes or patterns

Transcript segment: "${text}"

Previous context: ${context.join(" | ")}

Return your analysis in this JSON format:
{
  "emotions": ["emotion1", "emotion2"],
  "triggers": ["trigger1", "trigger2"],
  "crisisLevel": "none" | "low" | "medium" | "high" | "critical",
  "themes": ["theme1", "theme2"],
  "summary": "brief summary of what's happening"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert psychological analyst. Analyze coaching session transcripts with empathy and precision.",
        },
        {
          role: "user",
          content: analysisPrompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "transcript_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              emotions: {
                type: "array",
                items: { type: "string" },
                description: "List of emotions detected",
              },
              triggers: {
                type: "array",
                items: { type: "string" },
                description: "List of triggers or stressors",
              },
              crisisLevel: {
                type: "string",
                enum: ["none", "low", "medium", "high", "critical"],
                description: "Crisis risk level",
              },
              themes: {
                type: "array",
                items: { type: "string" },
                description: "Key themes or patterns",
              },
              summary: {
                type: "string",
                description: "Brief summary of the segment",
              },
            },
            required: ["emotions", "triggers", "crisisLevel", "themes", "summary"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error("No analysis returned");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("[Live Session] Analysis error:", error);
    return {
      emotions: [],
      triggers: [],
      crisisLevel: "none",
      themes: [],
      summary: "Analysis unavailable",
    };
  }
}

/**
 * Generate coaching prompts based on analysis
 */
async function generateCoachingPrompts(
  analysis: any,
  transcriptSegment: string,
  sessionContext: string[]
) {
  const promptGenerationRequest = `Based on this coaching session analysis, generate 1-3 actionable coaching prompts.

Current segment: "${transcriptSegment}"
Emotions detected: ${analysis.emotions.join(", ")}
Triggers: ${analysis.triggers.join(", ")}
Crisis level: ${analysis.crisisLevel}
Themes: ${analysis.themes.join(", ")}

Session context: ${sessionContext.join(" | ")}

Generate coaching prompts that:
1. Are specific and actionable
2. Use evidence-based coaching techniques
3. Are appropriate for the emotional state
4. Include exact phrases the coach can use
5. Flag any compliance concerns

Return JSON format:
{
  "prompts": [
    {
      "type": "suggestion" | "warning" | "insight",
      "priority": "low" | "medium" | "high" | "critical",
      "title": "Brief title",
      "content": "Detailed coaching prompt with exact phrases",
      "technique": "Name of coaching technique"
    }
  ]
}`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are an expert coaching supervisor providing real-time guidance to coaches during sessions.",
        },
        {
          role: "user",
          content: promptGenerationRequest,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "coaching_prompts",
          strict: true,
          schema: {
            type: "object",
            properties: {
              prompts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["suggestion", "warning", "insight"],
                    },
                    priority: {
                      type: "string",
                      enum: ["low", "medium", "high", "critical"],
                    },
                    title: { type: "string" },
                    content: { type: "string" },
                    technique: { type: "string" },
                  },
                  required: ["type", "priority", "title", "content", "technique"],
                  additionalProperties: false,
                },
              },
            },
            required: ["prompts"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      return { prompts: [] };
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("[Live Session] Prompt generation error:", error);
    return { prompts: [] };
  }
}

export const liveSessionRouter = router({
  /**
   * Transcribe audio chunk from live session
   */
  transcribeAudio: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        audioUrl: z.string().url(),
        speaker: z.enum(["client", "coach"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Transcribe audio using Whisper
        const transcription = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: "en",
        });

        // Check for transcription error
        if ('error' in transcription) {
          throw new Error(transcription.error);
        }

        const transcriptText = transcription.text;

        // Save transcript to database
        const [transcript] = await db
          .insert(liveSessionTranscripts)
          .values({
            sessionId: input.sessionId,
            speaker: input.speaker,
            text: transcriptText,
            timestamp: new Date(),
          })
          .$returningId();

        return {
          transcriptId: transcript.id,
          text: transcriptText,
        };
      } catch (error) {
        console.error("[Live Session] Transcription error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to transcribe audio",
        });
      }
    }),

  /**
   * Analyze transcript segment and generate coaching prompts
   */
  analyzeSegment: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        transcriptText: z.string(),
        speaker: z.enum(["client", "coach"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Get recent transcript context (last 5 segments)
        const recentTranscripts = await db
          .select()
          .from(liveSessionTranscripts)
          .where(eq(liveSessionTranscripts.sessionId, input.sessionId))
          .orderBy(liveSessionTranscripts.timestamp)
          .limit(5);

        const context = recentTranscripts.map((t) => t.text);

        // Analyze the segment
        const analysis = await analyzeTranscriptSegment(input.transcriptText, context);

        // Generate coaching prompts (only for client speech)
        let prompts: any[] = [];
        if (input.speaker === "client") {
          const promptsData = await generateCoachingPrompts(
            analysis,
            input.transcriptText,
            context
          );
          prompts = promptsData.prompts;

          // Save prompts to database
          for (const prompt of prompts) {
            await db.insert(coachGuidance).values({
              sessionId: input.sessionId,
              guidanceType: prompt.type === 'suggestion' ? 'suggest' : prompt.type === 'warning' ? 'alert' : 'reference',
              priority: prompt.priority,
              message: `${prompt.title}: ${prompt.content}`,
              context: prompt.technique,
              timestamp: new Date(),
            });
          }
        }

        return {
          analysis,
          prompts,
        };
      } catch (error) {
        console.error("[Live Session] Analysis error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze segment",
        });
      }
    }),

  /**
   * Get all coaching prompts for a session
   */
  getSessionPrompts: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const prompts = await db
        .select()
        .from(coachGuidance)
        .where(eq(coachGuidance.sessionId, input.sessionId))
        .orderBy(coachGuidance.timestamp);

      return { prompts };
    }),

  /**
   * Get session transcript
   */
  getSessionTranscript: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input }) => {
      const transcript = await db
        .select()
        .from(liveSessionTranscripts)
        .where(eq(liveSessionTranscripts.sessionId, input.sessionId))
        .orderBy(liveSessionTranscripts.timestamp);

      return { transcript };
    }),

  /**
   * Generate session summary
   */
  createSession: protectedProcedure
    .input(
      z.object({
        clientId: z.number().optional(),
        clientName: z.string().optional(),
        sessionType: z.string().default('coaching'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Create session record
        const [session] = await db.insert(sessions).values({
          coachId: ctx.user.id,
          clientId: input.clientId || null,
          scheduledDate: new Date(),
          duration: 0,
          sessionType: input.sessionType,
          status: 'in_progress',
          paymentStatus: 'completed', // Live sessions are for existing clients
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        return {
          sessionId: session.id,
          clientId: session.clientId,
          clientName: input.clientName || 'Unknown Client',
          sessionType: session.sessionType,
          startTime: session.scheduledDate,
        };
      } catch (error) {
        console.error('[Live Session] Session creation error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create session',
        });
      }
    }),

  generateSessionSummary: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        // Get full transcript
        const transcript = await db
          .select()
          .from(liveSessionTranscripts)
          .where(eq(liveSessionTranscripts.sessionId, input.sessionId))
          .orderBy(liveSessionTranscripts.timestamp);

        const fullTranscript = transcript
          .map((t) => `${t.speaker}: ${t.text}`)
          .join("\n");

        // Generate comprehensive summary
        const summaryPrompt = `Analyze this complete coaching session transcript and generate a comprehensive summary.

${fullTranscript}

Provide:
1. Key insights and breakthroughs
2. Emotional journey throughout the session
3. Main themes and patterns
4. Coping strategies discussed
5. Homework/action items for client
6. Recommended follow-up topics
7. Overall session effectiveness

Format as a professional session note.`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert coaching supervisor creating professional session documentation.",
            },
            {
              role: "user",
              content: summaryPrompt,
            },
          ],
        });

        const summary = response.choices[0]?.message?.content || "Summary generation failed";

        return { summary };
      } catch (error) {
        console.error("[Live Session] Summary generation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate summary",
        });
      }
    }),
});
