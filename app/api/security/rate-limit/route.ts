/**
 * Rate Limit Management API
 * Provides rate limit statistics and management for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/admin-auth';
import { 
  getRateLimitStats, 
  getRateLimitViolations, 
  clearRateLimitData 
} from '@/lib/security/rate-limit-monitor';

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'stats';
    const timeframe = searchParams.get('timeframe') || '1h';

    console.log(`🔍 API: ${action} request for timeframe ${timeframe}`);

    switch (action) {
      case 'stats':
        const stats = await getRateLimitStats(timeframe);
        console.log(`📊 API: Returning stats:`, stats);
        return NextResponse.json(stats);

      case 'violations':
        const violations = await getRateLimitViolations(timeframe);
        console.log(`🚨 API: Returning ${violations.length} violations:`, violations);
        return NextResponse.json(violations);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "stats" or "violations"' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Rate limit API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch rate limit data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target') || 'violations';

    await clearRateLimitData(target);

    return NextResponse.json({
      success: true,
      message: `Rate limit ${target} cleared successfully`
    });
  } catch (error) {
    console.error('Rate limit clear error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to clear rate limit data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
