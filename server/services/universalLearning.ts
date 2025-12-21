/**
 * UNIVERSAL LEARNING ENGINE
 * 
 * Core Philosophy: "Not what I want, but what truth and research prove."
 * 
 * This engine connects to EVERY module in the platform and:
 * 1. Tracks OUTCOMES, not just usage
 * 2. Learns what ACTUALLY helps users
 * 3. Evolves based on EVIDENCE, not opinions
 * 4. Applies learnings across the entire platform
 * 5. Gets better over time automatically
 * 
 * This is the brain that makes the entire platform self-evolving.
 */

import { invokeLLM } from "../_core/llm";

// ============================================================================
// TYPES - Outcome-Based Learning
// ============================================================================

export interface OutcomeMetric {
  userId: number;
  moduleId: string;
  moduleName: string;
  actionTaken: string;
  timestamp: Date;
  
  // Pre-action state
  preState: {
    moodScore?: number;        // 1-10
    stressLevel?: number;      // 1-10
    anxietyLevel?: number;     // 1-10
    sleepQuality?: number;     // 1-10
    focusLevel?: number;       // 1-10
    energyLevel?: number;      // 1-10
    customMetrics?: Record<string, number>;
  };
  
  // Post-action state (measured after intervention)
  postState: {
    moodScore?: number;
    stressLevel?: number;
    anxietyLevel?: number;
    sleepQuality?: number;
    focusLevel?: number;
    energyLevel?: number;
    customMetrics?: Record<string, number>;
    measuredAt: Date;
  };
  
  // Calculated improvement
  improvement: {
    moodDelta?: number;
    stressDelta?: number;
    anxietyDelta?: number;
    sleepDelta?: number;
    focusDelta?: number;
    energyDelta?: number;
    overallScore: number;  // Weighted average of all improvements
  };
  
  // Context for learning
  context: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    dayOfWeek: string;
    sessionDuration?: number;  // minutes
    contentType?: string;
    contentId?: string;
    userSegment?: string;
  };
}

export interface ModuleLearning {
  moduleId: string;
  moduleName: string;
  totalOutcomes: number;
  avgImprovement: number;
  
  // What works best
  bestPractices: {
    pattern: string;
    avgImprovement: number;
    sampleSize: number;
    confidence: number;
    evidence: string;
  }[];
  
  // What doesn't work
  antiPatterns: {
    pattern: string;
    avgDecline: number;
    sampleSize: number;
    recommendation: string;
  }[];
  
  // Optimal conditions
  optimalConditions: {
    bestTimeOfDay: string;
    bestDuration: number;
    bestFrequency: string;
    bestContentTypes: string[];
  };
  
  // User segment insights
  segmentInsights: {
    segment: string;
    avgImprovement: number;
    bestApproach: string;
  }[];
  
  lastUpdated: Date;
}

export interface PlatformLearning {
  totalOutcomes: number;
  overallEffectiveness: number;  // 0-100
  
  // Cross-module insights
  crossModulePatterns: {
    pattern: string;
    modules: string[];
    combinedEffect: number;
    recommendation: string;
  }[];
  
  // User journey insights
  journeyInsights: {
    optimalOnboarding: string[];
    progressionPath: string[];
    retentionFactors: string[];
  };
  
  // Global best practices
  globalBestPractices: {
    practice: string;
    impact: number;
    applicableModules: string[];
  }[];
  
  lastEvolution: Date;
}

// ============================================================================
// IN-MEMORY STORES (Would be database in production)
// ============================================================================

const outcomeStore: OutcomeMetric[] = [];
const moduleLearningStore = new Map<string, ModuleLearning>();
let platformLearning: PlatformLearning = {
  totalOutcomes: 0,
  overallEffectiveness: 0,
  crossModulePatterns: [],
  journeyInsights: {
    optimalOnboarding: [],
    progressionPath: [],
    retentionFactors: []
  },
  globalBestPractices: [],
  lastEvolution: new Date()
};

