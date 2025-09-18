import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { applyRateLimit, getRateLimitConfig, createRateLimitHeaders } from '@/lib/security/rate-limit';
import { securityLogger } from '@/lib/security/logging';

// Get admin password hash from environment
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Hash the plain password if no hash is provided (development fallback)
let adminPasswordHash: string;
let useHashedPassword = true;

if (ADMIN_PASSWORD_HASH) {
  adminPasswordHash = ADMIN_PASSWORD_HASH;
} else {
  // Fallback to plain password comparison for existing setup
  adminPasswordHash = ADMIN_PASSWORD;
  useHashedPassword = false;
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ SECURITY WARNING: Using unhashed admin password in production! Please upgrade to ADMIN_PASSWORD_HASH.');
  }
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
    
    const { password } = await request.json();
    
    if (!password) {
      securityLogger.logEvent({
        type: 'auth_failure',
        severity: 'medium',
        ip,
        url: request.url,
        method: request.method,
        details: { reason: 'missing_password', endpoint: 'admin_authentication' }
      });
      
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }
    
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