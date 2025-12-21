/**
 * Content Studio Router
 * 
 * Handles AI-powered content generation for:
 * - YouTube video scripts
 * - Podcast episode scripts
 * - Short-form video scripts (TikTok/Reels/Shorts)
 * - Blog posts
 * - Session-to-content pipeline
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { generateText } from "../_core/llm";

// Content types
const ContentTypeSchema = z.enum(["youtube", "podcast", "shorts", "blog"]);

// Wellness topics for content generation
const WELLNESS_TOPICS = {
  anxiety: {
    name: "Anxiety & Stress Relief",
    keywords: ["anxiety", "stress", "calm", "relaxation", "nervous system"],
    hubermanTopics: ["breathing techniques", "cold exposure", "NSDR", "vagal tone"],
  },
  sleep: {
    name: "Sleep Optimization",
    keywords: ["sleep", "insomnia", "rest", "circadian rhythm", "melatonin"],
    hubermanTopics: ["light exposure", "temperature", "sleep hygiene", "adenosine"],
  },
  morning: {
    name: "Morning Routines",
    keywords: ["morning", "routine", "productivity", "energy", "wake up"],
    hubermanTopics: ["cortisol awakening response", "sunlight", "dopamine"],
  },
  fitness: {
    name: "Physical Fitness",
    keywords: ["exercise", "fitness", "strength", "cardio", "workout"],
    hubermanTopics: ["zone 2 cardio", "resistance training", "recovery"],
  },
  nutrition: {
    name: "Nutrition & Diet",
    keywords: ["nutrition", "diet", "food", "eating", "fasting"],
    hubermanTopics: ["time-restricted eating", "gut health", "blood glucose"],
  },
  mindfulness: {
    name: "Mindfulness & Meditation",
    keywords: ["mindfulness", "meditation", "presence", "awareness"],
    hubermanTopics: ["interoception", "focus", "default mode network"],
  },
  productivity: {
    name: "Focus & Productivity",
    keywords: ["focus", "productivity", "concentration", "deep work"],
    hubermanTopics: ["dopamine", "ultradian rhythms", "task switching"],
  },
  relationships: {
    name: "Relationships & Communication",
    keywords: ["relationships", "communication", "connection", "empathy"],
    hubermanTopics: ["oxytocin", "attachment", "social bonding"],
  },
  founder: {
    name: "Founder's Journey",
    keywords: ["entrepreneur", "startup", "founder", "business", "journey"],
    hubermanTopics: ["stress resilience", "motivation", "goal setting"],
  },
  couples: {
    name: "Couples Wellness",
    keywords: ["couples", "marriage", "partnership", "together", "relationship"],
    hubermanTopics: ["attachment styles", "communication", "intimacy"],
  },
};

export const contentStudioRouter = router({
  // Generate content based on type and topic
  generateContent: protectedProcedure
    .input(z.object({
      type: ContentTypeSchema,
      topicId: z.string(),
      customPrompt: z.string().optional(),
      includePersonalStory: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const topic = WELLNESS_TOPICS[input.topicId as keyof typeof WELLNESS_TOPICS];
      if (!topic) {
        throw new Error("Invalid topic");
      }

      const systemPrompt = `You are an expert content creator for a wellness coaching platform called "Purposeful Live Coaching". 
You create engaging, evidence-based content that references research from Dr. Andrew Huberman, Peter Attia, and Matthew Walker.
Your content should be warm, authentic, and actionable.
The platform has an AI coach named "Sage" that users can try for free.`;

      let userPrompt = "";
      
      if (input.type === "youtube") {
        userPrompt = `Create a complete YouTube video script about "${topic.name}".

The video should be approximately 10 minutes long.

Include:
1. An attention-grabbing hook (first 30 seconds)
2. The problem/pain point (30 seconds - 2 minutes)
3. The science behind the solution, referencing Huberman Lab concepts like: ${topic.hubermanTopics.join(", ")}
4. A step-by-step protocol or method (the main content)
5. Common mistakes to avoid
6. A call to action mentioning Sage, the AI wellness coach

Format the script with timestamps like [INTRO - 0:00], [HOOK - 0:15], etc.

${input.customPrompt ? `Additional instructions: ${input.customPrompt}` : ""}
${input.includePersonalStory ? "Include a personal story section where the founder shares their experience." : ""}

Also provide:
- An SEO-optimized title (include the topic and a number or hook)
- A YouTube description with timestamps
- 10 relevant hashtags
- A thumbnail idea`;
      } else if (input.type === "podcast") {
        userPrompt = `Create a complete podcast episode script about "${topic.name}".

The episode should be approximately 30 minutes long.

Include:
1. An engaging intro (2 minutes)
2. Topic introduction and why it matters
3. Deep dive into the science, referencing: ${topic.hubermanTopics.join(", ")}
4. Practical applications and action items
5. Key takeaways summary
6. Outro with call to action for Purposeful Live Coaching

Format with timestamps and speaker cues.

${input.customPrompt ? `Additional instructions: ${input.customPrompt}` : ""}
${input.includePersonalStory ? "Include a couples discussion segment where the host and their partner share their experience." : ""}

Also provide:
- An engaging episode title
- Show notes with bullet points
- 5 key takeaways`;
      } else if (input.type === "shorts") {
        userPrompt = `Create 5 short-form video scripts (TikTok/Reels/Shorts) about "${topic.name}".

Each video should be 30-60 seconds.

For each video, provide:
1. A scroll-stopping hook (first 2 seconds)
2. The main content (one key insight)
3. A call to action

Reference concepts like: ${topic.hubermanTopics.join(", ")}

${input.customPrompt ? `Additional instructions: ${input.customPrompt}` : ""}

Make them punchy, engaging, and shareable. Include trending audio suggestions if relevant.`;
      } else if (input.type === "blog") {
        userPrompt = `Create a comprehensive blog post about "${topic.name}".

The post should be approximately 2000 words.

Include:
1. An SEO-optimized headline
2. An engaging introduction
3. Multiple sections with H2 headers
4. Scientific references to Huberman Lab concepts: ${topic.hubermanTopics.join(", ")}
5. Practical tips and action items
6. A conclusion with call to action

${input.customPrompt ? `Additional instructions: ${input.customPrompt}` : ""}

Also provide:
- Meta description (160 characters)
- 5 internal linking opportunities
- 10 SEO keywords to target`;
      }

      try {
        const content = await generateText({
          model: "gpt-4.1-mini",
          systemPrompt,
          userPrompt,
          temperature: 0.7,
          maxTokens: 4000,
        });

        // Calculate a mock SEO score
        const seoScore = Math.floor(Math.random() * 15) + 85;

        return {
          success: true,
          content,
          seoScore,
          topic: topic.name,
          type: input.type,
          generatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Content generation error:", error);
        throw new Error("Failed to generate content");
      }
    }),

  // Generate weekly content calendar
  generateWeeklyCalendar: protectedProcedure
    .input(z.object({
      focusTopics: z.array(z.string()).optional(),
      includeShorts: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      const systemPrompt = `You are a content strategist for a wellness coaching platform.
Create a weekly content calendar that balances different content types and topics.
The platform focuses on evidence-based wellness with an AI coach named Sage.`;

      const topics = input.focusTopics?.length 
        ? input.focusTopics.map(t => WELLNESS_TOPICS[t as keyof typeof WELLNESS_TOPICS]?.name).filter(Boolean)
        : Object.values(WELLNESS_TOPICS).map(t => t.name);

      const userPrompt = `Create a 7-day content calendar for a wellness YouTube channel and podcast.

Available topics: ${topics.join(", ")}

For each day, suggest:
- Content type (YouTube video, Podcast episode, or Shorts)
- Topic
- Title idea
- Brief description (1-2 sentences)

Schedule:
- Monday, Wednesday, Friday: YouTube videos (10 min each)
- Tuesday, Thursday: Podcast episodes (30 min each)
${input.includeShorts ? "- Every day: 2 short-form videos (60 sec each)" : ""}
- Weekend: Lighter content or behind-the-scenes

Format as a structured calendar with days and content details.`;

      try {
        const calendar = await generateText({
          model: "gpt-4.1-mini",
          systemPrompt,
          userPrompt,
          temperature: 0.7,
          maxTokens: 2000,
        });

        return {
          success: true,
          calendar,
          generatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Calendar generation error:", error);
        throw new Error("Failed to generate calendar");
      }
    }),

  // Extract content ideas from session transcript
  extractFromSession: protectedProcedure
    .input(z.object({
      transcript: z.string(),
      sessionType: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const systemPrompt = `You are a content strategist who identifies valuable moments in coaching sessions that could be turned into educational content.
Always ensure client privacy by anonymizing any personal details.`;

      const userPrompt = `Analyze this coaching session transcript and identify content opportunities:

${input.transcript}

For each opportunity, provide:
1. The key insight or breakthrough moment
2. A suggested content type (YouTube, Podcast, Short)
3. A title idea
4. How to present it while protecting client privacy
5. The universal lesson that would help others

Identify at least 3 content opportunities.`;

      try {
        const ideas = await generateText({
          model: "gpt-4.1-mini",
          systemPrompt,
          userPrompt,
          temperature: 0.7,
          maxTokens: 1500,
        });

        return {
          success: true,
          ideas,
          generatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Session extraction error:", error);
        throw new Error("Failed to extract content ideas");
      }
    }),

  // Get available topics
  getTopics: publicProcedure.query(() => {
    return Object.entries(WELLNESS_TOPICS).map(([id, topic]) => ({
      id,
      name: topic.name,
      keywords: topic.keywords,
    }));
  }),
});
