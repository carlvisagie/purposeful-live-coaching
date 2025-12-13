/**
 * Client Files router - File upload, management, and retrieval
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { clientFiles, users } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { storagePut } from "../storage-local";
import { transcribeAudio } from "../_core/voiceTranscription";

/**
 * Generate random suffix for file keys to prevent enumeration
 */
function randomSuffix() {
  return Math.random().toString(36).substring(2, 10);
}

export const clientFilesRouter = router({
  /**
   * Upload a file for a client
   */
  uploadFile: protectedProcedure
    .input(z.object({
      fileName: z.string().min(1).max(255),
      fileType: z.enum(["audio", "video", "document", "image", "transcript"]),
      fileCategory: z.enum([
        "voice_memo",
        "session_recording",
        "journal_entry",
        "photo",
        "document",
        "ai_transcript",
        "other"
      ]),
      fileData: z.string(), // Base64 encoded file data
      mimeType: z.string(),
      conversationId: z.number().optional(),
      sessionId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Decode base64 file data
      const fileBuffer = Buffer.from(input.fileData, 'base64');
      const fileSize = fileBuffer.length;

      // Validate file size
      const maxSizes = {
        audio: 50 * 1024 * 1024, // 50MB
        video: 500 * 1024 * 1024, // 500MB
        document: 25 * 1024 * 1024, // 25MB
        image: 10 * 1024 * 1024, // 10MB
        transcript: 5 * 1024 * 1024, // 5MB
      };

      if (fileSize > maxSizes[input.fileType]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `File too large. Maximum size for ${input.fileType} is ${maxSizes[input.fileType] / 1024 / 1024}MB`,
        });
      }

      // Generate S3 key with folder structure
      const fileExtension = input.fileName.split('.').pop();
      const fileKey = `clients/${ctx.user.id}/${input.fileType}s/${Date.now()}-${randomSuffix()}.${fileExtension}`;

      // Upload to S3
      const { url: fileUrl } = await storagePut(
        fileKey,
        fileBuffer,
        input.mimeType
      );

      // Create database record
      const [file] = await db.insert(clientFiles).values({
        userId: ctx.user.id,
        conversationId: input.conversationId || null,
        sessionId: input.sessionId || null,
        fileName: input.fileName,
        fileType: input.fileType,
        fileCategory: input.fileCategory,
        fileUrl,
        fileKey,
        mimeType: input.mimeType,
        fileSize,
        transcriptionStatus: (input.fileType === "audio" || input.fileType === "video") ? "pending" : null,
      }).$returningId();

      // Auto-transcribe audio/video files
      if (input.fileType === "audio" || input.fileType === "video") {
        // Transcribe in background (don't await)
        transcribeAudio({
          audioUrl: fileUrl,
        }).then(async (result) => {
          // Check if transcription was successful
          if ('text' in result) {
            // Update file with transcription
            await db.update(clientFiles)
              .set({
                transcriptionText: result.text,
                transcriptionStatus: "completed",
                duration: Math.floor(result.duration || 0),
              })
              .where(eq(clientFiles.id, file.id));
          } else {
            // Transcription failed
            await db.update(clientFiles)
              .set({ transcriptionStatus: "failed" })
              .where(eq(clientFiles.id, file.id));
          }
        }).catch(async (error) => {
          console.error("[Client Files] Transcription failed:", error);
          await db.update(clientFiles)
            .set({ transcriptionStatus: "failed" })
            .where(eq(clientFiles.id, file.id));
        });
      }

      return {
        fileId: file.id,
        fileUrl,
        message: "File uploaded successfully",
      };
    }),

  /**
   * Get all files for current user
   */
  getMyFiles: protectedProcedure
    .input(z.object({
      fileType: z.enum(["audio", "video", "document", "image", "transcript", "all"]).default("all"),
    }).optional())
    .query(async ({ input, ctx }) => {
      const filters = [eq(clientFiles.userId, ctx.user.id)];
      
      if (input?.fileType && input.fileType !== "all") {
        filters.push(eq(clientFiles.fileType, input.fileType));
      }

      const files = await db
        .select()
        .from(clientFiles)
        .where(and(...filters))
        .orderBy(desc(clientFiles.uploadedAt));

      return files;
    }),

  /**
   * Get files for a specific client (admin/coach only)
   */
  getClientFiles: protectedProcedure
    .input(z.object({
      userId: z.number(),
      fileType: z.enum(["audio", "video", "document", "image", "transcript", "all"]).default("all"),
    }))
    .query(async ({ input, ctx }) => {
      // Only admins can view other users' files
      if (ctx.user.role !== "admin" && ctx.user.id !== input.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view these files",
        });
      }

      const filters = [eq(clientFiles.userId, input.userId)];
      
      if (input.fileType !== "all") {
        filters.push(eq(clientFiles.fileType, input.fileType));
      }

      const files = await db
        .select()
        .from(clientFiles)
        .where(and(...filters))
        .orderBy(desc(clientFiles.uploadedAt));

      return files;
    }),

  /**
   * Get files linked to a specific conversation
   */
  getConversationFiles: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      const files = await db
        .select()
        .from(clientFiles)
        .where(
          and(
            eq(clientFiles.conversationId, input.conversationId),
            eq(clientFiles.userId, ctx.user.id)
          )
        )
        .orderBy(desc(clientFiles.uploadedAt));

      return files;
    }),

  /**
   * Get recent files for AI context (last 5 files)
   */
  getRecentFilesForAI: protectedProcedure
    .query(async ({ ctx }) => {
      const files = await db
        .select()
        .from(clientFiles)
        .where(eq(clientFiles.userId, ctx.user.id))
        .orderBy(desc(clientFiles.uploadedAt))
        .limit(5);

      // Return only files with transcriptions or text content
      return files.filter(f => 
        f.transcriptionText || 
        f.fileType === "transcript" || 
        f.fileType === "document"
      );
    }),

  /**
   * Delete a file
   */
  deleteFile: protectedProcedure
    .input(z.object({
      fileId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Get file to verify ownership
      const [file] = await db
        .select()
        .from(clientFiles)
        .where(eq(clientFiles.id, input.fileId))
        .limit(1);

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      // Verify ownership (or admin)
      if (file.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this file",
        });
      }

      // Delete from database
      await db.delete(clientFiles).where(eq(clientFiles.id, input.fileId));

      // Note: S3 deletion would require additional storage helper
      // For now, files remain in S3 but are inaccessible via app

      return { success: true };
    }),

  /**
   * Add coach notes to a file
   */
  addCoachNotes: protectedProcedure
    .input(z.object({
      fileId: z.number(),
      notes: z.string().max(5000),
    }))
    .mutation(async ({ input, ctx }) => {
      // Only admins can add coach notes
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only coaches can add notes to files",
        });
      }

      await db
        .update(clientFiles)
        .set({ coachNotes: input.notes })
        .where(eq(clientFiles.id, input.fileId));

      return { success: true };
    }),
});
