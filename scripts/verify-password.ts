#!/usr/bin/env tsx

import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

config({ path: '.env.local' });

async function verifyPassword() {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!hash) {
    console.log('❌ No ADMIN_PASSWORD_HASH found');
    return;
  }

  console.log('🔍 Testing passwords against current hash...\n');
  
  const testPasswords = ['admin123', 'admin', 'password', 'ideinstein'];
  
  for (const password of testPasswords) {
    const isValid = await bcrypt.compare(password, hash);
    console.log(`   "${password}": ${isValid ? '✅ MATCH' : '❌ No match'}`);
  }
  
  console.log('\n💡 If none match, let\'s create a new hash for "admin123":');
  const newHash = await bcrypt.hash('admin123', 12);
  console.log(`   New hash: ${newHash}`);
}

verifyPassword().catch(console.error);