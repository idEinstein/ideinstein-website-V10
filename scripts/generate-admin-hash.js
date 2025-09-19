// Generate Admin Password Hash for Vercel Production
// Run: node scripts/generate-admin-hash.js

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Admin Password Hash Generator for Vercel Production');
console.log('====================================================');
console.log('');

rl.question('Enter your admin password: ', (password) => {
  if (!password || password.length < 8) {
    console.log('❌ Password must be at least 8 characters long!');
    rl.close();
    return;
  }

  console.log('🔒 Generating secure hash (this may take a moment)...');
  
  try {
    // Generate hash with cost factor 12 (secure for production)
    const hash = bcrypt.hashSync(password, 12);
    
    console.log('');
    console.log('✅ Generated Hash Successfully!');
    console.log('================================');
    console.log('');
    console.log('📋 COPY THIS TO VERCEL:');
    console.log('Variable Name: ADMIN_PASSWORD_HASH');
    console.log('Variable Value: ' + hash);
    console.log('Environment: Production');
    console.log('Type: Secret');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log('2. Add new environment variable:');
    console.log('   - Name: ADMIN_PASSWORD_HASH');
    console.log('   - Value: ' + hash);
    console.log('   - Environment: Production');
    console.log('   - Type: Secret');
    console.log('3. Also add: NODE_ENV=production (if not already set)');
    console.log('4. Redeploy: vercel --prod');
    console.log('');
    console.log('⚠️  IMPORTANT: Enter the hash in the main value field, NOT in notes!');
    
  } catch (error) {
    console.log('❌ Error generating hash:', error.message);
  }
  
  rl.close();
});