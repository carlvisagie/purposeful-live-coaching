/**
 * Audio Upload Router
 * Handles audio file uploads for LiveSessionAssistant
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage-local";
import { randomBytes } from "crypto";

export const audioUploadRouter = router({
  /**
   * Upload audio chunk and return URL
   */
  uploadAudioChunk: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        audioData: z.string(), // base64 encoded audio
        mimeType: z.string().default("audio/webm"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Generate unique filename
        const timestamp = Date.now();
        const random = randomBytes(4).toString("hex");
        const extension = input.mimeType.split("/")[1] || "webm";
        const filename = `session-${input.sessionId}-${timestamp}-${random}.${extension}`;
        const key = `audio-sessions/${filename}`;

        // Decode base64 audio data
        const audioBuffer = Buffer.from(input.audioData, "base64");

        // Upload to storage
        const { url } = await storagePut(key, audioBuffer, input.mimeType);

        return {
          audioUrl: url,
          filename,
        };
      } catch (error) {
        console.error("[Audio Upload] Upload failed:", error);
        throw new Error("Failed to upload audio");
      }
    }),
});
