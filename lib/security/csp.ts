/**
 * Content Security Policy (CSP) Configuration System
 * Provides dynamic CSP generation with nonce support for enterprise-grade security
 */

import { NextRequest } from 'next/server';

export interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'style-src-attr': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'object-src': string[];
  'base-uri': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'upgrade-insecure-requests'?: boolean;
}

export interface CSPConfig {
  nonce: string;
  directives: CSPDirectives;
  reportUri?: string;
  reportOnly?: boolean;
}

/**
 * Generate a cryptographically secure nonce for CSP
 */
export function generateNonce(): string {
  // Use crypto.randomUUID() and extract first 16 characters for nonce
  return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
}

/**
 * Get environment-specific CSP directives
 */
export function getCSPDirectives(nonce: string, isDevelopment: boolean = false, isAuthRoute: boolean = false): CSPDirectives {
  const baseDirectives: CSPDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      // Allow Google Analytics in production
      ...(isDevelopment ? [] : [
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://analytics.google.com'
      ]),
      // Allow localhost in development
      ...(isDevelopment ? ["'unsafe-eval'", 'localhost:*', 'ws:', 'wss:'] : [])
    ],
    'style-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'unsafe-inline'", // Required for Tailwind CSS
      'https://fonts.googleapis.com'
    ],
    'style-src-attr': [
      // Allow inline styles for NextAuth and other components
      "'unsafe-inline'"
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      // Allow all HTTPS images for flexibility
      ...(isDevelopment ? ['http:'] : [])
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:'
    ],
    'connect-src': [
      "'self'",
      // Allow API connections
      ...(isDevelopment ? ['ws:', 'wss:', 'http:', 'localhost:*'] : []),
      // Analytics connections
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      // Zoho API endpoints - India data center only
      'https://accounts.zoho.in',
      'https://www.zohoapis.in',
      'https://campaigns.zoho.in',
      'https://projectsapi.zoho.in',
      'https://workdrive.zoho.in'
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"], // Prevent clickjacking
    'upgrade-insecure-requests': !isDevelopment // Only in production
  };

  return baseDirectives;
}

/**
 * Build CSP header string from directives
 */
export function buildCSPHeader(directives: CSPDirectives, reportUri?: string): string {
  const cspParts: string[] = [];

  Object.entries(directives).forEach(([directive, values]) => {
    if (directive === 'upgrade-insecure-requests') {
      if (values) {
        cspParts.push('upgrade-insecure-requests');
      }
    } else if (Array.isArray(values) && values.length > 0) {
      cspParts.push(`${directive} ${values.join(' ')}`);
    }
  });

  // Add report-uri if provided
  if (reportUri) {
    cspParts.push(`report-uri ${reportUri}`);
  }

  return cspParts.join('; ');
}

/**
 * Create complete CSP configuration
 */
export function createCSPConfig(request: NextRequest): CSPConfig {
  const nonce = generateNonce();
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check if this is an authentication route
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth') || 
                     request.nextUrl.pathname.startsWith('/auth');
  
  const directives = getCSPDirectives(nonce, isDevelopment, isAuthRoute);

  // Add report-uri for CSP violation reporting
  const reportUri = process.env.CSP_REPORT_URI || '/api/security/csp-report';

  return {
    nonce,
    directives,
    reportUri,
    reportOnly: isDevelopment // Use report-only mode in development
  };
}

/**
 * Log CSP violations (for monitoring)
 */
export function logCSPViolation(violation: any): void {
  // Only log non-style-src-attr violations to reduce noise
  if (violation['violated-directive'] !== 'style-src-attr') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('CSP Violation:', violation);
    }
  }
  
  // In production, you might want to send this to a monitoring service
  // Example: send to analytics or error tracking service
}
