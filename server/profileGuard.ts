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
 * 2. Returns full client context from the UNIFIED CLIENT PROFILE
 * 3. Logs every access for audit trail
 * 4. Alerts on failures so we can fix issues immediately
 * 5. Provides AI-ready context string that modules MUST use
 * 
 * THE UNIFIED CLIENT PROFILE is the SINGLE SOURCE OF TRUTH:
 * - Every chat message
 * - Every phone call transcript
 * - Every video session
 * - Every button pushed
 * - Every link clicked
 * - Every program browsed, started, completed
 * - ALL client data in ONE place
 */

import { db } from "./db";
import { users, clients } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// ============================================================================
// TYPES
// ============================================================================

export interface ClientContext {
  // Identity
  userId: number;
  clientId: number | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  
  // Basic Info
  age: number | null;
  dateOfBirth: Date | null;
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string | null;
  relationshipStatus: string | null;
  hasChildren: string | null;
  
  // Professional
  jobTitle: string | null;
  company: string | null;
  industry: string | null;
  careerGoals: string | null;
  
  // Goals & Motivation
  primaryGoal: string | null;
  goalTimeline: string | null;
  motivation: string | null;
  
  // Identity Architecture
  currentIdentity: string | null;
  targetIdentity: string | null;
  identityGap: string | null;
  coreValues: string | null;
  lifeMission: string | null;
  
  // Behavioral Patterns
  procrastinationTriggers: string | null;
  energyPattern: string | null;
  stressResponses: string | null;
  
  // Health & Wellness
  sleepHours: number | null;
  exerciseFrequency: string | null;
  dietPattern: string | null;
  mentalHealthNotes: string | null;
  
  // Financial
  savingsLevel: string | null;
  hasDebt: string | null;
  monthlyExpensesEstimate: number | null;
  
  // Communication
  communicationStyle: string | null;
  preferredContact: string | null;
  bestTimeToReach: string | null;
  
  // Crisis Indicators
  suicideRiskLevel: string | null;
  crisisFlags: string | null;
  
  // Notes & Status
  notes: string | null;
  status: string | null;
  startDate: Date | null;
  
  // Legacy fields (from users table)
  secondaryGoal: string | null;
  mainChallenges: string[];
  triggers: string[];
  timezone: string | null;
  availability: string | null;
  metadata: Record<string, any>;
  
  // Profile completeness
  profileCompleteness: number;
  
  // For AI prompts - THE MOST IMPORTANT FIELD
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
  clientId: number | null;
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
}

// ============================================================================
// CORE PROFILE GUARD
// ============================================================================

