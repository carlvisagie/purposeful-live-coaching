import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import OpenAI from "openai";
import SelfLearning from "../selfLearningIntegration";
import ProfileGuard from "../profileGuard";

const openai = new OpenAI();

/**
 * AI Sleep Stories - 10X Better Than Calm
 * 
 * What Calm has: Pre-recorded celebrity narrations, same story for everyone
 * What we have: AI-generated personalized stories that:
 * - Use the user's name and interests
 * - Reference their day (from Evening Review)
 * - Weave in therapeutic elements (progressive relaxation, breathing cues)
 * - Adapt tone based on their current mood
 * - Generate infinite unique stories
 */

// Story themes and settings
const STORY_THEMES = {
  nature: {
    name: "Nature Journey",
    settings: ["peaceful forest", "gentle stream", "mountain meadow", "ocean shore", "starlit garden"],
    elements: ["soft breeze", "rustling leaves", "flowing water", "birdsong", "moonlight"]
  },
  travel: {
    name: "Peaceful Travels",
    settings: ["train through countryside", "boat on calm lake", "hot air balloon", "cozy cabin", "lighthouse by the sea"],
    elements: ["gentle motion", "passing scenery", "warm sunlight", "distant horizons", "peaceful solitude"]
  },
  cozy: {
    name: "Cozy Comfort",
    settings: ["warm library", "rainy afternoon", "fireside evening", "snowy cottage", "sunlit reading nook"],
    elements: ["soft blankets", "warm drinks", "gentle rain", "crackling fire", "comfortable silence"]
  },
  fantasy: {
    name: "Gentle Fantasy",
    settings: ["enchanted garden", "cloud kingdom", "underwater palace", "floating islands", "aurora forest"],
    elements: ["soft magic", "gentle creatures", "glowing lights", "peaceful wonder", "timeless calm"]
  },
  space: {
    name: "Cosmic Peace",
    settings: ["drifting among stars", "peaceful nebula", "quiet moon base", "gentle orbit", "cosmic garden"],
    elements: ["infinite space", "soft starlight", "weightless peace", "distant galaxies", "eternal calm"]
  }
};

// Soundscape options to pair with stories
const SOUNDSCAPES = [
  { id: "rain", name: "Gentle Rain", description: "Soft rainfall on leaves" },
  { id: "ocean", name: "Ocean Waves", description: "Calm waves on a peaceful shore" },
  { id: "forest", name: "Forest Night", description: "Crickets and gentle breeze" },
  { id: "fire", name: "Crackling Fire", description: "Warm fireplace sounds" },
  { id: "stream", name: "Flowing Stream", description: "Peaceful water over stones" },
  { id: "wind", name: "Soft Wind", description: "Gentle breeze through trees" },
  { id: "birds", name: "Morning Birds", description: "Soft birdsong at dawn" },
  { id: "thunder", name: "Distant Thunder", description: "Far-off storm, safe inside" },
  { id: "snow", name: "Snowy Silence", description: "Peaceful winter quiet" },
  { id: "space", name: "Cosmic Hum", description: "Deep space ambience" }
];

// Voice options for narration
const NARRATOR_VOICES = [
  { id: "alloy", name: "Alloy", description: "Warm and soothing" },
  { id: "echo", name: "Echo", description: "Deep and calming" },
  { id: "fable", name: "Fable", description: "Gentle and storytelling" },
  { id: "onyx", name: "Onyx", description: "Rich and peaceful" },
  { id: "nova", name: "Nova", description: "Soft and dreamy" },
  { id: "shimmer", name: "Shimmer", description: "Light and tranquil" }
];

