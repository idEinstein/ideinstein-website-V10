#!/usr/bin/env node
/**
 * Update Vercel Environment Variables
 * Generates the exact commands needed to fix production Zoho integration
 */

require('dotenv').config({ path: '.env.production' });

console.log('🔧 Vercel Environment Variable Update Script\n');

// Check which variables we have locally
const requiredVars = [
  'ZOHO_DC',
  'ZOHO_CLIENT_ID', 
  'ZOHO_CLIENT_SECRET',
  'ZOHO_CRM_REFRESH_TOKEN',
  'ZOHO_BOOKINGS_REFRESH_TOKEN',
  'ZOHO_WORKDRIVE_REFRESH_TOKEN',
  'ZOHO_CAMPAIGNS_REFRESH_TOKEN',
  'BOOKINGS_WORKSPACE_ID',
  'BOOKINGS_SERVICE_ID', 
  'BOOKINGS_STAFF_ID',
  'BOOKINGS_TIME_ZONE'
];

console.log('📋 Current Local Environment Variables:');
const missingVars = [];
const availableVars = {};

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.length > 20 ? value.substring(0, 20) + '...' : value}`);
    availableVars[varName] = value;
  } else {
    console.log(`❌ ${varName}: MISSING`);
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log(`\n🚨 Missing variables: ${missingVars.join(', ')}`);
  console.log('Please check your .env.production file');
  process.exit(1);
}

console.log('\n🚀 OPTION 1: Vercel CLI Commands');
console.log('Run these commands one by one:\n');

Object.entries(availableVars).forEach(([key, value]) => {
  console.log(`vercel env add ${key} production`);
  console.log(`# Enter: ${value}`);
  console.log('');
});

console.log('\n🌐 OPTION 2: Vercel Dashboard');
console.log('1. Go to: https://vercel.com/dashboard');
console.log('2. Select your IdEinstein project');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add/Update these variables:\n');

Object.entries(availableVars).forEach(([key, value]) => {
  console.log(`${key} = ${value}`);
});

console.log('\n🔄 OPTION 3: Bulk Update Script');
console.log('Create a .env file with these variables and use vercel env pull/push:\n');

Object.entries(availableVars).forEach(([key, value]) => {
  console.log(`${key}="${value}"`);
});

console.log('\n⚡ QUICK TEST AFTER UPDATE:');
console.log('1. Redeploy: vercel --prod');
console.log('2. Test: node scripts/test-production-env.js');
console.log('3. Check: https://ideinstein.com/api/bookings/availability?date=2025-09-23');
console.log('   → Should show "source": "zoho" instead of "fallback"');

console.log('\n🎯 EXPECTED RESULT:');
console.log('After updating environment variables and redeploying:');
console.log('- Booking availability should return "source": "zoho"');
console.log('- Consultation form should show actual Zoho time slots');
console.log('- No more "Using fallback slots" warning');

// Generate a simple verification script
const verifyScript = `#!/bin/bash
echo "🔍 Verifying Zoho Integration Fix..."
echo ""

echo "📅 Testing booking availability..."
curl -s "https://ideinstein.com/api/bookings/availability?date=2025-09-23" | jq '.source'

echo ""
echo "Expected result: \\"zoho\\" (not \\"fallback\\")"
echo ""
echo "If you see \\"zoho\\", the fix is working!"
echo "If you see \\"fallback\\", environment variables need to be updated."
`;

require('fs').writeFileSync('scripts/verify-production-fix.sh', verifyScript);
console.log('\n📄 Generated verification script: scripts/verify-production-fix.sh');