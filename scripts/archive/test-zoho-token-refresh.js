#!/usr/bin/env node
/**
 * Test Zoho Token Refresh Logic
 * Isolates the token refresh mechanism to debug the issue
 */

// Load environment variables
require('dotenv').config({ path: '.env.production' });

const DC_ENV = process.env.ZOHO_DC || "in";
const OAUTH_BASE = {
  in: "https://accounts.zoho.in",
  eu: "https://accounts.zoho.eu", 
  com: "https://accounts.zoho.com",
  "com.au": "https://accounts.zoho.com.au",
  jp: "https://accounts.zoho.jp",
}[DC_ENV];

console.log('🔍 Testing Zoho Token Refresh Logic\n');

// Check environment variables
console.log('📋 Environment Check:');
console.log(`ZOHO_DC: ${DC_ENV}`);
console.log(`OAUTH_BASE: ${OAUTH_BASE}`);
console.log(`ZOHO_CLIENT_ID: ${process.env.ZOHO_CLIENT_ID ? 'SET' : 'MISSING'}`);
console.log(`ZOHO_CLIENT_SECRET: ${process.env.ZOHO_CLIENT_SECRET ? 'SET' : 'MISSING'}`);
console.log(`ZOHO_CRM_REFRESH_TOKEN: ${process.env.ZOHO_CRM_REFRESH_TOKEN ? 'SET' : 'MISSING'}`);

async function testTokenRefresh(service = 'crm') {
  console.log(`\n🔄 Testing ${service.toUpperCase()} token refresh...`);
  
  const refreshToken = process.env[`ZOHO_${service.toUpperCase()}_REFRESH_TOKEN`];
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  
  if (!refreshToken) {
    console.log(`❌ Missing refresh token for ${service}`);
    return false;
  }
  
  if (!clientId || !clientSecret) {
    console.log(`❌ Missing client credentials`);
    return false;
  }
  
  console.log(`📤 Making token refresh request to: ${OAUTH_BASE}/oauth/v2/token`);
  console.log(`📋 Refresh token (first 20 chars): ${refreshToken.substring(0, 20)}...`);
  
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    });
    
    console.log('📤 Request body:', {
      grant_type: "refresh_token",
      refresh_token: refreshToken.substring(0, 20) + '...',
      client_id: clientId,
      client_secret: clientSecret.substring(0, 10) + '...'
    });
    
    const response = await fetch(`${OAUTH_BASE}/oauth/v2/token`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "IdEinstein-TokenTest/1.0"
      },
      body,
    });
    
    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log(`📥 Response body: ${responseText}`);
    
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (e) {
      console.log(`❌ Failed to parse JSON response: ${e.message}`);
      return false;
    }
    
    if (!response.ok) {
      console.log(`❌ Token refresh failed:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${json?.error || 'Unknown'}`);
      console.log(`   Description: ${json?.error_description || 'No description'}`);
      
      if (response.status === 400 && json?.error === 'invalid_grant') {
        console.log(`   🔧 This usually means the refresh token has expired`);
        console.log(`   🔧 Generate new tokens at: /admin/zoho/oauth`);
      }
      
      return false;
    }
    
    if (!json?.access_token) {
      console.log(`❌ No access token in response`);
      return false;
    }
    
    console.log(`✅ Token refresh successful!`);
    console.log(`   Access token (first 20 chars): ${json.access_token.substring(0, 20)}...`);
    console.log(`   Expires in: ${json.expires_in} seconds`);
    console.log(`   Token type: ${json.token_type || 'Bearer'}`);
    
    return true;
    
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
    console.log(`   This could be a connectivity issue or DNS problem`);
    return false;
  }
}

async function main() {
  const services = ['crm', 'bookings', 'workdrive', 'campaigns'];
  
  for (const service of services) {
    const success = await testTokenRefresh(service);
    if (!success) {
      console.log(`\n🚨 ${service.toUpperCase()} token refresh failed - stopping tests`);
      break;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 Token refresh test completed');
}

if (require.main === module) {
  main().catch(error => {
    console.error(`\n💥 Test failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { testTokenRefresh };