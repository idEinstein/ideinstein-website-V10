#!/usr/bin/env tsx

/**
 * Live Authentication Test
 * Tests the actual API endpoints on localhost:3001
 */

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testLiveAuth() {
  console.log('🚀 Testing Live Authentication on localhost:3001\n');

  const baseUrl = 'http://localhost:3001';

  // Test 1: Login endpoint
  console.log('1. Testing login endpoint...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'admin123'
      })
    });

    console.log(`   Status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const cookies = loginResponse.headers.get('set-cookie');
      console.log(`   ✅ Login successful`);
      console.log(`   🍪 Cookie set: ${cookies ? 'Yes' : 'No'}`);
      
      // Extract auth token from cookies for next test
      const authToken = cookies?.match(/admin_token=([^;]+)/)?.[1];
      
      if (authToken) {
        // Test 2: Verify endpoint with cookie
        console.log('\n2. Testing verify endpoint with cookie...');
        const verifyResponse = await fetch(`${baseUrl}/api/admin/auth/verify`, {
          headers: {
            'Cookie': `admin_token=${authToken}`
          }
        });
        
        console.log(`   Status: ${verifyResponse.status}`);
        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log(`   ✅ Verification successful`);
          console.log(`   Role: ${verifyData.role}`);
        } else {
          console.log(`   ❌ Verification failed`);
        }

        // Test 3: Access protected admin route
        console.log('\n3. Testing protected admin route...');
        const adminResponse = await fetch(`${baseUrl}/admin`, {
          headers: {
            'Cookie': `admin_token=${authToken}`
          },
          redirect: 'manual'
        });
        
        console.log(`   Status: ${adminResponse.status}`);
        if (adminResponse.status === 200) {
          console.log(`   ✅ Admin access granted`);
        } else if (adminResponse.status === 302) {
          console.log(`   ⚠️  Redirected (check middleware)`);
        } else {
          console.log(`   ❌ Admin access denied`);
        }

        // Test 4: Logout
        console.log('\n4. Testing logout endpoint...');
        const logoutResponse = await fetch(`${baseUrl}/api/admin/auth/logout`, {
          method: 'POST',
          headers: {
            'Cookie': `admin_token=${authToken}`
          }
        });
        
        console.log(`   Status: ${logoutResponse.status}`);
        if (logoutResponse.ok) {
          console.log(`   ✅ Logout successful`);
        } else {
          console.log(`   ❌ Logout failed`);
        }
      }
    } else {
      const errorData = await loginResponse.text();
      console.log(`   ❌ Login failed: ${errorData}`);
    }
  } catch (error) {
    console.log(`   ❌ Connection error: ${error}`);
    console.log('   💡 Make sure your dev server is running on port 3001');
  }

  console.log('\n📋 Manual Testing Steps:');
  console.log('   1. Open http://localhost:3001/admin/login');
  console.log('   2. Enter password: admin123');
  console.log('   3. Check if you can access http://localhost:3001/admin');
  console.log('   4. Open browser dev tools and check:');
  console.log('      - Network tab for successful API calls');
  console.log('      - Application tab for HTTP-only cookies');
  console.log('      - Console for any CSP violations');
}

// Run the test
testLiveAuth().catch(console.error);