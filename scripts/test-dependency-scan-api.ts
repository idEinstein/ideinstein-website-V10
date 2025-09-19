#!/usr/bin/env tsx
/**
 * Test script for dependency scanning API
 */

async function testDependencyScanAPI() {
  try {
    console.log('🧪 Testing dependency scanning API...');
    
    // Import the scanner directly to test it
    const { scanDependencies, isDependencyScanningAvailable } = await import('@/lib/security/dependency-scanner');
    
    // Test availability check
    console.log('\n1️⃣ Testing availability check...');
    const availability = await isDependencyScanningAvailable();
    console.log('Available methods:', availability.methods);
    console.log('Limitations:', availability.limitations);
    console.log('Available:', availability.available);
    
    // Test dependency scan
    console.log('\n2️⃣ Testing dependency scan...');
    const result = await scanDependencies();
    console.log('Scan success:', result.success);
    console.log('Scan method:', result.method);
    console.log('Vulnerabilities found:', result.summary.total);
    console.log('Scan time:', result.scanTime + 'ms');
    
    if (result.recommendations.length > 0) {
      console.log('\n📋 Recommendations:');
      result.recommendations.slice(0, 3).forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    }
    
    console.log('\n✅ Dependency scanning API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Dependency scanning API test failed:', error);
    process.exit(1);
  }
}

testDependencyScanAPI();