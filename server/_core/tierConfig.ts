/**
 * Tier Configuration - Defines feature limits for each subscription tier
 * NO-DECISION MODE: Evidence-based tier differentiation for revenue optimization
 */

export interface TierLimits {
  aiModel: "gpt-4o-mini" | "gpt-4o";
  messagesPerMonth: number; // -1 = unlimited
  wellnessModules: number;
  humanSessionsPerMonth: number;
  name: string;
  price: number;
}

export const TIER_CONFIG: Record<string, TierLimits> = {
  // AI Coaching Tiers
  ai_basic: {
    aiModel: "gpt-4o-mini",
    messagesPerMonth: 100,
    wellnessModules: 5,
    humanSessionsPerMonth: 0,
    name: "Basic AI",
    price: 29,
  },
  ai_premium: {
    aiModel: "gpt-4o",
    messagesPerMonth: 500,
    wellnessModules: 31,
    humanSessionsPerMonth: 1,
    name: "Premium AI",
    price: 149,
  },
  ai_elite: {
    aiModel: "gpt-4o",
    messagesPerMonth: -1, // unlimited
    wellnessModules: 31,
    humanSessionsPerMonth: 4,
    name: "Elite AI",
    price: 299,
  },
  
  // Human Coaching Tiers (same AI limits as AI tiers)
  human_basic: {
    aiModel: "gpt-4o-mini",
    messagesPerMonth: 100,
    wellnessModules: 5,
    humanSessionsPerMonth: 1,
    name: "Basic Human",
    price: 149,
  },
  human_premium: {
    aiModel: "gpt-4o",
    messagesPerMonth: 500,
    wellnessModules: 31,
    humanSessionsPerMonth: 4,
    name: "Premium Human",
    price: 299,
  },
  human_elite: {
    aiModel: "gpt-4o",
    messagesPerMonth: -1,
    wellnessModules: 31,
    humanSessionsPerMonth: 8,
    name: "Elite Human",
    price: 499,
  },
  
  // Legacy tier mappings
  basic: {
    aiModel: "gpt-4o-mini",
    messagesPerMonth: 100,
    wellnessModules: 5,
    humanSessionsPerMonth: 0,
    name: "Basic",
    price: 29,
  },
  premium: {
    aiModel: "gpt-4o",
    messagesPerMonth: 500,
    wellnessModules: 31,
    humanSessionsPerMonth: 1,
    name: "Premium",
    price: 149,
  },
  elite: {
    aiModel: "gpt-4o",
    messagesPerMonth: -1,
    wellnessModules: 31,
    humanSessionsPerMonth: 4,
    name: "Elite",
    price: 299,
  },
  professional: {
    aiModel: "gpt-4o",
    messagesPerMonth: 500,
    wellnessModules: 31,
    humanSessionsPerMonth: 1,
    name: "Professional",
    price: 149,
  },
};

/**
 * Get tier limits for a subscription tier
 */
export function getTierLimits(tier: string | null): TierLimits {
  if (!tier) {
    // Default to basic tier for users without subscription
    return TIER_CONFIG.basic;
  }
  
  return TIER_CONFIG[tier] || TIER_CONFIG.basic;
}

/**
 * Check if user has reached their message limit for the current period
 */
export function hasReachedMessageLimit(
  messagesUsed: number,
  tier: string | null
): boolean {
  const limits = getTierLimits(tier);
  
  // -1 means unlimited
  if (limits.messagesPerMonth === -1) {
    return false;
  }
  
  return messagesUsed >= limits.messagesPerMonth;
}

/**
 * Get appropriate AI model for tier
 */
export function getAIModelForTier(tier: string | null): "gpt-4o-mini" | "gpt-4o" {
  const limits = getTierLimits(tier);
  return limits.aiModel;
}

/**
 * Check if user has access to a specific number of wellness modules
 */
export function hasModuleAccess(
  moduleIndex: number,
  tier: string | null
): boolean {
  const limits = getTierLimits(tier);
  return moduleIndex < limits.wellnessModules;
}
