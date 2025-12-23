/**
 * Podcast Hosting Integration Service
 * 
 * Supports multiple podcast hosting platforms:
 * - Buzzsprout (recommended - best API)
 * - Anchor/Spotify for Podcasters
 * - Libsyn
 * 
 * Setup Instructions for Buzzsprout:
 * 1. Go to https://www.buzzsprout.com/
 * 2. Create account and podcast
 * 3. Go to Settings → API
 * 4. Generate API token
 * 5. Set environment variables:
 *    - PODCAST_PLATFORM=buzzsprout
 *    - BUZZSPROUT_API_TOKEN=your_token
 *    - BUZZSPROUT_PODCAST_ID=your_podcast_id
 */

import axios from "axios";
import * as fs from "fs";
import FormData from "form-data";

interface PodcastEpisode {
  title: string;
  description: string;
  audioPath: string;
  summary?: string;
  tags?: string[];
  episodeNumber?: number;
  seasonNumber?: number;
  publishDate?: Date;
  explicit?: boolean;
}

interface UploadResult {
  episodeId: string;
  episodeUrl: string;
  audioUrl: string;
  publishDate: string;
}

/**
 * Upload episode to Buzzsprout
 */
async function uploadToBuzzsprout(episode: PodcastEpisode): Promise<UploadResult> {
  const apiToken = process.env.BUZZSPROUT_API_TOKEN;
  const podcastId = process.env.BUZZSPROUT_PODCAST_ID;

  if (!apiToken || !podcastId) {
    throw new Error(
      "Buzzsprout not configured. Set BUZZSPROUT_API_TOKEN and BUZZSPROUT_PODCAST_ID."
    );
  }

  try {
    // Step 1: Get upload URL
    const uploadUrlResponse = await axios.post(
      `https://www.buzzsprout.com/api/${podcastId}/episodes/upload_url.json`,
      {},
      {
        headers: {
          Authorization: `Token token=${apiToken}`,
        },
      }
    );

    const uploadUrl = uploadUrlResponse.data.upload_url;
    const audioUrl = uploadUrlResponse.data.audio_url;

    // Step 2: Upload audio file to S3 (Buzzsprout provides pre-signed URL)
    const audioBuffer = fs.readFileSync(episode.audioPath);
    await axios.put(uploadUrl, audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

    console.log("✅ Audio uploaded to Buzzsprout S3");

    // Step 3: Create episode with metadata
    const episodeData = {
      title: episode.title,
      description: episode.description,
      summary: episode.summary || episode.description.substring(0, 255),
      audio_url: audioUrl,
      tags: episode.tags?.join(","),
      episode_number: episode.episodeNumber,
      season_number: episode.seasonNumber,
      published_at: episode.publishDate?.toISOString(),
      explicit: episode.explicit || false,
      private: false, // Set to true for draft episodes
    };

    const createResponse = await axios.post(
      `https://www.buzzsprout.com/api/${podcastId}/episodes.json`,
      episodeData,
      {
        headers: {
          Authorization: `Token token=${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const episodeId = createResponse.data.id;
    const episodeUrl = `https://www.buzzsprout.com/${podcastId}/episodes/${episodeId}`;

    console.log(`✅ Episode published to Buzzsprout: ${episodeUrl}`);

    return {
      episodeId: episodeId.toString(),
      episodeUrl,
      audioUrl: createResponse.data.audio_url,
      publishDate: createResponse.data.published_at,
    };
  } catch (error: any) {
    console.error("Buzzsprout upload error:", error.response?.data || error.message);
    throw new Error(`Failed to upload to Buzzsprout: ${error.message}`);
  }
}

/**
 * Upload episode to Anchor/Spotify for Podcasters
 * Note: Anchor doesn't have a public API, so this uses web automation
 */
async function uploadToAnchor(episode: PodcastEpisode): Promise<UploadResult> {
  // Anchor doesn't have a public API
  // Options:
  // 1. Use RSS feed upload (Anchor can import from RSS)
  // 2. Use web automation (Puppeteer/Playwright)
  // 3. Use Spotify for Podcasters API (if available)
  
  throw new Error(
    "Anchor/Spotify for Podcasters upload not yet implemented. Use Buzzsprout instead."
  );
}

/**
 * Upload episode to Libsyn
 */
async function uploadToLibsyn(episode: PodcastEpisode): Promise<UploadResult> {
  const apiKey = process.env.LIBSYN_API_KEY;
  const showId = process.env.LIBSYN_SHOW_ID;

  if (!apiKey || !showId) {
    throw new Error("Libsyn not configured. Set LIBSYN_API_KEY and LIBSYN_SHOW_ID.");
  }

  try {
    // Libsyn API uses FTP upload for audio files
    // This is more complex and requires FTP client
    
    throw new Error("Libsyn upload not yet implemented. Use Buzzsprout instead.");
  } catch (error: any) {
    console.error("Libsyn upload error:", error);
    throw new Error(`Failed to upload to Libsyn: ${error.message}`);
  }
}

/**
 * Main upload function - routes to appropriate platform
 */
export async function uploadPodcastEpisode(episode: PodcastEpisode): Promise<UploadResult> {
  const platform = process.env.PODCAST_PLATFORM || "buzzsprout";

  console.log(`📻 Uploading podcast episode to ${platform}...`);

  switch (platform.toLowerCase()) {
    case "buzzsprout":
      return await uploadToBuzzsprout(episode);
    
    case "anchor":
    case "spotify":
      return await uploadToAnchor(episode);
    
    case "libsyn":
      return await uploadToLibsyn(episode);
    
    default:
      throw new Error(
        `Unsupported podcast platform: ${platform}. Supported: buzzsprout, anchor, libsyn`
      );
  }
}

/**
 * Get episode details
 */
export async function getEpisodeDetails(episodeId: string): Promise<any> {
  const platform = process.env.PODCAST_PLATFORM || "buzzsprout";

  if (platform === "buzzsprout") {
    const apiToken = process.env.BUZZSPROUT_API_TOKEN;
    const podcastId = process.env.BUZZSPROUT_PODCAST_ID;

    if (!apiToken || !podcastId) {
      throw new Error("Buzzsprout not configured");
    }

    try {
      const response = await axios.get(
        `https://www.buzzsprout.com/api/${podcastId}/episodes/${episodeId}.json`,
        {
          headers: {
            Authorization: `Token token=${apiToken}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Failed to get episode details:", error);
      throw new Error(`Failed to get episode details: ${error.message}`);
    }
  }

  throw new Error(`Get episode details not implemented for ${platform}`);
}

/**
 * List recent episodes
 */
export async function listRecentEpisodes(limit: number = 10): Promise<any[]> {
  const platform = process.env.PODCAST_PLATFORM || "buzzsprout";

  if (platform === "buzzsprout") {
    const apiToken = process.env.BUZZSPROUT_API_TOKEN;
    const podcastId = process.env.BUZZSPROUT_PODCAST_ID;

    if (!apiToken || !podcastId) {
      throw new Error("Buzzsprout not configured");
    }

    try {
      const response = await axios.get(
        `https://www.buzzsprout.com/api/${podcastId}/episodes.json`,
        {
          headers: {
            Authorization: `Token token=${apiToken}`,
          },
        }
      );

      return response.data.slice(0, limit);
    } catch (error: any) {
      console.error("Failed to list episodes:", error);
      throw new Error(`Failed to list episodes: ${error.message}`);
    }
  }

  throw new Error(`List episodes not implemented for ${platform}`);
}

/**
 * Update episode metadata
 */
export async function updateEpisodeMetadata(
  episodeId: string,
  updates: Partial<PodcastEpisode>
): Promise<void> {
  const platform = process.env.PODCAST_PLATFORM || "buzzsprout";

  if (platform === "buzzsprout") {
    const apiToken = process.env.BUZZSPROUT_API_TOKEN;
    const podcastId = process.env.BUZZSPROUT_PODCAST_ID;

    if (!apiToken || !podcastId) {
      throw new Error("Buzzsprout not configured");
    }

    try {
      await axios.put(
        `https://www.buzzsprout.com/api/${podcastId}/episodes/${episodeId}.json`,
        updates,
        {
          headers: {
            Authorization: `Token token=${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ Episode ${episodeId} updated`);
    } catch (error: any) {
      console.error("Failed to update episode:", error);
      throw new Error(`Failed to update episode: ${error.message}`);
    }
  } else {
    throw new Error(`Update episode not implemented for ${platform}`);
  }
}

/**
 * Delete episode
 */
export async function deleteEpisode(episodeId: string): Promise<void> {
  const platform = process.env.PODCAST_PLATFORM || "buzzsprout";

  if (platform === "buzzsprout") {
    const apiToken = process.env.BUZZSPROUT_API_TOKEN;
    const podcastId = process.env.BUZZSPROUT_PODCAST_ID;

    if (!apiToken || !podcastId) {
      throw new Error("Buzzsprout not configured");
    }

    try {
      await axios.delete(
        `https://www.buzzsprout.com/api/${podcastId}/episodes/${episodeId}.json`,
        {
          headers: {
            Authorization: `Token token=${apiToken}`,
          },
        }
      );

      console.log(`✅ Episode ${episodeId} deleted`);
    } catch (error: any) {
      console.error("Failed to delete episode:", error);
      throw new Error(`Failed to delete episode: ${error.message}`);
    }
  } else {
    throw new Error(`Delete episode not implemented for ${platform}`);
  }
}

/**
 * Check if podcast hosting is configured
 */
export function isPodcastConfigured(): boolean {
  const platform = process.env.PODCAST_PLATFORM || "buzzsprout";

  if (platform === "buzzsprout") {
    return !!(process.env.BUZZSPROUT_API_TOKEN && process.env.BUZZSPROUT_PODCAST_ID);
  }

  return false;
}
