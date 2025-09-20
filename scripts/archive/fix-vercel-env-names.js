#!/usr/bin/env node
/**
 * Fix Vercel Environment Variable Names
 * The issue is that Vercel environment variables have different names than what the code expects
 */

require('dotenv').config({ path: '.env.production' });

console.log('🔧 Fixing Vercel Environment Variable Names\n');

console.log('📋 ISSUE IDENTIFIED:');
console.log('The code expects these exact variable names:');
console.log('- ZOHO_CRM_REFRESH_TOKEN');
console.log('- ZOHO_WORKDRIVE_REFRESH_TOKEN');
console.log('- ZOHO_BOOKINGS_REFRESH_TOKEN');
console.log('- ZOHO_CAMPAIGNS_REFRESH_TOKEN');
console.log('');

console.log('🔍 But you might have them named as:');
console.log('- ZOHO_CRM_REFRESH');
console.log('- ZOHO_WORKDRIVE_REFRESH');
console.log('- ZOHO_BOOKINGS_REFRESH');
console.log('- ZOHO_CAMPAIGNS_REFRESH');
console.log('');

console.log('🚀 SOLUTION: Add these EXACT variable names to Vercel:');
console.log('');

const requiredVars = {
  'ZOHO_CRM_REFRESH_TOKEN': process.env.ZOHO_CRM_REFRESH_TOKEN,
  'ZOHO_BOOKINGS_REFRESH_TOKEN': process.env.ZOHO_BOOKINGS_REFRESH_TOKEN,
  'ZOHO_WORKDRIVE_REFRESH_TOKEN': process.env.ZOHO_WORKDRIVE_REFRESH_TOKEN,
  'ZOHO_CAMPAIGNS_REFRESH_TOKEN': process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN,
  'ZOHO_BOOKS_REFRESH_TOKEN': process.env.ZOHO_BOOKS_REFRESH_TOKEN,
  'ZOHO_PROJECTS_REFRESH_TOKEN': process.env.ZOHO_PROJECTS_REFRESH_TOKEN,
};

Object.entries(requiredVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}`);
    console.log(`   Value: ${value}`);
    console.log(`   → Add this EXACT name to Vercel dashboard`);
    console.log('');
  } else {
    console.log(`❌ ${key}: MISSING from local .env.production`);
    console.log('');
  }
});

console.log('📝 STEP-BY-STEP FIX:');
console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
console.log('2. Add these EXACT variable names (case-sensitive):');
console.log('');

Object.entries(requiredVars).forEach(([key, value]) => {
  if (value) {
    console.log(`   Variable Name: ${key}`);
    console.log(`   Value: ${value}`);
    console.log(`   Environment: Production`);
    console.log('   ---');
  }
});

console.log('');
console.log('3. After adding all variables, redeploy:');
console.log('   vercel --prod');
console.log('');
console.log('4. Test the fix:');
console.log('   node scripts/test-production-env.js');
console.log('');

console.log('🎯 EXPECTED RESULT:');
console.log('After adding the correct variable names:');
console.log('- CRM should show "Connected" instead of "Error"');
console.log('- WorkDrive should show "Connected" instead of "Error"');
console.log('- Booking availability should return "source": "zoho"');
console.log('- No more fallback slots warning');

console.log('');
console.log('⚠️  IMPORTANT NOTES:');
console.log('- Variable names are case-sensitive');
console.log('- Use EXACT names shown above');
console.log('- Make sure to select "Production" environment');
console.log('- Redeploy after adding variables');

// Create a verification checklist
const checklist = `# Vercel Environment Variables Checklist

## ✅ Required Variables (EXACT names):

- [ ] ZOHO_CRM_REFRESH_TOKEN
- [ ] ZOHO_BOOKINGS_REFRESH_TOKEN  
- [ ] ZOHO_WORKDRIVE_REFRESH_TOKEN
- [ ] ZOHO_CAMPAIGNS_REFRESH_TOKEN
- [ ] ZOHO_BOOKS_REFRESH_TOKEN
- [ ] ZOHO_PROJECTS_REFRESH_TOKEN

## ✅ Also Required:

- [ ] ZOHO_CLIENT_ID
- [ ] ZOHO_CLIENT_SECRET
- [ ] ZOHO_DC (value: "in")
- [ ] BOOKINGS_SERVICE_ID
- [ ] BOOKINGS_STAFF_ID
- [ ] BOOKINGS_WORKSPACE_ID

## ✅ After Adding Variables:

- [ ] Redeploy: vercel --prod
- [ ] Test: node scripts/test-production-env.js
- [ ] Verify: Check dashboard shows all services "Connected"
`;

require('fs').writeFileSync('VERCEL_ENV_CHECKLIST.md', checklist);
console.log('📄 Created checklist: VERCEL_ENV_CHECKLIST.md');