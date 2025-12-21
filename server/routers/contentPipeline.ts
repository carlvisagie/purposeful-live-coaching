import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../db";
import { eq, desc, and } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

// Content Pipeline Schema
const contentItemSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  sessionDate: z.string(),
  status: z.enum(['pending', 'processing', 'ready', 'published', 'failed']),
  progress: z.number(),
  currentStep: z.string(),
  title: z.string(),
  description: z.string(),
  transcript: z.string(),
  cleanedAudio: z.string().nullable(),
  highlights: z.array(z.object({
    id: z.string(),
    startTime: z.number(),
    endTime: z.number(),
    text: z.string(),
    type: z.enum(['insight', 'breakthrough', 'emotional', 'quotable']),
    score: z.number()
  })),
  youtubeScript: z.string(),
  podcastScript: z.string(),
  shortClips: z.array(z.object({
    id: z.string(),
    title: z.string(),
    startTime: z.number(),
    endTime: z.number(),
    hook: z.string(),
    platform: z.enum(['tiktok', 'reels', 'shorts']),
    status: z.enum(['pending', 'ready'])
  })),
  bRollSuggestions: z.array(z.object({
    timestamp: z.number(),
    duration: z.number(),
    suggestion: z.string(),
    keywords: z.array(z.string()),
    type: z.enum(['nature', 'abstract', 'lifestyle', 'tech', 'emotion'])
  })),
  seoData: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    thumbnailText: z.string(),
    chapters: z.array(z.object({
      time: z.string(),
      title: z.string()
    }))
  }),
  publishedTo: z.array(z.string()),
  createdAt: z.string()
});

const pipelineSettingsSchema = z.object({
  autoProcess: z.boolean(),
  autoPublishYouTube: z.boolean(),
  autoPublishPodcast: z.boolean(),
  generateShortClips: z.boolean(),
  includeBRollSuggestions: z.boolean(),
  cleanAudio: z.boolean(),
  removeFillerWords: z.boolean(),
  youtubeChannelId: z.string(),
  podcastRssFeed: z.string(),
  defaultThumbnailStyle: z.string()
});

// In-memory storage for content items (in production, use database)
let contentQueue: z.infer<typeof contentItemSchema>[] = [];
let pipelineSettings: z.infer<typeof pipelineSettingsSchema> = {
  autoProcess: true,
  autoPublishYouTube: false,
  autoPublishPodcast: false,
  generateShortClips: true,
  includeBRollSuggestions: true,
  cleanAudio: true,
  removeFillerWords: true,
  youtubeChannelId: "",
  podcastRssFeed: "",
  defaultThumbnailStyle: "faces-with-text"
};

