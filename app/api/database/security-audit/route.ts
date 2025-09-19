import { NextRequest, NextResponse } from 'next/server';
import { runDatabaseSecurityAudit } from '@/lib/database/security-audit';
import { withAdminAuth } from '@/lib/auth/admin-auth';

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const audit = await runDatabaseSecurityAudit();
    
    return NextResponse.json({
      audit,
      message: 'Security audit completed successfully'
    });
  } catch (error) {
    console.error('Database security audit error:', error);
    return NextResponse.json(
      { error: 'Failed to run security audit' },
      { status: 500 }
    );
  }
});
// Ensure Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';