/**
 * CSP Violation Reporting Endpoint
 * Receives and logs Content Security Policy violations
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityLogger } from '@/lib/security/logging';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // CSP violation reports come in this format
    const violation = body['csp-report'] || body;
    
    // Log the CSP violation
    securityLogger.logCSPViolation(violation, request);
    
    // Return 204 No Content (standard for CSP reporting)
    return new NextResponse(null, { status: 204 });
    
  } catch (error) {
    console.error('Error processing CSP report:', error);
    
    // Log this as a security event too
    securityLogger.logEvent({
      type: 'middleware_error',
      severity: 'medium',
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      userAgent: request.headers.get('user-agent') || undefined,
      url: request.url,
      method: request.method,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/security/csp-report'
      }
    });
    
    return new NextResponse(null, { status: 204 });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}