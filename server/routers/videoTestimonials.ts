import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createVideoTestimonial,
  getVideoTestimonials,
  getVideoTestimonialById,
  updateVideoTestimonial,
  deleteVideoTestimonial,
  getAllVideoTestimonials,
} from "../db/videoTestimonials";
import { TRPCError } from "@trpc/server";
import { storagePut, storageGet } from "../storage";

export const videoTestimonialsRouter = router({
  // Get published testimonials for display
  getPublished: publicProcedure.query(async () => {
    return await getVideoTestimonials();
  }),

  // Get all testimonials (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return await getAllVideoTestimonials();
  }),

  // Get single testimonial
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await getVideoTestimonialById(input.id);
  }),

  // Create testimonial (admin only)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        title: z.string().min(1),
        company: z.string().min(1),
        quote: z.string().min(1),
        metric: z.string().min(1),
        metricValue: z.string().min(1),
        videoUrl: z.string().optional(),
        videoKey: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        thumbnailKey: z.string().optional(),
        duration: z.number().optional(),
        isPublished: z.enum(["true", "false"]).default("false"),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return await createVideoTestimonial(input);
    }),

  // Update testimonial (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        title: z.string().optional(),
        company: z.string().optional(),
        quote: z.string().optional(),
        metric: z.string().optional(),
        metricValue: z.string().optional(),
        videoUrl: z.string().optional(),
        videoKey: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        thumbnailKey: z.string().optional(),
        duration: z.number().optional(),
        isPublished: z.enum(["true", "false"]).optional(),
        displayOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const { id, ...updates } = input;
      return await updateVideoTestimonial(id, updates);
    }),

  // Delete testimonial (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const success = await deleteVideoTestimonial(input.id);
      if (!success) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return { success: true };
    }),

  // Get upload URL for video file
  getVideoUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Generate a unique key for the video
      const timestamp = Date.now();
      const fileKey = `testimonials/videos/${timestamp}-${input.fileName}`;

      try {
        // Return presigned URL for upload
        const uploadUrl = await storageGet(fileKey);
        return {
          uploadUrl: uploadUrl.url,
          fileKey,
        };
      } catch (error) {
        console.error("[VideoTestimonials] Failed to generate upload URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload URL",
        });
      }
    }),

  // Get video playback URL
  getVideoUrl: publicProcedure
    .input(z.object({ fileKey: z.string() }))
    .query(async ({ input }) => {
      try {
        const url = await storageGet(input.fileKey);
        return { url: url.url };
      } catch (error) {
        console.error("[VideoTestimonials] Failed to get video URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get video URL",
        });
      }
    }),
});