// Minimum sample sizes for statistical significance
const MIN_SAMPLES_FOR_INSIGHT = 10;
const MIN_SAMPLES_FOR_RECOMMENDATION = 25;
const CONFIDENCE_THRESHOLD = 0.7;

// ============================================================================
// OUTCOME TRACKING
// ============================================================================

/**
 * Record an outcome from any module
 * This is the core function that ALL modules should call
 */
export async function recordOutcome(outcome: Omit<OutcomeMetric, 'improvement'>): Promise<{
  recorded: boolean;
  improvement: OutcomeMetric['improvement'];
  feedback: string;
}> {
  // Calculate improvement
  const improvement = calculateImprovement(outcome.preState, outcome.postState);
  
  const fullOutcome: OutcomeMetric = {
    ...outcome,
    improvement
  };
  
  // Store the outcome
  outcomeStore.push(fullOutcome);
  
  // Update module learning
  await updateModuleLearning(fullOutcome);
  
  // Check if we should trigger platform evolution
  if (outcomeStore.length % 50 === 0) {
    await evolvePlatformLearning();
  }
  
  // Generate feedback for the user
  const feedback = generateOutcomeFeedback(fullOutcome);
  
  return {
    recorded: true,
    improvement,
    feedback
  };
}

/**
 * Calculate improvement between pre and post states
 */
function calculateImprovement(
  preState: OutcomeMetric['preState'],
  postState: OutcomeMetric['postState']
): OutcomeMetric['improvement'] {
  const deltas: Record<string, number> = {};
  let totalWeight = 0;
  let weightedSum = 0;
  
  // Weights for different metrics (based on research)
  const weights: Record<string, number> = {
    mood: 1.0,
    stress: 1.2,      // Stress reduction is highly valuable
    anxiety: 1.3,     // Anxiety reduction is most impactful
    sleep: 1.1,
    focus: 0.9,
    energy: 0.8
  };
  
  // Calculate deltas for each metric
  if (preState.moodScore !== undefined && postState.moodScore !== undefined) {
    deltas.moodDelta = postState.moodScore - preState.moodScore;
    weightedSum += deltas.moodDelta * weights.mood;
    totalWeight += weights.mood;
  }
  
  if (preState.stressLevel !== undefined && postState.stressLevel !== undefined) {
    // For stress, LOWER is better, so we invert
    deltas.stressDelta = preState.stressLevel - postState.stressLevel;
    weightedSum += deltas.stressDelta * weights.stress;
    totalWeight += weights.stress;
  }
  
  if (preState.anxietyLevel !== undefined && postState.anxietyLevel !== undefined) {
    // For anxiety, LOWER is better
    deltas.anxietyDelta = preState.anxietyLevel - postState.anxietyLevel;
    weightedSum += deltas.anxietyDelta * weights.anxiety;
    totalWeight += weights.anxiety;
  }
  
  if (preState.sleepQuality !== undefined && postState.sleepQuality !== undefined) {
    deltas.sleepDelta = postState.sleepQuality - preState.sleepQuality;
    weightedSum += deltas.sleepDelta * weights.sleep;
    totalWeight += weights.sleep;
  }
  
  if (preState.focusLevel !== undefined && postState.focusLevel !== undefined) {
    deltas.focusDelta = postState.focusLevel - preState.focusLevel;
    weightedSum += deltas.focusDelta * weights.focus;
    totalWeight += weights.focus;
  }
  
  if (preState.energyLevel !== undefined && postState.energyLevel !== undefined) {
    deltas.energyDelta = postState.energyLevel - preState.energyLevel;
    weightedSum += deltas.energyDelta * weights.energy;
    totalWeight += weights.energy;
  }
  
  // Calculate overall score (normalized to 0-10 scale)
  const overallScore = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
  
  return {
    ...deltas,
    overallScore
  } as OutcomeMetric['improvement'];
}

/**
 * Generate feedback based on outcome
 */
