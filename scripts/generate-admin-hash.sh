#!/bin/bash
# Environment Variable Verification Script
# Run this to generate the correct hash for your admin password

echo "🔐 Generating Admin Password Hash for Production"
echo "==============================================="

# Prompt for password
read -s -p "Enter your admin password: " PASSWORD
echo

# Generate hash using Node.js and bcryptjs
node -e "
const bcrypt = require('bcryptjs');
const password = '$PASSWORD';
const hash = bcrypt.hashSync(password, 12);
console.log('');
console.log('✅ Generated Hash:');
console.log(hash);
console.log('');
console.log('📋 Copy this hash to Vercel:');
console.log('Variable Name: ADMIN_PASSWORD_HASH');
console.log('Variable Value: ' + hash);
console.log('Environment: Production');
console.log('Type: Secret');
console.log('');
console.log('⚠️  Remember to redeploy after setting this variable!');
"

echo
echo "🚀 Next steps:"
echo "1. Copy the hash above"
echo "2. Go to Vercel Dashboard → Project → Settings → Environment Variables"
echo "3. Add ADMIN_PASSWORD_HASH with the hash value as a Secret"
echo "4. Set NODE_ENV=production"
echo "5. Redeploy: vercel --prod"