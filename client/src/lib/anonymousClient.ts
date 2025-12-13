/**
 * Anonymous Client Identification System
 * Generates and persists unique client IDs without requiring authentication
 * Enables AI to build client profiles over time while maintaining frictionless access
 */

/**
 * Generate a browser fingerprint for anonymous identification
 */
function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ];
  
  // Simple hash function
  const str = components.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get or create anonymous client ID
 * Stored in localStorage for persistence across sessions
 */
export function getAnonymousClientId(): string {
  const STORAGE_KEY = 'purposeful_anonymous_client_id';
  
  // Check if we already have an ID
  let clientId = localStorage.getItem(STORAGE_KEY);
  
  if (!clientId) {
    // Generate new ID: fingerprint + timestamp + random
    const fingerprint = generateFingerprint();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    clientId = `anon_${fingerprint}_${timestamp}_${random}`;
    
    // Store for future sessions
    localStorage.setItem(STORAGE_KEY, clientId);
  }
  
  return clientId;
}

/**
 * Get client context metadata for AI profiling
 */
export function getClientContext() {
  return {
    anonymousId: getAnonymousClientId(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    language: navigator.language,
    deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    screenSize: `${screen.width}x${screen.height}`,
    timestamp: new Date().toISOString(),
    localTime: new Date().toLocaleTimeString(),
    localDate: new Date().toLocaleDateString(),
  };
}

/**
 * Detect unusual access patterns that might indicate crisis
 */
export function detectUnusualPattern(): {
  isUnusual: boolean;
  reason?: string;
} {
  const now = new Date();
  const hour = now.getHours();
  
  // Late night access (11pm - 5am)
  if (hour >= 23 || hour < 5) {
    return {
      isUnusual: true,
      reason: 'late_night_access'
    };
  }
  
  // Very early morning (5am - 6am)
  if (hour >= 5 && hour < 6) {
    return {
      isUnusual: true,
      reason: 'very_early_access'
    };
  }
  
  return { isUnusual: false };
}

/**
 * Store client metadata in conversation
 * This helps AI build context over time
 */
export function getConversationMetadata() {
  const context = getClientContext();
  const pattern = detectUnusualPattern();
  
  return {
    ...context,
    unusualPattern: pattern,
    sessionStart: new Date().toISOString(),
  };
}