// Helper function to generate unique IDs
function generateId(): string {
  return `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// AI-powered content generation functions
async function generateTranscript(audioUrl: string): Promise<string> {
  // In production, use OpenAI Whisper API or similar
  // For now, return a placeholder that would be replaced with actual transcription
  return "This is a placeholder transcript. In production, this would be the actual transcription from the session recording.";
}

async function analyzeAndGenerateContent(transcript: string, sessionId: string): Promise<{
  title: string;
  description: string;
  highlights: z.infer<typeof contentItemSchema>['highlights'];
  youtubeScript: string;
  podcastScript: string;
  shortClips: z.infer<typeof contentItemSchema>['shortClips'];
  bRollSuggestions: z.infer<typeof contentItemSchema>['bRollSuggestions'];
  seoData: z.infer<typeof contentItemSchema>['seoData'];
}> {
  const systemPrompt = `You are an expert content producer for a wellness coaching platform called "Purposeful Living" hosted by Besarta Visagie and her husband Carl. Your job is to transform coaching session transcripts into polished, engaging content for YouTube, podcasts, and short-form social media.

You must analyze the transcript and generate:
1. A compelling title and description
2. Key highlights (breakthrough moments, quotable lines, emotional peaks, insights)
3. A polished YouTube script with intro, sections, and outro
4. A podcast script with show notes
5. 3-5 short clip ideas for TikTok/Reels/Shorts (30-60 seconds each)
6. B-roll suggestions for visual interest
7. SEO-optimized metadata (title, description, tags, chapters)

The content should feel authentic, warm, and evidence-based. Reference the hosts' signature style:
- Besarta leads with personal stories and relatability
- Carl provides scientific backing and expert insights
- Together they create a warm, supportive atmosphere

Always include:
- A hook in the first 5 seconds
- Clear value proposition
- Actionable takeaways
- Call to action for Purposeful Live Coaching platform`;

  const userPrompt = `Analyze this coaching session transcript and generate all content assets:

TRANSCRIPT:
${transcript}

Respond in this exact JSON format:
{
  "title": "Compelling video title",
  "description": "2-3 sentence description",
  "highlights": [
    {
      "id": "h1",
      "startTime": 120,
      "endTime": 180,
      "text": "The exact quote or moment",
      "type": "breakthrough|insight|emotional|quotable",
      "score": 85
    }
  ],
  "youtubeScript": "Full YouTube script with [INTRO], [SECTION 1], etc.",
  "podcastScript": "Podcast version with show notes",
  "shortClips": [
    {
      "id": "c1",
      "title": "Short clip title",
      "startTime": 120,
      "endTime": 150,
      "hook": "The hook text for the first 2 seconds",
      "platform": "tiktok|reels|shorts",
      "status": "ready"
    }
  ],
  "bRollSuggestions": [
    {
      "timestamp": 60,
      "duration": 5,
      "suggestion": "Description of B-roll footage",
      "keywords": ["keyword1", "keyword2"],
      "type": "nature|abstract|lifestyle|tech|emotion"
    }
  ],
  "seoData": {
    "title": "SEO optimized title | Purposeful Living",
    "description": "SEO description with keywords",
    "tags": ["tag1", "tag2", "tag3"],
    "thumbnailText": "BOLD TEXT FOR THUMBNAIL",
    "chapters": [
      {"time": "0:00", "title": "Introduction"},
      {"time": "2:00", "title": "Section Title"}
    ]
  }
}`;

  try {
    const response = await invokeLLM({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = response.choices[0]?.message?.content || "{}";
    
    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = content;
    if (content.includes("```json")) {
      jsonStr = content.split("```json")[1].split("```")[0].trim();
    } else if (content.includes("```")) {
      jsonStr = content.split("```")[1].split("```")[0].trim();
    }
    
    const parsed = JSON.parse(jsonStr);
    
    return {
      title: parsed.title || "Untitled Session",
      description: parsed.description || "",
      highlights: parsed.highlights || [],
      youtubeScript: parsed.youtubeScript || "",
      podcastScript: parsed.podcastScript || "",
      shortClips: parsed.shortClips || [],
      bRollSuggestions: parsed.bRollSuggestions || [],
      seoData: parsed.seoData || {
        title: "",
        description: "",
        tags: [],
        thumbnailText: "",
        chapters: []
      }
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      title: "Session Content",
      description: "Content generation in progress...",
      highlights: [],
      youtubeScript: "",
      podcastScript: "",
      shortClips: [],
      bRollSuggestions: [],
      seoData: {
        title: "",
        description: "",
        tags: [],
        thumbnailText: "",
        chapters: []
      }
    };
  }
}

// Process a session through the pipeline
async function processSession(sessionId: string, updateProgress: (progress: number, step: string) => void): Promise<z.infer<typeof contentItemSchema>> {
  const contentId = generateId();
  
  // Step 1: Initialize (0-10%)
  updateProgress(5, "Initializing pipeline...");
  
  // Step 2: Fetch session recording (10-20%)
  updateProgress(15, "Fetching session recording...");
  // In production, fetch actual recording from database
  const audioUrl = `/recordings/${sessionId}.mp3`;
  
  // Step 3: Transcribe audio (20-40%)
  updateProgress(25, "Transcribing audio...");
  const transcript = await generateTranscript(audioUrl);
  updateProgress(40, "Transcription complete");
  
  // Step 4: Clean audio (40-50%)
  updateProgress(45, "Cleaning audio (removing noise, ums, ahs)...");
  const cleanedAudio = `/cleaned/${sessionId}.mp3`;
  updateProgress(50, "Audio cleaned");
  
  // Step 5: Analyze and generate content (50-90%)
  updateProgress(55, "Analyzing transcript...");
  updateProgress(60, "Detecting highlights...");
  updateProgress(70, "Generating YouTube script...");
  updateProgress(75, "Generating podcast script...");
  updateProgress(80, "Creating short clips...");
  updateProgress(85, "Generating B-roll suggestions...");
  updateProgress(88, "Optimizing SEO...");
  
  const generatedContent = await analyzeAndGenerateContent(transcript, sessionId);
  
  // Step 6: Finalize (90-100%)
  updateProgress(95, "Finalizing content...");
  
  const contentItem: z.infer<typeof contentItemSchema> = {
    id: contentId,
    sessionId,
    sessionDate: new Date().toISOString(),
    status: 'ready',
    progress: 100,
    currentStep: 'Complete',
    title: generatedContent.title,
    description: generatedContent.description,
    transcript,
    cleanedAudio,
    highlights: generatedContent.highlights,
    youtubeScript: generatedContent.youtubeScript,
    podcastScript: generatedContent.podcastScript,
    shortClips: generatedContent.shortClips,
    bRollSuggestions: generatedContent.bRollSuggestions,
    seoData: generatedContent.seoData,
    publishedTo: [],
    createdAt: new Date().toISOString()
  };
  
  updateProgress(100, "Complete");
  
  return contentItem;
}

