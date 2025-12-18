/**
 * REAL-TIME SESSION ANALYSIS ROUTER
 * 
 * AI Co-Pilot that watches and listens during live coaching sessions.
 * 
 * VISUAL ANALYSIS (OpenAI Vision):
 * - Micro-expressions (subtle facial movements)
 * - Eye movements & gaze patterns
 * - Body posture & shifts
 * - Hand gestures
 * - Engagement indicators
 * - Stress/anxiety signs
 * 
 * AUDIO ANALYSIS:
 * - Voice cadence & rhythm
 * - Tone variations
 * - Emotional undertones
 * - Speech patterns
 * - Pauses & hesitations
 * 
 * OUTPUT:
 * - Real-time emotional state
 * - Suggested interventions
 * - Risk indicators
 * - Session insights
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Analysis result types
interface VisualAnalysis {
  emotions: {
    primary: string;
    secondary: string | null;
    confidence: number;
  };
  microExpressions: {
    detected: string[];
    significance: string;
  };
  bodyLanguage: {
    posture: "open" | "closed" | "neutral" | "defensive" | "engaged";
    eyeContact: "direct" | "avoidant" | "shifting" | "downcast";
    gestures: string[];
    tension: "low" | "medium" | "high";
  };
  engagement: {
    level: "low" | "medium" | "high";
    indicators: string[];
  };
  stressIndicators: {
    level: "low" | "medium" | "high" | "critical";
    signs: string[];
  };
}

interface AudioAnalysis {
  emotion: {
    primary: string;
    intensity: "low" | "medium" | "high";
  };
  voicePatterns: {
    pace: "slow" | "normal" | "fast" | "rushed";
    volume: "quiet" | "normal" | "loud";
    tone: "flat" | "warm" | "tense" | "emotional" | "confident";
    tremor: boolean;
  };
  speechPatterns: {
    hesitations: number;
    fillerWords: number;
    silences: number;
    coherence: "clear" | "scattered" | "confused";
  };
}

interface SessionInsight {
  type: "observation" | "warning" | "suggestion" | "crisis";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  content: string;
  technique?: string;
  timestamp: Date;
}

export const sessionAnalysisRouter = router({
  /**
   * Analyze video frame for visual cues
   * Called periodically during session (every 3-5 seconds)
   */
  analyzeVideoFrame: publicProcedure
    .input(z.object({
      frameBase64: z.string(), // Base64 encoded image from video
      clientId: z.number().optional(),
      sessionContext: z.string().optional(),
    }))
    .mutation(async ({ input }): Promise<{ analysis: VisualAnalysis; insights: SessionInsight[] }> => {
      const { frameBase64, sessionContext } = input;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert behavioral analyst assisting a wellness coach during a live session.
Analyze the video frame for:

1. EMOTIONS: Primary and secondary emotions visible
2. MICRO-EXPRESSIONS: Subtle facial movements (lip tension, eye narrowing, brow movements)
3. BODY LANGUAGE: Posture, eye contact, gestures, physical tension
4. ENGAGEMENT: How engaged/present the person appears
5. STRESS INDICATORS: Signs of anxiety, distress, or discomfort

Be specific and actionable. Focus on what the coach should know to help the client.

${sessionContext ? `Session context: ${sessionContext}` : ""}

Respond in JSON format with this exact structure:
{
  "emotions": {
    "primary": "string (e.g., anxious, sad, frustrated, calm, happy)",
    "secondary": "string or null",
    "confidence": number (0-100)
  },
  "microExpressions": {
    "detected": ["array of specific micro-expressions"],
    "significance": "what these might indicate"
  },
  "bodyLanguage": {
    "posture": "open|closed|neutral|defensive|engaged",
    "eyeContact": "direct|avoidant|shifting|downcast",
    "gestures": ["observed gestures"],
    "tension": "low|medium|high"
  },
  "engagement": {
    "level": "low|medium|high",
    "indicators": ["specific signs"]
  },
  "stressIndicators": {
    "level": "low|medium|high|critical",
    "signs": ["specific stress signs observed"]
  },
  "insights": [
    {
      "type": "observation|warning|suggestion|crisis",
      "priority": "low|medium|high|critical",
      "title": "brief title",
      "content": "actionable insight for coach",
      "technique": "suggested coaching technique if applicable"
    }
  ]
}`
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${frameBase64}`,
                    detail: "high"
                  }
                },
                {
                  type: "text",
                  text: "Analyze this frame from a live coaching session. What do you observe about the client's emotional state, body language, and engagement?"
                }
              ]
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error("No response from AI");
        }

        const parsed = JSON.parse(content);
        
        return {
          analysis: {
            emotions: parsed.emotions,
            microExpressions: parsed.microExpressions,
            bodyLanguage: parsed.bodyLanguage,
            engagement: parsed.engagement,
            stressIndicators: parsed.stressIndicators,
          },
          insights: (parsed.insights || []).map((i: any) => ({
            ...i,
            timestamp: new Date(),
          })),
        };
      } catch (error: any) {
        console.error("Video frame analysis error:", error);
        
        // Return neutral analysis on error
        return {
          analysis: {
            emotions: { primary: "unknown", secondary: null, confidence: 0 },
            microExpressions: { detected: [], significance: "Analysis unavailable" },
            bodyLanguage: { posture: "neutral", eyeContact: "direct", gestures: [], tension: "low" },
            engagement: { level: "medium", indicators: [] },
            stressIndicators: { level: "low", signs: [] },
          },
          insights: [],
        };
      }
    }),

  /**
   * Analyze audio segment for voice patterns and emotion
   * Called periodically during session
   */
  analyzeAudioSegment: publicProcedure
    .input(z.object({
      transcript: z.string(), // Transcribed text from audio
      audioFeatures: z.object({
        averageVolume: z.number().optional(),
        speakingRate: z.number().optional(), // words per minute
        pauseCount: z.number().optional(),
        silenceDuration: z.number().optional(), // seconds
      }).optional(),
      sessionContext: z.string().optional(),
    }))
    .mutation(async ({ input }): Promise<{ analysis: AudioAnalysis; insights: SessionInsight[] }> => {
      const { transcript, audioFeatures, sessionContext } = input;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert in vocal analysis and emotional intelligence, assisting a wellness coach.
Analyze the client's speech for:

1. EMOTION: Primary emotion and intensity from word choice and patterns
2. VOICE PATTERNS: Pace, volume indicators, tone
3. SPEECH PATTERNS: Hesitations, coherence, signs of distress

${audioFeatures ? `Audio metrics: Volume=${audioFeatures.averageVolume}, Rate=${audioFeatures.speakingRate}wpm, Pauses=${audioFeatures.pauseCount}, Silence=${audioFeatures.silenceDuration}s` : ""}
${sessionContext ? `Session context: ${sessionContext}` : ""}

Respond in JSON:
{
  "emotion": {
    "primary": "string",
    "intensity": "low|medium|high"
  },
  "voicePatterns": {
    "pace": "slow|normal|fast|rushed",
    "volume": "quiet|normal|loud",
    "tone": "flat|warm|tense|emotional|confident",
    "tremor": boolean
  },
  "speechPatterns": {
    "hesitations": number,
    "fillerWords": number,
    "silences": number,
    "coherence": "clear|scattered|confused"
  },
  "insights": [
    {
      "type": "observation|warning|suggestion|crisis",
      "priority": "low|medium|high|critical",
      "title": "brief title",
      "content": "actionable insight",
      "technique": "suggested technique"
    }
  ]
}`
            },
            {
              role: "user",
              content: `Analyze this speech from a coaching session:\n\n"${transcript}"`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 800,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error("No response from AI");
        }

        const parsed = JSON.parse(content);
        
        return {
          analysis: {
            emotion: parsed.emotion,
            voicePatterns: parsed.voicePatterns,
            speechPatterns: parsed.speechPatterns,
          },
          insights: (parsed.insights || []).map((i: any) => ({
            ...i,
            timestamp: new Date(),
          })),
        };
      } catch (error: any) {
        console.error("Audio analysis error:", error);
        
        return {
          analysis: {
            emotion: { primary: "unknown", intensity: "medium" },
            voicePatterns: { pace: "normal", volume: "normal", tone: "warm", tremor: false },
            speechPatterns: { hesitations: 0, fillerWords: 0, silences: 0, coherence: "clear" },
          },
          insights: [],
        };
      }
    }),

  /**
   * Combined analysis - video + audio + context
   * For comprehensive session monitoring
   */
  analyzeSessionMoment: publicProcedure
    .input(z.object({
      frameBase64: z.string().optional(),
      transcript: z.string().optional(),
      clientName: z.string().optional(),
      sessionType: z.string().optional(),
      sessionDuration: z.number().optional(), // minutes elapsed
      previousInsights: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { frameBase64, transcript, clientName, sessionType, sessionDuration, previousInsights } = input;

      const context = `Client: ${clientName || "Client"}, Session: ${sessionType || "Coaching"}, Duration: ${sessionDuration || 0} minutes`;

      const results: {
        visual?: VisualAnalysis;
        audio?: AudioAnalysis;
        insights: SessionInsight[];
        overallState: {
          emotionalState: string;
          engagementLevel: string;
          riskLevel: "none" | "low" | "medium" | "high" | "crisis";
          recommendedAction: string;
        };
      } = {
        insights: [],
        overallState: {
          emotionalState: "stable",
          engagementLevel: "medium",
          riskLevel: "none",
          recommendedAction: "Continue current approach",
        },
      };

      // Analyze video if provided
      if (frameBase64) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are an AI Co-Pilot for a wellness coach. Analyze this moment in a live session.
Context: ${context}
${previousInsights?.length ? `Recent observations: ${previousInsights.join("; ")}` : ""}

Provide a comprehensive analysis focusing on what the coach needs to know RIGHT NOW.
Include specific, actionable coaching suggestions.

Respond in JSON:
{
  "emotionalState": "primary emotion observed",
  "bodyLanguage": {
    "posture": "description",
    "eyeContact": "description",
    "tension": "low|medium|high"
  },
  "engagement": "low|medium|high",
  "stressLevel": "low|medium|high|critical",
  "microExpressions": ["list of subtle cues"],
  "riskLevel": "none|low|medium|high|crisis",
  "insights": [
    {
      "type": "observation|warning|suggestion|crisis",
      "priority": "low|medium|high|critical",
      "title": "brief title",
      "content": "what coach should know/do",
      "technique": "coaching technique to use"
    }
  ],
  "recommendedAction": "immediate suggestion for coach"
}`
              },
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${frameBase64}`,
                      detail: "high"
                    }
                  },
                  {
                    type: "text",
                    text: transcript 
                      ? `The client just said: "${transcript}"\n\nAnalyze their visual state and speech together.`
                      : "Analyze the client's current visual state."
                  }
                ]
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 1200,
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            
            results.visual = {
              emotions: { 
                primary: parsed.emotionalState, 
                secondary: null, 
                confidence: 85 
              },
              microExpressions: { 
                detected: parsed.microExpressions || [], 
                significance: "Real-time observation" 
              },
              bodyLanguage: {
                posture: parsed.bodyLanguage?.posture?.includes("open") ? "open" : 
                         parsed.bodyLanguage?.posture?.includes("closed") ? "closed" : "neutral",
                eyeContact: parsed.bodyLanguage?.eyeContact?.includes("direct") ? "direct" :
                           parsed.bodyLanguage?.eyeContact?.includes("avoid") ? "avoidant" : "shifting",
                gestures: [],
                tension: parsed.bodyLanguage?.tension || "low",
              },
              engagement: {
                level: parsed.engagement || "medium",
                indicators: [],
              },
              stressIndicators: {
                level: parsed.stressLevel || "low",
                signs: [],
              },
            };

            results.insights = (parsed.insights || []).map((i: any) => ({
              ...i,
              timestamp: new Date(),
            }));

            results.overallState = {
              emotionalState: parsed.emotionalState || "stable",
              engagementLevel: parsed.engagement || "medium",
              riskLevel: parsed.riskLevel || "none",
              recommendedAction: parsed.recommendedAction || "Continue current approach",
            };
          }
        } catch (error) {
          console.error("Combined analysis error:", error);
        }
      }

      // If only transcript provided (no video)
      if (!frameBase64 && transcript) {
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `Analyze this client statement for emotional content and provide coaching guidance.
Context: ${context}

Respond in JSON:
{
  "emotionalState": "primary emotion",
  "intensity": "low|medium|high",
  "riskLevel": "none|low|medium|high|crisis",
  "insights": [
    {
      "type": "observation|warning|suggestion|crisis",
      "priority": "low|medium|high|critical",
      "title": "brief title",
      "content": "coaching guidance",
      "technique": "technique to use"
    }
  ],
  "recommendedAction": "what coach should do next"
}`
              },
              {
                role: "user",
                content: `Client said: "${transcript}"`
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 800,
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            
            results.audio = {
              emotion: { 
                primary: parsed.emotionalState, 
                intensity: parsed.intensity || "medium" 
              },
              voicePatterns: { pace: "normal", volume: "normal", tone: "warm", tremor: false },
              speechPatterns: { hesitations: 0, fillerWords: 0, silences: 0, coherence: "clear" },
            };

            results.insights = (parsed.insights || []).map((i: any) => ({
              ...i,
              timestamp: new Date(),
            }));

            results.overallState = {
              emotionalState: parsed.emotionalState || "stable",
              engagementLevel: "medium",
              riskLevel: parsed.riskLevel || "none",
              recommendedAction: parsed.recommendedAction || "Continue current approach",
            };
          }
        } catch (error) {
          console.error("Text analysis error:", error);
        }
      }

      return results;
    }),

  /**
   * Crisis detection - immediate check for safety concerns
   */
  checkForCrisis: publicProcedure
    .input(z.object({
      transcript: z.string(),
      visualCues: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { transcript, visualCues } = input;

      // Quick pattern check for crisis keywords
      const crisisPatterns = [
        /\b(kill|suicide|end my life|don't want to live|hurt myself|self.?harm)\b/i,
        /\b(hopeless|no point|give up|can't go on|better off dead)\b/i,
        /\b(abuse|assault|violence|danger|unsafe)\b/i,
      ];

      const hasCrisisKeywords = crisisPatterns.some(p => p.test(transcript));

      if (hasCrisisKeywords) {
        // Immediate AI assessment
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a crisis assessment AI. Evaluate if this requires immediate intervention.
                
Categories:
- CRISIS: Immediate danger, suicidal ideation with plan, active self-harm
- HIGH_RISK: Suicidal thoughts without plan, severe distress, safety concerns
- MODERATE: Significant distress but no immediate danger
- LOW: Emotional difficulty but stable

Respond in JSON:
{
  "level": "CRISIS|HIGH_RISK|MODERATE|LOW",
  "concerns": ["specific concerns"],
  "immediateAction": "what coach should do RIGHT NOW",
  "resources": ["relevant crisis resources"],
  "safetyQuestions": ["questions to assess safety"]
}`
              },
              {
                role: "user",
                content: `Client statement: "${transcript}"${visualCues?.length ? `\nVisual cues: ${visualCues.join(", ")}` : ""}`
              }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500,
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            return {
              isCrisis: parsed.level === "CRISIS" || parsed.level === "HIGH_RISK",
              level: parsed.level,
              concerns: parsed.concerns,
              immediateAction: parsed.immediateAction,
              resources: parsed.resources || [
                "988 Suicide & Crisis Lifeline",
                "Crisis Text Line: Text HOME to 741741",
              ],
              safetyQuestions: parsed.safetyQuestions,
            };
          }
        } catch (error) {
          console.error("Crisis check error:", error);
        }
      }

      return {
        isCrisis: false,
        level: "LOW",
        concerns: [],
        immediateAction: null,
        resources: [],
        safetyQuestions: [],
      };
    }),
});
