#!/usr/bin/env node
/**
 * Quick Zoho Status Check
 * Tests basic connectivity to Zoho services
 */

// Import using dynamic import since this is an ES module
async function loadZohoClient() {
  try {
    const module = await import('../lib/zoho/client.js');
    return module;
  } catch (error) {
    console.log('❌ Failed to load Zoho client:', error.message);
    console.log('   Make sure you are running this from the project root directory');
    process.exit(1);
  }
}

async function testService(serviceName, zohoClient) {
  try {
    console.log(`🔍 Testing ${serviceName}...`);
    const token = await zohoClient.zohoAccessToken(serviceName);
    console.log(`✅ ${serviceName}: Token obtained successfully`);
    return true;
  } catch (error) {
    console.log(`❌ ${serviceName}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Quick Zoho Connectivity Test\n');
  
  const zohoClient = await loadZohoClient();
  const services = ['crm', 'bookings', 'workdrive', 'campaigns'];
  const results = [];
  
  for (const service of services) {
    const success = await testService(service, zohoClient);
    results.push({ service, success });
  }
  
  const successCount = results.filter(r => r.success).length;
  const failedServices = results.filter(r => !r.success).map(r => r.service);
  
  console.log(`\n📊 Results: ${successCount}/${services.length} services working`);
  
  if (failedServices.length > 0) {
    console.log(`\n🚨 Failed services: ${failedServices.join(', ')}`);
    console.log('\n🔧 To fix token issues:');
    console.log('   npm run zoho:refresh');
  } else {
    console.log('\n🎉 All core Zoho services are working!');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testService, main };