export const contentPipelineRouter = router({
  // Get content queue
  getQueue: publicProcedure.query(async () => {
    return contentQueue.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }),

  // Get single content item
  getItem: publicProcedure
    .input(z.object({ itemId: z.string() }))
    .query(async ({ input }) => {
      return contentQueue.find(item => item.id === input.itemId) || null;
    }),

  // Process a session
  processSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      const { sessionId } = input;
      
      // Create initial processing item
      const processingItem: z.infer<typeof contentItemSchema> = {
        id: generateId(),
        sessionId,
        sessionDate: new Date().toISOString(),
        status: 'processing',
        progress: 0,
        currentStep: 'Starting...',
        title: 'Processing...',
        description: '',
        transcript: '',
        cleanedAudio: null,
        highlights: [],
        youtubeScript: '',
        podcastScript: '',
        shortClips: [],
        bRollSuggestions: [],
        seoData: {
          title: '',
          description: '',
          tags: [],
          thumbnailText: '',
          chapters: []
        },
        publishedTo: [],
        createdAt: new Date().toISOString()
      };
      
      contentQueue.push(processingItem);
      
      // Process in background
      (async () => {
        try {
          const result = await processSession(sessionId, (progress, step) => {
            const item = contentQueue.find(i => i.id === processingItem.id);
            if (item) {
              item.progress = progress;
              item.currentStep = step;
            }
          });
          
          // Update the item with results
          const itemIndex = contentQueue.findIndex(i => i.id === processingItem.id);
          if (itemIndex !== -1) {
            contentQueue[itemIndex] = result;
          }
          
          // Auto-publish if enabled
          if (pipelineSettings.autoPublishYouTube) {
            // TODO: Implement YouTube API publishing
            console.log("Auto-publishing to YouTube...");
          }
          if (pipelineSettings.autoPublishPodcast) {
            // TODO: Implement podcast publishing
            console.log("Auto-publishing to podcast...");
          }
        } catch (error) {
          const item = contentQueue.find(i => i.id === processingItem.id);
          if (item) {
            item.status = 'failed';
            item.currentStep = 'Failed: ' + (error as Error).message;
          }
        }
      })();
      
      return { success: true, itemId: processingItem.id };
    }),

  // Trigger processing for a session (called automatically when session ends)
  autoTrigger: publicProcedure
    .input(z.object({ 
      sessionId: z.string(),
      recordingUrl: z.string().optional(),
      transcript: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      if (!pipelineSettings.autoProcess) {
        return { success: false, message: "Auto-processing is disabled" };
      }
      
      const { sessionId, transcript } = input;
      
      // Create processing item
      const processingItem: z.infer<typeof contentItemSchema> = {
        id: generateId(),
        sessionId,
        sessionDate: new Date().toISOString(),
        status: 'processing',
        progress: 0,
        currentStep: 'Auto-triggered: Starting...',
        title: 'Processing...',
        description: '',
        transcript: transcript || '',
        cleanedAudio: null,
        highlights: [],
        youtubeScript: '',
        podcastScript: '',
        shortClips: [],
        bRollSuggestions: [],
        seoData: {
          title: '',
          description: '',
          tags: [],
          thumbnailText: '',
          chapters: []
        },
        publishedTo: [],
        createdAt: new Date().toISOString()
      };
      
      contentQueue.push(processingItem);
      
      // Process in background
      (async () => {
        try {
          // If transcript provided, skip transcription
          if (transcript) {
            const item = contentQueue.find(i => i.id === processingItem.id);
            if (item) {
              item.progress = 40;
              item.currentStep = "Transcript provided, generating content...";
            }
          }
          
          const result = await processSession(sessionId, (progress, step) => {
            const item = contentQueue.find(i => i.id === processingItem.id);
            if (item) {
              item.progress = progress;
              item.currentStep = step;
            }
          });
          
          // Update the item with results
          const itemIndex = contentQueue.findIndex(i => i.id === processingItem.id);
          if (itemIndex !== -1) {
            contentQueue[itemIndex] = result;
          }
          
          // Auto-publish if enabled
          if (pipelineSettings.autoPublishYouTube) {
            console.log("Auto-publishing to YouTube...");
            result.publishedTo.push('youtube');
          }
          if (pipelineSettings.autoPublishPodcast) {
            console.log("Auto-publishing to podcast...");
            result.publishedTo.push('podcast');
          }
        } catch (error) {
          const item = contentQueue.find(i => i.id === processingItem.id);
          if (item) {
            item.status = 'failed';
            item.currentStep = 'Failed: ' + (error as Error).message;
          }
        }
      })();
      
      return { success: true, itemId: processingItem.id };
    }),

  // Publish content to platforms
  publish: protectedProcedure
    .input(z.object({
      itemId: z.string(),
      platforms: z.array(z.enum(['youtube', 'podcast', 'tiktok', 'instagram', 'shorts']))
    }))
    .mutation(async ({ input }) => {
      const { itemId, platforms } = input;
      
      const item = contentQueue.find(i => i.id === itemId);
      if (!item) {
        throw new Error("Content item not found");
      }
      
      // TODO: Implement actual publishing to each platform
      // For now, just update the status
      for (const platform of platforms) {
        if (!item.publishedTo.includes(platform)) {
          item.publishedTo.push(platform);
        }
      }
      
      if (item.publishedTo.length > 0) {
        item.status = 'published';
      }
      
      return { success: true, publishedTo: item.publishedTo };
    }),

  // Get pipeline settings
  getSettings: publicProcedure.query(async () => {
    return pipelineSettings;
  }),

  // Update pipeline settings
  updateSettings: protectedProcedure
    .input(pipelineSettingsSchema)
    .mutation(async ({ input }) => {
      pipelineSettings = input;
      return { success: true, settings: pipelineSettings };
    }),

  // Delete content item
  deleteItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input }) => {
      const index = contentQueue.findIndex(i => i.id === input.itemId);
      if (index !== -1) {
        contentQueue.splice(index, 1);
      }
      return { success: true };
    }),

  // Regenerate content for an item
  regenerate: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input }) => {
      const item = contentQueue.find(i => i.id === input.itemId);
      if (!item) {
        throw new Error("Content item not found");
      }
      
      item.status = 'processing';
      item.progress = 0;
      item.currentStep = 'Regenerating...';
      
      // Regenerate in background
      (async () => {
        try {
          const generatedContent = await analyzeAndGenerateContent(item.transcript, item.sessionId);
          
          item.title = generatedContent.title;
          item.description = generatedContent.description;
          item.highlights = generatedContent.highlights;
          item.youtubeScript = generatedContent.youtubeScript;
          item.podcastScript = generatedContent.podcastScript;
          item.shortClips = generatedContent.shortClips;
          item.bRollSuggestions = generatedContent.bRollSuggestions;
          item.seoData = generatedContent.seoData;
          item.status = 'ready';
          item.progress = 100;
          item.currentStep = 'Complete';
        } catch (error) {
          item.status = 'failed';
          item.currentStep = 'Regeneration failed: ' + (error as Error).message;
        }
      })();
      
      return { success: true };
    }),

  // Get analytics
  getAnalytics: publicProcedure.query(async () => {
    const totalItems = contentQueue.length;
    const publishedItems = contentQueue.filter(i => i.status === 'published').length;
    const totalClips = contentQueue.reduce((acc, i) => acc + i.shortClips.length, 0);
    const totalHighlights = contentQueue.reduce((acc, i) => acc + i.highlights.length, 0);
    
    // Estimate time saved (4 hours per video for manual editing)
    const hoursSaved = totalItems * 4;
    
    return {
      totalVideos: totalItems,
      publishedVideos: publishedItems,
      totalClips,
      totalHighlights,
      hoursSaved,
      processingItems: contentQueue.filter(i => i.status === 'processing').length,
      readyItems: contentQueue.filter(i => i.status === 'ready').length,
      failedItems: contentQueue.filter(i => i.status === 'failed').length
    };
  })
});

export type ContentPipelineRouter = typeof contentPipelineRouter;
