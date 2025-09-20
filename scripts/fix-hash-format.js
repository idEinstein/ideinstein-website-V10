// Fix Admin Password Hash Format
// This script generates a proper bcrypt hash for your admin password

const bcrypt = require('bcryptjs');

async function fixHashFormat() {
  console.log('🔧 Fixing Admin Password Hash Format');
  console.log('===================================');
  
  // The password from your ADMIN_AUTH_FIX.md file
  const adminPassword = 'M#RzTr^M$jz#$6Q';
  
  console.log('🔒 Generating proper bcrypt hash...');
  
  try {
    // Generate hash with cost factor 12 (secure for production)
    const hash = await bcrypt.hash(adminPassword, 12);
    
    console.log('');
    console.log('✅ Generated Proper Hash Successfully!');
    console.log('====================================');
    console.log('');
    console.log('📋 COPY THIS TO VERCEL:');
    console.log('Variable Name: ADMIN_PASSWORD_HASH');
    console.log('Variable Value:');
    console.log(hash);
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log('2. Find the existing ADMIN_PASSWORD_HASH variable');
    console.log('3. Click Edit and replace the value with the hash above');
    console.log('4. Save the changes');
    console.log('5. Redeploy: vercel --prod');
    console.log('');
    console.log('⚠️  IMPORTANT: Replace the ENTIRE value, not just part of it!');
    console.log('');
    
    // Test the hash
    console.log('🧪 Testing the generated hash...');
    const isValid = await bcrypt.compare(adminPassword, hash);
    console.log('Hash validation test:', isValid ? '✅ PASSED' : '❌ FAILED');
    
    if (isValid) {
      console.log('');
      console.log('🎉 Hash is working correctly!');
      console.log('After updating Vercel, your admin login should work.');
    }
    
  } catch (error) {
    console.log('❌ Error generating hash:', error.message);
  }
}

fixHashFormat().catch(console.error);