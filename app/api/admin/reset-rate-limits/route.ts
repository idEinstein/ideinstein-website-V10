/**
 * Admin API to reset middleware rate limits
 * This resets the actual rate limits used by the security middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/admin-auth';
import { resetRateLimit, generateRateLimitKey, resetAllRateLimits } from '@/lib/security/rate-limit';

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'all';
    const ip = searchParams.get('ip');
    
    let resetCount = 0;
    
    switch (action) {
      case 'contact':
        // Reset contact form rate limits (consultation, contact, newsletter)
        const contactKey = generateRateLimitKey(request, 'contact');
        resetRateLimit(contactKey);
        resetCount = 1;
        break;
        
      case 'ip':
        if (!ip) {
          return NextResponse.json(
            { error: 'IP address required for IP-specific reset' },
            { status: 400 }
          );
        }
        // Create a mock request to generate the key for the specific IP
        const mockHeaders = new Headers();
        mockHeaders.set('x-forwarded-for', ip);
        const mockRequest = new NextRequest('http://localhost:3000/api/consultation', {
          headers: mockHeaders
        });
        const ipKey = generateRateLimitKey(mockRequest, 'contact');
        resetRateLimit(ipKey);
        resetCount = 1;
        break;
        
      case 'all':
        // Reset all rate limits using the proper reset function
        resetAllRateLimits();
        resetCount = -1; // Indicates all were reset
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "contact", "ip", or "all"' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: resetCount === -1 
        ? 'All rate limits reset successfully'
        : `${resetCount} rate limit(s) reset successfully`,
      action,
      resetCount: resetCount === -1 ? 'all' : resetCount
    });
    
  } catch (error) {
    console.error('Rate limit reset error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to reset rate limits',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

export const GET = withAdminAuth(async (request: NextRequest) => {
  return NextResponse.json({
    message: 'Rate limit reset API',
    actions: {
      'POST ?action=contact': 'Reset contact form rate limits',
      'POST ?action=ip&ip=<ip>': 'Reset rate limits for specific IP',
      'POST ?action=all': 'Reset all rate limits'
    }
  });
});
