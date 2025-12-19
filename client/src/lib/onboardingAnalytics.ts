/**
 * ONBOARDING ANALYTICS
 * Tracks user preferences and behaviors to help the platform learn
 * what works best for users
 */

const PREFERENCE_KEY = "purposeful_onboarding_preference";
const HEALTH_INTAKE_KEY = "purposeful_health_intake_pending";
const ANALYTICS_KEY = "purposeful_onboarding_analytics";

export interface OnboardingPreference {
  choice: "conversational" | "form";
  timestamp: string;
}

export interface OnboardingAnalytics {
  preferences: OnboardingPreference[];
  lastChoice: "conversational" | "form" | null;
  formCompletionRate: number;
  conversationalEngagement: number;
  totalSessions: number;
}

/**
 * Track when user makes an onboarding choice
 */
export function trackOnboardingChoice(choice: "conversational" | "form"): void {
  try {
    const existing = localStorage.getItem(PREFERENCE_KEY);
    const data = existing ? JSON.parse(existing) : { choices: [] };
    
    data.choices.push({
      choice,
      timestamp: new Date().toISOString(),
    });
    data.lastChoice = choice;
    
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(data));
    
    // Also update analytics
    updateAnalytics({ choiceMade: choice });
  } catch (e) {
    console.warn("[OnboardingAnalytics] Could not save preference:", e);
  }
}

/**
 * Track form completion
 */
export function trackFormCompletion(completed: boolean, stepReached: number): void {
  try {
    updateAnalytics({ 
      formCompleted: completed, 
      formStepReached: stepReached 
    });
  } catch (e) {
    console.warn("[OnboardingAnalytics] Could not track form completion:", e);
  }
}

/**
 * Track conversational engagement
 */
export function trackConversationalEngagement(messagesExchanged: number, topicsDiscussed: string[]): void {
  try {
    updateAnalytics({
      conversationalMessages: messagesExchanged,
      conversationalTopics: topicsDiscussed,
    });
  } catch (e) {
    console.warn("[OnboardingAnalytics] Could not track engagement:", e);
  }
}

/**
 * Update analytics data
 */
function updateAnalytics(update: Record<string, any>): void {
  const existing = localStorage.getItem(ANALYTICS_KEY);
  const analytics = existing ? JSON.parse(existing) : {
    sessions: [],
    totalFormChoices: 0,
    totalConversationalChoices: 0,
    formCompletions: 0,
    formAbandons: 0,
    avgConversationalMessages: 0,
  };
  
  // Update based on what was passed
  if (update.choiceMade === "form") {
    analytics.totalFormChoices++;
  } else if (update.choiceMade === "conversational") {
    analytics.totalConversationalChoices++;
  }
  
  if (update.formCompleted !== undefined) {
    if (update.formCompleted) {
      analytics.formCompletions++;
    } else {
      analytics.formAbandons++;
    }
  }
  
  // Add session data
  analytics.sessions.push({
    timestamp: new Date().toISOString(),
    ...update,
  });
  
  // Keep only last 100 sessions
  if (analytics.sessions.length > 100) {
    analytics.sessions = analytics.sessions.slice(-100);
  }
  
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

/**
 * Get user's preferred onboarding method based on history
 */
export function getPreferredOnboardingMethod(): "conversational" | "form" | null {
  try {
    const data = localStorage.getItem(PREFERENCE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    return parsed.lastChoice || null;
  } catch {
    return null;
  }
}

/**
 * Check if there's pending health intake data to submit
 */
export function getPendingHealthIntake(): any | null {
  try {
    const data = localStorage.getItem(HEALTH_INTAKE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    return parsed.data || null;
  } catch {
    return null;
  }
}

/**
 * Clear pending health intake after successful submission
 */
export function clearPendingHealthIntake(): void {
  try {
    localStorage.removeItem(HEALTH_INTAKE_KEY);
  } catch {
    console.warn("[OnboardingAnalytics] Could not clear pending intake");
  }
}

/**
 * Get analytics summary for platform learning
 */
export function getAnalyticsSummary(): {
  preferredMethod: "conversational" | "form" | "unknown";
  formCompletionRate: number;
  totalChoices: number;
} {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    if (!data) {
      return {
        preferredMethod: "unknown",
        formCompletionRate: 0,
        totalChoices: 0,
      };
    }
    
    const analytics = JSON.parse(data);
    const totalChoices = analytics.totalFormChoices + analytics.totalConversationalChoices;
    
    let preferredMethod: "conversational" | "form" | "unknown" = "unknown";
    if (totalChoices > 0) {
      preferredMethod = analytics.totalConversationalChoices > analytics.totalFormChoices 
        ? "conversational" 
        : "form";
    }
    
    const formCompletionRate = analytics.totalFormChoices > 0
      ? (analytics.formCompletions / analytics.totalFormChoices) * 100
      : 0;
    
    return {
      preferredMethod,
      formCompletionRate,
      totalChoices,
    };
  } catch {
    return {
      preferredMethod: "unknown",
      formCompletionRate: 0,
      totalChoices: 0,
    };
  }
}

/**
 * Export analytics for server sync (when user logs in)
 */
export function exportAnalyticsForSync(): Record<string, any> | null {
  try {
    const preference = localStorage.getItem(PREFERENCE_KEY);
    const analytics = localStorage.getItem(ANALYTICS_KEY);
    const pendingIntake = localStorage.getItem(HEALTH_INTAKE_KEY);
    
    return {
      preference: preference ? JSON.parse(preference) : null,
      analytics: analytics ? JSON.parse(analytics) : null,
      pendingIntake: pendingIntake ? JSON.parse(pendingIntake) : null,
    };
  } catch {
    return null;
  }
}
