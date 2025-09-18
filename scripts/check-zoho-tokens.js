// scripts/check-zoho-tokens.js
/**
 * Zoho Token Health Check Script
 * Run this monthly to check if tokens need renewal
 * Usage: node scripts/check-zoho-tokens.js
 */

const services = [
  'crm',
  'workdrive', 
  'bookings',
  'campaigns',
  'books',
  'projects'
];

async function checkTokenHealth(service) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/zoho/status`);
    const data = await response.json();
    
    const serviceStatus = data[service];
    const isHealthy = serviceStatus?.status === 'connected';
    
    console.log(`📊 ${service.toUpperCase()}: ${isHealthy ? '✅ HEALTHY' : '❌ NEEDS REFRESH'}`);
    
    if (!isHealthy) {
      console.log(`   Error: ${serviceStatus?.message || 'Unknown error'}`);
      console.log(`   Action: Regenerate ${service.toUpperCase()}_REFRESH_TOKEN`);
    }
    
    return isHealthy;
  } catch (error) {
    console.log(`📊 ${service.toUpperCase()}: ❌ CONNECTION ERROR`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Checking Zoho Token Health...\n');
  
  const results = [];
  for (const service of services) {
    const isHealthy = await checkTokenHealth(service);
    results.push({ service, isHealthy });
  }
  
  const healthyCount = results.filter(r => r.isHealthy).length;
  const unhealthyServices = results.filter(r => !r.isHealthy);
  
  console.log(`\n📈 SUMMARY: ${healthyCount}/${services.length} services healthy`);
  
  if (unhealthyServices.length > 0) {
    console.log('\n🚨 ACTIONS NEEDED:');
    unhealthyServices.forEach(({ service }) => {
      console.log(`   • Regenerate ZOHO_${service.toUpperCase()}_REFRESH_TOKEN`);
    });
    console.log('\n🔗 Token Generator: /admin/zoho/oauth');
  } else {
    console.log('\n✅ All tokens are healthy!');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkTokenHealth };