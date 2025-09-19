// Simple Admin Setup - Use a basic password for now
const bcrypt = require('bcryptjs');

async function setupSimpleAdmin() {
  console.log('🔧 Setting up Simple Admin Authentication');
  console.log('========================================');
  
  const simplePassword = 'admin123';
  console.log(`Password to use: ${simplePassword}`);
  
  const hash = await bcrypt.hash(simplePassword, 12);
  console.log('\n📋 Hash to set in Vercel:');
  console.log(hash);
  
  console.log('\n🚀 Steps:');
  console.log('1. Go to Vercel Dashboard');
  console.log('2. Set ADMIN_PASSWORD_HASH to the hash above');
  console.log('3. Redeploy');
  console.log(`4. Login with password: ${simplePassword}`);
  
  // Test the hash
  const test = await bcrypt.compare(simplePassword, hash);
  console.log(`\n✅ Hash test: ${test ? 'PASSED' : 'FAILED'}`);
}

setupSimpleAdmin().catch(console.error);