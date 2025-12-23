/**
 * Podcast Publishing Service
 * 
 * Handles automated podcast episode upload and distribution
 * Supports multiple podcast hosting platforms
 */

import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

interface PodcastEpisode {
  title: string;
  description: string;
  audioFilePath: string;
  publishDate?: Date;
  explicit?: boolean;
  episodeNumber?: number;
  seasonNumber?: number;
}

interface PodcastCredentials {
  platform: 'anchor' | 'buzzsprout' | 'libsyn' | 'transistor';
  apiKey: string;
  showId?: string;
}

/**
 * Upload podcast episode to Anchor.fm (Spotify for Podcasters)
 * 
 * Note: Anchor doesn't have a public API, so this uses RSS feed upload
 * For production, consider using Buzzsprout or Transistor which have proper APIs
 */
async function uploadToAnchor(
  episode: PodcastEpisode,
  credentials: PodcastCredentials
): Promise<{ episodeId: string; url: string }> {
  // Anchor requires manual upload or RSS feed
  // This is a placeholder for the workflow
  throw new Error('Anchor.fm requires manual upload. Consider using Buzzsprout or Transistor for API access.');
}

/**
 * Upload podcast episode to Buzzsprout
 * https://github.com/Buzzsprout/buzzsprout-api
 */
async function uploadToBuzzsprout(
  episode: PodcastEpisode,
  credentials: PodcastCredentials
): Promise<{ episodeId: string; url: string }> {
  const formData = new FormData();
  formData.append('title', episode.title);
  formData.append('description', episode.description);
  formData.append('audio_file', fs.createReadStream(episode.audioFilePath));
  
  if (episode.publishDate) {
    formData.append('published_at', episode.publishDate.toISOString());
  }
  
  if (episode.episodeNumber) {
    formData.append('episode_number', episode.episodeNumber.toString());
  }
  
  if (episode.seasonNumber) {
    formData.append('season_number', episode.seasonNumber.toString());
  }
  
  formData.append('explicit', episode.explicit ? 'true' : 'false');

  const response = await axios.post(
    `https://www.buzzsprout.com/api/${credentials.showId}/episodes.json`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Token token=${credentials.apiKey}`,
      },
    }
  );

  return {
    episodeId: response.data.id.toString(),
    url: response.data.audio_url,
  };
}

/**
 * Upload podcast episode to Transistor.fm
 * https://developers.transistor.fm/
 */
async function uploadToTransistor(
  episode: PodcastEpisode,
  credentials: PodcastCredentials
): Promise<{ episodeId: string; url: string }> {
  // Step 1: Get authorized upload URL
  const uploadAuthResponse = await axios.get(
    `https://api.transistor.fm/v1/episodes/authorize_upload`,
    {
      params: {
        filename: episode.audioFilePath.split('/').pop(),
      },
      headers: {
        'x-api-key': credentials.apiKey,
      },
    }
  );

  const { upload_url, audio_url } = uploadAuthResponse.data.data.attributes;

  // Step 2: Upload audio file to authorized URL
  const audioBuffer = fs.readFileSync(episode.audioFilePath);
  await axios.put(upload_url, audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });

  // Step 3: Create episode with uploaded audio
  const createEpisodeResponse = await axios.post(
    'https://api.transistor.fm/v1/episodes',
    {
      episode: {
        show_id: credentials.showId,
        title: episode.title,
        description: episode.description,
        audio_url: audio_url,
        status: episode.publishDate ? 'scheduled' : 'published',
        publish_at: episode.publishDate?.toISOString(),
        explicit: episode.explicit || false,
        number: episode.episodeNumber,
        season: episode.seasonNumber,
      },
    },
    {
      headers: {
        'x-api-key': credentials.apiKey,
        'Content-Type': 'application/json',
      },
    }
  );

  return {
    episodeId: createEpisodeResponse.data.data.id,
    url: createEpisodeResponse.data.data.attributes.share_url,
  };
}

/**
 * Upload podcast episode to Libsyn
 * https://help.libsyn.com/hc/en-us/articles/360000403554-Libsyn-API-5-Overview
 */
async function uploadToLibsyn(
  episode: PodcastEpisode,
  credentials: PodcastCredentials
): Promise<{ episodeId: string; url: string }> {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(episode.audioFilePath));
  formData.append('title', episode.title);
  formData.append('description', episode.description);
  
  if (episode.publishDate) {
    formData.append('release_date', episode.publishDate.toISOString());
  }
  
  if (episode.episodeNumber) {
    formData.append('item_number', episode.episodeNumber.toString());
  }

  const response = await axios.post(
    'https://api.libsyn.com/media',
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${credentials.apiKey}`,
      },
    }
  );

  return {
    episodeId: response.data.media_id,
    url: response.data.download_url,
  };
}

/**
 * Main function to upload podcast episode
 * Automatically routes to correct platform based on credentials
 */
export async function uploadPodcastEpisode(
  episode: PodcastEpisode,
  credentials: PodcastCredentials
): Promise<{ episodeId: string; url: string; platform: string }> {
  let result;

  switch (credentials.platform) {
    case 'anchor':
      result = await uploadToAnchor(episode, credentials);
      break;
    case 'buzzsprout':
      result = await uploadToBuzzsprout(episode, credentials);
      break;
    case 'transistor':
      result = await uploadToTransistor(episode, credentials);
      break;
    case 'libsyn':
      result = await uploadToLibsyn(episode, credentials);
      break;
    default:
      throw new Error(`Unsupported podcast platform: ${credentials.platform}`);
  }

  return {
    ...result,
    platform: credentials.platform,
  };
}

/**
 * Get episode statistics (if platform supports it)
 */
export async function getPodcastStats(
  episodeId: string,
  credentials: PodcastCredentials
): Promise<{
  downloads: number;
  uniqueListeners?: number;
}> {
  switch (credentials.platform) {
    case 'buzzsprout':
      const buzzsproutResponse = await axios.get(
        `https://www.buzzsprout.com/api/${credentials.showId}/episodes/${episodeId}.json`,
        {
          headers: {
            'Authorization': `Token token=${credentials.apiKey}`,
          },
        }
      );
      return {
        downloads: buzzsproutResponse.data.total_plays || 0,
      };

    case 'transistor':
      const transistorResponse = await axios.get(
        `https://api.transistor.fm/v1/analytics`,
        {
          params: {
            episode_id: episodeId,
          },
          headers: {
            'x-api-key': credentials.apiKey,
          },
        }
      );
      return {
        downloads: transistorResponse.data.data.attributes.downloads || 0,
      };

    default:
      throw new Error(`Stats not supported for platform: ${credentials.platform}`);
  }
}

/**
 * Recommended platform: Transistor.fm
 * - Clean API
 * - Reliable
 * - Good analytics
 * - Distributes to all major platforms (Apple, Spotify, Google, etc.)
 * - $19/month for up to 10,000 downloads
 */
export const RECOMMENDED_PLATFORM = 'transistor';
