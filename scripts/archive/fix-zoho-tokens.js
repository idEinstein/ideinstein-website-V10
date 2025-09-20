#!/usr/bin/env node
/**
 * Zoho Token Refresh Utility
 * 
 * This script helps diagnose and fix Zoho token issues.
 * Run: npm run zoho:refresh
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log(`\n${colors.bold}${colors.cyan}=== ${message} ===${colors.reset}\n`);
}

async function checkZohoStatus() {
  logHeader('Checking Zoho Service Status');
  
  try {
    // Check if server is running
    const response = await fetch('http://localhost:3000/api/zoho/status', {
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_PASSWORD || 'admin123'}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }
    
    const status = await response.json();
    
    // Display status for each service
    const services = ['crm', 'workdrive', 'bookings', 'campaigns', 'books', 'projects'];
    
    services.forEach(service => {
      const serviceStatus = status[service];
      const statusColor = serviceStatus.status === 'connected' ? 'green' : 
                         serviceStatus.status === 'warning' ? 'yellow' : 'red';
      const statusIcon = serviceStatus.status === 'connected' ? '✅' : 
                        serviceStatus.status === 'warning' ? '⚠️' : '❌';
      
      log(`${statusIcon} ${service.toUpperCase()}: ${serviceStatus.message}`, statusColor);
      
      if (serviceStatus.status === 'error') {
        log(`   └─ ${serviceStatus.details?.troubleshooting || 'Check token configuration'}`, 'yellow');
      }
    });
    
    return status;
    
  } catch (error) {
    log(`❌ Failed to check Zoho status: ${error.message}`, 'red');
    log('   Make sure your development server is running (npm run dev)', 'yellow');
    return null;
  }
}

function checkEnvironmentVariables() {
  logHeader('Checking Environment Variables');
  
  const requiredVars = [
    'ZOHO_CLIENT_ID',
    'ZOHO_CLIENT_SECRET',
    'ZOHO_CRM_REFRESH_TOKEN',
    'ZOHO_BOOKINGS_REFRESH_TOKEN',
    'ZOHO_WORKDRIVE_REFRESH_TOKEN',
    'ZOHO_CAMPAIGNS_REFRESH_TOKEN'
  ];
  
  const optionalVars = [
    'ZOHO_BOOKS_REFRESH_TOKEN',
    'ZOHO_PROJECTS_REFRESH_TOKEN'
  ];
  
  let missingRequired = [];
  let missingOptional = [];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      log(`✅ ${varName}: Set`, 'green');
    } else {
      log(`❌ ${varName}: Missing`, 'red');
      missingRequired.push(varName);
    }
  });
  
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      log(`✅ ${varName}: Set`, 'green');
    } else {
      log(`⚠️  ${varName}: Missing (optional)`, 'yellow');
      missingOptional.push(varName);
    }
  });
  
  return { missingRequired, missingOptional };
}

function showTokenRegenerationInstructions() {
  logHeader('Token Regeneration Instructions');
  
  log('To regenerate expired Zoho tokens:', 'cyan');
  log('');
  log('1. Start your development server:', 'white');
  log('   npm run dev', 'green');
  log('');
  log('2. Open the Zoho OAuth generator:', 'white');
  log('   http://localhost:3000/admin/zoho/oauth', 'green');
  log('');
  log('3. For each failed service:', 'white');
  log('   • Select the service (CRM, Bookings, WorkDrive, etc.)', 'yellow');
  log('   • Click "Generate Authorization URL"', 'yellow');
  log('   • Complete the Zoho OAuth flow', 'yellow');
  log('   • Copy the refresh_token from the response', 'yellow');
  log('   • Update your .env.local file with the new token', 'yellow');
  log('');
  log('4. Restart your server after updating tokens:', 'white');
  log('   Ctrl+C then npm run dev', 'green');
  log('');
  log('5. Run this script again to verify:', 'white');
  log('   npm run zoho:refresh', 'green');
}

function showProductionDeploymentInstructions() {
  logHeader('Production Deployment');
  
  log('For production deployment:', 'cyan');
  log('');
  log('1. Update Vercel environment variables:', 'white');
  log('   vercel env add ZOHO_CRM_REFRESH_TOKEN', 'green');
  log('   vercel env add ZOHO_BOOKINGS_REFRESH_TOKEN', 'green');
  log('   vercel env add ZOHO_WORKDRIVE_REFRESH_TOKEN', 'green');
  log('   vercel env add ZOHO_CAMPAIGNS_REFRESH_TOKEN', 'green');
  log('');
  log('2. Or use the Vercel dashboard:', 'white');
  log('   https://vercel.com/your-team/your-project/settings/environment-variables', 'green');
  log('');
  log('3. Redeploy after updating tokens:', 'white');
  log('   vercel --prod', 'green');
}

async function main() {
  console.clear();
  log('🔧 Zoho Token Refresh Utility', 'bold');
  log('This tool helps diagnose and fix Zoho integration issues.\n', 'cyan');
  
  // Check environment variables
  const { missingRequired, missingOptional } = checkEnvironmentVariables();
  
  if (missingRequired.length > 0) {
    log(`\n❌ Missing required environment variables: ${missingRequired.join(', ')}`, 'red');
    log('Please add these to your .env.local file before proceeding.', 'yellow');
    return;
  }
  
  // Check Zoho service status
  const status = await checkZohoStatus();
  
  if (status) {
    const failedServices = Object.entries(status)
      .filter(([key, value]) => key !== 'overall' && value.status === 'error')
      .map(([key]) => key);
    
    if (failedServices.length > 0) {
      log(`\n🚨 Services with token issues: ${failedServices.join(', ')}`, 'red');
      showTokenRegenerationInstructions();
    } else {
      log('\n🎉 All Zoho services are working correctly!', 'green');
      
      const warningServices = Object.entries(status)
        .filter(([key, value]) => key !== 'overall' && value.status === 'warning')
        .map(([key]) => key);
      
      if (warningServices.length > 0) {
        log(`\n⚠️  Services with warnings: ${warningServices.join(', ')}`, 'yellow');
        log('These are optional services that may need configuration.', 'yellow');
      }
    }
  } else {
    log('\n🔧 Unable to check service status. Please ensure:', 'yellow');
    log('• Your development server is running (npm run dev)', 'white');
    log('• Your environment variables are properly set', 'white');
    showTokenRegenerationInstructions();
  }
  
  showProductionDeploymentInstructions();
  
  log('\n📚 Additional Resources:', 'cyan');
  log('• Zoho Token Guide: ./ZOHO_TOKEN_REFRESH_GUIDE.md', 'white');
  log('• Environment Setup: ./COMPLETE_ZOHO_ENV_VARS.md', 'white');
  log('• Deployment Guide: ./COMPLETE_DEPLOYMENT_GUIDE.md', 'white');
}

// Handle both direct execution and module import
if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Script failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main, checkZohoStatus, checkEnvironmentVariables };