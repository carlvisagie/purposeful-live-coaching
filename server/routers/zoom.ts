import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { generateZoomToken, createCoachingSessionConfig } from "../zoom";
import { db } from "../db";
import { sessions, clients } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * ZOOM VIDEO SDK ROUTER
 * 
 * Provides Zoom Video SDK tokens for live coaching sessions
 */

export const zoomRouter = router({
  /**
   * Get Zoom token for joining a coaching session
   */
  getSessionToken: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { sessionId } = input;

      // Verify session exists
      const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      });

      if (!session) {
        throw new Error("Session not found");
      }

      // Get client info to check access
      const client = await db.query.clients.findFirst({
        where: eq(clients.id, session.clientId),
      });

      if (!client) {
        throw new Error("Client not found");
      }

      // Determine if user is coach (by coach ID) or client (by email match)
      // Note: This is simplified - in production you'd have a proper user-client mapping
      const isCoach = session.coachId === ctx.user.id;
      const isClient = client.email === ctx.user.email;

      if (!isCoach && !isClient) {
        throw new Error("Access denied - not a participant in this session");
      }

      // Generate Zoom token
      const config = createCoachingSessionConfig(
        sessionId.toString(),
        isCoach,
        ctx.user.name ?? "Unknown"
      );

      const token = generateZoomToken(config);

      return {
        token,
        sessionName: `coaching-${sessionId}`,
        userName: ctx.user.name ?? "Unknown",
        role: isCoach ? "host" : "participant",
      };
    }),

  /**
   * Create Zoom session for scheduled coaching session
   */
  createSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { sessionId } = input;

      // Verify session exists
      const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      });

      if (!session) {
        throw new Error("Session not found");
      }

      // Verify user is the coach
      if (session.coachId !== ctx.user.id) {
        throw new Error("Only the coach can create the Zoom session");
      }

      // Generate host token
      const config = createCoachingSessionConfig(
        sessionId.toString(),
        true,
        ctx.user.name ?? "Coach"
      );
      const token = generateZoomToken(config);

      return {
        sessionName: `coaching-${sessionId}`,
        token,
        sdkKey: process.env.ZOOM_SDK_KEY,
      };
    }),
});
