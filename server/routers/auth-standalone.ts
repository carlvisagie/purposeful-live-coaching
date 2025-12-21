/**
 * Standalone Authentication Router
 * NO Manus dependencies - completely independent
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db-auth";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { subscriptions, usageTracking, clients, coaches } from "../../drizzle/schema";
import { db as drizzleDb } from "../db";

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const authRouter = router({
  // Register new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user already exists
      const existingUser = await db.getUserByEmail(input.email);
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // Create user with hashed password
      const salt = generateSalt();
      const passwordHash = hashPassword(input.password, salt);
      
      const user = await db.createUser({
        email: input.email,
        name: input.name || null,
        passwordHash,
        passwordSalt: salt,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      if (!user) {
        throw new Error("Failed to create user");
      }

      // Create session
      const sessionToken = generateSessionToken();
      await db.createSession({
        user_id: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + ONE_YEAR_MS),
      });

      // Set cookie
      ctx.res.cookie("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ONE_YEAR_MS,
        path: "/",
      });

      // AUTO-ASSIGN BASIC TIER: Frictionless onboarding
      // Every new user gets Basic tier (100 messages/month, 5 modules)
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      const [newSubscription] = await drizzleDb
        .insert(subscriptions)
        .values({
          userId: user.id,
          productId: "ai_basic",
          tier: "ai_basic",
          billingFrequency: "monthly",
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      // Create initial usage tracking record
      await drizzleDb.insert(usageTracking).values({
        subscriptionId: newSubscription.id,
        userId: user.id,
        periodStart: now,
        periodEnd: periodEnd,
        aiMessagesUsed: 0,
        humanSessionsUsed: 0,
        createdAt: now,
        updatedAt: now,
      });

      // ============================================================
      // CREATE UNIFIED CLIENT PROFILE
      // This is the SINGLE SOURCE OF TRUTH for all client data.
      // Every interaction, every click, every conversation goes here.
      // ============================================================
      try {
        // Get or create a default coach (the platform owner)
        let [defaultCoach] = await drizzleDb
          .select()
          .from(coaches)
          .limit(1);
        
        if (!defaultCoach) {
          // Create a default coach if none exists
          [defaultCoach] = await drizzleDb
            .insert(coaches)
            .values({
              userId: user.id, // First user becomes the coach
              specialization: "Life Coaching",
              bio: "Platform Coach",
              isActive: "true",
              createdAt: now,
              updatedAt: now,
            })
            .returning();
        }
        
        // Create the Unified Client Profile linked to this user
        // TODO: Add userId: user.id after running migration to add the column
        await drizzleDb.insert(clients).values({
          coachId: defaultCoach.id,
          // userId: user.id, // Link to user account - uncomment after migration
          name: input.name || "New Client",
          email: input.email,
          status: "active",
          startDate: now,
          createdAt: now,
          updatedAt: now,
        });
        
        console.log(`[Auth] Created Unified Client Profile for user ${user.id}`);
      } catch (clientError) {
        // Don't fail registration if client creation fails
        // The profile can be created later
        console.error(`[Auth] Failed to create client profile:`, clientError);
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }),

  // Login existing user
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Find user
      const user = await db.getUserByEmail(input.email);
      if (!user || !user.passwordHash || !user.passwordSalt) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Verify password
      const passwordHash = hashPassword(input.password, user.passwordSalt);
      if (passwordHash !== user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Update last signed in
      await db.updateUserLastSignedIn(user.id);

      // Create session
      const sessionToken = generateSessionToken();
      await db.createSession({
        user_id: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + ONE_YEAR_MS),
      });

      // Set cookie
      ctx.res.cookie("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ONE_YEAR_MS,
        path: "/",
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }),

  // Get current user
  me: publicProcedure.query(async ({ ctx }) => {
    const sessionToken = ctx.req.cookies.session;
    if (!sessionToken) {
      return null;
    }

      const session = await db.getSessionByToken(sessionToken);
    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const user = await db.getUserById(session.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }),

  // Logout
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const sessionToken = ctx.req.cookies.session;
    if (sessionToken) {
      await db.deleteSession(sessionToken);
    }

    ctx.res.clearCookie("session", { path: "/" });
    return { success: true };
  }),
});
