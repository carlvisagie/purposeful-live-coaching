/**
 * SPEAKER TRAINING ROUTER
 * 
 * AI-powered personal speaking coach that watches and provides real-time
 * feedback to transform users into powerful, authoritative speakers.
 * 
 * VISUAL ANALYSIS:
 * - Eye contact patterns (camera focus, darting, looking down)
 * - Facial expressiveness (animated vs flat)
 * - Posture & presence (shoulders, chin, openness)
 * - Hand gestures (purposeful vs nervous)
 * - Head movements (nodding, tilting)
 * - Smile authenticity (Duchenne vs fake)
 * - Overall confidence projection
 * 
 * VOCAL ANALYSIS:
 * - Pace (words per minute)
 * - Pauses (power pauses vs awkward silence)
 * - Filler words (um, uh, like, you know)
 * - Vocal variety (pitch, volume, emphasis)
 * - Conviction (certainty vs hedging)
 * - Energy level
 * 
 * CONTENT ANALYSIS:
 * - Story structure
 * - Emotional peaks
 * - Opening hooks
 * - Call-to-action clarity
 * - Audience engagement techniques
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Training modes
type TrainingMode = "free_practice" | "storytelling" | "coaching" | "presentation" | "impromptu" | "interview" | "singing";

// Feedback categories
interface VisualFeedback {
  eyeContact: {
    score: number; // 0-100
    issue: string | null;
    tip: string;
  };
  facialExpression: {
    score: number;
    expressiveness: "flat" | "moderate" | "animated" | "over-animated";
    issue: string | null;
    tip: string;
  };
  posture: {
    score: number;
    description: string;
    issue: string | null;
    tip: string;
  };
  gestures: {
    score: number;
    type: "none" | "nervous" | "minimal" | "purposeful" | "excessive";
    issue: string | null;
    tip: string;
  };
  presence: {
    score: number;
    level: "weak" | "moderate" | "strong" | "commanding";
    issue: string | null;
    tip: string;
  };
}

interface VocalFeedback {
  pace: {
    score: number;
    wpm: number;
    assessment: "too_slow" | "slow" | "good" | "fast" | "too_fast";
    tip: string;
  };
  fillerWords: {
    score: number;
    count: number;
    words: string[];
    tip: string;
  };
  pauses: {
    score: number;
    usage: "none" | "awkward" | "minimal" | "effective" | "masterful";
    tip: string;
  };
  vocalVariety: {
    score: number;
    assessment: "monotone" | "limited" | "moderate" | "dynamic" | "captivating";
    tip: string;
  };
  conviction: {
    score: number;
    level: "uncertain" | "hesitant" | "moderate" | "confident" | "commanding";
    hedgingPhrases: string[];
    tip: string;
  };
  energy: {
    score: number;
    level: "low" | "moderate" | "high" | "intense";
    tip: string;
  };
}

interface ContentFeedback {
  structure: {
    score: number;
    hasOpening: boolean;
    hasBody: boolean;
    hasClosing: boolean;
    tip: string;
  };
  engagement: {
    score: number;
    techniques: string[];
    missing: string[];
    tip: string;
  };
  clarity: {
    score: number;
    assessment: string;
    tip: string;
  };
}

interface SpeakerAnalysis {
  overallScore: number;
  visual: VisualFeedback;
  vocal: VocalFeedback;
  content: ContentFeedback;
  topStrengths: string[];
  topImprovements: string[];
  immediateAction: string;
  encouragement: string;
}

// Prompts for different training modes
const TRAINING_PROMPTS = {
  storytelling: [
    "Tell a story about a time you overcame a significant challenge",
    "Share a moment that changed your perspective on life",
    "Describe your most memorable travel experience",
    "Tell a story about someone who inspired you",
    "Share a funny incident that taught you something important",
  ],
  coaching: [
    "Welcome a new client and explain how your coaching process works",
    "Help a client who is feeling overwhelmed with work stress",
    "Guide a client through a difficult decision they need to make",
    "Celebrate a client's progress and set new goals",
    "Address a client who seems resistant to change",
  ],
  presentation: [
    "Introduce yourself and your coaching philosophy in 2 minutes",
    "Explain the benefits of wellness coaching to a corporate audience",
    "Present your signature coaching methodology",
    "Deliver a motivational opening for a workshop",
    "Close a presentation with a powerful call-to-action",
  ],
  impromptu: [
    "What does success mean to you?",
    "If you could give one piece of advice to your younger self, what would it be?",
    "Why is emotional intelligence important in today's world?",
    "What's the biggest misconception about coaching?",
    "How do you stay motivated during difficult times?",
  ],
  interview: [
    "Tell me about your understanding of the Accountable Manager concept under 14 CFR §119.67(c). What authority must this role have?",
    "Explain the difference between mandatory and discretionary maintenance requirements. When does a Service Bulletin become mandatory?",
    "What is the conceptual difference between FAR Part 121 and Part 145 operations?",
    "Explain the difference between Quality Assurance and Quality Control in aviation maintenance.",
    "What makes a maintenance program legitimate and auditable?",
    "Why is documentation discipline critical, especially in DoD programs?",
    "How do you work with government oversight roles like GFR, GGR, and PMO?",
    "Describe a situation where you had to prioritize safety over schedule. How did you handle it?",
    "You've led lean teams with enterprise-level responsibility. How do you ensure quality with limited manpower?",
    "When you encounter something you don't know, how do you find authoritative answers and validate your interpretations?",
    "What is your leadership philosophy when it comes to safety, compliance, and documentation?",
    "How would you handle a situation where you discovered non-compliant maintenance documentation?",
  ],
  singing: [
    "Warm up with a simple scale - do re mi fa sol la ti do - focus on breath support",
    "Sing 'Happy Birthday' with full emotion and expression",
    "Practice a verse of your favorite song - focus on hitting the notes clearly",
    "Do a vocal warm-up: lip trills, humming, then open vowels (ah, eh, ee, oh, oo)",
    "Sing any song you know well - focus on connecting emotionally with the lyrics",
    "Practice dynamics: sing a phrase softly, then repeat it powerfully",
  ],
};

export const speakerTrainingRouter = router({
  /**
   * Get a random training prompt based on mode
   */
  getTrainingPrompt: publicProcedure
    .input(z.object({
      mode: z.enum(["storytelling", "coaching", "presentation", "impromptu", "interview", "singing"]),
    }))
    .query(({ input }) => {
      const prompts = TRAINING_PROMPTS[input.mode];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      return {
        prompt: randomPrompt,
        mode: input.mode,
        tips: getModeTips(input.mode),
      };
    }),

  /**
   * Analyze a video frame for speaker presence and body language
   * Called every 3-5 seconds during practice
   */
  analyzePresence: publicProcedure
    .input(z.object({
      frameBase64: z.string(),
      mode: z.enum(["free_practice", "storytelling", "coaching", "presentation", "impromptu", "interview", "singing"]),
      sessionDuration: z.number().optional(), // seconds
    }))
    .mutation(async ({ input }): Promise<{
      visual: VisualFeedback;
      immediateCorrection: string | null;
      encouragement: string | null;
    }> => {
      const { frameBase64, mode } = input;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert speaking coach analyzing a speaker's visual presence during a ${mode.replace("_", " ")} practice session.

Analyze the image for:

1. EYE CONTACT: Are they looking at the camera (good) or away (bad)? Darting eyes? Looking down?
2. FACIAL EXPRESSION: Animated and engaging, or flat/monotone? Authentic smile?
3. POSTURE: Confident and open, or slouched/closed? Shoulders back? Chin up?
4. GESTURES: Purposeful hand movements, or nervous fidgeting? Hands visible?
5. OVERALL PRESENCE: Do they command attention? Would you want to listen to them?

Be specific and actionable. This is for personal improvement - be honest but constructive.

Respond in JSON:
{
  "eyeContact": {
    "score": 0-100,
    "issue": "specific issue or null if good",
    "tip": "actionable improvement tip"
  },
  "facialExpression": {
    "score": 0-100,
    "expressiveness": "flat|moderate|animated|over-animated",
    "issue": "specific issue or null",
    "tip": "actionable tip"
  },
  "posture": {
    "score": 0-100,
    "description": "what you observe",
    "issue": "specific issue or null",
    "tip": "actionable tip"
  },
  "gestures": {
    "score": 0-100,
    "type": "none|nervous|minimal|purposeful|excessive",
    "issue": "specific issue or null",
    "tip": "actionable tip"
  },
  "presence": {
    "score": 0-100,
    "level": "weak|moderate|strong|commanding",
    "issue": "specific issue or null",
    "tip": "actionable tip"
  },
  "immediateCorrection": "ONE thing to fix RIGHT NOW or null if doing well",
  "encouragement": "specific positive observation"
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
                  text: "Analyze this speaker's visual presence. Be specific and actionable."
                }
              ]
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("No response");

        const parsed = JSON.parse(content);

        return {
          visual: {
            eyeContact: parsed.eyeContact,
            facialExpression: parsed.facialExpression,
            posture: parsed.posture,
            gestures: parsed.gestures,
            presence: parsed.presence,
          },
          immediateCorrection: parsed.immediateCorrection,
          encouragement: parsed.encouragement,
        };
      } catch (error) {
        console.error("Presence analysis error:", error);
        return {
          visual: getDefaultVisualFeedback(),
          immediateCorrection: null,
          encouragement: "Keep practicing!",
        };
      }
    }),

  /**
   * Analyze speech content and delivery
   * Called with transcript segments
   */
  analyzeSpeech: publicProcedure
    .input(z.object({
      transcript: z.string(),
      mode: z.enum(["free_practice", "storytelling", "coaching", "presentation", "impromptu", "interview", "singing"]),
      duration: z.number(), // seconds of speech
    }))
    .mutation(async ({ input }): Promise<{
      vocal: VocalFeedback;
      content: ContentFeedback;
      immediateCorrection: string | null;
    }> => {
      const { transcript, mode, duration } = input;

      // Calculate words per minute
      const wordCount = transcript.split(/\s+/).filter(w => w.length > 0).length;
      const minutes = duration / 60;
      const wpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

      // Count filler words
      const fillerPatterns = /\b(um|uh|like|you know|basically|actually|literally|so|right|okay|well)\b/gi;
      const fillerMatches = transcript.match(fillerPatterns) || [];
      const fillerCount = fillerMatches.length;

      // Count hedging phrases
      const hedgingPatterns = /\b(i think|maybe|perhaps|kind of|sort of|i guess|probably|might|could be)\b/gi;
      const hedgingMatches = transcript.match(hedgingPatterns) || [];

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert speaking coach analyzing a speaker's vocal delivery and content during a ${mode.replace("_", " ")} practice.

Speech stats:
- Words: ${wordCount}
- Duration: ${Math.round(duration)} seconds
- WPM: ${wpm} (ideal: 120-150 for impact, 150-180 for energy)
- Filler words detected: ${fillerCount} (${fillerMatches.join(", ") || "none"})
- Hedging phrases: ${hedgingMatches.join(", ") || "none"}

Analyze the transcript for:

1. PACE: Is the WPM appropriate? Too fast loses audience, too slow loses attention.
2. FILLER WORDS: How distracting are they? Impact on credibility?
3. PAUSES: Can you infer pause usage from punctuation/structure?
4. VOCAL VARIETY: Does the text suggest dynamic delivery or monotone?
5. CONVICTION: Strong, certain language or hedging/uncertain?
6. ENERGY: Does the content convey enthusiasm?
7. STRUCTURE: Clear opening, body, closing?
8. ENGAGEMENT: Rhetorical questions, stories, examples?
9. CLARITY: Is the message clear and memorable?

Respond in JSON:
{
  "pace": {
    "score": 0-100,
    "wpm": ${wpm},
    "assessment": "too_slow|slow|good|fast|too_fast",
    "tip": "specific tip"
  },
  "fillerWords": {
    "score": 0-100,
    "count": ${fillerCount},
    "words": ${JSON.stringify(fillerMatches.slice(0, 5))},
    "tip": "specific tip"
  },
  "pauses": {
    "score": 0-100,
    "usage": "none|awkward|minimal|effective|masterful",
    "tip": "specific tip"
  },
  "vocalVariety": {
    "score": 0-100,
    "assessment": "monotone|limited|moderate|dynamic|captivating",
    "tip": "specific tip"
  },
  "conviction": {
    "score": 0-100,
    "level": "uncertain|hesitant|moderate|confident|commanding",
    "hedgingPhrases": ${JSON.stringify(hedgingMatches.slice(0, 5))},
    "tip": "specific tip"
  },
  "energy": {
    "score": 0-100,
    "level": "low|moderate|high|intense",
    "tip": "specific tip"
  },
  "structure": {
    "score": 0-100,
    "hasOpening": boolean,
    "hasBody": boolean,
    "hasClosing": boolean,
    "tip": "specific tip"
  },
  "engagement": {
    "score": 0-100,
    "techniques": ["techniques used"],
    "missing": ["techniques to add"],
    "tip": "specific tip"
  },
  "clarity": {
    "score": 0-100,
    "assessment": "brief assessment",
    "tip": "specific tip"
  },
  "immediateCorrection": "ONE thing to improve in next attempt"
}`
            },
            {
              role: "user",
              content: `Analyze this speech transcript:\n\n"${transcript}"`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 1200,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("No response");

        const parsed = JSON.parse(content);

        return {
          vocal: {
            pace: parsed.pace,
            fillerWords: parsed.fillerWords,
            pauses: parsed.pauses,
            vocalVariety: parsed.vocalVariety,
            conviction: parsed.conviction,
            energy: parsed.energy,
          },
          content: {
            structure: parsed.structure,
            engagement: parsed.engagement,
            clarity: parsed.clarity,
          },
          immediateCorrection: parsed.immediateCorrection,
        };
      } catch (error) {
        console.error("Speech analysis error:", error);
        return {
          vocal: getDefaultVocalFeedback(wpm, fillerCount, fillerMatches, hedgingMatches),
          content: getDefaultContentFeedback(),
          immediateCorrection: null,
        };
      }
    }),

  /**
   * Get comprehensive session summary
   * Called at end of practice session
   */
  getSessionSummary: publicProcedure
    .input(z.object({
      mode: z.enum(["free_practice", "storytelling", "coaching", "presentation", "impromptu", "interview", "singing"]),
      duration: z.number(), // total seconds
      visualScores: z.array(z.object({
        eyeContact: z.number(),
        facialExpression: z.number(),
        posture: z.number(),
        gestures: z.number(),
        presence: z.number(),
      })),
      vocalScores: z.object({
        pace: z.number(),
        fillerWords: z.number(),
        pauses: z.number(),
        vocalVariety: z.number(),
        conviction: z.number(),
        energy: z.number(),
      }).optional(),
      contentScores: z.object({
        structure: z.number(),
        engagement: z.number(),
        clarity: z.number(),
      }).optional(),
      transcript: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { mode, duration, visualScores, vocalScores, contentScores } = input;

      // Calculate averages
      const avgVisual = visualScores.length > 0 ? {
        eyeContact: Math.round(visualScores.reduce((a, b) => a + b.eyeContact, 0) / visualScores.length),
        facialExpression: Math.round(visualScores.reduce((a, b) => a + b.facialExpression, 0) / visualScores.length),
        posture: Math.round(visualScores.reduce((a, b) => a + b.posture, 0) / visualScores.length),
        gestures: Math.round(visualScores.reduce((a, b) => a + b.gestures, 0) / visualScores.length),
        presence: Math.round(visualScores.reduce((a, b) => a + b.presence, 0) / visualScores.length),
      } : null;

      // Calculate overall score
      const visualAvg = avgVisual 
        ? (avgVisual.eyeContact + avgVisual.facialExpression + avgVisual.posture + avgVisual.gestures + avgVisual.presence) / 5
        : 50;
      
      const vocalAvg = vocalScores
        ? (vocalScores.pace + vocalScores.fillerWords + vocalScores.pauses + vocalScores.vocalVariety + vocalScores.conviction + vocalScores.energy) / 6
        : 50;
      
      const contentAvg = contentScores
        ? (contentScores.structure + contentScores.engagement + contentScores.clarity) / 3
        : 50;

      const overallScore = Math.round((visualAvg * 0.4) + (vocalAvg * 0.35) + (contentAvg * 0.25));

      // Determine strengths and improvements
      const allScores: { name: string; score: number }[] = [];
      
      if (avgVisual) {
        allScores.push(
          { name: "Eye Contact", score: avgVisual.eyeContact },
          { name: "Facial Expression", score: avgVisual.facialExpression },
          { name: "Posture", score: avgVisual.posture },
          { name: "Gestures", score: avgVisual.gestures },
          { name: "Presence", score: avgVisual.presence },
        );
      }
      
      if (vocalScores) {
        allScores.push(
          { name: "Pace", score: vocalScores.pace },
          { name: "Filler Words", score: vocalScores.fillerWords },
          { name: "Pauses", score: vocalScores.pauses },
          { name: "Vocal Variety", score: vocalScores.vocalVariety },
          { name: "Conviction", score: vocalScores.conviction },
          { name: "Energy", score: vocalScores.energy },
        );
      }
      
      if (contentScores) {
        allScores.push(
          { name: "Structure", score: contentScores.structure },
          { name: "Engagement", score: contentScores.engagement },
          { name: "Clarity", score: contentScores.clarity },
        );
      }

      const sorted = [...allScores].sort((a, b) => b.score - a.score);
      const topStrengths = sorted.slice(0, 3).map(s => `${s.name} (${s.score}%)`);
      const topImprovements = sorted.slice(-3).reverse().map(s => `${s.name} (${s.score}%)`);

      // Generate personalized feedback
      let immediateAction = "";
      let encouragement = "";

      if (sorted.length > 0) {
        const weakest = sorted[sorted.length - 1];
        immediateAction = getImmediateAction(weakest.name, weakest.score);
        encouragement = getEncouragement(overallScore, sorted[0].name);
      }

      return {
        overallScore,
        duration: Math.round(duration),
        mode,
        visualAverage: avgVisual,
        vocalAverage: vocalScores,
        contentAverage: contentScores,
        topStrengths,
        topImprovements,
        immediateAction,
        encouragement,
        grade: getGrade(overallScore),
        nextSteps: getNextSteps(topImprovements),
      };
    }),
});

// Helper functions
function getModeTips(mode: string): string[] {
  switch (mode) {
    case "storytelling":
      return [
        "Start with a hook - drop us into the action",
        "Use sensory details to paint pictures",
        "Build to an emotional peak",
        "End with a clear takeaway or lesson",
      ];
    case "coaching":
      return [
        "Maintain warm, open body language",
        "Use reflective listening phrases",
        "Ask powerful questions",
        "Validate emotions before problem-solving",
      ];
    case "presentation":
      return [
        "Open with impact - question, story, or bold statement",
        "Use the rule of three for key points",
        "Pause after important statements",
        "End with a clear call-to-action",
      ];
    case "impromptu":
      return [
        "Take a breath before starting",
        "Use the PREP method: Point, Reason, Example, Point",
        "It's okay to pause and think",
        "Commit to your answer with confidence",
      ];
    case "interview":
      return [
        "Project authority - you ARE the expert they need",
        "Use concrete examples from your experience",
        "Speak in declarative statements, not hedging language",
        "Remember: Safety, compliance, documentation before schedule - always",
        "Show you know when to escalate and ask for help",
      ];
    case "singing":
      return [
        "Breathe from your diaphragm, not your chest",
        "Open your mouth wider than feels natural",
        "Connect emotionally with the lyrics",
        "Maintain good posture - it affects your breath",
        "Relax your jaw and throat - tension kills tone",
      ];
    default:
      return [
        "Speak to the camera as if it's a person",
        "Vary your pace and tone",
        "Use purposeful gestures",
        "Project confidence even if you don't feel it",
      ];
  }
}

function getDefaultVisualFeedback(): VisualFeedback {
  return {
    eyeContact: { score: 50, issue: null, tip: "Look directly at the camera" },
    facialExpression: { score: 50, expressiveness: "moderate", issue: null, tip: "Show more expression" },
    posture: { score: 50, description: "neutral", issue: null, tip: "Sit up straight, shoulders back" },
    gestures: { score: 50, type: "minimal", issue: null, tip: "Use purposeful hand gestures" },
    presence: { score: 50, level: "moderate", issue: null, tip: "Project confidence" },
  };
}

function getDefaultVocalFeedback(wpm: number, fillerCount: number, fillerWords: string[], hedgingPhrases: string[]): VocalFeedback {
  return {
    pace: { 
      score: wpm >= 120 && wpm <= 180 ? 70 : 50, 
      wpm, 
      assessment: wpm < 120 ? "slow" : wpm > 180 ? "fast" : "good",
      tip: "Aim for 130-160 words per minute" 
    },
    fillerWords: { 
      score: Math.max(0, 100 - (fillerCount * 10)), 
      count: fillerCount, 
      words: fillerWords.slice(0, 5),
      tip: "Replace filler words with pauses" 
    },
    pauses: { score: 50, usage: "minimal", tip: "Use strategic pauses for emphasis" },
    vocalVariety: { score: 50, assessment: "moderate", tip: "Vary your pitch and volume" },
    conviction: { 
      score: hedgingPhrases.length > 3 ? 40 : 60, 
      level: hedgingPhrases.length > 3 ? "hesitant" : "moderate",
      hedgingPhrases: hedgingPhrases.slice(0, 5),
      tip: "Remove hedging phrases for more authority" 
    },
    energy: { score: 50, level: "moderate", tip: "Bring more enthusiasm" },
  };
}

function getDefaultContentFeedback(): ContentFeedback {
  return {
    structure: { score: 50, hasOpening: true, hasBody: true, hasClosing: false, tip: "Add a clear closing" },
    engagement: { score: 50, techniques: [], missing: ["questions", "stories"], tip: "Add rhetorical questions" },
    clarity: { score: 50, assessment: "Average clarity", tip: "Simplify your main message" },
  };
}

function getImmediateAction(weakest: string, score: number): string {
  const actions: Record<string, string> = {
    "Eye Contact": "Practice looking directly at the camera lens. Imagine you're talking to a close friend through the camera.",
    "Facial Expression": "Before your next practice, do facial warm-ups. Exaggerate expressions - big smile, surprise, concern. Then dial it back 50%.",
    "Posture": "Set up your camera at eye level. Sit on the edge of your chair, shoulders back, chin slightly up. This projects confidence.",
    "Gestures": "Keep your hands visible and use them to emphasize key points. Practice the 'box' - keep gestures within shoulder width.",
    "Presence": "Before speaking, take a deep breath and ground yourself. Speak as if what you're saying is the most important thing in the world.",
    "Pace": "Practice with a metronome app. Aim for 130-160 WPM. Slow down on key points, speed up on transitions.",
    "Filler Words": "Record yourself and count fillers. Replace each 'um' with a pause. Silence is more powerful than filler.",
    "Pauses": "After each key point, pause for 2 full seconds. It feels long but sounds powerful. Let your words land.",
    "Vocal Variety": "Practice the same sentence with different emotions: excited, serious, curious, passionate. Your voice should paint pictures.",
    "Conviction": "Remove 'I think', 'maybe', 'kind of' from your vocabulary. State things as facts. 'This IS important' not 'I think this might be important'.",
    "Energy": "Stand up while practicing. Move your body. Your physical energy translates to vocal energy.",
    "Structure": "Use the rule of three: Opening hook, three main points, memorable close. Write it out before practicing.",
    "Engagement": "Add one rhetorical question per minute. 'Have you ever felt...?' 'What would happen if...?' Pull your audience in.",
    "Clarity": "After each practice, write your main message in one sentence. If you can't, simplify until you can.",
  };
  
  return actions[weakest] || "Focus on the fundamentals: eye contact, posture, and clear speech.";
}

function getEncouragement(score: number, strength: string): string {
  if (score >= 80) {
    return `Excellent work! Your ${strength} is particularly impressive. You're developing real presence.`;
  } else if (score >= 60) {
    return `Good progress! Your ${strength} shows real potential. Keep building on this foundation.`;
  } else if (score >= 40) {
    return `You're on the right track. Your ${strength} is your strongest area - use it as an anchor while you improve other areas.`;
  } else {
    return `Every master was once a beginner. Your ${strength} shows promise. Consistent practice will transform your delivery.`;
  }
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 60) return "C+";
  if (score >= 55) return "C";
  if (score >= 50) return "C-";
  if (score >= 45) return "D+";
  if (score >= 40) return "D";
  return "Keep Practicing";
}

function getNextSteps(improvements: string[]): string[] {
  return [
    `Focus on improving your ${improvements[0]?.split(" (")[0] || "weakest area"} in your next session`,
    "Practice for at least 5 minutes daily - consistency beats intensity",
    "Record yourself and watch it back - you'll see what others see",
    "Celebrate small wins - progress compounds over time",
  ];
}
