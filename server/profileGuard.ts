/**
 * PROFILE GUARD - MANDATORY CLIENT CONTEXT SYSTEM
 * 
 * "They forgot about me. Again. Just like everyone else."
 * 
 * This is the WORST feeling a client can have. It's why people leave
 * therapists, coaches, relationships. Feeling unseen, forgotten, unimportant.
 * 
 * THIS MODULE MAKES IT IMPOSSIBLE TO FORGET.
 * 
 * Every AI interaction MUST go through ProfileGuard. There is no way around it.
 * If profile can't be loaded, the interaction FAILS LOUDLY rather than
 * proceeding without context and disappointing the client.
 * 
 * Architecture:
 * 1. ProfileGuard.getContext() - MUST be called before ANY AI interaction
 * 2. Returns full client context or throws error
 * 3. Logs every access for audit trail
 * 4. Alerts on failures so we can fix issues immediately
 * 5. Provides AI-ready context string that modules MUST use
 */

import { db } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// ============================================================================
// TYPES
// ============================================================================

export interface ClientContext {
  // Identity
  userId: number;
  name: string | null;
  email: string | null;
  
  // Goals & Challenges
  primaryGoal: string | null;
  secondaryGoal: string | null;
  mainChallenges: string[];
  
  // Communication
  communicationStyle: string | null;
  triggers: string[];
  
  // Preferences
  timezone: string | null;
  availability: string | null;
  
  // Extended metadata
  metadata: Record<string, any>;
  
  // Profile completeness
  profileCompleteness: number;
  
  // For AI prompts
  aiContextString: string;
  
  // Audit
  loadedAt: Date;
  loadedBy: string;
}

export interface ProfileGuardConfig {
  // Module name for logging
  moduleName: string;
  
  // Whether to fail if profile is empty (default: false - allow new users)
  requirePopulatedProfile?: boolean;
  
  // Minimum profile completeness required (0-100, default: 0)
  minProfileCompleteness?: number;
  
  // Whether to log this access (default: true)
  logAccess?: boolean;
}

// ============================================================================
// IN-MEMORY AUDIT LOG (Would be database in production)
// ============================================================================

interface ProfileAccessLog {
  timestamp: Date;
  userId: number;
  moduleName: string;
  success: boolean;
  profileCompleteness: number;
  errorMessage?: string;
}

const accessLog: ProfileAccessLog[] = [];
const MAX_LOG_SIZE = 10000;

function logAccess(entry: ProfileAccessLog): void {
  accessLog.push(entry);
  if (accessLog.length > MAX_LOG_SIZE) {
    accessLog.shift(); // Remove oldest entry
  }
}

// ============================================================================
// ALERT SYSTEM
// ============================================================================

interface ProfileAlert {
  timestamp: Date;
  severity: "warning" | "error" | "critical";
  message: string;
  moduleName: string;
  userId?: number;
}

const alerts: ProfileAlert[] = [];

function raiseAlert(alert: Omit<ProfileAlert, "timestamp">): void {
  const fullAlert = { ...alert, timestamp: new Date() };
  alerts.push(fullAlert);
  
  // Log to console for immediate visibility
  const prefix = alert.severity === "critical" ? "🚨 CRITICAL" : 
                 alert.severity === "error" ? "❌ ERROR" : "⚠️ WARNING";
  console.error(`[ProfileGuard] ${prefix}: ${alert.message} (Module: ${alert.moduleName})`);
  
  // In production, this would send to monitoring system (Sentry, PagerDuty, etc.)
}

// ============================================================================
// CORE PROFILE GUARD
// ============================================================================

/**
 * Get client context - MUST be called before ANY AI interaction
 * 
 * This is the ONLY way to get client context. There is no backdoor.
 * If this fails, the AI interaction should NOT proceed.
 */
