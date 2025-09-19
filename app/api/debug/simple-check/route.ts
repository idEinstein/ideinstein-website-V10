import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateQueryParams } from '@/lib/middleware/validation';

const DebugCheckQuerySchema = z.object({
  key: z.string().min(1, 'Access key is required')
});

/**
 * Simple authentication check for Vercel production
 * Access via: /api/debug/simple-check?key=check2024
 */
export async function GET(request: NextRequest) {
  // Validate query parameters
  const queryValidation = validateQueryParams(request, DebugCheckQuerySchema);
  if (!queryValidation.success) {
    return queryValidation.response;
  }
  
  const { key } = queryValidation.data;
  
  if (key !== 'check2024') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Simple check without exposing sensitive data
  const info = {
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    
    // Check what's actually configured
    authMethod: process.env.ADMIN_PASSWORD_HASH ? 'hash' : 
                process.env.ADMIN_PASSWORD ? 'password' : 'none',
    
    // Lengths for verification
    hashLength: process.env.ADMIN_PASSWORD_HASH?.length || 0,
    passwordLength: process.env.ADMIN_PASSWORD?.length || 0,
    
    // First few characters of hash for verification
    hashStart: process.env.ADMIN_PASSWORD_HASH?.substring(0, 10) || 'none',
    
    // Deployment info
    deployment: process.env.VERCEL_ENV,
    url: process.env.VERCEL_URL
  };

  return NextResponse.json(info);
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';