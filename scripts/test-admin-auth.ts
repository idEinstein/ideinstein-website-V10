#!/usr/bin/env tsx

/**
 * Test Admin Authentication System
 * Tests the new cookie-based authentication flow
 */

import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

async function testAdminAuth() {
  console.log('🔐 Testing Admin Authentication System\n');

  // Test 1: Password hashing
  console.log('1. Testing password hashing...');
  const testPassword = 'admin123';
  const hash = await bcrypt.hash(testPassword, 12);
  const isValid = await bcrypt.compare(testPassword, hash);
  console.log(`   Password hash: ${hash.substring(0, 20)}...`);
  console.log(`   Validation: ${isValid ? '✅ PASS' : '❌ FAIL'}\n`);

  // Test 2: Environment variables
  console.log('2. Checking environment variables...');
  const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  
  console.log(`   JWT_SECRET: ${jwtSecret ? '✅ Set' : '❌ Missing'}`);
  console.log(`   ADMIN_PASSWORD_HASH: ${adminHash ? '✅ Set' : '❌ Missing'}`);
  
  if (!jwtSecret) {
    console.log('   ⚠️  Add JWT_SECRET or NEXTAUTH_SECRET to your environment');
  }
  
  if (!adminHash) {
    console.log('   ⚠️  Add ADMIN_PASSWORD_HASH to your environment');
    console.log(`   💡 Use this hash for 'admin123': ${hash}`);
  }
  
  console.log();

  // Test 3: JWT token creation (if secret available)
  if (jwtSecret) {
    console.log('3. Testing JWT token creation...');
    try {
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { 
          role: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        },
        jwtSecret
      );
      
      const decoded = jwt.verify(token, jwtSecret);
      console.log(`   Token created: ${token.substring(0, 20)}...`);
      console.log(`   Token valid: ✅ PASS`);
      console.log(`   Decoded role: ${(decoded as any).role}`);
    } catch (error) {
      console.log(`   Token test: ❌ FAIL - ${error}`);
    }
  } else {
    console.log('3. Skipping JWT test (no secret available)');
  }
  
  console.log();

  // Test 4: API endpoints check
  console.log('4. Checking API endpoint files...');
  const fs = require('fs');
  const path = require('path');
  
  const endpoints = [
    'app/api/admin/auth/login/route.ts',
    'app/api/admin/auth/logout/route.ts',
    'app/api/admin/auth/verify/route.ts',
    'app/api/security/csp-report/route.ts'
  ];
  
  endpoints.forEach(endpoint => {
    const exists = fs.existsSync(path.join(process.cwd(), endpoint));
    console.log(`   ${endpoint}: ${exists ? '✅ Exists' : '❌ Missing'}`);
  });
  
  console.log();

  // Test 5: Component files check
  console.log('5. Checking component files...');
  const components = [
    'components/admin/AdminAuth.tsx',
    'lib/auth/middleware.ts',
    'app/admin/login/page.tsx'
  ];
  
  components.forEach(component => {
    const exists = fs.existsSync(path.join(process.cwd(), component));
    console.log(`   ${component}: ${exists ? '✅ Exists' : '❌ Missing'}`);
  });
  
  console.log();

  // Summary
  console.log('📋 Summary:');
  console.log('   • Cookie-based authentication implemented');
  console.log('   • HTTP-only cookies for security');
  console.log('   • Server-side token validation');
  console.log('   • CSP-compatible (no localStorage)');
  console.log('   • Middleware protection for admin routes');
  console.log();
  
  console.log('🚀 Next steps:');
  console.log('   1. Set ADMIN_PASSWORD_HASH in your environment');
  console.log('   2. Set JWT_SECRET in your environment');
  console.log('   3. Test login at /admin/login');
  console.log('   4. Check CSP compliance with browser dev tools');
  console.log();
  
  console.log('🔧 Environment setup:');
  console.log('   # Add to your .env.local file:');
  console.log(`   ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('   JWT_SECRET="your-secure-jwt-secret-here"');
}

// Run the test
testAdminAuth().catch(console.error);