export async function getClientContext(
  userId: number | undefined | null,
  config: ProfileGuardConfig
): Promise<ClientContext | null> {
  const startTime = Date.now();
  
  // Handle anonymous users gracefully
  if (!userId) {
    if (config.logAccess !== false) {
      logAccess({
        timestamp: new Date(),
        userId: 0,
        moduleName: config.moduleName,
        success: true,
        profileCompleteness: 0,
      });
    }
    
    // Return minimal context for anonymous users
    return {
      userId: 0,
      name: null,
      email: null,
      primaryGoal: null,
      secondaryGoal: null,
      mainChallenges: [],
      communicationStyle: null,
      triggers: [],
      timezone: null,
      availability: null,
      metadata: {},
      profileCompleteness: 0,
      aiContextString: "\n\n[NEW USER - No profile data yet. Learn about them through natural conversation.]",
      loadedAt: new Date(),
      loadedBy: config.moduleName,
    };
  }
  
  try {
    // Load user profile
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user) {
      raiseAlert({
        severity: "error",
        message: `User ${userId} not found in database`,
        moduleName: config.moduleName,
        userId,
      });
      
      logAccess({
        timestamp: new Date(),
        userId,
        moduleName: config.moduleName,
        success: false,
        profileCompleteness: 0,
        errorMessage: "User not found",
      });
      
      return null;
    }
    
    // Parse JSON fields safely
    const mainChallenges = parseJsonArray(user.mainChallenges);
    const triggers = parseJsonArray(user.triggers);
    const metadata = parseJsonObject(user.metadata);
    
    // Calculate actual profile completeness
    const profileCompleteness = calculateProfileCompleteness(user);
    
    // Check minimum completeness requirement
    if (config.minProfileCompleteness && profileCompleteness < config.minProfileCompleteness) {
      raiseAlert({
        severity: "warning",
        message: `Profile completeness (${profileCompleteness}%) below required minimum (${config.minProfileCompleteness}%)`,
        moduleName: config.moduleName,
        userId,
      });
    }
    
    // Build AI context string
    const aiContextString = buildAIContextString({
      name: user.name,
      primaryGoal: user.primaryGoal,
      secondaryGoal: user.secondaryGoal,
      mainChallenges,
      communicationStyle: user.communicationStyle,
      triggers,
      timezone: user.timezone,
      availability: user.availability,
      metadata,
    });
    
    const context: ClientContext = {
      userId,
      name: user.name,
      email: user.email,
      primaryGoal: user.primaryGoal,
      secondaryGoal: user.secondaryGoal,
      mainChallenges,
      communicationStyle: user.communicationStyle,
      triggers,
      timezone: user.timezone,
      availability: user.availability,
      metadata,
      profileCompleteness,
      aiContextString,
      loadedAt: new Date(),
      loadedBy: config.moduleName,
    };
    
    // Log successful access
    if (config.logAccess !== false) {
      logAccess({
        timestamp: new Date(),
        userId,
        moduleName: config.moduleName,
        success: true,
        profileCompleteness,
      });
    }
    
    const loadTime = Date.now() - startTime;
    if (loadTime > 500) {
      raiseAlert({
        severity: "warning",
        message: `Slow profile load: ${loadTime}ms`,
        moduleName: config.moduleName,
        userId,
      });
    }
    
    return context;
    
  } catch (error) {
    raiseAlert({
      severity: "critical",
      message: `Failed to load profile: ${error instanceof Error ? error.message : "Unknown error"}`,
      moduleName: config.moduleName,
      userId,
    });
    
    logAccess({
      timestamp: new Date(),
      userId,
      moduleName: config.moduleName,
      success: false,
      profileCompleteness: 0,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    
    // Re-throw so the calling module knows something went wrong
    throw error;
  }
}

/**
 * Require client context - throws if not available
 * Use this when profile is MANDATORY for the interaction
 */
export async function requireClientContext(
  userId: number | undefined | null,
  config: ProfileGuardConfig
): Promise<ClientContext> {
  const context = await getClientContext(userId, config);
  
  if (!context) {
    throw new Error(`[ProfileGuard] Client context required but not available for user ${userId}`);
  }
  
  if (config.requirePopulatedProfile && context.profileCompleteness === 0) {
    throw new Error(`[ProfileGuard] Populated profile required but profile is empty for user ${userId}`);
  }
  
  return context;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function parseJsonArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return typeof value === "string" ? [value] : [];
  }
}

