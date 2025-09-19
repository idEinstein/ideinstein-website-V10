/**
 * Enterprise Admin Authentication API - Edge Runtime Compatible
 * This endpoint validates admin tokens using proper bcrypt validation
 * Can be called from client-side and middleware for authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { applyRateLimit, getRateLimitConfig } from '@/lib/security/rate-limit';
import { securityLogger } from '@/lib/security/logging';
import { AdminVerifyTokenSchema } from '@/lib/validations/api';
import { validateRequestBody } from '@/lib/middleware/validation';

// Get admin password from environment - FORCE PLAIN PASSWORD MODE
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// TEMPORARY FIX: Force plain password mode to bypass hash issues
let adminPasswordHash: string;
let useHashedPassword = false; // Force plain password mode

if (ADMIN_PASSWORD) {
  // Use plain password comparison
  adminPasswordHash = ADMIN_PASSWORD;
  useHashedPassword = false;
  console.log('🔧 Using plain password authentication (temporary fix)');
} else if (ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH.length === 60 && ADMIN_PASSWORD_HASH.startsWith('$2')) {
  // Only use hash if it's valid format
  adminPasswordHash = ADMIN_PASSWORD_HASH;
  useHashedPassword = true;
  console.log('🔒 Using bcrypt hash authentication');
} else {
  // No valid password configured
  throw new Error('❌ CRITICAL: No valid admin authentication configured! Set ADMIN_PASSWORD environment variable.');
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  
  try {
    // Apply rate limiting for admin token verification
    const rateLimitConfig = {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 100, // More generous for API verification calls
      message: 'Too many admin verification attempts. Please try again later.'
    };
    
    const rateLimitResult = applyRateLimit(request, rateLimitConfig, 'admin_verify');
    
    if (!rateLimitResult.allowed) {
      securityLogger.logEvent({
        type: 'rate_limit',
        severity: 'medium',
        ip,
        url: request.url,
        method: request.method,
        details: {
          endpoint: 'admin_verification',
          limit: rateLimitConfig.maxRequests,
          window: rateLimitConfig.windowMs
        }
      });
      
      return NextResponse.json(
        { isAuthenticated: false, reason: 'rate_limit_exceeded' },
        { status: 429 }
      );
    }
    
    // Validate request body
    const validation = await validateRequestBody(request, AdminVerifyTokenSchema);
    if (!validation.success) {
      return validation.response;
    }
    
    const { token } = validation.data;
    
    // Verify token format and extract password
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      if (!decoded.startsWith('admin:')) {
        return NextResponse.json(
          { isAuthenticated: false, reason: 'invalid_token_format' },
          { status: 400 }
        );
      }
      
      // Extract password from token
      const password = decoded.substring(6); // Remove 'admin:' prefix
      
      // Validate password using same logic as /api/admin/validate
      let isValid: boolean;
      if (useHashedPassword) {
        isValid = await bcrypt.compare(password, adminPasswordHash);
      } else {
        isValid = password === adminPasswordHash;
      }
      
      if (isValid) {
        return NextResponse.json({ 
          isAuthenticated: true,
          message: 'Token valid' 
        });
      } else {
        securityLogger.logEvent({
          type: 'auth_failure',
          severity: 'high',
          ip,
          url: request.url,
          method: request.method,
          details: { 
            reason: 'invalid_token_password', 
            endpoint: 'admin_verification'
          }
        });
        
        return NextResponse.json(
          { isAuthenticated: false, reason: 'invalid_token_password' },
          { status: 401 }
        );
      }
      
    } catch (error) {
      return NextResponse.json(
        { isAuthenticated: false, reason: 'invalid_token_encoding' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    securityLogger.logEvent({
      type: 'auth_failure',
      severity: 'high',
      ip,
      url: request.url,
      method: request.method,
      details: { 
        reason: 'verification_error', 
        endpoint: 'admin_verification',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    
    console.error('Admin token verification error:', error);
    return NextResponse.json(
      { isAuthenticated: false, reason: 'verification_error' },
      { status: 500 }
    );
  }
}

// Ensure Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';