/**
 * Security Headers Configuration
 * Enterprise-grade security headers for production deployment
 */

import { NextResponse } from 'next/server';

export interface SecurityHeadersConfig {
  hsts: {
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  frameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  contentTypeOptions: boolean;
  referrerPolicy: string;
  permissionsPolicy: string[];
  // Enhanced security headers
  crossOriginEmbedderPolicy: boolean;
  crossOriginOpenerPolicy: boolean;
  crossOriginResourcePolicy: 'same-origin' | 'same-site' | 'cross-origin';
}

/**
 * Get default security headers configuration
 */
export function getSecurityHeadersConfig(): SecurityHeadersConfig {
  return {
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    frameOptions: 'DENY',
    contentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()', // Disable FLoC
      'payment=()',
      'usb=()',
      'bluetooth=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'autoplay=()',
      'fullscreen=(self)',
      'picture-in-picture=()',
      'web-share=()'
    ],
    // Enhanced security headers
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: 'same-origin'
  };
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(
  response: NextResponse,
  config: SecurityHeadersConfig,
  isProduction: boolean = false
): NextResponse {
  // HSTS - Only in production with HTTPS
  if (isProduction) {
    const hstsValue = `max-age=${config.hsts.maxAge}${
      config.hsts.includeSubDomains ? '; includeSubDomains' : ''
    }${config.hsts.preload ? '; preload' : ''}`;
    
    response.headers.set('Strict-Transport-Security', hstsValue);
  }

  // X-Frame-Options - Prevent clickjacking
  response.headers.set('X-Frame-Options', config.frameOptions);

  // X-Content-Type-Options - Prevent MIME sniffing
  if (config.contentTypeOptions) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }

  // Referrer-Policy - Control referrer information
  response.headers.set('Referrer-Policy', config.referrerPolicy);

  // Permissions-Policy - Control browser APIs
  if (config.permissionsPolicy.length > 0) {
    response.headers.set('Permissions-Policy', config.permissionsPolicy.join(', '));
  }

  // X-XSS-Protection - Legacy XSS protection (for older browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // X-DNS-Prefetch-Control - Control DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // Cross-Origin-Embedder-Policy - Enhanced security for cross-origin isolation
  if (config.crossOriginEmbedderPolicy) {
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  }

  // Cross-Origin-Opener-Policy - Prevent cross-origin attacks
  if (config.crossOriginOpenerPolicy) {
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  }

  // Cross-Origin-Resource-Policy - Control cross-origin resource sharing
  response.headers.set('Cross-Origin-Resource-Policy', config.crossOriginResourcePolicy);

  // Additional security headers for enhanced protection
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('X-Download-Options', 'noopen');
  
  // Clear-Site-Data header for logout/security actions (conditionally)
  if (isProduction) {
    // This would be set conditionally on logout or security incidents
    // response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  }

  return response;
}

/**
 * Security event logging interface
 */
export interface SecurityEvent {
  type: 'csp_violation' | 'rate_limit' | 'auth_failure' | 'suspicious_request';
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  url?: string;
  details: Record<string, any>;
}

/**
 * Log security events for monitoring
 */
export function logSecurityEvent(event: SecurityEvent): void {
  const logEntry = {
    ...event,
    timestamp: event.timestamp.toISOString(),
    environment: process.env.NODE_ENV
  };

  if (process.env.NODE_ENV === 'development') {
    console.warn('Security Event:', logEntry);
  }

  // In production, send to monitoring service
  // Example: send to analytics, error tracking, or SIEM system
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement production logging
    // - Send to monitoring service
    // - Store in database for analysis
    // - Alert on critical events
  }
}