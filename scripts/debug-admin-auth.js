/**
 * Quick Admin Authentication Debug Script
 * Run this to test authentication and reset rate limits
 */

console.log('🔍 Admin Authentication Debug');
console.log('============================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('ADMIN_PASSWORD exists:', !!process.env.ADMIN_PASSWORD);
console.log('ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test password comparison
const bcrypt = require('bcryptjs');

async function testAuthentication() {
  const testPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashFromEnv = process.env.ADMIN_PASSWORD_HASH;
  
  console.log('\n🔐 Password Testing:');
  console.log('Test password (first 3 chars):', testPassword.substring(0, 3) + '***');
  
  if (hashFromEnv) {
    console.log('Using HASHED password authentication');
    console.log('Hash (first 10 chars):', hashFromEnv.substring(0, 10) + '...');
    
    try {
      const isValid = await bcrypt.compare(testPassword, hashFromEnv);
      console.log('✅ Hash comparison result:', isValid);
    } catch (error) {
      console.log('❌ Hash comparison error:', error.message);
    }
  } else {
    console.log('Using PLAIN TEXT password authentication');
    console.log('⚠️  This is less secure!');
  }
}

testAuthentication().catch(console.error);