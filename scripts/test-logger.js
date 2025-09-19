#!/usr/bin/env node
/**
 * Test Logger Functionality
 * Verifies that the logger import and functionality works correctly
 */

console.log('🔍 Testing Logger Functionality\n');

async function testLoggerImport() {
  try {
    // Test dynamic import of the logger
    const loggerModule = await import('../library/logger.js');
    const { logger } = loggerModule;
    
    console.log('✅ Logger import successful');
    
    // Test logger methods
    logger.info('Test info message', { test: true });
    logger.warn('Test warning message', { test: true });
    logger.error('Test error message', { test: true });
    
    // Test Zoho-specific logger
    logger.zoho.start('Test Zoho start', { service: 'test' });
    logger.zoho.success('Test Zoho success', { service: 'test' });
    logger.zoho.warn('Test Zoho warning', { service: 'test' });
    logger.zoho.error('Test Zoho error', { service: 'test' });
    
    console.log('✅ All logger methods work correctly');
    return true;
    
  } catch (error) {
    console.log('❌ Logger import/usage failed:', error.message);
    console.log('   Stack:', error.stack);
    return false;
  }
}

async function testZohoClientImport() {
  try {
    // Test dynamic import of the Zoho client
    const zohoModule = await import('../lib/zoho/client.js');
    const { zohoAccessToken, crm, bookings, workdrive, campaigns } = zohoModule;
    
    console.log('✅ Zoho client import successful');
    console.log('   Available exports:', Object.keys(zohoModule));
    
    return true;
    
  } catch (error) {
    console.log('❌ Zoho client import failed:', error.message);
    console.log('   Stack:', error.stack);
    return false;
  }
}

async function main() {
  const loggerOK = await testLoggerImport();
  const zohoClientOK = await testZohoClientImport();
  
  console.log('\n📊 Import Test Results:');
  console.log(`Logger: ${loggerOK ? '✅' : '❌'}`);
  console.log(`Zoho Client: ${zohoClientOK ? '✅' : '❌'}`);
  
  if (loggerOK && zohoClientOK) {
    console.log('\n🎉 All imports work correctly!');
    console.log('   The issue is likely in the token refresh logic or environment variables.');
  } else {
    console.log('\n🚨 Import issues detected!');
    console.log('   This could be the root cause of the Zoho token refresh failures.');
  }
}

main().catch(error => {
  console.error(`\n💥 Test failed: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});