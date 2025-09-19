#!/usr/bin/env node
/**
 * Comprehensive Zoho Issue Diagnosis
 * Tests all aspects of the Zoho integration to find the root cause
 */

// Load environment variables from production
require('dotenv').config({ path: '.env.production' });

console.log('🔍 Comprehensive Zoho Issue Diagnosis\n');

// 1. Environment Variable Check
console.log('📋 1. Environment Variables Check:');
const requiredVars = [
  'ZOHO_DC',
  'ZOHO_CLIENT_ID', 
  'ZOHO_CLIENT_SECRET',
  'ZOHO_CRM_REFRESH_TOKEN',
  'ZOHO_BOOKINGS_REFRESH_TOKEN',
  'ZOHO_WORKDRIVE_REFRESH_TOKEN',
  'ZOHO_CAMPAIGNS_REFRESH_TOKEN'
];

let envIssues = [];
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.length > 20 ? value.substring(0, 20) + '...' : value}`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    envIssues.push(varName);
  }
});

if (envIssues.length > 0) {
  console.log(`\n🚨 Missing environment variables: ${envIssues.join(', ')}`);
  console.log('   Please check your .env.production file');
  process.exit(1);
}

// 2. Network Connectivity Test
console.log('\n🌐 2. Network Connectivity Test:');
const DC_ENV = process.env.ZOHO_DC || "in";
const OAUTH_BASE = {
  in: "https://accounts.zoho.in",
  eu: "https://accounts.zoho.eu",
  com: "https://accounts.zoho.com",
  "com.au": "https://accounts.zoho.com.au", 
  jp: "https://accounts.zoho.jp",
}[DC_ENV];

console.log(`Testing connectivity to: ${OAUTH_BASE}`);

async function testConnectivity() {
  try {
    const response = await fetch(`${OAUTH_BASE}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=test' // Invalid request to test connectivity
    });
    
    console.log(`✅ Network connectivity OK (status: ${response.status})`);
    return true;
  } catch (error) {
    console.log(`❌ Network connectivity failed: ${error.message}`);
    return false;
  }
}

// 3. Token Format Validation
console.log('\n🔍 3. Token Format Validation:');
function validateTokenFormat(tokenName, token) {
  if (!token) {
    console.log(`❌ ${tokenName}: Missing`);
    return false;
  }
  
  const isValid = token.startsWith('1000.') && token.split('.').length === 3;
  if (isValid) {
    console.log(`✅ ${tokenName}: Valid format`);
  } else {
    console.log(`❌ ${tokenName}: Invalid format (expected: 1000.xxx.xxx)`);
  }
  return isValid;
}

const tokenValidation = [
  validateTokenFormat('CRM', process.env.ZOHO_CRM_REFRESH_TOKEN),
  validateTokenFormat('Bookings', process.env.ZOHO_BOOKINGS_REFRESH_TOKEN),
  validateTokenFormat('WorkDrive', process.env.ZOHO_WORKDRIVE_REFRESH_TOKEN),
  validateTokenFormat('Campaigns', process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN)
];

// 4. Manual Token Refresh Test
console.log('\n🔄 4. Manual Token Refresh Test:');
async function testManualTokenRefresh() {
  const refreshToken = process.env.ZOHO_CRM_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  
  console.log('Testing CRM token refresh...');
  
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    });
    
    const response = await fetch(`${OAUTH_BASE}/oauth/v2/token`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "IdEinstein-Diagnostic/1.0"
      },
      body,
    });
    
    const responseText = await response.text();
    console.log(`Response status: ${response.status}`);
    console.log(`Response body: ${responseText}`);
    
    if (response.ok) {
      const json = JSON.parse(responseText);
      if (json.access_token) {
        console.log(`✅ Token refresh successful!`);
        console.log(`   Access token: ${json.access_token.substring(0, 20)}...`);
        console.log(`   Expires in: ${json.expires_in} seconds`);
        return true;
      }
    }
    
    console.log(`❌ Token refresh failed`);
    return false;
    
  } catch (error) {
    console.log(`❌ Token refresh error: ${error.message}`);
    return false;
  }
}

// 5. Crypto API Test
console.log('\n🔐 5. Crypto API Test:');
function testCryptoAPI() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      const uuid = crypto.randomUUID();
      console.log(`✅ crypto.randomUUID() works: ${uuid}`);
      return true;
    } else {
      console.log(`⚠️  crypto.randomUUID() not available, using fallback`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Crypto API error: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runDiagnosis() {
  const connectivityOK = await testConnectivity();
  const tokenRefreshOK = await testManualTokenRefresh();
  const cryptoOK = testCryptoAPI();
  
  console.log('\n📊 Diagnosis Summary:');
  console.log(`Environment Variables: ${envIssues.length === 0 ? '✅' : '❌'}`);
  console.log(`Network Connectivity: ${connectivityOK ? '✅' : '❌'}`);
  console.log(`Token Format: ${tokenValidation.every(v => v) ? '✅' : '❌'}`);
  console.log(`Token Refresh: ${tokenRefreshOK ? '✅' : '❌'}`);
  console.log(`Crypto API: ${cryptoOK ? '✅' : '⚠️'}`);
  
  if (tokenRefreshOK) {
    console.log('\n🎉 Zoho token refresh is working correctly!');
    console.log('   The issue might be in the application code or deployment environment.');
  } else {
    console.log('\n🚨 Zoho token refresh is failing!');
    console.log('   Check the token refresh test output above for details.');
  }
}

runDiagnosis().catch(error => {
  console.error(`\n💥 Diagnosis failed: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});