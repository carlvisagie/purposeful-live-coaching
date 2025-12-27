/**
 * ACTION PLANS & HOMEWORK ROUTER
 * 
 * MORAL OBLIGATION: Action plans create commitment and accountability
 * - Clients with action plans are 3x more likely to stay engaged
 * - Homework completion predicts long-term success
 * - Tangible next steps prevent "I don't know what to do" drop-off
 * 
 * Features:
 * - Coaches assign action plans after sessions
 * - Clients see tasks in dashboard
 * - Progress tracking and completion
 * - Automated reminders (email/SMS)
 * - AI-generated suggestions based on session content
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { actionPlans, actionPlanTasks, sessions, users } from "../../drizzle/schema";
import { eq, and, desc, gte, sql } from "drizzle-orm";
import { ProfileGuard } from "../profileGuard";
import { SelfLearning } from "../selfLearningIntegration";

export const actionPlansRouter = router({
  /**
   * Create action plan (coach assigns homework after session)
   */
  createActionPlan: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      sessionId: z.number().optional(),
      title: z.string().min(1).max(200),
      description: z.string().optional(),
      dueDate: z.string().optional(), // ISO date string
      tasks: z.array(z.object({
        title: z.string().min(1).max(200),
        description: z.string().optional(),
        estimatedMinutes: z.number().optional(),
        priority: z.enum(["low", "medium", "high"]).default("medium"),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // ProfileGuard - Load client context
      const clientContext = await ProfileGuard.getClientContext(input.clientId, {
        moduleName: "action_plans",
        logAccess: true,
      });

      // Create action plan
      const [plan] = await db.insert(actionPlans).values({
        clientId: input.clientId,
        coachId: ctx.user.id,
        sessionId: input.sessionId,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        status: "active",
        createdAt: new Date(),
      }).returning();

      // Create tasks
      const taskPromises = input.tasks.map((task, index) =>
        db.insert(actionPlanTasks).values({
          actionPlanId: plan.id,
          title: task.title,
          description: task.description,
          estimatedMinutes: task.estimatedMinutes,
          priority: task.priority,
          orderIndex: index,
          status: "pending",
          createdAt: new Date(),
        })
      );

      await Promise.all(taskPromises);

      // Self-learning: Track action plan creation
      await SelfLearning.recordInteraction({
        userId: input.clientId,
        interactionType: "action_plan_assigned",
        context: {
          planId: plan.id,
          taskCount: input.tasks.length,
          hasDueDate: !!input.dueDate,
          sessionId: input.sessionId,
        },
        outcome: "success",
      });

      return { success: true, planId: plan.id };
    }),

  /**
   * Get action plans for client (dashboard view)
   */
  getClientActionPlans: protectedProcedure
    .input(z.object({
      clientId: z.number().optional(), // If not provided, use current user
      status: z.enum(["all", "active", "completed", "overdue"]).default("active"),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const clientId = input.clientId || ctx.user.id;

      // ProfileGuard - Load client context
      const clientContext = await ProfileGuard.getClientContext(clientId, {
        moduleName: "action_plans",
        logAccess: true,
      });

      // Build query conditions
      const conditions = [eq(actionPlans.clientId, clientId)];
      
      if (input.status === "active") {
        conditions.push(eq(actionPlans.status, "active"));
      } else if (input.status === "completed") {
        conditions.push(eq(actionPlans.status, "completed"));
      } else if (input.status === "overdue") {
        conditions.push(eq(actionPlans.status, "active"));
        conditions.push(sql`${actionPlans.dueDate} < NOW()`);
      }

      // Get action plans with tasks
      const plans = await db
        .select()
        .from(actionPlans)
        .where(and(...conditions))
        .orderBy(desc(actionPlans.createdAt))
        .limit(input.limit);

      // Get tasks for each plan
      const plansWithTasks = await Promise.all(
        plans.map(async (plan) => {
          const tasks = await db
            .select()
            .from(actionPlanTasks)
            .where(eq(actionPlanTasks.actionPlanId, plan.id))
            .orderBy(actionPlanTasks.orderIndex);

          return {
            ...plan,
            tasks,
            completedTasksCount: tasks.filter(t => t.status === "completed").length,
            totalTasksCount: tasks.length,
            progressPercentage: tasks.length > 0 
              ? Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)
              : 0,
          };
        })
      );

      return plansWithTasks;
    }),

  /**
   * Mark task as complete
   */
  completeTask: protectedProcedure
    .input(z.object({
      taskId: z.number(),
      notes: z.string().optional(), // Client can add notes about completion
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Update task
      await db
        .update(actionPlanTasks)
        .set({
          status: "completed",
          completedAt: new Date(),
          completionNotes: input.notes,
        })
        .where(eq(actionPlanTasks.id, input.taskId));

      // Check if all tasks in plan are complete
      const task = await db.select().from(actionPlanTasks).where(eq(actionPlanTasks.id, input.taskId)).limit(1);
      if (!task.length) throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });

      const allTasks = await db
        .select()
        .from(actionPlanTasks)
        .where(eq(actionPlanTasks.actionPlanId, task[0].actionPlanId));

      const allComplete = allTasks.every(t => t.status === "completed" || t.id === input.taskId);

      if (allComplete) {
        // Mark entire action plan as complete
        await db
          .update(actionPlans)
          .set({ status: "completed", completedAt: new Date() })
          .where(eq(actionPlans.id, task[0].actionPlanId));
      }

      // Self-learning: Track task completion
      await SelfLearning.recordInteraction({
        userId: ctx.user.id,
        interactionType: "task_completed",
        context: {
          taskId: input.taskId,
          planId: task[0].actionPlanId,
          allPlanTasksComplete: allComplete,
        },
        outcome: "success",
      });

      return { success: true, allTasksComplete: allComplete };
    }),

  /**
   * AI-generated action plan suggestions (based on session content)
   */
  generateActionPlanSuggestions: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      clientId: z.number(),
      sessionSummary: z.string().optional(), // Optional summary of session
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // ProfileGuard - Load client context for personalization
      const clientContext = await ProfileGuard.getClientContext(input.clientId, {
        moduleName: "action_plans",
        logAccess: true,
      });

      // Get session details
      const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, input.sessionId))
        .limit(1);

      if (!session.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }

      // Use AI to generate action plan suggestions
      const prompt = `Based on this coaching session, generate 3-5 specific, actionable homework tasks for the client.

Session Summary: ${input.sessionSummary || session[0].notes || "No summary available"}

Client Context:
- Goals: ${clientContext.goals?.slice(0, 3).map(g => g.title).join(", ") || "Not specified"}
- Challenges: ${clientContext.challenges?.slice(0, 3).join(", ") || "Not specified"}
- Recent Progress: ${clientContext.recentProgress || "No recent activity"}

Generate tasks that are:
1. Specific and measurable
2. Achievable within 1 week
3. Directly related to session topics
4. Progressive (build on each other)
5. Include estimated time to complete

Format as JSON array:
[
  {
    "title": "Task title",
    "description": "Detailed description",
    "estimatedMinutes": 30,
    "priority": "high"
  }
]`;

      // Call AI (using OpenAI or similar)
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an expert life coach creating actionable homework assignments." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      const aiResult = await response.json();
      const suggestions = JSON.parse(aiResult.choices[0].message.content);

      return {
        suggestions,
        sessionId: input.sessionId,
        clientId: input.clientId,
      };
    }),
});
