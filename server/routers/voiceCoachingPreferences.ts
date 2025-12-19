/**
 * VOICE COACHING PREFERENCES ROUTER
 * 
 * Manages user preferences for real-time voice coaching sessions.
 * Part of the 10X Adaptive Emotional Intelligence system.
 * 
 * Features:
 * - Get/update user coaching preferences
 * - Submit session feedback
 * - Track session logs for improvement
 * - Learn what works for each user over time
 */

import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import { db } from "../db";
import { voiceCoachingPreferences, voiceCoachingFeedback, voiceCoachingSessionLogs } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const voiceCoachingPreferencesRouter = router({
  /**
   * Get user's voice coaching preferences
   */
  getPreferences: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      const { userId } = input;
      
      try {
        const preferences = await db
          .select()
          .from(voiceCoachingPreferences)
          .where(eq(voiceCoachingPreferences.userId, userId))
          .limit(1);
        
        if (preferences.length === 0) {
          // Return default preferences for new users
          return {
            preferredStyle: "supportive",
            preferredPace: "moderate",
            preferredEnergy: "balanced",
            feedbackDirectness: "balanced",
            challengeLevel: "medium",
            preferredVoice: "coral",
            totalSessions: 0,
            rapportLevel: 5,
            coachNotes: null,
            effectiveApproaches: null,
            ineffectiveApproaches: null,
            knownTriggers: null,
          };
        }
        
        return preferences[0];
      } catch (error) {
        console.error("[VoiceCoachingPreferences] Error getting preferences:", error);
        throw new Error("Failed to get voice coaching preferences");
      }
    }),

  /**
   * Update user's voice coaching preferences
   */
  updatePreferences: publicProcedure
    .input(z.object({
      userId: z.string(),
      preferredStyle: z.enum(["supportive", "direct", "challenging", "exploratory"]).optional(),
      preferredPace: z.enum(["slow", "moderate", "fast"]).optional(),
      preferredEnergy: z.enum(["calm", "balanced", "high-energy"]).optional(),
      feedbackDirectness: z.enum(["gentle", "balanced", "direct"]).optional(),
      challengeLevel: z.enum(["low", "medium", "high"]).optional(),
      preferredVoice: z.string().optional(),
      coachNotes: z.string().optional(),
      knownTriggers: z.string().optional(), // JSON string
    }))
    .mutation(async ({ input }) => {
      const { userId, ...updates } = input;
      
      try {
        // Check if preferences exist
        const existing = await db
          .select()
          .from(voiceCoachingPreferences)
          .where(eq(voiceCoachingPreferences.userId, userId))
          .limit(1);
        
        if (existing.length === 0) {
          // Create new preferences
          await db.insert(voiceCoachingPreferences).values({
            id: uuidv4(),
            userId,
            ...updates,
            totalSessions: 0,
            rapportLevel: 5,
          });
        } else {
          // Update existing preferences
          await db
            .update(voiceCoachingPreferences)
            .set({
              ...updates,
              updatedAt: new Date(),
            })
            .where(eq(voiceCoachingPreferences.userId, userId));
        }
        
        return { success: true };
      } catch (error) {
        console.error("[VoiceCoachingPreferences] Error updating preferences:", error);
        throw new Error("Failed to update voice coaching preferences");
      }
    }),

  /**
   * Submit feedback after a voice coaching session
   */
  submitFeedback: publicProcedure
    .input(z.object({
      userId: z.string(),
      sessionMode: z.string(),
      sessionDuration: z.number().optional(),
      overallRating: z.number().min(1).max(10),
      styleRating: z.enum(["too_soft", "just_right", "too_harsh"]).optional(),
      paceRating: z.enum(["too_slow", "just_right", "too_fast"]).optional(),
      helpfulnessRating: z.number().min(1).max(10).optional(),
      whatWorked: z.string().optional(),
      whatDidntWork: z.string().optional(),
      suggestions: z.string().optional(),
      startingMood: z.string().optional(),
      endingMood: z.string().optional(),
      confidenceChange: z.number().min(-5).max(5).optional(),
      wouldRecommend: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { userId, ...feedbackData } = input;
      
      try {
        // Get user's preference record
        const preferences = await db
          .select()
          .from(voiceCoachingPreferences)
          .where(eq(voiceCoachingPreferences.userId, userId))
          .limit(1);
        
        const preferenceId = preferences.length > 0 ? preferences[0].id : null;
        
        // Insert feedback
        await db.insert(voiceCoachingFeedback).values({
          id: uuidv4(),
          userId,
          preferenceId,
          ...feedbackData,
        });
        
        // Update preferences based on feedback
        if (preferences.length > 0) {
          const currentPrefs = preferences[0];
          const newTotalSessions = (currentPrefs.totalSessions || 0) + 1;
          const currentAvg = parseFloat(currentPrefs.avgSessionRating?.toString() || "5");
          const newAvg = ((currentAvg * (newTotalSessions - 1)) + input.overallRating) / newTotalSessions;
          
          // Learn from feedback
          let newStyle = currentPrefs.preferredStyle;
          if (input.styleRating === "too_harsh") {
            // Move toward more supportive
            if (newStyle === "challenging") newStyle = "direct";
            else if (newStyle === "direct") newStyle = "supportive";
          } else if (input.styleRating === "too_soft") {
            // Move toward more direct
            if (newStyle === "supportive") newStyle = "direct";
            else if (newStyle === "direct") newStyle = "challenging";
          }
          
          let newPace = currentPrefs.preferredPace;
          if (input.paceRating === "too_fast") {
            if (newPace === "fast") newPace = "moderate";
            else if (newPace === "moderate") newPace = "slow";
          } else if (input.paceRating === "too_slow") {
            if (newPace === "slow") newPace = "moderate";
            else if (newPace === "moderate") newPace = "fast";
          }
          
          // Update preferences
          await db
            .update(voiceCoachingPreferences)
            .set({
              totalSessions: newTotalSessions,
              avgSessionRating: newAvg.toFixed(1),
              lastSessionDate: new Date(),
              preferredStyle: newStyle,
              preferredPace: newPace,
              updatedAt: new Date(),
            })
            .where(eq(voiceCoachingPreferences.userId, userId));
        } else {
          // Create new preferences from feedback
          await db.insert(voiceCoachingPreferences).values({
            id: uuidv4(),
            userId,
            totalSessions: 1,
            avgSessionRating: input.overallRating.toFixed(1),
            lastSessionDate: new Date(),
            preferredStyle: input.styleRating === "too_harsh" ? "supportive" : 
                           input.styleRating === "too_soft" ? "direct" : "supportive",
            preferredPace: input.paceRating === "too_fast" ? "moderate" :
                          input.paceRating === "too_slow" ? "moderate" : "moderate",
            preferredEnergy: "balanced",
            feedbackDirectness: "balanced",
            challengeLevel: "medium",
            preferredVoice: "coral",
            rapportLevel: Math.min(10, Math.max(1, 5 + (input.confidenceChange || 0))),
          });
        }
        
        return { success: true };
      } catch (error) {
        console.error("[VoiceCoachingPreferences] Error submitting feedback:", error);
        throw new Error("Failed to submit voice coaching feedback");
      }
    }),

  /**
   * Log a voice coaching session
   */
  logSession: publicProcedure
    .input(z.object({
      userId: z.string(),
      sessionMode: z.string(),
      voiceUsed: z.string(),
      startedAt: z.date(),
      endedAt: z.date().optional(),
      durationSeconds: z.number().optional(),
      userSpeakingTime: z.number().optional(),
      coachSpeakingTime: z.number().optional(),
      silenceTime: z.number().optional(),
      emotionalJourney: z.string().optional(), // JSON
      breakthroughMoments: z.string().optional(), // JSON
      struggleMoments: z.string().optional(), // JSON
      adaptationsMade: z.string().optional(), // JSON
      transcriptSummary: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await db.insert(voiceCoachingSessionLogs).values({
          id: uuidv4(),
          ...input,
        });
        
        return { success: true };
      } catch (error) {
        console.error("[VoiceCoachingPreferences] Error logging session:", error);
        throw new Error("Failed to log voice coaching session");
      }
    }),

  /**
   * Get recent session feedback for a user
   */
  getRecentFeedback: publicProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const { userId, limit } = input;
      
      try {
        const feedback = await db
          .select()
          .from(voiceCoachingFeedback)
          .where(eq(voiceCoachingFeedback.userId, userId))
          .orderBy(desc(voiceCoachingFeedback.createdAt))
          .limit(limit);
        
        return feedback;
      } catch (error) {
        console.error("[VoiceCoachingPreferences] Error getting feedback:", error);
        throw new Error("Failed to get voice coaching feedback");
      }
    }),

  /**
   * Get coaching insights for a user based on their history
   */
  getCoachingInsights: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      const { userId } = input;
      
      try {
        // Get preferences
        const preferences = await db
          .select()
          .from(voiceCoachingPreferences)
          .where(eq(voiceCoachingPreferences.userId, userId))
          .limit(1);
        
        // Get recent feedback
        const recentFeedback = await db
          .select()
          .from(voiceCoachingFeedback)
          .where(eq(voiceCoachingFeedback.userId, userId))
          .orderBy(desc(voiceCoachingFeedback.createdAt))
          .limit(5);
        
        // Calculate insights
        const avgRating = recentFeedback.length > 0
          ? recentFeedback.reduce((sum, f) => sum + (f.overallRating || 0), 0) / recentFeedback.length
          : null;
        
        const stylePreference = recentFeedback.filter(f => f.styleRating === "just_right").length > 
                               recentFeedback.filter(f => f.styleRating !== "just_right").length
          ? "current style is working"
          : "may need style adjustment";
        
        const pacePreference = recentFeedback.filter(f => f.paceRating === "just_right").length >
                              recentFeedback.filter(f => f.paceRating !== "just_right").length
          ? "current pace is working"
          : "may need pace adjustment";
        
        const avgConfidenceChange = recentFeedback.length > 0
          ? recentFeedback.reduce((sum, f) => sum + (f.confidenceChange || 0), 0) / recentFeedback.length
          : 0;
        
        return {
          preferences: preferences[0] || null,
          recentSessionCount: recentFeedback.length,
          averageRating: avgRating,
          styleInsight: stylePreference,
          paceInsight: pacePreference,
          averageConfidenceChange: avgConfidenceChange,
          recommendation: avgConfidenceChange >= 0 
            ? "Sessions are building confidence - keep it up!"
            : "Consider adjusting approach to better support this user",
        };
      } catch (error) {
        console.error("[VoiceCoachingPreferences] Error getting insights:", error);
        throw new Error("Failed to get coaching insights");
      }
    }),
});