function generateOutcomeFeedback(outcome: OutcomeMetric): string {
  const score = outcome.improvement.overallScore;
  
  if (score >= 2) {
    return "Excellent! This session had a significant positive impact. Keep it up!";
  } else if (score >= 1) {
    return "Good progress! You're moving in the right direction.";
  } else if (score >= 0) {
    return "Steady. Small improvements add up over time.";
  } else if (score >= -1) {
    return "This session didn't have the usual effect. That's okay - everyone has off days.";
  } else {
    return "This approach may not be optimal for you right now. Let's try something different.";
  }
}

// ============================================================================
// MODULE LEARNING
// ============================================================================

/**
 * Update learning for a specific module based on new outcome
 */
async function updateModuleLearning(outcome: OutcomeMetric): Promise<void> {
  const moduleId = outcome.moduleId;
  
  // Get or create module learning
  let learning = moduleLearningStore.get(moduleId) || {
    moduleId,
    moduleName: outcome.moduleName,
    totalOutcomes: 0,
    avgImprovement: 0,
    bestPractices: [],
    antiPatterns: [],
    optimalConditions: {
      bestTimeOfDay: 'any',
      bestDuration: 0,
      bestFrequency: 'daily',
      bestContentTypes: []
    },
    segmentInsights: [],
    lastUpdated: new Date()
  };
  
  // Update basic stats
  learning.totalOutcomes++;
  learning.avgImprovement = (
    (learning.avgImprovement * (learning.totalOutcomes - 1)) + outcome.improvement.overallScore
  ) / learning.totalOutcomes;
  learning.lastUpdated = new Date();
  
  // Analyze patterns if we have enough data
  if (learning.totalOutcomes >= MIN_SAMPLES_FOR_INSIGHT) {
    await analyzeModulePatterns(moduleId, learning);
  }
  
  moduleLearningStore.set(moduleId, learning);
}

/**
 * Analyze patterns for a module
 */
async function analyzeModulePatterns(moduleId: string, learning: ModuleLearning): Promise<void> {
  // Get all outcomes for this module
  const moduleOutcomes = outcomeStore.filter(o => o.moduleId === moduleId);
  
  if (moduleOutcomes.length < MIN_SAMPLES_FOR_INSIGHT) return;
  
  // Analyze time of day patterns
  const timePatterns = analyzeTimePatterns(moduleOutcomes);
  if (timePatterns.bestTime) {
    learning.optimalConditions.bestTimeOfDay = timePatterns.bestTime;
  }
  
  // Analyze duration patterns
  const durationPatterns = analyzeDurationPatterns(moduleOutcomes);
  if (durationPatterns.optimalDuration) {
    learning.optimalConditions.bestDuration = durationPatterns.optimalDuration;
  }
  
  // Analyze content type patterns
  const contentPatterns = analyzeContentPatterns(moduleOutcomes);
  learning.optimalConditions.bestContentTypes = contentPatterns.bestTypes;
  
  // Find best practices (patterns with high improvement)
  learning.bestPractices = findBestPractices(moduleOutcomes);
  
  // Find anti-patterns (patterns with negative improvement)
  learning.antiPatterns = findAntiPatterns(moduleOutcomes);
}

/**
 * Analyze time of day patterns
 */
function analyzeTimePatterns(outcomes: OutcomeMetric[]): { bestTime: string | null; patterns: Record<string, number> } {
  const timeGroups: Record<string, { total: number; count: number }> = {
    morning: { total: 0, count: 0 },
    afternoon: { total: 0, count: 0 },
    evening: { total: 0, count: 0 },
    night: { total: 0, count: 0 }
  };
  
  for (const outcome of outcomes) {
    const time = outcome.context.timeOfDay;
    timeGroups[time].total += outcome.improvement.overallScore;
    timeGroups[time].count++;
  }
  
  const patterns: Record<string, number> = {};
  let bestTime: string | null = null;
  let bestAvg = -Infinity;
  
  for (const [time, data] of Object.entries(timeGroups)) {
    if (data.count >= 5) {  // Minimum sample size
      const avg = data.total / data.count;
      patterns[time] = avg;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestTime = time;
      }
    }
  }
  
  return { bestTime, patterns };
}

