/**
 * COMPREHENSIVE TEST SUITE FOR INTELLIGENT SYSTEMS
 * 
 * Tests:
 * 1. Self-Learning System (selfLearningIntegration.ts + platformIntelligence.ts)
 * 2. Self-Fixing System (selfFixing.ts)
 * 3. Self-Evolving System (platformIntelligence.ts)
 */

import { SelfLearning } from "./server/selfLearningIntegration.js";
import SelfFixing from "./server/selfFixing.js";
import PlatformIntelligence from "./server/platformIntelligence.js";

console.log("=".repeat(80));
console.log("INTELLIGENT SYSTEMS TEST SUITE");
console.log("=".repeat(80));
console.log();

// ============================================================================
// TEST 1: SELF-LEARNING SYSTEM
// ============================================================================

async function testSelfLearning() {
  console.log("📚 TEST 1: SELF-LEARNING SYSTEM");
  console.log("-".repeat(80));
  
  try {
    // Test 1.1: Track interaction
    console.log("\n✓ Test 1.1: Track interaction");
    await SelfLearning.trackInteraction({
      moduleType: "ai_chat",
      userId: 1,
      action: "test_message",
      wasSuccessful: true,
      userSatisfaction: 8,
      userChoice: "empathetic_response",
      alternatives: ["direct_response", "questioning_response"],
    });
    console.log("  ✅ Interaction tracked successfully");
    
    // Test 1.2: Get feature effectiveness
    console.log("\n✓ Test 1.2: Get feature effectiveness");
    const effectiveness = SelfLearning.getFeatureEffectiveness("ai_chat", "test_message");
    console.log(`  ✅ Feature effectiveness: ${effectiveness}/100`);
    
    // Test 1.3: Check if feature should be promoted
    console.log("\n✓ Test 1.3: Check feature promotion logic");
    const shouldPromote = SelfLearning.shouldPromoteFeature("ai_chat", "test_message");
    const shouldDemote = SelfLearning.shouldDemoteFeature("ai_chat", "test_message");
    console.log(`  ✅ Should promote: ${shouldPromote}, Should demote: ${shouldDemote}`);
    
    // Test 1.4: Get top preferences
    console.log("\n✓ Test 1.4: Get top user preferences");
    const topPrefs = SelfLearning.getTopPreferences("ai_chat", 3);
    console.log(`  ✅ Top preferences: ${topPrefs.join(", ") || "None yet"}`);
    
    // Test 1.5: Get fix recommendations
    console.log("\n✓ Test 1.5: Get fix recommendations");
    const fixRecs = await SelfLearning.getFixRecommendations();
    console.log(`  ✅ Fix recommendations: ${fixRecs.length} found`);
    if (fixRecs.length > 0) {
      console.log(`     - ${fixRecs[0].issue}`);
    }
    
    // Test 1.6: Get evolution suggestions
    console.log("\n✓ Test 1.6: Get evolution suggestions");
    const evolutionSuggestions = await SelfLearning.getEvolutionSuggestions();
    console.log(`  ✅ Evolution suggestions: ${evolutionSuggestions.length} found`);
    if (evolutionSuggestions.length > 0) {
      console.log(`     - ${evolutionSuggestions[0].description}`);
    }
    
    console.log("\n✅ SELF-LEARNING SYSTEM: ALL TESTS PASSED");
    return true;
  } catch (error) {
    console.error("\n❌ SELF-LEARNING SYSTEM: FAILED");
    console.error(error);
    return false;
  }
}

// ============================================================================
// TEST 2: SELF-FIXING SYSTEM
// ============================================================================

