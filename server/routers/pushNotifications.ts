/**
 * Push Notifications Router
 * 
 * Handles:
 * - User subscription management
 * - Daily check-in reminders
 * - Streak warnings
 * - Session reminders
 * - Just Talk prompts
 * 
 * Research: Push notifications drive 2-3x higher daily engagement
 */

import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../../db";
import { eq, and, lt, isNull, sql } from "drizzle-orm";
import webpush from "web-push";

// Configure web-push with VAPID keys
// In production, these should be in environment variables
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls';

webpush.setVapidDetails(
  'mailto:support@purposefulcoaching.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Notification types
type NotificationType = 
  | 'daily-checkin'
  | 'streak-warning'
  | 'session-reminder'
  | 'just-talk'
  | 'wellness-tip'
  | 'achievement'
  | 'coach-message';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: {
    url?: string;
    type?: NotificationType;
    sessionUrl?: string;
    [key: string]: any;
  };
}

// In-memory store for subscriptions (in production, use database)
const subscriptions = new Map<number, PushSubscription>();

export const pushNotificationsRouter = router({
  // Get VAPID public key for client
  getVapidPublicKey: publicProcedure.query(() => {
    return { publicKey: VAPID_PUBLIC_KEY };
  }),

  // Subscribe to push notifications
  subscribe: protectedProcedure
    .input(z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      }),
      preferences: z.object({
        dailyCheckin: z.boolean().default(true),
        streakWarnings: z.boolean().default(true),
        sessionReminders: z.boolean().default(true),
        justTalkPrompts: z.boolean().default(false),
        wellnessTips: z.boolean().default(true),
        quietHoursStart: z.number().min(0).max(23).optional(),
        quietHoursEnd: z.number().min(0).max(23).optional()
      }).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Store subscription (in production, save to database)
      subscriptions.set(userId, input.subscription as any);
      
      // Save preferences to database
      // await db.insert(pushSubscriptions).values({
      //   userId,
      //   endpoint: input.subscription.endpoint,
      //   p256dh: input.subscription.keys.p256dh,
      //   auth: input.subscription.keys.auth,
      //   preferences: input.preferences
      // });
      
      // Send welcome notification
      await sendNotification(userId, {
        title: '🎉 Notifications Enabled!',
        body: "You'll now receive daily check-in reminders and wellness tips.",
        data: { type: 'achievement', url: '/settings' }
      });
      
      return { success: true };
    }),

  // Unsubscribe from push notifications
  unsubscribe: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    subscriptions.delete(userId);
    
    // Remove from database
    // await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
    
    return { success: true };
  }),

  // Update notification preferences
  updatePreferences: protectedProcedure
    .input(z.object({
      dailyCheckin: z.boolean().optional(),
      streakWarnings: z.boolean().optional(),
      sessionReminders: z.boolean().optional(),
      justTalkPrompts: z.boolean().optional(),
      wellnessTips: z.boolean().optional(),
      quietHoursStart: z.number().min(0).max(23).optional(),
      quietHoursEnd: z.number().min(0).max(23).optional(),
      reminderTime: z.string().optional() // "09:00" format
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Update preferences in database
      // await db.update(pushSubscriptions)
      //   .set({ preferences: input })
      //   .where(eq(pushSubscriptions.userId, userId));
      
      return { success: true, preferences: input };
    }),

  // Send test notification
  sendTest: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    
    const result = await sendNotification(userId, {
      title: '✅ Test Notification',
      body: 'Push notifications are working! You\'ll receive daily reminders.',
      data: { type: 'achievement', url: '/' }
    });
    
    return result;
  }),

  // Trigger daily check-in reminder (called by cron job)
  triggerDailyReminders: publicProcedure
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ input }) => {
      // Verify cron secret
      if (input.secret !== process.env.CRON_SECRET) {
        throw new Error('Unauthorized');
      }
      
      let sent = 0;
      let failed = 0;
      
      for (const [userId, subscription] of subscriptions) {
        try {
          await sendNotification(userId, {
            title: '🌅 Good Morning!',
            body: 'Take a moment to check in. How are you feeling today?',
            data: { type: 'daily-checkin', url: '/wellness?action=checkin' }
          });
          sent++;
        } catch (e) {
          failed++;
        }
      }
      
      return { sent, failed };
    }),

  // Trigger streak warning (called when streak is at risk)
  triggerStreakWarning: protectedProcedure
    .input(z.object({
      currentStreak: z.number(),
      hoursRemaining: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const messages = [
        `🔥 Your ${input.currentStreak}-day streak is at risk! Check in within ${input.hoursRemaining} hours.`,
        `Don't break your ${input.currentStreak}-day streak! Quick check-in takes 30 seconds.`,
        `⚠️ ${input.hoursRemaining} hours left to maintain your ${input.currentStreak}-day streak!`
      ];
      
      const message = messages[Math.floor(Math.random() * messages.length)];
      
      return sendNotification(userId, {
        title: '🔥 Streak Warning!',
        body: message,
        data: { type: 'streak-warning', url: '/wellness?action=checkin' }
      });
    }),

  // Send session reminder
  sendSessionReminder: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      sessionTitle: z.string(),
      coachName: z.string(),
      minutesUntil: z.number(),
      sessionUrl: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      let body = '';
      if (input.minutesUntil <= 5) {
        body = `Starting NOW with ${input.coachName}!`;
      } else if (input.minutesUntil <= 15) {
        body = `Starting in ${input.minutesUntil} minutes with ${input.coachName}`;
      } else {
        body = `Your session with ${input.coachName} starts in ${input.minutesUntil} minutes`;
      }
      
      return sendNotification(userId, {
        title: `📹 ${input.sessionTitle}`,
        body,
        data: { 
          type: 'session-reminder', 
          url: input.sessionUrl,
          sessionUrl: input.sessionUrl
        }
      });
    }),

  // Send "Just Talk" prompt
  sendJustTalkPrompt: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    
    const prompts = [
      { title: "💭 Need to talk?", body: "I'm here whenever you need someone to listen." },
      { title: "🤗 Checking in", body: "How's your day going? I'm here if you want to chat." },
      { title: "💬 Open conversation", body: "Sometimes it helps just to talk. I'm available." },
      { title: "🌟 You matter", body: "Just wanted to remind you - I'm here for you." }
    ];
    
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    return sendNotification(userId, {
      title: prompt.title,
      body: prompt.body,
      data: { type: 'just-talk', url: '/just-talk' }
    });
  }),

  // Send wellness tip
  sendWellnessTip: protectedProcedure
    .input(z.object({
      tip: z.string(),
      category: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      return sendNotification(userId, {
        title: '💡 Wellness Tip',
        body: input.tip,
        data: { type: 'wellness-tip', url: '/wellness' }
      });
    }),

  // Get notification history
  getHistory: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20)
    }))
    .query(async ({ ctx, input }) => {
      // In production, fetch from database
      return {
        notifications: [],
        total: 0
      };
    })
});

// Helper function to send notification
async function sendNotification(userId: number, payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
  const subscription = subscriptions.get(userId);
  
  if (!subscription) {
    return { success: false, error: 'No subscription found' };
  }
  
  try {
    await webpush.sendNotification(
      subscription as any,
      JSON.stringify(payload)
    );
    return { success: true };
  } catch (error: any) {
    console.error('[Push] Failed to send notification:', error);
    
    // If subscription is invalid, remove it
    if (error.statusCode === 410) {
      subscriptions.delete(userId);
    }
    
    return { success: false, error: error.message };
  }
}

// Export for use in other routers
export { sendNotification };