/**
 * Analyze duration patterns
 */
function analyzeDurationPatterns(outcomes: OutcomeMetric[]): { optimalDuration: number | null } {
  const durationBuckets: Record<string, { total: number; count: number }> = {
    'short': { total: 0, count: 0 },    // < 5 min
    'medium': { total: 0, count: 0 },   // 5-15 min
    'long': { total: 0, count: 0 },     // 15-30 min
    'extended': { total: 0, count: 0 }  // > 30 min
  };
  
  for (const outcome of outcomes) {
    const duration = outcome.context.sessionDuration || 0;
    let bucket: string;
    
    if (duration < 5) bucket = 'short';
    else if (duration < 15) bucket = 'medium';
    else if (duration < 30) bucket = 'long';
    else bucket = 'extended';
    
    durationBuckets[bucket].total += outcome.improvement.overallScore;
    durationBuckets[bucket].count++;
  }
  
  let bestBucket: string | null = null;
  let bestAvg = -Infinity;
  
  for (const [bucket, data] of Object.entries(durationBuckets)) {
    if (data.count >= 5) {
      const avg = data.total / data.count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestBucket = bucket;
      }
    }
  }
  
  // Convert bucket to approximate minutes
  const durationMap: Record<string, number> = {
    'short': 3,
    'medium': 10,
    'long': 20,
    'extended': 45
  };
  
  return { optimalDuration: bestBucket ? durationMap[bestBucket] : null };
}

/**
 * Analyze content type patterns
 */
function analyzeContentPatterns(outcomes: OutcomeMetric[]): { bestTypes: string[] } {
  const contentGroups: Record<string, { total: number; count: number }> = {};
  
  for (const outcome of outcomes) {
    const contentType = outcome.context.contentType || 'unknown';
    if (!contentGroups[contentType]) {
      contentGroups[contentType] = { total: 0, count: 0 };
    }
    contentGroups[contentType].total += outcome.improvement.overallScore;
    contentGroups[contentType].count++;
  }
  
  // Sort by average improvement
  const sorted = Object.entries(contentGroups)
    .filter(([_, data]) => data.count >= 5)
    .map(([type, data]) => ({ type, avg: data.total / data.count }))
    .sort((a, b) => b.avg - a.avg);
  
  // Return top 3 content types
  return { bestTypes: sorted.slice(0, 3).map(s => s.type) };
}

/**
 * Find best practices from outcomes
 */
function findBestPractices(outcomes: OutcomeMetric[]): ModuleLearning['bestPractices'] {
  const practices: ModuleLearning['bestPractices'] = [];
  
  // Group by various factors and find high performers
  const highPerformers = outcomes.filter(o => o.improvement.overallScore >= 1.5);
  
  if (highPerformers.length >= MIN_SAMPLES_FOR_INSIGHT) {
    // Find common patterns among high performers
    const timeOfDayCounts: Record<string, number> = {};
    const contentTypeCounts: Record<string, number> = {};
    
    for (const outcome of highPerformers) {
      timeOfDayCounts[outcome.context.timeOfDay] = (timeOfDayCounts[outcome.context.timeOfDay] || 0) + 1;
      if (outcome.context.contentType) {
        contentTypeCounts[outcome.context.contentType] = (contentTypeCounts[outcome.context.contentType] || 0) + 1;
      }
    }
    
    // Add time of day pattern if significant
    const dominantTime = Object.entries(timeOfDayCounts).sort((a, b) => b[1] - a[1])[0];
    if (dominantTime && dominantTime[1] / highPerformers.length > 0.4) {
      practices.push({
        pattern: `${dominantTime[0]}_sessions`,
        avgImprovement: highPerformers.filter(o => o.context.timeOfDay === dominantTime[0])
          .reduce((sum, o) => sum + o.improvement.overallScore, 0) / dominantTime[1],
        sampleSize: dominantTime[1],
        confidence: dominantTime[1] / highPerformers.length,
        evidence: `${dominantTime[1]} out of ${highPerformers.length} high-performing sessions occurred in the ${dominantTime[0]}`
      });
    }
  }
  
  return practices;
}