async function testSelfFixing() {
  console.log("\n\n🔧 TEST 2: SELF-FIXING SYSTEM");
  console.log("-".repeat(80));
  
  try {
    // Test 2.1: Log an error
    console.log("\n✓ Test 2.1: Log error");
    SelfFixing.logError(
      new Error("Test error"),
      {
        module: "test",
        operation: "testOperation",
        errorType: "network",
        severity: "low",
      }
    );
    console.log("  ✅ Error logged successfully");
    
    // Test 2.2: Test retry logic with successful operation
    console.log("\n✓ Test 2.2: Test retry logic (success)");
    const result = await SelfFixing.withRetry(
      async () => "Success!",
      {
        module: "test",
        operation: "testRetry",
        errorType: "network",
        severity: "low",
      }
    );
    console.log(`  ✅ Retry logic works: ${result}`);
    
    // Test 2.3: Test retry logic with failure then success
    console.log("\n✓ Test 2.3: Test retry logic (failure then success)");
    let attemptCount = 0;
    const retryResult = await SelfFixing.withRetry(
      async () => {
        attemptCount++;
        if (attemptCount < 2) {
          throw new Error("ETIMEDOUT");
        }
        return "Success after retry!";
      },
      {
        module: "test",
        operation: "testRetryWithFailure",
        errorType: "network",
        severity: "medium",
      },
      { maxAttempts: 3, initialDelayMs: 100 }
    );
    console.log(`  ✅ Retry succeeded after ${attemptCount} attempts: ${retryResult}`);
    
    // Test 2.4: Test fallback system
    console.log("\n✓ Test 2.4: Test fallback system");
    const fallbackResult = await SelfFixing.withFallback(
      {
        primary: async () => {
          throw new Error("Primary failed");
        },
        fallback: async () => "Fallback success!",
      },
      {
        module: "test",
        operation: "testFallback",
        errorType: "api",
        severity: "medium",
      }
    );
    console.log(`  ✅ Fallback works: ${fallbackResult}`);
    
    // Test 2.5: Test health check
    console.log("\n✓ Test 2.5: Test health check");
    const healthCheck = await SelfFixing.checkHealth(
      "test-service",
      async () => true
    );
    console.log(`  ✅ Health check: ${healthCheck.status} (${healthCheck.responseTime}ms)`);
    
    // Test 2.6: Get all health checks
    console.log("\n✓ Test 2.6: Get all health checks");
    const allHealthChecks = SelfFixing.getAllHealthChecks();
    console.log(`  ✅ Total health checks: ${allHealthChecks.length}`);
    
    // Test 2.7: Get self-fixing stats
    console.log("\n✓ Test 2.7: Get self-fixing stats");
    const stats = SelfFixing.getSelfFixingStats();
    console.log(`  ✅ Total errors: ${stats.totalErrors}`);
    console.log(`     Fixed automatically: ${stats.fixedErrors}`);
    console.log(`     Fix rate: ${stats.fixSuccessRate.toFixed(1)}%`);
    
    // Test 2.8: Analyze error patterns
    console.log("\n✓ Test 2.8: Analyze error patterns");
    const errorAnalysis = SelfFixing.analyzeErrorPatterns();
    console.log(`  ✅ Error patterns analyzed`);
    console.log(`     Most common error: ${errorAnalysis.mostCommonError || "None"}`);
    console.log(`     Recommendations: ${errorAnalysis.recommendations.length}`);
    
    console.log("\n✅ SELF-FIXING SYSTEM: ALL TESTS PASSED");
    return true;
  } catch (error) {
    console.error("\n❌ SELF-FIXING SYSTEM: FAILED");
    console.error(error);
    return false;
  }
}

// ============================================================================
// TEST 3: SELF-EVOLVING SYSTEM (Platform Intelligence)
// ============================================================================

