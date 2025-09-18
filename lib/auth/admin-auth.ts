/**
 * Admin Authentication Middleware
 * Provides reusable admin authentication for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/security/rate-limit';
import { securityLogger } from '@/lib/security/logging';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  reason?: string;
  rateLimitExceeded?: boolean;
}

/**
 * Verify admin authentication token from request headers
 */
export function verifyAdminAuth(request: NextRequest): AdminAuthResult {
  try {
    const authHeader = request.headers.get('authorization');
    const adminToken = request.headers.get('x-admin-token');
    
    // Check for admin token in either Authorization header or custom header
    const token = authHeader?.replace('Bearer ', '') || adminToken;
    
    if (!token) {
      return { isAuthenticated: false, reason: 'missing_token' };
    }
    
    // Verify token format (base64 encoded admin credentials)
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      if (!decoded.startsWith('admin:')) {
        return { isAuthenticated: false, reason: 'invalid_token_format' };
      }
      
      // Token is valid format - actual password verification happens in API route
      return { isAuthenticated: true };
    } catch (error) {
      return { isAuthenticated: false, reason: 'invalid_token_encoding' };
    }
  } catch (error) {
    return { isAuthenticated: false, reason: 'verification_error' };
  }
}

/**
 * Higher-order function for protecting admin API routes
 */
export function withAdminAuth<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    try {
      // Apply rate limiting for admin routes
      const rateLimitConfig = {
        windowMs: 5 * 60 * 1000, // 5 minutes
        maxRequests: 50, // 50 requests per 5 minutes (generous for legitimate admin use)
        message: 'Too many admin requests. Please try again later.'
      };
      
      const rateLimitResult = applyRateLimit(request, rateLimitConfig, 'admin_api');
      
      if (!rateLimitResult.allowed) {
        securityLogger.logEvent({
          type: 'rate_limit',
          severity: 'medium',
          ip,
          url: request.url,
          method: request.method,
          details: {
            endpoint: 'admin_api',
            limit: rateLimitConfig.maxRequests
          }
        });
        
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      
      // Verify admin authentication
      const authResult = verifyAdminAuth(request);
      
      if (!authResult.isAuthenticated) {
        securityLogger.logEvent({
          type: 'auth_failure',
          severity: 'high',
          ip,
          url: request.url,
          method: request.method,
          details: {
            endpoint: 'admin_api',
            reason: authResult.reason || 'unknown'
          }
        });
        
        return NextResponse.json(
          { error: 'Admin authentication required' },
          { status: 401 }
        );
      }
      
      // Call the protected handler
      return await handler(request, ...args);
      
    } catch (error) {
      securityLogger.logEvent({
        type: 'middleware_error',
        severity: 'high',
        ip,
        url: request.url,
        method: request.method,
        details: {
          endpoint: 'admin_api',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Verify admin session from client-side storage
 */
export function verifyAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authToken = localStorage.getItem('admin_auth_token');
    const authExpiry = localStorage.getItem('admin_auth_expiry');
    
    if (!authToken || !authExpiry) return false;
    
    const expiryTime = parseInt(authExpiry);
    if (Date.now() >= expiryTime) {
      // Token expired, clean up
      localStorage.removeItem('admin_auth_token');
      localStorage.removeItem('admin_auth_expiry');
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Clear admin session
 */
export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('admin_auth_token');
  localStorage.removeItem('admin_auth_expiry');
}