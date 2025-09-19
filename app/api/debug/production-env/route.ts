import { NextRequest, NextResponse } from 'next/server';

/**
 * Production Environment Debug Endpoint
 * Helps diagnose environment variable issues in production
 * REMOVE after fixing the authentication issues!
 */
export async function GET(request: NextRequest) {
  // Only show debug info if special header is provided
  const debugAuth = request.headers.get('x-debug-production');
  
  if (debugAuth !== 'debug-env-2024') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const envInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    
    // Check critical environment variables (without exposing values)
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    hasHmacSecret: !!process.env.FORM_HMAC_SECRET,
    
    // Show lengths for verification
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length || 0,
    adminHashLength: process.env.ADMIN_PASSWORD_HASH?.length || 0,
    hmacSecretLength: process.env.FORM_HMAC_SECRET?.length || 0,
    
    // Show first few characters for verification (safe for hashes)
    hashPrefix: process.env.ADMIN_PASSWORD_HASH?.substring(0, 15) || 'none',
    
    // Deployment info
    vercelUrl: process.env.VERCEL_URL,
    vercelEnv: process.env.VERCEL_ENV,
    
    // Runtime info
    runtime: 'nodejs' // This endpoint runs in Node.js runtime
  };

  return NextResponse.json(envInfo);
}

// Ensure Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';