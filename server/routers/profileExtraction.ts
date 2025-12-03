/**
 * Profile Extraction router - Extract user profile data from AI conversations
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { db } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const EXTRACTION_PROMPT = `You are a profile data extraction system. Analyze the user's message and extract structured profile information.

Extract the following if mentioned:
- **primaryGoal**: Main reason they're seeking coaching (e.g., "stress management", "career transition", "improve relationships")
- **secondaryGoal**: Secondary goals mentioned
- **mainChallenges**: Specific challenges they're facing (array of strings)
- **preferredFrequency**: How often they want to engage ("daily", "weekly", "as_needed")
- **timezone**: Their timezone if mentioned (e.g., "I'm in California" → "America/Los_Angeles")
- **availability**: When they're available (e.g., "evenings", "weekends", "mornings", "flexible")
- **communicationStyle**: How they prefer communication ("concise" if they say "keep it short/busy", "detailed" if they want depth, "balanced" otherwise)
- **triggers**: Specific situations to watch for (array of strings, e.g., ["work stress leads to insomnia", "anxiety before meetings"])

Only extract data that is explicitly or clearly implied in the message. Return null for fields not mentioned.

Return a JSON object with these exact fields. Use null for any field not found in the message.`;

export const profileExtractionRouter = router({
  /**
   * Extract profile data from a conversation message
   */
  extractFromMessage: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        conversationContext: z.string().optional(), // Previous messages for context
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: EXTRACTION_PROMPT },
            {
              role: "user",
              content: input.conversationContext
                ? `Previous context: ${input.conversationContext}\n\nCurrent message: ${input.message}`
                : input.message,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "profile_extraction",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  primaryGoal: { type: ["string", "null"] },
                  secondaryGoal: { type: ["string", "null"] },
                  mainChallenges: {
                    type: ["array", "null"],
                    items: { type: "string" },
                  },
                  preferredFrequency: {
                    type: ["string", "null"],
                    enum: ["daily", "weekly", "as_needed", null],
                  },
                  timezone: { type: ["string", "null"] },
                  availability: { type: ["string", "null"] },
                  communicationStyle: {
                    type: ["string", "null"],
                    enum: ["concise", "detailed", "balanced", null],
                  },
                  triggers: {
                    type: ["array", "null"],
                    items: { type: "string" },
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence score 0-100 for this extraction",
                  },
                },
                required: [
                  "primaryGoal",
                  "secondaryGoal",
                  "mainChallenges",
                  "preferredFrequency",
                  "timezone",
                  "availability",
                  "communicationStyle",
                  "triggers",
                  "confidence",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== 'string') {
          return { extracted: null, updated: false };
        }

        const extracted = JSON.parse(content);

        // Only update profile if confidence > 70%
        if (extracted.confidence && extracted.confidence > 70) {
          const updates: any = {};
          let fieldsUpdated = 0;

          if (extracted.primaryGoal) {
            updates.primaryGoal = extracted.primaryGoal;
            fieldsUpdated++;
          }
          if (extracted.secondaryGoal) {
            updates.secondaryGoal = extracted.secondaryGoal;
            fieldsUpdated++;
          }
          if (extracted.mainChallenges && extracted.mainChallenges.length > 0) {
            updates.mainChallenges = JSON.stringify(extracted.mainChallenges);
            fieldsUpdated++;
          }
          if (extracted.preferredFrequency) {
            updates.preferredFrequency = extracted.preferredFrequency;
            fieldsUpdated++;
          }
          if (extracted.timezone) {
            updates.timezone = extracted.timezone;
            fieldsUpdated++;
          }
          if (extracted.availability) {
            updates.availability = extracted.availability;
            fieldsUpdated++;
          }
          if (extracted.communicationStyle) {
            updates.communicationStyle = extracted.communicationStyle;
            fieldsUpdated++;
          }
          if (extracted.triggers && extracted.triggers.length > 0) {
            updates.triggers = JSON.stringify(extracted.triggers);
            fieldsUpdated++;
          }

          // Calculate profile completeness (0-100%)
          const totalFields = 8; // primaryGoal, secondaryGoal, mainChallenges, preferredFrequency, timezone, availability, communicationStyle, triggers
          updates.profileCompleteness = Math.round((fieldsUpdated / totalFields) * 100);

          if (Object.keys(updates).length > 0) {
            await db.update(users).set(updates).where(eq(users.id, ctx.user.id));
            return { extracted, updated: true, fieldsUpdated };
          }
        }

        return { extracted, updated: false };
      } catch (error) {
        console.error("[Profile Extraction] Error:", error);
        return { extracted: null, updated: false, error: String(error) };
      }
    }),

  /**
   * Get current user profile
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user) {
      return null;
    }

    return {
      primaryGoal: user.primaryGoal,
      secondaryGoal: user.secondaryGoal,
      mainChallenges: user.mainChallenges ? JSON.parse(user.mainChallenges) : [],
      preferredFrequency: user.preferredFrequency,
      timezone: user.timezone,
      availability: user.availability,
      communicationStyle: user.communicationStyle,
      triggers: user.triggers ? JSON.parse(user.triggers) : [],
      profileCompleteness: user.profileCompleteness || 0,
    };
  }),

  /**
   * Manually update profile (user override)
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        primaryGoal: z.string().optional(),
        secondaryGoal: z.string().optional(),
        mainChallenges: z.array(z.string()).optional(),
        preferredFrequency: z.enum(["daily", "weekly", "as_needed"]).optional(),
        timezone: z.string().optional(),
        availability: z.string().optional(),
        communicationStyle: z.enum(["concise", "detailed", "balanced"]).optional(),
        triggers: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updates: any = {};

      if (input.primaryGoal !== undefined) updates.primaryGoal = input.primaryGoal;
      if (input.secondaryGoal !== undefined) updates.secondaryGoal = input.secondaryGoal;
      if (input.mainChallenges !== undefined)
        updates.mainChallenges = JSON.stringify(input.mainChallenges);
      if (input.preferredFrequency !== undefined)
        updates.preferredFrequency = input.preferredFrequency;
      if (input.timezone !== undefined) updates.timezone = input.timezone;
      if (input.availability !== undefined) updates.availability = input.availability;
      if (input.communicationStyle !== undefined)
        updates.communicationStyle = input.communicationStyle;
      if (input.triggers !== undefined) updates.triggers = JSON.stringify(input.triggers);

      // Recalculate completeness
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (currentUser) {
        const mergedProfile = { ...currentUser, ...updates };
        let filledFields = 0;
        if (mergedProfile.primaryGoal) filledFields++;
        if (mergedProfile.secondaryGoal) filledFields++;
        if (mergedProfile.mainChallenges) filledFields++;
        if (mergedProfile.preferredFrequency) filledFields++;
        if (mergedProfile.timezone) filledFields++;
        if (mergedProfile.availability) filledFields++;
        if (mergedProfile.communicationStyle) filledFields++;
        if (mergedProfile.triggers) filledFields++;

        updates.profileCompleteness = Math.round((filledFields / 8) * 100);
      }

      await db.update(users).set(updates).where(eq(users.id, ctx.user.id));

      return { success: true };
    }),
});