/**
 * Get client context - MUST be called before ANY AI interaction
 * 
 * This pulls from the UNIFIED CLIENT PROFILE (clients table) which contains
 * EVERYTHING we know about this person - every interaction, every click,
 * every conversation, every insight.
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
        clientId: null,
        moduleName: config.moduleName,
        success: true,
        profileCompleteness: 0,
      });
    }
    
    // Return minimal context for anonymous users
    return createEmptyContext(config.moduleName);
  }
  
  try {
    // First, load user for basic auth info
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
        clientId: null,
        moduleName: config.moduleName,
        success: false,
        profileCompleteness: 0,
        errorMessage: "User not found",
      });
      
      return null;
    }
    
    // Now load the UNIFIED CLIENT PROFILE - this is where ALL the good stuff is
    const [client] = await db.select().from(clients).where(eq(clients.userId, userId)).limit(1);
    
    // If no client profile exists yet, we still have basic user info
    // This happens for brand new users who haven't had their profile populated yet
    
    // Parse JSON fields safely from user table (legacy)
    const mainChallenges = parseJsonArray(user.mainChallenges);
    const triggers = parseJsonArray(user.triggers);
    const metadata = parseJsonObject(user.metadata);
    
    // Calculate profile completeness based on client profile (if exists)
    const profileCompleteness = client 
      ? calculateProfileCompleteness(client, user)
      : calculateBasicCompleteness(user);
    
    // Check minimum completeness requirement
    if (config.minProfileCompleteness && profileCompleteness < config.minProfileCompleteness) {
      raiseAlert({
        severity: "warning",
        message: `Profile completeness (${profileCompleteness}%) below required minimum (${config.minProfileCompleteness}%)`,
        moduleName: config.moduleName,
        userId,
      });
    }
    
    // Build the comprehensive AI context string
    const aiContextString = buildAIContextString(client, user, mainChallenges, triggers, metadata);
    
    const context: ClientContext = {
      // Identity
      userId,
      clientId: client?.id || null,
      name: client?.name || user.name,
      email: client?.email || user.email,
      phone: client?.phone || null,
      
      // Basic Info (from Unified Client Profile)
      age: client?.age || null,
      dateOfBirth: client?.dateOfBirth || null,
      locationCity: client?.locationCity || null,
      locationState: client?.locationState || null,
      locationCountry: client?.locationCountry || null,
      relationshipStatus: client?.relationshipStatus || null,
      hasChildren: client?.hasChildren || null,
      
      // Professional
      jobTitle: client?.jobTitle || null,
      company: client?.company || null,
      industry: client?.industry || null,
      careerGoals: client?.careerGoals || null,
      
      // Goals & Motivation
      primaryGoal: client?.primaryGoal || user.primaryGoal,
      goalTimeline: client?.goalTimeline || null,
      motivation: client?.motivation || null,
      
      // Identity Architecture
      currentIdentity: client?.currentIdentity || null,
      targetIdentity: client?.targetIdentity || null,
      identityGap: client?.identityGap || null,
      coreValues: client?.coreValues || null,
      lifeMission: client?.lifeMission || null,
      
      // Behavioral Patterns
      procrastinationTriggers: client?.procrastinationTriggers || null,
      energyPattern: client?.energyPattern || null,
      stressResponses: client?.stressResponses || null,
      
      // Health & Wellness
      sleepHours: client?.sleepHours ? parseFloat(String(client.sleepHours)) : null,
      exerciseFrequency: client?.exerciseFrequency || null,
      dietPattern: client?.dietPattern || null,
      mentalHealthNotes: client?.mentalHealthNotes || null,
      
      // Financial
      savingsLevel: client?.savingsLevel || null,
      hasDebt: client?.hasDebt || null,
      monthlyExpensesEstimate: client?.monthlyExpensesEstimate || null,
      
      // Communication
      communicationStyle: client?.communicationStyle || user.communicationStyle,
      preferredContact: client?.preferredContact || null,
      bestTimeToReach: client?.bestTimeToReach || null,
      
      // Crisis Indicators
      suicideRiskLevel: client?.suicideRiskLevel || null,
      crisisFlags: client?.crisisFlags || null,
      
      // Notes & Status
      notes: client?.notes || null,
      status: client?.status || null,
      startDate: client?.startDate || null,
      
      // Legacy fields (from users table)
      secondaryGoal: user.secondaryGoal,
      mainChallenges,
      triggers,
      timezone: user.timezone,
      availability: user.availability,
      metadata,
      
      // Profile completeness
      profileCompleteness,
      
      // THE MOST IMPORTANT FIELD - what Sage actually sees
      aiContextString,
      
      // Audit
      loadedAt: new Date(),
      loadedBy: config.moduleName,
    };
    
    // Log successful access
    if (config.logAccess !== false) {
      logAccess({
        timestamp: new Date(),
        userId,
        clientId: client?.id || null,
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
    
    console.log(`[ProfileGuard] Loaded profile for ${context.name || 'Unknown'} (userId: ${userId}, clientId: ${context.clientId}) - ${profileCompleteness}% complete`);
    
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
      clientId: null,
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

function createEmptyContext(moduleName: string): ClientContext {
  return {
    userId: 0,
    clientId: null,
    name: null,
    email: null,
    phone: null,
    age: null,
    dateOfBirth: null,
    locationCity: null,
    locationState: null,
    locationCountry: null,
    relationshipStatus: null,
    hasChildren: null,
    jobTitle: null,
    company: null,
    industry: null,
    careerGoals: null,
    primaryGoal: null,
    goalTimeline: null,
    motivation: null,
    currentIdentity: null,
    targetIdentity: null,
    identityGap: null,
    coreValues: null,
    lifeMission: null,
    procrastinationTriggers: null,
    energyPattern: null,
    stressResponses: null,
    sleepHours: null,
    exerciseFrequency: null,
    dietPattern: null,
    mentalHealthNotes: null,
    savingsLevel: null,
    hasDebt: null,
    monthlyExpensesEstimate: null,
    communicationStyle: null,
    preferredContact: null,
    bestTimeToReach: null,
    suicideRiskLevel: null,
    crisisFlags: null,
    notes: null,
    status: null,
    startDate: null,
    secondaryGoal: null,
    mainChallenges: [],
    triggers: [],
    timezone: null,
    availability: null,
    metadata: {},
    profileCompleteness: 0,
    aiContextString: "\n\n[NEW USER - No profile data yet. Learn about them through natural conversation and REMEMBER what they share!]",
    loadedAt: new Date(),
    loadedBy: moduleName,
  };
}

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

function calculateBasicCompleteness(user: any): number {
  const fields = [
    user.name,
    user.primaryGoal,
    user.mainChallenges,
    user.communicationStyle,
  ];
  
  const filledFields = fields.filter(f => f && (typeof f !== "string" || f.trim() !== ""));
  return Math.round((filledFields.length / fields.length) * 100);
}

function calculateProfileCompleteness(client: any, user: any): number {
  // Weight important fields more heavily
  const criticalFields = [
    client.name || user.name,
    client.primaryGoal || user.primaryGoal,
    client.phone || client.email,
  ];
  
  const importantFields = [
    client.motivation,
    client.currentIdentity,
    client.targetIdentity,
    client.coreValues,
    client.communicationStyle || user.communicationStyle,
  ];
  
  const niceToHaveFields = [
    client.age,
    client.jobTitle,
    client.locationCity,
    client.sleepHours,
    client.exerciseFrequency,
    client.energyPattern,
  ];
  
  const criticalFilled = criticalFields.filter(f => f && (typeof f !== "string" || f.trim() !== "")).length;
  const importantFilled = importantFields.filter(f => f && (typeof f !== "string" || f.trim() !== "")).length;
  const niceToHaveFilled = niceToHaveFields.filter(f => f && (typeof f !== "string" || f.trim() !== "")).length;
  
  // Weighted score: critical (50%), important (35%), nice-to-have (15%)
  const criticalScore = (criticalFilled / criticalFields.length) * 50;
  const importantScore = (importantFilled / importantFields.length) * 35;
  const niceToHaveScore = (niceToHaveFilled / niceToHaveFields.length) * 15;
  
  return Math.round(criticalScore + importantScore + niceToHaveScore);
}

function buildAIContextString(
  client: any | null,
  user: any,
  mainChallenges: string[],
  triggers: string[],
  metadata: Record<string, any>
): string {
  const sections: string[] = [];
  
  // Always start with this header
  sections.push("\n\n---\n## 👤 UNIFIED CLIENT PROFILE - EVERYTHING YOU KNOW ABOUT THIS PERSON\n");
  sections.push("**USE THIS INFORMATION! Reference it naturally. Show you REMEMBER them.**\n");
  
  // --- BASIC INFO ---
  const basicInfo: string[] = [];
  const name = client?.name || user.name;
  if (name) basicInfo.push(`**Name:** ${name} - USE THEIR NAME naturally!`);
  if (client?.age) basicInfo.push(`Age: ${client.age}`);
  if (client?.dateOfBirth) basicInfo.push(`Birthday: ${new Date(client.dateOfBirth).toLocaleDateString()}`);
  if (client?.locationCity || client?.locationState || client?.locationCountry) {
    const location = [client.locationCity, client.locationState, client.locationCountry].filter(Boolean).join(', ');
    basicInfo.push(`Location: ${location}`);
  }
  if (client?.relationshipStatus) basicInfo.push(`Relationship: ${client.relationshipStatus}`);
  if (client?.hasChildren) basicInfo.push(`Has Children: ${client.hasChildren}`);
  if (basicInfo.length > 0) {
    sections.push(`### 👤 WHO THEY ARE\n${basicInfo.join('\n')}`);
  }
  
  // --- PROFESSIONAL INFO ---
  const professionalInfo: string[] = [];
  if (client?.jobTitle) professionalInfo.push(`Job Title: ${client.jobTitle}`);
  if (client?.company) professionalInfo.push(`Company: ${client.company}`);
  if (client?.industry) professionalInfo.push(`Industry: ${client.industry}`);
  if (client?.careerGoals) professionalInfo.push(`Career Goals: ${client.careerGoals}`);
  if (professionalInfo.length > 0) {
    sections.push(`### 💼 PROFESSIONAL LIFE\n${professionalInfo.join('\n')}`);
  }
  
  // --- GOALS & MOTIVATION (MOST IMPORTANT) ---
  const goalsInfo: string[] = [];
  const primaryGoal = client?.primaryGoal || user.primaryGoal;
  if (primaryGoal) goalsInfo.push(`🎯 **PRIMARY GOAL:** ${primaryGoal}`);
  if (client?.goalTimeline) goalsInfo.push(`Timeline: ${client.goalTimeline}`);
  if (client?.motivation) goalsInfo.push(`What Drives Them: ${client.motivation}`);
  if (user.secondaryGoal) goalsInfo.push(`Secondary Goal: ${user.secondaryGoal}`);
  if (goalsInfo.length > 0) {
    sections.push(`### 🎯 THEIR GOALS & MOTIVATION\n${goalsInfo.join('\n')}`);
  }
  
  // --- IDENTITY ARCHITECTURE ---
  const identityInfo: string[] = [];
  if (client?.currentIdentity) identityInfo.push(`Current Identity: ${client.currentIdentity}`);
  if (client?.targetIdentity) identityInfo.push(`Who They Want to Become: ${client.targetIdentity}`);
  if (client?.identityGap) identityInfo.push(`The Gap: ${client.identityGap}`);
  if (client?.coreValues) identityInfo.push(`Core Values: ${client.coreValues}`);
  if (client?.lifeMission) identityInfo.push(`Life Mission: ${client.lifeMission}`);
  if (identityInfo.length > 0) {
    sections.push(`### 🔥 IDENTITY & VALUES\n${identityInfo.join('\n')}`);
  }
  
  // --- CHALLENGES & TRIGGERS ---
  const challengeInfo: string[] = [];
  if (mainChallenges.length > 0) challengeInfo.push(`Challenges: ${mainChallenges.join(', ')}`);
  if (triggers.length > 0) challengeInfo.push(`⚠️ TRIGGERS TO AVOID: ${triggers.join(', ')}`);
  if (client?.procrastinationTriggers) challengeInfo.push(`Procrastination Triggers: ${client.procrastinationTriggers}`);
  if (client?.stressResponses) challengeInfo.push(`How They Handle Stress: ${client.stressResponses}`);
  if (challengeInfo.length > 0) {
    sections.push(`### 🧠 CHALLENGES & PATTERNS\n${challengeInfo.join('\n')}`);
  }
  
  // --- HEALTH & WELLNESS ---
  const healthInfo: string[] = [];
  if (client?.sleepHours) healthInfo.push(`Sleep: ${client.sleepHours} hours`);
  if (client?.exerciseFrequency) healthInfo.push(`Exercise: ${client.exerciseFrequency}`);
  if (client?.dietPattern) healthInfo.push(`Diet: ${client.dietPattern}`);
  if (client?.energyPattern) healthInfo.push(`Energy Pattern: ${client.energyPattern}`);
  if (client?.mentalHealthNotes) healthInfo.push(`Mental Health Notes: ${client.mentalHealthNotes}`);
  if (metadata.sleepPatterns) healthInfo.push(`Sleep Patterns: ${metadata.sleepPatterns}`);
  if (metadata.stressors?.length) healthInfo.push(`Current Stressors: ${metadata.stressors.join(', ')}`);
  if (metadata.healthConcerns?.length) healthInfo.push(`Health Concerns: ${metadata.healthConcerns.join(', ')}`);
  if (healthInfo.length > 0) {
    sections.push(`### 💪 HEALTH & WELLNESS\n${healthInfo.join('\n')}`);
  }
  
  // --- FINANCIAL SITUATION ---
  const financialInfo: string[] = [];
  if (client?.savingsLevel) financialInfo.push(`Savings: ${client.savingsLevel}`);
  if (client?.hasDebt) financialInfo.push(`Has Debt: ${client.hasDebt}`);
  if (client?.monthlyExpensesEstimate) financialInfo.push(`Monthly Expenses: ~$${client.monthlyExpensesEstimate}`);
  if (financialInfo.length > 0) {
    sections.push(`### 💰 FINANCIAL CONTEXT\n${financialInfo.join('\n')}`);
  }
  
  // --- COMMUNICATION PREFERENCES ---
  const commInfo: string[] = [];
  const commStyle = client?.communicationStyle || user.communicationStyle;
  if (commStyle) commInfo.push(`Communication Style: ${commStyle}`);
  if (client?.preferredContact) commInfo.push(`Preferred Contact: ${client.preferredContact}`);
  if (client?.bestTimeToReach) commInfo.push(`Best Time: ${client.bestTimeToReach}`);
  if (user.timezone) commInfo.push(`Timezone: ${user.timezone}`);
  if (commInfo.length > 0) {
    sections.push(`### 💬 HOW TO COMMUNICATE WITH THEM\n${commInfo.join('\n')}`);
  }
  
  // --- CRISIS INDICATORS (CRITICAL SAFETY INFO) ---
  const crisisInfo: string[] = [];
  if (client?.suicideRiskLevel && client.suicideRiskLevel !== 'none') {
    crisisInfo.push(`🚨 SUICIDE RISK LEVEL: ${client.suicideRiskLevel}`);
  }
  if (client?.crisisFlags) crisisInfo.push(`Crisis Flags: ${client.crisisFlags}`);
  if (crisisInfo.length > 0) {
    sections.push(`### 🚨 CRISIS AWARENESS (HANDLE WITH CARE)\n${crisisInfo.join('\n')}`);
  }
  
  // --- NOTES & STATUS ---
  const notesInfo: string[] = [];
  if (client?.notes) notesInfo.push(`Notes: ${client.notes}`);
  if (client?.status) notesInfo.push(`Status: ${client.status}`);
  if (client?.startDate) notesInfo.push(`Client Since: ${new Date(client.startDate).toLocaleDateString()}`);
  if (notesInfo.length > 0) {
    sections.push(`### 📝 NOTES & HISTORY\n${notesInfo.join('\n')}`);
  }
  
  // If we have almost no data, return new user message
  if (sections.length <= 2) {
    return "\n\n[NEW USER - No profile data yet. Learn about them through natural conversation and REMEMBER what they share! Everything they tell you should be saved to their Unified Client Profile.]";
  }
  
  // Add critical reminder at the end
  sections.push("\n**CRITICAL:** Reference this information naturally. Show you REMEMBER them. This is what creates trust and loyalty. They should feel like the ONLY person you've ever talked to.");
  
  return sections.join('\n\n');
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
