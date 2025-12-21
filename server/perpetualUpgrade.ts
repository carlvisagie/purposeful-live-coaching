/**
 * PERPETUAL UPGRADE SYSTEM
 * 
 * Self-improving code infrastructure that:
 * 1. Monitors feature usage and performance
 * 2. Tracks code quality and technical debt
 * 3. Suggests improvements and optimizations
 * 4. Monitors dependencies for updates
 * 5. Learns from errors and auto-suggests fixes
 * 
 * This complements the Platform Intelligence (which improves coaching strategies)
 * by improving the actual codebase itself.
 */

import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// TYPES
// ============================================================================

export interface FeatureUsage {
  featureId: string;
  featureName: string;
  endpoint: string;
  totalCalls: number;
  uniqueUsers: number;
  avgResponseTime: number; // ms
  errorRate: number; // 0-100
  lastUsed: Date;
  trend: "growing" | "stable" | "declining" | "unused";
}

export interface PerformanceMetric {
  endpoint: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorCount: number;
  totalCalls: number;
  lastMeasured: Date;
}

export interface CodeQualityIssue {
  id: string;
  type: "todo" | "complexity" | "duplication" | "deprecated" | "security" | "performance";
  severity: "low" | "medium" | "high" | "critical";
  file: string;
  line?: number;
  description: string;
  suggestedFix?: string;
  detectedAt: Date;
}

export interface DependencyStatus {
  name: string;
  currentVersion: string;
  latestVersion: string;
  isOutdated: boolean;
  hasSecurityIssue: boolean;
  updateType: "major" | "minor" | "patch" | "none";
  lastChecked: Date;
}

export interface UpgradeRecommendation {
  id: string;
  type: "refactor" | "optimize" | "deprecate" | "update" | "security" | "feature";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  affectedFiles: string[];
  estimatedEffort: "minutes" | "hours" | "days";
  potentialImpact: string;
  suggestedCode?: string;
  createdAt: Date;
}

export interface SystemHealth {
  overallScore: number; // 0-100
  featureAdoption: number; // % of features being used
  performanceScore: number;
  codeQualityScore: number;
  dependencyHealth: number;
  errorRate: number;
  lastAssessed: Date;
}

// ============================================================================
// IN-MEMORY STORES (Would be database in production)
// ============================================================================

const featureUsageStore = new Map<string, FeatureUsage>();
const performanceStore = new Map<string, PerformanceMetric>();
const codeQualityStore: CodeQualityIssue[] = [];
const dependencyStore = new Map<string, DependencyStatus>();
const recommendationStore: UpgradeRecommendation[] = [];
const errorLogStore: Array<{ endpoint: string; error: string; timestamp: Date; count: number }> = [];

// ============================================================================
// FEATURE USAGE TRACKING
// ============================================================================

/**
 * Track feature usage - call this from every endpoint
 */
export function trackFeatureUsage(
  featureId: string,
  featureName: string,
  endpoint: string,
  userId?: number,
  responseTime?: number,
  hadError?: boolean
): void {
  const existing = featureUsageStore.get(featureId) || {
    featureId,
    featureName,
    endpoint,
    totalCalls: 0,
    uniqueUsers: 0,
    avgResponseTime: 0,
    errorRate: 0,
    lastUsed: new Date(),
    trend: "stable" as const,
  };

  existing.totalCalls++;
  existing.lastUsed = new Date();

  if (responseTime) {
    existing.avgResponseTime = 
      (existing.avgResponseTime * (existing.totalCalls - 1) + responseTime) / existing.totalCalls;
  }

  if (hadError) {
    const errorCount = Math.round(existing.errorRate * existing.totalCalls / 100) + 1;
    existing.errorRate = (errorCount / existing.totalCalls) * 100;
  }

  // Calculate trend (simplified - would need historical data)
  if (existing.totalCalls > 100) {
    existing.trend = existing.totalCalls > 1000 ? "growing" : "stable";
  }

  featureUsageStore.set(featureId, existing);
}

/**
 * Get feature usage report
 */
