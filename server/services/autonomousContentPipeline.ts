/**
 * Autonomous Content Pipeline
 * 
 * Fully automated system that processes coaching session recordings
 * and publishes them to YouTube and Podcast platforms with ZERO human interaction.
 * 
 * Pipeline Flow:
 * 1. Session recording saved to S3 → Trigger pipeline
 * 2. Auto-transcribe video using Whisper API
 * 3. Extract audio from video
 * 4. Generate YouTube metadata (AI)
 * 5. Generate Podcast show notes (AI)
 * 6. Upload video to YouTube
 * 7. Upload audio to Podcast host
 * 8. Update RSS feed
 * 9. Notify coach: "Your content is live!"
 */

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@db";
import { sessions } from "@db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { Readable } from "stream";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "purposeful-coaching-sessions";

interface PipelineResult {
  success: boolean;
  sessionId: number;
  transcript?: string;
  audioUrl?: string;
  youtubeMetadata?: any;
  podcastShowNotes?: any;
  youtubeUrl?: string;
  podcastUrl?: string;
  error?: string;
}

/**
 * Main autonomous pipeline orchestrator
 * Triggered automatically when a session recording is saved
 */
export async function processSessionRecording(sessionId: number): Promise<PipelineResult> {
  console.log(`[Autonomous Pipeline] Starting for session ${sessionId}`);
  
  try {
    // Step 1: Get session data
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.id, sessionId),
    });

    if (!session || !session.videoUrl) {
      throw new Error("Session or video not found");
    }

    console.log(`[Step 1/9] Session loaded: ${session.videoUrl}`);

    // Step 2: Download video from S3 to temp file
    const videoPath = await downloadVideoFromS3(session.videoUrl);
    console.log(`[Step 2/9] Video downloaded: ${videoPath}`);

    // Step 3: Auto-transcribe video
    const transcript = await transcribeVideo(videoPath);
    console.log(`[Step 3/9] Transcription complete: ${transcript.length} characters`);

    // Step 4: Extract audio from video
    const audioPath = await extractAudio(videoPath);
    console.log(`[Step 4/9] Audio extracted: ${audioPath}`);

    // Step 5: Upload audio to S3
    const audioUrl = await uploadAudioToS3(audioPath, sessionId);
    console.log(`[Step 5/9] Audio uploaded: ${audioUrl}`);

    // Step 6: Generate YouTube metadata
    const youtubeMetadata = await generateYouTubeMetadata(transcript, session.videoDuration || 0);
    console.log(`[Step 6/9] YouTube metadata generated`);

    // Step 7: Generate Podcast show notes
    const podcastShowNotes = await generatePodcastShowNotes(transcript, session.videoDuration || 0);
    console.log(`[Step 7/9] Podcast show notes generated`);

    // Step 8: Upload to YouTube (if configured)
    let youtubeUrl: string | undefined;
    if (process.env.YOUTUBE_ENABLED === "true") {
      youtubeUrl = await uploadToYouTube(videoPath, youtubeMetadata);
      console.log(`[Step 8/9] Uploaded to YouTube: ${youtubeUrl}`);
    } else {
      console.log(`[Step 8/9] YouTube upload skipped (not configured)`);
    }

    // Step 9: Upload to Podcast (if configured)
    let podcastUrl: string | undefined;
    if (process.env.PODCAST_ENABLED === "true") {
      podcastUrl = await uploadToPodcast(audioPath, podcastShowNotes);
      console.log(`[Step 9/9] Uploaded to Podcast: ${podcastUrl}`);
    } else {
      console.log(`[Step 9/9] Podcast upload skipped (not configured)`);
    }

    // Update session in database with all generated content
    await db.update(sessions).set({
      notes: transcript,
      // Store metadata in notes field for now (TODO: add dedicated fields)
      updatedAt: new Date(),
    }).where(eq(sessions.id, sessionId));

    // Cleanup temp files
    await cleanupTempFiles([videoPath, audioPath]);

    console.log(`[Autonomous Pipeline] ✅ Complete for session ${sessionId}`);

    return {
      success: true,
      sessionId,
      transcript,
      audioUrl,
      youtubeMetadata,
      podcastShowNotes,
      youtubeUrl,
      podcastUrl,
    };
  } catch (error: any) {
    console.error(`[Autonomous Pipeline] ❌ Error for session ${sessionId}:`, error);
    return {
      success: false,
      sessionId,
      error: error.message,
    };
  }
}

/**
 * Download video from S3 to local temp file
 */
async function downloadVideoFromS3(videoUrl: string): Promise<string> {
  const url = new URL(videoUrl);
  const key = url.pathname.substring(1); // Remove leading slash

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);
  
  if (!response.Body) {
    throw new Error("No video data received from S3");
  }

  // Save to temp file
  const tempPath = path.join(os.tmpdir(), `session-${Date.now()}.webm`);
  const writeStream = fs.createWriteStream(tempPath);
  
  // Convert response body to readable stream
  const readableStream = response.Body as Readable;
  
  await new Promise((resolve, reject) => {
    readableStream.pipe(writeStream);
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  return tempPath;
}

/**
 * Transcribe video using OpenAI Whisper API
 */
async function transcribeVideo(videoPath: string): Promise<string> {
  try {
    // OpenAI Whisper API requires file size < 25MB
    // For larger files, we'll need to split or use audio-only
    const stats = fs.statSync(videoPath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB > 25) {
      console.log(`Video is ${fileSizeMB.toFixed(2)}MB, extracting audio first...`);
      const audioPath = await extractAudio(videoPath);
      const audioStats = fs.statSync(audioPath);
      const audioSizeMB = audioStats.size / (1024 * 1024);
      
      if (audioSizeMB > 25) {
        throw new Error(`Audio file too large for Whisper API: ${audioSizeMB.toFixed(2)}MB`);
      }

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: "whisper-1",
        language: "en",
      });

      // Cleanup temp audio file
      fs.unlinkSync(audioPath);

      return transcription.text;
    }

    // File is small enough, transcribe directly
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(videoPath),
      model: "whisper-1",
      language: "en",
    });

    return transcription.text;
  } catch (error: any) {
    console.error("Transcription error:", error);
    throw new Error(`Failed to transcribe video: ${error.message}`);
  }
}

