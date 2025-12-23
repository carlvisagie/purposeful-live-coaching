/**
 * YouTube Integration Service
 * 
 * Handles OAuth authentication and video uploads to YouTube
 * using the YouTube Data API v3
 * 
 * Setup Instructions:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable "YouTube Data API v3"
 * 4. Create OAuth 2.0 credentials (Web application)
 * 5. Add authorized redirect URI: https://your-domain.com/api/youtube/oauth/callback
 * 6. Set environment variables:
 *    - YOUTUBE_CLIENT_ID
 *    - YOUTUBE_CLIENT_SECRET
 *    - YOUTUBE_REDIRECT_URI
 *    - YOUTUBE_REFRESH_TOKEN (after first OAuth flow)
 */

import { google } from "googleapis";
import * as fs from "fs";

const youtube = google.youtube("v3");

// OAuth2 client - lazy initialization to avoid build-time errors
let oauth2Client: any = null;

function getOAuth2Client() {
  if (!oauth2Client) {
    oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI || "http://localhost:3000/api/youtube/oauth/callback"
    );
    
    // Set refresh token if available (for autonomous uploads)
    if (process.env.YOUTUBE_REFRESH_TOKEN) {
      oauth2Client.setCredentials({
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
      });
    }
  }
  return oauth2Client;
}

/**
 * Generate OAuth URL for initial authentication
 * User needs to visit this URL once to authorize the app
 */
export function getAuthUrl(): string {
  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
  ];

  return getOAuth2Client().generateAuthUrl({
    access_type: "offline", // Get refresh token
    scope: scopes,
    prompt: "consent", // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 * Call this with the code from OAuth callback
 */
export async function getTokensFromCode(code: string): Promise<any> {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  
  console.log("YouTube OAuth tokens obtained:");
  console.log("Refresh Token:", tokens.refresh_token);
  console.log("Save this refresh token to YOUTUBE_REFRESH_TOKEN environment variable");
  
  return tokens;
}

/**
 * Upload video to YouTube
 * 
 * @param videoPath - Local path to video file
 * @param metadata - Video metadata (title, description, tags, etc.)
 * @returns YouTube video URL
 */
export async function uploadVideoToYouTube(
  videoPath: string,
  metadata: {
    title: string;
    description: string;
    tags?: string[];
    category?: string;
    privacyStatus?: "public" | "private" | "unlisted";
  }
): Promise<string> {
  try {
    // Ensure we have valid credentials
    if (!process.env.YOUTUBE_REFRESH_TOKEN) {
      throw new Error(
        "YouTube refresh token not configured. Please complete OAuth flow first."
      );
    }

    // Map category name to category ID
    const categoryId = getCategoryId(metadata.category || "Education");

    // Upload video
    const response = await youtube.videos.insert({
      auth: getOAuth2Client(),
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags || [],
          categoryId,
        },
        status: {
          privacyStatus: metadata.privacyStatus || "public",
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    });

    const videoId = response.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    console.log(`✅ Video uploaded to YouTube: ${videoUrl}`);

    return videoUrl;
  } catch (error: any) {
    console.error("YouTube upload error:", error);
    
    if (error.message?.includes("quota")) {
      throw new Error(
        "YouTube API quota exceeded. Daily upload limit reached. Try again tomorrow."
      );
    }
    
    if (error.message?.includes("authentication")) {
      throw new Error(
        "YouTube authentication failed. Please re-authorize the application."
      );
    }
    
    throw new Error(`Failed to upload video to YouTube: ${error.message}`);
  }
}

/**
 * Get YouTube video status
 */
export async function getVideoStatus(videoId: string): Promise<any> {
  try {
    const response = await youtube.videos.list({
      auth: getOAuth2Client(),
      part: ["status", "processingDetails"],
      id: [videoId],
    });

    return response.data.items?.[0];
  } catch (error: any) {
    console.error("Failed to get video status:", error);
    throw new Error(`Failed to get video status: ${error.message}`);
  }
}

/**
 * Update video metadata
 */
export async function updateVideoMetadata(
  videoId: string,
  metadata: {
    title?: string;
    description?: string;
    tags?: string[];
  }
): Promise<void> {
  try {
    await youtube.videos.update({
      auth: getOAuth2Client(),
      part: ["snippet"],
      requestBody: {
        id: videoId,
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
        },
      },
    });

    console.log(`✅ Video metadata updated for ${videoId}`);
  } catch (error: any) {
    console.error("Failed to update video metadata:", error);
    throw new Error(`Failed to update video metadata: ${error.message}`);
  }
}

/**
 * Delete video from YouTube
 */
export async function deleteVideo(videoId: string): Promise<void> {
  try {
    await youtube.videos.delete({
      auth: getOAuth2Client(),
      id: videoId,
    });

    console.log(`✅ Video deleted from YouTube: ${videoId}`);
  } catch (error: any) {
    console.error("Failed to delete video:", error);
    throw new Error(`Failed to delete video: ${error.message}`);
  }
}

/**
 * Map category name to YouTube category ID
 * https://developers.google.com/youtube/v3/docs/videoCategories/list
 */
function getCategoryId(categoryName: string): string {
  const categories: Record<string, string> = {
    "Film & Animation": "1",
    "Autos & Vehicles": "2",
    "Music": "10",
    "Pets & Animals": "15",
    "Sports": "17",
    "Short Movies": "18",
    "Travel & Events": "19",
    "Gaming": "20",
    "Videoblogging": "21",
    "People & Blogs": "22",
    "Comedy": "23",
    "Entertainment": "24",
    "News & Politics": "25",
    "Howto & Style": "26",
    "Education": "27",
    "Science & Technology": "28",
    "Nonprofits & Activism": "29",
  };

  return categories[categoryName] || categories["Education"];
}

/**
 * Get channel information
 */
export async function getChannelInfo(): Promise<any> {
  try {
    const response = await youtube.channels.list({
      auth: getOAuth2Client(),
      part: ["snippet", "statistics"],
      mine: true,
    });

    return response.data.items?.[0];
  } catch (error: any) {
    console.error("Failed to get channel info:", error);
    throw new Error(`Failed to get channel info: ${error.message}`);
  }
}

/**
 * List recent uploads
 */
export async function listRecentUploads(maxResults: number = 10): Promise<any[]> {
  try {
    const response = await youtube.search.list({
      auth: getOAuth2Client(),
      part: ["snippet"],
      forMine: true,
      type: ["video"],
      order: "date",
      maxResults,
    });

    return response.data.items || [];
  } catch (error: any) {
    console.error("Failed to list uploads:", error);
    throw new Error(`Failed to list uploads: ${error.message}`);
  }
}
