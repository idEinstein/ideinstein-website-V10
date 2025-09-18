// scripts/validate-environment.ts
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface EnvValidation {
  name: string;
  required: boolean;
  description: string;
}

const envVariables: EnvValidation[] = [
  // Core Zoho Configuration
  { name: 'ZOHO_DC', required: true, description: 'Zoho data center (in, eu, com, com.au, jp)' },
  { name: 'ZOHO_CLIENT_ID', required: true, description: 'Zoho OAuth Client ID' },
  { name: 'ZOHO_CLIENT_SECRET', required: true, description: 'Zoho OAuth Client Secret' },
  
  // Service-specific refresh tokens
  { name: 'ZOHO_CRM_REFRESH_TOKEN', required: true, description: 'Zoho CRM Refresh Token' },
  { name: 'ZOHO_BOOKINGS_REFRESH_TOKEN', required: true, description: 'Zoho Bookings Refresh Token' },
  { name: 'ZOHO_WORKDRIVE_REFRESH_TOKEN', required: true, description: 'Zoho WorkDrive Refresh Token' },
  { name: 'ZOHO_CAMPAIGNS_REFRESH_TOKEN', required: false, description: 'Zoho Campaigns Refresh Token (for newsletter)' },
  
  // Bookings Configuration
  { name: 'BOOKINGS_SERVICE_ID', required: true, description: 'Zoho Bookings Service ID for consultations' },
  { name: 'BOOKINGS_STAFF_ID', required: true, description: 'Zoho Bookings Staff/Resource ID' },
  { name: 'BOOKINGS_WORKSPACE_ID', required: true, description: 'Zoho Bookings Workspace ID' },
  { name: 'BOOKINGS_TIME_ZONE', required: false, description: 'Timezone for bookings (default: Europe/Berlin)' },
  
  // WorkDrive Configuration
  { name: 'WORKDRIVE_PARENT_FOLDER_ID', required: true, description: 'WorkDrive parent folder ID for consultation folders' },
  
  // Campaigns Configuration
  { name: 'ZOHO_CAMPAIGNS_LIST_KEY', required: false, description: 'Campaigns mailing list key for newsletter subscriptions' },
];

function validateEnvironment() {
  console.log('🔍 Validating Environment Configuration\n');
  
  const missing: string[] = [];
  const present: string[] = [];
  const optional: string[] = [];
  
  envVariables.forEach(({ name, required, description }) => {
    const value = process.env[name];
    
    if (value) {
      present.push(name);
      console.log(`✅ ${name}: ${description}`);
    } else if (required) {
      missing.push(name);
      console.log(`❌ ${name}: ${description} [MISSING - REQUIRED]`);
    } else {
      optional.push(name);
      console.log(`⚠️  ${name}: ${description} [MISSING - OPTIONAL]`);
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`✅ Present: ${present.length}`);
  console.log(`❌ Missing (Required): ${missing.length}`);
  console.log(`⚠️  Missing (Optional): ${optional.length}`);
  
  if (missing.length > 0) {
    console.log('\n🚨 CRITICAL: Missing required environment variables:');
    missing.forEach(name => {
      const envVar = envVariables.find(v => v.name === name);
      console.log(`   - ${name}: ${envVar?.description}`);
    });
    
    console.log('\n📝 Next Steps:');
    console.log('1. Create/update your .env.local file with the missing variables');
    console.log('2. Get the required values from your Zoho organization admin');
    console.log('3. For OAuth tokens, use Zoho Developer Console');
    console.log('4. For service IDs, check respective Zoho applications');
    
    return false;
  }
  
  if (optional.length > 0) {
    console.log('\n💡 Optional configurations missing (features may be limited):');
    optional.forEach(name => {
      const envVar = envVariables.find(v => v.name === name);
      console.log(`   - ${name}: ${envVar?.description}`);
    });
  }
  
  console.log('\n✅ All required environment variables are configured!');
  return true;
}

// Export for use as module
export { validateEnvironment };

// Run directly if called as script
if (require.main === module) {
  const isValid = validateEnvironment();
  process.exit(isValid ? 0 : 1);
}