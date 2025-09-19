#!/usr/bin/env node
/**
 * Fix Production Zoho Integration
 * Updates Vercel environment variables with correct Zoho tokens
 */

const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.production' });

console.log('🔧 Fixing Production Zoho Integration\n');

// Environment variables to update in Vercel
const zohoVars = {
  'ZOHO_DC': process.env.ZOHO_DC || 'in',
  'ZOHO_CLIENT_ID': process.env.ZOHO_CLIENT_ID,
  'ZOHO_CLIENT_SECRET': process.env.ZOHO_CLIENT_SECRET,
  'ZOHO_CRM_REFRESH_TOKEN': process.env.ZOHO_CRM_REFRESH_TOKEN,
  'ZOHO_BOOKINGS_REFRESH_TOKEN': process.env.ZOHO_BOOKINGS_REFRESH_TOKEN,
  'ZOHO_WORKDRIVE_REFRESH_TOKEN': process.env.ZOHO_WORKDRIVE_REFRESH_TOKEN,
  'ZOHO_CAMPAIGNS_REFRESH_TOKEN': process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN,
  'ZOHO_BOOKS_REFRESH_TOKEN': process.env.ZOHO_BOOKS_REFRESH_TOKEN,
  'ZOHO_PROJECTS_REFRESH_TOKEN': process.env.ZOHO_PROJECTS_REFRESH_TOKEN,
  
  // Zoho service configuration
  'BOOKINGS_WORKSPACE_ID': process.env.BOOKINGS_WORKSPACE_ID,
  'BOOKINGS_SERVICE_ID': process.env.BOOKINGS_SERVICE_ID,
  'BOOKINGS_STAFF_ID': process.env.BOOKINGS_STAFF_ID,
  'BOOKINGS_TIME_ZONE': process.env.BOOKINGS_TIME_ZONE || 'Europe/Berlin',
  'WORKDRIVE_PARENT_FOLDER_ID': process.env.WORKDRIVE_PARENT_FOLDER_ID,
  'CAMPAIGNS_LIST_KEY': process.env.CAMPAIGNS_LIST_KEY,
  'ZOHO_ORG_ID': process.env.ZOHO_ORG_ID,
  'ZOHO_PROJECTS_PORTAL_ID': process.env.ZOHO_PROJECTS_PORTAL_ID
};

console.log('📋 Environment Variables to Update:');
Object.entries(zohoVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value.length > 20 ? value.substring(0, 20) + '...' : value}`);
  } else {
    console.log(`❌ ${key}: MISSING`);
  }
});

// Generate Vercel CLI commands
console.log('\n🚀 Vercel CLI Commands to Run:');
console.log('Copy and paste these commands to update your Vercel environment variables:\n');

Object.entries(zohoVars).forEach(([key, value]) => {
  if (value) {
    // Escape special characters for shell
    const escapedValue = value.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    console.log(`vercel env add ${key} production`);
    console.log(`# When prompted, enter: ${escapedValue}`);
    console.log('');
  }
});

console.log('📝 Alternative: Manual Update via Vercel Dashboard');
console.log('1. Go to: https://vercel.com/your-team/ideinstein/settings/environment-variables');
console.log('2. Update each variable listed above');
console.log('3. Redeploy your application');

console.log('\n🔄 After updating environment variables:');
console.log('1. Redeploy: vercel --prod');
console.log('2. Test: curl https://ideinstein.com/api/debug/zoho-tokens?service=crm');
console.log('   (with Authorization header)');

// Generate a deployment script
const deployScript = `#!/bin/bash
# Auto-generated deployment script
echo "🚀 Deploying with updated Zoho configuration..."

# Build and deploy
npm run build
vercel --prod

echo "✅ Deployment complete!"
echo "🔍 Test the deployment:"
echo "curl -H 'Authorization: Bearer YOUR_ADMIN_PASSWORD' 'https://ideinstein.com/api/debug/zoho-tokens?service=crm'"
`;

require('fs').writeFileSync('scripts/deploy-with-zoho-fix.sh', deployScript);
console.log('\n📄 Generated deployment script: scripts/deploy-with-zoho-fix.sh');

console.log('\n🎯 Quick Test Commands:');
console.log('# Test locally first:');
console.log('npm run zoho:diagnose');
console.log('');
console.log('# Test production after deployment:');
console.log('curl -H "Authorization: Bearer YOUR_ADMIN_PASSWORD" \\');
console.log('     "https://ideinstein.com/api/debug/zoho-tokens?service=crm"');