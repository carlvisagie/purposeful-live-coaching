/**
 * Tier Configuration
 * Defines all subscription tiers, pricing, and feature access
 */

export type TierName = 'free' | 'lifestyle' | 'growth' | 'mastery';

export interface TierConfig {
  id: string;
  name: TierName;
  displayName: string;
  price: number; // Monthly price in USD
  stripePriceId: string; // Stripe price ID (to be filled in)
  features: {
    // Module Access
    coreModules: number; // Number of Core modules (max 5)
    lifestyleModules: number; // Number of Lifestyle modules (max 7)
    growthModules: number; // Number of Growth modules (max 6)
    advancedModules: number; // Number of Advanced modules (max 13)
    
    // AI Coach Access
    aiTextMessages: number | 'unlimited'; // Text messages per month
    aiVoiceMinutes: number | 'unlimited'; // Voice minutes per month
    aiVoiceOverageRate: number; // $ per minute after limit
    
    // Human Coach Access
    humanCoachCalls: number; // 15-min calls per month
    humanCoachOverageRate: number; // $ per additional 15-min call
    
    // Features
    communityAccess: 'read-only' | 'full' | 'private';
    progressTracking: boolean;
    advancedAnalytics: boolean;
    certificationPath: boolean;
    prioritySupport: boolean;
    customRoadmap: boolean;
  };
  limits: {
    maxAiVoiceMinutes: number | null; // null = unlimited
    maxOverageCharge: number | null; // Max overage per month, null = no cap
  };
}

export const TIERS: Record<TierName, TierConfig> = {
  free: {
    id: 'free',
    name: 'free',
    displayName: 'Free Trial',
    price: 0,
    stripePriceId: '', // No Stripe for free tier
    features: {
      coreModules: 2, // Emotional + Mental Wellness only
      lifestyleModules: 0,
      growthModules: 0,
      advancedModules: 0,
      aiTextMessages: 5, // Total, not per month
      aiVoiceMinutes: 15, // One-time 15-minute call
      aiVoiceOverageRate: 0, // Can't buy more
      humanCoachCalls: 0,
      humanCoachOverageRate: 0,
      communityAccess: 'read-only',
      progressTracking: false,
      advancedAnalytics: false,
      certificationPath: false,
      prioritySupport: false,
      customRoadmap: false,
    },
    limits: {
      maxAiVoiceMinutes: 15,
      maxOverageCharge: 0, // No overage allowed
    },
  },
  
  lifestyle: {
    id: 'lifestyle',
    name: 'lifestyle',
    displayName: 'Lifestyle',
    price: 29,
    stripePriceId: '', // To be filled with actual Stripe price ID
    features: {
      coreModules: 5, // All Core modules
      lifestyleModules: 7, // All Lifestyle modules
      growthModules: 0,
      advancedModules: 0,
      aiTextMessages: 'unlimited',
      aiVoiceMinutes: 120, // ~8 calls per month
      aiVoiceOverageRate: 0.10, // $0.10/min
      humanCoachCalls: 0,
      humanCoachOverageRate: 30, // $30 per 15-min call if they want to buy
      communityAccess: 'full',
      progressTracking: true,
      advancedAnalytics: false,
      certificationPath: false,
      prioritySupport: false,
      customRoadmap: false,
    },
    limits: {
      maxAiVoiceMinutes: 120,
      maxOverageCharge: 20, // Max $20 overage, then prompt upgrade
    },
  },
  
  growth: {
    id: 'growth',
    name: 'growth',
    displayName: 'Growth',
    price: 79,
    stripePriceId: '', // To be filled with actual Stripe price ID
    features: {
      coreModules: 5,
      lifestyleModules: 7,
      growthModules: 6, // All Growth modules
      advancedModules: 0,
      aiTextMessages: 'unlimited',
      aiVoiceMinutes: 300, // ~20 calls per month
      aiVoiceOverageRate: 0.08, // $0.08/min (discounted)
      humanCoachCalls: 1, // 1 human call per month included
      humanCoachOverageRate: 25, // $25 per additional call
      communityAccess: 'full',
      progressTracking: true,
      advancedAnalytics: true,
      certificationPath: false,
      prioritySupport: false,
      customRoadmap: false,
    },
    limits: {
      maxAiVoiceMinutes: 300,
      maxOverageCharge: null, // No cap on overage
    },
  },
  
  mastery: {
    id: 'mastery',
    name: 'mastery',
    displayName: 'Mastery',
    price: 199,
    stripePriceId: '', // To be filled with actual Stripe price ID
    features: {
      coreModules: 5,
      lifestyleModules: 7,
      growthModules: 6,
      advancedModules: 13, // All Advanced modules
      aiTextMessages: 'unlimited',
      aiVoiceMinutes: 'unlimited',
      aiVoiceOverageRate: 0, // No overage (unlimited)
      humanCoachCalls: 4, // 4 human calls per month (weekly)
      humanCoachOverageRate: 20, // $20 per additional call (VIP rate)
      communityAccess: 'private', // Private mastermind
      progressTracking: true,
      advancedAnalytics: true,
      certificationPath: true,
      prioritySupport: true,
      customRoadmap: true,
    },
    limits: {
      maxAiVoiceMinutes: null, // Unlimited
      maxOverageCharge: null,
    },
  },
};

