/**
 * YouTube Publishing Service
 * 
 * Handles automated video upload and publishing to YouTube
 * Uses YouTube Data API v3
 */

import { google } from 'googleapis';

const youtube = google.youtube('v3');

interface YouTubeCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  categoryId: string; // "22" for People & Blogs, "27" for Education
  privacyStatus: 'private' | 'unlisted' | 'public';
}

/**
 * Initialize YouTube OAuth2 client
 */
function getOAuth2Client(credentials: YouTubeCredentials) {
  const oauth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    'https://purposefullivecoaching.com/youtube/callback'
  );

  oauth2Client.setCredentials({
    refresh_token: credentials.refreshToken,
  });

  return oauth2Client;
}

/**
 * Upload video to YouTube
 * 
 * @param videoPath - Local path to video file
 * @param metadata - Video title, description, tags, etc.
 * @param credentials - YouTube API credentials
 * @returns Video ID and URL
 */
export async function uploadVideoToYouTube(
  videoPath: string,
  metadata: VideoMetadata,
  credentials: YouTubeCredentials
): Promise<{ videoId: string; url: string }> {
  const auth = getOAuth2Client(credentials);

  const fs = await import('fs');
  
  const response = await youtube.videos.insert({
    auth,
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        categoryId: metadata.categoryId,
      },
      status: {
        privacyStatus: metadata.privacyStatus,
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  const videoId = response.data.id!;
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  return { videoId, url };
}

/**
 * Update video metadata (after upload)
 */
export async function updateVideoMetadata(
  videoId: string,
  metadata: Partial<VideoMetadata>,
  credentials: YouTubeCredentials
): Promise<void> {
  const auth = getOAuth2Client(credentials);

  await youtube.videos.update({
    auth,
    part: ['snippet'],
    requestBody: {
      id: videoId,
      snippet: {
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags,
        categoryId: metadata.categoryId,
      },
    },
  });
}

/**
 * Set video thumbnail
 */
export async function setVideoThumbnail(
  videoId: string,
  thumbnailPath: string,
  credentials: YouTubeCredentials
): Promise<void> {
  const auth = getOAuth2Client(credentials);
  const fs = await import('fs');

  await youtube.thumbnails.set({
    auth,
    videoId,
    media: {
      body: fs.createReadStream(thumbnailPath),
    },
  });
}

/**
 * Get video statistics
 */
export async function getVideoStats(
  videoId: string,
  credentials: YouTubeCredentials
): Promise<{
  views: number;
  likes: number;
  comments: number;
}> {
  const auth = getOAuth2Client(credentials);

  const response = await youtube.videos.list({
    auth,
    part: ['statistics'],
    id: [videoId],
  });

  const stats = response.data.items?.[0]?.statistics;

  return {
    views: parseInt(stats?.viewCount || '0'),
    likes: parseInt(stats?.likeCount || '0'),
    comments: parseInt(stats?.commentCount || '0'),
  };
}

/**
 * Generate YouTube OAuth URL for initial setup
 */
export function getYouTubeAuthUrl(clientId: string, clientSecret: string): string {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://purposefullivecoaching.com/youtube/callback'
  );

  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

/**
 * Exchange auth code for refresh token (one-time setup)
 */
export async function exchangeCodeForToken(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://purposefullivecoaching.com/youtube/callback'
  );

  const { tokens } = await oauth2Client.getToken(code);
  return tokens.refresh_token!;
}
