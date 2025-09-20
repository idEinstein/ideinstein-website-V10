#!/usr/bin/env node
/**
 * Debug Zoho Environment Variables
 * Checks if the environment variables are properly set
 */

console.log('🔍 Debugging Zoho Environment Variables\n');

const requiredVars = [
  'ZOHO_CLIENT_ID',
  'ZOHO_CLIENT_SECRET',
  'ZOHO_CRM_REFRESH_TOKEN',
  'ZOHO_BOOKINGS_REFRESH_TOKEN',
  'ZOHO_WORKDRIVE_REFRESH_TOKEN',
  'ZOHO_CAMPAIGNS_REFRESH_TOKEN'
];

const alternativeVars = [
  'ZOHO_CRM_REFRESH',
  'ZOHO_BOOKINGS_REFRESH', 
  'ZOHO_WORKDRIVE_REFRESH',
  'ZOHO_CAMPAIGNS_REFRESH'
];

console.log('📋 Expected Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n📋 Alternative Environment Variables (production format):');
alternativeVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n🔧 Environment Info:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`ZOHO_DC: ${process.env.ZOHO_DC || 'in (default)'}`);

// Check if we're using the alternative format
const usingAlternative = process.env.ZOHO_CRM_REFRESH && !process.env.ZOHO_CRM_REFRESH_TOKEN;
if (usingAlternative) {
  console.log('\n⚠️  ISSUE DETECTED: Using alternative environment variable format');
  console.log('   The code expects: ZOHO_CRM_REFRESH_TOKEN');
  console.log('   But found: ZOHO_CRM_REFRESH');
  console.log('\n🔧 SOLUTION: Update environment variables or fix the code mapping');
}

// Test token format
const testToken = process.env.ZOHO_CRM_REFRESH_TOKEN || process.env.ZOHO_CRM_REFRESH;
if (testToken) {
  const isValidFormat = testToken.startsWith('1000.') && testToken.includes('.');
  console.log(`\n🔍 Token Format Check: ${isValidFormat ? '✅ Valid' : '❌ Invalid'}`);
  if (!isValidFormat) {
    console.log('   Expected format: 1000.xxxxxxxx.xxxxxxxx');
    console.log(`   Found: ${testToken.substring(0, 30)}...`);
  }
}