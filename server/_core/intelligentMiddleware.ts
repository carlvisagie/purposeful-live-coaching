/**
 * UNIVERSAL INTELLIGENT SYSTEMS MIDDLEWARE
 * 
 * Automatically wraps ALL tRPC procedures with:
 * 1. Self-Learning - Tracks every interaction, learns patterns, identifies what works
 * 2. Self-Fixing - Automatic error detection, retry logic, fallback systems
 * 3. Self-Evolving - Analyzes outcomes, generates insights, adapts behavior
 * 
 * This ensures NO MODULE gets left behind as the platform evolves.
 * Every endpoint, every interaction, every error contributes to platform intelligence.
 */

import { initTRPC } from "@trpc/server";
import type { TrpcContext } from "./context.js";

// Create middleware builder (avoid circular dependency with trpc.ts)
const t = initTRPC.context<TrpcContext>().create();
const middleware = t.middleware;
import { SelfLearning } from "../selfLearningIntegration.js";
import SelfFixing from "../selfFixing.js";
import PlatformIntelligence from "../platformIntelligence.js";

/**
 * Extract module type from procedure path
 * e.g., "aiChat.sendMessage" -> "ai_chat"
 */
function extractModuleType(path: string): string {
  const module = path.split('.')[0];
  
  // Map router names to module types
  const moduleMapping: Record<string, string> = {
    aiChat: "ai_chat",
    aiCoach: "ai_chat",
    aiMeditation: "meditation",
    focusCoach: "focus_coach",
    sleepStories: "sleep_stories",
    justTalk: "just_talk",
    structuredPrograms: "structured_programs",
    community: "ai_chat",
    goals: "coaching_techniques",
    habits: "coaching_techniques",
    dailyCheckIns: "emotional_wellness",
    healthOptimization: "physical_fitness",
    subscriptions: "coaching_techniques",
    trial: "coaching_techniques",
    emailAutomation: "coaching_techniques",
    analytics: "coaching_techniques",
    admin: "coaching_techniques",
    sessions: "coaching_techniques",
    liveSession: "coaching_techniques",
    coaching: "coaching_techniques",
  };
  
  return moduleMapping[module] || "coaching_techniques";
}

/**
 * Extract action from procedure path
 * e.g., "aiChat.sendMessage" -> "sendMessage"
 */
function extractAction(path: string): string {
  const parts = path.split('.');
  return parts[parts.length - 1] || "unknown";
}

/**
 * Determine if operation was successful based on result and error
 */
function wasOperationSuccessful(error: any, result: any): boolean {
  if (error) return false;
  if (result === null || result === undefined) return true; // Void operations are successful if no error
  if (typeof result === 'object' && 'success' in result) return result.success === true;
  return true; // If we got a result and no error, consider it successful
}

/**
 * Calculate operation duration
 */
function calculateDuration(startTime: number): number {
  return Math.round(Date.now() - startTime);
}

/**
 * Universal Intelligent Systems Middleware
 * 
 * Wraps every tRPC procedure with automatic:
 * - Error tracking and self-fixing
 * - Interaction tracking and self-learning
 * - Performance monitoring
 * - Pattern analysis and self-evolving
 */
export const intelligentSystemsMiddleware = middleware(async ({ path, type, next, ctx, input }) => {
  const startTime = Date.now();
  const moduleType = extractModuleType(path);
  const action = extractAction(path);
  
  // Extract user ID if available
  const userId = ctx.user?.id;
  
  let result: any;
  let error: any;
  let wasSuccessful = false;
  
  try {
    // Execute the procedure with self-fixing retry logic
    result = await SelfFixing.withRetry(
      async () => await next(),
      {
        module: path.split('.')[0],
        operation: action,
        userId,
        errorType: "api",
        severity: "medium",
      },
      {
        maxAttempts: 2, // Only retry once for API calls
        initialDelayMs: 500,
      }
    );
    
    wasSuccessful = wasOperationSuccessful(null, result);
    
  } catch (err) {
    error = err;
    wasSuccessful = false;
    
    // Log error for self-fixing analysis
    SelfFixing.logError(
      err as Error,
      {
        module: path.split('.')[0],
        operation: action,
        userId,
        errorType: "api",
        severity: "high",
        metadata: { path, type, input },
      }
    );
    
    // Re-throw to maintain normal error handling
    throw err;
    
  } finally {
    const duration = calculateDuration(startTime);
    
    // Track interaction for self-learning (async, don't block response)
    SelfLearning.trackInteraction({
      moduleType: moduleType as any,
      userId,
      action,
      duration,
      wasSuccessful,
      metadata: {
        path,
        type,
        hasError: !!error,
        responseTime: duration,
      },
    }).catch(err => {
      console.error('[IntelligentMiddleware] Failed to track interaction:', err);
    });
    
    // Record to Platform Intelligence for evolution (async)
    if (wasSuccessful) {
      PlatformIntelligence.recordModuleInteraction(
        moduleType as any,
        true,
        action,
        { duration, path }
      );
    }
    
    // Track rule effectiveness if this was a recommendation or decision
    if (action.includes('recommend') || action.includes('suggest') || action.includes('analyze')) {
      const ruleId = `${moduleType}_${action}`;
      PlatformIntelligence.recordRuleEffectiveness(
        ruleId,
        wasSuccessful ? "positive" : "negative"
      );
    }
  }
  
  return result;
});

/**
 * Performance monitoring middleware
 * Tracks slow operations for optimization
 */
export const performanceMiddleware = middleware(async ({ path, next }) => {
  const startTime = Date.now();
  
  try {
    const result = await next();
    const duration = Date.now() - startTime;
    
    // Log slow operations (>3 seconds)
    if (duration > 3000) {
      console.warn(`[Performance] Slow operation: ${path} took ${duration}ms`);
      
      // Track as potential issue for self-fixing
      SelfFixing.logError(
        new Error(`Slow operation: ${duration}ms`),
        {
          module: path.split('.')[0],
          operation: path.split('.')[1] || 'unknown',
          errorType: "api",
          severity: "low",
          metadata: { duration, path },
        }
      );
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Performance] Failed operation: ${path} took ${duration}ms before failing`);
    throw error;
  }
});

/**
 * Health check middleware
 * Monitors service health and triggers alerts
 */
export const healthCheckMiddleware = middleware(async ({ path, next }) => {
  try {
    const result = await next();
    
    // Update service health (successful operation)
    const service = path.split('.')[0];
    await SelfFixing.checkHealth(service, async () => true);
    
    return result;
  } catch (error) {
    // Update service health (failed operation)
    const service = path.split('.')[0];
    await SelfFixing.checkHealth(service, async () => false);
    
    throw error;
  }
});

/**
 * Combined intelligent middleware stack
 * Apply all intelligent systems in the correct order
 */
export const intelligentMiddlewareStack = [
  healthCheckMiddleware,
  performanceMiddleware,
  intelligentSystemsMiddleware,
];
