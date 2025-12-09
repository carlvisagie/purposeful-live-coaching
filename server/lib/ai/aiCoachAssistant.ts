/**
 * AI Coach Assistant
 * Provides 24/7 support, personalized suggestions, and tone-adaptive communication
 * Ported from Python backend (PurposefulLive/backend/ai_engines/ai_coach_assistant.py)
 */

import { callLLM } from "../../_core/llm";
import { db } from "../../../drizzle/db";
import { aiChatConversations, aiChatMessages } from "../../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

interface UserContext {
  mood?: string;
  recentActivity?: string;
  goals?: string[];
  [key: string]: any;
}

interface SuggestionResult {
  success: boolean;
  suggestion?: string;
  error?: string;
}

interface SupportResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export class AICoachAssistant {
  /**
   * Generates a personalized suggestion based on user data and context
   */
  async getPersonalizedSuggestion(
    userId: number | null,
    context: UserContext
  ): Promise<SuggestionResult> {
    try {
      // Fetch user data (profile, recent activity, goals)
      const userData = await this.fetchUserData(userId);

      // Construct prompt for AI
      const prompt = this.constructSuggestionPrompt(userData, context);

      // Get suggestion from LLM
      const suggestion = await callLLM({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        maxTokens: 150,
      });

      // Adapt tone if necessary
      const adaptedSuggestion = this.adaptTone(suggestion, context.mood);

      // Log interaction
      await this.logInteraction(userId, "suggestion_generated", {
        suggestion: adaptedSuggestion,
        context,
      });

      return { success: true, suggestion: adaptedSuggestion };
    } catch (error) {
      console.error("Error generating suggestion:", error);
      await this.logInteraction(userId, "suggestion_error", {
        error: String(error),
        context,
      });
      return { success: false, error: String(error) };
    }
  }

  /**
   * Provides a supportive response to a user message
   */
  async provideSupportResponse(
    userId: number | null,
    message: string,
    context: UserContext
  ): Promise<SupportResponse> {
    try {
      // Fetch user data and conversation history
      const userData = await this.fetchUserData(userId);
      const conversationHistory = await this.fetchConversationHistory(userId);

      // Construct prompt for AI
      const prompt = this.constructSupportPrompt(
        userData,
        conversationHistory,
        message,
        context
      );

      // Get response from LLM
      const responseText = await callLLM({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        maxTokens: 200,
      });

      // Adapt tone
      const adaptedResponse = this.adaptTone(responseText, context.mood);

      // Log interaction
      await this.logInteraction(userId, "support_provided", {
        userMessage: message,
        response: adaptedResponse,
        context,
      });

      return { success: true, response: adaptedResponse };
    } catch (error) {
      console.error("Error providing support response:", error);
      await this.logInteraction(userId, "support_error", {
        error: String(error),
        context,
      });
      return { success: false, error: String(error) };
    }
  }

  /**
   * Fetches relevant user data from the database
   */
  private async fetchUserData(userId: number | null): Promise<any> {
    if (!userId) {
      return {
        name: "Guest",
        goals: [],
        recentActivity: "No recent activity",
      };
    }

    try {
      // Fetch user profile and recent conversations
      const recentConversations = await db
        .select()
        .from(aiChatConversations)
        .where(eq(aiChatConversations.userId, userId))
        .orderBy(desc(aiChatConversations.lastMessageAt))
        .limit(5);

      return {
        name: "User",
        goals: [], // TODO: Fetch from goals schema when available
        recentActivity: recentConversations.length > 0 ? "Active user" : "New user",
        conversationCount: recentConversations.length,
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { name: "User", goals: [], recentActivity: "Unknown" };
    }
  }

  /**
   * Fetches recent conversation history for context
   */
  private async fetchConversationHistory(
    userId: number | null
  ): Promise<Array<{ role: string; content: string }>> {
    if (!userId) {
      return [];
    }

    try {
      const recentMessages = await db
        .select()
        .from(aiChatMessages)
        .where(eq(aiChatMessages.userId, userId))
        .orderBy(desc(aiChatMessages.createdAt))
        .limit(10);

      return recentMessages.reverse().map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      return [];
    }
  }

  /**
   * Constructs a prompt for generating personalized suggestions
   */
  private constructSuggestionPrompt(userData: any, context: UserContext): string {
    return `User Profile:
Name: ${userData.name || "N/A"}
Goals: ${userData.goals?.join(", ") || "N/A"}
Recent Activity: ${userData.recentActivity || "N/A"}

Context: ${JSON.stringify(context)}

Based on the user profile and context, provide a concise, actionable, and personalized suggestion (max 50 words) to help them progress towards their goals.`;
  }

  /**
   * Constructs a prompt for generating supportive responses
   */
  private constructSupportPrompt(
    userData: any,
    conversationHistory: Array<{ role: string; content: string }>,
    userMessage: string,
    context: UserContext
  ): string {
    const historyText = conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    return `User Profile:
Name: ${userData.name || "N/A"}

Conversation History:
${historyText}

Current User Message: ${userMessage}

Context: ${JSON.stringify(context)}

Provide a supportive, empathetic, and helpful response (max 100 words) that addresses the user's message and helps them feel heard and supported.`;
  }

  /**
   * Adapts the tone of a message based on user mood
   */
  private adaptTone(message: string, mood?: string): string {
    // TODO: Implement tone adaptation based on mood
    // For now, return message as-is
    // Future: Use LLM to adjust tone (formal/casual, energetic/calm, etc.)
    return message;
  }

  /**
   * Logs an interaction to the database
   */
  private async logInteraction(
    userId: number | null,
    eventType: string,
    data: any
  ): Promise<void> {
    try {
      // TODO: Implement proper logging to analytics schema
      console.log(`[AI Coach Assistant] ${eventType}:`, {
        userId,
        timestamp: new Date().toISOString(),
        data,
      });
    } catch (error) {
      console.error("Error logging interaction:", error);
    }
  }
}

// Export singleton instance
export const aiCoachAssistant = new AICoachAssistant();
