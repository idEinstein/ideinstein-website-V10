import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to check authentication configuration
 * IMPORTANT: Remove this after debugging - it shows sensitive info!
 */
export async function GET(request: NextRequest) {
  // Only allow in development or with special header
  const isDev = process.env.NODE_ENV === 'development';
  const debugHeader = request.headers.get('x-debug-auth');
  
  if (!isDev && debugHeader !== 'debug-2024') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const authInfo = {
    environment: process.env.NODE_ENV,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length || 0,
    hashPrefix: process.env.ADMIN_PASSWORD_HASH?.substring(0, 10) || 'none',
    timestamp: new Date().toISOString(),
    // Show first 3 characters of password (for verification only)
    passwordPreview: process.env.ADMIN_PASSWORD?.substring(0, 3) + '***' || 'none'
  };

  return NextResponse.json(authInfo);
}

export const dynamic = 'force-dynamic';