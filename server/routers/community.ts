/**
 * COMMUNITY ROUTER - Stupid Simple, Frictionless Community
 * 
 * MUST READ MASTER_GUIDE.md BEFORE MODIFYING
 * ProfileGuard is MANDATORY for all user-facing procedures
 * 
 * Features:
 * - One-tap posting (Win, Support, Question, Progress)
 * - AI moderation (auto-hide negativity, platform criticism)
 * - Anonymous posting option
 * - Accountability partner matching
 * - Coach drops (featured posts)
 */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { 
  communityPosts, 
  communityComments, 
  communityProfiles,
  communityDailyCheckIns,
  communityModerationLog,
  accountabilityPartnerships
} from "../../drizzle/communitySchema";
import { eq, desc, and, sql, or, gte } from "drizzle-orm";
import { ProfileGuard } from "../profileGuard";
import { SelfLearning } from "../selfLearningIntegration";
import { moderateContent, ModerationResult } from "./aiModerator";
import { v4 as uuidv4 } from "uuid";

export const communityRouter = router({
  /**
   * Get community feed - Simple card-based feed
   * Shows: wins, support requests, questions, progress updates
   */
  getFeed: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
      cursor: z.string().optional(),
      postType: z.enum(["all", "win", "support", "question", "progress"]).default("all"),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard - Load client context
      const clientContext = await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });
      
      // Build query conditions
      const conditions = [
        eq(communityPosts.visible, true),
        eq(communityPosts.moderationStatus, "approved"),
      ];
      
      if (input.postType !== "all") {
        conditions.push(eq(communityPosts.postType, input.postType));
      }

      // Get posts with author info
      const posts = await db
        .select({
          id: communityPosts.id,
          postType: communityPosts.postType,
          title: communityPosts.title,
          content: communityPosts.content,
          images: communityPosts.images,
          likesCount: communityPosts.likesCount,
          commentsCount: communityPosts.commentsCount,
          supportsCount: communityPosts.supportsCount,
          isAnonymous: communityPosts.isAnonymous,
          createdAt: communityPosts.createdAt,
          authorId: communityPosts.authorId,
        })
        .from(communityPosts)
        .where(and(...conditions))
        .orderBy(desc(communityPosts.createdAt))
        .limit(input.limit);

      // Get author profiles for non-anonymous posts
      const authorIds = posts
        .filter(p => !p.isAnonymous)
        .map(p => p.authorId);

      let authorProfiles: Record<string, any> = {};
      if (authorIds.length > 0) {
        const profiles = await db
          .select({
            userId: communityProfiles.userId,
            displayName: communityProfiles.displayName,
            profilePhoto: communityProfiles.profilePhoto,
          })
          .from(communityProfiles)
          .where(sql`${communityProfiles.userId} IN ${authorIds}`);
        
        authorProfiles = profiles.reduce((acc, p) => {
          acc[p.userId] = p;
          return acc;
        }, {} as Record<string, any>);
      }

      // Format posts for display
      const formattedPosts = posts.map(post => ({
        ...post,
        author: post.isAnonymous 
          ? { displayName: "Anonymous", profilePhoto: null }
          : authorProfiles[post.authorId] || { displayName: "Member", profilePhoto: null },
        isOwn: post.authorId === ctx.user.id.toString(),
      }));

      // Log interaction for self-learning
      await SelfLearning.trackInteraction({ moduleType: "ai_chat", userId: ctx.user.id, action: "view_community_feed", wasSuccessful: true, metadata: { postType: input.postType } });

      return {
        posts: formattedPosts,
        nextCursor: posts.length === input.limit ? posts[posts.length - 1]?.id : null,
      };
    }),

  /**
   * Create post - One-tap posting
   * Stupid simple: pick type, write content, done!
   */
  createPost: protectedProcedure
    .input(z.object({
      postType: z.enum(["win", "support", "question", "progress"]),
      content: z.string().min(1).max(2000),
      title: z.string().max(200).optional(),
      images: z.array(z.string()).max(4).optional(),
      isAnonymous: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard - Load client context
      const clientContext = await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      // AI Moderation - Check content before posting
      const moderation = await moderateContent(input.content, ctx.user.id.toString());

      // If content is toxic or criticizes platform, hide it
      const moderationStatus = moderation.shouldHide ? "hidden" : "approved";

      // Create post
      const postId = uuidv4();
      await db.insert(communityPosts).values({
        id: postId,
        communityId: "main", // Single community for simplicity
        authorId: ctx.user.id.toString(),
        postType: input.postType,
        title: input.title || null,
        content: input.content,
        images: input.images ? JSON.stringify(input.images) : null,
        isAnonymous: input.isAnonymous,
        moderationStatus,
        moderationScore: moderation.confidence,
        toxicityScore: moderation.toxicity,
        sentimentScore: moderation.sentiment,
        platformCriticism: moderation.platformCriticism,
        moderationNotes: moderation.reason,
        moderatedAt: new Date(),
        visible: !moderation.shouldHide,
      });

      // Log moderation decision
      await db.insert(communityModerationLog).values({
        id: uuidv4(),
        postId,
        userId: ctx.user.id.toString(),
        action: moderation.shouldHide ? "auto_hide" : "auto_approve",
        reason: moderation.reason,
        moderatorType: "ai",
        aiConfidence: moderation.confidence,
        aiAnalysis: JSON.stringify(moderation),
      });

      // Update user's community profile stats
      await db
        .update(communityProfiles)
        .set({
          totalPosts: sql`${communityProfiles.totalPosts} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(communityProfiles.userId, ctx.user.id.toString()));

      // Log for self-learning
      await SelfLearning.trackInteraction({ moduleType: "ai_chat", userId: ctx.user.id, action: "create_community_post", wasSuccessful: !moderation.shouldHide, metadata: { postType: input.postType, isAnonymous: input.isAnonymous } });

      return {
        success: true,
        postId,
        moderated: moderation.shouldHide,
        message: moderation.shouldHide 
          ? "Your post is being reviewed by our team."
          : "Posted successfully!",
      };
    }),

  /**
   * Quick support - One-tap "You got this!" reaction
   */
  sendSupport: protectedProcedure
    .input(z.object({
      postId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard
      await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      // Increment support count
      await db
        .update(communityPosts)
        .set({
          supportsCount: sql`${communityPosts.supportsCount} + 1`,
        })
        .where(eq(communityPosts.id, input.postId));

      // Update giver's stats
      await db
        .update(communityProfiles)
        .set({
          totalSupportsGiven: sql`${communityProfiles.totalSupportsGiven} + 1`,
        })
        .where(eq(communityProfiles.userId, ctx.user.id.toString()));

      // Log for self-learning
      await SelfLearning.trackInteraction({ moduleType: "ai_chat", userId: ctx.user.id, action: "send_community_support", wasSuccessful: true });

      return { success: true };
    }),

  /**
   * Add comment - Simple, flat comments (no nesting)
   */
  addComment: protectedProcedure
    .input(z.object({
      postId: z.string(),
      content: z.string().min(1).max(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard
      await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      // AI Moderation
      const moderation = await moderateContent(input.content, ctx.user.id.toString());

      const commentId = uuidv4();
      await db.insert(communityComments).values({
        id: commentId,
        postId: input.postId,
        authorId: ctx.user.id.toString(),
        content: input.content,
        moderationStatus: moderation.shouldHide ? "hidden" : "approved",
        moderationScore: moderation.confidence,
        toxicityScore: moderation.toxicity,
        sentimentScore: moderation.sentiment,
        platformCriticism: moderation.platformCriticism,
        moderationNotes: moderation.reason,
        visible: !moderation.shouldHide,
      });

      // Update post comment count
      if (!moderation.shouldHide) {
        await db
          .update(communityPosts)
          .set({
            commentsCount: sql`${communityPosts.commentsCount} + 1`,
          })
          .where(eq(communityPosts.id, input.postId));
      }

      // Log for self-learning
      await SelfLearning.trackInteraction({ moduleType: "ai_chat", userId: ctx.user.id, action: "add_community_comment", wasSuccessful: !moderation.shouldHide });

      return {
        success: true,
        commentId,
        moderated: moderation.shouldHide,
      };
    }),

  /**
   * Get comments for a post
   */
  getComments: protectedProcedure
    .input(z.object({
      postId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard
      await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      const comments = await db
        .select()
        .from(communityComments)
        .where(and(
          eq(communityComments.postId, input.postId),
          eq(communityComments.visible, true),
          eq(communityComments.moderationStatus, "approved"),
        ))
        .orderBy(desc(communityComments.createdAt));

      return { comments };
    }),

  /**
   * Daily pulse - Quick mood check that can be shared
   */
  submitDailyPulse: protectedProcedure
    .input(z.object({
      mood: z.enum(["great", "good", "okay", "struggling", "rough"]),
      energy: z.number().min(1).max(10),
      gratefulFor: z.string().max(500).optional(),
      strugglingWith: z.string().max(500).optional(),
      winsToday: z.string().max(500).optional(),
      shareWithCommunity: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard
      const clientContext = await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      const checkInId = uuidv4();
      await db.insert(communityDailyCheckIns).values({
        id: checkInId,
        userId: ctx.user.id.toString(),
        checkInDate: new Date(),
        mood: input.mood,
        energy: input.energy,
        gratefulFor: input.gratefulFor,
        strugglingWith: input.strugglingWith,
        winsToday: input.winsToday,
        shareWithCommunity: input.shareWithCommunity,
        needSupport: input.mood === "struggling" || input.mood === "rough",
      });

      // If sharing and has a win, auto-create a win post
      if (input.shareWithCommunity && input.winsToday) {
        const moderation = await moderateContent(input.winsToday, ctx.user.id.toString());
        
        if (!moderation.shouldHide) {
          await db.insert(communityPosts).values({
            id: uuidv4(),
            communityId: "main",
            authorId: ctx.user.id.toString(),
            postType: "win",
            content: input.winsToday,
            moderationStatus: "approved",
            moderationScore: moderation.confidence,
            visible: true,
          });
        }
      }

      // Log for self-learning
      await SelfLearning.trackInteraction({ moduleType: "ai_chat", userId: ctx.user.id, action: "community_daily_checkin", wasSuccessful: true, metadata: { mood: input.mood } });

      return { success: true, checkInId };
    }),

  /**
   * Get or create community profile
   */
  getMyProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard
      const clientContext = await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      let profile = await db
        .select()
        .from(communityProfiles)
        .where(eq(communityProfiles.userId, ctx.user.id.toString()))
        .limit(1);

      // Auto-create profile if doesn't exist (frictionless!)
      if (profile.length === 0) {
        const newProfile = {
          id: uuidv4(),
          userId: ctx.user.id.toString(),
          displayName: clientContext?.name || ctx.user.name || "Member",
          bio: null,
          profilePhoto: null,
          shareProgress: true,
          shareStruggles: true,
          shareWins: true,
          active: true,
        };

        await db.insert(communityProfiles).values(newProfile);
        return newProfile;
      }

      return profile[0];
    }),

  /**
   * Update community profile
   */
  updateProfile: protectedProcedure
    .input(z.object({
      displayName: z.string().min(2).max(50).optional(),
      bio: z.string().max(500).optional(),
      shareProgress: z.boolean().optional(),
      shareStruggles: z.boolean().optional(),
      shareWins: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard
      await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      await db
        .update(communityProfiles)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(communityProfiles.userId, ctx.user.id.toString()));

      return { success: true };
    }),

  /**
   * Get people who need support today
   * For accountability partners and mentors
   */
  getPeopleNeedingSupport: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard
      await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const needingSupport = await db
        .select({
          id: communityDailyCheckIns.id,
          mood: communityDailyCheckIns.mood,
          strugglingWith: communityDailyCheckIns.strugglingWith,
          userId: communityDailyCheckIns.userId,
        })
        .from(communityDailyCheckIns)
        .where(and(
          eq(communityDailyCheckIns.needSupport, true),
          eq(communityDailyCheckIns.shareWithCommunity, true),
          gte(communityDailyCheckIns.checkInDate, today),
        ))
        .limit(10);

      return { people: needingSupport };
    }),

  /**
   * Coach feature post - Highlight a post (owner only)
   */
  featurePost: protectedProcedure
    .input(z.object({
      postId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if user is coach/owner (you can adjust this check)
      // For now, using a simple email check
      if (ctx.user.email !== "carl@purposefullivecoaching.com") {
        throw new Error("Only coaches can feature posts");
      }

      await db
        .update(communityPosts)
        .set({
          // Mark as featured (you'd add this field to schema)
          updatedAt: new Date(),
        })
        .where(eq(communityPosts.id, input.postId));

      return { success: true };
    }),

  /**
   * Get community stats for dashboard widget
   */
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // ProfileGuard
      await ProfileGuard.getClientContext(ctx.user.id, { moduleName: "community" });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get today's activity
      const todayPosts = await db
        .select({ count: sql<number>`count(*)` })
        .from(communityPosts)
        .where(gte(communityPosts.createdAt, today));

      const todaySupports = await db
        .select({ total: sql<number>`sum(${communityPosts.supportsCount})` })
        .from(communityPosts)
        .where(gte(communityPosts.createdAt, today));

      return {
        todayPosts: todayPosts[0]?.count || 0,
        todaySupports: todaySupports[0]?.total || 0,
        message: "Your community is here for you 💙",
      };
    }),
});