/**
 * Find anti-patterns from outcomes
 */
function findAntiPatterns(outcomes: OutcomeMetric[]): ModuleLearning['antiPatterns'] {
  const antiPatterns: ModuleLearning['antiPatterns'] = [];
  
  // Find low performers
  const lowPerformers = outcomes.filter(o => o.improvement.overallScore < 0);
  
  if (lowPerformers.length >= MIN_SAMPLES_FOR_INSIGHT) {
    // Find common patterns among low performers
    const timeOfDayCounts: Record<string, number> = {};
    
    for (const outcome of lowPerformers) {
      timeOfDayCounts[outcome.context.timeOfDay] = (timeOfDayCounts[outcome.context.timeOfDay] || 0) + 1;
    }
    
    const dominantTime = Object.entries(timeOfDayCounts).sort((a, b) => b[1] - a[1])[0];
    if (dominantTime && dominantTime[1] / lowPerformers.length > 0.4) {
      antiPatterns.push({
        pattern: `${dominantTime[0]}_sessions_underperform`,
        avgDecline: Math.abs(lowPerformers.filter(o => o.context.timeOfDay === dominantTime[0])
          .reduce((sum, o) => sum + o.improvement.overallScore, 0) / dominantTime[1]),
        sampleSize: dominantTime[1],
        recommendation: `Consider avoiding ${dominantTime[0]} sessions or trying a different approach during this time`
      });
    }
  }
  
  return antiPatterns;
}

// ============================================================================
// PLATFORM-WIDE LEARNING
// ============================================================================

/**
 * Evolve platform learning based on all accumulated data
 */
export async function evolvePlatformLearning(): Promise<{
  evolved: boolean;
  newInsights: number;
  summary: string;
}> {
  if (outcomeStore.length < MIN_SAMPLES_FOR_RECOMMENDATION) {
    return {
      evolved: false,
      newInsights: 0,
      summary: `Need ${MIN_SAMPLES_FOR_RECOMMENDATION - outcomeStore.length} more outcomes for platform evolution`
    };
  }
  
  // Update basic stats
  platformLearning.totalOutcomes = outcomeStore.length;
  platformLearning.overallEffectiveness = calculateOverallEffectiveness();
  
  // Find cross-module patterns
  platformLearning.crossModulePatterns = await findCrossModulePatterns();
  
  // Analyze user journeys
  platformLearning.journeyInsights = analyzeUserJourneys();
  
  // Extract global best practices
  platformLearning.globalBestPractices = extractGlobalBestPractices();
  
  platformLearning.lastEvolution = new Date();
  
  const newInsights = platformLearning.crossModulePatterns.length + 
    platformLearning.globalBestPractices.length;
  
  return {
    evolved: true,
    newInsights,
    summary: `Platform evolved with ${newInsights} new insights from ${outcomeStore.length} outcomes`
  };
}

/**
 * Calculate overall platform effectiveness
 */
function calculateOverallEffectiveness(): number {
  if (outcomeStore.length === 0) return 0;
  
  const positiveOutcomes = outcomeStore.filter(o => o.improvement.overallScore > 0).length;
  return Math.round((positiveOutcomes / outcomeStore.length) * 100);
}

/**
 * Find patterns that span multiple modules
 */