/**
 * Module categories and their tier requirements
 */
export const MODULE_CATEGORIES = {
  core: ['emotional-wellness', 'mental-wellness', 'physical-wellness', 'nutrition-wellness', 'spiritual-wellness'],
  lifestyle: ['relationship-wellness', 'financial-wellness', 'goal-setting', 'sleep-optimization', 'stress-management', 'habit-formation', 'time-management'],
  growth: ['career-development', 'communication-skills', 'leadership-development', 'creativity-enhancement', 'learning-optimization', 'confidence-building'],
  advanced: ['resilience-building', 'mindfulness-mastery', 'purpose-alignment', 'energy-optimization', 'emotional-intelligence', 'decision-making', 'focus-mastery', 'memory-mastery', 'visualization-mastery', 'transformative-principles', 'truth-keepers', 'young-men-transformation', 'autism-transformation'],
} as const;

/**
 * Get total number of modules accessible by tier
 */
export function getTotalModules(tier: TierName): number {
  const config = TIERS[tier];
  return config.features.coreModules + 
         config.features.lifestyleModules + 
         config.features.growthModules + 
         config.features.advancedModules;
}

/**
 * Check if a module is accessible for a given tier
 */
export function canAccessModule(tier: TierName, moduleCategory: keyof typeof MODULE_CATEGORIES): boolean {
  const config = TIERS[tier];
  
  switch (moduleCategory) {
    case 'core':
      return config.features.coreModules > 0;
    case 'lifestyle':
      return config.features.lifestyleModules > 0;
    case 'growth':
      return config.features.growthModules > 0;
    case 'advanced':
      return config.features.advancedModules > 0;
    default:
      return false;
  }
}

/**
 * Get the minimum tier required for a module category
 */
export function getMinimumTierForModule(moduleCategory: keyof typeof MODULE_CATEGORIES): TierName {
  switch (moduleCategory) {
    case 'core':
      return 'free'; // Even free tier gets 2 core modules
    case 'lifestyle':
      return 'lifestyle';
    case 'growth':
      return 'growth';
    case 'advanced':
      return 'mastery';
    default:
      return 'mastery';
  }
}

/**
 * Calculate overage charges for AI voice usage
 */
export function calculateAiVoiceOverage(tier: TierName, minutesUsed: number): number {
  const config = TIERS[tier];
  
  if (config.features.aiVoiceMinutes === 'unlimited') {
    return 0;
  }
  
  const includedMinutes = config.features.aiVoiceMinutes as number;
  const overageMinutes = Math.max(0, minutesUsed - includedMinutes);
  const overageCharge = overageMinutes * config.features.aiVoiceOverageRate;
  
  // Cap overage if limit exists
  if (config.limits.maxOverageCharge !== null) {
    return Math.min(overageCharge, config.limits.maxOverageCharge);
  }
  
  return overageCharge;
}

/**
 * Calculate overage charges for human coach calls
 */
export function calculateHumanCoachOverage(tier: TierName, callsUsed: number): number {
  const config = TIERS[tier];
  const includedCalls = config.features.humanCoachCalls;
  const overageCalls = Math.max(0, callsUsed - includedCalls);
  
  return overageCalls * config.features.humanCoachOverageRate;
}
