/**
 * EVENT TRACKING ROUTER
 * 
 * tRPC router for the event tracking system.
 * Part of the Unified Client Profile.
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { 
  trackEvent, 
  trackEventsBatch,
  startSession, 
  endSession,
  getClientInsightsForSage,
  getClientInsightsString,
  detectBehavioralPatterns,
} from "../services/eventTracking";

export const eventTrackingRouter = router({
  /**
   * Track a single event
   */
  trackEvent: publicProcedure
    .input(z.object({
      clientId: z.number(),
      eventType: z.enum(['click', 'view', 'scroll', 'input', 'navigation', 'feature', 'error', 'custom']),
      eventCategory: z.enum(['ui', 'feature', 'content', 'session', 'conversion', 'error']),
      eventAction: z.string(),
      eventLabel: z.string().optional(),
      pagePath: z.string().optional(),
      pageTitle: z.string().optional(),
      componentName: z.string().optional(),
      elementId: z.string().optional(),
      elementText: z.string().optional(),
      sessionId: z.string().optional(),
      timeOnPage: z.number().optional(),
      scrollDepth: z.number().optional(),
      deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional(),
      browserName: z.string().optional(),
      screenSize: z.string().optional(),
      metadata: z.record(z.any()).optional(),
      sentimentHint: z.enum(['positive', 'negative', 'neutral', 'frustrated', 'excited']).optional(),
      engagementLevel: z.enum(['high', 'medium', 'low', 'abandoning']).optional(),
    }))
    .mutation(async ({ input }) => {
      await trackEvent(input);
      return { success: true };
    }),
  
  /**
   * Track multiple events in batch
   */
  trackEventsBatch: publicProcedure
    .input(z.object({
      events: z.array(z.object({
        clientId: z.number(),
        eventType: z.enum(['click', 'view', 'scroll', 'input', 'navigation', 'feature', 'error', 'custom']),
        eventCategory: z.enum(['ui', 'feature', 'content', 'session', 'conversion', 'error']),
        eventAction: z.string(),
        eventLabel: z.string().optional(),
        pagePath: z.string().optional(),
        pageTitle: z.string().optional(),
        componentName: z.string().optional(),
        elementId: z.string().optional(),
        elementText: z.string().optional(),
        sessionId: z.string().optional(),
        timeOnPage: z.number().optional(),
        scrollDepth: z.number().optional(),
        deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional(),
        browserName: z.string().optional(),
        screenSize: z.string().optional(),
        metadata: z.record(z.any()).optional(),
        sentimentHint: z.enum(['positive', 'negative', 'neutral', 'frustrated', 'excited']).optional(),
        engagementLevel: z.enum(['high', 'medium', 'low', 'abandoning']).optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      await trackEventsBatch(input.events);
      return { success: true };
    }),
  
  /**
   * Start a new session
   */
  startSession: publicProcedure
    .input(z.object({
      clientId: z.number(),
      sessionId: z.string(),
      deviceType: z.string().optional(),
      browserName: z.string().optional(),
      operatingSystem: z.string().optional(),
      screenSize: z.string().optional(),
      referrer: z.string().optional(),
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      entryPage: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await startSession(input);
      return { success: true };
    }),
  
  /**
   * End a session
   */
  endSession: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      exitPage: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await endSession(input.sessionId, input.exitPage);
      return { success: true };
    }),
  
  /**
   * Get client insights for Sage (AI-ready format)
   */
  getClientInsights: protectedProcedure
    .input(z.object({
      clientId: z.number(),
    }))
    .query(async ({ input }) => {
      const insights = await getClientInsightsForSage(input.clientId);
      return insights;
    }),
  
  /**
   * Get client insights as formatted string
   */
  getClientInsightsString: protectedProcedure
    .input(z.object({
      clientId: z.number(),
    }))
    .query(async ({ input }) => {
      const insightsString = await getClientInsightsString(input.clientId);
      return { insights: insightsString };
    }),
  
  /**
   * Trigger pattern detection for a client
   */
  detectPatterns: protectedProcedure
    .input(z.object({
      clientId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await detectBehavioralPatterns(input.clientId);
      return { success: true };
    }),
});
