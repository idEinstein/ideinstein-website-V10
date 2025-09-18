#!/usr/bin/env node

/**
 * Admin Password Hash Generator
 * Generates a secure bcrypt hash for admin authentication
 * 
 * Usage:
 * node scripts/generate-admin-hash.js [password]
 * 
 * If no password is provided, you'll be prompted to enter one securely
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function generateSecurePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

async function main() {
  const args = process.argv.slice(2);
  let password = args[0];
  
  if (!password) {
    console.log('🔐 No password provided. Generating a secure random password...\n');
    password = generateSecurePassword(20);
    console.log('Generated secure password:', password);
    console.log('\n⚠️  IMPORTANT: Save this password securely! It will not be shown again.\n');
  }
  
  console.log('🔄 Generating bcrypt hash (this may take a moment)...');
  
  // Generate hash with cost factor 12 (secure but not too slow)
  const hash = bcrypt.hashSync(password, 12);
  
  console.log('\n✅ Password hash generated successfully!\n');
  console.log('Add this to your environment variables:\n');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('\nFor Vercel deployment:');
  console.log(`vercel env add ADMIN_PASSWORD_HASH`);
  console.log('Then paste the hash when prompted.\n');
  
  console.log('🔒 Security Notes:');
  console.log('- Store the hash in ADMIN_PASSWORD_HASH environment variable');
  console.log('- Remove or leave empty the ADMIN_PASSWORD environment variable');
  console.log('- The hash is safe to store in environment variables');
  console.log('- Never store plain passwords in environment variables');
  
  if (!args[0]) {
    console.log('\n⚠️  Remember to save your password:', password);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateSecurePassword };