#!/usr/bin/env tsx
/**
 * Test script for cryptographic validation
 */

import { validateCryptographicImplementations } from '../lib/security/crypto-validator';

async function testCryptoValidation() {
  console.log('🔐 Testing cryptographic validation...\n');
  
  try {
    const { results, summary } = await validateCryptographicImplementations();
    
    console.log('📊 Summary:');
    console.log(`Total Checks: ${summary.totalChecks}`);
    console.log(`Secure Implementations: ${summary.secureImplementations}`);
    console.log(`Warnings: ${summary.warnings}`);
    console.log(`Vulnerabilities: ${summary.vulnerabilities}`);
    console.log(`Critical Issues: ${summary.criticalIssues}`);
    console.log(`Overall Score: ${summary.overallScore}%`);
    console.log(`Overall Status: ${summary.overallStatus}\n`);
    
    console.log('🔍 Detailed Results:');
    console.log('===================');
    
    // Group results by category
    const categories = Array.from(new Set(results.map(r => r.category)));
    
    for (const category of categories) {
      console.log(`\n📂 ${category}:`);
      const categoryResults = results.filter(r => r.category === category);
      
      for (const result of categoryResults) {
        const statusIcon = result.status === 'secure' ? '✅' : 
                          result.status === 'warning' ? '⚠️' : '❌';
        console.log(`  ${statusIcon} ${result.check}`);
        console.log(`     Status: ${result.status.toUpperCase()}`);
        console.log(`     Severity: ${result.severity.toUpperCase()}`);
        console.log(`     Details: ${result.details}`);
        
        if (result.recommendations.length > 0) {
          console.log(`     Recommendations:`);
          result.recommendations.forEach(rec => {
            console.log(`       - ${rec}`);
          });
        }
        
        if (result.codeExamples && result.codeExamples.length > 0) {
          console.log(`     Code Examples:`);
          result.codeExamples.forEach(example => {
            console.log(`       ${example}`);
          });
        }
        console.log('');
      }
    }
    
    console.log('\n✅ Cryptographic validation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Cryptographic validation test failed:', error);
    process.exit(1);
  }
}

testCryptoValidation();