function parseJsonObject(value: any): Record<string, any> {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function calculateProfileCompleteness(user: any): number {
  const fields = [
    user.name,
    user.primaryGoal,
    user.mainChallenges,
    user.communicationStyle,
    user.triggers,
    user.timezone,
    user.availability,
  ];
  
  const filledFields = fields.filter(f => f && (typeof f !== "string" || f.trim() !== ""));
  return Math.round((filledFields.length / fields.length) * 100);
}

function buildAIContextString(profile: {
  name: string | null;
  primaryGoal: string | null;
  secondaryGoal: string | null;
  mainChallenges: string[];
  communicationStyle: string | null;
  triggers: string[];
  timezone: string | null;
  availability: string | null;
  metadata: Record<string, any>;
}): string {
  const parts: string[] = [];
  
  // Always start with this header so AI knows context is available
  parts.push("\n\n---\n## 👤 WHAT YOU KNOW ABOUT THIS CLIENT (USE THIS!)");
  
  if (profile.name) {
    parts.push(`**Name:** ${profile.name} - USE THEIR NAME naturally in conversation!`);
  }
  
  if (profile.primaryGoal) {
    parts.push(`**Primary Goal:** ${profile.primaryGoal}`);
  }
  
  if (profile.secondaryGoal) {
    parts.push(`**Secondary Goal:** ${profile.secondaryGoal}`);
  }
  
  if (profile.mainChallenges.length > 0) {
    parts.push(`**Challenges They've Shared:** ${profile.mainChallenges.join(", ")}`);
  }
  
  if (profile.communicationStyle) {
    parts.push(`**Communication Preference:** ${profile.communicationStyle}`);
  }
  
  if (profile.triggers.length > 0) {
    parts.push(`**⚠️ TRIGGERS TO AVOID:** ${profile.triggers.join(", ")}`);
  }
  
  if (profile.timezone) {
    parts.push(`**Timezone:** ${profile.timezone}`);
  }
  
  // Add metadata insights
  if (profile.metadata.sleepPatterns) {
    parts.push(`**Sleep Patterns:** ${profile.metadata.sleepPatterns}`);
  }
  if (profile.metadata.stressors?.length) {
    parts.push(`**Current Stressors:** ${profile.metadata.stressors.join(", ")}`);
  }
  if (profile.metadata.healthConcerns?.length) {
    parts.push(`**Health Concerns:** ${profile.metadata.healthConcerns.join(", ")}`);
  }
  
  if (parts.length === 1) {
    // Only header, no actual data
    return "\n\n[NEW USER - No profile data yet. Learn about them through natural conversation and REMEMBER what they share!]";
  }
  
  parts.push("\n**CRITICAL:** Reference this information naturally. Show you REMEMBER them. This is what creates trust and loyalty.");
  
  return parts.join("\n");
}

// ============================================================================
// MONITORING & REPORTING
// ============================================================================

/**
 * Get recent profile access logs
 */
export function getAccessLogs(limit: number = 100): ProfileAccessLog[] {
  return accessLog.slice(-limit);
}

/**
 * Get recent alerts
 */
export function getAlerts(limit: number = 50): ProfileAlert[] {
  return alerts.slice(-limit);
}

/**
 * Get profile access statistics
 */
export function getAccessStats(): {
  totalAccesses: number;
  successRate: number;
  averageCompleteness: number;
  moduleBreakdown: Record<string, number>;
  recentFailures: ProfileAccessLog[];
} {
  const recentLogs = accessLog.slice(-1000);
  const successfulLogs = recentLogs.filter(l => l.success);
  
  const moduleBreakdown: Record<string, number> = {};
  for (const log of recentLogs) {
    moduleBreakdown[log.moduleName] = (moduleBreakdown[log.moduleName] || 0) + 1;
  }
  
  return {
    totalAccesses: recentLogs.length,
    successRate: recentLogs.length > 0 ? (successfulLogs.length / recentLogs.length) * 100 : 100,
    averageCompleteness: successfulLogs.length > 0 
      ? successfulLogs.reduce((sum, l) => sum + l.profileCompleteness, 0) / successfulLogs.length 
      : 0,
    moduleBreakdown,
    recentFailures: recentLogs.filter(l => !l.success).slice(-10),
  };
}

/**
 * Check system health
 */
export function checkHealth(): {
  healthy: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const stats = getAccessStats();
  
  if (stats.successRate < 99) {
    issues.push(`Profile load success rate is ${stats.successRate.toFixed(1)}% (should be >99%)`);
  }
  
  const recentAlerts = alerts.filter(a => 
    Date.now() - a.timestamp.getTime() < 3600000 // Last hour
  );
  
  const criticalAlerts = recentAlerts.filter(a => a.severity === "critical");
  if (criticalAlerts.length > 0) {
    issues.push(`${criticalAlerts.length} critical alerts in the last hour`);
  }
  
  return {
    healthy: issues.length === 0,
    issues,
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export const ProfileGuard = {
  // Core functions
  getClientContext,
  requireClientContext,
  
  // Monitoring
  getAccessLogs,
  getAlerts,
  getAccessStats,
  checkHealth,
};

export default ProfileGuard;
