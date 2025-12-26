/**
 * ADD SELF-LEARNING INTEGRATION TO KEY ROUTERS
 * 
 * This script identifies routers that should have self-learning integration
 * and adds the necessary imports and tracking calls.
 */

import * as fs from 'fs';
import * as path from 'path';

const ROUTERS_DIR = './server/routers';

// Routers that MUST have self-learning integration
const PRIORITY_ROUTERS = [
  'subscriptions.ts',
  'subscriptionWebhook.ts',
  'emailAutomation.ts',
  'emailCapture.ts',
  'trial.ts',
  'trialSignup.ts',
  'sessionAnalysis.ts',
  'sessionPayments.ts',
  'contentPipeline.ts',
  'contentStudio.ts',
  'analytics.ts',
  'admin.ts',
  'coachDashboard.ts',
  'structuredPrograms.ts',
];

interface IntegrationResult {
  file: string;
  status: 'already_integrated' | 'added' | 'skipped' | 'error';
  message: string;
}

function hasSelfLearningIntegration(content: string): boolean {
  return content.includes('SelfLearning') || content.includes('selfLearning');
}

function addSelfLearningImport(content: string): string {
  // Check if already imported
  if (content.includes('from "../selfLearningIntegration"') || 
      content.includes('from "../selfLearningIntegration.js"')) {
    return content;
  }
  
  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex >= 0) {
    // Add import after the last import
    lines.splice(lastImportIndex + 1, 0, 'import { SelfLearning } from "../selfLearningIntegration.js";');
    return lines.join('\n');
  }
  
  // If no imports found, add at the top after comments
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith('/*') && 
        !lines[i].trim().startsWith('*') && 
        !lines[i].trim().startsWith('//') &&
        lines[i].trim() !== '') {
      insertIndex = i;
      break;
    }
  }
  
  lines.splice(insertIndex, 0, 'import { SelfLearning } from "../selfLearningIntegration.js";');
  return lines.join('\n');
}

function analyzeRouter(filePath: string): IntegrationResult {
  const fileName = path.basename(filePath);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (hasSelfLearningIntegration(content)) {
      return {
        file: fileName,
        status: 'already_integrated',
        message: 'Already has SelfLearning integration',
      };
    }
    
    // Add import (but don't add tracking calls automatically - that requires understanding the code)
    const updatedContent = addSelfLearningImport(content);
    
    // Don't write yet - just report what needs to be done
    return {
      file: fileName,
      status: 'skipped',
      message: 'Needs manual integration - import can be added but tracking calls require code review',
    };
    
  } catch (error) {
    return {
      file: fileName,
      status: 'error',
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function main() {
  console.log('='.repeat(80));
  console.log('SELF-LEARNING INTEGRATION ANALYSIS');
  console.log('='.repeat(80));
  console.log();
  
  const results: IntegrationResult[] = [];
  
  for (const routerFile of PRIORITY_ROUTERS) {
    const filePath = path.join(ROUTERS_DIR, routerFile);
    
    if (!fs.existsSync(filePath)) {
      results.push({
        file: routerFile,
        status: 'error',
        message: 'File not found',
      });
      continue;
    }
    
    const result = analyzeRouter(filePath);
    results.push(result);
  }
  
  // Print results
  console.log('PRIORITY ROUTERS ANALYSIS:\n');
  
  const alreadyIntegrated = results.filter(r => r.status === 'already_integrated');
  const needsIntegration = results.filter(r => r.status === 'skipped');
  const errors = results.filter(r => r.status === 'error');
  
  console.log(`✅ Already Integrated: ${alreadyIntegrated.length}`);
  for (const r of alreadyIntegrated) {
    console.log(`   - ${r.file}`);
  }
  
  console.log(`\n⚠️  Needs Integration: ${needsIntegration.length}`);
  for (const r of needsIntegration) {
    console.log(`   - ${r.file}`);
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Errors: ${errors.length}`);
    for (const r of errors) {
      console.log(`   - ${r.file}: ${r.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('RECOMMENDATIONS:');
  console.log('='.repeat(80));
  console.log();
  
  if (needsIntegration.length > 0) {
    console.log('The following routers should have SelfLearning integration:');
    console.log();
    for (const r of needsIntegration) {
      console.log(`📝 ${r.file}:`);
      console.log(`   1. Add import: import { SelfLearning } from "../selfLearningIntegration.js";`);
      console.log(`   2. Add tracking calls after key operations (create, update, complete, etc.)`);
      console.log(`   3. Track user satisfaction, success/failure, and user choices`);
      console.log();
    }
  } else {
    console.log('✅ All priority routers already have SelfLearning integration!');
  }
}

main();