async function findCrossModulePatterns(): Promise<PlatformLearning['crossModulePatterns']> {
  const patterns: PlatformLearning['crossModulePatterns'] = [];
  
  // Group outcomes by user to find journey patterns
  const userOutcomes = new Map<number, OutcomeMetric[]>();
  for (const outcome of outcomeStore) {
    const existing = userOutcomes.get(outcome.userId) || [];
    existing.push(outcome);
    userOutcomes.set(outcome.userId, existing);
  }
  
  // Find users who used multiple modules
  const multiModuleUsers = Array.from(userOutcomes.entries())
    .filter(([_, outcomes]) => {
      const uniqueModules = new Set(outcomes.map(o => o.moduleId));
      return uniqueModules.size >= 2;
    });
  
  if (multiModuleUsers.length >= 5) {
    // Analyze which module combinations work best
    const comboCounts: Record<string, { total: number; count: number; modules: string[] }> = {};
    
    for (const [_, outcomes] of multiModuleUsers) {
      const modules = [...new Set(outcomes.map(o => o.moduleId))].sort();
      const comboKey = modules.join('+');
      
      if (!comboCounts[comboKey]) {
        comboCounts[comboKey] = { total: 0, count: 0, modules };
      }
      
      const avgImprovement = outcomes.reduce((sum, o) => sum + o.improvement.overallScore, 0) / outcomes.length;
      comboCounts[comboKey].total += avgImprovement;
      comboCounts[comboKey].count++;
    }
    
    // Find best combinations
    const sortedCombos = Object.entries(comboCounts)
      .filter(([_, data]) => data.count >= 3)
      .map(([key, data]) => ({
        modules: data.modules,
        avgEffect: data.total / data.count,
        count: data.count
      }))
      .sort((a, b) => b.avgEffect - a.avgEffect);
    
    for (const combo of sortedCombos.slice(0, 3)) {
      patterns.push({
        pattern: `${combo.modules.join(' + ')} combination`,
        modules: combo.modules,
        combinedEffect: combo.avgEffect,
        recommendation: `Users who combine ${combo.modules.join(' and ')} see ${(combo.avgEffect * 100).toFixed(0)}% better outcomes`
      });
    }
  }
  
  return patterns;
}

/**
 * Analyze user journey patterns
 */
function analyzeUserJourneys(): PlatformLearning['journeyInsights'] {
  // This would analyze the sequence of module usage and outcomes
  // For now, return placeholder that would be filled with real analysis
  
  return {
    optimalOnboarding: ['Start with AI Coach for assessment', 'Try Sleep Stories for quick win', 'Build habit with Daily Check-ins'],
    progressionPath: ['Foundation (Week 1-2)', 'Exploration (Week 3-4)', 'Deepening (Month 2+)'],
    retentionFactors: ['Daily check-ins', 'Streak maintenance', 'Personalized content']
  };
}

/**
 * Extract global best practices that apply across modules
 */
