/**
 * EVENT TRACKING SERVICE
 * 
 * Part of the Unified Client Profile - captures EVERY interaction to better
 * understand and help clients.
 * 
 * This service provides:
 * - Event logging (every click, view, scroll, etc.)
 * - Session management
 * - Feature usage aggregation
 * - Pattern detection
 * - AI-ready insights for Sage
 */

import { getDb } from "../db";
import { 
  clientEvents, 
  clientSessions, 
  clientFeatureUsage, 
  clientPageEngagement,
  clientBehavioralPatterns 
} from "../../drizzle/schema";
import { eq, and, desc, sql, gte } from "drizzle-orm";

// ============================================================================
// TYPES
// ============================================================================

export interface TrackEventInput {
  clientId: number;
  eventType: 'click' | 'view' | 'scroll' | 'input' | 'navigation' | 'feature' | 'error' | 'custom';
  eventCategory: 'ui' | 'feature' | 'content' | 'session' | 'conversion' | 'error';
  eventAction: string;
  eventLabel?: string;
  pagePath?: string;
  pageTitle?: string;
  componentName?: string;
  elementId?: string;
  elementText?: string;
  sessionId?: string;
  timeOnPage?: number;
  scrollDepth?: number;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  browserName?: string;
  screenSize?: string;
  metadata?: Record<string, any>;
  sentimentHint?: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited';
  engagementLevel?: 'high' | 'medium' | 'low' | 'abandoning';
}

export interface SessionInput {
  clientId: number;
  sessionId: string;
  deviceType?: string;
  browserName?: string;
  operatingSystem?: string;
  screenSize?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  entryPage?: string;
}

export interface ClientInsights {
  recentActivity: string[];
  engagementPatterns: string[];
  featurePreferences: string[];
  behavioralInsights: string[];
  suggestedTopics: string[];
}

// ============================================================================
// EVENT TRACKING
// ============================================================================

/**
 * Track a single event
 */
