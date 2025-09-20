#!/usr/bin/env node
/**
 * Test Production Environment Variables
 * Checks if Vercel environment variables are properly set
 */

console.log('🔍 Testing Production Environment Variables\n');

// Test via a simple API call that doesn't require auth
async function testProductionEnv() {
  try {
    console.log('📡 Testing production environment via public API...');
    
    // Test a simple endpoint first
    const healthResponse = await fetch('https://ideinstein.com/api/health');
    console.log(`Health check: ${healthResponse.status} ${healthResponse.statusText}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health data:', healthData);
    }
    
    // Test booking availability (this should work with our fixes)
    console.log('\n📅 Testing booking availability...');
    const bookingResponse = await fetch('https://ideinstein.com/api/bookings/availability?date=2025-09-23');
    console.log(`Booking availability: ${bookingResponse.status} ${bookingResponse.statusText}`);
    
    if (bookingResponse.ok) {
      const bookingData = await bookingResponse.json();
      console.log('Booking data:', JSON.stringify(bookingData, null, 2));
      
      if (bookingData.source === 'fallback') {
        console.log('\n⚠️  ISSUE DETECTED: Using fallback slots');
        console.log('   This means Zoho integration is failing in production');
        console.log('   But users can still book (which is good!)');
      } else if (bookingData.source === 'zoho') {
        console.log('\n✅ SUCCESS: Getting actual Zoho slots');
      }
    }
    
    // Test the debug endpoint (this will likely fail due to auth, but we can see the error)
    console.log('\n🔧 Testing debug endpoint (expect auth error)...');
    try {
      const debugResponse = await fetch('https://ideinstein.com/api/debug/zoho-tokens?service=crm');
      console.log(`Debug endpoint: ${debugResponse.status} ${debugResponse.statusText}`);
      
      if (!debugResponse.ok) {
        const errorText = await debugResponse.text();
        console.log('Debug error:', errorText);
      }
    } catch (debugError) {
      console.log('Debug endpoint error:', debugError.message);
    }
    
  } catch (error) {
    console.error('❌ Production test failed:', error.message);
  }
}

async function main() {
  await testProductionEnv();
  
  console.log('\n📋 Analysis:');
  console.log('1. If booking availability returns "fallback" source:');
  console.log('   → Zoho integration is failing in production');
  console.log('   → But users can still book consultations (good!)');
  console.log('   → Need to check production environment variables');
  console.log('');
  console.log('2. If booking availability returns "zoho" source:');
  console.log('   → Zoho integration is working correctly');
  console.log('   → The issue might be elsewhere');
  console.log('');
  console.log('3. Next steps:');
  console.log('   → Check Vercel environment variables');
  console.log('   → Verify all Zoho tokens are set correctly');
  console.log('   → Check Vercel function logs for specific errors');
}

main().catch(console.error);