export function getFeatureUsageReport(): {
  totalFeatures: number;
  activeFeatures: number;
  unusedFeatures: FeatureUsage[];
  topFeatures: FeatureUsage[];
  decliningFeatures: FeatureUsage[];
} {
  const allFeatures = Array.from(featureUsageStore.values());
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const activeFeatures = allFeatures.filter(f => f.lastUsed > thirtyDaysAgo);
  const unusedFeatures = allFeatures.filter(f => f.lastUsed <= thirtyDaysAgo || f.totalCalls < 10);
  const topFeatures = [...allFeatures].sort((a, b) => b.totalCalls - a.totalCalls).slice(0, 10);
  const decliningFeatures = allFeatures.filter(f => f.trend === "declining");

  return {
    totalFeatures: allFeatures.length,
    activeFeatures: activeFeatures.length,
    unusedFeatures,
    topFeatures,
    decliningFeatures,
  };
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Record endpoint performance
 */
export function recordPerformance(
  endpoint: string,
  responseTime: number,
  hadError: boolean
): void {
  const existing = performanceStore.get(endpoint) || {
    endpoint,
    avgResponseTime: 0,
    p95ResponseTime: 0,
    p99ResponseTime: 0,
    errorCount: 0,
    totalCalls: 0,
    lastMeasured: new Date(),
  };

  existing.totalCalls++;
  existing.avgResponseTime = 
    (existing.avgResponseTime * (existing.totalCalls - 1) + responseTime) / existing.totalCalls;
  
  // Simplified p95/p99 (would need actual percentile calculation)
  if (responseTime > existing.p95ResponseTime) {
    existing.p95ResponseTime = responseTime * 0.95 + existing.p95ResponseTime * 0.05;
  }
  if (responseTime > existing.p99ResponseTime) {
    existing.p99ResponseTime = responseTime * 0.99 + existing.p99ResponseTime * 0.01;
  }

  if (hadError) {
    existing.errorCount++;
  }

  existing.lastMeasured = new Date();
  performanceStore.set(endpoint, existing);

  // Check if endpoint needs optimization
  if (existing.avgResponseTime > 1000 && existing.totalCalls > 100) {
    addRecommendation({
      type: "optimize",
      priority: existing.avgResponseTime > 3000 ? "high" : "medium",
      title: `Slow endpoint: ${endpoint}`,
      description: `Average response time is ${existing.avgResponseTime.toFixed(0)}ms. Consider optimization.`,
      affectedFiles: [endpoint],
      estimatedEffort: "hours",
      potentialImpact: "Improved user experience, reduced server load",
    });
  }
}

/**
 * Get performance report
 */
export function getPerformanceReport(): {
  overallHealth: number;
  slowEndpoints: PerformanceMetric[];
  errorProneEndpoints: PerformanceMetric[];
  healthyEndpoints: number;
} {
  const allMetrics = Array.from(performanceStore.values());
  
  const slowEndpoints = allMetrics.filter(m => m.avgResponseTime > 500);
  const errorProneEndpoints = allMetrics.filter(m => 
    m.totalCalls > 10 && (m.errorCount / m.totalCalls) > 0.05
  );
  const healthyEndpoints = allMetrics.filter(m => 
    m.avgResponseTime < 500 && (m.errorCount / m.totalCalls) < 0.01
  ).length;

  const overallHealth = allMetrics.length > 0
    ? Math.round((healthyEndpoints / allMetrics.length) * 100)
    : 100;

  return {
    overallHealth,
    slowEndpoints,
    errorProneEndpoints,
    healthyEndpoints,
  };
}

// ============================================================================
// CODE QUALITY SCANNING
// ============================================================================

/**
 * Scan codebase for quality issues
 */
export async function scanCodeQuality(): Promise<CodeQualityIssue[]> {
  const issues: CodeQualityIssue[] = [];
  const serverDir = path.join(process.cwd(), "server");

  try {
    // Scan for TODOs, FIXMEs, etc.
    const files = await getTypeScriptFiles(serverDir);
    
    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");
      
      lines.forEach((line, index) => {
        // Check for TODO/FIXME
        if (/TODO|FIXME|HACK|XXX|BUG/i.test(line)) {
          issues.push({
            id: `cq_${Date.now()}_${index}`,
            type: "todo",
            severity: /FIXME|BUG/i.test(line) ? "high" : "medium",
            file: file.replace(process.cwd(), ""),
            line: index + 1,
            description: line.trim(),
            detectedAt: new Date(),
          });
        }

        // Check for console.log (should use proper logging)
        if (/console\.log\(/.test(line) && !line.includes("//")) {
          issues.push({
            id: `cq_${Date.now()}_${index}_log`,
            type: "complexity",
            severity: "low",
            file: file.replace(process.cwd(), ""),
            line: index + 1,
            description: "console.log found - consider using proper logging",
            suggestedFix: "Replace with structured logging",
            detectedAt: new Date(),
          });
        }

        // Check for hardcoded secrets (simplified)
        if (/password|secret|apikey|api_key/i.test(line) && /['"]\w{10,}['"]/.test(line)) {
          issues.push({
            id: `cq_${Date.now()}_${index}_sec`,
            type: "security",
            severity: "critical",
            file: file.replace(process.cwd(), ""),
            line: index + 1,
            description: "Possible hardcoded secret detected",
            suggestedFix: "Move to environment variables",
            detectedAt: new Date(),
          });
        }
      });
    }
  } catch (error) {
    console.error("[PerpetualUpgrade] Code scan error:", error);
  }

  codeQualityStore.push(...issues);
  return issues;
}

async function getTypeScriptFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        files.push(...await getTypeScriptFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist
  }
  
  return files;
}

// ============================================================================
// ERROR LEARNING
// ============================================================================

/**
 * Learn from errors and suggest fixes
 */
export async function learnFromError(
  endpoint: string,
  errorMessage: string,
  stackTrace?: string
): Promise<string | null> {
  // Track error frequency
  const existing = errorLogStore.find(e => e.endpoint === endpoint && e.error === errorMessage);
  if (existing) {
    existing.count++;
    existing.timestamp = new Date();
  } else {
    errorLogStore.push({
      endpoint,
      error: errorMessage,
      timestamp: new Date(),
      count: 1,
    });
  }

  // If error is recurring, generate fix suggestion
  if (existing && existing.count >= 3) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are a senior software engineer. Analyze this recurring error and suggest a fix.
            
Endpoint: ${endpoint}
Error: ${errorMessage}
${stackTrace ? `Stack trace: ${stackTrace}` : ""}
Occurrences: ${existing.count}

Provide a concise fix suggestion.`
          },
          {
            role: "user",
            content: "Suggest a fix for this recurring error"
          }
        ],
        max_tokens: 500,
      });

      const suggestion = response.choices[0].message.content;
      
      if (suggestion) {
        addRecommendation({
          type: "security",
          priority: "high",
          title: `Recurring error in ${endpoint}`,
          description: `Error "${errorMessage}" has occurred ${existing.count} times`,
          affectedFiles: [endpoint],
          estimatedEffort: "hours",
          potentialImpact: "Improved stability",
          suggestedCode: suggestion,
        });
      }

      return suggestion;
    } catch (error) {
      console.error("[PerpetualUpgrade] Error analysis failed:", error);
    }
  }

  return null;
}

// ============================================================================
// UPGRADE RECOMMENDATIONS
// ============================================================================

function addRecommendation(rec: Omit<UpgradeRecommendation, "id" | "createdAt">): void {
  // Check if similar recommendation already exists
  const exists = recommendationStore.some(r => 
    r.title === rec.title && r.type === rec.type
  );
  
  if (!exists) {
    recommendationStore.push({
      id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ...rec,
      createdAt: new Date(),
    });
  }
}

/**
 * Get all upgrade recommendations
 */
export function getUpgradeRecommendations(): UpgradeRecommendation[] {
  return [...recommendationStore].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// ============================================================================
// SYSTEM HEALTH ASSESSMENT
// ============================================================================

/**
 * Get overall system health
 */
export function assessSystemHealth(): SystemHealth {
  const featureReport = getFeatureUsageReport();
  const perfReport = getPerformanceReport();
  const qualityIssues = codeQualityStore.filter(i => i.severity === "critical" || i.severity === "high");

  const featureAdoption = featureReport.totalFeatures > 0
    ? (featureReport.activeFeatures / featureReport.totalFeatures) * 100
    : 100;

  const performanceScore = perfReport.overallHealth;

  const codeQualityScore = Math.max(0, 100 - (qualityIssues.length * 5));

  const dependencyHealth = 100; // Would calculate from actual dependency checks

  const allMetrics = Array.from(performanceStore.values());
  const totalErrors = allMetrics.reduce((sum, m) => sum + m.errorCount, 0);
  const totalCalls = allMetrics.reduce((sum, m) => sum + m.totalCalls, 0);
  const errorRate = totalCalls > 0 ? (totalErrors / totalCalls) * 100 : 0;

  const overallScore = Math.round(
    (featureAdoption * 0.2) +
    (performanceScore * 0.3) +
    (codeQualityScore * 0.2) +
    (dependencyHealth * 0.1) +
    ((100 - errorRate) * 0.2)
  );

  return {
    overallScore,
    featureAdoption,
    performanceScore,
    codeQualityScore,
    dependencyHealth,
    errorRate,
    lastAssessed: new Date(),
  };
}

// ============================================================================
// AI-POWERED CODE IMPROVEMENT SUGGESTIONS
// ============================================================================

/**
 * Analyze code and suggest improvements
 */
export async function suggestCodeImprovements(
  filePath: string,
  code: string
): Promise<{
  suggestions: Array<{
    type: string;
    description: string;
    originalCode: string;
    improvedCode: string;
    reason: string;
  }>;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a senior TypeScript developer reviewing code for a wellness coaching platform.
          
Analyze the code and suggest improvements for:
1. Performance optimizations
2. Better error handling
3. Code clarity and maintainability
4. Security improvements
5. TypeScript best practices

Only suggest meaningful improvements, not style preferences.

Respond in JSON:
{
  "suggestions": [
    {
      "type": "performance|security|clarity|error-handling|best-practice",
      "description": "what to improve",
      "originalCode": "the problematic code snippet",
      "improvedCode": "the improved version",
      "reason": "why this is better"
    }
  ]
}`
        },
        {
          role: "user",
          content: `Review this code from ${filePath}:\n\n${code.slice(0, 4000)}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    return JSON.parse(response.choices[0].message.content || '{"suggestions":[]}');
  } catch (error) {
    console.error("[PerpetualUpgrade] Code analysis error:", error);
    return { suggestions: [] };
  }
}

// ============================================================================
// SCHEDULED TASKS
// ============================================================================

/**
 * Run daily health check and generate recommendations
 */
export async function runDailyHealthCheck(): Promise<{
  health: SystemHealth;
  newIssues: CodeQualityIssue[];
  recommendations: UpgradeRecommendation[];
}> {
  console.log("[PerpetualUpgrade] Running daily health check...");

  // Scan code quality
  const newIssues = await scanCodeQuality();

  // Assess overall health
  const health = assessSystemHealth();

  // Get recommendations
  const recommendations = getUpgradeRecommendations();

  // Log results
  console.log(`[PerpetualUpgrade] Health Score: ${health.overallScore}/100`);
  console.log(`[PerpetualUpgrade] New Issues: ${newIssues.length}`);
  console.log(`[PerpetualUpgrade] Recommendations: ${recommendations.length}`);

  return { health, newIssues, recommendations };
}

// ============================================================================
// EXPORTS
// ============================================================================

const PerpetualUpgrade = {
  // Feature tracking
  trackFeatureUsage,
  getFeatureUsageReport,
  
  // Performance
  recordPerformance,
  getPerformanceReport,
  
  // Code quality
  scanCodeQuality,
  
  // Error learning
  learnFromError,
  
  // Recommendations
  getUpgradeRecommendations,
  
  // Health
  assessSystemHealth,
  
  // AI suggestions
  suggestCodeImprovements,
  
  // Scheduled
  runDailyHealthCheck,
};

export default PerpetualUpgrade;
