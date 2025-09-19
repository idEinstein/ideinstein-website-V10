// Test Authentication Script
// This will help us figure out what password works

const bcrypt = require('bcryptjs');

async function testAuthentication() {
  console.log('🔍 Testing Authentication Setup');
  console.log('==============================');
  
  // Test passwords to try
  const testPasswords = [
    'M#RzTr^M$jz#$6Q',
    'admin123',
    'M#RzTr^M$jz#$6Q<', // In case the < was part of the password
    'M#RzTr^M$jz#$6Q<file', // In case more was cut off
  ];
  
  // The hash we generated
  const correctHash = '$2b$12$K0GJi879DKSlMsayubTB/ev1f623UtKDU7x0T/MIOkTkj8J/vf6dW';
  
  console.log('Testing passwords against our generated hash...\n');
  
  for (const password of testPasswords) {
    try {
      const isValid = await bcrypt.compare(password, correctHash);
      console.log(`Password: "${password}" -> ${isValid ? '✅ VALID' : '❌ Invalid'}`);
    } catch (error) {
      console.log(`Password: "${password}" -> ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🔧 If none work, let\'s generate a hash for a simple password...');
  
  // Generate hash for a simple password
  const simplePassword = 'admin123';
  const simpleHash = await bcrypt.hash(simplePassword, 12);
  console.log(`\nSimple password "${simplePassword}" hash:`);
  console.log(simpleHash);
  
  // Test it
  const testSimple = await bcrypt.compare(simplePassword, simpleHash);
  console.log(`Test simple password: ${testSimple ? '✅ VALID' : '❌ Invalid'}`);
}

testAuthentication().catch(console.error);