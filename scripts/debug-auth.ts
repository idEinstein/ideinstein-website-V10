#!/usr/bin/env tsx

import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

config({ path: '.env.local' });

async function debugAuth() {
  console.log('🔍 Debug Authentication Setup\n');
  
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  const hardcodedHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.O';
  
  console.log('Environment hash:', envHash?.substring(0, 20) + '...');
  console.log('Hardcoded hash:  ', hardcodedHash.substring(0, 20) + '...');
  console.log('Hashes match:', envHash === hardcodedHash);
  
  console.log('\nTesting password "admin123" against both hashes:');
  
  if (envHash) {
    const envValid = await bcrypt.compare('admin123', envHash);
    console.log(`Environment hash: ${envValid ? '✅ VALID' : '❌ INVALID'}`);
  }
  
  const hardcodedValid = await bcrypt.compare('admin123', hardcodedHash);
  console.log(`Hardcoded hash:   ${hardcodedValid ? '✅ VALID' : '❌ INVALID'}`);
  
  console.log('\n💡 The API is using the hardcoded hash, not the environment variable!');
  console.log('   We need to update the environment hash to match the hardcoded one,');
  console.log('   or update the API to use the correct environment hash.');
}

debugAuth().catch(console.error);