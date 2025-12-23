/**
 * YouTube OAuth and Management Router
 * 
 * Handles YouTube OAuth flow and video management
 */

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  getAuthUrl,
  getTokensFromCode,
  uploadVideoToYouTube,
  getVideoStatus,
  getChannelInfo,
  listRecentUploads,
} from "../services/youtubeService";

export const youtubeRouter = router({
  /**
   * Get OAuth URL for YouTube authorization
   * Admin needs to visit this URL once to authorize the app
   */
  getAuthUrl: publicProcedure.query(() => {
    const authUrl = getAuthUrl();
    return {
      authUrl,
      instructions: [
        "1. Visit the auth URL",
        "2. Sign in with your YouTube account",
        "3. Grant permissions",
        "4. Copy the authorization code from the redirect URL",
        "5. Call exchangeCode with the code",
        "6. Save the refresh token to YOUTUBE_REFRESH_TOKEN environment variable",
      ],
    };
  }),

  /**
   * Exchange authorization code for tokens
   * Call this after user authorizes the app
   */
  exchangeCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const tokens = await getTokensFromCode(input.code);
        return {
          success: true,
          refreshToken: tokens.refresh_token,
          message:
            "Authorization successful! Save the refresh token to YOUTUBE_REFRESH_TOKEN environment variable.",
        };
      } catch (error: any) {
        console.error("OAuth exchange error:", error);
        throw new Error(`Failed to exchange code: ${error.message}`);
      }
    }),

  /**
   * Get YouTube channel information
   */
  getChannelInfo: publicProcedure.query(async () => {
    try {
      const channelInfo = await getChannelInfo();
      return {
        success: true,
        channel: channelInfo,
      };
    } catch (error: any) {
      console.error("Failed to get channel info:", error);
      throw new Error(`Failed to get channel info: ${error.message}`);
    }
  }),

  /**
   * List recent uploads
   */
  listRecentUploads: publicProcedure
    .input(
      z.object({
        maxResults: z.number().optional().default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const uploads = await listRecentUploads(input.maxResults);
        return {
          success: true,
          uploads,
        };
      } catch (error: any) {
        console.error("Failed to list uploads:", error);
        throw new Error(`Failed to list uploads: ${error.message}`);
      }
    }),

  /**
   * Get video status
   */
  getVideoStatus: publicProcedure
    .input(
      z.object({
        videoId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const status = await getVideoStatus(input.videoId);
        return {
          success: true,
          status,
        };
      } catch (error: any) {
        console.error("Failed to get video status:", error);
        throw new Error(`Failed to get video status: ${error.message}`);
      }
    }),

  /**
   * Check if YouTube is configured
   */
  isConfigured: publicProcedure.query(() => {
    const isConfigured = !!(
      process.env.YOUTUBE_CLIENT_ID &&
      process.env.YOUTUBE_CLIENT_SECRET &&
      process.env.YOUTUBE_REFRESH_TOKEN
    );

    return {
      isConfigured,
      message: isConfigured
        ? "YouTube integration is configured and ready"
        : "YouTube integration not configured. Please complete OAuth setup.",
    };
  }),
});
