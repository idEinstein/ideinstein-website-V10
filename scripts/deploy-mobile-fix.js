#!/usr/bin/env node

/**
 * Mobile Fix Deployment Script
 * Deploys mobile debugging and fallback improvements to Vercel
 */

const { execSync } = require('child_process');

console.log('🚀 Deploying Mobile Fix to Vercel...');

try {
  // Build the project first
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to Vercel
  console.log('🌐 Deploying to Vercel...');
  execSync('vercel --prod', { stdio: 'inherit' });
  
  console.log('✅ Mobile fix deployed successfully!');
  console.log('');
  console.log('🔍 Test these URLs on mobile:');
  console.log('• Main site: https://your-domain.vercel.app');
  console.log('• Mobile debug: https://your-domain.vercel.app/api/mobile-debug');
  console.log('• Component debug: https://your-domain.vercel.app/debug');
  console.log('• Simplified mobile: https://your-domain.vercel.app?mobile=simple');
  console.log('');
  console.log('📱 If you still see "something went wrong":');
  console.log('1. Check browser console for errors');
  console.log('2. Try the simplified mobile version');
  console.log('3. Check Vercel function logs for error details');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}