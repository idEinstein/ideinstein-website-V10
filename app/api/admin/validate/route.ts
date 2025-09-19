import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { applyRateLimit, getRateLimitConfig, createRateLimitHeaders } from '@/lib/security/rate-limit';
import { securityLogger } from '@/lib/security/logging';
import { AdminValidateSchema } from '@/lib/validations/api';
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
    // Apply rate limiting for admin authentication
    const rateLimitConfig = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // Only 5 attempts per 15 minutes
      message: 'Too many admin authentication attempts. Please try again later.'
    };
    
    const rateLimitResult = applyRateLimit(request, rateLimitConfig, 'admin_auth');
    
    if (!rateLimitResult.allowed) {
      // Log rate limit violation
      securityLogger.logEvent({
        type: 'rate_limit',
        severity: 'high',
        ip,
        url: request.url,
        method: request.method,
        details: {
          endpoint: 'admin_authentication',
          limit: rateLimitConfig.maxRequests,
          window: rateLimitConfig.windowMs
        }
      });
      
      const headers = createRateLimitHeaders(rateLimitResult);
      return NextResponse.json(
        { success: false, message: rateLimitConfig.message },
        { status: 429, headers }
      );
    }
    
    // Validate request body
    const validation = await validateRequestBody(request, AdminValidateSchema);
    if (!validation.success) {
      securityLogger.logEvent({
        type: 'auth_failure',
        severity: 'medium',
        ip,
        url: request.url,
        method: request.method,
        details: { reason: 'validation_failed', endpoint: 'admin_authentication' }
      });
      
      return validation.response;
    }
    
    const { password } = validation.data;
    
    // Validate password using secure bcrypt comparison or fallback to plain text
    let isValid: boolean;
    if (useHashedPassword) {
      isValid = await bcrypt.compare(password, adminPasswordHash);
    } else {
      // Fallback to plain password comparison for existing setup
      isValid = password === adminPasswordHash;
    }
    
    if (isValid) {
      // Log successful authentication
      console.log('✅ Admin authentication successful from IP:', ip);
      
      const headers = createRateLimitHeaders(rateLimitResult);
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      }, { headers });
    } else {
      // Log failed authentication attempt
      securityLogger.logEvent({
        type: 'auth_failure',
        severity: 'high',
        ip,
        url: request.url,
        method: request.method,
        details: { 
          reason: 'invalid_password', 
          endpoint: 'admin_authentication',
          responseTime: Date.now() - startTime
        }
      });
      
      const headers = createRateLimitHeaders(rateLimitResult);
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401, headers }
      );
    }
  } catch (error) {
    // Log authentication error
    securityLogger.logEvent({
      type: 'auth_failure',
      severity: 'high',
      ip,
      url: request.url,
      method: request.method,
      details: { 
        reason: 'system_error', 
        endpoint: 'admin_authentication',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    
    console.error('Admin validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic';

// Runtime configuration
export const runtime = 'nodejs';

/**
 * Generate a secure password hash for admin authentication
 * Usage: node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_secure_password', 12));"
 * 
 * Set the result as ADMIN_PASSWORD_HASH environment variable
 */