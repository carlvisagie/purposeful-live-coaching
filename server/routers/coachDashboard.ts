/**
 * Coach Dashboard Router (PUBLIC - No Auth Required)
 * 
 * For coach/owner to instantly view clients and active sessions
 * WITHOUT requiring login - perfect continuity during calls/chats/video
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { clients, aiChatMessages, aiChatConversations, subscriptions, voicePrints, faceEmbeddings } from "../../drizzle/schema";
import { eq, desc, and, sql, gte } from "drizzle-orm";

export const coachDashboardRouter = router({
  /**
   * Get all clients with rich profile data
   * Returns ALL 50 fields for comprehensive client view
   */
  getAllClients: publicProcedure.query(async () => {
    const allClients = await db.query.clients.findMany({
      orderBy: [desc(clients.updatedAt)],
    });

    // Get all subscriptions
    const allSubscriptions = await db.query.subscriptions.findMany({
      where: eq(subscriptions.status, "active"),
    });
    const subsByUserId = new Map(allSubscriptions.map(s => [s.userId, s]));

    // Get all voice prints
    const allVoicePrints = await db.query.voicePrints.findMany({
      where: eq(voicePrints.isActive, "active"),
    });
    const voiceByUserId = new Map(allVoicePrints.map(v => [v.userId, v]));

    // Get all face embeddings
    const allFaceEmbeddings = await db.query.faceEmbeddings.findMany({
      where: eq(faceEmbeddings.isActive, "active"),
    });
    const faceByUserId = new Map(allFaceEmbeddings.map(f => [f.userId, f]));

    return allClients.map(client => {
      const subscription = subsByUserId.get(client.userId || 0);
      const voicePrint = voiceByUserId.get(client.userId || 0);
      const faceEmbedding = faceByUserId.get(client.userId || 0);

      return {
        ...client,
        // Subscription info
        subscriptionTier: subscription?.tier || null,
        subscriptionStatus: subscription?.status || null,
        // Voice recognition
        voiceEnrolled: !!voicePrint,
        voiceAccuracy: voicePrint?.verificationAccuracy || 0,
        voiceQuality: voicePrint?.enrollmentQuality || null,
        // Face recognition
        faceEnrolled: !!faceEmbedding,
        faceAccuracy: faceEmbedding?.verificationAccuracy || 0,
        faceQuality: faceEmbedding?.enrollmentQuality || null,
        // Calculate profile completeness on the fly if not set
        profileCompleteness: client.profileCompleteness || calculateCompleteness(client),
      };
    });
  }),

  /**
   * Get single client with full profile
   */
  getClientProfile: publicProcedure
    .input(z.object({ client_id: z.number() }))
    .query(async ({ input }) => {
      const client = await db.query.clients.findFirst({
        where: eq(clients.id, input.clientId),
      });

      if (!client) {
        throw new Error("Client not found");
      }

      return client;
    }),

  /**
   * Get conversation history for a client
   * Returns all chat messages ordered by timestamp
   */
  getConversationHistory: publicProcedure
    .input(z.object({ client_id: z.number() }))
    .query(async ({ input }) => {
      // Find conversations for this client
      const conversations = await db.query.aiChatConversations.findMany({
        where: eq(aiChatConversations.clientId, input.clientId),
        orderBy: [desc(aiChatConversations.lastMessageAt)],
      });

      if (conversations.length === 0) {
        return [];
      }

      // Get all messages for these conversations
      const conversationIds = conversations.map(c => c.id);
      const messages = await db.query.aiChatMessages.findMany({
        where: sql`${aiChatMessages.conversationId} IN (${conversationIds.join(',')})`,
        orderBy: [desc(aiChatMessages.createdAt)],
        limit: 100, // Last 100 messages
      });

      return messages;
    }),

  /**
   * Get active sessions (clients currently chatting)
   * Shows who's online in the last 5 minutes
   */
  getActiveSessions: publicProcedure.query(async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Get recent conversations with activity
    const activeConversations = await db.query.aiChatConversations.findMany({
      where: and(
        gte(aiChatConversations.lastMessageAt, fiveMinutesAgo),
        sql`${aiChatConversations.clientId} IS NOT NULL`
      ),
      orderBy: [desc(aiChatConversations.lastMessageAt)],
    });

    // Get client details for each active conversation
    const activeSessions = await Promise.all(
      activeConversations.map(async (conv) => {
        const client = await db.query.clients.findFirst({
          where: eq(clients.id, conv.clientId!),
        });

        // Count messages in last 5 minutes
        const messageCount = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(aiChatMessages)
          .where(and(
            eq(aiChatMessages.conversationId, conv.id),
            gte(aiChatMessages.createdAt, fiveMinutesAgo)
          ));

        return {
          conversationId: conv.id,
          lastMessage: conv.lastMessageAt,
          messageCount: messageCount[0].count,
          client: client || null,
        };
      })
    );

    return activeSessions.filter(s => s.client !== null);
  }),

  /**
   * Update client profile from AI extraction
   * Merges new extracted data with existing profile
   */
  updateProfileFromExtraction: publicProcedure
    .input(z.object({
      client_id: z.number(),
      extractedData: z.object({
        // Professional
        jobTitle: z.string().optional(),
        company: z.string().optional(),
        industry: z.string().optional(),
        careerGoals: z.string().optional(),
        
        // Personal
        age: z.number().optional(),
        locationCity: z.string().optional(),
        locationState: z.string().optional(),
        locationCountry: z.string().optional(),
        relationshipStatus: z.string().optional(),
        hasChildren: z.enum(["true", "false"]).optional(),
        
        // Goals
        primaryGoal: z.string().optional(),
        goalTimeline: z.string().optional(),
        motivation: z.string().optional(),
        
        // Identity
        currentIdentity: z.string().optional(), // JSON string
        targetIdentity: z.string().optional(), // JSON string
        identityGap: z.string().optional(),
        coreValues: z.string().optional(), // JSON string
        lifeMission: z.string().optional(),
        
        // Behavioral
        procrastinationTriggers: z.string().optional(), // JSON string
        energyPattern: z.string().optional(),
        stressResponses: z.string().optional(), // JSON string
        
        // Health
        sleepHours: z.number().optional(),
        exerciseFrequency: z.string().optional(),
        dietPattern: z.string().optional(),
        mentalHealthNotes: z.string().optional(),
        
        // Financial
        savingsLevel: z.string().optional(),
        hasDebt: z.enum(["true", "false"]).optional(),
        monthlyExpensesEstimate: z.number().optional(),
        
        // Communication
        preferredContact: z.string().optional(),
        bestTimeToReach: z.string().optional(),
        communicationStyle: z.string().optional(),
        
        // Crisis
        suicideRiskLevel: z.string().optional(),
        crisisFlags: z.string().optional(), // JSON string
        
        // Metadata
        confidenceScores: z.string().optional(), // JSON string
      }),
    }))
    .mutation(async ({ input }) => {
      const { clientId, extractedData } = input;

      // Update client with extracted data
      // Get current client to calculate new completeness
      const currentClient = await db.query.clients.findFirst({
        where: eq(clients.id, clientId),
      });

      if (!currentClient) {
        throw new Error("Client not found");
      }

      // Merge extracted data with current client
      const updatedClient = { ...currentClient, ...extractedData };
      const newCompleteness = calculateCompleteness(updatedClient);

      // Only update fields that exist in extractedData
      const updateFields: any = {};
      Object.keys(extractedData).forEach(key => {
        const value = (extractedData as any)[key];
        if (value !== undefined) {
          updateFields[key] = value;
        }
      });
      
      updateFields.lastProfileUpdate = new Date();
      updateFields.profileCompleteness = newCompleteness;

      await db.update(clients)
        .set(updateFields)
        .where(eq(clients.id, clientId));

      return { success: true };
    }),

  /**
   * Get dashboard stats
   */
  getStats: publicProcedure.query(async () => {
    const totalClients = await db.select({ count: sql<number>`COUNT(*)` })
      .from(clients);
    
    const activeClients = await db.select({ count: sql<number>`COUNT(*)` })
      .from(clients)
      .where(eq(clients.status, "active"));

    const recentClients = await db.select({ count: sql<number>`COUNT(*)` })
      .from(clients)
      .where(gte(clients.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));

    return {
      totalClients: totalClients[0].count,
      activeClients: activeClients[0].count,
      newThisWeek: recentClients[0].count,
    };
  }),
});

/**
 * Calculate profile completeness percentage
 * Based on how many of the 40+ fields are filled
 */
function calculateCompleteness(client: any): number {
  const fields = [
    'jobTitle', 'company', 'industry', 'careerGoals',
    'age', 'locationCity', 'relationshipStatus',
    'primaryGoal', 'motivation',
    'currentIdentity', 'targetIdentity', 'coreValues',
    'energyPattern', 'sleepHours', 'exerciseFrequency',
    'savingsLevel', 'preferredContact',
  ];

  const filledFields = fields.filter(field => {
    const value = client[field];
    return value !== null && value !== undefined && value !== '';
  });

  return Math.round((filledFields.length / fields.length) * 100);
}

/**
 * SQL expression to calculate completeness
 */
function calculateCompletenessSQL() {
  // This would be a complex SQL CASE statement
  // For now, return a placeholder - will be calculated in application
  return 0;
}