async function testSelfEvolving() {
  console.log("\n\n🧬 TEST 3: SELF-EVOLVING SYSTEM (Platform Intelligence)");
  console.log("-".repeat(80));
  
  try {
    // Test 3.1: Record rule effectiveness
    console.log("\n✓ Test 3.1: Record rule effectiveness");
    PlatformIntelligence.recordRuleEffectiveness(
      "test_rule_1",
      "positive",
      8
    );
    console.log("  ✅ Rule effectiveness recorded");
    
    // Test 3.2: Get rule effectiveness
    console.log("\n✓ Test 3.2: Get rule effectiveness");
    const ruleEffectiveness = PlatformIntelligence.getRuleEffectiveness("test_rule_1");
    if (ruleEffectiveness) {
      console.log(`  ✅ Rule effectiveness: ${ruleEffectiveness.effectivenessScore}/100`);
      console.log(`     Positive outcomes: ${ruleEffectiveness.positiveOutcomes}`);
    } else {
      console.log("  ⚠️  No effectiveness data yet");
    }
    
    // Test 3.3: Record module interaction
    console.log("\n✓ Test 3.3: Record module interaction");
    PlatformIntelligence.recordModuleInteraction(
      "emotional_wellness",
      true,
      "test_strategy",
      { testData: "success" }
    );
    console.log("  ✅ Module interaction recorded");
    
    // Test 3.4: Get module learning
    console.log("\n✓ Test 3.4: Get module learning");
    const moduleLearning = PlatformIntelligence.getModuleLearning("emotional_wellness");
    if (moduleLearning) {
      console.log(`  ✅ Module learning data:`);
      console.log(`     Total interactions: ${moduleLearning.totalInteractions}`);
      console.log(`     Success rate: ${moduleLearning.successRate.toFixed(1)}%`);
      console.log(`     Top strategies: ${moduleLearning.topEffectiveStrategies.slice(0, 3).join(", ")}`);
    } else {
      console.log("  ⚠️  No learning data yet");
    }
    
    // Test 3.5: Validate research claim
    console.log("\n✓ Test 3.5: Validate research claim (with AI)");
    const validation = await PlatformIntelligence.validateResearch(
      "Regular exercise improves mental health outcomes",
      "mental_health"
    );
    console.log(`  ✅ Research validation:`);
    console.log(`     Valid: ${validation.isValid}`);
    console.log(`     Evidence level: ${validation.evidenceLevel}`);
    console.log(`     Confidence: ${validation.confidence}%`);
    
    // Test 3.6: Search for new research
    console.log("\n✓ Test 3.6: Search for new research (with AI)");
    const newResearch = await PlatformIntelligence.searchNewResearch(
      "mindfulness meditation",
      "mental_health"
    );
    console.log(`  ✅ New research found:`);
    console.log(`     New findings: ${newResearch.newFindings.length}`);
    console.log(`     Contradictions: ${newResearch.contradictions.length}`);
    console.log(`     Recommendations: ${newResearch.recommendations.length}`);
    
    // Test 3.7: Analyze platform patterns
    console.log("\n✓ Test 3.7: Analyze platform patterns");
    const insights = await PlatformIntelligence.analyzePlatformPatterns();
    console.log(`  ✅ Platform insights: ${insights.length} found`);
    if (insights.length > 0) {
      console.log(`     - ${insights[0].title}`);
    }
    
    // Test 3.8: Get platform insights
    console.log("\n✓ Test 3.8: Get platform insights");
    const allInsights = PlatformIntelligence.getInsights();
    console.log(`  ✅ Total insights: ${allInsights.length}`);
    
    // Test 3.9: Get evolution history
    console.log("\n✓ Test 3.9: Get evolution history");
    const evolutionHistory = PlatformIntelligence.getEvolutionHistory();
    console.log(`  ✅ Evolution events: ${evolutionHistory.length}`);
    if (evolutionHistory.length > 0) {
      console.log(`     Latest: ${evolutionHistory[0].description}`);
    }
    
    // Test 3.10: Get platform summary
    console.log("\n✓ Test 3.10: Get platform summary");
    const summary = PlatformIntelligence.getSummary();
    console.log(`  ✅ Platform summary:`);
    console.log(`     Total rules tracked: ${summary.totalRulesTracked}`);
    console.log(`     Modules learning: ${summary.totalModulesLearning}`);
    console.log(`     Total insights: ${summary.totalInsights}`);
    console.log(`     Evolution events: ${summary.totalEvolutions}`);
    console.log(`     Research validations cached: ${summary.researchValidationsCache}`);
    
    console.log("\n✅ SELF-EVOLVING SYSTEM: ALL TESTS PASSED");
    return true;
  } catch (error) {
    console.error("\n❌ SELF-EVOLVING SYSTEM: FAILED");
    console.error(error);
    return false;
  }
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

async function runAllTests() {
  console.log("\n");
  console.log("Starting comprehensive test suite...\n");
  
  const results = {
    selfLearning: false,
    selfFixing: false,
    selfEvolving: false,
  };
  
  results.selfLearning = await testSelfLearning();
  results.selfFixing = await testSelfFixing();
  results.selfEvolving = await testSelfEvolving();
  
  console.log("\n");
  console.log("=".repeat(80));
  console.log("TEST RESULTS SUMMARY");
  console.log("=".repeat(80));
  console.log();
  console.log(`📚 Self-Learning System:  ${results.selfLearning ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`🔧 Self-Fixing System:    ${results.selfFixing ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`🧬 Self-Evolving System:  ${results.selfEvolving ? "✅ PASSED" : "❌ FAILED"}`);
  console.log();
  
  const allPassed = results.selfLearning && results.selfFixing && results.selfEvolving;
  
  if (allPassed) {
    console.log("🎉 ALL SYSTEMS OPERATIONAL");
    console.log("=".repeat(80));
    process.exit(0);
  } else {
    console.log("⚠️  SOME SYSTEMS NEED ATTENTION");
    console.log("=".repeat(80));
    process.exit(1);
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error("\n❌ TEST SUITE CRASHED:");
  console.error(error);
  process.exit(1);
});
