#!/usr/bin/env node

/**
 * Secret and Key Generation Script for IdEinstein Vercel Deployment
 * Generates all required secrets and keys for production deployment
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to generate secure random strings
function generateSecureKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Helper function to generate NextAuth secret
function generateNextAuthSecret() {
  return crypto.randomBytes(32).toString('base64url');
}

// Helper function to generate JWT secret
function generateJwtSecret() {
  return crypto.randomBytes(64).toString('base64');
}

// Helper function to generate HMAC secret
function generateHmacSecret() {
  return crypto.randomBytes(32).toString('hex');
}

// Helper function to generate password hash
function generatePasswordHash(password) {
  const bcrypt = require('bcryptjs');
  const saltRounds = 12;
  return bcrypt.hashSync(password, saltRounds);
}

// Helper function to generate strong password
function generateStrongPassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Helper function to print colored output
function print(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// Helper function to print section headers
function printHeader(title) {
  print('\n' + '='.repeat(60), 'cyan');
  print(`  ${title}`, 'bright');
  print('='.repeat(60), 'cyan');
}

// Helper function to print key-value pairs
function printKeyValue(key, value, isSecret = false) {
  const displayValue = isSecret ? '***SECRET***' : value;
  print(`${key}:`, 'yellow');
  print(`  ${displayValue}`, 'green');
}

// Main key generation functions
function generateNextAuthKeys() {
  printHeader('NextAuth.js Configuration');
  
  const nextAuthSecret = generateNextAuthSecret();
  
  printKeyValue('NEXTAUTH_SECRET', nextAuthSecret, true);
  print('\n💡 This secret is used for JWT encryption and session management.', 'blue');
  
  return {
    NEXTAUTH_SECRET: nextAuthSecret
  };
}

function generateSecurityKeys() {
  printHeader('Security Configuration');
  
  const formHmacSecret = generateHmacSecret();
  const nextPublicHmacSecret = generateHmacSecret();
  const encryptionKey = generateSecureKey(32);
  const adminPassword = generateStrongPassword(16);
  const adminPasswordHash = generatePasswordHash(adminPassword);
  const githubWebhookSecret = generateSecureKey(20);
  
  printKeyValue('FORM_HMAC_SECRET', formHmacSecret, true);
  printKeyValue('NEXT_PUBLIC_HMAC_SECRET', nextPublicHmacSecret, true);
  printKeyValue('ENCRYPTION_KEY', encryptionKey, true);
  printKeyValue('ADMIN_PASSWORD', adminPassword, true);
  printKeyValue('ADMIN_PASSWORD_HASH', adminPasswordHash, true);
  printKeyValue('GITHUB_WEBHOOK_SECRET', githubWebhookSecret, true);
  
  print('\n💡 Security notes:', 'blue');
  print('  • HMAC secrets protect form submissions from tampering', 'blue');
  print('  • Encryption key protects sensitive data at rest', 'blue');
  print('  • Admin password provides access to admin dashboard', 'blue');
  print('  • GitHub webhook secret secures webhook payloads', 'blue');
  
  return {
    FORM_HMAC_SECRET: formHmacSecret,
    NEXT_PUBLIC_HMAC_SECRET: nextPublicHmacSecret,
    ENCRYPTION_KEY: encryptionKey,
    ADMIN_PASSWORD: adminPassword,
    ADMIN_PASSWORD_HASH: adminPasswordHash,
    GITHUB_WEBHOOK_SECRET: githubWebhookSecret
  };
}

function generateDatabaseKeys() {
  printHeader('Database Configuration');
  
  print('Database configuration requires manual setup:', 'yellow');
  print('  1. Create a PostgreSQL database (recommended: Neon, Supabase, or Railway)', 'blue');
  print('  2. Get connection string with SSL enabled', 'blue');
  print('  3. Format: postgresql://user:password@host:5432/database?sslmode=require', 'blue');
  
  return {
    DATABASE_URL: 'postgresql://user:password@host:5432/database?sslmode=require',
    DIRECT_URL: 'postgresql://user:password@host:5432/database?sslmode=require'
  };
}

function generateEmailKeys() {
  printHeader('Email Configuration (SMTP)');
  
  print('Email configuration requires manual setup:', 'yellow');
  print('  📧 For Gmail:', 'blue');
  print('    • Enable 2FA on your Google account', 'blue');
  print('    • Generate an App Password (not your regular password)', 'blue');
  print('    • Use smtp.gmail.com, port 587', 'blue');
  print('  📧 For other providers:', 'blue');
  print('    • Get SMTP credentials from your email provider', 'blue');
  print('    • Common ports: 587 (STARTTLS), 465 (SSL), 25 (unsecured)', 'blue');
  
  return {
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: '587',
    SMTP_USER: 'your-email@gmail.com',
    SMTP_PASS: 'your-app-password',
    FROM_EMAIL: 'noreply@your-domain.com'
  };
}

function generateZohoTemplate() {
  printHeader('Zoho Integration Configuration');
  
  print('Zoho configuration requires manual setup:', 'yellow');
  print('  1. Create Zoho OAuth App in Developer Console', 'blue');
  print('  2. Generate refresh tokens for each service', 'blue');
  print('  3. Use the provided Zoho configuration script', 'blue');
  
  return {
    ZOHO_CLIENT_ID: '1000.XXXXXXXXXXXXXXXXXXXXXXXXXX',
    ZOHO_CLIENT_SECRET: 'your-zoho-client-secret',
    ZOHO_CRM_REFRESH: '1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ZOHO_BOOKINGS_REFRESH: '1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ZOHO_WORKDRIVE_REFRESH: '1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ZOHO_CAMPAIGNS_REFRESH: '1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    ZOHO_REGION: 'com'
  };
}

function generateVercelTemplate() {
  printHeader('Vercel Integration Configuration');
  
  print('Vercel configuration for advanced deployments:', 'yellow');
  print('  1. Get Vercel API token from dashboard', 'blue');
  print('  2. Project ID found in project settings', 'blue');
  print('  3. Team/Org ID found in team settings', 'blue');
  
  return {
    VERCEL_TOKEN: 'your-vercel-api-token',
    VERCEL_PROJECT_ID: 'your-project-id',
    VERCEL_TEAM_ID: 'your-team-id',
    VERCEL_ORG_ID: 'your-org-id'
  };
}

function saveToEnvFile(secrets, filename = '.env.secrets') {
  printHeader('Saving Generated Secrets');
  
  const envContent = Object.entries(secrets)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const fullContent = `# Generated Secrets for IdEinstein Deployment
# Created: ${new Date().toISOString()}
# SECURITY WARNING: Keep this file secure and never commit to version control

${envContent}
`;
  
  const filepath = path.join(process.cwd(), filename);
  fs.writeFileSync(filepath, fullContent);
  
  print(`✅ Secrets saved to: ${filename}`, 'green');
  print('🚨 IMPORTANT: Keep this file secure and never commit to git!', 'red');
  
  return filepath;
}

function createVercelEnvTemplate(allSecrets) {
  printHeader('Creating Vercel Environment Variables Template');
  
  const vercelEnvs = [];
  
  Object.entries(allSecrets).forEach(([key, value]) => {
    const isSecret = [
      'NEXTAUTH_SECRET', 'FORM_HMAC_SECRET', 'ENCRYPTION_KEY', 
      'ADMIN_PASSWORD_HASH', 'GITHUB_WEBHOOK_SECRET', 'DATABASE_URL', 
      'DIRECT_URL', 'SMTP_PASS', 'ZOHO_CLIENT_SECRET'
    ].some(secretKey => key.includes(secretKey));
    
    vercelEnvs.push({
      key,
      value: value === 'your-vercel-api-token' || value.startsWith('your-') || value.startsWith('1000.') ? '[TO_BE_SET]' : value,
      target: ['production', 'preview'],
      type: isSecret ? 'secret' : 'plain'
    });
  });
  
  const templateContent = JSON.stringify(vercelEnvs, null, 2);
  const filepath = path.join(process.cwd(), 'vercel-env-template.json');
  fs.writeFileSync(filepath, templateContent);
  
  print(`✅ Vercel environment template saved to: vercel-env-template.json`, 'green');
  print('💡 Use this file to bulk import environment variables to Vercel', 'blue');
  
  return filepath;
}

function printDeploymentInstructions(secretsFile, templateFile) {
  printHeader('Next Steps for Vercel Deployment');
  
  print('📋 DEPLOYMENT CHECKLIST:', 'bright');
  print('');
  
  print('1️⃣  PREPARE ENVIRONMENT:', 'yellow');
  print('   • Copy secrets from ' + secretsFile + ' to your password manager', 'blue');
  print('   • Set up database (PostgreSQL with SSL)', 'blue');
  print('   • Configure email SMTP settings', 'blue');
  print('   • Set up Zoho OAuth app and refresh tokens', 'blue');
  print('');
  
  print('2️⃣  VERCEL SETUP:', 'yellow');
  print('   • Install Vercel CLI: npm i -g vercel', 'blue');
  print('   • Login to Vercel: vercel login', 'blue');
  print('   • Import project: vercel --prod', 'blue');
  print('');
  
  print('3️⃣  ENVIRONMENT VARIABLES:', 'yellow');
  print('   • Go to Vercel Dashboard > Project > Settings > Environment Variables', 'blue');
  print('   • Add all variables from ' + secretsFile, 'blue');
  print('   • Use "secret" type for sensitive values', 'blue');
  print('   • Set targets: Production and Preview', 'blue');
  print('');
  
  print('4️⃣  DOMAIN SETUP:', 'yellow');
  print('   • Add your custom domain in Vercel dashboard', 'blue');
  print('   • Update NEXTAUTH_URL to your production domain', 'blue');
  print('   • Configure DNS records as shown in Vercel', 'blue');
  print('');
  
  print('5️⃣  FINAL TESTING:', 'yellow');
  print('   • Run: npm run validate-env:prod', 'blue');
  print('   • Run: npm run security:audit', 'blue');
  print('   • Run: npm run pre-deploy:secure', 'blue');
  print('   • Deploy: vercel --prod', 'blue');
  print('');
  
  print('🔗 HELPFUL LINKS:', 'magenta');
  print('   • Vercel Environment Variables: https://vercel.com/docs/environment-variables', 'blue');
  print('   • NextAuth.js Setup: https://next-auth.js.org/getting-started/example', 'blue');
  print('   • Zoho Developer Console: https://api-console.zoho.com/', 'blue');
  print('');
  
  print('⚠️  SECURITY REMINDERS:', 'red');
  print('   • Never commit .env files to git', 'red');
  print('   • Use different secrets for different environments', 'red');
  print('   • Regularly rotate secrets (every 90 days)', 'red');
  print('   • Monitor admin access logs', 'red');
}

// Main execution function
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  
  print('🚀 IdEinstein Secret Generation Script', 'bright');
  print('Generating secure keys and secrets for Vercel deployment...', 'cyan');
  
  let allSecrets = {};
  
  switch (command) {
    case 'nextauth':
      allSecrets = generateNextAuthKeys();
      break;
      
    case 'security':
      allSecrets = generateSecurityKeys();
      break;
      
    case 'encryption':
      allSecrets = { ENCRYPTION_KEY: generateSecureKey(32) };
      printKeyValue('ENCRYPTION_KEY', allSecrets.ENCRYPTION_KEY, true);
      break;
      
    case 'password':
      const password = generateStrongPassword(16);
      const hash = generatePasswordHash(password);
      allSecrets = { 
        ADMIN_PASSWORD: password,
        ADMIN_PASSWORD_HASH: hash
      };
      printKeyValue('ADMIN_PASSWORD', password, true);
      printKeyValue('ADMIN_PASSWORD_HASH', hash, true);
      break;
      
    case 'hmac':
      const hmacSecret = generateHmacSecret();
      const publicHmacSecret = generateHmacSecret();
      allSecrets = {
        FORM_HMAC_SECRET: hmacSecret,
        NEXT_PUBLIC_HMAC_SECRET: publicHmacSecret
      };
      printKeyValue('FORM_HMAC_SECRET', hmacSecret, true);
      printKeyValue('NEXT_PUBLIC_HMAC_SECRET', publicHmacSecret, true);
      break;
      
    case 'all':
    default:
      // Generate all secrets
      const nextAuthKeys = generateNextAuthKeys();
      const securityKeys = generateSecurityKeys();
      const databaseTemplate = generateDatabaseKeys();
      const emailTemplate = generateEmailKeys();
      const zohoTemplate = generateZohoTemplate();
      const vercelTemplate = generateVercelTemplate();
      
      allSecrets = {
        ...nextAuthKeys,
        ...securityKeys,
        ...databaseTemplate,
        ...emailTemplate,
        ...zohoTemplate,
        ...vercelTemplate,
        // Additional configurations
        NODE_ENV: 'production',
        RATE_PER_MIN: '60'
      };
      
      const secretsFile = saveToEnvFile(allSecrets);
      const templateFile = createVercelEnvTemplate(allSecrets);
      
      printDeploymentInstructions(secretsFile, templateFile);
      break;
  }
  
  if (command !== 'all') {
    print('\n✅ Key generation completed!', 'green');
    print('💡 Run "npm run generate:all-keys" to generate all secrets at once.', 'blue');
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  print('\n❌ Error generating keys:', 'red');
  print(error.message, 'red');
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  generateSecureKey,
  generateNextAuthSecret,
  generateHmacSecret,
  generateStrongPassword,
  generatePasswordHash
};