/**
 * Extract audio from video using ffmpeg
 */
async function extractAudio(videoPath: string): Promise<string> {
  const audioPath = videoPath.replace(/\.(webm|mp4)$/, ".mp3");

  try {
    // Use ffmpeg to extract audio
    await execAsync(`ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${audioPath}"`);
    return audioPath;
  } catch (error: any) {
    console.error("Audio extraction error:", error);
    throw new Error(`Failed to extract audio: ${error.message}`);
  }
}

/**
 * Upload audio file to S3
 */
async function uploadAudioToS3(audioPath: string, sessionId: number): Promise<string> {
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");
  const audioBuffer = fs.readFileSync(audioPath);
  const fileName = `sessions/${sessionId}/audio-${Date.now()}.mp3`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: audioBuffer,
    ContentType: "audio/mpeg",
  });

  await s3Client.send(command);

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
}

/**
 * Generate YouTube metadata using AI
 */
async function generateYouTubeMetadata(transcript: string, duration: number): Promise<any> {
  const systemPrompt = `You are a YouTube content strategist specializing in wellness and personal development content.
Your job is to create compelling, SEO-optimized metadata that will help videos rank well and attract viewers.
Always maintain client privacy - never mention specific names or identifying details.`;

  const userPrompt = `Create YouTube metadata for this coaching session:

Session Duration: ${Math.floor(duration / 60)} minutes
Transcript:
${transcript.substring(0, 3000)}... [truncated]

Generate:

1. TITLE (60 characters max, compelling and SEO-friendly)
2. DESCRIPTION (detailed, 3-5 paragraphs with timestamps if relevant)
3. TAGS (15-20 relevant tags, comma-separated)
4. THUMBNAIL TEXT SUGGESTION (3-5 words, attention-grabbing)
5. CATEGORY (choose one: Education, Howto & Style, People & Blogs)

Format your response as JSON:
{
  "title": "...",
  "description": "...",
  "tags": ["tag1", "tag2", ...],
  "thumbnailText": "...",
  "category": "..."
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error("Failed to parse YouTube metadata");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Generate Podcast show notes using AI
 */
async function generatePodcastShowNotes(transcript: string, duration: number): Promise<any> {
  const systemPrompt = `You are a podcast producer specializing in wellness and personal development content.
Your job is to create engaging show notes that provide value to listeners and improve discoverability.
Always maintain client privacy - never mention specific names or identifying details.`;

  const userPrompt = `Create podcast show notes for this coaching session:

Episode Duration: ${Math.floor(duration / 60)} minutes
Transcript:
${transcript.substring(0, 3000)}... [truncated]

Generate:

1. EPISODE TITLE (compelling and descriptive)
2. SHORT DESCRIPTION (1-2 sentences, for podcast directories)
3. FULL SHOW NOTES (structured with sections, timestamps, key takeaways)
4. KEY TOPICS (5-7 main topics covered)
5. RESOURCES MENTIONED (any tools, techniques, or concepts to link)

Format your response as JSON:
{
  "title": "...",
  "shortDescription": "...",
  "showNotes": "...",
  "keyTopics": ["topic1", "topic2", ...],
  "resources": ["resource1", "resource2", ...]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content || "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error("Failed to parse podcast show notes");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Upload video to YouTube
 */
async function uploadToYouTube(videoPath: string, metadata: any): Promise<string> {
  try {
    // Import YouTube service
    const { uploadVideoToYouTube } = await import("./youtubeService");
    
    // Upload video
    const youtubeUrl = await uploadVideoToYouTube(videoPath, {
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      category: metadata.category,
      privacyStatus: "public", // or "unlisted" for testing
    });
    
    return youtubeUrl;
  } catch (error: any) {
    console.error("YouTube upload error:", error);
    throw error;
  }
}

/**
 * Upload audio to Podcast hosting platform
 */
async function uploadToPodcast(audioPath: string, showNotes: any): Promise<string> {
  try {
    // Import podcast service
    const { uploadPodcastEpisode } = await import("./podcastService");
    
    // Upload episode
    const result = await uploadPodcastEpisode({
      title: showNotes.title,
      description: showNotes.showNotes,
      audioPath,
      summary: showNotes.shortDescription,
      tags: showNotes.keyTopics,
      explicit: false,
    });
    
    return result.episodeUrl;
  } catch (error: any) {
    console.error("Podcast upload error:", error);
    throw error;
  }
}

/**
 * Cleanup temporary files
 */
async function cleanupTempFiles(filePaths: string[]): Promise<void> {
  for (const filePath of filePaths) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Failed to cleanup ${filePath}:`, error);
    }
  }
}
