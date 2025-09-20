#!/usr/bin/env node
/**
 * Simple Fetch Test
 * Tests if basic fetch functionality works in the current environment
 */

// Load environment variables
require('dotenv').config({ path: '.env.production' });

console.log('🔍 Testing Basic Fetch Functionality\n');

async function testBasicFetch() {
  console.log('1. Testing basic HTTPS fetch...');
  
  try {
    const response = await fetch('https://httpbin.org/json');
    const data = await response.json();
    console.log('✅ Basic fetch works');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
  } catch (error) {
    console.log('❌ Basic fetch failed:', error.message);
    return false;
  }
  
  return true;
}

async function testZohoEndpoint() {
  console.log('\n2. Testing Zoho endpoint connectivity...');
  
  const DC_ENV = process.env.ZOHO_DC || "in";
  const OAUTH_BASE = `https://accounts.zoho.${DC_ENV}`;
  
  try {
    const response = await fetch(`${OAUTH_BASE}/oauth/v2/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'IdEinstein-Test/1.0'
      },
      body: 'grant_type=invalid_test' // Invalid request to test connectivity
    });
    
    console.log('✅ Zoho endpoint reachable');
    console.log(`   Status: ${response.status}`);
    console.log(`   URL: ${OAUTH_BASE}/oauth/v2/token`);
    
    const text = await response.text();
    console.log(`   Response: ${text.substring(0, 200)}...`);
    
  } catch (error) {
    console.log('❌ Zoho endpoint unreachable:', error.message);
    return false;
  }
  
  return true;
}

async function testFormDataCreation() {
  console.log('\n3. Testing FormData and URLSearchParams...');
  
  try {
    // Test URLSearchParams (used in token refresh)
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: "test_token",
      client_id: "test_id",
      client_secret: "test_secret"
    });
    
    console.log('✅ URLSearchParams works');
    console.log(`   Body: ${params.toString()}`);
    
    // Test FormData (used in file uploads)
    const formData = new FormData();
    formData.append('test', 'value');
    
    console.log('✅ FormData works');
    
  } catch (error) {
    console.log('❌ FormData/URLSearchParams failed:', error.message);
    return false;
  }
  
  return true;
}

async function testCryptoAPI() {
  console.log('\n4. Testing Crypto API...');
  
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      const uuid = crypto.randomUUID();
      console.log('✅ crypto.randomUUID() works:', uuid);
    } else {
      console.log('⚠️  crypto.randomUUID() not available');
      
      // Test fallback UUID generation
      const fallbackUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      
      console.log('✅ Fallback UUID works:', fallbackUUID);
    }
    
  } catch (error) {
    console.log('❌ Crypto API failed:', error.message);
    return false;
  }
  
  return true;
}

async function main() {
  console.log(`Node.js version: ${process.version}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
  
  const tests = [
    testBasicFetch,
    testZohoEndpoint,
    testFormDataCreation,
    testCryptoAPI
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    const passed = await test();
    if (!passed) {
      allPassed = false;
    }
  }
  
  console.log(`\n📊 Overall result: ${allPassed ? '✅ All tests passed' : '❌ Some tests failed'}`);
  
  if (allPassed) {
    console.log('\n🔍 Basic functionality works. The issue might be:');
    console.log('   • Environment variable loading in production');
    console.log('   • Specific Zoho API authentication');
    console.log('   • Application-specific code issues');
  }
}

main().catch(error => {
  console.error(`\n💥 Test failed: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});