export async function trackEvent(input: TrackEventInput): Promise<void> {
  const db = getDb();
  
  try {
    // Get time since last event for this client
    const lastEvent = await db.query.clientEvents?.findFirst({
      where: eq(clientEvents.clientId, input.clientId),
      orderBy: desc(clientEvents.timestamp),
    });
    
    const timeSinceLastEvent = lastEvent 
      ? Math.floor((Date.now() - new Date(lastEvent.timestamp).getTime()) / 1000)
      : null;
    
    // Determine viewport position from scroll depth
    let viewportPosition: string | undefined;
    if (input.scrollDepth !== undefined) {
      if (input.scrollDepth < 25) viewportPosition = 'top';
      else if (input.scrollDepth < 75) viewportPosition = 'middle';
      else viewportPosition = 'bottom';
    }
    
    // Insert the event
    await db.insert(clientEvents).values({
      clientId: input.clientId,
      eventType: input.eventType,
      eventCategory: input.eventCategory,
      eventAction: input.eventAction,
      eventLabel: input.eventLabel,
      pagePath: input.pagePath,
      pageTitle: input.pageTitle,
      componentName: input.componentName,
      elementId: input.elementId,
      elementText: input.elementText,
      sessionId: input.sessionId,
      timeOnPage: input.timeOnPage,
      timeSinceLastEvent: timeSinceLastEvent,
      scrollDepth: input.scrollDepth,
      viewportPosition: viewportPosition,
      deviceType: input.deviceType,
      browserName: input.browserName,
      screenSize: input.screenSize,
      metadata: input.metadata,
      sentimentHint: input.sentimentHint,
      engagementLevel: input.engagementLevel,
    });
    
    // Update session event count if session exists
    if (input.sessionId) {
      await db.update(clientSessions)
        .set({ 
          eventCount: sql`${clientSessions.eventCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(clientSessions.sessionId, input.sessionId));
    }
    
    // Update page engagement stats
    if (input.pagePath) {
      await updatePageEngagement(input.clientId, input.pagePath, input.pageTitle, input.scrollDepth);
    }
    
    // Update feature usage if this is a feature event
    if (input.eventCategory === 'feature' && input.eventLabel) {
      await updateFeatureUsage(input.clientId, input.eventLabel);
    }
    
    console.log(`[EventTracking] Tracked: ${input.eventAction} for client ${input.clientId}`);
  } catch (error) {
    console.error('[EventTracking] Error tracking event:', error);
  }
}

/**
 * Track multiple events in batch
 */
export async function trackEventsBatch(events: TrackEventInput[]): Promise<void> {
  for (const event of events) {
    await trackEvent(event);
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Start a new session
 */
export async function startSession(input: SessionInput): Promise<void> {
  const db = getDb();
  
  try {
    await db.insert(clientSessions).values({
      clientId: input.clientId,
      sessionId: input.sessionId,
      startedAt: new Date(),
      entryPage: input.entryPage,
      deviceType: input.deviceType,
      browserName: input.browserName,
      operatingSystem: input.operatingSystem,
      screenSize: input.screenSize,
      referrer: input.referrer,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      pageCount: 1,
      eventCount: 0,
    });
    
    console.log(`[EventTracking] Started session ${input.sessionId} for client ${input.clientId}`);
  } catch (error) {
    console.error('[EventTracking] Error starting session:', error);
  }
}

/**
 * End a session
 */
export async function endSession(sessionId: string, exitPage?: string): Promise<void> {
  const db = getDb();
  
  try {
    const session = await db.query.clientSessions?.findFirst({
      where: eq(clientSessions.sessionId, sessionId),
    });
    
    if (session) {
      const durationSeconds = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);
      const bounced = (session.pageCount || 0) <= 1 ? 'yes' : 'no';
      const engaged = (session.eventCount || 0) >= 5 ? 'yes' : 'no';
      
      await db.update(clientSessions)
        .set({
          endedAt: new Date(),
          durationSeconds,
          exitPage,
          bounced,
          engaged,
          updatedAt: new Date(),
        })
        .where(eq(clientSessions.sessionId, sessionId));
      
      console.log(`[EventTracking] Ended session ${sessionId} (${durationSeconds}s)`);
    }
  } catch (error) {
    console.error('[EventTracking] Error ending session:', error);
  }
}

/**
 * Update session page count
 */
export async function updateSessionPageCount(sessionId: string): Promise<void> {
  const db = getDb();
  
  try {
    await db.update(clientSessions)
      .set({ 
        pageCount: sql`${clientSessions.pageCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(clientSessions.sessionId, sessionId));
  } catch (error) {
    console.error('[EventTracking] Error updating session page count:', error);
  }
}

// ============================================================================
// PAGE ENGAGEMENT
// ============================================================================

/**
 * Update page engagement stats
 */
async function updatePageEngagement(
  clientId: number, 
  pagePath: string, 
  pageTitle?: string,
  scrollDepth?: number
): Promise<void> {
  const db = getDb();
  
  try {
    const existing = await db.query.clientPageEngagement?.findFirst({
      where: and(
        eq(clientPageEngagement.clientId, clientId),
        eq(clientPageEngagement.pagePath, pagePath)
      ),
    });
    
    if (existing) {
      // Update existing record
      const newTotalVisits = (existing.totalVisits || 0) + 1;
      const newAvgScrollDepth = scrollDepth !== undefined
        ? Math.round(((existing.averageScrollDepth || 0) * (existing.totalVisits || 0) + scrollDepth) / newTotalVisits)
        : existing.averageScrollDepth;
      
      await db.update(clientPageEngagement)
        .set({
          totalVisits: newTotalVisits,
          averageScrollDepth: newAvgScrollDepth,
          lastVisitedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(clientPageEngagement.id, existing.id));
    } else {
      // Create new record
      await db.insert(clientPageEngagement).values({
        clientId,
        pagePath,
        pageTitle,
        totalVisits: 1,
        averageScrollDepth: scrollDepth || 0,
        firstVisitedAt: new Date(),
        lastVisitedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('[EventTracking] Error updating page engagement:', error);
  }
}

// ============================================================================
// FEATURE USAGE
// ============================================================================

/**
 * Update feature usage stats
 */
async function updateFeatureUsage(clientId: number, featureName: string): Promise<void> {
  const db = getDb();
  
  try {
    const existing = await db.query.clientFeatureUsage?.findFirst({
      where: and(
        eq(clientFeatureUsage.clientId, clientId),
        eq(clientFeatureUsage.featureName, featureName)
      ),
    });
    
    if (existing) {
      await db.update(clientFeatureUsage)
        .set({
          totalUses: sql`${clientFeatureUsage.totalUses} + 1`,
          lastUsedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(clientFeatureUsage.id, existing.id));
    } else {
      await db.insert(clientFeatureUsage).values({
        clientId,
        featureName,
        totalUses: 1,
        firstUsedAt: new Date(),
        lastUsedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('[EventTracking] Error updating feature usage:', error);
  }
}

/**
 * Track feature start (for timing)
 */
export async function trackFeatureStart(
  clientId: number, 
  featureName: string,
  sessionId?: string
): Promise<void> {
  await trackEvent({
    clientId,
    eventType: 'feature',
    eventCategory: 'feature',
    eventAction: 'feature_start',
    eventLabel: featureName,
    sessionId,
    metadata: { startTime: Date.now() },
  });
}

/**
 * Track feature end (for timing and completion)
 */
export async function trackFeatureEnd(
  clientId: number, 
  featureName: string,
  completed: boolean,
  durationSeconds: number,
  sessionId?: string
): Promise<void> {
  await trackEvent({
    clientId,
    eventType: 'feature',
    eventCategory: 'feature',
    eventAction: completed ? 'feature_complete' : 'feature_abandon',
    eventLabel: featureName,
    sessionId,
    metadata: { 
      completed,
      durationSeconds,
      endTime: Date.now(),
    },
  });
}

// ============================================================================
// AI-READY INSIGHTS FOR SAGE
// ============================================================================

/**
 * Get comprehensive insights about a client for Sage
 * This is the key function that turns raw event data into coaching gold
 */
export async function getClientInsightsForSage(clientId: number): Promise<ClientInsights> {
  const db = getDb();
  const insights: ClientInsights = {
    recentActivity: [],
    engagementPatterns: [],
    featurePreferences: [],
    behavioralInsights: [],
    suggestedTopics: [],
  };
  
  try {
    // Get recent events (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentEvents = await db.query.clientEvents?.findMany({
      where: and(
        eq(clientEvents.clientId, clientId),
        gte(clientEvents.timestamp, sevenDaysAgo)
      ),
      orderBy: desc(clientEvents.timestamp),
      limit: 100,
    });
    
    if (recentEvents && recentEvents.length > 0) {
      // Analyze recent activity
      const pageVisits = recentEvents.filter(e => e.eventAction === 'page_view');
      const uniquePages = [...new Set(pageVisits.map(e => e.pageTitle || e.pagePath))];
      
      if (uniquePages.length > 0) {
        insights.recentActivity.push(`Recently visited: ${uniquePages.slice(0, 5).join(', ')}`);
      }
      
      // Check for repeated visits to same page (interest indicator)
      const pageCounts: Record<string, number> = {};
      pageVisits.forEach(e => {
        const page = e.pageTitle || e.pagePath || 'unknown';
        pageCounts[page] = (pageCounts[page] || 0) + 1;
      });
      
      const frequentPages = Object.entries(pageCounts)
        .filter(([_, count]) => count >= 3)
        .map(([page, count]) => `${page} (${count} visits)`);
      
      if (frequentPages.length > 0) {
        insights.engagementPatterns.push(`Frequently returning to: ${frequentPages.join(', ')}`);
      }
      
      // Check for abandonment patterns
      const abandonEvents = recentEvents.filter(e => e.eventAction.includes('abandon'));
      if (abandonEvents.length > 0) {
        const abandonedFeatures = [...new Set(abandonEvents.map(e => e.eventLabel))];
        insights.behavioralInsights.push(`Started but didn't complete: ${abandonedFeatures.join(', ')}`);
        insights.suggestedTopics.push(`Ask about challenges with: ${abandonedFeatures[0]}`);
      }
      
      // Check engagement levels
      const lowEngagement = recentEvents.filter(e => e.engagementLevel === 'low' || e.engagementLevel === 'abandoning');
      if (lowEngagement.length > recentEvents.length * 0.3) {
        insights.behavioralInsights.push('Showing signs of reduced engagement recently');
        insights.suggestedTopics.push('Check in on how they\'re feeling about their progress');
      }
      
      // Check for frustrated sentiment
      const frustrated = recentEvents.filter(e => e.sentimentHint === 'frustrated');
      if (frustrated.length > 0) {
        const frustratedAreas = [...new Set(frustrated.map(e => e.pageTitle || e.pagePath))];
        insights.behavioralInsights.push(`Showed frustration in: ${frustratedAreas.join(', ')}`);
      }
    }
    
    // Get feature usage
    const featureUsage = await db.query.clientFeatureUsage?.findMany({
      where: eq(clientFeatureUsage.clientId, clientId),
      orderBy: desc(clientFeatureUsage.totalUses),
      limit: 10,
    });
    
    if (featureUsage && featureUsage.length > 0) {
      const topFeatures = featureUsage.slice(0, 3).map(f => f.featureName);
      insights.featurePreferences.push(`Most used features: ${topFeatures.join(', ')}`);
      
      // Check for unused features
      const lowUsage = featureUsage.filter(f => (f.totalUses || 0) === 1);
      if (lowUsage.length > 0) {
        insights.featurePreferences.push(`Tried once but didn't return to: ${lowUsage.map(f => f.featureName).join(', ')}`);
      }
      
      // Check for streaks
      const streaks = featureUsage.filter(f => (f.streakCurrent || 0) >= 3);
      if (streaks.length > 0) {
        insights.engagementPatterns.push(`On a streak with: ${streaks.map(f => `${f.featureName} (${f.streakCurrent} days)`).join(', ')}`);
      }
    }
    
    // Get recent sessions
    const recentSessions = await db.query.clientSessions?.findMany({
      where: eq(clientSessions.clientId, clientId),
      orderBy: desc(clientSessions.startedAt),
      limit: 10,
    });
    
    if (recentSessions && recentSessions.length > 0) {
      // Check session patterns
      const avgDuration = recentSessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) / recentSessions.length;
      
      if (avgDuration > 600) { // More than 10 minutes
        insights.engagementPatterns.push(`Highly engaged - average session: ${Math.round(avgDuration / 60)} minutes`);
      } else if (avgDuration < 60) {
        insights.behavioralInsights.push('Sessions are very short - may need more engaging content');
      }
      
      // Check bounce rate
      const bounced = recentSessions.filter(s => s.bounced === 'yes').length;
      if (bounced > recentSessions.length * 0.5) {
        insights.behavioralInsights.push('Often leaving after viewing just one page');
      }
    }
    
    // Get behavioral patterns
    const patterns = await db.query.clientBehavioralPatterns?.findMany({
      where: and(
        eq(clientBehavioralPatterns.clientId, clientId),
        eq(clientBehavioralPatterns.isActive, 'yes')
      ),
      orderBy: desc(clientBehavioralPatterns.confidence),
      limit: 5,
    });
    
    if (patterns && patterns.length > 0) {
      patterns.forEach(p => {
        if (p.description) {
          insights.behavioralInsights.push(p.description);
        }
        if (p.suggestedAction && p.coachingRelevance === 'high') {
          insights.suggestedTopics.push(p.suggestedAction);
        }
      });
    }
    
  } catch (error) {
    console.error('[EventTracking] Error getting client insights:', error);
  }
  
  return insights;
}

/**
 * Get a formatted string of insights for Sage's context
 */
export async function getClientInsightsString(clientId: number): Promise<string> {
  const insights = await getClientInsightsForSage(clientId);
  
  const sections: string[] = [];
  
  if (insights.recentActivity.length > 0) {
    sections.push(`**Recent Activity:**\n${insights.recentActivity.join('\n')}`);
  }
  
  if (insights.engagementPatterns.length > 0) {
    sections.push(`**Engagement Patterns:**\n${insights.engagementPatterns.join('\n')}`);
  }
  
  if (insights.featurePreferences.length > 0) {
    sections.push(`**Feature Preferences:**\n${insights.featurePreferences.join('\n')}`);
  }
  
  if (insights.behavioralInsights.length > 0) {
    sections.push(`**Behavioral Insights:**\n${insights.behavioralInsights.join('\n')}`);
  }
  
  if (insights.suggestedTopics.length > 0) {
    sections.push(`**Suggested Topics to Explore:**\n${insights.suggestedTopics.join('\n')}`);
  }
  
  if (sections.length === 0) {
    return 'No behavioral data available yet - this may be a new client.';
  }
  
  return sections.join('\n\n');
}

// ============================================================================
// PATTERN DETECTION (Run periodically)
// ============================================================================

/**
 * Detect and save behavioral patterns for a client
 * This should be run periodically (e.g., daily) to update patterns
 */
export async function detectBehavioralPatterns(clientId: number): Promise<void> {
  const db = getDb();
  
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Get recent events
    const events = await db.query.clientEvents?.findMany({
      where: and(
        eq(clientEvents.clientId, clientId),
        gte(clientEvents.timestamp, sevenDaysAgo)
      ),
      orderBy: desc(clientEvents.timestamp),
    });
    
    if (!events || events.length < 10) {
      return; // Not enough data
    }
    
    // Detect hesitation pattern (visiting same page multiple times without action)
    const pageVisits: Record<string, number> = {};
    const pageActions: Record<string, number> = {};
    
    events.forEach(e => {
      const page = e.pagePath || 'unknown';
      if (e.eventAction === 'page_view') {
        pageVisits[page] = (pageVisits[page] || 0) + 1;
      } else if (e.eventType === 'click') {
        pageActions[page] = (pageActions[page] || 0) + 1;
      }
    });
    
    for (const [page, visits] of Object.entries(pageVisits)) {
      if (visits >= 3 && (pageActions[page] || 0) === 0) {
        await savePattern(clientId, {
          patternType: 'hesitation',
          patternName: `Hesitating on ${page}`,
          description: `Visited ${page} ${visits} times without taking action - may be unsure or overwhelmed`,
          evidence: { page, visits, actions: pageActions[page] || 0 },
          confidence: Math.min(visits * 20, 90),
          coachingRelevance: 'high',
          suggestedAction: `Ask about their experience with ${page} - what's holding them back?`,
        });
      }
    }
    
    // Detect declining engagement
    const firstHalf = events.slice(Math.floor(events.length / 2));
    const secondHalf = events.slice(0, Math.floor(events.length / 2));
    
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstHalfEngaged = firstHalf.filter(e => e.engagementLevel === 'high').length / firstHalf.length;
      const secondHalfEngaged = secondHalf.filter(e => e.engagementLevel === 'high').length / secondHalf.length;
      
      if (firstHalfEngaged > secondHalfEngaged + 0.2) {
        await savePattern(clientId, {
          patternType: 'engagement',
          patternName: 'Declining engagement',
          description: 'Engagement has decreased over the past week - may need re-motivation',
          evidence: { firstHalfEngaged, secondHalfEngaged },
          confidence: 70,
          coachingRelevance: 'high',
          suggestedAction: 'Check in on their motivation and any obstacles they\'re facing',
        });
      }
    }
    
    console.log(`[EventTracking] Detected patterns for client ${clientId}`);
  } catch (error) {
    console.error('[EventTracking] Error detecting patterns:', error);
  }
}

/**
 * Save a behavioral pattern
 */
async function savePattern(clientId: number, pattern: {
  patternType: string;
  patternName: string;
  description: string;
  evidence: any;
  confidence: number;
  coachingRelevance: string;
  suggestedAction: string;
}): Promise<void> {
  const db = getDb();
  
  try {
    // Check if pattern already exists
    const existing = await db.query.clientBehavioralPatterns?.findFirst({
      where: and(
        eq(clientBehavioralPatterns.clientId, clientId),
        eq(clientBehavioralPatterns.patternName, pattern.patternName)
      ),
    });
    
    if (existing) {
      // Update existing pattern
      await db.update(clientBehavioralPatterns)
        .set({
          confidence: pattern.confidence,
          evidence: pattern.evidence,
          lastConfirmedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(clientBehavioralPatterns.id, existing.id));
    } else {
      // Create new pattern
      await db.insert(clientBehavioralPatterns).values({
        clientId,
        patternType: pattern.patternType,
        patternName: pattern.patternName,
        description: pattern.description,
        evidence: pattern.evidence,
        confidence: pattern.confidence,
        coachingRelevance: pattern.coachingRelevance,
        suggestedAction: pattern.suggestedAction,
        isActive: 'yes',
        detectedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('[EventTracking] Error saving pattern:', error);
  }
}
