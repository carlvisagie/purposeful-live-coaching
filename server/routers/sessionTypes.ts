/**
 * Session types router - manage session offerings with pricing
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getCoachSessionTypes,
  getSessionTypeById,
  createSessionType,
  updateSessionType,
  deleteSessionType,
  toggleSessionTypeStatus,
} from "../db/sessionTypes";

export const sessionTypesRouter = router({
  /**
   * Get all ACTIVE session types (PUBLIC - no auth required)
   * Used by booking page and landing pages
   */
  getAll: publicProcedure
    .input(
      z.object({
        coachId: z.number().optional().default(1), // Default to first coach
      })
    )
    .query(async ({ input }) => {
      const sessionTypes = await getCoachSessionTypes(input.coachId, true); // activeOnly = true
      return { sessionTypes };
    }),


  /**
   * Get all session types for a coach
   */
  list: protectedProcedure
    .input(
      z.object({
        coachId: z.number(),
        activeOnly: z.boolean().optional().default(false),
      })
    )
    .query(async ({ input }) => {
      const sessionTypes = await getCoachSessionTypes(input.coachId, input.activeOnly);
      return { sessionTypes };
    }),

  /**
   * Get session type by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const sessionType = await getSessionTypeById(input.id);

      if (!sessionType) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session type not found",
        });
      }

      return sessionType;
    }),

  /**
   * Create a new session type
   */
  create: protectedProcedure
    .input(
      z.object({
        coachId: z.number(),
        name: z.string().min(1).max(100),
        description: z.string().optional(),
        duration: z.number().min(15).max(480), // 15 min to 8 hours
        price: z.number().min(0), // in cents
        displayOrder: z.number().optional().default(0),
      })
    )
    .mutation(async ({ input }) => {
      await createSessionType({
        coachId: input.coachId,
        name: input.name,
        description: input.description,
        duration: input.duration,
        price: input.price,
        displayOrder: input.displayOrder,
        isActive: "true",
      });

      return { success: true };
    }),

  /**
   * Update session type
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        duration: z.number().min(15).max(480).optional(),
        price: z.number().min(0).optional(),
        displayOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      await updateSessionType(id, updates);

      return { success: true };
    }),

  /**
   * Delete session type
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteSessionType(input.id);

      return { success: true };
    }),

  /**
   * Toggle session type active status
   */
  toggleStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await toggleSessionTypeStatus(input.id, input.isActive);

      return { success: true };
    }),
});