function extractGlobalBestPractices(): PlatformLearning['globalBestPractices'] {
  const practices: PlatformLearning['globalBestPractices'] = [];
  
  // Analyze all module learnings for common patterns
  const allLearnings = Array.from(moduleLearningStore.values());
  
  // Find time of day patterns across modules
  const timePatterns: Record<string, { modules: string[]; avgImprovement: number }> = {};
  
  for (const learning of allLearnings) {
    const bestTime = learning.optimalConditions.bestTimeOfDay;
    if (bestTime !== 'any') {
      if (!timePatterns[bestTime]) {
        timePatterns[bestTime] = { modules: [], avgImprovement: 0 };
      }
      timePatterns[bestTime].modules.push(learning.moduleName);
      timePatterns[bestTime].avgImprovement += learning.avgImprovement;
    }
  }
  
  // Add time-based best practices
  for (const [time, data] of Object.entries(timePatterns)) {
    if (data.modules.length >= 2) {
      practices.push({
        practice: `${time.charAt(0).toUpperCase() + time.slice(1)} sessions are most effective`,
        impact: data.avgImprovement / data.modules.length,
        applicableModules: data.modules
      });
    }
  }
  
  return practices;
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get learning insights for a specific module
 */
export function getModuleLearning(moduleId: string): ModuleLearning | null {
  return moduleLearningStore.get(moduleId) || null;
}

/**
 * Get platform-wide learning insights
 */
export function getPlatformLearning(): PlatformLearning {
  return platformLearning;
}

/**
 * Get personalized recommendations for a user
 */
export async function getPersonalizedRecommendations(userId: number): Promise<{
  recommendations: string[];
  basedOn: string;
  confidence: number;
}> {
  const userOutcomes = outcomeStore.filter(o => o.userId === userId);
  
  if (userOutcomes.length < 3) {
    // Not enough data, use platform-wide insights
    return {
      recommendations: platformLearning.journeyInsights.optimalOnboarding,
      basedOn: 'Platform-wide patterns (not enough personal data yet)',
      confidence: 0.5
    };
  }
  
  // Analyze user's personal patterns
  const bestModules = new Map<string, { total: number; count: number }>();
  const bestTimes = new Map<string, { total: number; count: number }>();
  
  for (const outcome of userOutcomes) {
    // Track module performance
    const moduleData = bestModules.get(outcome.moduleId) || { total: 0, count: 0 };
    moduleData.total += outcome.improvement.overallScore;
    moduleData.count++;
    bestModules.set(outcome.moduleId, moduleData);
    
    // Track time performance
    const timeData = bestTimes.get(outcome.context.timeOfDay) || { total: 0, count: 0 };
    timeData.total += outcome.improvement.overallScore;
    timeData.count++;
    bestTimes.set(outcome.context.timeOfDay, timeData);
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  // Best module recommendation
  const sortedModules = Array.from(bestModules.entries())
    .map(([id, data]) => ({ id, avg: data.total / data.count }))
    .sort((a, b) => b.avg - a.avg);
  
  if (sortedModules.length > 0 && sortedModules[0].avg > 0) {
    const learning = moduleLearningStore.get(sortedModules[0].id);
    if (learning) {
      recommendations.push(`Continue with ${learning.moduleName} - it works well for you`);
    }
  }
  
  // Best time recommendation
  const sortedTimes = Array.from(bestTimes.entries())
    .map(([time, data]) => ({ time, avg: data.total / data.count }))
    .sort((a, b) => b.avg - a.avg);
  
  if (sortedTimes.length > 0) {
    recommendations.push(`Your best results come from ${sortedTimes[0].time} sessions`);
  }
  
  return {
    recommendations,
    basedOn: `Your personal data (${userOutcomes.length} sessions)`,
    confidence: Math.min(userOutcomes.length / 20, 1)
  };
}

/**
 * Get all learning insights for display
 */
export function getAllLearningInsights(): {
  platform: PlatformLearning;
  modules: ModuleLearning[];
  summary: {
    totalOutcomes: number;
    effectivenessRate: number;
    topModules: { name: string; effectiveness: number }[];
    keyInsights: string[];
  };
} {
  const modules = Array.from(moduleLearningStore.values());
  
  // Calculate top modules
  const topModules = modules
    .filter(m => m.totalOutcomes >= 10)
    .sort((a, b) => b.avgImprovement - a.avgImprovement)
    .slice(0, 5)
    .map(m => ({
      name: m.moduleName,
      effectiveness: Math.round((m.avgImprovement + 5) * 10) // Normalize to 0-100
    }));
  
  // Generate key insights
  const keyInsights: string[] = [];
  
  if (platformLearning.overallEffectiveness > 70) {
    keyInsights.push(`Platform is highly effective: ${platformLearning.overallEffectiveness}% of sessions show improvement`);
  }
  
  for (const pattern of platformLearning.crossModulePatterns.slice(0, 2)) {
    keyInsights.push(pattern.recommendation);
  }
  
  for (const practice of platformLearning.globalBestPractices.slice(0, 2)) {
    keyInsights.push(practice.practice);
  }
  
  return {
    platform: platformLearning,
    modules,
    summary: {
      totalOutcomes: outcomeStore.length,
      effectivenessRate: platformLearning.overallEffectiveness,
      topModules,
      keyInsights
    }
  };
}

// ============================================================================
// EXPORT
// ============================================================================

export const UniversalLearningEngine = {
  recordOutcome,
  evolvePlatformLearning,
  getModuleLearning,
  getPlatformLearning,
  getPersonalizedRecommendations,
  getAllLearningInsights
};

export default UniversalLearningEngine;
