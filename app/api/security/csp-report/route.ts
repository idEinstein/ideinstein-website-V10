/**
 * CSP Violation Reporting Endpoint
 * Receives and logs Content Security Policy violations
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityLogger } from '@/lib/security/logging';
import { CSPReportSchema } from '@/lib/validations/api';
import { validateRequestBody } from '@/lib/middleware/validation';

export async function POST(request: NextRequest) {
  try {
    // Validate CSP report format
    const validation = await validateRequestBody(request, CSPReportSchema);
    if (!validation.success) {
      // For CSP reports, we should still accept malformed reports but log them
      console.warn('Malformed CSP report received:', validation.response);
      
      // Try to parse raw body for logging
      try {
        const rawBody = await request.clone().json();
        securityLogger.logCSPViolation(rawBody, request);
      } catch {
        // If we can't parse it at all, just log the attempt
        securityLogger.logEvent({
          type: 'csp_violation',
          severity: 'low',
          ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
          url: request.url,
          method: request.method,
          details: { error: 'malformed_csp_report' }
        });
      }
      
      return new NextResponse(null, { status: 204 });
    }
    
    // CSP violation reports come in this format
    const violation = validation.data['csp-report'] || validation.data;
    
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