export const sleepStoriesRouter = router({
  // Get available themes, soundscapes, and voices
  getOptions: publicProcedure.query(() => {
    return {
      themes: Object.entries(STORY_THEMES).map(([id, theme]) => ({
        id,
        name: theme.name,
        settings: theme.settings
      })),
      soundscapes: SOUNDSCAPES,
      voices: NARRATOR_VOICES
    };
  }),

  // Generate a personalized sleep story
  generateStory: protectedProcedure
    .input(z.object({
      theme: z.enum(["nature", "travel", "cozy", "fantasy", "space"]).default("nature"),
      duration: z.enum(["short", "medium", "long"]).default("medium"), // 5, 15, 30 mins
      userName: z.string().optional(),
      includeBreathing: z.boolean().default(true),
      includeRelaxation: z.boolean().default(true),
      currentMood: z.string().optional(),
      dayHighlight: z.string().optional(), // From evening review
      personalInterests: z.array(z.string()).optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const theme = STORY_THEMES[input.theme];
      const setting = theme.settings[Math.floor(Math.random() * theme.settings.length)];
      const elements = theme.elements.slice(0, 3).join(", ");
      
      // Determine word count based on duration
      const wordCounts = { short: 800, medium: 2000, long: 4000 };
      const targetWords = wordCounts[input.duration];
      
      // ============================================================
      // PROFILE GUARD - MANDATORY PROFILE LOADING
      // ============================================================
      const clientContext = await ProfileGuard.getClientContext(ctx.user?.id, {
        moduleName: "sleep_stories",
        logAccess: true,
      });
      
      let userName = input.userName || clientContext?.name;
      let profilePersonalization = "";
      if (clientContext) {
        if (clientContext.mainChallenges.length > 0) {
          profilePersonalization += `They've been dealing with: ${clientContext.mainChallenges.join(", ")}. Subtly weave in themes of peace, release, and letting go of these concerns. `;
        }
        if (clientContext.triggers.length > 0) {
          profilePersonalization += `Avoid themes related to: ${clientContext.triggers.join(", ")}. `;
        }
      }
      
      // Build personalization context
      let personalization = profilePersonalization;
      if (userName) {
        personalization += `The listener's name is ${userName}. Occasionally address them by name in a warm, caring way. `;
      }
      if (input.currentMood) {
        personalization += `They are currently feeling ${input.currentMood}. Acknowledge this gently and guide them toward peace. `;
      }
      if (input.dayHighlight) {
        personalization += `Something meaningful from their day: "${input.dayHighlight}". You may weave a subtle reference to this into the story as a moment of reflection. `;
      }
      if (input.personalInterests?.length) {
        personalization += `They enjoy: ${input.personalInterests.join(", ")}. Include subtle references to these interests. `;
      }

      // Build therapeutic elements
      let therapeuticElements = "";
      if (input.includeBreathing) {
        therapeuticElements += `
Include 2-3 natural breathing cues woven into the narrative, like:
- "Take a deep breath of the fresh mountain air..."
- "Let your breath slow to match the gentle rhythm of the waves..."
- "Breathe in the peaceful silence, breathe out any remaining tension..."
`;
      }
      if (input.includeRelaxation) {
        therapeuticElements += `
Include progressive relaxation cues naturally in the story:
- "Your shoulders soften as you settle deeper into comfort..."
- "Feel the warmth spreading through your body, releasing any tightness..."
- "Your eyelids grow heavier with each passing moment..."
`;
      }

      const prompt = `You are a master sleep story narrator, creating deeply calming bedtime stories that help people drift into peaceful sleep.

Generate a sleep story with these specifications:

SETTING: ${setting}
ATMOSPHERE: ${elements}
LENGTH: Approximately ${targetWords} words

${personalization}

STORY REQUIREMENTS:
1. Begin with a gentle invitation to relax and settle in
2. Use present tense and second person ("you") to immerse the listener
3. Pace the story slowly with lots of sensory details
4. Use soft, calming language - avoid any tension, conflict, or excitement
5. Include natural pauses indicated by "..." for the narrator to slow down
6. The story should gradually become slower and more dreamlike
7. End with the listener drifting into peaceful sleep

${therapeuticElements}

TONE: Warm, gentle, soothing, like a caring friend helping you fall asleep

IMPORTANT: 
- No plot twists or excitement
- No scary or unsettling elements
- Focus on peace, comfort, safety, and gentle wonder
- Use repetitive, rhythmic language patterns
- Include lots of "..." for natural pauses

Generate the complete sleep story now:`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 6000
        });

        const story = completion.choices[0]?.message?.content || "";
        
        // Calculate estimated reading time (avg 150 words per minute for slow narration)
        const wordCount = story.split(/\s+/).length;
        const estimatedMinutes = Math.ceil(wordCount / 150);

        // Extract profile information from user preferences (background task)
        if (ctx.user?.id) {
          const profileContext = [
            input.currentMood ? `Current mood: ${input.currentMood}` : "",
            input.dayHighlight ? `Day highlight: ${input.dayHighlight}` : "",
            input.personalInterests?.length ? `Interests: ${input.personalInterests.join(", ")}` : "",
          ].filter(Boolean).join(". ");
          
          if (profileContext) {
            SelfLearning.extractAndUpdateClientProfile(ctx.user.id, profileContext, {
              moduleType: "sleep_stories",
              additionalContext: `User generated a ${theme.name} sleep story.`
            }).catch(e => console.error("[SleepStories] Profile extraction failed:", e));
          }
        }

        // Track successful story generation for self-learning
        SelfLearning.trackInteraction({
          moduleType: "sleep_stories",
          action: "story_generated",
          wasSuccessful: true,
          userChoice: input.theme,
          alternatives: Object.keys(STORY_THEMES),
          metadata: {
            themeName: theme.name,
            personalized: !!(input.userName || input.currentMood || input.dayHighlight),
            includesBreathing: input.includeBreathing,
            includesRelaxation: input.includeRelaxation,
            wordCount,
          },
        });

        return {
          success: true,
          story,
          metadata: {
            theme: input.theme,
            themeName: theme.name,
            setting,
            wordCount,
            estimatedMinutes,
            personalized: !!(input.userName || input.currentMood || input.dayHighlight),
            includesBreathing: input.includeBreathing,
            includesRelaxation: input.includeRelaxation
          }
        };
      } catch (error) {
        console.error("Error generating sleep story:", error);
        return {
          success: false,
          error: "Failed to generate story. Please try again.",
          story: "",
          metadata: null
        };
      }
    }),

  // Generate audio narration for a story
  generateNarration: protectedProcedure
    .input(z.object({
      story: z.string(),
      voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]).default("nova")
    }))
    .mutation(async ({ input }) => {
      try {
        // For long stories, we'd need to chunk this
        // OpenAI TTS has a 4096 character limit per request
        const maxChars = 4000;
        const chunks: string[] = [];
        
        // Split story into chunks at sentence boundaries
        let remaining = input.story;
        while (remaining.length > 0) {
          if (remaining.length <= maxChars) {
            chunks.push(remaining);
            break;
          }
          
          // Find last sentence boundary before maxChars
          let splitIndex = remaining.lastIndexOf(". ", maxChars);
          if (splitIndex === -1) splitIndex = remaining.lastIndexOf("... ", maxChars);
          if (splitIndex === -1) splitIndex = maxChars;
          
          chunks.push(remaining.substring(0, splitIndex + 1));
          remaining = remaining.substring(splitIndex + 1).trim();
        }

        // Generate audio for first chunk (in production, would process all chunks)
        const mp3 = await openai.audio.speech.create({
          model: "tts-1-hd",
          voice: input.voice,
          input: chunks[0],
          speed: 0.9 // Slightly slower for sleep stories
        });

        // Convert to base64 for client
        const buffer = Buffer.from(await mp3.arrayBuffer());
        const base64Audio = buffer.toString("base64");

        return {
          success: true,
          audioBase64: base64Audio,
          totalChunks: chunks.length,
          processedChunk: 1,
          voice: input.voice
        };
      } catch (error) {
        console.error("Error generating narration:", error);
        return {
          success: false,
          error: "Failed to generate audio. Please try again.",
          audioBase64: null
        };
      }
    }),

  // Get curated story library (pre-generated popular stories)
  getLibrary: publicProcedure.query(() => {
    return {
      featured: [
        {
          id: "peaceful-forest-1",
          title: "The Peaceful Forest Path",
          theme: "nature",
          duration: "medium",
          description: "A gentle walk through an ancient, peaceful forest",
          narrator: "nova"
        },
        {
          id: "train-journey-1",
          title: "The Night Train to Dreamland",
          theme: "travel",
          duration: "long",
          description: "A soothing journey on a train through moonlit countryside",
          narrator: "onyx"
        },
        {
          id: "cozy-cabin-1",
          title: "The Cozy Mountain Cabin",
          theme: "cozy",
          duration: "medium",
          description: "Settling into a warm cabin while snow falls outside",
          narrator: "fable"
        },
        {
          id: "starlight-garden-1",
          title: "The Starlight Garden",
          theme: "fantasy",
          duration: "short",
          description: "Wandering through a magical garden under the stars",
          narrator: "shimmer"
        },
        {
          id: "cosmic-drift-1",
          title: "Drifting Among Stars",
          theme: "space",
          duration: "medium",
          description: "Floating peacefully through the gentle cosmos",
          narrator: "echo"
        }
      ],
      categories: [
        { id: "nature", name: "Nature", count: 12 },
        { id: "travel", name: "Peaceful Travels", count: 8 },
        { id: "cozy", name: "Cozy Comfort", count: 10 },
        { id: "fantasy", name: "Gentle Fantasy", count: 6 },
        { id: "space", name: "Cosmic Peace", count: 5 }
      ]
    };
  }),

  // Save a generated story to user's favorites
  saveToFavorites: protectedProcedure
    .input(z.object({
      title: z.string(),
      story: z.string(),
      theme: z.string(),
      metadata: z.any()
    }))
    .mutation(async ({ input, ctx }) => {
      // In production, save to database
      return {
        success: true,
        message: "Story saved to favorites"
      };
    })
});

export type SleepStoriesRouter = typeof sleepStoriesRouter;
